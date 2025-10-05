import Comment from "../models/Comment.js";
import Ticket from "../models/Ticket.js";

export const addComment = async (req, res) => {
  try {
    const ticketId = req.params.ticketId;
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) return res.status(404).json({ message: "Ticket not found" });

    // If not admin, only allow comment on own ticket
    if (req.user.role !== "admin" && !ticket.createdBy.equals(req.user._id)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const { text } = req.body;
    const comment = await Comment.create({ text, ticket: ticketId, user: req.user._id });
    const populated = await comment.populate("user", "name email");
    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ message: "Add comment failed" });
  }
};

export const getComments = async (req, res) => {
  try {
    const ticketId = req.params.ticketId;
    const comments = await Comment.find({ ticket: ticketId }).populate("user", "name email").sort({ createdAt: 1 });
    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: "Fetch comments failed" });
  }
};
