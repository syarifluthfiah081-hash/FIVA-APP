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
  users: "vlab_users"
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

  // Push local items that might not yet exist on Firestore (initial backfill)
  await backfillLocalToCloud();
}

/**
 * Update local storage when a cloud record changes
 */
function handleCloudRecordUpdate(localCollection, id, data) {
  if (typeof db === "undefined") return;
  const localList = db.get(localCollection) || [];
  const idx = localList.findIndex((item) => String(item.id) === String(id));

  const mergedItem = { ...data, id: id };

  if (idx !== -1) {
    // Only update if cloud record is newer or updated
    localList[idx] = { ...localList[idx], ...mergedItem };
  } else {
    localList.push(mergedItem);
  }

  localStorage.setItem(DB_PREFIX + localCollection, JSON.stringify(localList));

  // Trigger UI refresh if currently on dashboard or LKPD
  if (window.renderSubmissionsList && (localCollection === "submissions")) {
    window.renderSubmissionsList();
  }
}

/**
 * Handle remote delete
 */
function handleCloudRecordDelete(localCollection, id) {
  if (typeof db === "undefined") return;
  const localList = db.get(localCollection) || [];
  const filtered = localList.filter((item) => String(item.id) !== String(id));
  localStorage.setItem(DB_PREFIX + localCollection, JSON.stringify(filtered));
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
 * Sync a deletion to Firestore
 */
async function syncLocalDeleteToCloud(collectionName, id) {
  if (!window.FIVIA_FIREBASE || !window.FIVIA_FIREBASE.db || !window.FIVIA_FIREBASE.isInitialized) {
    return;
  }

  const cloudCollection = FIRESTORE_COLLECTIONS[collectionName];
  if (!cloudCollection || !id) return;

  try {
    const firestore = window.FIVIA_FIREBASE.db;
    await firestore.collection(cloudCollection).doc(String(id)).delete();
    console.log(`[Firebase Sync] Terhapus dari Firestore: ${cloudCollection}/${id}`);
  } catch (err) {
    console.warn(`[Firebase Sync] Gagal menghapus data di cloud:`, err);
  }
}

/**
 * Push all local data to Firestore
 */
async function backfillLocalToCloud() {
  if (!window.FIVIA_FIREBASE || !window.FIVIA_FIREBASE.db || !window.FIVIA_FIREBASE.isInitialized) return;

  const collections = ["submissions", "quiz_results", "game_progress", "students", "classes"];
  for (const col of collections) {
    const items = (typeof db !== "undefined") ? (db.get(col) || []) : [];
    for (const item of items) {
      if (item && item.id) {
        await syncLocalChangeToCloud(col, item);
      }
    }
  }
}

// Export to window
window.initFirebaseSync = initFirebaseSync;
window.syncLocalChangeToCloud = syncLocalChangeToCloud;
window.syncLocalDeleteToCloud = syncLocalDeleteToCloud;
window.backfillLocalToCloud = backfillLocalToCloud;
