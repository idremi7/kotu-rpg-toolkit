import { z } from 'zod';
import type { DataProvider, GameSystem, GameSystemSummary, Character, SkillFromLibrary, FeatFromLibrary } from './data-provider';

// ===== LocalStorage Keys =====
const SYSTEMS_KEY = 'versa_systems';
const CHARACTERS_KEY = 'versa_characters';
const SKILL_LIBRARY_KEY = 'versa_skill_library';
const FEAT_LIBRARY_KEY = 'versa_feat_library';


// ===== LocalStorage Helper Functions =====
function getItem<T>(key: string): T | null {
    if (typeof window === 'undefined') return null;
    try {
        const item = window.localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
    } catch (error) {
        console.error(`Error reading from localStorage key “${key}”:`, error);
        return null;
    }
}

function setItem<T>(key: string, value: T): void {
    if (typeof window === 'undefined') return;
    try {
        window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        console.error(`Error writing to localStorage key “${key}”:`, error);
    }
}


// ===== Schema Generation =====
const GameSystemSchemaForImport = z.object({
  systemId: z.string(),
  systemName: z.string(),
  description: z.string(),
  attributes: z.array(z.object({ name: z.string(), description: z.string() })),
  skills: z.array(z.object({ name: z.string(), baseAttribute: z.string() })),
  feats: z.array(z.object({ name: z.string(), description: z.string(), prerequisites: z.string(), effect: z.string().optional() })),
  saves: z.array(z.object({ name: z.string(), baseAttribute: z.string() })),
  customRules: z.array(z.object({ title: z.string(), description: z.string() })).optional(),
  schemas: z.object({ formSchema: z.string(), uiSchema: z.string() }).optional(),
  usesD20StyleModifiers: z.boolean().optional(),
});

function generateSchemas(system: Omit<GameSystem, 'schemas'> | GameSystem) {
    const formSchemaProperties: any = {
      name: { type: 'string', default: '' },
      class: { type: 'string', default: '' },
      level: { type: 'number', default: 1 },
      vitals: { type: 'object', properties: { hp: { type: 'number', default: 10 }, maxHp: { type: 'number', default: 10 } }},
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
      vitals: { 'ui:fieldset': true, 'ui:label': 'Vitals', fields: { hp: { 'ui:widget': 'number', 'ui:label': 'Current HP'}, maxHp: {'ui:widget': 'number', 'ui:label': 'Maximum HP'} }},
      attributes: { 'ui:fieldset': true, 'ui:label': 'Attributes', fields: {} },
      saves: { 'ui:fieldset': true, 'ui:label': 'Saves', fields: {} },
      skills: { 'ui:widget': 'custom', 'ui:label': 'Skills' },
      feats: { 'ui:widget': 'custom', 'ui:label': 'Feats' },
      backstory: { 'ui:widget': 'textarea', 'ui:label': 'Backstory' },
    };

    system.attributes.forEach((attr) => {
      formSchemaProperties.attributes.properties[attr.name] = { type: 'number', default: 10 };
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


export class LocalStorageProvider implements DataProvider {

    constructor() {
      // In a real app, this might be where you check for a login token, etc.
      // For now, we'll ensure our static libraries are loaded.
      if (typeof window !== 'undefined') {
          this.initializeAllLibraries();
      }
    }

    private async initializeLibrary(key: string, jsonPath: string) {
        if (getItem(key)) return; // Already initialized

        try {
            const response = await fetch(jsonPath);
            if (!response.ok) {
              throw new Error(`Failed to fetch ${jsonPath}: ${response.statusText}`);
            }
            const data = await response.json();
            setItem(key, data);
        } catch (error) {
            console.error(`Failed to fetch and initialize library from ${jsonPath}:`, error);
            // Set an empty array to prevent repeated fetch attempts
            setItem(key, []);
        }
    }

    private async initializeAllLibraries() {
        await Promise.all([
            this.initializeLibrary(SKILL_LIBRARY_KEY, '/data/skill-library.json'),
            this.initializeLibrary(FEAT_LIBRARY_KEY, '/data/feat-library.json'),
        ]);
    }
    
    async saveSystem(systemData: Omit<GameSystem, 'systemId' | 'schemas' | 'description'> | GameSystem): Promise<{ success: boolean; systemId?: string | undefined; error?: string | undefined; }> {
        const systems = getItem<Record<string, GameSystem>>(SYSTEMS_KEY) || {};
    
        const creationData = systemData as Omit<GameSystem, 'systemId' | 'schemas' | 'description'>;
        const systemId = (systemData as GameSystem).systemId || creationData.systemName.toLowerCase().replace(/\s+/g, '-');
        
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

        const fullSystemData: GameSystem = {
          ...cleanedData,
          systemId,
          description: `A custom system with ${creationData.attributes.length} attributes.`,
          schemas,
        };
        
        systems[systemId] = fullSystemData;
        setItem(SYSTEMS_KEY, systems);
        
        return { success: true, systemId };
    }
    
    async importSystem(systemData: any): Promise<{ success: boolean; error?: string | undefined; }> {
        const parseResult = GameSystemSchemaForImport.safeParse(systemData);
        if (!parseResult.success) {
          console.error('Invalid system data for import:', parseResult.error);
          return { success: false, error: 'Invalid system file format.' };
        }
        
        let fullSystemData: GameSystem;
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

        const systems = getItem<Record<string, GameSystem>>(SYSTEMS_KEY) || {};
        systems[fullSystemData.systemId] = fullSystemData;
        setItem(SYSTEMS_KEY, systems);

        return { success: true };
    }
    
    async getSystem(systemId: string): Promise<GameSystem | null> {
        const systems = getItem<Record<string, GameSystem>>(SYSTEMS_KEY) || {};
        return systems[systemId] || null;
    }
    
    async listSystems(): Promise<GameSystemSummary[]> {
        const systems = getItem<Record<string, GameSystem>>(SYSTEMS_KEY) || {};
        return Object.values(systems).map(system => ({
            id: system.systemId,
            name: system.systemName,
            description: system.description,
        }));
    }

    async deleteSystem(systemId: string): Promise<{ success: boolean; error?: string }> {
        const systems = getItem<Record<string, GameSystem>>(SYSTEMS_KEY) || {};
        if (systems[systemId]) {
            delete systems[systemId];
            setItem(SYSTEMS_KEY, systems);
            return { success: true };
        }
        return { success: false, error: "System not found." };
    }
    
    async saveCharacter(characterData: Character): Promise<{ success: boolean; characterId?: string | undefined; error?: string | undefined; }> {
        const characters = getItem<Record<string, Character>>(CHARACTERS_KEY) || {};
        characters[characterData.characterId] = characterData;
        setItem(CHARACTERS_KEY, characters);
        return { success: true, characterId: characterData.characterId };
    }
    
    async getCharacter(characterId: string): Promise<Character | null> {
        const characters = getItem<Record<string, Character>>(CHARACTERS_KEY) || {};
        return characters[characterId] || null;
    }
    
    async listCharacters(): Promise<Character[]> {
        const characters = getItem<Record<string, Character>>(CHARACTERS_KEY) || {};
        return Object.values(characters);
    }
    
    async listSkillsFromLibrary(): Promise<SkillFromLibrary[]> {
        await this.initializeAllLibraries();
        return getItem<SkillFromLibrary[]>(SKILL_LIBRARY_KEY) || [];
    }
    
    async listFeatsFromLibrary(): Promise<FeatFromLibrary[]> {
        await this.initializeAllLibraries();
        return getItem<FeatFromLibrary[]>(FEAT_LIBRARY_KEY) || [];
    }
}
