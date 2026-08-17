const express = require('express');
const axios = require('axios');
const Song = require('../models/Song');

const router = express.Router();

// Escape special regex characters from user input
const escapeRegex = (value) => {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

// ==========================================
// SEARCH
// GET /search?query=
// ==========================================

router.get('/', async (req, res) => {
  const { query } = req.query;

  // Validate search input
  if (
    typeof query !== 'string' ||
    !query.trim()
  ) {
    return res.status(400).json({
      message: 'Search query required'
    });
  }

  const cleanQuery = query.trim();
  const safeQuery = escapeRegex(cleanQuery);

  try {

    // ========================================
    // 1. SEARCH LOCAL / UPLOADED SONGS
    // ========================================

    const localSongsPromise = Song.find({
      $or: [
        {
          title: {
            $regex: safeQuery,
            $options: 'i'
          }
        },
        {
          artist: {
            $regex: safeQuery,
            $options: 'i'
          }
        },
        {
          album: {
            $regex: safeQuery,
            $options: 'i'
          }
        }
      ]
    })
      .sort({ createdAt: -1 })
      .limit(15)
      .lean();


    // ========================================
    // 2. SEARCH ITUNES
    // ========================================

    const iTunesPromise = axios.get(
      'https://itunes.apple.com/search',
      {
        params: {
          term: cleanQuery,
          media: 'music',
          limit: 15
        }
      }
    );


    // Run both searches at the same time
    const [
      localResult,
      iTunesResult
    ] = await Promise.allSettled([
      localSongsPromise,
      iTunesPromise
    ]);


    // ========================================
    // FORMAT LOCAL SONGS
    // ========================================

    let localResults = [];

    if (localResult.status === 'fulfilled') {

      localResults = localResult.value.map(song => ({
        source: 'upload',

        songId: song._id,

        artist: song.artist || '',
        track: song.title,
        album: song.album || '',
        genre: song.genre || '',

        duration: song.duration || null,

        filePath: song.filePath || null,
        fileSize: song.fileSize || null,
        mimeType: song.mimeType || 'audio/mpeg',

        artworkUrl:
          song.albumArtworkPath || null,

        externalLinks: {
          spotify:
            song.externalLinks?.spotify || null,

          appleMusic:
            song.externalLinks?.appleMusic || null
        },

        uploadedAt: song.createdAt
      }));

    } else {

      console.error(
        'Local song search error:',
        localResult.reason
      );
    }


    // ========================================
    // FORMAT ITUNES RESULTS
    // ========================================

    let externalResults = [];

    if (iTunesResult.status === 'fulfilled') {

      const apiResults =
        iTunesResult.value.data.results || [];

      externalResults = apiResults.map(item => {

        const artist =
          item.artistName || '';

        const track =
          item.trackName || cleanQuery;

        const encoded =
          encodeURIComponent(
            `${artist} ${track}`
          );

        return {
          source: 'api',

          artist,
          track,

          album:
            item.collectionName || '',

          genre:
            item.primaryGenreName || '',

          previewUrl:
            item.previewUrl || null,

          artworkUrl:
            item.artworkUrl100 || null,

          externalLinks: {

            spotify:
              `https://open.spotify.com/search/${encoded}`,

            appleMusic:
              `https://music.apple.com/us/search?term=${encoded}`
          }
        };
      });

    } else {

      console.error(
        'iTunes search error:',
        iTunesResult.reason
      );
    }


    // ========================================
    // RETURN COMBINED RESULTS
    // ========================================

    return res.status(200).json({

      query: cleanQuery,

      count:
        localResults.length +
        externalResults.length,

      localCount:
        localResults.length,

      externalCount:
        externalResults.length,

      results: [
        ...localResults,
        ...externalResults
      ]

    });

  } catch (err) {

    console.error(
      'Search error:',
      err
    );

    return res.status(500).json({
      message: 'Search error'
    });
  }
});

module.exports = router;
