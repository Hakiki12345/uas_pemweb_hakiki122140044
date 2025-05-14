import PropTypes from 'prop-types';

const ErrorDisplay = ({ message }) => {
  return (
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded my-4" role="alert">
      <p className="font-bold">Error</p>
      <p>{message || 'Something went wrong. Please try again later.'}</p>
    </div>
  );
};

ErrorDisplay.propTypes = {
  message: PropTypes.string
};

export default ErrorDisplay;