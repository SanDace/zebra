const fs = require("fs");
const path = require("path");
const Product = require("../models/product");
const Comment = require("../models/comment");
const PurchasedItem = require("../models/purchasedItem");
const Cart = require("../models/cart");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/images/"); // Set your destination folder
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

// File filter function
const fileFilter = (req, file, cb) => {
  // Implement your validation logic here
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg"
  ) {
    // Accept file
    cb(null, true);
  } else {
    // Reject file
    cb(new Error("Invalid file type"), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 1 * 1024 * 1024 },
}).single("photo");

const createProduct = async (req, res) => {
  upload(req, res, async function (err) {
    if (err instanceof multer.MulterError) {
      console.error("Multer error:", err);
      return res.status(400).json({ error: "Multer error" });
    } else if (err) {
      console.error("Unknown error:", err);
      return res.status(500).json({ error: "Unknown error" });
    }

    const { name, details, price, categoryId, stock } = req.body;
    if (name.length > 225) {
      return res
        .status(400)
        .json({ error: "Name should not be greater than 125 characters" });
    }
    if (details.length > 1000) {
      return res
        .status(400)
        .json({ error: "Details should not be greater than 1000 characters" });
    }
    if (stock < 0) {
      return res.status(400).json({ error: "Stock should not be in negative" });
    }

    if (!req.file) {
      return res.status(400).json({ error: "Image is required" });
    }

    if (!name || !details || !price || !categoryId) {
      const imagePath = path.join(
        __dirname,
        "../uploads/images",
        req.file.filename
      );
      fs.unlink(imagePath, (unlinkError) => {
        if (unlinkError) {
          console.error("Error deleting file:", unlinkError);
        }
      });
      return res.status(400).json({ error: "All fields are required" });
    }

    const photoname = req.file.filename;

    try {
      const product = new Product({
        name,
        details,
        price,
        photo: photoname,
        categoryId,
        stock,
      });

      await product.save();

      res.status(201).json({ message: "Product created successfully" });
    } catch (error) {
      console.error("Error adding product:", error);
      // If an error occurs, delete the uploaded image
      const imagePath = path.join(__dirname, "../uploads/images", photoname);
      fs.unlink(imagePath, (unlinkError) => {
        if (unlinkError) {
          console.error("Error deleting file:", unlinkError);
        }
      });
      res.status(500).json({ error: "Internal server error" });
    }
  });
};

