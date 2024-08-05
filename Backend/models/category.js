const mongoose = require("mongoose");
const { Schema } = mongoose;

const categorySchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    validate: {
      validator: function (value) {
        // Check if the name contains only one word
        return value.split(" ").length === 1;
      },
      message: "Category name should be a single word.",
    },
  },
});

// Setter function to capitalize the first letter and lowercase the rest
categorySchema.path("name").set(function (value) {
  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
});

const Category = mongoose.model("Category", categorySchema);

module.exports = Category;
