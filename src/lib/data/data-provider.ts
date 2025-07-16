// Define the structure for a "feat" (don)
export interface Feat {
    name: string;
    description: string;
    prerequisites: string;
    effect?: string; 
    value?: number; // Legacy, for migration
}

export interface CustomRule {
    title: string;
    description: string;
}

export interface GameSystem {
    systemId: string;
    systemName: string;
    description: string;
    attributes: { name: string; description: string }[];
    skills: { name: string; baseAttribute: string }[];
    feats: Feat[];
    saves: { name: string; baseAttribute: string }[];
    customRules?: CustomRule[];
    schemas: { formSchema: string; uiSchema: string };
    usesD20StyleModifiers?: boolean;
}

export interface GameSystemSummary {
    id: string;
    name: string;
    description: string;
}

export interface Character {
    characterId: string;
    systemId: string;
    data: any;
}

export interface SkillFromLibrary {
    name: string;
    category: string;
    description: string;
}

export interface FeatFromLibrary {
    name: string;
    description: string;
    prerequisites: string;
    category: string; 
    effect?: string;
}


/**
 * @interface DataProvider
 * @description Defines the contract for all data access operations in the application.
 * Any data source (localStorage, API, etc.) must implement this interface.
 */
export interface DataProvider {
    saveSystem(systemData: Omit<GameSystem, 'systemId' | 'schemas' | 'description'> | GameSystem): Promise<{ success: boolean, systemId?: string, error?: string }>;
    importSystem(systemData: any): Promise<{ success: boolean, error?: string }>;
    getSystem(systemId: string): Promise<GameSystem | null>;
    listSystems(): Promise<GameSystemSummary[]>;

    saveCharacter(characterData: Character): Promise<{ success: boolean, characterId?: string, error?: string }>;
    getCharacter(characterId: string): Promise<Character | null>;
    listCharacters(): Promise<Character[]>;

    listSkillsFromLibrary(): Promise<SkillFromLibrary[]>;
    listFeatsFromLibrary(): Promise<FeatFromLibrary[]>;
}
