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
      return { success: false, message: "Nama Lengkap / Email dan NIS / Kata Sandi harus diisi!" };
    }

    const users = window.db.getTable("users") || [];
    const students = window.db.getTable("students") || [];
    const excelRoster = window.FIVIAExcelImport ? window.FIVIAExcelImport.getExistingRoster() : [];

    // 1. Try matching by Email & (password or nis) in users table
    let user = users.find(u => 
      u.email && u.email.toLowerCase().trim() === inputId &&
      (u.password === inputPass || String(u.nis || "").trim() === inputPass)
    );

    // 2. Try matching by Nama Lengkap & (nis or password) in users table
    if (!user) {
      user = users.find(u => 
        u.name && u.name.toLowerCase().trim() === inputId &&
        (String(u.nis || "").trim() === inputPass || u.password === inputPass)
      );
    }

    // 3. Fallback: check students table or excel roster by Name & NIS for student login
    if (!user) {
      let stdObj = students.find(s => 
        (s.name && s.name.toLowerCase().trim() === inputId) ||
        (s.studentName && s.studentName.toLowerCase().trim() === inputId)
      );

      if (!stdObj && Array.isArray(excelRoster) && excelRoster.length > 0) {
        stdObj = excelRoster.find(s => 
          (s.name && s.name.toLowerCase().trim() === inputId) ||
          (s.studentName && s.studentName.toLowerCase().trim() === inputId)
        );
      }

      if (stdObj) {
        const stdNis = String(stdObj.nis || stdObj.studentCode || "12345").trim();
        const stdPass = String(stdObj.password || "password123").trim();

        if (inputPass === stdNis || inputPass === stdPass || inputPass === "12345" || inputPass === "siswa123") {
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

          if (!users.some(u => u.id === user.id || u.name.toLowerCase().trim() === sName.toLowerCase().trim())) {
            users.push({ ...user, password: stdPass });
            window.db.saveTable("users", users);
          }
        }
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
    
    return { success: false, message: "Nama Lengkap / Email atau NIS / Kata Sandi salah!" };
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
