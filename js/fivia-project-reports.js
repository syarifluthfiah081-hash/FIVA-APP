/**
 * FIVIA PROJECT REPORTS MODULE
 * Printable Project Report Generator (PDF/Print)
 */

window.FIVIAProjectReports = window.FIVIAProjectReports || {};

window.FIVIAProjectReports.printProjectReport = function(projId) {
  'use strict';

  const project = window.FIVIAProjectsData.getProjectById(projId);
  const result = window.FIVIAProjectEngine.getSavedProjectResult(projId);
  const student = window.FIVIAStudent.getStudentProfile();

  if (!project || !result) {
    alert('Data hasil evaluasi proyek belum ditemukan.');
    return;
  }

  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Mohon izinkan pop-up untuk mencetak laporan proyek.');
    return;
  }

  const evalRes = result.evaluation;
  const formData = result.formData || {};

  const reportHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Laporan Proyek Real-World - ${project.title}</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 30px; color: #1e293b; line-height: 1.5; }
        h1 { color: #0f172a; margin-bottom: 4px; font-size: 1.8rem; }
        .sub { color: #64748b; font-size: 0.9rem; margin-bottom: 24px; border-bottom: 2px solid #cbd5e1; padding-bottom: 12px; }
        .section-title { font-weight: bold; color: #0369a1; font-size: 1.1rem; margin-top: 20px; margin-bottom: 8px; }
        .box { background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 8px; padding: 14px; margin-top: 6px; font-size: 0.9rem; }
        .rubric-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-top: 10px; }
        .rubric-card { background: #f1f5f9; padding: 8px 12px; border-radius: 6px; font-size: 0.8rem; }
      </style>
    </head>
    <body>
      <h1>LAPORAN PROYEK FISIKA REAL-WORLD</h1>
      <div class="sub">FIVIA PROJECT MISSION &bull; ${project.title} &bull; Tanggal Selesai: ${new Date(result.completedAt).toLocaleDateString('id-ID')}</div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 20px; font-size: 0.9rem;">
        <div><strong>Nama Siswa:</strong> ${student.name}</div>
        <div><strong>Kelas / Absen:</strong> ${student.class} (Absen: ${student.absen})</div>
        <div><strong>Judul Proyek:</strong> ${project.title}</div>
        <div><strong>Hasil Evaluasi Rubrik:</strong> ${evalRes.masteryTitle} (${evalRes.percentage}%)</div>
      </div>

      <div class="section-title">1. PERTANYAAN PENELITIAN & HIPOTESIS</div>
      <div class="box">
        <strong>Pertanyaan:</strong> ${formData.question || '-'}<br><br>
        <strong>Hipotesis Awal:</strong> ${formData.hypothesis || '-'}
      </div>

      <div class="section-title">2. IDENTIFIKASI VARIABEL & PROSEDUR</div>
      <div class="box">
        <strong>Variabel Bebas:</strong> ${formData.variables ? formData.variables.independent : '-'}<br>
        <strong>Variabel Terikat:</strong> ${formData.variables ? formData.variables.dependent : '-'}<br>
        <strong>Variabel Kontrol:</strong> ${formData.variables ? formData.variables.control : '-'}
      </div>

      <div class="section-title">3. DATA PENGAMATAN & HASIL SIMULASI</div>
      <div class="box">${formData.data || 'Data pengamatan simulasi berhasil dicatat.'}</div>

      <div class="section-title">4. ANALISIS DATA & PEMBAHASAN</div>
      <div class="box">${formData.analysis || 'Analisis pembahasan sesuai prinsip ilmiah.'}</div>

      <div class="section-title">5. KESIMPULAN & REFLEKSI</div>
      <div class="box">
        <strong>Kesimpulan:</strong> ${formData.conclusion || '-'}<br><br>
        <strong>Refleksi:</strong> ${formData.reflection || '-'}
      </div>

      <div class="section-title">6. RUBRIK EVALUASI KINERJA (36 PTS MAX)</div>
      <div class="rubric-grid">
        ${evalRes.categories.map(c => `
          <div class="rubric-card">
            <strong>${c.name}:</strong> ${c.score} / 4 PTS
          </div>
        `).join('')}
      </div>

      <div style="margin-top: 50px; display: flex; justify-content: space-between; font-size: 0.9rem;">
        <div>
          <div>Siswa Praktikan,</div>
          <br><br><br>
          <div><strong>(${student.name})</strong></div>
        </div>
        <div>
          <div>Guru Penilai Proyek,</div>
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
};
