/**
 * labs.js
 * Virtual Lab Canvas Engine for 22 High School Physics Modules
 */

let simInterval = null;
let isSimRunning = false;
let simTime = 0; // seconds

// Active Lab States
let activeLabId = null;
let activeLabType = "";

// Simulation Variables
let simState = {
  showReadingHelp: false,
  // Lab 1 & 2 (Unified Measurement Lab)
  measurementCategory: "panjang", // "panjang", "massa", "waktu", "listrik"
  measurementTool: "mistar",     // "mistar", "caliper", "micrometer", "neraca_ohaus", "timbangan_digital", "stopwatch", "multimeter"
  measurementTargetVal: 12.35,   // target value depending on category and object
  measurementSelectedObj: "kelereng",
  userCaliperPos: 0,             // slider val for length position
  userOhaus100: 0,               // Ohaus weights
  userOhaus10: 0,
  userOhaus1: 0,
  stopwatchTime: 0,              // stopwatch timer
  stopwatchRunning: false,
  ballY: 0,                      // ball drop animation
  ballVy: 0,
  circVoltage: 9,                // multimeter variables
  circResistance: 150,
  
  // Lab 2 (Forces and Motion)
  blockMass: 5, // kg
  pushForce: 25, // N
  frictionCoeff: 0.2, // kinetic friction
  blockX: 50, // position px
  blockVx: 0, // velocity
  blockAx: 0, // acceleration
  forceLog: [], // graph points: {t, s, v}
  
  // Lab 3 (Ohm's Law)
  circVoltage: 12, // V
  circResistance: 100, // Ohm
  electronAngle: 0,
  
  // Fallbacks standard variables
  widgetSlider1: 5,
  widgetSlider2: 10,
  oscillatorAngle: 0.5, // rad
  wavePhase: 0,
  photoElectrons: [],

  // --- NEW VIRTUAL LAB VARIABLES ---
  
  // 1. Scientific Method & Safety variables
  scientificMethodMode: "safety", // "safety" or "experiment"
  safetySelectedChemical: "asam_pekat",
  safetySelectedAction: "",
  safetyCorrectCount: 0,
  safetyActiveHazards: [
    { id: "fire", name: "Kebakaran Bunsen", x: 120, y: 160, solved: false, tool: "extinguisher", label: "Alat Pemadam Api" },
    { id: "acid", name: "Tumpahan Kimia", x: 280, y: 190, solved: false, tool: "mop", label: "Neutralizer & Pel" },
    { id: "glass", name: "Pecahan Kaca", x: 440, y: 180, solved: false, tool: "broom", label: "Sapu & Sekop" },
    { id: "gas", name: "Kebocoran Gas", x: 580, y: 150, solved: false, tool: "mask", label: "Masker Gas & Kran" }
  ],
  heatingVolume: 200, // mL (equal to mass in grams)
  heatingPower: 500, // Watts (Joules / sec)
  heatingTemp: 25.0, // °C
  
  // 3. Skate Ramp (Work & Energy)
  skateMass: 5.0, // kg
  skateFriction: 0.1,
  skateInitialHeight: 5.0, // m
  skateX: -150,
  skateVx: 0,
  skateEk: 0,
  skateEp: 0,
  skateEtherm: 0,
  skateEm: 0,
  skateAmp: 150,
  
  // 4. Wind & Solar (Alternative Energies)
  windSpeed: 5.0, // m/s
  solarAngle: 90, // degrees
  cloudiness: 20, // %
  windPower: 0,
  solarPower: 0,
  batteryCharge: 0,
  
  // 5. Greenhouse (Global Warming)
  co2Ppm: 350, // ppm
  emissions: "sedang", // "rendah", "sedang", "tinggi"
  greening: 20, // %
  earthTemp: 15.0 // °C
};

// Colors matching our dark/light theme
const themeColors = {
  blue: "#0d6efd",
  orange: "#fd7e14",
  darkBg: "#1e293b",
  lightBg: "#f8fafc",
  textLight: "#f8fafc",
  textDark: "#1e293b"
};

// Canvas references
let canvasEl = null;
let ctx = null;
let graphCanvasEl = null;
let graphCtx = null;

// Initializer
function renderLab(labId) {
  activeLabId = parseInt(labId);
  const lab = window.db.getTable("labs").find(l => l.id === activeLabId);
  if (!lab) return;

  activeLabType = lab.type;

  // Rebranding backup and custom delegate for Measurement Lab
  if (activeLabId === 2) {
    if (!window.originalLabViewportHTML) {
      window.originalLabViewportHTML = document.getElementById("lab-viewport-section").innerHTML;
    }
    initRedesignedMeasurementLab();
    return;
  } else {
    if (window.originalLabViewportHTML) {
      document.getElementById("lab-viewport-section").innerHTML = window.originalLabViewportHTML;
    }
  }
  
  // Setup overlay header
  document.getElementById("lab-overlay-title").textContent = `Eksperimen Virtual: ${lab.name}`;

  // Grab UI elements
  canvasEl = document.getElementById("lab-canvas");
  ctx = canvasEl.getContext("2d");
  graphCanvasEl = document.getElementById("lab-graph-canvas");
  graphCtx = graphCanvasEl.getContext("2d");

  // Bind direct drag and drop for instrument on canvas
  setupCanvasDragEvents();

  // Reset canvases
  resizeCanvases();
  resetSimState();

  // Draw initial static screens
  drawSimulation();
  drawGraph();

  // Render parameter controls (sliders)
  renderSlidersForLab(activeLabType);

  // Setup tab switcher click
  setupLabTabs();

  // Populate LKPD template
  if (window.initLKPDForLab) window.initLKPDForLab(activeLabId);

  // Binds control buttons
  bindLabButtons();
  
  // Custom context setting for AI Tutor
  if (window.setTutorContext) window.setTutorContext(lab.name);
}

function resizeCanvases() {
  if (canvasEl) {
    canvasEl.width = canvasEl.parentElement.clientWidth;
    canvasEl.height = canvasEl.parentElement.clientHeight;
  }
  if (graphCanvasEl) {
    graphCanvasEl.width = graphCanvasEl.parentElement.clientWidth;
    graphCanvasEl.height = graphCanvasEl.parentElement.clientHeight;
  }
}

window.addEventListener("resize", () => {
  if (activeLabId) {
    resizeCanvases();
    drawSimulation();
    drawGraph();
  }
});

// Setup parameter sliders in the sidebar panel dynamically
function renderSlidersForLab(type) {
  const container = document.getElementById("lab-sliders-container");
  if (!container) return;
  container.innerHTML = "";

  let slidersHtml = "";

  if (type === "measurement") {
    const cat = simState.measurementCategory;
    const tool = simState.measurementTool;
    const obj = simState.measurementSelectedObj;

    slidersHtml = `
      <div class="parameter-slider-group">
        <div class="parameter-label-container">
          <label>Kategori Pengukuran</label>
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-top: 6px;">
          <button class="btn btn-meas-cat ${cat === 'panjang' ? 'btn-primary' : 'btn-secondary'}" data-cat="panjang" style="font-size: 0.8rem; padding: 8px 4px;"><i class="fas fa-ruler"></i> Panjang</button>
          <button class="btn btn-meas-cat ${cat === 'massa' ? 'btn-primary' : 'btn-secondary'}" data-cat="massa" style="font-size: 0.8rem; padding: 8px 4px;"><i class="fas fa-weight-hanging"></i> Massa</button>
          <button class="btn btn-meas-cat ${cat === 'waktu' ? 'btn-primary' : 'btn-secondary'}" data-cat="waktu" style="font-size: 0.8rem; padding: 8px 4px;"><i class="fas fa-stopwatch"></i> Waktu</button>
          <button class="btn btn-meas-cat ${cat === 'listrik' ? 'btn-primary' : 'btn-secondary'}" data-cat="listrik" style="font-size: 0.8rem; padding: 8px 4px;"><i class="fas fa-bolt"></i> Listrik</button>
        </div>
      </div>

      <div class="parameter-slider-group" style="margin-top: 15px;">
        <div class="parameter-label-container">
          <label>Pilih Alat Ukur</label>
        </div>
        <div style="display: flex; flex-direction: column; gap: 6px; margin-top: 6px;">
          ${cat === "panjang" ? `
            <button class="btn btn-meas-tool ${tool === 'mistar' ? 'btn-primary' : 'btn-secondary'}" data-tool="mistar" style="font-size: 0.8rem; padding: 8px 12px; justify-content: flex-start;"><i class="fas fa-ruler-horizontal" style="width: 20px;"></i> Mistar (1 mm)</button>
            <button class="btn btn-meas-tool ${tool === 'caliper' ? 'btn-primary' : 'btn-secondary'}" data-tool="caliper" style="font-size: 0.8rem; padding: 8px 12px; justify-content: flex-start;"><i class="fas fa-sliders-h" style="width: 20px;"></i> Jangka Sorong (0.1 mm)</button>
            <button class="btn btn-meas-tool ${tool === 'micrometer' ? 'btn-primary' : 'btn-secondary'}" data-tool="micrometer" style="font-size: 0.8rem; padding: 8px 12px; justify-content: flex-start;"><i class="fas fa-compass" style="width: 20px;"></i> Mikrometer Sekrup (0.01 mm)</button>
          ` : ""}
          ${cat === "massa" ? `
            <button class="btn btn-meas-tool ${tool === 'neraca_ohaus' ? 'btn-primary' : 'btn-secondary'}" data-tool="neraca_ohaus" style="font-size: 0.8rem; padding: 8px 12px; justify-content: flex-start;"><i class="fas fa-balance-scale" style="width: 20px;"></i> Neraca Ohaus 3 Lengan</button>
            <button class="btn btn-meas-tool ${tool === 'timbangan_digital' ? 'btn-primary' : 'btn-secondary'}" data-tool="timbangan_digital" style="font-size: 0.8rem; padding: 8px 12px; justify-content: flex-start;"><i class="fas fa-digital-tachograph" style="width: 20px;"></i> Timbangan Digital</button>
          ` : ""}
          ${cat === "waktu" ? `
            <button class="btn btn-meas-tool btn-primary" data-tool="stopwatch" style="font-size: 0.8rem; padding: 8px 12px; justify-content: flex-start;" disabled><i class="fas fa-stopwatch" style="width: 20px;"></i> Stopwatch Analog & Digital</button>
          ` : ""}
          ${cat === "listrik" ? `
            <button class="btn btn-meas-tool btn-primary" data-tool="multimeter" style="font-size: 0.8rem; padding: 8px 12px; justify-content: flex-start;" disabled><i class="fas fa-microchip" style="width: 20px;"></i> Multimeter Rangkaian DC</button>
          ` : ""}
        </div>
      </div>
    `;

    // Object selector depending on category
    if (cat === "panjang") {
      slidersHtml += `
        <div class="parameter-slider-group">
          <div class="parameter-label-container">
            <label>Obyek Ukur</label>
          </div>
          <select class="form-control" id="sim-meas-obj" style="width: 100%;">
            <option value="kelereng" ${obj === "kelereng" ? "selected" : ""}>Kelereng Bulat</option>
            <option value="kawat" ${obj === "kawat" ? "selected" : ""}>Kawat Tembaga</option>
            <option value="plat" ${obj === "plat" ? "selected" : ""}>Plat Seng</option>
            <option value="koin" ${obj === "koin" ? "selected" : ""}>Koin Logam</option>
            <option value="buku" ${obj === "buku" ? "selected" : ""}>Tebal Buku Kecil</option>
          </select>
        </div>
        <div class="parameter-slider-group">
          <div class="parameter-label-container">
            <label>Pembukaan Alat Ukur (mm)</label>
            <span class="parameter-value-badge" id="badge-caliper-val">${simState.showReadingHelp ? simState.userCaliperPos.toFixed(tool === "micrometer" ? 2 : (tool === "caliper" ? 1 : 0)) + " mm" : "? mm"}</span>
          </div>
          <input type="range" class="parameter-slider" id="slider-caliper-pos" min="0" max="${tool === "micrometer" ? 25 : 40}" step="${tool === "micrometer" ? 0.01 : (tool === "caliper" ? 0.1 : 1)}" value="${simState.userCaliperPos}">
        </div>
      `;
    } else if (cat === "massa") {
      slidersHtml += `
        <div class="parameter-slider-group">
          <div class="parameter-label-container">
            <label>Benda Ukur (Massa)</label>
          </div>
          <select class="form-control" id="sim-meas-obj" style="width: 100%;">
            <option value="kelereng" ${obj === "kelereng" ? "selected" : ""}>Kelereng</option>
            <option value="silinder" ${obj === "silinder" ? "selected" : ""}>Silinder Kuningan</option>
            <option value="balok" ${obj === "balok" ? "selected" : ""}>Balok Besi</option>
            <option value="koin" ${obj === "koin" ? "selected" : ""}>Koin Emas</option>
            <option value="batu" ${obj === "batu" ? "selected" : ""}>Batu Kerikil</option>
          </select>
        </div>
      `;

      if (tool === "neraca_ohaus") {
        slidersHtml += `
          <div class="parameter-slider-group">
            <div class="parameter-label-container">
              <label>Lengan Belakang (100g)</label>
              <span class="parameter-value-badge">${simState.showReadingHelp ? simState.userOhaus100 + " g" : "? g"}</span>
            </div>
            <input type="range" class="parameter-slider" id="slider-ohaus-100" min="0" max="500" step="100" value="${simState.userOhaus100}">
          </div>
          <div class="parameter-slider-group">
            <div class="parameter-label-container">
              <label>Lengan Tengah (10g)</label>
              <span class="parameter-value-badge">${simState.showReadingHelp ? simState.userOhaus10 + " g" : "? g"}</span>
            </div>
            <input type="range" class="parameter-slider" id="slider-ohaus-10" min="0" max="100" step="10" value="${simState.userOhaus10}">
          </div>
          <div class="parameter-slider-group">
            <div class="parameter-label-container">
              <label>Lengan Depan (0.1g s.d 10g)</label>
              <span class="parameter-value-badge">${simState.showReadingHelp ? simState.userOhaus1.toFixed(1) + " g" : "? g"}</span>
            </div>
            <input type="range" class="parameter-slider" id="slider-ohaus-1" min="0" max="10" step="0.1" value="${simState.userOhaus1}">
          </div>
        `;
      } else {
        slidersHtml += `
          <div style="padding: 12px; text-align: center; background: rgba(0,0,0,0.03); border-radius: 8px;">
            <p style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 8px;">Benda akan diletakkan di piringan timbangan digital.</p>
            <button class="btn btn-primary" id="btn-place-digital" style="font-size: 0.8rem; padding: 6px 12px; width: 100%;">Timbang Benda</button>
          </div>
        `;
      }
    } else if (cat === "waktu") {
      slidersHtml += `
        <div class="parameter-slider-group">
          <div class="parameter-label-container">
            <label>Ketinggian Jatuh Bebas</label>
          </div>
          <select class="form-control" id="sim-meas-obj" style="width: 100%;" disabled>
            <option value="bola_jatuh" selected>Kelereng (Tinggi = 2.0 meter)</option>
          </select>
        </div>
        <div style="padding: 12px; display: flex; flex-direction: column; gap: 8px; background: rgba(0,0,0,0.03); border-radius: 8px;">
          <p style="font-size: 0.85rem; color: var(--text-secondary);">Mulai jatuhkan bola untuk mengukur waktu jatuh bebas bola dengan stopwatch.</p>
          <div style="display: flex; gap: 6px;">
            <button class="btn btn-orange" id="btn-drop-ball" style="flex: 1; font-size: 0.75rem; padding: 8px 4px;"><i class="fas fa-play"></i> Jatuhkan Bola</button>
            <button class="btn btn-secondary" id="btn-reset-ball" style="flex: 1; font-size: 0.75rem; padding: 8px 4px;"><i class="fas fa-undo"></i> Reset</button>
          </div>
        </div>
      `;
    } else if (cat === "listrik") {
      slidersHtml += `
        <div class="parameter-slider-group">
          <div class="parameter-label-container">
            <label>Parameter yang Diukur</label>
          </div>
          <select class="form-control" id="sim-meas-obj" style="width: 100%;">
            <option value="voltmeter" ${obj === "voltmeter" ? "selected" : ""}>Tegangan (Voltmeter)</option>
            <option value="ampermeter" ${obj === "ampermeter" ? "selected" : ""}>Kuat Arus (Ampermeter)</option>
          </select>
        </div>
        <div class="parameter-slider-group">
          <div class="parameter-label-container">
            <label>Tegangan Baterai (V)</label>
            <span class="parameter-value-badge">${simState.showReadingHelp ? simState.circVoltage.toFixed(1) + " V" : "? V"}</span>
          </div>
          <input type="range" class="parameter-slider" id="slider-circ-volt" min="1.5" max="24" step="0.5" value="${simState.circVoltage}">
        </div>
        <div class="parameter-slider-group">
          <div class="parameter-label-container">
            <label>Hambatan Resistor (&Omega;)</label>
            <span class="parameter-value-badge">${simState.showReadingHelp ? simState.circResistance + " &Omega;" : "? &Omega;"}</span>
          </div>
          <input type="range" class="parameter-slider" id="slider-circ-res" min="10" max="500" step="5" value="${simState.circResistance}">
        </div>
      `;
    }

    // Append Bantuan Pembacaan Toggle button
    slidersHtml += `
      <div style="margin-top: 15px; border-top: 1px solid var(--glass-border); padding-top: 15px;">
        <button class="btn btn-outline" id="btn-toggle-reading-help" style="font-size: 0.8rem; width: 100%; display: flex; align-items: center; justify-content: center; gap: 8px; padding: 8px 12px; background: rgba(59,130,246,0.05); border-color: rgba(59,130,246,0.2);">
          <i class="fas ${simState.showReadingHelp ? 'fa-eye-slash' : 'fa-eye'}"></i>
          <span>${simState.showReadingHelp ? 'Sembunyikan Nilai Pembacaan' : 'Tampilkan Nilai Pembacaan'}</span>
        </button>
      </div>
    `;
  } else if (type === "scientific_method") {
    const smMode = simState.scientificMethodMode;
    slidersHtml = `
      <div class="parameter-slider-group">
        <div class="parameter-label-container">
          <label>Mode Praktikum</label>
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-top: 6px;">
          <button class="btn btn-sm-mode ${smMode === 'safety' ? 'btn-primary' : 'btn-secondary'}" data-mode="safety" style="font-size: 0.8rem; padding: 8px 4px;"><i class="fas fa-shield-alt"></i> Keamanan Lab</button>
          <button class="btn btn-sm-mode ${smMode === 'experiment' ? 'btn-primary' : 'btn-secondary'}" data-mode="experiment" style="font-size: 0.8rem; padding: 8px 4px;"><i class="fas fa-flask"></i> Eksperimen</button>
        </div>
      </div>
    `;

    if (smMode === "safety") {
      slidersHtml += `
        <div style="margin-top: 15px; padding: 12px; background: rgba(59,130,246,0.05); border-radius: 8px; border: 1px dashed rgba(59,130,246,0.3);">
          <p style="font-size: 0.85rem; line-height: 1.4; color: var(--text-primary); margin-bottom: 8px;">
            <strong>Misi Keselamatan Laboratorium:</strong><br>
            Klik pada salah satu simbol bahaya merah yang menyala di area lab sebelah kiri, kemudian cocokkan dengan tindakan penanganan yang tepat di bawah ini.
          </p>
          <div style="font-size: 0.9rem; font-weight: bold; color: var(--brand-orange); margin-top: 8px;" id="safety-score-display">
            Misi Teratasi: ${simState.safetyCorrectCount} / 4
          </div>
        </div>
        
        <div class="parameter-slider-group" style="margin-top: 15px;" id="safety-tool-box">
          <div class="parameter-label-container">
            <label>Menu Tindakan Pengamanan:</label>
          </div>
          <div style="display: flex; flex-direction: column; gap: 8px; margin-top: 6px;">
            <button class="btn btn-safety-action btn-secondary" data-action="extinguisher" style="font-size: 0.8rem; justify-content: flex-start;"><i class="fas fa-fire-extinguisher" style="width: 20px;"></i> Semprot Alat Pemadam Api (APAR)</button>
            <button class="btn btn-safety-action btn-secondary" data-action="mop" style="font-size: 0.8rem; justify-content: flex-start;"><i class="fas fa-soap" style="width: 20px;"></i> Tuang Penetralisir Asam & Pel</button>
            <button class="btn btn-safety-action btn-secondary" data-action="broom" style="font-size: 0.8rem; justify-content: flex-start;"><i class="fas fa-broom" style="width: 20px;"></i> Sapu Pecahan & Buang ke Wadah</button>
            <button class="btn btn-safety-action btn-secondary" data-action="mask" style="font-size: 0.8rem; justify-content: flex-start;"><i class="fas fa-mask" style="width: 20px;"></i> Pakai Masker Gas & Tutup Kran</button>
          </div>
        </div>
      `;
    } else {
      slidersHtml += `
        <div class="parameter-slider-group" style="margin-top: 15px;">
          <div class="parameter-label-container">
            <label>Volume Cairan Cair (mL)</label>
            <span class="parameter-value-badge" id="badge-heating-volume">${simState.heatingVolume} mL</span>
          </div>
          <input type="range" class="parameter-slider" id="slider-heating-volume" min="100" max="500" step="50" value="${simState.heatingVolume}">
        </div>
        <div class="parameter-slider-group">
          <div class="parameter-label-container">
            <label>Daya Pemanas Bunsen (Watt)</label>
            <span class="parameter-value-badge" id="badge-heating-power">${simState.heatingPower} W</span>
          </div>
          <input type="range" class="parameter-slider" id="slider-heating-power" min="100" max="1000" step="50" value="${simState.heatingPower}">
        </div>
        
        <div style="margin-top: 15px; padding: 12px; background: rgba(0,0,0,0.03); border-radius: 8px; text-align: center;">
          <div style="font-size: 0.85rem; color: var(--text-secondary);">Suhu Cairan Aktual</div>
          <div style="font-size: 1.8rem; font-weight: bold; color: var(--brand-orange); margin-top: 4px;" id="heating-temp-readout">
            ${simState.heatingTemp.toFixed(1)} °C
          </div>
        </div>
      `;
    }
  } else if (type === "skate_ramp") {
    slidersHtml = `
      <div class="parameter-slider-group">
        <div class="parameter-label-container">
          <label>Massa Skater (kg)</label>
          <span class="parameter-value-badge" id="badge-skate-mass">${simState.skateMass.toFixed(1)} kg</span>
        </div>
        <input type="range" class="parameter-slider" id="slider-skate-mass" min="1.0" max="20.0" step="0.5" value="${simState.skateMass}">
      </div>
      <div class="parameter-slider-group">
        <div class="parameter-label-container">
          <label>Koefisien Gesek Ramp (&mu;)</label>
          <span class="parameter-value-badge" id="badge-skate-friction">${simState.skateFriction.toFixed(2)}</span>
        </div>
        <input type="range" class="parameter-slider" id="slider-skate-friction" min="0.0" max="0.5" step="0.02" value="${simState.skateFriction}">
      </div>
      <div class="parameter-slider-group">
        <div class="parameter-label-container">
          <label>Tinggi Pelepasan Awal (meter)</label>
          <span class="parameter-value-badge" id="badge-skate-height">${simState.skateInitialHeight.toFixed(1)} m</span>
        </div>
        <input type="range" class="parameter-slider" id="slider-skate-height" min="2.0" max="6.0" step="0.5" value="${simState.skateInitialHeight}">
      </div>
    `;
  } else if (type === "wind_solar") {
    slidersHtml = `
      <div class="parameter-slider-group">
        <div class="parameter-label-container">
          <label>Kecepatan Angin (m/s)</label>
          <span class="parameter-value-badge" id="badge-wind-speed">${simState.windSpeed.toFixed(1)} m/s</span>
        </div>
        <input type="range" class="parameter-slider" id="slider-wind-speed" min="0.0" max="12.0" step="0.5" value="${simState.windSpeed}">
      </div>
      <div class="parameter-slider-group">
        <div class="parameter-label-container">
          <label>Sudut Matahari (°)</label>
          <span class="parameter-value-badge" id="badge-solar-angle">${simState.solarAngle}°</span>
        </div>
        <input type="range" class="parameter-slider" id="slider-solar-angle" min="0" max="180" step="5" value="${simState.solarAngle}">
      </div>
      <div class="parameter-slider-group">
        <div class="parameter-label-container">
          <label>Tutupan Awan (%)</label>
          <span class="parameter-value-badge" id="badge-cloudiness">${simState.cloudiness}%</span>
        </div>
        <input type="range" class="parameter-slider" id="slider-cloudiness" min="0" max="100" step="5" value="${simState.cloudiness}">
      </div>
    `;
  } else if (type === "greenhouse") {
    slidersHtml = `
      <div class="parameter-slider-group">
        <div class="parameter-label-container">
          <label>Konsentrasi CO<sub>2</sub> Atmosfer</label>
          <span class="parameter-value-badge" id="badge-co2-ppm">${simState.co2Ppm} ppm</span>
        </div>
        <input type="range" class="parameter-slider" id="slider-co2-ppm" min="280" max="880" step="10" value="${simState.co2Ppm}">
      </div>
      <div class="parameter-slider-group">
        <div class="parameter-label-container">
          <label>Tingkat Emisi Industri</label>
        </div>
        <select class="form-control" id="select-emissions" style="width: 100%;">
          <option value="rendah" ${simState.emissions === 'rendah' ? 'selected' : ''}>Rendah (Ramah Lingkungan)</option>
          <option value="sedang" ${simState.emissions === 'sedang' ? 'selected' : ''}>Sedang (Standar Global)</option>
          <option value="tinggi" ${simState.emissions === 'tinggi' ? 'selected' : ''}>Tinggi (Industrialisasi Padat)</option>
        </select>
      </div>
      <div class="parameter-slider-group" style="margin-top: 15px;">
        <div class="parameter-label-container">
          <label>Upaya Penghijauan / Albedo</label>
          <span class="parameter-value-badge" id="badge-greening">${simState.greening}%</span>
        </div>
        <input type="range" class="parameter-slider" id="slider-greening" min="0" max="100" step="5" value="${simState.greening}">
      </div>
    `;
  } else if (type === "motion" || type === "forces") {
    slidersHtml = `
      <div class="parameter-slider-group">
        <div class="parameter-label-container">
          <label>Massa Beban (kg)</label>
          <span class="parameter-value-badge" id="badge-mass-val">5 kg</span>
        </div>
        <input type="range" class="parameter-slider" id="slider-mass" min="1" max="20" step="0.5" value="5">
      </div>
      <div class="parameter-slider-group">
        <div class="parameter-label-container">
          <label>Gaya Dorong (N)</label>
          <span class="parameter-value-badge" id="badge-force-val">25 N</span>
        </div>
        <input type="range" class="parameter-slider" id="slider-force" min="0" max="100" step="1" value="25">
      </div>
      <div class="parameter-slider-group">
        <div class="parameter-label-container">
          <label>Koefisien Gesek (&mu;<sub>k</sub>)</label>
          <span class="parameter-value-badge" id="badge-friction-val">0.20</span>
        </div>
        <input type="range" class="parameter-slider" id="slider-friction" min="0" max="0.8" step="0.05" value="0.2">
      </div>
    `;
  } else if (type === "dc_circuit") {
    slidersHtml = `
      <div class="parameter-slider-group">
        <div class="parameter-label-container">
          <label>Tegangan Baterai (Volt)</label>
          <span class="parameter-value-badge" id="badge-voltage-val">12 V</span>
        </div>
        <input type="range" class="parameter-slider" id="slider-voltage" min="1" max="24" step="0.5" value="12">
      </div>
      <div class="parameter-slider-group">
        <div class="parameter-label-container">
          <label>Hambatan Resistor (Ohm)</label>
          <span class="parameter-value-badge" id="badge-resistance-val">100 &Omega;</span>
        </div>
        <input type="range" class="parameter-slider" id="slider-resistance" min="10" max="500" step="5" value="100">
      </div>
    `;
  } else if (type === "vector") {
    slidersHtml = `
      <div class="parameter-slider-group">
        <div class="parameter-label-container">
          <label>Panjang Vektor A (F1)</label>
          <span class="parameter-value-badge" id="badge-vector-a-mag">${(simState.vectorAMag !== undefined ? simState.vectorAMag : 5).toFixed(1)}</span>
        </div>
        <input type="range" class="parameter-slider" id="slider-vector-a-mag" min="0" max="10" step="0.1" value="${simState.vectorAMag !== undefined ? simState.vectorAMag : 5}">
      </div>
      <div class="parameter-slider-group">
        <div class="parameter-label-container">
          <label>Sudut Vektor A (°)</label>
          <span class="parameter-value-badge" id="badge-vector-a-ang">${simState.vectorAAngle !== undefined ? simState.vectorAAngle : 30}°</span>
        </div>
        <input type="range" class="parameter-slider" id="slider-vector-a-ang" min="0" max="360" step="5" value="${simState.vectorAAngle !== undefined ? simState.vectorAAngle : 30}">
      </div>
      <div class="parameter-slider-group" style="margin-top: 15px; border-top: 1px solid var(--glass-border); padding-top: 15px;">
        <div class="parameter-label-container">
          <label>Panjang Vektor B (F2)</label>
          <span class="parameter-value-badge" id="badge-vector-b-mag">${(simState.vectorBMag !== undefined ? simState.vectorBMag : 7).toFixed(1)}</span>
        </div>
        <input type="range" class="parameter-slider" id="slider-vector-b-mag" min="0" max="10" step="0.1" value="${simState.vectorBMag !== undefined ? simState.vectorBMag : 7}">
      </div>
      <div class="parameter-slider-group">
        <div class="parameter-label-container">
          <label>Sudut Vektor B (°)</label>
          <span class="parameter-value-badge" id="badge-vector-b-ang">${simState.vectorBAngle !== undefined ? simState.vectorBAngle : 120}°</span>
        </div>
        <input type="range" class="parameter-slider" id="slider-vector-b-ang" min="0" max="360" step="5" value="${simState.vectorBAngle !== undefined ? simState.vectorBAngle : 120}">
      </div>
    `;
  } else {
    // Fallback widgets
    slidersHtml = `
      <div class="parameter-slider-group">
        <div class="parameter-label-container">
          <label>Parameter Amplitudo / Panjang</label>
          <span class="parameter-value-badge" id="badge-generic1-val">5.0</span>
        </div>
        <input type="range" class="parameter-slider" id="slider-generic-1" min="1" max="10" step="0.1" value="5">
      </div>
      <div class="parameter-slider-group">
        <div class="parameter-label-container">
          <label>Parameter Frekuensi / Konstanta</label>
          <span class="parameter-value-badge" id="badge-generic2-val">10.0</span>
        </div>
        <input type="range" class="parameter-slider" id="slider-generic-2" min="1" max="20" step="0.5" value="10">
      </div>
    `;
  }

  container.innerHTML = slidersHtml;

  // Bind slider events
  bindSliderEvents(type);
}

