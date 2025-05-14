import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import { useAppContext } from '../context/AppContext';

const OrderConfirmationPage = () => {
  const { cart, clearCart, showToast } = useAppContext();
  
  useEffect(() => {
    if (cart.length > 0) {
      clearCart();
      showToast('Thank you for your order!', 'success');
    }
  }, []);
  
  return (
    <div className="text-center py-10 mt-18">
      <div className="text-green-500 text-6xl mb-6">
        <span className="material-icons" style={{ fontSize: '6rem' }}>check_circle</span>
      </div>
      <h1 className="text-3xl font-bold mb-4">Order Confirmed!</h1>
      <p className="text-xl text-gray-600 mb-6">
        Thank you for your purchase. Your order has been received and is being processed.
      </p>
      <p className="text-gray-600 mb-10">
        An email confirmation has been sent to your email address.
      </p>
      <div className="flex justify-center space-x-4">
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