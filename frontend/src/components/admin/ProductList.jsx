import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { productService } from "../../services";
import LoadingSpinner from "../ui/LoadingSpinner";
import ConfirmationModal from "../ui/ConfirmationModal";

const ProductList = ({ onEdit }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [filters, setFilters] = useState({
    searchTerm: "",
    category: "",
    stockFilter: "",
  });
  // Fetch all products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await productService.getAllProducts({ per_page: 100 });
        setProducts(data);
        setFilteredProducts(data);
      } catch (err) {
        setError("Failed to load products. Please try again.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Listen for filter changes
  useEffect(() => {
    const handleFilterChange = (event) => {
      setFilters(event.detail);
    };

    document.addEventListener("product-filter-change", handleFilterChange);
    return () => {
      document.removeEventListener("product-filter-change", handleFilterChange);
    };
  }, []);

  // Apply filters when they change
  useEffect(() => {
    if (!products.length) return;

    let results = [...products];

    // Apply search term filter
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      results = results.filter(
        (product) =>
          product.title.toLowerCase().includes(searchLower) ||
          (product.description &&
            product.description.toLowerCase().includes(searchLower))
      );
    }

    // Apply category filter
    if (filters.category) {
      results = results.filter(
        (product) => product.category === filters.category
      );
    }

    // Apply stock filter
    if (filters.stockFilter) {
      switch (filters.stockFilter) {
        case "in-stock":
          results = results.filter((product) => product.stock > 0);
          break;
        case "low-stock":
          results = results.filter(
            (product) => product.stock > 0 && product.stock < 10
          );
          break;
        case "out-of-stock":
          results = results.filter((product) => product.stock === 0);
          break;
        default:
          break;
      }
    }

    setFilteredProducts(results);
  }, [filters, products]);

  // Handle product deletion
  const handleDelete = async () => {
    if (!confirmDelete) return;

    try {
      await productService.deleteProduct(confirmDelete.id);
      setProducts((prev) => prev.filter((p) => p.id !== confirmDelete.id));
      setFilteredProducts((prev) =>
        prev.filter((p) => p.id !== confirmDelete.id)
      );
      setConfirmDelete(null);
    } catch (err) {
      console.error("Failed to delete product:", err);
      window.showToast?.(
        "Failed to delete product. Please try again.",
        "error"
      );
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-500">
        <p className="mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-600 text-white rounded-md"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      {filteredProducts.length > 0 ? (
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Image
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Stock
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredProducts.map((product) => (
              <tr key={product.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-10 w-10 flex-shrink-0">
                      <img
                        className="h-10 w-10 object-cover object-center"
                        src={product.image}
                        alt={product.title}
                      />
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="max-w-xs truncate font-medium text-gray-900">
                    {product.title}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {product.category}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  ${product.price.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${
                      product.stock === 0
                        ? "bg-red-100 text-red-800"
                        : product.stock < 10
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {product.stock}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => onEdit(product)}
                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setConfirmDelete(product)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="text-center py-8 text-gray-500">
          No products found matching your criteria.
        </div>
      )}

      {confirmDelete && (
        <ConfirmationModal
          isOpen={!!confirmDelete}
          title="Delete Product"
          message={`Are you sure you want to delete "${confirmDelete.title}"? This action cannot be undone.`}
          confirmText="Delete"
          cancelText="Cancel"
          onConfirm={handleDelete}
          onCancel={() => setConfirmDelete(null)}
          isDangerous={true}
        />
      )}
    </div>
  );
};

ProductList.propTypes = {
  onEdit: PropTypes.func.isRequired,
};

export default ProductList;
