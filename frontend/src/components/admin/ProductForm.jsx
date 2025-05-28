import { Fragment, useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import PropTypes from "prop-types";
import { productService } from "../../services";

const ProductForm = ({ isOpen, onClose, product = null }) => {
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    description: "",
    category: "",
    image: "",
    stock: "",
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const isEditMode = !!product;

  // Initialize form with product data when editing
  useEffect(() => {
    if (product) {
      setFormData({
        title: product.title || "",
        price: product.price || "",
        description: product.description || "",
        category: product.category || "",
        image: product.image || "",
        stock: product.stock || 0,
      });
      setImagePreview(product.image || "");
    }
  }, [product]);
  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await productService.getCategories();

        // Always ensure we have an array of categories
        if (Array.isArray(data) && data.length > 0) {
          setCategories(data);
        } else {
          console.warn("No categories returned from API or invalid format");
          // Use default categories as fallback
          setCategories([
            "Electronics",
            "Clothing",
            "Jewelry",
            "Men's Clothing",
            "Women's Clothing",
          ]);
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
        // Use default categories when API fails
        setCategories([
          "Electronics",
          "Clothing",
          "Jewelry",
          "Men's Clothing",
          "Women's Clothing",
        ]);
      }
    };
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "price" || name === "stock" ? parseFloat(value) : value,
    });

    // Update image preview when image URL changes
    if (name === "image") {
      setImagePreview(value);
    }
  };

  const validateForm = () => {
    const requiredFields = [
      "title",
      "price",
      "description",
      "category",
      "image",
      "stock",
    ];
    for (const field of requiredFields) {
      if (!formData[field]) {
        setError(
          `Please enter a ${field.replace(/([A-Z])/g, " $1").toLowerCase()}`
        );
        return false;
      }
    }

    if (isNaN(formData.price) || formData.price <= 0) {
      setError("Price must be a positive number");
      return false;
    }

    if (isNaN(formData.stock) || formData.stock < 0) {
      setError("Stock must be a non-negative number");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      if (isEditMode) {
        await productService.updateProduct(product.id, formData);
        window.showToast?.("Product updated successfully", "success");
      } else {
        await productService.createProduct(formData);
        window.showToast?.("Product created successfully", "success");
      }
      onClose();
      // Force refresh the product list
      setTimeout(
        () => window.dispatchEvent(new Event("product-list-update")),
        300
      );
    } catch (err) {
      console.error("Error submitting product:", err);
      setError(
        "Failed to " +
          (isEditMode ? "update" : "create") +
          " product. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };
  return (
    <Transition show={isOpen}>
      <Dialog
        as="div"
        className="fixed z-10 inset-0 overflow-y-auto"
        onClose={onClose}
      >
        <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <Transition.Child
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span
            className="hidden sm:inline-block sm:align-middle sm:h-screen"
            aria-hidden="true"
          >
            &#8203;
          </span>
          <Transition.Child
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <form onSubmit={handleSubmit}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="mb-4">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      {isEditMode ? "Edit Product" : "Add New Product"}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Fill in the details of the product below.
                    </p>
                  </div>

                  {error && (
                    <div className="mb-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
                      {error}
                    </div>
                  )}

                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label
                        htmlFor="title"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Product Name
                      </label>
                      <input
                        type="text"
                        name="title"
                        id="title"
                        value={formData.title}
                        onChange={handleChange}
                        className="mt-1 p-2 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm border border-gray-300 rounded-md"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label
                          htmlFor="price"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Price ($)
                        </label>
                        <input
                          type="number"
                          name="price"
                          id="price"
                          min="0"
                          step="0.01"
                          value={formData.price}
                          onChange={handleChange}
                          className="mt-1 p-2 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm border border-gray-300 rounded-md"
                          required
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="stock"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Stock
                        </label>
                        <input
                          type="number"
                          name="stock"
                          id="stock"
                          min="0"
                          step="1"
                          value={formData.stock}
                          onChange={handleChange}
                          className="mt-1 p-2 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm border border-gray-300 rounded-md"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="category"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Category
                      </label>{" "}
                      {categories && categories.length > 0 ? (
                        <select
                          id="category"
                          name="category"
                          value={formData.category}
                          onChange={handleChange}
                          className="mt-1 p-2 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm border border-gray-300 rounded-md"
                          required
                        >
                          <option value="">Select a category</option>
                          {categories.map((category) => (
                            <option key={category} value={category}>
                              {category}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type="text"
                          name="category"
                          id="category"
                          value={formData.category}
                          onChange={handleChange}
                          placeholder="Enter category name"
                          className="mt-1 p-2 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm border border-gray-300 rounded-md"
                          required
                        />
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="image"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Image URL
                      </label>
                      <input
                        type="text"
                        name="image"
                        id="image"
                        value={formData.image}
                        onChange={handleChange}
                        className="mt-1 p-2 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm border border-gray-300 rounded-md"
                        required
                      />
                      {imagePreview && (
                        <div className="mt-2 h-32 w-32 border rounded-md overflow-hidden">
                          <img
                            src={imagePreview}
                            alt="Product Preview"
                            className="h-full w-full object-cover"
                            onError={() => setImagePreview("")}
                          />
                        </div>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="description"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Description
                      </label>
                      <textarea
                        id="description"
                        name="description"
                        rows={3}
                        value={formData.description}
                        onChange={handleChange}
                        className="mt-1 p-2 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm border border-gray-300 rounded-md"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm ${
                      loading ? "opacity-70 cursor-not-allowed" : ""
                    }`}
                  >
                    {loading
                      ? "Processing..."
                      : isEditMode
                      ? "Update Product"
                      : "Add Product"}
                  </button>
                  <button
                    type="button"
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={onClose}
                  >
                    Cancel
                  </button>{" "}
                </div>
              </form>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

ProductForm.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  product: PropTypes.object,
};

export default ProductForm;
