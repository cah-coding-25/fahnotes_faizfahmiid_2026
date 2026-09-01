# 📄 PRODUCT REQUIREMENT DOCUMENT (PRD) & BLUEPRINT ARSITEKTUR
# ⚡ fahnotes — Modern Developer Knowledge Base, Code Repository & Cloud Script Hub
> **Status Dokumen:** Production-Ready Specification (Super Lengkap)  
> **Versi Dokumen:** v2.5.0  
> **Pencipta & Pengelola Proyek:** **`by: Faiz_Fahmi_ID`**  
> **Lisensi & Hak Cipta:** Private / Open Blueprint by Faiz_Fahmi_ID  

---

## 📑 DAFTAR ISI
1. [Ringkasan Eksekutif & Visi Produk](#1-ringkasan-eksekutif--visi-produk)
2. [Persona Pengguna & Use Cases](#2-persona-pengguna--use-cases)
3. [Arsitektur Sistem & Tech Stack Lengkap](#3-arsitektur-sistem--tech-stack-lengkap)
4. [Spesifikasi Fitur Fungsional & Logika Bisnis](#4-spesifikasi-fitur-fungsional--logika-bisnis)
   * 4.1. Editor Blok Modular (Notion + Colab Hybrid)
   * 4.2. Terminal Code Block & Direct Script Execution (.bat, .sh, .py, dll.)
   * 4.3. Multi-Layer Cloud Persistence & Google Sheets Serverless Database
   * 4.4. Disguised Admin Security & Secret Authentication
   * 4.5. Instant Search Engine & Category Taxonomy
   * 4.6. Universal 1-Click Auto-Connect Magic Link
5. [Skema Basis Data & Spesifikasi API (Google Apps Script Code.gs)](#5-skema-basis-data--spesifikasi-api-google-apps-script-codegs)
6. [Struktur Direktori & Blueprint File Source Code](#6-struktur-direktori--blueprint-file-source-code)
7. [Panduan Langkah Demi Langkah Kloning & Deployment (Step-by-Step Cloning Guide)](#7-panduan-langkah-demi-langkah-kloning--deployment-step-by-step-cloning-guide)
   * 7.1. Persiapan Repositori & Instalasi Lokal
   * 7.2. Setup Google Spreadsheet & Deployment Google Apps Script
   * 7.3. Deploy ke Vercel / Netlify / VPS
8. [Desain Sistem UI/UX: Neo-Brutalism Canvas Guidelines](#8-desain-sistem-uiux-neo-brutalism-canvas-guidelines)
9. [Matriks Keamanan & Kebijakan Data](#9-matriks-keamanan--kebijakan-data)
10. [Rencana Pemeliharaan & Roadmap Masa Depan](#10-rencana-pemeliharaan--roadmap-masa-depan)

---

## 1. 🌟 RINGKASAN EKSEKUTIF & VISI PRODUK

**fahnotes** adalah platform web basis pengetahuan (*developer knowledge base*) dan repositori skrip multi-bahasa yang memadukan fleksibilitas dokumen berbasis blok ala **Notion** dengan kemampuan eksekusi kode terisolasi bergaya **Google Colab**, dibungkus dalam bahasa visual **Neo-Brutalism** kontemporer (garis tegas `#000000`, palet kontras tinggi, bayangan offset tajam, dan kanvas *full-width* terbuka tanpa kotak sempit).

### Masalah yang Diselesaikan (*Problem Statement*):
1. **Biaya & Kompleksitas Database Tradisional**: Developer mandiri sering kali membutuhkan media penyimpanan catatan cloud yang tersinkronisasi antar-perangkat namun terbebani biaya langganan database serverless (SQL/NoSQL) atau kerumitan setup koneksi.
2. **Keterbatasan Format Catatan Biasa**: Catatan teknis membutuhkan blok skrip nyata yang dapat diunduh langsung menjadi file ekstensi (`.bat`, `.sh`, `.py`, `.js`, `.json`, dll.) dan disalin 1-klik tanpa distorsi indentasi.
3. **Kemudahan Akses Lintas Perangkat**: Menghilangkan keharusan konfigurasi manual berulang kali di setiap perangkat/browser baru saat aplikasi dideploy ke layanan hosting statis seperti Vercel atau GitHub Pages.

### Nilai Utama (*Core Value Proposition*):
* **$0 Cloud Hosting & Zero-Cost Database**: Menggunakan Google Sheets + Google Apps Script Web App sebagai backend REST API *serverless* gratis selamanya dengan kapasitas ribuan baris data.
* **Universal 1-Input Setup**: Cukup memasukkan Web App URL di antarmuka web sekali, atau menggunakan *Magic Link Auto-Connect*, seluruh perangkat langsung tersinkronisasi permanen.
* **Disguised Admin Security**: Pengunjung publik hanya memiliki hak baca (*read-only*), sedangkan menu penulisan, pengeditan, penghapusan, dan konfigurasi terkunci di balik login tersembunyi di footer (`by: Faiz_Fahmi_ID`).

---

## 2. 👥 PERSONA PENGGUNA & USE CASES

### 2.1. Persona Utama: Administrator (Faiz_Fahmi_ID)
* **Kebutuhan**: Menyimpan koleksi skrip otomatisasi Windows Batch (`.bat`), Linux Bash (`.sh`), Python bot (`.py`), boilerplate web (`.html`/`.js`), dokumentasi API, dan tutorial konfigurasi server.
* **Tindakan**: Membuat, mengedit, memindahkan posisi blok, menandai catatan penting (*pin*), mengelola kategori, mengupdate kredensial, dan menyinkronkan data ke Google Sheets.

### 2.2. Persona Pengunjung / Publik: Developer, Siswa, & Rekan Kerja
* **Kebutuhan**: Mencari tutorial atau skrip siap pakai secepat mungkin tanpa proses registrasi akun yang rumit.
* **Tindakan**: Melakukan pencarian instan kata kunci (*real-time multi-field search*), menyaring berdasarkan kategori, membaca dokumentasi markdown, menyalin sintaks skrip (*Copy Code*), dan mengunduh skrip langsung menjadi file `.bat` / `.py` / `.sh` ke laptop/HP mereka.

---

## 3. 🛠️ ARSITEKTUR SISTEM & TECH STACK LENGKAP

```
                                    +-----------------------------------------+
                                    |         BROWSER CLIENT (REACT 19)       |
                                    | - Block-Based Editor (Notion/Colab)     |
                                    | - Instant Multi-Field Search (0ms)      |
                                    | - Neo-Brutalist Responsive Layout       |
                                    +--------------------+--------------------+
                                                         |
                              +--------------------------+--------------------------+
                              |                                                     |
                              v                                                     v
               +------------------------------+                      +------------------------------+
               |    LOCAL & BROWSER VAULT     |                      |     SERVER / SERVERLESS API  |
               | - Multi-Layer XOR Encryption |                      | - /api/global-config (Vercel)|
               | - LocalStorage Fallback      |                      | - Express Server.ts (Proxy)  |
               | - Magic Link Hash Absorber   |                      | - Cloud Sync Relay Broadcast |
               +--------------+---------------+                      +--------------+---------------+
                              |                                                     |
                              +--------------------------+--------------------------+
                                                         |
                                                         v
                                    +-----------------------------------------+
                                    |      GOOGLE APPS SCRIPT WEB APP API     |
                                    |       (Code.gs via doGet & doPost)      |
                                    +--------------------+--------------------+
                                                         |
                                                         v
                                    +-----------------------------------------+
                                    |        GOOGLE SPREADSHEET CLOUD         |
                                    |  Sheet1: fahnotes_db (Data Catatan)     |
                                    |  Sheet2: fahnotes_settings (Config/Auth)|
                                    +-----------------------------------------+
```

### 3.1. Spesifikasi Dependensi & Library (Production)
| Kategori | Paket / Tool | Versi | Peran Teknis & Alasan Pemilihan |
| :--- | :--- | :--- | :--- |
| **UI Framework** | `react` | `^19.0.1` | Core rendering engine berbasis komponen modern & hooks state. |
| **DOM Renderer** | `react-dom` | `^19.0.1` | Binding React ke browser Document Object Model. |
| **Language** | `typescript` | `~5.8.2` | Static type checking ketat untuk keamanan model data multi-blok. |
| **Build Tool** | `vite` | `^6.2.3` | Bundler super cepat dengan HMR dan plugin Tailwind v4. |
| **CSS Engine** | `tailwindcss` | `^4.1.14` | Styling utility-first untuk desain Neo-Brutalism tanpa file CSS berat. |
| **Tailwind Vite** | `@tailwindcss/vite` | `^4.1.14` | Integrasi resmi Vite plugin untuk Tailwind CSS v4. |
| **Icon Pack** | `lucide-react` | `^0.546.0` | 1000+ ikon SVG clean & konsisten dengan ketebalan stroke kustom. |
| **Animasi** | `motion` | `^12.23.24` | Transisi layout modal, expand-collapse kartu, dan interaksi gesture. |
| **Celebration FX** | `canvas-confetti` | `^1.9.4` | Efek konfeti partikel interaktif saat sukses menyimpan catatan/skrip. |
| **Markdown** | `react-markdown` | `^10.1.0` | Renderer format Markdown (# heading, bold, list, quote) pada blok teks. |
| **Backend Proxy** | `express` | `^4.21.2` | Server HTTP Node.js untuk proxy API lokal & endpoint `/api/*`. |
| **Dev Server Runtime** | `tsx` | `^4.21.0` | Eksekutor file `server.ts` langsung tanpa manual build saat development. |
| **Bundler Server** | `esbuild` | `^0.25.0` | Mengompilasi `server.ts` menjadi single self-contained `dist/server.cjs`. |
| **Env Manager** | `dotenv` | `^17.2.3` | Membaca variabel lingkungan `.env` / `.env.example`. |

---

## 4. ⚙️ SPESIFIKASI FITUR FUNGSIONAL & LOGIKA BISNIS

### 4.1. Editor Blok Modular (Notion + Colab Hybrid)
* **Model Blok Data (`NoteBlock`)**:
  Setiap catatan terdiri dari array blok independen dengan struktur:
  ```typescript
  export type BlockType = 'markdown' | 'code' | 'link' | 'image';
  export interface NoteBlock {
    id: string;
    type: BlockType;
    content: string;            // Teks markdown, isi kode skrip, atau URL link
    language?: string;          // bat, sh, py, js, html, css, json, dll.
    filename?: string;          // contoh: "backup_database.bat"
    showLineNumbers?: boolean;  // toggle penomoran baris pada terminal
    metadata?: {
      title?: string;           // judul untuk link bookmark
      url?: string;             // target URL bookmark
      caption?: string;         // keterangan gambar
    };
  }
  ```
* **Operasi Blok**:
  * Menambah blok baru di posisi bawah (`+ Markdown`, `+ Blok Kode`, `+ Link Tautan`).
  * Memindahkan urutan blok ke atas / ke bawah (*Reorder Up/Down*).
  * Menghapus blok individual dengan konfirmasi visual.
  * Preview langsung Markdown rendered secara real-time.

### 4.2. Terminal Code Block & Direct Script Execution
* **Visual Styling**: Mengusung tema *Deep Dark Console* (`#0A0A0A` / `#000000`) dengan border tebal 2px, dot window decoration (merah, kuning, hijau), dan font monospace tajam (`Consolas`, `Fira Code`, `JetBrains Mono`).
* **Fitur Aksi Kode**:
  1. **Salin Kode 1-Klik (*Copy to Clipboard*)**: Menyalin seluruh isi skrip tanpa merusak spasi atau line break, disertai toast notifikasi sukses.
  2. **Unduh File Skrip (*Direct Download*)**: Menghasilkan file blob langsung dengan MIME type yang tepat sesuai nama file pada blok (misal: `setup.bat` langsung terunduh sebagai file batch nyata di OS Windows/Linux pengguna).
  3. **Line Numbers Toggle**: Opsi menampilkan atau menyembunyikan nomor baris di sisi kiri editor kode.

### 4.3. Multi-Layer Cloud Persistence & Google Sheets Serverless Database
Sistem menjamin data tidak akan pernah hilang dengan menggunakan hierarki 4 lapis:
1. **Lapis 1 (Vercel Environment Variable)**: `VITE_GOOGLE_SHEETS_URL`.
2. **Lapis 2 (File Repositori GitHub)**: `src/config/appConfig.ts` (`APP_CONFIG.GOOGLE_SHEETS_WEB_APP_URL`).
3. **Lapis 3 (Security Browser Vault)**: Enkripsi XOR berlapis + Base64 pada `localStorage` browser.
4. **Lapis 4 (Serverless / Server Relay)**: `/api/global-config` (Vercel Serverless Function & Express `data/global-config.json`).

### 4.4. Disguised Admin Security & Secret Authentication
* **Trigger Login Terselubung**: Tidak ada tombol login mencolok di navigasi utama. Tombol login disamarkan secara cerdas pada teks atribusi footer: **`by: Faiz_Fahmi_ID`**.
* **Kredensial Bawaan**:
  * **Username**: `Faiz_Fahmi_ID`
  * **Password**: `admin123`
* **Manajemen Akun Admin**: Admin dapat mengganti username dan password kapan saja langsung dari tab Akun Admin pada modal pengaturan, yang otomatis terupdate ke Google Spreadsheet.
* **Hak Akses Publik**: Pengunjung biasa hanya dapat membaca, mencari, menyalin, dan mengunduh. Seluruh kontrol manipulasi data (`+ Tulis Catatan`, `Edit`, `Hapus`, `Pin`, `Pengaturan DB`) di-unmount dari DOM saat sesi admin nonaktif.

### 4.5. Instant Search Engine & Category Taxonomy
* **Pencarian Multi-Field 0ms**: Memindai judul catatan, ringkasan deskripsi, tag kata kunci, nama file skrip, hingga baris kode di dalam blok secara instan.
* **Taxonomy Kategori Dinamis**: Admin dapat menambah kategori baru, mengubah nama kategori lama (dengan pembaruan otomatis pada semua catatan terkait), atau menghapus kategori.
* **Filter Pil Navigasi**: Pil kategori interaktif di header lengkap dengan penghitung total catatan aktif per kategori.

### 4.6. Universal 1-Click Auto-Connect Magic Link
* **Fungsi**: Membagikan link website yang secara otomatis menghubungkan browser penerima ke database Google Sheets tanpa perlu mengetikkan URL manual.
* **Format Link**: `https://your-domain.vercel.app/#s=BASE64_ENCODED_URL`
* **Logika Kerja**: Saat halaman dimuat, skrip mendeteksi hash `#s=`, mendekripsi URL Web App, menyimpannya ke vault lokal, dan membersihkan URL di address bar browser secara *seamless* tanpa reload.

---

## 5. 📊 SKEMA BASIS DATA & SPESIFIKASI API (GOOGLE APPS SCRIPT CODE.GS)

### 5.1. Struktur Spreadsheet Google Sheets
Database terdiri dari 2 lembar kerja (*sheets*) yang dibuat secara otomatis:

#### Sheet 1: `fahnotes_db` (Tabel Catatan)
| Kolom | Nama Header | Tipe Data | Deskripsi / Contoh |
| :---: | :--- | :--- | :--- |
| **A** | `id` | String (UUID) | Unique ID catatan: `note_1740000000000` |
| **B** | `title` | String | Judul catatan: `Script Otomatisasi Backup DB` |
| **C** | `category` | String | Nama kategori: `BAT Script` |
| **D** | `description` | String | Ringkasan singkat isi catatan |
| **E** | `tags` | String (JSON Array) | `["backup", "sql", "windows"]` |
| **F** | `blocks` | String (JSON Array) | Array serialisasi objek `NoteBlock[]` |
| **G** | `isPinned` | Boolean (String) | `true` atau `false` |
| **H** | `createdAt` | ISO 8601 String | `2026-08-31T20:00:00.000Z` |
| **I** | `updatedAt` | ISO 8601 String | `2026-08-31T20:00:00.000Z` |

#### Sheet 2: `fahnotes_settings` (Tabel Pengaturan & Auth)
| Kolom | Nama Header | Tipe Data | Deskripsi / Nilai |
| :---: | :--- | :--- | :--- |
| **A** | `key` | String | Kunci: `adminUsername`, `adminPassword`, `categories`, `siteName` |
| **B** | `value` | String | Nilai terenkripsi atau data konfigurasi |

---

### 5.2. Spesifikasi Endpoint Google Apps Script (`Code.gs`)

Salin dan tempelkan kode Apps Script berikut ke proyek Google Sheets Anda:

```javascript
/**
 * ⚡ fahnotes Backend Engine — Google Apps Script (Code.gs)
 * Dibuat dan dikelola oleh: Faiz_Fahmi_ID
 * Versi API: 2.5.0
 */

const SHEET_NOTES = 'fahnotes_db';
const SHEET_SETTINGS = 'fahnotes_settings';

function doGet(e) {
  const output = ContentService.createTextOutput();
  output.setMimeType(ContentService.MimeType.JSON);
  
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    initSheetsIfNeeded(ss);
    
    const action = (e && e.parameter && e.parameter.action) || 'getAll';
    
    if (action === 'ping') {
      return output.setContent(JSON.stringify({
        success: true,
        message: 'fahnotes Google Sheets API Connected!',
        timestamp: new Date().toISOString(),
        author: 'Faiz_Fahmi_ID'
      }));
    }
    
    if (action === 'getAll') {
      const notes = readAllNotes(ss);
      const settings = readAllSettings(ss);
      return output.setContent(JSON.stringify({
        success: true,
        notes: notes,
        settings: settings,
        totalNotes: notes.length
      }));
    }
    
    return output.setContent(JSON.stringify({ success: false, error: 'Action not recognized' }));
  } catch (err) {
    return output.setContent(JSON.stringify({ success: false, error: err.toString() }));
  }
}

function doPost(e) {
  const output = ContentService.createTextOutput();
  output.setMimeType(ContentService.MimeType.JSON);
  
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    initSheetsIfNeeded(ss);
    
    if (!e.postData || !e.postData.contents) {
      return output.setContent(JSON.stringify({ success: false, error: 'Empty payload' }));
    }
    
    const payload = JSON.parse(e.postData.contents);
    const action = payload.action;
    
    if (action === 'saveAllNotes') {
      writeAllNotes(ss, payload.notes || []);
      return output.setContent(JSON.stringify({ success: true, count: (payload.notes || []).length }));
    }
    
    if (action === 'saveSingleNote') {
      upsertSingleNote(ss, payload.note);
      return output.setContent(JSON.stringify({ success: true, noteId: payload.note.id }));
    }
    
    if (action === 'deleteNote') {
      deleteSingleNote(ss, payload.noteId);
      return output.setContent(JSON.stringify({ success: true, deletedId: payload.noteId }));
    }
    
    if (action === 'updateSettings') {
      saveSettings(ss, payload.settings || {});
      return output.setContent(JSON.stringify({ success: true, settings: payload.settings }));
    }
    
    return output.setContent(JSON.stringify({ success: false, error: 'Unknown action: ' + action }));
  } catch (err) {
    return output.setContent(JSON.stringify({ success: false, error: err.toString() }));
  }
}

function initSheetsIfNeeded(ss) {
  let noteSheet = ss.getSheetByName(SHEET_NOTES);
  if (!noteSheet) {
    noteSheet = ss.insertSheet(SHEET_NOTES);
    noteSheet.appendRow(['id', 'title', 'category', 'description', 'tags', 'blocks', 'isPinned', 'createdAt', 'updatedAt']);
    noteSheet.getRange(1, 1, 1, 9).setFontWeight('bold').setBackground('#2DD4BF');
    noteSheet.setFrozenRows(1);
  }
  
  let setSheet = ss.getSheetByName(SHEET_SETTINGS);
  if (!setSheet) {
    setSheet = ss.insertSheet(SHEET_SETTINGS);
    setSheet.appendRow(['key', 'value']);
    setSheet.getRange(1, 1, 1, 2).setFontWeight('bold').setBackground('#FFD166');
    setSheet.setFrozenRows(1);
    
    setSheet.appendRow(['adminUsername', 'Faiz_Fahmi_ID']);
    setSheet.appendRow(['adminPassword', 'admin123']);
    setSheet.appendRow(['siteName', 'fahnotes']);
    setSheet.appendRow(['authorName', 'Faiz_Fahmi_ID']);
    setSheet.appendRow(['categories', JSON.stringify(['BAT Script', 'HTML / Web', 'Python', 'JavaScript', 'Otomasi', 'Tutorial', 'Linux / Shell', 'File Drive'])]);
  }
}

function readAllNotes(ss) {
  const sheet = ss.getSheetByName(SHEET_NOTES);
  if (!sheet) return [];
  const rows = sheet.getDataRange().getValues();
  if (rows.length <= 1) return [];
  
  const notes = [];
  for (let i = 1; i < rows.length; i++) {
    const r = rows[i];
    if (!r[0]) continue;
    
    let tags = [];
    let blocks = [];
    try { tags = typeof r[4] === 'string' ? JSON.parse(r[4]) : (r[4] || []); } catch(e) { tags = []; }
    try { blocks = typeof r[5] === 'string' ? JSON.parse(r[5]) : (r[5] || []); } catch(e) { blocks = []; }
    
    notes.push({
      id: String(r[0]),
      title: String(r[1] || ''),
      category: String(r[2] || 'Umum'),
      description: String(r[3] || ''),
      tags: Array.isArray(tags) ? tags : [],
      blocks: Array.isArray(blocks) ? blocks : [],
      isPinned: String(r[6]).toLowerCase() === 'true',
      createdAt: r[7] ? String(r[7]) : new Date().toISOString(),
      updatedAt: r[8] ? String(r[8]) : new Date().toISOString()
    });
  }
  return notes;
}

function writeAllNotes(ss, notes) {
  const sheet = ss.getSheetByName(SHEET_NOTES);
  if (!sheet) return;
  
  sheet.clearContents();
  sheet.appendRow(['id', 'title', 'category', 'description', 'tags', 'blocks', 'isPinned', 'createdAt', 'updatedAt']);
  sheet.getRange(1, 1, 1, 9).setFontWeight('bold').setBackground('#2DD4BF');
  sheet.setFrozenRows(1);
  
  if (!notes || notes.length === 0) return;
  
  const dataRows = notes.map(n => [
    n.id,
    n.title || '',
    n.category || 'Umum',
    n.description || '',
    JSON.stringify(n.tags || []),
    JSON.stringify(n.blocks || []),
    Boolean(n.isPinned),
    n.createdAt || new Date().toISOString(),
    n.updatedAt || new Date().toISOString()
  ]);
  
  sheet.getRange(2, 1, dataRows.length, 9).setValues(dataRows);
}

function upsertSingleNote(ss, note) {
  const sheet = ss.getSheetByName(SHEET_NOTES);
  if (!sheet || !note || !note.id) return;
  
  const rows = sheet.getDataRange().getValues();
  let targetRowIndex = -1;
  
  for (let i = 1; i < rows.length; i++) {
    if (String(rows[i][0]) === String(note.id)) {
      targetRowIndex = i + 1;
      break;
    }
  }
  
  const rowData = [
    note.id,
    note.title || '',
    note.category || 'Umum',
    note.description || '',
    JSON.stringify(note.tags || []),
    JSON.stringify(note.blocks || []),
    Boolean(note.isPinned),
    note.createdAt || new Date().toISOString(),
    new Date().toISOString()
  ];
  
  if (targetRowIndex > 0) {
    sheet.getRange(targetRowIndex, 1, 1, 9).setValues([rowData]);
  } else {
    sheet.appendRow(rowData);
  }
}

function deleteSingleNote(ss, noteId) {
  const sheet = ss.getSheetByName(SHEET_NOTES);
  if (!sheet || !noteId) return;
  const rows = sheet.getDataRange().getValues();
  for (let i = 1; i < rows.length; i++) {
    if (String(rows[i][0]) === String(noteId)) {
      sheet.deleteRow(i + 1);
      break;
    }
  }
}

function readAllSettings(ss) {
  const sheet = ss.getSheetByName(SHEET_SETTINGS);
  if (!sheet) return {};
  const rows = sheet.getDataRange().getValues();
  const settings = {};
  for (let i = 1; i < rows.length; i++) {
    const k = rows[i][0];
    let v = rows[i][1];
    if (k) {
      if (k === 'categories') {
        try { v = JSON.parse(v); } catch(e) {}
      }
      settings[k] = v;
    }
  }
  return settings;
}

function saveSettings(ss, newSettings) {
  const sheet = ss.getSheetByName(SHEET_SETTINGS);
  if (!sheet) return;
  const rows = sheet.getDataRange().getValues();
  
  Object.keys(newSettings).forEach(key => {
    let val = newSettings[key];
    if (typeof val === 'object') val = JSON.stringify(val);
    
    let found = false;
    for (let i = 1; i < rows.length; i++) {
      if (rows[i][0] === key) {
        sheet.getRange(i + 1, 2).setValue(val);
        found = true;
        break;
      }
    }
    if (!found) {
      sheet.appendRow([key, val]);
    }
  });
}
```

---

## 6. 📂 STRUKTUR DIREKTORI & BLUEPRINT FILE SOURCE CODE

Berikut adalah peta struktur berkas lengkap proyek:

```plaintext
fahnotes/
├── api/
│   └── global-config.js          # Serverless function endpoint Vercel (/api/global-config)
├── data/
│   └── global-config.json        # File JSON sinkronisasi persisten untuk server Express
├── src/
│   ├── components/
│   │   ├── Footer.tsx            # Footer aplikasi + disguised trigger login admin
│   │   ├── GoogleSheetsModal.tsx # Panel tab: Kategori, Akun Admin, Setup DB, & Info Vercel
│   │   ├── Header.tsx            # Top header bar, search bar, & filter pil kategori
│   │   ├── LoadingScreen.tsx     # Full-screen loader bergaya Neo-Brutalism
│   │   ├── LoginModal.tsx        # Modal autentikasi login admin
│   │   ├── NoteCard.tsx          # Komponen kartu catatan dengan badge, tags, & aksi
│   │   ├── NoteEditor.tsx        # Editor modular multi-blok (Markdown, Code, Link)
│   │   ├── NoteViewer.tsx        # Tampilan detail catatan, markdown render, copy & download code
│   │   ├── Toast.tsx             # Sistem floating notification alert
│   │   └── VectorDecorations.tsx # Hiasan grafis vektor SVG, dot-matrix, dan doodle
│   ├── config/
│   │   └── appConfig.ts          # Konfigurasi permanen GitHub repo & fallback resolver
│   ├── data/
│   │   └── initialNotes.ts       # Template catatan awal siap pakai
│   ├── utils/
│   │   ├── cloudSyncRelay.ts     # Magic Link generator, absorber, & broadcast relay
│   │   ├── codeGsScript.ts       # Generator string kode Google Apps Script untuk disalin
│   │   ├── defaultNotes.ts       # Fallback catatan offline
│   │   ├── googleSheetsApi.ts    # Driver komunikasi REST API Google Sheets & local vault
│   │   └── securityVault.ts      # Enkripsi data vault XOR + Base64 multi-layer
│   ├── App.tsx                   # Main orchestrator component & master state
│   ├── index.css                 # Import Tailwind CSS v4 & custom scrollbar
│   ├── main.tsx                  # React DOM root mounting
│   └── types.ts                  # Deklarasi TypeScript interface & types
├── .env.example                  # Dokumentasi environment variables
├── index.html                    # Entry point HTML & Google Fonts
├── metadata.json                 # Konfigurasi platform & frame permissions
├── package.json                  # Daftar dependensi npm & build scripts
├── README.md                     # Dokumen PRD & Master Blueprint ini
├── server.ts                     # Full-stack Express server + Vite middleware
├── tsconfig.json                 # Konfigurasi TypeScript compiler
├── vercel.json                   # Konfigurasi SPA routing rewrite untuk Vercel
└── vite.config.ts                # Konfigurasi bundler Vite
```

---

## 7. 🚀 PANDUAN LANGKAH DEMI LANGKAH KLONING & DEPLOYMENT

### 7.1. Persiapan Repositori & Instalasi Lokal
1. **Clone repositori ini:**
   ```bash
   git clone https://github.com/username-anda/fahnotes.git
   cd fahnotes
   ```
2. **Install seluruh dependensi:**
   ```bash
   npm install
   ```
3. **Jalankan local development server:**
   ```bash
   npm run dev
   ```
   Aplikasi akan berjalan pada port `http://localhost:3000`.

---

### 7.2. Setup Google Spreadsheet & Deployment Google Apps Script
1. Buka [Google Sheets](https://sheets.new) dan buat spreadsheet baru (beri nama misalnya: `fahnotes_database`).
2. Klik menu **Ekstensi (*Extensions*)** ➡️ **Apps Script**.
3. Hapus seluruh kode bawaan di editor Apps Script, lalu tempelkan seluruh kode dari [Bab 5.2](#52-spesifikasi-endpoint-google-apps-script-codegs).
4. Klik ikon **Simpan** (💾).
5. Klik tombol biru **Deploy** (kanan atas) ➡️ **New deployment (*Penerapan baru*)**.
6. Klik ikon roda gigi ⚙️ (*Select type*) ➡️ Pilih **Web app**.
7. Isi konfigurasi:
   * **Description**: `fahnotes API v2`
   * **Execute as**: **Me (*Saya*)**
   * **Who has access**: **Anyone (*Siapa saja*)** *(Wajib agar web app dapat diakses)*.
8. Klik **Deploy** ➡️ Berikan izin akses (*Authorize Access*) ➡️ Pilih akun Google ➡️ **Advanced** ➡️ **Go to fahnotes (unsafe)** ➡️ **Allow**.
9. Salin **Web app URL** yang berakhiran `/exec`.

---

### 7.3. Deploy ke Vercel (Penyimpanan Permanen Otomatis)

#### Cara A: Input Langsung di Website (Paling Mudah & Praktis)
1. Deploy repositori GitHub Anda ke **Vercel** (Cukup klik *Import Project* ➡️ *Deploy*).
2. Buka website Anda yang sudah live di Vercel.
3. Login sebagai Admin (klik `by: Faiz_Fahmi_ID` di footer ➡️ masukkan user: `Faiz_Fahmi_ID`, pass: `admin123`).
4. Klik tombol **Database Google Sheets** di navigasi atas ➡️ Masukkan URL Web App Anda ➡️ Klik **"Simpan URL"**.
5. Klik tombol **"Salin Link Auto-Connect"** untuk membagikan atau membukanya di perangkat lain.

#### Cara B: Simpan Permanen di Repositori GitHub (`src/config/appConfig.ts`)
1. Buka file `src/config/appConfig.ts` di GitHub repo Anda.
2. Masukkan URL Web App Anda pada baris `GOOGLE_SHEETS_WEB_APP_URL`:
   ```typescript
   export const APP_CONFIG = {
     GOOGLE_SHEETS_WEB_APP_URL: 'https://script.google.com/macros/s/AKfycby.../exec',
     DEFAULT_ADMIN_USERNAME: 'Faiz_Fahmi_ID',
     DEFAULT_ADMIN_PASSWORD: 'admin123',
     // ...
   };
   ```
3. Lakukan **Commit & Push**. Vercel akan otomatis me-redeploy dan link database akan **selamanya terhubung** untuk seluruh pengunjung di seluruh dunia.

#### Cara C: Menggunakan Vercel Environment Variables
1. Buka **Vercel Dashboard** ➡️ Masuk ke Project Anda.
2. Klik **Settings** ➡️ **Environment Variables**.
3. Tambahkan variable:
   * **Key**: `VITE_GOOGLE_SHEETS_URL`
   * **Value**: `URL Web App Google Apps Script Anda`
4. Simpan dan lakukan **Redeploy**.

---

## 8. 🎨 DESAIN SISTEM UI/UX: NEO-BRUTALISM GUIDELINES

Proyek ini menerapkan filosofi desain **Neo-Brutalism** terstruktur:

| Elemen Desain | Karakteristik & Nilai CSS |
| :--- | :--- |
| **Border Utama** | Garis tegas solid 2px atau 3px berwarna hitam pekat (`border-2 border-black` / `#000000`). |
| **Hard Offset Shadow** | Bayangan tanpa blur offset tajam: `shadow-[3px_3px_0px_#000]` atau `shadow-[5px_5px_0px_#000]`. |
| **Palet Warna Aksen** | Kuning Neon (`#FFD166`), Hijau Mint (`#2DD4BF`), Pink Flamingo (`#FF6584`), Indigo (`#818CF8`), Amber (`#F59E0B`). |
| **Background Kanvas** | Neutral Off-White hangat (`#FAF5EE`) dengan pola dot-matrix SVG halus di latar belakang. |
| **Micro-Interactions** | Efek tombol saat ditekan: `active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_#000]`. |
| **Tipografi** | Heading dengan font display berbobot *Black/ExtraBold* (`font-black`), body text dengan tracking seimbang, dan font monospace untuk sintaks kode. |

---

## 9. 🔒 MATRIKS KEAMANAN & KEBIJAKAN DATA

1. **Enkripsi Klien (Client-Side Obfuscation & Vault)**: URL Google Sheets dan kredensial admin yang tersimpan di browser diacak menggunakan enkripsi XOR multi-putaran dan encoding base64 untuk mencegah inspeksi langsung dari devtools publik.
2. **Sanitasi URL**: URL sensitif disamarkan pada antarmuka admin (misal: `https://script.google.com/macros/s/AKfy...exec`) dengan opsi toggle visibility (mata) yang hanya bisa dilihat oleh admin.
3. **CORS & Rate Limiting Handled by Google**: Google Apps Script secara native menangani CORS dan menyediakan proteksi throttling terhadap brute force attack.
4. **Isolasi Mode Pengunjung**: Seluruh komponen form input dan mutasi data (`POST`/`DELETE`) hanya dirender ke dalam React Virtual DOM jika status state `isAdmin === true`.

---

## 10. 🗺️ RENCANA PEMELIHARAAN & ROADMAP MASA DEPAN

* [x] **v1.0.0**: Rilis perdana antarmuka Neo-Brutalism & editor catatan single-block.
* [x] **v2.0.0**: Editor modular multi-blok (Markdown, Terminal Code, Download Script).
* [x] **v2.3.0**: Integrasi basis data Google Spreadsheet via Google Apps Script Web App.
* [x] **v2.5.0**: Multi-tier persistence (GitHub config, Vercel Serverless `/api/global-config`, dan 1-Click Magic Link).
* [ ] **v3.0.0 (Roadmap)**:
  * Fitur eksekusi Python langsung di browser via WebAssembly (Pyodide).
  * Ekspor seluruh database ke file arsip `.zip` yang berisi folder terstruktur per kategori.
  * Dukungan tema kontras gelap penuh (*Dark Neo-Brutalist Mode*).

---

## 📜 ATRIBUSI & HAK CIPTA

Dikonseptualisasikan, dirancang, dan dibangun dengan dedikasi tinggi untuk para pengembang perangkat lunak dan komunitas otomatisasi oleh:

👨‍💻 **Faiz_Fahmi_ID**  
⚡ **Project:** `fahnotes` — The Modern Developer Knowledge Base & Code Hub  
🇮🇩 *Made with passion for developers nationwide & worldwide.*
