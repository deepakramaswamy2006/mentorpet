const axios = require('axios');

// @desc    Search YouTube Videos
// @route   GET /api/videos/search?q=skill
// @access  Private
exports.searchVideos = async (req, res) => {
  try {
    const { q } = req.query;
    const apiKey = process.env.YOUTUBE_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ success: false, message: 'YouTube API Key not configured' });
    }

    const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
      params: {
        part: 'snippet',
        maxResults: 4,
        q: `${q} tutorial for beginners`,
        type: 'video',
        key: apiKey
      }
    });

    const videos = response.data.items.map(item => ({
      id: item.id.videoId,
      title: item.snippet.title,
      thumbnail: item.snippet.thumbnails.high.url,
      channel: item.snippet.channelTitle,
      description: item.snippet.description
    }));

    res.status(200).json({ success: true, data: videos });
  } catch (err) {
    console.error('YouTube API Error:', err.response?.data || err.message);
    res.status(500).json({ success: false, message: 'Failed to fetch videos' });
  }
};
