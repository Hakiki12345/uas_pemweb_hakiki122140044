import { useEffect } from "react";
import useAuth from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import useDocumentTitle from "../hooks/useDocumentTitle";
import LoadingSpinner from "../components/ui/LoadingSpinner";

const LogoutTestPage = () => {
  useDocumentTitle("Logout Test");
  const { logout, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Auto logout after 3 seconds
    const timer = setTimeout(() => {
      logout();
      navigate("/");
    }, 3000);

    return () => clearTimeout(timer);
  }, [logout, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md w-full">
        <h1 className="text-2xl font-bold mb-6">
          Testing Logout Functionality
        </h1>

        <div className="mb-6">
          {loading ? (
            <LoadingSpinner />
          ) : (
            <p className="text-lg">
              You will be automatically logged out in 3 seconds...
            </p>
          )}
        </div>

        <div className="flex justify-between">
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              logout();
              navigate("/");
            }}
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Logout Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoutTestPage;
