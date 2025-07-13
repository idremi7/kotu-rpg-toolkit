'use server';

import { saveSystem as saveSystemToFile, getSystem as getSystemFromFile, listSystems as listSystemsFromFile } from '@/lib/data-service';
import type { GameSystem } from '@/lib/data-service';

export async function saveSystemAction(systemData: Omit<GameSystem, 'systemId' | 'schemas'>, schemas: { formSchema: string, uiSchema: string }) {
  const systemId = systemData.systemName.toLowerCase().replace(/\s+/g, '-');
  const fullSystemData: GameSystem = {
    ...systemData,
    systemId,
    schemas,
  };

  try {
    await saveSystemToFile(fullSystemData);
    return { success: true, systemId };
  } catch (error) {
    console.error('Failed to save system:', error);
    return { success: false, error: 'Failed to save system to file.' };
  }
}

export async function getSystemAction(systemId: string) {
    return await getSystemFromFile(systemId);
}

export async function listSystemsAction() {
    return await listSystemsFromFile();
}
