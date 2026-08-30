/**
 * FIVIA ADAPTIVE LEARNING ENGINE MODULE
 * Weighted Evidence Mastery Calculator & Personalized Learning Path Generator
 */

window.FIVIAAdaptive = (function() {
  'use strict';

  const STORAGE_KEYS = {
    ADAPTIVE_PROFILE: 'fivia_adaptive_profile',
    RECOMMENDATIONS: 'fivia_adaptive_recommendations'
  };

  // Concept Weights: Assessment (50%), Quest (20%), Lab (15%), Project (15%)
  const WEIGHTS = {
    assessment: 0.50,
    quest: 0.20,
    lab: 0.15,
    project: 0.15
  };

  /**
   * Calculate Weighted Mastery for All Concepts
   */
  function calculateWeightedAdaptiveMastery() {
    const student = window.FIVIAStudent.getStudentProfile();
    const assResult = window.FIVIAStudent.safeStorageGet('fivia_mastery_assessment_progress', null);
    const labProgress = window.FIVIAStudent.safeStorageGet('fivia_virtual_lab_progress', { completedExpIds: [] });
    const projProgress = window.FIVIAStudent.safeStorageGet('fivia_project_progress', { completedProjects: [] });

    const assScore = assResult ? assResult.accuracy : 70;
    const questScore = student.score ? Math.min(100, Math.round(student.score / 50)) : 65;
    const labScore = labProgress.completedExpIds ? Math.min(100, labProgress.completedExpIds.length * 20) : 40;
    const projScore = projProgress.completedProjects ? Math.min(100, projProgress.completedProjects.length * 20) : 40;

    const weightedScore = Math.round(
      (assScore * WEIGHTS.assessment) +
      (questScore * WEIGHTS.quest) +
      (labScore * WEIGHTS.lab) +
      (projScore * WEIGHTS.project)
    );

    let stateCode = 'DEVELOPING';
    let label = 'DEVELOPING — Sedang Berkembang';
    let recommendation = '';
    let targetLink = '#quest/game-map';

    if (weightedScore < 60) {
      stateCode = 'REMEDIATION';
      label = 'NEEDS REMEDIATION — Perlu Penguatan Terbimbing';
      recommendation = 'Ulangi latihan dasar Besaran Hunter dan konsultasikan dengan AI Tutor.';
      targetLink = '#quest/besaran-hunter';
    } else if (weightedScore < 70) {
      stateCode = 'DEVELOPING';
      label = 'DEVELOPING — Latihan Terpandu';
      recommendation = 'Tingkatkan akurasi analisis dimensi melalui level SI Explorer dan Dimension Detective.';
      targetLink = '#quest/si-explorer';
    } else if (weightedScore < 80) {
      stateCode = 'PROFICIENT';
      label = 'PROFICIENT — Latihan Terarah';
      recommendation = 'Lakukan praktikum di Motion Tracker Lab & Newton Force Lab.';
      targetLink = '#quest/virtual-lab';
    } else if (weightedScore < 90) {
      stateCode = 'ADVANCED';
      label = 'ADVANCED — Latihan Lanjutan';
      recommendation = 'Selesaikan tantangan puncak di Dimension Boss & ikuti Mastery Assessment.';
      targetLink = '#quest/dimension-boss';
    } else {
      stateCode = 'MASTERED';
      label = 'MASTERED — Siap Proyek Nyata & Pengayaan';
      recommendation = 'Selesaikan seluruh Proyek Real-World FIVIA Project Mission!';
      targetLink = '#quest/project-mission';
    }

    const adaptiveProfile = {
      overallWeightedScore: weightedScore,
      stateCode: stateCode,
      label: label,
      recommendation: recommendation,
      targetLink: targetLink,
      lastUpdated: new Date().toISOString()
    };

    window.FIVIAStudent.safeStorageSet(STORAGE_KEYS.ADAPTIVE_PROFILE, adaptiveProfile);
    return adaptiveProfile;
  }

  /**
   * Render Personalized Learning Path View UI
   */
  function renderLearningPathUI() {
    const container = document.getElementById('fq-learning-path-container');
    if (!container) return;

    const adaptive = calculateWeightedAdaptiveMastery();
    const student = window.FIVIAStudent.getStudentProfile();

    container.innerHTML = `
      <div style="background: rgba(15, 23, 42, 0.95); border: 2.5px solid var(--fq-cyan); border-radius: 28px; padding: 36px; text-align: left;">
        <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 14px; margin-bottom: 24px; border-bottom: 2px solid var(--fq-border-cyan); padding-bottom: 16px;">
          <div>
            <span class="fq-badge-pill"><i class="fas fa-route"></i> PERSONALIZED LEARNING PATH</span>
            <h1 style="font-size: 2.2rem; font-weight: 900; color: #fff; margin: 4px 0;">MY PHYSICS JOURNEY</h1>
            <div style="color: var(--fq-cyan); font-weight: 700;">Jalur Pembelajaran Adaptif Terintegrasi</div>
          </div>
          <div style="text-align: right;">
            <div style="font-size: 2rem; font-weight: 900; color: var(--fq-amber);">${adaptive.overallWeightedScore}%</div>
            <div style="font-size: 0.8rem; color: var(--fq-text-muted);">Skor Terbobot Adaptif</div>
          </div>
        </div>

        <div style="background: rgba(30,41,59,0.7); border: 1.5px solid var(--fq-amber); border-radius: 20px; padding: 24px; margin-bottom: 24px;">
          <h3 style="color: var(--fq-amber); font-size: 1.2rem; margin: 0 0 8px 0;"><i class="fas fa-compass"></i> STATUS MASTERY TERATUR:</h3>
          <h2 style="color: #fff; font-size: 1.5rem; font-weight: 900; margin: 0 0 10px 0;">${adaptive.label}</h2>
          <p style="color: var(--fq-text-muted); font-size: 0.95rem; margin: 0;">${adaptive.recommendation}</p>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 20px; margin-bottom: 28px;">
          <div style="background: rgba(30,41,59,0.5); border: 1px solid var(--fq-border-cyan); border-radius: 20px; padding: 20px;">
            <h4 style="color: var(--fq-cyan); margin: 0 0 10px 0;"><i class="fas fa-rocket"></i> LATIHAN BERIKUTNYA:</h4>
            <p style="color: #fff; font-size: 0.9rem; margin-bottom: 16px;">Rekomendasi terbaik berdasarkan analisis pembobotan bukti belajar.</p>
            <button class="fq-btn fq-btn-cyan" style="width: 100%;" onclick="window.location.hash='${adaptive.targetLink}'"><i class="fas fa-play"></i> BUKA MODUL REKOMENDASI</button>
          </div>

          <div style="background: rgba(30,41,59,0.5); border: 1px solid var(--fq-border-cyan); border-radius: 20px; padding: 20px;">
            <h4 style="color: var(--fq-violet); margin: 0 0 10px 0;"><i class="fas fa-robot"></i> KONSULTASI AI TUTOR:</h4>
            <p style="color: #fff; font-size: 0.9rem; margin-bottom: 16px;">Tanyakan konsep sulit secara langsung ke FIVIA AI Tutor Socratic.</p>
            <button class="fq-btn fq-btn-violet" style="width: 100%;" onclick="window.location.hash='#quest/ai-tutor'"><i class="fas fa-comments"></i> TANYAKAN KE AI TUTOR</button>
          </div>
        </div>

        <div style="display: flex; gap: 14px;">
          <button class="fq-btn fq-btn-outline fq-btn-lg" style="width: 100%;" onclick="window.location.hash='#quest/game-map'"><i class="fas fa-map-marked-alt"></i> KEMBALI KE GAME MAP</button>
        </div>
      </div>
    `;
  }

  return {
    calculateWeightedAdaptiveMastery: calculateWeightedAdaptiveMastery,
    renderLearningPathUI: renderLearningPathUI
  };
})();
