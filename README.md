# PRODUCT REQUIREMENTS DOCUMENT (PRD) & ARSITEKTUR TEKNIS
## Proyek: ZIP to PSD Converter — Client-Side Multi-Layered Photoshop Generator
**Author / Kreator:** Faiz_Fahmi_ID  
**Tahun Mulai:** 2026  
**Status:** Versi Produksi Siap Pakai (v1.0.0)  

---

## 1. IKHTISAR PRODUK (EXECUTIVE SUMMARY)

### 1.1 Latar Belakang Masalah
Desainer grafis, UI/UX designer, ilustrator, dan editor konten digital sering menerima paket aset visual dalam bentuk arsip terkompresi (`.zip`) yang berisi puluhan hingga ratusan gambar (PNG, JPG, WebP, SVG, BMP, GIF). Untuk menyusun aset-aset tersebut ke dalam format kerja Adobe Photoshop (`.psd`), pengguna biasanya harus:
1. Mengekstrak ZIP secara manual ke penyimpanan lokal.
2. Membuka software Photoshop (yang berat dan berbayar).
3. Melakukan *drag-and-drop* satu per satu file ke lembar kerja.
4. Menata ulang layer, membuat folder grup, mengatur posisi, dan menyesuaikan resolusi dokumen (300 DPI untuk cetak atau 72 DPI untuk web).

Proses manual ini memakan waktu rata-rata 15–30 menit per batch dan rentan terhadap inkonsistensi struktur layer.

### 1.2 Solusi Produk
**ZIP to PSD Converter** adalah aplikasi web modern berbasis TypeScript dan WebAssembly/Canvas API yang mampu mengekstrak seluruh file gambar di dalam arsip ZIP secara instan, menyusun tata letak koordinat kanvas, mengelompokkan folder grup bertingkat, dan menghasilkan file biner dokumen Adobe Photoshop (`.psd`) standar industri langsung di peramban (100% *client-side processing*).

---

## 2. TUJUAN & TARGET PENGGUNA (GOALS & AUDIENCE)

### 2.1 Tujuan Utama
- **Kecepatan:** Memangkas proses pembuatan dokumen PSD dari hitungan puluh menit menjadi di bawah 5 detik.
- **Keamanan & Privasi Data:** Seluruh proses ekstraksi, dekompresi, rasterisasi kanvas, dan pembentukan biner PSD berjalan secara lokal di memori peramban tanpa mengunggah file ke server manapun.
- **Kualitas Standar Industri:** Menghasilkan dokumen PSD valid (8-bit per channel, mode warna RGB, transparansi alpha channel terjaga, header resolusi PPI/DPI tersemat akurat).

### 2.2 Persona Pengguna
1. **Desainer Grafis & Percetakan:** Membutuhkan penggabungan batch gambar beresolusi 300 DPI dengan background transparan atau putih solid.
2. **Game Asset / Sprite Creator:** Memerlukan konversi aset karakter, UI game, dan ikon ke dalam satu lembar kerja Photoshop dengan layer terpisah per komponen.
3. **Fotografer & Desainer Media Sosial:** Mengonversi koleksi foto ke dalam kanvas preset standar (Instagram Post, Story, A4, Banner) secara instan.

---

## 3. ARSITEKTUR TEKNIS & STACK TEKNOLOGI

```
┌─────────────────────────────────────────────────────────────┐
│                      PENGGUNA (BROWSER)                     │
│  ┌─────────────────┐   ┌─────────────────┐   ┌────────────┐ │
│  │ Drag-Drop ZIP   │──▶│ JSZip Extractor │──▶│ Asset Model│ │
│  └─────────────────┘   └─────────────────┘   └────────────┘ │
│                                                     │       │
│  ┌──────────────────────────────────────────────────┘       │
│  ▼                                                          │
│  ┌─────────────────┐   ┌─────────────────┐   ┌────────────┐ │
│  │ Konfigurasi UI  │──▶│ Offscreen Canvas│──▶│ ag-psd     │ │
│  │ (DPI, Mode, Uk) │   │ Rasterizer      │   │ Encoder    │ │
│  └─────────────────┘   └─────────────────┘   └────────────┘ │
│                                                     │       │
│  ┌──────────────────────────────────────────────────┘       │
│  ▼                                                          │
│  ┌─────────────────┐   ┌─────────────────┐                  │
│  │ Blob PSD Binary │──▶│ Unduh File .PSD │                  │
│  └─────────────────┘   └─────────────────┘                  │
└─────────────────────────────────────────────────────────────┘
```

