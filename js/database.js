/**
 * database.js
 * LocalStorage wrapper and seed data initialization for Virtual Lab Fisika SMA Indonesia
 */

const DB_PREFIX = "vlab_fisika_";

const SEED_DATA = {
  roles: [
    { id: "admin", name: "Administrator" },
    { id: "guru", name: "Guru Fisika" },
    { id: "siswa", name: "Siswa" }
  ],
  users: [
    { id: "usr_admin", email: "admin@hidayahstore.edu", password: "admin123", name: "Admin Hidayah", role: "admin" },
    { id: "usr_guru", email: "guru@hidayahstore.edu", password: "guru123", name: "Hidayat, S.Pd., M.Si.", role: "guru" },
    { id: "usr_siswa", email: "siswa@hidayahstore.edu", password: "siswa123", name: "Pasya Ramadhan", role: "siswa", classId: "cls_x1" }
  ],
  classes: [
    { id: "cls_x1", name: "Kelas X-1", teacherId: "usr_guru" },
    { id: "cls_x2", name: "Kelas X-2", teacherId: "usr_guru" },
    { id: "cls_xi1", name: "Kelas XI IPA-1", teacherId: "usr_guru" },
    { id: "cls_xi2", name: "Kelas XI IPA-2", teacherId: "usr_guru" }
  ],
  students: [
    { id: "usr_siswa", name: "Pasya Ramadhan", classId: "cls_x1", email: "siswa@hidayahstore.edu" },
    { id: "std_2", name: "Budi Santoso", classId: "cls_x1", email: "budi@hidayahstore.edu" },
    { id: "std_3", name: "Siti Aminah", classId: "cls_x1", email: "siti@hidayahstore.edu" },
    { id: "std_4", name: "Rian Wijaya", classId: "cls_x2", email: "rian@hidayahstore.edu" },
    { id: "std_5", name: "Dewi Lestari", classId: "cls_xi1", email: "dewi@hidayahstore.edu" }
  ],
  materials: [
    { id: 1, name: "Hakikat Fisika dan Metode Ilmiah", fase: "E", topic: "Definisi fisika, keselamatan kerja laboratorium, metode ilmiah.", equation: "\\text{Metode Ilmiah: Observasi} \\rightarrow \\text{Hipotesis} \\rightarrow \\text{Eksperimen} \\rightarrow \\text{Analisis} \\rightarrow \\text{Kesimpulan}", videoUrl: "https://www.youtube.com/embed/3U_yD1u7W-w", desc: "Materi ini membahas definisi fisika sebagai bagian sains, langkah-langkah penelitian ilmiah secara sistematis, serta aturan keselamatan kerja saat beraktivitas di laboratorium fisika." },
    { id: 2, name: "Pengukuran Dasar Fisika", fase: "E", topic: "Besaran, satuan SI, konversi, dimensi, pengukuran dasar, angka penting.", equation: "x = \\bar{x} \\pm \\Delta x", videoUrl: "https://www.youtube.com/embed/5U7zBscL-C4", desc: "Praktikum dasar fisika untuk melatih keterampilan proses dalam mengukur panjang dan diameter benda menggunakan Mistar, Jangka Sorong, dan Mikrometer Sekrup secara presisi." },
    { id: 3, name: "Usaha dan Energi", fase: "E", topic: "Bentuk energi, hukum kekekalan energi, usaha, daya.", equation: "E_m = E_k + E_p = \\text{konstan}, \\quad W = F \\cdot s, \\quad P = \\frac{W}{t}", videoUrl: "https://www.youtube.com/embed/4yZgHwIuIac", desc: "Materi ini mempelajari bentuk-bentuk energi (kinetik, potensial, mekanik), pembuktian Hukum Kekekalan Energi Mekanik, konsep usaha sebagai transfer energi, dan daya sebagai laju energi." },
    { id: 4, name: "Lingkungan dan Energi Terbarukan", fase: "E", topic: "Krisis energi, sumber energi alternatif, dampak lingkungan.", equation: "P_{\\text{wind}} = \\frac{1}{2} \\rho A v^3, \\quad P_{\\text{solar}} = \\eta A I", videoUrl: "https://www.youtube.com/embed/Rk_sAHhGs_A", desc: "Materi ini membahas isu krisis energi fosil, mengeksplorasi sumber energi bersih (panel surya, angin, air), serta dampaknya terhadap kelestarian lingkungan hidup." },
    { id: 5, name: "Pemanasan Global", fase: "E", topic: "Efek rumah kaca, peningkatan CO2, perubahan iklim, solusi.", equation: "\\text{Efek Rumah Kaca: } \\text{CO}_2 \\uparrow \\Rightarrow \\text{Suhu Global} \\uparrow", videoUrl: "https://www.youtube.com/embed/1vRszhFjRxs", desc: "Materi ini mengkaji mekanisme efek rumah kaca secara fisis, menganalisis korelasi peningkatan gas rumah kaca seperti CO2 terhadap kenaikan suhu bumi, serta merancang solusi pencegahan perubahan iklim." }
  ],
  labs: [
    { id: 1, name: "Laboratorium Keselamatan Kerja & Metode Ilmiah", materialId: 1, type: "scientific_method" },
    { id: 2, name: "Pengukuran Dasar Fisika", materialId: 2, type: "measurement" },
    { id: 3, name: "Energi Kinetik & Ramp Skater", materialId: 3, type: "skate_ramp" },
    { id: 4, name: "Turbin Angin & Panel Surya", materialId: 4, type: "wind_solar" },
    { id: 5, name: "Temperatur Rumah Kaca (CO2)", materialId: 5, type: "greenhouse" }
  ],
  worksheets: [
    {
      id: "lkpd_1",
      labId: 1,
      tujuan: "Menganalisis bahaya simbol keselamatan laboratorium dan membuktikan hubungan antara volume cairan dengan waktu mendidih dalam eksperimen metode ilmiah.",
      pertanyaan: [
        { id: "q1", text: "Apa fungsi dari simbol 'Corrosive' (korosif) pada botol bahan kimia dan bagaimana tindakan penanganan jika terkena kulit?", type: "text" },
        { id: "q2", text: "Berdasarkan data eksperimen pemanasan air, jelaskan variabel bebas, variabel terikat, dan variabel kontrol dari praktikum tersebut!", type: "text" },
        { id: "q3", text: "Mengapa volume cairan yang lebih besar membutuhkan waktu pemanasan lebih lama untuk mencapai titik didih? Jelaskan hubungannya dengan kalor jenis!", type: "text" }
      ]
    },
    {
      id: "lkpd_2",
      labId: 2,
      tujuan: "Mengukur diameter kelereng, kawat tembaga, dan ketebalan plat seng menggunakan jangka sorong dan mikrometer sekrup, serta menerapkan aturan angka penting.",
      pertanyaan: [
        { id: "q1", text: "Bandingkan tingkat ketelitian jangka sorong (0.1 mm) dan mikrometer sekrup (0.01 mm). Manakah yang lebih cocok untuk mengukur diameter kawat tipis? Jelaskan!", type: "text" },
        { id: "q2", text: "Jika hasil pengukuran jangka sorong menunjukkan SU = 12 mm dan skala nonius berhimpit pada garis ke-4, berapakah hasil pengukurannya dan berapa jumlah angka pentingnya?", type: "text" },
        { id: "q3", text: "Mengapa dalam pengukuran ilmiah diwajibkan menuliskan nilai ketidakpastian pengukuran (galat)?", type: "text" }
      ]
    },
    {
      id: "lkpd_3",
      labId: 3,
      tujuan: "Membuktikan Hukum Kekekalan Energi Mekanik pada pemain skateboard yang meluncur di lintasan melengkung (Ramp Skater).",
      pertanyaan: [
        { id: "q1", text: "Pada posisi manakah di sepanjang ramp skater energi potensial bernilai maksimum dan energi kinetik bernilai minimum?", type: "text" },
        { id: "q2", text: "Jelaskan pengaruh keberadaan gaya gesekan (friction) terhadap energi mekanik total sistem meluncur! Kemana hilangnya energi tersebut?", type: "text" },
        { id: "q3", text: "Jika masa skater ditambahkan menjadi dua kali lipat pada lintasan tanpa gesekan, apakah kecepatan maksimum skater di titik terendah akan berubah? Buktikan secara matematis!", type: "text" }
      ]
    },
    {
      id: "lkpd_4",
      labId: 4,
      tujuan: "Mengevaluasi efisiensi daya listrik yang dihasilkan dari turbin angin dan panel surya sebagai alternatif energi bersih.",
      pertanyaan: [
        { id: "q1", text: "Bagaimanakah pengaruh kecepatan angin terhadap daya listrik yang dihasilkan turbin angin? Jelaskan hubungan pangkat tiga kecepatan angin!", type: "text" },
        { id: "q2", text: "Faktor apa saja yang memengaruhi daya keluaran panel surya? Bagaimana pengaruh sudut kemiringan panel dan tutupan awan?", type: "text" },
        { id: "q3", text: "Mengapa pemanfaatan energi terbarukan seperti angin dan surya dapat mengurangi dampak kerusakan lingkungan dibandingkan energi fosil?", type: "text" }
      ]
    },
    {
      id: "lkpd_5",
      labId: 5,
      tujuan: "Menganalisis mekanisme efek rumah kaca dan hubungannya dengan konsentrasi gas CO2 terhadap kenaikan suhu global.",
      pertanyaan: [
        { id: "q1", text: "Jelaskan bagaimana gas karbon dioksida (CO2) di atmosfer dapat memerangkap radiasi panas bumi (sinar infra merah) sehingga menaikkan suhu global!", type: "text" },
        { id: "q2", text: "Berdasarkan pengamatan visual pada simulasi, apa dampak kenaikan suhu global di atas 30 derajat Celcius terhadap kondisi daratan dan es kutub bumi?", type: "text" },
        { id: "q3", text: "Rancanglah 3 solusi nyata berbasis sains teknologi untuk menekan emisi gas rumah kaca di lingkungan sekitar Anda!", type: "text" }
      ]
    }
  ],
  quizzes: [
    {
      id: "quiz_1",
      materialId: 1,
      questions: [
        {
          id: "q1",
          question: "Manakah yang merupakan langkah awal dalam metode ilmiah setelah melakukan observasi fenomena dan menemukan suatu kejanggalan?",
          options: [
            "Merumuskan hipotesis jawaban sementara",
            "Menarik kesimpulan hasil penelitian",
            "Merumuskan masalah penelitian secara terukur",
            "Mempublikasikan hasil eksperimen"
          ],
          correct: 2,
          explanation: "Setelah mengamati suatu fenomena, peneliti akan merumuskan masalah yang ingin dipecahkan, barulah merumuskan hipotesis (jawaban sementara) untuk diuji."
        },
        {
          id: "q2",
          question: "Saat bekerja dengan larutan asam kuat pekat di laboratorium, tindakan keselamatan manakah yang paling tepat?",
          options: [
            "Bekerja di area terbuka tanpa menggunakan sarung tangan",
            "Mereaksikan larutan di dalam lemari asam dengan memakai jas lab, kacamata pelindung, dan sarung tangan",
            "Menghirup uapnya langsung untuk memastikan konsentrasi asam",
            "Mencampur air langsung ke dalam wadah asam pekat dengan cepat"
          ],
          correct: 1,
          explanation: "Asam kuat pekat bersifat korosif dan uapnya berbahaya, sehingga harus direaksikan di dalam lemari asam dengan APD lengkap. Jangan pernah menuangkan air langsung ke asam pekat karena reaksi bersifat eksotermik dahsyat."
        },
        {
          id: "q3",
          question: "Simbol bahaya berupa gambar tengkorak dan tulang silang pada botol bahan kimia mengindikasikan bahwa bahan tersebut bersifat...",
          options: [
            "Mudah meledak (Explosive)",
            "Korosif dan merusak logam (Corrosive)",
            "Beracun jika terhirup atau tertelan (Toxic)",
            "Mudah terbakar (Flammable)"
          ],
          correct: 2,
          explanation: "Simbol tengkorak melambangkan bahan kimia beracun (Toxic) yang dapat menyebabkan sakit keras bahkan kematian jika masuk ke dalam tubuh."
        },
        {
          id: "q4",
          question: "Seorang siswa ingin meneliti pengaruh suhu air terhadap kelarutan garam dapur. Dalam eksperimen ini, variabel bebas yang diatur oleh siswa adalah...",
          options: [
            "Suhu air pemanas",
            "Waktu larutnya garam",
            "Jumlah garam yang dilarutkan",
            "Jenis wadah gelas beker"
          ],
          correct: 0,
          explanation: "Variabel bebas (independent variable) adalah variabel yang sengaja diubah-ubah oleh peneliti untuk melihat pengaruhnya, dalam hal ini adalah suhu air."
        },
        {
          id: "q5",
          question: "Pernyataan fisis berupa gagasan ilmiah yang didasarkan pada kumpulan fakta empiris kuat dan telah diuji kebenarannya secara berulang melalui eksperimen teruji dinamakan...",
          options: [
            "Hipotesis ilmiah",
            "Teori fisika",
            "Hukum alam",
            "Fakta fisis"
          ],
          correct: 1,
          explanation: "Teori fisika menjelaskan 'mengapa' dan 'bagaimana' suatu fenomena terjadi berdasarkan sekumpulan hukum, hipotesis yang telah diuji, dan fakta empiris."
        }
      ]
    },
    {
      id: "quiz_2",
      materialId: 2,
      questions: [
        {
          id: "q1",
          question: "Manakah kelompok besaran di bawah ini yang semuanya merupakan besaran pokok dalam SI?",
          options: [
            "Kecepatan, Gaya, Massa",
            "Massa, Suhu, Panjang, Kuat Arus",
            "Volume, Intensitas Cahaya, Waktu",
            "Usaha, Tegangan Listrik, Percepatan"
          ],
          correct: 1,
          explanation: "Besaran pokok terdiri dari 7: Panjang (m), Massa (kg), Waktu (s), Suhu (K), Kuat Arus (A), Intensitas Cahaya (cd), dan Jumlah Zat (mol)."
        },
        {
          id: "q2",
          question: "Hasil pengukuran diameter sebuah koin logam menggunakan jangka sorong menunjukkan nilai 24.3 mm. Jika ditulis dalam Satuan Internasional (SI), nilai tersebut setara dengan...",
          options: [
            "0.243 m",
            "0.0243 m",
            "0.00243 m",
            "2.43 m"
          ],
          correct: 1,
          explanation: "Dalam SI, satuan panjang adalah meter. 24.3 mm = 24.3 x 10^-3 m = 0.0243 m."
        },
        {
          id: "q3",
          question: "Berdasarkan aturan angka penting, jika kita mengalikan panjang plat seng sebesar 2.5 cm (2 angka penting) dengan lebar 12.00 cm (4 angka penting), luas plat tersebut adalah...",
          options: [
            "30 cm²",
            "30.0 cm²",
            "30.00 cm²",
            "3.0 x 10^1 cm²"
          ],
          correct: 0,
          explanation: "Hasil perkalian angka penting harus memiliki jumlah angka penting paling sedikit di antara komponen pengali. 2.5 cm (2 AP) * 12.00 cm (4 AP) = 30 cm² (ditulis 30 dengan 2 AP, di mana angka nol di kanan bilangan bulat tanpa desimal bukan AP kecuali diberi tanda khusus. Opsi '30 cm²' memiliki 2 angka penting jika dianggap bernilai eksak dari pembulatan, atau ditulis 3.0 x 10^1. Sesuai konvensi standar, 30 cm² ditulis dengan mempertahankan ketelitian pengali terkecil)."
        },
        {
          id: "q4",
          question: "Tingkat ketelitian (skala terkecil) jangka sorong standar 10 skala nonius dan mikrometer sekrup berturut-turut adalah...",
          options: [
            "1 mm dan 0.1 mm",
            "0.1 mm dan 0.01 mm",
            "0.05 mm dan 0.005 mm",
            "0.01 mm dan 0.001 mm"
          ],
          correct: 1,
          explanation: "Jangka sorong standar memiliki ketelitian 0.1 mm (0.01 cm) sedangkan mikrometer sekrup memiliki ketelitian 0.01 mm (0.001 cm)."
        },
        {
          id: "q5",
          question: "Seorang siswa mengukur ketebalan buku fisika sebanyak tiga kali dan diperoleh hasil: 1.25 cm, 1.27 cm, dan 1.23 cm. Penulisan hasil pengukuran rata-rata beserta ketidakpastiannya yang benar adalah...",
          options: [
            "(1.25 ± 0.01) cm",
            "(1.25 ± 0.02) cm",
            "(1.25 ± 0.013) cm",
            "(1.250 ± 0.010) cm"
          ],
          correct: 0,
          explanation: "Rata-rata = (1.25 + 1.27 + 1.23) / 3 = 1.25 cm. Ketidakpastian mutlak dapat diestimasi dari simpangan maksimum (atau standar deviasi): delta x = (1.27 - 1.23)/2 = 0.02 cm atau standar deviasi yang berkisar 0.01 cm. Dengan mempertahankan keselarasan desimal, diperoleh (1.25 ± 0.01) cm jika simpangan baku berkisar 0.012."
        }
      ]
    },
    {
      id: "quiz_3",
      materialId: 3,
      questions: [
        {
          id: "q1",
          question: "Sebuah bola bermassa 2 kg dilepaskan dari puncak ramp skateboard setinggi 5 meter dari tanah. Jika percepatan gravitasi g = 10 m/s², berapakah energi kinetik bola saat berada pada ketinggian 2 meter dari permukaan tanah?",
          options: [
            "100 Joule",
            "60 Joule",
            "40 Joule",
            "20 Joule"
          ],
          correct: 1,
          explanation: "Berdasarkan Kekekalan Energi Mekanik: Ek2 = Ep1 - Ep2 = m.g.(h1 - h2) = 2 kg * 10 m/s² * (5m - 2m) = 60 Joule."
        },
        {
          id: "q2",
          question: "Seorang siswa dengan sekuat tenaga mendorong lemari besi bermassa 80 kg dengan gaya 200 N. Namun lemari tersebut sama sekali tidak bergerak. Usaha yang dilakukan oleh siswa tersebut adalah...",
          options: [
            "16000 Joule",
            "200 Joule",
            "0 Joule",
            "1600 Joule"
          ],
          correct: 2,
          explanation: "Usaha (W) didefinisikan sebagai W = F * s. Karena perpindahan s = 0 (benda diam tidak bergeser), maka usaha yang dikerjakan bernilai nol Joule."
        },
        {
          id: "q3",
          question: "Jika kecepatan gerak suatu benda yang sedang meluncur bebas dilipatgandakan menjadi 3 kali semula, maka energi kinetiknya akan menjadi...",
          options: [
            "3 kali semula",
            "6 kali semula",
            "9 kali semula",
            "27 kali semula"
          ],
          correct: 2,
          explanation: "Energi Kinetik sebanding dengan kuadrat kecepatan (Ek = 1/2 m v²). Jika v menjadi 3v, maka Ek menjadi (3)² = 9 kali semula."
        },
        {
          id: "q4",
          question: "Sebuah mesin derek listrik melakukan usaha sebesar 6000 Joule untuk mengangkat beban selama 1 menit. Daya keluaran mesin derek tersebut adalah...",
          options: [
            "6000 Watt",
            "100 Watt",
            "360 Watt",
            "60 Watt"
          ],
          correct: 1,
          explanation: "Daya (P) = Usaha (W) / Waktu (t). Waktu 1 menit = 60 detik. Maka P = 6000 Joule / 60 sekon = 100 Watt."
        },
        {
          id: "q5",
          question: "Saat skater meluncur turun dari puncak ramp menuju dasar lintasan, bentuk transformasi energi yang terjadi pada sistem adalah...",
          options: [
            "Energi Kinetik berubah menjadi Energi Potensial",
            "Energi Potensial berubah menjadi Energi Kinetik",
            "Energi Termal berubah menjadi Energi Mekanik",
            "Energi Mekanik berkurang habis menjadi nol"
          ],
          correct: 1,
          explanation: "Saat posisi meluncur turun (ketinggian berkurang), energi potensial gravitasi berkurang dan diubah sepenuhnya menjadi energi kinetik (kecepatan bertambah)."
        }
      ]
    },
    {
      id: "quiz_4",
      materialId: 4,
      questions: [
        {
          id: "q1",
          question: "Pada kincir angin pembangkit listrik, faktor parameter lingkungan manakah yang paling signifikan memengaruhi daya yang dihasilkan turbin angin?",
          options: [
            "Suhu udara sekitar kincir",
            "Kecepatan angin (berbanding lurus dengan pangkat tiga)",
            "Arah hembusan angin saja",
            "Kelembapan udara di sekitar tiang"
          ],
          correct: 1,
          explanation: "Daya kinetik angin P = 1/2 * rho * A * v³. Kecepatan angin (v) masuk dalam pangkat tiga, menjadikannya faktor utama yang sangat memengaruhi efisiensi daya kincir."
        },
        {
          id: "q2",
          question: "Komponen semikonduktor pada panel surya dapat menghasilkan energi listrik searah (DC) saat terkena cahaya matahari melalui mekanisme fisis yang dinamakan...",
          options: [
            "Efek Fotovoltaik",
            "Efek Fotolistrik Klasik",
            "Efek Termoelektrik",
            "Efek Elektromagnetik"
          ],
          correct: 0,
          explanation: "Efek fotovoltaik (photovoltaic effect) adalah fenomena penggabungan muatan positif-negatif semikonduktor akibat energi foton matahari yang menghasilkan arus listrik."
        },
        {
          id: "q3",
          question: "Di bawah ini, manakah yang merupakan salah satu kelemahan utama dari pemanfaatan sumber energi alternatif angin dan surya dibandingkan bahan bakar fosil?",
          options: [
            "Menghasilkan gas CO2 yang sangat pekat",
            "Bersifat tidak konsisten / tergantung cuaca (Intermitten)",
            "Biaya bahan bakar operasional harian sangat mahal",
            "Menimbulkan polusi tanah yang permanen"
          ],
          correct: 1,
          explanation: "Energi angin dan surya bersifat intermitten (tidak selalu tersedia sepanjang waktu karena bergantung cuaca, malam hari, atau kondisi tiupan angin)."
        },
        {
          id: "q4",
          question: "Bahan bakar alternatif ramah lingkungan berupa gas atau cairan yang diproduksi dari pembusukan bahan organik (seperti kotoran hewan atau limbah pertanian) disebut...",
          options: [
            "Biomassa / Biogas",
            "Batu bara cair",
            "Geotermal",
            "Gas alam terkompresi"
          ],
          correct: 0,
          explanation: "Biogas diproduksi dari fermentasi anaerobic materi organik oleh bakteri, menghasilkan gas metana yang bersih untuk bahan bakar energi."
        },
        {
          id: "q5",
          question: "Mengapa pembangkit listrik tenaga air skala kecil (mikrohidro) dianggap ramah lingkungan?",
          options: [
            "Karena tidak membutuhkan generator listrik",
            "Karena tidak membakar bahan bakar fosil sehingga bebas emisi CO2",
            "Karena dapat menghentikan siklus air global",
            "Karena air yang keluar dari turbin langsung menguap habis"
          ],
          correct: 1,
          explanation: "Mikrohidro memanfaatkan energi potensial aliran air alami tanpa proses pembakaran karbon, sehingga bersih dari emisi gas rumah kaca."
        }
      ]
    },
    {
      id: "quiz_5",
      materialId: 5,
      questions: [
        {
          id: "q1",
          question: "Bagaimanakah mekanisme fisis efek rumah kaca yang menyebabkan peningkatan suhu rata-rata permukaan bumi?",
          options: [
            "Atmosfer menahan seluruh sinar ultraviolet masuk ke bumi",
            "Gas rumah kaca menyerap radiasi infra merah gelombang panjang yang dipantulkan bumi, lalu memancarkannya kembali ke segala arah",
            "Panas dari inti bumi bocor keluar aknat gempa",
            "Ozon bereaksi dengan gas oksigen membentuk awan hitam pekat"
          ],
          correct: 1,
          explanation: "Radiasi matahari gelombang pendek masuk menghangatkan bumi. Bumi memantulkannya kembali sebagai radiasi inframerah gelombang panjang. Gas rumah kaca menyerap gelombang panjang ini dan memerangkapnya di atmosfer."
        },
        {
          id: "q2",
          question: "Aktivitas manusia manakah yang menjadi kontributor terbesar terhadap peningkatan akumulasi emisi gas CO2 di atmosfer sejak zaman industri?",
          options: [
            "Penggunaan pupuk organik berlebih",
            "Pembakaran bahan bakar fosil (minyak bumi, batu bara) untuk industri dan transportasi",
            "Peternakan sapi skala kecil",
            "Pembangunan pembangkit listrik tenaga angin"
          ],
          correct: 1,
          explanation: "Pembakaran bahan bakar fosil melepaskan karbon yang telah terkubur jutaan tahun ke atmosfer dalam bentuk CO2 secara masif, memicu pemanasan global."
        },
        {
          id: "q3",
          question: "Kenaikan permukaan air laut global akibat pemanasan global disebabkan oleh dua proses fisis utama, yaitu...",
          options: [
            "Pencairan es kutub (glacier) dan pemuaian termal air laut akibat kenaikan suhu",
            "Tsunami yang lebih sering terjadi dan pasang air laut ekstrem",
            "Pertambahan volume air akibat reaksi oksigen dan hidrogen di udara",
            "Bocornya air dari lapisan bawah tanah ke permukaan samudra"
          ],
          correct: 0,
          explanation: "Mencairnya es daratan (glacier/ice sheet) menambah volume air laut, dikombinasikan dengan pemuaian volume air laut (thermal expansion) seiring naiknya temperatur global."
        },
        {
          id: "q4",
          question: "Mengapa gerakan penghijauan kota dan penanaman hutan kembali (reboisasi) secara ilmiah efektif menekan laju pemanasan global?",
          options: [
            "Karena daun pepohonan dapat memantulkan sinar matahari kembali ke angkasa luar",
            "Karena tumbuhan menyerap gas CO2 dari atmosfer untuk proses fotosintesis",
            "Karena akar pohon mendinginkan suhu tanah secara instan",
            "Karena pohon menghalangi angin panas berhembus"
          ],
          correct: 1,
          explanation: "Hutan bertindak sebagai carbon sink (penyerap karbon) alami yang mengubah gas CO2 di udara menjadi materi organik tumbuhan melalui fotosintesis."
        },
        {
          id: "q5",
          question: "Persetujuan internasional yang mengikat negara-negara dunia untuk menekan emisi gas rumah kaca demi menjaga kenaikan suhu global di bawah 2°C adalah...",
          options: [
            "Protokol Montreal",
            "Konvensi Jenewa",
            "Persetujuan Paris (Paris Agreement)",
            "Pakta Warsawa"
          ],
          correct: 2,
          explanation: "Persetujuan Paris (Paris Agreement) tahun 2015 disepakati secara global untuk membatasi pemanasan global di bawah 2°C (idealnya 1.5°C) dibanding tingkat pra-industri."
        }
      ]
    }
  ],
  submissions: [], // Student LKPD submissions { studentId, labId, answers: [], timestamp, score, feedback, status: 'pending'|'graded' }
  quizScores: [],  // User quiz records { userId, materialId, score, answers: [], passed, timestamp }
  certificates: [] // Certificates earned { id, userId, materialId, code, date }
};

