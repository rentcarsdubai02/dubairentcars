import mongoose, { Schema, model, models } from 'mongoose';

const VehicleSchema = new Schema({
  name: { type: String },
  brand: {
    type: String,
    required: [true, 'Brand is required'],
  },
  modelYear: { type: String },
  category: { type: String },
  pricePerDay: {
    type: Number,
    required: [true, 'Price is required'],
  },
  images: {
    type: [String], // Array of Cloudinary URLs. First is Cover.
    required: true,
    validate: [(val: string[]) => val.length > 0, 'At least one image is required']
  },
  kilometersIncluded: { type: Number, default: 250 },
  extraPricePerKm: { type: Number, default: 5 },
  deposit: { type: Number, default: 1000 },
  status: {
    type: String,
    enum: ['active', 'maintenance', 'in-transit', 'rented'],
    default: 'active',
  },
  location: {
    type: String,
    default: 'Dubai Hub',
  },
  description: { type: String, required: false },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const VehicleV2 = mongoose.models.VehicleV2 || mongoose.model('VehicleV2', VehicleSchema, 'vehicles');

export default VehicleV2;
