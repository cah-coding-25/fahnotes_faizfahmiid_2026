# ⚡ fahnotes — Modern Developer Knowledge Base & Code Repository
> **Platform Dokumentasi Kode, Catatan Teknis, dan Repositori Skrip Otomasi Terpusat**  
> *Dibuat dan Dikelola oleh:* **`by: Faiz_Fahmi_ID`**

---

## 🌟 1. Tentang fahnotes

**fahnotes** adalah platform repositori catatan teknis dan *code snippet* modular bergaya gabungan *Notion* dan *Google Colab* dengan sentuhan visual **Neo-Brutalism** yang modern, berani, dan luas. 

Dirancang khusus untuk developer, sysadmin, teknisi IT, dan pegiat otomasi, fahnotes memungkinkan penyimpanan, pengorganisasian, penyalinan 1-klik, serta pengunduhan skrip (`.bat`, `.sh`, `.py`, `.js`, `.html`, dll.) secara instan tanpa biaya hosting database bulanan dengan memanfaatkan **Google Spreadsheet & Google Apps Script Web App** sebagai basis data cloud *serverless*.

---

## 🚀 2. Fitur-Fitur Lengkap

### 📝 2.1. Editor Catatan Modular Berbasis Blok (*Block-Based Editor*)
* **Blok Markdown / Teks Kaya**: Mendukung format Heading (#, ##, ###), teks tebal (**bold**), miring (*italic*), daftar poin (bullet points), kutipan (blockquotes), dan daftar tugas.
* **Blok Kode & Terminal Eksekutif**:
  * Tampilan editor bergaya terminal gelap (`#000000`) dengan sintaks teks terang ala hacker / console.
  * Dilengkapi kolom kustom nama file atau ekstensi (contoh: `backup.bat`, `setup.sh`, `main.py`, `script.js`).
  * Tombol toggle penomoran baris (*Line Numbers*).
  * Tombol 1-klik **Salin Kode** (*Copy Code to Clipboard*).
  * Tombol **Unduh File Skrip** (*Direct Download*) langsung menjadi file nyata sesuai nama blok kode.
* **Blok Tautan / Web Bookmark**: Menyimpan URL dokumentasi atau referensi eksternal lengkap dengan judul dan deskripsi.
* **Blok Lampiran Gambar & File**: Menyematkan tautan file media atau gambar dengan pratinjau instan.
* **Manajemen Urutan Blok**: Blok konten dapat dipindah urutannya ke atas / ke bawah (*Reorder*) serta dihapus secara individual.

### 🌐 2.2. Sinkronisasi Global Lintas Perangkat Se-Indonesia (*Nationwide Multi-Device Sync*)
* **Cukup Input URL 1 Kali**: Admin cukup memasukkan dan menyimpan URL Google Apps Script di 1 perangkat (misal di PC/laptop Admin), dan seluruh pengunjung atau perangkat lain di seluruh Indonesia otomatis terhubung ke database yang sama.
* **Realtime Background Live Sync**: Sinkronisasi latar belakang otomatis yang memperbarui daftar catatan secara berkala saat ada perubahan dari perangkat lain.
* **Auto-Cache & Offline Resilience**: Menyimpan cache lokal instan sehingga aplikasi tetap dapat dibuka dan dibaca meskipun koneksi internet terputus.

### 🔐 2.3. Keamanan & Akses Admin Terselubung (*Disguised Admin Authentication*)
* **Login Tersembunyi**: Tombol login admin tersamarkan secara elegan pada teks tanda tangan di bagian footer (`by: Faiz_Fahmi_ID`).
* **Proteksi Akses Penuh**: Pengunjung biasa hanya dapat membaca, mencari, menyalin, dan mengunduh kode. Tombol `+ Tulis Catatan Baru`, `Edit`, `Hapus`, serta pengaturan database hanya muncul saat sesi Admin aktif.
* **Kredensial Default Awal**:
  * **Username**: `Faiz_Fahmi_ID`
  * **Password**: `admin123`
* **Manajemen Kredensial**: Admin dapat mengganti username dan password kapan saja langsung dari menu pengaturan, dan otomatis tersimpan ke server & Google Spreadsheet.

### 🏷️ 2.4. Manajemen Kategori & Pencarian Cerdas
* **Kategori Dinamis**: Tambah, ubah nama (*rename*), atau hapus kategori dengan pemindahan catatan otomatis.
* **Instant Multi-Field Search**: Pencarian cerdas secepat kilat (0ms debounce) yang memindai judul catatan, deskripsi, tag, nama file, hingga baris kode skrip.
* **Filter Pil Kategori**: Navigasi kategori satu-klik dengan penghitung jumlah catatan aktif.

### 🎨 2.5. Desain Neo-Brutalism Luas & Bebas Kotak Sempit
* **Kanvas Terbuka & Luas**: Tidak terkunci di dalam bingkai kotak kecil yang sempit; tata letak memanfaatkan kontainer *full-width* yang responsif untuk kenyamanan membaca kode panjang.
* **Dekorasi Vektor Geometris**: Dilengkapi pola *dot-matrix grid SVG*, aksen *sparkle doodle (`✦`)*, stiker geometris, dan palet warna kontras tinggi yang ramah mata.
* **Efek Selebrasi Visual**: Efek konfeti interaktif saat berhasil membuat atau menyimpan catatan baru.

---

## 🛠️ 3. Daftar Library & Spesifikasi Teknologi (*Tech Stack*)

Berikut adalah seluruh daftar dependensi, library, dan teknologi yang digunakan dalam proyek ini:

### 3.1. Frontend Core & Framework
| Library / Paket | Versi | Fungsi & Kegunaan |
| :--- | :--- | :--- |
| **`react`** | `^19.0.1` | Pustaka antarmuka pengguna berbasis komponen deklaratif. |
| **`react-dom`** | `^19.0.1` | Driver rendering React untuk browser DOM. |
| **`typescript`** | `~5.8.2` | Pengetikan statis untuk keandalan dan keamanan tipe data. |
| **`vite`** | `^6.2.3` | Build tool & bundler ultra-cepat dengan Hot Module Replacement. |

### 3.2. Antarmuka, Animasi & Ikonografi
| Library / Paket | Versi | Fungsi & Kegunaan |
| :--- | :--- | :--- |
| **`tailwindcss`** | `^4.1.14` | Utility-first CSS framework untuk styling Neo-Brutalism. |
| **`@tailwindcss/vite`** | `^4.1.14` | Integrasi resmi Tailwind CSS v4 ke dalam Vite. |
| **`lucide-react`** | `^0.546.0` | Kumpulan ikon vektor modern yang ringan dan konsisten. |
| **`motion`** | `^12.23.24` | Library animasi transisi dan gesture interaktif halus. |
| **`canvas-confetti`** | `^1.9.4` | Animasi selebrasi partikel konfeti saat aksi berhasil. |
| **`react-markdown`** | `^10.1.0` | Renderer konten Markdown untuk blok teks kaya. |

### 3.3. Backend Server & Engine
| Library / Paket | Versi | Fungsi & Kegunaan |
| :--- | :--- | :--- |
| **`express`** | `^4.21.2` | Server HTTP Node.js untuk proxy API & konfigurasi global server. |
| **`tsx`** | `^4.21.0` | Runtime eksekusi TypeScript untuk server Node.js saat *development*. |
| **`esbuild`** | `^0.25.0` | Bundler super cepat untuk mengompilasi `server.ts` ke format CommonJS `dist/server.cjs`. |
| **`dotenv`** | `^17.2.3` | Pengelola variabel lingkungan (*environment variables*). |
| **`@google/genai`** | `^2.4.0` | SDK Google Gen AI untuk kapabilitas integrasi server-side masa depan. |

### 3.4. Database & Cloud Backend
* **Google Spreadsheet**: Basis data tabel *cloud-hosted* tanpa biaya.
* **Google Apps Script (`Code.gs`)**: REST API Endpoint (*Serverless Web App*) yang mengelola operasi CRUD (`doGet` dan `doPost`).

---

## 📖 4. Panduan Cara Pakai (*User Guide*)

### 👤 4.1. Sebagai Pengunjung / Pembaca Publik
1. **Mencari Catatan**: Ketik kata kunci pada kolom pencarian di bagian atas atau klik tombol filter kategori (misal: *BAT Script*, *Python*, dll.).
2. **Membaca Detail**: Klik pada kartu catatan mana pun untuk membuka tampilan penuh.
3. **Menyalin Kode**: Pada blok kode, klik tombol **"Salin Kode"** (ikon Clipboard) untuk menyalin isi skrip.
4. **Mengunduh Skrip**: Klik tombol **"Unduh .bat / .sh / .py"** untuk mengunduh kode langsung sebagai file di komputer/HP Anda.

---

### 🔑 4.2. Cara Masuk Sebagai Admin (Login Admin)
1. Gulir ke bagian paling bawah website (**Footer**).
2. Klik teks **`by: Faiz_Fahmi_ID`**.
3. Masukkan kredensial login default:
   * **Username**: `Faiz_Fahmi_ID`
   * **Password**: `admin123`
4. Klik **"Masuk Admin"**. Setelah berhasil, mode Admin akan aktif dan tombol tambah/edit/hapus catatan akan terbuka.

---

### ✍️ 4.3. Cara Menambah & Mengedit Catatan
1. Pastikan sudah dalam status **Login Admin**.
2. Klik tombol kuning **`+ Tulis Catatan Baru`** di bagian atas.
3. Isi informasi dasar:
   * **Judul Catatan** (Wajib)
   * **Kategori** (Pilih yang tersedia atau tambahkan kategori baru)
   * **Deskripsi Singkat**
   * **Tag Kata Kunci** (Dipisahkan tanda koma)
   * **Pin Catatan** (Centang jika ingin diletakkan di posisi paling atas)
4. Tambahkan blok konten sesuai kebutuhan:
   * Klik **`+ Teks Markdown`** untuk penjelasan tutorial/dokumentasi.
   * Klik **`+ Blok Kode`** untuk menempelkan source code/skrip.
   * Klik **`+ Link Tautan`** untuk bookmark URL penting.
5. Klik **"💾 Simpan Catatan"**. Catatan akan langsung tersimpan secara lokal dan otomatis disinkronkan ke Google Spreadsheet.

---

### 📊 4.4. Panduan Menghubungkan ke Google Spreadsheet

Untuk menghubungkan website ini ke Google Spreadsheet Anda sendiri:

#### Langkah 1: Buat Google Spreadsheet Baru
1. Buka [Google Sheets](https://sheets.new) di browser Anda.
2. Beri nama spreadsheet, contoh: `fahnotes_database`.

#### Langkah 2: Buka Apps Script & Salin Skrip
1. Di Google Sheets, klik menu **Ekstensi (*Extensions*)** ➡️ **Apps Script**.
2. Hapus seluruh isi kode bawaan yang ada di editor Apps Script.
3. Buka website **fahnotes** ➡️ klik tombol **Sheets / Kategori** (ikon Database) di navigasi atas ➡️ pilih tab **"📜 Kode Apps Script (Code.gs)"** ➡️ klik **"Salin Seluruh Kode Apps Script"**.
4. Tempelkan (*paste*) kode tersebut ke editor Apps Script di Google Sheets Anda.
5. Klik ikon **Simpan** (ikon Disket).

#### Langkah 3: Deploy sebagai Web App
1. Di halaman Apps Script, klik tombol biru **Deploy** di kanan atas ➡️ pilih **New deployment (*Penerapan baru*)**.
2. Klik ikon gerigi ⚙️ di sebelah *Select type* ➡️ pilih **Web app**.
3. Atur konfigurasi berikut:
   * **Description**: `fahnotes API v1`
   * **Execute as (*Jalankan sebagai*)**: **Me (*Saya*)**
   * **Who has access (*Siapa yang memiliki akses*)**: **Anyone (*Siapa saja*)** *(Wajib agar dapat diakses oleh web)*.
4. Klik **Deploy**. Jika diminta izin akses (*Authorize access*), pilih akun Google Anda lalu klik **Advanced** ➡️ **Go to fahnotes (unsafe)** ➡️ **Allow**.
5. Salin **Web app URL** yang berakhiran `/exec`.

#### Langkah 4: Simpan URL di fahnotes
1. Kembali ke website **fahnotes**, buka modal **Sheets / Kategori**.
2. Masukkan URL Web App ke kolom yang tersedia, lalu klik **"Simpan & Uji Koneksi"**.
3. Sistem akan otomatis memformat tabel spreadsheet dan menyinkronkan seluruh catatan Anda secara global!

---

## 📂 5. Struktur Direktori Proyek

```plaintext
fahnotes/
├── data/
│   └── global-config.json     # Konfigurasi persisten server global
├── src/
│   ├── components/
│   │   ├── Footer.tsx             # Footer dengan disguised admin trigger
│   │   ├── GoogleSheetsModal.tsx  # Setup Spreadsheet, Kategori, & Kredensial
│   │   ├── Header.tsx             # Top navigation bar & category pills
│   │   ├── LoadingScreen.tsx      # Full-screen Neo-brutalist loader
│   │   ├── LoginModal.tsx         # Modal login admin
│   │   ├── NoteCard.tsx           # Kartu catatan individual dengan aksi
│   │   ├── NoteEditor.tsx         # Editor modular multi-blok
│   │   ├── NoteViewer.tsx         # Tampilan pembaca catatan & eksekusi kode
│   │   ├── Toast.tsx              # Sistem notifikasi toast
│   │   └── VectorDecorations.tsx  # Aksen vektor, SVG doodle, & dot pattern
│   ├── utils/
│   │   ├── codeGsScript.ts        # Source generator kode Google Apps Script
│   │   ├── defaultNotes.ts        # Data catatan awal siap pakai
│   │   └── googleSheetsApi.ts     # Driver komunikasi API & Server Config
│   ├── App.tsx                    # Komponen utama & state management
│   ├── index.css                  # Konfigurasi Tailwind CSS & gaya kustom
│   ├── main.tsx                   # Titik masuk aplikasi React
│   └── types.ts                   # Definisi TypeScript interface & types
├── index.html                     # HTML Template entry point
├── metadata.json                  # Konfigurasi metadata aplikasi
├── package.json                   # Daftar dependensi & scripts
├── server.ts                      # Server Express & proxy sync global
├── tsconfig.json                  # Konfigurasi TypeScript
└── vite.config.ts                 # Konfigurasi Vite & plugin
```

---

## 💻 6. Menjalankan Proyek Secara Lokal (*Development*)

```bash
# 1. Clone repository atau buka direktori proyek
cd fahnotes

# 2. Install seluruh dependensi
npm install

# 3. Jalankan server development
npm run dev

# 4. Buka di browser
# http://localhost:3000
```

Untuk melakukan build produksi:
```bash
npm run build
npm start
```

---

## 🛡️ 7. Lisensi & Hak Cipta

Dibuat dengan dedikasi untuk komunitas programmer & otomatisasi oleh:  
**`Faiz_Fahmi_ID`** *(fahnotes Project)*

*Happy Coding & Scripting! 🚀*
