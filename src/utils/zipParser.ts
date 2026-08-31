import JSZip from 'jszip';
import { ExtractedAsset, UnsupportedFile, ZipAnalysisResult } from '../types';

// Supported image extensions
const SUPPORTED_IMAGE_EXTENSIONS = new Set([
  'png',
  'jpg',
  'jpeg',
  'webp',
  'svg',
  'bmp',
  'gif',
  'tiff',
  'tif',
]);

export async function parseZipArchive(file: File): Promise<ZipAnalysisResult> {
  let zip: JSZip;
  try {
    const arrayBuffer = await file.arrayBuffer();
    zip = await JSZip.loadAsync(arrayBuffer);
  } catch (err) {
    throw new Error(
      'Gagal membaca file ZIP. Pastikan file berformat arsip ZIP yang valid dan tidak rusak.'
    );
  }

  const supportedImages: ExtractedAsset[] = [];
  const unsupportedFiles: UnsupportedFile[] = [];
  const folderSet = new Set<string>();

  const entries = Object.values(zip.files);
  if (entries.length === 0) {
    throw new Error('Arsip ZIP ini kosong. Harap unggah ZIP yang berisi file gambar.');
  }

  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i];

    // Ignore directory entries and hidden/system files (__MACOSX, .DS_Store, Thumbs.db)
    if (entry.dir) continue;
    if (entry.name.startsWith('__MACOSX/') || entry.name.includes('/.DS_Store') || entry.name === '.DS_Store' || entry.name.endsWith('Thumbs.db')) {
      continue;
    }

    const fullPath = entry.name;
    const parts = fullPath.split('/');
    const fileName = parts[parts.length - 1];
    const folderPath = parts.length > 1 ? parts.slice(0, -1).join('/') : '';

    if (folderPath) {
      folderSet.add(folderPath);
    }

    const extMatch = fileName.match(/\.([^.]+)$/);
    const extension = extMatch ? extMatch[1].toLowerCase() : '';

    if (SUPPORTED_IMAGE_EXTENSIONS.has(extension)) {
      try {
        const blob = await entry.async('blob');
        const mimeType = getMimeType(extension);
        const typedBlob = new Blob([blob], { type: mimeType });
        const previewUrl = URL.createObjectURL(typedBlob);

        // Calculate natural image dimensions
        const { width, height } = await getImageDimensions(previewUrl);

        // Clean layer name without extension
        const layerName = fileName.replace(/\.[^/.]+$/, '');

        supportedImages.push({
          id: `asset-${i}-${Math.random().toString(36).substr(2, 6)}`,
          originalName: fileName,
          layerName: layerName,
          path: fullPath,
          folder: folderPath,
          size: (entry as any)._data?.uncompressedSize || blob.size,
          extension,
          previewUrl,
          blob: typedBlob,
          width,
          height,
          selected: true,
        });
      } catch (e) {
        unsupportedFiles.push({
          path: fullPath,
          name: fileName,
          size: (entry as any)._data?.uncompressedSize || 0,
          reason: 'Gambar rusak atau tidak dapat diuraikan.',
        });
      }
    } else {
      unsupportedFiles.push({
        path: fullPath,
        name: fileName,
        size: (entry as any)._data?.uncompressedSize || 0,
        reason: extension ? `Format (.${extension}) tidak didukung` : 'File tidak memiliki ekstensi gambar yang valid',
      });
    }
  }

  if (supportedImages.length === 0) {
    throw new Error(
      'Tidak ditemukan gambar yang kompatibel di dalam file ZIP. Format yang didukung: PNG, JPG, JPEG, WEBP, SVG, BMP, GIF, TIFF.'
    );
  }

  // Sort images naturally by folder then filename
  supportedImages.sort((a, b) => {
    if (a.folder !== b.folder) return a.folder.localeCompare(b.folder);
    return a.originalName.localeCompare(b.originalName, undefined, { numeric: true, sensitivity: 'base' });
  });

  return {
    totalFiles: entries.filter((e) => !e.dir).length,
    supportedImages,
    unsupportedFiles,
    folders: Array.from(folderSet).sort(),
    zipName: file.name,
    totalSizeBytes: file.size,
  };
}

function getMimeType(ext: string): string {
  switch (ext) {
    case 'png': return 'image/png';
    case 'jpg':
    case 'jpeg': return 'image/jpeg';
    case 'webp': return 'image/webp';
    case 'svg': return 'image/svg+xml';
    case 'bmp': return 'image/bmp';
    case 'gif': return 'image/gif';
    case 'tiff':
    case 'tif': return 'image/tiff';
    default: return 'application/octet-stream';
  }
}

function getImageDimensions(url: string): Promise<{ width: number; height: number }> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      resolve({
        width: img.naturalWidth || 800,
        height: img.naturalHeight || 600,
      });
    };
    img.onerror = () => {
      resolve({ width: 800, height: 600 });
    };
    img.src = url;
  });
}
