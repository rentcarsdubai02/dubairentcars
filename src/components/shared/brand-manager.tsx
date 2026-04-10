'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  Plus, 
  Trash2, 
  Layers, 
  Car, 
  Save, 
  Eye, 
  EyeOff,
  MoveUp,
  MoveDown,
  Loader2,
  RefreshCw,
  Image as ImageIcon
} from "lucide-react"
import { CldUploadWidget } from 'next-cloudinary'

export function BrandManager() {
  const t = useTranslations('BrandManager')
  const [brands, setBrands] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  
  const [newBrand, setNewBrand] = useState({
    name: '',
    slug: '',
    overrideUrl: '',
    isOther: false,
    visible: true,
  })

  useEffect(() => {
    fetchBrands()
  }, [])

  const fetchBrands = async () => {
    try {
      const res = await fetch('/api/brands')
      const data = await res.json()
      setBrands(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Failed to fetch brands:', error)
      setBrands([])
    } finally {
      setLoading(false)
    }
  }

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await fetch('/api/brands', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newBrand, order: brands.length })
      })
      if (res.ok) {
        setNewBrand({ name: '', slug: '', overrideUrl: '', isOther: false, visible: true })
        fetchBrands()
      }
    } finally {
      setSaving(false)
    }
  }

  const handleToggleVisibility = async (id: string, currentVisible: boolean) => {
    const res = await fetch('/api/brands', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, visible: !currentVisible })
    })
    if (res.ok) fetchBrands()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you certain you want to decommission this brand node?')) return
    const res = await fetch(`/api/brands?id=${id}`, { method: 'DELETE' })
    if (res.ok) fetchBrands()
  }

  const handleMove = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    if (targetIndex < 0 || targetIndex >= brands.length) return

    const brandA = brands[index]
    const brandB = brands[targetIndex]

    await Promise.all([
        fetch('/api/brands', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: brandA._id, order: targetIndex })
        }),
        fetch('/api/brands', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: brandB._id, order: index })
        })
    ])
    fetchBrands()
  }

  if (loading) return (
    <div className="flex flex-col items-center justify-center p-24 space-y-4">
      <Loader2 className="w-12 h-12 animate-spin text-primary opacity-20" />
      <span className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40">Synchronizing Matrix...</span>
    </div>
  )

  return (
    <div className="space-y-16 animate-fade-in-up">
       {/* Brands Control Grid */}
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {brands.map((brand, i) => (
             <div key={brand._id} className={`glass-panel p-6 rounded-[2.5rem] border-white/5 bg-card/30 flex flex-col gap-5 relative group transition-all hover:bg-card/50 ${!brand.visible && 'opacity-40 grayscale'}`}>
                <div className="flex items-center justify-between gap-4">
                   <div className="w-14 h-14 flex items-center justify-center bg-white/5 rounded-2xl border border-white/5 group-hover:border-primary/30 transition-colors shrink-0">
                      {brand.isOther ? (
                        <Layers className="w-7 h-7 text-primary" />
                      ) : (
                        <img 
                         src={brand.overrideUrl || `https://cdn.simpleicons.org/${brand.slug}/white`} 
                         className="w-10 h-10 object-contain filter brightness-0 invert" 
                         alt={brand.name}
                         onError={(e: any) => e.target.src = '/window.svg'} 
                        />
                      )}
                   </div>
                   
                   <div className="flex flex-col gap-1.5 flex-1 min-w-0">
                      <h4 className="text-xs font-black uppercase tracking-tight truncate">{brand.name}</h4>
                      <div className="flex gap-1.5">
                         <button onClick={() => handleMove(i, 'up')} disabled={i === 0} className="w-7 h-7 flex items-center justify-center bg-white/5 hover:bg-primary/20 rounded-lg disabled:opacity-10 transition-colors">
                            <MoveUp className="w-3 h-3" />
                         </button>
                         <button onClick={() => handleMove(i, 'down')} disabled={i === brands.length - 1} className="w-7 h-7 flex items-center justify-center bg-white/5 hover:bg-primary/20 rounded-lg disabled:opacity-10 transition-colors">
                            <MoveDown className="w-3 h-3" />
                         </button>
                      </div>
                   </div>
                </div>

                <div className="flex items-center gap-2 pt-4 border-t border-white/5">
                   <Button 
                    variant="ghost" 
                    onClick={() => handleToggleVisibility(brand._id, brand.visible)} 
                    className={`flex-1 h-11 rounded-2xl text-[10px] font-black uppercase tracking-widest ${brand.visible ? 'bg-primary/10 text-primary hover:bg-primary/20' : 'bg-white/5 text-muted-foreground'}`}
                   >
                      {brand.visible ? <Eye className="w-3.5 h-3.5 mr-2" /> : <EyeOff className="w-3.5 h-3.5 mr-2" />}
                      {brand.visible ? 'Active' : 'Hidden'}
                   </Button>
                   <Button 
                    variant="ghost" 
                    onClick={() => handleDelete(brand._id)} 
                    className="h-11 w-11 p-0 rounded-2xl bg-white/5 hover:bg-red-500/20 text-muted-foreground hover:text-red-500 transition-all"
                   >
                      <Trash2 className="w-3.5 h-3.5" />
                   </Button>
                </div>
             </div>
          ))}

          {/* New Node Placeholder */}
          <div className="glass-panel p-8 rounded-[2.5rem] border-2 border-dashed border-white/5 bg-transparent flex flex-col items-center justify-center gap-4 group hover:border-primary/40 transition-all min-h-[180px] cursor-pointer" onClick={() => document.getElementById('brand-form')?.scrollIntoView({ behavior: 'smooth' })}>
             <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
               <Plus className="w-6 h-6 text-muted-foreground group-hover:text-primary" />
             </div>
             <span className="text-[10px] font-black uppercase tracking-[0.34em] text-muted-foreground group-hover:text-white transition-colors">{t('addBrand')}</span>
          </div>
       </div>

       {/* Form Section */}
       <div id="brand-form" className="glass-panel p-10 md:p-14 rounded-[3.5rem] bg-card/60 border-white/10 max-w-4xl mx-auto shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[120px] -z-10 rounded-full translate-x-1/2 -translate-y-1/2" />
          
          <div className="flex items-center gap-5 border-b border-white/5 pb-10 mb-10">
             <div className="w-14 h-14 rounded-[1.5rem] bg-primary/20 flex items-center justify-center text-primary">
                <Car className="w-7 h-7" />
             </div>
             <div>
                <h3 className="text-2xl font-black uppercase italic tracking-tighter">{t('addBrand')}</h3>
                <p className="text-[10px] font-bold text-muted-foreground uppercase opacity-60 tracking-widest leading-none mt-1">{t('subtitle')}</p>
             </div>
          </div>

          <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-2 gap-8">
             <div className="space-y-3 md:col-span-2">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] opacity-50 ml-2">{t('name')}</label>
                <Input value={newBrand.name} onChange={e => setNewBrand({...newBrand, name: e.target.value})} required className="bg-white/5 border-white/10 h-16 rounded-[1.5rem] font-bold text-sm px-6 hover:border-primary/40 transition-colors" placeholder="e.g. Lamborghini" />
             </div>
             
             <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] opacity-50 ml-2">{t('slug')} (Optionnel)</label>
                <Input value={newBrand.slug} onChange={e => setNewBrand({...newBrand, slug: e.target.value})} placeholder="e.g. lamborghini" className="bg-white/5 border-white/10 h-16 rounded-[1.5rem] font-bold text-sm px-6" />
             </div>

             <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] opacity-50 ml-2">{t('override')}</label>
                <CldUploadWidget
                  uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "ml_default"}
                  onSuccess={(result: any) => {
                    if (result.event === 'success') {
                      setNewBrand({ ...newBrand, overrideUrl: result.info.secure_url })
                    }
                  }}
                  options={{
                    multiple: false,
                    maxFiles: 1,
                    clientAllowedFormats: ["png", "jpeg", "webp", "svg"],
                  }}
                >
                  {({ open }) => (
                    <div 
                      onClick={() => open()}
                      className="w-full h-16 rounded-[1.5rem] border-2 border-dashed border-white/10 bg-white/5 hover:bg-primary/10 hover:border-primary/40 transition-all flex items-center justify-center gap-4 cursor-pointer group"
                    >
                      {newBrand.overrideUrl ? (
                        <div className="flex items-center gap-3">
                           <img src={newBrand.overrideUrl} alt="Logo Preview" className="h-8 object-contain brightness-0 invert" />
                           <span className="text-[10px] font-black uppercase text-primary">Change Image</span>
                        </div>
                      ) : (
                        <>
                          <ImageIcon className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                          <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground group-hover:text-primary transition-colors">Import Image</span>
                        </>
                      )}
                    </div>
                  )}
                </CldUploadWidget>
             </div>

             <div className="md:col-span-2 flex items-center justify-between p-6 bg-white/5 rounded-[1.8rem] border border-white/5 hover:border-primary/20 transition-all cursor-pointer group" onClick={() => setNewBrand({...newBrand, isOther: !newBrand.isOther})}>
                <div className="flex items-center gap-5">
                   <div className={`p-3 rounded-xl transition-colors ${newBrand.isOther ? 'bg-primary text-white' : 'bg-white/5 text-muted-foreground'}`}>
                      <Layers className="w-5 h-5" />
                   </div>
                   <div>
                      <span className="text-[11px] font-black uppercase tracking-widest block">{t('isOther')}</span>
                      <p className="text-[9px] font-medium text-muted-foreground opacity-60 uppercase mt-0.5">Special behavioral link node</p>
                   </div>
                </div>
                <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${newBrand.isOther ? 'bg-primary border-primary' : 'border-white/20'}`}>
                   {newBrand.isOther && <div className="w-2.5 h-2.5 bg-white rounded-sm" />}
                </div>
             </div>

             <Button disabled={saving} className="md:col-span-2 h-20 rounded-[2rem] bg-white text-black hover:bg-primary hover:text-white font-black uppercase tracking-[0.4em] text-xs transition-all shadow-xl hover:shadow-primary/30 group">
                {saving ? <RefreshCw className="w-5 h-5 animate-spin" /> : <>{t('save')} <Save className="w-5 h-5 ml-4 group-hover:translate-x-1 transition-transform" /></>}
             </Button>
          </form>
       </div>
    </div>
  )
}
