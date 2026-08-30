/**
 * FIVIA PHYSICS QUEST - PHASE 4: ANALYTICS & MASTERY ENGINE
 * Mastery Classification, Concept Matrix, Remediation & Enrichment Engine
 */

window.FIVIAAnalytics = (function() {
  'use strict';

  /**
   * Mastery Classification Calculator
   */
  function classifyMastery(accuracyPct) {
    if (accuracyPct >= 90) {
      return { code: 'MASTER', label: 'MASTER — Sangat Menguasai', badgeColor: '#10b981', statusClass: 'status-master' };
    } else if (accuracyPct >= 80) {
      return { code: 'ADVANCED', label: 'ADVANCED — Menguasai', badgeColor: '#3b82f6', statusClass: 'status-advanced' };
    } else if (accuracyPct >= 70) {
      return { code: 'PROFICIENT', label: 'PROFICIENT — Cukup Menguasai', badgeColor: '#f59e0b', statusClass: 'status-proficient' };
    } else if (accuracyPct >= 60) {
      return { code: 'DEVELOPING', label: 'DEVELOPING — Sedang Berkembang', badgeColor: '#f97316', statusClass: 'status-developing' };
    } else {
      return { code: 'NEEDS_REMEDIATION', label: 'NEEDS REMEDIATION — Perlu Penguatan', badgeColor: '#ef4444', statusClass: 'status-remediation' };
    }
  }

  /**
   * Calculate Category Concept Matrix from Answers Array
   */
  function calculateConceptMatrix(answersList) {
    const categories = ['Besaran', 'Satuan', 'Dimensi', 'Analisis Dimensional', 'Persamaan', 'Mixed Mastery'];
    const matrix = {};

    categories.forEach(cat => {
      matrix[cat] = { total: 0, correct: 0, accuracy: 0, mastery: null };
    });

    answersList.forEach(ans => {
      const cat = ans.category || 'Mixed Mastery';
      if (!matrix[cat]) matrix[cat] = { total: 0, correct: 0, accuracy: 0, mastery: null };
      matrix[cat].total++;
      if (ans.isCorrect) matrix[cat].correct++;
    });

    Object.keys(matrix).forEach(cat => {
      const item = matrix[cat];
      item.accuracy = item.total > 0 ? Math.round((item.correct / item.total) * 100) : 0;
      item.mastery = classifyMastery(item.accuracy);
    });

    return matrix;
  }

  /**
   * Generate Pedagogical Remediation Recommendations
   */
  function generateRemediationPlans(conceptMatrix) {
    const recommendations = [];
    const replayLevels = [];

    Object.keys(conceptMatrix).forEach(cat => {
      const item = conceptMatrix[cat];
      if (item.total > 0) {
        if (item.accuracy < 60) {
          recommendations.push({
            category: cat,
            accuracy: item.accuracy,
            status: 'REMEDIATION REQUIRED',
            action: getReplayRecommendationText(cat)
          });
          replayLevels.push(getReplayLevelTarget(cat));
        } else if (item.accuracy < 70) {
          recommendations.push({
            category: cat,
            accuracy: item.accuracy,
            status: 'NEEDS PRACTICE',
            action: getReplayRecommendationText(cat)
          });
          replayLevels.push(getReplayLevelTarget(cat));
        }
      }
    });

    return {
      plans: recommendations,
      suggestedReplays: [...new Set(replayLevels)],
      isRemediationNeeded: recommendations.length > 0
    };
  }

  function getReplayRecommendationText(category) {
    switch (category) {
      case 'Besaran': return 'Ulangi latihan Besaran Hunter (Level 01) untuk menguatkan pemisahan Besaran Pokok dan Turunan.';
      case 'Satuan': return 'Ulangi latihan Unit Master (Level 02) untuk memperdalam konversi dan pasangan Satuan SI Baku.';
      case 'Dimensi': return 'Ulangi latihan SI Explorer (Level 03) untuk merakit dan mengingat simbol dimensi baku.';
      case 'Analisis Dimensional': return 'Ulangi latihan Dimension Detective Mission 01 dan Mission 03 (Level 04).';
      case 'Persamaan': return 'Ulangi latihan Dimension Detective Mission 04 dan Dimension Boss Stage 04 (Level 05).';
      default: return 'Ulangi latihan soal-soal tantangan gabungan di Level 05 Dimension Boss.';
    }
  }

  function getReplayLevelTarget(category) {
    switch (category) {
      case 'Besaran': return '#quest/besaran-hunter';
      case 'Satuan': return '#quest/unit-master';
      case 'Dimensi': return '#quest/si-explorer';
      case 'Analisis Dimensional': return '#quest/dimension-detective';
      case 'Persamaan': return '#quest/dimension-boss';
      default: return '#quest/dimension-boss';
    }
  }

  /**
   * Check Enrichment Eligibility
   */
  function checkEnrichmentEligibility(overallAccuracy, overallMasteryCode) {
    return (overallAccuracy >= 90 && (overallMasteryCode === 'MASTER' || overallMasteryCode === 'ADVANCED'));
  }

  return {
    classifyMastery: classifyMastery,
    calculateConceptMatrix: calculateConceptMatrix,
    generateRemediationPlans: generateRemediationPlans,
    checkEnrichmentEligibility: checkEnrichmentEligibility
  };
})();
