import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useAppContext } from "../context/AppContext";

const OrderConfirmationPage = () => {
  const { showToast } = useAppContext();
  const location = useLocation();
  const order = location.state?.order;
  const orderPlaced = location.state?.orderPlaced;

  useEffect(() => {
    if (orderPlaced) {
      showToast("Thank you for your order!", "success");
    }
  }, [orderPlaced, showToast]);

  return (
    <div className="text-center py-10 mt-18">
      <div className="text-green-500 text-6xl mb-6">
        <span className="material-icons" style={{ fontSize: "6rem" }}>
          check_circle
        </span>
      </div>{" "}
      <h1 className="text-3xl font-bold mb-4">Order Confirmed!</h1>
      {order && (
        <div className="bg-gray-100 rounded-lg p-6 mb-6 max-w-md mx-auto">
          <h2 className="text-lg font-semibold mb-2">Order Details</h2>
          <p className="text-gray-600">Order ID: #{order.id}</p>
          <p className="text-gray-600">Total: ${order.total?.toFixed(2)}</p>
          <p className="text-gray-600">Status: {order.status}</p>
        </div>
      )}
      <p className="text-xl text-gray-600 mb-6">
        Thank you for your purchase. Your order has been received and is being
        processed.
      </p>
      <p className="text-gray-600 mb-10">
        An email confirmation has been sent to your email address.
      </p>{" "}
      <div className="flex justify-center space-x-4">
        <Link
          to="/profile"
          className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          View Order History
        </Link>
        <Link
          to="/products"
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Continue Shopping
        </Link>
        <Link
          to="/"
          className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-100"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;
