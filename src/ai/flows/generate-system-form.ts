'use server';

/**
 * @fileOverview This file defines a Genkit flow to generate UI form schemas based on game system configurations.
 *
 * generateSystemForm - A function that generates UI form schemas.
 * GenerateSystemFormInput - The input type for the generateSystemForm function.
 * GenerateSystemFormOutput - The return type for the generateSystemForm function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateSystemFormInputSchema = z.object({
  systemConfiguration: z
    .string()
    .describe('The JSON configuration of the game system, including attributes, skills, and feats.'),
});
export type GenerateSystemFormInput = z.infer<typeof GenerateSystemFormInputSchema>;

const GenerateSystemFormOutputSchema = z.object({
  formSchema: z.string().describe('A JSON schema representing the structure of the character sheet form. It should define all fields, their types (string, number, boolean, array), and validation rules based on the game system. For example, attributes should be numbers, skills and feats could be arrays of strings representing selected items.'),
  uiSchema: z.string().describe('A JSON schema that defines the UI layout and appearance for the form. It should map form fields from the formSchema to specific UI widgets (e.g., text input, number input, select dropdown, checkbox group) and include layout instructions like grouping fields into sections or tabs.'),
});
export type GenerateSystemFormOutput = z.infer<typeof GenerateSystemFormOutputSchema>;

export async function generateSystemForm(input: GenerateSystemFormInput): Promise<GenerateSystemFormOutput> {
  return generateSystemFormFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateSystemFormPrompt',
  input: {schema: GenerateSystemFormInputSchema},
  output: {schema: GenerateSystemFormOutputSchema},
  prompt: `You are an expert in creating dynamic form definitions. Based on the following game system configuration (in JSON), you will generate two JSON schemas:

1.  **formSchema**: This schema defines the data structure for a character. It should include basic fields like 'name', 'class', 'level', and then objects or arrays for attributes, skills, and feats based on the provided system. For attributes, create a nested object where each key is an attribute name and its value is a number. For skills and feats, define them as arrays of strings.

2.  **uiSchema**: This schema defines how the form should be rendered. It maps the fields from the \`formSchema\` to UI components. Use a simple structure. For example, for a field like "name", you could specify \`{ "ui:widget": "text" }\`. For attributes, group them in a fieldset. For skills and feats, which are arrays, specify them as \`{ "ui:widget": "checkboxes" }\`.

Game System Configuration:
\`\`\`json
{{{systemConfiguration}}}
\`\`\`

Generate the \`formSchema\` and \`uiSchema\` JSON strings.`,
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
