const express = require('express');
const Joi = require('joi');
const Watchlist = require('../models/Watchlist.js');
const { auth } = require('../middleware/auth.js');

const router = express.Router();

// Get user's watchlist
router.get('/', auth, async (req, res) => {
  try {
    const watchlist = await Watchlist.find({ user: req.user._id })
      .sort({ createdAt: -1 });

    res.json(watchlist);
  } catch (error) {
    console.error('Get watchlist error:', error);
    res.status(500).json({ message: 'Failed to fetch watchlist' });
  }
});

// Add movie to watchlist
router.post('/', auth, async (req, res) => {
  try {
    const watchlistSchema = Joi.object({
      tmdbId: Joi.number().required(),
      title: Joi.string().required(),
      posterPath: Joi.string(),
      releaseDate: Joi.date(),
      overview: Joi.string(),
      voteAverage: Joi.number()
    });

    const { error } = watchlistSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const watchlistItem = new Watchlist({
      user: req.user._id,
      ...req.body
    });

    await watchlistItem.save();

    res.status(201).json(watchlistItem);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Movie already in watchlist' });
    }
    console.error('Add to watchlist error:', error);
    res.status(500).json({ message: 'Failed to add to watchlist' });
  }
});

// Remove movie from watchlist
router.delete('/:tmdbId', auth, async (req, res) => {
  try {
    const tmdbId = parseInt(req.params.tmdbId);
    
    const result = await Watchlist.findOneAndDelete({
      user: req.user._id,
      tmdbId
    });

    if (!result) {
      return res.status(404).json({ message: 'Movie not found in watchlist' });
    }

    res.json({ message: 'Movie removed from watchlist' });
  } catch (error) {
    console.error('Remove from watchlist error:', error);
    res.status(500).json({ message: 'Failed to remove from watchlist' });
  }
});

module.exports = router;