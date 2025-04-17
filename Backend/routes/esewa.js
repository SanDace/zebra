const express = require("express");
const router = express.Router();
const axios = require("axios");
const PurchasedItem = require("../models/purchasedItem"); // Check the correct filename and capitalization
const Payment = require("../models/payment"); // Check the correct filename and capitalization
const Address = require("../models/address"); // Check the correct filename and capitalization
const Product = require("../models/product"); // Ensure this is the correct path to the Product model
const { verifyEsewaPayment } = require("../middleware/esewa"); // Assuming verifyEsewaPayment is exported correctly

// Initialize eSewa payment
// router.post("/initialize-esewa", async (req, res) => {
//   try {
//     const {
//       id,
//       totalPrice,
//       transaction_uuid,
//       product_code,
//       paymentMethod,
//       user_id,
//       quantity,
//     } = req.body;

//     console.log("Received data:", {
//       id,
//       totalPrice,
//       transaction_uuid,
//       product_code,
//       paymentMethod,
//       user_id,
//       quantity,
//     });

//     // Fetch the product details
//     const product = await Product.findById(id);
//     const address = await Address.find({ userId: user_id });

//     if (!product) {
//       return res.status(404).json({
//         success: false,
//         message: "Product not found",
//       });
//     }

//     // Create a record for the purchase
//     const purchasedItemData = await PurchasedItem.create({
//       itemId: id,
//       userId: user_id,
//       totalPrice: totalPrice,
//       paymentMethod: paymentMethod,
//       address: {
//         city: address.city,
//         state: address.state,
//         postalCode: address.postalCode,
//         country: address.country,
//         tole: address.tole,
//         phone: address.phone,
//       },
//       transaction_uuid: transaction_uuid,
//       quantity,
//       itemDetails: {
//         name: product.name,
//         details: product.details,
//         price: product.price,
//         photo: product.photo,
//       },
//     });

//     res.json({
//       success: true,
//       message: "Payment initiation successful",
//       purchasedItemData: purchasedItemData,
//     });
//   } catch (error) {
//     console.error("Error initializing eSewa payment:", error);
//     res.status(500).json({
//       success: false,
//       message: "Error initializing eSewa payment",
//       error: error.message,
//     });
//   }
// });

router.post("/initialize-esewa", async (req, res) => {
  try {
    const {
      id,
      totalPrice,
      transaction_uuid,
      product_code,
      paymentMethod,
      user_id,
      quantity,
    } = req.body;

    console.log("Received data:", {
      id,
      totalPrice,
      transaction_uuid,
      product_code,
      paymentMethod,
      user_id,
      quantity,
    });

    // Fetch the product details
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Fetch the user's address
    const addresses = await Address.find({ userId: user_id });

    if (!addresses || addresses.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User address not found",
      });
    }

    // Assuming you want to use the first address
    const address = addresses[0];

    // Create a record for the purchase
    const purchasedItemData = await PurchasedItem.create({
      itemId: id,
      userId: user_id,
      totalPrice: totalPrice,
      paymentMethod: paymentMethod,
      address: {
        city: address.city,
        state: address.state,
        postalCode: address.postalCode,
        country: address.country,
        tole: address.tole,
        phone: address.phone,
      },
      transaction_uuid: transaction_uuid,
      quantity,
      itemDetails: {
        name: product.name,
        details: product.details,
        price: product.price,
        photo: product.photo,
      },
    });

    res.json({
      success: true,
      message: "Payment initiation successful",
      purchasedItemData: purchasedItemData,
    });
  } catch (error) {
    console.error("Error initializing eSewa payment:", error);
    res.status(500).json({
      success: false,
      message: "Error initializing eSewa payment",
      error: error.message,
    });
  }
});

