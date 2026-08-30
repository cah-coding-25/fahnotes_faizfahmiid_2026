# 📑 PRODUCT REQUIREMENT DOCUMENT (PRD)
## Project: fahnotes — Modern Neo-Brutalist Code & Notes Knowledge Base

---

## 1. Informasi Umum Proyek
* **Nama Produk**: `fahnotes`
* **Kategori**: Web Application / Developer Knowledge Base & Code Snippet Repository
* **Author & Lead Maintainer**: `Faiz_Fahmi_ID`
* **Versi Dokumen**: 1.0 (Super Complete PRD)
* **Status**: Production Ready

---

## 2. Ringkasan Eksekutif & Visi Produk

### 2.1 Latar Belakang
Developer, sysadmin, dan praktisi IT seringkali membutuhkan wadah praktis untuk menyimpan potongan kode (*snippets*), file skrip otomatisasi (`.bat`, `.sh`, `.py`, `.js`, dll.), tautan dokumentasi, serta catatan teknis harian. Solusi yang ada saat ini seringkali terlalu berat, memerlukan biaya hosting database bulanan, atau memiliki antarmuka yang membosankan.

### 2.2 Visi Produk
**fahnotes** hadir sebagai platform catatan teknis berbasis blok modular bergaya *Notion* & *Google Colab* dengan identitas visual **Neo-brutalism** yang berani, dinamis, dan menyenangkan. Menggunakan **Google Spreadsheet (via Google Apps Script Web App API)** sebagai basis data cloud tanpa biaya (*zero-cost serverless database*), fahnotes menawarkan solusi penyimpanan data persisten yang fleksibel, cepat, dan mudah diakses dari mana saja.

---

## 3. Analisis Masalah & Proposisi Nilai (*Value Proposition*)

| Masalah yang Dihadapi | Solusi yang Disediakan oleh fahnotes |
| :--- | :--- |
| Database SQL/NoSQL cloud membutuhkan biaya berlangganan dan setup kompleks. | Menggunakan **Google Spreadsheet** gratis dengan integrasi REST API Apps Script (`Code.gs`). |
| Catatan skrip seringkali tercampur aduk dan sulit disalin secara cepat. | **Blok Kode Terisolasi** dengan tombol satu-klik *Copy Code*, penomoran baris, dan opsi *Download File*. |
| Akses admin yang mencolok berisiko diakses atau diuji coba pihak asing. | **Disguised Admin Authentication**: Tombol login tersamarkan secara elegan pada footer (`by:Faiz_Fahmi_ID`). |
| Tampilan aplikasi catatan yang monoton dan kaku. | Gaya visual **Neo-brutalism** berkarakter tinggi dengan palet kontras, border tegas, dan animasi responsif. |
| Duplikasi tombol dan navigasi yang membingungkan pengguna. | Mengusung prinsip **"Satu Tombol Satu Fungsi"** (*Single Responsibility Action*). |

---

## 4. Target Pengguna & Persona

### 4.1 Pengunjung Publik / Developer (*Public Reader*)
* **Kebutuhan**:
  - Mencari solusi skrip atau dokumentasi teknis dengan cepat.
  - Membaca dan menyalin potongan kode secara instan tanpa perlu mendaftar/login.
  - Mengunduh skrip langsung ke file lokal (misal: `script.bat`, `setup.sh`).
  - Tampilan yang bersih tanpa tombol aksi admin yang mengganggu.

### 4.2 Administrator / Pemilik Catatan (`Faiz_Fahmi_ID`)
* **Kebutuhan**:
  - Menambah, mengedit, mengurutkan, dan menghapus catatan secara dinamis.
  - Mengatur blok konten (Markdown, Kode, Link Tautan, Lampiran Gambar/File).
  - Melakukan sinkronisasi dua arah (*Push* & *Pull*) dengan database Google Spreadsheet.
  - Mengamankan hak kelola catatan dengan autentikasi terisolasi.

---

## 5. Arsitektur Sistem & Spesifikasi Teknologi

### 5.1 Tech Stack
* **Frontend Core**: React 18+ dengan TypeScript (Strict Mode).
* **Build Tool**: Vite (Lightning-fast HMR & optimized production bundling).
* **Styling Framework**: Tailwind CSS dengan kustomisasi Neobrutalism classes (`nb-btn`, `nb-card`, `nb-badge`, `nb-input`).
* **Iconography**: `lucide-react`.
* **Animasi & Feedback**: `canvas-confetti` dan custom CSS keyframe spinners.
* **Database & Backend API**: Google Spreadsheet + Google Apps Script Web App (JSON Endpoint).
* **Fallback Cache**: Browser LocalStorage untuk akses instan saat offline.

