import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
};

const favoritesSlice = createSlice({
  name: "favorites",
  initialState,
  reducers: {
    addToFavorites(state, action) {
      if (!state.items.some((item) => item.id === action.payload.id)) {
        state.items.push(action.payload);
      }
    },

    removeFromFavorites(state, action) {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },

    clearFavorites(state) {
      state.items = [];
    },

    // Set favorites from local storage or backend
    setFavorites(state, action) {
      state.items = action.payload;
    },
  },
});

export const {
  addToFavorites,
  removeFromFavorites,
  clearFavorites,
  setFavorites,
} = favoritesSlice.actions;
export default favoritesSlice.reducer;
