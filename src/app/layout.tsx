import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { Header } from '@/components/Header';
import { I18nProvider } from '@/locales/client';
import { getLocale } from '@/locales/server';

export const metadata: Metadata = {
  title: 'KOTU: RPG Toolkit',
  description: 'Create and manage custom RPG systems and characters.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = getLocale();
  return (
    <html lang={locale} className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Alegreya:wght@400;500;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased min-h-screen flex flex-col">
        <I18nProvider locale={locale}>
          <Header />
          <main className="flex-grow">{children}</main>
          <Toaster />
        </I18nProvider>
      </body>
    </html>
  );
}
