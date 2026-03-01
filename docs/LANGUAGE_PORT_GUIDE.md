# Language Port Guide: VERSA RPG Toolkit

This document provides comprehensive specifications for porting the VERSA RPG Toolkit to other programming languages and frameworks.

## Table of Contents
1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [Data Models & Structures](#data-models--structures)
4. [Data Storage](#data-storage)
5. [API Specifications](#api-specifications)
6. [Core Features](#core-features)
7. [UI/UX Requirements](#uiux-requirements)
8. [Implementation Checklist](#implementation-checklist)

---

## Project Overview

**Project Name:** VERSA (Versatile Encyclopedic RPG System Assistant)  
**Current Stack:** Next.js 15 + TypeScript + React 18 + Tailwind CSS + shadcn/ui  
**Purpose:** A web application for creating and managing TTRPG (Tabletop Role-Playing Game) systems and characters

### Key Capabilities
- Game Masters can create custom TTRPG systems with configurable attributes, skills, feats, and saving throws
- Players can create and manage characters based on those systems
- Dynamic form generation based on system definitions
- Multi-language support (English, French)
- No database required (file-system based storage)

---

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    User Interface Layer                      │
│         (React Components + Tailwind CSS Styling)            │
├─────────────┬─────────────────────────────────────────────────┤
│ GM Routes   │ Player Routes      │ Auth Routes │ Shared Comps  │
│ /gm/*       │ /player/*          │ /login      │ UI Library    │
│             │                    │ /signup     │ Headers/Etc   │
├─────────────────────────────────────────────────────────────┤
│            Service/Business Logic Layer                       │
│  - SystemCreator (form logic, schema generation)              │
│  - CharacterCreator (form logic, data validation)             │
│  - (no AI features)                                      │
├─────────────────────────────────────────────────────────────┤
│              Data Access Layer (DataProvider)                 │
│  - FileSystemProvider (JSON file operations)                  │
│  - Implements: saveSystem, getSystem, listSystems, etc.       │
├─────────────────────────────────────────────────────────────┤
│                  Data Storage Layer                           │
│  - JSON files in: data/systems/*, data/characters/*           │
│  - Libraries: public/data/feat-library.json, etc.             │
└─────────────────────────────────────────────────────────────┘
```

### Provider Pattern

The application uses a **Provider Pattern** for data access:
- All business logic calls `DataProvider` interface
- `FileSystemProvider` implements the interface (reads/writes JSON files)
- To switch data sources, swap the provider without changing business logic
- This makes the codebase backend-agnostic

---

## Data Models & Structures

### GameSystem Model

```typescript
{
  systemId: string;              // Unique identifier (UUID or timestamp-based)
  systemName: string;            // User-friendly name
  description: string;           // System description
  version: string;               // Optional: version tracking
  usesD20StyleModifiers: boolean;// Optional: special handling for d20 systems
  
  attributes: [                  // Core attributes (str, dex, con, etc)
    {
      id?: string;               // Optional: unique attribute ID
      name: string;              // "Strength", "Dexterity", etc
      description: string;       // What this attribute represents
    }
  ];
  
  skills: [                      // Skills in this system
    {
      id?: string;               // Optional
      name: string;              // "Acrobatics", "Arcana", etc
      baseAttribute: string;     // References an attribute name
    }
  ];
  
  saves: [                       // Saving throws
    {
      id?: string;               // Optional
      name: string;              // "Strength Save", "Wisdom Save", etc
      baseAttribute: string;     // References an attribute name
    }
  ];
  
  feats: [                       // Available feats in this system
    {
      id?: string;               // Optional
      name: string;
      description: string;
      prerequisites: string;     // e.g., "Str 13", "BAB +1"
      effect?: string;           // e.g., "+2 Initiative"
    }
  ];
  
  customRules?: [                // Optional: house rules
    {
      title: string;
      description: string;
    }
  ];
  
  classes?: [                    // Optional: character classes
    {
      id?: string;
      name: string;
      description: string;
    }
  ];
  
  races?: [                      // Optional: character races
    {
      id?: string;
      name: string;
      description: string;
    }
  ];
  
  backgrounds?: [                // Optional: character backgrounds
    {
      id?: string;
      name: string;
      description: string;
    }
  ];
  
  magicSystem?: {                // Optional: magic system details
    spellcastingAbility: string[];  // e.g., ["Intelligence", "Wisdom", "Charisma"]
    spellListExample: [
      {
        id?: string;
        name: string;
        level: number;
        school: string;             // e.g., "Evocation"
        description: string;
      }
    ];
    spellcastingRules?: string;
  };
  
  equipment?: [                  // Optional: equipment definitions
    {
      id?: string;
      name: string;
      type: string;              // "Weapon", "Armor", etc
      cost?: string;
      weight?: string;
      properties?: string;
      ac?: string;
    }
  ];
  
  schemas: {                     // **GENERATED AUTOMATICALLY**
    formSchema: string;          // JSON Schema (stringified)
    uiSchema: string;            // JSON UI Schema (stringified)
  };
}
```

### Character Model

```typescript
{
  characterId: string;           // Unique identifier
  systemId: string;              // References the system this character uses
  data: {                        // All character data (flexible structure)
    name: string;
    class?: string;
    level?: number;
    attributes?: {               // Keys are attribute names, values are numbers
      "Strength": 15,
      "Dexterity": 14,
      // ... other attributes
    };
    saves?: {                    // Keys are save names, values are numbers
      "Strength Save": 5,
      // ... other saves
    };
    skills?: [                   // Array of skills with values
      {
        name: string;
        value: number;
      }
    ];
    feats?: string[];            // Array of feat names
    backstory?: string;
    // ... any other custom fields based on system definition
  };
}
```

### Skill Library Entry

```typescript
{
  name: string;                  // "Acrobatics", "Arcana"
  category: string;              // "Dexterity", "Intelligence" (attribute name)
  description: string;
}
```

### Feat Library Entry

```typescript
{
  name: string;
  description: string;
  prerequisites: string;         // "Dex 13", "BAB +1", "None"
  category: string;              // "General", "Combat", etc
  effect?: string;               // "+2 Initiative"
}
```

---

## Data Storage

### File Structure

```
project_root/
├── data/
│   ├── characters/
│   │   ├── char_1752530425755.json
│   │   ├── char_1752532646914.json
│   │   └── ...
│   ├── systems/
│   │   ├── dnd-5e.json
│   │   ├── dnd-3-5.json
│   │   ├── d20-modern.json
│   │   ├── test-system.json
│   │   └── ...
│   ├── feat-library.json
│   └── skill-library.json
├── public/
│   └── data/
│       ├── feat-library.json
│       ├── skill-library.json
│       ├── characters/
│       ├── systems/
│       └── manifest.json
```

### Storage Requirements

- **Location:** Local file system (no database)
- **Format:** JSON
- **Character IDs:** Can use timestamps (e.g., `char_1752530425755`) or UUIDs
- **System IDs:** Custom strings (e.g., `dnd-5e`, `test-system`)
- **Permissions:** Application needs read/write access to `data/` directory

### Multi-Language Considerations (future release)

The feat library supports multiple languages in a single file:

```json

  { "name": "Acrobatic", "lang": "en", ... },
  { "name": "Acrobatique", "lang": "fr", ... },
  { "name": "Alert", "lang": "en", ... },
  { "name": "Vigilance", "lang": "fr", ... }
]
```

---

## API Specifications

### DataProvider Interface

All implementations must provide these methods:

#### Systems API

```
saveSystem(systemData) → Promise<{ success: boolean, systemId?: string, error?: string }>
- Input: Partial GameSystem (systemId, schemas optional on create)
- Returns: Success status and systemId
- Side effects: Generates schemas if not provided, creates unique systemId
- Must validate required fields: systemName, attributes, skills

getSystem(systemId: string) → Promise<GameSystem | null>
- Returns complete system or null if not found

listSystems() → Promise<GameSystemSummary[]>
- Returns: Array of { id, name, description }

deleteSystem(systemId: string) → Promise<{ success: boolean, error?: string }>
- Returns success status

importSystem(systemData: any) → Promise<{ success: boolean, error?: string }>
- Imports external system data (allows bulk imports)
```

#### Characters API

```
saveCharacter(characterData: Character) → Promise<{ success: boolean, characterId?: string, error?: string }>
- Generates unique characterId if not provided
- Validates character has systemId

getCharacter(characterId: string) → Promise<Character | null>
- Returns complete character or null

listCharacters() → Promise<Character[]>
- Returns all characters

deleteCharacter(characterId: string) → Promise<{ success: boolean, error?: string }>
```

#### Library APIs

```
listSkillsFromLibrary() → Promise<SkillFromLibrary[]>

listFeatsFromLibrary() → Promise<FeatFromLibrary[]>
```

---

## Core Features

### 1. System Creation & Management

**Entry Point:** `/gm/systems/create`

**Capabilities:**
- Define system name and description
- Add/remove attributes (with descriptions)
- Add/remove skills (linked to attributes)
- Add/remove feats (with prerequisites and effects)
- Add/remove saving throws (linked to attributes)
- Optional: Custom rules, classes, races, backgrounds

**Implementation Details:**
- Use form validation library (React Hook Form + Zod in original)
- Generate JSON Schema and UI Schema automatically after system creation
- Schema generation logic:
  - Creates form schema from attributes, skills, saves, feats
  - Creates corresponding UI schema for rendering

### 2. Dynamic Character Creation

**Entry Point:** `/player/characters/create/[systemId]`

**Capabilities:**
- Load system definition based on system ID
- Render dynamic form based on system's schemas
- Validate character data against schema
- Save character with reference to system

**Implementation Details:**
- Forms are driven by JSON Schema + UI Schema
- No hardcoded forms
- Must support various field types: text, number, select, array, textarea

### 3. Character Sheet Display

**Entry Point:** `/player/characters/[characterId]`

**Capabilities:**
- Display character data in organized, readable format
- Show all attributes, skills, saves, feats
- Optional: Print-friendly view
- Optional: Export to PDF



**Flows:**
1. **Suggest Skills:** Given attributes, suggest relevant skills
2. **Suggest Feats:** Given attributes and existing feats, suggest new feats

**Requirements:**
- Can be replaced with any LLM (OpenAI, Claude, etc.)
- Should handle gracefully if AI service is unavailable
- Must not block system creation

### 5. Authentication (Placeholder)

**Current Status:** Login/signup pages exist but are not implemented
- Routes: `/login`, `/signup`
- Can be implemented with any auth provider (Firebase, Auth0, custom JWT, etc.)

---

## UI/UX Requirements

### Design System

- **Color Scheme:** Dark/Light theme support
- **Component Library:** Use a headless UI library (similar to shadcn/ui)
- **Layout:** Responsive design (mobile-first)
- **Icons:** Lucide React equivalent in your framework

### Key Pages & Layouts

#### GM Flows
1. **GM Dashboard** (`/gm/dashboard`)
   - List all created systems
   - Links to view, edit, delete systems
   - Button to create new system

2. **System Creator** (`/gm/systems/create`)
   - Multi-section form
   - Dynamic add/remove for attributes, skills, feats, saves
   - Preview of system structure

3. **System Details** (`/gm/systems/[systemId]`)
   - Display system information
   - Show all attributes, skills, feats, saves
   - Edit button
   - Delete button

4. **System Editor** (`/gm/systems/[systemId]/edit`)
   - Similar to creator but pre-populated

#### Player Flows
1. **Player Dashboard** (`/player/dashboard`)
   - List all created characters
   - Links to view, edit, delete characters
   - Button to create new character

2. **System Selection** (`/player/characters/create`)
   - Browse available systems
   - Select one to create character

3. **Character Creator** (`/player/characters/create/[systemId]`)
   - Dynamic form based on system
   - Schema-driven rendering

4. **Character Sheet** (`/player/characters/[characterId]`)
   - Display character data
   - Show calculated modifiers (for d20 systems)
   - Edit button

### Common Components

- Header/Navigation
- Footer
- Theme toggle (dark/light)
- Toast notifications
- Modals/Dialogs
- Tables (for displaying lists)
- Cards (for organization)
- Buttons, inputs, forms
- Expandable/collapsible sections
- Dropdowns/menus

---

## Implementation Checklist

### Phase 1: Core Infrastructure
- [ ] Set up project structure and build pipeline
- [ ] Implement DataProvider interface
- [ ] Implement FileSystemProvider
- [ ] Create data models/types
- [ ] Set up API endpoints/routes if using server-side rendering

### Phase 2: Basic CRUD Operations
- [ ] Implement system save/load/list/delete
- [ ] Implement character save/load/list/delete
- [ ] Implement library data loading (skills, feats)
- [ ] Set up file paths and directory structure

### Phase 3: UI Components & Pages
- [ ] Create navigation structure
- [ ] Build GM dashboard
- [ ] Build player dashboard
- [ ] Create header/footer components
- [ ] Implement theme system

### Phase 4: System Creation
- [ ] Build system creator form
- [ ] Implement schema generation logic
- [ ] Add form validation

### Phase 5: Character Creation
- [ ] Build dynamic form renderer (schema → UI)
- [ ] Build character creator flow
- [ ] Implement character data validation

### Phase 6: Display & Management
- [ ] Build character sheet display
- [ ] Build system details view
- [ ] Implement edit/delete flows
- [ ] Add import/export functionality

### Phase 7: Polish & Features
- [ ] Add authentication (optional)
- [ ] Add multi-language support
- [ ] Add print/export functionality
- [ ] Performance optimization

---

## Technology-Specific Guidelines

### Backend Framework Recommendations

**For Server-Side Rendering (like Next.js):**
- Node.js: Express, Fastify, or similar
- Python: FastAPI, Flask, Django
- C#: ASP.NET Core
- Java: Spring Boot
- Go: Gin, Echo

**Requirements:**
- File system access for JSON storage
- JSON parsing/serialization
- Form validation library
- Optional: AI API client library

### Frontend Framework Recommendations

**Requirements:**
- Component-based architecture
- State management (Redux, MobX, Zustand, etc.)
- Form handling library
- CSS-in-JS or utility-first CSS
- Routing library

### Database (Optional)

If not using file system:
- PostgreSQL, MySQL, MongoDB
- Must implement equivalent of FileSystemProvider
- Need schema migrations for GameSystem, Character tables

---

## Key Implementation Patterns

### Schema Generation

When a system is created, automatically generate form and UI schemas:

```
Input System:
- attributes: [{ name: "Strength", description: "..." }, ...]
- skills: [{ name: "Athletics", baseAttribute: "Strength" }, ...]
- feats: [{ name: "Alert", prerequisites: "", effect: "..." }, ...]

Output formSchema (JSON Schema):
{
  "type": "object",
  "properties": {
    "name": { "type": "string" },
    "attributes": {
      "type": "object",
      "properties": {
        "Strength": { "type": "number", "default": 10 },
        ...
      }
    },
    "skills": { "type": "array", "items": { ... } },
    ...
  }
}

Output uiSchema:
{
  "name": { "ui:label": "Character Name" },
  "attributes": { "ui:fieldset": true, ... },
  ...
}
```

### Dynamic Form Rendering

Create a generic form renderer that:
1. Reads JSON Schema and UI Schema
2. Creates corresponding form fields
3. Validates against schema on submit
4. Returns structured data

### Data Validation

1. On save: Validate incoming data against schema
2. On display: Assume data is valid (was validated on save)
3. Use schema library (JSON Schema validators available in most languages)

---

## Common Pitfalls to Avoid

1. **Hard-coded Forms:** All forms must be dynamic based on system definition
2. **Missing Provider Abstraction:** Don't tightly couple to file system
3. **Schema String Handling:** Schemas are stored as JSON strings, need proper serialization/deserialization
4. **Multi-language Support:** Plan from start; don't retrofit libraries
5. **Attribute Reference:** Skills/saves reference attributes by name, maintain consistency
6. **Type Flexibility:** Character data is highly flexible; don't over-constrain
7. **ID Generation:** Choose consistent strategy (timestamps vs UUIDs) and stick with it
8. **Error Handling:** Gracefully handle missing systems, corrupt JSON, file permissions

---

## Example: Minimal Implementation

To verify your port works, implement these 3 key flows:

1. **Create a system** with 3 attributes, 2 skills, 1 feat
2. **Create a character** using that system
3. **Load and display** that character's data

If these work, the core architecture is sound.

---

## Additional Resources

- Original Project: `https://github.com/[repo-url]`
- D&D 5e Reference: `https://www.dndbeyond.com`
- JSON Schema Spec: `https://json-schema.org`
- Zod Validation (TypeScript reference): `https://zod.dev`
- React Hook Form (form handling reference): `https://react-hook-form.com`
