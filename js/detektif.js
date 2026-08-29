/**
 * detektif.js
 * Game Engine and Controller for "MISI DETEKTIF FISIKA"
 * hidayahstore.edu - Virtual Lab Fisika SMA
 */

// Global state variables
let currentProgress = null;
let activeMissionId = null;
let currentQuestionIndex = 0;
let missionStreak = 0;
let usedHint = false;
let currentMissionData = null; // Holds randomized values for active mission
let currentMisi4Magnifier = { active: false, x: 0, y: 0, show: false };


// Initial seeding of questions and mission constants
const MISSION_CONFIG = {
  1: { title: "FIVIA Mission 1: Detektif Besaran", xp: 50, badge: "Ahli Besaran" },
  2: { title: "FIVIA Mission 2: Laboratorium Satuan", xp: 75, badge: "Master Satuan" },
  3: { title: "FIVIA Mission 3: Ahli Dimensi", xp: 100, badge: "Ahli Dimensi" },
  4: { title: "FIVIA Mission 4: Detektif Pengukuran", xp: 200, badge: "Teknisi Pengukuran" },
  5: { title: "FIVIA Mission 5: Detektif Angka Penting", xp: 100, badge: "Detektif Angka Penting" },
  6: { title: "FIVIA Mission 6: Pemburu Kesalahan", xp: 150, badge: "Pemburu Kesalahan" },
  7: { title: "FIVIA Mission 7: Tantangan Laboratorium", xp: 300, badge: "Ahli Laboratorium Fisika" }
};

// BADGE definitions
const BADGES_INFO = {
  "Pemula Fisika": { icon: "fa-baby-carriage", desc: "Diberikan saat memulai petualangan Detektif Fisika.", color: "#64748b" },
  "Ahli Besaran": { icon: "fa-tags", desc: "Berhasil mengidentifikasi besaran fisika dan satuannya.", color: "#3b82f6" },
  "Master Satuan": { icon: "fa-exchange-alt", desc: "Menguasai konversi satuan dan Satuan Internasional (SI).", color: "#10b981" },
  "Ahli Dimensi": { icon: "fa-ruler-combined", desc: "Mampu menyusun analisis dimensi rumus fisika dengan sempurna.", color: "#8b5cf6" },
  "Teknisi Pengukuran": { icon: "fa-compass", desc: "Mahir membaca Mistar, Jangka Sorong, Mikrometer Sekrup, Neraca Ohaus, Stopwatch, dan Multimeter.", color: "#f59e0b" },
  "Detektif Angka Penting": { icon: "fa-search", desc: "Menguasai aturan angka penting dan pembulatan matematis.", color: "#ec4899" },
  "Pemburu Kesalahan": { icon: "fa-bug", desc: "Mampu mengidentifikasi kesalahan ilmiah dalam hasil praktikum.", color: "#ef4444" },
  "Ahli Laboratorium Fisika": { icon: "fa-user-md", desc: "Menyelesaikan tantangan laboratorium dan menghitung volume/massa jenis balok.", color: "#d97706" }
};

// Seeding randomized challenges
const MISI1_ITEMS = [
  { item: "Buku Paket Fisika memiliki tebal 2.4 cm", q: "Besaran apakah yang diwakili oleh tebal 2.4 cm?", opt: ["Panjang", "Massa", "Suhu", "Waktu"], correct: 0, si: "meter" },
  { item: "Segelas air teh hangat bersuhu 45°C", q: "Besaran fisika yang diukur dengan nilai 45°C adalah?", opt: ["Massa", "Suhu", "Intensitas Cahaya", "Kuat Arus"], correct: 1, si: "Kelvin" },
  { item: "Mobil melaju dengan kecepatan 72 km/jam", q: "Besaran apakah kecepatan mobil tersebut?", opt: ["Besaran Pokok", "Besaran Turunan", "Besaran Skalar Sahaja", "Dimensi Utama"], correct: 1, si: "m/s" },
  { item: "Sebuah batu ditimbang memiliki massa 1.5 kg", q: "Besaran fisika dari nilai 1.5 kg adalah?", opt: ["Massa", "Berat", "Gaya", "Massa Jenis"], correct: 0, si: "kg" },
  { item: "Sebuah lampu bohlam tertulis 15 Watt", q: "Daya lampu (15 Watt) merupakan besaran turunan yang diturunkan dari?", opt: ["Massa, Panjang, Waktu", "Massa, Waktu, Suhu", "Panjang, Kuat Arus", "Massa, Panjang, Arus"], correct: 0, si: "Watt" },
  { item: "Durasi lari siswa diukur dengan stopwatch menunjukkan 12.5 sekon", q: "Besaran apakah 12.5 sekon?", opt: ["Panjang", "Waktu", "Kecepatan", "Frekuensi"], correct: 1, si: "sekon" },
  { item: "Luas sebidang tanah sekolah adalah 120 m²", q: "Luas merupakan besaran turunan yang diturunkan dari besaran pokok?", opt: ["Panjang", "Massa", "Waktu", "Suhu"], correct: 0, si: "m²" },
  { item: "Massa jenis sebongkah aluminium adalah 2.7 g/cm³", q: "Massa jenis diturunkan dari besaran pokok?", opt: ["Massa dan Panjang", "Massa dan Waktu", "Panjang dan Waktu", "Suhu dan Massa"], correct: 0, si: "kg/m³" },
  { item: "Sebuah kawat mengalirkan arus listrik 2 Ampere", q: "Kuat arus listrik (2 Ampere) termasuk besaran?", opt: ["Pokok", "Turunan", "Vektor", "Dimensi"], correct: 0, si: "Ampere" },
  { item: "Sebuah kumparan kawat memiliki jumlah zat 0.5 mol", q: "Satuan SI untuk jumlah zat adalah?", opt: ["Gram", "Kandela", "Molekul", "Mol"], correct: 3, si: "mol" }
];

const MISI3_FORMULAS = [
  { name: "Kecepatan (v = s/t)", eq: "v = L / T", dim: "[L][T]^-1", clue: "Kecepatan adalah Jarak (Panjang [L]) dibagi Waktu ([T])." },
  { name: "Percepatan (a = v/t)", eq: "a = v / t", dim: "[L][T]^-2", clue: "Percepatan adalah Kecepatan ([L][T]^-1) dibagi Waktu ([T])." },
  { name: "Gaya (F = m * a)", eq: "F = kg * m/s²", dim: "[M][L][T]^-2", clue: "Gaya adalah Massa ([M]) dikalikan Percepatan ([L][T]^-2)." },
  { name: "Usaha / Energi (W = F * s)", eq: "W = Gaya * Jarak", dim: "[M][L]^2[T]^-2", clue: "Usaha adalah Gaya ([M][L][T]^-2) dikalikan Panjang Jarak ([L])." },
  { name: "Massa Jenis (ρ = m/V)", eq: "ρ = kg / m³", dim: "[M][L]^-3", clue: "Massa jenis adalah Massa ([M]) dibagi Volume (Panjang kubik [L]^3)." },
  { name: "Momentum (p = m * v)", eq: "p = kg * m/s", dim: "[M][L][T]^-1", clue: "Momentum adalah Massa ([M]) dikalikan Kecepatan ([L][T]^-1)." },
  { name: "Daya (P = W/t)", eq: "P = Energi / Waktu", dim: "[M][L]^2[T]^-3", clue: "Daya adalah Usaha/Energi ([M][L]^2[T]^-2) dibagi Waktu ([T])." },
  { name: "Tekanan (P = F/A)", eq: "P = Gaya / Luas", dim: "[M][L]^-1[T]^-2", clue: "Tekanan adalah Gaya ([M][L][T]^-2) dibagi Luas ([L]^2)." },
  { name: "Momentum Sudut (L = r * p)", eq: "L = Jarak * Momentum", dim: "[M][L]^2[T]^-1", clue: "Momentum Sudut adalah Jarak ([L]) dikalikan Momentum ([M][L][T]^-1)." }
];

const MISI5_NUMBERS = [
  { num: "25.4", ap: 3, rule: "Semua angka bukan nol adalah angka penting." },
  { num: "0.0050", ap: 2, rule: "Angka nol di sebelah kiri angka bukan nol tidak penting, tetapi angka nol di sebelah kanan angka desimal adalah angka penting (yaitu angka 5 dan 0 terakhir)." },
  { num: "300", ap: 1, rule: "Angka nol di bagian belakang bilangan bulat tanpa desimal bukan angka penting (kecuali diberi garis bawah)." },
  { num: "3.00 x 10^8", ap: 3, rule: "Dalam notasi ilmiah, hanya angka pada mantissa (angka sebelum 10^x) yang dihitung sebagai angka penting (3, 0, 0)." },
  { num: "0.0405", ap: 3, rule: "Angka nol di depan bukan AP, angka nol di antara angka bukan nol (4 dan 5) adalah angka penting." },
  { num: "12.00", ap: 4, rule: "Semua angka nol di belakang desimal setelah angka bukan nol adalah angka penting." },
  { num: "0.00320", ap: 3, rule: "Angka 3, 2, dan 0 terakhir adalah angka penting (3 AP)." },
  { num: "450.0", ap: 4, rule: "Angka desimal nol di kanan memperlihatkan ketelitian alat ukur, jadi dihitung penting." },
  { num: "100.05", ap: 5, rule: "Angka nol di antara angka bukan nol (1 dan 5) semuanya dihitung sebagai angka penting." },
  { num: "0.0001", ap: 1, rule: "Hanya angka 1 yang dihitung sebagai angka penting." }
];

const MISI5_OPERATIONS = [
  { op: "12.5 + 3.24", ans: "15.7", explanation: "Aturan Penjumlahan: Hasil mengikuti angka desimal paling sedikit (12.5 memiliki 1 desimal, 3.24 memiliki 2 desimal, maka dibulatkan ke 1 desimal: 15.74 -> 15.7)." },
  { op: "4.25 * 2.1", ans: "8.9", explanation: "Aturan Perkalian: Hasil mengikuti jumlah angka penting paling sedikit (4.25 memiliki 3 AP, 2.1 memiliki 2 AP, maka hasil harus memiliki 2 AP: 8.925 -> 8.9)." },
  { op: "15.0 / 3.0", ans: "5.0", explanation: "Aturan Pembagian: Kedua bilangan memiliki 3 AP dan 2 AP, hasil dibulatkan ke 2 AP (5.0)." },
  { op: "120.45 - 20.2", ans: "100.3", explanation: "Aturan Pengurangan: Pembulatan ke desimal terkecil (1 desimal): 100.25 -> dibulatkan menjadi 100.3 karena pembulatan genap ke atas." },
  { op: "2.50 * 4.0", ans: "10", explanation: "Aturan Perkalian: 2.50 (3 AP) dikali 4.0 (2 AP) menghasilkan 10.0, dibulatkan ke 2 AP yaitu 10 (ditulis 1.0 x 10^1 agar tegas 2 AP, atau ditulis 10. tanpa desimal)." }
];

const MISI6_CASES = [
  {
    tool: "Mistar (Ketelitian 0.1 cm / Skala terkecil 1 mm)",
    input: "12.3456 cm",
    correct: "12.3 cm atau (12.30 ± 0.05) cm",
    issue: "Siswa menuliskan ketebalan hingga 4 angka desimal. Padahal mistar hanya memiliki ketelitian terkecil 0.1 cm (1 mm) atau ketidakpastian 0.05 cm.",
    q: "Mengapa hasil 12.3456 cm tidak masuk akal untuk alat ukur Mistar?",
    opts: [
      "Karena mistar tidak memiliki skala mikro untuk mengukur hingga seperseribu milimeter.",
      "Karena mistar adalah alat ukur digital.",
      "Karena mistar memiliki ketelitian 0.01 mm.",
      "Karena nilainya terlalu pendek."
    ],
    correctIdx: 0
  },
  {
    tool: "Jangka Sorong (Ketelitian 0.05 mm)",
    input: "24.382 mm",
    correct: "24.35 mm atau 24.40 mm",
    issue: "Siswa menuliskan pembacaan jangka sorong berketelitian 0.05 mm dengan 3 angka desimal (seperseribu mm). Jangka sorong 0.05 mm hanya bisa berakhir pada angka 0 atau 5 di digit desimal kedua.",
    q: "Bagaimanakah penulisan digit desimal jangka sorong berketelitian 0.05 mm?",
    opts: [
      "Harus diakhiri angka genap saja.",
      "Digit desimal kedua harus berupa kelipatan 5 (misal .35, .40, .45).",
      "Bebas sesuai pembacaan nonius.",
      "Harus ditulis dengan notasi eksponensial."
    ],
    correctIdx: 1
  },
  {
    tool: "Mikrometer Sekrup (Ketelitian 0.01 mm)",
    input: "5.1234 mm",
    correct: "5.12 mm atau (5.120 ± 0.005) mm",
    issue: "Mikrometer sekrup membaca hingga 0.01 mm secara pasti. Menuliskan hingga 4 angka desimal melanggar batas ketelitian fisika alat tersebut.",
    q: "Apa batas desimal penulisan hasil mikrometer sekrup standar?",
    opts: [
      "Maksimal 2 angka di belakang koma (milimeter).",
      "Maksimal 4 angka di belakang koma.",
      "Hanya boleh bilangan bulat.",
      "Mengikuti panjang benda."
    ],
    correctIdx: 0
  }
];

// Initialize the Detective Dashboard View
function initDetektifDashboard() {
  const user = window.auth.getCurrentUser();
  if (!user) return;

  currentProgress = window.db.getDetektifProgress(user.id);
  
  // Update overall progress numbers
  const completedCount = currentProgress.completedMissions.length;
  document.getElementById("detektif-progress-val").textContent = `${completedCount}/7 Misi`;
  document.getElementById("detektif-progress-bar").style.width = `${(completedCount / 7) * 100}%`;
  document.getElementById("detektif-xp-val").textContent = `${currentProgress.xp} XP`;
  document.getElementById("detektif-badges-count").textContent = currentProgress.badges.length;
  document.getElementById("detektif-active-badge").textContent = currentProgress.badges[currentProgress.badges.length - 1] || "Pemula Fisika";
  
  // Show overall grade
  if (currentProgress.grades) {
    document.getElementById("detektif-grade-val").textContent = currentProgress.grades.akhir;
    document.getElementById("detektif-predikat-val").textContent = getPredikat(currentProgress.grades.akhir);
  } else {
    document.getElementById("detektif-grade-val").textContent = "-";
    document.getElementById("detektif-predikat-val").textContent = "Belum Dinilai";
  }

  // Handle unlock all button show/hide and label for Teacher/Admin
  const unlockContainer = document.getElementById("detektif-unlock-all-container");
  if (unlockContainer) {
    if (user.role === "guru" || user.role === "admin") {
      unlockContainer.classList.remove("hidden-section");
      const toggleBtn = document.getElementById("btn-toggle-unlock-all");
      if (toggleBtn) {
        const isBypassed = localStorage.getItem("vlab_bypass_locks") !== "false";
        if (isBypassed) {
          toggleBtn.textContent = "Buka: Aktif";
          toggleBtn.className = "btn btn-orange";
        } else {
          toggleBtn.textContent = "Aktifkan";
          toggleBtn.className = "btn btn-secondary";
        }
      }
    } else {
      unlockContainer.classList.add("hidden-section");
    }
  }

  renderBadges();
  renderMissionsList();

  // Hide play view, show dashboard view
  document.getElementById("detektif-dashboard-view").classList.remove("hidden-section");
  document.getElementById("detektif-mission-view").classList.add("hidden-section");
}

function renderBadges() {
  const container = document.getElementById("detektif-badges-container");
  if (!container) return;
  container.innerHTML = "";

  Object.keys(BADGES_INFO).forEach(badgeName => {
    const isUnlocked = currentProgress.badges.includes(badgeName);
    const badge = BADGES_INFO[badgeName];
    
    const badgeEl = document.createElement("div");
    badgeEl.className = `glass-panel ${isUnlocked ? "badge-unlocked" : "badge-locked"}`;
    badgeEl.style.padding = "12px";
    badgeEl.style.display = "flex";
    badgeEl.style.alignItems = "center";
    badgeEl.style.gap = "10px";
    badgeEl.style.width = "calc(50% - 8px)";
    badgeEl.style.minWidth = "240px";
    badgeEl.style.opacity = isUnlocked ? "1" : "0.4";
    badgeEl.style.borderLeft = `4px solid ${isUnlocked ? badge.color : "#cbd5e1"}`;
    
    badgeEl.innerHTML = `
      <div style="background-color: ${isUnlocked ? badge.color : "#e2e8f0"}; color: #fff; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.1rem;">
        <i class="fas ${badge.icon}"></i>
      </div>
      <div>
        <div style="font-weight: bold; font-size: 0.85rem; color: var(--text-primary);">${badgeName}</div>
        <div style="font-size: 0.7rem; color: var(--text-secondary); line-height: 1.3; margin-top: 2px;">${badge.desc}</div>
      </div>
    `;
    container.appendChild(badgeEl);
  });
}

