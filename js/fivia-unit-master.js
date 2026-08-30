/**
 * FIVIA PHYSICS QUEST - LEVEL 02: UNIT MASTER (PHASE 3B)
 * Theme: "The Unit Crisis"
 * 40 Scientifically Validated Challenges across 5 Missions
 */

window.FIVIAQuestUnitMaster = (function() {
  'use strict';

  // 40 Scientifically Validated Challenges
  const UNIT_MASTER_DATA = [
    // ==========================================
    // MISSION 01: UNIT MATCH (8 Challenges)
    // ==========================================
    {
      id: "um_m01_1",
      mission: 1,
      type: "match",
      difficulty: "easy",
      question: "Pasangkan Besaran Pokok berikut dengan Satuan SI yang Tepat",
      quantity: "Panjang",
      correctAnswer: "m",
      options: [
        { id: "m", label: "meter (m)" },
        { id: "kg", label: "kilogram (kg)" },
        { id: "s", label: "sekon (s)" },
        { id: "K", label: "kelvin (K)" }
      ],
      explanation: "Meter (m) merupakan satuan standar internasional (SI) untuk mengukur Panjang.",
      misconception: "Centimeter (cm) sering digunakan sehari-hari, namun meter (m) adalah satuan dasar SI."
    },
    {
      id: "um_m01_2",
      mission: 1,
      type: "match",
      difficulty: "easy",
      question: "Pasangkan Besaran Pokok berikut dengan Satuan SI yang Tepat",
      quantity: "Massa",
      correctAnswer: "kg",
      options: [
        { id: "kg", label: "kilogram (kg)" },
        { id: "g", label: "gram (g)" },
        { id: "N", label: "newton (N)" },
        { id: "J", label: "joule (J)" }
      ],
      explanation: "Kilogram (kg) adalah satu-satunya satuan pokok SI yang menggunakan awalan (kilo-).",
      misconception: "Gram (g) merupakan satuan dalam sistem cgs, tetapi kilogram (kg) adalah satuan pokok SI."
    },
    {
      id: "um_m01_3",
      mission: 1,
      type: "match",
      difficulty: "easy",
      question: "Pasangkan Besaran Pokok berikut dengan Satuan SI yang Tepat",
      quantity: "Waktu",
      correctAnswer: "s",
      options: [
        { id: "s", label: "sekon (s)" },
        { id: "jam", label: "jam (h)" },
        { id: "menit", label: "menit (min)" },
        { id: "Hz", label: "hertz (Hz)" }
      ],
      explanation: "Sekon/Detik (s) merupakan satuan pokok SI untuk interval Waktu.",
      misconception: "Jam dan menit adalah satuan waktu praktis, namun sekon (s) adalah satuan standar SI."
    },
    {
      id: "um_m01_4",
      mission: 1,
      type: "match",
      difficulty: "easy",
      question: "Pasangkan Besaran Pokok berikut dengan Satuan SI yang Tepat",
      quantity: "Suhu Termodinamik",
      correctAnswer: "K",
      options: [
        { id: "K", label: "kelvin (K)" },
        { id: "C", label: "celcius (°C)" },
        { id: "F", label: "fahrenheit (°F)" },
        { id: "J", label: "joule (J)" }
      ],
      explanation: "Kelvin (K) adalah satuan pokok SI untuk Suhu Termodinamik tanpa derajat (°).",
      misconception: "Celcius (°C) populer digunakan, namun kelvin (K) adalah satuan mutlak SI."
    },
    {
      id: "um_m01_5",
      mission: 1,
      type: "match",
      difficulty: "medium",
      question: "Pasangkan Besaran Pokok berikut dengan Satuan SI yang Tepat",
      quantity: "Kuat Arus Listrik",
      correctAnswer: "A",
      options: [
        { id: "A", label: "ampere (A)" },
        { id: "V", label: "volt (V)" },
        { id: "C", label: "coulomb (C)" },
        { id: "W", label: "watt (W)" }
      ],
      explanation: "Ampere (A) adalah satuan pokok SI untuk Kuat Arus Listrik.",
      misconception: "Volt (V) adalah satuan tegangan listrik, sedangkan ampere (A) adalah kuat arus."
    },
    {
      id: "um_m01_6",
      mission: 1,
      type: "match",
      difficulty: "medium",
      question: "Pasangkan Besaran Pokok berikut dengan Satuan SI yang Tepat",
      quantity: "Jumlah Zat",
      correctAnswer: "mol",
      options: [
        { id: "mol", label: "mol" },
        { id: "kg", label: "kilogram (kg)" },
        { id: "cd", label: "candela (cd)" },
        { id: "g", label: "gram (g)" }
      ],
      explanation: "Mol adalah satuan pokok SI untuk mengukur Jumlah Zat entitas elementer.",
      misconception: "Massa (kg) mengukur berat materi, sedangkan mol mengukur jumlah partikel."
    },
    {
      id: "um_m01_7",
      mission: 1,
      type: "match",
      difficulty: "medium",
      question: "Pasangkan Besaran Pokok berikut dengan Satuan SI yang Tepat",
      quantity: "Intensitas Cahaya",
      correctAnswer: "cd",
      options: [
        { id: "cd", label: "candela (cd)" },
        { id: "lux", label: "lux (lx)" },
        { id: "W", label: "watt (W)" },
        { id: "J", label: "joule (J)" }
      ],
      explanation: "Candela (cd) adalah satuan pokok SI untuk Intensitas Cahaya (dengan dimensi [J]).",
      misconception: "Simbol satuan intensitas cahaya adalah 'cd'. Huruf [J] adalah simbol dimensinya."
    },
    {
      id: "um_m01_8",
      mission: 1,
      type: "match",
      difficulty: "hard",
      question: "Pasangkan Besaran Turunan berikut dengan Satuan SI yang Tepat",
      quantity: "Gaya",
      correctAnswer: "N",
      options: [
        { id: "N", label: "newton (N)" },
        { id: "kg", label: "kilogram (kg)" },
        { id: "J", label: "joule (J)" },
        { id: "Pa", label: "pascal (Pa)" }
      ],
      explanation: "Newton (N = kg·m/s²) adalah satuan SI untuk Gaya.",
      misconception: "Massa ber-satuan kg, sedangkan Gaya (akibat gravitasi) ber-satuan Newton."
    },

    // ==========================================
    // MISSION 02: SI SCANNER (10 Challenges)
    // ==========================================
    {
      id: "um_m02_1",
      mission: 2,
      type: "scanner",
      difficulty: "easy",
      question: "Data sensor laboratorium FIVIA membaca: Massa spesimen meteorit = 4,2 ...",
      quantity: "Massa",
      correctAnswer: "B",
      options: [
        { id: "A", text: "meter (m)" },
        { id: "B", text: "kilogram (kg)" },
        { id: "C", text: "sekon (s)" },
        { id: "D", text: "newton (N)" }
      ],
      explanation: "Satuan dasar SI untuk Massa adalah kilogram (kg).",
      misconception: "Gram adalah satuan metrik, tetapi kilogram (kg) adalah satuan standar SI."
    },
    {
      id: "um_m02_2",
      mission: 2,
      type: "scanner",
      difficulty: "easy",
      question: "Data optik menunjukkan: Panjang gelombang sinar laser = 0,0005 ...",
      quantity: "Panjang",
      correctAnswer: "A",
      options: [
        { id: "A", text: "meter (m)" },
        { id: "B", text: "kelvin (K)" },
        { id: "C", text: "gram (g)" },
        { id: "D", text: "watt (W)" }
      ],
      explanation: "Satuan pokok SI untuk Panjang adalah meter (m).",
      misconception: "Meskipun sering menggunakan skala nanometer, satuan dasar SI tetap meter (m)."
    },
    {
      id: "um_m02_3",
      mission: 2,
      type: "scanner",
      difficulty: "easy",
      question: "Sensor termal mencatat: Suhu reaksi laboratorium = 310,15 ...",
      quantity: "Suhu Termodinamik",
      correctAnswer: "C",
      options: [
        { id: "A", text: "Celcius (°C)" },
        { id: "B", text: "Fahrenheit (°F)" },
        { id: "C", text: "kelvin (K)" },
        { id: "D", text: "joule (J)" }
      ],
      explanation: "Satuan mutlak SI untuk Suhu Termodinamik adalah kelvin (K).",
      misconception: "Suhu kelvin ditulis tanpa simbol derajat (K, bukan °K)."
    },
    {
      id: "um_m02_4",
      mission: 2,
      type: "scanner",
      difficulty: "medium",
      question: "Telemetri roket mendeteksi: Gaya dorong mesin utama = 15.000 ...",
      quantity: "Gaya",
      correctAnswer: "D",
      options: [
        { id: "A", text: "kilogram (kg)" },
        { id: "B", text: "joule (J)" },
        { id: "C", text: "pascal (Pa)" },
        { id: "D", text: "newton (N)" }
      ],
      explanation: "Satuan SI turunan untuk Gaya adalah newton (N = kg·m/s²).",
      misconception: "Gaya dorong dinyatakan dalam Newton, bukan kilogram."
    },
    {
      id: "um_m02_5",
      mission: 2,
      type: "scanner",
      difficulty: "medium",
      question: "Pengukur daya surya mencatat: Energi yang dihasilkan panel surya = 4.500 ...",
      quantity: "Energi",
      correctAnswer: "A",
      options: [
        { id: "A", text: "joule (J)" },
        { id: "B", text: "watt (W)" },
        { id: "C", text: "newton (N)" },
        { id: "D", text: "pascal (Pa)" }
      ],
      explanation: "Energi (Usaha) memiliki satuan SI joule (J = kg·m²/s²).",
      misconception: "Watt (W) adalah satuan Daya (Energi per detik), sedangkan Joule (J) adalah Energi."
    },
    {
      id: "um_m02_6",
      mission: 2,
      type: "scanner",
      difficulty: "medium",
      question: "Sensor fluida mendeteksi: Tekanan di dalam tangki gas = 101.325 ...",
      quantity: "Tekanan",
      correctAnswer: "B",
      options: [
        { id: "A", text: "joule (J)" },
        { id: "B", text: "pascal (Pa)" },
        { id: "C", text: "watt (W)" },
        { id: "D", text: "hertz (Hz)" }
      ],
      explanation: "Tekanan (p = F/A) ber-satuan pascal (Pa = N/m²).",
      misconception: "Atmosphere atau Bar adalah satuan tekanan praktis, pascal (Pa) adalah satuan SI."
    },
    {
      id: "um_m02_7",
      mission: 2,
      type: "scanner",
      difficulty: "medium",
      question: "Frekuensi getaran kristal kuarsa tercatat = 50 ...",
      quantity: "Frekuensi",
      correctAnswer: "C",
      options: [
        { id: "A", text: "sekon (s)" },
        { id: "B", text: "meter/sekon (m/s)" },
        { id: "C", text: "hertz (Hz)" },
        { id: "D", text: "ampere (A)" }
      ],
      explanation: "Frekuensi (banyaknya getaran per detik) ber-satuan hertz (Hz = 1/s).",
      misconception: "Sekon mengukur periode (waktu 1 getaran), sedangkan hertz mengukur frekuensi."
    },
    {
      id: "um_m02_8",
      mission: 2,
      type: "scanner",
      difficulty: "hard",
      question: "Multimeter digital mengukur: Beda potensial listrik baterai = 12 ...",
      quantity: "Tegangan Listrik",
      correctAnswer: "A",
      options: [
        { id: "A", text: "volt (V)" },
        { id: "B", text: "ampere (A)" },
        { id: "C", text: "coulomb (C)" },
        { id: "D", text: "watt (W)" }
      ],
      explanation: "Tegangan/Beda Potensial Listrik memiliki satuan SI volt (V).",
      misconception: "Ampere mengukur arus listrik, Volt mengukur beda potensial listrik."
    },
    {
      id: "um_m02_9",
      mission: 2,
      type: "scanner",
      difficulty: "hard",
      question: "Sensor hidrometer mencatat: Massa jenis sampel minyak = 800 ...",
      quantity: "Massa Jenis",
      correctAnswer: "D",
      options: [
        { id: "A", text: "kg" },
        { id: "B", text: "m³" },
        { id: "C", text: "N/m²" },
        { id: "D", text: "kg/m³" }
      ],
      explanation: "Massa Jenis (ρ = m/V) ber-satuan kg/m³ dalam SI.",
      misconception: "g/cm³ sering digunakan di kimia, tetapi kg/m³ adalah satuan baku SI."
    },
    {
      id: "um_m02_10",
      mission: 2,
      type: "scanner",
      difficulty: "hard",
      question: "Anemometer mencatat: Kecepatan angin badai = 25 ...",
      quantity: "Kecepatan",
      correctAnswer: "B",
      options: [
        { id: "A", text: "km/h" },
        { id: "B", text: "m/s" },
        { id: "C", text: "m/s²" },
        { id: "D", text: "kg·m/s" }
      ],
      explanation: "Kecepatan memiliki satuan standar SI meter per sekon (m/s).",
      misconception: "km/jam adalah satuan di speedometer, namun m/s adalah satuan standar SI."
    },

    // ==========================================
    // MISSION 03: UNIT SORTER (8 Challenges)
    // ==========================================
    {
      id: "um_m03_1",
      mission: 3,
      type: "sorter",
      difficulty: "easy",
      question: "Kelompokkan Satuan berikut ke kategori yang benar",
      unitItem: "m (meter)",
      correctCategory: "pokok",
      explanation: "Meter (m) adalah Satuan Pokok SI untuk mengukur besaran panjang.",
      misconception: "Meter tidak diturunkan dari satuan lain."
    },
    {
      id: "um_m03_2",
      mission: 3,
      type: "sorter",
      difficulty: "easy",
      question: "Kelompokkan Satuan berikut ke kategori yang benar",
      unitItem: "N (newton)",
      correctCategory: "turunan",
      explanation: "Newton (N) adalah Satuan Turunan karena N = kg·m/s² (kombinasi massa, panjang, waktu).",
      misconception: "Meskipun memiliki nama khusus, Newton adalah satuan turunan."
    },
    {
      id: "um_m03_3",
      mission: 3,
      type: "sorter",
      difficulty: "easy",
      question: "Kelompokkan Satuan berikut ke kategori yang benar",
      unitItem: "kg (kilogram)",
      correctCategory: "pokok",
      explanation: "Kilogram (kg) adalah Satuan Pokok SI untuk besaran massa.",
      misconception: "Gram bukan satuan pokok SI."
    },
    {
      id: "um_m03_4",
      mission: 3,
      type: "sorter",
      difficulty: "medium",
      question: "Kelompokkan Satuan berikut ke kategori yang benar",
      unitItem: "J (joule)",
      correctCategory: "turunan",
      explanation: "Joule (J) adalah Satuan Turunan untuk Energi karena J = N·m = kg·m²/s².",
      misconception: "Jangan tertukar antara satuan Joule (J) dengan simbol dimensi Intensitas Cahaya [J]."
    },
    {
      id: "um_m03_5",
      mission: 3,
      type: "sorter",
      difficulty: "medium",
      question: "Kelompokkan Satuan berikut ke kategori yang benar",
      unitItem: "A (ampere)",
      correctCategory: "pokok",
      explanation: "Ampere (A) adalah Satuan Pokok SI untuk kuat arus listrik.",
      misconception: "Ampere ditetapkan mandiri sebagai salah satu dari 7 satuan pokok."
    },
    {
      id: "um_m03_6",
      mission: 3,
      type: "sorter",
      difficulty: "medium",
      question: "Kelompokkan Satuan berikut ke kategori yang benar",
      unitItem: "m/s² (meter/sekon²)",
      correctCategory: "turunan",
      explanation: "m/s² adalah Satuan Turunan untuk percepatan (panjang dibagi waktu kuadrat).",
      misconception: "Satuan tanpa nama khusus seperti m/s² adalah satuan turunan."
    },
    {
      id: "um_m03_7",
      mission: 3,
      type: "sorter",
      difficulty: "hard",
      question: "Kelompokkan Satuan berikut ke kategori yang benar",
      unitItem: "cd (candela)",
      correctCategory: "pokok",
      explanation: "Candela (cd) adalah Satuan Pokok SI untuk intensitas cahaya.",
      misconception: "Candela adalah 1 dari 7 satuan pokok dasar SI."
    },
    {
      id: "um_m03_8",
      mission: 3,
      type: "sorter",
      difficulty: "hard",
      question: "Kelompokkan Satuan berikut ke kategori yang benar",
      unitItem: "Pa (pascal)",
      correctCategory: "turunan",
      explanation: "Pascal (Pa) adalah Satuan Turunan untuk tekanan (Pa = N/m² = kg/(m·s²)).",
      misconception: "Pascal diturunkan dari gaya per satuan luas."
    },

    // ==========================================
    // MISSION 04: UNIT CONVERTER (8 Challenges)
    // ==========================================
    {
      id: "um_m04_1",
      mission: 4,
      type: "converter",
      difficulty: "easy",
      question: "Konversikan 2,5 km menjadi satuan meter (m).",
      conversionPrompt: "2,5 km = ... m",
      correctNumeric: "2500",
      unitTarget: "m",
      explanation: "2,5 km = 2,5 × 1.000 = 2.500 m.",
      misconception: "1 km = 1.000 m (bukan 100 m)."
    },
    {
      id: "um_m04_2",
      mission: 4,
      type: "converter",
      difficulty: "easy",
      question: "Konversikan 72 km/jam menjadi satuan standar SI meter per sekon (m/s).",
      conversionPrompt: "72 km/h = ... m/s",
      correctNumeric: "20",
      unitTarget: "m/s",
      explanation: "72 km/h = 72 ÷ 3,6 = 20 m/s. (Langkah: 72 × 1.000 m / 3.600 s = 20 m/s).",
      misconception: "Untuk merubah km/jam ke m/s, bagilah nilai dengan 3,6."
    },
    {
      id: "um_m04_3",
      mission: 4,
      type: "converter",
      difficulty: "easy",
      question: "Konversikan 5 m/s menjadi satuan km/jam.",
      conversionPrompt: "5 m/s = ... km/h",
      correctNumeric: "18",
      unitTarget: "km/h",
      explanation: "5 m/s = 5 × 3,6 = 18 km/h.",
      misconception: "Untuk merubah m/s ke km/jam, kalikan nilai dengan 3,6."
    },
    {
      id: "um_m04_4",
      mission: 4,
      type: "converter",
      difficulty: "medium",
      question: "Konversikan durasi 2 jam menjadi satuan standar SI sekon (s).",
      conversionPrompt: "2 jam = ... s",
      correctNumeric: "7200",
      unitTarget: "s",
      explanation: "2 jam = 2 × 3.600 sekon = 7.200 s. (1 jam = 60 menit × 60 sekon = 3.600 s).",
      misconception: "1 jam = 3.600 sekon (bukan 60 sekon)."
    },
    {
      id: "um_m04_5",
      mission: 4,
      type: "converter",
      difficulty: "medium",
      question: "Konversikan 1500 gram massa benda ke dalam satuan pokok SI (kg).",
      conversionPrompt: "1.500 g = ... kg",
      correctNumeric: "1.5",
      unitTarget: "kg",
      explanation: "1.500 g = 1.500 ÷ 1.000 = 1,5 kg. Kilogram (kg) adalah satuan pokok SI untuk massa.",
      misconception: "Gram (g) bukan satuan pokok SI; Kilogram (kg) adalah satuan pokok SI untuk massa."
    },
    {
      id: "um_m04_6",
      mission: 4,
      type: "converter",
      difficulty: "medium",
      question: "Konversikan 36 km/jam menjadi satuan standar SI (m/s).",
      conversionPrompt: "36 km/h = ... m/s",
      correctNumeric: "10",
      unitTarget: "m/s",
      explanation: "36 km/h = 36 ÷ 3,6 = 10 m/s.",
      misconception: "Pembagian dengan 3,6 dikarenakan 1.000m / 3.600s = 1/3,6."
    },
    {
      id: "um_m04_7",
      mission: 4,
      type: "converter",
      difficulty: "hard",
      question: "Konversikan 54 km/jam menjadi satuan standar SI (m/s).",
      conversionPrompt: "54 km/h = ... m/s",
      correctNumeric: "15",
      unitTarget: "m/s",
      explanation: "54 km/h = 54 ÷ 3,6 = 15 m/s.",
      misconception: "Gunakan rumus cepat konversi: (km/jam) ÷ 3,6 = (m/s)."
    },
    {
      id: "um_m04_8",
      mission: 4,
      type: "converter",
      difficulty: "hard",
      question: "Konversikan 30 menit menjadi satuan standar SI (sekon).",
      conversionPrompt: "30 menit = ... s",
      correctNumeric: "1800",
      unitTarget: "s",
      explanation: "30 menit = 30 × 60 = 1.800 s.",
      misconception: "1 menit = 60 sekon."
    },

    // ==========================================
    // MISSION 05: UNIT BOSS (6 Challenges)
    // ==========================================
    {
      id: "um_m05_1",
      mission: 5,
      type: "boss",
      difficulty: "hard",
      question: "ANALISIS KRISIS SATUAN #1: Manakah dari pernyataan berikut yang BENAR mengenai sistem SI?",
      correctAnswer: "A",
      options: [
        { id: "A", text: "Kilogram (kg) adalah satuan pokok SI, sedangkan gram (g) bukan." },
        { id: "B", text: "Gram (g) adalah satuan pokok SI, sedangkan kilogram (kg) adalah turunan." },
        { id: "C", text: "Joule (J) dan Newton (N) adalah satuan pokok SI." },
        { id: "D", text: "Celcius (°C) adalah satuan pokok SI untuk suhu." }
      ],
      explanation: "Kilogram (kg) adalah satu-satunya satuan pokok SI yang menyertakan awalan kilo-.",
      misconception: "Banyak siswa salah mengira gram sebagai satuan pokok dasar."
    },
    {
      id: "um_m05_2",
      mission: 5,
      type: "boss",
      difficulty: "hard",
      question: "ANALISIS KRISIS SATUAN #2: Manakah pasangan Besaran dan Satuan SI yang TEPAT?",
      correctAnswer: "C",
      options: [
        { id: "A", text: "Gaya & kg" },
        { id: "B", text: "Energi & Watt" },
        { id: "C", text: "Tekanan & Pascal" },
        { id: "D", text: "Kuat Arus & Volt" }
      ],
      explanation: "Tekanan ber-satuan Pascal (Pa = N/m²). Gaya = Newton, Energi = Joule, Arus = Ampere.",
      misconception: "Watt adalah satuan Daya, bukan Energi."
    },
    {
      id: "um_m05_3",
      mission: 5,
      type: "boss",
      difficulty: "hard",
      question: "ANALISIS KRISIS SATUAN #3: Sebuah kendaraan melaju dengan 90 km/jam. Berapakah kecepatannya dalam SI?",
      correctAnswer: "B",
      options: [
        { id: "A", text: "20 m/s" },
        { id: "B", text: "25 m/s" },
        { id: "C", text: "30 m/s" },
        { id: "D", text: "35 m/s" }
      ],
      explanation: "90 km/jam = 90 ÷ 3,6 = 25 m/s.",
      misconception: "Jangan mengalikan dengan 3,6 jika merubah dari km/jam ke m/s."
    },
    {
      id: "um_m05_4",
      mission: 5,
      type: "boss",
      difficulty: "hard",
      question: "ANALISIS KRISIS SATUAN #4: Simbol 'cd' dan '[J]' berturut-turut menunjukkan...",
      correctAnswer: "D",
      options: [
        { id: "A", text: "Satuan Energi & Satuan Daya" },
        { id: "B", text: "Dimensi Energi & Dimensi Gaya" },
        { id: "C", text: "Satuan Kuat Arus & Dimensi Kuat Arus" },
        { id: "D", text: "Satuan Intensitas Cahaya & Dimensi Intensitas Cahaya" }
      ],
      explanation: "candela (cd) adalah satuan intensitas cahaya, dan [J] adalah simbol dimensinya dalam SI.",
      misconception: "Jangan mengacaukan huruf J sebagai Joule (satuan energi) dengan [J] sebagai dimensi intensitas cahaya."
    },
    {
      id: "um_m05_5",
      mission: 5,
      type: "boss",
      difficulty: "hard",
      question: "ANALISIS KRISIS SATUAN #5: Besaran manakah yang memiliki satuan turunan N/m² dalam SI?",
      correctAnswer: "A",
      options: [
        { id: "A", text: "Tekanan (Pascal)" },
        { id: "B", text: "Energi (Joule)" },
        { id: "C", text: "Percepatan (m/s²)" },
        { id: "D", text: "Massa Jenis (kg/m³)" }
      ],
      explanation: "Tekanan (p = F/A) memiliki satuan N/m² yang secara khusus dinamakan Pascal (Pa).",
      misconception: "Gaya per unit area adalah tekanan (Pascal)."
    },
    {
      id: "um_m05_6",
      mission: 5,
      type: "boss",
      difficulty: "hard",
      question: "ANALISIS KRISIS SATUAN #6: Manakah di antara kelompok berikut yang SELURUHNYA merupakan Satuan Pokok SI?",
      correctAnswer: "C",
      options: [
        { id: "A", text: "meter, kilogram, newton, joule" },
        { id: "B", text: "cm, gram, sekon, celcius" },
        { id: "C", text: "meter, kilogram, sekon, kelvin, ampere, mol, candela" },
        { id: "D", text: "meter, kg, sekon, pascal, watt" }
      ],
      explanation: "Tujuh satuan pokok SI yang benar adalah meter, kilogram, sekon, kelvin, ampere, mol, dan candela.",
      misconception: "Newton, Joule, Pascal, dan Watt adalah satuan turunan."
    }
  ];

  /**
   * Balanced Session Challenge Selector for Solo Quest & Arena:
   * Selects 10 challenges (2 Match, 2 Scanner, 2 Sorter, 2 Converter, 2 Boss)
   * Guaranteed balanced representation without duplicates.
   */
  function getSoloSessionChallenges(count) {
    count = count || 10;

    const shuffle = arr => [...arr].sort(() => 0.5 - Math.random());

    const m1 = shuffle(UNIT_MASTER_DATA.filter(c => c.mission === 1));
    const m2 = shuffle(UNIT_MASTER_DATA.filter(c => c.mission === 2));
    const m3 = shuffle(UNIT_MASTER_DATA.filter(c => c.mission === 3));
    const m4 = shuffle(UNIT_MASTER_DATA.filter(c => c.mission === 4));
    const m5 = shuffle(UNIT_MASTER_DATA.filter(c => c.mission === 5));

    // 2 challenges from each mission (2 * 5 = 10 challenges)
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
    getAllChallenges: function() { return UNIT_MASTER_DATA; },
    getSoloSessionChallenges: getSoloSessionChallenges
  };

})();
