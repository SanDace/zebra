const express = require("express");
const router = express.Router();

const {
  login,
  register,
  getUserData,
  sendEmail,
  resetPassword,
} = require("../controllers/Authcontroller");
router.post("/login", login);

// const requireAuth = require("../middleware/adminAuth");

// router.use(requireAuth);
router.post("/register", register);
router.get("/userData/:id", getUserData);
router.post("/send-reset-email", sendEmail);
router.post("/reset-password", resetPassword);







module.exports = router;
