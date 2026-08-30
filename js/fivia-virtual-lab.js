/**
 * FIVIA VIRTUAL PHYSICS LAB - EXPERIMENT DATA SCHEMA & PHYSICS MODELS
 * Phase 5: Virtual Physics Lab Integration & Experiment-Based Learning
 */

window.FIVIAVirtualLabData = (function() {
  'use strict';

  const EXPERIMENTS = [
    {
      id: "lab_exp_01",
      title: "BASIC MEASUREMENT LAB",
      topic: "Besaran, Satuan, dan Ketidakpastian Pengukuran Dasar",
      difficulty: "Pemula",
      estimatedMinutes: 20,
      icon: "fa-ruler-combined",
      objectives: [
        "Identifikasi besaran pokok dan satuan SI baku.",
        "Gunakan jangka sorong dan mikrometer sekrup untuk mengukur dimensi objek.",
        "Bandingkan tingkat ketelitian dan presisi alat ukur panjang.",
        "Hitung nilai rata-rata dan ketidakpastian pengukuran (L = L₀ ± ΔL)."
      ],
      theory: "Pengukuran adalah membandingkan nilai besaran fisis dengan satuan standar baku. Setiap alat ukur memiliki batas ketelitian (skala terkecil). Jangka sorong memiliki ketelitian 0,1 mm (0,01 cm), sedangkan mikrometer sekrup memiliki ketelitian 0,01 mm (0,001 cm). Ketidakpastian mutlak Δx biasanya bernilai setengah dari skala terkecil.",
      apparatus: [
        { name: "Penggaris / Mistar", precision: "1 mm (0.1 cm)", unit: "cm" },
        { name: "Jangka Sorong", precision: "0.1 mm (0.01 cm)", unit: "cm" },
        { name: "Mikrometer Sekrup", precision: "0.01 mm (0.001 cm)", unit: "mm" },
        { name: "Neraca Digital", precision: "0.01 g", unit: "g" },
        { name: "Stopwatch", precision: "0.01 s", unit: "s" }
      ],
      targetObjects: [
        { id: "obj_1", name: "Kelereng Besi", trueLengthMm: 15.42, trueMassG: 14.85 },
        { id: "obj_2", name: "Koin Logam 500", trueLengthMm: 27.25, trueMassG: 3.10 },
        { id: "obj_3", name: "Kabel Tembaga", trueLengthMm: 3.84, trueMassG: 0.92 }
      ],
      predictionPrompt: "Jika Anda mengukur diameter kelereng besi dengan Mikrometer Sekrup dibandingkan Jangka Sorong, manakah yang menghasilkan ketidakpastian pengukuran (Δx) lebih kecil?",
      predictionOptions: [
        { id: "A", text: "Mikrometer Sekrup (Ketelitian 0,01 mm)" },
        { id: "B", text: "Jangka Sorong (Ketelitian 0,1 mm)" },
        { id: "C", text: "Keduanya menghasilkan ketidakpastian sama" },
        { id: "D", text: "Penggaris Biasa" }
      ],
      correctPrediction: "A",
      analysisQuestions: [
        {
          id: "q1",
          question: "Mengapa mikrometer sekrup lebih tepat digunakan untuk mengukur tebal koin daripada penggaris?",
          options: [
            { id: "A", text: "Mikrometer memiliki nilai skala terkecil lebih kecil (0,01 mm) sehingga ketidakpastiannya lebih kecil." },
            { id: "B", text: "Mikrometer memiliki ukuran lebih panjang." },
            { id: "C", text: "Penggaris tidak memiliki satuan SI." },
            { id: "D", text: "Mikrometer mengukur massa." }
          ],
          correctAnswer: "A"
        },
        {
          id: "q2",
          question: "Hasil pengukuran diameter tabung diperoleh 12,4 mm dengan ketidakpastian 0,05 mm. Bagaimanakah penulisan pelaporan ilmiah yang tepat?",
          options: [
            { id: "A", text: "L = (12,4 ± 0,05) mm" },
            { id: "B", text: "L = 12,4 mm saja" },
            { id: "C", text: "L = 12,45 mm" },
            { id: "D", text: "L = 0,05 mm" }
          ],
          correctAnswer: "A"
        }
      ]
    },
    {
      id: "lab_exp_02",
      title: "MOTION TRACKER LAB",
      topic: "Kinematika Gerak Lurus Beraturan (GLB) & GLBB",
      difficulty: "Menengah",
      estimatedMinutes: 25,
      icon: "fa-car-side",
      objectives: [
        "Analisis hubungan antara posisi (x), kecepatan (v), dan waktu (t).",
        "Amati perbedaan karakteristik grafik v-t pada GLB vs GLBB.",
        "Verifikasi persamaan lintasan x = x₀ + v₀t + ½ at² melalui eksperimen simulasi.",
        "Hitung percepatan benda berdasarkan gradien grafik v-t."
      ],
      theory: "Pada Gerak Lurus Beraturan (GLB), kecepatan benda konstan (a = 0) sehingga x = v·t. Pada Gerak Lurus Berubah Beraturan (GLBB), benda mengalami percepatan tetap (a ≠ 0) sehingga v = v₀ + a·t dan x = x₀ + v₀t + ½ a·t².",
      variables: [
        { id: "x0", name: "Posisi Awal (x₀)", min: 0, max: 20, step: 1, default: 0, unit: "m" },
        { id: "v0", name: "Kecepatan Awal (v₀)", min: 0, max: 10, step: 0.5, default: 2, unit: "m/s" },
        { id: "a", name: "Percepatan (a)", min: 0, max: 5, step: 0.5, default: 1, unit: "m/s²" }
      ],
      physicsModel: function(params, t) {
        const x0 = params.x0 || 0;
        const v0 = params.v0 || 0;
        const a = params.a || 0;
        const v = v0 + a * t;
        const x = x0 + v0 * t + 0.5 * a * t * t;
        return { time: t, position: x, velocity: v, acceleration: a };
      },
      predictionPrompt: "Jika sebuah mobil bergerak dengan v₀ = 2 m/s dan percepatan a = 1 m/s², berapakah kecepatannya pada t = 4 sekon?",
      predictionOptions: [
        { id: "A", text: "4 m/s" },
        { id: "B", text: "6 m/s  (v = 2 + 1×4)" },
        { id: "C", text: "8 m/s" },
        { id: "D", text: "10 m/s" }
      ],
      correctPrediction: "B",
      analysisQuestions: [
        {
          id: "q1",
          question: "Apakah bentuk grafik kecepatan terhadap waktu (v-t) pada Gerak Lurus Berubah Beraturan (GLBB)?",
          options: [
            { id: "A", text: "Garis lurus miring naik (memiliki kemiringan/gradien = percepatan)" },
            { id: "B", text: "Garis horizontal mendatar" },
            { id: "C", text: "Garis melengkung parabola" },
            { id: "D", text: "Lingkaran" }
          ],
          correctAnswer: "A"
        }
      ]
    },
    {
      id: "lab_exp_03",
      title: "NEWTON FORCE LAB",
      topic: "Dinamika Gerak & Hukum 2 Newton (F = m · a)",
      difficulty: "Menengah",
      estimatedMinutes: 25,
      icon: "fa-dolly",
      objectives: [
        "Analisis hubungan antara Gaya total (F), Massa (m), dan Percepatan (a).",
        "Verifikasi Hukum 2 Newton F = m · a secara kuantitatif.",
        "Gambarkan grafik hubungan F terhadap a pada massa tetap.",
        "Analisis pengaruh gaya gesek terhadap percepatan benda."
      ],
      theory: "Hukum 2 Newton menyatakan bahwa percepatan sebuah benda berbanding lurus dengan gaya total yang bekerja padanya dan berbanding terbalik dengan massanya: a = ΣF / m. Jika terdapat gaya gesek f_k, maka a = (F - f_k) / m.",
      variables: [
        { id: "mass", name: "Massa Troli (m)", min: 0.5, max: 5.0, step: 0.5, default: 2.0, unit: "kg" },
        { id: "force", name: "Gaya Tarik (F)", min: 1.0, max: 20.0, step: 1.0, default: 6.0, unit: "N" },
        { id: "friction", name: "Gaya Gesek (f_k)", min: 0.0, max: 5.0, step: 0.5, default: 0.0, unit: "N" }
      ],
      physicsModel: function(params, t) {
        const m = params.mass || 1.0;
        const F = params.force || 1.0;
        const fk = params.friction || 0.0;
        const Fnet = Math.max(0, F - fk);
        const a = Fnet / m;
        const v = a * t;
        const x = 0.5 * a * t * t;
        return { time: t, force: F, mass: m, netForce: Fnet, acceleration: a, velocity: v, position: x };
      },
      predictionPrompt: "Jika gaya tarik F pada troli dilipatgandakan menjadi 2 kali lipat sementara massanya tetap, apa yang terjadi pada percepatan troli?",
      predictionOptions: [
        { id: "A", text: "Percepatan menjadi 2 kali lipat lebih besar" },
        { id: "B", text: "Percepatan menjadi setengahnya" },
        { id: "C", text: "Percepatan tetap tidak berubah" },
        { id: "D", text: "Percepatan menjadi nol" }
      ],
      correctPrediction: "A",
      analysisQuestions: [
        {
          id: "q1",
          question: "Troli dengan massa 2 kg ditarik gaya 6 N pada permukaan licin tanpa gesekan. Berapakah percepatan troli?",
          options: [
            { id: "A", text: "3 m/s²  (a = 6 N / 2 kg)" },
            { id: "B", text: "12 m/s²" },
            { id: "C", text: "4 m/s²" },
            { id: "D", text: "1,5 m/s²" }
          ],
          correctAnswer: "A"
        }
      ]
    },
    {
      id: "lab_exp_04",
      title: "ENERGY TRANSFORMATION LAB",
      topic: "Hukum Kekekalan Energi Mekanik (Ep + Ek = Em)",
      difficulty: "Lanjutan",
      estimatedMinutes: 30,
      icon: "fa-bolt",
      objectives: [
        "Analisis transformasi energi potensial gravitasi (Ep = mgh) menjadi energi kinetik (Ek = ½ mv²).",
        "Buktikan Hukum Kekekalan Energi Mekanik pada kondisi ideal.",
        "Hitung kecepatan jatuh bebas benda v = √(2gh).",
        "Evaluasi efisiensi konversi energi dengan memperhitungkan hambatan udara."
      ],
      theory: "Energi tidak dapat diciptakan atau dimusnahkan, hanya dapat berubah bentuk. Saat benda jatuh dari ketinggian h, Energi Potensial Ep = mgh berkurang dan berubah menjadi Energi Kinetik Ek = ½ mv². Total Energi Mekanik Em = Ep + Ek bernilai konstan.",
      variables: [
        { id: "mass", name: "Massa Benda (m)", min: 0.1, max: 5.0, step: 0.1, default: 1.0, unit: "kg" },
        { id: "height", name: "Ketinggian Awal (h₀)", min: 1.0, max: 20.0, step: 1.0, default: 10.0, unit: "m" },
        { id: "gravity", name: "Percepatan Gravitasi (g)", min: 9.8, max: 9.8, step: 0.0, default: 9.8, unit: "m/s²" }
      ],
      physicsModel: function(params, currentHeight) {
        const m = params.mass || 1.0;
        const h0 = params.height || 10.0;
        const g = params.gravity || 9.8;
        const h = Math.max(0, Math.min(h0, currentHeight));
        
        const Ep0 = m * g * h0;
        const Ep = m * g * h;
        const Ek = Ep0 - Ep;
        const v = Math.sqrt(Math.max(0, 2 * g * (h0 - h)));
        const Em = Ep + Ek;

        return { height: h, mass: m, Ep: Ep, Ek: Ek, Em: Em, velocity: v };
      },
      predictionPrompt: "Ketika sebuah benda dilepas jatuh bebas dari ketinggian h, di manakah energi kinetiknya mencapai nilai MAKSIMUM?",
      predictionOptions: [
        { id: "A", text: "Tepat saat menyentuh tanah (h = 0)" },
        { id: "B", text: "Di posisi tertinggi (h = h₀)" },
        { id: "C", text: "Di tengah-tengah ketinggian (h = ½ h₀)" },
        { id: "D", text: "Energi kinetik selalu nol" }
      ],
      correctPrediction: "A",
      analysisQuestions: [
        {
          id: "q1",
          question: "Benda bermassa 1 kg jatuh dari ketinggian 10 m (g = 9.8 m/s²). Berapakah kecepatan benda tepat saat menyentuh tanah?",
          options: [
            { id: "A", text: "14 m/s  (v = √(2 × 9.8 × 10) = √196 = 14 m/s)" },
            { id: "B", text: "9.8 m/s" },
            { id: "C", text: "196 m/s" },
            { id: "D", text: "7 m/s" }
          ],
          correctAnswer: "A"
        }
      ]
    },
    {
      id: "lab_exp_05",
      title: "RENEWABLE ENERGY LAB",
      topic: "Energi Terbarukan: Simulasi Panel Surya & Daya Listrik (P = V · I)",
      difficulty: "Lanjutan",
      estimatedMinutes: 30,
      icon: "fa-solar-panel",
      objectives: [
        "Analisis daya listrik yang dihasilkan panel surya (P = V · I).",
        "Amati pengaruh intensitas cahaya dan sudut kemiringan panel surya.",
        "Gambarkan grafik hubungan Tegangan (V) vs Arus (I).",
        "Hitung efisiensi konversi energi cahaya menjadi energi listrik."
      ],
      theory: "Panel surya mengubah energi foton cahaya matahari menjadi daya listrik DC. Daya keluaran P = V · I dipengaruhi oleh intensitas radiasi cahaya (W/m²), luas penampang panel, sudut datang sinar (cos θ), dan beban hambatan R.",
      variables: [
        { id: "lightIntensity", name: "Intensitas Cahaya (W/m²)", min: 100, max: 1000, step: 50, default: 800, unit: "W/m²" },
        { id: "angleDeg", name: "Sudut Kemiringan Panel (°)", min: 0, max: 90, step: 5, default: 0, unit: "°" },
        { id: "panelArea", name: "Luas Panel Surya (A)", min: 0.5, max: 4.0, step: 0.5, default: 1.0, unit: "m²" },
        { id: "loadRes", name: "Hambatan Beban (R)", min: 1, max: 20, step: 1, default: 5, unit: "Ω" }
      ],
      physicsModel: function(params) {
        const I_light = params.lightIntensity || 800;
        const angleRad = ((params.angleDeg || 0) * Math.PI) / 180;
        const Area = params.panelArea || 1.0;
        const R = params.loadRes || 5;

        const effectiveLight = I_light * Math.cos(angleRad);
        const Voc = 12 + (effectiveLight / 1000) * 8; // Max 20V
        const Isc = (effectiveLight / 1000) * 3 * Area; // Max ~3A per m²

        // Load calculation
        const I = Isc * (R / (R + 2));
        const V = I * R;
        const Power = V * I;
        const Pin = I_light * Area;
        const efficiency = Pin > 0 ? (Power / Pin) * 100 : 0;

        return {
          intensity: I_light,
          angle: params.angleDeg,
          voltage: Math.round(V * 100) / 100,
          current: Math.round(I * 100) / 100,
          power: Math.round(Power * 100) / 100,
          efficiency: Math.round(efficiency * 10) / 10
        };
      },
      predictionPrompt: "Bagaimanakah pengaruh tegak lurusnya arah datang sinar matahari (sudut 0°) terhadap daya listrik yang dihasilkan panel surya?",
      predictionOptions: [
        { id: "A", text: "Menghasilkan Daya Listrik Maksimum (cos 0° = 1)" },
        { id: "B", text: "Menghasilkan Daya Listrik Minimum" },
        { id: "C", text: "Daya listrik menjadi nol" },
        { id: "D", text: "Sudut tidak berpengaruh" }
      ],
      correctPrediction: "A",
      analysisQuestions: [
        {
          id: "q1",
          question: "Jika panel surya menghasilkan tegangan V = 15 V dan arus I = 2 A, berapakah daya listrik keluaran (P)?",
          options: [
            { id: "A", text: "30 Watt  (P = 15 V × 2 A = 30 W)" },
            { id: "B", text: "7.5 Watt" },
            { id: "C", text: "17 Watt" },
            { id: "D", text: "60 Watt" }
          ],
          correctAnswer: "A"
        }
      ]
    }
  ];

  return {
    getAllExperiments: function() { return EXPERIMENTS; },
    getExperimentById: function(id) { return EXPERIMENTS.find(e => e.id === id) || EXPERIMENTS[0]; }
  };
})();