### 3.1 Stack Teknologi Inti
- **Framework & Runtime:** React 18+ dengan Vite bundler & TypeScript tipe ketat.
- **Styling:** Tailwind CSS v4 dengan konfigurasi varian kelas gelap/terang (`@custom-variant dark`).
- **Ikonografi:** `lucide-react`.
- **Dekompresi ZIP:** `jszip` (Streaming asynchronous binary parsing).
- **Encoder Format PSD:** `ag-psd` (Adobe Photoshop binary format writer & parser).
- **Animasi & Interaktivitas:** `motion/react` (Framer Motion).

---

## 4. SPESIFIKASI FITUR & MODUL APLIKASI

### 4.1 Modul 1: Unggah & Ekstraksi ZIP (`ZipUploader.tsx`)
- **Fitur Drag & Drop:** Area interaktif dengan pendeteksian `dragover`, `dragleave`, dan `drop`.
- **Dukungan Format Gambar:** PNG, JPEG/JPG, WebP, GIF, SVG, BMP, TIFF.
- **Validasi Integritas:** Mendeteksi file korup, menampilkan daftar file yang didukung vs file yang dilewati (seperti file teks atau binary non-gambar).
- **Status Loading:** Indikator progres ekstraksi memori berkecepatan tinggi.

### 4.2 Modul 2: Penjelajah Aset & Layer Selector (`AssetExplorer.tsx`)
- **Hierarki Folder:** Menampilkan struktur folder asli di dalam ZIP (misal `icons/`, `backgrounds/`, `ui/`).
- **Pratinjau Thumbnail:** Menghasilkan URL Blob cepat untuk melihat dimensi (width × height px), ukuran file (KB/MB), dan nama file asli.
- **Aksi Batch:** Fitur *Pilih Semua*, *Batal Pilih*, serta seleksi satuan per file gambar.
- **Modal Zoom Pratinjau:** Pratinjau resolusi penuh dengan latar belakang kotak catur (*checkerboard pattern*) untuk mengecek transparansi channel alpha.

### 4.3 Modul 3: Panel Konfigurasi Konversi (`ConversionSettings.tsx`)
1. **Mode Dimensi Kanvas:**
   - **Otomatis (Ukuran Terbesar):** Kanvas menyesuaikan nilai `width` dan `height` tertinggi dari seluruh gambar terpilih.
   - **Preset Populer:** Social Media (IG Post 1080x1080, Story 1080x1920), Cetak (A4 2480x3508 @300DPI, Poster A3), Layar (Full HD 1920x1080, 4K UHD).
   - **Kustom Ukuran:** Input numerik manual untuk lebar dan tinggi (piksel).
   - **Grid Sheet (Matriks):** Menyusun gambar-gambar menjadi matriks kotak dengan kolom dan *padding* yang dapat disesuaikan.
2. **Kerapatan Piksel (DPI / PPI):**
   - Pilihan standar: **72 DPI** (Web / Layar Digital), **150 DPI** (Pratinjau Cetak Sedang), **300 DPI** (Standar Cetak Percetakan High-Res), **600 DPI** (Ultra High-Res).
3. **Hierarki & Pengelompokan Layer:**
   - **Pertahankan Folder Asli:** Tiap sub-folder di dalam ZIP dikonversi menjadi Folder Group di Photoshop.
   - **Satu Grup Utama:** Seluruh gambar dimasukkan ke dalam satu folder grup bernama *ZIP Assets*.
   - **Layer Datar (Flat):** Seluruh gambar berada di tingkat *root* dokumen Photoshop tanpa folder pembungkus.
4. **Penyesuaian Posisi (Fit Mode):**
   - *Ukuran Asli di Tengah (Original Center)*
   - *Skala Pas Kanvas (Fit)*
   - *Isi Penuh Kanvas (Fill & Crop)*
   - *Regangkan (Stretch)*
5. **Latar Belakang Kanvas (Background Mode):**
   - Transparan penuh, Putih Solid (`#FFFFFF`), Hitam Solid (`#000000`), atau Kustom Warna (*Color Picker* HEX).

### 4.4 Modul 4: Engine Generator PSD (`psdGenerator.ts`)
- **Offscreen Canvas Rasterization:** Membuat elemen `canvas` virtual untuk tiap layer, merender gambar sumber, dan menerapkan kalkulasi `left`, `top`, `width`, `height`.
- **Metadata Biner Photoshop:**
  - Header resolusi: Menyematkan blok `imageResources.resolutionInfo` (horizontalResolution, verticalResolution, satuan PPI/Inches).
  - Mode Warna: RGB 8-bit (ColorMode = 3).
  - Transparansi: Menjaga channel alpha PNG/WebP agar tidak terkompresi atau hilang.
- **Callback Progres Real-Time:** Menghitung persentase progres (0–100%) melalui 5 tahapan:
  1. *Menghitung Dimensi Kanvas*
  2. *Me-rasterisasi Gambar*
  3. *Menyusun Hierarki Layer PSD*
  4. *Membuat Pratinjau Komposit*
  5. *Menyimpan Dokumen PSD Biner*

