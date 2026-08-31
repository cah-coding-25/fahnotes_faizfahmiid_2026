import { writePsd, Psd, Layer } from 'ag-psd';
import {
  ConversionConfig,
  ConversionResult,
  ExtractedAsset,
  PsdLayerNode,
  ProgressCallback,
} from '../types';
import { CANVAS_PRESETS } from './presets';

export async function convertZipAssetsToPsd(
  assets: ExtractedAsset[],
  config: ConversionConfig,
  onProgress?: ProgressCallback
): Promise<ConversionResult> {
  const selectedAssets = assets.filter((a) => a.selected);
  if (selectedAssets.length === 0) {
    throw new Error('Pilih setidaknya satu file gambar untuk dikonversi menjadi PSD.');
  }

  const logs: string[] = [];
  const log = (msg: string) => {
    logs.push(`[${new Date().toLocaleTimeString('id-ID')}] ${msg}`);
  };

  const updateProgress = (
    stage: 'extracting' | 'resizing' | 'structuring' | 'finalizing' | 'completed',
    stageName: string,
    currentStep: number,
    totalSteps: number,
    details: string
  ) => {
    log(details);
    if (onProgress) {
      onProgress({
        stage,
        stageName,
        currentStep,
        totalSteps,
        percentage: Math.round((currentStep / totalSteps) * 100),
        details,
        logs: [...logs],
      });
    }
  };

  // Langkah 1: Hitung Dimensi Kanvas
  updateProgress('extracting', 'Menghitung Dimensi Kanvas', 1, 5, `Menghitung ukuran kanvas berdasarkan ${selectedAssets.length} aset terpilih...`);

  let canvasWidth = 1920;
  let canvasHeight = 1080;

  if (config.canvasMode === 'auto_max') {
    let maxWidth = 0;
    let maxHeight = 0;
    for (const asset of selectedAssets) {
      if (asset.width > maxWidth) maxWidth = asset.width;
      if (asset.height > maxHeight) maxHeight = asset.height;
    }
    canvasWidth = Math.max(maxWidth, 100);
    canvasHeight = Math.max(maxHeight, 100);
    log(`Dimensi Kanvas Otomatis: ${canvasWidth} × ${canvasHeight} px`);
  } else if (config.canvasMode === 'preset') {
    const preset = CANVAS_PRESETS.find((p) => p.id === config.presetId);
    if (preset) {
      canvasWidth = preset.width;
      canvasHeight = preset.height;
      log(`Preset Kanvas: ${preset.name} (${canvasWidth} × ${canvasHeight} px)`);
    }
  } else if (config.canvasMode === 'custom') {
    canvasWidth = Math.max(Number(config.customWidth) || 1920, 50);
    canvasHeight = Math.max(Number(config.customHeight) || 1080, 50);
    log(`Dimensi Kanvas Kustom: ${canvasWidth} × ${canvasHeight} px`);
  } else if (config.canvasMode === 'grid_sheet') {
    const cols = Math.max(config.gridColumns || 3, 1);
    const rows = Math.ceil(selectedAssets.length / cols);
    const pad = Number(config.padding) || 40;

    let maxCellW = 0;
    let maxCellH = 0;
    for (const asset of selectedAssets) {
      if (asset.width > maxCellW) maxCellW = asset.width;
      if (asset.height > maxCellH) maxCellH = asset.height;
    }
    maxCellW = Math.max(maxCellW, 200);
    maxCellH = Math.max(maxCellH, 200);

    canvasWidth = cols * maxCellW + (cols + 1) * pad;
    canvasHeight = rows * maxCellH + (rows + 1) * pad;
    log(`Matriks Grid: ${cols} kolom × ${rows} baris (${canvasWidth} × ${canvasHeight} px)`);
  }

  // Langkah 2: Rasterisasi Tiap Gambar ke Canvas
  updateProgress('resizing', 'Me-rasterisasi Gambar', 2, 5, `Memproses ${selectedAssets.length} layer aset...`);

  type PreparedLayer = {
    asset: ExtractedAsset;
    canvas: HTMLCanvasElement;
    left: number;
    top: number;
    width: number;
    height: number;
  };

  const preparedLayers: PreparedLayer[] = [];

  for (let i = 0; i < selectedAssets.length; i++) {
    const asset = selectedAssets[i];
    updateProgress(
      'resizing',
      'Me-rasterisasi Gambar',
      2,
      5,
      `Memproses layer (${i + 1}/${selectedAssets.length}): ${asset.originalName}`
    );

    const img = await loadImageElement(asset.previewUrl);
    const layerCanvas = document.createElement('canvas');

    let drawX = 0;
    let drawY = 0;
    let drawW = asset.width;
    let drawH = asset.height;

    if (config.canvasMode === 'grid_sheet') {
      const cols = Math.max(config.gridColumns || 3, 1);
      const pad = Number(config.padding) || 40;
      const colIndex = i % cols;
      const rowIndex = Math.floor(i / cols);

      let maxCellW = 0;
      let maxCellH = 0;
      for (const a of selectedAssets) {
        if (a.width > maxCellW) maxCellW = a.width;
        if (a.height > maxCellH) maxCellH = a.height;
      }
      maxCellW = Math.max(maxCellW, 200);
      maxCellH = Math.max(maxCellH, 200);

      const cellX = pad + colIndex * (maxCellW + pad);
      const cellY = pad + rowIndex * (maxCellH + pad);

      const fitDims = calculateFittedDimensions(asset.width, asset.height, maxCellW, maxCellH, 'fit');
      drawW = fitDims.width;
      drawH = fitDims.height;
      drawX = cellX + Math.round((maxCellW - drawW) / 2);
      drawY = cellY + Math.round((maxCellH - drawH) / 2);

      layerCanvas.width = drawW;
      layerCanvas.height = drawH;
      const ctx = layerCanvas.getContext('2d', { willReadFrequently: true });
      if (ctx) {
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, drawW, drawH);
      }
    } else {
      if (config.fitMode === 'original_center') {
        drawW = asset.width;
        drawH = asset.height;
        drawX = Math.round((canvasWidth - drawW) / 2);
        drawY = Math.round((canvasHeight - drawH) / 2);

        layerCanvas.width = drawW;
        layerCanvas.height = drawH;
        const ctx = layerCanvas.getContext('2d', { willReadFrequently: true });
        if (ctx) {
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(img, 0, 0, drawW, drawH);
        }
      } else if (config.fitMode === 'fit' || config.fitMode === 'fill' || config.fitMode === 'stretch') {
        const fitDims = calculateFittedDimensions(asset.width, asset.height, canvasWidth, canvasHeight, config.fitMode);
        drawW = fitDims.width;
        drawH = fitDims.height;
        drawX = Math.round((canvasWidth - drawW) / 2);
        drawY = Math.round((canvasHeight - drawH) / 2);

        layerCanvas.width = drawW;
        layerCanvas.height = drawH;
        const ctx = layerCanvas.getContext('2d', { willReadFrequently: true });
        if (ctx) {
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(img, 0, 0, drawW, drawH);
        }
      }
    }

    preparedLayers.push({
      asset,
      canvas: layerCanvas,
      left: drawX,
      top: drawY,
      width: drawW,
      height: drawH,
    });
  }

  // Langkah 3: Susun Struktur Hierarki Layer Adobe Photoshop
  updateProgress('structuring', 'Menyusun Hierarki Layer PSD', 3, 5, 'Menyusun struktur grup folder dan layer Photoshop...');

  const rootPsdLayers: Layer[] = [];
  const previewLayerTree: PsdLayerNode[] = [];

  // Latar Belakang (Background Layer)
  if (config.includeBackgroundLayer && config.backgroundMode !== 'transparent') {
    const bgCanvas = document.createElement('canvas');
    bgCanvas.width = canvasWidth;
    bgCanvas.height = canvasHeight;
    const bgCtx = bgCanvas.getContext('2d');
    if (bgCtx) {
      bgCtx.fillStyle = config.backgroundMode === 'white' ? '#FFFFFF' : config.backgroundMode === 'black' ? '#000000' : config.customBgColor;
      bgCtx.fillRect(0, 0, canvasWidth, canvasHeight);
    }

    const bgLayer: Layer = {
      name: 'Background',
      canvas: bgCanvas,
      left: 0,
      top: 0,
      opacity: 1,
      hidden: false,
      blendMode: 'normal',
    };

    rootPsdLayers.push(bgLayer);

    previewLayerTree.push({
      id: 'bg-layer',
      name: 'Background',
      type: 'layer',
      visible: true,
      opacity: 100,
      blendMode: 'normal',
      dimensions: { width: canvasWidth, height: canvasHeight },
    });
  }

  if (config.groupingMode === 'flat') {
    for (const prep of preparedLayers) {
      const psdLayer: Layer = {
        name: prep.asset.layerName,
        canvas: prep.canvas,
        left: prep.left,
        top: prep.top,
        opacity: 1,
        hidden: false,
        blendMode: 'normal',
      };
      rootPsdLayers.push(psdLayer);

      previewLayerTree.push({
        id: prep.asset.id,
        name: prep.asset.layerName,
        type: 'layer',
        visible: true,
        opacity: 100,
        blendMode: 'normal',
        dimensions: { width: prep.width, height: prep.height },
      });
    }
  } else if (config.groupingMode === 'all_in_one') {
    const groupChildren: Layer[] = [];
    const groupNodeChildren: PsdLayerNode[] = [];

    for (const prep of preparedLayers) {
      groupChildren.push({
        name: prep.asset.layerName,
        canvas: prep.canvas,
        left: prep.left,
        top: prep.top,
        opacity: 1,
        hidden: false,
        blendMode: 'normal',
      });

      groupNodeChildren.push({
        id: prep.asset.id,
        name: prep.asset.layerName,
        type: 'layer',
        visible: true,
        opacity: 100,
        blendMode: 'normal',
        dimensions: { width: prep.width, height: prep.height },
      });
    }

    rootPsdLayers.push({
      name: 'ZIP Assets',
      children: groupChildren,
      opened: true,
      hidden: false,
      blendMode: 'pass through',
    });

    previewLayerTree.push({
      id: 'group-all',
      name: 'ZIP Assets',
      type: 'group',
      visible: true,
      children: groupNodeChildren,
    });
  } else {
    // preserve_folders
    const folderMap = new Map<string, PreparedLayer[]>();
    const rootAssets: PreparedLayer[] = [];

    for (const prep of preparedLayers) {
      if (prep.asset.folder) {
        if (!folderMap.has(prep.asset.folder)) {
          folderMap.set(prep.asset.folder, []);
        }
        folderMap.get(prep.asset.folder)!.push(prep);
      } else {
        rootAssets.push(prep);
      }
    }

    // Proses grup subfolder
    for (const [folderName, items] of folderMap.entries()) {
      const groupChildren: Layer[] = items.map((prep) => ({
        name: prep.asset.layerName,
        canvas: prep.canvas,
        left: prep.left,
        top: prep.top,
        opacity: 1,
        hidden: false,
        blendMode: 'normal',
      }));

      const groupNodeChildren: PsdLayerNode[] = items.map((prep) => ({
        id: prep.asset.id,
        name: prep.asset.layerName,
        type: 'layer',
        visible: true,
        opacity: 100,
        blendMode: 'normal',
        dimensions: { width: prep.width, height: prep.height },
      }));

      rootPsdLayers.push({
        name: folderName,
        children: groupChildren,
        opened: true,
        hidden: false,
        blendMode: 'pass through',
      });

      previewLayerTree.push({
        id: `folder-${folderName}`,
        name: folderName,
        type: 'group',
        visible: true,
        children: groupNodeChildren,
      });
    }

    // Layer di level root
    for (const prep of rootAssets) {
      rootPsdLayers.push({
        name: prep.asset.layerName,
        canvas: prep.canvas,
        left: prep.left,
        top: prep.top,
        opacity: 1,
        hidden: false,
        blendMode: 'normal',
      });

      previewLayerTree.push({
        id: prep.asset.id,
        name: prep.asset.layerName,
        type: 'layer',
        visible: true,
        opacity: 100,
        blendMode: 'normal',
        dimensions: { width: prep.width, height: prep.height },
      });
    }
  }

  // Langkah 4: Render Kanvas Komposit
  updateProgress('finalizing', 'Membuat Pratinjau Komposit', 4, 5, 'Merender kanvas pratinjau keseluruhan...');

  const compositeCanvas = document.createElement('canvas');
  compositeCanvas.width = canvasWidth;
  compositeCanvas.height = canvasHeight;
  const compositeCtx = compositeCanvas.getContext('2d');

  if (compositeCtx) {
    if (config.includeBackgroundLayer && config.backgroundMode !== 'transparent') {
      compositeCtx.fillStyle =
        config.backgroundMode === 'white' ? '#FFFFFF' : config.backgroundMode === 'black' ? '#000000' : config.customBgColor;
      compositeCtx.fillRect(0, 0, canvasWidth, canvasHeight);
    }

    for (const prep of preparedLayers) {
      compositeCtx.drawImage(prep.canvas, prep.left, prep.top, prep.width, prep.height);
    }
  }

  const compositePreviewUrl = compositeCanvas.toDataURL('image/png');

  // Langkah 5: Encode Biner PSD Menggunakan ag-psd
  updateProgress('finalizing', 'Menyimpan Dokumen PSD', 5, 5, 'Mengenkode format biner Adobe Photoshop PSD...');

  const selectedDpi = Number(config.dpi) || 300;

  const psdDocument: Psd = {
    width: canvasWidth,
    height: canvasHeight,
    bitsPerChannel: 8,
    colorMode: 3, // ColorMode.RGB
    children: rootPsdLayers,
    canvas: compositeCanvas,
    imageResources: {
      resolutionInfo: {
        horizontalResolution: selectedDpi,
        horizontalResolutionUnit: 'PPI',
        widthUnit: 'Inches',
        verticalResolution: selectedDpi,
        verticalResolutionUnit: 'PPI',
        heightUnit: 'Inches',
      },
    },
  };

  const psdArrayBuffer = writePsd(psdDocument, {});
  const psdBlob = new Blob([psdArrayBuffer], { type: 'image/vnd.adobe.photoshop' });
  const psdDownloadUrl = URL.createObjectURL(psdBlob);

  let finalFilename = config.outputFilename.trim();
  if (!finalFilename.toLowerCase().endsWith('.psd')) {
    finalFilename += '.psd';
  }

  updateProgress('completed', 'Selesai!', 5, 5, `PSD berhasil dibuat (${(psdBlob.size / (1024 * 1024)).toFixed(2)} MB)`);

  return {
    psdBlob,
    psdDownloadUrl,
    compositePreviewUrl,
    filename: finalFilename,
    dimensions: {
      width: canvasWidth,
      height: canvasHeight,
      dpi: selectedDpi,
    },
    totalLayers: selectedAssets.length + (config.includeBackgroundLayer && config.backgroundMode !== 'transparent' ? 1 : 0),
    totalGroups:
      config.groupingMode === 'all_in_one'
        ? 1
        : config.groupingMode === 'preserve_folders'
        ? new Set(selectedAssets.map((a) => a.folder).filter(Boolean)).size
        : 0,
    fileSizeBytes: psdBlob.size,
    layerTree: previewLayerTree,
  };
}

function calculateFittedDimensions(
  srcW: number,
  srcH: number,
  maxW: number,
  maxH: number,
  mode: 'fit' | 'fill' | 'stretch' | 'original_center'
): { width: number; height: number } {
  if (mode === 'stretch') {
    return { width: maxW, height: maxH };
  }

  if (mode === 'fill') {
    const scale = Math.max(maxW / srcW, maxH / srcH);
    return { width: Math.round(srcW * scale), height: Math.round(srcH * scale) };
  }

  // fit
  const scale = Math.min(maxW / srcW, maxH / srcH, 1);
  return {
    width: Math.max(Math.round(srcW * scale), 1),
    height: Math.max(Math.round(srcH * scale), 1),
  };
}

function loadImageElement(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Gagal merender gambar ke layer canvas.'));
    img.src = url;
  });
}
