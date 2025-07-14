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
import type { GameSystem, Feat } from '@/lib/data-service';
import { suggestSkills } from '@/ai/flows/suggest-skills-flow';
import type { SuggestSkillsInput } from '@/ai/flows/suggest-skills-flow';

let characterIdCounter = Date.now();

export async function saveSystemAction(
  systemData: Omit<GameSystem, 'systemId' | 'schemas' | 'description'>
) {
  const systemId = systemData.systemName.toLowerCase().replace(/\s+/g, '-');

  const formSchemaProperties: any = {
    name: { type: 'string', default: '' },
    class: { type: 'string', default: '' },
    level: { type: 'number', default: 1 },
    attributes: {
      type: 'object',
      properties: {},
    },
    saves: { 
        type: 'object',
        properties: {},
    },
    skills: { 
      type: 'array', 
      default: [],
      items: {
        type: 'object',
        properties: {
            name: { type: 'string' },
            value: { type: 'number', default: 0 }
        }
      }
    },
    feats: { type: 'array', items: { type: 'string' }, default: [] },
    backstory: { type: 'string', widget: 'textarea', default: '' },
  };

  const uiSchema: any = {
    name: { 'ui:widget': 'text', 'ui:label': 'Character Name' },
    class: { 'ui:widget': 'text', 'ui:label': 'Class' },
    level: { 'ui:widget': 'number', 'ui:label': 'Level' },
    attributes: {
      'ui:fieldset': true,
      'ui:label': 'Attributes',
      fields: {},
    },
    saves: { 
      'ui:fieldset': true,
      'ui:label': 'Saves',
      fields: {},
    },
    skills: { 'ui:widget': 'custom', 'ui:label': 'Skills' },
    feats: { 'ui:widget': 'checkboxes', 'ui:label': 'Feats' },
    backstory: { 'ui:widget': 'textarea', 'ui:label': 'Backstory' },
  };

  systemData.attributes.forEach((attr) => {
    formSchemaProperties.attributes.properties[attr.name] = {
      type: 'number',
      default: 0,
    };
    uiSchema.attributes.fields[attr.name] = {
      'ui:widget': 'number',
      'ui:label': attr.name,
    };
  });
  
  systemData.saves.forEach((save) => {
    formSchemaProperties.saves.properties[save.name] = {
        type: 'number',
        default: 0,
    };
    uiSchema.saves.fields[save.name] = {
        'ui:widget': 'number',
        'ui:label': save.name,
    };
  });

  const schemas = {
    formSchema: JSON.stringify(
      {
        type: 'object',
        properties: formSchemaProperties,
        required: ['name', 'class', 'level'],
      },
      null,
      2
    ),
    uiSchema: JSON.stringify(uiSchema, null, 2),
  };

  const fullSystemData: GameSystem = {
    ...systemData,
    systemId,
    description: `A custom system with ${systemData.attributes.length} attributes.`,
    schemas,
  };

  try {
    await saveSystem(fullSystemData);
    return { success: true, systemId };
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

export async function saveCharacterAction(systemId: string, characterData: any) {
  const characterId = `char_${characterIdCounter++}`;

  const character = {
    characterId,
    systemId,
    data: characterData,
  };

  try {
    await saveCharacter(character);
    return { success: true, characterId };
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
