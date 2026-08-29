/**
 * lkpd.js
 * Logic for Digital Worksheets (LKPD) generation, data collection tables, and autosave submissions
 */

let activeLKPD = null;
let observationsList = []; // rows of { col1, col2, ... }

function initLKPDForLab(labId) {
  const user = window.auth.getCurrentUser();
  if (!user) return;

  activeLKPD = window.db.getLKPDForLab(labId);
  if (!activeLKPD) return;

  // Set Tujuan
  document.getElementById("lkpd-tujuan-text").textContent = activeLKPD.tujuan;

  // Clear observations list
  observationsList.length = 0;

  // Reset hypothesis and conclusion inputs
  document.getElementById("lkpd-hipotesis").value = "";
  document.getElementById("lkpd-kesimpulan").value = "";

  // Load autosaved or previously submitted data
  const prevSub = window.db.getLKPDSubmission(user.id, labId);
  const autosaveKey = `vlab_autosave_${user.id}_lab_${labId}`;
  const autosavedDataStr = localStorage.getItem(autosaveKey);
  
  let initialData = prevSub;
  if (!initialData && autosavedDataStr) {
    try {
      initialData = JSON.parse(autosavedDataStr);
    } catch (e) {
      console.error("Failed to parse autosave lkpd data", e);
    }
  }

  // Generate Table headers
  generateTableHeader(activeLabType);

  if (initialData) {
    // Fill answers
    document.getElementById("lkpd-hipotesis").value = initialData.hypothesis || "";
    document.getElementById("lkpd-kesimpulan").value = initialData.conclusion || "";
    
    if (initialData.observations && initialData.observations.length > 0) {
      observationsList.length = 0;
      observationsList.push(...initialData.observations);
      renderObservationRows();
    }
  } else {
    // Add first blank row by default or keep empty
    renderObservationRows();
  }

  // Generate analysis questions
  renderLKPDQuestions(initialData);

  // Bind input listeners for autosaving
  bindLKPDAutosave(labId);

  // Bind submit button
  const submitBtn = document.getElementById("btn-submit-lkpd");
  if (submitBtn) {
    submitBtn.onclick = () => {
      submitLKPDAnswers(labId);
    };
  }

  // Bind Add Obs Row button
  const addRowBtn = document.getElementById("btn-add-obs-row");
  if (addRowBtn) {
    addRowBtn.onclick = () => {
      recordObservationRow(activeLabType);
    };
  }

  // Bind Student Measurement Form Submit
  const measForm = document.getElementById("form-meas-input");
  if (measForm) {
    measForm.onsubmit = (e) => {
      e.preventDefault();
      
      const suEl = document.getElementById("input-su");
      const snEl = document.getElementById("input-sn");
      const totalEl = document.getElementById("input-total");
      
      const userSU = suEl ? parseFloat(suEl.value) : 0;
      const userSN = snEl ? parseFloat(snEl.value) : 0;
      const userTotal = totalEl ? parseFloat(totalEl.value) : 0;
      
      const cat = window.simState.measurementCategory;
      const tool = window.simState.measurementTool;
      const pos = window.simState.userCaliperPos;
      const targetVal = window.simState.measurementTargetVal;
      
      let isCorrect = false;
      let feedbackStr = "";
      let dataRow = {};
      
      if (cat === "panjang") {
        let trueSU = 0;
        let trueSN = 0;
        let trueTotal = pos;
        
        if (tool === "mistar") {
          trueSU = Math.round(pos);
          isCorrect = Math.abs(userTotal - trueSU) < 0.5;
          feedbackStr = isCorrect ? "BENAR" : `SALAH (Seharusnya ${trueSU} mm)`;
          dataRow = {
            alat: "MISTAR",
            benda: window.simState.measurementSelectedObj.toUpperCase(),
            su: "-",
            sn: "-",
            siswa: userTotal + " mm",
            benar: trueSU + " mm",
            eval: isCorrect ? "✔️ BENAR" : "❌ " + feedbackStr
          };
        } else if (tool === "caliper") {
          trueSU = Math.floor(pos);
          trueSN = pos - trueSU;
          
          const checkSU = Math.abs(userSU - trueSU) < 0.1;
          const checkSN = Math.abs(userSN - trueSN) < 0.15;
          const checkTotal = Math.abs(userTotal - trueTotal) < 0.15;
          isCorrect = checkSU && checkSN && checkTotal;
          feedbackStr = isCorrect ? "BENAR" : `SALAH (SU: ${trueSU}, SN: ${trueSN.toFixed(1)}, Total: ${trueTotal.toFixed(1)})`;
          dataRow = {
            alat: "JANGKA SORONG",
            benda: window.simState.measurementSelectedObj.toUpperCase(),
            su: userSU + " mm",
            sn: userSN + " mm",
            siswa: userTotal + " mm",
            benar: trueTotal.toFixed(1) + " mm",
            eval: isCorrect ? "✔️ BENAR" : "❌ " + feedbackStr
          };
        } else {
          trueSU = (pos % 1 >= 0.5) ? Math.floor(pos) + 0.5 : Math.floor(pos);
          trueSN = pos - trueSU;
          
          const checkSU = Math.abs(userSU - trueSU) < 0.1;
          const checkSN = Math.abs(userSN - trueSN) < 0.02;
          const checkTotal = Math.abs(userTotal - trueTotal) < 0.02;
          isCorrect = checkSU && checkSN && checkTotal;
          feedbackStr = isCorrect ? "BENAR" : `SALAH (SU: ${trueSU.toFixed(1)}, SN: ${trueSN.toFixed(2)}, Total: ${trueTotal.toFixed(2)})`;
          dataRow = {
            alat: "MIKROMETER",
            benda: window.simState.measurementSelectedObj.toUpperCase(),
            su: userSU + " mm",
            sn: userSN + " mm",
            siswa: userTotal + " mm",
            benar: trueTotal.toFixed(2) + " mm",
            eval: isCorrect ? "✔️ BENAR" : "❌ " + feedbackStr
          };
        }
      } else if (cat === "massa") {
        const sumWeight = window.simState.userOhaus100 + window.simState.userOhaus10 + window.simState.userOhaus1;
        const trueTotal = targetVal;
        
        if (tool === "neraca_ohaus") {
          const trueSU = window.simState.userOhaus100 + window.simState.userOhaus10;
          const trueSN = window.simState.userOhaus1;
          
          const checkSU = Math.abs(userSU - trueSU) < 0.5;
          const checkSN = Math.abs(userSN - trueSN) < 0.15;
          const checkTotal = Math.abs(userTotal - trueTotal) < 0.2;
          isCorrect = checkSU && checkSN && checkTotal;
          feedbackStr = isCorrect ? "BENAR" : `SALAH (Lengan: ${trueSU}g, Lengan Depan: ${trueSN.toFixed(1)}g)`;
          
          dataRow = {
            alat: "NERACA OHAUS",
            benda: window.simState.measurementSelectedObj.toUpperCase(),
            siswa: userTotal.toFixed(1) + " g",
            benar: trueTotal.toFixed(1) + " g",
            eval: isCorrect ? "✔️ BENAR" : "❌ " + feedbackStr
          };
        } else {
          isCorrect = Math.abs(userTotal - trueTotal) < 0.1;
          feedbackStr = isCorrect ? "BENAR" : `SALAH (Seharusnya ${trueTotal.toFixed(1)} g)`;
          
          dataRow = {
            alat: "TIMBANGAN DIGITAL",
            benda: window.simState.measurementSelectedObj.toUpperCase(),
            siswa: userTotal.toFixed(1) + " g",
            benar: trueTotal.toFixed(1) + " g",
            eval: isCorrect ? "✔️ BENAR" : "❌ " + feedbackStr
          };
        }
      } else if (cat === "waktu") {
        const trueTime = window.simState.stopwatchTime;
        isCorrect = Math.abs(userTotal - trueTime) < 0.05;
        feedbackStr = isCorrect ? "BENAR" : `SALAH (Seharusnya ${trueTime.toFixed(2)} s)`;
        
        dataRow = {
          percobaan: "JATUH BEBAS",
          tinggi: "2.0 m",
          siswa: userTotal.toFixed(2) + " s",
          benar: trueTime.toFixed(2) + " s",
          eval: isCorrect ? "✔️ BENAR" : "❌ " + feedbackStr
        };
      } else {
        const isVolt = window.simState.measurementSelectedObj === "voltmeter";
        const trueVal = isVolt ? window.simState.circVoltage : (window.simState.circVoltage / window.simState.circResistance) * 1000;
        const label = isVolt ? " V" : " mA";
        
        isCorrect = Math.abs(userTotal - trueVal) < (isVolt ? 0.2 : 2.0);
        feedbackStr = isCorrect ? "BENAR" : `SALAH (Seharusnya ${trueVal.toFixed(1)}${label})`;
        
        dataRow = {
          parameter: isVolt ? "TEGANGAN (V)" : "ARUS LISTRIK (I)",
          volt: window.simState.circVoltage.toFixed(1) + " V",
          res: window.simState.circResistance + " \u03a9",
          siswa: userTotal.toFixed(2) + label,
          benar: trueVal.toFixed(2) + label,
          eval: isCorrect ? "✔️ BENAR" : "❌ " + feedbackStr
        };
      }
      
      observationsList.push(dataRow);
      renderObservationRows();
      
      if (window.closeAllModals) {
        window.closeAllModals();
      } else {
        document.querySelectorAll(".modal-overlay").forEach(m => m.classList.remove("active"));
      }
      
      if (window.showToast) {
        if (isCorrect) {
          window.showToast("Hasil pengukuran Anda BENAR! Data telah dicatat.", "success");
        } else {
          window.showToast("Hasil pengukuran Anda SALAH. Silakan periksa kembali skala.", "error");
        }
      }
    };
  }
}

