
'use client';

import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { PlusCircle, Trash2, Loader2, Save, Sparkles } from 'lucide-react';
import { saveSystemAction, suggestSkillsAction } from '@/app/actions';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

const attributeSchema = z.object({ name: z.string().min(1, 'Name is required'), description: z.string() });
const skillSchema = z.object({ name: z.string().min(1, 'Name is required'), baseAttribute: z.string().min(1, 'Attribute is required') });
const featSchema = z.object({ name: z.string().min(1, 'Name is required'), description: z.string(), prerequisites: z.string() });
const saveSchema = z.object({ name: z.string().min(1, 'Name is required'), baseAttribute: z.string().min(1, 'Attribute is required') });

const systemSchema = z.object({
  systemName: z.string().min(1, 'System name is required'),
  attributes: z.array(attributeSchema).min(1, 'At least one attribute is required.'),
  skills: z.array(skillSchema),
  feats: z.array(featSchema),
  saves: z.array(saveSchema),
});

type SystemFormData = z.infer<typeof systemSchema>;

export function SystemCreator() {
  const [isSaving, setIsSaving] = useState(false);
  const [isSuggestingSkills, setIsSuggestingSkills] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<SystemFormData>({
    resolver: zodResolver(systemSchema),
    defaultValues: {
      systemName: '',
      attributes: [{ name: 'Strength', description: 'Physical power' }],
      skills: [{ name: 'Athletics', baseAttribute: 'Strength' }],
      feats: [{ name: 'Power Attack', description: 'Trade accuracy for damage', prerequisites: 'Strength 13' }],
      saves: [{ name: 'Fortitude', baseAttribute: 'Constitution' }],
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

   const { fields: saveFields, append: appendSave, remove: removeSave } = useFieldArray({
    control: form.control,
    name: 'saves',
  });


  const handleSaveSystem = async (data: SystemFormData) => {
    setIsSaving(true);
    try {
        const result = await saveSystemAction(data as any);
        if (result.success && result.systemId) {
            toast({
            title: "System Saved!",
            description: `${data.systemName} has been successfully saved.`,
            });
            router.push(`/gm/systems/${result.systemId}`);
        } else {
            toast({
            variant: "destructive",
            title: "Failed to save system",
            description: result.error || "An unknown error occurred while saving the system.",
            });
        }
    } catch (error) {
        toast({
            variant: "destructive",
            title: "Failed to save system",
            description: "An unknown error occurred while saving the system.",
        });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSuggestSkills = async () => {
    setIsSuggestingSkills(true);
    const formData = form.getValues();
    const result = await suggestSkillsAction({
      systemName: formData.systemName,
      attributes: formData.attributes,
    });
    
    if (result.success && result.skills) {
      removeSkill(); // clear existing skills
      appendSkill(result.skills);
      toast({
        title: "Skills Suggested",
        description: "AI has added a list of suggested skills.",
      });
    } else {
      toast({
        variant: "destructive",
        title: "Suggestion Failed",
        description: result.error || "Could not get suggestions from AI.",
      });
    }
    
    setIsSuggestingSkills(false);
  };


  return (
    <div className="space-y-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSaveSystem)} className="space-y-8">
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
                  <FormField
                    control={form.control}
                    name={`attributes.${index}.name`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`attributes.${index}.description`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="button" variant="destructive" size="icon" onClick={() => removeAttribute(index)}><Trash2 className="h-4 w-4" /></Button>
                </div>
              ))}
              <Button type="button" variant="outline" onClick={() => appendAttribute({ name: '', description: '' })}><PlusCircle className="mr-2 h-4 w-4" /> Add Attribute</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Saves</CardTitle>
              <CardDescription>Define character saving throws.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {saveFields.map((field, index) => (
                <div key={field.id} className="flex gap-2 items-end p-3 border rounded-md">
                  <FormField
                    control={form.control}
                    name={`saves.${index}.name`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`saves.${index}.baseAttribute`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Base Attribute</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="button" variant="destructive" size="icon" onClick={() => removeSave(index)}><Trash2 className="h-4 w-4" /></Button>
                </div>
              ))}
              <Button type="button" variant="outline" onClick={() => appendSave({ name: '', baseAttribute: '' })}><PlusCircle className="mr-2 h-4 w-4" /> Add Save</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Skills</CardTitle>
              <CardDescription>Define character abilities. You can add them manually or use AI to get suggestions based on your attributes.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {skillFields.map((field, index) => (
                <div key={field.id} className="flex gap-2 items-end p-3 border rounded-md">
                  <FormField
                    control={form.control}
                    name={`skills.${index}.name`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`skills.${index}.baseAttribute`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Base Attribute</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="button" variant="destructive" size="icon" onClick={() => removeSkill(index)}><Trash2 className="h-4 w-4" /></Button>
                </div>
              ))}
              <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={() => appendSkill({ name: '', baseAttribute: '' })}><PlusCircle className="mr-2 h-4 w-4" /> Add Skill</Button>
                <Button type="button" variant="secondary" onClick={handleSuggestSkills} disabled={isSuggestingSkills}>
                  {isSuggestingSkills ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                  Suggest with AI
                </Button>
              </div>
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
                  <FormField
                    control={form.control}
                    name={`feats.${index}.name`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`feats.${index}.description`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`feats.${index}.prerequisites`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Prerequisites</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="button" variant="destructive" size="icon" onClick={() => removeFeat(index)}><Trash2 className="h-4 w-4" /></Button>
                </div>
              ))}
              <Button type="button" variant="outline" onClick={() => appendFeat({ name: '', description: '', prerequisites: '' })}><PlusCircle className="mr-2 h-4 w-4" /> Add Feat</Button>
            </CardContent>
          </Card>
          <Button type="submit" disabled={isSaving} className="w-full" size="lg">
            {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            Save System
          </Button>
        </form>
      </Form>
    </div>
  );
}
