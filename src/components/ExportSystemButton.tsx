'use client';

import { Button } from './ui/button';
import { Download } from 'lucide-react';
import type { GameSystem } from '@/lib/data-service';

interface ExportSystemButtonProps {
  system: GameSystem;
}

export function ExportSystemButton({ system }: ExportSystemButtonProps) {
  const handleExport = () => {
    if (!system) return;

    const systemDataString = JSON.stringify(system, null, 2);
    const blob = new Blob([systemDataString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${system.systemId}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Button onClick={handleExport} variant="outline">
        <Download className="mr-2 h-4 w-4" />
        Export System
    </Button>
  );
}
