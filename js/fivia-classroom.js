/**
 * FIVIA CLASSROOM MANAGEMENT MODULE
 * Phase 7: Classrooms, Unique Code Generation & Student Roster System
 */

window.FIVIAClassroom = (function() {
  'use strict';

  const STORAGE_KEYS = {
    CLASSROOMS: 'fivia_classrooms',
    STUDENTS: 'fivia_classroom_students'
  };

  const DEFAULT_CLASSROOMS = [
    { id: "cls_x1", name: "Kelas X-1", school: "SMA Negeri FIVIA", subject: "Fisika SMA", grade: "X", code: "FIVIA-X1-1001", createdAt: new Date().toISOString() },
    { id: "cls_x2", name: "Kelas X-2", school: "SMA Negeri FIVIA", subject: "Fisika SMA", grade: "X", code: "FIVIA-X2-1002", createdAt: new Date().toISOString() },
    { id: "cls_xi1", name: "Kelas XI IPA-1", school: "SMA Negeri FIVIA", subject: "Fisika SMA", grade: "XI", code: "FIVIA-XI1-1003", createdAt: new Date().toISOString() },
    { id: "cls_xi2", name: "Kelas XI IPA-2", school: "SMA Negeri FIVIA", subject: "Fisika SMA", grade: "XI", code: "FIVIA-XI2-1004", createdAt: new Date().toISOString() }
  ];

  function getClassrooms() {
    const classMap = new Map();

    // 1. Gather classrooms directly from uploaded student roster in Manajemen Kelas
    let roster = [];
    if (window.FIVIAExcelImport && typeof window.FIVIAExcelImport.getExistingRoster === 'function') {
      roster = window.FIVIAExcelImport.getExistingRoster() || [];
    }
    if (!roster || roster.length === 0) {
      try {
        const saved = localStorage.getItem('fivia_student_roster');
        if (saved) roster = JSON.parse(saved);
      } catch (e) {}
    }

    if (Array.isArray(roster) && roster.length > 0) {
      roster.forEach(s => {
        const cName = (s.className || s.classId || s.kelas || '').trim();
        if (cName) {
          const cId = s.classId || ('cls_' + cName.toLowerCase().replace(/[^a-z0-9]/g, ''));
          if (!classMap.has(cId) && !Array.from(classMap.values()).some(c => c.name === cName)) {
            classMap.set(cId, {
              id: cId,
              name: cName,
              school: "SMA Negeri FIVIA",
              subject: "Fisika SMA",
              grade: cName.toUpperCase().includes('XI') ? 'XI' : 'X',
              code: 'FIVIA-' + cName.replace(/[^A-Z0-9]/g, '').toUpperCase()
            });
          }
        }
      });
    }

    // 2. Gather from stored classrooms
    let classes = window.FIVIAStudent ? window.FIVIAStudent.safeStorageGet(STORAGE_KEYS.CLASSROOMS, []) : [];
    if (!classes || classes.length === 0) {
      if (window.db && typeof window.db.getTable === 'function') {
        classes = window.db.getTable("classes") || [];
      }
    }

    if (Array.isArray(classes)) {
      classes.forEach(c => {
        if (c && c.name) {
          const cId = c.id || ('cls_' + c.name.toLowerCase().replace(/[^a-z0-9]/g, ''));
          if (!classMap.has(cId) && !Array.from(classMap.values()).some(x => x.name === c.name)) {
            classMap.set(cId, c);
          }
        }
      });
    }

    let finalClasses = Array.from(classMap.values());
    if (!finalClasses || finalClasses.length === 0) {
      finalClasses = DEFAULT_CLASSROOMS;
    }
    return finalClasses;
  }

  function saveClassrooms(classes) {
    window.FIVIAStudent.safeStorageSet(STORAGE_KEYS.CLASSROOMS, classes);
  }

  function createClassroom(name, school, subject, grade) {
    const classes = getClassrooms();
    const codeNumber = Math.floor(1000 + Math.random() * 9000);
    const newClass = {
      id: 'cls_' + Date.now(),
      name: name || 'Kelas Fisika Baru',
      school: school || 'SMA Negeri FIVIA 2045',
      subject: subject || 'Fisika SMA',
      academicYear: '2025/2026',
      grade: grade || 'XI',
      code: `FIVIA-${(grade || 'X').toUpperCase()}-${codeNumber}`,
      createdAt: new Date().toISOString()
    };
    classes.push(newClass);
    saveClassrooms(classes);
    return newClass;
  }

  function getClassroomByCode(code) {
    const classes = getClassrooms();
    return classes.find(c => c.code.toUpperCase() === (code || '').trim().toUpperCase()) || null;
  }

  function getRoster(classId) {
    const allStudents = window.FIVIAStudent.safeStorageGet(STORAGE_KEYS.STUDENTS, []);
    if (!classId) return allStudents;
    return allStudents.filter(s => s.classId === classId);
  }

  function joinClassroom(studentName, classCode) {
    const cls = getClassroomByCode(classCode);
    if (!cls) return { success: false, message: 'Kode kelas tidak ditemukan.' };

    const allStudents = window.FIVIAStudent.safeStorageGet(STORAGE_KEYS.STUDENTS, []);
    let student = allStudents.find(s => s.displayName === studentName && s.classId === cls.id);

    if (!student) {
      student = {
        studentId: 'std_' + Date.now(),
        displayName: studentName,
        classId: cls.id,
        joinedAt: new Date().toISOString(),
        totalXP: 350,
        levelProgress: 'Level 05 Dimension Boss',
        mastery: '88% (ADVANCED)',
        labProgress: '3/5 Praktikum',
        projectProgress: '2/5 Proyek',
        badgeCount: 5,
        lastActive: new Date().toISOString(),
        interventionStatus: 'NONE'
      };
      allStudents.push(student);
      window.FIVIAStudent.safeStorageSet(STORAGE_KEYS.STUDENTS, allStudents);
    }

    return { success: true, classroom: cls, student: student };
  }

  function removeClassroom(classIdOrName) {
    let classes = getClassrooms();
    const filtered = classes.filter(c => c.id !== classIdOrName && c.name !== classIdOrName);
    saveClassrooms(filtered);
    if (window.db && typeof window.db.getTable === 'function') {
      let dbClasses = window.db.getTable("classes") || [];
      dbClasses = dbClasses.filter(c => c.id !== classIdOrName && c.name !== classIdOrName);
      window.db.saveTable("classes", dbClasses);
    }
    return filtered;
  }

  return {
    getClassrooms: getClassrooms,
    createClassroom: createClassroom,
    removeClassroom: removeClassroom,
    getClassroomByCode: getClassroomByCode,
    getRoster: getRoster,
    joinClassroom: joinClassroom
  };
})();

