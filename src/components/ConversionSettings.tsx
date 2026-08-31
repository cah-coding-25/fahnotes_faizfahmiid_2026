import React from 'react';
import {
  ConversionConfig,
  ExtractedAsset,
} from '../types';
import { CANVAS_PRESETS } from '../utils/presets';
import {
  Sliders,
  Maximize,
  FolderTree,
  Image,
  Palette,
  FileCode,
  ArrowRight,
  Printer,
  Sparkles,
} from 'lucide-react';

interface ConversionSettingsProps {
  config: ConversionConfig;
  onChangeConfig: (newConfig: Partial<ConversionConfig>) => void;
  onStartConversion: () => void;
  selectedAssetCount: number;
  totalAssetCount: number;
  assets: ExtractedAsset[];
}

export const ConversionSettings: React.FC<ConversionSettingsProps> = ({
  config,
  onChangeConfig,
  onStartConversion,
  selectedAssetCount,
  totalAssetCount,
}) => {
  return (
    <div className="rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm p-4 sm:p-6 space-y-6 transition-colors">
      
      {/* Header Pengaturan */}
      <div className="flex items-center gap-2.5 pb-4 border-b border-neutral-200 dark:border-neutral-800">
        <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
          <Sliders className="w-4 h-4" />
        </div>
        <div>
          <h2 className="text-base sm:text-lg font-bold text-neutral-900 dark:text-white">
            Pengaturan Dokumen Photoshop (PSD)
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            Sesuaikan ukuran kanvas, struktur layer, resolusi cetak, dan latar belakang
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Kolom Kiri: Dimensi Kanvas & Resolusi */}
        <div className="space-y-4">
          <div>
            <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-2">
              <Maximize className="w-3.5 h-3.5 text-blue-500" />
              <span>Ukuran Kanvas</span>
            </label>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'auto_max', label: 'Otomatis', desc: 'Gambar Terbesar' },
                { id: 'preset', label: 'Preset', desc: 'Sosial / Cetak' },
                { id: 'custom', label: 'Kustom', desc: 'P × L Manual' },
                { id: 'grid_sheet', label: 'Matriks Grid', desc: 'Lembar Kontak' },
              ].map((mode) => (
                <button
                  key={mode.id}
                  type="button"
                  onClick={() => onChangeConfig({ canvasMode: mode.id as any })}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    config.canvasMode === mode.id
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 ring-1 ring-blue-500'
                      : 'border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300'
                  }`}
                >
                  <p className="text-xs font-bold leading-tight">{mode.label}</p>
                  <p className="text-[10px] text-neutral-500 dark:text-neutral-400 mt-0.5 truncate">{mode.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Sub-pilihan Canvas Berdasarkan Mode */}
          {config.canvasMode === 'preset' && (
            <div>
              <label className="text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-1.5 block">
                Pilih Ukuran Standar:
              </label>
              <select
                value={config.presetId}
                onChange={(e) => onChangeConfig({ presetId: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl text-xs sm:text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {CANVAS_PRESETS.map((preset) => (
                  <option key={preset.id} value={preset.id}>
                    [{preset.category}] {preset.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {config.canvasMode === 'custom' && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-1 block">
                  Lebar (px):
                </label>
                <input
                  type="number"
                  value={config.customWidth}
                  onChange={(e) => onChangeConfig({ customWidth: parseInt(e.target.value) || 100 })}
                  className="w-full px-3 py-2 rounded-xl text-xs sm:text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-1 block">
                  Tinggi (px):
                </label>
                <input
                  type="number"
                  value={config.customHeight}
                  onChange={(e) => onChangeConfig({ customHeight: parseInt(e.target.value) || 100 })}
                  className="w-full px-3 py-2 rounded-xl text-xs sm:text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          )}

          {config.canvasMode === 'grid_sheet' && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-1 block">
                  Jumlah Kolom:
                </label>
                <input
                  type="number"
                  min={1}
                  max={12}
                  value={config.gridColumns}
                  onChange={(e) => onChangeConfig({ gridColumns: Math.max(1, parseInt(e.target.value) || 1) })}
                  className="w-full px-3 py-2 rounded-xl text-xs sm:text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-1 block">
                  Jarak / Padding (px):
                </label>
                <input
                  type="number"
                  value={config.padding}
                  onChange={(e) => onChangeConfig({ padding: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 rounded-xl text-xs sm:text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          )}

          {/* Resolusi DPI / PPI */}
          <div>
            <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-2">
              <Printer className="w-3.5 h-3.5 text-blue-500" />
              <span>Resolusi Dokumen (DPI)</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { dpi: 300, label: '300 DPI', desc: 'Standar Cetak HD' },
                { dpi: 150, label: '150 DPI', desc: 'Tampilan Layar' },
                { dpi: 72, label: '72 DPI', desc: 'Web & Digital' },
              ].map((item) => (
                <button
                  key={item.dpi}
                  type="button"
                  onClick={() => onChangeConfig({ dpi: item.dpi as any })}
                  className={`p-2 rounded-xl border text-center transition-all ${
                    config.dpi === item.dpi
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 ring-1 ring-blue-500 font-bold'
                      : 'border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-400'
                  }`}
                >
                  <p className="text-xs">{item.label}</p>
                  <p className="text-[10px] text-neutral-500 dark:text-neutral-400">{item.desc}</p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Kolom Kanan: Struktur Layer & Latar Belakang */}
        <div className="space-y-4">
          {/* Struktur Layer & Grup */}
          <div>
            <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-2">
              <FolderTree className="w-3.5 h-3.5 text-blue-500" />
              <span>Pengelompokan Layer PSD</span>
            </label>

            <div className="space-y-2">
              {[
                {
                  id: 'preserve_folders',
                  label: 'Pertahankan Folder ZIP sebagai Grup PSD',
                  desc: 'Subfolder di dalam ZIP otomatis menjadi folder grup Photoshop',
                },
                {
                  id: 'all_in_one',
                  label: 'Semua Gambar Dalam 1 Folder Master',
                  desc: 'Seluruh layer dikemas rapi dalam satu grup "ZIP Assets"',
                },
                {
                  id: 'flat',
                  label: 'Satu Layer per Gambar (Rata / Tanpa Grup)',
                  desc: 'Semua layer langsung berada di level utama tanpa folder',
                },
              ].map((grp) => (
                <div
                  key={grp.id}
                  onClick={() => onChangeConfig({ groupingMode: grp.id as any })}
                  className={`p-3 rounded-xl border cursor-pointer transition-all flex items-start gap-2.5 ${
                    config.groupingMode === grp.id
                      ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/30 text-neutral-900 dark:text-white ring-1 ring-blue-500'
                      : 'border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300'
                  }`}
                >
                  <input
                    type="radio"
                    checked={config.groupingMode === grp.id}
                    onChange={() => onChangeConfig({ groupingMode: grp.id as any })}
                    className="mt-0.5 text-blue-600 focus:ring-blue-500"
                  />
                  <div>
                    <p className="text-xs font-bold">{grp.label}</p>
                    <p className="text-[11px] text-neutral-500 dark:text-neutral-400">{grp.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Posisi & Fitting Gambar */}
          {config.canvasMode !== 'grid_sheet' && (
            <div>
              <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-2">
                <Image className="w-3.5 h-3.5 text-blue-500" />
                <span>Skala Penempatan Gambar</span>
              </label>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'fit', label: 'Fit (Proporsional)' },
                  { id: 'fill', label: 'Fill (Penuhi)' },
                  { id: 'original_center', label: 'Ukuran Asli 1:1' },
                  { id: 'stretch', label: 'Regang (Stretch)' },
                ].map((fit) => (
                  <button
                    key={fit.id}
                    type="button"
                    onClick={() => onChangeConfig({ fitMode: fit.id as any })}
                    className={`p-2 rounded-xl border text-center transition-all ${
                      config.fitMode === fit.id
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 ring-1 ring-blue-500 font-bold'
                        : 'border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-400'
                    }`}
                  >
                    <span className="text-[11px] block">{fit.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Layer Latar Belakang */}
          <div>
            <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-2">
              <Palette className="w-3.5 h-3.5 text-blue-500" />
              <span>Layer Latar Belakang (Background)</span>
            </label>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'transparent', label: 'Transparan' },
                { id: 'white', label: 'Putih Solid' },
                { id: 'black', label: 'Hitam Solid' },
                { id: 'custom', label: 'Warna Kustom' },
              ].map((bg) => (
                <button
                  key={bg.id}
                  type="button"
                  onClick={() => onChangeConfig({ backgroundMode: bg.id as any })}
                  className={`p-2 rounded-xl border text-center transition-all ${
                    config.backgroundMode === bg.id
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 ring-1 ring-blue-500 font-bold'
                      : 'border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-400'
                  }`}
                >
                  <span className="text-[11px] block">{bg.label}</span>
                </button>
              ))}
            </div>

            {config.backgroundMode === 'custom' && (
              <div className="mt-2 flex items-center gap-2">
                <input
                  type="color"
                  value={config.customBgColor}
                  onChange={(e) => onChangeConfig({ customBgColor: e.target.value })}
                  className="w-9 h-9 rounded-lg border border-neutral-300 dark:border-neutral-700 cursor-pointer p-0.5"
                />
                <input
                  type="text"
                  value={config.customBgColor}
                  onChange={(e) => onChangeConfig({ customBgColor: e.target.value })}
                  className="w-32 px-3 py-1.5 rounded-lg text-xs font-mono bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white"
                />
              </div>
            )}
          </div>

          {/* Nama File Output PSD */}
          <div>
            <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-1.5">
              <FileCode className="w-3.5 h-3.5 text-blue-500" />
              <span>Nama File Hasil PSD</span>
            </label>
            <input
              type="text"
              value={config.outputFilename}
              onChange={(e) => onChangeConfig({ outputFilename: e.target.value })}
              placeholder="contoh_faiz_fahmi_id.psd"
              className="w-full px-3 py-2 rounded-xl text-xs sm:text-sm font-mono bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

      </div>

      {/* Tombol Mulai Konversi */}
      <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-xs text-neutral-500 dark:text-neutral-400">
          Siap memproses <strong className="text-neutral-800 dark:text-neutral-200">{selectedAssetCount} layer gambar</strong> menjadi file Photoshop PSD.
        </div>

        <button
          type="button"
          onClick={onStartConversion}
          disabled={selectedAssetCount === 0}
          className="w-full sm:w-auto px-7 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          <Sparkles className="w-4 h-4" />
          <span className="whitespace-nowrap">Mulai Konversi ke PSD</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
