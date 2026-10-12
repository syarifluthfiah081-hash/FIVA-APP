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

  /**
   * Add XP to current active student profile and update level status
   */
  function addXP(amount) {
    const profile = getStudentProfile();
    profile.xp = (profile.xp || 0) + amount;
    profile.totalGameScore = (profile.totalGameScore || 0) + amount;
    
    // Recalculate level based on XP
    if (profile.xp >= 1000) profile.level = 5;
    else if (profile.xp >= 650) profile.level = 4;
    else if (profile.xp >= 350) profile.level = 3;
    else if (profile.xp >= 150) profile.level = 2;
    else profile.level = 1;

    saveStudentProfile(profile);

    // Also update in roster if present
    if (window.FIVIAExcelImport) {
      const roster = window.FIVIAExcelImport.getExistingRoster();
      const idx = roster.findIndex(s => s.studentId === profile.studentId || s.studentCode === profile.studentCode);
      if (idx !== -1) {
        roster[idx] = { ...roster[idx], ...profile };
        window.FIVIAExcelImport.saveRoster(roster);
      }
    }
    return profile;
  }

  /**
   * Award Badge to student profile
   */
  function awardBadge(badgeTitle) {
    const profile = getStudentProfile();
    if (!Array.isArray(profile.badges)) profile.badges = [];
    if (!profile.badges.includes(badgeTitle)) {
      profile.badges.push(badgeTitle);
      saveStudentProfile(profile);
    }
    return profile;
  }

  /**
   * Mark level as completed in profile
   */
  function completeLevel(levelNum) {
    const profile = getStudentProfile();
    if (!profile.levelsCompleted) {
      profile.levelsCompleted = { level1: false, level2: false, level3: false, level4: false, level5: false };
    }
    profile.levelsCompleted[`level${levelNum}`] = true;
    
    // Unlock next level if levelNum < 5
    if (profile.level < levelNum + 1) {
      profile.level = Math.min(5, levelNum + 1);
    }

    saveStudentProfile(profile);
    return profile;
  }

  /**
   * Finds student by NIS or Student Code or Name + Class
   */
  function loginStudentByNisOrCode(nisOrCode, className, nameHint) {
    if (!nisOrCode && !nameHint) return null;
    const searchKey = String(nisOrCode || '').trim().toUpperCase();
    const cleanClass = String(className || '').trim().toUpperCase();
    const cleanNameHint = String(nameHint || '').trim().toUpperCase();
    const searchDigits = String(nisOrCode || '').replace(/[^0-9]/g, '').replace(/^0+/, '');

    let allCandidates = [];

    // 1. Excel/Main Roster
    try {
      let roster = [];
      if (window.FIVIAExcelImport && typeof window.FIVIAExcelImport.getExistingRoster === 'function') {
        roster = window.FIVIAExcelImport.getExistingRoster() || [];
      } else {
        const raw = localStorage.getItem('fivia_student_roster');
        if (raw) roster = JSON.parse(raw);
      }
      if (Array.isArray(roster)) allCandidates.push(...roster);
    } catch (e) {}

    // 2. window.db students table
    if (window.db && typeof window.db.getTable === 'function') {
      const dbStudents = window.db.getTable('students') || [];
      if (Array.isArray(dbStudents)) allCandidates.push(...dbStudents);

      const dbUsers = window.db.getTable('users') || [];
      if (Array.isArray(dbUsers)) {
        allCandidates.push(...dbUsers.filter(u => (u.role || '').toLowerCase() === 'siswa'));
      }
    }

    // 3. fivia_classroom_students
    try {
      const rawCs = localStorage.getItem('fivia_classroom_students');
      if (rawCs) {
        const cs = JSON.parse(rawCs);
        if (Array.isArray(cs)) allCandidates.push(...cs);
      }
    } catch (e) {}

    // Match by studentCode OR NIS OR Name
    const match = allCandidates.find(s => {
      const sCode = String(s.studentCode || s.code || '').toUpperCase();
      const sNis = String(s.nis || '').toUpperCase();
      const sName = String(s.name || s.studentName || s.displayName || '').toUpperCase();
      const sDigits = sNis.replace(/[^0-9]/g, '').replace(/^0+/, '');
      const sClass = String(s.className || s.classId || '').toUpperCase();

      const codeMatches = searchKey && (sCode === searchKey);
      const nisMatches = searchKey && (sNis === searchKey || (searchDigits && sDigits === searchDigits));
      const nameMatches = (searchKey && sName && (sName === searchKey || sName.includes(searchKey) || searchKey.includes(sName))) ||
                          (cleanNameHint && sName && (sName === cleanNameHint || sName.includes(cleanNameHint) || cleanNameHint.includes(sName)));

      if (codeMatches) return true;
      if (nisMatches) {
        if (!cleanClass) return true;
        return sClass.includes(cleanClass) || cleanClass.includes(sClass) || !sClass;
      }
      if (nameMatches && (nisMatches || !searchKey)) {
        return true;
      }
      return false;
    });

    if (match) {
      const formattedMatch = {
        name: match.name || match.studentName || match.displayName || 'Siswa',
        nis: match.nis || searchKey,
        studentCode: match.studentCode || match.code || ('FIVIA-' + (match.nis || searchKey)),
        className: match.className || match.classId || className || 'X.F.1',
        classId: match.classId || match.className || className || 'cls_x1'
      };
      saveStudentProfile(formattedMatch);

      // Also sync to auth session if available
      if (window.auth && typeof window.auth.directLoginStudent === 'function') {
        window.auth.directLoginStudent(formattedMatch);
      }

      return formattedMatch;
    }
    return null;
  }

  return {
    safeStorageSet: safeStorageSet,
    safeStorageGet: safeStorageGet,
    safeStorageRemove: safeStorageRemove,
    getStudentProfile: getStudentProfile,
    saveStudentProfile: saveStudentProfile,
    recordAssessmentCompletion: recordAssessmentCompletion,
    addXP: addXP,
    awardBadge: awardBadge,
    completeLevel: completeLevel,
    loginStudentByNisOrCode: loginStudentByNisOrCode
  };
})();

