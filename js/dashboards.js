/**
 * dashboards.js
 * Renders dashboards, class management tables, reports lists, and course pathways
 */

// Binds login and registration forms
document.addEventListener("DOMContentLoaded", () => {
  // Login Form Submission
  const loginForm = document.getElementById("form-login");
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = document.getElementById("login-email").value;
      const pass = document.getElementById("login-password").value;
      
      const res = window.auth.login(email, pass);
      if (res.success) {
        window.closeAllModals();
        window.showToast(`Selamat datang kembali, ${res.user.name}!`);
        // Update top header user indicator
        updateHeaderUserBadge();
        // Redirect to dashboard
        window.location.hash = "#dashboard";
      } else {
        window.showToast(res.message, "danger");
      }
    });
  }

  // Register Form Submission
  const registerForm = document.getElementById("form-register");
  if (registerForm) {
    registerForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = document.getElementById("register-name").value;
      const email = document.getElementById("register-email").value;
      const pass = document.getElementById("register-password").value;
      const role = document.getElementById("register-role").value;
      const classId = role === "siswa" ? document.getElementById("register-class").value : null;
      
      const res = window.auth.register(name, email, pass, role, classId);
      if (res.success) {
        window.closeAllModals();
        window.showToast(`Pendaftaran berhasil! Selamat datang, ${res.user.name}!`);
        updateHeaderUserBadge();
        window.location.hash = "#dashboard";
      } else {
        window.showToast(res.message, "danger");
      }
    });
    
    // Toggle class selector based on role
    const roleSelect = document.getElementById("register-role");
    const classGroup = document.getElementById("register-class-group");
    if (roleSelect && classGroup) {
      roleSelect.addEventListener("change", () => {
        if (roleSelect.value === "guru") {
          classGroup.style.display = "none";
        } else {
          classGroup.style.display = "block";
        }
      });
    }
  }

  // Logout Trigger
  const logoutBtn = document.getElementById("btn-logout");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      window.auth.logout();
      window.showToast("Anda telah keluar dari aplikasi.");
      updateHeaderUserBadge();
      window.location.hash = "#landing";
    });
  }

  // Phase F switching listeners removed because only Fase E remains active.

  // Teacher Class Search Filters
  const searchInput = document.getElementById("search-student");
  const classFilter = document.getElementById("filter-class");
  if (searchInput) searchInput.addEventListener("input", renderClassManagement);
  if (classFilter) classFilter.addEventListener("change", renderClassManagement);

  // Teacher reports class filter
  const reportClassFilter = document.getElementById("report-class-select");
  if (reportClassFilter) reportClassFilter.addEventListener("change", renderTeacherReports);

  // Teacher add student action
  const addStudentBtn = document.getElementById("btn-add-student");
  if (addStudentBtn) {
    addStudentBtn.addEventListener("click", () => {
      window.openModal("add-student-modal");
    });
  }

  const addStudentForm = document.getElementById("form-add-student");
  if (addStudentForm) {
    addStudentForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = document.getElementById("add-student-name").value;
      const email = document.getElementById("add-student-email").value;
      const classId = document.getElementById("add-student-class").value;
      
      const users = window.db.getTable("users");
      const exists = users.some(u => u.email === email);
      if (exists) {
        window.showToast("Email siswa sudah terdaftar!", "danger");
        return;
      }
      
      // Add standard user
      const newUserId = "usr_" + Math.random().toString(36).substr(2, 9);
      users.push({
        id: newUserId,
        email: email,
        password: "password123", // default
        name: name,
        role: "siswa",
        classId: classId
      });
      window.db.saveTable("users", users);
      
      // Add to student table
      const students = window.db.getTable("students");
      students.push({
        id: newUserId,
        name: name,
        classId: classId,
        email: email
      });
      window.db.saveTable("students", students);
      
      window.closeAllModals();
      addStudentForm.reset();
      window.showToast(`Siswa ${name} berhasil didaftarkan dengan kata sandi: password123`);
      renderClassManagement();
    });
  }

  // Grade submission form
  const gradeForm = document.getElementById("form-grade-submission");
  if (gradeForm) {
    gradeForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const studentId = document.getElementById("grade-student-id").value;
      const labId = document.getElementById("grade-lab-id").value;
      const score = document.getElementById("grading-score").value;
      const feedback = document.getElementById("grading-feedback").value;
      
      const res = window.db.gradeSubmission(studentId, labId, score, feedback);
      if (res) {
        window.closeAllModals();
        window.showToast("Berhasil mengirimkan penilaian dan feedback!");
        renderTeacherDashboard();
      } else {
        window.showToast("Gagal melakukan grading submission.", "danger");
      }
    });
  }

  // Print trigger
  const printReportBtn = document.getElementById("btn-print-reports");
  if (printReportBtn) {
    printReportBtn.addEventListener("click", () => {
      document.body.classList.add("printing-reports");
      window.print();
      setTimeout(() => {
        document.body.classList.remove("printing-reports");
      }, 1000);
    });
  }
});

function updateHeaderUserBadge() {
  const user = window.auth.getCurrentUser();
  const headerAuth = document.getElementById("header-auth-buttons");
  const headerUser = document.getElementById("header-user-badge");
  const nameEl = document.getElementById("user-display-name");
  
  if (user) {
    if (headerAuth) headerAuth.classList.add("hidden-section");
    if (headerUser) headerUser.classList.remove("hidden-section");
    if (nameEl) nameEl.textContent = user.name;
  } else {
    if (headerAuth) headerAuth.classList.remove("hidden-section");
    if (headerUser) headerUser.classList.add("hidden-section");
  }
}

window.updateHeaderUserBadge = updateHeaderUserBadge;

// Renders the Student learning grid map
function renderStudentDashboard() {
  updateHeaderUserBadge();
  const user = window.auth.getCurrentUser();
  if (!user) return;
  
  // Update student greeting text dynamically
  const greetingEl = document.getElementById("student-greeting");
  if (greetingEl) {
    greetingEl.textContent = `Halo, ${user.name} 👋`;
  }
  
  // Calculate user progress metrics
  const subs = window.db.getTable("submissions").filter(s => s.studentId === user.id);
  const quizScores = window.db.getTable("quizScores").filter(s => s.userId === user.id);
  const certs = window.db.getTable("certificates").filter(c => c.userId === user.id);
  
  const completedLabs = subs.filter(s => s.status === "graded" || s.score !== undefined).length;
  const materials = window.db.getTable("materials");
  const progressPercent = materials.length > 0 ? Math.round((completedLabs / materials.length) * 100) : 0;
  
  document.getElementById("student-stat-progress").textContent = `${progressPercent}%`;
  document.getElementById("student-stat-lkpd").textContent = subs.length;
  document.getElementById("student-stat-certs").textContent = certs.length;

  // Render pathway list (only Fase E exists)
  renderPathway("E");
}

function renderPathway(fase = "E") {
  const user = window.auth.getCurrentUser();
  const grid = document.getElementById("student-course-grid");
  if (!grid) return;
  
  const materials = window.db.getTable("materials").filter(m => m.fase === fase);
  grid.innerHTML = "";
  
  materials.forEach(mat => {
    // Get lab details
    const lab = window.db.getLabByMaterialId(mat.id);
    const sub = lab ? window.db.getLKPDSubmission(user.id, lab.id) : null;
    const quizRecs = window.db.getTable("quizScores").filter(q => q.userId === user.id && q.materialId === mat.id);
    const hasPassedQuiz = quizRecs.some(q => q.passed);
    
    let progress = 0;
    if (sub) progress += 50; // LKPD done
    if (hasPassedQuiz) progress += 50; // Quiz done
    
    const card = document.createElement("div");
    card.className = `glass-panel course-card glass-panel-hover ${fase === "F" ? "fase-f" : ""}`;
    card.innerHTML = `
      <div class="course-header">
        <span class="course-fase">Fase ${fase}</span>
        <span class="badge ${progress === 100 ? "badge-success" : progress > 0 ? "badge-warning" : "badge-blue"}">
          ${progress === 100 ? "Selesai" : progress > 0 ? "Berjalan" : "Belum Mulai"}
        </span>
      </div>
      <div>
        <h4 class="course-title">Modul ${mat.id}: ${mat.name}</h4>
        <p class="course-desc">${mat.desc.substring(0, 100)}...</p>
      </div>
      <div class="course-progress">
        <div class="progress-bar-container">
          <div class="progress-bar" style="width: ${progress}%"></div>
        </div>
        <div class="progress-labels">
          <span>Progres Belajar</span>
          <span>${progress}%</span>
        </div>
      </div>
      <div class="course-footer">
        <a href="#materi/${mat.id}" class="btn btn-secondary"><i class="fas fa-book"></i> Materi</a>
        ${lab ? `<a href="#lab/${lab.id}" class="btn btn-orange"><i class="fas fa-flask"></i> Mulai Lab</a>` : ""}
      </div>
    `;
    grid.appendChild(card);
  });
}

// Student Materials list rendering page
function renderMaterialsList() {
  renderMaterialsGrid("E");
}

function renderMaterialsGrid(fase = "E") {
  const grid = document.getElementById("materi-list-grid");
  if (!grid) return;
  grid.innerHTML = "";
  
  const materials = window.db.getTable("materials").filter(m => m.fase === fase);
  materials.forEach(mat => {
    const lab = window.db.getLabByMaterialId(mat.id);
    const card = document.createElement("div");
    card.className = `glass-panel course-card glass-panel-hover ${fase === "F" ? "fase-f" : ""}`;
    card.innerHTML = `
      <div class="course-header">
        <span class="course-fase">Fase ${fase}</span>
      </div>
      <div>
        <h4 class="course-title">Modul ${mat.id}: ${mat.name}</h4>
        <p class="course-desc">${mat.desc}</p>
      </div>
      <div class="course-footer" style="margin-top: 20px;">
        <a href="#materi/${mat.id}" class="btn btn-primary">Buka Materi</a>
        ${lab ? `<a href="#lab/${lab.id}" class="btn btn-orange">FIVIA Virtual Lab</a>` : ""}
      </div>
    `;
    grid.appendChild(card);
  });
}

