// Test utility for registration functionality
import api from "../services/api";

/**
 * Test registration with direct API call
 * @param {Object} userData - User registration data
 * @returns {Promise<Object>} - Registration response
 */
export const testRegistrationAPI = async (userData) => {
  try {
    // Transform to backend format
    const transformedData = {
      first_name: userData.firstName,
      last_name: userData.lastName,
      email: userData.email,
      password: userData.password,
    };

    console.log("Attempting test registration with data:", transformedData);

    const response = await api.post("/auth/register", transformedData, {
      withCredentials: true,
    });

    console.log("Registration successful:", response.data);
    return {
      success: true,
      data: response.data,
      message: "Registration successful",
    };
  } catch (error) {
    console.error("Registration test failed:", error);

    let errorMessage = "Registration failed";
    let errorDetails = null;

    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      errorMessage = error.response.data.error || error.response.statusText;
      errorDetails = error.response.data;
      console.error("Server responded with error:", error.response.data);
      console.error("Status code:", error.response.status);
    } else if (error.request) {
      // The request was made but no response was received
      errorMessage = "No response received from server";
      console.error("No response received:", error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      errorMessage = error.message;
      console.error("Error setting up request:", error.message);
    }

    return {
      success: false,
      error: errorMessage,
      details: errorDetails,
    };
  }
};
