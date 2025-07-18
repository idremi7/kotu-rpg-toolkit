
'use client';

import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { PlusCircle, Trash2, Loader2, Save, Sparkles, ChevronDown, BookOpen } from 'lucide-react';
import { saveSystem, listFeatsFromLibrary } from '@/lib/data-service';
import { suggestSkills } from '@/ai/flows/suggest-skills-flow';
import { suggestFeats } from '@/ai/flows/suggest-feats-flow';
import { useEffect, useState, useMemo } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useMounted } from '@/hooks/use-mounted';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { GameSystem, Feat, FeatFromLibrary, CustomRule } from '@/lib/data-service';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetDescription } from '../ui/sheet';
import { ScrollArea } from '../ui/scroll-area';
import { Checkbox } from '../ui/checkbox';
import { Switch } from '../ui/switch';
import { SkillLibraryBrowser } from './SkillLibraryBrowser';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Textarea } from '../ui/textarea';

const attributeSchema = z.object({ name: z.string().min(1, 'Name is required'), description: z.string() });
const skillSchema = z.object({ name: z.string().min(1, 'Name is required'), baseAttribute: z.string().min(1, 'Attribute is required') });
const featSchema = z.object({ name: z.string().min(1, 'Name is required'), description: z.string(), prerequisites: z.string(), effect: z.string().optional() });
const saveSchema = z.object({ name: z.string().min(1, 'Name is required'), baseAttribute: z.string().min(1, 'Attribute is required') });
const customRuleSchema = z.object({ title: z.string().min(1, 'Title is required'), description: z.string().min(1, 'Description is required') });

const systemSchema = z.object({
  systemName: z.string().min(1, 'System name is required'),
  description: z.string().optional(),
  usesD20StyleModifiers: z.boolean().optional(),
  attributes: z.array(attributeSchema).min(1, 'At least one attribute is required.'),
  skills: z.array(skillSchema),
  feats: z.array(featSchema),
  saves: z.array(saveSchema),
  customRules: z.array(customRuleSchema).optional(),
});

type SystemFormData = z.infer<typeof systemSchema>;

interface SystemCreatorProps {
    initialData?: GameSystem;
}