const getAllProductsAdmin = async (req, res) => {
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
// const deleteProduct = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const product = await Product.findById(id);
//     if (!product) {
//       return res.status(404).json({ message: "Product not found" });
//     }

//     // Check if there is an image associated with the product
//     if (product.photo) {
//       const photoPath = path.join(
//         __dirname,
//         "..",
//         "uploads",
//         "images",
//         product.photo
//       );

//       try {
//         fs.unlinkSync(photoPath);
//         console.log(`Image file ${product.photo} deleted successfully.`);
//       } catch (error) {
//         console.log(
//           `Failed to delete image file ${product.photo}: ${error.message}`
//         );
//       }
//     } else {
//       console.log("No image file associated with this product.");
//     }

//     await Product.findByIdAndDelete(id);
//     // Delete related comments
//     await Comment.deleteMany({ product_id: id });

//     // Delete the product from cart
//     await Cart.updateMany(
//       { "items.product": id },
//       { $pull: { items: { product: id } } }
//     );

//     res.status(200).json({ message: "Product deleted successfully" });
//   } catch (err) {
//     console.error("Error deleting product:", err);
//     res.status(500).json({ message: "Error deleting product" });
//   }
// };

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Check if the product is referenced in any purchased items
    const purchasedItems = await PurchasedItem.find({ itemId: id });

    if (purchasedItems.length === 0) {
      // No references found, safe to delete the image
      if (product.photo) {
        const photoPath = path.join(
          __dirname,
          "..",
          "uploads",
          "images",
          product.photo
        );

        try {
          fs.unlinkSync(photoPath);
          console.log(`Image file ${product.photo} deleted successfully.`);
        } catch (error) {
          console.log(
            `Failed to delete image file ${product.photo}: ${error.message}`
          );
        }
      } else {
        console.log("No image file associated with this product.");
      }
    } else {
      console.log(
        "Product is referenced in purchased items, image will not be deleted."
      );
    }

    // Proceed with deleting the product and related data
    await Product.findByIdAndDelete(id);

    // Delete related comments
    await Comment.deleteMany({ product_id: id });

    // Delete the product from cart
    await Cart.updateMany(
      { "items.product": id },
      { $pull: { items: { product: id } } }
    );

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (err) {
    console.error("Error deleting product:", err);
    res.status(500).json({ message: "Error deleting product" });
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

// const updateProduct = async (req, res) => {
//   const { id } = req.params;
//   try {
//     upload(req, res, async function (err) {
//       if (err instanceof multer.MulterError) {
//         // A Multer error occurred when uploading
//         console.error("Multer error:", err);
//         return res.status(400).json({ error: "Multer error" });
//       } else if (err) {
//         // An unknown error occurred
//         console.error("Unknown error:", err);
//         return res.status(500).json({ error: "Unknown error" });
//       }

//       const { name, details, price, categoryId } = req.body;

//       // Find existing product by id
//       const product = await Product.findById(id);
//       if (!product) {
//         return res.status(404).json({ error: "Product not found" });
//       }

//       // Check if a new image is uploaded
//       let photoname = product.photo;
//       if (req.file) {
//         // Delete old image
//         const oldImagePath = path.join(
//           __dirname,
//           "../uploads/images",
//           product.photo
//         );
//         if (fs.existsSync(oldImagePath)) {
//           fs.unlinkSync(oldImagePath);
//         }
//         // Update with new image
//         photoname = req.file.filename;
//       }

//       // Validate the name length
//       if (name.length > 10) {
//         // If name is too long, delete the uploaded file (if any) and send an error response
//         if (req.file) {
//           console.log("Deleting uploaded file:", photoname);
//           const imagePath = path.join(
//             __dirname,
//             "../uploads/images",
//             photoname
//           );
//           fs.unlinkSync(imagePath);
//         }

//         return res
//           .status(400)
//           .json({ error: "Name must be less than 10 characters" });
//       }

//       // Update product details
//       product.name = name || product.name;
//       product.details = details || product.details;
//       product.price = price || product.price;
//       product.photo = photoname;
//       product.categoryId = categoryId || product.categoryId;

//       // Save the updated product to the database
//       await product.save();

//       // Send success response
//       res.status(200).json({ message: "Product updated successfully" });
//     });
//   } catch (error) {
//     console.error("Error updating product:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };

const updateProduct = async (req, res) => {
  const { id } = req.params;
  try {
    upload(req, res, async function (err) {
      if (err instanceof multer.MulterError) {
        console.error("Multer error:", err);
        return res.status(400).json({ error: "Multer error" });
      } else if (err) {
        console.error("Unknown error:", err);
        return res.status(500).json({ error: "Unknown error" });
      }

      const { name, details, price, categoryId, stock } = req.body;

      // Find existing product by id
      const product = await Product.findById(id);
      if (!product) {
        // If product is not found, delete the new image if it exists
        if (req.file) {
          const imagePath = path.join(
            __dirname,
            "../uploads/images",
            req.file.filename
          );
          fs.unlinkSync(imagePath);
        }
        return res.status(404).json({ error: "Product not found" });
      }

      if (name && name.length > 255) {
        // If name is too long, delete the uploaded file (if any) and send an error response
        if (req.file) {
          console.log("Deleting uploaded file:", req.file.filename);
          const imagePath = path.join(
            __dirname,
            "../uploads/images",
            req.file.filename
          );
          fs.unlinkSync(imagePath);
        }
        return res
          .status(400)
          .json({ error: "Name must be less than 255 characters" });
      }
      if (details && details.length > 1000) {
        // If name is too long, delete the uploaded file (if any) and send an error response
        if (req.file) {
          console.log("Deleting uploaded file:", req.file.filename);
          const imagePath = path.join(
            __dirname,
            "../uploads/images",
            req.file.filename
          );
          fs.unlinkSync(imagePath);
        }
        return res
          .status(400)
          .json({ error: "Detail must be less than 1000 characters" });
      }

      // Proceed with updating the image if validation passes
      let photoname = product.photo;
      if (req.file) {
        // Update with new image
        photoname = req.file.filename;

        // Delete old image only after validation passes
        const oldImagePath = path.join(
          __dirname,
          "../uploads/images",
          product.photo
        );
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }

      // Update product details
      product.name = name || product.name;
      product.details = details || product.details;
      product.price = price || product.price;
      product.photo = photoname;
      product.stock = stock;
      product.categoryId = categoryId || product.categoryId;

      // Save the updated product to the database
      await product.save();

      // Send success response
      res.status(200).json({ message: "Product updated successfully" });
    });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ error: "Internal server error" });
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
  createProduct,
  deleteProduct,
  updateProduct,
  getSingleProduct,
  getAllProductsAdmin,
  getProductsByCategory,
};
