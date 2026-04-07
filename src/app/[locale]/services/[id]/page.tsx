import { getTranslations, setRequestLocale } from 'next-intl/server'
import { 
  Zap, 
  Gauge, 
  MapPin, 
  Calendar, 
  ChevronRight, 
  ArrowLeft,
  Activity,
  Award,
  ShieldCheck,
  CreditCard,
  Info
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { getVehicleById } from "@/actions/vehicle-actions"
import { Link } from '@/i18n/routing'
import { notFound } from 'next/navigation'

import { VehicleGallery } from "@/components/shared/vehicle-gallery"

export default async function VehicleDetailsPage({ params }: { params: Promise<{ locale: string, id: string }> }) {
  const { locale, id } = await params
  setRequestLocale(locale)
  const t = await getTranslations('Rental')
  const ts = await getTranslations('Services')

  const car = await getVehicleById(id)
  if (!car) notFound()

  return (
    <main className="min-h-screen pt-24 sm:pt-32 pb-16 sm:pb-24 bg-background relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 right-0 w-[60%] h-screen bg-primary/5 blur-[150px] -z-10" />

      <div className="container px-4 sm:px-6 mx-auto relative z-10">
        <div className="mb-8 sm:mb-12">
           <Link href="/services" className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors group">
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> {ts('backMatrix')}
           </Link>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 sm:gap-16 items-start">
          {/* Immersive Gallery Component */}
          <div className="space-y-6">
             <VehicleGallery images={car.images} name={car.name} />

             <div className="glass-panel p-6 sm:p-10 rounded-[2rem] sm:rounded-[2.5rem] bg-primary/5 border-primary/20">
                <h3 className="text-sm font-black uppercase tracking-widest text-primary mb-4 flex items-center gap-2">
                   <ShieldCheck className="w-4 h-4" /> {ts('fullCoverage')}
                </h3>
                <p className="text-xs font-semibold text-muted-foreground leading-relaxed">{ts('included')}</p>
             </div>
          </div>

          {/* Specs and Rental Action */}
          <div className="space-y-12">
             <div className="space-y-1">
                <div className="text-primary text-[10px] font-black uppercase tracking-[0.4em] mb-4 flex items-center gap-2 animate-pulse">
                   <Activity className="w-3 h-3" /> {ts('unitStatus')}
                </div>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 sm:gap-4">
                   <div>
                      <h3 className="text-base sm:text-xl font-bold text-muted-foreground opacity-60 uppercase tracking-tighter italic">{car.brand} {car.modelYear}</h3>
                      <h2 className="text-4xl sm:text-6xl font-black italic tracking-tighter uppercase break-words">{car.name}</h2>
                   </div>
                    <div className="text-left sm:text-right">
                       <div className="text-4xl sm:text-5xl font-black tracking-tighter animate-fade-in">{car.pricePerDay}€</div>
                        <div className="text-[10px] sm:text-xs font-black text-muted-foreground uppercase opacity-40">{ts('perCycle')}</div>
                    </div>
                </div>
             </div>

             <div className="grid grid-cols-2 gap-6">
                {[
                  { l: ts('kmIncluded'), v: car.kilometersIncluded + " Km", i: <Zap className="w-5 h-5" />, c: "text-primary" },
                  { l: ts('extraKmFee'), v: car.extraPricePerKm + " €", i: <Gauge className="w-5 h-5" />, c: "text-accent" },
                  { l: ts('deposit'), v: car.deposit + " €", i: <Activity className="w-5 h-5" />, c: "text-yellow-400" },
                  { l: ts('statusLabel'), v: (car.status || 'active').toUpperCase(), i: <Award className="w-5 h-5" />, c: "text-green-500" },
                ].map((spec, i) => (
                  <div key={i} className="glass-panel p-4 sm:p-8 rounded-2xl sm:rounded-3xl bg-card border-white/5 flex flex-col justify-between h-32 sm:h-40">
                     <div className={spec.c}>
                        {spec.i}
                     </div>
                     <div>
                        <div className="text-lg sm:text-xl font-black tracking-tight">{spec.v}</div>
                        <div className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-40">{spec.l}</div>
                     </div>
                  </div>
                ))}
             </div>

              <div className="glass-panel p-10 rounded-[2.5rem] bg-card/60 border-white/10 space-y-6">
                 <div className="p-6 rounded-[2rem] bg-amber-500/10 border border-amber-500/20 flex gap-4 items-start">
                    <Info className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                    <p className="text-xs font-medium text-amber-200/80 leading-relaxed italic">
                       {t('depositRemark')}
                    </p>
                 </div>

                <div className="flex items-center gap-6 pt-8 border-t border-white/5">
                   <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground opacity-60">
                      <MapPin className="w-4 h-4" /> DUBAI HUB 01
                   </div>
                   <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground opacity-60">
                      <Calendar className="w-4 h-4" /> {car.modelYear} {ts('model')}
                   </div>
                </div>

                <Link href={`/services/${id}/rent`} className="block group">
                   <Button className="w-full h-20 rounded-[1.5rem] bg-primary text-primary-foreground font-black text-xl uppercase tracking-widest shadow-2xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all">
                      <span className="flex items-center gap-4">
                         {t('rentNow')} <ChevronRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                      </span>
                   </Button>
                </Link>

                <div className="flex justify-center gap-4 opacity-30 pt-4">
                   <CreditCard className="w-5 h-5" />
                   <ShieldCheck className="w-5 h-5" />
                   <Zap className="w-5 h-5" />
                </div>
             </div>
          </div>
        </div>
      </div>
    </main>
  )
}
