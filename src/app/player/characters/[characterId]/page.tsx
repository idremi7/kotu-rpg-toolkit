'use client';

import { useEffect, useState } from 'react';
import { getCharacter, getSystem } from "@/lib/data-service";
import type { Character, GameSystem } from '@/lib/data-service';
import { CharacterSheetPreview } from "@/components/player/CharacterSheetPreview";
import { notFound } from "next/navigation";
import { Loader2 } from 'lucide-react';
import { useMounted } from '@/hooks/use-mounted';

export default function CharacterSheetPage({ params }: { params: { characterId: string }}) {
  const [character, setCharacter] = useState<Character | null>(null);
  const [system, setSystem] = useState<GameSystem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const mounted = useMounted();
  const { characterId } = params;

  useEffect(() => {
    if (mounted) {
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
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <CharacterSheetPreview character={character} system={system} />
    </div>
  );
}
