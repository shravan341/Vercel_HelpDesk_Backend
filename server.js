import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import ticketRoutes from "./routes/ticketRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";

dotenv.config();
const app = express();
connectDB();

app.use(express.json());

// Sanitize origin to remove unwanted characters
function sanitizeOrigin(origin) {
  if (typeof origin !== "string") return origin;
  return origin.replace(/[\r\n]/g, "").trim();
}

// Define allowed origins
const allowedOrigins = [
  process.env.CLIENT_URL, // e.g., http://localhost:5173
  "https://vercel-help-desk-frontend.vercel.app", // Production frontend URL
];

// CORS configuration
const corsOptions = {
  origin: (incomingOrigin, callback) => {
    if (!incomingOrigin) {
      return callback(null, true); // Allow requests with no origin (e.g., mobile apps or curl requests)
    }
    const cleaned = sanitizeOrigin(incomingOrigin);
    if (allowedOrigins.includes(cleaned)) {
      return callback(null, true);
    } else {
      return callback(new Error("Not allowed by CORS"), false);
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true, // Enable cookies and authorization headers
  preflightContinue: false, // Pass the CORS preflight response to the next handler
};

// Apply CORS middleware
app.use(cors(corsOptions));

// Handle preflight OPTIONS requests
app.options("*", cors(corsOptions));

// Define routes
app.use("/api/auth", authRoutes);
app.use("/api/tickets", ticketRoutes);
app.use("/api/tickets", commentRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
