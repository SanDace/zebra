const express = require("express");
const router = express.Router();

const AddressController = require("../controllers/AddressController");

// const requireAuth = require("../middleware/adminAuth");

// router.use(requireAuth);
router.post("/create", AddressController.createAddress);
router.get("/user/:id", AddressController.getAddressesByUserId);
router.get("/:id", AddressController.getAllAddresses);
router.put("/:id", AddressController.updateAddress);
router.delete("/:id", AddressController.deleteAddress);

module.exports = router;
