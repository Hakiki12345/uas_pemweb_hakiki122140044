import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

/**
 * AuthCheck - A component that redirects authenticated users away from auth pages
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - The components to render if not authenticated
 * @param {string} [props.redirectTo="/"] - The path to redirect to if authenticated
 * @returns {React.ReactNode}
 */
const AuthCheck = ({ children, redirectTo = "/" }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // If authenticated, redirect to the specified path or to the path stored in location state
  useEffect(() => {
    if (isAuthenticated) {
      const destination = location.state?.from?.pathname || redirectTo;
      navigate(destination, { replace: true });
    }
  }, [isAuthenticated, navigate, location, redirectTo]);

  // If not authenticated, render children
  return !isAuthenticated ? children : null;
};

export default AuthCheck;