// Student Materials Details layout page
function renderMaterialDetail(matId) {
  const mat = window.db.getMaterial(matId);
  if (!mat) {
    window.location.hash = "#materi";
    return;
  }
  
  const mId = parseInt(matId);
  document.getElementById("materi-detail-fase").textContent = `Fase ${mat.fase}`;
  document.getElementById("materi-detail-title").textContent = `Modul ${mat.id}: ${mat.name}`;
  document.getElementById("materi-detail-desc").textContent = mat.desc;
  document.getElementById("materi-detail-tujuan").textContent = `Siswa mampu memahami, menganalisis, serta mengaplikasikan konsep dan formulasi terkait ${mat.name} dalam konteks Kurikulum Merdeka.`;
  document.getElementById("materi-detail-formula").textContent = mat.equation;
  
  // 1. Render Theory Content
  const theoryBody = document.getElementById("materi-detail-body");
  if (mId === 2) {
    // MODUL 2: PENGUKURAN DASAR FISIKA (Besaran, Satuan, Dimensi, Angka Penting, Alat Ukur)
    theoryBody.innerHTML = `
      <div style="background-color: var(--bg-primary); padding: 22px; border-radius: 12px; margin-bottom: 24px; border: 1px solid var(--glass-border);">
        <h4 style="color: var(--brand-blue); margin-bottom: 12px; font-size: 1.1rem;"><i class="fas fa-tags"></i> 1. Besaran Pokok & Satuan Internasional (SI)</h4>
        <p style="font-size: 0.95rem; line-height: 1.6; margin-bottom: 14px;">
          <strong>Besaran Pokok</strong> adalah besaran yang satuannya telah didefinisikan terlebih dahulu melalui konvensi internasional dan tidak diturunkan dari besaran lain. Dalam Sistem Internasional (SI), terdapat tepat <strong>7 Besaran Pokok</strong>:
        </p>
        <div class="table-responsive" style="margin-bottom: 14px;">
          <table class="custom-table" style="width: 100%; font-size: 0.9rem; text-align: left;">
            <thead>
              <tr style="background: rgba(13, 110, 253, 0.08);">
                <th>No</th>
                <th>Besaran Pokok</th>
                <th>Satuan SI</th>
                <th>Lambang Satuan</th>
                <th>Dimensi</th>
                <th>Alat Ukur Baku</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>1</td><td><strong>Panjang</strong></td><td>meter</td><td>m</td><td><code>[L]</code></td><td>Mistar, Jangka Sorong, Mikrometer</td></tr>
              <tr><td>2</td><td><strong>Massa</strong></td><td>kilogram</td><td>kg</td><td><code>[M]</code></td><td>Neraca Ohaus, Neraca Digital</td></tr>
              <tr><td>3</td><td><strong>Waktu</strong></td><td>sekon</td><td>s</td><td><code>[T]</code></td><td>Stopwatch, Jam Atom</td></tr>
              <tr><td>4</td><td><strong>Suhu Mutlak</strong></td><td>Kelvin</td><td>K</td><td><code>[&Theta;]</code></td><td>Termometer</td></tr>
              <tr><td>5</td><td><strong>Kuat Arus Listrik</strong></td><td>Ampere</td><td>A</td><td><code>[I]</code></td><td>Amperemeter, Multimeter</td></tr>
              <tr><td>6</td><td><strong>Intensitas Cahaya</strong></td><td>candela</td><td>cd</td><td><code>[J]</code></td><td>Luxmeter / Light Meter</td></tr>
              <tr><td>7</td><td><strong>Jumlah Zat</strong></td><td>mol</td><td>mol</td><td><code>[N]</code></td><td>Perhitungan Stoikiometri Fisika</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      <div style="background-color: var(--bg-primary); padding: 22px; border-radius: 12px; margin-bottom: 24px; border: 1px solid var(--glass-border);">
        <h4 style="color: var(--brand-orange); margin-bottom: 12px; font-size: 1.1rem;"><i class="fas fa-cubes"></i> 2. Besaran Turunan & Analisis Dimensi</h4>
        <p style="font-size: 0.95rem; line-height: 1.6; margin-bottom: 14px;">
          <strong>Besaran Turunan</strong> adalah besaran yang diturunkan atau disusun dari kombinasi perkalian atau pembagian besaran pokok. Analisis dimensi digunakan untuk membuktikan kesetaraan rumus dan kebenaran persamaan fisika.
        </p>
        <div class="table-responsive" style="margin-bottom: 14px;">
          <table class="custom-table" style="width: 100%; font-size: 0.9rem; text-align: left;">
            <thead>
              <tr style="background: rgba(253, 126, 20, 0.08);">
                <th>Besaran Turunan</th>
                <th>Rumus Penurunan</th>
                <th>Satuan SI</th>
                <th>Analisis Dimensi</th>
              </tr>
            </thead>
            <tbody>
              <tr><td><strong>Kecepatan (v)</strong></td><td>Jarak / Waktu (s / t)</td><td>m/s</td><td><code>[L][T]⁻¹</code></td></tr>
              <tr><td><strong>Percepatan (a)</strong></td><td>Kecepatan / Waktu (v / t)</td><td>m/s²</td><td><code>[L][T]⁻²</code></td></tr>
              <tr><td><strong>Gaya (F)</strong></td><td>Massa &times; Percepatan (m &times; a)</td><td>Newton (N = kg&middot;m/s²)</td><td><code>[M][L][T]⁻²</code></td></tr>
              <tr><td><strong>Usaha &amp; Energi (W, E)</strong></td><td>Gaya &times; Jarak (F &times; s)</td><td>Joule (J = kg&middot;m²/s²)</td><td><code>[M][L]²[T]⁻²</code></td></tr>
              <tr><td><strong>Daya (P)</strong></td><td>Usaha / Waktu (W / t)</td><td>Watt (W = J/s)</td><td><code>[M][L]²[T]⁻³</code></td></tr>
              <tr><td><strong>Tekanan (P)</strong></td><td>Gaya / Luas (F / A)</td><td>Pascal (Pa = N/m²)</td><td><code>[M][L]⁻¹[T]⁻²</code></td></tr>
              <tr><td><strong>Massa Jenis (&rho;)</strong></td><td>Massa / Volume (m / V)</td><td>kg/m³</td><td><code>[M][L]⁻³</code></td></tr>
              <tr><td><strong>Momentum (p)</strong></td><td>Massa &times; Kecepatan (m &times; v)</td><td>kg&middot;m/s</td><td><code>[M][L][T]⁻¹</code></td></tr>
            </tbody>
          </table>
        </div>
      </div>

      <div style="background-color: var(--bg-primary); padding: 22px; border-radius: 12px; margin-bottom: 24px; border: 1px solid var(--glass-border);">
        <h4 style="color: #ec4899; margin-bottom: 12px; font-size: 1.1rem;"><i class="fas fa-sort-numeric-up-alt"></i> 3. Aturan Baku Angka Penting & Operasi Hitung</h4>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
          <div style="background: rgba(0,0,0,0.02); padding: 14px; border-radius: 8px; border: 1px dashed var(--glass-border);">
            <h5 style="color: var(--brand-blue); margin-bottom: 8px;"><i class="fas fa-check-circle"></i> 5 Kaidah Angka Penting (AP):</h5>
            <ol style="margin-left: 18px; font-size: 0.88rem; display: flex; flex-direction: column; gap: 6px; line-height: 1.5;">
              <li>Semua angka bukan nol adalah angka penting (contoh: <code>24.3</code> memiliki 3 AP).</li>
              <li>Angka nol di antara angka bukan nol adalah angka penting (contoh: <code>105.02</code> memiliki 5 AP).</li>
              <li>Angka nol di sebelah kiri angka bukan nol bukan angka penting (contoh: <code>0.0045</code> memiliki 2 AP).</li>
              <li>Angka nol di belakang tanda desimal setelah angka bukan nol adalah angka penting (contoh: <code>12.50</code> memiliki 4 AP).</li>
              <li>Angka nol di akhir bilangan bulat tanpa desimal bukan AP kecuali diberi tanda khusus (contoh: <code>300</code> memiliki 1 AP).</li>
            </ol>
          </div>
          <div style="background: rgba(0,0,0,0.02); padding: 14px; border-radius: 8px; border: 1px dashed var(--glass-border);">
            <h5 style="color: var(--brand-orange); margin-bottom: 8px;"><i class="fas fa-calculator"></i> Kaidah Operasi Matematis:</h5>
            <ul style="margin-left: 18px; font-size: 0.88rem; display: flex; flex-direction: column; gap: 8px; line-height: 1.5;">
              <li><strong>Penjumlahan &amp; Pengurangan</strong>: Hasil dibulatkan hingga hanya memiliki <strong>1 angka taksiran (mengikuti jumlah desimal paling sedikit)</strong>.<br><em>Contoh: 12.5 + 3.24 = 15.74 &rarr; 15.7</em></li>
              <li><strong>Perkalian &amp; Pembagian</strong>: Hasil memiliki jumlah angka penting <strong>paling sedikit di antara faktor-faktornya</strong>.<br><em>Contoh: 4.25 (3 AP) &times; 2.1 (2 AP) = 8.925 &rarr; 8.9 (2 AP)</em></li>
            </ul>
          </div>
        </div>
      </div>

      <div style="background-color: var(--bg-primary); padding: 22px; border-radius: 12px; margin-bottom: 24px; border: 1px solid var(--glass-border);">
        <h4 style="color: var(--success); margin-bottom: 12px; font-size: 1.1rem;"><i class="fas fa-ruler-combined"></i> 4. Alat Ukur Presisi Laboratorium Fisika</h4>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 14px;">
          <div style="padding: 14px; background: rgba(16, 185, 129, 0.04); border-radius: 8px; border: 1px solid rgba(16, 185, 129, 0.2);">
            <h5 style="color: var(--success); margin-bottom: 6px;"><i class="fas fa-ruler"></i> Mistar</h5>
            <p style="font-size: 0.85rem; line-height: 1.5; color: var(--text-secondary);">Skala terkecil: <strong>1 mm (0.1 cm)</strong>.<br>Ketidakpastian (&Delta;x): <strong>&frac12; &times; 1 mm = 0.5 mm (0.05 cm)</strong>.</p>
          </div>
          <div style="padding: 14px; background: rgba(59, 130, 246, 0.04); border-radius: 8px; border: 1px solid rgba(59, 130, 246, 0.2);">
            <h5 style="color: var(--brand-blue); margin-bottom: 6px;"><i class="fas fa-drafting-compass"></i> Jangka Sorong</h5>
            <p style="font-size: 0.85rem; line-height: 1.5; color: var(--text-secondary);">Ketelitian nonius: <strong>0.1 mm (0.01 cm)</strong>.<br>Rumus: <code>Hasil = SU + (SN &times; 0.1 mm)</code>.<br>Ketidakpastian (&Delta;x): <strong>0.05 mm</strong>.</p>
          </div>
          <div style="padding: 14px; background: rgba(245, 158, 11, 0.04); border-radius: 8px; border: 1px solid rgba(245, 158, 11, 0.2);">
            <h5 style="color: var(--brand-orange); margin-bottom: 6px;"><i class="fas fa-microscope"></i> Mikrometer Sekrup</h5>
            <p style="font-size: 0.85rem; line-height: 1.5; color: var(--text-secondary);">Ketelitian putar: <strong>0.01 mm (0.001 cm)</strong>.<br>Rumus: <code>Hasil = SU + (SN &times; 0.01 mm)</code>.<br>Ketidakpastian (&Delta;x): <strong>0.005 mm</strong>.</p>
          </div>
        </div>
      </div>

      <div style="background: linear-gradient(135deg, rgba(13, 110, 253, 0.1), rgba(253, 126, 20, 0.1)); padding: 20px; border-radius: 12px; border: 1px solid rgba(13, 110, 253, 0.3); display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 16px;">
        <div>
          <h4 style="margin-bottom: 4px; color: var(--text-primary);"><i class="fas fa-user-secret" style="color: var(--brand-blue);"></i> Siap Beraksi Sebagai Detektif Fisika?</h4>
          <p style="font-size: 0.9rem; color: var(--text-secondary); margin: 0;">Selesaikan investigasi Misi Detektif Besaran, Satuan &amp; Dimensi atau isi Lembar Kerja Praktikum (LKPD Digital)!</p>
        </div>
        <div style="display: flex; gap: 10px;">
          <button class="btn btn-primary" id="btn-quick-detektif" style="padding: 8px 16px; font-size: 0.85rem;"><i class="fas fa-search"></i> Buka Kegiatan Detektif</button>
          <button class="btn btn-orange" id="btn-quick-lkpd" style="padding: 8px 16px; font-size: 0.85rem;"><i class="fas fa-file-signature"></i> Buka LKPD Digital</button>
        </div>
      </div>
    `;
    
    // Bind quick switch buttons
    const bDet = document.getElementById("btn-quick-detektif");
    const bLk = document.getElementById("btn-quick-lkpd");
    if (bDet) bDet.onclick = () => document.getElementById("detail-tab-detektif").click();
    if (bLk) bLk.onclick = () => document.getElementById("detail-tab-lkpd").click();
  } else if (mId === 1) {
    // MODUL 1: HAKIKAT FISIKA DAN METODE ILMIAH
    theoryBody.innerHTML = `
      <div style="background-color: var(--bg-primary); padding: 20px; border-radius: 12px; margin-bottom: 24px; border: 1px solid var(--glass-border);">
        <h4 style="color: var(--brand-blue); margin-bottom: 8px;"><i class="fas fa-info-circle"></i> 1. Hakikat Ilmu Fisika</h4>
        <p style="font-size: 0.95rem; line-height: 1.5; margin-bottom: 12px;">
          Fisika merupakan cabang ilmu sains dasar (Natural Science) yang mempelajari gejala alam semesta, interaksi materi dan energi, serta gaya-gaya fundamental. Hakikat fisika mencakup 3 aspek utama:
        </p>
        <ul style="margin-left: 20px; font-size: 0.92rem; display: flex; flex-direction: column; gap: 6px;">
          <li><strong>Fisika sebagai Produk (A Body of Knowledge)</strong>: Kumpulan fakta, konsep, prinsip, hukum, teori, dan model ilmiah.</li>
          <li><strong>Fisika sebagai Sikap (A Way of Thinking)</strong>: Sikap rasa ingin tahu, jujur, objektif, teliti, kritis, dan terbuka.</li>
          <li><strong>Fisika sebagai Proses (A Way of Investigating)</strong>: Keterampilan proses saintifik untuk memecahkan misteri alam melalui metode ilmiah.</li>
        </ul>
      </div>

      <div style="background-color: var(--bg-primary); padding: 20px; border-radius: 12px; margin-bottom: 24px; border: 1px solid var(--glass-border);">
        <h4 style="color: var(--brand-orange); margin-bottom: 8px;"><i class="fas fa-vial"></i> 2. Langkah-Langkah Metode Ilmiah</h4>
        <ol style="margin-left: 20px; font-size: 0.92rem; display: flex; flex-direction: column; gap: 8px; line-height: 1.5;">
          <li><strong>Observasi &amp; Identifikasi Masalah</strong>: Mengamati fenomena fisik dan merumuskan masalah yang spesifik.</li>
          <li><strong>Studi Literatur &amp; Perumusan Hipotesis</strong>: Mengumpulkan data teori dasar dan membuat dugaan sementara yang dapat diuji secara empiris.</li>
          <li><strong>Perencanaan &amp; Eksperimen</strong>: Merancang variabel percobaan (variabel bebas, terikat, dan kontrol) serta melakukan pengambilan data di lab.</li>
          <li><strong>Analisis Data &amp; Pengolahan</strong>: Menganalisis data angka, grafik linier, dan menghitung ketidakpastian.</li>
          <li><strong>Menarik Kesimpulan</strong>: Membuktikan apakah hipotesis diterima atau ditolak.</li>
          <li><strong>Publikasi &amp; Komunikasi</strong>: Membagikan laporan ilmiah atau LKPD kepada guru dan rekan.</li>
        </ol>
      </div>

      <div style="background-color: var(--bg-primary); padding: 20px; border-radius: 12px; margin-bottom: 24px; border: 1px solid var(--glass-border);">
        <h4 style="color: var(--danger); margin-bottom: 8px;"><i class="fas fa-shield-alt"></i> 3. Keselamatan Kerja di Laboratorium (K3)</h4>
        <p style="font-size: 0.92rem; line-height: 1.5; margin-bottom: 8px;">
          Setiap praktikan wajib mengenakan Alat Pelindung Diri (Jas Lab, Kacamata Pelindung, Sarung Tangan, Masker) dan memahami simbol bahaya kimia (Toxic, Corrosive, Flammable, Explosive, Biohazard).
        </p>
      </div>
    `;
  } else {
    // MODUL 3+: DEFAULT MATERI DETAIL
    theoryBody.innerHTML = `
      <h3 style="margin: 20px 0 10px 0;">Materi Pokok: ${mat.name}</h3>
      <p style="margin-bottom: 12px;">Topik inti modul ini meliputi: <strong>${mat.topic}</strong>.</p>
      <p style="margin-bottom: 12px;">Dalam pembelajaran ini, Anda diharapkan mampu memahami hubungan fisis antar variabel secara matematis. Silakan jalankan modul FIVIA Virtual Lab untuk mensimulasikan hukum fisika di bawah ini, kumpulkan data hasil pengamatan ke tabel LKPD digital, dan uji pemahaman Anda di bagian kuis evaluasi formatif HOTS.</p>
      <h4 style="margin-top: 20px; color: var(--brand-orange);">Kegiatan Pembelajaran Mandiri:</h4>
      <ol style="margin-left: 20px; margin-top: 8px; display: flex; flex-direction: column; gap: 8px;">
        <li>Baca ringkasan teori singkat dan tonton video demonstrasi praktikum.</li>
        <li>Buka tab <strong>LKPD Digital</strong> untuk mempersiapkan pencatatan data dan hipotesis.</li>
        <li>Masuk ke menu FIVIA Virtual Lab untuk membuka modul visualisasi interaktif.</li>
        <li>Gunakan kontrol parameter untuk mengubah variabel percobaan dan catat data pada LKPD.</li>
        <li>Gunakan menu AI Tutor untuk bertanya seputar rumus maupun pengerjaan praktikum.</li>
        <li>Kirim LKPD Anda untuk dinilai oleh instruktur / guru secara otomatis.</li>
      </ol>
    `;
  }

  // 2. Render Detective Tab Content
  renderMaterialDetektifTab(mat);

  // 3. Render Digital LKPD Tab Content
  renderMaterialLKPDTab(mat);

  // 4. Set Video source
  const iframe = document.getElementById("materi-video-iframe");
  if (iframe) {
    iframe.src = mat.videoUrl;
  }

  // 5. Setup Tab Switching System
  setupMaterialTabsNav();

  // 6. Action Buttons
  const lab = window.db.getLabByMaterialId(matId);
  const btnLab = document.getElementById("btn-go-to-lab");
  if (btnLab) {
    if (lab) {
      btnLab.style.display = "inline-flex";
      btnLab.onclick = () => window.location.hash = `#lab/${lab.id}`;
    } else {
      btnLab.style.display = "none";
    }
  }
  
  const btnQuiz = document.getElementById("btn-go-to-quiz");
  if (btnQuiz) {
    btnQuiz.onclick = () => window.location.hash = `#quiz/${mat.id}`;
  }
}

