import { Note, AppSettings } from '../types';
import { INITIAL_NOTES } from '../data/initialNotes';
import { encryptVaultData, decryptVaultData } from './securityVault';
import { APP_CONFIG, getActiveGoogleSheetsUrl } from '../config/appConfig';

const STORAGE_KEY_NOTES = 'fahnotes_data_v2';
const STORAGE_KEY_SETTINGS = 'fahnotes_settings_vault_v3';
const STORAGE_KEY_SETTINGS_LEGACY = 'fahnotes_settings_v2';
const STORAGE_KEY_CATEGORIES = 'fahnotes_categories_v2';
const STORAGE_KEY_HARDLOCKED_URL = 'fahnotes_permanent_sheets_url';
const STORAGE_KEY_BACKUP_URL = 'fahnotes_sheets_url_locked';

export function getHardlockedSheetsUrl(): string {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_HARDLOCKED_URL) || localStorage.getItem(STORAGE_KEY_BACKUP_URL);
    if (raw && typeof raw === 'string' && raw.trim().startsWith('http')) {
      return raw.trim();
    }
  } catch {}
  return '';
}

export function setHardlockedSheetsUrl(url: string): void {
  try {
    const clean = url ? url.trim() : '';
    if (clean && clean.startsWith('http')) {
      localStorage.setItem(STORAGE_KEY_HARDLOCKED_URL, clean);
      localStorage.setItem(STORAGE_KEY_BACKUP_URL, clean);
    }
  } catch {}
}

export const DEFAULT_CATEGORIES: string[] = APP_CONFIG.DEFAULT_CATEGORIES || [
  'BAT Script',
  'HTML / Web',
  'Python',
  'JavaScript',
  'Otomasi',
  'Tutorial',
  'Linux / Shell',
  'File Drive'
];

export const DEFAULT_SETTINGS: AppSettings = {
  adminUsername: APP_CONFIG.DEFAULT_ADMIN_USERNAME || 'Faiz_Fahmi_ID',
  adminPasswordHash: APP_CONFIG.DEFAULT_ADMIN_PASSWORD || 'admin123',
  googleSheetsWebAppUrl: getActiveGoogleSheetsUrl(),
  isSheetsConnected: Boolean(getActiveGoogleSheetsUrl()),
  siteName: APP_CONFIG.SITE_NAME || 'fahnotes',
  authorName: APP_CONFIG.AUTHOR_NAME || 'Faiz_Fahmi_ID',
  categories: DEFAULT_CATEGORIES,
  preferNativeShare: true,
  enableWebsiteShareModal: true,
  autoCopyToClipboard: true
};

export function getLocalNotes(): Note[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_NOTES);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_NOTES, JSON.stringify(INITIAL_NOTES));
      return INITIAL_NOTES;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : INITIAL_NOTES;
  } catch {
    return INITIAL_NOTES;
  }
}

export function saveLocalNotes(notes: Note[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_NOTES, JSON.stringify(notes));
  } catch (err) {
    console.error('Failed to save notes to localStorage:', err);
  }
}

export function clearAllLocalNotes(): void {
  try {
    localStorage.setItem(STORAGE_KEY_NOTES, JSON.stringify([]));
  } catch (err) {
    console.error('Failed to clear notes:', err);
  }
}

export function getLocalCategories(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CATEGORIES);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_CATEGORIES, JSON.stringify(DEFAULT_CATEGORIES));
      return DEFAULT_CATEGORIES;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_CATEGORIES;
  } catch {
    return DEFAULT_CATEGORIES;
  }
}

export function saveLocalCategories(categories: string[]): void {
  try {
    const cleanList = Array.from(new Set(categories.filter((c) => Boolean(c && c.trim()))));
    localStorage.setItem(STORAGE_KEY_CATEGORIES, JSON.stringify(cleanList));
  } catch (err) {
    console.error('Failed to save categories to localStorage:', err);
  }
}

