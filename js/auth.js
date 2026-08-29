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

  login(email, password) {
    const users = window.db.getTable("users");
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase().trim() && u.password === password);
    
    if (user) {
      // Don't save password in session
      const sessionUser = {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        classId: user.classId || null
      };
      
      this.currentUser = sessionUser;
      localStorage.setItem(SESSION_KEY, JSON.stringify(sessionUser));
      
      // Dispatch custom event for layout updates
      window.dispatchEvent(new Event("authChange"));
      
      return { success: true, user: sessionUser };
    }
    
    return { success: false, message: "Email atau kata sandi salah!" };
  }

  logout() {
    this.currentUser = null;
    localStorage.removeItem(SESSION_KEY);
    // Dispatch custom event for app routing
    window.dispatchEvent(new Event("authChange"));
    return true;
  }

  register(name, email, password, role, classId = null) {
    const users = window.db.getTable("users");
    const emailExists = users.some(u => u.email.toLowerCase() === email.toLowerCase().trim());
    
    if (emailExists) {
      return { success: false, message: "Email sudah terdaftar!" };
    }
    
    const newUserId = "usr_" + Math.random().toString(36).substr(2, 9);
    const newUser = {
      id: newUserId,
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: password,
      role: role,
      classId: classId
    };
    
    users.push(newUser);
    window.db.saveTable("users", users);
    
    // If student, add to students list
    if (role === "siswa") {
      const students = window.db.getTable("students");
      students.push({
        id: newUserId,
        name: newUser.name,
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
