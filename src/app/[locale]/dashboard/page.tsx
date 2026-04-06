import { setRequestLocale } from 'next-intl/server'
import { getClientDashboardData } from '@/actions/user-actions'
import { ClientDashboard } from '@/components/shared/client-dashboard'
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'

export default async function DashboardPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)

  const session = await getServerSession(authOptions)
  if (!session) {
    redirect(`/${locale}/login`)
  }

  const { success, user, bookings, promos, error } = await getClientDashboardData()

  if (!success) {
     return <div className="min-h-screen pt-32 text-center text-red-500 font-bold uppercase">{error}</div>
  }

  const initialData = { user: user as any, bookings: (bookings || []) as any[], promos: (promos || []) as any[] }

  return (
    <main className="min-h-screen pt-32 pb-24 bg-background relative overflow-hidden">
      {/* Dynamic Background Effects */}
      <div className="absolute top-0 right-0 w-1/2 h-screen bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-1/2 h-screen bg-accent/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="container px-6 mx-auto relative z-10">
         <ClientDashboard initialData={initialData} />
      </div>
    </main>
  )
}
