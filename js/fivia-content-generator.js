/**
 * FIVIA PHYSICS QUEST - AI CONTENT & MATERIAL GENERATOR MODULE
 * Allows teachers to upload documents (TXT, MD, CSV, JSON, PDF/DOCX text) or enter web URLs,
 * and generates Misconception-Free Learning Materials, HOTS Assessment Quizzes, and Interactive Game Items.
 */

window.FIVIAContentGenerator = (function() {
  'use strict';

  const STORAGE_KEY_CUSTOM_MATERI = 'fivia_custom_materials';
  const STORAGE_KEY_CUSTOM_QUIZ = 'fivia_custom_quizzes';
  const STORAGE_KEY_CUSTOM_GAME = 'fivia_custom_game_materials';
  const STORAGE_KEY_GEMINI_KEY = 'fivia_gemini_api_key';

  let currentGeneratedData = null;

  /**
   * Physics Misconception Reference Library
   * Maps common misconception triggers to scientific facts and intuitive explanations
   */
  const MISCONCEPTION_KNOWLEDGE_BASE = [
    {
      keywords: ["massa", "berat", "timbangan", "kg", "newton", "gravitasi"],
      misconception: "Massa dan Berat adalah hal yang sama, dan keduanya diukur dalam kilogram (kg).",
      fact: "Massa adalah jumlah materi dalam benda (skalar, kg) dan nilainya selalu tetap. Berat adalah gaya gravitasi yang bekerja pada massa tersebut (vektor, Newton) dan nilainya berubah tergantung percepatan gravitasi lokasi.",
      formula: "W = m \\times g",
      example: "Astronaut ber-massa 60 kg di Bumi tetap ber-massa 60 kg di Bulan, namun beratnya berkurang dari ~600 N menjadi ~100 N."
    },
    {
      keywords: ["gerak", "gaya", "berhenti", "newton 1", "inersia", "kecepatan"],
      misconception: "Benda yang sedang bergerak selalu membutuhkan gaya terus-menerus agar tetap bergerak. Tanpa gaya, benda akan langsung berhenti.",
      fact: "Sesuai Hukum Newton I (Inersia), benda yang sudah bergerak akan TETAP bergerak lurus beraturan dengan kecepatan konstan tanpa memerlukan gaya dorong, jika tidak ada gaya luar (seperti gesekan) yang menghambatnya.",
      formula: "\\Sigma F = 0 \\implies v = \\text{konstan}",
      example: "Pesawat luar angkasa Voyager terus meluncur di ruang hampa udara tanpa menyalakan mesin karena tidak ada gaya gesek atmosfer."
    },
    {
      keywords: ["gaya gesek", "gesekan", "hambat", "permukaan", "licin", "kasar"],
      misconception: "Gaya gesek selalu merugikan dan menghambat gerakan benda.",
      fact: "Gaya gesek juga dapat menjadi gaya pendorong utama yang memungkinkan benda bergerak maju, seperti gesekan antara ban mobil/sepatu kita dengan jalan raya.",
      formula: "f_g = \\mu \\times N",
      example: "Tanpa gaya gesek statis antara alas sepatu dan lantai, kita akan terpeleset dan tidak bisa berjalan ke depan."
    },
    {
      keywords: ["usaha", "energi", "lelah", "dorong tembok", "work"],
      misconception: "Mendorong dinding sampai lelah dan berkeringat berarti telah melakukan usaha fisika yang sangat besar.",
      fact: "Dalam fisika, Usaha (W) hanya terjadi jika ada perpindahan titik tangkap gaya (s > 0). Jika dinding tidak bergeser, maka Usaha Fisika = 0 Joule.",
      formula: "W = F \\times s \\times \\cos\\theta",
      example: "Seorang atlet menahan beban 100 kg tanpa bergerak melakukan gaya besar, namun usaha fisika bernilai nol karena perpindahan s = 0."
    },
    {
      keywords: ["suhu", "kalor", "panas", "es", "dingin", "termodinamika"],
      misconception: "Kalor dan Suhu adalah hal yang sama, serta rasa dingin 'mengalir' masuk ke dalam benda hangat.",
      fact: "Suhu adalah ukuran energi kinetik rata-rata partikel (derajat panas). Kalor adalah energi panas yang berpindah dari benda bersuhu lebih tinggi ke benda bersuhu lebih rendah. Rasa dingin adalah dampak hilangnya kalor dari tubuh, bukan aliran 'dingin'.",
      formula: "Q = m \\times c \\times \\Delta T",
      example: "Es batu di dalam gelas bukan menyalurkan dingin ke minuman, melainkan menyerap kalor dari minuman hangat sehingga suhu minuman turun."
    },
    {
      keywords: ["arus", "hambatan", "tegangan", "listrik", "baterai", "elektron"],
      misconception: "Baterai menyimpan dan mengeluarkan elektron yang habis setelah listrik digunakan.",
      fact: "Baterai tidak menciptakan atau memicu elektron dari luar, melainkan menyediakan Beda Potensial (Volt) untuk mendorong elektron yang sudah ada di dalam konduktor kabel agar bergerak melingkar.",
      formula: "V = I \\times R",
      example: "Elektron di dalam kawat tembaga bagaikan air di dalam pipa tertutup; baterai berfungsi sebagai pompa yang mendorong siklus air tersebut."
    },
    {
      keywords: ["cahaya", "bayangan", "cermin", "lensa", "pembiasan"],
      misconception: "Mata kita memancarkan sinar untuk melihat objek di sekitar kita.",
      fact: "Mata dapat melihat objek karena menerima berkas cahaya yang dipantulkan atau dipancarkan oleh objek tersebut menuju retina.",
      formula: "n_1 \\sin\\theta_1 = n_2 \\sin\\theta_2",
      example: "Di dalam ruang gelap gulita tanpa sumber cahaya, mata kita tidak dapat melihat benda apa pun."
    }
  ];

  /**
   * Cleans text extracted from PDF, Word or web content, removing raw binary & PDF/ZIP metadata garbage
   */
  function sanitizeExtractedText(rawText) {
    if (!rawText) return "";
    return rawText
      .replace(/%PDF-[\d\.]+/gi, "")
      .replace(/\d+\s+\d+\s+obj[\s\S]*?endobj/gi, "")
      .replace(/stream[\s\S]*?endstream/gi, "")
      .replace(/<<[\s\S]*?>>/g, "")
      .replace(/\/ViewerPreferences|\/MarkInfo|\/Metadata|\/Font|\/ProcSet|\/MediaBox|\/Group|\/Tabs/gi, "")
      .replace(/[^\x20-\x7E\u00A0-\u024F\n\r\t]/g, " ") // keep readable characters and extended latin
      .replace(/[\n\r]+/g, "\n")
      .replace(/[ \t]+/g, " ")
      .trim();
  }

  /**
   * Fallback PDF text stream parser (offline / built-in)
   */
  function extractPdfTextFromBinaryBuffer(buffer) {
    const bytes = new Uint8Array(buffer);
    let str = "";
    const chunkSize = 8192;
    for (let i = 0; i < bytes.length; i += chunkSize) {
      const chunk = bytes.subarray(i, i + chunkSize);
      let s = "";
      for (let j = 0; j < chunk.length; j++) {
        const b = chunk[j];
        if ((b >= 32 && b <= 126) || b === 10 || b === 13 || b === 9) {
          s += String.fromCharCode(b);
        } else {
          s += " ";
        }
      }
      str += s;
    }

    // Extract text in parentheses (PDF string literals: (Hello World))
    const matches = str.match(/\(([^()]{2,})\)/g);
    if (matches && matches.length > 0) {
      const textPieces = matches
        .map(m => m.slice(1, -1).trim())
        .filter(t => 
          t.length > 2 && 
          !t.startsWith("/") && 
          !t.startsWith("%PDF") && 
          !t.includes("endobj") && 
          !t.includes("Font") &&
          !t.includes("MediaBox") &&
          !t.includes("Metadata") &&
          !/^\d+\s+\d+\s+R$/.test(t)
        );

      if (textPieces.length > 0) {
        return sanitizeExtractedText(textPieces.join(" "));
      }
    }

    return sanitizeExtractedText(str);
  }

  /**
   * Client-side File Text Reader supporting TXT, MD, PDF, DOCX, CSV, JSON
   */
  async function readTextFromFile(file) {
    if (!file) throw new Error("File tidak ditemukan.");

    const fileName = file.name || "";
    const ext = fileName.split(".").pop().toLowerCase();

    // 1. Text-based files
    if (["txt", "md", "csv", "json", "html"].includes(ext)) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(sanitizeExtractedText(e.target.result));
        reader.onerror = () => reject(new Error("Gagal membaca file teks."));
        reader.readAsText(file);
      });
    }

    // 2. Read ArrayBuffer for PDF / DOCX
    const arrayBuffer = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = () => reject(new Error("Gagal membaca file."));
      reader.readAsArrayBuffer(file);
    });

    // 3. PDF Files
    if (ext === "pdf") {
      try {
        if (window.pdfjsLib) {
          pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
          const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) });
          const pdfDoc = await loadingTask.promise;
          let fullText = "";

          for (let i = 1; i <= pdfDoc.numPages; i++) {
            const page = await pdfDoc.getPage(i);
            const textContent = await page.getTextContent();
            const pageText = textContent.items.map(item => item.str).join(" ");
            fullText += pageText + "\n\n";
          }

          const cleanResult = sanitizeExtractedText(fullText);
          if (cleanResult && cleanResult.length > 20) {
            return cleanResult;
          }
        }
      } catch (err) {
        console.warn("PDF.js parsing error, using fallback PDF stream parser:", err);
      }

      return extractPdfTextFromBinaryBuffer(arrayBuffer);
    }

    // 4. DOCX Files
    if (ext === "docx" || ext === "doc") {
      try {
        if (window.mammoth) {
          const result = await mammoth.extractRawText({ arrayBuffer: arrayBuffer });
          if (result && result.value) {
            return sanitizeExtractedText(result.value);
          }
        }
      } catch (err) {
        console.warn("Mammoth.js DOCX parsing error:", err);
      }
    }

    // 5. Binary Fallback
    return extractPdfTextFromBinaryBuffer(arrayBuffer);
  }

  /**
   * Web URL Fetcher with CORS fallbacks
   */
  async function fetchWebContent(url) {
    if (!url || !url.startsWith("http")) {
      throw new Error("URL web tidak valid. Pastikan dimulai dengan http:// atau https://");
    }

    try {
      // Direct fetch attempt
      const res = await fetch(url, { mode: 'cors' });
      if (res.ok) {
        const html = await res.text();
        return cleanHtmlToText(html);
      }
    } catch (e) {
      console.warn("Direct fetch failed due to CORS, attempting proxy fetch...", e);
    }

    // Proxy fallback using allorigins
    try {
      const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
      const res = await fetch(proxyUrl);
      if (res.ok) {
        const json = await res.json();
        if (json.contents) {
          return cleanHtmlToText(json.contents);
        }
      }
    } catch (err) {
      console.warn("Proxy fetch failed:", err);
    }

    throw new Error("Tidak dapat mengambil isi web secara otomatis karena proteksi CORS. Silakan salin & tempel teks artikel ke dalam tab 'Unggah / Tempel Dokumen'.");
  }

  /**
   * Strips HTML tags and script/style content to extract clean plain text
   */
  function cleanHtmlToText(html) {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    
    // Remove unwanted tags
    const selectors = ['script', 'style', 'nav', 'footer', 'header', 'iframe', 'noscript'];
    selectors.forEach(sel => {
      doc.querySelectorAll(sel).forEach(el => el.remove());
    });

    const text = doc.body ? doc.body.textContent || "" : "";
    return text.replace(/\s+/g, ' ').trim();
  }

  /**
   * Main Generator Function
   * Decides whether to use Gemini API or Built-in Intelligent Parser
   */
  async function generateContent({ sourceText, topicTitle, classLevel, misconceptionFocus, apiKey }) {
    const cleanText = (sourceText || "").trim();
    if (!cleanText || cleanText.length < 30) {
      throw new Error("Sumber materi terlalu singkat! Masukkan minimal 30 karakter teks dokumen atau isi artikel web.");
    }

    const savedApiKey = apiKey || localStorage.getItem(STORAGE_KEY_GEMINI_KEY) || "";

    if (savedApiKey) {
      try {
        console.log("Generasi menggunakan Google Gemini API...");
        return await generateWithGeminiAPI(cleanText, topicTitle, classLevel, misconceptionFocus, savedApiKey);
      } catch (err) {
        console.warn("Gemini API Error, falling back to Intelligent Built-in Parser:", err);
      }
    }

    // Default: Built-in Heuristic & NLP Generator Engine
    console.log("Generasi menggunakan Built-in Heuristic NLP Engine...");
    return generateWithBuiltinNLP(cleanText, topicTitle, classLevel, misconceptionFocus);
  }

  /**
   * Built-in Intelligent Heuristic NLP Generator Engine
   */
  function generateWithBuiltinNLP(text, topicTitle, classLevel, misconceptionFocus, activeFileName = "") {
    const cleanText = sanitizeExtractedText(text);

    // Sanitize title to never be raw PDF junk
    let title = (topicTitle || "").trim();
    if (!title || title.includes("%PDF") || title.includes("obj") || title.includes("stream")) {
      title = extractTitleFromText(cleanText, activeFileName);
    }

    const level = classLevel || "Fase E (Kelas X)";
    const focus = misconceptionFocus || "Umum & Pengukuran";

    // 1. Identify relevant misconceptions from knowledge base
    const lowerText = cleanText.toLowerCase();
    let detectedMisconceptions = MISCONCEPTION_KNOWLEDGE_BASE.filter(item => {
      return item.keywords.some(kw => lowerText.includes(kw));
    });

    if (detectedMisconceptions.length === 0) {
      detectedMisconceptions = [MISCONCEPTION_KNOWLEDGE_BASE[0], MISCONCEPTION_KNOWLEDGE_BASE[1], MISCONCEPTION_KNOWLEDGE_BASE[3]];
    }

    // Extract sentences for summary, ensuring no binary PDF fragments remain
    const sentences = cleanText
      .split(/(?<=[.!?])\s+|\n+/)
      .map(s => s.trim())
      .filter(s => 
        s.length > 15 && 
        !s.startsWith("%") && 
        !s.startsWith("/") && 
        !s.includes("obj") && 
        !s.includes("stream") && 
        !s.includes("MediaBox") &&
        !s.includes("Metadata")
      );

    const summaryText = sentences.slice(0, 5).join(" ");
    const detailBody = sentences.slice(0, 15).join(" ");

    // Build Material Payload
    const materialData = {
      id: Date.now(),
      name: title,
      fase: level.includes("Fase F") ? "F" : "E",
      topic: `${focus} — Generasi Guru Bebas Miskonsepsi`,
      equation: detectedMisconceptions[0]?.formula || "F = m \\cdot a \\quad \\text{atau} \\quad W = F \\cdot s",
      desc: summaryText || "Materi ini disusun secara otomatis dari sumber belajar guru dengan verifikasi pencegahan miskonsepsi fisika.",
      detailBody: detailBody || cleanText.substr(0, 500),
      misconceptionList: detectedMisconceptions.map(m => ({
        misconception: m.misconception,
        fact: m.fact,
        formula: m.formula,
        example: m.example
      })),
      isTeacherCreated: true,
      createdAt: new Date().toISOString()
    };

    // Build Quiz Payload (5 HOTS Multiple Choice Questions)
    const quizQuestions = buildQuizFromMisconceptions(title, detectedMisconceptions, sentences);

    // Build Game Payload (Myth vs Fact Cards & Quest Cards)
    const gameMaterials = buildGameItemsFromMisconceptions(title, detectedMisconceptions);

    return {
      material: materialData,
      quiz: {
        id: `quiz_custom_${materialData.id}`,
        materialId: materialData.id,
        title: `Kuis Evaluasi: ${title}`,
        questions: quizQuestions
      },
      gameItems: gameMaterials
    };
  }

  /**
   * Helper to extract title candidate from text or file name
   */
  function extractTitleFromText(text, fallbackFileName = "") {
    const cleanText = sanitizeExtractedText(text);
    const lines = cleanText
      .split(/\n/)
      .map(l => l.trim())
      .filter(l => 
        l.length >= 3 && 
        l.length <= 80 && 
        !l.startsWith("%") && 
        !l.startsWith("/") && 
        !l.includes("obj") && 
        !l.includes("stream") && 
        !l.includes("Metadata") &&
        !/^\d+$/.test(l)
      );

    if (lines.length > 0) {
      const candidate = lines[0].replace(/^[#*=\-\s]+/, '').trim();
      if (candidate.length >= 3) return candidate;
    }

    if (fallbackFileName) {
      const cleanName = fallbackFileName
        .replace(/\.[^/.]+$/, "")
        .replace(/^[0-9_\-\s]+/, "")
        .replace(/[_\-]+/g, " ")
        .trim();
      if (cleanName.length >= 3) return cleanName;
    }

    return "Pengukuran dan Konsep Dasar Fisika";
  }

  /**
   * Helper to build HOTS quiz questions based on extracted misconceptions
   */
  function buildQuizFromMisconceptions(title, misconceptions, sentences) {
    const questions = [];

    misconceptions.forEach((item, idx) => {
      questions.push({
        id: `q_custom_${idx + 1}`,
        question: `Seorang siswa beranggapan bahwa "${item.misconception}". Berdasarkan konsep fisika yang benar, bagaimanakah penjelasan ilmiah yang tepat?`,
        options: [
          `Pernyataan siswa salah. ${item.fact}`,
          `Pernyataan siswa benar sepenuhnya karena sesuai dengan pengalaman sehari-hari.`,
          `Pernyataan tersebut hanya berlaku di ruang hampa udara, sedangkan di Bumi sebaliknya.`,
          `Pernyataan siswa salah karena tidak menggunakan besaran turunan.`
        ],
        correct: 0,
        explanation: `Sains Fisika menegaskan: ${item.fact} Rumus terkait: $$${item.formula}$$. ${item.example}`
      });
    });

    // Additional conceptual question
    questions.push({
      id: `q_custom_${questions.length + 1}`,
      question: `Dalam topik "${title}", mengapa penting untuk membedakan antara besaran pokok dan besaran turunan?`,
      options: [
        `Agar dapat mengukur dan menganalisis fenomena alam secara presisi tanpa kerancuan definisi dan satuan.`,
        `Agar semua alat ukur fisika memiliki harga yang lebih murah.`,
        `Karena besaran pokok tidak memiliki satuan SI.`,
        `Karena besaran turunan hanya ada di Indonesia.`
      ],
      correct: 0,
      explanation: `Pemahaman hirarki besaran pokok dan turunan mencegah miskonsepsi pengukuran serta memastikan analisis dimensi dalam SI valid.`
    });

    questions.push({
      id: `q_custom_${questions.length + 1}`,
      question: `Manakah dari situasi berikut yang menunjukkan penerapan Hukum Fisika yang BEBAS dari miskonsepsi?`,
      options: [
        misconceptions[0]?.example ? `Memahami bahwa ${misconceptions[0].example}` : `Memahami bahwa usaha bernilai nol jika s = 0`,
        `Menganggap bahwa gaya selalu diperlukan agar benda bergerak terus`,
        `Menyebut berat benda dalam satuan kilogram pada laporan laboratorium`,
        `Menganggap bahwa energi selalu musnah setelah digunakan`
      ],
      correct: 0,
      explanation: `Memahami konsep fisis secara presisi mencegah kesalahan analisis pada percobaan praktikum.`
    });

    return questions;
  }

  /**
   * Helper to build Myth vs Fact mini-game cards & quest tasks
   */
  function buildGameItemsFromMisconceptions(title, misconceptions) {
    const mythCards = misconceptions.map((m, idx) => ({
      id: `myth_card_${idx + 1}`,
      topic: title,
      statement: m.misconception,
      isMyth: true, // It is a misconception/myth
      correctTruth: m.fact,
      formula: m.formula,
      xpReward: 20
    }));

    // Add a couple of true fact cards for balanced game dynamics
    mythCards.push({
      id: `fact_card_1`,
      topic: title,
      statement: "Besaran skalar hanya memiliki nilai tanpa memiliki arah spesifik.",
      isMyth: false, // It is a true fact!
      correctTruth: "Fakta Ilmiah! Skalar seperti massa dan suhu hanya memiliki nilai besar.",
      formula: "m, T, t",
      xpReward: 15
    });

    mythCards.push({
      id: `fact_card_2`,
      topic: title,
      statement: "Usaha bernilai nol jika tidak ada perpindahan posisi pada benda.",
      isMyth: false, // It is a true fact!
      correctTruth: "Fakta Ilmiah! Usaha W = F x s x cos(theta). Jika s = 0, maka W = 0.",
      formula: "W = F \\cdot s",
      xpReward: 15
    });

    return {
      topicTitle: title,
      mythVsFactCards: mythCards,
      questTask: {
        title: `Misi Detektif: Penyelidikan ${title}`,
        instructions: `Analisis 5 pernyataan fisika pada kartu gim. Klasifikasikan mana pernyataan yang merupakan MITOS MISKONSEPSI dan mana FAKTA ILMIAH untuk mendapatkan Badge Ahli Fisika!`,
        targetXP: 100
      }
    };
  }

  /**
   * Generates content using Google Gemini API
   */
  async function generateWithGeminiAPI(text, topicTitle, classLevel, misconceptionFocus, apiKey) {
    const prompt = `Anda adalah Pakar Edukasi Fisika SMA Kurikulum Merdeka dan AI Master Teacher.
Tugas Anda: Analisis teks sumber belajar berikut, lalu hasilkan materi pembelajaran fisika yang BEBAS MISKONSEPSI, soal kuis HOTS, dan kartu gim interaktif.

SUMBER DOKUMEN:
"""
${text.substr(0, 4000)}
"""

PETUNJUK SPESIFIK:
- Judul Topik: ${topicTitle || 'Pengukuran & Konsep Fisika'}
- Tingkat: ${classLevel || 'Fase E (Kelas X)'}
- Fokus: ${misconceptionFocus || 'Klasifikasi Miskonsepsi vs Fakta'}

OUTPUT HARUS DALAM FORMAT JSON VALID DENGAN STRUKTUR BERIKUT:
{
  "material": {
    "name": "Judul Materi Presisi",
    "topic": "Deskripsi Singkat Topik",
    "equation": "Persamaan LaTeX Utama",
    "desc": "Ringkasan Eksekutif Materi (2-3 kalimat)",
    "detailBody": "Penjelasan Teori Lengkap Bebas Miskonsepsi (minimal 3 paragraf)",
    "misconceptionList": [
      {
        "misconception": "Miskonsepsi yang sering terjadi pada siswa",
        "fact": "Kebenaran ilmiah yang presisi",
        "formula": "Rumus LaTeX pendukung",
        "example": "Contoh fenomena nyata"
      }
    ]
  },
  "quiz": {
    "questions": [
      {
        "id": "q1",
        "question": "Pertanyaan HOTS pilihan ganda",
        "options": ["Pilihan A (Benar)", "Pilihan B (Salah)", "Pilihan C (Salah)", "Pilihan D (Salah)"],
        "correct": 0,
        "explanation": "Pembahasan ilmiah mendalam anti-miskonsepsi"
      }
    ]
  },
  "gameItems": {
    "topicTitle": "Judul Topik Gim",
    "mythVsFactCards": [
      {
        "id": "card_1",
        "statement": "Pernyataan fisika",
        "isMyth": true,
        "correctTruth": "Kebenaran ilmiah",
        "formula": "Rumus",
        "xpReward": 20
      }
    ],
    "questTask": {
      "title": "Judul Misi",
      "instructions": "Instruksi Misi Praktikum/Tantangan",
      "targetXP": 100
    }
  }
}

Kembalikan HANYA JSON tersebut tanpa teks pembungkus markdown tambahan.`;

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Gemini API Error (${res.status}): ${errText}`);
    }

    const data = await res.json();
    const rawContent = data.candidates?.[0]?.content?.parts?.[0]?.text || "";

    // Clean json formatting
    const cleanJsonText = rawContent.replace(/```json/gi, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(cleanJsonText);

    // Format & validate parsed data
    const matId = Date.now();
    parsed.material.id = matId;
    parsed.material.fase = (classLevel || "").includes("Fase F") ? "F" : "E";
    parsed.material.isTeacherCreated = true;
    parsed.material.createdAt = new Date().toISOString();

    parsed.quiz.id = `quiz_custom_${matId}`;
    parsed.quiz.materialId = matId;

    return parsed;
  }

  /**
   * Saves Generated Content to Database and LocalStorage
   */
  function saveAndPublishGeneratedContent(data) {
    if (!data || !data.material || !data.quiz) {
      throw new Error("Data materi tidak valid untuk dipublikasikan.");
    }

    if (window.db && window.db.saveCustomMaterial) {
      window.db.saveCustomMaterial(data.material, data.quiz, data.gameItems);
    } else {
      // Direct LocalStorage fallback
      const existingMaterials = JSON.parse(localStorage.getItem(STORAGE_KEY_CUSTOM_MATERI) || '[]');
      existingMaterials.push(data.material);
      localStorage.setItem(STORAGE_KEY_CUSTOM_MATERI, JSON.stringify(existingMaterials));

      const existingQuizzes = JSON.parse(localStorage.getItem(STORAGE_KEY_CUSTOM_QUIZ) || '[]');
      existingQuizzes.push(data.quiz);
      localStorage.setItem(STORAGE_KEY_CUSTOM_QUIZ, JSON.stringify(existingQuizzes));

      const existingGames = JSON.parse(localStorage.getItem(STORAGE_KEY_CUSTOM_GAME) || '[]');
      existingGames.push(data.gameItems);
      localStorage.setItem(STORAGE_KEY_CUSTOM_GAME, JSON.stringify(existingGames));
    }

    return true;
  }

  /**
   * Retrieves Custom Materials saved by teachers
   */
  function getCustomMaterials() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY_CUSTOM_MATERI) || '[]');
    } catch (e) {
      return [];
    }
  }

  /**
   * Retrieves Custom Quizzes saved by teachers
   */
  function getCustomQuizzes() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY_CUSTOM_QUIZ) || '[]');
    } catch (e) {
      return [];
    }
  }

  /**
   * Retrieves Custom Game Items saved by teachers
   */
  function getCustomGameItems() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY_CUSTOM_GAME) || '[]');
    } catch (e) {
      return [];
    }
  }

  /**
   * Renders the Interactive Preview & Customization Modal
   */
  function renderPreviewModal(generatedData) {
    currentGeneratedData = generatedData;

    const modal = document.getElementById("generator-preview-modal");
    if (!modal) {
      console.error("Modal #generator-preview-modal tidak ditemukan.");
      return;
    }

    const { material, quiz, gameItems } = generatedData;

    // Populate Tab 1: Materi & Miskonsepsi
    const matTitleInput = document.getElementById("gen-preview-mat-title");
    const matDescInput = document.getElementById("gen-preview-mat-desc");
    const matEqInput = document.getElementById("gen-preview-mat-eq");
    const matBodyInput = document.getElementById("gen-preview-mat-body");
    const miscContainer = document.getElementById("gen-preview-misconception-list");

    if (matTitleInput) matTitleInput.value = material.name || "";
    if (matDescInput) matDescInput.value = material.desc || "";
    if (matEqInput) matEqInput.value = material.equation || "";
    if (matBodyInput) matBodyInput.value = material.detailBody || "";

    if (miscContainer) {
      miscContainer.innerHTML = (material.misconceptionList || []).map((m, idx) => `
        <div class="misconception-card" style="background: rgba(239, 68, 68, 0.08); border: 1px solid rgba(239, 68, 68, 0.3); border-radius: 12px; padding: 16px; margin-bottom: 12px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <span class="badge" style="background: #ef4444; color: #fff; font-weight: 800;">❌ MISKONSEPSI #${idx + 1}</span>
            <span class="badge" style="background: #10b981; color: #fff; font-weight: 800;">✅ KEBENARAN FISIS</span>
          </div>
          <div style="margin-bottom: 8px;">
            <label style="font-size: 0.75rem; color: var(--text-secondary); font-weight: 700;">Miskonsepsi Sering Terjadi:</label>
            <input type="text" class="form-control gen-misc-input" data-idx="${idx}" data-field="misconception" value="${m.misconception.replace(/"/g, '&quot;')}" style="margin-top: 4px; font-weight: 600; color: #ef4444;">
          </div>
          <div style="margin-bottom: 8px;">
            <label style="font-size: 0.75rem; color: var(--text-secondary); font-weight: 700;">Fakta Ilmiah Presisi:</label>
            <textarea class="form-control gen-misc-input" data-idx="${idx}" data-field="fact" rows="2" style="margin-top: 4px; font-weight: 600; color: #10b981;">${m.fact}</textarea>
          </div>
          <div>
            <label style="font-size: 0.75rem; color: var(--text-secondary); font-weight: 700;">Contoh / Formulasi Pendukung:</label>
            <input type="text" class="form-control gen-misc-input" data-idx="${idx}" data-field="example" value="${(m.example || m.formula || '').replace(/"/g, '&quot;')}" style="margin-top: 4px; font-size: 0.85rem;">
          </div>
        </div>
      `).join('');
    }

    // Populate Tab 2: Kuis Evaluasi
    const quizContainer = document.getElementById("gen-preview-quiz-list");
    if (quizContainer) {
      quizContainer.innerHTML = (quiz.questions || []).map((q, qIdx) => `
        <div class="quiz-editor-card" style="background: rgba(30, 41, 59, 0.6); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 12px; padding: 16px; margin-bottom: 16px;">
          <div style="font-weight: 800; color: var(--brand-cyan); margin-bottom: 8px;">SOAL EVALUASI #${qIdx + 1}</div>
          <div style="margin-bottom: 10px;">
            <label style="font-size: 0.75rem; color: var(--text-secondary);">Pertanyaan:</label>
            <textarea class="form-control gen-quiz-input" data-qidx="${qIdx}" data-field="question" rows="2" style="margin-top: 4px;">${q.question}</textarea>
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 10px;">
            ${(q.options || []).map((opt, optIdx) => `
              <div>
                <label style="font-size: 0.7rem; color: ${optIdx === q.correct ? '#10b981' : 'var(--text-secondary)'}; font-weight: 700;">Opsi ${String.fromCharCode(65 + optIdx)} ${optIdx === q.correct ? '(Jawaban Benar)' : ''}:</label>
                <input type="text" class="form-control gen-quiz-opt" data-qidx="${qIdx}" data-optidx="${optIdx}" value="${opt.replace(/"/g, '&quot;')}" style="margin-top: 2px;">
              </div>
            `).join('')}
          </div>
          <div>
            <label style="font-size: 0.75rem; color: var(--text-secondary);">Pembahasan Bebas Miskonsepsi:</label>
            <textarea class="form-control gen-quiz-input" data-qidx="${qIdx}" data-field="explanation" rows="2" style="margin-top: 4px; font-size: 0.85rem;">${q.explanation}</textarea>
          </div>
        </div>
      `).join('');
    }

    // Populate Tab 3: Bahan Gim
    const gameCardsContainer = document.getElementById("gen-preview-game-cards");
    if (gameCardsContainer && gameItems) {
      gameCardsContainer.innerHTML = (gameItems.mythVsFactCards || []).map((card, cIdx) => `
        <div style="background: rgba(15, 23, 42, 0.8); border: 1.5px solid ${card.isMyth ? '#ef4444' : '#10b981'}; border-radius: 12px; padding: 14px; margin-bottom: 10px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
            <span class="badge" style="background: ${card.isMyth ? '#ef4444' : '#10b981'}; font-size: 0.75rem;">${card.isMyth ? '🎮 MITOS MISKONSEPSI' : '🎮 FAKTA ILMIAH'}</span>
            <span style="font-size: 0.75rem; color: var(--brand-orange); font-weight: 800;">+${card.xpReward} XP</span>
          </div>
          <div style="font-weight: 700; color: #fff; font-size: 0.9rem; margin-bottom: 4px;">"${card.statement}"</div>
          <div style="font-size: 0.8rem; color: var(--text-secondary);">${card.correctTruth}</div>
        </div>
      `).join('');
    }

    if (window.openModal) {
      window.openModal("generator-preview-modal");
    } else {
      modal.style.display = "flex";
    }
  }

  /**
   * Collects current edited inputs from preview modal
   */
  function syncEditedPreviewData() {
    if (!currentGeneratedData) return null;

    // Sync Material
    const matTitle = document.getElementById("gen-preview-mat-title")?.value;
    const matDesc = document.getElementById("gen-preview-mat-desc")?.value;
    const matEq = document.getElementById("gen-preview-mat-eq")?.value;
    const matBody = document.getElementById("gen-preview-mat-body")?.value;

    if (matTitle) currentGeneratedData.material.name = matTitle;
    if (matDesc) currentGeneratedData.material.desc = matDesc;
    if (matEq) currentGeneratedData.material.equation = matEq;
    if (matBody) currentGeneratedData.material.detailBody = matBody;

    // Sync Misconceptions
    document.querySelectorAll(".gen-misc-input").forEach(input => {
      const idx = parseInt(input.getAttribute("data-idx"));
      const field = input.getAttribute("data-field");
      if (currentGeneratedData.material.misconceptionList[idx]) {
        currentGeneratedData.material.misconceptionList[idx][field] = input.value;
      }
    });

    // Sync Quiz Questions
    document.querySelectorAll(".gen-quiz-input").forEach(input => {
      const qIdx = parseInt(input.getAttribute("data-qidx"));
      const field = input.getAttribute("data-field");
      if (currentGeneratedData.quiz.questions[qIdx]) {
        currentGeneratedData.quiz.questions[qIdx][field] = input.value;
      }
    });

    document.querySelectorAll(".gen-quiz-opt").forEach(input => {
      const qIdx = parseInt(input.getAttribute("data-qidx"));
      const optIdx = parseInt(input.getAttribute("data-optidx"));
      if (currentGeneratedData.quiz.questions[qIdx]?.options[optIdx] !== undefined) {
        currentGeneratedData.quiz.questions[qIdx].options[optIdx] = input.value;
      }
    });

    return currentGeneratedData;
  }

  /**
   * Initializes all DOM UI Event Listeners for Generator Section & Modal
   */
  function initUIEvents() {
    // 1. Input Tab Switcher
    const btnTabDoc = document.getElementById("btn-tab-gen-doc");
    const btnTabUrl = document.getElementById("btn-tab-gen-url");
    const panelDoc = document.getElementById("gen-panel-doc");
    const panelUrl = document.getElementById("gen-panel-url");

    if (btnTabDoc && btnTabUrl && panelDoc && panelUrl) {
      btnTabDoc.onclick = () => {
        btnTabDoc.style.background = "rgba(168, 85, 247, 0.2)";
        btnTabDoc.style.borderColor = "#a855f7";
        btnTabDoc.style.color = "#fff";

        btnTabUrl.style.background = "transparent";
        btnTabUrl.style.borderColor = "transparent";
        btnTabUrl.style.color = "var(--text-secondary)";

        panelDoc.classList.remove("hidden-section");
        panelUrl.classList.add("hidden-section");
      };

      btnTabUrl.onclick = () => {
        btnTabUrl.style.background = "rgba(168, 85, 247, 0.2)";
        btnTabUrl.style.borderColor = "#a855f7";
        btnTabUrl.style.color = "#fff";

        btnTabDoc.style.background = "transparent";
        btnTabDoc.style.borderColor = "transparent";
        btnTabDoc.style.color = "var(--text-secondary)";

        panelUrl.classList.remove("hidden-section");
        panelDoc.classList.add("hidden-section");
      };
    }

    // 2. File Upload Handling
    const fileInput = document.getElementById("gen-file-input");
    const fileNameLabel = document.getElementById("gen-file-name-label");
    const docTextArea = document.getElementById("gen-doc-text");
    let activeLoadedFileName = "";

    if (fileInput && docTextArea) {
      fileInput.onchange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        activeLoadedFileName = file.name || "";
        if (fileNameLabel) fileNameLabel.textContent = `📄 ${file.name} (${(file.size / 1024).toFixed(1)} KB)`;

        try {
          const text = await readTextFromFile(file);
          docTextArea.value = text;

          // Auto suggest Topic Title if field is empty or contains raw PDF/ZIP tags
          const topicInput = document.getElementById("gen-topic-title");
          if (topicInput) {
            const currentVal = topicInput.value ? topicInput.value.trim() : "";
            if (!currentVal || currentVal.includes("%PDF") || currentVal.includes("obj") || currentVal.includes("stream")) {
              topicInput.value = extractTitleFromText(text, file.name);
            }
          }

          if (window.showToast) window.showToast(`Berhasil membaca dokumen "${file.name}"!`);
        } catch (err) {
          alert(`Error membaca file: ${err.message}`);
        }
      };
    }

    // 3. Web URL Fetcher Handling
    const btnFetchUrl = document.getElementById("btn-fetch-web-url");
    const urlInput = document.getElementById("gen-web-url-input");
    const urlStatus = document.getElementById("gen-url-status");

    if (btnFetchUrl && urlInput) {
      btnFetchUrl.onclick = async () => {
        const url = urlInput.value.trim();
        if (!url) {
          alert("Masukkan URL web terlebih dahulu.");
          return;
        }

        btnFetchUrl.disabled = true;
        btnFetchUrl.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Mengambil...`;
        if (urlStatus) urlStatus.innerHTML = `<span style="color: #38bdf8;">Sedang mengontak server web...</span>`;

        try {
          const webText = await fetchWebContent(url);
          if (docTextArea) docTextArea.value = webText;

          if (urlStatus) urlStatus.innerHTML = `<span style="color: #10b981;"><i class="fas fa-check"></i> Berhasil mengambil ${webText.length} karakter dari web!</span>`;
          if (window.showToast) window.showToast("Berhasil mengambil artikel dari URL web!");
        } catch (err) {
          if (urlStatus) urlStatus.innerHTML = `<span style="color: #ef4444;"><i class="fas fa-exclamation-triangle"></i> ${err.message}</span>`;
          alert(err.message);
        } finally {
          btnFetchUrl.disabled = false;
          btnFetchUrl.innerHTML = `<i class="fas fa-download"></i> Ambil Konten Web`;
        }
      };
    }

    // 4. Run Generator Action
    const btnRunGen = document.getElementById("btn-run-content-generator");
    if (btnRunGen) {
      btnRunGen.onclick = async () => {
        const sourceText = docTextArea ? docTextArea.value : "";
        const topicTitle = document.getElementById("gen-topic-title")?.value;
        const classLevel = document.getElementById("gen-class-level")?.value;
        const misconceptionFocus = document.getElementById("gen-misc-focus")?.value;
        const apiKey = document.getElementById("gen-gemini-api-key")?.value;

        if (!sourceText || sourceText.trim().length < 30) {
          alert("Mohon masukkan atau unggah dokumen teks sumber belajar terlebih dahulu (minimal 30 karakter).");
          return;
        }

        btnRunGen.disabled = true;
        btnRunGen.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Menganalisis &amp; Membasmi Miskonsepsi...`;

        try {
          const result = await generateContent({
            sourceText,
            topicTitle,
            classLevel,
            misconceptionFocus,
            apiKey
          });

          if (window.showToast) window.showToast("Generasi berhasil! Membuka pratinjau editor...");
          renderPreviewModal(result);
        } catch (err) {
          console.error("Generator execution error:", err);
          alert(`Gagal melakukan generasi: ${err.message}`);
        } finally {
          btnRunGen.disabled = false;
          btnRunGen.innerHTML = `<i class="fas fa-bolt"></i> ⚡ Generasi Materi, Soal &amp; Bahan Gim`;
        }
      };
    }

    // 5. Preview Modal Tab Switcher
    const btnGenTabMat = document.getElementById("btn-gen-tab-mat");
    const btnGenTabQuiz = document.getElementById("btn-gen-tab-quiz");
    const btnGenTabGame = document.getElementById("btn-gen-tab-game");

    const panelMat = document.getElementById("gen-modal-panel-mat");
    const panelQuiz = document.getElementById("gen-modal-panel-quiz");
    const panelGame = document.getElementById("gen-modal-panel-game");

    if (btnGenTabMat && btnGenTabQuiz && btnGenTabGame && panelMat && panelQuiz && panelGame) {
      btnGenTabMat.onclick = () => {
        btnGenTabMat.classList.add("active");
        btnGenTabQuiz.classList.remove("active");
        btnGenTabGame.classList.remove("active");

        panelMat.classList.remove("hidden-section");
        panelQuiz.classList.add("hidden-section");
        panelGame.classList.add("hidden-section");
      };

      btnGenTabQuiz.onclick = () => {
        btnGenTabQuiz.classList.add("active");
        btnGenTabMat.classList.remove("active");
        btnGenTabGame.classList.remove("active");

        panelQuiz.classList.remove("hidden-section");
        panelMat.classList.add("hidden-section");
        panelGame.classList.add("hidden-section");
      };

      btnGenTabGame.onclick = () => {
        btnGenTabGame.classList.add("active");
        btnGenTabMat.classList.remove("active");
        btnGenTabQuiz.classList.remove("active");

        panelGame.classList.remove("hidden-section");
        panelMat.classList.add("hidden-section");
        panelQuiz.classList.add("hidden-section");
      };
    }

    // 6. Publish Button
    const btnPublish = document.getElementById("btn-publish-gen-content");
    if (btnPublish) {
      btnPublish.onclick = () => {
        const syncedData = syncEditedPreviewData();
        if (!syncedData) {
          alert("Gagal membaca data terkini.");
          return;
        }

        try {
          saveAndPublishGeneratedContent(syncedData);

          if (window.closeModal) window.closeModal("generator-preview-modal");
          else document.getElementById("generator-preview-modal").classList.remove("active");

          if (window.showToast) {
            window.showToast(`🎉 Materi "${syncedData.material.name}" & Kuis HOTS berhasil dipublikasikan ke seluruh siswa!`);
          } else {
            alert(`🎉 Materi "${syncedData.material.name}" berhasil dipublikasikan!`);
          }

          // Navigate to materials list to showcase newly added material!
          window.location.hash = "#materi";
          if (window.renderMaterialsList) window.renderMaterialsList();
        } catch (err) {
          alert(`Gagal mempublikasikan: ${err.message}`);
        }
      };
    }

    // 7. Export JSON Button
    const btnExportJson = document.getElementById("btn-export-gen-json");
    if (btnExportJson) {
      btnExportJson.onclick = () => {
        const syncedData = syncEditedPreviewData();
        if (!syncedData) return;

        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(syncedData, null, 2));
        const dlAnchor = document.createElement('a');
        dlAnchor.setAttribute("href", dataStr);
        dlAnchor.setAttribute("download", `FIVIA_Material_${syncedData.material.name.replace(/[^a-z0-9]/gi, '_')}.json`);
        document.body.appendChild(dlAnchor);
        dlAnchor.click();
        dlAnchor.remove();
      };
    }
  }

  // Auto-init DOM bindings on DOMContentLoaded or immediate execution if already loaded
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initUIEvents);
  } else {
    setTimeout(initUIEvents, 200);
  }

  return {
    readTextFromFile,
    fetchWebContent,
    generateContent,
    saveAndPublishGeneratedContent,
    getCustomMaterials,
    getCustomQuizzes,
    getCustomGameItems,
    renderPreviewModal,
    syncEditedPreviewData,
    initUIEvents
  };
})();
