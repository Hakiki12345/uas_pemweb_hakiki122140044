import { useState, useCallback } from "react";

/**
 * Custom hook for managing API loading states and errors
 * @returns {Object} Loading state management functions and properties
 */
const useApiStatus = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleApiCall = useCallback(async (apiFunction, ...args) => {
    try {
      setIsLoading(true);
      setError(null);
      setSuccess(null);
      const result = await apiFunction(...args);
      setSuccess(true);
      return result;
    } catch (error) {
      setError(error.message || "An unexpected error occurred");
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const resetStatus = useCallback(() => {
    setError(null);
    setSuccess(null);
    setIsLoading(false);
  }, []);

  return {
    isLoading,
    error,
    success,
    handleApiCall,
    resetStatus,
    setError,
  };
};

export default useApiStatus;
