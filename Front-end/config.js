// config.js

// ✅ Use API_BASE from Render environment variable if available, else fallback
const API_BASE =
  window?.__ENV__?.API_BASE ||
  "https://clear-pro-aligner-portal10.onrender.com";

// 📡 Define all main backend endpoints
const API_ENDPOINTS = {
  // 🔐 Authentication
  login: `${API_BASE}/api/auth/login`,
  register: `${API_BASE}/api/auth/register`,
  logout: `${API_BASE}/api/auth/logout`,

  // 👤 User management
  users: `${API_BASE}/api/users`,
  userById: (id) => `${API_BASE}/api/users/${id}`,

  // 🩺 Doctor management
  doctors: `${API_BASE}/api/doctors`,
  doctorById: (id) => `${API_BASE}/api/doctors/${id}`,

  // 📅 Appointments
  appointments: `${API_BASE}/api/appointments`,
  appointmentById: (id) => `${API_BASE}/api/appointments/${id}`,

  // 📁 File upload & media
  upload: `${API_BASE}/api/files/upload`,

  // ⚙️ Settings
  settings: `${API_BASE}/api/settings`,

  // 📊 Dashboard
  dashboard: `${API_BASE}/api/dashboard`,
};

// 🌍 Export config globally
window.config = {
  API_BASE,
  API_ENDPOINTS
};

// ✅ Debug log (optional)
console.log("✅ Using API Base URL:", API_BASE);

000





