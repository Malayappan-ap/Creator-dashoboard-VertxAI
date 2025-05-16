// server.js
import app from './app.js';  // Import the Express app from app.js
import cors from 'cors';
app.use(cors({ origin: ' http://localhost:5173' }));

const PORT = process.env.PORT || 5000; // Default to 5000 if not provided

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
