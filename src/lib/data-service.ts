// This file should only be used on the server.
import 'server-only';

import fs from 'fs/promises';
import path from 'path';

// WARNING: Using the file system is not recommended for production applications
// on serverless platforms like Firebase App Hosting. The /tmp directory is ephemeral
// and data will be lost on instance restarts. A database like Firestore is recommended.

// We use the /tmp directory because it's the only writable part of the filesystem on App Hosting.
const dataDir = path.join(process.cwd(), '.tmp');
const systemsDir = path.join(dataDir, 'systems');
const charactersDir = path.join(dataDir, 'characters');

// The original source of truth for default systems.
const sourceSystemsDir = path.join(process.cwd(), 'data', 'systems');

let isInitialized = false;

// Function to ensure directories exist and copy initial data.
async function initializeDataDirs() {
    if (isInitialized) return;

    try {
        // Ensure the base directories exist in .tmp
        await fs.mkdir(systemsDir, { recursive: true });
        await fs.mkdir(charactersDir, { recursive: true });

        // Copy default systems from the project's data/systems to .tmp/data/systems
        const sourceFiles = await fs.readdir(sourceSystemsDir);
        for (const file of sourceFiles) {
            if (file.endsWith('.json')) {
                const sourcePath = path.join(sourceSystemsDir, file);
                const destPath = path.join(systemsDir, file);
                try {
                    // Check if the file already exists in .tmp before copying
                    await fs.access(destPath);
                } catch {
                    // File doesn't exist, so copy it
                    await fs.copyFile(sourcePath, destPath);
                }
            }
        }
        isInitialized = true;
    } catch (error) {
        // Log the error but don't throw, as the app might still function for reads
        // if initialization partially succeeded or directories already existed.
        console.error("Failed to initialize data directories in .tmp:", error);
    }
}


// =========== Systems API ===========

export interface GameSystem {
    systemId: string;
    systemName: string;
    description: string;
    attributes: { name: string; description: string }[];
    skills: { name: string; baseAttribute: string }[];
    feats: { name: string; description: string; prerequisites: string }[];
    saves: { name: string; baseAttribute: string }[];
    schemas: { formSchema: string; uiSchema: string };
}

export async function saveSystem(systemData: GameSystem): Promise<void> {
    await initializeDataDirs();
    const filePath = path.join(systemsDir, `${systemData.systemId}.json`);
    await fs.writeFile(filePath, JSON.stringify(systemData, null, 2));
}

export async function getSystem(systemId: string): Promise<GameSystem | null> {
    await initializeDataDirs();
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
    await initializeDataDirs();
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
    await initializeDataDirs();
    const filePath = path.join(charactersDir, `${characterData.characterId}.json`);
    await fs.writeFile(filePath, JSON.stringify(characterData, null, 2));
}

export async function getCharacter(characterId: string): Promise<Character | null> {
    await initializeDataDirs();
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
    await initializeDataDirs();
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
