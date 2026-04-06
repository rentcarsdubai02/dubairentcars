import { getTranslations, setRequestLocale } from 'next-intl/server'

import { 
  Users, 
  ShieldCheck, 
  ShieldAlert, 
  UserPlus, 
  Trash2, 
  Edit3, 
  Search, 
  ChevronRight, 
  Phone, 
  Mail, 
  Shield as ShieldIcon,
  Cpu as DashboardIcon
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import connectToDatabase from "@/lib/mongodb"
import User from "@/models/User"
import { createStaffUser, deleteStaffUser } from "@/actions/admin-actions"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-options"
import { redirect } from 'next/navigation'

export default async function AdminUsersPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('Auth')
  const tNav = await getTranslations('Navigation')
  const tAdminUsers = await getTranslations('AdminUsers')
  const session = await getServerSession(authOptions)
  const currentUser = session?.user as any

  if (!currentUser || (currentUser.role !== 'admin' && currentUser.role !== 'super_admin')) {
     redirect('/dashboard')
  }

  await connectToDatabase()
  
  // Logical filtering based on role
  let query = {}
  if (currentUser.role === 'admin') {
     // Operational admins only see their agents and clients
     query = { role: { $in: ['agent', 'client'] } }
  }

  const profiles = await User.find(query).sort({ createdAt: -1 })
  const plainProfiles = JSON.parse(JSON.stringify(profiles))

  return (
    <div className="space-y-12">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.4em] rounded-full border border-primary/20">
             {tAdminUsers('loggedAs')} {currentUser.role.toUpperCase()}
          </div>
          <h1 className="text-5xl font-black italic tracking-tighter uppercase leading-none text-primary">
             {tNav('adminUsers')}
          </h1>
          <p className="text-sm font-medium text-muted-foreground opacity-60">
             {currentUser.role === 'super_admin' ? tAdminUsers('subtitleSuperAdmin') : tAdminUsers('subtitleAdmin')}
          </p>
        </div>

        <div className="flex items-center gap-4">
           <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input className="bg-white/5 border-white/10 rounded-2xl h-12 w-64 pl-12 text-sm font-bold" placeholder={tAdminUsers('searchPlaceholder')} />
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        <div className="lg:col-span-3 space-y-6">
           <div className="glass-panel rounded-[2.5rem] border-white/10 bg-card/60 overflow-hidden">
              <div className="overflow-x-auto overflow-y-auto max-h-[600px]">
                 <table className="w-full text-left border-collapse">
                    <thead>
                       <tr className="bg-white/5 border-b border-white/5">
                          <th className="p-6 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">{tAdminUsers('identity')}</th>
                          <th className="p-6 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">{tAdminUsers('digitalAddress')}</th>
                          <th className="p-6 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground text-right border-l border-white/5">{tAdminUsers('actions')}</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                       {plainProfiles.map((profile: any) => (
                         <tr key={profile._id} className="group hover:bg-white/5 transition-all">
                            <td className="p-6">
                               <div className="flex items-center gap-4">
                                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary/20 to-accent/20 flex items-center justify-center font-black text-xs text-primary uppercase">
                                     {profile.firstName?.[0]}{profile.lastName?.[0]}
                                  </div>
                                  <div>
                                     <div className="text-sm font-black tracking-tight">{profile.firstName} {profile.lastName}</div>
                                     <div className="text-[10px] font-bold text-muted-foreground tracking-tighter uppercase opacity-40">#{profile._id.substring(0, 8)}</div>
                                  </div>
                               </div>
                            </td>
                            <td className="p-6">
                               <div className="flex flex-col gap-1">
                                  <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
                                     <Mail className="w-3 h-3 text-primary" /> {profile.email}
                                  </div>
                                  <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
                                     <Phone className="w-3 h-3 text-accent" /> {profile.phone || tAdminUsers('noPhone')}
                                  </div>
                               </div>
                            </td>
                            <td className="p-6 text-right space-x-2 border-l border-white/5">
                               <form action={async () => {
                                  'use server'
                                  await deleteStaffUser(profile._id)
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

           <div className="grid md:grid-cols-2 gap-8">
               <div className="glass-panel p-10 rounded-[2.5rem] bg-card/60 border-white/10">
                  <h3 className="text-2xl font-black italic tracking-tighter uppercase mb-2">{tAdminUsers('deployOperator')}</h3>
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-40 mb-10">{tAdminUsers('deployOperatorDesc')}</p>
                  
                  <form action={async (formData: FormData) => {
                    'use server'
                    await createStaffUser({
                       firstName: formData.get('firstName') as string,
                       lastName: formData.get('lastName') as string,
                       email: formData.get('email') as string,
                       phone: formData.get('phone') as string,
                       role: formData.get('role') as any
                    })
                  }} className="space-y-6">
                     <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                           <Label className="text-[10px] font-black uppercase tracking-widest opacity-60 ml-2">{tAdminUsers('firstName')}</Label>
                           <Input name="firstName" required className="bg-white/5 border-white/10 rounded-2xl h-14 font-bold text-sm px-6" placeholder="Alpha" />
                        </div>
                        <div className="space-y-1.5">
                           <Label className="text-[10px] font-black uppercase tracking-widest opacity-60 ml-2">{tAdminUsers('lastName')}</Label>
                           <Input name="lastName" required className="bg-white/5 border-white/10 rounded-2xl h-14 font-bold text-sm px-6" placeholder="Lead" />
                        </div>
                     </div>
                     <div className="space-y-1.5">
                        <Label className="text-[10px] font-black uppercase tracking-widest opacity-60 ml-2">{tAdminUsers('email')}</Label>
                        <Input name="email" type="email" required className="bg-white/5 border-white/10 rounded-2xl h-14 font-bold text-sm px-6" placeholder="ID@NETWORK.XYZ" />
                     </div>
                     <div className="space-y-1.5">
                        <Label className="text-[10px] font-black uppercase tracking-widest opacity-60 ml-2">{tAdminUsers('role')}</Label>
                        <select name="role" className="w-full bg-white/5 border-white/10 rounded-2xl h-14 font-bold text-sm px-6 text-foreground outline-none appearance-none cursor-pointer">
                           <option value="agent">{tAdminUsers('roleAgent')}</option>
                           {currentUser.role === 'super_admin' && <option value="admin">{tAdminUsers('roleAdmin')}</option>}
                        </select>
                     </div>

                     <Button type="submit" className="w-full h-16 rounded-2xl bg-primary text-primary-foreground font-black text-xs uppercase tracking-widest mt-8 group transition-all">
                        <span className="flex items-center gap-2">{tAdminUsers('submitButton')} <ChevronRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" /></span>
                     </Button>
                  </form>
               </div>

               <div className="space-y-6">
                  <div className="glass-panel p-8 rounded-3xl border-white/10 bg-card/40">
                     <h3 className="text-xs font-black uppercase tracking-widest text-primary mb-6">{tAdminUsers('statsTitle')}</h3>
                     <div className="space-y-8">
                        {[
                          { l: tAdminUsers('visibleOps'), v: plainProfiles.length, i: <Users className="w-5 h-5" />, c: "text-primary" },
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

                  <div className="glass-panel p-8 rounded-3xl border-white/5 bg-accent/5">
                     <h3 className="text-xs font-black uppercase tracking-widest text-accent mb-4">{tAdminUsers('authorityTitle')}</h3>
                     <p className="text-xs font-semibold text-muted-foreground leading-relaxed">
                        {currentUser.role === 'admin' 
                          ? tAdminUsers('authAdmin') 
                          : tAdminUsers('authSuperAdmin')
                        }
                     </p>
                  </div>
               </div>
           </div>
        </div>
      </div>
    </div>
  )
}