// Setup Tab Navigation in Material Details Page
function setupMaterialTabsNav() {
  const tabs = [
    { btn: document.getElementById("detail-tab-teori"), content: document.getElementById("detail-content-teori") },
    { btn: document.getElementById("detail-tab-detektif"), content: document.getElementById("detail-content-detektif") },
    { btn: document.getElementById("detail-tab-lkpd"), content: document.getElementById("detail-content-lkpd") },
    { btn: document.getElementById("detail-tab-video"), content: document.getElementById("detail-content-video") }
  ];

  tabs.forEach(t => {
    if (!t.btn) return;
    t.btn.onclick = () => {
      tabs.forEach(other => {
        if (other.btn) other.btn.classList.remove("active");
        if (other.content) other.content.classList.add("hidden-section");
      });
      t.btn.classList.add("active");
      if (t.content) t.content.classList.remove("hidden-section");
    };
  });

  // Default activate Teori Tab
  if (tabs[0].btn) tabs[0].btn.click();
}

// Render Detective Tab for Material Detail
function renderMaterialDetektifTab(mat) {
  const container = document.getElementById("materi-detektif-container");
  if (!container) return;

  const mId = parseInt(mat.id);

  if (mId === 2) {
    container.innerHTML = `
      <div style="background: linear-gradient(135deg, rgba(13, 110, 253, 0.08), rgba(236, 72, 153, 0.08)); padding: 24px; border-radius: 12px; margin-bottom: 24px; border: 1px solid var(--glass-border);">
        <div style="display: flex; align-items: center; gap: 14px; margin-bottom: 8px;">
          <div style="font-size: 2rem; color: var(--brand-blue);"><i class="fas fa-user-secret"></i></div>
          <div>
            <h3 style="margin: 0; color: var(--text-primary); font-family: 'Poppins', sans-serif;">Pusat Investigasi Detektif: Besaran, Satuan, Dimensi &amp; Pengukuran</h3>
            <p style="margin: 4px 0 0 0; font-size: 0.9rem; color: var(--text-secondary);">
              Selamat datang di markas investigasi Detektif Fisika! Pilih misi di bawah ini atau selesaikan tantangan klasifikasi besaran interaktif langsung di halaman ini.
            </p>
          </div>
        </div>
      </div>

      <!-- Quick Misi Detektif Grid -->
      <h4 style="color: var(--brand-orange); margin-bottom: 14px;"><i class="fas fa-crosshairs"></i> Daftar Misi Investigasi Detektif Terkait Modul 2:</h4>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 14px; margin-bottom: 28px;">
        
        <div class="glass-panel" style="padding: 18px; border-radius: 10px; display: flex; flex-direction: column; justify-content: space-between; border-left: 4px solid var(--brand-blue);">
          <div>
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
              <h5 style="margin: 0; font-size: 0.98rem; color: var(--brand-blue);"><i class="fas fa-tag"></i> Misi 1: Detektif Besaran</h5>
              <span class="badge badge-blue">+50 XP</span>
            </div>
            <p style="font-size: 0.84rem; color: var(--text-secondary); margin-bottom: 12px; line-height: 1.4;">
              Identifikasi besaran pokok vs turunan dari benda-benda dan situasi kasus nyata di sekitar kita.
            </p>
          </div>
          <button class="btn btn-primary" onclick="window.location.hash='#detektif/misi/1'" style="width: 100%; font-size: 0.8rem; padding: 7px 12px;"><i class="fas fa-play"></i> Mulai Misi 1</button>
        </div>

        <div class="glass-panel" style="padding: 18px; border-radius: 10px; display: flex; flex-direction: column; justify-content: space-between; border-left: 4px solid var(--success);">
          <div>
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
              <h5 style="margin: 0; font-size: 0.98rem; color: var(--success);"><i class="fas fa-exchange-alt"></i> Misi 2: Laboratorium Satuan</h5>
              <span class="badge badge-green">+75 XP</span>
            </div>
            <p style="font-size: 0.84rem; color: var(--text-secondary); margin-bottom: 12px; line-height: 1.4;">
              Analisis konversi satuan internasional (SI) dan pecahkan teka-teki konversi prefix satuan fisika.
            </p>
          </div>
          <button class="btn btn-success" onclick="window.location.hash='#detektif/misi/2'" style="width: 100%; font-size: 0.8rem; padding: 7px 12px;"><i class="fas fa-play"></i> Mulai Misi 2</button>
        </div>

        <div class="glass-panel" style="padding: 18px; border-radius: 10px; display: flex; flex-direction: column; justify-content: space-between; border-left: 4px solid var(--accent-violet);">
          <div>
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
              <h5 style="margin: 0; font-size: 0.98rem; color: var(--accent-violet);"><i class="fas fa-ruler-combined"></i> Misi 3: Ahli Dimensi</h5>
              <span class="badge badge-purple">+100 XP</span>
            </div>
            <p style="font-size: 0.84rem; color: var(--text-secondary); margin-bottom: 12px; line-height: 1.4;">
              Penyelidikan kesetaraan dimensi rumus fisika: Kecepatan, Gaya, Usaha, Energi, Tekanan, &amp; Daya.
            </p>
          </div>
          <button class="btn btn-purple" onclick="window.location.hash='#detektif/misi/3'" style="width: 100%; font-size: 0.8rem; padding: 7px 12px;"><i class="fas fa-play"></i> Mulai Misi 3</button>
        </div>

        <div class="glass-panel" style="padding: 18px; border-radius: 10px; display: flex; flex-direction: column; justify-content: space-between; border-left: 4px solid var(--warning);">
          <div>
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
              <h5 style="margin: 0; font-size: 0.98rem; color: var(--brand-orange);"><i class="fas fa-compass"></i> Misi 4: Detektif Pengukuran</h5>
              <span class="badge badge-orange">+200 XP</span>
            </div>
            <p style="font-size: 0.84rem; color: var(--text-secondary); margin-bottom: 12px; line-height: 1.4;">
              Uji ketelitian membaca skala Mistar, Jangka Sorong, Mikrometer Sekrup, Stopwatch, dan Neraca Ohaus.
            </p>
          </div>
          <button class="btn btn-orange" onclick="window.location.hash='#detektif/misi/4'" style="width: 100%; font-size: 0.8rem; padding: 7px 12px;"><i class="fas fa-play"></i> Mulai Misi 4</button>
        </div>

        <div class="glass-panel" style="padding: 18px; border-radius: 10px; display: flex; flex-direction: column; justify-content: space-between; border-left: 4px solid #ec4899;">
          <div>
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
              <h5 style="margin: 0; font-size: 0.98rem; color: #ec4899;"><i class="fas fa-search"></i> Misi 5: Detektif Angka Penting</h5>
              <span class="badge badge-pink">+100 XP</span>
            </div>
            <p style="font-size: 0.84rem; color: var(--text-secondary); margin-bottom: 12px; line-height: 1.4;">
              Pecahkan misteri jumlah angka penting dan aturan pembulatan operasi perkalian/penjumlahan ilmiah.
            </p>
          </div>
          <button class="btn" style="width: 100%; font-size: 0.8rem; padding: 7px 12px; background: #ec4899; color: white;" onclick="window.location.hash='#detektif/misi/5'"><i class="fas fa-play"></i> Mulai Misi 5</button>
        </div>

      </div>

      <!-- Embedded Interactive Classification Game -->
      <div id="besaran-game-mount-area"></div>
    `;

    setTimeout(() => {
      initBesaranGame("besaran-game-mount-area");
    }, 60);

  } else {
    // For other modules, provide quick links to Detective Hub
    container.innerHTML = `
      <div style="background: linear-gradient(135deg, rgba(13, 110, 253, 0.08), rgba(253, 126, 20, 0.08)); padding: 24px; border-radius: 12px; margin-bottom: 24px; border: 1px solid var(--glass-border); text-align: center;">
        <div style="font-size: 2.5rem; color: var(--brand-blue); margin-bottom: 12px;"><i class="fas fa-user-secret"></i></div>
        <h3 style="margin-bottom: 8px; font-family: 'Poppins', sans-serif;">Pusat Petualangan Detektif Fisika</h3>
        <p style="max-width: 600px; margin: 0 auto 20px auto; font-size: 0.92rem; color: var(--text-secondary); line-height: 1.5;">
          Jelajahi seluruh tantangan kasus misteri fisika interaktif di halaman Misi Detektif. Kumpulkan XP, buka badge kehormatan, dan raih predikat Master Fisika!
        </p>
        <button class="btn btn-primary" onclick="window.location.hash='#detektif'" style="padding: 10px 24px; font-size: 0.95rem;"><i class="fas fa-gamepad"></i> Buka Dashboard Detektif Fisika</button>
      </div>
    `;
  }
}

