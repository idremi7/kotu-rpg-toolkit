
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, FileText, UserPlus, Cpu, Database, Wind, Swords } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

const howItWorksSteps = [
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

const techStack = [
    { name: 'Next.js', icon: <Wind />, description: 'The React framework for building fast, modern web applications.' },
    { name: 'Shadcn/UI', icon: <div className="text-2xl font-bold">⌘</div>, description: 'Beautifully designed components that you can copy and paste into your apps.' },
    { name: 'Genkit & Gemini', icon: <Cpu />, description: 'Google\'s open-source generative AI toolkit for building AI-powered features.' },
    { name: 'Tailwind CSS', icon: <Wind />, description: 'A utility-first CSS framework for rapid UI development.' },
    { name: 'Local JSON', icon: <Database />, description: 'Simple, file-based storage for portability and ease of use—no database required.'},
];

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <section className="text-center max-w-4xl mx-auto">
        <h1 className="font-headline text-5xl font-bold">About VERSA</h1>
        <p className="mt-4 text-xl text-muted-foreground">
          Empowering creativity in tabletop role-playing games.
        </p>
      </section>
      
      <section id="mission" className="py-16">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-headline font-bold mb-4">Our Mission</h2>
          <p className="text-lg text-foreground/80 leading-relaxed">
            To liberate creativity in tabletop role-playing by providing a flexible, intuitive, and accessible digital toolkit. VERSA aims to lower the barrier to entry for creating custom game systems and to streamline character management, allowing Game Masters and Players to focus on what truly matters: storytelling and adventure.
          </p>
        </div>
      </section>

      <section id="how-it-works" className="py-16 bg-muted/50 rounded-lg">
        <div className="container mx-auto">
          <h2 className="text-4xl font-headline font-bold text-center mb-12">
            How It Works
          </h2>
          <div className="space-y-16">
            {howItWorksSteps.map((step, index) => (
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
                  <Card className="shadow-xl bg-card aspect-square flex items-center justify-center p-8">
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

      <section id="tech-stack" className="py-16">
        <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-headline font-bold mb-8">Technology Stack</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {techStack.map(tech => (
                    <Card key={tech.name} className="p-6 text-center">
                        <div className="flex justify-center mb-4 text-primary">{tech.icon}</div>
                        <h3 className="font-bold text-lg">{tech.name}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{tech.description}</p>
                    </Card>
                ))}
            </div>
        </div>
      </section>

       <section className="text-center py-16">
        <h2 className="text-4xl font-headline font-bold mb-4">
            Ready to Start?
        </h2>
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
    </div>
  );
}
