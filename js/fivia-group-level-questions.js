/**
 * FIVIA GROUP LEVEL QUESTIONS MODULE
 * Phase 10.1: Categorized Question Bank (95+ Physics HOTS Challenges for Level 01–05)
 */

window.FIVIAGroupLevelQuestions = (function() {
  'use strict';

  const QUESTION_BANK = {
    LEVEL_01: [
      { id: 'l1_q1', question: 'Manakah di bawah ini yang merupakan besaran fisika?', options: [{ id: 'A', label: 'Keindahan' }, { id: 'B', label: 'Panjang' }, { id: 'C', label: 'Warna' }, { id: 'D', label: 'Kebersihan' }], correctAnswer: 'B', explanation: 'Panjang adalah besaran fisika karena dapat diukur dan dinyatakan dengan angka.' },
      { id: 'l1_q2', question: 'Manakah pasangan yang seluruhnya merupakan besaran pokok SI?', options: [{ id: 'A', label: 'Panjang dan Massa' }, { id: 'B', label: 'Gaya dan Energi' }, { id: 'C', label: 'Kecepatan dan Waktu' }, { id: 'D', label: 'Luas dan Volume' }], correctAnswer: 'A', explanation: 'Panjang dan massa adalah dua dari tujuh besaran pokok dasar SI.' },
      { id: 'l1_q3', question: 'Berikut yang BUKAN merupakan besaran pokok SI adalah...', options: [{ id: 'A', label: 'Suhu Mutlak' }, { id: 'B', label: 'Kuat Arus Listrik' }, { id: 'C', label: 'Gaya' }, { id: 'D', label: 'Intensitas Cahaya' }], correctAnswer: 'C', explanation: 'Gaya merupakan besaran turunan (hasil perkalian massa dan percepatan).' },
      { id: 'l1_q4', question: 'Besaran yang diturunkan dari besaran pokok panjang dan waktu adalah...', options: [{ id: 'A', label: 'Massa Jenis' }, { id: 'B', label: 'Kecepatan' }, { id: 'C', label: 'Gaya' }, { id: 'D', label: 'Tekanan' }], correctAnswer: 'B', explanation: 'Kecepatan merupakan hasil bagi besaran panjang (jarak) terhadap waktu.' },
      { id: 'l1_q5', question: 'Besaran pokok yang menyatakan jumlah partikel zat dalam SI adalah...', options: [{ id: 'A', label: 'Massa' }, { id: 'B', label: 'Jumlah Zat (mol)' }, { id: 'C', label: 'Intensitas Cahaya' }, { id: 'D', label: 'Volume' }], correctAnswer: 'B', explanation: 'Jumlah zat diukur dalam satuan pokok mol.' },
      { id: 'l1_q6', question: 'Manakah besaran berikut yang tergolong besaran turunan?', options: [{ id: 'A', label: 'Waktu' }, { id: 'B', label: 'Suhu' }, { id: 'C', label: 'Luas' }, { id: 'D', label: 'Kuat Arus' }], correctAnswer: 'C', explanation: 'Luas diturunkan dari panjang x panjang.' },
      { id: 'l1_q7', question: 'Besaran skalar adalah besaran yang hanya memiliki...', options: [{ id: 'A', label: 'Arah saja' }, { id: 'B', label: 'Nilai/Besar saja' }, { id: 'C', label: 'Nilai dan Arah' }, { id: 'D', label: 'Dimensi saja' }], correctAnswer: 'B', explanation: 'Besaran skalar hanya memiliki nilai tanpa memperhitungkan arah.' },
      { id: 'l1_q8', question: 'Manakah yang termasuk besaran vektor?', options: [{ id: 'A', label: 'Massa' }, { id: 'B', label: 'Waktu' }, { id: 'C', label: 'Perpindahan' }, { id: 'D', label: 'Suhu' }], correctAnswer: 'C', explanation: 'Perpindahan memiliki besar dan arah.' },
      { id: 'l1_q9', question: 'Volume merupakan besaran turunan yang diturunkan dari besaran pokok...', options: [{ id: 'A', label: 'Panjang' }, { id: 'B', label: 'Massa' }, { id: 'C', label: 'Waktu' }, { id: 'D', label: 'Suhu' }], correctAnswer: 'A', explanation: 'Volume diturunkan dari perkalian tiga dimensi panjang.' },
      { id: 'l1_q10', question: 'Massa jenis merupakan hasil bagi dari besaran pokok massa terhadap besaran turunan...', options: [{ id: 'A', label: 'Luas' }, { id: 'B', label: 'Volume' }, { id: 'C', label: 'Panjang' }, { id: 'D', label: 'Waktu' }], correctAnswer: 'B', explanation: 'Massa jenis = massa / volume.' },
      { id: 'l1_q11', question: 'Besaran berikut yang memiliki nilai dan arah adalah...', options: [{ id: 'A', label: 'Energi' }, { id: 'B', label: 'Gaya' }, { id: 'C', label: 'Kelajuan' }, { id: 'D', label: 'Daya' }], correctAnswer: 'B', explanation: 'Gaya adalah besaran vektor.' },
      { id: 'l1_q12', question: 'Berapakah jumlah besaran pokok dalam SI?', options: [{ id: 'A', label: '5' }, { id: 'B', label: '7' }, { id: 'C', label: '9' }, { id: 'D', label: '12' }], correctAnswer: 'B', explanation: 'Terdapat 7 besaran pokok utama dalam SI.' },
      { id: 'l1_q13', question: 'Besaran pokok yang mengukur derajat panas suatu benda adalah...', options: [{ id: 'A', label: 'Kalor' }, { id: 'B', label: 'Suhu' }, { id: 'C', label: 'Energi' }, { id: 'D', label: 'Entalpi' }], correctAnswer: 'B', explanation: 'Suhu mengukur derajat panas benda.' },
      { id: 'l1_q14', question: 'Tekanan didefinisikan sebagai gaya per satuan luas. Maka tekanan termasuk...', options: [{ id: 'A', label: 'Besaran Pokok' }, { id: 'B', label: 'Besaran Turunan' }, { id: 'C', label: 'Bukan Besaran' }, { id: 'D', label: 'Besaran Tanpa Satuan' }], correctAnswer: 'B', explanation: 'Tekanan diturunkan dari gaya dan luas.' },
      { id: 'l1_q15', question: 'Manakah pasangan besaran turunan yang tepat?', options: [{ id: 'A', label: 'Kecepatan dan Daya' }, { id: 'B', label: 'Panjang dan Massa' }, { id: 'C', label: 'Waktu dan Suhu' }, { id: 'D', label: 'Jumlah Zat dan Kuat Arus' }], correctAnswer: 'A', explanation: 'Kecepatan dan daya keduanya merupakan besaran turunan.' },
      { id: 'l1_q16', question: 'Alat ukur mistar digunakan untuk mengukur besaran pokok...', options: [{ id: 'A', label: 'Panjang' }, { id: 'B', label: 'Massa' }, { id: 'C', label: 'Waktu' }, { id: 'D', label: 'Suhu' }], correctAnswer: 'A', explanation: 'Mistar mengukur panjang.' },
      { id: 'l1_q17', question: 'Stopwatch adalah alat untuk mengukur besaran pokok...', options: [{ id: 'A', label: 'Kecepatan' }, { id: 'B', label: 'Waktu' }, { id: 'C', label: 'Kuat Arus' }, { id: 'D', label: 'Suhu' }], correctAnswer: 'B', explanation: 'Stopwatch mengukur selang waktu.' },
      { id: 'l1_q18', question: 'Neraca Ohauss digunakan untuk mengukur besaran pokok...', options: [{ id: 'A', label: 'Berat' }, { id: 'B', label: 'Massa' }, { id: 'C', label: 'Gaya' }, { id: 'D', label: 'Volume' }], correctAnswer: 'B', explanation: 'Neraca mengukur massa benda.' },
      { id: 'l1_q19', question: 'Manakah yang tergolong besaran skalar?', options: [{ id: 'A', label: 'Percepatan' }, { id: 'B', label: 'Energi Kinetik' }, { id: 'C', label: 'Momentum' }, { id: 'D', label: 'Gaya Berat' }], correctAnswer: 'B', explanation: 'Energi kinetik adalah besaran skalar.' },
      { id: 'l1_q20', question: 'Kuat arus listrik termasuk dalam kelompok...', options: [{ id: 'A', label: 'Besaran Pokok' }, { id: 'B', label: 'Besaran Turunan' }, { id: 'C', label: 'Besaran Vektor' }, { id: 'D', label: 'Besaran Varian' }], correctAnswer: 'A', explanation: 'Kuat arus listrik adalah besaran pokok SI.' }
    ],

    LEVEL_02: [
      { id: 'l2_q1', question: 'Satuan standar internasional (SI) untuk besaran massa adalah...', options: [{ id: 'A', label: 'gram' }, { id: 'B', label: 'kilogram (kg)' }, { id: 'C', label: 'ton' }, { id: 'D', label: 'pound' }], correctAnswer: 'B', explanation: 'Kilogram (kg) adalah satuan SI massa.' },
      { id: 'l2_q2', question: 'Satuan SI untuk suhu mutlak adalah...', options: [{ id: 'A', label: 'Celsius (°C)' }, { id: 'B', label: 'Fahrenheit (°F)' }, { id: 'C', label: 'Kelvin (K)' }, { id: 'D', label: 'Reamur (°R)' }], correctAnswer: 'C', explanation: 'Kelvin (K) adalah satuan SI suhu mutlak.' },
      { id: 'l2_q3', question: 'Satuan SI untuk gaya adalah Newton. Newton setara dengan...', options: [{ id: 'A', label: 'kg·m/s²' }, { id: 'B', label: 'kg·m²/s²' }, { id: 'C', label: 'kg/m³' }, { id: 'D', label: 'kg·m/s' }], correctAnswer: 'A', explanation: 'F = m x a -> kg x m/s² = N.' },
      { id: 'l2_q4', question: 'Satuan SI untuk energi atau usaha adalah Joule (J). Joule setara dengan...', options: [{ id: 'A', label: 'kg·m/s²' }, { id: 'B', label: 'kg·m²/s²' }, { id: 'C', label: 'kg/m·s²' }, { id: 'D', label: 'kg·m²/s³' }], correctAnswer: 'B', explanation: 'W = F x s -> (kg·m/s²) x m = kg·m²/s² = J.' },
      { id: 'l2_q5', question: 'Satuan SI untuk tekanan adalah Pascal (Pa). Pascal setara dengan...', options: [{ id: 'A', label: 'N/m²' }, { id: 'B', label: 'N·m' }, { id: 'C', label: 'N/m' }, { id: 'D', label: 'N/s' }], correctAnswer: 'A', explanation: 'P = F / A -> N/m² = Pa.' },
      { id: 'l2_q6', question: 'Satuan daya dalam SI adalah Watt (W). Watt setara dengan...', options: [{ id: 'A', label: 'Joule·detik' }, { id: 'B', label: 'Joule / detik (J/s)' }, { id: 'C', label: 'Newton / detik' }, { id: 'D', label: 'kg·m/s' }], correctAnswer: 'B', explanation: 'Daya P = W / t -> J/s = W.' },
      { id: 'l2_q7', question: 'Satuan muatan listrik dalam SI adalah...', options: [{ id: 'A', label: 'Ampere (A)' }, { id: 'B', label: 'Coulomb (C)' }, { id: 'C', label: 'Volt (V)' }, { id: 'D', label: 'Ohm (Ω)' }], correctAnswer: 'B', explanation: 'Coulomb (C) adalah satuan muatan listrik (Q = I x t).' },
      { id: 'l2_q8', question: 'Satuan SI untuk massa jenis adalah...', options: [{ id: 'A', label: 'g/cm³' }, { id: 'B', label: 'kg/m³' }, { id: 'C', label: 'kg/cm³' }, { id: 'D', label: 'g/m³' }], correctAnswer: 'B', explanation: 'Massa jenis ρ = m/V -> kg/m³.' },
      { id: 'l2_q9', question: 'Manakah pasangan besaran dan satuan SI yang BENAR?', options: [{ id: 'A', label: 'Panjang — cm' }, { id: 'B', label: 'Waktu — jam' }, { id: 'C', label: 'Kuat Arus — Ampere' }, { id: 'D', label: 'Massa — gram' }], correctAnswer: 'C', explanation: 'Kuat arus ber-satuan SI Ampere.' },
      { id: 'l2_q10', question: 'Satuan frekuensi dalam SI adalah Hertz (Hz). Hertz setara dengan...', options: [{ id: 'A', label: 's' }, { id: 'B', label: '1/s (s⁻¹)' }, { id: 'C', label: 'm/s' }, { id: 'D', label: 'rad/s' }], correctAnswer: 'B', explanation: 'f = 1/T -> s⁻¹ = Hz.' },
      { id: 'l2_q11', question: '1 kilometer per jam (km/jam) jika dikonversi ke m/s adalah...', options: [{ id: 'A', label: '1000/3600 m/s' }, { id: 'B', label: '3600/1000 m/s' }, { id: 'C', label: '10 m/s' }, { id: 'D', label: '3.6 m/s' }], correctAnswer: 'A', explanation: '1 km/jam = 1000 m / 3600 s = 5/18 m/s.' },
      { id: 'l2_q12', question: 'Satuan beda potensial listrik (tegangan) dalam SI adalah...', options: [{ id: 'A', label: 'Volt (V)' }, { id: 'B', label: 'Watt (W)' }, { id: 'C', label: 'Joule (J)' }, { id: 'D', label: 'Ampere (A)' }], correctAnswer: 'A', explanation: 'Volt adalah satuan beda potensial listrik.' },
      { id: 'l2_q13', question: 'Satuan hambatan listrik dalam SI adalah...', options: [{ id: 'A', label: 'Ohm (Ω)' }, { id: 'B', label: 'Tesla (T)' }, { id: 'C', label: 'Henry (H)' }, { id: 'D', label: 'Farad (F)' }], correctAnswer: 'A', explanation: 'Ohm (Ω) adalah satuan hambatan listrik.' },
      { id: 'l2_q14', question: 'Satuan percepatan dalam SI adalah...', options: [{ id: 'A', label: 'm/s' }, { id: 'B', label: 'm/s²' }, { id: 'C', label: 'm·s' }, { id: 'D', label: 'km/s' }], correctAnswer: 'B', explanation: 'Percepatan a = Δv/Δt -> m/s².' },
      { id: 'l2_q15', question: 'Satuan momentum dalam SI adalah...', options: [{ id: 'A', label: 'kg·m/s' }, { id: 'B', label: 'kg·m/s²' }, { id: 'C', label: 'kg·m²/s' }, { id: 'D', label: 'N·m/s' }], correctAnswer: 'A', explanation: 'Momentum p = m x v -> kg·m/s.' },
      { id: 'l2_q16', question: 'Satuan impuls sama dengan satuan...', options: [{ id: 'A', label: 'Gaya' }, { id: 'B', label: 'Momentum' }, { id: 'C', label: 'Energi' }, { id: 'D', label: 'Tekanan' }], correctAnswer: 'B', explanation: 'Impuls I = Δp, satuannya N·s = kg·m/s.' },
      { id: 'l2_q17', question: 'Konversi 1 gram/cm³ ke satuan SI kg/m³ adalah...', options: [{ id: 'A', label: '10 kg/m³' }, { id: 'B', label: '100 kg/m³' }, { id: 'C', label: '1000 kg/m³' }, { id: 'D', label: '0.001 kg/m³' }], correctAnswer: 'C', explanation: '1 g/cm³ = (10⁻³ kg) / (10⁻⁶ m³) = 1000 kg/m³.' },
      { id: 'l2_q18', question: 'Satuan SI untuk intensitas cahaya adalah...', options: [{ id: 'A', label: 'Lumen' }, { id: 'B', label: 'Lux' }, { id: 'C', label: 'Candela (cd)' }, { id: 'D', label: 'Watt/m²' }], correctAnswer: 'C', explanation: 'Candela (cd) adalah satuan SI intensitas cahaya.' },
      { id: 'l2_q19', question: 'Manakah pasangan satuan yang setara?', options: [{ id: 'A', label: '1 Joule = 1 N·m' }, { id: 'B', label: '1 Watt = 1 N·m' }, { id: 'C', label: '1 Pascal = 1 J/m' }, { id: 'D', label: '1 Volt = 1 W·s' }], correctAnswer: 'A', explanation: 'W = F x s -> 1 J = 1 N·m.' },
      { id: 'l2_q20', question: 'Satuan medan magnet dalam SI adalah...', options: [{ id: 'A', label: 'Weber (Wb)' }, { id: 'B', label: 'Tesla (T)' }, { id: 'C', label: 'Gauss' }, { id: 'D', label: 'Maxwell' }], correctAnswer: 'B', explanation: 'Tesla (T) adalah satuan SI kuat medan magnet.' }
    ],

    LEVEL_03: [
      { id: 'l3_q1', question: 'Simbol dimensi untuk besaran panjang adalah...', options: [{ id: 'A', label: '[M]' }, { id: 'B', label: '[L]' }, { id: 'C', label: '[T]' }, { id: 'D', label: '[θ]' }], correctAnswer: 'B', explanation: 'Dimensi panjang disimbolkan dengan [L] (Length).' },
      { id: 'l3_q2', question: 'Simbol dimensi untuk besaran massa adalah...', options: [{ id: 'A', label: '[M]' }, { id: 'B', label: '[L]' }, { id: 'C', label: '[T]' }, { id: 'D', label: '[I]' }], correctAnswer: 'A', explanation: 'Dimensi massa disimbolkan dengan [M] (Mass).' },
      { id: 'l3_q3', question: 'Simbol dimensi untuk besaran waktu adalah...', options: [{ id: 'A', label: '[M]' }, { id: 'B', label: '[L]' }, { id: 'C', label: '[T]' }, { id: 'D', label: '[N]' }], correctAnswer: 'C', explanation: 'Dimensi waktu disimbolkan dengan [T] (Time).' },
      { id: 'l3_q4', question: 'Dimensi dari kecepatan [v] adalah...', options: [{ id: 'A', label: '[L]' }, { id: 'B', label: '[LT⁻¹]' }, { id: 'C', label: '[LT⁻²]' }, { id: 'D', label: '[MLT⁻¹]' }], correctAnswer: 'B', explanation: 'v = m/s -> [L][T]⁻¹ = [LT⁻¹].' },
      { id: 'l3_q5', question: 'Dimensi dari percepatan [a] adalah...', options: [{ id: 'A', label: '[LT⁻¹]' }, { id: 'B', label: '[LT⁻²]' }, { id: 'C', label: '[MLT⁻²]' }, { id: 'D', label: '[L²T⁻²]' }], correctAnswer: 'B', explanation: 'a = m/s² -> [L][T]⁻² = [LT⁻²].' },
      { id: 'l3_q6', question: 'Dimensi dari gaya [F = m · a] adalah...', options: [{ id: 'A', label: '[MLT⁻¹]' }, { id: 'B', label: '[MLT⁻²]' }, { id: 'C', label: '[ML²T⁻²]' }, { id: 'D', label: '[ML⁻¹T⁻²]' }], correctAnswer: 'B', explanation: 'F = kg·m/s² -> [M][L][T]⁻² = [MLT⁻²].' },
      { id: 'l3_q7', question: 'Dimensi dari usaha atau energi [W = F · s] adalah...', options: [{ id: 'A', label: '[MLT⁻²]' }, { id: 'B', label: '[ML²T⁻²]' }, { id: 'C', label: '[ML²T⁻³]' }, { id: 'D', label: '[ML⁻¹T⁻²]' }], correctAnswer: 'B', explanation: 'W = [MLT⁻²] x [L] = [ML²T⁻²].' },
      { id: 'l3_q8', question: 'Dimensi dari daya [P = W / t] adalah...', options: [{ id: 'A', label: '[ML²T⁻²]' }, { id: 'B', label: '[ML²T⁻³]' }, { id: 'C', label: '[MLT⁻³]' }, { id: 'D', label: '[ML³T⁻²]' }], correctAnswer: 'B', explanation: 'P = [ML²T⁻²] / [T] = [ML²T⁻³].' },
      { id: 'l3_q9', question: 'Dimensi dari tekanan [P = F / A] adalah...', options: [{ id: 'A', label: '[ML⁻¹T⁻²]' }, { id: 'B', label: '[ML⁻²T⁻²]' }, { id: 'C', label: '[MLT⁻²]' }, { id: 'D', label: '[M²LT⁻²]' }], correctAnswer: 'A', explanation: 'P = [MLT⁻²] / [L²] = [ML⁻¹T⁻²].' },
      { id: 'l3_q10', question: 'Dimensi massa jenis [ρ = m / V] adalah...', options: [{ id: 'A', label: '[ML⁻³]' }, { id: 'B', label: '[ML⁻²]' }, { id: 'C', label: '[ML⁻¹]' }, { id: 'D', label: '[ML³]' }], correctAnswer: 'A', explanation: 'ρ = kg/m³ -> [M][L]⁻³ = [ML⁻³].' },
      { id: 'l3_q11', question: 'Dimensi momentum [p = m · v] adalah...', options: [{ id: 'A', label: '[MLT⁻¹]' }, { id: 'B', label: '[MLT⁻²]' }, { id: 'C', label: '[ML²T⁻¹]' }, { id: 'D', label: '[MLT]' }], correctAnswer: 'A', explanation: 'p = kg · m/s -> [M][L][T]⁻¹ = [MLT⁻¹].' },
      { id: 'l3_q12', question: 'Manakah dua besaran yang MEMILIKI DIMENSI SAMA?', options: [{ id: 'A', label: 'Gaya dan Tekanan' }, { id: 'B', label: 'Usaha dan Energi Kinetik' }, { id: 'C', label: 'Kecepatan dan Percepatan' }, { id: 'D', label: 'Massa dan Berat' }], correctAnswer: 'B', explanation: 'Usaha dan energi keduanya berdimensi [ML²T⁻²].' },
      { id: 'l3_q13', question: 'Manakah dua besaran berikut yang juga MEMILIKI DIMENSI SAMA?', options: [{ id: 'A', label: 'Impuls dan Momentum' }, { id: 'B', label: 'Gaya dan Usaha' }, { id: 'C', label: 'Daya dan Energi' }, { id: 'D', label: 'Tekanan dan Gaya' }], correctAnswer: 'A', explanation: 'Impuls (F·Δt) dan momentum (m·v) keduanya berdimensi [MLT⁻¹].' },
      { id: 'l3_q14', question: 'Dimensi dari frekuensi [f = 1 / T] adalah...', options: [{ id: 'A', label: '[T]' }, { id: 'B', label: '[T⁻¹]' }, { id: 'C', label: '[T⁻²]' }, { id: 'D', label: '[LT⁻¹]' }], correctAnswer: 'B', explanation: 'f = 1/s -> [T]⁻¹ = [T⁻¹].' },
      { id: 'l3_q15', question: 'Besaran yang berdimensi [M][L]⁻¹[T]⁻² adalah...', options: [{ id: 'A', label: 'Gaya' }, { id: 'B', label: 'Tekanan' }, { id: 'C', label: 'Energi' }, { id: 'D', label: 'Massa Jenis' }], correctAnswer: 'B', explanation: 'Tekanan P = F/A berdimensi [ML⁻¹T⁻²].' },
      { id: 'l3_q16', question: 'Besaran yang TIDAK MEMILIKI DIMENSI adalah...', options: [{ id: 'A', label: 'Regangan (Strain)' }, { id: 'B', label: 'Tegangan (Stress)' }, { id: 'C', label: 'Modulus Young' }, { id: 'D', label: 'Tekanan' }], correctAnswer: 'A', explanation: 'Regangan = ΔL / L₀ (perbandingan dua panjang), sehingga tidak berdimensi.' },
      { id: 'l3_q17', question: 'Dimensi dari muatan listrik [Q = I · t] adalah...', options: [{ id: 'A', label: '[I][T]' }, { id: 'B', label: '[I][T⁻¹]' }, { id: 'C', label: '[I⁻¹][T]' }, { id: 'D', label: '[M][I][T]' }], correctAnswer: 'A', explanation: 'Q = Ampere x detik -> [I][T].' },
      { id: 'l3_q18', question: 'Besaran yang berdimensi [M][L]²[T]⁻² adalah...', options: [{ id: 'A', label: 'Gaya' }, { id: 'B', label: 'Usaha / Energi' }, { id: 'C', label: 'Daya' }, { id: 'D', label: 'Momentum' }], correctAnswer: 'B', explanation: 'Usaha dan energi berdimensi [ML²T⁻²].' },
      { id: 'l3_q19', question: 'Dimensi konstantas gravitasi umum G pada persamaan F = G·(m₁m₂)/r² adalah...', options: [{ id: 'A', label: '[M⁻¹L³T⁻²]' }, { id: 'B', label: '[ML³T⁻²]' }, { id: 'C', label: '[M⁻¹L²T⁻²]' }, { id: 'D', label: '[M⁻²L³T⁻¹]' }], correctAnswer: 'A', explanation: 'G = F·r² / (m₁m₂) -> [MLT⁻²][L²] / [M²] = [M⁻¹L³T⁻²].' },
      { id: 'l3_q20', question: 'Dimensi konstanta pegas [k = F / Δx] adalah...', options: [{ id: 'A', label: '[MT⁻²]' }, { id: 'B', label: '[MLT⁻²]' }, { id: 'C', label: '[ML⁻¹T⁻²]' }, { id: 'D', label: '[MT⁻¹]' }], correctAnswer: 'A', explanation: 'k = [MLT⁻²] / [L] = [MT⁻²].' }
    ],

    LEVEL_04: [
      { id: 'l4_q1', question: 'Persamaan posisi benda: x = v₀ · t + ½ a · t². Apakah persamaan tersebut konsisten secara dimensional?', options: [{ id: 'A', label: 'Konsisten, karena setiap suku berdimensi [L]' }, { id: 'B', label: 'Tidak konsisten, karena suku ½ at² berdimensi [LT]' }, { id: 'C', label: 'Tidak konsisten, karena koefisien ½ mengubah dimensi' }, { id: 'D', label: 'Konsisten, karena setiap suku berdimensi [LT⁻¹]' }], correctAnswer: 'A', explanation: 'x=[L], v₀t=[LT⁻¹][T]=[L], ½at²=[LT⁻²][T²]=[L]. Semua suku berdimensi [L].' },
      { id: 'l4_q2', question: 'Persamaan Energi Kinetik: Ek = ½ m · v². Analisis dimensional menunjukkan Ek berdimensi...', options: [{ id: 'A', label: '[MLT⁻¹]' }, { id: 'B', label: '[ML²T⁻²]' }, { id: 'C', label: '[ML²T⁻¹]' }, { id: 'D', label: '[MLT⁻²]' }], correctAnswer: 'B', explanation: 'Ek = [M] · ([LT⁻¹])² = [ML²T⁻²] (konsisten dengan dimensi Usaha).' },
      { id: 'l4_q3', question: 'Persamaan v² = v₀² + 2 a · x. Dimensi dari suku 2 a · x adalah...', options: [{ id: 'A', label: '[L²T⁻²]' }, { id: 'B', label: '[LT⁻²]' }, { id: 'C', label: '[L²T⁻¹]' }, { id: 'D', label: '[LT⁻¹]' }], correctAnswer: 'A', explanation: '2ax = [LT⁻²] · [L] = [L²T⁻²] (konsisten dengan v² = [LT⁻¹]² = [L²T⁻²]).' },
      { id: 'l4_q4', question: 'Sebuah rumus gaya gesek udara dinyatakan F = k · v. Dimensi dari konstanta k adalah...', options: [{ id: 'A', label: '[MT⁻¹]' }, { id: 'B', label: '[MLT⁻¹]' }, { id: 'C', label: '[MT⁻²]' }, { id: 'D', label: '[M/L]' }], correctAnswer: 'A', explanation: 'k = F / v -> [MLT⁻²] / [LT⁻¹] = [MT⁻¹].' },
      { id: 'l4_q5', question: 'Jika P = F / A dan F = m · a, tentukan dimensi P dari persamaan tersebut!', options: [{ id: 'A', label: '[ML⁻¹T⁻²]' }, { id: 'B', label: '[ML⁻²T⁻²]' }, { id: 'C', label: '[ML²T⁻²]' }, { id: 'D', label: '[MLT⁻²]' }], correctAnswer: 'A', explanation: 'P = [MLT⁻²] / [L²] = [ML⁻¹T⁻²].' },
      { id: 'l4_q6', question: 'Periode ayunan sederhana T = 2π √(l/g). Dimensi ruas kanan 2π √(l/g) adalah...', options: [{ id: 'A', label: '[T]' }, { id: 'B', label: '[T⁻¹]' }, { id: 'C', label: '[L]' }, { id: 'D', label: '[LT⁻¹]' }], correctAnswer: 'A', explanation: '√( [L] / [LT⁻²] ) = √( [T²] ) = [T]. Konsisten dengan T [T].' },
      { id: 'l4_q7', question: 'Manakah persamaan fisika berikut yang SALAH secara dimensional?', options: [{ id: 'A', label: 'v = a · t' }, { id: 'B', label: 'F = m · v' }, { id: 'C', label: 'W = F · s' }, { id: 'D', label: 'P = W / t' }], correctAnswer: 'B', explanation: 'F=[MLT⁻²], sedangkan m·v=[MLT⁻¹]. Persamaan F = m·v salah dimensional (seharusnya F = m·a atau p = m·v).' },
      { id: 'l4_q8', question: 'Persamaan gelombang v = f · λ. Apakah persamaan ini konsisten dimensional?', options: [{ id: 'A', label: 'Ya, kedua ruas berdimensi [LT⁻¹]' }, { id: 'B', label: 'Tidak, ruas kanan berdimensi [LT]' }, { id: 'C', label: 'Tidak, f berdimensi [T]' }, { id: 'D', label: 'Ya, kedua ruas berdimensi [L]' }], correctAnswer: 'A', explanation: 'v = [LT⁻¹], f · λ = [T⁻¹] · [L] = [LT⁻¹]. Konsisten!' },
      { id: 'l4_q9', question: 'Dalam rumus E = m · c², jika m adalah massa dan c adalah kecepatan cahaya, dimensi E adalah...', options: [{ id: 'A', label: '[ML²T⁻²]' }, { id: 'B', label: '[MLT⁻²]' }, { id: 'C', label: '[ML²T⁻¹]' }, { id: 'D', label: '[M²L²T⁻²]' }], correctAnswer: 'A', explanation: 'E = [M] · [LT⁻¹]² = [ML²T⁻²] (dimensi Energi).' },
      { id: 'l4_q10', question: 'Tentukan dimensi dari koefisien viskositas η pada rumus Stokes F = 6π · η · r · v !', options: [{ id: 'A', label: '[ML⁻¹T⁻¹]' }, { id: 'B', label: '[ML⁻²T⁻¹]' }, { id: 'C', label: '[MLT⁻¹]' }, { id: 'D', label: '[M⁻¹L⁻¹T⁻¹]' }], correctAnswer: 'A', explanation: 'η = F / (r · v) -> [MLT⁻²] / ([L] · [LT⁻¹]) = [ML⁻¹T⁻¹].' },
      { id: 'l4_q11', question: 'Gaya gravitasi F = G (m₁ m₂) / r². Satuan dari konstanta G adalah...', options: [{ id: 'A', label: 'N·m²/kg²' }, { id: 'B', label: 'N·kg²/m²' }, { id: 'C', label: 'N·m/kg' }, { id: 'D', label: 'N·m²/kg' }], correctAnswer: 'A', explanation: 'G = F · r² / (m₁ m₂) -> N·m²/kg².' },
      { id: 'l4_q12', question: 'Persamaan P = P₀ + ρ · g · h. Dimensi suku ρ · g · h adalah...', options: [{ id: 'A', label: '[ML⁻¹T⁻²]' }, { id: 'B', label: '[ML⁻²T⁻²]' }, { id: 'C', label: '[MLT⁻²]' }, { id: 'D', label: '[ML²T⁻²]' }], correctAnswer: 'A', explanation: 'ρgh = [ML⁻³] · [LT⁻²] · [L] = [ML⁻¹T⁻²] (sama dengan dimensi Tekanan P).' },
      { id: 'l4_q13', question: 'Sebuah benda bergerak dengan persamaan v = A + B·t. Dimensi konstan B adalah...', options: [{ id: 'A', label: '[LT⁻²]' }, { id: 'B', label: '[LT⁻¹]' }, { id: 'C', label: '[L]' }, { id: 'D', label: '[T⁻¹]' }], correctAnswer: 'A', explanation: 'Suku B·t harus berdimensi v [LT⁻¹]. Maka B = [LT⁻¹]/[T] = [LT⁻²] (percepatan).' },
      { id: 'l4_q14', question: 'Persamaan massa jenis gas p·V = n·R·T. Dimensi dari n·R·T setara dengan dimensi...', options: [{ id: 'A', label: 'Energi / Usaha' }, { id: 'B', label: 'Gaya' }, { id: 'C', label: 'Daya' }, { id: 'D', label: 'Massa' }], correctAnswer: 'A', explanation: 'p·V = (N/m²) · m³ = N·m = Joule (Energi/Usaha).' },
      { id: 'l4_q15', question: 'Persamaan lintasan s = A + B·t + C·t². Dimensi dari konstanta C adalah...', options: [{ id: 'A', label: '[LT⁻²]' }, { id: 'B', label: '[LT⁻¹]' }, { id: 'C', label: '[L]' }, { id: 'D', label: '[T⁻²]' }], correctAnswer: 'A', explanation: 'C·t² = [L] -> C = [L]/[T²] = [LT⁻²].' },
      { id: 'l4_q16', question: 'Energi potensial pegas Ep = ½ k · x². Dimensi konstanta pegas k adalah...', options: [{ id: 'A', label: '[MT⁻²]' }, { id: 'B', label: '[MLT⁻²]' }, { id: 'C', label: '[ML²T⁻²]' }, { id: 'D', label: '[MT⁻¹]' }], correctAnswer: 'A', explanation: 'k = Ep / x² -> [ML²T⁻²] / [L²] = [MT⁻²].' },
      { id: 'l4_q17', question: 'Sebuah gaya F dinyatakan sebagai F = A·t⁻¹ + B·x. Dimensi A adalah...', options: [{ id: 'A', label: '[MLT⁻¹]' }, { id: 'B', label: '[MLT⁻²]' }, { id: 'C', label: '[MLT⁻³]' }, { id: 'D', label: '[ML²T⁻¹]' }], correctAnswer: 'A', explanation: 'A·t⁻¹ = F -> A·[T]⁻¹ = [MLT⁻²] -> A = [MLT⁻¹].' },
      { id: 'l4_q18', question: 'Rumus impuls I = F · Δt. Apakah I dan momentum p = m · v memiliki dimensi yang sejenis?', options: [{ id: 'A', label: 'Ya, keduanya berdimensi [MLT⁻¹]' }, { id: 'B', label: 'Tidak, I berdimensi [MLT⁻²]' }, { id: 'C', label: 'Tidak, p berdimensi [ML²T⁻¹]' }, { id: 'D', label: 'Ya, keduanya berdimensi [MLT⁻²]' }], correctAnswer: 'A', explanation: 'I = [MLT⁻²]·[T] = [MLT⁻¹]. p = [M]·[LT⁻¹] = [MLT⁻¹]. Sama!' },
      { id: 'l4_q19', question: 'Jika rapat arus J = I / A, tentukan dimensi J!', options: [{ id: 'A', label: '[I][L⁻²]' }, { id: 'B', label: '[I][L⁻¹]' }, { id: 'C', label: '[I][L²]' }, { id: 'D', label: '[I][T⁻¹]' }], correctAnswer: 'A', explanation: 'J = Ampere / m² -> [I][L⁻²].' },
      { id: 'l4_q20', question: 'Besaran X memiliki satuan kg·m²/s³. Besaran X adalah...', options: [{ id: 'A', label: 'Daya' }, { id: 'B', label: 'Energi' }, { id: 'C', label: 'Gaya' }, { id: 'D', label: 'Tekanan' }], correctAnswer: 'A', explanation: 'kg·m²/s³ = Joule/detik = Watt (Daya).' }
    ],

    LEVEL_05: [
      { id: 'l5_q1', question: '🔥 BOSS CHALLENGE 1: Sebuah kelompok peneliti di Lab FIVIA 2045 menemukan rumus gaya angkat sayap pesawat: F = ½ C · ρ · A · v² (C=tanpa dimensi, ρ=massa jenis, A=luas, v=kecepatan). Analisis dimensional membuktikan rumus ini...', options: [{ id: 'A', label: 'BENAR, karena ruas kanan berdimensi [MLT⁻²]' }, { id: 'B', label: 'SALAH, karena ruas kanan berdimensi [ML²T⁻²]' }, { id: 'C', label: 'SALAH, karena ρ berdimensi [ML⁻²]' }, { id: 'D', label: 'BENAR, karena ruas kanan berdimensi [MLT⁻¹]' }], correctAnswer: 'A', explanation: 'ρ·A·v² = [ML⁻³] · [L²] · [L²T⁻²] = [MLT⁻²] (dimensi Gaya). Rumus konsisten!' },
      { id: 'l5_q2', question: '🔥 BOSS CHALLENGE 2: Kecepatan gelombang transversal pada dawai memenuhi v = √(F / μ), dengan F=gaya dan μ=massa per satuan panjang. Apakah rumus ini konsisten?', options: [{ id: 'A', label: 'Konsisten, karena √( [MLT⁻²] / [ML⁻¹] ) = √( [L²T⁻²] ) = [LT⁻¹]' }, { id: 'B', label: 'Tidak konsisten, ruas kanan berdimensi [LT⁻²]' }, { id: 'C', label: 'Tidak konsisten, ruas kanan berdimensi [L]' }, { id: 'D', label: 'Konsisten, kedua ruas berdimensi [L²T⁻²]' }], correctAnswer: 'A', explanation: '√( [MLT⁻²] / [ML⁻¹] ) = √( [L²T⁻²] ) = [LT⁻¹] (Kecepatan).' },
      { id: 'l5_q3', question: '🔥 BOSS CHALLENGE 3: Tekanan hidrostatis P = ρ · g · h. Jika massa jenis ρ=1000 kg/m³, g=10 m/s², h=2 m, berapakah P dalam satuan SI Pascal?', options: [{ id: 'A', label: '20.000 Pa' }, { id: 'B', label: '2.000 Pa' }, { id: 'C', label: '200.000 Pa' }, { id: 'D', label: '200 Pa' }], correctAnswer: 'A', explanation: 'P = 1000 x 10 x 2 = 20.000 N/m² = 20.000 Pa.' },
      { id: 'l5_q4', question: '🔥 BOSS CHALLENGE 4: Persamaan Bernoulli: P + ½ ρ v² + ρ g h = Konstan. Apakah ketiga suku memiliki dimensi yang sama?', options: [{ id: 'A', label: 'Ya, ketiganya berdimensi Tekanan [ML⁻¹T⁻²]' }, { id: 'B', label: 'Tidak, suku ½ ρ v² berdimensi Energi [ML²T⁻²]' }, { id: 'C', label: 'Tidak, suku ρ g h berdimensi Gaya [MLT⁻²]' }, { id: 'D', label: 'Ya, ketiganya berdimensi Daya [ML²T⁻³]' }], correctAnswer: 'A', explanation: 'P, ½ρv², dan ρgh ketiganya berdimensi [ML⁻¹T⁻²] (Tekanan/Energi per volume).' },
      { id: 'l5_q5', question: '🔥 BOSS CHALLENGE 5: Periode osilasi pegas T = 2π √(m / k). Jika m berdimensi [M] dan k berdimensi [MT⁻²], buktikan dimensi T!', options: [{ id: 'A', label: '√( [M] / [MT⁻²] ) = √( [T²] ) = [T]' }, { id: 'B', label: '√( [M] / [MT⁻²] ) = [T⁻¹]' }, { id: 'C', label: '[LT⁻¹]' }, { id: 'D', label: '[MLT]' }], correctAnswer: 'A', explanation: 'm/k = [M]/[MT⁻²] = [T²], dakar kuadratkan -> [T]. Persamaan tepat!' },
      { id: 'l5_q6', question: '🔥 BOSS CHALLENGE 6: Sebuah mobil ber-massa 1000 kg bergerak dari diam dengan percepatan 2 m/s² selama 5 detik. Berapakah usaha total yang dilakukan mesin mobil?', options: [{ id: 'A', label: '50.000 Joule' }, { id: 'B', label: '25.000 Joule' }, { id: 'C', label: '100.000 Joule' }, { id: 'D', label: '10.000 Joule' }], correctAnswer: 'A', explanation: 'v = a·t = 2x5 = 10 m/s. W = Ek = ½ m v² = ½(1000)(10²) = 50.000 J.' },
      { id: 'l5_q7', question: '🔥 BOSS CHALLENGE 7: Manakah di bawah ini kelompok tiga besaran yang seluruhnya MEMILIKI DIMENSI SAMA?', options: [{ id: 'A', label: 'Usaha, Energi Kinetik, Energi Potensial' }, { id: 'B', label: 'Gaya, Tekanan, Momen Gaya' }, { id: 'C', label: 'Impuls, Momentum, Gaya' }, { id: 'D', label: 'Kecepatan, Percepatan, Kelajuan' }], correctAnswer: 'A', explanation: 'Usaha, Ek, dan Ep ketiganya berdimensi [ML²T⁻²].' },
      { id: 'l5_q8', question: '🔥 BOSS CHALLENGE 8: Kecepatan lepas planet v = √(2 G M / R). Dimensi ruas kanan adalah...', options: [{ id: 'A', label: '[LT⁻¹]' }, { id: 'B', label: '[LT⁻²]' }, { id: 'C', label: '[L²T⁻²]' }, { id: 'D', label: '[MLT⁻¹]' }], correctAnswer: 'A', explanation: 'G=[M⁻¹L³T⁻²], M=[M], R=[L] -> G M / R = [L²T⁻²]. Akar kuadrat -> [LT⁻¹].' },
      { id: 'l5_q9', question: '🔥 BOSS CHALLENGE 9: Kalor jenis c didefinisikan Q = m · c · ΔT. Satuan SI untuk c adalah...', options: [{ id: 'A', label: 'J / (kg·K)' }, { id: 'B', label: 'J · kg / K' }, { id: 'C', label: 'J / K' }, { id: 'D', label: 'kg·K / J' }], correctAnswer: 'A', explanation: 'c = Q / (m · ΔT) -> J / (kg · K).' },
      { id: 'l5_q10', question: '🔥 BOSS CHALLENGE 10: Dimensi dari kalor jenis [c = J / (kg·K)] adalah...', options: [{ id: 'A', label: '[L²T⁻²θ⁻¹]' }, { id: 'B', label: '[ML²T⁻²θ⁻¹]' }, { id: 'C', label: '[LT⁻²θ⁻¹]' }, { id: 'D', label: '[M⁻¹L²T⁻²θ]' }], correctAnswer: 'A', explanation: 'c = [ML²T⁻²] / ([M][θ]) = [L²T⁻²θ⁻¹].' },
      { id: 'l5_q11', question: '🔥 BOSS CHALLENGE 11: Daya listrik P = V · I dan V = I · R. Maka daya dapat dinyatakan P = I² · R. Dimensi hambatan R adalah...', options: [{ id: 'A', label: '[ML²T⁻³I⁻²]' }, { id: 'B', label: '[ML²T⁻²I⁻¹]' }, { id: 'C', label: '[MLT⁻³I⁻²]' }, { id: 'D', label: '[M⁻¹L²T⁻³I⁻²]' }], correctAnswer: 'A', explanation: 'R = P / I² -> [ML²T⁻³] / [I²] = [ML²T⁻³I⁻²].' },
      { id: 'l5_q12', question: '🔥 BOSS CHALLENGE 12: Sebuah bola ber-massa 2 kg jatuh bebas dari ketinggian 10 m (g=10 m/s²). Energi mekanik bola saat berada di ketinggian 4 m adalah...', options: [{ id: 'A', label: '200 Joule' }, { id: 'B', label: '80 Joule' }, { id: 'C', label: '120 Joule' }, { id: 'D', label: '400 Joule' }], correctAnswer: 'A', explanation: 'Hukum Kekekalan Energi Mekanik: Em = Ep awal = m·g·h = 2x10x10 = 200 J.' },
      { id: 'l5_q13', question: '🔥 BOSS CHALLENGE 13: Hukum Stefan-Boltzmann menyatakan daya radiasi E = σ · A · T⁴. Tentukan dimensi konstanta σ !', options: [{ id: 'A', label: '[MT⁻³θ⁻⁴]' }, { id: 'B', label: '[MLT⁻³θ⁻⁴]' }, { id: 'C', label: '[ML²T⁻³θ⁻⁴]' }, { id: 'D', label: '[MT⁻²θ⁻⁴]' }], correctAnswer: 'A', explanation: 'E/A = [ML²T⁻³]/[L²] = [MT⁻³]. σ = [MT⁻³] / [θ⁴] = [MT⁻³θ⁻⁴].' },
      { id: 'l5_q14', question: '🔥 BOSS CHALLENGE 14: Persamaan gelombang stasioner y = 2A sin(kx) cos(ωt). Dimensi dari hasil perkalian k · ω adalah...', options: [{ id: 'A', label: '[L⁻¹T⁻¹]' }, { id: 'B', label: '[LT⁻¹]' }, { id: 'C', label: '[L⁻¹T]' }, { id: 'D', label: '[LT]' }], correctAnswer: 'A', explanation: 'k=2π/λ -> [L⁻¹], ω=2πf -> [T⁻¹]. k·ω = [L⁻¹T⁻¹].' },
      { id: 'l5_q15', question: '🔥 BOSS CHALLENGE 15: SELESAIKAN MISI AKHIR: Manakah dari besaran berikut yang merupakan gabungan besaran turunan berdimensi [ML²T⁻²] dan ber-satuan Joule?', options: [{ id: 'A', label: 'Momen Gaya (Torsi) dan Usaha' }, { id: 'B', label: 'Gaya dan Tekanan' }, { id: 'C', label: 'Daya dan Impuls' }, { id: 'D', label: 'Kecepatan dan Percepatan' }], correctAnswer: 'A', explanation: 'Momen gaya (F·r) dan Usaha (F·s) keduanya berdimensi [ML²T⁻²].' }
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


