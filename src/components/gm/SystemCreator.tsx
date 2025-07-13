'use client';

import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { PlusCircle, Trash2, Wand2, Loader2 } from 'lucide-react';
import { generateFormAction } from '@/app/actions';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '../ui/separator';

const attributeSchema = z.object({ name: z.string().min(1, 'Name is required'), description: z.string() });
const skillSchema = z.object({ name: z.string().min(1, 'Name is required'), baseAttribute: z.string().min(1, 'Attribute is required') });
const featSchema = z.object({ name: z.string().min(1, 'Name is required'), description: z.string(), prerequisites: z.string() });

const systemSchema = z.object({
  systemName: z.string().min(1, 'System name is required'),
  attributes: z.array(attributeSchema),
  skills: z.array(skillSchema),
  feats: z.array(featSchema),
});

type SystemFormData = z.infer<typeof systemSchema>;

export function SystemCreator() {
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<SystemFormData>({
    resolver: zodResolver(systemSchema),
    defaultValues: {
      systemName: '',
      attributes: [{ name: 'Strength', description: 'Physical power' }],
      skills: [{ name: 'Athletics', baseAttribute: 'Strength' }],
      feats: [{ name: 'Power Attack', description: 'Trade accuracy for damage', prerequisites: 'Strength 13' }],
    },
  });

  const { fields: attributeFields, append: appendAttribute, remove: removeAttribute } = useFieldArray({
    control: form.control,
    name: 'attributes',
  });

  const { fields: skillFields, append: appendSkill, remove: removeSkill } = useFieldArray({
    control: form.control,
    name: 'skills',
  });

  const { fields: featFields, append: appendFeat, remove: removeFeat } = useFieldArray({
    control: form.control,
    name: 'feats',
  });

  const onSubmit = async (data: SystemFormData) => {
    setIsLoading(true);
    setGeneratedCode(null);
    const result = await generateFormAction(data);
    setIsLoading(false);
    if (result.success && result.data?.formCode) {
      setGeneratedCode(result.data.formCode);
      toast({
        title: "Form Generated Successfully!",
        description: "The React code for your character sheet form is ready.",
      });
    } else {
      toast({
        variant: "destructive",
        title: "Error Generating Form",
        description: result.error || "An unknown error occurred.",
      });
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>System Details</CardTitle>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="systemName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>System Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., D20 Modern" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Attributes</CardTitle>
              <CardDescription>Define the core stats of your system.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {attributeFields.map((field, index) => (
                <div key={field.id} className="flex gap-2 items-end p-3 border rounded-md">
                  <FormField name={`attributes.${index}.name`} control={form.control} render={({ field }) => <FormItem className="flex-1"><FormLabel>Name</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>} />
                  <FormField name={`attributes.${index}.description`} control={form.control} render={({ field }) => <FormItem className="flex-1"><FormLabel>Description</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>} />
                  <Button type="button" variant="destructive" size="icon" onClick={() => removeAttribute(index)}><Trash2 className="h-4 w-4" /></Button>
                </div>
              ))}
              <Button type="button" variant="outline" onClick={() => appendAttribute({ name: '', description: '' })}><PlusCircle className="mr-2 h-4 w-4" /> Add Attribute</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Skills</CardTitle>
              <CardDescription>Define character abilities.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {skillFields.map((field, index) => (
                <div key={field.id} className="flex gap-2 items-end p-3 border rounded-md">
                  <FormField name={`skills.${index}.name`} control={form.control} render={({ field }) => <FormItem className="flex-1"><FormLabel>Name</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>} />
                  <FormField name={`skills.${index}.baseAttribute`} control={form.control} render={({ field }) => <FormItem className="flex-1"><FormLabel>Base Attribute</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>} />
                  <Button type="button" variant="destructive" size="icon" onClick={() => removeSkill(index)}><Trash2 className="h-4 w-4" /></Button>
                </div>
              ))}
              <Button type="button" variant="outline" onClick={() => appendSkill({ name: '', baseAttribute: '' })}><PlusCircle className="mr-2 h-4 w-4" /> Add Skill</Button>
            </CardContent>
          </Card>
          
           <Card>
            <CardHeader>
              <CardTitle>Feats</CardTitle>
              <CardDescription>Special talents characters can acquire.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {featFields.map((field, index) => (
                <div key={field.id} className="flex gap-2 items-end p-3 border rounded-md">
                  <FormField name={`feats.${index}.name`} control={form.control} render={({ field }) => <FormItem className="flex-1"><FormLabel>Name</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>} />
                  <FormField name={`feats.${index}.description`} control={form.control} render={({ field }) => <FormItem className="flex-1"><FormLabel>Description</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>} />
                  <FormField name={`feats.${index}.prerequisites`} control={form.control} render={({ field }) => <FormItem className="flex-1"><FormLabel>Prerequisites</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>} />
                  <Button type="button" variant="destructive" size="icon" onClick={() => removeFeat(index)}><Trash2 className="h-4 w-4" /></Button>
                </div>
              ))}
              <Button type="button" variant="outline" onClick={() => appendFeat({ name: '', description: '', prerequisites: ''})}><PlusCircle className="mr-2 h-4 w-4" /> Add Feat</Button>
            </CardContent>
          </Card>

          <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
            Generate Character Form
          </Button>
        </form>
      </Form>
      
      <div className="space-y-4">
        <h2 className="font-headline text-2xl font-bold">Generated Form Code</h2>
        <Card className="min-h-[400px] bg-muted/30">
          <CardContent className="p-4">
            {isLoading && (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                <Loader2 className="h-16 w-16 animate-spin text-primary mb-4"/>
                <p>Generating your form with GenAI...</p>
                <p className="text-sm">This may take a moment.</p>
              </div>
            )}
            {!isLoading && generatedCode && (
              <pre className="text-sm whitespace-pre-wrap overflow-auto bg-background p-4 rounded-md">
                <code>{generatedCode}</code>
              </pre>
            )}
             {!isLoading && !generatedCode && (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-8 text-center">
                 <Wand2 className="h-16 w-16 text-primary/50 mb-4"/>
                <p>Fill out your system details and click "Generate Character Form" to see the AI-generated React code here.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
