
'use server';

import {
  saveSystem,
  getSystem as getSystemFromDb,
  listSystems as listSystemsFromDb,
  saveCharacter,
  getCharacter as getCharacterFromDb,
  listCharacters as listCharactersFromDb,
  listSkillsFromLibrary as listSkillsFromLibraryFromDb,
  listFeatsFromLibrary as listFeatsFromLibraryFromDb,
} from '@/lib/data-service';
import type { GameSystem, Feat, Character } from '@/lib/data-service';
import { suggestSkills } from '@/ai/flows/suggest-skills-flow';
import type { SuggestSkillsInput } from '@/ai/flows/suggest-skills-flow';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';

const GameSystemSchemaForImport = z.object({
  systemId: z.string(),
  systemName: z.string(),
  description: z.string(),
  attributes: z.array(z.object({ name: z.string(), description: z.string() })),
  skills: z.array(z.object({ name: z.string(), baseAttribute: z.string() })),
  feats: z.array(z.object({ name: z.string(), description: z.string(), prerequisites: z.string(), effect: z.string().optional() })),
  saves: z.array(z.object({ name: z.string(), baseAttribute: z.string() })),
  schemas: z.object({ formSchema: z.string(), uiSchema: z.string() }).optional(),
  usesD20StyleModifiers: z.boolean().optional(),
});

const CharacterSchemaForImport = z.object({
  characterId: z.string(),
  systemId: z.string(),
  data: z.any(),
});

function generateSchemas(system: Omit<GameSystem, 'schemas'> | GameSystem) {
    const formSchemaProperties: any = {
      name: { type: 'string', default: '' },
      class: { type: 'string', default: '' },
      level: { type: 'number', default: 1 },
      hp: { type: 'number', default: 10 },
      maxHp: { type: 'number', default: 10 },
      attributes: { type: 'object', properties: {} },
      saves: { type: 'object', properties: {} },
      skills: { 
        type: 'array', 
        default: [],
        items: {
          type: 'object',
          properties: { name: { type: 'string' }, value: { type: 'number', default: 0 } }
        }
      },
      feats: { 
        type: 'array', 
        default: [],
        items: {
            type: 'object',
            properties: { 
                name: { type: 'string', default: '' }, 
                effect: { type: 'string', default: '' } 
            }
        }
      },
      backstory: { type: 'string', widget: 'textarea', default: '' },
    };
    
    const uiSchema: any = {
      name: { 'ui:widget': 'text', 'ui:label': 'Character Name' },
      class: { 'ui:widget': 'text', 'ui:label': 'Class' },
      level: { 'ui:widget': 'number', 'ui:label': 'Level' },
      vitals: {
        'ui:fieldset': true,
        'ui:label': 'Vitals',
        fields: {
            hp: { 'ui:widget': 'number', 'ui:label': 'Current HP' },
            maxHp: { 'ui:widget': 'number', 'ui:label': 'Maximum HP' },
        }
      },
      attributes: { 'ui:fieldset': true, 'ui:label': 'Attributes', fields: {} },
      saves: { 'ui:fieldset': true, 'ui:label': 'Saves', fields: {} },
      skills: { 'ui:widget': 'custom', 'ui:label': 'Skills' },
      feats: { 'ui:widget': 'custom', 'ui:label': 'Feats' },
      backstory: { 'ui:widget': 'textarea', 'ui:label': 'Backstory' },
    };

    // Remove individual hp/maxHp from uiSchema as they are now in a fieldset
    delete formSchemaProperties.hp;
    delete formSchemaProperties.maxHp;
    formSchemaProperties.vitals = { 
        type: 'object', 
        properties: {
            hp: { type: 'number', default: 10 },
            maxHp: { type: 'number', default: 10 }
        }
    };
    

    system.attributes.forEach((attr) => {
      formSchemaProperties.attributes.properties[attr.name] = { type: 'number', default: 0 };
      uiSchema.attributes.fields[attr.name] = { 'ui:widget': 'number', 'ui:label': attr.name };
    });
    
    system.saves.forEach((save) => {
      formSchemaProperties.saves.properties[save.name] = { type: 'number', default: 0 };
      uiSchema.saves.fields[save.name] = { 'ui:widget': 'number', 'ui:label': save.name };
    });

    return {
      formSchema: JSON.stringify({ type: 'object', properties: formSchemaProperties, required: ['name', 'class', 'level'] }, null, 2),
      uiSchema: JSON.stringify(uiSchema, null, 2),
    };
}

