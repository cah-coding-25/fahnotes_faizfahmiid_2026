/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Note, AppSettings } from './types';
import { 
  getLocalNotes, 
  saveLocalNotes, 
  clearAllLocalNotes,
  getLocalSettings, 
  saveLocalSettings, 
  syncFromGoogleSheets, 
  syncAllToGoogleSheets,
  testSheetsConnection,
  saveAdminCredentialsToSheets,
  saveCategoriesToSheets
} from './utils/googleSheetsApi';
import { Header } from './components/Header';
import { NoteCard } from './components/NoteCard';
import { NoteViewer } from './components/NoteViewer';
import { NoteEditor } from './components/NoteEditor';
import { LoginModal } from './components/LoginModal';
import { GoogleSheetsModal } from './components/GoogleSheetsModal';
import { Footer } from './components/Footer';
import { ToastContainer, ToastMessage } from './components/Toast';
import { LoadingScreen } from './components/LoadingScreen';
import confetti from 'canvas-confetti';
import { 
  Plus, 
  FileCode2, 
  Database, 
  UploadCloud, 
  DownloadCloud, 
  Sparkles, 
  CheckCircle2, 
  Terminal, 
  Code2, 
  FolderPlus, 
  BookOpen, 
  Lock, 
  ShieldCheck, 
  LogOut 
} from 'lucide-react';

