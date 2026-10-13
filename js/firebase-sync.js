/**
 * js/firebase-sync.js
 * Two-way real-time synchronization bridge between Local Database and Firebase Firestore
 */

const FIRESTORE_COLLECTIONS = {
  submissions: "vlab_lkpd_submissions",
  quiz_results: "vlab_quiz_results",
  game_progress: "vlab_game_progress",
  students: "vlab_students",
  classes: "vlab_classes",
  users: "vlab_users",
  roster: "vlab_student_roster"
};

let syncUnsubscribers = [];

/**
 * Initialize real-time listeners and push existing local records to Firestore
 */
async function initFirebaseSync() {
  if (!window.FIVIA_FIREBASE || !window.FIVIA_FIREBASE.db || !window.FIVIA_FIREBASE.isInitialized) {
    return;
  }

  const firestore = window.FIVIA_FIREBASE.db;
  console.log("[Firebase Sync] Memulai sinkronisasi dua arah dengan Firestore...");

  // Unsubscribe old listeners if any
  syncUnsubscribers.forEach((unsub) => {
    try { unsub(); } catch (_) {}
  });
  syncUnsubscribers = [];

  // Setup real-time listeners for critical collections
  Object.keys(FIRESTORE_COLLECTIONS).forEach((localKey) => {
    const cloudCollection = FIRESTORE_COLLECTIONS[localKey];
    
    try {
      const unsub = firestore.collection(cloudCollection).onSnapshot((snapshot) => {
        if (!snapshot || snapshot.empty) return;

        snapshot.docChanges().forEach((change) => {
          const docData = change.doc.data();
          const docId = change.doc.id;
          
          if (change.type === "added" || change.type === "modified") {
            handleCloudRecordUpdate(localKey, docId, docData);
          } else if (change.type === "removed") {
            handleCloudRecordDelete(localKey, docId);
          }
        });
      }, (err) => {
        console.warn(`[Firebase Sync] Error pada listener ${cloudCollection}:`, err);
      });

      syncUnsubscribers.push(unsub);
    } catch (e) {
      console.warn(`[Firebase Sync] Gagal mengaktifkan listener ${cloudCollection}:`, e);
    }
  });

  // Fetch full roster from cloud to ensure local cache is completely up to date
  await fetchRosterFromCloud();

  // Push local items that might not yet exist on Firestore (backfill)
  await backfillLocalToCloud();
}

/**
 * Update local storage when a cloud record changes
 */
function handleCloudRecordUpdate(localCollection, id, data) {
  const mergedItem = { ...data, id: id };

  // 1. If it's a student or user, sync across both tables and local rosters
  if (localCollection === "students" || localCollection === "users" || localCollection === "roster") {
    syncStudentRecordLocally(mergedItem);
  }

  if (typeof db !== "undefined" && typeof db.getTable === "function") {
    const tableName = (localCollection === "roster") ? "students" : localCollection;
    const localList = db.getTable(tableName) || [];
    let idx = -1;

    if (localCollection === "submissions") {
      idx = localList.findIndex((item) => 
        String(item.id) === String(id) || 
        (item.studentId && item.labId && String(item.studentId) === String(data.studentId) && String(item.labId) === String(data.labId))
      );
    } else {
      idx = localList.findIndex((item) => String(item.id) === String(id) || (item.nis && String(item.nis) === String(data.nis)));
    }

    if (idx !== -1) {
      localList[idx] = { ...localList[idx], ...mergedItem };
    } else {
      localList.push(mergedItem);
    }

    db.saveTable(tableName, localList);
  }

  // Trigger UI refresh if currently on dashboard, class management, or LKPD
  if (window.renderClassManagement && (localCollection === "students" || localCollection === "users" || localCollection === "roster")) {
    window.renderClassManagement();
  }
  if (localCollection === "submissions") {
    if (typeof window.renderSubmissionsList === 'function') window.renderSubmissionsList();
    if (typeof window.renderTeacherDashboard === 'function') window.renderTeacherDashboard();
    if (typeof window.renderPeriksaLKPDSection === 'function') window.renderPeriksaLKPDSection();
  }
}

