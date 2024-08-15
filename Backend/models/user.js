const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");
const validator = require("validator");

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
    },
    name: {
      unique: true,
      type: String,
      required: false,
    },
    photo: {
      type: String,
    },
  },
  { timestamps: true }
);

userSchema.statics.signup = async function (email, password, role) {
  if (!email || !password || !role) {
    throw Error("All fields are required.");
  }
  if (!validator.isEmail(email)) {
    throw Error("Not a valid email.");
  }

  if (!validator.isStrongPassword(password)) {
    throw Error(
      "The password should be at least 8 characters long and contain one uppercase letter."
    );
  }

  const lowerEmail = email.toLowerCase();

  const existingUser = await this.findOne({ email: lowerEmail }); // Fixed field name

  if (existingUser) {
    throw Error("Email already exists.");
  }
  const name = "";

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  const user = await this.create({ email: lowerEmail, password: hash, role ,name});

  return user;
};

userSchema.statics.login = async function (email, password) {
  if (!email || !password) {
    throw Error("All field required");
  }
  const lowerEmail = email.toLowerCase();
  const user = await this.findOne({ email:lowerEmail });

  if (!user) {
    throw Error(" Email Not Found");
  }

  const check = await bcrypt.compare(password, user.password);

  if (!check) {
    throw Error("Password did not match");
  }
  return user;
};
module.exports = mongoose.model("User", userSchema);
