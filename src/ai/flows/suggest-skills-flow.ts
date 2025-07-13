'use server';
/**
 * @fileOverview Un agent IA qui suggère des compétences pour un système de jeu de rôle.
 *
 * - suggestSkills - Une fonction qui gère la suggestion de compétences.
 * - SuggestSkillsInput - Le type d'entrée pour la fonction suggestSkills.
 * - SuggestSkillsOutput - Le type de retour pour la fonction suggestSkills.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const AttributeSchema = z.object({
  name: z.string(),
  description: z.string(),
});

const SuggestSkillsInputSchema = z.object({
  systemName: z.string().describe("Le nom du système de JDR pour lequel suggérer des compétences."),
  attributes: z.array(AttributeSchema).describe("La liste des attributs du système de jeu."),
});
export type SuggestSkillsInput = z.infer<typeof SuggestSkillsInputSchema>;

const SkillSuggestionSchema = z.object({
    name: z.string().describe("Le nom de la compétence suggérée."),
    baseAttribute: z.string().describe("L'attribut de base pour cette compétence, doit être l'un des noms d'attributs fournis."),
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
  prompt: `Vous êtes un concepteur de jeux de rôle expert avec des décennies d'expérience dans la création de systèmes de jeu de table (JDR).
Votre tâche est de suggérer une liste de 10 compétences de base pour un nouveau système de JDR appelé "{{systemName}}".

Voici les attributs de base pour ce système :
{{#each attributes}}
- {{name}}: {{description}}
{{/each}}

Veuillez suggérer une liste de 10 compétences qui seraient appropriées pour un système avec ces attributs. Inspirez-vous de systèmes populaires comme Dungeons & Dragons, Pathfinder, ou World of Darkness, mais assurez-vous que les compétences sont logiques dans le contexte des attributs fournis.

Pour chaque compétence que vous suggérez, vous devez spécifier son "baseAttribute". Cet attribut de base DOIT correspondre EXACTEMENT à l'un des noms d'attributs fournis dans la liste ci-dessus. Ne créez pas de nouveaux attributs.
`,
});

const suggestSkillsFlow = ai.defineFlow(
  {
    name: 'suggestSkillsFlow',
    inputSchema: SuggestSkillsInputSchema,
    outputSchema: SuggestSkillsOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