// Render Digital LKPD Tab for Material Detail
function renderMaterialLKPDTab(mat) {
  const container = document.getElementById("materi-lkpd-container");
  if (!container) return;

  const user = window.auth.getCurrentUser();
  const mId = parseInt(mat.id);
  const lab = window.db.getLabByMaterialId(mat.id);
  const labId = lab ? lab.id : mId;
  const lkpdData = window.db.getLKPDForLab(labId);

  const prevSub = user ? window.db.getLKPDSubmission(user.id, labId) : null;
  const autosaveKey = user ? `vlab_autosave_${user.id}_lab_${labId}` : `vlab_autosave_guest_${labId}`;
  const autosavedStr = localStorage.getItem(autosaveKey);

  let initialData = prevSub;
  if (!initialData && autosavedStr) {
    try { initialData = JSON.parse(autosavedStr); } catch (e) { }
  }

  const savedHyp = initialData ? (initialData.hypothesis || "") : "";
  const savedConc = initialData ? (initialData.conclusion || "") : "";
  const savedAnswers = (initialData && initialData.answers) ? initialData.answers : {};

  // Table default rows for Modul 2
  let defaultRowsHtml = "";
  if (mId === 2) {
    const sampleRows = [
      { item: "Kelereng Kaca", tool: "Jangka Sorong", su: "15.0 mm", sn: "0.4 mm", hasil: "15.4 mm", uncert: "&plusmn; 0.05 mm" },
      { item: "Kawat Tembaga", tool: "Mikrometer Sekrup", su: "2.5 mm", sn: "0.38 mm", hasil: "2.88 mm", uncert: "&plusmn; 0.005 mm" },
      { item: "Ketebalan Plat Seng", tool: "Mikrometer Sekrup", su: "0.5 mm", sn: "0.12 mm", hasil: "0.62 mm", uncert: "&plusmn; 0.005 mm" },
      { item: "Panjang Buku", tool: "Mistar", su: "24.0 cm", sn: "-", hasil: "24.0 cm", uncert: "&plusmn; 0.05 cm" }
    ];

    sampleRows.forEach((r, idx) => {
      defaultRowsHtml += `
        <tr class="lkpd-modul-row">
          <td>${idx + 1}</td>
          <td><input type="text" class="lkpd-table-input" value="${r.item}" style="width: 100%; padding: 4px 8px; font-size: 0.85rem; border-radius: 4px; border: 1px solid var(--glass-border);"></td>
          <td>
            <select class="lkpd-table-input" style="width: 100%; padding: 4px 8px; font-size: 0.85rem; border-radius: 4px; border: 1px solid var(--glass-border);">
              <option ${r.tool === "Mistar" ? "selected" : ""}>Mistar</option>
              <option ${r.tool === "Jangka Sorong" ? "selected" : ""}>Jangka Sorong</option>
              <option ${r.tool === "Mikrometer Sekrup" ? "selected" : ""}>Mikrometer Sekrup</option>
              <option ${r.tool === "Neraca Ohaus" ? "selected" : ""}>Neraca Ohaus</option>
              <option ${r.tool === "Stopwatch" ? "selected" : ""}>Stopwatch</option>
            </select>
          </td>
          <td><input type="text" class="lkpd-table-input" value="${r.su}" style="width: 100%; padding: 4px 8px; font-size: 0.85rem; border-radius: 4px; border: 1px solid var(--glass-border);"></td>
          <td><input type="text" class="lkpd-table-input" value="${r.sn}" style="width: 100%; padding: 4px 8px; font-size: 0.85rem; border-radius: 4px; border: 1px solid var(--glass-border);"></td>
          <td><input type="text" class="lkpd-table-input" value="${r.hasil}" style="width: 100%; padding: 4px 8px; font-size: 0.85rem; font-weight: bold; border-radius: 4px; border: 1px solid var(--glass-border);"></td>
          <td><input type="text" class="lkpd-table-input" value="${r.uncert}" style="width: 100%; padding: 4px 8px; font-size: 0.85rem; color: var(--text-secondary); border-radius: 4px; border: 1px solid var(--glass-border);"></td>
          <td style="text-align: center;"><button class="btn btn-danger btn-del-row" style="padding: 2px 8px; font-size: 0.75rem;"><i class="fas fa-trash"></i></button></td>
        </tr>
      `;
    });
  }

  // Questions HTML
  let questionsHtml = "";
  if (lkpdData && lkpdData.pertanyaan) {
    lkpdData.pertanyaan.forEach((q, idx) => {
      const qVal = savedAnswers[q.id] || "";
      questionsHtml += `
        <div style="margin-bottom: 18px; background: rgba(0,0,0,0.02); padding: 16px; border-radius: 8px; border: 1px solid var(--glass-border);">
          <label style="display: block; font-weight: 600; font-size: 0.92rem; margin-bottom: 8px; color: var(--text-primary);">
            <i class="fas fa-question-circle" style="color: var(--brand-blue);"></i> Pertanyaan ${idx + 1}: ${q.text}
          </label>
          <textarea class="lkpd-modul-q-input lkpd-textarea" data-qid="${q.id}" placeholder="Ketikkan analisis ilmiah dan jawaban lengkap Anda disini..." style="width: 100%; min-height: 85px; padding: 10px; font-size: 0.9rem; border-radius: 6px; border: 1px solid var(--glass-border); line-height: 1.5;">${qVal}</textarea>
        </div>
      `;
    });
  }

  container.innerHTML = `
    <div class="glass-panel" style="padding: 28px; border-radius: 12px;">
      
      <!-- LKPD Header -->
      <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 14px; border-bottom: 2px solid var(--glass-border); padding-bottom: 16px; margin-bottom: 20px;">
        <div>
          <span class="badge badge-orange" style="margin-bottom: 6px; display: inline-block;"><i class="fas fa-clipboard-check"></i> FIVIA Digital LKPD</span>
          <h3 style="margin: 0; font-family: 'Poppins', sans-serif; color: var(--text-primary);">Lembar Kerja Peserta Didik: Modul ${mat.id} - ${mat.name}</h3>
          <p style="margin: 4px 0 0 0; font-size: 0.88rem; color: var(--text-secondary);">
            Praktikan: <strong>${user ? user.name : 'Siswa Tamu'}</strong> &bull; Kelas: <strong>Kelas X-1</strong> &bull; Status: <span class="badge ${prevSub ? 'badge-green' : 'badge-blue'}">${prevSub ? 'Sudah Dikirim' : 'Draf Lembar Kerja'}</span>
          </p>
        </div>
        <div style="display: flex; align-items: center; gap: 10px;">
          <span id="lkpd-autosave-indicator" style="font-size: 0.8rem; color: var(--success);"><i class="fas fa-check-circle"></i> Autosave Aktif</span>
          ${lab ? `<button class="btn btn-secondary" onclick="window.location.hash='#lab/${lab.id}'" style="padding: 6px 14px; font-size: 0.85rem;"><i class="fas fa-flask"></i> Buka Full Lab</button>` : ''}
        </div>
      </div>

      <!-- Tujuan Praktikum -->
      <div style="background: rgba(13, 110, 253, 0.05); border-left: 4px solid var(--brand-blue); padding: 14px 18px; border-radius: 0 8px 8px 0; margin-bottom: 24px;">
        <h5 style="color: var(--brand-blue); margin-bottom: 4px;"><i class="fas fa-bullseye"></i> Tujuan Pembelajaran &amp; Eksperimen:</h5>
        <p style="font-size: 0.9rem; line-height: 1.5; color: var(--text-primary); margin: 0;">
          ${lkpdData ? lkpdData.tujuan : 'Memahami konsep fisis serta melakukan pengukuran saintifik dan analisis data hasil percobaan secara terukur.'}
        </p>
      </div>

      <!-- Section 1: Hipotesis -->
      <div style="margin-bottom: 24px;">
        <label for="modul-lkpd-hipotesis" style="display: block; font-weight: 700; font-size: 0.95rem; margin-bottom: 8px; color: var(--brand-orange);">
          <i class="fas fa-lightbulb"></i> 1. Rumusan Masalah &amp; Hipotesis Awal:
        </label>
        <p style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 8px;">
          Tuliskan dugaan atau jawaban sementara Anda mengenai hasil praktikum dan hubungan variabel yang diuji:
        </p>
        <textarea id="modul-lkpd-hipotesis" class="lkpd-textarea" placeholder="Contoh: Saya menduga bahwa mikrometer sekrup memiliki tingkat ketelitian paling tinggi dibanding jangka sorong dan mistar karena..." style="width: 100%; min-height: 90px; padding: 12px; font-size: 0.9rem; border-radius: 8px; border: 1px solid var(--glass-border); line-height: 1.5;">${savedHyp}</textarea>
      </div>

      <!-- Section 2: Data Table -->
      <div style="margin-bottom: 24px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; flex-wrap: wrap; gap: 10px;">
          <div>
            <label style="display: block; font-weight: 700; font-size: 0.95rem; color: var(--success); margin: 0;">
              <i class="fas fa-table"></i> 2. Tabel Data Pengamatan Pengukuran:
            </label>
            <span style="font-size: 0.82rem; color: var(--text-secondary);">Catat objek yang diukur dan nilai pembacaan alat ukur dengan presisi:</span>
          </div>
          <button class="btn btn-secondary" id="btn-add-modul-row" style="padding: 6px 12px; font-size: 0.8rem;"><i class="fas fa-plus"></i> Tambah Baris</button>
        </div>

        <div class="table-responsive">
          <table class="custom-table" id="table-modul-lkpd" style="width: 100%; font-size: 0.88rem; text-align: left;">
            <thead>
              <tr style="background: rgba(16, 185, 129, 0.08);">
                <th style="width: 40px;">No</th>
                <th>Nama Objek / Benda</th>
                <th>Alat Ukur</th>
                <th>Skala Utama (SU)</th>
                <th>Skala Nonius (SN)</th>
                <th>Hasil Ukur (x)</th>
                <th>Ketidakpastian (&Delta;x)</th>
                <th style="width: 60px; text-align: center;">Aksi</th>
              </tr>
            </thead>
            <tbody id="tbody-modul-lkpd">
              ${defaultRowsHtml || `
                <tr class="lkpd-modul-row">
                  <td>1</td>
                  <td><input type="text" class="lkpd-table-input" value="Sampel Uji 1" style="width: 100%; padding: 4px 8px; font-size: 0.85rem; border-radius: 4px; border: 1px solid var(--glass-border);"></td>
                  <td>
                    <select class="lkpd-table-input" style="width: 100%; padding: 4px 8px; font-size: 0.85rem; border-radius: 4px; border: 1px solid var(--glass-border);">
                      <option>Jangka Sorong</option>
                      <option>Mikrometer Sekrup</option>
                      <option>Mistar</option>
                      <option>Neraca Ohaus</option>
                      <option>Stopwatch</option>
                    </select>
                  </td>
                  <td><input type="text" class="lkpd-table-input" value="10.0 mm" style="width: 100%; padding: 4px 8px; font-size: 0.85rem; border-radius: 4px; border: 1px solid var(--glass-border);"></td>
                  <td><input type="text" class="lkpd-table-input" value="0.2 mm" style="width: 100%; padding: 4px 8px; font-size: 0.85rem; border-radius: 4px; border: 1px solid var(--glass-border);"></td>
                  <td><input type="text" class="lkpd-table-input" value="10.2 mm" style="width: 100%; padding: 4px 8px; font-size: 0.85rem; font-weight: bold; border-radius: 4px; border: 1px solid var(--glass-border);"></td>
                  <td><input type="text" class="lkpd-table-input" value="&plusmn; 0.05 mm" style="width: 100%; padding: 4px 8px; font-size: 0.85rem; color: var(--text-secondary); border-radius: 4px; border: 1px solid var(--glass-border);"></td>
                  <td style="text-align: center;"><button class="btn btn-danger btn-del-row" style="padding: 2px 8px; font-size: 0.75rem;"><i class="fas fa-trash"></i></button></td>
                </tr>
              `}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Section 3: Questions -->
      <div style="margin-bottom: 24px;">
        <label style="display: block; font-weight: 700; font-size: 0.95rem; margin-bottom: 12px; color: var(--brand-blue);">
          <i class="fas fa-tasks"></i> 3. Pertanyaan Analisis &amp; Pemecahan Masalah Ilmiah (HOTS):
        </label>
        <div id="modul-lkpd-questions-container">
          ${questionsHtml}
        </div>
      </div>

      <!-- Section 4: Conclusion -->
      <div style="margin-bottom: 28px;">
        <label for="modul-lkpd-kesimpulan" style="display: block; font-weight: 700; font-size: 0.95rem; margin-bottom: 8px; color: var(--accent-violet);">
          <i class="fas fa-pencil-alt"></i> 4. Kesimpulan Akhir Eksperimen:
        </label>
        <p style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 8px;">
          Tuliskan kesimpulan ilmiah yang Anda simpulkan berdasarkan data pengamatan dan teori fisika:
        </p>
        <textarea id="modul-lkpd-kesimpulan" class="lkpd-textarea" placeholder="Tuliskan kesimpulan yang Anda peroleh disini..." style="width: 100%; min-height: 95px; padding: 12px; font-size: 0.9rem; border-radius: 8px; border: 1px solid var(--glass-border); line-height: 1.5;">${savedConc}</textarea>
      </div>

      <!-- LKPD Actions -->
      <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 14px; border-top: 1px solid var(--glass-border); padding-top: 20px;">
        <button class="btn btn-secondary" id="btn-save-draft-modul-lkpd" style="padding: 10px 20px; font-size: 0.9rem;"><i class="fas fa-save"></i> Simpan Draf</button>
        <button class="btn btn-orange" id="btn-submit-modul-lkpd" style="padding: 10px 28px; font-size: 0.95rem; font-weight: bold;"><i class="fas fa-paper-plane"></i> Kirim LKPD ke Guru</button>
      </div>

    </div>
  `;

  // Bind LKPD interactivity & autosave
  bindModulLKPDHandlers(labId, user);
}

