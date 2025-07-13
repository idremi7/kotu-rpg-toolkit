'use server';

import { generateSystemForm } from '@/ai/flows/generate-system-form';

export async function generateFormAction(systemConfig: any) {
  try {
    const result = await generateSystemForm({
      systemConfiguration: JSON.stringify(systemConfig, null, 2),
    });
    // We only need the schemas now, not the formCode.
    return { success: true, data: { formSchema: result.formSchema, uiSchema: result.uiSchema } };
  } catch (error) {
    console.error(error);
    return { success: false, error: 'Failed to generate form schemas.' };
  }
}
