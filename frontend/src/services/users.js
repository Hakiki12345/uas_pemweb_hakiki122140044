import api from "./api";

const userService = {
  // Get all users (admin only)
  getAllUsers: async (params = {}) => {
    try {
      const response = await api.get("/users", { params });
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : new Error("Network Error");
    }
  },

  // Get user by ID
  getUserById: async (id) => {
    try {
      const response = await api.get(`/users/${id}`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : new Error("Network Error");
    }
  },

  // Update user
  updateUser: async (id, userData) => {
    try {
      const response = await api.put(`/users/${id}`, userData);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : new Error("Network Error");
    }
  },

  // Delete user
  deleteUser: async (id) => {
    try {
      const response = await api.delete(`/users/${id}`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : new Error("Network Error");
    }
  },
  // Update user profile (current user)
  updateProfile: async (userData) => {
    try {
      // Fixed endpoint to use the correct route
      const response = await api.put("/auth/me", userData);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : new Error("Network Error");
    }
  },

  // Get user orders
  getUserOrders: async (userId) => {
    try {
      const response = await api.get(`/users/${userId}/orders`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : new Error("Network Error");
    }
  },
};

export default userService;
