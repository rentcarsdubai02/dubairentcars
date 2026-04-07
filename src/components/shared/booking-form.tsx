'use client'

import { useTranslations, useLocale } from 'next-intl'
import * as React from 'react'
import { fr, ar, enUS } from 'date-fns/locale'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import { createBooking } from "@/actions/booking-actions"
import { validatePromoCode } from "@/actions/promo-actions"
import {
   Zap,
   ChevronRight,
   CheckCircle2,
   Download,
   Printer,
   Mail,
   ArrowLeft,
   ShieldCheck,
   Clock,
   MapPin,
   Timer,
   Building2,
   Activity,
   Gauge,
   CalendarDays,
   Loader2,
   Info
} from "lucide-react"
import {
   Dialog,
   DialogContent,
   DialogHeader,
   DialogTitle,
   DialogTrigger,
} from "@/components/ui/dialog"
import { Link } from '@/i18n/routing'
import { useRouter } from 'next/navigation'
import { DateRange } from "react-day-picker"
import { addDays, format, isWithinInterval, startOfDay } from "date-fns"

interface BookingFormProps {
   vehicle: any;
   locations: any[];
   hasActivePromos?: boolean;
   user?: any | null;
   reservedDates?: { from: Date | string, to: Date | string }[];
}

export function BookingForm({ vehicle, locations, hasActivePromos = false, user, reservedDates = [] }: BookingFormProps) {
   const t = useTranslations('Rental')
   const currentLocale = useLocale()

   const calendarLocale = React.useMemo(() => {
      if (currentLocale === 'fr') return fr
      if (currentLocale === 'ar') return ar
      return enUS
   }, [currentLocale])
   const [loading, setLoading] = React.useState(false)
   const [success, setSuccess] = React.useState(false)
   const [bookingData, setBookingData] = React.useState<any>(null)
   const [showCancelPolicy, setShowCancelPolicy] = React.useState(false)

   // Convert reservedDates to Date objects for react-day-picker
   const disabledDates = reservedDates.map(d => ({
      from: new Date(d.from),
      to: new Date(d.to)
   }))

   const [dateRange, setDateRange] = React.useState<DateRange | undefined>()
   const [mounted, setMounted] = React.useState(false)

   React.useEffect(() => {
      setMounted(true)
      setDateRange({
         from: addDays(new Date(), 1),
         to: addDays(new Date(), 2)
      })
   }, [])

   // Calculate days based on selected range
   const days = (mounted && dateRange?.from && dateRange?.to)
      ? Math.ceil((dateRange.to.getTime() - dateRange.from.getTime()) / (1000 * 60 * 60 * 24)) + 1
      : 1
   const [promoCodeInput, setPromoCodeInput] = React.useState('')
   const [promoResult, setPromoResult] = React.useState<{ discount: number, code: string } | null>(null)
   const [promoError, setPromoError] = React.useState<string | null>(null)
   const [checkingPromo, setCheckingPromo] = React.useState(false)
   const router = useRouter()

   const handleApplyPromo = async () => {
      if (!promoCodeInput) return;
      setCheckingPromo(true)
      setPromoError(null)
      const res = await validatePromoCode(promoCodeInput)
      if (res.success) {
         setPromoResult({ discount: res.discount, code: res.code })
      } else {
         setPromoError(res.error || 'Erreur de validation')
         setPromoResult(null)
      }
      setCheckingPromo(false)
   }

   const basePrice = days * (vehicle.pricePerDay || 0)
   const discountAmount = promoResult ? (basePrice * (promoResult.discount / 100)) : 0
   const totalPrice = basePrice - discountAmount

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault()
      if (!dateRange?.from || !dateRange?.to) {
         alert("Please select a valid date range.")
         return
      }

      setLoading(true)
      const formData = new FormData(e.target as HTMLFormElement)

      try {
         const res = await createBooking({
            vehicleId: vehicle._id,
            clientName: formData.get('name') as string,
            clientEmail: formData.get('email') as string,
            clientPhone: formData.get('phone') as string,
            idNumber: formData.get('license') as string,
            startDate: dateRange.from,
            endDate: dateRange.to,
            pickupLocation: formData.get('pickup') as string,
            returnLocation: formData.get('return') as string,
            totalPrice
         })

         if (res.success) {
            setBookingData(res.booking)
            setSuccess(true)
         }
      } catch (err) {
         console.error(err)
      } finally {
         setLoading(false)
      }
   }

   const handlePrint = () => {
      window.print()
   }

   const handleDownload = async () => {
      const jsPDF = (await import('jspdf')).default
      const doc = new jsPDF('p', 'mm', 'a4')

      doc.setFillColor(10, 10, 10); doc.rect(0, 0, 210, 297, 'F')
      doc.setTextColor(0, 242, 254); doc.setFontSize(22); doc.setFont('helvetica', 'bolditalic'); doc.text(t('agencyName').toUpperCase(), 20, 30)
      doc.setFontSize(10); doc.setFont('helvetica', 'normal'); doc.setTextColor(150, 150, 150); doc.text(t('rentalContract'), 20, 38)
      doc.setDrawColor(0, 242, 254); doc.setLineWidth(0.5); doc.line(20, 45, 190, 45)

      doc.setTextColor(255, 255, 255); doc.setFontSize(14); doc.setFont('helvetica', 'bold'); doc.text(t('clientInfo').toUpperCase(), 20, 60)
      doc.setFontSize(11); doc.setFont('helvetica', 'normal'); doc.text(`${t('clientName')}: ${bookingData?.clientName}`, 25, 70)
      doc.text(`${t('emailAddress')}: ${bookingData?.clientEmail}`, 25, 78); doc.text(`${t('phone')}: ${bookingData?.clientPhone}`, 25, 86)
      doc.text(`${t('license')}: ${bookingData?.idNumber}`, 25, 94)

      doc.setFontSize(14); doc.setFont('helvetica', 'bold'); doc.text(t('vehicleConfig').toUpperCase(), 20, 110)
      doc.setFontSize(11); doc.setFont('helvetica', 'normal'); doc.text(`${vehicle.brand} ${vehicle.name}`, 25, 120)
      doc.text(`${t('kmIncluded')}: ${vehicle.kilometersIncluded} Km`, 25, 128); 
      doc.text(`${t('extraKmFee')}: ${vehicle.extraPricePerKm} €`, 25, 136)
      doc.text(`${t('deposit')}: ${vehicle.deposit} €`, 25, 144)
      doc.text(`${t('modelYearLabel')}: ${vehicle.modelYear}`, 25, 152)

      doc.setFontSize(14); doc.setFont('helvetica', 'bold'); doc.text(t('duration').toUpperCase(), 20, 160)
      doc.setFontSize(11); doc.setFont('helvetica', 'normal'); doc.text(`${t('startDateLabel')}: ${new Date(bookingData?.startDate).toLocaleString()}`, 25, 170)
      doc.text(`${t('endDateLabel')}: ${new Date(bookingData?.endDate).toLocaleString()}`, 25, 178)
      doc.text(`${t('pickup')}: ${bookingData?.pickupLocation}`, 25, 186); doc.text(`${t('return')}: ${bookingData?.returnLocation}`, 25, 194)

      doc.setFillColor(30, 30, 30); doc.rect(20, 210, 170, 30, 'F')
      doc.setTextColor(0, 242, 254); doc.setFontSize(16); doc.setFont('helvetica', 'bold'); doc.text(t('total').toUpperCase(), 110, 228); doc.text(`${bookingData?.totalPrice} €`, 150, 228)

      doc.setDrawColor(0, 242, 254); doc.setLineWidth(0.5); doc.line(20, 250, 190, 250)
      doc.setTextColor(255, 255, 255); doc.setFontSize(10); doc.setFont('helvetica', 'italic'); doc.text(`${t('cancellationRemark')}`, 20, 260, { maxWidth: 170 })
      doc.setFont('helvetica', 'bold'); doc.text(t('idVerification'), 20, 280); doc.text(`${t('transactionHub')}: ${bookingData?._id}`, 110, 280)

      doc.save(`DUBAI_RENT_CAR_REQUEST_${bookingData?._id?.slice(-6)}.pdf`)
   }

   const [sendingEmail, setSendingEmail] = React.useState(false)
   const [emailStatus, setEmailStatus] = React.useState<null | 'success' | 'error'>(null)

   const handleSendEmail = async () => {
      setSendingEmail(true)
      try {
         const { sendBookingEmail } = await import('@/actions/email-actions')
         const res = await sendBookingEmail(bookingData, vehicle)
         if (res.success) {
            setEmailStatus('success')
            setTimeout(() => setEmailStatus(null), 5000)
         } else {
            setEmailStatus('error')
         }
      } catch (err) {
         setEmailStatus('error')
      } finally {
         setSendingEmail(false)
      }
   }

   if (success) {
      return (
         <div className="glass-panel p-16 rounded-[4rem] bg-card/60 border-white/10 text-center space-y-12 animate-fade-in print:p-0 print:border-none print:shadow-none">
            {/* Success Header */}
            <div className="flex flex-col items-center gap-6">
               <div className="bg-primary/20 p-8 rounded-full animate-pulse border border-primary/30">
                  <CheckCircle2 className="w-20 h-20 text-primary" />
               </div>
               <div>
                  <h2 className="text-6xl font-black italic tracking-tighter uppercase leading-none">{t('success')}</h2>
                  <p className="text-muted-foreground opacity-60 uppercase font-black text-[10px] tracking-[0.4em] mt-4">{t('transactionHub')}: {bookingData?._id?.toUpperCase()}</p>
               </div>
            </div>

            <div className="p-4 rounded-3xl bg-primary/10 border border-primary/20 text-primary text-sm font-black uppercase tracking-widest flex items-center justify-center gap-4 py-8 animate-bounce">
               <Timer className="w-5 h-5" /> {t('visitInstruction')}
            </div>

            {/* Tactical Document (for Print) */}
            <div id="booking-request-card" className="p-12 rounded-[2.5rem] bg-white/5 border border-white/5 text-left space-y-10 relative overflow-hidden">
               <div className="flex justify-between items-start border-b border-white/5 pb-8 relative z-10">
                  <div className="space-y-2">
                     <div className="flex items-center gap-2 text-primary font-black text-xs uppercase tracking-widest mb-2">
                        <Building2 className="w-4 h-4" /> {t('agencyName')}
                     </div>
                     <h4 className="text-3xl font-black italic uppercase tracking-tighter">{vehicle.brand} {vehicle.name}</h4>
                  </div>
                  <div className="text-right">
                     <div className="text-[10px] font-black text-muted-foreground mb-1 uppercase tracking-widest opacity-40">{t('total')}</div>
                     <span className="text-4xl font-black text-primary italic">{bookingData?.totalPrice} €</span>
                  </div>
               </div>

               <div className="grid md:grid-cols-2 gap-12 relative z-10">
                  <div className="space-y-6">
                     <div>
                        <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-40 mb-2">{t('clientInfo')}</div>
                        <div className="text-lg font-black uppercase italic">{bookingData?.clientName}</div>
                     </div>
                     <div>
                        <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-40 mb-2">{t('license')}</div>
                        <div className="text-sm font-black uppercase tracking-tighter">{bookingData?.idNumber}</div>
                     </div>
                  </div>
                  <div className="space-y-6">
                     <div>
                        <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-40 mb-2">{t('pickup')}</div>
                        <div className="text-sm font-black uppercase tracking-tighter flex items-center gap-2">
                           <MapPin className="w-4 h-4 text-primary" /> {bookingData?.pickupLocation}
                        </div>
                     </div>
                     <div>
                        <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-40 mb-2">{t('duration')}</div>
                        <div className="text-sm font-black uppercase tracking-tighter flex items-center gap-2 italic">
                           <CalendarDays className="w-4 h-4 text-primary" /> {new Date(bookingData?.startDate).toLocaleDateString()} {'->'} {new Date(bookingData?.endDate).toLocaleDateString()}
                        </div>
                     </div>
                  </div>
               </div>
            </div>

            {/* Action Controls */}
            <div className="flex flex-wrap justify-center gap-6 print:hidden">
               <Button onClick={handlePrint} className="h-20 px-12 rounded-3xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center gap-3 font-black text-xs uppercase tracking-widest">
                  <Printer className="w-5 h-5 text-primary" /> {t('print')}
               </Button>
               <Button onClick={handleDownload} className="h-20 px-12 rounded-3xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center gap-3 font-black text-xs uppercase tracking-widest">
                  <Download className="w-5 h-5 text-accent" /> {t('download')}
               </Button>
               <Button
                  onClick={handleSendEmail}
                  disabled={sendingEmail}
                  className={`h-20 px-12 rounded-3xl flex items-center gap-3 font-black text-xs uppercase tracking-widest transition-all shadow-2xl ${emailStatus === 'success' ? 'bg-green-500 text-white' : 'bg-primary text-primary-foreground shadow-primary/30'}`}
               >
                  {sendingEmail ? <Loader2 className="w-5 h-5 animate-spin" /> : <Mail className="w-5 h-5" />}
                  {emailStatus === 'success' ? "Envoyé !" : t('email')}
               </Button>
            </div>
         </div>
      )
   }

   return (
      <div className="grid lg:grid-cols-[1.3fr_0.7fr] gap-8 md:gap-12 items-start">
         <div className="glass-panel p-6 sm:p-8 rounded-[2.5rem] bg-card/60 border-white/10 space-y-6 md:space-y-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-[100px] -z-10" />

            <div className="space-y-3">
               <div className="flex items-center gap-2 text-primary text-[9px] font-black uppercase tracking-[0.4em] mb-2">
                  <Building2 className="w-3.5 h-3.5" /> {t('agencyName')}
               </div>
               <h3 className="text-3xl font-black uppercase italic tracking-tighter leading-none">
                  {t('bookTitle')}
               </h3>
            </div>

            <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6">
               {/* Section 01: Client Intelligence */}
               <div className="space-y-4">
                  <h4 className="text-[9px] font-black uppercase tracking-widest text-primary flex items-center gap-2">
                     <ShieldCheck className="w-3.5 h-3.5" /> {t('clientInfo')}
                     {user && (
                        <span className="ml-auto px-2 py-0.5 bg-green-500/15 text-green-400 text-[8px] font-black uppercase tracking-widest rounded-full border border-green-500/30">
                           ✓ {t('autoFilled')}
                        </span>
                     )}
                  </h4>
                  <div className="space-y-3">
                     <div className="space-y-1">
                        <Label className="text-[9px] font-black uppercase tracking-widest opacity-60 ml-1">{t('clientName')}</Label>
                        <Input
                           name="name"
                           required
                           defaultValue={user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() : ''}
                           className="bg-white/5 border-white/10 rounded-xl h-11 font-bold text-xs px-4"
                           placeholder="Driver Name"
                        />
                     </div>
                     <div className="space-y-1">
                        <Label className="text-[9px] font-black uppercase tracking-widest opacity-60 ml-1">{t('emailAddress')}</Label>
                        <Input
                           name="email"
                           type="email"
                           required
                           defaultValue={user?.email || ''}
                           className="bg-white/5 border-white/10 rounded-xl h-11 font-bold text-xs px-4"
                           placeholder="driver@sector01.ae"
                        />
                     </div>
                     <div className="space-y-1">
                        <Label className="text-[9px] font-black uppercase tracking-widest opacity-60 ml-1">{t('phone')}</Label>
                        <Input
                           name="phone"
                           required
                           defaultValue={user?.phone || ''}
                           className="bg-white/5 border-white/10 rounded-xl h-11 font-bold text-xs px-4"
                           placeholder="+971 XX XXXXXX"
                        />
                     </div>
                     <div className="space-y-1">
                        <Label className="text-[9px] font-black uppercase tracking-widest opacity-60 ml-1">{t('license')}</Label>
                        <Input name="license" required className="bg-white/5 border-white/10 rounded-xl h-11 font-bold text-xs px-4" placeholder="PASSPORT / ID NUMBER" />
                     </div>
                  </div>
               </div>

               {/* Section 02: Fleet Logistics */}
               <div className="space-y-4">
                  <h4 className="text-[9px] font-black uppercase tracking-widest text-primary flex items-center gap-2">
                     <Clock className="w-3.5 h-3.5" /> {t('duration')}
                  </h4>
                  <div className="space-y-4">
                     <div className="space-y-2">
                        <div className="flex items-center justify-between px-1">
                           <Label className="text-[9px] font-black uppercase tracking-widest opacity-60">Timeline</Label>
                           <span className="text-[7px] font-black uppercase tracking-widest text-primary flex items-center gap-1">
                              Start • End
                           </span>
                        </div>

                        <div className="bg-white/5 border border-white/10 rounded-[2rem] p-3 flex flex-col items-center justify-center shadow-inner overflow-hidden md:aspect-square md:w-[320px] md:mx-auto">
                           <div className="w-full overflow-hidden scrollbar-hide flex justify-center py-1">
                              <Calendar
                                 mode="range"
                                 numberOfMonths={1}
                                 selected={dateRange}
                                 onSelect={setDateRange}
                                 disabled={[{ before: new Date(new Date().setHours(0, 0, 0, 0)) }, ...disabledDates]}
                                 locale={calendarLocale}
                                 style={{ "--cell-size": "2.4rem" } as any}
                                 className="p-0 border-none bg-transparent w-full"
                                 classNames={{
                                    month_caption: "flex justify-center items-center h-8 mb-4 relative",
                                    caption_label: "text-base font-black italic uppercase tracking-tighter text-primary px-4",
                                    nav: "flex items-center justify-between absolute inset-x-0 w-full z-20 px-1",
                                    button_previous: "hover:bg-primary/20 hover:text-white transition-colors p-2 rounded-lg",
                                    button_next: "hover:bg-primary/20 hover:text-white transition-colors p-2 rounded-lg",
                                    table: "w-full border-collapse mx-auto",
                                    weekdays: "grid grid-cols-7 w-full",
                                    weekday: "text-muted-foreground font-black text-[7px] uppercase tracking-widest flex items-center justify-center h-8",
                                    week: "grid grid-cols-7 w-full mt-1",
                                    day: "h-(--cell-size) w-full p-0 font-black text-[10px] transition-all hover:scale-105 flex items-center justify-center"
                                 }}
                                 modifiers={{ reserved: disabledDates }}
                                 modifiersStyles={{
                                    reserved: {
                                       backgroundColor: '#ff3333',
                                       color: '#ffffff',
                                       fontWeight: '900',
                                       boxShadow: '0 0 30px rgba(255, 0, 0, 0.5)',
                                       borderRadius: '16px'
                                    }
                                 }}
                              />
                           </div>
                        </div>
                        {dateRange?.from && dateRange?.to && (
                           <div className="px-6 py-5 bg-primary/10 border border-primary/20 rounded-2xl flex justify-between items-center animate-fade-in shadow-2xl">
                              <div className="flex flex-col gap-0.5">
                                 <span className="text-[10px] font-black uppercase tracking-widest text-primary opacity-60">Deployment Window</span>
                                 <span className="text-sm font-black italic uppercase">{format(dateRange.from, 'PP')} — {format(dateRange.to, 'PP')}</span>
                              </div>
                              <div className="text-right">
                                 <div className="text-[9px] font-black uppercase tracking-widest opacity-40">{days} {days > 1 ? "Days" : "Day"}</div>
                              </div>
                           </div>
                        )}
                     </div>


                     <div className="space-y-1">
                        <Label className="text-[9px] font-black uppercase tracking-widest opacity-60 ml-1">{t('pickup')}</Label>
                        <select name="pickup" required className="w-full bg-white/5 border-white/10 rounded-xl h-11 font-bold text-xs px-4 text-foreground outline-none appearance-none cursor-pointer">
                           {locations.length > 0 ? (
                              locations.map((loc: any) => (
                                 <option key={loc._id} value={loc.name} className="bg-background">{loc.name}</option>
                              ))
                           ) : (
                              <option value="Dubai Agency Center">Dubai (Main)</option>
                           )}
                        </select>
                     </div>
                     <div className="space-y-1">
                        <Label className="text-[9px] font-black uppercase tracking-widest opacity-60 ml-1">{t('return')}</Label>
                        <select name="return" required className="w-full bg-white/5 border-white/10 rounded-xl h-11 font-bold text-xs px-4 text-foreground outline-none appearance-none cursor-pointer">
                           {locations.length > 0 ? (
                              locations.map((loc: any) => (
                                 <option key={loc._id} value={loc.name} className="bg-background">{loc.name}</option>
                              ))
                           ) : (
                              <option value="Dubai Agency Center">Dubai (Main)</option>
                           )}
                        </select>
                     </div>

                     {hasActivePromos && (
                        <div className="space-y-1 pt-1 border-t border-white/5">
                           <Label className="text-[9px] font-black uppercase tracking-widest opacity-60 ml-1">{t('promoLabel')}</Label>
                           <div className="flex gap-2">
                              <Input value={promoCodeInput} onChange={e => setPromoCodeInput(e.target.value)} disabled={promoResult !== null} placeholder="CODE" className="bg-white/5 border-white/10 rounded-xl h-11 font-bold text-xs px-4 uppercase flex-1" />
                              <Button type="button" onClick={handleApplyPromo} disabled={checkingPromo || promoResult !== null || !promoCodeInput} className="h-11 px-3 rounded-xl bg-accent text-white hover:bg-accent/80 font-black text-[9px] uppercase tracking-widest transition-all">
                                 {checkingPromo ? <Loader2 className="w-4 h-4 animate-spin" /> : "OK"}
                              </Button>
                           </div>
                        </div>
                     )}
                  </div>

                  <div className="pt-4 w-full">
                     <Button type="submit" disabled={loading} className="w-full h-12 rounded-xl bg-primary text-primary-foreground font-black text-sm uppercase tracking-widest shadow-2xl shadow-primary/30 hover:scale-[1.02] active:scale-95 transition-all">
                        <span className="flex items-center justify-center gap-2">
                           {loading ? "..." : t('confirm')} <ChevronRight className="w-4 h-4" />
                        </span>
                     </Button>
                  </div>
               </div>
            </form>
         </div>

         {/* Dynamic Summary Card (Auto-filled) */}
         <div className="space-y-10">
            <div className="glass-panel p-12 rounded-[3.5rem] bg-card/60 border-white/10 space-y-10 relative overflow-hidden group">
               <div className="aspect-video rounded-[2.5rem] overflow-hidden relative border border-white/10 group-hover:border-primary/20 transition-colors">
                  <img src={vehicle.images?.[0]} alt={vehicle.name} className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent flex items-end p-10">
                     <div>
                        <div className="text-primary text-[10px] font-black uppercase tracking-[0.4em] mb-4">{t('unitLock')}</div>
                        <h4 className="text-4xl font-black italic uppercase tracking-tighter">{vehicle.brand} {vehicle.name}</h4>
                     </div>
                  </div>
               </div>

               <div className="grid grid-cols-2 gap-6">
                  {[
                     { l: t('kmIncluded'), v: `${vehicle.kilometersIncluded} Km`, i: <Zap className="w-4 h-4" /> },
                     { l: t('extraKmFee'), v: `${vehicle.extraPricePerKm} €`, i: <Activity className="w-4 h-4" /> },
                     { l: t('deposit'), v: `${vehicle.deposit} €`, i: <ShieldCheck className="w-4 h-4" /> },
                     { l: t('pricePerDay'), v: `${vehicle.pricePerDay} €`, i: <Gauge className="w-4 h-4" /> },
                  ].map((spec, i) => (
                     <div key={i} className="p-6 rounded-3xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                        <div className="text-primary mb-3">{spec.i}</div>
                        <div className="text-xs font-black uppercase tracking-widest">{spec.v}</div>
                        <div className="text-[9px] font-bold text-muted-foreground opacity-40 uppercase mt-1">{spec.l}</div>
                     </div>
                  ))}
               </div>

               <div className="p-8 rounded-3xl bg-primary/20 border border-primary/30 flex items-center justify-between">
                  <div className="text-[10px] font-black uppercase tracking-[0.3em]">{t('total')}</div>
                  <div className="text-right">
                     {promoResult && <div className="text-sm font-black text-muted-foreground line-through italic opacity-60">{basePrice} €</div>}
                     <div className="text-3xl font-black text-primary italic">{totalPrice} €</div>
                  </div>
               </div>

               <div className="pt-6 border-t border-white/5 flex flex-col items-center gap-2 relative z-10">
                  <p className="text-[11px] text-muted-foreground font-medium italic">
                     {t('cancellationRemark')}{" "}
                     <button
                        type="button"
                        onClick={() => setShowCancelPolicy(true)}
                        className="text-primary hover:underline font-black uppercase tracking-widest text-[9px] ml-2"
                     >
                        {t('seeDetails')}
                     </button>
                  </p>
               </div>
            </div>

            {/* Cancellation Policy Dialog */}
            <Dialog open={showCancelPolicy} onOpenChange={setShowCancelPolicy}>
               <DialogContent className="glass-panel border-white/10 bg-card/95 rounded-[2.5rem] p-10 max-w-md">
                  <DialogHeader className="mb-6">
                     <DialogTitle className="text-2xl font-black italic uppercase tracking-tighter flex items-center gap-3">
                        <Info className="w-6 h-6 text-primary" /> {t('cancellationTitle')}
                     </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                     {[
                        { label: t('cancel30'), icon: <CheckCircle2 className="w-4 h-4 text-green-500" /> },
                        { label: t('cancel14'), icon: <CheckCircle2 className="w-4 h-4 text-yellow-500" /> },
                        { label: t('cancel7'), icon: <CheckCircle2 className="w-4 h-4 text-orange-500" /> },
                        { label: t('cancel3'), icon: <CheckCircle2 className="w-4 h-4 text-destructive" /> },
                     ].map((p, i) => (
                        <div key={i} className="flex gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 items-start">
                           <span className="mt-1">{p.icon}</span>
                           <span className="text-sm font-bold text-foreground/90">{p.label}</span>
                        </div>
                     ))}
                  </div>
               </DialogContent>
            </Dialog>
         </div>
      </div>
   )
}
