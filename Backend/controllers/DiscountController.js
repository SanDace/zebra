const Discount = require("../models/discount");

// Create a new discount
exports.createDiscount = async (req, res) => {
  const { discount_rate, starts_from, valid_until } = req.body;

  try {
    const discount = new Discount({ discount_rate, starts_from, valid_until });
    await discount.save();
    res.status(201).json(discount);
  } catch (err) {
    if (err.name === "ValidationError") {
      return res.status(400).json({ error: err.message });
    }
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get all discounts
exports.getDiscount = async (req, res) => {
  try {
    const discounts = await Discount.find();
    res.status(200).json(discounts);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get a discount by ID
exports.getDiscountById = async (req, res) => {
  const { id } = req.params;

  try {
    const discount = await Discount.findById(id);
    if (!discount) {
      return res.status(404).json({ error: "Discount not found" });
    }
    res.status(200).json(discount);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
};

// Update a discount by ID
exports.updateDiscount = async (req, res) => {
  const { id } = req.params;
  const { discount_rate, starts_from, valid_until } = req.body;

  try {
    const discount = await Discount.findByIdAndUpdate(
      id,
      { discount_rate, starts_from, valid_until },
      { new: true, runValidators: true }
    );
    if (!discount) {
      return res.status(404).json({ error: "Discount not found" });
    }
    res.status(200).json(discount);
  } catch (err) {
    if (err.name === "ValidationError") {
      return res.status(400).json({ error: err.message });
    }
    res.status(500).json({ error: "Internal server error" });
  }
};

// Delete a discount by ID
exports.deleteDiscount = async (req, res) => {
  const { id } = req.params;

  try {
    const discount = await Discount.findByIdAndDelete(id);
    if (!discount) {
      return res.status(404).json({ error: "Discount not found" });
    }
    res.status(200).json({ message: "Discount deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
};
