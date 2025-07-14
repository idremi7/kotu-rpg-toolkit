import { listSystemsAction } from "@/app/actions";
import { BackButton } from "@/components/BackButton";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Swords } from "lucide-react";
import Link from "next/link";


export default async function SelectSystemPage() {
  const systems = await listSystemsAction();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="relative text-center mb-8">
         <div className="absolute left-0 top-1/2 -translate-y-1/2">
            <BackButton />
         </div>
        <h1 className="font-headline text-4xl font-bold">Choose Your World</h1>
        <p className="text-muted-foreground">Select a game system to begin creating your character.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {systems.map(system => (
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
