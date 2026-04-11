'use client'

import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/routing'
import { Button } from "@/components/ui/button"
import { LocaleSwitcher } from "./locale-switcher"
import { Menu, X, User, ShieldAlert, Car, MapPin, Ticket, BarChart3, LayoutTemplate, LogOut } from "lucide-react"
import Image from "next/image"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { useSession, signOut } from "next-auth/react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useRouter } from 'next/navigation'

export function Header({ logoUrl, whatsappNumber }: { logoUrl?: string; whatsappNumber?: string }) {
  const t = useTranslations('Navigation')
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
  }, [isMenuOpen])

  const handleSignOut = async () => {
    await signOut({ redirect: false })
    router.push('/')
    router.refresh()
  }

  const navLinks = [
    { href: '/', label: t('home') },
    { href: '/about', label: t('about') },
    { href: '/services', label: t('services') },
    { href: '/contact', label: t('contact') },
  ]

  const user = session?.user as any
  const isOperator = user?.role === 'super_admin' || user?.role === 'admin' || user?.role === 'agent'
  const isManagement = user?.role === 'super_admin' || user?.role === 'admin'

  return (
    <header className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
      isMenuOpen
        ? "py-3 bg-[#0a0a0a] border-b border-white/10 px-6 md:px-12"
        : scrolled 
          ? "py-2 bg-background/80 backdrop-blur-3xl border-b border-primary/20 shadow-[0_0_50px_rgba(0,0,0,0.5)] px-6 md:px-12" 
          : "py-4 bg-background/40 backdrop-blur-md border-b border-white/5 px-6 md:px-12"
    )}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center group">
          <Image
            src={logoUrl || "/Logo dubai rent cars3.png"}
            alt="Dubai Rent Cars Logo"
            width={160}
            height={60}
            className="object-contain h-10 md:h-11 w-auto transition-opacity group-hover:opacity-80"
            priority
          />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => (
            <Link 
              key={link.href} 
              href={link.href}
              className="text-sm font-semibold text-muted-foreground hover:text-primary transition-all relative group py-2"
            >
              {link.label}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-6">
          <LocaleSwitcher />

          {whatsappNumber && (
            <a
              href={`https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Contact via WhatsApp"
              className="group flex items-center justify-center h-11 w-11 transition-all duration-300 hover:scale-110 active:scale-95 hover:drop-shadow-[0_0_12px_rgba(37,211,102,0.7)]"
            >
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="h-11 w-11">
                <path
                  d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"
                  fill="#25D366"
                />
              </svg>
            </a>
          )}

          
          {session ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className={cn(
                   "rounded-full h-11 w-11 md:h-14 md:w-14 p-0 transition-all border-none outline-none",
                   isOperator 
                      ? "bg-primary/15 ring-2 ring-primary/50 shadow-[0_0_30px_rgba(var(--primary),0.3)] hover:bg-primary/25" 
                      : "bg-white/5 ring-1 ring-white/10 hover:bg-white/10"
                )}>
                  <div className={cn(
                    "flex items-center justify-center w-full h-full rounded-full",
                    isOperator ? "bg-primary/10" : "bg-transparent"
                  )}>
                    {isOperator ? <ShieldAlert className="h-6 w-6 md:h-8 md:w-8 text-primary" /> : <User className="h-5 w-5 md:h-6 md:w-6" />}
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64 mt-4 border border-white/5 shadow-2xl bg-card/80 backdrop-blur-2xl rounded-2xl">
                <DropdownMenuLabel className="font-normal opacity-70 p-4">
                  <div className="flex flex-col space-y-1">
                    <p className="text-xs font-bold leading-none truncate">{user?.email}</p>
                    <p className="text-[10px] uppercase font-black tracking-widest text-primary/60">{user?.role || 'DRIVER'}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-white/5" />
                
                {isManagement && (
                  <DropdownMenuItem asChild className="focus:bg-primary/30 bg-primary/10 border border-primary/20 p-4 mx-1 rounded-xl group mb-2">
                    <Link href="/admin/users" className="cursor-pointer w-full text-base font-black uppercase tracking-widest text-primary flex items-center gap-4">
                       <ShieldAlert className="w-7 h-7" /> {t('admin')}
                    </Link>
                  </DropdownMenuItem>
                )}

                {!isManagement && isOperator && (
                  <DropdownMenuItem asChild className="focus:bg-primary/30 bg-primary/10 border border-primary/20 p-4 mx-1 rounded-xl group mb-2">
                    <Link href="/admin/fleet" className="cursor-pointer w-full text-base font-black uppercase tracking-widest text-primary flex items-center gap-4">
                       <ShieldAlert className="w-7 h-7" /> {t('admin')}
                    </Link>
                  </DropdownMenuItem>
                )}

                <DropdownMenuItem asChild className="focus:bg-white/10 hover:bg-white/5 p-4 mx-1 rounded-xl mb-2 transition-colors">
                  <Link href="/dashboard" className="cursor-pointer w-full text-xs md:text-sm font-bold uppercase tracking-widest flex items-center gap-3">
                     <BarChart3 className="w-4 h-4 text-muted-foreground" /> {t('dashboard')}
                  </Link>
                </DropdownMenuItem>
                
                <DropdownMenuSeparator className="bg-white/5 my-2" />
                
                <DropdownMenuItem onClick={handleSignOut} className="text-red-400 focus:bg-red-500/20 bg-red-500/10 border border-red-500/10 cursor-pointer p-4 mx-1 rounded-xl text-xs md:text-sm font-bold uppercase tracking-widest flex items-center gap-3 mt-2 transition-colors">
                  <LogOut className="w-4 h-4" /> {t('signOut')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-4">
              <Link href="/login">
                <Button variant="ghost" className="text-sm font-semibold hover:text-primary transition-colors">
                  {t('login')}
                </Button>
              </Link>
              <Link href="/signup">
                <Button className="text-sm font-bold px-6 h-10 rounded-xl shadow-lg shadow-primary/20 transition-all active:scale-95">
                  {t('signup')}
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile — WhatsApp + Menu Button */}
        <div className="md:hidden flex items-center gap-2">
          {whatsappNumber && (
            <a
              href={`https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Contact via WhatsApp"
              className="flex items-center justify-center h-10 w-10 transition-all duration-300 hover:scale-110 active:scale-90 hover:drop-shadow-[0_0_10px_rgba(37,211,102,0.7)]"
            >
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="h-10 w-10">
                <path
                  d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"
                  fill="#25D366"
                />
              </svg>
            </a>
          )}
          <button 
            className="p-2.5 rounded-xl border border-white/20 bg-background/80 backdrop-blur-md shadow-lg" 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav - Left Drawer */}
      {/* Overlay */}
      <div
        className={cn(
          "fixed inset-0 z-[59] bg-black/70 transition-all duration-500 md:hidden",
          isMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setIsMenuOpen(false)}
      />

      {/* Drawer Panel */}
      <div
        className={cn(
          "fixed top-0 right-0 h-full w-[80vw] max-w-[320px] z-[60] border-l border-white/10 shadow-2xl transition-all duration-500 flex flex-col md:hidden bg-[#0a0a0a]",
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        )}
        style={{ backgroundColor: '#0a0a0a' }}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
          <Link href="/" onClick={() => setIsMenuOpen(false)}>
            <Image src={logoUrl || "/Logo dubai rent cars3.png"} alt="Dubai Rent Cars" width={120} height={45} className="object-contain h-10 w-auto" />
          </Link>
          <button className="p-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors" onClick={() => setIsMenuOpen(false)}>
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Drawer Content */}
        <div className="flex flex-col flex-1 justify-between px-6 py-6">
          {/* Nav Links */}
          <nav className="flex flex-col gap-2">
            {[
              { href: '/', label: t('home'), icon: <LayoutTemplate className="w-5 h-5" /> },
              { href: '/about', label: t('about'), icon: <ShieldAlert className="w-5 h-5" /> },
              { href: '/services', label: t('services'), icon: <Car className="w-5 h-5" /> },
              { href: '/contact', label: t('contact'), icon: <Ticket className="w-5 h-5" /> },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-4 px-4 py-4 rounded-2xl text-sm font-black uppercase tracking-widest text-muted-foreground hover:text-primary hover:bg-primary/10 border border-transparent hover:border-primary/20 transition-all duration-300 group"
              >
                <span className="text-primary group-hover:scale-110 transition-transform">{link.icon}</span>
                {link.label}
              </Link>
            ))}

            {isOperator && (
              <Link
                href={isManagement ? "/admin/users" : "/admin/fleet"}
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-4 px-4 py-5 rounded-2xl text-base font-black uppercase tracking-widest text-primary bg-primary/10 border border-primary/20 hover:bg-primary/20 transition-all duration-300 mt-4"
              >
                <ShieldAlert className="w-8 h-8" />
                {t('admin')}
              </Link>
            )}
          </nav>

          {/* Bottom Actions */}
          <div className="flex flex-col gap-3">
            <div className="mb-2">
              <LocaleSwitcher />
            </div>

            {!session ? (
              <>
                <Link href="/login" onClick={() => setIsMenuOpen(false)} className="w-full text-center py-4 bg-white/5 border border-white/10 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-white/10 transition-colors">
                  {t('login')}
                </Link>
                <Link href="/signup" onClick={() => setIsMenuOpen(false)} className="w-full text-center py-4 bg-primary text-primary-foreground rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-primary/30 hover:bg-primary/90 transition-colors">
                  {t('signup')}
                </Link>
              </>
            ) : (
              <>
                <Link href="/dashboard" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 px-4 py-4 rounded-2xl text-sm font-black uppercase tracking-widest text-muted-foreground hover:text-primary hover:bg-primary/10 border border-white/10 transition-all">
                  <BarChart3 className="w-5 h-5 text-primary" />
                  {t('dashboard')}
                </Link>
                <button
                  onClick={() => { handleSignOut(); setIsMenuOpen(false); }}
                  className="w-full flex items-center justify-center gap-3 py-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-red-500/20 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  {t('signOut')}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