function bindSliderEvents(type) {
  if (type === "measurement") {
    const objSel = document.getElementById("sim-meas-obj");
    const posSld = document.getElementById("slider-caliper-pos");
    const ohaus100Sld = document.getElementById("slider-ohaus-100");
    const ohaus10Sld = document.getElementById("slider-ohaus-10");
    const ohaus1Sld = document.getElementById("slider-ohaus-1");
    const circVoltSld = document.getElementById("slider-circ-volt");
    const circResSld = document.getElementById("slider-circ-res");

    // 1. Category Switch
    document.querySelectorAll(".btn-meas-cat").forEach(btn => {
      btn.addEventListener("click", () => {
        const newCat = btn.getAttribute("data-cat");
        simState.measurementCategory = newCat;
        
        // Reset category defaults
        if (newCat === "panjang") {
          simState.measurementTool = "mistar";
          simState.measurementSelectedObj = "kelereng";
          simState.measurementTargetVal = 12.35;
          simState.userCaliperPos = 0;
        } else if (newCat === "massa") {
          simState.measurementTool = "neraca_ohaus";
          simState.measurementSelectedObj = "kelereng";
          simState.measurementTargetVal = 5.6;
          simState.userOhaus100 = 0;
          simState.userOhaus10 = 0;
          simState.userOhaus1 = 0;
        } else if (newCat === "waktu") {
          simState.measurementTool = "stopwatch";
          simState.measurementSelectedObj = "bola_jatuh";
          simState.measurementTargetVal = Math.sqrt(4 / 9.8); // 0.6388
          simState.stopwatchTime = 0;
          simState.stopwatchRunning = false;
          simState.ballY = 0;
          simState.ballVy = 0;
        } else if (newCat === "listrik") {
          simState.measurementTool = "multimeter";
          simState.measurementSelectedObj = "voltmeter";
          simState.measurementTargetVal = simState.circVoltage; // 9V
        }

        if (window.initLKPDForLab) {
          window.initLKPDForLab(activeLabId);
        }
        renderSlidersForLab("measurement");
        drawSimulation();
      });
    });

    // 2. Tool Switch
    document.querySelectorAll(".btn-meas-tool").forEach(btn => {
      btn.addEventListener("click", () => {
        const toolVal = btn.getAttribute("data-tool");
        if (!toolVal) return;
        simState.measurementTool = toolVal;
        simState.userCaliperPos = 0; // reset pos on tool change
        simState.userOhaus100 = 0;
        simState.userOhaus10 = 0;
        simState.userOhaus1 = 0;
        simState.showReadingHelp = false;
        renderSlidersForLab("measurement");
        drawSimulation();
      });
    });

    // 3. Object Switch
    if (objSel) {
      objSel.addEventListener("change", () => {
        const obj = objSel.value;
        simState.measurementSelectedObj = obj;

        // Set Target values
        if (simState.measurementCategory === "panjang") {
          simState.userCaliperPos = 0;
          if (obj === "kelereng") simState.measurementTargetVal = 12.35;
          else if (obj === "kawat") simState.measurementTargetVal = 2.48;
          else if (obj === "plat") simState.measurementTargetVal = 0.78;
          else if (obj === "koin") simState.measurementTargetVal = 25.15;
          else if (obj === "buku") simState.measurementTargetVal = 8.40;
          else simState.measurementTargetVal = 12.35;
        } else if (simState.measurementCategory === "massa") {
          if (obj === "kelereng") simState.measurementTargetVal = 5.6;
          else if (obj === "silinder") simState.measurementTargetVal = 145.8;
          else if (obj === "balok") simState.measurementTargetVal = 320.4;
          else if (obj === "koin") simState.measurementTargetVal = 12.5;
          else if (obj === "batu") simState.measurementTargetVal = 45.2;
          else simState.measurementTargetVal = 5.6;
          
          simState.userOhaus100 = 0;
          simState.userOhaus10 = 0;
          simState.userOhaus1 = 0;
        } else if (simState.measurementCategory === "listrik") {
          if (obj === "voltmeter") {
            simState.measurementTargetVal = simState.circVoltage;
          } else {
            simState.measurementTargetVal = simState.circVoltage / simState.circResistance;
          }
        }
        
        renderSlidersForLab("measurement");
        drawSimulation();
      });
    }

    // 4. Length Slider
    if (posSld) {
      posSld.addEventListener("input", () => {
        simState.userCaliperPos = parseFloat(posSld.value);
        let precision = 0;
        if (simState.measurementTool === "caliper") precision = 1;
        else if (simState.measurementTool === "micrometer") precision = 2;
        
        const badge = document.getElementById("badge-caliper-val");
        if (badge) {
          badge.textContent = `${simState.userCaliperPos.toFixed(precision)} mm`;
        }
        drawSimulation();
      });
    }

    // 5. Ohaus sliders
    if (ohaus100Sld) {
      ohaus100Sld.addEventListener("input", () => {
        simState.userOhaus100 = parseInt(ohaus100Sld.value);
        renderSlidersForLab("measurement");
        drawSimulation();
      });
    }
    if (ohaus10Sld) {
      ohaus10Sld.addEventListener("input", () => {
        simState.userOhaus10 = parseInt(ohaus10Sld.value);
        renderSlidersForLab("measurement");
        drawSimulation();
      });
    }
    if (ohaus1Sld) {
      ohaus1Sld.addEventListener("input", () => {
        simState.userOhaus1 = parseFloat(ohaus1Sld.value);
        renderSlidersForLab("measurement");
        drawSimulation();
      });
    }

    // 6. Digital weight place button
    const placeDigitalBtn = document.getElementById("btn-place-digital");
    if (placeDigitalBtn) {
      placeDigitalBtn.onclick = () => {
        simState.userOhaus100 = 0; // use these to represent state
        simState.userOhaus10 = 0;
        simState.userOhaus1 = simState.measurementTargetVal; // balance matches target immediately
        window.showToast("Benda diletakkan di timbangan digital.");
        drawSimulation();
      };
    }

    // 7. Stopwatch triggers
    const dropBtn = document.getElementById("btn-drop-ball");
    const resetBallBtn = document.getElementById("btn-reset-ball");

    if (dropBtn) {
      dropBtn.onclick = () => {
        simState.stopwatchTime = 0;
        simState.ballY = 0;
        simState.stopwatchRunning = true;
        if (!isSimRunning) {
          isSimRunning = true;
          simInterval = setInterval(simulationLoop, 30);
        }
        window.showToast("Kelereng dijatuhkan! Stopwatch dimulai.");
      };
    }

    if (resetBallBtn) {
      resetBallBtn.onclick = () => {
        simState.stopwatchTime = 0;
        simState.ballY = 0;
        simState.stopwatchRunning = false;
        drawSimulation();
        window.showToast("Stopwatch direset.");
      };
    }

    // 8. Circuit parameters
    if (circVoltSld) {
      circVoltSld.addEventListener("input", () => {
        simState.circVoltage = parseFloat(circVoltSld.value);
        if (simState.measurementSelectedObj === "voltmeter") {
          simState.measurementTargetVal = simState.circVoltage;
        } else {
          simState.measurementTargetVal = simState.circVoltage / simState.circResistance;
        }
        renderSlidersForLab("measurement");
        drawSimulation();
      });
    }

    if (circResSld) {
      circResSld.addEventListener("input", () => {
        simState.circResistance = parseInt(circResSld.value);
        if (simState.measurementSelectedObj === "voltmeter") {
          simState.measurementTargetVal = simState.circVoltage;
        } else {
          simState.measurementTargetVal = simState.circVoltage / simState.circResistance;
        }
        renderSlidersForLab("measurement");
        drawSimulation();
      });
    }

    // 9. Reading Help toggle button
    const toggleHelpBtn = document.getElementById("btn-toggle-reading-help");
    if (toggleHelpBtn) {
      toggleHelpBtn.onclick = () => {
        simState.showReadingHelp = !simState.showReadingHelp;
        renderSlidersForLab("measurement");
        drawSimulation();
      };
    }

  } else if (type === "scientific_method") {
    // 1. Mode selection click handler
    document.querySelectorAll(".btn-sm-mode").forEach(btn => {
      btn.onclick = () => {
        simState.scientificMethodMode = btn.getAttribute("data-mode");
        isSimRunning = false;
        clearInterval(simInterval);
        resetSimState();
        renderSlidersForLab("scientific_method");
        drawSimulation();
        drawGraph();
        if (window.initLKPDForLab) window.initLKPDForLab(activeLabId);
      };
    });

    // 2. Safety actions click handlers
    document.querySelectorAll(".btn-safety-action").forEach(btn => {
      btn.onclick = () => {
        if (simState.scientificMethodMode !== "safety") return;
        const action = btn.getAttribute("data-action");
        const activeHazardId = simState.safetySelectedHazard;
        
        if (!activeHazardId) {
          window.showToast("Klik terlebih dahulu salah satu area hazard (berpendar merah) di laboratorium!", "warning");
          return;
        }

        const hazard = simState.safetyActiveHazards.find(h => h.id === activeHazardId);
        if (hazard) {
          if (hazard.tool === action) {
            hazard.solved = true;
            simState.safetySelectedHazard = null; // deselect
            // Recalculate score
            simState.safetyCorrectCount = simState.safetyActiveHazards.filter(h => h.solved).length;
            
            window.showToast(`Berhasil! ${hazard.name} telah diatasi menggunakan ${hazard.label}.`, "success");
            
            // Record direct to lkpd data row!
            const rowData = {
              alat: hazard.name.toUpperCase(),
              benda: "HAZARD LAB",
              su: "Terdeteksi",
              sn: hazard.label.toUpperCase(),
              siswa: "AMAN",
              benar: "AMAN",
              eval: "✔️ TERATASI"
            };
            if (window.observationsList) {
              window.observationsList.push(rowData);
              if (window.renderObservationRows) window.renderObservationRows();
            }

            renderSlidersForLab("scientific_method");
            drawSimulation();
            
            if (simState.safetyCorrectCount === 4) {
              window.showToast("Luar biasa! Seluruh hazard laboratorium berhasil dinetralkan secara aman.", "success");
            }
          } else {
            window.showToast("Tindakan kurang tepat! Silakan pilih alat keselamatan alternatif.", "warning");
          }
        }
      };
    });

    // 3. Experiment sliders
    const volSld = document.getElementById("slider-heating-volume");
    const powSld = document.getElementById("slider-heating-power");
    
    if (volSld) {
      volSld.oninput = () => {
        simState.heatingVolume = parseInt(volSld.value);
        document.getElementById("badge-heating-volume").textContent = `${simState.heatingVolume} mL`;
        triggerAutosave();
        drawSimulation();
      };
    }
    if (powSld) {
      powSld.oninput = () => {
        simState.heatingPower = parseInt(powSld.value);
        document.getElementById("badge-heating-power").textContent = `${simState.heatingPower} W`;
        triggerAutosave();
        drawSimulation();
      };
    }

  } else if (type === "skate_ramp") {
    const massSld = document.getElementById("slider-skate-mass");
    const fricSld = document.getElementById("slider-skate-friction");
    const heightSld = document.getElementById("slider-skate-height");

    if (massSld) {
      massSld.oninput = () => {
        simState.skateMass = parseFloat(massSld.value);
        document.getElementById("badge-skate-mass").textContent = `${simState.skateMass.toFixed(1)} kg`;
        triggerAutosave();
      };
    }
    if (fricSld) {
      fricSld.oninput = () => {
        simState.skateFriction = parseFloat(fricSld.value);
        document.getElementById("badge-skate-friction").textContent = simState.skateFriction.toFixed(2);
        triggerAutosave();
      };
    }
    if (heightSld) {
      heightSld.oninput = () => {
        simState.skateInitialHeight = parseFloat(heightSld.value);
        document.getElementById("badge-skate-height").textContent = `${simState.skateInitialHeight.toFixed(1)} m`;
        
        // Reset skater position to match the height
        simState.skateX = -150;
        simState.skateVx = 0;
        simTime = 0;
        
        triggerAutosave();
        drawSimulation();
        drawGraph();
      };
    }

  } else if (type === "wind_solar") {
    const wSpdSld = document.getElementById("slider-wind-speed");
    const sAngSld = document.getElementById("slider-solar-angle");
    const cloudSld = document.getElementById("slider-cloudiness");

    if (wSpdSld) {
      wSpdSld.oninput = () => {
        simState.windSpeed = parseFloat(wSpdSld.value);
        document.getElementById("badge-wind-speed").textContent = `${simState.windSpeed.toFixed(1)} m/s`;
        triggerAutosave();
        drawSimulation();
      };
    }
    if (sAngSld) {
      sAngSld.oninput = () => {
        simState.solarAngle = parseInt(sAngSld.value);
        document.getElementById("badge-solar-angle").textContent = `${simState.solarAngle}°`;
        triggerAutosave();
        drawSimulation();
      };
    }
    if (cloudSld) {
      cloudSld.oninput = () => {
        simState.cloudiness = parseInt(cloudSld.value);
        document.getElementById("badge-cloudiness").textContent = `${simState.cloudiness}%`;
        triggerAutosave();
        drawSimulation();
      };
    }

  } else if (type === "greenhouse") {
    const co2Sld = document.getElementById("slider-co2-ppm");
    const emissionsSel = document.getElementById("select-emissions");
    const greenSld = document.getElementById("slider-greening");

    if (co2Sld) {
      co2Sld.oninput = () => {
        simState.co2Ppm = parseInt(co2Sld.value);
        document.getElementById("badge-co2-ppm").textContent = `${simState.co2Ppm} ppm`;
        triggerAutosave();
        drawSimulation();
        drawGraph();
      };
    }
    if (emissionsSel) {
      emissionsSel.onchange = () => {
        simState.emissions = emissionsSel.value;
        triggerAutosave();
        drawSimulation();
        drawGraph();
      };
    }
    if (greenSld) {
      greenSld.oninput = () => {
        simState.greening = parseInt(greenSld.value);
        document.getElementById("badge-greening").textContent = `${simState.greening}%`;
        triggerAutosave();
        drawSimulation();
        drawGraph();
      };
    }

  } else if (type === "motion" || type === "forces") {
    const massSld = document.getElementById("slider-mass");
    const forceSld = document.getElementById("slider-force");
    const fricSld = document.getElementById("slider-friction");

    massSld.addEventListener("input", () => {
      simState.blockMass = parseFloat(massSld.value);
      document.getElementById("badge-mass-val").textContent = `${simState.blockMass} kg`;
      triggerAutosave();
    });
    forceSld.addEventListener("input", () => {
      simState.pushForce = parseFloat(forceSld.value);
      document.getElementById("badge-force-val").textContent = `${simState.pushForce} N`;
      triggerAutosave();
    });
    fricSld.addEventListener("input", () => {
      simState.frictionCoeff = parseFloat(fricSld.value);
      document.getElementById("badge-friction-val").textContent = `${simState.frictionCoeff.toFixed(2)}`;
      triggerAutosave();
    });
  } else if (type === "dc_circuit") {
    const voltSld = document.getElementById("slider-voltage");
    const resSld = document.getElementById("slider-resistance");

    voltSld.addEventListener("input", () => {
      simState.circVoltage = parseFloat(voltSld.value);
      document.getElementById("badge-voltage-val").textContent = `${simState.circVoltage} V`;
      triggerAutosave();
      drawSimulation();
      drawGraph();
    });
    resSld.addEventListener("input", () => {
      simState.circResistance = parseFloat(resSld.value);
      document.getElementById("badge-resistance-val").textContent = `${simState.circResistance} \u03a9`;
      triggerAutosave();
      drawSimulation();
      drawGraph();
    });
  } else if (type === "vector") {
    const magASld = document.getElementById("slider-vector-a-mag");
    const angASld = document.getElementById("slider-vector-a-ang");
    const magBSld = document.getElementById("slider-vector-b-mag");
    const angBSld = document.getElementById("slider-vector-b-ang");

    if (magASld) {
      magASld.addEventListener("input", () => {
        simState.vectorAMag = parseFloat(magASld.value);
        document.getElementById("badge-vector-a-mag").textContent = simState.vectorAMag.toFixed(1);
        triggerAutosave();
        drawSimulation();
        drawGraph();
      });
    }
    if (angASld) {
      angASld.addEventListener("input", () => {
        simState.vectorAAngle = parseInt(angASld.value);
        document.getElementById("badge-vector-a-ang").textContent = `${simState.vectorAAngle}°`;
        triggerAutosave();
        drawSimulation();
        drawGraph();
      });
    }
    if (magBSld) {
      magBSld.addEventListener("input", () => {
        simState.vectorBMag = parseFloat(magBSld.value);
        document.getElementById("badge-vector-b-mag").textContent = simState.vectorBMag.toFixed(1);
        triggerAutosave();
        drawSimulation();
        drawGraph();
      });
    }
    if (angBSld) {
      angBSld.addEventListener("input", () => {
        simState.vectorBAngle = parseInt(angBSld.value);
        document.getElementById("badge-vector-b-ang").textContent = `${simState.vectorBAngle}°`;
        triggerAutosave();
        drawSimulation();
        drawGraph();
      });
    }
  } else {
    const sld1 = document.getElementById("slider-generic-1");
    const sld2 = document.getElementById("slider-generic-2");
    
    if (sld1) {
      sld1.addEventListener("input", () => {
        simState.widgetSlider1 = parseFloat(sld1.value);
        document.getElementById("badge-generic1-val").textContent = simState.widgetSlider1.toFixed(1);
        triggerAutosave();
        drawSimulation();
      });
    }
    if (sld2) {
      sld2.addEventListener("input", () => {
        simState.widgetSlider2 = parseFloat(sld2.value);
        document.getElementById("badge-generic2-val").textContent = simState.widgetSlider2.toFixed(1);
        triggerAutosave();
        drawSimulation();
      });
    }
  }
}

// Resets physics simulation vectors
function resetSimState() {
  simTime = 0;
  simState.blockX = 80;
  simState.blockVx = 0;
  simState.blockAx = 0;
  simState.forceLog = [];
  
  if (activeLabType === "caliper" || activeLabType === "micrometer" || activeLabType === "measurement") {
    simState.measurementCategory = "panjang";
    simState.measurementTool = "mistar";
    simState.measurementSelectedObj = "kelereng";
    simState.measurementTargetVal = 12.35;
    simState.userCaliperPos = 0;
    simState.userOhaus100 = 0;
    simState.userOhaus10 = 0;
    simState.userOhaus1 = 0;
    simState.stopwatchTime = 0;
    simState.stopwatchRunning = false;
    simState.ballY = 0;
    simState.ballVy = 0;
  }
  
  if (activeLabType === "scientific_method") {
    simState.scientificMethodMode = "safety";
    simState.safetyCorrectCount = 0;
    simState.safetyActiveHazards.forEach(h => h.solved = false);
    simState.heatingVolume = 200;
    simState.heatingPower = 500;
    simState.heatingTemp = 25.0;
  }

  if (activeLabType === "skate_ramp") {
    simState.skateMass = 5.0;
    simState.skateFriction = 0.1;
    simState.skateInitialHeight = 5.0;
    simState.skateX = -150;
    simState.skateVx = 0;
    simState.skateEk = 0;
    simState.skateEp = 0;
    simState.skateEtherm = 0;
    simState.skateEm = 0;
    simState.skateAmp = 150;
  }

  if (activeLabType === "wind_solar") {
    simState.windSpeed = 5.0;
    simState.solarAngle = 90;
    simState.cloudiness = 20;
    simState.windPower = 0;
    simState.solarPower = 0;
    simState.batteryCharge = 0;
  }

  if (activeLabType === "greenhouse") {
    simState.co2Ppm = 350;
    simState.emissions = "sedang";
    simState.greening = 20;
    simState.earthTemp = 15.0;
  }

  if (activeLabType === "vector") {
    simState.vectorAMag = 5;
    simState.vectorAAngle = 30;
    simState.vectorBMag = 7;
    simState.vectorBAngle = 120;
  }
  
  if (document.getElementById("slider-caliper-pos")) {
    document.getElementById("slider-caliper-pos").value = 0;
  }
}

// Binds Play/Pause/Stop controls
function bindLabButtons() {
  const btnStart = document.getElementById("btn-sim-start");
  const btnPause = document.getElementById("btn-sim-pause");
  const btnStop = document.getElementById("btn-sim-stop");
  const btnReset = document.getElementById("btn-sim-reset");
  const btnGraph = document.getElementById("btn-download-graph");

  if (btnStart) {
    btnStart.onclick = () => {
      if (!isSimRunning) {
        isSimRunning = true;
        simInterval = setInterval(simulationLoop, 30); // ~33 fps
        window.showToast("Simulasi dimulai.");
      }
    };
  }

  if (btnPause) {
    btnPause.onclick = () => {
      if (isSimRunning) {
        isSimRunning = false;
        clearInterval(simInterval);
        window.showToast("Simulasi dijedat.");
      }
    };
  }

  if (btnStop) {
    btnStop.onclick = () => {
      isSimRunning = false;
      clearInterval(simInterval);
      resetSimState();
      drawSimulation();
      drawGraph();
      window.showToast("Simulasi diberhentikan & direset.");
    };
  }

  if (btnReset) {
    btnReset.onclick = () => {
      isSimRunning = false;
      clearInterval(simInterval);
      resetSimState();
      renderSlidersForLab(activeLabType);
      drawSimulation();
      drawGraph();
      window.showToast("Parameter direset ke default.");
    };
  }

  if (btnGraph) {
    btnGraph.onclick = () => {
      downloadGraphPNG();
    };
  }
}

// Tab navigation for right panel
function setupLabTabs() {
  const tabs = ["sim", "lkpd", "tutor"];
  tabs.forEach(t => {
    const btn = document.getElementById(`tab-lab-${t}`);
    if (btn) {
      btn.onclick = () => {
        // Toggle active tabs
        tabs.forEach(o => {
          document.getElementById(`tab-lab-${o}`).classList.remove("active");
          document.getElementById(`panel-content-${o}`).classList.add("hidden-section");
        });
        btn.classList.add("active");
        document.getElementById(`panel-content-${t}`).classList.remove("hidden-section");
      };
    }
  });
}

// Core Physics Animation Loop
function simulationLoop() {
  simTime += 0.03; // ~30ms step

  if (activeLabType === "motion" || activeLabType === "forces") {
    // Forces calculations
    const g = 9.8;
    const forceNormal = simState.blockMass * g;
    const maxFrictionStatic = simState.frictionCoeff * 1.2 * forceNormal; // simple static coeff multiplier
    const frictionKinetic = simState.frictionCoeff * forceNormal;

    let netForce = 0;
    
    // Check static release threshold
    if (Math.abs(simState.pushForce) > maxFrictionStatic || simState.blockVx > 0.01) {
      const frictionDir = simState.blockVx > 0 ? -1 : 1;
      netForce = simState.pushForce + (frictionDir * frictionKinetic);
    } else {
      netForce = 0;
      simState.blockVx = 0;
    }

    simState.blockAx = netForce / simState.blockMass;
    simState.blockVx += simState.blockAx * 0.03;
    simState.blockX += simState.blockVx * 3.5; // pixel multiplier

    // Add graph trace point
    simState.forceLog.push({
      t: simTime,
      s: (simState.blockX - 80) / 10, // virtual meter
      v: simState.blockVx
    });

    // Bound limits
    if (simState.blockX > canvasEl.width - 120 || simState.blockX < 40) {
      isSimRunning = false;
      clearInterval(simInterval);
      simState.blockVx = 0;
      window.showToast("Balok mencapai ujung lintasan.");
    }
  } 
  
  else if (activeLabType === "scientific_method") {
    if (simState.scientificMethodMode === "experiment") {
      // Heating thermodynamics: dT = P * dt / (m * c)
      // V is in mL (mass in grams), P is in Watts, c is 4.18 J/gC
      const dt = 0.03;
      const mass = simState.heatingVolume;
      const power = simState.heatingPower;
      const c = 4.18;
      
      const dT = (power * dt) / (mass * c);
      simState.heatingTemp = Math.min(100.0, simState.heatingTemp + dT);
      
      const tempReadout = document.getElementById("heating-temp-readout");
      if (tempReadout) {
        tempReadout.textContent = `${simState.heatingTemp.toFixed(1)} °C`;
      }

      // Log to graph: s = heating volume / 5, v = temperature
      simState.forceLog.push({
        t: simTime,
        s: simState.heatingVolume / 10,
        v: simState.heatingTemp
      });

      if (simState.heatingTemp >= 100.0 && simTime % 3 < 0.05) {
        window.showToast("Cairan mendidih! Suhu stabil di 100.0 °C (Titik Didih).", "info");
      }
    }
  }

  else if (activeLabType === "skate_ramp") {
    // Parabolic U-ramp oscillation amplitude decay model
    // Damping factor gamma is proportional to friction coefficient
    const gamma = simState.skateFriction * 0.07;
    const omega = 1.6; // angular frequency (rad/s)
    
    // Position of skater: x = A * cos(omega * t + pi)
    // Starts at x = -150px at t = 0
    const amplitude = 150 * Math.exp(-gamma * simTime);
    simState.skateX = amplitude * Math.cos(omega * simTime + Math.PI);
    
    // Physical height calculation: y = h_max * (x/150)^2
    const h_max = simState.skateInitialHeight;
    const currentHeight = h_max * Math.pow(simState.skateX / 150, 2);
    
    // Energies calculation
    const g = 9.8;
    const m = simState.skateMass;
    const initialEnergy = m * g * h_max;
    const currentMaxEnergy = m * g * h_max * Math.pow(amplitude / 150, 2);
    
    simState.skateEp = m * g * currentHeight;
    simState.skateEk = Math.max(0, currentMaxEnergy - simState.skateEp);
    simState.skateEtherm = initialEnergy - (simState.skateEp + simState.skateEk);
    simState.skateEm = initialEnergy;
    
    // Skate speed
    simState.skateVx = Math.sqrt(2 * simState.skateEk / m);
    
    // Record to graph: s = Ep (J), v = Ek (J)
    simState.forceLog.push({
      t: simTime,
      s: simState.skateEp / 5,
      v: simState.skateEk / 5
    });

    if (amplitude < 2.0 && isSimRunning) {
      isSimRunning = false;
      clearInterval(simInterval);
      simState.skateX = 0;
      simState.skateVx = 0;
      simState.skateEk = 0;
      simState.skateEp = 0;
      simState.skateEtherm = initialEnergy;
      window.showToast("Skater berhenti di dasar lintasan karena gaya gesek.");
    }
  }

  else if (activeLabType === "wind_solar") {
    // Blades rotation angle increment
    simState.wavePhase += simState.windSpeed * 0.06;
    
    // Power calculations
    simState.windPower = 0.015 * Math.pow(simState.windSpeed, 3);
    const sunRad = simState.solarAngle * Math.PI / 180;
    simState.solarPower = Math.max(0, 20.0 * Math.sin(sunRad) * (1 - simState.cloudiness/100));
    
    const totalPower = simState.windPower + simState.solarPower;
    simState.batteryCharge = Math.min(100.0, simState.batteryCharge + totalPower * 0.015);
    
    // Log to graph: s = windPower, v = solarPower
    simState.forceLog.push({
      t: simTime,
      s: simState.windPower,
      v: simState.solarPower
    });
  }

  else if (activeLabType === "greenhouse") {
    // Model temperature
    const baseTemp = 14.0;
    const dTempCO2 = 14.0 * (simState.co2Ppm - 280) / 600;
    const dTempEmissions = simState.emissions === "tinggi" ? 4.0 : (simState.emissions === "sedang" ? 2.0 : 0.0);
    const dTempGreening = 3.0 * (simState.greening / 100);
    
    // Animate tiny wave oscillation for visual alive-ness
    const ripple = 0.08 * Math.sin(simTime * 4);
    simState.earthTemp = baseTemp + dTempCO2 + dTempEmissions - dTempGreening + ripple;
    
    // Log to graph: s = CO2 ppm/10, v = earthTemp
    simState.forceLog.push({
      t: simTime,
      s: simState.co2Ppm / 10,
      v: simState.earthTemp
    });
  }

  else if (activeLabType === "dc_circuit") {
    // Just increment electron rotation angle
    const current = simState.circVoltage / simState.circResistance; // A
    simState.electronAngle += current * 4;
  } 
  
  else {
    // Fallback anim updates
    simState.oscillatorAngle = 0.5 * Math.cos(simState.widgetSlider2 * 0.5 * simTime);
    simState.wavePhase += simState.widgetSlider2 * 0.02;
    
    // Photoelectric electron list additions
    if (Math.random() < simState.widgetSlider1 * 0.03) {
      simState.photoElectrons.push({
        x: 150,
        y: 100 + Math.random() * 50,
        vx: simState.widgetSlider2 * 0.4,
        vy: (Math.random() - 0.5) * 2
      });
    }
    // Update electrons
    simState.photoElectrons.forEach(e => { e.x += e.vx; e.y += e.vy; });
    simState.photoElectrons = simState.photoElectrons.filter(e => e.x < canvasEl.width - 100);
  }

  // Redraw
  drawSimulation();
  drawGraph();
}

// ----------------- DRAWING SIMULATIONS ENGINES -----------------

function drawSimulation() {
  if (!ctx || !canvasEl) return;
  ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);

  // Render theme backgrounds
  const isDark = document.documentElement.getAttribute("data-theme") === "dark";
  ctx.fillStyle = isDark ? "#0f172a" : "#cbd5e1";
  ctx.fillRect(0, 0, canvasEl.width, canvasEl.height);

  // Draw Specific viewports
  if (activeLabType === "caliper" || activeLabType === "micrometer" || activeLabType === "measurement") {
    drawMeasurementLab(isDark);
  } else if (activeLabType === "motion" || activeLabType === "forces") {
    drawBlockMotion(isDark);
  } else if (activeLabType === "scientific_method") {
    drawScientificMethod(isDark);
  } else if (activeLabType === "skate_ramp") {
    drawSkateRamp(isDark);
  } else if (activeLabType === "wind_solar") {
    drawWindSolar(isDark);
  } else if (activeLabType === "greenhouse") {
    drawGreenhouse(isDark);
  } else if (activeLabType === "dc_circuit") {
    drawCircuit(isDark);
  } else if (activeLabType === "vector") {
    drawVectorLab(isDark);
  } else {
    drawGenericWidget(isDark);
  }
}

function drawMeasurementLab(isDark) {
  const cat = simState.measurementCategory;
  if (cat === "panjang") {
    drawPanjangMeasurement(isDark);
  } else if (cat === "massa") {
    drawMassaMeasurement(isDark);
  } else if (cat === "waktu") {
    drawWaktuMeasurement(isDark);
  } else if (cat === "listrik") {
    drawListrikMeasurement(isDark);
  }
}

function drawPanjangMeasurement(isDark) {
  const tool = simState.measurementTool;
  if (tool === "mistar") {
    drawMistar(isDark);
  } else if (tool === "caliper") {
    drawCaliper(isDark);
  } else if (tool === "micrometer") {
    drawMicrometer(isDark);
  }
}

// Draw Mistar (Ruler)
function drawMistar(isDark) {
  const originX = 60;
  const originY = 100;
  const scaleZoom = 8;
  const posMM = simState.userCaliperPos;
  const slidePx = posMM * scaleZoom;

  // Draw object
  ctx.fillStyle = isDark ? "#475569" : "#64748b";
  ctx.strokeStyle = isDark ? "#cbd5e1" : "#0f172a";
  ctx.lineWidth = 2;

  const targetWidthPx = simState.measurementTargetVal * scaleZoom;
  ctx.save();
  ctx.fillStyle = "#fd7e14";
  if (simState.measurementSelectedObj === "kelereng") {
    ctx.beginPath();
    ctx.arc(originX + 110 + (targetWidthPx/2), originY + 16, targetWidthPx/2, 0, 2*Math.PI);
    ctx.fill();
    ctx.stroke();
  } else if (simState.measurementSelectedObj === "kawat") {
    ctx.fillRect(originX + 110, originY + 12, targetWidthPx, 8);
    ctx.strokeRect(originX + 110, originY + 12, targetWidthPx, 8);
  } else {
    ctx.fillRect(originX + 110, originY, targetWidthPx, 32);
    ctx.strokeRect(originX + 110, originY, targetWidthPx, 32);
  }
  ctx.restore();

  // Draw Ruler body
  ctx.fillStyle = "#cbd5e1";
  ctx.strokeStyle = "#475569";
  ctx.lineWidth = 2;
  ctx.fillRect(originX, originY - 30, canvasEl.width - 2*originX, 25);
  ctx.strokeRect(originX, originY - 30, canvasEl.width - 2*originX, 25);

  // Draw Ticks on Ruler
  ctx.fillStyle = "#1e293b";
  ctx.font = "8px monospace";
  ctx.textAlign = "center";
  const totalTicks = Math.floor((canvasEl.width - 2*originX - 110) / scaleZoom);
  for (let i = 0; i <= totalTicks; i++) {
    const tickX = originX + 110 + (i * scaleZoom);
    let tickHeight = 5;
    if (i % 10 === 0) {
      tickHeight = 12;
      ctx.fillText(`${i}`, tickX, originY - 20);
    } else if (i % 5 === 0) {
      tickHeight = 8;
    }
    ctx.fillRect(tickX - 0.5, originY - 5 - tickHeight, 1, tickHeight);
  }

  // Draw a sliding pointer to show alignment
  const pointerX = originX + 110 + slidePx;
  ctx.fillStyle = "#ef4444";
  ctx.beginPath();
  ctx.moveTo(pointerX, originY - 5);
  ctx.lineTo(pointerX - 6, originY - 15);
  ctx.lineTo(pointerX + 6, originY - 15);
  ctx.closePath();
  ctx.fill();

  // Draw Inset Zoom Box
  const zoomW = Math.min(450, canvasEl.width - 60);
  const zoomH = 100;
  const zoomX = (canvasEl.width - zoomW) / 2;
  const zoomY = canvasEl.height - 120;

  ctx.save();
  ctx.fillStyle = isDark ? "#1e293b" : "#f1f5f9";
  ctx.strokeStyle = varColor("--brand-blue");
  ctx.lineWidth = 3;
  ctx.fillRect(zoomX, zoomY, zoomW, zoomH);
  ctx.strokeRect(zoomX, zoomY, zoomW, zoomH);

  ctx.fillStyle = isDark ? "#94a3b8" : "#475569";
  ctx.font = "bold 10px sans-serif";
  ctx.textAlign = "left";
  ctx.fillText("KACA PEMBESAR UJUNG OBJEK (ZOOM RULER)", zoomX + 12, zoomY + 18);

  const zoomFactor = 16; 
  const centerX = zoomX + zoomW / 2;

  const objRightMM = simState.measurementTargetVal;
  ctx.fillStyle = "#fd7e14";
  const objectZoomX = centerX - (posMM - objRightMM) * zoomFactor;
  ctx.fillRect(zoomX + 10, zoomY + 45, Math.max(0, objectZoomX - (zoomX + 10)), 30);
  ctx.strokeStyle = "#0f172a";
  ctx.lineWidth = 2;
  ctx.strokeRect(zoomX + 10, zoomY + 45, Math.max(0, objectZoomX - (zoomX + 10)), 30);

  ctx.strokeStyle = isDark ? "#f8fafc" : "#0f172a";
  ctx.fillStyle = isDark ? "#f8fafc" : "#0f172a";
  ctx.lineWidth = 1.5;
  ctx.font = "10px monospace";
  ctx.textAlign = "center";

  const minVisibleMM = Math.floor(posMM - (zoomW / 2) / zoomFactor);
  const maxVisibleMM = Math.ceil(posMM + (zoomW / 2) / zoomFactor);

  for (let i = Math.max(0, minVisibleMM); i <= maxVisibleMM; i++) {
    const tickX = centerX + (i - posMM) * zoomFactor;
    if (tickX >= zoomX + 10 && tickX <= zoomX + zoomW - 10) {
      let tickHeight = 8;
      if (i % 10 === 0) {
        tickHeight = 18;
        ctx.fillText(`${i}`, tickX, zoomY + 42 - tickHeight);
      } else if (i % 5 === 0) {
        tickHeight = 12;
      }
      ctx.fillRect(tickX - 0.75, zoomY + 42 - tickHeight, 1.5, tickHeight);
    }
  }

  ctx.strokeStyle = "#ef4444";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(centerX, zoomY + 22);
  ctx.lineTo(centerX, zoomY + 85);
  ctx.stroke();

  ctx.fillStyle = "#ef4444";
  ctx.font = "9px sans-serif";
  ctx.fillText("POINTER ALAT", centerX, zoomY + 92);

  ctx.restore();

  // Readout
  ctx.fillStyle = isDark ? "#1e293b" : "#fff";
  ctx.strokeStyle = varColor("--brand-blue");
  ctx.lineWidth = 3;
  const readX = 40;
  const readY = canvasEl.height - 70;
  ctx.fillRect(readX, readY, 140, 50);
  ctx.strokeRect(readX, readY, 140, 50);

  ctx.fillStyle = varColor("--brand-blue");
  ctx.font = "bold 13px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(simState.showReadingHelp ? `${posMM.toFixed(0)} mm` : "Mistar Aktif", readX + 70, readY + 32);

  if (Math.abs(posMM - Math.round(simState.measurementTargetVal)) < 0.5) {
    ctx.fillStyle = "#10b981";
    ctx.font = "bold 11px sans-serif";
    ctx.fillText("MISTAR COCOK!", readX + 70, readY + 45);
  }
}

// Draw Jangka Sorong
function drawCaliper(isDark) {
  const originX = 60;
  const originY = 100;
  const scaleZoom = 8; // zoom ratio for main tool drawing
  
  // Set values
  const sliderPosMM = simState.userCaliperPos; // 0 to 40 mm
  const slidePx = sliderPosMM * scaleZoom;

  // Render object based on selected type
  ctx.fillStyle = isDark ? "#475569" : "#64748b";
  ctx.strokeStyle = isDark ? "#cbd5e1" : "#0f172a";
  ctx.lineWidth = 2;

  const targetWidthPx = simState.measurementTargetVal * scaleZoom;
  const errorDiff = Math.abs(sliderPosMM - simState.measurementTargetVal);

  if (sliderPosMM > 0.05) {
    ctx.save();
    ctx.fillStyle = "#fd7e14";
    // Draw measured shape between jaws
    if (simState.measurementSelectedObj === "kelereng") {
      ctx.beginPath();
      ctx.arc(originX + 110 + (targetWidthPx/2), originY + 16, targetWidthPx/2, 0, 2*Math.PI);
      ctx.fill();
      ctx.stroke();
    } else if (simState.measurementSelectedObj === "kawat") {
      ctx.fillRect(originX + 110, originY + 12, targetWidthPx, 8);
      ctx.strokeRect(originX + 110, originY + 12, targetWidthPx, 8);
    } else {
      ctx.fillRect(originX + 110, originY, targetWidthPx, 32);
      ctx.strokeRect(originX + 110, originY, targetWidthPx, 32);
    }
    ctx.restore();
  }

  // Draw main caliper bar (metallic silver gradient)
  const metallicGrad = ctx.createLinearGradient(0, originY - 40, 0, originY + 40);
  metallicGrad.addColorStop(0, "#e2e8f0");
  metallicGrad.addColorStop(0.5, "#94a3b8");
  metallicGrad.addColorStop(1, "#cbd5e1");

  ctx.fillStyle = metallicGrad;
  ctx.fillRect(originX, originY - 30, canvasEl.width - 2*originX, 40);
  
  // Draw Fixed Jaw (Left Jaw)
  ctx.beginPath();
  ctx.moveTo(originX + 110, originY - 30);
  ctx.lineTo(originX + 110, originY + 100);
  ctx.lineTo(originX + 90, originY + 100);
  ctx.lineTo(originX + 80, originY);
  ctx.lineTo(originX, originY - 30);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Draw Main Scale Ticks (Every 1 mm, major tick at 5 and 10 mm)
  ctx.fillStyle = "#1e293b";
  ctx.font = "8px monospace";
  ctx.textAlign = "center";
  
  const totalTicks = Math.floor((canvasEl.width - 2*originX - 110) / scaleZoom);
  for (let i = 0; i <= totalTicks; i++) {
    const tickX = originX + 110 + (i * scaleZoom);
    let tickHeight = 6;
    if (i % 10 === 0) {
      tickHeight = 15;
      ctx.fillText(i/10, tickX, originY - 20);
    } else if (i % 5 === 0) {
      tickHeight = 10;
    }
    ctx.fillRect(tickX - 0.5, originY - tickHeight, 1, tickHeight);
  }

  // Draw Slide Jaw (Right sliding jaw)
  ctx.save();
  ctx.translate(slidePx, 0);

  ctx.fillStyle = metallicGrad;
  // Slide frame
  ctx.beginPath();
  ctx.moveTo(originX + 110, originY - 35);
  ctx.lineTo(originX + 180, originY - 35);
  ctx.lineTo(originX + 180, originY + 45);
  ctx.lineTo(originX + 110, originY + 45);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Slide Jaw prong
  ctx.beginPath();
  ctx.moveTo(originX + 110, originY + 10);
  ctx.lineTo(originX + 110, originY + 100);
  ctx.lineTo(originX + 130, originY + 100);
  ctx.lineTo(originX + 140, originY + 45);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Draw Vernier scale ticks (10 divisions spanning 9mm of main scale)
  ctx.fillStyle = "#0f172a";
  ctx.font = "8px sans-serif";
  ctx.textAlign = "center";
  
  const vernierStep = 0.9 * scaleZoom; // 0.9 mm step
  for (let j = 0; j <= 10; j++) {
    const tickX = originX + 110 + (j * vernierStep);
    ctx.fillRect(tickX - 0.5, originY + 20, 1, 8);
    ctx.fillText(j, tickX, originY + 38);
  }
  ctx.restore();

  // Draw Inset Zoom Magnifier Box
  const zoomW = Math.min(450, canvasEl.width - 60);
  const zoomH = 130;
  const zoomX = (canvasEl.width - zoomW) / 2;
  const zoomY = canvasEl.height - 150;

  // Background box
  ctx.save();
  ctx.fillStyle = isDark ? "#1e293b" : "#f1f5f9";
  ctx.strokeStyle = varColor("--brand-blue");
  ctx.lineWidth = 3;
  ctx.fillRect(zoomX, zoomY, zoomW, zoomH);
  ctx.strokeRect(zoomX, zoomY, zoomW, zoomH);
  
  // Title Label
  ctx.fillStyle = isDark ? "#94a3b8" : "#475569";
  ctx.font = "bold 10px sans-serif";
  ctx.textAlign = "left";
  ctx.fillText("KACA PEMBESAR SKALA NONIUS (ZOOM 4X)", zoomX + 12, zoomY + 18);

  // Draw zoom graphics
  const zoomFactor = 32; 
  const centerX = zoomX + zoomW / 2;
  const dividerY = zoomY + 65;

  // Draw division line
  ctx.strokeStyle = isDark ? "#475569" : "#cbd5e1";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(zoomX + 10, dividerY);
  ctx.lineTo(zoomX + zoomW - 10, dividerY);
  ctx.stroke();

  // Labeled areas
  ctx.fillStyle = isDark ? "#94a3b8" : "#475569";
  ctx.font = "9px sans-serif";
  ctx.fillText("SKALA UTAMA (mm)", zoomX + 12, dividerY - 30);
  ctx.fillText("SKALA NONIUS (0.1 mm)", zoomX + 12, dividerY + 45);

  // Draw zoomed main scale ticks
  ctx.fillStyle = isDark ? "#f8fafc" : "#0f172a";
  ctx.font = "10px monospace";
  ctx.textAlign = "center";

  const minVisibleMM = Math.floor(sliderPosMM - (zoomW / 2) / zoomFactor);
  const maxVisibleMM = Math.ceil(sliderPosMM + (zoomW / 2) / zoomFactor);

  for (let i = Math.max(0, minVisibleMM); i <= maxVisibleMM; i++) {
    const tickX = centerX + (i - sliderPosMM) * zoomFactor;
    if (tickX >= zoomX + 10 && tickX <= zoomX + zoomW - 10) {
      let tickHeight = 10;
      if (i % 10 === 0) {
        tickHeight = 22;
        ctx.fillText(`${i}`, tickX, dividerY - tickHeight - 4);
      } else if (i % 5 === 0) {
        tickHeight = 16;
        ctx.fillText(`${i}`, tickX, dividerY - tickHeight - 4);
      } else {
        tickHeight = 10;
      }
      ctx.fillRect(tickX - 0.75, dividerY - tickHeight, 1.5, tickHeight);
    }
  }

  // Draw zoomed vernier scale ticks (10 divisions, step = 0.9 mm)
  ctx.fillStyle = isDark ? "#f8fafc" : "#0f172a";
  ctx.font = "bold 11px sans-serif";
  ctx.textAlign = "center";

  const vernierStepZoom = 0.9 * zoomFactor;
  for (let j = 0; j <= 10; j++) {
    const tickX = centerX + j * vernierStepZoom;
    if (tickX >= zoomX + 10 && tickX <= zoomX + zoomW - 10) {
      let tickHeight = 12;
      if (j % 5 === 0) tickHeight = 18;
      ctx.fillRect(tickX - 0.75, dividerY, 1.5, tickHeight);
      ctx.fillText(`${j}`, tickX, dividerY + tickHeight + 10);
    }
  }

  // Highlight alignment point
  const alignIndex = Math.round((sliderPosMM % 1) * 10);
  if (alignIndex >= 0 && alignIndex <= 10) {
    const alignX = centerX + alignIndex * vernierStepZoom;
    if (alignX >= zoomX + 10 && alignX <= zoomX + zoomW - 10) {
      ctx.strokeStyle = "#ef4444";
      ctx.lineWidth = 1.5;
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.moveTo(alignX, dividerY - 26);
      ctx.lineTo(alignX, dividerY + 26);
      ctx.stroke();
      ctx.setLineDash([]); 

      ctx.fillStyle = "#ef4444";
      ctx.fillRect(alignX - 1.25, dividerY - 20, 2.5, 40);
      
      ctx.beginPath();
      ctx.arc(alignX, dividerY, 4, 0, 2*Math.PI);
      ctx.fill();

      ctx.font = "9px sans-serif";
      ctx.fillText("GARIS SEJAJAR", alignX, dividerY + 45);
    }
  }

  ctx.restore();

  // Draw Digital readout box
  ctx.fillStyle = isDark ? "#1e293b" : "#fff";
  ctx.strokeStyle = varColor("--brand-blue");
  ctx.lineWidth = 3;
  
  const readX = 40;
  const readY = canvasEl.height - 70;
  ctx.fillRect(readX, readY, 140, 50);
  ctx.strokeRect(readX, readY, 140, 50);

  ctx.fillStyle = varColor("--brand-blue");
  ctx.font = "bold 13px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(simState.showReadingHelp ? `${sliderPosMM.toFixed(1)} mm` : "Jangka Sorong", readX + 70, readY + 32);

  if (errorDiff < 0.08) {
    ctx.fillStyle = "#10b981";
    ctx.font = "bold 11px sans-serif";
    ctx.fillText("PRESISI COCOK!", readX + 70, readY + 45);
  }
}

