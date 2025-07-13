export const defaultFormSchema = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      default: '',
    },
    class: {
      type: 'string',
      default: '',
    },
    level: {
      type: 'number',
      default: 1,
    },
    attributes: {
      type: 'object',
      properties: {},
    },
    skills: {
      type: 'array',
      items: {
        type: 'string',
      },
    },
    feats: {
      type: 'array',
      items: {
        type: 'string',
      },
    },
  },
  required: ['name', 'class', 'level'],
};

export const defaultUiSchema = {
  name: {
    'ui:widget': 'text',
    'ui:label': 'Character Name',
  },
  class: {
    'ui:widget': 'text',
    'ui:label': 'Class',
  },
  level: {
    'ui:widget': 'number',
    'ui:label': 'Level',
  },
  attributes: {
    'ui:fieldset': true,
    'ui:label': 'Attributes',
    fields: {},
  },
  skills: {
    'ui:widget': 'checkboxes',
    'ui:label': 'Skills',
  },
  feats: {
    'ui:widget': 'checkboxes',
    'ui:label': 'Feats',
  },
};
