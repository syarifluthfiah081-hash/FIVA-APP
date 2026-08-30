/**
 * FIVIA PHYSICS QUEST - PHASE 4: MASTERY ASSESSMENT QUESTION BANK
 * 60 Scientifically Validated Physics Assessment Questions across 6 Categories
 */

window.FIVIA_ASSESSMENT_BANK = [
  // ==========================================
  // CATEGORY 1: BESARAN POKOK & TURUNAN (10 Questions)
  // ==========================================
  {
    id: "ass_bes_01",
    category: "Besaran",
    difficulty: "easy",
    question: "Manakah di antara kelompok besaran berikut yang seluruhnya merupakan BESARAN POKOK dalam SI?",
    options: [
      { id: "A", text: "Massa, Panjang, Kecepatan" },
      { id: "B", text: "Massa, Panjang, Waktu, Suhu, Kuat Arus, Jumlah Zat, Intensitas Cahaya" },
      { id: "C", text: "Gaya, Usaha, Energi, Daya" },
      { id: "D", text: "Volume, Massa Jenis, Percepatan" }
    ],
    correctAnswer: "B",
    explanation: "7 Besaran Pokok SI: Panjang, Massa, Waktu, Suhu, Kuat Arus Listrik, Jumlah Zat, dan Intensitas Cahaya.",
    misconception: "Kecepatan dan Gaya adalah besaran turunan, bukan besaran pokok.",
    competency: "Identifikasi 7 Besaran Pokok SI",
    levelReference: "Level 01: Besaran Hunter"
  },
  {
    id: "ass_bes_02",
    category: "Besaran",
    difficulty: "easy",
    question: "Besaran turunan yang diturunkan dari besaran pokok Massa dan Volume (Panjang³) adalah...",
    options: [
      { id: "A", text: "Kecepatan" },
      { id: "B", text: "Massa Jenis (ρ = m/V)" },
      { id: "C", text: "Gaya" },
      { id: "D", text: "Tekanan" }
    ],
    correctAnswer: "B",
    explanation: "Massa jenis ρ = m/V diturunkan dari massa dibagi volume (panjang × panjang × panjang).",
    misconception: "Volume merupakan turunan dari panjang.",
    competency: "Penurunan Besaran Turunan",
    levelReference: "Level 01: Besaran Hunter"
  },
  {
    id: "ass_bes_03",
    category: "Besaran",
    difficulty: "easy",
    question: "Manakah pasangan besaran dan definisi penyusun yang BENAR?",
    options: [
      { id: "A", text: "Kecepatan = Jarak / Waktu" },
      { id: "B", text: "Gaya = Massa / Waktu" },
      { id: "C", text: "Usaha = Gaya / Jarak" },
      { id: "D", text: "Daya = Usaha × Waktu" }
    ],
    correctAnswer: "A",
    explanation: "Kecepatan v = s/t (Panjang dibagi Waktu).",
    misconception: "Gaya = Massa × Percepatan, Usaha = Gaya × Jarak, Daya = Usaha / Waktu.",
    competency: "Definisi Operasional Besaran",
    levelReference: "Level 01: Besaran Hunter"
  },
  {
    id: "ass_bes_04",
    category: "Besaran",
    difficulty: "medium",
    question: "Besaran Gaya (F = m · a) diturunkan dari kombinasi besaran pokok...",
    options: [
      { id: "A", text: "Massa dan Waktu" },
      { id: "B", text: "Panjang dan Waktu" },
      { id: "C", text: "Massa, Panjang, dan Waktu" },
      { id: "D", text: "Massa, Panjang, dan Suhu" }
    ],
    correctAnswer: "C",
    explanation: "Gaya F = m·a -> [M] × [L][T]⁻² (Massa, Panjang, dan Waktu).",
    misconception: "Percepatan merupakan turunan dari panjang dan waktu kuadrat.",
    competency: "Komposisi Besaran Pokok",
    levelReference: "Level 01: Besaran Hunter"
  },
  {
    id: "ass_bes_05",
    category: "Besaran",
    difficulty: "medium",
    question: "Manakah besaran di bawah ini yang merupakan besaran SKALAR (hanya memiliki nilai)?",
    options: [
      { id: "A", text: "Massa, Waktu, Suhu, Energi" },
      { id: "B", text: "Gaya, Kecepatan, Percepatan" },
      { id: "C", text: "Impuls, Momentum, Perpindahan" },
      { id: "D", text: "Kuat Medan Listrik, Gaya Berat" }
    ],
    correctAnswer: "A",
    explanation: "Massa, Waktu, Suhu, dan Energi adalah besaran skalar yang hanya memiliki nilai tanpa arah.",
    misconception: "Gaya dan Kecepatan adalah besaran vektor.",
    competency: "Klasifikasi Skalar vs Vektor",
    levelReference: "Level 01: Besaran Hunter"
  },
  {
    id: "ass_bes_06",
    category: "Besaran",
    difficulty: "medium",
    question: "Besaran Tekanan (p = F / A) diturunkan dari besaran pokok...",
    options: [
      { id: "A", text: "Massa, Panjang, dan Waktu" },
      { id: "B", text: "Massa dan Luas" },
      { id: "C", text: "Gaya dan Panjang" },
      { id: "D", text: "Massa, Panjang, dan Kuat Arus" }
    ],
    correctAnswer: "A",
    explanation: "Tekanan p = (m·a)/A -> ([M][L][T]⁻²)/[L]² = [M][L]⁻¹[T]⁻² (Massa, Panjang, dan Waktu).",
    misconception: "Luas dan Gaya merupakan besaran turunan.",
    competency: "Penurunan Besaran Tekanan",
    levelReference: "Level 01: Besaran Hunter"
  },
  {
    id: "ass_bes_07",
    category: "Besaran",
    difficulty: "hard",
    question: "Dua besaran manakah yang diturunkan dari kombinasi besaran pokok yang persis sama?",
    options: [
      { id: "A", text: "Gaya dan Usaha" },
      { id: "B", text: "Usaha dan Energi Kinetik" },
      { id: "C", text: "Kecepatan dan Percepatan" },
      { id: "D", text: "Daya dan Energi" }
    ],
    correctAnswer: "B",
    explanation: "Usaha (W = F·s) dan Energi Kinetik (Ek = ½ m v²) keduanya berdimensi [M][L]²[T]⁻².",
    misconception: "Dua besaran fisis berbeda dapat memiliki penyusun pokok yang identik.",
    competency: "Ekuivalensi Komposisi Besaran",
    levelReference: "Level 01: Besaran Hunter"
  },
  {
    id: "ass_bes_08",
    category: "Besaran",
    difficulty: "hard",
    question: "Manakah besaran pokok yang menjadi dasar pengukur fenomena kelistrikan dalam Sistem Internasional (SI)?",
    options: [
      { id: "A", text: "Muatan Listrik" },
      { id: "B", text: "Kuat Arus Listrik (Ampere)" },
      { id: "C", text: "Tegangan Listrik" },
      { id: "D", text: "Hambatan Listrik" }
    ],
    correctAnswer: "B",
    explanation: "Kuat Arus Listrik (Ampere) adalah besaran POKOK SI, sedangkan Muatan (Coulomb = A·s) adalah besaran turunan.",
    misconception: "Muatan listrik sering dianggap besaran pokok padahal merupakan besaran turunan Q = I·t.",
    competency: "Prinsip Kelistrikan SI",
    levelReference: "Level 01: Besaran Hunter"
  },
  {
    id: "ass_bes_09",
    category: "Besaran",
    difficulty: "hard",
    question: "Besaran Impuls (I = F · Δt) diturunkan dari besaran pokok...",
    options: [
      { id: "A", text: "Massa, Panjang, Waktu (sama dengan Momentum)" },
      { id: "B", text: "Gaya dan Waktu" },
      { id: "C", text: "Massa dan Kecepatan" },
      { id: "D", text: "Panjang dan Waktu kuadrat" }
    ],
    correctAnswer: "A",
    explanation: "Impuls I = F·t = [M][L][T]⁻² × [T] = [M][L][T]⁻¹ (Massa, Panjang, Waktu).",
    misconception: "Impuls dan momentum memiliki komposisi penyusun yang identik.",
    competency: "Penyusun Impuls",
    levelReference: "Level 01: Besaran Hunter"
  },
  {
    id: "ass_bes_10",
    category: "Besaran",
    difficulty: "hard",
    question: "Manakah pernyataan yang BENAR mengenai Besaran Pokok?",
    options: [
      { id: "A", text: "Besaran pokok ditentukan berdasarkan perkalian besaran lain." },
      { id: "B", text: "Besaran pokok ditetapkan secara mandiri melalui kesepakatan internasional (SI)." },
      { id: "C", text: "Jumlah besaran pokok tidak terbatas." },
      { id: "D", text: "Kecepatan dan Luas adalah besaran pokok." }
    ],
    correctAnswer: "B",
    explanation: "7 Besaran pokok SI ditetapkan secara mandiri sebagai standar acuan internasional.",
    misconception: "Besaran pokok bersifat mandiri dan tidak diturunkan dari besaran lain.",
    competency: "Konsep Baku Besaran Pokok",
    levelReference: "Level 01: Besaran Hunter"
  },

  // ==========================================
  // CATEGORY 2: SATUAN SI (10 Questions)
  // ==========================================
  {
    id: "ass_sat_01",
    category: "Satuan",
    difficulty: "easy",
    question: "Apakah satuan standar Sistem Internasional (SI) untuk besaran MASSA?",
    options: [
      { id: "A", text: "Gram (g)" },
      { id: "B", text: "Kilogram (kg)" },
      { id: "C", text: "Pound (lb)" },
      { id: "D", text: "Ton" }
    ],
    correctAnswer: "B",
    explanation: "Kilogram (kg) adalah satuan baku SI untuk massa. Gram merupakan turunan cgs.",
    misconception: "Gram bukan merupakan satuan dasar SI.",
    competency: "Satuan Dasar Baku SI",
    levelReference: "Level 02: Unit Master"
  },
  {
    id: "ass_sat_02",
    category: "Satuan",
    difficulty: "easy",
    question: "Apakah satuan standar SI untuk besaran INTENSITAS CAHAYA?",
    options: [
      { id: "A", text: "Lux" },
      { id: "B", text: "Lumen" },
      { id: "C", text: "Candela (cd)" },
      { id: "D", text: "Watt" }
    ],
    correctAnswer: "C",
    explanation: "Candela (cd) adalah satuan dasar SI untuk Intensitas Cahaya.",
    misconception: "Lumen dan Lux adalah satuan turunan penerangan.",
    competency: "Satuan Intensitas Cahaya",
    levelReference: "Level 02: Unit Master"
  },
  {
    id: "ass_sat_03",
    category: "Satuan",
    difficulty: "easy",
    question: "Satuan Newton (N) ekuivalen dengan susunan satuan dasar SI...",
    options: [
      { id: "A", text: "kg·m/s" },
      { id: "B", text: "kg·m/s²" },
      { id: "C", text: "kg·m²/s²" },
      { id: "D", text: "kg/m³" }
    ],
    correctAnswer: "B",
    explanation: "1 Newton (F = m·a) = 1 kg × 1 m/s² = 1 kg·m/s².",
    misconception: "kg·m²/s² adalah Joule, bukan Newton.",
    competency: "Ekuivalensi Satuan Turunan Gaya",
    levelReference: "Level 02: Unit Master"
  },
  {
    id: "ass_sat_04",
    category: "Satuan",
    difficulty: "medium",
    question: "Satuan Joule (J) ekuivalen dengan...",
    options: [
      { id: "A", text: "N·m  (atau kg·m²/s²)" },
      { id: "B", text: "N/m" },
      { id: "C", text: "N·s" },
      { id: "D", text: "W·s²" }
    ],
    correctAnswer: "A",
    explanation: "1 Joule (W = F·s) = 1 N × 1 m = 1 kg·m²/s².",
    misconception: "Joule adalah satuan Energi dan Usaha.",
    competency: "Ekuivalensi Satuan Energi",
    levelReference: "Level 02: Unit Master"
  },
  {
    id: "ass_sat_05",
    category: "Satuan",
    difficulty: "medium",
    question: "Satuan Watt (W) ekuivalen dengan...",
    options: [
      { id: "A", text: "Joule dikali Sekon (J·s)" },
      { id: "B", text: "Joule per Sekon (J/s atau kg·m²/s³)" },
      { id: "C", text: "Newton per Sekon" },
      { id: "D", text: "Pascal per Sekon" }
    ],
    correctAnswer: "B",
    explanation: "1 Watt (P = W/t) = 1 Joule / 1 sekon = 1 J/s.",
    misconception: "Daya adalah laju perubahan energi per satuan waktu.",
    competency: "Satuan Turunan Daya",
    levelReference: "Level 02: Unit Master"
  },
  {
    id: "ass_sat_06",
    category: "Satuan",
    difficulty: "medium",
    question: "Konversi satuan: 72 km/jam ekuivalen dengan berapa m/s?",
    options: [
      { id: "A", text: "10 m/s" },
      { id: "B", text: "20 m/s" },
      { id: "C", text: "36 m/s" },
      { id: "D", text: "72 m/s" }
    ],
    correctAnswer: "B",
    explanation: "72 km/jam = (72 × 1000 m) / (3600 s) = 72000 / 3600 = 20 m/s.",
    misconception: "Membagi km/jam dengan 3,6 untuk mendapatkan m/s.",
    competency: "Konversi Satuan Kecepatan",
    levelReference: "Level 02: Unit Master"
  },
  {
    id: "ass_sat_07",
    category: "Satuan",
    difficulty: "hard",
    question: "Satuan Pascal (Pa) ekuivalen dengan...",
    options: [
      { id: "A", text: "N/m²  (atau kg·m⁻¹·s⁻²)" },
      { id: "B", text: "N·m²" },
      { id: "C", text: "J/m" },
      { id: "D", text: "kg·m/s²" }
    ],
    correctAnswer: "A",
    explanation: "1 Pascal (p = F/A) = 1 N / 1 m² = (kg·m/s²) / m² = kg·m⁻¹·s⁻².",
    misconception: "Tekanan adalah Gaya per satuan Luas.",
    competency: "Satuan Tekanan SI",
    levelReference: "Level 02: Unit Master"
  },
  {
    id: "ass_sat_08",
    category: "Satuan",
    difficulty: "hard",
    question: "Konversi satuan massa jenis: 1 g/cm³ ekuivalen dengan berapa kg/m³?",
    options: [
      { id: "A", text: "0,001 kg/m³" },
      { id: "B", text: "10 kg/m³" },
      { id: "C", text: "1000 kg/m³" },
      { id: "D", text: "10000 kg/m³" }
    ],
    correctAnswer: "C",
    explanation: "1 g/cm³ = (10⁻³ kg) / (10⁻⁶ m³) = 10³ kg/m³ = 1000 kg/m³.",
    misconception: "Massa jenis air murni 1 g/cm³ = 1000 kg/m³.",
    competency: "Konversi Massa Jenis",
    levelReference: "Level 02: Unit Master"
  },
  {
    id: "ass_sat_09",
    category: "Satuan",
    difficulty: "hard",
    question: "Satuan Coulomb (C) ekuivalen dengan...",
    options: [
      { id: "A", text: "Ampere per Sekon (A/s)" },
      { id: "B", text: "Ampere dikali Sekon (A·s)" },
      { id: "C", text: "Volt per Sekon" },
      { id: "D", text: "Joule per Volt²" }
    ],
    correctAnswer: "B",
    explanation: "1 Coulomb (Q = I·t) = 1 Ampere × 1 sekon = 1 A·s.",
    misconception: "Coulomb adalah perkalian arus dengan waktu.",
    competency: "Satuan Muatan Listrik",
    levelReference: "Level 02: Unit Master"
  },
  {
    id: "ass_sat_10",
    category: "Satuan",
    difficulty: "hard",
    question: "Satuan Volt (V) ekuivalen dengan...",
    options: [
      { id: "A", text: "Joule per Coulomb (J/C atau kg·m²·s⁻³·A⁻¹)" },
      { id: "B", text: "Joule dikali Coulomb" },
      { id: "C", text: "Watt per Sekon" },
      { id: "D", text: "Ampere per Ohm" }
    ],
    correctAnswer: "A",
    explanation: "1 Volt (V = W/Q) = 1 Joule / 1 Coulomb = (kg·m²/s²) / (A·s) = kg·m²·s⁻³·A⁻¹.",
    misconception: "Beda potensial adalah energi per satuan muatan.",
    competency: "Satuan Potensial Listrik",
    levelReference: "Level 02: Unit Master"
  },

  // ==========================================
  // CATEGORY 3: DIMENSI BESARAN (10 Questions)
  // ==========================================
  {
    id: "ass_dim_01",
    category: "Dimensi",
    difficulty: "easy",
    question: "Manakah dimensi yang TEPAT untuk besaran KECEPATAN?",
    options: [
      { id: "A", text: "[L]" },
      { id: "B", text: "[T]⁻¹" },
      { id: "C", text: "[L][T]⁻¹" },
      { id: "D", text: "[L][T]⁻²" }
    ],
    correctAnswer: "C",
    explanation: "v = s/t -> [L] / [T] = [L][T]⁻¹.",
    misconception: "[L][T]⁻² adalah dimensi percepatan.",
    competency: "Dimensi Kecepatan",
    levelReference: "Level 03: SI Explorer"
  },
  {
    id: "ass_dim_02",
    category: "Dimensi",
    difficulty: "easy",
    question: "Manakah dimensi yang TEPAT untuk besaran GAYA (F = m · a)?",
    options: [
      { id: "A", text: "[M][L][T]⁻²" },
      { id: "B", text: "[M][L]²[T]⁻²" },
      { id: "C", text: "[M][L]⁻¹[T]⁻²" },
      { id: "D", text: "[M][L][T]⁻¹" }
    ],
    correctAnswer: "A",
    explanation: "F = m·a -> [M] × [L][T]⁻² = [M][L][T]⁻².",
    misconception: "[M][L]²[T]⁻² adalah Energi.",
    competency: "Dimensi Gaya",
    levelReference: "Level 03: SI Explorer"
  },
  {
    id: "ass_dim_03",
    category: "Dimensi",
    difficulty: "easy",
    question: "Apakah simbol dimensi resmi Sistem Internasional untuk INTENSITAS CAHAYA?",
    options: [
      { id: "A", text: "[I]" },
      { id: "B", text: "[J]" },
      { id: "C", text: "cd" },
      { id: "D", text: "Joule" }
    ],
    correctAnswer: "B",
    explanation: "[J] dengan kurung siku adalah simbol dimensi resmi untuk Intensitas Cahaya.",
    misconception: "Huruf J tanpa kurung siku adalah Joule (satuan energi), sedangkan [J] adalah simbol dimensi intensitas cahaya.",
    competency: "Simbol Dimensi Intensitas Cahaya",
    levelReference: "Level 03: SI Explorer"
  },
  {
    id: "ass_dim_04",
    category: "Dimensi",
    difficulty: "medium",
    question: "Manakah dimensi yang TEPAT untuk USAHA dan ENERGI?",
    options: [
      { id: "A", text: "[M][L][T]⁻²" },
      { id: "B", text: "[M][L]²[T]⁻²" },
      { id: "C", text: "[M][L]²[T]⁻³" },
      { id: "D", text: "[M][L]⁻¹[T]⁻²" }
    ],
    correctAnswer: "B",
    explanation: "Usaha W = F·s -> ([M][L][T]⁻²) × [L] = [M][L]²[T]⁻².",
    misconception: "Energi Kinetik, Potensial, dan Usaha berdimensi sama.",
    competency: "Dimensi Energi",
    levelReference: "Level 03: SI Explorer"
  },
  {
    id: "ass_dim_05",
    category: "Dimensi",
    difficulty: "medium",
    question: "Manakah dimensi yang TEPAT untuk DAYA (P = W / t)?",
    options: [
      { id: "A", text: "[M][L]²[T]⁻²" },
      { id: "B", text: "[M][L][T]⁻²" },
      { id: "C", text: "[M][L]²[T]⁻³" },
      { id: "D", text: "[M][L]⁻¹[T]⁻²" }
    ],
    correctAnswer: "C",
    explanation: "P = W/t -> ([M][L]²[T]⁻²) / [T] = [M][L]²[T]⁻³.",
    misconception: "Pangkat [T] menjadi -3 karena energi dibagi waktu.",
    competency: "Dimensi Daya",
    levelReference: "Level 03: SI Explorer"
  },
  {
    id: "ass_dim_06",
    category: "Dimensi",
    difficulty: "medium",
    question: "Manakah dimensi yang TEPAT untuk TEKANAN (p = F / A)?",
    options: [
      { id: "A", text: "[M][L]⁻¹[T]⁻²" },
      { id: "B", text: "[M][L]²[T]⁻²" },
      { id: "C", text: "[M][L]⁻³" },
      { id: "D", text: "[M][L][T]⁻²" }
    ],
    correctAnswer: "A",
    explanation: "p = F/A -> ([M][L][T]⁻²) / [L]² = [M][L]⁻¹[T]⁻².",
    misconception: "[L] dibagi [L]² menghasilkan [L]⁻¹.",
    competency: "Dimensi Tekanan",
    levelReference: "Level 03: SI Explorer"
  },
  {
    id: "ass_dim_07",
    category: "Dimensi",
    difficulty: "hard",
    question: "Manakah dimensi yang TEPAT untuk MOMENTUM dan IMPULS?",
    options: [
      { id: "A", text: "[M][L][T]⁻²" },
      { id: "B", text: "[M][L][T]⁻¹" },
      { id: "C", text: "[M][L]²[T]⁻¹" },
      { id: "D", text: "[L][T]⁻¹" }
    ],
    correctAnswer: "B",
    explanation: "Momentum p = m·v -> [M][L][T]⁻¹. Impuls I = F·t -> [M][L][T]⁻² × [T] = [M][L][T]⁻¹.",
      misconception: "Momentum dan impuls berdimensi identik.",
    competency: "Dimensi Momentum & Impuls",
    levelReference: "Level 03: SI Explorer"
  },
  {
    id: "ass_dim_08",
    category: "Dimensi",
    difficulty: "hard",
    question: "Manakah dimensi yang TEPAT untuk KONSTANTA PEGAS k (F = k · x)?",
    options: [
      { id: "A", text: "[M][L][T]⁻²" },
      { id: "B", text: "[M][T]⁻²" },
      { id: "C", text: "[M][L]²[T]⁻²" },
      { id: "D", text: "[M][L]⁻¹[T]⁻²" }
    ],
    correctAnswer: "B",
    explanation: "k = F/x -> ([M][L][T]⁻²) / [L] = [M][T]⁻².",
    misconception: "Panjang di pembilang dan penyebut saling menghilangkan.",
    competency: "Dimensi Konstanta Pegas",
    levelReference: "Level 03: SI Explorer"
  },
  {
    id: "ass_dim_09",
    category: "Dimensi",
    difficulty: "hard",
    question: "Manakah dimensi yang TEPAT untuk FREKUENSI (f = 1 / T)?",
    options: [
      { id: "A", text: "[T]" },
      { id: "B", text: "[T]⁻¹" },
      { id: "C", text: "[L][T]⁻¹" },
      { id: "D", text: "[T]⁻²" }
    ],
    correctAnswer: "B",
    explanation: "f = 1/T -> 1 / [T] = [T]⁻¹.",
    misconception: "Frekuensi adalah kebalikan dari periode waktu.",
    competency: "Dimensi Frekuensi",
    levelReference: "Level 03: SI Explorer"
  },
  {
    id: "ass_dim_10",
    category: "Dimensi",
    difficulty: "hard",
    question: "Manakah dimensi yang TEPAT untuk BEDA POTENSIAL LISTRIK (V = W / Q)?",
    options: [
      { id: "A", text: "[M][L]²[T]⁻³[I]⁻¹" },
      { id: "B", text: "[M][L]²[T]⁻²" },
      { id: "C", text: "[I][T]" },
      { id: "D", text: "[M][L]²[T]⁻³" }
    ],
    correctAnswer: "A",
    explanation: "V = W/Q -> ([M][L]²[T]⁻²) / ([I][T]) = [M][L]²[T]⁻³[I]⁻¹.",
    misconception: "Beda potensial adalah energi per satuan muatan.",
    competency: "Dimensi Tegangan Listrik",
    levelReference: "Level 03: SI Explorer"
  },

  // ==========================================
  // CATEGORY 4: ANALISIS DIMENSIONAL (10 Questions)
  // ==========================================
  {
    id: "ass_ana_01",
    category: "Analisis Dimensional",
    difficulty: "easy",
    question: "Apakah kegunaan utama dari analisis dimensi dalam Fisika?",
    options: [
      { id: "A", text: "Menentukan nilai angka konstanta tanpa dimensi." },
      { id: "B", text: "Memeriksa kesetaraan fisis dan mendeteksi kesalahan rumus/persamaan." },
      { id: "C", text: "Menghitung hasil perkalian variabel secara otomatis." },
      { id: "D", text: "Menggantikan penggunaan alat ukur." }
    ],
    correctAnswer: "B",
    explanation: "Analisis dimensi digunakan untuk menguji konsistensi fisis dan menemukan kesalahan rumus.",
    misconception: "Analisis dimensi tidak dapat menentukan angka skalar tak berdimensi.",
    competency: "Fungsi Analisis Dimensi",
    levelReference: "Level 03 & Level 04"
  },
  {
    id: "ass_ana_02",
    category: "Analisis Dimensional",
    difficulty: "easy",
    question: "Dua suku dalam persamaan fisika dapat dijumlahkan atau dikurangkan hanya jika...",
    options: [
      { id: "A", text: "Memiliki nilai angka yang sama." },
      { id: "B", text: "Memiliki DIMENSI yang persis sama." },
      { id: "C", text: "Salah satu suku bernilai nol." },
      { id: "D", text: "Keduanya merupakan besaran pokok." }
    ],
    correctAnswer: "B",
    explanation: "Aturan Penjumlahan Dimensi: Suku-suku yang dijumlahkan/dikurangkan harus berdimensi sama.",
    misconception: "Besaran dengan dimensi berbeda tidak boleh dijumlahkan.",
    competency: "Aturan Penjumlahan Dimensi",
    levelReference: "Level 03 & Level 04"
  },
  {
    id: "ass_ana_03",
    category: "Analisis Dimensional",
    difficulty: "medium",
    question: "Manakah pernyataan yang BENAR mengenai urutan faktor dimensi?",
    options: [
      { id: "A", text: "[L][M][T]⁻² berbeda makna dengan [M][L][T]⁻²" },
      { id: "B", text: "[L][M][T]⁻² EKUIVALEN dengan [M][L][T]⁻² karena perkalian faktor bersifat komutatif." },
      { id: "C", text: "Urutan penulisan dimensi harus selalu dimulai dari [T]." },
      { id: "D", text: "Eksponen 0 wajib dituliskan dalam kurung siku." }
    ],
    correctAnswer: "B",
    explanation: "Perkalian faktor dimensi bersifat komutatif ([L][M][T]⁻² ≡ [M][L][T]⁻²).",
    misconception: "Urutan penulisan tidak mengubah bentuk fisis dimensi.",
    competency: "Komutatif Dimensi",
    levelReference: "Level 03 & Level 04"
  },
  {
    id: "ass_ana_04",
    category: "Analisis Dimensional",
    difficulty: "medium",
    question: "Persamaan s = v₀·t + ½ a·t². Suku v₀·t berdimensi [L], dan suku ½ a·t² berdimensi...",
    options: [
      { id: "A", text: "[L][T]⁻¹" },
      { id: "B", text: "[L]" },
      { id: "C", text: "[L]²" },
      { id: "D", text: "[L][T]" }
    ],
    correctAnswer: "B",
    explanation: "½ a·t² -> [L][T]⁻² × [T]² = [L]. Semua suku berdimensi [L].",
    misconception: "Kedua suku berdimensi panjang [L].",
    competency: "Analisis Suku Persamaan GLBB",
    levelReference: "Level 03 & Level 04"
  },
  {
    id: "ass_ana_05",
    category: "Analisis Dimensional",
    difficulty: "medium",
    question: "Suatu persamaan v = √(2 g h). Berapakah dimensi dari hasil akar kuadrat √(2 g h)?",
    options: [
      { id: "A", text: "[L][T]⁻²" },
      { id: "B", text: "[L]²[T]⁻²" },
      { id: "C", text: "[L][T]⁻¹" },
      { id: "D", text: "[L]²" }
    ],
    correctAnswer: "C",
    explanation: "2gh -> [L][T]⁻² × [L] = [L]²[T]⁻². Diakarkan menjadi [L][T]⁻¹.",
    misconception: "Operasi akar kuadrat juga mengakar pangkat dimensi.",
    competency: "Akar Kuadrat Dimensi",
    levelReference: "Level 03 & Level 04"
  },
  {
    id: "ass_ana_06",
    category: "Analisis Dimensional",
    difficulty: "hard",
    question: "Jika persamaan Q = k · m^a · v^b menggambarkan Energi Kinetik, berapa nilai a dan b?",
    options: [
      { id: "A", text: "a = 1, b = 2" },
      { id: "B", text: "a = 1, b = 1" },
      { id: "C", text: "a = 2, b = 1" },
      { id: "D", text: "a = 1, b = -1" }
    ],
    correctAnswer: "A",
    explanation: "[Q] = [M][L]²[T]⁻². [m]^a ([L][T]⁻¹)^b = [M]^a [L]^b [T]^-b. Maka a=1, b=2.",
    misconception: "Pangkat kecepatan adalah 2 pada energi kinetik.",
    competency: "Penentuan Eksponen Persamaan",
    levelReference: "Level 05: Dimension Boss"
  },
  {
    id: "ass_ana_07",
    category: "Analisis Dimensional",
    difficulty: "hard",
    question: "Persamaan Gaya Sentripetal F = m v² / r. Apakah dimensi suku kanan m v² / r?",
    options: [
      { id: "A", text: "[M][L][T]⁻²" },
      { id: "B", text: "[M][L]²[T]⁻²" },
      { id: "C", text: "[M][T]⁻²" },
      { id: "D", text: "[M][L]⁻¹[T]⁻²" }
    ],
    correctAnswer: "A",
    explanation: "[m v² / r] = ([M] × [L]²[T]⁻²) / [L] = [M][L][T]⁻² (sama dengan dimensi Gaya).",
    misconception: "Gaya sentripetal konsisten secara dimensional.",
    competency: "Analisis Gaya Sentripetal",
    levelReference: "Level 05: Dimension Boss"
  },
  {
    id: "ass_ana_08",
    category: "Analisis Dimensional",
    difficulty: "hard",
    question: "Manakah di antara keterbatasan analisis dimensi berikut yang BENAR?",
    options: [
      { id: "A", text: "Tidak dapat membedakan besaran yang memiliki dimensi sama (misal Energi dan Momen Gaya)." },
      { id: "B", text: "Tidak dapat digunakan untuk besaran turunan." },
      { id: "C", text: "Tidak dapat menguji persamaan GLBB." },
      { id: "D", text: "Hanya berlaku untuk besaran skalar." }
    ],
    correctAnswer: "A",
    explanation: "Dua besaran fisis berbeda dapat memiliki dimensi identik sehingga analisis dimensi tidak dapat membedakan keduanya secara fisis.",
    misconception: "Keterbatasan analisis dimensi adalah tidak membedakan besaran berdimensi identik.",
    competency: "Keterbatasan Analisis Dimensi",
    levelReference: "Level 05: Dimension Boss"
  },
  {
    id: "ass_ana_09",
    category: "Analisis Dimensional",
    difficulty: "hard",
    question: "Persamaan getaran pegas T = 2π √(m/k). Apakah dimensi ruas kanan 2π √(m/k)?",
    options: [
      { id: "A", text: "[T]" },
      { id: "B", text: "[T]⁻¹" },
      { id: "C", text: "[M][T]" },
      { id: "D", text: "[L][T]" }
    ],
    correctAnswer: "A",
    explanation: "m/k -> [M] / ([M][T]⁻²) = [T]². Diakarkan menjadi [T], sama dengan dimensi Periode T.",
    misconception: "Periode ayunan pegas konsisten secara dimensional.",
    competency: "Analisis Periode Pegas",
    levelReference: "Level 05: Dimension Boss"
  },
  {
    id: "ass_ana_10",
    category: "Analisis Dimensional",
    difficulty: "hard",
    question: "Apakah dimensi hasil dari eksponen berpangkat nol (misal [T]⁰)?",
    options: [
      { id: "A", text: "[T]" },
      { id: "B", text: "Tak Berdimensi (1)" },
      { id: "C", text: "Nol (0)" },
      { id: "D", text: "[L]" }
    ],
    correctAnswer: "B",
    explanation: "Setiap faktor berpangkat nol bernilai 1 (tak berdimensi) dan diabaikan dari penulisan eksponen map.",
    misconception: "Eksponen 0 berarti faktor tersebut tak berdimensi.",
    competency: "Normalisasi Eksponen Nol",
    levelReference: "Level 03 & Level 05"
  },

  // ==========================================
  // CATEGORY 5: KONSISTENSI PERSAMAAN (10 Questions)
  // ==========================================
  {
    id: "ass_per_01",
    category: "Persamaan",
    difficulty: "easy",
    question: "Persamaan s = v · t. Apakah persamaan ini VALID secara dimensional?",
    options: [
      { id: "A", text: "VALID ([L] = [L])" },
      { id: "B", text: "INVALID ([L] ≠ [L][T])" },
      { id: "C", text: "INVALID ([L] ≠ [T])" },
      { id: "D", text: "VALID HANYA JIKA v = 0" }
    ],
    correctAnswer: "A",
    explanation: "[s] = [L], [v·t] = [L][T]⁻¹ × [T] = [L]. VALID!",
    misconception: "s = v·t adalah persamaan valid.",
    competency: "Deteksi Validitas GLB",
    levelReference: "Level 04: Dimension Detective"
  },
  {
    id: "ass_per_02",
    category: "Persamaan",
    difficulty: "easy",
    question: "Persamaan s = v · t². Apakah persamaan ini VALID secara dimensional?",
    options: [
      { id: "A", text: "VALID" },
      { id: "B", text: "INVALID ([L] ≠ [L][T])" },
      { id: "C", text: "VALID HANYA JIKA t = 1" },
      { id: "D", text: "INVALID ([L] ≠ [M])" }
    ],
    correctAnswer: "B",
    explanation: "[s] = [L], [v·t²] = [L][T]⁻¹ × [T]² = [L][T]. Karena [L] ≠ [L][T], maka INVALID!",
    misconception: "s = v·t² salah secara dimensional.",
    competency: "Deteksi Kesalahan GLB",
    levelReference: "Level 04: Dimension Detective"
  },
  {
    id: "ass_per_03",
    category: "Persamaan",
    difficulty: "medium",
    question: "Persamaan F = m · v. Apakah persamaan ini VALID secara dimensional?",
    options: [
      { id: "A", text: "VALID" },
      { id: "B", text: "INVALID (Ruas kiri [M][L][T]⁻², ruas kanan [M][L][T]⁻¹)" },
      { id: "C", text: "VALID HANYA JIKA v = a" },
      { id: "D", text: "INVALID (Ruas kanan berdimensi Energi)" }
    ],
    correctAnswer: "B",
    explanation: "Ruas kanan m·v berdimensi momentum ([M][L][T]⁻¹), bukan gaya ([M][L][T]⁻²). INVALID!",
    misconception: "F = m·v adalah salah; yang benar F = m·a.",
    competency: "Deteksi Kesalahan Hukum Newton",
    levelReference: "Level 04: Dimension Detective"
  },
  {
    id: "ass_per_04",
    category: "Persamaan",
    difficulty: "medium",
    question: "Perbaiki persamaan yang rusak: s = v × ?",
    options: [
      { id: "A", text: "t (waktu)" },
      { id: "B", text: "t² (waktu kuadrat)" },
      { id: "C", text: "a (percepatan)" },
      { id: "D", text: "v (kecepatan)" }
    ],
    correctAnswer: "A",
    explanation: "[s] = [L]. [v] = [L][T]⁻¹. Maka pengali harus t ([T]) agar [L][T]⁻¹ × [T] = [L].",
    misconception: "Pengali pelengkap adalah waktu t.",
    competency: "Perbaikan Persamaan s = vt",
    levelReference: "Level 04: Dimension Detective"
  },
  {
    id: "ass_per_05",
    category: "Persamaan",
    difficulty: "medium",
    question: "Perbaiki persamaan yang rusak: F = m × ?",
    options: [
      { id: "A", text: "v (kecepatan)" },
      { id: "B", text: "a (percepatan)" },
      { id: "C", text: "s (jarak)" },
      { id: "D", text: "t (waktu)" }
    ],
    correctAnswer: "B",
    explanation: "[F] = [M][L][T]⁻², [m] = [M]. Maka pengali harus a ([L][T]⁻²).",
    misconception: "Hukum Newton 2 F = m·a.",
    competency: "Perbaikan Persamaan Gaya",
    levelReference: "Level 04: Dimension Detective"
  },
  {
    id: "ass_per_06",
    category: "Persamaan",
    difficulty: "hard",
    question: "Perbaiki persamaan yang rusak: P = W / ?",
    options: [
      { id: "A", text: "t (waktu)" },
      { id: "B", text: "s (jarak)" },
      { id: "C", text: "m (massa)" },
      { id: "D", text: "v (kecepatan)" }
    ],
    correctAnswer: "A",
    explanation: "[P] = [M][L]²[T]⁻³, [W] = [M][L]²[T]⁻². Maka penyebut harus t ([T]).",
    misconception: "Daya P = Usaha / waktu.",
    competency: "Perbaikan Persamaan Daya",
    levelReference: "Level 04: Dimension Detective"
  },
  {
    id: "ass_per_07",
    category: "Persamaan",
    difficulty: "hard",
    question: "Persamaan v² = v₀² + 2 a · ?. Variabel pelengkap pada suku 2 a · ? adalah...",
    options: [
      { id: "A", text: "t (waktu)" },
      { id: "B", text: "s (perpindahan/jarak)" },
      { id: "C", text: "v (kecepatan)" },
      { id: "D", text: "m (massa)" }
    ],
    correctAnswer: "B",
    explanation: "[v²] = [L]²[T]⁻², [2a] = [L][T]⁻². Pengali harus s ([L]) agar 2as berdimensi [L]²[T]⁻².",
    misconception: "Persamaan GLBB ketiga v² = v₀² + 2as.",
    competency: "Perbaikan GLBB v²",
    levelReference: "Level 04 & Level 05"
  },
  {
    id: "ass_per_08",
    category: "Persamaan",
    difficulty: "hard",
    question: "Persamaan Tekanan Hidrostatis p = ρ · g · h. Apakah persamaan ini VALID?",
    options: [
      { id: "A", text: "VALID (Ruas kiri dan kanan berdimensi [M][L]⁻¹[T]⁻²)" },
      { id: "B", text: "INVALID" },
      { id: "C", text: "VALID HANYA JIKA ρ = 1" },
      { id: "D", text: "INVALID ([p] = [M][L]⁻³)" }
    ],
    correctAnswer: "A",
    explanation: "[ρgh] = [M][L]⁻³ × [L][T]⁻² × [L] = [M][L]⁻¹[T]⁻², sama dengan [p]. VALID!",
    misconception: "p = ρgh sah secara dimensional.",
    competency: "Deteksi Tekanan Hidrostatis",
    levelReference: "Level 04 & Level 05"
  },
  {
    id: "ass_per_09",
    category: "Persamaan",
    difficulty: "hard",
    question: "Perbaiki persamaan yang rusak: W = F · ?",
    options: [
      { id: "A", text: "s (perpindahan)" },
      { id: "B", text: "t (waktu)" },
      { id: "C", text: "v (kecepatan)" },
      { id: "D", text: "a (percepatan)" }
    ],
    correctAnswer: "A",
    explanation: "[W] = [M][L]²[T]⁻², [F] = [M][L][T]⁻². Pengali harus s ([L]).",
    misconception: "Usaha W = Gaya × Perpindahan.",
    competency: "Perbaikan Persamaan Usaha",
    levelReference: "Level 04: Dimension Detective"
  },
  {
    id: "ass_per_10",
    category: "Persamaan",
    difficulty: "hard",
    question: "Persamaan Gelombang Cepat Rambat: v = λ · f. Apakah VALID secara dimensional?",
    options: [
      { id: "A", text: "VALID ([v] = [L][T]⁻¹, [λf] = [L][T]⁻¹)" },
      { id: "B", text: "INVALID" },
      { id: "C", text: "VALID HANYA UNTUK GELOMBANG BUNYI" },
      { id: "D", text: "INVALID ([v] = [T]⁻¹)" }
    ],
    correctAnswer: "A",
    explanation: "[λ] = [L], [f] = [T]⁻¹. Maka [λf] = [L][T]⁻¹, sama dengan kecepatan. VALID!",
    misconception: "v = λf sah secara dimensional.",
    competency: "Deteksi Persamaan Gelombang",
    levelReference: "Level 04 & Level 05"
  },

  // ==========================================
  // CATEGORY 6: MIXED MASTERY & REASONING (10 Questions)
  // ==========================================
  {
    id: "ass_mix_01",
    category: "Mixed Mastery",
    difficulty: "easy",
    question: "Manakah urutan hierarki konsep Fisika yang BENAR?",
    options: [
      { id: "A", text: "BESARAN -> SATUAN -> DIMENSI -> ANALISIS DIMENSIONAL" },
      { id: "B", text: "SATUAN -> BESARAN -> DIMENSI -> PERSAMAAN" },
      { id: "C", text: "DIMENSI -> BESARAN -> SATUAN -> SKALARA" },
      { id: "D", text: "ANALISIS DIMENSIONAL -> SATUAN -> BESARAN" }
    ],
    correctAnswer: "A",
    explanation: "Progresi Pembelajaran: Memahami Besaran dulu, menentukan Satuan baku, menurunkan Dimensi, lalu melakukan Analisis Dimensional.",
    misconception: "Hierarki konsep Fisika bergerak dari Besaran ke Analisis Dimensi.",
    competency: "Hierarki Pembelajaran Fisika",
    levelReference: "FIVIA Quest Overall Progression"
  },
  {
    id: "ass_mix_02",
    category: "Mixed Mastery",
    difficulty: "easy",
    question: "Seorang siswa mengukur massa 5 kg dan jarak 10 m. Manakah besaran POKOK yang diukur?",
    options: [
      { id: "A", text: "Massa dan Jarak (Panjang)" },
      { id: "B", text: "Kecepatan dan Gaya" },
      { id: "C", text: "Massa saja" },
      { id: "D", text: "Jarak saja" }
    ],
    correctAnswer: "A",
    explanation: "Massa (kg) dan Jarak/Panjang (m) keduanya adalah Besaran Pokok.",
    misconception: "Jarak merupakan dimensi Panjang [L].",
    competency: "Penerapan Besaran Pokok",
    levelReference: "FIVIA Quest Overall Progression"
  },
  {
    id: "ass_mix_03",
    category: "Mixed Mastery",
    difficulty: "medium",
    question: "Mengapa persamaaan v = a · t² salah, sedangkan s = ½ a · t² benar?",
    options: [
      { id: "A", text: "Karena v adalah kecepatan [L][T]⁻¹, sedangkan a·t² berdimensi panjang [L]." },
      { id: "B", text: "Karena tidak ada angka ½ pada rumus v." },
      { id: "C", text: "Karena percepatan selalu bernilai negatif." },
      { id: "D", text: "Karena t² hanya boleh digunakan untuk perpindahan." }
    ],
    correctAnswer: "A",
    explanation: "a·t² berdimensi [L][T]⁻² × [T]² = [L] (Panjang). Kecepatan v berdimensi [L][T]⁻¹. Secara dimensional v ≠ a·t².",
    misconception: "Alasan ketidakvalidan disebabkan oleh pertentangan dimensi.",
    competency: "Penjelasan Penalaran Fisika",
    levelReference: "Level 04 & Level 05"
  },
  {
    id: "ass_mix_04",
    category: "Mixed Mastery",
    difficulty: "medium",
    question: "Seseorang mengklaim bahwa 1 Newton sama dengan 1 Joule. Apakah klaim tersebut BENAR?",
    options: [
      { id: "A", text: "SALAH (Newton adalah satuan Gaya [M][L][T]⁻², Joule adalah satuan Energi [M][L]²[T]⁻²)" },
      { id: "B", text: "BENAR (Keduanya adalah satuan turunan SI)" },
      { id: "C", text: "BENAR JIKA jaraknya 1 meter" },
      { id: "D", text: "SALAH (Newton adalah besaran pokok)" }
    ],
    correctAnswer: "A",
    explanation: "Newton (kg·m/s²) dan Joule (kg·m²/s²) memiliki dimensi yang berbeda, sehingga keduanya tidak ekuivalen.",
    misconception: "Newton dan Joule adalah dua satuan turunan dengan dimensi berbeda.",
    competency: "Diferensiasi Satuan & Dimensi",
    levelReference: "Level 02 & Level 03"
  },
  {
    id: "ass_mix_05",
    category: "Mixed Mastery",
    difficulty: "medium",
    question: "Dua mobil bergerak dengan kecepatan 20 m/s dan 72 km/jam. Manakah yang bergerak lebih cepat?",
    options: [
      { id: "A", text: "Mobil pertama (20 m/s)" },
      { id: "B", text: "Mobil kedua (72 km/jam)" },
      { id: "C", text: "Keduanya bergerak dengan KECEPATAN SAMA (20 m/s = 72 km/jam)" },
      { id: "D", text: "Tidak dapat dibandingkan" }
    ],
    correctAnswer: "C",
    explanation: "72 km/jam = (72 × 1000 m)/3600 s = 20 m/s. Kecepatan keduanya persis sama.",
    misconception: "Nilai angka berbeda dapat menunjukkan nilai fisis sama jika satuannya berbeda.",
    competency: "Perbandingan Konversi Satuan",
    levelReference: "Level 02: Unit Master"
  },
  {
    id: "ass_mix_06",
    category: "Mixed Mastery",
    difficulty: "hard",
    question: "Mengapa angka konstanta seperti ½ pada Ek = ½ m v² tidak memiliki dimensi?",
    options: [
      { id: "A", text: "Karena konstanta skalar murni adalah perbandingan angka tanpa nilai satuan fisis." },
      { id: "B", text: "Karena nilainya sangat kecil." },
      { id: "C", text: "Karena angka ½ dapat diubah menjadi 1." },
      { id: "D", text: "Karena ½ merupakan besaran pokok." }
    ],
    correctAnswer: "A",
    explanation: "Konstanta skalar murni (seperti ½, 2, π) merupakan rasio/faktor pengali numerik tanpa variabel fisis.",
    misconception: "Konstanta numerik murni bernilai tak berdimensi (1).",
    competency: "Konsep Skalar Tak Berdimensi",
    levelReference: "Level 03 & Level 05"
  },
  {
    id: "ass_mix_07",
    category: "Mixed Mastery",
    difficulty: "hard",
    question: "Jika besaran A berdimensi [M][L][T]⁻² dan B berdimensi [L], maka A × B berdimensi...",
    options: [
      { id: "A", text: "[M][L]²[T]⁻² (Dimensi Energi / Usaha)" },
      { id: "B", text: "[M][T]⁻²" },
      { id: "C", text: "[M][L][T]⁻¹" },
      { id: "D", text: "[M][L]²[T]⁻³" }
    ],
    correctAnswer: "A",
    explanation: "[A] × [B] = [M][L][T]⁻² × [L] = [M][L]²[T]⁻² (Energi).",
    misconception: "Perkalian gaya dengan jarak menghasilkan dimensi energi.",
    competency: "Perkalian Variabel Dimensi",
    levelReference: "Level 03 & Level 04"
  },
  {
    id: "ass_mix_08",
    category: "Mixed Mastery",
    difficulty: "hard",
    question: "Manakah pasangan besaran berikut yang dapat DIJUMLAHKAN secara langsung?",
    options: [
      { id: "A", text: "Gaya (10 N) dan Usaha (10 J)" },
      { id: "B", text: "Energi Kinetik (50 J) dan Energi Potensial (30 J)" },
      { id: "C", text: "Kecepatan (20 m/s) dan Percepatan (5 m/s²)" },
      { id: "D", text: "Massa (5 kg) dan Volume (2 m³)" }
    ],
    correctAnswer: "B",
    explanation: "Energi Kinetik dan Energi Potensial keduanya berdimensi [M][L]²[T]⁻² (Joule), sehingga dapat dijumlahkan secara langsung menjadi Energi Mekanik.",
    misconception: "Hanya besaran berdimensi sama yang dapat dijumlahkan.",
    competency: "Penerapan Penjumlahan Dimensi",
    levelReference: "Level 03 & Level 05"
  },
  {
    id: "ass_mix_09",
    category: "Mixed Mastery",
    difficulty: "hard",
    question: "Suatu persamaan p = F / A. Jika Gaya F diperbesar 2 kali dan Luas A diperbesar 2 kali, bagaimana dimensi tekanan p?",
    options: [
      { id: "A", text: "Dimensi p TETAP [M][L]⁻¹[T]⁻² (Dimensi tidak dipengaruhi nilai numerik variabel)" },
      { id: "B", text: "Dimensi p menjadi 2 kali lipat" },
      { id: "C", text: "Dimensi p menjadi setengahnya" },
      { id: "D", text: "Dimensi p berubah menjadi [M][L]²[T]⁻²" }
    ],
    correctAnswer: "A",
    explanation: "Dimensi suatu besaran bersifat intrinsik dan TIDAK BERUBAH meskipun nilai numerik atau besar variabelnya diubah.",
    misconception: "Perubahan nilai angka variabel tidak mengubah sifat dimensi fisiknya.",
    competency: "Sifat Intrinsik Dimensi",
    levelReference: "Level 03 & Level 05"
  },
  {
    id: "ass_mix_10",
    category: "Mixed Mastery",
    difficulty: "hard",
    question: "Manakah kesimpulan AKHIR yang Paling Tepat dari penguasaan FIVIA Physics Quest?",
    options: [
      { id: "A", text: "Memahami Besaran, Satuan, dan Dimensi memungkinkan kita memverifikasi kebenaran hukum-hukum Fisika dan mencegah kesalahan formula." },
      { id: "B", text: "Fisika hanya mempelajari hafalan rumus tanpa perlu analisis dimensi." },
      { id: "C", text: "Semua besaran turunan dapat diukur langsung tanpa alat ukur." },
      { id: "D", text: "Satuan SI tidak berpengaruh pada hasil perhitungan ilmiah." }
    ],
    correctAnswer: "A",
    explanation: "Penguasaan Besaran, Satuan, dan Dimensi adalah fondasi utama memvalidasi kebenaran hukum Fisika dan analisis dimensional.",
    misconception: "Tujuan akhir pembelajaran Fisika adalah analisis ilmiah yang terstruktur.",
    competency: "Sintesis Penguasaan Fisika",
    levelReference: "FIVIA Quest Final Mastery"
  }
];
