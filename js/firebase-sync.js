/**
 * js/firebase-sync.js
 * Two-way real-time synchronization bridge between Local Database and Firebase Firestore
 * Optimized for High-Performance (No freezing, No infinite polling, No quota exhaustion)
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
let isSyncInitialized = false;

// Queue for offline or throttled writes
const OFFLINE_QUEUE_KEY = "fivia_offline_sync_queue";
let isFlushingQueue = false;
let queueThrottleTimer = null;

// Batch buffer for real-time Firestore snapshots to avoid UI freezes
let pendingCloudUpdates = {
  submissions: {},
  students: {},
  users: {},
  roster: {},
  classes: {},
  quizScores: {},
  detektifProgress: {}
};
let batchDebounceTimer = null;

/**
 * REST API Helper: Parse Firestore document value recursively
 */
function parseFirestoreRESTValue(v) {
  if (!v || typeof v !== "object") return v;
  if (v.stringValue !== undefined) return v.stringValue;
  if (v.integerValue !== undefined) return parseInt(v.integerValue, 10);
  if (v.doubleValue !== undefined) return parseFloat(v.doubleValue);
  if (v.booleanValue !== undefined) return v.booleanValue;
  if (v.timestampValue !== undefined) return v.timestampValue;
  if (v.nullValue !== undefined) return null;
  if (v.arrayValue !== undefined) {
    return (v.arrayValue.values || []).map(parseFirestoreRESTValue);
  }
  if (v.mapValue !== undefined) {
    const obj = {};
    const fields = v.mapValue.fields || {};
    for (const [k, val] of Object.entries(fields)) {
      obj[k] = parseFirestoreRESTValue(val);
    }
    return obj;
  }
  return v;
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
    res[k] = parseFirestoreRESTValue(v);
  }
  return res;
}

/**
 * REST API Helper: Convert JavaScript value to Firestore REST value recursively
 */
function toFirestoreRESTValue(val) {
  if (val === null || val === undefined) return { nullValue: null };
  if (typeof val === "string") return { stringValue: val };
  if (typeof val === "boolean") return { booleanValue: val };
  if (typeof val === "number") {
    if (Number.isInteger(val)) return { integerValue: String(val) };
    return { doubleValue: val };
  }
  if (Array.isArray(val)) {
    if (val.length === 0) return { arrayValue: {} };
    return { arrayValue: { values: val.map(toFirestoreRESTValue) } };
  }
  if (typeof val === "object") {
    const fields = {};
    for (const [k, v] of Object.entries(val)) {
      if (v !== undefined) {
        fields[k] = toFirestoreRESTValue(v);
      }
    }
    return { mapValue: { fields } };
  }
  return { stringValue: String(val) };
}

/**
 * REST API Helper: Convert JavaScript object to Firestore REST fields
 */
function toFirestoreRESTFields(obj) {
  const fields = {};
  for (const [k, v] of Object.entries(obj)) {
    if (v !== undefined && k !== "id") {
      fields[k] = toFirestoreRESTValue(v);
    }
  }
  return fields;
}

/**
 * Direct REST API fetcher (fallback when SDK is offline or uninitialized)
 */
async function fetchCollectionFromFirestoreREST(collectionName) {
  try {
    const config = (window.getFirebaseConfig && window.getFirebaseConfig()) || {};
    const projectId = config.projectId || "fiva-app";
    const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/${collectionName}?pageSize=200`;
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);
    
    const resp = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);
    
    if (!resp.ok) {
      if (resp.status === 429) {
        console.warn(`[Firestore REST] 429 Quota Exceeded pada ${collectionName}`);
      }
      return [];
    }
    const json = await resp.json();
    return (json.documents || []).map(parseFirestoreRESTDoc);
  } catch (err) {
    return [];
  }
}

/**
 * Direct REST API writer (fallback)
 */
async function writeDocToFirestoreREST(collectionName, docId, data) {
  try {
    const config = (window.getFirebaseConfig && window.getFirebaseConfig()) || {};
    const projectId = config.projectId || "fiva-app";
    const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/${collectionName}/${encodeURIComponent(docId)}`;
    const fields = toFirestoreRESTFields(data);
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);
    
    const resp = await fetch(url, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fields }),
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    
    if (resp.status === 429) {
      console.warn(`[Firestore REST] Kuota harian Firestore tercapai (429 RESOURCE_EXHAUSTED).`);
      return false;
    }
    return resp.ok;
  } catch (err) {
    return false;
  }
}

