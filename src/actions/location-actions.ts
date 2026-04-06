'use server'

import connectToDatabase from '@/lib/mongodb'
import Location from '@/models/Location'
import { revalidatePath } from 'next/cache'
import { getServerSession } from 'next-auth'
import { authOptions } from "@/lib/auth-options"

export async function getLocations(onlyActive = false) {
  try {
    await connectToDatabase()
    const query = onlyActive ? { isActive: true } : {}
    const locations = await Location.find(query).sort({ name: 1 })
    return JSON.parse(JSON.stringify(locations))
  } catch (err) {
    console.error(err)
    return []
  }
}

export async function addLocation(formData: { name: string; address: string }) {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any).role !== 'super_admin' && (session.user as any).role !== 'admin') {
    return { success: false, error: 'Unauthorized Matrix Access' }
  }

  try {
    await connectToDatabase()
    const newLocation = await Location.create(formData)
    revalidatePath('/[locale]/admin/locations', 'page')
    revalidatePath('/[locale]/services', 'layout')
    return { success: true, location: JSON.parse(JSON.stringify(newLocation)) }
  } catch (err: any) {
    return { success: false, error: err.message }
  }
}

export async function deleteLocation(id: string) {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any).role !== 'super_admin' && (session.user as any).role !== 'admin') {
    return { success: false, error: 'Unauthorized Matrix Access' }
  }

  try {
    await connectToDatabase()
    await Location.findByIdAndDelete(id)
    revalidatePath('/[locale]/admin/locations', 'page')
    return { success: true }
  } catch (err: any) {
    return { success: false, error: err.message }
  }
}

export async function toggleLocationStatus(id: string, currentStatus: boolean) {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any).role !== 'super_admin' && (session.user as any).role !== 'admin') {
    return { success: false, error: 'Unauthorized Matrix Access' }
  }

  try {
    await connectToDatabase()
    await Location.findByIdAndUpdate(id, { isActive: !currentStatus })
    revalidatePath('/[locale]/admin/locations', 'page')
    return { success: true }
  } catch (err: any) {
    return { success: false, error: err.message }
  }
}
