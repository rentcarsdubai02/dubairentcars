import { getTranslations, setRequestLocale } from 'next-intl/server'
import { 
  Trash2, 
  Activity, 
  Settings2, 
  Car,
  PenLine,
  X
} from "lucide-react"
import { Button } from "@/components/ui/button"
import connectToDatabase from "@/lib/mongodb"
import Vehicle from "@/models/Vehicle"
import { deleteVehicle } from "@/actions/vehicle-actions"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-options"
import { FleetForm } from "@/components/shared/fleet-form"
import { Link } from '@/i18n/routing'

export default async function AdminFleetPage({ 
  params,
  searchParams 
}: { 
  params: Promise<{ locale: string }>,
  searchParams: Promise<{ editId?: string }>
}) {
  const { locale } = await params
  const { editId } = await searchParams
  setRequestLocale(locale)
  const t = await getTranslations('Fleet')

  const session = await getServerSession(authOptions)
  const user = session?.user as any

  await connectToDatabase()
  
  const vehicles = await Vehicle.find({}).sort({ createdAt: -1 })
  const plainVehicles = JSON.parse(JSON.stringify(vehicles))

  const vehicleToEdit = editId ? plainVehicles.find((v: any) => v._id === editId) : null

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.4em] rounded-full border border-primary/20">
             {t('title')}: {locale.toUpperCase()}
          </div>
          <h1 className="text-5xl font-black italic tracking-tighter uppercase leading-none">
             {t('title')}
          </h1>
          <p className="text-sm font-medium text-muted-foreground opacity-60">{t('subtitle')}</p>
        </div>
          
          {editId && (
            <Link href="/admin/fleet">
               <Button variant="outline" className="rounded-2xl border-white/10 flex items-center gap-2 font-black text-[10px] uppercase tracking-widest">
                  <X className="w-4 h-4" /> {t('cancelEdit')}
               </Button>
            </Link>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Quick Stats Sidebar */}
          <aside className="lg:col-span-1 space-y-6">
            <div className="glass-panel p-6 md:p-8 rounded-3xl border-white/10 bg-card/40">
               <div className="grid grid-cols-2 lg:grid-cols-1 gap-4 lg:gap-8">
                  {[
                    { l: t('stockStatus'), v: plainVehicles.length, i: <Car className="w-5 h-5" />, c: "text-primary" },
                    { l: t('maintenance'), v: plainVehicles.filter((v: any) => v.status === 'maintenance').length, i: <Settings2 className="w-5 h-5" />, c: "text-accent" },
                  ].map((stat, i) => (
                    <div key={i} className="flex items-center gap-6">
                       <div className={`${stat.c} p-3 bg-white/5 rounded-2xl`}>
                          {stat.i}
                       </div>
                       <div>
                          <div className="text-2xl font-black tracking-tighter">{stat.v}</div>
                          <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-40">{stat.l}</div>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
          </aside>

          {/* Main Deployment Matrix */}
          <div className="lg:col-span-3 space-y-12">
             {/* FleetForm handles both Image Uploads and Technical Data */}
             {(user?.role === 'admin' || user?.role === 'super_admin') && (
               <FleetForm initialData={vehicleToEdit} />
             )}

             {/* Dynamic Fleet Table */}
             <div className="glass-panel rounded-[2rem] md:rounded-[2.5rem] bg-card/60 border-white/10 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[600px] md:min-w-0">
                       <thead>
                          <tr className="bg-white/5 border-b border-white/5">
                             <th className="p-4 md:p-6 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">{t('unitIdentity')}</th>
                             <th className="hidden md:table-cell p-6 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">{t('performanceYear')}</th>
                             <th className="p-4 md:p-6 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">{t('fleetStatus')}</th>
                             <th className="p-4 md:p-6 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground text-right">{t('actions')}</th>
                          </tr>
                       </thead>
                       <tbody className="divide-y divide-white/5">
                      {plainVehicles.map((v: any) => (
                        <tr key={v._id} className="group hover:bg-white/5 transition-all">
                           <td className="p-6">
                              <div className="flex items-center gap-4">
                                 <div className="w-16 h-10 rounded-lg bg-white/5 overflow-hidden flex items-center justify-center relative">
                                    <img src={v.images?.[0]} alt={v.name} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
                                 </div>
                                 <div>
                                    <div className="text-sm font-black tracking-tight uppercase italic">{v.brand} {v.name}</div>
                                    <div className="text-[10px] font-bold text-primary italic">{v.pricePerDay} AED / Cycle</div>
                                 </div>
                              </div>
                           </td>
                            <td className="hidden md:table-cell p-6">
                               <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60">{v.modelYear}</div>
                            </td>
                            <td className="p-4 md:p-6">
                              <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground">
                                 <Activity className="w-3 h-3 text-primary animate-pulse" /> {v.status}
                              </div>
                           </td>
                           <td className="p-6 text-right space-x-2">
                              <Link href={`/admin/fleet?editId=${v._id}`} className="inline">
                                 <Button variant="ghost" size="sm" className="w-10 h-10 rounded-xl hover:bg-primary/10 hover:text-primary transition-all p-0">
                                    <PenLine className="w-4 h-4" />
                                 </Button>
                              </Link>
                              
                              <form action={async () => {
                                 'use server'
                                 await deleteVehicle(v._id)
                              }} className="inline">
                                 <Button type="submit" variant="ghost" size="sm" className="w-10 h-10 rounded-xl hover:bg-accent/10 hover:text-accent transition-all p-0">
                                    <Trash2 className="w-4 h-4" />
                                 </Button>
                              </form>
                           </td>
                        </tr>
                      ))}
                   </tbody>
                </table>
              </div>
           </div>
         </div>
      </div>
    </div>
  )
}
