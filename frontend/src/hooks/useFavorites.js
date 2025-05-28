import { useDispatch, useSelector } from "react-redux";
import { useCallback } from "react";
import {
  addToFavorites,
  removeFromFavorites,
  clearFavorites,
  setFavorites,
} from "../redux/slices/favoritesSlice";

const useFavorites = () => {
  const dispatch = useDispatch();
  const { items } = useSelector((state) => state.favorites);

  const addItem = useCallback(
    (product) => {
      dispatch(addToFavorites(product));
    },
    [dispatch]
  );

  const removeItem = useCallback(
    (productId) => {
      dispatch(removeFromFavorites(productId));
    },
    [dispatch]
  );

  const clearAllFavorites = useCallback(() => {
    dispatch(clearFavorites());
  }, [dispatch]);

  const initializeFavorites = useCallback(
    (favorites) => {
      dispatch(setFavorites(favorites));
    },
    [dispatch]
  );

  const isItemInFavorites = useCallback(
    (productId) => {
      return items.some((item) => item.id === productId);
    },
    [items]
  );

  return {
    favorites: items,
    addItem,
    removeItem,
    clearAllFavorites,
    initializeFavorites,
    isItemInFavorites,
    favoritesCount: items.length,
  };
};

export default useFavorites;
