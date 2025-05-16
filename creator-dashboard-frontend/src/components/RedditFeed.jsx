import React, { useEffect, useState } from 'react';
import axios from 'axios';

function RedditFeed() {
  const [posts, setPosts] = useState([]);
  const [savedPosts, setSavedPosts] = useState([]);

  useEffect(() => {
    axios.get('https://www.reddit.com/r/technology.json')
      .then(response => {
        const fetchedPosts = response.data.data.children.map(child => child.data);
        setPosts(fetchedPosts);
      })
      .catch(error => {
        console.error('Error fetching Reddit posts:', error);
      });
  }, []);

  const handleSavePost = (post) => {
    setSavedPosts([...savedPosts, post]);
    alert('Post saved!');
  };

  const handleSharePost = (post) => {
    const postLink = `https://reddit.com${post.permalink}`;
    navigator.clipboard.writeText(postLink)
      .then(() => alert('Link copied to clipboard!'))
      .catch(err => alert('Failed to copy the link.'));
  };

  return (
    <div>
      <h2>Reddit Feed</h2>
      <ul>
        {posts.map(post => (
          <li key={post.id}>
            <a href={`https://reddit.com${post.permalink}`} target="_blank" rel="noopener noreferrer">
              {post.title}
            </a>
            <div>
              <button onClick={() => handleSavePost(post)}>Save</button>
              <button onClick={() => handleSharePost(post)}>Share</button>
            </div>
          </li>
        ))}
      </ul>

      <h3>Saved Posts:</h3>
      <ul>
        {savedPosts.map((post, index) => (
          <li key={index}>{post.title}</li>
        ))}
      </ul>
    </div>
  );
}

export default RedditFeed;
