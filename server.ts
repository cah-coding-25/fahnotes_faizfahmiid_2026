import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// Path to persistent server-side config file
const DATA_DIR = path.join(process.cwd(), 'data');
const CONFIG_FILE = path.join(DATA_DIR, 'global-config.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

interface GlobalConfig {
  googleSheetsWebAppUrl: string;
  adminUsername: string;
  adminPasswordHash: string;
  authorName: string;
  siteName: string;
  categories: string[];
  notes?: any[];
  lastSyncedAt: string;
  updatedAt: string;
  version: number;
}

const DEFAULT_GLOBAL_CONFIG: GlobalConfig = {
  googleSheetsWebAppUrl: process.env.VITE_GOOGLE_SHEETS_URL || process.env.GOOGLE_SHEETS_URL || '',
  adminUsername: 'Faiz_Fahmi_ID',
  adminPasswordHash: 'admin123',
  authorName: 'Faiz_Fahmi_ID',
  siteName: 'fahnotes',
  categories: ['BAT Script', 'HTML / Web', 'Python', 'JavaScript', 'Otomasi', 'Tutorial'],
  notes: [],
  lastSyncedAt: '',
  updatedAt: new Date().toISOString(),
  version: 1
};

function readGlobalConfig(): GlobalConfig {
  try {
    if (fs.existsSync(CONFIG_FILE)) {
      const data = fs.readFileSync(CONFIG_FILE, 'utf-8');
      const parsed = JSON.parse(data);
      return { ...DEFAULT_GLOBAL_CONFIG, ...parsed };
    }
  } catch (err) {
    console.error('Error reading global-config.json:', err);
  }
  return DEFAULT_GLOBAL_CONFIG;
}

function writeGlobalConfig(config: Partial<GlobalConfig>): GlobalConfig {
  try {
    const current = readGlobalConfig();
    const newUrl = (config.googleSheetsWebAppUrl && typeof config.googleSheetsWebAppUrl === 'string' && config.googleSheetsWebAppUrl.trim().startsWith('http'))
      ? config.googleSheetsWebAppUrl.trim()
      : current.googleSheetsWebAppUrl;

    const updated: GlobalConfig = {
      ...current,
      ...config,
      googleSheetsWebAppUrl: newUrl,
      updatedAt: new Date().toISOString(),
      version: (current.version || 1) + 1
    };
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(updated, null, 2), 'utf-8');
    return updated;
  } catch (err) {
    console.error('Error writing global-config.json:', err);
    return readGlobalConfig();
  }
}

// -------------------------------------------------------------
// API ROUTES (Mounted FIRST before Vite middleware)
// -------------------------------------------------------------

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Get global config (accessible by all devices & visitors across Indonesia)
app.get('/api/global-config', (req, res) => {
  const config = readGlobalConfig();
  res.json({
    success: true,
    config
  });
});

// Update global config (invoked when admin updates Google Sheets link, credentials, or categories)
app.post('/api/global-config', (req, res) => {
  try {
    const incoming = req.body;
    if (!incoming || typeof incoming !== 'object') {
      res.status(400).json({ success: false, error: 'Invalid payload' });
      return;
    }

    const saved = writeGlobalConfig(incoming);
    console.log(`[Global Config Updated] Version: ${saved.version}, URL: ${saved.googleSheetsWebAppUrl ? 'SET' : 'EMPTY'}`);
    res.json({
      success: true,
      message: 'Global config updated successfully',
      config: saved
    });
  } catch (err: any) {
    console.error('Failed to update global config:', err);
    res.status(500).json({ success: false, error: err.message || 'Internal server error' });
  }
});

// Proxy sync from Google Sheets to avoid CORS on diverse client networks
app.get('/api/proxy/sheets-pull', async (req, res) => {
  try {
    const config = readGlobalConfig();
    const targetUrl = (req.query.url as string) || config.googleSheetsWebAppUrl;

    if (!targetUrl || !targetUrl.startsWith('http')) {
      res.status(400).json({ success: false, error: 'URL Google Apps Script belum disetel' });
      return;
    }

    const fetchUrl = new URL(targetUrl);
    fetchUrl.searchParams.set('action', 'getAll');
    fetchUrl.searchParams.set('_t', Date.now().toString());

    const response = await fetch(fetchUrl.toString(), {
      method: 'GET',
      headers: { 'Accept': 'application/json' }
    });

    if (!response.ok) {
      throw new Error(`Google Sheets responded with HTTP ${response.status}`);
    }

    const data = await response.json();
    if (data && data.success) {
      // Auto cache latest data to server config
      if (Array.isArray(data.notes)) {
        writeGlobalConfig({
          notes: data.notes,
          categories: Array.isArray(data.categories) ? data.categories : config.categories,
          adminUsername: data.settings?.adminUsername || config.adminUsername,
          adminPasswordHash: data.settings?.adminPassword || config.adminPasswordHash,
          lastSyncedAt: new Date().toISOString()
        });
      }
    }

    res.json(data);
  } catch (err: any) {
    console.error('Proxy pull error:', err);
    res.status(500).json({ success: false, error: err.message || 'Proxy sync failed' });
  }
});

// Proxy sync push to Google Sheets
app.post('/api/proxy/sheets-push', async (req, res) => {
  try {
    const config = readGlobalConfig();
    const targetUrl = req.body.url || config.googleSheetsWebAppUrl;

    if (!targetUrl || !targetUrl.startsWith('http')) {
      res.status(400).json({ success: false, error: 'URL Google Apps Script belum disetel' });
      return;
    }

    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body.payload || req.body)
    });

    const data = await response.json();

    // Cache latest notes to server
    if (req.body.payload?.notes && Array.isArray(req.body.payload.notes)) {
      writeGlobalConfig({
        notes: req.body.payload.notes,
        categories: req.body.payload.categories || config.categories,
        lastSyncedAt: new Date().toISOString()
      });
    }

    res.json(data);
  } catch (err: any) {
    console.error('Proxy push error:', err);
    res.status(500).json({ success: false, error: err.message || 'Proxy push failed' });
  }
});

// -------------------------------------------------------------
// VITE MIDDLEWARE & STATIC SERVING
// -------------------------------------------------------------
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`fahnotes server running on port ${PORT} at http://0.0.0.0:${PORT}`);
  });
}

startServer();
