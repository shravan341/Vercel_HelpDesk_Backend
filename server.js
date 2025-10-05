import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors"; // Add this

// ✅ FIXED IMPORTS
import authRoutes from "./routes/authRoutes.js";
import ticketRoutes from "./routes/ticketRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS - Simplified
app.use(
  cors({
    origin: [
      "https://vercel-help-desk-frontend.vercel.app",
      "http://localhost:5173",
    ],
    credentials: true,
  })
);

// MongoDB connection
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/helpdesk")
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Error:", err));



// Add this route before your other routes
app.get("/debug", (req, res) => {
  res.json({
    message: "Debug info",
    mongodbConnected: mongoose.connection.readyState === 1,
    readyState: mongoose.connection.readyState,
    hasMongoDBUri: !!process.env.MONGODB_URI,
    hasJwtSecret: !!process.env.JWT_SECRET,
    nodeEnv: process.env.NODE_ENV
  });
});

// Routes
app.use("/auth", authRoutes);
app.use("/tickets", ticketRoutes);
app.use("/comments", commentRoutes);

// Health check
app.get("/", (req, res) => {
  res.json({ message: "API is running!" });
});

export default app;
