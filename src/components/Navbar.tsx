import React from 'react';
import { Sun, Moon, Layers, WifiOff } from 'lucide-react';

interface NavbarProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
  isOffline: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  darkMode,
  onToggleDarkMode,
  isOffline,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-neutral-200 dark:border-neutral-800 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Zona Brand */}
        <a href="#converter" className="flex items-center gap-2.5 shrink-0 group">
          <div className="w-9 h-9 rounded-xl bg-blue-600 dark:bg-blue-500 flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-105">
            <Layers className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-base sm:text-lg tracking-tight text-neutral-900 dark:text-white leading-tight">
              ZIP to PSD
            </span>
            <span className="text-[11px] font-medium text-neutral-500 dark:text-neutral-400 leading-none">
              oleh: <span className="text-blue-600 dark:text-blue-400 font-semibold">Faiz_Fahmi_ID</span> sejak 2026
            </span>
          </div>
        </a>

        {/* Zona Navigasi */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-neutral-600 dark:text-neutral-300">
          <a href="#converter" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors whitespace-nowrap">
            Konverter
          </a>
          <a href="#cara-kerja" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors whitespace-nowrap">
            Cara Kerja
          </a>
          <a href="#spesifikasi" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors whitespace-nowrap">
            Spesifikasi
          </a>
          <a href="#faq" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors whitespace-nowrap">
            Tanya Jawab
          </a>
        </nav>

        {/* Zona Aksi */}
        <div className="flex items-center gap-2.5 shrink-0">
          {isOffline && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800" title="Aplikasi berjalan penuh tanpa internet di browser Anda">
              <WifiOff className="w-3.5 h-3.5 shrink-0" />
              <span className="hidden sm:inline">Mode Offline</span>
            </div>
          )}

          {/* Tombol Tema Gelap / Terang */}
          <button
            type="button"
            onClick={onToggleDarkMode}
            aria-label={darkMode ? 'Beralih ke mode terang' : 'Beralih ke mode gelap'}
            className="p-2.5 rounded-xl text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 border border-neutral-200 dark:border-neutral-700/70 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-neutral-700" />}
          </button>
        </div>

      </div>
    </header>
  );
};
