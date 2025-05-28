import { useState } from "react";
import { validateRegistrationData } from "../utils/registerValidator";

/**
 * Custom hook for validating registration form
 * @returns {Object} form validation utilities
 */
const useRegistrationValidation = (initialValues = {}) => {
  const [values, setValues] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    ...initialValues,
  });

  const [errors, setErrors] = useState({});
  const [touchedFields, setTouchedFields] = useState({});

  /**
   * Handle form input changes
   * @param {Object} e - Event object
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value,
    });

    // Mark field as touched
    if (!touchedFields[name]) {
      setTouchedFields({
        ...touchedFields,
        [name]: true,
      });
    }

    // Clear field-specific error when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  /**
   * Validate a specific field
   * @param {string} fieldName - Name of field to validate
   * @returns {boolean} True if valid
   */
  const validateField = (fieldName) => {
    let fieldErrors = {};

    // Special validation for confirm password
    if (fieldName === "confirmPassword") {
      if (values.password !== values.confirmPassword) {
        fieldErrors.confirmPassword = "Passwords do not match";
      }
    } else {
      // Use the main validation utility
      const validationResult = validateRegistrationData({
        [fieldName]: values[fieldName],
      });

      if (!validationResult.valid) {
        fieldErrors = validationResult.errors;
      }
    }

    setErrors({
      ...errors,
      ...fieldErrors,
    });

    return Object.keys(fieldErrors).length === 0;
  };

  /**
   * Validate the entire form
   * @returns {boolean} True if form is valid
   */
  const validateForm = () => {
    // First check confirm password match
    let allErrors = {};

    if (values.password !== values.confirmPassword) {
      allErrors.confirmPassword = "Passwords do not match";
    }

    // Now use the main validator
    const { firstName, lastName, email, password } = values;
    const validationResult = validateRegistrationData({
      firstName,
      lastName,
      email,
      password,
    });

    if (!validationResult.valid) {
      allErrors = {
        ...allErrors,
        ...validationResult.errors,
      };
    }

    setErrors(allErrors);
    return Object.keys(allErrors).length === 0;
  };

  /**
   * Handle field blur for validation
   * @param {Object} e - Event object
   */
  const handleBlur = (e) => {
    const { name } = e.target;
    setTouchedFields({
      ...touchedFields,
      [name]: true,
    });
    validateField(name);
  };

  return {
    values,
    errors,
    touchedFields,
    setValues,
    setErrors,
    handleChange,
    handleBlur,
    validateField,
    validateForm,
  };
};

export default useRegistrationValidation;
