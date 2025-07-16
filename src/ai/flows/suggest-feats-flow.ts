'use server';
/**
 * @fileOverview An AI agent that suggests feats for a role-playing game system.
 *
 * - suggestFeats - A function that handles feat suggestion.
 * - SuggestFeatsInput - The input type for the suggestFeats function.
 * - SuggestFeatsOutput - The return type for the suggestFeats function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const AttributeSchema = z.object({
  name: z.string(),
  description: z.string(),
});

const SuggestFeatsInputSchema = z.object({
  systemName: z.string().describe("The name of the TTRPG system to suggest feats for."),
  attributes: z.array(AttributeSchema).describe("The list of attributes in the game system."),
  existingFeats: z.array(z.string()).optional().describe("A list of already existing feats not to be suggested again."),
  count: z.number().optional().default(10).describe("The number of feats to suggest."),
});
export type SuggestFeatsInput = z.infer<typeof SuggestFeatsInputSchema>;

const FeatSuggestionSchema = z.object({
    name: z.string().describe("The name of the suggested feat."),
    description: z.string().describe("A brief description of what the feat does."),
    prerequisites: z.string().describe("The requirements to take this feat (e.g., 'Strength 13' or 'Level 5'). Can be 'None'."),
    effect: z.string().optional().describe("The mechanical effect of the feat (e.g., '+2 to damage' or '+1 AC')."),
});

const SuggestFeatsOutputSchema = z.object({
  feats: z.array(FeatSuggestionSchema),
});
export type SuggestFeatsOutput = z.infer<typeof SuggestFeatsOutputSchema>;


export async function suggestFeats(input: SuggestFeatsInput): Promise<SuggestFeatsOutput> {
  return suggestFeatsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestFeatsPrompt',
  input: { schema: SuggestFeatsInputSchema },
  output: { schema: SuggestFeatsOutputSchema },
  prompt: `You are an expert RPG game designer with decades of experience creating tabletop role-playing game (TTRPG) systems.
Your task is to suggest a list of {{count}} feats for a new TTRPG system called "{{systemName}}".

These are the core attributes for this system:
{{#each attributes}}
- {{name}}: {{description}}
{{/each}}

{{#if existingFeats}}
These are feats that already exist. Please do not suggest duplicates or very similar variations.
{{#each existingFeats}}
- {{this}}
{{/each}}
{{/if}}

Please suggest a list of {{count}} new feats that would be appropriate for a system with these attributes. Draw inspiration from popular systems like Dungeons & Dragons, Pathfinder, or World of Darkness. Feats should represent special talents or abilities a character can acquire.

For each feat, define its name, a short description, any prerequisites (which can be based on attributes or character level), and its mechanical effect. The prerequisites should be plausible for the given attributes.
`,
});

const suggestFeatsFlow = ai.defineFlow(
  {
    name: 'suggestFeatsFlow',
    inputSchema: SuggestFeatsInputSchema,
    outputSchema: SuggestFeatsOutputSchema,
    config: {
      timeout: 30000, // 30 seconds
    }
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
