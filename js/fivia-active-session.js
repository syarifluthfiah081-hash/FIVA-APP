/**
 * FIVIA ACTIVE CLASS SESSION & ACTIVITY CONTROLLER MODULE
 * Phase 10: Active Session Controller, Class Controls & Activity Launcher Binding
 */

window.FIVIAActiveSession = (function() {
  'use strict';

  const STORAGE_KEY = 'fivia_active_session_state';

  const DEFAULT_SESSION_STATE = {
    status: 'IDLE', // 'IDLE', 'LIVE', 'PAUSED', 'ENDED'
    topic: 'Kinematika Gerak Lurus (GLB & GLBB)',
    objective: 'Siswa mampu menganalisis posisi, kelajuan, dan kecepatan.',
    activityType: 'LAB',
    activityTitle: 'Motion Tracker Lab',
    durationMinutes: 45,
    startedAt: null
  };

  function getSessionState() {
    return window.FIVIAStudent.safeStorageGet(STORAGE_KEY, DEFAULT_SESSION_STATE);
  }

  function saveSessionState(stateObj) {
    const updated = {
      ...getSessionState(),
      ...stateObj,
      updatedAt: new Date().toISOString()
    };
    window.FIVIAStudent.safeStorageSet(STORAGE_KEY, updated);

    // Sync state to Firestore if connected
    const db = window.FIVIA_FIREBASE ? window.FIVIA_FIREBASE.db : null;
    if (db) {
      db.collection('sessions').doc('current_session').set(updated, { merge: true }).catch(err => {
        console.warn('[Session State] Firestore write failed:', err);
      });
    }

    return updated;
  }

  function startSession() {
    saveSessionState({ status: 'LIVE', startedAt: new Date().toISOString() });
    alert('🟢 KELAS SEDANG BERLANGSUNG!\n\nSiswa dapat bergabung ke sesi pembelajaran live.');
    renderActiveSessionUI();
  }

  function pauseSession() {
    saveSessionState({ status: 'PAUSED' });
    alert('⏸️ KELAS DIPAUSE SEMENTARA.');
    renderActiveSessionUI();
  }

  function resumeSession() {
    saveSessionState({ status: 'LIVE' });
    alert('▶️ KELAS DILANJUTKAN (RESUMED).');
    renderActiveSessionUI();
  }

  function endSession() {
    saveSessionState({ status: 'ENDED' });
    alert('🏁 KELAS HARI INI TELAH SELESAI (ENDED).');
    window.location.hash = '#quest/session-summary';
  }

  function renderActiveSessionUI() {
    const container = document.getElementById('fq-active-session-container');
    if (!container) return;

    const session = getSessionState();
    const classrooms = window.FIVIAClassroom.getClassrooms();
    const activeCls = classrooms[0] || {};
    const roster = window.FIVIAClassroom.getRoster(activeCls.id);

    container.innerHTML = `
      <div style="background: rgba(15, 23, 42, 0.95); border: 3px solid ${session.status === 'LIVE' ? 'var(--fq-emerald)' : 'var(--fq-amber)'}; border-radius: 28px; padding: 36px; text-align: left; box-shadow: 0 0 50px ${session.status === 'LIVE' ? 'rgba(16,185,129,0.3)' : 'rgba(245,158,11,0.3)'};">
        <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 2px solid var(--fq-border-cyan); padding-bottom: 16px; margin-bottom: 24px; flex-wrap: wrap; gap: 12px;">
          <div>
            <span class="fq-badge-pill" style="background: ${session.status === 'LIVE' ? 'rgba(16,185,129,0.2)' : 'rgba(245,158,11,0.2)'}; color: ${session.status === 'LIVE' ? 'var(--fq-emerald)' : 'var(--fq-amber)'};">
              ${session.status === 'LIVE' ? '🟢 KELAS SEDANG BERLANGSUNG' : '⏸️ KELAS DIPAUSE'}
            </span>
            <h1 style="font-size: 2.4rem; font-weight: 900; color: #fff; margin: 4px 0;">${session.topic}</h1>
            <div style="color: var(--fq-cyan); font-weight: 700;">Tujuan: ${session.objective}</div>
          </div>
          <button class="fq-btn fq-btn-outline" onclick="window.location.hash='#quest/teacher-home'"><i class="fas fa-arrow-left"></i> KEMBALI</button>
        </div>

        <!-- Control Buttons -->
        <div style="display: flex; gap: 12px; margin-bottom: 28px; flex-wrap: wrap;">
          ${session.status !== 'LIVE' ? `
            <button class="fq-btn fq-btn-emerald fq-btn-lg" style="flex: 1;" onclick="window.FIVIAActiveSession.startSession()"><i class="fas fa-play"></i> ▶ START SESSION</button>
          ` : `
            <button class="fq-btn fq-btn-amber fq-btn-lg" style="flex: 1;" onclick="window.FIVIAActiveSession.pauseSession()"><i class="fas fa-pause"></i> ⏸ PAUSE SESSION</button>
          `}
          <button class="fq-btn fq-btn-danger fq-btn-lg" style="flex: 1;" onclick="window.FIVIAActiveSession.endSession()"><i class="fas fa-stop"></i> ⏹ END SESSION</button>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px;">
          <div style="background: rgba(30,41,59,0.7); border: 1px solid var(--fq-border-cyan); border-radius: 18px; padding: 18px;">
            <div style="font-size: 0.8rem; color: var(--fq-text-muted);">AKTIVITAS AKTIF</div>
            <div style="font-size: 1.4rem; font-weight: 900; color: var(--fq-cyan);">${session.activityTitle}</div>
          </div>
          <div style="background: rgba(30,41,59,0.7); border: 1px solid var(--fq-border-cyan); border-radius: 18px; padding: 18px;">
            <div style="font-size: 0.8rem; color: var(--fq-text-muted);">DURASI SESI</div>
            <div style="font-size: 1.4rem; font-weight: 900; color: var(--fq-amber);">${session.durationMinutes} Menit</div>
          </div>
          <div style="background: rgba(30,41,59,0.7); border: 1px solid var(--fq-border-cyan); border-radius: 18px; padding: 18px;">
            <div style="font-size: 0.8rem; color: var(--fq-text-muted);">SISWA ANGGOTA KELAS</div>
            <div style="font-size: 1.4rem; font-weight: 900; color: var(--fq-emerald);">${roster.length} Siswa</div>
          </div>
        </div>
      </div>
    `;
  }

  return {
    getSessionState: getSessionState,
    saveSessionState: saveSessionState,
    startSession: startSession,
    pauseSession: pauseSession,
    resumeSession: resumeSession,
    endSession: endSession,
    renderActiveSessionUI: renderActiveSessionUI
  };
})();
