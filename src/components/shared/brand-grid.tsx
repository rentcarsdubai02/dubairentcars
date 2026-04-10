'use client'

import { useTranslations } from 'next-intl'
import { useState, useEffect } from 'react'
import { Car, Layers } from "lucide-react"
import { Link } from '@/i18n/routing'

export function BrandGrid() {
  const t = useTranslations('Fleet')
  const [brands, setBrands] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const res = await fetch('/api/brands')
        const data = await res.json()
        if (Array.isArray(data) && data.length > 0) {
          setBrands(data.filter((b: any) => b.visible))
        }
      } catch (err) {
        console.error('Failed to fetch brands, using fallback', err)
      } finally {
        setLoading(false)
      }
    }
    fetchBrands()
  }, [])

  return (
    <section id="brands" className="container mx-auto px-6 py-24">
      <div className="flex flex-col items-center text-center space-y-4 mb-16">
         <h2 className="text-4xl md:text-5xl font-black italic tracking-tighter uppercase">
           {t('gridTitle')} <span className="text-primary italic">{t('gridAccent')}</span>
         </h2>
         <p className="text-sm font-medium text-muted-foreground opacity-60 uppercase tracking-[0.4em]">{t('gridSubtitle')}</p>
      </div>
      
      <div className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 transition-opacity duration-500 ${loading ? 'opacity-40' : 'opacity-100'}`}>
        {brands.map((brand, i) => (
           <BrandCard key={brand._id || i} brand={brand} t={t} />
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
         <div className="glass-panel p-4 sm:p-6 rounded-[1.5rem] sm:rounded-[2rem] bg-white/5 border-white/5 hover:bg-white/10 hover:border-primary/30 transition-all group flex flex-col items-center justify-center gap-4 h-44 sm:h-56 cursor-pointer relative overflow-hidden text-center">
            {/* Background pulse effect */}
            <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-colors" />
            
            {/* Transparent Logo Container */}
            <div className="w-24 h-24 flex items-center justify-center p-2 group-hover:scale-110 transition-transform duration-500 relative z-10">
                  {brand.isOther ? (
                    <Layers className="w-12 h-12 text-primary group-hover:rotate-12 transition-transform duration-500" />
                  ) : (
                    <img 
                      src={brand.overrideUrl ? brand.overrideUrl : `https://cdn.simpleicons.org/${brand.slug}/white`} 
                      alt={brand.name}
                      loading="lazy"
                      className={`w-full h-full object-contain filter transition-opacity duration-500 ${imgError ? 'opacity-0 absolute' : 'opacity-100'} ${brand.overrideUrl ? 'brightness-0 invert' : ''}`}
                      onError={() => setImgError(true)}
                      onLoad={() => setImgError(false)}
                    />
                  )}
                  
                  {!brand.isOther && imgError && <Car className="w-10 h-10 text-white opacity-40 transition-opacity" />}
            </div>
            
            <span className="text-xs font-black uppercase tracking-widest text-muted-foreground group-hover:text-white transition-colors relative z-10">
               {displayName}
            </span>
         </div>
      </Link>
   )
}