// Auto generic LKPD generator helper for other labs
function getGenericLKPD(labId) {
  const lab = SEED_DATA.labs.find(l => l.id === labId);
  return {
    id: `lkpd_${labId}`,
    labId: labId,
    tujuan: `Mengamati fenomena fisika dan mengumpulkan data terkait ${lab ? lab.name : 'Lab'}.`,
    pertanyaan: [
      { id: "q1", text: `Bagaimanakah pengaruh perubahan nilai parameter input terhadap hasil simulasi ${lab ? lab.name : 'Lab'}?`, type: "text" },
      { id: "q2", text: "Buatlah kesimpulan singkat berdasarkan grafik dan tabel pengamatan yang telah Anda amati!", type: "text" }
    ]
  };
}

// Auto generic Quiz generator helper for other labs
function getGenericQuiz(materialId) {
  const mat = SEED_DATA.materials.find(m => m.id === materialId);
  return {
    id: `quiz_${materialId}`,
    materialId: materialId,
    questions: [
      {
        id: "q1",
        question: `Manakah konsep utama yang dipelajari pada modul ${mat ? mat.name : 'Materi'}?`,
        options: [
          `Menganalisis ${mat ? mat.topic : 'Topik'}`,
          "Menghitung rumus relativitas massa",
          "Membelokkan arah rambat bunyi",
          "Melakukan integrasi statis"
        ],
        correct: 0,
        explanation: `Modul ini secara spesifik berfokus pada ${mat ? mat.topic : 'Topik'} sesuai Kurikulum Merdeka.`
      },
      {
        id: "q2",
        question: `Persamaan manakah yang menggambarkan prinsip ${mat ? mat.name : 'Materi'}?`,
        options: [
          `$$${mat ? mat.equation : 'Persamaan'}$$`,
          "$$E = m c^2$$",
          "$$\\sin\\theta_1 = n\\lambda$$",
          "$$P = F / A$$"
        ],
        correct: 0,
        explanation: `Persamaan dasar untuk modul ini dituliskan sebagai: ${mat ? mat.equation : 'Persamaan'}.`
      }
    ]
  };
}

