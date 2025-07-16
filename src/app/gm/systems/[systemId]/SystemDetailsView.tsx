
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
import { Pencil, Loader2, Trash2 } from 'lucide-react';
import { ExportSystemButton } from '@/components/ExportSystemButton';
import { Separator } from '@/components/ui/separator';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export function SystemDetailsView({ systemId }: { systemId: string }) {
  const [system, setSystem] = useState<GameSystem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
      getSystem(systemId).then(data => {
          if (data) {
              setSystem(data);
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          <Card className="lg:col-span-2">
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
              <CardHeader>
                  <CardTitle>Skills</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow min-h-0">
                  <ScrollArea className="h-full pr-4">
                      <div className="space-y-4">
                          {Object.entries(groupedSkills).map(([attribute, skillList]) => (
                              <div key={attribute}>
                                  <h4 className="font-bold mb-1">{attribute}</h4>
                                  <ul className="list-disc list-inside space-y-1 pl-2">
                                      {skillList.map((skill: any, index: number) => (
                                          <li key={`${skill.name}-${index}`} className="text-sm">
                                              {skill.name}
                                          </li>
                                      ))}
                                  </ul>
                              </div>
                          ))}
                      </div>
                  </ScrollArea>
              </CardContent>
          </Card>

          <Card>
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
    </TooltipProvider>
  );
}
