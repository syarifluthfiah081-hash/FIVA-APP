/**
 * FIVIA GROUP PLAY ENGINE MODULE
 * Phase 10: Interactive Board UI Renderer, Touch Target (>72px), Turn Display & Teacher Controller
 */

window.FIVIAGroupPlayEngine = (function() {
  'use strict';

  function renderGroupPlayUI() {
    const container = document.getElementById('fq-group-play-container');
    if (!container) return;

    const state = window.FIVIAGroupPlay.getSessionState();

    if (state.status === 'READY') {
      renderSetupAndClassSelection(container, state);
    } else if (state.status === 'RUNNING' || state.status === 'PAUSED') {
      renderActiveBoardUI(container, state);
    } else if (state.status === 'COMPLETED') {
      if (window.FIVIAGroupPlayAnalytics && typeof window.FIVIAGroupPlayAnalytics.renderSessionSummaryUI === 'function') {
        window.FIVIAGroupPlayAnalytics.renderSessionSummaryUI(container, state);
      } else {
        renderSetupAndClassSelection(container, state);
      }
    }
  }

  function renderSetupAndClassSelection(container, state) {
    const classes = window.FIVIAGroupPlay.getClassrooms();
    const activeCls = classes.find(c => c.id === state.classroomId) || classes[0] || {};
    const roster = window.FIVIAGroupPlay.getRosterForClass(activeCls.id);

    container.innerHTML = `
      <div style="background: rgba(15, 23, 42, 0.95); border: 3px solid var(--fq-cyan); border-radius: 28px; padding: 36px; text-align: left; box-shadow: 0 0 50px var(--fq-cyan-glow);">
        <!-- Subtitle Header -->
        <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 2.5px solid var(--fq-border-cyan); padding-bottom: 18px; margin-bottom: 28px; flex-wrap: wrap; gap: 14px;">
          <div>
            <span class="fq-badge-pill" style="font-size: 0.9rem; padding: 6px 16px;"><i class="fas fa-users"></i> GROUP PLAY &bull; ROTATING PLAYER MODE</span>
            <h1 style="font-size: 2.4rem; font-weight: 900; color: #fff; margin: 6px 0 2px 0;">FIVIA GROUP PLAY</h1>
            <div style="color: var(--fq-cyan); font-weight: 800; font-size: 1.05rem;">Belajar &bull; Bermain &bull; Berkolaborasi &bull; Bergiliran</div>
          </div>
          <div style="display: flex; gap: 12px; flex-wrap: wrap;">
            <button class="fq-btn fq-btn-cyan fq-btn-lg" style="min-height: 56px; font-size: 1.1rem; min-width: 200px;" onclick="window.FIVIAGroupPlayEngine.startGroupPlaySession()"><i class="fas fa-play"></i> ▶ MULAI GROUP PLAY</button>
            <button class="fq-btn fq-btn-emerald fq-btn-lg" style="min-height: 56px; font-size: 1rem;" onclick="window.FIVIAClassroomEngine.triggerExcelImport()"><i class="fas fa-file-import"></i> 📥 IMPORT SISWA EXCEL</button>
          </div>
        </div>

        <!-- Class Selection Bar -->
        <div style="background: rgba(30,41,59,0.7); border: 1.5px solid var(--fq-border-cyan); border-radius: 20px; padding: 20px; margin-bottom: 28px;">
          <h3 style="color: #fff; font-size: 1.2rem; margin: 0 0 14px 0; font-weight: 800;"><i class="fas fa-chalkboard"></i> PILIH KELAS DARI DATABASE FIREBASE:</h3>
          <div style="display: flex; gap: 14px; flex-wrap: wrap; align-items: center;">
            ${classes.map(cls => `
              <button class="fq-btn ${cls.id === activeCls.id ? 'fq-btn-cyan' : 'fq-btn-outline'}" style="min-height: 56px; padding: 10px 24px; font-size: 1.05rem; font-weight: 800;" onclick="window.FIVIAGroupPlayEngine.selectClass('${cls.id}')">
                📘 ${cls.name} (${cls.studentCount || roster.length} Siswa)
              </button>
            `).join('')}
          </div>
        </div>

        <!-- Settings Bar (Turn Order & Timer) -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 18px; margin-bottom: 28px;">
          <div style="background: rgba(30,41,59,0.7); border: 1px solid var(--fq-border-cyan); border-radius: 18px; padding: 18px;">
            <label class="fq-form-label" style="font-size: 0.9rem; font-weight: 800; color: var(--fq-cyan);">URUTAN GILIRAN (TURN ORDER)</label>
            <select class="fq-select" style="min-height: 48px; font-size: 1rem; font-weight: 700;" onchange="window.FIVIAGroupPlay.setTurnOrderMode(this.value)">
              <option value="ROUND_ROBIN" ${state.turnOrderMode === 'ROUND_ROBIN' ? 'selected' : ''}>🔄 Round Robin (Sesuai Urutan - Default)</option>
              <option value="RANDOM_ONCE" ${state.turnOrderMode === 'RANDOM_ONCE' ? 'selected' : ''}>🎲 Acak Sekali (Random Once)</option>
              <option value="RANDOM_EVERY_ROUND" ${state.turnOrderMode === 'RANDOM_EVERY_ROUND' ? 'selected' : ''}>🔀 Acak Setiap Ronde</option>
              <option value="MANUAL" ${state.turnOrderMode === 'MANUAL' ? 'selected' : ''}>🖐️ Manual (Pilih Siswa)</option>
            </select>
          </div>

          <div style="background: rgba(30,41,59,0.7); border: 1px solid var(--fq-border-cyan); border-radius: 18px; padding: 18px;">
            <label class="fq-form-label" style="font-size: 0.9rem; font-weight: 800; color: var(--fq-cyan);">DURASI TIMER MAJU (DETIK)</label>
            <select class="fq-select" style="min-height: 48px; font-size: 1rem; font-weight: 700;" onchange="window.FIVIAGroupPlay.setTimerDuration(this.value)">
              <option value="15" ${state.timerDuration == 15 ? 'selected' : ''}>⏱️ 15 Detik</option>
              <option value="30" ${state.timerDuration == 30 ? 'selected' : ''}>⏱️ 30 Detik (Default)</option>
              <option value="45" ${state.timerDuration == 45 ? 'selected' : ''}>⏱️ 45 Detik</option>
              <option value="60" ${state.timerDuration == 60 ? 'selected' : ''}>⏱️ 60 Detik</option>
              <option value="90" ${state.timerDuration == 90 ? 'selected' : ''}>⏱️ 90 Detik</option>
            </select>
          </div>

          <div style="background: rgba(30,41,59,0.7); border: 1px solid var(--fq-border-cyan); border-radius: 18px; padding: 18px;">
            <label class="fq-form-label" style="font-size: 0.9rem; font-weight: 800; color: var(--fq-cyan);">TINGKAT KESULITAN SOAL</label>
            <select class="fq-select" style="min-height: 48px; font-size: 1rem; font-weight: 700;" onchange="window.FIVIAGroupPlay.setDifficultyFilter(this.value)">
              <option value="ALL">⭐ SEMUA KATEGORI (DEFAULT)</option>
              <option value="EASY">🟢 EASY (PEMULA)</option>
              <option value="MEDIUM">🟡 MEDIUM (SEDANG)</option>
              <option value="HARD">🔴 HARD (TANTANGAN)</option>
              <option value="HOTS">🟣 HOTS (ANALISIS TINGGI)</option>
            </select>
          </div>
        </div>

        <!-- Groups Roster Container -->
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
          <h3 style="color: var(--fq-cyan); font-size: 1.3rem; margin: 0; font-weight: 900;"><i class="fas fa-users-items"></i> KELOMPOK DARI DATABASE SISWA (${(state.groups||[]).length} Kelompok):</h3>
          <button class="fq-btn fq-btn-amber" style="min-height: 44px; padding: 6px 16px;" onclick="window.FIVIAGroupPlayEngine.autoGroup()"><i class="fas fa-random"></i> 🔀 BAGI KELOMPOK OTOMATIS</button>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 20px;">
          ${(state.groups || []).map((group, idx) => `
            <div style="background: rgba(30,41,59,0.85); border: 2.5px solid var(--fq-border-cyan); border-radius: 22px; padding: 22px;">
              <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1.5px solid var(--fq-border-cyan); padding-bottom: 10px; margin-bottom: 14px;">
                <h4 style="color: var(--fq-cyan); font-size: 1.25rem; font-weight: 900; margin: 0;">👥 ${group.groupName}</h4>
                <span class="fq-badge-pill" style="margin: 0; color: var(--fq-amber); border-color: var(--fq-amber);">${group.members.length} Siswa</span>
              </div>

              <ul style="list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 8px;">
                ${group.members.map((m, mIdx) => `
                  <li style="background: rgba(15,23,42,0.7); padding: 10px 14px; border-radius: 12px; font-weight: 800; color: #fff; display: flex; justify-content: space-between; align-items: center;">
                    <div style="display: flex; align-items: center; gap: 10px;">
                      <span style="background: var(--fq-cyan); color: #000; border-radius: 50%; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; font-size: 0.75rem; font-weight: 900;">${mIdx + 1}</span>
                      <span>👨‍🎓 ${m.studentName}</span>
                    </div>
                    <span style="font-size: 0.75rem; color: var(--fq-cyan); font-family: monospace;">${m.studentCode || ''}</span>
                  </li>
                `).join('')}
              </ul>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  function getGroupPlayQuestions() {
    if (window.FIVIAGroupLevelQuestions && typeof window.FIVIAGroupLevelQuestions.getQuestionsForLevel === 'function') {
      return window.FIVIAGroupLevelQuestions.getQuestionsForLevel('LEVEL_01');
    }
    return [
      { id: 'gp_q1', question: 'Manakah yang merupakan besaran pokok SI?', quantity: 'Massa', options: [{ id: 'A', label: 'Kecepatan' }, { id: 'B', label: 'Gaya' }, { id: 'C', label: 'Massa' }, { id: 'D', label: 'Energi' }], correctAnswer: 'C', explanation: 'Massa adalah salah satu dari 7 besaran pokok SI dengan satuan kilogram (kg).' },
      { id: 'gp_q2', question: 'Satuan Standar Internasional (SI) untuk besaran panjang adalah...', options: [{ id: 'A', label: 'Centimeter' }, { id: 'B', label: 'Meter' }, { id: 'C', label: 'Kilometer' }, { id: 'D', label: 'Millimeter' }], correctAnswer: 'B', explanation: 'Meter (m) adalah satuan pokok SI untuk panjang.' },
      { id: 'gp_q3', question: 'Dimensi dari besaran kecepatan v = s / t adalah...', options: [{ id: 'A', label: '[L]' }, { id: 'B', label: '[LT⁻¹]' }, { id: 'C', label: '[LT⁻²]' }, { id: 'D', label: '[MLT⁻¹]' }], correctAnswer: 'B', explanation: 'Kecepatan v berdimensi [LT⁻¹].' }
    ];
  }

  function renderActiveBoardUI(container, state) {
    const activeGroup = state.activeGroup || state.groups[0] || { groupName: 'GROUP NEWTON', score: 0 };
    const activePlayer = state.activePlayer || (activeGroup.members ? activeGroup.members[0] : null) || { studentName: 'Ahmad Fauzan', studentCode: 'STD-001' };

    const challenges = getGroupPlayQuestions();
    const cIdx = state.turnIndex % Math.max(1, challenges.length);
    const challenge = challenges[cIdx] || challenges[0];
    const qText = challenge.question || challenge.title || 'Manakah yang merupakan besaran pokok SI?';
    const optsList = challenge.options || [
      { id: 'A', label: 'Kecepatan' },
      { id: 'B', label: 'Gaya' },
      { id: 'C', label: 'Massa' },
      { id: 'D', label: 'Energi' }
    ];

    container.innerHTML = `
      <div style="background: rgba(15, 23, 42, 0.98); border: 3.5px solid var(--fq-cyan); border-radius: 32px; padding: 32px; text-align: left; box-shadow: 0 0 60px var(--fq-cyan-glow);">
        <!-- Interactive Smartboard Top Bar -->
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 3px solid var(--fq-border-cyan); padding-bottom: 18px; margin-bottom: 24px; flex-wrap: wrap; gap: 14px;">
          <div>
            <span class="fq-badge-pill" style="font-size: 1rem; padding: 8px 18px;"><i class="fas fa-tv"></i> SMARTBOARD DISPLAY &bull; 16:9 INTERACTIVE MODE</span>
            <h2 style="font-size: 2.2rem; font-weight: 900; color: #fff; margin: 6px 0 0 0;">👥 KELOMPOK: <strong style="color: var(--fq-amber);">${activeGroup.groupName}</strong></h2>
          </div>
          <div style="display: flex; align-items: center; gap: 16px;">
            <div style="background: rgba(30,41,59,0.9); border: 2px solid var(--fq-amber); border-radius: 20px; padding: 12px 24px; text-align: center;">
              <div style="font-size: 0.8rem; color: var(--fq-text-muted); font-weight: 800;">SKOR KELOMPOK</div>
              <div style="font-size: 2rem; font-weight: 900; color: var(--fq-amber);">${activeGroup.score || 0} XP</div>
            </div>
            <button class="fq-btn fq-btn-outline" style="min-height: 56px; padding: 8px 20px; font-size: 1rem;" onclick="window.FIVIAGroupPlayEngine.togglePause()"><i class="fas ${state.isPaused ? 'fa-play' : 'fa-pause'}"></i> ${state.isPaused ? 'RESUME' : 'PAUSE'}</button>
          </div>
        </div>

        <!-- PLAYER TURN BANNER (SANGAT BESAR & HIGH CONTRAST) -->
        <div style="background: linear-gradient(135deg, rgba(139,92,246,0.25), rgba(6,182,212,0.25)); border: 3px solid var(--fq-cyan); border-radius: 24px; padding: 24px; text-align: center; margin-bottom: 28px; box-shadow: 0 0 40px rgba(6,182,212,0.3);">
          <div style="font-size: 1.1rem; font-weight: 900; color: var(--fq-amber); letter-spacing: 2px; text-transform: uppercase; margin-bottom: 6px;">
            🎯 GILIRANMU! SEKARANG MAJU KE DEPAN PAPAN INTERAKTIF
          </div>
          <h1 style="font-size: 3.2rem; font-weight: 900; color: #fff; margin: 4px 0; text-shadow: 0 0 20px var(--fq-cyan);">
            👨‍🎓 ${activePlayer.studentName}
          </h1>
          <div style="font-size: 1.1rem; color: var(--fq-cyan); font-weight: 800; margin-top: 6px;">
            👥 ${activeGroup.groupName} &bull; RONDE ${state.currentRound} &bull; KODE: ${activePlayer.studentCode || ''}
          </div>
        </div>

        <!-- Big HOTS Physics Question Card for Smartboard Display -->
        <div style="background: rgba(30,41,59,0.85); border: 2.5px solid var(--fq-border-cyan); border-radius: 24px; padding: 28px; margin-bottom: 28px;">
          <div style="font-size: 1.6rem; font-weight: 800; color: #fff; line-height: 1.4; margin-bottom: 18px;">
            ${qText}
          </div>

          ${challenge.quantity ? `
            <div style="background: rgba(15,23,42,0.8); border: 2px solid var(--fq-cyan); border-radius: 18px; padding: 18px; text-align: center; font-size: 2rem; font-weight: 900; color: var(--fq-cyan); margin-bottom: 24px;">
              ${challenge.quantity}
            </div>
          ` : ''}

          <div id="fq-gp-feedback" style="display: none; margin-bottom: 24px; padding: 22px; border-radius: 20px; font-size: 1.1rem;"></div>

          <!-- Touch Target Buttons >= 72px Height -->
          <div id="fq-gp-options" style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
            ${optsList.map(opt => `
              <button class="fq-btn fq-btn-outline fq-btn-lg" style="min-height: 76px; padding: 20px; font-size: 1.25rem; font-weight: 800; text-align: left; border-width: 2.5px;" onclick="window.FIVIAGroupPlayEngine.submitAnswer('${opt.id}')">
                <strong style="color: var(--fq-amber); font-size: 1.4rem;">${opt.id}.</strong> ${opt.label || opt.text || opt.name || opt.id}
              </button>
            `).join('')}
          </div>
        </div>

        <!-- Teacher Controller Floating Bar -->
        <div style="background: rgba(15,23,42,0.9); border: 2px solid var(--fq-border-cyan); border-radius: 20px; padding: 18px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px;">
          <div style="font-weight: 800; color: #fff; font-size: 1rem;">
            🎮 CONTROLLER GURU: <span style="color: var(--fq-cyan);">${activePlayer.studentName} (${activeGroup.groupName})</span>
          </div>
          <div style="display: flex; gap: 10px; flex-wrap: wrap;">
            <button class="fq-btn fq-btn-amber" style="min-height: 48px; font-weight: 800;" onclick="window.FIVIAGroupPlayEngine.skipTurn()"><i class="fas fa-step-forward"></i> ⏭ LEWATI GILIRAN</button>
            <button class="fq-btn fq-btn-outline" style="min-height: 48px; font-weight: 800;" onclick="window.FIVIAGroupPlayEngine.repeatTurn()"><i class="fas fa-redo"></i> 🔄 ULANGI GILIRAN</button>
            <button class="fq-btn fq-btn-danger" style="min-height: 48px; font-weight: 800;" onclick="window.FIVIAGroupPlayEngine.endSession()"><i class="fas fa-stop-circle"></i> 🏁 SELESAIKAN SESI</button>
          </div>
        </div>
      </div>
    `;
  }

  function selectClass(classId) {
    window.FIVIAGroupPlay.autoGroupStudents(classId, 4);
    renderGroupPlayUI();
  }

  function autoGroup() {
    const state = window.FIVIAGroupPlay.getSessionState();
    window.FIVIAGroupPlay.autoGroupStudents(state.classroomId, 4);
    renderGroupPlayUI();
    alert('🎉 KELOMPOK BERHASIL DIBAGI OTOMATIS DARI DATABASE SISWA!');
  }

  function startGroupPlaySession() {
    const state = window.FIVIAGroupPlay.getSessionState();
    window.FIVIAGroupPlay.startSession(state.classroomId);
    renderGroupPlayUI();
  }

  function submitAnswer(optId) {
    const state = window.FIVIAGroupPlay.getSessionState();
    const activeGroup = state.activeGroup || state.groups[0];
    const activePlayer = state.activePlayer;

    const challenges = getGroupPlayQuestions();
    const cIdx = state.turnIndex % Math.max(1, challenges.length);
    const challenge = challenges[cIdx] || challenges[0];
    if (!challenge) return;

    const fb = document.getElementById('fq-gp-feedback');
    const opts = document.getElementById('fq-gp-options');
    if (!fb || !opts) return;

    const isCorrect = String(optId) === String(challenge.correctAnswer);

    if (isCorrect) {
      if (activeGroup) activeGroup.score = (activeGroup.score || 0) + 100;
      if (activePlayer) activePlayer.xpContributed = (activePlayer.xpContributed || 0) + 100;
      if (window.FIVIAStudent && typeof window.FIVIAStudent.addXP === 'function') {
        window.FIVIAStudent.addXP(100);
      }
    }

    fb.style.display = 'block';
    fb.style.background = isCorrect ? 'rgba(16,185,129,0.18)' : 'rgba(244,63,94,0.18)';
    fb.style.border = `2.5px solid ${isCorrect ? 'var(--fq-emerald)' : 'var(--fq-rose)'}`;
    fb.innerHTML = `
      <div style="font-weight: 900; font-size: 1.4rem; color: ${isCorrect ? 'var(--fq-emerald)' : 'var(--fq-rose)'}; margin-bottom: 8px;">
        ${isCorrect ? `🎉 BENAR! ${activePlayer ? activePlayer.studentName : 'Siswa'} MENDAPATKAN +100 XP!` : '💡 BELUM TEPAT, MARI KITA ANALISIS KEMBALI'}
      </div>
      <p style="color: #fff; margin: 0 0 16px 0; font-size: 1.05rem; line-height: 1.4;">${challenge.explanation}</p>
      <button class="fq-btn fq-btn-cyan fq-btn-lg" style="width: 100%; min-height: 56px; font-size: 1.15rem;" onclick="window.FIVIAGroupPlayEngine.nextTurn()">
        ▶ LANJUTKAN KE GILIRAN SELANJUTNYA &rarr;
      </button>
    `;
    opts.style.display = 'none';
  }

  function nextTurn() {
    window.FIVIAGroupPlay.nextPlayerTurn();
    const state = window.FIVIAGroupPlay.getSessionState();
    state.turnIndex++;
    renderGroupPlayUI();
  }

  function skipTurn() {
    alert('⏭ Giliran dilewati oleh guru.');
    nextTurn();
  }

  function repeatTurn() {
    alert('🔄 Giliran diulangi.');
    renderGroupPlayUI();
  }

  function togglePause() {
    const state = window.FIVIAGroupPlay.getSessionState();
    state.isPaused = !state.isPaused;
    state.status = state.isPaused ? 'PAUSED' : 'RUNNING';
    renderGroupPlayUI();
  }

  function endSession() {
    const state = window.FIVIAGroupPlay.getSessionState();
    if (confirm('⏹ Apakah Anda yakin ingin menyelesaikan sesi Group Play?')) {
      state.status = 'COMPLETED';
      renderGroupPlayUI();
    }
  }

  return {
    renderGroupPlayUI: renderGroupPlayUI,
    selectClass: selectClass,
    autoGroup: autoGroup,
    startGroupPlaySession: startGroupPlaySession,
    submitAnswer: submitAnswer,
    nextTurn: nextTurn,
    skipTurn: skipTurn,
    repeatTurn: repeatTurn,
    togglePause: togglePause,
    endSession: endSession
  };
})();
