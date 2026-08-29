/**
 * ai-tutor.js
 * Physics AI Tutor chatbot engine with semantic context mapping
 */

let activeTutorContext = "Umum";

// Setting dynamic context based on active lab
function setTutorContext(labName) {
  activeTutorContext = labName;
}

document.addEventListener("DOMContentLoaded", () => {
  const chatInput = document.getElementById("ai-chat-input");
  const sendBtn = document.getElementById("btn-send-ai-chat");
  
  if (sendBtn && chatInput) {
    sendBtn.onclick = () => {
      handleChatSubmission();
    };

    chatInput.onkeydown = (e) => {
      if (e.key === "Enter") {
        handleChatSubmission();
      }
    };
  }
});

function handleChatSubmission() {
  const chatInput = document.getElementById("ai-chat-input");
  const query = chatInput.value.trim();
  if (!query) return;

  // Append student message
  appendChatBubble(query, "student");
  chatInput.value = "";

  // Show thinking placeholder
  const history = document.getElementById("ai-chat-history");
  const loadingBubble = document.createElement("div");
  loadingBubble.className = "chat-bubble ai";
  loadingBubble.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Sedang memikirkan penjelasan...`;
  history.appendChild(loadingBubble);
  history.scrollTop = history.scrollHeight;

  // Delayed response for realism
  setTimeout(() => {
    loadingBubble.remove();
    const answer = getTutorResponse(query);
    appendChatBubble(answer, "ai");
  }, 1000);
}

function appendChatBubble(text, sender) {
  const history = document.getElementById("ai-chat-history");
  if (!history) return;

  const bubble = document.createElement("div");
  bubble.className = `chat-bubble ${sender}`;
  bubble.innerHTML = text.replace(/\n/g, "<br>");
  history.appendChild(bubble);

  // Auto scroll
  history.scrollTop = history.scrollHeight;
}

// Simple rule-based physics heuristic engine
function getTutorResponse(query) {
  const q = query.toLowerCase();

  // Greeting checks
  if (q.match(/\b(halo|hai|p\b|helo|siang|pagi|sore|malam)\b/)) {
    return `Halo! Saya <strong>FIVIA AI Tutor ("Ask FIVIA")</strong>. Ada yang bisa saya bantu terkait praktikum <strong>${activeTutorContext}</strong> hari ini?`;
  }

  // Jangka Sorong (Vernier Caliper) keywords
  if (q.includes("jangka") || q.includes("sorong") || q.includes("caliper") || q.includes("skala nonius")) {
    return `<strong>Cara Membaca Jangka Sorong:</strong>
1. <strong>Skala Utama (SU):</strong> Lihat garis skala utama tepat di sebelah kiri angka 0 (nol) skala nonius. Nilai ini dalam satuan centimeter (cm) atau milimeter (mm).
2. <strong>Skala Nonius (SN):</strong> Cari garis skala nonius yang sejajar/lurus/segaris dengan garis pada skala utama. Kalikan angka skala nonius tersebut dengan ketelitian alat (misal: 0.1 mm atau 0.05 mm).
3. <strong>Hasil Akhir:</strong>
$$\\text{Hasil Ukur} = \\text{Skala Utama (SU)} + \\text{Skala Nonius (SN)}$$

<em>Contoh:</em> Jika SU menunjukkan 12 mm dan garis ke-7 nonius sejajar, maka hasil ukur = $12 \\text{ mm} + (7 \\times 0.05 \\text{ mm}) = 12.35 \\text{ mm}$.`;
  }

  // Micrometer Screw keywords
  if (q.includes("mikrometer") || q.includes("sekrup") || q.includes("sleeve") || q.includes("thimble")) {
    return `<strong>Cara Membaca Mikrometer Sekrup:</strong>
1. <strong>Skala Utama (Sleeve):</strong> Baca garis horizontal atas terakhir (skala utama 1 mm) dan bawah (skala setengah 0.5 mm) yang terlihat sebelum thimble.
2. <strong>Skala Putar (Thimble):</strong> Cari garis mendatar skala utama yang segaris lurus dengan garis skala thimble (angka 0-50). Kalikan nilai thimble dengan ketelitian $0.01 \\text{ mm}$.
3. <strong>Formulasi:</strong>
$$\\text{Hasil} = \\text{Skala Utama} + (\\text{Skala Thimble} \\times 0.01 \\text{ mm})$$

<em>Contoh:</em> Jika sleeve terbaca 5.5 mm dan thimble menunjukkan angka 25, maka pembacaan total = $5.5 \\text{ mm} + (25 \\times 0.01 \\text{ mm}) = 5.75 \\text{ mm}$.`;
  }

  // Ohm's law & circuits
  if (q.includes("ohm") || q.includes("arus") || q.includes("tegangan") || q.includes("hambatan") || q.includes("volt") || q.includes("resistor")) {
    return `<strong>Hukum Ohm & Rangkaian Listrik:</strong>
Hukum Ohm menyatakan bahwa kuat arus ($I$) yang mengalir dalam hambatan ($R$) berbanding lurus dengan beda potensial ($V$) yang diberikan.
$$\\text{Formulasi: } V = I \\times R \\quad \\rightarrow \\quad I = \\frac{V}{R} \\quad \\rightarrow \\quad R = \\frac{V}{I}$$
• $V$ = Tegangan Listrik (Volt)
• $I$ = Kuat Arus Listrik (Ampere)
• $R$ = Hambatan Listrik (Ohm / &Omega;)

<em>Petunjuk Praktikum:</em> Ubah tegangan baterai ke atas melalui slider, amati arah pergerakan elektron berwarna cyan. Jika nilai hambatan dinaikkan, arus akan mengecil dan lampu akan meredup sesuai hukum di atas.`;
  }

  // Kinematics / Motion
  if (q.includes("gerak") || q.includes("glb") || q.includes("percepatan") || q.includes("kecepatan") || q.includes("lintasan") || q.includes("posisi")) {
    return `<strong>Gerak Lurus (GLB & GLBB):</strong>
1. <strong>Gerak Lurus Beraturan (GLB):</strong> Kecepatan konstan ($a = 0$). Grafik s-t berupa garis lurus miring, v-t berupa garis horizontal mendatar.
$$s = v \\times t$$
2. <strong>Gerak Lurus Berubah Beraturan (GLBB):</strong> Kecepatan berubah teratur, percepatan konstan ($a = \\text{tetap}$). Grafik s-t berupa parabola melengkung.
$$v_t = v_0 + a \\cdot t \\qquad s = v_0 \\cdot t + \\frac{1}{2} a \\cdot t^2$$

<em>Petunjuk Praktikum:</em> Jalankan simulasi balok, lalu perhatikan grafik s-t (kurva melengkung ke atas menandakan GLBB dipercepat) dan v-t (garis linier naik).`;
  }

  // Force / Newton laws
  if (q.includes("gaya") || q.includes("newton") || q.includes("gesek") || q.includes("friction")) {
    return `<strong>Hukum Newton & Resultan Gaya:</strong>
• <strong>Hukum Newton I:</strong> Jika $\\Sigma F = 0$, benda diam akan tetap diam, benda bergerak akan bergerak lurus beraturan.
• <strong>Hukum Newton II:</strong> Percepatan sebanding dengan resultan gaya dan berbanding terbalik dengan massa.
$$\\Sigma F = m \\cdot a \\quad \\rightarrow \\quad a = \\frac{\\Sigma F}{m}$$
• <strong>Gaya Gesek:</strong> Gaya hambat permukaan benda $f_g = \\mu \\cdot N$. Jika gaya dorong lebih kecil dari gaya gesek statis maksimum ($f_{s\\text{max}}$), benda diam. Jika lolos, benda bergerak dipercepat meluncur dipengaruhi gaya gesek kinetis ($f_k$).`;
  }

  // Vector
  if (q.includes("vektor") || q.includes("vector") || q.includes("resultan") || q.includes("arah") || q.includes("komponen")) {
    return `<strong>Vektor dan Resultan Gaya:</strong>
Vektor adalah besaran yang memiliki nilai dan arah (contoh: gaya, perpindahan, kecepatan).
1. <strong>Metode Jajar Genjang:</strong>
Untuk menentukan besar resultan dari dua vektor $A$ dan $B$ dengan sudut apit $\\theta$:
$$R = \\sqrt{A^2 + B^2 + 2AB\\cos\\theta}$$
2. <strong>Metode Analitis (Komponen):</strong>
Uraikan setiap vektor ke sumbu X dan Y:
$$V_x = V \\cos\\theta \\qquad V_y = V \\sin\\theta$$
Resultan komponen sumbu X ($R_x$) dan sumbu Y ($R_y$):
$$R_x = \\Sigma V_x = A_x + B_x \\qquad R_y = \\Sigma V_y = A_y + B_y$$
Besar resultan akhir dan sudutnya terhadap sumbu X positif:
$$R = \\sqrt{R_x^2 + R_y^2} \\qquad \\theta_R = \\arctan\\left(\\frac{R_y}{R_x}\\right)$$

<em>Petunjuk Praktikum:</em> Atur slider panjang (magnitude) dan arah (sudut) Vektor A dan Vektor B. Amati visualisasi jajar genjang di canvas utama dan diagram komponen sumbu X dan sumbu Y di canvas grafik kanan!`;
  }

  // Physics fallback answer helper
  return `Pertanyaan Anda mengenai **"${query}"** sangat penting! 
Dalam konteks **Fisika Kurikulum Merdeka** pada modul **${activeTutorContext}**, cobalah untuk:
1. Menentukan variabel yang diketahui dari parameter input simulasi (misalnya: massa, panjang, atau amplitudo).
2. Tuliskan persamaan matematis dasar yang sesuai dengan topik ini, contohnya:
$$E = m \\cdot c^2 \\quad \\text{atau} \\quad F = m \\cdot a$$
3. Periksa grafik output untuk melihat pola visual apakah kurva naik linier, eksponensial, atau harmonik sinusoida.

Apakah ada bagian rumus spesifik yang ingin Anda diskusikan lebih mendalam?`;
  }

window.setTutorContext = setTutorContext;
