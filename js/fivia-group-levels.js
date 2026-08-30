/**
 * FIVIA GROUP LEVELS MODULE
 * Phase 10.1: Level Progression State, Unlock Rules, Team Lives & Combo Tracker
 */

window.FIVIAGroupLevels = (function() {
  'use strict';

  const STORAGE_KEY = 'fivia_group_level_progression';

  const LEVEL_METADATA = {
    LEVEL_01: {
      id: 'LEVEL_01',
      code: 'LEVEL 01',
      title: 'BESARAN HUNTER',
      color: 'var(--fq-emerald)',
      badge: '🟢',
      focus: 'Pengertian besaran, besaran pokok, besaran turunan, membedakan besaran dan contohnya.',
      totalRounds: 5,
      questionsRequired: 10,
      unlockedByDefault: true
    },
    LEVEL_02: {
      id: 'LEVEL_02',
      code: 'LEVEL 02',
      title: 'UNIT MASTER',
      color: 'var(--fq-cyan)',
      badge: '🔵',
      focus: 'Satuan SI, satuan besaran pokok dan turunan, mencocokkan besaran dengan satuan.',
      totalRounds: 5,
      questionsRequired: 10,
      unlockedByDefault: true
    },
    LEVEL_03: {
      id: 'LEVEL_03',
      code: 'LEVEL 03',
      title: 'DIMENSION DETECTIVE',
      color: 'var(--fq-violet)',
      badge: '🟣',
      focus: 'Simbol dimensi, dimensi besaran pokok, dan dimensi besaran turunan.',
      totalRounds: 5,
      questionsRequired: 10,
      unlockedByDefault: true
    },
    LEVEL_04: {
      id: 'LEVEL_04',
      code: 'LEVEL 04',
      title: 'PHYSICS ANALYST',
      color: 'var(--fq-amber)',
      badge: '🟠',
      focus: 'Analisis konsistensi dimensi persamaan fisika (x = vt + ½at², F = ma).',
      totalRounds: 5,
      questionsRequired: 10,
      unlockedByDefault: true
    },
    LEVEL_05: {
      id: 'LEVEL_05',
      code: 'LEVEL 05',
      title: 'PHYSICS BOSS',
      color: 'var(--fq-rose)',
      badge: '🔴',
      focus: 'HOTS Multi-step Tantangan Kelompok, analisis kasus gabungan besaran+satuan+dimensi.',
      totalRounds: 5,
      questionsRequired: 10,
      unlockedByDefault: true
    }
  };

  let levelState = {
    activeLevelId: 'LEVEL_01',
    teamLives: 3,
    maxLives: 3,
    comboStreak: 0,
    currentQuestionIndex: 0,
    questionsCompleted: 0,
    correctAnswersCount: 0,
    totalQuestionsCount: 0,
    teacherBypassMode: true,
    levelProgress: {
      LEVEL_01: { completed: false, accuracy: 0, highestScore: 0 },
      LEVEL_02: { completed: false, accuracy: 0, highestScore: 0 },
      LEVEL_03: { completed: false, accuracy: 0, highestScore: 0 },
      LEVEL_04: { completed: false, accuracy: 0, highestScore: 0 },
      LEVEL_05: { completed: false, accuracy: 0, highestScore: 0 }
    }
  };

  function init() {
    loadLocalProgress();
  }

  function loadLocalProgress() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        levelState = { ...levelState, ...parsed };
      }
    } catch (e) {
      console.warn('Failed to load level progress:', e);
    }
  }

  function saveProgress() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(levelState));
    } catch (e) {}
  }

  function toggleTeacherBypassMode() {
    levelState.teacherBypassMode = !levelState.teacherBypassMode;
    saveProgress();
    return levelState.teacherBypassMode;
  }

  function isLevelUnlocked(levelId) {
    return true; // All levels are 100% unlocked unconditionally!
  }

  function startLevelSession(levelId) {
    levelState.activeLevelId = levelId || 'LEVEL_01';
    levelState.teamLives = 3;
    levelState.comboStreak = 0;
    levelState.currentQuestionIndex = 0;
    levelState.questionsCompleted = 0;
    levelState.correctAnswersCount = 0;
    levelState.totalQuestionsCount = 0;
    saveProgress();
    return levelState;
  }

  function deductTeamLife() {
    levelState.comboStreak = 0;
    levelState.teamLives = Math.max(0, levelState.teamLives - 1);
    saveProgress();
    return levelState.teamLives;
  }

  function addTeamLife() {
    levelState.teamLives = Math.min(levelState.maxLives, levelState.teamLives + 1);
    saveProgress();
    return levelState.teamLives;
  }

  function registerAnswerResult(isCorrect) {
    levelState.totalQuestionsCount++;
    if (isCorrect) {
      levelState.correctAnswersCount++;
      levelState.comboStreak++;
    } else {
      deductTeamLife();
    }
    levelState.questionsCompleted++;

    const currentAcc = Math.round((levelState.correctAnswersCount / Math.max(1, levelState.totalQuestionsCount)) * 100);
    const activeMeta = LEVEL_METADATA[levelState.activeLevelId];
    const progress = levelState.levelProgress[levelState.activeLevelId] || { completed: false, accuracy: 0, highestScore: 0 };

    progress.accuracy = Math.max(progress.accuracy, currentAcc);

    if (levelState.questionsCompleted >= (activeMeta ? activeMeta.questionsRequired : 10)) {
      progress.completed = true;
    }

    levelState.levelProgress[levelState.activeLevelId] = progress;
    saveProgress();

    return {
      isCorrect,
      comboStreak: levelState.comboStreak,
      teamLives: levelState.teamLives,
      accuracy: currentAcc,
      completed: progress.completed
    };
  }

  function getLevelMetadata(levelId) { return LEVEL_METADATA[levelId] || LEVEL_METADATA.LEVEL_01; }
  function getAllLevels() { return LEVEL_METADATA; }
  function getLevelState() { return levelState; }

  return {
    init: init,
    getAllLevels: getAllLevels,
    getLevelMetadata: getLevelMetadata,
    getLevelState: getLevelState,
    isLevelUnlocked: isLevelUnlocked,
    toggleTeacherBypassMode: toggleTeacherBypassMode,
    startLevelSession: startLevelSession,
    deductTeamLife: deductTeamLife,
    addTeamLife: addTeamLife,
    registerAnswerResult: registerAnswerResult
  };
})();
