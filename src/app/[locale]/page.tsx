import {Hero} from "@/components/shared/hero";
import {BrandMarquee} from "@/components/shared/brand-marquee";
import {BrandGrid} from "@/components/shared/brand-grid";
import {setRequestLocale} from 'next-intl/server';

export default async function Index({params}: {params: Promise<{locale: string}>}) {
  const {locale} = await params;
  setRequestLocale(locale);

  return (
    <div className="flex flex-col items-center">
      <Hero />
      <BrandMarquee />
      <BrandGrid />
    </div>

  );
}
