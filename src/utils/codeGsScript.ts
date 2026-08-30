/**
 * Complete Google Apps Script (Code.gs) for Google Spreadsheet Database integration.
 * Users can copy this code directly into Google Sheets -> Extensions -> Apps Script.
 * 
 * Auto-creates all Sheets (Notes, Categories, Settings) and all columns with formatting
 * when triggered from the website Push / Sync button.
 */

export const CODE_GS_SCRIPT = `/**
 * =========================================================================
 * fahnotes - Google Sheets Backend Database Engine (Full CRUD & Auto-Setup)
 * Author: Faiz_Fahmi_ID
 * =========================================================================
 * 
 * FITUR UTAMA CODE.GS INI:
 * 1. Auto-Setup: Otomatis membuat sheet "Notes", "Categories", dan "Settings".
 * 2. Auto-Columns: Otomatis membuat seluruh 13 kolom header catatan dan kolom pengaturan.
 * 3. Dynamic Categories: Menyimpan dan menyinkronkan daftar kategori (Tambah, Edit, Hapus).
 * 4. Admin Account Sync: Menyimpan username dan password admin di sheet "Settings".
 * 5. Full CRUD:
 *    - CREATE / PUSH: Tambah catatan baru atau sinkronisasi massal seluruh data.
 *    - READ: Ambil seluruh catatan, kategori, dan pengaturan ke web.
 *    - UPDATE: Perbarui catatan, kategori, atau akun admin.
 *    - DELETE: Hapus baris catatan berdasarkan ID.
 * 6. CORS Friendly: Mendukung request dari browser tanpa kendala cross-origin.
 * 
 * =========================================================================
 * CARA MEMASANG DI GOOGLE SPREADSHEET:
 * 1. Buka Google Spreadsheet baru (Beri nama misal: "fahnotes Database").
 * 2. Di menu atas, klik 'Ekstensi' (Extensions) -> 'Apps Script'.
 * 3. Hapus seluruh isi kode bawaan, lalu paste seluruh script ini ke file Code.gs.
 * 4. Klik 'Save' (Simpan / Ikon Disket).
 * 5. Klik tombol biru 'Deploy' (Terapkan) di kanan atas -> pilih 'New deployment' (Penerapan baru).
 * 6. Klik ikon gerigi di sebelah kiri -> pilih 'Web app' (Aplikasi web).
 * 7. Konfigurasi:
 *    - Description: "fahnotes Auto CRUD API"
 *    - Execute as: "Me" (Saya / akun Google Anda)
 *    - Who has access: "Anyone" (Siapa saja)  <-- PENTING!
 * 8. Klik 'Deploy', klik 'Authorize access', pilih akun Google Anda, klik 'Advanced' -> 'Go to fahnotes (unsafe)', lalu klik 'Allow'.
 * 9. Salin 'Web app URL' (akhiran /exec).
 * 10. Buka website fahnotes -> menu Sheets / Pengaturan -> paste URL dan klik "⚡ Push ke Spreadsheet"!
 * =========================================================================
 */

const SHEET_NAME_NOTES = "Notes";
const SHEET_NAME_CATEGORIES = "Categories";
const SHEET_NAME_SETTINGS = "Settings";

// 13 Kolom Database Catatan
const NOTES_HEADERS = [
  "ID",
  "Title",
  "Slug",
  "Description",
  "Category",
  "CoverImage",
  "FileDownloadUrl",
  "FileDownloadName",
  "BlocksJSON",
  "IsPublic",
  "Author",
  "CreatedAt",
  "UpdatedAt"
];

const CATEGORIES_HEADERS = ["Category", "TotalNotes", "LastUpdated"];
const SETTINGS_HEADERS = ["Username", "Password", "Author", "LastUpdated"];

/**
 * Helper untuk membuat atau mengambil Sheet sekaligus format header
 */
function getOrCreateSheet(sheetName, headers, headerColor) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(sheetName);
  
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
  }
  
  if (headers && headers.length > 0) {
    const lastRow = sheet.getLastRow();
    if (lastRow === 0) {
      sheet.appendRow(headers);
      formatHeaderRow(sheet, headers.length, headerColor || "#FFD233");
    } else {
      const firstRow = sheet.getRange(1, 1, 1, headers.length).getValues()[0];
      let match = true;
      for (let i = 0; i < headers.length; i++) {
        if (firstRow[i] !== headers[i]) {
          match = false;
          break;
        }
      }
      if (!match) {
        sheet.insertRowBefore(1);
        sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
        formatHeaderRow(sheet, headers.length, headerColor || "#FFD233");
      }
    }
  }
  
  return sheet;
}

/**
 * Format baris header agar rapi dan profesional
 */
function formatHeaderRow(sheet, colCount, bgColor) {
  try {
    const range = sheet.getRange(1, 1, 1, colCount);
    range.setFontWeight("bold");
    range.setFontColor("#000000");
    range.setBackground(bgColor || "#FFD233");
    range.setHorizontalAlignment("center");
    range.setVerticalAlignment("middle");
    sheet.setRowHeight(1, 35);
    sheet.setFrozenRows(1);
    
    for (let c = 1; c <= colCount; c++) {
      sheet.autoResizeColumn(c);
    }
  } catch (e) {
    Logger.log("Format error: " + e.toString());
  }
}

/**
 * Inisialisasi seluruh sheet & kolom secara otomatis
 */
function initAllSheets() {
  getOrCreateSheet(SHEET_NAME_NOTES, NOTES_HEADERS, "#FFD233");
  getOrCreateSheet(SHEET_NAME_CATEGORIES, CATEGORIES_HEADERS, "#2DD4BF");
  getOrCreateSheet(SHEET_NAME_SETTINGS, SETTINGS_HEADERS, "#818CF8");
  return { success: true, message: "Semua Sheet dan Kolom berhasil dibuat otomatis!" };
}

/**
 * Handle HTTP GET Request
 */
function doGet(e) {
  try {
    const action = e && e.parameter && e.parameter.action ? e.parameter.action : "getAll";
    
    if (action === "ping") {
      initAllSheets();
      return responseJSON({ 
        success: true, 
        message: "⚡ Google Sheets Database fahnotes terhubung dengan sukses!", 
        author: "Faiz_Fahmi_ID",
        timestamp: new Date().toISOString() 
      });
    }
    
    if (action === "initSheet" || action === "setup") {
      const initResult = initAllSheets();
      return responseJSON(initResult);
    }
    
    if (action === "getNotes" || action === "getAll") {
      const notes = fetchAllNotes();
      const categories = fetchCategories();
      const settings = fetchSettings();
      return responseJSON({ 
        success: true, 
        data: notes, 
        notes: notes,
        categories: categories,
        settings: settings,
        count: notes.length 
      });
    }
    
    if (action === "getSettings") {
      const settings = fetchSettings();
      return responseJSON({ success: true, settings: settings, data: settings });
    }

    if (action === "getCategories") {
      const cats = fetchCategories();
      return responseJSON({ success: true, categories: cats, data: cats });
    }

    return responseJSON({ success: true, data: fetchAllNotes() });
  } catch (error) {
    return responseJSON({ success: false, error: error.toString() });
  }
}

/**
 * Handle HTTP POST Request (Create / Push / Update / Delete / Save Admin / Save Categories)
 */
function doPost(e) {
  try {
    let payload = {};
    if (e && e.postData && e.postData.contents) {
      try {
        payload = JSON.parse(e.postData.contents);
      } catch (err) {
        payload = {};
      }
    }
    
    if (Object.keys(payload).length === 0 && e && e.parameter) {
      payload = e.parameter;
      if (typeof payload.notes === 'string') {
        try { payload.notes = JSON.parse(payload.notes); } catch(err) {}
      }
      if (typeof payload.note === 'string') {
        try { payload.note = JSON.parse(payload.note); } catch(err) {}
      }
      if (typeof payload.categories === 'string') {
        try { payload.categories = JSON.parse(payload.categories); } catch(err) {}
      }
      if (typeof payload.settings === 'string') {
        try { payload.settings = JSON.parse(payload.settings); } catch(err) {}
      }
    }

    const action = payload.action || "syncAll";

    // 1. PUSH / SYNC ALL (Catatan, Kategori, dan Pengaturan Admin)
    if (action === "syncAll" || action === "push") {
      initAllSheets();
      const notes = payload.notes || [];
      saveAllNotes(notes);
      
      const categoriesList = payload.categories || [];
      saveCategoriesList(categoriesList, notes);
      
      if (payload.settings) {
        saveSettings(payload.settings);
      }
      
      return responseJSON({ 
        success: true, 
        message: "Berhasil! Seluruh catatan (" + notes.length + " data), kategori (" + categoriesList.length + "), dan pengaturan admin tersimpan di Google Spreadsheet.", 
        count: notes.length,
        timestamp: new Date().toISOString()
      });
    }

    // 2. CREATE / UPDATE SINGLE NOTE
    if (action === "saveNote" || action === "create" || action === "update") {
      initAllSheets();
      const note = payload.note;
      if (!note || !note.id) {
        return responseJSON({ success: false, error: "Data catatan atau ID tidak valid" });
      }
      upsertNote(note);
      const allNotes = fetchAllNotes();
      updateCategoriesSummary(allNotes);
      return responseJSON({ 
        success: true, 
        message: "Catatan '" + (note.title || note.id) + "' berhasil disimpan ke Spreadsheet!", 
        noteId: note.id 
      });
    }

    // 3. DELETE SINGLE NOTE
    if (action === "deleteNote" || action === "delete") {
      const noteId = payload.id || (payload.note && payload.note.id);
      if (!noteId) {
        return responseJSON({ success: false, error: "ID catatan yang akan dihapus tidak ditemukan" });
      }
      deleteNoteById(noteId);
      const allNotes = fetchAllNotes();
      updateCategoriesSummary(allNotes);
      return responseJSON({ 
        success: true, 
        message: "Catatan dengan ID '" + noteId + "' berhasil dihapus dari Spreadsheet!" 
      });
    }

    // 4. SAVE / UPDATE ADMIN CREDENTIALS & SETTINGS
    if (action === "saveSettings" || action === "updateAdmin") {
      initAllSheets();
      saveSettings(payload.settings || payload);
      return responseJSON({ 
        success: true, 
        message: "Data akun admin & pengaturan berhasil diperbarui dan tersimpan di Google Spreadsheet!" 
      });
    }

    // 5. SAVE DYNAMIC CATEGORIES
    if (action === "saveCategories") {
      initAllSheets();
      const cats = payload.categories || [];
      const allNotes = fetchAllNotes();
      saveCategoriesList(cats, allNotes);
      return responseJSON({ 
        success: true, 
        message: "Daftar kategori (" + cats.length + " kategori) berhasil disimpan di Google Spreadsheet!" 
      });
    }

    // 6. MANUAL INIT
    if (action === "initSheet") {
      const res = initAllSheets();
      return responseJSON(res);
    }

    return responseJSON({ success: false, error: "Action '" + action + "' tidak dikenali" });
  } catch (error) {
    return responseJSON({ success: false, error: error.toString() });
  }
}

/**
 * READ ALL NOTES
 */
function fetchAllNotes() {
  const sheet = getOrCreateSheet(SHEET_NAME_NOTES, NOTES_HEADERS, "#FFD233");
  const data = sheet.getDataRange().getValues();
  
  if (data.length <= 1) return [];
  
  const notes = [];
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    if (!row[0]) continue;
    
    let blocks = [];
    try {
      blocks = row[8] ? JSON.parse(row[8]) : [];
    } catch(err) {
      blocks = [];
    }

    notes.push({
      id: String(row[0]),
      title: String(row[1] || ""),
      slug: String(row[2] || ""),
      description: String(row[3] || ""),
      category: String(row[4] || "Umum"),
      coverImage: String(row[5] || ""),
      fileDownloadUrl: String(row[6] || ""),
      fileDownloadName: String(row[7] || ""),
      blocks: blocks,
      isPublic: row[9] === true || row[9] === "TRUE" || row[9] === "true" || row[9] === 1,
      author: String(row[10] || "Faiz_Fahmi_ID"),
      createdAt: String(row[11] || new Date().toISOString()),
      updatedAt: String(row[12] || new Date().toISOString())
    });
  }
  
  return notes;
}

/**
 * UPSERT SINGLE NOTE
 */
function upsertNote(note) {
  const sheet = getOrCreateSheet(SHEET_NAME_NOTES, NOTES_HEADERS, "#FFD233");
  const data = sheet.getDataRange().getValues();
  
  const blocksJSON = JSON.stringify(note.blocks || []);
  const rowData = [
    note.id,
    note.title || "",
    note.slug || "",
    note.description || "",
    note.category || "Umum",
    note.coverImage || "",
    note.fileDownloadUrl || "",
    note.fileDownloadName || "",
    blocksJSON,
    note.isPublic ? "TRUE" : "FALSE",
    note.author || "Faiz_Fahmi_ID",
    note.createdAt || new Date().toISOString(),
    note.updatedAt || new Date().toISOString()
  ];

  let rowIndex = -1;
  for (let i = 1; i < data.length; i++) {
    if (String(data[i][0]) === String(note.id)) {
      rowIndex = i + 1;
      break;
    }
  }

  if (rowIndex > 0) {
    sheet.getRange(rowIndex, 1, 1, rowData.length).setValues([rowData]);
  } else {
    sheet.appendRow(rowData);
  }
}

/**
 * DELETE NOTE BY ID
 */
function deleteNoteById(noteId) {
  const sheet = getOrCreateSheet(SHEET_NAME_NOTES, NOTES_HEADERS, "#FFD233");
  const data = sheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (String(data[i][0]) === String(noteId)) {
      sheet.deleteRow(i + 1);
      break;
    }
  }
}

/**
 * SAVE ALL NOTES (Massal)
 */
function saveAllNotes(notesList) {
  const sheet = getOrCreateSheet(SHEET_NAME_NOTES, NOTES_HEADERS, "#FFD233");
  sheet.clear();
  sheet.appendRow(NOTES_HEADERS);
  formatHeaderRow(sheet, NOTES_HEADERS.length, "#FFD233");

  if (notesList && notesList.length > 0) {
    const rows = notesList.map(note => [
      note.id,
      note.title || "",
      note.slug || "",
      note.description || "",
      note.category || "Umum",
      note.coverImage || "",
      note.fileDownloadUrl || "",
      note.fileDownloadName || "",
      JSON.stringify(note.blocks || []),
      note.isPublic ? "TRUE" : "FALSE",
      note.author || "Faiz_Fahmi_ID",
      note.createdAt || new Date().toISOString(),
      note.updatedAt || new Date().toISOString()
    ]);
    sheet.getRange(2, 1, rows.length, NOTES_HEADERS.length).setValues(rows);
    sheet.getRange(2, 1, rows.length, NOTES_HEADERS.length).setVerticalAlignment("top");
  }
}

/**
 * Save explicit dynamic categories list
 */
function saveCategoriesList(categoriesArray, notesList) {
  try {
    const sheet = getOrCreateSheet(SHEET_NAME_CATEGORIES, CATEGORIES_HEADERS, "#2DD4BF");
    sheet.clear();
    sheet.appendRow(CATEGORIES_HEADERS);
    formatHeaderRow(sheet, CATEGORIES_HEADERS.length, "#2DD4BF");

    const counts = {};
    (notesList || []).forEach(n => {
      const cat = n.category || "Umum";
      counts[cat] = (counts[cat] || 0) + 1;
    });

    const now = new Date().toISOString();
    const list = Array.isArray(categoriesArray) && categoriesArray.length > 0 
      ? categoriesArray 
      : Object.keys(counts);

    const rows = list.map(c => {
      const catName = typeof c === 'string' ? c : (c.name || 'Umum');
      return [catName, counts[catName] || 0, now];
    });

    if (rows.length > 0) {
      sheet.getRange(2, 1, rows.length, CATEGORIES_HEADERS.length).setValues(rows);
    }
  } catch(e) {
    Logger.log("Save categories error: " + e.toString());
  }
}

/**
 * Auto update summary di sheet "Categories"
 */
function updateCategoriesSummary(notesList) {
  try {
    const existingCats = fetchCategories();
    const catNames = existingCats.map(c => c.name);
    saveCategoriesList(catNames, notesList);
  } catch(e) {
    Logger.log("Update categories error: " + e.toString());
  }
}

/**
 * FETCH CATEGORIES
 */
function fetchCategories() {
  const sheet = getOrCreateSheet(SHEET_NAME_CATEGORIES, CATEGORIES_HEADERS, "#2DD4BF");
  const data = sheet.getDataRange().getValues();
  if (data.length <= 1) return [];
  const cats = [];
  for (let i = 1; i < data.length; i++) {
    if (data[i][0]) {
      cats.push({ name: String(data[i][0]), count: Number(data[i][1] || 0) });
    }
  }
  return cats;
}

/**
 * FETCH SETTINGS (Membaca Username & Password dari baris ke-2 sheet Settings)
 */
function fetchSettings() {
  const sheet = getOrCreateSheet(SHEET_NAME_SETTINGS, SETTINGS_HEADERS, "#818CF8");
  const data = sheet.getDataRange().getValues();
  const settings = {
    adminUsername: "Faiz_Fahmi_ID",
    adminPassword: "admin",
    authorName: "Faiz_Fahmi_ID"
  };
  if (data.length <= 1) return settings;

  // Cek apakah format kolom horizontal: Baris 1 = Headers ("Username", "Password"), Baris 2 = Values
  const headers = data[0].map(h => String(h).toLowerCase().trim());
  const uIdx = headers.findIndex(h => h === "username" || h.includes("user"));
  const pIdx = headers.findIndex(h => h === "password" || h.includes("pass"));
  const aIdx = headers.findIndex(h => h === "author" || h.includes("author"));

  if (uIdx !== -1 && data.length > 1) {
    if (data[1][uIdx] !== undefined && String(data[1][uIdx]).trim() !== "") {
      settings.adminUsername = String(data[1][uIdx]).trim();
    }
    if (pIdx !== -1 && data[1][pIdx] !== undefined && String(data[1][pIdx]).trim() !== "") {
      settings.adminPassword = String(data[1][pIdx]).trim();
    }
    if (aIdx !== -1 && data[1][aIdx] !== undefined && String(data[1][aIdx]).trim() !== "") {
      settings.authorName = String(data[1][aIdx]).trim();
    }
  } else {
    // Fallback format vertical Key-Value jika pengguna memiliki format lama
    for (let i = 1; i < data.length; i++) {
      const key = String(data[i][0] || "").trim();
      const val = String(data[i][1] !== undefined ? data[i][1] : "").trim();
      if (key) {
        if (key.toLowerCase().includes("user")) settings.adminUsername = val;
        else if (key.toLowerCase().includes("pass")) settings.adminPassword = val;
        else if (key.toLowerCase().includes("author")) settings.authorName = val;
        settings[key] = val;
      }
    }
  }
  return settings;
}

/**
 * SAVE SETTINGS (Menyimpan Username & Password di Baris 2 Sheet Settings)
 * Kolom 1 = Username | Kolom 2 = Password | Kolom 3 = Author | Kolom 4 = LastUpdated
 */
function saveSettings(settingsObj) {
  const sheet = getOrCreateSheet(SHEET_NAME_SETTINGS, SETTINGS_HEADERS, "#818CF8");
  sheet.clear();
  sheet.appendRow(SETTINGS_HEADERS);
  formatHeaderRow(sheet, SETTINGS_HEADERS.length, "#818CF8");

  const username = String(settingsObj.adminUsername || settingsObj.Username || settingsObj.username || "Faiz_Fahmi_ID").trim();
  const password = String(settingsObj.adminPassword || settingsObj.adminPasswordHash || settingsObj.Password || settingsObj.password || "admin").trim();
  const author = String(settingsObj.authorName || username || "Faiz_Fahmi_ID").trim();
  const now = new Date().toISOString();

  // Baris ke-2: Nilai Username dan Password tepat di bawah kolom masing-masing
  sheet.appendRow([username, password, author, now]);
}

/**
 * Response JSON Standard dengan Header CORS
 */
function responseJSON(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
`;
