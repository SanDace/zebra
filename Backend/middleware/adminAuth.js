const jwt = require("jsonwebtoken");
const User = require("../models/user");

const adminAuth = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ error: "Token Required" });
  }

  const token = authorization.split(" ")[1];

  try {
    const { _id } = jwt.verify(token, process.env.SECRET);

    // Retrieve the user from the database
    const user = await User.findOne({ _id });

    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    // Check if the user has the role "admin"
    if (user.role !== "admin") {
      return res
        .status(403)
        .json({ error: "Forbidden: Insufficient permissions" });
    }

    // Set the authenticated user in the request object
    req.user = user;

    next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({ error: "Invalid Token!" });
  }
};

module.exports = adminAuth;
