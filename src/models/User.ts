import mongoose, { Schema, model, models } from 'mongoose';

const UserSchema = new Schema({
  firstName: {
    type: String,
    required: [true, 'First name is required'],
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
  },
  email: {
    type: String,
    unique: true,
    required: [true, 'Digital address is required'],
  },
  password: {
    type: String,
    required: false,
  },
  role: {
    type: String,
    enum: ['super_admin', 'admin', 'agent', 'client'],
    default: 'client',
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other'],
    required: false,
  },
  birthDate: {
    type: Date,
    required: false,
  },
  phone: {
    type: String,
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const User = models.User || model('User', UserSchema);

export default User;
