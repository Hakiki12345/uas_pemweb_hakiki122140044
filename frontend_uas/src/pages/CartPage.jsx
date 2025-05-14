import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useAppContext } from "../context/AppContext";

const CartPage = () => {
  const { cart, removeFromCart } = useAppContext();
  const [quantities, setQuantities] = useState({});

  const groupedCart = useMemo(() => {
    const grouped = {};
    cart.forEach((item) => {
      if (!grouped[item.id]) {
        grouped[item.id] = {
          ...item,
          quantity: 1,
        };
      } else {
        grouped[item.id].quantity += 1;
      }
    });

    const initialQuantities = {};
    Object.values(grouped).forEach((item) => {
      initialQuantities[item.id] = item.quantity;
    });
    setQuantities(initialQuantities);
    return Object.values(grouped);
  }, [cart]);

  const cartTotal = useMemo(() => {
    return groupedCart.reduce((total, item) => {
      const itemQuantity = quantities[item.id] || item.quantity;
      return total + item.price * itemQuantity;
    }, 0);
  }, [groupedCart, quantities]);

  const handleQuantityChange = (id, value) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleRemoveItem = (id) => {
    for (let i = 0; i < cart.length; i++) {
      if (cart[i].id === id) {
        removeFromCart(id);
      }
    }
  };

  return (
    <div className="mt-18">
      <h1 className="text-3xl font-bold mb-6">Your Cart</h1>

      {groupedCart.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-xl text-gray-600 mb-6">Your cart is empty</p>
          <Link
            to="/products"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {groupedCart.map((item) => (
                  <tr key={item.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-16 w-16 flex-shrink-0">
                          <img
                            className="h-full w-full object-contain"
                            src={item.image}
                            alt={item.title}
                          />
                        </div>
                        <div className="ml-4">
                          <Link
                            to={`/products/${item.id}`}
                            className="text-sm font-medium text-gray-900 hover:text-blue-600"
                          >
                            {item.title}
                          </Link>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ${item.price.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="number"
                        min="1"
                        value={quantities[item.id] || item.quantity}
                        onChange={(e) =>
                          handleQuantityChange(
                            item.id,
                            Math.max(1, parseInt(e.target.value))
                          )
                        }
                        className="w-16 p-1 border rounded"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      $
                      {(
                        item.price * (quantities[item.id] || item.quantity)
                      ).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-semibold">Subtotal:</span>
              <span className="text-lg">${cartTotal.toFixed(2)}</span>
            </div>

            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-semibold">Shipping:</span>
              <span className="text-lg">Free</span>
            </div>

            <div className="border-t pt-4 mt-4">
              <div className="flex justify-between items-center mb-6">
                <span className="text-xl font-bold">Total:</span>
                <span className="text-xl font-bold">
                  ${cartTotal.toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between">
                <Link
                  to="/products"
                  className="border border-gray-300 px-6 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Continue Shopping
                </Link>
                <Link
                  to="/checkout"
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Proceed to Checkout
                </Link>{" "}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage;
