import {NextIntlClientProvider} from 'next-intl';
import {getMessages, setRequestLocale} from 'next-intl/server';
import {routing} from '@/i18n/routing';
import {notFound} from 'next/navigation';
import "@/app/globals.css";
import {Inter} from 'next/font/google';
import {Header} from "@/components/shared/header";
import {Footer} from "@/components/shared/footer";
import {AuthProvider} from "@/components/providers/session-provider";

const inter = Inter({subsets: ['latin']});

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
