'use server'

import connectToDatabase from "@/lib/mongodb"
import User from "@/models/User"
import { revalidatePath } from "next/cache"
import bcrypt from "bcryptjs"

export async function createStaffUser(formData: {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: 'admin' | 'agent';
}) {
  await connectToDatabase();
  
  // Check if exists
  const existing = await User.findOne({ email: formData.email.toLowerCase() });
  if (existing) throw new Error("Email already registered");

  // Hash initial password
  const hashedPassword = await bcrypt.hash('password123', 12);

  const newUser = await User.create({
    firstName: formData.firstName,
    lastName: formData.lastName,
    email: formData.email.toLowerCase(),
    password: hashedPassword,
    phone: formData.phone,
    role: formData.role
  });

  revalidatePath('/[locale]/admin/users', 'page');
  return { success: true, user: JSON.parse(JSON.stringify(newUser)) };
}

export async function deleteStaffUser(userId: string) {
  await connectToDatabase();
  
  const result = await User.findByIdAndDelete(userId);
  
  if (!result) {
    throw new Error("User not found");
  }

  revalidatePath('/[locale]/admin/users', 'page');
  return { success: true };
}
