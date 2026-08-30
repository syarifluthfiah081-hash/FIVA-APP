/**
 * FIVIA PHYSICS QUEST - PHASE 6: PROJECT MISSION DATA & RUBRICS
 * 5 Real-World Project Missions & 9-Category Rubric Evaluator
 */

window.FIVIAProjectsData = (function() {
  'use strict';

  const PROJECTS = [
    {
      id: "proj_01",
      title: "SMART MEASUREMENT",
      subtitle: "Investigasi Ketidakpastian Pengukuran Objek Nyata",
      topic: "Besaran, Satuan, Ketelitian, dan Ketidakpastian Pengukuran",
      icon: "fa-ruler-combined",
      linkedLabId: "lab_exp_01",
      narrative: "Sebagai Insinyur Metrologi di Lab FIVIA 2045, tugas Anda adalah merancang prosedur pengukuran berulang untuk objek kelas nyata, membandingkan presisi alat ukur, serta mengevaluasi nilai ketidakpastian mutlak (ΔL).",
      questionPrompt: "Bagaimanakah perbandingan ketelitian dan tingkat ketidakpastian pengukuran objek kelas ketika menggunakan Mistar vs Jangka Sorong?",
      hypothesisPrompt: "Tuliskan dugaan hipotesis awal Anda mengenai perbandingan nilai ketidakpastian mutlak (ΔL) dari kedua alat ukur tersebut.",
      variables: {
        independent: "Jenis Alat Ukur (Mistar vs Jangka Sorong)",
        dependent: "Nilai Ketidakpastian Pengukuran (ΔL)",
        control: "Objek Ukur, Suhu Ruangan, Metode Pengukuran"
      },
      tools: ["Mistar Plastik (1 mm)", "Jangka Sorong Analog (0.1 mm)", "Objek Ukur (Koin / Tabung / Kelereng)", "Buku Catatan Lab"],
      procedureSteps: [
        "Pilih 1 objek fisik yang akan diukur (misal: diameter koin/kelereng).",
        "Lakukan pengukuran diameter menggunakan Mistar sebanyak 3 kali pengulangan.",
        "Lakukan pengukuran diameter menggunakan Jangka Sorong sebanyak 3 kali pengulangan.",
        "Hitung nilai rata-rata (x̄) dan ketidakpastian mutlak Δx = ½ × Skala Terkecil.",
        "Bandingkan hasil presisi kedua alat ukur dalam laporan."
      ]
    },
    {
      id: "proj_02",
      title: "MOTION INVESTIGATOR",
      subtitle: "Analisis Kinematika Gerak Lurus Kendaraan Virtual",
      topic: "Kinematika Gerak Lurus Beraturan (GLB) & GLBB",
      icon: "fa-car-side",
      linkedLabId: "lab_exp_02",
      narrative: "Tim Investigasi Keselamatan Lalu Lintas membutuhkan bantuan Anda untuk menganalisis karakteristik gerak mobil di lintasan. Analisis grafik hubungan posisi-waktu (x-t) dan kecepatan-waktu (v-t).",
      questionPrompt: "Bagaimanakah pengaruh perubahan percepatan (a) terhadap gradien grafik kecepatan terhadap waktu (v-t)?",
      hypothesisPrompt: "Tuliskan dugaan hipotesis Anda mengenai hubungan antara nilai percepatan dengan kemiringan grafik v-t.",
      variables: {
        independent: "Percepatan Mobil (a)",
        dependent: "Kecepatan Akhir (v) dan Posisi (x)",
        control: "Posisi Awal (x₀), Kecepatan Awal (v₀)"
      },
      tools: ["Simulasi Motion Tracker Lab", "Stopwatch Digital", "Grafik Canvas x-t & v-t"],
      procedureSteps: [
        "Buka Motion Tracker Lab dan atur v₀ = 2 m/s dan a = 1 m/s².",
        "Jalankan simulasi dan catat data posisi (x) serta kecepatan (v) setiap t = 1, 2, 3, 4 sekon.",
        "Plot grafik v-t dan hitung gradien kemiringan garisnya.",
        "Bandingkan gradien hasil grafik dengan nilai percepatan yang diatur pada kontrol variabel."
      ]
    },
    {
      id: "proj_03",
      title: "FORCE ENGINEER",
      subtitle: "Desain Pengujian Hukum 2 Newton (F = m · a)",
      topic: "Dinamika Gerak dan Hukum Newton",
      icon: "fa-dolly",
      linkedLabId: "lab_exp_03",
      narrative: "Sebagai Perancang Sistem Mekanik, Anda diminta membuktikan kebenaran persamaaan F = m · a melalui eksperimen variasi massa troli dan gaya tarik.",
      questionPrompt: "Jika massa troli diperbesar 2 kali lipat sementara gaya tarik dibuat tetap, bagaimanakah perubahan percepatan gerak troli?",
      hypothesisPrompt: "Tuliskan dugaan hipotesis Anda mengenai hubungan terbalik antara massa dan percepatan.",
      variables: {
        independent: "Massa Troli (m)",
        dependent: "Percepatan Troli (a)",
        control: "Gaya Tarik Total (F), Gaya Gesek (f_k)"
      },
      tools: ["Simulasi Newton Force Lab", "Troli Beban", "Dynamometer / Force Sensor"],
      procedureSteps: [
        "Atur gaya tarik F = 6 N pada Newton Force Lab.",
        "Variasikan massa troli m = 1 kg, 2 kg, dan 3 kg.",
        "Catat data percepatan (a) yang dihasilkan pada tabel data.",
        "Buat grafik hubungan F terhadap a dan hitung konstanta massanya."
      ]
    },
    {
      id: "proj_04",
      title: "ENERGY GUARDIAN",
      subtitle: "Audit Transformasi & Kekekalan Energi Mekanik",
      topic: "Energi Potensial, Energi Kinetik, dan Kekekalan Energi",
      icon: "fa-bolt",
      linkedLabId: "lab_exp_04",
      narrative: "Sebagai Konsultan Energi, Anda bertugas mengaudit sistem benda jatuh bebas untuk membuktikan bahwa Energi Mekanik Total (Em = Ep + Ek) bernilai konstan.",
      questionPrompt: "Apakah total energi mekanik (Ep + Ek) pada posisi puncak sama dengan total energi mekanik saat mendekati tanah?",
      hypothesisPrompt: "Tuliskan dugaan hipotesis Anda tentang prinsip kekekalan energi mekanik.",
      variables: {
        independent: "Ketinggian Jatuh Benda (h)",
        dependent: "Energi Potensial (Ep) dan Energi Kinetik (Ek)",
        control: "Massa Benda (m), Percepatan Gravitasi (g)"
      },
      tools: ["Simulasi Energy Transformation Lab", "Sensor Ketinggian", "Bar Chart Energi"],
      procedureSteps: [
        "Atur ketinggian awal h₀ = 10 m dan massa m = 1 kg di Energy Transformation Lab.",
        "Jalankan benda jatuh bebas dan catat nilai Ep serta Ek pada h = 10m, 5m, dan 0m.",
        "Jumlahkan Ep + Ek di setiap titik posisi.",
        "Evaluasi apakah terdapat penurunan energi akibat gesekan udara."
      ]
    },
    {
      id: "proj_05",
      title: "SOLAR FUTURE",
      subtitle: "Optimasi Efisiensi Panel Surya Energi Terbarukan",
      topic: "Energi Terbarukan & Efisiensi Daya Listrik (P = V · I)",
      icon: "fa-solar-panel",
      linkedLabId: "lab_exp_05",
      narrative: "Sebagai Insinyur Energi Terbarukan 2045, Anda ditugaskan merancang posisi kemiringan panel surya terbaik untuk mengoptimalkan keluaran daya listrik (P = V · I).",
      questionPrompt: "Bagaimanakah pengaruh sudut kemiringan panel surya (0° hingga 60°) terhadap daya listrik keluaran?",
      hypothesisPrompt: "Tuliskan hipotesis Anda mengenai sudut kemiringan ideal untuk menerima pancaran sinar matahari maksimum.",
      variables: {
        independent: "Sudut Kemiringan Panel Surya (°)",
        dependent: "Daya Listrik Keluaran P (Watt)",
        control: "Intensitas Radiasi Cahaya, Luas Panel, Hambatan Beban"
      },
      tools: ["Simulasi Renewable Energy Lab", "Panel Surya Virtual", "Voltmeter & Ammeter"],
      procedureSteps: [
        "Atur radiasi cahaya = 800 W/m² di Renewable Energy Lab.",
        "Ubah sudut kemiringan panel θ = 0°, 30°, 45°, dan 60°.",
        "Catat nilai Tegangan (V), Arus (I), dan hitung Daya P = V × I.",
        "Tentukan sudut kemiringan mana yang menghasilkan daya listrik tertinggi."
      ]
    }
  ];

  /**
   * Evaluates Project Submission Rubric (9 Categories, max 36 PTS)
   */
  function evaluateProjectRubric(projSubmission) {
    const categories = [
      { id: "c1", name: "Scientific Question", score: 4, feedback: "Pertanyaan penelitian dirumuskan secara jelas dan ilmiah." },
      { id: "c2", name: "Hypothesis", score: projSubmission.hypothesis ? 4 : 2, feedback: "Hipotesis dirumuskan berdasarkan logika fisis." },
      { id: "c3", name: "Variable Identification", score: projSubmission.variables ? 4 : 2, feedback: "Variabel bebas, terikat, dan kontrol teridentifikasi tepat." },
      { id: "c4", name: "Experimental Design", score: 4, feedback: "Langkah kerja eksperimen terstruktur." },
      { id: "c5", name: "Data Quality", score: projSubmission.hasData ? 4 : 2, feedback: "Data pengamatan kuantitatif valid." },
      { id: "c6", name: "Data Analysis", score: projSubmission.analysis ? 4 : 2, feedback: "Analisis grafik dan hubungan variabel tepat." },
      { id: "c7", name: "Physics Reasoning", score: 4, feedback: "Penalaran hukum fisika logis." },
      { id: "c8", name: "Conclusion", score: projSubmission.conclusion ? 4 : 2, feedback: "Kesimpulan menjawab pertanyaan penelitian." },
      { id: "c9", name: "Reflection", score: projSubmission.reflection ? 4 : 2, feedback: "Refleksi pembelajaran komprehensif." }
    ];

    const totalScore = categories.reduce((sum, c) => sum + c.score, 0);
    const maxScore = 36;
    const percentage = Math.round((totalScore / maxScore) * 100);

    let masteryTitle = 'DEVELOPING';
    if (percentage >= 90) masteryTitle = 'MASTER PROJECT SCIENTIST';
    else if (percentage >= 80) masteryTitle = 'ADVANCED INVESTIGATOR';
    else if (percentage >= 70) masteryTitle = 'PROFICIENT INVESTIGATOR';
    else if (percentage >= 60) masteryTitle = 'DEVELOPING';
    else masteryTitle = 'NEEDS GUIDANCE';

    return {
      categories: categories,
      totalScore: totalScore,
      maxScore: maxScore,
      percentage: percentage,
      masteryTitle: masteryTitle
    };
  }

  return {
    getAllProjects: function() { return PROJECTS; },
    getProjectById: function(id) { return PROJECTS.find(p => p.id === id) || PROJECTS[0]; },
    evaluateProjectRubric: evaluateProjectRubric
  };
})();
