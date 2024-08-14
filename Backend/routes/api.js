const express = require("express");
const router = express.Router();
const {
  getAllProducts,
  getSingleProduct,
  getProductsByCategory,
} = require("../controllers/ApiController/ProductController");

router.get("/products", getAllProducts);
router.get("/product/:id", getSingleProduct);
router.get("/products/category/:categoryId", getProductsByCategory);

const {
  getCategories,
  getCategoryById,
  getFormCategories,
} = require("../controllers/ApiController/CategoryController");

router.get("/category/form", getFormCategories);
router.get("/category", getCategories);
router.get("/category/:id", getCategoryById);

const cartController = require("../controllers/ApiController/CartController");

router.post("/cart/add", cartController.addToCart);
router.get("/cart/:userId", cartController.getCart);
router.delete("/cart/remove", cartController.removeFromCart);
router.get("/cart/item/:userId/:productId", cartController.getCartItem);
router.put("/cart/updateQuantity", cartController.updateQuantity);

// order controller
const orderController = require("../controllers/ApiController/OrderController");
router.get("/orders/:userId", orderController.getOrders);
router.get("/orders", orderController.getAllOrders);
// order controller

// Paymentcontroller
const paymentController = require("../controllers/ApiController/PaymentController");
// router.get("/payment/check/:userId", paymentController.getPayment);
router.get(
  "/purchase/check/:productId/:userId",
  paymentController.checkPurchaseStatus
);
router.get("/payments", paymentController.getAllPayments);

// Paymentcontroller

module.exports = router;
