'use client';

import { useRef } from 'react';
import { Button } from './ui/button';
import { Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { saveCharacterAction } from '@/actions';

export function ImportCharacterButton() {
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
        const characterData = JSON.parse(text);
        
        // Pass a dummy value for the first argument as it's not used in import mode
        const result = await saveCharacterAction(null, characterData, true);

        if (result.success) {
          toast({
            title: 'Character Imported',
            description: `Successfully imported ${characterData.data.name}.`,
          });
        } else {
          toast({
            variant: 'destructive',
            title: 'Import Failed',
            description: result.error || 'The character file might be corrupt or invalid.',
          });
        }
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
      <Button onClick={handleButtonClick} variant="outline" size="lg">
        <Upload className="mr-2 h-5 w-5" />
        Import Character
      </Button>
    </>
  );
}
