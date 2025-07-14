import type { Metadata } from 'next';
import { Alegreya } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { Header } from '@/components/Header';
import { getTranslations } from '@/lib/i18n';
import { cn } from '@/lib/utils';

const alegreya = Alegreya({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-body',
});

export const metadata: Metadata = {
  title: 'KOTU: RPG Toolkit',
  description: 'Create and manage custom RPG systems and characters.',
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: { locale: 'en' | 'fr' };
}>) {
  const translations = await getTranslations(params.locale || 'en');
  const headerTranslations = {
    gmDashboard: translations.header.gmDashboard,
    playerDashboard: translations.header.playerDashboard,
    login: translations.header.login,
    signUp: translations.header.signUp,
    toggleLanguage: translations.header.toggleLanguage,
  };

  return (
    <html lang={params.locale || 'en'} className="dark">
      <body
        className={cn(
          'min-h-screen bg-background font-body antialiased flex flex-col',
          alegreya.variable
        )}
      >
        <Header translations={headerTranslations} />
        <main className="flex-grow">{children}</main>
        <Toaster />
      </body>
    </html>
  );
}