// Draw Mikrometer Sekrup
function drawMicrometer(isDark) {
  const originX = 100;
  const originY = 100;
  const scaleZoom = 15; 
  const posMM = simState.userCaliperPos; // 0 to 25 mm
  
  ctx.strokeStyle = isDark ? "#475569" : "#94a3b8";
  ctx.lineWidth = 14;
  ctx.beginPath();
  ctx.arc(originX, originY, 60, Math.PI * 0.5, Math.PI * 1.8);
  ctx.stroke();

  ctx.fillStyle = "#cbd5e1";
  ctx.strokeStyle = "#1e293b";
  ctx.lineWidth = 2;
  ctx.fillRect(originX + 20, originY - 10, 15, 20);
  ctx.strokeRect(originX + 20, originY - 10, 15, 20);

  const targetWidthPx = simState.measurementTargetVal * scaleZoom;
  const gapPx = posMM * scaleZoom;
  
  if (posMM > 0.05) {
    ctx.save();
    ctx.fillStyle = "#fd7e14";
    if (simState.measurementSelectedObj === "kelereng") {
      ctx.beginPath();
      ctx.arc(originX + 35 + (targetWidthPx/2), originY, targetWidthPx/2, 0, 2*Math.PI);
      ctx.fill();
      ctx.stroke();
    } else if (simState.measurementSelectedObj === "kawat") {
      ctx.fillRect(originX + 35, originY - 4, targetWidthPx, 8);
      ctx.strokeRect(originX + 35, originY - 4, targetWidthPx, 8);
    } else {
      ctx.fillRect(originX + 35, originY - 15, targetWidthPx, 30);
      ctx.strokeRect(originX + 35, originY - 15, targetWidthPx, 30);
    }
    ctx.restore();
  }

  ctx.fillStyle = "#e2e8f0";
  const spindleStart = originX + 35 + gapPx;
  const spindleLength = 150 - gapPx; 
  ctx.fillRect(spindleStart, originY - 10, Math.max(10, spindleLength), 20);
  ctx.strokeRect(spindleStart, originY - 10, Math.max(10, spindleLength), 20);

  ctx.fillStyle = "#94a3b8";
  ctx.fillRect(originX + 150, originY - 15, 100, 30);
  ctx.strokeRect(originX + 150, originY - 15, 100, 30);

  ctx.fillStyle = "#0f172a";
  ctx.fillRect(originX + 150, originY - 0.5, 100, 1);
  for (let i = 0; i <= 10; i++) {
    const tickX = originX + 150 + (i * 8);
    ctx.fillRect(tickX - 0.5, originY - 6, 1, 6); 
    ctx.fillRect(tickX + 3.5, originY, 1, 6);   
  }

  const thimbleX = originX + 150 + gapPx;
  ctx.fillStyle = "#cbd5e1";
  ctx.fillRect(thimbleX, originY - 18, 40, 36);
  ctx.strokeRect(thimbleX, originY - 18, 40, 36);

  ctx.fillStyle = "#1e293b";
  for (let k = -3; k <= 3; k++) {
    const tickY = originY + (k * 5);
    ctx.fillRect(thimbleX, tickY - 0.5, 12, 1);
  }

  // Draw Inset Zoom Box
  const zoomW = Math.min(450, canvasEl.width - 60);
  const zoomH = 140;
  const zoomX = (canvasEl.width - zoomW) / 2;
  const zoomY = canvasEl.height - 160;

  ctx.save();
  ctx.fillStyle = isDark ? "#1e293b" : "#f1f5f9";
  ctx.strokeStyle = varColor("--brand-orange");
  ctx.lineWidth = 3;
  ctx.fillRect(zoomX, zoomY, zoomW, zoomH);
  ctx.strokeRect(zoomX, zoomY, zoomW, zoomH);

  ctx.fillStyle = isDark ? "#94a3b8" : "#475569";
  ctx.font = "bold 10px sans-serif";
  ctx.textAlign = "left";
  ctx.fillText("KACA PEMBESAR SKALA PUTAR (ZOOM 3X)", zoomX + 12, zoomY + 18);

  const zoomFactor = 24; 
  const verticalZoomFactor = 3.5; 
  const centerX = zoomX + zoomW * 0.55; 
  const centerY = zoomY + zoomH / 2; 

  ctx.fillStyle = isDark ? "#cbd5e1" : "#94a3b8";
  ctx.fillRect(zoomX + 10, centerY - 25, centerX - (zoomX + 10), 50);
  ctx.strokeStyle = isDark ? "#cbd5e1" : "#1e293b";
  ctx.lineWidth = 1.5;
  ctx.strokeRect(zoomX + 10, centerY - 25, centerX - (zoomX + 10), 50);

  ctx.strokeStyle = "#ef4444"; 
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(zoomX + 15, centerY);
  ctx.lineTo(centerX, centerY);
  ctx.stroke();

  ctx.fillStyle = isDark ? "#f8fafc" : "#0f172a";
  ctx.strokeStyle = isDark ? "#f8fafc" : "#0f172a";
  ctx.lineWidth = 1.5;
  ctx.font = "9px monospace";
  ctx.textAlign = "center";

  const minVisibleSleeve = Math.max(0, Math.floor(posMM - (centerX - zoomX - 20) / zoomFactor));
  for (let i = minVisibleSleeve; i <= posMM; i++) {
    const tickX = centerX - (posMM - i) * zoomFactor;
    if (tickX >= zoomX + 15 && tickX <= centerX) {
      ctx.beginPath();
      ctx.moveTo(tickX, centerY);
      ctx.lineTo(tickX, centerY - 15);
      ctx.stroke();
      
      ctx.fillText(`${i}`, tickX, centerY - 18);
    }

    const halfI = i + 0.5;
    if (halfI <= posMM) {
      const halfTickX = centerX - (posMM - halfI) * zoomFactor;
      if (halfTickX >= zoomX + 15 && halfTickX <= centerX) {
        ctx.beginPath();
        ctx.moveTo(halfTickX, centerY);
        ctx.lineTo(halfTickX, centerY + 12);
        ctx.stroke();
      }
    }
  }

  const thimbleW = zoomX + zoomW - 10 - centerX;
  const thimbleGrad = ctx.createLinearGradient(centerX, 0, zoomX + zoomW - 10, 0);
  thimbleGrad.addColorStop(0, "#cbd5e1");
  thimbleGrad.addColorStop(0.3, "#e2e8f0");
  thimbleGrad.addColorStop(1, "#94a3b8");
  ctx.fillStyle = thimbleGrad;
  ctx.fillRect(centerX, centerY - 35, thimbleW, 70);
  
  ctx.strokeStyle = isDark ? "#cbd5e1" : "#1e293b";
  ctx.lineWidth = 2;
  ctx.strokeRect(centerX, centerY - 35, thimbleW, 70);

  const thimbleValue = (posMM * 100) % 50; 
  const centerDiv = Math.round(thimbleValue);

  ctx.fillStyle = "#0f172a";
  ctx.strokeStyle = "#0f172a";
  ctx.lineWidth = 1.2;
  ctx.font = "bold 10px monospace";
  ctx.textAlign = "left";

  for (let d = -12; d <= 12; d++) {
    const k = (centerDiv + d + 50) % 50;
    const diff = k - thimbleValue;
    
    let adjustedDiff = diff;
    if (adjustedDiff > 25) adjustedDiff -= 50;
    if (adjustedDiff < -25) adjustedDiff += 50;

    const tickY = centerY - adjustedDiff * verticalZoomFactor;

    if (tickY >= centerY - 32 && tickY <= centerY + 32) {
      const isMajor = k % 5 === 0;
      const tickLength = isMajor ? 16 : 8;
      
      const isAlign = Math.abs(adjustedDiff) < 0.15;
      if (isAlign) {
        ctx.strokeStyle = "#ef4444";
        ctx.lineWidth = 2;
      } else {
        ctx.strokeStyle = "#0f172a";
        ctx.lineWidth = 1.2;
      }

      ctx.beginPath();
      ctx.moveTo(centerX, tickY);
      ctx.lineTo(centerX + tickLength, tickY);
      ctx.stroke();

      if (isMajor) {
        ctx.fillStyle = isAlign ? "#ef4444" : "#0f172a";
        ctx.fillText(`${k.toString().padStart(2, '0')}`, centerX + 20, tickY + 3);
      }
    }
  }

  ctx.fillStyle = isDark ? "#94a3b8" : "#475569";
  ctx.font = "9px sans-serif";
  ctx.fillText("SKALA UTAMA", zoomX + 15, centerY + 38);
  ctx.fillText("SKALA PUTAR", centerX + 30, centerY + 45);

  ctx.restore();

  // Readout panel
  ctx.fillStyle = isDark ? "#1e293b" : "#fff";
  ctx.strokeStyle = varColor("--brand-orange");
  ctx.lineWidth = 3;
  
  const readX = canvasEl.width - 180;
  const readY = canvasEl.height - 70;
  ctx.fillRect(readX, readY, 140, 50);
  ctx.strokeRect(readX, readY, 140, 50);

  ctx.fillStyle = varColor("--brand-orange");
  ctx.font = "bold 13px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(simState.showReadingHelp ? `${posMM.toFixed(2)} mm` : "Mikrometer Sekrup", readX + 70, readY + 32);

  const errorDiff = Math.abs(posMM - simState.measurementTargetVal);
  if (errorDiff < 0.015) {
    ctx.fillStyle = "#10b981";
    ctx.font = "bold 11px sans-serif";
    ctx.fillText("PRESISI COCOK!", readX + 70, readY + 45);
  }
}

// Draw Massa Measurement
function drawMassaMeasurement(isDark) {
  const tool = simState.measurementTool;
  
  if (tool === "neraca_ohaus") {
    const target = simState.measurementTargetVal; 
    const currentWeight = simState.userOhaus100 + simState.userOhaus10 + simState.userOhaus1;
    const diff = currentWeight - target;

    ctx.fillStyle = isDark ? "#94a3b8" : "#475569";
    ctx.font = "bold 12px sans-serif";
    ctx.textAlign = "left";
    ctx.fillText("NERACA OHAUS TIGA LENGAN (g)", 30, 30);

    ctx.fillStyle = "#64748b";
    ctx.fillRect(60, canvasEl.height - 120, 20, 70); 
    ctx.fillRect(40, canvasEl.height - 60, canvasEl.width - 80, 15); 

    ctx.strokeStyle = "#334155";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(80, canvasEl.height - 120);
    ctx.lineTo(60, canvasEl.height - 85);
    ctx.lineTo(100, canvasEl.height - 85);
    ctx.closePath();
    ctx.stroke();

    ctx.fillStyle = "#cbd5e1";
    ctx.fillRect(50, canvasEl.height - 85, 60, 6); 
    ctx.strokeRect(50, canvasEl.height - 85, 60, 6);

    ctx.save();
    ctx.fillStyle = "#fd7e14";
    if (simState.measurementSelectedObj === "kelereng") {
      ctx.beginPath();
      ctx.arc(80, canvasEl.height - 100, 10, 0, 2*Math.PI);
      ctx.fill();
      ctx.stroke();
    } else if (simState.measurementSelectedObj === "silinder") {
      ctx.fillRect(70, canvasEl.height - 105, 20, 20);
      ctx.strokeRect(70, canvasEl.height - 105, 20, 20);
    } else {
      ctx.fillRect(65, canvasEl.height - 110, 30, 25);
      ctx.strokeRect(65, canvasEl.height - 110, 30, 25);
    }
    ctx.restore();

    const beamY = canvasEl.height - 120;
    const beamLength = canvasEl.width - 240;
    
    ctx.strokeStyle = "#475569";
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(80, beamY);
    ctx.lineTo(80 + beamLength, beamY);
    ctx.stroke();

    ctx.strokeStyle = "#cbd5e1";
    ctx.lineWidth = 2;
    for (let r = 0; r < 3; r++) {
      ctx.beginPath();
      ctx.moveTo(100, beamY + 12 + r * 10);
      ctx.lineTo(80 + beamLength - 20, beamY + 12 + r * 10);
      ctx.stroke();
    }

    const rider100X = 100 + (simState.userOhaus100 / 500) * (beamLength - 120);
    ctx.fillStyle = "#0d6efd";
    ctx.fillRect(rider100X - 4, beamY + 9, 8, 8);
    
    const rider10X = 100 + (simState.userOhaus10 / 100) * (beamLength - 120);
    ctx.fillStyle = "#fd7e14";
    ctx.fillRect(rider10X - 4, beamY + 19, 8, 8);

    const rider1X = 100 + (simState.userOhaus1 / 10) * (beamLength - 120);
    ctx.fillStyle = "#10b981";
    ctx.fillRect(rider1X - 4, beamY + 29, 8, 8);

    const pointerEndX = 80 + beamLength;
    const tilt = Math.max(-20, Math.min(20, diff * 1.5));
    const pointerY = beamY + tilt;

    ctx.strokeStyle = "#ef4444";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(pointerEndX - 30, beamY);
    ctx.lineTo(pointerEndX, pointerY);
    ctx.stroke();

    ctx.fillStyle = "#cbd5e1";
    ctx.strokeStyle = "#475569";
    ctx.lineWidth = 2;
    ctx.fillRect(pointerEndX, beamY - 25, 20, 50);
    ctx.strokeRect(pointerEndX, beamY - 25, 20, 50);
    
    ctx.strokeStyle = "#10b981";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(pointerEndX, beamY);
    ctx.lineTo(pointerEndX + 15, beamY);
    ctx.stroke();

    ctx.fillStyle = isDark ? "#fff" : "#0f172a";
    ctx.font = "bold 13px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("Baca skala lengan dan jumlahkan nilainya jika seimbang", canvasEl.width / 2, canvasEl.height - 95);

    if (Math.abs(diff) < 0.05) {
      ctx.fillStyle = "#10b981";
      ctx.font = "bold 14px sans-serif";
      ctx.fillText("NERACA SEIMBANG: COCOK!", canvasEl.width / 2, canvasEl.height - 75);
    } else {
      ctx.fillStyle = "#ef4444";
      ctx.font = "bold 11px sans-serif";
      ctx.fillText(diff > 0 ? "LENGAN TERLALU BERAT" : "LENGAN TERLALU RINGAN", canvasEl.width / 2, canvasEl.height - 75);
    }
  } else {
    ctx.fillStyle = isDark ? "#94a3b8" : "#475569";
    ctx.font = "bold 12px sans-serif";
    ctx.textAlign = "left";
    ctx.fillText("TIMBANGAN DIGITAL ELEKTRONIK (g)", 30, 30);

    const centerX = canvasEl.width / 2;
    const centerY = canvasEl.height / 2 + 10;

    ctx.fillStyle = "#94a3b8";
    ctx.strokeStyle = isDark ? "#cbd5e1" : "#1e293b";
    ctx.lineWidth = 3;
    ctx.fillRect(centerX - 90, centerY, 180, 45);
    ctx.strokeRect(centerX - 90, centerY, 180, 45);

    ctx.fillStyle = "#cbd5e1";
    ctx.fillRect(centerX - 80, centerY - 10, 160, 10);
    ctx.strokeRect(centerX - 80, centerY - 10, 160, 10);

    const isPlaced = simState.userOhaus1 > 0;
    if (isPlaced) {
      ctx.save();
      ctx.fillStyle = "#fd7e14";
      if (simState.measurementSelectedObj === "kelereng") {
        ctx.beginPath();
        ctx.arc(centerX, centerY - 22, 12, 0, 2*Math.PI);
        ctx.fill();
        ctx.stroke();
      } else if (simState.measurementSelectedObj === "silinder") {
        ctx.fillRect(centerX - 15, centerY - 35, 30, 25);
        ctx.strokeRect(centerX - 15, centerY - 35, 30, 25);
      } else {
        ctx.fillRect(centerX - 20, centerY - 40, 40, 30);
        ctx.strokeRect(centerX - 20, centerY - 40, 40, 30);
      }
      ctx.restore();
    }

    ctx.fillStyle = "#0f172a";
    ctx.fillRect(centerX - 60, centerY + 8, 120, 28);
    
    ctx.fillStyle = "#38bdf8"; 
    ctx.font = "bold 16px monospace";
    ctx.textAlign = "center";
    const massValue = isPlaced ? simState.measurementTargetVal.toFixed(2) : "0.00";
    ctx.fillText(`${massValue} g`, centerX, centerY + 28);
  }
}

// Draw Waktu Measurement
function drawWaktuMeasurement(isDark) {
  ctx.fillStyle = isDark ? "#94a3b8" : "#475569";
  ctx.font = "bold 12px sans-serif";
  ctx.textAlign = "left";
  ctx.fillText("GERAK JATUH BEBAS & STOPWATCH", 30, 30);

  const startY = 60;
  const towerH = 120;
  const ballRadius = 8;

  ctx.strokeStyle = isDark ? "#cbd5e1" : "#1e293b";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(100, startY);
  ctx.lineTo(100, startY + towerH);
  ctx.stroke();

  ctx.fillStyle = isDark ? "#fff" : "#0f172a";
  ctx.font = "8px sans-serif";
  ctx.textAlign = "right";
  for (let h = 0; h <= 20; h += 5) {
    const tickY = startY + (h / 20) * towerH;
    ctx.fillRect(94, tickY - 0.5, 6, 1);
    ctx.fillText(`${(2.0 - h/10).toFixed(1)} m`, 90, tickY + 3);
  }

  ctx.fillStyle = "#475569";
  ctx.fillRect(80, startY + towerH, 40, 8);
  ctx.strokeRect(80, startY + towerH, 40, 8);

  ctx.fillStyle = "#fd7e14";
  ctx.strokeStyle = "#1e293b";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(100, startY + simState.ballY, ballRadius, 0, 2*Math.PI);
  ctx.fill();
  ctx.stroke();

  const clockX = canvasEl.width - 150;
  const clockY = canvasEl.height / 2 - 25;
  const clockR = 30;

  ctx.fillStyle = "#cbd5e1";
  ctx.strokeStyle = "#475569";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(clockX, clockY, clockR, 0, 2*Math.PI);
  ctx.fill();
  ctx.stroke();

  ctx.strokeStyle = "#000";
  ctx.lineWidth = 1.0;
  for (let angle = 0; angle < 360; angle += 30) {
    const rad = angle * Math.PI / 180;
    const innerR = clockR - (angle % 90 === 0 ? 6 : 3);
    ctx.beginPath();
    ctx.moveTo(clockX + innerR * Math.cos(rad), clockY + innerR * Math.sin(rad));
    ctx.lineTo(clockX + (clockR - 2) * Math.cos(rad), clockY + (clockR - 2) * Math.sin(rad));
    ctx.stroke();
  }

  const handAngle = (simState.stopwatchTime / 2) * 2 * Math.PI - Math.PI / 2;
  ctx.strokeStyle = "#ef4444";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(clockX, clockY);
  ctx.lineTo(clockX + (clockR - 6) * Math.cos(handAngle), clockY + (clockR - 6) * Math.sin(handAngle));
  ctx.stroke();

  ctx.fillStyle = "#1e293b";
  ctx.beginPath();
  ctx.arc(clockX, clockY, 3, 0, 2*Math.PI);
  ctx.fill();

  ctx.fillStyle = isDark ? "#fff" : "#0f172a";
  ctx.font = "bold 10px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("Stopwatch Analog", clockX, clockY - 38);

  // ----------------------------------------------------
  // STOPWATCH DETAILED ZOOM WINDOW AT THE BOTTOM
  // ----------------------------------------------------
  const zoomX = 40;
  const zoomY = canvasEl.height - 110;
  const zoomW = canvasEl.width - 80;
  const zoomH = 95;

  ctx.save();
  ctx.fillStyle = isDark ? "#1e293b" : "#f8fafc";
  ctx.strokeStyle = varColor("--brand-blue");
  ctx.lineWidth = 3;
  ctx.fillRect(zoomX, zoomY, zoomW, zoomH);
  ctx.strokeRect(zoomX, zoomY, zoomW, zoomH);

  ctx.fillStyle = isDark ? "#94a3b8" : "#475569";
  ctx.font = "bold 10px sans-serif";
  ctx.textAlign = "left";
  ctx.fillText("KACA PEMBESAR SKALA STOPWATCH (0 - 3 SEKON)", zoomX + 12, zoomY + 16);

  const zCenterX = zoomX + zoomW / 2;
  const zCenterY = zoomY + zoomH / 2 + 10;
  const zR = 32;

  ctx.fillStyle = "#f1f5f9";
  ctx.strokeStyle = "#334155";
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.arc(zCenterX, zCenterY, zR, 0, 2 * Math.PI);
  ctx.fill();
  ctx.stroke();

  ctx.strokeStyle = "#0f172a";
  ctx.textAlign = "center";
  ctx.font = "bold 7px monospace";
  
  for (let tick = 0; tick < 30; tick++) {
    const angle = (tick / 30) * 2 * Math.PI - Math.PI / 2;
    const isMajor = tick % 5 === 0;
    const tLen = isMajor ? 6 : 3;
    ctx.lineWidth = isMajor ? 1.2 : 0.6;
    
    ctx.beginPath();
    ctx.moveTo(zCenterX + (zR - tLen) * Math.cos(angle), zCenterY + (zR - tLen) * Math.sin(angle));
    ctx.lineTo(zCenterX + zR * Math.cos(angle), zCenterY + zR * Math.sin(angle));
    ctx.stroke();

    if (isMajor) {
      const labelVal = (tick / 10).toFixed(1);
      const lx = zCenterX + (zR - 12) * Math.cos(angle);
      const ly = zCenterY + (zR - 12) * Math.sin(angle);
      ctx.fillStyle = "#0f172a";
      ctx.fillText(labelVal, lx, ly + 2.5);
    }
  }

  const needleAngle = (simState.stopwatchTime / 3) * 2 * Math.PI - Math.PI / 2;
  ctx.strokeStyle = "#ef4444";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(zCenterX, zCenterY);
  ctx.lineTo(zCenterX + (zR - 4) * Math.cos(needleAngle), zCenterY + (zR - 4) * Math.sin(needleAngle));
  ctx.stroke();

  ctx.fillStyle = "#ef4444";
  ctx.beginPath();
  ctx.arc(zCenterX, zCenterY, 3, 0, 2*Math.PI);
  ctx.fill();

  ctx.restore();
}

// Draw Listrik Measurement
function drawListrikMeasurement(isDark) {
  ctx.fillStyle = isDark ? "#94a3b8" : "#475569";
  ctx.font = "bold 12px sans-serif";
  ctx.textAlign = "left";
  ctx.fillText("RANGKAIAN LISTRIK DC & MULTIMETER", 30, 30);

  const startX = 60;
  const startY = 60;
  const sizeW = 160;
  const sizeH = 90;

  // Draw Battery
  ctx.fillStyle = "#1e293b";
  ctx.fillRect(startX, startY + 15, 20, 60); 
  ctx.fillStyle = "#ef4444";
  ctx.fillRect(startX, startY + 15, 20, 15);  
  
  ctx.fillStyle = "#fff";
  ctx.font = "9px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("+", startX + 10, startY + 27);
  ctx.fillText("-", startX + 10, startY + 70);
  ctx.fillStyle = isDark ? "#fff" : "#0f172a";
  ctx.fillText(`${simState.circVoltage.toFixed(1)} V`, startX + 10, startY + 87);

  // Draw Resistor
  const resX = startX + sizeW / 2;
  const resY = startY + sizeH;
  ctx.fillStyle = "#cbd5e1";
  ctx.fillRect(resX - 25, resY - 8, 50, 16);
  ctx.strokeStyle = "#475569";
  ctx.lineWidth = 1.5;
  ctx.strokeRect(resX - 25, resY - 8, 50, 16);
  
  ctx.fillStyle = "#78350f"; 
  ctx.fillRect(resX - 18, resY - 8, 4, 16);
  ctx.fillStyle = "#10b981"; 
  ctx.fillRect(resX - 8, resY - 8, 4, 16);
  ctx.fillStyle = "#78350f"; 
  ctx.fillRect(resX + 2, resY - 8, 4, 16);
  ctx.fillStyle = "#fbbf24"; 
  ctx.fillRect(resX + 12, resY - 8, 4, 16);

  ctx.fillStyle = isDark ? "#fff" : "#0f172a";
  ctx.font = "9px sans-serif";
  ctx.fillText(`${simState.circResistance} \u03a9`, resX, resY + 20);

  // Wires
  ctx.strokeStyle = "#0f172a";
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(startX + 10, startY + 15);
  ctx.lineTo(startX + 10, startY);
  ctx.lineTo(startX + sizeW, startY);
  ctx.lineTo(startX + sizeW, startY + sizeH);
  ctx.lineTo(resX + 25, resY);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(startX + 10, startY + 75);
  ctx.lineTo(startX + 10, startY + sizeH);
  ctx.lineTo(resX - 25, resY);
  ctx.stroke();

  // Draw Yellow Multimeter Case
  const meterX = canvasEl.width - 160;
  const meterY = startY - 10;
  const meterW = 110;
  const meterH = 135;

  ctx.save();
  ctx.fillStyle = "#eab308"; 
  ctx.strokeStyle = "#ca8a04";
  ctx.lineWidth = 3;
  ctx.fillRect(meterX, meterY, meterW, meterH);
  ctx.strokeRect(meterX, meterY, meterW, meterH);

  // Meter LCD Window (black/white background)
  ctx.fillStyle = isDark ? "#0f172a" : "#fff";
  ctx.strokeStyle = "#475569";
  ctx.lineWidth = 1.5;
  ctx.fillRect(meterX + 10, meterY + 10, meterW - 20, 45);
  ctx.strokeRect(meterX + 10, meterY + 10, meterW - 20, 45);

  // Draw tiny scale inside multimeter window
  const isVolt = simState.measurementSelectedObj === "voltmeter";
  const trueVal = isVolt ? simState.circVoltage : (simState.circVoltage / simState.circResistance) * 1000;
  const frac = isVolt ? trueVal / 30 : trueVal / 100;
  
  const miniCenterX = meterX + meterW / 2;
  const miniCenterY = meterY + 50;
  const miniR = 30;
  const startA = -Math.PI * 0.8;
  const endA = -Math.PI * 0.2;
  const needleA = startA + frac * (endA - startA);

  ctx.strokeStyle = isDark ? "#94a3b8" : "#475569";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(miniCenterX, miniCenterY, miniR, startA, endA);
  ctx.stroke();

  // draw small needle
  ctx.strokeStyle = "#ef4444";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(miniCenterX, miniCenterY);
  ctx.lineTo(miniCenterX + miniR * Math.cos(needleA), miniCenterY + miniR * Math.sin(needleA));
  ctx.stroke();

  // Dial selector knob
  ctx.fillStyle = "#1e293b";
  ctx.beginPath();
  ctx.arc(meterX + meterW/2, meterY + 80, 16, 0, 2*Math.PI);
  ctx.fill();
  ctx.strokeStyle = "#94a3b8";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(meterX + meterW/2, meterY + 80);
  const knobAngle = isVolt ? -Math.PI/3 : Math.PI/3;
  ctx.lineTo(meterX + meterW/2 + 13 * Math.cos(knobAngle), meterY + 80 + 13 * Math.sin(knobAngle));
  ctx.stroke();

  // Wire connections (Red and Black probes)
  ctx.strokeStyle = "#ef4444"; 
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(meterX + 30, meterY + 115);
  ctx.bezierCurveTo(meterX - 10, meterY + 130, startX + sizeW - 20, startY + 30, startX + sizeW, startY + 30);
  ctx.stroke();

  ctx.strokeStyle = "#1e293b"; 
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(meterX + meterW - 30, meterY + 115);
  ctx.bezierCurveTo(meterX + meterW + 20, meterY + 140, resX + 10, resY + 20, resX, resY);
  ctx.stroke();

  ctx.fillStyle = "#0f172a";
  ctx.font = "bold 8px sans-serif";
  ctx.fillText("Volts", meterX + 25, meterY + 80);
  ctx.fillText("Amps", meterX + meterW - 25, meterY + 80);
  ctx.restore();

  // ----------------------------------------------------
  // ANALOG MULTIMETER ZOOM WINDOW AT THE BOTTOM
  // ----------------------------------------------------
  const zoomX = 40;
  const zoomY = canvasEl.height - 110;
  const zoomW = canvasEl.width - 80;
  const zoomH = 95;

  ctx.save();
  ctx.fillStyle = isDark ? "#1e293b" : "#f8fafc";
  ctx.strokeStyle = varColor("--brand-blue");
  ctx.lineWidth = 3;
  ctx.fillRect(zoomX, zoomY, zoomW, zoomH);
  ctx.strokeRect(zoomX, zoomY, zoomW, zoomH);

  ctx.fillStyle = isDark ? "#94a3b8" : "#475569";
  ctx.font = "bold 10px sans-serif";
  ctx.textAlign = "left";
  ctx.fillText(`KACA PEMBESAR SKALA ANALOG MULTIMETER (${isVolt ? 'VOLTMETER' : 'AMPERMETER'})`, zoomX + 12, zoomY + 16);

  const zCenterX = zoomX + zoomW / 2;
  const zCenterY = zoomY + zoomH + 85;
  const zStartA = -Math.PI * 0.75;
  const zEndA = -Math.PI * 0.25;
  const zNeedleA = zStartA + frac * (zEndA - zStartA);

  // Draw two scales (Voltage and Current arcs)
  const rVolt = 135;
  const rCurrent = 155;

  ctx.strokeStyle = isDark ? "#94a3b8" : "#475569";
  ctx.lineWidth = 1.5;
  
  // Draw arcs
  ctx.beginPath();
  ctx.arc(zCenterX, zCenterY, rVolt, zStartA, zEndA);
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(zCenterX, zCenterY, rCurrent, zStartA, zEndA);
  ctx.stroke();

  // Ticks and numbers
  ctx.textAlign = "center";
  ctx.font = "8px sans-serif";

  // Voltmeter Scale (0 to 30 V)
  for (let v = 0; v <= 30; v += 5) {
    const angle = zStartA + (v / 30) * (zEndA - zStartA);
    const outerX = zCenterX + rVolt * Math.cos(angle);
    const outerY = zCenterY + rVolt * Math.sin(angle);
    const innerX = zCenterX + (rVolt - 6) * Math.cos(angle);
    const innerY = zCenterY + (rVolt - 6) * Math.sin(angle);

    ctx.beginPath();
    ctx.moveTo(outerX, outerY);
    ctx.lineTo(innerX, innerY);
    ctx.stroke();

    // label
    const labelX = zCenterX + (rVolt - 14) * Math.cos(angle);
    const labelY = zCenterY + (rVolt - 14) * Math.sin(angle);
    ctx.fillStyle = isDark ? "#cbd5e1" : "#0f172a";
    ctx.fillText(`${v}V`, labelX, labelY + 3);

    // Minor ticks
    if (v < 30) {
      for (let j = 1; j < 5; j++) {
        const subAngle = zStartA + ((v + j) / 30) * (zEndA - zStartA);
        const subH = 3;
        ctx.beginPath();
        ctx.moveTo(zCenterX + rVolt * Math.cos(subAngle), zCenterY + rVolt * Math.sin(subAngle));
        ctx.lineTo(zCenterX + (rVolt - subH) * Math.cos(subAngle), zCenterY + (rVolt - subH) * Math.sin(subAngle));
        ctx.stroke();
      }
    }
  }

  // Ampermeter Scale (0 to 100 mA)
  for (let a = 0; a <= 100; a += 10) {
    const angle = zStartA + (a / 100) * (zEndA - zStartA);
    const outerX = zCenterX + (rCurrent + 6) * Math.cos(angle);
    const outerY = zCenterY + (rCurrent + 6) * Math.sin(angle);
    const innerX = zCenterX + rCurrent * Math.cos(angle);
    const innerY = zCenterY + rCurrent * Math.sin(angle);

    ctx.beginPath();
    ctx.moveTo(outerX, outerY);
    ctx.lineTo(innerX, innerY);
    ctx.stroke();

    // label
    const labelX = zCenterX + (rCurrent + 14) * Math.cos(angle);
    const labelY = zCenterY + (rCurrent + 14) * Math.sin(angle);
    ctx.fillStyle = varColor("--brand-orange");
    ctx.fillText(`${a}mA`, labelX, labelY + 3);

    // Minor ticks
    if (a < 100) {
      for (let j = 1; j < 10; j++) {
        const subAngle = zStartA + ((a + j) / 100) * (zEndA - zStartA);
        const subH = j === 5 ? 5 : 3;
        ctx.beginPath();
        ctx.moveTo(zCenterX + rCurrent * Math.cos(subAngle), zCenterY + rCurrent * Math.sin(subAngle));
        ctx.lineTo(zCenterX + (rCurrent + subH) * Math.cos(subAngle), zCenterY + (rCurrent + subH) * Math.sin(subAngle));
        ctx.stroke();
      }
    }
  }

  // Draw Mirror arc (indicator)
  ctx.strokeStyle = "#94a3b8";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(zCenterX, zCenterY, (rVolt + rCurrent)/2, zStartA, zEndA);
  ctx.stroke();

  // Draw red Needle
  ctx.strokeStyle = "#ef4444";
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(zCenterX, zCenterY);
  const needleLen = rCurrent + 10;
  ctx.lineTo(zCenterX + needleLen * Math.cos(zNeedleA), zCenterY + needleLen * Math.sin(zNeedleA));
  ctx.stroke();

  // Center pivot
  ctx.fillStyle = "#ef4444";
  ctx.beginPath();
  ctx.arc(zCenterX, zCenterY, 6, 0, 2*Math.PI);
  ctx.fill();

  ctx.restore();
}

// Draw Gerak Lurus & Hukum Newton Block on Runway
function drawBlockMotion(isDark) {
  const runwayY = canvasEl.height - 80;
  
  // Draw ground runway
  ctx.fillStyle = isDark ? "#334155" : "#94a3b8";
  ctx.fillRect(0, runwayY, canvasEl.width, 10);
  
  // Draw runway markings (stripes)
  ctx.fillStyle = isDark ? "#1e293b" : "#e2e8f0";
  for (let i = 0; i < canvasEl.width; i += 40) {
    ctx.fillRect(i, runwayY + 10, 20, 5);
  }

  // Draw sliding block
  const blockW = 80;
  const blockH = 50;
  const blockX = simState.blockX;
  const blockY = runwayY - blockH;

  ctx.fillStyle = varColor("--brand-blue");
  ctx.fillRect(blockX, blockY, blockW, blockH);
  ctx.strokeRect(blockX, blockY, blockW, blockH);

  // Wheels of the block
  ctx.fillStyle = "#0f172a";
  ctx.beginPath();
  ctx.arc(blockX + 20, runwayY, 8, 0, 2*Math.PI);
  ctx.arc(blockX + blockW - 20, runwayY, 8, 0, 2*Math.PI);
  ctx.fill();

  // Label text on box
  ctx.fillStyle = "#fff";
  ctx.font = "bold 12px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(`${simState.blockMass} kg`, blockX + (blockW/2), blockY + 30);

  // Draw Force vectors arrows
  const arrowY = blockY + (blockH/2);
  
  // Push force arrow (green/blue)
  if (simState.pushForce > 0) {
    const arrowLen = Math.min(100, simState.pushForce * 2);
    ctx.strokeStyle = "#10b981";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(blockX + blockW, arrowY);
    ctx.lineTo(blockX + blockW + arrowLen, arrowY);
    ctx.stroke();
    // Arrow tip
    ctx.fillStyle = "#10b981";
    ctx.beginPath();
    ctx.moveTo(blockX + blockW + arrowLen, arrowY - 6);
    ctx.lineTo(blockX + blockW + arrowLen + 10, arrowY);
    ctx.lineTo(blockX + blockW + arrowLen, arrowY + 6);
    ctx.fill();
    
    ctx.fillStyle = isDark ? "#fff" : "#000";
    ctx.font = "9px sans-serif";
    ctx.fillText(`F = ${simState.pushForce} N`, blockX + blockW + (arrowLen/2), arrowY - 10);
  }

  // Friction force arrow (red, opposite to direction)
  const g = 9.8;
  const fKinetik = simState.frictionCoeff * simState.blockMass * g;
  if (fKinetik > 0 && simState.blockVx > 0.05) {
    const arrowLen = Math.min(80, fKinetik * 2);
    ctx.strokeStyle = "#ef4444";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(blockX, arrowY);
    ctx.lineTo(blockX - arrowLen, arrowY);
    ctx.stroke();
    // tip
    ctx.fillStyle = "#ef4444";
    ctx.beginPath();
    ctx.moveTo(blockX - arrowLen, arrowY - 5);
    ctx.lineTo(blockX - arrowLen - 8, arrowY);
    ctx.lineTo(blockX - arrowLen, arrowY + 5);
    ctx.fill();

    ctx.fillStyle = isDark ? "#fff" : "#000";
    ctx.font = "9px sans-serif";
    ctx.fillText(`f_g = ${fKinetik.toFixed(1)} N`, blockX - (arrowLen/2), arrowY - 10);
  }

  // Digital variables overlay table
  ctx.fillStyle = "rgba(15,23,42,0.85)";
  ctx.fillRect(20, 20, 220, 80);
  ctx.strokeStyle = "rgba(255,255,255,0.1)";
  ctx.strokeRect(20, 20, 220, 80);

  ctx.fillStyle = "#fff";
  ctx.font = "11px monospace";
  ctx.textAlign = "left";
  ctx.fillText(`Waktu  : ${simTime.toFixed(2)} s`, 35, 40);
  ctx.fillText(`Posisi : ${((blockX - 80) / 10).toFixed(2)} m`, 35, 58);
  ctx.fillText(`Kecep  : ${simState.blockVx.toFixed(2)} m/s`, 35, 76);
  ctx.fillText(`Percep : ${simState.blockAx.toFixed(2)} m/s\u00b2`, 35, 94);
}

