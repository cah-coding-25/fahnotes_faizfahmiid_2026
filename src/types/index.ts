export type SupportedImageType =
  | 'image/png'
  | 'image/jpeg'
  | 'image/webp'
  | 'image/bmp'
  | 'image/gif'
  | 'image/svg+xml'
  | 'image/tiff';

export interface ExtractedAsset {
  id: string;
  originalName: string;
  layerName: string;
  path: string;
  folder: string;
  size: number;
  extension: string;
  mimeType?: string;
  blob: Blob;
  previewUrl: string;
  width: number;
  height: number;
  selected: boolean;
  order?: number;
}

export interface UnsupportedFile {
  path: string;
  name: string;
  size: number;
  reason: string;
}

export type CanvasSizeMode = 'auto_max' | 'preset' | 'custom' | 'grid_sheet';

export interface CanvasPreset {
  id: string;
  name: string;
  category: 'Social' | 'Print' | 'Screen' | 'Banner';
  width: number;
  height: number;
  dpi: number;
}

export type LayerGroupingMode = 'preserve_folders' | 'all_in_one' | 'flat';
export type LayerFitMode = 'original_center' | 'fit' | 'fill' | 'stretch';
export type BackgroundMode = 'transparent' | 'white' | 'black' | 'custom';
export type ColorMode = 'rgb' | 'cmyk_preview';

export interface ConversionConfig {
  canvasMode: CanvasSizeMode;
  customWidth: number;
  customHeight: number;
  presetId: string;
  dpi: number;
  colorMode: ColorMode;
  groupingMode: LayerGroupingMode;
  fitMode: LayerFitMode;
  backgroundMode: BackgroundMode;
  customBgColor: string;
  padding: number;
  gridColumns: number;
  outputFilename: string;
  includeBackgroundLayer: boolean;
}

export type ConversionStage =
  | 'idle'
  | 'extracting'
  | 'resizing'
  | 'structuring'
  | 'finalizing'
  | 'completed'
  | 'error';

export interface ProgressState {
  stage: ConversionStage;
  stageName: string;
  currentStep: number;
  totalSteps: number;
  percentage: number;
  currentFileName?: string;
  details: string;
  logs: string[];
}

export type ProgressCallback = (progress: ProgressState) => void;

export interface PsdLayerNode {
  id: string;
  name: string;
  type: 'layer' | 'group';
  visible: boolean;
  opacity?: number;
  blendMode?: string;
  dimensions?: { width: number; height: number };
  children?: PsdLayerNode[];
}

export interface ConversionResult {
  psdBlob: Blob;
  psdDownloadUrl: string;
  compositePreviewUrl: string;
  filename: string;
  dimensions: {
    width: number;
    height: number;
    dpi: number;
  };
  totalLayers: number;
  totalGroups: number;
  fileSizeBytes: number;
  layerTree: PsdLayerNode[];
}

export interface ZipAnalysisResult {
  totalFiles: number;
  supportedImages: ExtractedAsset[];
  unsupportedFiles: UnsupportedFile[];
  folders: string[];
  zipName: string;
  totalSizeBytes: number;
}
