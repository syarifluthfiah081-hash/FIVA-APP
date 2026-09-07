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

  function getStudentCards() {
    try {
      const raw = localStorage.getItem('fivia_student_roster');
      const roster = raw ? JSON.parse(raw) : [];
      if (Array.isArray(roster) && roster.length > 0) {
        return roster.map((s, idx) => ({
          name: s.name || s.studentName,
          status: idx % 3 === 0 ? 'COMPLETED' : (idx % 2 === 0 ? 'ACTIVE' : 'IDLE'),
          activity: 'Pengukuran Dasar Fisika',
          progress: '100%',
          streak: 5,
          color: '#06b6d4'
        }));
      }
    } catch(e) {}
    return [];
  }

  function getLiveEvents() {
    return window.FIVIAStudent.safeStorageGet(STORAGE_KEYS.EVENTS, []);
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

  return {
    getLiveEvents: getLiveEvents,
    addLiveEvent: addLiveEvent,
    requestStudentHelp: requestStudentHelp,
    getStudentCards: getStudentCards
  };
})();
