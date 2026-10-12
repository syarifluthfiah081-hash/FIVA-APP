/**
 * auth.js
 * Authentication handler for Virtual Lab Fisika SMA Indonesia
 */

const SESSION_KEY = "vlab_active_session";

class AuthManager {
  constructor() {
    this.currentUser = null;
    this.loadSession();
  }

  loadSession() {
    const session = localStorage.getItem(SESSION_KEY);
    if (session) {
      try {
        this.currentUser = JSON.parse(session);
      } catch (e) {
        console.error("Failed to parse active user session", e);
        this.logout();
      }
    }
  }

  getCurrentUser() {
    return this.currentUser;
  }

  isLoggedIn() {
    return this.currentUser !== null;
  }

  hasRole(role) {
    return this.currentUser && this.currentUser.role === role;
  }

  login(identifier, password) {
    const inputId = (identifier || "").toLowerCase().trim();
    const inputPass = (password || "").trim();

    if (!inputId || !inputPass) {
      return { success: false, message: "Nama Lengkap / Email / NIS dan Kata Sandi harus diisi!" };
    }

    // Ensure database is initialized
    if (window.db && typeof window.db.init === "function") {
      const existingUsers = window.db.getTable("users");
      if (!existingUsers || existingUsers.length === 0) {
        window.db.init();
      }
    }

    const users = (window.db && window.db.getTable("users")) || [];
    const students = (window.db && window.db.getTable("students")) || [];
    const excelRoster = window.FIVIAExcelImport ? window.FIVIAExcelImport.getExistingRoster() : [];

    // Helper to test if identifier matches a user record
    const matchesIdentifier = (u) => {
      if (!u) return false;
      const uEmail = (u.email || "").toLowerCase().trim();
      const uEmailPrefix = uEmail.split("@")[0];
      const uName = (u.name || "").toLowerCase().trim();
      const uNis = String(u.nis || "").toLowerCase().trim();
      const uRole = (u.role || "").toLowerCase().trim();
      const uId = (u.id || "").toLowerCase().trim();

      return (
        uEmail === inputId ||
        uEmailPrefix === inputId ||
        uName === inputId ||
        uNis === inputId ||
        uRole === inputId ||
        uId === inputId ||
        (inputId.length > 2 && uName.includes(inputId))
      );
    };

    // Helper to test if password matches a user record
    const matchesPassword = (u) => {
      if (!u) return false;
      const uPass = String(u.password || "").trim();
      const uNis = String(u.nis || "").trim();
      const uRole = (u.role || "").toLowerCase().trim();

      if (uPass && uPass === inputPass) return true;
      if (uNis && uNis === inputPass) return true;

      // Role-based default fallbacks
      if (uRole === "guru" && (inputPass === "guru123" || inputPass === "guru")) return true;
      if (uRole === "admin" && (inputPass === "admin123" || inputPass === "admin")) return true;
      if (uRole === "siswa" && (inputPass === "12345" || inputPass === "siswa123" || inputPass === "siswa")) return true;

      return false;
    };

    // 1. Try matching users table
    let user = users.find(u => matchesIdentifier(u) && matchesPassword(u));

    // 2. Fallback: check students table or excel roster by Name & NIS for student login
    if (!user) {
      let stdObj = students.find(s => {
        const sName = (s.name || s.studentName || "").toLowerCase().trim();
        const sNis = String(s.nis || s.studentCode || "").toLowerCase().trim();
        const sEmail = (s.email || "").toLowerCase().trim();
        return sName === inputId || sNis === inputId || sEmail === inputId || (inputId.length > 2 && sName.includes(inputId));
      });

      if (!stdObj && Array.isArray(excelRoster) && excelRoster.length > 0) {
        stdObj = excelRoster.find(s => {
          const sName = (s.name || s.studentName || "").toLowerCase().trim();
          const sNis = String(s.nis || s.studentCode || "").toLowerCase().trim();
          const sEmail = (s.email || "").toLowerCase().trim();
          return sName === inputId || sNis === inputId || sEmail === inputId || (inputId.length > 2 && sName.includes(inputId));
        });
      }

      if (stdObj) {
        const stdNis = String(stdObj.nis || stdObj.studentCode || "12345").trim();
        const stdPass = String(stdObj.password || "password123").trim();

        if (inputPass === stdNis || inputPass === stdPass || inputPass === "12345" || inputPass === "siswa123" || inputPass === "siswa") {
          const sId = stdObj.id || stdObj.studentId || ("usr_" + Math.random().toString(36).substr(2, 9));
          const sName = stdObj.name || stdObj.studentName || "Siswa";
          const sEmail = stdObj.email || `${sName.toLowerCase().replace(/\s+/g, '')}@sekolah.id`;

          user = {
            id: sId,
            email: sEmail,
            name: sName,
            role: "siswa",
            nis: stdNis,
            classId: stdObj.classId || "cls_x1"
          };

          if (!users.some(u => u.id === user.id || (u.name && u.name.toLowerCase().trim() === sName.toLowerCase().trim()))) {
            users.push({ ...user, password: stdPass });
            if (window.db) window.db.saveTable("users", users);
          }
        }
      }
    }

    // 3. Fallback: Default system accounts if users table was empty or missing records
    if (!user) {
      if ((inputId === "guru" || inputId === "guru@hidayahstore.edu" || inputId === "hidayat, s.pd., m.si.") && (inputPass === "guru123" || inputPass === "guru")) {
        user = {
          id: "usr_guru",
          email: "guru@hidayahstore.edu",
          name: "Hidayat, S.Pd., M.Si.",
          role: "guru",
          nis: null,
          classId: null
        };
      } else if ((inputId === "admin" || inputId === "admin@hidayahstore.edu") && (inputPass === "admin123" || inputPass === "admin")) {
        user = {
          id: "usr_admin",
          email: "admin@hidayahstore.edu",
          name: "Admin Hidayah",
          role: "admin",
          nis: null,
          classId: null
        };
      } else if ((inputId === "siswa" || inputId === "12345" || inputId === "siswa@hidayahstore.edu") && (inputPass === "12345" || inputPass === "siswa123" || inputPass === "siswa")) {
        user = {
          id: "usr_siswa",
          email: "siswa@hidayahstore.edu",
          name: "Siswa",
          role: "siswa",
          nis: "12345",
          classId: "cls_x1"
        };
      }
    }

    if (user) {
      const sessionUser = {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        nis: user.nis || null,
        classId: user.classId || null
      };
      
      this.currentUser = sessionUser;
      localStorage.setItem(SESSION_KEY, JSON.stringify(sessionUser));
      
      // Dispatch custom event for layout updates
      window.dispatchEvent(new Event("authChange"));
      
      return { success: true, user: sessionUser };
    }
    
    return { success: false, message: "Nama Lengkap / Email / NIS atau Kata Sandi salah!" };
  }

