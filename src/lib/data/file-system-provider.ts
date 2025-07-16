
/**
 * @fileOverview DataProvider implementation that reads and writes to the local file system.
 * This is suitable for a development environment or a self-hosted scenario.
 * All operations are designed to be server-side.
 */

import path from 'path';
import fs from 'fs/promises';
import { z } from 'zod';
import type { DataProvider, GameSystem, GameSystemSummary, Character, SkillFromLibrary, FeatFromLibrary } from './data-provider';

// Define paths to the data directories
const SYSTEMS_DIR = path.resolve(process.cwd(), 'data', 'systems');
const CHARACTERS_DIR = path.resolve(process.cwd(), 'data', 'characters');
const LIBRARIES_DIR = path.resolve(process.cwd(), 'src', 'data');


// ===== Schema Generation Logic (same as before, but used server-side) =====
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


// ===== FileSystemProvider Implementation =====

export class FileSystemProvider implements DataProvider {

    private async _readFile<T>(filePath: string): Promise<T | null> {
        try {
            const data = await fs.readFile(filePath, 'utf-8');
            return JSON.parse(data) as T;
        } catch (error: any) {
            if (error.code === 'ENOENT') {
                return null; // File not found is a valid case
            }
            console.error(`Error reading or parsing file ${filePath}:`, error);
            throw error; // Rethrow other errors
        }
    }

    private async _writeFile(filePath: string, data: any): Promise<void> {
        try {
            await fs.mkdir(path.dirname(filePath), { recursive: true });
            await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
        } catch (error) {
            console.error(`Error writing file ${filePath}:`, error);
            throw error;
        }
    }
    
    async saveSystem(systemData: Omit<GameSystem, 'systemId' | 'schemas' | 'description'> | GameSystem): Promise<{ success: boolean; systemId?: string | undefined; error?: string | undefined; }> {
        try {
            const systemId = 'systemId' in systemData ? systemData.systemId : systemData.systemName.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
            const filePath = path.join(SYSTEMS_DIR, `${systemId}.json`);

            const schemas = generateSchemas(systemData);
            const fullSystemData: GameSystem = {
                ...systemData,
                systemId,
                description: systemData.description || `A custom system with ${systemData.attributes.length} attributes.`,
                schemas,
            };
            
            await this._writeFile(filePath, fullSystemData);
            return { success: true, systemId };
        } catch (e: any) {
            return { success: false, error: e.message };
        }
    }
    
    async importSystem(systemData: any): Promise<{ success: boolean; error?: string | undefined; }> {
         const parseResult = GameSystemSchemaForImport.safeParse(systemData);
        if (!parseResult.success) {
          console.error('Invalid system data for import:', parseResult.error);
          return { success: false, error: 'Invalid system file format.' };
        }
        
        const importedData = parseResult.data;
        const filePath = path.join(SYSTEMS_DIR, `${importedData.systemId}.json`);
        
        // Regenerate schemas if they are missing
        if (!importedData.schemas) {
            importedData.schemas = generateSchemas(importedData);
        }

        await this._writeFile(filePath, importedData);
        return { success: true };
    }
    
    async getSystem(systemId: string): Promise<GameSystem | null> {
        const filePath = path.join(SYSTEMS_DIR, `${systemId}.json`);
        return this._readFile<GameSystem>(filePath);
    }
    
    async listSystems(): Promise<GameSystemSummary[]> {
        const files = await fs.readdir(SYSTEMS_DIR);
        const summaries: GameSystemSummary[] = [];
        for (const file of files) {
            if (file.endsWith('.json')) {
                const filePath = path.join(SYSTEMS_DIR, file);
                const system = await this._readFile<GameSystem>(filePath);
                if (system) {
                    summaries.push({
                        id: system.systemId,
                        name: system.systemName,
                        description: system.description,
                    });
                }
            }
        }
        return summaries;
    }

    async deleteSystem(systemId: string): Promise<{ success: boolean; error?: string }> {
        try {
            const filePath = path.join(SYSTEMS_DIR, `${systemId}.json`);
            await fs.unlink(filePath);

            // Also delete characters associated with this system
            const characters = await this.listCharacters();
            for (const char of characters) {
                if (char.systemId === systemId) {
                    await this.deleteCharacter(char.characterId);
                }
            }
            return { success: true };
        } catch (error: any) {
            if (error.code === 'ENOENT') {
                 return { success: false, error: "System not found." };
            }
            console.error(`Error deleting system ${systemId}:`, error);
            return { success: false, error: "Failed to delete system." };
        }
    }
    
    async saveCharacter(characterData: Character): Promise<{ success: boolean; characterId?: string | undefined; error?: string | undefined; }> {
        try {
            const filePath = path.join(CHARACTERS_DIR, `${characterData.characterId}.json`);
            await this._writeFile(filePath, characterData);
            return { success: true, characterId: characterData.characterId };
        } catch (e: any) {
            return { success: false, error: e.message };
        }
    }
    
    async getCharacter(characterId: string): Promise<Character | null> {
        const filePath = path.join(CHARACTERS_DIR, `${characterId}.json`);
        return this._readFile<Character>(filePath);
    }
    
    async listCharacters(): Promise<Character[]> {
        try {
            const files = await fs.readdir(CHARACTERS_DIR);
            const characters: Character[] = [];
            for (const file of files) {
                if (file.endsWith('.json')) {
                    const filePath = path.join(CHARACTERS_DIR, file);
                    const character = await this._readFile<Character>(filePath);
                    if (character) {
                        characters.push(character);
                    }
                }
            }
            return characters;
        } catch (error: any) {
            if (error.code === 'ENOENT') {
                return []; // Directory doesn't exist, so no characters
            }
            throw error;
        }
    }

    async deleteCharacter(characterId: string): Promise<{ success: boolean, error?: string }> {
        try {
            const filePath = path.join(CHARACTERS_DIR, `${characterId}.json`);
            await fs.unlink(filePath);
            return { success: true };
        } catch (error: any) {
            if (error.code === 'ENOENT') {
                 return { success: false, error: "Character not found." };
            }
            console.error(`Error deleting character ${characterId}:`, error);
            return { success: false, error: "Failed to delete character." };
        }
    }
    
    async listSkillsFromLibrary(): Promise<SkillFromLibrary[]> {
        const filePath = path.join(LIBRARIES_DIR, 'skill-library.json');
        return (await this._readFile<SkillFromLibrary[]>(filePath)) || [];
    }
    
    async listFeatsFromLibrary(): Promise<FeatFromLibrary[]> {
        const filePath = path.join(LIBRARIES_DIR, 'feat-library.json');
        return (await this._readFile<FeatFromLibrary[]>(filePath)) || [];
    }
}
