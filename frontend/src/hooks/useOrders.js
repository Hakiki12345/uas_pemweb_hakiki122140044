import { useDispatch, useSelector } from "react-redux";
import { useCallback } from "react";
import {
  createOrder,
  fetchUserOrders,
  fetchOrderDetails,
  clearOrderError,
  clearCurrentOrder,
} from "../redux/slices/orderSlice";

const useOrders = () => {
  const dispatch = useDispatch();
  const { orders, currentOrder, loading, error } = useSelector(
    (state) => state.orders
  );

  const placeOrder = useCallback(
    (orderData) => {
      return dispatch(createOrder(orderData));
    },
    [dispatch]
  );

  const getUserOrders = useCallback(() => {
    return dispatch(fetchUserOrders());
  }, [dispatch]);

  const getOrderDetails = useCallback(
    (orderId) => {
      return dispatch(fetchOrderDetails(orderId));
    },
    [dispatch]
  );

  const clearError = useCallback(() => {
    dispatch(clearOrderError());
  }, [dispatch]);

  const clearOrder = useCallback(() => {
    dispatch(clearCurrentOrder());
  }, [dispatch]);

  return {
    orders,
    currentOrder,
    loading,
    error,
    placeOrder,
    getUserOrders,
    getOrderDetails,
    clearError,
    clearOrder,
  };
};

export default useOrders;
