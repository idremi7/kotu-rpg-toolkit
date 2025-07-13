import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Swords, Shield, ScrollText, User, Users } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-12">
      <section className="text-center mb-16">
        <h1 className="font-headline text-5xl md:text-7xl font-bold tracking-tight text-primary">
          KOTU: RPG Toolkit
        </h1>
        <p className="mt-4 text-lg md:text-xl text-foreground/80 max-w-3xl mx-auto">
          Your digital companion for crafting and embarking on epic tabletop adventures. Create bespoke game systems as a Game Master, or bring your heroes to life as a Player.
        </p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        <Card className="hover:shadow-lg hover:border-primary/50 transition-all duration-300">
          <CardHeader className="flex-row items-center gap-4">
            <Users className="w-12 h-12 text-primary" />
            <div>
              <CardTitle className="font-headline text-2xl">For Game Masters</CardTitle>
              <CardDescription>The Architect's Workshop</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <p className="mb-6">
              Forge unique worlds with custom rules. Define attributes, skills, feats, and saves to build the backbone of your next campaign. Our AI-powered tools help you generate character sheets and forms dynamically.
            </p>
            <Button asChild className="w-full" size="lg">
              <Link href="/gm/dashboard">Go to GM Dashboard</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg hover:border-primary/50 transition-all duration-300">
          <CardHeader className="flex-row items-center gap-4">
            <User className="w-12 h-12 text-primary" />
            <div>
              <CardTitle className="font-headline text-2xl">For Players</CardTitle>
              <CardDescription>The Hero's Forge</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <p className="mb-6">
              Step into a world of adventure. Create detailed characters using your GM's custom system. Allocate points, choose your path, and watch your character sheet update in real-time. Your legend begins here.
            </p>
            <Button asChild className="w-full" size="lg">
              <Link href="/player/dashboard">Go to Player Dashboard</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
      
      <section className="mt-20 text-center">
        <h2 className="font-headline text-3xl font-bold mb-6">Core Features</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-6xl mx-auto text-left">
          <div className="flex items-start gap-4">
            <Swords className="w-8 h-8 text-accent flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-bold text-lg">Custom System Builder</h3>
              <p className="text-foreground/80">Design RPG systems with unique attributes, skills, and feats.</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <Shield className="w-8 h-8 text-accent flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-bold text-lg">Intelligent Form Generation</h3>
              <p className="text-foreground/80">Automatically create character creation forms from your system rules.</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <ScrollText className="w-8 h-8 text-accent flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-bold text-lg">Live Character Sheets</h3>
              <p className="text-foreground/80">Interactive, real-time character sheets that are easy to view and export.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
