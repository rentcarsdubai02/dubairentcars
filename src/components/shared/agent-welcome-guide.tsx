'use client'

import { motion } from 'framer-motion'
import { useLocale, useTranslations } from 'next-intl'
import {
  Car,
  MapPin,
  Mail,
  ShieldCheck,
  CalendarCheck,
  Users,
  LayoutTemplate
} from 'lucide-react'

export function AgentWelcomeGuide() {
  const t = useTranslations('AgentWelcome')

  const sections = [
    {
      title: t('sectionBookingsTitle'),
      icon: CalendarCheck,
      description: t('sectionBookingsDesc'),
      details: t('sectionBookingsDetails'),
      color: "text-blue-500",
      bg: "bg-blue-500/10"
    },
    {
      title: t('sectionFleetTitle'),
      icon: Car,
      description: t('sectionFleetDesc'),
      details: t('sectionFleetDetails'),
      color: "text-emerald-500",
      bg: "bg-emerald-500/10"
    },
    {
      title: t('sectionLocationsTitle'),
      icon: MapPin,
      description: t('sectionLocationsDesc'),
      details: t('sectionLocationsDetails'),
      color: "text-amber-500",
      bg: "bg-amber-500/10"
    },
    {
      title: t('sectionContactTitle'),
      icon: Mail,
      description: t('sectionContactDesc'),
      details: t('sectionContactDetails'),
      color: "text-cyan-500",
      bg: "bg-cyan-500/10"
    },
    {
      title: t('sectionUsersTitle'),
      icon: Users,
      description: t('sectionUsersDesc'),
      details: t('sectionUsersDetails'),
      color: "text-purple-500",
      bg: "bg-purple-500/10"
    },
    {
      title: t('sectionFooterTitle'),
      icon: LayoutTemplate,
      description: t('sectionFooterDesc'),
      details: t('sectionFooterDetails'),
      color: "text-orange-500",
      bg: "bg-orange-500/10"
    }
  ]

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <div className="p-3 rounded-xl bg-primary/10 border border-primary/20">
          <ShieldCheck className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{t('title')}</h2>
          <p className="text-muted-foreground mt-1 max-w-2xl">
            {t('subtitle')}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sections.map((section, idx) => {
          const Icon = section.icon
          return (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="group relative p-6 rounded-2xl bg-card border border-border/50 hover:border-primary/50 transition-all duration-300 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              
              <div className="relative z-10 flex flex-col h-full">
                <div className="flex items-center gap-4 mb-4">
                  <div className={`p-3 rounded-lg flex-shrink-0 transition-transform duration-300 group-hover:scale-110 ${section.bg}`}>
                    <Icon className={`w-6 h-6 ${section.color}`} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{section.title}</h3>
                    <p className="text-sm font-medium text-primary/80">{section.description}</p>
                  </div>
                </div>
                
                <p className="text-muted-foreground text-sm leading-relaxed flex-grow">
                  {section.details}
                </p>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
