import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Apakah file saya diunggah ke internet atau server?',
      a: 'Tidak sama sekali. Seluruh proses pembacaan file ZIP, rendering layer, dan pembentukan dokumen binary Adobe Photoshop (.psd) dilakukan 100% di browser perangkat Anda menggunakan teknologi WebAssembly dan Canvas. Data gambar Anda tidak pernah keluar dari perangkat Anda.',
    },
    {
      q: 'Bagaimana subfolder di dalam ZIP dikonversi ke Photoshop?',
      a: 'Jika file ZIP Anda memiliki folder-folder (misal: "01_Header", "02_Tombol"), sistem secara otomatis mengubah folder tersebut menjadi folder grup layer Photoshop asli (Layer Group) sehingga struktur file Anda tetap rapi.',
    },
    {
      q: 'Apakah transparansi gambar PNG/WEBP tetap terjaga?',
      a: 'Ya, seluruh alpha channel (transparansi) pada gambar PNG, WEBP, dan SVG tetap dipertahankan penuh tanpa artefak latar putih.',
    },
    {
      q: 'Format gambar apa saja yang dapat dimasukkan ke dalam PSD?',
      a: 'Aplikasi mendukung format PNG, JPG, JPEG, WEBP, SVG, GIF, BMP, dan TIFF. Jika ada file bukan gambar di dalam ZIP (seperti file teks .txt atau .DS_Store), sistem akan otomatis melewatinya dengan aman.',
    },
    {
      q: 'Apakah bisa digunakan di ponsel Android dan iPhone?',
      a: 'Ya, tampilan didesain responsif untuk layar smartphone Android, tablet, iPad, dan komputer desktop, mendukung mode gelap (dark mode) serta mode terang (light mode) dengan kontras tinggi.',
    },
  ];

  return (
    <section id="faq" className="py-12 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/40">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Header Tanya Jawab */}
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
            Pertanyaan yang Sering Diajukan
          </h2>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            Informasi seputar cara kerja, privasi, dan kompatibilitas format PSD
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-semibold text-sm sm:text-base text-neutral-900 dark:text-white focus:outline-none"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-neutral-500 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-blue-500' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 sm:px-5 sm:pb-5 text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed border-t border-neutral-100 dark:border-neutral-800/60 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
