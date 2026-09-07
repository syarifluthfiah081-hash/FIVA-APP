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

  function getInterventions() {
    const defaultInterventions = (function() {
      try {
        const raw = localStorage.getItem('fivia_student_roster');
        const roster = raw ? JSON.parse(raw) : [];
        if (Array.isArray(roster) && roster.length > 0) {
          return roster.slice(0, 3).map((s, idx) => ({
            id: 'int_0' + (idx + 1),
            studentName: s.name || s.studentName,
            priority: idx === 0 ? 'HIGH' : (idx === 1 ? 'MEDIUM' : 'ENRICHMENT'),
            badgeColor: idx === 0 ? '#f43f5e' : (idx === 1 ? '#f59e0b' : '#06b6d4'),
            issue: 'Kelemahan pada Analisis Dimensional & Persamaan',
            recommendation: 'Replay Level 04 Dimension Detective dan konseling AI Tutor.',
            targetLink: '#quest/dimension-detective',
            status: 'ACTIVE'
          }));
        }
      } catch(e) {}
      return [];
    })();
    return window.FIVIAStudent.safeStorageGet(STORAGE_KEYS.INTERVENTIONS, defaultInterventions);
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
