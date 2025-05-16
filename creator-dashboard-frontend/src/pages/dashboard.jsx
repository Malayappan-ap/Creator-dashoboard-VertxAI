import React, { useState, useEffect } from "react";
import FeedAggregator from '../components/FeedAggregator';
import axios from "axios";
import './Dashboard.css';

const Dashboard = () => {
  const [tab, setTab] = useState("user");

  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("user")));
  const [dashboardData, setDashboardData] = useState({
    credits: 0,
    activityLog: [],
    savedFeeds: []
  });

  const [creators, setCreators] = useState([]);
  const [feeds, setFeeds] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch dashboard data (credits, activity log, saved feeds)
  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('/api/user/dashboard', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          const text = await response.text();
          console.error("Expected JSON, got HTML:", text);
          return;
        }

        const data = await response.json();
        setDashboardData(data);

        // Optional: update credits in localStorage user
        if (user) {
          const updatedUser = { ...user, credits: data.credits };
          setUser(updatedUser);
          localStorage.setItem("user", JSON.stringify(updatedUser));
        }
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
      }
    }

    fetchDashboardData();
  }, []);

  // Fetch saved feeds
  useEffect(() => {
    const fetchFeeds = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/post/saved-posts', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setFeeds(res.data);
      } catch (error) {
        console.error("Error fetching saved feeds:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeeds();
  }, []);

  // Fetch creators (admin view)
  useEffect(() => {
    const fetchCreators = async () => {
      try {
        const res = await axios.get('/api/creators');
        setCreators(res.data);
      } catch (err) {
        console.error("Error fetching creators data:", err);
      }
    };

    fetchCreators();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-400 via-purple-500 to-pink-600 p-6 font-sans">
      <h1 className="text-4xl font-bold text-white text-center mb-8">👑 VertxAI Creator Dashboard</h1>

      <div className="flex justify-center gap-6 mb-8">
        <button onClick={() => setTab("user")} className={`px-6 py-3 rounded-full transition-all duration-300 ${tab === "user" ? "bg-blue-600 text-white shadow-xl" : "bg-gray-200 text-gray-800 hover:bg-blue-500"}`}>👤 User Dashboard</button>
        {/* <button onClick={() => setTab("admin")} className={`px-6 py-3 rounded-full transition-all duration-300 ${tab === "admin" ? "bg-green-600 text-white shadow-xl" : "bg-gray-200 text-gray-800 hover:bg-green-500"}`}>🛠 Admin Dashboard</button> */}
        <button onClick={() => setTab("feed")} className={`px-6 py-3 rounded-full transition-all duration-300 ${tab === "feed" ? "bg-purple-600 text-white shadow-xl" : "bg-gray-200 text-gray-800 hover:bg-purple-500"}`}>🧠 Feed Aggregator</button>
        <button onClick={() => setTab("credits")} className={`px-6 py-3 rounded-full transition-all duration-300 ${tab === "credits" ? "bg-yellow-600 text-white shadow-xl" : "bg-gray-200 text-gray-800 hover:bg-yellow-500"}`}>
          💰 Credit System
          <p>Credits: {dashboardData.credits}</p>
        </button>
      </div>

      {/* 👥 User Dashboard */}
      {tab === "user" && (
        <div className="bg-white rounded-3xl shadow-xl p-8 max-w-4xl mx-auto">
          <h2 className="text-3xl font-semibold mb-6">Welcome, Creator!</h2>
          <p className="text-xl mb-4">🎯 Credits: <strong>{dashboardData.credits}</strong></p>
          <p className="text-xl mb-4">🔗 Linked Accounts: Reddit ✅</p>
          {loading ? <p className="text-lg text-gray-500">Loading saved feeds...</p> : <FeedAggregator mode="saved" />}
        </div>
      )}

      {/* 📊 Admin Dashboard */}
      {tab === "admin" && (
        <div className="bg-white rounded-3xl shadow-xl p-8 max-w-4xl mx-auto">
          <h2 className="text-3xl font-semibold mb-6">Admin Panel</h2>
          <ul className="space-y-4">
            {creators.map((creator, i) => (
              <li key={i} className="border p-6 rounded-xl shadow-md transition-transform transform hover:scale-105">
                <div className="flex justify-between items-center">
                  {/* Display Creator's Avatar */}
                  <div className="flex items-center">
                    <img src={creator.avatar || '/default-avatar.png'} alt="Avatar" className="w-10 h-10 rounded-full mr-4" />
                    <span className="text-xl font-semibold">{creator.name}</span>
                  </div>
                  <span className="text-lg">Credits: {creator.credits}</span>
                </div>
                <p className="text-sm text-gray-500 mt-2">Saved Posts: {creator.savedFeeds.length}</p>
                {/* Display Creator's Bio */}
                <p className="text-sm text-gray-500 mt-2">{creator.bio ? creator.bio : 'No bio available'}</p>
                <p className="text-sm text-gray-500 mt-2">
                  Last Login: {creator.lastLogin ? new Date(creator.lastLogin).toLocaleDateString() : 'Never'}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 🧠 Feed Aggregator */}
      {tab === "feed" && (
        <div className="bg-white rounded-3xl shadow-xl p-8 max-w-4xl mx-auto">
          <h2 className="text-3xl font-semibold mb-6">Reddit Feed</h2>
          {loading ? <p className="text-lg text-gray-500">Loading feeds...</p> : <FeedAggregator feeds={feeds} />}
        </div>
      )}

      {/* 💰 Credit System */}
      {tab === "credits" && (
        <div className="bg-white rounded-3xl shadow-xl p-8 max-w-4xl mx-auto">
          <h2 className="text-3xl font-semibold mb-6">Your Credits</h2>
          <p className="text-xl mb-4">💳 Available: <strong>{dashboardData.credits}</strong> credits</p>

          <h3 className="mt-4 font-bold">Recent Activity:</h3>
          <ul className="list-disc ml-6 text-sm text-gray-600">
            {dashboardData.activityLog?.slice(-5).reverse().map((log, idx) => (
              <li key={idx}>{log}</li>
            ))}
          </ul>

          <h3 className="mt-4 font-bold">Saved Posts:</h3>
          <ul className="list-disc ml-6 text-sm text-gray-600">
            {dashboardData.savedFeeds?.slice(-3).map((post, idx) => (
              <li key={idx}>
                <a href={post.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                  {post.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
