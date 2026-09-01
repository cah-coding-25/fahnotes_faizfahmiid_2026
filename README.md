# ⚡ fahnotes — Developer Knowledge Base, Code Snippets & Cloud Script Hub
> **Dibuat & Dikelola Oleh:** **`by: Faiz_Fahmi_ID`**  
> **Versi Aplikasi:** `v2.6.0 (Production Edition)`  
> **Lisensi & Hak Cipta:** Open Blueprint & Private Architecture by **Faiz_Fahmi_ID**  
> **Website URL:** [fahnotes Live App](https://ais-pre-2pdcqhq7v2jegwnouv5bo7-749284898574.asia-east1.run.app)

---

## 📌 DAFTAR ISI
1. [📖 Tentang fahnotes](#-tentang-fahnotes)
2. [✨ Fitur-Fitur Unggulan Website](#-fitur-fitur-unggulan-website)
3. [🏆 Keunggulan & Nilai Lebih (Key Advantages)](#-keunggulan--nilai-lebih-key-advantages)
4. [📦 Library, Framework & Dependensi](#-library-framework--dependensi)
5. [🧩 Struktur Fungsi & Modul Komponen](#-struktur-fungsi--modul-komponen)
6. [📱 Sistem Nozzle Pengaturan Bagikan (Smart Cross-Device Share)](#-sistem-nozzle-pengaturan-bagikan-smart-cross-device-share)
7. [📊 Arsitektur Backend Google Spreadsheet ($0 Cost Database)](#-arsitektur-backend-google-spreadsheet-0-cost-database)
8. [🚀 Panduan Instalasi & Deployment](#-panduan-instalasi--deployment)
9. [🎨 Desain Sistem: Neo-Brutalism Canvas](#-desain-sistem-neo-brutalism-canvas)
10. [👨‍💻 Hak Cipta & Atribusi](#-hak-cipta--atribusi)

---

## 📖 TENTANG FAHNOTES

**fahnotes** adalah platform basis pengetahuan pengembang (*developer knowledge base*) dan repositori skrip multi-bahasa modern yang diciptakan oleh **Faiz_Fahmi_ID**. 

Aplikasi ini menggabungkan fleksibilitas dokumen berbasis blok modular ala **Notion** dengan kemampuan terminal kode dan eksekusi terisolasi bergaya **Google Colab**, dibungkus dalam bahasa visual **Neo-Brutalism** kontemporer (garis tegas `#000000`, bayangan *hard-offset* tanpa blur, palet warna berani, dan kanvas terbuka yang responsif di HP, Tablet, maupun Komputer).

---

## ✨ FITUR-FITUR UNGGULAN WEBSITE

### 1. 📝 Modular Multi-Block Editor (Notion + Colab Hybrid)
* **Blok Markdown Fleksibel**: Menulis artikel, tutorial, heading (`#`, `##`, `###`), daftar list, checklist, kutipan, dan teks berformat.
* **Blok Kode Terminal Interaktif**: Editor kode monospace dengan penamaan file kustom (misal: `backup_data.bat`, `server.py`, `script.sh`, `index.html`) dan opsi penomoran baris (*line numbers*).
* **Blok Link Bookmark**: Menautkan referensi web eksternal, repositori GitHub, atau dokumentasi resmi.
* **Blok Gambar & Google Drive Integrator**: Menyematkan gambar atau file dengan konversi otomatis dari Google Drive.
* **Manajemen Blok Mandiri**: Tambah blok, pindah urutan ke atas/ke bawah (*reorder*), preview markdown instan, dan hapus blok individual.

### 2. 💻 Direct Script Execution & 1-Click Downloader
* **Unduh File Skrip Langsung (*Direct Download*)**: Blok kode dapat langsung diunduh menjadi file nyata berformat `.bat`, `.sh`, `.py`, `.js`, `.json`, `.sql`, `.html`, atau `.css` ke komputer/HP pengguna hanya dengan 1 klik.
* **Salin Kode Instan (*Copy Code*)**: Menyalin seluruh sintaks kode ke papan klip (*clipboard*) secara presisi tanpa merusak format indentasi atau spasi.
* **Kotak Preview Live HTML**: Menyediakan toggle interaktif untuk melihat hasil render halaman HTML langsung di dalam catatan.

### 3. 📱 Smart Cross-Device Share System (Bawaan HP & Barcode QR Code)
* **Wajib Menu Share Bawaan HP (*Native OS Share Sheet*)**: Saat tombol "Bagikan" ditekan di HP/Smartphone, sistem langsung memicu menu share bawaan OS (WhatsApp, Telegram, Instagram Story, Bluetooth, Email, dll.) tanpa pop-up website yang mengganggu.
* **Dataset & Barcode QR Code di Komputer/Laptop**: Saat dibuka di PC/Laptop, menampilkan modal interaktif berisikan Barcode QR Code untuk discan langsung oleh kamera smartphone pengunjung, tombol unduh QR, serta tombol pintas media sosial.
* **Deep Linking Otomatis**: Setiap catatan memiliki tautan unik `?note=ID_CATATAN` yang dapat dibuka langsung.

### 4. ⚙️ Panel Admin & Saklar Nozzle Dinamis
* **Tab Kategori**: Tambah kategori baru, ganti nama kategori (otomatis memperbarui seluruh catatan terkait), dan hapus kategori.
* **Tab Akun Admin**: Ubah username dan password login admin secara dinamis yang otomatis tersimpan permanen ke cloud.
* **Tab Pengaturan Nozzle Bagikan**: Kontrol saklar on/off untuk aktivasi menu bawaan HP, modal website desktop, dan auto-clipboard beserta fitur **Uji Coba Langsung (Live Test)**.
* **Tab Koneksi Google Spreadsheet**: Input Web App URL dengan tombol tes koneksi, toggle tampilkan URL, dan tombol salin Auto-Connect Magic Link.
* **Tab Info Vercel & GitHub**: Panduan deployment dan konfigurasi permanen.

### 5. 🔍 Real-Time Multi-Field Search Engine (0ms)
* Mesin pencarian instan tanpa delay yang memindai **judul catatan, deskripsi, kategori, tag, nama file skrip, hingga baris kode** di dalam blok.
* Filter pil kategori interaktif di header lengkap dengan badge penghitung jumlah catatan aktif.

### 6. 📌 Pin Catatan Penting (*Pinned Notes*)
* Menandai catatan prioritas agar selalu tampil di bagian paling atas beranda dengan lencana visual *PINNED*.

### 7. 🔗 Universal 1-Click Auto-Connect Magic Link
* Membagikan link website dengan hash terenkripsi `#s=BASE64_URL` yang secara otomatis menghubungkan browser pengunjung/perangkat baru ke database Google Sheets tanpa perlu memasukkan URL manual.

### 8. 🕵️ Disguised Secret Admin Authentication
* Tidak ada tombol login mencolok di navigasi publik. Tombol login disamarkan secara cerdas pada teks atribusi footer: **`by: Faiz_Fahmi_ID`**.

---

## 🏆 KEUNGGULAN & NILAI LEBIH (KEY ADVANTAGES)

| No | Keunggulan | Deskripsi Manfaat |
| :-: | :--- | :--- |
| 1 | **$0 Zero-Cost Database** | Menggunakan Google Sheets + Google Apps Script Web App gratis selamanya tanpa biaya langganan database serverless. |
| 2 | **4-Layer Persistence Engine** | Data dijamin tidak hilang melalui 4 lapis: Vercel Env, GitHub Config, Enkripsi Browser Vault, dan Google Sheets Cloud. |
| 3 | **Smart Device Detection** | Deteksi otomatis jenis perangkat: memicu native share di HP dan modal QR Code di PC/Laptop. |
| 4 | **Nozzle Control di Admin** | Fleksibilitas penuh bagi admin untuk mengaktifkan/menonaktifkan fitur share website sesuai kebutuhan. |
| 5 | **Anti-Distorsi Skrip Kode** | Menjaga spasi, indentasi, dan karakter khusus sehingga skrip `.bat` / `.py` / `.sh` dapat langsung dijalankan di terminal OS. |
| 6 | **Desain Neo-Brutalism Modern** | Tampilan visual khas, berkarakter, kontras tinggi, mudah dibaca, dan bebas dari kebosanan UI biasa (*anti-slop*). |
| 7 | **Keamanan Sesi Terisolasi** | Pengunjung publik hanya memiliki hak baca (*read-only*), sedangkan seluruh tombol manipulasi data di-unmount dari DOM. |

---

## 📦 LIBRARY, FRAMEWORK & DEPENDENSI

Berikut daftar paket dan pustaka yang digunakan beserta fungsi dan perannya dalam aplikasi:

```json
{
  "dependencies": {
    "react": "^19.0.1",
    "react-dom": "^19.0.1",
    "typescript": "~5.8.2",
    "vite": "^6.2.3",
    "tailwindcss": "^4.1.14",
    "@tailwindcss/vite": "^4.1.14",
    "lucide-react": "^0.546.0",
    "motion": "^12.23.24",
    "canvas-confetti": "^1.9.4",
    "react-markdown": "^10.1.0",
    "express": "^4.21.2",
    "dotenv": "^17.2.3",
    "@google/genai": "^2.4.0"
  },
  "devDependencies": {
    "esbuild": "^0.25.0",
    "tsx": "^4.21.0",
    "autoprefixer": "^10.4.21"
  }
}
```

### Penjelasan Fungsi Setiap Library:
1. **`react` & `react-dom` (v19)**: Library inti untuk membangun antarmuka pengguna berbasis komponen modular, reaktif, dan performa tinggi.
2. **`typescript`**: Memberikan validasi tipe data statis ketat pada seluruh struktur catatan, blok data, konfigurasi nozzle, dan API handler.
3. **`vite` (v6)**: Tool bundler dan dev-server generasi terbaru yang sangat cepat untuk kompilasi modul frontend.
4. **`tailwindcss` (v4) & `@tailwindcss/vite`**: Utility-first CSS framework mutakhir untuk merancang styling Neo-Brutalism tanpa file CSS eksternal yang membengkak.
5. **`lucide-react`**: Pustaka ikon vektor SVG modern, tajam, dan lengkap (Terminal, Code, Share2, Smartphone, Laptop, Sliders, Shield, Download, Pin, dll.).
6. **`motion` (Framer Motion)**: Mengelola animasi halus pada perpindahan antar-halaman, buka-tutup modal dialog, dan transisi layout.
7. **`canvas-confetti`**: Memberikan efek selebrasi partikel konfeti interaktif saat pengguna berhasil menyimpan catatan, menyalin kode, atau memperbarui setelan.
8. **`react-markdown`**: Parser dan renderer dokumen Markdown untuk merender format tulisan (bold, italic, lists, quote, tables) secara aman.
9. **`express` (v4)**: Server backend Node.js untuk melayani file statis, routing proxy, dan endpoint `/api/*`.
10. **`esbuild`**: Compiler berperforma tinggi untuk mem-bundle backend `server.ts` menjadi file tunggal `dist/server.cjs`.
11. **`tsx`**: TypeScript execution engine untuk menjalankan server backend secara langsung pada saat tahap pengembangan.
12. **`dotenv`**: Memuat konfigurasi variabel lingkungan (*environment variables*) dari `.env`.
13. **`@google/genai`**: SDK resmi Google Gen AI untuk integrasi kecerdasan buatan server-side di masa depan.

---

## 🧩 STRUKTUR FUNGSI & MODUL KOMPONEN

```plaintext
fahnotes/
├── api/
│   └── global-config.js          # Endpoint Vercel Serverless Function (/api/global-config)
├── data/
│   └── global-config.json        # Penyimpanan konfigurasi sinkronisasi Express Server
├── src/
│   ├── components/
│   │   ├── Header.tsx            # Header utama, pencarian multi-field, & filter pil kategori
│   │   ├── Footer.tsx            # Footer aplikasi + disguised trigger login admin
│   │   ├── NoteCard.tsx          # Kartu ringkasan catatan (tag, pin, aksi, & share cepat)
│   │   ├── NoteEditor.tsx        # Editor multi-blok modular (Markdown, Kode, Link, Gambar)
│   │   ├── NoteViewer.tsx        # Detail catatan, copy kode, download file, HTML preview
│   │   ├── ShareModal.tsx        # Lembar dataset bagikan desktop + Barcode QR Code scanner
│   │   ├── GoogleSheetsModal.tsx # Panel Admin 5 Tab (Kategori, Akun, Nozzle, DB, Vercel)
│   │   ├── LoginModal.tsx        # Modal autentikasi kredensial admin
│   │   ├── LoadingScreen.tsx     # Layar pemuatan sinkronisasi bergaya Neo-Brutalism
│   │   ├── Toast.tsx             # Sistem floating notification alert
│   │   └── VectorDecorations.tsx # Ornamen grafis vektor SVG & background dot-matrix
│   ├── config/
│   │   └── appConfig.ts          # Konfigurasi fallback default repositori GitHub
│   ├── utils/
│   │   ├── shareHelper.ts        # Smart Routing Bagikan (Deteksi HP vs PC vs Auto Copy)
│   │   ├── googleSheetsApi.ts    # Driver REST API Google Sheets (CRUD & sync local vault)
│   │   ├── securityVault.ts      # Enkripsi data vault XOR + Base64 multi-layer
│   │   ├── driveHelper.ts        # Konverter URL Google Drive ke gambar & direct download
│   │   ├── cloudSyncRelay.ts     # Magic Link generator & hash absorber (#s=)
│   │   ├── codeGsScript.ts       # Template string kode Apps Script (Code.gs)
│   │   └── defaultNotes.ts       # Data catatan awal siap pakai (offline template)
│   ├── App.tsx                   # Main Orchestrator & Central State Controller
│   ├── types.ts                  # Deklarasi TypeScript interfaces & type definitions
│   ├── index.css                 # Import Tailwind CSS v4 & custom typography
│   └── main.tsx                  # React DOM Root Entry Point
├── package.json                  # Dependensi, scripts build & start
├── server.ts                     # Full-stack Express server + Vite middleware
├── vercel.json                   # Konfigurasi SPA rewrite untuk Vercel deployment
└── README.md                     # Dokumentasi arsitektur & panduan lengkap ini
```

---

## 📱 SISTEM NOZZLE PENGATURAN BAGIKAN (SMART CROSS-DEVICE SHARE)

Aplikasi dilengkapi modul cerdas `src/utils/shareHelper.ts` dan panel kontrol nozzle di tab Admin:

```
                                [ Klik Tombol Bagikan ]
                                           │
                    ┌──────────────────────┴──────────────────────┐
                    ▼                                             ▼
        [ Perangkat HP / Smartphone ]                  [ Laptop / Komputer Desktop ]
                    │                                             │
      (Nozzle 1: preferNativeShare ON)               (Nozzle 2: enableWebsiteShareModal ON)
                    │                                             │
                    ▼                                             ▼
       Memicu Menu Share Bawaan HP                  Membuka Modal Dataset Website:
  (WhatsApp, Telegram, Bluetooth, dll)             - Barcode QR Code untuk Kamera HP
       *Tanpa Popup Website di Layar*              - Tombol Unduh Gambar QR Code
                                                   - Tombol Pintas Medsos & Salin Link
```

### Penjelasan 3 Saklar Nozzle:
1. **Nozzle 1: Wajib Menu Bagikan Bawaan HP (`preferNativeShare`)**
   * Saat diklik di browser ponsel pintar, sistem **wajib** memicu menu bagikan bawaan sistem operasi (Android / iOS). Website tidak akan memunculkan popup yang menutupi layar HP.
2. **Nozzle 2: Tampilkan Modal Popup di Laptop/PC (`enableWebsiteShareModal`)**
   * Saat diklik di komputer/laptop, memunculkan jendela modal interaktif berisikan Barcode QR Code untuk dipindai kamera ponsel dan dataset tombol share.
3. **Nozzle 3: Salin Otomatis ke Papan Klip (`autoCopyToClipboard`)**
   * Menyalin tautan catatan langsung ke clipboard jika browser tidak mendukung native share.

---

## 📊 ARSITEKTUR BACKEND GOOGLE SPREADSHEET ($0 COST DATABASE)

Database berjalan di atas Google Spreadsheet dengan 2 lembar kerja (*sheets*):

1. **`fahnotes_db`**: Menyimpan baris data catatan (`id`, `title`, `category`, `description`, `tags`, `blocks`, `isPinned`, `createdAt`, `updatedAt`).
2. **`fahnotes_settings`**: Menyimpan konfigurasi admin (`adminUsername`, `adminPassword`, `categories`, `siteName`, `authorName`).

### Kode Backend Google Apps Script (`Code.gs`):
Script ini menangani endpoint `doGet()` untuk membaca data dan `doPost()` untuk menyimpan catatan, memperbarui kategori, serta menyimpan kredensial admin secara real-time.

---

## 🚀 PANDUAN INSTALASI & DEPLOYMENT

### 1. Menjalankan di Lokal (Local Development)
```bash
# Clone repositori
git clone https://github.com/username-anda/fahnotes.git
cd fahnotes

# Install dependensi
npm install

# Jalankan development server
npm run dev
```
Aplikasi dapat diakses di `http://localhost:3000`.

### 2. Deploy ke Vercel (Produksi)
1. Hubungkan repositori GitHub Anda ke **Vercel**.
2. Vercel akan otomatis mendeteksi konfigurasi `vercel.json` dan mem-build aplikasi via `npm run build`.
3. Buka URL hasil deployment di browser.
4. Login sebagai Admin (klik teks **`by: Faiz_Fahmi_ID`** di footer).
5. Masukkan URL Web App Google Apps Script Anda di tab Database ➡️ Klik **"Simpan URL"**.
6. Selesai! Seluruh data Anda kini tersinkronisasi di seluruh dunia.

---

## 🎨 DESAIN SISTEM: NEO-BRUTALISM CANVAS

* **Garis Pembatas (Border)**: Solid hitam pekat tebal `2px` / `3px` (`#000000`).
* **Bayangan (Shadow)**: Hard offset shadow tanpa blur: `shadow-[3px_3px_0px_#000]` & `shadow-[5px_5px_0px_#000]`.
* **Warna Aksen**: Kuning Neon (`#FFD233`), Hijau Daun (`#22C55E`), Biru Elektrik (`#3B82F6`), Pink Flamingo (`#F472B6`), Amber (`#F59E0B`).
* **Latar Belakang**: Neutral Off-White hangat (`#FAF5EE`) dengan hiasan vektor SVG dot-matrix halus.
* **Tipografi**: Heading display tebal (`font-black`), tracking proporsional, dan monospace font (`Consolas`, `JetBrains Mono`) untuk kode skrip.

---

## 👨‍💻 HAK CIPTA & ATRIBUSI

Dikonseptualisasikan, dirancang, dan dibangun dengan dedikasi tinggi oleh:

* **Pencipta & Pengembang**: **Faiz_Fahmi_ID**
* **Atribusi Footer**: `by: Faiz_Fahmi_ID`
* **Proyek**: **`fahnotes`** — *The Modern Developer Knowledge Base & Cloud Script Hub*
* 🇮🇩 *Dibuat untuk komunitas pengembang perangkat lunak & otomatisasi.*