// Binds handlers for LKPD embedded in Material Detail
function bindModulLKPDHandlers(labId, user) {
  const tbody = document.getElementById("tbody-modul-lkpd");
  const addBtn = document.getElementById("btn-add-modul-row");
  const saveBtn = document.getElementById("btn-save-draft-modul-lkpd");
  const submitBtn = document.getElementById("btn-submit-modul-lkpd");
  const autosaveInd = document.getElementById("lkpd-autosave-indicator");

  function saveModulLKPDData(showToastMsg = false) {
    if (!user) return;
    
    // Collect answers
    const answersObj = {};
    document.querySelectorAll(".lkpd-modul-q-input").forEach(el => {
      const qid = el.getAttribute("data-qid");
      if (qid) answersObj[qid] = el.value.trim();
    });

    // Collect table rows
    const rows = [];
    document.querySelectorAll(".lkpd-modul-row").forEach(tr => {
      const inputs = tr.querySelectorAll("input, select");
      if (inputs.length >= 6) {
        rows.push({
          objek: inputs[0].value,
          alat: inputs[1].value,
          su: inputs[2].value,
          sn: inputs[3].value,
          hasil: inputs[4].value,
          uncert: inputs[5].value
        });
      }
    });

    const lkpdPayload = {
      studentId: user.id,
      labId: parseInt(labId),
      hypothesis: document.getElementById("modul-lkpd-hipotesis") ? document.getElementById("modul-lkpd-hipotesis").value.trim() : "",
      conclusion: document.getElementById("modul-lkpd-kesimpulan") ? document.getElementById("modul-lkpd-kesimpulan").value.trim() : "",
      observations: rows,
      answers: answersObj,
      status: "pending",
      updatedAt: new Date().toISOString()
    };

    const key = `vlab_autosave_${user.id}_lab_${labId}`;
    localStorage.setItem(key, JSON.stringify(lkpdPayload));

    if (autosaveInd) {
      autosaveInd.innerHTML = '<i class="fas fa-check-circle" style="color: var(--success);"></i> Tersimpan di Draf';
    }

    if (showToastMsg && window.showToast) {
      window.showToast("Draf LKPD Digital berhasil disimpan!");
    }

    return lkpdPayload;
  }

  // Bind input changes
  document.querySelectorAll("#modul-lkpd-hipotesis, #modul-lkpd-kesimpulan, .lkpd-modul-q-input, .lkpd-table-input").forEach(el => {
    el.addEventListener("input", () => saveModulLKPDData(false));
  });

  // Bind add row button
  if (addBtn && tbody) {
    addBtn.onclick = () => {
      const count = tbody.children.length + 1;
      const tr = document.createElement("tr");
      tr.className = "lkpd-modul-row";
      tr.innerHTML = `
        <td>${count}</td>
        <td><input type="text" class="lkpd-table-input" placeholder="Nama Benda" style="width: 100%; padding: 4px 8px; font-size: 0.85rem; border-radius: 4px; border: 1px solid var(--glass-border);"></td>
        <td>
          <select class="lkpd-table-input" style="width: 100%; padding: 4px 8px; font-size: 0.85rem; border-radius: 4px; border: 1px solid var(--glass-border);">
            <option>Jangka Sorong</option>
            <option>Mikrometer Sekrup</option>
            <option>Mistar</option>
            <option>Neraca Ohaus</option>
            <option>Stopwatch</option>
          </select>
        </td>
        <td><input type="text" class="lkpd-table-input" placeholder="SU" style="width: 100%; padding: 4px 8px; font-size: 0.85rem; border-radius: 4px; border: 1px solid var(--glass-border);"></td>
        <td><input type="text" class="lkpd-table-input" placeholder="SN" style="width: 100%; padding: 4px 8px; font-size: 0.85rem; border-radius: 4px; border: 1px solid var(--glass-border);"></td>
        <td><input type="text" class="lkpd-table-input" placeholder="Nilai Akhir" style="width: 100%; padding: 4px 8px; font-size: 0.85rem; font-weight: bold; border-radius: 4px; border: 1px solid var(--glass-border);"></td>
        <td><input type="text" class="lkpd-table-input" placeholder="&plusmn; &Delta;x" style="width: 100%; padding: 4px 8px; font-size: 0.85rem; color: var(--text-secondary); border-radius: 4px; border: 1px solid var(--glass-border);"></td>
        <td style="text-align: center;"><button class="btn btn-danger btn-del-row" style="padding: 2px 8px; font-size: 0.75rem;"><i class="fas fa-trash"></i></button></td>
      `;
      tbody.appendChild(tr);

      // Re-bind delete
      tr.querySelector(".btn-del-row").onclick = () => {
        tr.remove();
        saveModulLKPDData(false);
      };

      tr.querySelectorAll("input, select").forEach(inp => {
        inp.addEventListener("input", () => saveModulLKPDData(false));
      });

      saveModulLKPDData(false);
    };
  }

  // Bind existing delete buttons
  document.querySelectorAll(".btn-del-row").forEach(btn => {
    btn.onclick = (e) => {
      const row = e.target.closest("tr");
      if (row) {
        row.remove();
        saveModulLKPDData(false);
      }
    };
  });

  // Bind Save Draft
  if (saveBtn) {
    saveBtn.onclick = () => saveModulLKPDData(true);
  }

  // Bind Submit
  if (submitBtn) {
    submitBtn.onclick = () => {
      const payload = saveModulLKPDData(false);
      if (!payload) return;

      if (!payload.hypothesis) {
        if (window.showToast) window.showToast("Silakan isi Hipotesis Anda terlebih dahulu!", "warning");
        document.getElementById("modul-lkpd-hipotesis").focus();
        return;
      }

      if (!payload.conclusion) {
        if (window.showToast) window.showToast("Silakan isi Kesimpulan Anda terlebih dahulu!", "warning");
        document.getElementById("modul-lkpd-kesimpulan").focus();
        return;
      }

      payload.status = "submitted";
      window.db.submitLKPD(payload);

      if (window.showToast) {
        window.showToast("Lembar Kerja Siswa (LKPD) berhasil dikirim ke Guru!");
      }
      
      const ind = document.getElementById("lkpd-autosave-indicator");
      if (ind) {
        ind.innerHTML = '<i class="fas fa-check-double" style="color: var(--success);"></i> Berhasil Dikirim ke Guru';
      }
    };
  }
}

