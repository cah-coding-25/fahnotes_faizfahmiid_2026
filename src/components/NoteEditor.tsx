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
  Sparkles
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
        title: 'script.bat',
        language: 'bat',
        showLineNumbers: true,
        code: ''
      }
    ]);
    onShowToast('+ Blok Kode ditambahkan', 'info');
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
                <div className="space-y-2">
                  <div>
                    <label className="block text-[10px] font-black uppercase text-black mb-1">
                      Judul / Tipe Kode (Contoh: script.bat, index.html, main.py, .sh, dll)
                    </label>
                    <input
                      type="text"
                      placeholder="Contoh: script.bat / index.html / main.py / install.sh"
                      value={block.title}
                      onChange={(e) => updateCodeBlock(block.id, { title: e.target.value })}
                      className="nb-input w-full px-2.5 py-1.5 text-xs font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase text-black mb-1">
                      Isi Kode / Script
                    </label>
                    <textarea
                      rows={6}
                      placeholder="Tulis atau tempel kode di sini..."
                      value={block.code}
                      onChange={(e) => updateCodeBlock(block.id, { code: e.target.value })}
                      className="nb-input w-full p-3 bg-black text-[#4ADE80] font-mono text-xs"
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
            <button type="button" onClick={handleAddTextBlock} className="nb-btn px-3 py-1 text-xs gap-1.5 bg-white text-black border-2 border-black font-black">
              <FileText className="w-3.5 h-3.5 text-black" />
              <span className="text-black">Teks Markdown</span>
            </button>
            <button type="button" onClick={handleAddCodeBlock} className="nb-btn bg-[#FFD233] text-black hover:bg-[#FFE066] px-3 py-1 text-xs gap-1.5 font-black border-2 border-black">
              <Code className="w-3.5 h-3.5 stroke-[2.5] text-black" />
              <span className="text-black">Kode</span>
            </button>
            <button type="button" onClick={handleAddLinkBlock} className="nb-btn bg-[#818CF8] text-black hover:bg-[#9DA6FB] px-3 py-1 text-xs gap-1.5 font-black border-2 border-black">
              <LinkIcon className="w-3.5 h-3.5 stroke-[2.5] text-black" />
              <span className="text-black">Link</span>
            </button>
            <button type="button" onClick={handleAddFileBlock} className="nb-btn bg-[#22C55E] text-black hover:bg-[#4ADE80] px-3 py-1 text-xs gap-1.5 font-black border-2 border-black">
              <Download className="w-3.5 h-3.5 text-black stroke-[2.5]" />
              <span className="text-black">Direct Download (GDrive)</span>
            </button>
            <button type="button" onClick={handleAddImageBlock} className="nb-btn bg-white text-black px-3 py-1 text-xs gap-1.5 border-2 border-black font-black">
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
