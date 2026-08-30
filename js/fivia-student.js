/**
 * FIVIA PHYSICS QUEST - PHASE 4: STUDENT PROFILE MODULE
 * Safe Storage Helpers and Student Profile State Management
 */

window.FIVIAStudent = (function() {
  'use strict';

  const STORAGE_KEYS = {
    STUDENT_PROFILE: 'fivia_student_profile',
    ASSESSMENT_RESULTS: 'fivia_assessment_results',
    REMEDIATION_DATA: 'fivia_remediation_data'
  };

  /**
   * Safe Storage Set
   */
  function safeStorageSet(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      console.error(`safeStorageSet failed for key ${key}:`, e);
      return false;
    }
  }

  /**
   * Safe Storage Get
   */
  function safeStorageGet(key, defaultValue = null) {
    try {
      const data = localStorage.getItem(key);
      if (data === null) return defaultValue;
      return JSON.parse(data);
    } catch (e) {
      console.error(`safeStorageGet failed for key ${key}:`, e);
      return defaultValue;
    }
  }

  /**
   * Safe Storage Remove
   */
  function safeStorageRemove(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (e) {
      console.error(`safeStorageRemove failed for key ${key}:`, e);
      return false;
    }
  }

  /**
   * Get Active Student Profile
   */
  function getStudentProfile() {
    const defaultProfile = {
      studentId: 'STD-' + Math.floor(100000 + Math.random() * 900000),
      name: 'Siswa Fivia',
      class: 'X-1',
      absen: '01',
      avatar: '👨‍🎓',
      xp: 0,
      totalGameScore: 0,
      assessmentScore: 0,
      accuracy: 0,
      masteryLevel: 'DEVELOPING',
      masteryLabel: 'DEVELOPING — Sedang Berkembang',
      badges: [],
      levelsCompleted: { level1: false, level2: false, level3: false, level4: false, level5: false },
      totalChallengesPlayed: 0,
      totalChallengesCorrect: 0,
      avgResponseTimeSec: 0,
      bestCombo: 0,
      lastActivity: new Date().toISOString(),
      weakestConcepts: [],
      strongestConcepts: []
    };

    return safeStorageGet(STORAGE_KEYS.STUDENT_PROFILE, defaultProfile);
  }

  /**
   * Save or Update Student Profile
   */
  function saveStudentProfile(profileData) {
    const current = getStudentProfile();
    const updated = { ...current, ...profileData, lastActivity: new Date().toISOString() };
    safeStorageSet(STORAGE_KEYS.STUDENT_PROFILE, updated);
    return updated;
  }

  /**
   * Update Student Assessment Stats
   */
  function recordAssessmentCompletion(assessmentResult) {
    const profile = getStudentProfile();
    profile.assessmentScore = assessmentResult.score;
    profile.accuracy = assessmentResult.accuracy;
    profile.masteryLevel = assessmentResult.masteryLevel;
    profile.masteryLabel = assessmentResult.masteryLabel;
    profile.weakestConcepts = assessmentResult.weakestConcepts || [];
    profile.strongestConcepts = assessmentResult.strongestConcepts || [];

    // Award Assessment Badges if eligible
    if (!Array.isArray(profile.badges)) profile.badges = [];

    if (assessmentResult.accuracy >= 90 && !profile.badges.includes('🎯 ASSESSMENT ACE')) {
      profile.badges.push('🎯 ASSESSMENT ACE');
    }
    if (assessmentResult.dimMastery >= 90 && !profile.badges.includes('🧠 DIMENSION MASTER')) {
      profile.badges.push('🧠 DIMENSION MASTER');
    }
    if (assessmentResult.accuracy >= 90 && profile.levelsCompleted.level5 && !profile.badges.includes('📚 PHYSICS SCHOLAR')) {
      profile.badges.push('📚 PHYSICS SCHOLAR');
    }

    saveStudentProfile(profile);
  }

  return {
    safeStorageSet: safeStorageSet,
    safeStorageGet: safeStorageGet,
    safeStorageRemove: safeStorageRemove,
    getStudentProfile: getStudentProfile,
    saveStudentProfile: saveStudentProfile,
    recordAssessmentCompletion: recordAssessmentCompletion
  };
})();
