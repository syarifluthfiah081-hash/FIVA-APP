/**
 * FIVIA ASSIGNMENT SYSTEM MODULE
 * Phase 7: Assignment Creation, Student Assignment Tracking & Workflow
 */

window.FIVIAAssignment = (function() {
  'use strict';

  const STORAGE_KEYS = {
    ASSIGNMENTS: 'fivia_assignments',
    PROGRESS: 'fivia_assignment_progress'
  };

  const DEFAULT_ASSIGNMENTS = [
    {
      id: 'asg_01',
      title: 'Tugas 1: Pengukuran & Ketidakpastian',
      description: 'Selesaikan eksperimen Basic Measurement Lab dan kumpulkan LKPD Digital.',
      activityType: 'LAB',
      selectedActivity: 'lab_exp_01',
      targetClassId: 'cls_2045_x1',
      deadline: new Date(Date.now() + 86400000 * 3).toISOString(),
      xpReward: 150,
      instructions: 'Pastikan mengukur minimal 3 kali pengulangan objek kelereng besi.',
      status: 'ACTIVE',
      createdAt: new Date().toISOString()
    },
    {
      id: 'asg_02',
      title: 'Tugas 2: Evaluasi Dimensi & Analisis Persamaan',
      description: 'Selesaikan Mastery Assessment 60 soal evaluasi dimensi.',
      activityType: 'ASSESSMENT',
      selectedActivity: 'mastery_assessment',
      targetClassId: 'cls_2045_x1',
      deadline: new Date(Date.now() + 86400000 * 5).toISOString(),
      xpReward: 200,
      instructions: 'Kerjakan secara mandiri dalam durasi 45 menit.',
      status: 'ACTIVE',
      createdAt: new Date().toISOString()
    }
  ];

  function getAssignments(classId) {
    const list = window.FIVIAStudent.safeStorageGet(STORAGE_KEYS.ASSIGNMENTS, DEFAULT_ASSIGNMENTS);
    if (!classId) return list;
    return list.filter(a => a.targetClassId === classId || a.targetClassId === 'ALL');
  }

  function createAssignment(title, desc, activityType, activityId, classId, deadlineDays, xp) {
    const list = getAssignments();
    const newAsg = {
      id: 'asg_' + Date.now(),
      title: title || 'Tugas Baru Fisika',
      description: desc || 'Deskripsi penugasan praktikum fisika.',
      activityType: activityType || 'QUEST',
      selectedActivity: activityId || 'lab_exp_01',
      targetClassId: classId || 'cls_2045_x1',
      deadline: new Date(Date.now() + 86400000 * (deadlineDays || 3)).toISOString(),
      xpReward: parseInt(xp) || 100,
      instructions: 'Selesaikan aktivitas tepat waktu.',
      status: 'ACTIVE',
      createdAt: new Date().toISOString()
    };
    list.push(newAsg);
    window.FIVIAStudent.safeStorageSet(STORAGE_KEYS.ASSIGNMENTS, list);
    return newAsg;
  }

  function getStudentAssignmentStatus(asgId, studentId) {
    const allProgress = window.FIVIAStudent.safeStorageGet(STORAGE_KEYS.PROGRESS, {});
    const key = `${asgId}_${studentId}`;
    return allProgress[key] || { status: 'NOT_STARTED', score: 0, completedAt: null };
  }

  function completeStudentAssignment(asgId, studentId, score = 100) {
    const allProgress = window.FIVIAStudent.safeStorageGet(STORAGE_KEYS.PROGRESS, {});
    const key = `${asgId}_${studentId}`;
    allProgress[key] = {
      status: 'COMPLETED',
      score: score,
      completedAt: new Date().toISOString()
    };
    window.FIVIAStudent.safeStorageSet(STORAGE_KEYS.PROGRESS, allProgress);
    return allProgress[key];
  }

  return {
    getAssignments: getAssignments,
    createAssignment: createAssignment,
    getStudentAssignmentStatus: getStudentAssignmentStatus,
    completeStudentAssignment: completeStudentAssignment
  };
})();
