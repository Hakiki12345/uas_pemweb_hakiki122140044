import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import HomePage from "./pages/HomePage";
import ProductsPage from "./pages/ProductPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrderConfirmationPage from "./pages/OrderConfirmationPage";
import NotFoundPage from "./pages/NotFoundPage";
import Toast from "./components/ui/Toast";
import ScrollToTop from "./components/utils/ScrollToTop";
import ErrorBoundary from "./components/utils/ErrorBoundary";
import BackToTopButton from "./components/ui/BackToTopButton";
import FavoritesPage from "./pages/FavoritesPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProfilePage from "./pages/ProfilePage";
import ProfileEditPage from "./pages/ProfileEditPage";
import OrderDetailPage from "./pages/OrderDetailPage";
import LogoutTestPage from "./pages/LogoutTestPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import DebugPage from "./pages/DebugPage";
import DevAuthDebug from "./components/utils/DevAuthDebug";
import { useDispatch } from "react-redux";
import { getCurrentUser } from "./redux/slices/authSlice";

function App() {
  const [toast, setToast] = useState(null);
  const dispatch = useDispatch();

  const showToast = (message, type = "success") => {
    setToast({ message, type });
  };

  // Set up global toast function
  useEffect(() => {
    window.showToast = showToast;

    return () => {
      delete window.showToast;
    };
  }, []);

  // Try to load user data on app startup and migrate data
  useEffect(() => {
    // Load user if previously authenticated
    if (localStorage.getItem("authenticated") === "true") {
      dispatch(getCurrentUser());
    }

    // Migrate data from localStorage to Redux store
    import("./utils/dataMigration").then((module) => {
      module.migrateLocalStorageToRedux(dispatch);
    });
  }, [dispatch]);

  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-8 mt-2">
          <Routes>
            <Route
              path="/"
              element={
                <ErrorBoundary>
                  <HomePage />
                </ErrorBoundary>
              }
            />
            <Route
              path="/products"
              element={
                <ErrorBoundary>
                  <ProductsPage />
                </ErrorBoundary>
              }
            />
            <Route
              path="/products/:id"
              element={
                <ErrorBoundary>
                  <ProductDetailPage />
                </ErrorBoundary>
              }
            />
            <Route
              path="/cart"
              element={
                <ErrorBoundary>
                  <CartPage />
                </ErrorBoundary>
              }
            />
            <Route
              path="/favorites"
              element={
                <ErrorBoundary>
                  <FavoritesPage />
                </ErrorBoundary>
              }
            />
            <Route
              path="/checkout"
              element={
                <ErrorBoundary>
                  <CheckoutPage />
                </ErrorBoundary>
              }
            />
            <Route
              path="/order-confirmation"
              element={
                <ErrorBoundary>
                  <OrderConfirmationPage />
                </ErrorBoundary>
              }
            />
            {/* Authentication Routes */}
            <Route
              path="/login"
              element={
                <ErrorBoundary>
                  <LoginPage />
                </ErrorBoundary>
              }
            />
            <Route
              path="/register"
              element={
                <ErrorBoundary>
                  <RegisterPage />
                </ErrorBoundary>
              }
            />
            {/* Protected Routes */}
            <Route
              path="/profile"
              element={
                <ErrorBoundary>
                  <ProfilePage />
                </ErrorBoundary>
              }
            />
            <Route
              path="/profile/edit"
              element={
                <ErrorBoundary>
                  <ProfileEditPage />
                </ErrorBoundary>
              }
            />
            <Route
              path="/orders/:id"
              element={
                <ErrorBoundary>
                  <OrderDetailPage />
                </ErrorBoundary>
              }
            />
            <Route
              path="/logout-test"
              element={
                <ErrorBoundary>
                  <LogoutTestPage />
                </ErrorBoundary>
              }
            />
            <Route
              path="/debug"
              element={
                <ErrorBoundary>
                  <DebugPage />
                </ErrorBoundary>
              }
            />
            {/* Admin Routes */}
            <Route
              path="/admin"
              element={
                <ErrorBoundary>
                  <AdminDashboardPage />
                </ErrorBoundary>
              }
            />
            <Route
              path="*"
              element={
                <ErrorBoundary>
                  <NotFoundPage />
                </ErrorBoundary>
              }
            />
          </Routes>
        </main>
        <Footer />

        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}

        {/* Debug component for development */}
        <DevAuthDebug />
      </div>
      <BackToTopButton />
    </BrowserRouter>
  );
}

export default App;
