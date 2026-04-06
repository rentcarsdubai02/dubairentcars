import mongoose, { Schema, model, models } from 'mongoose';

const ContactConfigSchema = new Schema({
  singleton: { type: String, default: 'main', unique: true },
  subtitle: { type: String, default: 'Establish a direct communication link with our HQ. Response time optimized to aerodynamic standards.' },
  subtitle_fr: { type: String, default: 'Établissez un lien de communication direct avec notre QG. Temps de réponse optimisé.' },
  subtitle_en: { type: String, default: 'Establish a direct communication link with our HQ. Response time optimized to aerodynamic standards.' },
  subtitle_ar: { type: String, default: 'أنشئ رابط اتصال مباشر بمركزنا الرئيسي. وقت استجابة سريع للغاية.' },
  phone: { type: String, default: '+1 (800) EDGE-DRV' },
  email: { type: String, default: 'hq@dubairentcars.xyz' },
  updatedAt: { type: Date, default: Date.now },
});

const ContactConfig = models.ContactConfig || model('ContactConfig', ContactConfigSchema);
export default ContactConfig;
