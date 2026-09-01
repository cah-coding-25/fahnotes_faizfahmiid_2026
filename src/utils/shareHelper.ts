import { Note, AppSettings } from '../types';
import confetti from 'canvas-confetti';

export interface TriggerShareOptions {
  note: Note;
  settings?: Partial<AppSettings>;
  onShowToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
  onOpenModalFallback: () => void;
}

/**
 * Smart Cross-Device Share Executor:
 * - When on mobile or when preferNativeShare is ON (default):
 *   Directly triggers the smartphone's native OS share sheet (WhatsApp, Telegram, Bluetooth, etc.).
 *   Does NOT open the website popup modal on mobile if native share succeeds.
 * - When on desktop / PC (or if native share is unavailable):
 *   Opens the interactive Website Share Modal with QR code scan for mobile camera, direct links, and dataset.
 */
export async function triggerSmartShare({
  note,
  settings = {},
  onShowToast,
  onOpenModalFallback,
}: TriggerShareOptions): Promise<void> {
  const shareUrl = typeof window !== 'undefined'
    ? `${window.location.origin}${window.location.pathname}?note=${note.id}`
    : `https://app.dev/?note=${note.id}`;

  const cleanDescription = note.description || 'Koleksi catatan kode, otomasi, dan script siap pakai.';
  const shareSummaryText = `📌 *${note.title}*\n📝 ${cleanDescription}\n👤 Oleh: ${note.author || 'Admin'}\n🔗 Baca selengkapnya: ${shareUrl}`;

  // Read nozzle settings (defaults to true)
  const preferNativeShare = settings.preferNativeShare !== false;
  const enableWebsiteShareModal = settings.enableWebsiteShareModal !== false;
  const autoCopyToClipboard = settings.autoCopyToClipboard !== false;

  const isMobile = typeof navigator !== 'undefined' && 
    /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(navigator.userAgent.toLowerCase());

  const hasNativeShare = typeof navigator !== 'undefined' && typeof navigator.share === 'function';

  // 📱 Priority 1: Native Mobile Share Sheet (WAJIB Bawaan HP - Tanpa Popup Website)
  if (hasNativeShare && (preferNativeShare || isMobile)) {
    try {
      await navigator.share({
        title: note.title,
        text: `${note.title} - ${cleanDescription}`,
        url: shareUrl,
      });
      // User successfully interacted with native OS share sheet!
      return;
    } catch (err: any) {
      // User tapped cancel/close in native share sheet -> exit gracefully
      if (err?.name === 'AbortError') {
        return;
      }
      console.warn('Native share encountered issue:', err);
    }
  }

  // 💻 Priority 2: Website Interactive Modal (Desktop / PC with QR Code & Multi-Platform dataset)
  if (!isMobile && enableWebsiteShareModal) {
    onOpenModalFallback();
    return;
  }

  // 📋 Priority 3: Automatic Clipboard Copy fallback
  if (autoCopyToClipboard) {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(shareUrl);
        confetti({ particleCount: 20, spread: 40, origin: { y: 0.7 } });
        onShowToast('Tautan catatan berhasil disalin ke papan klip!', 'success');
        return;
      }
    } catch (clipErr) {
      console.warn('Clipboard write error:', clipErr);
    }
  }

  // Final fallback: Open Website Modal if allowed
  if (enableWebsiteShareModal) {
    onOpenModalFallback();
  } else {
    onShowToast(`Tautan: ${shareUrl}`, 'info');
  }
}
