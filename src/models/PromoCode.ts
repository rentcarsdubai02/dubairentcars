import mongoose, { Schema, model, models } from 'mongoose';

const PromoCodeSchema = new Schema({
  code: {
    type: String,
    required: [true, 'Code designation required'],
    unique: true
  },
  discount: {
    type: Number,
    required: [true, 'Percentage or Amount required']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  targetAudience: {
    type: String,
    enum: ['all', 'bronze', 'silver', 'gold', 'elite'],
    default: 'all'
  },
  expiryDate: {
    type: Date,
    required: false
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const PromoCode = models.PromoCode || model('PromoCode', PromoCodeSchema);

export default PromoCode;
