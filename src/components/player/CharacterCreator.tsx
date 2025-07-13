'use client';

import { useEffect, useState } from 'react';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { UserPlus, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// This component will render a form field based on the UI schema
const FormFieldRenderer = ({ control, name, fieldConfig, options }: any) => {
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
                <Input type={widget} {...field} onChange={e => field.onChange(widget === 'number' ? parseInt(e.target.value) || 0 : e.target.value)} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      );
    case 'checkboxes':
        const { fields } = useFieldArray({ control, name });
        return (
            <FormItem>
              <FormLabel>{label}</FormLabel>
              <div className="space-y-2">
                {options.map((option: string) => (
                  <FormField
                    key={option}
                    control={control}
                    name={name}
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(option)}
                            onCheckedChange={(checked) => {
                              return checked
                                ? field.onChange([...field.value, option])
                                : field.onChange(field.value?.filter((value: string) => value !== option));
                            }}
                          />
                        </FormControl>
                        <FormLabel className="font-normal">{option}</FormLabel>
                      </FormItem>
                    )}
                  />
                ))}
              </div>
            </FormItem>
        )
    default:
      return <p>Unsupported field type: {widget}</p>;
  }
};

export function CharacterCreator({ systemId }: { systemId: string }) {
  const [system, setSystem] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    try {
      const savedSystem = localStorage.getItem(`system-${systemId}`);
      if (savedSystem) {
        const parsedSystem = JSON.parse(savedSystem);
        parsedSystem.schemas.formSchema = JSON.parse(parsedSystem.schemas.formSchema);
        parsedSystem.schemas.uiSchema = JSON.parse(parsedSystem.schemas.uiSchema);
        setSystem(parsedSystem);
      } else {
         toast({ variant: "destructive", title: "System not found", description: "This game system could not be loaded." });
      }
    } catch (error) {
       toast({ variant: "destructive", title: "Failed to load system", description: "Check the console for more details." });
       console.error("Failed to parse system from localStorage", error);
    } finally {
        setIsLoading(false);
    }
  }, [systemId, toast]);

  const form = useForm({
      // We can't use a resolver here because the schema is dynamic
  });
  
  const { control, handleSubmit } = form;

  const onSubmit = (data: any) => {
    console.log('Character Created:', data);
    toast({
        title: "Character Created!",
        description: "Your character has been saved. Check the console for data."
    });
  };

  if (isLoading) {
    return <div className="flex justify-center items-center py-16"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }
  
  if (!system) {
    return <div className="text-center py-16">
        <h2 className="text-2xl font-bold">System Not Found</h2>
        <p className="text-muted-foreground">The requested game system could not be found in your local storage.</p>
    </div>;
  }
  
  const { systemName, schemas, skills, feats } = system;
  const { formSchema, uiSchema } = schemas;

  return (
    <>
      <div className="text-center mb-8">
        <h1 className="font-headline text-4xl font-bold">Forge Your Hero</h1>
        <p className="text-muted-foreground">
          You are creating a character for the <span className="text-primary font-semibold">{systemName}</span> system.
        </p>
      </div>
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-3xl mx-auto">
          {Object.entries(uiSchema).map(([fieldName, fieldConfig]: [string, any]) => {
            if (fieldConfig['ui:fieldset']) {
              return (
                 <Card key={fieldName}>
                    <CardHeader><CardTitle>{fieldConfig['ui:label']}</CardTitle></CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {Object.entries(fieldConfig.fields).map(([subFieldName, subFieldConfig]: [string, any]) => (
                            <FormFieldRenderer key={subFieldName} control={control} name={`${fieldName}.${subFieldName}`} fieldConfig={subFieldConfig} />
                        ))}
                    </CardContent>
                </Card>
              )
            }
             if(fieldName === 'skills' || fieldName === 'feats') {
                const options = fieldName === 'skills' ? skills.map((s: any) => s.name) : feats.map((f: any) => f.name);
                 return (
                    <Card key={fieldName}>
                        <CardHeader><CardTitle>{fieldConfig['ui:label']}</CardTitle></CardHeader>
                        <CardContent>
                             <FormFieldRenderer control={control} name={fieldName} fieldConfig={fieldConfig} options={options} />
                        </CardContent>
                    </Card>
                );
            }
            return <FormFieldRenderer key={fieldName} control={control} name={fieldName} fieldConfig={fieldConfig} />
          })}

          <Button type="submit" size="lg" className="w-full">
            <UserPlus className="mr-2 h-4 w-4" />
            Create Character
          </Button>
        </form>
      </Form>
    </>
  );
}
