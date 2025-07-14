
// This file should only be used on the server.
import 'server-only';
import path from 'path';
import fs from 'fs/promises';

// Define the structure for a "feat" (don)
export interface Feat {
    name: string;
    description: string;
    prerequisites: string;
    effect?: string; // Flexible effect as a string
    value?: number; // Legacy numeric value, for migration
}

export interface GameSystem {
    systemId: string;
    systemName: string;
    description: string;
    attributes: { name: string; description: string }[];
    skills: { name: string; baseAttribute: string }[];
    feats: Feat[];
    saves: { name: string; baseAttribute: string }[];
    schemas: { formSchema: string; uiSchema: string };
    usesD20StyleModifiers?: boolean;
}

export interface SkillFromLibrary {
    name: string;
    category: string;
    description: string;
    lang: 'en' | 'fr';
}

export interface FeatFromLibrary {
    name: string;
    description: string;
    prerequisites: string;
    category: string; // e.g., 'Combat', 'General', 'Magic'
    effect?: string;
    lang: 'en' | 'fr';
}


const dataDir = path.join(process.cwd(), 'data');
const systemsDir = path.join(dataDir, 'systems');
const charactersDir = path.join(dataDir, 'characters');

async function initializeDataDirs() {
    try {
        await fs.mkdir(systemsDir, { recursive: true });
        await fs.mkdir(charactersDir, { recursive: true });
    } catch (error) {
        console.error("Failed to initialize data directories:", error);
    }
}

const dataReady = initializeDataDirs();


// =========== Systems API ===========

function migrateSystem(system: GameSystem): GameSystem {
    let wasMigrated = false;
    const newSystem = JSON.parse(JSON.stringify(system));

    newSystem.feats = newSystem.feats.map((feat: Feat) => {
        if (feat.value !== undefined && feat.effect === undefined) {
            feat.effect = feat.value >= 0 ? `+${feat.value}` : `${feat.value}`;
            if (feat.value === 0) feat.effect = '';
            delete feat.value;
            wasMigrated = true;
        }
        return feat;
    });

    let formSchema = JSON.parse(newSystem.schemas.formSchema);
    let uiSchema = JSON.parse(newSystem.schemas.uiSchema);

    if (formSchema.properties.saves?.type === 'array') {
        formSchema.properties.saves = { type: 'object', properties: {} };
        uiSchema.saves = { 'ui:fieldset': true, 'ui:label': 'Saves', fields: {} };
        
        system.saves.forEach(save => {
            formSchema.properties.saves.properties[save.name] = { type: 'number', default: 0 };
            uiSchema.saves.fields[save.name] = { 'ui:widget': 'number', 'ui:label': save.name };
        });
        wasMigrated = true;
    }

    if (formSchema.properties.skills?.items?.type === 'string') {
        formSchema.properties.skills = {
            type: 'array',
            default: [],
            items: {
                type: 'object',
                properties: {
                    name: { type: 'string' },
                    value: { type: 'number', default: 0 }
                }
            }
        };
        uiSchema.skills = { 'ui:widget': 'custom', 'ui:label': 'Skills' };
        wasMigrated = true;
    }
    
    if (wasMigrated) {
        newSystem.schemas.formSchema = JSON.stringify(formSchema, null, 2);
        newSystem.schemas.uiSchema = JSON.stringify(uiSchema, null, 2);
    }
    
    return newSystem;
}


async function getFilePath(collection: string, id: string) {
    await dataReady;
    const dir = collection === 'systems' ? systemsDir : charactersDir;
    return path.join(dir, `${id}.json`);
}

export async function saveSystem(systemData: GameSystem): Promise<void> {
    const filePath = await getFilePath('systems', systemData.systemId);
    await fs.writeFile(filePath, JSON.stringify(systemData, null, 2), 'utf-8');
}

export async function getSystem(systemId: string): Promise<GameSystem | null> {
    const filePath = await getFilePath('systems', systemId);
    try {
        const fileContent = await fs.readFile(filePath, 'utf-8');
        const system = JSON.parse(fileContent) as GameSystem;
        return migrateSystem(system);
    } catch (error) {
        if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
            return null;
        }
        console.error(`Failed to read system ${systemId}:`, error);
        return null;
    }
}

export async function listSystems(): Promise<{ id: string; name: string; description: string }[]> {
    await dataReady;
    try {
        const files = await fs.readdir(systemsDir);
        const systems = await Promise.all(
            files.map(async (file) => {
                if (file.endsWith('.json')) {
                    const systemId = file.replace('.json', '');
                    const system = await getSystem(systemId);
                    if (system) {
                        return {
                            id: system.systemId,
                            name: system.systemName,
                            description: system.description,
                        };
                    }
                }
                return null;
            })
        );
        return systems.filter((s): s is { id: string; name: string; description: string } => s !== null);
    } catch (error) {
        if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
            await initializeDataDirs();
            return listSystems();
        }
        console.error('Failed to list systems:', error);
        return [];
    }
}


// =========== Characters API ===========

export interface Character {
    characterId: string;
    systemId: string;
    data: any;
}

export async function saveCharacter(characterData: Character): Promise<void> {
    const filePath = await getFilePath('characters', characterData.characterId);
    await fs.writeFile(filePath, JSON.stringify(characterData, null, 2), 'utf-8');
}

export async function getCharacter(characterId: string): Promise<Character | null> {
    const filePath = await getFilePath('characters', characterId);
    try {
        const fileContent = await fs.readFile(filePath, 'utf-8');
        return JSON.parse(fileContent) as Character;
    } catch (error) {
       if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
            return null;
        }
        console.error(`Failed to read character ${characterId}:`, error);
        return null;
    }
}

export async function listCharacters(): Promise<Character[]> {
    await dataReady;
    try {
        const files = await fs.readdir(charactersDir);
        const characters = await Promise.all(
            files.map(async (file) => {
                if (file.endsWith('.json')) {
                    const charId = file.replace('.json', '');
                    return await getCharacter(charId);
                }
                return null;
            })
        );
        return characters.filter((c): c is Character => c !== null);
    } catch (error) {
        if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
             await initializeDataDirs();
             return listCharacters();
        }
        console.error('Failed to list characters:', error);
        return [];
    }
}

// =========== Library APIs ===========

export async function listSkillsFromLibrary(): Promise<SkillFromLibrary[]> {
    await dataReady;
    const filePath = path.join(dataDir, 'skill-library.json');
    try {
        const fileContent = await fs.readFile(filePath, 'utf-8');
        return JSON.parse(fileContent) as SkillFromLibrary[];
    } catch (error) {
        if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
            console.warn('skill-library.json not found. Returning empty list.');
            return [];
        }
        console.error('Failed to read skill library:', error);
        return [];
    }
}

export async function listFeatsFromLibrary(): Promise<FeatFromLibrary[]> {
    await dataReady;
    const filePath = path.join(dataDir, 'feat-library.json');
    try {
        const fileContent = await fs.readFile(filePath, 'utf-8');
        return JSON.parse(fileContent) as FeatFromLibrary[];
    } catch (error) {
        if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
            await fs.writeFile(filePath, '[]', 'utf-8');
            console.warn('feat-library.json not found. Created an empty one. Returning empty list.');
            return [];
        }
        console.error('Failed to read feat library:', error);
        return [];
    }
}
