const bcrypt = require("bcryptjs");
const User = require("../models/user");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Multer setup
const storage = multer.diskStorage({
  destination: "uploads/profileImages",
  filename: (req, file, cb) => {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 }, // 1MB file size limit
  fileFilter: (req, file, cb) => {
    checkFileType(file, cb);
  },
}).single("photo");

// Check file type
function checkFileType(file, cb) {
  const filetypes = /jpeg|jpg|png/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb("Error: Images only!");
  }
}

// Controller method to upload photo
const uploadPhoto = (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      return res.status(400).json({ error: err });
    }

    if (!req.file) {
      return res.status(400).json({ error: "No file selected!" });
    }

    const photoPath = req.file.filename;

    User.findByIdAndUpdate(req.user._id, { photo: photoPath }, { new: true })
      .then((user) => {
        if (!user) {
          return res.status(404).json({ error: "User not found" });
        }
        res.json({ message: "Profile photo uploaded successfully", user });
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });
};

// Controller method to update photo
const updatePhoto = (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ error: err });
    }

    if (!req.file) {
      return res.status(400).json({ error: "No file selected!" });
    }

    const newPhotoPath = req.file.filename;

    try {
      const user = await User.findById(req.user._id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const oldPhotoPath = user.photo;

      // Update the user's photo in the database
      user.photo = newPhotoPath;
      await user.save();

      // Delete the old photo from the storage if it exists
      if (oldPhotoPath) {
        const oldPhotoFullPath = path.join(
          __dirname,
          "../uploads/profileImages",
          oldPhotoPath
        );
        fs.unlink(oldPhotoFullPath, (err) => {
          if (err) {
            console.error("Failed to delete old photo:", err);
          }
        });
      }

      res.json({ message: "Profile photo updated successfully", user });
    } catch (err) {
      // Remove the new photo if there was an error updating the database
      const newPhotoFullPath = path.join(
        __dirname,
        "../uploads/profileImages",
        newPhotoPath
      );
      fs.unlink(newPhotoFullPath, (unlinkErr) => {
        if (unlinkErr) {
          console.error("Failed to delete new photo after error:", unlinkErr);
        }
      });

      res.status(500).json({ error: err.message });
    }
  });
};

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("photo");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const removePhoto = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const photoPath = user.photo;

    // Update the user's photo in the database
    user.photo = null;
    await user.save();

    // Delete the photo from the storage if it exists
    if (photoPath) {
      const photoFullPath = path.join(
        __dirname,
        "../uploads/profileImages",
        photoPath
      );
      fs.unlink(photoFullPath, (err) => {
        if (err) {
          console.error("Failed to delete photo:", err);
        }
      });
    }

    res.json({ message: "Profile photo removed successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// name
const addName = async (req, res) => {
  try {
    const { name } = req.body;

    // Check if the name already exists for another user
    const existingUser = await User.findOne({ name });

    if (existingUser) {
      return res.status(100).json({ error: "Name already exists" });
    }

    // Update the user's name if it's unique
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { name },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ message: "Name added successfully", user: updatedUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Controller method to update name
const updateName = async (req, res) => {
  try {
    const { name } = req.body;

    // Check if the name already exists for another user
    const existingUser = await User.findOne({ name });
    // Check if the name is unique or if it belongs to the current user
    if (
      existingUser &&
      existingUser._id.toString() !== req.user._id.toString()
    ) {
      return res.status(400).json({ error: "Name already exists" });
    }

    // Update the user's name if it's unique or if it's the same as the current user's name
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { name },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ message: "Name updated successfully", user: updatedUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getUserName = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("name");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// name

// password changing

// Change password controller method
const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const userId = req.user.id; // Assuming you have user ID from the authenticated request

  try {
    // Find user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the current password matches
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    // Hash the new password and update the user's password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.json({ message: "Password changed successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// password changing

module.exports = {
  uploadPhoto,
  updatePhoto,
  getProfile,
  removePhoto,
  updateName,
  addName,
  getUserName,
  changePassword,
};