// Complete eSewa payment
router.post("/complete-payment", async (req, res) => {
  const { data } = req.body; // Data received from eSewa's redirect
  console.log("Data:", data);

  try {
    // Verify payment with eSewa
    const paymentInfo = await verifyEsewaPayment(data);

    console.log("Payment Info:", paymentInfo);

    // Find the purchased item using the transaction UUID
    const purchasedItemData = await PurchasedItem.findOne({
      transaction_uuid: paymentInfo.response.transaction_uuid,
    });

    console.log("Purchased Item Data:", purchasedItemData);

    if (!purchasedItemData) {
      return res.status(404).json({
        success: false,
        message: "Purchase not found",
      });
    }

    // Create a new payment record in the database
    const paymentData = await Payment.create({
      pidx: paymentInfo.decodedData.transaction_code,
      transactionId: paymentInfo.decodedData.transaction_code,
      userId: purchasedItemData.userId,
      productId: purchasedItemData.itemId, // Assuming purchasedItemData has the ObjectId of the product
      amount: purchasedItemData.totalPrice,
      address: purchasedItemData.address,
      dataFromVerificationReq: paymentInfo,
      apiQueryFromUser: req.query,
      paymentGateway: "esewa",
      status: "success",
    });

    // Update the purchased item status to 'completed'
    purchasedItemData.paymentStatus = "completed";
    await purchasedItemData.save();

    // Respond with success message
    res.json({
      success: true,
      message: "Payment successful",
      paymentData,
    });
  } catch (error) {
    console.error("Error completing eSewa payment:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred during payment verification",
      error: error.message,
    });
  }
});

// router.post("/complete-payment", async (req, res) => {
//   const { data } = req.body; // Data received from eSewa's redirect
//   console.log("Data:", data);

//   try {
//     // Verify payment with eSewa
//     const paymentInfo = await verifyEsewaPayment(data);

//     console.log("Payment Info:", paymentInfo);

//     // Find the purchased item using the transaction UUID
//     const purchasedItemData = await PurchasedItem.findOne({
//       transaction_uuid: paymentInfo.response.transaction_uuid,
//     });

//     console.log("Purchased Item Data:", purchasedItemData);

//     if (!purchasedItemData) {
//       return res.status(404).json({
//         success: false,
//         message: "Purchase not found",
//       });
//     }

//     if (paymentInfo.response.success) {
//       // Create a new payment record in the database
//       const paymentData = await Payment.create({
//         pidx: paymentInfo.decodedData.transaction_code,
//         transactionId: paymentInfo.decodedData.transaction_code,
//         productId: purchasedItemData._id, // Assuming purchasedItemData has the ObjectId of the product
//         amount: purchasedItemData.totalPrice,
//         dataFromVerificationReq: paymentInfo,
//         apiQueryFromUser: req.query,
//         paymentGateway: "esewa",
//         status: "success",
//       });

//       // Update the purchased item status to 'completed'
//       await PurchasedItem.findByIdAndUpdate(purchasedItemData._id, {
//         $set: { status: "completed" },
//       });

//       // Respond with success message
//       res.json({
//         success: true,
//         message: "Payment successful",
//         paymentData,
//       });
//     } else {
//       // Handle failure case: delete the purchased item
//       await PurchasedItem.findByIdAndDelete(purchasedItemData._id);

//       res.json({
//         success: false,
//         message: "Payment failed",
//       });
//     }
//   } catch (error) {
//     console.error("Error completing eSewa payment:", error);
//     res.status(500).json({
//       success: false,
//       message: "An error occurred during payment verification",
//       error: error.message,
//     });
//   }
// });

// Route to delete purchased items

router.post("/delete-purchased-items/:transaction_uuid", async (req, res) => {
  const { transaction_uuid } = req.params;

  try {
    // Check if the purchased item exists
    const existingItem = await PurchasedItem.findOne({ transaction_uuid });

    if (!existingItem) {
      return res.status(404).json({
        success: false,
        message: "No purchased item found for the provided transaction UUID",
      });
    }

    // Delete the purchased item
    const result = await PurchasedItem.findOneAndDelete({ transaction_uuid });

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Failed to delete purchased item",
      });
    }

    res.json({
      success: true,
      message: "Purchased item deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting purchased item:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting purchased item",
      error: error.message,
    });
  }
});

module.exports = router;
