'use client'

import { CldUploadWidget } from 'next-cloudinary';
import { Button } from "@/components/ui/button";
import { Plus, ImageIcon, X, CheckCircle2 } from "lucide-react";
import { useEffect, useState } from 'react';

interface CloudinaryGalleryProps {
  onImagesChange: (urls: string[]) => void;
  existingImages?: string[];
}

export function CloudinaryGallery({ onImagesChange, existingImages = [] }: CloudinaryGalleryProps) {
  const [images, setImages] = useState<string[]>(existingImages);

  // Notify parent ONLY after state change (Safe Pattern)
  useEffect(() => {
    onImagesChange(images);
  }, [images, onImagesChange]);

  const handleUpload = (result: any) => {
    if (result.event === 'success') {
      const newUrl = result.info.secure_url;
      setImages((prev) => [...prev, newUrl]);
    }
  };

  const removeImage = (index: number) => {
    const updatedImages = images.filter((_, i) => i !== index);
    setImages(updatedImages);
    onImagesChange(updatedImages);
  };

  return (
    <div className="space-y-6">
      <CldUploadWidget 
        uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "ml_default"}
        onSuccess={handleUpload}
        options={{
          multiple: true,
          maxFiles: 5,
          clientAllowedFormats: ["png", "jpeg", "webp"],
        }}
      >
        {({ open }) => (
          <Button 
            type="button" 
            onClick={() => open()}
            className="w-full h-32 rounded-3xl border-2 border-dashed border-white/20 bg-white/5 hover:bg-primary/20 hover:border-primary/50 transition-all flex flex-col items-center justify-center gap-3 group"
          >
            <div className="bg-primary p-3 rounded-full group-hover:scale-110 transition-transform shadow-lg shadow-primary/20">
               <Plus className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60">Deploy Gallery Visual Assets</span>
          </Button>
        )}
      </CldUploadWidget>

      {images.length > 0 && (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 animate-fade-in">
          {images.map((url, i) => (
            <div key={i} className="aspect-video rounded-2xl bg-card border border-white/10 overflow-hidden relative group">
              <img src={url} alt={`Gallery ${i}`} className="w-full h-full object-cover" />
              <button 
                type="button"
                onClick={() => removeImage(i)}
                className="absolute top-2 right-2 p-1.5 bg-accent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
              >
                <X className="w-3 h-3 text-white" />
              </button>
              {i === 0 && (
                 <div className="absolute inset-0 bg-primary/20 border-2 border-primary/40 pointer-events-none" />
              )}
              <div className="absolute bottom-2 left-2 px-2 py-1 bg-background/60 backdrop-blur-md rounded-md border border-white/5 text-[8px] font-black uppercase tracking-widest text-primary">
                 {i === 0 ? "Cover" : `View 0${i + 1}`}
              </div>
            </div>
          ))}
        </div>
      )}

      {images.length > 0 && (
         <div className="flex items-center gap-2 text-[9px] font-black text-green-500 uppercase tracking-widest animate-pulse">
            <CheckCircle2 className="w-3 h-3" /> {images.length} Assets Synchronized in Matrix
         </div>
      )}
    </div>
  );
}
