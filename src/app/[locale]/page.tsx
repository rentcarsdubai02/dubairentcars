import {Hero} from "@/components/shared/hero";
import {BrandMarquee} from "@/components/shared/brand-marquee";
import {BrandGrid} from "@/components/shared/brand-grid";
import {setRequestLocale} from 'next-intl/server';
import connectToDatabase from '@/lib/mongodb';
import FooterConfig from '@/models/FooterConfig';

export default async function Index({params}: {params: Promise<{locale: string}>}) {
  const {locale} = await params;
  setRequestLocale(locale);

  // Fetch footer config for localized description
  let dbSubtitle = undefined;
  try {
    await connectToDatabase();
    const cfg = await FooterConfig.findOne({ singleton: 'main' }).lean();
    if (cfg) {
      if (locale === 'fr') dbSubtitle = cfg.descriptionFr;
      else if (locale === 'ar') dbSubtitle = cfg.descriptionAr;
      else dbSubtitle = cfg.descriptionEn;
    }
  } catch (e) {
    console.error('Error fetching footer config for hero:', e);
  }

  return (
    <div className="flex flex-col items-center">
      <Hero dbSubtitle={dbSubtitle} />
      <BrandMarquee />
      <BrandGrid />
    </div>
  );
}
