import api from "./api";

const productService = {
  // Get all products with optional filtering
  getAllProducts: async (params = {}) => {
    try {
      const response = await api.get("/products", { params });
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : new Error("Network Error");
    }
  },

  // Get a single product by ID
  getProductById: async (id) => {
    try {
      const response = await api.get(`/products/${id}`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : new Error("Network Error");
    }
  },

  // Get products by category
  getProductsByCategory: async (category) => {
    try {
      const response = await api.get(`/products/category/${category}`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : new Error("Network Error");
    }
  },

  // Create a new product (requires authentication)
  createProduct: async (productData) => {
    try {
      const response = await api.post("/products", productData);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : new Error("Network Error");
    }
  },
  // Update a product (requires authentication)
  updateProduct: async (id, productData) => {
    try {
      const response = await api.put(`/products/${id}`, productData);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : new Error("Network Error");
    }
  },
  // Delete a product (requires admin authentication)
  deleteProduct: async (id) => {
    try {
      // Ensure we're sending cookies with the request
      const response = await api.delete(`/products/${id}`, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 403) {
        console.error("Forbidden: User doesn't have admin privileges");
        throw new Error(
          "You don't have permission to delete products. Admin privileges required."
        );
      }
      throw error.response ? error.response.data : new Error("Network Error");
    }
  }, // Get all product categories
  getCategories: async () => {
    try {
      console.log("Fetching categories from API...");
      const response = await api.get("/products/categories");

      if (!response || !response.data) {
        console.warn("Categories API returned empty response");
        return [];
      }

      // Handle the new response format with status and categories fields
      if (
        response.data &&
        typeof response.data === "object" &&
        response.data.categories
      ) {
        if (response.data.status === "error") {
          console.warn("Categories API returned error:", response.data.message);
        }

        if (Array.isArray(response.data.categories)) {
          console.log(
            `Successfully fetched ${response.data.categories.length} categories:`,
            response.data.categories
          );
          return response.data.categories;
        } else {
          console.warn(
            "Categories field is not an array:",
            response.data.categories
          );
          return [];
        }
      }
      // Handle the old response format where the entire response data is the categories array
      else if (Array.isArray(response.data)) {
        console.log(
          `Successfully fetched ${response.data.length} categories:`,
          response.data
        );
        return response.data;
      } else {
        console.warn(
          "Categories API returned unexpected format:",
          response.data
        );
        return [];
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      if (error.response) {
        console.error("Error response:", {
          status: error.response.status,
          statusText: error.response.statusText,
          data: error.response.data,
        });
      }
      // Return empty array instead of throwing error to avoid breaking UI
      return [];
    }
  },
};

export default productService;
