import Link from "next/link";
import { Logo } from "./Logo";

export function Footer() {
    return (
        <footer className="border-t border-border/40 bg-background/95">
            <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between py-6 gap-4">
                <div className="flex items-center gap-2">
                    <Logo className="h-6 w-6 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                        &copy; {new Date().getFullYear()} VERSA. All rights reserved.
                    </p>
                </div>
                <nav className="flex gap-4">
                    <Link href="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                        About
                    </Link>
                     <Link href="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                        Home
                    </Link>
                </nav>
            </div>
        </footer>
    )
}
