import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { redirect } from 'next/navigation'
import { getContactConfig, updateContactConfig, getContactMessages, deleteContactMessage, markMessagesAsRead } from '@/actions/contact-actions'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { MessageSquare, Phone, Mail, Save, Trash2 } from "lucide-react"

export const dynamic = 'force-dynamic'

export default async function AdminContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('AdminContact')
  const session = await getServerSession(authOptions)
  const user = session?.user as any
  if (!user || !['admin', 'super_admin', 'agent'].includes(user.role)) {
    redirect('/')
  }

  const config = await getContactConfig()
  const messages = await getContactMessages()
  await markMessagesAsRead()

  return (
    <main className="min-h-screen pt-32 pb-24 bg-background relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[40%] h-[30%] bg-primary/5 blur-[150px] -z-10" />

      <div className="container px-6 mx-auto relative z-10">
        <div className="mb-12 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.4em] rounded-full border border-primary/20">
            {t('badge')}
          </div>
          <h1 className="text-5xl font-black italic tracking-tighter uppercase leading-none">
            {t('title1')} <span className="text-primary italic">{t('title2')}</span>
          </h1>
          <p className="text-sm font-medium text-muted-foreground opacity-60">
            {t('subtitle')}
          </p>
        </div>

        <div className="glass-panel p-10 lg:p-14 rounded-[3.5rem] bg-card/60 border-white/10 relative overflow-hidden max-w-4xl">
          <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
            <MessageSquare className="w-56 h-56" />
          </div>

          <form action={async (formData) => {
            'use server'
            await updateContactConfig(formData)
          }} className="space-y-12">
            
            <div className="space-y-8">
               <h3 className="text-2xl font-black italic tracking-wider flex items-center gap-4">
                  {t('pageSubtitle')} <div className="h-px flex-1 bg-white/5" />
               </h3>
               
               <div className="grid grid-cols-1 gap-8">
                  <div className="space-y-3">
                     <label className="text-[10px] font-black uppercase tracking-widest opacity-60 ml-2">{t('labelSubtitleFR')}</label>
                     <Textarea name="subtitle_fr" defaultValue={config?.subtitle_fr} required className="bg-white/5 border-white/10 rounded-2xl h-24 font-bold text-sm px-6 py-4 focus:border-primary/50 transition-all ring-0" placeholder={t('pageSubtitlePlaceholder')} />
                  </div>
                  
                  <div className="space-y-3">
                     <label className="text-[10px] font-black uppercase tracking-widest opacity-60 ml-2">{t('labelSubtitleEN')}</label>
                     <Textarea name="subtitle_en" defaultValue={config?.subtitle_en} required className="bg-white/5 border-white/10 rounded-2xl h-24 font-bold text-sm px-6 py-4 focus:border-primary/50 transition-all ring-0" placeholder={t('pageSubtitlePlaceholder')} />
                  </div>
                  
                  <div className="space-y-3">
                     <label className="text-[10px] font-black uppercase tracking-widest opacity-60 ml-2">{t('labelSubtitleAR')}</label>
                     <Textarea name="subtitle_ar" defaultValue={config?.subtitle_ar} required className="bg-white/5 border-white/10 rounded-2xl h-24 font-bold text-sm px-6 py-4 focus:border-primary/50 transition-all ring-0 dir-rtl text-right" placeholder={t('pageSubtitlePlaceholder')} />
                  </div>
               </div>
            </div>

            <div className="space-y-6">
               <h3 className="text-2xl font-black italic tracking-wider flex items-center gap-4">
                  {t('directLineTitle')} <div className="h-px flex-1 bg-white/5" />
               </h3>
               
               <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                     <label className="text-[10px] font-black uppercase tracking-widest opacity-60 ml-2 flex items-center gap-2">
                        <Phone className="w-4 h-4" /> {t('phoneLabel')}
                     </label>
                     <Input name="phone" defaultValue={config?.phone} required className="bg-white/5 border-white/10 rounded-2xl h-16 font-bold text-sm px-6" />
                  </div>
                  
                  <div className="space-y-2">
                     <label className="text-[10px] font-black uppercase tracking-widest opacity-60 ml-2 flex items-center gap-2">
                        <Mail className="w-4 h-4" /> {t('emailLabel')}
                     </label>
                     <Input name="email" defaultValue={config?.email} required type="email" className="bg-white/5 border-white/10 rounded-2xl h-16 font-bold text-sm px-6" />
                  </div>
               </div>
            </div>

            <div className="pt-8 border-t border-white/5 flex justify-end">
               <Button type="submit" className="h-16 px-12 rounded-[1.5rem] bg-white text-black hover:bg-primary hover:text-white font-black text-xs uppercase tracking-[0.2em] transition-all group shadow-2xl shadow-white/10 flex items-center gap-4">
                  {t('save')} <Save className="w-5 h-5 group-hover:scale-110 transition-transform" />
               </Button>
            </div>
          </form>
        </div>

        <div className="mt-16 glass-panel p-10 lg:p-14 rounded-[3.5rem] bg-card/60 border-white/10 relative overflow-hidden max-w-4xl">
           <div className="space-y-8">
              <div className="space-y-4">
                 <h2 className="text-3xl font-black italic uppercase tracking-tighter">{t('messagesTitle')}</h2>
                 <p className="text-sm font-medium text-muted-foreground opacity-60">{t('messagesSubtitle')}</p>
              </div>

              <div className="space-y-4">
                 {messages.length === 0 ? (
                   <div className="glass-panel p-10 rounded-[2.5rem] bg-card/40 border-dashed border-white/10 text-center">
                     <p className="text-xs uppercase font-black tracking-widest text-muted-foreground opacity-40 italic">{t('noMessages')}</p>
                   </div>
                 ) : messages.map((msg: any) => (
                   <div key={msg._id} className="glass-panel p-8 rounded-[2.5rem] border border-white/5 group hover:border-primary/20 transition-all">
                      <div className="flex justify-between items-start gap-4 mb-4">
                         <div>
                            <div className="text-[10px] font-black uppercase tracking-widest text-primary mb-1">{t('sender')}</div>
                            <h4 className="text-xl font-black tracking-tight">{msg.name}</h4>
                            <p className="text-sm font-bold text-muted-foreground">{msg.email}</p>
                         </div>
                         <div className="flex flex-col items-end gap-2">
                            <span className="text-xs font-medium opacity-50">{new Date(msg.createdAt).toLocaleDateString()}</span>
                            <form action={async () => { 'use server'; await deleteContactMessage(msg._id); }}>
                               <Button type="submit" variant="ghost" className="w-10 h-10 rounded-xl bg-white/5 hover:bg-red-500/20 text-muted-foreground hover:text-red-500 transition-all p-0">
                                  <Trash2 className="w-4 h-4" />
                               </Button>
                            </form>
                         </div>
                      </div>
                      <div className="p-5 rounded-2xl bg-white/5 text-sm font-medium leading-relaxed opacity-80">
                         {msg.message}
                      </div>
                   </div>
                 ))}
              </div>
           </div>
        </div>
      </div>
    </main>
  )
}
