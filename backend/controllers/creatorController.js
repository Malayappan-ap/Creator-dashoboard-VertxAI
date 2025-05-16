import User from '../models/User.js';

// Get all users (creators)
export const getCreators = async (req, res) => {
    try {
      if (!req.user.isAdmin) {
        return res.status(403).json({ message: "Access denied. Admins only." });
      }
  
      const creators = await User.find().select('-password');
      res.status(200).json(creators);
    } catch (error) {
      console.error("Error fetching creators:", error);
      res.status(500).json({ message: "Server error" });
    }
  };
  