function renderMissionsList() {
  const container = document.getElementById("detektif-missions-grid");
  if (!container) return;
  container.innerHTML = "";

  const user = window.auth.getCurrentUser();
  const isBypassed = localStorage.getItem("vlab_bypass_locks") !== "false" && (user && (user.role === "guru" || user.role === "admin"));

  Object.keys(MISSION_CONFIG).forEach(mId => {
    const missionId = parseInt(mId);
    const config = MISSION_CONFIG[missionId];
    
    // Check lock state: Mission 1 is always unlocked. Others unlock when previous is in completedMissions or if bypassed
    const isUnlocked = missionId === 1 || currentProgress.completedMissions.includes(missionId - 1) || isBypassed;
    const isCompleted = currentProgress.completedMissions.includes(missionId);
    const score = currentProgress.missionScores[missionId];

    const card = document.createElement("div");
    card.className = `glass-panel course-card glass-panel-hover ${isUnlocked ? "mission-unlocked" : "mission-locked"}`;
    card.style.cursor = isUnlocked ? "pointer" : "not-allowed";
    card.style.opacity = isUnlocked ? "1" : "0.6";

    card.innerHTML = `
      <div class="course-header">
        <span class="course-fase" style="background-color: ${isCompleted ? "var(--success)" : "var(--brand-blue)"}; color: #fff;">
          ${isCompleted ? "SELESAI" : "MISI " + missionId}
        </span>
        <span class="badge ${isCompleted ? "badge-success" : isUnlocked ? "badge-blue" : "badge-danger"}">
          ${isCompleted ? `${score} XP` : isUnlocked ? "Terbuka" : "Terkunci"}
        </span>
      </div>
      <div>
        <h4 class="course-title" style="font-size: 1.05rem; display: flex; align-items: center; gap: 8px;">
          ${!isUnlocked ? '<i class="fas fa-lock" style="font-size: 0.9rem; color: var(--danger);"></i>' : ""}
          ${config.title}
        </h4>
        <p class="course-desc" style="font-size: 0.8rem; margin-top: 6px;">
          ${getMissionDescription(missionId)}
        </p>
      </div>
      <div style="margin-top: auto; display: flex; justify-content: flex-end;">
        ${isUnlocked 
          ? `<button class="btn btn-primary" style="padding: 6px 12px; font-size: 0.8rem; width: 100%;"><i class="fas fa-search-plus"></i> ${isCompleted ? "Mulai Ulang" : "Investigasi Misi"}</button>`
          : `<button class="btn btn-outline" disabled style="padding: 6px 12px; font-size: 0.8rem; width: 100%;">Terkunci</button>`
        }
      </div>
    `;

    if (isUnlocked) {
      card.addEventListener("click", () => {
        window.location.hash = `#detektif/misi/${missionId}`;
      });
    }

    container.appendChild(card);
  });
}

function getMissionDescription(id) {
  switch (id) {
    case 1: return "Identifikasi objek fisis dan tentukan besaran pokok/turunan beserta satuan SI yang tepat.";
    case 2: return "Latih kemampuan mengkonversi berbagai satuan fisika secara instan dan tepat.";
    case 3: return "Susun analisis dimensi rumus fisika utama dengan penyusun dimensi interaktif.";
    case 4: return "Lakukan pengukuran presisi pada berbagai alat ukur panjang, massa, waktu, dan listrik secara interaktif.";
    case 5: return "Pecahkan tantangan aturan angka penting dan kalkulasi pembulatan operasi ilmiah.";
    case 6: return "Audit dan benahi penulisan angka desimal pengukuran ilmiah yang keliru.";
    case 7: return "Gunakan seluruh keahlian alat ukur untuk menghitung volume dan massa jenis balok acak.";
    default: return "";
  }
}

function getPredikat(score) {
  if (score >= 90) return "Sangat Baik (A)";
  if (score >= 80) return "Baik (B)";
  if (score >= 70) return "Cukup (C)";
  return "Perlu Bimbingan (D)";
}

// Open Mission Playground screen
function playDetektifMission(missionId) {
  const user = window.auth.getCurrentUser();
  if (!user) return;

  currentProgress = window.db.getDetektifProgress(user.id);

  // Guard locks
  const isBypassed = localStorage.getItem("vlab_bypass_locks") !== "false" && (user.role === "guru" || user.role === "admin");
  if (missionId !== 1 && !currentProgress.completedMissions.includes(missionId - 1) && !isBypassed) {
    window.showToast("Misi ini masih terkunci! Selesaikan misi sebelumnya.", "danger");
    window.location.hash = "#detektif";
    return;
  }

  activeMissionId = missionId;
  currentQuestionIndex = 0;
  usedHint = false;
  currentMissionData = {};

  const config = MISSION_CONFIG[missionId];
  document.getElementById("detektif-mission-title").textContent = config.title;
  document.getElementById("detektif-mission-xp-badge").textContent = `XP Misi: +${config.xp} XP`;

  // Set up panels
  document.getElementById("detektif-dashboard-view").classList.add("hidden-section");
  document.getElementById("detektif-mission-view").classList.remove("hidden-section");

  // Show Guidance content
  renderMissionGuidance(missionId);
  
  // Render active workspace
  startMissionActivity(missionId);
  
  // Reset tutor dialog
  resetTutorChat();
}

function renderMissionGuidance(id) {
  const container = document.getElementById("detektif-info-content");
  if (!container) return;

  let text = "";
  switch (id) {
    case 1:
      text = `
        <h4 style="color: var(--brand-blue);"><i class="fas fa-bullseye"></i> Tujuan Misi</h4>
        <p style="font-size: 0.85rem; line-height: 1.4;">Mengidentifikasi besaran pokok dan besaran turunan pada benda-benda fisik, serta menentukan satuan SI (Standar Internasional) mereka secara tepat.</p>
        <h4 style="color: var(--brand-orange);"><i class="fas fa-info-circle"></i> Cara Bermain</h4>
        <p style="font-size: 0.85rem; line-height: 1.4;">Kamu akan dihadapkan pada 10 soal acak. Tentukan nama besaran fisis yang diukur dan satuan SI yang benar dari pilihan jawaban yang disediakan. Setiap jawaban benar bernilai 10 XP.</p>
      `;
      break;
    case 2:
      text = `
        <h4 style="color: var(--brand-blue);"><i class="fas fa-bullseye"></i> Tujuan Misi</h4>
        <p style="font-size: 0.85rem; line-height: 1.4;">Melakukan konversi satuan panjang, massa, waktu, suhu, luas, volume, dan kecepatan secara akurat.</p>
        <h4 style="color: var(--brand-orange);"><i class="fas fa-info-circle"></i> Cara Bermain</h4>
        <p style="font-size: 0.85rem; line-height: 1.4;">Gunakan konverter interaktif untuk membuktikan kelipatan satuan. Kemudian selesaikan 5 tebakan "Benar/Salah" mengenai pernyataan konversi yang diberikan.</p>
      `;
      break;
    case 3:
      text = `
        <h4 style="color: var(--brand-blue);"><i class="fas fa-bullseye"></i> Tujuan Misi</h4>
        <p style="font-size: 0.85rem; line-height: 1.4;">Menentukan dimensi besaran turunan fisika menggunakan basis dimensi pokok [M], [L], [T].</p>
        <h4 style="color: var(--brand-orange);"><i class="fas fa-info-circle"></i> Cara Bermain</h4>
        <p style="font-size: 0.85rem; line-height: 1.4;">Pilih dan susun simbol-simbol dimensi untuk mencocokkan rumus fisika yang diajukan. Gunakan tombol pangkat untuk menyusun dimensi negatif atau pecahan.</p>
      `;
      break;
    case 4:
      text = `
        <h4 style="color: var(--brand-blue);"><i class="fas fa-bullseye"></i> Tujuan Misi</h4>
        <p style="font-size: 0.85rem; line-height: 1.4;">Membaca alat ukur Mistar, Jangka Sorong, Mikrometer Sekrup, Neraca Ohaus, Stopwatch, dan Multimeter secara presisi.</p>
        <h4 style="color: var(--brand-orange);"><i class="fas fa-info-circle"></i> Cara Bermain</h4>
        <p style="font-size: 0.85rem; line-height: 1.4;">Kamu harus menyelesaikan 6 eksperimen pengukuran objek acak: mengukur benda di Mistar, membaca skala jangka sorong, thimble mikrometer sekrup, neraca ohaus, stopwatch, dan multimeter analog.</p>
      `;
      break;
    case 5:
      text = `
        <h4 style="color: var(--brand-blue);"><i class="fas fa-bullseye"></i> Tujuan Misi</h4>
        <p style="font-size: 0.85rem; line-height: 1.4;">Menghitung jumlah angka penting dan melakukan operasi matematis ilmiah sesuai pembulatan fisika.</p>
        <h4 style="color: var(--brand-orange);"><i class="fas fa-info-circle"></i> Cara Bermain</h4>
        <p style="font-size: 0.85rem; line-height: 1.4;">Jawab tantangan mengenai jumlah angka penting pada bilangan desimal/notasi eksponen dan hitunglah penjumlahan/perkalian dengan pembulatan AP terkecil.</p>
      `;
      break;
    case 6:
      text = `
        <h4 style="color: var(--brand-blue);"><i class="fas fa-bullseye"></i> Tujuan Misi</h4>
        <p style="font-size: 0.85rem; line-height: 1.4;">Menganalisis hasil penulisan data ukur yang salah secara sains dan membenahinya.</p>
        <h4 style="color: var(--brand-orange);"><i class="fas fa-info-circle"></i> Cara Bermain</h4>
        <p style="font-size: 0.85rem; line-height: 1.4;">Tentukan letak keganjilan dari data pengukuran yang dipaparkan, lalu ketikkan alternatif penulisan data yang logis sesuai skala terkecil alat ukur.</p>
      `;
      break;
    case 7:
      text = `
        <h4 style="color: var(--brand-blue);"><i class="fas fa-bullseye"></i> Tujuan Misi</h4>
        <p style="font-size: 0.85rem; line-height: 1.4;">Menuntaskan investigasi akhir teknisi untuk menentukan volume dan massa jenis suatu balok logam.</p>
        <h4 style="color: var(--brand-orange);"><i class="fas fa-info-circle"></i> Cara Bermain</h4>
        <p style="font-size: 0.85rem; line-height: 1.4;">Gunakan mistar untuk mengukur panjang, jangka sorong untuk lebar, dan mikrometer sekrup untuk ketebalan balok. Hitung volume, catat ke tabel LKPD, dan buatlah kesimpulan praktikum.</p>
      `;
      break;
  }
  
  // Add tutor shortcut button
  text += `
    <button class="btn btn-outline" id="btn-saya-bingung" style="margin-top: 16px; border-color: var(--brand-orange); color: var(--brand-orange); width: 100%;">
      <i class="fas fa-question-circle"></i> Saya Tidak Mengerti (Petunjuk AI)
    </button>
  `;
  container.innerHTML = text;

  document.getElementById("btn-saya-bingung").addEventListener("click", () => {
    // Switch to tutor tab
    document.getElementById("tab-detektif-tutor").click();
    askTutorHint();
  });
}

function resetTutorChat() {
  const history = document.getElementById("detektif-ai-history");
  if (history) {
    history.innerHTML = `
      <div class="chat-bubble ai">
        Halo Agen! Saya AI Tutor Detektif. Jika Anda merasa bingung saat menginvestigasi misi ini, jangan sungkan mengklik tombol <strong>"Saya Tidak Mengerti"</strong>. Saya akan membimbing Anda langkah demi langkah.
      </div>
    `;
  }
}

// AI Tutor Step-by-Step prompt builder
function askTutorHint() {
  usedHint = true;
  let hint = "";
  
  switch (activeMissionId) {
    case 1:
      const m1Item = currentMissionData.items[currentQuestionIndex];
      hint = `Untuk benda ini: "${m1Item.item}". Perhatikan satuannya. Jika mengandung satuan panjang (seperti cm/m), maka itu adalah besaran Panjang. Ingat, satuan SI untuk Panjang adalah meter, Suhu adalah Kelvin, Massa adalah kg, dan Waktu adalah sekon.`;
      break;
    case 2:
      hint = `Ingat rumus konversi dasar: 1 meter (m) = 100 centimeter (cm) = 1000 milimeter (mm). Jika Anda merubah dari meter ke mm, kalikan dengan 1000. Untuk sebaliknya, bagikan nilainya!`;
      break;
    case 3:
      const formula = currentMissionData.formulas[currentQuestionIndex];
      hint = `Petunjuk dimensi untuk ${formula.name}: ${formula.clue} Dimensi dasar adalah Massa [M], Panjang [L], dan Waktu [T].`;
      break;
    case 4:
      if (currentMissionData.subStep === 1) {
        hint = "Mistar: Sejajarkan ujung kiri balok di angka 0. Baca skala utama di ujung kanan balok dalam satuan cm. Skala terkecil mistar adalah 0.1 cm (1 mm).";
      } else if (currentMissionData.subStep === 2) {
        hint = "Jangka Sorong: Baca Skala Utama (SU) pada garis di sebelah kiri angka nol nonius. Lalu cari garis nonius (skala bawah) yang paling berhimpit lurus dengan skala atas untuk mendapatkan Skala Nonius (SN). Hasil = SU + (SN * 0.1) mm.";
      } else {
        hint = "Mikrometer Sekrup: Baca Skala Utama (SU) horizontal yang tersingkap di lengan silinder. Jika garis bawah 0.5 mm tersingkap, tambahkan 0.5 mm. Tambahkan dengan Skala Putar (SP) pada thimble yang lurus garis tengah utama dikali 0.01 mm.";
      }
      break;
    case 5:
      if (currentMissionData.isOperation) {
        const op = currentMissionData.ops[currentQuestionIndex];
        hint = `Aturan Operasi: ${op.explanation}`;
      } else {
        const num = currentMissionData.nums[currentQuestionIndex];
        hint = `Aturan Angka Penting: ${num.rule}`;
      }
      break;
    case 6:
      const c = currentMissionData.cases[currentQuestionIndex];
      hint = `Analisis Kesalahan: Alat ${c.tool} mengukur nilai ${c.input}. ${c.issue}`;
      break;
    case 7:
      hint = "Langkah Praktikum Terpadu: 1) Gunakan Mistar untuk mengukur panjang balok. 2) Gunakan Jangka Sorong untuk mengukur lebar. 3) Gunakan Mikrometer untuk tebal. 4) Volume = p * l * t. Bulatkan hasil volume sesuai angka penting terkecil dari ketiga pengukuran!";
      break;
  }

  showTutorBubble(hint);
}

function showTutorBubble(text) {
  const history = document.getElementById("detektif-ai-history");
  if (!history) return;

  const bubble = document.createElement("div");
  bubble.className = "chat-bubble ai";
  bubble.innerHTML = `<strong>Tutor:</strong> ${text}`;
  history.appendChild(bubble);
  history.scrollTop = history.scrollHeight;
}

// ----------------------------------------------------
// Mission Activities Engine
// ----------------------------------------------------
function startMissionActivity(id) {
  const workspace = document.getElementById("detektif-game-workspace");
  if (!workspace) return;
  workspace.innerHTML = "";

  switch (id) {
    case 1:
      initMisi1(workspace);
      break;
    case 2:
      initMisi2(workspace);
      break;
    case 3:
      initMisi3(workspace);
      break;
    case 4:
      initMisi4(workspace);
      break;
    case 5:
      initMisi5(workspace);
      break;
    case 6:
      initMisi6(workspace);
      break;
    case 7:
      initMisi7(workspace);
      break;
  }
}

// --- MISI 1: DETEKTIF BESARAN ---
function initMisi1(container) {
  // Shuffle items
  currentMissionData.items = [...MISI1_ITEMS].sort(() => 0.5 - Math.random());
  currentQuestionIndex = 0;
  
  renderMisi1Question(container);
}

function renderMisi1Question(container) {
  container.innerHTML = "";
  
  if (currentQuestionIndex >= 10) {
    completeMission(1, 50);
    return;
  }

  const qData = currentMissionData.items[currentQuestionIndex];

  const header = document.createElement("div");
  header.style.marginBottom = "20px";
  header.innerHTML = `
    <div style="display: flex; justify-content: space-between; font-size: 0.85rem; font-weight: bold; color: var(--text-secondary); margin-bottom: 8px;">
      <span>Pertanyaan ${currentQuestionIndex + 1} dari 10</span>
      <span>Streak: ${missionStreak} 🔥</span>
    </div>
    <div class="progress-bar-container" style="height: 4px;">
      <div class="progress-bar" style="width: ${(currentQuestionIndex / 10) * 100}%;"></div>
    </div>
  `;
  container.appendChild(header);

  const card = document.createElement("div");
  card.className = "glass-panel";
  card.style.padding = "20px";
  card.style.marginBottom = "20px";
  card.innerHTML = `
    <div style="font-size: 0.8rem; text-transform: uppercase; font-weight: bold; color: var(--brand-orange); margin-bottom: 6px;">Barang Bukti Fisik</div>
    <div style="font-size: 1.15rem; font-weight: bold; color: var(--text-primary);"><i class="fas fa-search" style="margin-right: 8px; color: var(--brand-blue);"></i> ${qData.item}</div>
  `;
  container.appendChild(card);

  const questionBody = document.createElement("div");
  questionBody.style.marginBottom = "24px";
  questionBody.innerHTML = `<p style="font-weight: 600; margin-bottom: 12px; font-size: 0.95rem;">${qData.q}</p>`;
  
  const optionsContainer = document.createElement("div");
  optionsContainer.style.display = "flex";
  optionsContainer.style.flexDirection = "column";
  optionsContainer.style.gap = "10px";

  qData.opt.forEach((opt, idx) => {
    const btn = document.createElement("button");
    btn.className = "btn btn-outline";
    btn.style.textAlign = "left";
    btn.style.justifyContent = "flex-start";
    btn.style.padding = "12px 20px";
    btn.innerHTML = `<strong>${String.fromCharCode(65 + idx)}.</strong> ${opt}`;
    
    btn.addEventListener("click", () => {
      // Disable buttons
      optionsContainer.querySelectorAll("button").forEach(b => b.disabled = true);
      
      const isCorrect = idx === qData.correct;
      if (isCorrect) {
        btn.style.backgroundColor = "rgba(16, 185, 129, 0.15)";
        btn.style.borderColor = "var(--success)";
        btn.style.color = "var(--success)";
        missionStreak++;
        window.showToast("Benar! +10 XP", "success");
      } else {
        btn.style.backgroundColor = "rgba(239, 68, 68, 0.15)";
        btn.style.borderColor = "var(--danger)";
        btn.style.color = "var(--danger)";
        
        // Show correct
        const correctBtn = optionsContainer.children[qData.correct];
        correctBtn.style.borderColor = "var(--success)";
        correctBtn.style.color = "var(--success)";
        missionStreak = 0;
        window.showToast("Salah! Coba pelajari konsepnya.", "danger");
      }

      // Check Satuan SI
      renderSiQuestion(container, qData, isCorrect);
    });

    optionsContainer.appendChild(btn);
  });

  questionBody.appendChild(optionsContainer);
  container.appendChild(questionBody);
}

