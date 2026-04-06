import { getTranslations, setRequestLocale } from 'next-intl/server'
import { Shield, Target, Trophy, Users, Zap, Milestone, ChevronRight } from "lucide-react"
import EngineeringCarousel from "@/components/shared/engineering-carousel"
import { Link } from '@/i18n/routing'

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
   const { locale } = await params
   setRequestLocale(locale)
   const t = await getTranslations()

   const visionCards = [
      { id: 'vision', i: <Target className="w-8 h-8" /> },
      { id: 'record', i: <Trophy className="w-8 h-8" /> },
      { id: 'society', i: <Users className="w-8 h-8" /> },
   ]

   return (
      <main className="min-h-screen pt-32 pb-24 bg-background">
         <div className="container px-6 mx-auto">
            <div className="flex flex-col lg:flex-row gap-20 items-start mb-40">
               <div className="lg:w-1/2 space-y-12">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.4em] border border-primary/20">
                     {t('About.originTitle')}
                  </div>
                  <h2 className="text-7xl md:text-[8rem] font-black tracking-tighter uppercase italic leading-[0.8]">
                     {t('About.mainHero1')} <br />
                     <span className="text-primary underline underline-offset-[1.5rem]">{t('About.mainHero2')}</span>
                  </h2>
                  <p className="max-w-xl text-lg md:text-xl text-muted-foreground font-medium uppercase tracking-widest leading-relaxed opacity-70">
                     {t('About.mainDesc')}
                  </p>
               </div>

               <div className="lg:w-1/2 relative glass-panel aspect-square p-2 border-2 border-white/10 group overflow-hidden">
                  <EngineeringCarousel />
                  <div className="relative h-full w-full bg-card/40 backdrop-blur-sm p-12 flex flex-col justify-between z-10 hover:bg-card/10 transition-colors duration-1000">
                     <div className="flex justify-between items-start" />
                     <div className="space-y-4">
                        <div className="h-1 w-24 bg-primary shadow-[0_0_20px_rgba(var(--primary-rgb),0.8)]" />
                        <h2 className="text-4xl font-black uppercase tracking-tighter italic drop-shadow-2xl">{t('About.mechanical')}</h2>
                        <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold leading-relaxed">
                           {t('About.engineering')}
                        </p>
                     </div>
                  </div>
               </div>
            </div>

            {/* Vision Columns */}
            <div className="grid md:grid-cols-3 gap-8">
               {visionCards.map((card) => (
                  <div key={card.id} className="glass-panel p-10 space-y-6 hover:bg-white/5 transition-colors group">
                     <div className="text-primary group-hover:scale-110 transition-transform">{card.i}</div>
                     <h3 className="text-xl font-black uppercase tracking-widest italic">{t(`About.${card.id}Title`)}</h3>
                     <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground font-medium leading-loose">
                        {t(`About.${card.id}Desc`)}
                     </p>
                  </div>
               ))}
            </div>
         </div>
      </main>
   )
}
