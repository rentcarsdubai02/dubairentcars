'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'

const ENGINE_IMAGES = [
  "/images/about/engine.png",
  "/images/about/chassis.png",
  "/images/about/cockpit.png",
  "https://images.unsplash.com/photo-1592198084033-aade902d1aae?auto=format&fit=crop&q=80&w=1000", // Ferrari
  "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?auto=format&fit=crop&q=80&w=1000", // Engine
  "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&q=80&w=1000", // Porsche
  "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=1000", // Classic Lux
  "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&q=80&w=1000", // Detail
  "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80&w=1000", // Interior Lux
  "https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&q=80&w=1000"  // Lambo
]

export default function EngineeringCarousel() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % ENGINE_IMAGES.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="absolute inset-0 z-0">
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <Image
            src={ENGINE_IMAGES[index]}
            alt="Engineering Excellence"
            fill
            className="object-cover opacity-40 mix-blend-screen"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/50" />
        </motion.div>
      </AnimatePresence>
      
      {/* Visual Overlay: Scanner Lines */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-20">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />
      </div>

      {/* Progress Indicator */}
      <div className="absolute bottom-4 left-12 flex gap-1 z-10">
        {ENGINE_IMAGES.map((_, i) => (
          <motion.div
            key={i}
            className={`h-0.5 rounded-full transition-all duration-300 ${i === index ? 'w-4 bg-primary' : 'w-1 bg-white/20'}`}
          />
        ))}
      </div>
    </div>
  )
}
