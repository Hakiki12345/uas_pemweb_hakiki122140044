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
import { AppProvider } from "./context/AppContext";
import ScrollToTop from "./components/utils/ScrollToTop";
import ErrorBoundary from "./components/utils/ErrorBoundary";
import BackToTopButton from './components/ui/BackToTopButton';
import FavoritesPage from "./pages/FavoritesPage";

function App() {
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
  };

  useEffect(() => {
    window.showToast = showToast;

    return () => {
      delete window.showToast;
    };
  }, []);

  return (
    <AppProvider>
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
              <Route
                path="*"
                element={
                  <ErrorBoundary>
                    <NotFoundPage />
                  </ErrorBoundary>
                }
              />
            </Routes>{" "}
          </main>
          <Footer />

          {toast && (
            <Toast
              message={toast.message}
              type={toast.type}
              onClose={() => setToast(null)}
            />
          )}
        </div>
        <BackToTopButton />
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
