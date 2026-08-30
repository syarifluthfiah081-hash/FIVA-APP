/**
 * FIVIA PHYSICS QUEST - PHASE 10: EXCEL STUDENT IMPORT SYSTEM
 * Handles Excel (.xlsx, .xls) and CSV parsing, header normalization,
 * NIS string preservation, duplicate detection, stable studentCode generation,
 * batch import to LocalStorage & Firestore, template download, and student card printing.
 */

window.FIVIAExcelImport = (function() {
  'use strict';

  const ROSTER_STORAGE_KEY = 'fivia_student_roster';
  const CLASSROOMS_STORAGE_KEY = 'fivia_classrooms';

  /**
   * Helper to normalize class string to standard class code ID (e.g. "X.F.1" -> "XF1", "X-1" -> "X1")
   */
  function normalizeClassCode(className) {
    if (!className) return 'X1';
    return String(className).toUpperCase().replace(/[^A-Z0-9]/g, '');
  }

  /**
   * Generates a unique, stable Student Code: FIVIA-[CLASS_CODE]-[NIS]
   * Example: NIS "001", Class "X.F.1" -> "FIVIA-XF1-001"
   */
  function generateStudentCode(nis, className) {
    const cleanNis = String(nis || '').trim();
    const classCode = normalizeClassCode(className);
    return `FIVIA-${classCode}-${cleanNis}`;
  }

  /**
   * Sanitizes NIS to string, ensuring leading zeros are preserved (e.g. "001")
   */
  function sanitizeNis(rawNis) {
    if (rawNis === undefined || rawNis === null) return '';
    return String(rawNis).trim();
  }

  /**
   * Header Normalization:
   * Case-insensitive check for NAMA, NIS, KELAS
   */
  function validateAndNormalizeHeaders(rawHeaders) {
    if (!Array.isArray(rawHeaders) || rawHeaders.length === 0) {
      return { valid: false, message: 'Header file Excel kosong atau tidak terbaca.' };
    }

    const headerMap = {};
    rawHeaders.forEach((h, idx) => {
      if (!h) return;
      const cleanHeader = String(h).trim().toUpperCase();
      if (['NAMA', 'NAME', 'NAMA SISWA', 'NAMA LENGKAP'].includes(cleanHeader)) {
        headerMap['NAMA'] = idx;
      } else if (['NIS', 'NISN', 'NOMOR INDUK', 'NO INDUK'].includes(cleanHeader)) {
        headerMap['NIS'] = idx;
      } else if (['KELAS', 'CLASS', 'KELAS SISWA', 'TINGKAT'].includes(cleanHeader)) {
        headerMap['KELAS'] = idx;
      }
    });

    const hasName = headerMap.hasOwnProperty('NAMA');
    const hasNis = headerMap.hasOwnProperty('NIS');
    const hasClass = headerMap.hasOwnProperty('KELAS');

    if (!hasName || !hasNis || !hasClass) {
      return {
        valid: false,
        message: '❌ FORMAT EXCEL TIDAK SESUAI\n\nFormat kolom wajib:\nNAMA | NIS | KELAS\n\nPastikan file memiliki 3 kolom utama ini.',
        headerMap: null
      };
    }

    return { valid: true, headerMap: headerMap };
  }

  /**
   * Parse CSV content directly (Offline Fallback parser)
   */
  function parseCSVContent(csvText) {
    const lines = csvText.split(/\r\n|\n/).filter(line => line.trim().length > 0);
    if (lines.length === 0) return [];
    
    return lines.map(line => {
      const matches = line.split(/;|,/).map(cell => cell.trim().replace(/^"|"$/g, ''));
      return matches;
    });
  }

  /**
   * Parses Excel file (.xlsx, .xls) or CSV file asynchronously
   */
  function parseFile(file) {
    return new Promise((resolve, reject) => {
      const fileName = file.name || '';
      const ext = fileName.split('.').pop().toLowerCase();

      if (ext === 'csv') {
        const reader = new FileReader();
        reader.onload = function(e) {
          try {
            const rawRows = parseCSVContent(e.target.result);
            resolve(rawRows);
          } catch (err) {
            reject(new Error('Gagal membaca file CSV: ' + err.message));
          }
        };
        reader.onerror = () => reject(new Error('Gagal membaca file.'));
        reader.readAsText(file);
      } else {
        // Use XLSX (SheetJS)
        if (typeof XLSX === 'undefined') {
          reject(new Error('Library XLSX belum dimuat. Mohon periksa koneksi internet Anda.'));
          return;
        }

        const reader = new FileReader();
        reader.onload = function(e) {
          try {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array', cellDates: false, raw: true });
            const firstSheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[firstSheetName];
            
            // Raw 2D array output to preserve leading zeros in NIS strings
            const rawRows = XLSX.utils.sheet_to_json(worksheet, { header: 1, raw: true });
            resolve(rawRows);
          } catch (err) {
            reject(new Error('Gagal membaca file Excel: ' + err.message));
          }
        };
        reader.onerror = () => reject(new Error('Gagal membaca file.'));
        reader.readAsArrayBuffer(file);
      }
    });
  }

  /**
   * Retrieves existing student roster from LocalStorage
   */
  function getExistingRoster() {
    try {
      const data = localStorage.getItem(ROSTER_STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('Failed to read existing roster:', e);
      return [];
    }
  }

  /**
   * Saves updated roster to LocalStorage and triggers Firebase sync if online
   */
  function saveRoster(rosterList) {
    try {
      localStorage.setItem(ROSTER_STORAGE_KEY, JSON.stringify(rosterList));
      
      // Also sync to active student profile if active student matches
      const activeProfile = window.FIVIAStudent ? window.FIVIAStudent.getStudentProfile() : null;
      if (activeProfile && activeProfile.studentCode) {
        const match = rosterList.find(s => s.studentCode === activeProfile.studentCode);
        if (match && window.FIVIAStudent) {
          window.FIVIAStudent.saveStudentProfile(match);
        }
      }

      // Sync to Firebase Firestore if available
      syncRosterToFirebase(rosterList);
      return true;
    } catch (e) {
      console.error('Failed to save roster:', e);
      return false;
    }
  }

  /**
   * Syncs roster array to Firebase Firestore collection 'students'
   */
  async function syncRosterToFirebase(rosterList) {
    if (!window.FIVIA_FIREBASE || !window.FIVIA_FIREBASE.isConnected || !window.FIVIA_FIREBASE.db) {
      console.log('[FIVIA Excel Import] Offline mode / Firebase not connected. Queued locally.');
      return;
    }

    try {
      const db = window.FIVIA_FIREBASE.db;
      const batch = db.batch();
      
      rosterList.forEach(student => {
        const docRef = db.collection('students').doc(student.studentId);
        batch.set(docRef, { ...student, updatedAt: firebase.firestore.FieldValue.serverTimestamp() }, { merge: true });
      });

      await batch.commit();
      console.log('[FIVIA Excel Import] Synced ' + rosterList.length + ' students to Firestore successfully!');
    } catch (err) {
      console.warn('[FIVIA Excel Import] Firestore batch sync failed:', err);
    }
  }

  /**
   * Processes raw Excel rows into structured validated student objects
   */
  function processRows(rawRows) {
    if (!Array.isArray(rawRows) || rawRows.length < 2) {
      return {
        valid: false,
        error: 'File Excel tidak berisi data siswa (minimal 1 baris header dan 1 baris data).'
      };
    }

    const rawHeaders = rawRows[0];
    const headerCheck = validateAndNormalizeHeaders(rawHeaders);
    if (!headerCheck.valid) {
      return { valid: false, error: headerCheck.message };
    }

    const { NAMA: nameIdx, NIS: nisIdx, KELAS: classIdx } = headerCheck.headerMap;
    const existingRoster = getExistingRoster();

    // Map existing composite keys (NIS + KELAS)
    const existingMap = new Map();
    existingRoster.forEach(s => {
      const key = `${sanitizeNis(s.nis)}_${normalizeClassCode(s.className)}`;
      existingMap.set(key, s);
    });

    const parsedData = [];
    let validCount = 0;
    let duplicateCount = 0;
    let invalidCount = 0;

    for (let i = 1; i < rawRows.length; i++) {
      const row = rawRows[i];
      if (!row || row.length === 0) continue;

      const rawName = row[nameIdx];
      const rawNis = row[nisIdx];
      const rawClass = row[classIdx];

      const name = String(rawName || '').trim();
      const nis = sanitizeNis(rawNis);
      const className = String(rawClass || '').trim();

      const rowNum = i + 1;

      // Validation Rules
      let isValid = true;
      const issues = [];

      if (!name || name.length < 2) {
        isValid = false;
        issues.push('Nama wajib diisi (minimal 2 karakter)');
      }
      if (!nis) {
        isValid = false;
        issues.push('NIS wajib diisi');
      }
      if (!className) {
        isValid = false;
        issues.push('Kelas wajib diisi');
      }

      if (!isValid) {
        invalidCount++;
        parsedData.push({
          rowNum,
          name: name || '-',
          nis: nis || '-',
          className: className || '-',
          studentCode: '-',
          status: 'INVALID',
          issue: issues.join(', ')
        });
        continue;
      }

      const compositeKey = `${nis}_${normalizeClassCode(className)}`;
      const existingStudent = existingMap.get(compositeKey);
      const studentCode = existingStudent ? existingStudent.studentCode : generateStudentCode(nis, className);

      if (existingStudent) {
        duplicateCount++;
        parsedData.push({
          rowNum,
          studentId: existingStudent.studentId,
          studentCode,
          name,
          nis,
          className,
          classId: normalizeClassCode(className),
          status: 'DUPLICATE',
          issue: 'Siswa dengan NIS & Kelas ini sudah terdaftar',
          existingData: existingStudent
        });
      } else {
        validCount++;
        parsedData.push({
          rowNum,
          studentId: 'STD-' + Date.now().toString(36) + Math.random().toString(36).substr(2, 5).toUpperCase(),
          studentCode,
          name,
          nis,
          className,
          classId: normalizeClassCode(className),
          status: 'READY',
          issue: null
        });
      }
    }

    return {
      valid: true,
      totalRows: rawRows.length - 1,
      validCount,
      duplicateCount,
      invalidCount,
      parsedData
    };
  }

  /**
   * Executes the import of parsed data into system database
   * duplicateMode: 'SKIP' (default) or 'UPDATE'
   */
  function executeImport(parsedData, duplicateMode = 'SKIP') {
    const existingRoster = getExistingRoster();
    const rosterMap = new Map(existingRoster.map(s => [s.studentId, s]));

    let importedCount = 0;
    let skippedCount = 0;
    let updatedCount = 0;

    const now = new Date().toISOString();

    parsedData.forEach(item => {
      if (item.status === 'INVALID') {
        skippedCount++;
        return;
      }

      if (item.status === 'DUPLICATE') {
        if (duplicateMode === 'UPDATE') {
          const existing = rosterMap.get(item.studentId);
          if (existing) {
            // Update identity details ONLY. PRESERVE ALL PROGRESS & XP & BADGES!
            rosterMap.set(item.studentId, {
              ...existing,
              name: item.name,
              nis: item.nis,
              className: item.className,
              classId: item.classId,
              updatedAt: now
            });
            updatedCount++;
          }
        } else {
          skippedCount++;
        }
        return;
      }

      if (item.status === 'READY') {
        // Create new student entry with default zeroed progress
        const newStudent = {
          studentId: item.studentId,
          studentCode: item.studentCode,
          name: item.name,
          nis: item.nis,
          classId: item.classId,
          className: item.className,
          createdAt: now,
          updatedAt: now,
          status: 'ACTIVE',
          xp: 0,
          level: 1,
          totalGameScore: 0,
          assessmentScore: 0,
          accuracy: 0,
          masteryLevel: 'DEVELOPING',
          masteryLabel: 'DEVELOPING — Sedang Berkembang',
          badges: [],
          levelsCompleted: { level1: false, level2: false, level3: false, level4: false, level5: false },
          questProgress: { completedLevels: [] },
          labProgress: { completedLabs: [] },
          projectProgress: { completedProjects: [] },
          assessmentProgress: { completed: false, score: 0 }
        };

        rosterMap.set(item.studentId, newStudent);
        importedCount++;
      }
    });

    const updatedRosterList = Array.from(rosterMap.values());
    saveRoster(updatedRosterList);

    // Auto-associate students with active classroom matching their className
    autoAssignToClassrooms(updatedRosterList);

    return {
      success: true,
      totalImported: importedCount + updatedCount,
      newAdded: importedCount,
      updated: updatedCount,
      skipped: skippedCount,
      totalInRoster: updatedRosterList.length
    };
  }

  /**
   * Automatically groups students into class structures in LocalStorage (fivia_classrooms)
   */
  function autoAssignToClassrooms(rosterList) {
    try {
      const rawClassrooms = localStorage.getItem(CLASSROOMS_STORAGE_KEY);
      let classrooms = rawClassrooms ? JSON.parse(rawClassrooms) : [];

      const classMap = new Map();
      classrooms.forEach(c => classMap.set(c.id || normalizeClassCode(c.name), c));

      // Group students by classId
      const grouped = {};
      rosterList.forEach(s => {
        const cId = s.classId || 'X1';
        if (!grouped[cId]) grouped[cId] = [];
        grouped[cId].push(s);
      });

      Object.keys(grouped).forEach(cId => {
        const classStudents = grouped[cId];
        const sampleName = classStudents[0].className || (`Kelas ` + cId);
        
        if (!classMap.has(cId)) {
          classMap.set(cId, {
            id: cId,
            name: sampleName,
            teacherId: 'usr_guru',
            createdAt: new Date().toISOString(),
            studentCount: classStudents.length
          });
        } else {
          const cls = classMap.get(cId);
          cls.studentCount = classStudents.length;
          classMap.set(cId, cls);
        }
      });

      localStorage.setItem(CLASSROOMS_STORAGE_KEY, JSON.stringify(Array.from(classMap.values())));
    } catch (e) {
      console.error('Auto-assign classrooms failed:', e);
    }
  }

  /**
   * Downloads official Microsoft Excel (.xlsx) template with mandatory columns: NAMA, NIS, KELAS
   */
  function downloadExcelTemplate() {
    const templateData = [
      { NAMA: "Ahmad Fauzan", NIS: "001", KELAS: "X.F.1" },
      { NAMA: "Siti Rahma", NIS: "002", KELAS: "X.F.1" },
      { NAMA: "Budi Santoso", NIS: "003", KELAS: "X.F.1" },
      { NAMA: "Dinda Putri", NIS: "004", KELAS: "X.F.1" },
      { NAMA: "Eko Prasetyo", NIS: "005", KELAS: "X.F.1" }
    ];

    if (window.XLSX && window.XLSX.utils && window.XLSX.writeFile) {
      try {
        const ws = window.XLSX.utils.json_to_sheet(templateData);
        const wb = window.XLSX.utils.book_new();
        window.XLSX.utils.book_append_sheet(wb, ws, "Template Siswa");
        window.XLSX.writeFile(wb, "Template_Import_Siswa_FIVIA.xlsx");
        return;
      } catch (err) {
        console.warn("SheetJS export failed, falling back to blob CSV:", err);
      }
    }

    // Fallback if XLSX CDN is unavailable
    const csvContent = "NAMA,NIS,KELAS\nAhmad Fauzan,001,X.F.1\nSiti Rahma,002,X.F.1\nBudi Santoso,003,X.F.1\n";
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'Template_Import_Siswa_FIVIA.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  /**
   * Opens Print-ready Student Access Cards Modal / Print Window
   */
  function printStudentCards(studentList) {
    const list = studentList || getExistingRoster();
    if (!list || list.length === 0) {
      alert('⚠️ Belum ada data siswa untuk dicetak.');
      return;
    }

    const printWin = window.open('', '_blank');
    if (!printWin) {
      alert('⚠️ Mohon izinkan popup window pada browser Anda untuk mencetak kartu siswa.');
      return;
    }

    const cardsHtml = list.map(student => `
      <div style="width: 320px; border: 2.5px solid #0f2d59; border-radius: 16px; padding: 18px; background: #ffffff; color: #0f172a; font-family: 'Poppins', sans-serif; box-sizing: border-box; display: flex; flex-direction: column; justify-content: space-between; position: relative; page-break-inside: avoid; margin: 8px;">
        <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 2px solid #f97316; padding-bottom: 8px; margin-bottom: 12px;">
          <div>
            <div style="font-weight: 900; font-size: 1.1rem; color: #0f2d59; letter-spacing: 1px;">FIVIA PHYSICS QUEST</div>
            <div style="font-size: 0.7rem; color: #f97316; font-weight: 700;">FISIKA VIRTUAL APLIKATIF</div>
          </div>
          <div style="font-size: 1.5rem;">👨‍🎓</div>
        </div>

        <div style="display: flex; gap: 12px; align-items: center;">
          <div style="flex: 1;">
            <div style="font-size: 0.65rem; color: #64748b; font-weight: 700; text-transform: uppercase;">NAMA SISWA</div>
            <div style="font-size: 1rem; font-weight: 800; color: #0f172a; margin-bottom: 6px; word-break: break-word;">${student.name}</div>

            <div style="display: flex; gap: 12px; margin-bottom: 6px;">
              <div>
                <div style="font-size: 0.65rem; color: #64748b; font-weight: 700;">NIS</div>
                <div style="font-size: 0.85rem; font-weight: 800; color: #0f2d59;">${student.nis}</div>
              </div>
              <div>
                <div style="font-size: 0.65rem; color: #64748b; font-weight: 700;">KELAS</div>
                <div style="font-size: 0.85rem; font-weight: 800; color: #0f2d59;">${student.className}</div>
              </div>
            </div>

            <div style="font-size: 0.65rem; color: #64748b; font-weight: 700;">STUDENT CODE (KODE AKSES)</div>
            <div style="font-size: 0.9rem; font-weight: 900; color: #f97316; font-family: monospace; letter-spacing: 0.5px;">${student.studentCode}</div>
          </div>

          <div style="width: 70px; height: 70px; border: 1.5px solid #cbd5e1; border-radius: 8px; display: flex; flex-direction: column; align-items: center; justify-content: center; background: #f8fafc; padding: 4px; text-align: center;">
            <svg viewBox="0 0 100 100" width="55" height="55">
              <path d="M0,0 h30 v30 h-30 z M40,0 h20 v10 h-20 z M70,0 h30 v30 h-30 z M0,40 h10 v20 h-10 z M30,30 h40 v40 h-40 z M80,40 h20 v20 h-20 z M0,70 h30 v30 h-30 z M40,80 h30 v20 h-30 z M80,80 h20 v20 h-20 z" fill="#0f2d59" />
            </svg>
            <span style="font-size: 0.55rem; color: #64748b; font-weight: 700; margin-top: 2px;">SCAN AKSES</span>
          </div>
        </div>

        <div style="margin-top: 12px; padding-top: 6px; border-top: 1px dashed #cbd5e1; text-align: center; font-size: 0.65rem; color: #64748b;">
          Gunakan NIS &amp; Kode Kelas untuk Login ke <strong>FIVIA Physics Quest</strong>
        </div>
      </div>
    `).join('');

    printWin.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>KARTU AKSES SISWA - FIVIA PHYSICS QUEST</title>
        <style>
          body { font-family: sans-serif; background: #f1f5f9; padding: 20px; }
          .grid { display: flex; flex-wrap: wrap; gap: 16px; justify-content: center; }
          @media print {
            body { background: #fff; padding: 0; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="no-print" style="text-align: center; margin-bottom: 20px;">
          <button onclick="window.print()" style="padding: 10px 24px; font-size: 1rem; font-weight: bold; background: #0f2d59; color: white; border: none; border-radius: 8px; cursor: pointer;">🖨️ CETAK KARTU SISWA</button>
        </div>
        <div class="grid">${cardsHtml}</div>
      </body>
      </html>
    `);
    printWin.document.close();
  }

  return {
    parseFile,
    processRows,
    executeImport,
    getExistingRoster,
    saveRoster,
    generateStudentCode,
    downloadExcelTemplate,
    printStudentCards,
    sanitizeNis,
    normalizeClassCode
  };

})();
