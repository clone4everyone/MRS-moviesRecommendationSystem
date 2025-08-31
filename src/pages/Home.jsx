import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Play, TrendingUp, Star } from 'lucide-react';
import { fetchMovies } from '../store/slices/movieSlice.js';
import MovieCard from '../components/MovieCard.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import { getImageUrl } from '../services/tmdb.js';

const Home = () => {
  const dispatch = useDispatch();
  const { featuredMovies, isLoading } = useSelector((state) => state.movies);

  useEffect(() => {
    dispatch(fetchMovies({ page: 1 }));
  }, [dispatch]);

  const heroMovie = featuredMovies[0];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      {heroMovie && (
        <div className="relative h-screen flex items-center justify-center overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${getImageUrl(heroMovie.backdrop_path, 'original')})`,
            }}
          />
          <div className="absolute inset-0 bg-black/60" />
          
          <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-yellow-400 bg-clip-text text-transparent">
              CineReview
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-2xl mx-auto">
              Discover, review, and share your passion for cinema with fellow movie enthusiasts
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/movies"
                className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg font-medium transition-colors inline-flex items-center justify-center space-x-2"
              >
                <Play className="h-5 w-5" />
                <span>Explore Movies</span>
              </Link>
              <Link
                to={`/movie/${heroMovie.id}`}
                className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-slate-900 px-8 py-3 rounded-lg font-medium transition-colors"
              >
                Watch Featured
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Featured Movies Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center space-x-3 mb-8">
            <TrendingUp className="h-6 w-6 text-purple-400" />
            <h2 className="text-3xl font-bold">Trending Now</h2>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {featuredMovies.slice(1, 9).map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          )}
          
          <div className="text-center mt-12">
            <Link
              to="/movies"
              className="bg-slate-800 hover:bg-slate-700 text-white px-8 py-3 rounded-lg font-medium transition-colors inline-flex items-center space-x-2"
            >
              <span>View All Movies</span>
              <Star className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-slate-800">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-purple-400 mb-2">10K+</div>
              <div className="text-gray-300">Movies Reviewed</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-yellow-400 mb-2">50K+</div>
              <div className="text-gray-300">User Reviews</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-400 mb-2">25K+</div>
              <div className="text-gray-300">Active Users</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;