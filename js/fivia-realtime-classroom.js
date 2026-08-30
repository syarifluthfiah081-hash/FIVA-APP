/**
 * FIVIA REAL-TIME CLASSROOM MODULE
 * Phase 9: Real-Time Live Monitor, Help Requests & Projector Mode Firestore Binding
 */

window.FIVIARealtimeClassroom = (function() {
  'use strict';

  function initLiveMonitorRealtimeBinding(classCode) {
    window.FIVIAFirebaseSyncV2.listenToClassroomLiveMonitor(classCode, function(studentRecords) {
      const container = document.getElementById('fq-live-monitor-container');
      if (container && window.location.hash.includes('live-monitor')) {
        window.FIVIAClassroomEngine.renderLiveMonitorUI();
      }
    });
  }

  function sendRealtimeHelpRequest(studentName, activityTitle) {
    const session = window.FIVIAStudentSession.getActiveStudentSession();
    const db = window.FIVIA_FIREBASE ? window.FIVIA_FIREBASE.db : null;

    if (db && session) {
      db.collection('help_requests').add({
        studentName: session.name || studentName || 'Siswa',
        studentCode: session.studentCode || 'FIVIA-XIF-001',
        classCode: session.classroomCode || 'FIVIA-XIF-2045',
        activity: activityTitle || 'Praktikum Virtual',
        status: 'OPEN',
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      }).catch(err => {
        console.warn('[Help Request] Firestore write error:', err);
      });
    }

    window.FIVIALiveMonitor.requestStudentHelp(studentName, activityTitle);
  }

  return {
    initLiveMonitorRealtimeBinding: initLiveMonitorRealtimeBinding,
    sendRealtimeHelpRequest: sendRealtimeHelpRequest
  };
})();
