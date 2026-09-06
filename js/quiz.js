/**
 * quiz.js
 * Renders multi-format HOTS quizzes (Pilihan Ganda, Benar/Salah, Mencocokkan, Pilihan Ganda Kompleks, Isian Singkat),
 * timer countdowns, and displays grading feedback solutions.
 */

let activeQuiz = null;
let activeMaterialId = null;
let activeQuestions = [];
let currentQuestionIdx = 0;
let studentAnswers = []; // holds answers per question format
let quizTimerInterval = null;
let quizSecondsRemaining = 600; // 10 minutes default

function renderQuiz(materialId) {
  const user = window.auth.getCurrentUser();
  if (!user) return;

  activeMaterialId = parseInt(materialId);
  const material = window.db.getMaterial(activeMaterialId);
  if (!material) {
    window.location.hash = "#dashboard";
    return;
  }

  // Load quiz configuration
  activeQuiz = window.db.getQuizForMaterial(activeMaterialId);
  activeQuestions = (activeQuiz && activeQuiz.questions && activeQuiz.questions.length > 0) 
    ? activeQuiz.questions 
    : getFallbackQuizQuestions(activeMaterialId);

  // Reset quiz states
  currentQuestionIdx = 0;
  studentAnswers = new Array(activeQuestions.length).fill(null);
  quizSecondsRemaining = 600;

  // Render navigation buttons
  document.getElementById("btn-quiz-prev").style.display = "inline-flex";
  document.getElementById("btn-quiz-next").textContent = "Berikutnya";

  // Bind buttons
  document.getElementById("btn-quiz-prev").onclick = prevQuestion;
  document.getElementById("btn-quiz-next").onclick = nextQuestion;

  // Start timer
  startQuizTimer();

  // Render first question
  showQuestion(0);
}

