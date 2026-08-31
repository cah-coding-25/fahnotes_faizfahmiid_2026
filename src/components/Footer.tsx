import React from 'react';
import { Layers } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 transition-colors py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500 dark:text-neutral-400">
        
        {/* Brand Info */}
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-blue-600 dark:bg-blue-500 flex items-center justify-center text-white">
            <Layers className="w-3.5 h-3.5" />
          </div>
          <span className="font-semibold text-neutral-800 dark:text-neutral-200">
            ZIP to PSD
          </span>
          <span>— dirancang dan dikembangkan oleh:</span>
          <span className="font-semibold text-blue-600 dark:text-blue-400">Faiz_Fahmi_ID</span>
          <span>sejak 2026</span>
        </div>

      </div>
    </footer>
  );
};
