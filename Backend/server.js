require("dotenv").config();
const express = require("express");
const path = require("path");
const app = express();
const mongoose = require("mongoose");
const userRoute = require("./routes/auth");
const productRoute = require("./routes/product");
const discountRoute = require("./routes/discount");
const categoryRoute = require("./routes/category");
const addressRoute = require("./routes/address");
const commentRoute = require("./routes/comment");
const ratingRoute = require("./routes/rating");
const esewaRoute = require("./routes/esewa");
const profileRoute = require("./routes/profile");
const apiRoutes = require("./routes/api");
const bodyParser = require("body-parser");
const Product = require("./models/product");
const purchasedItem = require("./routes/purchasedItem");
const requireAuth = require("./middleware/requireAuth");
const cors = require("cors");

const crosOrigin = {
  origin: "*",
  credential: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
};

app.options("", cros(crosOrigin));
app.use(cors(crosOrigin));
// Middleware
app.use(express.json());
app.use(bodyParser.json());

// Serve static files from the React app's build directory
app.use(express.static(path.join(__dirname, "build")));
app.use(express.static("uploads"));
// Serve images
app.use("/images", express.static(path.join(__dirname, "/uploads/images/")));
app.use(
  "/profileImages",
  express.static(path.join(__dirname, "/uploads/profileImages/"))
);

// Routes
app.use("/auth", userRoute);
app.use("/products", productRoute);
app.use("/discounts", discountRoute);
app.use("/purchasedItem", purchasedItem);
app.use("/address", addressRoute);
app.use("/category", categoryRoute);
app.use("/comment", commentRoute);
app.use("/rating", ratingRoute);
app.use("/profile", profileRoute);
app.use("/esewa", esewaRoute);
app.use("/api", apiRoutes);

// Create a route to search items
app.use("/", (req, res) => {
  res.json;
  ({ message: "welcome to vercel" });
});
app.get("/search", async (req, res) => {
  const query = req.query.q;
  try {
    const products = await Product.find({
      $or: [
        { name: { $regex: query, $options: "i" } },
        { details: { $regex: query, $options: "i" } },
      ],
    });
    res.json(products);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.js"));
});

mongoose
  .connect(process.env.MONGODB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log("Server is running on port", process.env.PORT);
    });
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });
