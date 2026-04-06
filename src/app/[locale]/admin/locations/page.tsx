import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from "@/lib/auth-options"
import { getLocations, addLocation, deleteLocation, toggleLocationStatus } from "@/actions/location-actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  MapPin, 
  Plus, 
  Trash2, 
  Power, 
  Building2, 
  ChevronRight,
  ShieldCheck,
  Zap,
  Globe
} from "lucide-react"
import { revalidatePath } from 'next/cache'
import { setRequestLocale, getTranslations } from 'next-intl/server'

export default async function AdminLocationsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('AdminLocations')
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any).role !== 'super_admin' && (session.user as any).role !== 'admin') {
    redirect('/')
  }

  const locations = await getLocations()

  async function handleAdd(formData: FormData) {
    'use server'
    const name = formData.get('name') as string
    const address = formData.get('address') as string
    if (!name || !address) return
    await addLocation({ name, address })
    revalidatePath('/[locale]/admin/locations')
  }

  return (
    <div className="container mx-auto p-12 space-y-16 animate-fade-in min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-primary text-[10px] font-black uppercase tracking-[0.4em]">
             {t('badge')}
          </div>
          <h1 className="text-6xl font-black uppercase italic tracking-tighter leading-none">
            {t('title1')} <span className="text-primary italic">{t('title2')}</span>
          </h1>
          <p className="max-w-xl text-muted-foreground font-medium opacity-60">{t('subtitle')}</p>
        </div>
        
        <div className="bg-primary/20 p-6 rounded-3xl border border-primary/30 flex items-center gap-6">
           <Globe className="w-10 h-10 text-primary animate-pulse" />
           <div>
              <div className="text-[10px] font-black uppercase tracking-widest opacity-60">{t('activeHubs')}</div>
              <div className="text-3xl font-black italic">{locations.filter((l: any) => l.isActive).length} / {locations.length}</div>
           </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-16">
        {/* Hub Registration Console */}
        <div className="glass-panel p-12 rounded-[3.5rem] bg-card/60 border-white/10 space-y-10 relative overflow-hidden">
           <div className="absolute -top-10 -right-10 w-48 h-48 bg-primary/20 blur-[100px] -z-10" />
           <div className="flex items-center gap-4 border-b border-white/5 pb-8">
              <Plus className="w-6 h-6 text-primary" />
              <h3 className="text-2xl font-black uppercase italic tracking-widest">{t('registerTitle')}</h3>
           </div>
           
           <form action={handleAdd} className="space-y-8">
              <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase tracking-widest opacity-60 ml-2">{t('pointNameLabel')}</label>
                 <Input name="name" required placeholder={t('pointNamePlaceholder')} className="bg-white/5 border-white/10 rounded-2xl h-16 font-bold text-sm px-6" />
              </div>
              <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase tracking-widest opacity-60 ml-2">{t('addressLabel')}</label>
                 <Input name="address" required placeholder={t('addressPlaceholder')} className="bg-white/5 border-white/10 rounded-2xl h-16 font-bold text-sm px-6" />
              </div>
              <Button type="submit" className="w-full h-20 rounded-[1.8rem] bg-white text-black hover:bg-primary hover:text-white font-black text-xs uppercase tracking-[0.4em] transition-all group shadow-2xl shadow-white/10">
                 {t('submitBtn')} <ChevronRight className="w-5 h-5 ml-4 group-hover:translate-x-2 transition-transform" />
              </Button>
           </form>
        </div>

        {/* Tactical Hub Matrix (List) */}
        <div className="space-y-6">
           {locations.length === 0 ? (
             <div className="glass-panel p-16 rounded-[3.5rem] bg-card/40 border-dashed border-white/10 text-center space-y-4">
                <MapPin className="w-12 h-12 text-muted-foreground mx-auto opacity-20" />
                <p className="text-xs uppercase font-black tracking-widest text-muted-foreground opacity-40 italic">{t('emptyList')}</p>
             </div>
           ) : (
             locations.map((loc: any) => (
               <div key={loc._id} className={`glass-panel p-8 rounded-[2.5rem] border-white/5 border hover:border-primary/30 transition-all flex items-center justify-between group ${!loc.isActive && 'opacity-40'}`}>
                  <div className="flex items-center gap-6">
                     <div className={`p-4 rounded-2xl ${loc.isActive ? 'bg-primary/20 text-primary' : 'bg-red-500/10 text-red-500'}`}>
                        <MapPin className="w-5 h-5" />
                     </div>
                     <div>
                        <h4 className="text-lg font-black uppercase italic tracking-tighter">{loc.name}</h4>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase opacity-60">{loc.address}</p>
                     </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                     <form action={async () => { 'use server'; await toggleLocationStatus(loc._id, loc.isActive); revalidatePath('/[locale]/admin/locations'); }}>
                        <Button type="submit" variant="ghost" className="w-12 h-12 rounded-2xl bg-white/5 hover:bg-primary/20 text-muted-foreground hover:text-primary transition-all">
                           <Power className="w-5 h-5" />
                        </Button>
                     </form>
                     <form action={async () => { 'use server'; await deleteLocation(loc._id); revalidatePath('/[locale]/admin/locations'); }}>
                        <Button type="submit" variant="ghost" className="w-12 h-12 rounded-2xl bg-white/5 hover:bg-red-500/20 text-muted-foreground hover:text-red-500 transition-all">
                           <Trash2 className="w-5 h-5" />
                        </Button>
                     </form>
                  </div>
               </div>
             ))
           )}
        </div>
      </div>
      
      {/* Visual Hub Indicator */}
      <div className="pt-20 border-t border-white/5 flex flex-wrap gap-12 justify-center opacity-20 grayscale hover:grayscale-0 transition-all duration-700">
         <div className="flex items-center gap-4 text-xs font-black uppercase tracking-[0.3em]">
            <Zap className="w-4 h-4 text-primary" /> {t('footerNote1')}
         </div>
         <div className="flex items-center gap-4 text-xs font-black uppercase tracking-[0.3em]">
            <Building2 className="w-4 h-4 text-primary" /> {t('footerNote2')}
         </div>
      </div>
    </div>
  )
}
