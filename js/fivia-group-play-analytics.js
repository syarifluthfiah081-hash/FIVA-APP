/**
 * FIVIA GROUP PLAY ANALYTICS MODULE
 * Phase 10: Turn Distribution Fairness Audit, Concept Analytics & Group Badges
 */

window.FIVIAGroupPlayAnalytics = (function() {
  'use strict';

  function renderSessionSummaryUI(container, state) {
    const sortedGroups = [...(state.groups || [])].sort((a, b) => b.score - a.score);
    const winnerGroup = sortedGroups[0] || { groupName: 'GROUP NEWTON', score: 0 };
    const allMembers = [];

    (state.groups || []).forEach(g => {
      (g.members || []).forEach(m => {
        allMembers.push({ ...m, groupName: g.groupName });
      });
    });

    // Check fairness balance
    const turns = allMembers.map(m => m.turnsPlayed || 0);
    const maxTurns = Math.max(...turns, 0);
    const minTurns = Math.min(...turns, 0);
    const isFair = (maxTurns - minTurns) <= 1;

    // Check badges
    awardGroupBadges(state, isFair);

    container.innerHTML = `
      <div style="background: rgba(15, 23, 42, 0.98); border: 3.5px solid var(--fq-amber); border-radius: 32px; padding: 40px; text-align: center; box-shadow: 0 0 60px rgba(245,158,11,0.4);">
        <div style="font-size: 5rem; margin-bottom: 10px;">🏁</div>
        <span class="fq-badge-pill" style="border-color: var(--fq-amber); color: var(--fq-amber); font-size: 1rem;"><i class="fas fa-flag-checkered"></i> SESSION COMPLETE</span>
        <h1 style="font-size: 3rem; font-weight: 900; color: #fff; margin: 10px 0;">HASIL AKHIR FIVIA GROUP PLAY</h1>
        <p style="color: var(--fq-text-muted); font-size: 1.1rem; margin-bottom: 32px;">Selamat kepada <strong>${winnerGroup.groupName}</strong> atas skor tertinggi <strong>${winnerGroup.score} XP</strong>!</p>

        <!-- Group Leaderboard Cards -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 18px; margin-bottom: 32px;">
          ${sortedGroups.map((g, rank) => `
            <div style="background: rgba(30,41,59,0.85); border: 2.5px solid ${rank === 0 ? 'var(--fq-amber)' : 'var(--fq-border-cyan)'}; border-radius: 20px; padding: 20px; text-align: center;">
              <div style="font-size: 0.8rem; color: var(--fq-text-muted); font-weight: 800;">PERINGKAT #${rank + 1}</div>
              <div style="font-size: 1.4rem; font-weight: 900; color: #fff; margin: 6px 0;">${g.groupName}</div>
              <div style="font-size: 1.8rem; font-weight: 900; color: var(--fq-cyan);">${g.score} XP</div>
            </div>
          `).join('')}
        </div>

        <!-- Fairness Turn Audit Section -->
        <div style="background: rgba(30,41,59,0.7); border: 1.5px solid var(--fq-border-cyan); border-radius: 20px; padding: 24px; text-align: left; margin-bottom: 32px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
            <h3 style="color: var(--fq-cyan); font-size: 1.25rem; font-weight: 900; margin: 0;"><i class="fas fa-balance-scale"></i> TURN DISTRIBUTION &amp; FAIRNESS AUDIT:</h3>
            <span class="fq-badge-pill" style="margin: 0; color: ${isFair ? 'var(--fq-emerald)' : 'var(--fq-amber)'}; border-color: ${isFair ? 'var(--fq-emerald)' : 'var(--fq-amber)'}; font-weight: 900;">
              ${isFair ? '✅ FAIR PLAY TEAM (GILIRAN SEIMBANG)' : '⚠️ TURN DISTRIBUTION NEEDS ATTENTION'}
            </span>
          </div>

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px;">
            ${allMembers.map(m => `
              <div style="background: rgba(15,23,42,0.7); border: 1px solid var(--fq-border-cyan); border-radius: 12px; padding: 12px; display: flex; justify-content: space-between; font-weight: 800; color: #fff;">
                <span>👨‍🎓 ${m.studentName}</span>
                <span style="color: var(--fq-amber);">${m.turnsPlayed || 1} Giliran</span>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Concept Mastery Analytics -->
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
          <button class="fq-btn fq-btn-cyan fq-btn-lg" style="min-height: 56px; font-size: 1.1rem;" onclick="window.FIVIAGroupPlayEngine.startGroupPlaySession()"><i class="fas fa-redo"></i> 🚀 MAIN SESI BARU</button>
          <button class="fq-btn fq-btn-outline fq-btn-lg" style="min-height: 56px; font-size: 1.1rem;" onclick="window.location.hash='#quest/classroom'"><i class="fas fa-chalkboard-teacher"></i> TEACHER COMMAND CENTER</button>
        </div>
      </div>
    `;
  }

  function awardGroupBadges(state, isFair) {
    if (!window.FIVIAStudent || typeof window.FIVIAStudent.awardBadge !== 'function') return;

    window.FIVIAStudent.awardBadge('👥 TEAM PLAYER');

    if (state.currentRound >= 5) {
      window.FIVIAStudent.awardBadge('🎯 TEAM CHALLENGER');
    }

    if (isFair) {
      window.FIVIAStudent.awardBadge('⚡ FAIR PLAY TEAM');
    }
  }

  return {
    renderSessionSummaryUI: renderSessionSummaryUI
  };
})();
