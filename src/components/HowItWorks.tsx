import React from 'react';
import { UploadCloud, Sliders, FileCheck, Layers } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      step: '01',
      icon: <UploadCloud className="w-5 h-5 text-blue-500" />,
      title: 'Pilih File Arsip ZIP',
      desc: 'Tarik atau pilih file ZIP yang berisi kumpulan gambar (PNG, JPG, SVG, WEBP, dll.) dari perangkat Android, iPhone, tablet, atau komputer Anda.',
    },
    {
      step: '02',
      icon: <Sliders className="w-5 h-5 text-blue-500" />,
      title: 'Atur Ukuran & Struktur Layer',
      desc: 'Tentukan ukuran kanvas (otomatis sesuai gambar terbesar, ukuran preset sosial/cetak, atau manual), DPI, serta cara pengelompokan layer.',
    },
    {
      step: '03',
      icon: <FileCheck className="w-5 h-5 text-blue-500" />,
      title: 'Unduh File PSD Photoshop',
      desc: 'Browser Anda memproses seluruh layer biner Adobe Photoshop (.psd) secara instan tanpa mengunggah file ke server pihak ketiga.',
    },
  ];

  return (
    <section id="cara-kerja" className="py-12 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/40 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header Bagian */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
            Cara Kerja Konverter
          </h2>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            Hanya 3 langkah mudah untuk mengubah ratusan gambar menjadi satu file PSD terstruktur
          </p>
        </div>

        {/* 3 Langkah Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((item, idx) => (
            <div
              key={idx}
              className="relative p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-3 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-100 dark:border-blue-900/50 flex items-center justify-center shadow-xs">
                  {item.icon}
                </div>
                <span className="font-mono text-xl font-bold text-neutral-300 dark:text-neutral-700">
                  {item.step}
                </span>
              </div>

              <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                {item.title}
              </h3>
              <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
