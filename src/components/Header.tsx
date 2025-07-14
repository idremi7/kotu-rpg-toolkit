'use client';

import Link from 'next/link';
import { Logo } from './Logo';
import { ThemeToggle } from './ThemeToggle';
import { SidebarTrigger } from './ui/sidebar';

export function Header() {

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="container flex h-16 items-center">
         <div className="mr-4 md:hidden">
            <SidebarTrigger />
        </div>
        <Link href="/" className="mr-8 flex items-center gap-2">
          <Logo className="h-8 w-8 text-primary" />
          <span className="font-headline text-xl font-bold hidden sm:inline-block">
            KOTU
          </span>
        </Link>
        
        <div className="flex flex-1 items-center justify-end gap-4">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
