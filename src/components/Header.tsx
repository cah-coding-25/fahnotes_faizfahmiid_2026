import React from 'react';
import { 
  FileCode2, 
  Plus, 
  Database, 
  Lock, 
  LogOut, 
  Search, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle,
  Sparkles,
  Layers,
  Settings
} from 'lucide-react';

interface HeaderProps {
  isAdmin: boolean;
  onLogout: () => void;
  onOpenLogin: () => void;
  onOpenNewNote: () => void;
  onOpenSheetsModal: (tab?: 'categories' | 'account' | 'database') => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  categories: string[];
  isSheetsConnected: boolean;
  notesCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  isAdmin,
  onLogout,
  onOpenLogin,
  onOpenNewNote,
  onOpenSheetsModal,
  searchQuery,
  onSearchChange,
  selectedCategory,
  onSelectCategory,
  categories,
  isSheetsConnected,
  notesCount
}) => {
  return (
    <header className="w-full bg-white border-b-2 sm:border-b-[2.5px] border-black shadow-[0_4px_0px_#000000] sticky top-0 z-30 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col gap-3">
        {/* ROW 1: Logo, Search, and Main Actions */}
        <div className="flex items-center justify-between gap-3 flex-wrap sm:flex-nowrap">
          
          {/* Logo Brand with Playful Badge */}
          <div 
            onClick={() => onSelectCategory('Semua')}
            className="flex items-center gap-2.5 cursor-pointer select-none shrink-0 group"
          >
            <div className="w-10 h-10 rounded-xl bg-[#FFD233] border-2 border-black flex items-center justify-center font-black shadow-[3px_3px_0px_#000] group-hover:translate-x-0.5 group-hover:translate-y-0.5 group-hover:shadow-[1px_1px_0px_#000] transition-all">
              <FileCode2 className="w-5 h-5 text-black stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 leading-none">
                <span className="text-base sm:text-lg font-black tracking-tight text-black">fahnotes</span>
                {isAdmin && (
                  <span className="nb-badge bg-[#DCFCE7] text-black text-[9px] font-black border border-black">
                    ADMIN
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (!isAdmin) onOpenLogin();
                }}
                className={`text-[11px] font-extrabold text-black block mt-0.5 text-left select-none ${
                  !isAdmin ? 'hover:underline cursor-pointer' : 'cursor-default'
                }`}
                title={!isAdmin ? 'Klik by: Faiz_Fahmi_ID untuk Login Admin' : 'Admin Terverifikasi'}
              >
                by: <strong className="text-black font-black underline decoration-2 decoration-[#FFD233]">{isAdmin ? 'Faiz_Fahmi_ID (Admin)' : 'Faiz_Fahmi_ID'}</strong>
              </button>
            </div>
          </div>

          {/* Desktop Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md relative mx-2">
            <Search className="w-4 h-4 text-black/60 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari catatan, .bat, html, python, tutorial..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="nb-input w-full pl-9 pr-8 py-1.5 text-xs font-bold text-black placeholder:text-black/50"
            />
            {searchQuery && (
              <button 
                onClick={() => onSearchChange('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs font-black text-black hover:opacity-75"
                title="Hapus pencarian"
              >
                ✕
              </button>
            )}
          </div>

          {/* Action Buttons: Admin Controls Only (Visitor clicks by: Faiz_Fahmi_ID to login) */}
          <div className="flex items-center gap-2 shrink-0 ml-auto sm:ml-0">
            {isAdmin && (
              <>
                {/* Manage Categories (Admin Only) */}
                <button
                  onClick={() => onOpenSheetsModal('categories')}
                  className="nb-btn bg-[#2DD4BF] hover:bg-[#5EEAD4] px-3 py-1.5 text-xs font-black gap-1.5 text-black border-2 border-black"
                  title="Kelola Kategori: Tambah, Edit, Hapus &amp; Sync ke Sheets"
                >
                  <Layers className="w-3.5 h-3.5 stroke-[2.5] text-black" />
                  <span className="hidden sm:inline text-black">Kategori</span>
                </button>

                {/* Sheets & Account Trigger (Admin Only) */}
                <button
                  onClick={() => onOpenSheetsModal('database')}
                  className={`nb-btn px-3 py-1.5 text-xs font-black gap-1.5 text-black ${
                    isSheetsConnected 
                      ? 'bg-[#DCFCE7] hover:bg-[#BBF7D0]' 
                      : 'bg-[#FFFBEB] hover:bg-[#FEF3C7]'
                  }`}
                  title="Kelola Akun Admin &amp; Database Google Sheets"
                >
                  <Database className="w-3.5 h-3.5 stroke-[2.5] text-black" />
                  <span className="hidden sm:inline text-black">
                    {isSheetsConnected ? 'Sheets Terhubung' : 'Google Sheets'}
                  </span>
                  <span className="sm:hidden text-black">Sheets</span>
                </button>

                {/* Create Note (Admin Only) */}
                <button
                  onClick={onOpenNewNote}
                  className="nb-btn nb-btn-yellow px-3.5 py-1.5 text-xs font-black gap-1.5 shadow-[3px_3px_0px_#000] text-black"
                  title="Tulis Catatan atau Script Baru"
                >
                  <Plus className="w-4 h-4 stroke-[3] text-black" />
                  <span className="text-black">+ Catatan</span>
                </button>

                {/* Logout (Admin Only) */}
                <button
                  onClick={onLogout}
                  className="nb-btn bg-[#FFE4E6] text-black hover:bg-[#FDA4AF] px-3 py-1.5 text-xs font-black gap-1.5 border-2 border-black"
                  title="Keluar dari Mode Admin"
                >
                  <LogOut className="w-3.5 h-3.5 stroke-[2.5] text-black" />
                  <span className="hidden sm:inline text-black">Keluar</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="block md:hidden">
          <div className="relative">
            <Search className="w-4 h-4 text-black/60 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari catatan, .bat, html, python..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="nb-input w-full pl-9 pr-8 py-1.5 text-xs font-bold text-black"
            />
            {searchQuery && (
              <button 
                onClick={() => onSearchChange('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs font-black text-black hover:opacity-75"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* ROW 2: Category Filter Badges */}
        <div className="flex items-center gap-2 overflow-x-auto pt-1 scrollbar-none">
          <span className="text-[11px] font-black text-black/70 uppercase tracking-wider shrink-0 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-[#FFD233]" /> Kategori:
          </span>
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            const activeClass = isSelected 
              ? 'bg-[#FFD233] text-black border-2 border-black shadow-[2px_2px_0px_#000]' 
              : 'bg-white text-black hover:bg-[#FAF5EE] border-2 border-black';

            return (
              <button
                key={cat}
                onClick={() => onSelectCategory(cat)}
                className={`nb-btn px-3 py-1 text-xs font-black shrink-0 transition-all ${activeClass}`}
              >
                {cat}
              </button>
            );
          })}
          {isAdmin && (
            <button
              onClick={() => onOpenSheetsModal('categories')}
              className="nb-btn bg-[#2DD4BF] text-black px-2.5 py-1 text-[11px] font-black shrink-0 border border-black hover:bg-[#5EEAD4]"
              title="Kelola &amp; Tambah Kategori"
            >
              + Kelola Kategori
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
