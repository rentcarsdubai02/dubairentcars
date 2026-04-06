'use client'

import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, ChevronRight, Gauge, Info } from "lucide-react"
import { createVehicle, updateVehicle } from "@/actions/vehicle-actions"
import { CloudinaryGallery } from "./cloudinary-gallery"

interface FleetFormProps {
  initialData?: any;
}

const PREDEFINED_BRANDS = [
  "Rolls-Royce", "Bentley", "Mercedes", "BMW", "Audi", "Lexus", "Porsche", 
  "Ferrari", "Lamborghini", "Bugatti", "Maserati", "Range Rover", "MINI JOHN", "MCLAREN"
]

export function FleetForm({ initialData }: FleetFormProps) {
  const t = useTranslations('Fleet')
  const [images, setImages] = useState<string[]>(initialData?.images || [])
  const [loading, setLoading] = useState(false)

  // System to handle "Other" brand
  const isPredefined = initialData?.brand ? PREDEFINED_BRANDS.includes(initialData.brand) : true
  const [selectedBrand, setSelectedBrand] = useState(isPredefined ? (initialData?.brand || "Lamborghini") : "Other")
  const [customBrand, setCustomBrand] = useState(!isPredefined ? initialData.brand : "")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (images.length === 0) {
      alert(t('coverImageRequired'))
      return
    }

    setLoading(true)
    const formData = new FormData(e.target as HTMLFormElement)
    
    // Logic for brand: use selection or custom input
    const brandValue = selectedBrand === "Other" ? (formData.get('customBrand') as string) : selectedBrand

    const data = {
      name: formData.get('name') as string,
      brand: brandValue,
      pricePerDay: Number(formData.get('price')),
      images: images,
      kilometersIncluded: Number(formData.get('kilometersIncluded')),
      extraPricePerKm: Number(formData.get('extraPricePerKm')),
      deposit: Number(formData.get('deposit')),
    }

    try {
      if (initialData?._id) {
         await updateVehicle(initialData._id, data)
      } else {
         await createVehicle(data)
      }
      
      const formElement = e.target as HTMLFormElement
      if (!initialData) {
         formElement.reset()
         setImages([])
         setSelectedBrand("Lamborghini")
         setCustomBrand("")
      }

    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="glass-panel p-10 rounded-[2.5rem] bg-card/60 border-white/10">
      <div className="flex items-center gap-4 mb-10">
        <div className="bg-primary p-3 rounded-2xl">
          <Plus className="w-6 h-6 text-primary-foreground" />
        </div>
        <div>
          <h3 className="text-2xl font-black italic tracking-tighter uppercase leading-none">
             {initialData ? t('formTitleEdit') : t('formTitleAdd')} <span className="text-primary italic">{t('formTitleUnit')}</span>
          </h3>
          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-40">{t('formSubtitle')}</p>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid md:grid-cols-2 gap-10">
           {/* Visual Sync Section */}
           <div className="space-y-4">
              <Label className="text-[10px] font-black uppercase tracking-widest opacity-60 ml-2">{t('visualSync')}</Label>
              <CloudinaryGallery onImagesChange={setImages} existingImages={images} />
              
              <div className="pt-8 space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                     <div className={`space-y-1.5 ${selectedBrand === "Other" ? "col-span-2" : "col-span-1"}`}>
                        <Label className="text-[10px] font-black uppercase tracking-widest opacity-60 ml-2">{t('brand')}</Label>
                        <select 
                          name="brand" 
                          value={selectedBrand} 
                          onChange={(e) => setSelectedBrand(e.target.value)} 
                          required 
                          className="w-full bg-background border border-white/10 rounded-2xl h-14 font-bold text-sm px-5 text-foreground outline-none cursor-pointer hover:border-primary/40 transition-all"
                        >
                           {PREDEFINED_BRANDS.map(b => (
                             <option key={b} value={b}>{b}</option>
                           ))}
                           <option value="Other">{t('otherBrand')}</option>
                        </select>
                     </div>

                     {selectedBrand === "Other" && (
                        <div className="space-y-1.5 col-span-2 animate-in slide-in-from-left-2 duration-300">
                          <Label className="text-[10px] font-black uppercase tracking-widest opacity-60 ml-2">{t('otherBrand')}</Label>
                          <Input 
                            name="customBrand" 
                            value={customBrand} 
                            onChange={(e) => setCustomBrand(e.target.value)} 
                            required 
                            className="bg-white/5 border-white/10 rounded-2xl h-14 font-bold text-sm px-6 border-primary/20" 
                            placeholder="Ex: Aston Martin" 
                          />
                        </div>
                     )}

                     <div className={`space-y-1.5 ${selectedBrand === "Other" ? "col-span-2" : "col-span-1"}`}>
                        <Label className="text-[10px] font-black uppercase tracking-widest opacity-60 ml-2">{t('unitName')}</Label>
                        <Input name="name" defaultValue={initialData?.name} required className="bg-white/5 border-white/10 rounded-2xl h-14 font-bold text-sm px-6" placeholder="Aventador SVJ" />
                     </div>
                  </div>
                  <div className="space-y-1.5">
                     <Label className="text-[10px] font-black uppercase tracking-widest opacity-60 ml-2">{t('price')}</Label>
                     <Input name="price" type="number" defaultValue={initialData?.pricePerDay} required className="bg-white/5 border-white/10 rounded-2xl h-14 font-bold text-sm px-6" placeholder="5000" />
                  </div>
              </div>
           </div>

           {/* Technical Section (Simplified) */}
           <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-1.5">
                    <Label className="text-[10px] font-black uppercase tracking-widest opacity-60 ml-2">{t('kilometersIncluded')}</Label>
                    <Input name="kilometersIncluded" type="number" defaultValue={initialData?.kilometersIncluded || 250} required className="bg-white/5 border-white/10 rounded-2xl h-14 font-bold text-sm px-6" placeholder="250" />
                 </div>
                 <div className="space-y-1.5">
                    <Label className="text-[10px] font-black uppercase tracking-widest opacity-60 ml-2">{t('extraPrice')}</Label>
                    <Input name="extraPricePerKm" type="number" defaultValue={initialData?.extraPricePerKm || 5} required className="bg-white/5 border-white/10 rounded-2xl h-14 font-bold text-sm px-6" placeholder="5" />
                 </div>
              </div>
              <div className="space-y-1.5">
                 <Label className="text-[10px] font-black uppercase tracking-widest opacity-60 ml-2">{t('deposit')}</Label>
                 <Input name="deposit" type="number" defaultValue={initialData?.deposit || 1000} required className="bg-white/5 border-white/10 rounded-2xl h-14 font-bold text-sm px-6" placeholder="1000" />
              </div>

              <div className="p-6 rounded-[2rem] bg-amber-500/10 border border-amber-500/20 flex gap-4 items-start">
                 <Info className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                 <p className="text-xs font-medium text-amber-200/80 leading-relaxed italic">
                    {t('depositRemark')}
                 </p>
              </div>
           </div>
        </div>

        <Button type="submit" disabled={loading} className="w-full h-20 rounded-[1.5rem] bg-primary text-primary-foreground font-black text-xl uppercase tracking-widest shadow-2xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all group">
           <span className="flex items-center gap-4">
              {loading ? t('transmitting') : (initialData ? t('validateMod') : t('save'))} <ChevronRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
           </span>
        </Button>
      </form>
    </div>
  )
}
