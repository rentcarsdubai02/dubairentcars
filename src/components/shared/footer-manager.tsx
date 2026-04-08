'use client'

import { useState, useEffect } from 'react'
import { CldUploadWidget } from 'next-cloudinary'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  LayoutTemplate, Globe,
  Link2, MapPin, Mail, Phone, MessageCircle, Video, Plus, Trash2,
  Save, Loader2, CheckCircle2, Image as ImageIcon, AlignLeft, Share2, Send
} from 'lucide-react'

interface QuickLink { label: string; href: string }

interface FooterConfigData {
  logoUrl: string; logoAlt: string; description: string;
  facebook: string; instagram: string; twitter: string;
  tiktok: string; website: string; youtube: string; linkedin: string;
  quickLinks: QuickLink[];
  address: string; mapUrl: string; email: string;
  phone: string; whatsapp: string; imo: string; viber: string;
}

const empty: FooterConfigData = {
  logoUrl: '', logoAlt: '', description: '',
  facebook: '', instagram: '', twitter: '',
  tiktok: '', website: '', youtube: '', linkedin: '',
  quickLinks: [],
  address: '', mapUrl: '', email: '',
  phone: '', whatsapp: '', imo: '', viber: '',
}

type Tab = 'logo' | 'description' | 'social' | 'links' | 'contact'

