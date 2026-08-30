/**
 * FIVIA STUDENT SESSION MODULE
 * Phase 8: Student Identity Creation, Student Code Generator & Multi-Student Session Switching
 */

window.FIVIAStudentSession = (function() {
  'use strict';

  const STORAGE_KEYS = {
    SESSION: 'fivia_student_session',
    ACTIVE_USER: 'fivia_active_user'
  };

  function generateStudentCode(className, studentIndex = 1) {
    const classTag = (className || 'XIF').replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 4) || 'XIF';
    const numStr = String(studentIndex).padStart(3, '0');
    return `FIVIA-${classTag}-${numStr}`;
  }

  function getActiveStudentSession() {
    return window.FIVIAStudent.safeStorageGet(STORAGE_KEYS.SESSION, null);
  }

  function startStudentSession(name, className, classCode, studentCode) {
    const clsCode = classCode || 'FIVIA-XIF-2045';
    const stdCode = studentCode || generateStudentCode(className, Math.floor(Math.random() * 899 + 100));

    const session = {
      studentId: 'std_' + Date.now(),
      studentCode: stdCode,
      name: (name || 'Siswa FIVIA').trim(),
      className: (className || 'XI Fase F').trim(),
      classroomCode: clsCode,
      loginTime: new Date().toISOString()
    };

    window.FIVIAStudent.safeStorageSet(STORAGE_KEYS.SESSION, session);
    window.FIVIAPrivateAccess.setActiveMode('STUDENT');

    // Update global student profile
    const profile = window.FIVIAStudent.getStudentProfile();
    profile.name = session.name;
    profile.class = session.className;
    profile.absen = session.studentCode;
    window.FIVIAStudent.saveStudentProfile(profile);

    return session;
  }

  function switchStudent() {
    window.FIVIAStudent.safeStorageRemove(STORAGE_KEYS.SESSION);
    window.FIVIAPrivateAccess.setActiveMode('ACCESS');
    window.location.hash = '#quest/access';
  }

  function switchToTeacherMode() {
    const pin = prompt('🔐 MASUK MODE GURU\n\nMasukkan PIN Guru (Default: 123456):');
    if (pin !== null) {
      if (window.FIVIAPrivateAccess.verifyTeacherPin(pin)) {
        window.FIVIAPrivateAccess.setActiveMode('TEACHER');
        window.location.hash = '#quest/teacher-dashboard';
      } else {
        alert('❌ PIN GURU SALAH!\n\nAkses Mode Guru ditolak.');
      }
    }
  }

  return {
    generateStudentCode: generateStudentCode,
    getActiveStudentSession: getActiveStudentSession,
    startStudentSession: startStudentSession,
    switchStudent: switchStudent,
    switchToTeacherMode: switchToTeacherMode
  };
})();