function renderSiQuestion(container, qData, wasPrevCorrect) {
  const siDiv = document.createElement("div");
  siDiv.className = "glass-panel fade-in-section";
  siDiv.style.padding = "20px";
  siDiv.style.marginTop = "20px";
  siDiv.innerHTML = `
    <p style="font-weight: bold; margin-bottom: 12px;">Tantangan SI: Apakah satuan Standar Internasional (SI) untuk besaran ini?</p>
    <div style="display: flex; gap: 8px;">
      <input type="text" class="form-control" id="si-input" placeholder="Tuliskan satuan SI (contoh: Kelvin, m, kg)..." style="flex: 1;">
      <button class="btn btn-primary" id="btn-si-check">Periksa</button>
    </div>
    <div id="si-feedback" style="margin-top: 10px; font-size: 0.85rem; font-weight: bold;"></div>
  `;
  container.appendChild(siDiv);

  document.getElementById("btn-si-check").addEventListener("click", () => {
    const input = document.getElementById("si-input").value.trim().toLowerCase();
    const correctSI = qData.si.toLowerCase();
    const isCorrect = input === correctSI;
    
    document.getElementById("btn-si-check").disabled = true;
    document.getElementById("si-input").disabled = true;
    
    const feedback = document.getElementById("si-feedback");
    if (isCorrect) {
      feedback.style.color = "var(--success)";
      feedback.textContent = `Hebat! Satuan SI yang benar adalah ${qData.si}.`;
      if (wasPrevCorrect) currentProgress.xp += 10;
    } else {
      feedback.style.color = "var(--danger)";
      feedback.textContent = `Kurang tepat. Satuan SI yang benar adalah ${qData.si}.`;
    }

    // Add Continue button
    const nextBtn = document.createElement("button");
    nextBtn.className = "btn btn-orange";
    nextBtn.style.marginTop = "16px";
    nextBtn.style.width = "100%";
    nextBtn.innerHTML = `Lanjut Misi <i class="fas fa-arrow-right"></i>`;
    nextBtn.addEventListener("click", () => {
      currentQuestionIndex++;
      renderMisi1Question(container);
    });
    siDiv.appendChild(nextBtn);
  });
}

// --- MISI 2: LABORATORIUM SATUAN ---
function initMisi2(container) {
  container.innerHTML = `
    <div style="margin-bottom: 24px;">
      <h4 style="color: var(--brand-blue); font-family: 'Outfit'; font-weight: 700; margin-bottom: 12px;"><i class="fas fa-calculator"></i> Konverter Satuan Interaktif</h4>
      <p style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 16px;">Cobalah konverter ini untuk mempermudah perhitungan dimensi dan konversi satuan fisika dasar:</p>
      
      <div style="display: flex; gap: 12px; flex-wrap: wrap;" class="glass-panel">
        <input type="number" class="form-control" id="conv-input" value="1" style="max-width: 120px;">
        <select class="form-control" id="conv-cat" style="max-width: 150px;">
          <option value="panjang">Panjang</option>
          <option value="massa">Massa</option>
          <option value="waktu">Waktu</option>
        </select>
        <select class="form-control" id="conv-from" style="max-width: 100px;"></select>
        <span style="display: flex; align-items: center;">ke</span>
        <select class="form-control" id="conv-to" style="max-width: 100px;"></select>
        <button class="btn btn-primary" id="btn-calc-conv">Konversi</button>
      </div>
      <div style="margin-top: 12px; font-weight: bold; font-size: 1.1rem; color: var(--brand-orange);" id="conv-result-lbl">Hasil: 1 m = 100 cm</div>
    </div>

    <div style="border-top: 1px solid var(--glass-border); padding-top: 20px;" id="misi2-quiz-area">
      <!-- Benar/Salah challenges will render here -->
    </div>
  `;

  // Handle Converter Dropdowns
  const catSelect = document.getElementById("conv-cat");
  const fromSelect = document.getElementById("conv-from");
  const toSelect = document.getElementById("conv-to");
  
  const units = {
    panjang: ["m", "cm", "mm", "km"],
    massa: ["kg", "g", "mg"],
    waktu: ["s", "menit", "jam"]
  };

  const updateDropdowns = () => {
    const cat = catSelect.value;
    fromSelect.innerHTML = "";
    toSelect.innerHTML = "";
    units[cat].forEach(u => {
      fromSelect.innerHTML += `<option value="${u}">${u}</option>`;
      toSelect.innerHTML += `<option value="${u}">${u}</option>`;
    });
    // Default select
    if (toSelect.children[1]) toSelect.children[1].selected = true;
  };

  catSelect.addEventListener("change", updateDropdowns);
  updateDropdowns();

  document.getElementById("btn-calc-conv").addEventListener("click", () => {
    const val = parseFloat(document.getElementById("conv-input").value) || 0;
    const cat = catSelect.value;
    const from = fromSelect.value;
    const to = toSelect.value;
    let res = val;

    // Length conversion formulas
    if (cat === "panjang") {
      let valInM = val;
      if (from === "cm") valInM = val / 100;
      else if (from === "mm") valInM = val / 1000;
      else if (from === "km") valInM = val * 1000;

      if (to === "cm") res = valInM * 100;
      else if (to === "mm") res = valInM * 1000;
      else if (to === "km") res = valInM / 1000;
      else res = valInM;
    } else if (cat === "massa") {
      let valInKg = val;
      if (from === "g") valInKg = val / 1000;
      else if (from === "mg") valInKg = val / 1000000;

      if (to === "g") res = valInKg * 1000;
      else if (to === "mg") res = valInKg * 1000000;
      else res = valInKg;
    } else if (cat === "waktu") {
      let valInS = val;
      if (from === "menit") valInS = val * 60;
      else if (from === "jam") valInS = val * 3600;

      if (to === "menit") res = valInS / 60;
      else if (to === "jam") res = valInS / 3600;
      else res = valInS;
    }

    document.getElementById("conv-result-lbl").textContent = `Hasil: ${val} ${from} = ${res} ${to}`;
  });

  // Render True/False Challenges
  const quizArea = document.getElementById("misi2-quiz-area");
  currentMissionData.quiz = [
    { statement: "3.5 km = 3500 m", correct: true },
    { statement: "250 gram = 2.5 kg", correct: false, fix: "0.25 kg" },
    { statement: "1.5 jam = 5400 sekon", correct: true },
    { statement: "120 cm = 1.2 m", correct: true },
    { statement: "500 cm² = 5 m²", correct: false, fix: "0.05 m²" }
  ];
  currentQuestionIndex = 0;
  renderMisi2Challenge(quizArea);
}

function renderMisi2Challenge(container) {
  container.innerHTML = "";
  if (currentQuestionIndex >= 5) {
    completeMission(2, 75);
    return;
  }

  const q = currentMissionData.quiz[currentQuestionIndex];

  container.innerHTML = `
    <h4 style="font-family: 'Outfit'; font-weight: 700; margin-bottom: 12px; color: var(--brand-orange);">Tantangan Benar/Salah (${currentQuestionIndex + 1}/5)</h4>
    <div class="glass-panel" style="padding: 20px; text-align: center; font-size: 1.3rem; font-weight: bold; margin-bottom: 20px;">
      ${q.statement}
    </div>
    
    <div style="display: flex; gap: 16px; margin-bottom: 16px;">
      <button class="btn btn-outline" id="btn-tf-true" style="flex: 1; border-color: var(--success); color: var(--success);"><i class="fas fa-check"></i> BENAR</button>
      <button class="btn btn-outline" id="btn-tf-false" style="flex: 1; border-color: var(--danger); color: var(--danger);"><i class="fas fa-times"></i> SALAH</button>
    </div>
    <div id="tf-feedback" class="glass-panel hidden-section" style="padding: 16px; margin-top: 12px;"></div>
  `;

  const handleAns = (ans) => {
    document.getElementById("btn-tf-true").disabled = true;
    document.getElementById("btn-tf-false").disabled = true;
    const fb = document.getElementById("tf-feedback");
    fb.classList.remove("hidden-section");

    const isCorrect = ans === q.correct;
    if (isCorrect) {
      fb.style.backgroundColor = "rgba(16, 185, 129, 0.15)";
      fb.style.color = "var(--success)";
      fb.innerHTML = `<strong>Benar!</strong> Pernyataan tersebut ${q.correct ? "Benar" : "Salah"}.`;
      currentProgress.xp += 15;
    } else {
      fb.style.backgroundColor = "rgba(239, 68, 68, 0.15)";
      fb.style.color = "var(--danger)";
      fb.innerHTML = `<strong>Salah!</strong> Pernyataan tersebut seharusnya ${q.correct ? "Benar" : "Salah"}.`;
    }

    if (!q.correct) {
      // Must fix it
      const fixDiv = document.createElement("div");
      fixDiv.style.marginTop = "12px";
      fixDiv.innerHTML = `
        <label style="font-weight: bold; font-size: 0.85rem; display: block; margin-bottom: 6px;">Tuliskan perbaikan nilai konversinya yang benar:</label>
        <div style="display: flex; gap: 8px;">
          <input type="text" class="form-control" id="fix-input" placeholder="Contoh: ${q.fix}...">
          <button class="btn btn-primary" id="btn-fix-check">Periksa</button>
        </div>
        <div id="fix-feedback" style="margin-top: 8px; font-weight: bold; font-size: 0.85rem;"></div>
      `;
      fb.appendChild(fixDiv);

      document.getElementById("btn-fix-check").addEventListener("click", () => {
        const input = document.getElementById("fix-input").value.trim().toLowerCase();
        const correctFix = q.fix.toLowerCase();
        
        document.getElementById("btn-fix-check").disabled = true;
        document.getElementById("fix-input").disabled = true;
        
        const fixFb = document.getElementById("fix-feedback");
        if (input === correctFix) {
          fixFb.style.color = "var(--success)";
          fixFb.textContent = "Sempurna! Perbaikan Anda tepat.";
        } else {
          fixFb.style.color = "var(--danger)";
          fixFb.textContent = `Masih keliru. Perbaikan yang benar adalah: ${q.fix}`;
        }
        renderNextBtn(fb);
      });
    } else {
      renderNextBtn(fb);
    }
  };

  document.getElementById("btn-tf-true").addEventListener("click", () => handleAns(true));
  document.getElementById("btn-tf-false").addEventListener("click", () => handleAns(false));
}

function renderNextBtn(container) {
  const nextBtn = document.createElement("button");
  nextBtn.className = "btn btn-orange";
  nextBtn.style.marginTop = "16px";
  nextBtn.style.width = "100%";
  nextBtn.innerHTML = `Lanjut Misi <i class="fas fa-arrow-right"></i>`;
  nextBtn.addEventListener("click", () => {
    currentQuestionIndex++;
    renderMisi2Challenge(document.getElementById("misi2-quiz-area"));
  });
  container.appendChild(nextBtn);
}

// --- MISI 3: AHLI DIMENSI ---
function initMisi3(container) {
  currentMissionData.formulas = [...MISI3_FORMULAS].sort(() => 0.5 - Math.random());
  currentQuestionIndex = 0;
  renderMisi3Challenge(container);
}

function renderMisi3Challenge(container) {
  container.innerHTML = "";
  if (currentQuestionIndex >= 6) {
    completeMission(3, 100);
    return;
  }

  const f = currentMissionData.formulas[currentQuestionIndex];
  
  container.innerHTML = `
    <div style="display: flex; justify-content: space-between; font-size: 0.85rem; font-weight: bold; color: var(--text-secondary); margin-bottom: 8px;">
      <span>Rumus ${currentQuestionIndex + 1} dari 6</span>
      <span>Streak: ${missionStreak} 🔥</span>
    </div>
    <div class="progress-bar-container" style="height: 4px; margin-bottom: 20px;">
      <div class="progress-bar" style="width: ${(currentQuestionIndex / 6) * 100}%;"></div>
    </div>

    <h4 style="font-family: 'Outfit'; font-weight: 700; margin-bottom: 16px;">Tentukan Dimensi dari:</h4>
    <div class="glass-panel" style="padding: 20px; text-align: center; margin-bottom: 24px;">
      <h2 style="font-size: 1.6rem; color: var(--brand-blue);">${f.name}</h2>
      <div style="font-family: monospace; font-size: 1.1rem; color: var(--text-secondary); margin-top: 6px;">Satuan/Rumus: ${f.eq}</div>
    </div>

    <div style="margin-bottom: 24px;">
      <label style="font-weight: bold; display: block; margin-bottom: 10px;">Susun Dimensi Anda:</label>
      <div style="display: flex; gap: 8px; align-items: center;">
        <div id="dim-builder-output" style="flex: 1; min-height: 48px; background-color: var(--bg-primary); border: 1px solid var(--glass-border); border-radius: 8px; display: flex; align-items: center; padding: 0 16px; font-family: monospace; font-size: 1.3rem; font-weight: bold;"></div>
        <button class="btn btn-outline" id="btn-dim-clear"><i class="fas fa-backspace"></i> Hapus</button>
      </div>
    </div>

    <div style="margin-bottom: 24px;">
      <label style="font-weight: bold; display: block; margin-bottom: 10px;">Pilihan Simbol Pokok & Pangkat:</label>
      <div style="display: flex; gap: 8px; flex-wrap: wrap;">
        <button class="btn btn-secondary btn-dim-add" value="[M]">[M]</button>
        <button class="btn btn-secondary btn-dim-add" value="[L]">[L]</button>
        <button class="btn btn-secondary btn-dim-add" value="[T]">[T]</button>
        <button class="btn btn-secondary btn-dim-add" value="[I]">[I]</button>
        <button class="btn btn-secondary btn-dim-add" value="[Θ]">[Θ]</button>
        <button class="btn btn-outline btn-dim-add" value="^-1">^-1</button>
        <button class="btn btn-outline btn-dim-add" value="^-2">^-2</button>
        <button class="btn btn-outline btn-dim-add" value="^-3">^-3</button>
        <button class="btn btn-outline btn-dim-add" value="^2">^2</button>
        <button class="btn btn-outline btn-dim-add" value="^3">^3</button>
      </div>
    </div>

    <button class="btn btn-primary" id="btn-dim-submit" style="width: 100%;">Kirim Jawaban Dimensi</button>
    <div id="dim-feedback" class="glass-panel hidden-section" style="padding: 16px; margin-top: 16px;"></div>
  `;

  const output = document.getElementById("dim-builder-output");
  let assembled = "";

  document.querySelectorAll(".btn-dim-add").forEach(btn => {
    btn.addEventListener("click", () => {
      assembled += btn.value;
      output.textContent = assembled;
    });
  });

  document.getElementById("btn-dim-clear").addEventListener("click", () => {
    assembled = "";
    output.textContent = assembled;
  });

  document.getElementById("btn-dim-submit").addEventListener("click", () => {
    const isCorrect = assembled === f.dim;
    const fb = document.getElementById("dim-feedback");
    
    document.getElementById("btn-dim-submit").disabled = true;
    document.querySelectorAll(".btn-dim-add").forEach(b => b.disabled = true);
    document.getElementById("btn-dim-clear").disabled = true;
    
    fb.classList.remove("hidden-section");

    if (isCorrect) {
      fb.style.backgroundColor = "rgba(16, 185, 129, 0.15)";
      fb.style.color = "var(--success)";
      fb.innerHTML = `<strong>Benar!</strong> Dimensi dari ${f.name} adalah ${f.dim}.`;
      currentProgress.xp += 20;
      missionStreak++;
    } else {
      fb.style.backgroundColor = "rgba(239, 68, 68, 0.15)";
      fb.style.color = "var(--danger)";
      fb.innerHTML = `<strong>Kurang Tepat!</strong> Jawaban yang benar adalah <strong>${f.dim}</strong>.`;
      missionStreak = 0;
    }

    const nextBtn = document.createElement("button");
    nextBtn.className = "btn btn-orange";
    nextBtn.style.marginTop = "16px";
    nextBtn.style.width = "100%";
    nextBtn.innerHTML = `Lanjut <i class="fas fa-arrow-right"></i>`;
    nextBtn.addEventListener("click", () => {
      currentQuestionIndex++;
      renderMisi3Challenge(container);
    });
    fb.appendChild(nextBtn);
  });
}

// --- MISI 4: LABORATORIUM PENGUKURAN ---
function initMisi4(container) {
  // We need to complete 6 sub-steps: Mistar (1), Jangka Sorong (2), Mikrometer Sekrup (3), Neraca Ohaus (4), Stopwatch (5), Multimeter (6)
  currentMissionData.subStep = 1;
  currentMissionData.measurements = [];
  
  // Randomize object index for each step (0, 1, or 2)
  currentMissionData.objIdxs = [
    Math.floor(Math.random() * 3),
    Math.floor(Math.random() * 3),
    Math.floor(Math.random() * 3),
    Math.floor(Math.random() * 3),
    Math.floor(Math.random() * 3),
    Math.floor(Math.random() * 3)
  ];
  
  // Randomize targets based on object choice for higher realism
  // Step 1: Mistar
  const rulerObjIdx = currentMissionData.objIdxs[0];
  if (rulerObjIdx === 0) { // Penghapus
    currentMissionData.rulerTarget = (3.0 + Math.random() * 2.0).toFixed(1);
  } else if (rulerObjIdx === 1) { // Pensil Hijau
    currentMissionData.rulerTarget = (10.0 + Math.random() * 5.0).toFixed(1);
  } else { // Flashdisk
    currentMissionData.rulerTarget = (5.5 + Math.random() * 2.0).toFixed(1);
  }
  
  // Step 2: Jangka Sorong
  const caliperObjIdx = currentMissionData.objIdxs[1];
  if (caliperObjIdx === 0) { // Cincin Emas
    currentMissionData.caliperTarget = (14.0 + Math.random() * 4.0).toFixed(1);
  } else if (caliperObjIdx === 1) { // Kelereng Kaca
    currentMissionData.caliperTarget = (20.0 + Math.random() * 6.0).toFixed(1);
  } else { // Tebal Koin
    currentMissionData.caliperTarget = (1.8 + Math.random() * 1.0).toFixed(1);
  }
  
  // Step 3: Mikrometer Sekrup
  const microObjIdx = currentMissionData.objIdxs[2];
  if (microObjIdx === 0) { // Kertas
    currentMissionData.microTarget = (0.07 + Math.random() * 0.08).toFixed(2);
  } else if (microObjIdx === 1) { // Kawat
    currentMissionData.microTarget = (1.00 + Math.random() * 1.5).toFixed(2);
  } else { // Silet
    currentMissionData.microTarget = (0.15 + Math.random() * 0.3).toFixed(2);
  }
  
  // Step 4: Neraca
  const neracaObjIdx = currentMissionData.objIdxs[3];
  if (neracaObjIdx === 0) { // Apel
    currentMissionData.neracaTarget = (120.0 + Math.random() * 60).toFixed(1);
  } else if (neracaObjIdx === 1) { // Batu Kali
    currentMissionData.neracaTarget = (250.0 + Math.random() * 200).toFixed(1);
  } else { // Buku Catatan
    currentMissionData.neracaTarget = (80.0 + Math.random() * 70).toFixed(1);
  }
  
  // Step 5: Stopwatch
  const swObjIdx = currentMissionData.objIdxs[4];
  if (swObjIdx === 0) { // Mobil
    currentMissionData.stopwatchTarget = (5.0 + Math.random() * 7.0).toFixed(1);
  } else if (swObjIdx === 1) { // Kelereng jatuh
    currentMissionData.stopwatchTarget = (1.2 + Math.random() * 1.8).toFixed(1);
  } else { // Pendulum
    currentMissionData.stopwatchTarget = (15.0 + Math.random() * 10).toFixed(1);
  }
  
  // Step 6: Multimeter
  const multiObjIdx = currentMissionData.objIdxs[5];
  if (multiObjIdx === 0) { // Baterai AA
    currentMissionData.multimeterTarget = (1.2 + Math.random() * 0.4).toFixed(1);
  } else if (multiObjIdx === 1) { // Aki motor
    currentMissionData.multimeterTarget = (11.0 + Math.random() * 2.0).toFixed(1);
  } else { // Solar cell
    currentMissionData.multimeterTarget = (3.0 + Math.random() * 3.5).toFixed(1);
  }
  
  startMisi4Step(container);
}

