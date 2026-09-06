/**
 * FIVIA GROUP LEVEL ENGINE MODULE
 * Phase 10.1: Unified Group Setup, Level Map & Interactive Minigames with 100% Unconditional Unlock
 */

window.FIVIAGroupLevelEngine = (function() {
  'use strict';

  let selectedModuleId = 'ALL';

  function setSelectedModule(modId) {
    selectedModuleId = modId;
  }

  function renderToContainers(html) {
    const c1 = document.getElementById('fq-group-levels-container');
    const c2 = document.getElementById('fq-group-play-container');
    if (c1) c1.innerHTML = html;
    if (c2) c2.innerHTML = html;
    window.scrollTo(0, 0);
  }

  function renderLevelMapUI() {
    // Ensure session and roster are initialized
    if (window.FIVIAGroupPlay) {
      const gpState = window.FIVIAGroupPlay.getSessionState();
      if (!gpState.groups || gpState.groups.length === 0) {
        window.FIVIAGroupPlay.autoGroupStudents(gpState.classroomId || 'cls_xf1', 4);
      }
    }

    const allLevels = window.FIVIAGroupLevels.getAllLevels();
    const state = window.FIVIAGroupLevels.getLevelState();
    const sessionState = window.FIVIAGroupPlay ? window.FIVIAGroupPlay.getSessionState() : {};
    const classes = window.FIVIAGroupPlay ? window.FIVIAGroupPlay.getClassrooms() : [];
    const activeCls = classes.find(c => c.id === sessionState.classroomId) || classes[0] || { id: 'cls_xf1', name: 'XI FASE F' };
    const groups = sessionState.groups || [];

    // Collect base & custom materials for module selector
    const baseMats = window.db ? window.db.getMaterials() : [];
    let customMats = [];
    try {
      customMats = JSON.parse(localStorage.getItem("fivia_custom_materials") || "[]");
    } catch(e) {}

    const html = `
      <div style="background: rgba(15, 23, 42, 0.98); border: 3.5px solid var(--fq-cyan); border-radius: 32px; padding: 36px; text-align: left; box-shadow: 0 0 50px var(--fq-cyan-glow);">
        <!-- Top Title Header -->
        <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 2.5px solid var(--fq-border-cyan); padding-bottom: 18px; margin-bottom: 28px; flex-wrap: wrap; gap: 14px;">
          <div>
            <span class="fq-badge-pill" style="font-size: 0.9rem; padding: 6px 16px;"><i class="fas fa-users-cog"></i> FIVIA GROUP PLAY &bull; PETA PERMAINAN KELOMPOK</span>
            <h1 style="font-size: 2.4rem; font-weight: 900; color: #fff; margin: 6px 0 2px 0;">🎮 PETA LEVEL PERMAINAN KELOMPOK</h1>
            <div style="color: var(--fq-cyan); font-weight: 800; font-size: 1.05rem;">Atur kelompok, pilih modul materi, dan mainkan tantangan fisika interaktif secara bergiliran!</div>
          </div>

          <div style="display: flex; gap: 10px; flex-wrap: wrap;">
            <button class="fq-btn fq-btn-emerald" style="min-height: 50px;" onclick="window.FIVIAClassroomEngine.triggerExcelImport()"><i class="fas fa-file-import"></i> 📥 IMPORT EXCEL</button>
            <button class="fq-btn fq-btn-amber" style="min-height: 50px;" onclick="window.FIVIAGroupLevelEngine.autoGroup()"><i class="fas fa-random"></i> 🔀 BAGI KELOMPOK</button>
            <button class="fq-btn fq-btn-cyan" style="min-height: 50px;" onclick="window.FIVIAGroupLevelEngine.startLevel('LEVEL_01')"><i class="fas fa-play"></i> ▶ MULAI LEVEL 01</button>
          </div>
        </div>

        <!-- MODULE SELECTOR BAR (GIM BERDASARKAN MODUL MATERI) -->
        <div style="background: rgba(30,41,59,0.85); border: 2.5px solid var(--fq-cyan); border-radius: 24px; padding: 22px; margin-bottom: 28px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px; box-shadow: 0 0 25px rgba(6,182,212,0.2);">
          <div>
            <span class="fq-badge-pill" style="border-color: var(--fq-amber); color: var(--fq-amber); font-weight: 900;"><i class="fas fa-book-open"></i> PILIH MODUL PERMAINAN</span>
            <h3 style="color: #fff; font-size: 1.3rem; font-weight: 900; margin: 6px 0 2px 0;">📚 MATERI &amp; BANK SOAL MODUL GIM:</h3>
            <div style="color: var(--fq-cyan); font-size: 0.88rem; font-weight: 700;">Gim akan memainkan tantangan fisika yang dibuat secara khusus berdasarkan modul berikut.</div>
          </div>
          <div>
            <select class="fq-select" style="min-width: 320px; min-height: 52px; font-weight: 800; font-size: 1.05rem; background: #0f172a; color: #fff; border: 2px solid var(--fq-cyan); border-radius: 14px; padding: 0 16px;" onchange="window.FIVIAGroupLevelEngine.setSelectedModule(this.value)">
              <option value="ALL" ${selectedModuleId === 'ALL' ? 'selected' : ''}>🌟 SEMUA MODUL MATERI (ACAK GABUNGAN)</option>
              <optgroup label="📖 Modul Kurikulum Utama (SMA Phase E/F)">
                ${baseMats.map(m => `<option value="${m.id}" ${String(selectedModuleId) === String(m.id) ? 'selected' : ''}>${m.name} (${m.topic || 'Fisika'})</option>`).join('')}
              </optgroup>
              ${customMats.length > 0 ? `
                <optgroup label="🤖 Modul Hasil Generate AI Guru">
                  ${customMats.map(cm => `<option value="${cm.id}" ${String(selectedModuleId) === String(cm.id) ? 'selected' : ''}>✨ ${cm.name || cm.title} (Custom Guru)</option>`).join('')}
                </optgroup>
              ` : ''}
            </select>
          </div>
        </div>

        <!-- 1. PENGATURAN KELOMPOK & DATABASE SISWA (ALWAYS VISIBLE & CONFIGURED) -->
        <div style="background: rgba(30,41,59,0.85); border: 2px solid var(--fq-border-cyan); border-radius: 24px; padding: 24px; margin-bottom: 32px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; flex-wrap: wrap; gap: 10px;">
            <h3 style="color: var(--fq-cyan); font-size: 1.2rem; font-weight: 900; margin: 0;"><i class="fas fa-chalkboard"></i> PENGATURAN KELAS &amp; KELOMPOK (${groups.length} Kelompok Terdaftar):</h3>
            <div style="display: flex; gap: 10px; flex-wrap: wrap;">
              ${classes.map(cls => `
                <button class="fq-btn ${cls.id === activeCls.id ? 'fq-btn-cyan' : 'fq-btn-outline'}" style="padding: 6px 16px; font-weight: 800; font-size: 0.9rem;" onclick="window.FIVIAGroupLevelEngine.selectClass('${cls.id}')">
                  📘 ${cls.name}
                </button>
              `).join('')}
            </div>
          </div>

          <!-- Group Member Cards Preview -->
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(230px, 1fr)); gap: 16px;">
            ${groups.map((grp, gIdx) => `
              <div style="background: rgba(15,23,42,0.7); border: 1.5px solid var(--fq-border-cyan); border-radius: 16px; padding: 14px;">
                <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--fq-border-cyan); padding-bottom: 8px; margin-bottom: 10px;">
                  <strong style="color: var(--fq-amber); font-size: 1.05rem;">👥 ${grp.groupName}</strong>
                  <span class="fq-badge-pill" style="margin: 0; font-size: 0.75rem;">${grp.members.length} Siswa</span>
                </div>
                <div style="font-size: 0.85rem; color: #fff; display: flex; flex-direction: column; gap: 4px; max-height: 120px; overflow-y: auto;">
                  ${grp.members.map((m, mIdx) => `
                    <div style="display: flex; align-items: center; gap: 6px;">
                      <span style="color: var(--fq-cyan); font-weight: 800;">${mIdx + 1}.</span> ${m.studentName}
                    </div>
                  `).join('')}
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- 2. VISUAL GAME MAP PATH (CONNECTED NODES) -->
        <div style="background: linear-gradient(135deg, rgba(30,41,59,0.9), rgba(15,23,42,0.9)); border: 2.5px solid var(--fq-border-cyan); border-radius: 28px; padding: 28px; margin-bottom: 32px; text-align: center; position: relative;">
          <h3 style="color: var(--fq-cyan); font-size: 1.3rem; font-weight: 900; margin: 0 0 20px 0;"><i class="fas fa-route"></i> PETA JALUR PERMAINAN KELOMPOK (KLIK UNTUK MAINKAN):</h3>

          <div style="display: flex; justify-content: space-between; align-items: center; gap: 14px; overflow-x: auto; padding: 10px 0;">
            ${Object.keys(allLevels).map((key, idx) => {
              const lvl = allLevels[key];

              return `
                <div style="flex: 1; min-width: 150px; background: rgba(15,23,42,0.9); border: 3px solid ${lvl.color}; border-radius: 22px; padding: 20px 14px; position: relative; box-shadow: 0 0 20px ${lvl.color}; cursor: pointer; transition: transform 0.2s ease;" onclick="window.FIVIAGroupLevelEngine.startLevel('${lvl.id}')" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
                  <div style="font-size: 2.5rem; margin-bottom: 6px;">${lvl.badge}</div>
                  <div style="font-size: 0.85rem; font-weight: 900; color: ${lvl.color};">${lvl.code}</div>
                  <div style="font-size: 1.05rem; font-weight: 900; color: #fff; margin: 4px 0;">${lvl.title}</div>
                  <div style="font-size: 0.78rem; font-weight: 800; color: var(--fq-emerald); margin-top: 8px;">
                    🟢 TERBUKA (MAINKAN)
                  </div>
                </div>
                ${idx < 4 ? '<div style="font-size: 1.8rem; color: var(--fq-cyan); font-weight: 900;">&rarr;</div>' : ''}
              `;
            }).join('')}
          </div>
        </div>

        <!-- 3. LEVEL CARDS GRID (MINIGAME MODES) -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 24px;">
          ${Object.keys(allLevels).map(key => {
            const lvl = allLevels[key];

            return `
              <div style="background: rgba(30,41,59,0.85); border: 3px solid ${lvl.color}; border-radius: 24px; padding: 24px; display: flex; flex-direction: column; justify-content: space-between; box-shadow: 0 0 25px rgba(0,0,0,0.3);">
                <div>
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                    <span class="fq-badge-pill" style="border-color: ${lvl.color}; color: ${lvl.color}; font-weight: 900;">${lvl.badge} ${lvl.code}</span>
                    <span class="fq-badge-pill" style="margin: 0; color: var(--fq-emerald); border-color: var(--fq-emerald); font-weight: 900;">
                      ✅ TERBUKA
                    </span>
                  </div>

                  <h3 style="font-size: 1.6rem; font-weight: 900; color: #fff; margin: 4px 0 8px 0;">${lvl.title}</h3>
                  <p style="font-size: 0.9rem; color: var(--fq-text-muted); line-height: 1.4; margin-bottom: 16px;">${lvl.focus}</p>
                </div>

                <div>
                  <div style="background: rgba(15,23,42,0.6); border: 1px solid var(--fq-emerald); border-radius: 12px; padding: 10px; font-size: 0.82rem; color: var(--fq-emerald); font-weight: 700; margin-bottom: 14px;">
                    🎮 Status: Siap Dimainkan Berkelompok (Round-Robin)
                  </div>

                  <button class="fq-btn fq-btn-cyan" style="width: 100%; min-height: 56px; font-size: 1.15rem; font-weight: 900;" onclick="window.FIVIAGroupLevelEngine.startLevel('${lvl.id}')">
                    🚀 MAINKAN ${lvl.code}
                  </button>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;

    renderToContainers(html);
  }

  function selectClass(classId) {
    if (window.FIVIAGroupPlay) {
      window.FIVIAGroupPlay.autoGroupStudents(classId, 4);
    }
    renderLevelMapUI();
  }

  function autoGroup() {
    if (window.FIVIAGroupPlay) {
      const state = window.FIVIAGroupPlay.getSessionState();
      window.FIVIAGroupPlay.autoGroupStudents(state.classroomId || 'cls_xf1', 4);
    }
    renderLevelMapUI();
    alert('🎉 KELOMPOK BERHASIL DIBAGI OTOMATIS DARI DATABASE SISWA!');
  }

  function startLevel(levelId) {
    // 1. Ensure Group Play session is active with valid groups & active player
    if (window.FIVIAGroupPlay) {
      const gpState = window.FIVIAGroupPlay.getSessionState();
      if (!gpState.groups || gpState.groups.length === 0 || !gpState.activePlayer) {
        window.FIVIAGroupPlay.startSession(gpState.classroomId || 'cls_xf1');
      }
    }

    // 2. Start Level Session
    window.FIVIAGroupLevels.startLevelSession(levelId);

    // 3. Render Active Interactive Board UI
    renderActiveLevelBoardUI();
  }

  function detectType(q) {
    if (q.type) return q.type;
    if (q.pairs && q.pairs.length > 0) return "matching";
    if (q.correctAnswers) {
      if (Array.isArray(q.correctAnswers) && typeof q.correctAnswers[0] === 'number') return "multiple_select";
      return "short_answer";
    }
    if (q.options && q.options.length === 2 && (q.options[0].label === "BENAR" || q.options[0] === "BENAR")) return "true_false";
    return "multiple_choice";
  }

  function renderActiveLevelBoardUI() {
    const state = window.FIVIAGroupLevels.getLevelState();
    const meta = window.FIVIAGroupLevels.getLevelMetadata(state.activeLevelId);
    const sessionState = window.FIVIAGroupPlay ? window.FIVIAGroupPlay.getSessionState() : {};
    const activeGroup = sessionState.activeGroup || (sessionState.groups ? sessionState.groups[0] : null) || { groupName: 'GROUP NEWTON', score: 850 };
    const activePlayer = sessionState.activePlayer || (activeGroup.members ? activeGroup.members[0] : null) || { studentName: 'Ahmad Fauzan', studentCode: 'STD-001' };

    const questions = window.FIVIAGroupLevelQuestions.getQuestionsForLevel(state.activeLevelId, 10, selectedModuleId);
    const qIdx = state.currentQuestionIndex % Math.max(1, questions.length);
    const q = questions[qIdx];

    const livesHtml = Array.from({ length: state.maxLives }).map((_, i) => i < state.teamLives ? '❤️' : '🖤').join(' ');

    // Calculate Boss HP for Level 05
    const bossHP = state.activeLevelId === 'LEVEL_05' ? Math.max(0, 100 - (state.correctAnswersCount * 20)) : 100;

    const qType = detectType(q);
    let typeBadgeLabel = "Pilihan Ganda";
    if (qType === "true_false") typeBadgeLabel = "Benar / Salah";
    else if (qType === "matching") typeBadgeLabel = "Mencocokkan";
    else if (qType === "multiple_select") typeBadgeLabel = "Pilihan Ganda Kompleks";
    else if (qType === "short_answer") typeBadgeLabel = "Isian Singkat";

    let optionsUI = "";
    if (qType === "multiple_choice" || qType === "true_false") {
      const optsList = q.options || (qType === "true_false" ? [{id:'A',label:'BENAR'},{id:'B',label:'SALAH'}] : []);
      optionsUI = `
        <div id="fq-gl-options" style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
          ${optsList.map((opt, i) => `
            <button class="fq-btn fq-btn-outline fq-btn-lg" style="min-height: 76px; padding: 20px; font-size: 1.25rem; font-weight: 800; text-align: left; border-width: 2.5px;" onclick="window.FIVIAGroupLevelEngine.submitAnswer('${opt.id || String.fromCharCode(65 + i)}')">
              <strong style="color: var(--fq-amber); font-size: 1.4rem;">${opt.id || String.fromCharCode(65 + i)}.</strong> ${opt.label || opt.text || opt}
            </button>
          `).join('')}
        </div>
      `;
    } else if (qType === "multiple_select") {
      optionsUI = `
        <div id="fq-gl-options" style="display: flex; flex-direction: column; gap: 14px;">
          <div style="color: var(--fq-amber); font-weight: 800; font-size: 1.05rem;"><i class="fas fa-check-square"></i> Pilih SEMUA opsi jawaban yang BENAR (Lebih dari 1):</div>
          ${(q.options || []).map((opt, i) => `
            <label style="background: rgba(15,23,42,0.8); border: 2px solid var(--fq-border-cyan); border-radius: 16px; padding: 18px 24px; display: flex; align-items: center; gap: 16px; cursor: pointer; font-size: 1.15rem; color: #fff; font-weight: 700;">
              <input type="checkbox" class="fq-ms-check" value="${i}" style="width: 24px; height: 24px; accent-color: var(--fq-cyan);" />
              <span><strong style="color: var(--fq-amber);">${opt.id || String.fromCharCode(65 + i)}.</strong> ${opt.label || opt.text || opt}</span>
            </label>
          `).join('')}
          <button class="fq-btn fq-btn-cyan fq-btn-lg" style="min-height: 64px; font-size: 1.2rem; font-weight: 900; margin-top: 10px;" onclick="window.FIVIAGroupLevelEngine.submitMultipleSelect()">
            🚀 KIRIM JAWABAN KOMPLEKS
          </button>
        </div>
      `;
    } else if (qType === "short_answer") {
      optionsUI = `
        <div id="fq-gl-options" style="background: rgba(15,23,42,0.8); border: 2px solid var(--fq-border-cyan); border-radius: 20px; padding: 24px;">
          <label style="display: block; color: var(--fq-cyan); font-weight: 900; font-size: 1.1rem; margin-bottom: 12px;"><i class="fas fa-keyboard"></i> KETIKKAN JAWABAN ISIAN SINGKAT:</label>
          <input type="text" id="fq-short-input" class="fq-select" style="width: 100%; min-height: 60px; font-size: 1.2rem; padding: 0 20px; background: #0f172a; color: #fff; border: 2px solid var(--fq-cyan); border-radius: 14px; margin-bottom: 18px;" placeholder="Ketikkan teks, simbol, atau angka jawaban..." />
          <button class="fq-btn fq-btn-cyan fq-btn-lg" style="width: 100%; min-height: 64px; font-size: 1.2rem; font-weight: 900;" onclick="window.FIVIAGroupLevelEngine.submitShortAnswer()">
            🚀 KIRIM JAWABAN ISIAN
          </button>
        </div>
      `;
    } else if (qType === "matching") {
      const pairs = q.pairs || [];
      const rightOptions = pairs.map(p => p.right);
      optionsUI = `
        <div id="fq-gl-options" style="display: flex; flex-direction: column; gap: 16px;">
          <div style="color: var(--fq-amber); font-weight: 800; font-size: 1.05rem;"><i class="fas fa-project-diagram"></i> Pasangkan elemen di sebelah kiri dengan jawaban di sebelah kanan:</div>
          ${pairs.map((p, i) => `
            <div style="display: grid; grid-template-columns: 1fr 1.2fr; gap: 16px; align-items: center; background: rgba(15,23,42,0.8); border: 2px solid var(--fq-border-cyan); border-radius: 16px; padding: 18px;">
              <div style="font-weight: 800; color: #fff; font-size: 1.05rem;">${i + 1}. ${p.left}</div>
              <div>
                <select class="fq-matching-select fq-select" data-pair-idx="${i}" style="width: 100%; min-height: 48px; font-size: 1rem; background: #0f172a; color: #fff; border: 1.5px solid var(--fq-cyan); border-radius: 10px; padding: 0 12px; font-weight: 700;">
                  <option value="">-- Pilih Pasangan --</option>
                  ${rightOptions.map(rOpt => `<option value="${rOpt.replace(/"/g, '&quot;')}">${rOpt}</option>`).join('')}
                </select>
              </div>
            </div>
          `).join('')}
          <button class="fq-btn fq-btn-cyan fq-btn-lg" style="min-height: 64px; font-size: 1.2rem; font-weight: 900; margin-top: 10px;" onclick="window.FIVIAGroupLevelEngine.submitMatching()">
            🚀 KIRIM JAWABAN PENCOCOKAN
          </button>
        </div>
      `;
    }

    const html = `
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
            👥 ${activeGroup.groupName} &bull; TANTANGAN ${qIdx + 1} / ${questions.length} &bull; TYPE: <span style="color:var(--fq-amber);">${typeBadgeLabel}</span>
          </div>
        </div>

        <!-- Minigame Interactive Challenge Card Display -->
        <div style="background: rgba(30,41,59,0.85); border: 2.5px solid var(--fq-border-cyan); border-radius: 24px; padding: 28px; margin-bottom: 28px;">
          <div style="font-size: 1.6rem; font-weight: 800; color: #fff; line-height: 1.4; margin-bottom: 20px; whitespace: pre-line;">
            ${q.question}
          </div>

          <div id="fq-gl-feedback" style="display: none; margin-bottom: 24px; padding: 22px; border-radius: 20px; font-size: 1.1rem;"></div>

          ${optionsUI}
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

    renderToContainers(html);
  }

  function submitMultipleSelect() {
    const checks = document.querySelectorAll('.fq-ms-check:checked');
    const selectedVals = Array.from(checks).map(c => parseInt(c.value));
    submitAnswer(selectedVals);
  }

  function submitShortAnswer() {
    const input = document.getElementById('fq-short-input');
    const val = input ? input.value : '';
    submitAnswer(val);
  }

  function submitMatching() {
    const selects = document.querySelectorAll('.fq-matching-select');
    const matchesObj = {};
    selects.forEach(s => {
      const idx = s.getAttribute('data-pair-idx');
      matchesObj[idx] = s.value;
    });
    submitAnswer(matchesObj);
  }

  function submitAnswer(userAns) {
    const state = window.FIVIAGroupLevels.getLevelState();
    const questions = window.FIVIAGroupLevelQuestions.getQuestionsForLevel(state.activeLevelId, 10, selectedModuleId);
    const qIdx = state.currentQuestionIndex % Math.max(1, questions.length);
    const q = questions[qIdx];
    if (!q) return;

    const fb = document.getElementById('fq-gl-feedback');
    const opts = document.getElementById('fq-gl-options');
    if (!fb || !opts) return;

    let isCorrect = false;
    if (window.evaluateQuestionAnswer && typeof window.evaluateQuestionAnswer === 'function') {
      isCorrect = window.evaluateQuestionAnswer(q, userAns);
    } else {
      if (typeof userAns === 'string' && q.correctAnswer) {
        isCorrect = String(userAns).trim().toLowerCase() === String(q.correctAnswer).trim().toLowerCase();
      } else {
        isCorrect = userAns === q.correct;
      }
    }

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
    setSelectedModule: setSelectedModule,
    renderLevelMapUI: renderLevelMapUI,
    selectClass: selectClass,
    autoGroup: autoGroup,
    startLevel: startLevel,
    renderActiveLevelBoardUI: renderActiveLevelBoardUI,
    submitAnswer: submitAnswer,
    submitMultipleSelect: submitMultipleSelect,
    submitShortAnswer: submitShortAnswer,
    submitMatching: submitMatching,
    nextTurn: nextTurn,
    skipTurn: skipTurn
  };
})();

