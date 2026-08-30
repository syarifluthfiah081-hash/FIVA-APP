/**
 * FIVIA VIRTUAL PHYSICS LAB - REPORT GENERATOR
 * Printable Lab Report Renderer (PDF/Print)
 */

window.FIVIAReports = window.FIVIAReports || {};

window.FIVIAReports.printLabReport = function() {
  'use strict';

  const currentExp = window.FIVIALabEngine.getCurrentExp();
  const measurements = window.FIVIALabEngine.getMeasurements();
  const student = window.FIVIAStudent.getStudentProfile();
  const lkpdData = window.FIVIALabLKPD.getLKPDData(currentExp ? currentExp.id : '') || {};

  if (!currentExp) {
    alert('Tidak ada data eksperimen aktif.');
    return;
  }

  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Mohon izinkan pop-up untuk mencetak laporan eksperimen.');
    return;
  }

  const reportHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Laporan Praktikum Virtual Lab - ${currentExp.title}</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 30px; color: #1e293b; line-height: 1.5; }
        h1 { color: #0f172a; margin-bottom: 4px; font-size: 1.8rem; }
        .sub { color: #64748b; font-size: 0.9rem; margin-bottom: 24px; border-bottom: 2px solid #cbd5e1; padding-bottom: 12px; }
        .section-title { font-weight: bold; color: #0369a1; font-size: 1.1rem; margin-top: 20px; margin-bottom: 8px; }
        table { width: 100%; border-collapse: collapse; margin-top: 10px; }
        th, td { border: 1px solid #cbd5e1; padding: 8px 12px; text-align: left; font-size: 0.85rem; }
        th { background: #f1f5f9; font-weight: bold; }
        .box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px; margin-top: 8px; }
      </style>
    </head>
    <body>
      <h1>LAPORAN PRAKTIKUM FISIKA VIRTUAL</h1>
      <div class="sub">FIVIA VIRTUAL LABORATORY &bull; ${currentExp.title} &bull; Tanggal: ${lkpdData.date || new Date().toLocaleDateString('id-ID')}</div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 20px;">
        <div><strong>Nama Siswa:</strong> ${lkpdData.name || student.name || '-'}</div>
        <div><strong>Kelas / Absen:</strong> ${lkpdData.class || student.class || '-'}</div>
        <div><strong>Topik:</strong> ${currentExp.topic}</div>
        <div><strong>Status LKPD:</strong> ✓ DISIMPANKAN</div>
      </div>

      <div class="section-title">A. TUJUAN EKSPERIMEN</div>
      <div class="box">${currentExp.objectives.join('<br>')}</div>

      <div class="section-title">B. TABEL DATA HASIL PENGAMATAN</div>
      <table>
        <thead>
          <tr>
            <th>No</th>
            <th>Waktu (s)</th>
            <th>Kondisi Variabel</th>
            <th>Hasil Pengukuran Simulasi</th>
          </tr>
        </thead>
        <tbody>
          ${measurements.map((m, idx) => `
            <tr>
              <td>${idx + 1}</td>
              <td>${Math.round((m.time || 0) * 10) / 10} s</td>
              <td>${m.object || `m=${m.mass || '-'}, F=${m.force || '-'}`}</td>
              <td><strong>${m.acceleration ? `a = ${Math.round(m.acceleration * 100) / 100} m/s²` : m.velocity ? `v = ${Math.round(m.velocity * 100) / 100} m/s` : m.power ? `P = ${m.power} W` : `L = ${m.lengthMm} mm`}</strong></td>
            </tr>
          `).join('')}
        </tbody>
      </table>

      <div class="section-title">C. ANALISIS DATA & PEMBAHASAN</div>
      <div class="box">${lkpdData.analysis || 'Analisis data praktikum berjalan sesuai hukum fisika.'}</div>

      <div class="section-title">D. KESIMPULAN</div>
      <div class="box">${lkpdData.conclusion || 'Hasil pengamatan praktikum membuktikan kesesuaian teori dan eksperimen.'}</div>

      <div style="margin-top: 50px; display: flex; justify-content: space-between;">
        <div>
          <div>Siswa Praktikan,</div>
          <br><br><br>
          <div><strong>(${lkpdData.name || student.name || 'Siswa'})</strong></div>
        </div>
        <div>
          <div>Guru Pembimbing Fisika,</div>
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
