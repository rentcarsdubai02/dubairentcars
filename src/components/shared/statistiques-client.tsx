'use client'

import { useState } from 'react'
import {
  BarChart3, Calendar, Car, CheckCircle2, Clock,
  X, ChevronRight, User, CreditCard, AlertCircle,
  ShieldCheck, Loader2, RefreshCw, Trash2
} from 'lucide-react'
import { updateBooking, deleteBooking } from '@/actions/booking-actions'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  approved: 'bg-green-500/20 text-green-400 border-green-500/30',
  refused: 'bg-red-500/20 text-red-400 border-red-500/30',
  completed: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
}

const PAYMENT_COLORS: Record<string, string> = {
  pending: 'bg-yellow-500/20 text-yellow-400',
  paid: 'bg-green-500/20 text-green-400',
  refunded: 'bg-purple-500/20 text-purple-400',
  failed: 'bg-red-500/20 text-red-400',
}

interface Props {
  initialBookings: any[]
}

export function StatistiquesClient({ initialBookings }: Props) {
  const t = useTranslations('Stats')
  const [bookings, setBookings] = useState(initialBookings)
  const [selected, setSelected] = useState<any | null>(null)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [editStatus, setEditStatus] = useState('')
  const [editPayment, setEditPayment] = useState('')
  const [editNotes, setEditNotes] = useState('')
  const router = useRouter()

  const openModal = (b: any) => {
    setSelected(b)
    setEditStatus(b.status || 'pending')
    setEditPayment(b.paymentStatus || 'pending')
    setEditNotes(b.notes || '')
  }

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (!confirm(t('deleteConfirm'))) return
    setDeleting(id)
    await deleteBooking(id)
    setBookings(prev => prev.filter(b => b._id !== id))
    setDeleting(null)
    router.refresh()
  }

  const handleSave = async () => {
    if (!selected) return
    setSaving(true)
    await updateBooking(selected._id, {
      status: editStatus,
      paymentStatus: editPayment,
      notes: editNotes,
    })
    // Optimistic UI update
    setBookings(prev => prev.map(b => b._id === selected._id
      ? { ...b, status: editStatus, paymentStatus: editPayment, notes: editNotes }
      : b
    ))
    setSaving(false)
    setSelected(null)
    router.refresh()
  }

  const stats = {
    total: bookings.length,
    approved: bookings.filter(b => b.status === 'approved').length,
    pending: bookings.filter(b => b.status === 'pending').length,
    paid: bookings.filter(b => b.paymentStatus === 'paid').length,
  }

  return (
    <div className="container px-6 mx-auto relative z-10 space-y-12">

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.4em] rounded-full border border-primary/20 mb-4">
            <ShieldCheck className="w-3 h-3" /> {t('controlTour')}
          </div>
          <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter uppercase leading-none">
            {t('title')}<span className="text-primary italic">{t('titleAccent')}</span>
          </h1>
          <p className="text-sm font-medium text-muted-foreground opacity-60 mt-3">
            {t('subtitle')}
          </p>
        </div>
        <Button onClick={() => router.refresh()} variant="ghost" className="gap-2 border border-white/10 rounded-2xl font-black text-xs uppercase tracking-widest">
          <RefreshCw className="w-4 h-4" /> {t('refresh')}
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {[
          { l: t('totalRequests'), v: stats.total, i: <BarChart3 className="w-5 h-5" />, c: 'text-primary' },
          { l: t('approved'), v: stats.approved, i: <CheckCircle2 className="w-5 h-5" />, c: 'text-green-400' },
          { l: t('pending'), v: stats.pending, i: <Clock className="w-5 h-5" />, c: 'text-yellow-400' },
          { l: t('paidOK'), v: stats.paid, i: <CreditCard className="w-5 h-5" />, c: 'text-blue-400' },
        ].map((s, i) => (
          <div key={i} className="glass-panel p-6 rounded-3xl bg-card/40 border-white/5 flex flex-col justify-between h-36">
            <div className={s.c}>{s.i}</div>
            <div>
              <div className="text-3xl font-black tracking-tighter">{String(s.v).padStart(2, '0')}</div>
              <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest opacity-60">{s.l}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Bookings Table */}
      <div className="glass-panel p-8 rounded-[2.5rem] bg-card/40 border-white/5">
        <h2 className="text-2xl font-black italic tracking-tighter uppercase mb-8">
          {t('requestList').split(' ').slice(0, -1).join(' ')} <span className="text-primary">{t('requestList').split(' ').pop()}</span>
        </h2>

        {bookings.length === 0 ? (
          <div className="py-20 text-center">
            <Car className="w-12 h-12 mx-auto text-muted-foreground opacity-20 mb-4" />
            <p className="text-xs font-black uppercase tracking-widest text-muted-foreground opacity-40">{t('noRequests')}</p>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="hidden lg:grid grid-cols-12 gap-4 px-4 pb-3 border-b border-white/5 text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-40">
              <span className="col-span-3">{t('colClient')}</span>
              <span className="col-span-3">{t('colVehicle')}</span>
              <span className="col-span-2 text-center">{t('colDate')}</span>
              <span className="col-span-2 text-center">{t('colStatus')}</span>
              <span className="col-span-2 text-right">{t('colPayment')}</span>
            </div>

            {bookings.map((b) => (
              <div
                key={b._id}
                onClick={() => openModal(b)}
                className="flex flex-col lg:grid lg:grid-cols-12 gap-4 items-start lg:items-center p-5 md:p-4 rounded-2xl bg-white/3 hover:bg-white/8 border border-white/5 hover:border-primary/20 cursor-pointer transition-all group"
              >
                {/* Client */}
                <div className="lg:col-span-3 flex items-center gap-3 w-full">
                  <div className="w-10 h-10 lg:w-9 lg:h-9 rounded-full bg-primary/20 flex items-center justify-center text-primary font-black text-sm shrink-0">
                    {b.userId?.firstName?.[0] || b.clientName?.[0] || '?'}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-black truncate">{b.userId?.firstName || b.clientName || '—'} {b.userId?.lastName || ''}</div>
                    <div className="text-[10px] text-muted-foreground opacity-60 truncate">{b.userId?.email || b.clientEmail || ''}</div>
                  </div>
                  <ChevronRight className="w-4 h-4 lg:hidden opacity-30 group-hover:translate-x-1 transition-all" />
                </div>

                {/* Véhicule */}
                <div className="lg:col-span-3 w-full border-t border-white/5 pt-3 lg:pt-0 lg:border-0">
                  <div className="text-[10px] font-black text-primary uppercase tracking-widest lg:hidden mb-1">{t('unitLabel')}</div>
                  <div className="text-sm font-black uppercase italic truncate">{b.vehicleId?.brand} {b.vehicleId?.name || '—'}</div>
                </div>

                {/* Date */}
                <div className="lg:col-span-2 w-full lg:text-center">
                  <div className="text-[10px] font-black text-primary uppercase tracking-widest lg:hidden mb-1">{t('colDate')}</div>
                  <div className="text-xs font-bold text-muted-foreground">{new Date(b.createdAt).toLocaleDateString()}</div>
                </div>

                {/* Statut */}
                <div className="lg:col-span-2 w-full lg:text-center">
                  <div className="text-[10px] font-black text-primary uppercase tracking-widest lg:hidden mb-1">{t('colStatus')}</div>
                  <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${STATUS_COLORS[b.status] || STATUS_COLORS.pending}`}>
                    {t(`status${(b.status || 'pending').charAt(0).toUpperCase() + (b.status || 'pending').slice(1)}`)}
                  </span>
                </div>

                {/* Paiement + Actions */}
                <div className="lg:col-span-2 flex items-center justify-between gap-2 w-full border-t border-white/5 pt-3 lg:pt-0 lg:border-0 lg:justify-end">
                  <div className="flex flex-col lg:items-end">
                    <div className="text-[10px] font-black text-primary uppercase tracking-widest lg:hidden mb-1">{t('financesLabel')}</div>
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shrink-0 ${PAYMENT_COLORS[b.paymentStatus] || PAYMENT_COLORS.pending}`}>
                      {t(`payment${(b.paymentStatus || 'pending').charAt(0).toUpperCase() + (b.paymentStatus || 'pending').slice(1)}`)}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => handleDelete(b._id, e)}
                      disabled={deleting === b._id}
                      className="w-10 h-10 lg:w-8 lg:h-8 rounded-xl flex items-center justify-center bg-red-500/10 hover:bg-red-500/30 text-red-400 hover:text-red-300 transition-all shrink-0"
                      title="Supprimer"
                    >
                      {deleting === b._id
                        ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        : <Trash2 className="w-4 h-4 lg:w-3.5 lg:h-3.5" />}
                    </button>
                    <ChevronRight className="hidden lg:block w-4 h-4 opacity-30 group-hover:translate-x-1 group-hover:opacity-80 transition-all" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ========== MODAL ========== */}
      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
          onClick={() => setSelected(null)}
        >
          <div
            className="bg-card border border-white/10 p-8 rounded-3xl w-full max-w-2xl shadow-2xl relative max-h-[90vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <button onClick={() => setSelected(null)} className="absolute top-6 right-6 text-muted-foreground hover:text-white transition-colors">
              <X className="w-6 h-6" />
            </button>

            {/* Modal Header */}
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-primary/20 rounded-xl"><Car className="w-6 h-6 text-primary" /></div>
              <div>
                <h3 className="text-2xl font-black uppercase italic tracking-tighter">
                  {selected.vehicleId?.brand} {selected.vehicleId?.name || '—'}
                </h3>
                <p className="text-xs font-black uppercase text-muted-foreground tracking-widest">
                  {t('modalBookingDate')} {new Date(selected.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* Info Grid */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="p-5 bg-white/5 rounded-2xl border border-white/5 space-y-3">
                <div className="text-[10px] font-black text-primary uppercase tracking-widest opacity-60 flex items-center gap-2">
                  <User className="w-3 h-3" /> {t('modalClient')}
                </div>
                <div className="text-sm font-bold">{selected.userId?.firstName || selected.clientName} {selected.userId?.lastName || ''}</div>
                <div className="text-xs text-muted-foreground">{selected.userId?.email || selected.clientEmail}</div>
                <div className="text-xs text-muted-foreground">{selected.clientPhone}</div>
              </div>
              <div className="p-5 bg-white/5 rounded-2xl border border-white/5 space-y-3">
                <div className="text-[10px] font-black text-primary uppercase tracking-widest opacity-60 flex items-center gap-2">
                  <Calendar className="w-3 h-3" /> {t('modalLogistics')}
                </div>
                <div className="text-xs"><span className="text-muted-foreground w-12 inline-block">{t('modalStart')}:</span> <span className="font-black">{new Date(selected.startDate).toLocaleDateString()}</span></div>
                <div className="text-xs"><span className="text-muted-foreground w-12 inline-block">{t('modalEnd')}:</span> <span className="font-black">{new Date(selected.endDate).toLocaleDateString()}</span></div>
                {selected.pickupLocation && selected.pickupLocation !== 'Dubai Hub' && (
                  <div className="text-xs"><span className="text-muted-foreground w-12 inline-block">{t('modalLocation')}:</span> <span className="font-black">{selected.pickupLocation}</span></div>
                )}
                <div className="text-xs"><span className="text-muted-foreground w-12 inline-block">{t('modalTotal')}:</span> <span className="font-black text-primary">{selected.totalPrice} €</span></div>
              </div>
            </div>

            {/* Editable Fields */}
            <div className="space-y-5 border-t border-white/5 pt-6">
              <div className="text-[10px] font-black text-primary uppercase tracking-widest opacity-60 flex items-center gap-2 mb-4">
                <AlertCircle className="w-3 h-3" /> {t('modalEditTitle')}
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest opacity-60">{t('modalStatusLabel')}</label>
                  <select
                    value={editStatus}
                    onChange={e => {
                      const newStatus = e.target.value
                      setEditStatus(newStatus)
                      // Reset payment if status goes back to pending
                      if (newStatus === 'pending') setEditPayment('pending')
                      // Prevent "paid" if not approved/completed
                      if (newStatus !== 'approved' && newStatus !== 'completed' && editPayment === 'paid') {
                        setEditPayment('pending')
                      }
                    }}
                    className="w-full bg-background border border-white/10 rounded-2xl h-12 font-bold text-sm px-4 text-foreground outline-none cursor-pointer"
                  >
                    <option value="pending">{t('statusPending')}</option>
                    <option value="approved">{t('statusApproved')}</option>
                    <option value="refused">{t('statusRefused')}</option>
                    <option value="completed">{t('statusCompleted')}</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center px-1">
                    <label className="text-[10px] font-black uppercase tracking-widest opacity-60">{t('modalPaymentLabel')}</label>
                    {editStatus === 'pending' && (
                      <span className="text-[8px] font-black text-yellow-500 uppercase tracking-tighter opacity-80 flex items-center gap-1">
                        <AlertCircle className="w-2.5 h-2.5" /> {t('paymentUnlockedHint')}
                      </span>
                    )}
                  </div>
                  <select
                    value={editPayment}
                    onChange={e => setEditPayment(e.target.value)}
                    disabled={editStatus === 'pending'}
                    className={`w-full bg-background border border-white/10 rounded-2xl h-12 font-bold text-sm px-4 text-foreground outline-none cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed transition-all ${editStatus === 'pending' ? 'grayscale' : ''}`}
                  >
                    <option value="pending">{t('paymentPending')}</option>
                    {(editStatus === 'approved' || editStatus === 'completed') && (
                      <option value="paid">{t('paymentPaid')}</option>
                    )}
                    <option value="refunded">{t('paymentRefunded')}</option>
                    <option value="failed">{t('paymentFailed')}</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest opacity-60">{t('modalNotesLabel')}</label>
                <textarea
                  value={editNotes}
                  onChange={e => setEditNotes(e.target.value)}
                  rows={3}
                  placeholder={t('modalNotesPlaceholder')}
                  className="w-full bg-background border border-white/10 rounded-2xl font-medium text-sm p-4 text-foreground outline-none resize-none"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4 mt-8">
              <Button onClick={() => setSelected(null)} variant="ghost" className="flex-1 border border-white/10 font-black text-xs uppercase tracking-widest rounded-2xl h-12">
                {t('cancel')}
              </Button>
              <Button onClick={handleSave} disabled={saving} className="flex-1 bg-primary font-black text-xs uppercase tracking-widest rounded-2xl h-12 shadow-lg shadow-primary/20">
                {saving
                  ? <Loader2 className="w-4 h-4 animate-spin mx-auto" />
                  : <><CheckCircle2 className="w-4 h-4 mr-2" /> {t('save')}</>
                }
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
