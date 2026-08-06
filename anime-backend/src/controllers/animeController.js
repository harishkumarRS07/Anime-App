/**
 * Anime Controller — handles request/response logic.
 */

const jikanService = require('../services/jikanService');

async function getHomeFeed(req, res) {
    try {
        const feed = await jikanService.getHomeFeed();
        res.json(feed);
    } catch (err) {
        console.error('Home feed error:', err.message);
        res.status(502).json({ error: 'Failed to fetch home feed' });
    }
}

async function proxyJikan(req, res) {
    try {
        const endpoint = req.params[0]; // everything after /proxy/
        const data = await jikanService.fetchWithCache(`/${endpoint}`);
        res.json({ data });
    } catch (err) {
        console.error('Proxy error:', err.message);
        const status = err.response?.status || 502;
        res.status(status).json({ error: err.message });
    }
}

module.exports = {
    getHomeFeed,
    proxyJikan,
};
