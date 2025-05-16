// services/api.js
import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api", // Adjust to your backend
});

// Auth token setup if needed
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

// API methods
export const fetchRedditPosts = () => API.get("/reddit");
export const getCredits = () => API.get("/credits");
export const addCredits = (amount) => API.post("/credits", { amount });

export const getUsers = () => API.get("/admin/users");

export default API;
