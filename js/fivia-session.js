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
      students: [
        { studentId: 'STD-101', name: 'Ahmad Dahlan', class: 'X-1', score: 1450, xp: 450, accuracy: 92, masteryLevel: 'MASTER', masteryLabel: 'MASTER — Sangat Menguasai', status: 'MASTER', joinedAt: new Date().toISOString() },
        { studentId: 'STD-102', name: 'Budi Santoso', class: 'X-1', score: 1200, xp: 380, accuracy: 84, masteryLevel: 'ADVANCED', masteryLabel: 'ADVANCED — Menguasai', status: 'ADVANCED', joinedAt: new Date().toISOString() },
        { studentId: 'STD-103', name: 'Citra Dewi', class: 'X-1', score: 1100, xp: 340, accuracy: 78, masteryLevel: 'PROFICIENT', masteryLabel: 'PROFICIENT — Cukup Menguasai', status: 'PROFICIENT', joinedAt: new Date().toISOString() },
        { studentId: 'STD-104', name: 'Dinda Lestari', class: 'X-1', score: 950, xp: 290, accuracy: 68, masteryLevel: 'DEVELOPING', masteryLabel: 'DEVELOPING — Sedang Berkembang', status: 'DEVELOPING', joinedAt: new Date().toISOString() },
        { studentId: 'STD-105', name: 'Eko Prasetyo', class: 'X-1', score: 720, xp: 210, accuracy: 54, masteryLevel: 'NEEDS_REMEDIATION', masteryLabel: 'NEEDS REMEDIATION — Perlu Penguatan', status: 'REMEDIATION', joinedAt: new Date().toISOString() }
      ],
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
