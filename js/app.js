/**
 * app.js
 * Main Single Page Application (SPA) Router, Navigation and UI Manager
 */

document.addEventListener("DOMContentLoaded", () => {
  // Check auth state and initialize layout
  initApp();
});

function initApp() {
  // Listen for hash changes
  window.addEventListener("hashchange", handleRouting);
  
  // Listen for auth state alterations
  window.addEventListener("authChange", () => {
    updateLayoutForUser();
    handleRouting();
  });

  // Setup Global Themes
  initTheme();

  // Load UI interactive events (Modals, sidebar toggler)
  initUIEvents();

  // Initial layout update and routing
  updateLayoutForUser();
  handleRouting();
}

// Themes (Dark / Light)
function initTheme() {
  const savedTheme = localStorage.getItem("vlab_theme") || "light";
  document.documentElement.setAttribute("data-theme", savedTheme);
  
  const themeSwitch = document.querySelector(".theme-switch");
  if (themeSwitch) {
    themeSwitch.addEventListener("click", () => {
      const currentTheme = document.documentElement.getAttribute("data-theme");
      const newTheme = currentTheme === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", newTheme);
      localStorage.setItem("vlab_theme", newTheme);
      
      // Update icon
      const icon = themeSwitch.querySelector("i");
      if (icon) {
        icon.className = newTheme === "dark" ? "fas fa-sun" : "fas fa-moon";
      }
    });
  }
}

// Sidebars & Header state management based on user role
function updateLayoutForUser() {
  const user = window.auth.getCurrentUser();
  const sidebar = document.querySelector("aside.sidebar");
  const mainContent = document.getElementById("main-content");
  
  // Update header badge
  if (window.updateHeaderUserBadge) {
    window.updateHeaderUserBadge();
  }
  
  if (!user) {
    // Guest layout
    if (sidebar) {
      sidebar.classList.add("hidden-section");
      sidebar.classList.remove("hidden-desktop");
      sidebar.classList.remove("active");
    }
    if (mainContent) mainContent.classList.add("expanded");
  } else {
    // Authenticated layout
    if (sidebar) {
      sidebar.classList.remove("hidden-section");
      sidebar.classList.add("hidden-desktop");
      sidebar.classList.remove("active");
      
      // Render specific menu options
      const menuContainer = sidebar.querySelector(".sidebar-menu");
      if (menuContainer) {
        menuContainer.innerHTML = getMenuForRole(user.role);
      }
      
      // Update User details
      const nameEl = sidebar.querySelector(".sidebar-user-name");
      const roleEl = sidebar.querySelector(".sidebar-user-role");
      const avatarEl = sidebar.querySelector(".sidebar-user-avatar");
      
      if (nameEl) nameEl.textContent = user.name;
      if (roleEl) roleEl.textContent = user.role === "guru" ? "Guru Fisika" : user.role === "siswa" ? "Siswa SMA" : "Administrator";
      if (avatarEl) avatarEl.textContent = user.name.split(" ").map(w => w[0]).join("").substring(0, 2).toUpperCase();
    }
    if (mainContent) mainContent.classList.add("expanded");
  }
}

function getMenuForRole(role) {
  let menuHtml = '';
  if (role === "siswa") {
    menuHtml = `
      <li class="sidebar-menu-item" id="menu-siswa-dashboard"><a href="#dashboard"><i class="fas fa-home"></i> <span>Beranda</span></a></li>
      <li class="sidebar-menu-item" id="menu-materi"><a href="#materi"><i class="fas fa-book-open"></i> <span>Materi & Lab</span></a></li>
      <li class="sidebar-menu-item" id="menu-siswa-sertifikat"><a href="#sertifikat"><i class="fas fa-award"></i> <span>Sertifikat</span></a></li>
    `;
  } else if (role === "guru") {
    menuHtml = `
      <li class="sidebar-menu-item" id="menu-guru-dashboard"><a href="#dashboard"><i class="fas fa-tachometer-alt"></i> <span>Dashboard Guru</span></a></li>
      <li class="sidebar-menu-item" id="menu-guru-generator"><a href="#generator"><i class="fas fa-wand-magic-sparkles" style="color: #a855f7;"></i> <span>✨ Generator AI & Sumber Belajar</span></a></li>
      <li class="sidebar-menu-item" id="menu-guru-group-play"><a href="#quest/group-play"><i class="fas fa-users-line" style="color: var(--fq-cyan);"></i> <span>👥 Group Play</span></a></li>
      <li class="sidebar-menu-item" id="menu-materi"><a href="#materi"><i class="fas fa-book-open"></i> <span>Materi & Lab</span></a></li>
      <li class="sidebar-menu-item" id="menu-guru-kelas"><a href="#kelas"><i class="fas fa-users"></i> <span>Manajemen Kelas</span></a></li>
      <li class="sidebar-menu-item" id="menu-guru-laporan"><a href="#laporan"><i class="fas fa-file-pdf"></i> <span>Laporan Nilai</span></a></li>
    `;
  } else if (role === "admin") {
    menuHtml = `
      <li class="sidebar-menu-item" id="menu-admin-dashboard"><a href="#dashboard"><i class="fas fa-user-shield"></i> <span>Admin Control</span></a></li>
      <li class="sidebar-menu-item" id="menu-materi"><a href="#materi"><i class="fas fa-book-open"></i> <span>Materi & Lab</span></a></li>
    `;
  }
  return menuHtml;
}