### 4.5 Modul 5: Pratinjau Hasil & Unduhan (`ResultPreview.tsx`)
- **Pratinjau Komposit Visual:** Kanvas pratinjau hasil penggabungan seluruh layer.
- **Visualisasi Pohon Layer:** Menampilkan replika panel layer Adobe Photoshop lengkap dengan icon mata (visibility), nama layer, dimensi per layer, serta status folder grup yang dapat dibuka-tutup.
- **Tombol Unduh Instan:** Tombol unduh file `.psd` dengan nama file yang dapat dikustomisasi.

### 4.6 Modul 6: Tema Terang / Gelap (Dark & Light Mode Engine)
- **Dukungan Penuh:** Berpindah antara tema Terang dan Gelap secara instan melalui manipulasi kelas `.dark` pada elemen root `<html>`.
- **Persistensi Preferensi:** Menyimpan status tema ke dalam `localStorage` serta mendeteksi preferensi sistem (`prefers-color-scheme`).
- **Harmoni Kontras:** Latar belakang netral (`neutral-950` / `neutral-900` / `neutral-800`), teks kontras tinggi, dan aksen warna biru profesional (`blue-600` / `blue-400`).

---

## 5. STRUKTUR PROYEK (DIRECTORY TREE)

```
├── index.html                  # Entry point HTML, konfigurasi Meta, Font, dan Dark mode script
├── metadata.json               # Metadata aplikasi & kapabilitas
├── package.json                # Dependensi proyek (React, Vite, JSZip, ag-psd, Tailwind, dll.)
├── tsconfig.json               # Konfigurasi kompilasi TypeScript
├── vite.config.ts              # Konfigurasi build Vite
├── README.md                   # Dokumen PRD & Panduan Arsitektur Teknis ini
└── src/
    ├── App.tsx                 # Orkestrator alur state & navigasi aplikasi utama
    ├── main.tsx                # React DOM render entry
    ├── index.css               # Definisi Tailwind CSS & custom variant @dark
    ├── types/
    │   └── index.ts            # Tipe data TypeScript (ExtractedAsset, ConversionConfig, dll.)
    ├── utils/
    │   ├── presets.ts          # Definisi preset kanvas (Sosial, Cetak, Layar, Banner)
    │   ├── zipExtractor.ts     # Logika ekstraksi dan pembacaan JSZip
    │   └── psdGenerator.ts     # Engine perakitan biner dokumen Adobe Photoshop ag-psd
    └── components/
        ├── Navbar.tsx          # Bilah navigasi atas & tombol toggle mode tema
        ├── Hero.tsx            # Header utama, judul mendalam, dan atribusi author
        ├── ZipUploader.tsx     # Area Drag & Drop file arsip ZIP
        ├── AssetExplorer.tsx   # Penjelajah list aset, filter folder, & thumbnail preview
        ├── ConversionSettings.tsx # Panel pengaturan kanvas, DPI, grouping, & background
        ├── ConversionProgress.tsx # Progress bar real-time & log tahapan konversi
        ├── ResultPreview.tsx   # Pratinjau komposit, layer tree Photoshop, & tombol unduh
        ├── HowItWorks.tsx      # Panduan langkah cara kerja konverter
        ├── PsdSpecsGuide.tsx   # Panduan spesifikasi teknis Adobe Photoshop
        ├── FaqSection.tsx      # Tanya jawab seputar konversi dan kompatibilitas PSD
        └── Footer.tsx          # Footer dengan identitas kreator Faiz_Fahmi_ID
```

---

## 6. CARA MENJALANKAN & MENGEMBANGKAN (DEVELOPMENT GUIDE)

### 6.1 Prasyarat
- Node.js versi 18.0.0 atau yang lebih baru.
- Manajer paket: `npm`, `pnpm`, atau `bun`.

### 6.2 Langkah Instalasi & Menjalankan Dev Server
```bash
# 1. Clone repositori atau buka workspace direktori
cd zip-to-psd-converter

# 2. Instal seluruh dependensi
npm install

# 3. Jalankan server pengembangan lokal (Port 3000)
npm run dev
```

### 6.3 Verifikasi & Kompilasi Produksi
```bash
# Uji linting dan validasi tipe TypeScript
npm run lint

# Kompilasi build produksi untuk deployment
npm run build
```

---

## 7. ATRIBUSI & HAK CIPTA
- **Aplikasi:** ZIP to PSD Converter
- **Arsitek & Pengembang:** Faiz_Fahmi_ID
- **Tahun Peluncuran:** Sejak 2026
- **Lisensi:** Open Source / MIT
