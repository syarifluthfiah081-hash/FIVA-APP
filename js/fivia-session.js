/**
 * FIVIA PHYSICS QUEST - PHASE 4: CLASSROOM SESSION MANAGER
 * Classroom Session Creation, Code Generation, Join Class Architecture
 */

window.FIVIASession = (function() {
  'use strict';

  const STORAGE_KEYS = {
    SESSION: 'fivia_classroom_session'
  };

  /**
   * Generate Random Session Code
   */
  function generateSessionCode() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = 'FIVIA-';
    for (let i = 0; i < 4; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }

  /**
   * Create New Classroom Session
   */
  function createSession(sessionName, className, teacherName, maxStudents = 36) {
    const sessionObj = {
      sessionId: 'SES-' + Date.now(),
      sessionCode: generateSessionCode(),
      sessionName: sessionName || 'Sesi Pembelajaran Fisika',
      className: className || 'Kelas X',
      teacherName: teacherName || 'Guru Fisika',
      createdAt: new Date().toISOString(),
      startedAt: new Date().toISOString(),
      endedAt: null,
      maxStudents: maxStudents,
      students: [],
      status: 'ACTIVE'
    };

    window.FIVIAStudent.safeStorageSet(STORAGE_KEYS.SESSION, sessionObj);
    return sessionObj;
  }

  /**
   * Get Active Classroom Session
   */
  function getActiveSession() {
    const session = window.FIVIAStudent.safeStorageGet(STORAGE_KEYS.SESSION, null);
    if (session && session.status === 'ACTIVE') return session;

    // Default mock session for immediate teacher demo if none exists
    const defaultSession = {
      sessionId: 'SES-DEMO-01',
      sessionCode: 'FIVIA-2045',
      sessionName: 'Sesi Fisika Kelas X-1',
      className: 'X-1',
      teacherName: 'Drs. Supriyadi, M.Pd.',
      createdAt: new Date().toISOString(),
      startedAt: new Date().toISOString(),
      endedAt: null,
      maxStudents: 36,
      students: (function() {
        try {
          const raw = localStorage.getItem('fivia_student_roster');
          const roster = raw ? JSON.parse(raw) : [];
          if (Array.isArray(roster) && roster.length > 0) {
            return roster.map(s => ({
              studentId: s.studentId || s.id || ('STD-' + Math.floor(Math.random() * 1000)),
              name: s.name || s.studentName,
              class: s.className || s.kelas || 'X-1',
              score: s.groupPlayScore || 0,
              xp: s.xp || 0,
              accuracy: 85,
              masteryLevel: 'PROFICIENT',
              masteryLabel: 'PROFICIENT — Cukup Menguasai',
              status: 'PROFICIENT',
              joinedAt: new Date().toISOString()
            }));
          }
        } catch(e) {}
        return [];
      })(),
      status: 'ACTIVE'
    };

    window.FIVIAStudent.safeStorageSet(STORAGE_KEYS.SESSION, defaultSession);
    return defaultSession;
  }

  /**
   * Student Join Class Session
   */
  function joinSession(sessionCode, studentName, studentClass) {
    const session = getActiveSession();
    if (!session) return { success: false, message: 'Kode kelas tidak ditemukan.' };

    const cleanInputCode = sessionCode.trim().toUpperCase();
    if (cleanInputCode !== session.sessionCode.toUpperCase()) {
      return { success: false, message: 'Kode sesi kelas salah atau tidak aktif.' };
    }

    const newStudentEntry = {
      studentId: 'STD-' + Math.floor(1000 + Math.random() * 9000),
      name: studentName.trim(),
      class: studentClass.trim(),
      score: 0,
      xp: 0,
      accuracy: 0,
      masteryLevel: 'DEVELOPING',
      masteryLabel: 'DEVELOPING — Sedang Berkembang',
      status: 'DEVELOPING',
      joinedAt: new Date().toISOString()
    };

    // Prevent duplicates
    const existingIdx = session.students.findIndex(s => s.name.toLowerCase() === newStudentEntry.name.toLowerCase());
    if (existingIdx >= 0) {
      session.students[existingIdx] = { ...session.students[existingIdx], joinedAt: new Date().toISOString() };
    } else {
      session.students.push(newStudentEntry);
    }

    window.FIVIAStudent.safeStorageSet(STORAGE_KEYS.SESSION, session);
    return { success: true, message: 'Berhasil bergabung ke kelas!', session: session, student: newStudentEntry };
  }

  /**
   * End or Reset Session
   */
  function endSession() {
    const session = getActiveSession();
    if (session) {
      session.status = 'ENDED';
      session.endedAt = new Date().toISOString();
      window.FIVIAStudent.safeStorageSet(STORAGE_KEYS.SESSION, session);
    }
  }

  return {
    generateSessionCode: generateSessionCode,
    createSession: createSession,
    getActiveSession: getActiveSession,
    joinSession: joinSession,
    endSession: endSession
  };
})();
