const express = require("express");
const router = express.Router();
const {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  getFormCategories,
  deleteCategory,
} = require("../controllers/CategoryController");

router.post("/create", createCategory);
router.get("/form", getFormCategories);
router.get("/", getCategories);
router.get("/:id", getCategoryById);
router.put("/:id", updateCategory);
router.delete("/:id", deleteCategory);

module.exports = router;
