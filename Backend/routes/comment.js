const express = require("express");
const router = express.Router();
const {
  createComment,
  updateComment,
  deleteComment,
  addReply,
  getCommentsWithReplies,
  deleteReply,
} = require("../controllers/CommentController");

router.post("/create", createComment);

router.get("/:product_id", getCommentsWithReplies);
router.put("/:id", updateComment);

router.post("/reply/:parentCommentId", addReply);

// Delete a Comment
router.delete("/delete/:id", deleteComment);

router.delete("/reply/delete/:id", deleteReply);
// Delete a reply

module.exports = router;
