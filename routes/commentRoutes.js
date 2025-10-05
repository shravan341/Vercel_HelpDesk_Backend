import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { addComment, getComments } from "../controllers/commentController.js";

const router = express.Router({ mergeParams: true });

// /api/tickets/:ticketId/comments
router.post("/:ticketId/comments", protect, addComment);
router.get("/:ticketId/comments", protect, getComments);

export default router;