/**
 * Push an item to offline sync queue
 */
function enqueueOfflineSync(collectionName, item) {
  try {
    const queue = JSON.parse(localStorage.getItem(OFFLINE_QUEUE_KEY) || "[]");
    const docId = String(item.id || item.studentId || "");
    const existingIdx = queue.findIndex(q => q.collection === collectionName && q.id === docId);
    
    const queueItem = {
      collection: collectionName,
      id: docId,
      data: item,
      queuedAt: new Date().toISOString()
    };
    
    if (existingIdx !== -1) {
      queue[existingIdx] = queueItem;
    } else {
      queue.push(queueItem);
    }
    
    localStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(queue));
    
    // Notify status badge if present
    const badge = document.getElementById("firebase-status-badge");
    if (badge && queue.length > 0) {
      badge.innerHTML = `<i class="fas fa-clock" style="color: #38bdf8;"></i> ${queue.length} Antrian Tersimpan`;
    }
  } catch (_) {}
}

/**
 * Flush offline sync queue in the background with safe intervals (avoids lag & throttling)
 */
async function flushOfflineSyncQueue() {
  if (isFlushingQueue) return;
  
  let queue = [];
  try {
    queue = JSON.parse(localStorage.getItem(OFFLINE_QUEUE_KEY) || "[]");
  } catch (_) {
    return;
  }
  
  if (!queue || queue.length === 0) return;
  
  isFlushingQueue = true;
  
  const remaining = [];
  for (let i = 0; i < queue.length; i++) {
    const entry = queue[i];
    const ok = await syncLocalChangeToCloud(entry.collection, entry.data, false);
    if (!ok) {
      // Re-queue remaining items if network or quota blocks writes
      remaining.push(...queue.slice(i));
      break;
    }
    // Small pause between queue writes
    await new Promise(r => setTimeout(r, 400));
  }
  
  try {
    localStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(remaining));
  } catch (_) {}
  
  isFlushingQueue = false;
}

/**
 * Sync a single local item (LKPD, quiz result, student, teacher grade) to Firestore Cloud
 * @param {string} collectionName - Local key (e.g. "submissions")
 * @param {object} item - Data item with an 'id'
 * @param {boolean} allowEnqueue - Whether to add to offline queue on failure
 */
async function syncLocalChangeToCloud(collectionName, item, allowEnqueue = true) {
  const cloudCollection = FIRESTORE_COLLECTIONS[collectionName];
  if (!cloudCollection || !item) return false;
  
  const docId = String(item.id || item.studentId || item.userId || "");
  if (!docId) return false;
  
  const cleanItem = JSON.parse(JSON.stringify(item));
  cleanItem.id = docId;
  cleanItem.lastSyncedAt = new Date().toISOString();
  
  let written = false;
  
  // 1. Primary write: Firestore SDK
  if (window.FIVIA_FIREBASE && window.FIVIA_FIREBASE.db && window.FIVIA_FIREBASE.isInitialized) {
    try {
      const firestore = window.FIVIA_FIREBASE.db;
      const docRef = firestore.collection(cloudCollection).doc(docId);
      
      await Promise.race([
        docRef.set(cleanItem, { merge: true }),
        new Promise((_, rej) => setTimeout(() => rej(new Error("Timeout")), 2500))
      ]);
      written = true;
    } catch (sdkErr) {
      // If SDK write fails (e.g. offline, permission, timeout), fall through to REST
    }
  }
  
  // 2. Secondary write: Direct REST API (if SDK failed or uninitialized)
  if (!written) {
    try {
      written = await writeDocToFirestoreREST(cloudCollection, docId, cleanItem);
    } catch (_) {}
  }
  
  if (written) {
    console.log(`[Firebase Sync] Tersimpan ke Cloud: ${cloudCollection}/${docId}`);
  } else if (allowEnqueue) {
    enqueueOfflineSync(collectionName, cleanItem);
  }
  
  return written;
}

