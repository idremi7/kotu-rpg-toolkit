
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "../ui/badge";
import { Printer, Pencil, Heart } from 'lucide-react';
import { BackButton } from "../BackButton";
import type { Character, GameSystem, Feat } from "@/lib/data-service";
import { ExportCharacterButton } from "../ExportCharacterButton";
import Link from "next/link";
import { Progress } from "../ui/progress";

interface CharacterSheetPreviewProps {
  character: Character;
  system: GameSystem;
}

const getModifier = (score: number) => {
  if (typeof score !== 'number' || isNaN(score)) return '+0';
  const mod = Math.floor((score - 10) / 2);
  return mod >= 0 ? `+${mod}` : mod;
};

export function CharacterSheetPreview({ character, system }: CharacterSheetPreviewProps) {
  if (!character || !system) return null;

  const { data } = character;
  
  const handlePrint = () => {
    window.print();
  };

  const getFeatDetails = (featName: string): Feat | undefined => {
    return system.feats.find((f: any) => f.name === featName);
  };

  const hpPercentage = data.maxHp > 0 ? (data.hp / data.maxHp) * 100 : 0;

  return (
    <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-4 no-print">
            <BackButton />
            <div className="flex items-center gap-2">
              <Button asChild variant="outline" size="sm">
                <Link href={`/player/characters/${character.characterId}/edit`}>
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit
                </Link>
              </Button>
              <ExportCharacterButton character={character} />
              <Button onClick={handlePrint} variant="outline" size="sm">
                  <Printer className="mr-2 h-4 w-4" />
                  Print
              </Button>
            </div>
        </div>
        <Card className="shadow-lg" id="character-sheet-preview">
        <CardHeader>
            <div className="flex justify-between items-start">
                <div>
                <CardTitle className="font-headline text-3xl">{data.name || 'Character Name'}</CardTitle>
                <CardDescription>
                    {data.class || 'Class'} - Level {data.level || 1}
                </CardDescription>
                <CardDescription className="pt-1">
                    System: {system.systemName}
                </CardDescription>
                </div>
                {data.maxHp > 0 && (
                    <div className="text-right w-1/3">
                        <div className="flex items-center justify-end gap-2 text-lg font-bold text-red-500">
                           <Heart className="h-5 w-5"/>
                           <span>{data.hp ?? '??'} / {data.maxHp ?? '??'}</span>
                        </div>
                        <Progress value={hpPercentage} className="mt-1 h-2" indicatorClassName="bg-red-500"/>
                    </div>
                )}
            </div>
        </CardHeader>
        <CardContent className="space-y-6">
            <div>
                <h3 className="font-headline text-lg mb-2">Attributes</h3>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 text-center">
                    {data.attributes && Object.entries(data.attributes).map(([key, value]) => (
                        <div key={key} className="bg-muted/50 rounded-md p-2 flex flex-col justify-center">
                            <div className="text-xs uppercase text-muted-foreground">{key}</div>
                            <div className="font-bold text-lg">{system.usesD20StyleModifiers ? getModifier(value as number) : (value as number)}</div>
                            {system.usesD20StyleModifiers && <div className="text-sm text-foreground/80">{value as number}</div>}
                        </div>
                    ))}
                </div>
            </div>
            
            <Separator />

             <div>
                <h3 className="font-headline text-lg mb-2">Saves</h3>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 text-center">
                    {data.saves && Object.entries(data.saves).map(([key, value]) => (
                        <div key={key} className="bg-muted/50 rounded-md p-2">
                            <div className="text-xs uppercase text-muted-foreground">{key}</div>
                            <div className="font-bold text-lg">{value as number >= 0 ? `+${value}`: value}</div>
                        </div>
                    ))}
                </div>
            </div>
            
            <Separator />
            
            <div>
                <h3 className="font-headline text-lg mb-2">Skills</h3>
                <div className="columns-1 md:columns-2 lg:columns-3 gap-x-8">
                {(data.skills && data.skills.length > 0) ? data.skills.map((skill: any) => (
                    <div key={skill.name} className="flex justify-between py-1 break-inside-avoid">
                        <span className="font-semibold">{skill.name}</span>
                        <span className="font-mono text-primary">{skill.value >= 0 ? `+${skill.value}`: skill.value}</span>
                    </div>
                )) : <p className="text-sm text-muted-foreground">No skills selected.</p>}
                </div>
            </div>

            <Separator />

            <div>
              <h3 className="font-headline text-lg mb-2">Feats</h3>
              <div className="space-y-3">
                {(data.feats && data.feats.length > 0) ? data.feats.map((feat: any, index: number) => {
                  const featDetails = getFeatDetails(feat.name);
                  if (featDetails) {
                    // It's a feat from the system library
                    return (
                      <div key={`${feat.name}-${index}`}>
                        <div className="flex items-baseline justify-between">
                          <span className="font-semibold">{feat.name}</span>
                          {featDetails.effect && <Badge variant="secondary">{featDetails.effect}</Badge>}
                        </div>
                        <p className="text-sm text-muted-foreground">{featDetails.description}</p>
                      </div>
                    );
                  } else {
                    // It's a custom feat entered by the player
                    return (
                      <div key={`${feat.name}-${index}`}>
                        <div className="flex items-baseline justify-between">
                            <span className="font-semibold">{feat.name}</span>
                            {feat.effect && <Badge variant="secondary">{feat.effect}</Badge>}
                        </div>
                         {feat.effect && <p className="text-sm text-muted-foreground italic">Player-defined effect.</p>}
                      </div>
                    );
                  }
                }) : <p className="text-sm text-muted-foreground">No feats selected.</p>}
              </div>
            </div>


            <Separator />

            <div>
                <h3 className="font-headline text-lg mb-2">Backstory</h3>
                <p className="text-sm text-foreground/80 italic bg-muted/30 p-3 rounded-md min-h-[50px] whitespace-pre-wrap">
                    {data.backstory || 'No backstory provided.'}
                </p>
            </div>
        </CardContent>
        </Card>
    </div>
  );
}
