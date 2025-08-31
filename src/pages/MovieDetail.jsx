import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Star, Calendar, Clock, Users, Plus, Check, Play } from 'lucide-react';
import { fetchMovieDetails } from '../store/slices/movieSlice.js';
import { fetchMovieReviews } from '../store/slices/reviewSlice.js';
import { addToWatchlist, removeFromWatchlist } from '../store/slices/watchlistSlice.js';
import ReviewForm from '../components/ReviewForm.jsx';
import ReviewCard from '../components/ReviewCard.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import { getImageUrl, getTrailerUrl } from '../services/tmdb.js';

const MovieDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { currentMovie, isLoading } = useSelector((state) => state.movies);
  const { movieReviews } = useSelector((state) => state.reviews);
  const { user } = useSelector((state) => state.auth);
  const { items: watchlist } = useSelector((state) => state.watchlist);
  const [showReviewForm, setShowReviewForm] = useState(false);

  const isInWatchlist = watchlist.some(item => item.tmdbId === parseInt(id));

  useEffect(() => {
    dispatch(fetchMovieDetails(id));
    dispatch(fetchMovieReviews(id));
  }, [dispatch, id]);

  const handleWatchlistToggle = () => {
    if (!user) return;
    
    if (isInWatchlist) {
      dispatch(removeFromWatchlist(parseInt(id)));
    } else {
      dispatch(addToWatchlist({
        tmdbId: currentMovie.id,
        title: currentMovie.title,
        posterPath: currentMovie.poster_path,
        releaseDate: currentMovie.release_date,
        overview: currentMovie.overview,
        voteAverage: currentMovie.vote_average
      }));
    }
  };

  const formatRuntime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const trailerUrl = getTrailerUrl(currentMovie?.videos);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="xl" />
      </div>
    );
  }

  if (!currentMovie) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400 text-lg">Movie not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative h-screen flex items-end">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${getImageUrl(currentMovie.backdrop_path, 'original')})`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/80 to-transparent" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-end">
            <div className="lg:col-span-1">
              <img
                src={getImageUrl(currentMovie.poster_path, 'w500')}
                alt={currentMovie.title}
                className="w-full max-w-sm mx-auto lg:mx-0 rounded-xl shadow-2xl"
              />
            </div>
            
            <div className="lg:col-span-2 space-y-6">
              <div>
                <h1 className="text-4xl md:text-6xl font-bold mb-4">{currentMovie.title}</h1>
                <p className="text-xl text-gray-300 leading-relaxed max-w-3xl">
                  {currentMovie.overview}
                </p>
              </div>
              
              <div className="flex flex-wrap items-center gap-6 text-gray-300">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5" />
                  <span>{new Date(currentMovie.release_date).getFullYear()}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-5 w-5" />
                  <span>{formatRuntime(currentMovie.runtime)}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Star className="h-5 w-5 text-yellow-500" />
                  <span>{currentMovie.vote_average?.toFixed(1)}/10</span>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {currentMovie.genres?.map((genre) => (
                  <span
                    key={genre.id}
                    className="bg-purple-600/20 text-purple-300 px-3 py-1 rounded-full text-sm"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>
              
              <div className="flex flex-wrap gap-4">
                {trailerUrl && (
                  <a
                    href={trailerUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium transition-colors inline-flex items-center space-x-2"
                  >
                    <Play className="h-5 w-5" />
                    <span>Watch Trailer</span>
                  </a>
                )}
                
                {user && (
                  <button
                    onClick={handleWatchlistToggle}
                    className={`px-6 py-3 rounded-lg font-medium transition-colors inline-flex items-center space-x-2 ${
                      isInWatchlist
                        ? 'bg-green-600 hover:bg-green-700 text-white'
                        : 'bg-slate-800 hover:bg-slate-700 text-white'
                    }`}
                  >
                    {isInWatchlist ? (
                      <>
                        <Check className="h-5 w-5" />
                        <span>In Watchlist</span>
                      </>
                    ) : (
                      <>
                        <Plus className="h-5 w-5" />
                        <span>Add to Watchlist</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cast Section */}
      {currentMovie.credits?.cast && (
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 flex items-center space-x-3">
              <Users className="h-6 w-6 text-purple-400" />
              <span>Cast</span>
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {currentMovie.credits.cast.slice(0, 12).map((actor) => (
                <div key={actor.id} className="text-center">
                  <img
                    src={getImageUrl(actor.profile_path, 'w185')}
                    alt={actor.name}
                    className="w-full h-48 object-cover rounded-lg mb-2"
                  />
                  <h4 className="font-medium text-sm">{actor.name}</h4>
                  <p className="text-gray-400 text-xs">{actor.character}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Reviews Section */}
      <section className="py-16 px-4 bg-slate-800">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Reviews</h2>
            {user && (
              <button
                onClick={() => setShowReviewForm(!showReviewForm)}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                {showReviewForm ? 'Cancel' : 'Write Review'}
              </button>
            )}
          </div>
          
          {showReviewForm && (
            <div className="mb-8">
              <ReviewForm
                movieId={id}
                onReviewSubmitted={() => {
                  setShowReviewForm(false);
                  dispatch(fetchMovieReviews(id));
                }}
              />
            </div>
          )}
          
          <div className="space-y-6">
            {movieReviews.reviews?.map((review) => (
              <ReviewCard key={review._id} review={review} />
            ))}
          </div>
          
          {movieReviews.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">No reviews yet</p>
              <p className="text-gray-500">Be the first to share your thoughts!</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default MovieDetail;