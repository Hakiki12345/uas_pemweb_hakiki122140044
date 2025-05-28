import PropTypes from "prop-types";
import { useEffect, useState } from "react";

/**
 * Toast notification component
 *
 * @param {Object} props
 * @param {string} props.message - Message to display
 * @param {string} [props.type="success"] - Toast type (success, error, info, warning)
 * @param {Function} props.onClose - Function to call when toast is closed
 * @param {number} [props.duration=3000] - Duration in milliseconds before auto-close
 * @param {string} [props.position="bottom-right"] - Position on screen
 * @param {boolean} [props.hasCloseButton=true] - Whether to show close button
 */
const Toast = ({
  message,
  type = "success",
  onClose,
  duration = 3000,
  position = "bottom-right",
  hasCloseButton = true,
}) => {
  const [isVisible, setIsVisible] = useState(true);

  // Auto-close timer
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onClose, 300); // Wait for fade-out animation
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [onClose, duration]);

  // Close toast when clicked
  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  // Determine background color and icon based on type
  let bgColor = "bg-blue-500";
  let iconSvg = null;

  switch (type) {
    case "success":
      bgColor = "bg-green-500";
      iconSvg = (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
            clipRule="evenodd"
          />
        </svg>
      );
      break;
    case "error":
      bgColor = "bg-red-500";
      iconSvg = (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
            clipRule="evenodd"
          />
        </svg>
      );
      break;
    case "warning":
      bgColor = "bg-yellow-500";
      iconSvg = (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
            clipRule="evenodd"
          />
        </svg>
      );
      break;
    case "info":
    default:
      bgColor = "bg-blue-500";
      iconSvg = (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
            clipRule="evenodd"
          />
        </svg>
      );
  }
  // Determine position classes
  let positionClass = "bottom-4 right-4";
  switch (position) {
    case "top-right":
      positionClass = "top-4 right-4";
      break;
    case "top-left":
      positionClass = "top-4 left-4";
      break;
    case "bottom-left":
      positionClass = "bottom-4 left-4";
      break;
    case "top-center":
      positionClass = "top-4 left-1/2 transform -translate-x-1/2";
      break;
    case "bottom-center":
      positionClass = "bottom-4 left-1/2 transform -translate-x-1/2";
      break;
    default:
      positionClass = "bottom-4 right-4";
  }

  return (
    <div
      className={`fixed ${positionClass} z-50 ${bgColor} text-white px-4 py-3 rounded shadow-lg transition-opacity duration-300 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
      role="alert"
    >
      <div className="flex items-center">
        <span className="material-icons mr-2">
          {type === "success"
            ? "check_circle"
            : type === "error"
            ? "error"
            : "info"}
        </span>
        <p>{message}</p>
        <button
          onClick={() => {
            setIsVisible(false);
            setTimeout(onClose, 300);
          }}
          className="ml-4 text-white focus:outline-none"
        >
          <span className="material-icons">close</span>
        </button>
      </div>
    </div>
  );
};

Toast.propTypes = {
  message: PropTypes.string.isRequired,
  type: PropTypes.oneOf(["success", "error", "info"]),
  onClose: PropTypes.func.isRequired,
};

export default Toast;
