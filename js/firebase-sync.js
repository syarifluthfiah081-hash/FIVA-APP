/**
 * js/firebase-sync.js
 * Two-way real-time synchronization bridge between Local Database and Firebase Firestore
 */

const FIRESTORE_COLLECTIONS = {
  submissions: "vlab_lkpd_submissions",
  quizScores: "vlab_quiz_results",
  quiz_results: "vlab_quiz_results",
  detektifProgress: "vlab_game_progress",
  game_progress: "vlab_game_progress",
  students: "vlab_students",
  classes: "vlab_classes",
  users: "vlab_users",
  roster: "vlab_student_roster",
  teachers: "vlab_teachers",
  servers: "vlab_servers"
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
        if (err && (err.code === "permission-denied" || String(err).includes("permission") || String(err).includes("Missing or insufficient permissions"))) {
          if (window.FIVIA_FIREBASE) window.FIVIA_FIREBASE.permissionDenied = true;
          const permAlert = document.getElementById("firestore-permission-alert");
          if (permAlert) permAlert.style.display = "block";
        }
      });

      syncUnsubscribers.push(unsub);
    } catch (e) {
      console.warn(`[Firebase Sync] Gagal mengaktifkan listener ${cloudCollection}:`, e);
    }
  });

  // 1. Pastikan akun guru Pak Syarif Hidayatullah dan status Server terdaftar di Firebase
  await ensureTeacherRegisteredInFirebase();

  // 2. Fetch full roster from cloud to ensure local cache is completely up to date
  await fetchRosterFromCloud();

  // 3. Push local items that might not yet exist on Firestore (backfill)
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
 * REST API Helper: Parse Firestore document format to JavaScript object
 */
function parseFirestoreRESTDoc(doc) {
  if (!doc) return null;
  const id = doc.name ? doc.name.split("/").pop() : "";
  const fields = doc.fields || {};
  const res = { id };
  for (const [k, v] of Object.entries(fields)) {
    if (v.stringValue !== undefined) res[k] = v.stringValue;
    else if (v.integerValue !== undefined) res[k] = parseInt(v.integerValue, 10);
    else if (v.doubleValue !== undefined) res[k] = parseFloat(v.doubleValue);
    else if (v.booleanValue !== undefined) res[k] = v.booleanValue;
    else if (v.arrayValue !== undefined) {
      res[k] = (v.arrayValue.values || []).map(item => {
        if (item.stringValue !== undefined) return item.stringValue;
        if (item.mapValue !== undefined) return parseFirestoreRESTDoc({ fields: item.mapValue.fields });
        return item;
      });
    } else if (v.mapValue !== undefined) {
      res[k] = parseFirestoreRESTDoc({ fields: v.mapValue.fields });
    }
  }
  return res;
}

/**
 * REST API Helper: Convert JavaScript object to Firestore REST fields
 */
function toFirestoreRESTFields(obj) {
  const fields = {};
  for (const [k, v] of Object.entries(obj)) {
    if (v === null || v === undefined) continue;
    if (typeof v === "string") fields[k] = { stringValue: v };
    else if (typeof v === "boolean") fields[k] = { booleanValue: v };
    else if (typeof v === "number") {
      if (Number.isInteger(v)) fields[k] = { integerValue: String(v) };
      else fields[k] = { doubleValue: v };
    } else if (Array.isArray(v)) {
      fields[k] = {
        arrayValue: {
          values: v.map(item => {
            if (typeof item === "object" && item !== null) return { mapValue: { fields: toFirestoreRESTFields(item) } };
            return { stringValue: String(item) };
          })
        }
      };
    } else if (typeof v === "object") {
      fields[k] = { mapValue: { fields: toFirestoreRESTFields(v) } };
    }
  }
  return fields;
}

/**
 * Direct REST API fetcher that completely bypasses SDK WebChannel & IndexedDB bugs
 */
