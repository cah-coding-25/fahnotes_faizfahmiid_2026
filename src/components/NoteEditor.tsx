import React, { useState } from 'react';
import { Note, ContentBlock, TextBlock, CodeBlock, ImageBlock, FileBlock, LinkBlock, CodeLanguage } from '../types';
import { formatImageUrl, isGoogleDriveUrl } from '../utils/driveHelper';
import { 
  ArrowLeft, 
  Save, 
  Plus, 
  FileText, 
  Code, 
  Image as ImageIcon, 
  Trash2, 
  ChevronUp, 
  ChevronDown,
  Download,
  Link as LinkIcon,
  ExternalLink,
  Zap,
  Sparkles,
  Terminal,
  Lock,
  Eye,
  EyeOff,
  FileCode,
  Check
} from 'lucide-react';

interface NoteEditorProps {
  initialNote?: Note | null;
  onSave: (note: Note) => void;
  onCancel: () => void;
  onShowToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
  availableCategories?: string[];
  onAddNewCategory?: (newCat: string) => void;
}

export const NoteEditor: React.FC<NoteEditorProps> = ({
  initialNote,
  onSave,
  onCancel,
  onShowToast,
  availableCategories = [],
  onAddNewCategory
}) => {
  const isEditing = Boolean(initialNote);

  const initialCat = initialNote?.category || (availableCategories[0] || 'BAT Script');
  const [title, setTitle] = useState(initialNote?.title || '');
  const [description, setDescription] = useState(initialNote?.description || '');
  const [category, setCategory] = useState(initialCat);
  const [coverImage, setCoverImage] = useState(initialNote?.coverImage || '');
  const [author] = useState(initialNote?.author || 'Faiz_Fahmi_ID');
  const [isAddingNewCat, setIsAddingNewCat] = useState(false);
  const [newCatInput, setNewCatInput] = useState('');

  // Merge availableCategories with current category if needed
  const categoryOptions = React.useMemo(() => {
    const list = [...availableCategories];
    if (category && !list.includes(category)) {
      list.push(category);
    }
    return list.filter((c) => Boolean(c && c.trim()));
  }, [availableCategories, category]);

  const handleQuickAddCategory = () => {
    const clean = newCatInput.trim();
    if (!clean) return;
    if (onAddNewCategory) {
      onAddNewCategory(clean);
    }
    setCategory(clean);
    setNewCatInput('');
    setIsAddingNewCat(false);
    onShowToast(`Kategori "${clean}" ditambahkan!`, 'success');
  };

  const [blocks, setBlocks] = useState<ContentBlock[]>(
    initialNote?.blocks?.length
      ? initialNote.blocks
      : [
          {
            id: 'block-' + Date.now() + '-1',
            type: 'text',
            content: 'Tulis penjelasan catatan di sini...'
          },
          {
            id: 'block-' + Date.now() + '-2',
            type: 'code',
            title: 'script.bat',
            language: 'bat',
            showLineNumbers: true,
            code: '@echo off\necho Halo dari Faiz_Fahmi_ID!\npause'
          }
        ]
  );

  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle);
  };

  const generateUniqueId = (prefix: string) => {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  };

  const handleAddTextBlock = () => {
    setBlocks((prev) => [...prev, { id: generateUniqueId('block'), type: 'text', content: '' }]);
    onShowToast('+ Blok Teks ditambahkan', 'info');
  };

  const handleAddCodeBlock = () => {
    setBlocks((prev) => [
      ...prev,
      {
        id: generateUniqueId('block'),
        type: 'code',
        title: 'index.html',
        language: 'plain',
        showLineNumbers: true,
        hideCode: false,
        code: ''
      }
    ]);
    onShowToast('+ Blok File Script & Kode (Terbuka) ditambahkan', 'info');
  };

  const handleAddClosedFileBlock = () => {
    setBlocks((prev) => [
      ...prev,
      {
        id: generateUniqueId('block'),
        type: 'code',
        title: 'index.html',
        language: 'plain',
        showLineNumbers: false,
        hideCode: true,
        code: ''
      }
    ]);
    onShowToast('🔒 + Blok File Tertutup (Hanya Tombol Download) ditambahkan', 'info');
  };

  const handleAddFileBlock = () => {
    setBlocks((prev) => [
      ...prev,
      {
        id: generateUniqueId('block'),
        type: 'file',
        title: 'File_Download.zip',
        url: '',
        fileSize: '1.5 MB'
      }
    ]);
    onShowToast('+ Blok Direct Download File GDrive ditambahkan', 'info');
  };

  const handleAddImageBlock = () => {
    setBlocks((prev) => [...prev, { id: generateUniqueId('block'), type: 'image', url: '', caption: '' }]);
    onShowToast('+ Blok Gambar ditambahkan', 'info');
  };

  const handleAddLinkBlock = () => {
    setBlocks((prev) => [
      ...prev,
      {
        id: generateUniqueId('block'),
        type: 'link',
        title: '',
        url: '',
        description: ''
      }
    ]);
    onShowToast('+ Blok Link ditambahkan', 'info');
  };

  const handleMoveBlock = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === blocks.length - 1) return;
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const updated = [...blocks];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    setBlocks(updated);
  };

  const handleDeleteBlock = (id: string) => {
    if (blocks.length <= 1) {
      onShowToast('Minimal harus ada 1 blok konten', 'error');
      return;
    }
    setBlocks((prev) => prev.filter((b) => b.id !== id));
  };

  const updateTextBlock = (id: string, content: string) => {
    setBlocks((prev) => prev.map((b) => (b.id === id && b.type === 'text' ? { ...b, content } : b)));
  };

  const updateCodeBlock = (id: string, updates: Partial<CodeBlock>) => {
    setBlocks((prev) => prev.map((b) => (b.id === id && b.type === 'code' ? { ...b, ...updates } : b)));
  };

  const updateFileBlock = (id: string, updates: Partial<FileBlock>) => {
    setBlocks((prev) => prev.map((b) => (b.id === id && b.type === 'file' ? { ...b, ...updates } : b)));
  };

  const updateImageBlock = (id: string, updates: Partial<ImageBlock>) => {
    setBlocks((prev) => prev.map((b) => (b.id === id && b.type === 'image' ? { ...b, ...updates } : b)));
  };

  const updateLinkBlock = (id: string, updates: Partial<LinkBlock>) => {
    setBlocks((prev) => prev.map((b) => (b.id === id && b.type === 'link' ? { ...b, ...updates } : b)));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      onShowToast('Judul catatan wajib diisi!', 'error');
      return;
    }

    const autoSlug = title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '') || generateUniqueId('catatan');

    const noteToSave: Note = {
      id: initialNote?.id || generateUniqueId('note'),
      title: title.trim(),
      slug: initialNote?.slug || autoSlug,
      description: description.trim(),
      category: category.trim() || 'Umum',
      coverImage: coverImage.trim(),
      fileDownloadUrl: initialNote?.fileDownloadUrl || '',
      fileDownloadName: initialNote?.fileDownloadName || '',
      blocks: blocks,
      isPublic: true,
      createdAt: initialNote?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      author: author || 'Faiz_Fahmi_ID'
    };

    onSave(noteToSave);
  };

  const previewThumbnailUrl = coverImage ? formatImageUrl(coverImage) : null;
  const isDriveCover = isGoogleDriveUrl(coverImage);

  return (
    <div className="max-w-4xl mx-auto py-2">
      {/* Top Bar */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <button 
          onClick={onCancel} 
          className="nb-btn px-3 py-1.5 text-xs font-black gap-1.5 bg-white text-black hover:bg-[#FAF5EE]"
        >
          <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
          <span>Batal</span>
        </button>

        <button 
          onClick={handleSubmit} 
          className="nb-btn bg-[#FFD233] hover:bg-[#FFE066] text-black px-4 py-1.5 text-xs font-black gap-2 shadow-[2px_2px_0px_#000]"
        >
          <Save className="w-4 h-4 stroke-[2.5]" />
          <span>{isEditing ? 'Simpan Perubahan' : 'Terbitkan Catatan'}</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Info Card */}
        <div className="nb-box p-5 space-y-3 bg-white text-black">
          <div className="flex items-center justify-between pb-2 border-b-2 border-black">
            <h2 className="text-sm font-black uppercase tracking-wider text-black flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#FFD233]" />
              <span>{isEditing ? 'Edit Catatan (Admin Mode)' : 'Buat Catatan Baru (Admin Mode)'}</span>
            </h2>
            <span className="text-xs font-bold text-black/70">
              by: {author}
            </span>
          </div>

          <div>
            <label className="block text-xs font-black uppercase text-black mb-1">Judul Catatan *</label>
            <input
              type="text"
              required
              placeholder="Contoh: Script Otomasi Backup Folder .bat"
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              className="nb-input w-full px-3 py-2 text-xs font-bold"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-black uppercase text-black">Kategori</label>
                <button
                  type="button"
                  onClick={() => setIsAddingNewCat(!isAddingNewCat)}
                  className="text-[10px] font-black text-black underline hover:text-[#2DD4BF]"
                >
                  {isAddingNewCat ? '✕ Batal' : '+ Kategori Baru'}
                </button>
              </div>

              {isAddingNewCat ? (
                <div className="flex gap-1.5">
                  <input
                    type="text"
                    placeholder="Nama kategori baru..."
                    value={newCatInput}
                    onChange={(e) => setNewCatInput(e.target.value)}
                    autoFocus
                    className="nb-input flex-1 px-2.5 py-1.5 text-xs font-bold"
                  />
                  <button
                    type="button"
                    onClick={handleQuickAddCategory}
                    className="nb-btn bg-[#FFD233] text-black px-3 py-1 text-xs font-black"
                  >
                    Tambah
                  </button>
                </div>
              ) : (
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="nb-input w-full px-3 py-2 text-xs font-bold"
                >
                  {categoryOptions.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              )}
            </div>
            <div>
              <label className="block text-xs font-black uppercase text-black mb-1">Deskripsi Singkat</label>
              <input
                type="text"
                placeholder="Ringkasan singkat isi catatan..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="nb-input w-full px-3 py-2 text-xs font-medium"
              />
            </div>
          </div>

          {/* Thumbnail Cover */}
          <div className="pt-2 border-t-2 border-black/10">
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-black uppercase text-black">Cover / Thumbnail Gambar (GDrive atau URL)</label>
              {isDriveCover && <span className="nb-badge bg-[#BBF7D0] text-black text-[9px]">GDrive Terdeteksi</span>}
            </div>
            <input
              type="text"
              placeholder="https://drive.google.com/file/d/.../view atau link gambar"
              value={coverImage}
              onChange={(e) => setCoverImage(e.target.value)}
              className="nb-input w-full px-3 py-2 text-xs font-medium"
            />
            {previewThumbnailUrl && (
              <div className="mt-2 p-2 bg-[#FAF5EE] rounded-xl border-2 border-black overflow-hidden flex items-center justify-center">
                <img src={previewThumbnailUrl} alt="Thumbnail Preview" referrerPolicy="no-referrer" className="w-full h-auto max-h-56 object-contain rounded-lg" />
              </div>
            )}
          </div>
        </div>

        {/* Content Blocks */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-black uppercase text-black">
              Blok Konten ({blocks.length})
            </span>
          </div>

          {blocks.map((block, index) => (
            <div key={block.id} className="nb-box-sm p-3.5 bg-white space-y-2">
              <div className="flex items-center justify-between pb-1.5 border-b-2 border-black/10">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-lg bg-[#FFD233] text-black border border-black text-[10px] font-black flex items-center justify-center shadow-[1px_1px_0px_#000]">
                    {index + 1}
                  </span>
                  <span className="text-xs font-black uppercase text-black">
                    {block.type === 'text' && 'Teks Markdown'}
                    {block.type === 'code' && 'Kode / Script'}
                    {block.type === 'file' && 'File Download (Google Drive)'}
                    {block.type === 'link' && 'Link / Tautan Web'}
                    {block.type === 'image' && 'Gambar (Rasio Asli Penuh)'}
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    disabled={index === 0}
                    onClick={() => handleMoveBlock(index, 'up')}
                    className="nb-btn p-1 text-xs disabled:opacity-30 bg-white text-black"
                  >
                    <ChevronUp className="w-3.5 h-3.5 text-black" />
                  </button>
                  <button
                    type="button"
                    disabled={index === blocks.length - 1}
                    onClick={() => handleMoveBlock(index, 'down')}
                    className="nb-btn p-1 text-xs disabled:opacity-30 bg-white text-black"
                  >
                    <ChevronDown className="w-3.5 h-3.5 text-black" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteBlock(block.id)}
                    className="nb-btn bg-[#FFE4E6] text-black hover:bg-[#FDA4AF] p-1 text-xs ml-1 border-2 border-black"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-black" />
                  </button>
                </div>
              </div>

              {block.type === 'text' && (
                <textarea
                  rows={4}
                  placeholder="Tulis penjelasan materi / Markdown di sini..."
                  value={block.content}
                  onChange={(e) => updateTextBlock(block.id, e.target.value)}
                  className="nb-input w-full p-2.5 text-xs font-medium"
                />
              )}

              {block.type === 'code' && (
                <div className="space-y-3.5 p-3.5 bg-[#09090B] text-white rounded-xl border-2 border-black shadow-[3px_3px_0px_#000]">
                  {/* Header & Mode Switcher */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-zinc-800">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-[#FFD233] border border-black flex items-center justify-center">
                        <Terminal className="w-3.5 h-3.5 text-black stroke-[2.5]" />
                      </div>
                      <span className="text-xs font-black text-[#FFD233] uppercase tracking-wider">
                        File Script & Kolom Code
                      </span>
                    </div>

                    {/* Mode Switcher: Terbuka vs Tertutup */}
                    <div className="flex items-center gap-1.5 bg-[#18181B] p-1 rounded-lg border border-zinc-700">
                      <button
                        type="button"
                        onClick={() => updateCodeBlock(block.id, { hideCode: false })}
                        className={`px-2.5 py-1 rounded text-[10px] font-black flex items-center gap-1 transition-all ${
                          !block.hideCode 
                            ? 'bg-[#FFD233] text-black shadow-sm' 
                            : 'text-zinc-400 hover:text-white'
                        }`}
                        title="Kode akan tampil di layar dalam kotak terminal"
                      >
                        <Eye className="w-3 h-3" />
                        <span>Mode Terbuka</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => updateCodeBlock(block.id, { hideCode: true })}
                        className={`px-2.5 py-1 rounded text-[10px] font-black flex items-center gap-1 transition-all ${
                          block.hideCode 
                            ? 'bg-[#38BDF8] text-black shadow-sm' 
                            : 'text-zinc-400 hover:text-white'
                        }`}
                        title="Kode tersembunyi, hanya tombol download dan info file yang tampil"
                      >
                        <Lock className="w-3 h-3" />
                        <span>Mode Tertutup (Hanya Download)</span>
                      </button>
                    </div>
                  </div>

                  {/* Mode Banner Description */}
                  {block.hideCode ? (
                    <div className="p-2.5 bg-[#0369A1]/30 border border-[#38BDF8]/50 rounded-lg flex items-center gap-2 text-xs text-[#E0F2FE]">
                      <Lock className="w-4 h-4 text-[#38BDF8] shrink-0" />
                      <span className="text-[11px] font-medium leading-tight">
                        <strong>Mode File Tertutup Aktif:</strong> Di halaman publik, kode <strong>TIDAK akan kelihatan</strong>. Yang muncul hanya nama file (misal: <code>{block.title || 'index.html'}</code>), jenis file, dan tombol download langsung!
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between text-[11px] text-zinc-400 px-1">
                      <span>💡 Kode akan ditampilkan penuh dengan syntax terminal & tombol download.</span>
                      <label className="flex items-center gap-1.5 text-[10px] text-zinc-300 font-bold cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={block.showLineNumbers !== false}
                          onChange={(e) => updateCodeBlock(block.id, { showLineNumbers: e.target.checked })}
                          className="rounded border-zinc-700 bg-zinc-900 text-[#FFD233]"
                        />
                        <span>Nomor Baris</span>
                      </label>
                    </div>
                  )}

                  {/* File Name Field */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-[10px] font-black uppercase text-zinc-200">
                        Nama File Lengkap (Bebas: index.html, script.bat, bot.py, style.css, exploit.sh, dll) *
                      </label>
                      <span className="text-[9px] text-[#FFD233] font-mono font-bold">
                        Bebas Custom Ekstensi
                      </span>
                    </div>
                    <input
                      type="text"
                      placeholder="Contoh: index.html / backup.bat / bot.py / main.sh / styles.css / config.json"
                      value={block.title}
                      onChange={(e) => updateCodeBlock(block.id, { title: e.target.value })}
                      className="nb-input w-full px-3 py-2 text-xs font-mono font-bold bg-[#18181B] text-[#FFD233] border-2 border-zinc-700 focus:border-[#FFD233]"
                    />
                  </div>

                  {/* Optional File Description */}
                  <div>
                    <label className="block text-[10px] font-black uppercase text-zinc-200 mb-1">
                      Keterangan Singkat File (Opsional)
                    </label>
                    <input
                      type="text"
                      placeholder="Contoh: File template HTML siap pakai / Script otomatisasi backup harian"
                      value={block.description || ''}
                      onChange={(e) => updateCodeBlock(block.id, { description: e.target.value })}
                      className="nb-input w-full px-3 py-1.5 text-xs bg-[#18181B] text-zinc-200 border border-zinc-700 focus:border-[#FFD233]"
                    />
                  </div>

                  {/* Code Textarea Field */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-[10px] font-black uppercase text-zinc-200">
                        Kolom Code / Isi Script Yang Akan Disimpan & Diunduh *
                      </label>
                      <span className="text-[9px] text-zinc-400 font-mono">
                        {block.code ? `${block.code.split('\n').length} baris • ${(new Blob([block.code]).size / 1024).toFixed(1)} KB` : '0 baris'}
                      </span>
                    </div>
                    <textarea
                      rows={block.hideCode ? 6 : 8}
                      placeholder="Ketik atau tempel kode script apapun di sini tanpa batasan (HTML, BAT, Python, JS, Bash, JSON, SQL, PHP, CSS, C++, dll)..."
                      value={block.code}
                      onChange={(e) => updateCodeBlock(block.id, { code: e.target.value })}
                      className="nb-input w-full p-3 bg-[#000000] text-[#4ADE80] font-mono text-xs border-2 border-zinc-800 focus:border-[#4ADE80] leading-relaxed"
                      spellCheck={false}
                    />
                  </div>
                </div>
              )}

              {block.type === 'file' && (
                <div className="space-y-2 p-3 bg-[#DCFCE7] rounded-xl border-2 border-black">
                  <div className="flex items-center justify-between pb-1">
                    <label className="text-[10px] font-black uppercase text-black flex items-center gap-1">
                      <Zap className="w-3.5 h-3.5 text-black fill-black" /> Direct Download File (Google Drive)
                    </label>
                    {isGoogleDriveUrl((block as FileBlock).url) && (
                      <span className="nb-badge bg-white text-black text-[9px] border border-black font-black">
                        ✓ GDrive Terdeteksi
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-black uppercase text-black mb-1">Nama File Download</label>
                      <input
                        type="text"
                        placeholder="Contoh: Script_Backup.bat / Paket.zip"
                        value={(block as FileBlock).title}
                        onChange={(e) => updateFileBlock(block.id, { title: e.target.value })}
                        className="nb-input w-full px-2.5 py-1.5 text-xs font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase text-black mb-1">Ukuran File (Opsional)</label>
                      <input
                        type="text"
                        placeholder="Contoh: 15 KB / 1.5 MB"
                        value={(block as FileBlock).fileSize || ''}
                        onChange={(e) => updateFileBlock(block.id, { fileSize: e.target.value })}
                        className="nb-input w-full px-2.5 py-1.5 text-xs font-bold"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase text-black mb-1">Link File Google Drive / URL</label>
                    <input
                      type="text"
                      placeholder="https://drive.google.com/file/d/1A2B3C.../view"
                      value={(block as FileBlock).url}
                      onChange={(e) => updateFileBlock(block.id, { url: e.target.value })}
                      className="nb-input w-full px-2.5 py-1.5 text-xs font-mono"
                    />
                  </div>
                  <p className="text-[10px] font-bold text-black/75">
                    * Pengunjung akan langsung mendownload file tanpa membuka halaman preview Google Drive.
                  </p>
                </div>
              )}

              {block.type === 'link' && (
                <div className="space-y-2 p-3 bg-[#F0F9FF] rounded-xl border-2 border-black">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-black uppercase text-black mb-1">Judul Tautan / Sumber</label>
                      <input
                        type="text"
                        placeholder="Contoh: Dokumentasi Resmi / Repo GitHub"
                        value={(block as LinkBlock).title}
                        onChange={(e) => updateLinkBlock(block.id, { title: e.target.value })}
                        className="nb-input w-full px-2.5 py-1.5 text-xs font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase text-black mb-1">URL Website / Link</label>
                      <input
                        type="text"
                        placeholder="https://example.com/..."
                        value={(block as LinkBlock).url}
                        onChange={(e) => updateLinkBlock(block.id, { url: e.target.value })}
                        className="nb-input w-full px-2.5 py-1.5 text-xs font-mono"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase text-black mb-1">Keterangan Singkat (Opsional)</label>
                    <input
                      type="text"
                      placeholder="Penjelasan singkat..."
                      value={(block as LinkBlock).description || ''}
                      onChange={(e) => updateLinkBlock(block.id, { description: e.target.value })}
                      className="nb-input w-full px-2.5 py-1.5 text-xs"
                    />
                  </div>
                </div>
              )}

              {block.type === 'image' && (
                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder="Link gambar Google Drive atau URL langsung..."
                    value={block.url}
                    onChange={(e) => updateImageBlock(block.id, { url: e.target.value })}
                    className="nb-input w-full px-2.5 py-1.5 text-xs font-medium"
                  />
                  <input
                    type="text"
                    placeholder="Keterangan / Caption gambar (opsional)..."
                    value={block.caption || ''}
                    onChange={(e) => updateImageBlock(block.id, { caption: e.target.value })}
                    className="nb-input w-full px-2.5 py-1.5 text-xs"
                  />
                  {block.url && (
                    <div className="p-2 bg-[#FAF5EE] rounded-xl border-2 border-black flex items-center justify-center">
                      <img 
                        src={formatImageUrl(block.url)} 
                        alt="Preview" 
                        referrerPolicy="no-referrer" 
                        className="w-full h-auto max-h-56 object-contain rounded-lg" 
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}

          {/* Quick Add Bar */}
          <div className="p-3 bg-[#FFFBEB] rounded-xl border-2 border-black flex flex-wrap items-center justify-center gap-2 shadow-[2px_2px_0px_#000]">
            <span className="text-xs font-black text-black mr-1 flex items-center gap-1">
              <Plus className="w-3.5 h-3.5 stroke-[3] text-black" /> Tambah Blok:
            </span>
            <button type="button" onClick={handleAddTextBlock} className="nb-btn px-3 py-1.5 text-xs gap-1.5 bg-white text-black border-2 border-black font-black hover:bg-[#FAF5EE]">
              <FileText className="w-3.5 h-3.5 text-black" />
              <span className="text-black">Teks Markdown</span>
            </button>
            <button type="button" onClick={handleAddCodeBlock} className="nb-btn bg-[#FFD233] text-black hover:bg-[#FFE066] px-3.5 py-1.5 text-xs gap-1.5 font-black border-2 border-black shadow-[2px_2px_0px_#000]">
              <Terminal className="w-4 h-4 stroke-[2.5] text-black" />
              <span className="text-black">+ File & Kode (Terbuka)</span>
            </button>
            <button type="button" onClick={handleAddClosedFileBlock} className="nb-btn bg-[#38BDF8] text-black hover:bg-[#7DD3FC] px-3.5 py-1.5 text-xs gap-1.5 font-black border-2 border-black shadow-[2px_2px_0px_#000]">
              <Lock className="w-4 h-4 stroke-[2.5] text-black" />
              <span className="text-black">+ File Tertutup (Hanya Download)</span>
            </button>
            <button type="button" onClick={handleAddLinkBlock} className="nb-btn bg-[#818CF8] text-black hover:bg-[#9DA6FB] px-3 py-1.5 text-xs gap-1.5 font-black border-2 border-black">
              <LinkIcon className="w-3.5 h-3.5 stroke-[2.5] text-black" />
              <span className="text-black">Link</span>
            </button>
            <button type="button" onClick={handleAddFileBlock} className="nb-btn bg-[#22C55E] text-black hover:bg-[#4ADE80] px-3 py-1.5 text-xs gap-1.5 font-black border-2 border-black">
              <Download className="w-3.5 h-3.5 text-black stroke-[2.5]" />
              <span className="text-black">Direct GDrive</span>
            </button>
            <button type="button" onClick={handleAddImageBlock} className="nb-btn bg-white text-black px-3 py-1.5 text-xs gap-1.5 border-2 border-black font-black hover:bg-[#FAF5EE]">
              <ImageIcon className="w-3.5 h-3.5 text-black" />
              <span className="text-black">Gambar</span>
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <button 
            type="button" 
            onClick={onCancel} 
            className="nb-btn px-4 py-2 text-xs bg-white text-black hover:bg-[#FAF5EE]"
          >
            Batal
          </button>
          <button 
            type="submit" 
            className="nb-btn bg-[#FFD233] hover:bg-[#FFE066] text-black px-6 py-2 text-xs font-black gap-2 shadow-[2px_2px_0px_#000]"
          >
            <Save className="w-4 h-4 stroke-[2.5]" />
            <span>Simpan Catatan</span>
          </button>
        </div>
      </form>
    </div>
  );
};
