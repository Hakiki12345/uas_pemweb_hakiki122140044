import PropTypes from "prop-types";

/**
 * Error display component to show error messages
 *
 * @param {Object} props
 * @param {string} props.message - Error message to display
 * @param {Function} [props.onRetry] - Function to call when retry button is clicked
 * @param {string} [props.title="Error"] - Title for the error message
 * @param {string} [props.className] - Additional CSS classes
 * @param {string} [props.variant="default"] - Variant of error display (default, inline, toast)
 */
const ErrorDisplay = ({
  message,
  onRetry,
  title = "Error",
  className = "",
  variant = "default",
}) => {
  // Default error message if none provided
  const errorMessage =
    message || "Something went wrong. Please try again later.";

  // Variant-specific styles
  const variantStyles = {
    default:
      "bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded my-4",
    inline: "text-red-600 text-sm",
    toast: "bg-red-500 text-white px-4 py-3 rounded shadow-lg",
  };

  // Use the appropriate style based on variant
  const containerClass = `${
    variantStyles[variant] || variantStyles.default
  } ${className}`;

  // For inline variant, just show the message
  if (variant === "inline") {
    return <p className={containerClass}>{errorMessage}</p>;
  }

  return (
    <div className={containerClass} role="alert">
      <div className="flex justify-between items-start">
        <div>
          {variant !== "toast" && <p className="font-bold">{title}</p>}
          <p>{errorMessage}</p>
        </div>

        {onRetry && (
          <button
            onClick={onRetry}
            className={`px-3 py-1 rounded text-sm font-medium ${
              variant === "toast"
                ? "bg-white text-red-500 hover:bg-red-50"
                : "bg-red-200 text-red-800 hover:bg-red-300"
            }`}
            type="button"
          >
            Retry
          </button>
        )}
      </div>
    </div>
  );
};

ErrorDisplay.propTypes = {
  message: PropTypes.string,
  onRetry: PropTypes.func,
  title: PropTypes.string,
  className: PropTypes.string,
  variant: PropTypes.oneOf(["default", "inline", "toast"]),
};

export default ErrorDisplay;
