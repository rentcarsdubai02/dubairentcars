'use client'

import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { Car, Layers } from "lucide-react"
import { Link } from '@/i18n/routing'

const BRANDS = [
  { name: "Rolls-Royce", slug: "rollsroyce" },
  { name: "Bentley", slug: "bentley" },
  { name: "Mercedes", overrideUrl: "https://www.carlogos.org/car-logos/mercedes-benz-logo.png" },
  { name: "BMW", slug: "bmw" },
  { name: "Audi", slug: "audi" },
  { name: "Lexus", overrideUrl: "https://www.carlogos.org/car-logos/lexus-logo.png" },
  { name: "Porsche", slug: "porsche" },
  { name: "Ferrari", slug: "ferrari" },
  { name: "Lamborghini", slug: "lamborghini" },
  { name: "Bugatti", slug: "bugatti" },
  { name: "Maserati", slug: "maserati" },
  { name: "Range Rover", overrideUrl: "data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 50'%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial, sans-serif' font-weight='900' font-size='38' letter-spacing='0.15em' fill='black'%3ERANGE ROVER%3C/text%3E%3C/svg%3E" },
  { name: "Tesla", slug: "tesla" },
  { name: "Jaguar", overrideUrl: "https://www.carlogos.org/logo/Jaguar-logo.png" },
  { name: "Other", isOther: true }
]

export function BrandGrid() {
  const t = useTranslations('Fleet')
  return (
    <section id="brands" className="container mx-auto px-6 py-24">
      <div className="flex flex-col items-center text-center space-y-4 mb-16">
         <h2 className="text-4xl md:text-5xl font-black italic tracking-tighter uppercase">
           {t('gridTitle')} <span className="text-primary italic">{t('gridAccent')}</span>
         </h2>
         <p className="text-sm font-medium text-muted-foreground opacity-60 uppercase tracking-[0.4em]">{t('gridSubtitle')}</p>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {BRANDS.map((brand, i) => (
           <BrandCard key={i} brand={brand} t={t} />
        ))}
      </div>
    </section>
  )
}

function BrandCard({ brand, t }: { brand: any, t: any }) {
   const [imgError, setImgError] = useState(false)
   const displayName = brand.isOther ? t('otherBrand') : brand.name

   return (
      <Link href={`/services?brand=${encodeURIComponent(brand.isOther ? 'Other' : brand.name)}`} className="block">
         <div className="glass-panel p-6 rounded-[2rem] bg-white/5 border-white/5 hover:bg-white/10 hover:border-primary/30 transition-all group flex flex-col items-center justify-center gap-4 h-56 cursor-pointer relative overflow-hidden text-center">
            {/* Background pulse effect */}
            <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-colors" />
            
            {/* Transparent Logo Container */}
            <div className="w-28 h-28 flex items-center justify-center p-2 group-hover:scale-110 transition-transform duration-500 relative z-10 drop-shadow-lg">
                  {brand.isOther ? (
                    <Layers className="w-16 h-16 text-primary group-hover:rotate-12 transition-transform duration-500" />
                  ) : (
                    <img 
                      src={brand.overrideUrl ? brand.overrideUrl : `https://cdn.simpleicons.org/${brand.slug}/white`} 
                      alt={brand.name}
                      className={`w-full h-full object-contain filter transition-opacity duration-500 rounded-none ${imgError ? 'opacity-0 absolute' : 'opacity-100'} ${brand.overrideUrl ? 'brightness-0 invert drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]' : 'drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]'}`}
                      onError={() => setImgError(true)}
                      onLoad={() => setImgError(false)}
                    />
                  )}
                  
                  {!brand.isOther && imgError && <Car className="w-12 h-12 text-white opacity-40 transition-opacity" />}
            </div>
            
            <span className="text-xs font-black uppercase tracking-widest text-muted-foreground group-hover:text-white transition-colors relative z-10">
               {displayName}
            </span>
         </div>
      </Link>
   )
}