### 5.2 Diagram Arsitektur Data
```
+-------------------------------------------------------------+
|                      fahnotes Client                        |
|       (React + TypeScript + Vite + Tailwind CSS)            |
+------------------------------+------------------------------+
                               |
            +------------------+------------------+
            |                                     |
   [Local State / Cache]                 [REST HTTP API Fetch]
   - Browser LocalStorage                - POST / GET (JSON payload)
   - Instant Fallback                    - Payload: Action & Notes Array
            |                                     |
            +------------------+------------------+
                               |
                               v
               +-------------------------------+
               | Google Apps Script (Code.gs)  |
               |        (Web App Engine)       |
               +---------------+---------------+
                               |
                               v
               +-------------------------------+
               |      Google Spreadsheet       |
               |  (Sheet1: ID, Title, Blocks)  |
               +-------------------------------+
```

---

## 6. Spesifikasi Kebutuhan Fungsional (*Functional Requirements*)

### 6.1 Desain Antarmuka (*Neo-Brutalist Design System*)
* **Border & Elevation**: Menggunakan border tebal solid `border-black` (2px - 3px) dan drop-shadow retro tanpa blur (`shadow-[4px_4px_0px_#000]`, `shadow-[8px_8px_0px_#000]`).
* **Palet Warna**:
  - *Primary Accent*: Kuning `#FFD233`
  - *Secondary Accent*: Teal `#2DD4BF`, Pink `#FF6584`, Indigo `#818CF8`
  - *Neutral Canvas*: Krem Halus `#FAF5EE`, Putih Bersih `#FFFFFF`, Hitam Pekat `#000000`
* **Single Action Rule**: Setiap tombol memiliki fungsi tunggal yang jelas tanpa duplikasi elemen di berbagai lokasi tampilan.

### 6.2 Layar Pemuatan (*Professional Loading Screen*)
* **Tampilan**: Modal layar penuh (*full-screen overlay*) dengan aksen neobrutalism, ikon beranimasi, dan bar progress progresif.
* **Standar Bahasa**: Menggunakan terminologi profesional dan netral:
  - Judul: *"fahnotes - Memuat Aplikasi"*
  - Status teks: *"Memuat, harap tunggu..."*, *"Menyiapkan catatan & skrip..."*, *"Memproses konten..."*, *"Selesai! Membuka halaman..."*
  - Kartu notifikasi: *"⚡ Sedang memuat konten, harap tunggu sebentar..."*
* **Kriteria Selesai**: Otomatis tertutup secara mulus saat proses fetch data selesai.

### 6.3 Mesin Editor Catatan Modular (*Block-Based Editor*)
Editor mendukung penyusunan konten modular yang fleksibel:
1. **Blok Markdown / Teks**:
   - Menulis teks berformat (Heading 1-3, bold, italic, bullet points, checklists, blockquotes).
2. **Blok Kode Fleksibel**:
   - Satu kolom input judul/tipe file bebas (`script.bat`, `index.html`, `main.py`, `deploy.sh`, dll.).
   - Area input kode dengan tema gelap berlatar hitam (`#000000`) dan teks hijau terminal (`#4ADE80`) font monospace.
3. **Blok Tautan Web (*Link Bookmark*)**:
   - Kolom URL, Judul Link, dan Deskripsi singkat.
4. **Blok Lampiran File / Media**:
   - Mendukung URL gambar langsung dengan preview thumbnail instan serta lampiran dokumen.
5. **Manajemen Blok**:
   - Tambah blok baru dengan satu klik.
   - Pindah urutan blok ke atas/bawah (*Reorder*).
   - Hapus blok spesifik.

### 6.4 Penampil Catatan (*Note Viewer & Code Runner Experience*)
* **Header Catatan**: Menampilkan judul, kategori, tanggal update, jumlah blok, dan daftar tag.
* **Aksi Interaktif Kode**:
  - Tombol **Salin Kode**: Menyalin seluruh teks skrip ke clipboard pengguna dengan feedback visual instan.
  - Tombol **Unduh File**: Mengunduh skrip menjadi file nyata dengan nama sesuai judul blok (misal: `clean_temp.bat`).
  - Penomoran Baris: Toggle menampilkan/menyembunyikan nomor baris kode.
