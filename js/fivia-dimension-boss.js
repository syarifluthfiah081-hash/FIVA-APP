/**
 * FIVIA PHYSICS QUEST - LEVEL 05: DIMENSION BOSS (PHASE 3E)
 * Theme: "The Final Dimension Crisis"
 * 50 Scientifically Validated Final Boss Challenges across 5 Stages
 */

window.FIVIAQuestDimensionBoss = (function() {
  'use strict';

  // 50 Scientifically Validated Boss Challenges across 5 Stages
  const DIMENSION_BOSS_DATA = [
    // ==========================================
    // BOSS STAGE 01: DIMENSION LOCK (10 Challenges)
    // ==========================================
    {
      id: "db_s01_1",
      stage: 1,
      type: "lock",
      difficulty: "easy",
      title: "DIMENSION LOCK #1",
      question: "Buka Gerbang Keamanan 1: Apakah dimensi dari KECEPATAN (v = s/t)?",
      givenEq: "v = s/t",
      correctAnswer: "C",
      options: [
        { id: "A", text: "[L]" },
        { id: "B", text: "[T]" },
        { id: "C", text: "[L][T]⁻¹" },
        { id: "D", text: "[M][L][T]⁻²" }
      ],
      dimension: "[L][T]⁻¹",
      explanation: "[s] = [L], [t] = [T]. Maka [v] = [L] / [T] = [L][T]⁻¹.",
      hint: "Kecepatan adalah jarak (panjang) dibagi waktu.",
      misconception: "[L][T]⁻² adalah percepatan, bukan kecepatan.",
      xp: 10,
      bossPoints: 100,
      hpDamage: 10
    },
    {
      id: "db_s01_2",
      stage: 1,
      type: "lock",
      difficulty: "easy",
      title: "DIMENSION LOCK #2",
      question: "Buka Gerbang Keamanan 2: Apakah dimensi dari GAYA (F = m · a)?",
      givenEq: "F = m · a",
      correctAnswer: "D",
      options: [
        { id: "A", text: "[M][L]²[T]⁻²" },
        { id: "B", text: "[M][L][T]⁻¹" },
        { id: "C", text: "[M][L]⁻¹[T]⁻²" },
        { id: "D", text: "[M][L][T]⁻²" }
      ],
      dimension: "[M][L][T]⁻²",
      explanation: "[m] = [M], [a] = [L][T]⁻². Maka [F] = [M] × [L][T]⁻² = [M][L][T]⁻².",
      hint: "Gaya adalah perkalian massa dengan percepatan.",
      misconception: "Newton (N) adalah nama satuan, sedangkan [M][L][T]⁻² adalah dimensinya.",
      xp: 10,
      bossPoints: 100,
      hpDamage: 10
    },
    {
      id: "db_s01_3",
      stage: 1,
      type: "lock",
      difficulty: "easy",
      title: "DIMENSION LOCK #3",
      question: "Buka Gerbang Keamanan 3: Apakah dimensi dari ENERGI KINETIK (Ek = ½ m v²)?",
      givenEq: "Ek = ½ m v²",
      correctAnswer: "A",
      options: [
        { id: "A", text: "[M][L]²[T]⁻²" },
        { id: "B", text: "[M][L][T]⁻²" },
        { id: "C", text: "[M][L]²[T]⁻³" },
        { id: "D", text: "[M][L]⁻¹[T]⁻²" }
      ],
      dimension: "[M][L]²[T]⁻²",
      explanation: "Konstanta ½ tak berdimensi. [m] = [M], [v]² = ([L][T]⁻¹)² = [L]²[T]⁻². Maka [Ek] = [M][L]²[T]⁻².",
      hint: "Energi memuat komponen panjang berpangkat dua.",
      misconception: "Angka ½ tidak memengaruhi dimensi fisik.",
      xp: 10,
      bossPoints: 100,
      hpDamage: 10
    },
    {
      id: "db_s01_4",
      stage: 1,
      type: "lock",
      difficulty: "medium",
      title: "DIMENSION LOCK #4",
      question: "Buka Gerbang Keamanan 4: Apakah dimensi dari DAYA (P = W / t)?",
      givenEq: "P = W / t",
      correctAnswer: "C",
      options: [
        { id: "A", text: "[M][L]²[T]⁻²" },
        { id: "B", text: "[M][L][T]⁻²" },
        { id: "C", text: "[M][L]²[T]⁻³" },
        { id: "D", text: "[M][L]⁻¹[T]⁻²" }
      ],
      dimension: "[M][L]²[T]⁻³",
      explanation: "[W] = [M][L]²[T]⁻², [t] = [T]. Maka [P] = ([M][L]²[T]⁻²) / [T] = [M][L]²[T]⁻³.",
      hint: "Daya adalah energi dibagi waktu.",
      misconception: "Daya membagi energi dengan waktu sehingga pangkat waktu menjadi -3.",
      xp: 10,
      bossPoints: 100,
      hpDamage: 10
    },
    {
      id: "db_s01_5",
      stage: 1,
      type: "lock",
      difficulty: "medium",
      title: "DIMENSION LOCK #5",
      question: "Buka Gerbang Keamanan 5: Apakah dimensi dari TEKANAN (p = F / A)?",
      givenEq: "p = F / A",
      correctAnswer: "B",
      options: [
        { id: "A", text: "[M][L]²[T]⁻²" },
        { id: "B", text: "[M][L]⁻¹[T]⁻²" },
        { id: "C", text: "[M][L]⁻³" },
        { id: "D", text: "[M][L][T]⁻²" }
      ],
      dimension: "[M][L]⁻¹[T]⁻²",
      explanation: "[F] = [M][L][T]⁻², Luas [A] = [L]². Maka [p] = ([M][L][T]⁻²) / [L]² = [M][L]⁻¹[T]⁻².",
      hint: "Tekanan adalah Gaya per satuan Luas.",
      misconception: "[L] dibagi [L]² menghasilkan [L]⁻¹.",
      xp: 10,
      bossPoints: 100,
      hpDamage: 10
    },
    {
      id: "db_s01_6",
      stage: 1,
      type: "lock",
      difficulty: "medium",
      title: "DIMENSION LOCK #6",
      question: "Buka Gerbang Keamanan 6: Apakah dimensi dari MOMENTUM (p = m · v)?",
      givenEq: "p = m · v",
      correctAnswer: "D",
      options: [
        { id: "A", text: "[M][L][T]⁻²" },
        { id: "B", text: "[M][L]²[T]⁻¹" },
        { id: "C", text: "[L][T]⁻¹" },
        { id: "D", text: "[M][L][T]⁻¹" }
      ],
      dimension: "[M][L][T]⁻¹",
      explanation: "[m] = [M], [v] = [L][T]⁻¹. Maka [p] = [M] × [L][T]⁻¹ = [M][L][T]⁻¹.",
      hint: "Momentum adalah massa dikali kecepatan.",
      misconception: "Momentum memiliki dimensi yang sama dengan Impuls.",
      xp: 10,
      bossPoints: 100,
      hpDamage: 10
    },
    {
      id: "db_s01_7",
      stage: 1,
      type: "lock",
      difficulty: "hard",
      title: "DIMENSION LOCK #7",
      question: "Buka Gerbang Keamanan 7: Apakah dimensi dari MASSA JENIS (ρ = m / V)?",
      givenEq: "ρ = m / V",
      correctAnswer: "A",
      options: [
        { id: "A", text: "[M][L]⁻³" },
        { id: "B", text: "[M][L]³" },
        { id: "C", text: "[M][L][T]⁻¹" },
        { id: "D", text: "[M][L]⁻¹[T]⁻²" }
      ],
      dimension: "[M][L]⁻³",
      explanation: "[m] = [M], Volume [V] = [L]³. Maka [ρ] = [M] / [L]³ = [M][L]⁻³.",
      hint: "Massa jenis adalah massa dibagi volume.",
      misconception: "Volume di penyebut berdimensi [L]³ sehingga berpangkat negatif -3.",
      xp: 10,
      bossPoints: 100,
      hpDamage: 10
    },
    {
      id: "db_s01_8",
      stage: 1,
      type: "lock",
      difficulty: "hard",
      title: "DIMENSION LOCK #8",
      question: "Buka Gerbang Keamanan 8: Apakah dimensi dari FREKUENSI (f = 1 / T)?",
      givenEq: "f = 1 / T",
      correctAnswer: "B",
      options: [
        { id: "A", text: "[T]" },
        { id: "B", text: "[T]⁻¹" },
        { id: "C", text: "[L][T]⁻¹" },
        { id: "D", text: "[T]⁻²" }
      ],
      dimension: "[T]⁻¹",
      explanation: "[T] = [T]. Maka [f] = 1 / [T] = [T]⁻¹.",
      hint: "Frekuensi adalah kebalikan dari periode waktu.",
      misconception: "Satuan Hz berdimensi [T]⁻¹.",
      xp: 10,
      bossPoints: 100,
      hpDamage: 10
    },
    {
      id: "db_s01_9",
      stage: 1,
      type: "lock",
      difficulty: "hard",
      title: "DIMENSION LOCK #9",
      question: "Buka Gerbang Keamanan 9: Apakah dimensi dari MUATAN LISTRIK (Q = I · t)?",
      givenEq: "Q = I · t",
      correctAnswer: "C",
      options: [
        { id: "A", text: "[I]" },
        { id: "B", text: "[I][T]⁻¹" },
        { id: "C", text: "[I][T]" },
        { id: "D", text: "[M][L]²[T]⁻³[I]⁻¹" }
      ],
      dimension: "[I][T]",
      explanation: "[I] = [I], [t] = [T]. Maka [Q] = [I][T].",
      hint: "Muatan adalah Kuat Arus dikali Waktu.",
      misconception: "Coulomb (C) berdimensi [I][T].",
      xp: 10,
      bossPoints: 100,
      hpDamage: 10
    },
    {
      id: "db_s01_10",
      stage: 1,
      type: "lock",
      difficulty: "hard",
      title: "DIMENSION LOCK #10",
      question: "Buka Gerbang Keamanan 10: Manakah simbol dimensi baku untuk INTENSITAS CAHAYA dalam SI?",
      givenEq: "I_v (Candela)",
      correctAnswer: "D",
      options: [
        { id: "A", text: "[I]" },
        { id: "B", text: "J (Joule)" },
        { id: "C", text: "cd (Candela)" },
        { id: "D", text: "[J]" }
      ],
      dimension: "[J]",
      explanation: "[J] dengan kurung siku adalah simbol dimensi baku SI untuk Intensitas Cahaya (cd).",
      hint: "Gunakan simbol kurung siku untuk dimensi.",
      misconception: "Huruf J tanpa kurung siku adalah Joule (satuan energi), sedangkan [J] adalah dimensi intensitas cahaya.",
      xp: 10,
      bossPoints: 100,
      hpDamage: 10
    },

    // ==========================================
    // BOSS STAGE 02: FORMULA ANALYZER (10 Challenges)
    // ==========================================
    {
      id: "db_s02_1",
      stage: 2,
      type: "analyzer",
      difficulty: "easy",
      title: "FORMULA ANALYZER #1",
      question: "Analisis Persamaan: s = v · t. Apakah persamaan ini KONSISTEN secara dimensional?",
      givenEq: "s = v · t",
      leftExpr: "[s] = [L]",
      rightExpr: "[v · t] = [L][T]⁻¹ × [T] = [L]",
      isValid: true,
      correctAnswer: "valid",
      explanation: "Sisi kiri [L] SAMA dengan sisi kanan [L]. Persamaan KONSISTEN!",
      hint: "Bandingkan dimensi ruas kiri dan ruas kanan.",
      misconception: "s = v·t adalah persamaan gerak lurus GLB yang konsisten.",
      xp: 10,
      bossPoints: 100,
      hpDamage: 10
    },
    {
      id: "db_s02_2",
      stage: 2,
      type: "analyzer",
      difficulty: "easy",
      title: "FORMULA ANALYZER #2",
      question: "Analisis Persamaan: s = v · t². Apakah persamaan ini KONSISTEN secara dimensional?",
      givenEq: "s = v · t²",
      leftExpr: "[s] = [L]",
      rightExpr: "[v · t²] = [L][T]⁻¹ × [T]² = [L][T]",
      isValid: false,
      correctAnswer: "invalid",
      explanation: "Sisi kiri [L] TIDAK SAMA dengan sisi kanan [L][T]. Persamaan TIDAK KONSISTEN!",
      hint: "Lihat hasil perkalian waktu kuadrat.",
      misconception: "[L] ≠ [L][T]. Rumus yang benar adalah s = v·t atau s = ½ a·t².",
      xp: 10,
      bossPoints: 100,
      hpDamage: 10
    },
    {
      id: "db_s02_3",
      stage: 2,
      type: "analyzer",
      difficulty: "medium",
      title: "FORMULA ANALYZER #3",
      question: "Analisis Persamaan Energi Kinetik: Ek = ½ m v². Apakah KONSISTEN secara dimensional?",
      givenEq: "Ek = ½ m v²",
      leftExpr: "[Ek] = [M][L]²[T]⁻²",
      rightExpr: "[½ m v²] = [M] × ([L][T]⁻¹)² = [M][L]²[T]⁻²",
      isValid: true,
      correctAnswer: "valid",
      explanation: "Angka ½ tak berdimensi. Dimensi kiri dan kanan persis sama [M][L]²[T]⁻². KONSISTEN!",
      hint: "Konstanta skalar (½) diabaikan dalam analisis dimensi.",
      misconception: "Persamaan energi kinetik sah secara dimensional.",
      xp: 10,
      bossPoints: 100,
      hpDamage: 10
    },
    {
      id: "db_s02_4",
      stage: 2,
      type: "analyzer",
      difficulty: "medium",
      title: "FORMULA ANALYZER #4",
      question: "Analisis Persamaan Gaya: F = m · v. Apakah KONSISTEN secara dimensional?",
      givenEq: "F = m · v",
      leftExpr: "[F] = [M][L][T]⁻²",
      rightExpr: "[m · v] = [M] × [L][T]⁻¹ = [M][L][T]⁻¹",
      isValid: false,
      correctAnswer: "invalid",
      explanation: "Gaya memuat [T]⁻², sedangkan m·v memuat [T]⁻¹ (momentum). TIDAK KONSISTEN!",
      hint: "Gaya memerlukan percepatan, bukan kecepatan.",
      misconception: "Rumus gaya yang benar adalah F = m·a.",
      xp: 10,
      bossPoints: 100,
      hpDamage: 10
    },
    {
      id: "db_s02_5",
      stage: 2,
      type: "analyzer",
      difficulty: "medium",
      title: "FORMULA ANALYZER #5",
      question: "Analisis Hukum 2 Newton: F = m · a. Apakah KONSISTEN secara dimensional?",
      givenEq: "F = m · a",
      leftExpr: "[F] = [M][L][T]⁻²",
      rightExpr: "[m · a] = [M] × [L][T]⁻² = [M][L][T]⁻²",
      isValid: true,
      correctAnswer: "valid",
      explanation: "Kedua ruas berdimensi [M][L][T]⁻². KONSISTEN!",
      hint: "Hukum Newton 2 adalah dasar dinamika.",
      misconception: "Hukum 2 Newton sah secara dimensional.",
      xp: 10,
      bossPoints: 100,
      hpDamage: 10
    },
    {
      id: "db_s02_6",
      stage: 2,
      type: "analyzer",
      difficulty: "hard",
      title: "FORMULA ANALYZER #6",
      question: "Analisis Persamaan Tekanan Hidrostatis: p = ρ · g · h. Apakah KONSISTEN secara dimensional?",
      givenEq: "p = ρ · g · h",
      leftExpr: "[p] = [M][L]⁻¹[T]⁻²",
      rightExpr: "[ρ·g·h] = [M][L]⁻³ × [L][T]⁻² × [L] = [M][L]⁻¹[T]⁻²",
      isValid: true,
      correctAnswer: "valid",
      explanation: "Sisi kanan [M][L]⁻³ · [L]²[T]⁻² = [M][L]⁻¹[T]⁻², sama dengan sisi kiri. KONSISTEN!",
      hint: "Kalikan dimensi massa jenis, percepatan gravitasi, dan kedalaman.",
      misconception: "Persamaan p = ρgh sah secara dimensional.",
      xp: 10,
      bossPoints: 100,
      hpDamage: 15
    },
    {
      id: "db_s02_7",
      stage: 2,
      type: "analyzer",
      difficulty: "hard",
      title: "FORMULA ANALYZER #7",
      question: "Analisis Persamaan Usaha: W = F / s. Apakah KONSISTEN secara dimensional?",
      givenEq: "W = F / s",
      leftExpr: "[W] = [M][L]²[T]⁻²",
      rightExpr: "[F / s] = ([M][L][T]⁻²) / [L] = [M][T]⁻²",
      isValid: false,
      correctAnswer: "invalid",
      explanation: "Usaha W = F × s (perkalian, bukan pembagian). F/s menghasilkan [M][T]⁻². TIDAK KONSISTEN!",
      hint: "Usaha adalah hasil perkalian gaya dengan jarak.",
      misconception: "Usaha adalah Gaya dikali Perpindahan.",
      xp: 10,
      bossPoints: 100,
      hpDamage: 15
    },
    {
      id: "db_s02_8",
      stage: 2,
      type: "analyzer",
      difficulty: "hard",
      title: "FORMULA ANALYZER #8",
      question: "Analisis Teorema Impuls-Momentum: I = Δp. Apakah KONSISTEN secara dimensional?",
      givenEq: "I = Δp",
      leftExpr: "[I] (F·Δt) = [M][L][T]⁻² × [T] = [M][L][T]⁻¹",
      rightExpr: "[Δp] (m·v) = [M] × [L][T]⁻¹ = [M][L][T]⁻¹",
      isValid: true,
      correctAnswer: "valid",
      explanation: "Impuls dan Momentum memiliki dimensi yang identik [M][L][T]⁻¹. KONSISTEN!",
      hint: "Impuls dan perubahan momentum memiliki satuan N·s atau kg·m/s.",
      misconception: "Impuls dan momentum terbukti sah secara dimensional.",
      xp: 10,
      bossPoints: 100,
      hpDamage: 15
    },
    {
      id: "db_s02_9",
      stage: 2,
      type: "analyzer",
      difficulty: "hard",
      title: "FORMULA ANALYZER #9",
      question: "Analisis Persamaan Kecepatan Jatuh Bebas: v = √(2 g h). Apakah KONSISTEN secara dimensional?",
      givenEq: "v = √(2 g h)",
      leftExpr: "[v] = [L][T]⁻¹",
      rightExpr: "[√(2 gh)] = √([L][T]⁻² × [L]) = √([L]²[T]⁻²) = [L][T]⁻¹",
      isValid: true,
      correctAnswer: "valid",
      explanation: "2gh berdimensi [L]²[T]⁻². Diakarkan menjadi [L][T]⁻¹, sama dengan kecepatan. KONSISTEN!",
      hint: "Operasi akar kuadrat juga mengakar pangkat dimensi.",
      misconception: "Persamaan v = √(2gh) sah secara dimensional.",
      xp: 10,
      bossPoints: 100,
      hpDamage: 15
    },
    {
      id: "db_s02_10",
      stage: 2,
      type: "analyzer",
      difficulty: "hard",
      title: "FORMULA ANALYZER #10",
      question: "Analisis Persamaan Jarak GLBB: s = v₀·t + ½ a·t². Apakah KONSISTEN secara dimensional?",
      givenEq: "s = v₀·t + ½ a·t²",
      leftExpr: "[s] = [L]",
      rightExpr: "[v₀·t] = [L], [½ a·t²] = [L] -> [L] + [L] = [L]",
      isValid: true,
      correctAnswer: "valid",
      explanation: "Kedua suku kanan berdimensi [L]. Penjumlahan suku-suku berdimensi sama menghasilkan dimensi yang sama [L]. KONSISTEN!",
      hint: "Setiap suku yang dijumlahkan harus berdimensi sama.",
      misconception: "Persamaan GLBB lengkap sah secara dimensional.",
      xp: 10,
      bossPoints: 100,
      hpDamage: 15
    },

    // ==========================================
    // BOSS STAGE 03: UNKNOWN VARIABLE (10 Challenges)
    // ==========================================
    {
      id: "db_s03_1",
      stage: 3,
      type: "unknown",
      difficulty: "easy",
      title: "UNKNOWN VARIABLE #1",
      question: "Tentukan dimensi variabel X dari persamaan: F = X · t  (di mana [F] = [M][L][T]⁻² dan [t] = [T])",
      givenEq: "F = X · t",
      correctAnswer: "B",
      options: [
        { id: "A", text: "[M][L][T]⁻¹" },
        { id: "B", text: "[M][L][T]⁻³" },
        { id: "C", text: "[M][L]²[T]⁻²" },
        { id: "D", text: "[M][L][T]⁻²" }
      ],
      dimension: "[M][L][T]⁻³",
      explanation: "[X] = [F] / [t] = ([M][L][T]⁻²) / [T] = [M][L][T]⁻³.",
      hint: "Bagi dimensi gaya dengan dimensi waktu.",
      misconception: "Membagi [T]⁻² dengan [T] menghasilkan [T]⁻³.",
      xp: 10,
      bossPoints: 100,
      hpDamage: 10
    },
    {
      id: "db_s03_2",
      stage: 3,
      type: "unknown",
      difficulty: "easy",
      title: "UNKNOWN VARIABLE #2",
      question: "Tentukan dimensi variabel Y dari persamaan Daya: P = Y · v  (di mana [P] = [M][L]²[T]⁻³ dan [v] = [L][T]⁻¹)",
      givenEq: "P = Y · v",
      correctAnswer: "D",
      options: [
        { id: "A", text: "[M][L]²[T]⁻²" },
        { id: "B", text: "[M][L]⁻¹[T]⁻²" },
        { id: "C", text: "[M][L][T]⁻¹" },
        { id: "D", text: "[M][L][T]⁻²" }
      ],
      dimension: "[M][L][T]⁻²",
      explanation: "[Y] = [P] / [v] = ([M][L]²[T]⁻³) / ([L][T]⁻¹) = [M][L][T]⁻² (Variabel Gaya Y = F).",
      hint: "Daya = Gaya × Kecepatan.",
      misconception: "Y adalah dimensi Gaya.",
      xp: 10,
      bossPoints: 100,
      hpDamage: 10
    },
    {
      id: "db_s03_3",
      stage: 3,
      type: "unknown",
      difficulty: "medium",
      title: "UNKNOWN VARIABLE #3",
      question: "Persamaan A = B · C. Jika [B] = [M] dan [C] = [L][T]⁻², tentukan dimensi A!",
      givenEq: "A = B · C",
      correctAnswer: "A",
      options: [
        { id: "A", text: "[M][L][T]⁻²" },
        { id: "B", text: "[M][L]²[T]⁻²" },
        { id: "C", text: "[M][L][T]⁻¹" },
        { id: "D", text: "[L][T]⁻²" }
      ],
      dimension: "[M][L][T]⁻²",
      explanation: "[A] = [M] × [L][T]⁻² = [M][L][T]⁻² (Dimensi Gaya).",
      hint: "Kalikan dimensi B dan C.",
      misconception: "Variabel A berdimensi Gaya.",
      xp: 10,
      bossPoints: 100,
      hpDamage: 10
    },
    {
      id: "db_s03_4",
      stage: 3,
      type: "unknown",
      difficulty: "medium",
      title: "UNKNOWN VARIABLE #4",
      question: "Persamaan X = F / A. Jika [F] = [M][L][T]⁻² dan [A] = [L]², tentukan dimensi X!",
      givenEq: "X = F / A",
      correctAnswer: "C",
      options: [
        { id: "A", text: "[M][L]²[T]⁻²" },
        { id: "B", text: "[M][L]⁻³" },
        { id: "C", text: "[M][L]⁻¹[T]⁻²" },
        { id: "D", text: "[M][L][T]⁻²" }
      ],
      dimension: "[M][L]⁻¹[T]⁻²",
      explanation: "[X] = ([M][L][T]⁻²) / [L]² = [M][L]⁻¹[T]⁻² (Dimensi Tekanan).",
      hint: "Bagi gaya dengan luas.",
      misconception: "X berdimensi Tekanan.",
      xp: 10,
      bossPoints: 100,
      hpDamage: 10
    },
    {
      id: "db_s03_5",
      stage: 3,
      type: "unknown",
      difficulty: "medium",
      title: "UNKNOWN VARIABLE #5",
      question: "Persamaan Y = m · g · h. Tentukan dimensi variabel Y!",
      givenEq: "Y = m · g · h",
      correctAnswer: "B",
      options: [
        { id: "A", text: "[M][L][T]⁻²" },
        { id: "B", text: "[M][L]²[T]⁻²" },
        { id: "C", text: "[M][L]²[T]⁻³" },
        { id: "D", text: "[M][L]⁻¹[T]⁻²" }
      ],
      dimension: "[M][L]²[T]⁻²",
      explanation: "[Y] = [M] × [L][T]⁻² × [L] = [M][L]²[T]⁻² (Energi Potensial).",
      hint: "Kalikan massa, percepatan, dan tinggi.",
      misconception: "Y berdimensi Energi.",
      xp: 10,
      bossPoints: 100,
      hpDamage: 10
    },
    {
      id: "db_s03_6",
      stage: 3,
      type: "unknown",
      difficulty: "hard",
      title: "UNKNOWN VARIABLE #6",
      question: "Persamaan Z = W / t. Tentukan dimensi variabel Z!",
      givenEq: "Z = W / t",
      correctAnswer: "D",
      options: [
        { id: "A", text: "[M][L]²[T]⁻²" },
        { id: "B", text: "[M][L][T]⁻²" },
        { id: "C", text: "[M][L]⁻¹[T]⁻²" },
        { id: "D", text: "[M][L]²[T]⁻³" }
      ],
      dimension: "[M][L]²[T]⁻³",
      explanation: "[Z] = ([M][L]²[T]⁻²) / [T] = [M][L]²[T]⁻³ (Daya).",
      hint: "Usaha dibagi waktu.",
      misconception: "Z berdimensi Daya.",
      xp: 10,
      bossPoints: 100,
      hpDamage: 15
    },
    {
      id: "db_s03_7",
      stage: 3,
      type: "unknown",
      difficulty: "hard",
      title: "UNKNOWN VARIABLE #7",
      question: "Persamaan K = ½ m v². Tentukan dimensi variabel K!",
      givenEq: "K = ½ m v²",
      correctAnswer: "A",
      options: [
        { id: "A", text: "[M][L]²[T]⁻²" },
        { id: "B", text: "[M][L][T]⁻²" },
        { id: "C", text: "[M][L]²[T]⁻¹" },
        { id: "D", text: "[M][L][T]⁻¹" }
      ],
      dimension: "[M][L]²[T]⁻²",
      explanation: "[K] = [M] × ([L][T]⁻¹)² = [M][L]²[T]⁻² (Energi Kinetik).",
      hint: "Kuadratkan kecepatan lalu kalikan massa.",
      misconception: "K berdimensi Energi.",
      xp: 10,
      bossPoints: 100,
      hpDamage: 15
    },
    {
      id: "db_s03_8",
      stage: 3,
      type: "unknown",
      difficulty: "hard",
      title: "UNKNOWN VARIABLE #8",
      question: "Persamaan k = F / Δx (Hukum Hooke). Tentukan dimensi konstanta pegas k!",
      givenEq: "k = F / Δx",
      correctAnswer: "C",
      options: [
        { id: "A", text: "[M][L][T]⁻²" },
        { id: "B", text: "[M][L]²[T]⁻²" },
        { id: "C", text: "[M][T]⁻²" },
        { id: "D", text: "[M][L]⁻¹[T]⁻²" }
      ],
      dimension: "[M][T]⁻²",
      explanation: "[k] = ([M][L][T]⁻²) / [L] = [M][T]⁻².",
      hint: "Panjang di pembilang dan penyebut saling meniadakan.",
      misconception: "k berdimensi [M][T]⁻².",
      xp: 10,
      bossPoints: 100,
      hpDamage: 15
    },
    {
      id: "db_s03_9",
      stage: 3,
      type: "unknown",
      difficulty: "hard",
      title: "UNKNOWN VARIABLE #9",
      question: "Persamaan Q = I · t. Tentukan dimensi variabel muatan Q!",
      givenEq: "Q = I · t",
      correctAnswer: "B",
      options: [
        { id: "A", text: "[I]" },
        { id: "B", text: "[I][T]" },
        { id: "C", text: "[I][T]⁻¹" },
        { id: "D", text: "[M][L]²[T]⁻³[I]⁻¹" }
      ],
      dimension: "[I][T]",
      explanation: "[Q] = [I] × [T] = [I][T].",
      hint: "Arus dikali waktu.",
      misconception: "Q berdimensi [I][T].",
      xp: 10,
      bossPoints: 100,
      hpDamage: 15
    },
    {
      id: "db_s03_10",
      stage: 3,
      type: "unknown",
      difficulty: "hard",
      title: "UNKNOWN VARIABLE #10",
      question: "Persamaan V = W / Q. Tentukan dimensi beda potensial V!",
      givenEq: "V = W / Q",
      correctAnswer: "A",
      options: [
        { id: "A", text: "[M][L]²[T]⁻³[I]⁻¹" },
        { id: "B", text: "[M][L]²[T]⁻²" },
        { id: "C", text: "[I][T]" },
        { id: "D", text: "[M][L]²[T]⁻³" }
      ],
      dimension: "[M][L]²[T]⁻³[I]⁻¹",
      explanation: "[V] = ([M][L]²[T]⁻²) / ([I][T]) = [M][L]²[T]⁻³[I]⁻¹.",
      hint: "Bagi energi dengan muatan.",
      misconception: "Tegangan listrik berdimensi [M][L]²[T]⁻³[I]⁻¹.",
      xp: 10,
      bossPoints: 100,
      hpDamage: 15
    },

    // ==========================================
    // BOSS STAGE 04: EQUATION REPAIR (10 Challenges)
    // ==========================================
    {
      id: "db_s04_1",
      stage: 4,
      type: "repair",
      difficulty: "easy",
      title: "EQUATION REPAIR #1",
      question: "PERBAIKI PERSAMAAN: s = v × ?",
      givenEq: "s = v × ?",
      targetDimension: "[L]",
      correctAnswer: "t",
      options: [
        { id: "t", text: "t (waktu)" },
        { id: "t2", text: "t² (waktu kuadrat)" },
        { id: "a", text: "a (percepatan)" },
        { id: "v", text: "v (kecepatan)" }
      ],
      dimension: "[L]",
      explanation: "[s] = [L]. Agar [v] × ? = [L], variabel harus t ([L][T]⁻¹ × [T] = [L]).",
      hint: "Variabel t melengkapi jarak GLB.",
      misconception: "Waktu t berpangkat 1.",
      xp: 10,
      bossPoints: 100,
      hpDamage: 10
    },
    {
      id: "db_s04_2",
      stage: 4,
      type: "repair",
      difficulty: "easy",
      title: "EQUATION REPAIR #2",
      question: "PERBAIKI PERSAMAAN: F = m × ?",
      givenEq: "F = m × ?",
      targetDimension: "[M][L][T]⁻²",
      correctAnswer: "a",
      options: [
        { id: "v", text: "v (kecepatan)" },
        { id: "a", text: "a (percepatan)" },
        { id: "s", text: "s (jarak)" },
        { id: "t", text: "t (waktu)" }
      ],
      dimension: "[M][L][T]⁻²",
      explanation: "[F] = [M][L][T]⁻², [m] = [M]. Variabel pelengkap adalah percepatan a ([L][T]⁻²).",
      hint: "Hukum Newton 2.",
      misconception: "F = m·a.",
      xp: 10,
      bossPoints: 100,
      hpDamage: 10
    },
    {
      id: "db_s04_3",
      stage: 4,
      type: "repair",
      difficulty: "medium",
      title: "EQUATION REPAIR #3",
      question: "PERBAIKI PERSAMAAN: P = W / ?",
      givenEq: "P = W / ?",
      targetDimension: "[M][L]²[T]⁻³",
      correctAnswer: "t",
      options: [
        { id: "t", text: "t (waktu)" },
        { id: "s", text: "s (jarak)" },
        { id: "m", text: "m (massa)" },
        { id: "v", text: "v (kecepatan)" }
      ],
      dimension: "[M][L]²[T]⁻³",
      explanation: "[P] = [M][L]²[T]⁻³, [W] = [M][L]²[T]⁻². Maka penyebut harus t ([T]).",
      hint: "Daya P = Usaha / waktu.",
      misconception: "Daya membagi usaha dengan waktu.",
      xp: 10,
      bossPoints: 100,
      hpDamage: 10
    },
    {
      id: "db_s04_4",
      stage: 4,
      type: "repair",
      difficulty: "medium",
      title: "EQUATION REPAIR #4",
      question: "PERBAIKI PERSAMAAN: p = F / ?",
      givenEq: "p = F / ?",
      targetDimension: "[M][L]⁻¹[T]⁻²",
      correctAnswer: "A",
      options: [
        { id: "A", text: "A (luas permukaan)" },
        { id: "V", text: "V (volume)" },
        { id: "s", text: "s (jarak)" },
        { id: "m", text: "m (massa)" }
      ],
      dimension: "[M][L]⁻¹[T]⁻²",
      explanation: "[p] = [M][L]⁻¹[T]⁻², [F] = [M][L][T]⁻². Penyebut harus A ([L]²).",
      hint: "Tekanan p = Gaya / Luas.",
      misconception: "Penyebutnya adalah luas area.",
      xp: 10,
      bossPoints: 100,
      hpDamage: 10
    },
    {
      id: "db_s04_5",
      stage: 4,
      type: "repair",
      difficulty: "medium",
      title: "EQUATION REPAIR #5",
      question: "PERBAIKI PERSAMAAN: ρ = m / ?",
      givenEq: "ρ = m / ?",
      targetDimension: "[M][L]⁻³",
      correctAnswer: "V",
      options: [
        { id: "A", text: "A (luas)" },
        { id: "V", text: "V (volume)" },
        { id: "s", text: "s (panjang)" },
        { id: "t", text: "t (waktu)" }
      ],
      dimension: "[M][L]⁻³",
      explanation: "[ρ] = [M][L]⁻³, [m] = [M]. Penyebut harus Volume [V] ([L]³).",
      hint: "Massa jenis = Massa / Volume.",
      misconception: "Massa jenis dibagi volume.",
      xp: 10,
      bossPoints: 100,
      hpDamage: 10
    },
    {
      id: "db_s04_6",
      stage: 4,
      type: "repair",
      difficulty: "hard",
      title: "EQUATION REPAIR #6",
      question: "PERBAIKI PERSAMAAN: Ek = ½ m · ?",
      givenEq: "Ek = ½ m · ?",
      targetDimension: "[M][L]²[T]⁻²",
      correctAnswer: "v2",
      options: [
        { id: "v", text: "v (kecepatan)" },
        { id: "v2", text: "v² (kecepatan kuadrat)" },
        { id: "a", text: "a (percepatan)" },
        { id: "s", text: "s (jarak)" }
      ],
      dimension: "[M][L]²[T]⁻²",
      explanation: "[Ek] = [M][L]²[T]⁻², [m] = [M]. Pengali harus v² ([L]²[T]⁻²).",
      hint: "Energi kinetik menggunakan v kuadrat.",
      misconception: "v harus berpangkat dua.",
      xp: 10,
      bossPoints: 100,
      hpDamage: 15
    },
    {
      id: "db_s04_7",
      stage: 4,
      type: "repair",
      difficulty: "hard",
      title: "EQUATION REPAIR #7",
      question: "PERBAIKI PERSAMAAN: Q = I · ?",
      givenEq: "Q = I · ?",
      targetDimension: "[I][T]",
      correctAnswer: "t",
      options: [
        { id: "t", text: "t (waktu)" },
        { id: "V", text: "V (tegangan)" },
        { id: "R", text: "R (hambatan)" },
        { id: "m", text: "m (massa)" }
      ],
      dimension: "[I][T]",
      explanation: "[Q] = [I][T], [I] = [I]. Variabel pengali harus t ([T]).",
      hint: "Muatan Q = Arus × Waktu.",
      misconception: "Q berdimensi [I][T].",
      xp: 10,
      bossPoints: 100,
      hpDamage: 15
    },
    {
      id: "db_s04_8",
      stage: 4,
      type: "repair",
      difficulty: "hard",
      title: "EQUATION REPAIR #8",
      question: "PERBAIKI PERSAMAAN: W = F · ?",
      givenEq: "W = F · ?",
      targetDimension: "[M][L]²[T]⁻²",
      correctAnswer: "s",
      options: [
        { id: "s", text: "s (perpindahan)" },
        { id: "t", text: "t (waktu)" },
        { id: "v", text: "v (kecepatan)" },
        { id: "a", text: "a (percepatan)" }
      ],
      dimension: "[M][L]²[T]⁻²",
      explanation: "[W] = [M][L]²[T]⁻², [F] = [M][L][T]⁻². Pengali harus s ([L]).",
      hint: "Usaha W = Gaya × Jarak.",
      misconception: "W dikali perpindahan s.",
      xp: 10,
      bossPoints: 100,
      hpDamage: 15
    },
    {
      id: "db_s04_9",
      stage: 4,
      type: "repair",
      difficulty: "hard",
      title: "EQUATION REPAIR #9",
      question: "PERBAIKI PERSAMAAN: E = F × ?",
      givenEq: "E = F × ?",
      targetDimension: "[M][L]²[T]⁻²",
      correctAnswer: "s",
      options: [
        { id: "s", text: "s (jarak)" },
        { id: "t", text: "t (waktu)" },
        { id: "v", text: "v (kecepatan)" },
        { id: "a", text: "a (percepatan)" }
      ],
      dimension: "[M][L]²[T]⁻²",
      explanation: "[E] = [M][L]²[T]⁻², [F] = [M][L][T]⁻². Pengali harus s ([L]).",
      hint: "Energi/Usaha = Gaya × Jarak.",
      misconception: "E berdimensi energi [M][L]²[T]⁻².",
      xp: 10,
      bossPoints: 100,
      hpDamage: 15
    },
    {
      id: "db_s04_10",
      stage: 4,
      type: "repair",
      difficulty: "hard",
      title: "EQUATION REPAIR #10",
      question: "PERBAIKI PERSAMAAN: v = a · ?",
      givenEq: "v = a · ?",
      targetDimension: "[L][T]⁻¹",
      correctAnswer: "t",
      options: [
        { id: "t", text: "t (waktu)" },
        { id: "t2", text: "t² (waktu kuadrat)" },
        { id: "s", text: "s (jarak)" },
        { id: "v", text: "v (kecepatan)" }
      ],
      dimension: "[L][T]⁻¹",
      explanation: "[v] = [L][T]⁻¹, [a] = [L][T]⁻². Pengali harus t ([T]).",
      hint: "v = a · t.",
      misconception: "Percepatan dikali waktu menjadi kecepatan.",
      xp: 10,
      bossPoints: 100,
      hpDamage: 15
    },

    // ==========================================
    // BOSS STAGE 05: FINAL DIMENSION CORE (10 Challenges)
    // ==========================================
    {
      id: "db_s05_1",
      stage: 5,
      type: "boss",
      difficulty: "boss",
      title: "FINAL DIMENSION CORE #1",
      question: "ANALISIS EKSPONEN PERSAMAAN: Q = k · m^a · v^b. Jika Q adalah Energi Kinetik, tentukan nilai eksponen a dan b!",
      givenEq: "Q = k · m^a · v^b",
      correctAnswer: "A",
      options: [
        { id: "A", text: "a = 1, b = 2  (Ek = ½ m v²)" },
        { id: "B", text: "a = 1, b = 1  (Momentum p = m v)" },
        { id: "C", text: "a = 2, b = 1" },
        { id: "D", text: "a = 1, b = -1" }
      ],
      dimension: "[M][L]²[T]⁻²",
      explanation: "[Q] = [M][L]²[T]⁻². [m]^a · ([L][T]⁻¹)^b = [M]^a [L]^b [T]^-b. Membandingkan eksponen: a = 1, b = 2.",
      hint: "Bandingkan pangkat [M], [L], dan [T] pada kedua ruas.",
      misconception: "Ek = ½ m v² memiliki eksponen a=1 dan b=2.",
      xp: 15,
      bossPoints: 150,
      hpDamage: 20
    },
    {
      id: "db_s05_2",
      stage: 5,
      type: "boss",
      difficulty: "boss",
      title: "FINAL DIMENSION CORE #2",
      question: "ANALISIS EKSPONEN GAYA SENTRIPETAL: F = k · m^a · v^b · r^c. Tentukan nilai eksponen a, b, c!",
      givenEq: "F = k · m^a · v^b · r^c",
      correctAnswer: "C",
      options: [
        { id: "A", text: "a = 1, b = 1, c = 1" },
        { id: "B", text: "a = 1, b = 2, c = 1" },
        { id: "C", text: "a = 1, b = 2, c = -1  (F = m v² / r)" },
        { id: "D", text: "a = 2, b = 1, c = -1" }
      ],
      dimension: "[M][L][T]⁻²",
      explanation: "[F] = [M][L][T]⁻² = [M]^a · ([L][T]⁻¹)^b · [L]^c = [M]^a [L]^(b+c) [T]^-b. Maka a=1, b=2, b+c=1 -> c=-1.",
      hint: "Sistem persamaan eksponen: a=1, b=2, 2+c=1.",
      misconception: "Faktor r berada di penyebut (r⁻¹).",
      xp: 15,
      bossPoints: 150,
      hpDamage: 20
    },
    {
      id: "db_s05_3",
      stage: 5,
      type: "boss",
      difficulty: "boss",
      title: "FINAL DIMENSION CORE #3",
      question: "ANALISIS MISKONSEPSI UTAMA: Manakah pernyataan yang Paling BENAR tentang analisis dimensi?",
      givenEq: "Prinsip Analisis Dimensi",
      correctAnswer: "B",
      options: [
        { id: "A", text: "Jika dimensi konsisten, persamaan pasti 100% tepat termasuk angka konstanta skalar." },
        { id: "B", text: "Analisis dimensi dapat membuktikan KESALAHAN persamaan, tetapi TIDAK BISA menentukan nilai konstanta tanpa dimensi." },
        { id: "C", text: "Simbol [J] adalah bentuk dimensi dari satuan Joule." },
        { id: "D", text: "Persamaan fisika boleh memiliki suku-suku berdimensi beda jika dijumlahkan." }
      ],
      dimension: "[M][L][T]",
      explanation: "Analisis dimensi membuktikan struktur fisis persamaan, tetapi angka skalar tak berdimensi (seperti ½ atau 2π) tidak dapat ditentukan.",
      hint: "Konstanta skalar tidak memuat kurung siku dimensi.",
      misconception: "Analisis dimensi hanya memverifikasi keterhubungan variabel.",
      xp: 15,
      bossPoints: 150,
      hpDamage: 20
    },
    {
      id: "db_s05_4",
      stage: 5,
      type: "boss",
      difficulty: "boss",
      title: "FINAL DIMENSION CORE #4",
      question: "ANALISIS EKUIVALENSI DIMENSI: Manakah susunan urutan faktor yang EKUIVALEN dengan dimensi Gaya?",
      givenEq: "[M][L][T]⁻²",
      correctAnswer: "D",
      options: [
        { id: "A", text: "[M][L]²[T]⁻²" },
        { id: "B", text: "[M][L]⁻¹[T]⁻²" },
        { id: "C", text: "[M][L][T]⁻¹" },
        { id: "D", text: "[L][M][T]⁻² (Komutatif Perkalian Faktor)" }
      ],
      dimension: "[M][L][T]⁻²",
      explanation: "[L][M][T]⁻² ekuivalen secara matematis dengan [M][L][T]⁻² karena perkalian faktor besaran bersifat komutatif.",
      hint: "Urutan penulisan perkalian dimensi tidak mengubah makna fisis.",
      misconception: "Exponent map normalizer menganggap [L][M][T]⁻² sama dengan [M][L][T]⁻².",
      xp: 15,
      bossPoints: 150,
      hpDamage: 20
    },
    {
      id: "db_s05_5",
      stage: 5,
      type: "boss",
      difficulty: "boss",
      title: "FINAL DIMENSION CORE #5",
      question: "DUA BESARAN DENGAN DIMENSI IDENTIK: Manakah pasangan besaran berikut yang memiliki dimensi PERSIS SAMA?",
      givenEq: "[M][L][T]⁻¹",
      correctAnswer: "A",
      options: [
        { id: "A", text: "Impuls dan Momentum ([M][L][T]⁻¹)" },
        { id: "B", text: "Gaya dan Tekanan" },
        { id: "C", text: "Kecepatan dan Percepatan" },
        { id: "D", text: "Daya dan Energi" }
      ],
      dimension: "[M][L][T]⁻¹",
      explanation: "Impuls (F·Δt) dan Momentum (m·v) keduanya memiliki dimensi [M][L][T]⁻¹.",
      hint: "Cari dua besaran yang memiliki satuan kg·m/s atau N·s.",
      misconception: "Impuls dan momentum berdimensi identik.",
      xp: 15,
      bossPoints: 150,
      hpDamage: 20
    },
    {
      id: "db_s05_6",
      stage: 5,
      type: "boss",
      difficulty: "boss",
      title: "FINAL DIMENSION CORE #6",
      question: "DETEKSI FORMULA ALTERNATIF DAYA: P = F · v. Apakah formula ini KONSISTEN secara dimensional?",
      givenEq: "P = F · v",
      correctAnswer: "A",
      options: [
        { id: "A", text: "KONSISTEN ([P] = [M][L]²[T]⁻³, [F·v] = [M][L][T]⁻² × [L][T]⁻¹ = [M][L]²[T]⁻³)" },
        { id: "B", text: "TIDAK KONSISTEN ([F·v] = [M][L][T]⁻²)" },
        { id: "C", text: "TIDAK KONSISTEN (Daya hanya W/t)" },
        { id: "D", text: "TIDAK KONSISTEN ([F·v] = [M][L]²[T]⁻²)" }
      ],
      dimension: "[M][L]²[T]⁻³",
      explanation: "P = W/t = (F·s)/t = F · (s/t) = F · v. Keduanya berdimensi [M][L]²[T]⁻³. KONSISTEN!",
      hint: "Kecepatan v adalah s/t.",
      misconception: "Daya juga dapat dinyatakan sebagai Gaya dikali Kecepatan.",
      xp: 15,
      bossPoints: 150,
      hpDamage: 20
    },
    {
      id: "db_s05_7",
      stage: 5,
      type: "boss",
      difficulty: "boss",
      title: "FINAL DIMENSION CORE #7",
      question: "DIMENSI KONSTANTA PEGAS: Tentukan dimensi k dari F = k · x!",
      givenEq: "F = k · x",
      correctAnswer: "B",
      options: [
        { id: "A", text: "[M][L][T]⁻²" },
        { id: "B", text: "[M][T]⁻²" },
        { id: "C", text: "[M][L]²[T]⁻²" },
        { id: "D", text: "[M][L]⁻¹[T]⁻²" }
      ],
      dimension: "[M][T]⁻²",
      explanation: "[k] = [F] / [x] = ([M][L][T]⁻²) / [L] = [M][T]⁻².",
      hint: "Panjang [L] di pembilang dan penyebut saling meniadakan.",
      misconception: "k berdimensi [M][T]⁻².",
      xp: 15,
      bossPoints: 150,
      hpDamage: 20
    },
    {
      id: "db_s05_8",
      stage: 5,
      type: "boss",
      difficulty: "boss",
      title: "FINAL DIMENSION CORE #8",
      question: "PERBAIKI PERSAMAAN RUSAK: v² = v₀² + 2 a · ?",
      givenEq: "v² = v₀² + 2 a · ?",
      correctAnswer: "C",
      options: [
        { id: "A", text: "t (waktu)" },
        { id: "B", text: "t² (waktu kuadrat)" },
        { id: "C", text: "s (jarak/perpindahan)" },
        { id: "D", text: "v (kecepatan)" }
      ],
      dimension: "[L]²[T]⁻²",
      explanation: "[v²] = [L]²[T]⁻². [2 a] = [L][T]⁻². Pengali pelengkap harus s ([L]) agar 2 a s berdimensi [L]²[T]⁻².",
      hint: "Persamaan GLBB ketiga.",
      misconception: "2as berdimensi [L]²[T]⁻².",
      xp: 15,
      bossPoints: 150,
      hpDamage: 20
    },
    {
      id: "db_s05_9",
      stage: 5,
      type: "boss",
      difficulty: "boss",
      title: "FINAL DIMENSION CORE #9",
      question: "UJI PERSAMAAN GELOMBANG: v = λ · f (di mana λ adalah panjang gelombang [L] dan f adalah frekuensi [T]⁻¹). Apakah KONSISTEN?",
      givenEq: "v = λ · f",
      correctAnswer: "A",
      options: [
        { id: "A", text: "KONSISTEN ([v] = [L][T]⁻¹, [λ·f] = [L] × [T]⁻¹ = [L][T]⁻¹)" },
        { id: "B", text: "TIDAK KONSISTEN ([λ·f] = [L][T])" },
        { id: "C", text: "TIDAK KONSISTEN ([λ·f] = [L]²[T]⁻¹)" },
        { id: "D", text: "TIDAK KONSISTEN ([λ·f] = [T]⁻¹)" }
      ],
      dimension: "[L][T]⁻¹",
      explanation: "[λ] = [L], [f] = [T]⁻¹. Maka [λ·f] = [L][T]⁻¹, sama dengan dimensi kecepatan [v]. KONSISTEN!",
      hint: "Cepat rambat gelombang = Panjang gelombang × Frekuensi.",
      misconception: "Persamaan gelombang v = λf sah secara dimensional.",
      xp: 15,
      bossPoints: 150,
      hpDamage: 20
    },
    {
      id: "db_s05_10",
      stage: 5,
      type: "boss",
      difficulty: "boss",
      title: "FINAL DIMENSION CORE #10",
      question: "KEPUTUSAN PENUTUP KRISIS DIMENSI: Manakah 3 Besaran Pokok Utama yang Membentuk Dimensi Energi [M][L]²[T]⁻²?",
      givenEq: "[M][L]²[T]⁻²",
      correctAnswer: "C",
      options: [
        { id: "A", text: "Massa, Arus, Waktu" },
        { id: "B", text: "Panjang, Waktu, Suhu" },
        { id: "C", text: "Massa, Panjang, Waktu" },
        { id: "D", text: "Massa, Panjang, Jumlah Zat" }
      ],
      dimension: "[M][L]²[T]⁻²",
      explanation: "Massa [M], Panjang [L], dan Waktu [T] adalah 3 besaran pokok dasar pembentuk Energi.",
      hint: "Lihat simbol [M], [L], dan [T].",
      misconception: "Massa, Panjang, Waktu membentuk dimensi energi fisik.",
      xp: 20,
      bossPoints: 200,
      hpDamage: 20
    }
  ];

  /**
   * Data Integrity Validator Function
   * Ensures all 50 challenges possess required structured fields.
   */
  function validateDimensionBossData() {
    const errors = [];
    const ids = new Set();

    if (!Array.isArray(DIMENSION_BOSS_DATA) || DIMENSION_BOSS_DATA.length < 50) {
      errors.push(`Total challenges count is ${DIMENSION_BOSS_DATA.length}, expected 50.`);
    }

    DIMENSION_BOSS_DATA.forEach((ch, idx) => {
      if (!ch.id) errors.push(`Challenge #${idx + 1} missing id.`);
      else if (ids.has(ch.id)) errors.push(`Duplicate ID found: ${ch.id}`);
      else ids.add(ch.id);

      if (!ch.stage || ch.stage < 1 || ch.stage > 5) errors.push(`Challenge ${ch.id} invalid stage: ${ch.stage}`);
      if (!ch.question) errors.push(`Challenge ${ch.id} missing question.`);
      if (!ch.correctAnswer) errors.push(`Challenge ${ch.id} missing correctAnswer.`);
      if (!ch.explanation) errors.push(`Challenge ${ch.id} missing explanation.`);
      if (!ch.hint) errors.push(`Challenge ${ch.id} missing hint.`);
      if (!ch.misconception) errors.push(`Challenge ${ch.id} missing misconception.`);
    });

    if (errors.length > 0) {
      console.warn("Dimension Boss Data Validation Errors:", errors);
      return false;
    }
    return true;
  }

  /**
   * Session Selector for Level 05: Dimension Boss
   * Selects 10 challenges (2 from each of the 5 Boss Stages)
   * Guaranteed balanced representation without duplicates within a session.
   */
  function getSoloSessionChallenges(count) {
    count = count || 10;
    const shuffle = arr => [...arr].sort(() => 0.5 - Math.random());

    const s1 = shuffle(DIMENSION_BOSS_DATA.filter(c => c.stage === 1));
    const s2 = shuffle(DIMENSION_BOSS_DATA.filter(c => c.stage === 2));
    const s3 = shuffle(DIMENSION_BOSS_DATA.filter(c => c.stage === 3));
    const s4 = shuffle(DIMENSION_BOSS_DATA.filter(c => c.stage === 4));
    const s5 = shuffle(DIMENSION_BOSS_DATA.filter(c => c.stage === 5));

    const session = [
      ...s1.slice(0, 2),
      ...s2.slice(0, 2),
      ...s3.slice(0, 2),
      ...s4.slice(0, 2),
      ...s5.slice(0, 2)
    ];

    return shuffle(session);
  }

  // Run validation on load
  validateDimensionBossData();

  return {
    getAllChallenges: function() { return DIMENSION_BOSS_DATA; },
    getSoloSessionChallenges: getSoloSessionChallenges,
    validateData: validateDimensionBossData
  };

})();
