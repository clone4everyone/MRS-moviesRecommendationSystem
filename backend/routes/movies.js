const express = require('express');
const Joi = require('joi');
const Movie = require('../models/Movie.js');
const Review = require('../models/Review.js');
const { auth, adminAuth } = require('../middleware/auth.js');

const router = express.Router();

// Get all movies with pagination and filtering
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const filter = {};
    
    if (req.query.genre) {
      filter['genres.id'] = parseInt(req.query.genre);
    }
    
    if (req.query.year) {
      const year = parseInt(req.query.year);
      filter.releaseDate = {
        $gte: new Date(year, 0, 1),
        $lt: new Date(year + 1, 0, 1)
      };
    }
    
    if (req.query.rating) {
      filter.averageRating = { $gte: parseFloat(req.query.rating) };
    }

    const movies = await Movie.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Movie.countDocuments(filter);

    res.json({
      movies,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalResults: total,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Get movies error:', error);
    res.status(500).json({ message: 'Failed to fetch movies' });
  }
});

// Get specific movie
router.get('/:id', async (req, res) => {
  try {
    const tmdbId = parseInt(req.params.id);
    let movie = await Movie.findOne({ tmdbId });
    
    if (!movie) {
      // Create movie entry if it doesn't exist
      movie = new Movie({
        tmdbId,
        title: 'Loading...',
        averageRating: 0,
        reviewCount: 0
      });
      await movie.save();
    }

    const reviews = await Review.find({ tmdbId })
      .populate('user', 'username')
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({
      movie,
      reviews,
      reviewCount: reviews.length
    });
  } catch (error) {
    console.error('Get movie error:', error);
    res.status(500).json({ message: 'Failed to fetch movie' });
  }
});

// Add new movie (admin only)
router.post('/', adminAuth, async (req, res) => {
  try {
    const movieSchema = Joi.object({
      tmdbId: Joi.number().required(),
      title: Joi.string().required(),
      overview: Joi.string(),
      releaseDate: Joi.date(),
      posterPath: Joi.string(),
      backdropPath: Joi.string(),
      genres: Joi.array().items(Joi.object({
        id: Joi.number(),
        name: Joi.string()
      })),
      runtime: Joi.number(),
      voteAverage: Joi.number(),
      voteCount: Joi.number()
    });

    const { error } = movieSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const movie = new Movie(req.body);
    await movie.save();

    res.status(201).json(movie);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Movie already exists' });
    }
    console.error('Create movie error:', error);
    res.status(500).json({ message: 'Failed to create movie' });
  }
});

// Get movie reviews
router.get('/:id/reviews', async (req, res) => {
  try {
    const tmdbId = parseInt(req.params.id);
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const reviews = await Review.find({ tmdbId })
      .populate('user', 'username profilePicture')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Review.countDocuments({ tmdbId });

    res.json({
      reviews,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalResults: total
      }
    });
  } catch (error) {
    console.error('Get movie reviews error:', error);
    res.status(500).json({ message: 'Failed to fetch reviews' });
  }
});

// Submit movie review
router.post('/:id/reviews', auth, async (req, res) => {
  try {
    const reviewSchema = Joi.object({
      rating: Joi.number().min(1).max(5).required(),
      reviewText: Joi.string().max(2000).required()
    });

    const { error } = reviewSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const tmdbId = parseInt(req.params.id);
    const { rating, reviewText } = req.body;

    // Check if user already reviewed this movie
    const existingReview = await Review.findOne({
      user: req.user._id,
      tmdbId
    });

    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this movie' });
    }

    // Find or create movie
    let movie = await Movie.findOne({ tmdbId });
    if (!movie) {
      movie = new Movie({
        tmdbId,
        title: 'Unknown Movie'
      });
      await movie.save();
    }

    // Create review
    const review = new Review({
      user: req.user._id,
      movie: movie._id,
      tmdbId,
      rating,
      reviewText
    });

    await review.save();
    await review.populate('user', 'username profilePicture');

    // Update movie average rating
    await movie.updateAverageRating();

    res.status(201).json(review);
  } catch (error) {
    console.error('Submit review error:', error);
    res.status(500).json({ message: 'Failed to submit review' });
  }
});

module.exports = router;