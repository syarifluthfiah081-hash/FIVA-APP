/**
 * quiz.js
 * Renders multiple choice HOTS quizzes, timer countdowns, and displays grading feedback solutions
 */

let activeQuiz = null;
let activeMaterialId = null;
let activeQuestions = [];
let currentQuestionIdx = 0;
let studentAnswers = []; // indexes of selected options
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
  activeQuestions = activeQuiz.questions;

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

function showQuestion(idx) {
  currentQuestionIdx = idx;
  const q = activeQuestions[idx];
  const container = document.getElementById("quiz-body-container");
  if (!container) return;

  // Hide/Show buttons
  document.getElementById("btn-quiz-prev").style.visibility = idx === 0 ? "hidden" : "visible";
  document.getElementById("btn-quiz-next").textContent = idx === activeQuestions.length - 1 ? "Selesai" : "Berikutnya";

  container.innerHTML = `
    <div class="glass-panel" style="padding: 24px; margin-bottom: 20px; background-color: var(--bg-primary);">
      <div style="font-size: 0.85rem; font-weight: bold; color: var(--brand-blue); margin-bottom: 8px;">SOAL ${idx + 1} DARI ${activeQuestions.length}</div>
      <p style="font-weight: 600; line-height: 1.6; font-size: 1rem; color: var(--text-primary);">${q.question}</p>
    </div>
    
    <div style="display: flex; flex-direction: column; gap: 12px;" id="quiz-options-group">
      <!-- Options injected -->
    </div>
  `;

  const optionsContainer = document.getElementById("quiz-options-group");
  q.options.forEach((opt, optIdx) => {
    const isSelected = studentAnswers[idx] === optIdx;
    const btn = document.createElement("button");
    btn.className = `btn btn-outline ${isSelected ? "btn-primary" : ""}`;
    btn.style.justifyContent = "flex-start";
    btn.style.padding = "16px 20px";
    btn.style.textAlign = "left";
    btn.style.fontWeight = "500";
    
    // Label index (A, B, C, D)
    const label = String.fromCharCode(65 + optIdx);
    btn.innerHTML = `<span style="font-weight: bold; margin-right: 12px; color: ${isSelected ? '#fff' : 'var(--brand-orange)'};">${label}.</span> ${opt}`;
    
    btn.onclick = () => {
      // Toggle selection styling
      optionsContainer.querySelectorAll("button").forEach(b => b.classList.remove("btn-primary"));
      btn.classList.add("btn-primary");
      studentAnswers[idx] = optIdx;
    };
    optionsContainer.appendChild(btn);
  });
}

function prevQuestion() {
  if (currentQuestionIdx > 0) {
    showQuestion(currentQuestionIdx - 1);
  }
}

function nextQuestion() {
  // Save answer check
  if (studentAnswers[currentQuestionIdx] === null) {
    window.showToast("Harap pilih salah satu opsi jawaban!", "warning");
    return;
  }

  if (currentQuestionIdx < activeQuestions.length - 1) {
    showQuestion(currentQuestionIdx + 1);
  } else {
    // Finish Quiz
    if (confirm("Apakah Anda yakin ingin menyelesaikan kuis ini?")) {
      finishQuiz();
    }
  }
}

function finishQuiz(timeOut = false) {
  if (quizTimerInterval) clearInterval(quizTimerInterval);

  const user = window.auth.getCurrentUser();
  if (!user) return;

  // Grade quiz
  let correctCount = 0;
  activeQuestions.forEach((q, idx) => {
    if (studentAnswers[idx] === q.correct) {
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
    const isCorrect = studentAnswers[idx] === q.correct;
    const stdSelectionChar = String.fromCharCode(65 + studentAnswers[idx]);
    const correctSelectionChar = String.fromCharCode(65 + q.correct);

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
          <span>• Jawaban Anda: <strong>${stdSelectionChar}. ${q.options[studentAnswers[idx]]}</strong></span>
          <span>• Kunci Jawaban: <strong style="color: var(--success);">${correctSelectionChar}. ${q.options[q.correct]}</strong></span>
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

// Map globals
window.renderQuiz = renderQuiz;
