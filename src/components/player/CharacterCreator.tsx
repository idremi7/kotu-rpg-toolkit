'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { CharacterSheetPreview } from './CharacterSheetPreview';
import { Check, UserPlus } from 'lucide-react';
import { Separator } from '../ui/separator';
import { Label } from '../ui/label';

const characterSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  class: z.string().min(1, 'Class is required.'),
  level: z.coerce.number().min(1).max(20),
  attributes: z.object({
    strength: z.coerce.number().min(3).max(20),
    dexterity: z.coerce.number().min(3).max(20),
    constitution: z.coerce.number().min(3).max(20),
    intelligence: z.coerce.number().min(3).max(20),
    wisdom: z.coerce.number().min(3).max(20),
    charisma: z.coerce.number().min(3).max(20),
  }),
  skills: z.array(z.string()),
  feats: z.array(z.string()),
  backstory: z.string().optional(),
});

type CharacterFormData = z.infer<typeof characterSchema>;

const availableSkills = ['Acrobatics', 'Stealth', 'Athletics', 'Arcana', 'History', 'Persuasion'];
const availableFeats = ['Power Attack', 'Toughness', 'Improved Initiative', 'Cleave'];

export function CharacterCreator({ systemId }: { systemId: string }) {
  const form = useForm<CharacterFormData>({
    resolver: zodResolver(characterSchema),
    defaultValues: {
      name: '',
      class: '',
      level: 1,
      attributes: { strength: 10, dexterity: 10, constitution: 10, intelligence: 10, wisdom: 10, charisma: 10 },
      skills: [],
      feats: [],
      backstory: '',
    },
  });

  const characterData = form.watch();

  const onSubmit = (data: CharacterFormData) => {
    console.log('Character Created:', data);
    alert('Character created successfully! Check the console for data.');
  };
  
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
      <div className="lg:col-span-3">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Card>
              <CardHeader><CardTitle>Basic Information</CardTitle></CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField control={form.control} name="name" render={({ field }) => <FormItem><FormLabel>Character Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>} />
                <FormField control={form.control} name="class" render={({ field }) => <FormItem><FormLabel>Class</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>} />
                <FormField control={form.control} name="level" render={({ field }) => <FormItem><FormLabel>Level</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>Attributes</CardTitle><CardDescription>Assign attribute scores (3-20).</CardDescription></CardHeader>
              <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {Object.keys(form.getValues('attributes')).map((attr) => (
                  <FormField key={attr} control={form.control} name={`attributes.${attr as keyof CharacterFormData['attributes']}`} render={({ field }) => <FormItem><FormLabel className="capitalize">{attr}</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>} />
                ))}
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader><CardTitle>Skills</CardTitle></CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="skills"
                    render={() => (
                      <FormItem className="space-y-3">
                        {availableSkills.map((skill) => (
                          <FormField
                            key={skill}
                            control={form.control}
                            name="skills"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(skill)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([...field.value, skill])
                                        : field.onChange(field.value?.filter((value) => value !== skill));
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal">{skill}</FormLabel>
                              </FormItem>
                            )}
                          />
                        ))}
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
              <Card>
                <CardHeader><CardTitle>Feats</CardTitle></CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="feats"
                    render={() => (
                      <FormItem className="space-y-3">
                        {availableFeats.map((feat) => (
                          <FormField
                            key={feat}
                            control={form.control}
                            name="feats"
                            render={({ field }) => (
                               <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(feat)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([...field.value, feat])
                                        : field.onChange(field.value?.filter((value) => value !== feat));
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal">{feat}</FormLabel>
                              </FormItem>
                            )}
                          />
                        ))}
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader><CardTitle>Backstory</CardTitle></CardHeader>
              <CardContent>
                 <FormField control={form.control} name="backstory" render={({ field }) => <FormItem><FormLabel>Character Backstory</FormLabel><FormControl><Textarea placeholder="Describe your character's history..." {...field} /></FormControl><FormMessage /></FormItem>} />
              </CardContent>
            </Card>

            <Button type="submit" size="lg" className="w-full">
                <UserPlus className="mr-2 h-4 w-4"/>
                Create Character
            </Button>
          </form>
        </Form>
      </div>

      <div className="lg:col-span-2">
        <div className="sticky top-20">
          <CharacterSheetPreview data={characterData} onPrint={handlePrint} />
        </div>
      </div>
    </div>
  );
}
