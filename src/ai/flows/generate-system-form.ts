'use server';

/**
 * @fileOverview This file defines a Genkit flow to generate UI forms based on game system configurations.
 *
 * generateSystemForm - A function that generates UI forms.
 * GenerateSystemFormInput - The input type for the generateSystemForm function.
 * GenerateSystemFormOutput - The return type for the generateSystemForm function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateSystemFormInputSchema = z.object({
  systemConfiguration: z
    .string()
    .describe('The JSON configuration of the game system, including attributes, saves, skills, and feats.'),
});
export type GenerateSystemFormInput = z.infer<typeof GenerateSystemFormInputSchema>;

const GenerateSystemFormOutputSchema = z.object({
  formSchema: z.string().describe('The generated JSON schema for the UI form.'),
  uiSchema: z.string().describe('The generated JSON schema for the UI form.'),
  formCode: z.string().describe('The generated React code for the UI form.'),
});
export type GenerateSystemFormOutput = z.infer<typeof GenerateSystemFormOutputSchema>;

export async function generateSystemForm(input: GenerateSystemFormInput): Promise<GenerateSystemFormOutput> {
  return generateSystemFormFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateSystemFormPrompt',
  input: {schema: GenerateSystemFormInputSchema},
  output: {schema: GenerateSystemFormOutputSchema},
  prompt: `You are a UI form generator expert. Given a game system configuration in JSON format, you will generate a JSON schema for the UI form and the React code for the UI form.

Game System Configuration:
{{systemConfiguration}}

Generate a JSON schema.
Generate a UI schema.
Generate React code.`, 
});

const generateSystemFormFlow = ai.defineFlow(
  {
    name: 'generateSystemFormFlow',
    inputSchema: GenerateSystemFormInputSchema,
    outputSchema: GenerateSystemFormOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
