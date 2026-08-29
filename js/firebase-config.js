/**
 * js/firebase-config.js
 * Firebase Configuration, Initialization & Cloud State Manager for FIVIA
 */

const FIREBASE_CONFIG_STORAGE_KEY = "fivia_firebase_config";

// Default template config (can be updated dynamically from Admin UI or settings)
const DEFAULT_FIREBASE_CONFIG = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: ""
};

window.FIVIA_FIREBASE = {
  app: null,
  db: null,
  auth: null,
  isConnected: false,
  isInitialized: false,
  statusListeners: []
};

/**
 * Retrieve stored Firebase configuration from localStorage or default
 */
function getFirebaseConfig() {
  try {
    const saved = localStorage.getItem(FIREBASE_CONFIG_STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.warn("[Firebase Config] Error parsing saved config:", e);
  }
  return DEFAULT_FIREBASE_CONFIG;
}

/**
 * Save Firebase configuration to localStorage and re-initialize
 */
function saveFirebaseConfig(config) {
  try {
    localStorage.setItem(FIREBASE_CONFIG_STORAGE_KEY, JSON.stringify(config));
    return initFirebase(config);
  } catch (e) {
    console.error("[Firebase Config] Error saving config:", e);
    return false;
  }
}

/**
 * Reset Firebase configuration
 */
function resetFirebaseConfig() {
  localStorage.removeItem(FIREBASE_CONFIG_STORAGE_KEY);
  window.FIVIA_FIREBASE.isConnected = false;
  window.FIVIA_FIREBASE.isInitialized = false;
  notifyFirebaseStatus(false, "Konfigurasi Firebase direset. Beralih ke Local Storage.");
}

/**
 * Add status listener callback
 */
function onFirebaseStatusChange(callback) {
  if (typeof callback === "function") {
    window.FIVIA_FIREBASE.statusListeners.push(callback);
    callback(window.FIVIA_FIREBASE.isConnected, window.FIVIA_FIREBASE.isInitialized);
  }
}

function notifyFirebaseStatus(connected, message = "") {
  window.FIVIA_FIREBASE.isConnected = connected;
  window.FIVIA_FIREBASE.statusListeners.forEach((cb) => {
    try { cb(connected, message); } catch (_) {}
  });

  // Update UI Badge if exists
  const badge = document.getElementById("firebase-status-badge");
  if (badge) {
    badge.innerHTML = connected 
      ? `<i class="fas fa-cloud" style="color: #22c55e;"></i> Cloud Terhubung` 
      : `<i class="fas fa-database" style="color: #f59e0b;"></i> Local Storage (Offline)`;
    badge.title = connected 
      ? "Tersinkronisasi Realtime dengan Firebase Cloud Firestore" 
      : "Data tersimpan di perangkat lokal. Sambungkan Firebase untuk sinkronisasi cloud.";
  }
}

/**
 * Initialize Firebase with the provided or stored credentials
 */
async function initFirebase(customConfig = null) {
  const config = customConfig || getFirebaseConfig();

  // Validate if minimum keys are present
  if (!config.apiKey || !config.projectId) {
    console.log("[Firebase] Kredensial Firebase belum diatur. Menggunakan penyimpanan offline bawaan (LocalStorage).");
    notifyFirebaseStatus(false, "Kredensial belum diisi (Mode Offline).");
    return false;
  }

  try {
    // Check if Firebase SDK is loaded
    if (typeof firebase === "undefined") {
      console.warn("[Firebase] SDK Firebase tidak terdeteksi. Menggunakan mode offline.");
      notifyFirebaseStatus(false, "SDK Firebase tidak termuat.");
      return false;
    }

    // Initialize or get existing app
    if (!firebase.apps || firebase.apps.length === 0) {
      window.FIVIA_FIREBASE.app = firebase.initializeApp(config);
    } else {
      window.FIVIA_FIREBASE.app = firebase.app();
    }

    // Initialize Firestore & Auth
    window.FIVIA_FIREBASE.db = firebase.firestore();
    if (firebase.auth) {
      window.FIVIA_FIREBASE.auth = firebase.auth();
    }

    // Enable offline persistence in Firestore for ultra-smooth offline-first experience
    try {
      await window.FIVIA_FIREBASE.db.enablePersistence({ synchronizeTabs: true });
      console.log("[Firebase] Firestore offline persistence diaktifkan.");
    } catch (persistErr) {
      if (persistErr.code === "failed-precondition") {
        console.warn("[Firebase] Multiple tabs open, persistence enabled in first tab only.");
      } else if (persistErr.code === "unimplemented") {
        console.warn("[Firebase] Browser tidak mendukung persistence.");
      }
    }

    window.FIVIA_FIREBASE.isInitialized = true;
    notifyFirebaseStatus(true, `Terhubung ke Firebase: ${config.projectId}`);

    // Trigger two-way sync if sync module is available
    if (window.initFirebaseSync) {
      window.initFirebaseSync();
    }

    return true;
  } catch (err) {
    console.error("[Firebase] Gagal menginisialisasi Firebase:", err);
    notifyFirebaseStatus(false, `Gagal terhubung: ${err.message}`);
    return false;
  }
}

// Auto-run initialization on window load
window.addEventListener("DOMContentLoaded", () => {
  initFirebase();
});
