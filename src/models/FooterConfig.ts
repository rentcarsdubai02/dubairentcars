import mongoose, { Schema, model, models } from 'mongoose';

const QuickLinkSchema = new Schema({
  label: { type: String, default: '' },
  href:  { type: String, default: '' },
}, { _id: false });

const FooterConfigSchema = new Schema({
  // Singleton document — always one record
  singleton: { type: String, default: 'main', unique: true },

  // Logo
  logoUrl:     { type: String, default: '' },
  logoAlt:     { type: String, default: '' },

  // Description
  description:   { type: String, default: '' }, // Legacy/Fallback
  descriptionFr: { type: String, default: '' },
  descriptionEn: { type: String, default: '' },
  descriptionAr: { type: String, default: '' },

  // Social networks
  facebook:    { type: String, default: '' },
  instagram:   { type: String, default: '' },
  twitter:     { type: String, default: '' },
  tiktok:      { type: String, default: '' },
  website:     { type: String, default: '' },
  youtube:     { type: String, default: '' },
  linkedin:    { type: String, default: '' },

  // Quick links
  quickLinks:  { type: [QuickLinkSchema], default: [] },

  // Contact
  address:     { type: String, default: '' },
  mapUrl:      { type: String, default: '' },
  email:       { type: String, default: '' },
  phone:       { type: String, default: '' },
  whatsapp:    { type: String, default: '' },
  imo:         { type: String, default: '' },
  viber:       { type: String, default: '' },

  updatedAt: { type: Date, default: Date.now },
});

const FooterConfig = models.FooterConfig || model('FooterConfig', FooterConfigSchema);
export default FooterConfig;
