'use client';

import { useEffect, useState } from 'react';
import { getSystem } from "@/lib/data-service";
import type { GameSystem } from '@/lib/data-service';
import { BackButton } from "@/components/BackButton";
import { CharacterCreator } from "@/components/player/CharacterCreator";
import { notFound } from "next/navigation";
import { Loader2 } from 'lucide-react';

export function CreateCharacterView({ systemId }: { systemId: string }) {
  const [system, setSystem] = useState<GameSystem | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getSystem(systemId).then(data => {
        if (data) {
            setSystem(data);
        }
        setIsLoading(false);
    });
  }, [systemId]);

  if (isLoading) {
    return (
        <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
    );
  }

  if (!system) {
      notFound();
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="relative mb-8 flex items-center justify-center">
         <div className="absolute left-0">
            <BackButton />
         </div>
        <div className="text-center">
            <h1 className="font-headline text-4xl font-bold">Forge Your Hero</h1>
            <p className="text-muted-foreground">
            You are creating a character for the <span className="text-primary font-semibold">{system.systemName}</span>{' '}
            system.
            </p>
        </div>
      </div>
      <CharacterCreator systemId={systemId} system={system} />
    </div>
  );
}
