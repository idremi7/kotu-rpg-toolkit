'use client';

import { Button } from './ui/button';
import { Download } from 'lucide-react';
import type { Character } from '@/lib/data-service';

interface ExportCharacterButtonProps {
  character: Character;
}

export function ExportCharacterButton({ character }: ExportCharacterButtonProps) {
  const handleExport = () => {
    if (!character) return;

    const characterDataString = JSON.stringify(character, null, 2);
    const blob = new Blob([characterDataString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${character.data.name.toLowerCase().replace(/\s+/g, '-')}-${character.characterId}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Button onClick={handleExport} variant="outline" size="sm">
      <Download className="mr-2 h-4 w-4" />
      Export Character
    </Button>
  );
}
