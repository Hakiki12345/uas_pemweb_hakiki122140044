import { useState, useEffect } from "react";
import { isAuthenticated } from "../../services/auth";

/**
 * Debug component for development environment only
 * Shows authentication status and useful debug info
 */
const DevAuthDebug = () => {
  const [authState, setAuthState] = useState(isAuthenticated());
  const [showDebug, setShowDebug] = useState(false);

  // Update auth state when it changes
  useEffect(() => {
    const checkAuth = () => {
      setAuthState(isAuthenticated());
    };

    // Check initially and when storage changes
    checkAuth();
    window.addEventListener("storage", checkAuth);

    return () => {
      window.removeEventListener("storage", checkAuth);
    };
  }, []);

  // Only render in development mode
  if (import.meta.env.PROD) {
    return null;
  }

  if (!showDebug) {
    return (
      <button
        onClick={() => setShowDebug(true)}
        className="fixed bottom-2 left-2 bg-gray-800 text-white p-1 text-xs rounded opacity-50 hover:opacity-100"
      >
        Debug
      </button>
    );
  }

  return (
    <div className="fixed bottom-2 left-2 bg-gray-800 text-white p-2 rounded text-xs max-w-xs opacity-75 hover:opacity-100 z-50">
      <div className="flex justify-between mb-1">
        <span>Auth Debug</span>
        <button
          onClick={() => setShowDebug(false)}
          className="text-gray-400 hover:text-white"
        >
          ×
        </button>
      </div>
      <div>
        <div>
          <span className="font-bold">Auth Status:</span>
          <span
            className={`ml-2 ${authState ? "text-green-400" : "text-red-400"}`}
          >
            {authState ? "Authenticated" : "Not Authenticated"}
          </span>
        </div>

        <div className="mt-1">
          <span className="font-bold">Session:</span>
          <span className="ml-2">
            {document.cookie.includes("session") ? "Present" : "None"}
          </span>
        </div>

        <div className="mt-2 text-xs">
          <button
            onClick={() => {
              localStorage.clear();
              sessionStorage.clear();
              window.location.reload();
            }}
            className="bg-red-700 text-white px-2 py-1 rounded text-xs"
          >
            Reset Storage
          </button>
        </div>
      </div>
    </div>
  );
};

export default DevAuthDebug;
