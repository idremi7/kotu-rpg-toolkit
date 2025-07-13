'use server';

import { generateSystemForm } from '@/ai/flows/generate-system-form';
import { saveSystem as saveSystemToFile, getSystem as getSystemFromFile, listSystems as listSystemsFromFile } from '@/lib/data-service';
import type { GameSystem } from '@/lib/data-service';

export async function generateFormAction(systemConfig: any) {
  try {
    const result = await generateSystemForm({
      systemConfiguration: JSON.stringify(systemConfig, null, 2),
    });
    return { success: true, data: { formSchema: result.formSchema, uiSchema: result.uiSchema } };
  } catch (error) {
    console.error(error);
    return { success: false, error: 'Failed to generate form schemas.' };
  }
}

export async function saveSystemAction(systemData: Omit<GameSystem, 'systemId'>, schemas: { formSchema: string, uiSchema: string }) {
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
