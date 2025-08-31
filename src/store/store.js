import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice.js';
import movieReducer from './slices/movieSlice.js';
import reviewReducer from './slices/reviewSlice.js';
import watchlistReducer from './slices/watchlistSlice.js';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    movies: movieReducer,
    reviews: reviewReducer,
    watchlist: watchlistReducer,
  },
});