  logout() {
    this.currentUser = null;
    localStorage.removeItem(SESSION_KEY);
    // Dispatch custom event for app routing
    window.dispatchEvent(new Event("authChange"));
    return true;
  }

  register(name, email, password, role, classId = null, nis = null) {
    const users = window.db.getTable("users") || [];
    const emailExists = users.some(u => u.email && u.email.toLowerCase() === email.toLowerCase().trim());
    
    if (emailExists) {
      return { success: false, message: "Email sudah terdaftar!" };
    }
    
    const newUserId = "usr_" + Math.random().toString(36).substr(2, 9);
    const assignedNis = nis || (role === "siswa" ? Math.floor(10000 + Math.random() * 90000).toString() : null);

    const newUser = {
      id: newUserId,
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: password,
      role: role,
      nis: assignedNis,
      classId: classId
    };
    
    users.push(newUser);
    window.db.saveTable("users", users);
    
    // If student, add to students list
    if (role === "siswa") {
      const students = window.db.getTable("students") || [];
      students.push({
        id: newUserId,
        name: newUser.name,
        nis: assignedNis,
        classId: classId,
        email: newUser.email
      });
      window.db.saveTable("students", students);
    }
    
    // Auto login
    const sessionUser = {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      role: newUser.role,
      nis: newUser.nis,
      classId: newUser.classId
    };
    
    this.currentUser = sessionUser;
    localStorage.setItem(SESSION_KEY, JSON.stringify(sessionUser));
    
    // Dispatch auth change event
    window.dispatchEvent(new Event("authChange"));
    
    return { success: true, user: sessionUser };
  }
}

// Instantiate globally
const auth = new AuthManager();
window.auth = auth;
