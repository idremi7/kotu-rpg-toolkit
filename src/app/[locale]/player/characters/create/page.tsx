import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Swords } from "lucide-react";
import Link from "next/link";

const mockSystems = [
  { id: 'd20-fantasy', name: 'D20 Fantasy', description: 'A classic system with attributes, skills, and feats for a high-fantasy setting.' },
  { id: 'space-opera', name: 'Cosmic Drift', description: 'A sci-fi system focusing on ship combat, cybernetics, and psionic powers.' },
  { id: 'cthulhu-noir', name: 'Shadows of Eldoria', description: 'A horror investigation system with sanity mechanics and forbidden lore.' },
];

export default function SelectSystemPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="font-headline text-4xl font-bold">Choose Your World</h1>
        <p className="text-muted-foreground">Select a game system to begin creating your character.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {mockSystems.map(system => (
          <Link key={system.id} href={`/player/characters/create/${system.id}`} className="block hover:scale-105 transition-transform duration-300">
            <Card className="h-full hover:border-primary hover:shadow-xl transition-all">
              <CardHeader>
                <CardTitle className="font-headline flex items-center gap-2">
                  <Swords className="text-primary" />
                  {system.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{system.description}</CardDescription>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
