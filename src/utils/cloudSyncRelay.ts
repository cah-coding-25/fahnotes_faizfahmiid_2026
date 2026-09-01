/**
 * ⚡ fahnotes — Zero-Config Universal Cloud Sync Relay
 * Dibuat oleh: Faiz_Fahmi_ID
 * 
 * Sistem sinkronisasi otomatis agar ketika Admin memasukkan link Google Sheets
 * di website (tanpa coding & tanpa utak-atik setting), link tersebut langsung
 * tersimpan dan terbaca oleh seluruh perangkat & pengunjung di Vercel / Netlify / Cloud!
 */

import { encryptVaultData, decryptVaultData } from './securityVault';

// Public distributed key identifier for fahnotes project
const CLOUD_SYNC_PROJECT_KEY = 'fahnotes_vault_sync_faiz_fahmi_id';

export interface CloudRelayPayload {
  googleSheetsWebAppUrl: string;
  adminUsername: string;
  adminPasswordHash: string;
  siteName: string;
  authorName: string;
  categories: string[];
  updatedAt: string;
  version: number;
}

/**
 * 1. URL HASH AUTO-ABSORBER:
 * Memeriksa apakah ada parameter magic link pada URL (contoh: https://fahnotes.vercel.app/#s=ENC_DATA)
 * Jika ada, otomatis simpan ke storage dan bersihkan URL agar rapi!
 */
export function checkAndAbsorbUrlMagicLink(): Partial<CloudRelayPayload> | null {
  try {
    if (typeof window === 'undefined') return null;

    const hash = window.location.hash;
    const search = window.location.search;
    let rawEncoded = '';

    if (hash && (hash.includes('s=') || hash.includes('cfg='))) {
      const match = hash.match(/(?:s|cfg)=([^&]+)/);
      if (match && match[1]) {
        rawEncoded = decodeURIComponent(match[1]);
      }
    } else if (search && (search.includes('s=') || search.includes('cfg='))) {
      const params = new URLSearchParams(search);
      rawEncoded = params.get('s') || params.get('cfg') || '';
    }

    if (rawEncoded) {
      // Decode and decrypt
      let extractedUrl = '';
      try {
        // Check if plain URL
        if (rawEncoded.startsWith('http')) {
          extractedUrl = rawEncoded;
        } else {
          // Base64 / Encrypted
          const decoded = atob(rawEncoded);
          if (decoded.startsWith('http')) {
            extractedUrl = decoded;
          } else {
            const parsed = JSON.parse(decoded);
            if (parsed.url || parsed.googleSheetsWebAppUrl) {
              extractedUrl = parsed.url || parsed.googleSheetsWebAppUrl;
            }
          }
        }
      } catch {
        extractedUrl = rawEncoded;
      }

      if (extractedUrl && extractedUrl.startsWith('http')) {
        // Clean URL in browser address bar without refreshing
        const cleanUrl = window.location.protocol + '//' + window.location.host + window.location.pathname;
        window.history.replaceState({ path: cleanUrl }, '', cleanUrl);

        return {
          googleSheetsWebAppUrl: extractedUrl
        };
      }
    }
  } catch (err) {
    console.warn('Failed to parse URL magic link:', err);
  }
  return null;
}

/**
 * Generate 1-Click Magic Shareable Auto-Connect Link
 */
export function generateAutoConnectLink(webAppUrl: string): string {
  if (typeof window === 'undefined' || !webAppUrl) return '';
  const baseUrl = window.location.protocol + '//' + window.location.host + window.location.pathname;
  try {
    const encoded = btoa(webAppUrl.trim());
    return `${baseUrl}#s=${encodeURIComponent(encoded)}`;
  } catch {
    return `${baseUrl}#s=${encodeURIComponent(webAppUrl.trim())}`;
  }
}

/**
 * 2. CLOUD RELAY BROADCASTER:
 * Menyimpan konfigurasi ke relay cloud terdistribusi saat Admin klik Simpan di website
 */
export async function broadcastConfigToCloudRelay(payload: Partial<CloudRelayPayload>): Promise<boolean> {
  if (!payload.googleSheetsWebAppUrl) return false;

  try {
    // 1. Send to internal /api/global-config (Works on Express & Vercel Serverless)
    try {
      await fetch('/api/global-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    } catch {}

    // 2. Also broadcast payload to Google Sheets Web App itself (it acts as its own master validator!)
    try {
      if (payload.googleSheetsWebAppUrl.startsWith('http')) {
        fetch(payload.googleSheetsWebAppUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify({
            action: 'updateSettings',
            settings: {
              adminUsername: payload.adminUsername || 'Faiz_Fahmi_ID',
              adminPassword: payload.adminPasswordHash || 'admin123',
              authorName: payload.authorName || 'Faiz_Fahmi_ID'
            }
          })
        }).catch(() => {});
      }
    } catch {}

    return true;
  } catch (err) {
    console.warn('Cloud relay broadcast error:', err);
    return false;
  }
}
