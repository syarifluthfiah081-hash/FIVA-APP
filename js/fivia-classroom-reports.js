/**
 * FIVIA CLASSROOM REPORTS & ANALYTICS MODULE
 * Phase 7: Classroom Progress Matrix, Concept Heatmap & Printable Reports
 */

window.FIVIAClassroomReports = (function() {
  'use strict';

  function exportClassroomCSV(classId) {
    const roster = window.FIVIAClassroom.getRoster(classId);
    let csv = "Nama Siswa,Kelas,Total XP,Mastery,Status Lab,Status Proyek,Jumlah Lencana,Status Intervensi\n";

    roster.forEach(s => {
      csv += `"${s.displayName}","${s.classId}","${s.totalXP}","${s.mastery}","${s.labProgress}","${s.projectProgress}","${s.badgeCount}","${s.interventionStatus}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `FIVIA_Classroom_Analytics_${classId || 'Report'}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  function exportClassroomJSON(classId) {
    const roster = window.FIVIAClassroom.getRoster(classId);
    const classrooms = window.FIVIAClassroom.getClassrooms();
    const data = {
      classrooms: classrooms,
      roster: roster,
      exportedAt: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `FIVIA_Classroom_Analytics_${classId || 'Report'}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  function printClassroomReport(classId) {
    const classrooms = window.FIVIAClassroom.getClassrooms();
    const cls = classrooms.find(c => c.id === classId) || classrooms[0];
    const roster = window.FIVIAClassroom.getRoster(cls.id);

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Mohon izinkan pop-up untuk mencetak laporan kelas.');
      return;
    }

    const reportHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Laporan Analitik Kelas - ${cls.name}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 30px; color: #1e293b; line-height: 1.5; }
          h1 { color: #0f172a; margin-bottom: 4px; font-size: 1.8rem; }
          .sub { color: #64748b; font-size: 0.9rem; margin-bottom: 24px; border-bottom: 2px solid #cbd5e1; padding-bottom: 12px; }
          table { width: 100%; border-collapse: collapse; margin-top: 10px; }
          th, td { border: 1px solid #cbd5e1; padding: 8px 12px; text-align: left; font-size: 0.85rem; }
          th { background: #f1f5f9; font-weight: bold; }
        </style>
      </head>
      <body>
        <h1>LAPORAN ANALITIK KELAS & KINERJA SISWA</h1>
        <div class="sub">FIVIA CLASSROOM COMMAND CENTER &bull; ${cls.name} (${cls.code}) &bull; Tanggal: ${new Date().toLocaleDateString('id-ID')}</div>

        <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-bottom: 20px; font-size: 0.9rem;">
          <div><strong>Total Siswa:</strong> ${roster.length} Orang</div>
          <div><strong>Mata Pelajaran:</strong> ${cls.subject}</div>
          <div><strong>Tahun Ajaran:</strong> ${cls.academicYear}</div>
          <div><strong>Tingkat:</strong> ${cls.grade}</div>
        </div>

        <table>
          <thead>
            <tr>
              <th>No</th>
              <th>Nama Siswa</th>
              <th>Total XP</th>
              <th>Akurasi Mastery</th>
              <th>Praktikum Lab</th>
              <th>Proyek Real-World</th>
              <th>Lencana</th>
            </tr>
          </thead>
          <tbody>
            ${roster.map((s, idx) => `
              <tr>
                <td>${idx + 1}</td>
                <td><strong>${s.displayName}</strong></td>
                <td>${s.totalXP} XP</td>
                <td>${s.mastery}</td>
                <td>${s.labProgress}</td>
                <td>${s.projectProgress}</td>
                <td>${s.badgeCount} Badges</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div style="margin-top: 50px; display: flex; justify-content: space-between; font-size: 0.9rem;">
          <div>
            <div>Guru Pengampu Fisika,</div>
            <br><br><br>
            <div><strong>(...........................................)</strong></div>
          </div>
          <div>
            <div>Kepala Laboratorium Fisika,</div>
            <br><br><br>
            <div><strong>(...........................................)</strong></div>
          </div>
        </div>

        <script>
          window.onload = function() { window.print(); };
        </script>
      </body>
      </html>
    `;

    printWindow.document.write(reportHtml);
    printWindow.document.close();
  }

  return {
    exportClassroomCSV: exportClassroomCSV,
    exportClassroomJSON: exportClassroomJSON,
    printClassroomReport: printClassroomReport
  };
})();
