// Validator utility for registration data
// Helps catch potential registration issues before submitting to API

/**
 * Validates registration data against common rules
 * @param {Object} userData - User registration data
 * @returns {Object} - Validation result with any errors
 */
export const validateRegistrationData = (userData) => {
  const errors = {};
  const result = { valid: true, errors: {} };

  // Check required fields
  const requiredFields = ["firstName", "lastName", "email", "password"];
  requiredFields.forEach((field) => {
    if (!userData[field] || userData[field].trim() === "") {
      errors[field] = `${field} is required`;
    }
  });

  // Validate email format
  if (userData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.email)) {
    errors.email = "Email format is invalid";
  }

  // Validate password strength
  if (userData.password) {
    if (userData.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    } else if (!/[A-Z]/.test(userData.password)) {
      errors.password = "Password should contain at least one uppercase letter";
    } else if (!/[0-9]/.test(userData.password)) {
      errors.password = "Password should contain at least one number";
    }
  }

  // Validate name fields
  if (userData.firstName && userData.firstName.length > 50) {
    errors.firstName = "First name must be 50 characters or less";
  }

  if (userData.lastName && userData.lastName.length > 50) {
    errors.lastName = "Last name must be 50 characters or less";
  }

  // Check if any errors were found
  if (Object.keys(errors).length > 0) {
    result.valid = false;
    result.errors = errors;
  }

  return result;
};

/**
 * Maps backend error messages to frontend field names
 * @param {string} errorMessage - Error message from backend
 * @returns {Object} - Mapped errors for frontend fields
 */
export const mapBackendErrors = (errorMessage) => {
  const errors = {};

  // Common backend error patterns
  const patterns = [
    {
      regex: /email already (exists|registered|in use)/i,
      field: "email",
      message: "This email is already registered",
    },
    {
      regex: /invalid email/i,
      field: "email",
      message: "Email format is invalid",
    },
    {
      regex: /password (too short|must be)/i,
      field: "password",
      message: "Password does not meet requirements",
    },
    {
      regex: /missing.+first_?name/i,
      field: "firstName",
      message: "First name is required",
    },
    {
      regex: /missing.+last_?name/i,
      field: "lastName",
      message: "Last name is required",
    },
    { regex: /missing.+email/i, field: "email", message: "Email is required" },
    {
      regex: /missing.+password/i,
      field: "password",
      message: "Password is required",
    },
  ];

  // Test each pattern against the error message
  patterns.forEach((pattern) => {
    if (pattern.regex.test(errorMessage)) {
      errors[pattern.field] = pattern.message;
    }
  });

  return errors;
};
