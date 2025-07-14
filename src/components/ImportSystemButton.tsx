'use client';

import { useRef } from 'react';
import { Button } from './ui/button';
import { Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { saveSystemAction } from '@/actions';

export function ImportSystemButton() {
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
        const systemData = JSON.parse(text);
        
        const result = await saveSystemAction(systemData, true);

        if (result.success) {
          toast({
            title: 'System Imported',
            description: `Successfully imported the "${systemData.systemName}" system.`,
          });
        } else {
          toast({
            variant: 'destructive',
            title: 'Import Failed',
            description: result.error || 'The system file might be corrupt or invalid.',
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

    // Reset the file input so the same file can be selected again
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
        Import System
      </Button>
    </>
  );
}