// Interactive Physical Quantities game for Modul 2 & Detective
function initBesaranGame(containerId = "besaran-game-placeholder") {
  const container = typeof containerId === "string" ? document.getElementById(containerId) : containerId;
  if (!container) return;

  const items = [
    { name: "Panjang", type: "pokok", unit: "meter (m)", dim: "[L]" },
    { name: "Massa", type: "pokok", unit: "kilogram (kg)", dim: "[M]" },
    { name: "Waktu", type: "pokok", unit: "sekon (s)", dim: "[T]" },
    { name: "Suhu", type: "pokok", unit: "Kelvin (K)", dim: "[&Theta;]" },
    { name: "Kuat Arus", type: "pokok", unit: "Ampere (A)", dim: "[I]" },
    { name: "Intensitas Cahaya", type: "pokok", unit: "candela (cd)", dim: "[J]" },
    { name: "Jumlah Zat", type: "pokok", unit: "mol (mol)", dim: "[N]" },
    { name: "Kecepatan", type: "turunan", unit: "m/s", dim: "[L][T]⁻¹" },
    { name: "Gaya", type: "turunan", unit: "Newton (N = kg·m/s²)", dim: "[M][L][T]⁻²" },
    { name: "Usaha / Energi", type: "turunan", unit: "Joule (J = kg·m²/s²)", dim: "[M][L]²[T]⁻²" },
    { name: "Volume", type: "turunan", unit: "m³", dim: "[L]³" },
    { name: "Percepatan", type: "turunan", unit: "m/s²", dim: "[L][T]⁻²" },
    { name: "Massa Jenis", type: "turunan", unit: "kg/m³", dim: "[M][L]⁻³" },
    { name: "Tekanan", type: "turunan", unit: "Pascal (Pa = N/m²)", dim: "[M][L]⁻¹[T]⁻²" }
  ];

  const shuffledItems = [...items].sort(() => Math.random() - 0.5);

  container.innerHTML = `
    <div class="game-container glass-panel" style="padding: 24px; margin-top: 10px; border: 1px solid var(--glass-border);">
      <h3 style="color: var(--brand-orange); margin-bottom: 8px;"><i class="fas fa-gamepad"></i> Aktivitas Interaktif: Klasifikasikan Besaran &amp; Analisis Dimensi</h3>
      <p style="margin-bottom: 16px; font-size: 0.9rem; line-height: 1.5;">
        Kelompokkan masing-masing besaran di bawah ini ke dalam wadah yang sesuai. Klik tombol <strong>Pokok</strong> atau <strong>Turunan</strong> pada kartu besaran untuk memindahkannya. Klik kembali tombol yang aktif untuk membatalkannya.
      </p>

      <div style="margin-bottom: 20px;">
        <h5 style="margin-bottom: 8px; color: var(--text-secondary);"><i class="fas fa-box-open"></i> Pilihan Besaran (Wadah):</h5>
        <div class="game-pool-zone" style="display: flex; flex-wrap: wrap; gap: 10px; min-height: 80px; padding: 12px; background: rgba(0,0,0,0.03); border-radius: 8px; border: 1px dashed var(--text-secondary);">
          <!-- Dynamic cards -->
        </div>
      </div>

      <div class="game-zones-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
        <!-- Zone 1: Besaran Pokok -->
        <div class="game-zone" style="background: rgba(13, 110, 253, 0.03); border: 2px dashed rgba(13, 110, 253, 0.3); border-radius: 12px; padding: 16px; min-height: 250px;">
          <h4 style="color: var(--brand-blue); text-align: center; margin-bottom: 12px; border-bottom: 1px solid rgba(13, 110, 253, 0.1); padding-bottom: 8px; font-size: 1rem;">
            <i class="fas fa-cube"></i> Besaran Pokok (Base)
          </h4>
          <div class="game-pokok-zone" style="display: flex; flex-wrap: wrap; gap: 8px; justify-content: center; min-height: 180px; align-content: flex-start;">
            <!-- Placed cards -->
          </div>
        </div>

        <!-- Zone 2: Besaran Turunan -->
        <div class="game-zone" style="background: rgba(253, 126, 20, 0.03); border: 2px dashed rgba(253, 126, 20, 0.3); border-radius: 12px; padding: 16px; min-height: 250px;">
          <h4 style="color: var(--brand-orange); text-align: center; margin-bottom: 12px; border-bottom: 1px solid rgba(253, 126, 20, 0.1); padding-bottom: 8px; font-size: 1rem;">
            <i class="fas fa-cogs"></i> Besaran Turunan (Derived)
          </h4>
          <div class="game-turunan-zone" style="display: flex; flex-wrap: wrap; gap: 8px; justify-content: center; min-height: 180px; align-content: flex-start;">
            <!-- Placed cards -->
          </div>
        </div>
      </div>

      <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px; border-top: 1px solid var(--glass-border); padding-top: 16px;">
        <div>
          <span style="font-weight: bold; font-size: 0.9rem;" class="game-score-badge">Kemajuan: 0 / 14 besaran dikelompokkan</span>
        </div>
        <div style="display: flex; gap: 10px;">
          <button class="btn btn-secondary btn-reset-game" style="padding: 8px 16px; font-size: 0.85rem;"><i class="fas fa-undo"></i> Reset</button>
          <button class="btn btn-orange btn-check-game" style="padding: 8px 16px; font-size: 0.85rem;"><i class="fas fa-check-circle"></i> Periksa Jawaban</button>
        </div>
      </div>

      <div class="game-feedback-area" style="margin-top: 16px; padding: 12px; border-radius: 8px; font-weight: bold; text-align: center; font-size: 0.95rem; display: none;">
        <!-- Feedback message -->
      </div>

      <!-- Summary table revealed upon success -->
      <div class="game-summary-table-container" style="display: none; margin-top: 24px; animation: fadeIn 0.4s ease-in-out;">
        <hr style="border: 0; border-top: 1px solid var(--glass-border); margin: 20px 0;">
        <h4 style="color: var(--success); margin-bottom: 12px;"><i class="fas fa-graduation-cap"></i> Konsep Fisika: Satuan Internasional &amp; Dimensi</h4>
        <p style="margin-bottom: 16px; font-size: 0.85rem; color: var(--text-secondary);">
          Hebat! Semua besaran telah dikelompokkan dengan benar. Pelajari satuan SI dan dimensi masing-masing besaran di bawah ini untuk persiapan kuis:
        </p>
        <div class="table-responsive">
          <table class="custom-table" style="font-size: 0.85rem; text-align: left; width: 100%;">
            <thead>
              <tr style="background: rgba(0,0,0,0.05);">
                <th>Nama Besaran</th>
                <th>Tipe</th>
                <th>Satuan SI</th>
                <th>Dimensi</th>
              </tr>
            </thead>
            <tbody class="game-summary-table-body">
              <!-- Filled dynamically -->
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;

  const cardStates = {};
  shuffledItems.forEach(item => {
    cardStates[item.name] = "pool";
  });

  const poolEl = container.querySelector(".game-pool-zone");
  const pokokEl = container.querySelector(".game-pokok-zone");
  const turunanEl = container.querySelector(".game-turunan-zone");
  const badgeEl = container.querySelector(".game-score-badge");
  const feedbackEl = container.querySelector(".game-feedback-area");
  const summaryContainer = container.querySelector(".game-summary-table-container");
  const summaryBody = container.querySelector(".game-summary-table-body");

  function renderAllCards() {
    poolEl.innerHTML = "";
    pokokEl.innerHTML = "";
    turunanEl.innerHTML = "";

    let classifiedCount = 0;

    shuffledItems.forEach(item => {
      const state = cardStates[item.name];
      const card = document.createElement("div");
      card.className = "glass-panel";
      card.style.cssText = "padding: 8px 10px; border-radius: 8px; width: calc(50% - 10px); max-width: 140px; display: flex; flex-direction: column; align-items: center; gap: 6px; box-shadow: 0 2px 4px rgba(0,0,0,0.05); transition: all 0.2s;";
      
      const isPokokActive = state === "pokok";
      const isTurunanActive = state === "turunan";

      if (state !== "pool") {
        classifiedCount++;
        card.style.transform = "scale(0.95)";
      }

      card.innerHTML = `
        <span style="font-weight: 700; font-size: 0.82rem; color: var(--text-primary); text-align: center;">${item.name}</span>
        <div style="display: flex; gap: 4px; width: 100%; justify-content: center;">
          <button class="btn-pokok" style="flex: 1; padding: 2px 4px; font-size: 0.65rem; border-radius: 4px; font-weight: bold; cursor: pointer; border: 1px solid var(--brand-blue); 
            background: ${isPokokActive ? "var(--brand-blue)" : "transparent"}; 
            color: ${isPokokActive ? "#fff" : "var(--brand-blue)"};">Pokok</button>
          <button class="btn-turunan" style="flex: 1; padding: 2px 4px; font-size: 0.65rem; border-radius: 4px; font-weight: bold; cursor: pointer; border: 1px solid var(--brand-orange); 
            background: ${isTurunanActive ? "var(--brand-orange)" : "transparent"}; 
            color: ${isTurunanActive ? "#fff" : "var(--brand-orange)"};">Turunan</button>
        </div>
      `;

      const btnPokok = card.querySelector(".btn-pokok");
      const btnTurunan = card.querySelector(".btn-turunan");

      btnPokok.onclick = (e) => {
        e.stopPropagation();
        if (cardStates[item.name] === "pokok") {
          cardStates[item.name] = "pool";
        } else {
          cardStates[item.name] = "pokok";
        }
        renderAllCards();
      };

      btnTurunan.onclick = (e) => {
        e.stopPropagation();
        if (cardStates[item.name] === "turunan") {
          cardStates[item.name] = "pool";
        } else {
          cardStates[item.name] = "turunan";
        }
        renderAllCards();
      };

      if (state === "pool") {
        poolEl.appendChild(card);
      } else if (state === "pokok") {
        pokokEl.appendChild(card);
      } else if (state === "turunan") {
        turunanEl.appendChild(card);
      }
    });

    if (badgeEl) badgeEl.textContent = `Kemajuan: ${classifiedCount} / ${items.length} besaran dikelompokkan`;
  }

  const checkBtn = container.querySelector(".btn-check-game");
  if (checkBtn) {
    checkBtn.onclick = () => {
      let allClassified = true;
      let correctCount = 0;
      feedbackEl.style.display = "block";

      shuffledItems.forEach(item => {
        const state = cardStates[item.name];
        if (state === "pool") {
          allClassified = false;
        }
        if (state === item.type) {
          correctCount++;
        }
      });

      if (!allClassified) {
        feedbackEl.style.backgroundColor = "rgba(245, 158, 11, 0.15)";
        feedbackEl.style.color = "var(--warning)";
        feedbackEl.textContent = "Silakan tempatkan semua kartu besaran terlebih dahulu!";
        return;
      }

      if (correctCount === items.length) {
        feedbackEl.style.backgroundColor = "rgba(16, 185, 129, 0.15)";
        feedbackEl.style.color = "var(--success)";
        feedbackEl.innerHTML = `<i class="fas fa-check-double"></i> 100% Benar! Kamu berhasil mengelompokkan besaran pokok dan turunan dengan sempurna!`;
        
        summaryBody.innerHTML = "";
        items.forEach(item => {
          const tr = document.createElement("tr");
          tr.innerHTML = `
            <td style="font-weight: 600;">${item.name}</td>
            <td>
              <span class="badge ${item.type === 'pokok' ? 'badge-blue' : 'badge-orange'}">${item.type === 'pokok' ? 'Pokok' : 'Turunan'}</span>
            </td>
            <td style="font-family: monospace;">${item.unit}</td>
            <td style="font-family: monospace; font-weight: bold; color: var(--brand-blue);">${item.dim}</td>
          `;
          summaryBody.appendChild(tr);
        });

        summaryContainer.style.display = "block";
        if (window.showToast) window.showToast("Selamat! Jawaban Anda 100% Benar.");
      } else {
        feedbackEl.style.backgroundColor = "rgba(239, 68, 68, 0.15)";
        feedbackEl.style.color = "var(--danger)";
        feedbackEl.innerHTML = `<i class="fas fa-times-circle"></i> Ada beberapa besaran yang masih salah letak (${correctCount} benar dari ${items.length}). Coba koreksi kembali!`;
      }
    };
  }

  const resetBtn = container.querySelector(".btn-reset-game");
  if (resetBtn) {
    resetBtn.onclick = () => {
      shuffledItems.forEach(item => {
        cardStates[item.name] = "pool";
      });
      feedbackEl.style.display = "none";
      summaryContainer.style.display = "none";
      renderAllCards();
      if (window.showToast) window.showToast("Permainan direset.");
    };
  }

  renderAllCards();
}

// Teacher Dashboard renderer logic
function renderTeacherDashboard() {
  updateHeaderUserBadge();
  const user = window.auth.getCurrentUser();
  if (!user) return;
  
  const classes = window.db.getTable("classes").filter(c => c.teacherId === user.id);
  const classIds = classes.map(c => c.id);
  
  const allStudents = window.db.getTable("students").filter(s => classIds.includes(s.classId));
  const submissions = window.db.getPendingSubmissions(user.id);
  const pendingCount = submissions.filter(s => s.status === "pending").length;

  document.getElementById("teacher-stat-classes").textContent = classes.length;
  document.getElementById("teacher-stat-pending").textContent = pendingCount;
  document.getElementById("teacher-stat-students").textContent = allStudents.length;

  // Render Submissions Table
  const tableBody = document.querySelector("#teacher-submissions-table tbody");
  if (!tableBody) return;
  tableBody.innerHTML = "";

  if (submissions.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: var(--text-secondary);">Belum ada pengumpulan LKPD dari siswa.</td></tr>`;
    return;
  }

  submissions.forEach(sub => {
    const row = document.createElement("tr");
    const formattedDate = new Date(sub.timestamp).toLocaleDateString("id-ID", { hour: '2-digit', minute: '2-digit' });
    
    row.innerHTML = `
      <td style="font-weight: 600;">${sub.studentName}</td>
      <td>${sub.className}</td>
      <td>${sub.labName}</td>
      <td>${formattedDate}</td>
      <td>
        <span class="badge ${sub.status === "graded" ? "badge-success" : "badge-warning"}">
          ${sub.status === "graded" ? "Dinilai" : "Butuh Dinilai"}
        </span>
      </td>
      <td style="font-weight: 700; font-family: monospace;">${sub.score !== undefined ? sub.score : "-"}</td>
      <td>
        <button class="btn btn-primary btn-grade" style="padding: 6px 12px; font-size: 0.8rem;" 
                data-student="${sub.studentId}" data-lab="${sub.labId}">
          ${sub.status === "graded" ? "Edit Nilai" : "Koreksi"}
        </button>
      </td>
    `;
    tableBody.appendChild(row);
  });

  // Binds grade buttons
  tableBody.querySelectorAll(".btn-grade").forEach(btn => {
    btn.addEventListener("click", () => {
      const studentId = btn.getAttribute("data-student");
      const labId = btn.getAttribute("data-lab");
      openGradingModal(studentId, labId);
    });
  });
}

