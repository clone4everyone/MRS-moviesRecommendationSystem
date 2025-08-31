import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api.js';
import { getTMDBMovies, getTMDBMovieDetails, searchTMDBMovies } from '../../services/tmdb.js';

export const fetchMovies = createAsyncThunk(
  'movies/fetchMovies',
  async ({ page = 1, genre, year, rating }, { rejectWithValue }) => {
    try {
      const tmdbResponse = await getTMDBMovies(page);
      const response = await api.get('/movies', {
        params: { page, genre, year, rating }
      });
      return {
        movies: tmdbResponse.results,
        pagination: {
          currentPage: page,
          totalPages: tmdbResponse.total_pages,
          totalResults: tmdbResponse.total_results
        },
        localMovies: response.data.movies
      };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch movies');
    }
  }
);

export const fetchMovieDetails = createAsyncThunk(
  'movies/fetchMovieDetails',
  async (movieId, { rejectWithValue }) => {
    try {
      const tmdbDetails = await getTMDBMovieDetails(movieId);
      const response = await api.get(`/movies/${movieId}`);
      
      return {
        ...tmdbDetails,
        localData: response.data
      };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch movie details');
    }
  }
);

export const searchMovies = createAsyncThunk(
  'movies/searchMovies',
  async (query, { rejectWithValue }) => {
    try {
      const response = await searchTMDBMovies(query);
      return response.results;
    } catch (error) {
      return rejectWithValue('Search failed');
    }
  }
);

const movieSlice = createSlice({
  name: 'movies',
  initialState: {
    movies: [],
    featuredMovies: [],
    currentMovie: null,
    searchResults: [],
    pagination: {
      currentPage: 1,
      totalPages: 1,
      totalResults: 0
    },
    isLoading: false,
    error: null,
  },
  reducers: {
    clearCurrentMovie: (state) => {
      state.currentMovie = null;
    },
    clearSearchResults: (state) => {
      state.searchResults = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMovies.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMovies.fulfilled, (state, action) => {
       
        state.isLoading = false;
        state.movies = action.payload.movies;
        state.pagination = action.payload.pagination;
        state.featuredMovies=action.payload.movies.slice(0,6);
        if (action.payload.currentPage === 1) {
          state.featuredMovies = action.payload.movies.slice(0, 6);
        }
      })
      .addCase(fetchMovies.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchMovieDetails.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMovieDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentMovie = action.payload;
      })
      .addCase(fetchMovieDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(searchMovies.fulfilled, (state, action) => {
        state.searchResults = action.payload;
      });
  },
});

export const { clearCurrentMovie, clearSearchResults } = movieSlice.actions;
export default movieSlice.reducer;