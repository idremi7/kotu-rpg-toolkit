# Project Blueprint: KOTU - RPG Toolkit

## 1. Core Concept

KOTU is a web-based application designed to empower both Game Masters (GMs) and players in the world of tabletop role-playing games (TTRPGs). It provides a flexible platform for creating custom game systems and managing characters within those systems.

## 2. Personas

-   **Game Master (GM):** Wants to create a unique TTRPG experience. Needs tools to define rules, stats, and abilities without being a software developer. Wants to quickly generate content like skills to flesh out their world.
-   **Player:** Wants to join a game, easily create a character that conforms to the GM's rules, and have a digital character sheet that is easy to view and manage.

## 3. Core Features

### For Game Masters (GMs)

-   [x] **Create Custom TTRPG Systems**: A form-based interface to define a new game system.
    -   [x] Define system name.
    -   [x] Define core attributes (e.g., Strength, Dexterity, Intelligence).
    -   [x] Define skills and link them to a base attribute.
    -   [x] Define saving throws and link them to a base attribute.
    -   [x] Define feats (special abilities with prerequisites and effects).
-   [x] **AI-Powered Skill Suggestions**: An assistant to help GMs generate a list of skills based on the defined attributes, speeding up the creative process.
-   [x] **Dynamic Schema Generation**: The application automatically generates the necessary data and UI schemas for character sheets based on the system rules.
-   [x] **View System Details**: A read-only page to see the full configuration of a created system.

### For Players

-   [x] **Browse Game Systems**: Discover and choose from a list of available game systems created by GMs.
-   [x] **Dynamic Character Creation**: Create new characters using a form that is dynamically generated to match the specific rules of the chosen game system.
-   [x] **View Character Sheets**: Access a clean, well-organized digital character sheet that displays all the character's stats, skills, and details.

## 4. Tech Stack & Architecture

-   **Framework**: Next.js (App Router, React Server Components)
-   **Language**: TypeScript
-   **Styling**: Tailwind CSS
-   **UI Components**: shadcn/ui
-   **Generative AI**: Google Gemini via Genkit
-   **Data Storage**: Local JSON files (no external database).
    -   Systems are stored in `/data/systems/*.json`.
    -   Characters are stored in `/data/characters/*.json`.
-   **Core Logic**:
    -   **Server Actions (`src/actions.ts`)**: Handle all server-side mutations (saving systems, characters) and data fetching.
    -   **Data Service (`src/lib/data-service.ts`)**: A dedicated module to abstract the file system interactions (reading/writing JSON files). This keeps the Server Actions clean and focused on business logic.

## 5. Page Structure

-   `/`: Homepage
-   `/gm/dashboard`: GM's main view, listing all created systems.
-   `/gm/systems/create`: Page for the system creation form.
-   `/gm/systems/[systemId]`: Page to view the details of a specific system.
-   `/player/dashboard`: Player's main view, listing all their characters.
-   `/player/characters/create`: Page to select a game system for character creation.
-   `/player/characters/create/[systemId]`: The character creation form for a specific system.
-   `/player/characters/[characterId]`: The character sheet view.
