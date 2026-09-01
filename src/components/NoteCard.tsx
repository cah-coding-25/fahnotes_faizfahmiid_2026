import React from 'react';
import { Note } from '../types';
import { 
  FileCode2, 
  Download, 
  Clock, 
  ExternalLink, 
  FileText, 
  Code2, 
  FolderGit2, 
  Globe, 
  Terminal,
  Edit,
  Trash2,
  Lock,
  Eye
} from 'lucide-react';

interface NoteCardProps {
  note: Note;
  onClick: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  isAdmin: boolean;
}

export const NoteCard: React.FC<NoteCardProps> = ({
  note,
  onClick,
  onEdit,
  onDelete,
  isAdmin
}) => {
  // Determine icon & theme color based on category
  const getCategoryTheme = (cat: string) => {
    const c = cat.toLowerCase();
    if (c.includes('bat') || c.includes('script') || c.includes('bash')) {
      return { 
        bg: 'bg-[#FFD233]', 
        icon: <Terminal className="w-5 h-5 text-black stroke-[2.5]" />,
        badge: 'bg-[#FFD233] text-black'
      };
    }
    if (c.includes('html') || c.includes('web') || c.includes('css')) {
      return { 
        bg: 'bg-[#FF6584]', 
        icon: <Globe className="w-5 h-5 text-black stroke-[2.5]" />,
        badge: 'bg-[#FF6584] text-black'
      };
    }
    if (c.includes('python') || c.includes('code') || c.includes('api')) {
      return { 
        bg: 'bg-[#2DD4BF]', 
        icon: <Code2 className="w-5 h-5 text-black stroke-[2.5]" />,
        badge: 'bg-[#2DD4BF] text-black'
      };
    }
    return { 
      bg: 'bg-[#818CF8]', 
      icon: <FileCode2 className="w-5 h-5 text-black stroke-[2.5]" />,
      badge: 'bg-[#818CF8] text-black'
    };
  };

  const theme = getCategoryTheme(note.category);
  const codeBlocksCount = (note.blocks || []).filter(b => b.type === 'code').length;
  const fileBlocksCount = (note.blocks || []).filter(b => b.type === 'file').length;

  return (
    <div 
      onClick={onClick}
      className="nb-box p-5 bg-white border-2 border-black rounded-2xl shadow-[4px_4px_0px_#000] hover:-translate-y-1 hover:shadow-[6px_6px_0px_#000] transition-all flex flex-col justify-between cursor-pointer group relative overflow-hidden"
    >
      <div>
        {/* Top Header Row: Icon Badge & Category Pill */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className={`w-11 h-11 rounded-xl ${theme.bg} border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_#000] group-hover:scale-105 transition-transform`}>
            {theme.icon}
          </div>

          <div className="flex items-center gap-1.5 flex-wrap justify-end">
            <span className={`nb-badge ${theme.badge} text-[10px] font-black border-black`}>
              {note.category}
            </span>
            {!note.isPublic && (
              <span className="nb-badge bg-[#FFE4E6] text-black border border-black text-[9px] font-black flex items-center gap-1">
                <Lock className="w-2.5 h-2.5 text-black" /> Privat
              </span>
            )}
          </div>
        </div>

        {/* Note Title */}
        <h3 className="text-base font-black text-black group-hover:text-black line-clamp-2 leading-snug mb-1.5 tracking-tight">
          {note.title}
        </h3>

        {/* Note Description */}
        <p className="text-xs font-bold text-black/75 line-clamp-3 leading-relaxed mb-4">
          {note.description || 'Klik untuk membuka rincian catatan dan source code snippet.'}
        </p>
      </div>

      {/* Footer Area: Meta tags and Actions */}
      <div className="pt-3 border-t-2 border-black/10 mt-auto flex items-center justify-between gap-2 text-[11px] font-bold text-black/70">
        
        {/* Block Stats */}
        <div className="flex items-center gap-2">
          {codeBlocksCount > 0 && (
            <span className="flex items-center gap-1 text-black font-extrabold" title={`${codeBlocksCount} Code snippet`}>
              <Code2 className="w-3.5 h-3.5 text-black" />
              <span className="text-black">{codeBlocksCount}</span>
            </span>
          )}
          {fileBlocksCount > 0 && (
            <span className="flex items-center gap-1 text-black font-extrabold" title={`${fileBlocksCount} File terlampir`}>
              <Download className="w-3.5 h-3.5 text-black" />
              <span className="text-black">{fileBlocksCount}</span>
            </span>
          )}
          <span className="text-[10px] text-black/60">
            by: {note.author || 'Faiz_Fahmi_ID'}
          </span>
        </div>

        {/* Admin Quick Buttons or Open Badge */}
        <div className="flex items-center gap-1">
          {isAdmin ? (
            <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
              {onEdit && (
                <button
                  onClick={onEdit}
                  className="nb-btn bg-[#FFD233] text-black p-1.5 rounded-lg shadow-[1px_1px_0px_#000] hover:bg-[#FFE066] border border-black"
                  title="Edit Catatan"
                >
                  <Edit className="w-3.5 h-3.5 text-black" />
                </button>
              )}
              {onDelete && (
                <button
                  onClick={onDelete}
                  className="nb-btn bg-[#FFE4E6] text-black p-1.5 rounded-lg shadow-[1px_1px_0px_#000] hover:bg-[#FDA4AF] border border-black"
                  title="Hapus Catatan"
                >
                  <Trash2 className="w-3.5 h-3.5 text-black" />
                </button>
              )}
            </div>
          ) : (
            <span className="nb-btn bg-[#FAF5EE] text-black px-2.5 py-1 text-[10px] font-black group-hover:bg-[#FFD233] transition-colors border border-black">
              Buka →
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
