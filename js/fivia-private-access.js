/**
 * FIVIA PRIVATE ACCESS MODULE
 * Phase 8: Welcome Access Screen, Configurable Teacher PIN & Teacher Profile Settings
 */

window.FIVIAPrivateAccess = (function() {
  'use strict';

  const STORAGE_KEYS = {
    TEACHER_SETTINGS: 'fivia_teacher_settings',
    ACTIVE_USER: 'fivia_active_user'
  };

  const DEFAULT_TEACHER_SETTINGS = {
    teacherName: 'Syarif Hidayatullah, S.Pd.',
    teacherPin: '123456',
    schoolName: 'SMA Negeri FIVIA 2045',
    defaultClass: 'XI Fase F — Fisika',
    academicYear: '2025/2026',
    updatedAt: new Date().toISOString()
  };

  function getTeacherSettings() {
    return window.FIVIAStudent.safeStorageGet(STORAGE_KEYS.TEACHER_SETTINGS, DEFAULT_TEACHER_SETTINGS);
  }

  function saveTeacherSettings(settings) {
    window.FIVIAStudent.safeStorageSet(STORAGE_KEYS.TEACHER_SETTINGS, {
      ...settings,
      updatedAt: new Date().toISOString()
    });
  }

  function verifyTeacherPin(inputPin) {
    const settings = getTeacherSettings();
    return (inputPin || '').trim() === settings.teacherPin;
  }

  function updateTeacherPin(oldPin, newPin) {
    if (!verifyTeacherPin(oldPin)) {
      return { success: false, message: 'PIN Lama salah.' };
    }
    if (!newPin || newPin.trim().length < 4) {
      return { success: false, message: 'PIN Baru minimal 4 karakter.' };
    }
    const settings = getTeacherSettings();
    settings.teacherPin = newPin.trim();
    saveTeacherSettings(settings);
    return { success: true, message: 'PIN Guru berhasil diperbarui.' };
  }

  function setActiveMode(mode) {
    window.FIVIAStudent.safeStorageSet(STORAGE_KEYS.ACTIVE_USER, { mode: mode, timestamp: new Date().toISOString() });
  }

  function getActiveMode() {
    const active = window.FIVIAStudent.safeStorageGet(STORAGE_KEYS.ACTIVE_USER, { mode: 'STUDENT' });
    return active.mode;
  }

  return {
    getTeacherSettings: getTeacherSettings,
    saveTeacherSettings: saveTeacherSettings,
    verifyTeacherPin: verifyTeacherPin,
    updateTeacherPin: updateTeacherPin,
    setActiveMode: setActiveMode,
    getActiveMode: getActiveMode
  };
})();
