/**
 * 🌐 ClearPro Portal Configuration
 * Automatically switches API endpoints based on environment (dev, staging, prod).
 */

(function () {
  // Default to production
  let API_BASE = "https://clearproaligner.com";

  // Detect environment from hostname
  const host = window.location.hostname;

  if (host === "localhost" || host === "127.0.0.1") {
    // 🧪 Local development
    API_BASE = "http://localhost:5000";
  } else if (host.includes("staging")) {
    // 🧪 Staging environment (e.g., staging.portal.clearproaligner.com)
    API_BASE = "https://staging.clearproaligner.com";
  } else if (host.includes("dev")) {
    // 👨‍💻 Dev environment (optional)
    API_BASE = "https://dev.clearproaligner.com";
  }
  // else: production stays as default

  // Expose globally
  window.API_BASE = API_BASE;

  console.log("[ClearPro Portal] Using API:", API_BASE);
})();