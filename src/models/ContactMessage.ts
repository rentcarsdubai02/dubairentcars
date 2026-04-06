import mongoose, { Schema, model, models } from 'mongoose';

const ContactMessageSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  message: { type: String, required: true },
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

const ContactMessage = models.ContactMessage || model('ContactMessage', ContactMessageSchema);
export default ContactMessage;
