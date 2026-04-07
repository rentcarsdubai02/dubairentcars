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

export function Header() {
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
        ? "py-4 bg-[#0a0a0a] border-b border-white/10 px-6 md:px-12"
        : scrolled 
          ? "py-4 bg-background/80 backdrop-blur-3xl border-b border-primary/20 shadow-[0_0_50px_rgba(0,0,0,0.5)] px-6 md:px-12" 
          : "py-6 bg-background/40 backdrop-blur-md border-b border-white/5 px-6 md:px-12"
    )}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center group">
          <Image
            src="/Logo dubai rent cars3.png"
            alt="Dubai Rent Cars Logo"
            width={160}
            height={60}
            className="object-contain h-12 w-auto transition-opacity group-hover:opacity-80"
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
          
          {session ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className={cn(
                   "rounded-full h-10 w-10 p-0 hover:bg-white/10 ring-1",
                   isOperator ? "ring-primary shadow-[0_0_10px_rgba(var(--primary),0.3)]" : "ring-white/10"
                )}>
                  {isOperator ? <ShieldAlert className="h-4 w-4 text-primary" /> : <User className="h-4 w-4" />}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64 mt-4 border border-white/5 shadow-2xl bg-card/80 backdrop-blur-2xl rounded-2xl">
                <DropdownMenuLabel className="font-normal opacity-70 p-4">
                  <div className="flex flex-col space-y-1">
                    <p className="text-xs font-bold leading-none truncate">{user.email}</p>
                    <p className="text-[10px] uppercase font-black tracking-widest text-primary/60">{user.role || 'DRIVER'}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-white/5" />
                
                {isManagement && (
                  <DropdownMenuItem asChild className="focus:bg-primary/20 p-3 mx-1 rounded-xl group">
                    <Link href="/admin/users" className="cursor-pointer w-full text-sm font-bold flex items-center gap-2">
                       <ShieldAlert className="w-4 h-4 text-primary" /> {t('admin')}
                    </Link>
                  </DropdownMenuItem>
                )}

                {!isManagement && isOperator && (
                  <DropdownMenuItem asChild className="focus:bg-primary/20 p-3 mx-1 rounded-xl group">
                    <Link href="/admin/fleet" className="cursor-pointer w-full text-sm font-bold flex items-center gap-2">
                       <Car className="w-4 h-4 text-primary" /> {t('admin')}
                    </Link>
                  </DropdownMenuItem>
                )}


                <DropdownMenuItem asChild className="focus:bg-primary/20 p-3 mx-1 rounded-xl">
                  <Link href="/dashboard" className="cursor-pointer w-full text-sm font-semibold">{t('dashboard')}</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-white/5" />
                <DropdownMenuItem onClick={handleSignOut} className="text-accent focus:bg-accent/10 cursor-pointer p-3 mx-1 rounded-xl text-sm font-semibold">
                  {t('signOut')}
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

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden p-2.5 rounded-xl border border-white/20 bg-background/80 backdrop-blur-md shadow-lg" 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
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
            <Image src="/Logo dubai rent cars3.png" alt="Dubai Rent Cars" width={120} height={45} className="object-contain h-10 w-auto" />
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
                className="flex items-center gap-4 px-4 py-4 rounded-2xl text-sm font-black uppercase tracking-widest text-primary bg-primary/10 border border-primary/20 hover:bg-primary/20 transition-all duration-300 mt-2"
              >
                <ShieldAlert className="w-5 h-5" />
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
