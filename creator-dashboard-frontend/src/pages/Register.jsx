import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", email: "", password: "" });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const response = await axios.post("http://localhost:5000/api/auth/register", form);
      alert(response.data.message);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-500 flex justify-center items-center px-4">
      <div className="w-full max-w-md bg-white/20 backdrop-blur-md p-8 rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold text-white text-center mb-6">Create Your Account</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
        <input
  name="username" // ✅ FIXED from name="name"
  placeholder="Username"
  className="w-full p-3 rounded bg-white/30 text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-white"
  onChange={handleChange}
  required
/>

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
            className="w-full py-3 bg-white text-purple-700 font-semibold rounded hover:bg-purple-100 transition duration-300"
          >
            Register
          </button>
        </form>
        <p className="text-white text-sm mt-4 text-center">
          Already have an account?{" "}
          <a href="/login" className="underline font-semibold">
            Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default Register;
