// controllers/creditController.js
import User from '../models/User.js';

// Get Credits
export const getCredits = async (req, res) => {
  try {
    const user = await User.findById(req.user._id); // Use req.user to get the authenticated user
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ credits: user.credits });
  } catch (error) {
    console.error('Failed to fetch credits:', error);
    res.status(500).json({ message: 'Failed to fetch credits', error });
  }
};

// Add Credits
export const updateCredits = async (req, res) => {
  const { amount } = req.body; // Get the amount from the request body
  if (!amount || amount <= 0) {
    return res.status(400).json({ message: 'Invalid amount' });
  }

  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    user.credits += amount; // Update the credits
    await user.save(); // Save the updated user
    res.json({ credits: user.credits }); // Return the updated credits
  } catch (error) {
    console.error('Failed to update credits:', error);
    res.status(500).json({ message: 'Failed to update credits', error });
  }
};
