/**
 * FIVIA GROUP LEVEL QUESTIONS MODULE
 * Phase 10.1: Categorized Question Bank (95+ Physics HOTS Challenges for Level 01–05)
 */

window.FIVIAGroupLevelQuestions = (function() {
  'use strict';

  const QUESTION_BANK = {
    LEVEL_01: [
      { id: 'l1_q1', type: 'multiple_choice', question: 'Manakah di bawah ini yang merupakan besaran fisika?', options: [{ id: 'A', label: 'Keindahan' }, { id: 'B', label: 'Panjang' }, { id: 'C', label: 'Warna' }, { id: 'D', label: 'Kebersihan' }], correctAnswer: 'B', explanation: 'Panjang adalah besaran fisika karena dapat diukur dan dinyatakan dengan angka.' },
      { id: 'l1_q2', type: 'true_false', question: 'PERNYATAAN: Kalor dan Suhu adalah dua hal yang sama persis dalam fisika.', options: [{ id: 'A', label: 'BENAR' }, { id: 'B', label: 'SALAH' }], correctAnswer: 'B', explanation: 'Pernyataan SALAH. Suhu adalah derajat panas benda (K/°C), sedangkan Kalor adalah energi panas yang berpindah dari suhu tinggi ke rendah.' },
      { id: 'l1_q3', type: 'matching', question: 'Pasangkan besaran fisika berikut dengan jenis besaran yang tepat:', pairs: [{ left: 'Panjang & Massa', right: 'Besaran Pokok SI' }, { left: 'Kecepatan & Gaya', right: 'Besaran Turunan' }, { left: 'Perpindahan & Vektor', right: 'Besaran Memiliki Arah' }], explanation: 'Panjang dan massa adalah besaran pokok, kecepatan dan gaya adalah besaran turunan, perpindahan adalah besaran vektor.' },
      { id: 'l1_q4', type: 'multiple_select', question: 'Manakah di bawah ini yang SELURUHNYA merupakan besaran pokok SI? (Pilih semua jawaban benar)', options: [{ id: 'A', label: 'Panjang' }, { id: 'B', label: 'Gaya' }, { id: 'C', label: 'Massa' }, { id: 'D', label: 'Kecepatan' }], correctAnswers: [0, 2], explanation: 'Panjang dan Massa adalah besaran pokok SI. Gaya dan Kecepatan adalah besaran turunan.' },
      { id: 'l1_q5', type: 'short_answer', question: 'Apakah nama besaran pokok SI yang mengukur derajat panas suatu benda?', correctAnswers: ['Suhu', 'suhu', 'Suhu Mutlak', 'Kelvin'], explanation: 'Suhu mengukur derajat panas benda dengan satuan SI Kelvin.' },
      { id: 'l1_q6', type: 'multiple_choice', question: 'Besaran yang diturunkan dari besaran pokok panjang dan waktu adalah...', options: [{ id: 'A', label: 'Massa Jenis' }, { id: 'B', label: 'Kecepatan' }, { id: 'C', label: 'Gaya' }, { id: 'D', label: 'Tekanan' }], correctAnswer: 'B', explanation: 'Kecepatan merupakan hasil bagi besaran panjang (jarak) terhadap waktu.' },
      { id: 'l1_q7', type: 'true_false', question: 'PERNYATAAN: Rasa dingin mengalir masuk ke dalam benda hangat saat disentuh.', options: [{ id: 'A', label: 'BENAR' }, { id: 'B', label: 'SALAH' }], correctAnswer: 'B', explanation: 'Pernyataan SALAH. Dingin bukan zat atau energi yang mengalir, melainkan kalor (energi panas) yang mengalir keluar dari benda hangat ke lingkungan.' },
      { id: 'l1_q8', type: 'matching', question: 'Pasangkan nama alat ukur dengan besaran pokok yang diukurnya:', pairs: [{ left: 'Mistar / Jangka Sorong', right: 'Besaran Panjang' }, { left: 'Neraca Ohauss', right: 'Besaran Massa' }, { left: 'Stopwatch digital', right: 'Besaran Waktu' }], explanation: 'Mistar mengukur panjang, Neraca mengukur massa, Stopwatch mengukur waktu.' }
    ],

    LEVEL_02: [
      { id: 'l2_q1', type: 'multiple_choice', question: 'Satuan standar internasional (SI) untuk besaran massa adalah...', options: [{ id: 'A', label: 'gram' }, { id: 'B', label: 'kilogram (kg)' }, { id: 'C', label: 'ton' }, { id: 'D', label: 'pound' }], correctAnswer: 'B', explanation: 'Kilogram (kg) adalah satuan SI massa.' },
      { id: 'l2_q2', type: 'short_answer', question: 'Apakah nama satuan standar internasional (SI) untuk suhu mutlak?', correctAnswers: ['Kelvin', 'kelvin', 'K'], explanation: 'Kelvin (K) adalah satuan SI suhu mutlak.' },
      { id: 'l2_q3', type: 'matching', question: 'Pasangkan besaran turunan berikut dengan satuan SI yang setara:', pairs: [{ left: 'Gaya (Newton)', right: 'kg·m/s²' }, { left: 'Usaha / Energi (Joule)', right: 'kg·m²/s²' }, { left: 'Tekanan (Pascal)', right: 'N/m²' }], explanation: 'F=ma (kg·m/s²), W=Fs (kg·m²/s²), P=F/A (N/m²).' },
      { id: 'l2_q4', type: 'multiple_select', question: 'Manakah pasangan besaran dan satuan SI berikut yang BENAR? (Pilih lebih dari 1)', options: [{ id: 'A', label: 'Kuat Arus — Ampere (A)' }, { id: 'B', label: 'Waktu — Menit' }, { id: 'C', label: 'Massa Jenis — kg/m³' }, { id: 'D', label: 'Suhu — Celsius (°C)' }], correctAnswers: [0, 2], explanation: 'Kuat arus ber-satuan Ampere dan massa jenis kg/m³. Waktu SI adalah detik dan Suhu SI adalah Kelvin.' },
      { id: 'l2_q5', type: 'true_false', question: 'PERNYATAAN: Satu Joule setara dengan 1 Newton dikali 1 Meter (1 N·m).', options: [{ id: 'A', label: 'BENAR' }, { id: 'B', label: 'SALAH' }], correctAnswer: 'A', explanation: 'Pernyataan BENAR. Usaha W = F x s -> 1 J = 1 N · m.' }
    ],

    LEVEL_03: [
      { id: 'l3_q1', type: 'multiple_choice', question: 'Simbol dimensi untuk besaran panjang adalah...', options: [{ id: 'A', label: '[M]' }, { id: 'B', label: '[L]' }, { id: 'C', label: '[T]' }, { id: 'D', label: '[θ]' }], correctAnswer: 'B', explanation: 'Dimensi panjang disimbolkan dengan [L] (Length).' },
      { id: 'l3_q2', type: 'matching', question: 'Pasangkan besaran pokok dengan simbol dimensi yang tepat:', pairs: [{ left: 'Panjang', right: '[L]' }, { left: 'Massa', right: '[M]' }, { left: 'Waktu', right: '[T]' }], explanation: 'Panjang [L], Massa [M], Waktu [T].' },
      { id: 'l3_q3', type: 'multiple_select', question: 'Manakah dua besaran fisika berikut yang MEMILIKI DIMENSI SAMA [ML²T⁻²]? (Pilih semua jawaban benar)', options: [{ id: 'A', label: 'Usaha (Work)' }, { id: 'B', label: 'Gaya (Force)' }, { id: 'C', label: 'Energi Kinetik (Ek)' }, { id: 'D', label: 'Kecepatan (Velocity)' }], correctAnswers: [0, 2], explanation: 'Usaha dan Energi Kinetik keduanya berdimensi [ML²T⁻²].' },
      { id: 'l3_q4', type: 'true_false', question: 'PERNYATAAN: Besaran regangan (strain) memiliki dimensi [L].', options: [{ id: 'A', label: 'BENAR' }, { id: 'B', label: 'SALAH' }], correctAnswer: 'B', explanation: 'Pernyataan SALAH. Regangan ΔL/L0 adalah perbandingan dua panjang, sehingga tidak memiliki dimensi.' },
      { id: 'l3_q5', type: 'short_answer', question: 'Apakah simbol dimensi untuk besaran percepatan [m/s²]?', correctAnswers: ['[LT-2]', '[LT^-2]', 'LT-2', 'LT^-2'], explanation: 'Percepatan a = m/s² -> [L][T]⁻² = [LT⁻²].' }
    ],

    LEVEL_04: [
      { id: 'l4_q1', type: 'multiple_choice', question: 'Persamaan posisi benda: x = v₀ · t + ½ a · t². Apakah persamaan tersebut konsisten secara dimensional?', options: [{ id: 'A', label: 'Konsisten, karena setiap suku berdimensi [L]' }, { id: 'B', label: 'Tidak konsisten, karena suku ½ at² berdimensi [LT]' }, { id: 'C', label: 'Tidak konsisten, karena koefisien ½ mengubah dimensi' }, { id: 'D', label: 'Konsisten, karena setiap suku berdimensi [LT⁻¹]' }], correctAnswer: 'A', explanation: 'x=[L], v₀t=[LT⁻¹][T]=[L], ½at²=[LT⁻²][T²]=[L]. Semua suku berdimensi [L].' },
      { id: 'l4_q2', type: 'true_false', question: 'PERNYATAAN: Persamaan F = m · v konsisten secara dimensional dengan Gaya F.', options: [{ id: 'A', label: 'BENAR' }, { id: 'B', label: 'SALAH' }], correctAnswer: 'B', explanation: 'Pernyataan SALAH. F berdimensi [MLT⁻²], sedangkan m·v berdimensi [MLT⁻¹] (Momentum).' },
      { id: 'l4_q3', type: 'multiple_select', question: 'Manakah suku persamaan di bawah ini yang berdimensi sama dengan Tekanan [ML⁻¹T⁻²]? (Pilih semua jawaban benar)', options: [{ id: 'A', label: 'Tekanan Hidrostatis (ρ·g·h)' }, { id: 'B', label: 'Tekanan Dinamis (½·ρ·v²)' }, { id: 'C', label: 'Gaya Berat (m·g)' }, { id: 'D', label: 'Daya Listrik (P)' }], correctAnswers: [0, 1], explanation: 'Suku ρgh dan ½ρv² pada persamaan Bernoulli keduanya berdimensi Tekanan [ML⁻¹T⁻²].' },
      { id: 'l4_q4', type: 'matching', question: 'Pasangkan rumus fisika dengan dimensi konstanta yang dihasilkan:', pairs: [{ left: 'Gaya gesek F = k · v', right: '[MT⁻¹]' }, { left: 'Pegas Ep = ½ k · x²', right: '[MT⁻²]' }, { left: 'Viskositas F = 6π η r v', right: '[ML⁻¹T⁻¹]' }], explanation: 'k_gesek=[MT⁻¹], k_pegas=[MT⁻²], η_viskositas=[ML⁻¹T⁻¹].' },
      { id: 'l4_q5', type: 'short_answer', question: 'Persamaan gelombang v = f · λ. Tentukan dimensi dari kecepatan v!', correctAnswers: ['[LT-1]', '[LT^-1]', 'LT-1', 'LT^-1'], explanation: 'Kecepatan v = m/s -> [L][T]⁻¹ = [LT⁻¹].' }
    ],

    LEVEL_05: [
      { id: 'l5_q1', type: 'multiple_choice', question: '🔥 BOSS CHALLENGE 1: Sebuah kelompok peneliti menemukan rumus gaya angkat pesawat: F = ½ C · ρ · A · v². Analisis dimensional membuktikan rumus ini...', options: [{ id: 'A', label: 'BENAR, karena ruas kanan berdimensi [MLT⁻²]' }, { id: 'B', label: 'SALAH, karena ruas kanan berdimensi [ML²T⁻²]' }, { id: 'C', label: 'SALAH, karena ρ berdimensi [ML⁻²]' }, { id: 'D', label: 'BENAR, karena ruas kanan berdimensi [MLT⁻¹]' }], correctAnswer: 'A', explanation: 'ρ·A·v² = [ML⁻³] · [L²] · [L²T⁻²] = [MLT⁻²] (dimensi Gaya). Rumus konsisten!' },
      { id: 'l5_q2', type: 'true_false', question: '🔥 BOSS CHALLENGE 2: Pada persamaan Bernoulli P + ½ ρ v² + ρ g h = Konstan, ketiga suku memiliki dimensi yang persis sama.', options: [{ id: 'A', label: 'BENAR' }, { id: 'B', label: 'SALAH' }], correctAnswer: 'A', explanation: 'Pernyataan BENAR. Ketiga suku berdimensi Tekanan [ML⁻¹T⁻²].' },
      { id: 'l5_q3', type: 'short_answer', question: '🔥 BOSS CHALLENGE 3: Tekanan hidrostatis P = ρ · g · h. Jika ρ=1000 kg/m³, g=10 m/s², h=2 m, berapakah P dalam Pascal?', correctAnswers: ['20000', '20.000', '20000 Pa', '20.000 Pa'], explanation: 'P = 1000 x 10 x 2 = 20.000 Pascal.' },
      { id: 'l5_q4', type: 'multiple_select', question: '🔥 BOSS CHALLENGE 4: Manakah gabungan dua besaran yang berdimensi [ML²T⁻²] dan bersatuan Joule? (Pilih semua jawaban benar)', options: [{ id: 'A', label: 'Usaha (Work)' }, { id: 'B', label: 'Energi Potensial' }, { id: 'C', label: 'Gaya Tekan' }, { id: 'D', label: 'Kecepatan' }], correctAnswers: [0, 1], explanation: 'Usaha dan Energi Potensial berdimensi [ML²T⁻²] dan bersatuan Joule.' },
      { id: 'l5_q5', type: 'matching', question: '🔥 BOSS CHALLENGE 5: Pasangkan persamaan fisika HOTS dengan hasilnya:', pairs: [{ left: 'Periode Ayunan T = 2π√(l/g)', right: 'Ruas Kanan Berdimensi [T]' }, { left: 'Usaha Mobil (m=1000kg, a=2m/s², t=5s)', right: 'W = 50.000 Joule' }, { left: 'Kecepatan Lepas v = √(2GM/R)', right: 'Ruas Kanan Berdimensi [LT⁻¹]' }], explanation: 'Periode [T], Usaha 50kJ, Kecepatan lepas [LT⁻¹].' }
    ]
  };

  let cachedPoolKey = null;
  let cachedQuestions = null;

  function resetQuestionCache() {
    cachedPoolKey = null;
    cachedQuestions = null;
  }

  function formatQuestionForGroupPlay(q) {
    const type = q.type || (q.pairs ? "matching" : q.correctAnswers ? (Array.isArray(q.correctAnswers) && typeof q.correctAnswers[0] === 'number' ? "multiple_select" : "short_answer") : "multiple_choice");
    
    return {
      id: q.id || `gp_${Math.random().toString(36).substr(2, 5)}`,
      type: type,
      question: q.question,
      options: (q.options || []).map((opt, i) => ({
        id: String.fromCharCode(65 + i),
        label: typeof opt === 'string' ? opt : (opt.label || opt.text || '')
      })),
      correct: q.correct,
      correctAnswers: q.correctAnswers,
      correctAnswer: q.correctAnswer || (typeof q.correct === 'number' ? String.fromCharCode(65 + q.correct) : 'A'),
      pairs: q.pairs,
      explanation: q.explanation || "Pembahasan presisi bebas miskonsepsi disusun oleh Guru AI."
    };
  }

  function getQuestionsForLevel(levelId, limit, selectedModuleId) {
    const cacheKey = `${levelId || 'LEVEL_01'}_${selectedModuleId || 'ALL'}`;
    
    if (cachedPoolKey === cacheKey && cachedQuestions && cachedQuestions.length > 0) {
      return limit ? cachedQuestions.slice(0, limit) : cachedQuestions;
    }

    let pool = [];

    if (selectedModuleId && selectedModuleId !== 'ALL') {
      const matId = parseInt(selectedModuleId);
      // Load quiz for this module from DB or custom quizzes
      let targetQuiz = null;
      if (window.db && typeof window.db.getQuizForMaterial === 'function') {
        targetQuiz = window.db.getQuizForMaterial(matId);
      }
      if (!targetQuiz) {
        const customQuizzes = JSON.parse(localStorage.getItem("fivia_custom_quizzes") || "[]");
        targetQuiz = customQuizzes.find(q => q.materialId === matId || q.id === `quiz_${matId}`);
      }

      if (targetQuiz && targetQuiz.questions && targetQuiz.questions.length > 0) {
        pool = targetQuiz.questions.map(q => formatQuestionForGroupPlay(q));
      }
    }

    if (pool.length === 0) {
      pool = [...(QUESTION_BANK[levelId] || QUESTION_BANK.LEVEL_01)].map(q => formatQuestionForGroupPlay(q));
      
      // Merge teacher-generated custom AI questions dynamically into Group Play!
      try {
        const customQuizzes = JSON.parse(localStorage.getItem("fivia_custom_quizzes") || "[]");
        customQuizzes.forEach(quiz => {
          if (quiz && quiz.questions && Array.isArray(quiz.questions)) {
            quiz.questions.forEach(q => {
              if (q && q.question) {
                pool.unshift(formatQuestionForGroupPlay(q));
              }
            });
          }
        });
      } catch (e) {
        console.warn("Group Play custom questions merge warning:", e);
      }
    }

    // Cache the shuffled pool for consistent turn-by-turn rendering
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    cachedPoolKey = cacheKey;
    cachedQuestions = shuffled;

    return limit ? cachedQuestions.slice(0, limit) : cachedQuestions;
  }

  function getQuestionById(levelId, questionId, selectedModuleId) {
    const pool = getQuestionsForLevel(levelId, null, selectedModuleId);
    return pool.find(q => q.id === questionId) || pool[0];
  }

  return {
    QUESTION_BANK: QUESTION_BANK,
    getQuestionsForLevel: getQuestionsForLevel,
    getQuestionById: getQuestionById,
    resetQuestionCache: resetQuestionCache
  };
})();


