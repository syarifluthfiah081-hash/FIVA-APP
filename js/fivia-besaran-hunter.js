/**
 * FIVIA PHYSICS QUEST - BESARAN HUNTER DATA & CARD POOL (PHASE 3A)
 * Level 01: Besaran Pokok vs Besaran Turunan
 * 100% Scientifically Accurate Physics Data
 */

window.FIVIAQuestBesaranHunter = (function() {
  'use strict';

  // Pool of 20 Physics Quantities (7 Pokok + 13 Turunan)
  const CARD_POOL = [
    // --- 7 BESARAN POKOK SI ---
    {
      id: "bh_p01",
      name: "Panjang",
      category: "pokok",
      symbol: "l",
      unit: "meter",
      unitSymbol: "m",
      dimension: "[L]",
      explanation: "Panjang merupakan salah satu dari 7 Besaran Pokok SI dengan satuan dasar meter (m) dan dimensi [L]."
    },
    {
      id: "bh_p02",
      name: "Massa",
      category: "pokok",
      symbol: "m",
      unit: "kilogram",
      unitSymbol: "kg",
      dimension: "[M]",
      explanation: "Massa merupakan Besaran Pokok SI yang mengukur kuantitas materi dalam benda dengan satuan kilogram (kg) dan dimensi [M]."
    },
    {
      id: "bh_p03",
      name: "Waktu",
      category: "pokok",
      symbol: "t",
      unit: "sekon",
      unitSymbol: "s",
      dimension: "[T]",
      explanation: "Waktu adalah Besaran Pokok SI dengan satuan standar sekon/detik (s) dan dimensi [T]."
    },
    {
      id: "bh_p04",
      name: "Arus Listrik",
      category: "pokok",
      symbol: "I",
      unit: "ampere",
      unitSymbol: "A",
      dimension: "[I]",
      explanation: "Kuat Arus Listrik merupakan Besaran Pokok SI yang mengukur muatan listrik yang mengalir per sekon, dengan satuan ampere (A) dan dimensi [I]."
    },
    {
      id: "bh_p05",
      name: "Suhu Termodinamik",
      category: "pokok",
      symbol: "T",
      unit: "kelvin",
      unitSymbol: "K",
      dimension: "[Θ]",
      explanation: "Suhu Termodinamik adalah Besaran Pokok SI dengan satuan derajat Kelvin (K) dan dimensi [Θ]."
    },
    {
      id: "bh_p06",
      name: "Jumlah Zat",
      category: "pokok",
      symbol: "n",
      unit: "mol",
      unitSymbol: "mol",
      dimension: "[N]",
      explanation: "Jumlah Zat merupakan Besaran Pokok SI yang mengukur banyaknya entitas elementer dengan satuan mol dan dimensi [N]."
    },
    {
      id: "bh_p07",
      name: "Intensitas Cahaya",
      category: "pokok",
      symbol: "I_v",
      unit: "candela",
      unitSymbol: "cd",
      dimension: "[J]",
      explanation: "Intensitas Cahaya adalah Besaran Pokok SI dengan satuan candela (cd) dan dimensi [J]."
    },

    // --- 13 BESARAN TURUNAN ---
    {
      id: "bh_t01",
      name: "Luas",
      category: "turunan",
      symbol: "A",
      unit: "meter persegi",
      unitSymbol: "m²",
      dimension: "[L]²",
      explanation: "Luas merupakan Besaran Turunan dari perkalian Panjang × Panjang (m²), dengan dimensi [L]²."
    },
    {
      id: "bh_t02",
      name: "Volume",
      category: "turunan",
      symbol: "V",
      unit: "meter kubik",
      unitSymbol: "m³",
      dimension: "[L]³",
      explanation: "Volume adalah Besaran Turunan dari Panjang × Panjang × Panjang (m³), dengan dimensi [L]³."
    },
    {
      id: "bh_t03",
      name: "Kecepatan",
      category: "turunan",
      symbol: "v",
      unit: "meter per sekon",
      unitSymbol: "m/s",
      dimension: "[L][T]⁻¹",
      explanation: "Kecepatan merupakan Besaran Turunan dari perbandingan Panjang (m) dibagi Waktu (s), dengan dimensi [L][T]⁻¹."
    },
    {
      id: "bh_t04",
      name: "Percepatan",
      category: "turunan",
      symbol: "a",
      unit: "meter per sekon kuadrat",
      unitSymbol: "m/s²",
      dimension: "[L][T]⁻²",
      explanation: "Percepatan adalah Besaran Turunan dari Kecepatan dibagi Waktu (m/s²), dengan dimensi [L][T]⁻²."
    },
    {
      id: "bh_t05",
      name: "Gaya",
      category: "turunan",
      symbol: "F",
      unit: "newton",
      unitSymbol: "N (kg·m/s²)",
      dimension: "[M][L][T]⁻²",
      explanation: "Gaya (F = m·a) merupakan Besaran Turunan dari Massa × Percepatan, dengan satuan newton (N) dan dimensi [M][L][T]⁻²."
    },
    {
      id: "bh_t06",
      name: "Energi",
      category: "turunan",
      symbol: "E",
      unit: "joule",
      unitSymbol: "J (kg·m²/s²)",
      dimension: "[M][L]²[T]⁻²",
      explanation: "Energi (Usaha W = F·s) adalah Besaran Turunan dengan satuan joule (J) dan dimensi [M][L]²[T]⁻²."
    },
    {
      id: "bh_t07",
      name: "Daya",
      category: "turunan",
      symbol: "P",
      unit: "watt",
      unitSymbol: "W (J/s)",
      dimension: "[M][L]²[T]⁻³",
      explanation: "Daya (P = W/t) merupakan Besaran Turunan dari Energi dibagi Waktu, dengan satuan watt (W) dan dimensi [M][L]²[T]⁻³."
    },
    {
      id: "bh_t08",
      name: "Tekanan",
      category: "turunan",
      symbol: "p",
      unit: "pascal",
      unitSymbol: "Pa (N/m²)",
      dimension: "[M][L]⁻¹[T]⁻²",
      explanation: "Tekanan (p = F/A) adalah Besaran Turunan dari Gaya dibagi Luas permukaan, dengan satuan pascal (Pa) dan dimensi [M][L]⁻¹[T]⁻²."
    },
    {
      id: "bh_t09",
      name: "Massa Jenis",
      category: "turunan",
      symbol: "ρ",
      unit: "kilogram per meter kubik",
      unitSymbol: "kg/m³",
      dimension: "[M][L]⁻³",
      explanation: "Massa Jenis (ρ = m/V) merupakan Besaran Turunan dari Massa dibagi Volume, dengan dimensi [M][L]⁻³."
    },
    {
      id: "bh_t10",
      name: "Momentum",
      category: "turunan",
      symbol: "p",
      unit: "kilogram meter per sekon",
      unitSymbol: "kg·m/s",
      dimension: "[M][L][T]⁻¹",
      explanation: "Momentum (p = m·v) adalah Besaran Turunan dari Massa × Kecepatan, dengan dimensi [M][L][T]⁻¹."
    },
    {
      id: "bh_t11",
      name: "Frekuensi",
      category: "turunan",
      symbol: "f",
      unit: "hertz",
      unitSymbol: "Hz (1/s)",
      dimension: "[T]⁻¹",
      explanation: "Frekuensi (f = 1/T) merupakan Besaran Turunan yang mengukur jumlah getaran per sekon, dengan dimensi [T]⁻¹."
    },
    {
      id: "bh_t12",
      name: "Muatan Listrik",
      category: "turunan",
      symbol: "Q",
      unit: "coulomb",
      unitSymbol: "C (A·s)",
      dimension: "[I][T]",
      explanation: "Muatan Listrik (Q = I·t) adalah Besaran Turunan dari Arus Listrik × Waktu, dengan satuan coulomb (C) dan dimensi [I][T]."
    },
    {
      id: "bh_t13",
      name: "Tegangan Listrik",
      category: "turunan",
      symbol: "V",
      unit: "volt",
      unitSymbol: "V (W/A)",
      dimension: "[M][L]²[T]⁻³[I]⁻¹",
      explanation: "Tegangan Listrik (Beda Potensial) merupakan Besaran Turunan dengan satuan volt (V) dan dimensi [M][L]²[T]⁻³[I]⁻¹."
    }
  ];

  /**
   * Balanced Session Selector:
   * Selects 10 cards per session (Minimum 4 Besaran Pokok + 4 Besaran Turunan + 2 random balance)
   */
  function getSessionCards(count) {
    count = count || 10;
    const pokokList = CARD_POOL.filter(c => c.category === 'pokok');
    const turunanList = CARD_POOL.filter(c => c.category === 'turunan');

    // Shuffle helper
    const shuffle = arr => [...arr].sort(() => 0.5 - Math.random());

    const shuffledPokok = shuffle(pokokList);
    const shuffledTurunan = shuffle(turunanList);

    // Guaranteed 4 Pokok + 4 Turunan
    const selectedPokok = shuffledPokok.slice(0, 4);
    const selectedTurunan = shuffledTurunan.slice(0, 4);

    // Remaining pool for 2 random slots
    const remainingPool = shuffle([
      ...shuffledPokok.slice(4),
      ...shuffledTurunan.slice(4)
    ]);

    const finalSession = shuffle([
      ...selectedPokok,
      ...selectedTurunan,
      ...remainingPool.slice(0, Math.max(0, count - 8))
    ]);

    return finalSession;
  }

  return {
    getAllCards: function() { return CARD_POOL; },
    getSessionCards: getSessionCards
  };

})();
