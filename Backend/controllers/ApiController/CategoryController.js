const Category = require("../../models/category");

// Create a new category

// // Get all categories
exports.getCategories = async (req, res) => {
  try {
    const { search, page = 1, limit = 10 } = req.query;
    let query = {};

    if (search) {
      // Define your search query condition based on your model
      query = { name: { $regex: new RegExp(search, "i") } }; // Case-insensitive search by name
    }

    const options = {
      limit: parseInt(limit), // Convert limit to a number
      skip: (page - 1) * limit, // Calculate skip based on page number
    };

    const categories = await Category.find(query, null, options);
    const totalCount = await Category.countDocuments(query);

    res.json({ success: true, category: categories, totalCount });
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch categories. Please try again later.",
    });
  }
};
exports.getFormCategories = async (req, res) => {
  try {
    const category = await Category.find();
    res.status(200).json(category);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.json(category);
  } catch (error) {
    console.error("Error fetching category:", error);
    res.status(500).json({ message: "Server error" });
  }
};
