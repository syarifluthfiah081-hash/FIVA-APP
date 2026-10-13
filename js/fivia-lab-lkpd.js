/**
 * FIVIA VIRTUAL PHYSICS LAB - DIGITAL LKPD MODULE
 * Interactive Digital Student Worksheet (LKPD) & Auto-Save
 */

window.FIVIALabLKPD = (function() {
  'use strict';

  const STORAGE_KEY = 'fivia_lab_lkpd';

  /**
   * Get Saved LKPD Data for Current Experiment
   */
  function getLKPDData(expId) {
    const allLkpd = window.FIVIAStudent.safeStorageGet(STORAGE_KEY, {});
    return allLkpd[expId] || null;
  }

  /**
   * Save Digital LKPD Form State
   */
  function saveLKPDData(expId, lkpdObject) {
    const allLkpd = window.FIVIAStudent.safeStorageGet(STORAGE_KEY, {});
    allLkpd[expId] = {
      ...lkpdObject,
      updatedAt: new Date().toISOString()
    };
    window.FIVIAStudent.safeStorageSet(STORAGE_KEY, allLkpd);
    return allLkpd[expId];
  }

  /**
   * Render Digital LKPD Form UI
   */
  function renderLKPDFormUI() {
    const container = document.getElementById('fq-lab-lkpd-container');
    const currentExp = window.FIVIALabEngine.getCurrentExp();
    const student = window.FIVIAStudent.getStudentProfile();
    const measurements = window.FIVIALabEngine.getMeasurements();

    if (!container || !currentExp) return;

    const savedLkpd = getLKPDData(currentExp.id) || {};

    container.innerHTML = `
      <div style="background: rgba(15, 23, 42, 0.95); border: 2.5px solid var(--fq-cyan); border-radius: 28px; padding: 36px; text-align: left; box-shadow: 0 0 50px var(--fq-cyan-glow);">
        <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 2px solid var(--fq-border-cyan); padding-bottom: 16px; margin-bottom: 24px; flex-wrap: wrap; gap: 12px;">
          <div>
            <span class="fq-badge-pill"><i class="fas fa-file-signature"></i> DIGITAL LEMBAR KERJA PESERTA DIDIK (LKPD)</span>
            <h1 style="font-size: 2.2rem; font-weight: 900; color: #fff; margin: 4px 0;">${currentExp.title}</h1>
            <div style="color: var(--fq-cyan); font-weight: 700;">Topik: ${currentExp.topic}</div>
          </div>
          <div style="display: flex; gap: 10px;">
            <button class="fq-btn fq-btn-emerald" onclick="window.FIVIALabLKPD.saveFromUI()"><i class="fas fa-save"></i> SIMPAN LKPD</button>
            <button class="fq-btn fq-btn-amber" onclick="window.FIVIAReports.printLabReport()"><i class="fas fa-print"></i> CETAK LAPORAN</button>
          </div>
        </div>

        <!-- Section A: Identitas Siswa -->
        <div style="background: rgba(30, 41, 59, 0.7); border: 1px solid var(--fq-border); border-radius: 20px; padding: 20px; margin-bottom: 20px;">
          <h3 style="color: var(--fq-amber); font-size: 1.1rem; margin: 0 0 14px 0;"><i class="fas fa-user-graduate"></i> A. IDENTITAS PESERTA DIDIK</h3>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px;">
            <div>
              <label class="fq-form-label">Nama Siswa</label>
              <input type="text" id="fq-lkpd-name" class="fq-input" value="${savedLkpd.name || student.name || ''}">
            </div>
            <div>
              <label class="fq-form-label">Kelas / Absen</label>
              <input type="text" id="fq-lkpd-class" class="fq-input" value="${savedLkpd.class || student.class || ''}">
            </div>
            <div>
              <label class="fq-form-label">Tanggal Praktikum</label>
              <input type="text" id="fq-lkpd-date" class="fq-input" value="${savedLkpd.date || new Date().toLocaleDateString('id-ID')}">
            </div>
          </div>
        </div>

        <!-- Section B & C: Tujuan & Alat -->
        <div style="background: rgba(30, 41, 59, 0.5); border: 1px solid var(--fq-border); border-radius: 20px; padding: 20px; margin-bottom: 20px;">
          <h3 style="color: var(--fq-cyan); font-size: 1.1rem; margin: 0 0 10px 0;"><i class="fas fa-bullseye"></i> B. TUJUAN & ALAT PRAKTIKUM</h3>
          <p style="color: #fff; font-size: 0.92rem; margin-bottom: 10px;">${currentExp.objectives.join('; ')}</p>
          <div style="font-size: 0.85rem; color: var(--fq-text-muted);">Alat: ${currentExp.apparatus ? currentExp.apparatus.map(a => a.name).join(', ') : 'Virtual Simulation Apparatus'}</div>
        </div>

        <!-- Section H: Tabel Data Pengamatan Otomatis -->
        <div style="background: rgba(30, 41, 59, 0.7); border: 1px solid var(--fq-border-cyan); border-radius: 20px; padding: 20px; margin-bottom: 20px;">
          <h3 style="color: var(--fq-amber); font-size: 1.1rem; margin: 0 0 14px 0;"><i class="fas fa-table"></i> H. TABEL DATA HASIL PENGAMATAN</h3>
          <div style="overflow-x: auto;">
            <table class="fq-student-table">
              <thead>
                <tr>
                  <th>NO</th>
                  <th>WAKTU SIMULASI (s)</th>
                  <th>KONDISI SIMULASI</th>
                  <th>HASIL PENGUKURAN DARI SIMULASI</th>
                </tr>
              </thead>
              <tbody>
                ${measurements.length === 0 ? `
                  <tr><td colspan="4" style="text-align: center; color: var(--fq-text-muted); padding: 16px;">Belum ada data pengamatan. Silakan jalankan simulasi di tab eksperimen terlebih dahulu.</td></tr>
                ` : measurements.map((m, idx) => `
                  <tr>
                    <td>${idx + 1}</td>
                    <td>${Math.round((m.time || 0) * 10) / 10} s</td>
                    <td>${m.object || `m=${m.mass || '-'}, F=${m.force || '-'}`}</td>
                    <td><strong>${m.acceleration ? `a = ${Math.round(m.acceleration * 100) / 100} m/s²` : m.velocity ? `v = ${Math.round(m.velocity * 100) / 100} m/s` : m.power ? `P = ${m.power} W` : `L = ${m.lengthMm} mm`}</strong></td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>

        <!-- Section I & J: Analisis & Kesimpulan Digital Fields -->
        <div style="background: rgba(30, 41, 59, 0.7); border: 1px solid var(--fq-border); border-radius: 20px; padding: 20px; margin-bottom: 24px;">
          <div class="fq-form-group">
            <label class="fq-form-label" style="color: var(--fq-cyan);"><i class="fas fa-calculator"></i> I. ANALISIS DATA & PEMBAHASAN SAYA:</label>
            <textarea id="fq-lkpd-analysis" class="fq-input" style="height: 100px; font-family: inherit;" placeholder="Tuliskan hasil perhitungan dan pembahasan grafik data Anda di sini...">${savedLkpd.analysis || ''}</textarea>
          </div>
          <div class="fq-form-group">
            <label class="fq-form-label" style="color: var(--fq-emerald);"><i class="fas fa-check-circle"></i> J. KESIMPULAN HASIL EKSPERIMEN:</label>
            <textarea id="fq-lkpd-conclusion" class="fq-input" style="height: 90px; font-family: inherit;" placeholder="Tuliskan kesimpulan ilmiah Anda berdasarkan data pengamatan di atas...">${savedLkpd.conclusion || ''}</textarea>
          </div>
        </div>

        <div style="display: flex; gap: 14px; flex-wrap: wrap;">
          <button class="fq-btn fq-btn-cyan fq-btn-lg" style="flex: 1; min-width: 220px;" onclick="window.FIVIALabLKPD.saveFromUI()"><i class="fas fa-save"></i> SIMPAN LKPD & DAPATKAN +50 XP</button>
          <button class="fq-btn fq-btn-outline fq-btn-lg" style="border-color: #25d366; color: #25d366;" onclick="if(window.shareCurrentLKPD) window.shareCurrentLKPD(); else window.FIVIALabLKPD.shareLKPD();"><i class="fab fa-whatsapp"></i> BAGIKAN KE GURU (WA/SALIN)</button>
          <button class="fq-btn fq-btn-outline fq-btn-lg" onclick="window.location.hash='#quest/virtual-lab'"><i class="fas fa-arrow-left"></i> KEMBALI KE LAB</button>
        </div>
      </div>
    `;
  }

  function saveFromUI() {
    const currentExp = window.FIVIALabEngine.getCurrentExp();
    if (!currentExp) return;

    const name = document.getElementById('fq-lkpd-name') ? document.getElementById('fq-lkpd-name').value.trim() : '';
    const className = document.getElementById('fq-lkpd-class') ? document.getElementById('fq-lkpd-class').value.trim() : '';
    const date = document.getElementById('fq-lkpd-date') ? document.getElementById('fq-lkpd-date').value.trim() : '';
    const analysis = document.getElementById('fq-lkpd-analysis') ? document.getElementById('fq-lkpd-analysis').value.trim() : '';
    const conclusion = document.getElementById('fq-lkpd-conclusion') ? document.getElementById('fq-lkpd-conclusion').value.trim() : '';

    const lkpdObj = {
      name: name,
      class: className,
      date: date,
      analysis: analysis,
      conclusion: conclusion
    };

    saveLKPDData(currentExp.id, lkpdObj);

    // Also push to central database for Teacher Dashboard & Cloud Sync
    if (window.db && typeof window.db.submitLKPD === "function") {
      const curUser = (window.auth && typeof window.auth.getCurrentUser === "function") ? window.auth.getCurrentUser() : null;
      const studentProfile = (window.FIVIAStudent && window.FIVIAStudent.getStudentProfile) ? window.FIVIAStudent.getStudentProfile() : null;
      const measurements = (window.FIVIALabEngine && window.FIVIALabEngine.getMeasurements) ? window.FIVIALabEngine.getMeasurements() : [];
      
      const expNum = parseInt(String(currentExp.id).replace(/[^0-9]/g, ''), 10) || 1;
      const finalStudentId = (curUser && curUser.id) ? curUser.id : (studentProfile && studentProfile.studentId ? studentProfile.studentId : `std_${(name || 'siswa').toLowerCase().replace(/[^a-z0-9]/g, '')}`);
      const finalStudentName = name || (curUser ? (curUser.name || curUser.displayName) : (studentProfile ? studentProfile.name : "Siswa Praktikum"));
      const finalClassName = className || (curUser ? (curUser.className || curUser.classId) : (studentProfile ? studentProfile.class : "Kelas X-1"));
      const finalNis = (curUser && curUser.nis) ? curUser.nis : (studentProfile && studentProfile.absen ? studentProfile.absen : "-");
      const finalCode = (curUser && curUser.studentCode) ? curUser.studentCode : (finalNis !== "-" ? ('FIVIA-' + finalNis) : "STD");
      
      const submissionPayload = {
        id: `sub_${finalStudentId}_${expNum}`,
        studentId: finalStudentId,
        studentName: finalStudentName,
        studentNis: finalNis,
        studentCode: finalCode,
        className: finalClassName,
        labId: expNum,
        labName: currentExp.title || currentExp.topic || `Laboratorium Fisika #${expNum}`,
        hypothesis: "Data pengamatan dan analisis laboratorium virtual",
        observations: measurements.map((m, idx) => ({
          no: idx + 1,
          time: `${Math.round((m.time || 0) * 10) / 10} s`,
          obj: m.object || `m=${m.mass || '-'}, F=${m.force || '-'}`,
          hasil: m.acceleration ? `a = ${Math.round(m.acceleration * 100) / 100} m/s²` : m.velocity ? `v = ${Math.round(m.velocity * 100) / 100} m/s` : (m.lengthMm ? `${m.lengthMm} mm` : '-')
        })),
        answers: [
          { questionId: "q1", answerText: analysis || "-" },
          { questionId: "q2", answerText: conclusion || "-" }
        ],
        conclusion: conclusion || "-",
        status: "pending",
        timestamp: new Date().toISOString()
      };
      
      window.db.submitLKPD(submissionPayload);
      if (window.syncLocalChangeToCloud) {
        window.syncLocalChangeToCloud("submissions", submissionPayload);
      }
    }

    if (window.FIVIALabAnalytics && typeof window.FIVIALabAnalytics.recordLabCompletion === "function") {
      window.FIVIALabAnalytics.recordLabCompletion(currentExp.id, 50);
    }
    alert('🎉 LKPD DIGITAL BERHASIL DISIMPAN!\n\nData lembar kerja Anda telah dikirim ke Server Guru Pak Syarif.');
  }

  return {
    getLKPDData: getLKPDData,
    saveLKPDData: saveLKPDData,
    renderLKPDFormUI: renderLKPDFormUI,
    saveFromUI: saveFromUI
  };
})();
