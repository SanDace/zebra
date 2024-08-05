// routes/profileRoutes.js
const express = require("express");
const {
  uploadPhoto,
  getProfile,
  updatePhoto,
  removePhoto,
  addName,
  updateName,
  getUserName,
  changePassword,
} = require("../controllers/ProfileController");
const router = express.Router();
const requireAuth = require("../middleware/requireAuth");

// Route for uploading a photo
router.use(requireAuth);
router.post("/uploadPhoto", uploadPhoto);
router.get("/getProfile", getProfile);
router.get("/getUserName", getUserName);
router.post("/updatePhoto", updatePhoto);
router.delete("/removePhoto", removePhoto);
router.post("/addName", addName);
router.post("/updateName", updateName);
router.post("/changePassword",changePassword)
module.exports = router;
