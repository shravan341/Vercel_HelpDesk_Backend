import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const createToken = (id) => {
  console.log("Creating token for user ID:", id);
  if (!process.env.JWT_SECRET) {
    console.error("JWT_SECRET is missing!");
    throw new Error("JWT_SECRET not configured");
  }
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

export const register = async (req, res) => {
  try {
    console.log("Register attempt:", req.body);
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      console.log("Missing fields in registration");
      return res.status(400).json({ message: "Provide all fields" });
    }

    console.log("Checking if user exists:", email);
    const exists = await User.findOne({ email });
    if (exists) {
      console.log("User already exists:", email);
      return res.status(400).json({ message: "User exists" });
    }

    console.log("Hashing password...");
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    console.log("Creating user in database...");
    const user = await User.create({
      name,
      email,
      password: hashed,
      role: role || "user",
    });
    console.log("User created successfully:", user.email);

    const token = createToken(user._id);
    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Register error details:", err);
    res.status(500).json({ message: "Register failed" });
  }
};

export const login = async (req, res) => {
  try {
    console.log("=== LOGIN ATTEMPT ===");
    console.log("Request body:", req.body);

    const { email, password } = req.body;
    if (!email || !password) {
      console.log("Missing email or password");
      return res.status(400).json({ message: "Provide email and password" });
    }

    console.log("Searching for user with email:", email);
    const user = await User.findOne({ email });
    console.log("User found:", user ? user.email : "NO USER FOUND");

    if (!user) {
      console.log("User not found in database");
      return res.status(400).json({ message: "Invalid credentials" });
    }

    console.log("Comparing passwords...");
    const match = await bcrypt.compare(password, user.password);
    console.log("Password match result:", match);

    if (!match) {
      console.log("Password does not match");
      return res.status(400).json({ message: "Invalid credentials" });
    }

    console.log("Login successful, generating token...");
    const token = createToken(user._id);

    console.log("Sending success response");
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("=== LOGIN ERROR ===");
    console.error("Error name:", err.name);
    console.error("Error message:", err.message);
    console.error("Error stack:", err.stack);
    console.error("Full error object:", err);
    res.status(500).json({ message: "Login failed" });
  }
};
