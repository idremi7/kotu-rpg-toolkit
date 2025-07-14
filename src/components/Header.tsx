
'use client';

import Link from 'next/link';
import { Logo } from './Logo';
import { ThemeToggle } from './ThemeToggle';
import { Button } from './ui/button';
import { Shield, Users } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export function Header() {
  const pathname = usePathname();

  const navItems = [
    { href: '/gm/dashboard', label: 'GM Dashboard', icon: Shield },
    { href: '/player/dashboard', label: 'Player Dashboard', icon: Users },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="container flex h-16 items-center">
        <Link href="/" className="mr-8 flex items-center gap-2 text-foreground/80 dark:text-primary transition-colors hover:text-foreground dark:hover:text-primary/90">
          <Logo className="h-8 w-8" />
          <span className="font-headline text-xl font-bold hidden sm:inline-block">
            VERSA
          </span>
        </Link>
        
        <nav className="flex items-center gap-4 text-sm font-medium">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "transition-colors hover:text-primary",
                pathname.startsWith(item.href) ? "text-primary" : "text-muted-foreground"
              )}
            >
              <span className="hidden sm:inline-block">{item.label}</span>
              <item.icon className="sm:hidden h-6 w-6" />
            </Link>
          ))}
        </nav>

        <div className="flex flex-1 items-center justify-end gap-4">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