/**
 * Sync a student record across all local storage targets
 */
function syncStudentRecordLocally(std) {
  if (!std) return;
  const sName = std.name || std.studentName || std.displayName || "Siswa";
  const sNis = String(std.nis || std.studentCode || "").trim();
  const sCode = std.studentCode || (sNis ? ('FIVIA-' + sNis) : 'STD');
  const sClass = std.className || std.classId || "cls_x1";
  const sId = std.id || std.studentId || ("usr_" + Math.random().toString(36).substr(2, 9));

  // A. Sync to fivia_student_roster
  try {
    let roster = JSON.parse(localStorage.getItem("fivia_student_roster") || "[]");
    const rIdx = roster.findIndex(r => String(r.id || r.studentId) === String(sId) || (r.nis && String(r.nis) === sNis) || (r.name && r.name.toLowerCase().trim() === sName.toLowerCase().trim()));
    const rosterObj = {
      id: sId,
      studentId: sId,
      name: sName,
      nis: sNis,
      studentCode: sCode,
      className: sClass,
      classId: sClass,
      xp: std.xp || 0
    };
    if (rIdx >= 0) {
      roster[rIdx] = { ...roster[rIdx], ...rosterObj };
    } else {
      roster.push(rosterObj);
    }
    localStorage.setItem("fivia_student_roster", JSON.stringify(roster));
  } catch(e) {}

  // B. Sync to fivia_classroom_students
  try {
    let cs = JSON.parse(localStorage.getItem("fivia_classroom_students") || "[]");
    const csIdx = cs.findIndex(c => String(c.studentId || c.id) === String(sId) || (c.nis && String(c.nis) === sNis));
    const csObj = {
      studentId: sId,
      id: sId,
      displayName: sName,
      name: sName,
      nis: sNis,
      classId: sClass
    };
    if (csIdx >= 0) {
      cs[csIdx] = { ...cs[csIdx], ...csObj };
    } else {
      cs.push(csObj);
    }
    localStorage.setItem("fivia_classroom_students", JSON.stringify(cs));
  } catch(e) {}

  // C. Sync to users table for login authentication
  if (window.db && typeof window.db.getTable === "function") {
    let users = window.db.getTable("users") || [];
    const uIdx = users.findIndex(u => String(u.id) === String(sId) || (u.nis && String(u.nis) === sNis) || (u.name && u.name.toLowerCase().trim() === sName.toLowerCase().trim()));
    const userObj = {
      id: sId,
      name: sName,
      nis: sNis,
      studentCode: sCode,
      email: std.email || `${sName.toLowerCase().replace(/[^a-z0-9]/g, '')}@sekolah.id`,
      role: "siswa",
      password: std.password || sNis || "12345",
      classId: sClass
    };
    if (uIdx >= 0) {
      users[uIdx] = { ...users[uIdx], ...userObj };
    } else {
      users.push(userObj);
    }
    window.db.saveTable("users", users);
  }
}

/**
 * Handle remote delete
 */
function handleCloudRecordDelete(localCollection, id) {
  if (typeof db === "undefined" || !db.getTable) return;
  const tableName = (localCollection === "roster") ? "students" : localCollection;
  const localList = db.getTable(tableName) || [];
  const filtered = localList.filter((item) => String(item.id) !== String(id));
  db.saveTable(tableName, filtered);
}

/**
 * Sync a single local modification (insert/update) to Firestore
 */
async function syncLocalChangeToCloud(collectionName, item) {
  if (!window.FIVIA_FIREBASE || !window.FIVIA_FIREBASE.db || !window.FIVIA_FIREBASE.isInitialized) {
    return;
  }

  const cloudCollection = FIRESTORE_COLLECTIONS[collectionName];
  if (!cloudCollection || !item || !item.id) return;

  try {
    const firestore = window.FIVIA_FIREBASE.db;
    const docRef = firestore.collection(cloudCollection).doc(String(item.id));
    
    // Clean data of undefined fields before writing
    const cleanItem = JSON.parse(JSON.stringify(item));
    cleanItem.lastSyncedAt = new Date().toISOString();

    await docRef.set(cleanItem, { merge: true });
    console.log(`[Firebase Sync] Tersimpan ke Firestore: ${cloudCollection}/${item.id}`);
  } catch (err) {
    console.warn(`[Firebase Sync] Gagal mengirim data ke cloud ${cloudCollection}:`, err);
  }
}

