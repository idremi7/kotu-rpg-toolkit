// This file should only be used on the server.
import 'server-only';

import fs from 'fs/promises';
import path from 'path';

const dataDir = path.join(process.cwd(), 'data');
const systemsDir = path.join(dataDir, 'systems');
const charactersDir = path.join(dataDir, 'characters');

// Function to ensure a directory exists
async function ensureDir(dirPath: string) {
    try {
        await fs.access(dirPath);
    } catch (e) {
        await fs.mkdir(dirPath, { recursive: true });
    }
}

// Ensure base directories exist on startup
(async () => {
    await ensureDir(systemsDir);
    await ensureDir(charactersDir);
})();


// =========== Systems API ===========

export interface GameSystem {
    systemId: string;
    systemName: string;
    description: string;
    attributes: { name: string; description: string }[];
    skills: { name: string; baseAttribute: string }[];
    feats: { name: string; description: string; prerequisites: string }[];
    schemas: { formSchema: string; uiSchema: string };
}

export async function saveSystem(systemData: GameSystem): Promise<void> {
    const filePath = path.join(systemsDir, `${systemData.systemId}.json`);
    await fs.writeFile(filePath, JSON.stringify(systemData, null, 2));
}

export async function getSystem(systemId: string): Promise<GameSystem | null> {
    const filePath = path.join(systemsDir, `${systemId}.json`);
    try {
        const fileContent = await fs.readFile(filePath, 'utf-8');
        return JSON.parse(fileContent) as GameSystem;
    } catch (error) {
        console.error(`Failed to read system file for ${systemId}:`, error);
        return null;
    }
}

export async function listSystems(): Promise<{ id: string; name: string; description: string }[]> {
    try {
        const files = await fs.readdir(systemsDir);
        const systemPromises = files
            .filter(file => file.endsWith('.json'))
            .map(async file => {
                const filePath = path.join(systemsDir, file);
                const fileContent = await fs.readFile(filePath, 'utf-8');
                const system = JSON.parse(fileContent) as GameSystem;
                return {
                    id: system.systemId,
                    name: system.systemName,
                    description: system.description,
                };
            });
        return await Promise.all(systemPromises);
    } catch (error) {
        console.error('Failed to list systems:', error);
        return [];
    }
}


// =========== Characters API ===========

export interface Character {
    characterId: string;
    systemId: string;
    data: any; // The actual character sheet data
}

export async function saveCharacter(characterData: Character): Promise<void> {
    const filePath = path.join(charactersDir, `${characterData.characterId}.json`);
    await fs.writeFile(filePath, JSON.stringify(characterData, null, 2));
}

export async function getCharacter(characterId: string): Promise<Character | null> {
    const filePath = path.join(charactersDir, `${characterId}.json`);
    try {
        const fileContent = await fs.readFile(filePath, 'utf-8');
        return JSON.parse(fileContent) as Character;
    } catch (error) {
        console.error(`Failed to read character file for ${characterId}:`, error);
        return null;
    }
}

export async function listCharacters(): Promise<Character[]> {
    try {
        const files = await fs.readdir(charactersDir);
        const characterPromises = files
            .filter(file => file.endsWith('.json'))
            .map(async file => {
                const filePath = path.join(charactersDir, file);
                const fileContent = await fs.readFile(filePath, 'utf-8');
                return JSON.parse(fileContent) as Character;
            });
        return await Promise.all(characterPromises);
    } catch (error) {
        console.error('Failed to list characters:', error);
        return [];
    }
}