// UI Interactive Bindings
function initUIEvents() {
  // Sidebar Toggler
  const toggleBtn = document.querySelector(".header-toggle-sidebar");
  const sidebar = document.querySelector("aside.sidebar");
  const mainContent = document.getElementById("main-content");
  
  if (toggleBtn && sidebar && mainContent) {
    toggleBtn.addEventListener("click", () => {
      if (window.innerWidth > 992) {
        sidebar.classList.toggle("hidden-desktop");
        mainContent.classList.toggle("expanded");
      } else {
        sidebar.classList.toggle("active");
      }
    });
  }

  // Header Logout Button Trigger
  const headerLogoutBtn = document.getElementById("btn-header-logout");
  if (headerLogoutBtn) {
    headerLogoutBtn.addEventListener("click", () => {
      window.auth.logout();
      window.showToast("Anda telah keluar dari aplikasi.");
      window.location.hash = "#landing";
    });
  }

  // Modals buttons triggers
  document.querySelectorAll(".btn-open-login").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      openModal("login-modal");
    });
  });

  document.querySelectorAll(".btn-open-register").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      openModal("register-modal");
    });
  });

  document.querySelectorAll(".modal-overlay, .modal-close").forEach(el => {
    el.addEventListener("click", (e) => {
      if (e.target.classList.contains("modal-overlay") || e.target.classList.contains("modal-close") || e.target.closest(".modal-close")) {
        closeAllModals();
      }
    });
  });
}

function openModal(modalId) {
  closeAllModals();
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add("active");
  }
}

function closeAllModals() {
  document.querySelectorAll(".modal-overlay").forEach(m => m.classList.remove("active"));
}