/**
 * Fetch entire roster and student records directly from Firestore Cloud into LocalStorage
 */
async function fetchRosterFromCloud() {
  if (!window.FIVIA_FIREBASE || !window.FIVIA_FIREBASE.db || !window.FIVIA_FIREBASE.isInitialized) {
    return false;
  }

  const firestore = window.FIVIA_FIREBASE.db;
  let count = 0;

  try {
    // 1. Fetch vlab_users (especially registered students & teachers)
    const usersSnap = await firestore.collection("vlab_users").get();
    if (!usersSnap.empty) {
      usersSnap.forEach(doc => {
        handleCloudRecordUpdate("users", doc.id, doc.data());
        count++;
      });
    }

    // 2. Fetch vlab_students
    const studentsSnap = await firestore.collection("vlab_students").get();
    if (!studentsSnap.empty) {
      studentsSnap.forEach(doc => {
        handleCloudRecordUpdate("students", doc.id, doc.data());
        count++;
      });
    }

    // 3. Fetch vlab_student_roster
    const rosterSnap = await firestore.collection("vlab_student_roster").get();
    if (!rosterSnap.empty) {
      rosterSnap.forEach(doc => {
        handleCloudRecordUpdate("roster", doc.id, doc.data());
        count++;
      });
    }

    // 4. Fetch vlab_classes
    const classSnap = await firestore.collection("vlab_classes").get();
    if (!classSnap.empty) {
      classSnap.forEach(doc => {
        handleCloudRecordUpdate("classes", doc.id, doc.data());
      });
    }

    // 5. Fetch vlab_lkpd_submissions (Student LKPD Answers)
    try {
      const subsSnap = await firestore.collection("vlab_lkpd_submissions").get();
      if (!subsSnap.empty) {
        let subsCount = 0;
        subsSnap.forEach(doc => {
          handleCloudRecordUpdate("submissions", doc.id, doc.data());
          subsCount++;
        });
        console.log(`[Firebase Sync] Berhasil memuat ${subsCount} jawaban LKPD siswa dari Cloud!`);
      }
    } catch (errSubs) {
      console.warn("[Firebase Sync] Gagal memuat submissions LKPD dari cloud:", errSubs);
    }

    console.log(`[Firebase Sync] Berhasil memuat ${count} data siswa dari Cloud!`);
    return { success: true, count };
  } catch (err) {
    console.warn("[Firebase Sync] Gagal memuat data dari cloud:", err);
    return { success: false, error: err.message };
  }
}

/**
 * Push all local data (students, roster, users, classes) to Firestore Cloud
 */
