import mongoose, { Schema, model, models } from 'mongoose';

const BookingSchema = new Schema({
  vehicleId: {
    type: Schema.Types.ObjectId,
    ref: 'Vehicle',
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: false, // Optional for guests, mandatory for registered clients
  },
  clientName: {
    type: String,
    required: [true, 'Client name is required'],
  },
  clientEmail: {
    type: String,
    required: [true, 'Email is required'],
  },
  clientPhone: {
    type: String,
    required: [true, 'Phone is required'],
  },
  idNumber: {
    type: String,
    required: [true, 'ID or Passport number is required'],
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  pickupLocation: {
    type: String,
    default: 'Dubai Agency Center',
  },
  returnLocation: {
    type: String,
    default: 'Dubai Agency Center',
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'refused', 'completed', 'confirmed', 'cancelled'],
    default: 'pending',
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'refunded', 'failed'],
    default: 'pending',
  },
  notes: {
    type: String,
    default: '',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Booking = models.Booking || model('Booking', BookingSchema);

export default Booking;
