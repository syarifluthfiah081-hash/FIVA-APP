/**
 * FIVIA GROUP PLAY SYNC MODULE
 * Phase 10: Firebase Firestore Real-Time Listener (onSnapshot) & Multi-Device Sync
 */

window.FIVIAGroupPlaySync = (function() {
  'use strict';

  let unsubscribeListener = null;

  function syncSessionToFirebase(sessionState) {
    if (!window.FIVIA_FIREBASE || !window.FIVIA_FIREBASE.db) {
      console.warn('Firebase DB not initialized, queuing local sync.');
      return;
    }

    try {
      const db = window.FIVIA_FIREBASE.db;
      const sessionDocRef = db.collection('groupPlaySessions').doc(sessionState.sessionId || 'current_session');

      const payload = {
        sessionId: sessionState.sessionId || 'current_session',
        classroomId: sessionState.classroomId || 'cls_xf1',
        className: sessionState.className || 'XI FASE F',
        status: sessionState.status || 'RUNNING',
        currentRound: sessionState.currentRound || 1,
        turnIndex: sessionState.turnIndex || 0,
        activePlayer: sessionState.activePlayer || null,
        activeGroup: sessionState.activeGroup || null,
        groups: sessionState.groups || [],
        isPaused: !!sessionState.isPaused,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      };

      sessionDocRef.set(payload, { merge: true }).then(() => {
        console.log('⚡ [GroupPlaySync] Realtime session synced to Firestore');
      }).catch(err => {
        console.warn('Firestore session sync warning:', err);
      });
    } catch (e) {
      console.warn('Firebase realtime sync fallback:', e);
    }
  }

  function startRealtimeListener(sessionId, callback) {
    if (!window.FIVIA_FIREBASE || !window.FIVIA_FIREBASE.db) return;

    try {
      if (unsubscribeListener) unsubscribeListener();

      const db = window.FIVIA_FIREBASE.db;
      unsubscribeListener = db.collection('groupPlaySessions')
        .doc(sessionId || 'current_session')
        .onSnapshot(doc => {
          if (doc.exists) {
            const data = doc.data();
            if (typeof callback === 'function') callback(data);
          }
        }, err => {
          console.warn('GroupPlay realtime snapshot listener warning:', err);
        });
    } catch (e) {}
  }

  function stopRealtimeListener() {
    if (unsubscribeListener) {
      unsubscribeListener();
      unsubscribeListener = null;
    }
  }

  return {
    syncSessionToFirebase: syncSessionToFirebase,
    startRealtimeListener: startRealtimeListener,
    stopRealtimeListener: stopRealtimeListener
  };
})();
