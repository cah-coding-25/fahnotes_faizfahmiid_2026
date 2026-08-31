import React, { useState } from 'react';
import { ConversionResult, PsdLayerNode } from '../types';
import {
  Download,
  CheckCircle2,
  Layers,
  Folder,
  Eye,
  EyeOff,
  RotateCcw,
  Sliders,
  Image as ImageIcon,
  Check,
} from 'lucide-react';

interface ResultPreviewProps {
  result: ConversionResult;
  onReset: () => void;
  onReconfigure: () => void;
}

export const ResultPreview: React.FC<ResultPreviewProps> = ({
  result,
  onReset,
  onReconfigure,
}) => {
  const [showCheckerboard, setShowCheckerboard] = useState(true);
  const [copied, setCopied] = useState(false);

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleDownloadPsd = () => {
    const a = document.createElement('a');
    a.href = result.psdDownloadUrl;
    a.download = result.filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleDownloadPng = () => {
    const a = document.createElement('a');
    a.href = result.compositePreviewUrl;
    a.download = result.filename.replace(/\.psd$/i, '_preview.png');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm overflow-hidden p-4 sm:p-6 space-y-6 transition-colors">
      
      {/* Banner Berhasil */}
      <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-emerald-900 dark:text-emerald-200">
              Dokumen Photoshop (PSD) Berhasil Dibuat!
            </h2>
            <p className="text-xs text-emerald-700 dark:text-emerald-400">
              {result.filename} ({formatBytes(result.fileSizeBytes)}) • {result.dimensions.width} × {result.dimensions.height} px • {result.dimensions.dpi} DPI
            </p>
          </div>
        </div>

        {/* Tombol Unduh Utama */}
        <button
          type="button"
          onClick={handleDownloadPsd}
          className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-sm transition-transform active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
        >
          <Download className="w-4 h-4" />
          <span className="whitespace-nowrap">Unduh File PSD</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Kolom Pratinjau Kanvas (2 Span) */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 flex items-center gap-1.5">
              <ImageIcon className="w-3.5 h-3.5 text-blue-500" />
              <span>Pratinjau Komposit Kanvas</span>
            </h3>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowCheckerboard(!showCheckerboard)}
                className="px-2.5 py-1 rounded-lg text-xs font-medium bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
              >
                {showCheckerboard ? 'Latar Kotak' : 'Latar Polos'}
              </button>
              <button
                type="button"
                onClick={handleDownloadPng}
                className="px-2.5 py-1 rounded-lg text-xs font-medium bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors inline-flex items-center gap-1"
                title="Unduh gambar pratinjau PNG"
              >
                <Download className="w-3 h-3" />
                <span>Unduh PNG</span>
              </button>
            </div>
          </div>

          <div
            className={`w-full aspect-[16/10] max-h-[460px] rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden flex items-center justify-center p-3 transition-colors ${
              showCheckerboard ? 'checkerboard-bg' : 'bg-neutral-100 dark:bg-neutral-950'
            }`}
          >
            <img
              src={result.compositePreviewUrl}
              alt="Pratinjau Hasil Dokumen PSD"
              className="max-w-full max-h-full object-contain rounded shadow-md"
            />
          </div>
        </div>

        {/* Kolom Struktur Layer PSD (1 Span) */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-blue-500" />
            <span>Pohon Layer Photoshop</span>
          </h3>

          <div className="p-3.5 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 max-h-[460px] overflow-y-auto space-y-1.5">
            {result.layerTree.map((node) => (
              <LayerTreeItem key={node.id} node={node} level={0} />
            ))}
          </div>
        </div>

      </div>

      {/* Baris Tombol Aksi Bawah */}
      <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onReconfigure}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors flex items-center gap-1.5"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Ubah Pengaturan</span>
          </button>
          <button
            type="button"
            onClick={onReset}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-neutral-500 hover:text-red-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Konversi File ZIP Lain</span>
          </button>
        </div>

        <button
          type="button"
          onClick={handleDownloadPsd}
          className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-sm transition-transform active:scale-95 flex items-center justify-center gap-2"
        >
          <Download className="w-4 h-4" />
          <span>Unduh PSD ({formatBytes(result.fileSizeBytes)})</span>
        </button>
      </div>

    </div>
  );
};

interface LayerTreeItemProps {
  node: PsdLayerNode;
  level: number;
}

const LayerTreeItem: React.FC<LayerTreeItemProps> = ({ node, level }) => {
  const [expanded, setExpanded] = useState(true);

  if (node.type === 'group') {
    return (
      <div className="text-xs space-y-1">
        <div
          onClick={() => setExpanded(!expanded)}
          className="flex items-center justify-between p-2 rounded-lg bg-neutral-200/60 dark:bg-neutral-800/80 cursor-pointer hover:bg-neutral-200 dark:hover:bg-neutral-700/80 font-medium text-neutral-800 dark:text-neutral-200"
          style={{ paddingLeft: `${Math.max(level * 12 + 8, 8)}px` }}
        >
          <div className="flex items-center gap-1.5 truncate">
            <Folder className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <span className="truncate">{node.name}</span>
            <span className="text-[10px] text-neutral-500 dark:text-neutral-400">
              ({node.children?.length || 0})
            </span>
          </div>
        </div>

        {expanded && node.children && (
          <div className="space-y-1">
            {node.children.map((child) => (
              <LayerTreeItem key={child.id} node={child} level={level + 1} />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      className="flex items-center justify-between p-2 rounded-lg bg-white dark:bg-neutral-900 border border-neutral-200/70 dark:border-neutral-800 text-xs text-neutral-700 dark:text-neutral-300"
      style={{ paddingLeft: `${Math.max(level * 12 + 8, 8)}px` }}
    >
      <div className="flex items-center gap-2 truncate">
        <Layers className="w-3.5 h-3.5 text-blue-500 shrink-0" />
        <span className="truncate font-medium">{node.name}</span>
      </div>
      {node.dimensions && (
        <span className="text-[10px] text-neutral-400 dark:text-neutral-500 font-mono shrink-0 ml-2">
          {node.dimensions.width}×{node.dimensions.height}
        </span>
      )}
    </div>
  );
};
