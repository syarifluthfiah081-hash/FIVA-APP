/**
 * FIVIA PHYSICS QUEST - LEVEL 03: SI EXPLORER (PHASE 3C)
 * Theme: "The Dimension Gate"
 * 40 Scientifically Validated Physics Challenges & Dimension Exponent Map Engine
 */

window.FIVIAQuestSIExplorer = (function() {
  'use strict';

  // Dimension Helper: Order of standard base dimensions
  const DIM_ORDER = ['M', 'L', 'T', 'I', 'Θ', 'N', 'J'];

  /**
   * Parses dimension expression strings into a normalized Exponent Map object.
   * e.g. "[M][L][T]⁻²" or "[L][M][T]⁻²" -> { M: 1, L: 1, T: -2 }
   */
  function parseDimension(dimStr) {
    if (!dimStr) return {};
    const map = {};
    
    // Regex matching [M], [L]², [T]⁻¹, [T]⁻², [I], [Θ], [N], [J], etc.
    const regex = /\[([MLTIΘNJ])\](?:([²³]|⁻[¹²³]|\d+|-?\d+))?/g;
    let match;

    while ((match = regex.exec(dimStr)) !== null) {
      const symbol = match[1];
      const rawExp = match[2];
      let exp = 1;

      if (rawExp) {
        if (rawExp === '²') exp = 2;
        else if (rawExp === '³') exp = 3;
        else if (rawExp === '⁻¹') exp = -1;
        else if (rawExp === '⁻²') exp = -2;
        else if (rawExp === '⁻³') exp = -3;
        else exp = parseInt(rawExp, 10) || 1;
      }

      map[symbol] = (map[symbol] || 0) + exp;
    }

    // Filter out zero exponents ([T]⁰)
    Object.keys(map).forEach(key => {
      if (map[key] === 0) delete map[key];
    });

    return map;
  }

  /**
   * Compares two dimension strings or maps for strict mathematical equality.
   * Handles factor reordering ([M][L][T]⁻² === [L][M][T]⁻²)
   */
  function compareDimensions(dimA, dimB) {
    const mapA = (typeof dimA === 'string') ? parseDimension(dimA) : dimA;
    const mapB = (typeof dimB === 'string') ? parseDimension(dimB) : dimB;

    const keysA = Object.keys(mapA);
    const keysB = Object.keys(mapB);

    if (keysA.length !== keysB.length) return false;

    for (let k of keysA) {
      if (mapA[k] !== mapB[k]) return false;
    }

    return true;
  }

  /**
   * Formats an Exponent Map into a standard formatted string e.g. "[M][L][T]⁻²"
   */
  function formatExponentMap(map) {
    let result = '';
    DIM_ORDER.forEach(sym => {
      if (map[sym]) {
        const val = map[sym];
        let expStr = '';
        if (val === 2) expStr = '²';
        else if (val === 3) expStr = '³';
        else if (val === -1) expStr = '⁻¹';
        else if (val === -2) expStr = '⁻²';
        else if (val === -3) expStr = '⁻³';
        else if (val !== 1) expStr = `^${val}`;

        result += `[${sym}]${expStr}`;
      }
    });
    return result || '[1]';
  }

  // 40 Scientifically Validated Physics Challenges
  const SI_EXPLORER_DATA = [
    // ==========================================
    // MISSION 01: DIMENSION SCANNER (8 Challenges)
    // ==========================================
    {
      id: "se_m01_1",
      mission: 1,
      type: "scanner",
      difficulty: "easy",
      question: "Hasil pemindaian sensor: Apakah dimensi dari besaran KECEPATAN (v = s/t)?",
      quantity: "Kecepatan",
      correctAnswer: "C",
      options: [
        { id: "A", text: "[L]" },
        { id: "B", text: "[T]" },
        { id: "C", text: "[L][T]⁻¹" },
        { id: "D", text: "[M][L][T]⁻²" }
      ],
      explanation: "Kecepatan v = s/t -> [s]/[t] = [L]/[T] = [L][T]⁻¹.",
      misconception: "[L][T]⁻² adalah dimensi untuk percepatan, bukan kecepatan."
    },
    {
      id: "se_m01_2",
      mission: 1,
      type: "scanner",
      difficulty: "easy",
      question: "Hasil pemindaian sensor: Manakah dimensi dari besaran PERCEPATAN (a = Δv/Δt)?",
      quantity: "Percepatan",
      correctAnswer: "B",
      options: [
        { id: "A", text: "[L][T]⁻¹" },
        { id: "B", text: "[L][T]⁻²" },
        { id: "C", text: "[M][L]⁻³" },
        { id: "D", text: "[T]⁻¹" }
      ],
      explanation: "Percepatan a = v/t -> ([L][T]⁻¹)/[T] = [L][T]⁻².",
      misconception: "[L][T]⁻¹ adalah kecepatan; percepatan membagi waktu sekali lagi sehingga menjadi [T]⁻²."
    },
    {
      id: "se_m01_3",
      mission: 1,
      type: "scanner",
      difficulty: "easy",
      question: "Hasil pemindaian sensor: Apakah dimensi dari besaran MASSA JENIS (ρ = m/V)?",
      quantity: "Massa Jenis",
      correctAnswer: "A",
      options: [
        { id: "A", text: "[M][L]⁻³" },
        { id: "B", text: "[M][L]³" },
        { id: "C", text: "[M][L][T]⁻¹" },
        { id: "D", text: "[M][L]⁻¹[T]⁻²" }
      ],
      explanation: "Massa jenis ρ = m/V -> [M]/[L]³ = [M][L]⁻³.",
      misconception: "Volume berada di penyebut, sehingga pangkat panjang menjadi negatif (-3)."
    },
    {
      id: "se_m01_4",
      mission: 1,
      type: "scanner",
      difficulty: "medium",
      question: "Hasil pemindaian sensor: Apakah dimensi dari besaran GAYA (F = m · a)?",
      quantity: "Gaya",
      correctAnswer: "D",
      options: [
        { id: "A", text: "[M][L]²[T]⁻²" },
        { id: "B", text: "[M][L][T]⁻¹" },
        { id: "C", text: "[M][L]⁻¹[T]⁻²" },
        { id: "D", text: "[M][L][T]⁻²" }
      ],
      explanation: "Gaya F = m·a -> [M] × [L][T]⁻² = [M][L][T]⁻².",
      misconception: "[M][L]²[T]⁻² adalah dimensi Energi/Usaha, bukan Gaya."
    },
    {
      id: "se_m01_5",
      mission: 1,
      type: "scanner",
      difficulty: "medium",
      question: "Hasil pemindaian sensor: Manakah dimensi dari USAHA / ENERGI (W = F · s)?",
      quantity: "Energi",
      correctAnswer: "A",
      options: [
        { id: "A", text: "[M][L]²[T]⁻²" },
        { id: "B", text: "[M][L][T]⁻²" },
        { id: "C", text: "[M][L]²[T]⁻³" },
        { id: "D", text: "[M][L]⁻¹[T]⁻²" }
      ],
      explanation: "Usaha W = F·s -> ([M][L][T]⁻²) × [L] = [M][L]²[T]⁻².",
      misconception: "Perkalian dengan jarak (s) menambah pangkat [L] dari 1 menjadi 2."
    },
    {
      id: "se_m01_6",
      mission: 1,
      type: "scanner",
      difficulty: "medium",
      question: "Hasil pemindaian sensor: Manakah dimensi dari DAYA (P = W / t)?",
      quantity: "Daya",
      correctAnswer: "C",
      options: [
        { id: "A", text: "[M][L]²[T]⁻²" },
        { id: "B", text: "[M][L][T]⁻²" },
        { id: "C", text: "[M][L]²[T]⁻³" },
        { id: "D", text: "[M][L]⁻¹[T]⁻²" }
      ],
      explanation: "Daya P = W/t -> ([M][L]²[T]⁻²)/[T] = [M][L]²[T]⁻³.",
      misconception: "Daya membagi energi dengan waktu, sehingga pangkat [T] menjadi -3."
    },
    {
      id: "se_m01_7",
      mission: 1,
      type: "scanner",
      difficulty: "hard",
      question: "Hasil pemindaian sensor: Manakah dimensi dari TEKANAN (p = F / A)?",
      quantity: "Tekanan",
      correctAnswer: "B",
      options: [
        { id: "A", text: "[M][L]²[T]⁻²" },
        { id: "B", text: "[M][L]⁻¹[T]⁻²" },
        { id: "C", text: "[M][L][T]⁻²" },
        { id: "D", text: "[M][L]⁻³" }
      ],
      explanation: "Tekanan p = F/A -> ([M][L][T]⁻²)/[L]² = [M][L]⁻¹[T]⁻².",
      misconception: "[L] di pembilang dibagi [L]² di penyebut menghasilkan [L]⁻¹."
    },
    {
      id: "se_m01_8",
      mission: 1,
      type: "scanner",
      difficulty: "hard",
      question: "Hasil pemindaian sensor: Apakah dimensi dari INTENSITAS CAHAYA dalam SI?",
      quantity: "Intensitas Cahaya",
      correctAnswer: "D",
      options: [
        { id: "A", text: "[I]" },
        { id: "B", text: "J (Joule)" },
        { id: "C", text: "cd (Candela)" },
        { id: "D", text: "[J]" }
      ],
      explanation: "[J] adalah simbol dimensi SI untuk Intensitas Cahaya. Candela (cd) adalah satuannya.",
      misconception: "Huruf J tanpa kurung siku adalah Joule (satuan energi), sedangkan [J] adalah simbol dimensi intensitas cahaya."
    },

    // ==========================================
    // MISSION 02: DIMENSION BUILDER (8 Challenges)
    // ==========================================
    {
      id: "se_m02_1",
      mission: 2,
      type: "builder",
      difficulty: "easy",
      question: "Susun dimensi untuk GAYA (F = m · a)",
      targetQuantity: "Gaya",
      targetMap: { M: 1, L: 1, T: -2 },
      hintEquation: "F = m × a  ->  [M] × [L][T]⁻²",
      explanation: "Gaya tersusun atas Massa [M], Panjang [L], dan Waktu [T]⁻².",
      misconception: "Urutan blok [M][L][T]⁻² ekuivalen dengan [L][M][T]⁻²."
    },
    {
      id: "se_m02_2",
      mission: 2,
      type: "builder",
      difficulty: "easy",
      question: "Susun dimensi untuk KECEPATAN (v = s / t)",
      targetQuantity: "Kecepatan",
      targetMap: { L: 1, T: -1 },
      hintEquation: "v = s / t  ->  [L] / [T]",
      explanation: "Kecepatan tersusun atas Panjang [L] dan Waktu [T]⁻¹.",
      misconception: "Pangkat [T] adalah -1 karena waktu berada di penyebut."
    },
    {
      id: "se_m02_3",
      mission: 2,
      type: "builder",
      difficulty: "medium",
      question: "Susun dimensi untuk ENERGI KINETIK (Ek = ½ m v²)",
      targetQuantity: "Energi Kinetik",
      targetMap: { M: 1, L: 2, T: -2 },
      hintEquation: "Ek = ½ · m · v²  ->  [M] × ([L][T]⁻¹)²",
      explanation: "Konstanta ½ tidak berdimensi. Energi Kinetik Memiliki dimensi [M][L]²[T]⁻².",
      misconception: "Angka konstanta (seperti ½ atau π) tidak memiliki dimensi."
    },
    {
      id: "se_m02_4",
      mission: 2,
      type: "builder",
      difficulty: "medium",
      question: "Susun dimensi untuk MOMENTUM (p = m · v)",
      targetQuantity: "Momentum",
      targetMap: { M: 1, L: 1, T: -1 },
      hintEquation: "p = m × v  ->  [M] × [L][T]⁻¹",
      explanation: "Momentum berdimensi [M][L][T]⁻¹ (sama dengan dimensi Impuls I = F·Δt).",
      misconception: "Momentum dan Impuls memiliki dimensi yang persis sama."
    },
    {
      id: "se_m02_5",
      mission: 2,
      type: "builder",
      difficulty: "medium",
      question: "Susun dimensi untuk FREKUENSI (f = 1 / T)",
      targetQuantity: "Frekuensi",
      targetMap: { T: -1 },
      hintEquation: "f = 1 / T  ->  1 / [T]",
      explanation: "Frekuensi berdimensi [T]⁻¹ (kebalikan dari periode waktu).",
      misconception: "Frekuensi hanya memiliki komponen waktu berpangkat negatif 1."
    },
    {
      id: "se_m02_6",
      mission: 2,
      type: "builder",
      difficulty: "hard",
      question: "Susun dimensi untuk TEKANAN (p = F / A)",
      targetQuantity: "Tekanan",
      targetMap: { M: 1, L: -1, T: -2 },
      hintEquation: "p = F / A  ->  ([M][L][T]⁻²) / [L]²",
      explanation: "Tekanan berdimensi [M][L]⁻¹[T]⁻².",
      misconception: "[L] pembilang dibagi [L]² penyebut menghasilkan [L]⁻¹."
    },
    {
      id: "se_m02_7",
      mission: 2,
      type: "builder",
      difficulty: "hard",
      question: "Susun dimensi untuk MUATAN LISTRIK (Q = I · t)",
      targetQuantity: "Muatan Listrik",
      targetMap: { I: 1, T: 1 },
      hintEquation: "Q = I × t  ->  [I] × [T]",
      explanation: "Muatan listrik berdimensi [I][T] (Kuat Arus × Waktu).",
      misconception: "Coulomb adalah satuan turunan, tetapi dimensinya adalah [I][T]."
    },
    {
      id: "se_m02_8",
      mission: 2,
      type: "builder",
      difficulty: "hard",
      question: "Susun dimensi untuk DAYA (P = W / t)",
      targetQuantity: "Daya",
      targetMap: { M: 1, L: 2, T: -3 },
      hintEquation: "P = W / t  ->  ([M][L]²[T]⁻²) / [T]",
      explanation: "Daya berdimensi [M][L]²[T]⁻³.",
      misconception: "Pangkat [T] menjadi -3 karena energi ([T]⁻²) dibagi lagi dengan waktu ([T])."
    },

    // ==========================================
    // MISSION 03: EQUATION DETECTOR (8 Challenges)
    // ==========================================
    {
      id: "se_m03_1",
      mission: 3,
      type: "detector",
      difficulty: "easy",
      question: "Periksa Konsistensi Dimensi Persamaan: s = v · t",
      leftExpr: "s = [L]",
      rightExpr: "v · t = [L][T]⁻¹ × [T] = [L]",
      isValid: true,
      explanation: "Sisi kiri [L] sama dengan sisi kanan [L]. Persamaan ini KONSISTEN secara dimensional.",
      misconception: "Persamaan gerak lurus beraturan s = v·t benar secara dimensional."
    },
    {
      id: "se_m03_2",
      mission: 3,
      type: "detector",
      difficulty: "easy",
      question: "Periksa Konsistensi Dimensi Persamaan: v = a · t²",
      leftExpr: "v = [L][T]⁻¹",
      rightExpr: "a · t² = [L][T]⁻² × [T]² = [L]",
      isValid: false,
      explanation: "Sisi kiri [L][T]⁻¹ TIDAK SAMA dengan sisi kanan [L]. Persamaan ini TIDAK KONSISTEN.",
      misconception: "Persamaan yang benar adalah v = a·t (bukan t²)."
    },
    {
      id: "se_m03_3",
      mission: 3,
      type: "detector",
      difficulty: "medium",
      question: "Periksa Konsistensi Dimensi Persamaan Energi Kinetik: Ek = ½ m v²",
      leftExpr: "Ek = [M][L]²[T]⁻²",
      rightExpr: "½ m v² = [M] × ([L][T]⁻¹)² = [M][L]²[T]⁻²",
      isValid: true,
      explanation: "Angka ½ tanpa dimensi. Dimensi kiri [M][L]²[T]⁻² SAMA dengan dimensi kanan. VALID!",
      misconception: "Konstanta skalar (½) tidak memengaruhi analisis dimensi."
    },
    {
      id: "se_m03_4",
      mission: 3,
      type: "detector",
      difficulty: "medium",
      question: "Periksa Konsistensi Dimensi Persamaan: F = m · v",
      leftExpr: "F = [M][L][T]⁻²",
      rightExpr: "m · v = [M] × [L][T]⁻¹ = [M][L][T]⁻¹",
      isValid: false,
      explanation: "Gaya memuat [T]⁻², sedangkan m·v memuat [T]⁻¹ (ini adalah momentum, bukan gaya). INVALID!",
      misconception: "F = m·v salah; rumus gaya yang benar adalah F = m·a."
    },
    {
      id: "se_m03_5",
      mission: 3,
      type: "detector",
      difficulty: "medium",
      question: "Periksa Konsistensi Dimensi Hukum Newton 2: F = m · a",
      leftExpr: "F = [M][L][T]⁻²",
      rightExpr: "m · a = [M] × [L][T]⁻² = [M][L][T]⁻²",
      isValid: true,
      explanation: "Sisi kiri dan kanan persis sama [M][L][T]⁻². VALID!",
      misconception: "Hukum 2 Newton sah secara dimensional."
    },
    {
      id: "se_m03_6",
      mission: 3,
      type: "detector",
      difficulty: "hard",
      question: "Periksa Konsistensi Dimensi Tekanan Hidrostatis: p = ρ · g · h",
      leftExpr: "p = [M][L]⁻¹[T]⁻²",
      rightExpr: "ρ·g·h = [M][L]⁻³ × [L][T]⁻² × [L] = [M][L]⁻¹[T]⁻²",
      isValid: true,
      explanation: "Sisi kiri [M][L]⁻¹[T]⁻² SAMA dengan sisi kanan ([M][L]⁻³ · [L]²[T]⁻² = [M][L]⁻¹[T]⁻²). VALID!",
      misconception: "Persamaan tekanan hidrostatis konsisten secara dimensional."
    },
    {
      id: "se_m03_7",
      mission: 3,
      type: "detector",
      difficulty: "hard",
      question: "Periksa Konsistensi Dimensi Persamaan: W = F / s",
      leftExpr: "W = [M][L]²[T]⁻²",
      rightExpr: "F / s = ([M][L][T]⁻²) / [L] = [M][T]⁻²",
      isValid: false,
      explanation: "Usaha W = F × s (perkalian, bukan pembagian). F/s menghasilkan [M][T]⁻². INVALID!",
      misconception: "Usaha adalah Gaya dikali Jarak, bukan dibagi Jarak."
    },
    {
      id: "se_m03_8",
      mission: 3,
      type: "detector",
      difficulty: "hard",
      question: "Periksa Konsistensi Dimensi Impuls dan Perubahan Momentum: I = Δp",
      leftExpr: "Impuls (F·Δt) = [M][L][T]⁻² × [T] = [M][L][T]⁻¹",
      rightExpr: "Momentum (m·v) = [M] × [L][T]⁻¹ = [M][L][T]⁻¹",
      isValid: true,
      explanation: "Impuls dan Momentum memiliki dimensi yang persis sama [M][L][T]⁻¹. VALID!",
      misconception: "Teorema impuls-momentum terbukti sah secara dimensional."
    },

    // ==========================================
    // MISSION 04: DIMENSION MATCH (8 Challenges)
    // ==========================================
    {
      id: "se_m04_1",
      mission: 4,
      type: "match",
      difficulty: "easy",
      question: "Pasangkan Besaran Fisika berikut dengan Dimensi SI yang Tepat",
      quantity: "Gaya",
      correctAnswer: "[M][L][T]⁻²",
      options: [
        { id: "[M][L][T]⁻²", label: "[M][L][T]⁻²" },
        { id: "[M][L]²[T]⁻²", label: "[M][L]²[T]⁻²" },
        { id: "[M][L]⁻¹[T]⁻²", label: "[M][L]⁻¹[T]⁻²" },
        { id: "[L][T]⁻²", label: "[L][T]⁻²" }
      ],
      explanation: "Gaya (F = m·a) memiliki dimensi [M][L][T]⁻².",
      misconception: "Jangan tertukar dengan Energi yang memiliki [L]²."
    },
    {
      id: "se_m04_2",
      mission: 4,
      type: "match",
      difficulty: "easy",
      question: "Pasangkan Besaran Fisika berikut dengan Dimensi SI yang Tepat",
      quantity: "Energi / Usaha",
      correctAnswer: "[M][L]²[T]⁻²",
      options: [
        { id: "[M][L]²[T]⁻²", label: "[M][L]²[T]⁻²" },
        { id: "[M][L][T]⁻²", label: "[M][L][T]⁻²" },
        { id: "[M][L]²[T]⁻³", label: "[M][L]²[T]⁻³" },
        { id: "[M][L]⁻³", label: "[M][L]⁻³" }
      ],
      explanation: "Energi dan Usaha memiliki dimensi [M][L]²[T]⁻².",
      misconception: "Energi Potensial, Energi Kinetik, dan Usaha semuanya berdimensi sama."
    },
    {
      id: "se_m04_3",
      mission: 4,
      type: "match",
      difficulty: "easy",
      question: "Pasangkan Besaran Fisika berikut dengan Dimensi SI yang Tepat",
      quantity: "Daya",
      correctAnswer: "[M][L]²[T]⁻³",
      options: [
        { id: "[M][L]²[T]⁻³", label: "[M][L]²[T]⁻³" },
        { id: "[M][L]²[T]⁻²", label: "[M][L]²[T]⁻²" },
        { id: "[M][L][T]⁻²", label: "[M][L][T]⁻²" },
        { id: "[T]⁻¹", label: "[T]⁻¹" }
      ],
      explanation: "Daya (P = W/t) memiliki dimensi [M][L]²[T]⁻³.",
      misconception: "Daya adalah laju energi per sekon."
    },
    {
      id: "se_m04_4",
      mission: 4,
      type: "match",
      difficulty: "medium",
      question: "Pasangkan Besaran Fisika berikut dengan Dimensi SI yang Tepat",
      quantity: "Tekanan",
      correctAnswer: "[M][L]⁻¹[T]⁻²",
      options: [
        { id: "[M][L]⁻¹[T]⁻²", label: "[M][L]⁻¹[T]⁻²" },
        { id: "[M][L]²[T]⁻²", label: "[M][L]²[T]⁻²" },
        { id: "[M][L]⁻³", label: "[M][L]⁻³" },
        { id: "[M][L][T]⁻²", label: "[M][L][T]⁻²" }
      ],
      explanation: "Tekanan (p = F/A) memiliki dimensi [M][L]⁻¹[T]⁻².",
      misconception: "[L]⁻¹ muncul dari [L] dibagi [L]²."
    },
    {
      id: "se_m04_5",
      mission: 4,
      type: "match",
      difficulty: "medium",
      question: "Pasangkan Besaran Fisika berikut dengan Dimensi SI yang Tepat",
      quantity: "Momentum",
      correctAnswer: "[M][L][T]⁻¹",
      options: [
        { id: "[M][L][T]⁻¹", label: "[M][L][T]⁻¹" },
        { id: "[M][L][T]⁻²", label: "[M][L][T]⁻²" },
        { id: "[L][T]⁻¹", label: "[L][T]⁻¹" },
        { id: "[M][L]²[T]⁻¹", label: "[M][L]²[T]⁻¹" }
      ],
      explanation: "Momentum (p = m·v) berdimensi [M][L][T]⁻¹.",
      misconception: "Sama dengan dimensi Impuls."
    },
    {
      id: "se_m04_6",
      mission: 4,
      type: "match",
      difficulty: "medium",
      question: "Pasangkan Besaran Fisika berikut dengan Dimensi SI yang Tepat",
      quantity: "Muatan Listrik",
      correctAnswer: "[I][T]",
      options: [
        { id: "[I][T]", label: "[I][T]" },
        { id: "[I][T]⁻¹", label: "[I][T]⁻¹" },
        { id: "[M][L]²[T]⁻³[I]⁻¹", label: "[M][L]²[T]⁻³[I]⁻¹" },
        { id: "[I]", label: "[I]" }
      ],
      explanation: "Muatan listrik (Q = I·t) berdimensi [I][T].",
      misconception: "Ampere [I] dikalikan sekon [T]."
    },
    {
      id: "se_m04_7",
      mission: 4,
      type: "match",
      difficulty: "hard",
      question: "Pasangkan Besaran Fisika berikut dengan Dimensi SI yang Tepat",
      quantity: "Frekuensi",
      correctAnswer: "[T]⁻¹",
      options: [
        { id: "[T]⁻¹", label: "[T]⁻¹" },
        { id: "[T]", label: "[T]" },
        { id: "[L][T]⁻¹", label: "[L][T]⁻¹" },
        { id: "[T]⁻²", label: "[T]⁻²" }
      ],
      explanation: "Frekuensi (f = 1/T) berdimensi [T]⁻¹.",
      misconception: "Periode berdimensi [T], sedangkan frekuensi berdimensi [T]⁻¹."
    },
    {
      id: "se_m04_8",
      mission: 4,
      type: "match",
      difficulty: "hard",
      question: "Pasangkan Besaran Fisika berikut dengan Dimensi SI yang Tepat",
      quantity: "Tegangan Listrik (Beda Potensial)",
      correctAnswer: "[M][L]²[T]⁻³[I]⁻¹",
      options: [
        { id: "[M][L]²[T]⁻³[I]⁻¹", label: "[M][L]²[T]⁻³[I]⁻¹" },
        { id: "[M][L]²[T]⁻²", label: "[M][L]²[T]⁻²" },
        { id: "[I][T]", label: "[I][T]" },
        { id: "[M][L]²[T]⁻³", label: "[M][L]²[T]⁻³" }
      ],
      explanation: "Tegangan listrik (V = W/Q) berdimensi ([M][L]²[T]⁻²)/([I][T]) = [M][L]²[T]⁻³[I]⁻¹.",
      misconception: "Beda potensial adalah energi per satuan muatan."
    },

    // ==========================================
    // MISSION 05: DIMENSION BOSS (8 Challenges)
    // ==========================================
    {
      id: "se_m05_1",
      mission: 5,
      type: "boss",
      difficulty: "hard",
      question: "FINAL DIMENSION CORE #1: Dua besaran fisika manakah yang memiliki DIMENSI PERSIS SAMA?",
      correctAnswer: "A",
      options: [
        { id: "A", text: "Usaha dan Energi Kinetik ([M][L]²[T]⁻²)" },
        { id: "B", text: "Gaya dan Tekanan" },
        { id: "C", text: "Kecepatan dan Percepatan" },
        { id: "D", text: "Daya dan Energi" }
      ],
      explanation: "Usaha dan Energi Kinetik memiliki dimensi yang persis sama: [M][L]²[T]⁻².",
      misconception: "Dua besaran berbeda bisa memiliki dimensi yang identik."
    },
    {
      id: "se_m05_2",
      mission: 5,
      type: "boss",
      difficulty: "hard",
      question: "FINAL DIMENSION CORE #2: Manakah analisis miskonsepsi dimensi yang BENAR?",
      correctAnswer: "C",
      options: [
        { id: "A", text: "Newton adalah dimensi dari Gaya." },
        { id: "B", text: "Simbol [J] menunjukkan satuan Joule." },
        { id: "C", text: "Newton adalah satuan Gaya, sedangkan dimensinya adalah [M][L][T]⁻²." },
        { id: "D", text: "Jika dua besaran memiliki satuan berbeda, dimensinya pasti berbeda." }
      ],
      explanation: "Newton (N) adalah nama satuan khusus, sedangkan dimensi gaya adalah [M][L][T]⁻².",
      misconception: "Jangan bingung antara nama satuan baku dengan analisis dimensi dasar."
    },
    {
      id: "se_m05_3",
      mission: 5,
      type: "boss",
      difficulty: "hard",
      question: "FINAL DIMENSION CORE #3: Manakah susunan faktor dimensi yang EKUIVALEN dengan dimensi Gaya?",
      correctAnswer: "B",
      options: [
        { id: "A", text: "[M][L]²[T]⁻²" },
        { id: "B", text: "[L][M][T]⁻²" },
        { id: "C", text: "[M][L]⁻¹[T]⁻²" },
        { id: "D", text: "[M][L][T]⁻¹" }
      ],
      explanation: "[L][M][T]⁻² ekuivalen secara matematis dengan [M][L][T]⁻² karena perkalian faktor besaran bersifat komutatif.",
      misconception: "Urutan penulisan perkalian dimensi tidak mengubah makna fisisnya."
    },
    {
      id: "se_m05_4",
      mission: 5,
      type: "boss",
      difficulty: "hard",
      question: "FINAL DIMENSION CORE #4: Periksa konsistensi rumus jarak GLBB: s = v₀·t + ½ a·t²",
      correctAnswer: "A",
      options: [
        { id: "A", text: "KONSISTEN (Kedua suku kanan berdimensi [L], sama dengan s)" },
        { id: "B", text: "TIDAK KONSISTEN (Suku ½ a·t² berdimensi [L]²)" },
        { id: "C", text: "TIDAK KONSISTEN (Suku v₀·t berdimensi [L][T]⁻¹)" },
        { id: "D", text: "TIDAK KONSISTEN (Karena ada angka ½)" }
      ],
      explanation: "v₀·t = [L][T]⁻¹ × [T] = [L]; ½ a·t² = [L][T]⁻² × [T]² = [L]. Kedua suku berdimensi [L]. VALID!",
      misconception: "Suku-suku yang dijumlahkan harus memiliki dimensi yang sama."
    },
    {
      id: "se_m05_5",
      mission: 5,
      type: "boss",
      difficulty: "hard",
      question: "FINAL DIMENSION CORE #5: Manakah pasangan besaran dan dimensi yang SALAH?",
      correctAnswer: "D",
      options: [
        { id: "A", text: "Percepatan -> [L][T]⁻²" },
        { id: "B", text: "Impuls -> [M][L][T]⁻¹" },
        { id: "C", text: "Massa Jenis -> [M][L]⁻³" },
        { id: "D", text: "Daya -> [M][L][T]⁻²" }
      ],
      explanation: "Daya seharusnya berdimensi [M][L]²[T]⁻³ (bukan [M][L][T]⁻² yang merupakan Gaya).",
      misconception: "Opsi D memasangkan Daya dengan dimensi Gaya."
    },
    {
      id: "se_m05_6",
      mission: 5,
      type: "boss",
      difficulty: "hard",
      question: "FINAL DIMENSION CORE #6: Apakah dimensi dari konstanta pegas k dalam hukum Hooke (F = k · Δx)?",
      correctAnswer: "B",
      options: [
        { id: "A", text: "[M][L][T]⁻²" },
        { id: "B", text: "[M][T]⁻²" },
        { id: "C", text: "[M][L]²[T]⁻²" },
        { id: "D", text: "[M][L]⁻¹[T]⁻²" }
      ],
      explanation: "k = F / Δx -> ([M][L][T]⁻²) / [L] = [M][T]⁻².",
      misconception: "Panjang [L] di pembilang dan penyebut saling menghilangkan."
    },
    {
      id: "se_m05_7",
      mission: 5,
      type: "boss",
      difficulty: "hard",
      question: "FINAL DIMENSION CORE #7: Suatu persamaan v = √(2g h). Periksa konsistensi dimensinya!",
      correctAnswer: "A",
      options: [
        { id: "A", text: "KONSISTEN (Kiri = [L][T]⁻¹, Kanan = √([L]²[T]⁻²) = [L][T]⁻¹)" },
        { id: "B", text: "TIDAK KONSISTEN (Kanan berdimensi [L]²[T]⁻²)" },
        { id: "C", text: "TIDAK KONSISTEN (Kanan berdimensi [L][T]⁻²)" },
        { id: "D", text: "TIDAK KONSISTEN (Karena ada akar kuadrat)" }
      ],
      explanation: "2gh -> [L][T]⁻² × [L] = [L]²[T]⁻². Diakarkan menjadi [L][T]⁻¹, sama dengan dimensi kecepatan. VALID!",
      misconception: "Operasi akar kuadrat juga mengakar pangkat dimensi."
    },
    {
      id: "se_m05_8",
      mission: 5,
      type: "boss",
      difficulty: "hard",
      question: "FINAL DIMENSION CORE #8: Manakah pernyataan yang BENAR mengenai analisis dimensi?",
      correctAnswer: "C",
      options: [
        { id: "A", text: "Jika dimensi konsisten, persamaan pasti 100% benar secara fisis termasuk konstanta angkanya." },
        { id: "B", text: "Dimensi dapat menentukan nilai konstanta tanpa satuan seperti ½ atau 2π." },
        { id: "C", text: "Analisis dimensi dapat membuktikan kesalahan persamaan, tetapi tidak bisa menentukan konstanta tak berdimensi." },
        { id: "D", text: "Persamaan fisika boleh memiliki suku-suku berdimensi beda jika dijumlahkan." }
      ],
      explanation: "Analisis dimensi sangat berguna mendeteksi kesalahan rumus, tetapi tidak dapat menentukan angka konstanta skalar.",
      misconception: "Keunggulan analisis dimensi adalah memverifikasi bentuk rumus dasar."
    }
  ];

  /**
   * Balanced Session Challenge Selector for Level 03 Solo Quest & Arena:
   * Selects 10 challenges (2 Scanner, 2 Builder, 2 Detector, 2 Match, 2 Boss)
   * Guaranteed balanced representation without duplicates.
   */
  function getSoloSessionChallenges(count) {
    count = count || 10;
    const shuffle = arr => [...arr].sort(() => 0.5 - Math.random());

    const m1 = shuffle(SI_EXPLORER_DATA.filter(c => c.mission === 1));
    const m2 = shuffle(SI_EXPLORER_DATA.filter(c => c.mission === 2));
    const m3 = shuffle(SI_EXPLORER_DATA.filter(c => c.mission === 3));
    const m4 = shuffle(SI_EXPLORER_DATA.filter(c => c.mission === 4));
    const m5 = shuffle(SI_EXPLORER_DATA.filter(c => c.mission === 5));

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
    getAllChallenges: function() { return SI_EXPLORER_DATA; },
    getSoloSessionChallenges: getSoloSessionChallenges,
    parseDimension: parseDimension,
    compareDimensions: compareDimensions,
    formatExponentMap: formatExponentMap
  };

})();
