import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { getAllBookings } from '@/actions/booking-actions'
import { StatistiquesClient } from '@/components/shared/statistiques-client'
import { setRequestLocale } from 'next-intl/server'

export default async function StatistiquesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)

  // Protection serveur : seuls admin/agent/super_admin peuvent accéder
  const session = await getServerSession(authOptions)
  if (!session) redirect(`/${locale}/login`)

  const role = (session.user as any).role
  if (!['super_admin', 'admin', 'agent'].includes(role)) redirect('/')

  // Fetch des réservations côté serveur (pas de problème d'auth)
  const bookings = await getAllBookings()

  return (
    <main className="min-h-screen pt-32 pb-24 bg-background relative overflow-hidden">
      <div className="absolute top-0 right-0 w-1/2 h-screen bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-1/3 h-screen bg-accent/5 blur-[100px] rounded-full pointer-events-none" />
      <StatistiquesClient initialBookings={bookings} />
    </main>
  )
}
