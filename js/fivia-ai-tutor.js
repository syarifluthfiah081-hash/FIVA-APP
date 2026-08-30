/**
 * FIVIA AI TUTOR MODULE
 * Socratic Pedagogical Companion, Context-Awareness & Local Offline Fallback
 */

window.FIVIAAITutor = (function() {
  'use strict';

  const STORAGE_KEY = 'fivia_ai_tutor_history';

  // Structured Local Offline Knowledge Base
  const LOCAL_KNOWLEDGE = {
    besaran: "Besaran Pokok adalah 7 besaran baku SI (Panjang [L], Massa [M], Waktu [T], Kuat Arus [I], Suhu [Θ], Jumlah Zat [N], Intensitas Cahaya [J]). Besaran Turunan diturunkan dari perkalian/pembagian besaran pokok.",
    satuan: "Satuan baku SI untuk Massa adalah Kilogram (kg), bukan gram. Satuan baku Panjang adalah meter (m), Waktu sekon (s), Suhu Kelvin (K), Arus Ampere (A).",
    dimensi: "Dimensi menyatakan cara besaran diturunkan. Simbol dimensi baku: Panjang [L], Massa [M], Waktu [T]. PENTING: [J] adalah simbol dimensi Intensitas Cahaya, sedangkan J tanpa kurung siku adalah Joule (satuan energi).",
    kinematika: "Pada GLB: v konstan, x = v·t. Pada GLBB: a konstan, v = v₀ + a·t, x = x₀ + v₀t + ½ a·t², v² = v₀² + 2a·x.",
    newton: "Hukum 1 Newton (ΣF = 0, kelembaman). Hukum 2 Newton (a = ΣF / m). Hukum 3 Newton (F_aksi = -F_reaksi).",
    energi: "Energi Potensial Ep = m·g·h. Energi Kinetik Ek = ½ m·v². Hukum Kekekalan Energi Mekanik Em = Ep + Ek bernilai konstan jika tanpa gesekan.",
    pengukuran: "Nilai ketidakpastian mutlak Δx = ½ × Skala Terkecil. Jangka sorong (0.1 mm), mikrometer sekrup (0.01 mm). Penulisan pelaporan: L = (x̄ ± Δx) unit.",
    grafik: "Pada grafik v-t, gradien kemiringan garis menunjukkan Percepatan (a), sedangkan Luas di bawah kurva menunjukkan Jarak/Perpindahan (x).",
    terbarukan: "Daya listrik panel surya P = V · I. Daya maksimum diperoleh saat arah sinar matahari tegak lurus dengan permukaan panel surya (sudut 0°, cos 0° = 1)."
  };

  let chatHistory = [];
  let socraticLevel = 1;

  function getHistory() {
    return window.FIVIAStudent.safeStorageGet(STORAGE_KEY, [
      { sender: 'tutor', text: 'Halo! Saya FIVIA AI Tutor, pendamping belajar Fisika Anda. Ada konsep atau soal praktikum yang ingin Anda tanyakan?', timestamp: new Date().toISOString() }
    ]);
  }

  function saveHistory(messages) {
    window.FIVIAStudent.safeStorageSet(STORAGE_KEY, messages);
    chatHistory = messages;
  }

  /**
   * Socratic Response Generator with Context Awareness & Offline Fallback
   */
  function generateSocraticResponse(userPrompt) {
    const promptLower = userPrompt.toLowerCase();
    const student = window.FIVIAStudent.getStudentProfile();
    const weakConcepts = student.weakestConcepts ? student.weakestConcepts.join(', ') : 'Besaran & Dimensi';

    let topicKey = null;
    if (promptLower.includes('besaran')) topicKey = 'besaran';
    else if (promptLower.includes('satuan')) topicKey = 'satuan';
    else if (promptLower.includes('dimensi')) topicKey = 'dimensi';
    else if (promptLower.includes('gerak') || promptLower.includes('glb') || promptLower.includes('kecepatan')) topicKey = 'kinematika';
    else if (promptLower.includes('gaya') || promptLower.includes('newton')) topicKey = 'newton';
    else if (promptLower.includes('energi')) topicKey = 'energi';
    else if (promptLower.includes('ukur') || promptLower.includes('jangka')) topicKey = 'pengukuran';
    else if (promptLower.includes('grafik')) topicKey = 'grafik';
    else if (promptLower.includes('surya') || promptLower.includes('panel')) topicKey = 'terbarukan';

    let responseText = '';

    // Socratic Guidance Ladder Steps
    if (socraticLevel === 1) {
      responseText = `[Level 1 - Guiding Question] Mari kita analisis bersama. Konsep dasar apa yang menghubungkan pertanyaan Anda dengan besaran fisis yang terlibat? (Konteks profil Anda: fokus penguatan pada ${weakConcepts}).`;
      socraticLevel = 2;
    } else if (socraticLevel === 2) {
      responseText = `[Level 2 - Conceptual Hint] Petunjuk Konsep: ${topicKey ? LOCAL_KNOWLEDGE[topicKey] : 'Perhatikan rumus dan dimensi besaran pada kedua ruas persamaan.'}`;
      socraticLevel = 3;
    } else if (socraticLevel === 3) {
      responseText = `[Level 3 - Formula & Principle] Prinsip Fisika: Persamaan baku yang berlaku adalah F = m·a, v = v₀ + a·t, atau Ep = mgh. Perhatikan penggunaan satuan SI baku (seperti kg untuk massa).`;
      socraticLevel = 4;
    } else if (socraticLevel === 4) {
      responseText = `[Level 4 - Worked Example] Contoh Serupa: Jika m = 2 kg dan a = 3 m/s², maka F = 2 × 3 = 6 N. Coba terapkan langkah serupa pada angka soal Anda!`;
      socraticLevel = 5;
    } else {
      responseText = `[Level 5 - Direct Solution] Penjelasan Lengkap: ${topicKey ? LOCAL_KNOWLEDGE[topicKey] : 'Selalu pastikan kedua ruas persamaan memiliki dimensi yang identik.'}`;
      socraticLevel = 1; // Reset
    }

    return responseText;
  }

  function sendMessage(text) {
    if (!text || !text.trim()) return;
    const history = getHistory();

    // User Message
    history.push({ sender: 'user', text: text.trim(), timestamp: new Date().toISOString() });

    // AI Tutor Response
    const tutorReply = generateSocraticResponse(text.trim());
    history.push({ sender: 'tutor', text: tutorReply, timestamp: new Date().toISOString() });

    saveHistory(history);
    renderChatUI();
  }

  function renderChatUI() {
    const container = document.getElementById('fq-ai-chat-messages');
    if (!container) return;

    const history = getHistory();

    container.innerHTML = history.map(msg => `
      <div style="display: flex; justify-content: ${msg.sender === 'user' ? 'flex-end' : 'flex-start'}; margin-bottom: 14px;">
        <div style="max-width: 80%; background: ${msg.sender === 'user' ? 'linear-gradient(135deg, #06b6d4, #0284c7)' : 'rgba(30,41,59,0.85)'}; color: ${msg.sender === 'user' ? '#030712' : '#fff'}; border: ${msg.sender === 'tutor' ? '1px solid var(--fq-border-cyan)' : 'none'}; border-radius: 18px; padding: 14px 18px; font-size: 0.95rem; line-height: 1.5; text-align: left;">
          ${msg.sender === 'tutor' ? '<div style="font-size: 0.75rem; font-weight: 800; color: var(--fq-cyan); margin-bottom: 4px;"><i class="fas fa-robot"></i> FIVIA AI TUTOR</div>' : ''}
          ${msg.text}
        </div>
      </div>
    `).join('');

    container.scrollTop = container.scrollHeight;
  }

  return {
    getHistory: getHistory,
    sendMessage: sendMessage,
    renderChatUI: renderChatUI
  };
})();
