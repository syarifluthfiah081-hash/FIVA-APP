/**
 * FIVIA GROUP LEVEL ENGINE MODULE
 * Phase 10.1: Visual Level Map, Teacher Access Master Toggle, & Interactive Minigames Matching Solo Play
 */

window.FIVIAGroupLevelEngine = (function() {
  'use strict';

  function renderLevelMapUI(targetContainerId) {
    const container = document.getElementById(targetContainerId || 'fq-group-levels-container') || document.getElementById('fq-group-play-container');
    if (!container) return;

    const allLevels = window.FIVIAGroupLevels.getAllLevels();
    const state = window.FIVIAGroupLevels.getLevelState();
    const sessionState = window.FIVIAGroupPlay ? window.FIVIAGroupPlay.getSessionState() : {};
    const activeGroup = sessionState.activeGroup || (sessionState.groups ? sessionState.groups[0] : null) || { groupName: 'GROUP NEWTON', score: 850 };
    const isBypass = !!state.teacherBypassMode;

    container.innerHTML = `
      <div style="background: rgba(15, 23, 42, 0.98); border: 3.5px solid var(--fq-cyan); border-radius: 32px; padding: 36px; text-align: left; box-shadow: 0 0 50px var(--fq-cyan-glow);">
        <!-- Subtitle & Group Header -->
        <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 2.5px solid var(--fq-border-cyan); padding-bottom: 18px; margin-bottom: 28px; flex-wrap: wrap; gap: 14px;">
          <div>
            <span class="fq-badge-pill" style="font-size: 0.9rem; padding: 6px 16px;"><i class="fas fa-map-marked-alt"></i> PETA PERMAINAN KELOMPOK &bull; INTERACTIVE SMARTBOARD MODE</span>
            <h1 style="font-size: 2.4rem; font-weight: 900; color: #fff; margin: 6px 0 2px 0;">🎮 PETA PERMAINAN KELOMPOK</h1>
            <div style="color: var(--fq-cyan); font-weight: 800; font-size: 1.05rem;">Permainan interaktif kelompok bergiliran &bull; Besaran &bull; Satuan &bull; Dimensi &bull; Analyst &bull; Boss</div>
          </div>

          <div style="display: flex; align-items: center; gap: 14px; flex-wrap: wrap;">
            <button class="fq-btn ${isBypass ? 'fq-btn-emerald' : 'fq-btn-amber'}" style="min-height: 52px; font-weight: 800;" onclick="window.FIVIAGroupLevelEngine.toggleTeacherBypass()">
              <i class="fas ${isBypass ? 'fa-lock-open' : 'fa-key'}"></i> ${isBypass ? '🔓 AKSES GURU: SEMUA LEVEL TERBUKA' : '🔒 MODE KELAS (DENGAN SYARAT)'}
            </button>
            <div style="background: rgba(30,41,59,0.9); border: 2px solid var(--fq-amber); border-radius: 20px; padding: 10px 20px; text-align: center;">
              <div style="font-size: 0.75rem; color: var(--fq-text-muted); font-weight: 800;">KELOMPOK AKTIF</div>
              <div style="font-size: 1.25rem; font-weight: 900; color: #fff;">👥 ${activeGroup.groupName}</div>
            </div>
          </div>
        </div>

        <!-- VISUAL GAME MAP PATH (CONNECTED NODES) -->
        <div style="background: linear-gradient(135deg, rgba(30,41,59,0.9), rgba(15,23,42,0.9)); border: 2.5px solid var(--fq-border-cyan); border-radius: 28px; padding: 32px; margin-bottom: 32px; text-align: center; position: relative;">
          <h3 style="color: var(--fq-cyan); font-size: 1.3rem; font-weight: 900; margin: 0 0 24px 0;"><i class="fas fa-route"></i> PETA JALUR PERMAINAN KELOMPOK (LEVEL 01 &rarr; LEVEL 05):</h3>

          <div style="display: flex; justify-content: space-between; align-items: center; gap: 14px; overflow-x: auto; padding: 10px 0;">
            ${Object.keys(allLevels).map((key, idx) => {
              const lvl = allLevels[key];
              const isUnlocked = window.FIVIAGroupLevels.isLevelUnlocked(lvl.id);
              const progress = state.levelProgress[lvl.id] || { completed: false, accuracy: 0 };

              return `
                <div style="flex: 1; min-width: 150px; background: rgba(15,23,42,0.9); border: 3px solid ${isUnlocked ? lvl.color : 'rgba(255,255,255,0.2)'}; border-radius: 22px; padding: 20px 14px; position: relative; box-shadow: ${isUnlocked ? '0 0 25px ' + lvl.color : 'none'}; cursor: ${isUnlocked ? 'pointer' : 'not-allowed'};" onclick="${isUnlocked ? "window.FIVIAGroupLevelEngine.startLevel('" + lvl.id + "')" : ""}">
                  <div style="font-size: 2.5rem; margin-bottom: 6px;">${isUnlocked ? lvl.badge : '🔒'}</div>
                  <div style="font-size: 0.85rem; font-weight: 900; color: ${lvl.color};">${lvl.code}</div>
                  <div style="font-size: 1rem; font-weight: 900; color: #fff; margin: 4px 0;">${lvl.title}</div>
                  <div style="font-size: 0.78rem; font-weight: 800; color: ${progress.completed ? 'var(--fq-emerald)' : (isUnlocked ? 'var(--fq-cyan)' : 'var(--fq-rose)')}; margin-top: 8px;">
                    ${progress.completed ? '⭐ SLESAI (' + progress.accuracy + '%)' : (isUnlocked ? '🟢 TERBUKA' : '🔒 TERKUNCI')}
                  </div>
                </div>
                ${idx < 4 ? '<div style="font-size: 1.8rem; color: var(--fq-cyan); font-weight: 900;">&rarr;</div>' : ''}
              `;
            }).join('')}
          </div>
        </div>

        <!-- LEVEL CARDS GRID (MINIGAME MODES MATCHING SOLO PLAY) -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 24px;">
          ${Object.keys(allLevels).map(key => {
            const lvl = allLevels[key];
            const isUnlocked = window.FIVIAGroupLevels.isLevelUnlocked(lvl.id);
            const progress = state.levelProgress[lvl.id] || { completed: false, accuracy: 0 };

            return `
              <div style="background: rgba(30,41,59,0.85); border: 3px solid ${isUnlocked ? lvl.color : 'rgba(255,255,255,0.15)'}; border-radius: 24px; padding: 24px; display: flex; flex-direction: column; justify-content: space-between;">
                <div>
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                    <span class="fq-badge-pill" style="border-color: ${lvl.color}; color: ${lvl.color}; font-weight: 900;">${lvl.badge} ${lvl.code}</span>
                    <span class="fq-badge-pill" style="margin: 0; color: ${isUnlocked ? 'var(--fq-emerald)' : 'var(--fq-rose)'}; border-color: ${isUnlocked ? 'var(--fq-emerald)' : 'var(--fq-rose)'}; font-weight: 900;">
                      ${isUnlocked ? '✅ TERBUKA' : '🔒 TERKUNCI'}
                    </span>
                  </div>

                  <h3 style="font-size: 1.6rem; font-weight: 900; color: #fff; margin: 4px 0 8px 0;">${lvl.title}</h3>
                  <p style="font-size: 0.9rem; color: var(--fq-text-muted); line-height: 1.4; margin-bottom: 16px;">${lvl.focus}</p>
                </div>

                <div>
                  ${!isUnlocked ? `
                    <div style="background: rgba(15,23,42,0.6); border: 1px dashed var(--fq-rose); border-radius: 12px; padding: 10px; font-size: 0.8rem; color: var(--fq-rose); font-weight: 700; margin-bottom: 14px;">
                      🔒 Syarat: Menyelesaikan ${lvl.prerequisite || 'Level Sebelumnya'} (Akurasi minimal ${lvl.minAccuracyToUnlockNext || 70}%)
                    </div>
                  ` : `
                    <div style="background: rgba(15,23,42,0.6); border: 1px solid var(--fq-emerald); border-radius: 12px; padding: 10px; font-size: 0.82rem; color: var(--fq-emerald); font-weight: 700; margin-bottom: 14px;">
                      🎯 Akurasi Tertinggi: ${progress.accuracy}% (Target: ${lvl.minAccuracyToUnlockNext || 70}%)
                    </div>
                  `}

                  <button class="fq-btn ${isUnlocked ? 'fq-btn-cyan' : 'fq-btn-outline'}" style="width: 100%; min-height: 56px; font-size: 1.1rem; font-weight: 800;" ${!isUnlocked ? 'disabled' : ''} onclick="window.FIVIAGroupLevelEngine.startLevel('${lvl.id}')">
                    ${isUnlocked ? '🚀 MAINKAN GAME KELOMPOK' : '🔒 TERKUNCI'}
                  </button>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  }

  function toggleTeacherBypass() {
    const isBypass = window.FIVIAGroupLevels.toggleTeacherBypassMode();
    alert(isBypass ? '🔓 MODE GURU AKTIF: Seluruh level berhasil dibuka untuk uji coba!' : '🔒 MODE KELAS AKTIF: Pembukaan level kembali berdasarkan syarat akurasi.');
    renderLevelMapUI();
  }

  function startLevel(levelId) {
    window.FIVIAGroupLevels.startLevelSession(levelId);
    renderActiveLevelBoardUI();
  }

  function renderActiveLevelBoardUI() {
    const container = document.getElementById('fq-group-levels-container') || document.getElementById('fq-group-play-container');
    if (!container) return;

    const state = window.FIVIAGroupLevels.getLevelState();
    const meta = window.FIVIAGroupLevels.getLevelMetadata(state.activeLevelId);
    const sessionState = window.FIVIAGroupPlay ? window.FIVIAGroupPlay.getSessionState() : {};
    const activeGroup = sessionState.activeGroup || (sessionState.groups ? sessionState.groups[0] : null) || { groupName: 'GROUP NEWTON', score: 850 };
    const activePlayer = sessionState.activePlayer || (activeGroup.members ? activeGroup.members[0] : null) || { studentName: 'Ahmad Fauzan', studentCode: 'STD-001' };

    const questions = window.FIVIAGroupLevelQuestions.getQuestionsForLevel(state.activeLevelId, 10);
    const qIdx = state.currentQuestionIndex % Math.max(1, questions.length);
    const q = questions[qIdx];

    const livesHtml = Array.from({ length: state.maxLives }).map((_, i) => i < state.teamLives ? '❤️' : '🖤').join(' ');

    // Calculate Boss HP for Level 05
    const bossHP = state.activeLevelId === 'LEVEL_05' ? Math.max(0, 100 - (state.correctAnswersCount * 20)) : 100;

    container.innerHTML = `
      <div style="background: rgba(15, 23, 42, 0.98); border: 3.5px solid ${meta.color}; border-radius: 32px; padding: 32px; text-align: left; box-shadow: 0 0 60px rgba(6,182,212,0.3);">
        <!-- Smartboard Level Top Header Bar -->
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 3px solid var(--fq-border-cyan); padding-bottom: 18px; margin-bottom: 24px; flex-wrap: wrap; gap: 14px;">
          <div>
            <span class="fq-badge-pill" style="border-color: ${meta.color}; color: ${meta.color}; font-size: 1rem; padding: 6px 18px;">
              ${meta.badge} ${meta.code} &bull; ${meta.title}
            </span>
            <h2 style="font-size: 2.2rem; font-weight: 900; color: #fff; margin: 6px 0 0 0;">👥 KELOMPOK: <strong style="color: var(--fq-amber);">${activeGroup.groupName}</strong></h2>
          </div>

          <div style="display: flex; align-items: center; gap: 16px;">
            <div style="background: rgba(30,41,59,0.9); border: 2px solid var(--fq-rose); border-radius: 20px; padding: 10px 20px; text-align: center;">
              <div style="font-size: 0.75rem; color: var(--fq-text-muted); font-weight: 800;">TEAM LIVES</div>
              <div style="font-size: 1.5rem;">${livesHtml}</div>
            </div>

            ${state.comboStreak > 1 ? `
              <div style="background: rgba(30,41,59,0.9); border: 2px solid var(--fq-amber); border-radius: 20px; padding: 10px 20px; text-align: center;">
                <div style="font-size: 0.75rem; color: var(--fq-amber); font-weight: 800;">COMBO STREAK</div>
                <div style="font-size: 1.4rem; font-weight: 900; color: var(--fq-amber);">🔥 COMBO x${state.comboStreak}</div>
              </div>
            ` : ''}

            <button class="fq-btn fq-btn-outline" style="min-height: 56px; font-weight: 800;" onclick="window.FIVIAGroupLevelEngine.renderLevelMapUI()"><i class="fas fa-map"></i> PETA KELOMPOK</button>
          </div>
        </div>

        <!-- LEVEL 05 PHYSICS BOSS HP BAR OVERLAY -->
        ${state.activeLevelId === 'LEVEL_05' ? `
          <div style="background: rgba(225,29,72,0.2); border: 2.5px solid var(--fq-rose); border-radius: 20px; padding: 18px; text-align: center; margin-bottom: 24px; box-shadow: 0 0 30px rgba(225,29,72,0.4);">
            <div style="display: flex; justify-content: space-between; font-weight: 900; color: var(--fq-rose); font-size: 1.1rem; margin-bottom: 6px;">
              <span>👾 MECHA PHYSICS BOSS</span>
              <span>${bossHP} / 100 HP</span>
            </div>
            <div style="width: 100%; background: rgba(15,23,42,0.8); height: 20px; border-radius: 10px; overflow: hidden; border: 1px solid var(--fq-rose);">
              <div style="width: ${bossHP}%; background: linear-gradient(90deg, #f43f5e, #fb7185); height: 100%; transition: width 0.5s ease;"></div>
            </div>
          </div>
        ` : ''}

        <!-- PLAYER TURN BANNER (SANGAT BESAR & HIGH CONTRAST) -->
        <div style="background: linear-gradient(135deg, rgba(139,92,246,0.25), rgba(6,182,212,0.25)); border: 3px solid var(--fq-cyan); border-radius: 24px; padding: 22px; text-align: center; margin-bottom: 28px;">
          <div style="font-size: 1.1rem; font-weight: 900; color: var(--fq-amber); letter-spacing: 2px; text-transform: uppercase; margin-bottom: 4px;">
            🎯 GILIRANMU! MAJU KE PAPAN INTERAKTIF
          </div>
          <h1 style="font-size: 3rem; font-weight: 900; color: #fff; margin: 2px 0;">
            👨‍🎓 ${activePlayer.studentName}
          </h1>
          <div style="font-size: 1rem; color: var(--fq-cyan); font-weight: 800;">
            👥 ${activeGroup.groupName} &bull; TANTANGAN ${qIdx + 1} / ${questions.length} &bull; KODE: ${activePlayer.studentCode || ''}
          </div>
        </div>

        <!-- Minigame Interactive Challenge Card Display -->
        <div style="background: rgba(30,41,59,0.85); border: 2.5px solid var(--fq-border-cyan); border-radius: 24px; padding: 28px; margin-bottom: 28px;">
          <div style="font-size: 1.6rem; font-weight: 800; color: #fff; line-height: 1.4; margin-bottom: 20px;">
            ${q.question}
          </div>

          <div id="fq-gl-feedback" style="display: none; margin-bottom: 24px; padding: 22px; border-radius: 20px; font-size: 1.1rem;"></div>

          <!-- Interactive Minigame Buttons (Touch Target >= 72px) -->
          <div id="fq-gl-options" style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
            ${(q.options || []).map(opt => `
              <button class="fq-btn fq-btn-outline fq-btn-lg" style="min-height: 76px; padding: 20px; font-size: 1.25rem; font-weight: 800; text-align: left; border-width: 2.5px;" onclick="window.FIVIAGroupLevelEngine.submitAnswer('${opt.id}')">
                <strong style="color: var(--fq-amber); font-size: 1.4rem;">${opt.id}.</strong> ${opt.label || opt.text || opt.id}
              </button>
            `).join('')}
          </div>
        </div>

        <!-- Teacher Controller Floating Overlay Bar -->
        <div style="background: rgba(15,23,42,0.9); border: 2px solid var(--fq-border-cyan); border-radius: 20px; padding: 18px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px;">
          <div style="font-weight: 800; color: #fff; font-size: 1rem;">
            🎮 CONTROLLER GURU: <span style="color: var(--fq-cyan);">${activePlayer.studentName} (${activeGroup.groupName})</span>
          </div>
          <div style="display: flex; gap: 10px; flex-wrap: wrap;">
            <button class="fq-btn fq-btn-emerald" style="min-height: 48px;" onclick="window.FIVIAGroupLevels.addTeamLife(); window.FIVIAGroupLevelEngine.renderActiveLevelBoardUI();"><i class="fas fa-heart"></i> ❤️ +1 LIFE</button>
            <button class="fq-btn fq-btn-amber" style="min-height: 48px;" onclick="window.FIVIAGroupLevelEngine.skipTurn()"><i class="fas fa-step-forward"></i> ⏭ LEWATI GILIRAN</button>
            <button class="fq-btn fq-btn-outline" style="min-height: 48px;" onclick="window.FIVIAGroupLevelEngine.renderActiveLevelBoardUI()"><i class="fas fa-redo"></i> 🔄 ULANGI GILIRAN</button>
            <button class="fq-btn fq-btn-danger" style="min-height: 48px;" onclick="window.FIVIAGroupLevelEngine.renderLevelMapUI()"><i class="fas fa-stop-circle"></i> 🏁 KELUAR LEVEL</button>
          </div>
        </div>
      </div>
    `;
  }

  function submitAnswer(optId) {
    const state = window.FIVIAGroupLevels.getLevelState();
    const questions = window.FIVIAGroupLevelQuestions.getQuestionsForLevel(state.activeLevelId, 10);
    const qIdx = state.currentQuestionIndex % Math.max(1, questions.length);
    const q = questions[qIdx];
    if (!q) return;

    const fb = document.getElementById('fq-gl-feedback');
    const opts = document.getElementById('fq-gl-options');
    if (!fb || !opts) return;

    const isCorrect = String(optId) === String(q.correctAnswer);
    const result = window.FIVIAGroupLevels.registerAnswerResult(isCorrect);

    if (isCorrect) {
      if (window.FIVIAStudent && typeof window.FIVIAStudent.addXP === 'function') {
        window.FIVIAStudent.addXP(25);
      }
    }

    fb.style.display = 'block';
    fb.style.background = isCorrect ? 'rgba(16,185,129,0.18)' : 'rgba(244,63,94,0.18)';
    fb.style.border = `2.5px solid ${isCorrect ? 'var(--fq-emerald)' : 'var(--fq-rose)'}`;
    fb.innerHTML = `
      <div style="font-weight: 900; font-size: 1.4rem; color: ${isCorrect ? 'var(--fq-emerald)' : 'var(--fq-rose)'}; margin-bottom: 8px;">
        ${isCorrect ? `🎉 BENAR! +25 INDIVIDUAL XP &amp; +100 GROUP XP! ${result.comboStreak > 1 ? '(🔥 COMBO x' + result.comboStreak + '!)' : ''}` : `❌ BELUM TEPAT, MARI KITA ANALISIS KEMBALI (-1 TEAM LIFE)`}
      </div>
      <p style="color: #fff; margin: 0 0 16px 0; font-size: 1.05rem; line-height: 1.4;">${q.explanation}</p>
      <button class="fq-btn fq-btn-cyan fq-btn-lg" style="width: 100%; min-height: 56px; font-size: 1.15rem;" onclick="window.FIVIAGroupLevelEngine.nextTurn()">
        ▶ LANJUTKAN KE PEMAIN SELANJUTNYA &rarr;
      </button>
    `;
    opts.style.display = 'none';
  }

  function nextTurn() {
    const state = window.FIVIAGroupLevels.getLevelState();
    state.currentQuestionIndex++;

    if (window.FIVIAGroupPlay && typeof window.FIVIAGroupPlay.nextPlayerTurn === 'function') {
      window.FIVIAGroupPlay.nextPlayerTurn();
    }

    renderActiveLevelBoardUI();
  }

  function skipTurn() {
    alert('⏭ Giliran dilewati oleh guru.');
    nextTurn();
  }

  return {
    renderLevelMapUI: renderLevelMapUI,
    toggleTeacherBypass: toggleTeacherBypass,
    startLevel: startLevel,
    renderActiveLevelBoardUI: renderActiveLevelBoardUI,
    submitAnswer: submitAnswer,
    nextTurn: nextTurn,
    skipTurn: skipTurn
  };
})();
