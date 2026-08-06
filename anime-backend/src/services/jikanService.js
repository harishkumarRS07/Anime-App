/**
 * Jikan API Service with server-side caching.
 */

const axios = require('axios');
const NodeCache = require('node-cache');

const JIKAN_BASE = 'https://api.jikan.moe/v4';
const cache = new NodeCache({ stdTTL: 300, checkperiod: 60 }); // 5-min TTL

// Rate limiter: Jikan allows ~3 req/s
let lastRequest = 0;
const MIN_DELAY = 350; // ms between requests

async function rateLimitedGet(url) {
    const now = Date.now();
    const wait = Math.max(0, MIN_DELAY - (now - lastRequest));
    if (wait > 0) await new Promise((r) => setTimeout(r, wait));
    lastRequest = Date.now();
    return axios.get(url, { timeout: 15000 });
}

async function fetchWithCache(endpoint) {
    const cached = cache.get(endpoint);
    if (cached) return cached;

    const url = `${JIKAN_BASE}${endpoint}`;
    const res = await rateLimitedGet(url);
    const data = res.data?.data ?? res.data;
    cache.set(endpoint, data);
    return data;
}

// ─── Exports ──────────────────────────────────────────────────────────────────

async function getTopAiring() {
    return fetchWithCache('/top/anime?filter=airing&limit=15');
}

async function getTopPopular() {
    return fetchWithCache('/top/anime?filter=bypopularity&limit=15');
}

async function getTopUpcoming() {
    return fetchWithCache('/top/anime?filter=upcoming&limit=15');
}

async function searchAnime(query) {
    return fetchWithCache(`/anime?q=${encodeURIComponent(query)}&limit=20&sfw=true`);
}

async function getAnimeDetail(id) {
    return fetchWithCache(`/anime/${id}/full`);
}

async function getAnimeEpisodes(id) {
    return fetchWithCache(`/anime/${id}/episodes`);
}

async function getHomeFeed() {
    const [airing, popular, upcoming] = await Promise.all([
        getTopAiring(),
        getTopPopular(),
        getTopUpcoming(),
    ]);
    return { airing, popular, upcoming };
}

module.exports = {
    getTopAiring,
    getTopPopular,
    getTopUpcoming,
    searchAnime,
    getAnimeDetail,
    getAnimeEpisodes,
    getHomeFeed,
    fetchWithCache,
};
