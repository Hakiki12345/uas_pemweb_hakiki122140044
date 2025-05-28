import PropTypes from "prop-types";

/**
 * LoadingSpinner component that shows a spinning indicator
 *
 * @param {Object} props
 * @param {string} [props.size="md"] - Size of the spinner (sm, md, lg)
 * @param {boolean} [props.fullPage=false] - Whether to center in full page
 * @param {boolean} [props.overlay=false] - Show with semi-transparent overlay
 * @param {string} [props.color="indigo"] - Color of the spinner
 * @param {string} [props.className] - Additional CSS classes
 */
const LoadingSpinner = ({
  size = "md",
  fullPage = false,
  overlay = false,
  color = "indigo",
  className = "",
  light = false,
}) => {
  // Size classes for the spinner
  const sizeClasses = {
    sm: "h-5 w-5 border-2",
    md: "h-10 w-10 border-2",
    lg: "h-16 w-16 border-4",
  };

  // Color classes
  const colorClass = light ? "border-white" : `border-${color}-500`;

  // Build spinner classes
  const spinnerClasses = `animate-spin rounded-full ${sizeClasses[size]} border-t-transparent ${colorClass} ${className}`;

  // Container classes based on fullPage prop
  const containerClasses = fullPage
    ? "fixed inset-0 flex items-center justify-center z-50"
    : "flex justify-center items-center py-6";

  // Determine if we should add an overlay
  const overlayElement = overlay && (
    <div className="fixed inset-0 bg-black bg-opacity-30 z-40"></div>
  );

  return (
    <>
      {overlayElement}
      <div className={containerClasses}>
        <div className={spinnerClasses}></div>
      </div>
    </>
  );
};

LoadingSpinner.propTypes = {
  size: PropTypes.oneOf(["sm", "md", "lg"]),
  fullPage: PropTypes.bool,
  overlay: PropTypes.bool,
  color: PropTypes.string,
  className: PropTypes.string,
  light: PropTypes.bool,
};

export default LoadingSpinner;
