'use server'

import connectToDatabase from '@/lib/mongodb'
import PromoCode from '@/models/PromoCode'
import { revalidatePath } from 'next/cache'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'

export async function getPromos() {
  try {
    await connectToDatabase()
    const promos = await PromoCode.find().sort({ createdAt: -1 })
    return JSON.parse(JSON.stringify(promos))
  } catch (err) {
    console.error(err)
    return []
  }
}

export async function addPromo(formData: { code: string; discount: number }) {
  const session = await getServerSession(authOptions)
  const role = (session?.user as any)?.role
  if (!session || (role !== 'super_admin' && role !== 'admin' && role !== 'agent')) {
    return { success: false, error: 'Unauthorized Matrix Access' }
  }

  try {
    await connectToDatabase()
    const newPromo = await PromoCode.create({
       ...formData,
       createdBy: (session.user as any).id
    })
    revalidatePath('/[locale]/admin/promos', 'page')
    revalidatePath('/[locale]/dashboard', 'page')
    return { success: true, promo: JSON.parse(JSON.stringify(newPromo)) }
  } catch (err: any) {
    return { success: false, error: err.message }
  }
}

export async function deletePromo(id: string) {
  const session = await getServerSession(authOptions)
  const role = (session?.user as any)?.role
  if (!session || (role !== 'super_admin' && role !== 'admin' && role !== 'agent')) {
    return { success: false, error: 'Unauthorized Matrix Access' }
  }

  try {
    await connectToDatabase()
    await PromoCode.findByIdAndDelete(id)
    revalidatePath('/[locale]/admin/promos', 'page')
    revalidatePath('/[locale]/dashboard', 'page')
    return { success: true }
  } catch (err: any) {
    return { success: false, error: err.message }
  }
}

export async function togglePromoStatus(id: string, currentStatus: boolean) {
  const session = await getServerSession(authOptions)
  const role = (session?.user as any)?.role
  if (!session || (role !== 'super_admin' && role !== 'admin' && role !== 'agent')) {
    return { success: false, error: 'Unauthorized Matrix Access' }
  }

  try {
    await connectToDatabase()
    await PromoCode.findByIdAndUpdate(id, { isActive: !currentStatus })
    revalidatePath('/[locale]/admin/promos', 'page')
    revalidatePath('/[locale]/dashboard', 'page')
    return { success: true }
  } catch (err: any) {
    return { success: false, error: err.message }
  }
}

export async function validatePromoCode(codeStr: string) {
  try {
    await connectToDatabase()
    const promos = await PromoCode.find({ isActive: true })
    const promo = promos.find((p: any) => p.code.toLowerCase() === codeStr.toLowerCase().trim())
    
    if (!promo) {
       return { success: false, error: 'Invalid or inactive promo code.' }
    }

    return { 
      success: true, 
      discount: promo.discount,
      code: promo.code // Return standardized exact code
    }
  } catch (err: any) {
    return { success: false, error: 'Verification failed.' }
  }
}
