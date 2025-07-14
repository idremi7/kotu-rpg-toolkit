import type { Metadata } from 'next';
import '../globals.css';
import { Toaster } from '@/components/ui/toaster';
import { Header } from '@/components/Header';
import { getTranslations, createT } from '@/lib/i18n';

export default async function LocaleLayout({
  children,
  params: { locale }
}: Readonly<{
  children: React.ReactNode;
  params: { locale: 'en' | 'fr' };
}>) {
  const translations = await getTranslations(locale);
  const t = createT(translations);

  const headerTranslations = {
    gmDashboard: t('header.gmDashboard'),
    playerDashboard: t('header.playerDashboard'),
    login: t('header.login'),
    signUp: t('header.signUp'),
    toggleLanguage: t('header.toggleLanguage'),
  };

  return (
    <html lang={locale} className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Alegreya:wght@400;500;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased min-h-screen flex flex-col">
          <Header translations={headerTranslations} />
          <main className="flex-grow">{children}</main>
          <Toaster />
      </body>
    </html>
  );
}
