'use client'

import { useLocale } from 'next-intl'
import { usePathname, useRouter, routing } from '@/i18n/routing'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronDown } from "lucide-react"

export function LocaleSwitcher() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  const flagCodes: Record<string, string> = {
    en: 'us',
    fr: 'fr',
    ar: 'ae',
    es: 'es',
    sk: 'sk',
    ru: 'ru',
    pl: 'pl',
    de: 'de'
  };

  const labels: Record<string, string> = {
    en: 'English',
    fr: 'Français',
    ar: 'العربية',
    es: 'Español',
    sk: 'Slovenčina',
    ru: 'Русский',
    pl: 'Polski',
    de: 'Deutsch'
  };

  function onSelectChange(nextLocale: string) {
    router.replace(pathname, { locale: nextLocale })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 px-3 h-10 border border-white/10 bg-white/10 backdrop-blur-md hover:bg-white/20 transition-all rounded-xl outline-none group text-white">
          <div className="w-5 h-3.5 relative overflow-hidden rounded-sm border border-white/10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={`https://flagcdn.com/${flagCodes[locale]}.svg`} 
              alt={locale}
              className="object-cover w-full h-full"
            />
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest opacity-80 mt-0.5">{locale}</span>
          <ChevronDown className="w-3 h-3 opacity-40 group-data-[state=open]:rotate-180 transition-transform" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="bg-[#0a0a0a]/95 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl p-1.5 z-[100] min-w-[160px]"
      >
        {routing.locales.map((cur) => (
          <DropdownMenuItem 
            key={cur} 
            onClick={() => onSelectChange(cur)}
            className="flex items-center gap-3 cursor-pointer rounded-xl h-11 px-4 focus:bg-primary focus:text-primary-foreground group transition-colors my-1 data-[highlighted]:bg-primary"
          >
            <div className="w-6 h-4 relative overflow-hidden rounded-sm border border-white/10 group-hover:scale-110 transition-transform">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={`https://flagcdn.com/${flagCodes[cur]}.svg`} 
                alt={cur}
                className="object-cover w-full h-full"
              />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest">{labels[cur] || cur}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
