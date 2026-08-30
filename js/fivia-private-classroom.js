/**
 * FIVIA PRIVATE CLASSROOM MODULE
 * Phase 8: Private Classroom Settings & Printable Student Access Code Sheet
 */

window.FIVIAPrivateClassroom = (function() {
  'use strict';

  function printStudentCards(classId) {
    const classrooms = window.FIVIAClassroom.getClassrooms();
    const cls = classrooms.find(c => c.id === classId) || classrooms[0];
    const roster = window.FIVIAClassroom.getRoster(cls.id);
    const teacher = window.FIVIAPrivateAccess.getTeacherSettings();

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Mohon izinkan pop-up untuk mencetak kartu akses siswa.');
      return;
    }

    const cardsHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>KARTU AKSES SISWA - ${cls.name}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; color: #0f172a; }
          h1 { text-align: center; font-size: 1.5rem; margin-bottom: 4px; }
          .sub { text-align: center; font-size: 0.85rem; color: #64748b; margin-bottom: 20px; border-bottom: 2px solid #cbd5e1; padding-bottom: 8px; }
          .grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }
          .card { border: 2px dashed #06b6d4; border-radius: 12px; padding: 14px; background: #f8fafc; font-size: 0.85rem; }
          .card-title { font-weight: bold; color: #0284c7; margin-bottom: 6px; font-size: 0.95rem; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px; }
          .code-box { background: #e0f2fe; border: 1px solid #0284c7; padding: 4px 8px; border-radius: 6px; font-family: monospace; font-weight: bold; color: #0369a1; }
        </style>
      </head>
      <body>
        <h1>FIVIA PHYSICS QUEST — KARTU AKSES SISWA</h1>
        <div class="sub">Kelas: ${cls.name} &bull; Sekolah: ${teacher.schoolName} &bull; Kode Kelas: <span class="code-box">${cls.code}</span></div>

        <div class="grid">
          ${roster.map(s => `
            <div class="card">
              <div class="card-title">FIVIA STUDENT ACCESS CARD</div>
              <div><strong>Nama Siswa:</strong> ${s.displayName}</div>
              <div><strong>Kelas:</strong> ${cls.name}</div>
              <div style="margin-top: 6px;"><strong>Kode Siswa:</strong> <span class="code-box">${s.displayName.slice(0,3).toUpperCase()}-${Math.floor(100+Math.random()*900)}</span></div>
              <div><strong>Kode Kelas:</strong> <span class="code-box">${cls.code}</span></div>
            </div>
          `).join('')}
        </div>

        <script>
          window.onload = function() { window.print(); };
        </script>
      </body>
      </html>
    `;

    printWindow.document.write(cardsHtml);
    printWindow.document.close();
  }

  return {
    printStudentCards: printStudentCards
  };
})();
