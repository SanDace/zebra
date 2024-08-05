// routes/ratingRoutes.js

const express = require("express");
const router = express.Router();

const {
  addRating,
  getUserRating,
  getAllRatings
} = require("../controllers/ApiController/RatingController");

router.post("/add/:productId", addRating);
router.get("/get/:productId", getUserRating);
router.get("/:productId", getAllRatings); 
module.exports = router;