function startQuizTimer() {
  if (quizTimerInterval) clearInterval(quizTimerInterval);
  
  const timerEl = document.getElementById("quiz-timer");
  if (!timerEl) return;

  const updateTimerDisplay = () => {
    const mins = Math.floor(quizSecondsRemaining / 60);
    const secs = quizSecondsRemaining % 60;
    timerEl.innerHTML = `<i class="far fa-clock"></i> ${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  updateTimerDisplay();

  quizTimerInterval = setInterval(() => {
    quizSecondsRemaining--;
    if (quizSecondsRemaining <= 0) {
      clearInterval(quizTimerInterval);
      timerEl.textContent = "Waktu Habis!";
      finishQuiz(true); // force submission
    } else {
      updateTimerDisplay();
    }
  }, 1000);
}

function detectQuestionType(q) {
  if (q.type) return q.type;
  if (q.pairs && q.pairs.length > 0) return "matching";
  if (q.correctAnswers) {
    if (Array.isArray(q.correctAnswers) && typeof q.correctAnswers[0] === 'number') return "multiple_select";
    return "short_answer";
  }
  if (q.options && q.options.length === 2 && (q.options[0] === "BENAR" || q.options[0] === "SALAH")) return "true_false";
  return "multiple_choice";
}

function showQuestion(idx) {
  currentQuestionIdx = idx;
  const q = activeQuestions[idx];
  const container = document.getElementById("quiz-body-container");
  if (!container) return;

  // Hide/Show buttons
  document.getElementById("btn-quiz-prev").style.visibility = idx === 0 ? "hidden" : "visible";
  document.getElementById("btn-quiz-next").textContent = idx === activeQuestions.length - 1 ? "Selesai" : "Berikutnya";

  const type = detectQuestionType(q);
  
  let typeBadge = "";
  if (type === "multiple_choice") typeBadge = `<span class="badge" style="background:#0284c7; color:#fff; padding: 4px 12px; font-size:0.8rem; border-radius:12px;"><i class="fas fa-list-ul"></i> Pilihan Ganda</span>`;
  else if (type === "true_false") typeBadge = `<span class="badge" style="background:#eab308; color:#000; padding: 4px 12px; font-size:0.8rem; border-radius:12px;"><i class="fas fa-check-double"></i> Benar / Salah</span>`;
  else if (type === "matching") typeBadge = `<span class="badge" style="background:#a855f7; color:#fff; padding: 4px 12px; font-size:0.8rem; border-radius:12px;"><i class="fas fa-project-diagram"></i> Mencocokkan</span>`;
  else if (type === "multiple_select") typeBadge = `<span class="badge" style="background:#14b8a6; color:#fff; padding: 4px 12px; font-size:0.8rem; border-radius:12px;"><i class="fas fa-tasks"></i> Pilihan Ganda Kompleks</span>`;
  else if (type === "short_answer") typeBadge = `<span class="badge" style="background:#ec4899; color:#fff; padding: 4px 12px; font-size:0.8rem; border-radius:12px;"><i class="fas fa-pen-nib"></i> Isian Singkat</span>`;

  let html = `
    <div class="glass-panel" style="padding: 24px; margin-bottom: 20px; background-color: var(--bg-primary);">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 8px;">
        <div style="font-size: 0.85rem; font-weight: bold; color: var(--brand-blue);">SOAL ${idx + 1} DARI ${activeQuestions.length}</div>
        ${typeBadge}
      </div>
      <p style="font-weight: 600; line-height: 1.6; font-size: 1.05rem; color: var(--text-primary); whitespace: pre-line;">${q.question}</p>
    </div>
    
    <div style="display: flex; flex-direction: column; gap: 12px;" id="quiz-options-group">
  `;

  // 1. Multiple Choice & True/False
  if (type === "multiple_choice" || type === "true_false") {
    const opts = q.options || (type === "true_false" ? ["BENAR", "SALAH"] : []);
    opts.forEach((opt, optIdx) => {
      const isSelected = studentAnswers[idx] === optIdx;
      const optText = typeof opt === 'object' ? (opt.label || opt.text || '') : opt;
      const label = type === "true_false" ? (optIdx === 0 ? "✓ BENAR" : "✕ SALAH") : `${String.fromCharCode(65 + optIdx)}.`;
      
      html += `
        <button type="button" class="btn btn-outline ${isSelected ? 'btn-primary' : ''}" 
                style="justify-content: flex-start; padding: 16px 20px; text-align: left; font-weight: 500; min-height: 56px; border-radius: 12px;"
                onclick="selectSingleOption(${idx}, ${optIdx})">
          <span style="font-weight: bold; margin-right: 12px; color: ${isSelected ? '#fff' : 'var(--brand-orange)'}; font-size: 1.1rem;">${label}</span> ${optText}
        </button>
      `;
    });
  } 
  // 2. Multiple Select (Pilihan Ganda Kompleks)
  else if (type === "multiple_select") {
    const currentSelections = Array.isArray(studentAnswers[idx]) ? studentAnswers[idx] : [];
    html += `<div style="font-size:0.9rem; color: var(--brand-orange); font-weight: bold; margin-bottom: 6px;"><i class="fas fa-check-square"></i> Pilih SEMUA opsi jawaban yang benar (Lebih dari 1):</div>`;
    (q.options || []).forEach((opt, optIdx) => {
      const isSelected = currentSelections.includes(optIdx);
      const optText = typeof opt === 'object' ? (opt.label || opt.text || '') : opt;
      const label = String.fromCharCode(65 + optIdx);
      
      html += `
        <button type="button" class="btn btn-outline ${isSelected ? 'btn-primary' : ''}" 
                style="justify-content: flex-start; padding: 16px 20px; text-align: left; font-weight: 500; min-height: 56px; border-radius: 12px;"
                onclick="toggleMultipleOption(${idx}, ${optIdx})">
          <span style="font-weight: bold; margin-right: 12px; color: ${isSelected ? '#fff' : 'var(--brand-orange)'}; font-size: 1.1rem;">${isSelected ? '[✓]' : '[  ]'} ${label}.</span> ${optText}
        </button>
      `;
    });
  } 
  // 3. Short Answer (Isian Singkat)
  else if (type === "short_answer") {
    const val = studentAnswers[idx] !== null && studentAnswers[idx] !== undefined ? studentAnswers[idx] : '';
    html += `
      <div style="background: rgba(30,41,59,0.5); padding: 22px; border-radius: 16px; border: 1.5px solid var(--brand-blue);">
        <label style="display: block; font-weight: bold; margin-bottom: 10px; color: var(--text-primary); font-size: 1rem;"><i class="fas fa-keyboard"></i> Ketikkan Jawaban Anda:</label>
        <input type="text" id="short-answer-input-${idx}" class="form-control" style="width: 100%; padding: 14px 18px; font-size: 1.1rem; border-radius: 10px; background: var(--bg-secondary, #0f172a); color: #fff; border: 1.5px solid var(--brand-blue);"
               value="${val.replace(/"/g, '&quot;')}" placeholder="Ketikkan teks, simbol, atau angka jawaban..." oninput="updateShortAnswer(${idx}, this.value)" />
      </div>
    `;
  } 
  // 4. Matching (Mencocokkan)
  else if (type === "matching") {
    const currentMatches = studentAnswers[idx] && typeof studentAnswers[idx] === 'object' ? studentAnswers[idx] : {};
    const pairs = q.pairs || [];
    const rightOptions = pairs.map(p => p.right);
    
    html += `<div style="font-size:0.9rem; color: var(--brand-orange); font-weight: bold; margin-bottom: 8px;"><i class="fas fa-project-diagram"></i> Pasangkan setiap item di sebelah kiri dengan pilihan yang tepat di sebelah kanan:</div>`;
    html += `<div style="display: flex; flex-direction: column; gap: 14px;">`;
    pairs.forEach((p, pIdx) => {
      const selectedVal = currentMatches[pIdx] || '';
      html += `
        <div style="display: grid; grid-template-columns: 1fr 1.2fr; gap: 12px; align-items: center; background: rgba(30,41,59,0.6); padding: 16px 20px; border-radius: 14px; border: 1px solid var(--brand-cyan, #06b6d4);">
          <div style="font-weight: 700; color: #fff; font-size: 0.98rem;">${pIdx + 1}. ${p.left}</div>
          <div>
            <select class="form-control" style="width: 100%; padding: 10px 14px; border-radius: 8px; background: #0f172a; color: #fff; border: 1.5px solid var(--brand-cyan, #06b6d4); font-weight: 600;"
                    onchange="updateMatchingAnswer(${idx}, ${pIdx}, this.value)">
              <option value="">-- Pilih Pasangan --</option>
              ${rightOptions.map(rOpt => `<option value="${rOpt.replace(/"/g, '&quot;')}" ${selectedVal === rOpt ? 'selected' : ''}>${rOpt}</option>`).join('')}
            </select>
          </div>
        </div>
      `;
    });
    html += `</div>`;
  }

  html += `</div>`;
  container.innerHTML = html;
}

function selectSingleOption(qIdx, optIdx) {
  studentAnswers[qIdx] = optIdx;
  showQuestion(qIdx);
}

function toggleMultipleOption(qIdx, optIdx) {
  if (!Array.isArray(studentAnswers[qIdx])) {
    studentAnswers[qIdx] = [];
  }
  const pos = studentAnswers[qIdx].indexOf(optIdx);
  if (pos > -1) {
    studentAnswers[qIdx].splice(pos, 1);
  } else {
    studentAnswers[qIdx].push(optIdx);
  }
  showQuestion(qIdx);
}

function updateShortAnswer(qIdx, val) {
  studentAnswers[qIdx] = val;
}

function updateMatchingAnswer(qIdx, pairIdx, val) {
  if (!studentAnswers[qIdx] || typeof studentAnswers[qIdx] !== 'object') {
    studentAnswers[qIdx] = {};
  }
  studentAnswers[qIdx][pairIdx] = val;
}

function prevQuestion() {
  if (currentQuestionIdx > 0) {
    showQuestion(currentQuestionIdx - 1);
  }
}

function nextQuestion() {
  const q = activeQuestions[currentQuestionIdx];
  const type = detectQuestionType(q);
  const ans = studentAnswers[currentQuestionIdx];

  // Validation
  if (ans === null || ans === undefined || (Array.isArray(ans) && ans.length === 0) || (typeof ans === 'string' && ans.trim() === '')) {
    window.showToast("Harap isi atau pilih jawaban terlebih dahulu!", "warning");
    return;
  }

  if (currentQuestionIdx < activeQuestions.length - 1) {
    showQuestion(currentQuestionIdx + 1);
  } else {
    if (confirm("Apakah Anda yakin ingin menyelesaikan kuis ini?")) {
      finishQuiz();
    }
  }
}

function extractPairsFromQuestion(q) {
  if (!q) return [];
  if (Array.isArray(q.pairs) && q.pairs.length > 0) return q.pairs;

  const sources = [
    q.correctAnswer,
    Array.isArray(q.correctAnswers) ? q.correctAnswers.join('; ') : '',
    Array.isArray(q.options) ? q.options.map(o => (typeof o === 'object' ? (o.label || o.text || o.id) : o)).join('; ') : '',
    q.explanation
  ];

  for (let src of sources) {
    if (!src || typeof src !== 'string') continue;
    const text = src.replace(/<br\s*\/?>/gi, '\n').replace(/&rarr;/g, '->');
    const lines = text.split(/[\n;]+/).map(s => s.trim()).filter(Boolean);
    const pairs = [];
    lines.forEach(line => {
      let parts = [];
      let sep = '';
      if (line.includes('=')) { parts = line.split('='); sep = '='; }
      else if (line.includes('->')) { parts = line.split('->'); sep = '->'; }
      else if (line.includes('=>')) { parts = line.split('=>'); sep = '=>'; }
      else if (line.includes('–')) { parts = line.split('–'); sep = '–'; }
      else if (line.includes(':')) { parts = line.split(':'); sep = ':'; }
      else if (line.includes('-')) { parts = line.split('-'); sep = '-'; }

      if (parts.length >= 2) {
        const left = parts[0].trim();
        const right = parts.slice(1).join(sep).trim();
        if (left && right && left.length < 60 && right.length < 60) {
          pairs.push({ left, right });
        }
      }
    });
    if (pairs.length >= 2) return pairs;
  }

  return [];
}
window.extractPairsFromQuestion = extractPairsFromQuestion;

function evaluateQuestionAnswer(q, studentAns) {
  if (studentAns === null || studentAns === undefined) return false;
  const type = q.type || (q.pairs ? "matching" : q.correctAnswers ? (Array.isArray(q.correctAnswers) && typeof q.correctAnswers[0] === 'number' ? "multiple_select" : "short_answer") : "multiple_choice");

  if (type === "multiple_choice" || type === "true_false") {
    const sStr = String(studentAns).trim().toUpperCase();
    const rawTarget = String(q.correctAnswer || q.correct || '').trim().toUpperCase();
    if (!sStr || !rawTarget) return false;
    
    // Extract letter A-D from target if present (e.g. "B. PANJANG", "OPTION B", "KUNCI: B" -> "B")
    const letterMatch = rawTarget.match(/(?:KUNCI|OPSI|OPTION|JAWABAN)?\s*[\:\.\-\(]*\s*([A-D])(?:\b|[\)\.\:\-]|$)/i);
    const targetLetter = letterMatch ? letterMatch[1].toUpperCase() : (rawTarget.length === 1 && rawTarget >= 'A' && rawTarget <= 'Z' ? rawTarget : '');

    // Extract letter A-D from studentAns if present
    const sLetterMatch = sStr.match(/(?:OPSI|OPTION|JAWABAN)?\s*[\:\.\-\(]*\s*([A-D])(?:\b|[\)\.\:\-]|$)/i);
    const studentLetter = sLetterMatch ? sLetterMatch[1].toUpperCase() : (sStr.length === 1 && sStr >= 'A' && sStr <= 'Z' ? sStr : '');

    // Direct letter comparison if both student answer and target have single-letter representations (e.g. studentAns='A'/'B', target='B')
    if (studentLetter && targetLetter) {
      return studentLetter === targetLetter;
    }

    // Direct exact string comparison
    if (sStr === targetLetter && sStr !== '') return true;
    if (sStr === rawTarget && sStr !== '') return true;

    // Numeric index match (0 -> 'A', 1 -> 'B')
    if (!isNaN(studentAns)) {
      const letter = String.fromCharCode(65 + Number(studentAns));
      if (letter === targetLetter || letter === rawTarget) return true;
    }

    // Letter to index match ('A' -> 0)
    if (typeof studentAns === 'string' && studentAns.length === 1 && !isNaN(q.correct)) {
      const idx = studentAns.charCodeAt(0) - 65;
      if (idx === Number(q.correct)) return true;
    }

    // Option label matching
    if (q.options && Array.isArray(q.options)) {
      const selectedOpt = q.options.find((o, i) => (o.id || String.fromCharCode(65 + i)).toUpperCase() === sStr || (o.id || String.fromCharCode(65 + i)).toUpperCase() === studentLetter);
      if (selectedOpt) {
        const labelUpper = (selectedOpt.label || selectedOpt.text || '').trim().toUpperCase();
        if (labelUpper && rawTarget) {
          if (labelUpper === rawTarget) return true;
          // Avoid matching single letter targets ('A', 'B') against labels via substring inclusion ('BENAR' contains 'B', 'SALAH' contains 'A')
          if (rawTarget.length > 2 && (rawTarget.includes(labelUpper) || labelUpper.includes(rawTarget))) return true;
        }
      }
    }

    return false;
  }

  if (type === "short_answer") {
    if (studentAns === null || studentAns === undefined) return false;
    const cleanStd = String(studentAns).replace(',', '.').trim().toLowerCase();
    let correctAnswers = q.correctAnswers;
    if (!correctAnswers || !Array.isArray(correctAnswers) || correctAnswers.length === 0) {
      if (q.correctAnswer) {
        correctAnswers = String(q.correctAnswer).split(/[\,\;\|\/]+/).map(s => s.trim()).filter(Boolean);
      } else if (q.correct !== undefined) {
        correctAnswers = [String(q.correct)];
      } else {
        correctAnswers = [];
      }
    }
    return correctAnswers.some(c => {
      const cleanC = String(c).replace(/^(KUNCI|JAWABAN|KEY|KUNCI JAWABAN)\s*[\:\=]?\s*/i, '').replace(',', '.').trim().toLowerCase();
      if (!cleanC) return false;
      return cleanC === cleanStd || (cleanStd.length >= 3 && cleanC.length >= 3 && (cleanStd.includes(cleanC) || cleanC.includes(cleanStd)));
    });
  }

  if (type === "multiple_select") {
    let studentArray = studentAns;
    if (!Array.isArray(studentArray)) {
      if (typeof studentAns === 'string') {
        studentArray = studentAns.split(/[\,\;\|\/\s&]+/).map(s => s.trim()).filter(Boolean);
      } else if (studentAns !== null && studentAns !== undefined) {
        studentArray = [studentAns];
      } else {
        return false;
      }
    }

    let rawTargets = q.correctAnswers;
    if (!rawTargets || !Array.isArray(rawTargets) || rawTargets.length === 0) {
      if (q.correct !== undefined) {
        rawTargets = Array.isArray(q.correct) ? q.correct : [q.correct];
      } else if (q.correctAnswer) {
        if (Array.isArray(q.correctAnswer)) {
          rawTargets = q.correctAnswer;
        } else {
          rawTargets = String(q.correctAnswer).split(/[\,\;\|\/\s&]+/).map(s => s.trim()).filter(Boolean);
        }
      } else {
        rawTargets = [];
      }
    }

    if (studentArray.length !== rawTargets.length || rawTargets.length === 0) return false;

    const normalizeItem = (x) => {
      if (typeof x === 'number') return x;
      const str = String(x).trim().toUpperCase();
      const mLetter = str.match(/^[A-D]$/i);
      if (mLetter) return mLetter[0].charCodeAt(0) - 65;
      return isNaN(str) ? str : Number(str);
    };

    const stdSet = new Set(studentArray.map(normalizeItem));
    const targetSet = new Set(rawTargets.map(normalizeItem));

    if (stdSet.size !== targetSet.size) return false;
    for (let val of stdSet) {
      if (!targetSet.has(val)) return false;
    }
    return true;
  }

  if (type === "matching") {
    let pairs = q.pairs;
    if (!pairs || !Array.isArray(pairs) || pairs.length === 0) {
      pairs = extractPairsFromQuestion(q);
    }
    if (!pairs || pairs.length === 0) return false;

    let ansObj = studentAns;
    if (typeof ansObj === 'string') {
      try {
        ansObj = JSON.parse(ansObj);
      } catch (e) {
        ansObj = {};
        const parts = studentAns.split(/[\n;]+/);
        parts.forEach((pt, i) => {
          const pairParts = pt.split(/->|=>|=|-|:/);
          if (pairParts.length >= 2) {
            ansObj[i] = pairParts[1].trim();
            ansObj[pairParts[0].trim()] = pairParts[1].trim();
          }
        });
      }
    }

    if (!ansObj || typeof ansObj !== 'object') return false;

    const normalizeStr = (str) => {
      if (str === null || str === undefined) return '';
      return String(str)
        .replace(/&quot;/g, '"')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/\s+/g, ' ')
        .trim()
        .toLowerCase();
    };

    const rightOptions = pairs.map(p => p.right);

    return pairs.every((p, pIdx) => {
      let rawUserVal = ansObj[pIdx];
      if (rawUserVal === undefined) rawUserVal = ansObj[String(pIdx)];
      if (rawUserVal === undefined && p.left) rawUserVal = ansObj[p.left];
      if (rawUserVal === undefined && p.left) rawUserVal = ansObj[p.left.trim()];
      
      if (rawUserVal === undefined || rawUserVal === null || rawUserVal === '') return false;

      const userStr = String(rawUserVal).trim();
      const targetStr = String(p.right).trim();

      const userNorm = normalizeStr(userStr);
      const targetNorm = normalizeStr(targetStr);

      // Direct normalized text match
      if (userNorm === targetNorm && userNorm !== '') return true;

      // Index match (if studentAns passed 0, 1, 2 or "0", "1", "2")
      if (!isNaN(userStr) && userStr !== '') {
        const optIdx = Number(userStr);
        if (optIdx >= 0 && optIdx < rightOptions.length) {
          if (normalizeStr(rightOptions[optIdx]) === targetNorm) return true;
        }
      }

      // Letter match ('A' -> 0, 'B' -> 1)
      if (/^[A-Z]$/i.test(userStr)) {
        const optIdx = userStr.toUpperCase().charCodeAt(0) - 65;
        if (optIdx >= 0 && optIdx < rightOptions.length) {
          if (normalizeStr(rightOptions[optIdx]) === targetNorm) return true;
        }
      }

      // Substring match for long texts
      if (userNorm.length > 3 && targetNorm.length > 3) {
        if (userNorm.includes(targetNorm) || targetNorm.includes(userNorm)) return true;
      }

      return false;
    });
  }

  return false;
}

function finishQuiz(timeOut = false) {
  if (quizTimerInterval) clearInterval(quizTimerInterval);

  const user = window.auth.getCurrentUser();
  if (!user) return;

  // Grade quiz
  let correctCount = 0;
  activeQuestions.forEach((q, idx) => {
    if (evaluateQuestionAnswer(q, studentAnswers[idx])) {
      correctCount++;
    }
  });

  const score = Math.round((correctCount / activeQuestions.length) * 100);
  const passed = score >= 75;

  // Save to DB
  window.db.saveQuizScore({
    userId: user.id,
    materialId: activeMaterialId,
    score: score,
    answers: studentAnswers,
    passed: passed
  });

  // Render Result view template
  renderQuizResults(score, correctCount, passed);
}

function renderQuizResults(score, correctCount, passed) {
  const container = document.getElementById("quiz-body-container");
  if (!container) return;

  // Hide navigation footer buttons
  document.getElementById("btn-quiz-prev").style.visibility = "hidden";
  document.getElementById("btn-quiz-next").style.display = "none";

  const badgeClass = passed ? "badge-success" : "badge-danger";
  const predText = passed ? "LULUS (MEMENUHI KKM)" : "TIDAK LULUS (REMEDIAL)";
  const resultMessage = passed 
    ? "Selamat! Anda telah menguasai materi ini dengan baik. Sertifikat kelulusan Anda telah diterbitkan secara otomatis." 
    : "Jangan menyerah! Tinjau pembahasan di bawah ini dan silakan coba kuis lagi untuk meningkatkan nilai Anda.";

  let resultHtml = `
    <div class="glass-panel" style="padding: 30px; text-align: center; margin-bottom: 24px;">
      <i class="fas ${passed ? 'fa-award' : 'fa-redo-alt'}" style="font-size: 4rem; color: ${passed ? 'var(--brand-blue)' : 'var(--brand-orange)'}; margin-bottom: 16px;"></i>
      <h2 style="font-size: 1.8rem; margin-bottom: 8px;">Hasil Evaluasi Kuis</h2>
      <div style="font-size: 3.5rem; font-weight: 800; font-family: Poppins; color: ${passed ? 'var(--success)' : 'var(--danger)'}; margin-bottom: 12px;">
        ${score} <span style="font-size: 1.5rem; font-weight: normal; color: var(--text-secondary);">/ 100</span>
      </div>
      <span class="badge ${badgeClass}" style="padding: 6px 16px; font-size: 0.9rem; margin-bottom: 16px;">${predText}</span>
      <p style="color: var(--text-secondary); line-height: 1.6; max-width: 500px; margin: 0 auto;">${resultMessage}</p>
      
      <div style="display: flex; gap: 12px; justify-content: center; margin-top: 24px;">
        <a href="#dashboard" class="btn btn-secondary"><i class="fas fa-home"></i> Dashboard</a>
        ${passed 
          ? `<a href="#sertifikat" class="btn btn-orange"><i class="fas fa-medal"></i> Klaim Sertifikat</a>` 
          : `<button class="btn btn-orange" onclick="renderQuiz(${activeMaterialId})"><i class="fas fa-rotate-left"></i> Coba Kuis Lagi</button>`}
      </div>
    </div>

    <h3 style="margin-bottom: 16px;"><i class="fas fa-list-check" style="color: var(--brand-blue);"></i> Pembahasan dan Kunci Jawaban</h3>
  `;

  // Render question by question corrections
  activeQuestions.forEach((q, idx) => {
    const isCorrect = evaluateQuestionAnswer(q, studentAnswers[idx]);
    const type = detectQuestionType(q);
    const stdAns = studentAnswers[idx];

    let userAnsText = "";
    let correctAnsText = "";

    if (type === "multiple_choice" || type === "true_false") {
      const opts = q.options || (type === "true_false" ? ["BENAR", "SALAH"] : []);
      userAnsText = stdAns !== null ? opts[stdAns] : "Tidak Dijawab";
      correctAnsText = opts[q.correct];
    } else if (type === "short_answer") {
      userAnsText = stdAns || "Tidak Dijawab";
      correctAnsText = (q.correctAnswers || [q.correctAnswer]).join(" / ");
    } else if (type === "multiple_select") {
      const opts = q.options || [];
      userAnsText = Array.isArray(stdAns) ? stdAns.map(i => opts[i]).join(", ") : "Tidak Dijawab";
      const targetCorrect = q.correctAnswers || [q.correct];
      correctAnsText = targetCorrect.map(i => opts[i]).join(", ");
    } else if (type === "matching") {
      userAnsText = stdAns && typeof stdAns === 'object' ? Object.values(stdAns).join(", ") : "Tidak Dijawab";
      correctAnsText = (q.pairs || []).map(p => `${p.left} → ${p.right}`).join("; ");
    }

    resultHtml += `
      <div class="glass-panel" style="padding: 24px; margin-bottom: 16px; border-left: 5px solid ${isCorrect ? 'var(--success)' : 'var(--danger)'};">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
          <span style="font-weight: bold; color: var(--text-secondary);">Soal ${idx + 1}</span>
          <span class="badge ${isCorrect ? 'badge-success' : 'badge-danger'}">
            <i class="fas ${isCorrect ? 'fa-check' : 'fa-times'}"></i> ${isCorrect ? 'Benar' : 'Salah'}
          </span>
        </div>
        <p style="font-weight: 600; margin-bottom: 12px; font-size: 0.95rem;">${q.question}</p>
        
        <div style="font-size: 0.85rem; margin-bottom: 12px; display: flex; flex-direction: column; gap: 4px;">
          <span>• Jawaban Anda: <strong>${userAnsText}</strong></span>
          <span>• Kunci Jawaban: <strong style="color: var(--success);">${correctAnsText}</strong></span>
        </div>

        <div style="background-color: var(--bg-primary); padding: 12px 16px; border-radius: 8px; font-size: 0.85rem; line-height: 1.5;">
          <strong style="color: var(--brand-orange); display: block; margin-bottom: 4px;"><i class="fas fa-info-circle"></i> Pembahasan:</strong>
          ${q.explanation}
        </div>
      </div>
    `;
  });

  container.innerHTML = resultHtml;
}

function getFallbackQuizQuestions(materialId) {
  return [
    {
      id: "q1",
      type: "multiple_choice",
      question: "Manakah pasangan besaran dan satuan SI berikut yang BENAR?",
      options: ["Panjang - cm", "Massa - kg", "Waktu - Jam", "Suhu - Celsius"],
      correct: 1,
      explanation: "Kilogram (kg) adalah satuan pokok standar internasional (SI) untuk besaran massa."
    },
    {
      id: "q2",
      type: "true_false",
      question: "PERNYATAAN: Gaya berat dan massa benda adalah dua besaran yang sama persis dan ber-satuan kilogram.",
      options: ["BENAR", "SALAH"],
      correct: 1,
      explanation: "Pernyataan SALAH. Massa adalah jumlah materi (kg), sedangkan Berat adalah gaya gravitasi (Newton)."
    }
  ];
}

// Map globals
window.renderQuiz = renderQuiz;
window.evaluateQuestionAnswer = evaluateQuestionAnswer;

