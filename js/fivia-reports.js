/**
 * FIVIA PHYSICS QUEST - PHASE 4: REPORTS & DATA EXPORT MODULE
 * CSV Export, JSON Export, and Printable Teacher Reports
 */

window.FIVIAReports = (function() {
  'use strict';

  /**
   * Export Class Analytics to CSV File
   */
  function exportClassAnalyticsCSV() {
    const session = window.FIVIASession.getActiveSession();
    const students = session ? session.students : [];

    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += 'No,Student ID,Nama Siswa,Kelas,Skor Game,Total XP,Akurasi %,Tingkat Mastery,Badges,Tanggal Bergabung\n';

    students.forEach((s, idx) => {
      const badges = s.badges ? (Array.isArray(s.badges) ? s.badges.join(';') : s.badges) : '-';
      const line = [
        idx + 1,
        `"${s.studentId || ''}"`,
        `"${s.name || ''}"`,
        `"${s.class || ''}"`,
        s.score || 0,
        s.xp || 0,
        `${s.accuracy || 0}%`,
        `"${s.masteryLabel || s.masteryLevel || 'DEVELOPING'}"`,
        `"${badges}"`,
        `"${s.joinedAt || ''}"`
      ].join(',');
      csvContent += line + '\n';
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `FIVIA_Class_Analytics_${session ? session.className : 'Export'}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  /**
   * Export Class Analytics to JSON File
   */
  function exportClassAnalyticsJSON() {
    const session = window.FIVIASession.getActiveSession();
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(session, null, 2));
    const link = document.createElement('a');
    link.setAttribute('href', dataStr);
    link.setAttribute('download', `FIVIA_Class_Analytics_${session ? session.className : 'Export'}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  /**
   * Trigger Printable Teacher Assessment Report
   */
  function printTeacherReport() {
    const session = window.FIVIASession.getActiveSession();
    const students = session ? session.students : [];

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Mohon izinkan pop-up untuk mencetak laporan.');
      return;
    }

    const reportHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Laporan Hasil Pembelajaran FIVIA Physics Quest</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 30px; color: #1e293b; }
          h1 { color: #0f172a; margin-bottom: 4px; }
          .sub { color: #64748b; font-size: 0.9rem; margin-bottom: 24px; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #cbd5e1; padding: 10px 14px; text-align: left; font-size: 0.88rem; }
          th { background: #f1f5f9; font-weight: bold; }
          .badge { padding: 4px 8px; border-radius: 4px; font-weight: bold; font-size: 0.75rem; }
          .master { background: #d1fae5; color: #065f46; }
          .advanced { background: #dbeafe; color: #1e40af; }
          .proficient { background: #fef3c7; color: #92400e; }
          .remediation { background: #fee2e2; color: #991b1b; }
        </style>
      </head>
      <body>
        <h1>LAPORAN HASIL ASSESMEN & ANALISIS KELAS</h1>
        <div class="sub">FIVIA PHYSICS QUEST &bull; ${session ? session.sessionName : 'Sesi Fisika'} &bull; Tanggal Cetak: ${new Date().toLocaleDateString('id-ID')}</div>

        <div style="display: flex; gap: 20px; margin-bottom: 20px;">
          <div><strong>Guru:</strong> ${session ? session.teacherName : '-'}</div>
          <div><strong>Kelas:</strong> ${session ? session.className : '-'}</div>
          <div><strong>Kode Sesi:</strong> ${session ? session.sessionCode : '-'}</div>
          <div><strong>Total Siswa:</strong> ${students.length} Siswa</div>
        </div>

        <table>
          <thead>
            <tr>
              <th>No</th>
              <th>Nama Siswa</th>
              <th>Kelas</th>
              <th>Skor Game</th>
              <th>Total XP</th>
              <th>Akurasi</th>
              <th>Tingkat Mastery</th>
            </tr>
          </thead>
          <tbody>
            ${students.map((s, idx) => `
              <tr>
                <td>${idx + 1}</td>
                <td><strong>${s.name}</strong></td>
                <td>${s.class}</td>
                <td>${s.score || 0} PTS</td>
                <td>${s.xp || 0} XP</td>
                <td>${s.accuracy || 0}%</td>
                <td><span class="badge ${s.status === 'MASTER' ? 'master' : s.status === 'ADVANCED' ? 'advanced' : s.status === 'PROFICIENT' ? 'proficient' : 'remediation'}">${s.masteryLabel || s.masteryLevel}</span></td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div style="margin-top: 40px; text-align: right; font-size: 0.85rem; color: #64748b;">
          Dicetak secara otomatis melalui Sistem FIVIA Physics Quest Analytics Engine.
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
    exportClassAnalyticsCSV: exportClassAnalyticsCSV,
    exportClassAnalyticsJSON: exportClassAnalyticsJSON,
    printTeacherReport: printTeacherReport
  };
})();
