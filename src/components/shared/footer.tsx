import { getTranslations } from 'next-intl/server'
import connectToDatabase from '@/lib/mongodb'
import FooterConfig from '@/models/FooterConfig'
import { Link } from '@/i18n/routing'
import Image from 'next/image'
import {
  Globe, Share2, Send,
  MapPin, Mail, Phone, MessageCircle, Video, Link2, LayoutTemplate
} from 'lucide-react'

// Force the footer to always fetch fresh data from DB
export const dynamic = 'force-dynamic'
export const revalidate = 0

async function getFooterConfig() {
  try {
    await connectToDatabase()
    // Using lean() and making sure we get a plain object
    const cfg = await FooterConfig.findOne({ singleton: 'main' }).lean()
    if (!cfg) {
      const newCfg = await FooterConfig.create({ singleton: 'main' })
      return JSON.parse(JSON.stringify(newCfg))
    }
    return JSON.parse(JSON.stringify(cfg))
  } catch (error) {
    console.error('Footer fetch error:', error)
    return {}
  }
}

export async function Footer({ locale }: { locale?: string }) {
  const [t, tn] = await Promise.all([
    getTranslations('Footer'),
    getTranslations('Navigation')
  ])
  const cfg = await getFooterConfig()
  const currentYear = new Date().getFullYear()

  // Helper to translate label if it matches a key in Navigation
  const getTranslatedLabel = (label: string) => {
    const key = label.toLowerCase().trim()
    
    // Maps for common translations
    if (key === 'home' || key === 'accueil') return tn('home')
    if (key === 'about' || key === 'à propos' || key === 'a propos') return tn('about')
    if (key === 'services' || key === 'our fleet' || key === 'nos flotte' || key === 'flotte' || key === 'fleet') return tn('services')
    if (key === 'contact') return tn('contact')
    
    return label
  }

  const socials = [
    { key: 'facebook',  icon: <Globe  className="h-5 w-5" />, label: 'Facebook' },
    { key: 'instagram', icon: <Share2 className="h-5 w-5" />, label: 'Instagram' },
    { key: 'twitter',   icon: <Send   className="h-5 w-5" />, label: 'Twitter' },
    { key: 'tiktok',    icon: <Video     className="h-5 w-5" />, label: 'TikTok' },
    { key: 'website',   icon: <Globe     className="h-5 w-5" />, label: t('website') },
    { key: 'youtube',   icon: <Video     className="h-5 w-5" />, label: 'YouTube' },
    { key: 'linkedin',  icon: <LayoutTemplate className="h-5 w-5" />, label: 'LinkedIn' },
  ].filter(s => cfg[s.key])

  const contacts = [
    { key: 'address',  icon: <MapPin         className="h-4 w-4" />, label: t('address'),  href: cfg.mapUrl || undefined },
    { key: 'email',    icon: <Mail           className="h-4 w-4" />, label: t('email'),    href: `mailto:${cfg.email}` },
    { key: 'phone',    icon: <Phone          className="h-4 w-4" />, label: t('phone'),      href: `tel:${cfg.phone}` },
    { key: 'whatsapp', icon: <MessageCircle  className="h-4 w-4" />, label: t('whatsapp'), href: `https://wa.me/${(cfg.whatsapp || '').replace(/\D/g, '')}` },
    { key: 'imo',      icon: <MessageCircle  className="h-4 w-4" />, label: t('imo'),      href: undefined },
    { key: 'viber',    icon: <Video          className="h-4 w-4" />, label: t('viber'),    href: `viber://chat?number=${(cfg.viber || '').replace(/\D/g, '')}` },
  ].filter(c => cfg[c.key])

  const quickLinks: { label: string; href: string }[] = (cfg.quickLinks || []).filter(
    (l: any) => l.label && l.href
  )

  // Use localized description based on site locale
  let localizedDescription = cfg.description; // fallback
  if (locale === 'fr') localizedDescription = cfg.descriptionFr || cfg.description;
  else if (locale === 'ar') localizedDescription = cfg.descriptionAr || cfg.description;
  else localizedDescription = cfg.descriptionEn || cfg.description;

  const hasLeft   = !!(cfg.logoUrl || localizedDescription || socials.length > 0)
  const hasLinks  = quickLinks.length > 0
  const hasContact = contacts.length > 0

  return (
    <footer className="relative bg-background pt-24 pb-12 px-6 md:px-12 mt-32 border-t border-white/5 overflow-hidden">
      {/* Glow */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-20">
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[150px]" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12">

          {/* Left column — Logo + Description + Socials */}
          {hasLeft && (
            <div className="lg:col-span-3 space-y-8">
              {/* Logo */}
              <Link href="/" className="inline-flex group">
                <Image
                  src={cfg.logoUrl || "/Logo dubai rent cars3.png"}
                  alt={cfg.logoAlt || 'Logo'}
                  width={160}
                  height={60}
                  className="object-contain h-14 w-auto transition-opacity group-hover:opacity-80"
                />
              </Link>

              {/* Description */}
              <p className="text-muted-foreground max-w-sm text-sm font-medium leading-relaxed opacity-80 whitespace-pre-wrap">
                {localizedDescription}
              </p>

              {/* Social networks */}
              {socials.length > 0 && (
                <div className="flex flex-wrap items-center gap-4">
                  {socials.map(s => (
                    <a
                      key={s.key}
                      href={cfg[s.key]}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={s.label}
                      className="text-muted-foreground hover:text-primary transition-all hover:scale-110"
                    >
                      {s.icon}
                    </a>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Quick Links */}
          {hasLinks && (
            <div className="lg:col-span-1 space-y-6">
              <h4 className="text-sm font-black uppercase tracking-[0.3em] text-primary flex items-center gap-2">
                <Link2 className="w-3.5 h-3.5" /> {t('quickLinks')}
              </h4>
              <ul className="space-y-3">
                {quickLinks.map((link, i) => (
                  <li key={i}>
                    <Link
                      href={link.href as any}
                      className="text-muted-foreground hover:text-foreground transition-all text-sm font-bold uppercase tracking-widest hover:translate-x-1 inline-block"
                    >
                      {getTranslatedLabel(link.label)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Contact */}
          {hasContact && (
            <div className="lg:col-span-2 space-y-6">
              <h4 className="text-sm font-black uppercase tracking-[0.3em] text-primary flex items-center gap-2">
                <Phone className="w-3.5 h-3.5" /> {t('contact')}
              </h4>
              <ul className="space-y-4">
                {contacts.map(c => {
                  const content = (
                    <span className="flex items-start gap-3 text-sm font-semibold text-muted-foreground leading-snug">
                      <span className="text-primary mt-0.5 shrink-0">{c.icon}</span>
                      <span>
                        <span className="text-xs font-black uppercase tracking-widest opacity-50 block">{c.label}</span>
                        {cfg[c.key]}
                      </span>
                    </span>
                  )
                  return (
                    <li key={c.key}>
                      {c.href ? (
                        <a
                          href={c.href}
                          target={c.key === 'address' || c.key === 'whatsapp' ? '_blank' : undefined}
                          rel="noopener noreferrer"
                          className="hover:text-primary transition-colors"
                        >
                          {content}
                        </a>
                      ) : content}
                    </li>
                  )
                })}
              </ul>
            </div>
          )}
        </div>

        {/* Bottom bar */}
        <div className="mt-20 pt-10 border-t border-white/5 flex justify-center items-center">
          <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/40 text-center">
            © {currentYear} Dubai Rent Cars. {t('allRightsReserved')}
          </p>
        </div>
      </div>
    </footer>
  )
}