async function fetchCollectionFromFirestoreREST(collectionName) {
  try {
    const url = `https://firestore.googleapis.com/v1/projects/fiva-app/databases/(default)/documents/${collectionName}?pageSize=100`;
    const resp = await fetch(url);
    if (!resp.ok) {
      console.warn(`[Firestore REST] HTTP error: ${resp.status}`);
      return [];
    }
    const json = await resp.json();
    return (json.documents || []).map(parseFirestoreRESTDoc);
  } catch (err) {
    console.warn(`[Firestore REST] Fetch failed for ${collectionName}:`, err);
    return [];
  }
}

/**
 * Direct REST API writer
 */
async function writeDocToFirestoreREST(collectionName, docId, data) {
  try {
    const url = `https://firestore.googleapis.com/v1/projects/fiva-app/databases/(default)/documents/${collectionName}/${docId}`;
    const fields = toFirestoreRESTFields(data);
    const resp = await fetch(url, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fields })
    });
    return resp.ok;
  } catch (err) {
    console.warn(`[Firestore REST] Write failed for ${collectionName}/${docId}:`, err);
    return false;
  }
}

/**
 * Sync a single local modification (insert/update) to Firestore (SDK + REST Fallback)
 */
async function syncLocalChangeToCloud(collectionName, item) {
  const cloudCollection = FIRESTORE_COLLECTIONS[collectionName];
  if (!cloudCollection || !item || !item.id) return;

  const cleanItem = JSON.parse(JSON.stringify(item));
  cleanItem.lastSyncedAt = new Date().toISOString();

  let written = false;

  // 1. Try SDK first
  if (window.FIVIA_FIREBASE && window.FIVIA_FIREBASE.db && window.FIVIA_FIREBASE.isInitialized) {
    try {
      const firestore = window.FIVIA_FIREBASE.db;
      const docRef = firestore.collection(cloudCollection).doc(String(item.id));
      await docRef.set(cleanItem, { merge: true });
      written = true;
      console.log(`[Firebase Sync] Tersimpan ke Firestore: ${cloudCollection}/${item.id}`);
    } catch (err) {
      console.warn(`[Firebase Sync] SDK write failed, using REST fallback:`, err);
    }
  }

  // 2. Ultra-reliable REST Fallback
  if (!written) {
    written = await writeDocToFirestoreREST(cloudCollection, String(item.id), cleanItem);
    if (written) {
      console.log(`[Firebase Sync] Tersimpan via REST: ${cloudCollection}/${item.id}`);
    }
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

    // 6. Fetch vlab_quiz_results (Student Quiz Results)
    try {
      const quizSnap = await firestore.collection("vlab_quiz_results").get();
      if (!quizSnap.empty) {
        let quizCount = 0;
        quizSnap.forEach(doc => {
          handleCloudRecordUpdate("quizScores", doc.id, doc.data());
          quizCount++;
        });
        console.log(`[Firebase Sync] Berhasil memuat ${quizCount} hasil kuis siswa dari Cloud!`);
      }
    } catch (errQuiz) {
      console.warn("[Firebase Sync] Gagal memuat quiz results dari cloud:", errQuiz);
    }

    console.log(`[Firebase Sync] Berhasil memuat ${count} data siswa dari Cloud!`);
    return { success: true, count };
  } catch (err) {
    console.warn("[Firebase Sync] SDK fetch error, attempting direct REST API fallback:", err);
    try {
      const restUsers = await fetchCollectionFromFirestoreREST("vlab_users");
      restUsers.forEach(doc => { handleCloudRecordUpdate("users", doc.id, doc); count++; });

      const restStudents = await fetchCollectionFromFirestoreREST("vlab_students");
      restStudents.forEach(doc => { handleCloudRecordUpdate("students", doc.id, doc); count++; });

      const restSubs = await fetchCollectionFromFirestoreREST("vlab_lkpd_submissions");
      restSubs.forEach(doc => { handleCloudRecordUpdate("submissions", doc.id, doc); });

      const restQuiz = await fetchCollectionFromFirestoreREST("vlab_quiz_results");
      restQuiz.forEach(doc => { handleCloudRecordUpdate("quizScores", doc.id, doc); });

      console.log(`[Firebase Sync] Berhasil memuat ${count} data dari Cloud via REST API!`);
      return { success: true, count };
    } catch (restErr) {
      console.warn("[Firebase Sync] REST fallback also failed:", restErr);
      return { success: false, error: err.message };
    }
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
  let count = 0;
  let succeeded = false;

  // 1. Try Firestore SDK first if initialized
  if (window.FIVIA_FIREBASE && window.FIVIA_FIREBASE.db && window.FIVIA_FIREBASE.isInitialized) {
    try {
      const firestore = window.FIVIA_FIREBASE.db;
      const subsSnap = await Promise.race([
        firestore.collection("vlab_lkpd_submissions").get(),
        new Promise((_, rej) => setTimeout(() => rej(new Error("Timeout")), 2000))
      ]);
      if (subsSnap && !subsSnap.empty) {
        subsSnap.forEach(doc => {
          handleCloudRecordUpdate("submissions", doc.id, doc.data());
          count++;
        });
      }
      succeeded = true;
    } catch (sdkErr) {
      console.warn("[Firebase Sync] SDK fetch failed, falling back to direct REST API:", sdkErr);
    }
  }

  // 2. Ultra-reliable REST API Fallback (Guaranteed to bypass SDK IndexedDB & WebChannel issues)
  if (!succeeded) {
    try {
      const restDocs = await fetchCollectionFromFirestoreREST("vlab_lkpd_submissions");
      if (restDocs && Array.isArray(restDocs)) {
        restDocs.forEach(doc => {
          if (doc && doc.id) {
            handleCloudRecordUpdate("submissions", doc.id, doc);
            count++;
          }
        });
        succeeded = true;
      }
    } catch (restErr) {
      console.warn("[Firebase Sync] REST API fallback error:", restErr);
    }
  }

  if (succeeded) {
    if (window.showToast) {
      if (count > 0) {
        window.showToast(`Berhasil menyinkronkan ${count} lembar kerja LKPD dari Cloud Server!`, "success");
      } else {
        window.showToast("Sinkronisasi Cloud berhasil! (Belum ada lembar kerja baru yang dikirim)", "info");
      }
    }
    if (window.renderTeacherDashboard) window.renderTeacherDashboard();
    if (window.renderPeriksaLKPDSection) window.renderPeriksaLKPDSection();
    return true;
  } else {
    if (window.showToast) window.showToast("Memuat dari database lokal (Cloud belum dapat diakses).", "info");
    if (window.renderTeacherDashboard) window.renderTeacherDashboard();
    if (window.renderPeriksaLKPDSection) window.renderPeriksaLKPDSection();
    return false;
  }
}

/**
 * Memastikan akun Guru Pak Syarif Hidayatullah dan status Server terdaftar di Firebase Firestore
 */
async function ensureTeacherRegisteredInFirebase() {
  if (!window.FIVIA_FIREBASE || !window.FIVIA_FIREBASE.db || !window.FIVIA_FIREBASE.isInitialized) {
    return false;
  }
  const firestore = window.FIVIA_FIREBASE.db;

  const teacherData = {
    id: "usr_guru_syarif",
    name: "Syarif Hidayatullah",
    email: "syarifhidayatullah64@guru.sma.belajar.id",
    role: "guru",
    password: "Syarif121220",
    school: "SMA Negeri",
    subject: "Fisika",
    serverId: "srv_syarif_fivia",
    serverName: "Server Guru Fisika SMA (Host: Pak Syarif)",
    isServerHost: true,
    mode: "server",
    status: "active",
    lastSyncedAt: new Date().toISOString()
  };

  const serverDoc = {
    serverId: "srv_syarif_fivia",
    serverName: "Server Guru Fisika SMA (Host: Pak Syarif)",
    teacherId: "usr_guru_syarif",
    teacherName: "Syarif Hidayatullah",
    teacherEmail: "syarifhidayatullah64@guru.sma.belajar.id",
    status: "online",
    storageMode: "server",
    description: "Database Server Terpusat Guru Fisika",
    updatedAt: new Date().toISOString()
  };

  try {
    if (firestore) {
      await firestore.collection("vlab_users").doc("usr_guru_syarif").set(teacherData, { merge: true });
      await firestore.collection("vlab_teachers").doc("usr_guru_syarif").set(teacherData, { merge: true });
      await firestore.collection("vlab_servers").doc("srv_syarif_fivia").set(serverDoc, { merge: true });
      console.log("[Firebase] Akun Guru & Server Pak Syarif Hidayatullah berhasil diverifikasi di Firestore.");
      return true;
    }
  } catch (err) {
    console.warn("[Firebase] SDK write failed, using REST API:", err);
  }

  try {
    await writeDocToFirestoreREST("vlab_users", "usr_guru_syarif", teacherData);
    await writeDocToFirestoreREST("vlab_teachers", "usr_guru_syarif", teacherData);
    await writeDocToFirestoreREST("vlab_servers", "srv_syarif_fivia", serverDoc);
    return true;
  } catch (_) {
    return false;
  }
}

/**
 * Ekspor seluruh database siswa dalam bentuk server (JSON) untuk diarsipkan di perangkat guru
 */
function exportServerDatabaseJSON() {
  const users = (window.db && window.db.getTable("users")) || [];
  const students = (window.db && window.db.getTable("students")) || [];
  const submissions = (window.db && window.db.getTable("submissions")) || [];
  const quizScores = (window.db && window.db.getTable("quizScores")) || [];
  const classes = (window.db && window.db.getTable("classes")) || [];

  const serverDatabase = {
    server: {
      serverId: "srv_syarif_fivia",
      serverHost: "Syarif Hidayatullah",
      serverEmail: "syarifhidayatullah64@guru.sma.belajar.id",
      exportedAt: new Date().toISOString(),
      appVersion: "1.2.7",
      status: "verified"
    },
    statistics: {
      totalStudents: students.length,
      totalSubmissions: submissions.length,
      totalQuizScores: quizScores.length
    },
    students: students,
    submissions: submissions,
    quizScores: quizScores,
    classes: classes
  };

  const blob = new Blob([JSON.stringify(serverDatabase, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `database_server_guru_${new Date().toISOString().split("T")[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  if (window.showToast) window.showToast("Database Server Guru berhasil diunduh!", "success");
}

/**
 * Hapus dokumen dari Firestore saat dihapus di lokal
 */
async function syncLocalDeleteToCloud(collectionName, id) {
  if (!window.FIVIA_FIREBASE || !window.FIVIA_FIREBASE.db || !window.FIVIA_FIREBASE.isInitialized) return;
  const cloudCollection = FIRESTORE_COLLECTIONS[collectionName];
  if (!cloudCollection || !id) return;
  try {
    await window.FIVIA_FIREBASE.db.collection(cloudCollection).doc(String(id)).delete();
    console.log(`[Firebase Sync] Terhapus dari Firestore: ${cloudCollection}/${id}`);
  } catch (err) {
    console.warn(`[Firebase Sync] Gagal menghapus dari cloud:`, err);
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
window.fetchCollectionFromFirestoreREST = fetchCollectionFromFirestoreREST;
window.writeDocToFirestoreREST = writeDocToFirestoreREST;
window.ensureTeacherRegisteredInFirebase = ensureTeacherRegisteredInFirebase;
window.exportServerDatabaseJSON = exportServerDatabaseJSON;
