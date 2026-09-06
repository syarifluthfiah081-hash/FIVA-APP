/**
 * FIVIA GROUP LEVEL ENGINE MODULE
 * Phase 10.1: Unified Group Setup, Level Map & Interactive Minigames with 100% Unconditional Unlock
 */

window.FIVIAGroupLevelEngine = (function() {
  'use strict';

  let selectedModuleId = 'ALL';

  function setSelectedModule(modId) {
    selectedModuleId = modId;
    if (window.FIVIAGroupLevelQuestions && typeof window.FIVIAGroupLevelQuestions.resetQuestionCache === 'function') {
      window.FIVIAGroupLevelQuestions.resetQuestionCache();
    }
  }

  function getFallbackLevels() {
    return {
      LEVEL_01: { id: 'LEVEL_01', code: 'LEVEL 01', title: 'BESARAN HUNTER', color: '#10b981', badge: '🟢', focus: 'Pengertian besaran, besaran pokok, besaran turunan.' },
      LEVEL_02: { id: 'LEVEL_02', code: 'LEVEL 02', title: 'UNIT MASTER', color: '#06b6d4', badge: '🔵', focus: 'Satuan SI, satuan besaran pokok dan turunan.' },
      LEVEL_03: { id: 'LEVEL_03', code: 'LEVEL 03', title: 'DIMENSION DETECTIVE', color: '#8b5cf6', badge: '🟣', focus: 'Simbol dimensi, dimensi besaran pokok dan turunan.' },
      LEVEL_04: { id: 'LEVEL_04', code: 'LEVEL 04', title: 'PHYSICS ANALYST', color: '#f59e0b', badge: '🟠', focus: 'Analisis konsistensi dimensi persamaan fisika.' },
      LEVEL_05: { id: 'LEVEL_05', code: 'LEVEL 05', title: 'PHYSICS BOSS', color: '#f43f5e', badge: '🔴', focus: 'HOTS Multi-step Tantangan Kelompok.' }
    };
  }

  function renderToContainers(html) {
    const c1 = document.getElementById('fq-group-levels-container');
    const c2 = document.getElementById('fq-group-play-container');
    if (c1) c1.innerHTML = html;
    if (c2) c2.innerHTML = html;
    window.scrollTo(0, 0);
  }

  function renderLevelMapUI() {
    try {
      // Ensure session and roster are initialized
      if (window.FIVIAGroupPlay && typeof window.FIVIAGroupPlay.getSessionState === 'function') {
        const gpState = window.FIVIAGroupPlay.getSessionState() || {};
        if (!gpState.groups || !Array.isArray(gpState.groups) || gpState.groups.length === 0) {
          if (typeof window.FIVIAGroupPlay.autoGroupStudents === 'function') {
            window.FIVIAGroupPlay.autoGroupStudents(gpState.classroomId || 'cls_xf1', 4);
          }
        }
      }

      const allLevels = (window.FIVIAGroupLevels && typeof window.FIVIAGroupLevels.getAllLevels === 'function')
        ? window.FIVIAGroupLevels.getAllLevels()
        : getFallbackLevels();
      
      const sessionState = (window.FIVIAGroupPlay && typeof window.FIVIAGroupPlay.getSessionState === 'function')
        ? window.FIVIAGroupPlay.getSessionState() || {}
        : {};
      
      const classes = (window.FIVIAGroupPlay && typeof window.FIVIAGroupPlay.getClassrooms === 'function')
        ? window.FIVIAGroupPlay.getClassrooms() || []
        : [];
      
      const activeCls = classes.find(c => c && c.id === sessionState.classroomId) || classes[0] || { id: 'cls_xf1', name: 'XI FASE F' };
      const groups = (sessionState.groups && Array.isArray(sessionState.groups) && sessionState.groups.length > 0)
        ? sessionState.groups
        : [
            { groupName: 'Kelompok 1 (Newton)', members: [{ studentName: 'Ahmad Fauzan' }, { studentName: 'Budi Santoso' }] },
            { groupName: 'Kelompok 2 (Einstein)', members: [{ studentName: 'Dian Pratama' }, { studentName: 'Eka Putri' }] },
            { groupName: 'Kelompok 3 (Galileo)', members: [{ studentName: 'Gita Savitri' }, { studentName: 'Hendra Setiawan' }] },
            { groupName: 'Kelompok 4 (Tesla)', members: [{ studentName: 'Indah Permata' }, { studentName: 'Joko' }] }
          ];

      let allMats = [];
      if (window.db) {
        if (typeof window.db.getMaterials === 'function') {
          allMats = window.db.getMaterials() || [];
        } else if (typeof window.db.getTable === 'function') {
          allMats = window.db.getTable("materials") || [];
        }
      }

      // Ensure all 5 core modules (Modul 1 to 5) are always present
      const fallbackMats = [
        { id: 1, name: "Hakikat Fisika dan Metode Ilmiah" },
        { id: 2, name: "Pengukuran Dasar Fisika" },
        { id: 3, name: "Usaha dan Energi" },
        { id: 4, name: "Lingkungan dan Energi Terbarukan" },
        { id: 5, name: "Pemanasan Global" }
      ];

      const baseMats = [];
      for (let i = 1; i <= 5; i++) {
        const found = allMats.find(m => parseInt(m.id) === i) || fallbackMats.find(m => m.id === i);
        if (found) baseMats.push(found);
      }

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
              <button class="fq-btn fq-btn-cyan" style="min-height: 50px;" onclick="window.FIVIAGroupLevelEngine.openWordImportModal()"><i class="fas fa-file-word"></i> 📝 UPLOAD SOAL WORD (.docx)</button>
              <button class="fq-btn fq-btn-emerald" style="min-height: 50px;" onclick="window.FIVIAGroupLevelEngine.openTeacherQuestionBankModal()"><i class="fas fa-key"></i> 🔑 KUNCI JAWABAN GURU</button>
              <button class="fq-btn fq-btn-emerald" style="min-height: 50px;" onclick="if(window.FIVIAClassroomEngine) window.FIVIAClassroomEngine.triggerExcelImport()"><i class="fas fa-file-import"></i> 📥 IMPORT EXCEL</button>
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
              <select class="fq-select" style="min-width: 340px; min-height: 52px; font-weight: 800; font-size: 1.05rem; background: #0f172a; color: #fff; border: 2px solid var(--fq-cyan); border-radius: 14px; padding: 0 16px;" onchange="window.FIVIAGroupLevelEngine.setSelectedModule(this.value)">
                <option value="ALL" ${selectedModuleId === 'ALL' ? 'selected' : ''}>🌟 SEMUA MODUL MATERI (ACAK GABUNGAN)</option>
                <optgroup label="📖 Modul Kurikulum Utama (Materi &amp; Lab)">
                  ${baseMats.map(m => `<option value="${m.id}" ${String(selectedModuleId) === String(m.id) ? 'selected' : ''}>Modul ${m.id}: ${m.name}</option>`).join('')}
                </optgroup>
              </select>
            </div>
          </div>

          <!-- 1. PENGATURAN KELOMPOK & DATABASE SISWA -->
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
                    <span class="fq-badge-pill" style="margin: 0; font-size: 0.75rem;">${(grp.members || []).length} Siswa</span>
                  </div>
                  <div style="font-size: 0.85rem; color: #fff; display: flex; flex-direction: column; gap: 4px; max-height: 120px; overflow-y: auto;">
                    ${(grp.members || []).map((m, mIdx) => `
                      <div style="display: flex; align-items: center; gap: 6px;">
                        <span style="color: var(--fq-cyan); font-weight: 800;">${mIdx + 1}.</span> ${m.studentName || m}
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
                  <div style="flex: 1; min-width: 150px; background: rgba(15,23,42,0.9); border: 3px solid ${lvl.color || '#06b6d4'}; border-radius: 22px; padding: 20px 14px; position: relative; box-shadow: 0 0 20px ${lvl.color || '#06b6d4'}; cursor: pointer; transition: transform 0.2s ease;" onclick="window.FIVIAGroupLevelEngine.startLevel('${lvl.id}')" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
                    <div style="font-size: 2.5rem; margin-bottom: 6px;">${lvl.badge || '🟢'}</div>
                    <div style="font-size: 0.85rem; font-weight: 900; color: ${lvl.color || '#06b6d4'};">${lvl.code}</div>
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
                <div style="background: rgba(30,41,59,0.85); border: 3px solid ${lvl.color || '#06b6d4'}; border-radius: 24px; padding: 24px; display: flex; flex-direction: column; justify-content: space-between; box-shadow: 0 0 25px rgba(0,0,0,0.3);">
                  <div>
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                      <span class="fq-badge-pill" style="border-color: ${lvl.color || '#06b6d4'}; color: ${lvl.color || '#06b6d4'}; font-weight: 900;">${lvl.badge || '🟢'} ${lvl.code}</span>
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
    } catch (err) {
      console.error("Error rendering level map UI:", err);
      const fallbackHtml = `
        <div style="background: rgba(15, 23, 42, 0.98); border: 3.5px solid #06b6d4; border-radius: 32px; padding: 36px; text-align: center; color: #fff;">
          <h1 style="font-size: 2.2rem; color: #06b6d4; margin-bottom: 12px;">🎮 FIVIA GROUP PLAY ARENA</h1>
          <p style="font-size: 1.1rem; color: #cbd5e1; margin-bottom: 24px;">Atur kelompok dan mainkan tantangan fisika interaktif secara bergiliran!</p>
          <button class="fq-btn fq-btn-cyan fq-btn-lg" style="padding: 16px 32px; font-size: 1.2rem; font-weight: 900;" onclick="window.FIVIAGroupLevelEngine.startLevel('LEVEL_01')">
            ▶ MULAI PERMAINAN KELOMPOK (LEVEL 01)
          </button>
        </div>
      `;
      renderToContainers(fallbackHtml);
    }
  }

  function selectClass(classId) {
    if (window.FIVIAGroupPlay && typeof window.FIVIAGroupPlay.autoGroupStudents === 'function') {
      window.FIVIAGroupPlay.autoGroupStudents(classId, 4);
    }
    renderLevelMapUI();
  }

  function autoGroup() {
    if (window.FIVIAGroupPlay && typeof window.FIVIAGroupPlay.autoGroupStudents === 'function') {
      const state = window.FIVIAGroupPlay.getSessionState ? window.FIVIAGroupPlay.getSessionState() : {};
      window.FIVIAGroupPlay.autoGroupStudents(state.classroomId || 'cls_xf1', 4);
    }
    renderLevelMapUI();
    alert('🎉 KELOMPOK BERHASIL DIBAGI OTOMATIS DARI DATABASE SISWA!');
  }

  function startLevel(levelId) {
    // 1. Ensure Group Play session is active with valid groups & active player
    if (window.FIVIAGroupPlay) {
      const gpState = typeof window.FIVIAGroupPlay.getSessionState === 'function' ? window.FIVIAGroupPlay.getSessionState() : {};
      if (!gpState.groups || gpState.groups.length === 0 || !gpState.activePlayer) {
        if (typeof window.FIVIAGroupPlay.startSession === 'function') {
          window.FIVIAGroupPlay.startSession(gpState.classroomId || 'cls_xf1');
        }
      }
    }

    // 2. Start Level Session
    if (window.FIVIAGroupLevels && typeof window.FIVIAGroupLevels.startLevelSession === 'function') {
      window.FIVIAGroupLevels.startLevelSession(levelId);
    }

    // 3. Render Active Interactive Board UI
    renderActiveLevelBoardUI();
  }

  function detectType(q) {
    if (q && q.type) return q.type;
    if (q && q.pairs && q.pairs.length > 0) return "matching";
    if (q && q.correctAnswers) {
      if (Array.isArray(q.correctAnswers) && typeof q.correctAnswers[0] === 'number') return "multiple_select";
      return "short_answer";
    }
    if (q && q.options && q.options.length === 2 && (q.options[0].label === "BENAR" || q.options[0] === "BENAR")) return "true_false";

    const state = (window.FIVIAGroupLevels && typeof window.FIVIAGroupLevels.getLevelState === 'function')
      ? window.FIVIAGroupLevels.getLevelState()
      : { activeLevelId: 'LEVEL_01' };
    const lvlId = (state && state.activeLevelId) ? state.activeLevelId : 'LEVEL_01';

    if (lvlId === 'LEVEL_02') return "true_false";
    if (lvlId === 'LEVEL_03') return "matching";
    if (lvlId === 'LEVEL_04') return "multiple_select";
    if (lvlId === 'LEVEL_05') return "short_answer";

    return "multiple_choice";
  }

  function renderActiveLevelBoardUI() {
    try {
      const state = (window.FIVIAGroupLevels && typeof window.FIVIAGroupLevels.getLevelState === 'function')
        ? window.FIVIAGroupLevels.getLevelState()
        : { activeLevelId: 'LEVEL_01', teamLives: 3, maxLives: 3, comboStreak: 0, currentQuestionIndex: 0, correctAnswersCount: 0 };
      
      let meta = (window.FIVIAGroupLevels && typeof window.FIVIAGroupLevels.getLevelMetadata === 'function')
        ? window.FIVIAGroupLevels.getLevelMetadata(state.activeLevelId)
        : null;
      if (!meta) meta = { id: 'LEVEL_01', code: 'LEVEL 01', title: 'BESARAN HUNTER', color: '#06b6d4', badge: '🟢' };

      const sessionState = (window.FIVIAGroupPlay && typeof window.FIVIAGroupPlay.getSessionState === 'function')
        ? window.FIVIAGroupPlay.getSessionState()
        : {};
      
      const activeGroup = sessionState.activeGroup || (sessionState.groups ? sessionState.groups[0] : null) || { groupName: 'KELOMPOK 1 (NEWTON)', score: 850 };
      const activePlayer = sessionState.activePlayer || (activeGroup.members ? activeGroup.members[0] : null) || { studentName: 'Ahmad Fauzan', studentCode: 'STD-001' };

      const questions = (window.FIVIAGroupLevelQuestions && typeof window.FIVIAGroupLevelQuestions.getQuestionsForLevel === 'function')
        ? window.FIVIAGroupLevelQuestions.getQuestionsForLevel(state.activeLevelId, 10, selectedModuleId)
        : [];
      
      const safeQuestions = questions.length > 0 ? questions : [
        { id: 'q_fb', question: 'Manakah yang merupakan besaran pokok SI?', options: [{ id: 'A', label: 'Kecepatan' }, { id: 'B', label: 'Massa' }], correctAnswer: 'B', explanation: 'Massa adalah besaran pokok SI.' }
      ];

      const qIdx = (state.currentQuestionIndex || 0) % Math.max(1, safeQuestions.length);
      const q = safeQuestions[qIdx];

      const livesHtml = Array.from({ length: state.maxLives || 3 }).map((_, i) => i < (state.teamLives || 3) ? '❤️' : '🖤').join(' ');
      const bossHP = state.activeLevelId === 'LEVEL_05' ? Math.max(0, 100 - ((state.correctAnswersCount || 0) * 20)) : 100;

      const qType = detectType(q);
      let typeBadgeLabel = "Pilihan Ganda";
      if (qType === "true_false") typeBadgeLabel = "Benar / Salah";
      else if (qType === "matching") typeBadgeLabel = "Mencocokkan";
      else if (qType === "multiple_select") typeBadgeLabel = "Pilihan Ganda Kompleks";
      else if (qType === "short_answer") typeBadgeLabel = "Isian Singkat";

      let optionsUI = "";
      if (qType === "multiple_choice" || qType === "true_false") {
        let optsList = q.options;
        if (qType === "true_false" && (!optsList || optsList.length < 2)) {
          optsList = [{id:'A',label:'BENAR'},{id:'B',label:'SALAH'}];
        } else if (!optsList || optsList.length === 0) {
          optsList = [
            { id: 'A', label: 'Pilihan A' },
            { id: 'B', label: 'Pilihan B' }
          ];
        }
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
        <div style="background: rgba(15, 23, 42, 0.98); border: 3.5px solid ${meta.color || '#06b6d4'}; border-radius: 32px; padding: 32px; text-align: left; box-shadow: 0 0 60px rgba(6,182,212,0.3);">
          <!-- Smartboard Level Top Header Bar -->
          <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 3px solid var(--fq-border-cyan); padding-bottom: 18px; margin-bottom: 24px; flex-wrap: wrap; gap: 14px;">
            <div>
              <span class="fq-badge-pill" style="border-color: ${meta.color || '#06b6d4'}; color: ${meta.color || '#06b6d4'}; font-size: 1rem; padding: 6px 18px;">
                ${meta.badge || '🟢'} ${meta.code} &bull; ${meta.title}
              </span>
              <h2 style="font-size: 2.2rem; font-weight: 900; color: #fff; margin: 6px 0 0 0;">👥 KELOMPOK: <strong style="color: var(--fq-amber);">${activeGroup.groupName || 'KELOMPOK 1'}</strong></h2>
            </div>

            <div style="display: flex; align-items: center; gap: 16px;">
              <div style="background: rgba(30,41,59,0.9); border: 2px solid var(--fq-rose); border-radius: 20px; padding: 10px 20px; text-align: center;">
                <div style="font-size: 0.75rem; color: var(--fq-text-muted); font-weight: 800;">TEAM LIVES</div>
                <div style="font-size: 1.5rem;">${livesHtml}</div>
              </div>

              ${(state.comboStreak || 0) > 1 ? `
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
              👨‍🎓 ${activePlayer.studentName || 'Siswa'}
            </h1>
            <div style="font-size: 1rem; color: var(--fq-cyan); font-weight: 800;">
              👥 ${activeGroup.groupName || 'Kelompok 1'} &bull; TANTANGAN ${qIdx + 1} / ${safeQuestions.length} &bull; TYPE: <span style="color:var(--fq-amber);">${typeBadgeLabel}</span>
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
              🎮 CONTROLLER GURU: <span style="color: var(--fq-cyan);">${activePlayer.studentName || 'Siswa'} (${activeGroup.groupName || 'Kelompok 1'})</span>
            </div>
            <div style="display: flex; gap: 10px; flex-wrap: wrap;">
              <button class="fq-btn fq-btn-emerald" style="min-height: 48px;" onclick="window.FIVIAGroupLevelEngine.openTeacherQuestionBankModal()"><i class="fas fa-key"></i> 🔑 KUNCI JAWABAN GURU</button>
              <button class="fq-btn fq-btn-emerald" style="min-height: 48px;" onclick="if(window.FIVIAGroupLevels) window.FIVIAGroupLevels.addTeamLife(); window.FIVIAGroupLevelEngine.renderActiveLevelBoardUI();"><i class="fas fa-heart"></i> ❤️ +1 LIFE</button>
              <button class="fq-btn fq-btn-amber" style="min-height: 48px;" onclick="window.FIVIAGroupLevelEngine.skipTurn()"><i class="fas fa-step-forward"></i> ⏭ LEWATI GILIRAN</button>
              <button class="fq-btn fq-btn-outline" style="min-height: 48px;" onclick="window.FIVIAGroupLevelEngine.renderActiveLevelBoardUI()"><i class="fas fa-redo"></i> 🔄 ULANGI GILIRAN</button>
              <button class="fq-btn fq-btn-danger" style="min-height: 48px;" onclick="window.FIVIAGroupLevelEngine.renderLevelMapUI()"><i class="fas fa-stop-circle"></i> 🏁 KELUAR LEVEL</button>
            </div>
          </div>
        </div>
      `;

      renderToContainers(html);
    } catch(err) {
      console.error("Error in renderActiveLevelBoardUI:", err);
      renderLevelMapUI();
    }
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

  function openTeacherQuestionBankModal(filterLevel) {
    let existingModal = document.getElementById('fq-teacher-qbank-modal');
    if (existingModal) existingModal.remove();

    const selectedLevel = filterLevel || 'ALL';
    const levelKeys = selectedLevel === 'ALL' 
      ? ['LEVEL_01', 'LEVEL_02', 'LEVEL_03', 'LEVEL_04', 'LEVEL_05']
      : [selectedLevel];

    let allQuestions = [];
    levelKeys.forEach(lvlId => {
      if (window.FIVIAGroupLevelQuestions && typeof window.FIVIAGroupLevelQuestions.getQuestionsForLevel === 'function') {
        const qList = window.FIVIAGroupLevelQuestions.getQuestionsForLevel(lvlId, 50, selectedModuleId);
        qList.forEach(q => {
          allQuestions.push({ ...q, levelId: lvlId });
        });
      }
    });

    const modal = document.createElement('div');
    modal.id = 'fq-teacher-qbank-modal';
    modal.style.cssText = 'position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(15,23,42,0.96); z-index: 99999; overflow-y: auto; padding: 30px; box-sizing: border-box; backdrop-filter: blur(10px);';

    let questionsHtml = '';
    if (allQuestions.length === 0) {
      questionsHtml = '<div style="color: #cbd5e1; font-size: 1.1rem; text-align: center; padding: 40px;">Tidak ada soal ditemukan untuk modul ini.</div>';
    } else {
      questionsHtml = allQuestions.map((q, idx) => {
        const qType = detectType(q);
        let typeBadge = '<span class="fq-badge-pill" style="border-color: #06b6d4; color: #06b6d4;">Pilihan Ganda</span>';
        if (qType === 'true_false') typeBadge = '<span class="fq-badge-pill" style="border-color: #8b5cf6; color: #8b5cf6;">Benar / Salah</span>';
        else if (qType === 'matching') typeBadge = '<span class="fq-badge-pill" style="border-color: #f59e0b; color: #f59e0b;">Mencocokkan</span>';
        else if (qType === 'multiple_select') typeBadge = '<span class="fq-badge-pill" style="border-color: #ec4899; color: #ec4899;">Pilihan Ganda Kompleks</span>';
        else if (qType === 'short_answer') typeBadge = '<span class="fq-badge-pill" style="border-color: #10b981; color: #10b981;">Isian Singkat</span>';

        let formattedKey = '';
        if (qType === 'multiple_choice' || qType === 'true_false') {
          const correctOpt = (q.options || []).find(o => (o.id || String.fromCharCode(65 + (q.options || []).indexOf(o))) === q.correctAnswer) || q.correctAnswer;
          formattedKey = typeof correctOpt === 'object' ? `${correctOpt.id}: ${correctOpt.label || correctOpt.text}` : correctOpt;
        } else if (qType === 'multiple_select') {
          const correctArr = q.correctAnswers || [];
          const labels = correctArr.map(i => {
            const opt = (q.options || [])[i];
            return opt ? (opt.label || opt.text || opt) : `Opsi ${i+1}`;
          });
          formattedKey = labels.join(' + ');
        } else if (qType === 'matching') {
          const pairs = q.pairs || [];
          formattedKey = pairs.map(p => `<strong>${p.left}</strong> &rarr; <span style="color:#10b981;">${p.right}</span>`).join('<br/>');
        } else if (qType === 'short_answer') {
          formattedKey = (q.correctAnswers || [q.correctAnswer]).join(' ATAU ');
        }

        return `
          <div style="background: rgba(30,41,59,0.9); border: 2px solid var(--fq-border-cyan); border-radius: 20px; padding: 24px; margin-bottom: 20px; text-align: left;">
            <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1.5px solid var(--fq-border-cyan); padding-bottom: 10px; margin-bottom: 14px; flex-wrap: wrap; gap: 8px;">
              <div>
                <strong style="color: var(--fq-cyan); font-size: 1.1rem;">SOAL #${idx + 1} &bull; [${q.levelId || 'GENERAL'}]</strong>
              </div>
              <div>${typeBadge}</div>
            </div>

            <div style="font-size: 1.25rem; font-weight: 800; color: #fff; line-height: 1.5; margin-bottom: 16px; white-space: pre-line;">
              ${q.question}
            </div>

            <!-- OPTIONS PREVIEW -->
            ${q.options && q.options.length > 0 ? `
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 10px; margin-bottom: 16px;">
                ${q.options.map((opt, i) => `
                  <div style="background: rgba(15,23,42,0.6); border: 1px solid var(--fq-border-cyan); border-radius: 12px; padding: 10px 14px; font-size: 0.95rem; color: #e2e8f0;">
                    <strong style="color: var(--fq-amber);">${opt.id || String.fromCharCode(65 + i)}.</strong> ${opt.label || opt.text || opt}
                  </div>
                `).join('')}
              </div>
            ` : ''}

            <!-- VERIFIED ANSWER KEY BOX -->
            <div style="background: rgba(16,185,129,0.15); border: 2px solid #10b981; border-radius: 14px; padding: 14px 18px; margin-bottom: 12px;">
              <div style="color: #10b981; font-weight: 900; font-size: 1.05rem; margin-bottom: 4px;">
                🔑 KUNCI JAWABAN VERIFIKASI:
              </div>
              <div style="color: #fff; font-size: 1.1rem; font-weight: 800;">
                ${formattedKey}
              </div>
            </div>

            <!-- EXPLANATION BOX -->
            <div style="background: rgba(6,182,212,0.12); border: 1.5px solid var(--fq-cyan); border-radius: 14px; padding: 14px 18px;">
              <div style="color: var(--fq-cyan); font-weight: 800; font-size: 0.95rem; margin-bottom: 4px;">
                💡 PENJELASAN ILMIAH FISIKA:
              </div>
              <div style="color: #cbd5e1; font-size: 0.98rem; line-height: 1.4;">
                ${q.explanation || 'Tidak ada penjelasan tambahan.'}
              </div>
            </div>
          </div>
        `;
      }).join('');
    }

    modal.innerHTML = `
      <div style="max-width: 900px; margin: 0 auto;">
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 3px solid var(--fq-cyan); padding-bottom: 16px; margin-bottom: 24px; flex-wrap: wrap; gap: 12px;">
          <div>
            <h1 style="font-size: 2.2rem; font-weight: 900; color: #fff; margin: 0;">🔑 BANK SOAL &amp; KUNCI JAWABAN GURU</h1>
            <div style="color: var(--fq-cyan); font-weight: 800; font-size: 1rem;">Inspeksi seluruh soal fisika &amp; verifikasi kunci jawaban tanpa perlu memainkan gim</div>
          </div>
          <button class="fq-btn fq-btn-danger" style="min-height: 48px; font-weight: 900; font-size: 1.1rem; padding: 0 24px;" onclick="window.FIVIAGroupLevelEngine.closeTeacherQuestionBankModal()">
            ✖ TUTUP
          </button>
        </div>

        <div style="display: flex; gap: 10px; margin-bottom: 20px; flex-wrap: wrap;">
          <button class="fq-btn ${selectedLevel === 'ALL' ? 'fq-btn-cyan' : 'fq-btn-outline'}" onclick="window.FIVIAGroupLevelEngine.openTeacherQuestionBankModal('ALL')">🌟 SEMUA LEVEL</button>
          <button class="fq-btn ${selectedLevel === 'LEVEL_01' ? 'fq-btn-cyan' : 'fq-btn-outline'}" onclick="window.FIVIAGroupLevelEngine.openTeacherQuestionBankModal('LEVEL_01')">🟢 LEVEL 01</button>
          <button class="fq-btn ${selectedLevel === 'LEVEL_02' ? 'fq-btn-cyan' : 'fq-btn-outline'}" onclick="window.FIVIAGroupLevelEngine.openTeacherQuestionBankModal('LEVEL_02')">🔵 LEVEL 02</button>
          <button class="fq-btn ${selectedLevel === 'LEVEL_03' ? 'fq-btn-cyan' : 'fq-btn-outline'}" onclick="window.FIVIAGroupLevelEngine.openTeacherQuestionBankModal('LEVEL_03')">🟣 LEVEL 03</button>
          <button class="fq-btn ${selectedLevel === 'LEVEL_04' ? 'fq-btn-cyan' : 'fq-btn-outline'}" onclick="window.FIVIAGroupLevelEngine.openTeacherQuestionBankModal('LEVEL_04')">🟠 LEVEL 04</button>
          <button class="fq-btn ${selectedLevel === 'LEVEL_05' ? 'fq-btn-cyan' : 'fq-btn-outline'}" onclick="window.FIVIAGroupLevelEngine.openTeacherQuestionBankModal('LEVEL_05')">🔴 LEVEL 05</button>
        </div>

        ${questionsHtml}
      </div>
    `;

    document.body.appendChild(modal);
  }

  function closeTeacherQuestionBankModal() {
    const existingModal = document.getElementById('fq-teacher-qbank-modal');
    if (existingModal) existingModal.remove();
  }

  function downloadWordTemplate() {
    const templateContent = `==================================================
TEMPLATE BANK SOAL FISIKA GURU - FIVIA APP
==================================================
Petunjuk Guru:
- Tulis/Simpan soal dalam dokumen Word (.docx) atau Notepad (.txt).
- Gunakan penanda [JENIS: ...] untuk setiap soal agar aplikasi dapat mengenali format soal.
- 5 Jenis Soal yang didukung:
  1. PILIHAN GANDA
  2. BENAR SALAH
  3. MENCOCOKKAN
  4. PILIHAN GANDA KOMPLEKS
  5. ISIAN SINGKAT

--------------------------------------------------
CONTOH FORMAT SOAL:
--------------------------------------------------

[JENIS: PILIHAN GANDA]
SOAL: Seorang siswa beranggapan bahwa Kalor dan Suhu adalah hal yang sama. Bagaimanakah penjelasan ilmiah yang tepat?
OPSI A: Kalor dan Suhu adalah besaran yang sama.
OPSI B: Suhu mengukur derajat panas, sedangkan Kalor adalah energi panas yang berpindah dari suhu tinggi ke suhu rendah.
OPSI C: Kalor mengalir dari benda dingin ke benda hangat.
OPSI D: Suhu tidak memiliki satuan SI.
KUNCI: B
PENJELASAN: Suhu adalah ukuran derajat panas (K/°C), sedangkan kalor adalah energi panas yang berpindah secara alami dari temperatur tinggi ke temperatur lebih rendah.

[JENIS: BENAR SALAH]
SOAL: Rasa dingin dapat mengalir masuk ke dalam benda hangat saat tangan menyentuh es batu.
OPSI A: BENAR
OPSI B: SALAH
KUNCI: B
PENJELASAN: Rasa dingin bukan energi yang mengalir, melainkan kalor dari tubuh yang mengalir keluar ke es batu.

[JENIS: MENCOCOKKAN]
SOAL: Pasangkan besaran fisika di sebelah kiri dengan satuan SI di sebelah kanan:
PASANGAN 1: Massa = kg
PASANGAN 2: Panjang = meter
PASANGAN 3: Waktu = detik
PENJELASAN: Satuan SI massa adalah kg, panjang adalah meter, dan waktu adalah detik.

[JENIS: PILIHAN GANDA KOMPLEKS]
SOAL: Manakah yang termasuk besaran pokok SI? (Pilih semua yang benar)
OPSI A: Massa
OPSI B: Gaya
OPSI C: Waktu
OPSI D: Energi
KUNCI: A, C
PENJELASAN: Massa dan Waktu adalah besaran pokok. Gaya dan Energi adalah besaran turunan.

[JENIS: ISIAN SINGKAT]
SOAL: Apakah nama satuan standar internasional (SI) untuk suhu mutlak?
KUNCI: Kelvin
PENJELASAN: Kelvin (K) adalah satuan standar internasional untuk suhu mutlak.
`;

    const blob = new Blob([templateContent], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'Template_Soal_Guru_FIVIA.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  function openWordImportModal() {
    let existingModal = document.getElementById('fq-word-import-modal');
    if (existingModal) existingModal.remove();

    const modal = document.createElement('div');
    modal.id = 'fq-word-import-modal';
    modal.style.cssText = 'position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(15,23,42,0.96); z-index: 99999; overflow-y: auto; padding: 30px; box-sizing: border-box; backdrop-filter: blur(10px);';

    modal.innerHTML = `
      <div style="max-width: 850px; margin: 0 auto; background: rgba(30,41,59,0.95); border: 3px solid var(--fq-cyan); border-radius: 28px; padding: 32px; box-shadow: 0 0 50px rgba(6,182,212,0.3); text-align: left;">
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2.5px solid var(--fq-border-cyan); padding-bottom: 16px; margin-bottom: 24px; flex-wrap: wrap; gap: 12px;">
          <div>
            <h1 style="font-size: 2rem; font-weight: 900; color: #fff; margin: 0;">📝 UPLOAD SOAL WORD GURU (.docx)</h1>
            <div style="color: var(--fq-cyan); font-weight: 800; font-size: 0.95rem;">Buat bank soal fisika di Word, unduh template, dan unggah langsung ke aplikasi!</div>
          </div>
          <button class="fq-btn fq-btn-danger" style="min-height: 44px; font-weight: 900;" onclick="window.FIVIAGroupLevelEngine.closeWordImportModal()">✖ TUTUP</button>
        </div>

        <div style="display: flex; gap: 12px; margin-bottom: 24px; flex-wrap: wrap;">
          <button class="fq-btn fq-btn-emerald" style="padding: 12px 20px; font-weight: 900;" onclick="window.FIVIAGroupLevelEngine.downloadWordTemplate()">
            <i class="fas fa-download"></i> 📥 DOWNLOAD TEMPLATE WORD / TXT
          </button>
          <button class="fq-btn fq-btn-outline" style="padding: 12px 20px; font-weight: 800;" onclick="const guide = document.getElementById('fq-word-format-guide'); guide.style.display = guide.style.display === 'none' ? 'block' : 'none';">
            <i class="fas fa-info-circle"></i> 📋 LIHAT PANDUAN FORMAT WORD
          </button>
        </div>

        <!-- Sample Format Preview Box -->
        <div id="fq-word-format-guide" style="display: none; background: rgba(15,23,42,0.8); border: 2px dashed var(--fq-amber); border-radius: 16px; padding: 20px; margin-bottom: 24px; font-family: monospace; font-size: 0.88rem; color: #e2e8f0; max-height: 250px; overflow-y: auto; white-space: pre-wrap;">
[JENIS: PILIHAN GANDA]
SOAL: Kalor dan Suhu adalah...
OPSI A: Besaran yang sama
OPSI B: Suhu adalah derajat panas, Kalor adalah energi panas
KUNCI: B
PENJELASAN: Suhu mengukur derajat panas, kalor adalah energi berpindah.

[JENIS: BENAR SALAH]
SOAL: Rasa dingin mengalir masuk ke benda hangat.
KUNCI: SALAH
PENJELASAN: Kalor mengalir keluar dari benda hangat.

[JENIS: MENCOCOKKAN]
SOAL: Pasangkan besaran dan satuan SI:
PASANGAN 1: Massa = kg
PASANGAN 2: Waktu = detik
PENJELASAN: Satuan SI massa kg, waktu detik.

[JENIS: PILIHAN GANDA KOMPLEKS]
SOAL: Manakah besaran pokok SI?
OPSI A: Massa
OPSI B: Gaya
OPSI C: Waktu
KUNCI: A, C
PENJELASAN: Massa dan Waktu adalah besaran pokok.

[JENIS: ISIAN SINGKAT]
SOAL: Satuan SI suhu mutlak adalah...
KUNCI: Kelvin
PENJELASAN: Kelvin (K) adalah satuan SI suhu mutlak.
        </div>

        <!-- Target Module Dropdown Selector -->
        <div style="margin-bottom: 20px;">
          <label style="display: block; color: #fff; font-weight: 800; font-size: 1rem; margin-bottom: 8px;">
            📚 PILIH TARGET MODUL FISIKA UNTUK BANK SOAL WORD:
          </label>
          <select id="fq-word-target-module-select" class="fq-select" style="width: 100%; min-height: 52px; font-weight: 800; font-size: 1.05rem; background: #0f172a; color: #fff; border: 2px solid var(--fq-cyan); border-radius: 14px; padding: 0 16px; margin-bottom: 12px;" onchange="
            const customDiv = document.getElementById('fq-word-custom-title-wrapper');
            if (customDiv) customDiv.style.display = this.value === 'CUSTOM' ? 'block' : 'none';
          ">
            <option value="1">Modul 1: Hakikat Fisika dan Metode Ilmiah</option>
            <option value="2">Modul 2: Pengukuran Dasar Fisika</option>
            <option value="3">Modul 3: Usaha dan Energi</option>
            <option value="4">Modul 4: Lingkungan dan Energi Terbarukan</option>
            <option value="5">Modul 5: Pemanasan Global</option>
            <option value="CUSTOM">➕ Buat Modul Tambahan / Topik Custom Guru</option>
          </select>
          <div id="fq-word-custom-title-wrapper" style="display: none;">
            <input type="text" id="fq-word-module-name" class="fq-select" style="width: 100%; min-height: 52px; font-size: 1.05rem; padding: 0 16px; background: #0f172a; color: #fff; border: 2px solid var(--fq-amber); border-radius: 12px;" placeholder="Tuliskan nama modul baru..." value="Modul Buatan Guru (Word)" />
          </div>
        </div>

        <!-- File Select Input -->
        <div style="background: rgba(15,23,42,0.7); border: 2.5px dashed var(--fq-cyan); border-radius: 20px; padding: 30px; text-align: center; margin-bottom: 24px;">
          <i class="fas fa-file-word" style="font-size: 3.5rem; color: var(--fq-cyan); margin-bottom: 12px;"></i>
          <h3 style="color: #fff; font-size: 1.2rem; font-weight: 900; margin: 0 0 8px 0;">PILIH DOKUMEN WORD (.docx) ATAU TXT</h3>
          <p style="color: var(--fq-text-muted); font-size: 0.9rem; margin-bottom: 16px;">Unggah file .docx buatan Anda di Microsoft Word</p>
          <input type="file" id="fq-word-file-input" accept=".docx,.txt,.json" style="display: block; margin: 0 auto; color: #fff; font-weight: 800;" />
        </div>

        <!-- Submit Button -->
        <button class="fq-btn fq-btn-cyan fq-btn-lg" style="width: 100%; min-height: 60px; font-size: 1.25rem; font-weight: 900;" onclick="window.FIVIAGroupLevelEngine.processWordImportFile()">
          🚀 PROSES DOKUMEN WORD &amp; SIMPAN BANK SOAL
        </button>
      </div>
    `;

    document.body.appendChild(modal);
  }

  function closeWordImportModal() {
    const modal = document.getElementById('fq-word-import-modal');
    if (modal) modal.remove();
  }

  function processWordImportFile() {
    const fileInput = document.getElementById('fq-word-file-input');
    const targetModSelect = document.getElementById('fq-word-target-module-select');
    const moduleNameInput = document.getElementById('fq-word-module-name');

    if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
      alert('⚠️ Silakan pilih file Word (.docx) atau Text (.txt) terlebih dahulu!');
      return;
    }

    const file = fileInput.files[0];
    const selectedModId = targetModSelect ? targetModSelect.value : '1';
    let moduleTitle = '';

    if (selectedModId === 'CUSTOM') {
      moduleTitle = (moduleNameInput && moduleNameInput.value.trim()) ? moduleNameInput.value.trim() : "Modul Word Guru";
    } else {
      const selectedOpt = targetModSelect ? targetModSelect.options[targetModSelect.selectedIndex] : null;
      moduleTitle = selectedOpt ? selectedOpt.text : `Modul ${selectedModId}`;
    }

    if (file.name.endsWith('.docx')) {
      if (typeof window.mammoth === 'undefined') {
        alert('⚠️ Pustaka pembaca Word belum dimuat. Mohon pastikan koneksi internet aktif untuk memuat Mammoth.js!');
        return;
      }
      const reader = new FileReader();
      reader.onload = function(e) {
        const arrayBuffer = e.target.result;
        window.mammoth.extractRawText({ arrayBuffer: arrayBuffer })
          .then(function(result) {
            const rawText = result.value;
            parseAndSaveWordQuestions(rawText, selectedModId, moduleTitle);
          })
          .catch(function(err) {
            console.error('Error extracting Word text:', err);
            alert('❌ Gagal membaca dokumen Word (.docx): ' + err.message);
          });
      };
      reader.readAsArrayBuffer(file);
    } else {
      const reader = new FileReader();
      reader.onload = function(e) {
        const rawText = e.target.result;
        parseAndSaveWordQuestions(rawText, selectedModId, moduleTitle);
      };
      reader.readAsText(file);
    }
  }

  function parseAndSaveWordQuestions(text, selectedModId, moduleTitle) {
    if (!text || text.trim().length === 0) {
      alert('⚠️ Dokumen Word kosong atau tidak berisi teks!');
      return;
    }

    const blocks = text.split(/(?=\[JENIS:|\nSOAL:)/i).filter(b => b && b.trim().length > 0);
    const parsedQuestions = [];

    blocks.forEach((block, idx) => {
      const bText = block.trim();
      if (!bText.includes('SOAL:')) return;

      let type = 'multiple_choice';
      if (/JENIS:\s*BENAR\s*SALAH/i.test(bText)) type = 'true_false';
      else if (/JENIS:\s*MENCOCOKKAN/i.test(bText)) type = 'matching';
      else if (/JENIS:\s*PILIHAN\s*GANDA\s*KOMPLEKS/i.test(bText)) type = 'multiple_select';
      else if (/JENIS:\s*ISIAN\s*SINGKAT/i.test(bText)) type = 'short_answer';
      else if (/JENIS:\s*PILIHAN\s*GANDA/i.test(bText)) type = 'multiple_choice';

      // Extract Question Text
      const qMatch = bText.match(/SOAL:\s*([\s\S]*?)(?=\nOPSI|\nPASANGAN|\nKUNCI|\nPENJELASAN|$)/i);
      const questionText = qMatch ? qMatch[1].trim() : `Soal ${idx + 1}`;

      // Extract Explanation
      const expMatch = bText.match(/PENJELASAN:\s*([\s\S]*?)(?=\n\[JENIS:|\nSOAL:|$)/i);
      const explanationText = expMatch ? expMatch[1].trim() : 'Pembahasan disiapkan oleh Guru.';

      if (type === 'multiple_choice' || type === 'true_false') {
        const options = [];
        const optMatches = bText.matchAll(/OPSI\s*([A-D]):\s*(.*?)(?=\nOPSI|\nKUNCI|\nPENJELASAN|$)/gi);
        for (const m of optMatches) {
          options.push({ id: m[1].toUpperCase(), label: m[2].trim() });
        }
        if (options.length === 0) {
          options.push({ id: 'A', label: 'BENAR' }, { id: 'B', label: 'SALAH' });
        }

        const kMatch = bText.match(/KUNCI:\s*([A-D]|BENAR|SALAH)/i);
        let key = kMatch ? kMatch[1].trim().toUpperCase() : 'A';
        if (type === 'true_false') {
          if (key === 'SALAH' || key === 'B') key = 'B';
          else key = 'A';
        }

        parsedQuestions.push({
          id: `w_q_${Date.now()}_${idx}`,
          type: type,
          question: questionText,
          options: options,
          correctAnswer: key,
          correct: key,
          explanation: explanationText
        });
      } else if (type === 'short_answer') {
        const kMatch = bText.match(/KUNCI:\s*(.*?)(?=\nPENJELASAN|$)/i);
        const keyVal = kMatch ? kMatch[1].trim() : 'Jawaban';
        const keyArr = keyVal.split(/[,|\/]/).map(k => k.trim());

        parsedQuestions.push({
          id: `w_q_${Date.now()}_${idx}`,
          type: type,
          question: questionText,
          correctAnswers: keyArr,
          correctAnswer: keyArr[0],
          explanation: explanationText
        });
      } else if (type === 'multiple_select') {
        const options = [];
        const optMatches = bText.matchAll(/OPSI\s*([A-D]):\s*(.*?)(?=\nOPSI|\nKUNCI|\nPENJELASAN|$)/gi);
        for (const m of optMatches) {
          options.push({ id: m[1].toUpperCase(), label: m[2].trim() });
        }

        const kMatch = bText.match(/KUNCI:\s*(.*?)(?=\nPENJELASAN|$)/i);
        const keyStr = kMatch ? kMatch[1].trim().toUpperCase() : 'A';
        const correctIndices = [];
        options.forEach((opt, oIdx) => {
          if (keyStr.includes(opt.id)) correctIndices.push(oIdx);
        });

        parsedQuestions.push({
          id: `w_q_${Date.now()}_${idx}`,
          type: type,
          question: questionText,
          options: options,
          correctAnswers: correctIndices.length > 0 ? correctIndices : [0],
          explanation: explanationText
        });
      } else if (type === 'matching') {
        const pairs = [];
        const pairMatches = bText.matchAll(/PASANGAN\s*\d*:\s*(.*?)\s*=\s*(.*?)(?=\nPASANGAN|\nPENJELASAN|$)/gi);
        for (const m of pairMatches) {
          pairs.push({ left: m[1].trim(), right: m[2].trim() });
        }
        if (pairs.length === 0) {
          pairs.push({ left: 'Besaran A', right: 'Satuan A' });
        }

        parsedQuestions.push({
          id: `w_q_${Date.now()}_${idx}`,
          type: type,
          question: questionText,
          pairs: pairs,
          explanation: explanationText
        });
      }
    });

    if (parsedQuestions.length === 0) {
      alert('⚠️ Tidak dapat mendeteksi format soal pada dokumen Word. Pastikan mengikuti penanda [JENIS: ...] dan SOAL:!');
      return;
    }

    let targetModId = selectedModId;
    if (targetModId === 'CUSTOM') {
      targetModId = String(Date.now());
      const newMaterial = {
        id: parseInt(targetModId),
        name: moduleTitle,
        topic: 'Fisika Word Importer',
        description: `Modul buatan Guru di-import dari Word (.docx) berisi ${parsedQuestions.length} soal.`,
        content: `Daftar soal fisika interaktif yang dibuat langsung oleh guru via Microsoft Word.`
      };
      let customMats = [];
      try { customMats = JSON.parse(localStorage.getItem("fivia_custom_materials") || "[]"); } catch(e){}
      customMats.unshift(newMaterial);
      localStorage.setItem("fivia_custom_materials", JSON.stringify(customMats));
    }

    const matIdNum = parseInt(targetModId);

    // Save/Overwrite quiz for target module
    const newQuiz = {
      id: `quiz_${targetModId}`,
      materialId: isNaN(matIdNum) ? targetModId : matIdNum,
      questions: parsedQuestions,
      isTeacherUploaded: true
    };

    let customQuizzes = [];
    try { customQuizzes = JSON.parse(localStorage.getItem("fivia_custom_quizzes") || "[]"); } catch(e){}
    
    const existingIdx = customQuizzes.findIndex(q => String(q.materialId) === String(targetModId) || String(q.id) === `quiz_${targetModId}`);
    if (existingIdx !== -1) {
      customQuizzes[existingIdx] = newQuiz;
    } else {
      customQuizzes.unshift(newQuiz);
    }
    localStorage.setItem("fivia_custom_quizzes", JSON.stringify(customQuizzes));

    if (window.db && typeof window.db.getTable === 'function') {
      try {
        const baseQuizzes = window.db.getTable("quizzes");
        const bIdx = baseQuizzes.findIndex(q => parseInt(q.materialId) === matIdNum);
        if (bIdx !== -1) {
          baseQuizzes[bIdx] = newQuiz;
          window.db.saveTable("quizzes", baseQuizzes);
        }
      } catch(e) {}
    }

    if (window.FIVIAGroupLevelQuestions && typeof window.FIVIAGroupLevelQuestions.resetQuestionCache === 'function') {
      window.FIVIAGroupLevelQuestions.resetQuestionCache();
    }

    setSelectedModule(String(targetModId));
    closeWordImportModal();
    alert(`🎉 BERHASIL MENG-IMPORT ${parsedQuestions.length} SOAL DARI WORD DOKUMEN!\n\nBank soal untuk "${moduleTitle}" telah berhasil disimpan dan otomatis terpilih untuk permainan.`);
    renderLevelMapUI();
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
    skipTurn: skipTurn,
    openTeacherQuestionBankModal: openTeacherQuestionBankModal,
    closeTeacherQuestionBankModal: closeTeacherQuestionBankModal,
    downloadWordTemplate: downloadWordTemplate,
    openWordImportModal: openWordImportModal,
    closeWordImportModal: closeWordImportModal,
    processWordImportFile: processWordImportFile
  };
})();


