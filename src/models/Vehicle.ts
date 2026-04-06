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
  specs: {
    torque: String,
    topSpeed: String,
    acceleration: String, 
    power: String, 
  },
  status: {
    type: String,
    enum: ['active', 'maintenance', 'in-transit', 'rented'],
    default: 'active',
  },
  location: {
    type: String,
    default: 'Dubai Hub',
  },
  description: {
    type: String, // Multilingual description could be an object, but we'll start simple
    required: true,
  },
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

const Vehicle = models.Vehicle || model('Vehicle', VehicleSchema);

export default Vehicle;
