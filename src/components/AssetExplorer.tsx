import React, { useState } from 'react';
import {
  ExtractedAsset,
  ZipAnalysisResult,
} from '../types';
import {
  Folder,
  CheckSquare,
  Square,
  Search,
  Filter,
  Eye,
  AlertCircle,
  Maximize2,
  X,
  Layers,
  FileImage,
} from 'lucide-react';

interface AssetExplorerProps {
  analysis: ZipAnalysisResult;
  assets: ExtractedAsset[];
  onToggleSelectAsset: (id: string) => void;
  onSelectAll: (select: boolean) => void;
}

export const AssetExplorer: React.FC<AssetExplorerProps> = ({
  analysis,
  assets,
  onToggleSelectAsset,
  onSelectAll,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFolder, setSelectedFolder] = useState<string>('all');
  const [previewModalAsset, setPreviewModalAsset] = useState<ExtractedAsset | null>(null);
  const [showUnsupported, setShowUnsupported] = useState(false);

  const selectedCount = assets.filter((a) => a.selected).length;

  const filteredAssets = assets.filter((asset) => {
    const matchesSearch =
      asset.originalName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.folder.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFolder =
      selectedFolder === 'all'
        ? true
        : selectedFolder === 'root'
        ? asset.folder === ''
        : asset.folder === selectedFolder;
    return matchesSearch && matchesFolder;
  });

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  return (
    <div className="rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm overflow-hidden transition-colors">
      {/* Header Eksplorasi Aset */}
      <div className="p-4 sm:p-5 border-b border-neutral-200 dark:border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base sm:text-lg font-bold text-neutral-900 dark:text-white">
              Aset Gambar Terdeteksi
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
              {selectedCount} dari {assets.length} Dipilih
            </span>
          </div>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Pilih gambar yang ingin dimasukkan sebagai layer di dokumen Photoshop
          </p>
        </div>

        {/* Kontrol Pilih Semua / Batalkan */}
        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
          <button
            type="button"
            onClick={() => onSelectAll(true)}
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors inline-flex items-center gap-1.5"
          >
            <CheckSquare className="w-3.5 h-3.5 text-blue-500" />
            <span className="whitespace-nowrap">Pilih Semua</span>
          </button>
          <button
            type="button"
            onClick={() => onSelectAll(false)}
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors inline-flex items-center gap-1.5"
          >
            <Square className="w-3.5 h-3.5" />
            <span className="whitespace-nowrap">Batalkan Semua</span>
          </button>
        </div>
      </div>

      {/* Toolbar Filter & Pencarian */}
      <div className="p-3 sm:p-4 bg-neutral-50/70 dark:bg-neutral-900/50 border-b border-neutral-200 dark:border-neutral-800 flex flex-col sm:flex-row items-center gap-3">
        {/* Kolom Pencarian */}
        <div className="relative w-full sm:flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama gambar atau folder..."
            className="w-full pl-9 pr-3 py-2 rounded-xl text-xs sm:text-sm bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filter Folder */}
        {analysis.folders.length > 0 && (
          <div className="relative w-full sm:w-auto shrink-0 flex items-center gap-2">
            <Filter className="w-4 h-4 text-neutral-400 hidden sm:inline" />
            <select
              value={selectedFolder}
              onChange={(e) => setSelectedFolder(e.target.value)}
              className="w-full sm:w-auto px-3 py-2 rounded-xl text-xs sm:text-sm bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            >
              <option value="all">Semua Folder ({assets.length})</option>
              <option value="root">Folder Utama (Root)</option>
              {analysis.folders.map((folder) => {
                const count = assets.filter((a) => a.folder === folder).length;
                return (
                  <option key={folder} value={folder}>
                    📁 {folder} ({count})
                  </option>
                );
              })}
            </select>
          </div>
        )}
      </div>

      {/* Grid Kartu Aset Gambar */}
      <div className="p-4 sm:p-5">
        {filteredAssets.length === 0 ? (
          <div className="py-12 text-center text-neutral-500 dark:text-neutral-400">
            <FileImage className="w-10 h-10 mx-auto mb-2 opacity-40" />
            <p className="text-sm font-medium">Tidak ada gambar yang cocok dengan filter atau pencarian Anda.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5">
            {filteredAssets.map((asset) => (
              <div
                key={asset.id}
                onClick={() => onToggleSelectAsset(asset.id)}
                className={`group relative rounded-xl border p-2.5 flex flex-col justify-between cursor-pointer transition-all ${
                  asset.selected
                    ? 'border-blue-500 bg-blue-50/30 dark:bg-blue-950/20 ring-2 ring-blue-500/20 shadow-sm'
                    : 'border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/60 opacity-60 hover:opacity-100'
                }`}
              >
                {/* Thumbnail Gambar */}
                <div className="relative w-full aspect-square rounded-lg overflow-hidden checkerboard-bg flex items-center justify-center border border-neutral-200/60 dark:border-neutral-700/60 mb-2">
                  <img
                    src={asset.previewUrl}
                    alt={asset.originalName}
                    className="max-w-full max-h-full object-contain pointer-events-none transition-transform duration-200 group-hover:scale-105"
                    loading="lazy"
                  />

                  {/* Tombol Perbesar Pratinjau */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setPreviewModalAsset(asset);
                    }}
                    className="absolute top-1.5 right-1.5 p-1.5 rounded-md bg-black/60 hover:bg-black/80 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Perbesar gambar"
                  >
                    <Maximize2 className="w-3 h-3" />
                  </button>

                  {/* Checkbox Status */}
                  <div className="absolute bottom-1.5 left-1.5">
                    <input
                      type="checkbox"
                      checked={asset.selected}
                      onChange={() => {}}
                      className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 pointer-events-none"
                    />
                  </div>
                </div>

                {/* Metadata Singkat */}
                <div className="min-w-0 space-y-0.5">
                  <p className="text-xs font-semibold text-neutral-900 dark:text-white truncate" title={asset.originalName}>
                    {asset.originalName}
                  </p>
                  <div className="flex items-center justify-between text-[11px] text-neutral-500 dark:text-neutral-400">
                    <span className="font-mono">{asset.width}×{asset.height} px</span>
                    <span className="uppercase text-[10px] font-semibold">{asset.extension}</span>
                  </div>
                  {asset.folder && (
                    <div className="flex items-center gap-1 text-[10px] text-neutral-400 dark:text-neutral-500 truncate" title={`Folder: ${asset.folder}`}>
                      <Folder className="w-3 h-3 shrink-0" />
                      <span className="truncate">{asset.folder}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bagian File yang Dilewati / Tidak Didukung (Bila Ada) */}
      {analysis.unsupportedFiles.length > 0 && (
        <div className="p-4 bg-amber-50/50 dark:bg-amber-950/20 border-t border-amber-200/60 dark:border-amber-900/40 text-xs">
          <button
            type="button"
            onClick={() => setShowUnsupported(!showUnsupported)}
            className="flex items-center justify-between w-full text-amber-800 dark:text-amber-300 font-semibold"
          >
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600" />
              <span>{analysis.unsupportedFiles.length} file bukan gambar dilewati dengan aman</span>
            </div>
            <span>{showUnsupported ? 'Sembunyikan' : 'Lihat Rincian'}</span>
          </button>

          {showUnsupported && (
            <ul className="mt-3 space-y-1 max-h-32 overflow-y-auto pl-6 list-disc text-neutral-600 dark:text-neutral-400">
              {analysis.unsupportedFiles.map((un, idx) => (
                <li key={idx} className="truncate">
                  <span className="font-mono text-neutral-800 dark:text-neutral-200">{un.name}</span> ({formatBytes(un.size)}) — {un.reason}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Modal Pratinjau Gambar Besar */}
      {previewModalAsset && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={() => setPreviewModalAsset(null)}
        >
          <div
            className="relative max-w-3xl w-full bg-white dark:bg-neutral-900 rounded-2xl p-4 shadow-2xl border border-neutral-200 dark:border-neutral-800 space-y-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm sm:text-base text-neutral-900 dark:text-white truncate">
                  {previewModalAsset.originalName}
                </h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  {previewModalAsset.width} × {previewModalAsset.height} px • {formatBytes(previewModalAsset.size)}
                  {previewModalAsset.folder ? ` • Folder: ${previewModalAsset.folder}` : ''}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setPreviewModalAsset(null)}
                className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="w-full h-80 sm:h-96 rounded-xl overflow-hidden checkerboard-bg flex items-center justify-center border border-neutral-200 dark:border-neutral-800">
              <img
                src={previewModalAsset.previewUrl}
                alt={previewModalAsset.originalName}
                className="max-w-full max-h-full object-contain"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => {
                  onToggleSelectAsset(previewModalAsset.id);
                  setPreviewModalAsset(null);
                }}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors ${
                  previewModalAsset.selected
                    ? 'bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {previewModalAsset.selected ? 'Keluarkan dari PSD' : 'Sertakan ke dalam PSD'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
