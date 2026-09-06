/**
 * FIVIA GROUP LEVEL QUESTIONS MODULE
 * Phase 10.1: Categorized Question Bank (95+ Physics HOTS Challenges for Level 01–05)
 */

window.FIVIAGroupLevelQuestions = (function() {
  'use strict';

  const QUESTION_BANK = {
    // LEVEL 1: PILIHAN GANDA (4 OPSI: A, B, C, D)
    LEVEL_01: [
      { id: 'l1_q1', type: 'multiple_choice', question: 'Manakah di bawah ini yang merupakan besaran fisika?', options: [{ id: 'A', label: 'Keindahan' }, { id: 'B', label: 'Panjang' }, { id: 'C', label: 'Warna' }, { id: 'D', label: 'Kebersihan' }], correctAnswer: 'B', explanation: 'Panjang adalah besaran fisika karena dapat diukur dan dinyatakan dengan angka.' },
      { id: 'l1_q2', type: 'multiple_choice', question: 'Manakah pasangan yang seluruhnya merupakan besaran pokok SI?', options: [{ id: 'A', label: 'Panjang dan Massa' }, { id: 'B', label: 'Gaya dan Energi' }, { id: 'C', label: 'Kecepatan dan Waktu' }, { id: 'D', label: 'Luas dan Volume' }], correctAnswer: 'A', explanation: 'Panjang dan massa adalah dua dari tujuh besaran pokok dasar SI.' },
      { id: 'l1_q3', type: 'multiple_choice', question: 'Berikut yang BUKAN merupakan besaran pokok SI adalah...', options: [{ id: 'A', label: 'Suhu Mutlak' }, { id: 'B', label: 'Kuat Arus Listrik' }, { id: 'C', label: 'Gaya' }, { id: 'D', label: 'Intensitas Cahaya' }], correctAnswer: 'C', explanation: 'Gaya merupakan besaran turunan (hasil perkalian massa dan percepatan).' },
      { id: 'l1_q4', type: 'multiple_choice', question: 'Besaran yang diturunkan dari besaran pokok panjang dan waktu adalah...', options: [{ id: 'A', label: 'Massa Jenis' }, { id: 'B', label: 'Kecepatan' }, { id: 'C', label: 'Gaya' }, { id: 'D', label: 'Tekanan' }], correctAnswer: 'B', explanation: 'Kecepatan merupakan hasil bagi besaran panjang (jarak) terhadap waktu.' },
      { id: 'l1_q5', type: 'multiple_choice', question: 'Besaran pokok yang menyatakan jumlah partikel zat dalam SI adalah...', options: [{ id: 'A', label: 'Massa' }, { id: 'B', label: 'Jumlah Zat (mol)' }, { id: 'C', label: 'Intensitas Cahaya' }, { id: 'D', label: 'Volume' }], correctAnswer: 'B', explanation: 'Jumlah zat diukur dalam satuan pokok mol.' },
      { id: 'l1_q6', type: 'multiple_choice', question: 'Berapakah jumlah besaran pokok dalam Sistem Internasional (SI)?', options: [{ id: 'A', label: '5' }, { id: 'B', label: '7' }, { id: 'C', label: '9' }, { id: 'D', label: '12' }], correctAnswer: 'B', explanation: 'Terdapat 7 besaran pokok utama dalam SI.' },
      { id: 'l1_q7', type: 'multiple_choice', question: 'Alat ukur mistar digunakan untuk mengukur besaran pokok...', options: [{ id: 'A', label: 'Panjang' }, { id: 'B', label: 'Massa' }, { id: 'C', label: 'Waktu' }, { id: 'D', label: 'Suhu' }], correctAnswer: 'A', explanation: 'Mistar mengukur panjang.' },
      { id: 'l1_q8', type: 'multiple_choice', question: 'Manakah yang tergolong besaran skalar (hanya memiliki nilai tanpa arah)?', options: [{ id: 'A', label: 'Percepatan' }, { id: 'B', label: 'Energi Kinetik' }, { id: 'C', label: 'Momentum' }, { id: 'D', label: 'Gaya Berat' }], correctAnswer: 'B', explanation: 'Energi kinetik adalah besaran skalar.' },
      { id: 'l1_q9', type: 'multiple_choice', question: 'Besaran fisika berikut yang tergolong besaran vektor (memiliki nilai dan arah) adalah...', options: [{ id: 'A', label: 'Massa' }, { id: 'B', label: 'Waktu' }, { id: 'C', label: 'Perpindahan' }, { id: 'D', label: 'Suhu' }], correctAnswer: 'C', explanation: 'Perpindahan memiliki besar dan arah.' },
      { id: 'l1_q10', type: 'multiple_choice', question: 'Massa jenis merupakan hasil bagi dari besaran pokok massa terhadap besaran turunan...', options: [{ id: 'A', label: 'Luas' }, { id: 'B', label: 'Volume' }, { id: 'C', label: 'Panjang' }, { id: 'D', label: 'Waktu' }], correctAnswer: 'B', explanation: 'Massa jenis = massa / volume.' }
    ],

    // LEVEL 2: BENAR OR SALAH (2 OPSI: BENAR / SALAH)
    LEVEL_02: [
      { id: 'l2_q1', type: 'true_false', question: 'PERNYATAAN: Kalor dan Suhu adalah dua hal yang sama persis dalam fisika.', options: [{ id: 'A', label: 'BENAR' }, { id: 'B', label: 'SALAH' }], correctAnswer: 'B', explanation: 'Pernyataan SALAH. Suhu adalah derajat panas benda (K/°C), sedangkan Kalor adalah energi panas yang berpindah dari suhu tinggi ke rendah.' },
      { id: 'l2_q2', type: 'true_false', question: 'PERNYATAAN: Rasa dingin mengalir masuk ke dalam benda hangat saat disentuh.', options: [{ id: 'A', label: 'BENAR' }, { id: 'B', label: 'SALAH' }], correctAnswer: 'B', explanation: 'Pernyataan SALAH. Dingin bukan energi yang mengalir, melainkan kalor (energi panas) yang mengalir keluar dari benda hangat ke lingkungan.' },
      { id: 'l2_q3', type: 'true_false', question: 'PERNYATAAN: Satuan standar internasional (SI) untuk besaran massa adalah kilogram (kg).', options: [{ id: 'A', label: 'BENAR' }, { id: 'B', label: 'SALAH' }], correctAnswer: 'A', explanation: 'Pernyataan BENAR. Kilogram (kg) adalah satuan SI massa.' },
      { id: 'l2_q4', type: 'true_false', question: 'PERNYATAAN: Satuan SI untuk suhu mutlak adalah derajat Celsius (°C).', options: [{ id: 'A', label: 'BENAR' }, { id: 'B', label: 'SALAH' }], correctAnswer: 'B', explanation: 'Pernyataan SALAH. Satuan standar internasional untuk suhu mutlak adalah Kelvin (K).' },
      { id: 'l2_q5', type: 'true_false', question: 'PERNYATAAN: Satu Joule setara dengan 1 Newton dikali 1 Meter (1 N·m).', options: [{ id: 'A', label: 'BENAR' }, { id: 'B', label: 'SALAH' }], correctAnswer: 'A', explanation: 'Pernyataan BENAR. Usaha W = F x s -> 1 J = 1 N · m.' },
      { id: 'l2_q6', type: 'true_false', question: 'PERNYATAAN: Gaya berat dan massa benda adalah dua besaran yang sama persis.', options: [{ id: 'A', label: 'BENAR' }, { id: 'B', label: 'SALAH' }], correctAnswer: 'B', explanation: 'Pernyataan SALAH. Massa adalah jumlah materi (kg), sedangkan Berat adalah gaya gravitasi (Newton).' },
      { id: 'l2_q7', type: 'true_false', question: 'PERNYATAAN: Kuat arus listrik merupakan besaran pokok dengan satuan SI Ampere.', options: [{ id: 'A', label: 'BENAR' }, { id: 'B', label: 'SALAH' }], correctAnswer: 'A', explanation: 'Pernyataan BENAR. Kuat arus listrik adalah salah satu dari 7 besaran pokok SI.' },
      { id: 'l2_q8', type: 'true_false', question: 'PERNYATAAN: Kecepatan mengukur jarak per satuan waktu, sehingga ber-satuan SI m/s.', options: [{ id: 'A', label: 'BENAR' }, { id: 'B', label: 'SALAH' }], correctAnswer: 'A', explanation: 'Pernyataan BENAR. Kecepatan v = m/s.' },
      { id: 'l2_q9', type: 'true_false', question: 'PERNYATAAN: Tekanan didefinisikan sebagai gaya per satuan volume.', options: [{ id: 'A', label: 'BENAR' }, { id: 'B', label: 'SALAH' }], correctAnswer: 'B', explanation: 'Pernyataan SALAH. Tekanan P = F / A (Gaya per satuan Luas).' },
      { id: 'l2_q10', type: 'true_false', question: 'PERNYATAAN: Besaran skalar adalah besaran yang memiliki nilai dan arah.', options: [{ id: 'A', label: 'BENAR' }, { id: 'B', label: 'SALAH' }], correctAnswer: 'B', explanation: 'Pernyataan SALAH. Besaran skalar hanya memiliki nilai tanpa memperhitungkan arah.' }
    ],

    // LEVEL 3: MENCOCOKKAN / MENJODOHKAN (PASANGKAN KIRI & KANAN)
    LEVEL_03: [
      { id: 'l3_q1', type: 'matching', question: 'Pasangkan besaran pokok fisika dengan simbol dimensi SI yang tepat:', pairs: [{ left: 'Panjang', right: '[L]' }, { left: 'Massa', right: '[M]' }, { left: 'Waktu', right: '[T]' }], explanation: 'Panjang [L], Massa [M], Waktu [T].' },
      { id: 'l3_q2', type: 'matching', question: 'Pasangkan besaran turunan fisika dengan satuan SI yang setara:', pairs: [{ left: 'Gaya (Newton)', right: 'kg·m/s²' }, { left: 'Usaha / Energi (Joule)', right: 'kg·m²/s²' }, { left: 'Tekanan (Pascal)', right: 'N/m²' }], explanation: 'F=ma (kg·m/s²), W=Fs (kg·m²/s²), P=F/A (N/m²).' },
      { id: 'l3_q3', type: 'matching', question: 'Pasangkan nama alat ukur dengan besaran pokok yang diukurnya:', pairs: [{ left: 'Jangka Sorong / Mistar', right: 'Besaran Panjang' }, { left: 'Neraca Ohauss', right: 'Besaran Massa' }, { left: 'Stopwatch Digital', right: 'Besaran Waktu' }], explanation: 'Mistar mengukur panjang, Neraca mengukur massa, Stopwatch mengukur waktu.' },
      { id: 'l3_q4', type: 'matching', question: 'Pasangkan jenis besaran fisika dengan karakteristik utamanya:', pairs: [{ left: 'Besaran Skalar', right: 'Hanya Memiliki Nilai' }, { left: 'Besaran Vektor', right: 'Memiliki Nilai & Arah' }, { left: 'Regangan (Strain)', right: 'Tanpa Dimensi' }], explanation: 'Skalar hanya nilai, Vektor nilai & arah, Regangan tanpa dimensi.' },
      { id: 'l3_q5', type: 'matching', question: 'Pasangkan rumus fisika sederhana dengan besaran yang dihasilkan:', pairs: [{ left: 'F = m · a', right: 'Gaya (Newton)' }, { left: 'W = F · s', right: 'Usaha (Joule)' }, { left: 'P = W / t', right: 'Daya (Watt)' }], explanation: 'F=Gaya, W=Usaha, P=Daya.' }
    ],

    // LEVEL 4: PILIHAN GANDA KOMPLEKS (CENTANG LEBIH DARI 1 JAWABAN BENAR)
    LEVEL_04: [
      { id: 'l4_q1', type: 'multiple_select', question: 'Manakah di bawah ini yang SELURUHNYA merupakan besaran pokok SI? (Centang semua jawaban benar)', options: [{ id: 'A', label: 'Panjang' }, { id: 'B', label: 'Gaya' }, { id: 'C', label: 'Massa' }, { id: 'D', label: 'Kecepatan' }], correctAnswers: [0, 2], explanation: 'Panjang dan Massa adalah besaran pokok SI. Gaya dan Kecepatan adalah besaran turunan.' },
      { id: 'l4_q2', type: 'multiple_select', question: 'Manakah dua besaran fisika berikut yang MEMILIKI DIMENSI SAMA [ML²T⁻²]? (Centang semua jawaban benar)', options: [{ id: 'A', label: 'Usaha (Work)' }, { id: 'B', label: 'Gaya (Force)' }, { id: 'C', label: 'Energi Kinetik (Ek)' }, { id: 'D', label: 'Kecepatan (Velocity)' }], correctAnswers: [0, 2], explanation: 'Usaha dan Energi Kinetik keduanya berdimensi [ML²T⁻²].' },
      { id: 'l4_q3', type: 'multiple_select', question: 'Manakah pasangan besaran dan satuan SI berikut yang BENAR? (Centang semua jawaban benar)', options: [{ id: 'A', label: 'Kuat Arus — Ampere (A)' }, { id: 'B', label: 'Waktu — Menit' }, { id: 'C', label: 'Massa Jenis — kg/m³' }, { id: 'D', label: 'Suhu — Celsius (°C)' }], correctAnswers: [0, 2], explanation: 'Kuat arus ber-satuan Ampere dan massa jenis kg/m³. Waktu SI adalah detik dan Suhu SI adalah Kelvin.' },
      { id: 'l4_q4', type: 'multiple_select', question: 'Manakah besaran fisika di bawah ini yang tergolong BESARAN VEKTOR (memiliki besar dan arah)? (Centang semua jawaban benar)', options: [{ id: 'A', label: 'Gaya (Force)' }, { id: 'B', label: 'Massa (Mass)' }, { id: 'C', label: 'Perpindahan (Displacement)' }, { id: 'D', label: 'Waktu (Time)' }], correctAnswers: [0, 2], explanation: 'Gaya dan Perpindahan adalah besaran vektor.' },
      { id: 'l4_q5', type: 'multiple_select', question: 'Manakah suku persamaan di bawah ini yang berdimensi sama dengan Tekanan [ML⁻¹T⁻²]? (Centang semua jawaban benar)', options: [{ id: 'A', label: 'Tekanan Hidrostatis (ρ·g·h)' }, { id: 'B', label: 'Tekanan Dinamis (½·ρ·v²)' }, { id: 'C', label: 'Gaya Berat (m·g)' }, { id: 'D', label: 'Daya Listrik (P)' }], correctAnswers: [0, 1], explanation: 'Suku ρgh dan ½ρv² pada persamaan Bernoulli keduanya berdimensi Tekanan [ML⁻¹T⁻²].' }
    ],

    // LEVEL 5: ISIAN SINGKAT (KETIKKAN TEKS / ANGKA JAWABAN)
    LEVEL_05: [
      { id: 'l5_q1', type: 'short_answer', question: 'Apakah nama besaran pokok SI yang mengukur derajat panas suatu benda?', correctAnswers: ['Suhu', 'suhu', 'Suhu Mutlak', 'Kelvin'], explanation: 'Suhu mengukur derajat panas benda dengan satuan SI Kelvin.' },
      { id: 'l5_q2', type: 'short_answer', question: 'Apakah nama satuan standar internasional (SI) untuk suhu mutlak?', correctAnswers: ['Kelvin', 'kelvin', 'K'], explanation: 'Kelvin (K) adalah satuan standar internasional untuk suhu mutlak.' },
      { id: 'l5_q3', type: 'short_answer', question: 'Apakah simbol dimensi untuk besaran percepatan [m/s²]?', correctAnswers: ['[LT-2]', '[LT^-2]', 'LT-2', 'LT^-2'], explanation: 'Percepatan a = m/s² -> [L][T]⁻² = [LT⁻²].' },
      { id: 'l5_q4', type: 'short_answer', question: 'Berapakah jumlah besaran pokok dalam Sistem Internasional (SI)?', correctAnswers: ['7', 'tujuh', '7 besaran'], explanation: 'Terdapat 7 besaran pokok utama dalam SI.' },
      { id: 'l5_q5', type: 'short_answer', question: 'Tekanan hidrostatis P = ρ · g · h. Jika ρ=1000 kg/m³, g=10 m/s², h=2 m, berapakah P dalam Pascal?', correctAnswers: ['20000', '20.000', '20000 Pa', '20.000 Pa'], explanation: 'P = 1000 x 10 x 2 = 20.000 Pascal.' }
    ]
  };

  let cachedPoolKey = null;
  let cachedQuestions = null;

  function resetQuestionCache() {
    cachedPoolKey = null;
    cachedQuestions = null;
  }

  function formatQuestionForGroupPlay(q, levelId) {
    // 1. Preserve explicit type if provided on question (e.g., uploaded Word or custom module)
    let type = q.type || q.questionType;
    if (!type) {
      if (q.pairs && q.pairs.length > 0) type = 'matching';
      else if (q.correctAnswers) {
        type = (Array.isArray(q.correctAnswers) && typeof q.correctAnswers[0] === 'number') ? 'multiple_select' : 'short_answer';
      } else {
        type = levelId === 'LEVEL_02' ? 'true_false' :
               levelId === 'LEVEL_03' ? 'matching' :
               levelId === 'LEVEL_04' ? 'multiple_select' :
               levelId === 'LEVEL_05' ? 'short_answer' : 'multiple_choice';
      }
    }

    // 2. Preserve teacher options verbatim
    let opts = undefined;
    if (q.options && Array.isArray(q.options) && q.options.length > 0) {
      opts = q.options.map((opt, i) => ({
        id: typeof opt === 'object' && opt.id ? opt.id : String.fromCharCode(65 + i),
        label: typeof opt === 'string' ? opt : (opt.label || opt.text || '')
      }));
    } else if (type === 'true_false') {
      opts = [{ id: 'A', label: 'BENAR' }, { id: 'B', label: 'SALAH' }];
    }

    return {
      id: q.id || `gp_${Math.random().toString(36).substr(2, 5)}`,
      type: type,
      question: q.question,
      options: opts,
      correct: q.correct,
      correctAnswers: q.correctAnswers,
      correctAnswer: q.correctAnswer || (type === 'true_false' ? 'A' : (typeof q.correct === 'number' ? String.fromCharCode(65 + q.correct) : 'A')),
      pairs: q.pairs,
      explanation: q.explanation || "Pembahasan presisi bebas miskonsepsi disusun oleh Guru AI."
    };
  }

  function getQuestionsForLevel(levelId, limit, selectedModuleId) {
    const lvlKey = levelId || 'LEVEL_01';
    const cacheKey = `${lvlKey}_${selectedModuleId || 'ALL'}`;
    
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
        targetQuiz = customQuizzes.find(q => q.materialId === matId || q.id === `quiz_${matId}` || String(q.materialId) === String(selectedModuleId));
      }

      if (targetQuiz && targetQuiz.questions && targetQuiz.questions.length > 0) {
        pool = targetQuiz.questions.map(q => formatQuestionForGroupPlay(q, lvlKey));
      }
    }

    if (pool.length === 0) {
      const baseList = QUESTION_BANK[lvlKey] || QUESTION_BANK.LEVEL_01;
      pool = baseList.map(q => formatQuestionForGroupPlay(q, lvlKey));
    }

    // Cache questions pool
    cachedPoolKey = cacheKey;
    cachedQuestions = pool;

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