export function getLocalSettings(): AppSettings {
  try {
    const activeUrl = getActiveGoogleSheetsUrl();
    const hardlockedUrl = getHardlockedSheetsUrl();

    // 1. Check secure multi-layer vault key
    const vaultRaw = localStorage.getItem(STORAGE_KEY_SETTINGS);
    if (vaultRaw) {
      const decrypted = decryptVaultData<AppSettings>(vaultRaw, DEFAULT_SETTINGS);
      if (decrypted && decrypted.adminUsername) {
        const resolvedUrl = activeUrl || hardlockedUrl || decrypted.googleSheetsWebAppUrl || '';
        if (resolvedUrl) {
          setHardlockedSheetsUrl(resolvedUrl);
        }
        return {
          ...DEFAULT_SETTINGS,
          ...decrypted,
          googleSheetsWebAppUrl: resolvedUrl,
          isSheetsConnected: Boolean(resolvedUrl)
        };
      }
    }

    // 2. Fallback check legacy key for backward compatibility
    const legacyRaw = localStorage.getItem(STORAGE_KEY_SETTINGS_LEGACY);
    if (legacyRaw) {
      const parsed = JSON.parse(legacyRaw);
      const resolvedUrl = activeUrl || hardlockedUrl || parsed.googleSheetsWebAppUrl || '';
      if (resolvedUrl) {
        setHardlockedSheetsUrl(resolvedUrl);
      }
      const migrated = {
        ...DEFAULT_SETTINGS,
        ...parsed,
        googleSheetsWebAppUrl: resolvedUrl,
        isSheetsConnected: Boolean(resolvedUrl)
      };
      // Auto-migrate to secure vault
      saveLocalSettings(migrated);
      return migrated;
    }

    // 3. Default initialization with hardlock if present
    const bestUrl = activeUrl || hardlockedUrl || DEFAULT_SETTINGS.googleSheetsWebAppUrl || '';
    const initial = {
      ...DEFAULT_SETTINGS,
      googleSheetsWebAppUrl: bestUrl,
      isSheetsConnected: Boolean(bestUrl)
    };
    saveLocalSettings(initial);
    return initial;
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveLocalSettings(settings: AppSettings): void {
  try {
    // Preserve existing hardlocked URL if incoming is empty
    let urlToSave = settings.googleSheetsWebAppUrl;
    if (urlToSave && urlToSave.trim().startsWith('http')) {
      setHardlockedSheetsUrl(urlToSave.trim());
    } else {
      const existingHardlock = getHardlockedSheetsUrl();
      if (existingHardlock) {
        urlToSave = existingHardlock;
      }
    }

    const normalizedSettings: AppSettings = {
      ...settings,
      googleSheetsWebAppUrl: urlToSave || '',
      isSheetsConnected: Boolean(urlToSave)
    };

    const encrypted = encryptVaultData(normalizedSettings);
    localStorage.setItem(STORAGE_KEY_SETTINGS, encrypted);
    // Remove plain legacy copy if present
    localStorage.removeItem(STORAGE_KEY_SETTINGS_LEGACY);
  } catch (err) {
    console.error('Failed to save encrypted settings to vault:', err);
  }
}

export interface SyncResponse {
  success: boolean;
  notes?: Note[];
  categories?: string[];
  settings?: Partial<AppSettings>;
  message?: string;
  error?: string;
}

/**
 * Fetch all notes, categories, and admin settings from Google Sheets Web App
 */
export async function syncFromGoogleSheets(webAppUrl: string): Promise<SyncResponse> {
  if (!webAppUrl || !webAppUrl.startsWith('http')) {
    return { success: false, error: 'URL Google Apps Script tidak valid' };
  }

  try {
    const url = new URL(webAppUrl.trim());
    url.searchParams.set('action', 'getAll');
    url.searchParams.set('_t', Date.now().toString());

    const res = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });

    if (!res.ok) {
      throw new Error(`HTTP Error ${res.status}: ${res.statusText}`);
    }

    const data = await res.json();
    if (data && data.success) {
      // 1. Process Notes
      const notesList: Note[] = Array.isArray(data.notes) 
        ? data.notes 
        : Array.isArray(data.data) 
          ? data.data 
          : [];
      if (notesList.length > 0 || data.notes !== undefined) {
        saveLocalNotes(notesList);
      }

      // 2. Process Categories
      let categoriesList: string[] = [];
      if (Array.isArray(data.categories) && data.categories.length > 0) {
        categoriesList = data.categories.map((c: any) => typeof c === 'string' ? c : (c.name || ''));
        categoriesList = categoriesList.filter((c) => Boolean(c && c.trim()));
        if (categoriesList.length > 0) {
          saveLocalCategories(categoriesList);
        }
      }

      // 3. Process Settings (Admin Username & Password)
      let parsedSettings: Partial<AppSettings> = {};
      if (data.settings && typeof data.settings === 'object') {
        const rawSettings = data.settings;
        const current = getLocalSettings();
        parsedSettings = {
          ...current,
          adminUsername: rawSettings.adminUsername || current.adminUsername,
          adminPasswordHash: rawSettings.adminPassword || rawSettings.adminPasswordHash || current.adminPasswordHash,
          authorName: rawSettings.authorName || current.authorName,
          siteName: rawSettings.siteName || current.siteName,
          isSheetsConnected: true,
          lastSyncedAt: new Date().toISOString()
        };
        saveLocalSettings(parsedSettings as AppSettings);
      }

      return {
        success: true,
        notes: notesList,
        categories: categoriesList.length > 0 ? categoriesList : undefined,
        settings: parsedSettings
      };
    } else {
      return { success: false, error: data.error || 'Respon dari Google Sheets tidak valid' };
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.warn('Sync from Google Sheets failed:', message);
    return { success: false, error: message };
  }
}

/**
 * Push all local notes, categories, and settings to Google Sheets Web App (Auto-creates all columns & sheets)
 */
export async function syncAllToGoogleSheets(
  webAppUrl: string, 
  notes: Note[], 
  categoriesOrSettings?: string[] | AppSettings,
  optionalSettings?: AppSettings
): Promise<{ success: boolean; message?: string; count?: number; error?: string }> {
  if (!webAppUrl || !webAppUrl.startsWith('http')) {
    return { success: false, error: 'URL Google Apps Script belum disetel' };
  }

  let categories: string[] = [];
  let settings: AppSettings = DEFAULT_SETTINGS;

  if (Array.isArray(categoriesOrSettings)) {
    categories = categoriesOrSettings;
    if (optionalSettings) settings = optionalSettings;
    else settings = getLocalSettings();
  } else if (categoriesOrSettings && typeof categoriesOrSettings === 'object') {
    settings = categoriesOrSettings;
    categories = settings.categories && settings.categories.length > 0 
      ? settings.categories 
      : Array.from(new Set(notes.map((n) => n.category).filter(Boolean)));
  } else {
    settings = getLocalSettings();
    categories = settings.categories || Array.from(new Set(notes.map((n) => n.category).filter(Boolean)));
  }

  try {
    const payload = {
      action: 'syncAll',
      notes: notes,
      categories: categories,
      settings: {
        adminUsername: settings.adminUsername,
        adminPassword: settings.adminPasswordHash,
        adminPasswordHash: settings.adminPasswordHash,
        authorName: settings.authorName,
        siteName: settings.siteName,
        lastSyncedAt: new Date().toISOString()
      }
    };

    const res = await fetch(webAppUrl.trim(), {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      }
    });

    const text = await res.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = { success: true, message: 'Data berhasil terkirim ke Google Sheets!' };
    }

    return {
      success: true,
      count: notes.length,
      message: data.message || `Berhasil sinkronisasi ${notes.length} catatan & kategori ke Google Spreadsheet!`
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('Failed to push to Google Sheets:', message);
    return { success: false, error: message };
  }
}

