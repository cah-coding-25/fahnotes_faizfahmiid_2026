import React, { useState, useEffect } from 'react';
import { 
  Database, 
  Copy, 
  Check, 
  UploadCloud, 
  DownloadCloud, 
  RefreshCw, 
  CheckCircle2, 
  AlertTriangle,
  Zap,
  Sparkles,
  Table,
  Trash2,
  Lock,
  User,
  Key,
  Eye,
  EyeOff,
  FolderPlus,
  Edit2,
  Tag,
  Save,
  Layers,
  ShieldCheck,
  Plus,
  Edit3,
  Shield
} from 'lucide-react';
import { CODE_GS_SCRIPT } from '../utils/codeGsScript';
import { AppSettings, Note } from '../types';
import { maskSensitiveUrl } from '../utils/securityVault';

interface GoogleSheetsModalProps {
  isOpen: boolean;
  onClose: () => void;
  webAppUrl: string;
  onSaveUrl: (url: string) => void;
  onSyncAll: () => Promise<void>;
  onPullData: () => Promise<void>;
  onTestConnection: () => Promise<void>;
  onClearLocalNotes: () => void;
  isSyncing: boolean;
  isSheetsConnected: boolean;
  notesCount: number;
  // Category CRUD props
  categories: string[];
  notes: Note[];
  onAddCategory: (newCategory: string) => Promise<void> | void;
  onEditCategory: (oldCategory: string, newCategory: string) => Promise<void> | void;
  onDeleteCategory: (categoryToDelete: string) => Promise<void> | void;
  onSyncCategoriesToSheets: () => Promise<void>;
  // Admin Account props
  settings: AppSettings;
  onUpdateAdminCredentials: (newUsername: string, newPassword: string) => Promise<boolean>;
  initialTab?: 'categories' | 'account' | 'database';
}

