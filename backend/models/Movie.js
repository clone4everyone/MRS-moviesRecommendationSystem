const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  tmdbId: {
    type: Number,
    required: true,
    unique: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  overview: String,
  releaseDate: Date,
  posterPath: String,
  backdropPath: String,
  genres: [{
    id: Number,
    name: String
  }],
  runtime: Number,
  voteAverage: Number,
  voteCount: Number,
  averageRating: {
    type: Number,
    default: 0
  },
  reviewCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Calculate average rating when reviews change
movieSchema.methods.updateAverageRating = async function() {
  const Review = mongoose.model('Review');
  const reviews = await Review.find({ movie: this._id });
  
  if (reviews.length === 0) {
    this.averageRating = 0;
    this.reviewCount = 0;
  } else {
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    this.averageRating = Number((sum / reviews.length).toFixed(1));
    this.reviewCount = reviews.length;
  }
  
  await this.save();
};

module.exports = mongoose.model('Movie', movieSchema);