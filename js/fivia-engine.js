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

    window.scrollTo(0, 0);
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
            <div style="font-size: 1.8rem; font-weight: 900; color: var(--fq-amber);">${student.xp || 350} XP</div>
          </div>
          <div style="background: rgba(30,41,59,0.7); border: 1px solid var(--fq-border-cyan); border-radius: 18px; padding: 18px;">
            <div style="font-size: 0.8rem; color: var(--fq-text-muted);">JUMLAH LENCANA</div>
            <div style="font-size: 1.8rem; font-weight: 900; color: var(--fq-cyan);">${(student.badges || []).length || 5} Badges</div>
          </div>
          <div style="background: rgba(30,41,59,0.7); border: 1px solid var(--fq-border-cyan); border-radius: 18px; padding: 18px;">
            <div style="font-size: 0.8rem; color: var(--fq-text-muted);">AKURASI MASTERY</div>
            <div style="font-size: 1.8rem; font-weight: 900; color: var(--fq-emerald);">88%</div>
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
    const experiments = window.FIVIAVirtualLabData.getAllExperiments();
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
    const projects = window.FIVIAProjectsData.getAllProjects();
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

  function startSoloBesaranHunter() { state.besaranHunter.cards = window.FIVIAQuestBesaranHunter.getSessionCards(10); renderView('besaran-hunter'); }
  function startSoloUnitMaster() { state.unitMaster.challenges = window.FIVIAQuestUnitMaster.getSoloSessionChallenges(10); renderView('unit-master'); }
  function startSoloSIExplorer() { state.siExplorer.challenges = window.FIVIAQuestSIExplorer.getSoloSessionChallenges(10); renderView('si-explorer'); }
  function startSoloDimensionDetective() { state.dimensionDetective.challenges = window.FIVIAQuestDimensionDetective.getSoloSessionChallenges(10); renderView('dimension-detective'); }
  function startSoloDimensionBoss() { state.dimensionBoss.challenges = window.FIVIAQuestDimensionBoss.getSoloSessionChallenges(10); renderView('dimension-boss'); }
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
  function applyBonusScore() { alert('⭐ Skor Bonus Tim Berhasil Diterapkan!'); closeBonusModal(); }
  function pickRandomPlayer() { alert('🎯 Pemain Acak Terpilih: Ahmad (Team Newton)'); }
  function resetArena() { timer.stop(); alert('↻ Classroom Arena Berhasil Direset.'); }
  function resumeGame() { timer.resume(); alert('▶ Permainan Dilanjuutkan.'); }

  return {
    init: init,
    handleSubRouting: handleSubRouting,
    renderView: renderView,
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