// Routing Engine
function handleRouting() {
  const hash = window.location.hash || "#landing";
  const user = window.auth.getCurrentUser();
  
  // Clean active states on sidebar
  document.querySelectorAll(".sidebar-menu-item").forEach(item => item.classList.remove("active"));
  
  // Hide all section pages
  document.querySelectorAll(".spa-section").forEach(sec => sec.classList.add("hidden-section"));
  
  // Helper to highlight sidebar menu items
  const highlightSidebar = (menuId) => {
    const el = document.getElementById(menuId);
    if (el) el.classList.add("active");
  };

  // Auth Guards (Allow #quest for both guests & logged in users)
  if (hash !== "#landing" && !hash.startsWith("#quest") && !user) {
    // Redirect anonymous to landing
    window.location.hash = "#landing";
    return;
  }

  // Route Definitions
  if (hash.startsWith("#quest")) {
    highlightSidebar("menu-quest");
    const questSec = document.getElementById("fivia-quest-section");
    if (questSec) questSec.classList.remove("hidden-section");
    if (window.FIVIAQuest && window.FIVIAQuest.handleSubRouting) {
      window.FIVIAQuest.handleSubRouting(hash);
    }
  }

  else if (hash === "#landing" || hash === "#home") {
    if (user) {
      window.location.hash = "#dashboard";
      return;
    }
    document.getElementById("landing-section").classList.remove("hidden-section");
  } 
  
  else if (hash === "#dashboard") {
    if (user.role === "siswa") {
      highlightSidebar("menu-siswa-dashboard");
      document.getElementById("student-dashboard-section").classList.remove("hidden-section");
      if (window.renderStudentDashboard) window.renderStudentDashboard();
    } else if (user.role === "guru") {
      highlightSidebar("menu-guru-dashboard");
      document.getElementById("teacher-dashboard-section").classList.remove("hidden-section");
      if (window.renderTeacherDashboard) window.renderTeacherDashboard();
    } else {
      document.getElementById("admin-dashboard-section").classList.remove("hidden-section");
      if (window.renderAdminDashboard) window.renderAdminDashboard();
    }
  } 
  
  else if (hash === "#materi") {
    highlightSidebar("menu-materi");
    document.getElementById("materi-list-section").classList.remove("hidden-section");
    if (window.renderMaterialsList) window.renderMaterialsList();
  } 
  
  else if (hash.startsWith("#materi/")) {
    highlightSidebar("menu-materi");
    const matId = hash.split("/")[1];
    document.getElementById("materi-detail-section").classList.remove("hidden-section");
    if (window.renderMaterialDetail) window.renderMaterialDetail(matId);
  } 
  
  else if (hash.startsWith("#lab/")) {
    highlightSidebar("menu-materi");
    const labId = hash.split("/")[1];
    document.getElementById("lab-viewport-section").classList.remove("hidden-section");
    if (window.renderLab) window.renderLab(labId);
  }

  else if (hash === "#detektif") {
    highlightSidebar("menu-materi");
    document.getElementById("detektif-section").classList.remove("hidden-section");
    if (window.initDetektifDashboard) window.initDetektifDashboard();
  }

  else if (hash.startsWith("#detektif/misi/")) {
    highlightSidebar("menu-materi");
    const missionId = parseInt(hash.split("/")[2]);
    document.getElementById("detektif-section").classList.remove("hidden-section");
    if (window.playDetektifMission) window.playDetektifMission(missionId);
  }
  
  else if (hash.startsWith("#quiz/")) {
    highlightSidebar("menu-materi");
    const matId = hash.split("/")[1];
    document.getElementById("quiz-section").classList.remove("hidden-section");
    if (window.renderQuiz) window.renderQuiz(matId);
  }

  else if (hash === "#sertifikat") {
    highlightSidebar("menu-siswa-sertifikat");
    document.getElementById("certificates-list-section").classList.remove("hidden-section");
    if (window.renderCertificatesList) window.renderCertificatesList();
  }

  else if (hash === "#generator") {
    if (user.role !== "guru") { window.location.hash = "#dashboard"; return; }
    highlightSidebar("menu-guru-generator");
    const genSection = document.getElementById("generator-section");
    if (genSection) genSection.classList.remove("hidden-section");
  }

  else if (hash === "#kelas") {
    if (user.role !== "guru") { window.location.hash = "#dashboard"; return; }
    highlightSidebar("menu-guru-kelas");
    document.getElementById("class-management-section").classList.remove("hidden-section");
    if (window.renderClassManagement) window.renderClassManagement();
  }

  else if (hash === "#laporan") {
    if (user.role !== "guru") { window.location.hash = "#dashboard"; return; }
    highlightSidebar("menu-guru-laporan");
    document.getElementById("teacher-reports-section").classList.remove("hidden-section");
    if (window.renderTeacherReports) window.renderTeacherReports();
  }
  
  else {
    // 404 fallback
    window.location.hash = user ? "#dashboard" : "#landing";
  }
  
  // Collapse sidebar on small screens after routing
  if (window.innerWidth <= 992 && sidebar) {
    sidebar.classList.remove("active");
  }
  
  // Scroll to top
  window.scrollTo(0, 0);
}

// Global Toast Notification Helper
function showToast(message, type = "success") {
  const container = document.getElementById("toast-holder");
  if (!container) return;
  
  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  
  let icon = "fa-check-circle";
  if (type === "warning") icon = "fa-exclamation-triangle";
  if (type === "danger") icon = "fa-exclamation-circle";
  
  toast.innerHTML = `
    <i class="fas ${icon}"></i>
    <span>${message}</span>
  `;
  
  container.appendChild(toast);
  
  // Remove toast after 4s
  setTimeout(() => {
    toast.style.animation = "slideIn 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55) reverse";
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 4000);
}

window.showToast = showToast;
window.openModal = openModal;
window.closeAllModals = closeAllModals;
