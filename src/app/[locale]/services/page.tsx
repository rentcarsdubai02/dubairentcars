import { getTranslations, setRequestLocale } from 'next-intl/server'
import { Link } from '@/i18n/routing'
import { Car, Zap, Gauge, ArrowRight, ArrowLeft, ShieldCheck, Clock, MapPin, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getVehicles } from "@/actions/vehicle-actions"

const PREDEFINED_BRANDS = [
  "rolls-royce", "bentley", "mercedes", "bmw", "audi", "lexus", "porsche", 
  "ferrari", "lamborghini", "bugatti", "maserati", "range rover", "mini john", "mclaren"
]

export default async function ServicesPage({ params, searchParams }: { params: Promise<{ locale: string }>, searchParams: Promise<{ brand?: string }> }) {
  const { locale } = await params
  const resolvedParams = await searchParams
  const rawBrand = Array.isArray(resolvedParams?.brand) ? resolvedParams?.brand[0] : resolvedParams?.brand
  const targetBrand = rawBrand || null

  setRequestLocale(locale)
  const t = await getTranslations('Services')

  // Fetch REAL vehicles from MongoDB
  let vehicles = await getVehicles()
  
  if (targetBrand) {
     const searchWord = targetBrand.toLowerCase().trim()
     vehicles = vehicles.filter((v: any) => {
        if (!v.brand) return false
        const dbBrand = v.brand.toLowerCase().trim()
        
        if (searchWord === 'other') {
           return !PREDEFINED_BRANDS.includes(dbBrand)
        }
        
        return dbBrand === searchWord || dbBrand.includes(searchWord) || searchWord.includes(dbBrand)
     })
  }

  const displayBrandTitle = targetBrand?.toLowerCase() === 'other' ? t('otherBrand') : targetBrand

  return (
    <main className="min-h-screen pt-32 pb-24 bg-background relative overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute top-0 left-0 w-full h-full -z-10">
        <div className="absolute top-0 right-0 w-1/2 h-screen bg-primary/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 left-0 w-1/3 h-screen bg-accent/5 blur-[100px] rounded-full" />
      </div>

      <div className="container px-6 mx-auto relative z-10">
        <div className="flex flex-col items-center text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.4em] rounded-full border border-primary/20 mb-6 animate-fade-in">
             {t('title')}
          </div>
          <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter uppercase leading-none mb-6">
            {targetBrand ? displayBrandTitle : t('luxury')} <span className="text-primary italic">{t('fleet')}</span>
          </h1>
          
          {targetBrand && (
            <Link href="/" className="inline-flex items-center gap-2 mb-8 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 text-xs font-black uppercase tracking-widest text-muted-foreground hover:bg-primary hover:text-black hover:border-primary transition-all duration-300">
              <ArrowLeft className="w-4 h-4" /> {t('back')}
            </Link>
          )}

          <p className="text-lg font-medium text-muted-foreground max-w-2xl opacity-60">
            {t('subtitle')}
          </p>
        </div>

        {vehicles.length === 0 ? (
          <div className="glass-panel p-20 rounded-[3rem] text-center bg-card/40 border-white/5">
             <Car className="w-16 h-16 text-muted-foreground/20 mx-auto mb-6" />
             <h3 className="text-2xl font-black uppercase tracking-tighter mb-2">{t('empty')}</h3>
             <p className="text-sm font-bold text-muted-foreground opacity-60">{t('noCars')}</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {vehicles.map((car: any) => (
              <Link key={car._id} href={`/services/${car._id}`} className="block group">
                <div className="relative glass-panel rounded-[2.5rem] bg-card/40 border-white/10 overflow-hidden hover:scale-[1.02] transition-all duration-500 hover:shadow-2xl hover:shadow-primary/20 cursor-pointer h-full">
                  <div className="h-64 relative overflow-hidden">
                    <img src={car.images?.[0] || '/placeholder-car.jpg'} alt={car.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-80" />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
                    <div className="absolute top-6 left-6 px-3 py-1 bg-primary/20 backdrop-blur-xl border border-primary/40 rounded-lg">
                      <span className="text-[10px] font-black text-primary uppercase tracking-widest">{car.category}</span>
                    </div>
                  </div>

                  <div className="p-10 space-y-8">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-primary mb-1">{car.brand}</h3>
                        <h2 className="text-3xl font-black italic tracking-tighter uppercase">{car.name}</h2>
                      </div>
                      <div className="text-right">
                         <span className="text-2xl font-black tracking-tight">{car.pricePerDay}€</span>
                         <span className="text-[10px] font-bold block text-muted-foreground uppercase mt-[-4px]">{t('perDay')}</span>
                      </div>
                    </div>



                    <div className="flex items-center justify-between pt-4 border-t border-white/5">
                      {car.location && car.location !== 'Dubai Hub' ? (
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60">
                          <MapPin className="w-3 h-3" /> {car.location}
                        </div>
                      ) : (
                        <div />
                      )}
                      <Button variant="ghost" className="text-xs font-black uppercase tracking-widest text-primary gap-2 group-hover:translate-x-2 transition-transform">
                        {t('rentNow')} <ArrowRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