* **Fitur Berbagi (*Share*)**: Menyalin link langsung ke catatan yang dipilih.

### 6.5 Pencarian, Kategori & Filter Cepat
* **Instant Search Bar**: Pencarian cerdas secara real-time yang memindai judul catatan, deskripsi, tag, dan isi potongan kode.
* **Kategori Tab Pills**: Filter kategori satu-klik: *Semua, Windows / BAT, Linux / Shell, Python, Web Dev, Catatan Umum*.
* **Statistik Cepat**: Menampilkan total catatan yang cocok dengan filter yang aktif.

### 6.6 Keamanan & Akses Admin Terselubung (*Disguised Admin Access*)
* **Pemicu Login Tersembunyi**: Teks `by:Faiz_Fahmi_ID` di bagian footer berfungsi sebagai tombol rahasia untuk membuka dialog login.
* **Modal Autentikasi**:
  - Input Username dan Password tanpa menampilkan teks kredensial default.
  - Proteksi status sesi admin disimpan aman di session memory.
* **Hak Akses Khusus Admin**:
  - Menampilkan tombol `+ Catatan` di navigasi atas.
  - Menampilkan tombol aksi `Edit` dan `Hapus` pada setiap kartu catatan.
  - Mengakses modal konfigurasi Google Sheets dan generator skrip `Code.gs`.
  - Tombol `Keluar` (Logout) yang aman dan bersih.

### 6.7 Integrasi Google Spreadsheet & Apps Script
* **Sinkronisasi Otomatis (*Auto-Pull*)**: Mengambil data catatan terbaru saat web pertama kali dibuka.
* **Push ke Cloud**: Mengirim seluruh array catatan lokal dalam format JSON terenkapsulasi ke Spreadsheet.
* **Pull dari Cloud**: Menarik dan merefresh data lokal sesuai state terakhir di Spreadsheet.
* **Generator Kode `Code.gs`**: Menyediakan salinan kode Apps Script siap pakai langsung dari antarmuka aplikasi.

---

## 7. Skema & Model Data (*Data Schema*)

### 7.1 Struktur Note (`Note`)
```typescript
interface Note {
  id: string;              // Unique identifier (UUID / timestamp)
  title: string;           // Judul catatan
  description: string;     // Ringkasan singkat
  category: string;        // Kategori (e.g. 'Windows / BAT', 'Python', 'Web Dev')
  tags: string[];          // Array kata kunci / tag (e.g. ['batch', 'windows', 'cleaner'])
  isPinned: boolean;       // Status pin catatan di posisi teratas
  createdAt: string;       // Format ISO String (e.g. '2026-08-29T10:00:00.000Z')
  updatedAt: string;       // Format ISO String
  blocks: ContentBlock[];  // Array blok modular
}
```

### 7.2 Struktur Blok Konten (`ContentBlock`)
```typescript
type ContentBlock = TextBlock | CodeBlock | LinkBlock | FileBlock;

interface TextBlock {
  id: string;
  type: 'text';
  content: string;         // Isi teks format Markdown
}

interface CodeBlock {
  id: string;
  type: 'code';
  title: string;           // Nama file atau tipe skrip (e.g. 'script.bat', 'index.html')
  language?: string;       // Bahasa pemrograman pendukung
  showLineNumbers: boolean;// Toggle penomoran baris
  code: string;            // Source code / script
}

interface LinkBlock {
  id: string;
  type: 'link';
  url: string;             // Alamat tautan web (https://...)
  title: string;           // Judul tautan
  description?: string;    // Deskripsi tautan
}

interface FileBlock {
  id: string;
  type: 'file';
  fileName: string;        // Nama file
  fileUrl: string;         // URL unduhan / preview
  fileType: string;        // MIME type atau ekstensi (e.g. 'image/png', 'document/pdf')
  fileSize?: string;       // Ukuran file terformat (e.g. '1.2 MB')
}
```

### 7.3 Struktur Konfigurasi Sistem (`AppSettings`)
```typescript
interface AppSettings {
  googleSheetsWebAppUrl: string; // URL deployment Web App Apps Script
  isSheetsConnected: boolean;     // Status koneksi aktif
  lastSyncedAt?: string;          // Waktu sinkronisasi terakhir
  autoSync: boolean;              // Toggle sinkronisasi otomatis
}
```

