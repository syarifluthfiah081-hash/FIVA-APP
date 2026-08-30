/**
 * FIVIA PHYSICS QUEST - DUMMY CHALLENGES DATA (PHASE 2)
 * Isolated test module for Classroom Arena Game Engine
 */

window.FIVIAQuestDummyChallenges = [
  {
    id: 1,
    round: 1,
    question: "Apakah massa termasuk ke dalam 7 Besaran Pokok dalam SI?",
    type: "multiple-choice",
    options: [
      { id: "A", text: "YA, Massa adalah Besaran Pokok" },
      { id: "B", text: "TIDAK, Massa adalah Besaran Turunan" }
    ],
    correctAnswer: "A",
    explanation: "Massa merupakan salah satu dari 7 besaran pokok dalam SI dengan satuan dasar kilogram (kg).",
    hint: "Perhatikan 7 besaran pokok dasar: Panjang, Massa, Waktu, Suhu, Kuat Arus, Jumlah Zat, Intensitas Cahaya.",
    points: 100,
    stealPoints: 150
  },
  {
    id: 2,
    round: 1,
    question: "Satuan standar internasional (SI) untuk mengukur interval Waktu adalah...",
    type: "multiple-choice",
    options: [
      { id: "A", text: "Meter (m)" },
      { id: "B", text: "Sekon / Detik (s)" },
      { id: "C", text: "Kilogram (kg)" },
      { id: "D", text: "Newton (N)" }
    ],
    correctAnswer: "B",
    explanation: "Satuan SI untuk waktu adalah sekon (s). Meter untuk panjang, kilogram untuk massa, dan newton untuk gaya.",
    hint: "Simbol satuan ini dilambangkan dengan huruf kecil 's'.",
    points: 100,
    stealPoints: 150
  },
  {
    id: 3,
    round: 1,
    question: "Newton (N) merupakan satuan SI turunan yang digunakan untuk besaran...",
    type: "multiple-choice",
    options: [
      { id: "A", text: "Massa" },
      { id: "B", text: "Gaya" },
      { id: "C", text: "Energi" },
      { id: "D", text: "Tekanan" }
    ],
    correctAnswer: "B",
    explanation: "Newton (N = kg·m/s²) adalah satuan besaran turunan Gaya dalam sistem SI.",
    hint: "Hubungan Hukum II Newton: F = m × a.",
    points: 100,
    stealPoints: 150
  },
  {
    id: 4,
    round: 1,
    question: "Kecepatan (v = s/t) dengan satuan m/s dikelompokkan ke dalam besaran...",
    type: "multiple-choice",
    options: [
      { id: "A", text: "Besaran Pokok" },
      { id: "B", text: "Besaran Turunan" }
    ],
    correctAnswer: "B",
    explanation: "Kecepatan adalah besaran turunan karena diturunkan dari besaran pokok Panjang (m) dibagi Waktu (s).",
    hint: "Kecepatan dibentuk dari kombinasi besaran panjang dan waktu.",
    points: 100,
    stealPoints: 150
  },
  {
    id: 5,
    round: 1,
    question: "Dalam analisis dimensi Fisika, simbol dimensi untuk besaran Waktu adalah...",
    type: "multiple-choice",
    options: [
      { id: "A", text: "[M]" },
      { id: "B", text: "[L]" },
      { id: "C", text: "[T]" },
      { id: "D", text: "[I]" }
    ],
    correctAnswer: "C",
    explanation: "Waktu (Time) memiliki simbol dimensi [T]. [M] untuk Massa (Mass), dan [L] untuk Panjang (Length).",
    hint: "Diambil dari singkatan kata bahasa Inggris 'Time'.",
    points: 100,
    stealPoints: 150
  }
];
