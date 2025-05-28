import { useState, useEffect, useCallback, useMemo } from "react";
import useDebounce from "../hooks/useDebounce";
import ErrorDisplay from "../components/ui/ErrorDisplay";
import ProductCard from "../components/common/ProductCard";
import ProductCardSkeleton from "../components/ui/ProductCardSkeleton";
import { productService } from "../services";

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await productService.getAllProducts({ per_page: 100 });
        setProducts(data);
        setError(null);
      } catch (err) {
        setError(err.message || "Failed to fetch products");
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const [filteredProducts, setFilteredProducts] = useState([]);
  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortOption, setSortOption] = useState("default");
  const [searchLoading, setSearchLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [featuredProduct, setFeaturedProduct] = useState(null);
  const productsPerPage = 8;
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const categories = useMemo(() => {
    if (!products) return [];
    const categorySet = new Set(products.map((product) => product.category));
    const categoryArray = ["", ...categorySet];
    const stats = {};
    categoryArray.slice(1).forEach((category) => {
      const categoryProducts = products.filter((p) => p.category === category);
      stats[category] = {
        count: categoryProducts.length,
        avgPrice: parseFloat(
          (
            categoryProducts.reduce((sum, p) => sum + p.price, 0) /
            categoryProducts.length
          ).toFixed(2)
        ),
        maxRating: Math.max(
          ...categoryProducts.map((p) => p.rating?.rate || 0)
        ),
      };
    });
    return categoryArray;
  }, [products]);

  useEffect(() => {
    if (products && products.length) {
      const topRated = [...products].sort(
        (a, b) => (b.rating?.rate || 0) - (a.rating?.rate || 0)
      )[0];
      setFeaturedProduct(topRated);
    }
  }, [products]);

  const filterAndSortProducts = useCallback(() => {
    if (!products) return;
    setSearchLoading(true);
    let result = [...products];
    if (selectedCategory) {
      result = result.filter(
        (product) => product.category === selectedCategory
      );
    }

    if (debouncedSearchTerm.trim()) {
      const lowercasedTerm = debouncedSearchTerm.toLowerCase();
      result = result.filter(
        (product) =>
          product.title.toLowerCase().includes(lowercasedTerm) ||
          product.description.toLowerCase().includes(lowercasedTerm)
      );
    }

    switch (sortOption) {
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "name-asc":
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "name-desc":
        result.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case "rating-desc":
        result.sort((a, b) => (b.rating?.rate || 0) - (a.rating?.rate || 0));
        break;
      default:
        result.sort((a, b) => a.id - b.id);
    }
    setFilteredProducts(result);
    setCurrentPage(1);
    setSearchLoading(false);
  }, [products, debouncedSearchTerm, selectedCategory, sortOption]);

  useEffect(() => {
    filterAndSortProducts();
  }, [filterAndSortProducts]);

  useEffect(() => {
    if (filteredProducts.length === 0) return;
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    setDisplayedProducts(
      filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct)
    );
  }, [filteredProducts, currentPage]);

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="container mx-auto px-4 py-8 mt-18">
      {featuredProduct && !selectedCategory && !debouncedSearchTerm && (
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 mb-10 shadow-lg">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 text-white mb-6 md:mb-0">
              <span className="bg-yellow-500 text-yellow-900 text-xs px-3 py-1 rounded-full uppercase font-bold tracking-wider">
                Featured Product
              </span>
              <h2 className="text-3xl font-bold mt-4 mb-2">
                {featuredProduct.title}
              </h2>
              <div className="flex items-center mb-4">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.round(featuredProduct.rating?.rate || 0)
                          ? "text-yellow-300"
                          : "text-gray-300"
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="ml-2 text-white">
                  {featuredProduct.rating?.rate} (
                  {featuredProduct.rating?.count} reviews)
                </span>
              </div>
              <p className="text-white/90 mb-4 line-clamp-2">
                {featuredProduct.description}
              </p>
              <div className="flex items-center">
                <span className="text-2xl font-bold">
                  ${featuredProduct.price}
                </span>
                <button className="ml-4 bg-white text-purple-600 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                  View Details
                </button>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <div className="relative bg-white p-4 rounded-lg h-64 w-64 flex items-center justify-center shadow-md">
                <img
                  src={featuredProduct.image}
                  alt={featuredProduct.title}
                  className="max-h-56 max-w-56 object-contain animate-float"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">
          {selectedCategory
            ? selectedCategory.charAt(0).toUpperCase() +
              selectedCategory.slice(1)
            : debouncedSearchTerm
            ? `Search Results for "${debouncedSearchTerm}"`
            : "All Products"}
        </h1>
        {selectedCategory && (
          <button
            onClick={() => setSelectedCategory("")}
            className="text-blue-600 hover:text-blue-800 flex items-center"
          >
            <svg
              className="w-5 h-5 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to all categories
          </button>
        )}
      </div>

      <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50 p-4 rounded-lg shadow-sm">
        <div className="relative">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="p-3 pl-10 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition-all"
          />
          <svg
            className="w-5 h-5 absolute left-3 top-3.5 text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          {searchLoading && (
            <span className="absolute right-3 top-3.5">
              <div className="animate-spin h-5 w-5 border-t-2 border-b-2 border-blue-500 rounded-full"></div>
            </span>
          )}
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition-all"
        >
          <option value="">All Categories</option>
          {categories.slice(1).map((category) => (
            <option key={category} value={category}>
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </option>
          ))}
        </select>

        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition-all"
        >
          <option value="default">Default Sorting</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="name-asc">Name: A to Z</option>
          <option value="name-desc">Name: Z to A</option>
          <option value="rating-desc">Top Rated</option>
        </select>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, index) => (
            <ProductCardSkeleton key={index} />
          ))}
        </div>
      ) : error ? (
        <ErrorDisplay message={error} />
      ) : filteredProducts.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-10 text-center">
          <svg
            className="w-16 h-16 text-gray-400 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="text-gray-500 text-xl">
            No products found matching your criteria.
          </p>
          <button
            onClick={() => {
              setSearchTerm("");
              setSelectedCategory("");
              setSortOption("default");
            }}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center mb-4 bg-gray-50 p-3 rounded-lg">
            <p className="text-gray-600">
              Showing{" "}
              {filteredProducts.length > 0
                ? `${(currentPage - 1) * productsPerPage + 1}-${Math.min(
                    currentPage * productsPerPage,
                    filteredProducts.length
                  )} of `
                : ""}
              {filteredProducts.length}{" "}
              {filteredProducts.length === 1 ? "product" : "products"}
            </p>
            <div className="flex items-center">
              <button
                onClick={() => setSortOption("rating-desc")}
                className={`mr-2 px-3 py-1 rounded-full text-sm ${
                  sortOption === "rating-desc"
                    ? "bg-blue-100 text-blue-800"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Top Rated
              </button>
              <button
                onClick={() => setSortOption("price-asc")}
                className={`mr-2 px-3 py-1 rounded-full text-sm ${
                  sortOption === "price-asc"
                    ? "bg-blue-100 text-blue-800"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Price: Low to High
              </button>
              <button
                onClick={() => setSortOption("price-desc")}
                className={`px-3 py-1 rounded-full text-sm ${
                  sortOption === "price-desc"
                    ? "bg-blue-100 text-blue-800"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Price: High to Low
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {displayedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center mt-10">
              <nav className="flex items-center bg-white px-4 py-3 rounded-lg shadow-sm">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className={`mx-1 px-4 py-2 rounded-md ${
                    currentPage === 1
                      ? "text-gray-400 bg-gray-100 cursor-not-allowed"
                      : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  } flex items-center`}
                >
                  <svg
                    className="w-5 h-5 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                  Prev
                </button>

                <div className="hidden md:flex">
                  {pageNumbers.map((number) => (
                    <button
                      key={number}
                      onClick={() => setCurrentPage(number)}
                      className={`mx-1 px-4 py-2 rounded-md ${
                        currentPage === number
                          ? "bg-blue-600 text-white"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      {number}
                    </button>
                  ))}
                </div>

                <div className="flex md:hidden">
                  <span className="px-4 py-2">
                    Page {currentPage} of {totalPages}
                  </span>
                </div>

                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className={`mx-1 px-4 py-2 rounded-md ${
                    currentPage === totalPages
                      ? "text-gray-400 bg-gray-100 cursor-not-allowed"
                      : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  } flex items-center`}
                >
                  Next
                  <svg
                    className="w-5 h-5 ml-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </nav>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ProductsPage;
