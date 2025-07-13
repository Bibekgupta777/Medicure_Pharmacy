import express from "express";
import path from "path";
import mongoose from "mongoose";
import dotenv from "dotenv";
import asyncHandler from "express-async-handler";
import cors from "cors";
import fs from "fs";
import { fileURLToPath } from "url";

import seedRouter from "./routes/seedRoutes.js";
import productRouter from "./routes/productRoutes.js";
import userRouter from "./routes/userRoutes.js";
import orderRouter from "./routes/orderRoutes.js";
import uploadRouter from "./routes/uploadRoutes.js";
import paymentRouter from "./routes/paymentRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";

import Order from "./models/orderModel.js";
import { isAuth, isAdmin } from "./utils.js";

dotenv.config();

// Setup __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure upload folder exists
const uploadPath = path.join(__dirname, "/uploads/prescriptions");
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

// Connect MongoDB
mongoose.set("strictQuery", false);
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection failed:", err.message));

// App init
const app = express();

// CORS setup
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files for uploaded prescriptions
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

// API routes
app.use("/api/uploads", uploadRouter);
app.use("/api/seed", seedRouter);
app.use("/api/products", productRouter);
app.use("/api/users", userRouter);
app.use("/api/orders", orderRouter);
app.use("/api/payment", paymentRouter);
app.use("/api/messages", messageRoutes);

// Admin route: fetch prescription data
app.get(
  "/api/admin/band-prescriptions",
  isAuth,
  isAdmin,
  asyncHandler(async (req, res) => {
    const orders = await Order.find()
      .populate("user", "name")
      .populate("orderItems.product", "name category");

    const prescriptions = [];

    for (const order of orders) {
      for (const item of order.orderItems) {
        // Check for "Band Product" and that prescription exists
        if (
          item.product &&
          item.product.category === "Band Product" &&
          item.prescription // ensure prescription was uploaded
        ) {
          prescriptions.push({
            _id: order._id + item._id, // unique key
            orderId: order._id,
            userName: order.user?.name || "Unknown",
            productName: item.product.name,
            quantity: item.quantity,
            prescriptionUrl: item.prescription,
            createdAt: order.createdAt,
            status: order.isDelivered ? "Delivered" : "Pending",
          });
        }
      }
    }

    res.json(prescriptions);
  })
);


// Serve React frontend
app.use(express.static(path.join(__dirname, "/frontend/build")));
app.get("*", (req, res) =>
  res.sendFile(path.join(__dirname, "/frontend/build/index.html"))
);

// Error handler
app.use((err, req, res, next) => {
  res.status(500).send({ message: err.message });
});

// Start server
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`✅ Server running at http://localhost:${port}`);
});
