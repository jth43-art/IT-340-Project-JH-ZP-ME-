const express = require('express');
const router = express.Router();
const axios = require('axios');
router.get('/', async (req, res) => { // GET /api/search?query=
  const { query } = req.query;
  if (!query || !query.trim()) {
    return res.status(400).json({ message: 'Search query required' });
  } try {
    const response = await axios.get('https://itunes.apple.com/search', {
      params: { term: query, media: 'music', limit: 15 }
    });

    const results = (response.data.results || []).map(item => {
      const artist = item.artistName;
      const track = item.trackName || query;
      const encoded = encodeURIComponent(`${artist} ${track}`);
      return {
        artist,
        track,
        album: item.collectionName,
        previewUrl: item.previewUrl,
        artworkUrl: item.artworkUrl100,
        externalLinks: {
          spotify: `https://open.spotify.com/search/${encoded}`,
          appleMusic: `https://music.apple.com/us/search?term=${encoded}`
        }
      };
    });

    res.json({ query, count: results.length, results });
  } catch (err) {
    console.error(err);
    res.status(502).json({ message: 'Music API error' });
  }
});
module.exports = router;
