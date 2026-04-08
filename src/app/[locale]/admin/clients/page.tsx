import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from "@/lib/auth-options"
import { getAgentClients, blockClient, deleteClient } from "@/actions/user-actions"
import { Button } from "@/components/ui/button"
import { 
  Users, 
  Ban, 
  Trash2, 
  CheckCircle,
  ShieldAlert,
  Search
} from "lucide-react"
import { revalidatePath } from 'next/cache'
import { setRequestLocale } from 'next-intl/server'

export default async function AdminClientsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  const session = await getServerSession(authOptions)
  
  if (!session || !['super_admin', 'admin', 'agent'].includes((session.user as any).role)) {
    redirect('/')
  }

  const clients = await getAgentClients()

  return (
    <div className="container mx-auto p-4 md:p-12 lg:pt-32 space-y-8 md:space-y-16 animate-fade-in min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 md:gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-primary text-[10px] font-black uppercase tracking-[0.4em]">
             CLIENT MANAGEMENT
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black uppercase italic tracking-tighter leading-none">
            Gérer <span className="text-primary italic">Clients</span>
          </h1>
          <p className="max-w-xl text-xs md:text-sm text-muted-foreground font-medium opacity-60">Supervisez la base de données des clients vérifiés. Bloquez l'accès aux clients problématiques ou supprimez définitivement les comptes.</p>
        </div>
        
        <div className="bg-primary/20 p-5 md:p-6 rounded-[2rem] border border-primary/30 flex items-center gap-4 md:gap-6 w-full md:w-auto">
           <Users className="w-8 h-8 md:w-10 md:h-10 text-primary" />
           <div>
              <div className="text-[10px] font-black uppercase tracking-widest opacity-60">Total Clients</div>
              <div className="text-2xl md:text-3xl font-black italic">{clients.length}</div>
           </div>
        </div>
      </div>

      <div className="glass-panel p-6 md:p-12 rounded-[2rem] md:rounded-[3.5rem] bg-card/60 border-white/10 space-y-8 md:space-y-10 relative overflow-hidden">
         <div className="absolute top-0 right-0 w-32 md:w-64 h-32 md:h-64 bg-primary/10 blur-[50px] md:blur-[100px] -z-10" />
         
         <div className="flex items-center gap-3 md:gap-4 border-b border-white/5 pb-6 md:pb-8">
            <Search className="w-5 h-5 md:w-6 md:h-6 text-primary flex-shrink-0" />
            <h3 className="text-xl md:text-2xl font-black uppercase italic tracking-widest truncate">Base Clients</h3>
         </div>

         <div className="space-y-4 md:space-y-6">
            {clients.length === 0 ? (
              <div className="p-10 md:p-16 rounded-[2rem] md:rounded-[2.5rem] bg-card/40 border-dashed border-white/10 text-center space-y-4">
                 <Users className="w-10 h-10 md:w-12 md:h-12 text-muted-foreground mx-auto opacity-20" />
                 <p className="text-[10px] md:text-xs uppercase font-black tracking-widest text-muted-foreground opacity-40 italic">Aucun client trouvé</p>
              </div>
            ) : (
              clients.map((client: any) => {
                 const isBlocked = client.status === 'blocked'
                 return (
                   <div key={client._id} className={`glass-panel p-5 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] border-white/5 border hover:border-primary/30 transition-all flex flex-col lg:flex-row lg:items-center justify-between group ${isBlocked ? 'bg-red-500/5 hover:border-red-500/30' : ''}`}>
                      <div className="flex items-center gap-4 md:gap-6 mb-6 lg:mb-0">
                         <div className={`w-12 h-12 md:w-16 md:h-16 rounded-full flex-shrink-0 flex items-center justify-center font-black text-xl md:text-2xl ${isBlocked ? 'bg-red-500/20 text-red-500' : 'bg-primary/20 text-primary'}`}>
                            {client.firstName?.[0]?.toUpperCase()}
                         </div>
                         <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-1">
                               <h4 className="text-lg md:text-xl font-black uppercase italic tracking-tighter truncate">{client.firstName} {client.lastName}</h4>
                               {isBlocked && <span className="px-2 md:px-3 py-1 bg-red-500/20 text-red-500 text-[9px] md:text-[10px] font-black uppercase tracking-widest rounded-lg flex-shrink-0">Bloqué</span>}
                            </div>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-[10px] md:text-xs font-bold text-muted-foreground uppercase opacity-60">
                               <span className="truncate">📧 {client.email}</span>
                               {client.phone && <span className="truncate">📞 {client.phone}</span>}
                            </div>
                         </div>
                      </div>
                      
                      <div className="flex items-center gap-2 md:gap-3 w-full lg:w-auto border-t border-white/10 lg:border-t-0 pt-4 lg:pt-0">
                         <form action={async () => { 'use server'; await blockClient(client._id, !isBlocked); revalidatePath('/[locale]/admin/clients'); }} className="flex-1 lg:flex-none">
                            <Button type="submit" variant="ghost" className={`w-full h-10 md:h-12 px-4 md:px-6 rounded-xl md:rounded-2xl bg-white/5 transition-all text-[10px] md:text-xs font-black uppercase tracking-wider ${isBlocked ? 'hover:bg-green-500/20 text-muted-foreground hover:text-green-500' : 'hover:bg-orange-500/20 text-muted-foreground hover:text-orange-500'}`}>
                               {isBlocked ? (
                                  <><CheckCircle className="w-4 h-4 mr-1.5 md:mr-2" /> Débloquer</>
                               ) : (
                                  <><Ban className="w-4 h-4 mr-1.5 md:mr-2" /> Bloquer</>
                               )}
                            </Button>
                         </form>
                         <form action={async () => { 'use server'; if (confirm('Supprimer ce client ?')) { await deleteClient(client._id); revalidatePath('/[locale]/admin/clients'); } }} className="flex-shrink-0">
                            <Button type="submit" variant="ghost" className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-white/5 hover:bg-red-500/20 text-muted-foreground hover:text-red-500 transition-all p-0">
                               <Trash2 className="w-4 h-4 md:w-5 md:h-5" />
                            </Button>
                         </form>
                      </div>
                   </div>
                 )
              })
            )}
         </div>
      </div>
    </div>
  )
}
