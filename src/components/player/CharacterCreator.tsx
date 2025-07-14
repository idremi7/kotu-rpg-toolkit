
'use client';

import { useEffect, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { UserPlus, Loader2, PlusCircle, Trash2, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getSystemAction, saveCharacterAction } from '@/actions';
import type { GameSystem, Character } from '@/lib/data-service';
import { useRouter } from 'next/navigation';

const CustomSkillWidget = ({ control, name, options }: { control: any, name: string, options: any[] }) => {
  const { fields, append, remove } = useFieldArray({ control, name });
  const datalistId = 'skill-suggestions';

  return (
    <div className="space-y-4">
       <datalist id={datalistId}>
        {options.map((opt: any) => (
          <option key={opt.name} value={opt.name} />
        ))}
      </datalist>
      {fields.map((field, index) => (
        <div key={field.id} className="flex gap-2 items-center">
          <FormField
            control={control}
            name={`${name}.${index}.name`}
            render={({ field }) => (
              <FormItem className="flex-1">
                 <FormControl>
                    <Input 
                        placeholder="Type or select a skill" 
                        list={datalistId}
                        {...field} 
                    />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name={`${name}.${index}.value`}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input 
                    type="number" 
                    className="w-24" 
                    {...field}
                    value={field.value ?? 0}
                    onChange={e => field.onChange(parseInt(e.target.value) || 0)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        onClick={() => append({ name: '', value: 0 })}
      >
        <PlusCircle className="mr-2 h-4 w-4" />
        Add Skill
      </Button>
    </div>
  );
};

const CustomFeatWidget = ({ control, name, options }: { control: any; name: string; options: any[] }) => {
  const { fields, append, remove } = useFieldArray({ control, name });
  const datalistId = 'feat-suggestions';

  return (
    <div className="space-y-4">
      <datalist id={datalistId}>
        {options.map((opt: any) => (
          <option key={opt.name} value={opt.name} />
        ))}
      </datalist>
      <div className="space-y-2">
        {fields.map((field, index) => (
          <div key={field.id} className="flex gap-2 items-end">
            <FormField
              control={control}
              name={`${name}.${index}.name`}
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Feat Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Type or select a feat"
                      list={datalistId}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={control}
              name={`${name}.${index}.effect`}
              render={({ field }) => (
                <FormItem className="flex-1">
                    <FormLabel>Effect</FormLabel>
                    <FormControl>
                        <Input
                        placeholder="e.g., +2 damage, reroll save, etc."
                        {...field}
                        />
                    </FormControl>
                    <FormMessage />
                </FormItem>
              )}
            />
            <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
      <Button type="button" variant="outline" onClick={() => append({ name: '', effect: '' })}>
        <PlusCircle className="mr-2 h-4 w-4" />
        Add Feat
      </Button>
    </div>
  );
};

const NumberFieldRenderer = ({ control, name, label, widget }: any) => (
  <FormField
    control={control}
    name={name}
    render={({ field }) => (
      <FormItem>
        <div className="flex items-center gap-4">
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input
              type={widget}
              className="w-24"
              {...field}
              value={field.value ?? 0}
              onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
            />
          </FormControl>
        </div>
        <FormMessage />
      </FormItem>
    )}
  />
);


const FormFieldRenderer = ({ control, name, fieldConfig, options, fieldType, system }: any) => {
  const { 'ui:widget': widget, 'ui:label': label } = fieldConfig;

  switch (widget) {
    case 'text':
    case 'number':
      return (
        <FormField
          control={control}
          name={name}
          render={({ field }) => (
            <FormItem className="space-y-1">
              <FormLabel>{label}</FormLabel>
              <FormControl>
                <Input
                  type={widget}
                  {...field}
                  value={field.value ?? (widget === 'number' ? 0 : '')}
                  onChange={(e) =>
                    field.onChange(
                      widget === 'number' ? parseInt(e.target.value) || 0 : e.target.value
                    )
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      );
    case 'textarea':
       return (
        <FormField
          control={control}
          name={name}
          render={({ field }) => (
            <FormItem className="space-y-1">
              <FormLabel>{label}</FormLabel>
              <FormControl>
                <Textarea {...field} value={field.value ?? ''} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      );
    case 'custom':
        if (name === 'skills') {
            return <CustomSkillWidget control={control} name="skills" options={system.skills} />;
        }
        if (name === 'feats') {
            return <CustomFeatWidget control={control} name="feats" options={system.feats} />;
        }
        return <p>Unsupported custom field: {name}</p>
    default:
      return <p>Unsupported field type: {widget}</p>;
  }
};

interface CharacterCreatorProps {
    systemId: string;
    system: GameSystem;
    initialCharacter?: Character;
}

export function CharacterCreator({ systemId, system, initialCharacter }: CharacterCreatorProps) {
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const isEditMode = !!initialCharacter;

  const form = useForm({
    // We can't use a resolver here because the schema is dynamic
  });
  
  useEffect(() => {
    if (isEditMode && initialCharacter) {
      const charData = { ...initialCharacter.data };

      // Ensure feats are in object format {name, effect} for the form.
      if (charData.feats && Array.isArray(charData.feats)) {
          charData.feats = charData.feats.map((feat: any) => {
              if (typeof feat === 'string') {
                  return { name: feat, effect: '' };
              }
              return feat;
          });
      }
      form.reset(charData);

    } else if (system) {
      const defaultValues: any = {};
      const formSchema = JSON.parse(system.schemas.formSchema);

      Object.keys(formSchema.properties).forEach((key) => {
        const prop = formSchema.properties[key];
        if (prop.type === 'object') {
          defaultValues[key] = {};
          Object.keys(prop.properties).forEach(subKey => {
             defaultValues[key][subKey] = prop.properties[subKey].default !== undefined ? prop.properties[subKey].default : 0;
          });
        } else if (prop.type === 'array') {
           defaultValues[key] = prop.default !== undefined ? prop.default : [];
        } else {
          defaultValues[key] = prop.default !== undefined ? prop.default : '';
        }
      });
      form.reset(defaultValues);
    }
  }, [system, form, isEditMode, initialCharacter]);

  const onSubmit = async (data: any) => {
    setIsSaving(true);
    
    // Ensure feats are saved correctly, filtering out any empty ones
    const processedData = {
        ...data,
        feats: Array.isArray(data.feats) 
            ? data.feats.filter(feat => typeof feat === 'object' && feat.name && feat.name.trim() !== '')
            : [],
    };

    const characterToSave: Character = {
        characterId: isEditMode ? initialCharacter.characterId : `char_${Date.now()}`,
        systemId,
        data: processedData,
    };

    const result = await saveCharacterAction(characterToSave);
    
    if (result.success && result.characterId) {
        toast({
            title: `Character ${isEditMode ? 'Updated' : 'Created'}!`,
            description: `${data.name} has been successfully saved.`
        });
        router.push(`/player/characters/${result.characterId}`);
    } else {
        toast({
            variant: "destructive",
            title: `Failed to save character`,
            description: result.error || "An unknown error occurred."
        });
    }
    setIsSaving(false);
  };

  const uiSchema = JSON.parse(system.schemas.uiSchema);

  // Define the order of field sections for rendering
  const fieldOrder = [
    'name', 'class', 'level', // Vitals First
    'hp', 'maxHp',
    'attributes',
    'saves',
    'skills',
    'feats',
    'backstory',
  ];

  const renderField = (fieldName: string) => {
    const fieldConfig = uiSchema[fieldName];
    if (!fieldConfig) return null;

    // Render fieldsets (Attributes, Saves)
    if (fieldConfig['ui:fieldset']) {
      return (
        <Card key={fieldName}>
          <CardHeader>
            <CardTitle>{fieldConfig['ui:label']}</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(fieldConfig.fields).map(([subFieldName, subFieldConfig]: [string, any]) => (
              <NumberFieldRenderer
                key={subFieldName}
                control={form.control}
                name={`${fieldName}.${subFieldName}`}
                label={subFieldConfig['ui:label']}
                widget={subFieldConfig['ui:widget']}
              />
            ))}
          </CardContent>
        </Card>
      );
    }

    // Render custom widgets (Skills, Feats)
    if (fieldConfig['ui:widget'] === 'custom') {
      return (
        <Card key={fieldName}>
          <CardHeader><CardTitle>{fieldConfig['ui:label']}</CardTitle></CardHeader>
          <CardContent>
            <FormFieldRenderer
              control={form.control}
              name={fieldName}
              fieldConfig={fieldConfig}
              system={system}
            />
          </CardContent>
        </Card>
      );
    }
    
    // Render standalone fields
    const { 'ui:widget': widget } = fieldConfig;
    if (widget === 'text' || widget === 'number' || widget === 'textarea') {
      return (
        <FormFieldRenderer
          key={fieldName}
          control={form.control}
          name={fieldName}
          fieldConfig={fieldConfig}
          system={system}
        />
      );
    }

    return null;
  };

  // Get all field names from the UI Schema that are not internal config keys
  const allFieldNames = Object.keys(uiSchema).filter(key => !key.startsWith('ui:'));

  // Create a sorted list of fields to render based on `fieldOrder`
  const sortedFields = allFieldNames.sort((a, b) => {
      const indexA = fieldOrder.indexOf(a);
      const indexB = fieldOrder.indexOf(b);
      if (indexA === -1 && indexB === -1) return 0; // both not in order, keep original
      if (indexA === -1) return 1; // a is not in order, move to end
      if (indexB === -1) return -1; // b is not in order, move to end
      return indexA - indexB;
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-3xl mx-auto">
        <Card>
            <CardHeader><CardTitle>Vitals</CardTitle></CardHeader>
            <CardContent className="pt-0 grid grid-cols-1 md:grid-cols-2 gap-4">
                {renderField('name')}
                {renderField('class')}
                {renderField('level')}
                {renderField('hp')}
                {renderField('maxHp')}
            </CardContent>
        </Card>
        
        {sortedFields.map(fieldName => {
            if (['name', 'class', 'level', 'hp', 'maxHp'].includes(fieldName)) return null;
            return renderField(fieldName);
        })}

        <Button type="submit" size="lg" className="w-full" disabled={isSaving}>
          {isSaving ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : isEditMode ? (
            <Save className="mr-2 h-4 w-4" />
          ) : (
            <UserPlus className="mr-2 h-4 w-4" />
          )}
          {isEditMode ? 'Update Character' : 'Create Character'}
        </Button>
      </form>
    </Form>
  );
}
