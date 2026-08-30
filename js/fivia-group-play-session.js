/**
 * FIVIA GROUP PLAY SESSION MODULE
 * Phase 10: Session Lifecycle, Dual Score Tracking & XP Protection
 */

window.FIVIAGroupPlaySession = (function() {
  'use strict';

  function createSessionRecord(sessionState) {
    const record = {
      sessionId: sessionState.sessionId || ('GPS-' + Date.now().toString(36)),
      classroomId: sessionState.classroomId,
      className: sessionState.className,
      status: sessionState.status,
      currentRound: sessionState.currentRound,
      timerDuration: sessionState.timerDuration,
      turnOrderMode: sessionState.turnOrderMode,
      activePlayerId: sessionState.activePlayer ? sessionState.activePlayer.studentId : null,
      groups: sessionState.groups || [],
      startedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    return record;
  }

  function logTurnAttempt(studentId, groupId, questionId, isCorrect, xpAmount) {
    const actionKey = `turn_xp_${studentId}_${groupId}_${questionId}_${Date.now()}`;
    
    // Idempotency check: prevent duplicate XP awards on double click
    if (window._processedTurns && window._processedTurns.has(actionKey)) {
      return false;
    }

    if (!window._processedTurns) window._processedTurns = new Set();
    window._processedTurns.add(actionKey);

    if (isCorrect && xpAmount > 0) {
      if (window.FIVIAStudent && typeof window.FIVIAStudent.addXP === 'function') {
        window.FIVIAStudent.addXP(xpAmount);
      }
    }

    return true;
  }

  return {
    createSessionRecord: createSessionRecord,
    logTurnAttempt: logTurnAttempt
  };
})();
