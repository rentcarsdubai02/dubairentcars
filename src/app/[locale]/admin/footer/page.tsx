import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { redirect } from 'next/navigation'
import { FooterManager } from '@/components/shared/footer-manager'
import { Link } from '@/i18n/routing'
import {
  LayoutTemplate, Users, Car, MapPin, Ticket, BarChart3, ChevronRight
} from 'lucide-react'

import { setRequestLocale, getTranslations } from 'next-intl/server'

export default async function AdminFooterPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('AdminFooter')
  const tn = await getTranslations('Navigation')
  const session = await getServerSession(authOptions)
  const user = session?.user as any
  if (!user || !['admin', 'super_admin'].includes(user.role)) {
    redirect('/')
  }

  return (
    <main className="min-h-screen pt-32 pb-24 bg-background relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[40%] h-[30%] bg-primary/5 blur-[150px] -z-10" />

      <div className="container px-6 mx-auto relative z-10">
        {/* Page Header */}
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

        {/* Main Content */}
        <div>
          <FooterManager />
        </div>
      </div>
    </main>
  )
}
