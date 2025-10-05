import express from "express";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import { createTicket, getTickets, getTicket, updateTicket, deleteTicket } from "../controllers/ticketController.js";

const router = express.Router();

router.post("/", protect, createTicket);
router.get("/", protect, getTickets);
router.get("/:id", protect, getTicket);
router.put("/:id", protect, updateTicket);
router.delete("/:id", protect, adminOnly, deleteTicket);

export default router;
