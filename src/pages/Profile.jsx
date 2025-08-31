import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { User, Star, Film, Clock } from 'lucide-react';
import { fetchUserReviews } from '../store/slices/reviewSlice.js';
import { fetchWatchlist } from '../store/slices/watchlistSlice.js';
import MovieCard from '../components/MovieCard.jsx';
import ReviewCard from '../components/ReviewCard.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';

const Profile = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { userReviews, isLoading: reviewsLoading } = useSelector((state) => state.reviews);
  const { items: watchlist, isLoading: watchlistLoading } = useSelector((state) => state.watchlist);
console.log(userReviews)
  useEffect(() => {
    if (user) {
      dispatch(fetchUserReviews(user.id));
      dispatch(fetchWatchlist());
    }
  }, [dispatch, user]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const averageRating = userReviews.reviews.length > 0
    ? (userReviews.reviews.reduce((sum, review) => sum + review.rating, 0) / userReviews.reviews.length).toFixed(1)
    : 0;

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Profile Header */}
        <div className="bg-slate-800 rounded-xl p-8 mb-8">
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
            <div className="w-24 h-24 bg-purple-600 rounded-full flex items-center justify-center">
              <User className="h-12 w-12 text-white" />
            </div>
            
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold mb-2">{user?.username}</h1>
              <p className="text-gray-400 mb-4">{user?.email}</p>
              <p className="text-sm text-gray-500">
                Member since {formatDate(user?.createdAt)}
              </p>
            </div>
            
            <div className="grid grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-2xl font-bold text-purple-400">{userReviews?.reviews?.length}</div>
                <div className="text-gray-400 text-sm">Reviews</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-yellow-400">{averageRating}</div>
                <div className="text-gray-400 text-sm">Avg Rating</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-400">{watchlist.length}</div>
                <div className="text-gray-400 text-sm">Watchlist</div>
              </div>
            </div>
          </div>
        </div>

        {/* Watchlist Section */}
        <section className="mb-12">
          <div className="flex items-center space-x-3 mb-6">
            <Film className="h-6 w-6 text-purple-400" />
            <h2 className="text-2xl font-bold">My Watchlist</h2>
          </div>
          
          {watchlistLoading ? (
            <div className="flex justify-center py-8">
              <LoadingSpinner size="lg" />
            </div>
          ) : watchlist.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {watchlist.map((item) => (
                <MovieCard
                  key={item.tmdbId}
                  movie={{
                    id: item.tmdbId,
                    title: item.title,
                    poster_path: item.posterPath,
                    release_date: item.releaseDate,
                    overview: item.overview,
                    vote_average: item.voteAverage
                  }}
                  showWatchlistButton={false}
                />
              ))}
            </div>
          ) : (
            <div className="bg-slate-800 rounded-lg p-8 text-center">
              <Film className="h-12 w-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">Your watchlist is empty</p>
              <p className="text-gray-500 text-sm">Add movies you want to watch later</p>
            </div>
          )}
        </section>

        {/* Reviews Section */}
        <section>
          <div className="flex items-center space-x-3 mb-6">
            <Star className="h-6 w-6 text-yellow-400" />
            <h2 className="text-2xl font-bold">My Reviews</h2>
          </div>
          
          {reviewsLoading ? (
            <div className="flex justify-center py-8">
              <LoadingSpinner size="lg" />
            </div>
          ) : userReviews.reviews.length > 0 ? (
            <div className="space-y-6">
              {userReviews.reviews.map((review) => (
                <div key={review._id} className="bg-slate-800 rounded-lg overflow-hidden">
                  <div className="p-4 border-b border-slate-700">
                    <h3 className="font-semibold text-lg text-purple-400">
                      {review.movie?.title || 'Unknown Movie'}
                    </h3>
                    <div className="flex items-center space-x-2 text-gray-400 text-sm mt-1">
                      <Clock className="h-4 w-4" />
                      <span>{formatDate(review.createdAt)}</span>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center space-x-1 mb-3">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-5 w-5 ${
                            star <= review.rating
                              ? 'text-yellow-500 fill-current'
                              : 'text-gray-600'
                          }`}
                        />
                      ))}
                      <span className="ml-2 text-gray-400">({review.rating}/5)</span>
                    </div>
                    <p className="text-gray-300">{review.reviewText}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-slate-800 rounded-lg p-8 text-center">
              <Star className="h-12 w-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">You haven't written any reviews yet</p>
              <p className="text-gray-500 text-sm">Share your thoughts on movies you've watched</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Profile;