/**
 * Handle remote document deletion
 */
async function syncLocalDeleteToCloud(collectionName, id) {
  const cloudCollection = FIRESTORE_COLLECTIONS[collectionName];
  if (!cloudCollection || !id) return;
  
  if (window.FIVIA_FIREBASE && window.FIVIA_FIREBASE.db && window.FIVIA_FIREBASE.isInitialized) {
    try {
      await window.FIVIA_FIREBASE.db.collection(cloudCollection).doc(String(id)).delete();
    } catch (_) {}
  }
}

/**
 * Synchronize a student record across local storage stores without triggering mass cloud writes
 */
function syncStudentRecordLocally(std) {
  if (!std) return;
  const sName = std.name || std.studentName || std.displayName || "Siswa";
  const sNis = String(std.nis || std.studentCode || "").trim();
  const sCode = std.studentCode || (sNis ? ('FIVIA-' + sNis) : 'STD');
  const sClass = std.className || std.classId || "cls_x1";
  const sId = std.id || std.studentId || ("usr_" + Math.random().toString(36).substr(2, 9));

  // 1. Sync to fivia_student_roster
  try {
    let roster = JSON.parse(localStorage.getItem("fivia_student_roster") || "[]");
    const rIdx = roster.findIndex(r => 
      String(r.id || r.studentId) === String(sId) || 
      (r.nis && String(r.nis) === sNis && sNis !== "") || 
      (r.name && r.name.toLowerCase().trim() === sName.toLowerCase().trim())
    );
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
  } catch (_) {}

  // 2. Sync to fivia_classroom_students
  try {
    let cs = JSON.parse(localStorage.getItem("fivia_classroom_students") || "[]");
    const csIdx = cs.findIndex(c => String(c.studentId || c.id) === String(sId) || (c.nis && String(c.nis) === sNis && sNis !== ""));
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
  } catch (_) {}

  // 3. Sync to users table for login authentication
  if (window.db && typeof window.db.getTable === "function") {
    let users = window.db.getTable("users") || [];
    const uIdx = users.findIndex(u => 
      String(u.id) === String(sId) || 
      (u.nis && String(u.nis) === sNis && sNis !== "") || 
      (u.name && u.name.toLowerCase().trim() === sName.toLowerCase().trim())
    );
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
    window.db.saveTable("users", users, true);
  }
}

/**
 * Handle individual cloud record updates by staging into batch buffer
 */
function handleCloudRecordUpdate(localCollection, id, data) {
  if (!localCollection || !id || !data) return;
  const mergedItem = { ...data, id: String(id) };
  
  if (!pendingCloudUpdates[localCollection]) {
    pendingCloudUpdates[localCollection] = {};
  }
  pendingCloudUpdates[localCollection][String(id)] = mergedItem;
  
  // Debounce the flush to apply changes in one clean render
  if (batchDebounceTimer) {
    clearTimeout(batchDebounceTimer);
  }
  batchDebounceTimer = setTimeout(flushPendingCloudUpdates, 200);
}

/**
 * Flush all staged cloud updates into local storage and trigger UI renders ONCE
 */
