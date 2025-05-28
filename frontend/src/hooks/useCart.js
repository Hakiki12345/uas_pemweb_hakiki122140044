import { useDispatch, useSelector } from "react-redux";
import { useCallback } from "react";
import {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
} from "../redux/slices/cartSlice";

const useCart = () => {
  const dispatch = useDispatch();
  const { items, total } = useSelector((state) => state.cart);

  const addItem = useCallback(
    (product) => {
      dispatch(addToCart(product));
    },
    [dispatch]
  );

  const removeItem = useCallback(
    (productId) => {
      dispatch(removeFromCart(productId));
    },
    [dispatch]
  );

  const updateItemQuantity = useCallback(
    (productId, quantity) => {
      dispatch(updateQuantity({ id: productId, quantity }));
    },
    [dispatch]
  );

  const emptyCart = useCallback(() => {
    dispatch(clearCart());
  }, [dispatch]);

  return {
    items,
    total,
    addItem,
    removeItem,
    updateItemQuantity,
    emptyCart,
    itemCount: items.length,
  };
};

export default useCart;
