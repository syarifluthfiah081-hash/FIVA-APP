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
        if (this.currentUser && (this.currentUser.email || "").toLowerCase() === "syarifhidayatullah64@guru.sma.belajar.id") {
          this.currentUser.name = "Syarif Hidayatullah";
          localStorage.setItem(SESSION_KEY, JSON.stringify(this.currentUser));
        }
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

  directLoginStudent(stdObj) {
    if (!stdObj) return false;
    const sName = stdObj.name || stdObj.studentName || stdObj.displayName || "Siswa";
    const sNis = String(stdObj.nis || stdObj.studentCode || "12345").trim();
    const sCode = stdObj.studentCode || ('FIVIA-' + sNis);
    const sClass = stdObj.className || stdObj.classId || "cls_x1";
    const sEmail = stdObj.email || `${sName.toLowerCase().replace(/[^a-z0-9]/g, '')}@sekolah.id`;
    const sId = stdObj.id || stdObj.studentId || ("usr_" + Math.random().toString(36).substr(2, 9));

    const sessionUser = {
      id: sId,
      email: sEmail,
      name: sName,
      role: "siswa",
      nis: sNis,
      studentCode: sCode,
      classId: sClass
    };

    this.currentUser = sessionUser;
    localStorage.setItem(SESSION_KEY, JSON.stringify(sessionUser));

    // Sync to FIVIAStudent profile & session
    if (window.FIVIAStudent && typeof window.FIVIAStudent.saveStudentProfile === "function") {
      window.FIVIAStudent.saveStudentProfile({ ...stdObj, name: sName, nis: sNis, studentCode: sCode, className: sClass });
    }
    if (window.FIVIAStudentSession && typeof window.FIVIAStudentSession.startStudentSession === "function") {
      window.FIVIAStudentSession.startStudentSession(sName, sClass, sCode);
    }

    window.dispatchEvent(new Event("authChange"));
    return { success: true, user: sessionUser };
  }

  async login(identifier, password) {
    const rawId = (identifier || "").trim();
    const rawPass = (password || "").trim();

    if (!rawId || !rawPass) {
      return { success: false, message: "Nama Lengkap / Email / NIS dan Kata Sandi harus diisi!" };
    }

    // Ensure database is initialized
    if (window.db && typeof window.db.init === "function") {
      const existingUsers = window.db.getTable("users");
      if (!existingUsers || existingUsers.length === 0) {
        window.db.init();
      }
    }

    const normText = (s) => (s || "").toString().toLowerCase().trim().replace(/\s+/g, " ");
    const normDigits = (s) => {
      const digits = (s || "").toString().replace(/[^0-9]/g, "");
      return digits.replace(/^0+/, "") || digits;
    };
    const normAlphaNum = (s) => (s || "").toString().toLowerCase().replace(/[^a-z0-9]/g, "");

    const inputId = normText(rawId);
    const inputPass = normText(rawPass);
    const inputIdDigits = normDigits(rawId);
    const inputPassDigits = normDigits(rawPass);
    const inputIdAlpha = normAlphaNum(rawId);
    const inputPassAlpha = normAlphaNum(rawPass);

    const users = (window.db && window.db.getTable("users")) || [];
    const students = (window.db && window.db.getTable("students")) || [];

    // Gather excel & local roster
    let excelRoster = [];
    if (window.FIVIAExcelImport && typeof window.FIVIAExcelImport.getExistingRoster === "function") {
      excelRoster = window.FIVIAExcelImport.getExistingRoster() || [];
    }
    if (!excelRoster || excelRoster.length === 0) {
      try {
        const rawRoster = localStorage.getItem("fivia_student_roster");
        if (rawRoster) excelRoster = JSON.parse(rawRoster);
      } catch (e) {}
    }

    let classroomStudents = [];
    try {
      const rawCs = localStorage.getItem("fivia_classroom_students");
      if (rawCs) classroomStudents = JSON.parse(rawCs);
    } catch (e) {}

    let activeProfile = null;
    try {
      const rawProf = localStorage.getItem("fivia_student_profile");
      if (rawProf) activeProfile = JSON.parse(rawProf);
    } catch (e) {}

    // ==========================================
    // 1. CHECK TEACHER & ADMIN LOGINS FIRST
    // ==========================================
    const guruOrAdmin = users.find(u => {
      if (!u || (u.role !== "guru" && u.role !== "admin")) return false;
      const uEmail = normText(u.email);
      const uName = normText(u.name);
      const uRole = normText(u.role);
      const uId = normText(u.id);

      const idMatches = (
        uEmail === inputId ||
        uEmail.split("@")[0] === inputId ||
        uName === inputId ||
        uRole === inputId ||
        uId === inputId ||
        (inputId.length >= 3 && uName.includes(inputId)) ||
        (inputId.length >= 3 && inputId.includes(uName))
      );

      const passMatches = (
        normText(u.password) === inputPass ||
        String(u.password || "").trim() === rawPass
      );

      return idMatches && passMatches;
    });

    if (guruOrAdmin) {
      return this._setSessionUser(guruOrAdmin);
    }

    // Dynamic Cloud Firestore check for Teachers/Admins across devices
    if (window.FIVIA_FIREBASE && window.FIVIA_FIREBASE.db && window.FIVIA_FIREBASE.isInitialized) {
      try {
        const firestore = window.FIVIA_FIREBASE.db;
        const fetchTimeout = (p, ms = 1200) => Promise.race([p, new Promise((_, rej) => setTimeout(() => rej(new Error("Timeout")), ms))]);
        const snap = await fetchTimeout(firestore.collection("vlab_users").get());
        if (!snap.empty) {
          for (const doc of snap.docs) {
            const u = doc.data();
            if (!u || (u.role !== "guru" && u.role !== "admin")) continue;
            const uEmail = normText(u.email);
            const uName = normText(u.name);
            const uId = normText(doc.id);

            const idMatches = (
              uEmail === inputId ||
              uEmail.split("@")[0] === inputId ||
              uName === inputId ||
              uId === inputId ||
              (inputId.length >= 3 && uName.includes(inputId))
            );

            const passMatches = (
              normText(u.password) === inputPass ||
              String(u.password || "").trim() === rawPass
            );

            if (idMatches && passMatches) {
              const matchedCloudUser = {
                id: doc.id,
                email: u.email,
                name: u.name,
                role: u.role,
                password: u.password,
                classId: u.classId || null
              };
              // Cache locally
              const curUsers = (window.db && window.db.getTable("users")) || [];
              const exIdx = curUsers.findIndex(cu => cu.id === matchedCloudUser.id || cu.email === matchedCloudUser.email);
              if (exIdx >= 0) curUsers[exIdx] = matchedCloudUser;
              else curUsers.push(matchedCloudUser);
              if (window.db) window.db.saveTable("users", curUsers);

              return this._setSessionUser(matchedCloudUser);
            }
          }
        }
      } catch (errCloudGuru) {
        console.warn("[Auth] Cloud teacher lookup:", errCloudGuru);
      }
    }

    // REST fallback for Teachers/Admins
    if (typeof fetchCollectionFromFirestoreREST === "function") {
      try {
        const cloudUsers = await fetchCollectionFromFirestoreREST("vlab_users");
        if (Array.isArray(cloudUsers) && cloudUsers.length > 0) {
          for (const u of cloudUsers) {
            if (!u || (u.role !== "guru" && u.role !== "admin")) continue;
            const uEmail = normText(u.email);
            const uName = normText(u.name);
            const idMatches = (
              uEmail === inputId ||
              uEmail.split("@")[0] === inputId ||
              uName === inputId ||
              normText(u.id) === inputId ||
              (inputId.length >= 3 && uName.includes(inputId))
            );
            const passMatches = (
              normText(u.password) === inputPass ||
              String(u.password || "").trim() === rawPass
            );
            if (idMatches && passMatches) {
              const matchedCloudUser = {
                id: u.id,
                email: u.email,
                name: u.name,
                role: u.role,
                password: u.password,
                classId: u.classId || null
              };
              const curUsers = (window.db && window.db.getTable("users")) || [];
              const exIdx = curUsers.findIndex(cu => cu.id === matchedCloudUser.id || cu.email === matchedCloudUser.email);
              if (exIdx >= 0) curUsers[exIdx] = matchedCloudUser;
              else curUsers.push(matchedCloudUser);
              if (window.db) window.db.saveTable("users", curUsers);
              return this._setSessionUser(matchedCloudUser);
            }
          }
        }
      } catch (_) {}
    }

    // ==========================================
    // 2. CHECK STUDENT LOGINS (Siswa)
    // Gather all candidate students into a unified list
    // ==========================================
    const candidateMap = new Map();

    const addCandidate = (s, source) => {
      if (!s) return;
      const sRole = (s.role || "siswa").toLowerCase();
      if (sRole !== "siswa" && source === "users") return;

      const name = String(s.name || s.studentName || s.displayName || s.nama || "").trim();
      const nis = String(s.nis || s.studentCode || s.code || "").trim();
      const studentCode = String(s.studentCode || s.code || "").trim();
      const email = String(s.email || "").trim();
      const id = String(s.id || s.studentId || "").trim();
      const password = String(s.password || "").trim();
      const classId = String(s.classId || s.className || s.kelas || "cls_x1").trim();

      if (!name && !nis && !email) return;

      const key = (nis ? ('nis_' + normDigits(nis)) : '') + '_' + normText(name) || id;
      if (!candidateMap.has(key)) {
        candidateMap.set(key, {
          id: id || ("usr_" + Math.random().toString(36).substr(2, 9)),
          name: name || "Siswa",
          nis: nis,
          studentCode: studentCode,
          email: email || `${normAlphaNum(name) || 'siswa'}@sekolah.id`,
          password: password,
          classId: classId,
          role: "siswa"
        });
      } else {
        const cur = candidateMap.get(key);
        if (!cur.nis && nis) cur.nis = nis;
        if (!cur.studentCode && studentCode) cur.studentCode = studentCode;
        if (!cur.password && password) cur.password = password;
        if (!cur.email && email) cur.email = email;
        if (name && (cur.name === "Siswa" || cur.name.length < name.length)) cur.name = name;
      }
    };

    users.forEach(u => addCandidate(u, "users"));
    students.forEach(s => addCandidate(s, "students"));
    if (Array.isArray(excelRoster)) excelRoster.forEach(s => addCandidate(s, "roster"));
    if (Array.isArray(classroomStudents)) classroomStudents.forEach(s => addCandidate(s, "classroom"));
    if (activeProfile) addCandidate(activeProfile, "profile");

    const candidates = Array.from(candidateMap.values());

    // Matcher functions for student attributes
    const testNameMatch = (candName, inText) => {
      if (!candName || !inText) return false;
      const cn = normText(candName);
      if (cn === inText) return true;
      if (inText.length >= 2 && cn.includes(inText)) return true;
      if (cn.length >= 2 && inText.includes(cn)) return true;
      const cnWords = cn.split(" ");
      const inWords = inText.split(" ");
      if (inWords.some(w => w.length >= 3 && cnWords.includes(w))) return true;
      return false;
    };

    const testNisMatch = (candNis, candCode, inText, inNum, inAlpha) => {
      if (!inText) return false;
      const candNisStr = normText(candNis);
      const candCodeStr = normText(candCode);

      if (candNisStr && candNisStr === inText) return true;
      if (candCodeStr && candCodeStr === inText) return true;

      // Digits match (e.g. "001" equals "1")
      const candNum = normDigits(candNis);
      const codeNum = normDigits(candCode);
      if (inNum && (candNum === inNum || codeNum === inNum)) return true;

      // Alphanumeric match (e.g. FIVIA-X1-001 vs fiviax1001)
      if (inAlpha && (normAlphaNum(candCode) === inAlpha || normAlphaNum(candNis) === inAlpha)) return true;

      return false;
    };

    const testEmailMatch = (candEmail, inText) => {
      if (!candEmail || !inText) return false;
      const ce = normText(candEmail);
      return ce === inText || ce.split("@")[0] === inText;
    };

    const testPasswordMatch = (candPass, inRaw) => {
      if (!candPass || !inRaw) return false;
      const cp = normText(candPass);
      const ip = normText(inRaw);
      return cp === ip || String(candPass).trim() === inRaw;
    };

    // Find student matching any of the supported login patterns
    let matchedCandidate = null;

    for (const cand of candidates) {
      const nameOrEmailInId = testNameMatch(cand.name, inputId) || testEmailMatch(cand.email, inputId);
      const nisOrPassInPass = testNisMatch(cand.nis, cand.studentCode, inputPass, inputPassDigits, inputPassAlpha) || testPasswordMatch(cand.password, rawPass);

      // Pattern 1: Identifier = Name/Email, Password = NIS/Password
      if (nameOrEmailInId && nisOrPassInPass) {
        matchedCandidate = cand;
        break;
      }

      // Pattern 2: Swapped fields: Identifier = NIS, Password = Name/Password/NIS
      const nisInId = testNisMatch(cand.nis, cand.studentCode, inputId, inputIdDigits, inputIdAlpha);
      const nameOrPassInPass = testNameMatch(cand.name, inputPass) || testPasswordMatch(cand.password, rawPass) || testNisMatch(cand.nis, cand.studentCode, inputPass, inputPassDigits, inputPassAlpha);

      if (nisInId && nameOrPassInPass) {
        matchedCandidate = cand;
        break;
      }

      // Pattern 3: Both fields entered as NIS
      if (nisInId && testNisMatch(cand.nis, cand.studentCode, inputPass, inputPassDigits, inputPassAlpha)) {
        matchedCandidate = cand;
        break;
      }
    }

    // Pattern 5: Real-time Cloud Firestore Lookup (fast 800ms timeout if network is slow)
    if (!matchedCandidate && window.FIVIA_FIREBASE && window.FIVIA_FIREBASE.db && window.FIVIA_FIREBASE.isInitialized) {
      try {
        const firestore = window.FIVIA_FIREBASE.db;
        const collections = ["vlab_student_roster", "vlab_students", "vlab_users"];
        const fetchTimeout = (p, ms = 800) => Promise.race([p, new Promise((_, rej) => setTimeout(() => rej(new Error("Timeout")), ms))]);
        for (const col of collections) {
          const snap = await fetchTimeout(firestore.collection(col).get());
          if (!snap.empty) {
            for (const doc of snap.docs) {
              const data = doc.data();
              const candName = data.name || data.studentName || data.displayName;
              const candNis = data.nis || data.studentCode;
              const candPass = data.password;

              const isNameMatch = testNameMatch(candName, inputId) || (data.email && testEmailMatch(data.email, inputId));
              const isNisMatch = testNisMatch(candNis, data.studentCode, inputPass, inputPassDigits, inputPassAlpha) || testPasswordMatch(candPass, rawPass);
              const isInvertedMatch = testNisMatch(candNis, data.studentCode, inputId, inputIdDigits, inputIdAlpha) &&
                                      (testNameMatch(candName, inputPass) || testPasswordMatch(candPass, rawPass));

              if ((isNameMatch && isNisMatch) || isInvertedMatch) {
                matchedCandidate = {
                  id: doc.id,
                  name: candName || "Siswa",
                  nis: candNis || rawPass,
                  studentCode: data.studentCode || ('FIVIA-' + candNis),
                  email: data.email || `${normAlphaNum(candName)}@sekolah.id`,
                  password: candPass || rawPass,
                  classId: data.className || data.classId || "cls_x1",
                  role: "siswa"
                };
                if (window.syncStudentRecordLocally) {
                  window.syncStudentRecordLocally(matchedCandidate);
                }
                break;
              }
            }
          }
          if (matchedCandidate) break;
        }
      } catch (cloudErr) {
        console.warn("[Auth] Cloud Firestore lookup error:", cloudErr);
      }
    }

    if (matchedCandidate) {
      // Sync into users table
      const finalStudentCode = matchedCandidate.studentCode || (window.FIVIAExcelImport ? window.FIVIAExcelImport.generateStudentCode(matchedCandidate.nis || '001', matchedCandidate.classId) : ('FIVIA-' + (matchedCandidate.nis || 'STD')));
      const finalNis = matchedCandidate.nis || rawPass;
      const finalUserRecord = {
        id: matchedCandidate.id,
        name: matchedCandidate.name,
        email: matchedCandidate.email,
        role: "siswa",
        nis: finalNis,
        studentCode: finalStudentCode,
        classId: matchedCandidate.classId || "cls_x1",
        password: matchedCandidate.password || rawPass
      };

      if (window.db && typeof window.db.getTable === "function") {
        const dbUsers = window.db.getTable("users") || [];
        const uIdx = dbUsers.findIndex(u => u.id === finalUserRecord.id || (u.nis && normDigits(u.nis) === normDigits(finalNis)) || (u.name && normText(u.name) === normText(finalUserRecord.name)));
        if (uIdx >= 0) {
          dbUsers[uIdx] = { ...dbUsers[uIdx], ...finalUserRecord };
        } else {
          dbUsers.push(finalUserRecord);
        }
        window.db.saveTable("users", dbUsers);

        // Also update students table
        const dbStudents = window.db.getTable("students") || [];
        const sIdx = dbStudents.findIndex(s => s.id === finalUserRecord.id || (s.nis && normDigits(s.nis) === normDigits(finalNis)) || (s.name && normText(s.name) === normText(finalUserRecord.name)));
        const stdRecord = {
          id: finalUserRecord.id,
          name: finalUserRecord.name,
          nis: finalUserRecord.nis,
          studentCode: finalStudentCode,
          classId: finalUserRecord.classId,
          email: finalUserRecord.email
        };
        if (sIdx >= 0) {
          dbStudents[sIdx] = { ...dbStudents[sIdx], ...stdRecord };
        } else {
          dbStudents.push(stdRecord);
        }
        window.db.saveTable("students", dbStudents);
      }

      // Sync active student profile & session for Quest & Labs
      if (window.FIVIAStudent && typeof window.FIVIAStudent.saveStudentProfile === "function") {
        window.FIVIAStudent.saveStudentProfile({
          name: finalUserRecord.name,
          nis: finalUserRecord.nis,
          studentCode: finalStudentCode,
          className: finalUserRecord.classId
        });
      }
      if (window.FIVIAStudentSession && typeof window.FIVIAStudentSession.startStudentSession === "function") {
        window.FIVIAStudentSession.startStudentSession(finalUserRecord.name, finalUserRecord.classId, finalStudentCode);
      }

      return this._setSessionUser(finalUserRecord);
    }

    return { success: false, message: "Nama Lengkap atau NIS tidak cocok dengan data siswa yang terdaftar!" };
  }

  _setSessionUser(user) {
    const sessionUser = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      nis: user.nis || null,
      studentCode: user.studentCode || (user.nis ? ('FIVIA-' + user.nis) : null),
      classId: user.classId || null
    };

    this.currentUser = sessionUser;
    localStorage.setItem(SESSION_KEY, JSON.stringify(sessionUser));

    // Dispatch custom event for layout & routing updates
    window.dispatchEvent(new Event("authChange"));

    return { success: true, user: sessionUser };
  }

  logout() {
    this.currentUser = null;
    localStorage.removeItem(SESSION_KEY);
    // Dispatch custom event for app routing
    window.dispatchEvent(new Event("authChange"));
    return true;
  }

  register(name, email, password, role, classId = null, nis = null) {
    const users = (window.db && window.db.getTable("users")) || [];
    const emailExists = users.some(u => u.email && u.email.toLowerCase() === email.toLowerCase().trim());

    if (emailExists) {
      return { success: false, message: "Email sudah terdaftar!" };
    }

    const newUserId = "usr_" + Math.random().toString(36).substr(2, 9);
    const assignedNis = (role === "siswa") ? (nis || password || Math.floor(10000 + Math.random() * 90000).toString()) : null;
    const studentCode = assignedNis ? (window.FIVIAExcelImport ? window.FIVIAExcelImport.generateStudentCode(assignedNis, classId || 'cls_x1') : ('FIVIA-' + assignedNis)) : null;

    const newUser = {
      id: newUserId,
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: password,
      role: role,
      nis: assignedNis,
      studentCode: studentCode,
      classId: classId
    };

    users.push(newUser);
    if (window.db) window.db.saveTable("users", users);

    // If student, sync to all student lists
    if (role === "siswa") {
      const students = (window.db && window.db.getTable("students")) || [];
      students.push({
        id: newUserId,
        name: newUser.name,
        nis: assignedNis,
        studentCode: studentCode,
        classId: classId,
        email: newUser.email
      });
      if (window.db) window.db.saveTable("students", students);

      // Sync to fivia_student_roster
      try {
        let roster = [];
        if (window.FIVIAExcelImport && typeof window.FIVIAExcelImport.getExistingRoster === "function") {
          roster = window.FIVIAExcelImport.getExistingRoster() || [];
        } else {
          const raw = localStorage.getItem("fivia_student_roster");
          if (raw) roster = JSON.parse(raw);
        }
        roster.push({
          studentId: newUserId,
          id: newUserId,
          studentCode: studentCode,
          name: newUser.name,
          nis: assignedNis,
          className: classId || 'Kelas X-1',
          classId: classId || 'cls_x1',
          xp: 0
        });
        localStorage.setItem("fivia_student_roster", JSON.stringify(roster));
        if (window.FIVIAExcelImport && typeof window.FIVIAExcelImport.saveRoster === "function") {
          window.FIVIAExcelImport.saveRoster(roster);
        }
      } catch (e) {}

      // Save student profile
      if (window.FIVIAStudent && typeof window.FIVIAStudent.saveStudentProfile === "function") {
        window.FIVIAStudent.saveStudentProfile({
          name: newUser.name,
          nis: assignedNis,
          studentCode: studentCode,
          className: classId
        });
      }
      if (window.FIVIAStudentSession && typeof window.FIVIAStudentSession.startStudentSession === "function") {
        window.FIVIAStudentSession.startStudentSession(newUser.name, classId, studentCode);
      }
    }

    // Direct Cloud Firestore Sync for new accounts
    try {
      if (window.syncLocalChangeToCloud) {
        window.syncLocalChangeToCloud("users", newUser);
        if (role === "guru") window.syncLocalChangeToCloud("teachers", newUser);
        if (role === "siswa") window.syncLocalChangeToCloud("students", newUser);
      }
      if (window.FIVIA_FIREBASE && window.FIVIA_FIREBASE.db && window.FIVIA_FIREBASE.isInitialized) {
        window.FIVIA_FIREBASE.db.collection("vlab_users").doc(newUser.id).set(newUser, { merge: true }).catch(() => {});
        if (role === "guru") window.FIVIA_FIREBASE.db.collection("vlab_teachers").doc(newUser.id).set(newUser, { merge: true }).catch(() => {});
        if (role === "siswa") window.FIVIA_FIREBASE.db.collection("vlab_students").doc(newUser.id).set(newUser, { merge: true }).catch(() => {});
      }
      if (typeof writeDocToFirestoreREST === "function") {
        writeDocToFirestoreREST("vlab_users", newUser.id, newUser).catch(() => {});
        if (role === "guru") writeDocToFirestoreREST("vlab_teachers", newUser.id, newUser).catch(() => {});
        if (role === "siswa") writeDocToFirestoreREST("vlab_students", newUser.id, newUser).catch(() => {});
      }
    } catch (_) {}

    // Auto login
    return this._setSessionUser(newUser);
  }

  updatePassword(userId, newPassword) {
    if (!newPassword || String(newPassword).trim().length < 4) {
      return { success: false, message: "Kata sandi minimal 4 karakter!" };
    }

    const cleanPass = String(newPassword).trim();
    const users = (window.db && window.db.getTable("users")) || [];
    const idx = users.findIndex(u => u.id === userId || (u.email && this.currentUser && u.email === this.currentUser.email));

    if (idx === -1) {
      return { success: false, message: "Data akun tidak ditemukan!" };
    }

    users[idx].password = cleanPass;
    if (window.db) window.db.saveTable("users", users);

    // Update active session if changing current user
    if (this.currentUser && (this.currentUser.id === users[idx].id || this.currentUser.email === users[idx].email)) {
      this.currentUser.password = cleanPass;
      localStorage.setItem(SESSION_KEY, JSON.stringify(this.currentUser));
      window.dispatchEvent(new Event("authChange"));
    }

    // Direct cloud sync to Firestore
    try {
      const userDoc = { ...users[idx] };
      if (window.syncLocalChangeToCloud) {
        window.syncLocalChangeToCloud("users", userDoc);
        if (userDoc.role === "guru") window.syncLocalChangeToCloud("teachers", userDoc);
      }
      if (window.FIVIA_FIREBASE && window.FIVIA_FIREBASE.db && window.FIVIA_FIREBASE.isInitialized) {
        window.FIVIA_FIREBASE.db.collection("vlab_users").doc(userDoc.id).set(userDoc, { merge: true }).catch(() => {});
        if (userDoc.role === "guru") {
          window.FIVIA_FIREBASE.db.collection("vlab_teachers").doc(userDoc.id).set(userDoc, { merge: true }).catch(() => {});
        }
      }
      if (typeof writeDocToFirestoreREST === "function") {
        writeDocToFirestoreREST("vlab_users", userDoc.id, userDoc).catch(() => {});
        if (userDoc.role === "guru") {
          writeDocToFirestoreREST("vlab_teachers", userDoc.id, userDoc).catch(() => {});
        }
      }
    } catch (err) {
      console.warn("[Auth] Cloud password sync error:", err);
    }

    return { success: true, message: "Kata sandi berhasil diperbarui!" };
  }
}

// Instantiate globally
const auth = new AuthManager();
window.auth = auth;
