import { useState, useEffect, useRef } from "react";
import { Link, NavLink } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";
import useAuth from "../../hooks/useAuth";
import logoImage from "../../assets/logo.png";

const Navbar = () => {
  const { cart, favorites } = useAppContext();
  const { user, isAuthenticated, logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white text-gray-800 shadow-md py-2"
          : "bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-4"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <Link
            to="/"
            className="flex items-center transform hover:rotate-6 transition-transform duration-300"
          >
            <img src={logoImage} alt="TokoBaju Logo" className="h-16" />
            <span className="text-xl font-bold tracking-wide">TokoBaju</span>
          </Link>{" "}
          <div className="hidden md:flex items-center space-x-2">
            <div className="relative mr-2">
              <input
                type="text"
                placeholder="Cari produk..."
                className="pl-9 pr-4 py-2 rounded-full bg-opacity-20 bg-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 w-44 lg:w-64 transition-all"
                style={{
                  color: isScrolled ? "#374151" : "white",
                  backgroundColor: isScrolled
                    ? "#f3f4f6"
                    : "rgba(255, 255, 255, 0.2)",
                }}
              />
              <span className="material-icons absolute left-2 top-1/2 transform -translate-y-1/2 text-sm">
                search
              </span>
            </div>
            <NavLink
              to="/"
              className={({ isActive }) => `
                py-2 px-3 rounded-lg font-medium transition-colors
                ${
                  isActive
                    ? isScrolled
                      ? "bg-blue-100 text-blue-600"
                      : "bg-blue-800 text-white"
                    : isScrolled
                    ? "hover:bg-gray-100"
                    : "hover:bg-blue-800 hover:bg-opacity-10"
                }
              `}
            >
              Beranda
            </NavLink>
            <NavLink
              to="/products"
              className={({ isActive }) => `
                py-2 px-3 rounded-lg font-medium transition-colors
                ${
                  isActive
                    ? isScrolled
                      ? "bg-blue-100 text-blue-600"
                      : "bg-blue-800 text-white"
                    : isScrolled
                    ? "hover:bg-gray-100"
                    : "hover:bg-blue-800 hover:bg-opacity-10"
                }
              `}
            >
              Produk
            </NavLink>{" "}
            {/* Authentication UI */}
            {isAuthenticated ? (
              <div className="relative mr-2" ref={userMenuRef}>
                <div className="flex items-center">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className={`py-2 px-3 rounded-lg font-medium transition-colors flex items-center ${
                      isScrolled
                        ? "hover:bg-gray-100"
                        : "hover:bg-blue-800 hover:bg-opacity-10"
                    }`}
                  >
                    <span className="material-icons mr-1">account_circle</span>
                    <span className="hidden lg:inline">
                      {user?.firstName || "Account"}
                    </span>
                    <span className="material-icons text-sm ml-1">
                      {isUserMenuOpen ? "arrow_drop_up" : "arrow_drop_down"}
                    </span>
                  </button>

                  {isUserMenuOpen && (
                    <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-md shadow-lg z-20">
                      <div className="py-1">
                        {" "}
                        <Link
                          to="/profile"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <span className="material-icons text-sm mr-2 align-middle">
                            person
                          </span>
                          Profile
                        </Link>
                        {user?.isAdmin && (
                          <Link
                            to="/admin"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            <span className="material-icons text-sm mr-2 align-middle">
                              dashboard
                            </span>
                            Admin Dashboard
                          </Link>
                        )}
                        <button
                          onClick={() => {
                            logout();
                            setIsUserMenuOpen(false);
                          }}
                          className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <span className="material-icons text-sm mr-2 align-middle">
                            logout
                          </span>
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center mr-2">
                <Link
                  to="/login"
                  className={`py-2 px-3 rounded-lg font-medium transition-colors ${
                    isScrolled
                      ? "hover:bg-gray-100"
                      : "hover:bg-blue-800 hover:bg-opacity-10"
                  }`}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className={`py-2 px-3 ml-1 rounded-lg font-medium transition-colors bg-blue-600 text-white hover:bg-blue-700`}
                >
                  Register
                </Link>
              </div>
            )}
            <div className="flex items-center pl-2 ml-2 border-l">
              <NavLink
                to="/favorites"
                className={({ isActive }) => `
                  p-2 rounded-lg relative
                ${
                  isActive
                    ? isScrolled
                      ? "bg-blue-100 text-blue-600"
                      : "bg-blue-800 text-white"
                    : isScrolled
                    ? "hover:bg-gray-100"
                    : "hover:bg-blue-800 hover:bg-opacity-10"
                }
              `}
              >
                <span className="material-icons">favorite</span>
                {favorites.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                    {favorites.length}
                  </span>
                )}
              </NavLink>

              <NavLink
                to="/cart"
                className={({ isActive }) => `
                  p-2 rounded-lg relative ml-2
                ${
                  isActive
                    ? isScrolled
                      ? "bg-blue-100 text-blue-600"
                      : "bg-blue-800 text-white"
                    : isScrolled
                    ? "hover:bg-gray-100"
                    : "hover:bg-blue-800 hover:bg-opacity-10"
                }
              `}
              >
                <span className="material-icons">shopping_cart</span>
                {cart.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                    {cart.length}
                  </span>
                )}
              </NavLink>
            </div>
          </div>
          <div className="flex md:hidden items-center space-x-4">
            <NavLink
              to="/favorites"
              className={({ isActive }) => `
                p-2 relative
                ${
                  isActive
                    ? isScrolled
                      ? "bg-blue-100 text-blue-600"
                      : "bg-blue-800 text-white"
                    : ""
                }
              `}
            >
              <span className="material-icons">favorite</span>
              {favorites.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                  {favorites.length}
                </span>
              )}
            </NavLink>

            <NavLink
              to="/cart"
              className={({ isActive }) => `
                p-2 relative
                ${
                  isActive
                    ? isScrolled
                      ? "bg-blue-100 text-blue-600"
                      : "bg-blue-800 text-white"
                    : ""
                }
              `}
            >
              <span className="material-icons">shopping_cart</span>
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                  {cart.length}
                </span>
              )}
            </NavLink>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2"
            >
              <span className="material-icons">
                {isMobileMenuOpen ? "close" : "menu"}
              </span>
            </button>
          </div>
        </div>

        <div
          className={`md:hidden transition-all duration-300 overflow-hidden ${
            isMobileMenuOpen ? "max-h-96 py-4" : "max-h-0"
          }`}
        >
          <div className="flex flex-col space-y-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Cari produk..."
                className="w-full pl-9 pr-4 py-2 rounded-lg bg-opacity-20 bg-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                style={{
                  color: isScrolled ? "#374151" : "white",
                  backgroundColor: isScrolled
                    ? "#f3f4f6"
                    : "rgba(255, 255, 255, 0.2)",
                }}
              />
              <span className="material-icons absolute left-2 top-1/2 transform -translate-y-1/2 text-sm">
                search
              </span>
            </div>
            <NavLink
              to="/"
              className={({ isActive }) => `
                py-2 px-3 rounded-lg font-medium
                ${
                  isActive
                    ? isScrolled
                      ? "bg-blue-100 text-blue-600"
                      : "bg-blue-800 text-white"
                    : ""
                }
              `}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Beranda
            </NavLink>{" "}
            <NavLink
              to="/products"
              className={({ isActive }) => `
                py-2 px-3 rounded-lg font-medium
                ${
                  isActive
                    ? isScrolled
                      ? "bg-blue-100 text-blue-600"
                      : "bg-blue-800 text-white"
                    : ""
                }
              `}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Produk
            </NavLink>
            {/* Authentication UI for mobile */}
            {isAuthenticated ? (
              <>
                <NavLink
                  to="/profile"
                  className={({ isActive }) => `
                    py-2 px-3 rounded-lg font-medium
                    ${
                      isActive
                        ? isScrolled
                          ? "bg-blue-100 text-blue-600"
                          : "bg-blue-800 text-white"
                        : ""
                    }
                  `}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span className="material-icons text-sm mr-2 align-middle">
                    person
                  </span>
                  Profile
                </NavLink>
                <button
                  onClick={() => {
                    logout();
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full text-left py-2 px-3 rounded-lg font-medium ${
                    isScrolled ? "text-red-600" : "text-red-300"
                  }`}
                >
                  <span className="material-icons text-sm mr-2 align-middle">
                    logout
                  </span>
                  Logout
                </button>
              </>
            ) : (
              <>
                <NavLink
                  to="/login"
                  className={({ isActive }) => `
                    py-2 px-3 rounded-lg font-medium
                    ${
                      isActive
                        ? isScrolled
                          ? "bg-blue-100 text-blue-600"
                          : "bg-blue-800 text-white"
                        : ""
                    }
                  `}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Login
                </NavLink>
                <NavLink
                  to="/register"
                  className={({ isActive }) => `
                    py-2 px-3 rounded-lg font-medium
                    ${
                      isActive
                        ? isScrolled
                          ? "bg-blue-100 text-blue-600"
                          : "bg-blue-800 text-white"
                        : ""
                    }
                  `}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Register
                </NavLink>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
