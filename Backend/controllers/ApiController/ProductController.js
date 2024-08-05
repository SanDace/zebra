const Product = require("../../models/product");

const getAllProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10; // Number of products per page
    const skip = (page - 1) * limit;

    const products = await Product.find()
      .populate("categoryId")
      .skip(skip)
      .limit(limit);
    const totalProducts = await Product.countDocuments();
    const totalPages = Math.ceil(totalProducts / limit);
    res.json({
      products,
      totalPages,
      currentPage: page,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getSingleProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "productId is required" });
    }

    const product = await Product.findById(id).populate("categoryId");

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ message: "Failed to fetch product" });
  }
};

const getProductsByCategory = async (req, res) => {
  try {
    const categoryId = req.params.categoryId; // Extract category ID from request parameters

    // Build the query object
    const query = {
      categoryId: categoryId,
    };

    // Fetch products with the matching category ID and price range
    const products = await Product.find(query);

    res.json(products);
  } catch (error) {
    console.error(
      "Error fetching products by category and price range:",
      error
    );
    res.status(500).json({ message: "Server Error" });
  }
};

// productController.js

module.exports = {
  getAllProducts,
  getSingleProduct,
  getProductsByCategory,
};
