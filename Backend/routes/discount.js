const express = require("express");
const router = express.Router();
const {
  createDiscount,
  getDiscount,
  deleteDiscount,
  getDiscountById,
  updateDiscount,
} = require("../controllers/DiscountController");

// Routes
router.post("/create", createDiscount);
router.get("/", getDiscount);
router.delete("/:id", deleteDiscount);
router.get("/:id", getDiscountById);
router.put("/:id", updateDiscount);

module.exports = router;
