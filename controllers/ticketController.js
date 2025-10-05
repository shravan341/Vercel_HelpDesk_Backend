import Ticket from "../models/Ticket.js";
import Comment from "../models/Comment.js";

// Create ticket
export const createTicket = async (req, res) => {
  try {
    const { title, description, slaDeadline } = req.body;
    const ticket = await Ticket.create({ title, description, slaDeadline, createdBy: req.user._id });
    res.status(201).json(ticket);
  } catch (err) {
    res.status(500).json({ message: "Create ticket failed" });
  }
};

// Get tickets (admin gets all, user gets own)
export const getTickets = async (req, res) => {
  try {
    const filter = req.user.role === "admin" ? {} : { createdBy: req.user._id };
    const tickets = await Ticket.find(filter).populate("createdBy", "name email").sort({ createdAt: -1 });
    res.json(tickets);
  } catch (err) {
    res.status(500).json({ message: "Fetch failed" });
  }
};

// Get single
export const getTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id).populate("createdBy", "name email");
    if (!ticket) return res.status(404).json({ message: "Not found" });
    // user access: admin or owner
    if (req.user.role !== "admin" && !ticket.createdBy._id.equals(req.user._id)) {
      return res.status(403).json({ message: "Forbidden" });
    }
    const comments = await Comment.find({ ticket: ticket._id }).populate("user", "name email").sort({ createdAt: 1 });
    res.json({ ticket, comments });
  } catch (err) {
    res.status(500).json({ message: "Fetch failed" });
  }
};

// Update ticket (status, assignedTo, slaDeadline, description)
export const updateTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ message: "Not found" });
    // admin or owner can update (admin has more rights)
    if (req.user.role !== "admin" && !ticket.createdBy.equals(req.user._id)) {
      return res.status(403).json({ message: "Forbidden" });
    }
    Object.assign(ticket, req.body);
    await ticket.save();
    res.json(ticket);
  } catch (err) {
    res.status(500).json({ message: "Update failed" });
  }
};

// Delete ticket (admin only)
export const deleteTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findByIdAndDelete(req.params.id);
    if (!ticket) return res.status(404).json({ message: "Not found" });
    // also delete comments
    await Comment.deleteMany({ ticket: ticket._id });
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed" });
  }
};
