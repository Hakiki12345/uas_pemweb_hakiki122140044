import api from "./api";
import { testRegistrationAPI } from "../utils/testRegistration";
import registrationLogger from "../utils/registrationLogger";

// Session authentication status
let authenticated = false;

// Check if user is authenticated
export const isAuthenticated = () => {
  return authenticated;
};

// Set authentication state
export const setAuthenticated = (status) => {
  authenticated = status;
  // Store in localStorage for persistence across page refreshes
  localStorage.setItem("authenticated", status ? "true" : "false");
};

// Initialize authentication state from localStorage
const initAuth = () => {
  const savedAuthState = localStorage.getItem("authenticated");
  authenticated = savedAuthState === "true";
};

// Run initialization
initAuth();

// Auth API calls
const authService = {
  // Register a new user with enhanced error handling and debugging
  register: async (userData, options = {}) => {
    // Start registration logging
    registrationLogger.start(userData);

    try {
      // Transform frontend camelCase to backend snake_case
      const transformedData = {
        first_name: userData.firstName,
        last_name: userData.lastName,
        email: userData.email,
        password: userData.password,
      };

      // Add any additional fields if provided
      if (userData.phone) transformedData.phone = userData.phone;
      if (userData.address) transformedData.address = userData.address;

      registrationLogger.logStep("transform_data", { dataReady: true });
      console.log("Sending registration data to backend:", transformedData);

      // Set custom request options
      const requestOptions = {
        withCredentials: true,
        ...options,
      };

      // Track timing for performance monitoring
      const startTime = performance.now();

      registrationLogger.logStep("api_request_start");
      const response = await api.post(
        "/auth/register",
        transformedData,
        requestOptions
      );

      const endTime = performance.now();
      console.log(`Registration request took ${endTime - startTime}ms`);
      console.log("Registration API response:", response);

      registrationLogger.logStep("api_request_complete", {
        status: response.status,
      });

      // User is automatically logged in via session cookie after registration
      setAuthenticated(true);

      // Return both the data and response status for more context
      const result = {
        ...response.data,
        status: response.status,
        success: true,
      };

      registrationLogger.complete(true, result);
      return result;
    } catch (error) {
      console.error("Registration error details:", error);
      registrationLogger.logError("api_request", error);

      // Enhanced error object with more details
      const errorObj = {
        message: "Registration failed",
        error: error.response?.data?.error || error.message || "Unknown error",
        status: error.response?.status,
        originalError: error,
        timestamp: new Date().toISOString(),
      };

      // Try to get helpful error message
      if (error.response) {
        console.error("Server error response:", error.response.data);
        registrationLogger.logStep("server_error", {
          status: error.response.status,
          data: error.response.data,
        });

        // Handle specific error codes based on status
        if (error.response.status === 400) {
          console.log(
            "Validation error detected. Attempting alternative registration method..."
          );
          registrationLogger.logStep("attempt_alternative");

          try {
            const testResult = await testRegistrationAPI(userData);
            if (testResult.success) {
              setAuthenticated(true);
              registrationLogger.complete(true, {
                ...testResult.data,
                fromAlternativeMethod: true,
              });
              return {
                ...testResult.data,
                fromAlternativeMethod: true,
                success: true,
              };
            } else {
              registrationLogger.logError("alternative_method", testResult);
              throw { ...testResult, fromAlternativeMethod: true };
            }
          } catch (testError) {
            console.error("Alternative registration also failed:", testError);
            registrationLogger.logError("alternative_method", testError);
            throw { ...errorObj, alternativeAttempted: true };
          }
        } else if (error.response.status === 409) {
          // Conflict - User already exists
          registrationLogger.logStep("user_exists_error");
          registrationLogger.complete(false, { code: "USER_EXISTS" });
          throw { ...errorObj, code: "USER_EXISTS" };
        } else if (error.response.status === 500) {
          // Server error - might be temporary
          registrationLogger.logStep("server_error");
          registrationLogger.complete(false, { code: "SERVER_ERROR" });
          throw { ...errorObj, code: "SERVER_ERROR", retryable: true };
        } else {
          registrationLogger.complete(false, errorObj);
          throw errorObj;
        }
      }

      registrationLogger.complete(false, errorObj);
      throw errorObj;
    }
  },

  // Login user
  login: async (credentials) => {
    try {
      const response = await api.post("/auth/login", credentials, {
        withCredentials: true,
      });
      // Successfully logged in via session cookie
      setAuthenticated(true);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : new Error("Network Error");
    }
  },

  // Logout user
  logout: async () => {
    try {
      // Call the logout endpoint to invalidate the session
      await api.post("/auth/logout", {}, { withCredentials: true });
      // Update local authentication state
      setAuthenticated(false);
    } catch (error) {
      console.error("Logout error:", error);
      // Still clear local auth state even if server logout fails
      setAuthenticated(false);
    }
  }, // Get current user profile
  getCurrentUser: async () => {
    try {
      const response = await api.get("/auth/me");
      return response.data;
    } catch (error) {
      console.error("Error getting current user:", error);
      throw error.response ? error.response.data : new Error("Network Error");
    }
  },
};

export default authService;
