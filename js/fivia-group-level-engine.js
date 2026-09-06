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

      let activeCls = classes.find(c => c && (c.id === sessionState.classroomId || c.name === sessionState.className)) || classes[0] || { id: 'cls_x1', name: 'Kelas X-1' };

      // Dynamically auto-group students for active class if groups are empty or classroom changed
      let groups = (sessionState.groups && Array.isArray(sessionState.groups) && sessionState.groups.length > 0)
        ? sessionState.groups
        : [];

      if ((!groups || groups.length === 0 || sessionState.classroomId !== activeCls.id) && window.FIVIAGroupPlay && typeof window.FIVIAGroupPlay.autoGroupStudents === 'function') {
        groups = window.FIVIAGroupPlay.autoGroupStudents(activeCls.id, currentGroupCount || 4);
      }

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
        <div style="background: rgba(15, 23, 42, 0.98); border: 2.5px solid var(--fq-cyan); border-radius: 24px; padding: 20px 24px; text-align: left; box-shadow: 0 0 35px var(--fq-cyan-glow);">
          <!-- Top Title Header -->
          <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 2px solid var(--fq-border-cyan); padding-bottom: 12px; margin-bottom: 16px; flex-wrap: wrap; gap: 10px;">
            <div>
              <span class="fq-badge-pill" style="font-size: 0.8rem; padding: 4px 12px; margin-bottom: 4px;"><i class="fas fa-users-cog"></i> FIVIA GROUP PLAY &bull; PETA PERMAINAN KELOMPOK</span>
              <h1 style="font-size: 1.8rem; font-weight: 900; color: #fff; margin: 4px 0 2px 0;">🎮 PETA LEVEL PERMAINAN KELOMPOK</h1>
              <div style="color: var(--fq-cyan); font-weight: 800; font-size: 0.9rem;">Atur kelompok, pilih modul materi, dan mainkan tantangan fisika interaktif secara bergiliran!</div>
            </div>

            <div style="display: flex; gap: 8px; flex-wrap: wrap;">
              <button class="fq-btn fq-fullscreen-toggle-btn" style="min-height: 40px; padding: 6px 14px; font-size: 0.85rem; background: rgba(6,182,212,0.2); border: 1.5px solid var(--fq-cyan); color: #6ee7b7; font-weight: 900;" onclick="window.toggleFullScreen()"><i class="fas fa-expand"></i> ⛶ FULL SCREEN</button>
              <button class="fq-btn fq-bgm-toggle-btn" style="min-height: 40px; padding: 6px 14px; font-size: 0.85rem; background: rgba(16,185,129,0.2); border: 1.5px solid var(--fq-emerald); color: #6ee7b7; font-weight: 900;" onclick="window.toggleBGM()"><i class="fas fa-music"></i> 🎵 BGM: ON</button>
              <button class="fq-btn fq-btn-cyan" style="min-height: 40px; padding: 6px 14px; font-size: 0.85rem;" onclick="window.FIVIAGroupLevelEngine.openWordImportModal()"><i class="fas fa-file-word"></i> 📝 UPLOAD WORD (.docx)</button>
              <button class="fq-btn fq-btn-emerald" style="min-height: 40px; padding: 6px 14px; font-size: 0.85rem;" onclick="window.FIVIAGroupLevelEngine.openTeacherQuestionBankModal()"><i class="fas fa-key"></i> 🔑 KUNCI JAWABAN GURU</button>
              <button class="fq-btn fq-btn-emerald" style="min-height: 40px; padding: 6px 14px; font-size: 0.85rem;" onclick="if(window.FIVIAClassroomEngine) window.FIVIAClassroomEngine.triggerExcelImport()"><i class="fas fa-file-import"></i> 📥 IMPORT EXCEL</button>
              <button class="fq-btn fq-btn-amber" style="min-height: 40px; padding: 6px 14px; font-size: 0.85rem;" onclick="window.FIVIAGroupLevelEngine.autoGroup()"><i class="fas fa-random"></i> 🔀 BAGI KELOMPOK</button>
              <button class="fq-btn fq-btn-cyan" style="min-height: 40px; padding: 6px 14px; font-size: 0.85rem;" onclick="window.FIVIAGroupLevelEngine.startLevel('LEVEL_01')"><i class="fas fa-play"></i> ▶ MULAI LEVEL 01</button>
            </div>
          </div>

          <!-- MODULE SELECTOR BAR (GIM BERDASARKAN MODUL MATERI) -->
          <div style="background: rgba(30,41,59,0.85); border: 2px solid var(--fq-cyan); border-radius: 16px; padding: 14px 18px; margin-bottom: 16px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px; box-shadow: 0 0 20px rgba(6,182,212,0.15);">
            <div>
              <span class="fq-badge-pill" style="border-color: var(--fq-amber); color: var(--fq-amber); font-weight: 900; font-size: 0.78rem; margin-bottom: 2px;"><i class="fas fa-book-open"></i> PILIH MODUL PERMAINAN</span>
              <h3 style="color: #fff; font-size: 1.1rem; font-weight: 900; margin: 2px 0 1px 0;">📚 MATERI &amp; BANK SOAL MODUL GIM:</h3>
              <div style="color: var(--fq-cyan); font-size: 0.82rem; font-weight: 700;">Gim akan memainkan tantangan fisika berdasarkan modul terpilih.</div>
            </div>
            <div>
              <select class="fq-select" style="min-width: 300px; min-height: 42px; font-weight: 800; font-size: 0.95rem; background: #0f172a; color: #fff; border: 1.5px solid var(--fq-cyan); border-radius: 10px; padding: 0 12px;" onchange="window.FIVIAGroupLevelEngine.setSelectedModule(this.value)">
                <option value="ALL" ${selectedModuleId === 'ALL' ? 'selected' : ''}>🌟 SEMUA MODUL MATERI (ACAK GABUNGAN)</option>
                <optgroup label="📖 Modul Kurikulum Utama (Materi &amp; Lab)">
                  ${baseMats.map(m => `<option value="${m.id}" ${String(selectedModuleId) === String(m.id) ? 'selected' : ''}>Modul ${m.id}: ${m.name}</option>`).join('')}
                </optgroup>
              </select>
            </div>
          </div>

          <!-- 1. PENGATURAN KELOMPOK & DATABASE SISWA -->
          <div style="background: rgba(30,41,59,0.85); border: 1.5px solid var(--fq-border-cyan); border-radius: 16px; padding: 14px 18px; margin-bottom: 16px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; flex-wrap: wrap; gap: 8px;">
              <div style="display: flex; align-items: center; gap: 12px; flex-wrap: wrap;">
                <h3 style="color: var(--fq-cyan); font-size: 1rem; font-weight: 900; margin: 0;"><i class="fas fa-chalkboard"></i> KELAS &amp; KELOMPOK (${groups.length} Kelompok):</h3>
                <div style="display: flex; align-items: center; gap: 6px;">
                  <span style="color: var(--fq-amber); font-weight: 800; font-size: 0.82rem;"><i class="fas fa-users-cog"></i> Jumlah Kelompok:</span>
                  <select class="fq-select" style="min-width: 120px; min-height: 32px; padding: 0 8px; font-size: 0.82rem; font-weight: 800; background: #0f172a; color: #fff; border: 1.5px solid var(--fq-cyan); border-radius: 8px;" onchange="window.FIVIAGroupLevelEngine.setNumberOfGroups(this.value)">
                    <option value="2" ${groups.length === 2 ? 'selected' : ''}>2 Kelompok</option>
                    <option value="3" ${groups.length === 3 ? 'selected' : ''}>3 Kelompok</option>
                    <option value="4" ${groups.length === 4 ? 'selected' : ''}>4 Kelompok</option>
                    <option value="5" ${groups.length === 5 ? 'selected' : ''}>5 Kelompok</option>
                    <option value="6" ${groups.length === 6 ? 'selected' : ''}>6 Kelompok</option>
                  </select>
                </div>
              </div>
              <div style="display: flex; gap: 8px; flex-wrap: wrap;">
                ${classes.map(cls => `
                  <button class="fq-btn ${cls.id === activeCls.id ? 'fq-btn-cyan' : 'fq-btn-outline'}" style="padding: 4px 12px; font-weight: 800; font-size: 0.82rem; min-height: 32px;" onclick="window.FIVIAGroupLevelEngine.selectClass('${cls.id}')">
                    📘 ${cls.name}
                  </button>
                `).join('')}
              </div>
            </div>

            <!-- Group Member Cards Preview -->
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 10px;">
              ${groups.map((grp, gIdx) => `
                <div style="background: rgba(15,23,42,0.7); border: 1px solid var(--fq-border-cyan); border-radius: 12px; padding: 10px;">
                  <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--fq-border-cyan); padding-bottom: 4px; margin-bottom: 6px;">
                    <strong style="color: var(--fq-amber); font-size: 0.95rem;">👥 ${grp.groupName}</strong>
                    <span class="fq-badge-pill" style="margin: 0; font-size: 0.7rem; padding: 2px 8px;">${(grp.members || []).length} Siswa</span>
                  </div>
                  <div style="font-size: 0.8rem; color: #fff; display: flex; flex-direction: column; gap: 2px; max-height: 80px; overflow-y: auto;">
                    ${(grp.members || []).map((m, mIdx) => `
                      <div style="display: flex; align-items: center; gap: 4px;">
                        <span style="color: var(--fq-cyan); font-weight: 800;">${mIdx + 1}.</span> ${m.studentName || m}
                      </div>
                    `).join('')}
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- 2. VISUAL GAME MAP PATH (CONNECTED NODES) -->
          <div style="background: linear-gradient(135deg, rgba(30,41,59,0.9), rgba(15,23,42,0.9)); border: 2px solid var(--fq-border-cyan); border-radius: 20px; padding: 16px 20px; margin-bottom: 16px; text-align: center; position: relative;">
            <h3 style="color: var(--fq-cyan); font-size: 1.05rem; font-weight: 900; margin: 0 0 12px 0;"><i class="fas fa-route"></i> PETA JALUR PERMAINAN KELOMPOK (KLIK UNTUK MAINKAN):</h3>

            <div style="display: flex; justify-content: space-between; align-items: center; gap: 10px; overflow-x: auto; padding: 4px 0;">
              ${Object.keys(allLevels).map((key, idx) => {
                const lvl = allLevels[key];

                return `
                  <div style="flex: 1; min-width: 130px; background: rgba(15,23,42,0.9); border: 2px solid ${lvl.color || '#06b6d4'}; border-radius: 16px; padding: 12px 10px; position: relative; box-shadow: 0 0 15px ${lvl.color || '#06b6d4'}; cursor: pointer; transition: transform 0.2s ease;" onclick="window.FIVIAGroupLevelEngine.startLevel('${lvl.id}')" onmouseover="this.style.transform='scale(1.03)'" onmouseout="this.style.transform='scale(1)'">
                    <div style="font-size: 1.8rem; margin-bottom: 4px;">${lvl.badge || '🟢'}</div>
                    <div style="font-size: 0.78rem; font-weight: 900; color: ${lvl.color || '#06b6d4'};">${lvl.code}</div>
                    <div style="font-size: 0.9rem; font-weight: 900; color: #fff; margin: 2px 0;">${lvl.title}</div>
                    <div style="font-size: 0.72rem; font-weight: 800; color: var(--fq-emerald); margin-top: 4px;">
                      🟢 TERBUKA
                    </div>
                  </div>
                  ${idx < 4 ? '<div style="font-size: 1.4rem; color: var(--fq-cyan); font-weight: 900;">&rarr;</div>' : ''}
                `;
              }).join('')}
            </div>
          </div>

          <!-- 3. LEVEL CARDS GRID (MINIGAME MODES) -->
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 14px;">
            ${Object.keys(allLevels).map(key => {
              const lvl = allLevels[key];

              return `
                <div style="background: rgba(30,41,59,0.85); border: 2px solid ${lvl.color || '#06b6d4'}; border-radius: 16px; padding: 14px; display: flex; flex-direction: column; justify-content: space-between; box-shadow: 0 0 15px rgba(0,0,0,0.2);">
                  <div>
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                      <span class="fq-badge-pill" style="border-color: ${lvl.color || '#06b6d4'}; color: ${lvl.color || '#06b6d4'}; font-weight: 900; font-size: 0.78rem; padding: 2px 10px;">${lvl.badge || '🟢'} ${lvl.code}</span>
                      <span class="fq-badge-pill" style="margin: 0; color: var(--fq-emerald); border-color: var(--fq-emerald); font-weight: 900; font-size: 0.75rem; padding: 2px 8px;">
                        ✅ TERBUKA
                      </span>
                    </div>

                    <h3 style="font-size: 1.2rem; font-weight: 900; color: #fff; margin: 2px 0 4px 0;">${lvl.title}</h3>
                    <p style="font-size: 0.8rem; color: var(--fq-text-muted); line-height: 1.3; margin-bottom: 10px;">${lvl.focus}</p>
                  </div>

                  <div>
                    <button class="fq-btn fq-btn-cyan" style="width: 100%; min-height: 42px; font-size: 0.95rem; font-weight: 900; padding: 8px 14px;" onclick="window.FIVIAGroupLevelEngine.startLevel('${lvl.id}')">
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

  let currentGroupCount = 4;

  function setNumberOfGroups(num) {
    currentGroupCount = parseInt(num, 10) || 4;
    autoGroup();
    if (window.showToast) window.showToast(`Siswa kelas berhasil dibagi menjadi ${currentGroupCount} kelompok.`, "success");
  }

  function selectClass(classId) {
    if (window.FIVIAGroupPlay && typeof window.FIVIAGroupPlay.autoGroupStudents === 'function') {
      window.FIVIAGroupPlay.autoGroupStudents(classId, currentGroupCount);
    }
    renderLevelMapUI();
  }

  function autoGroup(numOverride) {
    const count = parseInt(numOverride, 10) || currentGroupCount || 4;
    if (window.FIVIAGroupPlay && typeof window.FIVIAGroupPlay.autoGroupStudents === 'function') {
      const state = window.FIVIAGroupPlay.getSessionState ? window.FIVIAGroupPlay.getSessionState() : {};
      window.FIVIAGroupPlay.autoGroupStudents(state.classroomId || 'cls_x1', count);
    }
    renderLevelMapUI();
  }

  let turnTimerInterval = null;
  let remainingSeconds = 120; // 2 minutes (120 seconds) timer per question
  let activeReboundGroup = null; // Group appointed for rebound turn
  let questionsAnsweredInLevel = 0; // Number of questions answered in current level round

  function syncGroupPlayScoreToRoster(group, scoreDelta, xpDelta) {
    if (!group || !group.members || !Array.isArray(group.members)) return;
    try {
      const rawRoster = localStorage.getItem('fivia_student_roster');
      let rosterList = rawRoster ? JSON.parse(rawRoster) : [];
      let dbStudents = (window.db && typeof window.db.getTable === 'function') ? window.db.getTable('students') || [] : [];

      group.members.forEach(m => {
        const mName = (m.studentName || m.name || '').trim().toLowerCase();
        const mCode = (m.studentCode || '').trim().toLowerCase();
        const mId = m.studentId || m.id;

        rosterList.forEach(s => {
          const sName = (s.name || '').trim().toLowerCase();
          const sCode = (s.studentCode || '').trim().toLowerCase();
          if ((mId && s.studentId === mId) || (mCode && sCode === mCode) || (mName && sName === mName)) {
            s.xp = Math.max(0, (s.xp || 0) + xpDelta);
            s.groupPlayScore = Math.max(0, (s.groupPlayScore || 0) + scoreDelta);
          }
        });

        dbStudents.forEach(s => {
          const sName = (s.name || '').trim().toLowerCase();
          const sCode = (s.studentCode || '').trim().toLowerCase();
          if ((mId && s.id === mId) || (mCode && sCode === mCode) || (mName && sName === mName)) {
            s.xp = Math.max(0, (s.xp || 0) + xpDelta);
            s.groupPlayScore = Math.max(0, (s.groupPlayScore || 0) + scoreDelta);
          }
        });
      });

      if (rosterList.length > 0) {
        localStorage.setItem('fivia_student_roster', JSON.stringify(rosterList));
      }
      if (dbStudents.length > 0 && window.db && typeof window.db.saveTable === 'function') {
        window.db.saveTable('students', dbStudents);
      }
    } catch (e) {
      console.warn("Sync Group Play score failed:", e);
    }
  }

  function startTurnTimer() {
    if (turnTimerInterval) clearInterval(turnTimerInterval);
    remainingSeconds = 120; // 2 minutes
    updateTimerClockUI();
    turnTimerInterval = setInterval(() => {
      remainingSeconds--;
      updateTimerClockUI();
      if (remainingSeconds <= 0) {
        clearInterval(turnTimerInterval);
        handleTurnTimeout();
      }
    }, 1000);
  }

  function updateTimerClockUI() {
    const clockEl = document.getElementById('fq-timer-clock');
    if (!clockEl) return;
    const mins = Math.floor(remainingSeconds / 60);
    const secs = remainingSeconds % 60;
    clockEl.innerText = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

    if (remainingSeconds > 30) {
      clockEl.style.color = 'var(--fq-cyan)';
    } else if (remainingSeconds > 10) {
      clockEl.style.color = 'var(--fq-amber)';
    } else {
      clockEl.style.color = 'var(--fq-rose)';
    }
  }

  function handleTurnTimeout() {
    if (turnTimerInterval) clearInterval(turnTimerInterval);
    const sessionState = (window.FIVIAGroupPlay && typeof window.FIVIAGroupPlay.getSessionState === 'function')
      ? window.FIVIAGroupPlay.getSessionState()
      : {};
    const currentGrp = activeReboundGroup || sessionState.activeGroup || { groupName: 'Kelompok' };
    
    showReboundSelectionUI(`⏱️ WAKTU 2 MENIT HABIS! ${currentGrp.groupName} kehabisan waktu pengerjaan.`);
  }

  function showReboundSelectionUI(reasonText) {
    if (turnTimerInterval) clearInterval(turnTimerInterval);

    const fb = document.getElementById('fq-gl-feedback');
    const opts = document.getElementById('fq-gl-options');
    if (!fb) return;

    const sessionState = (window.FIVIAGroupPlay && typeof window.FIVIAGroupPlay.getSessionState === 'function')
      ? window.FIVIAGroupPlay.getSessionState()
      : {};
    const groups = sessionState.groups || [];
    const currentGrpName = (activeReboundGroup ? activeReboundGroup.groupName : (sessionState.activeGroup ? sessionState.activeGroup.groupName : ''));

    const availableGroups = groups.filter(g => (g.groupName || g.groupId) !== currentGrpName);

    if (opts) opts.style.display = 'none';
    fb.style.display = 'block';
    fb.style.background = 'rgba(244,63,94,0.18)';
    fb.style.border = '2.5px solid var(--fq-rose)';

    let groupButtonsHtml = '';
    if (availableGroups.length === 0) {
      groupButtonsHtml = `<div style="color: #cbd5e1; font-weight: 700;">Tidak ada kelompok lain terdaftar.</div>`;
    } else {
      groupButtonsHtml = availableGroups.map((grp) => `
        <button class="fq-btn fq-btn-amber fq-btn-lg" style="min-height: 56px; font-size: 1.15rem; font-weight: 900; padding: 12px 20px; flex: 1; min-width: 220px;" onclick="window.FIVIAGroupLevelEngine.appointReboundGroup('${grp.groupId || grp.groupName}')">
          👉 TUNJUK ${grp.groupName} (POIN: ${grp.score || 0})
        </button>
      `).join('');
    }

    fb.innerHTML = `
      <div style="font-weight: 900; font-size: 1.35rem; color: var(--fq-rose); margin-bottom: 10px;">
        ❌ ${reasonText}
      </div>
      <div style="background: rgba(15,23,42,0.85); border: 2px solid var(--fq-amber); border-radius: 18px; padding: 18px; margin-bottom: 18px; text-align: left;">
        <h4 style="color: var(--fq-amber); margin: 0 0 8px 0; font-weight: 900; font-size: 1.15rem;"><i class="fas fa-hand-point-right"></i> TUNJUK KELOMPOK LAIN UNTUK MENJAWAB REBOUND:</h4>
        <p style="color: #e2e8f0; margin: 0 0 14px 0; font-size: 0.95rem; line-height: 1.4;">
          Kelompok saat ini berhak menunjuk kelompok lain untuk mencoba menjawab. <strong>⚠️ Perhatian: Jika BENAR mendapat +50 POIN, dan jika SALAH Poin Kelompok akan BERKURANG 50 POIN (-50 POIN)!</strong>
        </p>
        <div style="display: flex; gap: 12px; flex-wrap: wrap;">
          ${groupButtonsHtml}
        </div>
      </div>

      <button class="fq-btn fq-btn-outline" style="width: 100%; min-height: 48px; font-size: 1rem; font-weight: 800;" onclick="window.FIVIAGroupLevelEngine.nextTurn()">
        ⏭ LEWATI TANPA REBOUND &rarr;
      </button>
    `;
  }

  function appointReboundGroup(groupId) {
    const sessionState = (window.FIVIAGroupPlay && typeof window.FIVIAGroupPlay.getSessionState === 'function')
      ? window.FIVIAGroupPlay.getSessionState()
      : {};
    const groups = sessionState.groups || [];
    const targetGroup = groups.find(g => (g.groupId === groupId || g.groupName === groupId));
    if (!targetGroup) {
      alert('Kelompok tidak ditemukan.');
      return;
    }

    activeReboundGroup = targetGroup;
    renderActiveLevelBoardUI();
  }

  function startLevel(levelId) {
    if (turnTimerInterval) clearInterval(turnTimerInterval);
    activeReboundGroup = null;
    questionsAnsweredInLevel = 0;

    // 1. Ensure Group Play session is active with valid groups & active player
    if (window.FIVIAGroupPlay) {
      const gpState = typeof window.FIVIAGroupPlay.getSessionState === 'function' ? window.FIVIAGroupPlay.getSessionState() : {};
      if (!gpState.groups || gpState.groups.length === 0 || !gpState.activePlayer) {
        if (typeof window.FIVIAGroupPlay.startSession === 'function') {
          window.FIVIAGroupPlay.startSession(gpState.classroomId || 'cls_xf1');
        }
      } else {
        // Reset turn index to first group for new level round
        gpState.currentGroupIndex = 0;
        gpState.activeGroup = gpState.groups[0];
        const unplayed = (gpState.groups[0].members || []).filter(m => m.status !== 'PLAYED');
        gpState.activePlayer = unplayed.length > 0 ? unplayed[0] : gpState.groups[0].members[0];
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
      
      const mainGroup = sessionState.activeGroup || (sessionState.groups ? sessionState.groups[0] : null) || { groupName: 'KELOMPOK 1 (NEWTON)', score: 0 };
      const displayGroup = activeReboundGroup || mainGroup;
      const activePlayer = sessionState.activePlayer || (displayGroup.members ? displayGroup.members[0] : null) || { studentName: 'Siswa', studentCode: 'STD-001' };

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
          <div id="fq-gl-options" style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
            ${optsList.map((opt, i) => `
              <button class="fq-btn fq-btn-outline fq-btn-lg" style="min-height: 52px; padding: 10px 16px; font-size: 1.1rem; font-weight: 800; text-align: left; border-width: 2px;" onclick="window.FIVIAGroupLevelEngine.submitAnswer('${opt.id || String.fromCharCode(65 + i)}')">
                <strong style="color: var(--fq-amber); font-size: 1.2rem;">${opt.id || String.fromCharCode(65 + i)}.</strong> ${opt.label || opt.text || opt}
              </button>
            `).join('')}
          </div>
        `;
      } else if (qType === "multiple_select") {
        optionsUI = `
          <div id="fq-gl-options" style="display: flex; flex-direction: column; gap: 10px;">
            <div style="color: var(--fq-amber); font-weight: 800; font-size: 0.95rem;"><i class="fas fa-check-square"></i> Pilih SEMUA opsi jawaban yang BENAR:</div>
            ${(q.options || []).map((opt, i) => `
              <label style="background: rgba(15,23,42,0.8); border: 1.5px solid var(--fq-border-cyan); border-radius: 12px; padding: 10px 16px; display: flex; align-items: center; gap: 12px; cursor: pointer; font-size: 1.05rem; color: #fff; font-weight: 700;">
                <input type="checkbox" class="fq-ms-check" value="${i}" style="width: 20px; height: 20px; accent-color: var(--fq-cyan);" />
                <span><strong style="color: var(--fq-amber);">${opt.id || String.fromCharCode(65 + i)}.</strong> ${opt.label || opt.text || opt}</span>
              </label>
            `).join('')}
            <button class="fq-btn fq-btn-cyan" style="min-height: 48px; font-size: 1.1rem; font-weight: 900; margin-top: 6px;" onclick="window.FIVIAGroupLevelEngine.submitMultipleSelect()">
              🚀 KIRIM JAWABAN KOMPLEKS
            </button>
          </div>
        `;
      } else if (qType === "short_answer") {
        optionsUI = `
          <div id="fq-gl-options" style="background: rgba(15,23,42,0.8); border: 1.5px solid var(--fq-border-cyan); border-radius: 16px; padding: 16px;">
            <label style="display: block; color: var(--fq-cyan); font-weight: 900; font-size: 1rem; margin-bottom: 8px;"><i class="fas fa-keyboard"></i> KETIKKAN JAWABAN ISIAN SINGKAT:</label>
            <input type="text" id="fq-short-input" class="fq-select" style="width: 100%; min-height: 46px; font-size: 1.1rem; padding: 0 16px; background: #0f172a; color: #fff; border: 1.5px solid var(--fq-cyan); border-radius: 10px; margin-bottom: 12px;" placeholder="Ketikkan teks, simbol, atau angka jawaban..." />
            <button class="fq-btn fq-btn-cyan" style="width: 100%; min-height: 48px; font-size: 1.1rem; font-weight: 900;" onclick="window.FIVIAGroupLevelEngine.submitShortAnswer()">
              🚀 KIRIM JAWABAN ISIAN
            </button>
          </div>
        `;
      } else if (qType === "matching") {
        const pairs = q.pairs || [];
        const rightOptions = pairs.map(p => p.right);
        optionsUI = `
          <div id="fq-gl-options" style="display: flex; flex-direction: column; gap: 10px;">
            <div style="color: var(--fq-amber); font-weight: 800; font-size: 0.95rem;"><i class="fas fa-project-diagram"></i> Pasangkan elemen di sebelah kiri dengan jawaban di sebelah kanan:</div>
            ${pairs.map((p, i) => `
              <div style="display: grid; grid-template-columns: 1fr 1.2fr; gap: 12px; align-items: center; background: rgba(15,23,42,0.8); border: 1.5px solid var(--fq-border-cyan); border-radius: 12px; padding: 10px 14px;">
                <div style="font-weight: 800; color: #fff; font-size: 0.95rem;">${i + 1}. ${p.left}</div>
                <div>
                  <select class="fq-matching-select fq-select" data-pair-idx="${i}" style="width: 100%; min-height: 40px; font-size: 0.95rem; background: #0f172a; color: #fff; border: 1.5px solid var(--fq-cyan); border-radius: 8px; padding: 0 10px; font-weight: 700;">
                    <option value="">-- Pilih Pasangan --</option>
                    ${rightOptions.map(rOpt => `<option value="${rOpt.replace(/"/g, '&quot;')}">${rOpt}</option>`).join('')}
                  </select>
                </div>
              </div>
            `).join('')}
            <button class="fq-btn fq-btn-cyan" style="min-height: 48px; font-size: 1.1rem; font-weight: 900; margin-top: 6px;" onclick="window.FIVIAGroupLevelEngine.submitMatching()">
              🚀 KIRIM JAWABAN PENCOCOKAN
            </button>
          </div>
        `;
      }

      const groups = sessionState.groups || [];

      const html = `
        <div style="background: rgba(15, 23, 42, 0.98); border: 2.5px solid ${meta.color || '#06b6d4'}; border-radius: 24px; padding: 16px 22px; text-align: left; box-shadow: 0 0 40px rgba(6,182,212,0.25);">
          <!-- Smartboard Level Top Header Bar -->
          <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid var(--fq-border-cyan); padding-bottom: 10px; margin-bottom: 10px; flex-wrap: wrap; gap: 10px;">
            <div>
              <span class="fq-badge-pill" style="border-color: ${meta.color || '#06b6d4'}; color: ${meta.color || '#06b6d4'}; font-size: 0.82rem; padding: 4px 12px; margin-bottom: 4px;">
                ${meta.badge || '🟢'} ${meta.code} &bull; ${meta.title}
              </span>
              <h2 style="font-size: 1.5rem; font-weight: 900; color: #fff; margin: 4px 0 0 0;">👥 GILIRAN: <strong style="color: var(--fq-amber);">${displayGroup.groupName || 'KELOMPOK 1'}</strong></h2>
            </div>

            <div style="display: flex; align-items: center; gap: 10px; flex-wrap: wrap;">
              <button class="fq-btn fq-fullscreen-toggle-btn" style="min-height: 38px; padding: 4px 12px; font-size: 0.8rem; background: rgba(6,182,212,0.2); border: 1.5px solid var(--fq-cyan); color: #6ee7b7; font-weight: 900;" onclick="window.toggleFullScreen()"><i class="fas fa-expand"></i> ⛶ FULL SCREEN</button>
              <button class="fq-btn fq-bgm-toggle-btn" style="min-height: 38px; padding: 4px 12px; font-size: 0.8rem; background: rgba(16,185,129,0.2); border: 1.5px solid var(--fq-emerald); color: #6ee7b7; font-weight: 900;" onclick="window.toggleBGM()"><i class="fas fa-music"></i> 🎵 BGM: ON</button>
              <!-- 2-MINUTE COUNTDOWN TIMER BADGE -->
              <div style="background: rgba(15,23,42,0.9); border: 2px solid var(--fq-cyan); border-radius: 14px; padding: 4px 16px; text-align: center; box-shadow: 0 0 15px rgba(6,182,212,0.25);">
                <div style="font-size: 0.65rem; color: var(--fq-cyan); font-weight: 800; letter-spacing: 1px;">⏱️ SISA WAKTU</div>
                <div id="fq-timer-clock" style="font-size: 1.4rem; font-weight: 900; color: var(--fq-cyan); font-family: monospace; line-height: 1.1;">02:00</div>
              </div>

              <div style="background: rgba(30,41,59,0.9); border: 1.5px solid var(--fq-rose); border-radius: 14px; padding: 6px 14px; text-align: center;">
                <div style="font-size: 0.68rem; color: var(--fq-text-muted); font-weight: 800;">TEAM LIVES</div>
                <div style="font-size: 1.2rem;">${livesHtml}</div>
              </div>

              ${(state.comboStreak || 0) > 1 ? `
                <div style="background: rgba(30,41,59,0.9); border: 1.5px solid var(--fq-amber); border-radius: 14px; padding: 6px 14px; text-align: center;">
                  <div style="font-size: 0.68rem; color: var(--fq-amber); font-weight: 800;">STREAK</div>
                  <div style="font-size: 1.1rem; font-weight: 900; color: var(--fq-amber);">🔥 x${state.comboStreak}</div>
                </div>
              ` : ''}

              <button class="fq-btn fq-btn-outline" style="min-height: 38px; padding: 6px 14px; font-size: 0.85rem; font-weight: 800;" onclick="window.FIVIAGroupLevelEngine.renderLevelMapUI()"><i class="fas fa-map"></i> PETA KELOMPOK</button>
            </div>
          </div>

          <!-- GROUP SCORES REAL-TIME LEADERBOARD BAR -->
          <div style="background: rgba(30,41,59,0.85); border: 1.5px solid var(--fq-border-cyan); border-radius: 14px; padding: 6px 14px; margin-bottom: 10px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px;">
            <div style="font-weight: 900; color: var(--fq-amber); font-size: 0.85rem;"><i class="fas fa-trophy"></i> POIN KELOMPOK:</div>
            <div style="display: flex; gap: 8px; flex-wrap: wrap;">
              ${groups.map(g => `
                <div style="background: ${displayGroup.groupName === g.groupName ? 'rgba(6,182,212,0.3)' : 'rgba(15,23,42,0.7)'}; border: 1px solid ${displayGroup.groupName === g.groupName ? 'var(--fq-cyan)' : 'var(--fq-border-cyan)'}; border-radius: 10px; padding: 4px 10px; font-size: 0.82rem; font-weight: 800; color: #fff;">
                  ${g.groupName}: <span style="color: ${(g.score || 0) < 0 ? 'var(--fq-rose)' : 'var(--fq-amber)'};">${g.score || 0} pts</span>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- REBOUND TURN WARNING BANNER -->
          ${activeReboundGroup ? `
            <div style="background: rgba(245,158,11,0.2); border: 2px solid var(--fq-amber); border-radius: 14px; padding: 10px; text-align: center; margin-bottom: 10px; box-shadow: 0 0 20px rgba(245,158,11,0.25);">
              <div style="font-size: 1.1rem; font-weight: 900; color: var(--fq-amber); margin-bottom: 2px;">
                👉 DITUNJUK UNTUK MENJAWAB REBOUND: <span style="color: #fff;">${activeReboundGroup.groupName}</span>
              </div>
              <div style="font-size: 0.85rem; color: #e2e8f0; font-weight: 700;">
                ⚠️ Perhatian: Jika BENAR +50 POIN, dan jika SALAH Poin Kelompok berkurang 50 Poin (-50 POIN).
              </div>
            </div>
          ` : ''}

          <!-- LEVEL 05 PHYSICS BOSS HP BAR OVERLAY -->
          ${state.activeLevelId === 'LEVEL_05' ? `
            <div style="background: rgba(225,29,72,0.2); border: 2px solid var(--fq-rose); border-radius: 14px; padding: 10px; text-align: center; margin-bottom: 10px;">
              <div style="display: flex; justify-content: space-between; font-weight: 900; color: var(--fq-rose); font-size: 0.95rem; margin-bottom: 4px;">
                <span>👾 MECHA PHYSICS BOSS</span>
                <span>${bossHP} / 100 HP</span>
              </div>
              <div style="width: 100%; background: rgba(15,23,42,0.8); height: 14px; border-radius: 7px; overflow: hidden; border: 1px solid var(--fq-rose);">
                <div style="width: ${bossHP}%; background: linear-gradient(90deg, #f43f5e, #fb7185); height: 100%; transition: width 0.5s ease;"></div>
              </div>
            </div>
          ` : ''}

          <!-- PLAYER TURN BANNER -->
          <div style="background: linear-gradient(135deg, rgba(139,92,246,0.25), rgba(6,182,212,0.25)); border: 2px solid var(--fq-cyan); border-radius: 16px; padding: 8px 16px; text-align: center; margin-bottom: 10px;">
            <div style="font-size: 0.8rem; font-weight: 900; color: var(--fq-amber); letter-spacing: 1.5px; text-transform: uppercase;">
              🎯 ${activeReboundGroup ? 'REBOUND TURN! MENJAWAB SOAL' : 'GILIRANMU! MAJU KE PAPAN INTERAKTIF'}
            </div>
            <h1 style="font-size: 1.6rem; font-weight: 900; color: #fff; margin: 1px 0;">
              👨‍🎓 ${activePlayer.studentName || 'Siswa'}
            </h1>
            <div style="font-size: 0.85rem; color: var(--fq-cyan); font-weight: 800;">
              👥 ${displayGroup.groupName || 'Kelompok 1'} &bull; TYPE: <span style="color:var(--fq-amber);">${typeBadgeLabel}</span>
            </div>
          </div>

          <!-- Minigame Interactive Challenge Card Display -->
          <div style="background: rgba(30,41,59,0.85); border: 2px solid var(--fq-border-cyan); border-radius: 16px; padding: 14px 18px; margin-bottom: 10px;">
            <div style="font-size: 1.15rem; font-weight: 800; color: #fff; line-height: 1.35; margin-bottom: 12px; whitespace: pre-line;">
              ${q.question}
            </div>

            <div id="fq-gl-feedback" style="display: none; margin-bottom: 12px; padding: 14px; border-radius: 14px; font-size: 1rem;"></div>

            ${optionsUI}
          </div>

          <!-- Teacher Controller Floating Overlay Bar -->
          <div style="background: rgba(15,23,42,0.9); border: 1.5px solid var(--fq-border-cyan); border-radius: 14px; padding: 8px 14px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px;">
            <div style="font-weight: 800; color: #fff; font-size: 0.88rem;">
              🎮 CONTROLLER GURU: <span style="color: var(--fq-cyan);">${activePlayer.studentName || 'Siswa'} (${displayGroup.groupName || 'Kelompok 1'})</span>
            </div>
            <div style="display: flex; gap: 8px; flex-wrap: wrap;">
              <button class="fq-btn fq-btn-emerald" style="min-height: 38px; padding: 4px 10px; font-size: 0.82rem;" onclick="window.FIVIAGroupLevelEngine.openTeacherQuestionBankModal()"><i class="fas fa-key"></i> 🔑 KUNCI JAWABAN</button>
              <button class="fq-btn fq-btn-emerald" style="min-height: 38px; padding: 4px 10px; font-size: 0.82rem;" onclick="if(window.FIVIAGroupLevels) window.FIVIAGroupLevels.addTeamLife(); window.FIVIAGroupLevelEngine.renderActiveLevelBoardUI();"><i class="fas fa-heart"></i> ❤️ +1 LIFE</button>
              <button class="fq-btn fq-btn-amber" style="min-height: 38px; padding: 4px 10px; font-size: 0.82rem;" onclick="window.FIVIAGroupLevelEngine.skipTurn()"><i class="fas fa-step-forward"></i> ⏭ LEWATI</button>
              <button class="fq-btn fq-btn-outline" style="min-height: 38px; padding: 4px 10px; font-size: 0.82rem;" onclick="window.FIVIAGroupLevelEngine.renderActiveLevelBoardUI()"><i class="fas fa-redo"></i> 🔄 ULANGI</button>
              <button class="fq-btn fq-btn-danger" style="min-height: 38px; padding: 4px 10px; font-size: 0.82rem;" onclick="window.FIVIAGroupLevelEngine.renderLevelMapUI()"><i class="fas fa-stop-circle"></i> 🏁 KELUAR</button>
            </div>
          </div>
        </div>
      `;

      renderToContainers(html);
      startTurnTimer();
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
    if (turnTimerInterval) clearInterval(turnTimerInterval);

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

    const sessionState = (window.FIVIAGroupPlay && typeof window.FIVIAGroupPlay.getSessionState === 'function')
      ? window.FIVIAGroupPlay.getSessionState()
      : {};

    const isRebound = !!activeReboundGroup;
    const currentGrp = activeReboundGroup || sessionState.activeGroup || (sessionState.groups ? sessionState.groups[0] : null) || { groupName: 'Kelompok 1' };

    if (isRebound) {
      opts.style.display = 'none';
      fb.style.display = 'block';

      if (isCorrect) {
        playEnergeticSound('correct');
        currentGrp.score = (currentGrp.score || 0) + 50;
        currentGrp.totalXP = (currentGrp.totalXP || 0) + 50;
        localStorage.setItem("fivia_group_play_session", JSON.stringify(sessionState));
        syncGroupPlayScoreToRoster(currentGrp, 50, 15);

        fb.style.background = 'rgba(16,185,129,0.18)';
        fb.style.border = '2.5px solid var(--fq-emerald)';
        fb.innerHTML = `
          <div style="font-weight: 900; font-size: 1.4rem; color: var(--fq-emerald); margin-bottom: 8px;">
            🎉 REBOUND BENAR! ${currentGrp.groupName} MENDAPATKAN +50 POIN KELOMPOK!
          </div>
          <p style="color: #fff; margin: 0 0 16px 0; font-size: 1.05rem; line-height: 1.4;">${q.explanation}</p>
          <div style="font-size: 1.1rem; color: var(--fq-cyan); font-weight: 800; margin-bottom: 16px;">
            🏆 TOTAL POIN ${currentGrp.groupName}: ${currentGrp.score} POIN
          </div>
          <button class="fq-btn fq-btn-cyan fq-btn-lg" style="width: 100%; min-height: 56px; font-size: 1.15rem;" onclick="window.FIVIAGroupLevelEngine.nextTurn()">
            ▶ LANJUTKAN KE KELOMPOK SELANJUTNYA &rarr;
          </button>
        `;
      } else {
        playEnergeticSound('wrong');
        // -50 Point Penalty for wrong rebound answer
        currentGrp.score = (currentGrp.score || 0) - 50;
        localStorage.setItem("fivia_group_play_session", JSON.stringify(sessionState));
        syncGroupPlayScoreToRoster(currentGrp, -50, 0);

        fb.style.background = 'rgba(244,63,94,0.18)';
        fb.style.border = '2.5px solid var(--fq-rose)';
        fb.innerHTML = `
          <div style="font-weight: 900; font-size: 1.4rem; color: var(--fq-rose); margin-bottom: 8px;">
            ❌ JAWABAN REBOUND SALAH! POIN ${currentGrp.groupName} BERKURANG 50 POIN (-50 POIN)!
          </div>
          <p style="color: #fff; margin: 0 0 16px 0; font-size: 1.05rem; line-height: 1.4;">${q.explanation}</p>
          <div style="font-size: 1.1rem; color: var(--fq-rose); font-weight: 800; margin-bottom: 16px;">
            ⚠️ TOTAL POIN ${currentGrp.groupName} SEKARANG: ${currentGrp.score} POIN (-50)
          </div>
          <button class="fq-btn fq-btn-cyan fq-btn-lg" style="width: 100%; min-height: 56px; font-size: 1.15rem;" onclick="window.FIVIAGroupLevelEngine.nextTurn()">
            ▶ LANJUTKAN KE KELOMPOK SELANJUTNYA &rarr;
          </button>
        `;
      }

      activeReboundGroup = null;
      return;
    }

    // MAIN TURN EVALUATION
    const result = window.FIVIAGroupLevels.registerAnswerResult(isCorrect);

    if (isCorrect) {
      playEnergeticSound('correct');
      currentGrp.score = (currentGrp.score || 0) + 100;
      currentGrp.totalXP = (currentGrp.totalXP || 0) + 100;
      localStorage.setItem("fivia_group_play_session", JSON.stringify(sessionState));
      syncGroupPlayScoreToRoster(currentGrp, 100, 25);

      if (window.FIVIAStudent && typeof window.FIVIAStudent.addXP === 'function') {
        window.FIVIAStudent.addXP(25);
      }

      fb.style.display = 'block';
      fb.style.background = 'rgba(16,185,129,0.18)';
      fb.style.border = '2.5px solid var(--fq-emerald)';
      fb.innerHTML = `
        <div style="font-weight: 900; font-size: 1.4rem; color: var(--fq-emerald); margin-bottom: 8px;">
          🎉 JAWABAN BENAR! +100 POIN UNTUK ${currentGrp.groupName}! ${result.comboStreak > 1 ? '(🔥 COMBO x' + result.comboStreak + '!)' : ''}
        </div>
        <p style="color: #fff; margin: 0 0 16px 0; font-size: 1.05rem; line-height: 1.4;">${q.explanation}</p>
        <button class="fq-btn fq-btn-cyan fq-btn-lg" style="width: 100%; min-height: 56px; font-size: 1.15rem;" onclick="window.FIVIAGroupLevelEngine.nextTurn()">
          ▶ LANJUTKAN KE KELOMPOK SELANJUTNYA &rarr;
        </button>
      `;
      opts.style.display = 'none';
    } else {
      playEnergeticSound('wrong');
      showReboundSelectionUI("JAWABAN KELOMPOK BELUM TEPAT!");
    }
  }

  function renderLevelCompletionUI() {
    if (turnTimerInterval) clearInterval(turnTimerInterval);

    const state = window.FIVIAGroupLevels ? window.FIVIAGroupLevels.getLevelState() : { activeLevelId: 'LEVEL_01' };
    const sessionState = (window.FIVIAGroupPlay && typeof window.FIVIAGroupPlay.getSessionState === 'function')
      ? window.FIVIAGroupPlay.getSessionState()
      : {};
    const groups = sessionState.groups || [];
    const sortedGroups = [...groups].sort((a, b) => (b.score || 0) - (a.score || 0));

    // Determine next level
    const levelOrder = ['LEVEL_01', 'LEVEL_02', 'LEVEL_03', 'LEVEL_04', 'LEVEL_05'];
    const currentIdx = levelOrder.indexOf(state.activeLevelId);
    const nextLevelId = (currentIdx >= 0 && currentIdx < levelOrder.length - 1) ? levelOrder[currentIdx + 1] : null;

    const activeMeta = (window.FIVIAGroupLevels && typeof window.FIVIAGroupLevels.getLevelMetadata === 'function')
      ? window.FIVIAGroupLevels.getLevelMetadata(state.activeLevelId)
      : { code: state.activeLevelId || 'LEVEL 01', title: 'LEVEL', focus: '' };

    const nextMeta = (nextLevelId && window.FIVIAGroupLevels && typeof window.FIVIAGroupLevels.getLevelMetadata === 'function')
      ? window.FIVIAGroupLevels.getLevelMetadata(nextLevelId)
      : null;

    const html = `
      <div style="background: rgba(15, 23, 42, 0.98); border: 3.5px solid var(--fq-cyan); border-radius: 32px; padding: 36px; text-align: center; box-shadow: 0 0 60px rgba(6,182,212,0.3); position: relative; overflow: hidden;">
        <div style="font-size: 3rem; margin-bottom: 8px;">🏆</div>
        <h1 style="font-size: 2.4rem; font-weight: 900; color: #fff; margin: 0 0 8px 0;">BABAK ${activeMeta.code || 'LEVEL'} SELESAI!</h1>
        
        <!-- KETERANGAN LEVEL -->
        <div style="display: inline-flex; align-items: center; gap: 8px; background: rgba(6,182,212,0.15); border: 1.5px solid var(--fq-cyan); border-radius: 99px; padding: 6px 20px; color: var(--fq-cyan); font-weight: 800; font-size: 1.05rem; margin-bottom: 12px;">
          <span>${activeMeta.badge || '🟢'}</span>
          <span>${activeMeta.title || ''}</span>
        </div>
        <p style="font-size: 0.95rem; color: #cbd5e1; max-width: 650px; margin: 0 auto 20px auto; line-height: 1.5; background: rgba(30,41,59,0.6); padding: 10px 18px; border-radius: 14px; border: 1px solid var(--fq-border-cyan);">
          📌 <strong>Keterangan Level:</strong> ${activeMeta.focus || 'Penguasaan materi fisika interaktif kelompok.'}
        </p>

        <p style="font-size: 1.1rem; color: var(--fq-cyan); font-weight: 800; margin-bottom: 24px;">
          Setiap kelompok telah menyelesaikan 1 soal pada level ini! Berikut hasil skor klasemen akhir:
        </p>

        <!-- KLASEMEN SKOR KELOMPOK -->
        <div style="background: rgba(30,41,59,0.9); border: 2.5px solid var(--fq-border-cyan); border-radius: 24px; padding: 24px; margin-bottom: 32px; text-align: left;">
          <h3 style="color: var(--fq-amber); font-weight: 900; font-size: 1.3rem; margin: 0 0 16px 0;"><i class="fas fa-award"></i> KLASEMEN SKOR PERMAINAN KELOMPOK:</h3>
          <div style="display: flex; flex-direction: column; gap: 12px;">
            ${sortedGroups.map((grp, rank) => `
              <div style="background: rgba(15,23,42,0.7); border: 2px solid ${rank === 0 ? 'var(--fq-amber)' : 'var(--fq-border-cyan)'}; border-radius: 16px; padding: 16px 24px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">
                <div style="display: flex; align-items: center; gap: 14px;">
                  <span style="font-size: 1.5rem; font-weight: 900; color: ${rank === 0 ? 'var(--fq-amber)' : rank === 1 ? '#cbd5e1' : rank === 2 ? '#cd7f32' : '#94a3b8'};">
                    ${rank === 0 ? '🥇' : rank === 1 ? '🥈' : rank === 2 ? '🥉' : '#' + (rank + 1)}
                  </span>
                  <div>
                    <h4 style="color: #fff; margin: 0; font-size: 1.2rem; font-weight: 900;">${grp.groupName}</h4>
                    <div style="font-size: 0.85rem; color: var(--fq-cyan);">${(grp.members || []).length} Siswa Terdaftar</div>
                  </div>
                </div>
                <div style="font-size: 1.5rem; font-weight: 900; color: ${(grp.score || 0) < 0 ? 'var(--fq-rose)' : 'var(--fq-emerald)'};">
                  ${grp.score || 0} POIN
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- ACTION BUTTONS -->
        <div style="display: flex; gap: 14px; justify-content: center; flex-wrap: wrap;">
          ${nextLevelId ? `
            <button class="fq-btn fq-btn-emerald fq-btn-lg" style="min-height: 56px; padding: 0 28px; font-size: 1.15rem; font-weight: 900; background: linear-gradient(135deg, #10b981 0%, #059669 100%); border: 2px solid #34d399; box-shadow: 0 0 25px rgba(16,185,129,0.4);" onclick="window.FIVIAGroupLevelEngine.startLevel('${nextLevelId}')">
              ▶ LANJUT KE LEVEL SELANJUTNYA ${nextMeta ? `(${nextMeta.code})` : ''} &rarr;
            </button>
          ` : ''}

          <button class="fq-btn fq-btn-amber fq-btn-lg" style="min-height: 56px; padding: 0 28px; font-size: 1.15rem; font-weight: 900; background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); border: 2px solid #fbbf24; box-shadow: 0 0 25px rgba(245,158,11,0.5);" onclick="window.FIVIAGroupLevelEngine.renderGrandWinnerUI()">
            👑 UMUMKAN PEMENANG PERMAINAN 🏆
          </button>

          <button class="fq-btn fq-btn-cyan fq-btn-lg" style="min-height: 56px; padding: 0 24px; font-size: 1.1rem; font-weight: 900;" onclick="window.FIVIAGroupLevelEngine.startLevel('${state.activeLevelId}')">
            🔄 MAINKAN ULANG LEVEL INI
          </button>

          <button class="fq-btn fq-btn-outline fq-btn-lg" style="min-height: 56px; padding: 0 24px; font-size: 1.1rem; font-weight: 900;" onclick="window.FIVIAGroupLevelEngine.renderLevelMapUI()">
            🗺️ KEMBALI KE PETA LEVEL
          </button>
        </div>
      </div>
    `;

    renderToContainers(html);
  }

  // ENERGETIC AUDIO & BGM SYNTHESIZER
  let bgmIntervalId = null;

  function getAudioCtx() {
    if (!window.fiviaAudioCtx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) window.fiviaAudioCtx = new AudioCtx();
    }
    if (window.fiviaAudioCtx && window.fiviaAudioCtx.state === 'suspended') {
      window.fiviaAudioCtx.resume();
    }
    return window.fiviaAudioCtx;
  }

  function playEnergeticSound(type) {
    try {
      const ctx = getAudioCtx();
      if (!ctx) return;
      const now = ctx.currentTime;

      if (type === 'correct') {
        // Bright, energetic 5-note ascending arpeggio (C5 -> E5 -> G5 -> C6 -> E6)
        const freqs = [523.25, 659.25, 783.99, 1046.50, 1318.51];
        freqs.forEach((f, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(f, now + idx * 0.06);
          gain.gain.setValueAtTime(0.24, now + idx * 0.06);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.22);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + idx * 0.06);
          osc.stop(now + idx * 0.06 + 0.22);
        });
      } else if (type === 'wrong') {
        // Dramatic low buzz tone dropping rapidly (320Hz -> 110Hz)
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(320, now);
        osc.frequency.linearRampToValueAtTime(110, now + 0.35);
        gain.gain.setValueAtTime(0.28, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.35);
      } else if (type === 'win' || type === 'fanfare') {
        playFestiveFanfare();
      } else if (type === 'click') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(587.33, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.06);
        gain.gain.setValueAtTime(0.18, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.06);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.06);
      }
    } catch(e) {
      console.warn("Audio playback error:", e);
    }
  }

  function startBGM() {
    if (bgmIntervalId) return;
    if (localStorage.getItem('fivia_bgm_muted') === 'true') return;

    let step = 0;
    const bgmNotes = [
      [261.63, 329.63, 392.00], // C major
      [293.66, 369.99, 440.00], // G major
      [220.00, 261.63, 329.63], // A minor
      [174.61, 220.00, 261.63]  // F major
    ];

    bgmIntervalId = setInterval(() => {
      if (localStorage.getItem('fivia_bgm_muted') === 'true') {
        stopBGM();
        return;
      }
      try {
        const ctx = getAudioCtx();
        if (!ctx) return;
        const now = ctx.currentTime;
        const chord = bgmNotes[step % bgmNotes.length];

        chord.forEach(freq => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now);
          gain.gain.setValueAtTime(0.03, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 0.6);
        });

        // Upbeat rhythm bass pulse
        const bassOsc = ctx.createOscillator();
        const bassGain = ctx.createGain();
        bassOsc.type = 'triangle';
        bassOsc.frequency.setValueAtTime(chord[0] / 2, now);
        bassGain.gain.setValueAtTime(0.05, now);
        bassGain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
        bassOsc.connect(bassGain);
        bassGain.connect(ctx.destination);
        bassOsc.start(now);
        bassOsc.stop(now + 0.3);

        step++;
      } catch(e) {}
    }, 700);
  }

  function stopBGM() {
    if (bgmIntervalId) {
      clearInterval(bgmIntervalId);
      bgmIntervalId = null;
    }
  }

  function toggleBGM() {
    const isMuted = localStorage.getItem('fivia_bgm_muted') === 'true';
    if (isMuted) {
      localStorage.setItem('fivia_bgm_muted', 'false');
      startBGM();
      playEnergeticSound('click');
    } else {
      localStorage.setItem('fivia_bgm_muted', 'true');
      stopBGM();
    }
    updateBgmToggleButtons();
  }

  function updateBgmToggleButtons() {
    const isMuted = localStorage.getItem('fivia_bgm_muted') === 'true';
    const btns = document.querySelectorAll('.fq-bgm-toggle-btn');
    btns.forEach(btn => {
      btn.innerHTML = isMuted ? '🔇 BGM: OFF' : '🎵 BGM: ON';
      btn.style.background = isMuted ? 'rgba(244,63,94,0.2)' : 'rgba(16,185,129,0.2)';
      btn.style.borderColor = isMuted ? 'var(--fq-rose)' : 'var(--fq-emerald)';
      btn.style.color = isMuted ? '#fda4af' : '#6ee7b7';
    });
  }

  window.playEnergeticSound = playEnergeticSound;
  window.toggleBGM = toggleBGM;
  window.startBGM = startBGM;
  window.stopBGM = stopBGM;

  // FULLSCREEN TOGGLE & NO-SCROLL HANDLER
  function toggleFullScreen() {
    if (!document.fullscreenElement && !document.webkitFullscreenElement && !document.mozFullScreenElement && !document.msFullscreenElement) {
      const docEl = document.documentElement;
      if (docEl.requestFullscreen) docEl.requestFullscreen();
      else if (docEl.webkitRequestFullscreen) docEl.webkitRequestFullscreen();
      else if (docEl.mozRequestFullScreen) docEl.mozRequestFullScreen();
      else if (docEl.msRequestFullscreen) docEl.msRequestFullscreen();
    } else {
      if (document.exitFullscreen) document.exitFullscreen();
      else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
      else if (document.mozCancelFullScreen) document.mozCancelFullScreen();
      else if (document.msExitFullscreen) document.msExitFullscreen();
    }
  }

  function updateFullscreenUI() {
    const isFS = !!(document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement);
    if (isFS) {
      document.body.classList.add('fq-fullscreen-active');
    } else {
      document.body.classList.remove('fq-fullscreen-active');
    }
    const btns = document.querySelectorAll('.fq-fullscreen-toggle-btn');
    btns.forEach(btn => {
      btn.innerHTML = isFS ? '<i class="fas fa-compress"></i> <span>⛶ KELUAR FULLSCREEN</span>' : '<i class="fas fa-expand"></i> <span>⛶ FULL SCREEN</span>';
      btn.style.background = isFS ? 'rgba(245,158,11,0.25)' : 'rgba(6,182,212,0.2)';
      btn.style.borderColor = isFS ? 'var(--fq-amber)' : 'var(--fq-cyan)';
      btn.style.color = isFS ? '#fef08a' : '#6ee7b7';
    });
  }

  document.addEventListener('fullscreenchange', updateFullscreenUI);
  document.addEventListener('webkitfullscreenchange', updateFullscreenUI);
  document.addEventListener('mozfullscreenchange', updateFullscreenUI);
  document.addEventListener('MSFullscreenChange', updateFullscreenUI);

  window.toggleFullScreen = toggleFullScreen;

  function playFestiveFanfare() {
    try {
      const ctx = getAudioCtx();
      if (!ctx) return;
      const notes = [
        { f: 523.25, t: 0, d: 0.15 },   // C5
        { f: 659.25, t: 0.15, d: 0.15 }, // E5
        { f: 783.99, t: 0.3, d: 0.15 },  // G5
        { f: 1046.50, t: 0.45, d: 0.55 } // C6
      ];
      notes.forEach(n => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.value = n.f;
        gain.gain.setValueAtTime(0.3, ctx.currentTime + n.t);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + n.t + n.d);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + n.t);
        osc.stop(ctx.currentTime + n.t + n.d);
      });
    } catch(e) {
      console.warn("Audio Context sound failed:", e);
    }
  }

  function launchFestiveConfetti() {
    const canvas = document.getElementById('fq-festive-confetti-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.parentElement ? canvas.parentElement.offsetWidth : window.innerWidth;
    canvas.height = canvas.parentElement ? canvas.parentElement.offsetHeight : 600;

    const colors = ['#f59e0b', '#06b6d4', '#10b981', '#ec4899', '#8b5cf6', '#fef08a'];
    const particles = [];

    for (let i = 0; i < 90; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height - canvas.height,
        size: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        vx: (Math.random() - 0.5) * 3,
        vy: Math.random() * 3 + 2,
        rot: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 10
      });
    }

    let animationId;
    let frames = 0;

    function animate() {
      if (frames > 400 || !document.getElementById('fq-festive-confetti-canvas')) {
        if (animationId) cancelAnimationFrame(animationId);
        return;
      }
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.rotSpeed;

        if (p.y > canvas.height) {
          p.y = -20;
          p.x = Math.random() * canvas.width;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rot * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        ctx.restore();
      });

      frames++;
      animationId = requestAnimationFrame(animate);
    }
    animate();
  }

  function renderGrandWinnerUI() {
    if (turnTimerInterval) clearInterval(turnTimerInterval);

    const sessionState = (window.FIVIAGroupPlay && typeof window.FIVIAGroupPlay.getSessionState === 'function')
      ? window.FIVIAGroupPlay.getSessionState()
      : {};
    const groups = sessionState.groups || [];
    const sortedGroups = [...groups].sort((a, b) => (b.score || 0) - (a.score || 0));

    const champ = sortedGroups[0] || { groupName: 'Belum Ada Kelompok', score: 0, members: [] };
    const second = sortedGroups[1] || null;
    const third = sortedGroups[2] || null;
    const restGroups = sortedGroups.slice(3);

    playFestiveFanfare();
    setTimeout(() => { launchFestiveConfetti(); }, 100);

    const html = `
      <style>
        @keyframes fqWinnerPulse {
          0% { box-shadow: 0 0 30px rgba(245,158,11,0.5); transform: scale(1); }
          50% { box-shadow: 0 0 60px rgba(245,158,11,0.9); transform: scale(1.02); }
          100% { box-shadow: 0 0 30px rgba(245,158,11,0.5); transform: scale(1); }
        }
        @keyframes fqBouncer {
          0% { transform: translateY(0); }
          100% { transform: translateY(-10px); }
        }
      </style>
      <div style="background: radial-gradient(circle at 50% 20%, rgba(245, 158, 11, 0.25), rgba(15, 23, 42, 0.98) 75%); border: 4px solid var(--fq-amber); border-radius: 36px; padding: 40px 28px; text-align: center; box-shadow: 0 0 80px rgba(245,158,11,0.5); position: relative; overflow: hidden;">
        
        <!-- CANVAS FOR CONFETTI IN CONTAINER -->
        <canvas id="fq-festive-confetti-canvas" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 10;"></canvas>

        <!-- CELEBRATION HEADER -->
        <div style="position: relative; z-index: 20;">
          <div style="font-size: 4rem; animation: fqBouncer 1s infinite alternate ease-in-out; margin-bottom: 4px;">👑 🏆 👑</div>
          <h1 style="font-size: 2.8rem; font-weight: 900; background: linear-gradient(135deg, #fbbf24, #f59e0b, #fef08a); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin: 0 0 6px 0; text-transform: uppercase; letter-spacing: 1px;">
            PENGUMUMAN PEMENANG UTAMA!
          </h1>
          <p style="font-size: 1.2rem; color: var(--fq-cyan); font-weight: 800; margin-bottom: 36px;">
            🎉 Selamat kepada para Juara FIVIA Group Play Physics Championship! 🎉
          </p>

          <!-- 3D PODIUM STAGE (JUARA 1, 2, 3) -->
          <div style="display: flex; justify-content: center; align-items: flex-end; gap: 16px; margin-bottom: 36px; flex-wrap: wrap;">
            
            <!-- JUARA 2 (LEFT PODIUM) -->
            ${second ? `
              <div style="flex: 1; min-width: 220px; max-width: 260px; background: linear-gradient(180deg, rgba(51,65,85,0.9), rgba(15,23,42,0.95)); border: 2.5px solid #cbd5e1; border-radius: 24px; padding: 20px 16px; box-shadow: 0 0 30px rgba(203,213,225,0.3); transform: translateY(12px);">
                <div style="font-size: 2.5rem; margin-bottom: 4px;">🥈</div>
                <span style="background: #cbd5e1; color: #0f172a; font-weight: 900; font-size: 0.85rem; padding: 4px 14px; border-radius: 99px; display: inline-block; margin-bottom: 8px;">JUARA 2</span>
                <h3 style="color: #fff; font-size: 1.3rem; font-weight: 900; margin: 4px 0;">${second.groupName}</h3>
                <div style="font-size: 1.6rem; font-weight: 900; color: #cbd5e1; margin-bottom: 10px;">${second.score || 0} POIN</div>
                <div style="font-size: 0.82rem; color: #94a3b8; text-align: left; background: rgba(0,0,0,0.3); padding: 8px 12px; border-radius: 12px; max-height: 90px; overflow-y: auto;">
                  ${(second.members || []).map((m, i) => `<div>${i+1}. ${m.studentName || m}</div>`).join('')}
                </div>
              </div>
            ` : ''}

            <!-- JUARA 1 (CENTER PODIUM - HIGHEST & GLOWING) -->
            <div style="flex: 1; min-width: 250px; max-width: 300px; background: linear-gradient(180deg, rgba(245,158,11,0.25), rgba(15,23,42,0.98)); border: 3.5px solid #fbbf24; border-radius: 28px; padding: 28px 20px; animation: fqWinnerPulse 3s infinite ease-in-out; position: relative; z-index: 5;">
              <div style="position: absolute; top: -20px; left: 50%; transform: translateX(-50%); background: linear-gradient(135deg, #f59e0b, #d97706); color: #fff; font-weight: 900; font-size: 0.85rem; padding: 6px 20px; border-radius: 99px; box-shadow: 0 0 20px rgba(245,158,11,0.8); border: 2px solid #fef08a; white-space: nowrap;">
                🏆 SANG JUARA UTAMA
              </div>
              <div style="font-size: 3.8rem; margin: 10px 0 4px 0; filter: drop-shadow(0 0 15px rgba(245,158,11,0.8));">🥇</div>
              <h2 style="color: #fef08a; font-size: 1.7rem; font-weight: 900; margin: 4px 0; text-shadow: 0 0 10px rgba(245,158,11,0.5);">${champ.groupName}</h2>
              <div style="font-size: 2.2rem; font-weight: 900; color: #fbbf24; margin-bottom: 12px; text-shadow: 0 0 12px rgba(251,191,36,0.6);">${champ.score || 0} POIN</div>
              <div style="font-size: 0.9rem; color: #fef08a; text-align: left; background: rgba(0,0,0,0.4); padding: 10px 14px; border-radius: 14px; border: 1px solid rgba(251,191,36,0.3); max-height: 110px; overflow-y: auto;">
                <strong style="color: #fbbf24; display: block; margin-bottom: 4px;">⭐ Anggota Kelompok Juara:</strong>
                ${(champ.members || []).map((m, i) => `<div style="display: flex; justify-content: space-between; padding: 2px 0;"><span>${i+1}. ${m.studentName || m}</span> <span>⭐</span></div>`).join('')}
              </div>
            </div>

            <!-- JUARA 3 (RIGHT PODIUM) -->
            ${third ? `
              <div style="flex: 1; min-width: 220px; max-width: 260px; background: linear-gradient(180deg, rgba(180,83,9,0.25), rgba(15,23,42,0.95)); border: 2.5px solid #cd7f32; border-radius: 24px; padding: 20px 16px; box-shadow: 0 0 30px rgba(205,127,50,0.3); transform: translateY(18px);">
                <div style="font-size: 2.5rem; margin-bottom: 4px;">🥉</div>
                <span style="background: #cd7f32; color: #fff; font-weight: 900; font-size: 0.85rem; padding: 4px 14px; border-radius: 99px; display: inline-block; margin-bottom: 8px;">JUARA 3</span>
                <h3 style="color: #fff; font-size: 1.3rem; font-weight: 900; margin: 4px 0;">${third.groupName}</h3>
                <div style="font-size: 1.6rem; font-weight: 900; color: #cd7f32; margin-bottom: 10px;">${third.score || 0} POIN</div>
                <div style="font-size: 0.82rem; color: #cbd5e1; text-align: left; background: rgba(0,0,0,0.3); padding: 8px 12px; border-radius: 12px; max-height: 90px; overflow-y: auto;">
                  ${(third.members || []).map((m, i) => `<div>${i+1}. ${m.studentName || m}</div>`).join('')}
                </div>
              </div>
            ` : ''}

          </div>

          <!-- REST OF GROUPS (POSISI SELANJUTNYA) -->
          ${restGroups.length > 0 ? `
            <div style="background: rgba(30,41,59,0.85); border: 2px solid var(--fq-border-cyan); border-radius: 20px; padding: 18px 24px; margin-bottom: 32px; text-align: left;">
              <h4 style="color: var(--fq-cyan); font-weight: 900; font-size: 1.1rem; margin: 0 0 12px 0;">🎗️ KLASEMEN PERINGKAT SELANJUTNYA:</h4>
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 10px;">
                ${restGroups.map((grp, idx) => `
                  <div style="background: rgba(15,23,42,0.7); border: 1px solid var(--fq-border-cyan); border-radius: 12px; padding: 10px 16px; display: flex; justify-content: space-between; align-items: center;">
                    <div style="font-weight: 900; color: #fff;">
                      <span style="color: #94a3b8; margin-right: 8px;">#${idx + 4}</span> ${grp.groupName}
                    </div>
                    <div style="font-weight: 900; color: var(--fq-cyan);">${grp.score || 0} POIN</div>
                  </div>
                `).join('')}
              </div>
            </div>
          ` : ''}

          <!-- ACTION BUTTONS -->
          <div style="display: flex; gap: 16px; justify-content: center; flex-wrap: wrap;">
            <button class="fq-btn fq-btn-cyan fq-btn-lg" style="min-height: 56px; padding: 0 32px; font-size: 1.2rem; font-weight: 900;" onclick="window.FIVIAGroupLevelEngine.startLevel('LEVEL_01')">
              🔄 MAINKAN LAGI DARI LEVEL 1
            </button>
            <button class="fq-btn fq-btn-emerald fq-btn-lg" style="min-height: 56px; padding: 0 32px; font-size: 1.2rem; font-weight: 900;" onclick="window.FIVIAGroupLevelEngine.renderLevelMapUI()">
              🗺️ KEMBALI KE PETA LEVEL
            </button>
          </div>
        </div>
      </div>
    `;

    renderToContainers(html);
  }

  function nextTurn() {
    if (turnTimerInterval) clearInterval(turnTimerInterval);
    activeReboundGroup = null;

    const state = window.FIVIAGroupLevels.getLevelState();
    const sessionState = (window.FIVIAGroupPlay && typeof window.FIVIAGroupPlay.getSessionState === 'function')
      ? window.FIVIAGroupPlay.getSessionState()
      : {};
    const totalGroups = (sessionState.groups && sessionState.groups.length > 0) ? sessionState.groups.length : 4;

    questionsAnsweredInLevel++;
    state.currentQuestionIndex++;

    if (window.FIVIAGroupPlay && typeof window.FIVIAGroupPlay.nextPlayerTurn === 'function') {
      window.FIVIAGroupPlay.nextPlayerTurn();
    }

    if (questionsAnsweredInLevel >= totalGroups) {
      renderLevelCompletionUI();
    } else {
      renderActiveLevelBoardUI();
    }
  }

  function skipTurn() {
    if (turnTimerInterval) clearInterval(turnTimerInterval);
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
    const htmlContent = `
      <html xmlns:o='urn:schemas-microsoft-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <meta charset='utf-8'>
        <title>Template Soal Guru FIVIA</title>
        <style>
          body { font-family: 'Calibri', 'Arial', sans-serif; font-size: 11pt; color: #1e293b; }
          h2 { color: #0284c7; border-bottom: 2px solid #0284c7; padding-bottom: 6px; }
          .info { background: #f0f9ff; border: 1px solid #7dd3fc; border-radius: 8px; padding: 12px; margin-bottom: 16px; font-size: 10pt; }
          table { width: 100%; border-collapse: collapse; margin-top: 12px; }
          th { background-color: #0284c7; color: #ffffff; font-weight: bold; text-align: left; padding: 10px; border: 1px solid #0369a1; }
          td { padding: 10px; border: 1px solid #cbd5e1; vertical-align: top; }
          tr:nth-child(even) { background-color: #f8fafc; }
        </style>
      </head>
      <body>
        <h2>📝 TEMPLATE BANK SOAL GURU - VIRTUAL LAB FISIKA FIVIA</h2>
        <div class="info">
          <strong>📌 PANDUAN PENGISIAN TABEL SOAL UNTUK GURU:</strong><br>
          1. Silakan isi atau ubah tabel di bawah ini sesuai soal fisika yang ingin Anda ujikan pada permainan kelompok.<br>
          2. <strong>Jenis Soal</strong> yang didukung:
             <ul>
               <li><code>Pilihan Ganda</code> (Opsi A, B, C, D | Kunci contoh: <strong>B</strong>)</li>
               <li><code>Benar Salah</code> (Pertanyaan berupa pernyataan | Kunci contoh: <strong>BENAR</strong> atau <strong>SALAH</strong>)</li>
               <li><code>Mencocokkan</code> (Opsi diisi pasangan: <strong>Panjang = meter</strong> | Kunci: Sesuai Pasangan)</li>
               <li><code>Pilihan Ganda Kompleks</code> (Opsi A, B, C, D | Kunci centang contoh: <strong>A, C</strong>)</li>
               <li><code>Isian Singkat</code> (Opsi dikosongkan / - | Kunci teks contoh: <strong>Kelvin</strong>)</li>
             </ul>
          3. Simpan file ini di Microsoft Word (.docx atau .doc) lalu unggah kembali ke aplikasi FIVIA!
        </div>

        <table>
          <thead>
            <tr>
              <th style="width: 5%;">No</th>
              <th style="width: 18%;">Jenis Soal</th>
              <th style="width: 32%;">Pertanyaan / Soal Fisika</th>
              <th style="width: 22%;">Opsi Jawaban / Pasangan</th>
              <th style="width: 10%;">Kunci Jawaban</th>
              <th style="width: 13%;">Penjelasan / Pembahasan</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td><b>Pilihan Ganda</b></td>
              <td>Manakah di bawah ini yang merupakan besaran fisika?</td>
              <td>A. Keindahan<br>B. Panjang<br>C. Warna<br>D. Kebersihan</td>
              <td><b>B</b></td>
              <td>Panjang adalah besaran fisika karena dapat diukur dan dinyatakan dengan angka.</td>
            </tr>
            <tr>
              <td>2</td>
              <td><b>Benar Salah</b></td>
              <td>PERNYATAAN: Rasa dingin mengalir masuk ke dalam benda hangat saat disentuh.</td>
              <td>A. BENAR<br>B. SALAH</td>
              <td><b>SALAH</b></td>
              <td>Dingin bukan energi. Kalor (panas) yang mengalir keluar dari benda hangat ke lingkungan.</td>
            </tr>
            <tr>
              <td>3</td>
              <td><b>Mencocokkan</b></td>
              <td>Pasangkan besaran fisika berikut dengan satuan SI yang tepat:</td>
              <td>Massa = kg<br>Panjang = meter<br>Waktu = detik</td>
              <td>Sesuai Pasangan</td>
              <td>Satuan SI massa adalah kg, panjang adalah meter, dan waktu adalah detik.</td>
            </tr>
            <tr>
              <td>4</td>
              <td><b>Pilihan Ganda Kompleks</b></td>
              <td>Manakah di bawah ini yang SELURUHNYA merupakan besaran pokok SI? (Pilih semua jawaban benar)</td>
              <td>A. Panjang<br>B. Gaya<br>C. Massa<br>D. Kecepatan</td>
              <td><b>A, C</b></td>
              <td>Panjang dan Massa adalah besaran pokok SI. Gaya dan Kecepatan adalah besaran turunan.</td>
            </tr>
            <tr>
              <td>5</td>
              <td><b>Isian Singkat</b></td>
              <td>Apakah nama satuan standar internasional (SI) untuk suhu mutlak?</td>
              <td>-</td>
              <td><b>Kelvin</b></td>
              <td>Kelvin (K) adalah satuan standar internasional untuk suhu mutlak.</td>
            </tr>
          </tbody>
        </table>
      </body>
      </html>
    `;

    const blob = new Blob(['\ufeff' + htmlContent], { type: 'application/msword;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'Template_Soal_Guru_FIVIA.doc';
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
            <h1 style="font-size: 2rem; font-weight: 900; color: #fff; margin: 0;">📝 UPLOAD SOAL WORD GURU (.docx / .doc)</h1>
            <div style="color: var(--fq-cyan); font-weight: 800; font-size: 0.95rem;">Isi bank soal fisika pada tabel Word, unduh template, dan unggah langsung ke aplikasi!</div>
          </div>
          <button class="fq-btn fq-btn-danger" style="min-height: 44px; font-weight: 900;" onclick="window.FIVIAGroupLevelEngine.closeWordImportModal()">✖ TUTUP</button>
        </div>

        <div style="display: flex; gap: 12px; margin-bottom: 24px; flex-wrap: wrap;">
          <button class="fq-btn fq-btn-emerald" style="padding: 12px 20px; font-weight: 900;" onclick="window.FIVIAGroupLevelEngine.downloadWordTemplate()">
            <i class="fas fa-download"></i> 📥 DOWNLOAD TEMPLATE WORD TABEL (.doc)
          </button>
          <button class="fq-btn fq-btn-outline" style="padding: 12px 20px; font-weight: 800;" onclick="const guide = document.getElementById('fq-word-format-guide'); guide.style.display = guide.style.display === 'none' ? 'block' : 'none';">
            <i class="fas fa-info-circle"></i> 📋 LIHAT PANDUAN FORMAT WORD
          </button>
        </div>

        <!-- Sample Format Preview Box -->
        <div id="fq-word-format-guide" style="display: none; background: rgba(15,23,42,0.8); border: 2px dashed var(--fq-amber); border-radius: 16px; padding: 20px; margin-bottom: 24px; font-size: 0.9rem; color: #e2e8f0; max-height: 280px; overflow-y: auto;">
          <strong style="color: var(--fq-amber);">📋 FORMAT TABEL DOKUMEN WORD (.docx / .doc):</strong><br><br>
          Tabel Word terdiri dari 6 kolom utama:<br>
          1. <b>No</b> (Angka urut 1, 2, 3...)<br>
          2. <b>Jenis Soal</b> (Pilihan Ganda / Benar Salah / Mencocokkan / Pilihan Ganda Kompleks / Isian Singkat)<br>
          3. <b>Pertanyaan / Soal Fisika</b> (Teks lengkap pertanyaan)<br>
          4. <b>Opsi Jawaban / Pasangan</b> (Format <code>A. ...</code> <code>B. ...</code> atau <code>Panjang = meter</code>)<br>
          5. <b>Kunci Jawaban</b> (Contoh: <code>B</code>, <code>BENAR</code>, <code>SALAH</code>, <code>A, C</code>, atau <code>Kelvin</code>)<br>
          6. <b>Penjelasan / Pembahasan</b> (Penjelasan ilmiah fisika)
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
          <h3 style="color: #fff; font-size: 1.2rem; font-weight: 900; margin: 0 0 8px 0;">PILIH DOKUMEN WORD (.docx / .doc / .html)</h3>
          <p style="color: var(--fq-text-muted); font-size: 0.9rem; margin-bottom: 16px;">Unggah file Word bertabel yang telah Anda buat di Microsoft Word</p>
          <input type="file" id="fq-word-file-input" accept=".docx,.doc,.html,.txt" style="display: block; margin: 0 auto; color: #fff; font-weight: 800;" />
        </div>

        <!-- Submit Button -->
        <button class="fq-btn fq-btn-cyan fq-btn-lg" style="width: 100%; min-height: 60px; font-size: 1.25rem; font-weight: 900;" onclick="window.FIVIAGroupLevelEngine.processWordImportFile()">
          🚀 PROSES DOKUMEN WORD TABEL &amp; SIMPAN BANK SOAL
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
      alert('⚠️ Silakan pilih file Word (.docx / .doc) terlebih dahulu!');
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
        alert('⚠️ Pustaka pembaca Word belum dimuat. Mohon pastikan koneksi internet aktif!');
        return;
      }
      const reader = new FileReader();
      reader.onload = function(e) {
        const arrayBuffer = e.target.result;
        window.mammoth.convertToHtml({ arrayBuffer: arrayBuffer })
          .then(function(htmlResult) {
            const htmlText = htmlResult.value;
            window.mammoth.extractRawText({ arrayBuffer: arrayBuffer })
              .then(function(textResult) {
                parseAndSaveWordQuestions(textResult.value, htmlText, selectedModId, moduleTitle);
              })
              .catch(function() {
                parseAndSaveWordQuestions('', htmlText, selectedModId, moduleTitle);
              });
          })
          .catch(function(err) {
            console.error('Error extracting Word HTML:', err);
            alert('❌ Gagal membaca dokumen Word (.docx): ' + err.message);
          });
      };
      reader.readAsArrayBuffer(file);
    } else {
      const reader = new FileReader();
      reader.onload = function(e) {
        const rawContent = e.target.result;
        parseAndSaveWordQuestions(rawContent, rawContent, selectedModId, moduleTitle);
      };
      reader.readAsText(file);
    }
  }

  function extractOptionsFromText(optionsStr) {
    if (!optionsStr) return [];

    const cleanedText = optionsStr
      .replace(/<\/p>/gi, '\n')
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<[^>]+>/g, '')
      .replace(/&nbsp;/gi, ' ')
      .trim();

    const options = [];

    // Match 'A.' or 'A)' or 'A:' up to the next 'B.', 'B)', 'B:' or end of string
    const regex = /([A-D])[\.\:\)]\s*([\s\S]*?)(?=(?:[A-D][\.\:\)]\s*)|$)/gi;
    let match;
    while ((match = regex.exec(cleanedText)) !== null) {
      const letter = match[1].toUpperCase();
      const optText = match[2].trim().replace(/[\r\n]+/g, ' ');
      if (optText.length > 0 && !options.some(o => o.id === letter)) {
        options.push({ id: letter, label: optText });
      }
    }

    // Fallback: If no A/B/C/D markers, split by newline if lines exist
    if (options.length === 0 && cleanedText.length > 0) {
      const rawLines = cleanedText.split(/\n+/).map(l => l.trim()).filter(l => l.length > 0);
      if (rawLines.length >= 2) {
        rawLines.slice(0, 4).forEach((lineText, i) => {
          const letter = String.fromCharCode(65 + i);
          const cleaned = lineText.replace(/^([A-D][\.\:\)]\s*)?/i, '').trim();
          if (cleaned.length > 0) {
            options.push({ id: letter, label: cleaned });
          }
        });
      }
    }

    return options;
  }

  function extractPairsFromText(pairsStr) {
    if (!pairsStr) return [];
    const text = pairsStr
      .replace(/<\/p>/gi, '\n')
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<[^>]+>/g, '')
      .replace(/&nbsp;/gi, ' ')
      .trim();

    const pairs = [];
    const lines = text.split(/\n+/).map(l => l.trim()).filter(l => l.length > 0);
    lines.forEach(line => {
      let parts = null;
      let sep = '=';
      if (line.includes('=')) { parts = line.split('='); sep = '='; }
      else if (line.includes('->')) { parts = line.split('->'); sep = '->'; }
      else if (line.includes('=>')) { parts = line.split('=>'); sep = '=>'; }
      else if (line.includes('–')) { parts = line.split('–'); sep = '–'; }
      else if (line.includes(':')) { parts = line.split(':'); sep = ':'; }
      else if (line.includes('-')) { parts = line.split('-'); sep = '-'; }

      if (parts && parts.length >= 2) {
        const left = parts[0].trim();
        const right = parts.slice(1).join(sep).trim();
        if (left && right) {
          pairs.push({ left, right });
        }
      }
    });
    return pairs;
  }

  function parseWordHtmlTable(htmlText) {
    if (!htmlText || !htmlText.includes('<tr')) return [];
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlText, 'text/html');
      const rows = doc.querySelectorAll('tr');
      const parsedQuestions = [];

      rows.forEach((row, rIdx) => {
        const cells = row.querySelectorAll('th, td');
        if (cells.length < 3) return;

        const cellHtmls = Array.from(cells).map(c => (c.innerHTML || c.textContent || '').trim());
        const cellTexts = Array.from(cells).map(c => (c.innerText || c.textContent || '').trim());
        const fullRowText = cellTexts.join(' ').toUpperCase();

        // Skip header rows, instruction rows, and table headers
        if (
          fullRowText.includes('PERTANYAAN / SOAL') ||
          fullRowText.includes('PERTANYAAN/SOAL') ||
          fullRowText.includes('OPSI JAWABAN') ||
          fullRowText.includes('KUNCI JAWABAN') ||
          fullRowText.includes('PENJELASAN / PEMBAHASAN') ||
          fullRowText.includes('PANDUAN PENGISIAN') ||
          fullRowText.includes('TEMPLATE BANK SOAL') ||
          fullRowText.includes('JENIS SOAL')
        ) {
          return;
        }

        let jenisText = '';
        let questionText = '';
        let optionsRaw = '';
        let keyText = '';
        let explanationText = '';

        const col0IsNo = /^\d+$/.test(cellTexts[0]) || /^(NO|NO\.|NUMBER)$/i.test(cellTexts[0]);
        if (col0IsNo && cellTexts.length >= 5) {
          jenisText = cellTexts[1];
          questionText = cellTexts[2];
          optionsRaw = cellHtmls[3] || cellTexts[3];
          keyText = cellTexts[4];
          explanationText = cellTexts[5] || '';
        } else if (cellTexts.length >= 6) {
          jenisText = cellTexts[1];
          questionText = cellTexts[2];
          optionsRaw = cellHtmls[3] || cellTexts[3];
          keyText = cellTexts[4];
          explanationText = cellTexts[5];
        } else if (cellTexts.length >= 5) {
          jenisText = cellTexts[0];
          questionText = cellTexts[1];
          optionsRaw = cellHtmls[2] || cellTexts[2];
          keyText = cellTexts[3];
          explanationText = cellTexts[4];
        } else if (cellTexts.length >= 4) {
          jenisText = cellTexts[0];
          questionText = cellTexts[1];
          optionsRaw = cellHtmls[2] || cellTexts[2];
          keyText = cellTexts[3];
        }

        if (!questionText || questionText.trim().length === 0) return;

        const qUpper = questionText.toUpperCase();
        if (
          qUpper.includes('PERTANYAAN / SOAL') ||
          qUpper.includes('PERTANYAAN/SOAL') ||
          qUpper === 'PERTANYAAN' ||
          qUpper === 'SOAL FISIKA'
        ) {
          return;
        }

        let type = 'multiple_choice';
        const jUpper = jenisText.toUpperCase();
        if (jUpper.includes('BENAR') || jUpper.includes('SALAH') || jUpper === 'BS' || jUpper.includes('TRUE')) {
          type = 'true_false';
        } else if (jUpper.includes('COCOK') || jUpper.includes('JODOH') || jUpper.includes('MATCH')) {
          type = 'matching';
        } else if (jUpper.includes('KOMPLEKS') || jUpper.includes('CENTANG') || jUpper.includes('MULTIPLE')) {
          type = 'multiple_select';
        } else if (jUpper.includes('ISIAN') || jUpper.includes('SINGKAT') || jUpper.includes('SHORT')) {
          type = 'short_answer';
        } else if (jUpper.includes('GANDA') || jUpper.includes('PG') || jUpper.includes('CHOICE')) {
          type = 'multiple_choice';
        }

        const options = extractOptionsFromText(optionsRaw);
        if (type === 'true_false' && options.length === 0) {
          options.push({ id: 'A', label: 'BENAR' }, { id: 'B', label: 'SALAH' });
        }

        let pairs = extractPairsFromText(optionsRaw);
        if (type === 'matching' && pairs.length === 0) {
          pairs = extractPairsFromText(keyText);
        }

        let keyVal = (keyText || '').trim();
        let cleanKeyRaw = keyVal.replace(/^(KUNCI|JAWABAN|KEY|KUNCI JAWABAN)\s*[\:\=]?\s*/i, '').trim();

        let keyArr = [cleanKeyRaw];
        let correctIndices = [];

        if (type === 'multiple_choice') {
          let letterFound = null;
          const mLetter = cleanKeyRaw.match(/(?:OPSI|OPTION)?\s*[\(\:\.\-]*\s*([A-D])(?:\b|[\)\.\:\-]|$)/i);
          if (mLetter) {
            letterFound = mLetter[1].toUpperCase();
          } else if (options && options.length > 0) {
            const lowerKey = cleanKeyRaw.toLowerCase();
            const matchedOpt = options.find(o => {
              const lbl = (o.label || '').toLowerCase().trim();
              return lbl && (lbl === lowerKey || lowerKey.includes(lbl) || lbl.includes(lowerKey));
            });
            if (matchedOpt) letterFound = matchedOpt.id;
          }
          if (!letterFound) {
            const num = parseInt(cleanKeyRaw);
            if (!isNaN(num) && num >= 1 && num <= 4) {
              letterFound = String.fromCharCode(64 + num);
            }
          }
          keyVal = letterFound || 'A';
        } else if (type === 'true_false') {
          const upperKey = cleanKeyRaw.toUpperCase();
          if (upperKey.includes('SALAH') || upperKey.includes('FALSE') || upperKey === 'S' || upperKey === 'F' || upperKey.startsWith('B.') || upperKey === 'B') {
            keyVal = 'B';
          } else {
            keyVal = 'A';
          }
        } else if (type === 'multiple_select') {
          const upperKey = cleanKeyRaw.toUpperCase();
          const matchedLetters = upperKey.match(/\b[A-D]\b/g) || upperKey.match(/[A-D]/g) || [];
          const letterSet = new Set(matchedLetters);
          options.forEach((opt, oIdx) => {
            if (letterSet.has(opt.id)) {
              correctIndices.push(oIdx);
            }
          });
          if (correctIndices.length === 0) {
            const digits = upperKey.match(/[1-4]/g);
            if (digits) {
              digits.forEach(d => {
                const idx = parseInt(d) - 1;
                if (idx >= 0 && idx < (options.length || 4) && !correctIndices.includes(idx)) {
                  correctIndices.push(idx);
                }
              });
            }
          }
          if (correctIndices.length === 0) correctIndices = [0, 2];
          keyVal = correctIndices.map(i => String.fromCharCode(65 + i)).join(', ');
        } else if (type === 'short_answer') {
          keyArr = cleanKeyRaw.split(/[,|\/]|(?:\bATAU\b)|(?:\bOR\b)/i).map(k => k.trim()).filter(k => k.length > 0);
          if (keyArr.length === 0) keyArr = [cleanKeyRaw || 'Jawaban'];
          keyVal = keyArr[0];
        }

        parsedQuestions.push({
          id: `w_q_${Date.now()}_${parsedQuestions.length + 1}`,
          type: type,
          question: questionText,
          options: options.length > 0 ? options : undefined,
          pairs: pairs.length > 0 ? pairs : undefined,
          correctAnswer: keyVal,
          correct: keyVal,
          correctAnswers: (type === 'multiple_select') ? correctIndices : (type === 'short_answer') ? keyArr : undefined,
          explanation: (explanationText && explanationText.trim().length > 0) ? explanationText.trim() : 'Pembahasan disiapkan oleh Guru.'
        });
      });

      return parsedQuestions;
    } catch (e) {
      console.error('Error parsing Word HTML table:', e);
      return [];
    }
  }

  function parseAndSaveWordQuestions(text, htmlText, selectedModId, moduleTitle) {
    let parsedQuestions = parseWordHtmlTable(htmlText);

    // Fallback to text block regex parsing if no HTML table was detected
    if (parsedQuestions.length === 0 && text && text.trim().length > 0) {
      const blocks = text.split(/(?=\[JENIS:|\nSOAL:)/i).filter(b => b && b.trim().length > 0);
      blocks.forEach((block, idx) => {
        const bText = block.trim();
        if (!bText.includes('SOAL:')) return;

        let type = 'multiple_choice';
        if (/JENIS:\s*BENAR\s*SALAH/i.test(bText)) type = 'true_false';
        else if (/JENIS:\s*MENCOCOKKAN/i.test(bText)) type = 'matching';
        else if (/JENIS:\s*PILIHAN\s*GANDA\s*KOMPLEKS/i.test(bText)) type = 'multiple_select';
        else if (/JENIS:\s*ISIAN\s*SINGKAT/i.test(bText)) type = 'short_answer';

        const qMatch = bText.match(/SOAL:\s*([\s\S]*?)(?=\nOPSI|\nPASANGAN|\nKUNCI|\nPENJELASAN|$)/i);
        const questionText = qMatch ? qMatch[1].trim() : `Soal ${idx + 1}`;

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
    }

    if (parsedQuestions.length === 0) {
      alert('⚠️ Tidak dapat membaca tabel atau format soal pada dokumen Word. Mohon unduh Template Word (.doc) bertabel!');
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
    alert(`🎉 BERHASIL MENG-IMPORT ${parsedQuestions.length} SOAL DARI TABEL DOKUMEN WORD!\n\nBank soal untuk "${moduleTitle}" telah berhasil disimpan dan otomatis terpilih untuk permainan.`);
    renderLevelMapUI();
  }

  return {
    setSelectedModule: setSelectedModule,
    renderLevelMapUI: renderLevelMapUI,
    selectClass: selectClass,
    autoGroup: autoGroup,
    setNumberOfGroups: setNumberOfGroups,
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
    processWordImportFile: processWordImportFile,
    appointReboundGroup: appointReboundGroup,
    showReboundSelectionUI: showReboundSelectionUI,
    startTurnTimer: startTurnTimer,
    renderLevelCompletionUI: renderLevelCompletionUI,
    renderGrandWinnerUI: renderGrandWinnerUI
  };
})();