const FeatLibraryBrowser = ({ onAddFeats }: { onAddFeats: (feats: {name: string, description: string, prerequisites: string, effect: string }[]) => void }) => {
    const { toast } = useToast();
    const [selectedFeats, setSelectedFeats] = useState<Record<string, {isSelected: boolean, feat: FeatFromLibrary}>>({});
    const [isOpen, setIsOpen] = useState(false);
    const [allFeats, setAllFeats] = useState<FeatFromLibrary[]>([]);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        if (isOpen && allFeats.length === 0) {
            listFeatsFromLibrary().then(feats => {
                setAllFeats(feats);
            });
        }
    }, [isOpen, allFeats.length]);

    const filteredFeats = useMemo(() => {
        return allFeats.filter(feat => {
            if (!searchQuery) return true;
            const lowercasedQuery = searchQuery.toLowerCase();
            return feat.name.toLowerCase().includes(lowercasedQuery) || 
                   feat.description.toLowerCase().includes(lowercasedQuery);
        });
    }, [searchQuery, allFeats]);
    
    const handleSelectFeat = (feat: FeatFromLibrary, isSelected: boolean) => {
        setSelectedFeats(prev => ({...prev, [feat.name]: { isSelected, feat }}));
    }

    const handleAdd = () => {
        const featsToAdd = Object.values(selectedFeats)
            .filter(val => val.isSelected)
            .map(val => ({ 
                name: val.feat.name,
                description: val.feat.description,
                prerequisites: val.feat.prerequisites,
                effect: val.feat.effect || ''
            }));
        
        onAddFeats(featsToAdd);
        setSelectedFeats({});
        setIsOpen(false);
        setSearchQuery('');
    }

    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
                <Button type="button" variant="secondary"><BookOpen className="mr-2"/>Browse Feat Library</Button>
            </SheetTrigger>
            <SheetContent className="w-full sm:max-w-lg">
                <SheetHeader>
                    <SheetTitle>Feat Library</SheetTitle>
                    <SheetDescription>
                        Browse and select common feats to add to your system.
                    </SheetDescription>
                </SheetHeader>
                <div className="py-4 h-[calc(100%-120px)] flex flex-col">
                    <div className="flex gap-2 mb-4">
                        <Input 
                            placeholder="Search for a feat..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="flex-grow"
                        />
                    </div>
                    <ScrollArea className="flex-grow pr-4">
                       <div className="space-y-2">
                            {filteredFeats.map((feat, index) => (
                                <div key={`${feat.name}-${index}`} className="flex items-center space-x-2 p-2 rounded-md hover:bg-muted/50">
                                    <Checkbox 
                                        id={`lib-feat-${feat.name}-${index}`}
                                        checked={!!selectedFeats[feat.name]?.isSelected}
                                        onCheckedChange={(checked) => handleSelectFeat(feat, !!checked)}
                                    />
                                    <label htmlFor={`lib-feat-${feat.name}-${index}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex-grow">
                                        <div className="flex justify-between">
                                          <span>{feat.name}</span>
                                          <span className="text-xs text-muted-foreground">{feat.prerequisites}</span>
                                        </div>
                                        <p className="text-xs text-muted-foreground">{feat.description}</p>
                                    </label>
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                    <div className="pt-4 border-t mt-auto">
                        <Button onClick={handleAdd} className="w-full" disabled={Object.values(selectedFeats).every(v => !v.isSelected)}>
                            Add Selected Feats
                        </Button>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    )
}

export function SystemCreator({ initialData }: SystemCreatorProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [isSuggestingSkills, setIsSuggestingSkills] = useState(false);
  const [isSuggestingFeats, setIsSuggestingFeats] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const mounted = useMounted();

  const isEditMode = !!initialData;

  const form = useForm<SystemFormData>({
    resolver: zodResolver(systemSchema),
    defaultValues: isEditMode ? {
        systemName: initialData.systemName,
        description: initialData.description,
        usesD20StyleModifiers: initialData.usesD20StyleModifiers,
        attributes: initialData.attributes,
        skills: initialData.skills,
        feats: initialData.feats,
        saves: initialData.saves,
        customRules: initialData.customRules || [],
    } : {
      systemName: '',
      description: '',
      usesD20StyleModifiers: false,
      attributes: [{ name: 'Strength', description: 'Physical power' }],
      skills: [],
      feats: [],
      saves: [],
      customRules: [],
    },
    mode: 'onChange',
  });

  useEffect(() => {
    if (initialData) {
        form.reset({
            systemName: initialData.systemName,
            description: initialData.description,
            usesD20StyleModifiers: initialData.usesD20StyleModifiers,
            attributes: initialData.attributes,
            skills: initialData.skills,
            feats: initialData.feats,
            saves: initialData.saves,
            customRules: initialData.customRules || [],
        });
    }
  }, [initialData, form]);

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

  const { fields: customRuleFields, append: appendCustomRule, remove: removeCustomRule } = useFieldArray({
    control: form.control,
    name: 'customRules',
  });

  const watchedAttributes = form.watch('attributes');
  const watchedSkills = form.watch('skills');
  const watchedFeats = form.watch('feats');
  const validAttributes = watchedAttributes.filter(attr => attr.name && attr.name.trim() !== '');

  const handleSaveSystem = async (data: SystemFormData) => {
    setIsSaving(true);
    const fullData = isEditMode ? { ...initialData, ...data } : data;
    try {
        const result = await saveSystem(fullData as any);
        if (result.success && result.systemId) {
            toast({
            title: `System ${isEditMode ? 'Updated' : 'Saved'}!`,
            description: `${data.systemName} has been successfully ${isEditMode ? 'updated' : 'saved'}.`,
            });
            router.push(`/gm/systems/${result.systemId}`);
        } else {
            toast({
            variant: "destructive",
            title: `Failed to ${isEditMode ? 'update' : 'save'} system`,
            description: result.error || "An unknown error occurred.",
            });
        }
    } catch (error) {
        toast({
            variant: "destructive",
            title: `Failed to ${isEditMode ? 'update' : 'save'} system`,
            description: "An unknown error occurred.",
        });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSuggestSkills = async (count: number) => {
    setIsSuggestingSkills(true);
    const formData = form.getValues();
    try {
      const result = await suggestSkills({
        systemName: formData.systemName,
        attributes: formData.attributes,
        existingSkills: formData.skills.map(s => s.name),
        count: count,
      });
      
      if (result?.skills) {
        appendSkill(result.skills);
        toast({
          title: "Skills Suggested",
          description: `AI has added ${result.skills.length} new skill suggestions.`,
        });
      } else {
        throw new Error("No skills returned from AI.");
      }
    } catch (error: any) {
        toast({
            variant: "destructive",
            title: "Suggestion Failed",
            description: error.message || "Could not get suggestions from AI.",
        });
    } finally {
      setIsSuggestingSkills(false);
    }
  };

  const handleSuggestFeats = async (count: number) => {
    setIsSuggestingFeats(true);
    const formData = form.getValues();
    try {
      const result = await suggestFeats({
        systemName: formData.systemName,
        attributes: formData.attributes,
        existingFeats: formData.feats.map(f => f.name),
        count: count,
      });
      
      if (result?.feats) {
        appendFeat(result.feats);
        toast({
          title: "Feats Suggested",
          description: `AI has added ${result.feats.length} new feat suggestions.`,
        });
      } else {
        throw new Error("No feats returned from AI.");
      }
    } catch (error: any) {
        toast({
            variant: "destructive",
            title: "Suggestion Failed",
            description: error.message || "Could not get suggestions from AI.",
        });
    } finally {
      setIsSuggestingFeats(false);
    }
  };
  
  const handleAddSkillsFromLibrary = (skillsToAdd: { name: string; category: string }[]) => {
    const existingSkillNames = new Set(form.getValues('skills').map(s => s.name.trim().toLowerCase()));
    
    const newSkills = skillsToAdd
        .filter(skill => !existingSkillNames.has(skill.name.trim().toLowerCase()))
        .map(skill => {
            const matchedAttribute = validAttributes.find(attr => attr.name.toLowerCase() === skill.category.toLowerCase());
            return { name: skill.name, baseAttribute: matchedAttribute?.name || '' };
        });
    
    if (newSkills.length > 0) {
        appendSkill(newSkills);
    }

    const newSkillsCount = newSkills.length;
    const duplicatesCount = skillsToAdd.length - newSkillsCount;

    if (newSkillsCount > 0) {
      toast({
        title: "Skills Added",
        description: `${newSkillsCount} new ${newSkillsCount === 1 ? 'skill has' : 'skills have'} been added. ${duplicatesCount > 0 ? `${duplicatesCount} duplicate ${duplicatesCount === 1 ? 'skill was' : 'skills were'} ignored.` : ''}`.trim(),
      });
    } else if (duplicatesCount > 0) {
      toast({
        title: "No New Skills Added",
        description: `All ${duplicatesCount} selected ${duplicatesCount === 1 ? 'skill' : 'skills'} already exist in your system.`,
      });
    }
  };

  const handleAddFeatsFromLibrary = (featsToAdd: Feat[]) => {
      const existingFeatNames = new Set(form.getValues('feats').map(f => f.name.trim().toLowerCase()));
      const newFeats = featsToAdd.filter(feat => !existingFeatNames.has(feat.name.trim().toLowerCase()));

      if (newFeats.length > 0) {
        appendFeat(newFeats);
      }
      
      const duplicatesCount = featsToAdd.length - newFeats.length;
      const newFeatsCount = newFeats.length;

      if (newFeatsCount > 0) {
        toast({
          title: "Feats Added",
          description: `${newFeatsCount} new ${newFeatsCount === 1 ? 'feat' : 'feats'} added. ${duplicatesCount > 0 ? `${duplicatesCount} ${duplicatesCount === 1 ? 'feat was' : 'feats were'} ignored as duplicates.` : ''}`.trim(),
        });
      } else if (duplicatesCount > 0) {
        toast({
          title: "No New Feats Added",
          description: `All ${duplicatesCount} selected ${duplicatesCount === 1 ? 'feat' : 'feats'} already exist in your system.`,
        });
      }
  }

  const skillNames = watchedSkills.map(s => s.name?.trim().toLowerCase()).filter(Boolean);
  const featNames = watchedFeats.map(f => f.name?.trim().toLowerCase()).filter(Boolean);


  return (
    <div className="space-y-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSaveSystem)} className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>System Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="systemName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>System Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Cyber-Fantasy 2088" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                     <FormControl>
                        <Textarea 
                            placeholder="A brief description of your game system's theme, tone, and unique features."
                            {...field}
                         />
                    </FormControl>
                    <FormDescription>
                        This will be shown to players when they choose a system.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="usesD20StyleModifiers"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                      <FormLabel>Use D20-Style Modifiers</FormLabel>
                      <FormDescription>
                        Enable to calculate and display attribute modifiers (e.g., +2) like in D&amp;D.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
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
              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[40%]">Attribute Name</TableHead>
                      <TableHead className="w-[50%]">Description</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {attributeFields.map((field, index) => (
                      <TableRow key={field.id}>
                        <TableCell>
                          <FormField
                            control={form.control}
                            name={`attributes.${index}.name`}
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </TableCell>
                        <TableCell>
                          <FormField
                            control={form.control}
                            name={`attributes.${index}.description`}
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </TableCell>
                        <TableCell className="text-right">
                          <Button type="button" variant="ghost" size="icon" onClick={() => removeAttribute(index)}>
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Delete Attribute</span>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <Button type="button" variant="outline" onClick={() => appendAttribute({ name: '', description: '' })}><PlusCircle className="mr-2 h-4 w-4" /> Add Attribute</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Saves</CardTitle>
              <CardDescription>Define character saving throws.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50%]">Save Name</TableHead>
                      <TableHead className="w-[40%]">Base Attribute</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {saveFields.map((field, index) => (
                      <TableRow key={field.id}>
                        <TableCell>
                          <FormField
                            control={form.control}
                            name={`saves.${index}.name`}
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </TableCell>
                        <TableCell>
                          <FormField
                            control={form.control}
                            name={`saves.${index}.baseAttribute`}
                            render={({ field }) => (
                              <FormItem>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select an attribute" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {validAttributes.map(attr => (
                                      <SelectItem key={attr.name} value={attr.name}>{attr.name}</SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </TableCell>
                        <TableCell className="text-right">
                          <Button type="button" variant="ghost" size="icon" onClick={() => removeSave(index)}>
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Delete Save</span>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <Button type="button" variant="outline" onClick={() => appendSave({ name: '', baseAttribute: '' })}><PlusCircle className="mr-2 h-4 w-4" /> Add Save</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Skills</CardTitle>
              <CardDescription>Define character abilities. You can add them manually or use AI to get suggestions based on your attributes.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50%]">Skill Name</TableHead>
                      <TableHead className="w-[40%]">Base Attribute</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {skillFields.map((field, index) => {
                       const currentSkillName = watchedSkills[index]?.name?.trim().toLowerCase();
                       const isDuplicate = currentSkillName ? skillNames.indexOf(currentSkillName) !== index : false;

                        return (
                            <TableRow key={field.id}>
                                <TableCell className="align-top">
                                <FormField
                                    control={form.control}
                                    name={`skills.${index}.name`}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <Input {...field} placeholder="e.g. Acrobatics" />
                                            </FormControl>
                                            <div className="h-5">
                                                {isDuplicate && (
                                                    <p className="text-sm font-medium text-destructive">
                                                        This skill name already exists.
                                                    </p>
                                                )}
                                                <FormMessage />
                                            </div>
                                        </FormItem>
                                    )}
                                    />
                                </TableCell>
                                <TableCell className="align-top">
                                <FormField
                                    control={form.control}
                                    name={`skills.${index}.baseAttribute`}
                                    render={({ field }) => (
                                        <FormItem>
                                        <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                                            <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select an attribute" />
                                            </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                            {validAttributes.map(attr => (
                                                <SelectItem key={attr.name} value={attr.name}>{attr.name}</SelectItem>
                                            ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                        </FormItem>
                                    )}
                                    />
                                </TableCell>
                                <TableCell className="text-right align-top">
                                <Button type="button" variant="ghost" size="icon" onClick={() => removeSkill(index)}>
                                    <Trash2 className="h-4 w-4" />
                                    <span className="sr-only">Delete Skill</span>
                                </Button>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                  </TableBody>
                </Table>
              </div>
              
              <div className="flex flex-wrap gap-2 pt-2">
                <Button type="button" variant="outline" onClick={() => appendSkill({ name: '', baseAttribute: '' })}><PlusCircle className="mr-2 h-4 w-4" /> Add Skill</Button>
                <SkillLibraryBrowser onAddSkills={handleAddSkillsFromLibrary} />
                 <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button type="button" variant="secondary" disabled={isSuggestingSkills}>
                        {isSuggestingSkills ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                        Suggest with AI
                        <ChevronDown className="ml-2 h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => handleSuggestSkills(1)}>Suggest 1 Skill</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleSuggestSkills(10)}>Suggest 10 Skills</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleSuggestSkills(20)}>Suggest 20 Skills</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Feats</CardTitle>
              <CardDescription>Special talents characters can acquire.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
               <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Prerequisites</TableHead>
                      <TableHead>Effect</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {featFields.map((field, index) => {
                      const currentFeatName = watchedFeats[index]?.name?.trim().toLowerCase();
                      const isDuplicate = currentFeatName ? featNames.indexOf(currentFeatName) !== index : false;

                      return (
                      <TableRow key={field.id} className="items-start">
                        <TableCell className="align-top">
                           <FormField
                              control={form.control}
                              name={`feats.${index}.name`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormControl>
                                    <Input {...field} placeholder="e.g., Power Attack" />
                                  </FormControl>
                                  <div className="h-5">
                                    {isDuplicate && (
                                        <p className="text-sm font-medium text-destructive">
                                            This feat name already exists.
                                        </p>
                                    )}
                                    <FormMessage />
                                  </div>
                                </FormItem>
                              )}
                            />
                        </TableCell>
                        <TableCell className="align-top">
                           <FormField
                              control={form.control}
                              name={`feats.${index}.description`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormControl>
                                    <Input {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                        </TableCell>
                         <TableCell className="align-top">
                           <FormField
                              control={form.control}
                              name={`feats.${index}.prerequisites`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormControl>
                                    <Input {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                        </TableCell>
                         <TableCell className="align-top">
                           <FormField
                              control={form.control}
                              name={`feats.${index}.effect`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormControl>
                                    <Input {...field} placeholder="+2, -10%, etc." />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                        </TableCell>
                        <TableCell className="text-right align-top">
                          <Button type="button" variant="ghost" size="icon" onClick={() => removeFeat(index)}>
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Delete Feat</span>
                          </Button>
                        </TableCell>
                      </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
              <div className="flex flex-wrap gap-2 pt-2">
                <Button type="button" variant="outline" onClick={() => appendFeat({ name: '', description: '', prerequisites: '', effect: '' })}><PlusCircle className="mr-2 h-4 w-4" /> Add Feat</Button>
                <FeatLibraryBrowser onAddFeats={handleAddFeatsFromLibrary} />
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button type="button" variant="secondary" disabled={isSuggestingFeats}>
                        {isSuggestingFeats ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                        Suggest with AI
                        <ChevronDown className="ml-2 h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => handleSuggestFeats(1)}>Suggest 1 Feat</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleSuggestFeats(5)}>Suggest 5 Feats</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleSuggestFeats(10)}>Suggest 10 Feats</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Custom Rules</CardTitle>
              <CardDescription>Add any unique mechanics, world rules, or special conditions for your system.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[30%]">Rule Title</TableHead>
                      <TableHead className="w-[60%]">Description</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {customRuleFields.map((field, index) => (
                      <TableRow key={field.id} className="items-start">
                        <TableCell className="align-top">
                           <FormField
                              control={form.control}
                              name={`customRules.${index}.title`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormControl>
                                    <Input {...field} placeholder="e.g., Sanity Checks" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                        </TableCell>
                        <TableCell className="align-top">
                           <FormField
                              control={form.control}
                              name={`customRules.${index}.description`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormControl>
                                    <Textarea {...field} placeholder="Describe how this rule works..." className="min-h-[40px]"/>
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                        </TableCell>
                        <TableCell className="text-right align-top">
                          <Button type="button" variant="ghost" size="icon" onClick={() => removeCustomRule(index)}>
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Delete Rule</span>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <Button type="button" variant="outline" onClick={() => appendCustomRule({ title: '', description: '' })}><PlusCircle className="mr-2 h-4 w-4" /> Add Custom Rule</Button>
            </CardContent>
          </Card>

          <Button type="submit" disabled={isSaving} className="w-full" size="lg">
            {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            {isEditMode ? 'Update System' : 'Save System'}
          </Button>
        </form>
      </Form>
    </div>
  );
}
