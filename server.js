import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js"; // Make sure these imports are correct
import ticketRoutes from "./routes/ticketRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";

dotenv.config();

const app = express();

// Add this - Express needs to parse JSON bodies
app.use(express.json());

const allowedOrigins = [
  "https://vercel-help-desk-frontend.vercel.app",
  "http://localhost:5173",
];

// CORS middleware - FIXED VERSION
app.use((req, res, next) => {
  const origin = req.headers.origin;

  // Handle preflight requests first
  if (req.method === "OPTIONS") {
    if (allowedOrigins.includes(origin)) {
      res.setHeader("Access-Control-Allow-Origin", origin);
      res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, DELETE, OPTIONS, PATCH"
      );
      res.setHeader(
        "Access-Control-Allow-Headers",
        "Content-Type, Authorization, X-Requested-With, Accept, X-CSRF-Token, X-Api-Version"
      );
      res.setHeader("Access-Control-Allow-Credentials", "true");
      res.setHeader("Access-Control-Max-Age", "86400"); // 24 hours
    }
    return res.sendStatus(204);
  }

  // Handle actual requests
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Credentials", "true");
  }

  next();
});

// Your routes
app.use("/api/auth", authRoutes);
app.use("/api/tickets", ticketRoutes);
app.use("/api/tickets", commentRoutes);

// Health check route
app.get("/", (req, res) => {
  res.json({ message: "API is running!" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