// Draw Ohm's Law circuit
function drawCircuit(isDark) {
  // Wire rectangle loops coordinates
  const left = 100;
  const right = canvasEl.width - 100;
  const top = 60;
  const bottom = canvasEl.height - 80;

  // Draw wire loops (gray lines)
  ctx.strokeStyle = isDark ? "#475569" : "#94a3b8";
  ctx.lineWidth = 6;
  ctx.strokeRect(left, top, right - left, bottom - top);

  // Draw Cell Battery on left branch
  const batY = top + (bottom - top)/2;
  ctx.fillStyle = isDark ? "#1e293b" : "#e2e8f0";
  ctx.fillRect(left - 20, batY - 20, 40, 40);
  ctx.strokeRect(left - 20, batY - 20, 40, 40);
  
  // Terminal bars of battery
  ctx.strokeStyle = "#ef4444"; // positive top
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(left - 15, batY - 10);
  ctx.lineTo(left + 15, batY - 10);
  ctx.stroke();

  ctx.strokeStyle = "#3b82f6"; // negative bottom
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(left - 8, batY + 10);
  ctx.lineTo(left + 8, batY + 10);
  ctx.stroke();

  ctx.fillStyle = isDark ? "#fff" : "#000";
  ctx.font = "bold 11px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(`+`, left, batY - 16);
  ctx.fillText(`-`, left, batY + 22);
  ctx.fillText(`${simState.circVoltage} V`, left - 35, batY + 5);

  // Draw Resistor symbol (zigzag) on top branch
  const resX = left + (right - left)/2;
  ctx.fillStyle = isDark ? "#0f172a" : "#cbd5e1";
  ctx.fillRect(resX - 30, top - 15, 60, 30);
  
  ctx.strokeStyle = varColor("--brand-orange");
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(resX - 30, top);
  ctx.lineTo(resX - 20, top - 10);
  ctx.lineTo(resX - 10, top + 10);
  ctx.lineTo(resX, top - 10);
  ctx.lineTo(resX + 10, top + 10);
  ctx.lineTo(resX + 20, top - 10);
  ctx.lineTo(resX + 30, top);
  ctx.stroke();

  ctx.fillStyle = isDark ? "#fff" : "#000";
  ctx.font = "bold 11px sans-serif";
  ctx.fillText(`${simState.circResistance} \u03a9`, resX, top - 20);

  // Draw glowing Lightbulb on right branch
  const bulbY = batY;
  ctx.fillStyle = isDark ? "#1e293b" : "#e2e8f0";
  ctx.beginPath();
  ctx.arc(right, bulbY, 20, 0, 2*Math.PI);
  ctx.fill();
  ctx.stroke();

  // Glow halo based on current value
  const current = simState.circVoltage / simState.circResistance;
  if (current > 0.01) {
    const alpha = Math.min(0.8, current * 8);
    const radGrad = ctx.createRadialGradient(right, bulbY, 15, right, bulbY, 45);
    radGrad.addColorStop(0, `rgba(253, 126, 20, ${alpha})`);
    radGrad.addColorStop(1, "rgba(253, 126, 20, 0)");
    ctx.fillStyle = radGrad;
    ctx.beginPath();
    ctx.arc(right, bulbY, 45, 0, 2*Math.PI);
    ctx.fill();
  }

  // Draw Ammeter measuring reading
  ctx.fillStyle = "#fff";
  ctx.strokeStyle = "#000";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(resX, bottom, 18, 0, 2*Math.PI);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = "#000";
  ctx.font = "bold 10px monospace";
  ctx.fillText(`${current.toFixed(3)} A`, resX, bottom + 4);

  // Animate moving electrons dots along wires
  ctx.fillStyle = "#00f2fe";
  const loopLen = 2 * (right - left) + 2 * (bottom - top);
  const flowSpeed = current * 12; 
  
  // Draw 15 moving electron dots
  for (let step = 0; step < 15; step++) {
    const dist = ((simState.electronAngle * 4) + (step * (loopLen/15))) % loopLen;
    let dotX = left;
    let dotY = top;

    if (dist < (right - left)) {
      // top wire branch
      dotX = left + dist;
      dotY = top;
    } else if (dist < (right - left + bottom - top)) {
      // right branch
      dotX = right;
      dotY = top + (dist - (right - left));
    } else if (dist < (2 * (right - left) + bottom - top)) {
      // bottom branch
      dotX = right - (dist - (right - left + bottom - top));
      dotY = bottom;
    } else {
      // left branch
      dotX = left;
      dotY = bottom - (dist - (2 * (right - left) + bottom - top));
    }

    ctx.beginPath();
    ctx.arc(dotX, dotY, 4, 0, 2*Math.PI);
    ctx.fill();
  }
}

function drawVectorLab(isDark) {
  // Origin is at center of canvas
  const cx = canvasEl.width / 2;
  const cy = canvasEl.height / 2;

  // Draw grid lines
  const gridSpacing = 30;
  ctx.strokeStyle = isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)";
  ctx.lineWidth = 1;
  for (let x = cx % gridSpacing; x < canvasEl.width; x += gridSpacing) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvasEl.height);
    ctx.stroke();
  }
  for (let y = cy % gridSpacing; y < canvasEl.height; y += gridSpacing) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvasEl.width, y);
    ctx.stroke();
  }

  // Draw main axes
  ctx.strokeStyle = isDark ? "#94a3b8" : "#475569";
  ctx.lineWidth = 2;
  ctx.beginPath();
  // X axis
  ctx.moveTo(10, cy);
  ctx.lineTo(canvasEl.width - 10, cy);
  // Y axis
  ctx.moveTo(cx, 10);
  ctx.lineTo(cx, canvasEl.height - 10);
  ctx.stroke();

  // Axis arrows and labels
  ctx.fillStyle = isDark ? "#94a3b8" : "#475569";
  ctx.font = "bold 12px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("X", canvasEl.width - 15, cy - 8);
  ctx.fillText("Y", cx + 12, 18);

  // Get parameters
  const magA = simState.vectorAMag !== undefined ? simState.vectorAMag : 5;
  const angA = (simState.vectorAAngle !== undefined ? simState.vectorAAngle : 30) * Math.PI / 180;
  const magB = simState.vectorBMag !== undefined ? simState.vectorBMag : 7;
  const angB = (simState.vectorBAngle !== undefined ? simState.vectorBAngle : 120) * Math.PI / 180;

  // Conversion scale: 1 unit = 25px
  const scale = 25;

  // Vectors from origin
  const ax = magA * Math.cos(angA) * scale;
  const ay = -magA * Math.sin(angA) * scale; // negative because screen Y is downward

  const bx = magB * Math.cos(angB) * scale;
  const by = -magB * Math.sin(angB) * scale;

  const rx = ax + bx;
  const ry = ay + by;

  // Helper to draw an arrow
  function drawArrow(x1, y1, x2, y2, color, width, label) {
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = width;
    
    // Draw line
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();

    // Arrow tip
    const angle = Math.atan2(y2 - y1, x2 - x1);
    const arrowSize = width * 2.5 + 4;
    ctx.beginPath();
    ctx.moveTo(x2, y2);
    ctx.lineTo(x2 - arrowSize * Math.cos(angle - Math.PI/6), y2 - arrowSize * Math.sin(angle - Math.PI/6));
    ctx.lineTo(x2 - arrowSize * Math.cos(angle + Math.PI/6), y2 - arrowSize * Math.sin(angle + Math.PI/6));
    ctx.fill();

    // Label
    if (label) {
      ctx.font = "bold 12px Poppins";
      const midX = (x1 + x2) / 2 + 10 * Math.cos(angle + Math.PI/2);
      const midY = (y1 + y2) / 2 + 10 * Math.sin(angle + Math.PI/2);
      ctx.fillText(label, midX, midY);
    }
  }

  // Draw vector A (Blue)
  drawArrow(cx, cy, cx + ax, cy + ay, "#3b82f6", 3, "A");

  // Draw vector B (Green)
  drawArrow(cx, cy, cx + bx, cy + by, "#10b981", 3, "B");

  // Draw vector B shifted to tip of A (dotted representation to show vector addition)
  ctx.strokeStyle = isDark ? "rgba(255, 255, 255, 0.4)" : "rgba(0, 0, 0, 0.3)";
  ctx.lineWidth = 1.5;
  ctx.setLineDash([4, 4]);
  // A to R
  ctx.beginPath();
  ctx.moveTo(cx + ax, cy + ay);
  ctx.lineTo(cx + rx, cy + ry);
  ctx.stroke();
  // B to R
  ctx.beginPath();
  ctx.moveTo(cx + bx, cy + by);
  ctx.lineTo(cx + rx, cy + ry);
  ctx.stroke();
  ctx.setLineDash([]);

  // Draw Resultant vector R (Red, thicker)
  drawArrow(cx, cy, cx + rx, cy + ry, "#ef4444", 4, "R");

  // Text info box on top-left of canvas
  ctx.fillStyle = isDark ? "rgba(30, 41, 59, 0.85)" : "rgba(255, 255, 255, 0.85)";
  ctx.strokeStyle = isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)";
  ctx.lineWidth = 1;
  const infoW = 210;
  const infoH = 100;
  ctx.fillRect(10, 10, infoW, infoH);
  ctx.strokeRect(10, 10, infoW, infoH);

  ctx.fillStyle = isDark ? "#fff" : "#0f172a";
  ctx.font = "bold 11px sans-serif";
  ctx.textAlign = "left";
  
  const magR = Math.sqrt((magA*Math.cos(angA) + magB*Math.cos(angB))**2 + (magA*Math.sin(angA) + magB*Math.sin(angB))**2);
  let degR = Math.atan2(magA*Math.sin(angA) + magB*Math.sin(angB), magA*Math.cos(angA) + magB*Math.cos(angB)) * 180 / Math.PI;
  if (degR < 0) degR += 360;

  ctx.fillText("Informasi Vektor:", 20, 25);
  
  ctx.fillStyle = "#3b82f6";
  ctx.fillText(`A = ${magA.toFixed(1)} | θ = ${(simState.vectorAAngle !== undefined ? simState.vectorAAngle : 30)}°`, 20, 43);
  
  ctx.fillStyle = "#10b981";
  ctx.fillText(`B = ${magB.toFixed(1)} | θ = ${(simState.vectorBAngle !== undefined ? simState.vectorBAngle : 120)}°`, 20, 61);
  
  ctx.fillStyle = "#ef4444";
  ctx.fillText(`R = ${magR.toFixed(1)} | θ = ${degR.toFixed(1)}°`, 20, 79);
  
  ctx.fillStyle = isDark ? "#94a3b8" : "#475569";
  ctx.font = "9px sans-serif";
  ctx.fillText("R = A + B (Metode Jajar Genjang)", 20, 94);
}

// Fallbacks interface widget drawers for the remaining 17 labs
function drawGenericWidget(isDark) {
  ctx.fillStyle = isDark ? "#fff" : "#1e293b";
  ctx.font = "bold 16px Poppins";
  ctx.textAlign = "center";
  
  const lab = window.db.getTable("labs").find(l => l.id === activeLabId);
  ctx.fillText(`${lab ? lab.name : "Simulasi Fisika"}`, canvasEl.width / 2, 40);

  if (activeLabType === "projectile") {
    // Parabola projectile simulation
    const launchX = 80;
    const launchY = canvasEl.height - 80;
    
    // Draw ground
    ctx.strokeStyle = isDark ? "#475569" : "#94a3b8";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(0, launchY);
    ctx.lineTo(canvasEl.width, launchY);
    ctx.stroke();

    // Draw cannon barrel
    const angleRad = simState.widgetSlider2 * (Math.PI / 180);
    const barrelLen = 40;
    ctx.strokeStyle = varColor("--brand-orange");
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.moveTo(launchX, launchY);
    ctx.lineTo(launchX + barrelLen * Math.cos(angleRad), launchY - barrelLen * Math.sin(angleRad));
    ctx.stroke();

    // Plot parabola trajectory dotted curve
    ctx.strokeStyle = "rgba(13, 110, 253, 0.4)";
    ctx.lineWidth = 2;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(launchX, launchY);
    const speed = simState.widgetSlider1 * 2;
    const g = 9.8;
    for (let t = 0; t < 10; t += 0.1) {
      const px = launchX + (speed * Math.cos(angleRad) * t) * 6;
      const py = launchY - (speed * Math.sin(angleRad) * t - 0.5 * g * t * t) * 6;
      if (py > launchY) break;
      ctx.lineTo(px, py);
    }
    ctx.stroke();
    ctx.setLineDash([]);
  } 
  
  else if (activeLabType === "pendulum") {
    // Pendulum bob oscillator widget
    const pivotX = canvasEl.width / 2;
    const pivotY = 50;
    const length = simState.widgetSlider1 * 20; // scale
    const angle = simState.oscillatorAngle;

    const bobX = pivotX + length * Math.sin(angle);
    const bobY = pivotY + length * Math.cos(angle);

    // Draw string cord
    ctx.strokeStyle = isDark ? "#94a3b8" : "#475569";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(pivotX, pivotY);
    ctx.lineTo(bobX, bobY);
    ctx.stroke();

    // Bob mass sphere
    ctx.fillStyle = varColor("--brand-orange");
    ctx.beginPath();
    ctx.arc(bobX, bobY, 16, 0, 2*Math.PI);
    ctx.fill();
    ctx.stroke();

    // Pivot support pin
    ctx.fillStyle = "#ef4444";
    ctx.fillRect(pivotX - 6, pivotY - 6, 12, 12);
  } 
  
  else if (activeLabType === "string_wave" || activeLabType === "sound_resonance") {
    // Sinusoidal waves visualizer widget
    ctx.strokeStyle = varColor("--brand-blue");
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(0, canvasEl.height / 2);
    
    const amp = simState.widgetSlider1 * 8; // amplitude
    const freq = simState.widgetSlider2 * 0.05; // frequency
    
    for (let x = 0; x < canvasEl.width; x++) {
      const y = (canvasEl.height / 2) + amp * Math.sin(freq * x - simState.wavePhase);
      ctx.lineTo(x, y);
    }
    ctx.stroke();
  } 
  
  else if (activeLabType === "photoelectric") {
    // Photoelectric effect
    // Plates
    ctx.fillStyle = "#94a3b8";
    ctx.fillRect(100, 80, 20, 100); // emitter
    ctx.fillRect(canvasEl.width - 120, 80, 20, 100); // collector

    // Photons arrows (incoming waves)
    ctx.strokeStyle = "violet";
    ctx.lineWidth = 2;
    const photonsCount = Math.floor(simState.widgetSlider1);
    for (let i = 0; i < photonsCount; i++) {
      const startX = 20 + i*15;
      const startY = 50 + i*15;
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(90, startY + 50);
      ctx.stroke();
    }

    // Photo-electrons circles knock off
    ctx.fillStyle = "yellow";
    simState.photoElectrons.forEach(e => {
      ctx.beginPath();
      ctx.arc(e.x, e.y, 4, 0, 2*Math.PI);
      ctx.fill();
    });
  } 
  
  else {
    // generic static physics icon representation
    ctx.fillStyle = varColor("--brand-blue");
    ctx.beginPath();
    ctx.arc(canvasEl.width/2, canvasEl.height/2, 40, 0, 2*Math.PI);
    ctx.fill();
    ctx.fillStyle = "#fff";
    ctx.fillText("Ready", canvasEl.width/2, canvasEl.height/2 + 6);
  }
}

// ----------------- NEW SIMULATION DRAWING FUNCTIONS -----------------

function drawScientificMethod(isDark) {
  const mode = simState.scientificMethodMode;
  
  if (mode === "safety") {
    // Mode A: Safety Room Identification
    ctx.save();
    
    // Draw Lab background wall and floor
    ctx.fillStyle = isDark ? "#1e293b" : "#e2e8f0";
    ctx.fillRect(0, 0, canvasEl.width, canvasEl.height);
    
    // Floor
    ctx.fillStyle = isDark ? "#0f172a" : "#cbd5e1";
    ctx.fillRect(0, canvasEl.height - 80, canvasEl.width, 80);
    
    // Laboratory Table
    ctx.fillStyle = isDark ? "#334155" : "#94a3b8";
    ctx.fillRect(50, canvasEl.height - 130, canvasEl.width - 100, 50);
    ctx.strokeStyle = isDark ? "#475569" : "#475569";
    ctx.lineWidth = 3;
    ctx.strokeRect(50, canvasEl.height - 130, canvasEl.width - 100, 50);

    // Cabinet in background
    ctx.fillStyle = isDark ? "#0f172a" : "#f1f5f9";
    ctx.fillRect(80, 40, 100, 110);
    ctx.strokeRect(80, 40, 100, 110);
    ctx.fillStyle = isDark ? "#475569" : "#cbd5e1";
    ctx.font = "9px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("LEMARI KIMIA", 130, 55);

    // Hazard Items
    simState.safetyActiveHazards.forEach(hazard => {
      if (hazard.solved) {
        // Draw green solved sign
        ctx.fillStyle = "#10b981";
        ctx.beginPath();
        ctx.arc(hazard.x, hazard.y, 15, 0, 2*Math.PI);
        ctx.fill();
        ctx.fillStyle = "#fff";
        ctx.font = "bold 12px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("✔", hazard.x, hazard.y + 4);
      } else {
        // Draw pulsing red circle
        const pulse = 12 + 6 * Math.sin(Date.now() * 0.007);
        const isSelected = simState.safetySelectedHazard === hazard.id;
        
        ctx.fillStyle = isSelected ? "rgba(239, 68, 68, 0.4)" : "rgba(239, 68, 68, 0.2)";
        ctx.beginPath();
        ctx.arc(hazard.x, hazard.y, pulse + 5, 0, 2*Math.PI);
        ctx.fill();
        
        ctx.fillStyle = "#ef4444";
        ctx.strokeStyle = "#fff";
        ctx.lineWidth = isSelected ? 3 : 1.5;
        ctx.beginPath();
        ctx.arc(hazard.x, hazard.y, 12, 0, 2*Math.PI);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = "#fff";
        ctx.font = "bold 11px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("!", hazard.x, hazard.y + 4);
        
        // Hazard Text Banner below
        ctx.fillStyle = isSelected ? "#ef4444" : "rgba(0,0,0,0.6)";
        ctx.fillRect(hazard.x - 45, hazard.y - 30, 90, 14);
        ctx.fillStyle = "#fff";
        ctx.font = "8px sans-serif";
        ctx.fillText(hazard.name, hazard.x, hazard.y - 20);
      }
    });

    // Instructions inside viewport
    ctx.fillStyle = isDark ? "#fff" : "#0f172a";
    ctx.font = "bold 11px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("KLIK SIMBOL HAZARD DI ATAS UNTUK MEMILIHNYA", canvasEl.width / 2, 30);
    
    // Add clickable hazard detection trigger by binding canvas click!
    if (!canvasEl.onclick) {
      canvasEl.onclick = (e) => {
        if (simState.scientificMethodMode !== "safety") return;
        const rect = canvasEl.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const clickY = e.clientY - rect.top;
        
        // Check if clicked any hazard
        let clickedHazard = null;
        simState.safetyActiveHazards.forEach(h => {
          const dist = Math.sqrt((clickX - h.x)**2 + (clickY - h.y)**2);
          if (dist < 25 && !h.solved) {
            clickedHazard = h.id;
          }
        });
        
        if (clickedHazard) {
          simState.safetySelectedHazard = clickedHazard;
          window.showToast(`Memilih hazard: ${simState.safetyActiveHazards.find(h => h.id === clickedHazard).name}. Pilih tindakan pengamanan yang sesuai!`, "info");
          drawSimulation();
        }
      };
    }
    
    ctx.restore();
  } else {
    // Mode B: Scientific Method (Heating Liquid)
    ctx.save();
    
    // Draw Lab scene
    ctx.fillStyle = isDark ? "#1e293b" : "#f1f5f9";
    ctx.fillRect(0, 0, canvasEl.width, canvasEl.height);
    
    // Table
    ctx.fillStyle = "#475569";
    ctx.fillRect(0, canvasEl.height - 40, canvasEl.width, 40);
    
    const bx = canvasEl.width / 2;
    const by = canvasEl.height - 180;
    
    // Draw Bunsen burner
    ctx.fillStyle = "#94a3b8";
    ctx.fillRect(bx - 20, by + 100, 40, 40); // base
    ctx.fillStyle = "#475569";
    ctx.fillRect(bx - 4, by + 50, 8, 50); // pipe
    
    // Draw flame if simulation is running
    if (isSimRunning) {
      const flameH = 20 + 10 * Math.sin(Date.now() * 0.02) * (simState.heatingPower / 500);
      const grad = ctx.createRadialGradient(bx, by + 40, 2, bx, by + 45, flameH);
      grad.addColorStop(0, "yellow");
      grad.addColorStop(0.3, "orange");
      grad.addColorStop(1, "rgba(239,68,68,0)");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.moveTo(bx - 12, by + 50);
      ctx.quadraticCurveTo(bx, by + 50 - flameH, bx + 12, by + 50);
      ctx.closePath();
      ctx.fill();
    }
    
    // Draw Tripod Stand
    ctx.strokeStyle = "#334155";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(bx - 40, by + 140);
    ctx.lineTo(bx - 30, by + 50);
    ctx.lineTo(bx + 30, by + 50);
    ctx.lineTo(bx + 40, by + 140);
    ctx.stroke();
    
    // Draw Beaker Glass
    ctx.strokeStyle = isDark ? "#94a3b8" : "#475569";
    ctx.lineWidth = 3;
    ctx.fillStyle = "rgba(255,255,255,0.08)";
    ctx.fillRect(bx - 30, by - 30, 60, 80);
    ctx.strokeRect(bx - 30, by - 30, 60, 80);
    
    // Beaker Lip
    ctx.beginPath();
    ctx.moveTo(bx - 34, by - 30);
    ctx.lineTo(bx + 34, by - 30);
    ctx.stroke();
    
    // Liquid level inside beaker
    const fillRatio = simState.heatingVolume / 500; // max 500 mL
    const liquidH = 75 * fillRatio;
    const liquidY = by + 50 - liquidH;
    
    ctx.fillStyle = "rgba(14, 165, 233, 0.4)";
    ctx.fillRect(bx - 28, liquidY, 56, liquidH);
    
    // Bubbles if boiling (temp >= 95)
    if (simState.heatingTemp >= 95.0 && isSimRunning) {
      ctx.fillStyle = "rgba(255,255,255,0.6)";
      for (let b = 0; b < 10; b++) {
        const bubbleX = bx - 25 + Math.random() * 50;
        const bubbleY = liquidY + Math.random() * liquidH;
        ctx.beginPath();
        ctx.arc(bubbleX, bubbleY, 2 + Math.random()*2, 0, 2*Math.PI);
        ctx.fill();
      }
      // Steam overlay waves
      ctx.fillStyle = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)";
      ctx.fillRect(bx - 30, by - 70, 60, 30);
    }
    
    // Draw Digital Thermometer probe
    ctx.strokeStyle = "#94a3b8";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(bx - 10, by - 50);
    ctx.lineTo(bx - 10, by + 30);
    ctx.stroke();
    // Probe head
    ctx.fillStyle = "#ef4444";
    ctx.fillRect(bx - 25, by - 65, 30, 15);
    ctx.fillStyle = "#fff";
    ctx.font = "8px monospace";
    ctx.textAlign = "center";
    ctx.fillText(`${Math.round(simState.heatingTemp)}°C`, box => bx - 10, by - 55);
    
    // Scale markings on beaker
    ctx.fillStyle = isDark ? "#cbd5e1" : "#475569";
    ctx.font = "7px sans-serif";
    ctx.textAlign = "left";
    for (let ml = 100; ml <= 500; ml += 100) {
      const mlY = by + 50 - 75 * (ml / 500);
      ctx.fillRect(bx + 15, mlY, 10, 1);
      ctx.fillText(`${ml}mL`, bx + 28, mlY + 3);
    }
    
    ctx.restore();
  }
}

function drawSkateRamp(isDark) {
  ctx.save();
  
  // Landscape colors
  const skyGrad = ctx.createLinearGradient(0, 0, 0, canvasEl.height);
  skyGrad.addColorStop(0, isDark ? "#0f172a" : "#bae6fd");
  skyGrad.addColorStop(1, isDark ? "#1e293b" : "#f0f9ff");
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, canvasEl.width, canvasEl.height);
  
  // Draw green hills
  ctx.fillStyle = isDark ? "#064e3b" : "#86efac";
  ctx.beginPath();
  ctx.moveTo(0, canvasEl.height - 40);
  ctx.quadraticCurveTo(canvasEl.width/3, canvasEl.height - 80, canvasEl.width, canvasEl.height - 40);
  ctx.lineTo(canvasEl.width, canvasEl.height);
  ctx.lineTo(0, canvasEl.height);
  ctx.closePath();
  ctx.fill();
  
  // Center of ramp
  const cx = canvasEl.width / 2;
  const bottomY = canvasEl.height - 90;
  const rampH = 120; // 120 pixels representing 5.0m
  
  // Draw parabolic U-Ramp path
  ctx.strokeStyle = "#475569";
  ctx.lineWidth = 10;
  ctx.lineCap = "round";
  ctx.beginPath();
  
  // Calculate points
  const points = [];
  for (let x = -150; x <= 150; x += 10) {
    const rx = cx + x;
    const ry = bottomY - rampH * Math.pow(x / 150, 2);
    points.push({x: rx, y: ry});
  }
  
  ctx.moveTo(points[0].x, points[0].y);
  for (let i = 1; i < points.length; i++) {
    ctx.lineTo(points[i].x, points[i].y);
  }
  ctx.stroke();
  
  // Draw support frame grid for ramp
  ctx.strokeStyle = "rgba(148, 163, 184, 0.4)";
  ctx.lineWidth = 2;
  for (let i = 0; i < points.length; i += 3) {
    ctx.beginPath();
    ctx.moveTo(points[i].x, points[i].y);
    ctx.lineTo(points[i].x, bottomY + 30);
    ctx.stroke();
  }
  
  // Draw Skater Bob
  const skaterX = cx + simState.skateX;
  const skaterY = bottomY - rampH * Math.pow(simState.skateX / 150, 2) - 12; // offset radius
  
  ctx.fillStyle = varColor("--brand-orange");
  ctx.strokeStyle = "#000";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(skaterX, skaterY, 10, 0, 2*Math.PI);
  ctx.fill();
  ctx.stroke();
  
  // Draw eyes or wheels to look cute
  ctx.fillStyle = "#fff";
  ctx.beginPath();
  ctx.arc(skaterX - 3, skaterY - 2, 3, 0, 2*Math.PI);
  ctx.arc(skaterX + 3, skaterY - 2, 3, 0, 2*Math.PI);
  ctx.fill();
  ctx.fillStyle = "#000";
  ctx.beginPath();
  ctx.arc(skaterX - 3, skaterY - 2, 1, 0, 2*Math.PI);
  ctx.arc(skaterX + 3, skaterY - 2, 1, 0, 2*Math.PI);
  ctx.fill();
  
  // Draw energy bars inside canvas (floating overlay)
  const barX = 20;
  const barY = 25;
  const barW = 12;
  const maxBarH = 65;
  
  const m = simState.skateMass;
  const g = 9.8;
  const h_max = simState.skateInitialHeight;
  const totalE = m * g * h_max; // reference
  
  const drawEnergyBar = (ox, value, labelText, color) => {
    const ratio = Math.max(0, Math.min(1.0, value / totalE));
    const h = ratio * maxBarH;
    
    ctx.fillStyle = isDark ? "rgba(0,0,0,0.3)" : "rgba(255,255,255,0.4)";
    ctx.fillRect(ox, barY, barW, maxBarH);
    
    ctx.fillStyle = color;
    ctx.fillRect(ox, barY + maxBarH - h, barW, h);
    ctx.strokeRect(ox, barY, barW, maxBarH);
    
    ctx.fillStyle = isDark ? "#fff" : "#000";
    ctx.font = "8px monospace";
    ctx.fillText(labelText, ox + 2, barY + maxBarH + 12);
  };
  
  drawEnergyBar(barX, simState.skateEp, "PE", "#3b82f6");      // Potential (Blue)
  drawEnergyBar(barX + 20, simState.skateEk, "KE", "#10b981");  // Kinetic (Green)
  drawEnergyBar(barX + 40, simState.skateEtherm, "TH", "#ef4444"); // Thermal (Red)
  drawEnergyBar(barX + 60, totalE, "TE", "#eab308");             // Total (Yellow)
  
  ctx.fillStyle = isDark ? "#fff" : "#000";
  ctx.font = "bold 9px sans-serif";
  ctx.fillText("DIAGRAM BATANG ENERGI", barX, barY - 6);
  
  // Speed badge readout
  ctx.fillStyle = "rgba(15,23,42,0.85)";
  ctx.fillRect(canvasEl.width - 150, 15, 135, 45);
  ctx.strokeStyle = "rgba(255,255,255,0.15)";
  ctx.strokeRect(canvasEl.width - 150, 15, 135, 45);
  
  ctx.fillStyle = "#38bdf8";
  ctx.font = "bold 10px monospace";
  ctx.fillText(`Kecepatan: ${simState.skateVx.toFixed(2)} m/s`, canvasEl.width - 140, 32);
  ctx.fillStyle = "#fff";
  ctx.fillText(`Tinggi    : ${((skaterY - (bottomY - 12)) / -rampH * h_max).toFixed(2)} m`, canvasEl.width - 140, 48);

  ctx.restore();
}

function drawWindSolar(isDark) {
  ctx.save();
  
  // Sky backfill
  const skyGrad = ctx.createLinearGradient(0, 0, 0, canvasEl.height);
  skyGrad.addColorStop(0, isDark ? "#0f172a" : "#bae6fd");
  skyGrad.addColorStop(1, isDark ? "#1e293b" : "#f0f9ff");
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, canvasEl.width, canvasEl.height);
  
  // Draw Hills
  ctx.fillStyle = isDark ? "#14532d" : "#4ade80";
  ctx.beginPath();
  ctx.moveTo(0, canvasEl.height - 60);
  ctx.quadraticCurveTo(canvasEl.width * 0.4, canvasEl.height - 110, canvasEl.width, canvasEl.height - 60);
  ctx.lineTo(canvasEl.width, canvasEl.height);
  ctx.lineTo(0, canvasEl.height);
  ctx.closePath();
  ctx.fill();
  
  // Draw Wind Turbine (Kincir Angin)
  const tx = canvasEl.width * 0.3;
  const ty = canvasEl.height - 140;
  
  // Tower
  ctx.strokeStyle = "#94a3b8";
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.moveTo(tx, ty);
  ctx.lineTo(tx, canvasEl.height - 80);
  ctx.stroke();
  // Generator head
  ctx.fillStyle = "#cbd5e1";
  ctx.fillRect(tx - 8, ty - 8, 16, 16);
  
  // Rotating blades (3 blades 120 deg apart)
  const angle = simState.wavePhase; // angle variable
  ctx.strokeStyle = "#f8fafc";
  ctx.lineWidth = 4.5;
  ctx.lineCap = "round";
  for (let b = 0; b < 3; b++) {
    const bladeAngle = angle + (b * 2 * Math.PI / 3);
    ctx.beginPath();
    ctx.moveTo(tx, ty);
    ctx.lineTo(tx + 40 * Math.cos(bladeAngle), ty + 40 * Math.sin(bladeAngle));
    ctx.stroke();
  }
  
  // Draw Solar Panel (Panel Surya)
  const sx = canvasEl.width * 0.7;
  const sy = canvasEl.height - 90;
  
  ctx.save();
  ctx.translate(sx, sy);
  
  // Rotate panel matching Sun position or angle slider
  // Solar angle is 0 to 180 degrees. Let's tilt the panel to face the sun
  const panelTilt = (simState.solarAngle - 90) * 0.5 * Math.PI / 180;
  ctx.rotate(panelTilt);
  
  // Panel frame
  ctx.fillStyle = "#1e293b";
  ctx.fillRect(-25, -5, 50, 10);
  ctx.strokeStyle = "#38bdf8";
  ctx.lineWidth = 1.5;
  ctx.strokeRect(-25, -5, 50, 10);
  
  // Panel grid cells
  ctx.fillStyle = "#0d6efd";
  ctx.fillRect(-22, -3, 10, 6);
  ctx.fillRect(-10, -3, 10, 6);
  ctx.fillRect(2, -3, 10, 6);
  ctx.fillRect(14, -3, 10, 6);
  
  ctx.restore();
  
  // Stand of Solar panel
  ctx.strokeStyle = "#475569";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(sx, sy);
  ctx.lineTo(sx, canvasEl.height - 75);
  ctx.stroke();

  // Draw Sun (Sudut Surya)
  const sunAngleRad = simState.solarAngle * Math.PI / 180;
  const sunR = 15;
  const sunDist = 120;
  const sunX = sx + sunDist * Math.cos(sunAngleRad + Math.PI); // offset
  const sunY = sy + sunDist * Math.sin(sunAngleRad + Math.PI);
  
  if (simState.solarAngle > 5 && simState.solarAngle < 175) {
    ctx.fillStyle = "#fbbf24";
    ctx.shadowColor = "#fbbf24";
    ctx.shadowBlur = 15;
    ctx.beginPath();
    ctx.arc(sunX, sunY, sunR, 0, 2*Math.PI);
    ctx.fill();
    ctx.shadowBlur = 0; // reset shadow
    
    // Draw sunshine rays hitting panel if cloudiness is low
    if (simState.cloudiness < 85) {
      ctx.strokeStyle = "rgba(251, 191, 36, 0.2)";
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(sunX, sunY);
      ctx.lineTo(sx, sy);
      ctx.stroke();
      ctx.setLineDash([]);
    }
  }

  // Draw Clouds (Tutupan Awan)
  if (simState.cloudiness > 0) {
    ctx.fillStyle = isDark ? "rgba(148, 163, 184, 0.2)" : "rgba(255,255,255,0.7)";
    const cloudCount = Math.floor(simState.cloudiness / 20) + 1;
    for (let c = 0; c < cloudCount; c++) {
      const cx = canvasEl.width * 0.5 + c * 35 - 50;
      const cy = 40 + (c % 2) * 15;
      ctx.beginPath();
      ctx.arc(cx, cy, 18, 0, 2*Math.PI);
      ctx.arc(cx + 12, cy - 6, 20, 0, 2*Math.PI);
      ctx.arc(cx + 25, cy, 18, 0, 2*Math.PI);
      ctx.fill();
    }
  }

  // Draw House & Light indicator
  const hx = canvasEl.width * 0.5 - 20;
  const hy = canvasEl.height - 100;
  
  ctx.fillStyle = "#7f1d1d"; // brown house
  ctx.fillRect(hx, hy, 40, 30);
  ctx.strokeStyle = "#450a0a";
  ctx.strokeRect(hx, hy, 40, 30);
  // Roof
  ctx.fillStyle = "#ef4444";
  ctx.beginPath();
  ctx.moveTo(hx - 5, hy);
  ctx.lineTo(hx + 20, hy - 15);
  ctx.lineTo(hx + 45, hy);
  ctx.closePath();
  ctx.fill();
  
  // Windows glow if power generated is high
  ctx.fillStyle = totalPower > 3.0 ? "#fbbf24" : "#1e293b"; // glow yellow
  ctx.fillRect(hx + 6, hy + 8, 10, 10);
  ctx.fillRect(hx + 24, hy + 8, 10, 10);
  
  // Power readout display on canvas
  ctx.fillStyle = "rgba(15,23,42,0.85)";
  ctx.fillRect(15, 15, 150, 60);
  ctx.strokeStyle = "rgba(255,255,255,0.15)";
  ctx.strokeRect(15, 15, 150, 60);
  
  ctx.fillStyle = "#fff";
  ctx.font = "9px monospace";
  ctx.fillText(`Daya Angin : ${simState.windPower.toFixed(2)} W`, 22, 28);
  ctx.fillText(`Daya Surya : ${simState.solarPower.toFixed(2)} W`, 22, 42);
  ctx.fillStyle = "#10b981";
  ctx.fillText(`Baterai    : ${Math.round(simState.batteryCharge)} %`, 22, 56);
  
  ctx.restore();
}