function flushPendingCloudUpdates() {
  batchDebounceTimer = null;
  
  let hasSubmissionChanges = false;
  let hasStudentChanges = false;
  let hasClassChanges = false;
  
  // 1. Process submissions
  const subMap = pendingCloudUpdates.submissions;
  const subIds = Object.keys(subMap);
  if (subIds.length > 0 && window.db && typeof window.db.getTable === "function") {
    const localList = window.db.getTable("submissions") || [];
    subIds.forEach(id => {
      const doc = subMap[id];
      const idx = localList.findIndex(item => 
        String(item.id) === String(id) || 
        (item.studentId && item.labId && String(item.studentId) === String(doc.studentId) && String(item.labId) === String(doc.labId))
      );
      if (idx !== -1) {
        localList[idx] = { ...localList[idx], ...doc };
      } else {
        localList.push(doc);
      }
    });
    window.db.saveTable("submissions", localList, true);
    hasSubmissionChanges = true;
    pendingCloudUpdates.submissions = {};
  }
  
  // 2. Process students & roster
  const stdMap = { ...pendingCloudUpdates.students, ...pendingCloudUpdates.roster };
  const stdIds = Object.keys(stdMap);
  if (stdIds.length > 0) {
    stdIds.forEach(id => {
      const std = stdMap[id];
      if (std && (std.role === "guru" || std.role === "admin")) return;
      syncStudentRecordLocally(std);
    });
    hasStudentChanges = true;
    pendingCloudUpdates.students = {};
    pendingCloudUpdates.roster = {};
  }

  // 2b. Process users (Teachers, Admins & Students)
  const userMap = pendingCloudUpdates.users || {};
  const userIds = Object.keys(userMap);
  if (userIds.length > 0 && window.db && typeof window.db.getTable === "function") {
    let curUsers = window.db.getTable("users") || [];
    let hasUserTableChanges = false;
    userIds.forEach(id => {
      const u = userMap[id];
      if (!u) return;
      if (u.role === "guru" || u.role === "admin") {
        const idx = curUsers.findIndex(cu => String(cu.id) === String(id) || (cu.email && u.email && cu.email.toLowerCase() === u.email.toLowerCase()));
        if (idx !== -1) {
          curUsers[idx] = { ...curUsers[idx], ...u };
        } else {
          curUsers.push(u);
        }
        hasUserTableChanges = true;
      } else {
        syncStudentRecordLocally(u);
      }
    });
    if (hasUserTableChanges) {
      window.db.saveTable("users", curUsers, true);
      if (typeof window.renderTeacherManagement === "function") {
        window.renderTeacherManagement();
      }
    }
    pendingCloudUpdates.users = {};
  }
  
  // 3. Process classes
  const clsMap = pendingCloudUpdates.classes;
  const clsIds = Object.keys(clsMap);
  if (clsIds.length > 0 && window.db && typeof window.db.getTable === "function") {
    const classes = window.db.getTable("classes") || [];
    clsIds.forEach(id => {
      const cls = clsMap[id];
      const idx = classes.findIndex(c => String(c.id) === String(id));
      if (idx !== -1) {
        classes[idx] = { ...classes[idx], ...cls };
      } else {
        classes.push(cls);
      }
    });
    window.db.saveTable("classes", classes, true);
    hasClassChanges = true;
    pendingCloudUpdates.classes = {};
  }
  
  // 4. Trigger UI re-renders ONCE if relevant view is active
  if (hasSubmissionChanges) {
    if (typeof window.renderSubmissionsList === "function") window.renderSubmissionsList();
    if (typeof window.renderTeacherDashboard === "function") window.renderTeacherDashboard();
    if (typeof window.renderPeriksaLKPDSection === "function") window.renderPeriksaLKPDSection();
  }
  if (hasStudentChanges || hasClassChanges) {
    if (typeof window.renderClassManagement === "function") window.renderClassManagement();
    if (typeof window.updateAllClassDropdowns === "function") window.updateAllClassDropdowns();
  }
}

/**
 * Handle remote document deletion
 */
