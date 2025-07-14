
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Users, FileText, UserPlus, Swords } from 'lucide-react';
import Link from 'next/link';

export default function Home() {

  return (
    <div className="flex flex-col">
      <section className="text-center py-20 px-4 bg-card/50">
        <h1 className="font-headline text-5xl md:text-7xl font-bold tracking-tight dark:text-primary">
          VERSA
        </h1>
        <p className="mt-4 text-lg md:text-xl text-foreground/80 max-w-3xl mx-auto">
          (Versatile Encyclopedic RPG System Assistant)
        </p>
        <p className="mt-6 text-2xl md:text-3xl text-foreground max-w-4xl mx-auto font-semibold">
          The Universal Toolkit for Your Tabletop RPG Adventures.
        </p>
        <p className="mt-4 text-lg md:text-xl text-foreground/80 max-w-3xl mx-auto">
          Your digital companion for crafting and embarking on epic tabletop
          adventures. Create bespoke game systems as a Game Master, or bring
          your heroes to life as a Player.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg">
            <Link href="/gm/dashboard">
              <Users className="mr-2" />
              Start as GM
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/player/dashboard">
              <Swords className="mr-2" />
              Start as Player
            </Link>
          </Button>
        </div>
      </section>

      <section className="bg-muted py-20 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-headline font-bold mb-4">
            Ready to Start Your Adventure?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Create an account for free and begin building your worlds or your
            next great hero.
          </p>
          <Button asChild size="lg">
            <Link href="/signup">Sign Up Now</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