/**
 * Save / Update dynamic categories list to Google Sheets
 */
export async function saveCategoriesToSheets(
  webAppUrl: string, 
  categories: string[],
  notes?: Note[]
): Promise<{ success: boolean; message?: string; error?: string }> {
  saveLocalCategories(categories);
  if (!webAppUrl || !webAppUrl.startsWith('http')) {
    return { success: true, message: 'Kategori disimpan secara lokal.' };
  }

  try {
    const payload = {
      action: 'saveCategories',
      categories: categories,
      notes: notes || []
    };

    const res = await fetch(webAppUrl.trim(), {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      }
    });

    const text = await res.text();
    const data = JSON.parse(text);
    return { 
      success: data.success !== false, 
      message: data.message || 'Daftar kategori berhasil disimpan ke Google Spreadsheet!' 
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return { success: false, error: message };
  }
}

/**
 * Save / Update Admin Username and Password directly to Google Sheets Settings sheet
 */
export async function saveAdminCredentialsToSheets(
  webAppUrl: string,
  newUsername: string,
  newPassword: string,
  currentSettings?: AppSettings
): Promise<{ success: boolean; message?: string; error?: string }> {
  const baseSettings = currentSettings || getLocalSettings();
  const updatedSettings: AppSettings = {
    ...baseSettings,
    adminUsername: newUsername.trim(),
    adminPasswordHash: newPassword.trim(),
    lastSyncedAt: new Date().toISOString()
  };
  saveLocalSettings(updatedSettings);

  if (!webAppUrl || !webAppUrl.startsWith('http')) {
    return { 
      success: true, 
      message: 'Username & Password admin berhasil diperbarui secara lokal. Sambungkan Google Sheets untuk sinkronisasi cloud.' 
    };
  }

  try {
    const payload = {
      action: 'saveSettings',
      settings: {
        adminUsername: updatedSettings.adminUsername,
        adminPassword: updatedSettings.adminPasswordHash,
        authorName: updatedSettings.authorName,
        siteName: updatedSettings.siteName,
        updatedAt: new Date().toISOString()
      }
    };

    const res = await fetch(webAppUrl.trim(), {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      }
    });

    const text = await res.text();
    const data = JSON.parse(text);
    return { 
      success: data.success !== false, 
      message: data.message || 'Akun admin berhasil diperbarui dan tersimpan di Google Spreadsheet (Sheet "Settings")!' 
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return { 
      success: false, 
      error: `Gagal menyimpan ke Google Sheets: ${message}. Perubahan tetap tersimpan di lokal browser.` 
    };
  }
}

