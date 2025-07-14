# Project Blueprint: KOTU RPG Toolkit

This document outlines the core architecture, features, and page structure for the KOTU (King of the Hill) RPG Toolkit application.

## 1. Core Concept

A web application for Game Masters (GMs) to create custom TTRPG systems (defining attributes, skills, feats) and for Players to create and manage characters based on those systems.

## 2. Tech Stack & Architecture

-   **Framework**: Next.js (App Router, RSC)
-   **Language**: TypeScript
-   **Styling**: Tailwind CSS
-   **UI Components**: shadcn/ui
-   **AI**: Genkit with Google Gemini for skill suggestions.
-   **Data Storage**:
    -   Game systems and character data are stored in local JSON files within the `data/` directory at the project root.
    -   The `src/lib/data-service.ts` file is responsible for all file system interactions (reading and writing JSON data).

## 3. Features Checklist

-   [x] **GM: Create Custom Systems**: GMs can define a system name, attributes, skills, saves, and feats.
-   [x] **GM: AI Skill Suggestions**: An AI assistant can suggest skills based on the defined attributes to speed up creation.
-   [x] **Dynamic Schema Generation**: The backend automatically generates form and UI schemas when a system is saved.
-   [x] **GM: Dashboard**: GMs can view a list of all the game systems they have created.
-   [x] **Player: Browse Systems**: Players can see a list of available game systems to choose from for character creation.
-   [x] **Player: Dynamic Character Creation**: The character creation form is dynamically built based on the selected system's rules.
-   [x] **Player: View Character Sheet**: A clean, printable character sheet is generated for created characters.
-   [x] **Player: Dashboard**: Players can view a list of all the characters they have created.

## 4. Page Structure

-   `/` - Home Page
-   `/gm/dashboard` - GM dashboard listing created systems.
-   `/gm/systems/create` - Page for creating a new TTRPG system.
-   `/gm/systems/[systemId]` - Page displaying the details of a specific system.
-   `/player/dashboard` - Player dashboard listing created characters.
-   `/player/characters/create` - Page to select a system for character creation.
-   `/player/characters/create/[systemId]` - The dynamic form for creating a character in a specific system.
-   `/player/characters/[characterId]` - Page displaying a specific character's sheet.
-   `/login` - User login page.
-   `/signup` - User signup page.
