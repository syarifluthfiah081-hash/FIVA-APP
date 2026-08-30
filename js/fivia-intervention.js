/**
 * FIVIA TEACHER INTERVENTION ENGINE MODULE
 * Phase 7: Evidence Analysis, Priority Calculation & Teacher Interventions
 */

window.FIVIAIntervention = (function() {
  'use strict';

  const STORAGE_KEYS = {
    INTERVENTIONS: 'fivia_interventions',
    FEEDBACK: 'fivia_classroom_feedback'
  };

  const DEFAULT_INTERVENTIONS = [
    {
      id: 'int_01',
      studentName: 'Budi Santoso',
      priority: 'HIGH',
      badgeColor: '#f43f5e',
      issue: 'Kelemahan pada Analisis Dimensional & Persamaan',
      recommendation: 'Replay Level 04 Dimension Detective dan konseling AI Tutor.',
      targetLink: '#quest/dimension-detective',
      status: 'ACTIVE'
    },
    {
      id: 'int_02',
      studentName: 'Eko Prasetyo',
      priority: 'MEDIUM',
      badgeColor: '#f59e0b',
      issue: 'Tugas Praktikum Basic Measurement Lab Belum Selesai',
      recommendation: 'Tugaskan ulang praktikum terpandu dengan batas waktu baru.',
      targetLink: '#quest/virtual-lab',
      status: 'ACTIVE'
    },
    {
      id: 'int_03',
      studentName: 'Citra Dewi',
      priority: 'ENRICHMENT',
      badgeColor: '#06b6d4',
      issue: 'Mastery >95% (Kualifikasi Pengayaan)',
      recommendation: 'Tugaskan Proyek Real-World Solar Future.',
      targetLink: '#quest/project-mission',
      status: 'ACTIVE'
    }
  ];

  function getInterventions() {
    return window.FIVIAStudent.safeStorageGet(STORAGE_KEYS.INTERVENTIONS, DEFAULT_INTERVENTIONS);
  }

  function assignRemediation(studentName, activityLink) {
    const list = getInterventions();
    const item = list.find(i => i.studentName === studentName);
    if (item) item.status = 'ASSIGNED_REMEDIATION';
    window.FIVIAStudent.safeStorageSet(STORAGE_KEYS.INTERVENTIONS, list);

    alert(`✅ TUGAS REMEDIASI TERKIRIM KE ${studentName.toUpperCase()}!\n\nSiswa akan diarahkan ke modul: ${activityLink}`);
  }

  function assignEnrichment(studentName, activityLink) {
    const list = getInterventions();
    const item = list.find(i => i.studentName === studentName);
    if (item) item.status = 'ASSIGNED_ENRICHMENT';
    window.FIVIAStudent.safeStorageSet(STORAGE_KEYS.INTERVENTIONS, list);

    alert(`🎓 TUGAS PENGAYAAN TERKIRIM KE ${studentName.toUpperCase()}!\n\nSiswa akan diarahkan ke modul: ${activityLink}`);
  }

  function saveClassroomFeedback(studentName, category, comments) {
    const allFb = window.FIVIAStudent.safeStorageGet(STORAGE_KEYS.FEEDBACK, []);
    allFb.push({
      studentName: studentName,
      category: category || 'GUIDANCE', // 'PRAISE', 'GUIDANCE', 'REMEDIATION', 'ENRICHMENT'
      comments: comments || 'Perbaiki langkah investigasi ilmiah Anda.',
      createdAt: new Date().toISOString()
    });
    window.FIVIAStudent.safeStorageSet(STORAGE_KEYS.FEEDBACK, allFb);
    alert(`💬 FEEDBACK GURU BERHASIL DIKIRIMKAN KE ${studentName.toUpperCase()}!`);
  }

  return {
    getInterventions: getInterventions,
    assignRemediation: assignRemediation,
    assignEnrichment: assignEnrichment,
    saveClassroomFeedback: saveClassroomFeedback
  };
})();
