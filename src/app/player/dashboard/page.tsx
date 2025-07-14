import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, User } from "lucide-react";
import Link from "next/link";
import { listCharactersAction } from "@/actions";
import { ImportCharacterButton } from "@/components/ImportCharacterButton";

export default async function PlayerDashboard() {
  const characters = await listCharactersAction();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
        <div>
            <h1 className="font-headline text-4xl font-bold">Player Dashboard</h1>
            <p className="text-muted-foreground mt-1">Manage your heroes and embark on new adventures.</p>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
            <ImportCharacterButton className="flex-grow sm:flex-grow-0" />
            <Button asChild size="lg" className="flex-grow sm:flex-grow-0">
                <Link href="/player/characters/create">
                    <PlusCircle className="mr-2 h-5 w-5" />
                    Create New Character
                </Link>
            </Button>
        </div>
      </div>
      
      {characters.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {characters.map(char => (
            <Card key={char.characterId} className="flex flex-col">
              <CardHeader>
                <CardTitle className="font-headline flex items-center gap-2">
                  <User className="text-primary"/>
                  {char.data.name}
                </CardTitle>
                <CardDescription>{char.data.class} - Level {char.data.level}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                {/* Future content like status or inventory snippets */}
              </CardContent>
               <div className="p-4 pt-0">
                 <Button asChild variant="secondary" className="w-full">
                    <Link href={`/player/characters/${char.characterId}`}>View Character Sheet</Link>
                </Button>
              </div>
            </Card>
          ))}
        </div>
      ) : (
         <div className="text-center py-16 border-2 border-dashed rounded-lg mt-12">
          <h2 className="text-2xl font-semibold mb-2">No Characters Found</h2>
          <p className="text-muted-foreground mb-4">It looks like you haven't created any characters yet.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 px-4">
            <ImportCharacterButton className="w-full" />
            <Button asChild size="lg" className="w-full">
                <Link href="/player/characters/create">
                <PlusCircle className="mr-2 h-5 w-5" />
                Create Your First Character
                </Link>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