function startMisi4Step(container) {
  container.innerHTML = "";
  const step = currentMissionData.subStep;

  if (step > 6) {
    // Save to LKPD digital Progress
    currentProgress.lkpd.dataMisi4 = currentMissionData.measurements;
    window.db.saveDetektifProgress(currentProgress);
    
    completeMission(4, 250);
    return;
  }

  const alatNames = ["Mistar", "Jangka Sorong", "Mikrometer Sekrup", "Neraca Ohaus", "Stopwatch Analog", "Multimeter Analog"];
  const objIdx = currentMissionData.objIdxs[step - 1];
  const objectsList = [
    ["Penghapus Karet", "Pensil Hijau", "Flashdisk USB"],
    ["Cincin Emas (Diameter Dalam)", "Kelereng Kaca (Diameter Luar)", "Tebal Koin 500 Rupiah"],
    ["Ketebalan Kertas HVS", "Diameter Kawat Tembaga", "Tebal Silet Cukur"],
    ["Buah Apel", "Batu Kali", "Buku Catatan Kecil"],
    ["Mobil Mainan (Baterai)", "Bola Kelereng Jatuh", "Ayunan Pendulum Sederhana"],
    ["Baterai ABC AA", "Aki Motor 12V", "Mini Solar Cell"]
  ];
  const objName = objectsList[step - 1][objIdx];

  container.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; flex-wrap: wrap; gap: 8px;">
      <div>
        <h4 style="font-family: 'Outfit'; font-weight: 700; margin: 0;">Eksperimen Ukur ${step}/6: ${alatNames[step - 1]}</h4>
        <div style="font-size: 0.95rem; color: #f59e0b; font-weight: bold; margin-top: 4px;">
          <i class="fas fa-cube"></i> Objek Ukur: ${objName}
        </div>
      </div>
      <button class="btn btn-secondary" id="btn-misi4-magnifier" style="padding: 6px 12px; font-size: 0.85rem; display: flex; align-items: center; gap: 6px; cursor: pointer;">
        <i class="fas fa-search-plus"></i> Kaca Pembesar: <span id="magnifier-status">NONAKTIF</span>
      </button>
    </div>

    <!-- Zoom Control Panel -->
    <div class="glass-panel" id="misi4-zoom-panel" style="padding: 10px 16px; margin-bottom: 12px; display: none; align-items: center; gap: 12px;">
      <label style="font-weight: bold; font-size: 0.85rem; margin: 0; white-space: nowrap; color: #cbd5e1;"><i class="fas fa-sliders-h"></i> Atur Perbesaran Gambar:</label>
      <input type="range" id="misi4-zoom-slider" min="1" max="2.5" step="0.1" value="1" style="flex: 1; cursor: pointer;">
      <span id="misi4-zoom-val" style="font-weight: bold; font-size: 0.9rem; min-width: 40px; text-align: right; color: #cbd5e1;">1.0x</span>
    </div>

    <div id="misi4-canvas-container" style="background-color: #0f172a; border-radius: 12px; margin-bottom: 8px; overflow: auto; position: relative; height: 240px; cursor: grab;">
      <canvas id="misi4-canvas" width="600" height="240" style="width: 100%; height: 100%; display: block; background-color: #1e293b; transition: width 0.1s ease, height 0.1s ease;"></canvas>
    </div>
    
    <div style="font-size: 0.85rem; color: #cbd5e1; margin-bottom: 20px; text-align: center; font-weight: 500;">
      <i class="fas fa-hand-pointer"></i> Klik/sentuh dan geser langsung pada gambar di atas untuk menyesuaikan skala!
    </div>

    <div class="glass-panel" style="padding: 16px; margin-bottom: 20px; display: none;">
      <label style="font-weight: bold; display: block; margin-bottom: 8px;" id="misi4-slider-lbl">Posisikan Rahang / Skala:</label>
      <input type="range" class="form-control" id="misi4-slider" min="0" max="100" value="0" style="width: 100%;">
    </div>

    <div class="glass-panel" style="padding: 16px; margin-bottom: 20px;">
      <label style="font-weight: bold; display: block; margin-bottom: 8px;">Ketikkan Hasil Pengukuran Anda:</label>
      <div style="display: flex; gap: 8px;">
        <input type="number" step="0.01" class="form-control" id="misi4-ans-input" placeholder="Masukkan angka...">
        <span style="display: flex; align-items: center; font-weight: bold;" id="misi4-unit-lbl">cm</span>
        <button class="btn btn-primary" id="btn-misi4-check">Periksa Pembacaan</button>
      </div>
    </div>
    <div id="misi4-feedback" class="glass-panel hidden-section" style="padding: 16px;"></div>
  `;

  const canvas = document.getElementById("misi4-canvas");
  const slider = document.getElementById("misi4-slider");
  const unitLbl = document.getElementById("misi4-unit-lbl");
  
  if (step === 1) {
    unitLbl.textContent = "cm";
    slider.min = "0";
    slider.max = "100";
    slider.value = "10";
    drawMistarCanvas(canvas, parseFloat(slider.value));
    slider.addEventListener("input", () => drawMistarCanvas(canvas, parseFloat(slider.value)));
  } else if (step === 2) {
    unitLbl.textContent = "mm";
    slider.min = "0";
    slider.max = "100";
    slider.value = "20";
    drawCaliperCanvas(canvas, parseFloat(slider.value));
    slider.addEventListener("input", () => drawCaliperCanvas(canvas, parseFloat(slider.value)));
  } else if (step === 3) {
    unitLbl.textContent = "mm";
    slider.min = "0";
    slider.max = "100";
    slider.value = "10";
    drawMicroCanvas(canvas, parseFloat(slider.value));
    slider.addEventListener("input", () => drawMicroCanvas(canvas, parseFloat(slider.value)));
  } else if (step === 4) {
    unitLbl.textContent = "g";
    slider.min = "0";
    slider.max = "100";
    slider.value = "20";
    drawNeracaCanvas(canvas, parseFloat(slider.value));
    slider.addEventListener("input", () => drawNeracaCanvas(canvas, parseFloat(slider.value)));
  } else if (step === 5) {
    unitLbl.textContent = "s";
    slider.min = "0";
    slider.max = "100";
    slider.value = "15";
    drawStopwatchCanvas(canvas, parseFloat(slider.value));
    slider.addEventListener("input", () => drawStopwatchCanvas(canvas, parseFloat(slider.value)));
  } else if (step === 6) {
    unitLbl.textContent = "V";
    slider.min = "0";
    slider.max = "100";
    slider.value = "25";
    drawMultimeterCanvas(canvas, parseFloat(slider.value));
    slider.addEventListener("input", () => drawMultimeterCanvas(canvas, parseFloat(slider.value)));
  }

  // Mouse & Touch Interaction for Direct Dragging on Canvas
  let isDragging = false;
  let magnifierActive = false;

  const magBtn = document.getElementById("btn-misi4-magnifier");
  const magStatus = document.getElementById("magnifier-status");
  const zoomPanel = document.getElementById("misi4-zoom-panel");
  const zoomSlider = document.getElementById("misi4-zoom-slider");
  const zoomVal = document.getElementById("misi4-zoom-val");
  const canvasContainer = document.getElementById("misi4-canvas-container");

  magBtn.addEventListener("click", () => {
    magnifierActive = !magnifierActive;
    if (magnifierActive) {
      magBtn.classList.remove("btn-secondary");
      magBtn.classList.add("btn-orange");
      magStatus.textContent = "AKTIF";
      zoomPanel.style.display = "flex";
    } else {
      magBtn.classList.remove("btn-orange");
      magBtn.classList.add("btn-secondary");
      magStatus.textContent = "NONAKTIF";
      zoomPanel.style.display = "none";
      zoomSlider.value = "1";
      zoomVal.textContent = "1.0x";
      canvas.style.width = "100%";
      canvas.style.height = "100%";
      canvasContainer.scrollLeft = 0;
      canvasContainer.scrollTop = 0;
    }
  });

  zoomSlider.addEventListener("input", () => {
    const val = parseFloat(zoomSlider.value);
    zoomVal.textContent = val.toFixed(1) + "x";
    canvas.style.width = (val * 100) + "%";
    canvas.style.height = (val * 100) + "%";
  });

  function updateFromPosition(clientX) {
    if (slider.disabled) return;
    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, x / rect.width));
    const min = parseFloat(slider.min);
    const max = parseFloat(slider.max);
    const newVal = min + percentage * (max - min);
    slider.value = newVal.toString();
    slider.dispatchEvent(new Event("input"));
  }

  canvas.addEventListener("mousedown", (e) => {
    if (slider.disabled) return;
    isDragging = true;
    updateFromPosition(e.clientX);
  });

  window.addEventListener("mousemove", (e) => {
    if (isDragging) {
      updateFromPosition(e.clientX);
    }
  });

  window.addEventListener("mouseup", () => {
    isDragging = false;
  });

  // Touch Support for Mobile Dragging
  canvas.addEventListener("touchstart", (e) => {
    if (slider.disabled) return;
    if (e.touches.length > 0) {
      isDragging = true;
      updateFromPosition(e.touches[0].clientX);
    }
  });

  window.addEventListener("touchmove", (e) => {
    if (e.touches.length > 0) {
      if (isDragging) {
        updateFromPosition(e.touches[0].clientX);
        e.preventDefault();
      }
    }
  }, { passive: false });

  window.addEventListener("touchend", () => {
    isDragging = false;
  });

  document.getElementById("btn-misi4-check").addEventListener("click", () => {
    const ans = parseFloat(document.getElementById("misi4-ans-input").value);
    const fb = document.getElementById("misi4-feedback");
    
    let target = 0;
    let isCorrect = false;
    let textFeedback = "";

    if (step === 1) {
      target = parseFloat(currentMissionData.rulerTarget);
      isCorrect = Math.abs(ans - target) <= 0.05;
      textFeedback = `Mistar: Nilai target pembacaan adalah ${target} cm.`;
    } else if (step === 2) {
      target = parseFloat(currentMissionData.caliperTarget);
      isCorrect = Math.abs(ans - target) <= 0.1;
      textFeedback = `Jangka Sorong: Nilai target pembacaan adalah ${target} mm.`;
    } else if (step === 3) {
      target = parseFloat(currentMissionData.microTarget);
      isCorrect = Math.abs(ans - target) <= 0.01;
      textFeedback = `Mikrometer Sekrup: Nilai target pembacaan adalah ${target} mm.`;
    } else if (step === 4) {
      target = parseFloat(currentMissionData.neracaTarget);
      isCorrect = Math.abs(ans - target) <= 0.1;
      textFeedback = `Neraca Ohaus: Nilai target pembacaan adalah ${target} g.`;
    } else if (step === 5) {
      target = parseFloat(currentMissionData.stopwatchTarget);
      isCorrect = Math.abs(ans - target) <= 0.2;
      textFeedback = `Stopwatch: Nilai target pembacaan adalah ${target} s.`;
    } else if (step === 6) {
      target = parseFloat(currentMissionData.multimeterTarget);
      isCorrect = Math.abs(ans - target) <= 0.1;
      textFeedback = `Voltmeter: Nilai target pembacaan adalah ${target} V.`;
    }

    fb.classList.remove("hidden-section");
    document.getElementById("btn-misi4-check").disabled = true;
    document.getElementById("misi4-ans-input").disabled = true;
    slider.disabled = true;

    if (isCorrect) {
      fb.style.backgroundColor = "rgba(16, 185, 129, 0.15)";
      fb.style.color = "var(--success)";
      fb.innerHTML = `<strong>Benar!</strong> Pembacaan tepat: ${ans} ${unitLbl.textContent}.`;
      currentProgress.xp += 50;
      
      currentMissionData.measurements.push({
        alat: alatNames[step - 1],
        target: target,
        siswa: ans,
        status: "Benar"
      });
    } else {
      fb.style.backgroundColor = "rgba(239, 68, 68, 0.15)";
      fb.style.color = "var(--danger)";
      fb.innerHTML = `<strong>Salah!</strong> ${textFeedback} Jawaban Anda: ${ans} ${unitLbl.textContent}.`;
      
      currentMissionData.measurements.push({
        alat: alatNames[step - 1],
        target: target,
        siswa: ans,
        status: "Salah"
      });
    }

    const nextBtn = document.createElement("button");
    nextBtn.className = "btn btn-orange";
    nextBtn.style.marginTop = "12px";
    nextBtn.style.width = "100%";
    nextBtn.innerHTML = `Lanjut Alat Berikutnya <i class="fas fa-arrow-right"></i>`;
    nextBtn.addEventListener("click", () => {
      currentMissionData.subStep++;
      startMisi4Step(container);
    });
    fb.appendChild(nextBtn);
  });
}

// Visual drawing functions for Mistar, Caliper, and Micrometer
function drawMistarCanvas(canvas, sliderVal) {
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Background
  ctx.fillStyle = "#1e293b";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const target = parseFloat(currentMissionData.rulerTarget);
  const pxPerCm = 25;
  const startX = 50 + (sliderVal * 2); // slider shifts the block or the ruler
  const blockWidth = target * pxPerCm;

  const objIdx = currentMissionData.objIdxs[0];
  
  // Draw selected object
  ctx.save();
  if (objIdx === 0) {
    // Penghapus Karet
    ctx.fillStyle = "#ec4899"; // pink rubber
    ctx.roundRect(startX, 60, blockWidth * 0.6, 30, {topLeft: 4, bottomLeft: 4});
    ctx.fill();
    ctx.fillStyle = "#3b82f6"; // blue rubber
    ctx.roundRect(startX + blockWidth * 0.6, 60, blockWidth * 0.4, 30, {topRight: 4, bottomRight: 4});
    ctx.fill();
    
    // Paper sleeve
    ctx.fillStyle = "#f8fafc";
    ctx.fillRect(startX + blockWidth * 0.35, 58, blockWidth * 0.35, 34);
    ctx.strokeStyle = "#94a3b8";
    ctx.lineWidth = 1;
    ctx.strokeRect(startX + blockWidth * 0.35, 58, blockWidth * 0.35, 34);
    
    ctx.fillStyle = "#1e293b";
    ctx.font = "bold 8px Outfit";
    ctx.fillText("PENGHAPUS", startX + blockWidth * 0.38, 78);
  } else if (objIdx === 1) {
    // Pensil Hijau
    const bodyW = blockWidth - 25;
    
    // Pink eraser on left
    ctx.fillStyle = "#f472b6";
    ctx.roundRect(startX, 68, 6, 14, {topLeft: 3, bottomLeft: 3});
    ctx.fill();
    
    // Silver ferrule
    ctx.fillStyle = "#94a3b8";
    ctx.fillRect(startX + 6, 68, 5, 14);
    
    // Green body
    ctx.fillStyle = "#15803d";
    ctx.fillRect(startX + 11, 68, bodyW - 11, 14);
    
    // Yellow stripe on pencil body
    ctx.fillStyle = "#fbbf24";
    ctx.fillRect(startX + 11, 74, bodyW - 11, 2);
    
    // Wooden tip cone
    ctx.fillStyle = "#fde047";
    ctx.beginPath();
    ctx.moveTo(startX + bodyW, 68);
    ctx.lineTo(startX + blockWidth, 75);
    ctx.lineTo(startX + bodyW, 82);
    ctx.closePath();
    ctx.fill();
    
    // Lead graphite point
    ctx.fillStyle = "#334155";
    ctx.beginPath();
    ctx.moveTo(startX + blockWidth - 5, 71.5);
    ctx.lineTo(startX + blockWidth, 75);
    ctx.lineTo(startX + blockWidth - 5, 78.5);
    ctx.closePath();
    ctx.fill();
  } else {
    // Flashdisk USB
    ctx.fillStyle = "#0f172a"; // dark casing
    ctx.roundRect(startX, 62, blockWidth - 16, 26, 4);
    ctx.fill();
    
    // Silver metal USB cap connector
    ctx.fillStyle = "#94a3b8";
    ctx.fillRect(startX + blockWidth - 16, 66, 16, 18);
    
    // Blue line accent
    ctx.strokeStyle = "#38bdf8";
    ctx.lineWidth = 1.5;
    ctx.strokeRect(startX + 4, 66, 12, 18);
  }
  ctx.restore();

  // Draw Ruler
  const rulerX = 50;
  const rulerY = 120;
  ctx.fillStyle = "#cbd5e1";
  ctx.fillRect(rulerX, rulerY, 450, 40);

  ctx.strokeStyle = "#0f172a";
  ctx.lineWidth = 1;
  
  // Ticks every mm (0.1 cm)
  for (let i = 0; i <= 160; i++) {
    const x = rulerX + (i * (pxPerCm / 10));
    let tickH = 6;
    if (i % 10 === 0) {
      tickH = 15;
      ctx.fillStyle = "#0f172a";
      ctx.font = "bold 9px sans-serif";
      ctx.fillText((i / 10).toString(), x - 4, rulerY + 28);
    } else if (i % 5 === 0) {
      tickH = 10;
    }
    ctx.beginPath();
    ctx.moveTo(x, rulerY);
    ctx.lineTo(x, rulerY + tickH);
    ctx.stroke();
  }
}

function drawCaliperCanvas(canvas, sliderVal) {
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Dark background
  ctx.fillStyle = "#1e293b";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const targetVal = parseFloat(currentMissionData.caliperTarget);
  const shift = (sliderVal - 50) * 0.5 + targetVal;
  const slideX = 80 + (shift * 4);
  const objW = shift * 4;

  const objIdx = currentMissionData.objIdxs[1];
  
  // 1. Draw Object
  ctx.save();
  if (objIdx === 0) {
    // Cincin Emas (measured on UPPER jaws, outside the jaws)
    const cx = 80 + objW / 2;
    const cy = 52;
    const innerR = Math.max(8, objW / 2);
    const outerR = innerR + 6;
    
    // Draw gold ring
    const goldGrad = ctx.createRadialGradient(cx - 3, cy - 3, 2, cx, cy, outerR);
    goldGrad.addColorStop(0, "#fde047");
    goldGrad.addColorStop(0.7, "#eab308");
    goldGrad.addColorStop(1, "#ca8a04");
    
    ctx.fillStyle = goldGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, outerR, 0, Math.PI * 2);
    ctx.arc(cx, cy, innerR, 0, Math.PI * 2, true); // hole
    ctx.fill();
    
    // Diamond Gem on bottom
    ctx.fillStyle = "#bae6fd";
    ctx.beginPath();
    ctx.moveTo(cx, cy + outerR);
    ctx.lineTo(cx - 5, cy + outerR + 6);
    ctx.lineTo(cx, cy + outerR + 10);
    ctx.lineTo(cx + 5, cy + outerR + 6);
    ctx.closePath();
    ctx.fill();
  } else if (objIdx === 1) {
    // Kelereng Kaca (measured on LOWER jaws, clamped)
    const cx = 80 + objW / 2;
    const cy = 135;
    const r = Math.max(5, objW / 2);
    
    const marbleGrad = ctx.createRadialGradient(cx - r*0.3, cy - r*0.3, r*0.1, cx, cy, r);
    marbleGrad.addColorStop(0, "#e0f7fa");
    marbleGrad.addColorStop(0.5, "#26c6da");
    marbleGrad.addColorStop(1, "#00838f");
    ctx.fillStyle = marbleGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();
    
    // Shiny swirl inside marble
    ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
    ctx.lineWidth = Math.max(1, r * 0.15);
    ctx.beginPath();
    ctx.arc(cx - r*0.2, cy - r*0.1, r * 0.5, 0.2, Math.PI - 0.5);
    ctx.stroke();
  } else {
    // Tebal Koin (measured on LOWER jaws, clamped)
    const cx = 80 + objW / 2;
    const cy = 135;
    const w = objW;
    const h = 40;
    
    // Silver coin cylinder
    const coinGrad = ctx.createLinearGradient(cx - w/2, cy - h/2, cx + w/2, cy + h/2);
    coinGrad.addColorStop(0, "#f1f5f9");
    coinGrad.addColorStop(0.5, "#cbd5e1");
    coinGrad.addColorStop(1, "#475569");
    ctx.fillStyle = coinGrad;
    ctx.fillRect(cx - w/2, cy - h/2, w, h);
    
    // Ridges on coin edge
    ctx.strokeStyle = "rgba(0,0,0,0.25)";
    ctx.lineWidth = 1;
    for (let rx = cx - w/2 + 2; rx < cx + w/2; rx += 3) {
      ctx.beginPath();
      ctx.moveTo(rx, cy - h/2);
      ctx.lineTo(rx, cy + h/2);
      ctx.stroke();
    }
    
    // Inner circular face embossing
    ctx.strokeStyle = "rgba(255,255,255,0.4)";
    ctx.strokeRect(cx - w/2 + 1, cy - h/2 + 1, w - 2, h - 2);
  }
  ctx.restore();

  // 2. Draw Caliper Main Beam & Jaws (Fixed Part)
  const steelGrad = ctx.createLinearGradient(0, 80, 0, 105);
  steelGrad.addColorStop(0, "#e2e8f0");
  steelGrad.addColorStop(0.5, "#94a3b8");
  steelGrad.addColorStop(1, "#475569");
  
  const jawGrad = ctx.createLinearGradient(30, 40, 80, 40);
  jawGrad.addColorStop(0, "#cbd5e1");
  jawGrad.addColorStop(1, "#94a3b8");

  // Fixed assembly base
  ctx.fillStyle = steelGrad;
  ctx.fillRect(30, 80, 520, 25); // main scale beam (Y: 80 to 105)

  // Fixed Jaw Upper Claw (inside measurement)
  ctx.fillStyle = jawGrad;
  ctx.beginPath();
  ctx.moveTo(80, 80);
  ctx.lineTo(80, 40);
  ctx.lineTo(65, 40); // points left
  ctx.bezierCurveTo(65, 60, 75, 70, 75, 80);
  ctx.closePath();
  ctx.fill();

  // Fixed Jaw Lower Claw (outside measurement)
  ctx.beginPath();
  ctx.moveTo(80, 105);
  ctx.lineTo(80, 170);
  ctx.lineTo(55, 170);
  ctx.bezierCurveTo(55, 140, 75, 125, 75, 105);
  ctx.closePath();
  ctx.fill();
  
  // Left border bumper
  ctx.fillStyle = "#334155";
  ctx.fillRect(25, 75, 8, 35);

  // 3. Draw Main Scale Ticks (starts from boundary Y = 105, goes UP)
  ctx.strokeStyle = "#000";
  ctx.lineWidth = 1;
  for (let i = 0; i <= 120; i++) {
    const x = 80 + (i * 4);
    if (x > 540) break;
    let h = 4;
    if (i % 10 === 0) {
      h = 10;
      ctx.fillStyle = "#000";
      ctx.font = "bold 8px Outfit";
      ctx.fillText((i / 10).toString(), x - 2, 90); // Label above ticks
    } else if (i % 5 === 0) {
      h = 7;
    }
    ctx.beginPath();
    ctx.moveTo(x, 105);
    ctx.lineTo(x, 105 - h);
    ctx.stroke();
  }

  // 4. Draw Sliding Vernier Assembly
  const vernierSteelGrad = ctx.createLinearGradient(slideX, 105, slideX, 135);
  vernierSteelGrad.addColorStop(0, "#f1f5f9");
  vernierSteelGrad.addColorStop(0.5, "#cbd5e1");
  vernierSteelGrad.addColorStop(1, "#64748b");
  
  // Vernier main sliding block (Y: 105 to 135)
  ctx.fillStyle = vernierSteelGrad;
  ctx.fillRect(slideX, 105, 140, 30);
  
  // Sliding upper block connection
  ctx.fillRect(slideX, 70, 45, 10);
  
  // Sliding Upper Claw (inside measurement)
  ctx.fillStyle = jawGrad;
  ctx.beginPath();
  ctx.moveTo(slideX, 80);
  ctx.lineTo(slideX, 40);
  ctx.lineTo(slideX + 15, 40); // points right
  ctx.bezierCurveTo(slideX + 15, 60, slideX + 5, 70, slideX + 5, 80);
  ctx.closePath();
  ctx.fill();

  // Sliding Lower Claw (outside measurement)
  ctx.beginPath();
  ctx.moveTo(slideX, 105);
  ctx.lineTo(slideX, 170);
  ctx.lineTo(slideX + 25, 170);
  ctx.bezierCurveTo(slideX + 25, 140, slideX + 5, 125, slideX + 5, 105);
  ctx.closePath();
  ctx.fill();

  // Draw Vernier Ticks (starts from boundary Y = 105, goes DOWN)
  // 10 divisions spanning 9 mm of main scale (= 36 pixels)
  // so each vernier division is 3.6 pixels
  ctx.strokeStyle = "#000";
  ctx.lineWidth = 1;
  for (let j = 0; j <= 10; j++) {
    const vx = slideX + (j * 3.6);
    let vh = 4;
    if (j === 0 || j === 10 || j === 5) {
      vh = 9;
      ctx.fillStyle = "#000";
      ctx.font = "bold 8px Outfit";
      ctx.fillText(j.toString(), vx - 2, 124); // label below ticks
    }
    ctx.beginPath();
    ctx.moveTo(vx, 105);
    ctx.lineTo(vx, 105 + vh);
    ctx.stroke();
  }
}

function drawMicroCanvas(canvas, sliderVal) {
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Background
  ctx.fillStyle = "#1e293b";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const targetVal = parseFloat(currentMissionData.microTarget);
  const shift = (sliderVal - 50) * 0.05 + targetVal;

  const objIdx = currentMissionData.objIdxs[2];

  // 1. Draw C-frame
  const frameGrad = ctx.createLinearGradient(40, 40, 180, 180);
  frameGrad.addColorStop(0, "#1e3a8a"); // Navy blue enamel
  frameGrad.addColorStop(0.5, "#2563eb");
  frameGrad.addColorStop(1, "#172554");
  
  ctx.fillStyle = frameGrad;
  ctx.beginPath();
  ctx.arc(120, 110, 65, Math.PI * 0.45, Math.PI * 1.55);
  ctx.lineTo(190, 45);
  ctx.lineTo(190, 75);
  ctx.arc(120, 110, 40, Math.PI * 1.5, Math.PI * 0.5, true);
  ctx.lineTo(190, 175);
  ctx.closePath();
  ctx.fill();
  
  // Metallic finish caps on C-frame
  ctx.fillStyle = "#94a3b8";
  ctx.fillRect(70, 95, 15, 30); // left cap (anvil socket)
  ctx.fillRect(170, 95, 20, 30); // right cap (spindle socket)
  
  // Specification label on frame
  ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
  ctx.font = "bold 9px Outfit";
  ctx.fillText("0 - 25 mm", 100, 112);
  ctx.fillText("0.01 mm", 102, 124);

  // 2. Anvil & Spindle
  // Anvil (left fixed contact)
  ctx.fillStyle = "#cbd5e1";
  ctx.fillRect(85, 102, 15, 16);
  
  // Spindle (sliding contact)
  const spindleX = 100 + (shift * 12); // tip
  ctx.fillStyle = "#cbd5e1";
  ctx.fillRect(spindleX, 102, 120 - (shift * 12), 16); // spindle rod

  // 3. Draw Object
  ctx.save();
  const objW = shift * 12;
  if (objIdx === 0) {
    // HVS Paper (extremely thin)
    ctx.fillStyle = "#f8fafc";
    ctx.fillRect(100, 80, Math.max(2.5, objW), 60);
    ctx.strokeStyle = "#cbd5e1";
    ctx.lineWidth = 1;
    ctx.strokeRect(100, 80, Math.max(2.5, objW), 60);
    // fold shadow
    ctx.fillStyle = "rgba(0,0,0,0.05)";
    ctx.fillRect(100 + Math.max(2.5, objW) - 1, 80, 1, 60);
  } else if (objIdx === 1) {
    // Copper wire
    const copperGrad = ctx.createLinearGradient(100, 98, 100, 122);
    copperGrad.addColorStop(0, "#ea580c");
    copperGrad.addColorStop(0.5, "#f59e0b");
    copperGrad.addColorStop(1, "#9a3412");
    ctx.fillStyle = copperGrad;
    ctx.fillRect(100, 98, objW, 24);
    ctx.strokeStyle = "#7c2d12";
    ctx.lineWidth = 1;
    ctx.strokeRect(100, 98, objW, 24);
  } else {
    // Silet blade (height 50)
    ctx.fillStyle = "#94a3b8";
    ctx.fillRect(100, 85, objW, 50);
    ctx.strokeStyle = "#334155";
    ctx.lineWidth = 1.2;
    ctx.strokeRect(100, 85, objW, 50);
    // Cut-out center slot
    ctx.fillStyle = "#1e293b";
    ctx.fillRect(100 + objW * 0.25, 105, objW * 0.5, 10);
  }
  ctx.restore();

  // 4. Sleeve (Main scale barrel)
  const sleeveX = 220;
  const sleeveGrad = ctx.createLinearGradient(sleeveX, 95, sleeveX, 125);
  sleeveGrad.addColorStop(0, "#f1f5f9");
  sleeveGrad.addColorStop(0.3, "#cbd5e1");
  sleeveGrad.addColorStop(0.7, "#94a3b8");
  sleeveGrad.addColorStop(1, "#475569");
  
  ctx.fillStyle = sleeveGrad;
  ctx.fillRect(sleeveX, 95, 110, 30); // sleeve cylinder Y: 95 to 125

  // Sleeve horizontal datum line
  ctx.strokeStyle = "#000";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(sleeveX, 110);
  ctx.lineTo(sleeveX + 105, 110);
  ctx.stroke();

  // Sleeve ticks (1 mm = 12 pixels)
  // Ticks above: whole mm
  // Ticks below: half mm (offset by 6 pixels)
  for (let i = 0; i <= 15; i++) {
    const tx = sleeveX + i * 12;
    if (tx > sleeveX + 100) break;
    
    // Upper ticks (whole mm)
    ctx.beginPath();
    ctx.moveTo(tx, 110);
    ctx.lineTo(tx, 102);
    ctx.stroke();
    if (i % 5 === 0) {
      ctx.fillStyle = "#000";
      ctx.font = "bold 8px Outfit";
      ctx.fillText(i.toString(), tx - 3, 98);
    }
    
    // Lower ticks (half mm)
    if (i < 15) {
      ctx.beginPath();
      ctx.moveTo(tx + 6, 110);
      ctx.lineTo(tx + 6, 117);
      ctx.stroke();
    }
  }

  // 5. Thimble (Rotating barrel)
  const thimbleX = sleeveX + (shift * 12);
  const thimbleGrad = ctx.createLinearGradient(thimbleX, 85, thimbleX, 135);
  thimbleGrad.addColorStop(0, "#cbd5e1");
  thimbleGrad.addColorStop(0.3, "#f8fafc");
  thimbleGrad.addColorStop(0.7, "#94a3b8");
  thimbleGrad.addColorStop(1, "#475569");
  
  // Bevel (tapered) left edge
  ctx.fillStyle = thimbleGrad;
  ctx.beginPath();
  ctx.moveTo(thimbleX + 8, 85);
  ctx.lineTo(thimbleX, 90);
  ctx.lineTo(thimbleX, 130);
  ctx.lineTo(thimbleX + 8, 135);
  ctx.closePath();
  ctx.fill();
  
  // Main thimble cylinder
  ctx.fillRect(thimbleX + 8, 85, 60, 50); // Y: 85 to 135
  
  // Ticks on the bevel edge (0 to 50 divisions)
  const alignedDiv = Math.round((shift % 0.5) * 100);
  
  ctx.strokeStyle = "#000";
  ctx.lineWidth = 1;
  
  // Draw ticks around Y = 110 (datum line)
  for (let d = -9; d <= 9; d++) {
    const div = (alignedDiv + d + 50) % 50;
    const ty = 110 - d * 2.8; // 2.8 pixels per division
    if (ty < 87 || ty > 133) continue;
    
    // Draw tick line on the bevel
    ctx.beginPath();
    ctx.moveTo(thimbleX, ty);
    ctx.lineTo(thimbleX + 6, ty);
    ctx.stroke();
    
    // Draw division numbers every 5th division
    if (div % 5 === 0) {
      ctx.fillStyle = "#000";
      ctx.font = "bold 8px Outfit";
      ctx.fillText(div.toString(), thimbleX + 8, ty + 3);
    }
  }
  
  // Thimble knurling / grip ridges
  ctx.fillStyle = "rgba(0, 0, 0, 0.15)";
  ctx.fillRect(thimbleX + 50, 85, 18, 50);
  ctx.strokeStyle = "rgba(0, 0, 0, 0.4)";
  ctx.lineWidth = 0.8;
  for (let gx = thimbleX + 52; gx < thimbleX + 68; gx += 3) {
    ctx.beginPath();
    ctx.moveTo(gx, 85);
    ctx.lineTo(gx, 135);
    ctx.stroke();
  }
}

function drawNeracaCanvas(canvas, sliderVal) {
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Background
  ctx.fillStyle = "#1e293b";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  const target = parseFloat(currentMissionData.neracaTarget);
  const objIdx = currentMissionData.objIdxs[3];
  
  // Draw base & pillar
  ctx.fillStyle = "#475569";
  ctx.fillRect(40, 180, 520, 20); // base
  ctx.fillRect(80, 70, 30, 110); // pillar
  
  // Draw hanger and pan
  ctx.strokeStyle = "#cbd5e1";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(95, 75);
  ctx.lineTo(95, 140);
  ctx.stroke();
  
  // Pan
  ctx.fillStyle = "#94a3b8";
  ctx.fillRect(60, 140, 70, 8);
  
  // Object on the pan
  ctx.save();
  if (objIdx === 0) {
    // Apple
    ctx.fillStyle = "#ef4444"; // Red apple
    ctx.beginPath();
    ctx.arc(83, 125, 13, 0, Math.PI * 2);
    ctx.arc(103, 125, 13, 0, Math.PI * 2);
    ctx.fill();
    // Stem
    ctx.strokeStyle = "#78350f";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(93, 114);
    ctx.bezierCurveTo(93, 104, 101, 104, 101, 108);
    ctx.stroke();
    // Leaf
    ctx.fillStyle = "#22c55e";
    ctx.beginPath();
    ctx.ellipse(100, 108, 4, 2, Math.PI / 4, 0, Math.PI * 2);
    ctx.fill();
  } else if (objIdx === 1) {
    // Stone
    ctx.fillStyle = "#78716c"; // Stone grey
    ctx.beginPath();
    ctx.moveTo(70, 135);
    ctx.lineTo(82, 115);
    ctx.lineTo(100, 112);
    ctx.lineTo(118, 122);
    ctx.lineTo(112, 138);
    ctx.lineTo(80, 139);
    ctx.closePath();
    ctx.fill();
    // Texture
    ctx.strokeStyle = "#44403c";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(85, 122);
    ctx.lineTo(95, 130);
    ctx.stroke();
  } else {
    // Book
    ctx.fillStyle = "#a21caf"; // Magenta notepad
    ctx.fillRect(75, 110, 36, 30);
    // Pages
    ctx.fillStyle = "#f8fafc";
    ctx.fillRect(111, 112, 4, 26);
    // Spine
    ctx.fillStyle = "#701a75";
    ctx.fillRect(72, 110, 3, 30);
  }
  ctx.restore();
  
  // Beams (three parallel horizontal bars)
  const startX = 120;
  const endX = 480;
  const beamW = endX - startX;
  
  // Draw metallic beam support frame
  ctx.fillStyle = "#334155";
  ctx.fillRect(110, 65, 390, 100);
  ctx.fillStyle = "#1e293b";
  ctx.fillRect(115, 70, 380, 90);
  
  // Split target mass into riders
  const targetHundreds = Math.floor(target / 100) * 100;
  const targetTens = Math.floor((target % 100) / 10) * 10;
  const targetOnesDecimals = target % 10; // ones and decimals (0.0 to 9.9)
  
  // Beam Y positions
  const y1 = 85;  // Hundreds (0 - 500)
  const y2 = 115; // Tens (0 - 100)
  const y3 = 145; // Ones & Decimals (0 - 10)
  
  // Drawing Beam 1 (Hundreds)
  ctx.strokeStyle = "#475569";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(startX, y1);
  ctx.lineTo(endX, y1);
  ctx.stroke();
  
  // Ticks for Hundreds
  ctx.lineWidth = 1;
  ctx.strokeStyle = "#94a3b8";
  for (let i = 0; i <= 5; i++) {
    const tx = startX + i * (beamW / 5);
    ctx.beginPath();
    ctx.moveTo(tx, y1 - 4);
    ctx.lineTo(tx, y1 + 4);
    ctx.stroke();
    
    ctx.fillStyle = "#cbd5e1";
    ctx.font = "8px sans-serif";
    ctx.fillText((i * 100).toString() + "g", tx - 8, y1 - 6);
  }
  // Rider 1
  const rx1 = startX + (targetHundreds / 500) * beamW;
  ctx.fillStyle = "#fd7e14";
  ctx.beginPath();
  ctx.moveTo(rx1 - 6, y1 - 6);
  ctx.lineTo(rx1 + 6, y1 - 6);
  ctx.lineTo(rx1 + 3, y1 + 6);
  ctx.lineTo(rx1 - 3, y1 + 6);
  ctx.closePath();
  ctx.fill();
  
  // Drawing Beam 2 (Tens)
  ctx.strokeStyle = "#475569";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(startX, y2);
  ctx.lineTo(endX, y2);
  ctx.stroke();
  
  // Ticks for Tens
  ctx.lineWidth = 1;
  ctx.strokeStyle = "#94a3b8";
  for (let i = 0; i <= 10; i++) {
    const tx = startX + i * (beamW / 10);
    ctx.beginPath();
    ctx.moveTo(tx, y2 - 4);
    ctx.lineTo(tx, y2 + 4);
    ctx.stroke();
    
    ctx.fillStyle = "#cbd5e1";
    ctx.font = "8px sans-serif";
    ctx.fillText((i * 10).toString(), tx - 5, y2 - 6);
  }
  // Rider 2
  const rx2 = startX + (targetTens / 100) * beamW;
  ctx.fillStyle = "#38bdf8";
  ctx.beginPath();
  ctx.moveTo(rx2 - 6, y2 - 6);
  ctx.lineTo(rx2 + 6, y2 - 6);
  ctx.lineTo(rx2 + 3, y2 + 6);
  ctx.lineTo(rx2 - 3, y2 + 6);
  ctx.closePath();
  ctx.fill();
  
  // Drawing Beam 3 (Ones & Decimals)
  ctx.strokeStyle = "#475569";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(startX, y3);
  ctx.lineTo(endX, y3);
  ctx.stroke();
  
  // Ticks for Ones & Decimals
  ctx.lineWidth = 1;
  ctx.strokeStyle = "#94a3b8";
  for (let i = 0; i <= 100; i++) {
    const tx = startX + i * (beamW / 100);
    let h = 3;
    if (i % 10 === 0) {
      h = 8;
      ctx.fillStyle = "#cbd5e1";
      ctx.font = "8px sans-serif";
      ctx.fillText((i / 10).toString(), tx - 3, y3 - 6);
    } else if (i % 5 === 0) {
      h = 5;
    }
    ctx.beginPath();
    ctx.moveTo(tx, y3);
    ctx.lineTo(tx, y3 + h);
    ctx.stroke();
  }
  // Rider 3
  const rx3 = startX + (targetOnesDecimals / 10) * beamW;
  ctx.fillStyle = "#a855f7";
  ctx.beginPath();
  ctx.moveTo(rx3 - 4, y3 - 6);
  ctx.lineTo(rx3 + 4, y3 - 6);
  ctx.lineTo(rx3 + 2, y3 + 6);
  ctx.lineTo(rx3 - 2, y3 + 6);
  ctx.closePath();
  ctx.fill();
  
  // Balance Pointer & Zero Scale (Right End)
  const ptrX = 510;
  const zeroY = 115;
  const needleOffset = (sliderVal - 50) * 0.8;
  const needleY = zeroY + needleOffset;
  
  // Draw Zero Scale Marker
  ctx.strokeStyle = "#ef4444";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(ptrX + 15, zeroY);
  ctx.lineTo(ptrX + 25, zeroY);
  ctx.stroke();
  
  ctx.fillStyle = "#ef4444";
  ctx.font = "9px sans-serif";
  ctx.fillText("0", ptrX + 28, zeroY + 3);
  
  // Balance scale background frame
  ctx.strokeStyle = "#94a3b8";
  ctx.lineWidth = 1;
  ctx.strokeRect(ptrX + 15, zeroY - 20, 10, 40);
  for (let dy = -15; dy <= 15; dy += 5) {
    if (dy === 0) continue;
    ctx.beginPath();
    ctx.moveTo(ptrX + 15, zeroY + dy);
    ctx.lineTo(ptrX + 20, zeroY + dy);
    ctx.stroke();
  }
  
  // Draw needle pointing from beam to scale
  ctx.strokeStyle = "#cbd5e1";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(490, zeroY);
  ctx.lineTo(ptrX + 15, needleY);
  ctx.stroke();
  
  // Title / Status Text
  ctx.fillStyle = "#fff";
  ctx.font = "bold 12px Outfit";
  ctx.fillText("NERACA OHAUS 3 LENGAN", 120, 40);
  
  if (Math.abs(sliderVal - 50) < 1) {
    ctx.fillStyle = "#10b981";
    ctx.fillText("SEIMBANG (READY TO READ)", 340, 40);
  } else {
    ctx.fillStyle = "#f59e0b";
    ctx.fillText("BELUM SEIMBANG (DRAG GAMBAR UNTUK SEIMBANGKAN)", 210, 40);
  }
}

function drawStopwatchCanvas(canvas, sliderVal) {
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Background
  ctx.fillStyle = "#1e293b";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  const target = parseFloat(currentMissionData.stopwatchTarget);
  const timeVal = target * (sliderVal / 50); // scales time based on sliderVal
  const objIdx = currentMissionData.objIdxs[4];
  
  // Draw Animation Panel on the Left
  ctx.fillStyle = "#0f172a";
  ctx.fillRect(20, 50, 160, 140);
  
  // Draw lanes
  ctx.strokeStyle = "#334155";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(20, 120); ctx.lineTo(180, 120);
  ctx.moveTo(20, 150); ctx.lineTo(180, 150);
  ctx.stroke();
  
  // Finish line
  ctx.strokeStyle = "#ef4444";
  ctx.lineWidth = 3;
  ctx.setLineDash([4, 4]);
  ctx.beginPath();
  if (objIdx === 0) { // Toy Car
    ctx.moveTo(140, 60);
    ctx.lineTo(140, 180);
  } else if (objIdx === 1) { // Marble fall
    ctx.moveTo(130, 60);
    ctx.lineTo(130, 180);
  } else { // Pendulum
    ctx.moveTo(90, 60);
    ctx.lineTo(90, 180);
  }
  ctx.stroke();
  ctx.setLineDash([]);
  
  ctx.fillStyle = "#ef4444";
  ctx.font = "bold 9px sans-serif";
  ctx.fillText("TARGET", objIdx === 2 ? 80 : 120, 55);
  
  // Draw object based on index
  ctx.save();
  if (objIdx === 0) {
    // Toy Car
    const carX = 40 + (sliderVal / 50) * 100;
    const carY = 120;
    
    // Body
    ctx.fillStyle = "#3b82f6";
    ctx.fillRect(carX - 25, carY - 12, 45, 15);
    ctx.fillStyle = "#60a5fa"; // Cabin
    ctx.fillRect(carX - 15, carY - 22, 25, 10);
    
    // Wheels
    ctx.fillStyle = "#000";
    ctx.beginPath();
    ctx.arc(carX - 15, carY + 3, 6, 0, Math.PI * 2);
    ctx.arc(carX + 10, carY + 3, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#cbd5e1";
    ctx.beginPath();
    ctx.arc(carX - 15, carY + 3, 2.5, 0, Math.PI * 2);
    ctx.arc(carX + 10, carY + 3, 2.5, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = "#fff";
    ctx.font = "9px sans-serif";
    ctx.fillText("Mobil", carX - 12, carY - 1);
  } else if (objIdx === 1) {
    // Marble fall
    // Draw ramp
    ctx.strokeStyle = "#475569";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(30, 80);
    ctx.lineTo(130, 150);
    ctx.stroke();
    
    const factor = Math.min(1, sliderVal / 50);
    const mx = 30 + factor * 100;
    const my = 80 + factor * 70;
    
    // Marble sphere
    const marbleGrad = ctx.createRadialGradient(mx - 3, my - 3, 1, mx, my, 8);
    marbleGrad.addColorStop(0, "#bae6fd");
    marbleGrad.addColorStop(1, "#10b981");
    ctx.fillStyle = marbleGrad;
    ctx.beginPath();
    ctx.arc(mx, my - 8, 8, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = "#fff";
    ctx.font = "9px sans-serif";
    ctx.fillText("Kelereng", mx - 20, my - 20);
  } else {
    // Pendulum swing
    const factor = (sliderVal / 50) - 1; // from -1 to +1
    const maxAngle = Math.PI / 6; // 30 degrees
    const currentAngle = factor * maxAngle;
    
    const pivotX = 90;
    const pivotY = 60;
    const stringLen = 70;
    
    const bobX = pivotX + stringLen * Math.sin(currentAngle);
    const bobY = pivotY + stringLen * Math.cos(currentAngle);
    
    // Draw stand
    ctx.strokeStyle = "#475569";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(pivotX - 20, pivotY);
    ctx.lineTo(pivotX + 20, pivotY);
    ctx.moveTo(pivotX, pivotY);
    ctx.lineTo(pivotX, pivotY - 10);
    ctx.stroke();
    
    // Draw string
    ctx.strokeStyle = "#cbd5e1";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(pivotX, pivotY);
    ctx.lineTo(bobX, bobY);
    ctx.stroke();
    
    // Draw bob
    const bobGrad = ctx.createRadialGradient(bobX - 4, bobY - 4, 1, bobX, bobY, 10);
    bobGrad.addColorStop(0, "#fde047");
    bobGrad.addColorStop(1, "#ca8a04");
    ctx.fillStyle = bobGrad;
    ctx.beginPath();
    ctx.arc(bobX, bobY, 10, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = "#fff";
    ctx.font = "9px sans-serif";
    ctx.fillText("Bandul", bobX - 16, bobY - 14);
  }
  ctx.restore();
  
  // Draw Stopwatch on the Right
  const cx = 380;
  const cy = 120;
  const r = 85;
  
  // Metallic Outer Case
  const caseGrad = ctx.createRadialGradient(cx, cy, r - 5, cx, cy, r + 10);
  caseGrad.addColorStop(0, "#cbd5e1");
  caseGrad.addColorStop(0.8, "#64748b");
  caseGrad.addColorStop(1, "#334155");
  ctx.fillStyle = caseGrad;
  ctx.beginPath();
  ctx.arc(cx, cy, r + 8, 0, Math.PI * 2);
  ctx.fill();
  
  // Crown button (top)
  ctx.fillStyle = "#94a3b8";
  ctx.fillRect(cx - 10, cy - r - 15, 20, 10);
  
  // Dial face (white/light silver)
  ctx.fillStyle = "#f8fafc";
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fill();
  
  // Dial Border
  ctx.strokeStyle = "#0f172a";
  ctx.lineWidth = 2;
  ctx.stroke();
  
  // Draw Second Ticks (0 to 60)
  for (let i = 0; i < 60; i++) {
    const angle = -Math.PI / 2 + (i / 60) * 2 * Math.PI;
    const isMajor = i % 5 === 0;
    const isMedium = i % 1 === 0 && !isMajor;
    const tickLen = isMajor ? 10 : (isMedium ? 6 : 4);
    
    ctx.strokeStyle = isMajor ? "#000" : "#475569";
    ctx.lineWidth = isMajor ? 1.5 : 0.8;
    
    const sx = cx + (r - tickLen) * Math.cos(angle);
    const sy = cy + (r - tickLen) * Math.sin(angle);
    const ex = cx + r * Math.cos(angle);
    const ey = cy + r * Math.sin(angle);
    
    ctx.beginPath();
    ctx.moveTo(sx, sy);
    ctx.lineTo(ex, ey);
    ctx.stroke();
    
    // Draw numbers for major ticks
    if (isMajor) {
      const numStr = i === 0 ? "60" : i.toString();
      ctx.fillStyle = "#000";
      ctx.font = "bold 9px sans-serif";
      const nx = cx + (r - 18) * Math.cos(angle);
      const ny = cy + (r - 18) * Math.sin(angle);
      ctx.fillText(numStr, nx - 5, ny + 3);
    }
  }
  
  // Draw sub-ticks (0.2s division)
  for (let i = 0; i < 300; i++) {
    if (i % 5 === 0) continue; // Skip already drawn ticks
    const angle = -Math.PI / 2 + (i / 300) * 2 * Math.PI;
    const sx = cx + (r - 4) * Math.cos(angle);
    const sy = cy + (r - 4) * Math.sin(angle);
    const ex = cx + r * Math.cos(angle);
    const ey = cy + r * Math.sin(angle);
    ctx.strokeStyle = "#94a3b8";
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    ctx.moveTo(sx, sy);
    ctx.lineTo(ex, ey);
    ctx.stroke();
  }
  
  // Small Minute Dial (0 to 30 mins)
  const mcx = cx;
  const mcy = cy - 35;
  const mr = 20;
  ctx.fillStyle = "#f1f5f9";
  ctx.beginPath();
  ctx.arc(mcx, mcy, mr, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#475569";
  ctx.lineWidth = 1;
  ctx.stroke();
  // Minor minute ticks
  for (let m = 0; m < 30; m += 5) {
    const mAngle = -Math.PI / 2 + (m / 30) * 2 * Math.PI;
    const sx = mcx + (mr - 4) * Math.cos(mAngle);
    const sy = mcy + (mr - 4) * Math.sin(mAngle);
    const ex = mcx + mr * Math.cos(mAngle);
    const ey = mcy + mr * Math.sin(mAngle);
    ctx.beginPath();
    ctx.moveTo(sx, sy);
    ctx.lineTo(ex, ey);
    ctx.stroke();
    // Label
    ctx.fillStyle = "#475569";
    ctx.font = "6px sans-serif";
    const nx = mcx + (mr - 10) * Math.cos(mAngle);
    const ny = mcy + (mr - 10) * Math.sin(mAngle);
    ctx.fillText(m.toString(), nx - 3, ny + 2);
  }
  // Minute Hand (pointing to 0)
  ctx.strokeStyle = "#000";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(mcx, mcy);
  ctx.lineTo(mcx, mcy - 12);
  ctx.stroke();
  
  // Draw Main Second Hand (Red)
  const secondHandAngle = -Math.PI / 2 + (timeVal / 60) * 2 * Math.PI;
  ctx.strokeStyle = "#ef4444";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.lineTo(cx + (r - 12) * Math.cos(secondHandAngle), cy + (r - 12) * Math.sin(secondHandAngle));
  ctx.stroke();
  
  // Center pin
  ctx.fillStyle = "#ef4444";
  ctx.beginPath();
  ctx.arc(cx, cy, 4, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#000";
  ctx.beginPath();
  ctx.arc(cx, cy, 1.5, 0, Math.PI * 2);
  ctx.fill();
  
  // Info text
  ctx.fillStyle = "#fff";
  ctx.font = "bold 12px Outfit";
  ctx.fillText("STOPWATCH ANALOG (1 SKALA = 0.2 S)", 210, 30);
  
  if (Math.abs(sliderVal - 50) < 1) {
    ctx.fillStyle = "#10b981";
    ctx.fillText("PELARI TEPAT DI GARIS FINISH (READY)", 280, 225);
  } else {
    ctx.fillStyle = "#f59e0b";
    ctx.fillText("GESER GAMBAR AGAR PELARI PAS DI GARIS FINISH", 240, 225);
  }
}

function drawMultimeterCanvas(canvas, sliderVal) {
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Background
  ctx.fillStyle = "#1e293b";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  const target = parseFloat(currentMissionData.multimeterTarget);
  const objIdx = currentMissionData.objIdxs[5];
  
  // Determine range based on object
  const isAki = objIdx === 1;
  const rangeLabel = isAki ? "DCV 50V" : "DCV 10V";
  const maxScaleVal = isAki ? 50 : 10;
  
  // Determine connection status
  // Probe touches terminal when sliderVal = 50
  const isConnected = Math.abs(sliderVal - 50) <= 2;
  const voltVal = isConnected ? target : 0;
  
  // Draw Battery Circuit on the Left
  ctx.fillStyle = "#0f172a";
  ctx.fillRect(20, 40, 160, 160);
  
  // Draw Battery/Solar cells
  ctx.save();
  if (objIdx === 0) {
    // AA Battery
    ctx.fillStyle = "#1e3a8a"; // Blue AA
    ctx.fillRect(40, 80, 65, 55);
    ctx.fillStyle = "#d97706"; // Gold
    ctx.fillRect(105, 80, 15, 55);
    
    // Positive cap
    ctx.fillStyle = "#cbd5e1";
    ctx.fillRect(50, 72, 10, 8); // top left (+) terminal
    ctx.fillRect(110, 72, 10, 8); // top right (-) terminal
    
    ctx.fillStyle = "#fff";
    ctx.font = "bold 9px sans-serif";
    ctx.fillText("1.5V AA", 55, 113);
  } else if (objIdx === 1) {
    // Aki Motor
    ctx.fillStyle = "#111827"; // Dark casing
    ctx.fillRect(40, 80, 80, 60);
    
    ctx.fillStyle = "#ef4444"; // positive post
    ctx.fillRect(50, 72, 12, 8);
    ctx.fillStyle = "#374151"; // negative post
    ctx.fillRect(98, 72, 12, 8);
    
    ctx.fillStyle = "#fff";
    ctx.font = "bold 8px sans-serif";
    ctx.fillText("GS YUASA", 44, 105);
    ctx.fillStyle = "#ef4444";
    ctx.fillText("12V AKI", 44, 120);
  } else {
    // Solar Panel
    ctx.fillStyle = "#065f46"; // Green border
    ctx.fillRect(40, 80, 80, 60);
    ctx.fillStyle = "#1e3a8a"; // blue silicon
    ctx.fillRect(45, 85, 70, 50);
    
    // Grid
    ctx.strokeStyle = "#38bdf8";
    ctx.lineWidth = 1;
    ctx.strokeRect(45, 85, 70, 50);
    ctx.beginPath();
    ctx.moveTo(68, 85); ctx.lineTo(68, 135);
    ctx.moveTo(92, 85); ctx.lineTo(92, 135);
    ctx.moveTo(45, 102); ctx.lineTo(115, 102);
    ctx.moveTo(45, 118); ctx.lineTo(115, 118);
    ctx.stroke();
    
    // terminals
    ctx.fillStyle = "#ef4444";
    ctx.fillRect(50, 72, 10, 8);
    ctx.fillStyle = "#374151";
    ctx.fillRect(100, 72, 10, 8);
  }
  ctx.restore();
  
  // Draw black probe wire (always connected to Negative terminal)
  ctx.strokeStyle = "#000";
  ctx.lineWidth = 3;
  ctx.beginPath();
  const negCapX = objIdx === 0 ? 115 : 104;
  ctx.moveTo(negCapX, 75); // neg cap
  ctx.bezierCurveTo(negCapX, 40, 240, 40, 240, 195); // COM port
  ctx.stroke();
  
  // Draw red probe wire (adjustable)
  // Probe touches Positive terminal (X=55) when sliderVal = 50
  const probeX = 55 + (sliderVal - 50) * 1.8;
  const probeY = 72 - Math.abs(sliderVal - 50) * 0.5; // lifts slightly when off-center
  
  ctx.strokeStyle = "#ef4444";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(probeX, probeY);
  ctx.bezierCurveTo(probeX, probeY - 20, 280, 40, 280, 195); // V port
  ctx.stroke();
  
  // Red probe pen body
  ctx.fillStyle = "#ef4444";
  ctx.fillRect(probeX - 3, probeY - 20, 6, 20);
  ctx.fillStyle = "#cbd5e1";
  ctx.fillRect(probeX - 1, probeY - 25, 2, 5); // metal tip
  
  // Draw Voltmeter/Multimeter Case on the Right
  const mx = 210;
  const my = 40;
  const mw = 360;
  const mh = 175;
  
  // Body panel
  ctx.fillStyle = "#0284c7"; // Blue digital multimeter style
  ctx.beginPath();
  ctx.roundRect(mx, my, mw, mh, 10);
  ctx.fill();
  ctx.strokeStyle = "#0c4a6e";
  ctx.lineWidth = 4;
  ctx.stroke();
  
  // Display Screen Background (Arched area)
  ctx.fillStyle = "#f8fafc";
  ctx.beginPath();
  ctx.roundRect(mx + 15, my + 10, mw - 30, 95, 4);
  ctx.fill();
  ctx.strokeStyle = "#000";
  ctx.lineWidth = 1.5;
  ctx.stroke();
  
  // Scale Arc center and radius
  const scx = mx + mw / 2;
  const scy = my + 95;
  const sr = 75;
  
  // Draw scale arcs (curved lines)
  ctx.strokeStyle = "#000";
  ctx.lineWidth = 1;
  
  // Scale 1: 0 - 10 V
  ctx.beginPath();
  ctx.arc(scx, scy, sr, Math.PI + 0.4, Math.PI * 2 - 0.4);
  ctx.stroke();
  
  // Scale 2: 0 - 50 V
  ctx.beginPath();
  ctx.arc(scx, scy, sr - 10, Math.PI + 0.4, Math.PI * 2 - 0.4);
  ctx.stroke();
  
  // Ticks on Scale 1 (0-10 V)
  const startAng = Math.PI + 0.4;
  const endAng = Math.PI * 2 - 0.4;
  const totalAng = endAng - startAng;
  
  for (let i = 0; i <= 50; i++) {
    const val = (i / 50) * 10; // 0 to 10 V
    const ang = startAng + (val / 10) * totalAng;
    const isMajor = i % 10 === 0;
    const isMedium = i % 5 === 0 && !isMajor;
    const tickLen = isMajor ? 8 : (isMedium ? 5 : 3);
    
    ctx.strokeStyle = isMajor ? "#ef4444" : "#000"; // Red highlight for major lines
    ctx.lineWidth = isMajor ? 1.2 : 0.6;
    
    const sx = scx + (sr - tickLen) * Math.cos(ang);
    const sy = scy + (sr - tickLen) * Math.sin(ang);
    const ex = scx + sr * Math.cos(ang);
    const ey = scy + sr * Math.sin(ang);
    
    ctx.beginPath();
    ctx.moveTo(sx, sy);
    ctx.lineTo(ex, ey);
    ctx.stroke();
    
    if (isMajor) {
      ctx.fillStyle = "#000";
      ctx.font = "8px sans-serif";
      // Position label slightly below the arc
      const lx = scx + (sr - 14) * Math.cos(ang);
      const ly = scy + (sr - 14) * Math.sin(ang);
      ctx.fillText(val.toString(), lx - 3, ly + 2);
    }
  }
  
  // Ticks on Scale 2 (0 - 50 V)
  for (let i = 0; i <= 50; i += 5) {
    const ang = startAng + (i / 50) * totalAng;
    const isMajor = i % 10 === 0;
    const tickLen = isMajor ? 8 : 4;
    const sx = scx + (sr - 10 - tickLen) * Math.cos(ang);
    const sy = scy + (sr - 10 - tickLen) * Math.sin(ang);
    const ex = scx + (sr - 10) * Math.cos(ang);
    const ey = scy + (sr - 10) * Math.sin(ang);
    
    ctx.strokeStyle = "#475569";
    ctx.lineWidth = isMajor ? 1 : 0.6;
    ctx.beginPath();
    ctx.moveTo(sx, sy);
    ctx.lineTo(ex, ey);
    ctx.stroke();
    
    if (isMajor) {
      // Label for 50V scale
      ctx.fillStyle = "#475569";
      ctx.font = "6px sans-serif";
      const lx = scx + (sr - 10 - 15) * Math.cos(ang);
      const ly = scy + (sr - 10 - 15) * Math.sin(ang);
      ctx.fillText(i.toString(), lx - 4, ly + 2);
    }
  }
  
  // Draw needle
  const needleAng = startAng + (voltVal / maxScaleVal) * totalAng;
  ctx.strokeStyle = "#ef4444";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(scx, scy - 10);
  ctx.lineTo(scx + (sr + 4) * Math.cos(needleAng), scy + (sr + 4) * Math.sin(needleAng));
  ctx.stroke();
  
  // Dial center pivot dot
  ctx.fillStyle = "#000";
  ctx.beginPath();
  ctx.arc(scx, scy - 10, 4, 0, Math.PI * 2);
  ctx.fill();
  
  // Selector Switch Knob (lower center)
  const kcx = scx;
  const kcy = my + 140;
  const kr = 15;
  
  // Knob background
  ctx.fillStyle = "#1e293b";
  ctx.beginPath();
  ctx.arc(kcx, kcy, kr, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#cbd5e1";
  ctx.lineWidth = 2;
  ctx.stroke();
  
  // Selector pointing line
  const selAng = isAki ? (Math.PI + 0.9) : (Math.PI + 0.3); // points to 50V or 10V DCV range
  ctx.strokeStyle = "#ef4444";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(kcx, kcy);
  ctx.lineTo(kcx + (kr - 2) * Math.cos(selAng), kcy + (kr - 2) * Math.sin(selAng));
  ctx.stroke();
  
  // Range labels around knob
  ctx.fillStyle = "#fff";
  ctx.font = "7px sans-serif";
  ctx.fillText("DCV 10V", kcx - 40, kcy - 12);
  ctx.fillText("DCV 50V", kcx + 18, kcy - 12);
  ctx.fillText("OFF", kcx - 8, kcy + 22);
  
  // Red border indicator around active range label
  ctx.strokeStyle = "#ef4444";
  ctx.lineWidth = 1;
  if (isAki) {
    ctx.strokeRect(kcx + 15, kcy - 20, 36, 11);
  } else {
    ctx.strokeRect(kcx - 43, kcy - 20, 36, 11);
  }
  
  // Connection ports (terminals)
  const p1x = mx + 40;
  const p2x = mx + mw - 40;
  const py = my + 155;
  ctx.fillStyle = "#0f172a";
  ctx.beginPath();
  ctx.arc(p1x, py, 8, 0, Math.PI * 2);
  ctx.arc(p2x, py, 8, 0, Math.PI * 2);
  ctx.fill();
  
  ctx.fillStyle = "#fff";
  ctx.font = "7px sans-serif";
  ctx.fillText(`+ (${maxScaleVal}V)`, p1x - 10, py - 11);
  ctx.fillText("- (COM)", p2x - 10, py - 11);
  
  // Title / Status text
  ctx.fillStyle = "#fff";
  ctx.font = "bold 12px Outfit";
  ctx.fillText(`MULTIMETER ANALOG (RANGE: ${rangeLabel})`, 210, 30);
  
  if (isConnected) {
    ctx.fillStyle = "#10b981";
    ctx.fillText("TERHUBUNG (READY TO READ)", 340, 205);
  } else {
    ctx.fillStyle = "#f59e0b";
    ctx.fillText("DRAG GAMBAR HINGGA PROBE MERAH MENENTUH POSITIF BATERAI (+)", 215, 205);
  }
}

// --- MISI 5: DETEKTIF ANGKA PENTING ---
function initMisi5(workspace) {
  currentMissionData.nums = [...MISI5_NUMBERS].sort(() => 0.5 - Math.random()).slice(0, 5);
  currentMissionData.ops = [...MISI5_OPERATIONS].sort(() => 0.5 - Math.random()).slice(0, 5);
  currentQuestionIndex = 0;
  currentMissionData.isOperation = false;
  renderMisi5Challenge(workspace);
}

function renderMisi5Challenge(container) {
  container.innerHTML = "";
  if (currentQuestionIndex >= 5) {
    if (!currentMissionData.isOperation) {
      currentMissionData.isOperation = true;
      currentQuestionIndex = 0;
      renderMisi5Challenge(container);
      return;
    } else {
      completeMission(5, 100);
      return;
    }
  }

  const isOp = currentMissionData.isOperation;
  const header = document.createElement("div");
  header.style.style = "margin-bottom: 20px;";
  header.innerHTML = `
    <div style="display: flex; justify-content: space-between; font-size: 0.85rem; font-weight: bold; color: var(--text-secondary); margin-bottom: 8px;">
      <span>Tantangan ${isOp ? "Operasi AP" : "Aturan AP"} ${currentQuestionIndex + 1} dari 5</span>
      <span>Streak: ${missionStreak} 🔥</span>
    </div>
    <div class="progress-bar-container" style="height: 4px;">
      <div class="progress-bar" style="width: ${(currentQuestionIndex / 5) * 100}%;"></div>
    </div>
  `;
  container.appendChild(header);

  if (!isOp) {
    const data = currentMissionData.nums[currentQuestionIndex];
    container.innerHTML += `
      <h4 style="font-family: 'Outfit'; font-weight: 700; margin-bottom: 16px;">Berapakah jumlah Angka Penting pada bilangan berikut?</h4>
      <div class="glass-panel" style="padding: 24px; text-align: center; font-size: 1.8rem; font-weight: bold; color: var(--brand-blue); margin-bottom: 24px;">
        ${data.num}
      </div>
      <div style="display: flex; gap: 10px; flex-wrap: wrap; justify-content: center; margin-bottom: 24px;" id="ap-buttons-container"></div>
      <div id="ap-feedback" class="glass-panel hidden-section" style="padding: 16px;"></div>
    `;
    const btnHolder = document.getElementById("ap-buttons-container");
    for (let i = 1; i <= 6; i++) {
      const btn = document.createElement("button");
      btn.className = "btn btn-secondary";
      btn.style.width = "60px";
      btn.style.height = "60px";
      btn.style.fontSize = "1.2rem";
      btn.textContent = i;
      btn.addEventListener("click", () => {
        btnHolder.querySelectorAll("button").forEach(b => b.disabled = true);
        const isCorrect = i === data.ap;
        const fb = document.getElementById("ap-feedback");
        fb.classList.remove("hidden-section");
        if (isCorrect) {
          fb.style.backgroundColor = "rgba(16, 185, 129, 0.15)";
          fb.style.color = "var(--success)";
          fb.innerHTML = `<strong>Benar!</strong> ${data.num} memiliki ${data.ap} AP. <br><span style="font-size:0.8rem; color:var(--text-secondary); font-weight:normal;">Alasan: ${data.rule}</span>`;
          currentProgress.xp += 10;
          missionStreak++;
        } else {
          fb.style.backgroundColor = "rgba(239, 68, 68, 0.15)";
          fb.style.color = "var(--danger)";
          fb.innerHTML = `<strong>Salah!</strong> Jawaban yang benar: ${data.ap} AP. <br><span style="font-size:0.8rem; color:var(--text-secondary); font-weight:normal;">Alasan: ${data.rule}</span>`;
          missionStreak = 0;
        }
        const nextBtn = document.createElement("button");
        nextBtn.className = "btn btn-orange";
        nextBtn.style.marginTop = "12px";
        nextBtn.style.width = "100%";
        nextBtn.innerHTML = `Lanjut <i class="fas fa-arrow-right"></i>`;
        nextBtn.addEventListener("click", () => {
          currentQuestionIndex++;
          renderMisi5Challenge(container);
        });
        fb.appendChild(nextBtn);
      });
      btnHolder.appendChild(btn);
    }
  } else {
    const opData = currentMissionData.ops[currentQuestionIndex];
    container.innerHTML += `
      <h4 style="font-family: 'Outfit'; font-weight: 700; margin-bottom: 16px;">Hitung dan bulatkan hasil operasi sesuai aturan angka penting:</h4>
      <div class="glass-panel" style="padding: 24px; text-align: center; font-size: 1.8rem; font-weight: bold; color: var(--brand-orange); margin-bottom: 24px;">
        ${opData.op}
      </div>
      <div style="margin-bottom: 24px;">
        <div style="display: flex; gap: 8px;">
          <input type="text" class="form-control" id="op-ans-input" placeholder="Tuliskan hasil akhir pembulatan...">
          <button class="btn btn-primary" id="btn-op-check">Periksa Hasil</button>
        </div>
      </div>
      <div id="op-feedback" class="glass-panel hidden-section" style="padding: 16px;"></div>
    `;
    document.getElementById("btn-op-check").addEventListener("click", () => {
      const input = document.getElementById("op-ans-input").value.trim();
      const fb = document.getElementById("op-feedback");
      fb.classList.remove("hidden-section");
      document.getElementById("btn-op-check").disabled = true;
      document.getElementById("op-ans-input").disabled = true;
      if (input === opData.ans) {
        fb.style.backgroundColor = "rgba(16, 185, 129, 0.15)";
        fb.style.color = "var(--success)";
        fb.innerHTML = `<strong>Benar!</strong> Hasil pembulatan AP: ${opData.ans}. <br><span style="font-size:0.8rem; color:var(--text-secondary); font-weight:normal;">Alasan: ${opData.explanation}</span>`;
        currentProgress.xp += 15;
        missionStreak++;
      } else {
        fb.style.backgroundColor = "rgba(239, 68, 68, 0.15)";
        fb.style.color = "var(--danger)";
        fb.innerHTML = `<strong>Salah!</strong> Jawaban yang benar: ${opData.ans}. <br><span style="font-size:0.8rem; color:var(--text-secondary); font-weight:normal;">Alasan: ${opData.explanation}</span>`;
        missionStreak = 0;
      }
      const nextBtn = document.createElement("button");
      nextBtn.className = "btn btn-orange";
      nextBtn.style.marginTop = "12px";
      nextBtn.style.width = "100%";
      nextBtn.innerHTML = `Lanjut <i class="fas fa-arrow-right"></i>`;
      nextBtn.addEventListener("click", () => {
        currentQuestionIndex++;
        renderMisi5Challenge(container);
      });
      fb.appendChild(nextBtn);
    });
  }
}

// --- MISI 6: PEMBURU KESALAHAN ---
function initMisi6(workspace) {
  currentMissionData.cases = [...MISI6_CASES].sort(() => 0.5 - Math.random());
  currentQuestionIndex = 0;
  renderMisi6Challenge(workspace);
}

function renderMisi6Challenge(container) {
  container.innerHTML = "";
  if (currentQuestionIndex >= 3) {
    completeMission(6, 150);
    return;
  }

  const c = currentMissionData.cases[currentQuestionIndex];
  container.innerHTML = `
    <div style="display: flex; justify-content: space-between; font-size: 0.85rem; font-weight: bold; color: var(--text-secondary); margin-bottom: 8px;">
      <span>Kasus ${currentQuestionIndex + 1} dari 3</span>
      <span>Streak: ${missionStreak} 🔥</span>
    </div>
    <div class="progress-bar-container" style="height: 4px; margin-bottom: 20px;">
      <div class="progress-bar" style="width: ${(currentQuestionIndex / 3) * 100}%;"></div>
    </div>
    <h4 style="font-family: 'Outfit'; font-weight: 700; margin-bottom: 12px; color: var(--danger);"><i class="fas fa-bug"></i> Audit Laporan Pengukuran</h4>
    <p style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 16px;">Seorang siswa menuliskan data pengukuran di laboratorium sebagai berikut:</p>
    <div class="glass-panel" style="padding: 16px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center;">
      <div>
        <div style="font-size: 0.75rem; text-transform: uppercase; font-weight: bold; color: var(--text-secondary);">Alat Ukur</div>
        <div style="font-weight: bold; font-size: 1rem; color: var(--brand-blue);">${c.tool}</div>
      </div>
      <div>
        <div style="font-size: 0.75rem; text-transform: uppercase; font-weight: bold; color: var(--text-secondary);">Hasil Siswa</div>
        <div style="font-weight: bold; font-size: 1.15rem; color: var(--danger); font-family: monospace;">${c.input}</div>
      </div>
    </div>
    <div style="margin-bottom: 20px;">
      <label style="font-weight: bold; display: block; margin-bottom: 10px;">${c.q}</label>
      <div style="display: flex; flex-direction: column; gap: 8px;" id="case-options"></div>
    </div>
    <div id="case-feedback" class="glass-panel hidden-section" style="padding: 16px;"></div>
  `;

  const optHolder = document.getElementById("case-options");
  c.opts.forEach((opt, idx) => {
    const btn = document.createElement("button");
    btn.className = "btn btn-outline";
    btn.style.textAlign = "left";
    btn.style.justifyContent = "flex-start";
    btn.style.padding = "10px 16px";
    btn.innerHTML = `<strong>${String.fromCharCode(65 + idx)}.</strong> ${opt}`;
    btn.addEventListener("click", () => {
      optHolder.querySelectorAll("button").forEach(b => b.disabled = true);
      const isCorrect = idx === c.correctIdx;
      const fb = document.getElementById("case-feedback");
      fb.classList.remove("hidden-section");
      if (isCorrect) {
        fb.style.backgroundColor = "rgba(16, 185, 129, 0.15)";
        fb.style.color = "var(--success)";
        fb.innerHTML = `<strong>Benar!</strong> Analisis tepat. <br><span style="font-size:0.8rem; color:var(--text-secondary); font-weight:normal;">Saran penulisan: ${c.correct}. Alasan: ${c.issue}</span>`;
        currentProgress.xp += 20;
        missionStreak++;
      } else {
        fb.style.backgroundColor = "rgba(239, 68, 68, 0.15)";
        fb.style.color = "var(--danger)";
        fb.innerHTML = `<strong>Salah!</strong> Analisis audit salah. <br><span style="font-size:0.8rem; color:var(--text-secondary); font-weight:normal;">Saran penulisan: ${c.correct}. Alasan: ${c.issue}</span>`;
        missionStreak = 0;
      }
      const nextBtn = document.createElement("button");
      nextBtn.className = "btn btn-orange";
      nextBtn.style.marginTop = "12px";
      nextBtn.style.width = "100%";
      nextBtn.innerHTML = `Lanjut <i class="fas fa-arrow-right"></i>`;
      nextBtn.addEventListener("click", () => {
        currentQuestionIndex++;
        renderMisi6Challenge(container);
      });
      fb.appendChild(nextBtn);
    });
    optHolder.appendChild(btn);
  });
}

// --- MISI 7: TANTANGAN LABORATORIUM ---
function initMisi7(workspace) {
  currentMissionData.panjang = (10 + Math.random() * 5).toFixed(1);
  currentMissionData.lebar = (15 + Math.random() * 20).toFixed(1);
  currentMissionData.tebal = (3 + Math.random() * 5).toFixed(2);
  currentMissionData.massa = (180 + Math.random() * 100).toFixed(1);
  renderMisi7Workspace(workspace);
}

function renderMisi7Workspace(container) {
  container.innerHTML = `
    <h4 style="font-family: 'Outfit'; font-weight: 700; margin-bottom: 12px; color: var(--brand-orange);"><i class="fas fa-vial"></i> Eksperimen Terpadu: Menentukan Volume & Massa Jenis Balok</h4>
    <p style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 16px;">Ikuti langkah demi langkah di bawah ini untuk memformulasikan karakteristik fisis balok kuningan misterius:</p>
    <div class="glass-panel" style="padding: 16px; margin-bottom: 20px; display: flex; flex-direction: column; gap: 10px;">
      <h5 style="font-weight: bold; margin: 0; color: var(--brand-blue);">Langkah 1: Baca Data Pengukuran Alat</h5>
      <ul style="font-size: 0.85rem; margin: 0; padding-left: 20px; line-height: 1.5;">
        <li>Panjang Balok (Mistar) = <strong>${currentMissionData.panjang} cm</strong></li>
        <li>Lebar Balok (Jangka Sorong) = <strong>${currentMissionData.lebar} mm</strong></li>
        <li>Tebal Balok (Mikrometer Sekrup) = <strong>${currentMissionData.tebal} mm</strong></li>
        <li>Massa Balok (Timbangan) = <strong>${currentMissionData.massa} gram</strong></li>
      </ul>
    </div>
    <div class="glass-panel" style="padding: 16px; margin-bottom: 20px;">
      <h5 style="font-weight: bold; margin-bottom: 10px; color: var(--brand-blue);">Langkah 2: Konversi Satuan ke cm</h5>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
        <div>
          <label style="font-size: 0.75rem; font-weight: bold;">Lebar Balok dalam cm:</label>
          <input type="number" step="0.01" class="form-control" id="misi7-lebar-cm" placeholder="cm...">
        </div>
        <div>
          <label style="font-size: 0.75rem; font-weight: bold;">Tebal Balok dalam cm:</label>
          <input type="number" step="0.001" class="form-control" id="misi7-tebal-cm" placeholder="cm...">
        </div>
      </div>
    </div>
    <div class="glass-panel" style="padding: 16px; margin-bottom: 20px;">
      <h5 style="font-weight: bold; margin-bottom: 10px; color: var(--brand-blue);">Langkah 3: Hitung Volume Balok (cm³)</h5>
      <p style="font-size: 0.75rem; color: var(--text-secondary); margin-bottom: 8px;">Pemberitahuan: Pembulatan hasil mengikuti aturan angka penting terkecil (hasil dibulatkan ke 3 angka penting!).</p>
      <div style="display: flex; gap: 8px;">
        <input type="number" step="0.01" class="form-control" id="misi7-vol-input" placeholder="Masukkan volume balok...">
        <button class="btn btn-primary" id="btn-misi7-check">Submit Analisis</button>
      </div>
    </div>
    <div id="misi7-feedback" class="glass-panel hidden-section" style="padding: 16px;"></div>
  `;

  document.getElementById("btn-misi7-check").addEventListener("click", () => {
    const lebarCm = parseFloat(document.getElementById("misi7-lebar-cm").value);
    const tebalCm = parseFloat(document.getElementById("misi7-tebal-cm").value);
    const vol = parseFloat(document.getElementById("misi7-vol-input").value);
    const fb = document.getElementById("misi7-feedback");

    const correctLebar = parseFloat(currentMissionData.lebar) / 10;
    const correctTebal = parseFloat(currentMissionData.tebal) / 10;
    const p = parseFloat(currentMissionData.panjang);
    const exactVol = p * correctLebar * correctTebal;
    const roundedVol = parseFloat(exactVol.toPrecision(3));

    const isLebarCorrect = Math.abs(lebarCm - correctLebar) < 0.001;
    const isTebalCorrect = Math.abs(tebalCm - correctTebal) < 0.001;
    const isVolCorrect = Math.abs(vol - roundedVol) <= (roundedVol * 0.01);

    fb.classList.remove("hidden-section");
    document.getElementById("btn-misi7-check").disabled = true;
    document.getElementById("misi7-lebar-cm").disabled = true;
    document.getElementById("misi7-tebal-cm").disabled = true;
    document.getElementById("misi7-vol-input").disabled = true;

    if (isLebarCorrect && isTebalCorrect && isVolCorrect) {
      fb.style.backgroundColor = "rgba(16, 185, 129, 0.15)";
      fb.style.color = "var(--success)";
      fb.innerHTML = `
        <strong>Selamat!</strong> Analisis fisis balok sempurna. <br>
        • Lebar = ${lebarCm} cm (Benar)<br>
        • Tebal = ${tebalCm} cm (Benar)<br>
        • Volume = ${vol} cm³ (Benar, dibulatkan ke 3 AP).<br>
        • Massa Jenis Balok = ${(parseFloat(currentMissionData.massa) / vol).toFixed(3)} g/cm³.
      `;
      currentProgress.xp += 100;
      currentProgress.lkpd.dataMisi7 = {
        panjang: p,
        lebar: correctLebar,
        tebal: correctTebal,
        massa: parseFloat(currentMissionData.massa),
        volume: vol,
        massJenis: parseFloat((parseFloat(currentMissionData.massa) / vol).toFixed(3))
      };
      window.db.saveDetektifProgress(currentProgress);
      const finishBtn = document.createElement("button");
      finishBtn.className = "btn btn-orange";
      finishBtn.style.marginTop = "16px";
      finishBtn.style.width = "100%";
      finishBtn.innerHTML = `Selesaikan Misi Akhir <i class="fas fa-check-double"></i>`;
      finishBtn.addEventListener("click", () => {
        completeMission(7, 300);
      });
      fb.appendChild(finishBtn);
    } else {
      fb.style.backgroundColor = "rgba(239, 68, 68, 0.15)";
      fb.style.color = "var(--danger)";
      fb.innerHTML = `
        <strong>Analisis Masih Keliru!</strong> Periksa kembali konversi atau pembulatan angka penting Anda.<br>
        • Target Lebar = ${correctLebar} cm (Input Anda: ${lebarCm} cm)<br>
        • Target Tebal = ${correctTebal} cm (Input Anda: ${tebalCm} cm)<br>
        • Target Volume (3 AP) = ${roundedVol} cm³ (Input Anda: ${vol} cm³)<br>
        Silakan klik tombol "Ulangi" di bawah untuk mencoba kembali.
      `;
      const retryBtn = document.createElement("button");
      retryBtn.className = "btn btn-secondary";
      retryBtn.style.marginTop = "16px";
      retryBtn.style.width = "100%";
      retryBtn.textContent = "Ulangi Percobaan";
      retryBtn.addEventListener("click", () => {
        initMisi7(document.getElementById("detektif-game-workspace"));
      });
      fb.appendChild(retryBtn);
    }
  });
}

// ----------------------------------------------------
// Scoring and Badge System Logic
// ----------------------------------------------------
function completeMission(missionId, baseXp) {
  const user = window.auth.getCurrentUser();
  if (!user) return;
  currentProgress = window.db.getDetektifProgress(user.id);
  if (!currentProgress.completedMissions.includes(missionId)) {
    currentProgress.completedMissions.push(missionId);
  }
  let streakBonus = 0;
  if (missionStreak >= 5) streakBonus = 20;
  if (missionStreak >= 10) streakBonus = 50;
  let hintBonus = usedHint ? 0 : 30;
  const finalXp = baseXp + streakBonus + hintBonus;
  currentProgress.xp += finalXp;
  currentProgress.missionScores[missionId] = finalXp;
  const config = MISSION_CONFIG[missionId];
  if (config && config.badge && !currentProgress.badges.includes(config.badge)) {
    currentProgress.badges.push(config.badge);
    window.showToast(`Lencana Baru Dibuka: "${config.badge}"!`, "success");
  }
  if (missionId === 7 && !currentProgress.badges.includes("Ahli Laboratorium Fisika")) {
    currentProgress.badges.push("Ahli Laboratorium Fisika");
  }
  if (currentProgress.completedMissions.length === 7) {
    const totalScore = Object.values(currentProgress.missionScores).reduce((a, b) => a + b, 0);
    const finalGrade = Math.min(100, Math.round((totalScore / 975) * 100));
    currentProgress.grades = {
      pengetahuan: finalGrade,
      keterampilan: 95,
      analisis: 90,
      lkpd: 85,
      akhir: Math.round((finalGrade * 0.4) + (95 * 0.3) + (90 * 0.15) + (85 * 0.15))
    };
    const submission = {
      studentId: user.id,
      labId: 2,
      answers: currentProgress.lkpd,
      score: currentProgress.grades.akhir,
      status: "graded",
      feedback: "Luar biasa! Siswa berhasil menuntaskan seluruh 7 tingkat Misi Detektif Fisika dengan predikat sangat baik."
    };
    window.db.submitLKPD(submission);
  }
  window.db.saveDetektifProgress(currentProgress);
  window.showToast(`Misi ${missionId} Selesai! +${finalXp} XP diperoleh!`, "success");

  const workspace = document.getElementById("detektif-game-workspace");
  workspace.innerHTML = `
    <div style="text-align: center; padding: 40px 20px; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%;">
      <div style="background-color: var(--success); color: #fff; width: 80px; height: 80px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 2.5rem; margin-bottom: 24px; box-shadow: 0 8px 24px rgba(16,185,129,0.3);">
        <i class="fas fa-check"></i>
      </div>
      <h2 style="font-family: 'Poppins'; font-weight: 800; margin-bottom: 12px; color: var(--text-primary);">MISI SELESAI</h2>
      <p style="color: var(--text-secondary); margin-bottom: 24px; max-width: 400px; font-size: 0.9rem;">Selamat Agen, penyelidikan Misi ${missionId} telah dituntaskan dengan cemerlang!</p>
      <div class="glass-panel" style="padding: 16px; width: 100%; max-width: 320px; margin-bottom: 24px; text-align: left; display: flex; flex-direction: column; gap: 8px;">
        <div style="display: flex; justify-content: space-between;"><span>Base XP:</span><strong>+${baseXp} XP</strong></div>
        <div style="display: flex; justify-content: space-between;"><span>Streak Bonus:</span><strong>+${streakBonus} XP</strong></div>
        <div style="display: flex; justify-content: space-between;"><span>No Hint Bonus:</span><strong>+${hintBonus} XP</strong></div>
        <div style="border-top: 1px solid var(--glass-border); padding-top: 8px; display: flex; justify-content: space-between; font-weight: bold; color: var(--brand-orange);">
          <span>Total XP Diperoleh:</span><span>+${finalXp} XP</span>
        </div>
      </div>
      <div style="display: flex; gap: 12px; width: 100%; max-width: 360px;">
        <button class="btn btn-secondary" id="btn-misi-repeat" style="flex: 1;">Ulangi Misi</button>
        <button class="btn btn-primary" id="btn-misi-next" style="flex: 1;">Peta Misi</button>
      </div>
    </div>
  `;

  document.getElementById("btn-misi-repeat").addEventListener("click", () => playDetektifMission(missionId));
  document.getElementById("btn-misi-next").addEventListener("click", () => {
    window.location.hash = "#detektif";
  });
}

// Bind navigation back
document.addEventListener("DOMContentLoaded", () => {
  const backBtn = document.getElementById("btn-detektif-back");
  if (backBtn) {
    backBtn.addEventListener("click", () => {
      window.location.hash = "#detektif";
    });
  }
  const tabInfo = document.getElementById("tab-detektif-info");
  const tabTutor = document.getElementById("tab-detektif-tutor");
  if (tabInfo && tabTutor) {
    tabInfo.addEventListener("click", () => {
      tabInfo.classList.add("active");
      tabTutor.classList.remove("active");
      document.getElementById("panel-detektif-info").classList.remove("hidden-section");
      document.getElementById("panel-detektif-tutor").classList.add("hidden-section");
    });
    tabTutor.addEventListener("click", () => {
      tabTutor.classList.add("active");
      tabInfo.classList.remove("active");
      document.getElementById("panel-detektif-tutor").classList.remove("hidden-section");
      document.getElementById("panel-detektif-info").classList.add("hidden-section");
    });
  }
  const aiSend = document.getElementById("btn-detektif-ai-send");
  const aiInput = document.getElementById("detektif-ai-input");
  if (aiSend && aiInput) {
    aiSend.addEventListener("click", () => handleTutorChatInput());
    aiInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") handleTutorChatInput();
    });
  }

  // Bind toggle unlock all button click for Teacher/Admin
  const toggleBtn = document.getElementById("btn-toggle-unlock-all");
  if (toggleBtn) {
    toggleBtn.addEventListener("click", () => {
      const currentVal = localStorage.getItem("vlab_bypass_locks") !== "false";
      const newVal = !currentVal;
      localStorage.setItem("vlab_bypass_locks", newVal ? "true" : "false");
      
      if (newVal) {
        toggleBtn.textContent = "Buka: Aktif";
        toggleBtn.className = "btn btn-orange";
        window.showToast("Seluruh level penyelidikan telah dibuka!");
      } else {
        toggleBtn.textContent = "Aktifkan";
        toggleBtn.className = "btn btn-secondary";
        window.showToast("Batas akses level diaktifkan kembali.");
      }
      
      renderMissionsList();
    });
  }
});

function handleTutorChatInput() {
  const inputEl = document.getElementById("detektif-ai-input");
  const text = inputEl.value.trim();
  if (!text) return;
  inputEl.value = "";
  const history = document.getElementById("detektif-ai-history");
  const userBubble = document.createElement("div");
  userBubble.className = "chat-bubble user";
  userBubble.textContent = text;
  history.appendChild(userBubble);
  let reply = "Saya memahami pertanyaan Anda. Mari tinjau konsep dasar besaran fisis dan ketelitian alat ukur. Coba gunakan tombol 'Saya Tidak Mengerti' untuk mendapatkan petunjuk investigasi terperinci.";
  if (text.toLowerCase().includes("jangka sorong") || text.toLowerCase().includes("membaca")) {
    reply = "Untuk membaca jangka sorong: 1) Lihat garis nol nonius menunjuk ke skala utama berapa mm. 2) Temukan garis nonius yang lurus dengan skala atas. Kalikan itu dengan 0.1 mm, lalu tambahkan ke skala utama tadi.";
  } else if (text.toLowerCase().includes("angka penting")) {
    reply = "Aturan Angka Penting: Angka bukan nol selalu penting. Angka nol di depan desimal (kiri) tidak penting. Angka nol di belakang desimal penting. Hasil perkalian dibulatkan mengikuti AP tersedikit.";
  }
  setTimeout(() => {
    const aiBubble = document.createElement("div");
    aiBubble.className = "chat-bubble ai";
    aiBubble.innerHTML = `<strong>Tutor:</strong> ${reply}`;
    history.appendChild(aiBubble);
    history.scrollTop = history.scrollHeight;
  }, 600);
}

// Export functions to window
window.initDetektifDashboard = initDetektifDashboard;
window.playDetektifMission = playDetektifMission;
