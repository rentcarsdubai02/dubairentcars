import {NextIntlClientProvider} from 'next-intl';
import {getMessages, setRequestLocale, getTranslations} from 'next-intl/server';
import {routing} from '@/i18n/routing';
import {notFound} from 'next/navigation';
import "@/app/globals.css";
import {Inter} from 'next/font/google';
import {Header} from "@/components/shared/header";
import {Footer} from "@/components/shared/footer";
import {AuthProvider} from "@/components/providers/session-provider";

const inter = Inter({subsets: ['latin']});

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Metadata' });

  return {
    title: {
      template: `%s | ${t('siteName')}`,
      default: t('defaultTitle'),
    },
    description: t('defaultDescription'),
    keywords: ["Luxury Car Rental Dubai", "Rent Lamborghini Dubai", "Dubai Rent Cars", "SUV Dubai", "Luxury Hire UAE"],
    authors: [{ name: "Dubai Rent Cars" }],
    openGraph: {
      title: t('defaultTitle'),
      description: t('defaultDescription'),
      url: 'https://dubairentcars.vercel.app',
      siteName: t('siteName'),
      images: [
        {
          url: '/og-image.jpg', // You should add this image in public folder later
          width: 1200,
          height: 630,
        },
      ],
      locale: locale,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: t('defaultTitle'),
      description: t('defaultDescription'),
    },
  };
}

export default async function LocaleLayout(
  props: {
    children: React.ReactNode;
    params: Promise<{locale: string}>;
  }
) {
  const {locale} = await props.params;
  const {children} = props;

  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  // Enable static rendering
  setRequestLocale(locale);

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  return (
    <html lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'} className="scroll-smooth" data-scroll-behavior="smooth">
      <body className={`${inter.className} min-h-screen bg-background text-foreground antialiased selection:bg-primary/20`}>
        <AuthProvider>
          <NextIntlClientProvider locale={locale} messages={messages}>
            <div className="relative flex min-h-screen flex-col">
              <Header />
              <main className="flex-1">
                {children}
              </main>
              <Footer />
            </div>
          </NextIntlClientProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({locale}));
}
