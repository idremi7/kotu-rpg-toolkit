'use server';

import {
  saveSystem,
  getSystem as getSystemFromFile,
  listSystems as listSystemsFromFile,
  saveCharacter,
  getCharacter as getCharacterFromFile,
  listCharacters as listCharactersFromFile,
} from '@/lib/data-service';
import type { GameSystem } from '@/lib/data-service';
import { randomUUID } from 'crypto';

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
    skills: { type: 'array', items: { type: 'string' } },
    feats: { type: 'array', items: { type: 'string' } },
    saves: { type: 'array', items: { type: 'string' } },
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
    skills: { 'ui:widget': 'checkboxes', 'ui:label': 'Skills' },
    feats: { 'ui:widget': 'checkboxes', 'ui:label': 'Feats' },
    saves: { 'ui:widget': 'checkboxes', 'ui:label': 'Saves' },
    backstory: { 'ui:widget': 'textarea', 'ui:label': 'Backstory' },
  };

  systemData.attributes.forEach((attr) => {
    formSchemaProperties.attributes.properties[attr.name] = {
      type: 'number',
      default: 10,
    };
    uiSchema.attributes.fields[attr.name] = {
      'ui:widget': 'number',
      'ui:label': attr.name,
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
    return { success: false, error: 'Failed to save system to file.' };
  }
}

export async function getSystemAction(systemId: string) {
  return await getSystemFromFile(systemId);
}

export async function listSystemsAction() {
  return await listSystemsFromFile();
}

export async function saveCharacterAction(systemId: string, characterData: any) {
  const characterId = characterData.characterId || `${systemId}-${randomUUID()}`;
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
    return { success: false, error: 'Failed to save character to file.' };
  }
}

export async function getCharacterAction(characterId: string) {
    return await getCharacterFromFile(characterId);
}

export async function listCharactersAction() {
    return await listCharactersFromFile();
}
