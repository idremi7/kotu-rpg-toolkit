'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { UserPlus, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getSystemAction, saveCharacterAction } from '@/app/actions';
import type { GameSystem } from '@/lib/data-service';
import { useRouter } from 'next/navigation';

const FormFieldRenderer = ({ control, name, fieldConfig, options, fieldType }: any) => {
  const { 'ui:widget': widget, 'ui:label': label } = fieldConfig;

  switch (widget) {
    case 'text':
    case 'number':
      return (
        <FormField
          control={control}
          name={name}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{label}</FormLabel>
              <FormControl>
                <Input
                  type={widget}
                  {...field}
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
            <FormItem>
              <FormLabel>{label}</FormLabel>
              <FormControl>
                <Textarea {...field} />
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
            {options.map((option: string) => (
              <FormField
                key={option}
                control={control}
                name={name}
                render={({ field }) => {
                  const currentValues = Array.isArray(field.value) ? field.value : [];
                  return (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={currentValues.includes(option)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              field.onChange([...currentValues, option]);
                            } else {
                              field.onChange(currentValues.filter((value: string) => value !== option));
                            }
                          }}
                        />
                      </FormControl>
                      <FormLabel className="font-normal">{option}</FormLabel>
                    </FormItem>
                  );
                }}
              />
            ))}
          </div>
        </FormItem>
      );
    default:
      return <p>Unsupported field type: {widget}</p>;
  }
};

export function CharacterCreator({ systemId }: { systemId: string }) {
  const [system, setSystem] = useState<GameSystem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm({
    // We can't use a resolver here because the schema is dynamic
  });
  
  useEffect(() => {
    async function loadSystem() {
      try {
        const loadedSystem = await getSystemAction(systemId);
        if (loadedSystem) {
          setSystem(loadedSystem);
        } else {
          toast({
            variant: 'destructive',
            title: 'System not found',
            description: 'This game system could not be loaded.',
          });
        }
      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'Failed to load system',
          description: 'Check the console for more details.',
        });
        console.error('Failed to load system from server action', error);
      } finally {
        setIsLoading(false);
      }
    }
    loadSystem();
  }, [systemId, toast]);

  useEffect(() => {
    if (system) {
      const defaultValues: any = {};
      const formSchema = JSON.parse(system.schemas.formSchema);
      Object.keys(formSchema.properties).forEach((key) => {
        const prop = formSchema.properties[key];
        if (prop.type === 'object') {
          defaultValues[key] = {};
          Object.keys(prop.properties).forEach(subKey => {
             defaultValues[key][subKey] = prop.properties[subKey].default || 0;
          });
        } else if (prop.type === 'array') {
          defaultValues[key] = [];
        } else {
          defaultValues[key] = prop.default || '';
        }
      });
      form.reset(defaultValues);
    }
  }, [system, form]);

  const onSubmit = async (data: any) => {
    setIsSaving(true);
    const result = await saveCharacterAction(systemId, data);
    
    if (result.success) {
        toast({
            title: "Character Saved!",
            description: `${data.name} has been successfully saved.`
        });
        router.push('/player/dashboard');
    } else {
        toast({
            variant: "destructive",
            title: "Failed to save character",
            description: result.error || "An unknown error occurred."
        });
    }
    setIsSaving(false);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-16">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!system) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-bold">System Not Found</h2>
        <p className="text-muted-foreground">The requested game system could not be found.</p>
      </div>
    );
  }

  const { systemName, skills, feats, saves } = system;
  const uiSchema = JSON.parse(system.schemas.uiSchema);
  const formSchema = JSON.parse(system.schemas.formSchema);

  return (
    <>
      <div className="text-center mb-8">
        <h1 className="font-headline text-4xl font-bold">Forge Your Hero</h1>
        <p className="text-muted-foreground">
          You are creating a character for the <span className="text-primary font-semibold">{systemName}</span>{' '}
          system.
        </p>
      </div>
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
                        <FormFieldRenderer
                          key={subFieldName}
                          control={form.control}
                          name={`${fieldName}.${subFieldName}`}
                          fieldConfig={subFieldConfig}
                        />
                      )
                    )}
                  </CardContent>
                </Card>
              );
            }
            if (fieldName === 'skills' || fieldName === 'feats' || fieldName === 'saves') {
              const options =
                fieldName === 'skills'
                  ? skills.map((s: any) => s.name)
                  : fieldName === 'feats' 
                  ? feats.map((f: any) => f.name)
                  : saves.map((s: any) => s.name);
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
                      options={options}
                    />
                  </CardContent>
                </Card>
              );
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
                    />
                  </CardContent>
                </Card>
              );
            }
            return null;
          })}

          <Button type="submit" size="lg" className="w-full" disabled={isSaving}>
            {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <UserPlus className="mr-2 h-4 w-4" />}
            Create Character
          </Button>
        </form>
      </Form>
    </>
  );
}