class LocalDatabase {
  constructor() {
    this.init();
  }

  init() {
    // Force re-seeding if code has changed
    const SEED_VERSION = "6.0";
    if (localStorage.getItem(DB_PREFIX + "seed_version") !== SEED_VERSION) {
      localStorage.removeItem(DB_PREFIX + "initialized");
      localStorage.setItem(DB_PREFIX + "seed_version", SEED_VERSION);
    }

    // Check if base seed is already initialized
    if (!localStorage.getItem(DB_PREFIX + "initialized")) {
      console.log("Seeding Virtual Lab database to localStorage...");
      this.saveTable("roles", SEED_DATA.roles);
      this.saveTable("users", SEED_DATA.users);
      this.saveTable("classes", SEED_DATA.classes);
      this.saveTable("students", SEED_DATA.students);
      this.saveTable("materials", SEED_DATA.materials);
      this.saveTable("labs", SEED_DATA.labs);
      this.saveTable("worksheets", SEED_DATA.worksheets);
      this.saveTable("quizzes", SEED_DATA.quizzes);
      this.saveTable("submissions", SEED_DATA.submissions);
      this.saveTable("quizScores", SEED_DATA.quizScores || []);
      this.saveTable("certificates", SEED_DATA.certificates || []);
      this.saveTable("detektifProgress", []);
      
      localStorage.setItem(DB_PREFIX + "initialized", "true");
    }
  }

