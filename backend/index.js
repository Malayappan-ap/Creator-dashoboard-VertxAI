// server.js or index.js
import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.js"; // Make sure the path is correct

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
