/**
 * FIVIA PRODUCTION CLASSROOM FLOW & BACKUP CENTER MODULE
 * Phase 10: Production Hardening, Anti-XP Farming Guard, Auto-Recommendation Engine & Backup Center
 */

window.FIVIAClassroomFlow = (function() {
  'use strict';

  function awardXPWithAntiFarmGuard(studentId, xpAmount, activityId) {
    const completionId = `${studentId}_${activityId}`;
    if (window.FIVIADataValidator.isEventAlreadyProcessed(completionId)) {
      console.warn(`[Anti-XP Farm Guard] Event ${completionId} already awarded. Skipping duplicate XP.`);
      return { awarded: false, message: 'Event XP sudah pernah diperoleh (Farm Protected).' };
    }

    window.FIVIADataValidator.markEventProcessed(completionId);
    
    // Add XP to student profile
    const profile = window.FIVIAStudent.getStudentProfile();
    profile.xp = (profile.xp || 0) + xpAmount;
    window.FIVIAStudent.saveStudentProfile(profile);

    return { awarded: true, newXP: profile.xp, message: `🎉 SELAMAT! PEROLEHAN +${xpAmount} XP BERHASIL DITAMBAHKAN!` };
  }

  function getConceptRecommendations(accuracyMap) {
    const recommendations = [];
    const acc = accuracyMap || { dimensi: 55, besaran: 85, satuan: 90 };

    if (acc.dimensi < 60) {
      recommendations.push({
        concept: 'Analisis Dimensi',
        status: 'WEAK',
        recommendedModule: 'Dimension Detective',
        route: '#quest/dimension-detective',
        actionText: 'Mulai Remediasi Dimensi'
      });
    }

    if (acc.besaran < 60) {
      recommendations.push({
        concept: 'Besaran Pokok & Turunan',
        status: 'WEAK',
        recommendedModule: 'Besaran Hunter',
        route: '#quest/besaran-hunter',
        actionText: 'Mulai Remediasi Besaran'
      });
    }

    return recommendations;
  }

  function renderBackupCenterUI() {
    const container = document.getElementById('fq-backup-center-container');
    if (!container) return;

    container.innerHTML = `
      <div style="background: rgba(15, 23, 42, 0.95); border: 2.5px solid var(--fq-cyan); border-radius: 28px; padding: 32px; text-align: left;">
        <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 2px solid var(--fq-border-cyan); padding-bottom: 16px; margin-bottom: 24px;">
          <div>
            <span class="fq-badge-pill"><i class="fas fa-database"></i> PRODUCTION BACKUP CENTER</span>
            <h1 style="font-size: 2.2rem; font-weight: 900; color: #fff; margin: 4px 0;">PUSAT CADANGAN DATA KELAS</h1>
          </div>
          <button class="fq-btn fq-btn-outline" onclick="window.location.hash='#quest/teacher-home'"><i class="fas fa-arrow-left"></i> KEMBALI</button>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px; margin-bottom: 28px;">
          <div style="background: rgba(30,41,59,0.7); border: 1.5px solid var(--fq-border-cyan); border-radius: 20px; padding: 24px;">
            <h3 style="color: var(--fq-cyan); margin: 0 0 10px 0;"><i class="fas fa-download"></i> EKSPOR BACKUP LENGKAP</h3>
            <p style="color: var(--fq-text-muted); font-size: 0.88rem; margin-bottom: 18px;">Unduh seluruh arsip data kelas, absensi, tugas, dan evaluasi siswa dalam format JSON.</p>
            <button class="fq-btn fq-btn-cyan" style="width: 100%;" onclick="window.FIVIAFirebaseSyncV2.exportCompleteFirebaseBackup()"><i class="fas fa-download"></i> 📥 UNDUH BACKUP PRODUKSI</button>
          </div>

          <div style="background: rgba(30,41,59,0.7); border: 1.5px solid var(--fq-border-cyan); border-radius: 20px; padding: 24px;">
            <h3 style="color: var(--fq-emerald); margin: 0 0 10px 0;"><i class="fas fa-upload"></i> PULIHKAN DATA DARI JSON</h3>
            <p style="color: var(--fq-text-muted); font-size: 0.88rem; margin-bottom: 18px;">Pulihkan arsip data kelas dari file JSON backup sebelumnya.</p>
            <input type="file" id="fq-prod-restore-input" accept=".json" style="display: none;" onchange="const f = this.files[0]; if(f){ const r = new FileReader(); r.onload = function(e){ const res = window.FIVIAPrivateBackup.restoreClassroomBackup(e.target.result); alert(res.message); if(res.success) window.location.reload(); }; r.readAsText(f); }">
            <button class="fq-btn fq-btn-emerald" style="width: 100%;" onclick="document.getElementById('fq-prod-restore-input').click()"><i class="fas fa-upload"></i> 📤 UNGGAH & PULIHKAN</button>
          </div>
        </div>

        <div style="background: rgba(16,185,129,0.1); border: 1.5px solid var(--fq-emerald); border-radius: 20px; padding: 20px;">
          <h4 style="color: var(--fq-emerald); margin: 0 0 6px 0;"><i class="fas fa-shield-alt"></i> SINKRONISASI CACHE LOKAL DENGAN CLOUD</h4>
          <p style="color: var(--fq-text-muted); font-size: 0.85rem; margin: 0;">Data lokal tersinkron secara otomatis dengan Firestore ketika jaringan internet tersedia.</p>
        </div>
      </div>
    `;
  }

  return {
    awardXPWithAntiFarmGuard: awardXPWithAntiFarmGuard,
    getConceptRecommendations: getConceptRecommendations,
    renderBackupCenterUI: renderBackupCenterUI
  };
})();
