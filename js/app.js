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

// Sidebars, Header, and Bottom Navigation state management based on user role
function updateLayoutForUser() {
  const user = window.auth ? window.auth.getCurrentUser() : null;
  const sidebar = document.querySelector("aside.sidebar");
  const mainContent = document.getElementById("main-content");
  const bottomNav = document.getElementById("mobile-bottom-nav");
  
  // Update header badge
  if (window.updateHeaderUserBadge) {
    window.updateHeaderUserBadge();
  }
  
  // Update mobile bottom navigation
  if (bottomNav) {
    bottomNav.innerHTML = getBottomNavForRole(user ? user.role : null);
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
      <li class="sidebar-menu-item" id="menu-guru-periksa-lkpd"><a href="#periksa-lkpd"><i class="fas fa-clipboard-check" style="color: #10b981;"></i> <span>Periksa LKPD Siswa</span></a></li>
      <li class="sidebar-menu-item" id="menu-guru-generator"><a href="#generator"><i class="fas fa-wand-magic-sparkles" style="color: #a855f7;"></i> <span>✨ Generator AI & Sumber Belajar</span></a></li>
      <li class="sidebar-menu-item" id="menu-guru-group-play"><a href="#quest/group-play"><i class="fas fa-users-line" style="color: var(--fq-cyan);"></i> <span>👥 Group Play</span></a></li>
      <li class="sidebar-menu-item" id="menu-materi"><a href="#materi"><i class="fas fa-book-open"></i> <span>Materi & Lab</span></a></li>
      <li class="sidebar-menu-item" id="menu-guru-kelas"><a href="#kelas"><i class="fas fa-users"></i> <span>Manajemen Kelas</span></a></li>
      <li class="sidebar-menu-item" id="menu-guru-laporan"><a href="#laporan"><i class="fas fa-file-pdf"></i> <span>Laporan Nilai</span></a></li>
      <li class="sidebar-menu-item" id="menu-guru-management"><a href="#manajemen-guru"><i class="fas fa-chalkboard-teacher" style="color: #3b82f6;"></i> <span>Manajemen Guru</span></a></li>
    `;
  } else if (role === "admin") {
    menuHtml = `
      <li class="sidebar-menu-item" id="menu-admin-dashboard"><a href="#dashboard"><i class="fas fa-user-shield"></i> <span>Admin Control</span></a></li>
      <li class="sidebar-menu-item" id="menu-guru-management"><a href="#manajemen-guru"><i class="fas fa-chalkboard-teacher" style="color: #3b82f6;"></i> <span>Manajemen Guru</span></a></li>
      <li class="sidebar-menu-item" id="menu-materi"><a href="#materi"><i class="fas fa-book-open"></i> <span>Materi & Lab</span></a></li>
    `;
  }
  return menuHtml;
}

// Mobile and Tablet Bottom Navigation Bar Templates
function getBottomNavForRole(role) {
  if (role === "siswa") {
    return `
      <a href="#dashboard" class="mobile-bottom-nav-item" data-route="dashboard">
        <i class="fas fa-home"></i>
        <span>Beranda</span>
      </a>
      <a href="#materi" class="mobile-bottom-nav-item" data-route="materi">
        <i class="fas fa-book-open"></i>
        <span>Materi</span>
      </a>
      <a href="#quest" class="mobile-bottom-nav-item" data-route="quest">
        <i class="fas fa-gamepad"></i>
        <span>Quest</span>
      </a>
      <a href="#sertifikat" class="mobile-bottom-nav-item" data-route="sertifikat">
        <i class="fas fa-award"></i>
        <span>Sertifikat</span>
      </a>
      <button type="button" class="mobile-bottom-nav-item" id="btn-bottom-menu-toggle" onclick="window.toggleSidebar()">
        <i class="fas fa-bars"></i>
        <span>Menu</span>
      </button>
    `;
  } else if (role === "guru") {
    return `
      <a href="#dashboard" class="mobile-bottom-nav-item" data-route="dashboard">
        <i class="fas fa-tachometer-alt"></i>
        <span>Dashboard</span>
      </a>
      <a href="#periksa-lkpd" class="mobile-bottom-nav-item" data-route="periksa-lkpd">
        <i class="fas fa-clipboard-check"></i>
        <span>LKPD</span>
      </a>
      <a href="#generator" class="mobile-bottom-nav-item" data-route="generator">
        <i class="fas fa-wand-magic-sparkles"></i>
        <span>AI Guru</span>
      </a>
      <a href="#quest/group-play" class="mobile-bottom-nav-item" data-route="quest">
        <i class="fas fa-users-line"></i>
        <span>Group Play</span>
      </a>
      <button type="button" class="mobile-bottom-nav-item" id="btn-bottom-menu-toggle" onclick="window.toggleSidebar()">
        <i class="fas fa-bars"></i>
        <span>Menu</span>
      </button>
    `;
  } else if (role === "admin") {
    return `
      <a href="#dashboard" class="mobile-bottom-nav-item" data-route="dashboard">
        <i class="fas fa-user-shield"></i>
        <span>Admin</span>
      </a>
      <a href="#manajemen-guru" class="mobile-bottom-nav-item" data-route="manajemen-guru">
        <i class="fas fa-chalkboard-teacher"></i>
        <span>Guru</span>
      </a>
      <a href="#materi" class="mobile-bottom-nav-item" data-route="materi">
        <i class="fas fa-book-open"></i>
        <span>Materi</span>
      </a>
      <button type="button" class="mobile-bottom-nav-item" id="btn-bottom-menu-toggle" onclick="window.toggleSidebar()">
        <i class="fas fa-bars"></i>
        <span>Menu</span>
      </button>
    `;
  } else {
    // Guest
    return `
      <a href="#landing" class="mobile-bottom-nav-item" data-route="landing">
        <i class="fas fa-home"></i>
        <span>Beranda</span>
      </a>
      <a href="#quest" class="mobile-bottom-nav-item" data-route="quest">
        <i class="fas fa-gamepad"></i>
        <span>Quest</span>
      </a>
      <button type="button" class="mobile-bottom-nav-item btn-open-login">
        <i class="fas fa-sign-in-alt"></i>
        <span>Masuk</span>
      </button>
      <button type="button" class="mobile-bottom-nav-item btn-open-register">
        <i class="fas fa-user-plus"></i>
        <span>Daftar</span>
      </button>
    `;
  }
}

// Universal SPA Navigation Engine
function navigateTo(targetHash) {
  if (!targetHash) return;
  if (!targetHash.startsWith("#")) targetHash = "#" + targetHash;

  const user = window.auth ? window.auth.getCurrentUser() : null;

  // Guest route guards
  if (targetHash !== "#landing" && !targetHash.startsWith("#quest") && !targetHash.startsWith("#sync-roster=") && !user) {
    window.location.hash = "#landing";
    if (window.showToast) window.showToast("Silakan masuk terlebih dahulu untuk mengakses fitur ini.", "warning");
    if (window.openModal) window.openModal("login-modal");
    closeSidebar();
    return;
  }

  // If already at target hash, hashchange won't fire naturally; force handleRouting
  if (window.location.hash === targetHash) {
    handleRouting();
  } else {
    window.location.hash = targetHash;
  }

  // Smoothly close drawer on mobile/tablet overlay without aborting click
  setTimeout(() => {
    closeSidebar();
  }, 50);
}

window.navigateTo = navigateTo;

// Sidebar & Layout state helpers
function openSidebar() {
  const sidebar = document.querySelector("aside.sidebar");
  const backdrop = document.getElementById("sidebar-backdrop");
  if (!sidebar) return;
  if (window.innerWidth <= 992) {
    sidebar.classList.add("active");
    if (backdrop) backdrop.classList.add("active");
    document.body.classList.add("sidebar-open-mobile");
  } else {
    sidebar.classList.remove("hidden-desktop");
    const mainContent = document.getElementById("main-content");
    if (mainContent) mainContent.classList.remove("expanded");
  }
}

function closeSidebar() {
  const sidebar = document.querySelector("aside.sidebar");
  const backdrop = document.getElementById("sidebar-backdrop");
  if (!sidebar) return;
  sidebar.classList.remove("active");
  if (backdrop) backdrop.classList.remove("active");
  document.body.classList.remove("sidebar-open-mobile");
}

function toggleSidebar() {
  const sidebar = document.querySelector("aside.sidebar");
  if (!sidebar) return;
  if (window.innerWidth <= 992) {
    if (sidebar.classList.contains("active")) {
      closeSidebar();
    } else {
      openSidebar();
    }
  } else {
    sidebar.classList.toggle("hidden-desktop");
    const mainContent = document.getElementById("main-content");
    if (mainContent) mainContent.classList.toggle("expanded");
  }
}

window.openSidebar = openSidebar;
window.closeSidebar = closeSidebar;
window.toggleSidebar = toggleSidebar;

// Unified Simulation & App Fullscreen Engine
function isFullscreenActive() {
  return !!(
    document.fullscreenElement ||
    document.webkitFullscreenElement ||
    document.mozFullScreenElement ||
    document.msFullscreenElement ||
    document.body.classList.contains("fivia-fullscreen-active") ||
    document.body.classList.contains("fq-fullscreen-active")
  );
}

function updateAllFullscreenUI(isActive) {
  if (isActive) {
    document.body.classList.add("fivia-fullscreen-active", "fq-fullscreen-active");
    document.documentElement.classList.add("fivia-fullscreen-active");
  } else {
    document.body.classList.remove("fivia-fullscreen-active", "fq-fullscreen-active");
    document.documentElement.classList.remove("fivia-fullscreen-active");
  }

  // Update navbar & lab buttons
  const btns = document.querySelectorAll(".fq-fullscreen-toggle-btn, #btn-lab-nav-fullscreen, #btn-meas-fullscreen-toggle, #btn-meas-toolbar-fullscreen, #btn-meas-canvas-fs");
  btns.forEach(btn => {
    const icon = btn.querySelector("i");
    const span = btn.querySelector("span");
    if (isActive) {
      if (icon) icon.className = "fas fa-compress";
      if (span) span.textContent = "Keluar Fullscreen";
      btn.style.background = "rgba(245,158,11,0.25)";
      btn.style.borderColor = "var(--brand-orange, #f97316)";
      btn.style.color = "#fef08a";
    } else {
      if (icon) icon.className = "fas fa-expand";
      if (span) span.textContent = "Layar Penuh";
      btn.style.background = "rgba(6,182,212,0.15)";
      btn.style.borderColor = "var(--fq-cyan, #06b6d4)";
      btn.style.color = "var(--fq-cyan, #06b6d4)";
    }
  });

  // Floating exit button visibility
  const floatingExit = document.getElementById("btn-floating-exit-fullscreen");
  if (floatingExit) {
    floatingExit.style.display = isActive ? "inline-flex" : "none";
  }

  // Trigger resize to recalculate canvas viewports
  setTimeout(() => {
    window.dispatchEvent(new Event("resize"));
    if (typeof resizeCanvases === "function") resizeCanvases();
    if (typeof drawSimulation === "function") drawSimulation();
    if (typeof drawActiveSimulator === "function") drawActiveSimulator();
  }, 100);
}

function toggleFullScreen() {
  const currentlyActive = isFullscreenActive();
  if (!currentlyActive) {
    // Request Native HTML5 Fullscreen if supported
    const docEl = document.documentElement;
    const req = docEl.requestFullscreen || docEl.webkitRequestFullscreen || docEl.mozRequestFullScreen || docEl.msRequestFullscreen;
    if (req) {
      try {
        const p = req.call(docEl);
        if (p && typeof p.catch === "function") {
          p.catch(() => {});
        }
      } catch (_) {}
    }
    // Always apply CSS Immersive Fullscreen Mode
    updateAllFullscreenUI(true);
  } else {
    // Exit Native Fullscreen if active
    const exit = document.exitFullscreen || document.webkitExitFullscreen || document.mozCancelFullScreen || document.msExitFullscreen;
    if (exit && (document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement)) {
      try {
        const p = exit.call(document);
        if (p && typeof p.catch === "function") {
          p.catch(() => {});
        }
      } catch (_) {}
    }
    // Remove CSS Immersive Fullscreen Mode
    updateAllFullscreenUI(false);
  }
}

function exitFullScreen() {
  const exit = document.exitFullscreen || document.webkitExitFullscreen || document.mozCancelFullScreen || document.msExitFullscreen;
  if (exit && (document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement)) {
    try {
      const p = exit.call(document);
      if (p && typeof p.catch === "function") {
        p.catch(() => {});
      }
    } catch (_) {}
  }
  updateAllFullscreenUI(false);
}

window.toggleFullScreen = toggleFullScreen;
window.exitFullScreen = exitFullScreen;
window.isFullscreenActive = isFullscreenActive;

// Listen to native fullscreen changes
["fullscreenchange", "webkitfullscreenchange", "mozfullscreenchange", "MSFullscreenChange"].forEach(evt => {
  document.addEventListener(evt, () => {
    const isNativeFS = !!(document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement);
    if (!isNativeFS && (document.body.classList.contains("fivia-fullscreen-active") || document.body.classList.contains("fq-fullscreen-active"))) {
      updateAllFullscreenUI(false);
    }
  });
});

// UI Interactive Bindings
function initUIEvents() {
  // Sidebar Toggler Button in Header
  const toggleBtn = document.querySelector(".header-toggle-sidebar");
  if (toggleBtn) {
    toggleBtn.addEventListener("click", () => {
      toggleSidebar();
    });
  }

  // Sidebar Close Button ("X") inside Sidebar Header
  const closeBtn = document.getElementById("btn-close-sidebar");
  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      closeSidebar();
    });
  }

  // Backdrop Overlay Click (Dismiss on tap outside)
  const backdrop = document.getElementById("sidebar-backdrop");
  if (backdrop) {
    backdrop.addEventListener("click", () => {
      closeSidebar();
    });
  }

  // Universal SPA Hash Link Interceptor: Guarantees 100% reliable navigation on iOS, Safari, Android, and Tablets
  document.addEventListener("click", (e) => {
    const link = e.target.closest('a[href^="#"]');
    if (link && !link.classList.contains("no-spa-nav") && !link.hasAttribute("download")) {
      const href = link.getAttribute("href");
      if (href && href !== "#" && href !== "#!" && !href.startsWith("#modal-")) {
        e.preventDefault();
        window.navigateTo(href);
      }
    }
  });

  // Dedicated sidebar menu and mobile link delegator
  const sidebar = document.querySelector("aside.sidebar");
  if (sidebar) {
    sidebar.addEventListener("click", (e) => {
      const link = e.target.closest("a");
      const logoutBtn = e.target.closest("#btn-logout");
      if (link) {
        const href = link.getAttribute("href");
        if (href && href.startsWith("#")) {
          e.preventDefault();
          window.navigateTo(href);
        }
      }
      if (logoutBtn) {
        closeSidebar();
      }
    });

    // Touch gesture: Swipe left to dismiss sidebar
    let touchStartX = 0;
    let touchStartY = 0;
    sidebar.addEventListener("touchstart", (e) => {
      if (e.touches && e.touches[0]) {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
      }
    }, { passive: true });

    sidebar.addEventListener("touchend", (e) => {
      if (e.changedTouches && e.changedTouches[0]) {
        const diffX = e.changedTouches[0].clientX - touchStartX;
        const diffY = e.changedTouches[0].clientY - touchStartY;
        // If swiped left by at least 45px with predominantly horizontal gesture
        if (diffX < -45 && Math.abs(diffX) > Math.abs(diffY)) {
          closeSidebar();
        }
      }
    }, { passive: true });
  }

  // Global Keyboard: Escape dismisses sidebar and exits fullscreen
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeSidebar();
      if (isFullscreenActive()) {
        exitFullScreen();
      }
    }
  });

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
  const user = window.auth ? window.auth.getCurrentUser() : null;
  
  // Clean active states on sidebar
  document.querySelectorAll(".sidebar-menu-item").forEach(item => item.classList.remove("active"));
  
  // Hide all section pages
  document.querySelectorAll(".spa-section").forEach(sec => sec.classList.add("hidden-section"));
  
  // Safe helper to show a section
  const showSection = (secId) => {
    const el = document.getElementById(secId);
    if (el) el.classList.remove("hidden-section");
    return el;
  };

  // Helper to highlight sidebar menu items
  const highlightSidebar = (menuId) => {
    const el = document.getElementById(menuId);
    if (el) el.classList.add("active");
  };

  // Safe caller for render functions
  const safeRun = (fnName, ...args) => {
    if (typeof window[fnName] === "function") {
      try {
        window[fnName](...args);
      } catch (err) {
        console.error(`[FIVIA Router] Error executing ${fnName}:`, err);
      }
    }
  };

  // Sync active states on mobile bottom navigation
  document.querySelectorAll(".mobile-bottom-nav-item").forEach(item => {
    item.classList.remove("active");
    const href = item.getAttribute("href") || "";
    const route = item.getAttribute("data-route") || "";
    if ((href && href === hash) || (route && (hash === "#" + route || hash.startsWith("#" + route + "/")))) {
      item.classList.add("active");
    }
  });

  // Toggle footer visibility (hide inside virtual lab viewport)
  const appFooter = document.querySelector("footer.app-footer");
  if (appFooter) {
    appFooter.style.display = hash.startsWith("#lab/") ? "none" : "";
  }

  // Auth Guards (Allow #quest and #sync-roster for both guests & logged in users)
  if (hash !== "#landing" && !hash.startsWith("#quest") && !hash.startsWith("#sync-roster=") && !user) {
    // Redirect anonymous to landing
    window.location.hash = "#landing";
    return;
  }

  // Direct Class Roster Link Activation (for multi-device instant sync)
  if (hash.startsWith("#sync-roster=")) {
    try {
      const payloadBase64 = hash.replace("#sync-roster=", "");
      const jsonStr = decodeURIComponent(escape(atob(payloadBase64)));
      const students = JSON.parse(jsonStr);
      if (Array.isArray(students) && students.length > 0) {
        let count = 0;
        students.forEach(std => {
          if (window.syncStudentRecordLocally) {
            window.syncStudentRecordLocally(std);
            count++;
          }
        });
        alert(`🎉 DATA KELAS BERHASIL DIAKTIFKAN!\n\nSebanyak ${count} siswa berhasil dimuat di perangkat ini.\nSilakan masuk sekarang menggunakan Nama Lengkap & NIS Anda.`);
      }
    } catch(err) {
      console.warn("Error parsing roster sync payload:", err);
    }
    window.location.hash = "#landing";
    if (window.openModal) window.openModal("login-modal");
    return;
  }

  // Route Definitions
  if (hash.startsWith("#quest")) {
    highlightSidebar("menu-guru-group-play");
    showSection("fivia-quest-section");
    safeRun("FIVIAQuest_handleSubRouting", hash);
    if (window.FIVIAQuest && typeof window.FIVIAQuest.handleSubRouting === 'function') {
      try { window.FIVIAQuest.handleSubRouting(hash); } catch(e) { console.error(e); }
    }
    if ((hash === '#quest/group-play' || hash === '#quest/group-levels') && window.FIVIAGroupLevelEngine && typeof window.FIVIAGroupLevelEngine.renderLevelMapUI === 'function') {
      try { window.FIVIAGroupLevelEngine.renderLevelMapUI(); } catch(e) { console.error(e); }
    }
  }

  else if (hash === "#landing" || hash === "#home") {
    if (user) {
      window.location.hash = "#dashboard";
      return;
    }
    showSection("landing-section");
  } 
  
  else if (hash === "#dashboard") {
    if (user && user.role === "siswa") {
      highlightSidebar("menu-siswa-dashboard");
      showSection("student-dashboard-section");
      safeRun("renderStudentDashboard");
    } else if (user && user.role === "guru") {
      highlightSidebar("menu-guru-dashboard");
      showSection("teacher-dashboard-section");
      safeRun("renderTeacherDashboard");
    } else {
      highlightSidebar("menu-admin-dashboard");
      const adminSec = showSection("admin-dashboard-section");
      safeRun("renderAdminDashboard");
      if (!adminSec) {
        showSection("teacher-dashboard-section");
        safeRun("renderTeacherDashboard");
      }
    }
  } 
  
  else if (hash === "#materi") {
    highlightSidebar("menu-materi");
    showSection("materi-list-section");
    safeRun("renderMaterialsList");
  } 
  
  else if (hash.startsWith("#materi/")) {
    highlightSidebar("menu-materi");
    const matId = hash.split("/")[1];
    showSection("materi-detail-section");
    safeRun("renderMaterialDetail", matId);
  } 
  
  else if (hash.startsWith("#lab/")) {
    highlightSidebar("menu-materi");
    const labId = hash.split("/")[1];
    showSection("lab-viewport-section");
    safeRun("renderLab", labId);
  }

  else if (hash === "#detektif") {
    highlightSidebar("menu-materi");
    showSection("detektif-section");
    safeRun("initDetektifDashboard");
  }

  else if (hash.startsWith("#detektif/misi/")) {
    highlightSidebar("menu-materi");
    const missionId = parseInt(hash.split("/")[2]);
    showSection("detektif-section");
    safeRun("playDetektifMission", missionId);
  }
  
  else if (hash.startsWith("#quiz/")) {
    highlightSidebar("menu-materi");
    const matId = hash.split("/")[1];
    showSection("quiz-section");
    safeRun("renderQuiz", matId);
  }

  else if (hash === "#sertifikat") {
    highlightSidebar("menu-siswa-sertifikat");
    showSection("certificates-list-section");
    safeRun("renderCertificatesList");
  }

  else if (hash === "#periksa-lkpd") {
    if (!user || (user.role !== "guru" && user.role !== "admin")) { window.location.hash = "#dashboard"; return; }
    highlightSidebar("menu-guru-periksa-lkpd");
    showSection("periksa-lkpd-section");
    safeRun("renderPeriksaLKPDSection");
  }

  else if (hash === "#generator") {
    if (!user || (user.role !== "guru" && user.role !== "admin")) { window.location.hash = "#dashboard"; return; }
    highlightSidebar("menu-guru-generator");
    showSection("generator-section");
  }

  else if (hash === "#kelas") {
    if (!user || (user.role !== "guru" && user.role !== "admin")) { window.location.hash = "#dashboard"; return; }
    highlightSidebar("menu-guru-kelas");
    showSection("class-management-section");
    safeRun("renderClassManagement");
  }

  else if (hash === "#laporan") {
    if (!user || (user.role !== "guru" && user.role !== "admin")) { window.location.hash = "#dashboard"; return; }
    highlightSidebar("menu-guru-laporan");
    showSection("teacher-reports-section");
    safeRun("renderTeacherReports");
  }

  else if (hash === "#manajemen-guru") {
    if (!user || (user.role !== "guru" && user.role !== "admin")) { window.location.hash = "#dashboard"; return; }
    highlightSidebar("menu-guru-management");
    showSection("teacher-management-section");
    safeRun("renderTeacherManagement");
  }
  
  else {
    // 404 fallback
    window.location.hash = user ? "#dashboard" : "#landing";
  }
  
  // Smoothly collapse sidebar on small screens after routing
  if (window.innerWidth <= 992) {
    closeSidebar();
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
