/**
 * FIVIA FIREBASE REAL-TIME SYNC MANAGER (v2)
 * Phase 9: Firestore Source of Truth, Real-Time Listeners & Complete Backup
 */

window.FIVIAFirebaseSyncV2 = (function() {
  'use strict';

  let activeListeners = [];

  function clearAllListeners() {
    activeListeners.forEach(unsub => {
      if (typeof unsub === 'function') unsub();
    });
    activeListeners = [];
  }

  function syncStudentSubmission(collectionName, docId, payload) {
    const db = window.FIVIA_FIREBASE ? window.FIVIA_FIREBASE.db : null;
    if (db) {
      db.collection(collectionName).doc(docId).set({
        ...payload,
        updatedAt: new Date().toISOString()
      }, { merge: true }).catch(err => {
        console.warn(`[Firestore Sync] Failed to sync ${collectionName}/${docId}:`, err);
      });
    }
  }

  function listenToClassroomLiveMonitor(classCode, onDataChange) {
    clearAllListeners();
    const db = window.FIVIA_FIREBASE ? window.FIVIA_FIREBASE.db : null;
    if (!db) return;

    try {
      const unsub = db.collection('students')
        .where('classCode', '==', classCode || 'FIVIA-XIF-2045')
        .onSnapshot(snapshot => {
          const students = [];
          snapshot.forEach(doc => {
            students.push(doc.data());
          });
          if (typeof onDataChange === 'function') onDataChange(students);
        }, err => {
          console.warn('[Firestore Live Monitor] Listener error:', err);
        });

      activeListeners.push(unsub);
    } catch (e) {
      console.warn('[Firestore Live Monitor] Error establishing listener:', e);
    }
  }

  function exportCompleteFirebaseBackup() {
    const backupData = {
      version: 'FIVIA_PHASE_9_FIREBASE_PRODUCTION',
      exportedAt: new Date().toISOString(),
      teacherSettings: window.FIVIAPrivateAccess.getTeacherSettings(),
      classrooms: window.FIVIAClassroom.getClassrooms(),
      students: window.FIVIAClassroom.getRoster(),
      assignments: window.FIVIAAssignment.getAssignments(),
      interventions: window.FIVIAIntervention.getInterventions(),
      attendance: window.FIVIAStudent.safeStorageGet('fivia_attendance', {}),
      labProgress: window.FIVIAStudent.safeStorageGet('fivia_virtual_lab_progress', {}),
      projectProgress: window.FIVIAStudent.safeStorageGet('fivia_project_progress', {}),
      sessionHistory: window.FIVIAStudent.safeStorageGet('fivia_session_history', [])
    };

    const dateStr = new Date().toISOString().slice(0, 10);
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `FIVIA-FIREBASE-BACKUP-${dateStr}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    alert('📥 COMPLETE FIREBASE BACKUP BERHASIL DIUNDUH!');
  }

  return {
    clearAllListeners: clearAllListeners,
    syncStudentSubmission: syncStudentSubmission,
    listenToClassroomLiveMonitor: listenToClassroomLiveMonitor,
    exportCompleteFirebaseBackup: exportCompleteFirebaseBackup
  };
})();
