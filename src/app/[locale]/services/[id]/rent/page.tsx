import { setRequestLocale, getTranslations } from 'next-intl/server'
import { Suspense } from 'react'
import { getVehicleById } from "@/actions/vehicle-actions"
import { BookingForm } from "@/components/shared/booking-form"
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { Link } from '@/i18n/routing'
import { getLocations } from "@/actions/location-actions"
import connectToDatabase from '@/lib/mongodb'
import PromoCode from '@/models/PromoCode'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import User from '@/models/User'
import Booking from '@/models/Booking'

export default async function RentalPage({ params }: { params: Promise<{ locale: string, id: string }> }) {
  const { locale, id } = await params
  setRequestLocale(locale)
  const t = await getTranslations('Services')

  await connectToDatabase()
  const activePromoCount = await PromoCode.countDocuments({ isActive: true })
  const hasActivePromos = activePromoCount > 0

  // Fetch reserved dates (Only Approved/Confirmed bookings)
  const reservedBookings = await Booking.find({
    vehicleId: id,
    status: { $in: ['approved', 'confirmed'] }
  }).select('startDate endDate').lean()

  const reservedDates = reservedBookings.map((b: any) => ({
    from: b.startDate,
    to: b.endDate
  }))

  const [vehicle, locations] = await Promise.all([
    getVehicleById(id),
    getLocations(true)
  ])

  if (!vehicle) notFound()

  // Fetch logged-in user profile to pre-fill the booking form
  const session = await getServerSession(authOptions)
  let currentUser = null
  if (session?.user) {
    const userId = (session.user as any).id
    const userDoc = await User.findById(userId).select('firstName lastName email phone').lean()
    if (userDoc) currentUser = JSON.parse(JSON.stringify(userDoc))
  }

  return (
    <main className="min-h-screen pt-20 pb-12 bg-background relative overflow-hidden">
      <div className="absolute top-0 left-0 w-[50%] h-[100vh] bg-primary/5 blur-[150px] -z-10" />
      <div className="container px-6 mx-auto relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8 flex items-center gap-6 relative z-50">
            <Link href={`/services/${vehicle._id}`} className="group p-3 bg-white/5 hover:bg-primary/10 border border-white/10 rounded-2xl transition-all hover:scale-110 active:scale-95 shadow-xl">
              <ArrowLeft className="w-5 h-5 text-primary group-hover:-translate-x-1 transition-transform" />
            </Link>
            <div>
              <h1 className="text-4xl md:text-5xl font-black italic tracking-tighter uppercase leading-none">
                Rental <span className="text-primary italic">Contract</span>
              </h1>
            </div>
          </div>

          <Suspense fallback={<div className="h-[800px] flex items-center justify-center text-primary font-black uppercase shadow-2xl rounded-[3.5rem] bg-card/60 border border-white/10 animate-pulse">Initializing Matrix Deployment Protocol...</div>}>
            <BookingForm 
              vehicle={vehicle} 
              locations={locations} 
              hasActivePromos={hasActivePromos} 
              user={currentUser}
              reservedDates={JSON.parse(JSON.stringify(reservedDates))}
            />
          </Suspense>
        </div>
      </div>
    </main>
  )
}

