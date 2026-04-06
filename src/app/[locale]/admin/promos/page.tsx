import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { getPromos, addPromo, deletePromo, togglePromoStatus } from "@/actions/promo-actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  Ticket, 
  Plus, 
  Trash2, 
  Power, 
  ChevronRight,
  ShieldCheck,
  Zap
} from "lucide-react"
import { revalidatePath } from 'next/cache'
import { setRequestLocale, getTranslations } from 'next-intl/server'

export default async function AdminPromosPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('AdminPromos')
  const session = await getServerSession(authOptions)
  const role = (session?.user as any)?.role
  if (!session || (role !== 'super_admin' && role !== 'admin' && role !== 'agent')) {
    redirect('/')
  }

  const promos = await getPromos()

  async function handleAdd(formData: FormData) {
    'use server'
    const code = formData.get('code') as string
    const discount = parseInt(formData.get('discount') as string, 10)
    if (!code || isNaN(discount)) return
    await addPromo({ code, discount })
    revalidatePath('/[locale]/admin/promos')
  }

  return (
    <div className="container mx-auto p-12 space-y-16 animate-fade-in min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-accent text-[10px] font-black uppercase tracking-[0.4em]">
             {t('protocolActive')}
          </div>
          <h1 className="text-6xl font-black uppercase italic tracking-tighter leading-none">
            {t('titlePromo')} <span className="text-accent italic">{t('titleMatrix')}</span>
          </h1>
          <p className="max-w-xl text-muted-foreground font-medium opacity-60">{t('subtitle')}</p>
        </div>
        
        <div className="bg-accent/20 p-6 rounded-3xl border border-accent/30 flex items-center gap-6">
           <Zap className="w-10 h-10 text-accent animate-pulse" />
           <div>
              <div className="text-[10px] font-black uppercase tracking-widest opacity-60">{t('activeRewards')}</div>
              <div className="text-3xl font-black italic text-accent">{promos.filter((p: any) => p.isActive).length} / {promos.length}</div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16">
        {/* Code Registration Console */}
         <div className="glass-panel p-6 md:p-12 rounded-[2.5rem] md:rounded-[3.5rem] bg-card/60 border-white/10 space-y-10 relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-48 h-48 bg-accent/20 blur-[100px] -z-10" />
            <div className="flex items-center gap-4 border-b border-white/5 pb-6 md:pb-8">
               <Plus className="w-6 h-6 text-accent" />
               <h3 className="text-xl md:text-2xl font-black uppercase italic tracking-widest">{t('synthesize')}</h3>
            </div>
           
           <form action={handleAdd} className="space-y-8">
              <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase tracking-widest opacity-60 ml-2">{t('cipherLabel')}</label>
                 <Input name="code" required placeholder={t('cipherPlaceholder')} className="bg-white/5 border-white/10 rounded-2xl h-16 font-bold text-sm px-6 uppercase tracking-widest" />
              </div>
              <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase tracking-widest opacity-60 ml-2">{t('discountLabel')}</label>
                 <Input name="discount" type="number" min="1" max="100" required placeholder={t('discountPlaceholder')} className="bg-white/5 border-white/10 rounded-2xl h-16 font-bold text-sm px-6" />
              </div>
              <Button type="submit" className="w-full h-20 rounded-[1.8rem] bg-white text-black hover:bg-accent hover:text-white font-black text-xs uppercase tracking-[0.4em] transition-all group shadow-2xl shadow-white/10">
                 {t('inject')} <ChevronRight className="w-5 h-5 ml-4 group-hover:translate-x-2 transition-transform" />
              </Button>
           </form>
        </div>

        {/* Tactical Promos Matrix (List) */}
        <div className="space-y-6">
           {promos.length === 0 ? (
             <div className="glass-panel p-16 rounded-[3.5rem] bg-card/40 border-dashed border-white/10 text-center space-y-4">
                <Ticket className="w-12 h-12 text-muted-foreground mx-auto opacity-20" />
                <p className="text-xs uppercase font-black tracking-widest text-muted-foreground opacity-40 italic">{t('noRewards')}</p>
             </div>
           ) : (
             promos.map((promo: any) => (
                <div key={promo._id} className={`glass-panel p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] border-white/5 border hover:border-accent/30 transition-all flex flex-col md:flex-row items-center justify-between gap-6 group ${!promo.isActive && 'opacity-40 grayscale'}`}>
                   <div className="flex items-center gap-6 w-full md:w-auto">
                      <div className={`p-4 rounded-2xl ${promo.isActive ? 'bg-accent/20 text-accent' : 'bg-red-500/10 text-red-500'}`}>
                         <Ticket className="w-5 h-5" />
                      </div>
                      <div>
                         <h4 className="text-lg md:text-xl font-black uppercase italic tracking-widest text-white">{promo.code}</h4>
                         <p className="text-xs font-bold text-accent uppercase opacity-80 italic">-{promo.discount}% {t('off')}</p>
                      </div>
                   </div>
                   
                   <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                      <form action={async () => { 'use server'; await togglePromoStatus(promo._id, promo.isActive); revalidatePath('/[locale]/admin/promos'); }} className="flex-1 md:flex-none">
                         <Button type="submit" variant="ghost" className="w-full md:w-12 h-14 md:h-12 rounded-2xl bg-white/5 hover:bg-accent/20 text-muted-foreground hover:text-accent transition-all flex items-center justify-center gap-2">
                            <Power className="w-5 h-5" /> <span className="md:hidden text-[10px] font-black uppercase">Toggle status</span>
                         </Button>
                      </form>
                      <form action={async () => { 'use server'; await deletePromo(promo._id); revalidatePath('/[locale]/admin/promos'); }} className="flex-1 md:flex-none">
                         <Button type="submit" variant="ghost" className="w-full md:w-12 h-14 md:h-12 rounded-2xl bg-white/5 hover:bg-red-500/20 text-muted-foreground hover:text-red-500 transition-all flex items-center justify-center gap-2">
                            <Trash2 className="w-5 h-5" /> <span className="md:hidden text-[10px] font-black uppercase">Delete</span>
                         </Button>
                      </form>
                   </div>
                </div>
             ))
           )}
        </div>
      </div>
    </div>
  )
}
