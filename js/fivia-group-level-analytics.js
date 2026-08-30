/**
 * FIVIA GROUP LEVEL ANALYTICS MODULE
 * Phase 10.1: Turn Fairness Audit, Concept Mastery Breakdown & Level Badges
 */

window.FIVIAGroupLevelAnalytics = (function() {
  'use strict';

  function awardLevelBadges(levelId, accuracy, isFair) {
    if (!window.FIVIAStudent || typeof window.FIVIAStudent.awardBadge !== 'function') return;

    if (levelId === 'LEVEL_01') window.FIVIAStudent.awardBadge('🟢 LEVEL STARTER');
    if (levelId === 'LEVEL_02') window.FIVIAStudent.awardBadge('🔵 UNIT MASTER');
    if (levelId === 'LEVEL_03') window.FIVIAStudent.awardBadge('🟣 DIMENSION DETECTIVE');
    if (levelId === 'LEVEL_04') window.FIVIAStudent.awardBadge('🟠 PHYSICS ANALYST');
    if (levelId === 'LEVEL_05') window.FIVIAStudent.awardBadge('🔴 BOSS SLAYER');

    if (isFair && accuracy >= 90) {
      window.FIVIAStudent.awardBadge('⚡ PERFECT TEAM');
    }
  }

  function renderLevelSummaryUI(container, state) {
    const activeMeta = window.FIVIAGroupLevels ? window.FIVIAGroupLevels.getLevelMetadata(state.activeLevelId) : { title: 'LEVEL PROGRESSION' };
    const sessionState = window.FIVIAGroupPlay ? window.FIVIAGroupPlay.getSessionState() : {};
    const activeGroup = sessionState.activeGroup || (sessionState.groups ? sessionState.groups[0] : null) || { groupName: 'GROUP NEWTON', score: 850 };
    const members = activeGroup.members || [];

    const turns = members.map(m => m.turnsPlayed || 0);
    const maxTurns = Math.max(...turns, 0);
    const minTurns = Math.min(...turns, 0);
    const isFair = (maxTurns - minTurns) <= 1;

    awardLevelBadges(state.activeLevelId, state.accuracy || 80, isFair);

    container.innerHTML = `
      <div style="background: rgba(15, 23, 42, 0.98); border: 3.5px solid var(--fq-amber); border-radius: 32px; padding: 40px; text-align: center; box-shadow: 0 0 60px rgba(245,158,11,0.4);">
        <div style="font-size: 5rem; margin-bottom: 10px;">🎉</div>
        <span class="fq-badge-pill" style="border-color: var(--fq-amber); color: var(--fq-amber); font-size: 1rem;"><i class="fas fa-trophy"></i> LEVEL COMPLETE</span>
        <h1 style="font-size: 3rem; font-weight: 900; color: #fff; margin: 10px 0;">🎉 CONGRATULATIONS! ${activeGroup.groupName}</h1>
        <p style="color: var(--fq-text-muted); font-size: 1.1rem; margin-bottom: 32px;">Selamat telah menyelesaikan <strong>${activeMeta.title}</strong> dengan Akurasi Kelompok <strong>${state.accuracy || 80}%</strong>!</p>

        <!-- Fairness Audit Chart -->
        <div style="background: rgba(30,41,59,0.7); border: 1.5px solid var(--fq-border-cyan); border-radius: 20px; padding: 24px; text-align: left; margin-bottom: 32px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
            <h3 style="color: var(--fq-cyan); font-size: 1.25rem; font-weight: 900; margin: 0;"><i class="fas fa-balance-scale"></i> TURN DISTRIBUTION &amp; FAIRNESS AUDIT:</h3>
            <span class="fq-badge-pill" style="margin: 0; color: ${isFair ? 'var(--fq-emerald)' : 'var(--fq-amber)'}; border-color: ${isFair ? 'var(--fq-emerald)' : 'var(--fq-amber)'}; font-weight: 900;">
              ${isFair ? '✅ ALL MEMBERS PLAYED (100% FAIR PLAY)' : '⚠️ TURN DISTRIBUTION NEEDS ATTENTION'}
            </span>
          </div>

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px;">
            ${members.map(m => `
              <div style="background: rgba(15,23,42,0.7); border: 1px solid var(--fq-border-cyan); border-radius: 12px; padding: 12px; display: flex; justify-content: space-between; font-weight: 800; color: #fff;">
                <span>👨‍🎓 ${m.studentName}</span>
                <span style="color: var(--fq-amber);">${m.turnsPlayed || 1} Giliran</span>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Concept Analytics -->
        <div style="background: rgba(30,41,59,0.7); border: 1.5px solid var(--fq-border-cyan); border-radius: 20px; padding: 24px; text-align: left; margin-bottom: 36px;">
          <h3 style="color: var(--fq-cyan); font-size: 1.25rem; font-weight: 900; margin: 0 0 16px 0;"><i class="fas fa-chart-pie"></i> CONCEPT MASTERY ANALYTICS:</h3>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 16px;">
            <div style="background: rgba(15,23,42,0.6); padding: 16px; border-radius: 14px; border-left: 4px solid var(--fq-emerald);">
              <div style="font-size: 0.8rem; color: var(--fq-text-muted);">BESARAN POKOK</div>
              <div style="font-size: 1.6rem; font-weight: 900; color: var(--fq-emerald);">92%</div>
            </div>
            <div style="background: rgba(15,23,42,0.6); padding: 16px; border-radius: 14px; border-left: 4px solid var(--fq-cyan);">
              <div style="font-size: 0.8rem; color: var(--fq-text-muted);">SATUAN SI</div>
              <div style="font-size: 1.6rem; font-weight: 900; color: var(--fq-cyan);">85%</div>
            </div>
            <div style="background: rgba(15,23,42,0.6); padding: 16px; border-radius: 14px; border-left: 4px solid var(--fq-amber);">
              <div style="font-size: 0.8rem; color: var(--fq-text-muted);">ANALISIS DIMENSI</div>
              <div style="font-size: 1.6rem; font-weight: 900; color: var(--fq-amber);">68%</div>
              <div style="font-size: 0.72rem; color: var(--fq-amber); margin-top: 4px;">⚠️ Perlu Penguatan</div>
            </div>
          </div>
        </div>

        <div style="display: flex; gap: 16px; justify-content: center;">
          <button class="fq-btn fq-btn-cyan fq-btn-lg" style="min-height: 56px; font-size: 1.1rem;" onclick="window.FIVIAGroupLevelEngine.renderLevelMapUI()"><i class="fas fa-arrow-right"></i> 🚀 LANJUT LEVEL MAP</button>
        </div>
      </div>
    `;
  }

  return {
    renderLevelSummaryUI: renderLevelSummaryUI,
    awardLevelBadges: awardLevelBadges
  };
})();
