// controllers/redditController.js
import axios from "axios";

export const getRedditPosts = async (req, res) => {
  const { type = "top", comments = false } = req.query; // Default to 'top' posts
  const redditUrl = `https://www.reddit.com/r/all/${type}.json`;

  try {
    const response = await axios.get(redditUrl);
    let posts = response.data.data.children.map(post => ({
      title: post.data.title,
      url: `https://reddit.com${post.data.permalink}`,
      score: post.data.score,
    }));

    if (comments) {
      posts = posts.filter(post => post.score > 100); // Example: filter by posts with more than 100 score
    }

    res.json(posts);
  } catch (err) {
    res.status(500).json({ msg: "Failed to fetch Reddit posts", error: err.message });
  }
};
