
'use client';

import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, Swords, Loader2 } from "lucide-react";
import Link from "next/link";
import { listSystems } from "@/lib/data-service";
import type { GameSystemSummary } from '@/lib/data-service';
import { ImportSystemButton } from "@/components/ImportSystemButton";
import { ExpandableText } from '@/components/ExpandableText';

export default function GMDashboard() {
  const [systems, setSystems] = useState<GameSystemSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadSystems = async () => {
    setIsLoading(true);
    const systemList = await listSystems();
    setSystems(systemList);
    setIsLoading(false);
  };
  
  useEffect(() => {
    loadSystems();
  }, []);

  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
        <div>
          <h1 className="font-headline text-4xl font-bold">GM Dashboard</h1>
          <p className="text-muted-foreground mt-1">Manage your game systems and campaigns.</p>
        </div>
        {systems.length > 0 && (
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <ImportSystemButton onImport={loadSystems} className="w-full sm:w-auto" />
              <Button asChild size="lg" className="w-full sm:w-auto">
              <Link href="/gm/systems/create">
                  <PlusCircle className="mr-2 h-5 w-5" />
                  Create New System
              </Link>
              </Button>
          </div>
        )}
      </div>
      
      {systems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {systems.map(system => (
            <Card key={system.id} className="flex flex-col">
              <CardHeader>
                <CardTitle className="font-headline flex items-center gap-2">
                  <Swords className="text-primary"/>
                  {system.name}
                </CardTitle>
                <CardDescription as="div">
                  <ExpandableText text={system.description} maxLength={120} />
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
              </CardContent>
              <div className="p-4 pt-0">
                 <Button asChild variant="secondary" className="w-full">
                    <Link href={`/gm/systems/${system.id}`}>Manage System</Link>
                  </Button>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 border-2 border-dashed rounded-lg mt-12">
          <h2 className="text-2xl font-semibold mb-2">No Systems Found</h2>
          <p className="text-muted-foreground mb-4">It looks like you haven't created any game systems yet.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 px-4">
            <ImportSystemButton onImport={loadSystems} className="w-full" />
            <Button asChild size="lg" className="w-full">
                <Link href="/gm/systems/create">
                <PlusCircle className="mr-2 h-5 w-5" />
                Create Your First System
                </Link>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