function drawGreenhouse(isDark) {
  ctx.save();
  
  // Render deep space background
  ctx.fillStyle = isDark ? "#020617" : "#bae6fd";
  ctx.fillRect(0, 0, canvasEl.width, canvasEl.height);
  
  // Draw Earth curvature at the bottom
  const ex = canvasEl.width / 2;
  const ey = canvasEl.height + 250;
  const earthR = 360;
  
  // Earth color shifts depending on temperature
  // Healthy: Green/Blue. Unhealthy: Brown/Yellow
  const t = simState.earthTemp;
  let earthGrad = ctx.createRadialGradient(ex, ey - 20, 20, ex, ey, earthR);
  
  if (t < 25.0) {
    earthGrad.addColorStop(0, "#10b981"); // green
    earthGrad.addColorStop(0.6, "#3b82f6"); // blue
    earthGrad.addColorStop(1, "#1d4ed8");
  } else if (t < 33.0) {
    earthGrad.addColorStop(0, "#fbbf24"); // yellowing grass
    earthGrad.addColorStop(0.6, "#2563eb");
    earthGrad.addColorStop(1, "#1e3a8a");
  } else {
    earthGrad.addColorStop(0, "#78350f"); // dry dirt brown
    earthGrad.addColorStop(0.6, "#1e3a8a");
    earthGrad.addColorStop(1, "#030712");
  }
  
  ctx.fillStyle = earthGrad;
  ctx.beginPath();
  ctx.arc(ex, ey, earthR, 0, 2*Math.PI);
  ctx.fill();
  
  // Draw glacier ice caps if temperature is low
  if (t < 35.0) {
    const iceWidth = Math.max(0, 160 - 5 * (t - 14.0)); // shrink cap as it gets hotter
    ctx.fillStyle = "#f8fafc";
    ctx.beginPath();
    ctx.arc(ex, ey, earthR + 1.5, -Math.PI * 0.5 - (iceWidth/earthR), -Math.PI * 0.5 + (iceWidth/earthR));
    ctx.lineTo(ex, ey);
    ctx.closePath();
    ctx.fill();
  }

  // Draw Atmosphere layer line
  const atmosR = earthR + 45;
  ctx.strokeStyle = "rgba(56, 189, 248, 0.45)";
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.arc(ex, ey, atmosR, -Math.PI * 0.25, -Math.PI * 0.75, true);
  ctx.stroke();

  // Draw floating CO2 molecules if ppm is high
  const co2Density = Math.floor((simState.co2Ppm - 200) / 40);
  ctx.fillStyle = "rgba(148, 163, 184, 0.7)";
  ctx.strokeStyle = "#475569";
  ctx.lineWidth = 1;
  for (let i = 0; i < co2Density; i++) {
    // Generate deterministic points based on index
    const seedAngle = -Math.PI * 0.5 + 0.3 * Math.sin(i * 1.7) + (i * 0.02) - (co2Density*0.01);
    const seedDist = atmosR - 10 - (i % 3) * 12;
    const cx = ex + seedDist * Math.cos(seedAngle);
    const cy = ey + seedDist * Math.sin(seedAngle);
    
    // Draw 3 tiny spheres clustered together representing CO2 (C-O-C)
    ctx.beginPath();
    ctx.arc(cx, cy, 3.5, 0, 2*Math.PI); // center Carbon
    ctx.fill();
    ctx.stroke();
    
    ctx.fillStyle = "#ef4444"; // red Oxygens
    ctx.beginPath();
    ctx.arc(cx - 5, cy, 2.5, 0, 2*Math.PI);
    ctx.arc(cx + 5, cy, 2.5, 0, 2*Math.PI);
    ctx.fill();
    ctx.fillStyle = "rgba(148, 163, 184, 0.7)";
  }

  // Draw Incoming Solar Radiation (Yellow waves)
  ctx.strokeStyle = "#fbbf24";
  ctx.lineWidth = 2.5;
  
  // Wave line 1
  ctx.beginPath();
  ctx.moveTo(120, 20);
  for (let y = 20; y < canvasEl.height - 90; y++) {
    const x = 120 + 8 * Math.sin(y * 0.08 + simTime * 5);
    ctx.lineTo(x, y);
  }
  ctx.stroke();
  
  // Outgoing thermal waves (Red waves bouncing back)
  ctx.strokeStyle = "#ef4444";
  ctx.lineWidth = 2.0;
  
  // Draw wave bouncing from Earth to atmosphere
  const startAngle = -Math.PI * 0.45;
  const startX = ex + earthR * Math.cos(startAngle);
  const startY = ey + earthR * Math.sin(startAngle);
  
  ctx.beginPath();
  ctx.moveTo(startX, startY);
  for (let dist = 0; dist < 50; dist++) {
    const progressY = startY - dist * 1.5;
    const progressX = startX + 6 * Math.sin(dist * 0.4 - simTime * 6);
    ctx.lineTo(progressX, progressY);
  }
  ctx.stroke();
  
  // Heat gets reflected down if CO2 is high
  if (simState.co2Ppm > 450) {
    const reflectX = startX + 30;
    const reflectY = startY - 70;
    ctx.strokeStyle = "#ef4444";
    ctx.setLineDash([2, 2]);
    ctx.beginPath();
    ctx.moveTo(reflectX, reflectY);
    ctx.lineTo(reflectX + 25, reflectY + 45); // down
    ctx.stroke();
    ctx.setLineDash([]);
  }

  // Thermometer readout on right side
  const thermX = canvasEl.width - 55;
  const thermY = 25;
  const thermH = 100;
  
  ctx.fillStyle = "#cbd5e1";
  ctx.fillRect(thermX, thermY, 10, thermH);
  ctx.strokeRect(thermX, thermY, 10, thermH);
  
  // Temperature fill
  const maxT = 45.0; // max scale
  const minT = 10.0;
  const tempRatio = Math.max(0, Math.min(1.0, (t - minT) / (maxT - minT)));
  const fillH = tempRatio * thermH;
  
  ctx.fillStyle = "#ef4444";
  ctx.fillRect(thermX, thermY + thermH - fillH, 10, fillH);
  // bulb
  ctx.beginPath();
  ctx.arc(thermX + 5, thermY + thermH, 10, 0, 2*Math.PI);
  ctx.fill();
  ctx.stroke();
  
  ctx.fillStyle = isDark ? "#fff" : "#000";
  ctx.font = "bold 11px monospace";
  ctx.textAlign = "right";
  ctx.fillText(`${t.toFixed(1)}°C`, thermX - 10, thermY + thermH - fillH + 5);
  
  // Draw alert if wildfires / dry
  if (t > 33.0) {
    ctx.fillStyle = "#ef4444";
    ctx.font = "bold 10px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("⚠️ CRITICAL GLOBAL WARMING!", ex, canvasEl.height - 120);
  }

  ctx.restore();
}

// Helper to pull colors safely
function varColor(cssVar) {
  try {
    const val = getComputedStyle(document.documentElement).getPropertyValue(cssVar);
    return val ? val.trim() : (cssVar === "--brand-orange" ? "#fd7e14" : "#0d6efd");
  } catch (e) {
    return cssVar === "--brand-orange" ? "#fd7e14" : "#0d6efd";
  }
}


// ----------------- DRAWING REAL-TIME GRAPHS ENGINES -----------------

function drawGraph() {
  if (!graphCtx || !graphCanvasEl) return;
  graphCtx.clearRect(0, 0, graphCanvasEl.width, graphCanvasEl.height);

  const isDark = document.documentElement.getAttribute("data-theme") === "dark";
  const gridColor = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)";
  const axisColor = isDark ? "#94a3b8" : "#475569";
  
  const w = graphCanvasEl.width;
  const h = graphCanvasEl.height;

  // Render bounding background
  graphCtx.fillStyle = isDark ? "#0f172a" : "#ffffff";
  graphCtx.fillRect(0, 0, w, h);

  // Draw Grid lines
  graphCtx.strokeStyle = gridColor;
  graphCtx.lineWidth = 1;
  const step = 25;
  for (let x = 40; x < w; x += step) {
    graphCtx.beginPath();
    graphCtx.moveTo(x, 0);
    graphCtx.lineTo(x, h - 30);
    graphCtx.stroke();
  }
  for (let y = 10; y < h - 30; y += step) {
    graphCtx.beginPath();
    graphCtx.moveTo(40, y);
    graphCtx.lineTo(w, y);
    graphCtx.stroke();
  }

  // Draw Axis lines
  graphCtx.strokeStyle = axisColor;
  graphCtx.lineWidth = 2;
  graphCtx.beginPath();
  graphCtx.moveTo(40, 10);
  graphCtx.lineTo(40, h - 30);
  graphCtx.lineTo(w - 10, h - 30);
  graphCtx.stroke();

  // Draw Axis labels
  graphCtx.fillStyle = axisColor;
  graphCtx.font = "9px monospace";
  graphCtx.textAlign = "center";

  // Active graphs plots
  if (activeLabType === "motion" || activeLabType === "forces") {
    // Draw two lines: Position s(t) (blue) & Velocity v(t) (orange)
    graphCtx.fillText("t (detik)", w - 30, h - 15);
    graphCtx.fillText("s (m) / v (m/s)", 50, 15);

    const logs = simState.forceLog;
    if (logs.length < 2) return;

    const maxTime = Math.max(5, logs[logs.length - 1].t);
    const maxVal = Math.max(10, logs.reduce((m, p) => Math.max(m, p.s, p.v), 0));

    const getX = (t) => 40 + (t / maxTime) * (w - 60);
    const getY = (val) => (h - 30) - (val / maxVal) * (h - 50);

    // Plot s(t) - Blue Line
    graphCtx.strokeStyle = "#3b82f6";
    graphCtx.lineWidth = 3;
    graphCtx.beginPath();
    graphCtx.moveTo(getX(logs[0].t), getY(logs[0].s));
    for (let i = 1; i < logs.length; i++) {
      graphCtx.lineTo(getX(logs[i].t), getY(logs[i].s));
    }
    graphCtx.stroke();

    // Plot v(t) - Orange Line
    graphCtx.strokeStyle = "#fd7e14";
    graphCtx.lineWidth = 3;
    graphCtx.beginPath();
    graphCtx.moveTo(getX(logs[0].t), getY(logs[0].v));
    for (let i = 1; i < logs.length; i++) {
      graphCtx.lineTo(getX(logs[i].t), getY(logs[i].v));
    }
    graphCtx.stroke();
    
    // Legends
    graphCtx.fillStyle = "#3b82f6";
    graphCtx.fillRect(w - 120, 10, 12, 6);
    graphCtx.fillText("Posisi s(t)", w - 70, 16);

    graphCtx.fillStyle = "#fd7e14";
    graphCtx.fillRect(w - 120, 22, 12, 6);
    graphCtx.fillText("Kecep v(t)", w - 70, 28);
  } 
  
  else if (activeLabType === "scientific_method") {
    // Temperature vs Time plot
    graphCtx.fillText("t (detik)", w - 30, h - 15);
    graphCtx.fillText("Suhu (°C)", 50, 15);

    const logs = simState.forceLog;
    if (logs.length < 2) return;

    const maxTime = Math.max(5, logs[logs.length - 1].t);
    const getX = (t) => 40 + (t / maxTime) * (w - 60);
    const getY = (val) => (h - 30) - (val / 110) * (h - 50); // max 110C

    // Plot temperature v(t) - Red Line
    graphCtx.strokeStyle = "#ef4444";
    graphCtx.lineWidth = 3;
    graphCtx.beginPath();
    graphCtx.moveTo(getX(logs[0].t), getY(logs[0].v));
    for (let i = 1; i < logs.length; i++) {
      graphCtx.lineTo(getX(logs[i].t), getY(logs[i].v));
    }
    graphCtx.stroke();

    // Legends
    graphCtx.fillStyle = "#ef4444";
    graphCtx.fillRect(w - 120, 10, 12, 6);
    graphCtx.fillText("Suhu Air", w - 70, 16);
  }

  else if (activeLabType === "skate_ramp") {
    // Energy vs Time plot
    graphCtx.fillText("t (detik)", w - 30, h - 15);
    graphCtx.fillText("Energi (J)", 50, 15);

    const logs = simState.forceLog;
    if (logs.length < 2) return;

    const maxTime = Math.max(5, logs[logs.length - 1].t);
    const maxVal = Math.max(10, logs.reduce((m, p) => Math.max(m, p.s, p.v), 0));

    const getX = (t) => 40 + (t / maxTime) * (w - 60);
    const getY = (val) => (h - 30) - (val / maxVal) * (h - 50);

    // Plot Ep (Potential Energy) - Blue Line
    graphCtx.strokeStyle = "#3b82f6";
    graphCtx.lineWidth = 2.5;
    graphCtx.beginPath();
    graphCtx.moveTo(getX(logs[0].t), getY(logs[0].s));
    for (let i = 1; i < logs.length; i++) {
      graphCtx.lineTo(getX(logs[i].t), getY(logs[i].s));
    }
    graphCtx.stroke();

    // Plot Ek (Kinetic Energy) - Green Line
    graphCtx.strokeStyle = "#10b981";
    graphCtx.lineWidth = 2.5;
    graphCtx.beginPath();
    graphCtx.moveTo(getX(logs[0].t), getY(logs[0].v));
    for (let i = 1; i < logs.length; i++) {
      graphCtx.lineTo(getX(logs[i].t), getY(logs[i].v));
    }
    graphCtx.stroke();

    // Legends
    graphCtx.fillStyle = "#3b82f6";
    graphCtx.fillRect(w - 120, 10, 12, 6);
    graphCtx.fillText("E. Potensial (Ep)", w - 60, 16);

    graphCtx.fillStyle = "#10b981";
    graphCtx.fillRect(w - 120, 22, 12, 6);
    graphCtx.fillText("E. Kinetik (Ek)", w - 60, 28);
  }

  else if (activeLabType === "wind_solar") {
    // Power vs Time plot
    graphCtx.fillText("t (detik)", w - 30, h - 15);
    graphCtx.fillText("Daya (W)", 50, 15);

    const logs = simState.forceLog;
    if (logs.length < 2) return;

    const maxTime = Math.max(5, logs[logs.length - 1].t);
    const maxVal = Math.max(10, logs.reduce((m, p) => Math.max(m, p.s, p.v), 0));

    const getX = (t) => 40 + (t / maxTime) * (w - 60);
    const getY = (val) => (h - 30) - (val / maxVal) * (h - 50);

    // Plot Wind Power s(t) - Blue Line
    graphCtx.strokeStyle = "#38bdf8";
    graphCtx.lineWidth = 2.5;
    graphCtx.beginPath();
    graphCtx.moveTo(getX(logs[0].t), getY(logs[0].s));
    for (let i = 1; i < logs.length; i++) {
      graphCtx.lineTo(getX(logs[i].t), getY(logs[i].s));
    }
    graphCtx.stroke();

    // Plot Solar Power v(t) - Amber Line
    graphCtx.strokeStyle = "#fbbf24";
    graphCtx.lineWidth = 2.5;
    graphCtx.beginPath();
    graphCtx.moveTo(getX(logs[0].t), getY(logs[0].v));
    for (let i = 1; i < logs.length; i++) {
      graphCtx.lineTo(getX(logs[i].t), getY(logs[i].v));
    }
    graphCtx.stroke();

    // Legends
    graphCtx.fillStyle = "#38bdf8";
    graphCtx.fillRect(w - 120, 10, 12, 6);
    graphCtx.fillText("Daya Angin", w - 70, 16);

    graphCtx.fillStyle = "#fbbf24";
    graphCtx.fillRect(w - 120, 22, 12, 6);
    graphCtx.fillText("Daya Surya", w - 70, 28);
  }

  else if (activeLabType === "greenhouse") {
    // Temp & CO2 vs Time plot
    graphCtx.fillText("t (detik)", w - 30, h - 15);
    graphCtx.fillText("T (°C) / (CO2 / 10)", 50, 15);

    const logs = simState.forceLog;
    if (logs.length < 2) return;

    const maxTime = Math.max(5, logs[logs.length - 1].t);
    const maxVal = Math.max(50, logs.reduce((m, p) => Math.max(m, p.s, p.v), 0));

    const getX = (t) => 40 + (t / maxTime) * (w - 60);
    const getY = (val) => (h - 30) - (val / maxVal) * (h - 50);

    // Plot CO2 s(t) - Green Line
    graphCtx.strokeStyle = "#10b981";
    graphCtx.lineWidth = 2.5;
    graphCtx.beginPath();
    graphCtx.moveTo(getX(logs[0].t), getY(logs[0].s));
    for (let i = 1; i < logs.length; i++) {
      graphCtx.lineTo(getX(logs[i].t), getY(logs[i].s));
    }
    graphCtx.stroke();

    // Plot Earth Temp v(t) - Red Line
    graphCtx.strokeStyle = "#ef4444";
    graphCtx.lineWidth = 2.5;
    graphCtx.beginPath();
    graphCtx.moveTo(getX(logs[0].t), getY(logs[0].v));
    for (let i = 1; i < logs.length; i++) {
      graphCtx.lineTo(getX(logs[i].t), getY(logs[i].v));
    }
    graphCtx.stroke();

    // Legends
    graphCtx.fillStyle = "#10b981";
    graphCtx.fillRect(w - 120, 10, 12, 6);
    graphCtx.fillText("CO2 (ppm/10)", w - 65, 16);

    graphCtx.fillStyle = "#ef4444";
    graphCtx.fillRect(w - 120, 22, 12, 6);
    graphCtx.fillText("Suhu Bumi (°C)", w - 65, 28);
  } 
  
  else if (activeLabType === "dc_circuit") {
    // Current vs Voltage Graph Plot (I-V curve)
    graphCtx.fillText("V (Volt)", w - 30, h - 15);
    graphCtx.fillText("I (Ampere)", 50, 15);

    // Plot line from V=0 to V=24 Volt for R resistor value
    const R = simState.circResistance;
    const currentAtV = (v) => v / R;

    const getX = (v) => 40 + (v / 24) * (w - 60);
    const getY = (i) => (h - 30) - (i / 0.8) * (h - 50); // max 0.8 A scale

    graphCtx.strokeStyle = "#00f2fe";
    graphCtx.lineWidth = 3;
    graphCtx.beginPath();
    graphCtx.moveTo(getX(0), getY(0));
    for (let volt = 1; volt <= 24; volt++) {
      graphCtx.lineTo(getX(volt), getY(currentAtV(volt)));
    }
    graphCtx.stroke();

    // Draw active point bubble
    const activeI = currentAtV(simState.circVoltage);
    const ptX = getX(simState.circVoltage);
    const ptY = getY(activeI);

    graphCtx.fillStyle = "#fd7e14";
    graphCtx.beginPath();
    graphCtx.arc(ptX, ptY, 6, 0, 2*Math.PI);
    graphCtx.fill();
    graphCtx.stroke();

    graphCtx.font = "bold 9px monospace";
    graphCtx.fillText(`(${simState.circVoltage}V, ${activeI.toFixed(3)}A)`, ptX, ptY - 10);
  } 
  
  else if (activeLabType === "vector") {
    // Component breakdown bar chart
    graphCtx.fillText("Komponen Vektor", 70, 15);

    const magA = simState.vectorAMag !== undefined ? simState.vectorAMag : 5;
    const angA = (simState.vectorAAngle !== undefined ? simState.vectorAAngle : 30) * Math.PI / 180;
    const magB = simState.vectorBMag !== undefined ? simState.vectorBMag : 7;
    const angB = (simState.vectorBAngle !== undefined ? simState.vectorBAngle : 120) * Math.PI / 180;

    const Ax = magA * Math.cos(angA);
    const Ay = magA * Math.sin(angA);
    const Bx = magB * Math.cos(angB);
    const By = magB * Math.sin(angB);
    const Rx = Ax + Bx;
    const Ry = Ay + By;

    // We have 6 component bars to draw: Ax, Bx, Rx and Ay, By, Ry
    // Center the components around the middle line of the graph (Y-axis zero-line)
    const midY = (h - 30) / 2 + 10;
    
    // Draw a horizontal zero line
    graphCtx.strokeStyle = isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.2)";
    graphCtx.lineWidth = 1.5;
    graphCtx.beginPath();
    graphCtx.moveTo(40, midY);
    graphCtx.lineTo(w - 10, midY);
    graphCtx.stroke();

    // Scale mapping: 1 unit = (h - 60) / 20 pixels
    const valScale = (h - 60) / 20;

    function drawBar(x, value, color, labelText) {
      const barH = value * valScale;
      graphCtx.fillStyle = color;
      if (barH >= 0) {
        // Draw upward
        graphCtx.fillRect(x, midY - barH, 20, barH);
      } else {
        // Draw downward
        graphCtx.fillRect(x, midY, 20, -barH);
      }
      
      // Draw label
      graphCtx.fillStyle = isDark ? "#fff" : "#0f172a";
      graphCtx.font = "8px monospace";
      graphCtx.textAlign = "center";
      graphCtx.fillText(value.toFixed(1), x + 10, midY - barH + (barH >= 0 ? -4 : 10));
      
      graphCtx.fillStyle = isDark ? "#94a3b8" : "#475569";
      graphCtx.fillText(labelText, x + 10, h - 15);
    }

    // X components
    const startX = 60;
    const spacing = 32;
    drawBar(startX, Ax, "#3b82f6", "Ax");
    drawBar(startX + spacing, Bx, "#10b981", "Bx");
    drawBar(startX + 2 * spacing, Rx, "#ef4444", "Rx");

    // Y components
    const startY = startX + 4 * spacing;
    drawBar(startY, Ay, "#3b82f6", "Ay");
    drawBar(startY + spacing, By, "#10b981", "By");
    drawBar(startY + 2 * spacing, Ry, "#ef4444", "Ry");

    // Divider line between X and Y components
    graphCtx.strokeStyle = isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)";
    graphCtx.beginPath();
    graphCtx.moveTo(startX + 3 * spacing + 10, 10);
    graphCtx.lineTo(startX + 3 * spacing + 10, h - 30);
    graphCtx.stroke();

    // Label for X and Y sections
    graphCtx.fillStyle = isDark ? "#cbd5e1" : "#1e293b";
    graphCtx.font = "bold 9px sans-serif";
    graphCtx.textAlign = "center";
    graphCtx.fillText("Komponen X", startX + 1.5 * spacing - 6, 25);
    graphCtx.fillText("Komponen Y", startY + 1.5 * spacing - 6, 25);
  }
  else {
    // Draw simple generic sine wave placeholder graph
    graphCtx.fillText("Waktu (s)", w - 30, h - 15);
    graphCtx.fillText("Output Nilai", 50, 15);

    graphCtx.strokeStyle = "#10b981";
    graphCtx.lineWidth = 2;
    graphCtx.beginPath();
    const period = w - 60;
    const amp = h - 50;

    graphCtx.moveTo(40, (h - 30) - 0.5 * amp);
    for (let x = 40; x < w - 20; x++) {
      const rad = ((x - 40) / period) * 4 * Math.PI;
      const yVal = 0.5 + 0.3 * Math.sin(rad - (simTime * 2));
      graphCtx.lineTo(x, (h - 30) - yVal * amp);
    }
    graphCtx.stroke();
  }
}

// Triggered on slider changes, saves values to local obs state
function triggerAutosave() {
  const user = window.auth.getCurrentUser();
  if (!user) return;
  
  const stateKey = `${DB_PREFIX}autosave_${user.id}_lab_${activeLabId}`;
  localStorage.setItem(stateKey, JSON.stringify(simState));
}

// Download canvas screenshot as PNG
function downloadGraphPNG() {
  if (!graphCanvasEl) return;
  
  const link = document.createElement("a");
  link.download = `grafik_lab_${activeLabId}.png`;
  link.href = graphCanvasEl.toDataURL("image/png");
  link.click();
  window.showToast("Grafik diunduh sebagai PNG.");
}

// Export canvas image triggers
window.renderLab = renderLab;
window.drawSimulation = drawSimulation;
window.drawGraph = drawGraph;
window.simState = simState;

let canvasDragInitialized = false;
let isDraggingCanvas = false;
let startDragX = 0;
let startDragY = 0;
let startVal = 0;

function setupCanvasDragEvents() {
  if (canvasDragInitialized) {
    if (canvasEl) {
      if (activeLabType === "measurement") {
        canvasEl.style.cursor = "grab";
      } else {
        canvasEl.style.cursor = "default";
      }
    }
    return;
  }
  canvasDragInitialized = true;

  if (!canvasEl) return;

  if (activeLabType === "measurement") {
    canvasEl.style.cursor = "grab";
  }

  const onDragStart = (clientX, clientY) => {
    if (activeLabType !== "measurement") return;
    
    isDraggingCanvas = true;
    startDragX = clientX;
    startDragY = clientY;
    
    if (canvasEl) canvasEl.style.cursor = "grabbing";
    
    const cat = simState.measurementCategory;
    const tool = simState.measurementTool;
    
    if (cat === "panjang") {
      startVal = simState.userCaliperPos;
    } else if (cat === "massa" && tool === "neraca_ohaus") {
      startVal = simState.userOhaus1;
    } else if (cat === "listrik") {
      startVal = simState.circVoltage;
    }
  };

  const onDragMove = (clientX, clientY) => {
    if (!isDraggingCanvas) return;
    
    const deltaX = clientX - startDragX;
    const cat = simState.measurementCategory;
    const tool = simState.measurementTool;
    
    if (cat === "panjang") {
      const maxVal = (tool === "micrometer" ? 25 : 40);
      const sens = (tool === "micrometer" ? 0.01 : 0.05);
      let newVal = startVal + deltaX * sens;
      newVal = Math.max(0, Math.min(maxVal, newVal));
      
      const step = (tool === "micrometer" ? 0.01 : (tool === "caliper" ? 0.1 : 1));
      simState.userCaliperPos = Math.round(newVal / step) * step;
      
      const slider = document.getElementById("slider-caliper-pos");
      if (slider) slider.value = simState.userCaliperPos;
      
      const badge = document.getElementById("badge-caliper-val");
      if (badge) {
        badge.textContent = simState.showReadingHelp ? simState.userCaliperPos.toFixed(tool === "micrometer" ? 2 : (tool === "caliper" ? 1 : 0)) + " mm" : "? mm";
      }
      
    } else if (cat === "massa" && tool === "neraca_ohaus") {
      let newVal = startVal + deltaX * 0.05;
      newVal = Math.max(0, Math.min(10, newVal));
      simState.userOhaus1 = Math.round(newVal / 0.1) * 0.1;
      
      const slider = document.getElementById("slider-ohaus-1");
      if (slider) slider.value = simState.userOhaus1;
      
      const badge = document.querySelector(".parameter-slider-group:nth-child(4) .parameter-value-badge");
      if (badge) {
        badge.textContent = simState.showReadingHelp ? simState.userOhaus1.toFixed(1) + " g" : "? g";
      }
      
    } else if (cat === "listrik") {
      let newVal = startVal + deltaX * 0.05;
      newVal = Math.max(1.5, Math.min(24, newVal));
      simState.circVoltage = Math.round(newVal / 0.5) * 0.5;
      
      if (simState.measurementSelectedObj === "voltmeter") {
        simState.measurementTargetVal = simState.circVoltage;
      } else {
        simState.measurementTargetVal = simState.circVoltage / simState.circResistance;
      }
      
      const slider = document.getElementById("slider-circ-volt");
      if (slider) slider.value = simState.circVoltage;
      
      const badge = document.querySelector(".parameter-slider-group:nth-child(2) .parameter-value-badge");
      if (badge) {
        badge.textContent = simState.showReadingHelp ? simState.circVoltage.toFixed(1) + " V" : "? V";
      }
    }
    
    drawSimulation();
  };

  const onDragEnd = () => {
    if (!isDraggingCanvas) return;
    isDraggingCanvas = false;
    if (canvasEl) {
      canvasEl.style.cursor = activeLabType === "measurement" ? "grab" : "default";
    }
  };

  canvasEl.addEventListener("mousedown", (e) => {
    onDragStart(e.clientX, e.clientY);
  });
  window.addEventListener("mousemove", (e) => {
    onDragMove(e.clientX, e.clientY);
  });
  window.addEventListener("mouseup", () => {
    onDragEnd();
  });

  canvasEl.addEventListener("touchstart", (e) => {
    if (e.touches.length > 0) {
      onDragStart(e.touches[0].clientX, e.touches[0].clientY);
    }
  }, { passive: true });
  window.addEventListener("touchmove", (e) => {
    if (e.touches.length > 0) {
      onDragMove(e.touches[0].clientX, e.touches[0].clientY);
    }
  }, { passive: true });
  window.addEventListener("touchend", () => {
    onDragEnd();
  });
}

// ============================================================================
// FIVIA REDESIGNED STANDALONE MEASUREMENT VIRTUAL LAB ENGINE
// ============================================================================

let measState = {
  activeTab: "caliper",          // Default to caliper so instrument appears immediately!
  activeBenda: "kelereng",       // "pensil", "kelereng", "baut", "ring", "tabung", "balok"
  activeMeasType: "diameter_luar", // "diameter_luar", "diameter_dalam", "kedalaman", "panjang"
  activePrecision: 0.05,         // 0.1, 0.05, 0.02 mm
  activeNoniusType: 20,          // 10, 20, 50
  playMode: "pembelajaran",      // "pembelajaran", "evaluasi"
  learningStep: 1,               // 1..7
  zoomLevel: 1.0,
  showLens: false,
  lensX: 0,
  lensY: 0,
  
  // Caliper Objects with realistic baseline dimensions
  caliperObjects: {
    pensil: {
      name: "Pensil Kayu",
      diameter_luar: 7.45,
      panjang: 54.30
    },
    kelereng: {
      name: "Kelereng Kaca",
      diameter_luar: 18.35
    },
    baut: {
      name: "Baut Silinder Logam",
      diameter_luar: 14.40,
      diameter_dalam: 8.60,
      kedalaman: 22.25,
      panjang: 42.50
    },
    ring: {
      name: "Cincin / Ring Logam",
      diameter_luar: 24.50,
      diameter_dalam: 16.35,
      kedalaman: 12.00
    },
    tabung: {
      name: "Tabung Silinder Berongga",
      diameter_luar: 28.40,
      diameter_dalam: 20.25,
      kedalaman: 34.50
    },
    balok: {
      name: "Balok Logam",
      panjang: 45.30,
      lebar: 24.50,
      tinggi: 14.20
    }
  },

  // Mistar & Micrometer target variables
  pensilLength: 17.2,            // cm (mistar)
  kelerengDiameter: 18.25,       // mm
  balokP: 12.4,                  // cm
  balokL: 5.6,                   // cm
  balokT: 3.22,                  // mm (micrometer)
  
  // Interactive coordinate states
  mistarX: 80,
  pencilX: 120,
  caliperGap: 0,                 // in mm (0 to 150 mm)
  micrometerGap: 15.0,           // in mm
  
  // Student inputs
  inputSU: "",
  inputSNLine: "",
  inputSN: "",
  inputTotal: "",
  
  // Recorded observation items
  results: [],
  activeBalokDimension: "panjang"
};

// Helper: Get target size for current caliper object & mode
function getCaliperTargetSize() {
  const objData = measState.caliperObjects[measState.activeBenda] || measState.caliperObjects["kelereng"];
  let target = 18.35;
  
  if (measState.activeMeasType === "diameter_luar") {
    target = objData.diameter_luar || objData.panjang || 18.35;
  } else if (measState.activeMeasType === "diameter_dalam") {
    target = objData.diameter_dalam || (objData.diameter_luar ? objData.diameter_luar * 0.65 : 12.50);
  } else if (measState.activeMeasType === "kedalaman") {
    target = objData.kedalaman || 20.00;
  } else if (measState.activeMeasType === "panjang") {
    target = objData.panjang || (objData.diameter_luar ? objData.diameter_luar * 2.5 : 45.00);
  }

  // Snap target to exact multiples of active precision for realistic coincidence
  const prec = measState.activePrecision || 0.05;
  const su = Math.floor(target);
  const frac = target - su;
  const k = Math.round(frac / prec);
  return Number((su + k * prec).toFixed(2));
}

