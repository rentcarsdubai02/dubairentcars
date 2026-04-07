'use client'

import { useState } from 'react'
import { X, Maximize2, ChevronLeft, ChevronRight, LayoutGrid } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface VehicleGalleryProps {
  images: string[];
  name: string;
}

export function VehicleGallery({ images, name }: VehicleGalleryProps) {
  const [activeImage, setActiveImage] = useState(images[0])
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)

  const openLightbox = (index: number) => {
    setCurrentIndex(index)
    setIsLightboxOpen(true)
  }

  const nextImage = (e?: React.MouseEvent) => {
    e?.stopPropagation()
    const nextIdx = (currentIndex + 1) % images.length
    setCurrentIndex(nextIdx)
  }

  const prevImage = (e?: React.MouseEvent) => {
    e?.stopPropagation()
    const prevIdx = (currentIndex - 1 + images.length) % images.length
    setCurrentIndex(prevIdx)
  }

  return (
    <div className="space-y-6">
      {/* Main Feature View */}
      <div 
        className="aspect-video glass-panel rounded-[2.5rem] bg-card/60 border-white/10 overflow-hidden relative shadow-2xl cursor-zoom-in group"
        onClick={() => openLightbox(images.indexOf(activeImage))}
      >
        <img src={activeImage} alt={name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
        <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-8">
           <div className="bg-white/10 backdrop-blur-3xl border border-white/10 px-6 py-3 rounded-2xl flex items-center gap-3">
              <Maximize2 className="w-5 h-5 text-primary" />
              <span className="text-[10px] font-black uppercase tracking-widest text-primary-foreground">Tactical View: Fullscreen</span>
           </div>
        </div>
      </div>

      {/* Thumbnails Matrix */}
      <div className="grid grid-cols-4 md:grid-cols-5 gap-2 sm:gap-4">
        {images.map((img, i) => (
          <div 
            key={i} 
            className={`aspect-square glass-panel rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:scale-[1.05] relative group ${activeImage === img ? 'border-primary border-2 shadow-lg shadow-primary/20 scale-[1.05]' : 'border-white/5 opacity-50 hover:opacity-100'}`}
            onClick={() => setActiveImage(img)}
          >
            <img src={img} alt={`${name} ${i}`} className="w-full h-full object-cover" />
            {activeImage === img && (
               <div className="absolute inset-0 bg-primary/20 flex items-center justify-center pointer-events-none">
                  <LayoutGrid className="w-4 h-4 text-primary" />
               </div>
            )}
          </div>
        ))}
      </div>

      {/* Fullscreen Lightbox Modal */}
      {isLightboxOpen && (
        <div 
          className="fixed inset-0 z-[9999] bg-background/95 backdrop-blur-2xl flex items-center justify-center p-6 md:p-12 animate-fade-in"
          onClick={() => setIsLightboxOpen(false)}
        >
          <button 
             className="absolute left-8 lg:left-12 p-4 bg-white/5 hover:bg-primary/20 border border-white/10 rounded-full transition-all group hidden md:block z-10"
             onClick={prevImage}
          >
             <ChevronLeft className="w-8 h-8 text-white group-hover:-translate-x-1 transition-transform" />
          </button>

          <div className="max-w-[95vw] lg:max-w-6xl max-h-[85vh] relative group p-2">
             <button 
               onClick={() => setIsLightboxOpen(false)}
               className="absolute -top-3 -right-3 md:-top-5 md:-right-5 w-10 h-10 md:w-14 md:h-14 bg-red-500 text-white rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(239,68,68,0.5)] hover:scale-110 active:scale-90 transition-all z-[100] border-4 border-background"
             >
               <X className="w-6 h-6 md:w-8 md:h-8" />
             </button>

             <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-black/60 backdrop-blur-xl rounded-full border border-white/10 text-[10px] font-black uppercase tracking-[0.2em] text-white/80 z-10">
                Asset {currentIndex + 1} / {images.length}
             </div>
             
             <img 
               src={images[currentIndex]} 
               alt={name} 
               className="w-full h-full max-h-[80vh] object-contain rounded-2xl md:rounded-[2.5rem] shadow-2xl"
               onClick={(e) => e.stopPropagation()} 
             />
          </div>

          <button 
             className="absolute right-8 lg:right-12 p-4 bg-white/5 hover:bg-primary/20 border border-white/10 rounded-full transition-all group hidden md:block z-10"
             onClick={nextImage}
          >
             <ChevronRight className="w-8 h-8 text-white group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      )}
    </div>
  )
}
