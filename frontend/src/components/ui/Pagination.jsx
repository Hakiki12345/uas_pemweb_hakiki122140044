import PropTypes from "prop-types";

/**
 * Pagination component for navigating through pages of data
 *
 * @param {Object} props
 * @param {number} props.currentPage - The current page (1-based)
 * @param {number} props.totalPages - Total number of pages
 * @param {Function} props.onPageChange - Function to call when page changes
 * @param {boolean} [props.disabled=false] - Whether pagination is disabled
 */
const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  disabled = false,
}) => {
  // Don't render pagination if only one page
  if (totalPages <= 1) return null;

  const handlePageChange = (page) => {
    if (disabled) return;
    if (page < 1 || page > totalPages) return;
    onPageChange(page);
  };

  // Create array of page numbers to display
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;

    // Logic for showing which page numbers
    if (totalPages <= maxPagesToShow) {
      // If total pages is less than maxPagesToShow, show all pages
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Always include first and last page
      // And include pages around the current page

      // Current page is near the beginning
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push("...");
        pageNumbers.push(totalPages);
      }
      // Current page is near the end
      else if (currentPage >= totalPages - 2) {
        pageNumbers.push(1);
        pageNumbers.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pageNumbers.push(i);
        }
      }
      // Current page is in the middle
      else {
        pageNumbers.push(1);
        pageNumbers.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push("...");
        pageNumbers.push(totalPages);
      }
    }

    return pageNumbers;
  };

  const pageNumbers = getPageNumbers();

  return (
    <nav className="flex items-center justify-center mt-8">
      <ul className="flex space-x-1">
        {/* Previous button */}
        <li>
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={disabled || currentPage === 1}
            className={`px-3 py-1 rounded-md ${
              disabled || currentPage === 1
                ? "text-gray-400 cursor-not-allowed"
                : "text-gray-700 hover:bg-gray-200"
            }`}
            aria-label="Previous page"
          >
            &laquo;
          </button>
        </li>

        {/* Page numbers */}
        {pageNumbers.map((page, index) => (
          <li key={index}>
            {page === "..." ? (
              <span className="px-3 py-1 text-gray-500">...</span>
            ) : (
              <button
                onClick={() => handlePageChange(page)}
                disabled={disabled}
                className={`px-3 py-1 rounded-md ${
                  currentPage === page
                    ? "bg-indigo-600 text-white"
                    : "text-gray-700 hover:bg-gray-200"
                } ${disabled ? "opacity-70 cursor-not-allowed" : ""}`}
                aria-label={`Page ${page}`}
                aria-current={currentPage === page ? "page" : undefined}
              >
                {page}
              </button>
            )}
          </li>
        ))}

        {/* Next button */}
        <li>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={disabled || currentPage === totalPages}
            className={`px-3 py-1 rounded-md ${
              disabled || currentPage === totalPages
                ? "text-gray-400 cursor-not-allowed"
                : "text-gray-700 hover:bg-gray-200"
            }`}
            aria-label="Next page"
          >
            &raquo;
          </button>
        </li>
      </ul>
    </nav>
  );
};

Pagination.propTypes = {
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};

export default Pagination;
