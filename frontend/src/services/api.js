import axios from "axios";
import { setAuthenticated } from "./auth";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor for adding credentials (cookies)
api.interceptors.request.use(
  (config) => {
    // Always include credentials to send cookies with requests
    config.withCredentials = true;

    // Ensure the correct Content-Type header is set for all requests
    if (!config.headers["Content-Type"] && !config.headers["content-type"]) {
      config.headers["Content-Type"] = "application/json";
    }

    // Add CSRF token if available (if your backend uses CSRF protection)
    const csrfToken = document
      .querySelector('meta[name="csrf-token"]')
      ?.getAttribute("content");
    if (csrfToken) {
      config.headers["X-CSRF-Token"] = csrfToken;
    }

    // Debug log for development
    if (import.meta.env.DEV) {
      console.log(
        `🚀 [API Request] ${config.method?.toUpperCase()} ${config.url}`,
        {
          withCredentials: config.withCredentials,
          data: config.data,
          headers: config.headers,
        }
      );
    }

    return config;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor for handling common errors
api.interceptors.response.use(
  (response) => {
    // Debug log for development
    if (import.meta.env.DEV) {
      console.log(
        `✅ [API Response] ${response.config.method?.toUpperCase()} ${
          response.config.url
        }`,
        {
          status: response.status,
          data: response.data,
        }
      );
    }
    return response;
  },
  (error) => {
    const { response } = error;

    // Debug log for development
    if (import.meta.env.DEV) {
      console.error(`❌ [API Error]`, {
        status: response?.status,
        statusText: response?.statusText,
        data: response?.data,
        url: error.config?.url,
        method: error.config?.method?.toUpperCase(),
      });
    }

    // Handle authentication errors
    if (response && response.status === 401) {
      // Update authentication state and redirect to login
      setAuthenticated(false);
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default api;
