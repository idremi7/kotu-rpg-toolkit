'use client';

import Link from 'next/link';
import { Logo } from './Logo';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { LayoutDashboard } from 'lucide-react';
import { Button } from './ui/button';
import { ThemeToggle } from './ThemeToggle';

export function Header() {
  const pathname = usePathname();

  const navLinks = [
    { href: '/gm/dashboard', label: 'GM Dashboard' },
    { href: '/player/dashboard', label: 'Player Dashboard' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="container flex h-16 items-center">
        <Link href="/" className="mr-8 flex items-center gap-2">
          <Logo className="h-8 w-8 text-primary" />
          <span className="font-headline text-xl font-bold hidden sm:inline-block">
            KOTU
          </span>
        </Link>
        
        <div className="flex flex-1 items-center justify-end gap-4">
           <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'transition-colors hover:text-primary',
                  pathname.includes(link.href)
                    ? 'text-primary'
                    : 'text-foreground/60'
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <Button variant="ghost" size="sm" asChild className="md:hidden">
            <Link href="/gm/dashboard">
              <LayoutDashboard /> <span className="sr-only">Dashboards</span>
            </Link>
          </Button>

          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