function openGradingModal(studentId, labId) {
  const sub = window.db.getLKPDSubmission(studentId, labId);
  const students = window.db.getTable("students");
  const student = students.find(s => s.id === studentId);
  const lab = window.db.getTable("labs").find(l => l.id === parseInt(labId));
  
  if (!sub || !student || !lab) return;

  document.getElementById("grade-student-id").value = studentId;
  document.getElementById("grade-lab-id").value = labId;
  document.getElementById("grading-score").value = sub.score !== undefined ? sub.score : "";
  document.getElementById("grading-feedback").value = sub.feedback || "";

  document.getElementById("grading-meta-info").innerHTML = `
    <strong>Siswa:</strong> ${student.name} | <strong>Eksperimen:</strong> ${lab.name}<br>
    <strong>Waktu Kirim:</strong> ${new Date(sub.timestamp).toLocaleString("id-ID")}
  `;

  // Render questions and student answers
  const previewContainer = document.getElementById("grading-answers-preview");
  previewContainer.innerHTML = "";

  if (parseInt(labId) === 2) {
    const progress = sub.answers;
    let html = `
      <div class="glass-panel" style="padding: 16px; margin-bottom: 20px; border-left: 4px solid var(--brand-orange);">
        <h5 style="color: var(--brand-orange); margin-bottom: 8px;"><i class="fas fa-search"></i> Misi 4: Hasil Pengukuran FIVIA Virtual Lab</h5>
    `;
    if (progress.dataMisi4 && progress.dataMisi4.length > 0) {
      html += `
        <table class="lkpd-obs-table" style="margin-bottom: 12px; width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="background-color: rgba(0,0,0,0.02); text-align: left;">
              <th style="padding: 8px; font-size: 0.8rem;">Alat Ukur</th>
              <th style="padding: 8px; font-size: 0.8rem;">Nilai Target</th>
              <th style="padding: 8px; font-size: 0.8rem;">Hasil Siswa</th>
              <th style="padding: 8px; font-size: 0.8rem;">Evaluasi</th>
            </tr>
          </thead>
          <tbody>
      `;
      progress.dataMisi4.forEach(row => {
        html += `
          <tr style="border-bottom: 1px solid var(--glass-border);">
            <td style="padding: 8px; font-size: 0.85rem;"><strong>${row.alat}</strong></td>
            <td style="padding: 8px; font-size: 0.85rem; font-family: monospace;">${row.target}</td>
            <td style="padding: 8px; font-size: 0.85rem; font-family: monospace;">${row.siswa}</td>
            <td style="padding: 8px; font-size: 0.85rem;"><span class="badge ${row.status === 'Benar' ? 'badge-success' : 'badge-danger'}">${row.status === 'Benar' ? 'BENAR' : 'SALAH'}</span></td>
          </tr>
        `;
      });
      html += `</tbody></table>`;
    } else {
      html += `<p style="font-style: italic;">Belum ada data Misi 4.</p>`;
    }
    
    html += `
      </div>
      <div class="glass-panel" style="padding: 16px; margin-bottom: 20px; border-left: 4px solid var(--brand-blue);">
        <h5 style="color: var(--brand-blue); margin-bottom: 8px;"><i class="fas fa-vial"></i> Misi 7: Analisis Pengukuran Terpadu (Balok Kuningan)</h5>
    `;
    if (progress.dataMisi7 && progress.dataMisi7.panjang) {
      const d7 = progress.dataMisi7;
      html += `
        <ul style="font-size: 0.9rem; line-height: 1.6; margin-bottom: 12px; padding-left: 20px;">
          <li>Panjang (Mistar) = <strong>${d7.panjang} cm</strong></li>
          <li>Lebar (Jangka Sorong) = <strong>${d7.lebar} cm</strong></li>
          <li>Tebal (Mikrometer Sekrup) = <strong>${d7.tebal} cm</strong></li>
          <li>Massa Balok = <strong>${d7.massa} gram</strong></li>
          <li>Volume Balok = <strong>${d7.volume} cm³</strong></li>
          <li>Massa Jenis Balok = <strong>${d7.massJenis} g/cm³</strong></li>
        </ul>
      `;
    } else {
      html += `<p style="font-style: italic;">Belum ada data Misi 7.</p>`;
    }
    html += `</div>`;
    
    html += `
      <div style="margin-bottom: 16px;">
        <h5 style="color: var(--brand-orange); margin-bottom: 4px;">Hipotesis Siswa:</h5>
        <p style="font-style: italic; background-color: var(--bg-primary); padding: 10px; border-radius: 6px; margin: 0;">${progress.hipotesis || "Tidak ada hipotesis."}</p>
      </div>
      <div style="margin-bottom: 16px;">
        <h5 style="color: var(--brand-blue); margin-bottom: 4px;">Analisis & Kesimpulan Siswa:</h5>
        <p style="font-style: italic; background-color: var(--bg-primary); padding: 10px; border-radius: 6px; margin: 0;">${progress.kesimpulan || "Tidak ada kesimpulan."}</p>
      </div>
      <div style="margin-bottom: 16px;">
        <h5 style="color: var(--brand-orange); margin-bottom: 4px;">Refleksi Siswa:</h5>
        <p style="font-style: italic; background-color: var(--bg-primary); padding: 10px; border-radius: 6px; margin: 0;">${progress.refleksi || "Tidak ada refleksi."}</p>
      </div>
    `;
    
    previewContainer.innerHTML = html;
    window.openModal("grade-lkpd-modal");
    return;
  }

  // Render observations first if any
  if (sub.observations && sub.observations.length > 0) {
    let obsHtml = `<h5 style="margin-bottom: 8px; color: var(--brand-blue);">Tabel Hasil Pengukuran Siswa:</h5>
      <table class="lkpd-obs-table" style="margin-bottom: 20px;">
        <thead>
          <tr>`;
    // headers
    Object.keys(sub.observations[0]).forEach(k => {
      obsHtml += `<th>${k}</th>`;
    });
    obsHtml += `</tr></thead><tbody>`;
    // rows
    sub.observations.forEach(row => {
      obsHtml += `<tr>`;
      Object.values(row).forEach(val => {
        obsHtml += `<td>${val}</td>`;
      });
      obsHtml += `</tr>`;
    });
    obsHtml += `</tbody></table>`;
    previewContainer.innerHTML += obsHtml;
  }

  // Hypothesis
  previewContainer.innerHTML += `
    <div style="margin-bottom: 16px;">
      <h5 style="color: var(--brand-orange); margin-bottom: 4px;">Hipotesis Siswa:</h5>
      <p style="font-style: italic; background-color: var(--bg-primary); padding: 10px; border-radius: 6px;">${sub.hypothesis || "Tidak ada hipotesis."}</p>
    </div>
  `;

  // Questions
  const lkpdObj = window.db.getLKPDForLab(labId);
  let qHtml = `<h5 style="color: var(--brand-blue); margin-bottom: 8px;">Tanya Jawab LKPD:</h5>`;
  lkpdObj.pertanyaan.forEach(q => {
    const ans = sub.answers.find(a => a.questionId === q.id);
    qHtml += `
      <div style="margin-bottom: 12px; border-bottom: 1px solid var(--glass-border); padding-bottom: 8px;">
        <span style="font-weight: 600; font-size: 0.85rem; display: block;">Pertanyaan: ${q.text}</span>
        <span style="font-size: 0.9rem; display: block; margin-top: 4px; padding-left: 8px; border-left: 3px solid var(--brand-orange);">
          ${ans ? ans.answerText : "<i>Belum dijawab.</i>"}
        </span>
      </div>
    `;
  });

  // Conclusion
  qHtml += `
    <div style="margin-top: 16px;">
      <h5 style="color: var(--brand-orange); margin-bottom: 4px;">Kesimpulan Siswa:</h5>
      <p style="font-style: italic; background-color: var(--bg-primary); padding: 10px; border-radius: 6px;">${sub.conclusion || "Tidak ada kesimpulan."}</p>
    </div>
  `;

  previewContainer.innerHTML += qHtml;
  window.openModal("grade-lkpd-modal");
}

