import { useEffect } from "react";
import { Link } from "react-router-dom";

/**
 * Component to display after successful registration
 */
const RegistrationSuccess = ({ user = {}, onDismiss }) => {
  // Auto-redirect after a few seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      if (onDismiss) onDismiss();
    }, 5000); // 5 second auto-redirect

    return () => clearTimeout(timer);
  }, [onDismiss]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4 animate-fade-in">
        <div className="text-center">
          <div className="mb-4 flex justify-center">
            <div className="rounded-full bg-green-100 p-3">
              <svg
                className="h-8 w-8 text-green-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome!</h2>
          <h3 className="text-lg font-medium text-gray-900">
            {user.first_name || user.firstName || "Your"} account has been
            created
          </h3>

          <p className="mt-4 text-gray-600">
            You are now logged in and ready to start shopping.
          </p>

          <div className="mt-6 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 justify-center">
            <Link
              to="/"
              className="inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Go to homepage
            </Link>
            <Link
              to="/profile"
              className="inline-flex justify-center items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              View your profile
            </Link>
          </div>

          <p className="mt-4 text-xs text-gray-500">
            Auto-redirecting to homepage in a few seconds...
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegistrationSuccess;
