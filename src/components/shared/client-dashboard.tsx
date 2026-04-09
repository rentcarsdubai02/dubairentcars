'use client'

import { useTranslations } from 'next-intl'
import { useState } from 'react'
import {
   X,
   Car,
   MapPin,
   Calendar,
   Clock,
   ChevronRight,
   Settings,
   User,
   LogOut,
   Ticket,
   Save,
   Loader2,
   Trash2,
   Zap,
   ShieldCheck,
   CheckCircle2,
   Info
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { updateProfile } from "@/actions/user-actions"
import { signOut } from "next-auth/react"
import { AdminWelcomeGuide } from "./admin-welcome-guide"
import { AgentWelcomeGuide } from "./agent-welcome-guide"

interface ClientDashboardProps {
   initialData: {
      user: any;
      bookings: any[];
      promos: any[];
   }
}

export function ClientDashboard({ initialData }: ClientDashboardProps) {
   const t = useTranslations('Dashboard')
   const [activeTab, setActiveTab] = useState<'overview' | 'history' | 'promos' | 'profile' | 'admin-guide' | 'agent-guide'>('overview')
   const [user, setUser] = useState(initialData.user)
   const [loading, setLoading] = useState(false)
   const [success, setSuccess] = useState(false)
   const [errorStatus, setErrorStatus] = useState<string | null>(null)
   const [copiedCode, setCopiedCode] = useState<string | null>(null)
   const [selectedBooking, setSelectedBooking] = useState<any | null>(null)
   const [showRankInfo, setShowRankInfo] = useState(false)

   const paidBookingsCount = initialData.bookings.filter(b => b.paymentStatus === 'paid').length

   const getRankInfo = () => {
      if (paidBookingsCount >= 26) return { l: t('rankPlatinum'), c: 'text-purple-400' }
      if (paidBookingsCount >= 16) return { l: t('rankGold'), c: 'text-yellow-400' }
      if (paidBookingsCount >= 6) return { l: t('rankSilver'), c: 'text-gray-300' }
      return { l: t('rankBronze'), c: 'text-orange-400' }
   }

   const rank = getRankInfo()

   if (!user) return <div className="text-center py-20 uppercase font-black opacity-20 tracking-widest">No Profile Data Found</div>

   const handleCopy = (code: string) => {
      navigator.clipboard.writeText(code)
      setCopiedCode(code)
      setTimeout(() => setCopiedCode(null), 2000)
   }

   const handleUpdateProfile = async (e: React.FormEvent) => {
      e.preventDefault()
      setLoading(true)
      setErrorStatus(null)
      const formData = new FormData(e.target as HTMLFormElement)

      const password = formData.get('password') as string
      const confirmPassword = formData.get('confirmPassword') as string

      if (password && password !== confirmPassword) {
         setErrorStatus(t('passwordMismatch'))
         setLoading(false)
         return
      }

      const res = await updateProfile({
         firstName: formData.get('firstName') as string,
         lastName: formData.get('lastName') as string,
         gender: formData.get('gender') as any,
         birthDate: formData.get('birthDate') as string,
         phone: formData.get('phone') as string,
         password: password || undefined,
      })

      if (res.success) {
         setUser(res.user)
         setSuccess(true)
            ; (e.target as HTMLFormElement).reset()
         setTimeout(() => setSuccess(false), 3000)
      } else {
         setErrorStatus(res.error)
      }
      setLoading(false)
   }

   return (
      <div className="flex flex-col lg:flex-row gap-12">
         {/* Sidebar Sidebar */}
         <aside className="lg:w-1/4 space-y-6">
            <div className="glass-panel p-8 rounded-3xl border-white/10 bg-card/60">
               <div className="flex flex-col items-center text-center">
                  <div className="relative mb-6">
                     <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-primary to-accent p-1">
                        <div className="w-full h-full rounded-full bg-background flex items-center justify-center overflow-hidden">
                           <div className="text-4xl font-black text-primary uppercase">{user?.firstName?.[0] || 'D'}</div>
                        </div>
                     </div>
                     <div className="absolute bottom-1 right-1 w-6 h-6 bg-green-500 border-4 border-background rounded-full" />
                  </div>
                  <h2 className="text-2xl font-black tracking-tight mb-1">{user?.firstName} {user?.lastName}</h2>
                  <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em] italic">{user?.role || 'DRIVER'}</p>
               </div>

               <div className="mt-10 space-y-2">
                  {[
                     { id: 'overview', l: t('overview'), i: <ShieldCheck className="w-4 h-4" /> },
                     { id: 'history', l: t('history'), i: <Calendar className="w-4 h-4" /> },
                     { id: 'promos', l: t('promos'), i: <Ticket className="w-4 h-4" /> },
                     { id: 'profile', l: t('profile'), i: <Settings className="w-4 h-4" /> },
                     ...(user?.role === 'admin' || user?.role === 'super_admin' ? [{ id: 'admin-guide', l: 'Guide Admin', i: <Info className="w-4 h-4" /> }] : []),
                     ...(user?.role === 'agent' ? [{ id: 'agent-guide', l: 'Guide Agent', i: <Info className="w-4 h-4" /> }] : []),
                  ].map((item) => (
                     <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id as any)}
                        className={`flex items-center gap-4 w-full p-4 rounded-2xl text-sm font-bold transition-all group ${activeTab === item.id ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20' : 'text-muted-foreground hover:bg-white/5 hover:text-white'}`}
                     >
                        <div className={activeTab === item.id ? 'text-white' : 'text-primary group-hover:scale-110 transition-transform'}>
                           {item.i}
                        </div>
                        {item.l}
                     </button>
                  ))}
                  <button onClick={() => signOut()} className="flex items-center gap-4 w-full p-4 rounded-2xl text-sm font-bold text-accent hover:bg-accent/10 transition-all mt-6">
                     <LogOut className="w-4 h-4" />
                     {t('signOut')}
                  </button>
               </div>
            </div>
         </aside>

         {/* Main Activity Area */}
         <div className="lg:w-3/4 space-y-8 animate-fade-in" key={activeTab}>

            {/* OVERVIEW TAB */}
            {activeTab === 'overview' && (
               <div className="space-y-8">
                  <div className="grid md:grid-cols-3 gap-6">
                     {[
                        { l: t('completedMissions'), v: initialData.bookings.length.toString().padStart(2, '0'), i: <Car className="w-6 h-6" />, c: "text-primary" },
                        { l: t('activePromos'), v: initialData.promos.length.toString().padStart(2, '0'), i: <Ticket className="w-6 h-6" />, c: "text-accent" },
                        {
                           l: t('rank'),
                           v: rank.l,
                           i: (
                              <div className="relative flex items-center justify-between w-full">
                                 <Zap className={`w-6 h-6 ${rank.c}`} />
                                 <button
                                    onClick={() => setShowRankInfo(!showRankInfo)}
                                    className="bg-white/5 hover:bg-white/10 p-1.5 rounded-full transition-colors relative"
                                 >
                                    <Info className="w-3 h-3 text-muted-foreground" />
                                    {showRankInfo && (
                                       <div className="absolute top-full right-0 mt-4 w-64 p-4 bg-card/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl z-50 animate-in fade-in zoom-in duration-200">
                                          <p className="text-[10px] font-bold text-foreground leading-relaxed uppercase tracking-wider">{t('rankExplanation')}</p>
                                          <div className="absolute bottom-full right-4 w-3 h-3 bg-card border-l border-t border-white/10 rotate-45 translate-y-1.5" />
                                       </div>
                                    )}
                                 </button>
                              </div>
                           ),
                           c: rank.c,
                           isSpecial: true
                        },
                     ].map((stat, i) => (
                        <div key={i} className="glass-panel p-8 rounded-3xl bg-card/40 border-white/5 flex flex-col justify-between h-48 relative group hover:bg-white/5 transition-all">
                           <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none group-hover:scale-110 group-hover:opacity-10 transition-all overflow-hidden rounded-tr-3xl">
                              {stat.i}
                           </div>
                           <div className={stat.c}>
                              {!stat.isSpecial && stat.i}
                              {stat.isSpecial && stat.i}
                           </div>
                           <div>
                              <div className={`text-2xl md:text-3xl font-black tracking-tighter mb-1 ${stat.isSpecial ? stat.c : ''}`}>{stat.v}</div>
                              <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest opacity-60">{stat.l}</div>
                           </div>
                        </div>
                     ))}
                  </div>

                  <div className="glass-panel p-10 rounded-[2.5rem] bg-card/60 border-white/10">
                     <h2 className="text-4xl font-black italic tracking-tighter uppercase mb-8">{t('latestUpdates').split(' ')[0]} <span className="text-primary italic">Updates</span></h2>
                     <div className="p-8 rounded-3xl bg-primary/10 border border-primary/20 text-sm font-medium text-foreground leading-relaxed italic">
                        {t('welcome')} {t('history')} ({initialData.bookings.length})
                     </div>
                  </div>
               </div>
            )}

            {/* ADMIN GUIDE TAB */}
            {activeTab === 'admin-guide' && (user?.role === 'admin' || user?.role === 'super_admin') && (
               <div className="glass-panel p-10 rounded-[2.5rem] bg-card/60 border-white/10">
                  <AdminWelcomeGuide />
               </div>
            )}

            {/* AGENT GUIDE TAB */}
            {activeTab === 'agent-guide' && user?.role === 'agent' && (
               <div className="glass-panel p-10 rounded-[2.5rem] bg-card/60 border-white/10">
                  <AgentWelcomeGuide />
               </div>
            )}

            {/* HISTORY TAB */}
            {activeTab === 'history' && (
               <div className="glass-panel p-10 rounded-[2.5rem] bg-card/60 border-white/10">
                  <div className="flex items-center justify-between mb-10">
                     <h2 className="text-4xl font-black italic tracking-tighter uppercase">{t('history').split(' ')[0]} <span className="text-primary italic">{t('history').split(' ').slice(1).join(' ')}</span></h2>
                     <div className="text-[10px] font-black uppercase tracking-widest opacity-40 italic">{t('sortedBy')}</div>
                  </div>

                  <div className="space-y-4">
                     {initialData.bookings.length === 0 ? (
                        <div className="p-12 text-center text-muted-foreground italic uppercase font-black text-xs opacity-40">{t('noMissions')}</div>
                     ) : (
                        initialData.bookings.map((booking, i) => (
                           <div
                              key={i}
                              onClick={() => setSelectedBooking(booking)}
                              className="flex flex-col md:flex-row items-center gap-8 p-6 rounded-3xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5 cursor-pointer group"
                           >
                              <div className="w-full md:w-32 aspect-square rounded-2xl bg-white/5 overflow-hidden relative shadow-lg shadow-black/20">
                                 {booking.vehicleId?.images?.[0] ? (
                                    <img src={booking.vehicleId.images[0]} className="w-full h-full object-cover group-hover:scale-110 transition-transform" alt="" />
                                 ) : (
                                    <div className="absolute inset-0 flex items-center justify-center opacity-20"><Car className="w-12 h-12" /></div>
                                 )}
                                 <div className={`absolute top-2 left-2 p-1.5 rounded-lg text-[8px] font-black uppercase tracking-widest ${booking.status === 'approved' ? 'bg-green-500/20 text-green-500' : booking.status === 'refused' ? 'bg-red-500/20 text-red-500' : 'bg-primary/20 text-primary'}`}>{t(booking.status)}</div>
                              </div>
                              <div className="flex-1 flex justify-between items-center w-full">
                                 <div>
                                    <div className="text-[10px] font-black uppercase text-muted-foreground mb-1">{t('deposit')} {new Date(booking.createdAt).toLocaleDateString()}</div>
                                    <h4 className="text-xl font-black tracking-tight mb-2 group-hover:text-primary transition-colors uppercase italic">{booking.vehicleId?.brand} {booking.vehicleId?.name}</h4>
                                    <div className="flex flex-wrap gap-4 text-xs font-semibold text-muted-foreground opacity-80">
                                       <span className="flex items-center gap-2 italic uppercase font-black tracking-widest"><Calendar className="w-3 h-3" /> {t('period')} {new Date(booking.startDate).toLocaleDateString()}</span>
                                    </div>
                                 </div>
                                 <ChevronRight className="w-5 h-5 opacity-40 group-hover:translate-x-2 group-hover:text-primary transition-all" />
                              </div>
                           </div>
                        ))
                     )}
                  </div>

                  {/* MODAL HISTORIQUE DETAILS */}
                  {selectedBooking && (
                     <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-fade-in" onClick={() => setSelectedBooking(null)}>
                        <div className="bg-card/90 border border-white/10 p-8 rounded-3xl w-full max-w-2xl shadow-2xl relative" onClick={e => e.stopPropagation()}>
                           <button onClick={() => setSelectedBooking(null)} className="absolute top-6 right-6 text-muted-foreground hover:text-white"><X className="w-6 h-6" /></button>

                           <div className="flex items-center gap-4 mb-8">
                              <div className="p-3 bg-primary/20 rounded-xl"><Car className="w-6 h-6 text-primary" /></div>
                              <div>
                                 <h3 className="text-2xl font-black uppercase italic tracking-tighter">{selectedBooking.vehicleId?.brand} {selectedBooking.vehicleId?.name}</h3>
                                 <p className="text-xs font-black uppercase text-muted-foreground tracking-widest">{t('requestDate')} {new Date(selectedBooking.createdAt).toLocaleDateString()}</p>
                              </div>
                           </div>

                           <div className="grid md:grid-cols-2 gap-6 mb-8">
                              <div className="p-6 bg-white/5 rounded-2xl border border-white/5 space-y-4">
                                 <div className="text-[10px] font-black text-primary uppercase tracking-widest opacity-60">{t('logistics')}</div>
                                 <div><span className="text-muted-foreground text-xs font-bold w-16 inline-block">{t('start')}</span> <span className="font-black text-sm">{new Date(selectedBooking.startDate).toLocaleDateString()}</span></div>
                                 <div><span className="text-muted-foreground text-xs font-bold w-16 inline-block">{t('end')}</span> <span className="font-black text-sm">{new Date(selectedBooking.endDate).toLocaleDateString()}</span></div>
                                 {selectedBooking.pickupLocation && selectedBooking.pickupLocation !== 'Dubai Hub' && (
                                    <div><span className="text-muted-foreground text-xs font-bold w-16 inline-block">{t('location')}</span> <span className="font-black text-sm">{selectedBooking.pickupLocation}</span></div>
                                 )}
                              </div>

                              <div className="p-6 bg-white/5 rounded-2xl border border-white/5 space-y-4">
                                 <div className="text-[10px] font-black text-primary uppercase tracking-widest opacity-60">{t('finance')}</div>
                                 <div><span className="text-muted-foreground text-xs font-bold w-16 inline-block">{t('status')}</span> <span className={`font-black uppercase text-sm ${selectedBooking.status === 'approved' ? 'text-green-500' : selectedBooking.status === 'refused' ? 'text-red-500' : 'text-primary'}`}>{t(selectedBooking.status)}</span></div>
                                 <div><span className="text-muted-foreground text-xs font-bold w-16 inline-block">{t('payment')}</span> <span className="font-black uppercase text-sm text-yellow-500">{selectedBooking.paymentStatus || 'Pending'}</span></div>
                                 <div><span className="text-muted-foreground text-xs font-bold w-16 inline-block">{t('total')}</span> <span className="font-black text-sm">{selectedBooking.totalPrice} €</span></div>
                              </div>
                           </div>

                           <div className="flex justify-end">
                              <Button onClick={() => setSelectedBooking(null)} variant="ghost" className="uppercase font-black tracking-widest text-xs">{t('close')}</Button>
                           </div>
                        </div>
                     </div>
                  )}
               </div>
            )}

            {/* PROMOS TAB */}
            {activeTab === 'promos' && (
               <div className="glass-panel p-10 rounded-[2.5rem] bg-card/60 border-white/10">
                  <h2 className="text-4xl font-black italic tracking-tighter uppercase mb-10">{t('availRewards').split(' ')[0]} <span className="text-accent italic">{t('availRewards').split(' ').slice(1).join(' ')}</span></h2>
                  <div className="grid sm:grid-cols-2 gap-6">
                     {initialData.promos.length === 0 ? (
                        <div className="col-span-2 p-12 text-muted-foreground italic uppercase font-black text-xs opacity-40 text-center">{t('noPromos')}</div>
                     ) : (
                        initialData.promos.map((promo, i) => (
                           <div key={i} className="p-8 rounded-[2rem] bg-gradient-to-br from-white/5 to-white/0 border border-white/5 relative overflow-hidden group">
                              <div className="absolute top-0 right-0 w-24 h-24 bg-accent/10 blur-[50px] -z-10" />
                              <div className="text-3xl font-black italic text-accent mb-2">-{promo.discount}% OFF</div>
                              <div className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground mb-6">{t('matrixCode')}</div>
                              <div className="bg-white/5 p-4 rounded-xl flex items-center justify-between border border-white/5">
                                 <span className="font-black font-mono text-lg tracking-widest text-primary">{promo.code}</span>
                                 <Button
                                    onClick={() => handleCopy(promo.code)}
                                    variant="ghost"
                                    size="sm"
                                    className={`text-[8px] font-black uppercase tracking-widest transition-all ${copiedCode === promo.code ? 'bg-green-500/20 text-green-500 hover:bg-green-500/30 hover:text-green-500' : ''}`}
                                 >
                                    {copiedCode === promo.code ? t('copied') : t('copy')}
                                 </Button>
                              </div>
                           </div>
                        ))
                     )}
                  </div>
               </div>
            )}

            {/* PROFILE TAB */}
            {activeTab === 'profile' && (
               <div className="glass-panel p-6 md:p-12 rounded-[2.5rem] bg-card/60 border-white/10 space-y-12">
                  <h2 className="text-4xl font-black italic tracking-tighter uppercase">{t('profile').split(' ')[0]} <span className="text-primary italic">{t('profile').split(' ').slice(1).join(' ')}</span></h2>

                  <form onSubmit={handleUpdateProfile} className="space-y-10">
                     <div className="grid md:grid-cols-2 gap-10">
                        <div className="space-y-4">
                           <Label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-2 italic">{t('firstName')}</Label>
                           <Input name="firstName" defaultValue={user?.firstName} className="bg-white/5 border-white/10 rounded-2xl h-16 font-bold text-sm px-6 hover:border-primary/40 transition-all outline-none focus:ring-0" />
                        </div>
                        <div className="space-y-4">
                           <Label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-2 italic">{t('lastName')}</Label>
                           <Input name="lastName" defaultValue={user?.lastName} className="bg-white/5 border-white/10 rounded-2xl h-16 font-bold text-sm px-6 hover:border-primary/40 transition-all outline-none focus:ring-0" />
                        </div>
                        <div className="space-y-4">
                           <Label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-2 italic">{t('phone')}</Label>
                           <Input name="phone" defaultValue={user?.phone} placeholder="+33 50 XXXXXX" className="bg-white/5 border-white/10 rounded-2xl h-16 font-bold text-sm px-6 hover:border-primary/40 transition-all outline-none focus:ring-0" />
                        </div>
                        <div className="space-y-4">
                           <Label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-2 italic">{t('dob')}</Label>
                           <Input name="birthDate" type="date" defaultValue={user?.birthDate ? new Date(user.birthDate).toISOString().split('T')[0] : ''} className="bg-white/5 border-white/10 rounded-2xl h-16 font-bold text-sm px-6 hover:border-primary/40 transition-all outline-none focus:ring-0" />
                        </div>
                        <div className="space-y-4">
                           <Label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-2 italic">{t('gender')}</Label>
                           <select name="gender" defaultValue={user?.gender || 'male'} className="w-full bg-white/5 border-white/10 rounded-2xl h-16 font-bold text-sm px-6 outline-none appearance-none hover:border-primary/40 transition-all">
                              <option value="male" className="bg-card text-foreground">{t('male')}</option>
                              <option value="female" className="bg-card text-foreground">{t('female')}</option>
                              <option value="other" className="bg-card text-foreground">{t('other')}</option>
                           </select>
                        </div>
                     </div>

                     <div className="pt-6 border-t border-white/5 space-y-10">
                        <h3 className="text-xl font-black italic tracking-tighter uppercase text-primary">{t('changePasswordTitle')}</h3>
                        <div className="grid md:grid-cols-2 gap-10">
                           <div className="space-y-4">
                              <Label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-2 italic">{t('newPasswordLabel')}</Label>
                              <Input name="password" type="password" placeholder={t('passwordPlaceholder')} className="bg-white/5 border-white/10 rounded-2xl h-16 font-bold text-sm px-6 hover:border-primary/40 transition-all outline-none focus:ring-0" />
                           </div>
                           <div className="space-y-4">
                              <Label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-2 italic">{t('confirmPasswordLabel')}</Label>
                              <Input name="confirmPassword" type="password" placeholder={t('passwordPlaceholder')} className="bg-white/5 border-white/10 rounded-2xl h-16 font-bold text-sm px-6 hover:border-primary/40 transition-all outline-none focus:ring-0" />
                           </div>
                        </div>
                     </div>

                     <div className="pt-8 space-y-4">
                        {errorStatus && (
                           <p className="text-red-500 text-xs font-bold uppercase tracking-widest text-center animate-shake">{errorStatus}</p>
                        )}
                        {success && (
                           <p className="text-green-500 text-xs font-bold uppercase tracking-widest text-center">{t('passwordSuccess')}</p>
                        )}
                        <Button type="submit" disabled={loading} className={`w-full h-20 rounded-[1.5rem] font-black text-xs uppercase tracking-[0.4em] transition-all shadow-2xl ${success ? 'bg-green-500 hover:bg-green-600' : 'bg-primary hover:bg-primary/90 shadow-primary/20'}`}>
                           {loading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : success ? <CheckCircle2 className="w-6 h-6 mx-auto" /> : t('update')}
                        </Button>
                     </div>
                  </form>

                  <div className="p-8 rounded-3xl bg-white/5 border border-white/5">
                     <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-40 mb-2 italic underline underline-offset-4 decoration-primary">{t('securityContext')}</div>
                     <p className="text-xs font-semibold text-muted-foreground opacity-60">{t('digitalAddress')}: {user?.email} {t('clearance')}</p>
                  </div>
               </div>
            )}

         </div>
      </div>
   )
}
