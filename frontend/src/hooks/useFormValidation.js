import { useState, useCallback } from "react";

/**
 * Custom hook for form validation
 * @param {Object} initialValues - Initial form values
 * @param {Function} validateFn - Validation function that returns errors object
 * @returns {Object} Form state and helper methods
 */
const useFormValidation = (initialValues = {}, validateFn = () => ({})) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form to initial values
  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialValues]);

  // Handle input change
  const handleChange = useCallback(
    (event) => {
      const { name, value, type, checked } = event.target;

      // Handle checkbox inputs
      const inputValue = type === "checkbox" ? checked : value;

      setValues((prev) => ({
        ...prev,
        [name]: inputValue,
      }));

      // Clear error when field is changed
      if (errors[name]) {
        setErrors((prev) => ({
          ...prev,
          [name]: "",
        }));
      }
    },
    [errors]
  );

  // Handle input blur (mark as touched)
  const handleBlur = useCallback(
    (event) => {
      const { name } = event.target;

      setTouched((prev) => ({
        ...prev,
        [name]: true,
      }));

      // Validate single field on blur
      const validationErrors = validateFn(values);
      if (validationErrors[name]) {
        setErrors((prev) => ({
          ...prev,
          [name]: validationErrors[name],
        }));
      }
    },
    [values, validateFn]
  );

  // Set value programmatically
  const setValue = useCallback(
    (name, value) => {
      setValues((prev) => ({
        ...prev,
        [name]: value,
      }));

      // Clear error when field is changed
      if (errors[name]) {
        setErrors((prev) => ({
          ...prev,
          [name]: "",
        }));
      }
    },
    [errors]
  );

  // Validate all form fields
  const validateForm = useCallback(() => {
    const validationErrors = validateFn(values);
    setErrors(validationErrors);

    // Mark all fields as touched
    const allTouched = Object.keys(values).reduce((obj, key) => {
      obj[key] = true;
      return obj;
    }, {});
    setTouched(allTouched);

    return Object.keys(validationErrors).length === 0;
  }, [values, validateFn]);

  // Handle form submission
  const handleSubmit = useCallback(
    (onSubmit) => async (event) => {
      if (event) {
        event.preventDefault();
      }

      setIsSubmitting(true);

      // Validate all fields
      const isValid = validateForm();

      if (isValid && onSubmit) {
        try {
          await onSubmit(values);
        } catch (error) {
          console.error("Form submission error:", error);
        }
      }

      setIsSubmitting(false);
    },
    [values, validateForm]
  );

  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    setValue,
    resetForm,
    validateForm,
  };
};

export default useFormValidation;
