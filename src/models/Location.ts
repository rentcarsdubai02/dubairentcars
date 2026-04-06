import mongoose, { Schema, model, models } from 'mongoose';

const LocationSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Location name is required'],
    unique: true
  },
  address: {
    type: String,
    required: [true, 'Address is required']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Location = models.Location || model('Location', LocationSchema);

export default Location;