export function FooterManager() {
  const t = useTranslations('AdminFooter')

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'logo', label: t('tabLogo'), icon: <ImageIcon className="w-4 h-4" /> },
    { id: 'description', label: t('tabDesc'), icon: <AlignLeft className="w-4 h-4" /> },
    { id: 'social', label: t('tabSocial'), icon: <Share2 className="w-4 h-4" /> },
    { id: 'links', label: t('tabLinks'), icon: <Link2 className="w-4 h-4" /> },
    { id: 'contact', label: t('tabContact'), icon: <Phone className="w-4 h-4" /> },
  ]
  const [data, setData] = useState<FooterConfigData>(empty)
  const [tab, setTab] = useState<Tab>('logo')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    fetch('/api/footer-config')
      .then(r => r.json())
      .then(d => { setData({ ...empty, ...d }); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const set = (k: keyof FooterConfigData, v: string) =>
    setData(prev => ({ ...prev, [k]: v }))

  const addLink = () =>
    setData(prev => ({ ...prev, quickLinks: [...prev.quickLinks, { label: '', href: '' }] }))

  const setLink = (i: number, k: keyof QuickLink, v: string) =>
    setData(prev => {
      const links = [...prev.quickLinks]
      links[i] = { ...links[i], [k]: v }
      return { ...prev, quickLinks: links }
    })

  const removeLink = (i: number) =>
    setData(prev => ({ ...prev, quickLinks: prev.quickLinks.filter((_, idx) => idx !== i) }))

  const save = async () => {
    setSaving(true)
    setSaved(false)
    await fetch('/api/footer-config', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const field = (
    label: string,
    key: keyof FooterConfigData,
    icon: React.ReactNode,
    placeholder = '',
    type = 'text'
  ) => (
    <div className="space-y-2">
      <Label className="text-[10px] font-black uppercase tracking-widest opacity-60 flex items-center gap-2">
        {icon} {label}
      </Label>
      <Input
        type={type}
        value={data[key] as string}
        onChange={e => set(key, e.target.value)}
        placeholder={placeholder}
        className="bg-white/5 border-white/10 rounded-2xl h-12 font-semibold text-sm px-5"
      />
    </div>
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-primary/10 rounded-xl text-primary">
            <LayoutTemplate className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-black uppercase tracking-tighter">{t('managerTitle')}</h2>
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground opacity-50">
              {t('managerSubtitle')}
            </p>
          </div>
        </div>
        <Button
          onClick={save}
          disabled={saving}
          className="h-11 px-6 rounded-2xl bg-primary text-primary-foreground font-black text-xs uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-primary/20"
        >
          {saving ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> {t('saving')}</>
          ) : saved ? (
            <><CheckCircle2 className="w-4 h-4" /> {t('saved')}</>
          ) : (
            <><Save className="w-4 h-4" /> {t('save')}</>
          )}
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-white/5 pb-4">
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${tab === t.id
                ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20'
                : 'bg-white/5 text-muted-foreground hover:bg-white/10'
              }`}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="glass-panel p-8 rounded-3xl border-white/10 bg-card/40 space-y-6">

        {/* LOGO */}
        {tab === 'logo' && (
          <div className="space-y-6">
            <p className="text-xs text-muted-foreground opacity-60">
              {t('logoHelp')}
            </p>

            <div className="space-y-4">
              <Label className="text-[10px] font-black uppercase tracking-widest opacity-60 flex items-center gap-2">
                <ImageIcon className="w-3.5 h-3.5" /> {t('logoLabel')}
              </Label>

              <CldUploadWidget
                uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "ml_default"}
                onSuccess={(result: any) => {
                  if (result.event === 'success') {
                    set('logoUrl', result.info.secure_url)
                  }
                }}
                options={{
                  multiple: false,
                  maxFiles: 1,
                  clientAllowedFormats: ["png", "jpeg", "webp"],
                }}
              >
                {({ open }) => (
                  <Button
                    type="button"
                    onClick={() => open()}
                    className="w-full h-40 rounded-3xl border-2 border-dashed border-white/10 bg-white/5 hover:bg-primary/10 hover:border-primary/40 transition-all flex flex-col items-center justify-center gap-4 group"
                  >
                    {data.logoUrl ? (
                      <div className="relative group/logo">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={data.logoUrl}
                          alt="Current Logo"
                          className="max-h-24 object-contain"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/logo:opacity-100 flex items-center justify-center rounded-xl transition-opacity">
                          <ImageIcon className="w-6 h-6 text-white" />
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="bg-primary/20 p-4 rounded-full group-hover:scale-110 transition-transform">
                          <Plus className="w-6 h-6 text-primary" />
                        </div>
                        <div className="text-center">
                          <span className="text-xs font-black uppercase tracking-widest text-primary">{t('uploadFile')}</span>
                          <p className="text-[10px] font-bold text-muted-foreground opacity-50 mt-1 uppercase">{t('maxSize')}</p>
                        </div>
                      </>
                    )}
                  </Button>
                )}
              </CldUploadWidget>

              {data.logoUrl && (
                <div className="flex justify-center">
                  <button
                    onClick={() => set('logoUrl', '')}
                    className="text-[10px] font-black uppercase tracking-widest text-red-500 hover:underline"
                  >
                    {t('removeLogo')}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* DESCRIPTION */}
        {tab === 'description' && (
          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase tracking-widest opacity-60 flex items-center gap-2">
              <AlignLeft className="w-3.5 h-3.5" /> {t('descLabel')}
            </Label>
            <textarea
              value={data.description}
              onChange={e => set('description', e.target.value)}
              placeholder={t('descPlaceholder')}
              rows={5}
              className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 font-semibold text-sm text-foreground placeholder:text-muted-foreground/40 outline-none resize-none focus:border-primary/40 transition-colors"
            />
          </div>
        )}

        {/* RESEAUX SOCIAUX */}
        {tab === 'social' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {field('Facebook', 'facebook', <Globe className="w-3.5 h-3.5" />, 'https://facebook.com/...')}
            {field('Instagram', 'instagram', <Share2 className="h-4 h-4" />, 'https://instagram.com/...')}
            {field('Twitter / X', 'twitter', <Send className="h-4 h-4" />, 'https://twitter.com/...')}
            {field('TikTok', 'tiktok', <Video className="w-3.5 h-3.5" />, 'https://tiktok.com/@...')}
            {field('Site Web', 'website', <Globe className="w-3.5 h-3.5" />, 'https://votresite.com')}
            {field('YouTube', 'youtube', <Video className="h-4 h-4" />, 'https://youtube.com/...')}
            {field('LinkedIn', 'linkedin', <LayoutTemplate className="h-4 h-4" />, 'https://linkedin.com/...')}
          </div>
        )}

        {/* LIENS RAPIDES */}
        {tab === 'links' && (
          <div className="space-y-5">
            {data.quickLinks.length === 0 && (
              <p className="text-xs text-muted-foreground opacity-50 italic text-center py-4">
                {t('noLinks')}
              </p>
            )}
            {data.quickLinks.map((link, i) => (
              <div key={i} className="flex items-center gap-3">
                <Input
                  value={link.label}
                  onChange={e => setLink(i, 'label', e.target.value)}
                  placeholder={t('formLabel')}
                  className="bg-white/5 border-white/10 rounded-2xl h-12 font-semibold text-sm px-5"
                />
                <Input
                  value={link.href}
                  onChange={e => setLink(i, 'href', e.target.value)}
                  placeholder={t('formUrl')}
                  className="bg-white/5 border-white/10 rounded-2xl h-12 font-semibold text-sm px-5"
                />
                <button
                  onClick={() => removeLink(i)}
                  className="text-muted-foreground hover:text-red-400 transition-colors p-2 rounded-xl hover:bg-red-400/10"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            <Button
              onClick={addLink}
              variant="outline"
              className="w-full h-11 rounded-2xl border-dashed border-white/20 text-xs font-black uppercase tracking-widest flex items-center gap-2 hover:border-primary/40 hover:text-primary transition-all"
            >
              <Plus className="w-4 h-4" /> {t('addLink')}
            </Button>
          </div>
        )}

        {/* CONTACT */}
        {tab === 'contact' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {field(t('contactAddress'), 'address', <MapPin className="w-3.5 h-3.5" />, 'Dubai Marina, UAE')}
            {field(t('contactMap'), 'mapUrl', <Globe className="w-3.5 h-3.5" />, 'https://maps.google.com/?q=...')}
            {field(t('contactEmail'), 'email', <Mail className="w-3.5 h-3.5" />, 'contact@dubairentcars.com', 'email')}
            {field(t('contactPhone'), 'phone', <Phone className="w-3.5 h-3.5" />, '+33 50 000 0000')}
            {field('WhatsApp', 'whatsapp', <MessageCircle className="w-3.5 h-3.5" />, '+33 50 000 0000')}
            {field('IMO', 'imo', <MessageCircle className="w-3.5 h-3.5" />, '+33 50 000 0000')}
            {field('Viber', 'viber', <Video className="w-3.5 h-3.5" />, '+33 50 000 0000')}
          </div>
        )}
      </div>

      {/* Note */}
      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/40 text-center">
        {t('note')}
      </p>
    </div>
  )
}
