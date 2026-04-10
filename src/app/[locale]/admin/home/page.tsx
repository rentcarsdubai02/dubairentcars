import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { redirect } from 'next/navigation'
import { BrandManager } from '@/components/shared/brand-manager'
import { setRequestLocale, getTranslations } from 'next-intl/server'

export default async function AdminHomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('AdminHome')
  const session = await getServerSession(authOptions)
  const user = session?.user as any
  if (!user || !['admin', 'super_admin', 'agent'].includes(user.role)) {
    redirect('/')
  }

  return (
    <main className="min-h-screen pt-32 pb-24 bg-background relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-0 right-0 w-[40%] h-[30%] bg-primary/5 blur-[150px] -z-10" />
      <div className="absolute bottom-0 left-0 w-[30%] h-[40%] bg-accent/5 blur-[150px] -z-10" />

      <div className="container px-6 mx-auto relative z-10">
        {/* Page Header */}
        <div className="mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.4em] rounded-full border border-primary/20">
            {t('badge')}
          </div>
          <h1 className="text-6xl font-black italic tracking-tighter uppercase leading-none">
            {t('title1')} <span className="text-primary italic">{t('title2')}</span>
          </h1>
          <p className="max-w-2xl text-sm font-medium text-muted-foreground opacity-60">
            {t('subtitle')}
          </p>
        </div>

        {/* Home Management Sections (Accordion or Tabs if more added later) */}
        <div className="space-y-24">
           {/* Section 1: Brand Grid */}
           <section>
              <BrandManager />
           </section>
        </div>
      </div>
    </main>
  )
}
