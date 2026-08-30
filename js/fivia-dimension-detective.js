/**
 * FIVIA PHYSICS QUEST - LEVEL 04: DIMENSION DETECTIVE (PHASE 3D)
 * Theme: "The Formula Mystery"
 * 40 Scientifically Validated Physics Investigation Challenges across 5 Missions
 */

window.FIVIAQuestDimensionDetective = (function() {
  'use strict';

  // 40 Scientifically Validated Investigation Challenges
  const DIMENSION_DETECTIVE_DATA = [
    // ==========================================
    // MISSION 01: DIMENSION INVESTIGATION (8 Challenges)
    // ==========================================
    {
      id: "dd_m01_1",
      mission: 1,
      type: "investigation",
      difficulty: "easy",
      question: "KASUS #1: Diketahui persamaan v = s / t. Berapakah dimensi dari variabel v?",
      givenEq: "v = s / t",
      quantity: "Kecepatan (v)",
      correctAnswer: "C",
      options: [
        { id: "A", text: "[L]" },
        { id: "B", text: "[T]" },
        { id: "C", text: "[L][T]⁻¹" },
        { id: "D", text: "[M][L][T]⁻²" }
      ],
      explanation: "[s] = [L], [t] = [T]. Maka [v] = [L] / [T] = [L][T]⁻¹.",
      misconception: "[L][T]⁻² adalah dimensi percepatan, bukan kecepatan."
    },
    {
      id: "dd_m01_2",
      mission: 1,
      type: "investigation",
      difficulty: "easy",
      question: "KASUS #2: Diketahui Hukum Newton F = m · a. Tentukan dimensi dari Gaya (F).",
      givenEq: "F = m · a",
      quantity: "Gaya (F)",
      correctAnswer: "D",
      options: [
        { id: "A", text: "[M][L]²[T]⁻²" },
        { id: "B", text: "[M][L][T]⁻¹" },
        { id: "C", text: "[M][L]⁻¹[T]⁻²" },
        { id: "D", text: "[M][L][T]⁻²" }
      ],
      explanation: "[m] = [M], [a] = [L][T]⁻². Maka [F] = [M] × [L][T]⁻² = [M][L][T]⁻².",
      misconception: "Newton (N) adalah nama satuan, sedangkan [M][L][T]⁻² adalah dimensinya."
    },
    {
      id: "dd_m01_3",
      mission: 1,
      type: "investigation",
      difficulty: "easy",
      question: "KASUS #3: Diketahui rumus massa jenis ρ = m / V. Tentukan dimensi dari ρ.",
      givenEq: "ρ = m / V",
      quantity: "Massa Jenis (ρ)",
      correctAnswer: "A",
      options: [
        { id: "A", text: "[M][L]⁻³" },
        { id: "B", text: "[M][L]³" },
        { id: "C", text: "[M][L][T]⁻¹" },
        { id: "D", text: "[M][L]⁻¹[T]⁻²" }
      ],
      explanation: "[m] = [M], Volume [V] = [L]³. Maka [ρ] = [M] / [L]³ = [M][L]⁻³.",
      misconception: "Volume berada di penyebut, sehingga pangkat [L] menjadi -3."
    },
    {
      id: "dd_m01_4",
      mission: 1,
      type: "investigation",
      difficulty: "medium",
      question: "KASUS #4: Diketahui Usaha W = F · s. Tentukan dimensi dari Usaha (W).",
      givenEq: "W = F · s",
      quantity: "Usaha (W)",
      correctAnswer: "B",
      options: [
        { id: "A", text: "[M][L][T]⁻²" },
        { id: "B", text: "[M][L]²[T]⁻²" },
        { id: "C", text: "[M][L]²[T]⁻³" },
        { id: "D", text: "[M][L]⁻¹[T]⁻²" }
      ],
      explanation: "[F] = [M][L][T]⁻², [s] = [L]. Maka [W] = ([M][L][T]⁻²) × [L] = [M][L]²[T]⁻².",
      misconception: "Perkalian dengan perpindahan (s) menambah pangkat [L] menjadi 2."
    },
    {
      id: "dd_m01_5",
      mission: 1,
      type: "investigation",
      difficulty: "medium",
      question: "KASUS #5: Diketahui Daya P = W / t. Tentukan dimensi dari Daya (P).",
      givenEq: "P = W / t",
      quantity: "Daya (P)",
      correctAnswer: "C",
      options: [
        { id: "A", text: "[M][L]²[T]⁻²" },
        { id: "B", text: "[M][L][T]⁻²" },
        { id: "C", text: "[M][L]²[T]⁻³" },
        { id: "D", text: "[M][L]⁻¹[T]⁻²" }
      ],
      explanation: "[W] = [M][L]²[T]⁻², [t] = [T]. Maka [P] = ([M][L]²[T]⁻²) / [T] = [M][L]²[T]⁻³.",
      misconception: "Daya membagi usaha dengan waktu, sehingga pangkat [T] menjadi -3."
    },
    {
      id: "dd_m01_6",
      mission: 1,
      type: "investigation",
      difficulty: "medium",
      question: "KASUS #6: Diketahui Tekanan p = F / A. Tentukan dimensi dari Tekanan (p).",
      givenEq: "p = F / A",
      quantity: "Tekanan (p)",
      correctAnswer: "A",
      options: [
        { id: "A", text: "[M][L]⁻¹[T]⁻²" },
        { id: "B", text: "[M][L]²[T]⁻²" },
        { id: "C", text: "[M][L]⁻³" },
        { id: "D", text: "[M][L][T]⁻²" }
      ],
      explanation: "[F] = [M][L][T]⁻², Luas [A] = [L]². Maka [p] = ([M][L][T]⁻²) / [L]² = [M][L]⁻¹[T]⁻².",
      misconception: "[L] dibagi [L]² menghasilkan [L]⁻¹."
    },
    {
      id: "dd_m01_7",
      mission: 1,
      type: "investigation",
      difficulty: "hard",
      question: "KASUS #7: Diketahui Momentum p = m · v. Tentukan dimensi dari Momentum (p).",
      givenEq: "p = m · v",
      quantity: "Momentum (p)",
      correctAnswer: "D",
      options: [
        { id: "A", text: "[M][L][T]⁻²" },
        { id: "B", text: "[M][L]²[T]⁻¹" },
        { id: "C", text: "[L][T]⁻¹" },
        { id: "D", text: "[M][L][T]⁻¹" }
      ],
      explanation: "[m] = [M], [v] = [L][T]⁻¹. Maka [p] = [M] × [L][T]⁻¹ = [M][L][T]⁻¹.",
      misconception: "Momentum memiliki dimensi yang identik dengan Impuls."
    },
    {
      id: "dd_m01_8",
      mission: 1,
      type: "investigation",
      difficulty: "hard",
      question: "KASUS #8: Manakah simbol dimensi SI untuk INTENSITAS CAHAYA?",
      givenEq: "I_v (Candela)",
      quantity: "Intensitas Cahaya",
      correctAnswer: "B",
      options: [
        { id: "A", text: "[I]" },
        { id: "B", text: "[J]" },
        { id: "C", text: "Joule" },
        { id: "D", text: "cd" }
      ],
      explanation: "[J] adalah simbol dimensi SI untuk Intensitas Cahaya (cd).",
      misconception: "[J] dengan kurung siku adalah dimensi intensitas cahaya, sedangkan J tanpa kurung siku adalah satuan Joule."
    },

    // ==========================================
    // MISSION 02: UNKNOWN DIMENSION (8 Challenges)
    // ==========================================
    {
      id: "dd_m02_1",
      mission: 2,
      type: "unknown",
      difficulty: "easy",
      question: "VARIABEL MISTERIUS #1: Persamaan A = B · C. Jika [B] = [M] dan [C] = [L][T]⁻², tentukan dimensi A!",
      givenEq: "A = B · C",
      correctAnswer: "A",
      options: [
        { id: "A", text: "[M][L][T]⁻²" },
        { id: "B", text: "[M][L]²[T]⁻²" },
        { id: "C", text: "[M][L][T]⁻¹" },
        { id: "D", text: "[L][T]⁻²" }
      ],
      explanation: "[A] = [B] × [C] = [M] × [L][T]⁻² = [M][L][T]⁻² (Dimensi Gaya).",
      misconception: "Variabel A memiliki dimensi gaya."
    },
    {
      id: "dd_m02_2",
      mission: 2,
      type: "unknown",
      difficulty: "easy",
      question: "VARIABEL MISTERIUS #2: Persamaan X = F / A. Jika [F] = [M][L][T]⁻² dan [A] = [L]², tentukan dimensi X!",
      givenEq: "X = F / A",
      correctAnswer: "C",
      options: [
        { id: "A", text: "[M][L]²[T]⁻²" },
        { id: "B", text: "[M][L]⁻³" },
        { id: "C", text: "[M][L]⁻¹[T]⁻²" },
        { id: "D", text: "[M][L][T]⁻²" }
      ],
      explanation: "[X] = ([M][L][T]⁻²) / [L]² = [M][L]⁻¹[T]⁻² (Dimensi Tekanan).",
      misconception: "X adalah variabel tekanan."
    },
    {
      id: "dd_m02_3",
      mission: 2,
      type: "unknown",
      difficulty: "medium",
      question: "VARIABEL MISTERIUS #3: Persamaan Y = m · g · h. Tentukan dimensi variabel Y!",
      givenEq: "Y = m · g · h",
      correctAnswer: "B",
      options: [
        { id: "A", text: "[M][L][T]⁻²" },
        { id: "B", text: "[M][L]²[T]⁻²" },
        { id: "C", text: "[M][L]²[T]⁻³" },
        { id: "D", text: "[M][L]⁻¹[T]⁻²" }
      ],
      explanation: "[m] = [M], [g] = [L][T]⁻², [h] = [L]. Maka [Y] = [M] × [L][T]⁻² × [L] = [M][L]²[T]⁻² (Energi Potensial).",
      misconception: "Y adalah dimensi Energi Potensial."
    },
    {
      id: "dd_m02_4",
      mission: 2,
      type: "unknown",
      difficulty: "medium",
      question: "VARIABEL MISTERIUS #4: Persamaan Z = W / t. Tentukan dimensi variabel Z!",
      givenEq: "Z = W / t",
      correctAnswer: "D",
      options: [
        { id: "A", text: "[M][L]²[T]⁻²" },
        { id: "B", text: "[M][L][T]⁻²" },
        { id: "C", text: "[M][L]⁻¹[T]⁻²" },
        { id: "D", text: "[M][L]²[T]⁻³" }
      ],
      explanation: "[W] = [M][L]²[T]⁻², [t] = [T]. Maka [Z] = ([M][L]²[T]⁻²) / [T] = [M][L]²[T]⁻³ (Daya).",
      misconception: "Z adalah variabel Daya."
    },
    {
      id: "dd_m02_5",
      mission: 2,
      type: "unknown",
      difficulty: "medium",
      question: "VARIABEL MISTERIUS #5: Persamaan K = ½ m v². Tentukan dimensi variabel K!",
      givenEq: "K = ½ m v²",
      correctAnswer: "A",
      options: [
        { id: "A", text: "[M][L]²[T]⁻²" },
        { id: "B", text: "[M][L][T]⁻²" },
        { id: "C", text: "[M][L]²[T]⁻¹" },
        { id: "D", text: "[M][L][T]⁻¹" }
      ],
      explanation: "Konstanta ½ tak berdimensi. [m] = [M], [v]² = ([L][T]⁻¹)² = [L]²[T]⁻². Maka [K] = [M][L]²[T]⁻².",
      misconception: "Angka ½ tidak memengaruhi bentuk dimensi."
    },
    {
      id: "se_m02_6_dd",
      mission: 2,
      type: "unknown",
      difficulty: "hard",
      question: "VARIABEL MISTERIUS #6: Persamaan k = F / Δx (Hukum Hooke). Tentukan dimensi konstanta pegas k!",
      givenEq: "k = F / Δx",
      correctAnswer: "C",
      options: [
        { id: "A", text: "[M][L][T]⁻²" },
        { id: "B", text: "[M][L]²[T]⁻²" },
        { id: "C", text: "[M][T]⁻²" },
        { id: "D", text: "[M][L]⁻¹[T]⁻²" }
      ],
      explanation: "[F] = [M][L][T]⁻², [Δx] = [L]. Maka [k] = ([M][L][T]⁻²) / [L] = [M][T]⁻².",
      misconception: "Faktor panjang [L] di pembilang dan penyebut saling meniadakan."
    },
    {
      id: "dd_m02_7",
      mission: 2,
      type: "unknown",
      difficulty: "hard",
      question: "VARIABEL MISTERIUS #7: Persamaan Q = I · t. Tentukan dimensi variabel muatan Q!",
      givenEq: "Q = I · t",
      correctAnswer: "B",
      options: [
        { id: "A", text: "[I]" },
        { id: "B", text: "[I][T]" },
        { id: "C", text: "[I][T]⁻¹" },
        { id: "D", text: "[M][L]²[T]⁻³[I]⁻¹" }
      ],
      explanation: "[I] = [I], [t] = [T]. Maka [Q] = [I][T].",
      misconception: "Coulomb (C) berdimensi [I][T]."
    },
    {
      id: "dd_m02_8",
      mission: 2,
      type: "unknown",
      difficulty: "hard",
      question: "VARIABEL MISTERIUS #8: Persamaan V = W / Q. Tentukan dimensi beda potensial V!",
      givenEq: "V = W / Q",
      correctAnswer: "A",
      options: [
        { id: "A", text: "[M][L]²[T]⁻³[I]⁻¹" },
        { id: "B", text: "[M][L]²[T]⁻²" },
        { id: "C", text: "[I][T]" },
        { id: "D", text: "[M][L]²[T]⁻³" }
      ],
      explanation: "[W] = [M][L]²[T]⁻², [Q] = [I][T]. Maka [V] = ([M][L]²[T]⁻²) / ([I][T]) = [M][L]²[T]⁻³[I]⁻¹.",
      misconception: "Beda potensial listrik adalah energi per unit muatan."
    },

    // ==========================================
    // MISSION 03: FORMULA DETECTOR (8 Challenges)
    // ==========================================
    {
      id: "dd_m03_1",
      mission: 3,
      type: "detector",
      difficulty: "easy",
      question: "DETEKSI FORMULA #1: Apakah rumus jarak GLBB s = v · t valid secara dimensional?",
      givenEq: "s = v · t",
      leftExpr: "[s] = [L]",
      rightExpr: "[v · t] = [L][T]⁻¹ × [T] = [L]",
      isValid: true,
      explanation: "Sisi kiri [L] SAMA dengan sisi kanan [L]. Formula VALID secara dimensional!",
      misconception: "s = v·t adalah persamaan gerak lurus yang sah."
    },
    {
      id: "dd_m03_2",
      mission: 3,
      type: "detector",
      difficulty: "easy",
      question: "DETEKSI FORMULA #2: Apakah rumus s = v · t² valid secara dimensional?",
      givenEq: "s = v · t²",
      leftExpr: "[s] = [L]",
      rightExpr: "[v · t²] = [L][T]⁻¹ × [T]² = [L][T]",
      isValid: false,
      explanation: "Sisi kiri [L] TIDAK SAMA dengan sisi kanan [L][T]. Formula TIDAK VALID!",
      misconception: "[L] ≠ [L][T]. Rumus yang benar adalah s = v·t atau s = ½ a·t²."
    },
    {
      id: "dd_m03_3",
      mission: 3,
      type: "detector",
      difficulty: "medium",
      question: "DETEKSI FORMULA #3: Apakah rumus energi kinetik Ek = ½ m v² valid secara dimensional?",
      givenEq: "Ek = ½ m v²",
      leftExpr: "[Ek] = [M][L]²[T]⁻²",
      rightExpr: "[½ m v²] = [M] × ([L][T]⁻¹)² = [M][L]²[T]⁻²",
      isValid: true,
      explanation: "Sisi kiri dan kanan berdimensi [M][L]²[T]⁻². Formula VALID!",
      misconception: "Angka konstanta ½ tidak memengaruhi validitas dimensi."
    },
    {
      id: "dd_m03_4",
      mission: 3,
      type: "detector",
      difficulty: "medium",
      question: "DETEKSI FORMULA #4: Apakah rumus gaya F = m · v valid secara dimensional?",
      givenEq: "F = m · v",
      leftExpr: "[F] = [M][L][T]⁻²",
      rightExpr: "[m · v] = [M] × [L][T]⁻¹ = [M][L][T]⁻¹",
      isValid: false,
      explanation: "Gaya berdimensi [M][L][T]⁻², sedangkan m·v berdimensi [M][L][T]⁻¹ (momentum). Formula TIDAK VALID!",
      misconception: "Rumus gaya yang benar adalah F = m·a."
    },
    {
      id: "dd_m03_5",
      mission: 3,
      type: "detector",
      difficulty: "medium",
      question: "DETEKSI FORMULA #5: Apakah rumus kecepatan GLBB v = a · t valid secara dimensional?",
      givenEq: "v = a · t",
      leftExpr: "[v] = [L][T]⁻¹",
      rightExpr: "[a · t] = [L][T]⁻² × [T] = [L][T]⁻¹",
      isValid: true,
      explanation: "Sisi kiri [L][T]⁻¹ SAMA dengan sisi kanan [L][T]⁻¹. Formula VALID!",
      misconception: "v = a·t sah secara dimensional."
    },
    {
      id: "dd_m03_6",
      mission: 3,
      type: "detector",
      difficulty: "hard",
      question: "DETEKSI FORMULA #6: Apakah rumus tekanan p = F / A valid secara dimensional?",
      givenEq: "p = F / A",
      leftExpr: "[p] = [M][L]⁻¹[T]⁻²",
      rightExpr: "[F / A] = ([M][L][T]⁻²) / [L]² = [M][L]⁻¹[T]⁻²",
      isValid: true,
      explanation: "Sisi kiri dan kanan berdimensi [M][L]⁻¹[T]⁻². Formula VALID!",
      misconception: "Tekanan adalah Gaya dibagi Luas."
    },
    {
      id: "dd_m03_7",
      mission: 3,
      type: "detector",
      difficulty: "hard",
      question: "DETEKSI FORMULA #7: Apakah rumus usaha W = F / s valid secara dimensional?",
      givenEq: "W = F / s",
      leftExpr: "[W] = [M][L]²[T]⁻²",
      rightExpr: "[F / s] = ([M][L][T]⁻²) / [L] = [M][T]⁻²",
      isValid: false,
      explanation: "Usaha W = F × s (perkalian, bukan pembagian). Formula TIDAK VALID!",
      misconception: "Usaha adalah perkalian gaya dengan perpindahan."
    },
    {
      id: "dd_m03_8",
      mission: 3,
      type: "detector",
      difficulty: "hard",
      question: "DETEKSI FORMULA #8: Apakah rumus frekuensi f = 1 / T valid secara dimensional?",
      givenEq: "f = 1 / T",
      leftExpr: "[f] = [T]⁻¹",
      rightExpr: "[1 / T] = 1 / [T] = [T]⁻¹",
      isValid: true,
      explanation: "Sisi kiri dan kanan berdimensi [T]⁻¹. Formula VALID!",
      misconception: "Frekuensi adalah kebalikan dari periode waktu."
    },

    // ==========================================
    // MISSION 04: EQUATION REPAIR (8 Challenges)
    // ==========================================
    {
      id: "dd_m04_1",
      mission: 4,
      type: "repair",
      difficulty: "easy",
      question: "PERBAIKI FORMULA: s = v × ?",
      givenEq: "s = v × ?",
      targetDimension: "[L]",
      correctAnswer: "t",
      options: [
        { id: "t", text: "t (waktu)" },
        { id: "t2", text: "t² (waktu kuadrat)" },
        { id: "a", text: "a (percepatan)" },
        { id: "v", text: "v (kecepatan)" }
      ],
      explanation: "[s] = [L]. Agar v × ? berdimensi [L], variabel misterius haruslah t ([L][T]⁻¹ × [T] = [L]).",
      misconception: "Variabel t melengkapi formula perpindahan GLB."
    },
    {
      id: "dd_m04_2",
      mission: 4,
      type: "repair",
      difficulty: "easy",
      question: "PERBAIKI FORMULA: F = m × ?",
      givenEq: "F = m × ?",
      targetDimension: "[M][L][T]⁻²",
      correctAnswer: "a",
      options: [
        { id: "v", text: "v (kecepatan)" },
        { id: "a", text: "a (percepatan)" },
        { id: "s", text: "s (jarak)" },
        { id: "t", text: "t (waktu)" }
      ],
      explanation: "[F] = [M][L][T]⁻². [m] = [M]. Maka variabel misterius harus a ([L][T]⁻²).",
      misconception: "Hukum Newton 2 F = m·a."
    },
    {
      id: "dd_m04_3",
      mission: 4,
      type: "repair",
      difficulty: "medium",
      question: "PERBAIKI FORMULA: P = W / ?",
      givenEq: "P = W / ?",
      targetDimension: "[M][L]²[T]⁻³",
      correctAnswer: "t",
      options: [
        { id: "t", text: "t (waktu)" },
        { id: "s", text: "s (jarak)" },
        { id: "m", text: "m (massa)" },
        { id: "v", text: "v (kecepatan)" }
      ],
      explanation: "[P] = [M][L]²[T]⁻³. [W] = [M][L]²[T]⁻². Maka penyebut harus t ([T]).",
      misconception: "Daya P = Usaha / waktu."
    },
    {
      id: "dd_m04_4",
      mission: 4,
      type: "repair",
      difficulty: "medium",
      question: "PERBAIKI FORMULA: p = F / ?",
      givenEq: "p = F / ?",
      targetDimension: "[M][L]⁻¹[T]⁻²",
      correctAnswer: "A",
      options: [
        { id: "A", text: "A (luas permukaan)" },
        { id: "V", text: "V (volume)" },
        { id: "s", text: "s (jarak)" },
        { id: "m", text: "m (massa)" }
      ],
      explanation: "[p] = [M][L]⁻¹[T]⁻². [F] = [M][L][T]⁻². Maka penyebut harus A ([L]²).",
      misconception: "Tekanan p = Gaya / Luas."
    },
    {
      id: "dd_m04_5",
      mission: 4,
      type: "repair",
      difficulty: "medium",
      question: "PERBAIKI FORMULA: ρ = m / ?",
      givenEq: "ρ = m / ?",
      targetDimension: "[M][L]⁻³",
      correctAnswer: "V",
      options: [
        { id: "A", text: "A (luas)" },
        { id: "V", text: "V (volume)" },
        { id: "s", text: "s (panjang)" },
        { id: "t", text: "t (waktu)" }
      ],
      explanation: "[ρ] = [M][L]⁻³. [m] = [M]. Maka penyebut harus Volume [V] ([L]³).",
      misconception: "Massa jenis = Massa / Volume."
    },
    {
      id: "dd_m04_6",
      mission: 4,
      type: "repair",
      difficulty: "hard",
      question: "PERBAIKI FORMULA: Ek = ½ m · ?",
      givenEq: "Ek = ½ m · ?",
      targetDimension: "[M][L]²[T]⁻²",
      correctAnswer: "v2",
      options: [
        { id: "v", text: "v (kecepatan)" },
        { id: "v2", text: "v² (kecepatan kuadrat)" },
        { id: "a", text: "a (percepatan)" },
        { id: "s", text: "s (jarak)" }
      ],
      explanation: "[Ek] = [M][L]²[T]⁻². [m] = [M]. Maka pengali harus v² ([L]²[T]⁻²).",
      misconception: "Energi kinetik menggunakan v kuadrat."
    },
    {
      id: "dd_m04_7",
      mission: 4,
      type: "repair",
      difficulty: "hard",
      question: "PERBAIKI FORMULA: Q = I · ?",
      givenEq: "Q = I · ?",
      targetDimension: "[I][T]",
      correctAnswer: "t",
      options: [
        { id: "t", text: "t (waktu)" },
        { id: "V", text: "V (tegangan)" },
        { id: "R", text: "R (hambatan)" },
        { id: "m", text: "m (massa)" }
      ],
      explanation: "[Q] = [I][T]. [I] = [I]. Maka variabel pengali harus t ([T]).",
      misconception: "Muatan Q = Kuat Arus × Waktu."
    },
    {
      id: "dd_m04_8",
      mission: 4,
      type: "repair",
      difficulty: "hard",
      question: "PERBAIKI FORMULA: W = F · ?",
      givenEq: "W = F · ?",
      targetDimension: "[M][L]²[T]⁻²",
      correctAnswer: "s",
      options: [
        { id: "s", text: "s (perpindahan)" },
        { id: "t", text: "t (waktu)" },
        { id: "v", text: "v (kecepatan)" },
        { id: "a", text: "a (percepatan)" }
      ],
      explanation: "[W] = [M][L]²[T]⁻². [F] = [M][L][T]⁻². Maka variabel pengali harus s ([L]).",
      misconception: "Usaha W = Gaya × Perpindahan."
    },

    // ==========================================
    // MISSION 05: DIMENSION DETECTIVE BOSS (8 Challenges)
    // ==========================================
    {
      id: "dd_m05_1",
      mission: 5,
      type: "boss",
      difficulty: "hard",
      question: "CASE FILE #1: Manakah di antara formula fisika berikut yang VALID secara dimensional?",
      correctAnswer: "A",
      options: [
        { id: "A", text: "s = v₀·t + ½ a·t²" },
        { id: "B", text: "s = v₀·t + a·t" },
        { id: "C", text: "v = a·t²" },
        { id: "D", text: "F = m·v" }
      ],
      explanation: "s = v₀·t + ½ a·t²: [v₀·t] = [L], [½ a·t²] = [L]. Kedua suku berdimensi [L], sama dengan [s]. VALID!",
      misconception: "Semua suku yang dijumlahkan harus berdimensi sama."
    },
    {
      id: "dd_m05_2",
      mission: 5,
      type: "boss",
      difficulty: "hard",
      question: "CASE FILE #2: Persamaan v² = v₀² + 2 a s. Tentukan dimensi dari suku 2 a s!",
      correctAnswer: "C",
      options: [
        { id: "A", text: "[L][T]⁻¹" },
        { id: "B", text: "[L][T]⁻²" },
        { id: "C", text: "[L]²[T]⁻²" },
        { id: "D", text: "[M][L]²[T]⁻²" }
      ],
      explanation: "2 a s = 2 × [L][T]⁻² × [L] = [L]²[T]⁻² (sama dengan dimensi v² = ([L][T]⁻¹)² = [L]²[T]⁻²).",
      misconception: "Dimensi v² dan 2as persis sama."
    },
    {
      id: "dd_m05_3",
      mission: 5,
      type: "boss",
      difficulty: "hard",
      question: "CASE FILE #3: Manakah analisis miskonsepsi yang TEPAT mengenai urutan faktor dimensi?",
      correctAnswer: "B",
      options: [
        { id: "A", text: "[L][M][T]⁻² berbeda dengan [M][L][T]⁻²" },
        { id: "B", text: "[L][M][T]⁻² EKUIVALEN dengan [M][L][T]⁻² karena sifat komutatif perkalian faktor." },
        { id: "C", text: "[J] adalah simbol satuan Joule." },
        { id: "D", text: "Newton adalah bentuk dimensi Gaya." }
      ],
      explanation: "Urutan perkalian faktor dimensi tidak mengubah makna fisisnya ([L][M][T]⁻² ≡ [M][L][T]⁻²).",
      misconception: "Exponent Map normalization menyamakan faktor berurutan beda."
    },
    {
      id: "dd_m05_4",
      mission: 5,
      type: "boss",
      difficulty: "hard",
      question: "CASE FILE #4: Suatu benda jatuh bebas memiliki kecepatan v = √(2 g h). Periksa konsistensi dimensinya!",
      correctAnswer: "A",
      options: [
        { id: "A", text: "KONSISTEN (Kiri = [L][T]⁻¹, Kanan = √([L]²[T]⁻²) = [L][T]⁻¹)" },
        { id: "B", text: "TIDAK KONSISTEN (Kanan = [L]²[T]⁻²)" },
        { id: "C", text: "TIDAK KONSISTEN (Karena ada akar kuadrat)" },
        { id: "D", text: "TIDAK KONSISTEN (Kanan = [L][T]⁻²)" }
      ],
      explanation: "2gh -> [L][T]⁻² × [L] = [L]²[T]⁻². Diakarkan menjadi [L][T]⁻¹. VALID!",
      misconception: "Akar kuadrat mengakar pula pangkat dimensi."
    },
    {
      id: "dd_m05_5",
      mission: 5,
      type: "boss",
      difficulty: "hard",
      question: "CASE FILE #5: Dua besaran Manakah yang Memiliki Dimensi Identik?",
      correctAnswer: "D",
      options: [
        { id: "A", text: "Gaya dan Tekanan" },
        { id: "B", text: "Kecepatan dan Percepatan" },
        { id: "C", text: "Daya dan Energi" },
        { id: "D", text: "Impuls dan Momentum ([M][L][T]⁻¹)" }
      ],
      explanation: "Impuls (F·Δt) dan Momentum (m·v) keduanya memiliki dimensi [M][L][T]⁻¹.",
      misconception: "Impuls dan momentum adalah dua besaran berdimensi serupa."
    },
    {
      id: "dd_m05_6",
      mission: 5,
      type: "boss",
      difficulty: "hard",
      question: "CASE FILE #6: Deteksi kesalahan formula: P = F · v. Apakah formula ini valid secara dimensional?",
      correctAnswer: "A",
      options: [
        { id: "A", text: "VALID ([P] = [M][L]²[T]⁻³, [F·v] = [M][L][T]⁻² × [L][T]⁻¹ = [M][L]²[T]⁻³)" },
        { id: "B", text: "TIDAK VALID ([F·v] = [M][L][T]⁻²)" },
        { id: "C", text: "TIDAK VALID (Daya hanya W/t)" },
        { id: "D", text: "TIDAK VALID ([F·v] = [M][L]²[T]⁻²)" }
      ],
      explanation: "P = F·v adalah alternatif rumus Daya (karena W/t = (F·s)/t = F·v). VALID!",
      misconception: "Daya juga dapat dinyatakan sebagai Gaya dikalikan Kecepatan."
    },
    {
      id: "dd_m05_7",
      mission: 5,
      type: "boss",
      difficulty: "hard",
      question: "CASE FILE #7: Apakah dimensi dari konstanta pegas k dalam F = k · x?",
      correctAnswer: "B",
      options: [
        { id: "A", text: "[M][L][T]⁻²" },
        { id: "B", text: "[M][T]⁻²" },
        { id: "C", text: "[M][L]²[T]⁻²" },
        { id: "D", text: "[M][L]⁻¹[T]⁻²" }
      ],
      explanation: "k = F/x -> ([M][L][T]⁻²)/[L] = [M][T]⁻².",
      misconception: "[L] di pembilang dan penyebut saling menghilangkan."
    },
    {
      id: "dd_m05_8",
      mission: 5,
      type: "boss",
      difficulty: "hard",
      question: "CASE FILE #8: Manakah kesimpulan utama dari analisis dimensi dalam penyelidikan kasus fisika?",
      correctAnswer: "C",
      options: [
        { id: "A", text: "Analisis dimensi dapat menentukan nilai angka konstanta seperti ½ atau 2π." },
        { id: "B", text: "Analisis dimensi hanya berlaku untuk besaran pokok." },
        { id: "C", text: "Analisis dimensi dapat membuktikan kesalahan formula, tetapi tidak menentukan nilai konstanta tanpa dimensi." },
        { id: "D", text: "Suku-suku yang dijumlahkan boleh berdimensi berbeda." }
      ],
      explanation: "Analisis dimensi membuktikan kebenaran struktur fisik formula, tetapi angka skalar tidak berdimensi.",
      misconception: "Tujuan analisis dimensi adalah memverifikasi hubungan dasar variabel."
    }
  ];

  /**
   * Session Selector for Level 04: Dimension Detective
   * Selects 10 challenges (2 Investigation, 2 Unknown, 2 Detector, 2 Repair, 2 Boss)
   * Guaranteed balanced representation without duplicates within a session.
   */
  function getSoloSessionChallenges(count) {
    count = count || 10;
    const shuffle = arr => [...arr].sort(() => 0.5 - Math.random());

    const m1 = shuffle(DIMENSION_DETECTIVE_DATA.filter(c => c.mission === 1));
    const m2 = shuffle(DIMENSION_DETECTIVE_DATA.filter(c => c.mission === 2));
    const m3 = shuffle(DIMENSION_DETECTIVE_DATA.filter(c => c.mission === 3));
    const m4 = shuffle(DIMENSION_DETECTIVE_DATA.filter(c => c.mission === 4));
    const m5 = shuffle(DIMENSION_DETECTIVE_DATA.filter(c => c.mission === 5));

    const session = [
      ...m1.slice(0, 2),
      ...m2.slice(0, 2),
      ...m3.slice(0, 2),
      ...m4.slice(0, 2),
      ...m5.slice(0, 2)
    ];

    return shuffle(session);
  }

  return {
    getAllChallenges: function() { return DIMENSION_DETECTIVE_DATA; },
    getSoloSessionChallenges: getSoloSessionChallenges
  };

})();
