import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProfilePage = () => {
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    bio: '',
  });
  const [credits, setCredits] = useState(0);
  const [profileCompleted, setProfileCompleted] = useState(false);
  const user = JSON.parse(localStorage.getItem('user'));
const userId = user?._id;


  // Fetch user profile data on page load
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/user/profile', { params: { userId } });
        setUserData(response.data);
        setCredits(response.data.credits);
        setProfileCompleted(response.data.profileCompleted);
      } catch (err) {
        alert('Error fetching profile data');
      }
    };

    fetchUserData();
  }, []);

  // Handle profile update and credit awarding
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/user/updateProfile', { userId, ...userData });
      setCredits(response.data.credits);  // Update credits after profile update
      setProfileCompleted(response.data.profileCompleted); // Update profile completion status
      alert('Profile updated successfully!');
    } catch (err) {
      alert('Error updating profile');
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-md shadow-lg">
      <h2 className="text-2xl font-bold text-center mb-4">Your Profile</h2>

      {/* Profile Update Form */}
      <form onSubmit={handleProfileUpdate} className="space-y-4">
        <div>
          <input
            type="text"
            name="name"
            value={userData.name}
            onChange={(e) => setUserData({ ...userData, name: e.target.value })}
            placeholder="Enter your name"
            required
            className="w-full p-3 border rounded-md"
          />
        </div>
        
        <div>
          <input
            type="email"
            name="email"
            value={userData.email}
            onChange={(e) => setUserData({ ...userData, email: e.target.value })}
            placeholder="Enter your email"
            required
            className="w-full p-3 border rounded-md"
          />
        </div>
        
        <div>
          <textarea
            name="bio"
            value={userData.bio}
            onChange={(e) => setUserData({ ...userData, bio: e.target.value })}
            placeholder="Write a short bio"
            required
            className="w-full p-3 border rounded-md"
          />
        </div>
        
        <div>
          <button
            type="submit"
            className="w-full p-3 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Save Profile
          </button>
        </div>
      </form>

      {/* Profile Completion and Credits Display */}
      <div className="mt-6 text-center">
        <p className="text-lg font-semibold">Credits: {credits}</p>
        {!profileCompleted ? (
          <p className="text-sm text-gray-500 mt-2">Complete your profile to earn credits!</p>
        ) : (
          <p className="text-sm text-green-500 mt-2">Your profile is complete! You've earned {credits} credits.</p>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
