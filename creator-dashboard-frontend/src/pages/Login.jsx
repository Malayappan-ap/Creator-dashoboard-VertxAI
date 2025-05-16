import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const response = await axios.post("http://localhost:5000/api/auth/login", form);
      
      // Store token and user data in localStorage
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      // Check if the user has completed their profile
      if (!response.data.user.profileCompleted) {
        // Redirect to profile page if the profile is incomplete
        navigate("/profile");
      } else {
        // Redirect to dashboard if the profile is complete
        navigate("/dashboard");
      }
    } catch (err) {
      setError(err.response?.data?.msg || "Login failed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex justify-center items-center px-4">
      <div className="w-full max-w-md bg-white/20 backdrop-blur-md p-8 rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold text-white text-center mb-6">Login to Your Account</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            name="email"
            type="email"
            placeholder="Email"
            className="w-full p-3 rounded bg-white/30 text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-white"
            onChange={handleChange}
            required
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            className="w-full p-3 rounded bg-white/30 text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-white"
            onChange={handleChange}
            required
          />
          {error && <p className="text-red-200 text-sm text-center">{error}</p>}
          <button
            type="submit"
            className="w-full py-3 bg-white text-indigo-600 font-semibold rounded hover:bg-indigo-100 transition duration-300"
          >
            Login
          </button>
        </form>
        <p className="text-white text-sm mt-4 text-center">
          Don’t have an account? <a href="/register" className="underline font-semibold">Register</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
