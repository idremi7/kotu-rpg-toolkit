'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "../ui/badge";
import { FileDown, User, ShieldCheck, Swords, BrainCircuit, Heart, Star } from 'lucide-react';

interface CharacterSheetPreviewProps {
  data: any;
  onPrint: () => void;
}

const getModifier = (score: number) => {
  const mod = Math.floor((score - 10) / 2);
  return mod >= 0 ? `+${mod}` : mod;
};

export function CharacterSheetPreview({ data, onPrint }: CharacterSheetPreviewProps) {
  const attributeIcons: { [key: string]: React.ReactNode } = {
    strength: <Swords className="w-4 h-4 mr-2" />,
    dexterity: <ShieldCheck className="w-4 h-4 mr-2" />,
    constitution: <Heart className="w-4 h-4 mr-2" />,
    intelligence: <BrainCircuit className="w-4 h-4 mr-2" />,
    wisdom: <BrainCircuit className="w-4 h-4 mr-2" />,
    charisma: <Star className="w-4 h-4 mr-2" />,
  };
  
  return (
    <Card className="shadow-lg" id="character-sheet-preview">
      <CardHeader>
        <div className="flex justify-between items-start">
            <div>
              <CardTitle className="font-headline text-3xl text-primary">{data.name || 'Character Name'}</CardTitle>
              <CardDescription>
                {data.class || 'Class'} - Level {data.level || 1}
              </CardDescription>
            </div>
            <Button onClick={onPrint} variant="outline" size="sm" className="no-print">
                <FileDown className="mr-2 h-4 w-4" />
                Export PDF
            </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
            <h3 className="font-headline text-lg mb-2">Attributes</h3>
            <div className="grid grid-cols-3 gap-2 text-center">
                {data.attributes && Object.entries(data.attributes).map(([key, value]) => (
                    <div key={key} className="bg-muted/50 rounded-md p-2">
                        <div className="text-xs uppercase text-muted-foreground">{key.slice(0,3)}</div>
                        <div className="font-bold text-lg">{getModifier(value as number)}</div>
                        <div className="text-sm text-foreground/80">{value as number}</div>
                    </div>
                ))}
            </div>
        </div>
        
        <Separator />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <h3 className="font-headline text-lg mb-2">Skills</h3>
                <div className="flex flex-wrap gap-2">
                {(data.skills && data.skills.length > 0) ? data.skills.map((skill: string) => (
                    <Badge key={skill} variant="secondary">{skill}</Badge>
                )) : <p className="text-sm text-muted-foreground">No skills selected.</p>}
                </div>
            </div>
            <div>
                <h3 className="font-headline text-lg mb-2">Feats</h3>
                 <div className="flex flex-wrap gap-2">
                {(data.feats && data.feats.length > 0) ? data.feats.map((feat: string) => (
                    <Badge key={feat} variant="secondary">{feat}</Badge>
                )) : <p className="text-sm text-muted-foreground">No feats selected.</p>}
                </div>
            </div>
        </div>

        <Separator />

         <div>
            <h3 className="font-headline text-lg mb-2">Backstory</h3>
            <p className="text-sm text-foreground/80 italic bg-muted/30 p-3 rounded-md min-h-[50px]">
                {data.backstory || 'No backstory provided.'}
            </p>
        </div>
      </CardContent>
    </Card>
  );
}
