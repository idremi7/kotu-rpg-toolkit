'use client';

import { useEffect, useState } from 'react';
import { getSystem } from '@/lib/data-service';
import type { GameSystem } from '@/lib/data-service';
import { notFound } from 'next/navigation';
import { SystemCreator } from '@/components/gm/SystemCreator';
import { BackButton } from '@/components/BackButton';
import { Loader2 } from 'lucide-react';
import { useMounted } from '@/hooks/use-mounted';

export default function EditSystemPage({ params: { systemId } }: { params: { systemId: string } }) {
  const [system, setSystem] = useState<GameSystem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const mounted = useMounted();

  useEffect(() => {
    if (mounted) {
      getSystem(systemId).then(data => {
        if (!data) {
          notFound();
        } else {
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
    return notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="relative text-center mb-8">
        <div className="absolute left-0 top-1/2 -translate-y-1/2">
            <BackButton />
        </div>
        <h1 className="font-headline text-4xl font-bold">Edit System</h1>
        <p className="text-muted-foreground">
          Modify the rules of the "{system.systemName}" system.
        </p>
      </div>
      <SystemCreator initialData={system} />
    </div>
  );
}
