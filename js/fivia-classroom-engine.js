/**
 * FIVIA CLASSROOM ENGINE MODULE
 * Phase 7: Classroom State Machine, Activity Launcher & UI View Renderers
 */

window.FIVIAClassroomEngine = (function() {
  'use strict';

  function renderTeacherClassroomUI() {
    const container = document.getElementById('fq-classroom-container');
    if (!container) return;

    const classrooms = window.FIVIAClassroom.getClassrooms();
    const activeCls = classrooms[0] || {};
    const roster = window.FIVIAClassroom.getRoster(activeCls.id);

    container.innerHTML = `
      <div style="background: rgba(15, 23, 42, 0.95); border: 2.5px solid var(--fq-cyan); border-radius: 28px; padding: 32px; text-align: left;">
        <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 2px solid var(--fq-border-cyan); padding-bottom: 16px; margin-bottom: 24px; flex-wrap: wrap; gap: 12px;">
          <div>
            <span class="fq-badge-pill"><i class="fas fa-chalkboard-teacher"></i> TEACHER COMMAND CENTER</span>
            <h1 style="font-size: 2.2rem; font-weight: 900; color: #fff; margin: 4px 0;">MANAGEMENT KELAS FISIKA</h1>
            <div style="color: var(--fq-cyan); font-weight: 700;">Kode Sesi Kelas: <strong style="color: var(--fq-amber); font-size: 1.2rem;">${activeCls.code || 'FIVIA-XIF-2045'}</strong></div>
          </div>
          <div style="display: flex; gap: 10px; flex-wrap: wrap;">
            <button class="fq-btn fq-btn-cyan" onclick="window.FIVIAClassroomEngine.showCreateClassModal()"><i class="fas fa-plus-circle"></i> BUAT KELAS BARU</button>
            <button class="fq-btn fq-btn-emerald" onclick="window.FIVIAClassroomReports.exportClassroomCSV('${activeCls.id}')"><i class="fas fa-file-csv"></i> EKSPOR CSV</button>
            <button class="fq-btn fq-btn-amber" onclick="window.FIVIAClassroomReports.printClassroomReport('${activeCls.id}')"><i class="fas fa-print"></i> CETAK LAPORAN</button>
          </div>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-bottom: 28px;">
          <div style="background: rgba(30,41,59,0.7); border: 1px solid var(--fq-border-cyan); border-radius: 18px; padding: 18px;">
            <div style="font-size: 0.8rem; color: var(--fq-text-muted);">TOTAL SISWA TERDAFTAR</div>
            <div style="font-size: 1.8rem; font-weight: 900; color: #fff;">${roster.length} Siswa</div>
          </div>
          <div style="background: rgba(30,41,59,0.7); border: 1px solid var(--fq-border-cyan); border-radius: 18px; padding: 18px;">
            <div style="font-size: 0.8rem; color: var(--fq-text-muted);">SISWA AKTIF HARI INI</div>
            <div style="font-size: 1.8rem; font-weight: 900; color: var(--fq-emerald);">4 Siswa</div>
          </div>
          <div style="background: rgba(30,41,59,0.7); border: 1px solid var(--fq-border-cyan); border-radius: 18px; padding: 18px;">
            <div style="font-size: 0.8rem; color: var(--fq-text-muted);">RATA-RATA AKURASI KELAS</div>
            <div style="font-size: 1.8rem; font-weight: 900; color: var(--fq-cyan);">85.4%</div>
          </div>
        </div>

        <h3 style="color: var(--fq-cyan); font-size: 1.2rem; margin: 0 0 16px 0;"><i class="fas fa-users"></i> DAFTAR SISWA ANGGOTA KELAS (${activeCls.name || 'XI Fase F'}):</h3>
        <div style="overflow-x: auto;">
          <table class="fq-student-table">
            <thead>
              <tr>
                <th>NO</th>
                <th>NAMA SISWA</th>
                <th>TOTAL XP</th>
                <th>AKURASI MASTERY</th>
                <th>PRAKTIKUM LAB</th>
                <th>PROYEK REAL-WORLD</th>
                <th>AKSI</th>
              </tr>
            </thead>
            <tbody>
              ${roster.map((s, idx) => `
                <tr>
                  <td>${idx + 1}</td>
                  <td><strong>${s.displayName}</strong></td>
                  <td><span class="fq-badge-pill" style="margin: 0; color: var(--fq-amber); border-color: var(--fq-amber);">${s.totalXP} XP</span></td>
                  <td>${s.mastery}</td>
                  <td>${s.labProgress}</td>
                  <td>${s.projectProgress}</td>
                  <td>
                    <button class="fq-btn fq-btn-outline" style="min-height: 34px; padding: 4px 10px; font-size: 0.78rem;" onclick="alert('Membuka detail analitik individual ${s.displayName}')">DETAIL</button>
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
    showCreateAssignmentModal: showCreateAssignmentModal
  };
})();