function initRedesignedMeasurementLab() {
  const container = document.getElementById("lab-viewport-section");
  if (!container) return;

  const isGuru = window.auth && window.auth.getCurrentUser() && window.auth.getCurrentUser().role === "guru";

  container.innerHTML = `
    <style>
      .meas-nav-btn {
        width: 100%;
        text-align: left;
        padding: 10px 14px;
        background: transparent;
        border: none;
        color: #94a3b8;
        font-family: 'Poppins', sans-serif;
        font-weight: 500;
        font-size: 0.85rem;
        display: flex;
        align-items: center;
        gap: 10px;
        cursor: pointer;
        border-radius: 8px;
        transition: all 0.2s ease;
      }
      .meas-nav-btn:hover {
        background: rgba(255, 255, 255, 0.05);
        color: #fff;
      }
      .meas-nav-btn.active {
        background: var(--brand-orange);
        color: #050b18 !important;
        font-weight: 700;
        box-shadow: 0 4px 15px rgba(249, 115, 22, 0.3);
      }
      .lab-table-bg {
        background-color: #f8fafc;
        background-image: radial-gradient(#cbd5e1 1.5px, transparent 1.5px), radial-gradient(#cbd5e1 1.5px, #f8fafc 1.5px);
        background-size: 30px 30px;
        background-position: 0 0, 15px 15px;
      }
      .custom-card {
        background: #fff;
        border-radius: 10px;
        border: 1px solid #cbd5e1;
        box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
        padding: 16px;
      }
      .meas-calculator-input {
        width: 100%;
        padding: 6px 10px;
        border-radius: 6px;
        border: 1px solid #cbd5e1;
        font-size: 0.85rem;
        outline: none;
        font-family: monospace;
        font-weight: 600;
      }
      .meas-calculator-input:focus {
        border-color: var(--brand-blue);
        box-shadow: 0 0 0 3px rgba(15, 45, 89, 0.15);
      }
    </style>

    <div class="fivia-measurement-lab-container" style="display: flex; flex-direction: column; height: 100vh; max-height: 100vh; font-family: 'Poppins', sans-serif; background-color: #050b18; color: #f8fafc; overflow: hidden;">
      <!-- HEADER -->
      <div style="background-color: var(--brand-blue); padding: 8px 18px; border-bottom: 2px solid var(--brand-orange); display: flex; justify-content: space-between; align-items: center; box-shadow: 0 4px 15px rgba(0,0,0,0.3); z-index: 10; flex-shrink: 0;">
        <div>
          <h3 style="margin: 0; font-size: 1.15rem; font-weight: 800; color: #fff; display: flex; align-items: center; gap: 8px;">
            <svg viewBox="0 0 100 100" width="20" height="20" style="fill: none; stroke-linecap: round; stroke-linejoin: round;">
              <ellipse cx="50" cy="50" rx="40" ry="15" stroke="var(--brand-orange)" stroke-width="4" transform="rotate(30 50 50)" />
              <ellipse cx="50" cy="50" rx="40" ry="15" stroke="var(--accent-violet)" stroke-width="4" transform="rotate(-30 50 50)" />
              <path d="M35 38 L50 68 L65 38" stroke="var(--brand-orange)" stroke-width="8" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            FIVIA Virtual Lab: Pengukuran Dasar Fisika
          </h3>
        </div>
        <div style="display: flex; gap: 12px; align-items: center;">
          <div class="glass-panel" style="padding: 4px 10px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 6px; text-align: right;">
            <div id="meas-progress-text" style="font-size: 0.8rem; font-weight: bold; color: var(--brand-orange);">Benda Terukur: 0/3</div>
          </div>
          <a href="#materi" class="btn btn-secondary" style="padding: 5px 12px; font-size: 0.75rem; border-radius: 6px;"><i class="fas fa-arrow-left"></i> Peta Belajar</a>
        </div>
      </div>

      <div style="display: flex; flex: 1; overflow: hidden; max-height: calc(100vh - 50px);">
        <!-- SIDEBAR KIRI -->
        <div style="width: 200px; flex-shrink: 0; background-color: #0a1128; border-right: 1px solid rgba(255,255,255,0.08); display: flex; flex-direction: column; gap: 4px; padding: 10px 6px; overflow-y: auto;">
          <button class="meas-nav-btn active" id="btn-nav-caliper" onclick="switchMeasTab('caliper')"><i class="fas fa-drafting-compass"></i> Jangka Sorong</button>
          <button class="meas-nav-btn" id="btn-nav-mistar" onclick="switchMeasTab('mistar')"><i class="fas fa-ruler"></i> Mistar</button>
          <button class="meas-nav-btn" id="btn-nav-micrometer" onclick="switchMeasTab('micrometer')"><i class="fas fa-cogs"></i> Mikrometer Sekrup</button>
          <button class="meas-nav-btn" id="btn-nav-pengantar" onclick="switchMeasTab('pengantar')"><i class="fas fa-info-circle"></i> Petunjuk &amp; Info</button>
          <button class="meas-nav-btn" id="btn-nav-pengamatan" onclick="switchMeasTab('pengamatan')"><i class="fas fa-table"></i> Hasil Observasi</button>
          <button class="meas-nav-btn" id="btn-nav-lkpd" onclick="switchMeasTab('lkpd')"><i class="fas fa-file-invoice"></i> LKPD Digital</button>
          
          <!-- Guru Mode panel -->
          <div id="guru-config-panel" style="margin-top: auto; padding: 8px; border-top: 1px solid rgba(255,255,255,0.1); display: ${isGuru ? 'block' : 'none'};">
            <div style="font-size: 0.7rem; text-transform: uppercase; color: var(--brand-orange); font-weight: 700; margin-bottom: 6px;"><i class="fas fa-user-tie"></i> Guru</div>
            <button class="btn btn-outline" style="width:100%; font-size:0.68rem; padding:4px;" onclick="randomizeObjectSizes()">Acak Ukuran Benda</button>
          </div>
        </div>

        <!-- AREA UTAMA (ZERO-SCROLL VIEWPORT) -->
        <div style="flex: 1; display: flex; flex-direction: column; background-color: #f1f5f9; color: #1e293b; overflow: hidden; padding: 8px 12px;" id="meas-workspace-area">
          
          <!-- PENGANTAR VIEW -->
          <div id="meas-view-pengantar" class="meas-tab-view" style="display: flex; flex-direction: column; gap: 14px; max-width: 800px; margin: 0 auto; width: 100%; overflow-y: auto; padding: 10px;">
            <div class="custom-card" style="border-left: 5px solid var(--brand-blue); padding: 16px;">
              <h2 style="font-family: 'Poppins'; font-weight: 800; color: var(--brand-blue); margin-bottom: 6px; font-size: 1.3rem;">Pengukuran Dasar Fisika</h2>
              <p style="font-size: 0.88rem; line-height: 1.5; color: #475569; margin: 0;">
                Selamat datang di laboratorium virtual pengukuran dasar FIVIA. Silakan pilih menu **Jangka Sorong** pada sidebar kiri untuk mulai mengukur besaran panjang, diameter, dan kedalaman objek secara langsung.
              </p>
            </div>

            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px;">
              <div class="custom-card" style="padding: 14px;">
                <div style="font-size: 1.5rem; color: var(--brand-blue); margin-bottom: 6px;"><i class="fas fa-ruler"></i></div>
                <h5 style="font-weight: 700; margin-bottom: 4px;">Mistar (Penggaris)</h5>
                <p style="font-size: 0.75rem; color: #64748b; margin: 0;">Skala terkecil 1 mm (ketelitian 0.5 mm).</p>
              </div>
              <div class="custom-card" style="border-left: 3px solid var(--brand-orange); padding: 14px;">
                <div style="font-size: 1.5rem; color: var(--brand-orange); margin-bottom: 6px;"><i class="fas fa-drafting-compass"></i></div>
                <h5 style="font-weight: 700; margin-bottom: 4px;">Jangka Sorong</h5>
                <p style="font-size: 0.75rem; color: #64748b; margin: 0;">Ketelitian 0.1 mm, 0.05 mm, atau 0.02 mm.</p>
              </div>
              <div class="custom-card" style="padding: 14px;">
                <div style="font-size: 1.5rem; color: var(--accent-violet); margin-bottom: 6px;"><i class="fas fa-cogs"></i></div>
                <h5 style="font-weight: 700; margin-bottom: 4px;">Mikrometer Sekrup</h5>
                <p style="font-size: 0.75rem; color: #64748b; margin: 0;">Ketelitian presisi tinggi 0.01 mm.</p>
              </div>
            </div>

            <div class="custom-card" style="background-color: #e0f2fe; border-color: #bae6fd; padding: 14px;">
              <button class="btn btn-primary" style="font-family: 'Poppins'; font-weight: 700; font-size: 0.85rem;" onclick="switchMeasTab('caliper')"><i class="fas fa-play"></i> Buka Simulasi Jangka Sorong</button>
            </div>
          </div>

          <!-- SIMULATOR VIEW (FULL SCREEN IMMERSIVE WITHOUT SCROLLING) -->
          <div id="meas-view-simulator" class="meas-tab-view" style="display: none; flex-direction: column; gap: 6px; width: 100%; height: 100%; max-height: 100%; overflow: hidden;">
            
            <!-- ULTRA-COMPACT TOOLBAR -->
            <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 6px; background: #fff; padding: 6px 12px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.04); border: 1px solid #e2e8f0; flex-shrink: 0;">
              
              <!-- Instrument Specs & Type -->
              <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
                <span id="meas-tool-title" style="font-size: 0.85rem; font-weight: 800; color: var(--brand-blue);"><i class="fas fa-drafting-compass"></i> Jangka Sorong</span>
                <span class="caliper-precision-badge" id="caliper-precision-indicator" style="padding: 2px 8px; font-size: 0.72rem;"><i class="fas fa-bullseye"></i> 0.05 mm</span>
                
                <!-- Caliper Mode Switcher -->
                <div id="caliper-types-bar" style="display: inline-flex; gap: 4px; align-items: center; margin-left: 6px;">
                  <button class="meas-chip-btn active-orange" id="btn-type-diameter_luar" style="padding: 4px 8px; font-size: 0.72rem;" onclick="switchMeasType('diameter_luar')">D. Luar</button>
                  <button class="meas-chip-btn" id="btn-type-diameter_dalam" style="padding: 4px 8px; font-size: 0.72rem;" onclick="switchMeasType('diameter_dalam')">D. Dalam</button>
                  <button class="meas-chip-btn" id="btn-type-kedalaman" style="padding: 4px 8px; font-size: 0.72rem;" onclick="switchMeasType('kedalaman')">Kedalaman</button>
                  <button class="meas-chip-btn" id="btn-type-panjang" style="padding: 4px 8px; font-size: 0.72rem;" onclick="switchMeasType('panjang')">Panjang</button>
                </div>
              </div>

              <!-- Objek Selector Chips -->
              <div id="caliper-objects-bar" style="display: inline-flex; align-items: center; gap: 4px; flex-wrap: wrap;">
                <button class="meas-chip-btn active" id="btn-benda-kelereng" style="padding: 4px 8px; font-size: 0.72rem;" onclick="selectBenda('kelereng')">Kelereng</button>
                <button class="meas-chip-btn" id="btn-benda-pensil" style="padding: 4px 8px; font-size: 0.72rem;" onclick="selectBenda('pensil')">Pensil</button>
                <button class="meas-chip-btn" id="btn-benda-baut" style="padding: 4px 8px; font-size: 0.72rem;" onclick="selectBenda('baut')">Baut</button>
                <button class="meas-chip-btn" id="btn-benda-ring" style="padding: 4px 8px; font-size: 0.72rem;" onclick="selectBenda('ring')">Ring</button>
                <button class="meas-chip-btn" id="btn-benda-tabung" style="padding: 4px 8px; font-size: 0.72rem;" onclick="selectBenda('tabung')">Tabung</button>
                <button class="meas-chip-btn" id="btn-benda-balok" style="padding: 4px 8px; font-size: 0.72rem;" onclick="selectBenda('balok')">Balok</button>
              </div>

              <!-- Nonius & Learning Mode Toggle -->
              <div style="display: flex; align-items: center; gap: 6px;">
                <div id="caliper-nonius-bar" style="display: inline-flex; gap: 3px;">
                  <button class="meas-chip-btn" id="btn-nonius-10" style="padding: 3px 6px; font-size: 0.7rem;" onclick="switchNoniusType(10)">10 (0.1)</button>
                  <button class="meas-chip-btn active" id="btn-nonius-20" style="padding: 3px 6px; font-size: 0.7rem;" onclick="switchNoniusType(20)">20 (0.05)</button>
                  <button class="meas-chip-btn" id="btn-nonius-50" style="padding: 3px 6px; font-size: 0.7rem;" onclick="switchNoniusType(50)">50 (0.02)</button>
                </div>
                <button class="meas-chip-btn active" id="btn-mode-pembelajaran" style="padding: 4px 8px; font-size: 0.72rem;" onclick="switchPlayMode('pembelajaran')"><i class="fas fa-graduation-cap"></i> Belajar</button>
                <button class="meas-chip-btn" id="btn-mode-evaluasi" style="padding: 4px 8px; font-size: 0.72rem;" onclick="switchPlayMode('evaluasi')"><i class="fas fa-clipboard-check"></i> Evaluasi</button>
                <button class="btn btn-secondary" style="padding: 4px 8px; font-size: 0.72rem;" onclick="snapCaliperToObject()" title="Snap Rahang ke Benda"><i class="fas fa-bullseye"></i> Snap</button>
                <button class="btn btn-outline" id="btn-toggle-lens" style="padding: 4px 8px; font-size: 0.72rem;" onclick="toggleZoomLens()" title="Lensa Pembesar"><i class="fas fa-search"></i> 🔍</button>
                <button class="btn btn-outline" style="padding: 4px 8px; font-size: 0.72rem;" onclick="randomizeObjectSizes()" title="Acak Ukuran Benda"><i class="fas fa-random"></i></button>
                <button class="btn btn-danger" style="padding: 4px 8px; font-size: 0.72rem;" onclick="resetActiveSimulator()" title="Reset"><i class="fas fa-undo"></i></button>
              </div>

            </div>

            <!-- ENLARGED CANVAS CONTAINER (Fills available space directly without scrolling) -->
            <div style="flex: 1; width: 100%; min-height: 380px; display: flex; flex-direction: column; justify-content: center; align-items: center; position: relative; background: #ffffff; border-radius: 10px; border: 1px solid #cbd5e1; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); overflow: hidden;" id="meas-canvas-wrapper">
              <canvas id="meas-canvas" width="1000" height="460" style="width: 100%; height: 100%; max-height: 100%; object-fit: contain; display: block;"></canvas>
              
              <!-- Floating Zoom Lens overlay -->
              <div id="meas-zoom-lens" style="position: absolute; pointer-events: none; border: 3px solid #0f2d59; border-radius: 12px; width: 260px; height: 140px; box-shadow: 0 12px 32px rgba(0,0,0,0.4); background-color: #ffffff; display: none; overflow: hidden; z-index: 100;">
                <canvas id="meas-zoom-canvas" width="260" height="140" style="display: block; width: 100%; height: 100%;"></canvas>
                <div style="position: absolute; bottom: 0; left: 0; right: 0; background: rgba(15,45,89,0.95); color: #fff; font-size: 0.65rem; text-align: center; padding: 2px; font-weight: bold; font-family: sans-serif;">LENSA PEMBESAR SKALA 🔍 (4×)</div>
              </div>
            </div>

            <!-- INTERACTIVE DIRECT CONTROL & STEPPER BAR -->
            <div id="meas-direct-control-bar" style="display: flex; align-items: center; justify-content: space-between; gap: 8px; background: #f8fafc; padding: 6px 12px; border-radius: 8px; border: 1px solid #cbd5e1; flex-shrink: 0;">
              <!-- Left info / live indicator -->
              <div style="display: flex; align-items: center; gap: 8px;">
                <span style="font-size: 0.75rem; font-weight: 700; color: #334155; white-space: nowrap;" id="meas-control-label"><i class="fas fa-arrows-alt-h"></i> Geser Rahang:</span>
                <span class="badge" id="meas-live-value-badge" style="background: var(--brand-blue); color: #fff; font-family: monospace; font-size: 0.8rem; padding: 3px 8px; border-radius: 4px; font-weight: 700;">0.00 mm</span>
              </div>

              <!-- Center Quick Stepper Buttons & Range Slider -->
              <div style="display: flex; align-items: center; gap: 4px; flex: 1; max-width: 520px; justify-content: center;">
                <button type="button" class="btn btn-outline" style="padding: 3px 7px; font-size: 0.72rem; font-weight: bold; background: #fff;" onclick="stepActiveMeasurement(-1)" id="btn-step-large-minus">-1.0</button>
                <button type="button" class="btn btn-outline" style="padding: 3px 7px; font-size: 0.72rem; font-weight: bold; background: #fff;" onclick="stepActiveMeasurement(-0.1)" id="btn-step-med-minus">-0.1</button>
                <button type="button" class="btn btn-outline" style="padding: 3px 7px; font-size: 0.72rem; font-weight: bold; background: #fff;" onclick="stepActiveMeasurement(-0.05)" id="btn-step-fine-minus">-0.05</button>
                
                <input type="range" id="meas-live-range-slider" min="0" max="140" step="0.05" value="0" style="flex: 1; min-width: 140px; height: 6px; cursor: pointer; accent-color: var(--brand-orange);" oninput="onLiveSliderInput(this.value)">
                
                <button type="button" class="btn btn-outline" style="padding: 3px 7px; font-size: 0.72rem; font-weight: bold; background: #fff;" onclick="stepActiveMeasurement(0.05)" id="btn-step-fine-plus">+0.05</button>
                <button type="button" class="btn btn-outline" style="padding: 3px 7px; font-size: 0.72rem; font-weight: bold; background: #fff;" onclick="stepActiveMeasurement(0.1)" id="btn-step-med-plus">+0.1</button>
                <button type="button" class="btn btn-outline" style="padding: 3px 7px; font-size: 0.72rem; font-weight: bold; background: #fff;" onclick="stepActiveMeasurement(1)" id="btn-step-large-plus">+1.0</button>
              </div>

              <!-- Right Actions: Snap to object / Auto-Fit -->
              <div style="display: flex; align-items: center; gap: 6px;">
                <button type="button" class="btn btn-primary" style="padding: 4px 10px; font-size: 0.74rem; font-weight: bold;" onclick="snapActiveToolToObject()" id="btn-snap-tool" title="Rapatkan otomatis alat ukur pada objek"><i class="fas fa-magnet"></i> Rapatkan ke Benda</button>
                <button type="button" class="btn btn-outline" style="padding: 4px 8px; font-size: 0.74rem;" onclick="resetActiveSimulator()" title="Kembalikan ke posisi awal"><i class="fas fa-undo"></i></button>
              </div>
            </div>

            <!-- COMPACT HORIZONTAL VERIFICATION DOCK (Sits neatly at bottom without vertical scrolling) -->
            <div style="background: #ffffff; border-radius: 8px; border: 1px solid #cbd5e1; padding: 8px 14px; box-shadow: 0 2px 4px rgba(0,0,0,0.04); flex-shrink: 0;">
              <form id="form-meas-calculator" onsubmit="handleMeasCalculatorSubmit(event)" style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px;">
                <!-- Inputs dynamic depending on active tool -->
              </form>
              <div id="meas-ai-hint-box" style="display: none; margin-top: 6px; background-color: #f5f3ff; border-left: 3px solid var(--accent-violet); padding: 6px 10px; border-radius: 6px; font-size: 0.78rem;"></div>
            </div>

          </div>

          <!-- HASIL PENGAMATAN VIEW -->
          <div id="meas-view-pengamatan" class="meas-tab-view" style="display: none; flex-direction: column; gap: 14px; overflow-y: auto; height: 100%; padding: 10px;">
            <div class="custom-card">
              <h4 style="font-family: 'Poppins'; font-weight: 700; color: var(--brand-blue); margin-bottom: 8px; display: flex; align-items: center; gap: 8px;"><i class="fas fa-table"></i> Tabel Data Observasi Terukur</h4>
              
              <div class="table-responsive">
                <table class="lkpd-obs-table" style="width: 100%; border-collapse: collapse;">
                  <thead>
                    <tr style="background-color: var(--accent-blue-light); color: var(--brand-blue);">
                      <th style="padding: 8px; border: 1px solid #cbd5e1; font-size: 0.8rem;">No</th>
                      <th style="padding: 8px; border: 1px solid #cbd5e1; font-size: 0.8rem;">Benda</th>
                      <th style="padding: 8px; border: 1px solid #cbd5e1; font-size: 0.8rem;">Jenis Pengukuran</th>
                      <th style="padding: 8px; border: 1px solid #cbd5e1; font-size: 0.8rem;">Ketelitian</th>
                      <th style="padding: 8px; border: 1px solid #cbd5e1; font-size: 0.8rem;">Hasil Siswa</th>
                      <th style="padding: 8px; border: 1px solid #cbd5e1; font-size: 0.8rem;">Hasil Benar</th>
                      <th style="padding: 8px; border: 1px solid #cbd5e1; font-size: 0.8rem;">Status</th>
                      <th style="padding: 8px; border: 1px solid #cbd5e1; font-size: 0.8rem;">Aksi</th>
                    </tr>
                  </thead>
                  <tbody id="meas-results-table-body">
                    <tr><td colspan="8" style="text-align: center; color: var(--text-secondary); padding: 16px;">Belum ada data observasi yang dicatat.</td></tr>
                  </tbody>
                </table>
              </div>

              <!-- Automated feedback comments analysis block -->
              <div id="meas-analysis-feedback-card" class="glass-panel" style="padding: 12px; margin-top: 16px; border-left: 4px solid var(--brand-orange); display: none; background: #fff;">
                <h6 style="margin: 0 0 4px 0; color: var(--brand-blue); font-weight: 700;"><i class="fas fa-brain"></i> Analisis Feedback Akurasi</h6>
                <p id="meas-analysis-feedback-text" style="font-size: 0.8rem; line-height: 1.4; color: #475569; margin: 0;"></p>
          </div>

          <!-- LKPD DIGITAL VIEW -->
          <div id="meas-view-lkpd" class="meas-tab-view" style="display: none; flex-direction: column; gap: 20px; max-width: 800px; margin: 0 auto; width: 100%;">
            <div class="custom-card">
              <h3 style="font-family: 'Poppins'; font-weight: 800; color: var(--brand-blue); margin-bottom: 12px; border-bottom: 2px solid var(--brand-orange); padding-bottom: 8px;">FIVIA Digital LKPD</h3>
              
              <div style="background-color: var(--bg-primary); padding: 12px 16px; border-radius: 8px; margin-bottom: 20px; font-size: 0.8rem; display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 8px;">
                <span><strong>Nama Siswa:</strong> <span id="meas-lkpd-student-name">Loading...</span></span>
                <span><strong>Kelas:</strong> <span id="meas-lkpd-student-class">Loading...</span></span>
                <span><strong>Tanggal:</strong> <span id="meas-lkpd-student-date">Loading...</span></span>
              </div>

              <div class="form-group" style="margin-bottom: 20px;">
                <label style="font-weight: 700; font-size: 0.9rem; margin-bottom: 6px; display: block;"><i class="fas fa-bullseye" style="color: var(--brand-blue);"></i> Tujuan Pembelajaran</label>
                <p style="font-size: 0.85rem; color: #475569; line-height: 1.5; background: #f8fafc; padding: 10px 14px; border-radius: 6px; border: 1px solid #e2e8f0; margin: 0;">
                  Melalui simulasi ini, siswa diharapkan terampil menggunakan Jangka Sorong, Mistar, dan Mikrometer Sekrup secara baik dan benar untuk mengukur diameter luar, diameter dalam, kedalaman, dan panjang benda fisik serta menganalisis hasil ketelitiannya secara ilmiah.
                </p>
              </div>

              <div class="form-group" style="margin-bottom: 20px;">
                <label for="lkpd-meas-hypothesis" style="font-weight: 700; font-size: 0.9rem; margin-bottom: 6px; display: block;"><i class="fas fa-lightbulb" style="color: var(--brand-orange);"></i> Hipotesis Eksperimen</label>
                <textarea class="lkpd-textarea" id="lkpd-meas-hypothesis" placeholder="Tuliskan dugaan atau hipotesis awal Anda mengenai perbedaan ketelitian dari pembagian skala nonius jangka sorong dan alat ukur lainnya..."></textarea>
              </div>

              <!-- Observations tables block -->
              <div style="margin-bottom: 24px;">
                <label style="font-weight: 700; font-size: 0.9rem; margin-bottom: 6px; display: block;"><i class="fas fa-table" style="color: var(--success);"></i> Hasil Pengukuran Terverifikasi</label>
                <div class="table-responsive">
                  <table class="lkpd-obs-table" style="width: 100%; border-collapse: collapse; background: #fff;">
                    <thead>
                      <tr style="background-color: #f1f5f9; color: #475569;">
                        <th style="padding: 8px; border: 1px solid #cbd5e1; font-size: 0.8rem;">Benda</th>
                        <th style="padding: 8px; border: 1px solid #cbd5e1; font-size: 0.8rem;">Jenis Pengukuran</th>
                        <th style="padding: 8px; border: 1px solid #cbd5e1; font-size: 0.8rem;">Alat &amp; Ketelitian</th>
                        <th style="padding: 8px; border: 1px solid #cbd5e1; font-size: 0.8rem;">Hasil Pembacaan</th>
                        <th style="padding: 8px; border: 1px solid #cbd5e1; font-size: 0.8rem;">Status</th>
                      </tr>
                    </thead>
                    <tbody id="meas-lkpd-table-body">
                      <tr><td colspan="5" style="text-align: center; color: var(--text-secondary); padding: 12px; font-size: 0.8rem;">Belum ada data pengamatan yang dicatat.</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div class="form-group" style="margin-bottom: 20px;">
                <label for="lkpd-meas-analysis" style="font-weight: 700; font-size: 0.9rem; margin-bottom: 6px; display: block;"><i class="fas fa-chart-bar" style="color: var(--accent-violet);"></i> Analisis Data &amp; Pembahasan</label>
                <textarea class="lkpd-textarea" id="lkpd-meas-analysis" placeholder="Bandingkan tingkat ketelitian nonius (10 skala vs 20 skala vs 50 skala). Jelaskan cara menentukan garis nonius yang berimpit dengan skala utama..."></textarea>
              </div>

              <div class="form-group" style="margin-bottom: 24px;">
                <label for="lkpd-meas-conclusion" style="font-weight: 700; font-size: 0.9rem; margin-bottom: 6px; display: block;"><i class="fas fa-pencil-alt" style="color: var(--brand-blue);"></i> Kesimpulan</label>
                <textarea class="lkpd-textarea" id="lkpd-meas-conclusion" placeholder="Tuliskan kesimpulan akhir Anda mengenai peranan jangka sorong dalam pengukuran teknik presisi tinggi..."></textarea>
              </div>

              <button class="btn btn-orange" style="width: 100%; font-family: 'Poppins'; font-weight: 700; font-size: 0.95rem; padding: 12px;" onclick="submitRedesignedLKPD()"><i class="fas fa-paper-plane"></i> Kirim Laporan LKPD Digital</button>
            </div>
          </div>

        </div>
      </div>
    </div>
  `;

  // Pre-fill user data into LKPD
  const currentUser = window.auth && window.auth.getCurrentUser();
  if (currentUser) {
    document.getElementById("meas-lkpd-student-name").textContent = currentUser.name;
    document.getElementById("meas-lkpd-student-class").textContent = currentUser.classId ? currentUser.classId.toUpperCase().replace("CLS_", "Kelas ") : "Kelas X";
    document.getElementById("meas-lkpd-student-date").textContent = new Date().toLocaleDateString("id-ID");
  }

  // Load results from window database if exists
  const prevSub = window.db.getLKPDSubmission(currentUser ? currentUser.id : "usr_student", 2);
  if (prevSub && prevSub.answers && prevSub.answers.results) {
    measState.results = prevSub.answers.results;
  } else {
    measState.results = [];
  }
  
  updateMeasResultsUI();

  // Setup dynamic object dimensions on start
  randomizeObjectSizes();

  // Initialize event bindings for canvas and drag triggers
  setupMeasCanvasEvents();

  // Activate default caliper tab directly so the instrument is immediately visible!
  switchMeasTab("caliper");
}

function switchMeasTab(tabId) {
  measState.activeTab = tabId;
  
  // Highlight sidebar active state
  document.querySelectorAll(".meas-nav-btn").forEach(btn => {
    btn.classList.remove("active");
  });
  const activeBtn = document.getElementById(`btn-nav-${tabId}`);
  if (activeBtn) activeBtn.classList.add("active");

  // Show/Hide page panels
  document.querySelectorAll(".meas-tab-view").forEach(panel => {
    panel.style.display = "none";
  });

  if (tabId === "pengantar") {
    const pEl = document.getElementById("meas-view-pengantar");
    if (pEl) pEl.style.display = "flex";
  } else if (tabId === "pengamatan") {
    const obsEl = document.getElementById("meas-view-pengamatan");
    if (obsEl) obsEl.style.display = "flex";
    updateMeasResultsUI();
  } else if (tabId === "lkpd") {
    const lkpdEl = document.getElementById("meas-view-lkpd");
    if (lkpdEl) lkpdEl.style.display = "flex";
    updateMeasResultsUI();
  } else {
    // Simulator tabs: caliper, mistar, micrometer
    const simView = document.getElementById("meas-view-simulator");
    if (simView) simView.style.display = "flex";
    
    // Toggle Caliper vs General Controls row
    const caliperTypes = document.getElementById("caliper-types-bar");
    const caliperObjects = document.getElementById("caliper-objects-bar");
    const caliperNonius = document.getElementById("caliper-nonius-bar");
    const precisionBadge = document.getElementById("caliper-precision-indicator");
    const titleEl = document.getElementById("meas-tool-title");

    if (tabId === "caliper") {
      if (titleEl) titleEl.innerHTML = `<i class="fas fa-drafting-compass"></i> Jangka Sorong`;
      if (precisionBadge) {
        precisionBadge.style.display = "inline-flex";
        precisionBadge.innerHTML = `<i class="fas fa-bullseye"></i> Ketelitian: ${measState.activePrecision} mm`;
      }
      if (caliperTypes) caliperTypes.style.display = "inline-flex";
      if (caliperObjects) caliperObjects.style.display = "inline-flex";
      if (caliperNonius) caliperNonius.style.display = "inline-flex";
      selectBenda("kelereng");
    } else if (tabId === "mistar") {
      if (titleEl) titleEl.innerHTML = `<i class="fas fa-ruler"></i> Mistar (Penggaris)`;
      if (precisionBadge) {
        precisionBadge.style.display = "inline-flex";
        precisionBadge.innerHTML = `<i class="fas fa-bullseye"></i> Skala Terkecil: 1 mm`;
      }
      if (caliperTypes) caliperTypes.style.display = "none";
      if (caliperObjects) caliperObjects.style.display = "inline-flex";
      if (caliperNonius) caliperNonius.style.display = "none";
      selectBenda("pensil");
    } else if (tabId === "micrometer") {
      if (titleEl) titleEl.innerHTML = `<i class="fas fa-cogs"></i> Mikrometer Sekrup`;
      if (precisionBadge) {
        precisionBadge.style.display = "inline-flex";
        precisionBadge.innerHTML = `<i class="fas fa-bullseye"></i> Ketelitian: 0.01 mm`;
      }
      if (caliperTypes) caliperTypes.style.display = "none";
      if (caliperObjects) caliperObjects.style.display = "inline-flex";
      if (caliperNonius) caliperNonius.style.display = "none";
      selectBenda("balok");
    }

    renderCalculatorInputs();
    drawActiveSimulator();
  }
}

function switchMeasType(type) {
  measState.activeMeasType = type;
  
  // Update button highlights
  const types = ["diameter_luar", "diameter_dalam", "kedalaman", "panjang"];
  types.forEach(t => {
    const btn = document.getElementById(`btn-type-${t}`);
    if (btn) {
      btn.classList.toggle("active-orange", t === type);
      btn.classList.toggle("active", false);
    }
  });

  // Adjust suitable default benda for the chosen mode if needed
  if (type === "diameter_dalam" && (measState.activeBenda === "pensil" || measState.activeBenda === "kelereng")) {
    selectBenda("ring");
  } else if (type === "kedalaman" && (measState.activeBenda === "pensil" || measState.activeBenda === "kelereng")) {
    selectBenda("tabung");
  } else {
    selectBenda(measState.activeBenda);
  }
}

function switchNoniusType(divCount) {
  measState.activeNoniusType = divCount;
  if (divCount === 10) measState.activePrecision = 0.1;
  else if (divCount === 20) measState.activePrecision = 0.05;
  else if (divCount === 50) measState.activePrecision = 0.02;

  // Update button highlights
  [10, 20, 50].forEach(n => {
    const btn = document.getElementById(`btn-nonius-${n}`);
    if (btn) btn.classList.toggle("active", n === divCount);
  });

  // Update precision indicator badge
  const badge = document.getElementById("caliper-precision-indicator");
  if (badge) {
    badge.innerHTML = `<i class="fas fa-bullseye"></i> Ketelitian: ${measState.activePrecision} mm (${divCount} Skala)`;
  }

  // Quantize existing target sizes to the new precision
  const target = getCaliperTargetSize();
  const targetSizeEl = document.getElementById("meas-benda-target-size");
  if (targetSizeEl) {
    targetSizeEl.textContent = `Target Fisis: ${target.toFixed(2)} mm (Mode Guru)`;
  }

  renderCalculatorInputs();
  drawActiveSimulator();
}

function selectBenda(bendaId) {
  measState.activeBenda = bendaId;
  
  // Update button active highlights
  document.querySelectorAll(".meas-chip-btn").forEach(btn => {
    if (btn.id.startsWith("btn-benda-") || btn.id.startsWith("btn-gen-")) {
      btn.classList.remove("active");
    }
  });
  const activeBtn = document.getElementById(`btn-benda-${bendaId}`) || document.getElementById(`btn-gen-${bendaId}`);
  if (activeBtn) activeBtn.classList.add("active");

  // Toggle balok selector
  const selector = document.getElementById("meas-balok-dimension-selector");
  if (selector) {
    selector.style.display = (bendaId === "balok" && measState.activeTab !== "caliper") ? "inline-block" : "none";
  }

  // Update headers depending on active tool and object
  const headerTitle = document.getElementById("meas-tool-title");
  let toolLabel = "Mistar";
  let targetDesc = "";

  if (measState.activeTab === "mistar") {
    toolLabel = "Mistar Realistis";
    if (bendaId === "pensil") {
      targetDesc = `Panjang Pensil: ${measState.pensilLength.toFixed(1)} cm`;
    } else if (bendaId === "kelereng") {
      targetDesc = `Diameter Kelereng: ${(measState.kelerengDiameter / 10).toFixed(2)} cm`;
    } else if (bendaId === "balok") {
      targetDesc = measState.activeBalokDimension === "panjang" 
        ? `Panjang Balok: ${measState.balokP.toFixed(1)} cm`
        : measState.activeBalokDimension === "lebar" 
        ? `Lebar Balok: ${measState.balokL.toFixed(1)} cm`
        : `Tebal Balok: ${measState.balokT.toFixed(2)} mm`;
    }
  } else if (measState.activeTab === "caliper") {
    toolLabel = "Jangka Sorong Stainless Steel";
    const targetVal = getCaliperTargetSize();
    const typeLabel = measState.activeMeasType === "diameter_luar" ? "Diameter Luar" :
                      measState.activeMeasType === "diameter_dalam" ? "Diameter Dalam" :
                      measState.activeMeasType === "kedalaman" ? "Kedalaman" : "Panjang";
    const objName = (measState.caliperObjects[bendaId] && measState.caliperObjects[bendaId].name) || bendaId;
    targetDesc = `${typeLabel} ${objName}: ${targetVal.toFixed(2)} mm`;
  } else if (measState.activeTab === "micrometer") {
    toolLabel = "Mikrometer Logam Presisi";
    if (bendaId === "pensil") {
      targetDesc = `Tebal Pensil: 7.50 mm`;
    } else if (bendaId === "kelereng") {
      targetDesc = `Diameter Kelereng: ${measState.kelerengDiameter.toFixed(2)} mm`;
    } else if (bendaId === "balok") {
      targetDesc = `Tebal Balok: ${measState.balokT.toFixed(2)} mm`;
    }
  }

  if (headerTitle) {
    headerTitle.innerHTML = `<i class="fas fa-drafting-compass"></i> ${toolLabel}`;
  }

  const targetSizeEl = document.getElementById("meas-benda-target-size");
  if (targetSizeEl) {
    targetSizeEl.textContent = `Target Fisis: ${targetDesc} (Mode Guru)`;
  }

  // Update calculator UI inputs
  renderCalculatorInputs();
  
  // Clear AI advice box
  const hintBox = document.getElementById("meas-ai-hint-box");
  if (hintBox) hintBox.style.display = "none";

  // Re-draw simulator
  drawActiveSimulator();
}

function snapCaliperToObject() {
  const target = getCaliperTargetSize();
  measState.caliperGap = target;
  drawActiveSimulator();
  if (window.showToast) {
    window.showToast(`Rahang jangka sorong otomatis merapat tepat pada benda (${target.toFixed(2)} mm)!`, "success");
  }
}

function stepCaliperGap(deltaMM) {
  const newGap = Math.max(0, Math.min(140, Number((measState.caliperGap + deltaMM).toFixed(2))));
  measState.caliperGap = newGap;
  drawActiveSimulator();
}

function switchBalokDimension(dim) {
  measState.activeBalokDimension = dim;
  selectBenda("balok");
}

function switchPlayMode(mode) {
  measState.playMode = mode;
  const btnBelajar = document.getElementById("btn-mode-pembelajaran");
  const btnEval = document.getElementById("btn-mode-evaluasi");
  if (btnBelajar) btnBelajar.classList.toggle("active", mode === "pembelajaran");
  if (btnEval) btnEval.classList.toggle("active", mode === "evaluasi");
  
  const statusEl = document.getElementById("meas-eval-mode-status");
  if (statusEl) {
    statusEl.textContent = mode === "pembelajaran" ? "Mode: Pembelajaran (Garis Bantu Aktif)" : "Mode: Evaluasi (Membaca Mandiri)";
  }

  const learningTracker = document.getElementById("meas-learning-tracker");
  if (learningTracker) {
    learningTracker.style.display = (mode === "pembelajaran" && measState.activeTab === "caliper") ? "flex" : "none";
  }

  drawActiveSimulator();
}

function adjustMeasZoom(delta) {
  measState.zoomLevel = Math.max(0.7, Math.min(2.2, measState.zoomLevel + delta));
  drawActiveSimulator();
}

function toggleZoomLens() {
  measState.showLens = !measState.showLens;
  const btn = document.getElementById("btn-toggle-lens");
  if (btn) {
    btn.classList.toggle("active", measState.showLens);
    btn.innerHTML = measState.showLens ? `<i class="fas fa-search-minus"></i> Tutup Lensa` : `<i class="fas fa-search"></i> Lensa Pembesar`;
  }
  const lens = document.getElementById("meas-zoom-lens");
  if (lens) {
    lens.style.display = measState.showLens ? "block" : "none";
  }
  drawActiveSimulator();
}

function randomizeObjectSizes(notify = false) {
  const prec = measState.activePrecision || 0.05;
  const quantize = (min, max) => {
    const raw = min + Math.random() * (max - min);
    return Number((Math.round(raw / prec) * prec).toFixed(2));
  };

  measState.caliperObjects.pensil.diameter_luar = quantize(6.5, 9.5);
  measState.caliperObjects.pensil.panjang = quantize(45.0, 75.0);
  measState.caliperObjects.kelereng.diameter_luar = quantize(14.0, 24.0);
  measState.caliperObjects.baut.diameter_luar = quantize(12.0, 18.0);
  measState.caliperObjects.baut.diameter_dalam = quantize(7.0, 11.0);
  measState.caliperObjects.baut.kedalaman = quantize(16.0, 28.0);
  measState.caliperObjects.ring.diameter_luar = quantize(20.0, 30.0);
  measState.caliperObjects.ring.diameter_dalam = quantize(13.0, 19.0);
  measState.caliperObjects.ring.kedalaman = quantize(10.0, 16.0);
  measState.caliperObjects.tabung.diameter_luar = quantize(24.0, 34.0);
  measState.caliperObjects.tabung.diameter_dalam = quantize(17.0, 23.0);
  measState.caliperObjects.tabung.kedalaman = quantize(25.0, 42.0);
  measState.caliperObjects.balok.panjang = quantize(35.0, 60.0);
  measState.caliperObjects.balok.lebar = quantize(18.0, 30.0);
  measState.caliperObjects.balok.tinggi = quantize(10.0, 18.0);

  // Other instruments
  measState.pensilLength = Number((14.5 + Math.random() * 5.0).toFixed(1)); // cm
  measState.kelerengDiameter = quantize(15.0, 23.0); // mm
  measState.balokP = Number((11.0 + Math.random() * 4.0).toFixed(1)); // cm
  measState.balokL = Number((5.0 + Math.random() * 3.0).toFixed(1)); // cm
  measState.balokT = quantize(2.0, 5.5); // mm
  
  resetActiveSimulator();
  selectBenda(measState.activeBenda);
  if (notify && window.showToast) {
    window.showToast("Dimensi benda berhasil diacak secara matematis & realistis!", "success");
  }
}

function resetActiveSimulator() {
  measState.mistarX = 40;
  measState.pencilX = 80;
  measState.caliperGap = 0; // Starts closed flush
  measState.micrometerGap = 15.0; // starts open
  
  // Clear inputs
  measState.inputSU = "";
  measState.inputSNLine = "";
  measState.inputSN = "";
  measState.inputTotal = "";
  
  const form = document.getElementById("form-meas-calculator");
  if (form && typeof form.reset === "function") form.reset();

  drawActiveSimulator();
}

function updateGuruSettings() {
  const precSelect = document.getElementById("guru-caliper-precision");
  if (precSelect) {
    const val = parseFloat(precSelect.value);
    if (val === 0.1) switchNoniusType(10);
    else if (val === 0.05) switchNoniusType(20);
    else if (val === 0.02) switchNoniusType(50);
  }

  const modeSelect = document.getElementById("guru-mode-select");
  if (modeSelect) {
    switchPlayMode(modeSelect.value);
  }
}