// Teacher class management screen renderer logic
function renderClassManagement() {
  const user = window.auth.getCurrentUser();
  if (!user || user.role !== "guru") return;
  
  const classes = window.db.getTable("classes").filter(c => c.teacherId === user.id);
  const classIds = classes.map(c => c.id);
  
  let students = window.db.getTable("students").filter(s => classIds.includes(s.classId));

  // Apply search/filters
  const searchVal = document.getElementById("search-student").value.toLowerCase().trim();
  const classVal = document.getElementById("filter-class").value;

  if (searchVal) {
    students = students.filter(s => s.name.toLowerCase().includes(searchVal) || s.email.toLowerCase().includes(searchVal));
  }
  
  if (classVal) {
    students = students.filter(s => s.classId === classVal);
  }

  const tableBody = document.querySelector("#class-students-table tbody");
  if (!tableBody) return;
  tableBody.innerHTML = "";

  if (students.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: var(--text-secondary);">Tidak ada data siswa ditemukan.</td></tr>`;
    return;
  }

  students.forEach(s => {
    const classObj = classes.find(c => c.id === s.classId);
    const row = document.createElement("tr");
    row.innerHTML = `
      <td style="font-family: monospace;">${s.id}</td>
      <td style="font-weight: 600;">${s.name}</td>
      <td>${s.email}</td>
      <td><span class="badge badge-blue">${classObj ? classObj.name : "Unassigned"}</span></td>
      <td>
        <button class="btn btn-outline btn-delete-student" style="padding: 4px 8px; font-size: 0.75rem; border-color: var(--danger); color: var(--danger);" 
                data-id="${s.id}"><i class="fas fa-trash"></i> Hapus</button>
      </td>
    `;
    tableBody.appendChild(row);
  });

  // Binds delete buttons
  tableBody.querySelectorAll(".btn-delete-student").forEach(btn => {
    btn.addEventListener("click", () => {
      const stdId = btn.getAttribute("data-id");
      if (confirm("Apakah Anda yakin ingin menghapus siswa ini dari kelas?")) {
        deleteStudent(stdId);
      }
    });
  });
}

function deleteStudent(studentId) {
  let students = window.db.getTable("students");
  students = students.filter(s => s.id !== studentId);
  window.db.saveTable("students", students);

  let users = window.db.getTable("users");
  users = users.filter(u => u.id !== studentId);
  window.db.saveTable("users", users);

  window.showToast("Siswa berhasil dihapus.");
  renderClassManagement();
}

// Teacher Reports page generator logic
function renderTeacherReports() {
  const user = window.auth.getCurrentUser();
  if (!user || user.role !== "guru") return;
  
  const classVal = document.getElementById("report-class-select").value;
  const classes = window.db.getTable("classes");
  const classObj = classes.find(c => c.id === classVal);
  
  const students = window.db.getTable("students").filter(s => s.classId === classVal);
  const submissions = window.db.getTable("submissions");
  const quizScores = window.db.getTable("quizScores");
  const certificates = window.db.getTable("certificates");

  const tableBody = document.querySelector("#reports-summary-table tbody");
  if (!tableBody) return;
  tableBody.innerHTML = "";

  if (students.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--text-secondary);">Tidak ada data siswa pada kelas ini.</td></tr>`;
    return;
  }

  students.forEach(s => {
    // Calc LKPD average
    const stdSubs = submissions.filter(sub => sub.studentId === s.id && sub.score !== undefined);
    const lkpdAvg = stdSubs.length > 0 ? Math.round(stdSubs.reduce((acc, curr) => acc + curr.score, 0) / stdSubs.length) : 0;
    
    // Calc Quiz average
    const stdQuizzes = quizScores.filter(q => q.userId === s.id);
    const quizAvg = stdQuizzes.length > 0 ? Math.round(stdQuizzes.reduce((acc, curr) => acc + curr.score, 0) / stdQuizzes.length) : 0;

    // Certs claimed count
    const certCount = certificates.filter(c => c.userId === s.id).length;

    // Predicate logic
    const overallAvg = Math.round((lkpdAvg + quizAvg) / 2);
    let predicate = "Kurang";
    let badgeClass = "badge-danger";
    if (overallAvg >= 85) { predicate = "Sangat Baik"; badgeClass = "badge-success"; }
    else if (overallAvg >= 75) { predicate = "Baik"; badgeClass = "badge-blue"; }
    else if (overallAvg >= 60) { predicate = "Cukup"; badgeClass = "badge-warning"; }

    const row = document.createElement("tr");
    row.innerHTML = `
      <td style="font-weight: 600;">${s.name}</td>
      <td>${classObj ? classObj.name.substring(6, 7) : "E/F"}</td>
      <td style="font-family: monospace; font-weight: bold;">${lkpdAvg}</td>
      <td style="font-family: monospace; font-weight: bold;">${quizAvg}</td>
      <td><span class="badge badge-success"><i class="fas fa-medal"></i> ${certCount}</span></td>
      <td><span class="badge ${badgeClass}">${predicate}</span></td>
    `;
    tableBody.appendChild(row);
  });
}

// Student Certificates claimed list page renderer
function renderCertificatesList() {
  const user = window.auth.getCurrentUser();
  if (!user) return;

  const certs = window.db.getCertificatesForUser(user.id);
  const grid = document.getElementById("certificates-grid");
  if (!grid) return;
  grid.innerHTML = "";

  if (certs.length === 0) {
    grid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--text-secondary);"><i class="fas fa-certificate" style="font-size: 3rem; margin-bottom: 12px; color: #cbd5e1;"></i><br>Anda belum memperoleh sertifikat kelulusan. Selesaikan evaluasi kuis dengan nilai &ge; 75% untuk mendapatkan sertifikat.</div>`;
    return;
  }

  certs.forEach(c => {
    const card = document.createElement("div");
    card.className = "glass-panel course-card glass-panel-hover";
    card.innerHTML = `
      <div class="course-header">
        <span class="course-fase">Fase ${c.fase}</span>
        <span class="badge badge-success"><i class="fas fa-check-circle"></i> Terverifikasi</span>
      </div>
      <div>
        <h4 class="course-title">${c.materialName}</h4>
        <p class="course-desc" style="font-family: monospace; font-size: 0.8rem;">Kode: ${c.code}<br>Terbit: ${c.date}</p>
      </div>
      <div class="course-footer" style="margin-top: 10px;">
        <button class="btn btn-orange btn-view-cert" data-id="${c.id}" style="width: 100%;"><i class="fas fa-eye"></i> Cetak Sertifikat</button>
      </div>
    `;
    grid.appendChild(card);
  });

  // Binds view cert buttons
  grid.querySelectorAll(".btn-view-cert").forEach(btn => {
    btn.addEventListener("click", () => {
      const certId = btn.getAttribute("data-id");
      openCertificateViewer(certId);
    });
  });
}

function openCertificateViewer(certId) {
  const certs = window.db.getTable("certificates");
  const c = certs.find(item => item.id === certId);
  const user = window.auth.getCurrentUser();
  const materials = window.db.getTable("materials");
  
  if (!c || !user) return;
  
  const mat = materials.find(m => m.id === c.materialId);

  document.getElementById("cert-recipient-name").textContent = user.name;
  document.getElementById("cert-subject-title").textContent = mat ? `${mat.name} (Fase ${mat.fase})` : "Fisika Kurikulum Merdeka";
  document.getElementById("cert-date-issued").textContent = c.date;
  document.getElementById("cert-qr-text").innerHTML = `VERIFIED<br>${c.code}`;

  const overlay = document.getElementById("certificate-print-overlay");
  if (overlay) {
    overlay.classList.remove("hidden-section");
    
    // Close button trigger
    const closeBtn = document.getElementById("btn-close-cert-viewer");
    if (closeBtn) {
      closeBtn.onclick = () => {
        overlay.classList.add("hidden-section");
      };
    }
  }
}

// Map globals
window.renderStudentDashboard = renderStudentDashboard;
window.renderTeacherDashboard = renderTeacherDashboard;
window.renderClassManagement = renderClassManagement;
window.renderTeacherReports = renderTeacherReports;
window.renderMaterialsList = renderMaterialsList;
window.renderMaterialDetail = renderMaterialDetail;
window.renderCertificatesList = renderCertificatesList;
