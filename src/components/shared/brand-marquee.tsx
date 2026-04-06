'use client'

import { Zap } from "lucide-react"

const BRANDS = [
  "Rolls-Royce", "Bentley", "Mercedes", "BMW", 
  "Audi", "Lexus", "Porsche", "Ferrari", "Lamborghini", 
  "Bugatti", "Maserati", "Range Rover", 
  "MINI JOHN", "MCLAREN"
]

export function BrandMarquee() {
  return (
    <div className="w-full py-8 overflow-hidden bg-white/5 border-y border-white/5 relative flex items-center">
      {/* CSS Animation defined locally for safety & speed */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(calc(-100% / 2)); }
        }
        .animate-scroll-fast {
          animation: scroll 40s linear infinite;
        }
      `}} />

      {/* Gradient fades on the sides */}
      <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

      {/* Scrolling Track */}
      <div className="flex w-[200%] animate-scroll-fast hover:[animation-play-state:paused] group cursor-default">
        {/* We double the array to create a seamless infinite loop */}
        {[...BRANDS, ...BRANDS].map((brand, i) => (
          <div key={i} className="flex items-center gap-12 px-6">
            <span className="text-3xl md:text-5xl font-black uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-b from-white/40 to-white/10 group-hover:from-white group-hover:to-primary transition-all duration-700 whitespace-nowrap">
               {brand}
            </span>
            <Zap className="w-6 h-6 text-primary/40 shrink-0" />
          </div>
        ))}
      </div>
    </div>
  )
}
