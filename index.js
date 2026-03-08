require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");
// const connectDB = require("./config/db");
const { secret } = require("./config/secret");

const { connectDB, sequelize } = require("./config/db");

const PORT = secret.port || 7000;
const morgan = require("morgan");

// error handler
const globalErrorHandler = require("./middleware/global-error-handler");
// routes
const userRoutes = require("./routes/user.routes");
// const categoryRoutes = require("./routes/category.routes");
// const brandRoutes = require("./routes/brand.routes");
// const userOrderRoutes = require("./routes/user.order.routes");
// const productRoutes = require("./routes/product.routes");
// const orderRoutes = require("./routes/order.routes");
// const couponRoutes = require("./routes/coupon.routes");
// const reviewRoutes = require("./routes/review.routes");
const adminRoutes = require("./routes/admin.routes");
const uploadRouter = require('./routes/uploadFile.routes');
// const cloudinaryRoutes = require("./routes/cloudinary.routes");

// middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use(express.static(path.join(__dirname, "public")));

// connect database
connectDB();

app.use("/uploads", express.static(path.join(__dirname, "public/uploads")));


app.use("/api/user", userRoutes);
// app.use("/api/category", categoryRoutes);
// app.use("/api/brand", brandRoutes);
// app.use("/api/product", productRoutes);
app.use('/api/upload', uploadRouter);
// app.use("/api/order", orderRoutes);
// app.use("/api/coupon", couponRoutes);
// app.use("/api/user-order", userOrderRoutes);
// app.use("/api/review", reviewRoutes);
// app.use("/api/cloudinary", cloudinaryRoutes);
app.use("/api/admin", adminRoutes);

app.use("/api/category-types", require("./routes/categoryType.routes"));
app.use("/api/categories", require("./routes/category.routes"));
app.use("/api/courses", require("./routes/course.routes"));
app.use("/api/courses-material", require("./routes/courseMaterial.routes"));
app.use("/api/free-resources", require("./routes/resource.routes"));
app.use("/api/career-counselling", require("./routes/counselling.routes"));
app.use("/api/banner", require("./routes/banner.routes"));
app.use("/api/achievements", require("./routes/achievement.routes"));
app.use(
  "/api/free-resource-materials",
  require("./routes/resourceMaterial.routes")
);
app.use(
  "/api/career-counselling-form",
  require("./routes/counsellingForm.routes")
);

// root route
app.get("/", (req, res) => res.send("Apps worked successfully"));
// app.use("/uploads", express.static(path.join(__dirname, "public/uploads")));

// app.get("/test-image", (req, res) => {
//   res.sendFile(path.join(__dirname, "public/uploads/images/1743961088770-3974-daniele-levis-pelusi-jTknOGI18us-unsplash.jpg"));
// });
// console.log("Serving from:", path.join(__dirname, "public/uploads"));

// app.listen(PORT, () => console.log(`server running on port ${PORT}`));

app.use(express.static(path.join(__dirname, "out")));

// Redirect all other requests to index.html (for routing to work)
//app.get("*", (req, res) => {
//  res.sendFile(path.join(__dirname, "out", "index.html"));
//});

(async () => {
  await connectDB();

  // Sync DB (creates tables if not exist)
  // await sequelize.sync({ alter: true }); // or { force: true } for drop+create
  sequelize.sync;

  // Test route

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
})();

// global error handler
app.use(globalErrorHandler);
//* handle not found
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: "Not Found",
    errorMessages: [
      {
        path: req.originalUrl,
        message: "API Not Found",
      },
    ],
  });
  next();
});

module.exports = app;