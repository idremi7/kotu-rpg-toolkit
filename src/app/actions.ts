'use server';

import { generateSystemForm } from '@/ai/flows/generate-system-form';

export async function generateFormAction(systemConfig: any) {
  try {
    const result = await generateSystemForm({
      systemConfiguration: JSON.stringify(systemConfig, null, 2),
    });
    return { success: true, data: result };
  } catch (error) {
    console.error(error);
    return { success: false, error: 'Failed to generate form.' };
  }
}