export async function saveSystemAction(
  systemData: Omit<GameSystem, 'systemId' | 'schemas' | 'description'> | GameSystem,
  isImport: boolean = false
) {
  let fullSystemData: GameSystem;

  if (isImport) {
    const parseResult = GameSystemSchemaForImport.safeParse(systemData);
    if (!parseResult.success) {
      console.error('Invalid system data for import:', parseResult.error);
      return { success: false, error: 'Invalid system file format.' };
    }
    const importedData = parseResult.data;
    if (!importedData.schemas) {
        const generatedSchemas = generateSchemas(importedData);
        fullSystemData = {
            ...importedData,
            schemas: generatedSchemas
        };
    } else {
        fullSystemData = importedData as GameSystem;
    }
  } else {
    const creationData = systemData as Omit<GameSystem, 'systemId' | 'schemas' | 'description'>;
    const systemId = creationData.systemName.toLowerCase().replace(/\s+/g, '-');
    
    // Trim attribute names and update skill/save baseAttributes
    const attributeNameMap: Record<string, string> = {};
    const trimmedAttributes = creationData.attributes.map(attr => {
        const trimmedName = attr.name.trim();
        if (attr.name !== trimmedName) {
            attributeNameMap[attr.name] = trimmedName;
        }
        return { ...attr, name: trimmedName };
    });

    const trimmedSaves = creationData.saves.map(save => ({
        ...save,
        name: save.name.trim(),
        baseAttribute: attributeNameMap[save.baseAttribute] || save.baseAttribute,
    }));

    const trimmedSkills = creationData.skills.map(skill => ({
        ...skill,
        baseAttribute: attributeNameMap[skill.baseAttribute] || skill.baseAttribute,
    }));

    const cleanedData = {
      ...creationData,
      attributes: trimmedAttributes,
      saves: trimmedSaves,
      skills: trimmedSkills,
    };

    const schemas = generateSchemas(cleanedData);

    fullSystemData = {
      ...cleanedData,
      systemId,
      description: `A custom system with ${creationData.attributes.length} attributes.`,
      schemas,
    };
  }

  try {
    await saveSystem(fullSystemData);
    revalidatePath('/gm/dashboard');
    return { success: true, systemId: fullSystemData.systemId };
  } catch (error) {
    console.error('Failed to save system:', error);
    return { success: false, error: 'Failed to save system to database.' };
  }
}

export async function getSystemAction(systemId: string) {
  return await getSystemFromDb(systemId);
}

export async function listSystemsAction() {
  return await listSystemsFromDb();
}

export async function saveCharacterAction(character: Character) {
    // Validate the basic structure of the character object.
    const CharacterSchema = z.object({
        characterId: z.string().min(1),
        systemId: z.string().min(1),
        data: z.object({}).passthrough(),
    });

    const parseResult = CharacterSchema.safeParse(character);
    if (!parseResult.success) {
        console.error('Invalid character data for save:', parseResult.error);
        return { success: false, error: 'Invalid character data format.' };
    }
    
    try {
        await saveCharacter(character);
        revalidatePath('/player/dashboard');
        revalidatePath(`/player/characters/${character.characterId}`);
        return { success: true, characterId: character.characterId };
    } catch (error) {
        console.error('Failed to save character:', error);
        return { success: false, error: 'Failed to save character to database.' };
    }
}


export async function getCharacterAction(characterId: string) {
    return await getCharacterFromDb(characterId);
}

export async function listCharactersAction() {
    return await listCharactersFromDb();
}

export async function suggestSkillsAction(input: SuggestSkillsInput) {
  try {
    const result = await suggestSkills(input);
    return { success: true, skills: result.skills };
  } catch (error) {
    console.error('AI failed to suggest skills:', error);
    return { success: false, error: 'AI failed to suggest skills.' };
  }
}

export async function listSkillsFromLibraryAction() {
    return await listSkillsFromLibraryFromDb();
}

export async function listFeatsFromLibraryAction() {
    return await listFeatsFromLibraryFromDb();
}
