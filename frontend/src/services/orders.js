import api from "./api";

const orderService = {
  // Create a new order
  createOrder: async (orderData) => {
    try {
      const response = await api.post("/orders", orderData);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : new Error("Network Error");
    }
  },
  // Get all orders (admin only)
  getAllOrders: async (params = {}) => {
    try {
      const queryString = new URLSearchParams(params).toString();
      const url = queryString ? `/orders?${queryString}` : "/orders";
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : new Error("Network Error");
    }
  },

  // Get order by ID
  getOrderById: async (id) => {
    try {
      const response = await api.get(`/orders/${id}`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : new Error("Network Error");
    }
  },
  // Get current user orders
  getUserOrders: async () => {
    try {
      // Debug URL information
      console.log(
        "Fetching user orders from:",
        api.defaults.baseURL + "/orders/user"
      );

      const response = await api.get("/orders/user");
      console.log("User orders response:", response.data);

      // Handle different response formats gracefully
      if (response.data && response.data.items) {
        return response.data.items;
      } else if (Array.isArray(response.data)) {
        return response.data;
      } else if (response.data && response.data.error) {
        console.warn("Server returned an error:", response.data.error);
        return [];
      } else {
        console.warn("Unexpected response format:", response.data);
        return [];
      }
    } catch (error) {
      console.error("Error fetching user orders:", error);
      // Return empty array instead of throwing to avoid breaking the UI
      return [];
    }
  },
  // Update order status (admin only)
  updateOrderStatus: async (id, status, trackingNumber = null) => {
    try {
      const updateData = { status };
      if (trackingNumber) {
        updateData.tracking_number = trackingNumber;
      }
      const response = await api.patch(`/orders/${id}`, updateData);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : new Error("Network Error");
    }
  },

  // Delete order (admin only)
  deleteOrder: async (id) => {
    try {
      const response = await api.delete(`/orders/${id}`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : new Error("Network Error");
    }
  },
};

export default orderService;
