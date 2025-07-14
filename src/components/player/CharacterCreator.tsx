
'use client';

import { useEffect, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { UserPlus, Loader2, PlusCircle, Trash2, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { saveCharacterAction } from '@/actions';
import type { GameSystem, Character } from '@/lib/data-service';
import { useRouter } from 'next/navigation';

const CustomSkillWidget = ({ control, name, options }: { control: any, name: string, options: any[] }) => {
  const { fields, append, remove } = useFieldArray({ control, name });
  const datalistId = 'skill-suggestions';

  return (
    <div className="space-y-4">
       <datalist id={datalistId}>
        {options.map((opt: any, index: number) => (
          <option key={`${opt.name}-${index}`} value={opt.name} />
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
        {options.map((opt: any, index: number) => (
          <option key={`${opt.name}-${index}`} value={opt.name} />
        ))}
      </datalist>
      <div className="space-y-2">
        {fields.map((field, index) => (
          <div key={field.id} className="flex flex-col sm:flex-row gap-2 items-start sm:items-end">
            <FormField
              control={control}
              name={`${name}.${index}.name`}
              render={({ field }) => (
                <FormItem className="flex-1 w-full">
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
                <FormItem className="flex-1 w-full">
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

const NumberFieldRenderer = ({ control, name, label }: any) => (
  <FormField
    control={control}
    name={name}
    render={({ field }) => (
      <FormItem>
        <div className="flex items-center justify-start gap-4">
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input
              type="number"
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

const FormFieldRenderer = ({ control, name, fieldConfig, system }: any) => {
  const { 'ui:widget': widget, 'ui:label': label, 'ui:fieldset': isFieldset, fields } = fieldConfig;

  if (isFieldset) {
      return (
          <Card>
              <CardHeader><CardTitle>{label}</CardTitle></CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.entries(fields).map(([subFieldName, subFieldConfig]: [string, any]) => (
                    <NumberFieldRenderer
                      key={subFieldName}
                      control={control}
                      name={`${name}.${subFieldName}`}
                      label={subFieldConfig['ui:label']}
                    />
                  ))}
              </CardContent>
          </Card>
      );
  }

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
        return (
            <Card>
                <CardHeader><CardTitle>{label}</CardTitle></CardHeader>
                <CardContent>
                    {name === 'skills' && <CustomSkillWidget control={control} name="skills" options={system.skills} />}
                    {name === 'feats' && <CustomFeatWidget control={control} name="feats" options={system.feats} />}
                </CardContent>
            </Card>
        );
    default:
      return null;
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
    let defaultValues: any = {};
    if (system?.schemas?.formSchema) {
      const formSchema = JSON.parse(system.schemas.formSchema);
      Object.keys(formSchema.properties).forEach((key) => {
        const prop = formSchema.properties[key];
        if (prop.default !== undefined) {
          defaultValues[key] = prop.default;
        } else if (prop.type === 'object') {
          defaultValues[key] = {};
          Object.keys(prop.properties).forEach(subKey => {
            defaultValues[key][subKey] = prop.properties[subKey].default ?? 0;
          });
        }
      });
    }

    if (isEditMode && initialCharacter?.data) {
        let charData = JSON.parse(JSON.stringify(initialCharacter.data));

        // Retro-compatibility for vitals
        if (charData.hp !== undefined && charData.maxHp !== undefined && !charData.vitals) {
            charData.vitals = { hp: charData.hp, maxHp: charData.maxHp };
        }

        if (charData.feats && Array.isArray(charData.feats)) {
            charData.feats = charData.feats.map((feat: any) => 
                typeof feat === 'string' ? { name: feat, effect: '' } : (feat || { name: '', effect: ''})
            );
        } else {
            charData.feats = [];
        }
        if (!charData.skills || !Array.isArray(charData.skills)) {
            charData.skills = [];
        }
        
        defaultValues = { ...defaultValues, ...charData };
    }
    
    form.reset(defaultValues);
  }, [system, isEditMode, initialCharacter, form]);

  const onSubmit = async (data: any) => {
    setIsSaving(true);
    
    const processedData = {
        ...data,
        feats: Array.isArray(data.feats) 
            ? data.feats.filter((feat: any) => typeof feat === 'object' && feat.name && feat.name.trim() !== '')
            : [],
        skills: Array.isArray(data.skills)
            ? data.skills.filter((skill: any) => typeof skill === 'object' && skill.name && skill.name.trim() !== '')
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

  if (!system?.schemas?.uiSchema) {
    return (
      <div className="flex justify-center items-center">
        <Loader2 className="h-8 w-8 animate-spin" />
        <p className="ml-2">Loading character sheet template...</p>
      </div>
    );
  }

  const uiSchema = JSON.parse(system.schemas.uiSchema);

  // Define the order of fields and group them logically
  const topLevelFields = ['name', 'class', 'level'];
  const fieldsets = Object.entries(uiSchema)
    .filter(([, config]: [string, any]) => config['ui:fieldset'])
    .map(([name, config]) => ({ name, config }));
  const customWidgets = Object.entries(uiSchema)
    .filter(([, config]: [string, any]) => config['ui:widget'] === 'custom')
    .map(([name, config]) => ({ name, config }));
  const backstoryField = uiSchema.backstory ? { name: 'backstory', config: uiSchema.backstory } : null;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-4xl mx-auto">
        
        <Card>
            <CardHeader><CardTitle>Character Details</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {topLevelFields.map(fieldName => uiSchema[fieldName] && (
                    <FormFieldRenderer
                        key={fieldName}
                        control={form.control}
                        name={fieldName}
                        fieldConfig={uiSchema[fieldName]}
                        system={system}
                    />
                ))}
            </CardContent>
        </Card>

        <Card>
            <CardHeader><CardTitle>Vitals</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <NumberFieldRenderer control={form.control} name="vitals.hp" label="Current HP" />
                <NumberFieldRenderer control={form.control} name="vitals.maxHp" label="Maximum HP" />
            </CardContent>
        </Card>

        {fieldsets.map(({ name, config }) => (
            <FormFieldRenderer
                key={name}
                control={form.control}
                name={name}
                fieldConfig={config}
                system={system}
            />
        ))}

        {customWidgets.map(({ name, config }) => (
            <FormFieldRenderer
                key={name}
                control={form.control}
                name={name}
                fieldConfig={config}
                system={system}
            />
        ))}
        
        {backstoryField && (
            <FormFieldRenderer
                key={backstoryField.name}
                control={form.control}
                name={backstoryField.name}
                fieldConfig={backstoryField.config}
                system={system}
            />
        )}

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
