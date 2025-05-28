import { createContext, useContext, useReducer, useEffect } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';

const ADD_TO_CART = 'ADD_TO_CART';
const REMOVE_FROM_CART = 'REMOVE_FROM_CART';
const ADD_TO_FAVORITES = 'ADD_TO_FAVORITES';
const REMOVE_FROM_FAVORITES = 'REMOVE_FROM_FAVORITES';
const SET_USER = 'SET_USER';
const CLEAR_CART = 'CLEAR_CART';

function appReducer(state, action) {
  switch (action.type) {
    case ADD_TO_CART:
      return {
        ...state,
        cart: [...state.cart, action.payload],
      };
    case REMOVE_FROM_CART:
      return {
        ...state,
        cart: state.cart.filter(item => item.id !== action.payload),
      };
    case ADD_TO_FAVORITES:
      return {
        ...state,
        favorites: [...state.favorites, action.payload],
      };
    case REMOVE_FROM_FAVORITES:
      return {
        ...state,
        favorites: state.favorites.filter(item => item.id !== action.payload),
      };
    case SET_USER:
      return {
        ...state,
        user: action.payload,
      };
    case CLEAR_CART:
      return {
        ...state,
        cart: [],
      };
    default:
      return state;
  }
}

const AppContext = createContext();

export function AppProvider({ children }) {
  const [savedCart, setSavedCart] = useLocalStorage('cart', []);
  const [savedFavorites, setSavedFavorites] = useLocalStorage('favorites', []);
  
  const initialState = {
    cart: savedCart,
    favorites: savedFavorites,
    user: null,
  };
  
  const [state, dispatch] = useReducer(appReducer, initialState);
  
  useEffect(() => {
    setSavedCart(state.cart);
  }, [state.cart, setSavedCart]);
  
  useEffect(() => {
    setSavedFavorites(state.favorites);
  }, [state.favorites, setSavedFavorites]);
  
  const showToast = (message, type = 'success') => {
    if (window.showToast) {
      window.showToast(message, type);
    }
  };

  const addToCart = (product) => {
    dispatch({ type: ADD_TO_CART, payload: product });
    showToast(`${product.title} added to cart`, 'success');
  };

  const removeFromCart = (productId) => {
    dispatch({ type: REMOVE_FROM_CART, payload: productId });
    showToast('Item removed from cart', 'info');
  };

  const clearCart = () => {
    dispatch({ type: CLEAR_CART });
  };

  const addToFavorites = (product) => {
    dispatch({ type: ADD_TO_FAVORITES, payload: product });
    showToast(`${product.title} added to favorites`, 'success');
  };

  const removeFromFavorites = (productId) => {
    dispatch({ type: REMOVE_FROM_FAVORITES, payload: productId });
    showToast('Item removed from favorites', 'info');
  };

  const setUser = (user) => {
    dispatch({ type: SET_USER, payload: user });
  };

  const value = {
    ...state,
    addToCart,
    removeFromCart,
    clearCart,
    addToFavorites,
    removeFromFavorites,
    setUser,
    showToast
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}