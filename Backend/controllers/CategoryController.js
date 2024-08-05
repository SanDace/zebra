const Category = require("../models/category");

// Create a new category

exports.createCategory = async (req, res) => {
  const { name } = req.body;
  const existingCategory = await Category.findOne({ name });

  if (existingCategory) {
    return res.status(409).json({ message: "Category name is already taken" });
  }

  try {
    const category = new Category({
      name,
    });
    await category.save();
    res
      .status(201)
      .json({ message: "Category created successfully", category });
  } catch (error) {
    console.error("Error creating category:", error);
    res.status(500).json({ message: error.message });
  }
};

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
// exports.getCategories = async (req, res) => {
//   try {
//     const { search } = req.query;
//     let query = {};

//     if (search) {
//       // Define your search query condition based on your model
//       query = { name: { $regex: new RegExp(search, "i") } }; // Case-insensitive search by name
//     }

//     const categories = await Category.find(query);
//     res.json({ success: true, category: categories });
//   } catch (error) {
//     console.error("Error fetching categories:", error);
//     res.status(500).json({
//       success: false,
//       message: "Failed to fetch categories. Please try again later.",
//     });
//   }
// };

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
// Update a category
exports.updateCategory = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  try {
    // Check if the new category name already exists
    const existingCategory = await Category.findOne({ name });

    if (existingCategory && existingCategory._id.toString() !== id) {
      return res
        .status(409)
        .json({ message: "Category name is already taken" });
    }

    // Find the category by ID and update its name
    const category = await Category.findByIdAndUpdate(
      id,
      { name },
      { new: true, runValidators: true }
    );

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    res
      .status(200)
      .json({ message: "Category updated successfully", category });
  } catch (error) {
    console.error("Error updating category:", error);
    res.status(500).json({ message: error.message });
  }
};

// Delete a category
exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error("Error deleting category:", error);
    res.status(500).json({ message: "Server error" });
  }
};
