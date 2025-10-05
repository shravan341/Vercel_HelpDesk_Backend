import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS (your existing CORS code)
const allowedOrigins = [
  "https://vercel-help-desk-frontend.vercel.app",
  "http://localhost:5173",
];

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, OPTIONS, PATCH"
    );
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization, X-Requested-With"
    );
    res.setHeader("Access-Control-Allow-Credentials", "true");
  }
  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }
  next();
});

// Database connection with detailed logging
console.log("🔗 Attempting MongoDB connection...");
console.log("MONGODB_URI exists:", !!process.env.MONGODB_URI);
console.log("JWT_SECRET exists:", !!process.env.JWT_SECRET);

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ Connected to MongoDB successfully"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:");
    console.error("Error:", err.message);
    console.error("Code:", err.code);
    console.error("Name:", err.name);
  });

// Routes
app.use("/auth", authRoutes);

// Health check
app.get("/", (req, res) => {
  res.json({ message: "API is running!" });
});

// Export for Vercel
export default app;

// Local development
const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}
