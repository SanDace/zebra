const mongoose = require("mongoose");

const discountSchema = new mongoose.Schema({
  discount_rate: {
    type: Number,
    required: [true, "Discount rate is required"],
    min: [1, "Discount rate must be at least 1%"],
    max: [100, "Discount rate cannot exceed 100%"],
  },
  starts_from: {
    type: Date,
    validate: {
      validator: function (value) {
        const today = new Date().setHours(0, 0, 0, 0);
        return !value || new Date(value) >= today; // Ensure the date is not in the past
      },
      message: "Starting date cannot be in the past",
    },
  },
  valid_until: {
    type: Date,
    validate: [
      {
        validator: function (value) {
          const today = new Date().setHours(0, 0, 0, 0);
          return new Date(value) >= today; // Ensure the date is not in the past
        },
        message: "Valid until date cannot be in the past",
      },
      {
        validator: function (value) {
          return (
            !this.starts_from || new Date(value) >= new Date(this.starts_from)
          ); // Ensure the date is greater than or equal to starts_from
        },
        message:
          "Valid until date must be greater than or equal to the starting date",
      },
    ],
  },
});

module.exports = mongoose.model("Discount", discountSchema);
