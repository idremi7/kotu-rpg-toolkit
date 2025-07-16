'use client';

import { useRef } from 'react';
import { Button } from './ui/button';
import { Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { saveCharacter } from '@/lib/data-service';
import { cn } from '@/lib/utils';
import type { Character } from '@/lib/data-service';

interface ImportCharacterButtonProps {
    className?: string;
    onImport?: () => void;
}

export function ImportCharacterButton({ className, onImport }: ImportCharacterButtonProps) {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/json') {
      toast({
        variant: 'destructive',
        title: 'Invalid File Type',
        description: 'Please select a valid JSON file.',
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const text = e.target?.result as string;
        const characterData = JSON.parse(text) as Character;
        
        await saveCharacter(characterData);

        toast({
          title: 'Character Imported',
          description: `Successfully imported ${characterData.data.name}.`,
        });

        onImport?.();

      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'Import Error',
          description: 'Could not parse the JSON file. Please check its format.',
        });
      }
    };
    reader.readAsText(file);

    // Reset the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".json"
        className="hidden"
      />
      <Button onClick={handleButtonClick} variant="outline" size="lg" className={cn(className)}>
        <Upload className="mr-2 h-5 w-5" />
        Import Character
      </Button>
    </>
  );
}
