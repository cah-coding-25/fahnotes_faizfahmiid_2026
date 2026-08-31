import React, { useRef, useState } from 'react';
import { UploadCloud, FolderArchive, AlertTriangle, FileArchive, CheckCircle2, X } from 'lucide-react';

interface ZipUploaderProps {
  selectedFile: File | null;
  onFileSelected: (file: File) => void;
  onClearFile: () => void;
  isLoading: boolean;
  errorMessage: string | null;
}

export const ZipUploader: React.FC<ZipUploaderProps> = ({
  selectedFile,
  onFileSelected,
  onClearFile,
  isLoading,
  errorMessage,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      validateAndProcessFile(file);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      validateAndProcessFile(file);
    }
  };

  const validateAndProcessFile = (file: File) => {
    const isZip = file.name.toLowerCase().endsWith('.zip') || file.type.includes('zip') || file.type.includes('compressed');
    if (!isZip) {
      alert('Format file tidak didukung. Harap pilih arsip berekstensi .zip');
      return;
    }
    onFileSelected(file);
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div id="converter" className="w-full">
      {/* Alert Pesan Kesalahan */}
      {errorMessage && (
        <div className="mb-4 p-4 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 flex items-start gap-3 text-sm">
          <AlertTriangle className="w-5 h-5 shrink-0 text-red-500 mt-0.5" />
          <div className="flex-1">
            <span className="font-semibold block mb-0.5">Gagal Memproses File:</span>
            <span>{errorMessage}</span>
          </div>
          <button
            type="button"
            onClick={onClearFile}
            className="p-1 rounded-lg text-red-500 hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors"
            title="Tutup pesan"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Jika File Sudah Dipilih */}
      {selectedFile ? (
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
              <FileArchive className="w-6 h-6" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-base font-semibold text-neutral-900 dark:text-white truncate">
                  {selectedFile.name}
                </h3>
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              </div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Ukuran Arsip: {formatBytes(selectedFile.size)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto shrink-0 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex-1 sm:flex-none px-3.5 py-2 rounded-xl text-xs font-medium bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors whitespace-nowrap"
            >
              Ganti File ZIP
            </button>
            <button
              type="button"
              onClick={onClearFile}
              className="p-2 rounded-xl text-neutral-400 hover:text-red-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              title="Hapus file"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      ) : (
        /* Area Unggah Drag & Drop */
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative group cursor-pointer p-8 sm:p-12 rounded-2xl border-2 border-dashed transition-all duration-200 text-center ${
            isDragOver
              ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/30 ring-4 ring-blue-500/10'
              : 'border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 hover:border-blue-500/70 hover:bg-neutral-50/60 dark:hover:bg-neutral-800/80 shadow-sm'
          }`}
        >
          <div className="max-w-md mx-auto space-y-4 pointer-events-none">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center transition-transform group-hover:scale-105">
              {isLoading ? (
                <div className="w-7 h-7 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
              ) : (
                <FolderArchive className="w-8 h-8" />
              )}
            </div>

            <div className="space-y-1.5">
              <h3 className="text-lg font-bold text-neutral-900 dark:text-white">
                {isLoading ? 'Sedang Membaca Arsip ZIP...' : 'Tarik & Letakkan File ZIP di Sini'}
              </h3>
              <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">
                atau klik untuk memilih file dari perangkat Anda
              </p>
            </div>

            <div className="pt-2 flex flex-wrap items-center justify-center gap-1.5 text-[11px] text-neutral-500 dark:text-neutral-400">
              <span className="px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 font-mono">
                Mendukung: PNG, JPG, JPEG, WEBP, SVG, GIF, BMP, TIFF
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".zip,application/zip,application/x-zip-compressed"
        onChange={handleInputChange}
        className="hidden"
      />
    </div>
  );
};
