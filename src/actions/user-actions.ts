'use server'

import connectToDatabase from '@/lib/mongodb'
import User from '@/models/User'
import Booking from '@/models/Booking'
import PromoCode from '@/models/PromoCode'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { revalidatePath } from 'next/cache'
import bcrypt from 'bcryptjs'

export async function updateProfile(formData: {
  firstName?: string;
  lastName?: string;
  gender?: 'male' | 'female' | 'other';
  birthDate?: string;
  phone?: string;
  password?: string;
}) {
  const session = await getServerSession(authOptions)
  if (!session) return { success: false, error: 'Unauthorized Access' }

  try {
    await connectToDatabase()
    
    const updateData: any = { 
      ...formData, 
      birthDate: formData.birthDate ? new Date(formData.birthDate) : undefined 
    }

    if (formData.password) {
      const salt = await bcrypt.genSalt(10)
      updateData.password = await bcrypt.hash(formData.password, salt)
    }

    const result = await User.findByIdAndUpdate(
      (session.user as any).id,
      updateData,
      { new: true }
    )
    revalidatePath('/[locale]/dashboard')
    return { success: true, user: JSON.parse(JSON.stringify(result)) }
  } catch (err: any) {
    return { success: false, error: err.message }
  }
}

export async function getClientDashboardData() {
  const session = await getServerSession(authOptions)
  if (!session) return { success: false, error: 'Unauthorized Access' }

  try {
    await connectToDatabase()
    const userId = (session.user as any).id
    
    const [bookings, promos, user] = await Promise.all([
      Booking.find({ userId }).sort({ createdAt: -1 }).populate('vehicleId'),
      PromoCode.find({ isActive: true }).sort({ createdAt: -1 }),
      User.findById(userId)
    ])

    return {
      success: true,
      user: JSON.parse(JSON.stringify(user)),
      bookings: JSON.parse(JSON.stringify(bookings)),
      promos: JSON.parse(JSON.stringify(promos))
    }
  } catch (err: any) {
    return { success: false, error: err.message }
  }
}
