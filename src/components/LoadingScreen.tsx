import React, { useEffect, useState } from 'react';
import { FileCode2, Sparkles, CheckCircle2, RefreshCw } from 'lucide-react';

interface LoadingScreenProps {
  isLoading: boolean;
  statusText?: string;
  onFinish?: () => void;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({
  isLoading,
  statusText = 'Memuat, harap tunggu...',
}) => {
  const [progress, setProgress] = useState(15);
  const [stepMessage, setStepMessage] = useState('Memuat konten...');
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      setProgress(100);
      setStepMessage('Selesai! Membuka halaman...');
      const timer = setTimeout(() => {
        setIsCompleted(true);
      }, 400);
      return () => clearTimeout(timer);
    } else {
      setIsCompleted(false);
      setProgress(25);
      setStepMessage('Memuat data, harap tunggu...');

      const t1 = setTimeout(() => {
        setProgress(60);
        setStepMessage('Menyiapkan catatan & skrip...');
      }, 450);

      const t2 = setTimeout(() => {
        setProgress(88);
        setStepMessage('Memproses konten...');
      }, 950);

      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    }
  }, [isLoading]);

  if (!isLoading && isCompleted) return null;

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#FAF5EE]/95 backdrop-blur-sm transition-opacity duration-500 ${
        !isLoading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <div className="w-full max-w-md bg-white border-4 border-black rounded-3xl p-6 sm:p-8 shadow-[8px_8px_0px_#000000] text-center space-y-6 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Animated Brand Icon */}
        <div className="relative mx-auto w-20 h-20">
          <div className="w-20 h-20 rounded-2xl bg-[#FFD233] border-3 border-black flex items-center justify-center shadow-[4px_4px_0px_#000000] animate-bounce">
            <FileCode2 className="w-10 h-10 text-black stroke-[2.5]" />
          </div>
          <div className="absolute -top-2 -right-2 w-8 h-8 rounded-xl bg-[#2DD4BF] border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_#000]">
            <Sparkles className="w-4 h-4 text-black" />
          </div>
        </div>

        {/* Brand Title */}
        <div className="space-y-1">
          <h1 className="text-2xl font-black tracking-tight text-black flex items-center justify-center gap-2">
            fahnotes
          </h1>
          <p className="text-xs font-black uppercase text-black/60 tracking-wider">
            Memuat Aplikasi
          </p>
        </div>

        {/* Dynamic Neobrutalist Progress Bar */}
        <div className="space-y-2">
          <div className="w-full h-5 bg-[#FAF5EE] border-2 border-black rounded-full overflow-hidden p-0.5 shadow-[2px_2px_0px_#000]">
            <div 
              className="h-full bg-[#FFD233] border-r-2 border-black rounded-full transition-all duration-500 ease-out flex items-center justify-end pr-1"
              style={{ width: `${progress}%` }}
            >
              <div className="w-2 h-2 rounded-full bg-black animate-ping" />
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] font-black text-black px-1">
            <span className="flex items-center gap-1.5 text-black">
              {progress >= 100 ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-black" />
              ) : (
                <RefreshCw className="w-3.5 h-3.5 text-black animate-spin" />
              )}
              {statusText || stepMessage}
            </span>
            <span className="font-mono text-black font-extrabold">{progress}%</span>
          </div>
        </div>

        {/* Subtitle / Tip */}
        <div className="p-2.5 bg-[#FFFBEB] border-2 border-black rounded-xl text-left shadow-[2px_2px_0px_#000]">
          <p className="text-[11px] font-bold text-black text-center">
            ⚡ Sedang memuat konten, harap tunggu sebentar...
          </p>
        </div>

      </div>
    </div>
  );
};
