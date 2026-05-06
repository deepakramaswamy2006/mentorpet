const axios = require('axios');

// @desc    Search Jobs via Adzuna
// @route   GET /api/jobs/search?role=role&location=location
// @access  Private
exports.searchJobs = async (req, res) => {
  try {
    const { role, location, country = 'in' } = req.query;
    const appId = process.env.ADZUNA_APP_ID;
    const appKey = process.env.ADZUNA_APP_KEY;

    if (!appId || !appKey) {
      return res.status(500).json({ success: false, message: 'Adzuna API credentials not configured' });
    }

    const apiUrl = `https://api.adzuna.com/v1/api/jobs/${country}/search/1`;
    const params = {
      app_id: appId,
      app_key: appKey,
      results_per_page: 10,
      what: role,
      where: location,
      'content-type': 'application/json'
    };

    console.log('Fetching Jobs from Adzuna:', apiUrl, { ...params, app_key: '***' });

    const response = await axios.get(apiUrl, { params });

    const jobs = response.data.results.map(job => ({
      id: job.id,
      title: job.title?.replace(/<\/?[^>]+(>|$)/g, "") || 'Untitled Role', // Strip HTML
      company: job.company?.display_name || 'Unknown Company',
      location: job.location?.display_name || 'Remote / Various',
      description: job.description?.replace(/<\/?[^>]+(>|$)/g, "") || 'No description provided.',
      url: job.redirect_url,
      created: job.created,
      salary_min: job.salary_min,
      salary_max: job.salary_max
    }));

    res.status(200).json({ success: true, data: jobs });
  } catch (err) {
    const errorDetail = err.response?.data?.message || err.response?.data?.error || err.message;
    console.error('Adzuna API Error:', errorDetail);
    res.status(500).json({ success: false, message: `Failed to fetch jobs: ${errorDetail}` });
  }
};
