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
    classroomId: 'cls_x1',
    className: 'Kelas X-1',
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

    // 1. Try window.db.getTable('classes')
    if (window.db && typeof window.db.getTable === 'function') {
      classes = window.db.getTable('classes') || [];
    }

    // 2. Try FIVIAClassroom
    if ((!classes || classes.length === 0) && window.FIVIAClassroom && typeof window.FIVIAClassroom.getClassrooms === 'function') {
      classes = window.FIVIAClassroom.getClassrooms();
    }

    // 3. Try localStorage
    if (!classes || classes.length === 0) {
      try {
        const saved = localStorage.getItem('vlab_fisika_classes') || localStorage.getItem('fivia_classrooms');
        if (saved) classes = JSON.parse(saved);
      } catch (e) {}
    }

    if (!classes || classes.length === 0) {
      classes = [
        { id: "cls_x1", name: "Kelas X-1" },
        { id: "cls_x2", name: "Kelas X-2" },
        { id: "cls_xi1", name: "Kelas XI IPA-1" },
        { id: "cls_xi2", name: "Kelas XI IPA-2" }
      ];
    }
    return classes;
  }

  function getRosterForClass(classId) {
    let roster = [];

    // 1. Try FIVIAExcelImport
    if (window.FIVIAExcelImport && typeof window.FIVIAExcelImport.getExistingRoster === 'function') {
      roster = window.FIVIAExcelImport.getExistingRoster();
    }

    // 2. Try window.db.getTable('students')
    if ((!roster || roster.length === 0) && window.db && typeof window.db.getTable === 'function') {
      const dbStudents = window.db.getTable('students') || [];
      if (dbStudents.length > 0) {
        roster = dbStudents.map(s => ({
          studentId: s.id || s.studentId,
          name: s.name || s.studentName,
          studentName: s.name || s.studentName,
          classId: s.classId || 'cls_x1',
          className: s.className || 'Kelas X-1',
          studentCode: s.studentCode || s.nis || ('STD-' + s.id)
        }));
      }
    }

    // 3. Try window.db.getTable('users') for role === 'siswa'
    if ((!roster || roster.length === 0) && window.db && typeof window.db.getTable === 'function') {
      const dbUsers = (window.db.getTable('users') || []).filter(u => u.role === 'siswa');
      if (dbUsers.length > 0) {
        roster = dbUsers.map(s => ({
          studentId: s.id || s.studentId,
          name: s.name || s.studentName,
          studentName: s.name || s.studentName,
          classId: s.classId || 'cls_x1',
          className: s.className || 'Kelas X-1',
          studentCode: s.studentCode || ('STD-' + s.id)
        }));
      }
    }

    // 4. Try localStorage 'fivia_student_roster'
    if (!roster || roster.length === 0) {
      try {
        const saved = localStorage.getItem('fivia_student_roster');
        if (saved) roster = JSON.parse(saved);
      } catch (e) {}
    }

    // 5. Try localStorage 'vlab_fisika_students'
    if (!roster || roster.length === 0) {
      try {
        const saved = localStorage.getItem('vlab_fisika_students');
        if (saved) roster = JSON.parse(saved);
      } catch (e) {}
    }

    roster = (roster || []).filter(s => s && (s.name || s.studentName) && s.status !== 'ARCHIVED');

    // Filter by class ONLY if matching records exist
    if (classId && classId !== 'ALL') {
      const filtered = roster.filter(s =>
        s.classId === classId ||
        s.className === classId ||
        (s.classId || '').toLowerCase().includes((classId || '').toLowerCase()) ||
        (s.className || '').toLowerCase().includes((classId || '').toLowerCase())
      );
      if (filtered.length > 0) {
        return filtered;
      }
    }

    return roster;
  }

  function autoGroupStudents(classId, numGroups) {
    const targetClassId = classId || 'cls_x1';
    const roster = getRosterForClass(targetClassId);
    numGroups = parseInt(numGroups) || 4;

    const defaultNames = ['Kelompok 1 (Newton)', 'Kelompok 2 (Einstein)', 'Kelompok 3 (Galileo)', 'Kelompok 4 (Tesla)', 'Kelompok 5 (Faraday)', 'Kelompok 6 (Maxwell)'];
    const groups = [];

    for (let g = 0; g < numGroups; g++) {
      groups.push({
        groupId: `grp_${Date.now().toString(36)}_${g + 1}`,
        groupName: defaultNames[g] || `Kelompok ${g + 1}`,
        score: 0,
        totalXP: 0,
        members: []
      });
    }

    if (roster.length > 0) {
      roster.forEach((student, idx) => {
        const groupIdx = idx % numGroups;
        const studentName = student.name || student.studentName || 'Siswa ' + (idx + 1);
        groups[groupIdx].members.push({
          studentId: student.studentId || student.id || ('std_' + (idx + 1)),
          studentName: studentName,
          studentCode: student.studentCode || student.nis || ('FIVIA-X1-' + (idx + 1)),
          turnsPlayed: 0,
          xpContributed: 0,
          status: 'READY'
        });
      });
    }

    const classes = getClassrooms();
    const clsObj = classes.find(c => c.id === targetClassId || c.name === targetClassId) || classes[0] || { id: 'cls_x1', name: 'Kelas X-1' };

    sessionState.groups = groups;
    sessionState.classroomId = clsObj.id || targetClassId;
    sessionState.className = clsObj.name || 'Kelas X-1';
    saveSession();
    return groups;
  }

  function startSession(classId, groupId) {
    if (!sessionState.groups || sessionState.groups.length === 0) {
      autoGroupStudents(classId || 'cls_x1', 4);
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
