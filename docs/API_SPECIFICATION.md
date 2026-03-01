# API Specification Reference

This document outlines all API endpoints and data flows needed for VERSA.

## Table of Contents
1. [Endpoint Overview](#endpoint-overview)
2. [System Endpoints](#system-endpoints)
3. [Character Endpoints](#character-endpoints)
4. [Library Endpoints](#library-endpoints)
5. [AI Endpoints](#ai-endpoints)
6. [Import/Export Endpoints](#importexport-endpoints)
7. [Error Handling](#error-handling)
8. [Response Formats](#response-formats)

---

## Endpoint Overview

### Architecture Pattern

The application can be implemented as:

1. **Server-Side Rendered (SSR)** - Next.js pattern
   - Routes are file-based
   - Server functions handle logic
   - No explicit API endpoints needed
   - Direct file system access

2. **API-First** - REST or GraphQL
   - Separate API server
   - Frontend calls API endpoints
   - Better for scaling and microservices
   - Recommended for ports to other languages

### URL Structure (REST Pattern)

```
/api/systems                    # Base systems endpoint
/api/systems                    # POST: Create
/api/systems                    # GET: List all
/api/systems/:systemId          # GET: Retrieve specific
/api/systems/:systemId          # PUT/PATCH: Update
/api/systems/:systemId          # DELETE: Delete
/api/systems/:systemId/export   # GET: Export as JSON

/api/characters                 # Base characters endpoint
/api/characters                 # POST: Create
/api/characters                 # GET: List all
/api/characters/:characterId    # GET: Retrieve specific
/api/characters/:characterId    # PUT/PATCH: Update
/api/characters/:characterId    # DELETE: Delete
/api/characters/:characterId/export # GET: Export as JSON

/api/library/skills             # GET: List skills
/api/library/feats              # GET: List feats


/api/import/system              # POST: Import system
/api/import/character           # POST: Import character
```

---

## System Endpoints

### Create System

**Endpoint:** `POST /api/systems`

**Request Body:**
```json
{
  "systemName": "My Custom System",
  "description": "A custom TTRPG system",
  "usesD20StyleModifiers": true,
  "attributes": [
    {
      "name": "Strength",
      "description": "Physical power"
    },
    {
      "name": "Dexterity",
      "description": "Agility and reflexes"
    }
  ],
  "skills": [
    {
      "name": "Athletics",
      "baseAttribute": "Strength"
    },
    {
      "name": "Acrobatics",
      "baseAttribute": "Dexterity"
    }
  ],
  "saves": [
    {
      "name": "Strength Save",
      "baseAttribute": "Strength"
    }
  ],
  "feats": [
    {
      "name": "Alert",
      "description": "+5 initiative bonus",
      "prerequisites": "None",
      "effect": "+5 Initiative"
    }
  ],
  "customRules": [
    {
      "title": "House Rule 1",
      "description": "Description of the rule"
    }
  ]
}
```

**Response (Success - 201):**
```json
{
  "success": true,
  "systemId": "sys-1762234567890",
  "systemName": "My Custom System",
  "message": "System created successfully"
}
```

**Response (Error - 400):**
```json
{
  "success": false,
  "error": "System name is required",
  "code": "VALIDATION_ERROR"
}
```

**Response (Error - 500):**
```json
{
  "success": false,
  "error": "Failed to save system",
  "code": "INTERNAL_ERROR"
}
```

**Implementation Notes:**
- Validate all required fields
- Generate unique `systemId` if not provided
- Auto-generate `formSchema` and `uiSchema`
- Create directory if needed: `data/systems/`
- Write JSON file: `data/systems/{systemId}.json`

---

### Get System

**Endpoint:** `GET /api/systems/:systemId`

**Response (Success - 200):**
```json
{
  "systemId": "dnd-5e",
  "systemName": "Dungeons & Dragons 5e",
  "description": "D&D 5e ruleset",
  "attributes": [...],
  "skills": [...],
  "saves": [...],
  "feats": [...],
  "customRules": [...],
  "schemas": {
    "formSchema": "...",
    "uiSchema": "..."
  }
}
```

**Response (Error - 404):**
```json
{
  "success": false,
  "error": "System not found",
  "code": "NOT_FOUND"
}
```

---

### List Systems

**Endpoint:** `GET /api/systems`

**Query Parameters:**
- `skip`: Number of results to skip (default: 0)
- `limit`: Maximum results to return (default: 50)
- `search`: Filter by system name (optional)

**Response (Success - 200):**
```json
{
  "success": true,
  "systems": [
    {
      "id": "dnd-5e",
      "name": "Dungeons & Dragons 5e",
      "description": "The world's most popular TTRPG"
    },
    {
      "id": "custom-system",
      "name": "My Custom System",
      "description": "A system I created"
    }
  ],
  "total": 2,
  "skip": 0,
  "limit": 50
}
```

---

### Update System

**Endpoint:** `PUT /api/systems/:systemId` or `PATCH /api/systems/:systemId`

**Request Body:** Same as Create System (full or partial fields for PATCH)

**Response (Success - 200):**
```json
{
  "success": true,
  "systemId": "dnd-5e",
  "message": "System updated successfully"
}
```

---

### Delete System

**Endpoint:** `DELETE /api/systems/:systemId`

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "System deleted successfully"
}
```

**Response (Error - 404):**
```json
{
  "success": false,
  "error": "System not found",
  "code": "NOT_FOUND"
}
```

**Implementation Notes:**
- Delete the system file: `data/systems/{systemId}.json`
- Optional: Delete all characters using this system

---

### Export System

**Endpoint:** `GET /api/systems/:systemId/export`

**Response (Success - 200):**
- Content-Type: `application/json`
- File name: `{systemName}.json`
- Body: Complete system JSON

---

## Character Endpoints

### Create Character

**Endpoint:** `POST /api/characters`

**Request Body:**
```json
{
  "systemId": "dnd-5e",
  "data": {
    "name": "Aragorn",
    "class": "Fighter",
    "level": 5,
    "attributes": {
      "Strength": 18,
      "Dexterity": 14,
      "Constitution": 16,
      "Intelligence": 10,
      "Wisdom": 13,
      "Charisma": 12
    },
    "skills": [
      {
        "name": "Athletics",
        "value": 6
      }
    ],
    "feats": ["Alert"],
    "backstory": "A ranger seeking truth"
  }
}
```

**Response (Success - 201):**
```json
{
  "success": true,
  "characterId": "char-1762234567890",
  "systemId": "dnd-5e",
  "message": "Character created successfully"
}
```

**Validation:**
- Verify `systemId` exists
- Validate character data against system's schema
- Ensure required fields are present
- Check attribute values are within reasonable range

---

### Get Character

**Endpoint:** `GET /api/characters/:characterId`

**Response (Success - 200):**
```json
{
  "characterId": "char-1762234567890",
  "systemId": "dnd-5e",
  "data": {
    "name": "Aragorn",
    "class": "Fighter",
    "level": 5,
    "derived": { "StrengthMod": 4, "shortSwordAttack": 10 },
    ...
  }
}
```

---

### List Characters

**Endpoint:** `GET /api/characters`

**Query Parameters:**
- `systemId`: Filter by system (optional)
- `skip`: Number of results to skip (default: 0)
- `limit`: Maximum results to return (default: 50)
- `search`: Filter by character name (optional)

**Response (Success - 200):**
```json
{
  "success": true,
  "characters": [
    {
      "characterId": "char-1",
      "systemId": "dnd-5e",
      "data": { "name": "Aragorn", ... }
    },
    {
      "characterId": "char-2",
      "systemId": "dnd-5e",
      "data": { "name": "Gimli", ... }
    }
  ],
  "total": 2,
  "systemId": "dnd-5e"
}
```

---

### Update Character

**Endpoint:** `PUT /api/characters/:characterId` or `PATCH /api/characters/:characterId`

**Request Body:**
```json
{
  "data": {
    "level": 6,
    "experience": 50000
  }
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "characterId": "char-1762234567890",
  "message": "Character updated successfully"
}
```

---

### Delete Character

**Endpoint:** `DELETE /api/characters/:characterId`

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Character deleted successfully"
}
```

---

### Export Character

**Endpoint:** `GET /api/characters/:characterId/export`

**Response:**
- Content-Type: `application/json`
- File name: `{characterName}.json`
- Body: Complete character JSON

---

## Library Endpoints

### List Skills

**Endpoint:** `GET /api/library/skills`

**Query Parameters:**
- `category`: Filter by category/attribute (optional)
- `search`: Search skills by name (optional)
- `language`: Filter by language code (optional, default: "en")

**Response (Success - 200):**
```json
{
  "success": true,
  "skills": [
    {
      "name": "Acrobatics",
      "category": "Dexterity",
      "description": "Perform daring feats of balance..."
    },
    {
      "name": "Animal Handling",
      "category": "Wisdom",
      "description": "Calm, train, and interact with animals..."
    }
  ],
  "total": 52
}
```

---

### List Feats

**Endpoint:** `GET /api/library/feats`

**Query Parameters:**
- `category`: Filter by category (optional)
- `search`: Search feats by name (optional)
- `language`: Filter by language code (optional, default: "en")
- `prerequisites`: Include only feats with prerequisites (optional boolean)

**Response (Success - 200):**
```json
{
  "success": true,
  "feats": [
    {
      "name": "Alert",
      "description": "You gain a +5 bonus to initiative...",
      "prerequisites": "None",
      "category": "General",
      "effect": "+5 Initiative"
    }
  ],
  "total": 47
}
```

---

## AI Endpoints

### Suggest Skills


**Request Body:**
```json
{
  "attributes": [
    {
      "name": "Strength",
      "description": "Physical power"
    },
    {
      "name": "Intelligence",
      "description": "Mental acuity"
    }
  ],
  "count": 5
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "suggestions": [
    {
      "name": "Athletics",
      "baseAttribute": "Strength",
      "reasoning": "Natural fit for a strength-focused system"
    },
    {
      "name": "Investigation",
      "baseAttribute": "Intelligence",
      "reasoning": "Useful for problem-solving"
    }
  ]
}
```

**Response (Error - 503):**
```json
{
  "success": false,
  "error": "AI service unavailable",
  "code": "AI_SERVICE_ERROR",
  "fallback": [
    { "name": "Basic Skill 1", "baseAttribute": "Strength" }
  ]
}
```

---

### Suggest Feats


**Request Body:**
```json
{
  "attributes": [
    {
      "name": "Dexterity",
      "description": "Agility"
    }
  ],
  "existingFeats": ["Alert"],
  "count": 3
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "suggestions": [
    {
      "name": "Combat Reflexes",
      "description": "Make additional attacks of opportunity",
      "prerequisites": "Dex 13",
      "effect": "More AoOs",
      "reasoning": "Complements the Alert feat for combat effectiveness"
    }
  ]
}
```

---

## Import/Export Endpoints

### Import System

**Endpoint:** `POST /api/import/system`

**Request Body:**
- Content-Type: `multipart/form-data`
- Field: `file` (JSON file containing system)
- OR Content-Type: `application/json` with system data

**Response (Success - 201):**
```json
{
  "success": true,
  "systemId": "imported-system-123",
  "systemName": "Imported System",
  "message": "System imported successfully"
}
```

---

### Import Character

**Endpoint:** `POST /api/import/character`

**Request Body:**
- Content-Type: `multipart/form-data`
- Field: `file` (JSON file containing character)
- Field: `systemId` (which system the character belongs to)
- OR Content-Type: `application/json`

**Response (Success - 201):**
```json
{
  "success": true,
  "characterId": "imported-char-456",
  "systemId": "dnd-5e",
  "message": "Character imported successfully"
}
```

---

## Error Handling

### Standard Error Codes

```
VALIDATION_ERROR (400)
  - Missing required fields
  - Invalid field values
  - Schema validation failed

NOT_FOUND (404)
  - System/character doesn't exist
  - File not found

CONFLICT (409)
  - Duplicate system ID
  - Character already exists

INTERNAL_ERROR (500)
  - File system error
  - Unexpected server error

AI_SERVICE_ERROR (503)
  - AI service unavailable
  - Rate limited
```

### Error Response Format

```json
{
  "success": false,
  "error": "Human-readable error message",
  "code": "ERROR_CODE",
  "details": {
    "field": "fieldName",
    "reason": "Detailed explanation"
  }
}
```

---

## Response Formats

### Success Response

```json
{
  "success": true,
  "data": { ... },
  "message": "Optional message"
}
```

### Error Response

```json
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE",
  "timestamp": "2024-02-28T10:30:00Z"
}
```

### List Response

```json
{
  "success": true,
  "data": [ ... ],
  "total": 25,
  "skip": 0,
  "limit": 10,
  "hasMore": true
}
```

---

## Implementation Guidelines

### For Server-Side Rendering (Next.js Pattern)

1. Create route handlers in `/app/api/`
2. Use server-side functions to access file system
3. Validate inputs before processing
4. Return JSON responses with appropriate status codes
5. Handle errors gracefully

### For REST API (Recommended for Ports)

1. Create separate API server
2. Implement all endpoints listed above
3. Use middleware for:
   - Input validation
   - Error handling
   - Logging
   - CORS if needed
4. Implement proper HTTP status codes
5. Add API documentation (Swagger/OpenAPI)

### Rate Limiting

For production:
- Implement rate limiting on AI endpoints
- Limit file upload size (suggest: 10MB)
- Limit number of systems/characters per user

### Validation

Every endpoint should:
1. Validate input
2. Check system/character existence before operations
3. Validate character data against system schema
4. Handle special characters in JSON data

### File System Requirements

- Read/write permissions on `data/` directory
- Atomic writes (use temp files during write)
- JSON parsing with proper error handling
- Backup strategy for important data

---

## Database Alternative

If using a SQL database instead of files:

```sql
-- Systems table
CREATE TABLE systems (
  id VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  version VARCHAR(50),
  uses_d20_modifiers BOOLEAN DEFAULT FALSE,
  attributes JSON,
  skills JSON,
  saves JSON,
  feats JSON,
  custom_rules JSON,
  classes JSON,
  races JSON,
  backgrounds JSON,
  magic_system JSON,
  equipment JSON,
  form_schema JSON,
  ui_schema JSON,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

-- Characters table
CREATE TABLE characters (
  id VARCHAR(255) PRIMARY KEY,
  system_id VARCHAR(255) NOT NULL,
  character_data JSON,
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  FOREIGN KEY (system_id) REFERENCES systems(id)
);
```

The DataProvider interface remains the same; only the implementation changes.
