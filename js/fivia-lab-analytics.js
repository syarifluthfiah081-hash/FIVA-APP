/**
 * FIVIA VIRTUAL PHYSICS LAB - ANALYTICS, SCORING & BADGES
 * Phase 5: Teacher Lab Analytics, Badges, and Feedback Storage
 */

window.FIVIALabAnalytics = (function() {
  'use strict';

  const STORAGE_KEYS = {
    LAB_PROGRESS: 'fivia_virtual_lab_progress',
    LAB_FEEDBACK: 'fivia_lab_feedback'
  };

  /**
   * Get Lab Progress State
   */
  function getLabProgress() {
    return window.FIVIAStudent.safeStorageGet(STORAGE_KEYS.LAB_PROGRESS, {
      completedExpIds: [],
      totalXp: 0,
      badges: [],
      lastCompletedAt: null
    });
  }

  /**
   * Record Completed Experiment
   */
  function recordLabCompletion(expId, xpEarned = 100) {
    const progress = getLabProgress();
    if (!progress.completedExpIds.includes(expId)) {
      progress.completedExpIds.push(expId);
      progress.totalXp += xpEarned;
    }
    progress.lastCompletedAt = new Date().toISOString();

    // Evaluate Lab Badges
    if (!progress.badges.includes('🔬 LAB EXPLORER') && progress.completedExpIds.length >= 1) {
      progress.badges.push('🔬 LAB EXPLORER');
    }
    if (!progress.badges.includes('🧪 EXPERIMENT MASTER') && progress.completedExpIds.length >= 3) {
      progress.badges.push('🧪 EXPERIMENT MASTER');
    }
    if (!progress.badges.includes('⚙️ PHYSICS EXPERIMENTER') && progress.completedExpIds.length >= 5) {
      progress.badges.push('⚙️ PHYSICS EXPERIMENTER');
    }
    if (!progress.badges.includes('📊 DATA ANALYST') && progress.completedExpIds.length >= 2) {
      progress.badges.push('📊 DATA ANALYST');
    }

    window.FIVIAStudent.safeStorageSet(STORAGE_KEYS.LAB_PROGRESS, progress);

    // Update global student profile
    const student = window.FIVIAStudent.getStudentProfile();
    student.xp += xpEarned;
    if (!Array.isArray(student.badges)) student.badges = [];
    progress.badges.forEach(b => {
      if (!student.badges.includes(b)) student.badges.push(b);
    });
    window.FIVIAStudent.saveStudentProfile(student);

    return progress;
  }

  /**
   * Save Teacher Feedback for Experiment LKPD
   */
  function saveTeacherFeedback(expId, studentId, status, comments) {
    const allFeedback = window.FIVIAStudent.safeStorageGet(STORAGE_KEYS.LAB_FEEDBACK, {});
    const key = `${expId}_${studentId}`;
    allFeedback[key] = {
      expId: expId,
      studentId: studentId,
      status: status || '✓ APPROVED', // '✓ APPROVED', '⚠ REVISION REQUIRED', '🔁 REPEAT EXPERIMENT'
      comments: comments || 'Performa eksperimen dan laporan LKPD sangat baik.',
      updatedAt: new Date().toISOString()
    };

    window.FIVIAStudent.safeStorageSet(STORAGE_KEYS.LAB_FEEDBACK, allFeedback);
    return allFeedback[key];
  }

  /**
   * Get Lab Analytics Summary for Teacher Dashboard
   */
  function getTeacherLabSummary() {
    const progress = getLabProgress();
    const totalExpCount = 5;
    const completedCount = progress.completedExpIds.length;
    const pct = Math.round((completedCount / totalExpCount) * 100);

    return {
      completedExperiments: completedCount,
      totalExperiments: totalExpCount,
      completionPct: pct,
      totalXpEarned: progress.totalXp,
      badgesEarned: progress.badges
    };
  }

  return {
    getLabProgress: getLabProgress,
    recordLabCompletion: recordLabCompletion,
    saveTeacherFeedback: saveTeacherFeedback,
    getTeacherLabSummary: getTeacherLabSummary
  };
})();
