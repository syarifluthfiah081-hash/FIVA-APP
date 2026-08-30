/**
 * FIVIA LIVE CLASSROOM MONITOR MODULE
 * Phase 7: Teacher Live Monitor, Activity Feed & Student Help Requests
 */

window.FIVIALiveMonitor = (function() {
  'use strict';

  const STORAGE_KEYS = {
    EVENTS: 'fivia_live_events',
    HELP_REQUESTS: 'fivia_live_help_requests'
  };

  const DEFAULT_STUDENT_CARDS = [
    { name: 'Ahmad Fauzi', status: 'ACTIVE', activity: 'Basic Measurement Lab', progress: '80%', streak: 5, color: '#10b981' },
    { name: 'Budi Santoso', status: 'NEEDS_HELP', activity: 'Dimension Detective', progress: '40%', streak: 2, color: '#f43f5e' },
    { name: 'Citra Dewi', status: 'COMPLETED', activity: 'Mastery Assessment', progress: '100%', streak: 8, color: '#06b6d4' },
    { name: 'Dinda Rahma', status: 'ACTIVE', activity: 'Solar Future Project', progress: '65%', streak: 4, color: '#10b981' },
    { name: 'Eko Prasetyo', status: 'IDLE', activity: 'Besaran Hunter', progress: '20%', streak: 1, color: '#f59e0b' }
  ];

  function getLiveEvents() {
    return window.FIVIAStudent.safeStorageGet(STORAGE_KEYS.EVENTS, [
      { id: 'ev_1', text: 'Ahmad Fauzi menyelesaikan Basic Measurement Lab', time: '14:10' },
      { id: 'ev_2', text: 'Budi Santoso mengirimkan permintaan bantuan 🆘 NEED HELP', time: '14:12' },
      { id: 'ev_3', text: 'Citra Dewi memperoleh Lencana 🎓 EXPERIMENT MASTER', time: '14:15' }
    ]);
  }

  function addLiveEvent(eventText) {
    const events = getLiveEvents();
    events.unshift({
      id: 'ev_' + Date.now(),
      text: eventText,
      time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    });
    if (events.length > 20) events.pop(); // Keep max 20 events
    window.FIVIAStudent.safeStorageSet(STORAGE_KEYS.EVENTS, events);
    return events;
  }

  function requestStudentHelp(studentName, activityTitle) {
    const msg = `${studentName || 'Siswa'} meminta bantuan pada ${activityTitle || 'Praktikum Virtual'}`;
    addLiveEvent(`🆘 HELP REQUEST: ${msg}`);

    const requests = window.FIVIAStudent.safeStorageGet(STORAGE_KEYS.HELP_REQUESTS, []);
    requests.push({
      studentName: studentName || 'Siswa',
      activity: activityTitle || 'Aktivitas',
      requestedAt: new Date().toISOString()
    });
    window.FIVIAStudent.safeStorageSet(STORAGE_KEYS.HELP_REQUESTS, requests);

    alert('🆘 PERMINTAAN BANTUAN TERKIRIM KE GURU!\n\nGuru Anda akan memberikan petunjuk atau mengaktifkan pendampingan AI Tutor.');
  }

  function getStudentCards() {
    return DEFAULT_STUDENT_CARDS;
  }

  return {
    getLiveEvents: getLiveEvents,
    addLiveEvent: addLiveEvent,
    requestStudentHelp: requestStudentHelp,
    getStudentCards: getStudentCards
  };
})();