  getTable(tableName) {
    const key = DB_PREFIX + tableName;
    const data = localStorage.getItem(key);
    if (!data) return [];
    try {
      return JSON.parse(data);
    } catch (e) {
      console.error("Error reading localStorage table: " + tableName, e);
      return [];
    }
  }

  get(tableName) {
    return this.getTable(tableName);
  }

  set(tableName, data) {
    this.saveTable(tableName, data);
  }

  saveTable(tableName, data) {
    const key = DB_PREFIX + tableName;
    localStorage.setItem(key, JSON.stringify(data));

    // Asynchronously trigger cloud sync if connected
    if (window.syncLocalChangeToCloud && Array.isArray(data)) {
      const syncable = ["submissions", "quizScores", "detektifProgress", "students", "classes", "users"];
      if (syncable.includes(tableName)) {
        data.forEach(item => {
          if (item && (item.id || item.userId || item.studentId)) {
            const syncItem = { ...item, id: item.id || item.userId || `sub_${item.studentId}_${item.labId}` };
            window.syncLocalChangeToCloud(tableName, syncItem);
          }
        });
      }
    }
  }

  // Specialized lookups
  getDetektifProgress(userId) {
    const table = this.getTable("detektifProgress");
    let progress = table.find(p => p.userId === userId);
    if (!progress) {
      progress = {
        userId: userId,
        completedMissions: [],
        xp: 0,
        badges: ["Pemula Fisika"],
        missionScores: {},
        lkpd: {
          tujuan: "Menganalisis besaran, satuan, dimensi, angka penting, serta melakukan pengukuran jangka sorong dan mikrometer sekrup untuk menyelesaikan penyelidikan ilmiah.",
          hipotesis: "",
          dataMisi4: [], // mistar, caliper, micrometer observations
          dataMisi7: {}, // final block observations
          analisis: "",
          kesimpulan: "",
          refleksi: "",
          isSubmitted: false
        },
        grades: null
      };
      table.push(progress);
      this.saveTable("detektifProgress", table);
    }
    return progress;
  }

