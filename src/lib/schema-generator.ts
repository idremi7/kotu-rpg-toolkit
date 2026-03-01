/**
 * @fileOverview Dynamically generates JSON Schema and UI Schema from GameSystem structure
 * Eliminates duplication and makes schemas maintainable & auto-updating
 */

import type { GameSystem } from '@/lib/data/data-provider';

export interface FormFieldConfig {
  fieldName: string;
  type: 'string' | 'number' | 'textarea' | 'array' | 'group';
  label: string;
  required?: boolean;
  default?: any;
  groupType?: 'fieldset' | 'tabs';
  fields?: FormFieldConfig[];
  itemSchema?: Record<string, any>;
}

/**
 * Generate form configuration from a game system definition
 * This becomes the single source of truth for form structure
 */
export function generateFormConfig(system: GameSystem): FormFieldConfig[] {
  const fields: FormFieldConfig[] = [
    {
      fieldName: 'name',
      type: 'string',
      label: 'Character Name',
      required: true,
      default: ''
    },
    {
      fieldName: 'class',
      type: 'string',
      label: 'Class',
      required: true,
      default: ''
    },
    {
      fieldName: 'level',
      type: 'number',
      label: 'Level',
      required: true,
      default: 1
    }
  ];

  // Generate Attributes fieldset
  if (system.attributes && system.attributes.length > 0) {
    fields.push({
      fieldName: 'attributes',
      type: 'group',
      label: 'Attributes',
      groupType: 'fieldset',
      fields: system.attributes.map(attr => ({
        fieldName: attr.name,
        type: 'number',
        label: attr.name,
        default: 10
      }))
    });
  }

  // Generate Saves fieldset
  if (system.saves && system.saves.length > 0) {
    fields.push({
      fieldName: 'saves',
      type: 'group',
      label: 'Saves',
      groupType: 'fieldset',
      fields: system.saves.map(save => ({
        fieldName: save.name,
        type: 'number',
        label: save.name,
        default: 0
      }))
    });
  }

  // Generate Skills array field
  if (system.skills && system.skills.length > 0) {
    fields.push({
      fieldName: 'skills',
      type: 'array',
      label: 'Skills',
      itemSchema: {
        name: { type: 'string', label: 'Skill Name' },
        value: { type: 'number', label: 'Bonus', default: 0 }
      }
    });
  }

  // Generate Feats array field
  if (system.feats && system.feats.length > 0) {
    fields.push({
      fieldName: 'feats',
      type: 'array',
      label: 'Feats',
      itemSchema: {
        name: { type: 'string', label: 'Feat Name' },
        effect: { type: 'string', label: 'Effect' }
      }
    });
  }

  // Generate Vitals fieldset if we'll use it
  fields.push({
    fieldName: 'vitals',
    type: 'group',
    label: 'Vitals',
    groupType: 'fieldset',
    fields: [
      {
        fieldName: 'hp',
        type: 'number',
        label: 'Current HP',
        default: 0
      },
      {
        fieldName: 'maxHp',
        type: 'number',
        label: 'Maximum HP',
        default: 0
      }
    ]
  });

  // Backstory textarea at the end
  fields.push({
    fieldName: 'backstory',
    type: 'textarea',
    label: 'Backstory',
    default: ''
  });

  return fields;
}

/**
 * Convert FormFieldConfig to JSON Schema (JSON Schema Draft 7)
 * Used for validation and some form libraries
 */
export function formConfigToJsonSchema(
  config: FormFieldConfig[]
): Record<string, any> {
  const properties: Record<string, any> = {};
  const required: string[] = [];

  config.forEach(field => {
    if (field.type === 'group' && field.fields) {
      const groupProps: Record<string, any> = {};
      field.fields.forEach(subField => {
        groupProps[subField.fieldName] = {
          type: mapTypeToJsonSchema(subField.type),
          default: subField.default ?? null
        };
      });
      properties[field.fieldName] = {
        type: 'object',
        properties: groupProps
      };
    } else if (field.type === 'array' && field.itemSchema) {
      properties[field.fieldName] = {
        type: 'array',
        default: [],
        items: {
          type: 'object',
          properties: field.itemSchema
        }
      };
    } else {
      properties[field.fieldName] = {
        type: mapTypeToJsonSchema(field.type),
        default: field.default ?? null
      };
    }

    if (field.required) {
      required.push(field.fieldName);
    }
  });

  return {
    type: 'object',
    properties,
    required
  };
}

/**
 * Convert FormFieldConfig to UI Schema (for react-hook-form + custom UI)
 * Used by CharacterCreator and other form renderers
 */
export function formConfigToUiSchema(
  config: FormFieldConfig[]
): Record<string, any> {
  const uiSchema: Record<string, any> = {};

  config.forEach(field => {
    if (field.type === 'group' && field.fields) {
      uiSchema[field.fieldName] = {
        'ui:fieldset': true,
        'ui:label': field.label,
        fields: {}
      };
      field.fields.forEach(subField => {
        uiSchema[field.fieldName].fields[subField.fieldName] = {
          'ui:widget': mapTypeToWidget(subField.type),
          'ui:label': subField.label
        };
      });
    } else if (field.type === 'array') {
      uiSchema[field.fieldName] = {
        'ui:widget': 'custom',
        'ui:label': field.label
      };
    } else {
      uiSchema[field.fieldName] = {
        'ui:widget': mapTypeToWidget(field.type),
        'ui:label': field.label
      };
    }
  });

  return uiSchema;
}

/**
 * Map our internal type to JSON Schema type
 */
function mapTypeToJsonSchema(type: string): string {
  const typeMap: Record<string, string> = {
    string: 'string',
    number: 'number',
    textarea: 'string',
    array: 'array',
    group: 'object'
  };
  return typeMap[type] || 'string';
}

/**
 * Map our internal type to UI widget
 */
function mapTypeToWidget(type: string): string {
  const widgetMap: Record<string, string> = {
    string: 'text',
    number: 'number',
    textarea: 'textarea',
    array: 'custom',
    group: 'fieldset'
  };
  return widgetMap[type] || 'text';
}

/**
 * Generate all schemas in one call (convenience)
 */
export function generateAllSchemas(system: GameSystem) {
  const formConfig = generateFormConfig(system);
  const formSchema = formConfigToJsonSchema(formConfig);
  const uiSchema = formConfigToUiSchema(formConfig);

  return {
    formConfig,
    formSchema: JSON.stringify(formSchema),
    uiSchema: JSON.stringify(uiSchema)
  };
}
