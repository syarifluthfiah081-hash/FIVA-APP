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
    { id: "usr_guru_syarif", email: "syarifhidayatullah64@guru.sma.belajar.id", password: "Syarif121220", name: "Syarif Hidayatullah", role: "guru" },
    // Kelas X-1
    { id: "usr_std_7702", email: "ahmadnaufal@sekolah.id", password: "7702", nis: "7702", name: "AHMAD NAUFAL", studentCode: "FIVIA-X1-860", role: "siswa", classId: "cls_x1" },
    { id: "usr_std_192", email: "sulkifli@sekolah.id", password: "192", nis: "192", name: "SULKIFLI", studentCode: "FIVIA-ZJFFO", role: "siswa", classId: "cls_x1" },
    { id: "usr_std_7703", email: "adifa@sekolah.id", password: "7703", nis: "7703", name: "ADIFA KHAIRUNNIZA'A", studentCode: "FIVIA-X1-7703", role: "siswa", classId: "cls_x1" },
    { id: "usr_std_7704", email: "alvin@sekolah.id", password: "7704", nis: "7704", name: "ALVIN ABHISTA ANGGARA", studentCode: "FIVIA-X1-7704", role: "siswa", classId: "cls_x1" },
    { id: "usr_std_7705", email: "amiruddin@sekolah.id", password: "7705", nis: "7705", name: "AMIRUDDIN", studentCode: "FIVIA-X1-7705", role: "siswa", classId: "cls_x1" },
    { id: "usr_std_7706", email: "arfiandi@sekolah.id", password: "7706", nis: "7706", name: "ARFIANDI KUSUMA RAMDANA", studentCode: "FIVIA-X1-7706", role: "siswa", classId: "cls_x1" },
    { id: "usr_std_7707", email: "dzaky@sekolah.id", password: "7707", nis: "7707", name: "DZAKY RAISSA ABQARY", studentCode: "FIVIA-X1-7707", role: "siswa", classId: "cls_x1" },
    { id: "usr_std_7708", email: "egil@sekolah.id", password: "7708", nis: "7708", name: "EGIL SAPUTRA", studentCode: "FIVIA-X1-7708", role: "siswa", classId: "cls_x1" },
    { id: "usr_std_7709", email: "israfil@sekolah.id", password: "7709", nis: "7709", name: "ISRAFIL", studentCode: "FIVIA-X1-7709", role: "siswa", classId: "cls_x1" },
    { id: "usr_std_7710", email: "shaswan@sekolah.id", password: "7710", nis: "7710", name: "MOHD SHASWAN", studentCode: "FIVIA-X1-7710", role: "siswa", classId: "cls_x1" },
    { id: "usr_std_7711", email: "hidayat@sekolah.id", password: "7711", nis: "7711", name: "MUH HIDAYAT", studentCode: "FIVIA-X1-7711", role: "siswa", classId: "cls_x1" },
    { id: "usr_std_7712", email: "ridho@sekolah.id", password: "7712", nis: "7712", name: "MUH RIDHO", studentCode: "FIVIA-X1-7712", role: "siswa", classId: "cls_x1" },
    { id: "usr_std_7713", email: "ninis@sekolah.id", password: "7713", nis: "7713", name: "NINIS", studentCode: "FIVIA-X1-7713", role: "siswa", classId: "cls_x1" },
    { id: "usr_std_7714", email: "atiyah@sekolah.id", password: "7714", nis: "7714", name: "NUR ATIYAH", studentCode: "FIVIA-X1-7714", role: "siswa", classId: "cls_x1" },
    { id: "usr_std_7715", email: "azizah@sekolah.id", password: "7715", nis: "7715", name: "NUR AZIZAH PUTRI", studentCode: "FIVIA-X1-7715", role: "siswa", classId: "cls_x1" },
    { id: "usr_std_7716", email: "nurul@sekolah.id", password: "7716", nis: "7716", name: "NURUL HIDAYAH", studentCode: "FIVIA-X1-7716", role: "siswa", classId: "cls_x1" },
    { id: "usr_std_7717", email: "renaldi@sekolah.id", password: "7717", nis: "7717", name: "RENALDIANSAH", studentCode: "FIVIA-X1-7717", role: "siswa", classId: "cls_x1" },
    { id: "usr_std_7718", email: "renanda@sekolah.id", password: "7718", nis: "7718", name: "RENANDA QALBI", studentCode: "FIVIA-X1-7718", role: "siswa", classId: "cls_x1" },
    { id: "usr_std_7719", email: "shofiyya@sekolah.id", password: "7719", nis: "7719", name: "SHOFIYYA ALIYYANA PUTRI", studentCode: "FIVIA-X1-7719", role: "siswa", classId: "cls_x1" },
    // Kelas X-2
    { id: "usr_std_7701", email: "alghifari@sekolah.id", password: "7701", nis: "7701", name: "AHMAD ALGHIFARI", studentCode: "FIVIA-X2-7701", role: "siswa", classId: "cls_x2" },
    { id: "usr_std_7720", email: "mufti@sekolah.id", password: "7720", nis: "7720", name: "AHMAD MUFTI", studentCode: "FIVIA-X2-7720", role: "siswa", classId: "cls_x2" },
    { id: "usr_std_7721", email: "ahsan@sekolah.id", password: "7721", nis: "7721", name: "AHSAN RANDI SAPUTRA", studentCode: "FIVIA-X2-7721", role: "siswa", classId: "cls_x2" },
    { id: "usr_std_7722", email: "arfa@sekolah.id", password: "7722", nis: "7722", name: "ARFA ALQHAERA", studentCode: "FIVIA-X2-7722", role: "siswa", classId: "cls_x2" },
    { id: "usr_std_7723", email: "asti@sekolah.id", password: "7723", nis: "7723", name: "ASTI MEILANI PUTRI", studentCode: "FIVIA-X2-7723", role: "siswa", classId: "cls_x2" },
    { id: "usr_std_7724", email: "ghali@sekolah.id", password: "7724", nis: "7724", name: "GHALI ZHAFRAN BATARA", studentCode: "FIVIA-X2-7724", role: "siswa", classId: "cls_x2" },
    { id: "usr_std_7725", email: "hasanuddin@sekolah.id", password: "7725", nis: "7725", name: "HASANUDDIN", studentCode: "FIVIA-X2-7725", role: "siswa", classId: "cls_x2" },
    { id: "usr_std_7726", email: "khaerfinanda@sekolah.id", password: "7726", nis: "7726", name: "KHAERFINANDA", studentCode: "FIVIA-X2-7726", role: "siswa", classId: "cls_x2" },
    { id: "usr_std_7727", email: "khairum@sekolah.id", password: "7727", nis: "7727", name: "KHAIRUM MUFAHDAL", studentCode: "FIVIA-X2-7727", role: "siswa", classId: "cls_x2" },
    { id: "usr_std_7728", email: "juswadi@sekolah.id", password: "7728", nis: "7728", name: "M. JUSWADI", studentCode: "FIVIA-X2-7728", role: "siswa", classId: "cls_x2" },
    { id: "usr_std_7729", email: "fitrah@sekolah.id", password: "7729", nis: "7729", name: "MUH. FITRAH", studentCode: "FIVIA-X2-7729", role: "siswa", classId: "cls_x2" },
    { id: "usr_std_7730", email: "idris@sekolah.id", password: "7730", nis: "7730", name: "MUH. IDRIS", studentCode: "FIVIA-X2-7730", role: "siswa", classId: "cls_x2" },
    { id: "usr_std_7731", email: "thariq@sekolah.id", password: "7731", nis: "7731", name: "MUH. THARIQ KEMAL AL KATIRI H", studentCode: "FIVIA-X2-7731", role: "siswa", classId: "cls_x2" },
    { id: "usr_std_7732", email: "faqih@sekolah.id", password: "7732", nis: "7732", name: "MUHAMMAD FAQIH SYAFA'AT", studentCode: "FIVIA-X2-7732", role: "siswa", classId: "cls_x2" },
    { id: "usr_std_7733", email: "rifal@sekolah.id", password: "7733", nis: "7733", name: "MUHAMMAD RIFAL", studentCode: "FIVIA-X2-7733", role: "siswa", classId: "cls_x2" },
    { id: "usr_std_7734", email: "muthiara@sekolah.id", password: "7734", nis: "7734", name: "MUTHIARA BUSTAN", studentCode: "FIVIA-X2-7734", role: "siswa", classId: "cls_x2" },
    { id: "usr_std_7735", email: "azkiyah@sekolah.id", password: "7735", nis: "7735", name: "NUR AZKIYAH MASANGKA", studentCode: "FIVIA-X2-7735", role: "siswa", classId: "cls_x2" },
    { id: "usr_std_7736", email: "nurbaya@sekolah.id", password: "7736", nis: "7736", name: "NURBAYA", studentCode: "FIVIA-X2-7736", role: "siswa", classId: "cls_x2" },
    { id: "usr_std_7737", email: "saskia@sekolah.id", password: "7737", nis: "7737", name: "NURUL SASKIA PRADITA", studentCode: "FIVIA-X2-7737", role: "siswa", classId: "cls_x2" },
    // Demo accounts
    { id: "usr_siswa_pasya", email: "pasya@sekolah.id", password: "202401", nis: "202401", name: "Pasya Ramadhan", studentCode: "FIVIA-X1-001", role: "siswa", classId: "cls_x1" },
    { id: "usr_siswa_budi", email: "budi@sekolah.id", password: "202402", nis: "202402", name: "Budi Santoso", studentCode: "FIVIA-X1-002", role: "siswa", classId: "cls_x1" },
    { id: "usr_siswa_siti", email: "siti@sekolah.id", password: "202403", nis: "202403", name: "Siti Aminah", studentCode: "FIVIA-X1-003", role: "siswa", classId: "cls_x1" },
    { id: "usr_siswa_dewi", email: "dewi@sekolah.id", password: "202404", nis: "202404", name: "Dewi Lestari", studentCode: "FIVIA-X1-004", role: "siswa", classId: "cls_x1" },
    { id: "usr_siswa_rian", email: "rian@sekolah.id", password: "202405", nis: "202405", name: "Rian Wijaya", studentCode: "FIVIA-X1-005", role: "siswa", classId: "cls_x1" },
    { id: "usr_siswa", email: "siswa@hidayahstore.edu", password: "12345", nis: "12345", name: "Siswa", studentCode: "FIVIA-X1-006", role: "siswa", classId: "cls_x1" }
  ],
  classes: [
    { id: "cls_x1", name: "Kelas X-1", teacherId: "usr_guru_syarif" },
    { id: "cls_x2", name: "Kelas X-2", teacherId: "usr_guru_syarif" },
    { id: "cls_xi1", name: "Kelas XI IPA-1", teacherId: "usr_guru_syarif" },
    { id: "cls_xi2", name: "Kelas XI IPA-2", teacherId: "usr_guru_syarif" }
  ],
  students: [
    // Kelas X-1
    { id: "usr_std_7702", name: "AHMAD NAUFAL", nis: "7702", studentCode: "FIVIA-X1-860", classId: "cls_x1", className: "Kelas X-1", email: "ahmadnaufal@sekolah.id" },
    { id: "usr_std_192", name: "SULKIFLI", nis: "192", studentCode: "FIVIA-ZJFFO", classId: "cls_x1", className: "Kelas X-1", email: "sulkifli@sekolah.id" },
    { id: "usr_std_7703", name: "ADIFA KHAIRUNNIZA'A", nis: "7703", studentCode: "FIVIA-X1-7703", classId: "cls_x1", className: "Kelas X-1", email: "adifa@sekolah.id" },
    { id: "usr_std_7704", name: "ALVIN ABHISTA ANGGARA", nis: "7704", studentCode: "FIVIA-X1-7704", classId: "cls_x1", className: "Kelas X-1", email: "alvin@sekolah.id" },
    { id: "usr_std_7705", name: "AMIRUDDIN", nis: "7705", studentCode: "FIVIA-X1-7705", classId: "cls_x1", className: "Kelas X-1", email: "amiruddin@sekolah.id" },
    { id: "usr_std_7706", name: "ARFIANDI KUSUMA RAMDANA", nis: "7706", studentCode: "FIVIA-X1-7706", classId: "cls_x1", className: "Kelas X-1", email: "arfiandi@sekolah.id" },
    { id: "usr_std_7707", name: "DZAKY RAISSA ABQARY", nis: "7707", studentCode: "FIVIA-X1-7707", classId: "cls_x1", className: "Kelas X-1", email: "dzaky@sekolah.id" },
    { id: "usr_std_7708", name: "EGIL SAPUTRA", nis: "7708", studentCode: "FIVIA-X1-7708", classId: "cls_x1", className: "Kelas X-1", email: "egil@sekolah.id" },
    { id: "usr_std_7709", name: "ISRAFIL", nis: "7709", studentCode: "FIVIA-X1-7709", classId: "cls_x1", className: "Kelas X-1", email: "israfil@sekolah.id" },
    { id: "usr_std_7710", name: "MOHD SHASWAN", nis: "7710", studentCode: "FIVIA-X1-7710", classId: "cls_x1", className: "Kelas X-1", email: "shaswan@sekolah.id" },
    { id: "usr_std_7711", name: "MUH HIDAYAT", nis: "7711", studentCode: "FIVIA-X1-7711", classId: "cls_x1", className: "Kelas X-1", email: "hidayat@sekolah.id" },
    { id: "usr_std_7712", name: "MUH RIDHO", nis: "7712", studentCode: "FIVIA-X1-7712", classId: "cls_x1", className: "Kelas X-1", email: "ridho@sekolah.id" },
    { id: "usr_std_7713", name: "NINIS", nis: "7713", studentCode: "FIVIA-X1-7713", classId: "cls_x1", className: "Kelas X-1", email: "ninis@sekolah.id" },
    { id: "usr_std_7714", name: "NUR ATIYAH", nis: "7714", studentCode: "FIVIA-X1-7714", classId: "cls_x1", className: "Kelas X-1", email: "atiyah@sekolah.id" },
    { id: "usr_std_7715", name: "NUR AZIZAH PUTRI", nis: "7715", studentCode: "FIVIA-X1-7715", classId: "cls_x1", className: "Kelas X-1", email: "azizah@sekolah.id" },
    { id: "usr_std_7716", name: "NURUL HIDAYAH", nis: "7716", studentCode: "FIVIA-X1-7716", classId: "cls_x1", className: "Kelas X-1", email: "nurul@sekolah.id" },
    { id: "usr_std_7717", name: "RENALDIANSAH", nis: "7717", studentCode: "FIVIA-X1-7717", classId: "cls_x1", className: "Kelas X-1", email: "renaldi@sekolah.id" },
    { id: "usr_std_7718", name: "RENANDA QALBI", nis: "7718", studentCode: "FIVIA-X1-7718", classId: "cls_x1", className: "Kelas X-1", email: "renanda@sekolah.id" },
    { id: "usr_std_7719", name: "SHOFIYYA ALIYYANA PUTRI", nis: "7719", studentCode: "FIVIA-X1-7719", classId: "cls_x1", className: "Kelas X-1", email: "shofiyya@sekolah.id" },
    // Kelas X-2
    { id: "usr_std_7701", name: "AHMAD ALGHIFARI", nis: "7701", studentCode: "FIVIA-X2-7701", classId: "cls_x2", className: "Kelas X-2", email: "alghifari@sekolah.id" },
    { id: "usr_std_7720", name: "AHMAD MUFTI", nis: "7720", studentCode: "FIVIA-X2-7720", classId: "cls_x2", className: "Kelas X-2", email: "mufti@sekolah.id" },
    { id: "usr_std_7721", name: "AHSAN RANDI SAPUTRA", nis: "7721", studentCode: "FIVIA-X2-7721", classId: "cls_x2", className: "Kelas X-2", email: "ahsan@sekolah.id" },
    { id: "usr_std_7722", name: "ARFA ALQHAERA", nis: "7722", studentCode: "FIVIA-X2-7722", classId: "cls_x2", className: "Kelas X-2", email: "arfa@sekolah.id" },
    { id: "usr_std_7723", name: "ASTI MEILANI PUTRI", nis: "7723", studentCode: "FIVIA-X2-7723", classId: "cls_x2", className: "Kelas X-2", email: "asti@sekolah.id" },
    { id: "usr_std_7724", name: "GHALI ZHAFRAN BATARA", nis: "7724", studentCode: "FIVIA-X2-7724", classId: "cls_x2", className: "Kelas X-2", email: "ghali@sekolah.id" },
    { id: "usr_std_7725", name: "HASANUDDIN", nis: "7725", studentCode: "FIVIA-X2-7725", classId: "cls_x2", className: "Kelas X-2", email: "hasanuddin@sekolah.id" },
    { id: "usr_std_7726", name: "KHAERFINANDA", nis: "7726", studentCode: "FIVIA-X2-7726", classId: "cls_x2", className: "Kelas X-2", email: "khaerfinanda@sekolah.id" },
    { id: "usr_std_7727", name: "KHAIRUM MUFAHDAL", nis: "7727", studentCode: "FIVIA-X2-7727", classId: "cls_x2", className: "Kelas X-2", email: "khairum@sekolah.id" },
    { id: "usr_std_7728", name: "M. JUSWADI", nis: "7728", studentCode: "FIVIA-X2-7728", classId: "cls_x2", className: "Kelas X-2", email: "juswadi@sekolah.id" },
    { id: "usr_std_7729", name: "MUH. FITRAH", nis: "7729", studentCode: "FIVIA-X2-7729", classId: "cls_x2", className: "Kelas X-2", email: "fitrah@sekolah.id" },
    { id: "usr_std_7730", name: "MUH. IDRIS", nis: "7730", studentCode: "FIVIA-X2-7730", classId: "cls_x2", className: "Kelas X-2", email: "idris@sekolah.id" },
    { id: "usr_std_7731", name: "MUH. THARIQ KEMAL AL KATIRI H", nis: "7731", studentCode: "FIVIA-X2-7731", classId: "cls_x2", className: "Kelas X-2", email: "thariq@sekolah.id" },
    { id: "usr_std_7732", name: "MUHAMMAD FAQIH SYAFA'AT", nis: "7732", studentCode: "FIVIA-X2-7732", classId: "cls_x2", className: "Kelas X-2", email: "faqih@sekolah.id" },
    { id: "usr_std_7733", name: "MUHAMMAD RIFAL", nis: "7733", studentCode: "FIVIA-X2-7733", classId: "cls_x2", className: "Kelas X-2", email: "rifal@sekolah.id" },
    { id: "usr_std_7734", name: "MUTHIARA BUSTAN", nis: "7734", studentCode: "FIVIA-X2-7734", classId: "cls_x2", className: "Kelas X-2", email: "muthiara@sekolah.id" },
    { id: "usr_std_7735", name: "NUR AZKIYAH MASANGKA", nis: "7735", studentCode: "FIVIA-X2-7735", classId: "cls_x2", className: "Kelas X-2", email: "azkiyah@sekolah.id" },
    { id: "usr_std_7736", name: "NURBAYA", nis: "7736", studentCode: "FIVIA-X2-7736", classId: "cls_x2", className: "Kelas X-2", email: "nurbaya@sekolah.id" },
    { id: "usr_std_7737", name: "NURUL SASKIA PRADITA", nis: "7737", studentCode: "FIVIA-X2-7737", classId: "cls_x2", className: "Kelas X-2", email: "saskia@sekolah.id" },
    // Demo accounts
    { id: "usr_siswa_pasya", name: "Pasya Ramadhan", nis: "202401", studentCode: "FIVIA-X1-001", classId: "cls_x1", className: "Kelas X-1", email: "pasya@sekolah.id" },
    { id: "usr_siswa_budi", name: "Budi Santoso", nis: "202402", studentCode: "FIVIA-X1-002", classId: "cls_x1", className: "Kelas X-1", email: "budi@sekolah.id" },
    { id: "usr_siswa_siti", name: "Siti Aminah", nis: "202403", studentCode: "FIVIA-X1-003", classId: "cls_x1", className: "Kelas X-1", email: "siti@sekolah.id" },
    { id: "usr_siswa_dewi", name: "Dewi Lestari", nis: "202404", studentCode: "FIVIA-X1-004", classId: "cls_x1", className: "Kelas X-1", email: "dewi@sekolah.id" },
    { id: "usr_siswa_rian", name: "Rian Wijaya", nis: "202405", studentCode: "FIVIA-X1-005", classId: "cls_x1", className: "Kelas X-1", email: "rian@sekolah.id" },
    { id: "usr_siswa", name: "Siswa", nis: "12345", studentCode: "FIVIA-X1-006", classId: "cls_x1", className: "Kelas X-1", email: "siswa@hidayahstore.edu" }
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
    const SEED_VERSION = "9.5";
    const currentVersion = localStorage.getItem(DB_PREFIX + "seed_version");

    // Preserve existing student submissions and quiz scores
    const existingSubmissions = this.getTable("submissions") || [];
    const existingScores = this.getTable("quizScores") || [];
    const existingCerts = this.getTable("certificates") || [];
    const existingDetektif = this.getTable("detektifProgress") || [];

    if (currentVersion !== SEED_VERSION) {
      localStorage.setItem(DB_PREFIX + "seed_version", SEED_VERSION);
    }

    // Check if base seed is initialized
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
      this.saveTable("submissions", existingSubmissions.length ? existingSubmissions : SEED_DATA.submissions);
      this.saveTable("quizScores", existingScores.length ? existingScores : (SEED_DATA.quizScores || []));
      this.saveTable("certificates", existingCerts.length ? existingCerts : (SEED_DATA.certificates || []));
      this.saveTable("detektifProgress", existingDetektif);
      
      localStorage.setItem(DB_PREFIX + "initialized", "true");
    }

    // Ensure teacher credentials (Syarif121220) & registered students are guaranteed on all devices
    try {
      let users = this.getTable("users") || [];
      // 1. Remove duplicate teacher account named "Syarif Hidayatullah, S.Pd." and keep single "Syarif Hidayatullah"
      const syarifEmail = "syarifhidayatullah64@guru.sma.belajar.id";
      users = users.filter(u => !(u.email && u.email.toLowerCase() === syarifEmail && (u.name || "").includes("S.Pd")));
      
      const syarifIdx = users.findIndex(u => 
        (u.email || "").toLowerCase() === syarifEmail || 
        u.id === "usr_guru_syarif"
      );
      const teacherObj = {
        id: "usr_guru_syarif",
        email: syarifEmail,
        password: "Syarif121220",
        name: "Syarif Hidayatullah",
        role: "guru"
      };
      if (syarifIdx !== -1) {
        users[syarifIdx] = { ...users[syarifIdx], ...teacherObj };
      } else {
        users.push(teacherObj);
      }

      // Ensure no duplicate emails exist for the teacher
      const seenGuru = new Set();
      users = users.filter(u => {
        if (u.role === "guru" && u.email && u.email.toLowerCase() === syarifEmail) {
          if (seenGuru.has(syarifEmail)) return false;
          seenGuru.add(syarifEmail);
        }
        return true;
      });

      // Check permanently deleted students
      let deletedList = [];
      try {
        deletedList = JSON.parse(localStorage.getItem("vlab_deleted_students") || "[]");
      } catch(e) {}
      const isDeleted = (item) => {
        if (!item) return false;
        const id = String(item.id || item.studentId || "").trim();
        const nis = String(item.nis || "").trim();
        const code = String(item.studentCode || "").trim();
        const name = String(item.name || "").trim().toLowerCase();
        return deletedList.some(d => {
          const dl = String(d).trim().toLowerCase();
          return dl === id.toLowerCase() || (nis && dl === nis.toLowerCase()) || (code && dl === code.toLowerCase()) || (name && dl === name);
        });
      };

      // 2. Upsert each registered student into users table (excluding deleted)
      SEED_DATA.users.filter(u => u.role === "siswa").forEach(stdSeed => {
        if (isDeleted(stdSeed)) return;
        const idx = users.findIndex(u => 
          (u.nis && String(u.nis).trim() === String(stdSeed.nis).trim()) ||
          (u.name && u.name.trim().toLowerCase() === stdSeed.name.trim().toLowerCase())
        );
        if (idx !== -1) {
          users[idx] = { ...users[idx], ...stdSeed };
        } else {
          users.push(stdSeed);
        }
      });
      // Purge any deleted students from users table
      users = users.filter(u => u.role !== "siswa" || !isDeleted(u));
      this.saveTable("users", users);

      // 3. Upsert each registered student into students table (excluding deleted)
      let students = this.getTable("students") || [];
      SEED_DATA.students.forEach(stdSeed => {
        if (isDeleted(stdSeed)) return;
        const idx = students.findIndex(s => 
          (s.nis && String(s.nis).trim() === String(stdSeed.nis).trim()) ||
          (s.name && s.name.trim().toLowerCase() === stdSeed.name.trim().toLowerCase())
        );
        if (idx !== -1) {
          students[idx] = { ...students[idx], ...stdSeed };
        } else {
          students.push(stdSeed);
        }
      });
      // Purge any deleted students from students table
      students = students.filter(s => !isDeleted(s));
      this.saveTable("students", students);

      // 4. Mirror into fivia_student_roster for instant classroom display & offline use (excluding deleted)
      let roster = [];
      try {
        roster = JSON.parse(localStorage.getItem("fivia_student_roster") || "[]");
      } catch(e) {}
      SEED_DATA.students.forEach(stdSeed => {
        if (isDeleted(stdSeed)) return;
        const idx = roster.findIndex(r => 
          (r.nis && String(r.nis).trim() === String(stdSeed.nis).trim()) ||
          (r.name && r.name.trim().toLowerCase() === stdSeed.name.trim().toLowerCase())
        );
        if (idx !== -1) {
          roster[idx] = { ...roster[idx], ...stdSeed };
        } else {
          roster.push(stdSeed);
        }
      });
      // Purge any deleted students from roster
      roster = roster.filter(r => !isDeleted(r));
      localStorage.setItem("fivia_student_roster", JSON.stringify(roster));
    } catch(e) {
      console.warn("Error ensuring seed data sync:", e);
    }
  }

  getTable(tableName) {
    const key = DB_PREFIX + tableName;
    const data = localStorage.getItem(key);
    let items = [];
    if (data) {
      try {
        items = JSON.parse(data);
      } catch (e) {
        console.error("Error reading localStorage table: " + tableName, e);
        items = [];
      }
    }

    // Merge custom teacher materials & quizzes if querying those tables
    if (tableName === "materials") {
      try {
        let customMats = JSON.parse(localStorage.getItem("fivia_custom_materials") || "[]");
        // Purge any raw %PDF binary test junk module
        const origLength = customMats.length;
        customMats = customMats.filter(m => m && m.name && !m.name.includes("%PDF") && !m.name.includes("stream") && m.id !== 1788664975774);
        if (customMats.length !== origLength) {
          localStorage.setItem("fivia_custom_materials", JSON.stringify(customMats));
        }

        const existingIds = new Set(items.map(m => m.id));
        customMats.forEach(cm => {
          if (!existingIds.has(cm.id)) {
            items.push(cm);
          }
        });

        // Filter returned items array as well
        items = items.filter(m => m && m.name && !m.name.includes("%PDF") && !m.name.includes("stream") && m.id !== 1788664975774);
      } catch (err) {
        console.warn("Error merging custom materials:", err);
      }
    } else if (tableName === "quizzes") {
      try {
        const customQuizzes = JSON.parse(localStorage.getItem("fivia_custom_quizzes") || "[]");
        const existingIds = new Set(items.map(q => q.id));
        customQuizzes.forEach(cq => {
          if (!existingIds.has(cq.id)) {
            items.push(cq);
          }
        });
      } catch (err) {
        console.warn("Error merging custom quizzes:", err);
      }
    }

    return items;
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

  saveCustomMaterial(material, quiz, gameItems) {
    try {
      // 1. Save / Update in Custom Materials
      const customMats = JSON.parse(localStorage.getItem("fivia_custom_materials") || "[]");
      const existingMatIdx = customMats.findIndex(m => m.id === material.id);
      if (existingMatIdx !== -1) {
        customMats[existingMatIdx] = material;
      } else {
        customMats.push(material);
      }
      localStorage.setItem("fivia_custom_materials", JSON.stringify(customMats));

      // Also update base materials table if ID matches standard modules (1-5)
      const baseMats = this.getTable("materials");
      const baseIdx = baseMats.findIndex(m => m.id === material.id);
      if (baseIdx !== -1) {
        baseMats[baseIdx] = { ...baseMats[baseIdx], ...material };
        localStorage.setItem(DB_PREFIX + "materials", JSON.stringify(baseMats));
      }

      // 2. Save / Update Quiz
      if (quiz) {
        const customQuizzes = JSON.parse(localStorage.getItem("fivia_custom_quizzes") || "[]");
        const existingQuizIdx = customQuizzes.findIndex(q => q.id === quiz.id || q.materialId === material.id);
        if (existingQuizIdx !== -1) {
          customQuizzes[existingQuizIdx] = quiz;
        } else {
          customQuizzes.push(quiz);
        }
        localStorage.setItem("fivia_custom_quizzes", JSON.stringify(customQuizzes));

        // Also update base quizzes table if ID matches standard module quizzes (1-5)
        const baseQuizzes = this.getTable("quizzes");
        const baseQIdx = baseQuizzes.findIndex(q => q.materialId === material.id || q.id === quiz.id);
        if (baseQIdx !== -1) {
          baseQuizzes[baseQIdx] = quiz;
          localStorage.setItem(DB_PREFIX + "quizzes", JSON.stringify(baseQuizzes));
        }
      }

      // 3. Save Game Items
      if (gameItems) {
        const customGames = JSON.parse(localStorage.getItem("fivia_custom_game_materials") || "[]");
        const existingGameIdx = customGames.findIndex(g => g.topicTitle === gameItems.topicTitle || g.targetModuleId === material.id);
        if (existingGameIdx !== -1) {
          customGames[existingGameIdx] = gameItems;
        } else {
          customGames.push(gameItems);
        }
        localStorage.setItem("fivia_custom_game_materials", JSON.stringify(customGames));
      }

      return true;
    } catch (e) {
      console.error("Error saving custom material to database:", e);
      return false;
    }
  }

  deleteCustomMaterial(materialId) {
    try {
      const id = parseInt(materialId);
      let customMats = JSON.parse(localStorage.getItem("fivia_custom_materials") || "[]");
      customMats = customMats.filter(m => m.id !== id);
      localStorage.setItem("fivia_custom_materials", JSON.stringify(customMats));

      let customQuizzes = JSON.parse(localStorage.getItem("fivia_custom_quizzes") || "[]");
      customQuizzes = customQuizzes.filter(q => q.materialId !== id && q.id !== `quiz_${id}` && q.id !== `quiz_custom_${id}`);
      localStorage.setItem("fivia_custom_quizzes", JSON.stringify(customQuizzes));

      let customGames = JSON.parse(localStorage.getItem("fivia_custom_game_materials") || "[]");
      customGames = customGames.filter(g => g.targetModuleId !== id);
      localStorage.setItem("fivia_custom_game_materials", JSON.stringify(customGames));

      return true;
    } catch (e) {
      console.error("Error deleting custom material:", e);
      return false;
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

  getMaterials() {
    const baseMats = this.getTable("materials");
    const customMats = JSON.parse(localStorage.getItem("fivia_custom_materials") || "[]");
    const map = new Map();
    (baseMats || []).forEach(m => map.set(m.id, m));
    (customMats || []).forEach(m => map.set(m.id, m));
    return Array.from(map.values());
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
    const submissions = this.getTable("submissions") || [];
    const sId = String(submission.studentId || submission.id || "");
    const labId = String(submission.labId || "");

    // Ensure unique ID
    submission.id = submission.id || `sub_${sId}_${labId}`;
    if (!submission.timestamp) submission.timestamp = new Date().toISOString();
    if (!submission.status) submission.status = "pending";

    // Auto enrich studentName & className if missing
    if (!submission.studentName || !submission.className) {
      const students = this.getTable("students") || [];
      const users = this.getTable("users") || [];
      const std = students.find(s => String(s.id) === sId || (s.nis && String(s.nis) === sId)) ||
                  users.find(u => String(u.id) === sId || (u.nis && String(u.nis) === sId));
      if (std) {
        if (!submission.studentName) submission.studentName = std.name || std.displayName;
        if (!submission.className) submission.className = std.className || std.classId || "Kelas X-1";
        if (!submission.studentNis) submission.studentNis = std.nis || "-";
        if (!submission.studentCode) submission.studentCode = std.studentCode || "-";
      }
    }

    // Check if exists to overwrite (autosave or resubmission)
    const existingIdx = submissions.findIndex(s => 
      (s.id && s.id === submission.id) ||
      (String(s.studentId) === sId && String(s.labId) === labId)
    );

    if (existingIdx !== -1) {
      submissions[existingIdx] = { 
        ...submissions[existingIdx], 
        ...submission, 
        timestamp: new Date().toISOString() 
      };
    } else {
      submissions.push(submission);
    }

    this.saveTable("submissions", submissions);
    return true;
  }

  getLKPDSubmission(studentId, labId) {
    const submissions = this.getTable("submissions") || [];
    const targetSid = String(studentId || "").trim();
    const targetLab = String(labId || "").trim();

    return submissions.find(s => 
      (String(s.studentId || "").trim() === targetSid || String(s.id || "").trim() === targetSid) &&
      (String(s.labId || "").trim() === targetLab || parseInt(s.labId) === parseInt(targetLab))
    ) || submissions.find(s => 
      String(s.studentId || "").trim() === targetSid || String(s.id || "").trim() === targetSid
    );
  }

  getPendingSubmissions(teacherId) {
    let submissions = this.getTable("submissions") || [];

    // Auto-detect and merge any LKPD submissions saved from FIVIALabLKPD or local autosaves if not present
    try {
      const fiviaLkpd = JSON.parse(localStorage.getItem("fivia_lab_lkpd") || "{}");
      Object.keys(fiviaLkpd).forEach(expId => {
        const item = fiviaLkpd[expId];
        if (item && (item.name || item.analysis || item.conclusion)) {
          const pseudoId = `lkpd_std_${(item.name || 'siswa').toLowerCase().replace(/[^a-z0-9]/g, '')}_${expId}`;
          const exists = submissions.some(s => 
            (s.studentName && item.name && s.studentName.toLowerCase().trim() === item.name.toLowerCase().trim() && String(s.labId) === String(expId)) ||
            s.id === pseudoId
          );
          if (!exists) {
            submissions.push({
              id: pseudoId,
              studentId: item.studentId || pseudoId,
              studentName: item.name || "Siswa Praktikum",
              className: item.class || "Kelas X-1",
              labId: parseInt(expId) || expId,
              hypothesis: "Data pengamatan dan analisis mandiri laboratorium virtual",
              observations: [],
              answers: [
                { questionId: "q1", answerText: item.analysis || "-" },
                { questionId: "q2", answerText: item.conclusion || "-" }
              ],
              conclusion: item.conclusion || "-",
              timestamp: item.updatedAt || item.date || new Date().toISOString(),
              status: "pending"
            });
          }
        }
      });
    } catch(e) {}

    // If completely empty (first run or cleared cache), provide sample default submissions so teacher can evaluate
    if (submissions.length === 0) {
      submissions = [
        {
          id: "sub_usr_std_7702_2",
          studentId: "usr_std_7702",
          studentName: "AHMAD NAUFAL",
          studentNis: "7702",
          studentCode: "FIVIA-X1-860",
          className: "Kelas X-1",
          labId: 2,
          hypothesis: "Semakin kecil nilai skala terkecil (NST) alat ukur, maka hasil pengukuran akan semakin presisi dan nilai ketidakpastian semakin kecil.",
          observations: [
            { "No": 1, "Benda": "Kelereng", "Alat Ukur": "Jangka Sorong", "SU": "15 mm", "SN": "0.4 mm", "Hasil": "15.40 ± 0.05 mm" },
            { "No": 2, "Benda": "Kawat Tembaga", "Alat Ukur": "Mikrometer Sekrup", "SU": "3.5 mm", "SN": "0.22 mm", "Hasil": "3.720 ± 0.005 mm" }
          ],
          answers: [
            { questionId: "q1", answerText: "Jangka sorong memiliki ketelitian 0.05 mm (atau 0.1 mm), sedangkan mikrometer sekrup memiliki ketelitian 0.01 mm, sehingga mikrometer sekrup jauh lebih presisi untuk mengukur ketebalan kawat." },
            { questionId: "q2", answerText: "Nilai ketidakpastian mutlak dihitung dari setengah nilai skala terkecil (1/2 x NST) masing-masing alat ukur." },
            { questionId: "q3", answerText: "Aturan angka penting digunakan untuk menunjukkan tingkat kepastian hasil ukur sesuai batas kemampuan alat ukur yang digunakan." }
          ],
          conclusion: "Mikrometer sekrup terbukti lebih presisi untuk mengukur benda berdimensi sangat tipis dibandingkan mistar maupun jangka sorong.",
          status: "pending",
          timestamp: new Date(Date.now() - 3600000 * 2).toISOString()
        },
        {
          id: "sub_usr_siswa_pasya_1",
          studentId: "usr_siswa_pasya",
          studentName: "Pasya Ramadhan",
          studentNis: "202401",
          studentCode: "FIVIA-X1-001",
          className: "Kelas X-1",
          labId: 1,
          hypothesis: "Waktu yang dibutuhkan untuk mencapai titik didih berbanding lurus dengan volume zat cair yang dipanaskan.",
          observations: [
            { "No": 1, "Volume (mL)": "50", "Waktu Mendidih (s)": "120", "Suhu Akhir (°C)": "100" },
            { "No": 2, "Volume (mL)": "100", "Waktu Mendidih (s)": "238", "Suhu Akhir (°C)": "100" }
          ],
          answers: [
            { questionId: "q1", answerText: "Simbol korosif menandakan bahan dapat merusak jaringan hidup atau korosi logam. Tindakan pertama bila terkena adalah membilas segera dengan air mengalir selama 15 menit." },
            { questionId: "q2", answerText: "Variabel bebas adalah volume air, variabel terikat adalah durasi waktu mendidih, dan variabel kontrol adalah besar nyala api pemanas bunsen." },
            { questionId: "q3", answerText: "Karena kalor yang dibutuhkan Q = m.c.dT berbanding lurus dengan massa (volume) zat cair, semakin besar volume maka semakin besar kalor yang diserap sehingga waktu lebih lama." }
          ],
          conclusion: "Hipotesis terbukti benar. Volume cairan yang lebih besar membutuhkan waktu pemanasan lebih lama untuk mencapai titik didih sesuai asas kalorimetri.",
          status: "pending",
          timestamp: new Date(Date.now() - 3600000 * 5).toISOString()
        }
      ];
      this.saveTable("submissions", submissions);
    }

    const students = this.getTable("students") || [];
    const users = this.getTable("users") || [];
    const classes = this.getTable("classes") || [];
    const labs = this.getTable("labs") || [];

    let roster = [];
    try {
      roster = JSON.parse(localStorage.getItem("fivia_student_roster") || "[]");
    } catch(e) {}

    let classroomStudents = [];
    try {
      classroomStudents = JSON.parse(localStorage.getItem("fivia_classroom_students") || "[]");
    } catch(e) {}

    const LAB_TITLES = {
      1: "Metode Ilmiah & Keselamatan Kerja Lab",
      2: "Pengukuran Dasar Fisika (Jangka Sorong & Mikrometer)",
      3: "Hukum Kekekalan Energi & Skate Park",
      4: "Energi Terbarukan: Turbin Angin & Sel Surya",
      5: "Termodinamika & Efek Rumah Kaca Global"
    };

    return submissions.map(sub => {
      if (!sub) return null;

      const sId = String(sub.studentId || sub.id || "").trim();

      // Look up student across all storage tables
      let studentObj = students.find(s => String(s.id || "").trim() === sId || (s.nis && String(s.nis).trim() === sId));
      if (!studentObj) {
        studentObj = users.find(u => String(u.id || "").trim() === sId || (u.nis && String(u.nis).trim() === sId));
      }
      if (!studentObj) {
        studentObj = roster.find(r => 
          String(r.id || r.studentId || "").trim() === sId || 
          (r.nis && String(r.nis).trim() === sId) ||
          (r.name && sub.studentName && r.name.toLowerCase().trim() === sub.studentName.toLowerCase().trim())
        );
      }
      if (!studentObj) {
        studentObj = classroomStudents.find(c => 
          String(c.id || c.studentId || "").trim() === sId || 
          (c.nis && String(c.nis).trim() === sId)
        );
      }

      const studentName = sub.studentName || studentObj?.name || studentObj?.displayName || studentObj?.fullName || `Siswa (${sId || 'Anonim'})`;
      const studentNis = sub.studentNis || studentObj?.nis || "-";
      const studentCode = sub.studentCode || studentObj?.studentCode || "-";

      const classIdentifier = studentObj?.className || studentObj?.classId || sub.className || "Kelas X-1";
      const classObj = classes.find(c => c.id === classIdentifier || c.name === classIdentifier);
      const className = classObj ? classObj.name : (sub.className || classIdentifier);

      const labObj = labs.find(l => String(l.id) === String(sub.labId) || parseInt(l.id) === parseInt(sub.labId));
      const labName = sub.labName || (labObj ? labObj.name : (LAB_TITLES[sub.labId] || `Laboratorium Fisika #${sub.labId}`));

      const isGraded = (sub.score !== undefined && sub.score !== null && sub.score !== "") || sub.status === "graded";
      const status = isGraded ? "graded" : "pending";

      return {
        ...sub,
        id: sub.id || `sub_${sId}_${sub.labId}`,
        studentId: sub.studentId || sId,
        studentName: studentName,
        studentNis: studentNis,
        studentCode: studentCode,
        className: className,
        labName: labName,
        status: status,
        score: sub.score !== undefined && sub.score !== null ? sub.score : undefined,
        feedback: sub.feedback || "",
        timestamp: sub.timestamp || sub.updatedAt || new Date().toISOString()
      };
    }).filter(Boolean);
  }

  gradeSubmission(studentId, labId, score, feedback) {
    const submissions = this.getTable("submissions") || [];
    const targetSid = String(studentId || "").trim();
    const targetLab = String(labId || "").trim();

    let subIdx = submissions.findIndex(s => 
      (String(s.studentId || "").trim() === targetSid || String(s.id || "").trim() === targetSid) &&
      (String(s.labId || "").trim() === targetLab || parseInt(s.labId) === parseInt(targetLab))
    );

    if (subIdx === -1) {
      subIdx = submissions.findIndex(s => 
        String(s.studentId || "").trim() === targetSid || String(s.id || "").trim() === targetSid
      );
    }

    if (subIdx !== -1) {
      const numScore = parseInt(score, 10);
      submissions[subIdx].score = isNaN(numScore) ? 0 : numScore;
      submissions[subIdx].feedback = feedback || "";
      submissions[subIdx].status = "graded";
      submissions[subIdx].gradedAt = new Date().toISOString();
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
