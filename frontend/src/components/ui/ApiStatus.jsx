import PropTypes from "prop-types";
import LoadingSpinner from "./LoadingSpinner";
import ErrorDisplay from "./ErrorDisplay";

/**
 * ApiStatus component displays loading, error, and empty states for API calls
 *
 * @param {Object} props
 * @param {boolean} props.loading - Whether data is loading
 * @param {string|null} props.error - Error message if any
 * @param {boolean} props.isEmpty - Whether data is empty
 * @param {string} [props.emptyMessage="No data available"] - Message to show when empty
 * @param {React.ReactNode} props.children - Content to show when data is available
 * @param {Function} [props.onRetry] - Function to call when retry button is clicked
 */
const ApiStatus = ({
  loading,
  error,
  isEmpty,
  emptyMessage = "No data available",
  children,
  onRetry,
}) => {
  if (loading) {
    return (
      <div className="py-8">
        <LoadingSpinner size="md" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-4">
        <ErrorDisplay message={error} onRetry={onRetry} />
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div className="py-8 text-center">
        <div className="text-gray-500">{emptyMessage}</div>
      </div>
    );
  }

  return children;
};

ApiStatus.propTypes = {
  loading: PropTypes.bool,
  error: PropTypes.string,
  isEmpty: PropTypes.bool,
  emptyMessage: PropTypes.string,
  children: PropTypes.node.isRequired,
  onRetry: PropTypes.func,
};

export default ApiStatus;
