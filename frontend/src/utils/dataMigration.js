import { addToCart } from "../redux/slices/cartSlice";
import { addToFavorites } from "../redux/slices/favoritesSlice";
import { useAppContext } from "../context/AppContext";
import { useDispatch } from "react-redux";
import { useEffect } from "react";

/**
 * Hook to migrate data from the React Context API to Redux store
 * This ensures a smooth transition from the old state management to Redux
 */
export const useMigrateContextToRedux = () => {
  const { cart, favorites } = useAppContext();
  const dispatch = useDispatch();

  useEffect(() => {
    // Migrate cart items to Redux store
    if (cart && cart.length > 0) {
      cart.forEach((item) => {
        dispatch(addToCart(item));
      });
    }

    // Migrate favorites to Redux store
    if (favorites && favorites.length > 0) {
      favorites.forEach((item) => {
        dispatch(addToFavorites(item));
      });
    }

    // This effect should run only once during the transition period
  }, [cart, favorites, dispatch]);
};

/**
 * Helper function to migrate localStorage data to the Redux store
 * Call this when initializing the application to ensure all persisted data
 * is available in the Redux store
 *
 * @param {Function} dispatch - Redux dispatch function
 */
export const migrateLocalStorageToRedux = (dispatch) => {
  try {
    // Migrate cart items from localStorage if they exist
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      const cartItems = JSON.parse(storedCart);
      cartItems.forEach((item) => {
        dispatch(addToCart(item));
      });
    }

    // Migrate favorites from localStorage if they exist
    const storedFavorites = localStorage.getItem("favorites");
    if (storedFavorites) {
      const favoriteItems = JSON.parse(storedFavorites);
      favoriteItems.forEach((item) => {
        dispatch(addToFavorites(item));
      });
    }
  } catch (error) {
    console.error("Error migrating data from localStorage:", error);
  }
};
