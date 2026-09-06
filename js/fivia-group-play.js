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
    const classMap = new Map();

    // 1. Extract classrooms directly from uploaded student roster
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
            classMap.set(cId, { id: cId, name: cName });
          }
        }
      });
    }

    // 2. Also check FIVIAClassroom & window.db & localStorage
    if (window.FIVIAClassroom && typeof window.FIVIAClassroom.getClassrooms === 'function') {
      const fcClasses = window.FIVIAClassroom.getClassrooms() || [];
      fcClasses.forEach(c => {
        if (c && c.name) {
          const cId = c.id || ('cls_' + c.name.toLowerCase().replace(/[^a-z0-9]/g, ''));
          if (!classMap.has(cId) && !Array.from(classMap.values()).some(x => x.name === c.name)) {
            classMap.set(cId, { id: cId, name: c.name });
          }
        }
      });
    }

    let classes = Array.from(classMap.values());
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
    const studentMap = new Map();

    const addStudent = (s) => {
      if (!s) return;
      const name = s.name || s.studentName || s.nama;
      if (!name || s.status === 'ARCHIVED') return;

      const key = (s.studentId || s.id || s.studentCode || s.nis || name).toString().trim().toLowerCase();
      if (!studentMap.has(key)) {
        const cName = s.className || s.kelas || 'Kelas X-1';
        const cId = s.classId || s.kelasId || ('cls_' + cName.toLowerCase().replace(/[^a-z0-9]/g, ''));
        studentMap.set(key, {
          studentId: s.studentId || s.id || ('std_' + Math.random().toString(36).substr(2, 9)),
          name: name,
          studentName: name,
          classId: cId,
          className: cName,
          studentCode: s.studentCode || s.nis || ('STD-' + (s.id || Math.floor(Math.random() * 1000)))
        });
      }
    };

    // 1. Try FIVIAExcelImport
    if (window.FIVIAExcelImport && typeof window.FIVIAExcelImport.getExistingRoster === 'function') {
      const imp = window.FIVIAExcelImport.getExistingRoster() || [];
      imp.forEach(addStudent);
    }

    // 2. Try window.db.getTable('students')
    if (window.db && typeof window.db.getTable === 'function') {
      const dbStudents = (window.db.getTable('students') || []).filter(s => !['std_2', 'std_3', 'std_4', 'std_5'].includes(s.id || s.studentId));
      dbStudents.forEach(addStudent);
    }

    // 3. Try window.db.getTable('users') for role === 'siswa'
    if (window.db && typeof window.db.getTable === 'function') {
      const dbUsers = (window.db.getTable('users') || []).filter(u => u.role === 'siswa');
      dbUsers.forEach(addStudent);
    }

    // 4. Try localStorage 'fivia_student_roster'
    try {
      const saved = localStorage.getItem('fivia_student_roster');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) parsed.forEach(addStudent);
      }
    } catch (e) {}

    // 5. Try localStorage 'fivia_classroom_students'
    try {
      const saved = localStorage.getItem('fivia_classroom_students');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) parsed.forEach(addStudent);
      }
    } catch (e) {}

    // 6. Try localStorage 'vlab_fisika_students'
    try {
      const saved = localStorage.getItem('vlab_fisika_students');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) parsed.forEach(addStudent);
      }
    } catch (e) {}

    let roster = Array.from(studentMap.values());

    // Filter by class ONLY
    if (classId && classId !== 'ALL') {
      const targetClean = (classId || '').toLowerCase().replace(/[^a-z0-9]/g, '');
      const filtered = roster.filter(s => {
        const sClassId = (s.classId || '').toLowerCase();
        const sClassName = (s.className || '').toLowerCase();
        const sClassClean = sClassName.replace(/[^a-z0-9]/g, '');
        const sIdClean = sClassId.replace(/[^a-z0-9]/g, '');

        return s.classId === classId ||
               s.className === classId ||
               sClassId === (classId || '').toLowerCase() ||
               sClassName === (classId || '').toLowerCase() ||
               (targetClean && (sClassClean === targetClean || sIdClean === targetClean || sClassClean.includes(targetClean) || targetClean.includes(sClassClean)));
      });
      return filtered;
    }

    return roster;
  }

  function autoGroupStudents(classId, numGroups) {
    const classes = getClassrooms();
    const targetClassId = classId || (classes[0] ? classes[0].id : 'cls_x1');
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
        const studentName = student.name || student.studentName;
        if (studentName) {
          groups[groupIdx].members.push({
            studentId: student.studentId || student.id || ('std_' + (idx + 1)),
            studentName: studentName,
            studentCode: student.studentCode || student.nis || ('STD-' + (idx + 1)),
            turnsPlayed: 0,
            xpContributed: 0,
            status: 'READY'
          });
        }
      });
    }

    const clsObj = classes.find(c => c.id === targetClassId || c.name === targetClassId) || classes[0] || { id: targetClassId, name: targetClassId };

    sessionState.groups = groups;
    sessionState.classroomId = clsObj.id || targetClassId;
    sessionState.className = clsObj.name || targetClassId;
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

    // Always rotate to the next group for the next main question
    sessionState.currentGroupIndex = ((sessionState.currentGroupIndex || 0) + 1) % sessionState.groups.length;
    const nextGroup = sessionState.groups[sessionState.currentGroupIndex];
    sessionState.activeGroup = nextGroup;

    // Find next member in round-robin order for the active group
    const unplayed = (nextGroup.members || []).filter(m => m.status !== 'PLAYED');
    if (unplayed.length > 0) {
      sessionState.activePlayer = unplayed[0];
    } else {
      // Reset member statuses for group if all have played
      (nextGroup.members || []).forEach(m => m.status = 'READY');
      sessionState.activePlayer = (nextGroup.members || [])[0];
    }

    if (sessionState.activePlayer) {
      sessionState.activePlayer.status = 'PLAYING';
      sessionState.activePlayer.turnsPlayed = (sessionState.activePlayer.turnsPlayed || 0) + 1;
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
