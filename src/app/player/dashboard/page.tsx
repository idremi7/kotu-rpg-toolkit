import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, User } from "lucide-react";
import Link from "next/link";

const mockCharacters = [
  { id: 'elara', name: 'Elara', class: 'Wizard', level: 5, system: 'D20 Fantasy' },
  { id: 'kain', name: 'Kain', class: 'Smuggler', level: 3, system: 'Cosmic Drift' },
];

export default function PlayerDashboard() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="font-headline text-4xl font-bold">Player Dashboard</h1>
        <Button asChild>
          <Link href="/player/characters/create">
            <PlusCircle className="mr-2 h-4 w-4" />
            Create New Character
          </Link>
        </Button>
      </div>
      <p className="text-muted-foreground mb-8">Manage your heroes and embark on new adventures.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockCharacters.map(char => (
          <Card key={char.id} className="flex flex-col">
            <CardHeader>
              <CardTitle className="font-headline flex items-center gap-2">
                <User className="text-primary"/>
                {char.name}
              </CardTitle>
              <CardDescription>{char.class} Level {char.level} ({char.system})</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              {/* Future content like status or inventory snippets */}
            </CardContent>
             <div className="p-4 pt-0">
               <Button variant="secondary" className="w-full">View Character Sheet</Button>
            </div>
          </Card>
        ))}
         <Card className="border-dashed flex items-center justify-center">
            <Button variant="ghost" className="w-full h-full text-lg" asChild>
                 <Link href="/player/characters/create">
                    <PlusCircle className="mr-2 h-6 w-6" />
                    Create a Character
                 </Link>
            </Button>
        </Card>
      </div>
    </div>
  );
}
