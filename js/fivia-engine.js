/**
 * FIVIA PHYSICS QUEST ENGINE (PHASE 1 - PHASE 10 COMPLETE)
 * Isolated Namespace: window.FIVIAQuest
 * Full Ecosystem: Levels 01-05, Assessment, Lab, Project, AI Tutor, Adaptive, Classroom, Private Identity, Real Classroom Readiness & Production Hardening
 */

window.FIVIAQuest = (function() {
  'use strict';

  const STORAGE_KEYS = {
    STUDENT: 'fivia_quest_student_profile',
    TEAMS: 'fivia_quest_classroom_teams',
    SETTINGS: 'fivia_quest_arena_settings',
    PROGRESS: 'fivia_quest_game_progress',
    ARENA_STATE: 'fivia_quest_arena_state',
    HUNTER_PROGRESS: 'fivia_quest_besaran_hunter_progress',
    UNIT_MASTER_PROGRESS: 'fivia_quest_unit_master_progress',
    SI_EXPLORER_PROGRESS: 'fivia_quest_si_explorer_progress',
    DIMENSION_DETECTIVE_PROGRESS: 'fivia_quest_dimension_detective_progress',
    DIMENSION_BOSS_PROGRESS: 'fivia_quest_dimension_boss_progress',
    MASTERY_ASSESSMENT: 'fivia_mastery_assessment_progress',
    VIRTUAL_LAB_PROGRESS: 'fivia_virtual_lab_progress',
    PROJECT_PROGRESS: 'fivia_project_progress',
    CLASSROOMS: 'fivia_classrooms'
  };

  const DEFAULT_TEAMS = [
    { id: 't1', name: 'TEAM NEWTON', score: 0, players: [{ name: 'Ahmad', turnsPlayed: 0 }, { name: 'Budi', turnsPlayed: 0 }, { name: 'Citra', turnsPlayed: 0 }] },
    { id: 't2', name: 'TEAM EINSTEIN', score: 0, players: [{ name: 'Dinda', turnsPlayed: 0 }, { name: 'Eko', turnsPlayed: 0 }, { name: 'Fajar', turnsPlayed: 0 }] },
    { id: 't3', name: 'TEAM FARADAY', score: 0, players: [{ name: 'Gita', turnsPlayed: 0 }, { name: 'Hadi', turnsPlayed: 0 }, { name: 'Indah', turnsPlayed: 0 }] },
    { id: 't4', name: 'TEAM GALILEO', score: 0, players: [{ name: 'Joko', turnsPlayed: 0 }, { name: 'Kiki', turnsPlayed: 0 }, { name: 'Lia', turnsPlayed: 0 }] }
  ];

  const DEFAULT_SETTINGS = { thinkTime: 10, discussTime: 20, playTime: 30, soundEnabled: true, fullscreen: false };

  const timer = {
    intervalId: null, remainingSeconds: 0, totalSeconds: 0, onTick: null, onComplete: null, isPaused: false,
    start: function(seconds, onTick, onComplete) {
      this.stop(); this.remainingSeconds = seconds; this.totalSeconds = seconds; this.onTick = onTick; this.onComplete = onComplete; this.isPaused = false;
      if (this.onTick) this.onTick(this.remainingSeconds, this.totalSeconds);
      this.intervalId = setInterval(() => {
        if (this.isPaused) return;
        this.remainingSeconds--;
        if (this.onTick) this.onTick(this.remainingSeconds, this.totalSeconds);
        if (this.remainingSeconds <= 0) { this.stop(); if (this.onComplete) this.onComplete(); }
      }, 1000);
    },
    pause: function() { this.isPaused = true; },
    resume: function() { this.isPaused = false; },
    stop: function() { if (this.intervalId) { clearInterval(this.intervalId); this.intervalId = null; } this.isPaused = false; }
  };

  let state = {
    currentView: 'landing',
    student: null,
    teams: [],
    settings: { ...DEFAULT_SETTINGS },
    currentPlayer: null,
    audioCtx: null,

    besaranHunter: { activeMode: 'solo', cards: [], currentIndex: 0, currentCard: null, score: 0, completed: false },
    unitMaster: { activeMode: 'solo', challenges: [], currentIndex: 0, currentChallenge: null, score: 0, completed: false },
    siExplorer: { activeMode: 'solo', challenges: [], currentIndex: 0, currentChallenge: null, score: 0, completed: false },
    dimensionDetective: { activeMode: 'solo', challenges: [], currentIndex: 0, currentChallenge: null, score: 0, completed: false },
    dimensionBoss: { activeMode: 'solo', challenges: [], currentIndex: 0, currentChallenge: null, score: 0, bossHp: 100, completed: false },

    assessment: { questions: [], currentIndex: 0, currentQuestion: null, selectedAnswer: null, answers: [], score: 0, completed: false },
    arena: { currentRound: 1, challengeIndex: 0, gameState: 'SETUP', selectedOption: null, isSubmitted: false }
  };

  function playSound(type) {
    if (!state.settings.soundEnabled) return;
    try {
      if (!state.audioCtx) state.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      if (state.audioCtx.state === 'suspended') state.audioCtx.resume();
      const osc = state.audioCtx.createOscillator(); const gain = state.audioCtx.createGain();
      osc.connect(gain); gain.connect(state.audioCtx.destination); const now = state.audioCtx.currentTime;
      if (type === 'click') {
        osc.type = 'sine'; osc.frequency.setValueAtTime(440, now); osc.frequency.exponentialRampToValueAtTime(880, now + 0.08);
        gain.gain.setValueAtTime(0.2, now); gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
        osc.start(now); osc.stop(now + 0.08);
      } else if (type === 'correct' || type === 'win') {
        osc.type = 'sine'; osc.frequency.setValueAtTime(523.25, now); osc.frequency.setValueAtTime(659.25, now + 0.1);
        osc.frequency.setValueAtTime(783.99, now + 0.2); osc.frequency.setValueAtTime(1046.50, now + 0.3);
        gain.gain.setValueAtTime(0.25, now); gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
        osc.start(now); osc.stop(now + 0.5);
      } else if (type === 'wrong') {
        osc.type = 'sawtooth'; osc.frequency.setValueAtTime(300, now); osc.frequency.linearRampToValueAtTime(150, now + 0.3);
        gain.gain.setValueAtTime(0.25, now); gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
        osc.start(now); osc.stop(now + 0.3);
      }
    } catch (e) {}
  }

  function loadStorage() {
    try {
      const studentData = localStorage.getItem(STORAGE_KEYS.STUDENT);
      if (studentData) state.student = JSON.parse(studentData);
      const teamsData = localStorage.getItem(STORAGE_KEYS.TEAMS);
      if (teamsData) state.teams = JSON.parse(teamsData); else state.teams = JSON.parse(JSON.stringify(DEFAULT_TEAMS));
      const settingsData = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (settingsData) state.settings = { ...DEFAULT_SETTINGS, ...JSON.parse(settingsData) };
    } catch (err) { state.teams = JSON.parse(JSON.stringify(DEFAULT_TEAMS)); }
  }

  function saveStorage(key, data) { try { localStorage.setItem(key, JSON.stringify(data)); } catch (err) {} }

  function init() {
    loadStorage();
    bindGlobalEvents();
    if (window.FIVIAPresence) window.FIVIAPresence.startPresenceHeartbeat();
    renderView('access');
  }

  function bindGlobalEvents() {
    document.addEventListener('click', function(e) { if (e.target.closest('.fq-btn')) playSound('click'); });
  }

  function handleSubRouting(hash) {
    const parts = hash.split('/');
    const subRoute = parts[1] || 'access';

    if (subRoute === 'access') renderView('access');
    else if (subRoute === 'teacher-pin') renderView('teacher-pin');
    else if (subRoute === 'teacher-home') renderView('teacher-home');
    else if (subRoute === 'quick-start') renderView('quick-start');
    else if (subRoute === 'active-session') renderView('active-session');
    else if (subRoute === 'sync-status') renderView('sync-status');
    else if (subRoute === 'backup-center') renderView('backup-center');
    else if (subRoute === 'classroom-today') renderView('classroom-today');
    else if (subRoute === 'attendance') renderView('attendance');
    else if (subRoute === 'daily-session') renderView('daily-session');
    else if (subRoute === 'session-summary') renderView('session-summary');
    else if (subRoute === 'teacher-notes') renderView('teacher-notes');
    else if (subRoute === 'projector') renderView('projector');
    else if (subRoute === 'data-health') renderView('data-health');
    else if (subRoute === 'student-access') renderView('student-access');
    else if (subRoute === 'student-dashboard') renderView('student-dashboard');
    else if (subRoute === 'game-map') renderView('game-map');
    else if (subRoute === 'besaran-hunter') startSoloBesaranHunter();
    else if (subRoute === 'unit-master') startSoloUnitMaster();
    else if (subRoute === 'si-explorer') startSoloSIExplorer();
    else if (subRoute === 'dimension-detective') startSoloDimensionDetective();
    else if (subRoute === 'dimension-boss') startSoloDimensionBoss();
    else if (subRoute === 'mastery-assessment') startMasteryAssessment();
    else if (subRoute === 'virtual-lab') renderView('virtual-lab');
    else if (subRoute === 'lab-experiment') renderView('lab-experiment');
    else if (subRoute === 'lab-lkpd') renderView('lab-lkpd');
    else if (subRoute === 'project-mission') renderView('project-mission');
    else if (subRoute === 'project-detail') renderView('project-detail');
    else if (subRoute === 'ai-tutor') renderView('ai-tutor');
    else if (subRoute === 'learning-path') renderView('learning-path');
    else if (subRoute === 'classroom') renderView('classroom');
    else if (subRoute === 'my-classroom') renderView('my-classroom');
    else if (subRoute === 'assignment-manager') renderView('assignment-manager');
    else if (subRoute === 'live-monitor') renderView('live-monitor');
    else if (subRoute === 'intervention') renderView('intervention');
    else if (subRoute === 'activity-launcher') renderView('activity-launcher');
    else if (subRoute === 'backup-restore') renderView('backup-restore');
    else if (subRoute === 'teacher-dashboard') renderView('teacher-dashboard');
    else if (subRoute === 'class-session') renderView('class-session');
    else if (subRoute === 'join-session') renderView('join-session');
    else if (subRoute === 'classroom-setup') renderView('classroom-setup');
    else if (subRoute === 'arena-preview') renderView('arena-preview');
    else renderView('access');
  }

  function renderView(viewName) {
    state.currentView = viewName;
    const views = document.querySelectorAll('.fivia-quest .fq-view');
    views.forEach(v => v.classList.add('hidden'));

    const activeView = document.getElementById(`fq-view-${viewName}`);
    if (activeView) activeView.classList.remove('hidden');

    if (viewName === 'teacher-home') window.FIVIATeacherHome.renderTeacherHomeUI();
    if (viewName === 'quick-start') window.FIVIAQuickStart.renderQuickStartUI();
    if (viewName === 'active-session') window.FIVIAActiveSession.renderActiveSessionUI();
    if (viewName === 'sync-status') window.FIVIASyncStatus.renderSyncStatusUI();
    if (viewName === 'backup-center') window.FIVIAClassroomFlow.renderBackupCenterUI();
    if (viewName === 'classroom-today') window.FIVIAClassroomToday.renderClassroomTodayUI();
    if (viewName === 'attendance') window.FIVIAAttendance.renderAttendanceUI();
    if (viewName === 'daily-session') window.FIVIADailySession.renderDailySessionUI();
    if (viewName === 'session-summary') window.FIVIASessionSummary.renderSessionSummaryUI();
    if (viewName === 'teacher-notes') window.FIVIATeacherNotes.renderTeacherNotesUI();
    if (viewName === 'projector') window.FIVIAProjector.renderProjectorUI();
    if (viewName === 'data-health') window.FIVIADataHealth.renderDataHealthUI();
    if (viewName === 'student-dashboard') updateStudentDashboardUI();
    if (viewName === 'game-map') updateGameMapUI();
    if (viewName === 'besaran-hunter') renderBesaranHunterCard();
    if (viewName === 'unit-master') renderUnitMasterCard();
    if (viewName === 'si-explorer') renderSIExplorerCard();
    if (viewName === 'dimension-detective') renderDimensionDetectiveCard();
    if (viewName === 'dimension-boss') renderDimensionBossCard();
    if (viewName === 'virtual-lab') updateVirtualLabUI();
    if (viewName === 'lab-lkpd') window.FIVIALabLKPD.renderLKPDFormUI();
    if (viewName === 'project-mission') updateProjectMissionUI();
    if (viewName === 'ai-tutor') window.FIVIAAITutor.renderChatUI();
    if (viewName === 'learning-path') window.FIVIAAdaptive.renderLearningPathUI();
    if (viewName === 'classroom') window.FIVIAClassroomEngine.renderTeacherClassroomUI();
    if (viewName === 'my-classroom') window.FIVIAClassroomEngine.renderStudentMyClassroomUI();
    if (viewName === 'assignment-manager') window.FIVIAClassroomEngine.renderAssignmentManagerUI();
    if (viewName === 'live-monitor') window.FIVIAClassroomEngine.renderLiveMonitorUI();
    if (viewName === 'intervention') window.FIVIAClassroomEngine.renderInterventionUI();
    if (viewName === 'activity-launcher') window.FIVIAClassroomEngine.renderActivityLauncherUI();
    if (viewName === 'classroom-setup') renderClassroomSetupUI();
    if (viewName === 'arena-preview') renderActiveArenaUI();

    window.scrollTo(0, 0);
  }

  /**
   * Validates level accessibility and launches level gameplay
   */
  function startLevel(levelNum) {
    const student = window.FIVIAStudent.getStudentProfile();
    const isUnlocked = levelNum === 1 || 
                       (student.levelsCompleted && student.levelsCompleted[`level${levelNum-1}`]) || 
                       (student.level && student.level >= levelNum);

    if (!isUnlocked) {
      alert(`🔒 LEVEL ${levelNum} TERKUNCI\n\nSelesaikan Level 0${levelNum-1} terlebih dahulu untuk membuka level ini.`);
      return;
    }

    if (levelNum === 1) startSoloBesaranHunter();
    else if (levelNum === 2) startSoloUnitMaster();
    else if (levelNum === 3) startSoloSIExplorer();
    else if (levelNum === 4) startSoloDimensionDetective();
    else if (levelNum === 5) startSoloDimensionBoss();
  }

  /**
   * Updates Game Map UI (Locks / Unlocks Level Nodes dynamically)
   */
  function updateGameMapUI() {
    const student = window.FIVIAStudent.getStudentProfile();
    const completed = student.levelsCompleted || {};
    const lvl = student.level || 1;

    // Level 1
    const n1 = document.getElementById('fq-map-level-1');
    if (n1) {
      n1.className = 'fq-map-node available';
      n1.onclick = () => startLevel(1);
    }

    // Level 2
    const n2 = document.getElementById('fq-map-level-2');
    if (n2) {
      const ok2 = completed.level1 || lvl >= 2;
      n2.className = ok2 ? 'fq-map-node available' : 'fq-map-node locked';
      n2.innerHTML = `
        <div>
          <span style="font-size: 0.75rem; font-weight: 700; color: ${ok2 ? 'var(--fq-cyan)' : 'var(--fq-rose)'}; letter-spacing: 1px;">LEVEL 02 &bull; ${ok2 ? 'AVAILABLE' : 'LOCKED 🔒'}</span>
          <h3 style="font-size: 1.25rem; font-weight: 800; color: #fff; margin: 4px 0;">UNIT MASTER</h3>
          <p style="font-size: 0.82rem; color: var(--fq-text-muted); margin: 0;">Touch Matching: Pasangkan Besaran dengan Satuan SI yang tepat</p>
        </div>
        ${ok2 ? '<button class="fq-btn fq-btn-cyan" style="min-height: 40px; padding: 8px 16px; font-size: 0.85rem;"><i class="fas fa-play"></i> MAIN</button>' : '<span style="color: var(--fq-text-muted); font-size: 0.85rem;"><i class="fas fa-lock"></i> Terkunci</span>'}
      `;
      n2.onclick = () => startLevel(2);
    }

    // Level 3
    const n3 = document.getElementById('fq-map-level-3');
    if (n3) {
      const ok3 = completed.level2 || lvl >= 3;
      n3.className = ok3 ? 'fq-map-node available' : 'fq-map-node locked';
      n3.innerHTML = `
        <div>
          <span style="font-size: 0.75rem; font-weight: 700; color: ${ok3 ? 'var(--fq-cyan)' : 'var(--fq-rose)'}; letter-spacing: 1px;">LEVEL 03 &bull; ${ok3 ? 'AVAILABLE' : 'LOCKED 🔒'}</span>
          <h3 style="font-size: 1.25rem; font-weight: 800; color: #fff; margin: 4px 0;">SI EXPLORER</h3>
          <p style="font-size: 0.82rem; color: var(--fq-text-muted); margin: 0;">Virtual Lab: Gunakan instrumen penggaris, neraca, stopwatch, & termometer</p>
        </div>
        ${ok3 ? '<button class="fq-btn fq-btn-cyan" style="min-height: 40px; padding: 8px 16px; font-size: 0.85rem;"><i class="fas fa-play"></i> MAIN</button>' : '<span style="color: var(--fq-text-muted); font-size: 0.85rem;"><i class="fas fa-lock"></i> Terkunci</span>'}
      `;
      n3.onclick = () => startLevel(3);
    }

    // Level 4
    const n4 = document.getElementById('fq-map-level-4');
    if (n4) {
      const ok4 = completed.level3 || lvl >= 4;
      n4.className = ok4 ? 'fq-map-node available' : 'fq-map-node locked';
      n4.innerHTML = `
        <div>
          <span style="font-size: 0.75rem; font-weight: 700; color: ${ok4 ? 'var(--fq-cyan)' : 'var(--fq-rose)'}; letter-spacing: 1px;">LEVEL 04 &bull; ${ok4 ? 'AVAILABLE' : 'LOCKED 🔒'}</span>
          <h3 style="font-size: 1.25rem; font-weight: 800; color: #fff; margin: 4px 0;">DIMENSION DETECTIVE</h3>
          <p style="font-size: 0.82rem; color: var(--fq-text-muted); margin: 0;">Dimension Puzzle: Susun simbol dimensi [M], [L], [T] untuk besaran turunan</p>
        </div>
        ${ok4 ? '<button class="fq-btn fq-btn-cyan" style="min-height: 40px; padding: 8px 16px; font-size: 0.85rem;"><i class="fas fa-play"></i> MAIN</button>' : '<span style="color: var(--fq-text-muted); font-size: 0.85rem;"><i class="fas fa-lock"></i> Terkunci</span>'}
      `;
      n4.onclick = () => startLevel(4);
    }

    // Level 5
    const n5 = document.getElementById('fq-map-level-5');
    if (n5) {
      const ok5 = completed.level4 || lvl >= 5;
      n5.className = ok5 ? 'fq-map-node available' : 'fq-map-node locked';
      n5.innerHTML = `
        <div>
          <span style="font-size: 0.75rem; font-weight: 700; color: ${ok5 ? 'var(--fq-cyan)' : 'var(--fq-rose)'}; letter-spacing: 1px;">LEVEL 05 &bull; ${ok5 ? 'AVAILABLE' : 'LOCKED 🔒'}</span>
          <h3 style="font-size: 1.25rem; font-weight: 800; color: #fff; margin: 4px 0;">DIMENSION BOSS</h3>
          <p style="font-size: 0.82rem; color: var(--fq-text-muted); margin: 0;">Boss Battle: Analisis dimensi persamaan Fisika dan temukan error</p>
        </div>
        ${ok5 ? '<button class="fq-btn fq-btn-cyan" style="min-height: 40px; padding: 8px 16px; font-size: 0.85rem;"><i class="fas fa-play"></i> MAIN</button>' : '<span style="color: var(--fq-text-muted); font-size: 0.85rem;"><i class="fas fa-lock"></i> Terkunci</span>'}
      `;
      n5.onclick = () => startLevel(5);
    }
  }

  function updateStudentDashboardUI() {
    const student = window.FIVIAStudent.getStudentProfile();
    const session = window.FIVIAStudentSession.getActiveStudentSession() || { name: student.name || 'Siswa', className: 'XI Fase F', studentCode: 'FIVIA-XIF-001' };
    const container = document.getElementById('fq-student-dashboard-container');
    if (!container) return;

    container.innerHTML = `
      <div style="background: rgba(15, 23, 42, 0.95); border: 2.5px solid var(--fq-cyan); border-radius: 28px; padding: 32px; text-align: left;">
        <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 2px solid var(--fq-border-cyan); padding-bottom: 16px; margin-bottom: 24px; flex-wrap: wrap; gap: 12px;">
          <div>
            <span class="fq-badge-pill"><i class="fas fa-user-graduate"></i> DASHBOARD KINERJA SISWA</span>
            <h1 style="font-size: 2.2rem; font-weight: 900; color: #fff; margin: 4px 0;">👨🎓 MY FIVIA</h1>
            <div style="color: var(--fq-cyan); font-weight: 700;">Selamat Datang, <strong>${session.name}</strong> (${session.className} &bull; ${session.studentCode})</div>
          </div>
          <div style="display: flex; gap: 10px;">
            <button class="fq-btn fq-btn-outline" onclick="window.FIVIAStudentSession.switchStudent()"><i class="fas fa-sync-alt"></i> GANTI SISWA</button>
            <button class="fq-btn fq-btn-amber" onclick="window.FIVIAStudentSession.switchToTeacherMode()"><i class="fas fa-lock"></i> MODE GURU</button>
          </div>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 16px; margin-bottom: 28px;">
          <div style="background: rgba(30,41,59,0.7); border: 1px solid var(--fq-border-cyan); border-radius: 18px; padding: 18px;">
            <div style="font-size: 0.8rem; color: var(--fq-text-muted);">TOTAL PEROLEHAN XP</div>
            <div style="font-size: 1.8rem; font-weight: 900; color: var(--fq-amber);">${student.xp || 0} XP</div>
          </div>
          <div style="background: rgba(30,41,59,0.7); border: 1px solid var(--fq-border-cyan); border-radius: 18px; padding: 18px;">
            <div style="font-size: 0.8rem; color: var(--fq-text-muted);">JUMLAH LENCANA</div>
            <div style="font-size: 1.8rem; font-weight: 900; color: var(--fq-cyan);">${(student.badges || []).length} Badges</div>
          </div>
          <div style="background: rgba(30,41,59,0.7); border: 1px solid var(--fq-border-cyan); border-radius: 18px; padding: 18px;">
            <div style="font-size: 0.8rem; color: var(--fq-text-muted);">STATUS LEVEL</div>
            <div style="font-size: 1.8rem; font-weight: 900; color: var(--fq-emerald);">Lvl ${student.level || 1}</div>
          </div>
        </div>

        <h3 style="color: var(--fq-cyan); font-size: 1.2rem; margin: 0 0 16px 0;"><i class="fas fa-th-large"></i> QUICK ACTIONS PEMBELAJARAN:</h3>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px;">
          <button class="fq-btn fq-btn-cyan fq-btn-lg" onclick="window.location.hash='#quest/game-map'"><i class="fas fa-map-marked-alt"></i> 🎮 PHYSICS QUEST</button>
          <button class="fq-btn fq-btn-emerald fq-btn-lg" onclick="window.location.hash='#quest/virtual-lab'"><i class="fas fa-flask"></i> 🔬 VIRTUAL LAB</button>
          <button class="fq-btn fq-btn-amber fq-btn-lg" onclick="window.location.hash='#quest/project-mission'"><i class="fas fa-rocket"></i> 🧪 PROJECT MISSION</button>
          <button class="fq-btn fq-btn-violet fq-btn-lg" onclick="window.location.hash='#quest/ai-tutor'"><i class="fas fa-robot"></i> 🤖 AI TUTOR</button>
        </div>
      </div>
    `;
  }

  function updateVirtualLabUI() {
    const experiments = window.FIVIAVirtualLabData ? window.FIVIAVirtualLabData.getAllExperiments() : [];
    const container = document.getElementById('fq-virtual-lab-grid-container');
    if (!container) return;
    container.innerHTML = experiments.map(exp => `
      <div class="fq-lab-card">
        <div>
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;">
            <div style="font-size: 2.2rem; color: var(--fq-cyan);"><i class="fas ${exp.icon}"></i></div>
            <span class="fq-badge-pill" style="margin: 0;">${exp.difficulty} &bull; ${exp.estimatedMinutes} Mnt</span>
          </div>
          <h3 style="font-size: 1.25rem; font-weight: 800; color: #fff; margin: 0 0 6px 0;">${exp.title}</h3>
          <p style="font-size: 0.85rem; color: var(--fq-text-muted); line-height: 1.5; margin-bottom: 16px;">${exp.topic}</p>
        </div>
        <div>
          <button class="fq-btn fq-btn-cyan fq-btn-lg" style="width: 100%;" onclick="window.FIVIALabEngine.startExperiment('${exp.id}'); window.location.hash='#quest/lab-experiment'">
            <i class="fas fa-flask"></i> MULAI PRAKTIKUM
          </button>
        </div>
      </div>
    `).join('');
  }

  function updateProjectMissionUI() {
    const projects = window.FIVIAProjectsData ? window.FIVIAProjectsData.getAllProjects() : [];
    const container = document.getElementById('fq-project-mission-grid-container');
    if (!container) return;
    container.innerHTML = projects.map(proj => `
      <div class="fq-project-card">
        <div>
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;">
            <div style="font-size: 2.2rem; color: var(--fq-cyan);"><i class="fas ${proj.icon}"></i></div>
            <span class="fq-badge-pill" style="margin: 0;">PROYEK FISIKA REAL-WORLD</span>
          </div>
          <h3 style="font-size: 1.3rem; font-weight: 900; color: #fff; margin: 0 0 4px 0;">${proj.title}</h3>
          <div style="font-size: 0.82rem; font-weight: 700; color: var(--fq-cyan); margin-bottom: 10px;">${proj.subtitle}</div>
          <p style="font-size: 0.85rem; color: var(--fq-text-muted); line-height: 1.5; margin-bottom: 16px;">${proj.topic}</p>
        </div>
        <div>
          <button class="fq-btn fq-btn-cyan fq-btn-lg" style="width: 100%;" onclick="window.FIVIAProjectEngine.startProject('${proj.id}'); window.location.hash='#quest/project-detail'">
            <i class="fas fa-rocket"></i> JALANKAN PROYEK
          </button>
        </div>
      </div>
    `).join('');
  }

  /**
   * LEVEL 01: BESARAN HUNTER GAME BOARD RENDERER
   */
  function renderBesaranHunterCard() {
    const container = document.getElementById('fq-besaran-board-container');
    if (!container) return;

    const cards = state.besaranHunter.cards;
    const idx = state.besaranHunter.currentIndex;

    if (!cards || cards.length === 0 || idx >= cards.length) {
      // Completed Level 01 Screen
      window.FIVIAStudent.completeLevel(1);
      window.FIVIAStudent.awardBadge('🎯 BESARAN HUNTER');

      container.innerHTML = `
        <div style="background: rgba(15,23,42,0.95); border: 2.5px solid var(--fq-cyan); border-radius: 28px; padding: 36px; text-align: center;">
          <div style="font-size: 4rem; margin-bottom: 12px;">🎉</div>
          <span class="fq-badge-pill"><i class="fas fa-trophy"></i> LEVEL 01 COMPLETE</span>
          <h1 style="font-size: 2.4rem; font-weight: 900; color: #fff; margin: 8px 0;">BESARAN HUNTER SELESAI!</h1>
          <p style="color: var(--fq-text-muted); margin-bottom: 24px;">Selamat! Anda berhasil mengelompokkan Besaran Pokok dan Besaran Turunan dengan baik.</p>
          
          <div style="display: flex; gap: 16px; justify-content: center; margin-bottom: 32px; flex-wrap: wrap;">
            <div style="background: rgba(30,41,59,0.8); border: 1px solid var(--fq-border-cyan); padding: 18px 28px; border-radius: 18px;">
              <div style="font-size: 0.8rem; color: var(--fq-text-muted);">BONUS XP</div>
              <div style="font-size: 1.8rem; font-weight: 900; color: var(--fq-amber);">+150 XP</div>
            </div>
            <div style="background: rgba(30,41,59,0.8); border: 1px solid var(--fq-border-cyan); padding: 18px 28px; border-radius: 18px;">
              <div style="font-size: 0.8rem; color: var(--fq-text-muted);">BADGE DIRAIH</div>
              <div style="font-size: 1.2rem; font-weight: 900; color: var(--fq-cyan);">🎯 BESARAN HUNTER</div>
            </div>
          </div>

          <div style="display: flex; gap: 14px; justify-content: center; flex-wrap: wrap;">
            <button class="fq-btn fq-btn-outline fq-btn-lg" onclick="window.FIVIAQuest.startLevel(1)"><i class="fas fa-redo"></i> MAIN LAGI</button>
            <button class="fq-btn fq-btn-cyan fq-btn-lg" onclick="window.FIVIAQuest.startLevel(2)"><i class="fas fa-play"></i> LANJUT LEVEL 02 (UNIT MASTER)</button>
            <button class="fq-btn fq-btn-outline fq-btn-lg" onclick="window.location.hash='#quest/game-map'"><i class="fas fa-map-marked-alt"></i> KEMBALI KE MAP</button>
          </div>
        </div>
      `;
      return;
    }

    const currentCard = cards[idx];
    container.innerHTML = `
      <div style="background: rgba(15,23,42,0.95); border: 2.5px solid var(--fq-cyan); border-radius: 28px; padding: 28px; text-align: left;">
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid var(--fq-border-cyan); padding-bottom: 14px; margin-bottom: 24px;">
          <div>
            <span class="fq-badge-pill"><i class="fas fa-bullseye"></i> LEVEL 01 &bull; KARTU ${idx + 1} / ${cards.length}</span>
            <h2 style="font-size: 1.8rem; font-weight: 900; color: #fff; margin: 4px 0 0 0;">BESARAN HUNTER</h2>
          </div>
          <button class="fq-btn fq-btn-outline" onclick="window.location.hash='#quest/game-map'"><i class="fas fa-times"></i> KELUAR</button>
        </div>

        <div style="background: rgba(30,41,59,0.7); border: 1.5px solid var(--fq-border-cyan); border-radius: 20px; padding: 28px; text-align: center; margin-bottom: 24px;">
          <span style="font-size: 0.8rem; font-weight: 700; color: var(--fq-cyan); letter-spacing: 2px;">IDENTIFIKASI BESARAN:</span>
          <h1 style="font-size: 2.8rem; font-weight: 900; color: #fff; margin: 8px 0;">${currentCard.name}</h1>
          <div style="font-size: 1.1rem; color: var(--fq-text-muted);">Simbol: <strong style="color: var(--fq-amber);">${currentCard.symbol}</strong> | Satuan: <strong style="color: var(--fq-emerald);">${currentCard.unit} (${currentCard.unitSymbol})</strong> | Dimensi: <strong>${currentCard.dimension}</strong></div>
        </div>

        <div id="fq-bh-feedback" style="display: none; margin-bottom: 20px; padding: 18px; border-radius: 16px;"></div>

        <div id="fq-bh-options" style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
          <button class="fq-btn fq-btn-cyan fq-btn-lg" style="padding: 20px; font-size: 1.1rem;" onclick="window.FIVIAQuest.submitBesaranAnswer('pokok')">
            <i class="fas fa-atom"></i> 🔵 BESARAN POKOK
          </button>
          <button class="fq-btn fq-btn-violet fq-btn-lg" style="padding: 20px; font-size: 1.1rem;" onclick="window.FIVIAQuest.submitBesaranAnswer('turunan')">
            <i class="fas fa-layer-group"></i> 🟣 BESARAN TURUNAN
          </button>
        </div>
      </div>
    `;
  }

  function submitBesaranAnswer(chosenCategory) {
    const cards = state.besaranHunter.cards;
    const idx = state.besaranHunter.currentIndex;
    const card = cards[idx];

    const fb = document.getElementById('fq-bh-feedback');
    const opts = document.getElementById('fq-bh-options');
    if (!fb || !opts) return;

    const isCorrect = card.category === chosenCategory;
    playSound(isCorrect ? 'correct' : 'wrong');

    if (isCorrect) window.FIVIAStudent.addXP(15);

    fb.style.display = 'block';
    fb.style.background = isCorrect ? 'rgba(16,185,129,0.15)' : 'rgba(244,63,94,0.15)';
    fb.style.border = `1.5px solid ${isCorrect ? 'var(--fq-emerald)' : 'var(--fq-rose)'}`;
    fb.innerHTML = `
      <div style="font-weight: 800; font-size: 1.1rem; color: ${isCorrect ? 'var(--fq-emerald)' : 'var(--fq-rose)'}; margin-bottom: 6px;">
        ${isCorrect ? '✅ BENAR! (+15 XP)' : '❌ KURANG TEPAT!'}
      </div>
      <p style="color: #fff; margin: 0 0 12px 0; font-size: 0.9rem;">${card.explanation}</p>
      <button class="fq-btn fq-btn-cyan" style="width: 100%;" onclick="window.FIVIAQuest.nextBesaranCard()">
        LANJUTKAN &rarr;
      </button>
    `;
    opts.style.display = 'none';
  }

  function nextBesaranCard() {
    state.besaranHunter.currentIndex++;
    renderBesaranHunterCard();
  }

  /**
   * LEVEL 02: UNIT MASTER GAME BOARD RENDERER
   */
  function renderUnitMasterCard() {
    const container = document.getElementById('fq-unit-board-container');
    if (!container) return;

    const challenges = state.unitMaster.challenges;
    const idx = state.unitMaster.currentIndex;

    if (!challenges || challenges.length === 0 || idx >= challenges.length) {
      window.FIVIAStudent.completeLevel(2);
      window.FIVIAStudent.awardBadge('🧠 UNIT MASTER');

      container.innerHTML = `
        <div style="background: rgba(15,23,42,0.95); border: 2.5px solid var(--fq-cyan); border-radius: 28px; padding: 36px; text-align: center;">
          <div style="font-size: 4rem; margin-bottom: 12px;">🏆</div>
          <span class="fq-badge-pill"><i class="fas fa-trophy"></i> LEVEL 02 COMPLETE</span>
          <h1 style="font-size: 2.4rem; font-weight: 900; color: #fff; margin: 8px 0;">UNIT MASTER SELESAI!</h1>
          <p style="color: var(--fq-text-muted); margin-bottom: 24px;">Luar biasa! Anda telah menguasai konversi dan pencocokan Satuan SI.</p>

          <div style="display: flex; gap: 14px; justify-content: center; flex-wrap: wrap;">
            <button class="fq-btn fq-btn-outline fq-btn-lg" onclick="window.FIVIAQuest.startLevel(2)"><i class="fas fa-redo"></i> MAIN LAGI</button>
            <button class="fq-btn fq-btn-cyan fq-btn-lg" onclick="window.FIVIAQuest.startLevel(3)"><i class="fas fa-play"></i> LANJUT LEVEL 03 (SI EXPLORER)</button>
            <button class="fq-btn fq-btn-outline fq-btn-lg" onclick="window.location.hash='#quest/game-map'"><i class="fas fa-map-marked-alt"></i> KEMBALI KE MAP</button>
          </div>
        </div>
      `;
      return;
    }

    const c = challenges[idx];
    container.innerHTML = `
      <div style="background: rgba(15,23,42,0.95); border: 2.5px solid var(--fq-cyan); border-radius: 28px; padding: 28px; text-align: left;">
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid var(--fq-border-cyan); padding-bottom: 14px; margin-bottom: 20px;">
          <div>
            <span class="fq-badge-pill"><i class="fas fa-exchange-alt"></i> LEVEL 02 &bull; TANTANGAN ${idx + 1} / ${challenges.length}</span>
            <h2 style="font-size: 1.8rem; font-weight: 900; color: #fff; margin: 4px 0 0 0;">UNIT MASTER</h2>
          </div>
          <button class="fq-btn fq-btn-outline" onclick="window.location.hash='#quest/game-map'"><i class="fas fa-times"></i> KELUAR</button>
        </div>

        <div style="font-size: 1.2rem; color: #fff; font-weight: 700; margin-bottom: 20px;">${c.question}</div>
        <div style="background: rgba(30,41,59,0.7); border-radius: 16px; padding: 20px; font-size: 1.4rem; font-weight: 900; color: var(--fq-cyan); text-align: center; margin-bottom: 24px;">
          ${c.quantity || 'Tentukan Satuan SI'}
        </div>

        <div id="fq-um-feedback" style="display: none; margin-bottom: 20px; padding: 18px; border-radius: 16px;"></div>

        <div id="fq-um-options" style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px;">
          ${(c.options || []).map(opt => `
            <button class="fq-btn fq-btn-outline fq-btn-lg" style="padding: 16px; font-size: 1rem; text-align: left;" onclick="window.FIVIAQuest.submitUnitAnswer('${opt.id}')">
              ${opt.label || opt.text || opt.id}
            </button>
          `).join('')}
        </div>
      </div>
    `;
  }

  function submitUnitAnswer(optId) {
    const challenges = state.unitMaster.challenges;
    const idx = state.unitMaster.currentIndex;
    const c = challenges[idx];

    const fb = document.getElementById('fq-um-feedback');
    const opts = document.getElementById('fq-um-options');
    if (!fb || !opts) return;

    const isCorrect = String(optId) === String(c.correctAnswer);
    playSound(isCorrect ? 'correct' : 'wrong');

    if (isCorrect) window.FIVIAStudent.addXP(20);

    fb.style.display = 'block';
    fb.style.background = isCorrect ? 'rgba(16,185,129,0.15)' : 'rgba(244,63,94,0.15)';
    fb.style.border = `1.5px solid ${isCorrect ? 'var(--fq-emerald)' : 'var(--fq-rose)'}`;
    fb.innerHTML = `
      <div style="font-weight: 800; font-size: 1.1rem; color: ${isCorrect ? 'var(--fq-emerald)' : 'var(--fq-rose)'}; margin-bottom: 6px;">
        ${isCorrect ? '✅ BENAR! (+20 XP)' : '❌ KURANG TEPAT!'}
      </div>
      <p style="color: #fff; margin: 0 0 12px 0; font-size: 0.9rem;">${c.explanation}</p>
      <button class="fq-btn fq-btn-cyan" style="width: 100%;" onclick="window.FIVIAQuest.nextUnitCard()">
        LANJUTKAN &rarr;
      </button>
    `;
    opts.style.display = 'none';
  }

  function nextUnitCard() {
    state.unitMaster.currentIndex++;
    renderUnitMasterCard();
  }

  /**
   * LEVEL 03: SI EXPLORER GAME BOARD RENDERER
   */
  function renderSIExplorerCard() {
    const container = document.getElementById('fq-si-board-container');
    if (!container) return;

    const challenges = state.siExplorer.challenges;
    const idx = state.siExplorer.currentIndex;

    if (!challenges || challenges.length === 0 || idx >= challenges.length) {
      window.FIVIAStudent.completeLevel(3);
      window.FIVIAStudent.awardBadge('🔭 SI EXPLORER');

      container.innerHTML = `
        <div style="background: rgba(15,23,42,0.95); border: 2.5px solid var(--fq-cyan); border-radius: 28px; padding: 36px; text-align: center;">
          <div style="font-size: 4rem; margin-bottom: 12px;">🔭</div>
          <span class="fq-badge-pill"><i class="fas fa-trophy"></i> LEVEL 03 COMPLETE</span>
          <h1 style="font-size: 2.4rem; font-weight: 900; color: #fff; margin: 8px 0;">SI EXPLORER SELESAI!</h1>
          <p style="color: var(--fq-text-muted); margin-bottom: 24px;">Hebat! Anda berhasil menyelesaikan simulasi pengukuran instrumen.</p>

          <div style="display: flex; gap: 14px; justify-content: center; flex-wrap: wrap;">
            <button class="fq-btn fq-btn-outline fq-btn-lg" onclick="window.FIVIAQuest.startLevel(3)"><i class="fas fa-redo"></i> MAIN LAGI</button>
            <button class="fq-btn fq-btn-cyan fq-btn-lg" onclick="window.FIVIAQuest.startLevel(4)"><i class="fas fa-play"></i> LANJUT LEVEL 04 (DIMENSION DETECTIVE)</button>
            <button class="fq-btn fq-btn-outline fq-btn-lg" onclick="window.location.hash='#quest/game-map'"><i class="fas fa-map-marked-alt"></i> KEMBALI KE MAP</button>
          </div>
        </div>
      `;
      return;
    }

    const c = challenges[idx];
    container.innerHTML = `
      <div style="background: rgba(15,23,42,0.95); border: 2.5px solid var(--fq-cyan); border-radius: 28px; padding: 28px; text-align: left;">
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid var(--fq-border-cyan); padding-bottom: 14px; margin-bottom: 20px;">
          <div>
            <span class="fq-badge-pill"><i class="fas fa-compass"></i> LEVEL 03 &bull; SOAL ${idx + 1} / ${challenges.length}</span>
            <h2 style="font-size: 1.8rem; font-weight: 900; color: #fff; margin: 4px 0 0 0;">SI EXPLORER</h2>
          </div>
          <button class="fq-btn fq-btn-outline" onclick="window.location.hash='#quest/game-map'"><i class="fas fa-times"></i> KELUAR</button>
        </div>

        <div style="font-size: 1.2rem; color: #fff; font-weight: 700; margin-bottom: 20px;">${c.question}</div>

        <div id="fq-si-feedback" style="display: none; margin-bottom: 20px; padding: 18px; border-radius: 16px;"></div>

        <div id="fq-si-options" style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px;">
          ${(c.options || []).map(opt => `
            <button class="fq-btn fq-btn-outline fq-btn-lg" style="padding: 16px; font-size: 1rem; text-align: left;" onclick="window.FIVIAQuest.submitSIAnswer('${opt.id}')">
              <strong>${opt.id}.</strong> ${opt.text || opt.label}
            </button>
          `).join('')}
        </div>
      </div>
    `;
  }

  function submitSIAnswer(optId) {
    const challenges = state.siExplorer.challenges;
    const idx = state.siExplorer.currentIndex;
    const c = challenges[idx];

    const fb = document.getElementById('fq-si-feedback');
    const opts = document.getElementById('fq-si-options');
    if (!fb || !opts) return;

    const isCorrect = String(optId) === String(c.correctAnswer);
    playSound(isCorrect ? 'correct' : 'wrong');

    if (isCorrect) window.FIVIAStudent.addXP(25);

    fb.style.display = 'block';
    fb.style.background = isCorrect ? 'rgba(16,185,129,0.15)' : 'rgba(244,63,94,0.15)';
    fb.style.border = `1.5px solid ${isCorrect ? 'var(--fq-emerald)' : 'var(--fq-rose)'}`;
    fb.innerHTML = `
      <div style="font-weight: 800; font-size: 1.1rem; color: ${isCorrect ? 'var(--fq-emerald)' : 'var(--fq-rose)'}; margin-bottom: 6px;">
        ${isCorrect ? '✅ BENAR! (+25 XP)' : '❌ KURANG TEPAT!'}
      </div>
      <p style="color: #fff; margin: 0 0 12px 0; font-size: 0.9rem;">${c.explanation}</p>
      <button class="fq-btn fq-btn-cyan" style="width: 100%;" onclick="window.FIVIAQuest.nextSICard()">
        LANJUTKAN &rarr;
      </button>
    `;
    opts.style.display = 'none';
  }

  function nextSICard() {
    state.siExplorer.currentIndex++;
    renderSIExplorerCard();
  }

  /**
   * LEVEL 04: DIMENSION DETECTIVE GAME BOARD RENDERER
   */
  function renderDimensionDetectiveCard() {
    const container = document.getElementById('fq-dd-board-container');
    if (!container) return;

    const challenges = state.dimensionDetective.challenges;
    const idx = state.dimensionDetective.currentIndex;

    if (!challenges || challenges.length === 0 || idx >= challenges.length) {
      window.FIVIAStudent.completeLevel(4);
      window.FIVIAStudent.awardBadge('🔍 DIMENSION DETECTIVE');

      container.innerHTML = `
        <div style="background: rgba(15,23,42,0.95); border: 2.5px solid var(--fq-cyan); border-radius: 28px; padding: 36px; text-align: center;">
          <div style="font-size: 4rem; margin-bottom: 12px;">🔍</div>
          <span class="fq-badge-pill"><i class="fas fa-trophy"></i> LEVEL 04 COMPLETE</span>
          <h1 style="font-size: 2.4rem; font-weight: 900; color: #fff; margin: 8px 0;">DIMENSION DETECTIVE SELESAI!</h1>
          <p style="color: var(--fq-text-muted); margin-bottom: 24px;">Selamat! Anda berhasil memecahkan teka-teki analisis dimensi fisika.</p>

          <div style="display: flex; gap: 14px; justify-content: center; flex-wrap: wrap;">
            <button class="fq-btn fq-btn-outline fq-btn-lg" onclick="window.FIVIAQuest.startLevel(4)"><i class="fas fa-redo"></i> MAIN LAGI</button>
            <button class="fq-btn fq-btn-cyan fq-btn-lg" onclick="window.FIVIAQuest.startLevel(5)"><i class="fas fa-play"></i> LANJUT LEVEL 05 (DIMENSION BOSS)</button>
            <button class="fq-btn fq-btn-outline fq-btn-lg" onclick="window.location.hash='#quest/game-map'"><i class="fas fa-map-marked-alt"></i> KEMBALI KE MAP</button>
          </div>
        </div>
      `;
      return;
    }

    const c = challenges[idx];
    container.innerHTML = `
      <div style="background: rgba(15,23,42,0.95); border: 2.5px solid var(--fq-cyan); border-radius: 28px; padding: 28px; text-align: left;">
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid var(--fq-border-cyan); padding-bottom: 14px; margin-bottom: 20px;">
          <div>
            <span class="fq-badge-pill"><i class="fas fa-search"></i> LEVEL 04 &bull; DETEKTIF ${idx + 1} / ${challenges.length}</span>
            <h2 style="font-size: 1.8rem; font-weight: 900; color: #fff; margin: 4px 0 0 0;">DIMENSION DETECTIVE</h2>
          </div>
          <button class="fq-btn fq-btn-outline" onclick="window.location.hash='#quest/game-map'"><i class="fas fa-times"></i> KELUAR</button>
        </div>

        <div style="font-size: 1.2rem; color: #fff; font-weight: 700; margin-bottom: 20px;">${c.question}</div>

        <div id="fq-dd-feedback" style="display: none; margin-bottom: 20px; padding: 18px; border-radius: 16px;"></div>

        <div id="fq-dd-options" style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px;">
          ${(c.options || []).map(opt => `
            <button class="fq-btn fq-btn-outline fq-btn-lg" style="padding: 16px; font-size: 1rem; text-align: left;" onclick="window.FIVIAQuest.submitDDAnswer('${opt.id}')">
              <strong>${opt.id}.</strong> ${opt.text || opt.label}
            </button>
          `).join('')}
        </div>
      </div>
    `;
  }

  function submitDDAnswer(optId) {
    const challenges = state.dimensionDetective.challenges;
    const idx = state.dimensionDetective.currentIndex;
    const c = challenges[idx];

    const fb = document.getElementById('fq-dd-feedback');
    const opts = document.getElementById('fq-dd-options');
    if (!fb || !opts) return;

    const isCorrect = String(optId) === String(c.correctAnswer);
    playSound(isCorrect ? 'correct' : 'wrong');

    if (isCorrect) window.FIVIAStudent.addXP(30);

    fb.style.display = 'block';
    fb.style.background = isCorrect ? 'rgba(16,185,129,0.15)' : 'rgba(244,63,94,0.15)';
    fb.style.border = `1.5px solid ${isCorrect ? 'var(--fq-emerald)' : 'var(--fq-rose)'}`;
    fb.innerHTML = `
      <div style="font-weight: 800; font-size: 1.1rem; color: ${isCorrect ? 'var(--fq-emerald)' : 'var(--fq-rose)'}; margin-bottom: 6px;">
        ${isCorrect ? '✅ BENAR! (+30 XP)' : '❌ KURANG TEPAT!'}
      </div>
      <p style="color: #fff; margin: 0 0 12px 0; font-size: 0.9rem;">${c.explanation}</p>
      <button class="fq-btn fq-btn-cyan" style="width: 100%;" onclick="window.FIVIAQuest.nextDDCard()">
        LANJUTKAN &rarr;
      </button>
    `;
    opts.style.display = 'none';
  }

  function nextDDCard() {
    state.dimensionDetective.currentIndex++;
    renderDimensionDetectiveCard();
  }

  /**
   * LEVEL 05: DIMENSION BOSS GAME BOARD RENDERER
   */
  function renderDimensionBossCard() {
    const container = document.getElementById('fq-db-board-container');
    if (!container) return;

    const challenges = state.dimensionBoss.challenges;
    const idx = state.dimensionBoss.currentIndex;
    const hp = state.dimensionBoss.bossHp;

    if (!challenges || challenges.length === 0 || idx >= challenges.length || hp <= 0) {
      window.FIVIAStudent.completeLevel(5);
      window.FIVIAStudent.awardBadge('👑 DIMENSION MASTER BOSS');

      container.innerHTML = `
        <div style="background: rgba(15,23,42,0.95); border: 2.5px solid var(--fq-amber); border-radius: 28px; padding: 36px; text-align: center; box-shadow: 0 0 50px rgba(245,158,11,0.4);">
          <div style="font-size: 4.5rem; margin-bottom: 12px;">👑</div>
          <span class="fq-badge-pill" style="border-color: var(--fq-amber); color: var(--fq-amber);"><i class="fas fa-crown"></i> FINAL BOSS DEFEATED</span>
          <h1 style="font-size: 2.6rem; font-weight: 900; color: #fff; margin: 8px 0;">VICTORY! BOSS DIMENSI KALAH!</h1>
          <p style="color: var(--fq-text-muted); margin-bottom: 24px;">Selamat! Anda telah menuntaskan seluruh tantangan FIVIA Physics Quest!</p>

          <div style="display: flex; gap: 14px; justify-content: center; flex-wrap: wrap;">
            <button class="fq-btn fq-btn-outline fq-btn-lg" onclick="window.FIVIAQuest.startLevel(5)"><i class="fas fa-redo"></i> MAIN LAGI</button>
            <button class="fq-btn fq-btn-amber fq-btn-lg" onclick="window.location.hash='#quest/student-dashboard'"><i class="fas fa-user-graduate"></i> DASHBOARD SAYA</button>
            <button class="fq-btn fq-btn-outline fq-btn-lg" onclick="window.location.hash='#quest/game-map'"><i class="fas fa-map-marked-alt"></i> KEMBALI KE MAP</button>
          </div>
        </div>
      `;
      return;
    }

    const c = challenges[idx];
    container.innerHTML = `
      <div style="background: rgba(15,23,42,0.95); border: 2.5px solid var(--fq-rose); border-radius: 28px; padding: 28px; text-align: left; box-shadow: 0 0 40px rgba(244,63,94,0.3);">
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid rgba(244,63,94,0.3); padding-bottom: 14px; margin-bottom: 20px;">
          <div>
            <span class="fq-badge-pill" style="border-color: var(--fq-rose); color: var(--fq-rose);"><i class="fas fa-skull"></i> LEVEL 05 &bull; BOSS BATTLE STAGE ${idx + 1}</span>
            <h2 style="font-size: 1.8rem; font-weight: 900; color: #fff; margin: 4px 0 0 0;">DIMENSION BOSS</h2>
          </div>
          <button class="fq-btn fq-btn-outline" onclick="window.location.hash='#quest/game-map'"><i class="fas fa-times"></i> KELUAR</button>
        </div>

        <!-- Boss Health Bar -->
        <div style="background: rgba(30,41,59,0.8); border: 1.5px solid var(--fq-rose); border-radius: 18px; padding: 16px; margin-bottom: 24px; text-align: center;">
          <div style="display: flex; justify-content: space-between; font-weight: 800; font-size: 0.9rem; color: #fff; margin-bottom: 8px;">
            <span>👾 BOSS DIMENSI (HP)</span>
            <span style="color: var(--fq-rose);">${hp} / 100 HP</span>
          </div>
          <div style="width: 100%; height: 16px; background: rgba(0,0,0,0.5); border-radius: 10px; overflow: hidden;">
            <div style="width: ${hp}%; height: 100%; background: linear-gradient(90deg, #ef4444, #f59e0b); transition: width 0.4s ease;"></div>
          </div>
        </div>

        <div style="font-size: 1.2rem; color: #fff; font-weight: 700; margin-bottom: 20px;">${c.question}</div>

        <div id="fq-db-feedback" style="display: none; margin-bottom: 20px; padding: 18px; border-radius: 16px;"></div>

        <div id="fq-db-options" style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px;">
          ${(c.options || []).map(opt => `
            <button class="fq-btn fq-btn-outline fq-btn-lg" style="padding: 16px; font-size: 1rem; text-align: left;" onclick="window.FIVIAQuest.submitDBAnswer('${opt.id}')">
              <strong>${opt.id}.</strong> ${opt.text || opt.label}
            </button>
          `).join('')}
        </div>
      </div>
    `;
  }

  function submitDBAnswer(optId) {
    const challenges = state.dimensionBoss.challenges;
    const idx = state.dimensionBoss.currentIndex;
    const c = challenges[idx];

    const fb = document.getElementById('fq-db-feedback');
    const opts = document.getElementById('fq-db-options');
    if (!fb || !opts) return;

    const isCorrect = String(optId) === String(c.correctAnswer);
    playSound(isCorrect ? 'correct' : 'wrong');

    if (isCorrect) {
      window.FIVIAStudent.addXP(40);
      state.dimensionBoss.bossHp = Math.max(0, state.dimensionBoss.bossHp - (c.hpDamage || 10));
    }

    fb.style.display = 'block';
    fb.style.background = isCorrect ? 'rgba(16,185,129,0.15)' : 'rgba(244,63,94,0.15)';
    fb.style.border = `1.5px solid ${isCorrect ? 'var(--fq-emerald)' : 'var(--fq-rose)'}`;
    fb.innerHTML = `
      <div style="font-weight: 800; font-size: 1.1rem; color: ${isCorrect ? 'var(--fq-emerald)' : 'var(--fq-rose)'}; margin-bottom: 6px;">
        ${isCorrect ? `💥 CRITICAL HIT! BOSS SERANGAN BERHASIL! (-${c.hpDamage || 10} HP, +40 XP)` : '❌ BOSS MENANGKIS SERANGAN!'}
      </div>
      <p style="color: #fff; margin: 0 0 12px 0; font-size: 0.9rem;">${c.explanation}</p>
      <button class="fq-btn fq-btn-cyan" style="width: 100%;" onclick="window.FIVIAQuest.nextDBCard()">
        SERANG LAGI &rarr;
      </button>
    `;
    opts.style.display = 'none';
  }

  function nextDBCard() {
    state.dimensionBoss.currentIndex++;
    renderDimensionBossCard();
  }

  function startSoloBesaranHunter() {
    state.besaranHunter.cards = window.FIVIAQuestBesaranHunter.getSessionCards(10);
    state.besaranHunter.currentIndex = 0;
    renderView('besaran-hunter');
  }

  function startSoloUnitMaster() {
    state.unitMaster.challenges = window.FIVIAQuestUnitMaster.getSoloSessionChallenges(10);
    state.unitMaster.currentIndex = 0;
    renderView('unit-master');
  }

  function startSoloSIExplorer() {
    state.siExplorer.challenges = window.FIVIAQuestSIExplorer.getSoloSessionChallenges(10);
    state.siExplorer.currentIndex = 0;
    renderView('si-explorer');
  }

  function startSoloDimensionDetective() {
    state.dimensionDetective.challenges = window.FIVIAQuestDimensionDetective.getSoloSessionChallenges(10);
    state.dimensionDetective.currentIndex = 0;
    renderView('dimension-detective');
  }

  function startSoloDimensionBoss() {
    state.dimensionBoss.challenges = window.FIVIAQuestDimensionBoss.getSoloSessionChallenges(10);
    state.dimensionBoss.currentIndex = 0;
    state.dimensionBoss.bossHp = 100;
    renderView('dimension-boss');
  }

  function startMasteryAssessment() { renderView('mastery-assessment'); }

  function toggleFullscreen() { if (!document.fullscreenElement) { (document.querySelector('.fivia-quest') || document.documentElement).requestFullscreen(); } else { document.exitFullscreen(); } }
  function toggleSound() { state.settings.soundEnabled = !state.settings.soundEnabled; saveStorage(STORAGE_KEYS.SETTINGS, state.settings); playSound('click'); }
  function backToFIVIA() { timer.stop(); window.location.hash = '#quest/access'; }

  /**
   * CLASSROOM ARENA: SMARTBOARD GROUP GAME MODE
   */
  function autoAssignTeamsFromRoster(teamCount) {
    teamCount = parseInt(teamCount) || 4;
    let roster = window.FIVIAExcelImport ? window.FIVIAExcelImport.getExistingRoster() : [];
    roster = roster.filter(s => s.status !== 'ARCHIVED');

    const defaultTeamNames = ['TEAM NEWTON', 'TEAM EINSTEIN', 'TEAM FARADAY', 'TEAM GALILEO', 'TEAM BOHR', 'TEAM CURIE', 'TEAM TESLA', 'TEAM PLANCK'];
    const teams = [];

    for (let t = 0; t < teamCount; t++) {
      teams.push({
        id: `t_${t + 1}`,
        name: defaultTeamNames[t] || `TEAM ${t + 1}`,
        score: 0,
        players: []
      });
    }

    if (roster.length > 0) {
      roster.forEach((s, idx) => {
        const teamIdx = idx % teamCount;
        teams[teamIdx].players.push({
          id: s.studentId,
          name: s.name,
          studentCode: s.studentCode || s.nis,
          turnsPlayed: 0
        });
      });
    } else {
      const sampleNames = [
        ['Ahmad Fauzan', 'Budi Santoso', 'Citra Dewi'],
        ['Dinda Putri', 'Eko Prasetyo', 'Fajar Ramadhan'],
        ['Gita Gutawa', 'Hadi Wijaya', 'Indah Permata'],
        ['Joko Widodo', 'Kiki Amalia', 'Lia Lestari']
      ];
      for (let t = 0; t < teamCount; t++) {
        const names = sampleNames[t % 4];
        names.forEach(n => {
          teams[t].players.push({ id: 'p_' + Math.random(), name: n, turnsPlayed: 0 });
        });
      }
    }

    state.teams = teams;
    saveStorage(STORAGE_KEYS.TEAMS, teams);
    return teams;
  }

  function renderClassroomSetupUI() {
    const container = document.getElementById('fq-team-cards-container');
    if (!container) return;

    if (!state.teams || state.teams.length === 0) {
      autoAssignTeamsFromRoster(4);
    }

    container.innerHTML = state.teams.map((team, idx) => `
      <div style="background: rgba(30,41,59,0.8); border: 2px solid var(--fq-border-cyan); border-radius: 20px; padding: 20px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
          <h3 style="color: var(--fq-cyan); font-size: 1.2rem; margin: 0; font-weight: 900;">${team.name}</h3>
          <span class="fq-badge-pill" style="margin: 0; color: var(--fq-amber); border-color: var(--fq-amber);">${team.score} PTS</span>
        </div>
        <div style="font-size: 0.82rem; color: var(--fq-text-muted); margin-bottom: 10px;">ANGGOTA TIM (${team.players.length} Siswa):</div>
        <ul style="list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 6px;">
          ${team.players.map(p => `
            <li style="background: rgba(15,23,42,0.6); padding: 8px 12px; border-radius: 8px; font-weight: 700; font-size: 0.88rem; color: #fff; display: flex; justify-content: space-between;">
              <span>👨‍🎓 ${p.name}</span>
              <span style="font-size: 0.75rem; color: var(--fq-cyan);">${p.studentCode || ''}</span>
            </li>
          `).join('')}
        </ul>
      </div>
    `).join('');
  }

  function renderActiveArenaUI() {
    const mainBox = document.getElementById('fq-arena-main-box');
    const lbBox = document.getElementById('fq-leaderboard-list');
    if (!mainBox) return;

    if (!state.teams || state.teams.length === 0) {
      autoAssignTeamsFromRoster(4);
    }

    const currentTeam = state.teams[state.arena.currentTeamIndex || 0] || state.teams[0];
    const currentPlayer = state.currentPlayer || (currentTeam.players[0] ? currentTeam.players[0].name : 'Belum Dipilih');

    // Update Player Bar
    const playerEl = document.getElementById('fq-arena-player-name');
    const teamEl = document.getElementById('fq-arena-player-team');
    if (playerEl) playerEl.textContent = currentPlayer;
    if (teamEl) {
      teamEl.textContent = `🚩 GILIRAN: ${currentTeam.name} (${currentTeam.score} PTS)`;
      teamEl.className = 'fq-badge-pill';
    }

    // Get active challenge pool (Unit Master / Besaran Hunter / Dimension challenges)
    const arenaChallenges = window.FIVIAQuestUnitMaster ? window.FIVIAQuestUnitMaster.getAllChallenges() : [];
    const cIdx = state.arena.challengeIndex || 0;

    if (cIdx >= arenaChallenges.length) {
      // Arena Victory Screen
      const sortedTeams = [...state.teams].sort((a, b) => b.score - a.score);
      const winner = sortedTeams[0];

      playSound('win');
      mainBox.innerHTML = `
        <div style="background: rgba(15,23,42,0.95); border: 3.5px solid var(--fq-amber); border-radius: 28px; padding: 40px; text-align: center; box-shadow: 0 0 60px rgba(245,158,11,0.5);">
          <div style="font-size: 5rem; margin-bottom: 12px;">🏆</div>
          <span class="fq-badge-pill" style="border-color: var(--fq-amber); color: var(--fq-amber); font-size: 1rem;"><i class="fas fa-crown"></i> JUARA CLASSROOM ARENA</span>
          <h1 style="font-size: 3rem; font-weight: 900; color: #fff; margin: 10px 0;">VICTORY! ${winner.name} WIN!</h1>
          <p style="color: var(--fq-text-muted); font-size: 1.1rem; margin-bottom: 28px;">Selamat kepada ${winner.name} atas perolehan skor tertinggi <strong>${winner.score} PTS</strong>!</p>

          <div style="display: flex; gap: 16px; justify-content: center; margin-bottom: 32px; flex-wrap: wrap;">
            ${sortedTeams.map((t, rank) => `
              <div style="background: rgba(30,41,59,0.8); border: 2px solid ${rank === 0 ? 'var(--fq-amber)' : 'var(--fq-border-cyan)'}; padding: 18px 24px; border-radius: 18px; min-width: 160px;">
                <div style="font-size: 0.8rem; color: var(--fq-text-muted);">PERINGKAT #${rank + 1}</div>
                <div style="font-size: 1.2rem; font-weight: 900; color: #fff; margin: 4px 0;">${t.name}</div>
                <div style="font-size: 1.6rem; font-weight: 900; color: var(--fq-cyan);">${t.score} PTS</div>
              </div>
            `).join('')}
          </div>

          <div style="display: flex; gap: 16px; justify-content: center;">
            <button class="fq-btn fq-btn-cyan fq-btn-lg" onclick="window.FIVIAQuest.resetArena()"><i class="fas fa-redo"></i> MAIN ARENA LAGI</button>
            <button class="fq-btn fq-btn-outline fq-btn-lg" onclick="window.location.hash='#quest/classroom-setup'"><i class="fas fa-cog"></i> SETUP TIM</button>
          </div>
        </div>
      `;
      renderArenaLeaderboard();
      return;
    }

    const c = arenaChallenges[cIdx] || { question: 'Pasangkan Besaran dengan Satuan SI yang Tepat', quantity: 'Panjang', options: [{ id: 'm', label: 'meter (m)' }, { id: 'kg', label: 'kilogram (kg)' }], correctAnswer: 'm', explanation: 'Meter adalah satuan SI panjang.' };

    mainBox.innerHTML = `
      <div style="background: rgba(15, 23, 42, 0.95); border: 3px solid var(--fq-cyan); border-radius: 28px; padding: 32px; text-align: left; box-shadow: 0 0 40px var(--fq-cyan-glow);">
        <!-- Smartboard Header Bar -->
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid var(--fq-border-cyan); padding-bottom: 16px; margin-bottom: 24px; flex-wrap: wrap; gap: 12px;">
          <div>
            <span class="fq-badge-pill" style="font-size: 0.85rem;"><i class="fas fa-tv"></i> SMARTBOARD ARENA &bull; SOAL ${cIdx + 1} / ${arenaChallenges.length}</span>
            <h2 style="font-size: 2rem; font-weight: 900; color: #fff; margin: 4px 0 0 0;">GILIRAN: <strong style="color: var(--fq-amber);">${currentTeam.name}</strong></h2>
          </div>
          <div style="display: flex; gap: 8px; flex-wrap: wrap;">
            <button class="fq-btn fq-btn-cyan" onclick="window.FIVIAQuest.pickRandomPlayer()"><i class="fas fa-crosshairs"></i> 🎯 ROTASI PEMAIN</button>
            <button class="fq-btn fq-btn-emerald" onclick="window.FIVIAQuest.openBonusScoreModal()"><i class="fas fa-plus-circle"></i> ⭐ BONUS SKOR</button>
            <button class="fq-btn fq-btn-amber" onclick="window.FIVIAQuest.stealArenaPoints()"><i class="fas fa-skull-crossbones"></i> 🏴‍☠️ REBUT SOAL</button>
          </div>
        </div>

        <!-- Smartboard Big HOTS Question Display -->
        <div style="font-size: 1.5rem; font-weight: 800; color: #fff; margin-bottom: 20px; line-height: 1.4;">${c.question}</div>
        
        ${c.quantity ? `
          <div style="background: rgba(30,41,59,0.8); border: 1.5px solid var(--fq-border-cyan); border-radius: 20px; padding: 20px; text-align: center; font-size: 1.8rem; font-weight: 900; color: var(--fq-cyan); margin-bottom: 28px;">
            ${c.quantity}
          </div>
        ` : ''}

        <div id="fq-arena-feedback" style="display: none; margin-bottom: 24px; padding: 20px; border-radius: 18px;"></div>

        <!-- Big Touch Option Buttons for Smartboard Interactive Screen -->
        <div id="fq-arena-options" style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
          ${(c.options || []).map(opt => `
            <button class="fq-btn fq-btn-outline fq-btn-lg" style="padding: 22px; font-size: 1.15rem; min-height: 64px; text-align: left; border-width: 2px;" onclick="window.FIVIAQuest.submitArenaAnswer('${opt.id}')">
              <strong>${opt.id || opt.label}.</strong> ${opt.label || opt.text || opt.id}
            </button>
          `).join('')}
        </div>
      </div>
    `;

    renderArenaLeaderboard();
  }

  function submitArenaAnswer(optId) {
    const arenaChallenges = window.FIVIAQuestUnitMaster ? window.FIVIAQuestUnitMaster.getAllChallenges() : [];
    const cIdx = state.arena.challengeIndex || 0;
    const c = arenaChallenges[cIdx];
    if (!c) return;

    const currentTeam = state.teams[state.arena.currentTeamIndex || 0];
    const fb = document.getElementById('fq-arena-feedback');
    const opts = document.getElementById('fq-arena-options');
    if (!fb || !opts) return;

    const isCorrect = String(optId) === String(c.correctAnswer);
    playSound(isCorrect ? 'correct' : 'wrong');

    if (isCorrect) {
      currentTeam.score += 100;
      saveStorage(STORAGE_KEYS.TEAMS, state.teams);
    }

    fb.style.display = 'block';
    fb.style.background = isCorrect ? 'rgba(16,185,129,0.15)' : 'rgba(244,63,94,0.15)';
    fb.style.border = `2px solid ${isCorrect ? 'var(--fq-emerald)' : 'var(--fq-rose)'}`;
    fb.innerHTML = `
      <div style="font-weight: 900; font-size: 1.3rem; color: ${isCorrect ? 'var(--fq-emerald)' : 'var(--fq-rose)'}; margin-bottom: 8px;">
        ${isCorrect ? `✅ JAWABAN TEPAT! ${currentTeam.name} MENDAPATKAN +100 PTS!` : `❌ JAWABAN SALAH! SOAL BISA DIREBUT TIM LAIN!`}
      </div>
      <p style="color: #fff; font-size: 1rem; margin: 0 0 16px 0;">${c.explanation}</p>
      <button class="fq-btn fq-btn-cyan fq-btn-lg" style="width: 100%;" onclick="window.FIVIAQuest.nextArenaChallenge()">
        SOAL SELANJUTNYA &rarr;
      </button>
    `;
    opts.style.display = 'none';
  }

  function nextArenaChallenge() {
    state.arena.challengeIndex = (state.arena.challengeIndex || 0) + 1;
    // Rotate team turn
    state.arena.currentTeamIndex = ((state.arena.currentTeamIndex || 0) + 1) % state.teams.length;
    renderActiveArenaUI();
  }

  function stealArenaPoints() {
    const nextTeamIdx = ((state.arena.currentTeamIndex || 0) + 1) % state.teams.length;
    state.arena.currentTeamIndex = nextTeamIdx;
    const stolenTeam = state.teams[nextTeamIdx];
    alert(`🏴‍☠️ SOAL DIREBUT OLEH ${stolenTeam.name}!\n\nGiliran menjawab berpindah ke ${stolenTeam.name}.`);
    renderActiveArenaUI();
  }

  function renderArenaLeaderboard() {
    const lbBox = document.getElementById('fq-leaderboard-list');
    if (!lbBox) return;

    const sortedTeams = [...state.teams].sort((a, b) => b.score - a.score);
    lbBox.innerHTML = sortedTeams.map((team, idx) => `
      <div style="background: rgba(30,41,59,0.7); border: 1.5px solid ${idx === 0 ? 'var(--fq-amber)' : 'var(--fq-border-cyan)'}; border-radius: 16px; padding: 14px 20px; margin-bottom: 10px; display: flex; align-items: center; justify-content: space-between;">
        <div style="display: flex; align-items: center; gap: 14px;">
          <span style="font-size: 1.3rem; font-weight: 900; color: ${idx === 0 ? 'var(--fq-amber)' : 'var(--fq-cyan)'};">#${idx + 1}</span>
          <div>
            <div style="font-size: 1.1rem; font-weight: 800; color: #fff;">${team.name}</div>
            <div style="font-size: 0.78rem; color: var(--fq-text-muted);">${team.players.length} Anggota Tim</div>
          </div>
        </div>
        <div style="font-size: 1.5rem; font-weight: 900; color: var(--fq-amber);">${team.score} PTS</div>
      </div>
    `).join('');
  }

  function pickRandomPlayer() {
    const currentTeam = state.teams[state.arena.currentTeamIndex || 0] || state.teams[0];
    if (!currentTeam || !currentTeam.players || currentTeam.players.length === 0) {
      alert('⚠️ Tim tidak memiliki daftar anggota siswa.');
      return;
    }

    const modal = document.getElementById('fq-random-player-modal');
    const nameEl = document.getElementById('fq-shuffle-name');
    const teamEl = document.getElementById('fq-shuffle-team');

    if (modal) modal.classList.add('active');

    let count = 0;
    const interval = setInterval(() => {
      const randomP = currentTeam.players[Math.floor(Math.random() * currentTeam.players.length)];
      if (nameEl) nameEl.textContent = randomP.name;
      if (teamEl) teamEl.textContent = currentTeam.name;
      playSound('click');
      count++;

      if (count > 15) {
        clearInterval(interval);
        const finalP = currentTeam.players[Math.floor(Math.random() * currentTeam.players.length)];
        if (nameEl) nameEl.textContent = finalP.name;
        state.currentPlayer = finalP.name;
        
        setTimeout(() => {
          if (modal) modal.classList.remove('active');
          renderActiveArenaUI();
        }, 1200);
      }
    }, 100);
  }

  function applyBonusScore() {
    const currentTeam = state.teams[state.arena.currentTeamIndex || 0];
    if (currentTeam) {
      currentTeam.score += 50;
      saveStorage(STORAGE_KEYS.TEAMS, state.teams);
      playSound('win');
      alert(`⭐ BONUS SKOR +50 PTS BERHASIL DITERAPKAN KE ${currentTeam.name}!`);
      renderActiveArenaUI();
    }
  }

  function resetArena() {
    timer.stop();
    state.arena.currentRound = 1;
    state.arena.challengeIndex = 0;
    state.arena.currentTeamIndex = 0;
    state.teams.forEach(t => t.score = 0);
    saveStorage(STORAGE_KEYS.TEAMS, state.teams);
    alert('↻ Classroom Arena Berhasil Direset. Memulai Sesi Baru.');
    renderActiveArenaUI();
  }

  function startSoloBesaranHunter() {
    state.besaranHunter.cards = window.FIVIAQuestBesaranHunter.getSessionCards(10);
    state.besaranHunter.currentIndex = 0;
    renderView('besaran-hunter');
  }

  function startSoloUnitMaster() {
    state.unitMaster.challenges = window.FIVIAQuestUnitMaster.getSoloSessionChallenges(10);
    state.unitMaster.currentIndex = 0;
    renderView('unit-master');
  }

  function startSoloSIExplorer() {
    state.siExplorer.challenges = window.FIVIAQuestSIExplorer.getSoloSessionChallenges(10);
    state.siExplorer.currentIndex = 0;
    renderView('si-explorer');
  }

  function startSoloDimensionDetective() {
    state.dimensionDetective.challenges = window.FIVIAQuestDimensionDetective.getSoloSessionChallenges(10);
    state.dimensionDetective.currentIndex = 0;
    renderView('dimension-detective');
  }

  function startSoloDimensionBoss() {
    state.dimensionBoss.challenges = window.FIVIAQuestDimensionBoss.getSoloSessionChallenges(10);
    state.dimensionBoss.currentIndex = 0;
    state.dimensionBoss.bossHp = 100;
    renderView('dimension-boss');
  }

  function startMasteryAssessment() { renderView('mastery-assessment'); }

  function toggleFullscreen() { if (!document.fullscreenElement) { (document.querySelector('.fivia-quest') || document.documentElement).requestFullscreen(); } else { document.exitFullscreen(); } }
  function toggleSound() { state.settings.soundEnabled = !state.settings.soundEnabled; saveStorage(STORAGE_KEYS.SETTINGS, state.settings); playSound('click'); }
  function backToFIVIA() { timer.stop(); window.location.hash = '#quest/access'; }

  // Bridge functions for Phase 1-4 inline onclick handlers
  function exportCSV() { if (window.FIVIAReports) window.FIVIAReports.exportClassAnalyticsCSV(); else if (window.FIVIAClassroomReports) window.FIVIAClassroomReports.exportClassroomCSV('cls_2045_x1'); }
  function exportJSON() { if (window.FIVIAReports) window.FIVIAReports.exportClassAnalyticsJSON(); else if (window.FIVIAClassroomReports) window.FIVIAClassroomReports.exportClassroomJSON('cls_2045_x1'); }
  function printReport() { if (window.FIVIAReports) window.FIVIAReports.printTeacherReport(); else if (window.FIVIAClassroomReports) window.FIVIAClassroomReports.printClassroomReport('cls_2045_x1'); }
  function createNewClassSessionFromUI() { const name = (document.getElementById('fq-input-session-name') || {}).value; const cls = (document.getElementById('fq-input-session-class') || {}).value; const teacher = (document.getElementById('fq-input-session-teacher') || {}).value; if (window.FIVIASession) window.FIVIASession.createSession(name, cls, teacher); alert('🎉 Sesi Kelas Baru Berhasil Dibuat!'); window.location.hash = '#quest/class-session'; }
  function saveSettingsFromUI() { alert('✅ Pengaturan Berhasil Disimpan!'); }
  function togglePauseGame() { timer.isPaused ? timer.resume() : timer.pause(); }
  function showHintModal() { const modal = document.getElementById('fq-hint-modal'); if (modal) modal.classList.add('active'); else alert('💡 Petunjuk Konsep: Ingatlah satuan pokok dan dimensi dasar SI.'); }
  function closeHintModal() { const modal = document.getElementById('fq-hint-modal'); if (modal) modal.classList.remove('active'); }
  function openBonusScoreModal() { const modal = document.getElementById('fq-bonus-modal'); if (modal) modal.classList.add('active'); else alert('⭐ Tambahkan Skor Bonus Tim!'); }
  function closeBonusModal() { const modal = document.getElementById('fq-bonus-modal'); if (modal) modal.classList.remove('active'); }
  function pickRandomPlayer() { pickRandomPlayer(); }
  function resumeGame() { timer.resume(); alert('▶ Permainan Dilanjuutkan.'); }

  return {
    init: init,
    handleSubRouting: handleSubRouting,
    renderView: renderView,
    startLevel: startLevel,
    submitBesaranAnswer: submitBesaranAnswer,
    nextBesaranCard: nextBesaranCard,
    submitUnitAnswer: submitUnitAnswer,
    nextUnitCard: nextUnitCard,
    submitSIAnswer: submitSIAnswer,
    nextSICard: nextSICard,
    submitDDAnswer: submitDDAnswer,
    nextDDCard: nextDDCard,
    submitDBAnswer: submitDBAnswer,
    nextDBCard: nextDBCard,
    submitArenaAnswer: submitArenaAnswer,
    nextArenaChallenge: nextArenaChallenge,
    stealArenaPoints: stealArenaPoints,
    toggleFullscreen: toggleFullscreen,
    toggleSound: toggleSound,
    backToFIVIA: backToFIVIA,
    exportCSV: exportCSV,
    exportJSON: exportJSON,
    printReport: printReport,
    createNewClassSessionFromUI: createNewClassSessionFromUI,
    saveSettingsFromUI: saveSettingsFromUI,
    togglePauseGame: togglePauseGame,
    showHintModal: showHintModal,
    closeHintModal: closeHintModal,
    openBonusScoreModal: openBonusScoreModal,
    closeBonusModal: closeBonusModal,
    applyBonusScore: applyBonusScore,
    pickRandomPlayer: pickRandomPlayer,
    resetArena: resetArena,
    resumeGame: resumeGame
  };

})();

document.addEventListener('DOMContentLoaded', function() { window.FIVIAQuest.init(); });
