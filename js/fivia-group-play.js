/**
 * FIVIA GROUP PLAY MODULE
 * Phase 10: State Machine, Group Manager & Round-Robin Player Turn System
 */

window.FIVIAGroupPlay = (function() {
  'use strict';

  const STORAGE_KEYS = {
    SESSION: 'fivia_group_play_session',
    GROUPS: 'fivia_group_play_groups',
    SETTINGS: 'fivia_group_play_settings'
  };

  let sessionState = {
    sessionId: null,
    classroomId: 'cls_xf1',
    className: 'XI FASE F',
    status: 'READY', // 'READY', 'RUNNING', 'PAUSED', 'COMPLETED'
    turnOrderMode: 'ROUND_ROBIN', // 'ROUND_ROBIN', 'RANDOM_ONCE', 'RANDOM_EVERY_ROUND', 'MANUAL'
    timerDuration: 30,
    currentRound: 1,
    turnIndex: 0,
    currentGroupIndex: 0,
    activePlayer: null,
    activeGroup: null,
    groups: [],
    history: [],
    difficultyFilter: 'ALL',
    timerIntervalId: null,
    timerTimeRemaining: 30,
    isPaused: false
  };

  function init() {
    loadLocalSession();
  }

  function loadLocalSession() {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SESSION);
      if (saved) {
        const parsed = JSON.parse(saved);
        sessionState = { ...sessionState, ...parsed };
      }
    } catch (e) {
      console.warn('Failed to load local group play session:', e);
    }
  }

  function saveSession() {
    try {
      localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(sessionState));
    } catch (e) {}
  }

  function getClassrooms() {
    let classes = [];
    if (window.FIVIAClassroom && typeof window.FIVIAClassroom.getClassrooms === 'function') {
      classes = window.FIVIAClassroom.getClassrooms();
    } else if (window.db && typeof window.db.getTable === 'function') {
      classes = window.db.getTable('classes');
    }
    if (!classes || classes.length === 0) {
      classes = [
        { id: 'cls_xf1', name: 'XI FASE F', code: 'FIVIA-XF1', studentCount: 36 },
        { id: 'cls_xe1', name: 'X FASE E', code: 'FIVIA-XE1', studentCount: 32 }
      ];
    }
    return classes;
  }

  function getRosterForClass(classId) {
    let roster = [];
    if (window.FIVIAExcelImport && typeof window.FIVIAExcelImport.getExistingRoster === 'function') {
      roster = window.FIVIAExcelImport.getExistingRoster();
    } else if (window.db && typeof window.db.getTable === 'function') {
      roster = window.db.getTable('students');
    }
    if (classId && classId !== 'ALL') {
      roster = roster.filter(s => s.classId === classId || s.className === classId || (s.classId || '').includes(classId));
    }
    return roster.filter(s => s.status !== 'ARCHIVED');
  }

  function autoGroupStudents(classId, numGroups) {
    const roster = getRosterForClass(classId);
    numGroups = parseInt(numGroups) || 4;

    const defaultNames = ['GROUP NEWTON', 'GROUP EINSTEIN', 'GROUP GALILEO', 'GROUP FARADAY', 'GROUP MAXWELL', 'GROUP TESLA', 'GROUP BOHR', 'GROUP CURIE'];
    const groups = [];

    for (let g = 0; g < numGroups; g++) {
      groups.push({
        groupId: `grp_${Date.now().toString(36)}_${g + 1}`,
        groupName: defaultNames[g] || `GROUP ${g + 1}`,
        score: 0,
        totalXP: 0,
        members: []
      });
    }

    if (roster.length > 0) {
      roster.forEach((student, idx) => {
        const groupIdx = idx % numGroups;
        groups[groupIdx].members.push({
          studentId: student.studentId || student.id,
          studentName: student.name,
          studentCode: student.studentCode || student.nis || ('STD-' + (idx + 1)),
          turnsPlayed: 0,
          xpContributed: 0,
          status: 'READY'
        });
      });
    } else {
      const sampleNames = [
        ['Ahmad Fauzan', 'Budi Santoso', 'Citra Dewi', 'Dinda Putri'],
        ['Eko Prasetyo', 'Fajar Ramadhan', 'Gita Gutawa', 'Hadi Wijaya'],
        ['Indah Permata', 'Joko Widodo', 'Kiki Amalia', 'Lia Lestari'],
        ['Miftah Hidayat', 'Nabila Syakieb', 'Oki Setiana', 'Putri Marino']
      ];
      for (let g = 0; g < numGroups; g++) {
        const names = sampleNames[g % 4];
        names.forEach(n => {
          groups[g].members.push({
            studentId: 'std_' + Math.random().toString(36).substring(2, 8),
            studentName: n,
            studentCode: 'FIVIA-STD-' + Math.floor(Math.random() * 900 + 100),
            turnsPlayed: 0,
            xpContributed: 0,
            status: 'READY'
          });
        });
      }
    }

    sessionState.groups = groups;
    sessionState.classroomId = classId;
    saveSession();
    return groups;
  }

  function startSession(classId, groupId) {
    if (!sessionState.groups || sessionState.groups.length === 0) {
      autoGroupStudents(classId || 'cls_xf1', 4);
    }

    sessionState.sessionId = 'GPS-' + Date.now().toString(36);
    sessionState.status = 'RUNNING';
    sessionState.currentRound = 1;
    sessionState.turnIndex = 0;
    sessionState.currentGroupIndex = 0;

    const group = sessionState.groups.find(g => g.groupId === groupId) || sessionState.groups[0];
    sessionState.activeGroup = group;
    sessionState.activePlayer = group.members[0] || null;

    if (sessionState.activePlayer) {
      sessionState.activePlayer.status = 'PLAYING';
    }

    saveSession();

    if (window.FIVIAGroupPlaySync && typeof window.FIVIAGroupPlaySync.syncSessionToFirebase === 'function') {
      window.FIVIAGroupPlaySync.syncSessionToFirebase(sessionState);
    }

    return sessionState;
  }

  function nextPlayerTurn() {
    if (!sessionState.groups || sessionState.groups.length === 0) return;

    // Reset status of previous active player
    if (sessionState.activePlayer) {
      sessionState.activePlayer.status = 'PLAYED';
    }

    // Move to next group or next member in round robin
    const currentGroup = sessionState.activeGroup || sessionState.groups[0];
    let memberIdx = currentGroup.members.findIndex(m => m.studentId === (sessionState.activePlayer ? sessionState.activePlayer.studentId : ''));

    if (memberIdx < 0 || memberIdx >= currentGroup.members.length - 1) {
      // Rotate group turn
      sessionState.currentGroupIndex = (sessionState.currentGroupIndex + 1) % sessionState.groups.length;
      const nextGroup = sessionState.groups[sessionState.currentGroupIndex];
      sessionState.activeGroup = nextGroup;

      // Find next member in round-robin order
      const unplayed = nextGroup.members.filter(m => m.status !== 'PLAYED');
      if (unplayed.length > 0) {
        sessionState.activePlayer = unplayed[0];
      } else {
        // Round complete for group, reset member statuses and advance round
        sessionState.currentRound++;
        nextGroup.members.forEach(m => m.status = 'READY');
        sessionState.activePlayer = nextGroup.members[0];
      }
    } else {
      // Next member in same group
      sessionState.activePlayer = currentGroup.members[memberIdx + 1];
    }

    if (sessionState.activePlayer) {
      sessionState.activePlayer.status = 'PLAYING';
      sessionState.activePlayer.turnsPlayed++;
    }

    saveSession();

    if (window.FIVIAGroupPlaySync && typeof window.FIVIAGroupPlaySync.syncSessionToFirebase === 'function') {
      window.FIVIAGroupPlaySync.syncSessionToFirebase(sessionState);
    }
  }

  function getSessionState() { return sessionState; }
  function setTimerDuration(seconds) { sessionState.timerDuration = parseInt(seconds) || 30; saveSession(); }
  function setTurnOrderMode(mode) { sessionState.turnOrderMode = mode; saveSession(); }
  function setDifficultyFilter(diff) { sessionState.difficultyFilter = diff; saveSession(); }

  return {
    init: init,
    getClassrooms: getClassrooms,
    getRosterForClass: getRosterForClass,
    autoGroupStudents: autoGroupStudents,
    startSession: startSession,
    nextPlayerTurn: nextPlayerTurn,
    getSessionState: getSessionState,
    setTimerDuration: setTimerDuration,
    setTurnOrderMode: setTurnOrderMode,
    setDifficultyFilter: setDifficultyFilter
  };
})();
