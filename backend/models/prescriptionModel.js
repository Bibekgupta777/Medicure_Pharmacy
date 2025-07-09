import mongoose from 'mongoose';

const prescriptionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    image: { type: String, required: true }, // stores path to uploaded file
  },
  { timestamps: true }
);

const Prescription = mongoose.model('Prescription', prescriptionSchema);
export default Prescription;
