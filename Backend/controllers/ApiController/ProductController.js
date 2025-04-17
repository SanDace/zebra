const Product = require("../../models/product");

const searchProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // Default to page 1
    const limit = parseInt(req.query.limit) || 10; // Default to 10 products per page
    const skip = (page - 1) * limit; // Pagination offset
    const searchQuery = req.query.q || ""; // Capture the search query from URL

    // Define search filter
    let searchOptions = {};

    if (searchQuery.trim() !== "") {
      // Create a regex for case-insensitive search (for both name and details)
      const regex = new RegExp(searchQuery, "i");
      searchOptions = {
        $or: [
          { name: regex }, // Search in the name field
          // { details: regex } // If you want to search the details field as well
        ]
      };
    }

    // Fetch products from the database with the search and pagination filter
    const products = await Product.find(searchOptions)
      .skip(skip) // Apply pagination
      .limit(limit); // Apply limit to results

    // Get the total number of products for pagination
    const totalProducts = await Product.countDocuments(searchOptions);

    // Send response
    res.json({
      products,
      totalProducts,
      totalPages: Math.ceil(totalProducts / limit),
      currentPage: page
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Failed to fetch products" });
  }
};


const getAllProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const searchQuery = req.query.search || "";
    const skip = (page - 1) * limit;

    let searchOptions = {};

    if (searchQuery) {
      // Fuzzy search using regex
      const regex = new RegExp(searchQuery, "i"); // 'i' for case-insensitive
      searchOptions = {
        $or: [{ name: regex }, { details: regex }],
      };
    }

    const products = await Product.find(searchOptions)
      .skip(skip)
      .limit(limit)
      .populate("categoryId");
    const totalProducts = await Product.countDocuments(searchOptions);
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
  searchProducts
};
