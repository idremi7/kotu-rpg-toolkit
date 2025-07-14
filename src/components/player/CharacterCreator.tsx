
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
    case 'checkboxes':
      return (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <div className="space-y-2">
            {options.map((option: any) => (
              <FormField
                key={option.name}
                control={control}
                name={name}
                render={({ field }) => {
                  const currentValues = Array.isArray(field.value) ? field.value : [];
                  return (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={currentValues.includes(option.name)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              field.onChange([...currentValues, option.name]);
                            } else {
                              field.onChange(currentValues.filter((value: string) => value !== option.name));
                            }
                          }}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="font-normal">{option.name}</FormLabel>
                         <p className="text-sm text-muted-foreground">{option.description}</p>
                         {option.effect && <p className="text-xs text-primary font-mono">{option.effect}</p>}
                      </div>
                    </FormItem>
                  );
                }}
              />
            ))}
          </div>
        </FormItem>
      );
    case 'custom':
        if (name === 'skills') {
            return <CustomSkillWidget control={control} name="skills" options={system.skills} />;
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
        form.reset(initialCharacter.data);
    } else if (system) {
      const defaultValues: any = {};
      const formSchema = JSON.parse(system.schemas.formSchema);

      // Override attribute defaults to 0
      if (formSchema.properties.attributes && formSchema.properties.attributes.properties) {
          Object.keys(formSchema.properties.attributes.properties).forEach(attrKey => {
              formSchema.properties.attributes.properties[attrKey].default = 0;
          });
      }

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
    
    const characterToSave: Character = {
        characterId: isEditMode ? initialCharacter.characterId : `char_${Date.now()}`,
        systemId,
        data,
    }

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

  const { feats } = system;
  const uiSchema = JSON.parse(system.schemas.uiSchema);

  return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-3xl mx-auto">
          {Object.entries(uiSchema).map(([fieldName, fieldConfig]: [string, any]) => {
            if (fieldConfig['ui:fieldset']) {
              return (
                <Card key={fieldName}>
                  <CardHeader>
                    <CardTitle>{fieldConfig['ui:label']}</CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(fieldConfig.fields).map(
                      ([subFieldName, subFieldConfig]: [string, any]) => (
                        <NumberFieldRenderer
                          key={subFieldName}
                          control={form.control}
                          name={`${fieldName}.${subFieldName}`}
                          label={subFieldConfig['ui:label']}
                          widget={subFieldConfig['ui:widget']}
                        />
                      )
                    )}
                  </CardContent>
                </Card>
              );
            }
             if (fieldName === 'feats') {
              return (
                <Card key={fieldName}>
                  <CardHeader>
                    <CardTitle>{fieldConfig['ui:label']}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <FormFieldRenderer
                      control={form.control}
                      name={fieldName}
                      fieldConfig={fieldConfig}
                      options={feats}
                      system={system}
                    />
                  </CardContent>
                </Card>
              );
            }
             if (fieldName === 'skills' && fieldConfig['ui:widget'] === 'custom') {
                 return (
                    <Card key={fieldName}>
                        <CardHeader><CardTitle>{fieldConfig['ui:label']}</CardTitle></CardHeader>
                        <CardContent>
                            <FormFieldRenderer
                                control={form.control}
                                name={fieldName}
                                fieldConfig={fieldConfig}
                                options={null} // Pass skills from system object
                                system={system}
                            />
                        </CardContent>
                    </Card>
                 )
             }
            // Render standalone fields
            const { 'ui:widget': widget } = fieldConfig;
            if (widget === 'text' || widget === 'number' || widget === 'textarea') {
              return (
                <Card key={fieldName}>
                  <CardContent className="pt-6">
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
            return null;
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
