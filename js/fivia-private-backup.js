/**
 * FIVIA PRIVATE BACKUP MODULE
 * Phase 8: Teacher JSON Backup Export, Backup Schema Validation & Safe Reset
 */

window.FIVIAPrivateBackup = (function() {
  'use strict';

  function exportClassroomBackup() {
    const backupData = {
      version: 'FIVIA_PHASE_8_PRIVATE',
      exportedAt: new Date().toISOString(),
      teacherSettings: window.FIVIAPrivateAccess.getTeacherSettings(),
      classrooms: window.FIVIAClassroom.getClassrooms(),
      students: window.FIVIAClassroom.getRoster(),
      assignments: window.FIVIAAssignment.getAssignments(),
      interventions: window.FIVIAIntervention.getInterventions()
    };

    const dateStr = new Date().toISOString().slice(0, 10);
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `fivia-classroom-backup-${dateStr}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    alert('📥 BACKUP DATA KELAS BERHASIL DIUNDUH!\n\nSimpan file JSON ini dengan aman.');
  }

  function restoreClassroomBackup(jsonString) {
    try {
      const data = JSON.parse(jsonString);
      if (!data || !data.version || !data.classrooms || !data.students) {
        return { success: false, message: 'Format file JSON backup tidak valid atau rusak.' };
      }

      const confirmRestore = confirm(
        `🔍 VERIFIKASI BACKUP VALID:\n` +
        `- Versi: ${data.version}\n` +
        `- Tanggal Backup: ${data.exportedAt}\n` +
        `- Total Kelas: ${data.classrooms.length}\n` +
        `- Total Siswa: ${data.students.length}\n\n` +
        `Apakah Anda yakin ingin memulihkan (restore) data ini?`
      );

      if (!confirmRestore) return { success: false, message: 'Restorasi dibatalkan oleh pengakses.' };

      if (data.teacherSettings) window.FIVIAPrivateAccess.saveTeacherSettings(data.teacherSettings);
      if (data.classrooms) window.FIVIAStudent.safeStorageSet('fivia_classrooms', data.classrooms);
      if (data.students) window.FIVIAStudent.safeStorageSet('fivia_classroom_students', data.students);
      if (data.assignments) window.FIVIAStudent.safeStorageSet('fivia_assignments', data.assignments);
      if (data.interventions) window.FIVIAStudent.safeStorageSet('fivia_interventions', data.interventions);

      return { success: true, message: '🎉 DATA KELAS BERHASIL DIPULIHKAN DARI BACKUP!' };
    } catch (err) {
      return { success: false, message: 'Gagal membaca file JSON: ' + err.message };
    }
  }

  function resetClassroomData() {
    const confirm1 = confirm('⚠️ PERINGATAN TINDAKAN DESTRUKTIF!\n\nApakah Anda yakin ingin menghapus seluruh data siswa dan kelas?');
    if (!confirm1) return;

    const confirm2 = confirm('🚨 KONFIRMASI TERAKHIR!\n\nTindakan ini TIDAK DAPAT DIBATALKAN. Lanjutkan penghapusan data kelas?');
    if (!confirm2) return;

    window.FIVIAStudent.safeStorageSet('fivia_classroom_students', []);
    window.FIVIAStudent.safeStorageSet('fivia_assignments', []);
    window.FIVIAStudent.safeStorageSet('fivia_interventions', []);

    alert('🗑️ DATA KELAS BERHASIL DIRESET KE KONDISI AWAL.');
    window.location.reload();
  }

  return {
    exportClassroomBackup: exportClassroomBackup,
    restoreClassroomBackup: restoreClassroomBackup,
    resetClassroomData: resetClassroomData
  };
})();
