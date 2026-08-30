import React from 'react';
import { FileCode2, Database, ShieldCheck, Heart } from 'lucide-react';

interface FooterProps {
  totalNotes: number;
  totalCodeSnippets: number;
  isSheetsConnected: boolean;
  isAdmin: boolean;
  onOpenLogin: () => void;
  onOpenSheetsModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  isAdmin,
  onOpenLogin,
}) => {
  return (
    <footer className="mt-8 bg-white border-t-[2.5px] border-black py-4 px-4 sm:px-8 text-black">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-bold">
        
        {/* Brand */}
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-[#FFD233] border-2 border-black flex items-center justify-center shadow-[1px_1px_0px_#000]">
            <FileCode2 className="w-3.5 h-3.5 text-black" />
          </div>
          <span className="font-black text-black text-sm">fahnotes</span>
        </div>

        {/* Subtle disguise trigger */}
        {!isAdmin ? (
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenLogin}
              className="text-[11px] font-medium text-black/60 hover:text-black hover:underline cursor-pointer select-none"
            >
              by:Faiz_Fahmi_ID
            </button>
          </div>
        ) : null}

      </div>
    </footer>
  );
};
