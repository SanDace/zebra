const express = require("express");
const Payment = require("../../models/payment"); // Assuming you have a Payment model

// Check if the user has purchased a specific product
const checkPurchaseStatus = async (req, res) => {
  try {
    const { productId, userId } = req.params;

    console.log(productId, userId);
    // Ensure userId and productId are defined and valid before querying
    if (!userId || !productId) {
      return res
        .status(400)
        .json({ error: "productId or userId parameter is missing or invalid" });
    }

    // Check if there exists a payment record for the given productId and userId
    const payment = await Payment.findOne({ productId, userId });

    if (payment) {
      res.json({ payment: true });
    } else {
      res.json({ payment: false });
    }
  } catch (error) {
    console.error("Error checking purchase status:", error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  checkPurchaseStatus,
};
