import React from 'react';
import { ProgressState } from '../types';
import { Loader2, CheckCircle2, Terminal } from 'lucide-react';

interface ConversionProgressProps {
  progress: ProgressState;
}

export const ConversionProgress: React.FC<ConversionProgressProps> = ({ progress }) => {
  return (
    <div className="rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm p-6 sm:p-8 max-w-2xl mx-auto text-center space-y-6">
      
      {/* Animasi Spinner */}
      <div className="w-16 h-16 mx-auto rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shadow-inner">
        {progress.percentage >= 100 ? (
          <CheckCircle2 className="w-8 h-8 text-emerald-500 animate-bounce" />
        ) : (
          <Loader2 className="w-8 h-8 animate-spin" />
        )}
      </div>

      {/* Informasi Tahapan */}
      <div className="space-y-2">
        <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
          {progress.stageName || 'Sedang Memproses Dokumen PSD...'}
        </h2>
        <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 min-h-[20px]">
          {progress.details || 'Harap tunggu sejenak, browser sedang menyusun layer Photoshop.'}
        </p>
      </div>

      {/* Bar Kemajuan (Progress Bar) */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs font-semibold text-neutral-600 dark:text-neutral-300">
          <span>Langkah {progress.currentStep} dari {progress.totalSteps}</span>
          <span className="font-mono">{progress.percentage}%</span>
        </div>
        <div className="w-full h-3 rounded-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
          <div
            className="h-full bg-blue-600 dark:bg-blue-500 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${Math.max(progress.percentage, 5)}%` }}
          />
        </div>
      </div>

      {/* Log Aktivitas Terminal Real-Time */}
      {progress.logs.length > 0 && (
        <div className="text-left rounded-xl bg-neutral-950 text-neutral-300 p-3.5 border border-neutral-800 font-mono text-[11px] space-y-1 max-h-36 overflow-y-auto">
          <div className="flex items-center gap-1.5 text-neutral-400 pb-1 border-b border-neutral-800 text-[10px] font-semibold uppercase tracking-wider">
            <Terminal className="w-3 h-3 text-blue-400" />
            <span>Catatan Pemrosesan</span>
          </div>
          {progress.logs.map((item, idx) => (
            <div key={idx} className="text-neutral-300 truncate">
              {item}
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
