import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Calendar, Plus, Check } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { addToWatchlist, removeFromWatchlist } from '../store/slices/watchlistSlice.js';
import { getImageUrl } from '../services/tmdb.js';

const MovieCard = ({ movie, showWatchlistButton = true }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { items: watchlist } = useSelector((state) => state.watchlist);
  
  const isInWatchlist = watchlist.some(item => item.tmdbId === movie.id);
  
  const handleWatchlistToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) return;
    
    if (isInWatchlist) {
      dispatch(removeFromWatchlist(movie.id));
    } else {
      dispatch(addToWatchlist({
        tmdbId: movie.id,
        title: movie.title,
        posterPath: movie.poster_path,
        releaseDate: movie.release_date,
        overview: movie.overview,
        voteAverage: movie.vote_average
      }));
    }
  };

  return (
    <Link
      to={`/movie/${movie.id}`}
      className="group relative bg-slate-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
    >
      <div className="relative overflow-hidden">
        <img
          src={getImageUrl(movie.poster_path)}
          alt={movie.title}
          className="w-full h-96 object-cover group-hover:scale-110 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Watchlist Button */}
        {showWatchlistButton && user && (
          <button
            onClick={handleWatchlistToggle}
            className={`absolute top-3 right-3 p-2 rounded-full transition-all duration-200 ${
              isInWatchlist 
                ? 'bg-green-600 text-white' 
                : 'bg-black/50 text-white hover:bg-purple-600'
            }`}
          >
            {isInWatchlist ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          </button>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-purple-400 transition-colors">
          {movie.title}
        </h3>
        
        <div className="flex items-center justify-between text-sm text-gray-400 mb-2">
          <div className="flex items-center space-x-1">
            <Calendar className="h-4 w-4" />
            <span>{new Date(movie.release_date).getFullYear()}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Star className="h-4 w-4 text-yellow-500" />
            <span>{movie.vote_average?.toFixed(1)}</span>
          </div>
        </div>
        
        <p className="text-gray-300 text-sm line-clamp-3">
          {movie.overview}
        </p>
      </div>
    </Link>
  );
};

export default MovieCard;