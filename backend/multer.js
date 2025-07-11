import express from "express";
import multer from "multer";
import path from "path";

const upload = multer({
  dest: "uploads/", // Ensure this exists and is writable
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

const uploadRouter = express.Router();

uploadRouter.post("/prescription", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).send({ message: "No file uploaded" });
  }

  // You can modify the URL if you serve statically or use CDN
  res.send({ url: `/uploads/${req.file.filename}` });
});

export default uploadRouter;
