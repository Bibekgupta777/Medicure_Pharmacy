import express from 'express';
import multer from 'multer';
import path from 'path';
import { isAuth } from '../utils.js';
import { fileURLToPath } from 'url';

const uploadRouter = express.Router();

// __dirname for ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Multer storage: save to /uploads/prescriptions
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, path.join(__dirname, '../uploads/prescriptions'));
  },
  filename(req, file, cb) {
    const timestamp = Date.now();
    const sanitized = file.originalname.replace(/\s+/g, '-');
    cb(null, `${timestamp}-${sanitized}`);
  },
});

const upload = multer({ storage });

// POST /api/uploads/prescription
uploadRouter.post(
  '/prescription',
  isAuth,
  upload.single('file'),
  (req, res) => {
    if (!req.file) {
      return res.status(400).send({ message: 'No file uploaded' });
    }

    // Return the accessible URL to frontend
    const url = `/uploads/prescriptions/${req.file.filename}`;
    res.send({ url });
  }
);

export default uploadRouter;
