import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'KOTU: RPG Toolkit',
  description: 'Create and manage custom RPG systems and characters.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html>
      <body>{children}</body>
    </html>
  );
}
