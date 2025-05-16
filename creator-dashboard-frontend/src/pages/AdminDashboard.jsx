import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchSavedPosts = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/admin/saved-posts", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setData(res.data);
      } catch (error) {
        console.error("Failed to fetch saved posts:", error);
      }
    };

    fetchSavedPosts();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-blue-100 to-pink-100 p-8">
      <h2 className="text-4xl font-bold text-center text-gray-800 mb-12">Admin Dashboard</h2>

      {data.map((user, i) => (
        <div
          key={i}
          className="bg-white shadow-xl rounded-2xl p-6 mb-10 max-w-4xl mx-auto border border-gray-200"
        >
          <h3 className="text-2xl font-semibold text-gray-700 mb-4">
            {user.name} <span className="text-sm text-gray-500">({user.email})</span>
          </h3>
          <ul className="space-y-3">
            {user.posts.map((post, j) => (
              <li
                key={j}
                className="bg-gray-50 hover:bg-gray-100 p-3 rounded-md flex justify-between items-center transition"
              >
                <span className="font-medium text-gray-800">{post.title}</span>
                <a
                  href={post.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  View
                </a>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default AdminDashboard;
