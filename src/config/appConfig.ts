/**
 * ⚡ fahnotes — Permanent Configuration & Multi-Layer Vault
 * Dibuat oleh: Faiz_Fahmi_ID
 * 
 * =========================================================================================
 * 📌 PANDUAN PENYIMPANAN PERMANEN GITHUB & VERCEL:
 * =========================================================================================
 * 1. File ini tersimpan langsung di dalam repository GitHub pribadi Anda.
 * 2. Masukkan URL Web App Google Apps Script Anda pada variabel `GOOGLE_SHEETS_WEB_APP_URL` di bawah ini.
 * 3. Ketika Anda push ke GitHub & deploy ke VERCEL / NETLIFY / GITHUB PAGES / HOSTING LAIN,
 *    seluruh pengunjung di seluruh dunia dan seluruh perangkat akan LANGSUNG OTOMATIS
 *    terkoneksi ke Google Spreadsheet Anda tanpa perlu memasukkan URL manual lagi!
 * 
 * 4. Selain itu, Anda juga bisa menyetel environment variable di Vercel:
 *    Key:   VITE_GOOGLE_SHEETS_URL
 *    Value: https://script.google.com/macros/s/AKfycby.../exec
 * =========================================================================================
 */

export interface PermanentAppConfig {
  /**
   * URL Google Apps Script Web App (contoh: https://script.google.com/macros/s/.../exec)
   * Tempelkan URL Web App Anda di sini agar tersimpan permanen di GitHub repo Anda!
   */
  GOOGLE_SHEETS_WEB_APP_URL: string;

  /**
   * Username default untuk Admin
   */
  DEFAULT_ADMIN_USERNAME: string;

  /**
   * Password default untuk Admin (dapat diubah nanti di dashboard)
   */
  DEFAULT_ADMIN_PASSWORD: string;

  /**
   * Nama Website & Penulis
   */
  SITE_NAME: string;
  AUTHOR_NAME: string;

  /**
   * Daftar Kategori Awal
   */
  DEFAULT_CATEGORIES: string[];
}

export const APP_CONFIG: PermanentAppConfig = {
  // 🔥 TEMPELKAN URL GOOGLE APPS SCRIPT WEB APP ANDA DI SINI:
  GOOGLE_SHEETS_WEB_APP_URL: '',

  // Kredensial Default Admin
  DEFAULT_ADMIN_USERNAME: 'Faiz_Fahmi_ID',
  DEFAULT_ADMIN_PASSWORD: 'admin123',

  // Identitas Website
  SITE_NAME: 'fahnotes',
  AUTHOR_NAME: 'Faiz_Fahmi_ID',

  // Kategori Default
  DEFAULT_CATEGORIES: [
    'BAT Script',
    'HTML / Web',
    'Python',
    'JavaScript',
    'Otomasi',
    'Tutorial',
    'Linux / Shell',
    'File Drive'
  ]
};

/**
 * Multi-Tier Fallback Resolver:
 * Mendapatkan URL Google Sheets aktif dengan urutan prioritas berlapis:
 * 1. Environment Variable (VITE_GOOGLE_SHEETS_URL) -> Prioritas tertinggi (Vercel Env Vars)
 * 2. APP_CONFIG.GOOGLE_SHEETS_WEB_APP_URL -> File konfigurasi permanen di GitHub repo
 * 3. LocalStorage Browser Vault -> Override interaktif yang disimpan admin di browser
 */
export function getActiveGoogleSheetsUrl(cachedLocalUrl?: string): string {
  // Tier 1: Vite Environment Variable (diatur di Vercel Dashboard / .env)
  try {
    const envUrl = (import.meta as any).env?.VITE_GOOGLE_SHEETS_URL || (import.meta as any).env?.VITE_APP_SHEETS_URL;
    if (envUrl && typeof envUrl === 'string' && envUrl.trim().startsWith('http')) {
      return envUrl.trim();
    }
  } catch {}

  // Tier 2: Hardcoded Permanent Config in GitHub repo
  if (APP_CONFIG.GOOGLE_SHEETS_WEB_APP_URL && APP_CONFIG.GOOGLE_SHEETS_WEB_APP_URL.trim().startsWith('http')) {
    return APP_CONFIG.GOOGLE_SHEETS_WEB_APP_URL.trim();
  }

  // Tier 3: Local storage cached URL if valid
  if (cachedLocalUrl && typeof cachedLocalUrl === 'string' && cachedLocalUrl.trim().startsWith('http')) {
    return cachedLocalUrl.trim();
  }

  return '';
}
