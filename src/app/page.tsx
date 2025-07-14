
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Users, FileText, UserPlus, Swords } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  const steps = [
    {
      icon: <Users className="w-24 h-24 text-primary" />,
      title: '1. The GM Crafts a World',
      description:
        'As a Game Master, you define the rules of your universe. Create custom attributes, skills, and feats to build a unique system for your campaign. Use AI to get suggestions and speed up your creative process.',
    },
    {
      icon: <FileText className="w-24 h-24 text-primary" />,
      title: '2. A Dynamic Form is Ready',
      description:
        'The system provides a standardized character sheet form that adapts to the rules you created, ready for players to use.',
    },
    {
      icon: <UserPlus className="w-24 h-24 text-primary" />,
      title: '3. Players Create Their Heroes',
      description:
        "Players can then use the generated form to create their characters, fill out their stats, and choose their abilities, ready to jump into the adventure.",
    },
  ];

  return (
    <div className="flex flex-col">
      <section className="text-center py-20 px-4 bg-card/50">
        <h1 className="font-headline text-5xl md:text-7xl font-bold tracking-tight">
          V.E.R.S.A.: RPG Toolkit
        </h1>
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
          <Button asChild size="lg" variant="secondary">
            <Link href="/player/dashboard">
              <Swords className="mr-2" />
              Start as Player
            </Link>
          </Button>
        </div>
      </section>

      <section id="how-it-works" className="py-20 px-4">
        <div className="container mx-auto">
          <h2 className="text-4xl font-headline font-bold text-center mb-12">
            How It Works
          </h2>
          <div className="space-y-16">
            {steps.map((step, index) => (
              <div
                key={index}
                className={`flex flex-col md:flex-row items-center gap-12 ${
                  index % 2 === 1 ? 'md:flex-row-reverse' : ''
                }`}
              >
                <div className="md:w-1/2 text-center md:text-left">
                  <div className="flex justify-center md:justify-start mb-4">
                    {React.cloneElement(step.icon, {
                      className: 'w-10 h-10 text-primary',
                    })}
                  </div>
                  <h3 className="text-3xl font-bold font-headline mb-4">
                    {step.title}
                  </h3>
                  <p className="text-lg text-muted-foreground">
                    {step.description}
                  </p>
                </div>
                <div className="md:w-1/2">
                  <Card className="shadow-xl bg-card/50 aspect-square flex items-center justify-center p-8">
                    <CardContent className="p-0">
                      {React.cloneElement(step.icon, {
                        className: 'w-32 h-32 text-primary/80',
                      })}
                    </CardContent>
                  </Card>
                </div>
              </div>
            ))}
          </div>
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
