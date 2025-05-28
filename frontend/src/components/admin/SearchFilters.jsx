import { useState, useEffect } from "react";
import useDebounce from "../../hooks/useDebounce";
import { productService } from "../../services";

const SearchFilters = () => {
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [stockFilter, setStockFilter] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 300); // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await productService.getCategories();
        const categoriesArray = Array.isArray(data) ? data : [];
        setCategories(categoriesArray);
        console.log("Categories loaded:", categoriesArray);

        // If no categories were loaded, set default fallbacks immediately
        if (categoriesArray.length === 0) {
          console.log("No categories returned from API, using defaults");
          setDefaultCategories();
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
        setCategories([]); // Ensure categories is always an array
        setDefaultCategories();
      }
    };

    // Helper function to set default categories
    const setDefaultCategories = () => {
      setCategories([
        "Electronics",
        "Clothing",
        "Jewelry",
        "Men's Clothing",
        "Women's Clothing",
      ]);
    };

    // Try to fetch categories
    fetchCategories();
  }, []);

  // Apply filters when they change
  useEffect(() => {
    // Dispatch filtering event for parent components to listen to
    const filterEvent = new CustomEvent("product-filter-change", {
      detail: {
        searchTerm: debouncedSearchTerm,
        category: selectedCategory,
        stockFilter: stockFilter,
      },
    });
    document.dispatchEvent(filterEvent);
  }, [debouncedSearchTerm, selectedCategory, stockFilter]);

  return (
    <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
      <div>
        <label
          htmlFor="search"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Search Products
        </label>
        <input
          type="text"
          id="search"
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          placeholder="Search by name or description..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div>
        <label
          htmlFor="category"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Filter by Category
        </label>
        <select
          id="category"
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label
          htmlFor="stock"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Filter by Stock
        </label>
        <select
          id="stock"
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          value={stockFilter}
          onChange={(e) => setStockFilter(e.target.value)}
        >
          <option value="">All</option>
          <option value="in-stock">In Stock</option>
          <option value="low-stock">Low Stock (&lt;10)</option>
          <option value="out-of-stock">Out of Stock</option>
        </select>
      </div>
    </div>
  );
};

export default SearchFilters;
