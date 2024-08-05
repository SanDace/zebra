const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: [255, "Product name must be at most 100 characters long."],
  },
  details: {
    type: String,
    required: true,
    trim: true,
    maxlength: [1000, "Details must be at most 500 characters long."],
  },
  price: {
    type: Number,
    required: true,
    min: [0, "Price must be a positive number."],
  },
  photo: {
    type: String,
    required: true,
  },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: false,
  },
  ratings: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        
      },
      rating: {
        type: Number,
        min: 1,
        max: 5,
      },
    },
  ],
  stock: {
    type: Number,
    default: 1,
    min: [0, "Stock must be a positive number or zero."],
  },
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
