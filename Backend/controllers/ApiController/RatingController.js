const Product = require("../../models/product");

const addRating = async (req, res) => {
  try {
    const { productId } = req.params;
    const { rating, userId } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    const existingRating = product.ratings.find(
      (r) => String(r.userId) === String(userId)
    );
    if (existingRating) {
      return res
        .status(400)
        .json({ error: "You have already rated this product" });
    }

    product.ratings.push({ userId, rating });
    await product.save();

    res.status(201).json({ message: "Rating added successfully", product });
  } catch (error) {
    console.error("Error adding rating:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getUserRating = async (req, res) => {
  try {
    const { productId } = req.params;
    const { userId } = req.query;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    const userRating = product.ratings.find(
      (rating) => String(rating.userId) === userId
    );
    if (!userRating) {
      return res.status(404).json({ message: "User rating not found" });
    }

    res.json({ rating: userRating.rating });
  } catch (error) {
    console.error("Error fetching user rating:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getAllRatings = async (req, res) => {
  try {
    const { productId } = req.params;

    // Retrieve the product by ID
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Return the product's ratings
    res.json({ ratings: product.ratings });
  } catch (error) {
    console.error("Error fetching all ratings:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = { addRating, getUserRating, getAllRatings };