  saveDetektifProgress(progress) {
    const table = this.getTable("detektifProgress");
    const idx = table.findIndex(p => p.userId === progress.userId);
    if (idx !== -1) {
      table[idx] = progress;
    } else {
      table.push(progress);
    }
    this.saveTable("detektifProgress", table);
    return true;
  }

  getMaterial(id) {
    const materials = this.getTable("materials");
    return materials.find(m => m.id === parseInt(id));
  }

  getLabByMaterialId(matId) {
    const labs = this.getTable("labs");
    return labs.find(l => l.materialId === parseInt(matId));
  }

  getLKPDForLab(labId) {
    const lkpds = this.getTable("worksheets");
    const lkpd = lkpds.find(w => w.labId === parseInt(labId));
    if (lkpd) return lkpd;
    // fallback to generic
    return getGenericLKPD(parseInt(labId));
  }

  getQuizForMaterial(matId) {
    const quizzes = this.getTable("quizzes");
    const quiz = quizzes.find(q => q.materialId === parseInt(matId));
    if (quiz) return quiz;
    // fallback to generic
    return getGenericQuiz(parseInt(matId));
  }

  // Scores & Submissions
  submitLKPD(submission) {
    const submissions = this.getTable("submissions");
    // Check if exists to overwrite (autosave or resubmission)
    const existingIdx = submissions.findIndex(s => s.studentId === submission.studentId && s.labId === submission.labId);
    if (existingIdx !== -1) {
      submissions[existingIdx] = { ...submissions[existingIdx], ...submission, timestamp: new Date().toISOString() };
    } else {
      submission.timestamp = new Date().toISOString();
      submissions.push(submission);
    }
    this.saveTable("submissions", submissions);
    return true;
  }

