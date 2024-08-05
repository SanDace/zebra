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
    },
    photo: {
      type: String,
    },
  },
  { timestamps: true }
);

userSchema.statics.signup = async function (email, password, role) {
  if (!email || !password || !role) {
    throw Error("All fields require");
  }
  if (!validator.isEmail(email)) {
    throw Error("Not a Valid Email");
  }

  if (!validator.isStrongPassword(password)) {
    throw Error(
      `The Password should be at least 8 characters long and contain one uppercase letter`
    );
  }

  const exit = await this.findOne({ email });

  if (exit) {
    throw Error("Email already exists");
  }

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  const user = await this.create({ email, password: hash, role, name });

  return user;
};

userSchema.statics.login = async function (email, password) {
  if (!email || !password) {
    throw Error("All field required");
  }

  const user = await this.findOne({ email });

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
