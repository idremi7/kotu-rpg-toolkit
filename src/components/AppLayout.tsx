
'use client';

import {
    SidebarProvider,
    Sidebar,
    SidebarHeader,
    SidebarContent,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarFooter,
    SidebarInset,
} from '@/components/ui/sidebar';
import { usePathname } from 'next/navigation';
import { Shield, Users, Home } from 'lucide-react';
import Link from 'next/link';
import { Header } from './Header';
import { Logo } from './Logo';


export function AppLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    const navItems = [
        { href: '/', label: 'Home', icon: Home },
        { href: '/gm/dashboard', label: 'GM Dashboard', icon: Shield },
        { href: '/player/dashboard', label: 'Player Dashboard', icon: Users },
    ];

    return (
        <SidebarProvider>
            <Sidebar>
                <SidebarHeader>
                    <div className="flex items-center gap-2 p-2">
                        <Logo className="w-8 h-8 text-primary" />
                         <span className="font-headline text-xl font-bold">
                            KOTU
                        </span>
                    </div>
                </SidebarHeader>
                <SidebarContent>
                    <SidebarMenu>
                        {navItems.map((item) => (
                             <SidebarMenuItem key={item.href}>
                                <Link href={item.href} passHref legacyBehavior>
                                    <SidebarMenuButton
                                        isActive={pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))}
                                    >
                                        <item.icon />
                                        <span>{item.label}</span>
                                    </SidebarMenuButton>
                                </Link>
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </SidebarContent>
                <SidebarFooter>
                    {/* Footer content if any */}
                </SidebarFooter>
            </Sidebar>
            <SidebarInset>
                <Header />
                <main className="flex-grow">
                    {children}
                </main>
            </SidebarInset>
        </SidebarProvider>
    );
}