---

## 8. Spesifikasi API Google Apps Script (`Code.gs`)

Google Apps Script dipublikasikan sebagai **Web App** dengan hak akses:
* **Execute as**: *Me*
* **Who has access**: *Anyone*

### 8.1 Endpoint Actions
1. **GET Request (`doGet`)**:
   - Mengambil seluruh baris data dari Google Sheet dan mengembalikannya dalam format JSON array `Note[]`.
2. **POST Request (`doPost`)**:
   - Menerima payload JSON:
     - `action: "syncAll"`: Menggantikan/menulis ulang data sheet dengan data catatan terbaru.
     - `action: "test"`: Menguji koneksi respon status aktif.

---

## 9. Kebutuhan Non-Fungsional (*Non-Functional Requirements*)

1. **Performa & Kecepatan**:
   - Waktu pemuatan awal (*First Contentful Paint*) < 1.0 detik.
   - Operasi pencarian dan pemfilteran bersifat instan tanpa *lag* (*debounce 0ms* pada memori lokal).
2. **Keandalan & Fallback Offline**:
   - Jika Google Sheets tidak dapat dijangkau (misal jaringan terputus), aplikasi tetap berfungsi penuh menggunakan data cache LocalStorage.
3. **Kompatibilitas Lintas Perangkat**:
   - Tampilan adaptif penuh (*responsive layout*) mulai dari layar mobile 320px hingga monitor ultra-wide 4K.
4. **Aksesibilitas & Kontras**:
   - Mengikuti rasio kontras teks WCAG AA dengan teks hitam pekat di atas kanvas terang dan teks terang di atas terminal hitam.

---

## 10. Alur Kerja Pengguna (*User Journey Flows*)

### 10.1 Alur Pengunjung Membaca & Menyalin Skrip
1. Pengunjung mengakses URL website `fahnotes`.
2. Layar *Loading* muncul menampilkan progress penyiapan data.
3. Halaman utama terbuka dengan daftar kartu catatan.
4. Pengunjung memfilter kategori (contoh: *Windows / BAT*) atau mengetik kata kunci pada kolom pencarian.
5. Pengunjung mengeklik kartu catatan yang diinginkan.
6. Catatan terbuka dalam format detail. Pengunjung menekan tombol **"Salin Kode"** pada blok skrip.
7. Skrip tersalin ke clipboard dan siap digunakan.

### 10.2 Alur Admin Membuat & Menyinkronkan Catatan
1. Admin menggulir ke bagian bawah website (footer) dan mengeklik tautan terselubung **`by:Faiz_Fahmi_ID`**.
2. Modal autentikasi muncul, Admin memasukkan username & password.
3. Header berubah ke status **ADMIN** dengan akses tombol `+ Catatan` dan menu database.
4. Admin mengeklik **`+ Catatan`**, mengisi detail catatan, dan menambahkan blok konten (Markdown, Kode, Link).
5. Admin menekan **"Simpan Catatan"**.
6. Catatan tersimpan ke penyimpanan lokal dan otomatis dikirim (*Push*) ke Google Spreadsheet.

---

## 11. Panduan Pengoperasian & Deployment

### 11.1 Menjalankan Proyek Secara Lokal
```bash
# 1. Install dependencies
npm install

# 2. Jalankan development server
npm run dev

# 3. Build untuk produksi
npm run build
```

### 11.2 Langkah Integrasi Google Sheets
1. Buka [Google Sheets](https://sheets.new) dan buat Spreadsheet baru.
2. Buka menu **Extensions** > **Apps Script**.
3. Buka modal *Google Sheets / Database* di fahnotes, salin seluruh kode dari tab **Kode Apps Script (Code.gs)**, dan tempelkan ke editor Apps Script.
4. Klik **Deploy** > **New deployment** > Pilih jenis **Web app**.
5. Atur *Execute as* ke **Me** dan *Who has access* ke **Anyone**.
6. Salin **Web App URL** yang dihasilkan, lalu tempelkan ke pengaturan Google Sheets di fahnotes dan klik **Simpan & Uji Koneksi**.

---

*Dokumen ini merupakan panduan spesifikasi resmi untuk pengembangan dan pemeliharaan platform **fahnotes**.*
