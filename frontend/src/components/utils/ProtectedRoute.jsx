import { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import LoadingSpinner from "../ui/LoadingSpinner";

/**
 * ProtectedRoute - A route wrapper that requires authentication
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - The components to render if authenticated
 * @param {string} [props.redirectTo="/login"] - The path to redirect to if not authenticated
 * @returns {React.ReactNode}
 */
const ProtectedRoute = ({ children, redirectTo = "/login" }) => {
  const { isAuthenticated, loading, loadUser } = useAuth();
  const location = useLocation();

  useEffect(() => {
    // Try to load user data if we were authenticated but no user data
    if (!loading && !isAuthenticated) {
      loadUser();
    }
  }, [loading, isAuthenticated, loadUser]);

  if (loading) {
    return <LoadingSpinner fullPage />;
  }

  if (!isAuthenticated) {
    // Save the current location so we can redirect after login
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
