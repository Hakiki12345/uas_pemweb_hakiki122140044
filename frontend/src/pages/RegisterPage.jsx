import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import AuthCheck from "../components/utils/AuthCheck";
import useDocumentTitle from "../hooks/useDocumentTitle";
import {
  validateRegistrationData,
  mapBackendErrors,
} from "../utils/registerValidator";
import RegistrationSuccess from "../components/auth/RegistrationSuccess";

const RegisterPage = () => {
  useDocumentTitle("Create Account | YourShopName");
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [registeredUser, setRegisteredUser] = useState(null);

  const navigate = useNavigate();
  const { register, error, loading, clearAuthError } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));

    // Clear field-specific error when user types
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }

    // Clear API error when user changes form
    if (error) {
      clearAuthError();
    }
  };
  const validateForm = () => {
    const errors = {};

    // Validate first name
    if (!userData.firstName.trim()) {
      errors.firstName = "First name is required";
    } else if (userData.firstName.length > 50) {
      errors.firstName = "First name must be 50 characters or less";
    }

    // Validate last name
    if (!userData.lastName.trim()) {
      errors.lastName = "Last name is required";
    } else if (userData.lastName.length > 50) {
      errors.lastName = "Last name must be 50 characters or less";
    } // Validate email
    if (!userData.email) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.email)) {
      errors.email = "Email is invalid";
    } else if (userData.email.length > 100) {
      errors.email = "Email address is too long (maximum 100 characters)";
    }

    // Validate password
    if (!userData.password) {
      errors.password = "Password is required";
    } else if (userData.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    // Validate password confirmation
    if (userData.password !== userData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      // Remove confirmPassword as it's not needed for API
      // eslint-disable-next-line no-unused-vars
      const { confirmPassword, ...registerData } = userData;

      // Pre-validate data before sending to API
      const preValidation = validateRegistrationData(registerData);
      if (!preValidation.valid) {
        setFormErrors((prev) => ({ ...prev, ...preValidation.errors }));
        return;
      }

      // Add debug log for registration data
      console.log("Attempting registration with:", registerData);

      const result = await register(registerData);
      console.log("Registration successful:", result);

      // Show success state
      setRegisteredUser(result);
      setRegistrationSuccess(true);
    } catch (err) {
      // Enhanced error handling for specific backend errors
      console.error("Registration failed:", err);

      // If it's a conflict error (email already exists)
      if (
        err.error &&
        typeof err.error === "string" &&
        err.error.includes("already exists")
      ) {
        setFormErrors({
          ...formErrors,
          email:
            "This email is already registered. Please use a different email or log in.",
        });
      }
      // If it's a validation error
      else if (
        err.error &&
        typeof err.error === "string" &&
        err.error.includes("Missing required field")
      ) {
        // Extract field name from error message
        const match = err.error.match(/Missing required field: (\w+)/);
        if (match && match[1]) {
          const fieldMap = {
            email: "email",
            password: "password",
            first_name: "firstName",
            last_name: "lastName",
          };
          const fieldName = fieldMap[match[1]] || match[1];
          setFormErrors({
            ...formErrors,
            [fieldName]: `${fieldName} is required`,
          });
        }
      }
      // Try to map backend error message to form fields
      else if (err.error && typeof err.error === "string") {
        const mappedErrors = mapBackendErrors(err.error);
        if (Object.keys(mappedErrors).length > 0) {
          setFormErrors((prev) => ({ ...prev, ...mappedErrors }));
        } else {
          // Show a toast message or alert for other errors
          alert(
            `Registration failed: ${
              err.error || err.message || "Unknown error"
            }`
          );
        }
      }
      // Generic error handling
      else {
        // Show a toast message or alert for other errors
        alert(
          `Registration failed: ${err.error || err.message || "Unknown error"}`
        );
      }
    }
  };
  const handleSuccessDismiss = () => {
    setRegistrationSuccess(false);
    navigate("/");
  };

  return (
    <AuthCheck>
      {registrationSuccess && (
        <RegistrationSuccess
          user={registeredUser}
          onDismiss={handleSuccessDismiss}
        />
      )}
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
        <div className="max-w-md w-full mx-auto bg-white rounded-lg shadow-lg p-8">
          <div className="text-center">
            <h1 className="text-3xl font-extrabold text-gray-900">
              Create your account
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Or{" "}
              <Link
                to="/login"
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                sign in to your existing account
              </Link>
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="p-3 bg-red-50 text-red-700 rounded-md text-sm">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium text-gray-700"
                >
                  First name
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  required
                  className={`mt-1 block w-full px-3 py-2 border ${
                    formErrors.firstName ? "border-red-300" : "border-gray-300"
                  } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                  value={userData.firstName}
                  onChange={handleChange}
                />
                {formErrors.firstName && (
                  <p className="mt-1 text-sm text-red-600">
                    {formErrors.firstName}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="lastName"
                  className="block text-sm font-medium text-gray-700"
                >
                  Last name
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  required
                  className={`mt-1 block w-full px-3 py-2 border ${
                    formErrors.lastName ? "border-red-300" : "border-gray-300"
                  } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                  value={userData.lastName}
                  onChange={handleChange}
                />
                {formErrors.lastName && (
                  <p className="mt-1 text-sm text-red-600">
                    {formErrors.lastName}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className={`mt-1 block w-full px-3 py-2 border ${
                  formErrors.email ? "border-red-300" : "border-gray-300"
                } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                value={userData.email}
                onChange={handleChange}
              />
              {formErrors.email && (
                <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className={`mt-1 block w-full px-3 py-2 border ${
                  formErrors.password ? "border-red-300" : "border-gray-300"
                } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                value={userData.password}
                onChange={handleChange}
              />
              {formErrors.password && (
                <p className="mt-1 text-sm text-red-600">
                  {formErrors.password}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700"
              >
                Confirm password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                className={`mt-1 block w-full px-3 py-2 border ${
                  formErrors.confirmPassword
                    ? "border-red-300"
                    : "border-gray-300"
                } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                value={userData.confirmPassword}
                onChange={handleChange}
              />
              {formErrors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">
                  {formErrors.confirmPassword}
                </p>
              )}
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                  loading ? "opacity-75 cursor-not-allowed" : ""
                }`}
              >
                {loading ? "Creating account..." : "Create account"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AuthCheck>
  );
};

export default RegisterPage;
