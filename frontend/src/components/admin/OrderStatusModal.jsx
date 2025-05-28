import { useState } from "react";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import PropTypes from "prop-types";

const OrderStatusModal = ({ isOpen, onClose, order, onStatusChange }) => {
  const [status, setStatus] = useState(order?.status || "processing");
  const [trackingNumber, setTrackingNumber] = useState(
    order?.tracking_number || ""
  );
  const [loading, setLoading] = useState(false);

  const statusOptions = [
    { value: "processing", label: "Processing", color: "yellow" },
    { value: "shipped", label: "Shipped", color: "blue" },
    { value: "delivered", label: "Delivered", color: "green" },
    { value: "cancelled", label: "Cancelled", color: "red" },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await onStatusChange(order.id, status, trackingNumber);
      onClose();
    } catch (error) {
      console.error("Failed to update order status:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (statusValue) => {
    const option = statusOptions.find((opt) => opt.value === statusValue);
    return option?.color || "gray";
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="mx-auto max-w-md rounded-xl bg-white p-6 shadow-2xl">
          <DialogTitle className="text-lg font-bold text-gray-900 mb-4">
            Update Order Status
          </DialogTitle>

          <div className="mb-4 p-4 bg-gray-50 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-600">Order:</span>
              <span className="font-bold">#{order?.id}</span>
            </div>
            <div className="flex justify-between items-center mt-2">
              <span className="text-sm font-medium text-gray-600">
                Customer:
              </span>
              <span className="text-sm">
                {order?.shipping_address?.fullName}
              </span>
            </div>
            <div className="flex justify-between items-center mt-2">
              <span className="text-sm font-medium text-gray-600">Total:</span>
              <span className="font-medium">${order?.total?.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center mt-2">
              <span className="text-sm font-medium text-gray-600">
                Current Status:
              </span>
              <span
                className={`px-2 py-1 text-xs font-semibold rounded-full bg-${getStatusColor(
                  order?.status
                )}-100 text-${getStatusColor(order?.status)}-800`}
              >
                {order?.status?.charAt(0).toUpperCase() +
                  order?.status?.slice(1)}
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tracking Number
                <span className="text-gray-500 text-xs ml-1">(optional)</span>
              </label>
              <input
                type="text"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                placeholder="Enter tracking number"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                Tracking number will be visible to the customer
              </p>
            </div>

            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className={`flex-1 px-4 py-2 text-sm font-medium text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Updating...
                  </div>
                ) : (
                  "Update Status"
                )}
              </button>
            </div>
          </form>
        </DialogPanel>
      </div>
    </Dialog>
  );
};

OrderStatusModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  order: PropTypes.object,
  onStatusChange: PropTypes.func.isRequired,
};

export default OrderStatusModal;
