import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "../src/components/Navbar";
import Home from "../src/pages/Home";
import FeedAggregator from "../src/components/FeedAggregator";
import Login from "../src/pages/Login";
import Register from "../src/pages/Register";
import Dashboard from './pages/dashboard';

import ProfilePage from "../src/pages/ProfilePage";
import AdminLogin from "../src/pages/AdminLogin";
//import AdminRegister from "../src/pages/AdminRegister";
import AdminDashboard from "../src/pages/AdminDashboard";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        {/* User routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/feed" element={<FeedAggregator mode="feed" />} />
        <Route path="/saved-posts" element={<FeedAggregator mode="saved" />} />
        <Route path="/" element={<Home />} />
<Route path="/admin/login" element={<AdminLogin />} />
<Route path="/admin/dashboard" element={<AdminDashboard />} />

      </Routes>
    </Router>
  );
}

export default App;
