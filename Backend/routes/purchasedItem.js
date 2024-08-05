const express = require("express");
const router = express.Router();
const PurchasedItem = require("../models/purchasedItem"); // Adjust the import path as per your file structure

// GET purchased item details by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Purchased item ID is required" });
    }

    const purchasedItem = await PurchasedItem.findById(id);

    if (!purchasedItem) {
      return res.status(404).json({ message: "Purchased item not found" });
    }

    res.json(purchasedItem);
  } catch (error) {
    console.error("Error fetching purchased item:", error);
    res.status(500).json({ message: "Failed to fetch purchased item" });
  }
});

module.exports = router;
