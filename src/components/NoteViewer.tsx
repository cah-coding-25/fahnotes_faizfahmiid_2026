import React, { useState } from 'react';
import { Note, CodeBlock, FileBlock, LinkBlock, AppSettings } from '../types';
import { formatImageUrl, triggerDirectDownload, isGoogleDriveUrl } from '../utils/driveHelper';
import { ShareModal } from './ShareModal';
import { triggerSmartShare } from '../utils/shareHelper';
import ReactMarkdown from 'react-markdown';
import confetti from 'canvas-confetti';
import { 
  ArrowLeft, 
  Share2, 
  Copy, 
  Check, 
  Download, 
  Edit3, 
  Terminal, 
  Calendar, 
  User,
  FileText,
  Zap,
  ExternalLink,
  Lock,
  Globe,
  Eye,
  Trash2,
  Code,
  FileCode,
  Database
} from 'lucide-react';

const getFileInfo = (filename: string, code: string) => {
  const lower = filename.toLowerCase();
  const bytes = new Blob([code || '']).size;
  let sizeStr = `${bytes} B`;
  if (bytes >= 1024 * 1024) sizeStr = `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  else if (bytes >= 1024) sizeStr = `${(bytes / 1024).toFixed(1)} KB`;

  const lines = code ? code.split('\n').length : 0;
  
  if (lower.endsWith('.html') || lower.endsWith('.htm')) {
    return {
      typeLabel: 'Dokumen Web HTML',
      badge: 'HTML',
      badgeBg: 'bg-[#FFEDD5]',
      icon: <Globe className="w-5 h-5 text-orange-950 stroke-[2.5]" />,
      sizeStr,
      lines
    };
  }
  if (lower.endsWith('.bat') || lower.endsWith('.cmd')) {
    return {
      typeLabel: 'Windows Batch Script',
      badge: 'BAT SCRIPT',
      badgeBg: 'bg-[#FEF08A]',
      icon: <Terminal className="w-5 h-5 text-amber-950 stroke-[2.5]" />,
      sizeStr,
      lines
    };
  }
  if (lower.endsWith('.py')) {
    return {
      typeLabel: 'Python Script File',
      badge: 'PYTHON',
      badgeBg: 'bg-[#DBEAFE]',
      icon: <FileCode className="w-5 h-5 text-blue-950 stroke-[2.5]" />,
      sizeStr,
      lines
    };
  }
  if (lower.endsWith('.js') || lower.endsWith('.mjs')) {
    return {
      typeLabel: 'JavaScript Source File',
      badge: 'JAVASCRIPT',
      badgeBg: 'bg-[#FEF08A]',
      icon: <Code className="w-5 h-5 text-yellow-950 stroke-[2.5]" />,
      sizeStr,
      lines
    };
  }
  if (lower.endsWith('.ts') || lower.endsWith('.tsx')) {
    return {
      typeLabel: 'TypeScript Source File',
      badge: 'TYPESCRIPT',
      badgeBg: 'bg-[#E0F2FE]',
      icon: <Code className="w-5 h-5 text-sky-950 stroke-[2.5]" />,
      sizeStr,
      lines
    };
  }
  if (lower.endsWith('.css')) {
    return {
      typeLabel: 'Cascading Style Sheets',
      badge: 'CSS',
      badgeBg: 'bg-[#E0E7FF]',
      icon: <FileText className="w-5 h-5 text-indigo-950 stroke-[2.5]" />,
      sizeStr,
      lines
    };
  }
  if (lower.endsWith('.sh') || lower.endsWith('.bash')) {
    return {
      typeLabel: 'Linux Shell Script',
      badge: 'BASH / SH',
      badgeBg: 'bg-[#F3E8FF]',
      icon: <Terminal className="w-5 h-5 text-purple-950 stroke-[2.5]" />,
      sizeStr,
      lines
    };
  }
  if (lower.endsWith('.json')) {
    return {
      typeLabel: 'JSON Data Structure',
      badge: 'JSON',
      badgeBg: 'bg-[#D1FAE5]',
      icon: <FileCode className="w-5 h-5 text-emerald-950 stroke-[2.5]" />,
      sizeStr,
      lines
    };
  }
  if (lower.endsWith('.sql')) {
    return {
      typeLabel: 'Database SQL Query',
      badge: 'SQL',
      badgeBg: 'bg-[#FFE4E6]',
      icon: <Database className="w-5 h-5 text-rose-950 stroke-[2.5]" />,
      sizeStr,
      lines
    };
  }

  const parts = filename.split('.');
  const ext = parts.length > 1 ? parts.pop()?.toUpperCase() : 'FILE';
  return {
    typeLabel: `Berkas File .${ext}`,
    badge: ext,
    badgeBg: 'bg-[#FAF5EE]',
    icon: <FileCode className="w-5 h-5 text-zinc-950 stroke-[2.5]" />,
    sizeStr,
    lines
  };
};

interface NoteViewerProps {
  note: Note;
  isAdmin: boolean;
  onBack: () => void;
  onEdit: (note: Note) => void;
  onDelete?: (id: string) => void;
  onShowToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
  settings?: Partial<AppSettings>;
}

export const NoteViewer: React.FC<NoteViewerProps> = ({
  note,
  isAdmin,
  onBack,
  onEdit,
  onDelete,
  onShowToast,
  settings,
}) => {
  const [copiedBlockId, setCopiedBlockId] = useState<string | null>(null);
  const [previewHtmlBlockIds, setPreviewHtmlBlockIds] = useState<Record<string, boolean>>({});
  const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(false);
  const coverUrl = note.coverImage ? formatImageUrl(note.coverImage) : null;

  const toggleHtmlPreview = (blockId: string) => {
    setPreviewHtmlBlockIds((prev) => ({
      ...prev,
      [blockId]: !prev[blockId]
    }));
  };

  const handleCopyCode = async (block: CodeBlock) => {
    try {
      await navigator.clipboard.writeText(block.code);
      setCopiedBlockId(block.id);
      confetti({ particleCount: 20, spread: 40, origin: { y: 0.8 } });
      onShowToast(`Kode "${block.title || 'snippet'}" berhasil disalin!`, 'success');
      setTimeout(() => setCopiedBlockId(null), 2000);
    } catch {
      onShowToast('Gagal menyalin kode', 'error');
    }
  };

  const handleDownloadCodeFile = (block: CodeBlock) => {
    const filename = block.title ? block.title.trim() : `file_script.txt`;
    
    // Determine MIME type based on extension
    let mimeType = 'text/plain;charset=utf-8';
    const lower = filename.toLowerCase();
    if (lower.endsWith('.html') || lower.endsWith('.htm')) mimeType = 'text/html;charset=utf-8';
    else if (lower.endsWith('.css')) mimeType = 'text/css;charset=utf-8';
    else if (lower.endsWith('.js') || lower.endsWith('.mjs')) mimeType = 'application/javascript;charset=utf-8';
    else if (lower.endsWith('.json')) mimeType = 'application/json;charset=utf-8';
    else if (lower.endsWith('.py')) mimeType = 'text/x-python;charset=utf-8';
    else if (lower.endsWith('.bat') || lower.endsWith('.cmd')) mimeType = 'application/x-bat;charset=utf-8';
    else if (lower.endsWith('.sh') || lower.endsWith('.bash')) mimeType = 'application/x-sh;charset=utf-8';
    else if (lower.endsWith('.svg')) mimeType = 'image/svg+xml;charset=utf-8';
    else if (lower.endsWith('.xml')) mimeType = 'application/xml;charset=utf-8';

    const blob = new Blob([block.code], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    confetti({ particleCount: 30, spread: 50, origin: { y: 0.7 } });
    onShowToast(`File "${filename}" berhasil diunduh!`, 'success');
  };

  const handleDownloadAttachment = (url: string, suggestedName?: string) => {
    const filename = suggestedName || `${note.slug || 'file'}.zip`;
    const success = triggerDirectDownload(url, filename);
    if (success) {
      confetti({ particleCount: 30, spread: 50, origin: { y: 0.7 } });
      onShowToast(`Memulai direct download file otomatis...`, 'success');
    } else {
      onShowToast('Membuka tautan file...', 'info');
    }
  };

  const handleShareNote = () => {
    triggerSmartShare({
      note,
      settings,
      onShowToast,
      onOpenModalFallback: () => setIsShareModalOpen(true),
    });
  };

  const formattedDate = new Date(note.createdAt).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="max-w-4xl mx-auto py-2">
      {/* Top Nav Action */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <button 
          onClick={onBack} 
          className="nb-btn px-3 py-1.5 text-xs font-black gap-1.5 bg-white text-black hover:bg-[#FAF5EE]"
        >
          <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
          <span>Kembali</span>
        </button>

        <div className="flex items-center gap-2">
          {isAdmin && (
            <>
              <button 
                onClick={() => onEdit(note)} 
                className="nb-btn bg-[#2DD4BF] hover:bg-[#5EEAD4] text-black px-3 py-1.5 text-xs font-black gap-1.5 border-2 border-black shadow-[2px_2px_0px_#000]"
                title="Edit Catatan Ini"
              >
                <Edit3 className="w-4 h-4 stroke-[2.5]" />
                <span>Edit Catatan</span>
              </button>
              {onDelete && (
                <button 
                  onClick={() => onDelete(note.id)} 
                  className="nb-btn bg-[#FFE4E6] hover:bg-[#FDA4AF] text-black px-3 py-1.5 text-xs font-black gap-1.5 border-2 border-black shadow-[2px_2px_0px_#000]"
                  title="Hapus Catatan Ini Secara Permanen"
                >
                  <Trash2 className="w-4 h-4 stroke-[2.5]" />
                  <span>Hapus</span>
                </button>
              )}
            </>
          )}

          <button 
            onClick={handleShareNote} 
            className="nb-btn bg-[#FFD233] hover:bg-[#FFE066] text-black px-3.5 py-1.5 text-xs font-black gap-1.5 border-2 border-black shadow-[2px_2px_0px_#000]"
          >
            <Share2 className="w-4 h-4 stroke-[2.5]" />
            <span>Bagikan</span>
          </button>
        </div>
      </div>

      {/* Main Neo-brutalist Note Container */}
      <article className="nb-box overflow-hidden bg-white border-2 border-black rounded-2xl shadow-[6px_6px_0px_#000]">
        {coverUrl && (
          <div className="w-full bg-[#FAF5EE] border-b-2 border-black overflow-hidden relative flex items-center justify-center p-3">
            <img
              src={coverUrl}
              alt={note.title}
              referrerPolicy="no-referrer"
              className="w-full h-auto max-h-[500px] object-contain rounded-xl border border-black/20"
            />
            <span className="absolute bottom-4 left-4 nb-badge bg-[#FFD233] text-black shadow-[2px_2px_0px_#000]">
              {note.category}
            </span>
          </div>
        )}

        <div className="p-5 sm:p-6 border-b-2 border-black bg-white">
          {!coverUrl && (
            <span className="nb-badge bg-[#FFD233] text-black inline-block mb-2 shadow-[2px_2px_0px_#000]">
              {note.category}
            </span>
          )}

          <h1 className="text-xl sm:text-2xl font-black text-black tracking-tight leading-snug mb-2">
            {note.title}
          </h1>

          {note.description && (
            <p className="text-xs sm:text-sm font-bold text-black/80 leading-relaxed mb-4">
              {note.description}
            </p>
          )}

          <div className="flex items-center gap-3 text-xs font-bold text-black/70 pt-2 border-t-2 border-black/10">
            <span className="flex items-center gap-1.5 text-black font-extrabold">
              <User className="w-3.5 h-3.5" />
              by: {note.author || 'Faiz_Fahmi_ID'}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              {formattedDate}
            </span>
            {!note.isPublic && (
              <>
                <span>•</span>
                <span className="nb-badge bg-[#FFE4E6] text-black border border-black text-[10px] flex items-center gap-1 font-black">
                  <Lock className="w-2.5 h-2.5 text-black" /> Akses Privat
                </span>
              </>
            )}
          </div>
        </div>

        {/* Direct Download Banner */}
        {note.fileDownloadUrl && (
          <div className="p-4 sm:p-5 bg-[#DCFCE7] border-b-2 border-black">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#22C55E] border-2 border-black flex items-center justify-center text-black shrink-0 shadow-[2px_2px_0px_#000]">
                  <Zap className="w-5 h-5 fill-black text-black stroke-[2.5]" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-black">
                    Unduh File Sumber / Script Paket
                  </h4>
                  <p className="text-xs font-bold text-black/75">
                    {note.fileDownloadName || 'File lampiran siap diunduh otomatis'}
                  </p>
                </div>
              </div>

              <button
                onClick={() => handleDownloadAttachment(note.fileDownloadUrl!, note.fileDownloadName)}
                className="nb-btn bg-[#22C55E] hover:bg-[#16A34A] text-black px-4 py-2 text-xs gap-2 font-black shrink-0 w-full sm:w-auto shadow-[2px_2px_0px_#000] border-2 border-black"
              >
                <Download className="w-4 h-4 stroke-[3] text-black" />
                <span className="text-black">Unduh Langsung</span>
              </button>
            </div>
          </div>
        )}

        {/* Content Blocks */}
        <div className="p-4 sm:p-6 space-y-4 bg-[#FAF5EE]">
          {note.blocks.map((block, index) => {
            if (block.type === 'text') {
              return (
                <div key={block.id} className="nb-box-sm p-4 bg-white text-xs leading-relaxed text-black font-medium">
                  <div className="markdown-body">
                    <ReactMarkdown
                      components={{
                        h1: ({ children }) => <h2 className="text-sm sm:text-base font-black text-black mt-2 mb-1 border-b-2 border-black/10 pb-1">{children}</h2>,
                        h2: ({ children }) => <h3 className="text-xs sm:text-sm font-extrabold text-black mt-1.5 mb-1">{children}</h3>,
                        p: ({ children }) => <p className="mb-2 leading-relaxed text-black/90 font-medium">{children}</p>,
                        ul: ({ children }) => <ul className="list-disc list-inside space-y-1 my-1.5 pl-1 text-black/90">{children}</ul>,
                        ol: ({ children }) => <ol className="list-decimal list-inside space-y-1 my-1.5 pl-1 text-black/90">{children}</ol>,
                        code: ({ children }) => <code className="px-1.5 py-0.5 rounded bg-[#FEF3C7] border border-black text-black font-mono text-xs font-bold">{children}</code>,
                      }}
                    >
                      {block.content}
                    </ReactMarkdown>
                  </div>
                </div>
              );
            }

            if (block.type === 'code') {
              const lines = block.code ? block.code.split('\n') : [];
              const isCopied = copiedBlockId === block.id;
              const filename = block.title ? block.title.trim() : `file_script_${index + 1}.txt`;
              const isHtml = filename.toLowerCase().endsWith('.html') || filename.toLowerCase().endsWith('.htm');
              const isPreviewingWeb = previewHtmlBlockIds[block.id] || false;
              const fileInfo = getFileInfo(filename, block.code);

              // Extract extension for badge
              const parts = filename.split('.');
              const ext = parts.length > 1 ? parts.pop()?.toUpperCase() : 'CODE';

              // =========================================================================
              // 🔒 MODE TERTUTUP (KODE DISEMBUNYIKAN - HANYA TOMBOL DOWNLOAD & INFO FILE)
              // =========================================================================
              if (block.hideCode) {
                return (
                  <div key={block.id} className="nb-box p-4 sm:p-5 bg-white border-2 border-black rounded-xl shadow-[4px_4px_0px_#000] space-y-3.5">
                    {/* Top Row: File Icon, Name, Category & Type Info */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div className={`w-12 h-12 rounded-xl border-2 border-black flex items-center justify-center shrink-0 ${fileInfo.badgeBg} shadow-[2px_2px_0px_#000]`}>
                          {fileInfo.icon}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-mono font-black text-sm sm:text-base text-black tracking-tight truncate max-w-[240px] sm:max-w-md" title={filename}>
                              {filename}
                            </span>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-black border border-black ${fileInfo.badgeBg} text-black uppercase`}>
                              {fileInfo.badge}
                            </span>
                          </div>
                          {block.description && (
                            <p className="text-[11px] font-bold text-black/70 mt-0.5">
                              {block.description}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="hidden sm:flex items-center gap-1.5 shrink-0">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#FAF5EE] border border-black text-[10px] font-black text-black">
                          <Lock className="w-3 h-3 text-black stroke-[2.5]" />
                          <span>Berkas Siap Unduh</span>
                        </span>
                      </div>
                    </div>

                    {/* Bottom Row: Prominent Direct Download Button & Copy Code Action */}
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 pt-2 border-t-2 border-black/10">
                      <button
                        onClick={() => handleDownloadCodeFile(block)}
                        className="nb-btn flex-1 bg-[#FFD233] hover:bg-[#FFE066] text-black font-black text-xs sm:text-sm py-2.5 px-4 gap-2 border-2 border-black shadow-[2px_2px_0px_#000]"
                        title={`Unduh file ${filename}`}
                      >
                        <Download className="w-4 h-4 stroke-[3] text-black shrink-0" />
                        <span>Unduh Berkas <strong>{filename}</strong></span>
                      </button>

                      <button
                        onClick={() => handleCopyCode(block)}
                        className={`nb-btn px-4 py-2.5 text-xs font-black border-2 border-black ${
                          isCopied ? 'bg-[#BBF7D0] text-black' : 'bg-white hover:bg-[#FAF5EE] text-black'
                        }`}
                        title="Salin isi kode tanpa membuka tampilan"
                      >
                        {isCopied ? <Check className="w-3.5 h-3.5 stroke-[3] text-black" /> : <Copy className="w-3.5 h-3.5 stroke-[2.5] text-black" />}
                        <span>{isCopied ? 'Tersalin!' : 'Salin Kode'}</span>
                      </button>
                    </div>
                  </div>
                );
              }

              // =========================================================================
              // 💻 MODE TERBUKA (TAMPILKAN KODE DI TERMINAL & TOMBOL DOWNLOAD)
              // =========================================================================
              return (
                <div key={block.id} className="nb-box-sm overflow-hidden bg-black text-white border-2 border-black shadow-[3px_3px_0px_#000]">
                  {/* Code Header */}
                  <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-2 bg-[#18181B] border-b-2 border-black text-xs">
                    <div className="flex items-center gap-2 overflow-hidden max-w-[60%] sm:max-w-none">
                      <Terminal className="w-4 h-4 text-[#FFD233] shrink-0" />
                      <span className="font-mono font-black text-white text-xs truncate" title={filename}>
                        {filename}
                      </span>
                      <span className="nb-badge bg-[#27272A] text-[#FFD233] text-[9px] font-mono font-bold px-1.5 py-0.5 border border-zinc-700">
                        .{ext}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0 flex-wrap">
                      {/* Web View Toggle for HTML files */}
                      {isHtml && (
                        <button
                          onClick={() => toggleHtmlPreview(block.id)}
                          className={`nb-btn px-2.5 py-1 text-[10px] font-black border border-black ${
                            isPreviewingWeb ? 'bg-[#38BDF8] text-black' : 'bg-zinc-800 text-white hover:bg-zinc-700'
                          }`}
                          title={isPreviewingWeb ? 'Tampilkan Kode Sumber' : 'Tampilkan Hasil Tampilan Website HTML'}
                        >
                          <Globe className="w-3 h-3 text-black" />
                          <span>{isPreviewingWeb ? 'Lihat Kode' : 'Tampilan Website'}</span>
                        </button>
                      )}

                      {/* Direct Download Button */}
                      <button
                        onClick={() => handleDownloadCodeFile(block)}
                        className="nb-btn px-2.5 py-1 text-[10px] bg-white text-black border border-black hover:bg-[#FAF5EE] font-black gap-1"
                        title={`Unduh file ${filename}`}
                      >
                        <Download className="w-3 h-3 text-black stroke-[2.5]" />
                        <span>Unduh <strong className="font-mono">{filename}</strong></span>
                      </button>

                      {/* Copy Code Button */}
                      <button
                        onClick={() => handleCopyCode(block)}
                        className={`nb-btn px-2.5 py-1 text-[10px] font-black border border-black ${
                          isCopied ? 'bg-[#BBF7D0] text-black' : 'bg-[#FFD233] text-black hover:bg-[#FFE066]'
                        }`}
                      >
                        {isCopied ? <Check className="w-3 h-3 stroke-[3] text-black" /> : <Copy className="w-3 h-3 stroke-[2.5] text-black" />}
                        <span className="text-black">{isCopied ? 'Tersalin' : 'Salin Kode'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Render Area: HTML Live Web Preview OR Code Snippet */}
                  {isHtml && isPreviewingWeb ? (
                    <div className="p-3 bg-zinc-900 border-t border-zinc-800 space-y-2">
                      <div className="flex items-center justify-between text-[11px] text-zinc-400 font-mono">
                        <span className="flex items-center gap-1.5 text-[#38BDF8] font-bold">
                          <Eye className="w-3.5 h-3.5 text-[#38BDF8]" /> Live Render Sandbox: {filename}
                        </span>
                        <span className="text-[10px] text-zinc-500">Preview Interaktif</span>
                      </div>
                      <iframe
                        srcDoc={block.code}
                        title={`Preview of ${filename}`}
                        className="w-full h-80 bg-white border-2 border-black rounded-xl shadow-inner"
                        sandbox="allow-scripts"
                      />
                    </div>
                  ) : (
                    <div className="p-3.5 overflow-x-auto font-mono text-xs text-[#4ADE80] bg-[#09090B]">
                      <pre className="flex">
                        {block.showLineNumbers !== false && (
                          <div className="select-none pr-3 text-right text-zinc-600 font-mono border-r border-zinc-800 mr-3">
                            {lines.map((_, i) => (
                              <div key={i}>{i + 1}</div>
                            ))}
                          </div>
                        )}
                        <code className="flex-1 whitespace-pre leading-relaxed">{block.code}</code>
                      </pre>
                    </div>
                  )}
                </div>
              );
            }

            if (block.type === 'file') {
              const fileBlock = block as FileBlock;
              return (
                <div key={block.id} className="nb-box-sm p-4 bg-[#DCFCE7] border-2 border-black flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-[2px_2px_0px_#000]">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="w-10 h-10 rounded-xl bg-[#22C55E] border-2 border-black flex items-center justify-center text-black shrink-0 shadow-[1px_1px_0px_#000]">
                      <Zap className="w-5 h-5 fill-black text-black stroke-[2.5]" />
                    </div>
                    <div className="overflow-hidden">
                      <h4 className="text-xs sm:text-sm font-black text-black truncate">
                        {fileBlock.title || 'File Lampiran / Script'}
                      </h4>
                      <p className="text-[11px] font-bold text-black/75">
                        {fileBlock.fileSize ? `Ukuran: ${fileBlock.fileSize} • ` : ''}
                        {isGoogleDriveUrl(fileBlock.url) ? '⚡ Google Drive Direct Download' : 'Tautan Download Langsung'}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDownloadAttachment(fileBlock.url, fileBlock.title)}
                    className="nb-btn bg-[#22C55E] hover:bg-[#16A34A] text-black px-4 py-2 text-xs gap-2 font-black shrink-0 w-full sm:w-auto shadow-[2px_2px_0px_#000] border-2 border-black"
                  >
                    <Download className="w-4 h-4 stroke-[3] text-black" />
                    <span className="text-black">Unduh File</span>
                  </button>
                </div>
              );
            }

            if (block.type === 'link') {
              const linkBlock = block as LinkBlock;
              const isCopied = copiedBlockId === linkBlock.id;
              return (
                <div key={block.id} className="nb-box-sm p-3.5 bg-[#F0F9FF] border-2 border-black flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-[2px_2px_0px_#000]">
                  <div className="flex items-start gap-3 overflow-hidden">
                    <div className="w-9 h-9 rounded-xl bg-[#38BDF8] border-2 border-black flex items-center justify-center text-black shrink-0 mt-0.5">
                      <ExternalLink className="w-4 h-4 text-black" />
                    </div>
                    <div className="overflow-hidden">
                      <h4 className="text-xs sm:text-sm font-black text-black truncate">
                        {linkBlock.title || 'Tautan Eksternal'}
                      </h4>
                      {linkBlock.description && (
                        <p className="text-xs font-medium text-black/80 line-clamp-2">
                          {linkBlock.description}
                        </p>
                      )}
                      <a 
                        href={linkBlock.url} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-[11px] font-mono font-bold text-sky-800 hover:underline truncate block max-w-sm sm:max-w-md mt-0.5"
                      >
                        {linkBlock.url}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                    <button
                      onClick={async () => {
                        try {
                          await navigator.clipboard.writeText(linkBlock.url);
                          setCopiedBlockId(linkBlock.id);
                          onShowToast('Link disalin ke clipboard!', 'success');
                          setTimeout(() => setCopiedBlockId(null), 2000);
                        } catch {
                          onShowToast('Gagal menyalin link', 'error');
                        }
                      }}
                      className="nb-btn px-2.5 py-1 text-xs gap-1.5 bg-white text-black hover:bg-[#FAF5EE] border-2 border-black font-black"
                    >
                      {isCopied ? <Check className="w-3.5 h-3.5 stroke-[2.5] text-black" /> : <Copy className="w-3.5 h-3.5 stroke-[2] text-black" />}
                      <span className="text-black">{isCopied ? 'Tersalin' : 'Salin'}</span>
                    </button>

                    <a
                      href={linkBlock.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="nb-btn bg-[#38BDF8] hover:bg-[#0284C7] text-black px-3 py-1 text-xs gap-1.5 font-black border-2 border-black"
                    >
                      <span className="text-black">Buka</span>
                      <ExternalLink className="w-3.5 h-3.5 text-black" />
                    </a>
                  </div>
                </div>
              );
            }

            if (block.type === 'image') {
              return (
                <div key={block.id} className="nb-box-sm p-3 bg-white space-y-2 flex flex-col items-center border-2 border-black">
                  <img
                    src={formatImageUrl(block.url)}
                    alt={block.caption || 'Gambar'}
                    referrerPolicy="no-referrer"
                    className="w-full h-auto max-h-[550px] object-contain rounded-lg border border-black/10"
                  />
                  {block.caption && (
                    <p className="text-center text-xs font-bold text-black/75">
                      {block.caption}
                    </p>
                  )}
                </div>
              );
            }

            return null;
          })}
        </div>

        {/* Viewer Footer */}
        <div className="px-5 py-3 bg-white border-t-2 border-black flex items-center justify-between text-xs font-bold text-black">
          <span>fahnotes • by: Faiz_Fahmi_ID</span>
          <button 
            onClick={handleShareNote} 
            className="nb-btn px-3 py-1 text-xs gap-1.5 bg-[#FAF5EE] text-black hover:bg-[#FFD233]"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Bagikan Catatan</span>
          </button>
        </div>
      </article>

      {/* Interactive Per-Device Share Dataset Modal */}
      <ShareModal
        note={note}
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        onShowToast={onShowToast}
      />
    </div>
  );
};
