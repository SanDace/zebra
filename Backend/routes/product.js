const express = require("express");
const router = express.Router();
const multer = require("multer");
const {
  createProduct,
  // getAllProducts,
  deleteProduct,
  getSingleProduct,
  updateProduct,
  getAllProductsAdmin,
  getProductsByCategory,
} = require("../controllers/ProductController");

// // Multer storage configuration
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     if (file.mimetype.startsWith("image")) {
//       cb(null, "uploads/images/");
//     } else {
//       cb(new Error("Unsupported file type"));
//     }
//   },

//   filename: function (req, file, cb) {
//     const timestamp = new Date()
//       .toISOString()
//       .replace(/:/g, "-")
//       .replace(/\..+/, "");
//     const uniqueFilename = `${timestamp}_${file.originalname}`;
//     cb(null, uniqueFilename);
//   },
// });

// // Multer upload configuration
// const upload = multer({ storage: storage });

// Routes

// Route for adding a new product
router.post("/create", createProduct);
// router.get("/", getAllProducts);
router.get("/list", getAllProductsAdmin);
router.delete("/:id", deleteProduct);
router.get("/:id", getSingleProduct);
router.get("/category/:categoryId", getProductsByCategory);
router.put("/:id", updateProduct);

module.exports = router;
