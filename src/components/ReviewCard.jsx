import React from 'react';
import { Star, User } from 'lucide-react';

const ReviewCard = ({ review }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-slate-800 rounded-lg p-6 space-y-4">
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
            <User className="h-6 w-6 text-white" />
          </div>
          <div>
            <h4 className="font-medium text-white">{review.user?.username || 'Anonymous'}</h4>
            <p className="text-sm text-gray-400">{formatDate(review.createdAt)}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`h-4 w-4 ${
                star <= review.rating
                  ? 'text-yellow-500 fill-current'
                  : 'text-gray-600'
              }`}
            />
          ))}
          <span className="ml-2 text-sm text-gray-400">({review.rating}/5)</span>
        </div>
      </div>
      
      <p className="text-gray-300 leading-relaxed">{review.reviewText}</p>
    </div>
  );
};

export default ReviewCard;