  getLKPDSubmission(studentId, labId) {
    const submissions = this.getTable("submissions");
    return submissions.find(s => s.studentId === studentId && s.labId === parseInt(labId));
  }

  getPendingSubmissions(teacherId) {
    const submissions = this.getTable("submissions");
    const students = this.getTable("students");
    const classes = this.getTable("classes");
    
    // Get teacher classes
    const teacherClasses = classes.filter(c => c.teacherId === teacherId).map(c => c.id);
    
    return submissions.map(sub => {
      const studentObj = students.find(s => s.id === sub.studentId);
      if (!studentObj || !teacherClasses.includes(studentObj.classId)) return null;
      
      const classObj = classes.find(c => c.id === studentObj.classId);
      const labs = this.getTable("labs");
      const labObj = labs.find(l => l.id === sub.labId);
      
      return {
        ...sub,
        studentName: studentObj.name,
        className: classObj ? classObj.name : "Unknown",
        labName: labObj ? labObj.name : "Unknown Lab"
      };
    }).filter(Boolean);
  }

  gradeSubmission(studentId, labId, score, feedback) {
    const submissions = this.getTable("submissions");
    const subIdx = submissions.findIndex(s => s.studentId === studentId && s.labId === parseInt(labId));
    if (subIdx !== -1) {
      submissions[subIdx].score = parseInt(score);
      submissions[subIdx].feedback = feedback;
      submissions[subIdx].status = "graded";
      this.saveTable("submissions", submissions);
      return true;
    }
    return false;
  }

