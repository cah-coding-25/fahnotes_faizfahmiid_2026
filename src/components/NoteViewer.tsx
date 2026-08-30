import React, { useState } from 'react';
import { Note, CodeBlock, FileBlock, LinkBlock } from '../types';
import { formatImageUrl, triggerDirectDownload, isGoogleDriveUrl } from '../utils/driveHelper';
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
  Globe
} from 'lucide-react';

interface NoteViewerProps {
  note: Note;
  isAdmin: boolean;
  onBack: () => void;
  onEdit: (note: Note) => void;
  onShowToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const NoteViewer: React.FC<NoteViewerProps> = ({
  note,
  isAdmin,
  onBack,
  onEdit,
  onShowToast,
}) => {
  const [copiedBlockId, setCopiedBlockId] = useState<string | null>(null);
  const coverUrl = note.coverImage ? formatImageUrl(note.coverImage) : null;

  const handleCopyCode = async (block: CodeBlock) => {
    try {
      await navigator.clipboard.writeText(block.code);
      setCopiedBlockId(block.id);
      onShowToast(`Kode "${block.title || 'snippet'}" disalin!`, 'success');
      setTimeout(() => setCopiedBlockId(null), 2000);
    } catch {
      onShowToast('Gagal menyalin kode', 'error');
    }
  };

  const handleDownloadCodeFile = (block: CodeBlock) => {
    const filename = block.title || `snippet.${block.language || 'txt'}`;
    const blob = new Blob([block.code], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    onShowToast(`File ${filename} diunduh!`, 'success');
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

  const handleShareNote = async () => {
    const shareUrl = `${window.location.origin}${window.location.pathname}?note=${note.id}`;
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(shareUrl);
      }
      confetti({ particleCount: 25, spread: 45, origin: { y: 0.8 } });
      onShowToast('Link catatan berhasil disalin!', 'success');
    } catch {
      onShowToast(`Link: ${shareUrl}`, 'info');
    }
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
            <button 
              onClick={() => onEdit(note)} 
              className="nb-btn bg-[#2DD4BF] hover:bg-[#5EEAD4] text-black px-3 py-1.5 text-xs font-black gap-1.5"
            >
              <Edit3 className="w-4 h-4 stroke-[2.5]" />
              <span>Edit Catatan</span>
            </button>
          )}

          <button 
            onClick={handleShareNote} 
            className="nb-btn bg-[#FFD233] hover:bg-[#FFE066] text-black px-3.5 py-1.5 text-xs font-black gap-1.5"
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
              const lines = block.code.split('\n');
              const isCopied = copiedBlockId === block.id;

              return (
                <div key={block.id} className="nb-box-sm overflow-hidden bg-black text-white border-2 border-black shadow-[3px_3px_0px_#000]">
                  {/* Code Header */}
                  <div className="flex items-center justify-between px-3 py-1.5 bg-[#18181B] border-b-2 border-black text-xs">
                    <div className="flex items-center gap-2 overflow-hidden">
                      <Terminal className="w-4 h-4 text-[#FFD233] shrink-0" />
                      <span className="font-mono font-bold text-white text-xs truncate">
                        {block.title || `code_snippet_${index + 1}`}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => handleDownloadCodeFile(block)}
                        className="nb-btn px-2 py-0.5 text-[10px] bg-white text-black border border-black hover:bg-[#FAF5EE] font-bold"
                        title="Unduh File"
                      >
                        <Download className="w-3 h-3 text-black" />
                        <span className="hidden sm:inline text-black">Unduh</span>
                      </button>

                      <button
                        onClick={() => handleCopyCode(block)}
                        className={`nb-btn px-2.5 py-0.5 text-[10px] font-black border border-black ${
                          isCopied ? 'bg-[#BBF7D0] text-black' : 'bg-[#FFD233] text-black hover:bg-[#FFE066]'
                        }`}
                      >
                        {isCopied ? <Check className="w-3 h-3 stroke-[3] text-black" /> : <Copy className="w-3 h-3 stroke-[2.5] text-black" />}
                        <span className="text-black">{isCopied ? 'Tersalin' : 'Salin Kode'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Code Snippet Box */}
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
    </div>
  );
};
