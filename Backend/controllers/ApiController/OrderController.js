// routes/orders.js
const express = require("express");
const Order = require("../../models/purchasedItem"); // Assuming you have an Order model

// Fetch orders by user ID with pagination
const getOrders = async (req, res) => {
  try {
    const { userId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const totalOrders = await Order.countDocuments({ userId });
    const orders = await Order.find({ userId })
      .populate("itemId")
      .skip(skip)
      .limit(limit);

    res.json({ orders, totalOrders });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const getAllOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const totalOrders = await Order.countDocuments();
    const orders = await Order.find()
      .populate("itemId")
      .populate("userId")
      .skip(skip)
      .limit(limit);

    res.json({ orders, totalOrders });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getOrders,
  getAllOrders,
};
