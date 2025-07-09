import express from 'express';
import multer from 'multer';
import Prescription from '../models/prescriptionModel.js';
import { isAuth } from '../utils.js';

const prescriptionRouter = express.Router();

// Multer setup to store files in 'uploads' folder with unique filenames
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename(req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// POST upload prescription
prescriptionRouter.post(
  '/',
  isAuth,
  upload.single('file'), // multer middleware for single file with fieldname 'file'
  async (req, res) => {
    try {
      const newPrescription = new Prescription({
        user: req.user._id,
        product: req.body.productId,
        image: req.file.path, // path to uploaded file
      });
      const created = await newPrescription.save();
      res.status(201).send(created);
    } catch (err) {
      res.status(500).send({ message: err.message });
    }
  }
);

// GET all prescriptions (admin only)
prescriptionRouter.get(
  '/',
  isAuth,
  async (req, res) => {
    try {
      const list = await Prescription.find()
        .populate('user', 'name email')
        .populate('product', 'name');
      res.send(list);
    } catch (err) {
      res.status(500).send({ message: err.message });
    }
  }
);

export default prescriptionRouter;
