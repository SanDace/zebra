const Address = require("../models/address");

// Create address
exports.createAddress = async (req, res) => {
  const { address, city, state, postalCode, country, tole, phone, userId } =
    req.body;

  try {
    // Check if an address already exists for the given userId
    const existingAddress = await Address.findOne({ userId });
    if (existingAddress) {
      return res.status(400).json({ error: "User already has an address" });
    }

    const newAddress = new Address({
      address,
      city,
      state,
      postalCode,
      country,
      tole,
      phone,
      userId,
    });

    const savedAddress = await newAddress.save();
    res.status(201).json(savedAddress);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get all addresses for a user
exports.getAddressesByUserId = async (req, res) => {
  const { id } = req.params;

  try {
    const address = await Address.find({ userId: id });

    res.status(200).json(address);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getAllAddresses = async (req, res) => {
  try {
    const addresses = await Address.find({});
    res.status(200).json(addresses);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
};

// Update address
exports.updateAddress = async (req, res) => {
  const { id } = req.params;

  try {
    const updatedAddress = await Address.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updatedAddress)
      return res.status(404).json({ error: "Address not found" });

    res.status(200).json(updatedAddress);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
};

// Delete address
exports.deleteAddress = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedAddress = await Address.findByIdAndDelete(id);
    if (!deletedAddress)
      return res.status(404).json({ error: "Address not found" });

    res.status(200).json({ message: "Address deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
};
