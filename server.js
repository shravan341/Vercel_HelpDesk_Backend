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

function sanitizeOrigin(origin) {
  if (typeof origin !== "string") return origin;
  // remove CR, LF, extra spaces
  return origin.replace(/[\r\n]/g, "").trim();
}

const allowedOrigins = [process.env.CLIENT_URL];

app.use((req, res, next) => {
  console.log("Req Origin:", JSON.stringify(req.headers.origin));
  next();
});

app.use(
  cors({
    origin: (incomingOrigin, callback) => {
      // If no origin (maybe in some server-to-server calls), allow or reject as per your policy
      if (!incomingOrigin) {
        return callback(null, false); // or true if you want to allow
      }
      const cleaned = sanitizeOrigin(incomingOrigin);
      console.log("Cleaned origin:", JSON.stringify(cleaned));
      if (allowedOrigins.includes(cleaned)) {
        return callback(null, cleaned);
      } else {
        // you can reject or allow fallback
        return callback(new Error("Not allowed by CORS"), false);
      }
    },
    credentials: true,
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/tickets", ticketRoutes);
app.use("/api/tickets", commentRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
