/**
 * Anime Routes
 */

const express = require('express');
const router = express.Router();
const animeController = require('../controllers/animeController');

// Batched home feed (3 sections in 1 call)
router.get('/home-feed', animeController.getHomeFeed);

// Generic Jikan proxy with server-side cache
router.get('/proxy/*', animeController.proxyJikan);

module.exports = router;
