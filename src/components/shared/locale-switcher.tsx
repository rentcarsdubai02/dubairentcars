'use client'

import { useLocale } from 'next-intl'
import { usePathname, useRouter, routing } from '@/i18n/routing'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Globe } from "lucide-react"

export function LocaleSwitcher() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  function onSelectChange(nextLocale: string) {
    router.replace(pathname, { locale: nextLocale })
  }

  return (
    <div className="flex items-center gap-2">
      <Globe className="h-4 w-4 text-muted-foreground" />
      <Select value={locale} onValueChange={onSelectChange}>
        <SelectTrigger className="w-[110px] h-9 border-none bg-accent/50 focus:ring-0">
          <SelectValue placeholder="Language" />
        </SelectTrigger>
        <SelectContent align="end">
          {routing.locales.map((cur) => (
            <SelectItem key={cur} value={cur} className="cursor-pointer capitalize">
              {cur === 'en' ? 'English' : cur === 'fr' ? 'Français' : 'العربية'}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
