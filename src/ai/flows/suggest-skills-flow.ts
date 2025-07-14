'use server';
/**
 * @fileOverview An AI agent that suggests skills for a role-playing game system.
 *
 * - suggestSkills - A function that handles skill suggestion.
 * - SuggestSkillsInput - The input type for the suggestSkills function.
 * - SuggestSkillsOutput - The return type for the suggestSkills function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const AttributeSchema = z.object({
  name: z.string(),
  description: z.string(),
});

const SuggestSkillsInputSchema = z.object({
  systemName: z.string().describe("The name of the TTRPG system to suggest skills for."),
  attributes: z.array(AttributeSchema).describe("The list of attributes in the game system."),
  existingSkills: z.array(z.string()).optional().describe("A list of already existing skills not to be suggested again."),
  count: z.number().optional().default(10).describe("The number of skills to suggest."),
});
export type SuggestSkillsInput = z.infer<typeof SuggestSkillsInputSchema>;

const SkillSuggestionSchema = z.object({
    name: z.string().describe("The name of the suggested skill."),
    baseAttribute: z.string().describe("The base attribute for this skill, must be one of the provided attribute names."),
});

const SuggestSkillsOutputSchema = z.object({
  skills: z.array(SkillSuggestionSchema),
});
export type SuggestSkillsOutput = z.infer<typeof SuggestSkillsOutputSchema>;


export async function suggestSkills(input: SuggestSkillsInput): Promise<SuggestSkillsOutput> {
  return suggestSkillsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestSkillsPrompt',
  input: { schema: SuggestSkillsInputSchema },
  output: { schema: SuggestSkillsOutputSchema },
  prompt: `You are an expert RPG game designer with decades of experience creating tabletop role-playing game (TTRPG) systems.
Your task is to suggest a list of {{count}} skills for a new TTRPG system called "{{systemName}}".

These are the core attributes for this system:
{{#each attributes}}
- {{name}}: {{description}}
{{/each}}

{{#if existingSkills}}
These are skills that already exist. Please do not suggest duplicates or very similar variations.
{{#each existingSkills}}
- {{this}}
{{/each}}
{{/if}}

Please suggest a list of {{count}} new skills that would be appropriate for a system with these attributes. Draw inspiration from popular systems like Dungeons & Dragons, Pathfinder, or World of Darkness, but ensure the skills are logical within the context of the provided attributes.

For each skill you suggest, you must specify its "baseAttribute". This base attribute MUST be an EXACT match to one of the attribute names provided in the list above. Do not create new attributes.
`,
});

const suggestSkillsFlow = ai.defineFlow(
  {
    name: 'suggestSkillsFlow',
    inputSchema: SuggestSkillsInputSchema,
    outputSchema: SuggestSkillsOutputSchema,
    config: {
      timeout: 30000, // 30 seconds
    }
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