export const GoogleSheetsModal: React.FC<GoogleSheetsModalProps> = ({
  isOpen,
  onClose,
  webAppUrl,
  onSaveUrl,
  onSyncAll,
  onPullData,
  onTestConnection,
  onClearLocalNotes,
  isSyncing,
  isSheetsConnected,
  notesCount,
  categories,
  notes,
  onAddCategory,
  onEditCategory,
  onDeleteCategory,
  onSyncCategoriesToSheets,
  settings,
  onUpdateAdminCredentials,
  initialTab = 'categories'
}) => {
  const [activeTab, setActiveTab] = useState<'categories' | 'account' | 'database'>(initialTab);
  const [urlInput, setUrlInput] = useState(webAppUrl);
  const [showPlainUrl, setShowPlainUrl] = useState(false);
  const [urlSavedFeedback, setUrlSavedFeedback] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showCodePreview, setShowCodePreview] = useState(false);

  // Category State
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingCatName, setEditingCatName] = useState<string | null>(null);
  const [editCategoryInput, setEditCategoryInput] = useState('');
  const [isCatActionLoading, setIsCatActionLoading] = useState(false);

  // Admin Account State
  const [isEditingAccount, setIsEditingAccount] = useState(false);
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [adminUser, setAdminUser] = useState(settings.adminUsername || '');
  const [adminPass, setAdminPass] = useState(settings.adminPasswordHash || settings.adminPassword || '');
  const [adminConfirmPass, setAdminConfirmPass] = useState(settings.adminPasswordHash || settings.adminPassword || '');
  const [showAdminPass, setShowAdminPass] = useState(false);
  const [accountMsg, setAccountMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [isSavingAccount, setIsSavingAccount] = useState(false);

  useEffect(() => {
    setUrlInput(webAppUrl);
  }, [webAppUrl]);

  useEffect(() => {
    setAdminUser(settings.adminUsername || '');
    setAdminPass(settings.adminPasswordHash || settings.adminPassword || '');
    setAdminConfirmPass(settings.adminPasswordHash || settings.adminPassword || '');
  }, [settings.adminUsername, settings.adminPasswordHash, settings.adminPassword]);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(CODE_GS_SCRIPT);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveUrl = () => {
    onSaveUrl(urlInput.trim());
    setUrlSavedFeedback(true);
    setTimeout(() => setUrlSavedFeedback(false), 3000);
  };

  // --- Category Handlers ---
  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    const clean = newCategoryName.trim();
    if (!clean) return;
    if (categories.some((c) => c.toLowerCase() === clean.toLowerCase())) {
      alert(`Kategori "${clean}" sudah ada!`);
      return;
    }
    setIsCatActionLoading(true);
    await onAddCategory(clean);
    setNewCategoryName('');
    setIsCatActionLoading(false);
  };

  const handleStartEditCategory = (cat: string) => {
    setEditingCatName(cat);
    setEditCategoryInput(cat);
  };

  const handleSaveEditCategory = async (oldCat: string) => {
    const clean = editCategoryInput.trim();
    if (!clean || clean === oldCat) {
      setEditingCatName(null);
      return;
    }
    if (categories.some((c) => c.toLowerCase() === clean.toLowerCase() && c.toLowerCase() !== oldCat.toLowerCase())) {
      alert(`Kategori "${clean}" sudah ada!`);
      return;
    }
    setIsCatActionLoading(true);
    await onEditCategory(oldCat, clean);
    setEditingCatName(null);
    setIsCatActionLoading(false);
  };

  const handleDeleteCat = async (cat: string) => {
    const usageCount = notes.filter((n) => n.category === cat).length;
    let confirmMsg = `Hapus kategori "${cat}"?`;
    if (usageCount > 0) {
      confirmMsg += `\n\nCatatan: Terdapat ${usageCount} catatan yang saat ini menggunakan kategori ini. Kategori catatan tersebut akan diubah menjadi "Umum".`;
    }
    if (window.confirm(confirmMsg)) {
      setIsCatActionLoading(true);
      await onDeleteCategory(cat);
      setIsCatActionLoading(false);
    }
  };

  // --- Admin Account Handlers ---
  const handleStartEditAccount = () => {
    setAdminUser(settings.adminUsername || '');
    setAdminPass(settings.adminPasswordHash || settings.adminPassword || '');
    setAdminConfirmPass(settings.adminPasswordHash || settings.adminPassword || '');
    setIsEditingAccount(true);
    setAccountMsg(null);
  };

  const handleCancelEditAccount = () => {
    setIsEditingAccount(false);
    setAdminUser(settings.adminUsername || '');
    setAdminPass(settings.adminPasswordHash || settings.adminPassword || '');
    setAdminConfirmPass(settings.adminPasswordHash || settings.adminPassword || '');
    setAccountMsg(null);
  };

  const handleSaveAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setAccountMsg(null);

    const user = adminUser.trim();
    const pass = adminPass.trim();
    const confirm = adminConfirmPass.trim();

    if (!user) {
      setAccountMsg({ text: 'Username admin tidak boleh kosong!', type: 'error' });
      return;
    }

    if (!pass) {
      setAccountMsg({ text: 'Password admin tidak boleh kosong!', type: 'error' });
      return;
    }

    if (pass !== confirm) {
      setAccountMsg({ text: 'Konfirmasi password tidak cocok dengan password baru!', type: 'error' });
      return;
    }

    setIsSavingAccount(true);
    const success = await onUpdateAdminCredentials(user, pass);
    setIsSavingAccount(false);

    if (success) {
      setAccountMsg({
        text: 'Akun Admin berhasil diperbarui dan tersimpan di baris kedua kolom Spreadsheet (Sheet "Settings")!',
        type: 'success'
      });
      setIsEditingAccount(false);
    } else {
      setAccountMsg({
        text: 'Akun diperbarui secara lokal. Sambungkan Google Sheets untuk sinkronisasi cloud.',
        type: 'success'
      });
      setIsEditingAccount(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs">
      <div className="nb-box w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden bg-white">
        
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b-2 border-black bg-[#FFD233] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_#000]">
              <ShieldCheck className="w-5 h-5 text-black stroke-[2.5]" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black tracking-tight text-black flex items-center gap-2">
                <span>Panel Kontrol Admin &amp; Database</span>
              </h2>
              <p className="text-[11px] font-bold text-black/80">
                Kelola Kategori, Akun Admin, dan Database Google Spreadsheet
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="nb-btn w-8 h-8 rounded-lg bg-white text-black text-sm font-black hover:bg-[#FAF5EE]"
            title="Tutup"
          >
            ✕
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b-2 border-black bg-[#FAF5EE] p-1.5 gap-1.5 overflow-x-auto">
          <button
            onClick={() => setActiveTab('categories')}
            className={`nb-btn px-3.5 py-1.5 text-xs font-black gap-1.5 transition-all shrink-0 ${
              activeTab === 'categories'
                ? 'bg-[#2DD4BF] text-black shadow-[2px_2px_0px_#000] border-2 border-black'
                : 'bg-white text-black/70 hover:text-black border-2 border-transparent'
            }`}
          >
            <Layers className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Kelola Kategori ({categories.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('account')}
            className={`nb-btn px-3.5 py-1.5 text-xs font-black gap-1.5 transition-all shrink-0 ${
              activeTab === 'account'
                ? 'bg-[#FFD233] text-black shadow-[2px_2px_0px_#000] border-2 border-black'
                : 'bg-white text-black/70 hover:text-black border-2 border-transparent'
            }`}
          >
            <User className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Akun Admin (Username &amp; Password)</span>
          </button>

          <button
            onClick={() => setActiveTab('database')}
            className={`nb-btn px-3.5 py-1.5 text-xs font-black gap-1.5 transition-all shrink-0 ${
              activeTab === 'database'
                ? 'bg-[#818CF8] text-black shadow-[2px_2px_0px_#000] border-2 border-black'
                : 'bg-white text-black/70 hover:text-black border-2 border-transparent'
            }`}
          >
            <Database className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Database Google Sheets</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 text-black text-xs font-semibold flex-1">
          
          {/* ========================================================================= */}
          {/* TAB 1: KELOLA KATEGORI (TAMBAH, EDIT, HAPUS, SYNC KE SPREADSHEET) */}
          {/* ========================================================================= */}
          {activeTab === 'categories' && (
            <div className="space-y-4">
              
              {/* Info Header */}
              <div className="p-3.5 rounded-xl border-2 border-black bg-[#F0FDFA] flex items-start justify-between gap-3 shadow-[2px_2px_0px_#000]">
                <div className="space-y-1">
                  <div className="font-black text-xs text-teal-950 uppercase tracking-wider flex items-center gap-1.5">
                    <Tag className="w-4 h-4 text-teal-700 stroke-[2.5]" />
                    <span>Daftar Kategori Dinamis</span>
                  </div>
                  <p className="text-[11px] font-bold text-teal-900/80">
                    Kategori dapat ditambah, diedit, atau dihapus secara bebas dan otomatis tersimpan di Google Spreadsheet (Sheet "Categories").
                  </p>
                </div>

                <button
                  type="button"
                  onClick={onSyncCategoriesToSheets}
                  disabled={isCatActionLoading || isSyncing}
                  className="nb-btn bg-[#2DD4BF] hover:bg-[#5EEAD4] text-black px-3 py-1.5 text-xs font-black gap-1 shadow-[2px_2px_0px_#000] shrink-0"
                  title="Kirim dan sinkronkan daftar kategori ke Google Spreadsheet"
                >
                  <UploadCloud className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>Sync ke Sheets</span>
                </button>
              </div>

              {/* Form Tambah Kategori Baru */}
              <form onSubmit={handleCreateCategory} className="p-3.5 rounded-xl border-2 border-black bg-white space-y-2 shadow-[3px_3px_0px_#000]">
                <label className="block text-xs font-black uppercase tracking-wider text-black">
                  + Tambah Kategori Baru:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Rust, Docker, Microcontroller, Tools..."
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    className="nb-input flex-1 px-3 py-2 text-xs font-bold text-black"
                  />
                  <button
                    type="submit"
                    disabled={isCatActionLoading || !newCategoryName.trim()}
                    className="nb-btn bg-[#FFD233] hover:bg-[#FFE066] text-black px-4 py-2 text-xs font-black shadow-[2px_2px_0px_#000] gap-1.5 disabled:opacity-50"
                  >
                    <Plus className="w-4 h-4 stroke-[3]" />
                    <span>Tambah</span>
                  </button>
                </div>
              </form>

              {/* List of Dynamic Categories */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-black text-black uppercase tracking-wider px-1">
                  <span>Daftar Kategori ({categories.length}):</span>
                  <span className="text-[10px] text-black/60 font-bold normal-case">
                    Klik Edit untuk mengganti nama, atau Hapus untuk menghapus
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {categories.map((cat) => {
                    const count = notes.filter((n) => n.category === cat).length;
                    const isEditing = editingCatName === cat;

                    return (
                      <div
                        key={cat}
                        className="p-2.5 bg-[#FAF5EE] rounded-xl border-2 border-black flex items-center justify-between gap-2 shadow-[2px_2px_0px_#000]"
                      >
                        {isEditing ? (
                          <div className="flex items-center gap-1.5 flex-1">
                            <input
                              type="text"
                              value={editCategoryInput}
                              onChange={(e) => setEditCategoryInput(e.target.value)}
                              autoFocus
                              className="nb-input flex-1 px-2 py-1 text-xs font-bold text-black"
                            />
                            <button
                              type="button"
                              onClick={() => handleSaveEditCategory(cat)}
                              className="nb-btn bg-[#22C55E] text-black hover:bg-[#4ADE80] p-1.5 text-xs shadow-[1px_1px_0px_#000]"
                              title="Simpan Perubahan"
                            >
                              <Check className="w-3.5 h-3.5 stroke-[3]" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingCatName(null)}
                              className="nb-btn bg-white text-black p-1.5 text-xs"
                              title="Batal"
                            >
                              ✕
                            </button>
                          </div>
                        ) : (
                          <>
                            <div className="flex items-center gap-2 min-w-0">
                              <span className="w-2.5 h-2.5 rounded-full bg-[#2DD4BF] border border-black shrink-0"></span>
                              <span className="font-black text-xs text-black truncate">{cat}</span>
                              <span className="nb-badge bg-white text-black text-[9px] font-black border border-black shrink-0">
                                {count} Catatan
                              </span>
                            </div>

                            <div className="flex items-center gap-1 shrink-0">
                              <button
                                type="button"
                                onClick={() => handleStartEditCategory(cat)}
                                className="nb-btn bg-white hover:bg-[#FAF5EE] text-black p-1.5 text-xs border border-black shadow-[1px_1px_0px_#000]"
                                title="Edit Nama Kategori"
                              >
                                <Edit2 className="w-3.5 h-3.5 text-black stroke-[2.5]" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteCat(cat)}
                                className="nb-btn bg-[#FFE4E6] hover:bg-[#FDA4AF] text-black p-1.5 text-xs border border-black shadow-[1px_1px_0px_#000]"
                                title="Hapus Kategori"
                              >
                                <Trash2 className="w-3.5 h-3.5 text-[#9F1239] stroke-[2.5]" />
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 2: AKUN ADMIN (EDIT USERNAME & PASSWORD TERSIMPAN KE GOOGLE SHEETS) */}
          {/* ========================================================================= */}
          {activeTab === 'account' && (
            <div className="space-y-4">
              
              <div className="p-3.5 rounded-xl border-2 border-black bg-[#FFFBEB] flex items-start gap-3 shadow-[2px_2px_0px_#000]">
                <div className="w-8 h-8 rounded-lg bg-[#FFD233] border-2 border-black flex items-center justify-center shrink-0 mt-0.5 shadow-[1px_1px_0px_#000]">
                  <Lock className="w-4 h-4 text-black stroke-[2.5]" />
                </div>
                <div className="flex-1 text-xs">
                  <div className="font-black text-xs text-amber-950 uppercase tracking-wider">
                    Pengaturan Kredensial Akun Admin
                  </div>
                  <p className="mt-0.5 font-bold text-amber-900/80 text-[11px]">
                    Data username dan password admin tersimpan di <strong>Google Spreadsheet (Sheet "Settings")</strong> pada kolom header <code>Username</code> dan <code>Password</code> di baris ke-2.
                  </p>
                </div>
              </div>

              {accountMsg && (
                <div className={`p-3 rounded-xl border-2 border-black flex items-center gap-2 text-xs font-bold shadow-[2px_2px_0px_#000] ${
                  accountMsg.type === 'success' ? 'bg-[#DCFCE7] text-emerald-950' : 'bg-[#FFE4E6] text-rose-950'
                }`}>
                  {accountMsg.type === 'success' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-700 stroke-[2.5] shrink-0" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-rose-700 stroke-[2.5] shrink-0" />
                  )}
                  <span>{accountMsg.text}</span>
                </div>
              )}

              {/* TAMPILAN KREDENSIAL AKUN SAAT INI (CARD VIEW) */}
              <div className="p-4 rounded-xl border-2 border-black bg-white space-y-3.5 shadow-[3px_3px_0px_#000]">
                <div className="flex items-center justify-between border-b-2 border-black pb-2.5">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-black stroke-[2.5]" />
                    <span className="font-black text-xs uppercase tracking-wider">Kredensial Akun Admin Saat Ini</span>
                  </div>
                  
                  {!isEditingAccount && (
                    <button
                      type="button"
                      onClick={handleStartEditAccount}
                      className="nb-btn bg-[#FFD233] hover:bg-[#FFE066] text-black px-3 py-1.5 text-xs font-black gap-1.5 shadow-[2px_2px_0px_#000] border-2 border-black"
                    >
                      <Edit3 className="w-3.5 h-3.5 stroke-[2.5]" />
                      <span>Edit Akun Admin</span>
                    </button>
                  )}
                </div>

                {!isEditingAccount ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    {/* Username Box */}
                    <div className="p-3 bg-[#FAF5EE] border-2 border-black rounded-xl shadow-[2px_2px_0px_#000] space-y-1">
                      <span className="text-[10px] font-black uppercase tracking-wider text-black/60 block flex items-center gap-1">
                        <User className="w-3 h-3 text-black/70" />
                        Username Admin
                      </span>
                      <div className="text-sm font-black text-black break-all flex items-center justify-between">
                        <span>{settings.adminUsername || 'Faiz_Fahmi_ID'}</span>
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#FFD233] border border-black font-black">Aktif</span>
                      </div>
                    </div>

                    {/* Password Box */}
                    <div className="p-3 bg-[#FAF5EE] border-2 border-black rounded-xl shadow-[2px_2px_0px_#000] space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase tracking-wider text-black/60 flex items-center gap-1">
                          <Key className="w-3 h-3 text-black/70" />
                          Password Admin
                        </span>
                        <button
                          type="button"
                          onClick={() => setShowCurrentPass(!showCurrentPass)}
                          className="text-[10px] font-black text-black/70 hover:text-black flex items-center gap-1 underline cursor-pointer"
                        >
                          {showCurrentPass ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                          <span>{showCurrentPass ? 'Sembunyikan' : 'Lihat'}</span>
                        </button>
                      </div>
                      <div className="text-sm font-mono font-black text-black">
                        {showCurrentPass 
                          ? (settings.adminPasswordHash || settings.adminPassword || 'admin') 
                          : '••••••••••••'}
                      </div>
                    </div>
                  </div>
                ) : (
                  /* FORMULIR EDIT USERNAME & PASSWORD ADMIN */
                  <form onSubmit={handleSaveAccount} className="pt-2 space-y-3.5">
                    <div className="p-2.5 bg-[#EFF6FF] border-2 border-black rounded-lg text-[11px] font-bold text-blue-950 flex items-center gap-2">
                      <Edit3 className="w-4 h-4 text-blue-700 shrink-0" />
                      <span>Mode Edit Aktif: Masukkan Username dan Password admin baru di bawah ini.</span>
                    </div>

                    {/* Username Input */}
                    <div>
                      <label className="block text-xs font-black uppercase tracking-wider text-black mb-1 flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-black" />
                        <span>Username Admin Baru *</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Contoh: Faiz_Fahmi_ID / admin"
                        value={adminUser}
                        onChange={(e) => setAdminUser(e.target.value)}
                        className="nb-input w-full px-3 py-2 text-xs font-bold text-black"
                      />
                      <p className="text-[10px] text-black/60 font-bold mt-1">
                        * Kolom pertama di sheet "Settings" Spreadsheet yang akan diperbarui.
                      </p>
                    </div>

                    {/* Password Input */}
                    <div>
                      <label className="block text-xs font-black uppercase tracking-wider text-black mb-1 flex items-center gap-1.5">
                        <Key className="w-3.5 h-3.5 text-black" />
                        <span>Password Admin Baru *</span>
                      </label>
                      <div className="relative">
                        <input
                          type={showAdminPass ? 'text' : 'password'}
                          required
                          placeholder="Ketik password baru..."
                          value={adminPass}
                          onChange={(e) => setAdminPass(e.target.value)}
                          className="nb-input w-full px-3 py-2 pr-9 text-xs font-bold text-black"
                        />
                        <button
                          type="button"
                          onClick={() => setShowAdminPass(!showAdminPass)}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-black/60 hover:text-black"
                          title={showAdminPass ? 'Sembunyikan password' : 'Lihat password'}
                        >
                          {showAdminPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      <p className="text-[10px] text-black/60 font-bold mt-1">
                        * Kolom kedua di sheet "Settings" Spreadsheet yang akan diperbarui.
                      </p>
                    </div>

                    {/* Confirm Password Input */}
                    <div>
                      <label className="block text-xs font-black uppercase tracking-wider text-black mb-1 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-black" />
                        <span>Ulangi / Konfirmasi Password Baru *</span>
                      </label>
                      <input
                        type={showAdminPass ? 'text' : 'password'}
                        required
                        placeholder="Ketik ulang password baru..."
                        value={adminConfirmPass}
                        onChange={(e) => setAdminConfirmPass(e.target.value)}
                        className="nb-input w-full px-3 py-2 text-xs font-bold text-black"
                      />
                    </div>

                    <div className="pt-2 flex flex-col sm:flex-row gap-2">
                      <button
                        type="submit"
                        disabled={isSavingAccount}
                        className="nb-btn bg-[#FFD233] hover:bg-[#FFE066] text-black flex-1 py-2.5 text-xs font-black gap-2 shadow-[3px_3px_0px_#000] border-2 border-black disabled:opacity-50"
                      >
                        <Save className="w-4 h-4 stroke-[2.5]" />
                        <span>{isSavingAccount ? 'Menyimpan...' : '💾 Simpan Perubahan & Sync ke Spreadsheet'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleCancelEditAccount}
                        disabled={isSavingAccount}
                        className="nb-btn bg-white hover:bg-[#FAF5EE] text-black px-4 py-2.5 text-xs font-black gap-1.5 border-2 border-black shadow-[2px_2px_0px_#000]"
                      >
                        ✕ Batal
                      </button>
                    </div>
                  </form>
                )}
              </div>

            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 3: GOOGLE SPREADSHEET (DATABASE ENGINE & SCRIPT CODE.GS) */}
          {/* ========================================================================= */}
          {activeTab === 'database' && (
            <div className="space-y-4">
              
              {/* Status Indicator Banner */}
              <div className={`p-3.5 rounded-xl border-2 border-black flex items-start gap-3 shadow-[3px_3px_0px_#000] ${
                isSheetsConnected ? 'bg-[#DCFCE7]' : 'bg-[#FFFBEB]'
              }`}>
                {isSheetsConnected ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-800 stroke-[2.5] shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-amber-800 stroke-[2.5] shrink-0 mt-0.5" />
                )}
                <div className="flex-1 text-xs">
                  <div className="font-black text-sm">
                    Status: {isSheetsConnected ? '🟢 Spreadsheet Terhubung Aktif' : '🟡 Belum Terhubung ke Spreadsheet'}
                  </div>
                  <p className="mt-1 font-bold text-black/80">
                    {isSheetsConnected 
                      ? `Siap digunakan! Tersedia ${notesCount} catatan dan ${categories.length} kategori. Klik "⚡ Push ke Spreadsheet" untuk meng-generate / menyinkronkan seluruh tabel.`
                      : 'Salin script Code.gs di bawah, pasang di Google Spreadsheet, deploy sebagai Web App (Akses: Anyone), lalu masukkan URL Web App ke input di bawah.'}
                  </p>
                </div>
              </div>

              {/* Web App URL Input Form with Multi-Layer Security Protection */}
              <div className="p-4 rounded-xl border-2 border-black bg-white space-y-3 shadow-[3px_3px_0px_#000]">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-black uppercase tracking-wider text-black flex items-center gap-1.5">
                    <Shield className="w-4 h-4 text-emerald-700 stroke-[2.5]" />
                    <span>Google Apps Script Web App URL:</span>
                  </label>
                  <span className="inline-flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-100 border border-emerald-800 text-emerald-950 shadow-sm">
                    <Lock className="w-3 h-3 text-emerald-700" />
                    Kunci Berlapis Aktif
                  </span>
                </div>

                <div className="space-y-1.5">
                  <div className="relative flex gap-2">
                    <div className="relative flex-1">
                      <input
                        type={showPlainUrl ? 'text' : 'password'}
                        value={urlInput}
                        onChange={(e) => setUrlInput(e.target.value)}
                        placeholder="https://script.google.com/macros/s/AKfycbx.../exec"
                        className="nb-input w-full px-3 py-2 pr-9 text-xs font-mono font-bold text-black"
                      />
                      {urlInput && (
                        <button
                          type="button"
                          onClick={() => setShowPlainUrl(!showPlainUrl)}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-black/60 hover:text-black"
                          title={showPlainUrl ? 'Sembunyikan URL' : 'Tampilkan URL'}
                        >
                          {showPlainUrl ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      )}
                    </div>
                    <button
                      onClick={handleSaveUrl}
                      className="nb-btn bg-[#2DD4BF] text-black px-4 py-2 text-xs font-black shadow-[2px_2px_0px_#000] hover:bg-[#5EEAD4] border-2 border-black flex items-center gap-1.5"
                    >
                      <Save className="w-3.5 h-3.5 stroke-[2.5]" />
                      <span>Simpan URL</span>
                    </button>
                  </div>

                  {urlSavedFeedback && (
                    <div className="p-2 bg-emerald-50 border border-emerald-600 rounded-lg text-[11px] font-bold text-emerald-900 flex items-center gap-1.5 animate-fadeIn">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                      <span>URL Database Google Spreadsheet berhasil disimpan &amp; diamankan dengan enkripsi berlapis!</span>
                    </div>
                  )}

                  {webAppUrl && (
                    <div className="p-2.5 bg-[#FAF5EE] border border-black/30 rounded-lg flex items-center justify-between text-[11px] font-bold text-black/80">
                      <div className="flex items-center gap-1.5 overflow-hidden">
                        <Lock className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                        <span className="text-black/60 text-[10px] uppercase font-black shrink-0">Tersimpan:</span>
                        <span className="font-mono text-[11px] text-black truncate">
                          {showPlainUrl ? webAppUrl : maskSensitiveUrl(webAppUrl)}
                        </span>
                      </div>
                      <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-emerald-200 text-emerald-950 shrink-0 ml-2 border border-emerald-800">
                        🛡️ Terenkripsi
                      </span>
                    </div>
                  )}

                  <div className="p-2 bg-[#F0FDF4] border border-emerald-300 rounded-lg text-[10px] text-emerald-950 font-bold leading-relaxed flex items-start gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                    <span>
                      <strong>⚡ Sinkronisasi Global Se-Indonesia Aktif:</strong> Cukup masukkan dan simpan URL Web App di 1 perangkat saja (misal di laptop atau HP admin), maka seluruh pengunjung dan perangkat di seluruh Indonesia akan langsung terhubung ke database Google Spreadsheet yang sama secara otomatis &amp; real-time!
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Hub (Push, Pull, Test, Reset) */}
              <div className="p-4 rounded-xl border-2 border-black bg-[#FAF5EE] space-y-3 shadow-[3px_3px_0px_#000]">
                <div className="font-black text-xs uppercase tracking-wider text-black flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-[#FFD233] stroke-[3]" />
                  <span>Aksi Sinkronisasi &amp; Otomasi Database:</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {/* Push Button (Primary Auto-CRUD) */}
                  <button
                    onClick={onSyncAll}
                    disabled={isSyncing || !webAppUrl}
                    className="nb-btn nb-btn-yellow p-3 text-xs font-black flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-[3px_3px_0px_#000]"
                    title="Kirim catatan, kategori, dan akun ke Google Spreadsheet"
                  >
                    <UploadCloud className="w-4 h-4 stroke-[2.5]" />
                    <span>{isSyncing ? 'Memproses...' : '⚡ Push ke Spreadsheet (Auto-CRUD)'}</span>
                  </button>

                  {/* Pull Button */}
                  <button
                    onClick={onPullData}
                    disabled={isSyncing || !webAppUrl}
                    className="nb-btn bg-[#818CF8] text-black p-3 text-xs font-black flex items-center justify-center gap-2 hover:bg-[#9DA6FB] disabled:opacity-50 disabled:cursor-not-allowed shadow-[3px_3px_0px_#000] border-2 border-black"
                    title="Ambil seluruh data terbaru dari Google Spreadsheet ke website"
                  >
                    <DownloadCloud className="w-4 h-4 stroke-[2.5] text-black" />
                    <span className="text-black">📥 Tarik Data dari Spreadsheet</span>
                  </button>

                  {/* Test Connection */}
                  <button
                    onClick={onTestConnection}
                    disabled={isSyncing || !webAppUrl}
                    className="nb-btn bg-white text-black p-2.5 text-xs font-black flex items-center justify-center gap-2 hover:bg-[#F3F4F6] disabled:opacity-50 border-2 border-black"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 text-black ${isSyncing ? 'animate-spin' : ''}`} />
                    <span className="text-black">🧪 Test Koneksi (Ping)</span>
                  </button>

                  {/* Clear / Reset to 0 */}
                  <button
                    onClick={onClearLocalNotes}
                    className="nb-btn bg-[#FFE4E6] text-black hover:bg-[#FDA4AF] p-2.5 text-xs font-black flex items-center justify-center gap-2 border-2 border-black"
                    title="Kosongkan seluruh catatan lokal menjadi 0"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-black" />
                    <span className="text-black">🧹 Bersihkan Konten (0 Catatan)</span>
                  </button>
                </div>
              </div>

              {/* Auto-Columns Feature Info */}
              <div className="p-3.5 rounded-xl border-2 border-black bg-[#FFFDF5] space-y-2">
                <div className="font-black text-xs text-black flex items-center gap-1.5">
                  <Table className="w-4 h-4 text-[#2DD4BF]" />
                  <span>3 Sheet Otomatis yang Terkelola di Google Spreadsheet:</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div className="p-2 bg-white rounded-lg border border-black">
                    <div className="font-black text-black">1. Notes (13 Kolom)</div>
                    <p className="text-[10px] text-black/70">ID, Title, Slug, Description, Category, CoverImage, FileDownloadUrl, BlocksJSON, IsPublic, Author, CreatedAt, UpdatedAt</p>
                  </div>
                  <div className="p-2 bg-white rounded-lg border border-black">
                    <div className="font-black text-black">2. Categories (3 Kolom)</div>
                    <p className="text-[10px] text-black/70">Category, TotalNotes, LastUpdated</p>
                  </div>
                  <div className="p-2 bg-white rounded-lg border border-black">
                    <div className="font-black text-black">3. Settings (3 Kolom)</div>
                    <p className="text-[10px] text-black/70">adminUsername, adminPassword, authorName, siteName, lastSyncedAt</p>
                  </div>
                </div>
              </div>

              {/* Script Copy Box */}
              <div className="space-y-2 pt-1 border-t-2 border-black/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-black text-xs text-black">
                    <Sparkles className="w-4 h-4 text-[#FFD233]" />
                    <span>Script Code.gs (Google Apps Script)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setShowCodePreview(!showCodePreview)}
                      className="text-[11px] font-bold text-black underline hover:opacity-80"
                    >
                      {showCodePreview ? 'Sembunyikan Kode' : 'Lihat Kode'}
                    </button>
                    <button
                      onClick={handleCopy}
                      className="nb-btn bg-[#FFD233] text-black px-3 py-1 text-xs font-black gap-1.5 shadow-[2px_2px_0px_#000]"
                    >
                      {copied ? (
                        <>
                          <Check className="w-3.5 h-3.5 stroke-[3] text-emerald-800" />
                          <span>Tersalin!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Salin Script Code.gs</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {showCodePreview && (
                  <pre className="p-3 bg-[#1E293B] text-[#38BDF8] rounded-xl border-2 border-black text-[10px] font-mono max-h-52 overflow-y-auto shadow-inner">
                    {CODE_GS_SCRIPT}
                  </pre>
                )}
              </div>

            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t-2 border-black bg-[#FAF5EE] flex items-center justify-between">
          <span className="text-[10px] font-bold text-black/70">
            Akun Aktif: <strong>{settings.adminUsername || 'Faiz_Fahmi_ID'}</strong>
          </span>
          <button
            onClick={onClose}
            className="nb-btn bg-[#FFD233] text-black px-5 py-2 text-xs font-black hover:bg-[#FFE066] shadow-[2px_2px_0px_#000] border-2 border-black"
          >
            Tutup
          </button>
        </div>

      </div>
    </div>
  );
};
