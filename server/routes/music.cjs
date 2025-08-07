const express = require('express');
const axios = require('axios');
const authenticateToken = require('../middleware/auth.cjs');

const router = express.Router();

// Search tracks on Jamendo
router.get('/search', authenticateToken, async (req, res) => {
  try {
    const { q, limit = 10 } = req.query;
    
    if (!q) {
      return res.status(400).json({ message: 'Search query required' });
    }

    const response = await axios.get('https://api.jamendo.com/v3.0/tracks/', {
      params: {
        client_id: process.env.JAMENDO_CLIENT_ID || 'your-jamendo-client-id',
        format: 'json',
        limit,
        search: q,
        include: 'musicinfo+stats+licenses',
        groupby: 'artist_id',
      }
    });

    const tracks = response.data.results.map(track => ({
      id: track.id,
      name: track.name,
      artist: track.artist_name,
      duration: track.duration,
      audio: track.audio,
      audiodownload: track.audiodownload,
      image: track.image || track.album_image,
      album: track.album_name
    }));

    res.json({ tracks });
  } catch (error) {
    console.error('Jamendo API error:', error.response?.data || error.message);
    res.status(500).json({ message: 'Music search failed', error: error.message });
  }
});

// Get track details
router.get('/track/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const response = await axios.get('https://api.jamendo.com/v3.0/tracks/', {
      params: {
        client_id: process.env.JAMENDO_CLIENT_ID || 'your-jamendo-client-id',
        format: 'json',
        id,
        include: 'musicinfo+stats+licenses',
      }
    });

    if (!response.data.results.length) {
      return res.status(404).json({ message: 'Track not found' });
    }

    const track = response.data.results[0];
    const trackInfo = {
      id: track.id,
      name: track.name,
      artist: track.artist_name,
      duration: track.duration,
      audio: track.audio,
      audiodownload: track.audiodownload,
      image: track.image || track.album_image,
      album: track.album_name
    };

    res.json({ track: trackInfo });
  } catch (error) {
    console.error('Jamendo API error:', error.response?.data || error.message);
    res.status(500).json({ message: 'Failed to get track details', error: error.message });
  }
});

module.exports = router;