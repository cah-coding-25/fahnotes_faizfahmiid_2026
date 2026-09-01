import React, { useState, useEffect } from 'react';
import { Note } from '../types';
import {
  X,
  Share2,
  Copy,
  Check,
  Smartphone,
  Monitor,
  QrCode,
  Globe,
  Send,
  MessageCircle,
  Mail,
  ExternalLink,
  Sparkles,
  Download,
  Laptop
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ShareModalProps {
  note: Note;
  isOpen: boolean;
  onClose: () => void;
  onShowToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

type DeviceTab = 'all' | 'mobile' | 'desktop';

export const ShareModal: React.FC<ShareModalProps> = ({
  note,
  isOpen,
  onClose,
  onShowToast,
}) => {
  const [activeTab, setActiveTab] = useState<DeviceTab>('all');
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedText, setCopiedText] = useState(false);
  const [isMobileDevice, setIsMobileDevice] = useState(false);
  const [canNativeShare, setCanNativeShare] = useState(false);

  // Derive current absolute share URL
  const shareUrl = typeof window !== 'undefined'
    ? `${window.location.origin}${window.location.pathname}?note=${note.id}`
    : `https://app.dev/?note=${note.id}`;

  const cleanDescription = note.description || 'Koleksi catatan kode, tutorial otomasi, dan script siap pakai';
  const shareSummaryText = `📌 *${note.title}*\n📝 ${cleanDescription}\n👤 Oleh: ${note.author || 'Admin'}\n🔗 Baca selengkapnya: ${shareUrl}`;

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userAgent = navigator.userAgent.toLowerCase();
      const mobileCheck = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
      setIsMobileDevice(mobileCheck);
      setCanNativeShare(typeof navigator.share === 'function');
      if (mobileCheck) {
        setActiveTab('mobile');
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCopyLink = async () => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(shareUrl);
      }
      setCopiedLink(true);
      confetti({ particleCount: 25, spread: 45, origin: { y: 0.7 } });
      onShowToast('Tautan catatan berhasil disalin ke papan klip!', 'success');
      setTimeout(() => setCopiedLink(false), 2500);
    } catch {
      onShowToast('Gagal menyalin tautan secara otomatis', 'error');
    }
  };

  const handleCopyFormattedText = async () => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(shareSummaryText);
      }
      setCopiedText(true);
      confetti({ particleCount: 25, spread: 45, origin: { y: 0.7 } });
      onShowToast('Ringkasan teks dan link berhasil disalin!', 'success');
      setTimeout(() => setCopiedText(false), 2500);
    } catch {
      onShowToast('Gagal menyalin teks', 'error');
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: note.title,
          text: `${note.title} - ${cleanDescription}`,
          url: shareUrl,
        });
        onShowToast('Berhasil membuka menu bagikan perangkat!', 'success');
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          handleCopyLink();
        }
      }
    } else {
      handleCopyLink();
    }
  };

  // Direct platform URLs
  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedTitle = encodeURIComponent(note.title);
  const encodedText = encodeURIComponent(shareSummaryText);

  const shareLinks = {
    whatsapp: `https://api.whatsapp.com/send?text=${encodedText}`,
    telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    email: `mailto:?subject=${encodedTitle}&body=${encodedText}`,
  };

  // QR Code URL (High quality, reliable API)
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=260x260&margin=10&data=${encodeURIComponent(shareUrl)}`;

  const handleDownloadQr = () => {
    const link = document.createElement('a');
    link.href = qrCodeUrl;
    link.download = `QR_${note.slug || 'catatan'}.png`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    onShowToast('Membuka gambar QR Code...', 'info');
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="nb-box w-full max-w-xl bg-white border-2 border-black rounded-2xl shadow-[6px_6px_0px_#000] overflow-hidden flex flex-col max-h-[90vh] text-black"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-[#FFD233] p-4 sm:p-4.5 border-b-2 border-black flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-black text-[#FFD233] flex items-center justify-center border border-black shadow-[1.5px_1.5px_0px_#000]">
              <Share2 className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="font-display font-black text-base sm:text-lg tracking-tight uppercase leading-none">
                Bagikan Catatan
              </h3>
              <p className="text-[11px] font-bold text-black/75 mt-0.5">
                Pilih opsi dataset bagikan sesuai perangkat Anda
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white hover:bg-black hover:text-white border-2 border-black flex items-center justify-center transition-colors shadow-[1px_1px_0px_#000]"
            title="Tutup Modal"
          >
            <X className="w-4 h-4 stroke-[3]" />
          </button>
        </div>

        {/* Note Preview Strip */}
        <div className="bg-[#FAF5EE] p-3 sm:px-4 border-b-2 border-black flex items-center justify-between gap-3">
          <div className="min-w-0 flex-1">
            <span className="inline-block px-2 py-0.5 text-[9px] font-black uppercase rounded bg-[#FFD233] border border-black text-black mb-1">
              {note.category || 'Umum'}
            </span>
            <h4 className="font-bold text-xs sm:text-sm text-black truncate" title={note.title}>
              {note.title}
            </h4>
          </div>
          <span className="text-[10px] font-mono text-black/60 shrink-0 font-bold">
            by {note.author || 'Admin'}
          </span>
        </div>

        {/* Interactive Device Selector Tabs */}
        <div className="flex border-b-2 border-black bg-zinc-100 p-1.5 gap-1.5">
          <button
            onClick={() => setActiveTab('all')}
            className={`flex-1 py-2 px-3 rounded-lg text-xs font-black flex items-center justify-center gap-1.5 transition-all border ${
              activeTab === 'all'
                ? 'bg-white text-black border-black shadow-[2px_2px_0px_#000]'
                : 'text-zinc-600 hover:text-black border-transparent hover:bg-zinc-200'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Semua Opsi</span>
          </button>

          <button
            onClick={() => setActiveTab('mobile')}
            className={`flex-1 py-2 px-3 rounded-lg text-xs font-black flex items-center justify-center gap-1.5 transition-all border ${
              activeTab === 'mobile'
                ? 'bg-[#A7F3D0] text-black border-black shadow-[2px_2px_0px_#000]'
                : 'text-zinc-600 hover:text-black border-transparent hover:bg-zinc-200'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Ponsel / HP</span>
            {isMobileDevice && (
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('desktop')}
            className={`flex-1 py-2 px-3 rounded-lg text-xs font-black flex items-center justify-center gap-1.5 transition-all border ${
              activeTab === 'desktop'
                ? 'bg-[#BAE6FD] text-black border-black shadow-[2px_2px_0px_#000]'
                : 'text-zinc-600 hover:text-black border-transparent hover:bg-zinc-200'
            }`}
          >
            <Laptop className="w-3.5 h-3.5" />
            <span>Laptop & QR Scan</span>
          </button>
        </div>

        {/* Modal Scrollable Body Content */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1">
          
          {/* ============================================================ */}
          {/* TAB 1: ALL / UNIVERSAL QUICK ACTIONS */}
          {/* ============================================================ */}
          {(activeTab === 'all' || activeTab === 'mobile') && (
            <div className="space-y-3">
              {/* Native Mobile Share Button (if supported or highlighted for mobile) */}
              {canNativeShare && (
                <button
                  onClick={handleNativeShare}
                  className="nb-btn w-full bg-[#10B981] hover:bg-[#059669] text-white py-3 px-4 rounded-xl font-black text-sm gap-2 border-2 border-black shadow-[3px_3px_0px_#000] flex items-center justify-center"
                >
                  <Smartphone className="w-5 h-5 stroke-[2.5]" />
                  <span>Buka Menu Bagikan Bawaan Perangkat (OS Share Sheet)</span>
                </button>
              )}

              {/* Instant Social Channels Grid */}
              <div>
                <p className="text-[11px] font-black uppercase text-black/60 mb-2 tracking-wider">
                  Kirim Cepat ke Aplikasi & Media Sosial:
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  <a
                    href={shareLinks.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="nb-btn bg-[#25D366] hover:bg-[#1EBE5B] text-black font-black text-xs py-2.5 px-3 rounded-xl border-2 border-black shadow-[2px_2px_0px_#000] flex items-center gap-2"
                  >
                    <MessageCircle className="w-4 h-4 stroke-[2.5] text-black shrink-0" />
                    <span>WhatsApp</span>
                  </a>

                  <a
                    href={shareLinks.telegram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="nb-btn bg-[#229ED9] hover:bg-[#1C8CC1] text-black font-black text-xs py-2.5 px-3 rounded-xl border-2 border-black shadow-[2px_2px_0px_#000] flex items-center gap-2"
                  >
                    <Send className="w-4 h-4 stroke-[2.5] text-black shrink-0" />
                    <span>Telegram</span>
                  </a>

                  <a
                    href={shareLinks.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="nb-btn bg-[#18181B] hover:bg-black text-white font-black text-xs py-2.5 px-3 rounded-xl border-2 border-black shadow-[2px_2px_0px_#000] flex items-center gap-2"
                  >
                    <span className="font-mono text-sm leading-none">𝕏</span>
                    <span>Twitter / X</span>
                  </a>

                  <a
                    href={shareLinks.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="nb-btn bg-[#1877F2] hover:bg-[#166FE5] text-white font-black text-xs py-2.5 px-3 rounded-xl border-2 border-black shadow-[2px_2px_0px_#000] flex items-center gap-2"
                  >
                    <span className="font-bold text-sm leading-none">f</span>
                    <span>Facebook</span>
                  </a>

                  <a
                    href={shareLinks.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="nb-btn bg-[#0A66C2] hover:bg-[#095196] text-white font-black text-xs py-2.5 px-3 rounded-xl border-2 border-black shadow-[2px_2px_0px_#000] flex items-center gap-2"
                  >
                    <span className="font-bold text-xs leading-none">in</span>
                    <span>LinkedIn</span>
                  </a>

                  <a
                    href={shareLinks.email}
                    className="nb-btn bg-[#FCD34D] hover:bg-[#FBBF24] text-black font-black text-xs py-2.5 px-3 rounded-xl border-2 border-black shadow-[2px_2px_0px_#000] flex items-center gap-2"
                  >
                    <Mail className="w-4 h-4 stroke-[2.5] text-black shrink-0" />
                    <span>Email Langsung</span>
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* TAB 2: LAPTOP / DESKTOP & CROSS-DEVICE QR CODE */}
          {/* ============================================================ */}
          {(activeTab === 'all' || activeTab === 'desktop') && (
            <div className="space-y-3 pt-1">
              <div className="p-3.5 bg-[#F0F9FF] border-2 border-black rounded-xl shadow-[3px_3px_0px_#000] flex flex-col sm:flex-row items-center gap-4">
                {/* QR Code Container */}
                <div className="bg-white p-2.5 rounded-xl border-2 border-black shadow-[2px_2px_0px_#000] shrink-0 text-center">
                  <img
                    src={qrCodeUrl}
                    alt={`QR Code ${note.title}`}
                    className="w-32 h-32 object-contain"
                    loading="lazy"
                  />
                  <span className="block text-[9px] font-mono font-black text-black/70 mt-1 uppercase">
                    Scan via Kamera HP
                  </span>
                </div>

                {/* QR Info & Download Action */}
                <div className="flex-1 space-y-2 text-center sm:text-left">
                  <div className="flex items-center justify-center sm:justify-start gap-1.5">
                    <QrCode className="w-4 h-4 text-black stroke-[2.5]" />
                    <h5 className="font-black text-xs sm:text-sm text-black uppercase">
                      Pindai QR Antar-Perangkat
                    </h5>
                  </div>
                  <p className="text-[11px] text-black/80 font-medium leading-relaxed">
                    Sedang membuka di PC/Laptop? Arahkan kamera HP Anda ke barcode ini untuk membuka catatan langsung di smartphone tanpa perlu copy-paste!
                  </p>
                  <button
                    onClick={handleDownloadQr}
                    className="nb-btn bg-white hover:bg-zinc-100 text-black px-3 py-1.5 text-[11px] font-black border-2 border-black gap-1.5 shadow-[1.5px_1.5px_0px_#000]"
                  >
                    <Download className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span>Unduh Gambar QR Code</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* DIRECT LINK & FORMATTED TEXT COPY BOX */}
          {/* ============================================================ */}
          <div className="space-y-2.5 pt-2 border-t-2 border-black/10">
            <div>
              <label className="block text-[10px] font-black uppercase text-black/70 mb-1">
                Tautan Langsung (Direct URL):
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={shareUrl}
                  className="nb-input flex-1 px-3 py-2 text-xs font-mono bg-[#FAF5EE] border-2 border-black text-black select-all"
                  onClick={(e) => (e.target as HTMLInputElement).select()}
                />
                <button
                  onClick={handleCopyLink}
                  className={`nb-btn px-4 py-2 text-xs font-black border-2 border-black shrink-0 transition-all ${
                    copiedLink
                      ? 'bg-[#BBF7D0] text-black shadow-[2px_2px_0px_#000]'
                      : 'bg-[#FFD233] hover:bg-[#FFE066] text-black shadow-[2px_2px_0px_#000]'
                  }`}
                  title="Salin Tautan Catatan"
                >
                  {copiedLink ? <Check className="w-4 h-4 stroke-[3]" /> : <Copy className="w-4 h-4 stroke-[2.5]" />}
                  <span>{copiedLink ? 'Tersalin!' : 'Salin URL'}</span>
                </button>
              </div>
            </div>

            {/* Formatted Text Box */}
            <div>
              <label className="block text-[10px] font-black uppercase text-black/70 mb-1">
                Salin Format Ringkasan Lengkap (Untuk Pesan/Chat/Forum):
              </label>
              <div className="flex items-center justify-between gap-2">
                <p className="text-[11px] text-black/70 font-medium italic truncate max-w-[280px] sm:max-w-md">
                  "{shareSummaryText.replace(/\n/g, ' ')}"
                </p>
                <button
                  onClick={handleCopyFormattedText}
                  className={`nb-btn px-3 py-1.5 text-[11px] font-black border-2 border-black shrink-0 ${
                    copiedText ? 'bg-[#BBF7D0] text-black' : 'bg-white hover:bg-zinc-100 text-black shadow-[1.5px_1.5px_0px_#000]'
                  }`}
                >
                  {copiedText ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : <Copy className="w-3.5 h-3.5 stroke-[2.5]" />}
                  <span>{copiedText ? 'Tersalin' : 'Salin Teks'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Close */}
        <div className="bg-[#FAF5EE] p-3 px-4 border-t-2 border-black flex items-center justify-between">
          <span className="text-[11px] font-bold text-black/70 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-black" />
            <span>Dataset bagikan interaktif & responsif untuk semua perangkat</span>
          </span>
          <button
            onClick={onClose}
            className="nb-btn bg-black hover:bg-zinc-800 text-white px-4 py-1.5 text-xs font-black border-2 border-black shadow-[2px_2px_0px_#000]"
          >
            Selesai
          </button>
        </div>
      </div>
    </div>
  );
};
