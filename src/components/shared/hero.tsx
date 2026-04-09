'use client'

import { useTranslations } from 'next-intl'
import { Button } from "@/components/ui/button"
import { motion, useScroll, useTransform } from "framer-motion"
import { Car, Fuel, Gauge, Shield, Zap, Star, ChevronRight } from "lucide-react"
import Image from 'next/image'

export function Hero({ dbSubtitle }: { dbSubtitle?: string }) {
  const t = useTranslations('Index')
  const { scrollY } = useScroll()
  const y1 = useTransform(scrollY, [0, 500], [0, 200])
  const opacity = useTransform(scrollY, [0, 400], [1, 0])

  return (
    <section className="relative w-full min-h-screen flex items-center justify-center pt-24 pb-12 overflow-hidden bg-background">
      {/* Dynamic Glow Mesh Effect */}
      <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden h-screen w-full">
         <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] animate-pulse" />
         <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-accent/15 rounded-full blur-[150px] animate-pulse delay-1000" />
      </div>

      {/* Background and Asset */}
      <motion.div 
        style={{ y: y1, opacity }}
        className="absolute inset-0 z-0 pointer-events-none"
      >
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-background via-background to-transparent z-10" />
        <div className="absolute inset-y-0 right-0 w-full md:w-[85%] h-full opacity-40 grayscale-0 z-0 mix-blend-screen overflow-hidden">
          <Image 
             src="/Dubaï Rent Cars.png"
             alt="Premium Car Showroom"
             fill
             sizes="100vw"
             priority={true}
             className="object-cover object-right-bottom scale-110"
          />
        </div>
      </motion.div>

      <div className="container relative z-20 px-6 mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="flex flex-col items-start gap-4 text-left">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 text-primary text-xs font-semibold tracking-wide border border-primary/20"
            >
              <Zap className="w-3.5 h-3.5 fill-primary" />
              Dubai Rent Cars
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
              className="text-6xl md:text-[7.5rem] font-black tracking-tight leading-[0.9]"
            >
              {t('heroTitle1')} <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary/80 to-accent drop-shadow-[0_0_20px_rgba(0,188,212,0.3)]">{t('heroTitle2')}</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="max-w-md text-lg md:text-xl text-muted-foreground/90 mt-8 mb-12 leading-relaxed font-medium whitespace-pre-wrap"
            >
               {dbSubtitle || t('heroSubtitle')}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="flex flex-wrap gap-5"
            >
              <a href="#brands" className="contents">
                <Button size="lg" className="h-14 px-8 text-sm font-bold tracking-tight rounded-xl bg-primary hover:bg-primary/95 text-primary-foreground shadow-[0_10px_30px_-10px_oklch(var(--primary))] animate-shimmer bg-gradient-to-r from-primary via-white/20 to-primary bg-[length:200%_100%]">
                  <span className="relative z-10 flex items-center gap-2">
                    {t('viewCollection')} <ChevronRight className="w-4 h-4" />
                  </span>
                </Button>
              </a>
            </motion.div>


          </div>

          <div className="hidden lg:flex relative h-full flex-col justify-center">
             <motion.div
                initial={{ opacity: 0, scale: 0.9, rotateY: 30 }}
                animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                transition={{ duration: 1.5, delay: 1.2 }}
                className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden glass-panel border-white/10 p-0 shadow-2xl"
             >
                <Image 
                   src="/Dubaï Rent Cars.png" 
                   alt="Showroom" 
                   fill 
                   sizes="50vw"
                   className="object-cover opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent flex flex-col justify-end p-8">
                   <div className="flex items-center gap-4">
                      <div className="size-3.5 rounded-full bg-primary animate-ping shadow-[0_0_15px_rgba(var(--primary),0.8)]" />
                      <span className="text-sm md:text-lg font-black tracking-[0.2em] uppercase italic text-white drop-shadow-lg">{t('liveActive')}</span>
                   </div>
                </div>
             </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