/**
 * Save single note to Google Sheets
 */
export async function saveSingleNoteToSheets(webAppUrl: string, note: Note): Promise<{ success: boolean; message?: string; error?: string }> {
  if (!webAppUrl || !webAppUrl.startsWith('http')) {
    return { success: false, error: 'URL Google Apps Script belum disetel' };
  }

  try {
    const payload = {
      action: 'saveNote',
      note: note
    };

    const res = await fetch(webAppUrl.trim(), {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      }
    });

    const text = await res.text();
    const data = JSON.parse(text);
    return { success: data.success, message: data.message || 'Catatan berhasil disimpan ke Spreadsheet!' };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return { success: false, error: message };
  }
}

/**
 * Delete single note from Google Sheets
 */
export async function deleteSingleNoteFromSheets(webAppUrl: string, noteId: string): Promise<{ success: boolean; message?: string; error?: string }> {
  if (!webAppUrl || !webAppUrl.startsWith('http')) {
    return { success: false, error: 'URL Google Apps Script belum disetel' };
  }

  try {
    const payload = {
      action: 'deleteNote',
      id: noteId
    };

    const res = await fetch(webAppUrl.trim(), {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      }
    });

    const text = await res.text();
    const data = JSON.parse(text);
    return { success: data.success, message: data.message || 'Catatan berhasil dihapus dari Spreadsheet!' };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return { success: false, error: message };
  }
}

/**
 * Fetch global configuration from server (shared across all devices & users nationwide)
 */
export async function fetchServerGlobalConfig(): Promise<{ success: boolean; config?: any; error?: string }> {
  try {
    const res = await fetch('/api/global-config?_t=' + Date.now());
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (data && data.success && data.config) {
      return { success: true, config: data.config };
    }
    return { success: false, error: 'Invalid response from server' };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return { success: false, error: msg };
  }
}

/**
 * Save global configuration to server (so all devices and visitors automatically sync)
 */
export async function saveServerGlobalConfig(configUpdate: any): Promise<{ success: boolean; config?: any; error?: string }> {
  try {
    const res = await fetch('/api/global-config', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(configUpdate)
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return { success: Boolean(data?.success), config: data?.config };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.warn('Failed to save global config to server:', msg);
    return { success: false, error: msg };
  }
}

/**
 * Test connectivity & Auto-init Spreadsheet
 */
export async function testSheetsConnection(webAppUrl: string): Promise<{ success: boolean; message: string }> {
  if (!webAppUrl || !webAppUrl.trim().startsWith('http')) {
    return { success: false, message: 'URL Web App harus diawali dengan https://script.google.com/macros/s/...' };
  }

  try {
    const url = new URL(webAppUrl.trim());
    url.searchParams.set('action', 'ping');
    url.searchParams.set('_t', Date.now().toString());

    const res = await fetch(url.toString());
    const data = await res.json();
    if (data && data.success) {
      return { 
        success: true, 
        message: '⚡ Terhubung! Seluruh sheet (Notes, Categories, Settings) & kolom otomatis aktif di Google Spreadsheet.' 
      };
    }
    return { success: false, message: data.error || 'Respon koneksi tidak valid' };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return { success: false, message: `Gagal terhubung: ${msg}. Pastikan deployment akses diatur ke "Anyone" (Siapa saja).` };
  }
}
