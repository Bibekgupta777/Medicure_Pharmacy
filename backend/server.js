import express from "express";
import path from "path";
import mongoose from "mongoose";
import dotenv from "dotenv";

import seedRouter from "./routes/seedRoutes.js";
import productRouter from "./routes/productRoutes.js";
import userRouter from "./routes/userRoutes.js";
import orderRouter from "./routes/orderRoutes.js";
import uploadRouter from "./routes/uploadRoutes.js";
import paymentRouter from "./routes/paymentRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";  // make sure filename matches exactly

dotenv.config();

mongoose.set("strictQuery", false);

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection failed:", err.message));

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API routes
app.use("/api/upload", uploadRouter);
app.use("/api/seed", seedRouter);
app.use("/api/products", productRouter);
app.use("/api/users", userRouter);
app.use("/api/orders", orderRouter);
app.use("/api/payment", paymentRouter);
app.use("/api/messages", messageRoutes);
  // your contact message API

// Serve frontend static files
const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, "/frontend/build")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "/frontend/build/index.html"));
});

// Error handler middleware
app.use((err, req, res, next) => {
  res.status(500).send({ message: err.message });
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`✅ Server running at http://localhost:${port}`);
});
