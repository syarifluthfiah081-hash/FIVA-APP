/**
 * FIVIA REAL-TIME SYNC STATUS & OFFLINE QUEUE MANAGER MODULE
 * Phase 10: Global Network Status Indicator, Offline Write Queue & Auto-Reconnection Flush
 */

window.FIVIASyncStatus = (function() {
  'use strict';

  const QUEUE_STORAGE_KEY = 'fivia_offline_queue';

  function getOfflineQueue() {
    return window.FIVIAStudent.safeStorageGet(QUEUE_STORAGE_KEY, []);
  }

  function enqueueWrite(collectionName, docId, data) {
    const queue = getOfflineQueue();
    const item = {
      eventId: `${collectionName}_${docId}_${Date.now()}_${Math.floor(Math.random()*1000)}`,
      collectionName: collectionName,
      docId: docId,
      data: data,
      queuedAt: new Date().toISOString()
    };
    queue.push(item);
    window.FIVIAStudent.safeStorageSet(QUEUE_STORAGE_KEY, queue);
    return item;
  }

  function flushOfflineQueue() {
    const queue = getOfflineQueue();
    if (queue.length === 0) return;

    const db = window.FIVIA_FIREBASE ? window.FIVIA_FIREBASE.db : null;
    if (!db || !navigator.onLine) return;

    console.log(`[Offline Queue] Flushing ${queue.length} pending writes to Firestore...`);
    const remaining = [];

    queue.forEach(item => {
      try {
        db.collection(item.collectionName).doc(item.docId).set(item.data, { merge: true }).catch(err => {
          console.warn(`[Offline Queue] Write failed for ${item.eventId}:`, err);
          remaining.push(item);
        });
      } catch (e) {
        remaining.push(item);
      }
    });

    window.FIVIAStudent.safeStorageSet(QUEUE_STORAGE_KEY, remaining);
    if (remaining.length === 0) {
      console.log('[Offline Queue] All pending writes successfully flushed to Firestore!');
    }
  }

  function renderSyncStatusUI() {
    const container = document.getElementById('fq-sync-status-container');
    if (!container) return;

    const isOnline = navigator.onLine;
    const isFirebaseConnected = window.FIVIA_FIREBASE ? window.FIVIA_FIREBASE.isConnected : false;
    const queue = getOfflineQueue();

    container.innerHTML = `
      <div style="background: rgba(15, 23, 42, 0.95); border: 2.5px solid var(--fq-cyan); border-radius: 28px; padding: 32px; text-align: left;">
        <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 2px solid var(--fq-border-cyan); padding-bottom: 16px; margin-bottom: 24px;">
          <div>
            <span class="fq-badge-pill"><i class="fas fa-wifi"></i> REAL-TIME SYNC STATUS & OFFLINE QUEUE</span>
            <h1 style="font-size: 2.2rem; font-weight: 900; color: #fff; margin: 4px 0;">STATUS KONEKSI FIREBASE</h1>
          </div>
          <button class="fq-btn fq-btn-outline" onclick="window.location.hash='#quest/teacher-home'"><i class="fas fa-arrow-left"></i> KEMBALI</button>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px; margin-bottom: 28px;">
          <div style="background: rgba(30,41,59,0.7); border: 1.5px solid ${isOnline ? 'var(--fq-emerald)' : 'var(--fq-rose)'}; border-radius: 18px; padding: 18px;">
            <div style="font-size: 0.8rem; color: var(--fq-text-muted);">STATUS NETWORK BROWSER</div>
            <div style="font-size: 1.5rem; font-weight: 900; color: ${isOnline ? 'var(--fq-emerald)' : 'var(--fq-rose)'};">
              ${isOnline ? '🟢 ONLINE (TERHUBUNG)' : '🔴 OFFLINE (TERPUTUS)'}
            </div>
          </div>

          <div style="background: rgba(30,41,59,0.7); border: 1.5px solid ${isFirebaseConnected ? 'var(--fq-emerald)' : 'var(--fq-amber)'}; border-radius: 18px; padding: 18px;">
            <div style="font-size: 0.8rem; color: var(--fq-text-muted);">FIRESTORE CLOUD STATUS</div>
            <div style="font-size: 1.5rem; font-weight: 900; color: ${isFirebaseConnected ? 'var(--fq-emerald)' : 'var(--fq-amber)'};">
              ${isFirebaseConnected ? '🟢 CONNECTED (SYNCED)' : '🟡 LOCAL CACHE MODE'}
            </div>
          </div>

          <div style="background: rgba(30,41,59,0.7); border: 1.5px solid var(--fq-border-cyan); border-radius: 18px; padding: 18px;">
            <div style="font-size: 0.8rem; color: var(--fq-text-muted);">PENDING OFFLINE WRITES</div>
            <div style="font-size: 1.5rem; font-weight: 900; color: var(--fq-cyan);">${queue.length} Queue Items</div>
          </div>
        </div>

        <button class="fq-btn fq-btn-cyan fq-btn-lg" style="width: 100%;" onclick="window.FIVIASyncStatus.flushOfflineQueue(); window.FIVIASyncStatus.renderSyncStatusUI(); alert('🔄 PROSES SINKRONISASI COBA DITERAPKAN KEMBALI.');">
          <i class="fas fa-sync-alt"></i> RETRY SYNC & FLUSH QUEUE NOW
        </button>
      </div>
    `;
  }

  // Listen to network status changes
  window.addEventListener('online', () => {
    console.log('[Network] Browser reconnected online. Flushing offline queue...');
    flushOfflineQueue();
  });

  return {
    getOfflineQueue: getOfflineQueue,
    enqueueWrite: enqueueWrite,
    flushOfflineQueue: flushOfflineQueue,
    renderSyncStatusUI: renderSyncStatusUI
  };
})();
