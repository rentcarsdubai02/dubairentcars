'use server'

import connectToDatabase from "@/lib/mongodb"
import VehicleV2 from "@/models/Vehicle"
import { revalidatePath } from "next/cache"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-options"

export async function createVehicle(formData: {
  name: string;
  brand: string;
  modelYear?: string;
  category?: string;
  pricePerDay: number;
  images: string[];
  kilometersIncluded: number;
  extraPricePerKm: number;
  deposit: number;
}) {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any).role === 'client') {
     throw new Error("Unauthorized Access - Operator clearance required")
  }

  await connectToDatabase();
  
  const newVehicle = await VehicleV2.create({
    ...formData,
    createdBy: (session.user as any).id
  });

  revalidatePath('/[locale]/services', 'page')
  revalidatePath('/[locale]/admin/fleet', 'page')
  return { success: true, vehicle: JSON.parse(JSON.stringify(newVehicle)) }
}

export async function deleteVehicle(vehicleId: string) {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any).role === 'client') {
     throw new Error("Unauthorized Access - Operator clearance required")
  }

  await connectToDatabase();
  
  const result = await VehicleV2.findByIdAndDelete(vehicleId);
  
  if (!result) {
    throw new Error("Vehicle node not found");
  }

  revalidatePath('/[locale]/services', 'page')
  revalidatePath('/[locale]/admin/fleet', 'page')
  return { success: true }
}

export async function updateVehicle(id: string, formData: {
  name?: string;
  brand?: string;
  modelYear?: string;
  category?: string;
  pricePerDay?: number;
  images?: string[];
  kilometersIncluded?: number;
  extraPricePerKm?: number;
  deposit?: number;
}) {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any).role === 'client') {
     throw new Error("Unauthorized Access")
  }

  await connectToDatabase();
  
  const result = await VehicleV2.findByIdAndUpdate(id, formData, { new: true });
  
  revalidatePath('/[locale]/services', 'page')
  revalidatePath('/[locale]/admin/fleet', 'page')
  return { success: true, vehicle: JSON.parse(JSON.stringify(result)) }
}

export async function updateVehicleStatus(vehicleId: string, status: string) {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any).role === 'client') {
     throw new Error("Unauthorized Access")
  }

  await connectToDatabase();
  
  const result = await VehicleV2.findByIdAndUpdate(vehicleId, { status }, { new: true });
  
  revalidatePath('/[locale]/admin/fleet', 'page')
  return { success: true, vehicle: JSON.parse(JSON.stringify(result)) }
}

export async function getVehicles() {
   await connectToDatabase();
   const vehicles = await VehicleV2.find({ status: 'active' }).sort({ createdAt: -1 });
   return JSON.parse(JSON.stringify(vehicles));
}

export async function getVehicleById(id: string) {
   await connectToDatabase();
   const vehicle = await VehicleV2.findById(id);
   return JSON.parse(JSON.stringify(vehicle));
}
