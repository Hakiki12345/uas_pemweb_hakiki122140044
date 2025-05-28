import axios from "axios";
import config from "../config";

/**
 * Create a configured Axios instance with interceptors
 * @param {Object} options - Configuration options
 * @returns {Object} Configured Axios instance
 */
export const createHttpClient = (options = {}) => {
  const baseURL = options.baseURL || config.apiUrl;

  // Create axios instance
  const axiosInstance = axios.create({
    baseURL,
    timeout: options.timeout || 30000,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  // Add request interceptor for authentication
  axiosInstance.interceptors.request.use(
    (config) => {
      // Get auth token from storage
      const token = localStorage.getItem(options.tokenKey || "token");

      // Add token to headers if it exists
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      return config;
    },
    (error) => Promise.reject(error)
  );

  // Add response interceptor for error handling
  axiosInstance.interceptors.response.use(
    (response) => {
      // Return just the data portion of the response
      return response.data;
    },
    (error) => {
      // Handle errors based on status code
      if (error.response) {
        const { status, data } = error.response;

        // For 401 errors, clear token and redirect to login
        if (status === 401) {
          localStorage.removeItem(options.tokenKey || "token");

          // If we have a redirect function, call it
          if (options.onUnauthorized) {
            options.onUnauthorized();
          } else if (window.location.pathname !== "/login") {
            window.location.href = "/login";
          }
        }

        // Create a more informative error
        const errorMessage = data?.message || "Unknown server error";
        const enhancedError = new Error(errorMessage);
        enhancedError.status = status;
        enhancedError.data = data;
        enhancedError.isAxiosError = true;

        return Promise.reject(enhancedError);
      }

      // For network errors
      if (error.request && !error.response) {
        const networkError = new Error(
          "Network error. Please check your connection."
        );
        networkError.isNetworkError = true;
        return Promise.reject(networkError);
      }

      // For everything else
      return Promise.reject(error);
    }
  );

  return axiosInstance;
};

/**
 * Default HTTP client instance with standard configuration
 */
const http = createHttpClient();

export default http;
