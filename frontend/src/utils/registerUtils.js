/**
 * Registration utilities for use in development
 */
import { testRegistrationAPI } from "./testRegistration";

// Add success and failure callback handlers
export const registerTestUser = async (callbacks = {}) => {
  const { onSuccess, onError, onComplete } = callbacks;

  // Generate a random email and test user data
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 10000);
  const testData = {
    firstName: "Test",
    lastName: "User",
    email: `test${timestamp}${random}@example.com`,
    password: "password123",
  };

  try {
    console.log("Creating test user with email:", testData.email);
    const result = await testRegistrationAPI(testData);

    if (result.success) {
      console.log("Test user created successfully:", result.data);
      onSuccess?.({
        user: result.data,
        credentials: {
          email: testData.email,
          password: testData.password,
        },
      });
    } else {
      console.error("Failed to create test user:", result.error);
      onError?.(result);
    }

    return result;
  } catch (error) {
    console.error("Error creating test user:", error);
    onError?.({
      success: false,
      error: error.message || "Unknown error",
      details: error,
    });
    return {
      success: false,
      error: error.message || "Unknown error",
      details: error,
    };
  } finally {
    onComplete?.();
  }
};

export default {
  registerTestUser,
};
