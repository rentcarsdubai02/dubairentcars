import mongoose, { Schema, model, models } from 'mongoose';

const BrandSchema = new Schema({
  name: { type: String, required: true },
  slug: { type: String },
  overrideUrl: { type: String },
  isOther: { type: Boolean, default: false },
  order: { type: Number, default: 0 },
  visible: { type: Boolean, default: true }
}, { timestamps: true });

const Brand = models.Brand || model('Brand', BrandSchema);
export default Brand;
