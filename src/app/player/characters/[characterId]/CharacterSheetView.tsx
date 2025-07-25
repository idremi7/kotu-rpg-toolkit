'use client';

import { useEffect, useState } from 'react';
import { getCharacter, getSystem } from "@/lib/data-service";
import type { Character, GameSystem } from '@/lib/data-service';
import { CharacterSheetPreview } from "@/components/player/CharacterSheetPreview";
import { notFound } from "next/navigation";
import { Loader2 } from 'lucide-react';

export function CharacterSheetView({ characterId }: { characterId: string }) {
  const [character, setCharacter] = useState<Character | null>(null);
  const [system, setSystem] = useState<GameSystem | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const charData = await getCharacter(characterId);
      if (charData) {
        const sysData = await getSystem(charData.systemId);
        setCharacter(charData);
        setSystem(sysData);
      }
      setIsLoading(false);
    };
    loadData();
  }, [characterId]);

  if (isLoading) {
    return (
        <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
    );
  }
  
  if (!character || !system) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <CharacterSheetPreview character={character} system={system} />
    </div>
  );
}
