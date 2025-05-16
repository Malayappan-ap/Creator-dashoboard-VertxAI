// routes/reddit.js
import express from "express";
import axios from "axios";
const router = express.Router();

router.get('/api/reddit', async (req, res) => {
  try {
    const subreddits = ['reactjs', 'webdev', 'reduxjs']; // Customize this list
    const promises = subreddits.map(sub =>
      axios.get(`https://www.reddit.com/r/${sub}/top.json?limit=5`)
    );

    const results = await Promise.all(promises);
    const posts = results.flatMap(response =>
      response.data.data.children.map(post => ({
        title: post.data.title,
        subreddit: post.data.subreddit,
        url: `https://reddit.com${post.data.permalink}`,
      }))
    );

    res.status(200).json(posts);
  } catch (error) {
    console.error('Error fetching Reddit posts:', error);
    res.status(500).json({ message: 'Failed to fetch Reddit posts' });
  }
});

export default router;
