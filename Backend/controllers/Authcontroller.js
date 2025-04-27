const User = require("../models/user");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");

const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.SECRET, { expiresIn: "1D" });
};


// login
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.login(email, password);
    const token = createToken(user._id);

    res.status(200).json({ user, token });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

// register

const register = async (req, res) => {
  const { email, password, role } = req.body;
  try {
    const user = await User.signup(email, password, role);
    const token = createToken(user._id);
    res.status(200).json({ user, token });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};



// Controller function to fetch user data
const getUserData = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "not valid id" });
  }
  const user = await User.findById(id);
  if (!user) {
    return res.status(404).json({ error: "Not Found" });
  }
  res.status(200).json(user);
};

const sendEmail = async (req, res) => {
  const { email } = req.body;

  try {
    // Check if the email exists in the database
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "Email not found in the database" });
    }

    // Generate token with expiration time
    const token = jwt.sign({ email }, process.env.SECRET, { expiresIn: "1h" }); // Token expires in 1 hour

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "sandeshmaharjan1000@gmail.com", // Your Gmail email address
        pass: "riqy bfwj wysm laxe", // Your Gmail password or app-specific password
      },
    });
    const resetLink = `https://zebra-backend.onrender.com/reset-password/${token}`;
    const mailOptions = {
      from: "ecommerse1111@gmail.com", // Sender address
      to: email, // Receiver address
      subject: "Password Reset", // Subject line
      html: `
        <p>You have requested to reset your password.</p>
        <p>Click the following button to reset your password:</p>
        <p >
          <a href="${resetLink}" style="display:inline-block;background-color:#007bff;color:#fff;text-decoration:none;padding:10px 20px;border-radius:5px;">Reset Password</a>
        </p>
      `, // HTML body
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
        return res.status(500).json({ error: "Error sending reset email" });
      }
      console.log("Reset email sent:", info.response);
      res.status(200).json({
        message: "Reset email sent successfully!, Please check your Email  ",
      });
    });
  } catch (error) {
    console.error("Error checking email:", error);
    res.status(500).json({ error: "Error checking email" });
  }
};

const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.SECRET);

    const user = await User.findOne({ email: decoded.email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update user's password with the hashed password
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(400).json({ message: "Token expired" });
    }
    return res.status(400).json({ message: error.message });
  }
};

module.exports = { login, register, getUserData, sendEmail, resetPassword };
