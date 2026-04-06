'use client'

import { useState } from 'react'
import { Send, Loader2, CheckCircle2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { sendMessage } from '@/actions/contact-actions'

interface ContactFormProps {
  t: {
    identityName: string;
    digitalAddress: string;
    messageTransmission: string;
    transmitSignal: string;
    placeholderName: string;
    placeholderEmail: string;
    placeholderMessage: string;
    messageSent: string;
    messageError: string;
  }
}

export function ContactForm({ t }: ContactFormProps) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('loading')
    
    const formData = new FormData(e.currentTarget)
    try {
      await sendMessage(formData)
      setStatus('success')
      ;(e.target as HTMLFormElement).reset()
      setTimeout(() => setStatus('idle'), 5000)
    } catch (err) {
      console.error(err)
      setStatus('error')
      setTimeout(() => setStatus('idle'), 5000)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-white/5">
      <div className="space-y-2">
        <Label className="text-sm font-bold text-muted-foreground ml-1">{t.identityName}</Label>
        <Input name="name" required className="bg-white/5 border-white/10 rounded-2xl h-14 text-sm font-bold px-6 focus:border-primary/50 transition-all ring-0" placeholder={t.placeholderName} />
      </div>
      <div className="space-y-2">
        <Label className="text-sm font-bold text-muted-foreground ml-1">{t.digitalAddress}</Label>
        <Input name="email" required type="email" className="bg-white/5 border-white/10 rounded-2xl h-14 text-sm font-bold px-6 focus:border-primary/50 transition-all ring-0" placeholder={t.placeholderEmail} />
      </div>
      <div className="space-y-2 md:col-span-2">
        <Label className="text-sm font-bold text-muted-foreground ml-1">{t.messageTransmission}</Label>
        <Textarea name="message" required className="bg-white/5 border-white/10 rounded-2xl h-40 text-sm font-medium p-6 focus:border-primary/50 transition-all ring-0" placeholder={t.placeholderMessage} />
      </div>
      
      <div className="md:col-span-2 pt-4 flex flex-col md:flex-row items-center gap-6">
        <Button 
          type="submit" 
          disabled={status === 'loading'}
          className="w-full md:w-fit px-12 h-16 rounded-2xl text-base font-bold bg-primary hover:bg-primary/95 text-primary-foreground group shadow-[0_15px_30px_-10px_oklch(var(--primary))] transition-all active:scale-95 disabled:opacity-50"
        >
          <span className="flex items-center gap-2">
            {status === 'loading' ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                {t.transmitSignal} <Send className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </>
            )}
          </span>
        </Button>

        {status === 'success' && (
          <div className="flex items-center gap-2 text-green-500 font-bold text-sm animate-fade-in">
            <CheckCircle2 className="w-5 h-5" /> {t.messageSent}
          </div>
        )}

        {status === 'error' && (
          <div className="flex items-center gap-2 text-red-500 font-bold text-sm animate-fade-in">
            <AlertCircle className="w-5 h-5" /> {t.messageError}
          </div>
        )}
      </div>
    </form>
  )
}
