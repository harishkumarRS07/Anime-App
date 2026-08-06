/**
 * AniKings Backend Server
 * Express proxy with server-side caching for Jikan API.
 */

const express = require('express');
const cors = require('cors');
const animeRoutes = require('./routes/anime');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/', animeRoutes);

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', service: 'anikings-backend', timestamp: new Date().toISOString() });
});

// Start
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 AniKings Backend running on http://0.0.0.0:${PORT}`);
});
