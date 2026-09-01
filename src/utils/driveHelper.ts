/**
 * Helper to convert Google Drive sharing links into direct viewable image URLs,
 * direct download URLs without login account prompt, and instant trigger downloads.
 */

export function extractGoogleDriveFileId(url: string): string | null {
  if (!url || typeof url !== 'string') return null;
  const cleanUrl = url.trim();

  // Pattern 1: /file/d/FILE_ID/
  const fileDMatch = cleanUrl.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (fileDMatch && fileDMatch[1]) {
    return fileDMatch[1];
  }

  // Pattern 2: id=FILE_ID
  const idParamMatch = cleanUrl.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (idParamMatch && idParamMatch[1]) {
    return idParamMatch[1];
  }

  // Pattern 3: /d/FILE_ID
  const dMatch = cleanUrl.match(/\/d\/([a-zA-Z0-9_-]+)/);
  if (dMatch && dMatch[1]) {
    return dMatch[1];
  }

  // Pattern 4: /folders/FOLDER_ID or /drive/folders/FOLDER_ID
  const folderMatch = cleanUrl.match(/\/folders\/([a-zA-Z0-9_-]+)/);
  if (folderMatch && folderMatch[1]) {
    return folderMatch[1];
  }

  // Pattern 5: direct ID if user just pasted an alphanumeric string > 20 chars
  if (/^[a-zA-Z0-9_-]{25,45}$/.test(cleanUrl)) {
    return cleanUrl;
  }

  return null;
}

export function formatImageUrl(url: string): string {
  if (!url || !url.trim()) return '';
  const trimmed = url.trim();

  const driveId = extractGoogleDriveFileId(trimmed);
  if (driveId) {
    // Google's direct high-res CDN preview endpoint (no Google login required)
    return `https://lh3.googleusercontent.com/d/${driveId}`;
  }

  return trimmed;
}

export function isGoogleDriveUrl(url: string): boolean {
  if (!url) return false;
  return url.includes('drive.google.com') || url.includes('docs.google.com') || extractGoogleDriveFileId(url) !== null;
}

/**
 * Returns a direct download URL for Google Drive files that automatically triggers
 * download in the browser without asking for Google Account login or opening preview viewer.
 */
export function getGoogleDriveDirectDownloadUrl(url: string): string {
  if (!url || !url.trim()) return '';
  const trimmed = url.trim();

  const driveId = extractGoogleDriveFileId(trimmed);
  if (driveId) {
    // Direct download endpoint from Google Drive API export
    return `https://drive.google.com/uc?export=download&id=${driveId}`;
  }

  return trimmed;
}

/**
 * Triggers direct browser download automatically without user having to navigate or select account.
 */
export function triggerDirectDownload(url: string, suggestedFilename?: string): boolean {
  if (!url) return false;
  try {
    const downloadUrl = isGoogleDriveUrl(url) 
      ? getGoogleDriveDirectDownloadUrl(url) 
      : url;

    // Use a temporary anchor element
    const link = document.createElement('a');
    link.href = downloadUrl;
    if (suggestedFilename) {
      link.download = suggestedFilename;
    }
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    setTimeout(() => {
      document.body.removeChild(link);
    }, 200);
    return true;
  } catch (err) {
    console.error('Error triggering direct download:', err);
    window.open(url, '_blank');
    return false;
  }
}
