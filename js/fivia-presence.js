/**
 * FIVIA PRESENCE MODULE
 * Phase 9: Real-Time Presence Tracker & Heartbeat (30-60 seconds)
 */

window.FIVIAPresence = (function() {
  'use strict';

  let heartbeatTimer = null;

  function startPresenceHeartbeat() {
    stopPresenceHeartbeat();
    updatePresence();
    heartbeatTimer = setInterval(updatePresence, 45000); // 45 seconds interval
  }

  function stopPresenceHeartbeat() {
    if (heartbeatTimer) {
      clearInterval(heartbeatTimer);
      heartbeatTimer = null;
    }
  }

  function updatePresence() {
    const student = window.FIVIAStudent.getStudentProfile();
    const session = window.FIVIAStudentSession.getActiveStudentSession();
    const db = window.FIVIA_FIREBASE ? window.FIVIA_FIREBASE.db : null;

    if (db && session) {
      try {
        db.collection('students').doc(session.studentCode || 'std_demo').set({
          name: session.name || student.name || 'Siswa',
          studentCode: session.studentCode || 'FIVIA-XIF-001',
          classCode: session.classroomCode || 'FIVIA-XIF-2045',
          status: 'ACTIVE',
          lastSeenAt: firebase.firestore.FieldValue.serverTimestamp(),
          updatedAt: new Date().toISOString()
        }, { merge: true }).catch(err => {
          console.warn('[Presence] Firestore update skipped:', err);
        });
      } catch (e) {
        console.warn('[Presence] Heartbeat error:', e);
      }
    }
  }

  return {
    startPresenceHeartbeat: startPresenceHeartbeat,
    stopPresenceHeartbeat: stopPresenceHeartbeat,
    updatePresence: updatePresence
  };
})();
