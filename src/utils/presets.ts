import { CanvasPreset } from '../types';

export const CANVAS_PRESETS: CanvasPreset[] = [
  { id: 'ig-square', name: 'Instagram Persegi (1080 × 1080)', category: 'Social', width: 1080, height: 1080, dpi: 72 },
  { id: 'ig-portrait', name: 'Instagram Potret (1080 × 1350)', category: 'Social', width: 1080, height: 1350, dpi: 72 },
  { id: 'ig-story', name: 'Story / Reel / TikTok (1080 × 1920)', category: 'Social', width: 1080, height: 1920, dpi: 72 },
  { id: 'fhd', name: 'Layar Full HD (1920 × 1080)', category: 'Screen', width: 1920, height: 1080, dpi: 72 },
  { id: '2k-qhd', name: 'Layar 2K QHD (2560 × 1440)', category: 'Screen', width: 2560, height: 1440, dpi: 72 },
  { id: '4k-uhd', name: 'Layar 4K Ultra HD (3840 × 2160)', category: 'Screen', width: 3840, height: 2160, dpi: 72 },
  { id: 'banner-web', name: 'Banner Web / OpenGraph (1200 × 630)', category: 'Banner', width: 1200, height: 630, dpi: 72 },
  { id: 'yt-thumb', name: 'Thumbnail YouTube (1280 × 720)', category: 'Banner', width: 1280, height: 720, dpi: 72 },
  { id: 'a4-300', name: 'Cetak A4 (2480 × 3508 @ 300 DPI)', category: 'Print', width: 2480, height: 3508, dpi: 300 },
  { id: 'a3-300', name: 'Poster A3 (3508 × 4960 @ 300 DPI)', category: 'Print', width: 3508, height: 4960, dpi: 300 },
  { id: 'us-letter', name: 'Cetak Surat / Letter (2550 × 3300 @ 300 DPI)', category: 'Print', width: 2550, height: 3300, dpi: 300 },
  { id: 'business-card', name: 'Kartu Nama (1050 × 600 @ 300 DPI)', category: 'Print', width: 1050, height: 600, dpi: 300 },
];

export const DEFAULT_CONFIG = {
  canvasMode: 'auto_max' as const,
  customWidth: 1920,
  customHeight: 1080,
  presetId: 'fhd',
  dpi: 300,
  colorMode: 'rgb' as const,
  groupingMode: 'preserve_folders' as const,
  fitMode: 'fit' as const,
  backgroundMode: 'transparent' as const,
  customBgColor: '#FFFFFF',
  padding: 0,
  gridColumns: 3,
  outputFilename: 'converted_by_faiz_fahmi_id.psd',
  includeBackgroundLayer: true,
};