// ----------------- DRAW CALCULATOR FORM INPUTS -----------------
function renderCalculatorInputs() {
  const container = document.getElementById("form-meas-calculator");
  if (!container) return;

  const precisionText = document.getElementById("meas-precision-text");

  if (measState.activeTab === "mistar") {
    precisionText.innerHTML = `<strong>Ketelitian Mistar:</strong> Pembagian skala terkecil 1 mm (0.1 cm). Baca angka pada ujung batas benda.`;
    container.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 4px;">
        <label style="font-size: 0.75rem; font-weight: bold; color: #475569;">Hasil Pembacaan Penggaris (cm)</label>
        <input type="number" step="0.1" class="meas-calculator-input" id="calc-input-total" required placeholder="Contoh: 17.2">
      </div>
      <div>
        <button type="submit" class="btn btn-primary" style="padding: 10px 20px; font-weight: bold; width: 100%;"><i class="fas fa-check"></i> Periksa Jawaban</button>
      </div>
    `;
  } else if (measState.activeTab === "caliper") {
    const prec = measState.activePrecision;
    const noniusDivs = measState.activeNoniusType;
    precisionText.innerHTML = `<strong>Jangka Sorong:</strong> Nonius <strong>${noniusDivs} skala</strong> (Ketelitian <strong>${prec} mm</strong>). Formula: $\\text{Hasil Total} = \\text{Skala Utama} + (\\text{Garis Nonius} \\times ${prec}\\text{ mm})$.`;
    container.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 4px;">
        <label style="font-size: 0.75rem; font-weight: bold; color: #475569;">1. Skala Utama (SU) (mm)</label>
        <input type="number" step="1" class="meas-calculator-input" id="calc-input-su" required placeholder="Garis sebelum 0 nonius (e.g. 24)">
      </div>
      <div style="display: flex; flex-direction: column; gap: 4px;">
        <label style="font-size: 0.75rem; font-weight: bold; color: #475569;">2. Garis Nonius Ke- (k)</label>
        <input type="number" step="1" class="meas-calculator-input" id="calc-input-sn-line" required placeholder="Garis ke- (e.g. 7)">
      </div>
      <div style="display: flex; flex-direction: column; gap: 4px;">
        <label style="font-size: 0.75rem; font-weight: bold; color: #475569;">3. Nilai Nonius (k × ${prec}) (mm)</label>
        <input type="number" step="0.01" class="meas-calculator-input" id="calc-input-sn" required placeholder="e.g. 0.35">
      </div>
      <div style="display: flex; flex-direction: column; gap: 4px;">
        <label style="font-size: 0.75rem; font-weight: bold; color: #475569;">4. Hasil Total (SU + SN) (mm)</label>
        <input type="number" step="0.01" class="meas-calculator-input" id="calc-input-total" required placeholder="e.g. 24.35">
      </div>
      <div style="display: flex; gap: 8px; flex-wrap: wrap;">
        <button type="submit" class="btn btn-primary" style="padding: 9px 16px; font-weight: bold;"><i class="fas fa-check"></i> Periksa Jawaban</button>
        <button type="button" class="btn btn-orange" id="btn-save-meas-result" style="padding: 9px 16px; font-weight: bold; display: none;" onclick="saveCurrentMeasurement()"><i class="fas fa-save"></i> Simpan ke LKPD</button>
      </div>
    `;
  } else if (measState.activeTab === "micrometer") {
    precisionText.innerHTML = `<strong>Ketelitian Mikrometer Sekrup:</strong> Pembagian thimble putar 50 skala (Ketelitian <strong>0.01 mm</strong>). Formula: $\\text{Hasil Total} = Sleeve + (Thimble \\times 0.01\\text{ mm})$.`;
    container.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 4px;">
        <label style="font-size: 0.75rem; font-weight: bold; color: #475569;">Skala Utama (Sleeve) (mm)</label>
        <input type="number" step="0.5" class="meas-calculator-input" id="calc-input-su" required placeholder="e.g. 3.0 atau 3.5">
      </div>
      <div style="display: flex; flex-direction: column; gap: 4px;">
        <label style="font-size: 0.75rem; font-weight: bold; color: #475569;">Skala Putar (Thimble) (mm)</label>
        <input type="number" step="0.01" class="meas-calculator-input" id="calc-input-sn" required placeholder="e.g. 0.22">
      </div>
      <div style="display: flex; flex-direction: column; gap: 4px;">
        <label style="font-size: 0.75rem; font-weight: bold; color: #475569;">Hasil Pembacaan Akhir (mm)</label>
        <input type="number" step="0.01" class="meas-calculator-input" id="calc-input-total" required placeholder="e.g. 3.22">
      </div>
      <div style="display: flex; gap: 8px;">
        <button type="submit" class="btn btn-primary" style="padding: 10px 16px; font-weight: bold;"><i class="fas fa-check"></i> Periksa</button>
        <button type="button" class="btn btn-orange" id="btn-save-meas-result" style="padding: 10px 16px; font-weight: bold; display: none;" onclick="saveCurrentMeasurement()"><i class="fas fa-save"></i> Catat Ke LKPD</button>
      </div>
    `;
  }
}

// ----------------- DRAW SIMULATORS IN CANVAS -----------------
function drawActiveSimulator() {
  const canvas = document.getElementById("meas-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  
  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Clean neutral scientific background
  const isDark = document.documentElement.getAttribute("data-theme") === "dark";
  ctx.fillStyle = isDark ? "#0f172a" : "#f8fafc";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Engineering grid background
  ctx.strokeStyle = isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.04)";
  ctx.lineWidth = 1;
  const gridS = 20;
  for (let x = 0; x < canvas.width; x += gridS) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
  }
  for (let y = 0; y < canvas.height; y += gridS) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
  }

  // Draw appropriate tool
  if (measState.activeTab === "mistar") {
    drawMistarSim(ctx, isDark);
  } else if (measState.activeTab === "caliper") {
    drawCaliperSim(ctx, isDark);
  } else if (measState.activeTab === "micrometer") {
    drawMicrometerSim(ctx, isDark);
  }

  // Draw Floating Magnifier lens crop
  if (measState.showLens) {
    updateZoomLensCrop(canvas);
  }
}

function drawMistarSim(ctx, isDark) {
  const scale = 22 * measState.zoomLevel; // px per cm
  const pLength = measState.pensilLength * scale;
  const px = measState.pencilX;
  const py = 120;
  const pHeight = 28;
  
  ctx.save();
  ctx.shadowColor = "rgba(0, 0, 0, 0.15)";
  ctx.shadowBlur = 8;
  ctx.shadowOffsetY = 6;

  // Pencil lead
  ctx.fillStyle = "#334155";
  ctx.beginPath();
  ctx.moveTo(px, py + pHeight/2);
  ctx.lineTo(px + 15, py + 4);
  ctx.lineTo(px + 15, py + pHeight - 4);
  ctx.closePath();
  ctx.fill();

  // Wooden cone
  ctx.fillStyle = "#fed7aa";
  ctx.beginPath();
  ctx.moveTo(px + 15, py + 4);
  ctx.lineTo(px + 35, py);
  ctx.lineTo(px + 35, py + pHeight);
  ctx.lineTo(px + 15, py + pHeight - 4);
  ctx.closePath();
  ctx.fill();

  // Main body
  ctx.fillStyle = "#eab308";
  ctx.fillRect(px + 35, py, pLength - 65, pHeight);
  
  ctx.fillStyle = "#ca8a04";
  ctx.fillRect(px + 35, py + 6, pLength - 65, 4);
  ctx.fillRect(px + 35, py + 18, pLength - 65, 4);

  // Band & eraser
  ctx.fillStyle = "#cbd5e1";
  ctx.fillRect(px + pLength - 30, py, 12, pHeight);
  ctx.fillStyle = "#fda4af";
  ctx.beginPath();
  ctx.roundRect(px + pLength - 18, py, 18, pHeight, [0, 6, 6, 0]);
  ctx.fill();
  ctx.restore();

  // Label text on pencil
  ctx.fillStyle = "#854d0e";
  ctx.font = "italic bold 10px Poppins";
  ctx.fillText("FIVIA CLASSIC", px + 50, py + 18);

  // Mistar
  const mx = measState.mistarX;
  const my = 170;
  const rWidth = 720;
  const rHeight = 70;

  ctx.save();
  ctx.shadowColor = "rgba(0, 0, 0, 0.08)";
  ctx.shadowBlur = 12;
  ctx.shadowOffsetY = 10;

  ctx.fillStyle = "rgba(224, 242, 254, 0.4)";
  ctx.strokeStyle = "rgba(14, 116, 144, 0.3)";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.roundRect(mx, my, rWidth, rHeight, 6);
  ctx.fill();
  ctx.stroke();
  ctx.restore();

  // Mistar scales
  ctx.fillStyle = isDark ? "#f8fafc" : "#0f172a";
  ctx.strokeStyle = isDark ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.7)";
  ctx.lineWidth = 1;
  ctx.font = "bold 9px Poppins";
  ctx.textAlign = "center";

  const totalCm = 30;
  for (let cm = 0; cm <= totalCm; cm++) {
    const cmPos = mx + 40 + cm * scale;
    if (cmPos < mx || cmPos > mx + rWidth) continue;

    ctx.beginPath();
    ctx.moveTo(cmPos, my);
    ctx.lineTo(cmPos, my + 14);
    ctx.stroke();
    
    ctx.fillText(cm.toString(), cmPos, my + 26);

    if (cm < totalCm) {
      const halfPos = cmPos + scale / 2;
      ctx.beginPath();
      ctx.moveTo(halfPos, my);
      ctx.lineTo(halfPos, my + 9);
      ctx.stroke();

      for (let mm = 1; mm <= 9; mm++) {
        if (mm === 5) continue;
        const mmPos = cmPos + mm * (scale / 10);
        ctx.beginPath();
        ctx.moveTo(mmPos, my);
        ctx.lineTo(mmPos, my + 5);
        ctx.stroke();
      }
    }
  }

  // Pembelajaran guide
  if (measState.playMode === "pembelajaran") {
    ctx.strokeStyle = "#10b981";
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(px, py);
    ctx.lineTo(px, my + 30);
    ctx.stroke();
    
    ctx.strokeStyle = "#ef4444";
    ctx.beginPath();
    ctx.moveTo(px + pLength, py);
    ctx.lineTo(px + pLength, my + 30);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  measState.lensX = px + pLength;
  measState.lensY = my + 10;
}

// =========================================================================
// =========================================================================
// REALISTIC CONVENTIONAL STAINLESS STEEL VERNIER CALIPER RENDERER (ENLARGED)
// =========================================================================
function drawCaliperSim(ctx, isDark) {
  const scale = 5.8 * measState.zoomLevel; // Enlarged pixels per mm (Large & Ultra-Clear)
  const gap = measState.caliperGap;       // in mm (0 to 140 mm)
  const originX = 25;
  const zeroX = originX + 115;            // Fixed jaw zero index position
  const beamY = 75;                       // Top edge of main beam
  const beamH = 68;                       // Height of main beam
  const meetY = beamY + beamH;            // Exact horizon line where Main Scale meets Vernier Scale
  const beamLen = 850;                    // Main beam length
  const sliderX = zeroX + gap * scale;    // Position of sliding zero index

  const targetSize = getCaliperTargetSize();

  // Premium brushed stainless steel gradients
  const steelGrad = ctx.createLinearGradient(0, beamY - 10, 0, beamY + beamH + 10);
  steelGrad.addColorStop(0, "#f8fafc");
  steelGrad.addColorStop(0.2, "#e2e8f0");
  steelGrad.addColorStop(0.5, "#cbd5e1");
  steelGrad.addColorStop(0.85, "#94a3b8");
  steelGrad.addColorStop(1, "#64748b");

  const jawGrad = ctx.createLinearGradient(0, beamY - 80, 0, meetY + 200);
  jawGrad.addColorStop(0, "#f1f5f9");
  jawGrad.addColorStop(0.35, "#cbd5e1");
  jawGrad.addColorStop(0.75, "#94a3b8");
  jawGrad.addColorStop(1, "#64748b");

  // -------------------------------------------------------------
  // 1. DRAW MEASURED OBJECT ACCORDING TO MEASUREMENT TYPE
  // -------------------------------------------------------------
  ctx.save();
  ctx.shadowColor = "rgba(0, 0, 0, 0.22)";
  ctx.shadowBlur = 10;
  ctx.shadowOffsetY = 6;

  const bType = measState.activeMeasType;
  const bObj = measState.activeBenda;

  if (bType === "diameter_luar") {
    // Placed between lower outside jaws
    const objW = targetSize * scale;
    const objX = zeroX;
    const objCenterY = meetY + 90;

    if (bObj === "kelereng") {
      const radius = objW / 2;
      const cx = objX + radius;
      const cy = objCenterY;
      const marbleGrad = ctx.createRadialGradient(cx - radius * 0.35, cy - radius * 0.35, radius * 0.1, cx, cy, radius);
      marbleGrad.addColorStop(0, "#c084fc");
      marbleGrad.addColorStop(0.4, "#8b5cf6");
      marbleGrad.addColorStop(0.8, "#6d28d9");
      marbleGrad.addColorStop(1, "#3b0764");

      ctx.fillStyle = marbleGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.fill();

      // Specular glare reflection
      ctx.fillStyle = "rgba(255, 255, 255, 0.75)";
      ctx.beginPath();
      ctx.arc(cx - radius * 0.35, cy - radius * 0.35, radius * 0.28, 0, Math.PI * 2);
      ctx.fill();
    } else if (bObj === "pensil") {
      const r = objW / 2;
      const cx = objX + r;
      const cy = objCenterY;
      ctx.fillStyle = "#eab308";
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "#ca8a04";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Graphite core
      ctx.fillStyle = "#334155";
      ctx.beginPath();
      ctx.arc(cx, cy, r * 0.35, 0, Math.PI * 2);
      ctx.fill();
    } else {
      // Metallic hex bolt / cylinder block
      const bh = 72;
      const by = objCenterY - bh / 2;
      const boltGrad = ctx.createLinearGradient(0, by, 0, by + bh);
      boltGrad.addColorStop(0, "#f1f5f9");
      boltGrad.addColorStop(0.5, "#94a3b8");
      boltGrad.addColorStop(1, "#475569");

      ctx.fillStyle = boltGrad;
      ctx.fillRect(objX, by, objW, bh);
      ctx.strokeStyle = "#334155";
      ctx.lineWidth = 1.5;
      ctx.strokeRect(objX, by, objW, bh);

      // Thread grooves on bolt
      ctx.strokeStyle = "rgba(0,0,0,0.25)";
      for (let tx = objX + 4; tx < objX + objW - 4; tx += 5) {
        ctx.beginPath();
        ctx.moveTo(tx, by);
        ctx.lineTo(tx + 3, by + bh);
        ctx.stroke();
      }
    }
  } else if (bType === "diameter_dalam") {
    const innerW = targetSize * scale;
    const wallThick = 16 * scale;
    const ringCx = zeroX + innerW / 2;
    const ringCy = beamY - 55;

    const ringGrad = ctx.createRadialGradient(ringCx, ringCy, innerW / 2, ringCx, ringCy, innerW / 2 + wallThick);
    ringGrad.addColorStop(0, "#cbd5e1");
    ringGrad.addColorStop(0.5, "#94a3b8");
    ringGrad.addColorStop(1, "#475569");

    ctx.fillStyle = ringGrad;
    ctx.strokeStyle = "#1e293b";
    ctx.lineWidth = 2;

    ctx.beginPath();
    ctx.arc(ringCx, ringCy, innerW / 2 + wallThick, 0, Math.PI * 2, false);
    ctx.arc(ringCx, ringCy, innerW / 2, 0, Math.PI * 2, true);
    ctx.fill();
    ctx.stroke();
  } else if (bType === "kedalaman") {
    const cavW = 38 * scale;
    const cavH = targetSize * scale;
    const cavX = originX + beamLen - cavW / 2;
    const cavY = beamY + beamH / 2;

    ctx.fillStyle = "#64748b";
    ctx.fillRect(cavX - 12, cavY, cavW + 24, cavH + 20);
    ctx.strokeStyle = "#334155";
    ctx.lineWidth = 2;
    ctx.strokeRect(cavX - 12, cavY, cavW + 24, cavH + 20);

    ctx.fillStyle = isDark ? "#020617" : "#0f172a";
    ctx.fillRect(cavX, cavY, cavW, cavH);
    ctx.strokeRect(cavX, cavY, cavW, cavH);

    ctx.fillStyle = "#f8fafc";
    ctx.font = "bold 11px monospace";
    ctx.textAlign = "center";
    ctx.fillText(`Rongga: ${targetSize.toFixed(1)} mm`, cavX + cavW / 2, cavY + cavH + 15);
  } else if (bType === "panjang") {
    const objW = targetSize * scale;
    const objX = zeroX;
    const objY = meetY + 54;
    const barH = 30;

    ctx.fillStyle = "#d97706";
    ctx.fillRect(objX, objY, objW, barH);
    ctx.strokeStyle = "#78350f";
    ctx.lineWidth = 2;
    ctx.strokeRect(objX, objY, objW, barH);
  }
  ctx.restore();

  // -------------------------------------------------------------
  // 2. DRAW DEPTH MEASURING ROD (Batang Pengukur Kedalaman)
  // -------------------------------------------------------------
  const rodLen = gap * scale;
  const rodX = originX + beamLen;
  const rodY = beamY + beamH / 2 - 4;
  const rodH = 8;

  ctx.save();
  ctx.fillStyle = "#cbd5e1";
  ctx.strokeStyle = "#475569";
  ctx.lineWidth = 1.5;
  ctx.fillRect(rodX, rodY, rodLen, rodH);
  ctx.strokeRect(rodX, rodY, rodLen, rodH);
  ctx.restore();

  // -------------------------------------------------------------
  // 3. DRAW MAIN BEAM & FIXED JAW FRAME
  // -------------------------------------------------------------
  ctx.save();
  ctx.fillStyle = steelGrad;
  ctx.strokeStyle = "#334155";
  ctx.lineWidth = 2;

  ctx.beginPath();
  ctx.moveTo(zeroX, beamY);
  
  // Fixed Upper Inside Jaw
  ctx.lineTo(zeroX, beamY - 70);
  ctx.lineTo(zeroX - 10, beamY - 85);
  ctx.quadraticCurveTo(zeroX - 30, beamY - 70, zeroX - 40, beamY - 20);
  ctx.lineTo(originX, beamY);
  
  // Fixed Lower Outside Jaw
  ctx.lineTo(originX - 12, meetY + 50);
  ctx.quadraticCurveTo(originX - 32, meetY + 140, zeroX - 45, meetY + 180);
  ctx.lineTo(zeroX - 16, meetY + 195);
  ctx.lineTo(zeroX, meetY + 175);
  ctx.lineTo(zeroX, meetY);
  
  // Long Main Beam
  ctx.lineTo(originX + beamLen, meetY);
  ctx.lineTo(originX + beamLen, beamY);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Guide Track Groove (milled groove)
  ctx.fillStyle = "rgba(100, 116, 139, 0.25)";
  ctx.fillRect(zeroX + 10, beamY + 8, beamLen - 20, 8);
  ctx.strokeStyle = "rgba(51, 65, 85, 0.4)";
  ctx.strokeRect(zeroX + 10, beamY + 8, beamLen - 20, 8);

  // Brand text on Main Beam
  ctx.fillStyle = "#334155";
  ctx.font = "bold 11px 'Outfit', 'Poppins', sans-serif";
  ctx.textAlign = "left";
  ctx.fillText("FIVIA STAINLESS STEEL HARDENED", zeroX + 30, beamY + 28);
  ctx.font = "bold 10px monospace";
  ctx.fillText("150 mm", zeroX + 270, beamY + 28);
  ctx.restore();

  // -------------------------------------------------------------
  // 4. DRAW MAIN SCALE GRADUATIONS (ENLARGED & BOLD)
  // -------------------------------------------------------------
  ctx.save();
  ctx.fillStyle = "#0f172a";
  ctx.strokeStyle = "#0f172a";
  ctx.lineWidth = 1.4;
  ctx.font = "bold 13px monospace";
  ctx.textAlign = "center";

  const totalMM = 150;
  for (let mm = 0; mm <= totalMM; mm++) {
    const tickX = Math.floor(zeroX + mm * scale) + 0.5;
    if (tickX > originX + beamLen - 5) break;

    // Major 10 mm (cm) ticks
    if (mm % 10 === 0) {
      const cmVal = mm / 10;
      ctx.beginPath();
      ctx.moveTo(tickX, meetY);
      ctx.lineTo(tickX, meetY - 20);
      ctx.stroke();
      ctx.fillText(cmVal.toString(), tickX, meetY - 24);
    } 
    // Medium 5 mm ticks
    else if (mm % 5 === 0) {
      ctx.beginPath();
      ctx.moveTo(tickX, meetY);
      ctx.lineTo(tickX, meetY - 13);
      ctx.stroke();
    } 
    // Small 1 mm ticks
    else {
      ctx.beginPath();
      ctx.moveTo(tickX, meetY);
      ctx.lineTo(tickX, meetY - 8);
      ctx.stroke();
    }
  }

  // Label cm on main scale
  ctx.font = "bold 11px Poppins";
  ctx.fillText("cm", zeroX - 18, meetY - 24);
  ctx.restore();

  // -------------------------------------------------------------
  // 5. DRAW SLIDING UNIT (ENLARGED WITH CLEAR SCALE)
  // -------------------------------------------------------------
  const numDivs = measState.activeNoniusType; // 10, 20, or 50
  let spanMM = 9;   // 10 divisions fit in 9 mm
  if (numDivs === 20) spanMM = 19;  // 20 divisions fit in 19 mm
  if (numDivs === 50) spanMM = 49;  // 50 divisions fit in 49 mm

  const sliderW = Math.max(125, spanMM * scale + 36);
  const divWidth = (spanMM / numDivs) * scale;

  ctx.save();
  ctx.shadowColor = "rgba(0, 0, 0, 0.25)";
  ctx.shadowBlur = 10;
  ctx.shadowOffsetY = 5;

  // --- 5A. TOP SLIDING RAIL & UPPER JAW ---
  ctx.fillStyle = jawGrad;
  ctx.strokeStyle = "#334155";
  ctx.lineWidth = 2;

  ctx.beginPath();
  ctx.moveTo(sliderX, beamY);
  ctx.lineTo(sliderX, beamY - 70);
  ctx.lineTo(sliderX + 10, beamY - 85);
  ctx.quadraticCurveTo(sliderX + 28, beamY - 70, sliderX + 36, beamY - 20);
  ctx.lineTo(sliderX + 44, beamY - 10);
  ctx.lineTo(sliderX + sliderW, beamY - 10);
  ctx.lineTo(sliderX + sliderW, beamY);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Locking Screw
  const screwX = sliderX + sliderW / 2;
  const screwY = beamY - 22;
  ctx.fillStyle = "#94a3b8";
  ctx.fillRect(screwX - 11, screwY - 12, 22, 12);
  ctx.strokeRect(screwX - 11, screwY - 12, 22, 12);

  // --- 5B. RIGHT VERTICAL CONNECTING PILLAR ---
  const pillarW = 14;
  const pillarX = sliderX + sliderW - pillarW;
  ctx.fillStyle = steelGrad;
  ctx.strokeStyle = "#334155";
  ctx.lineWidth = 1.5;
  ctx.fillRect(pillarX, beamY, pillarW, beamH);
  ctx.strokeRect(pillarX, beamY, pillarW, beamH);

  // --- 5C. BOTTOM SLIDER BODY & LOWER JAW ---
  ctx.fillStyle = jawGrad;
  ctx.strokeStyle = "#334155";
  ctx.lineWidth = 2;

  ctx.beginPath();
  ctx.moveTo(sliderX, meetY);
  ctx.lineTo(sliderX + sliderW, meetY);
  ctx.lineTo(sliderX + sliderW, meetY + 36);
  
  // Ergonomic Thumb Rest
  ctx.quadraticCurveTo(sliderX + sliderW + 16, meetY + 45, sliderX + sliderW + 12, meetY + 68);
  ctx.quadraticCurveTo(sliderX + sliderW, meetY + 74, sliderX + sliderW - 18, meetY + 70);
  
  // Sliding Lower Outside Jaw
  ctx.lineTo(sliderX + 48, meetY + 145);
  ctx.quadraticCurveTo(sliderX + 34, meetY + 180, sliderX + 20, meetY + 195);
  ctx.lineTo(sliderX, meetY + 175);
  ctx.lineTo(sliderX, meetY);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.restore();

  // Thumb rest ridged grooves
  ctx.save();
  ctx.strokeStyle = "rgba(51, 65, 85, 0.8)";
  ctx.lineWidth = 1.5;
  for (let ty = meetY + 45; ty <= meetY + 66; ty += 4.5) {
    ctx.beginPath();
    ctx.moveTo(sliderX + sliderW - 8, ty);
    ctx.lineTo(sliderX + sliderW + 7, ty);
    ctx.stroke();
  }
  ctx.restore();

  // --- 5D. VERNIER NONIUS BEVEL PLATE ---
  ctx.save();
  const vPlateH = 34;
  const vPlateW = sliderW - 16;
  ctx.fillStyle = "#e2e8f0";
  ctx.strokeStyle = "#475569";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.roundRect(sliderX - 1, meetY, vPlateW, vPlateH, [0, 0, 5, 5]);
  ctx.fill();
  ctx.stroke();
  ctx.restore();

  // -------------------------------------------------------------
  // 6. DRAW VERNIER NONIUS SCALE TICKS (ENLARGED & BOLD)
  // -------------------------------------------------------------
  ctx.save();
  ctx.fillStyle = "#0f172a";
  ctx.strokeStyle = "#0f172a";
  ctx.lineWidth = 1.3;
  ctx.font = "bold 12px monospace";
  ctx.textAlign = "center";

  for (let v = 0; v <= numDivs; v++) {
    const vTickX = Math.floor(sliderX + v * divWidth) + 0.5;
    if (vTickX > sliderX + vPlateW - 2) break;

    let isMajor = false;
    let label = "";

    if (numDivs === 10) {
      isMajor = true;
      label = v.toString();
    } else if (numDivs === 20) {
      if (v % 2 === 0) {
        isMajor = true;
        label = (v / 2).toString();
      }
    } else if (numDivs === 50) {
      if (v % 5 === 0) {
        isMajor = true;
        label = (v / 5).toString();
      }
    }

    if (isMajor) {
      ctx.beginPath();
      ctx.moveTo(vTickX, meetY);
      ctx.lineTo(vTickX, meetY + 15);
      ctx.stroke();
      ctx.fillText(label, vTickX, meetY + 28);
    } else {
      ctx.beginPath();
      ctx.moveTo(vTickX, meetY);
      ctx.lineTo(vTickX, meetY + 9);
      ctx.stroke();
    }
  }

  // Label precision on vernier plate
  ctx.font = "italic bold 9px sans-serif";
  ctx.textAlign = "right";
  ctx.fillStyle = "#475569";
  ctx.fillText(`${measState.activePrecision} mm`, sliderX + vPlateW - 4, meetY + 28);
  ctx.restore();

  // -------------------------------------------------------------
  // 7. MATHEMATICAL COINCIDENCE & LEARNING MODE GUIDES
  // -------------------------------------------------------------
  const currentVal = gap;
  const trueSU = Math.floor(currentVal);
  const fracVal = currentVal - trueSU;
  const coincideIdx = Math.round(fracVal / measState.activePrecision);
  const trueSN = Number((coincideIdx * measState.activePrecision).toFixed(2));
  const trueTotal = Number((trueSU + trueSN).toFixed(2));

  if (measState.playMode === "pembelajaran") {
    ctx.save();
    
    // 1. Highlight Main Scale reading line (SU) in GREEN
    const suX = Math.floor(zeroX + trueSU * scale) + 0.5;
    ctx.strokeStyle = "#16a34a";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(suX, meetY - 30);
    ctx.lineTo(suX, meetY);
    ctx.stroke();

    // Arrow pointer for 0 nonius
    ctx.fillStyle = "#16a34a";
    ctx.beginPath();
    ctx.moveTo(sliderX, meetY + 1);
    ctx.lineTo(sliderX - 6, meetY + 8);
    ctx.lineTo(sliderX + 6, meetY + 8);
    ctx.closePath();
    ctx.fill();

    // 2. Highlight Coinciding Nonius Line (SN) in RED
    if (coincideIdx <= numDivs) {
      const coincideX = Math.floor(sliderX + coincideIdx * divWidth) + 0.5;
      ctx.strokeStyle = "#dc2626";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(coincideX, meetY - 20);
      ctx.lineTo(coincideX, meetY + 32);
      ctx.stroke();

      // Guidance Overlay Card on Canvas
      ctx.fillStyle = "rgba(15, 23, 42, 0.92)";
      ctx.strokeStyle = "rgba(255, 255, 255, 0.25)";
      ctx.lineWidth = 1;
      const boxW = 380;
      const boxH = 50;
      const boxX = Math.max(10, Math.min(ctx.canvas.width - boxW - 10, sliderX - boxW / 2 + 40));
      const boxY = meetY + 40;
      
      ctx.beginPath();
      ctx.roundRect(boxX, boxY, boxW, boxH, 8);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = "#f8fafc";
      ctx.font = "bold 11px 'Poppins', sans-serif";
      ctx.textAlign = "left";
      ctx.fillText(`📖 Skala Utama (SU): ${trueSU} mm`, boxX + 12, boxY + 17);
      ctx.fillText(`🔍 Nonius Berimpit (Garis ke-${coincideIdx}): ${coincideIdx} × ${measState.activePrecision} = ${trueSN.toFixed(2)} mm`, boxX + 12, boxY + 31);
      ctx.fillStyle = "#fb923c";
      ctx.fillText(`🎯 Hasil Total = ${trueSU} + ${trueSN.toFixed(2)} = ${trueTotal.toFixed(2)} mm`, boxX + 12, boxY + 45);
    }
    ctx.restore();
  }

  // Floating guidance label over rahang geser
  ctx.save();
  ctx.fillStyle = "var(--brand-blue)";
  ctx.font = "bold 9px 'Poppins', sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("↔ Drag / Scroll Geser", sliderX + sliderW/2, beamY - 14);
  ctx.restore();

  // Focus magnifier loupe coordinates
  measState.lensX = sliderX + (coincideIdx * divWidth);
  measState.lensY = meetY;
}

// ----------------- MICROMETER SIMULATOR (ENLARGED) -----------------
function drawMicrometerSim(ctx, isDark) {
  const scale = 18.5 * measState.zoomLevel; // Enlarged pixels per mm (Super Clear & High Contrast)
  const gap = measState.micrometerGap;     // in mm (0 to 25 mm)
  const startX = 40;
  const zeroX = startX + 235;              // Sleeve 0 mm index position
  const midY = 230;

  let targetSize = measState.activeBenda === "balok" ? measState.balokT : measState.activeBenda === "pensil" ? 7.5 : measState.kelerengDiameter;

  ctx.save();
  ctx.shadowColor = "rgba(0, 0, 0, 0.18)";
  ctx.shadowBlur = 10;
  ctx.shadowOffsetY = 6;

  // 1. Draw Object between anvil face and spindle face
  const objW = targetSize * scale;
  const objX = startX + 90 + 20; // Placed flush against anvil face
  
  if (measState.activeBenda === "kelereng") {
    const r = Math.max(12, objW / 2);
    const cx = objX + objW / 2;
    const cy = midY;
    const marbleGrad = ctx.createRadialGradient(cx - r * 0.35, cy - r * 0.35, r * 0.1, cx, cy, r);
    marbleGrad.addColorStop(0, "#c084fc");
    marbleGrad.addColorStop(0.5, "#8b5cf6");
    marbleGrad.addColorStop(1, "#4c1d95");
    ctx.fillStyle = marbleGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#2e1065";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Glare reflection
    ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
    ctx.beginPath();
    ctx.arc(cx - r * 0.35, cy - r * 0.35, r * 0.3, 0, Math.PI * 2);
    ctx.fill();
  } else if (measState.activeBenda === "pensil") {
    const r = Math.max(10, objW / 2);
    const cx = objX + objW / 2;
    const cy = midY;
    ctx.fillStyle = "#eab308";
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#ca8a04";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Lead core
    ctx.fillStyle = "#334155";
    ctx.beginPath();
    ctx.arc(cx, cy, r * 0.35, 0, Math.PI * 2);
    ctx.fill();
  } else {
    // Balok / Metal Plate
    const bh = 85;
    const by = midY - bh / 2;
    const blockGrad = ctx.createLinearGradient(0, by, 0, by + bh);
    blockGrad.addColorStop(0, "#fbbf24");
    blockGrad.addColorStop(0.5, "#d97706");
    blockGrad.addColorStop(1, "#92400e");
    ctx.fillStyle = blockGrad;
    ctx.fillRect(objX, by, objW, bh);
    ctx.strokeStyle = "#78350f";
    ctx.lineWidth = 2;
    ctx.strokeRect(objX, by, objW, bh);
  }
  ctx.restore();

  // 2. Anvil (Landasan Tetap)
  const anvilW = 20;
  const anvilH = 24;
  ctx.fillStyle = "#cbd5e1";
  ctx.strokeStyle = "#334155";
  ctx.lineWidth = 2;
  ctx.fillRect(startX + 90, midY - anvilH/2, anvilW, anvilH);
  ctx.strokeRect(startX + 90, midY - anvilH/2, anvilW, anvilH);

  // 3. Spindle (Poros Geser)
  const spindleFaceX = startX + 90 + anvilW + gap * scale;
  const spindleLen = (zeroX + 60) - spindleFaceX;
  
  ctx.fillStyle = "#f1f5f9";
  ctx.strokeStyle = "#334155";
  ctx.lineWidth = 2;
  ctx.fillRect(spindleFaceX, midY - 12, Math.max(10, spindleLen), 24);
  ctx.strokeRect(spindleFaceX, midY - 12, Math.max(10, spindleLen), 24);

  // 4. Solid Cast-Iron C-Frame (Heavy & High-Tech)
  ctx.save();
  const frameGrad = ctx.createLinearGradient(0, midY - 140, 0, midY + 140);
  frameGrad.addColorStop(0, isDark ? "#1e293b" : "#0f2d59");
  frameGrad.addColorStop(0.5, isDark ? "#0f172a" : "#1e3a8a");
  frameGrad.addColorStop(1, isDark ? "#020617" : "#0f172a");

  ctx.fillStyle = frameGrad;
  ctx.strokeStyle = "#020617";
  ctx.lineWidth = 2.5;

  ctx.beginPath();
  ctx.moveTo(startX + 10, midY - 45);
  ctx.quadraticCurveTo(startX - 90, midY - 145, startX - 90, midY);
  ctx.quadraticCurveTo(startX - 90, midY + 145, startX + 10, midY + 130);
  ctx.lineTo(startX + 130, midY + 130);
  ctx.quadraticCurveTo(startX + 215, midY + 115, startX + 235, midY + 45);
  ctx.lineTo(startX + 90, midY + 45);
  ctx.lineTo(startX + 90, midY - 45);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Inscribed Gold Plate on C-Frame
  ctx.fillStyle = "#f8fafc";
  ctx.font = "bold 13px 'Outfit', 'Poppins', sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("FIVIA PRECISION 0-25 mm", startX + 65, midY + 90);
  ctx.font = "bold 11px monospace";
  ctx.fillStyle = "#fb923c";
  ctx.fillText("0.01 mm", startX + 65, midY + 110);
  ctx.restore();

  // 5. Sleeve / Barrel (Silinder Skala Utama)
  const sleeveWidth = 25 * scale + 45; // Spans full 25 mm range
  const sleeveH = 46;
  const sleeveGrad = ctx.createLinearGradient(0, midY - sleeveH/2, 0, midY + sleeveH/2);
  sleeveGrad.addColorStop(0, "#f8fafc");
  sleeveGrad.addColorStop(0.3, "#e2e8f0");
  sleeveGrad.addColorStop(0.7, "#cbd5e1");
  sleeveGrad.addColorStop(1, "#94a3b8");

  ctx.fillStyle = sleeveGrad;
  ctx.fillRect(zeroX, midY - sleeveH/2, sleeveWidth, sleeveH);
  ctx.strokeStyle = "#334155";
  ctx.lineWidth = 2;
  ctx.strokeRect(zeroX, midY - sleeveH/2, sleeveWidth, sleeveH);

  // Main Datum Horizontal Reference Line
  ctx.strokeStyle = "#0f172a";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(zeroX, midY);
  ctx.lineTo(zeroX + sleeveWidth - 5, midY);
  ctx.stroke();

  // Sleeve Graduations (ENLARGED): Top = 1 mm integers, Bottom = 0.5 mm
  ctx.fillStyle = "#0f172a";
  ctx.font = "bold 13px monospace";
  ctx.textAlign = "center";

  for (let mm = 0; mm <= 25; mm++) {
    const mmX = zeroX + mm * scale;
    if (mmX > zeroX + sleeveWidth - 10) break;

    // Top: Integer mm line
    ctx.beginPath();
    ctx.moveTo(mmX, midY);
    ctx.lineTo(mmX, midY - 13);
    ctx.stroke();

    if (mm % 5 === 0) {
      ctx.fillText(mm.toString(), mmX, midY - 16);
    }

    // Bottom: 0.5 mm line
    if (mm < 25) {
      const halfX = mmX + scale / 2;
      ctx.beginPath();
      ctx.moveTo(halfX, midY);
      ctx.lineTo(halfX, midY + 11);
      ctx.stroke();
    }
  }

  // 6. Thimble (Skala Putar / Silinder Putar - ENLARGED)
  const thimbleX = zeroX + gap * scale;
  const thimbleW = 125;
  const thimbleH = 72;
  const bevelW = 26; // Bevel slope at left edge

  const thimbleGrad = ctx.createLinearGradient(0, midY - thimbleH/2, 0, midY + thimbleH/2);
  thimbleGrad.addColorStop(0, "#f8fafc");
  thimbleGrad.addColorStop(0.25, "#e2e8f0");
  thimbleGrad.addColorStop(0.5, "#cbd5e1");
  thimbleGrad.addColorStop(0.85, "#94a3b8");
  thimbleGrad.addColorStop(1, "#64748b");

  ctx.save();
  ctx.shadowColor = "rgba(0, 0, 0, 0.25)";
  ctx.shadowBlur = 10;
  ctx.shadowOffsetY = 4;

  ctx.fillStyle = thimbleGrad;
  ctx.strokeStyle = "#334155";
  ctx.lineWidth = 2;

  ctx.beginPath();
  ctx.moveTo(thimbleX, midY - thimbleH/2 + 10);
  ctx.lineTo(thimbleX + bevelW, midY - thimbleH/2);
  ctx.lineTo(thimbleX + thimbleW, midY - thimbleH/2);
  ctx.lineTo(thimbleX + thimbleW, midY + thimbleH/2);
  ctx.lineTo(thimbleX + bevelW, midY + thimbleH/2);
  ctx.lineTo(thimbleX, midY + thimbleH/2 - 10);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Bevel line
  ctx.strokeStyle = "rgba(0,0,0,0.25)";
  ctx.beginPath();
  ctx.moveTo(thimbleX + bevelW, midY - thimbleH/2);
  ctx.lineTo(thimbleX + bevelW, midY + thimbleH/2);
  ctx.stroke();

  // Thimble knurled grip grooves on right half
  ctx.strokeStyle = "rgba(51, 65, 85, 0.75)";
  ctx.lineWidth = 1.2;
  const knurlStart = thimbleX + bevelW + 32;
  for (let kx = knurlStart; kx <= thimbleX + thimbleW - 8; kx += 4.5) {
    ctx.beginPath();
    ctx.moveTo(kx, midY - thimbleH/2 + 2);
    ctx.lineTo(kx, midY + thimbleH/2 - 2);
    ctx.stroke();
  }

  // 7. Ratchet Stop Speeder (Ujung Kanan)
  const ratchetX = thimbleX + thimbleW;
  const ratchetW = 44;
  const ratchetH = 40;
  const rGrad = ctx.createLinearGradient(0, midY - ratchetH/2, 0, midY + ratchetH/2);
  rGrad.addColorStop(0, "#cbd5e1");
  rGrad.addColorStop(0.5, "#94a3b8");
  rGrad.addColorStop(1, "#475569");

  ctx.fillStyle = rGrad;
  ctx.fillRect(ratchetX, midY - ratchetH/2, ratchetW, ratchetH);
  ctx.strokeStyle = "#334155";
  ctx.strokeRect(ratchetX, midY - ratchetH/2, ratchetW, ratchetH);

  for (let rx = ratchetX + 5; rx <= ratchetX + ratchetW - 5; rx += 4) {
    ctx.beginPath();
    ctx.moveTo(rx, midY - ratchetH/2 + 2);
    ctx.lineTo(rx, midY + ratchetH/2 - 2);
    ctx.stroke();
  }
  ctx.restore();

  // 8. 3D Cylindrical Projection of Thimble Scales (ENLARGED & BOLD)
  ctx.save();
  ctx.fillStyle = "#0f172a";
  ctx.strokeStyle = "#0f172a";
  ctx.lineWidth = 1.4;
  ctx.font = "bold 13px monospace";
  ctx.textAlign = "left";

  const continuousThimble = (gap * 100) % 50;
  const intCenter = Math.floor(continuousThimble);
  const frac = continuousThimble - intCenter;
  const spacingY = 4.2; // Enlarged spacing between division lines

  for (let offset = -14; offset <= 14; offset++) {
    const val = (intCenter + offset + 500) % 50;
    const dy = midY - (offset - frac) * spacingY;

    if (dy < midY - thimbleH/2 + 6 || dy > midY + thimbleH/2 - 6) continue;

    const isMajor = (val % 5 === 0);
    const tickLen = isMajor ? 18 : 10;

    ctx.beginPath();
    ctx.moveTo(thimbleX + 2, dy);
    ctx.lineTo(thimbleX + 2 + tickLen, dy);
    ctx.stroke();

    if (isMajor) {
      ctx.fillText(val.toString(), thimbleX + 22, dy + 4.5);
    }
  }
  ctx.restore();

  // 9. Learning Mode Guides & Reading Indicator
  const suRaw = Math.floor(gap * 2) / 2; // e.g. 3.0 or 3.5
  const snVal = Number((gap - suRaw).toFixed(2));
  const totalVal = Number(gap.toFixed(2));

  if (measState.playMode === "pembelajaran") {
    ctx.save();
    // Red indicator at datum alignment
    ctx.strokeStyle = "#dc2626";
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(thimbleX - 20, midY);
    ctx.lineTo(thimbleX + 20, midY);
    ctx.stroke();

    // Guidance Card
    ctx.fillStyle = "rgba(15, 23, 42, 0.92)";
    ctx.strokeStyle = "rgba(255, 255, 255, 0.25)";
    ctx.lineWidth = 1;
    const boxW = 380;
    const boxH = 50;
    const boxX = Math.max(10, Math.min(ctx.canvas.width - boxW - 10, thimbleX - boxW / 2 + 50));
    const boxY = midY + 48;
    
    ctx.beginPath();
    ctx.roundRect(boxX, boxY, boxW, boxH, 8);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = "#f8fafc";
    ctx.font = "bold 11px 'Poppins', sans-serif";
    ctx.textAlign = "left";
    ctx.fillText(`📖 Skala Utama (Sleeve): ${suRaw.toFixed(1)} mm`, boxX + 12, boxY + 17);
    ctx.fillText(`🔄 Skala Putar (Thimble): ${(snVal * 100).toFixed(0)} × 0.01 = ${snVal.toFixed(2)} mm`, boxX + 12, boxY + 31);
    ctx.fillStyle = "#fb923c";
    ctx.fillText(`🎯 Hasil Total = ${suRaw.toFixed(1)} + ${snVal.toFixed(2)} = ${totalVal.toFixed(2)} mm`, boxX + 12, boxY + 45);
    ctx.restore();
  }

  // Floating rotation hint on top of thimble
  ctx.save();
  ctx.fillStyle = "#7c3aed";
  ctx.font = "bold 10px 'Poppins', sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("🔄 Drag / Scroll Putar Skala", thimbleX + thimbleW/2, midY - thimbleH/2 - 8);
  ctx.restore();

  measState.lensX = thimbleX + 8;
  measState.lensY = midY;
}

// ----------------- HIGH RESOLUTION MAGNIFIER LENS -----------------
function updateZoomLensCrop(mainCanvas) {
  const lens = document.getElementById("meas-zoom-lens");
  const zoomCanvas = document.getElementById("meas-zoom-canvas");
  if (!lens || !zoomCanvas) return;

  const zCtx = zoomCanvas.getContext("2d");
  const cropW = 65;
  const cropH = 36;

  const cx = measState.lensX - cropW / 2;
  const cy = measState.lensY - cropH / 2;

  zCtx.clearRect(0, 0, zoomCanvas.width, zoomCanvas.height);
  
  // Render cropped main canvas enlarged 4x
  zCtx.drawImage(
    mainCanvas, 
    cx, cy, cropW, cropH,
    0, 0, zoomCanvas.width, zoomCanvas.height
  );

  // Position lens overlay
  const rect = mainCanvas.getBoundingClientRect();
  const wrapper = document.getElementById("meas-canvas-wrapper");
  if (wrapper) {
    const localX = measState.lensX - 125;
    const localY = measState.lensY - 175;
    
    lens.style.left = `${Math.max(10, Math.min(rect.width - 260, localX))}px`;
    lens.style.top = `${Math.max(10, localY)}px`;
  }
}

function onDirectCaliperSliderInput(val) {
  let gap = parseFloat(val);
  const targetSize = getCaliperTargetSize();
  if (Math.abs(gap - targetSize) < 0.35) {
    gap = targetSize;
  }
  const prec = measState.activePrecision || 0.05;
  measState.caliperGap = Number((Math.round(gap / prec) * prec).toFixed(2));
  syncControlBarUI();
  drawActiveSimulator();
}

// ----------------- INTERACTIVE CONTROL BAR HELPERS -----------------
function stepActiveMeasurement(delta) {
  if (measState.activeTab === "caliper") {
    const prec = measState.activePrecision || 0.05;
    let newGap = Math.max(0, Math.min(140, measState.caliperGap + delta));
    measState.caliperGap = Number((Math.round(newGap / prec) * prec).toFixed(2));
  } else if (measState.activeTab === "micrometer") {
    let newGap = Math.max(0, Math.min(25, measState.micrometerGap + delta));
    measState.micrometerGap = Number((Math.round(newGap / 0.01) * 0.01).toFixed(2));
  } else if (measState.activeTab === "mistar") {
    measState.mistarX = Math.max(-100, Math.min(200, measState.mistarX + delta * 10));
  }
  syncControlBarUI();
  drawActiveSimulator();
}

function onLiveSliderInput(val) {
  const num = parseFloat(val);
  if (measState.activeTab === "caliper") {
    const prec = measState.activePrecision || 0.05;
    measState.caliperGap = Number((Math.round(num / prec) * prec).toFixed(2));
  } else if (measState.activeTab === "micrometer") {
    measState.micrometerGap = Number((Math.round(num / 0.01) * 0.01).toFixed(2));
  } else if (measState.activeTab === "mistar") {
    measState.mistarX = num;
  }
  syncControlBarUI(false);
  drawActiveSimulator();
}

function snapActiveToolToObject() {
  if (measState.activeTab === "caliper") {
    snapCaliperToObject();
  } else if (measState.activeTab === "micrometer") {
    let targetSize = measState.activeBenda === "balok" ? measState.balokT : measState.activeBenda === "pensil" ? 7.5 : measState.kelerengDiameter;
    measState.micrometerGap = Number(targetSize.toFixed(2));
    syncControlBarUI();
    drawActiveSimulator();
    if (window.showToast) {
      window.showToast(`Thimble mikrometer otomatis berputar pas merapat pada benda (${targetSize.toFixed(2)} mm)!`, "success");
    }
  } else if (measState.activeTab === "mistar") {
    measState.mistarX = 40;
    measState.pencilX = 80;
    syncControlBarUI();
    drawActiveSimulator();
  }
}

function syncControlBarUI(updateSlider = true) {
  const labelEl = document.getElementById("meas-control-label");
  const badgeEl = document.getElementById("meas-live-value-badge");
  const sliderEl = document.getElementById("meas-live-range-slider");
  const btnLargeMinus = document.getElementById("btn-step-large-minus");
  const btnMedMinus = document.getElementById("btn-step-med-minus");
  const btnFineMinus = document.getElementById("btn-step-fine-minus");
  const btnFinePlus = document.getElementById("btn-step-fine-plus");
  const btnMedPlus = document.getElementById("btn-step-med-plus");
  const btnLargePlus = document.getElementById("btn-step-large-plus");

  if (!labelEl || !badgeEl) return;

  if (measState.activeTab === "caliper") {
    const prec = measState.activePrecision || 0.05;
    labelEl.innerHTML = `<i class="fas fa-arrows-alt-h"></i> Geser Rahang:`;
    badgeEl.textContent = `${measState.caliperGap.toFixed(2)} mm`;
    badgeEl.style.background = "#0f2d59";

    if (sliderEl) {
      sliderEl.min = "0";
      sliderEl.max = "140";
      sliderEl.step = prec.toString();
      if (updateSlider) sliderEl.value = measState.caliperGap.toString();
    }

    if (btnLargeMinus) btnLargeMinus.textContent = "-1.0";
    if (btnMedMinus) btnMedMinus.textContent = "-0.1";
    if (btnFineMinus) btnFineMinus.textContent = `-${prec}`;
    if (btnFinePlus) btnFinePlus.textContent = `+${prec}`;
    if (btnMedPlus) btnMedPlus.textContent = "+0.1";
    if (btnLargePlus) btnLargePlus.textContent = "+1.0";
  } else if (measState.activeTab === "micrometer") {
    labelEl.innerHTML = `<i class="fas fa-sync-alt"></i> Putar Skala Thimble:`;
    badgeEl.textContent = `${measState.micrometerGap.toFixed(2)} mm`;
    badgeEl.style.background = "#7c3aed";

    if (sliderEl) {
      sliderEl.min = "0";
      sliderEl.max = "25";
      sliderEl.step = "0.01";
      if (updateSlider) sliderEl.value = measState.micrometerGap.toString();
    }

    if (btnLargeMinus) btnLargeMinus.textContent = "-0.5";
    if (btnMedMinus) btnMedMinus.textContent = "-0.05";
    if (btnFineMinus) btnFineMinus.textContent = "-0.01";
    if (btnFinePlus) btnFinePlus.textContent = "+0.01";
    if (btnMedPlus) btnMedPlus.textContent = "+0.05";
    if (btnLargePlus) btnLargePlus.textContent = "+0.5";
  } else if (measState.activeTab === "mistar") {
    labelEl.innerHTML = `<i class="fas fa-ruler-horizontal"></i> Geser Mistar:`;
    badgeEl.textContent = `${((measState.pencilX - measState.mistarX) / 22).toFixed(1)} cm`;
    badgeEl.style.background = "#0284c7";

    if (sliderEl) {
      sliderEl.min = "-50";
      sliderEl.max = "150";
      sliderEl.step = "1";
      if (updateSlider) sliderEl.value = measState.mistarX.toString();
    }

    if (btnLargeMinus) btnLargeMinus.textContent = "-1.0";
    if (btnMedMinus) btnMedMinus.textContent = "-0.5";
    if (btnFineMinus) btnFineMinus.textContent = "-0.1";
    if (btnFinePlus) btnFinePlus.textContent = "+0.1";
    if (btnMedPlus) btnMedPlus.textContent = "+0.5";
    if (btnLargePlus) btnLargePlus.textContent = "+1.0";
  }
}

// ----------------- DIRECT FLUID DRAG & ROTATION LISTENERS -----------------
let isDraggingMeas = false;
let startClientX = 0;
let startClientY = 0;
let startGapMeas = 0;
let startMistarX = 0;
let dragOffset = 0;

function setupMeasCanvasEvents() {
  const canvas = document.getElementById("meas-canvas");
  if (!canvas) return;

  canvas.style.cursor = "grab";
  canvas.style.touchAction = "none";
  canvas.style.userSelect = "none";

  const getCanvasPos = (clientX, clientY) => {
    const rect = canvas.getBoundingClientRect();
    const canvasAspect = canvas.width / canvas.height;
    const elemAspect = (rect.width || 1) / (rect.height || 1);
    let renderW = rect.width;
    let renderH = rect.height;
    let offsetX = 0;
    let offsetY = 0;

    if (elemAspect > canvasAspect) {
      renderW = rect.height * canvasAspect;
      offsetX = (rect.width - renderW) / 2;
    } else {
      renderH = rect.width / canvasAspect;
      offsetY = (rect.height - renderH) / 2;
    }

    const normX = (clientX - rect.left - offsetX) / (renderW || 1);
    const normY = (clientY - rect.top - offsetY) / (renderH || 1);
    return {
      x: Math.max(0, Math.min(canvas.width, normX * canvas.width)),
      y: Math.max(0, Math.min(canvas.height, normY * canvas.height))
    };
  };

  const handleStart = (clientX, clientY) => {
    isDraggingMeas = true;
    startClientX = clientX;
    startClientY = clientY;
    canvas.style.cursor = "grabbing";

    const pos = getCanvasPos(clientX, clientY);

    if (measState.activeTab === "mistar") {
      startMistarX = measState.mistarX;
    } else if (measState.activeTab === "caliper") {
      const scale = 5.8 * measState.zoomLevel;
      const originX = 25;
      const zeroX = originX + 115;
      const sliderX = zeroX + measState.caliperGap * scale;

      if (pos.x >= sliderX - 35 && pos.x <= sliderX + 160) {
        dragOffset = pos.x - sliderX;
      } else if (pos.x >= zeroX && pos.x <= originX + 850) {
        let newGap = (pos.x - zeroX) / scale;
        newGap = Math.max(0, Math.min(140, newGap));
        const prec = measState.activePrecision || 0.05;
        measState.caliperGap = Number((Math.round(newGap / prec) * prec).toFixed(2));
        dragOffset = 0;
        drawActiveSimulator();
      } else {
        dragOffset = 0;
      }
      startGapMeas = measState.caliperGap;
    } else if (measState.activeTab === "micrometer") {
      startGapMeas = measState.micrometerGap;
      const scale = 18.5 * measState.zoomLevel;
      const startX = 40;
      const zeroX = startX + 235;
      const thimbleX = zeroX + measState.micrometerGap * scale;

      // If user clicks along the sleeve to jump
      if (pos.x >= zeroX && pos.x <= zeroX + 25 * scale && Math.abs(pos.x - thimbleX) > 30) {
        let clickedGap = (pos.x - zeroX) / scale;
        clickedGap = Math.max(0, Math.min(25, clickedGap));
        measState.micrometerGap = Number((Math.round(clickedGap / 0.01) * 0.01).toFixed(2));
        startGapMeas = measState.micrometerGap;
        drawActiveSimulator();
      }
    }
  };

  const handleMove = (clientX, clientY) => {
    if (!isDraggingMeas) {
      // Hover cursor feedback
      const pos = getCanvasPos(clientX, clientY);
      if (measState.activeTab === "caliper") {
        const scale = 5.8 * measState.zoomLevel;
        const zeroX = 25 + 115;
        const sliderX = zeroX + measState.caliperGap * scale;
        if (pos.x >= sliderX - 30 && pos.x <= sliderX + 155) {
          canvas.style.cursor = "ew-resize";
        } else if (pos.x >= zeroX && pos.x <= zeroX + 750) {
          canvas.style.cursor = "pointer";
        } else {
          canvas.style.cursor = "grab";
        }
      } else if (measState.activeTab === "micrometer") {
        const scale = 18.5 * measState.zoomLevel;
        const zeroX = 40 + 235;
        const thimbleX = zeroX + measState.micrometerGap * scale;
        if (pos.x >= thimbleX - 15 && pos.x <= thimbleX + 175) {
          canvas.style.cursor = "all-scroll";
        } else {
          canvas.style.cursor = "grab";
        }
      } else {
        canvas.style.cursor = "grab";
      }
      return;
    }

    const pos = getCanvasPos(clientX, clientY);

    if (measState.activeTab === "mistar") {
      const rect = canvas.getBoundingClientRect();
      const deltaX = (clientX - startClientX) * (canvas.width / (rect.width || 1));
      measState.mistarX = Math.max(-100, Math.min(200, startMistarX + deltaX));
    } else if (measState.activeTab === "caliper") {
      const scale = 5.8 * measState.zoomLevel;
      const zeroX = 25 + 115;
      let newGap = (pos.x - zeroX - dragOffset) / scale;
      newGap = Math.max(0, Math.min(140, newGap));

      // Magnetic contact snap
      const targetSize = getCaliperTargetSize();
      if (Math.abs(newGap - targetSize) < 0.35) {
        newGap = targetSize;
      }

      const prec = measState.activePrecision || 0.05;
      measState.caliperGap = Number((Math.round(newGap / prec) * prec).toFixed(2));
    } else if (measState.activeTab === "micrometer") {
      const rect = canvas.getBoundingClientRect();
      const deltaX = (clientX - startClientX) * (canvas.width / (rect.width || 1));
      const deltaY = (clientY - startClientY) * (canvas.height / (rect.height || 1));
      
      // Moving right or up opens thimble (+); moving left or down closes thimble (-)
      const effectiveDelta = deltaX - (deltaY * 1.5);
      const scale = 18.5 * measState.zoomLevel;
      let newGap = startGapMeas + (effectiveDelta / (scale * 2.0));
      newGap = Math.max(0, Math.min(25, newGap));

      // Magnetic snap to target
      let targetSize = measState.activeBenda === "balok" ? measState.balokT : measState.activeBenda === "pensil" ? 7.5 : measState.kelerengDiameter;
      if (Math.abs(newGap - targetSize) < 0.04) {
        newGap = targetSize;
      }

      measState.micrometerGap = Number((Math.round(newGap / 0.01) * 0.01).toFixed(2));
    }

    syncControlBarUI();
    drawActiveSimulator();
  };

  const handleEnd = () => {
    isDraggingMeas = false;
    canvas.style.cursor = "grab";
  };

  // Pointer Events
  canvas.onpointerdown = (e) => {
    e.preventDefault();
    if (canvas.setPointerCapture) {
      try { canvas.setPointerCapture(e.pointerId); } catch (_) {}
    }
    handleStart(e.clientX, e.clientY);
  };
  canvas.onpointermove = (e) => {
    handleMove(e.clientX, e.clientY);
  };
  canvas.onpointerup = (e) => {
    handleEnd();
    if (canvas.releasePointerCapture && e.pointerId !== undefined) {
      try { canvas.releasePointerCapture(e.pointerId); } catch (_) {}
    }
  };
  canvas.onpointercancel = handleEnd;

  // Mouse Events fallback
  canvas.onmousedown = (e) => {
    e.preventDefault();
    handleStart(e.clientX, e.clientY);
  };

  // Touch Events
  canvas.ontouchstart = (e) => {
    if (e.touches && e.touches.length > 0) {
      e.preventDefault();
      handleStart(e.touches[0].clientX, e.touches[0].clientY);
    }
  };
  canvas.ontouchmove = (e) => {
    if (e.touches && e.touches.length > 0) {
      e.preventDefault();
      handleMove(e.touches[0].clientX, e.touches[0].clientY);
    }
  };
  canvas.ontouchend = handleEnd;
  canvas.ontouchcancel = handleEnd;

  // Mouse Wheel support for instant smooth scrolling/rotating
  canvas.onwheel = (e) => {
    e.preventDefault();
    if (measState.activeTab === "micrometer") {
      const step = e.deltaY < 0 ? 0.01 : -0.01;
      measState.micrometerGap = Math.max(0, Math.min(25, Number((measState.micrometerGap + step).toFixed(2))));
      syncControlBarUI();
      drawActiveSimulator();
    } else if (measState.activeTab === "caliper") {
      const prec = measState.activePrecision || 0.05;
      const step = e.deltaY < 0 ? prec : -prec;
      measState.caliperGap = Math.max(0, Math.min(140, Number((measState.caliperGap + step).toFixed(2))));
      syncControlBarUI();
      drawActiveSimulator();
    } else if (measState.activeTab === "mistar") {
      const step = e.deltaY < 0 ? 4 : -4;
      measState.mistarX = Math.max(-100, Math.min(200, measState.mistarX + step));
      syncControlBarUI();
      drawActiveSimulator();
    }
  };

  // Window safety listeners
  window.addEventListener("pointermove", (e) => {
    if (isDraggingMeas) handleMove(e.clientX, e.clientY);
  });
  window.addEventListener("mousemove", (e) => {
    if (isDraggingMeas) handleMove(e.clientX, e.clientY);
  });
  window.addEventListener("pointerup", () => {
    if (isDraggingMeas) handleEnd();
  });
  window.addEventListener("mouseup", () => {
    if (isDraggingMeas) handleEnd();
  });
}

// ----------------- CALCULATOR VERIFICATION SUBMIT -----------------
function handleMeasCalculatorSubmit(event) {
  event.preventDefault();
  
  const suEl = document.getElementById("calc-input-su");
  const snLineEl = document.getElementById("calc-input-sn-line");
  const snEl = document.getElementById("calc-input-sn");
  const totalEl = document.getElementById("calc-input-total");
  
  const userSU = suEl ? parseFloat(suEl.value) : 0;
  const userSNLine = snLineEl ? parseInt(snLineEl.value) : 0;
  const userSN = snEl ? parseFloat(snEl.value) : 0;
  const userTotal = parseFloat(totalEl.value);
  
  let targetSize = 0;
  let toolLabel = "Mistar";
  let unit = "cm";
  let isCorrect = false;
  let feedbackText = "";
  let precisionInfo = "0.1 cm";

  if (measState.activeTab === "mistar") {
    unit = "cm";
    toolLabel = "Mistar";
    targetSize = measState.pensilLength;
    isCorrect = Math.abs(userTotal - targetSize) < 0.15;
    
    if (isCorrect) {
      feedbackText = `Benar! Pembacaan mistar untuk ${measState.activeBenda} adalah ${targetSize.toFixed(1)} cm.`;
    } else {
      feedbackText = `Skala yang Anda baca (${userTotal} cm) kurang tepat. Sejajarkan ujung kiri benda dengan skala 0 penggaris, lalu amati angka pada ujung kanan. Seharusnya ${targetSize.toFixed(1)} cm.`;
    }
  } else if (measState.activeTab === "caliper") {
    unit = "mm";
    toolLabel = `Jangka Sorong (${measState.activeNoniusType} Skala)`;
    precisionInfo = `${measState.activePrecision} mm`;
    targetSize = getCaliperTargetSize();

    const prec = measState.activePrecision;
    const trueSU = Math.floor(targetSize);
    const frac = targetSize - trueSU;
    const trueLine = Math.round(frac / prec);
    const trueSN = Number((trueLine * prec).toFixed(2));
    const trueTotal = Number((trueSU + trueSN).toFixed(2));

    const checkSU = Math.abs(userSU - trueSU) < 0.1;
    const checkLine = !snLineEl || userSNLine === trueLine;
    const checkSN = Math.abs(userSN - trueSN) < 0.005;
    const checkTotal = Math.abs(userTotal - trueTotal) < 0.005;

    isCorrect = checkSU && checkLine && checkSN && checkTotal;

    if (isCorrect) {
      feedbackText = `Luar Biasa! Pembacaan Jangka Sorong TEPAT & BENAR:<br>
      • <strong>Skala Utama (SU):</strong> ${trueSU} mm<br>
      • <strong>Garis Nonius Berimpit:</strong> Garis ke-${trueLine}<br>
      • <strong>Nilai Skala Nonius (SN):</strong> ${trueLine} × ${prec} mm = ${trueSN.toFixed(2)} mm<br>
      • <strong>Hasil Pengukuran Total:</strong> ${trueSU} + ${trueSN.toFixed(2)} = <strong>${trueTotal.toFixed(2)} mm</strong>.`;
    } else {
      if (!checkSU) {
        feedbackText = `❌ <strong>Salah pada Skala Utama (SU):</strong> Amati garis millimeter pada batang utama tepat di sebelah kiri angka 0 skala nonius. Nilai yang benar adalah <strong>${trueSU} mm</strong>.`;
      } else if (!checkLine) {
        feedbackText = `❌ <strong>Salah pada Garis Nonius Berimpit:</strong> Periksa garis nonius keberapa yang berimpit tegak lurus sempurna dengan garis skala utama. Garis yang benar adalah <strong>ke-${trueLine}</strong>.`;
      } else if (!checkSN) {
        feedbackText = `❌ <strong>Salah pada Perhitungan Nilai Nonius (SN):</strong> Kalikan nomor garis nonius (${trueLine}) dengan ketelitian (${prec} mm). Seharusnya: ${trueLine} × ${prec} = <strong>${trueSN.toFixed(2)} mm</strong>.`;
      } else {
        feedbackText = `❌ <strong>Salah pada Penjumlahan Akhir:</strong> Hasil akhir adalah SU + SN = ${trueSU} + ${trueSN.toFixed(2)} = <strong>${trueTotal.toFixed(2)} mm</strong>.`;
      }
    }
  } else if (measState.activeTab === "micrometer") {
    unit = "mm";
    toolLabel = "Mikrometer Sekrup";
    precisionInfo = "0.01 mm";
    targetSize = measState.balokT;

    const trueSU = (targetSize % 1 >= 0.5) ? Math.floor(targetSize) + 0.5 : Math.floor(targetSize);
    const trueSN = Number((targetSize - trueSU).toFixed(2));
    const trueTotal = Number(targetSize.toFixed(2));

    const checkSU = Math.abs(userSU - trueSU) < 0.1;
    const checkSN = Math.abs(userSN - trueSN) < 0.01;
    const checkTotal = Math.abs(userTotal - trueTotal) < 0.015;

    isCorrect = checkSU && checkSN && checkTotal;

    if (isCorrect) {
      feedbackText = `Luar Biasa! Pembacaan Mikrometer tepat: Sleeve = ${trueSU.toFixed(1)} mm, Thimble = ${trueSN.toFixed(2)} mm, Total = ${trueTotal.toFixed(2)} mm.`;
    } else {
      feedbackText = `Pembacaan belum tepat. Periksa kembali sleeve (${trueSU.toFixed(1)} mm) dan garis thimble (${trueSN.toFixed(2)} mm). Total: ${trueTotal.toFixed(2)} mm.`;
    }
  }

  // Display feedback via AI Tutor
  const hintBox = document.getElementById("meas-ai-hint-box");
  if (hintBox) {
    hintBox.style.display = "block";
    hintBox.innerHTML = `
      <strong><i class="fas fa-robot"></i> FIVIA AI Tutor Evaluasi Pengukuran:</strong><br>
      ${feedbackText}
    `;
  }

  // Show Save to LKPD button on success
  const saveBtn = document.getElementById("btn-save-meas-result");
  if (saveBtn) {
    saveBtn.style.display = isCorrect ? "inline-block" : "none";
  }

  // Cache state for saving
  measState.lastTargetSize = targetSize;
  measState.lastUserTotal = userTotal;
  measState.lastToolLabel = toolLabel;
  measState.lastUnit = unit;
  measState.lastPrecision = precisionInfo;
  
  if (isCorrect) {
    window.showToast("Jawaban Anda diverifikasi BENAR!", "success");
  } else {
    window.showToast("Pembacaan masih kurang tepat, periksa petunjuk AI Tutor.", "warning");
  }
}

// ----------------- SAVE RESULTS TO OBSERVATIONS -----------------
function saveCurrentMeasurement() {
  const objData = measState.caliperObjects[measState.activeBenda];
  const typeLabel = measState.activeMeasType === "diameter_luar" ? "Diameter Luar" :
                    measState.activeMeasType === "diameter_dalam" ? "Diameter Dalam" :
                    measState.activeMeasType === "kedalaman" ? "Kedalaman" : "Panjang";
  const bendaName = measState.activeTab === "caliper"
    ? `${(objData && objData.name) || measState.activeBenda} (${typeLabel})`
    : measState.activeBenda === "pensil"
    ? "Pensil Kayu"
    : measState.activeBenda === "kelereng"
    ? "Kelereng"
    : `Balok (${measState.activeBalokDimension.toUpperCase()})`;

  const alreadySaved = measState.results.some(r => r.benda === bendaName && r.alat === measState.lastToolLabel);
  if (alreadySaved) {
    window.showToast("Pengukuran benda dengan parameter ini sudah tercatat di tabel!", "warning");
    return;
  }

  const error = Math.abs(measState.lastUserTotal - measState.lastTargetSize);
  
  const record = {
    id: "rec_" + Date.now().toString(36),
    benda: bendaName,
    jenisPengukuran: typeLabel,
    alat: measState.lastToolLabel,
    siswa: measState.lastUserTotal.toFixed(2) + " " + measState.lastUnit,
    benar: measState.lastTargetSize.toFixed(2) + " " + measState.lastUnit,
    selisih: error.toFixed(2) + " " + measState.lastUnit,
    ketelitian: measState.lastPrecision
  };

  measState.results.push(record);
  
  // Hide save button
  const saveBtn = document.getElementById("btn-save-meas-result");
  if (saveBtn) saveBtn.style.display = "none";
  
  // Update UI and save to local state key
  updateMeasResultsUI();
  saveLKPDMeas();
  
  window.showToast(`Berhasil mencatat hasil pengukuran ${bendaName} ke tabel LKPD!`, "success");
}

function deleteObservationRow(id) {
  measState.results = measState.results.filter(r => r.id !== id);
  updateMeasResultsUI();
  saveLKPDMeas();
}

function updateMeasResultsUI() {
  const progressText = document.getElementById("meas-progress-text");
  if (progressText) {
    progressText.textContent = `Benda Terukur: ${measState.results.length}/3`;
  }

  const resultsBody = document.getElementById("meas-results-table-body");
  const lkpdBody = document.getElementById("meas-lkpd-table-body");
  
  if (resultsBody) {
    resultsBody.innerHTML = "";
    if (measState.results.length === 0) {
      resultsBody.innerHTML = `<tr><td colspan="8" style="text-align: center; color: var(--text-secondary); padding: 20px;">Belum ada data observasi yang dicatat. Selesaikan pengukuran skala terlebih dahulu.</td></tr>`;
    } else {
      measState.results.forEach((r, idx) => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td style="padding: 10px; border: 1px solid #cbd5e1; text-align: center;">${idx + 1}</td>
          <td style="padding: 10px; border: 1px solid #cbd5e1; font-weight: 600;">${r.benda}</td>
          <td style="padding: 10px; border: 1px solid #cbd5e1; text-align: center;">${r.jenisPengukuran || "-"}</td>
          <td style="padding: 10px; border: 1px solid #cbd5e1; text-align: center; font-family: monospace;">${r.ketelitian}</td>
          <td style="padding: 10px; border: 1px solid #cbd5e1; text-align: center; font-family: monospace; font-weight: bold; color: var(--brand-blue);">${r.siswa}</td>
          <td style="padding: 10px; border: 1px solid #cbd5e1; text-align: center; font-family: monospace; color: #475569;">${r.benar}</td>
          <td style="padding: 10px; border: 1px solid #cbd5e1; text-align: center; color: #166534; font-weight: bold;">✔️ Terverifikasi</td>
          <td style="padding: 10px; border: 1px solid #cbd5e1; text-align: center;">
            <button class="btn btn-outline" style="padding: 4px 8px; font-size: 0.7rem; border-color: var(--danger); color: var(--danger);" onclick="deleteObservationRow('${r.id}')"><i class="fas fa-trash"></i> Hapus</button>
          </td>
        `;
        resultsBody.appendChild(row);
      });
    }
  }

  if (lkpdBody) {
    lkpdBody.innerHTML = "";
    if (measState.results.length === 0) {
      lkpdBody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: var(--text-secondary); padding: 12px; font-size: 0.8rem;">Belum ada data pengamatan yang dicatat.</td></tr>`;
    } else {
      measState.results.forEach(r => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td style="padding: 8px; border: 1px solid #cbd5e1; font-weight: 600; font-size: 0.8rem;">${r.benda}</td>
          <td style="padding: 8px; border: 1px solid #cbd5e1; text-align: center; font-size: 0.8rem;">${r.jenisPengukuran || "-"}</td>
          <td style="padding: 8px; border: 1px solid #cbd5e1; font-size: 0.8rem;">${r.alat} (${r.ketelitian})</td>
          <td style="padding: 8px; border: 1px solid #cbd5e1; text-align: center; font-family: monospace; font-size: 0.8rem; font-weight: bold;">${r.siswa}</td>
          <td style="padding: 8px; border: 1px solid #cbd5e1; text-align: center; color: #166534; font-size: 0.8rem; font-weight: bold;">✔️ Benar</td>
        `;
        lkpdBody.appendChild(row);
      });
    }
  }

  const feedbackCard = document.getElementById("meas-analysis-feedback-card");
  const feedbackText = document.getElementById("meas-analysis-feedback-text");
  if (feedbackCard && feedbackText) {
    if (measState.results.length > 0) {
      feedbackCard.style.display = "block";
      const numR = measState.results.length;
      let adviceStr = `Anda telah berhasil mengumpulkan <strong>${numR} data pengukuran terverifikasi</strong>.<br>`;
      adviceStr += `Analisis Galat: Rata-rata deviasi selisih pembacaan Anda bernilai 0.00 unit. Jangka Sorong memberikan akurasi tinggi hingga 2 angka desimal (${measState.activePrecision} mm) untuk mengukur diameter luar, diameter dalam, dan kedalaman rongga.`;
      feedbackText.innerHTML = adviceStr;
    } else {
      feedbackCard.style.display = "none";
    }
  }
}

// ----------------- AUTOSAVE AND DB SUBMISSION -----------------
function saveLKPDMeas() {
  const currentUser = window.auth && window.auth.getCurrentUser();
  if (!currentUser) return;

  const key = `vlab_autosave_${currentUser.id}_lab_2`;
  const draftData = {
    hypothesis: document.getElementById("lkpd-meas-hypothesis") ? document.getElementById("lkpd-meas-hypothesis").value : "",
    analysis: document.getElementById("lkpd-meas-analysis") ? document.getElementById("lkpd-meas-analysis").value : "",
    conclusion: document.getElementById("lkpd-meas-conclusion") ? document.getElementById("lkpd-meas-conclusion").value : "",
    observations: measState.results.map(r => ({
      alat: r.alat,
      benda: r.benda,
      siswa: r.siswa,
      benar: r.benar,
      eval: "✔️ BENAR"
    })),
    results: measState.results
  };

  localStorage.setItem(key, JSON.stringify(draftData));
}

// Attach input listeners for lkpd autosave
document.addEventListener("input", (e) => {
  if (e.target.id === "lkpd-meas-hypothesis" || e.target.id === "lkpd-meas-analysis" || e.target.id === "lkpd-meas-conclusion") {
    saveLKPDMeas();
  }
});

function submitRedesignedLKPD() {
  const currentUser = window.auth && window.auth.getCurrentUser();
  if (!currentUser) {
    window.showToast("Anda harus login untuk mengirimkan LKPD!", "danger");
    return;
  }

  if (measState.results.length < 3) {
    window.showToast("Lengkapi minimal 3 data pengukuran sebelum mengirimkan LKPD!", "warning");
    return;
  }

  const hypothesis = document.getElementById("lkpd-meas-hypothesis").value.trim();
  const analysis = document.getElementById("lkpd-meas-analysis").value.trim();
  const conclusion = document.getElementById("lkpd-meas-conclusion").value.trim();

  if (!hypothesis || !analysis || !conclusion) {
    window.showToast("Harap isi Hipotesis, Analisis, dan Kesimpulan terlebih dahulu!", "warning");
    return;
  }

  // Map to the window.db submission structure
  const submissionAnswers = {
    hypothesis: hypothesis,
    conclusion: conclusion,
    observations: measState.results.map(r => ({
      alat: r.alat,
      benda: r.benda,
      siswa: r.siswa,
      benar: r.benar,
      eval: "✔️ BENAR"
    })),
    dataMisi4: measState.results.map(r => ({
      alat: r.alat,
      target: r.benar,
      siswa: r.siswa,
      selisih: r.selisih,
      status: "Benar"
    })),
    results: measState.results
  };

  const submission = {
    studentId: currentUser.id,
    labId: 2,
    timestamp: Date.now(),
    answers: submissionAnswers,
    status: "submitted"
  };

  const success = window.db.submitLKPD(submission);
  if (success) {
    if (window.showToast) window.showToast("Laporan LKPD Digital berhasil terkirim ke Guru!", "success");
    // Go back to dashboard after brief delay
    setTimeout(() => {
      window.location.hash = "#dashboard";
    }, 1500);
  } else {
    if (window.showToast) window.showToast("Gagal mengirimkan LKPD ke database.", "danger");
  }
}

// Global scope bindings
window.initRedesignedMeasurementLab = initRedesignedMeasurementLab;
window.switchMeasTab = switchMeasTab;
window.switchMeasType = switchMeasType;
window.switchNoniusType = switchNoniusType;
window.selectBenda = selectBenda;
window.snapCaliperToObject = snapCaliperToObject;
window.stepCaliperGap = stepCaliperGap;
window.switchBalokDimension = switchBalokDimension;
window.switchPlayMode = switchPlayMode;
window.adjustMeasZoom = adjustMeasZoom;
window.toggleZoomLens = toggleZoomLens;
window.randomizeObjectSizes = randomizeObjectSizes;
window.resetActiveSimulator = resetActiveSimulator;
window.updateGuruSettings = updateGuruSettings;
window.checkMeasCalculation = checkMeasCalculation;
window.recordObservationRow = recordObservationRow;
window.deleteObservationRow = deleteObservationRow;
window.sendLKPDMeas = sendLKPDMeas;
window.stepActiveMeasurement = stepActiveMeasurement;
window.onLiveSliderInput = onLiveSliderInput;
window.snapActiveToolToObject = snapActiveToolToObject;
window.syncControlBarUI = syncControlBarUI;

