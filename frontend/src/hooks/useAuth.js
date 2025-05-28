import { useDispatch, useSelector } from "react-redux";
import { useCallback } from "react";
import {
  loginUser,
  registerUser,
  getCurrentUser,
  logoutUser,
  logout,
  clearError,
} from "../redux/slices/authSlice";

const useAuth = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated, loading, error, errorDetails } = useSelector(
    (state) => state.auth
  );

  const login = useCallback(
    (credentials) => {
      return dispatch(loginUser(credentials));
    },
    [dispatch]
  );

  const register = useCallback(
    (userData) => {
      return dispatch(registerUser(userData));
    },
    [dispatch]
  );

  const loadUser = useCallback(() => {
    return dispatch(getCurrentUser());
  }, [dispatch]);
  const handleLogout = useCallback(() => {
    return dispatch(logoutUser());
  }, [dispatch]);

  const clearAuthError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);
  return {
    user,
    isAuthenticated,
    loading,
    error,
    errorDetails,
    login,
    register,
    loadUser,
    logout: handleLogout,
    clearAuthError,
  };
};

export default useAuth;
