'use client'

import { useTranslations } from 'next-intl'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from 'react'
import { Link } from '@/i18n/routing'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { Zap, ChevronRight, User as UserIcon, ShieldCheck } from "lucide-react"

interface AuthFormProps {
  type: 'login' | 'signup'
}

export function AuthForm({ type }: AuthFormProps) {
  const t = useTranslations('Auth')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      if (type === 'login') {
        const res = await signIn('credentials', {
          redirect: false,
          email: email.toLowerCase(),
          password
        })

        if (res?.error) {
          setError(res.error)
        } else {
          router.push('/dashboard')
          router.refresh()
        }
      } else {
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            firstName,
            lastName,
            email: email.toLowerCase(),
            password,
            phone
          })
        })

        const data = await res.json()

        if (!res.ok) {
          setError(data.message || t('signupFailed'))
        } else {
          // On success, automatically sign in or redirect to login
          const signinRes = await signIn('credentials', {
            redirect: false,
            email: email.toLowerCase(),
            password
          })

          if (!signinRes?.error) {
            router.push('/dashboard')
            router.refresh()
          } else {
            router.push('/login')
          }
        }
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-sm mx-auto">
      <div className="relative overflow-hidden glass-panel rounded-2xl p-1 shadow-2xl border-white/10">
        <div className="p-8 bg-card/60 backdrop-blur-3xl">
          <div className="flex flex-col items-center mb-10">
            <div className="bg-primary/20 p-4 rounded-xl mb-6">
              <Zap className="w-8 h-8 text-primary fill-primary" />
            </div>
            <h1 className="text-3xl font-black tracking-tight mb-2 text-foreground">
              {type === 'login' ? t('loginTitle') : t('signupTitle')}
            </h1>
            <p className="text-sm font-medium text-muted-foreground text-center px-4">
              {type === 'login' ? t('loginDesc') : t('signupDesc')}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-3 text-[12px] font-bold text-accent bg-accent/10 border-l-4 border-accent rounded-r">
                {t('errorPrefix')}: {error}
              </div>
            )}

            {type === 'signup' && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs font-bold text-muted-foreground ml-1" htmlFor="firstName">
                      {t('firstName')}
                    </Label>
                    <Input
                      id="firstName"
                      placeholder="Alpha"
                      required
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="bg-white/5 border-white/10 rounded-xl h-12 text-sm font-semibold text-foreground focus:border-primary/50 transition-all px-4"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-bold text-muted-foreground ml-1" htmlFor="lastName">
                      {t('lastName')}
                    </Label>
                    <Input
                      id="lastName"
                      placeholder="Delta"
                      required
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="bg-white/5 border-white/10 rounded-xl h-12 text-sm font-semibold text-foreground focus:border-primary/50 transition-all px-4"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-muted-foreground ml-1" htmlFor="phone">{t('phone')}</Label>
                  <Input
                    id="phone"
                    placeholder="+33..."
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="bg-white/5 border-white/10 rounded-xl h-12 text-sm font-semibold text-foreground focus:border-primary/50 transition-all px-4"
                  />
                </div>
              </>
            )}

            <div className="space-y-2">
              <Label className="text-xs font-bold text-muted-foreground ml-1" htmlFor="email">
                {t('email')}
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="driver@dubairentcars.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white/5 border-white/10 rounded-xl h-12 text-sm font-semibold text-foreground focus:border-primary/50 transition-all px-4"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-bold text-muted-foreground ml-1" htmlFor="password">
                {t('password')}
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Secure code"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-white/5 border-white/10 rounded-xl h-12 text-sm font-semibold text-foreground focus:border-primary/50 transition-all px-4"
              />
            </div>

            <Button className="w-full h-14 rounded-xl text-sm font-bold bg-primary hover:bg-primary/95 text-primary-foreground group transition-all" disabled={loading}>
              <span className="flex items-center gap-2">
                {loading ? t('processing') : t(type === 'login' ? 'signIn' : 'signUp')}
                <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Button>
          </form>

          <div className="mt-8 pt-8 border-t border-white/5 flex flex-col gap-2 items-center">
            <div className="text-xs font-medium text-muted-foreground">
              {type === 'login' ? t('noAccount') : t('hasAccount')}
            </div>
            <Link
              href={type === 'login' ? "/signup" : "/login"}
              className="text-sm font-black text-primary hover:text-white transition-all underline underline-offset-4"
            >
              {type === 'login' ? t('signUp') : t('signIn')}
            </Link>
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-center gap-6 opacity-40">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-3 h-3" />
          <span className="text-[10px] font-bold tracking-tight">{t('securityProtocol')}</span>
        </div>
        <div className="flex items-center gap-2">
          <UserIcon className="w-3 h-3" />
          <span className="text-[10px] font-bold tracking-tight">{t('encryptedAccess')}</span>
        </div>
      </div>
    </div>
  )
}
