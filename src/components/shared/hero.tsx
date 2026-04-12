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
        <Image 
           src="/lamborghini_cannes_v7.jpeg"
           alt="Premium Car"
           fill
           sizes="100vw"
           priority={true}
           className="object-cover object-center"
        />
        {/* Gradient Overlay for Text Readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/50 to-transparent z-10" />
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-background via-transparent to-transparent z-10" />
      </motion.div>

      <div className="container relative z-20 px-6 mx-auto">
        <div className="flex flex-col items-start gap-4 text-left -mt-40 md:-mt-64">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="flex items-center gap-6 mt-8 mb-2"
            >
              <div className="h-[2px] w-12 md:w-24 bg-gradient-to-r from-primary to-transparent shadow-[0_0_15px_rgba(0,188,212,0.8)]" />
              <span className="text-xl md:text-3xl font-black uppercase tracking-widest whitespace-nowrap text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary/80 to-accent drop-shadow-[0_0_25px_rgba(0,188,212,0.5)]">
                Dubai Rent Cars
              </span>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
              className="text-3xl md:text-[3.5rem] font-black tracking-tight leading-[0.9]"
            >
              {t('heroTitle1')} <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary/80 to-accent drop-shadow-[0_0_20px_rgba(0,188,212,0.3)]">{t('heroTitle2')}</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="max-w-md text-lg md:text-xl text-muted-foreground/90 mt-4 mb-12 leading-relaxed font-medium whitespace-pre-wrap"
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

      </div>
    </section>
  )
}
