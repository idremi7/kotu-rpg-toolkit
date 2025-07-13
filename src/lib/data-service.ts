// This file should only be used on the server.
import 'server-only';
import { db } from './firebase-admin';
import dnd35 from '@/data/systems/dnd-3-5.json';
import customHome from '@/data/systems/custom-home-ttrpg.json';

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

let defaultSystemsSeeded = false;

async function seedDefaultSystems() {
    if (defaultSystemsSeeded) return;

    const systemsCollection = db.collection('systems');
    const snapshot = await systemsCollection.limit(2).get();

    if (snapshot.empty) {
        console.log("Seeding default systems into Firestore...");
        const batch = db.batch();

        const dndRef = systemsCollection.doc(dnd35.systemId);
        batch.set(dndRef, dnd35);
        
        const customHomeRef = systemsCollection.doc(customHome.systemId);
        batch.set(customHomeRef, customHome);
        
        await batch.commit();
        console.log("Default systems seeded.");
    }
    defaultSystemsSeeded = true;
}


export async function saveSystem(systemData: GameSystem): Promise<void> {
    const systemsCollection = db.collection('systems');
    await systemsCollection.doc(systemData.systemId).set(systemData);
}

export async function getSystem(systemId: string): Promise<GameSystem | null> {
    await seedDefaultSystems();
    const doc = await db.collection('systems').doc(systemId).get();
    if (!doc.exists) {
        return null;
    }
    return doc.data() as GameSystem;
}

export async function listSystems(): Promise<{ id: string; name: string; description: string }[]> {
    await seedDefaultSystems();
    const snapshot = await db.collection('systems').get();
    if (snapshot.empty) {
        return [];
    }
    return snapshot.docs.map(doc => {
        const data = doc.data() as GameSystem;
        return {
            id: data.systemId,
            name: data.systemName,
            description: data.description,
        };
    });
}


// =========== Characters API ===========

export interface Character {
    characterId: string;
    systemId: string;
    data: any; // The actual character sheet data
}

export async function saveCharacter(characterData: Character): Promise<void> {
    await db.collection('characters').doc(characterData.characterId).set(characterData);
}

export async function getCharacter(characterId: string): Promise<Character | null> {
    const doc = await db.collection('characters').doc(characterId).get();
    if (!doc.exists) {
        return null;
    }
    return doc.data() as Character;
}

export async function listCharacters(): Promise<Character[]> {
    const snapshot = await db.collection('characters').get();
    if (snapshot.empty) {
        return [];
    }
    return snapshot.docs.map(doc => doc.data() as Character);
}
