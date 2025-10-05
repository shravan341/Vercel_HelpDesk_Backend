import express from "express";
import { register, login } from "../controllers/authController.js";

const router = express.Router();

console.log("Auth routes file loaded"); // Add this

router.post("/register", register);
router.post("/login", login);

console.log("Auth routes registered: /register, /login"); // Add this

export default router;
