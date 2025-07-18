/**
 * @fileOverview This is the central data service for the application.
 * It uses a "provider" model to abstract the actual data storage implementation.
 * Components should only ever call functions from this service, and should not
 * be aware of where the data is coming from (e.g., localStorage, API, etc.).
 *
 * To switch data sources (e.g., from localStorage to a real backend API),
 * you would create a new provider that implements the DataProvider interface
 * and then instantiate it here instead of FileSystemProvider.
 */

'use server';

import type { DataProvider, GameSystem } from './data/data-provider';
import { FileSystemProvider } from './data/file-system-provider';

// Instantiate the desired data provider.
// To switch to a backend, you might swap this with:
// const dataProvider: DataProvider = new ApiProvider();
const dataProvider: DataProvider = new FileSystemProvider();

// --- Systems API ---
export const saveSystem = async (systemData: Omit<GameSystem, 'systemId' | 'schemas' | 'description'> | GameSystem) => {
  return dataProvider.saveSystem(systemData);
};

export const importSystem = async (systemData: any) => {
  return dataProvider.importSystem(systemData);
};

export const getSystem = async (systemId: string) => {
  return dataProvider.getSystem(systemId);
};

export const listSystems = async () => {
  return dataProvider.listSystems();
};

export const deleteSystem = async (systemId: string) => {
    return dataProvider.deleteSystem(systemId);
};

// --- Characters API ---
export const saveCharacter = async (characterData: any) => {
  return dataProvider.saveCharacter(characterData);
};

export const getCharacter = async (characterId: string) => {
  return dataProvider.getCharacter(characterId);
};

export const listCharacters = async () => {
  return dataProvider.listCharacters();
};

export const deleteCharacter = async (characterId: string) => {
  return dataProvider.deleteCharacter(characterId);
};


// --- Library APIs ---
export const listSkillsFromLibrary = async () => {
  return dataProvider.listSkillsFromLibrary();
};

export const listFeatsFromLibrary = async () => {
  return dataProvider.listFeatsFromLibrary();
};

// We still export the types from the provider so components can use them.
export type { GameSystemSummary, Character, SkillFromLibrary, FeatFromLibrary, Feat, CustomRule, GameSystem } from './data/data-provider';