/**
 * FIVIA QUICK START & STUDENT FAST JOIN MODULE
 * Phase 10: 2-Minute Teacher Setup Wizard & 1-Tap Student Device Login
 */

window.FIVIAQuickStart = (function() {
  'use strict';

  function copyClassroomCode(code) {
    const clsCode = code || 'FIVIA-XIF-2045';
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(clsCode).then(() => {
        alert(`📋 KODE KELAS "${clsCode}" BERHASIL DISALIN!`);
      }).catch(() => {
        fallbackCopy(clsCode);
      });
    } else {
      fallbackCopy(clsCode);
    }
  }

  function fallbackCopy(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand('copy');
      alert(`📋 KODE KELAS "${text}" BERHASIL DISALIN!`);
    } catch (err) {
      alert(`Kode Kelas: ${text}`);
    }
    document.body.removeChild(textArea);
  }

  function renderQuickStartUI() {
    const container = document.getElementById('fq-quick-start-container');
    if (!container) return;

    const teacher = window.FIVIAPrivateAccess.getTeacherSettings();
    const classrooms = window.FIVIAClassroom.getClassrooms();
    const activeCls = classrooms[0] || { name: 'XI Fase F', code: 'FIVIA-XIF-2045' };
    const roster = window.FIVIAClassroom.getRoster(activeCls.id);

    container.innerHTML = `
      <div style="background: rgba(15, 23, 42, 0.95); border: 2.5px solid var(--fq-cyan); border-radius: 28px; padding: 36px; text-align: left;">
        <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 2px solid var(--fq-border-cyan); padding-bottom: 16px; margin-bottom: 24px; flex-wrap: wrap; gap: 12px;">
          <div>
            <span class="fq-badge-pill"><i class="fas fa-magic"></i> TEACHER QUICK START WIZARD</span>
            <h1 style="font-size: 2.2rem; font-weight: 900; color: #fff; margin: 4px 0;">MULAI KELAS DALAM 2 MENIT</h1>
            <div style="color: var(--fq-cyan); font-weight: 700;">Pengaturan Cepat Pembelajaran Privat Hari Ini</div>
          </div>
          <button class="fq-btn fq-btn-outline" onclick="window.location.hash='#quest/teacher-home'"><i class="fas fa-arrow-left"></i> KEMBALI</button>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px; margin-bottom: 28px;">
          <div style="background: rgba(30,41,59,0.7); border: 1.5px solid var(--fq-border-cyan); border-radius: 20px; padding: 20px;">
            <div style="font-size: 0.8rem; color: var(--fq-cyan); font-weight: 800; margin-bottom: 4px;">STEP 1: IDENTITAS GURU & KELAS</div>
            <h3 style="font-size: 1.1rem; font-weight: 800; color: #fff; margin: 0 0 6px 0;">${teacher.teacherName}</h3>
            <div style="font-size: 0.85rem; color: var(--fq-text-muted);">${teacher.schoolName} &bull; ${activeCls.name}</div>
          </div>

          <div style="background: rgba(30,41,59,0.7); border: 1.5px solid var(--fq-amber); border-radius: 20px; padding: 20px; text-align: center;">
            <div style="font-size: 0.8rem; color: var(--fq-amber); font-weight: 800; margin-bottom: 4px;">STEP 2: KODE KELAS UNTOK SISWA</div>
            <div style="font-size: 2.2rem; font-weight: 900; font-family: monospace; color: var(--fq-amber); margin: 4px 0;">${activeCls.code}</div>
            <button class="fq-btn fq-btn-amber" style="min-height: 40px; padding: 6px 16px; font-size: 0.85rem; width: 100%;" onclick="window.FIVIAQuickStart.copyClassroomCode('${activeCls.code}')"><i class="fas fa-copy"></i> SALIN KODE KELAS</button>
          </div>
        </div>

        <div style="display: flex; gap: 14px; flex-wrap: wrap;">
          <button class="fq-btn fq-btn-cyan fq-btn-lg" style="flex: 1;" onclick="window.location.hash='#quest/active-session'"><i class="fas fa-play-circle"></i> 🚀 MULAI KELAS SEKARANG</button>
          <button class="fq-btn fq-btn-emerald fq-btn-lg" style="flex: 1;" onclick="window.location.hash='#quest/projector'"><i class="fas fa-tv"></i> 🖥️ TAMPILKAN PROYEKSI</button>
          <button class="fq-btn fq-btn-outline fq-btn-lg" onclick="window.FIVIAPrivateClassroom.printStudentCards('${activeCls.id}')"><i class="fas fa-print"></i> 🖨️ CETAK KARTU SISWA</button>
        </div>
      </div>
    `;
  }

  return {
    copyClassroomCode: copyClassroomCode,
    renderQuickStartUI: renderQuickStartUI
  };
})();
