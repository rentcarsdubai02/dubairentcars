'use client'

import { useState, useEffect } from 'react'
import { getUnreadMessagesCount } from '@/actions/contact-actions'
import { signOut } from 'next-auth/react'

import { Link, usePathname } from '@/i18n/routing'
import { useTranslations } from 'next-intl'
import { 
  Users, 
  Car, 
  MapPin, 
  Ticket, 
  BarChart3, 
  LayoutTemplate,
  ChevronRight,
  ShieldCheck,
  MessageSquare,
  Menu,
  X,
  LogOut
} from "lucide-react"

export default function AdminSidebar() {
  const t = useTranslations('Navigation')
  const pathname = usePathname()
  const [unreadCount, setUnreadCount] = useState(0)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    getUnreadMessagesCount().then(setUnreadCount)
  }, [pathname])

  const links = [
    { 
      name: t('adminLocations'), 
      href: '/admin/locations', 
      icon: <MapPin className="w-5 h-5" /> 
    },
    { 
      name: t('adminFleet'), 
      href: '/admin/fleet', 
      icon: <Car className="w-5 h-5" /> 
    },
    { 
      name: t('adminUsers'), 
      href: '/admin/users', 
      icon: <Users className="w-5 h-5" /> 
    },
    { 
      name: t('adminPromos'), 
      href: '/admin/promos', 
      icon: <Ticket className="w-5 h-5" /> 
    },
    { 
      name: t('adminStats'), 
      href: '/admin/statistics', 
      icon: <BarChart3 className="w-5 h-5" /> 
    },
    { 
      name: t('adminFooter'), 
      href: '/admin/footer', 
      icon: <LayoutTemplate className="w-5 h-5" /> 
    },
    { 
      name: t('adminContact'), 
      href: '/admin/contact', 
      icon: <MessageSquare className="w-5 h-5" /> 
    },
  ]

  return (
    <>
      <button 
        type="button"
        className="lg:hidden fixed bottom-6 right-6 w-16 h-16 flex items-center justify-center bg-primary text-primary-foreground rounded-full shadow-[0_10px_40px_rgba(var(--primary-rgb),0.6)] z-[10000] hover:scale-110 active:scale-95 transition-all animate-bounce"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle Admin Sidebar"
      >
        {isOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
        {!isOpen && unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white text-[10px] font-black border-2 border-white shadow-lg">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[9998] lg:hidden" 
          onClick={() => setIsOpen(false)} 
        />
      )}

      <aside className={`fixed lg:sticky top-0 left-0 w-72 h-screen overflow-y-auto pt-32 pb-10 px-6 border-r border-white/5 bg-background/95 lg:bg-background/50 backdrop-blur-xl z-[9999] transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="flex flex-col h-full gap-8">
        <div className="flex items-center gap-3 px-4 py-3 bg-primary/5 rounded-2xl border border-primary/10">
          <ShieldCheck className="w-5 h-5 text-primary" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Admin Control Matrix</span>
        </div>

        <nav className="flex-1 space-y-2">
          {links.map((link) => {
            const isActive = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`group flex items-center justify-between p-4 rounded-2xl transition-all duration-300 ${
                  isActive 
                    ? 'bg-primary text-primary-foreground shadow-[0_0_20px_rgba(var(--primary-rgb),0.3)]' 
                    : 'hover:bg-white/5 text-muted-foreground hover:text-foreground'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`p-0 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>
                    {link.icon}
                  </div>
                  <span className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest leading-none">
                    {link.name}
                    {link.href === '/admin/contact' && unreadCount > 0 && (
                      <span className="flex h-4 w-4 items-center justify-center rounded-full bg-primary/20 text-primary text-[9px] border border-primary/30">
                        {unreadCount}
                      </span>
                    )}
                  </span>
                </div>
                {!isActive && <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-40 -translate-x-2 group-hover:translate-x-0 transition-all" />}
              </Link>
            )
          })}
        </nav>

        <div className="pt-4 border-t border-white/5">
          <button 
            onClick={() => signOut({ callbackUrl: '/' })}
            className="w-full group flex items-center gap-4 p-4 rounded-2xl hover:bg-red-500/10 text-muted-foreground hover:text-red-500 transition-all duration-300"
          >
            <div className="group-hover:scale-110 transition-transform duration-300">
              <LogOut className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-black uppercase tracking-widest leading-none">
              {t('signOut')}
            </span>
          </button>
        </div>

      </div>
      </aside>
    </>
  )
}
