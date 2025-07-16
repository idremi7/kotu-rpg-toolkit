'use client';

import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, User, Loader2 } from "lucide-react";
import Link from "next/link";
import { listCharacters } from "@/lib/data-service";
import type { Character } from '@/lib/data-service';
import { ImportCharacterButton } from "@/components/ImportCharacterButton";
import { useMounted } from '@/hooks/use-mounted';

export default function PlayerDashboard() {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const mounted = useMounted();
  
  const loadCharacters = async () => {
    setIsLoading(true);
    const charList = await listCharacters();
    setCharacters(charList);
    setIsLoading(false);
  }

  useEffect(() => {
    if (mounted) {
      loadCharacters();
    }
  }, [mounted]);

  if (!mounted || isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
        <div>
            <h1 className="font-headline text-4xl font-bold">Player Dashboard</h1>
            <p className="text-muted-foreground mt-1">Manage your heroes and embark on new adventures.</p>
        </div>
        {characters.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
              <ImportCharacterButton onImport={loadCharacters} className="w-full sm:w-auto" />
              <Button asChild size="lg" className="w-full sm:w-auto">
                  <Link href="/player/characters/create">
                      <PlusCircle className="mr-2 h-5 w-5" />
                      Create New Character
                  </Link>
              </Button>
          </div>
        )}
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
            <ImportCharacterButton onImport={loadCharacters} className="w-full" />
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
