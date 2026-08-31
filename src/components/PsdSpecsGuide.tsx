import React from 'react';
import { Layers, Palette, Eye, Printer, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const PsdSpecsGuide: React.FC = () => {
  const specs = [
    {
      icon: <Layers className="w-5 h-5 text-blue-500" />,
      title: 'Hierarki Layer Asli Photoshop',
      desc: 'Setiap file gambar diletakkan pada layer independen dengan nama file asli yang bersih, mendukung visibilitas, blend mode, dan penataan ulang di Adobe Photoshop.',
    },
    {
      icon: <Palette className="w-5 h-5 text-blue-500" />,
      title: 'Kanal Warna RGB 8-Bit',
      desc: 'Format warna standar industri sRGB 8-bit per channel untuk kompatibilitas sempurna dengan Adobe Photoshop CS6, CC, Photopea, GIMP, dan Affinity Photo.',
    },
    {
      icon: <Eye className="w-5 h-5 text-blue-500" />,
      title: 'Transparansi Penuh (Alpha Channel)',
      desc: 'Area transparan pada gambar PNG, WEBP, dan SVG tetap dipertahankan tanpa latar belakang putih yang tidak diinginkan.',
    },
    {
      icon: <Printer className="w-5 h-5 text-blue-500" />,
      title: 'Dukungan Resolusi Cetak 300 DPI',
      desc: 'Metadata resolusi DPI tertanam langsung di header file PSD, siap digunakan untuk keperluan cetak presisi tinggi tanpa distorsi.',
    },
  ];

  return (
    <section id="spesifikasi" className="py-12 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Judul Bagian */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
            Standar Spesifikasi Dokumen PSD
          </h2>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            File Photoshop yang dihasilkan mematuhi standar spesifikasi resmi Adobe Photoshop
          </p>
        </div>

        {/* Grid Kartu Fitur Spesifikasi */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {specs.map((item, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-3"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 flex items-center justify-center">
                {item.icon}
              </div>
              <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
                {item.title}
              </h3>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Kompatibilitas Perangkat Lunak */}
        <div className="p-4 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 flex flex-wrap items-center justify-between gap-4 text-xs">
          <span className="font-semibold text-neutral-700 dark:text-neutral-300">
            Dapat dibuka langsung di:
          </span>
          <div className="flex flex-wrap items-center gap-3 font-medium text-neutral-600 dark:text-neutral-400">
            <span className="flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Adobe Photoshop (Semua Versi)</span>
            <span className="flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Photopea Online</span>
            <span className="flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Affinity Photo</span>
            <span className="flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> GIMP</span>
            <span className="flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Procreate</span>
          </div>
        </div>

      </div>
    </section>
  );
};
