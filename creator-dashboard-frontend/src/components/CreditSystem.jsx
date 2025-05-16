import { useEffect, useState } from "react";
import { getCredits, addCredits } from "../services/api"; // Make sure these API methods are correctly set up

const CreditSystem = () => {
  const [credits, setCredits] = useState(0);

  useEffect(() => {
    getCredits() // Call to get the credits of the user
      .then((res) => setCredits(res.data.credits))
      .catch(() => setCredits(100)); // Fallback in case of error
  }, []);

  const handleAddCredits = () => {
    addCredits(50) // Add 50 credits
      .then((res) => setCredits(res.data.credits)) // Update the credits state after adding
      .catch(() => alert("Failed to add credits"));
  };

  return (
    <div>
      <h2>Current Credits: {credits}</h2>
      <button onClick={handleAddCredits}>Add 50 Credits</button>
    </div>
  );
};

export default CreditSystem;
