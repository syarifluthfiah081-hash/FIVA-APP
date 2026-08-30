/**
 * FIVIA CLASSROOM ENGINE MODULE
 * Phase 7: Classroom State Machine, Activity Launcher & UI View Renderers
 */

window.FIVIAClassroomEngine = (function() {
  'use strict';

  function renderTeacherClassroomUI() {
    const container = document.getElementById('fq-classroom-container');
    if (!container) return;

    const roster = window.FIVIAExcelImport ? window.FIVIAExcelImport.getExistingRoster() : [];
    const activeCount = roster.filter(s => s.status !== 'ARCHIVED').length;
    const activeTodayCount = Math.min(activeCount, Math.ceil(activeCount * 0.8));

    container.innerHTML = `
      <div style="background: rgba(15, 23, 42, 0.95); border: 2.5px solid var(--fq-cyan); border-radius: 28px; padding: 32px; text-align: left;">
        <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 2px solid var(--fq-border-cyan); padding-bottom: 16px; margin-bottom: 24px; flex-wrap: wrap; gap: 12px;">
          <div>
            <span class="fq-badge-pill"><i class="fas fa-users-cog"></i> TEACHER COMMAND CENTER &bull; DATA SISWA</span>
            <h1 style="font-size: 2.2rem; font-weight: 900; color: #fff; margin: 4px 0;">👨🎓 MANAJEMEN DATA SISWA</h1>
            <div style="color: var(--fq-cyan); font-weight: 700;">Kelola roster, import dari Excel, cetak kartu akses &amp; pantau progress.</div>
          </div>
          <div style="display: flex; gap: 10px; flex-wrap: wrap;">
            <button class="fq-btn fq-btn-cyan" onclick="window.FIVIAClassroomEngine.triggerExcelImport()"><i class="fas fa-file-import"></i> 📥 IMPORT EXCEL</button>
            <button class="fq-btn fq-btn-outline" onclick="window.FIVIAExcelImport.downloadExcelTemplate()"><i class="fas fa-file-download"></i> 📄 DOWNLOAD TEMPLATE</button>
            <button class="fq-btn fq-btn-emerald" onclick="window.FIVIAExcelImport.printStudentCards()"><i class="fas fa-print"></i> 🖨️ CETAK KARTU</button>
            <button class="fq-btn fq-btn-amber" onclick="window.FIVIAClassroomEngine.showAddStudentModal()"><i class="fas fa-plus-circle"></i> ➕ TAMBAH SISWA</button>
          </div>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-bottom: 28px;">
          <div style="background: rgba(30,41,59,0.7); border: 1px solid var(--fq-border-cyan); border-radius: 18px; padding: 18px;">
            <div style="font-size: 0.8rem; color: var(--fq-text-muted);">TOTAL SISWA TERDAFTAR</div>
            <div style="font-size: 1.8rem; font-weight: 900; color: #fff;">${activeCount} Siswa</div>
          </div>
          <div style="background: rgba(30,41,59,0.7); border: 1px solid var(--fq-border-cyan); border-radius: 18px; padding: 18px;">
            <div style="font-size: 0.8rem; color: var(--fq-text-muted);">AKTIF HARI INI</div>
            <div style="font-size: 1.8rem; font-weight: 900; color: var(--fq-emerald);">${activeTodayCount} Siswa</div>
          </div>
          <div style="background: rgba(30,41,59,0.7); border: 1px solid var(--fq-border-cyan); border-radius: 18px; padding: 18px;">
            <div style="font-size: 0.8rem; color: var(--fq-text-muted);">RATA-RATA MASTERY</div>
            <div style="font-size: 1.8rem; font-weight: 900; color: var(--fq-cyan);">78%</div>
          </div>
          <div style="background: rgba(30,41,59,0.7); border: 1px solid var(--fq-border-cyan); border-radius: 18px; padding: 18px;">
            <div style="font-size: 0.8rem; color: var(--fq-text-muted);">PERLU INTERVENSI</div>
            <div style="font-size: 1.8rem; font-weight: 900; color: var(--fq-amber);">0 Siswa</div>
          </div>
        </div>

        <!-- Filter & Search Bar -->
        <div style="display: flex; gap: 12px; margin-bottom: 20px; flex-wrap: wrap;">
          <input type="text" id="fq-roster-search" class="fq-input" placeholder="🔍 Cari nama, NIS, atau Kode Siswa..." style="flex: 2; min-width: 200px;" oninput="window.FIVIAClassroomEngine.filterRosterTable()">
          <select id="fq-roster-class-filter" class="fq-select" style="flex: 1; min-width: 140px;" onchange="window.FIVIAClassroomEngine.filterRosterTable()">
            <option value="ALL">Semua Kelas</option>
            ${Array.from(new Set(roster.map(s => s.className || s.classId))).map(c => `<option value="${c}">${c}</option>`).join('')}
          </select>
        </div>

        <h3 style="color: var(--fq-cyan); font-size: 1.2rem; margin: 0 0 16px 0;"><i class="fas fa-users"></i> DAFTAR ROSTER SISWA:</h3>
        <div style="overflow-x: auto;">
          <table class="fq-student-table" id="fq-roster-table">
            <thead>
              <tr>
                <th>NO</th>
                <th>NAMA SISWA</th>
                <th>NIS</th>
                <th>KELAS</th>
                <th>KODE SISWA</th>
                <th>TOTAL XP</th>
                <th>STATUS</th>
                <th>AKSI</th>
              </tr>
            </thead>
            <tbody id="fq-roster-tbody">
              ${roster.length === 0 ? `
                <tr>
                  <td colspan="8" style="text-align: center; padding: 24px; color: var(--fq-text-muted);">
                    Belum ada data siswa. Silakan klik tombol <strong>📥 IMPORT EXCEL</strong> atau <strong>➕ TAMBAH SISWA</strong>.
                  </td>
                </tr>
              ` : roster.map((s, idx) => `
                <tr data-name="${(s.name||'').toLowerCase()}" data-nis="${s.nis||''}" data-code="${(s.studentCode||'').toLowerCase()}" data-class="${s.className||s.classId||''}">
                  <td>${idx + 1}</td>
                  <td><strong>${s.name}</strong></td>
                  <td><code style="color: var(--fq-amber); font-weight: bold;">${s.nis}</code></td>
                  <td>${s.className || s.classId}</td>
                  <td><code style="color: var(--fq-cyan); font-weight: bold;">${s.studentCode}</code></td>
                  <td><span class="fq-badge-pill" style="margin: 0; color: var(--fq-amber); border-color: var(--fq-amber);">${s.xp || 0} XP</span></td>
                  <td><span class="fq-badge-pill" style="margin: 0; color: var(--fq-emerald); border-color: var(--fq-emerald);">${s.status || 'ACTIVE'}</span></td>
                  <td>
                    <button class="fq-btn fq-btn-outline" style="min-height: 32px; padding: 4px 8px; font-size: 0.75rem;" onclick="window.FIVIAClassroomEngine.editStudent('${s.studentId}')">✏️ EDIT</button>
                    <button class="fq-btn fq-btn-danger" style="min-height: 32px; padding: 4px 8px; font-size: 0.75rem;" onclick="window.FIVIAClassroomEngine.archiveStudent('${s.studentId}')">🗑️ ARCHIVE</button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }


  function renderStudentMyClassroomUI() {
    const container = document.getElementById('fq-my-classroom-container');
    if (!container) return;

    const student = window.FIVIAStudent.getStudentProfile();
    const assignments = window.FIVIAAssignment.getAssignments('cls_2045_x1');

    container.innerHTML = `
      <div style="background: rgba(15, 23, 42, 0.95); border: 2.5px solid var(--fq-cyan); border-radius: 28px; padding: 32px; text-align: left;">
        <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 2px solid var(--fq-border-cyan); padding-bottom: 16px; margin-bottom: 24px;">
          <div>
            <span class="fq-badge-pill"><i class="fas fa-graduation-cap"></i> RUANG KELAS SAYA</span>
            <h1 style="font-size: 2.2rem; font-weight: 900; color: #fff; margin: 4px 0;">MY CLASSROOM</h1>
            <div style="color: var(--fq-cyan); font-weight: 700;">Kelas: XI Fase F &bull; Kode: FIVIA-XIF-2045</div>
          </div>
          <button class="fq-btn fq-btn-danger" onclick="window.FIVIALiveMonitor.requestStudentHelp('${student.name}', 'Aktivitas Kelas')"><i class="fas fa-life-ring"></i> 🆘 NEED HELP</button>
        </div>

        <h3 style="color: var(--fq-amber); font-size: 1.2rem; margin: 0 0 16px 0;"><i class="fas fa-tasks"></i> DAFTAR TUGAS KELAS AKTIF (${assignments.length} Tugas):</h3>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px;">
          ${assignments.map(asg => `
            <div style="background: rgba(30,41,59,0.7); border: 1.5px solid var(--fq-border-cyan); border-radius: 20px; padding: 20px;">
              <span class="fq-badge-pill" style="margin: 0 0 10px 0;">${asg.activityType} &bull; +${asg.xpReward} XP</span>
              <h4 style="font-size: 1.1rem; font-weight: 800; color: #fff; margin: 0 0 6px 0;">${asg.title}</h4>
              <p style="font-size: 0.85rem; color: var(--fq-text-muted); margin-bottom: 14px;">${asg.description}</p>
              <button class="fq-btn fq-btn-cyan" style="width: 100%;" onclick="window.location.hash='#quest/${asg.activityType === 'LAB' ? 'virtual-lab' : 'mastery-assessment'}'"><i class="fas fa-play"></i> KERJAKAN TUGAS</button>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  function renderAssignmentManagerUI() {
    const container = document.getElementById('fq-assignment-manager-container');
    if (!container) return;

    const assignments = window.FIVIAAssignment.getAssignments('cls_2045_x1');

    container.innerHTML = `
      <div style="background: rgba(15, 23, 42, 0.95); border: 2.5px solid var(--fq-cyan); border-radius: 28px; padding: 32px; text-align: left;">
        <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 2px solid var(--fq-border-cyan); padding-bottom: 16px; margin-bottom: 24px;">
          <div>
            <span class="fq-badge-pill"><i class="fas fa-tasks"></i> ASSIGNMENT MANAGER</span>
            <h1 style="font-size: 2.2rem; font-weight: 900; color: #fff; margin: 4px 0;">PENGELOLAAN PENUGASAN KELAS</h1>
          </div>
          <button class="fq-btn fq-btn-cyan" onclick="window.FIVIAClassroomEngine.showCreateAssignmentModal()"><i class="fas fa-plus"></i> BUAT TUGAS BARU</button>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px;">
          ${assignments.map(asg => `
            <div style="background: rgba(30,41,59,0.7); border: 1.5px solid var(--fq-border); border-radius: 20px; padding: 20px;">
              <span class="fq-badge-pill" style="margin-0 0 10px 0;">STATUS: ${asg.status}</span>
              <h4 style="font-size: 1.1rem; font-weight: 800; color: #fff; margin: 0 0 6px 0;">${asg.title}</h4>
              <p style="font-size: 0.85rem; color: var(--fq-text-muted); margin-bottom: 14px;">${asg.description}</p>
              <div style="font-size: 0.8rem; color: var(--fq-cyan);">Tenggat: ${new Date(asg.deadline).toLocaleDateString('id-ID')}</div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  function renderLiveMonitorUI() {
    const container = document.getElementById('fq-live-monitor-container');
    if (!container) return;

    const cards = window.FIVIALiveMonitor.getStudentCards();
    const events = window.FIVIALiveMonitor.getLiveEvents();

    container.innerHTML = `
      <div style="background: rgba(15, 23, 42, 0.95); border: 2.5px solid var(--fq-cyan); border-radius: 28px; padding: 32px; text-align: left;">
        <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 2px solid var(--fq-border-cyan); padding-bottom: 16px; margin-bottom: 24px;">
          <div>
            <span class="fq-badge-pill"><i class="fas fa-desktop"></i> LIVE CLASSROOM MONITOR</span>
            <h1 style="font-size: 2.2rem; font-weight: 900; color: #fff; margin: 4px 0;">PEMANTAUAN AKTIVITAS REAL-TIME</h1>
          </div>
        </div>

        <h3 style="color: var(--fq-cyan); font-size: 1.1rem; margin: 0 0 16px 0;"><i class="fas fa-user-clock"></i> KARTU MONITOR SISWA AKTIF:</h3>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px; margin-bottom: 28px;">
          ${cards.map(c => `
            <div style="background: rgba(30,41,59,0.7); border: 1.5px solid ${c.color}; border-radius: 18px; padding: 16px;">
              <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
                <strong style="color: #fff; font-size: 0.95rem;">${c.name}</strong>
                <span style="font-size: 0.75rem; font-weight: 800; color: ${c.color};">${c.status}</span>
              </div>
              <div style="font-size: 0.8rem; color: var(--fq-text-muted); margin-bottom: 8px;">${c.activity}</div>
              <div style="font-size: 0.85rem; font-weight: 700; color: var(--fq-cyan);">Progress: ${c.progress}</div>
            </div>
          `).join('')}
        </div>

        <h3 style="color: var(--fq-amber); font-size: 1.1rem; margin: 0 0 12px 0;"><i class="fas fa-stream"></i> LIVE ACTIVITY FEED (20 EVENT TERAKHIR):</h3>
        <div style="background: #030712; border: 1px solid var(--fq-border-cyan); border-radius: 16px; padding: 16px; height: 180px; overflow-y: auto;">
          ${events.map(ev => `
            <div style="font-size: 0.85rem; color: #fff; border-bottom: 1px solid rgba(255,255,255,0.08); padding: 6px 0; display: flex; justify-content: space-between;">
              <span>${ev.text}</span>
              <span style="color: var(--fq-text-muted); font-size: 0.75rem;">${ev.time}</span>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  function renderInterventionUI() {
    const container = document.getElementById('fq-intervention-container');
    if (!container) return;

    const interventions = window.FIVIAIntervention.getInterventions();

    container.innerHTML = `
      <div style="background: rgba(15, 23, 42, 0.95); border: 2.5px solid var(--fq-cyan); border-radius: 28px; padding: 32px; text-align: left;">
        <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 2px solid var(--fq-border-cyan); padding-bottom: 16px; margin-bottom: 24px;">
          <div>
            <span class="fq-badge-pill"><i class="fas fa-user-shield"></i> TEACHER INTERVENTION ENGINE</span>
            <h1 style="font-size: 2.2rem; font-weight: 900; color: #fff; margin: 4px 0;">REKOMENDASI INTERVENSI & REMEDIASI</h1>
          </div>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px;">
          ${interventions.map(item => `
            <div style="background: rgba(30,41,59,0.7); border: 1.5px solid ${item.badgeColor}; border-radius: 20px; padding: 20px;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                <h4 style="font-size: 1.1rem; font-weight: 800; color: #fff; margin: 0;">${item.studentName}</h4>
                <span class="fq-badge-pill" style="margin: 0; color: ${item.badgeColor}; border-color: ${item.badgeColor};">${item.priority}</span>
              </div>
              <p style="font-size: 0.85rem; color: var(--fq-text-muted); margin-bottom: 14px;">${item.issue}</p>
              <div style="display: flex; gap: 8px;">
                <button class="fq-btn fq-btn-cyan" style="flex: 1; min-height: 40px; padding: 6px 12px; font-size: 0.8rem;" onclick="window.FIVIAIntervention.assignRemediation('${item.studentName}', '${item.targetLink}')">TUGASKAN REMEDI</button>
                <button class="fq-btn fq-btn-emerald" style="flex: 1; min-height: 40px; padding: 6px 12px; font-size: 0.8rem;" onclick="window.FIVIAIntervention.assignEnrichment('${item.studentName}', '#quest/project-mission')">PENGAYAAN</button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  function renderActivityLauncherUI() {
    const container = document.getElementById('fq-activity-launcher-container');
    if (!container) return;

    container.innerHTML = `
      <div style="background: rgba(15, 23, 42, 0.95); border: 2.5px solid var(--fq-cyan); border-radius: 28px; padding: 32px; text-align: left;">
        <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 2px solid var(--fq-border-cyan); padding-bottom: 16px; margin-bottom: 24px;">
          <div>
            <span class="fq-badge-pill"><i class="fas fa-play-circle"></i> CLASSROOM ACTIVITY LAUNCHER</span>
            <h1 style="font-size: 2.2rem; font-weight: 900; color: #fff; margin: 4px 0;">PELUNCUR AKTIVITAS KELAS</h1>
          </div>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 20px;">
          <div style="background: rgba(30,41,59,0.7); border: 1px solid var(--fq-border-cyan); border-radius: 18px; padding: 20px; text-align: center;">
            <div style="font-size: 2.5rem; color: var(--fq-cyan); margin-bottom: 10px;"><i class="fas fa-gamepad"></i></div>
            <h4 style="color: #fff; margin: 0 0 10px 0;">QUEST GAME LEVEL</h4>
            <button class="fq-btn fq-btn-cyan" style="width: 100%;" onclick="window.location.hash='#quest/game-map'">LUNCURKAN QUEST</button>
          </div>
          <div style="background: rgba(30,41,59,0.7); border: 1px solid var(--fq-border-cyan); border-radius: 18px; padding: 20px; text-align: center;">
            <div style="font-size: 2.5rem; color: var(--fq-emerald); margin-bottom: 10px;"><i class="fas fa-flask"></i></div>
            <h4 style="color: #fff; margin: 0 0 10px 0;">VIRTUAL PHYSICS LAB</h4>
            <button class="fq-btn fq-btn-emerald" style="width: 100%;" onclick="window.location.hash='#quest/virtual-lab'">LUNCURKAN LAB</button>
          </div>
          <div style="background: rgba(30,41,59,0.7); border: 1px solid var(--fq-border-cyan); border-radius: 18px; padding: 20px; text-align: center;">
            <div style="font-size: 2.5rem; color: var(--fq-amber); margin-bottom: 10px;"><i class="fas fa-rocket"></i></div>
            <h4 style="color: #fff; margin: 0 0 10px 0;">PROJECT MISSION</h4>
            <button class="fq-btn fq-btn-amber" style="width: 100%;" onclick="window.location.hash='#quest/project-mission'">LUNCURKAN PROYEK</button>
          </div>
        </div>
      </div>
    `;
  }

  function triggerExcelImport() {
    const modal = document.getElementById('fq-excel-import-modal');
    if (modal) {
      modal.classList.add('active');
    } else {
      const fileInput = document.createElement('input');
      fileInput.type = 'file';
      fileInput.accept = '.xlsx,.xls,.csv';
      fileInput.onchange = async function(e) {
        const file = e.target.files[0];
        if (!file) return;
        try {
          const rawRows = await window.FIVIAExcelImport.parseFile(file);
          const processRes = window.FIVIAExcelImport.processRows(rawRows);
          
          if (!processRes.valid) {
            alert(processRes.error);
            return;
          }

          const dupMode = confirm(`📊 HASIL ANALISIS EXCEL:\n\n• Total Baris: ${processRes.totalRows}\n• Valid: ${processRes.validCount}\n• Duplikat: ${processRes.duplicateCount}\n• Invalid: ${processRes.invalidCount}\n\nTekan OK untuk SKIP DUPLIKAT (Default), atau CANCEL untuk UPDATE DATA SISWA LAMA.`) ? 'SKIP' : 'UPDATE';

          const importRes = window.FIVIAExcelImport.executeImport(processRes.parsedData, dupMode);
          alert(`🎉 IMPORT SELESAI!\n\n• Siswa Berhasil Diimport: ${importRes.totalImported}\n• Baris Dilewati: ${importRes.skipped}\n• Total Roster Siswa: ${importRes.totalInRoster}`);
          renderTeacherClassroomUI();
        } catch (err) {
          alert('❌ GAGAL MENGIMPORT EXCEL: ' + err.message);
        }
      };
      fileInput.click();
    }
  }

  function filterRosterTable() {
    const searchVal = (document.getElementById('fq-roster-search') || {}).value || '';
    const classVal = (document.getElementById('fq-roster-class-filter') || {}).value || 'ALL';
    const tbody = document.getElementById('fq-roster-tbody');
    if (!tbody) return;

    const rows = tbody.querySelectorAll('tr');
    rows.forEach(tr => {
      const name = tr.getAttribute('data-name') || '';
      const nis = tr.getAttribute('data-nis') || '';
      const code = tr.getAttribute('data-code') || '';
      const cls = tr.getAttribute('data-class') || '';

      const query = searchVal.toLowerCase().trim();
      const matchesSearch = !query || name.includes(query) || nis.includes(query) || code.includes(query);
      const matchesClass = classVal === 'ALL' || cls === classVal;

      tr.style.display = (matchesSearch && matchesClass) ? '' : 'none';
    });
  }

  function showAddStudentModal() {
    const name = prompt('Masukkan Nama Lengkap Siswa:', 'Ahmad Fauzan');
    if (!name) return;
    const nis = prompt('Masukkan NIS Siswa (String):', '001');
    if (!nis) return;
    const className = prompt('Masukkan Kelas Siswa:', 'X.F.1');
    if (!className) return;

    const studentCode = window.FIVIAExcelImport.generateStudentCode(nis, className);
    const parsedData = [{
      status: 'READY',
      studentId: 'STD-' + Date.now().toString(36),
      studentCode,
      name,
      nis,
      className,
      classId: window.FIVIAExcelImport.normalizeClassCode(className)
    }];

    window.FIVIAExcelImport.executeImport(parsedData, 'SKIP');
    alert(`🎉 SISWA BERHASIL DITAMBAHKAN!\n\nKode Siswa: ${studentCode}`);
    renderTeacherClassroomUI();
  }

  function editStudent(studentId) {
    const roster = window.FIVIAExcelImport.getExistingRoster();
    const student = roster.find(s => s.studentId === studentId);
    if (!student) return;

    const newName = prompt('Edit Nama Siswa:', student.name);
    if (newName === null) return;
    const newNis = prompt('Edit NIS Siswa:', student.nis);
    if (newNis === null) return;
    const newClass = prompt('Edit Kelas Siswa:', student.className);
    if (newClass === null) return;

    student.name = newName.trim() || student.name;
    student.nis = newNis.trim() || student.nis;
    student.className = newClass.trim() || student.className;
    student.classId = window.FIVIAExcelImport.normalizeClassCode(student.className);
    student.updatedAt = new Date().toISOString();

    window.FIVIAExcelImport.saveRoster(roster);
    alert('✅ DATA SISWA BERHASIL DIPERBARUI!');
    renderTeacherClassroomUI();
  }

  function archiveStudent(studentId) {
    const roster = window.FIVIAExcelImport.getExistingRoster();
    const student = roster.find(s => s.studentId === studentId);
    if (!student) return;

    if (confirm(`🗑️ NONAKTIFKAN SISWA?\n\nApakah Anda yakin ingin menonaktifkan siswa "${student.name}" (${student.studentCode})?\nProgress siswa tetap tersimpan aman di database.`)) {
      student.status = 'ARCHIVED';
      student.updatedAt = new Date().toISOString();
      window.FIVIAExcelImport.saveRoster(roster);
      alert('✅ SISWA BERHASIL DINONAKTIFKAN.');
      renderTeacherClassroomUI();
    }
  }

  function showCreateClassModal() {
    const name = prompt('Masukkan Nama Kelas Baru:', 'XI Fase F — Fisika 2');
    if (name) {
      const cls = window.FIVIAClassroom.createClassroom(name);
      alert(`🎉 KELAS BERHASIL DIBUAT!\n\nKode Sesi Kelas: ${cls.code}`);
      renderTeacherClassroomUI();
    }
  }

  function showCreateAssignmentModal() {
    const title = prompt('Masukkan Judul Tugas Baru:', 'Tugas Praktikum Newton');
    if (title) {
      window.FIVIAAssignment.createAssignment(title, 'Kerjakan eksperimen Newton Force Lab', 'LAB', 'lab_exp_03', 'cls_2045_x1', 3, 150);
      alert('🎉 TUGAS KELAS BERHASIL DIPUBLIKASIKAN!');
      renderAssignmentManagerUI();
    }
  }

  return {
    renderTeacherClassroomUI: renderTeacherClassroomUI,
    renderStudentMyClassroomUI: renderStudentMyClassroomUI,
    renderAssignmentManagerUI: renderAssignmentManagerUI,
    renderLiveMonitorUI: renderLiveMonitorUI,
    renderInterventionUI: renderInterventionUI,
    renderActivityLauncherUI: renderActivityLauncherUI,
    showCreateClassModal: showCreateClassModal,
    showCreateAssignmentModal: showCreateAssignmentModal,
    triggerExcelImport: triggerExcelImport,
    filterRosterTable: filterRosterTable,
    showAddStudentModal: showAddStudentModal,
    editStudent: editStudent,
    archiveStudent: archiveStudent
  };
})();

