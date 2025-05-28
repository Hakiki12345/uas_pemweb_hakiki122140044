import { useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import useOrders from "../hooks/useOrders";
import ProtectedRoute from "../components/utils/ProtectedRoute";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import ErrorDisplay from "../components/ui/ErrorDisplay";
import useDocumentTitle from "../hooks/useDocumentTitle";

const OrderDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentOrder, loading, error, getOrderDetails } = useOrders();

  useDocumentTitle(
    currentOrder
      ? `Order #${currentOrder.id} | YourShopName`
      : "Order Details | YourShopName"
  );

  useEffect(() => {
    getOrderDetails(id);
  }, [getOrderDetails, id]);

  // Format date for display
  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Get status badge color
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-800";
      case "shipped":
        return "bg-blue-100 text-blue-800";
      case "processing":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <ProtectedRoute>
      <div className="bg-gray-50 min-h-screen py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <button
              onClick={() => navigate("/profile")}
              className="flex items-center text-sm text-indigo-600 hover:text-indigo-900"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-1"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z"
                  clipRule="evenodd"
                />
              </svg>
              Back to Profile
            </button>
          </div>

          <h1 className="text-3xl font-extrabold text-gray-900 mb-6">
            Order Details
          </h1>

          {loading ? (
            <LoadingSpinner />
          ) : error ? (
            <ErrorDisplay message={error} />
          ) : currentOrder ? (
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                <div>
                  <h2 className="text-lg leading-6 font-medium text-gray-900">
                    Order #{currentOrder.id}
                  </h2>
                  <p className="mt-1 max-w-2xl text-sm text-gray-500">
                    Placed on {formatDate(currentOrder.createdAt)}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${getStatusBadgeClass(
                    currentOrder.status
                  )}`}
                >
                  {currentOrder.status.charAt(0).toUpperCase() +
                    currentOrder.status.slice(1)}
                </span>
              </div>

              <div className="border-t border-gray-200">
                <dl>
                  <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">
                      Shipping Address
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {currentOrder.shippingAddress?.fullName}
                      <br />
                      {currentOrder.shippingAddress?.street}
                      <br />
                      {currentOrder.shippingAddress?.city},{" "}
                      {currentOrder.shippingAddress?.state}{" "}
                      {currentOrder.shippingAddress?.postalCode}
                      <br />
                      {currentOrder.shippingAddress?.country}
                    </dd>
                  </div>

                  <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">
                      Payment Method
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {currentOrder.paymentMethod}
                    </dd>
                  </div>

                  {currentOrder.trackingNumber && (
                    <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">
                        Tracking Number
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        {currentOrder.trackingNumber}
                      </dd>
                    </div>
                  )}
                </dl>
              </div>

              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Order Items
                </h3>
              </div>

              <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Product
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Price
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Quantity
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Subtotal
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {currentOrder.items.map((item) => (
                        <tr key={item.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            <div className="flex items-center">
                              <div className="h-10 w-10 flex-shrink-0">
                                <img
                                  className="h-10 w-10 rounded-md object-cover"
                                  src={item.image}
                                  alt={item.name}
                                />
                              </div>
                              <div className="ml-4">
                                <Link
                                  to={`/products/${item.productId}`}
                                  className="text-indigo-600 hover:text-indigo-900"
                                >
                                  {item.name}
                                </Link>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            ${item.price.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {item.quantity}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                            ${(item.price * item.quantity).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="border-t border-gray-200 px-6 py-4">
                <div className="flex justify-between text-base font-medium text-gray-900">
                  <p>Subtotal</p>
                  <p>${currentOrder.subtotal.toFixed(2)}</p>
                </div>
                <div className="flex justify-between text-sm text-gray-500 mt-2">
                  <p>Shipping</p>
                  <p>${currentOrder.shippingCost.toFixed(2)}</p>
                </div>
                <div className="flex justify-between text-sm text-gray-500 mt-2">
                  <p>Tax</p>
                  <p>${currentOrder.tax.toFixed(2)}</p>
                </div>
                <div className="flex justify-between text-lg font-bold text-gray-900 mt-4 pt-4 border-t border-gray-200">
                  <p>Total</p>
                  <p>${currentOrder.total.toFixed(2)}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6 text-center">
              <p className="text-gray-500">Order not found.</p>
              <Link
                to="/profile"
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Back to Profile
              </Link>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default OrderDetailPage;
