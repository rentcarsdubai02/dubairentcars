'use server'

import connectToDatabase from "@/lib/mongodb";
import ContactConfig from "@/models/ContactConfig";
import ContactMessage from "@/models/ContactMessage";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";

export async function getContactConfig() {
  try {
    await connectToDatabase();
    const config = (await ContactConfig.findOne({ singleton: 'main' }).lean()) || {};
    
    const defaultConfig = {
      subtitle_fr: 'Établissez un lien de communication direct avec notre QG.',
      subtitle_en: 'Establish a direct communication link with our HQ.',
      subtitle_ar: 'أنشئ رابط اتصال مباشر بمركزنا الرئيسي.'
    };

    const final = { ...defaultConfig, ...config };
    if (!final.subtitle_fr) final.subtitle_fr = defaultConfig.subtitle_fr;
    if (!final.subtitle_en) final.subtitle_en = defaultConfig.subtitle_en;
    if (!final.subtitle_ar) final.subtitle_ar = defaultConfig.subtitle_ar;

    return JSON.parse(JSON.stringify(final));
  } catch (error) {
    console.error("Failed to get contact config:", error);
    return null;
  }
}

export async function updateContactConfig(formData: FormData) {
  try {
    await connectToDatabase();
    
    const subtitle_fr = formData.get('subtitle_fr') as string;
    const subtitle_en = formData.get('subtitle_en') as string;
    const subtitle_ar = formData.get('subtitle_ar') as string;
    const phone = formData.get('phone') as string;
    const email = formData.get('email') as string;

    console.log("UPDATING CONTACT CONFIG ACTION STARTED:", { subtitle_fr, subtitle_en, subtitle_ar, phone, email });

    await ContactConfig.findOneAndUpdate(
      { singleton: 'main' },
      { 
        subtitle_fr, 
        subtitle_en, 
        subtitle_ar, 
        subtitle: subtitle_en, // Sync with original for safety
        phone, 
        email, 
        updatedAt: new Date() 
      },
      { upsert: true, new: true }
    );
    
    console.log("DB UPDATE SUCCESSFUL");

    revalidatePath('/', 'layout');
    revalidatePath('/[locale]/contact', 'page');
    revalidatePath('/[locale]/admin/contact', 'page');
    
    return { success: true };
  } catch (error) {
    console.error("Failed to update contact config:", error);
    return { success: false, error: "Failed to update contact config" };
  }
}

export async function sendMessage(formData: FormData) {
  try {
    await connectToDatabase();
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const message = formData.get('message') as string;

    if (!name || !email || !message) {
      return { success: false, error: "All fields are required" };
    }

    await ContactMessage.create({ name, email, message });
    return { success: true };
  } catch (error) {
    console.error("Failed to send message:", error);
    return { success: false, error: "Failed to send message" };
  }
}

export async function getContactMessages() {
  try {
    await connectToDatabase();
    const messages = await ContactMessage.find().sort({ createdAt: -1 });
    return JSON.parse(JSON.stringify(messages));
  } catch (error) {
    console.error("Failed to get messages:", error);
    return [];
  }
}

export async function deleteContactMessage(id: string) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== 'super_admin' && (session.user as any).role !== 'admin') {
    return { success: false, error: 'Unauthorized Matrix Access' };
  }

  try {
    await connectToDatabase();
    await ContactMessage.findByIdAndDelete(id);
    revalidatePath('/[locale]/admin/contact');
    return { success: true };
  } catch (error) {
    console.error("Failed to delete message:", error);
    return { success: false, error: "Failed to delete message" };
  }
}

export async function getUnreadMessagesCount() {
  try {
    await connectToDatabase();
    const count = await ContactMessage.countDocuments({ isRead: false });
    return count;
  } catch (error) {
    console.error("Failed to count unread messages:", error);
    return 0;
  }
}

export async function markMessagesAsRead() {
  try {
    await connectToDatabase();
    await ContactMessage.updateMany({ isRead: false }, { isRead: true });
  } catch (error) {
    console.error("Failed to mark messages as read:", error);
  }
}
