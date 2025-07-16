'use client';

import { useEffect, useState } from 'react';
import { getSystem } from '@/lib/data-service';
import type { GameSystem, Feat } from '@/lib/data-service';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { BackButton } from '@/components/BackButton';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Pencil, Loader2 } from 'lucide-react';
import { ExportSystemButton } from '@/components/ExportSystemButton';
import { Separator } from '@/components/ui/separator';
import { useMounted } from '@/hooks/use-mounted';

export default function SystemDetailsPage({ params }: { params: { systemId: string }}) {
  const [system, setSystem] = useState<GameSystem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const mounted = useMounted();
  const { systemId } = params;

  useEffect(() => {
      if (mounted) {
        getSystem(systemId).then(data => {
            if (data) {
                setSystem(data);
            }
            setIsLoading(false);
        });
      }
  }, [systemId, mounted]);

  if (!mounted || isLoading) {
    return (
        <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
    );
  }

  if (!system) {
    notFound();
  }

  const { systemName, attributes, skills, feats, saves, customRules } = system;

  const groupedSkills = skills.reduce((acc, skill) => {
    const { baseAttribute } = skill;
    if (!acc[baseAttribute]) {
      acc[baseAttribute] = [];
    }
    acc[baseAttribute].push(skill);
    return acc;
  }, {} as Record<string, typeof skills>);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-8 gap-4">
        <BackButton />
        <div className="text-center flex-grow">
            <h1 className="font-headline text-4xl font-bold">System Details</h1>
            <p className="text-muted-foreground">Configuration for the {systemName} system.</p>
        </div>
        <div className="flex items-center gap-2">
            <ExportSystemButton system={system} />
            <Button asChild variant="outline">
            <Link href={`/gm/systems/${systemId}/edit`}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit System
            </Link>
            </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        <Card>
            <CardHeader><CardTitle>Attributes</CardTitle></CardHeader>
            <CardContent className="space-y-2">
                {attributes.map((attr: any) => (
                    <div key={attr.name}>
                        <h4 className="font-semibold">{attr.name}</h4>
                        <p className="text-sm text-muted-foreground">{attr.description}</p>
                    </div>
                ))}
            </CardContent>
        </Card>
        
        <Card>
            <CardHeader><CardTitle>Saves</CardTitle></CardHeader>
            <CardContent className="space-y-2">
                {saves.map((save: any) => (
                    <div key={save.name}>
                        <h4 className="font-semibold">{save.name} <Badge variant="outline">{save.baseAttribute}</Badge></h4>
                    </div>
                ))}
            </CardContent>
        </Card>
        
        <Card className="lg:row-span-2 flex flex-col">
            <CardHeader>
                <CardTitle>Skills</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow min-h-0">
                <ScrollArea className="h-full">
                    <Accordion type="multiple" className="w-full">
                        {Object.entries(groupedSkills).map(([attribute, skillList]) => (
                            <AccordionItem key={attribute} value={attribute}>
                                <AccordionTrigger>{attribute}</AccordionTrigger>
                                <AccordionContent>
                                    <div className="space-y-2 pl-2">
                                        {skillList.map((skill: any, index: number) => (
                                            <div key={`${skill.name}-${index}`}>
                                                <h4 className="font-semibold">{skill.name}</h4>
                                            </div>
                                        ))}
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </ScrollArea>
            </CardContent>
        </Card>

        <Card className="lg:col-span-2">
            <CardHeader><CardTitle>Feats</CardTitle></CardHeader>
             <CardContent className="space-y-4">
                {feats.map((feat: any, index: number) => (
                    <div key={`${feat.name}-${index}`}>
                        <div className="flex justify-between items-baseline">
                           <h4 className="font-semibold">{feat.name}</h4>
                           {feat.effect && <Badge variant="secondary">{feat.effect}</Badge>}
                        </div>
                        <p className="text-sm text-muted-foreground">{feat.description}</p>
                        {feat.prerequisites && <p className="text-xs text-muted-foreground">Requires: {feat.prerequisites}</p>}
                    </div>
                ))}
            </CardContent>
        </Card>
        
        {customRules && customRules.length > 0 && (
          <Card className="md:col-span-2 lg:col-span-3">
            <CardHeader><CardTitle>Custom Rules</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {customRules.map((rule, index) => (
                <div key={index}>
                  <h4 className="font-semibold">{rule.title}</h4>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">{rule.description}</p>
                  {index < customRules.length - 1 && <Separator className="mt-4" />}
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
