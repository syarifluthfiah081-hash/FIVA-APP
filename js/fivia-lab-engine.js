/**
 * FIVIA VIRTUAL PHYSICS LAB ENGINE
 * Simulation Controls, Canvas Rendering, Graph Engine, Measurement Table
 */

window.FIVIALabEngine = (function() {
  'use strict';

  let currentExp = null;
  let labState = 'LAB_SELECT';
  let variableValues = {};
  let measurements = [];
  let userPrediction = null;
  let simulationAnimId = null;
  let simTime = 0;
  let isSimRunning = false;

  /**
   * Start Specific Experiment
   */
  function startExperiment(expId) {
    currentExp = window.FIVIAVirtualLabData.getExperimentById(expId);
    labState = 'LAB_INTRO';
    measurements = [];
    userPrediction = null;
    simTime = 0;
    isSimRunning = false;

    // Reset default variables
    variableValues = {};
    if (currentExp.variables) {
      currentExp.variables.forEach(v => {
        variableValues[v.id] = v.default;
      });
    }

    renderLabUI();
  }

  /**
   * Set Active Variable Value
   */
  function setVariable(varId, val) {
    variableValues[varId] = parseFloat(val);
    renderSimulationApparatus();
  }

  /**
   * Predict Answer
   */
  function recordPrediction(predId) {
    userPrediction = predId;
    renderLabUI();
  }

  /**
   * Run Simulation Animation
   */
  function toggleSimulation() {
    isSimRunning = !isSimRunning;
    if (isSimRunning) {
      runSimLoop();
    } else {
      if (simulationAnimId) cancelAnimationFrame(simulationAnimId);
    }
    renderLabUI();
  }

  function resetSimulation() {
    isSimRunning = false;
    if (simulationAnimId) cancelAnimationFrame(simulationAnimId);
    simTime = 0;
    renderSimulationApparatus();
    renderLabUI();
  }

  function runSimLoop() {
    if (!isSimRunning) return;
    simTime += 0.05;
    renderSimulationApparatus();

    if (simTime < 10) {
      simulationAnimId = requestAnimationFrame(runSimLoop);
    } else {
      isSimRunning = false;
      renderLabUI();
    }
  }

  /**
   * Record Data Measurement to Table
   */
  function recordCurrentMeasurement() {
    if (!currentExp) return;

    let rowData = {};
    if (currentExp.physicsModel) {
      if (currentExp.id === 'lab_exp_04') {
        // Falling height
        const currentH = Math.max(0, (variableValues.height || 10) - 0.5 * 9.8 * simTime * simTime);
        rowData = currentExp.physicsModel(variableValues, currentH);
      } else {
        rowData = currentExp.physicsModel(variableValues, simTime);
      }
    } else if (currentExp.targetObjects) {
      const obj = currentExp.targetObjects[0];
      rowData = { object: obj.name, lengthMm: obj.trueLengthMm, massG: obj.trueMassG, precision: "0.01 mm" };
    }

    rowData.no = measurements.length + 1;
    measurements.push(rowData);
    renderLabUI();
  }

  function clearMeasurements() {
    measurements = [];
    renderLabUI();
  }

  /**
   * Main Render Coordinator
   */
  function renderLabUI() {
    const container = document.getElementById('fq-lab-experiment-container');
    if (!container || !currentExp) return;

    let contentHtml = '';

    if (labState === 'LAB_INTRO') {
      contentHtml = `
        <div style="background: rgba(15, 23, 42, 0.95); border: 2px solid var(--fq-cyan); border-radius: 28px; padding: 36px; text-align: left;">
          <div style="display: flex; align-items: center; gap: 14px; margin-bottom: 16px;">
            <div style="font-size: 2.5rem; color: var(--fq-cyan);"><i class="fas ${currentExp.icon}"></i></div>
            <div>
              <span class="fq-badge-pill">${currentExp.topic.toUpperCase()}</span>
              <h1 style="font-size: 2rem; font-weight: 900; color: #fff; margin: 0;">${currentExp.title}</h1>
            </div>
          </div>

          <div style="background: rgba(30,41,59,0.6); border: 1px solid var(--fq-border-cyan); border-radius: 20px; padding: 20px; margin-bottom: 24px;">
            <h3 style="color: var(--fq-amber); margin: 0 0 10px 0;"><i class="fas fa-bullseye"></i> TUJUAN EKSPERIMEN:</h3>
            <ul style="color: #fff; line-height: 1.6; margin: 0; padding-left: 20px;">
              ${currentExp.objectives.map(o => `<li>${o}</li>`).join('')}
            </ul>
          </div>

          <div style="background: rgba(30,41,59,0.4); border: 1px solid var(--fq-border); border-radius: 20px; padding: 20px; margin-bottom: 28px;">
            <h4 style="color: var(--fq-cyan); margin: 0 0 8px 0;"><i class="fas fa-book"></i> DASAR TEORI:</h4>
            <p style="color: var(--fq-text-muted); font-size: 0.95rem; line-height: 1.6; margin: 0;">${currentExp.theory}</p>
          </div>

          <div style="display: flex; gap: 14px;">
            <button class="fq-btn fq-btn-cyan fq-btn-lg" style="flex: 1;" onclick="window.FIVIALabEngine.setLabState('LAB_PREDICT')"><i class="fas fa-lightbulb"></i> LANJUT KE HIPOTESIS & PREDIKSI</button>
            <button class="fq-btn fq-btn-outline fq-btn-lg" onclick="window.location.hash='#quest/virtual-lab'"><i class="fas fa-arrow-left"></i> KEMBALI KE LAB</button>
          </div>
        </div>
      `;
    } else if (labState === 'LAB_PREDICT') {
      contentHtml = `
        <div style="background: rgba(15, 23, 42, 0.95); border: 2px solid var(--fq-amber); border-radius: 28px; padding: 36px; text-align: left;">
          <span class="fq-badge-pill" style="color: var(--fq-amber); border-color: var(--fq-amber);"><i class="fas fa-brain"></i> HIPOTESIS & PREDIKSI AWAL</span>
          <h2 style="font-size: 1.8rem; font-weight: 900; color: #fff; margin: 8px 0 16px 0;">BERIKAN PREDIKSI ILMIAH ANDA</h2>

          <div style="background: rgba(30,41,59,0.7); border: 1.5px solid var(--fq-amber); border-radius: 20px; padding: 24px; margin-bottom: 24px;">
            <h3 style="color: #fff; font-size: 1.25rem; font-weight: 800; line-height: 1.4; margin: 0;">"${currentExp.predictionPrompt}"</h3>
          </div>

          <div class="fq-options-grid" style="margin-bottom: 28px;">
            ${currentExp.predictionOptions.map(opt => `
              <div class="fq-option-card ${userPrediction === opt.id ? 'selected' : ''}" onclick="window.FIVIALabEngine.recordPrediction('${opt.id}')">
                <div class="fq-option-badge" style="border-color: var(--fq-amber); color: var(--fq-amber);">${opt.id}</div>
                <div class="fq-option-text">${opt.text}</div>
              </div>
            `).join('')}
          </div>

          <div style="display: flex; gap: 14px;">
            <button class="fq-btn fq-btn-amber fq-btn-lg" style="flex: 1;" ${!userPrediction ? 'disabled' : ''} onclick="window.FIVIALabEngine.setLabState('LAB_EXPERIMENT')"><i class="fas fa-play"></i> MULAI SIMULASI EKSPERIMEN</button>
          </div>
        </div>
      `;
    } else if (labState === 'LAB_EXPERIMENT') {
      contentHtml = `
        <div style="background: rgba(15, 23, 42, 0.95); border: 2px solid var(--fq-cyan); border-radius: 28px; padding: 28px;">
          <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px; margin-bottom: 20px;">
            <div>
              <span class="fq-badge-pill"><i class="fas fa-flask"></i> VIRTUAL APPARATUS</span>
              <h2 style="font-size: 1.6rem; font-weight: 900; color: #fff; margin: 0;">${currentExp.title}</h2>
            </div>
            <div style="display: flex; gap: 10px;">
              <button class="fq-btn ${isSimRunning ? 'fq-btn-danger' : 'fq-btn-emerald'}" style="min-height: 44px;" onclick="window.FIVIALabEngine.toggleSimulation()">
                <i class="fas ${isSimRunning ? 'fa-pause' : 'fa-play'}"></i> ${isSimRunning ? 'PAUSE' : 'JALANKAN SIMULASI'}
              </button>
              <button class="fq-btn fq-btn-outline" style="min-height: 44px;" onclick="window.FIVIALabEngine.resetSimulation()"><i class="fas fa-undo"></i> RESET</button>
              <button class="fq-btn fq-btn-amber" style="min-height: 44px;" onclick="window.FIVIALabEngine.recordCurrentMeasurement()"><i class="fas fa-save"></i> CATAT DATA</button>
            </div>
          </div>

          <!-- Canvas Apparatus Screen -->
          <div style="background: #030712; border: 2px solid var(--fq-border-cyan); border-radius: 20px; padding: 16px; margin-bottom: 24px; position: relative;">
            <canvas id="fq-lab-canvas" width="860" height="320" style="width: 100%; height: 320px; border-radius: 12px; background: #070f23;"></canvas>
          </div>

          <!-- Variable Controls Grid -->
          ${currentExp.variables ? `
            <div style="background: rgba(30, 41, 59, 0.7); border: 1px solid var(--fq-border); border-radius: 20px; padding: 20px; margin-bottom: 24px;">
              <h4 style="color: var(--fq-cyan); font-size: 1rem; margin: 0 0 16px 0;"><i class="fas fa-sliders-h"></i> KONTROL VARIABEL EKSPERIMEN:</h4>
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 20px;">
                ${currentExp.variables.map(v => `
                  <div>
                    <div style="display: flex; justify-content: space-between; font-size: 0.88rem; font-weight: 700; color: #fff; margin-bottom: 6px;">
                      <span>${v.name}</span>
                      <span style="color: var(--fq-cyan);">${variableValues[v.id] || v.default} ${v.unit}</span>
                    </div>
                    <input type="range" class="fq-input" min="${v.min}" max="${v.max}" step="${v.step}" value="${variableValues[v.id] || v.default}"
                           oninput="window.FIVIALabEngine.setVariable('${v.id}', this.value)" style="height: 48px; cursor: pointer;">
                  </div>
                `).join('')}
              </div>
            </div>
          ` : ''}

          <!-- Live Measurement Data Table -->
          <div style="background: rgba(30, 41, 59, 0.7); border: 1px solid var(--fq-border); border-radius: 20px; padding: 20px; margin-bottom: 24px; text-align: left;">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px;">
              <h4 style="color: var(--fq-amber); font-size: 1rem; margin: 0;"><i class="fas fa-table"></i> TABEL DATA PENGAMATAN (${measurements.length} Data Recorded):</h4>
              <button class="fq-btn fq-btn-danger" style="min-height: 34px; padding: 4px 10px; font-size: 0.78rem;" onclick="window.FIVIALabEngine.clearMeasurements()">Hapus Data</button>
            </div>
            
            <div style="overflow-x: auto;">
              <table class="fq-student-table">
                <thead>
                  <tr>
                    <th>NO</th>
                    <th>WAKTU (s)</th>
                    <th>VARIABEL AWAIL / KONDISI</th>
                    <th>HASIL PENGUKURAN SIMULASI</th>
                  </tr>
                </thead>
                <tbody>
                  ${measurements.length === 0 ? `
                    <tr><td colspan="4" style="text-align: center; color: var(--fq-text-muted); padding: 16px;">Belum ada data dicatat. Klik [CATAT DATA] saat simulasi berjalan.</td></tr>
                  ` : measurements.map((m, idx) => `
                    <tr>
                      <td>${idx + 1}</td>
                      <td>${Math.round((m.time || 0) * 10) / 10} s</td>
                      <td>${m.object || `m=${m.mass || variableValues.mass || '-'}, F=${m.force || variableValues.force || '-'}`}</td>
                      <td><strong>${m.acceleration ? `a = ${Math.round(m.acceleration * 100) / 100} m/s²` : m.velocity ? `v = ${Math.round(m.velocity * 100) / 100} m/s` : m.power ? `P = ${m.power} W (Efisiensi ${m.efficiency}%)` : `L = ${m.lengthMm} mm`}</strong></td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>

          <div style="display: flex; gap: 14px;">
            <button class="fq-btn fq-btn-cyan fq-btn-lg" style="flex: 1;" ${measurements.length === 0 ? 'disabled' : ''} onclick="window.FIVIALabEngine.setLabState('LAB_ANALYZE')"><i class="fas fa-clipboard-check"></i> SELESAI EKSPERIMEN & ANALISIS DATA</button>
          </div>
        </div>
      `;
    } else if (labState === 'LAB_ANALYZE') {
      const isPredCorrect = (userPrediction === currentExp.correctPrediction);

      contentHtml = `
        <div style="background: rgba(15, 23, 42, 0.95); border: 2px solid var(--fq-cyan); border-radius: 28px; padding: 36px; text-align: left;">
          <span class="fq-badge-pill"><i class="fas fa-chart-pie"></i> ANALISIS HASIL EKSPERIMEN</span>
          <h2 style="font-size: 2rem; font-weight: 900; color: #fff; margin: 8px 0 20px 0;">EVALUASI ANALITIK PENGAMATAN</h2>

          <div style="background: ${isPredCorrect ? 'rgba(16,185,129,0.15)' : 'rgba(245,158,11,0.15)'}; border: 1.5px solid ${isPredCorrect ? 'var(--fq-emerald)' : 'var(--fq-amber)'}; border-radius: 20px; padding: 20px; margin-bottom: 24px;">
            <h4 style="color: ${isPredCorrect ? '#34d399' : '#fbbf24'}; margin: 0 0 6px 0;">
              ${isPredCorrect ? '✓ PREDIKSI HIPOTESIS ANDA SESUAI!' : '⚠ PREDIKSI PERLU DITINJAU UANG'}
            </h4>
            <p style="color: #fff; font-size: 0.9rem; margin: 0;">Hasil pengamatan simulasi fisika membuktikan secara ilmiah hubungan variabel fisis yang berlaku.</p>
          </div>

          <div style="background: rgba(30, 41, 59, 0.6); border: 1px solid var(--fq-border); border-radius: 20px; padding: 24px; margin-bottom: 28px;">
            <h3 style="color: #fff; font-size: 1.2rem; margin: 0 0 16px 0;">Pertanyaan Analisis Pengamatan:</h3>
            ${currentExp.analysisQuestions.map((q, idx) => `
              <div style="margin-bottom: 16px;">
                <div style="font-weight: 700; color: var(--fq-cyan); font-size: 0.95rem; margin-bottom: 6px;">${idx + 1}. ${q.question}</div>
                <div style="color: #fff; font-size: 0.9rem; background: rgba(15,23,42,0.6); padding: 10px; border-radius: 10px;">
                  ✓ Kunci Pembahasan: <strong>${q.options.find(o => o.id === q.correctAnswer).text}</strong>
                </div>
              </div>
            `).join('')}
          </div>

          <div style="display: flex; gap: 14px;">
            <button class="fq-btn fq-btn-cyan fq-btn-lg" style="flex: 1;" onclick="window.FIVIALabEngine.completeLabSession()"><i class="fas fa-file-alt"></i> SELESAI EKSPERIMEN & KELOLA LKPD DIGITAL</button>
          </div>
        </div>
      `;
    }

    container.innerHTML = contentHtml;

    if (labState === 'LAB_EXPERIMENT') {
      setTimeout(() => { renderSimulationApparatus(); }, 50);
    }
  }

  /**
   * HTML5 Canvas Simulation Renderer
   */
  function renderSimulationApparatus() {
    const canvas = document.getElementById('fq-lab-canvas');
    if (!canvas || !currentExp) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    // Dark grid lab background
    ctx.fillStyle = '#070f23';
    ctx.fillRect(0, 0, width, height);
    ctx.strokeStyle = 'rgba(6, 182, 212, 0.1)';
    ctx.lineWidth = 1;
    for (let x = 0; x < width; x += 40) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke(); }
    for (let y = 0; y < height; y += 40) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke(); }

    if (currentExp.id === 'lab_exp_02' || currentExp.id === 'lab_exp_03') {
      // Motion / Newton Track Simulation
      const m = variableValues.mass || 2.0;
      const F = variableValues.force || 6.0;
      const a = currentExp.physicsModel(variableValues, simTime).acceleration;
      const posX = Math.min(width - 120, 60 + 0.5 * a * simTime * simTime * 15);

      // Draw Track
      ctx.strokeStyle = '#06b6d4';
      ctx.lineWidth = 4;
      ctx.beginPath(); ctx.moveTo(40, 220); ctx.lineTo(width - 40, 220); ctx.stroke();

      // Draw Trolley Cart
      ctx.fillStyle = '#8b5cf6';
      ctx.fillRect(posX, 170, 80, 40);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 12px sans-serif';
      ctx.fillText(`m = ${m} kg`, posX + 15, 195);

      // Draw Wheels
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath(); ctx.arc(posX + 20, 215, 10, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(posX + 60, 215, 10, 0, Math.PI * 2); ctx.fill();

      // Force Arrow Vector
      ctx.strokeStyle = '#f43f5e';
      ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(posX + 80, 190); ctx.lineTo(posX + 130, 190); ctx.stroke();
      ctx.fillStyle = '#f43f5e';
      ctx.fillText(`F = ${F} N`, posX + 90, 180);

      // HUD readout
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 14px monospace';
      ctx.fillText(`t: ${Math.round(simTime * 10) / 10} s | a: ${Math.round(a * 100) / 100} m/s² | v: ${Math.round(a * simTime * 100) / 100} m/s`, 40, 40);
    } else if (currentExp.id === 'lab_exp_04') {
      // Energy Falling Object
      const h0 = variableValues.height || 10;
      const currentH = Math.max(0, h0 - 0.5 * 9.8 * simTime * simTime);
      const res = currentExp.physicsModel(variableValues, currentH);
      const posY = Math.min(240, 50 + ((h0 - res.height) / h0) * 190);

      // Tower Track
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(150, 40); ctx.lineTo(150, 260); ctx.stroke();

      // Falling Ball
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath(); ctx.arc(150, posY, 16, 0, Math.PI * 2); ctx.fill();

      // Energy Bar Charts
      ctx.fillStyle = '#06b6d4';
      ctx.fillRect(400, 260 - res.Ep * 1.5, 40, res.Ep * 1.5); // Ep
      ctx.fillStyle = '#10b981';
      ctx.fillRect(480, 260 - res.Ek * 1.5, 40, res.Ek * 1.5); // Ek
      ctx.fillStyle = '#8b5cf6';
      ctx.fillRect(560, 260 - res.Em * 1.5, 40, res.Em * 1.5); // Em

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 12px sans-serif';
      ctx.fillText(`Ep: ${Math.round(res.Ep)} J`, 395, 280);
      ctx.fillText(`Ek: ${Math.round(res.Ek)} J`, 475, 280);
      ctx.fillText(`Em: ${Math.round(res.Em)} J`, 555, 280);
      ctx.fillText(`Ketinggian (h): ${Math.round(res.height * 10) / 10} m`, 40, 40);
    } else if (currentExp.id === 'lab_exp_05') {
      // Solar Panel
      const res = currentExp.physicsModel(variableValues);

      // Sun Icon
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath(); ctx.arc(120, 70, 30, 0, Math.PI * 2); ctx.fill();

      // Solar Panel Angle
      ctx.save();
      ctx.translate(350, 180);
      ctx.rotate((-res.angle * Math.PI) / 180);
      ctx.fillStyle = '#0284c7';
      ctx.fillRect(-60, -10, 120, 20);
      ctx.restore();

      // Readouts
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 16px monospace';
      ctx.fillText(`Tegangan (V): ${res.voltage} V`, 500, 80);
      ctx.fillText(`Arus (I): ${res.current} A`, 500, 120);
      ctx.fillText(`Daya (P): ${res.power} W`, 500, 160);
      ctx.fillText(`Efisiensi: ${res.efficiency} %`, 500, 200);
    } else {
      // Default Measurement Ruler Canvas
      ctx.fillStyle = '#06b6d4';
      ctx.fillRect(100, 120, 600, 60);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 14px sans-serif';
      ctx.fillText("MISTAR / JANGKA SORONG ANALOG DIGITAL", 120, 155);
    }
  }

  function setLabState(stateName) {
    labState = stateName;
    renderLabUI();
  }

  function completeLabSession() {
    window.FIVIALabAnalytics.recordLabCompletion(currentExp.id, 100);
    window.location.hash = '#quest/lab-lkpd';
  }

  return {
    startExperiment: startExperiment,
    setVariable: setVariable,
    recordPrediction: recordPrediction,
    toggleSimulation: toggleSimulation,
    resetSimulation: resetSimulation,
    recordCurrentMeasurement: recordCurrentMeasurement,
    clearMeasurements: clearMeasurements,
    setLabState: setLabState,
    completeLabSession: completeLabSession,
    getCurrentExp: function() { return currentExp; },
    getMeasurements: function() { return measurements; }
  };
})();
