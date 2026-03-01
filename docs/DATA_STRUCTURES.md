# Data Structures & Examples

This document provides concrete examples of data structures used in VERSA.

> **New in recent versions:**
> *Systems* may now declare a `calculatedFields` array describing numeric formulas that
> derive from attributes, skills, and arbitrary bonus keys. When characters are saved,
> the engine evaluates those formulas and stores the results under `character.data.derived`.
> The preview UI also recomputes values on-the-fly when editing.


## Table of Contents
1. [Complete System Example](#complete-system-example)
2. [Character Examples](#character-examples)
3. [Generated Schemas](#generated-schemas)
4. [Library Data](#library-data)

---

## Complete System Example

### D&D 5e System (dnd-5e.json)

```json
{
  "systemId": "dnd-5e",
  "systemName": "Dungeons & Dragons 5e",
  "description": "The fifth edition of the world's most popular tabletop role-playing game.",
  "version": "1.0.0",
  "usesD20StyleModifiers": true,
  
  "attributes": [
    {
      "id": "attr-str",
      "name": "Strength",
      "description": "Measures bodily power, athletic training, and the extent to which you can exert raw physical force."
    },
    {
      "id": "attr-dex",
      "name": "Dexterity",
      "description": "Measures agility, reflexes, and balance."
    },
    {
      "id": "attr-con",
      "name": "Constitution",
      "description": "Measures health, stamina, and vital force."
    },
    {
      "id": "attr-int",
      "name": "Intelligence",
      "description": "Measures mental acuity, accuracy of recall, and the ability to reason."
    },
    {
      "id": "attr-wis",
      "name": "Wisdom",
      "description": "Measures your attunement to the world, perceptiveness, and intuition."
    },
    {
      "id": "attr-cha",
      "name": "Charisma",
      "description": "Measures your ability to interact effectively with others, force of personality, and social influence."
    }
  ],
  
  "skills": [
    {
      "id": "skill-acro",
      "name": "Acrobatics",
      "baseAttribute": "Dexterity"
    },
    {
      "id": "skill-anim",
      "name": "Animal Handling",
      "baseAttribute": "Wisdom"
    },
    {
      "id": "skill-arca",
      "name": "Arcana",
      "baseAttribute": "Intelligence"
    },
    {
      "id": "skill-athl",
      "name": "Athletics",
      "baseAttribute": "Strength"
    },
    {
      "id": "skill-dece",
      "name": "Deception",
      "baseAttribute": "Charisma"
    },
    {
      "id": "skill-hist",
      "name": "History",
      "baseAttribute": "Intelligence"
    },
    {
      "id": "skill-insi",
      "name": "Insight",
      "baseAttribute": "Wisdom"
    },
    {
      "id": "skill-inti",
      "name": "Intimidation",
      "baseAttribute": "Charisma"
    },
    {
      "id": "skill-inve",
      "name": "Investigation",
      "baseAttribute": "Intelligence"
    },
    {
      "id": "skill-medi",
      "name": "Medicine",
      "baseAttribute": "Wisdom"
    }
  ],
  
  "saves": [
    {
      "id": "save-str",
      "name": "Strength Save",
      "baseAttribute": "Strength"
    },
    {
      "id": "save-dex",
      "name": "Dexterity Save",
      "baseAttribute": "Dexterity"
    },
    {
      "id": "save-con",
      "name": "Constitution Save",
      "baseAttribute": "Constitution"
    },
    {
      "id": "save-int",
      "name": "Intelligence Save",
      "baseAttribute": "Intelligence"
    },
    {
      "id": "save-wis",
      "name": "Wisdom Save",
      "baseAttribute": "Wisdom"
    },
    {
      "id": "save-cha",
      "name": "Charisma Save",
      "baseAttribute": "Charisma"
    }
  ],
  
  "feats": [
    {
      "id": "feat-alert",
      "name": "Alert",
      "description": "You gain a +5 bonus to initiative. You can't be surprised while you are conscious. Other creatures don't gain advantage on attack rolls against you as a result of being unseen by you.",
      "prerequisites": "",
      "effect": "+5 Initiative"
    },
    {
      "id": "feat-gwm",
      "name": "Great Weapon Master",
      "description": "Before you make a melee attack with a heavy weapon that you are proficient with, you can choose to take a -5 penalty to the attack roll. If the attack hits, you add +10 to the attack's damage.",
      "prerequisites": "Proficiency with a heavy weapon",
      "effect": "-5 Hit, +10 Dmg"
    },
    {
      "id": "feat-lucky",
      "name": "Lucky",
      "description": "You have 3 luck points. Whenever you make an attack roll, an ability check, or a saving throw, you can spend one luck point to roll an additional d20.",
      "prerequisites": "",
      "effect": "3 Luck Points"
    }
  ],
  
  "customRules": [
    {
      "title": "Advantage and Disadvantage",
      "description": "When you have advantage, you roll two d20s and take the higher result. When you have disadvantage, you roll two d20s and take the lower result."
    },
    {
      "title": "Proficiency Bonus",
      "description": "Your proficiency bonus is determined by your character level: Levels 1-4 = +2, Levels 5-8 = +3, Levels 9-12 = +4, etc."
    }
  ],
  
  "schemas": {
    "formSchema": "{\"type\":\"object\",\"properties\":{\"name\":{\"type\":\"string\",\"default\":\"\"},\"class\":{\"type\":\"string\",\"default\":\"\"},\"level\":{\"type\":\"number\",\"default\":1},\"attributes\":{\"type\":\"object\",\"properties\":{\"Strength\":{\"type\":\"number\",\"default\":10},\"Dexterity\":{\"type\":\"number\",\"default\":10},\"Constitution\":{\"type\":\"number\",\"default\":10},\"Intelligence\":{\"type\":\"number\",\"default\":10},\"Wisdom\":{\"type\":\"number\",\"default\":10},\"Charisma\":{\"type\":\"number\",\"default\":10}}},\"skills\":{\"type\":\"array\",\"default\":[],\"items\":{\"type\":\"object\",\"properties\":{\"name\":{\"type\":\"string\"},\"value\":{\"type\":\"number\",\"default\":0}}}},\"feats\":{\"type\":\"array\",\"default\":[],\"items\":{\"type\":\"string\"}},\"backstory\":{\"type\":\"string\",\"default\":\"\"}},\"required\":[\"name\",\"class\",\"level\"]}",
    "uiSchema": "{\"name\":{\"ui:widget\":\"text\",\"ui:label\":\"Character Name\"},\"class\":{\"ui:widget\":\"text\",\"ui:label\":\"Class\"},\"level\":{\"ui:widget\":\"number\",\"ui:label\":\"Level\"},\"attributes\":{\"ui:fieldset\":true,\"ui:label\":\"Attributes\",\"fields\":{\"Strength\":{\"ui:widget\":\"number\",\"ui:label\":\"Strength\"},\"Dexterity\":{\"ui:widget\":\"number\",\"ui:label\":\"Dexterity\"},\"Constitution\":{\"ui:widget\":\"number\",\"ui:label\":\"Constitution\"},\"Intelligence\":{\"ui:widget\":\"number\",\"ui:label\":\"Intelligence\"},\"Wisdom\":{\"ui:widget\":\"number\",\"ui:label\":\"Wisdom\"},\"Charisma\":{\"ui:widget\":\"number\",\"ui:label\":\"Charisma\"}}},\"skills\":{\"ui:widget\":\"custom\",\"ui:label\":\"Skills\"},\"feats\":{\"ui:widget\":\"custom\",\"ui:label\":\"Feats\"},\"backstory\":{\"ui:widget\":\"textarea\",\"ui:label\":\"Backstory\"}}"
  }
}
```

### Simple Custom System Example

```json
{
  "systemId": "hero-points-2024",
  "systemName": "Hero Points RPG",
  "description": "A simple point-based RPG system for heroic adventures.",
  "version": "1.0.0",
  
  "attributes": [
    {
      "name": "Power",
      "description": "Your physical and magical force"
    },
    {
      "name": "Speed",
      "description": "Your quickness and reflexes"
    },
    {
      "name": "Mind",
      "description": "Your intellect and wisdom"
    }
  ],
  
  "skills": [
    {
      "name": "Combat",
      "baseAttribute": "Power"
    },
    {
      "name": "Dodge",
      "baseAttribute": "Speed"
    },
    {
      "name": "Magic",
      "baseAttribute": "Mind"
    }
  ],
  
  "saves": [
    {
      "name": "Physical Resistance",
      "baseAttribute": "Power"
    },
    {
      "name": "Mental Resistance",
      "baseAttribute": "Mind"
    }
  ],
  
  "feats": [
    {
      "name": "Swift Strike",
      "description": "Attack twice in a single turn",
      "prerequisites": "Speed 5",
      "effect": "+1 action"
    }
  ],
  
  "customRules": [
    {
      "title": "Hero Points",
      "description": "You start with 5 hero points per session. Spend them to reroll dice or activate special abilities."
    }
  ],
  
  "schemas": {
    "formSchema": "{...}",
    "uiSchema": "{...}"
  }
}
```

---

## Character Examples

### D&D 5e Character (English)

```json
{
  "characterId": "char-1762234567890",
  "systemId": "dnd-5e",
  "data": {
    "name": "Aragorn Stormborn",
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
    "saves": {
      "Strength Save": 6,
      "Dexterity Save": 4,
      "Constitution Save": 5,
      "Intelligence Save": 0,
      "Wisdom Save": 1,
      "Charisma Save": 1
    },
    "skills": [
      {
        "name": "Athletics",
        "value": 6
      },
      {
        "name": "Perception",
        "value": 3
      }
    ],
    "feats": [
      "Alert",
      "Great Weapon Master"
    ],
    "backstory": "A ranger who discovered his noble heritage, seeking to unite the kingdoms against darkness.",
    "derived": {
      "StrengthMod": 4,
      "DexterityMod": 2,
      "Athletics": 6,
      "Perception": 3,
      "shortSwordAttack": 10
    }
  }
}
```

### D100 Modern Sci-Fi Character (French)

```json
{
  "characterId": "char_1752530425755",
  "systemId": "d100-modern-sci-fi-",
  "data": {
    "name": "Testy",
    "class": "Canard guerrier",
    "level": 5,
    "attributes": {
      "Force": 10,
      "Dextérité": 10,
      "Constitution": 10,
      "Vitesse": 10,
      "Intelligence": 10,
      "Sagesse": 10,
      "Charisme": 10
    },
    "saves": {
      "Brute force": 5,
      "Équilibre": 5,
      "Vigueur": 5,
      "Réflexe": 5,
      "Intuition": 5,
      "Volonté": 5,
      "Magnetisme": 5
    },
    "skills": [
      {
        "name": "Corps à corps",
        "value": 18
      },
      {
        "name": "Athlétisme",
        "value": 18
      },
      {
        "name": "Esquive",
        "value": 18
      },
      {
        "name": "Informatique",
        "value": 18
      }
    ],
    "feats": [
      "Maîtrise de l'esquive",
      "Maîtrise de l'informatique"
    ],
    "backstory": "C'est un canard intelligent qui décide de devenir guerrier."
  }
}
```

### Minimal Character

```json
{
  "characterId": "char-1762111111111",
  "systemId": "hero-points-2024",
  "data": {
    "name": "Nova",
    "power": 7,
    "speed": 8,
    "mind": 5
  }
}
```

---

## Generated Schemas

### Form Schema (JSON Schema Format)

Automatically generated from system definition:

```json
{
  "type": "object",
  "properties": {
    "name": {
      "type": "string",
      "description": "Character name"
    },
    "level": {
      "type": "number",
      "default": 1,
      "minimum": 1
    },
    "attributes": {
      "type": "object",
      "properties": {
        "Strength": {
          "type": "number",
          "default": 10
        },
        "Dexterity": {
          "type": "number",
          "default": 10
        }
      }
    },
    "skills": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "name": { "type": "string" },
          "value": { "type": "number" }
        }
      }
    },
    "feats": {
      "type": "array",
      "items": { "type": "string" }
    },
    "backstory": {
      "type": "string"
    }
  },
  "required": ["name", "level"]
}
```

### UI Schema (JSON UI Schema Format)

Automatically generated to control form rendering:

```json
{
  "name": {
    "ui:widget": "text",
    "ui:label": "Character Name",
    "ui:placeholder": "Enter character name"
  },
  "level": {
    "ui:widget": "number",
    "ui:label": "Level"
  },
  "attributes": {
    "ui:fieldset": true,
    "ui:label": "Core Attributes",
    "ui:description": "Set your character's core abilities"
  },
  "skills": {
    "ui:widget": "custom",
    "ui:label": "Skills"
  },
  "feats": {
    "ui:widget": "custom",
    "ui:label": "Feats"
  },
  "backstory": {
    "ui:widget": "textarea",
    "ui:label": "Character Backstory",
    "ui:rows": 5
  }
}
```

---

## Library Data

### Skill Library (skill-library.json)

```json
[
  {
    "name": "Acrobatics",
    "category": "Dexterity",
    "description": "Perform daring feats of balance, agility, and coordination."
  },
  {
    "name": "Animal Handling",
    "category": "Wisdom",
    "description": "Calm, train, and interact with animals."
  },
  {
    "name": "Arcana",
    "category": "Intelligence",
    "description": "Recall lore about spells, magic items, and magical traditions."
  },
  {
    "name": "Athletics",
    "category": "Strength",
    "description": "Perform physical activities like climbing, jumping, and swimming."
  },
  {
    "name": "Bluff",
    "category": "Charisma",
    "description": "Deceive others through misdirection and falsehoods."
  }
]
```

### Feat Library (feat-library.json) - Multi-Language

```json
[
  {
    "name": "Acrobatic",
    "description": "You gain a +2 bonus on Acrobatics checks.",
    "prerequisites": "Dex 13",
    "category": "General",
    "effect": "+2 Acrobatics",
    "lang": "en"
  },
  {
    "name": "Acrobatique",
    "description": "Vous obtenez un bonus de +2 aux tests d'Acrobaties.",
    "prerequisites": "Dex 13",
    "category": "Général",
    "effect": "+2 Acrobaties",
    "lang": "fr"
  },
  {
    "name": "Alert",
    "description": "You gain a +5 bonus to initiative.",
    "prerequisites": "None",
    "category": "General",
    "effect": "+5 Initiative",
    "lang": "en"
  },
  {
    "name": "Vigilance",
    "description": "Vous obtenez un bonus de +5 aux tests d'initiative.",
    "prerequisites": "Aucun",
    "category": "Général",
    "effect": "+5 Initiative",
    "lang": "fr"
  }
]
```

---

## Schema Generation Algorithm

When a system is created or updated, generate schemas as follows:

### Generate Form Schema

```
1. Start with base object structure
2. Add "name" field (string, required)
3. Add "attributes" as object property:
   - For each attribute in system:
     - Add property with attribute name: number, default 10
4. Add "saves" as object property:
   - Similar to attributes, default to 0
5. Add "skills" as array:
   - Each item has: name (string), value (number, default 0)
6. Add "feats" as array:
   - Each item is a string (feat name)
7. Add "backstory" as string (optional)
8. Add other system-specific fields
9. Mark as required: name, plus any other critical fields
10. Stringify to JSON and store in schemas.formSchema
```

### Generate UI Schema

```
1. Add ui:label and ui:widget for each field
2. Group related fields:
   - "attributes" → ui:fieldset: true
   - "saves" → ui:fieldset: true
3. Use appropriate widgets:
   - Text fields → "text" widget
   - Numbers → "number" widget
   - Strings→ "string" widget
   - Arrays with custom rendering → "custom" widget
   - Long text → "textarea" widget
4. Add helpful descriptions and placeholders
5. Stringify to JSON and store in schemas.uiSchema
```

---

## Data File Location Summary

When implementing file system storage:

```
DATA_ROOT/
├── systems/
│   ├── {systemId}.json              # System definitions
│   ├── dnd-5e.json
│   ├── dnd-3-5.json
│   └── user-custom-system.json
├── characters/
│   ├── {characterId}.json           # Character data
│   ├── char_1752530425755.json
│   └── user-character.json
├── feat-library.json                # Global feat library
└── skill-library.json               # Global skill library
```

All JSON files should be pretty-printed (indented) for human readability.
