/**
 * FIVIA PROJECT ENGINE MODULE
 * Workflow State Machine, Planning Forms, Virtual Lab Linking & Submission
 */

window.FIVIAProjectEngine = (function() {
  'use strict';

  const STORAGE_KEYS = {
    PROJECT_PROGRESS: 'fivia_project_progress',
    PROJECT_RESULTS: 'fivia_project_results'
  };

  let currentProject = null;
  let projectState = 'PROJECT_INTRO';
  let projectFormData = {
    question: '',
    hypothesis: '',
    variables: { independent: '', dependent: '', control: '' },
    procedure: '',
    data: '',
    analysis: '',
    conclusion: '',
    reflection: ''
  };

  function startProject(projId) {
    currentProject = window.FIVIAProjectsData.getProjectById(projId);
    projectState = 'PROJECT_INTRO';
    
    // Load existing saved project data if available
    const saved = getSavedProjectResult(projId);
    if (saved && saved.formData) {
      projectFormData = { ...saved.formData };
    } else {
      projectFormData = {
        question: currentProject.questionPrompt || '',
        hypothesis: '',
        variables: { ...currentProject.variables },
        procedure: currentProject.procedureSteps ? currentProject.procedureSteps.join('\n') : '',
        data: '',
        analysis: '',
        conclusion: '',
        reflection: ''
      };
    }

    renderProjectUI();
  }

  function setProjectState(newState) {
    projectState = newState;
    renderProjectUI();
  }

  function updateFormField(fieldKey, val) {
    if (fieldKey.includes('.')) {
      const parts = fieldKey.split('.');
      projectFormData[parts[0]][parts[1]] = val;
    } else {
      projectFormData[fieldKey] = val;
    }
  }

  function getSavedProjectResult(projId) {
    const allResults = window.FIVIAStudent.safeStorageGet(STORAGE_KEYS.PROJECT_RESULTS, {});
    return allResults[projId] || null;
  }

  function submitProjectForEvaluation() {
    if (!currentProject) return;

    const evaluation = window.FIVIAProjectsData.evaluateProjectRubric({
      hypothesis: projectFormData.hypothesis,
      variables: projectFormData.variables,
      hasData: projectFormData.data.length > 0,
      analysis: projectFormData.analysis,
      conclusion: projectFormData.conclusion,
      reflection: projectFormData.reflection
    });

    const resultRecord = {
      projectId: currentProject.id,
      formData: { ...projectFormData },
      evaluation: evaluation,
      completedAt: new Date().toISOString()
    };

    const allResults = window.FIVIAStudent.safeStorageGet(STORAGE_KEYS.PROJECT_RESULTS, {});
    allResults[currentProject.id] = resultRecord;
    window.FIVIAStudent.safeStorageSet(STORAGE_KEYS.PROJECT_RESULTS, allResults);

    // Update progress state
    const progress = window.FIVIAStudent.safeStorageGet(STORAGE_KEYS.PROJECT_PROGRESS, { completedProjects: [], totalXp: 0 });
    if (!progress.completedProjects.includes(currentProject.id)) {
      progress.completedProjects.push(currentProject.id);
      progress.totalXp += 190; // Total 190 XP per project
    }
    window.FIVIAStudent.safeStorageSet(STORAGE_KEYS.PROJECT_PROGRESS, progress);

    // Update global student profile
    const student = window.FIVIAStudent.getStudentProfile();
    student.xp += 190;
    if (!Array.isArray(student.badges)) student.badges = [];
    if (!student.badges.includes('🔬 PROJECT SCIENTIST')) student.badges.push('🔬 PROJECT SCIENTIST');
    if (progress.completedProjects.length >= 5 && !student.badges.includes('🏆 PROJECT MASTER')) student.badges.push('🏆 PROJECT MASTER');
    if (currentProject.id === 'proj_05' && !student.badges.includes('🌱 FUTURE ENERGY DESIGNER')) student.badges.push('🌱 FUTURE ENERGY DESIGNER');
    window.FIVIAStudent.saveStudentProfile(student);

    projectState = 'PROJECT_EVALUATION';
    renderProjectUI();
  }

  function renderProjectUI() {
    const container = document.getElementById('fq-project-mission-container');
    if (!container || !currentProject) return;

    let contentHtml = '';

    if (projectState === 'PROJECT_INTRO') {
      contentHtml = `
        <div style="background: rgba(15, 23, 42, 0.95); border: 2px solid var(--fq-cyan); border-radius: 28px; padding: 36px; text-align: left;">
          <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 20px;">
            <div style="font-size: 3rem; color: var(--fq-cyan);"><i class="fas ${currentProject.icon}"></i></div>
            <div>
              <span class="fq-badge-pill"><i class="fas fa-rocket"></i> REAL-WORLD PROJECT MISSION</span>
              <h1 style="font-size: 2.2rem; font-weight: 900; color: #fff; margin: 4px 0;">${currentProject.title}</h1>
              <div style="color: var(--fq-cyan); font-weight: 700;">${currentProject.subtitle}</div>
            </div>
          </div>

          <div style="background: rgba(30,41,59,0.7); border: 1.5px solid var(--fq-border-cyan); border-radius: 20px; padding: 22px; margin-bottom: 24px;">
            <h3 style="color: var(--fq-amber); margin: 0 0 10px 0;"><i class="fas fa-scroll"></i> NARASI PENUGASAN PROYEK:</h3>
            <p style="color: #fff; font-size: 1rem; line-height: 1.6; margin: 0;">"${currentProject.narrative}"</p>
          </div>

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 16px; margin-bottom: 28px;">
            <div style="background: rgba(30,41,59,0.5); border: 1px solid var(--fq-border); border-radius: 16px; padding: 18px;">
              <h4 style="color: var(--fq-cyan); margin: 0 0 6px 0;"><i class="fas fa-tools"></i> Alat & Bahan</h4>
              <ul style="color: var(--fq-text-muted); font-size: 0.88rem; margin: 0; padding-left: 18px;">
                ${currentProject.tools.map(t => `<li>${t}</li>`).join('')}
              </ul>
            </div>
            <div style="background: rgba(30,41,59,0.5); border: 1px solid var(--fq-border); border-radius: 16px; padding: 18px;">
              <h4 style="color: var(--fq-emerald); margin: 0 0 6px 0;"><i class="fas fa-link"></i> Praktikum Terkait</h4>
              <p style="color: #fff; font-size: 0.9rem; margin: 0;">Terhubung langsung ke Virtual Physics Lab untuk pengambilan data eksperimen.</p>
            </div>
          </div>

          <div style="display: flex; gap: 14px;">
            <button class="fq-btn fq-btn-cyan fq-btn-lg" style="flex: 1;" onclick="window.FIVIAProjectEngine.setProjectState('PROJECT_PLAN')"><i class="fas fa-edit"></i> MULAI PERANCANGAN PROYEK</button>
            <button class="fq-btn fq-btn-outline fq-btn-lg" onclick="window.location.hash='#quest/project-mission'"><i class="fas fa-arrow-left"></i> KEMBALI</button>
          </div>
        </div>
      `;
    } else if (projectState === 'PROJECT_PLAN') {
      contentHtml = `
        <div style="background: rgba(15, 23, 42, 0.95); border: 2px solid var(--fq-cyan); border-radius: 28px; padding: 32px; text-align: left;">
          <span class="fq-badge-pill"><i class="fas fa-drafting-compass"></i> TAHAP 1 &bull; RENCANA & HIPOTESIS</span>
          <h2 style="font-size: 1.8rem; font-weight: 900; color: #fff; margin: 8px 0 20px 0;">PERANCANGAN HIPOTESIS DAN VARIABEL</h2>

          <div class="fq-form-group">
            <label class="fq-form-label" style="color: var(--fq-cyan);">1. Pertanyaan Penelitian Ilmiah</label>
            <textarea class="fq-input" style="height: 70px; font-family: inherit;" onchange="window.FIVIAProjectEngine.updateFormField('question', this.value)">${projectFormData.question}</textarea>
          </div>

          <div class="fq-form-group">
            <label class="fq-form-label" style="color: var(--fq-amber);">2. Hipotesis Awal Praktikan</label>
            <textarea class="fq-input" style="height: 90px; font-family: inherit;" placeholder="Tuliskan hipotesis ilmiah Anda..." onchange="window.FIVIAProjectEngine.updateFormField('hypothesis', this.value)">${projectFormData.hypothesis}</textarea>
          </div>

          <div style="background: rgba(30,41,59,0.6); border: 1px solid var(--fq-border); border-radius: 18px; padding: 20px; margin-bottom: 24px;">
            <h4 style="color: var(--fq-emerald); margin: 0 0 12px 0;"><i class="fas fa-cubes"></i> Identifikasi Variabel Penelitian</h4>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 14px;">
              <div>
                <label class="fq-form-label" style="font-size: 0.8rem;">Variabel Bebas</label>
                <input type="text" class="fq-input" value="${projectFormData.variables.independent}" onchange="window.FIVIAProjectEngine.updateFormField('variables.independent', this.value)">
              </div>
              <div>
                <label class="fq-form-label" style="font-size: 0.8rem;">Variabel Terikat</label>
                <input type="text" class="fq-input" value="${projectFormData.variables.dependent}" onchange="window.FIVIAProjectEngine.updateFormField('variables.dependent', this.value)">
              </div>
              <div>
                <label class="fq-form-label" style="font-size: 0.8rem;">Variabel Kontrol</label>
                <input type="text" class="fq-input" value="${projectFormData.variables.control}" onchange="window.FIVIAProjectEngine.updateFormField('variables.control', this.value)">
              </div>
            </div>
          </div>

          <div style="display: flex; gap: 14px;">
            <button class="fq-btn fq-btn-cyan fq-btn-lg" style="flex: 1;" onclick="window.FIVIAProjectEngine.launchLinkedLab()"><i class="fas fa-flask"></i> BUKA VIRTUAL LAB UNTUK EKSPERIMEN</button>
            <button class="fq-btn fq-btn-emerald fq-btn-lg" style="flex: 1;" onclick="window.FIVIAProjectEngine.setProjectState('PROJECT_DATA')"><i class="fas fa-forward"></i> LANJUT PENGISIAN DATA & ANALISIS</button>
          </div>
        </div>
      `;
    } else if (projectState === 'PROJECT_DATA') {
      contentHtml = `
        <div style="background: rgba(15, 23, 42, 0.95); border: 2px solid var(--fq-cyan); border-radius: 28px; padding: 32px; text-align: left;">
          <span class="fq-badge-pill"><i class="fas fa-chart-bar"></i> TAHAP 2 &bull; DATA & ANALISIS</span>
          <h2 style="font-size: 1.8rem; font-weight: 900; color: #fff; margin: 8px 0 20px 0;">PENGOLAHAN DATA DAN PEMBAHASAN</h2>

          <div class="fq-form-group">
            <label class="fq-form-label" style="color: var(--fq-amber);">3. Data Pengamatan Kuantitatif (Tabel / Grafik)</label>
            <textarea class="fq-input" style="height: 100px; font-family: inherit;" placeholder="Tuliskan atau tempelkan data hasil pengamatan dari Virtual Lab..." onchange="window.FIVIAProjectEngine.updateFormField('data', this.value)">${projectFormData.data}</textarea>
          </div>

          <div class="fq-form-group">
            <label class="fq-form-label" style="color: var(--fq-cyan);">4. Analisis Data & Pembahasan Hubungan Variabel</label>
            <textarea class="fq-input" style="height: 110px; font-family: inherit;" placeholder="Jelaskan hubungan antar variabel berdasarkan data yang diperoleh..." onchange="window.FIVIAProjectEngine.updateFormField('analysis', this.value)">${projectFormData.analysis}</textarea>
          </div>

          <div class="fq-form-group">
            <label class="fq-form-label" style="color: var(--fq-emerald);">5. Kesimpulan Ilmiah</label>
            <textarea class="fq-input" style="height: 90px; font-family: inherit;" placeholder="Tuliskan kesimpulan yang menjawab pertanyaan penelitian..." onchange="window.FIVIAProjectEngine.updateFormField('conclusion', this.value)">${projectFormData.conclusion}</textarea>
          </div>

          <div class="fq-form-group">
            <label class="fq-form-label" style="color: var(--fq-violet);">6. Refleksi & Evaluasi Pembelajaran</label>
            <textarea class="fq-input" style="height: 80px; font-family: inherit;" placeholder="Tuliskan tantangan dan refleksi apa yang Anda pelajari dari proyek ini..." onchange="window.FIVIAProjectEngine.updateFormField('reflection', this.value)">${projectFormData.reflection}</textarea>
          </div>

          <div style="display: flex; gap: 14px;">
            <button class="fq-btn fq-btn-cyan fq-btn-lg" style="flex: 1;" onclick="window.FIVIAProjectEngine.submitProjectForEvaluation()"><i class="fas fa-paper-plane"></i> SUBMIT PROYEK & EVALUASI RUBRIK</button>
          </div>
        </div>
      `;
    } else if (projectState === 'PROJECT_EVALUATION') {
      const savedRes = getSavedProjectResult(currentProject.id);
      const evalRes = savedRes ? savedRes.evaluation : window.FIVIAProjectsData.evaluateProjectRubric({});

      contentHtml = `
        <div style="background: linear-gradient(135deg, rgba(15,23,42,0.98), rgba(6,182,212,0.2)); border: 3px solid var(--fq-cyan); border-radius: 28px; padding: 40px; text-align: center;">
          <div style="font-size: 3.5rem; margin-bottom: 8px;">🏆🚀</div>
          <span style="font-size: 0.9rem; font-weight: 900; color: var(--fq-cyan); letter-spacing: 2px;">PROJECT EVALUATION COMPLETE</span>
          <h1 style="font-size: 2.5rem; font-weight: 900; color: #fff; margin: 8px 0;">${evalRes.masteryTitle}</h1>
          <p style="color: var(--fq-text-muted); font-size: 1rem;">Skor Rubrik Evaluasi Proyek: <strong>${evalRes.totalScore} / ${evalRes.maxScore} PTS (${evalRes.percentage}%)</strong></p>

          <div style="background: rgba(30,41,59,0.7); border: 1px solid var(--fq-border-cyan); border-radius: 20px; padding: 24px; text-align: left; margin: 28px 0;">
            <h3 style="color: var(--fq-amber); font-size: 1.1rem; margin: 0 0 14px 0;"><i class="fas fa-clipboard-check"></i> RINCIAN RUBRIK EVALUASI (9 KATEGORI):</h3>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 12px;">
              ${evalRes.categories.map(c => `
                <div style="background: rgba(15,23,42,0.6); padding: 10px 14px; border-radius: 12px; font-size: 0.85rem;">
                  <strong style="color: #fff;">${c.name}:</strong> <span style="color: var(--fq-cyan); font-weight: 800;">${c.score} / 4 PTS</span>
                </div>
              `).join('')}
            </div>
          </div>

          <div style="display: flex; gap: 14px; justify-content: center; flex-wrap: wrap;">
            <button class="fq-btn fq-btn-cyan fq-btn-lg" onclick="window.FIVIAProjectReports.printProjectReport('${currentProject.id}')"><i class="fas fa-print"></i> CETAK LAPORAN PROYEK</button>
            <button class="fq-btn fq-btn-outline fq-btn-lg" onclick="window.location.hash='#quest/project-mission'"><i class="fas fa-list"></i> KEMBALI KE DAFTAR PROYEK</button>
          </div>
        </div>
      `;
    }

    container.innerHTML = contentHtml;
  }

  function launchLinkedLab() {
    if (!currentProject || !currentProject.linkedLabId) return;
    window.FIVIALabEngine.startExperiment(currentProject.linkedLabId);
    window.location.hash = '#quest/lab-experiment';
  }

  return {
    startProject: startProject,
    setProjectState: setProjectState,
    updateFormField: updateFormField,
    submitProjectForEvaluation: submitProjectForEvaluation,
    launchLinkedLab: launchLinkedLab,
    getCurrentProject: function() { return currentProject; },
    getSavedProjectResult: getSavedProjectResult
  };
})();
