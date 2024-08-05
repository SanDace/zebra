const Comment = require("../models/comment");
const User = require("../models/user");
const Product = require("../models/product");

const createComment = async (req, res) => {
  const { text, user_id, product_id } = req.body;

  try {
    // Check if user exists
    const user = await User.findById(user_id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if product exists
    const product = await Product.findById(product_id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // If both user and product exist, create the comment
    const comment = new Comment({ text, user_id, product_id });
    await comment.save();
    res.status(201).json(comment);
  } catch (error) {
    console.error("Error creating comment:", error);
    res.status(500).json({ message: "Error creating comment" });
  }
};

const updateComment = async (req, res) => {
  const { id } = req.params;
  const { text } = req.body;

  try {
    const comment = await Comment.findByIdAndUpdate(
      id,
      { text },
      { new: true }
    );
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }
    res.json(comment);
  } catch (error) {
    console.error("Error updating comment:", error);
    res.status(500).json({ message: "Error updating comment" });
  }
};

// Assuming you have imported necessary modules and Comment model

const deleteComment = async (req, res) => {
  const { id } = req.params;
  const { user_id } = req.body;

  try {
    const comment = await Comment.findOneAndDelete({ _id: id, user_id });
    if (!comment) {
      return res
        .status(404)
        .json({ message: "Comment not found or unauthorized" });
    }
    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    console.error("Error deleting comment:", error);
    res.status(500).json({ message: "Error deleting comment" });
  }
};

const deleteReply = async (req, res) => {
  const { id } = req.params;
  const { user_id } = req.body;

  try {
    // Log incoming request for debugging
    console.log("Deleting reply with ID:", id, "by user:", user_id);

    // Attempt to find and update the comment
    const comment = await Comment.findOneAndUpdate(
      { "replies._id": id, "replies.user_id": user_id },
      { $pull: { replies: { _id: id } } },
      { new: true }
    );

    // Check if comment was found
    if (!comment) {
      return res.status(404).json({ message: "Comment or reply not found" });
    }

    // Verify that the reply was removed
    const replyRemoved = !comment.replies.find(
      (reply) => reply._id.toString() === id
    );
    if (replyRemoved) {
      return res.status(200).json({ message: "Reply deleted successfully" });
    } else {
      return res
        .status(404)
        .json({ message: "Reply not found or unauthorized" });
    }
  } catch (error) {
    console.error("Error deleting reply:", error);
    res.status(500).json({ message: "Error deleting reply" });
  }
};

const getCommentsWithReplies = async (req, res) => {
  const { product_id } = req.params;

  try {
    const comments = await Comment.find({ product_id })
      .populate("user_id", "name email photo")
      .populate({
        path: "replies",
        populate: { path: "user_id", select: "name email photo" },
      });

    res.json(comments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).json({ message: "Error fetching comments" });
  }
};

const addReply = async (req, res) => {
  const { parentCommentId } = req.params;
  const { text, user_id } = req.body;

  try {
    const comment = await Comment.findById(parentCommentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    const reply = {
      text,
      user_id,
      createdAt: new Date(),
    };

    comment.replies.push(reply);
    await comment.save();

    res.status(201).json(reply);
  } catch (error) {
    console.error("Error adding reply:", error);
    res.status(500).json({ message: "Error adding reply" });
  }
};

module.exports = {
  createComment,
  updateComment,
  deleteComment,
  addReply,
  getCommentsWithReplies,
  deleteReply,
};