function generateTableHeader(type) {
  const thead = document.querySelector("#lkpd-data-table thead");
  if (!thead) return;
  thead.innerHTML = "";

  let headers = [];
  if (type === "caliper" || type === "micrometer" || type === "measurement") {
    const cat = window.simState ? window.simState.measurementCategory : "panjang";
    if (cat === "panjang") {
      headers = ["Alat Ukur", "Benda", "Skala Utama (SU)", "Skala Nonius (SN)", "Hasil Siswa", "Nilai Benar", "Evaluasi"];
    } else if (cat === "massa") {
      headers = ["Alat Ukur", "Benda", "Hasil Siswa", "Nilai Benar", "Evaluasi"];
    } else if (cat === "waktu") {
      headers = ["Percobaan", "Tinggi Jatuh", "Hasil Siswa", "Nilai Benar", "Evaluasi"];
    } else {
      headers = ["Parameter", "Tegangan Baterai", "Hambatan Resistor", "Hasil Siswa", "Nilai Benar", "Evaluasi"];
    }
  } else if (type === "scientific_method") {
    const isSafety = window.simState && window.simState.scientificMethodMode === "safety";
    if (isSafety) {
      headers = ["Obyek Bahaya", "Tipe Bahaya", "Deteksi", "Solusi Tindakan", "Siswa", "Kunci Aman", "Evaluasi"];
    } else {
      headers = ["Waktu (s)", "Volume Air (mL)", "Daya Bunsen (W)", "Suhu Air (°C)", "Kondisi Cairan"];
    }
  } else if (type === "skate_ramp") {
    headers = ["Massa (kg)", "Gesekan Ramp", "Tinggi Awal (m)", "E. Potensial (J)", "E. Kinetik (J)", "E. Mekanik (J)"];
  } else if (type === "wind_solar") {
    headers = ["Angin (m/s)", "Sudut Surya (°)", "Tutupan Awan (%)", "Daya Angin (W)", "Daya Surya (W)", "Baterai (%)"];
  } else if (type === "greenhouse") {
    headers = ["CO2 (ppm)", "Emisi Industri", "Penghijauan (%)", "Suhu Aktual (°C)", "Kondisi Bumi"];
  } else if (type === "motion" || type === "forces") {
    headers = ["Massa (kg)", "Gaya Dorong (N)", "Koef. Gesek", "Percepatan (m/s\u00b2)", "Kecepatan Akhir (m/s)"];
  } else if (type === "dc_circuit") {
    headers = ["Tegangan (V)", "Hambatan (\u03a9)", "Kuat Arus (Ampere)", "Kondisi Lampu"];
  } else {
    headers = ["Var Slider 1", "Var Slider 2", "Waktu Sim (s)", "Keadaan Visual"];
  }

  const tr = document.createElement("tr");
  headers.forEach(h => {
    const th = document.createElement("th");
    th.textContent = h;
    tr.appendChild(th);
  });
  thead.appendChild(tr);
}