export default function App() {
  const [notes, setNotes] = useState<Note[]>(() => getLocalNotes());
  const [settings, setSettings] = useState<AppSettings>(() => getLocalSettings());
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    return localStorage.getItem('fahnotes_admin_logged_in') === 'true';
  });

  const [viewMode, setViewMode] = useState<'list' | 'viewer' | 'editor'>('list');
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [editingNote, setEditingNote] = useState<Note | null>(null);

  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSheetsModalOpen, setIsSheetsModalOpen] = useState(false);
  const [sheetsModalTab, setSheetsModalTab] = useState<'categories' | 'account' | 'database'>('categories');
  const [isSyncing, setIsSyncing] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [loadingText, setLoadingText] = useState('Memuat data, harap tunggu...');

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');

  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const uniqueSuffix = Math.random().toString(36).substring(2, 9);
    const id = `toast-${Date.now()}-${uniqueSuffix}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 2800);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // URL query parameter routing (?note=...)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const noteParam = params.get('note');
    if (noteParam) {
      const found = notes.find((n) => n.id === noteParam || n.slug === noteParam);
      if (found) {
        setSelectedNote(found);
        setViewMode('viewer');
      }
    }
  }, [notes]);

  // Initial auto-pull from Google Sheets with cool Neobrutalist loader
  useEffect(() => {
    let isMounted = true;
    const startInit = async () => {
      if (settings.googleSheetsWebAppUrl && settings.googleSheetsWebAppUrl.startsWith('http')) {
        setLoadingText('Memuat, harap tunggu...');
        try {
          const res = await syncFromGoogleSheets(settings.googleSheetsWebAppUrl);
          if (isMounted && res.success) {
            if (res.notes) {
              setNotes(res.notes);
              saveLocalNotes(res.notes);
            }
            const updated: AppSettings = {
              ...settings,
              isSheetsConnected: true,
              lastSyncedAt: new Date().toISOString(),
              categories: res.categories && res.categories.length > 0 ? res.categories : settings.categories,
              adminUsername: res.settings?.adminUsername || settings.adminUsername,
              adminPasswordHash: res.settings?.adminPassword || settings.adminPasswordHash
            };
            setSettings(updated);
            saveLocalSettings(updated);
          }
        } catch (e) {
          console.error(e);
        }
      }
      
      // Smooth visual transition delay for the loading animation
      setTimeout(() => {
        if (isMounted) setIsInitialLoading(false);
      }, 700);
    };

    startInit();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleUpdateNotes = (newNotes: Note[]) => {
    setNotes(newNotes);
    saveLocalNotes(newNotes);

    if (settings.googleSheetsWebAppUrl) {
      syncAllToGoogleSheets(settings.googleSheetsWebAppUrl, newNotes, settings).catch(() => {});
    }
  };

  const handleLogin = (user: string, pass: string): boolean => {
    if (
      user.toLowerCase() === settings.adminUsername.toLowerCase() &&
      pass === settings.adminPasswordHash
    ) {
      setIsAdmin(true);
      localStorage.setItem('fahnotes_admin_logged_in', 'true');
      return true;
    }
    return false;
  };

  const handleLogout = () => {
    setIsAdmin(false);
    localStorage.removeItem('fahnotes_admin_logged_in');
    addToast('Mode Admin ditutup', 'info');
  };

  const handleOpenSheetsModal = (tab: 'categories' | 'account' | 'database' = 'categories') => {
    setSheetsModalTab(tab);
    setIsSheetsModalOpen(true);
  };

  // Master Category List (Dynamic from settings.categories + notes)
  const categories = useMemo(() => {
    const set = new Set<string>();
    set.add('Semua');

    // Add preset/configured categories
    (settings.categories || []).forEach((c) => {
      if (c && c.trim()) set.add(c.trim());
    });

    // Add categories present in current notes
    notes.forEach((n) => {
      if (isAdmin || n.isPublic !== false) {
        if (n.category) set.add(n.category.trim());
      }
    });

    return Array.from(set);
  }, [notes, settings.categories, isAdmin]);

  // Categories list without 'Semua' for management
  const editableCategories = useMemo(() => {
    return categories.filter((c) => c !== 'Semua');
  }, [categories]);

  // --- Category CRUD Actions ---
  const handleAddCategory = async (newCategory: string) => {
    const clean = newCategory.trim();
    if (!clean) return;
    const currentList = settings.categories || ['BAT Script', 'HTML / Web', 'Python', 'JavaScript', 'Otomasi', 'Tutorial'];
    if (currentList.some((c) => c.toLowerCase() === clean.toLowerCase())) return;

    const updatedCategories = [...currentList, clean];
    const updatedSettings = {
      ...settings,
      categories: updatedCategories
    };
    setSettings(updatedSettings);
    saveLocalSettings(updatedSettings);
    addToast(`Kategori "${clean}" berhasil ditambahkan!`, 'success');

    if (settings.googleSheetsWebAppUrl) {
      saveCategoriesToSheets(settings.googleSheetsWebAppUrl, updatedCategories, notes).catch(() => {});
    }
  };

  const handleEditCategory = async (oldCategory: string, newCategory: string) => {
    const clean = newCategory.trim();
    if (!clean || clean === oldCategory) return;

    const currentList = settings.categories || ['BAT Script', 'HTML / Web', 'Python', 'JavaScript', 'Otomasi', 'Tutorial'];
    const updatedCategories = currentList.map((c) => (c.toLowerCase() === oldCategory.toLowerCase() ? clean : c));
    if (!updatedCategories.includes(clean)) {
      updatedCategories.push(clean);
    }

    const updatedSettings = {
      ...settings,
      categories: updatedCategories
    };
    setSettings(updatedSettings);
    saveLocalSettings(updatedSettings);

    // Update all notes with the old category
    let noteUpdatedCount = 0;
    const updatedNotes = notes.map((n) => {
      if (n.category.toLowerCase() === oldCategory.toLowerCase()) {
        noteUpdatedCount++;
        return { ...n, category: clean };
      }
      return n;
    });

    if (noteUpdatedCount > 0) {
      setNotes(updatedNotes);
      saveLocalNotes(updatedNotes);
    }

    if (selectedCategory === oldCategory) {
      setSelectedCategory(clean);
    }

    addToast(`Kategori diperbarui menjadi "${clean}" (${noteUpdatedCount} catatan diupdate)!`, 'success');

    if (settings.googleSheetsWebAppUrl) {
      saveCategoriesToSheets(settings.googleSheetsWebAppUrl, updatedCategories, updatedNotes).catch(() => {});
      if (noteUpdatedCount > 0) {
        syncAllToGoogleSheets(settings.googleSheetsWebAppUrl, updatedNotes, updatedSettings).catch(() => {});
      }
    }
  };

  const handleDeleteCategory = async (categoryToDelete: string) => {
    const currentList = settings.categories || ['BAT Script', 'HTML / Web', 'Python', 'JavaScript', 'Otomasi', 'Tutorial'];
    const updatedCategories = currentList.filter((c) => c.toLowerCase() !== categoryToDelete.toLowerCase());

    const updatedSettings = {
      ...settings,
      categories: updatedCategories
    };
    setSettings(updatedSettings);
    saveLocalSettings(updatedSettings);

    // Reassign affected notes to 'Umum'
    let noteReassignedCount = 0;
    const updatedNotes = notes.map((n) => {
      if (n.category.toLowerCase() === categoryToDelete.toLowerCase()) {
        noteReassignedCount++;
        return { ...n, category: 'Umum' };
      }
      return n;
    });

    if (noteReassignedCount > 0) {
      setNotes(updatedNotes);
      saveLocalNotes(updatedNotes);
    }

    if (selectedCategory === categoryToDelete) {
      setSelectedCategory('Semua');
    }

    addToast(`Kategori "${categoryToDelete}" dihapus.`, 'info');

    if (settings.googleSheetsWebAppUrl) {
      saveCategoriesToSheets(settings.googleSheetsWebAppUrl, updatedCategories, updatedNotes).catch(() => {});
      if (noteReassignedCount > 0) {
        syncAllToGoogleSheets(settings.googleSheetsWebAppUrl, updatedNotes, updatedSettings).catch(() => {});
      }
    }
  };

  const handleSyncCategoriesToSheets = async () => {
    if (!settings.googleSheetsWebAppUrl) {
      addToast('Masukkan URL Web App Google Sheets terlebih dahulu!', 'error');
      return;
    }
    setIsSyncing(true);
    const res = await saveCategoriesToSheets(settings.googleSheetsWebAppUrl, editableCategories, notes);
    setIsSyncing(false);
    if (res.success) {
      addToast('Daftar kategori berhasil disinkronkan ke Google Spreadsheet!', 'success');
    } else {
      addToast(res.error || 'Gagal sinkronisasi kategori ke Spreadsheet.', 'error');
    }
  };

  // --- Admin Account Credentials Action ---
  const handleUpdateAdminCredentials = async (newUsername: string, newPassword: string): Promise<boolean> => {
    const updatedSettings: AppSettings = {
      ...settings,
      adminUsername: newUsername.trim(),
      adminPasswordHash: newPassword.trim(),
      authorName: newUsername.trim()
    };
    setSettings(updatedSettings);
    saveLocalSettings(updatedSettings);

    if (settings.googleSheetsWebAppUrl) {
      const res = await saveAdminCredentialsToSheets(settings.googleSheetsWebAppUrl, newUsername.trim(), newPassword.trim());
      if (res.success) {
        addToast('Kredensial Admin berhasil disimpan ke Google Spreadsheet!', 'success');
        return true;
      }
    }
    addToast('Kredensial Admin diperbarui secara lokal.', 'success');
    return false;
  };

  const filteredNotes = useMemo(() => {
    return notes.filter((note) => {
      // If user is not admin, hide unlisted/private notes
      if (!isAdmin && note.isPublic === false) return false;

      const matchesCategory =
        selectedCategory === 'Semua' || note.category === selectedCategory;

      if (!matchesCategory) return false;
      if (!searchQuery.trim()) return true;

      const q = searchQuery.toLowerCase();
      const matchTitle = note.title.toLowerCase().includes(q);
      const matchDesc = note.description.toLowerCase().includes(q);
      const matchCat = note.category.toLowerCase().includes(q);
      const matchBlock = (note.blocks || []).some((b) => {
        if (b.type === 'text') return b.content.toLowerCase().includes(q);
        if (b.type === 'code')
          return (
            b.title.toLowerCase().includes(q) ||
            b.code.toLowerCase().includes(q) ||
            b.language.toLowerCase().includes(q)
          );
        return false;
      });

      return matchTitle || matchDesc || matchCat || matchBlock;
    });
  }, [notes, selectedCategory, searchQuery, isAdmin]);

  const handleOpenNote = (note: Note) => {
    setSelectedNote(note);
    setViewMode('viewer');
    const newUrl = `${window.location.pathname}?note=${note.id}`;
    window.history.pushState({ noteId: note.id }, '', newUrl);
  };

  const handleBackToList = () => {
    setViewMode('list');
    setSelectedNote(null);
    setEditingNote(null);
    window.history.pushState({}, '', window.location.pathname);
  };

  const handleStartCreateNote = () => {
    if (!isAdmin) {
      setIsLoginOpen(true);
      addToast('Login admin (admin / admin123) untuk menulis atau mengedit', 'info');
      return;
    }
    setEditingNote(null);
    setViewMode('editor');
  };

  const handleStartEditNote = (note: Note) => {
    if (!isAdmin) {
      setIsLoginOpen(true);
      addToast('Hanya admin yang dapat mengedit catatan', 'info');
      return;
    }
    setEditingNote(note);
    setViewMode('editor');
  };

  const handleSaveNote = (savedNote: Note) => {
    let updated: Note[];
    const exists = notes.some((n) => n.id === savedNote.id);
    if (exists) {
      updated = notes.map((n) => (n.id === savedNote.id ? savedNote : n));
      addToast('Catatan diperbarui!', 'success');
    } else {
      updated = [savedNote, ...notes];
      addToast('Catatan baru ditambahkan!', 'success');
      confetti({ particleCount: 35, spread: 60, origin: { y: 0.6 } });
    }

    handleUpdateNotes(updated);
    setSelectedNote(savedNote);
    setViewMode('viewer');
  };

  const handleDeleteNote = (id: string) => {
    if (window.confirm('Hapus catatan ini secara permanen?')) {
      const updated = notes.filter((n) => n.id !== id);
      handleUpdateNotes(updated);
      addToast('Catatan berhasil dihapus!', 'info');
      if (selectedNote?.id === id) {
        handleBackToList();
      }
    }
  };

  const handleClearAllNotes = () => {
    if (window.confirm('Apakah Anda yakin ingin mengosongkan seluruh konten (0 Catatan)?')) {
      clearAllLocalNotes();
      setNotes([]);
      if (settings.googleSheetsWebAppUrl) {
        syncAllToGoogleSheets(settings.googleSheetsWebAppUrl, [], settings).catch(() => {});
      }
      addToast('Seluruh konten telah dibersihkan menjadi 0 catatan.', 'info');
      handleBackToList();
    }
  };

  const handleSyncAllToSheets = async () => {
    if (!settings.googleSheetsWebAppUrl) {
      setIsSheetsModalOpen(true);
      addToast('Masukkan URL Web App Google Apps Script terlebih dahulu!', 'error');
      return;
    }
    setIsSyncing(true);
    const res = await syncAllToGoogleSheets(settings.googleSheetsWebAppUrl, notes, settings);
    setIsSyncing(false);
    if (res.success) {
      confetti({ particleCount: 45, spread: 70, origin: { y: 0.5 } });
      addToast(res.message || '⚡ Seluruh catatan & 13 kolom otomatis terbuat di Spreadsheet!', 'success');
      const updatedSettings = {
        ...settings,
        isSheetsConnected: true,
        lastSyncedAt: new Date().toISOString()
      };
      setSettings(updatedSettings);
      saveLocalSettings(updatedSettings);
    } else {
      addToast(res.error || 'Gagal sinkronisasi ke Spreadsheet.', 'error');
    }
  };

  const handlePullFromSheets = async () => {
    if (!settings.googleSheetsWebAppUrl) {
      setIsSheetsModalOpen(true);
      addToast('Masukkan URL Web App terlebih dahulu!', 'error');
      return;
    }
    setLoadingText('Memuat data terbaru...');
    setIsSyncing(true);
    const res = await syncFromGoogleSheets(settings.googleSheetsWebAppUrl);
    setIsSyncing(false);
    if (res.success && res.notes) {
      setNotes(res.notes);
      saveLocalNotes(res.notes);
      confetti({ particleCount: 30, spread: 50, origin: { y: 0.6 } });
      addToast(`Berhasil menarik ${res.notes.length} catatan dari Spreadsheet!`, 'success');
    } else {
      addToast(res.error || 'Gagal mengambil data dari Google Sheets.', 'error');
    }
  };

  const handleTestConnection = async () => {
    if (!settings.googleSheetsWebAppUrl) {
      addToast('Masukkan URL Web App terlebih dahulu!', 'error');
      return;
    }
    setIsSyncing(true);
    const res = await testSheetsConnection(settings.googleSheetsWebAppUrl);
    setIsSyncing(false);
    if (res.success) {
      addToast(res.message, 'success');
      const updated = { ...settings, isSheetsConnected: true };
      setSettings(updated);
      saveLocalSettings(updated);
    } else {
      addToast(res.message, 'error');
    }
  };

  const handleSaveSheetsUrl = (url: string) => {
    const updated = {
      ...settings,
      googleSheetsWebAppUrl: url.trim(),
      isSheetsConnected: Boolean(url.trim())
    };
    setSettings(updated);
    saveLocalSettings(updated);
    addToast('URL Web App Google Sheets disimpan!', 'success');
  };

  const totalCodeSnippets = useMemo(() => {
    return notes.reduce((acc, note) => {
      return acc + (note.blocks || []).filter((b) => b.type === 'code').length;
    }, 0);
  }, [notes]);

  return (
    <div className="min-h-screen bg-[#FAF5EE] text-black font-sans relative overflow-x-hidden selection:bg-[#FFD233] selection:text-black py-4 sm:py-8 px-2 sm:px-4">
      {/* Neobrutalist Full-Screen Loading Transition when syncing/loading from Google Spreadsheet */}
      <LoadingScreen isLoading={isInitialLoading || isSyncing} statusText={loadingText} />

      <ToastContainer toasts={toasts} onDismiss={removeToast} />

      {/* Floating Playful Neo-Brutalist Badges/Stickers in Canvas */}
      <div className="fixed top-6 left-6 hidden xl:flex items-center gap-2 pointer-events-none select-none z-0">
        <div className="w-10 h-10 rounded-2xl bg-[#FF6584] border-2 border-black flex items-center justify-center font-black shadow-[3px_3px_0px_#000] rotate-[-6deg]">
          <Code2 className="w-5 h-5 text-white" />
        </div>
        <span className="nb-badge bg-[#FFD233] text-black shadow-[2px_2px_0px_#000] rotate-[3deg]">
          fahnotes
        </span>
      </div>

      <div className="fixed top-6 right-6 hidden xl:flex items-center gap-2 pointer-events-none select-none z-0">
        <div className="nb-badge bg-[#2DD4BF] text-black shadow-[2px_2px_0px_#000] rotate-[-4deg] py-1 px-3">
          by: <strong>Faiz_Fahmi_ID</strong>
        </div>
        <div className="w-10 h-10 rounded-2xl bg-[#818CF8] border-2 border-black flex items-center justify-center font-black text-white shadow-[3px_3px_0px_#000] rotate-[8deg]">
          <Terminal className="w-5 h-5" />
        </div>
      </div>

      {/* Main Neo-Brutalist Board / Frame */}
      <div className="max-w-6xl mx-auto rounded-[24px] sm:rounded-[36px] bg-white border-[2.5px] border-black shadow-[8px_8px_0px_#000000] overflow-hidden flex flex-col relative z-10">
        
        {/* Top Navbar with Single Function Buttons */}
        <Header
          isAdmin={isAdmin}
          onLogout={handleLogout}
          onOpenLogin={() => setIsLoginOpen(true)}
          onOpenNewNote={handleStartCreateNote}
          onOpenSheetsModal={handleOpenSheetsModal}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          categories={categories}
          isSheetsConnected={settings.isSheetsConnected}
          notesCount={notes.length}
        />

        {/* Content Body */}
        <main className="flex-1 p-4 sm:p-8">
          
          {/* VIEW 1: NOTE VIEWER */}
          {viewMode === 'viewer' && selectedNote && (
            <NoteViewer
              note={selectedNote}
              isAdmin={isAdmin}
              onBack={handleBackToList}
              onEdit={handleStartEditNote}
              onShowToast={addToast}
            />
          )}

          {/* VIEW 2: NOTE EDITOR */}
          {viewMode === 'editor' && (
            isAdmin ? (
              <NoteEditor
                initialNote={editingNote}
                onSave={handleSaveNote}
                onCancel={handleBackToList}
                onShowToast={addToast}
                availableCategories={editableCategories}
                onAddNewCategory={handleAddCategory}
              />
            ) : (
              <div className="p-8 bg-white border-2 border-black rounded-2xl text-center space-y-4 max-w-md mx-auto my-12 shadow-[4px_4px_0px_#000]">
                <div className="w-12 h-12 rounded-xl bg-[#FFE4E6] border-2 border-black flex items-center justify-center mx-auto text-black shadow-[2px_2px_0px_#000]">
                  <Lock className="w-6 h-6 text-black" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-black text-black">Akses Khusus Admin</h3>
                  <p className="text-xs font-bold text-black/70">
                    Silakan login menggunakan akun admin terlebih dahulu untuk membuat atau mengedit catatan dan script.
                  </p>
                </div>
                <div className="flex items-center justify-center gap-2 pt-2">
                  <button
                    onClick={handleBackToList}
                    className="nb-btn bg-white hover:bg-[#FAF5EE] text-black px-3.5 py-1.5 text-xs font-black"
                  >
                    Kembali
                  </button>
                  <button
                    onClick={() => setIsLoginOpen(true)}
                    className="nb-btn bg-[#FFD233] hover:bg-[#FFE066] text-black px-4 py-1.5 text-xs font-black shadow-[2px_2px_0px_#000]"
                  >
                    Buka Login Admin
                  </button>
                </div>
              </div>
            )
          )}

          {/* VIEW 3: NOTE LIST / DASHBOARD */}
          {viewMode === 'list' && (
            <div className="space-y-4">
              
              {/* SECTION: Content Grid / Clean Zero State */}
              <div>
                <div className="flex items-center justify-between gap-3 mb-4">
                  <div className="flex items-center gap-2">
                    <h2 className="text-base sm:text-lg font-black text-black tracking-tight uppercase">
                      {selectedCategory === 'Semua' ? 'Semua Catatan & Kode' : `Kategori: ${selectedCategory}`}
                    </h2>
                    <span className="nb-badge bg-[#FFD233] text-black text-[10px] border border-black font-black">
                      {filteredNotes.length} Catatan
                    </span>
                  </div>
                </div>

                {filteredNotes.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredNotes.map((note) => (
                      <NoteCard
                        key={note.id}
                        note={note}
                        onClick={() => handleOpenNote(note)}
                        onEdit={() => handleStartEditNote(note)}
                        onDelete={() => handleDeleteNote(note.id)}
                        isAdmin={isAdmin}
                      />
                    ))}
                  </div>
                ) : (
                  /* Zero State Display (Clean 0 Notes) */
                  <div className="p-8 sm:p-12 rounded-3xl bg-white border-2 border-black shadow-[4px_4px_0px_#000] text-center space-y-4 max-w-lg mx-auto">
                    <div className="w-16 h-16 rounded-2xl bg-[#FFD233] border-2 border-black flex items-center justify-center mx-auto shadow-[3px_3px_0px_#000]">
                      <FolderPlus className="w-8 h-8 text-black stroke-[2.5]" />
                    </div>

                    <div className="space-y-1">
                      <h3 className="text-lg font-black text-black">
                        {searchQuery 
                          ? `Tidak ditemukan catatan "${searchQuery}"` 
                          : isAdmin 
                            ? 'Belum Ada Catatan Tersimpan (0 Data)' 
                            : 'Belum Ada Catatan Publik'}
                      </h3>
                      <p className="text-xs font-bold text-black/70 max-w-sm mx-auto">
                        {searchQuery 
                          ? 'Coba kata kunci pencarian lain atau pilih kategori Semua.' 
                          : isAdmin
                            ? 'Mulai buat catatan teknis baru atau tarik catatan yang sudah tersimpan di Google Spreadsheet.'
                            : 'Catatan dan script kode sedang dipersiapkan oleh Faiz_Fahmi_ID. Silakan kembali lagi nanti.'}
                      </p>
                    </div>

                    {isAdmin ? (
                      <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                        <button
                          onClick={handleStartCreateNote}
                          className="nb-btn nb-btn-yellow px-4 py-2 text-xs font-black gap-2 shadow-[2px_2px_0px_#000]"
                        >
                          <Plus className="w-4 h-4 stroke-[3]" />
                          <span>+ Buat Catatan Pertama</span>
                        </button>

                        <button
                          onClick={() => setIsSheetsModalOpen(true)}
                          className="nb-btn bg-[#2DD4BF] hover:bg-[#5EEAD4] text-black px-4 py-2 text-xs font-black gap-2 shadow-[2px_2px_0px_#000]"
                        >
                          <Database className="w-4 h-4" />
                          <span>Setup Google Sheets</span>
                        </button>
                      </div>
                    ) : (
                      searchQuery && (
                        <button
                          onClick={() => setSearchQuery('')}
                          className="nb-btn bg-[#FFD233] text-black px-4 py-1.5 text-xs font-black shadow-[2px_2px_0px_#000]"
                        >
                          Reset Pencarian
                        </button>
                      )
                    )}
                  </div>
                )}
              </div>

            </div>
          )}

        </main>

        {/* Footer inside Board */}
        <Footer
          totalNotes={notes.length}
          totalCodeSnippets={totalCodeSnippets}
          isSheetsConnected={settings.isSheetsConnected}
          isAdmin={isAdmin}
          onOpenLogin={() => setIsLoginOpen(true)}
          onOpenSheetsModal={() => setIsSheetsModalOpen(true)}
        />

      </div>

      {/* Admin Login Modal */}
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onLogin={handleLogin}
        onShowToast={addToast}
      />

      {/* Google Sheets Database Configuration Modal (Admin Only) */}
      {isAdmin && (
        <GoogleSheetsModal
          isOpen={isSheetsModalOpen}
          onClose={() => setIsSheetsModalOpen(false)}
          webAppUrl={settings.googleSheetsWebAppUrl}
          onSaveUrl={handleSaveSheetsUrl}
          onSyncAll={handleSyncAllToSheets}
          onPullData={handlePullFromSheets}
          onTestConnection={handleTestConnection}
          onClearLocalNotes={handleClearAllNotes}
          isSyncing={isSyncing}
          isSheetsConnected={settings.isSheetsConnected}
          notesCount={notes.length}
          categories={editableCategories}
          notes={notes}
          onAddCategory={handleAddCategory}
          onEditCategory={handleEditCategory}
          onDeleteCategory={handleDeleteCategory}
          onSyncCategoriesToSheets={handleSyncCategoriesToSheets}
          settings={settings}
          onUpdateAdminCredentials={handleUpdateAdminCredentials}
          initialTab={sheetsModalTab}
        />
      )}

    </div>
  );
}