async function syncAllRosterToCloud() {
  if (!window.FIVIA_FIREBASE || !window.FIVIA_FIREBASE.db || !window.FIVIA_FIREBASE.isInitialized) {
    return { success: false, message: "Firebase belum terhubung. Periksa konfigurasi di menu Cloud DB." };
  }

  const firestore = window.FIVIA_FIREBASE.db;
  let uploaded = 0;

  try {
    // 1. Upload students table
    const students = (window.db && window.db.getTable("students")) || [];
    for (const s of students) {
      if (s && (s.id || s.nis)) {
        const docId = String(s.id || ('std_' + s.nis));
        await firestore.collection("vlab_students").doc(docId).set(JSON.parse(JSON.stringify(s)), { merge: true });
        uploaded++;
      }
    }

    // 2. Upload users table (students and teachers)
    const users = (window.db && window.db.getTable("users")) || [];
    for (const u of users) {
      if (u && (u.id || u.email || u.nis)) {
        const docId = String(u.id || ('usr_' + (u.nis || u.email)));
        await firestore.collection("vlab_users").doc(docId).set(JSON.parse(JSON.stringify(u)), { merge: true });
        uploaded++;
      }
    }

    // 3. Upload fivia_student_roster
    let roster = [];
    try {
      roster = JSON.parse(localStorage.getItem("fivia_student_roster") || "[]");
    } catch(e) {}
    for (const r of roster) {
      if (r && (r.studentId || r.id || r.nis)) {
        const docId = String(r.studentId || r.id || ('ros_' + r.nis));
        await firestore.collection("vlab_student_roster").doc(docId).set(JSON.parse(JSON.stringify(r)), { merge: true });
        uploaded++;
      }
    }

    // 4. Upload classes
    const classes = (window.db && window.db.getTable("classes")) || [];
    for (const c of classes) {
      if (c && c.id) {
        await firestore.collection("vlab_classes").doc(String(c.id)).set(JSON.parse(JSON.stringify(c)), { merge: true });
      }
    }

    // 5. Upload LKPD Submissions
    const submissions = (window.db && window.db.getTable("submissions")) || [];
    for (const sub of submissions) {
      if (sub && (sub.id || sub.studentId)) {
        const docId = String(sub.id || `sub_${sub.studentId}_${sub.labId}`);
        await firestore.collection("vlab_lkpd_submissions").doc(docId).set(JSON.parse(JSON.stringify(sub)), { merge: true });
      }
    }

    return { success: true, count: uploaded };
  } catch (err) {
    console.error("[Firebase Sync] Gagal mengunggah seluruh roster ke cloud:", err);
    return { success: false, error: err.message };
  }
}

/**
 * Push all local items that might not yet exist on Firestore
 */
async function backfillLocalToCloud() {
  if (!window.FIVIA_FIREBASE || !window.FIVIA_FIREBASE.db || !window.FIVIA_FIREBASE.isInitialized) return;

  const collections = ["students", "classes", "users", "submissions"];
  for (const col of collections) {
    const items = (typeof db !== "undefined" && db.getTable) ? (db.getTable(col) || []) : [];
    for (const item of items) {
      if (item && (item.id || item.studentId)) {
        const syncItem = { ...item, id: item.id || `sub_${item.studentId}_${item.labId}` };
        await syncLocalChangeToCloud(col, syncItem);
      }
    }
  }
}

/**
 * Explicit helper to fetch LKPD submissions on demand
 */
async function fetchLKPDSubmissionsFromCloud() {
  if (!window.FIVIA_FIREBASE || !window.FIVIA_FIREBASE.db || !window.FIVIA_FIREBASE.isInitialized) {
    if (window.showToast) window.showToast("Memuat dari database lokal (Firebase belum terhubung).", "info");
    if (window.renderTeacherDashboard) window.renderTeacherDashboard();
    if (window.renderPeriksaLKPDSection) window.renderPeriksaLKPDSection();
    return false;
  }
  try {
    const firestore = window.FIVIA_FIREBASE.db;
    const subsSnap = await firestore.collection("vlab_lkpd_submissions").get();
    let count = 0;
    if (!subsSnap.empty) {
      subsSnap.forEach(doc => {
        handleCloudRecordUpdate("submissions", doc.id, doc.data());
        count++;
      });
    }
    if (window.showToast) window.showToast(`Berhasil menyinkronkan ${count} lembar kerja LKPD dari Cloud!`, "success");
    if (window.renderTeacherDashboard) window.renderTeacherDashboard();
    if (window.renderPeriksaLKPDSection) window.renderPeriksaLKPDSection();
    return true;
  } catch (err) {
    console.warn("Gagal menyinkronkan LKPD dari Cloud:", err);
    if (window.showToast) window.showToast("Gagal menarik data dari Cloud: " + err.message, "danger");
    return false;
  }
}

// Export to window
window.initFirebaseSync = initFirebaseSync;
window.syncLocalChangeToCloud = syncLocalChangeToCloud;
window.syncLocalDeleteToCloud = syncLocalDeleteToCloud;
window.backfillLocalToCloud = backfillLocalToCloud;
window.fetchRosterFromCloud = fetchRosterFromCloud;
window.syncAllRosterToCloud = syncAllRosterToCloud;
window.fetchLKPDSubmissionsFromCloud = fetchLKPDSubmissionsFromCloud;
