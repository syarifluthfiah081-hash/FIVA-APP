/**
 * FIVIA GROUP LEVEL QUESTIONS MODULE
 * Phase 10.1: Categorized Question Bank & Per-Module Question Banks for Materi & Lab
 */

window.FIVIAGroupLevelQuestions = (function() {
  'use strict';

  // Core General Question Bank (Used for ALL / Fallback)
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

  // Specific Question Banks for Each Module in "Materi & Lab" (Modul 1 to 5)
  const MODULE_QUESTION_BANKS = {
    // MODUL 1: Hakikat Fisika & Metode Ilmiah
    "1": {
      LEVEL_01: [
        { id: 'm1_l1_q1', type: 'multiple_choice', question: 'Manakah yang merupakan langkah awal dalam metode ilmiah setelah observasi fenomena?', options: [{ id: 'A', label: 'Merumuskan hipotesis' }, { id: 'B', label: 'Menarik kesimpulan' }, { id: 'C', label: 'Merumuskan masalah penelitian' }, { id: 'D', label: 'Mempublikasikan hasil' }], correctAnswer: 'C', explanation: 'Langkah awal setelah pengamatan fenomena adalah merumuskan masalah penelitian secara terukur.' },
        { id: 'm1_l1_q2', type: 'multiple_choice', question: 'Simbol bahaya berupa gambar tengkorak pada botol bahan kimia mengindikasikan bahan bersifat...', options: [{ id: 'A', label: 'Explosive' }, { id: 'B', label: 'Corrosive' }, { id: 'C', label: 'Toxic (Beracun)' }, { id: 'D', label: 'Flammable' }], correctAnswer: 'C', explanation: 'Simbol tengkorak menandakan bahan beracun (Toxic) yang berbahaya jika terhirup atau tertelan.' },
        { id: 'm1_l1_q3', type: 'multiple_choice', question: 'Dalam eksperimen fisika, variabel yang sengaja diubah-ubah oleh peneliti dinamakan...', options: [{ id: 'A', label: 'Variabel Bebas' }, { id: 'B', label: 'Variabel Terikat' }, { id: 'C', label: 'Variabel Kontrol' }, { id: 'D', label: 'Variabel Pengganggu' }], correctAnswer: 'A', explanation: 'Variabel bebas adalah faktor yang sengaja diubah untuk menguji pengaruhnya.' },
        { id: 'm1_l1_q4', type: 'multiple_choice', question: 'Sikap ilmiah yang ditunjukkan dengan melaporkan data hasil eksperimen apa adanya adalah...', options: [{ id: 'A', label: 'Subjektif' }, { id: 'B', label: 'Jujur dan Objektif' }, { id: 'C', label: 'Kritis tanpa data' }, { id: 'D', label: 'Ceroboh' }], correctAnswer: 'B', explanation: 'Kejujuran dan objektivitas adalah fondasi utama sikap ilmiah dalam eksperimen fisika.' }
      ],
      LEVEL_02: [
        { id: 'm1_l2_q1', type: 'true_false', question: 'PERNYATAAN: Hipotesis ilmiah adalah kesimpulan mutlak yang tidak dapat diuji lagi.', options: [{ id: 'A', label: 'BENAR' }, { id: 'B', label: 'SALAH' }], correctAnswer: 'B', explanation: 'Pernyataan SALAH. Hipotesis adalah dugaan sementara yang wajib diuji melalui eksperimen.' },
        { id: 'm1_l2_q2', type: 'true_false', question: 'PERNYATAAN: Mengencerkan asam pekat dilakukan dengan menuangkan asam sedikit demi sedikit ke dalam air.', options: [{ id: 'A', label: 'BENAR' }, { id: 'B', label: 'SALAH' }], correctAnswer: 'A', explanation: 'Pernyataan BENAR. Selalu tuangkan asam ke dalam air untuk mencegah percikan eksotermik berbahaya.' },
        { id: 'm1_l2_q3', type: 'true_false', question: 'PERNYATAAN: Hakikat fisika meliputi tiga dimensi utama: Fisika sebagai Produk, Proses, dan Sikap.', options: [{ id: 'A', label: 'BENAR' }, { id: 'B', label: 'SALAH' }], correctAnswer: 'A', explanation: 'Pernyataan BENAR. Hakikat fisika mencakup Produk (kumpulan fakta/teori), Proses (metode ilmiah), dan Sikap.' },
        { id: 'm1_l2_q4', type: 'true_false', question: 'PERNYATAAN: Variabel kontrol adalah variabel yang sengaja diukur sebagai hasil eksperimen.', options: [{ id: 'A', label: 'BENAR' }, { id: 'B', label: 'SALAH' }], correctAnswer: 'B', explanation: 'Pernyataan SALAH. Variabel terikat yang diukur, sedangkan variabel kontrol dijaga konstan.' }
      ],
      LEVEL_03: [
        { id: 'm1_l3_q1', type: 'matching', question: 'Pasangkan dimensi hakikat fisika dengan pengertian utamanya:', pairs: [{ left: 'Fisika sebagai Produk', right: 'Kumpulan pengetahuan (fakta, teori, hukum)' }, { left: 'Fisika sebagai Proses', right: 'Cara penyelidikan & metode ilmiah' }, { left: 'Fisika sebagai Sikap', right: 'Rasa ingin tahu & objektivitas' }], explanation: 'Produk = ilmu, Proses = cara menyelidiki, Sikap = perilaku ilmiah.' },
        { id: 'm1_l3_q2', type: 'matching', question: 'Pasangkan jenis variabel eksperimen dengan fungsinya:', pairs: [{ left: 'Variabel Bebas', right: 'Faktor yang sengaja diubah' }, { left: 'Variabel Terikat', right: 'Faktor yang diukur/datiati' }, { left: 'Variabel Kontrol', right: 'Faktor yang dijaga konstan' }], explanation: 'Bebas = diubah, Terikat = diukur, Kontrol = konstan.' }
      ],
      LEVEL_04: [
        { id: 'm1_l4_q1', type: 'multiple_select', question: 'Manakah Alat Pelindung Diri (APD) wajib saat bekerja dengan bahan kimia di lab? (Centang semua jawaban benar)', options: [{ id: 'A', label: 'Jas Laboratorium' }, { id: 'B', label: 'Kacamata Goggles' }, { id: 'C', label: 'Sarung Tangan Karet' }, { id: 'D', label: 'Sandal Jepit' }], correctAnswers: [0, 1, 2], explanation: 'Jas lab, goggles, dan sarung tangan adalah APD standar wajib.' },
        { id: 'm1_l4_q2', type: 'multiple_select', question: 'Manakah yang tergolong elemen Metode Ilmiah dalam sains? (Centang semua jawaban benar)', options: [{ id: 'A', label: 'Merumuskan Masalah' }, { id: 'B', label: 'Mengajukan Hipotesis' }, { id: 'C', label: 'Melakukan Eksperimen' }, { id: 'D', label: 'Mengabaikan Hasil Eksperimen' }], correctAnswers: [0, 1, 2], explanation: 'Merumuskan masalah, hipotesis, dan eksperimen adalah alur ilmiah terstruktur.' }
      ],
      LEVEL_05: [
        { id: 'm1_l5_q1', type: 'short_answer', question: 'Apakah nama dugaan atau jawaban sementara terhadap masalah penelitian yang harus diuji melalui eksperimen?', correctAnswers: ['Hipotesis', 'hipotesis'], explanation: 'Hipotesis adalah jawaban sementara sebelum eksperimen dilakukan.' },
        { id: 'm1_l5_q2', type: 'short_answer', question: 'Apakah nama tempat sarana laboratorium bertutup kaca yang digunakan untuk mereaksikan bahan beracun atau asam pekat?', correctAnswers: ['Lemari Asam', 'lemari asam', 'Fume Hood'], explanation: 'Lemari asam (fume hood) melindungi praktikan dari uap beracun.' }
      ]
    },

    // MODUL 2: Pengukuran Dasar Fisika
    "2": {
      LEVEL_01: [
        { id: 'm2_l1_q1', type: 'multiple_choice', question: 'Manakah kelompok besaran di bawah ini yang semuanya merupakan besaran pokok SI?', options: [{ id: 'A', label: 'Kecepatan, Gaya, Massa' }, { id: 'B', label: 'Massa, Suhu, Panjang, Kuat Arus' }, { id: 'C', label: 'Volume, Waktu, Energi' }, { id: 'D', label: 'Usaha, Tekanan, Percepatan' }], correctAnswer: 'B', explanation: 'Massa, suhu, panjang, dan kuat arus adalah 4 dari 7 besaran pokok SI.' },
        { id: 'm2_l1_q2', type: 'multiple_choice', question: 'Tingkat ketelitian (skala terkecil) mikrometer sekrup adalah...', options: [{ id: 'A', label: '1 mm' }, { id: 'B', label: '0.1 mm' }, { id: 'C', label: '0.01 mm' }, { id: 'D', label: '0.001 mm' }], correctAnswer: 'C', explanation: 'Mikrometer sekrup memiliki ketelitian presisi 0.01 mm.' },
        { id: 'm2_l1_q3', type: 'multiple_choice', question: 'Berapakah jumlah angka penting dari hasil pengukuran 0.0243 m?', options: [{ id: 'A', label: '5' }, { id: 'B', label: '4' }, { id: 'C', label: '3' }, { id: 'D', label: '2' }], correctAnswer: 'C', explanation: 'Nol di sebelah kiri angka bukan nol pada desimal bukan angka penting (2, 4, 3 = 3 AP).' },
        { id: 'm2_l1_q4', type: 'multiple_choice', question: 'Dimensi dari besaran Gaya (F = m · a) adalah...', options: [{ id: 'A', label: '[MLT⁻²]' }, { id: 'B', label: '[ML²T⁻²]' }, { id: 'C', label: '[LT⁻²]' }, { id: 'D', label: '[ML⁻¹T⁻²]' }], correctAnswer: 'A', explanation: 'F = kg · m/s² -> [M][L][T]⁻².' }
      ],
      LEVEL_02: [
        { id: 'm2_l2_q1', type: 'true_false', question: 'PERNYATAAN: Angka nol di sebelah kiri angka bukan nol pada desimal dihitung sebagai angka penting.', options: [{ id: 'A', label: 'BENAR' }, { id: 'B', label: 'SALAH' }], correctAnswer: 'B', explanation: 'Pernyataan SALAH. Angka nol di sebelah kiri desimal bukan angka penting.' },
        { id: 'm2_l2_q2', type: 'true_false', question: 'PERNYATAAN: Mikrometer sekrup memiliki tingkat ketelitian lebih tinggi (0.01 mm) dibanding jangka sorong (0.1 mm).', options: [{ id: 'A', label: 'BENAR' }, { id: 'B', label: 'SALAH' }], correctAnswer: 'A', explanation: 'Pernyataan BENAR. Mikrometer sekrup 10x lebih teliti dari jangka sorong.' },
        { id: 'm2_l2_q3', type: 'true_false', question: 'PERNYATAAN: Dimensi energi kinetik [ML²T⁻²] sama persis dengan dimensi usaha.', options: [{ id: 'A', label: 'BENAR' }, { id: 'B', label: 'SALAH' }], correctAnswer: 'A', explanation: 'Pernyataan BENAR. Energi kinetik dan usaha keduanya berdimensi [ML²T⁻²].' }
      ],
      LEVEL_03: [
        { id: 'm2_l3_q1', type: 'matching', question: 'Pasangkan besaran pokok fisika dengan simbol dimensi SI yang tepat:', pairs: [{ left: 'Panjang', right: '[L]' }, { left: 'Massa', right: '[M]' }, { left: 'Waktu', right: '[T]' }], explanation: 'Panjang [L], Massa [M], Waktu [T].' },
        { id: 'm2_l3_q2', type: 'matching', question: 'Pasangkan alat ukur dengan tingkat ketelitian skalanya:', pairs: [{ left: 'Jangka Sorong', right: '0.1 mm (0.01 cm)' }, { left: 'Mikrometer Sekrup', right: '0.01 mm (0.001 cm)' }, { left: 'Mistar Biasa', right: '1 mm (0.1 cm)' }], explanation: 'Jangka sorong 0.1 mm, Mikrometer 0.01 mm, Mistar 1 mm.' }
      ],
      LEVEL_04: [
        { id: 'm2_l4_q1', type: 'multiple_select', question: 'Manakah pasangan besaran dan satuan SI berikut yang BENAR? (Centang semua jawaban benar)', options: [{ id: 'A', label: 'Kuat Arus — Ampere (A)' }, { id: 'B', label: 'Suhu — Kelvin (K)' }, { id: 'C', label: 'Massa — Gram (g)' }, { id: 'D', label: 'Panjang — Meter (m)' }], correctAnswers: [0, 1, 3], explanation: 'Kuat arus (Ampere), Suhu (Kelvin), dan Panjang (Meter) adalah satuan SI.' },
        { id: 'm2_l4_q2', type: 'multiple_select', question: 'Manakah besaran fisika di bawah ini yang tergolong BESARAN VEKTOR? (Centang semua jawaban benar)', options: [{ id: 'A', label: 'Gaya (Force)' }, { id: 'B', label: 'Perpindahan (Displacement)' }, { id: 'C', label: 'Kecepatan (Velocity)' }, { id: 'D', label: 'Massa Jenis (Density)' }], correctAnswers: [0, 1, 2], explanation: 'Gaya, perpindahan, dan kecepatan adalah besaran vektor.' }
      ],
      LEVEL_05: [
        { id: 'm2_l5_q1', type: 'short_answer', question: 'Apakah nama alat ukur yang paling presisi untuk mengukur ketebalan kawat tembaga tipis?', correctAnswers: ['Mikrometer Sekrup', 'mikrometer sekrup', 'Mikrometer'], explanation: 'Mikrometer sekrup memiliki ketelitian 0.01 mm ideal untuk benda tipis.' },
        { id: 'm2_l5_q2', type: 'short_answer', question: 'Berapakah jumlah besaran pokok dalam Sistem Internasional (SI)?', correctAnswers: ['7', 'tujuh', '7 besaran'], explanation: 'Ada 7 besaran pokok dasar dalam SI.' }
      ]
    },

    // MODUL 3: Usaha dan Energi
    "3": {
      LEVEL_01: [
        { id: 'm3_l1_q1', type: 'multiple_choice', question: 'Sebuah benda dilepaskan dari puncak ramp setinggi 5 m (m=2 kg, g=10 m/s²). Energi potensial maksimumnya adalah...', options: [{ id: 'A', label: '100 Joule' }, { id: 'B', label: '60 Joule' }, { id: 'C', label: '40 Joule' }, { id: 'D', label: '20 Joule' }], correctAnswer: 'A', explanation: 'Ep = m · g · h = 2 kg * 10 * 5 = 100 Joule.' },
        { id: 'm3_l1_q2', type: 'multiple_choice', question: 'Seorang anak mendorong tembok gedung sekuat tenaga namun tembok tidak bergeser sama sekali. Usaha anak tersebut adalah...', options: [{ id: 'A', label: '1000 Joule' }, { id: 'B', label: '100 Joule' }, { id: 'C', label: '0 Joule' }, { id: 'D', label: '50 Joule' }], correctAnswer: 'C', explanation: 'W = F · s. Karena s = 0 (benda diam), usaha = 0 Joule.' },
        { id: 'm3_l1_q3', type: 'multiple_choice', question: 'Jika kecepatan gerak benda dilipatgandakan menjadi 3 kali semula, energi kinetiknya menjadi...', options: [{ id: 'A', label: '3 kali' }, { id: 'B', label: '6 kali' }, { id: 'C', label: '9 kali' }, { id: 'D', label: '27 kali' }], correctAnswer: 'C', explanation: 'Ek = ½ m v². (3v)² = 9 kali semula.' },
        { id: 'm3_l1_q4', type: 'multiple_choice', question: 'Laju usaha yang dilakukan per satuan waktu dinamakan...', options: [{ id: 'A', label: 'Gaya' }, { id: 'B', label: 'Daya (Power)' }, { id: 'C', label: 'Impuls' }, { id: 'D', label: 'Tekanan' }], correctAnswer: 'B', explanation: 'Daya P = W / t.' }
      ],
      LEVEL_02: [
        { id: 'm3_l2_q1', type: 'true_false', question: 'PERNYATAAN: Hukum Kekekalan Energi Mekanik menyatakan bahwa Ep + Ek = Konstan pada sistem tanpa gesekan.', options: [{ id: 'A', label: 'BENAR' }, { id: 'B', label: 'SALAH' }], correctAnswer: 'A', explanation: 'Pernyataan BENAR. Energi mekanik total selalu konstan jika tidak ada gaya luar non-konservatif.' },
        { id: 'm3_l2_q2', type: 'true_false', question: 'PERNYATAAN: Usaha bernilai negatif jika arah gaya berlawanan dengan arah perpindahan benda.', options: [{ id: 'A', label: 'BENAR' }, { id: 'B', label: 'SALAH' }], correctAnswer: 'A', explanation: 'Pernyataan BENAR. Contohnya usaha oleh gaya gesekan.' },
        { id: 'm3_l2_q3', type: 'true_false', question: 'PERNYATAAN: Energi kinetik bernilai maksimum saat benda berada di puncak ketinggiannya.', options: [{ id: 'A', label: 'BENAR' }, { id: 'B', label: 'SALAH' }], correctAnswer: 'B', explanation: 'Pernyataan SALAH. Di titik tertinggi, energi potensial maksimum dan energi kinetik nol.' }
      ],
      LEVEL_03: [
        { id: 'm3_l3_q1', type: 'matching', question: 'Pasangkan nama energi/usaha dengan persamaan fisika yang tepat:', pairs: [{ left: 'Energi Potensial Gravitasi', right: 'Ep = m · g · h' }, { left: 'Energi Kinetik', right: 'Ek = ½ · m · v²' }, { left: 'Usaha (Work)', right: 'W = F · s' }], explanation: 'Ep=mgh, Ek=½mv², W=Fs.' },
        { id: 'm3_l3_q2', type: 'matching', question: 'Pasangkan besaran usaha dan energi dengan satuan SI yang tepat:', pairs: [{ left: 'Usaha & Energi', right: 'Joule (J)' }, { left: 'Daya (Laju Energi)', right: 'Watt (W)' }, { left: 'Gaya Dorong', right: 'Newton (N)' }], explanation: 'Usaha = Joule, Daya = Watt, Gaya = Newton.' }
      ],
      LEVEL_04: [
        { id: 'm3_l4_q1', type: 'multiple_select', question: 'Manakah faktor yang memengaruhi besar Energi Potensial Gravitasi benda? (Centang semua jawaban benar)', options: [{ id: 'A', label: 'Massa Benda (m)' }, { id: 'B', label: 'Percepatan Gravitasi (g)' }, { id: 'C', label: 'Ketinggian (h)' }, { id: 'D', label: 'Warna Benda' }], correctAnswers: [0, 1, 2], explanation: 'Ep = m · g · h dipengaruhi m, g, dan h.' },
        { id: 'm3_l4_q2', type: 'multiple_select', question: 'Manakah contoh perubahan energi kimia menjadi energi listrik/kinetik? (Centang semua jawaban benar)', options: [{ id: 'A', label: 'Baterai pada mobil listrik mainan' }, { id: 'B', label: 'Aki (Akumulator) motor' }, { id: 'C', label: 'Panel surya' }, { id: 'D', label: 'Kincir angin' }], correctAnswers: [0, 1], explanation: 'Baterai dan aki mengubah reaksi kimia menjadi energi listrik.' }
      ],
      LEVEL_05: [
        { id: 'm3_l5_q1', type: 'short_answer', question: 'Apakah nama hukum yang menyatakan bahwa energi tidak dapat diciptakan atau dimusnahkan?', correctAnswers: ['Hukum Kekekalan Energi', 'hukum kekekalan energi', 'Kekekalan Energi'], explanation: 'Hukum Kekekalan Energi adalah hukum dasar fisika.' },
        { id: 'm3_l5_q2', type: 'short_answer', question: 'Jika usaha 600 Joule dilakukan dalam waktu 10 detik, berapakah daya yang dihasilkan dalam Watt?', correctAnswers: ['60', '60 Watt', '60 W'], explanation: 'P = W / t = 600 / 10 = 60 Watt.' }
      ]
    },

    // MODUL 4: Lingkungan dan Energi Terbarukan
    "4": {
      LEVEL_01: [
        { id: 'm4_l1_q1', type: 'multiple_choice', question: 'Faktor parameter lingkungan manakah yang paling signifikan memengaruhi daya turbin angin?', options: [{ id: 'A', label: 'Suhu udara' }, { id: 'B', label: 'Kecepatan angin pangkat tiga (v³)' }, { id: 'C', label: 'Arah angin saja' }, { id: 'D', label: 'Kelembapan' }], correctAnswer: 'B', explanation: 'Daya angin sebanding dengan pangkat tiga kecepatan angin (v³).' },
        { id: 'm4_l1_q2', type: 'multiple_choice', question: 'Komponen semikonduktor panel surya menghasilkan listrik DC melalui mekanisme...', options: [{ id: 'A', label: 'Efek Fotovoltaik' }, { id: 'B', label: 'Efek Fotolistrik Klasik' }, { id: 'C', label: 'Efek Termoelektrik' }, { id: 'D', label: 'Efek Elektromagnetik' }], correctAnswer: 'A', explanation: 'Efek fotovoltaik mengubah energi foton menjadi arus listrik.' },
        { id: 'm4_l1_q3', type: 'multiple_choice', question: 'Kelemahan utama energi terbarukan angin dan surya dibanding fosil adalah...', options: [{ id: 'A', label: 'Menghasilkan gas CO2 tinggi' }, { id: 'B', label: 'Bersifat Intermitten (Tergantung cuaca)' }, { id: 'C', label: 'Bahan bakar harian mahal' }, { id: 'D', label: 'Merusak tanah' }], correctAnswer: 'B', explanation: 'Energi angin & surya intermitten karena ketersediaannya fluktuatif.' },
        { id: 'm4_l1_q4', type: 'multiple_choice', question: 'Gas rumah tangga ramah lingkungan dari pemrosesan limbah organik/kotoran ternak disebut...', options: [{ id: 'A', label: 'Biogas / Biomassa' }, { id: 'B', label: 'Batu bara cair' }, { id: 'C', label: 'Geotermal' }, { id: 'D', label: 'LPG' }], correctAnswer: 'A', explanation: 'Biogas diproduksi dari fermentasi limbah organik.' }
      ],
      LEVEL_02: [
        { id: 'm4_l2_q1', type: 'true_false', question: 'PERNYATAAN: Energi terbarukan adalah sumber energi alami yang tidak akan habis dan dapat diperbarui.', options: [{ id: 'A', label: 'BENAR' }, { id: 'B', label: 'SALAH' }], correctAnswer: 'A', explanation: 'Pernyataan BENAR. Energi terbarukan terus diperbarui oleh alam.' },
        { id: 'm4_l2_q2', type: 'true_false', question: 'PERNYATAAN: Pembangkit mikrohidro memanfaatkan aliran air tanpa menghasilkan emisi CO2.', options: [{ id: 'A', label: 'BENAR' }, { id: 'B', label: 'SALAH' }], correctAnswer: 'A', explanation: 'Pernyataan BENAR. Mikrohidro adalah sumber energi bersih.' },
        { id: 'm4_l2_q3', type: 'true_false', question: 'PERNYATAAN: Pembakaran batu bara di PLTU tergolong sumber energi bersih ramah lingkungan.', options: [{ id: 'A', label: 'BENAR' }, { id: 'B', label: 'SALAH' }], correctAnswer: 'B', explanation: 'Pernyataan SALAH. Pembakaran batu bara melepaskan emisi CO2 tinggi.' }
      ],
      LEVEL_03: [
        { id: 'm4_l3_q1', type: 'matching', question: 'Pasangkan jenis teknologi energi bersih dengan sumber utamanya:', pairs: [{ left: 'Panel Surya', right: 'Cahaya Foton Matahari' }, { left: 'Turbin Angin', right: 'Kecepatan Tiupan Angin' }, { left: 'Pembangkit Mikrohidro', right: 'Aliran Air Sungai' }], explanation: 'Surya = matahari, Turbin = angin, Mikrohidro = air.' },
        { id: 'm4_l3_q2', type: 'matching', question: 'Pasangkan kategori energi dengan contoh sumber daya alamnya:', pairs: [{ left: 'Energi Terbarukan', right: 'Surya, Angin, Air, Geotermal' }, { left: 'Energi Fosil', right: 'Minyak Bumi, Batu Bara, Gas Alam' }, { left: 'Biomassa', right: 'Kotoran Ternak & Limbah Organik' }], explanation: 'Terbarukan = surya/angin/air, Fosil = minyak/batu bara, Biomassa = limbah organik.' }
      ],
      LEVEL_04: [
        { id: 'm4_l4_q1', type: 'multiple_select', question: 'Manakah di bawah ini yang tergolong SUMBER ENERGI TERBARUKAN? (Centang semua jawaban benar)', options: [{ id: 'A', label: 'Energi Surya' }, { id: 'B', label: 'Energi Angin' }, { id: 'C', label: 'Energi Geotermal' }, { id: 'D', label: 'Batu Bara Muda' }], correctAnswers: [0, 1, 2], explanation: 'Surya, angin, dan geotermal adalah energi terbarukan.' },
        { id: 'm4_l4_q2', type: 'multiple_select', question: 'Manakah manfaat utama transisi ke energi terbarukan? (Centang semua jawaban benar)', options: [{ id: 'A', label: 'Mengurangi emisi gas CO2' }, { id: 'B', label: 'Menjaga kebersihan udara' }, { id: 'C', label: 'Mencegah krisis energi fosil' }, { id: 'D', label: 'Meningkatkan emisi karbon' }], correctAnswers: [0, 1, 2], explanation: 'Energi bersih mengurangi emisi CO2 dan mencegah krisis energi.' }
      ],
      LEVEL_05: [
        { id: 'm4_l5_q1', type: 'short_answer', question: 'Apakah nama efek fenomena timbulnya listrik pada sel semikonduktor akibat sinar matahari?', correctAnswers: ['Fotovoltaik', 'fotovoltaik', 'Efek Fotovoltaik', 'Photovoltaic'], explanation: 'Efek fotovoltaik menghasilkan listrik pada panel surya.' },
        { id: 'm4_l5_q2', type: 'short_answer', question: 'Apakah istilah untuk ketersediaan energi angin/surya yang berubah-ubah tergantung cuaca?', correctAnswers: ['Intermitten', 'intermitten', 'Intermiten'], explanation: 'Intermitten berarti tidak kontinu atau bergantung cuaca.' }
      ]
    },

    // MODUL 5: Pemanasan Global
    "5": {
      LEVEL_01: [
        { id: 'm5_l1_q1', type: 'multiple_choice', question: 'Bagaimanakah mekanisme fisis efek rumah kaca memicu kenaikan suhu bumi?', options: [{ id: 'A', label: 'Atmosfer menahan seluruh sinar UV' }, { id: 'B', label: 'Gas rumah kaca menyerap & memancarkan kembali inframerah bumi' }, { id: 'C', label: 'Panas dari inti bumi bocor' }, { id: 'D', label: 'Ozon membentuk awan hitam' }], correctAnswer: 'B', explanation: 'Gas rumah kaca menyerap radiasi inframerah gelombang panjang dan memancarkannya kembali.' },
        { id: 'm5_l1_q2', type: 'multiple_choice', question: 'Penyebab utama kenaikan emisi gas CO2 di atmosfer sejak revolusi industri adalah...', options: [{ id: 'A', label: 'Penggunaan pupuk' }, { id: 'B', label: 'Pembakaran bahan bakar fosil' }, { id: 'C', label: 'Peternakan sapi kecil' }, { id: 'D', label: 'Pembangkit angin' }], correctAnswer: 'B', explanation: 'Pembakaran minyak bumi dan batu bara melepaskan emisi CO2 masif.' },
        { id: 'm5_l1_q3', type: 'multiple_choice', question: 'Kenaikan permukaan air laut global disebabkan oleh dua proses utama, yaitu...', options: [{ id: 'A', label: 'Pencairan es kutub & pemuaian termal air laut' }, { id: 'B', label: 'Tsunami & pasang laut' }, { id: 'C', label: 'Reaksi oksigen-hidrogen' }, { id: 'D', label: 'Bocornya air tanah' }], correctAnswer: 'A', explanation: 'Pencairan glasiar dan pemuaian volume air hangat menaikkan permukaan laut.' },
        { id: 'm5_l1_q4', type: 'multiple_choice', question: 'Gas rumah kaca berpotensi pemanasan tinggi yang banyak dihasilkan dari peternakan & sampah organik adalah...', options: [{ id: 'A', label: 'Oksigen' }, { id: 'B', label: 'Nitrogen' }, { id: 'C', label: 'Metana (CH4)' }, { id: 'D', label: 'Helium' }], correctAnswer: 'C', explanation: 'Metana (CH4) memilik daya perangkap panas lebih kuat dari CO2.' }
      ],
      LEVEL_02: [
        { id: 'm5_l2_q1', type: 'true_false', question: 'PERNYATAAN: Tanpa efek rumah kaca alami sama sekali, suhu rata-rata bumi akan sangat dingin (-18°C).', options: [{ id: 'A', label: 'BENAR' }, { id: 'B', label: 'SALAH' }], correctAnswer: 'A', explanation: 'Pernyataan BENAR. Efek rumah kaca alami menjaga bumi hangat layak huni.' },
        { id: 'm5_l2_q2', type: 'true_false', question: 'PERNYATAAN: Reboisasi (penanaman pohon) membantu menyerap konsentrasi CO2 di udara.', options: [{ id: 'A', label: 'BENAR' }, { id: 'B', label: 'SALAH' }], correctAnswer: 'A', explanation: 'Pernyataan BENAR. Tumbuhan menyerap CO2 melalui fotosintesis.' },
        { id: 'm5_l2_q3', type: 'true_false', question: 'PERNYATAAN: Pemuaian termal air laut akibat panas tidak berpengaruh pada tinggi permukaan laut.', options: [{ id: 'A', label: 'BENAR' }, { id: 'B', label: 'SALAH' }], correctAnswer: 'B', explanation: 'Pernyataan SALAH. Pemuaian termal menyumbang signifikan pada kenaikan air laut.' }
      ],
      LEVEL_03: [
        { id: 'm5_l3_q1', type: 'matching', question: 'Pasangkan jenis gas rumah kaca dengan sumber utamanya:', pairs: [{ left: 'Karbon Dioksida (CO2)', right: 'Pembakaran Fosil & Deforestasi' }, { left: 'Metana (CH4)', right: 'Limbah Organik & Peternakan' }, { left: 'CFC', right: 'Refrigeran AC / Kulkas' }], explanation: 'CO2 = fosil, CH4 = limbah/peternakan, CFC = refrigeran AC.' },
        { id: 'm5_l3_q2', type: 'matching', question: 'Pasangkan istilah pemanasan global dengan fenomena fisika yang sesuai:', pairs: [{ left: 'Pemanasan Global', right: 'Kenaikan suhu rata-rata permukaan bumi' }, { left: 'Efek Rumah Kaca', right: 'Pemerangkapan radiasi inframerah' }, { left: 'Pemuaian Termal', right: 'Penambahan volume air laut akibat panas' }], explanation: 'Pemanasan global = kenaikan suhu, Efek rumah kaca = perangkap inframerah, Pemuaian = penambahan volume.' }
      ],
      LEVEL_04: [
        { id: 'm5_l4_q1', type: 'multiple_select', question: 'Manakah di bawah ini yang tergolong GAS RUMAH KACA di atmosfer? (Centang semua jawaban benar)', options: [{ id: 'A', label: 'Karbon Dioksida (CO2)' }, { id: 'B', label: 'Metana (CH4)' }, { id: 'C', label: 'Uap Air (H2O)' }, { id: 'D', label: 'Gas Oksigen (O2)' }], correctAnswers: [0, 1, 2], explanation: 'CO2, CH4, dan H2O adalah gas-gas rumah kaca.' },
        { id: 'm5_l4_q2', type: 'multiple_select', question: 'Manakah aksi nyata siswa menekan pemanasan global di sekolah? (Centang semua jawaban benar)', options: [{ id: 'A', label: 'Menghemat energi listrik' }, { id: 'B', label: 'Menggunakan sepeda/jalan kaki' }, { id: 'C', label: 'Mengurangi sampah plastik' }, { id: 'D', label: 'Membakar sampah plastik' }], correctAnswers: [0, 1, 2], explanation: 'Hemat listrik, bersepeda, dan kurangi sampah plastik menekan emisi.' }
      ],
      LEVEL_05: [
        { id: 'm5_l5_q1', type: 'short_answer', question: 'Apakah nama radiasi gelombang panjang dipancarkan bumi yang diperangkap oleh gas rumah kaca?', correctAnswers: ['Inframerah', 'infra merah', 'Infra Red', 'Infrared'], explanation: 'Radiasi inframerah diserap oleh molekul gas rumah kaca.' },
        { id: 'm5_l5_q2', type: 'short_answer', question: 'Apakah rumus kimia gas rumah kaca utama hasil pembakaran bahan bakar fosil?', correctAnswers: ['CO2', 'CO_2', 'CO 2'], explanation: 'CO2 (Karbon Dioksida) adalah gas emisi fosil utama.' }
      ]
    }
  };

  let cachedPoolKey = null;
  let cachedQuestions = null;

  function resetQuestionCache() {
    cachedPoolKey = null;
    cachedQuestions = null;
  }

  function formatQuestionForGroupPlay(q, levelId) {
    // 1. Preserve explicit type if provided on question
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

    // 2. Format options safely
    let opts = undefined;
    if (type === 'true_false') {
      opts = [{ id: 'A', label: 'BENAR' }, { id: 'B', label: 'SALAH' }];
    } else if (q.options && Array.isArray(q.options) && q.options.length > 0) {
      opts = q.options.map((opt, i) => ({
        id: typeof opt === 'object' && opt.id ? opt.id : String.fromCharCode(65 + i),
        label: typeof opt === 'string' ? opt : (opt.label || opt.text || '')
      }));
    }

    // 3. Format correctAnswer / correctAnswers / pairs safely
    let corrAns = q.correctAnswer;
    if (!corrAns) {
      if (type === 'true_false') {
        corrAns = (q.correct === 0 || q.correct === 'A' || q.correctAnswer === 'BENAR' || q.correct === true) ? 'A' : 'B';
      } else if (typeof q.correct === 'number') {
        corrAns = String.fromCharCode(65 + q.correct);
      } else {
        corrAns = 'A';
      }
    }

    let corrAnswers = q.correctAnswers;
    if (type === 'multiple_select' && (!corrAnswers || corrAnswers.length === 0)) {
      if (typeof q.correct === 'number') {
        corrAnswers = [q.correct, (q.correct + 1) % (opts ? opts.length : 4)];
      } else {
        corrAnswers = [0, 2];
      }
    }

    if (type === 'short_answer' && (!corrAnswers || corrAnswers.length === 0)) {
      if (opts && typeof q.correct === 'number' && opts[q.correct]) {
        corrAnswers = [opts[q.correct].label];
      } else if (q.correctAnswer) {
        corrAnswers = [q.correctAnswer];
      } else {
        corrAnswers = ['Bebas', 'Sesuai Teori'];
      }
    }

    let pairs = q.pairs;
    if (type === 'matching' && (!pairs || pairs.length === 0)) {
      pairs = [
        { left: 'Konsep Utama', right: 'Prinsip Fisika' },
        { left: 'Besaran / Ukuran', right: 'Satuan Standar SI' },
        { left: 'Formulasi Rumus', right: 'Hasil Perhitungan' }
      ];
    }

    return {
      id: q.id || `gp_${Math.random().toString(36).substr(2, 5)}`,
      type: type,
      question: q.question,
      options: opts,
      correct: q.correct,
      correctAnswers: corrAnswers,
      correctAnswer: corrAns,
      pairs: pairs,
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
      const modIdStr = String(selectedModuleId);
      const modIdNum = parseInt(selectedModuleId);

      // 1. Check if teacher uploaded custom questions for this module (in customQuizzes or db)
      let customQuiz = null;
      try {
        const customQuizzes = JSON.parse(localStorage.getItem("fivia_custom_quizzes") || "[]");
        customQuiz = customQuizzes.find(q => q.materialId === modIdNum || q.id === `quiz_${modIdNum}` || String(q.materialId) === modIdStr || String(q.id) === modIdStr);
      } catch(e) {}

      if (!customQuiz && window.db && typeof window.db.getTable === 'function') {
        try {
          const dbQuizzes = window.db.getTable("quizzes") || [];
          customQuiz = dbQuizzes.find(q => parseInt(q.materialId) === modIdNum && q.questions && q.questions.length > 0);
        } catch(e) {}
      }

      if (customQuiz && customQuiz.questions && customQuiz.questions.length > 0) {
        // Filter questions matching target level format:
        // LEVEL_01 -> multiple_choice
        // LEVEL_02 -> true_false
        // LEVEL_03 -> matching
        // LEVEL_04 -> multiple_select
        // LEVEL_05 -> short_answer
        const targetType = lvlKey === 'LEVEL_02' ? 'true_false' :
                           lvlKey === 'LEVEL_03' ? 'matching' :
                           lvlKey === 'LEVEL_04' ? 'multiple_select' :
                           lvlKey === 'LEVEL_05' ? 'short_answer' : 'multiple_choice';

        const matchingQuestions = customQuiz.questions.filter(q => {
          const t = q.type || q.questionType;
          if (t === targetType) return true;
          if (targetType === 'matching' && q.pairs && q.pairs.length > 0) return true;
          if (targetType === 'multiple_select' && q.correctAnswers && Array.isArray(q.correctAnswers) && typeof q.correctAnswers[0] === 'number') return true;
          if (targetType === 'short_answer' && q.correctAnswers && Array.isArray(q.correctAnswers) && typeof q.correctAnswers[0] === 'string') return true;
          return false;
        });

        const listToFormat = matchingQuestions.length > 0 ? matchingQuestions : customQuiz.questions;
        pool = listToFormat.map(q => formatQuestionForGroupPlay(q, lvlKey));
      } else if (MODULE_QUESTION_BANKS[modIdStr] && MODULE_QUESTION_BANKS[modIdStr][lvlKey] && MODULE_QUESTION_BANKS[modIdStr][lvlKey].length > 0) {
        // 2. Built-in MODULE_QUESTION_BANKS for Modul 1, 2, 3, 4, 5
        pool = MODULE_QUESTION_BANKS[modIdStr][lvlKey].map(q => formatQuestionForGroupPlay(q, lvlKey));
      } else if (MODULE_QUESTION_BANKS[modIdNum] && MODULE_QUESTION_BANKS[modIdNum][lvlKey] && MODULE_QUESTION_BANKS[modIdNum][lvlKey].length > 0) {
        pool = MODULE_QUESTION_BANKS[modIdNum][lvlKey].map(q => formatQuestionForGroupPlay(q, lvlKey));
      }
    }

    // 3. Fallback to core QUESTION_BANK if pool is empty or 'ALL' selected
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
    MODULE_QUESTION_BANKS: MODULE_QUESTION_BANKS,
    getQuestionsForLevel: getQuestionsForLevel,
    getQuestionById: getQuestionById,
    resetQuestionCache: resetQuestionCache
  };
})();