function renderObservationRows() {
  const tbody = document.querySelector("#lkpd-data-table tbody");
  if (!tbody) return;
  tbody.innerHTML = "";

  if (observationsList.length === 0) {
    const colCount = document.querySelectorAll("#lkpd-data-table thead th").length || 6;
    tbody.innerHTML = `<tr><td colspan="${colCount}" style="text-align: center; color: var(--text-secondary); font-style: italic;">Belum ada data dicatat. Klik 'Catat Obyek Terukur' untuk merekam data.</td></tr>`;
    return;
  }

  observationsList.forEach(row => {
    const tr = document.createElement("tr");
    Object.values(row).forEach(val => {
      const td = document.createElement("td");
      td.textContent = val;
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });
}

function recordObservationRow(type) {
  if (type === "caliper" || type === "micrometer" || type === "measurement") {
    const cat = window.simState.measurementCategory;
    const tool = window.simState.measurementTool;
    const container = document.getElementById("meas-input-fields-container");
    if (!container) return;
    
    container.innerHTML = "";
    
    if (cat === "panjang") {
      if (tool === "mistar") {
        container.innerHTML = `
          <div class="form-group">
            <label style="font-weight: 600;">Hasil Pembacaan Mistar (mm)</label>
            <input type="number" step="1" class="form-control" id="input-total" required placeholder="Contoh: 12">
          </div>
        `;
      } else if (tool === "caliper") {
        container.innerHTML = `
          <div class="form-group">
            <label style="font-weight: 600;">Pembacaan Skala Utama - SU (mm)</label>
            <input type="number" step="1" class="form-control" id="input-su" required placeholder="Contoh: 12">
          </div>
          <div class="form-group">
            <label style="font-weight: 600;">Pembacaan Skala Nonius - SN (mm)</label>
            <input type="number" step="0.1" class="form-control" id="input-sn" required placeholder="Contoh: 0.4">
          </div>
          <div class="form-group">
            <label style="font-weight: 600;">Hasil Pengukuran Total (mm)</label>
            <input type="number" step="0.1" class="form-control" id="input-total" required placeholder="Contoh: 12.4">
          </div>
        `;
      } else {
        container.innerHTML = `
          <div class="form-group">
            <label style="font-weight: 600;">Pembacaan Skala Utama - SU (mm)</label>
            <input type="number" step="0.5" class="form-control" id="input-su" required placeholder="Contoh: 12.0 atau 12.5">
          </div>
          <div class="form-group">
            <label style="font-weight: 600;">Pembacaan Skala Putar / Nonius - SN (mm)</label>
            <input type="number" step="0.01" class="form-control" id="input-sn" required placeholder="Contoh: 0.35">
          </div>
          <div class="form-group">
            <label style="font-weight: 600;">Hasil Pengukuran Total (mm)</label>
            <input type="number" step="0.01" class="form-control" id="input-total" required placeholder="Contoh: 12.35">
          </div>
        `;
      }
    } else if (cat === "massa") {
      if (tool === "neraca_ohaus") {
        // Verify balance first
        const sumWeight = window.simState.userOhaus100 + window.simState.userOhaus10 + window.simState.userOhaus1;
        const targetVal = window.simState.measurementTargetVal;
        if (Math.abs(sumWeight - targetVal) >= 0.15) {
          alert("Neraca Ohaus belum seimbang! Geser lengan beban sampai indikator seimbang terlebih dahulu.");
          return;
        }
        
        container.innerHTML = `
          <div class="form-group">
            <label style="font-weight: 600;">Jumlah Lengan Belakang + Tengah (g)</label>
            <input type="number" step="10" class="form-control" id="input-su" required placeholder="Contoh: 140">
          </div>
          <div class="form-group">
            <label style="font-weight: 600;">Lengan Depan - Desimal (g)</label>
            <input type="number" step="0.1" class="form-control" id="input-sn" required placeholder="Contoh: 5.8">
          </div>
          <div class="form-group">
            <label style="font-weight: 600;">Hasil Pengukuran Total (g)</label>
            <input type="number" step="0.1" class="form-control" id="input-total" required placeholder="Contoh: 145.8">
          </div>
        `;
      } else {
        container.innerHTML = `
          <div class="form-group">
            <label style="font-weight: 600;">Massa pada Layar Timbangan (g)</label>
            <input type="number" step="0.1" class="form-control" id="input-total" required placeholder="Contoh: 145.8">
          </div>
        `;
      }
    } else if (cat === "waktu") {
      container.innerHTML = `
        <div class="form-group">
          <label style="font-weight: 600;">Waktu Tempuh stopwatch (s)</label>
          <input type="number" step="0.01" class="form-control" id="input-total" required placeholder="Contoh: 0.64">
        </div>
      `;
    } else if (cat === "listrik") {
      const isVolt = window.simState.measurementSelectedObj === "voltmeter";
      container.innerHTML = `
        <div class="form-group">
          <label style="font-weight: 600;">Hasil Pembacaan Analog (${isVolt ? 'Volt' : 'mA'})</label>
          <input type="number" step="0.01" class="form-control" id="input-total" required placeholder="Contoh: 9.00 atau 60.00">
        </div>
      `;
    }

    if (window.openModal) {
      window.openModal("meas-input-modal");
    } else {
      const modal = document.getElementById("meas-input-modal");
      if (modal) modal.classList.add("active");
    }
  } else {
    let row = {};
    if (type === "scientific_method") {
      const isSafety = window.simState.scientificMethodMode === "safety";
      if (isSafety) {
        if (window.showToast) window.showToast("Di mode Keamanan Lab, data tercatat otomatis saat Anda sukses mengatasi hazard!", "info");
        return;
      } else {
        row = {
          waktu: window.simTime.toFixed(1) + " s",
          volume: window.simState.heatingVolume + " mL",
          daya: window.simState.heatingPower + " W",
          suhu: window.simState.heatingTemp.toFixed(1) + " °C",
          kondisi: window.simState.heatingTemp >= 100.0 ? "♨️ MENDIDIH" : "Pemanasan"
        };
      }
    } else if (type === "skate_ramp") {
      row = {
        massa: window.simState.skateMass.toFixed(1) + " kg",
        gesek: window.simState.skateFriction.toFixed(2),
        tinggi: window.simState.skateInitialHeight.toFixed(1) + " m",
        ep: window.simState.skateEp.toFixed(1) + " J",
        ek: window.simState.skateEk.toFixed(1) + " J",
        em: window.simState.skateEm.toFixed(1) + " J"
      };
    } else if (type === "wind_solar") {
      row = {
        angin: window.simState.windSpeed.toFixed(1) + " m/s",
        surya: window.simState.solarAngle + "°",
        awan: window.simState.cloudiness + "%",
        dayaAngin: window.simState.windPower.toFixed(2) + " W",
        dayaSurya: window.simState.solarPower.toFixed(2) + " W",
        baterai: Math.round(window.simState.batteryCharge) + " %"
      };
    } else if (type === "greenhouse") {
      row = {
        co2: window.simState.co2Ppm + " ppm",
        emisi: window.simState.emissions.toUpperCase(),
        hijau: window.simState.greening + "%",
        suhu: window.simState.earthTemp.toFixed(2) + " °C",
        kondisi: window.simState.earthTemp > 33.0 ? "⚠️ EKSTRIM PANAS" : window.simState.earthTemp > 25.0 ? "Pemanasan Global" : "Ideal Sejuk"
      };
    } else if (type === "motion" || type === "forces") {
      row = {
        massa: window.simState.blockMass,
        gaya: window.simState.pushForce,
        gesek: window.simState.frictionCoeff.toFixed(2),
        percepatan: window.simState.blockAx.toFixed(2),
        kecepatan: window.simState.blockVx.toFixed(2)
      };
    } else if (type === "dc_circuit") {
      const I = window.simState.circVoltage / window.simState.circResistance;
      row = {
        tegangan: window.simState.circVoltage,
        hambatan: window.simState.circResistance,
        arus: I.toFixed(3),
        lampu: I > 0.15 ? "Terang" : I > 0.02 ? "Redup" : "Mati"
      };
    } else {
      row = {
        val1: window.simState.widgetSlider1.toFixed(1),
        val2: window.simState.widgetSlider2.toFixed(1),
        waktu: window.simTime.toFixed(2),
        visual: "Stabil"
      };
    }
    observationsList.push(row);
    renderObservationRows();
    triggerLKPDAutosave();
    if (window.showToast) window.showToast("Data hasil eksperimen berhasil dicatat!");
  }
}

function renderLKPDQuestions(initialData) {
  const container = document.getElementById("lkpd-questions-container");
  if (!container) return;
  container.innerHTML = "";

  activeLKPD.pertanyaan.forEach(q => {
    const group = document.createElement("div");
    group.className = "form-group";
    
    let savedVal = "";
    if (initialData && initialData.answers) {
      const ansObj = initialData.answers.find(a => a.questionId === q.id);
      if (ansObj) savedVal = ansObj.answerText;
    }

    group.innerHTML = `
      <label for="lkpd-ans-${q.id}"><i class="fas fa-question-circle" style="color: var(--brand-blue);"></i> Pertanyaan: ${q.text}</label>
      <textarea class="lkpd-textarea lkpd-question-input" id="lkpd-ans-${q.id}" data-qid="${q.id}" placeholder="Ketikkan analisis jawaban ilmiah Anda disini...">${savedVal}</textarea>
    `;
    container.appendChild(group);
  });
}

function bindLKPDAutosave(labId) {
  const user = window.auth.getCurrentUser();
  if (!user) return;

  const saveToStorage = () => {
    triggerLKPDAutosave();
  };

  // Bind elements
  document.getElementById("lkpd-hipotesis").addEventListener("input", saveToStorage);
  document.getElementById("lkpd-kesimpulan").addEventListener("input", saveToStorage);

  document.querySelectorAll(".lkpd-question-input").forEach(el => {
    el.addEventListener("input", saveToStorage);
  });
}

function triggerLKPDAutosave() {
  const user = window.auth.getCurrentUser();
  if (!user) return;

  const lkpdData = compileLKPDData();
  const autosaveKey = `vlab_autosave_${user.id}_lab_${activeLKPD.labId}`;
  localStorage.setItem(autosaveKey, JSON.stringify(lkpdData));
}

function compileLKPDData() {
  const user = window.auth.getCurrentUser();
  const answers = [];

  document.querySelectorAll(".lkpd-question-input").forEach(el => {
    answers.push({
      questionId: el.getAttribute("data-qid"),
      answerText: el.value.trim()
    });
  });

  return {
    studentId: user.id,
    labId: activeLKPD.labId,
    hypothesis: document.getElementById("lkpd-hipotesis").value.trim(),
    observations: observationsList,
    answers: answers,
    conclusion: document.getElementById("lkpd-kesimpulan").value.trim(),
    status: "pending"
  };
}

function submitLKPDAnswers(labId) {
  const user = window.auth.getCurrentUser();
  if (!user) return;

  const lkpdData = compileLKPDData();
  
  if (!lkpdData.hypothesis) {
    window.showToast("Harap isi bagian Hipotesis sebelum mengirimkan!", "warning");
    return;
  }

  if (lkpdData.observations.length === 0) {
    window.showToast("Harap rekam data pengamatan minimal 1 baris sebelum mengirimkan!", "warning");
    return;
  }

  if (!lkpdData.conclusion) {
    window.showToast("Harap isi bagian Kesimpulan sebelum mengirimkan!", "warning");
    return;
  }

  // Submit to DB
  window.db.submitLKPD(lkpdData);
  
  // Clear autosave cache
  localStorage.removeItem(`vlab_autosave_${user.id}_lab_${labId}`);

  window.showToast("Lembar Kerja Siswa (LKPD) berhasil dikirim ke dashboard Guru!");
  
  // Redirect to dashboard
  setTimeout(() => {
    window.location.hash = "#dashboard";
  }, 1000);
}

// Map globals
window.initLKPDForLab = initLKPDForLab;
window.recordObservationRow = recordObservationRow;
window.observationsList = observationsList;
window.renderObservationRows = renderObservationRows;
window.triggerLKPDAutosave = triggerLKPDAutosave;
