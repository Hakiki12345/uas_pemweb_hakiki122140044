import { useState, useCallback } from 'react';

const useToast = (timeout = 3000) => {
  const [toast, setToast] = useState(null);
  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, timeout);
  }, [timeout]);
  return { toast, showToast };
};

export default useToast;