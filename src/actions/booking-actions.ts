'use server'

import connectToDatabase from "@/lib/mongodb"
import Booking from "@/models/Booking"
import VehicleV2 from "@/models/Vehicle"
import User from "@/models/User"
import { revalidatePath } from "next/cache"
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'

export async function createBooking(formData: {
  vehicleId: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  idNumber: string;
  startDate: Date;
  endDate: Date;
  pickupLocation: string;
  returnLocation: string;
  totalPrice: number;
}) {
  await connectToDatabase();
  
  const { getServerSession: gss } = await import('next-auth');
  const { authOptions: ao } = await import('@/lib/auth-options');
  const session = await gss(ao);
  
  const payload: any = {
    ...formData,
    status: 'pending'
  };

  if (session && session.user) {
     payload.userId = (session.user as any).id;
  }

  const newBooking = await Booking.create(payload);
  revalidatePath('/[locale]/services', 'page');
  revalidatePath('/[locale]/admin/fleet', 'page');
  
  return { 
    success: true, 
    bookingId: newBooking._id.toString(),
    booking: JSON.parse(JSON.stringify(newBooking)) 
  }
}

export async function getBookingById(id: string) {
   await connectToDatabase();
   const booking = await Booking.findById(id).populate('vehicleId');
   return JSON.parse(JSON.stringify(booking));
}

export async function getAllBookings() {
  const session = await getServerSession(authOptions)
  if (!session) throw new Error('Unauthorized')
  const role = (session.user as any).role
  if (!['super_admin', 'admin', 'agent'].includes(role)) throw new Error('Forbidden')

  await connectToDatabase()

  // Force model registration before any query (prevents Turbopack tree-shaking)
  const _v = VehicleV2
  const _u = User

  const bookings = await Booking.find({}).sort({ createdAt: -1 }).lean()

  // Manual population to avoid schema registry issues
  const enriched = await Promise.all(bookings.map(async (b: any) => {
    const vehicle = b.vehicleId ? await VehicleV2.findById(b.vehicleId).select('brand name images').lean() : null
    const user    = b.userId   ? await User.findById(b.userId).select('firstName lastName email').lean() : null
    return { ...b, vehicleId: vehicle, userId: user }
  }))

  return JSON.parse(JSON.stringify(enriched))
}

export async function updateBooking(id: string, data: {
  status?: string;
  paymentStatus?: string;
  notes?: string;
}) {
  const session = await getServerSession(authOptions)
  if (!session) throw new Error('Unauthorized')
  const role = (session.user as any).role
  if (!['super_admin', 'admin', 'agent'].includes(role)) throw new Error('Forbidden')

  await connectToDatabase()
  await Booking.findByIdAndUpdate(id, data, { new: true })

  revalidatePath('/[locale]/admin/statistics', 'page')
  revalidatePath('/[locale]/dashboard', 'page')
  return { success: true }
}

export async function deleteBooking(id: string) {
  const session = await getServerSession(authOptions)
  if (!session) throw new Error('Unauthorized')
  const role = (session.user as any).role
  if (!['super_admin', 'admin', 'agent'].includes(role)) throw new Error('Forbidden')

  await connectToDatabase()
  await Booking.findByIdAndDelete(id)

  revalidatePath('/[locale]/admin/statistics', 'page')
  revalidatePath('/[locale]/dashboard', 'page')
  return { success: true }
}
