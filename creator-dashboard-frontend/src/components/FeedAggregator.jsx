import React, { useEffect, useState } from "react";
import axios from "axios";
import './FeedAggregrator.css';

// Decode JWT
const decodeJWT = (token) => {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  return JSON.parse(atob(base64));
};

const FeedAggregator = ({ mode = "feed" }) => {
  const [redditPosts, setRedditPosts] = useState([]);
  const [devtoPosts, setDevtoPosts] = useState([]);
  const [savedPosts, setSavedPosts] = useState([]);
  const [subreddit, setSubreddit] = useState("reactjs");
  const [shareModalVisible, setShareModalVisible] = useState(false);
  const [selectedPostUrl, setSelectedPostUrl] = useState("");

  const token = localStorage.getItem("token");

  const fetchRedditPosts = async () => {
    if (!subreddit || subreddit.trim().length < 2) {
      alert("Please enter a valid subreddit name.");
      return;
    }
    try {
      const res = await fetch(`https://www.reddit.com/r/${subreddit}/top.json?limit=5`);
      if (!res.ok) throw new Error(`Subreddit not found: r/${subreddit}`);
      const data = await res.json();

      const posts = data.data.children.map((post) => ({
        id: post.data.id,
        title: post.data.title,
        url: "https://reddit.com" + post.data.permalink,
        source: "Reddit",
        subreddit: post.data.subreddit,
      }));

      setRedditPosts(posts);
    } catch (err) {
      console.error("Error fetching Reddit posts:", err);
      alert(`🚫 Could not fetch posts from r/${subreddit}.`);
    }
  };

  const fetchDevtoPosts = async () => {
    try {
      const res = await fetch("https://dev.to/api/articles?tag=webdev&per_page=5");
      const data = await res.json();

      const posts = data.map((article) => ({
        id: article.id,
        title: article.title,
        url: article.url,
        source: "Dev.to",
        author: article.user.name,
      }));

      setDevtoPosts(posts);
    } catch (err) {
      console.error("Error fetching Dev.to posts:", err);
    }
  };

  const fetchSavedPosts = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/post/saved-posts", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSavedPosts(res.data);
    } catch (err) {
      console.error("Error fetching saved posts:", err);
    }
  };

  useEffect(() => {
    fetchSavedPosts();
    if (mode === "feed") {
      fetchRedditPosts();
      fetchDevtoPosts();
    }
  }, [subreddit, mode]);

  const handleSubredditChange = (e) => setSubreddit(e.target.value);

  const savePost = async (post) => {
    if (!token) return alert("Please login to save posts.");
    const { username } = decodeJWT(token);
    try {
      await axios.post("http://localhost:5000/api/post/save-feed", {
        title: post.title,
        link: post.url,
        savedBy: username,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("✅ Post saved!");
      fetchSavedPosts();
    } catch (error) {
      console.error("Error saving feed:", error.message);
    }
  };

  const handleShare = (url) => {
    setSelectedPostUrl(url);
    setShareModalVisible(true); // Show modal
  };

  const handleReport = (title) => {
    alert(`⚠️ Reported post: ${title}`);
  };

  const closeShareModal = () => {
    setShareModalVisible(false); // Close modal
  };

  const allPosts = [...redditPosts, ...devtoPosts];

  return (
    <div className="feed-container bg-gray-50 min-h-screen p-6">
      {mode === "feed" && (
        <div className="flex justify-between items-center mb-4">
          <input
            type="text"
            value={subreddit}
            onChange={handleSubredditChange}
            placeholder="Enter Subreddit"
            className="border border-gray-300 p-2 rounded w-1/2"
          />
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            onClick={fetchRedditPosts}
          >
            Fetch Posts
          </button>
        </div>
      )}

      {mode === "feed" && (
        <div className="feed-posts space-y-6">
          {allPosts.map((post, index) => (
            <div key={index} className="feed-post-item p-4 bg-white rounded-lg shadow-md relative">
              <a href={post.url} target="_blank" rel="noopener noreferrer" className="text-lg font-semibold hover:underline">
                {post.title}
              </a>
              <p className="text-sm text-gray-500 mt-1">
                Source: {post.source} {post.subreddit && `(r/${post.subreddit})`} {post.author && `by ${post.author}`}
              </p>
              <div className="post-actions mt-2 flex space-x-3">
                <button
                  className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                  onClick={() => savePost(post)}
                >
                  💾 Save
                </button>

                <button
                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                  onClick={() => handleShare(post.url)}
                >
                  📋 Share
                </button>

                <button
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  onClick={() => handleReport(post.title)}
                >
                  🚩 Report
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {token && mode === "saved" && (
        <div className="saved-posts-container mt-8">
          <h2 className="text-xl font-semibold mb-4">🔖 Saved Posts</h2>
          {savedPosts.length === 0 ? (
            <p className="text-gray-500">No saved posts yet.</p>
          ) : (
            <ul className="space-y-3">
              {savedPosts.map((post, index) => (
                <li key={index} className="p-3 bg-white shadow rounded">
                  <a href={post.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    {post.title}
                  </a>
                  <p className="text-sm text-gray-500">Saved by you. Click to view more.</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Share Modal */}
      {shareModalVisible && (
  <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
    <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 space-y-4 relative animate-fadeIn">
      <h2 className="text-xl font-bold text-center">📤 Share this post</h2>

      <div className="flex flex-col space-y-3">
        <a
          href={`https://api.whatsapp.com/send?text=${encodeURIComponent(selectedPostUrl)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
        >
          Share on WhatsApp
        </a>
        <a
          href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(selectedPostUrl)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full bg-blue-400 text-white px-4 py-2 rounded hover:bg-blue-500 transition"
        >
          Share on Twitter
        </a>
        <a
          href={`https://www.linkedin.com/shareArticle?url=${encodeURIComponent(selectedPostUrl)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800 transition"
        >
          Share on LinkedIn
        </a>
        <button
          onClick={() => {
            navigator.clipboard.writeText(selectedPostUrl);
            alert("📋 Link copied!");
            closeShareModal();
          }}
          className="w-full bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 transition"
        >
          Copy Link
        </button>
      </div>

      <button
        onClick={closeShareModal}
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl"
      >
        &times;
      </button>
    </div>
  </div>
)}
    </div>
  );
};

export default FeedAggregator;
