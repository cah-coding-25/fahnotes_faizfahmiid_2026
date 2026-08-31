import React from 'react';
import { UploadCloud, ShieldCheck, Sparkles, Zap } from 'lucide-react';

interface HeroProps {
  onScrollToUpload: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onScrollToUpload }) => {
  return (
    <section className="relative overflow-hidden pt-10 pb-8 sm:pt-14 sm:pb-12 text-center px-4 sm:px-6">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Badge Penulis & Tahun */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold bg-neutral-100 dark:bg-neutral-800/80 text-neutral-800 dark:text-neutral-200 border border-neutral-300 dark:border-neutral-700 shadow-2xs">
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
          <span>oleh: <strong className="text-blue-600 dark:text-blue-400 font-bold">Faiz_Fahmi_ID</strong> sejak 2026</span>
        </div>

        {/* Judul Utama Menarik & Mendalam */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-neutral-900 dark:text-white leading-[1.15]">
          Transformasi Arsip <span className="text-blue-600 dark:text-blue-400">ZIP ke Dokumen PSD</span> Berlapis Presisi Tinggi
        </h1>

        {/* Subtitle Mendalam */}
        <p className="max-w-2xl mx-auto text-base sm:text-lg text-neutral-600 dark:text-neutral-300 leading-relaxed">
          Satukan seluruh aset visual dalam arsip ZIP ke dalam satu kanvas master Adobe Photoshop (<code className="font-mono text-xs bg-neutral-200 dark:bg-neutral-800 px-1.5 py-0.5 rounded text-neutral-800 dark:text-neutral-200 font-semibold">.psd</code>) dengan kedalaman hierarki layer terstruktur, grup folder otomatis, resolusi cetak 300 DPI, dan transparansi kristal.
        </p>

        {/* Tombol Aksi */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={onScrollToUpload}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-sm transition-all transform active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            <UploadCloud className="w-4 h-4" />
            <span className="whitespace-nowrap">Pilih File ZIP Sekarang</span>
          </button>
        </div>

        {/* Fitur Utama Singkat */}
        <div className="pt-4 grid grid-cols-2 sm:grid-cols-4 gap-2.5 max-w-3xl mx-auto text-xs text-neutral-600 dark:text-neutral-400">
          <div className="flex items-center justify-center gap-1.5 p-2 rounded-lg bg-neutral-100/80 dark:bg-neutral-900/80 border border-neutral-200/60 dark:border-neutral-800/60">
            <Zap className="w-3.5 h-3.5 text-blue-500 shrink-0" />
            <span className="truncate">Otomatis Layer Photoshop</span>
          </div>
          <div className="flex items-center justify-center gap-1.5 p-2 rounded-lg bg-neutral-100/80 dark:bg-neutral-900/80 border border-neutral-200/60 dark:border-neutral-800/60">
            <Sparkles className="w-3.5 h-3.5 text-blue-500 shrink-0" />
            <span className="truncate">Folder ZIP Jadi Grup Layer</span>
          </div>
          <div className="flex items-center justify-center gap-1.5 p-2 rounded-lg bg-neutral-100/80 dark:bg-neutral-900/80 border border-neutral-200/60 dark:border-neutral-800/60">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-500 shrink-0" />
            <span className="truncate">Privasi Tanpa Unggah Server</span>
          </div>
          <div className="flex items-center justify-center gap-1.5 p-2 rounded-lg bg-neutral-100/80 dark:bg-neutral-900/80 border border-neutral-200/60 dark:border-neutral-800/60">
            <Zap className="w-3.5 h-3.5 text-blue-500 shrink-0" />
            <span className="truncate">Siap Cetak 300 DPI</span>
          </div>
        </div>

      </div>
    </section>
  );
};
