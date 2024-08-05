const mongoose = require("mongoose");

const purchasedItemSchema = new mongoose.Schema(
  {
    transaction_uuid: { type: String, required: true },
    itemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    itemDetails: {
      name: { type: String, required: true },
      details: { type: String, required: true },
      price: { type: Number, required: true },
      photo: { type: String, required: true },
    },
    address: {
      city: { type: String, required: true },
      state: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true },
      tole: { type: String, required: true },
      phone: { type: String, required: true },
    },
    deliveryStatus: {
      type: String,
      required: true,
      default: "pending",
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1, // Ensure the quantity is at least 1
    },
    totalPrice: { type: Number, required: true },
    purchaseDate: { type: Date, default: Date.now },
    paymentMethod: {
      type: String,
      enum: ["esewa", "khalti"],
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "completed", "refunded"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const PurchasedItem = mongoose.model("PurchasedItem", purchasedItemSchema);

module.exports = PurchasedItem;
