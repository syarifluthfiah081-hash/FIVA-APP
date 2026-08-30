/**
 * FIVIA DATA VALIDATOR & IDEMPOTENCY MODULE
 * Phase 9: Data Integrity, Idempotent Write Checker & Farm Protection
 */

window.FIVIADataValidator = (function() {
  'use strict';

  const STORAGE_KEY = 'fivia_completed_event_ids';

  function getCompletedEventIds() {
    return window.FIVIAStudent.safeStorageGet(STORAGE_KEY, []);
  }

  function isEventAlreadyProcessed(eventId) {
    if (!eventId) return false;
    const list = getCompletedEventIds();
    return list.includes(eventId);
  }

  function markEventProcessed(eventId) {
    if (!eventId) return;
    const list = getCompletedEventIds();
    if (!list.includes(eventId)) {
      list.push(eventId);
      window.FIVIAStudent.safeStorageSet(STORAGE_KEY, list);
    }
  }

  function validateStudentData(studentData) {
    if (!studentData || typeof studentData !== 'object') return false;
    if (!studentData.displayName || studentData.displayName.trim() === '') return false;
    return true;
  }

  function validateClassroomData(classData) {
    if (!classData || typeof classData !== 'object') return false;
    if (!classData.name || !classData.code) return false;
    return true;
  }

  return {
    isEventAlreadyProcessed: isEventAlreadyProcessed,
    markEventProcessed: markEventProcessed,
    validateStudentData: validateStudentData,
    validateClassroomData: validateClassroomData
  };
})();
