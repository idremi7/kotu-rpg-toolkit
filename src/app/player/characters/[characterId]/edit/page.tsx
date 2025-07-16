'use client';

import { useEffect, useState } from 'react';
import { getCharacter, getSystem } from '@/lib/data-service';
import type { Character, GameSystem } from '@/lib/data-service';
import { CharacterCreator } from '@/components/player/CharacterCreator';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { useMounted } from '@/hooks/use-mounted';

export default function EditCharacterPage({ params: { characterId } }: { params: { characterId: string } }) {
  const [character, setCharacter] = useState<Character | null>(null);
  const [system, setSystem] = useState<GameSystem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const mounted = useMounted();

  useEffect(() => {
    if (mounted) {
      const loadData = async () => {
        const char = await getCharacter(characterId);
        if (char) {
          const sys = await getSystem(char.systemId);
          setCharacter(char);
          setSystem(sys);
        }
        setIsLoading(false);
      };
      loadData();
    }
  }, [characterId, mounted]);

  if (!mounted || isLoading) {
    return (
        <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
    );
  }

  if (!character || !system) {
    return notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="relative mb-8 flex items-center justify-center">
        <div className="absolute left-0">
          <Button asChild variant="outline" size="icon">
            <Link href="/player/dashboard">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back to Dashboard</span>
            </Link>
          </Button>
        </div>
        <div className="text-center">
          <h1 className="font-headline text-4xl font-bold">Edit Character</h1>
          <p className="text-muted-foreground">
            You are editing{' '}
            <span className="text-primary font-semibold">{character.data.name}</span> for the{' '}
            <span className="text-primary font-semibold">{system.systemName}</span> system.
          </p>
        </div>
      </div>
      <CharacterCreator systemId={character.systemId} system={system} initialCharacter={character} />
    </div>
  );
}
