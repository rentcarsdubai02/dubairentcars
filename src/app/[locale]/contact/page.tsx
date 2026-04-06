import { setRequestLocale, getTranslations } from 'next-intl/server'
import { getContactConfig } from '@/actions/contact-actions'
import { getLocations } from '@/actions/location-actions'
import { Mail, Phone, MapPin, Send, Zap, ChevronRight, MessageSquare, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ContactForm } from '@/components/shared/contact-form'

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
   const { locale } = await params
   setRequestLocale(locale)
   const t = await getTranslations({ locale, namespace: 'Contact' })
   const config = await getContactConfig()
   const locations = await getLocations(true)

   return (
      <main className="min-h-screen pt-32 pb-24 bg-background">
         <div className="container px-6 mx-auto">
            <div className="flex flex-col lg:flex-row gap-12 items-stretch mb-24">
               {/* Form Section */}
               <div className="lg:w-2/3 glass-panel p-1 rounded-[2.5rem] border-2 border-white/10 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
                     <MessageSquare className="w-56 h-56" />
                  </div>
                  <div className="p-10 lg:p-16 bg-card/60 backdrop-blur-3xl space-y-12">
                     <div className="space-y-4">

                        <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight uppercase italic">
                           {t('commInterface').split(' ').slice(0, -1).join(' ')} <span className="text-primary italic">{t('commInterface').split(' ').slice(-1)}</span>
                        </h1>
                        <p className="max-w-md text-lg font-medium text-muted-foreground leading-relaxed">
                           {(locale === 'fr' ? config?.subtitle_fr : locale === 'ar' ? config?.subtitle_ar : config?.subtitle_en) || t('placeholderMessage')}
                        </p>
                     </div>

                     <ContactForm t={{
                        identityName: t('identityName'),
                        digitalAddress: t('digitalAddress'),
                        messageTransmission: t('messageTransmission'),
                        transmitSignal: t('transmitSignal'),
                        placeholderName: t('placeholderName'),
                        placeholderEmail: t('placeholderEmail'),
                        placeholderMessage: t('placeholderMessage'),
                        messageSent: t('messageSent'),
                        messageError: t('messageError')
                     }} />
                  </div>
               </div>

               {/* Info Bar Section */}
               <div className="lg:w-1/3 flex flex-col gap-6">
                  <div className="glass-panel p-10 rounded-[2.5rem] bg-card/40 flex flex-col justify-between h-1/2 border border-white/5 group hover:bg-white/10 transition-all">
                     <div className="space-y-10">
                        <h3 className="text-2xl font-black italic flex items-center gap-4">
                           {t('directLine')} <div className="h-px flex-1 bg-white/5" />
                        </h3>
                        <div className="space-y-8">
                           <div className="group cursor-default">
                              <div className="flex items-center gap-4 text-primary mb-3">
                                 <Phone className="w-5 h-5" />
                                 <span className="text-xs font-bold tracking-wider uppercase">{t('voiceComm')}</span>
                              </div>
                              <span className="text-2xl font-black tracking-tighter transition-all group-hover:text-primary animate-pulse">{config?.phone || "+1 (800) EDGE-DRV"}</span>
                           </div>
                           <div className="group cursor-default">
                              <div className="flex items-center gap-4 text-primary mb-3">
                                 <Mail className="w-5 h-5" />
                                 <span className="text-xs font-bold tracking-wider uppercase">{t('emailHub')}</span>
                              </div>
                              <span className="text-2xl font-black tracking-tighter transition-all group-hover:text-primary">{config?.email || "hq@dubairentcars.xyz"}</span>
                           </div>
                        </div>
                     </div>
                  </div>

                  <div className="glass-panel p-10 rounded-[2.5rem] bg-card/40 h-1/2 flex flex-col justify-between border border-white/5 overflow-hidden group hover:bg-white/10 transition-all">
                     <div className="space-y-10">
                        <h3 className="text-2xl font-black italic flex items-center gap-4">
                           {t('gpsHub')} <div className="h-px flex-1 bg-white/5" />
                        </h3>
                        <div className="space-y-4 max-h-[150px] overflow-auto pr-2 custom-scrollbar">
                           {locations.length > 0 ? locations.map((loc: any) => (
                              <a
                                 key={loc._id}
                                 href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(loc.address)}`}
                                 target="_blank"
                                 rel="noopener noreferrer"
                                 className="block space-y-1 border-b border-white/5 pb-4 last:border-0 last:pb-0 group/loc hover:bg-white/5 p-2 -mx-2 rounded-xl transition-all"
                              >
                                 <div className="flex items-center gap-4 text-primary mb-2 group-hover/loc:translate-x-1 transition-transform">
                                    <MapPin className="w-4 h-4" />
                                    <span className="text-xs font-bold tracking-wider uppercase">{loc.name}</span>
                                 </div>
                                 <span className="text-sm font-bold text-muted-foreground tracking-tight block pl-8 opacity-80 group-hover/loc:text-white transition-colors">{loc.address}</span>
                              </a>
                           )) : (
                              <div className="space-y-1">
                                 <div className="flex items-center gap-4 text-primary mb-3">
                                    <MapPin className="w-5 h-5" />
                                    <span className="text-xs font-bold tracking-wider uppercase">{t('gpsHub')}</span>
                                 </div>
                                 <span className="text-2xl font-black tracking-tighter block mb-2">40.7128° N, <br /> 74.0060° W</span>
                                 <span className="text-xs font-bold text-muted-foreground tracking-tight block">Carbon Hub 01 - Manhattan, NY</span>
                              </div>
                           )}
                        </div>
                     </div>

                  </div>
               </div>
            </div>

            {/* Global Hub Map Section Placeholder */}
            <div className="w-full h-32 glass-panel rounded-3xl border border-white/5 flex items-center justify-center opacity-40 hover:opacity-100 transition-opacity">
               <span className="text-xs font-bold uppercase tracking-[0.4em] animate-pulse">{t('globalNetworkHub')}</span>
            </div>
         </div>
      </main>
   )
}
