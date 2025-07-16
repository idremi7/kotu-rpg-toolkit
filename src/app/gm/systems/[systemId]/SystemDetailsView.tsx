
'use client';

import { useEffect, useState } from 'react';
import { deleteSystem, getSystem } from '@/lib/data-service';
import type { GameSystem } from '@/lib/data-service';
import { notFound, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { BackButton } from '@/components/BackButton';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Pencil, Loader2, Trash2, Rows, Columns, ChevronDown } from 'lucide-react';
import { ExportSystemButton } from '@/components/ExportSystemButton';
import { Separator } from '@/components/ui/separator';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { cn } from '@/lib/utils';

export function SystemDetailsView({ systemId }: { systemId: string }) {
  const [system, setSystem] = useState<GameSystem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();
  
  const [openAccordionItems, setOpenAccordionItems] = useState<string[]>([]);
  const [allAttributeKeys, setAllAttributeKeys] = useState<string[]>([]);


  useEffect(() => {
      getSystem(systemId).then(data => {
          if (data) {
              setSystem(data);
              
              const grouped = data.skills.reduce((acc, skill) => {
                const { baseAttribute } = skill;
                if (!acc[baseAttribute]) acc[baseAttribute] = [];
                acc[baseAttribute].push(skill);
                return acc;
              }, {} as Record<string, typeof data.skills>);

              const defaultOpen = Object.entries(grouped)
                .filter(([, skillList]) => skillList.length < 10)
                .map(([attribute]) => attribute);
              
              setOpenAccordionItems(defaultOpen);
              setAllAttributeKeys(Object.keys(grouped));

          }
          setIsLoading(false);
      });
  }, [systemId]);
  
  const handleDeleteSystem = async () => {
    if (!system) return;

    const result = await deleteSystem(system.systemId);
    if (result.success) {
      toast({
        title: 'System Deleted',
        description: `The system "${system.systemName}" has been successfully deleted.`,
      });
      router.push('/gm/dashboard');
    } else {
      toast({
        variant: 'destructive',
        title: 'Deletion Failed',
        description: result.error || 'An unknown error occurred while deleting the system.',
      });
    }
  };


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

  const { systemName, attributes, skills, feats, saves, customRules } = system;

  const groupedSkills = skills.reduce((acc, skill) => {
    const { baseAttribute } = skill;
    if (!acc[baseAttribute]) {
      acc[baseAttribute] = [];
    }
    acc[baseAttribute].push(skill);
    return acc;
  }, {} as Record<string, typeof skills>);
  
  const getAttributeDescription = (attrName: string) => {
    return attributes.find(attr => attr.name === attrName)?.description || 'No description available.';
  }

  return (
    <TooltipProvider>
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
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" >
                    <Trash2 className="mr-2 h-4 w-4"/>
                    Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete the 
                      <span className="font-semibold text-foreground"> {system.systemName} </span>
                       system and all associated characters.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteSystem}>
                      Yes, delete system
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
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
                        <div key={save.name} className="flex items-center gap-2">
                            <h4 className="font-semibold">{save.name}</h4> 
                            <Tooltip>
                              <TooltipTrigger>
                                <Badge variant="outline">{save.baseAttribute}</Badge>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>{getAttributeDescription(save.baseAttribute)}</p>
                              </TooltipContent>
                            </Tooltip>
                        </div>
                    ))}
                </CardContent>
            </Card>

            <Card className="md:col-span-2">
                <CardHeader><CardTitle>Feats</CardTitle></CardHeader>
                <CardContent>
                    <Accordion type="multiple" className="w-full">
                    {feats.map((feat: any, index: number) => (
                        <AccordionItem value={`feat-${index}`} key={`${feat.name}-${index}`} className="border-b last:border-b-0">
                            <AccordionTrigger 
                                disabled={!feat.effect} 
                                className={cn("py-3 text-left hover:no-underline", !feat.effect && "cursor-default")}
                            >
                                <div className="flex-1">
                                    <h4 className="font-semibold">{feat.name}</h4>
                                    <p className="text-sm text-muted-foreground">{feat.description}</p>
                                    {feat.prerequisites && <p className="text-xs text-muted-foreground mt-1">Requires: {feat.prerequisites}</p>}
                                </div>
                                {feat.effect && <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />}
                            </AccordionTrigger>
                            <AccordionContent>
                                <p className="text-sm text-foreground/80 italic bg-muted/30 p-3 rounded-md whitespace-pre-wrap">
                                    {feat.effect}
                                </p>
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                    </Accordion>
                </CardContent>
            </Card>
          </div>
          
          <Card className="flex flex-col lg:row-span-2">
              <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Skills</CardTitle>
                     <div className="flex items-center gap-1">
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" onClick={() => setOpenAccordionItems(allAttributeKeys)} className="h-7 w-7">
                                    <Rows className="h-4 w-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>Expand All</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" onClick={() => setOpenAccordionItems([])} className="h-7 w-7">
                                    <Columns className="h-4 w-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>Collapse All</TooltipContent>
                        </Tooltip>
                    </div>
                  </div>
              </CardHeader>
              <CardContent className="flex-grow min-h-0">
                  <ScrollArea className="h-full pr-4 -mx-4 px-4">
                      <Accordion type="multiple" value={openAccordionItems} onValueChange={setOpenAccordionItems} className="w-full">
                          {Object.entries(groupedSkills).map(([attribute, skillList]) => (
                              <AccordionItem value={attribute} key={attribute}>
                                  <AccordionTrigger>
                                    <h4 className="font-bold">{attribute} ({skillList.length})</h4>
                                  </AccordionTrigger>
                                  <AccordionContent>
                                      <ul className="list-disc list-inside space-y-1 pl-2">
                                          {skillList.map((skill: any, index: number) => (
                                              <li key={`${skill.name}-${index}`} className="text-sm">
                                                  {skill.name}
                                              </li>
                                          ))}
                                      </ul>
                                  </AccordionContent>
                              </AccordionItem>
                          ))}
                      </Accordion>
                  </ScrollArea>
              </CardContent>
          </Card>
          
          {customRules && customRules.length > 0 && (
            <Card className="lg:col-span-3">
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
    </TooltipProvider>
  );
}
