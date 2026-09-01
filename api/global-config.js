/**
 * ⚡ Vercel Serverless Function: /api/global-config
 * Dibuat oleh: Faiz_Fahmi_ID
 * 
 * Serverless handler untuk deployment Vercel agar request /api/global-config
 * berjalan mulus dan dapat menyimpan / membaca konfigurasi Google Sheets secara otomatis.
 */

// In-memory cache for serverless instance lifecycle
let cachedConfig = {
  googleSheetsWebAppUrl: process.env.VITE_GOOGLE_SHEETS_URL || process.env.GOOGLE_SHEETS_URL || '',
  adminUsername: 'Faiz_Fahmi_ID',
  adminPasswordHash: 'admin123',
  authorName: 'Faiz_Fahmi_ID',
  siteName: 'fahnotes',
  categories: ['BAT Script', 'HTML / Web', 'Python', 'JavaScript', 'Otomasi', 'Tutorial'],
  updatedAt: new Date().toISOString(),
  version: 1
};

export default async function handler(req, res) {
  // CORS & Security Headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'GET') {
    // If environment variable is set in Vercel, prioritize it
    const envUrl = process.env.VITE_GOOGLE_SHEETS_URL || process.env.GOOGLE_SHEETS_URL;
    if (envUrl && typeof envUrl === 'string' && envUrl.startsWith('http')) {
      cachedConfig.googleSheetsWebAppUrl = envUrl.trim();
    }

    return res.status(200).json({
      success: true,
      config: cachedConfig
    });
  }

  if (req.method === 'POST') {
    try {
      const incoming = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      if (incoming && typeof incoming === 'object') {
        cachedConfig = {
          ...cachedConfig,
          ...incoming,
          updatedAt: new Date().toISOString(),
          version: (cachedConfig.version || 1) + 1
        };

        return res.status(200).json({
          success: true,
          message: 'Config updated in serverless runtime',
          config: cachedConfig
        });
      }
      return res.status(400).json({ success: false, error: 'Invalid payload' });
    } catch (err) {
      return res.status(500).json({ success: false, error: String(err) });
    }
  }

  return res.status(405).json({ success: false, error: 'Method not allowed' });
}