function handleCloudRecordDelete(localCollection, id) {
  if (typeof db === "undefined" || !db.getTable) return;
  const tableName = (localCollection === "roster") ? "students" : localCollection;
  const localList = db.getTable(tableName) || [];
  const filtered = localList.filter((item) => String(item.id) !== String(id));
  db.saveTable(tableName, filtered, true);
  
  if (localCollection === "submissions") {
    if (typeof window.renderTeacherDashboard === "function") window.renderTeacherDashboard();
    if (typeof window.renderPeriksaLKPDSection === "function") window.renderPeriksaLKPDSection();
  }
}

/**
 * Initialize real-time listeners for all critical Firestore collections
 */
async function initFirebaseSync() {
  if (!window.FIVIA_FIREBASE || !window.FIVIA_FIREBASE.db || !window.FIVIA_FIREBASE.isInitialized) {
    return;
  }
  
  if (isSyncInitialized) return;
  isSyncInitialized = true;
  
  const firestore = window.FIVIA_FIREBASE.db;
  console.log("[Firebase Sync] Mengaktifkan listener real-time Firestore...");
  
  // Unsubscribe old listeners if any
  syncUnsubscribers.forEach((unsub) => {
    try { unsub(); } catch (_) {}
  });
  syncUnsubscribers = [];
  
  // Real-time collections to observe
  const listenCollections = ["submissions", "students", "classes", "quizScores", "users", "roster"];
  
  listenCollections.forEach((localKey) => {
    const cloudCollection = FIRESTORE_COLLECTIONS[localKey];
    if (!cloudCollection) return;
    
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
        if (err && (err.code === "permission-denied" || String(err).includes("permission"))) {
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
  
  // Automatically pull teacher/student data once on connection
  syncServerDataForTeacher(true).catch(() => {});
  
  // Start gentle background queue flusher
  setTimeout(flushOfflineSyncQueue, 3000);
}

/**
 * Pull all cloud data for Teacher to ensure identical data across all devices (PC, HP, Tablet)
 * @param {boolean} silent - If true, do not show toasts
 */
async function syncServerDataForTeacher(silent = false) {
  let count = 0;
  
  // 1. Fetch LKPD Submissions
  try {
    let subs = [];
    if (window.FIVIA_FIREBASE && window.FIVIA_FIREBASE.db && window.FIVIA_FIREBASE.isInitialized) {
      try {
        const snap = await Promise.race([
          window.FIVIA_FIREBASE.db.collection("vlab_lkpd_submissions").get(),
          new Promise((_, rej) => setTimeout(() => rej(new Error("Timeout")), 3000))
        ]);
        if (!snap.empty) {
          subs = snap.docs.map(d => ({ ...d.data(), id: d.id }));
        }
      } catch (_) {}
    }
    
    // REST fallback
    if (subs.length === 0) {
      subs = await fetchCollectionFromFirestoreREST("vlab_lkpd_submissions");
    }
    
    if (subs && subs.length > 0) {
      subs.forEach(doc => {
        handleCloudRecordUpdate("submissions", doc.id, doc);
        count++;
      });
    }
  } catch (err) {
    console.warn("[Firebase Sync] Error fetching submissions:", err);
  }
  
  // 2. Fetch Students & Roster
  try {
    let students = [];
    if (window.FIVIA_FIREBASE && window.FIVIA_FIREBASE.db && window.FIVIA_FIREBASE.isInitialized) {
      try {
        const snap = await Promise.race([
          window.FIVIA_FIREBASE.db.collection("vlab_students").get(),
          new Promise((_, rej) => setTimeout(() => rej(new Error("Timeout")), 2500))
        ]);
        if (!snap.empty) {
          students = snap.docs.map(d => ({ ...d.data(), id: d.id }));
        }
      } catch (_) {}
    }
    if (students.length === 0) {
      students = await fetchCollectionFromFirestoreREST("vlab_students");
    }
    students.forEach(doc => {
      handleCloudRecordUpdate("students", doc.id, doc);
    });
  } catch (_) {}
  
  // 3. Fetch Classes
  try {
    let classes = [];
    if (window.FIVIA_FIREBASE && window.FIVIA_FIREBASE.db && window.FIVIA_FIREBASE.isInitialized) {
      try {
        const snap = await Promise.race([
          window.FIVIA_FIREBASE.db.collection("vlab_classes").get(),
          new Promise((_, rej) => setTimeout(() => rej(new Error("Timeout")), 2500))
        ]);
        if (!snap.empty) {
          classes = snap.docs.map(d => ({ ...d.data(), id: d.id }));
        }
      } catch (_) {}
    }
    if (classes.length === 0) {
      classes = await fetchCollectionFromFirestoreREST("vlab_classes");
    }
    classes.forEach(doc => {
      handleCloudRecordUpdate("classes", doc.id, doc);
    });
  } catch (_) {}

  // 4. Fetch Users (Teachers & Registered Users) to guarantee identical accounts on all devices
  try {
    let cloudUsers = [];
    if (window.FIVIA_FIREBASE && window.FIVIA_FIREBASE.db && window.FIVIA_FIREBASE.isInitialized) {
      try {
        const snap = await Promise.race([
          window.FIVIA_FIREBASE.db.collection("vlab_users").get(),
          new Promise((_, rej) => setTimeout(() => rej(new Error("Timeout")), 2500))
        ]);
        if (!snap.empty) {
          cloudUsers = snap.docs.map(d => ({ ...d.data(), id: d.id }));
        }
      } catch (_) {}
    }
    if (cloudUsers.length === 0) {
      cloudUsers = await fetchCollectionFromFirestoreREST("vlab_users");
    }
    cloudUsers.forEach(doc => {
      handleCloudRecordUpdate("users", doc.id, doc);
    });
  } catch (_) {}
  
  // Flush batch immediately
  flushPendingCloudUpdates();
  
  if (!silent && window.showToast) {
    if (count > 0) {
      window.showToast(`Berhasil menyinkronkan ${count} lembar kerja LKPD dari Cloud Server!`, "success");
    } else {
      window.showToast("Data server telah disinkronkan dengan perangkat Anda.", "info");
    }
  }
  
  return { success: true, count };
}

/**
 * Public helper alias for pulling submissions
 */
function fetchLKPDSubmissionsFromCloud(silent = false) {
  return syncServerDataForTeacher(silent);
}

/**
 * Export complete teacher server database as a clean JSON file
 */
function exportServerDatabaseJSON() {
  const users = (window.db && window.db.getTable("users")) || [];
  const students = (window.db && window.db.getTable("students")) || [];
  const submissions = (window.db && window.db.getTable("submissions")) || [];
  const quizScores = (window.db && window.db.getTable("quizScores")) || [];
  const classes = (window.db && window.db.getTable("classes")) || [];
  let roster = [];
  try { roster = JSON.parse(localStorage.getItem("fivia_student_roster") || "[]"); } catch(_) {}

  const serverDatabase = {
    server: {
      serverId: "srv_syarif_fivia",
      serverHost: "Syarif Hidayatullah",
      serverEmail: "syarifhidayatullah64@guru.sma.belajar.id",
      exportedAt: new Date().toISOString(),
      appVersion: "1.3.8",
      status: "verified"
    },
    statistics: {
      totalStudents: students.length,
      totalSubmissions: submissions.length,
      totalQuizScores: quizScores.length,
      totalClasses: classes.length
    },
    classes: classes,
    students: students,
    roster: roster,
    users: users,
    submissions: submissions,
    quizScores: quizScores
  };

  const blob = new Blob([JSON.stringify(serverDatabase, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `fivia_server_backup_guru_${new Date().toISOString().split("T")[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  if (window.showToast) window.showToast("Database Server Guru berhasil diekspor dan diunduh!", "success");
}

/**
 * Import complete server database from JSON string or file
 */
function importServerDatabaseJSON(jsonInput) {
  try {
    const data = typeof jsonInput === "string" ? JSON.parse(jsonInput) : jsonInput;
    if (!data || typeof data !== "object") {
      throw new Error("Format berkas backup tidak valid.");
    }
    
    let count = 0;
    if (window.db && typeof window.db.saveTable === "function") {
      if (Array.isArray(data.classes) && data.classes.length > 0) {
        window.db.saveTable("classes", data.classes, true);
      }
      if (Array.isArray(data.students) && data.students.length > 0) {
        window.db.saveTable("students", data.students, true);
        count += data.students.length;
      }
      if (Array.isArray(data.users) && data.users.length > 0) {
        window.db.saveTable("users", data.users, true);
      }
      if (Array.isArray(data.submissions) && data.submissions.length > 0) {
        window.db.saveTable("submissions", data.submissions, true);
        count += data.submissions.length;
      }
      if (Array.isArray(data.quizScores) && data.quizScores.length > 0) {
        window.db.saveTable("quizScores", data.quizScores, true);
      }
    }
    if (Array.isArray(data.roster)) {
      localStorage.setItem("fivia_student_roster", JSON.stringify(data.roster));
    }
    
    if (typeof window.renderTeacherDashboard === "function") window.renderTeacherDashboard();
    if (typeof window.renderPeriksaLKPDSection === "function") window.renderPeriksaLKPDSection();
    if (typeof window.renderClassManagement === "function") window.renderClassManagement();
    
    if (window.showToast) {
      window.showToast(`Berhasil memulihkan ${count} data server dari berkas backup!`, "success");
    }
    return { success: true, count };
  } catch (err) {
    if (window.showToast) window.showToast("Gagal memulihkan database: " + err.message, "danger");
    return { success: false, error: err.message };
  }
}

/**
 * Ensure Pak Syarif's teacher account & server metadata exist in Firestore
 */
async function ensureTeacherRegisteredInFirebase() {
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

  await syncLocalChangeToCloud("users", teacherData, false);
  await syncLocalChangeToCloud("teachers", teacherData, false);
  await syncLocalChangeToCloud("servers", serverDoc, false);
  return true;
}

// Push all roster to cloud on demand (Explicit button click ONLY)
async function syncAllRosterToCloud() {
  let uploaded = 0;
  const submissions = (window.db && window.db.getTable("submissions")) || [];
  for (const sub of submissions) {
    if (sub && (sub.id || sub.studentId)) {
      await syncLocalChangeToCloud("submissions", sub);
      uploaded++;
    }
  }
  return { success: true, count: uploaded };
}

// Export functions to window
window.initFirebaseSync = initFirebaseSync;
window.syncLocalChangeToCloud = syncLocalChangeToCloud;
window.syncLocalDeleteToCloud = syncLocalDeleteToCloud;
window.syncServerDataForTeacher = syncServerDataForTeacher;
window.fetchLKPDSubmissionsFromCloud = fetchLKPDSubmissionsFromCloud;
window.syncAllRosterToCloud = syncAllRosterToCloud;
window.ensureTeacherRegisteredInFirebase = ensureTeacherRegisteredInFirebase;
window.exportServerDatabaseJSON = exportServerDatabaseJSON;
window.importServerDatabaseJSON = importServerDatabaseJSON;
window.flushOfflineSyncQueue = flushOfflineSyncQueue;

// Attach clean lifecycle triggers (no setInterval!)
if (typeof window !== "undefined" && typeof window.addEventListener === "function") {
  window.addEventListener("DOMContentLoaded", () => {
    // Single non-blocking initialization
    setTimeout(() => {
      if (window.initFirebaseSync) window.initFirebaseSync();
    }, 800);
  });
  
  window.addEventListener("authChange", () => {
    const user = window.auth ? window.auth.getCurrentUser() : null;
    if (user && (user.role === "guru" || user.role === "admin")) {
      syncServerDataForTeacher(true);
    }
  });
  
  window.addEventListener("online", () => {
    flushOfflineSyncQueue();
    syncServerDataForTeacher(true);
  });
}
