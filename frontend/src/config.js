/**
 * Application configuration based on environment variables
 */
const config = {
  // API base URL from environment variables
  apiUrl: import.meta.env.VITE_API_URL || "http://localhost:8000/api",

  // Application name
  appName: import.meta.env.VITE_APP_NAME || "YourShopName",

  // Authentication token key in localStorage
  tokenKey: "token",

  // Default pagination settings
  pagination: {
    defaultLimit: 8,
    defaultPage: 1,
  },

  // File upload limits
  uploads: {
    maxImageSize: 5 * 1024 * 1024, // 5MB
    allowedImageTypes: ["image/jpeg", "image/png", "image/webp"],
  },

  // Other app settings
  settings: {
    defaultCurrency: "USD",
    currencySymbol: "$",
    dateFormat: "MMMM d, yyyy",
  },
};

export default config;