  saveQuizScore(record) {
    const scores = this.getTable("quizScores");
    record.timestamp = new Date().toISOString();
    scores.push(record);
    this.saveTable("quizScores", scores);

    // If passed, generate certificate
    if (record.passed) {
      this.generateCertificate(record.userId, record.materialId);
    }
    return true;
  }

  getQuizScoresForUser(userId) {
    const scores = this.getTable("quizScores");
    return scores.filter(s => s.userId === userId);
  }

  generateCertificate(userId, materialId) {
    const certificates = this.getTable("certificates");
    const exists = certificates.find(c => c.userId === userId && c.materialId === parseInt(materialId));
    if (exists) return exists;

    const newCert = {
      id: "cert_" + Math.random().toString(36).substr(2, 9),
      userId,
      materialId: parseInt(materialId),
      code: "CERT-" + Math.floor(100000 + Math.random() * 900000),
      date: new Date().toISOString().split('T')[0]
    };
    certificates.push(newCert);
    this.saveTable("certificates", certificates);
    return newCert;
  }

  getCertificatesForUser(userId) {
    const certs = this.getTable("certificates");
    const materials = this.getTable("materials");
    return certs.filter(c => c.userId === userId).map(c => {
      const mat = materials.find(m => m.id === c.materialId);
      return {
        ...c,
        materialName: mat ? mat.name : "Unknown Topic",
        fase: mat ? mat.fase : "E/F"
      };
    });
  }
}

// Instantiate database globally
const db = new LocalDatabase();
window.db = db;
