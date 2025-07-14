
'use client';

import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { PlusCircle, Trash2, Loader2, Save, Sparkles, ChevronDown, BookOpen } from 'lucide-react';
import { listFeatsFromLibraryAction, listSkillsFromLibraryAction, saveSystemAction, suggestSkillsAction } from '@/actions';
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
import type { GameSystem, SkillFromLibrary, FeatFromLibrary } from '@/lib/data-service';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '../ui/sheet';
import { ScrollArea } from '../ui/scroll-area';
import { Checkbox } from '../ui/checkbox';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';

const attributeSchema = z.object({ name: z.string().min(1, 'Name is required'), description: z.string() });
const skillSchema = z.object({ name: z.string().min(1, 'Name is required'), baseAttribute: z.string().min(1, 'Attribute is required') });
const featSchema = z.object({ name: z.string().min(1, 'Name is required'), description: z.string(), prerequisites: z.string(), effect: z.string().optional() });
const saveSchema = z.object({ name: z.string().min(1, 'Name is required'), baseAttribute: z.string().min(1, 'Attribute is required') });

const systemSchema = z.object({
  systemName: z.string().min(1, 'System name is required'),
  attributes: z.array(attributeSchema).min(1, 'At least one attribute is required.'),
  skills: z.array(skillSchema),
  feats: z.array(featSchema),
  saves: z.array(saveSchema),
});

type SystemFormData = z.infer<typeof systemSchema>;

interface SystemCreatorProps {
    initialData?: GameSystem;
}

const LanguageToggle = ({ selectedLang, onLangChange }: { selectedLang: 'en' | 'fr' | 'all', onLangChange: (lang: 'en' | 'fr' | 'all') => void }) => {
    return (
        <div className="flex justify-center gap-2 my-2">
            <Button size="sm" variant={selectedLang === 'en' ? 'default' : 'outline'} onClick={() => onLangChange('en')}>English</Button>
            <Button size="sm" variant={selectedLang === 'fr' ? 'default' : 'outline'} onClick={() => onLangChange('fr')}>Français</Button>
            <Button size="sm" variant={selectedLang === 'all' ? 'default' : 'outline'} onClick={() => onLangChange('all')}>All</Button>
        </div>
    );
};

const SkillLibraryBrowser = ({ onAddSkills }: { onAddSkills: (skills: {name: string, category: string}[]) => void }) => {
    const { toast } = useToast();
    const [selectedSkills, setSelectedSkills] = useState<Record<string, {isSelected: boolean, category: string}>>({});
    const [isOpen, setIsOpen] = useState(false);
    const [allSkills, setAllSkills] = useState<SkillFromLibrary[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [lang, setLang] = useState<'en' | 'fr' | 'all'>('en');

    useEffect(() => {
        if (isOpen && allSkills.length === 0) {
            listSkillsFromLibraryAction().then(skills => {
                setAllSkills(skills);
            });
        }
    }, [isOpen, allSkills.length]);

    const filteredSkills = useMemo(() => {
        return allSkills.filter(skill => {
            const langMatch = lang === 'all' || skill.lang === lang;
            if (!langMatch) return false;

            if (!searchQuery) return true;

            const lowercasedQuery = searchQuery.toLowerCase();
            return skill.name.toLowerCase().includes(lowercasedQuery) || 
                   skill.description.toLowerCase().includes(lowercasedQuery);
        });
    }, [searchQuery, allSkills, lang]);
    
    const handleSelectSkill = (skillName: string, category: string, isSelected: boolean) => {
        setSelectedSkills(prev => ({...prev, [skillName]: { isSelected, category }}));
    }

    const handleAdd = () => {
        const skillsToAdd = Object.entries(selectedSkills)
            .filter(([,val]) => val.isSelected)
            .map(([name, { category }]) => ({ name, category }));
        
        onAddSkills(skillsToAdd);
        toast({
            title: "Skills Added",
            description: `${skillsToAdd.length} skills were added from the library. Please assign a base attribute if needed.`
        });
        setSelectedSkills({});
        setIsOpen(false);
        setSearchQuery('');
    }

    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
                <Button type="button" variant="secondary"><BookOpen className="mr-2"/>Browse Skill Library</Button>
            </SheetTrigger>
            <SheetContent className="w-full sm:max-w-lg">
                <SheetHeader>
                    <SheetTitle>Skill Library</SheetTitle>
                    <SheetDescription>
                        Browse and select common skills to add to your system.
                    </SheetDescription>
                </SheetHeader>
                <div className="py-4 h-[calc(100%-120px)] flex flex-col">
                    <Input 
                        placeholder="Search skills..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="mb-2"
                    />
                    <LanguageToggle selectedLang={lang} onLangChange={setLang} />
                    <ScrollArea className="flex-grow pr-4">
                       <div className="space-y-2">
                            {filteredSkills.map(skill => (
                                <div key={`${skill.name}-${skill.lang}`} className="flex items-center space-x-2 p-2 rounded-md hover:bg-muted/50">
                                    <Checkbox 
                                        id={`lib-${skill.name}-${skill.lang}`}
                                        checked={!!selectedSkills[skill.name]?.isSelected}
                                        onCheckedChange={(checked) => handleSelectSkill(skill.name, skill.category, !!checked)}
                                    />
                                    <label htmlFor={`lib-${skill.name}-${skill.lang}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex-grow">
                                        <div className="flex justify-between">
                                          <span>{skill.name}</span>
                                          <span className="text-xs text-muted-foreground">{skill.category}</span>
                                        </div>
                                    </label>
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                    <div className="pt-4 border-t mt-auto">
                        <Button onClick={handleAdd} className="w-full" disabled={Object.values(selectedSkills).every(v => !v.isSelected)}>
                            Add Selected Skills
                        </Button>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    )
}

const FeatLibraryBrowser = ({ onAddFeats }: { onAddFeats: (feats: {name: string, description: string, prerequisites: string, effect: string }[]) => void }) => {
    const { toast } = useToast();
    const [selectedFeats, setSelectedFeats] = useState<Record<string, {isSelected: boolean, feat: FeatFromLibrary}>>({});
    const [isOpen, setIsOpen] = useState(false);
    const [allFeats, setAllFeats] = useState<FeatFromLibrary[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [lang, setLang] = useState<'en' | 'fr' | 'all'>('en');

    useEffect(() => {
        if (isOpen && allFeats.length === 0) {
            listFeatsFromLibraryAction().then(feats => {
                setAllFeats(feats);
            });
        }
    }, [isOpen, allFeats.length]);

    const filteredFeats = useMemo(() => {
        return allFeats.filter(feat => {
            const langMatch = lang === 'all' || feat.lang === lang;
            if (!langMatch) return false;

            if (!searchQuery) return true;

            const lowercasedQuery = searchQuery.toLowerCase();
            return feat.name.toLowerCase().includes(lowercasedQuery) || 
                   feat.description.toLowerCase().includes(lowercasedQuery);
        });
    }, [searchQuery, allFeats, lang]);
    
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
        toast({
            title: "Feats Added",
            description: `${featsToAdd.length} feats were added from the library.`
        });
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
                    <Input 
                        placeholder="Search for a feat..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="mb-2"
                    />
                    <LanguageToggle selectedLang={lang} onLangChange={setLang} />
                    <ScrollArea className="flex-grow pr-4">
                       <div className="space-y-2">
                            {filteredFeats.map((feat, index) => (
                                <div key={`${feat.name}-${feat.lang}-${index}`} className="flex items-center space-x-2 p-2 rounded-md hover:bg-muted/50">
                                    <Checkbox 
                                        id={`lib-feat-${feat.name}-${feat.lang}-${index}`}
                                        checked={!!selectedFeats[feat.name]?.isSelected}
                                        onCheckedChange={(checked) => handleSelectFeat(feat, !!checked)}
                                    />
                                    <label htmlFor={`lib-feat-${feat.name}-${feat.lang}-${index}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex-grow">
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
  const { toast } = useToast();
  const router = useRouter();
  const mounted = useMounted();

  const isEditMode = !!initialData;

  const form = useForm<SystemFormData>({
    resolver: zodResolver(systemSchema),
    defaultValues: isEditMode ? {
        systemName: initialData.systemName,
        attributes: initialData.attributes,
        skills: initialData.skills,
        feats: initialData.feats,
        saves: initialData.saves,
    } : {
      systemName: '',
      attributes: [{ name: 'Strength', description: 'Physical power' }],
      skills: [{ name: 'Athletics', baseAttribute: 'Strength' }],
      feats: [{ name: 'Power Attack', description: 'Trade accuracy for damage', prerequisites: 'Strength 13', effect: '-5 Hit, +5 Dmg' }],
      saves: [{ name: 'Fortitude', baseAttribute: 'Constitution' }],
    },
  });

  useEffect(() => {
    if (initialData) {
        form.reset({
            systemName: initialData.systemName,
            attributes: initialData.attributes,
            skills: initialData.skills,
            feats: initialData.feats,
            saves: initialData.saves,
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

  const watchedAttributes = form.watch('attributes');
  const validAttributes = watchedAttributes.filter(attr => attr.name && attr.name.trim() !== '');

  const groupedSkills = useMemo(() => {
    return skillFields.reduce((acc, skill, index) => {
      const baseAttribute = form.getValues(`skills.${index}.baseAttribute`) || 'Unassigned';
      if (!acc[baseAttribute]) {
        acc[baseAttribute] = [];
      }
      acc[baseAttribute].push({ ...skill, originalIndex: index });
      return acc;
    }, {} as Record<string, (typeof skillFields[0] & { originalIndex: number })[]>);
  }, [skillFields, form.watch('skills')]);

  const orderedSkillGroups = useMemo(() => {
    const attributeOrder = validAttributes.map(attr => attr.name);
    const orderedGroups = attributeOrder
        .filter(attrName => groupedSkills[attrName])
        .map(attrName => ({
            attribute: attrName,
            skills: groupedSkills[attrName],
        }));

    if (groupedSkills['Unassigned']) {
        orderedGroups.push({
            attribute: 'Unassigned',
            skills: groupedSkills['Unassigned'],
        });
    }
    return orderedGroups;
  }, [groupedSkills, validAttributes]);


  const handleSaveSystem = async (data: SystemFormData) => {
    setIsSaving(true);
    try {
        const result = await saveSystemAction(data as any);
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
    const result = await suggestSkillsAction({
      systemName: formData.systemName,
      attributes: formData.attributes,
      existingSkills: formData.skills.map(s => s.name),
      count: count,
    });
    
    if (result.success && result.skills) {
      appendSkill(result.skills);
      toast({
        title: "Skills Suggested",
        description: `AI has added ${result.skills.length} new skill suggestions.`,
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
  
  if (!mounted) {
    return null;
  }
  
  const handleAddSkillsFromLibrary = (skillsToAdd: {name: string, category: string}[]) => {
      const skillsWithAttributes = skillsToAdd.map(skill => {
          const matchedAttribute = validAttributes.find(attr => attr.name.toLowerCase() === skill.category.toLowerCase());
          return { name: skill.name, baseAttribute: matchedAttribute?.name || '' };
      });
      appendSkill(skillsWithAttributes);
  };

  const handleAddFeatsFromLibrary = (featsToAdd: {name: string, description: string, prerequisites: string, effect: string }[]) => {
      appendFeat(featsToAdd);
  }


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
              <Accordion type="multiple" className="w-full space-y-2" defaultValue={['Unassigned']}>
                {orderedSkillGroups.map(({ attribute, skills }) => (
                  <AccordionItem key={attribute} value={attribute} className="border rounded-md px-3">
                    <AccordionTrigger>
                      <div className="flex items-center gap-2">
                          {attribute}
                          <span className="text-xs font-normal text-muted-foreground bg-muted h-5 w-5 flex items-center justify-center rounded-full">{skills.length}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pt-2">
                      <div className="space-y-2">
                        {skills.map(skill => (
                          <div key={skill.id} className="flex gap-2 items-end">
                            <FormField
                              control={form.control}
                              name={`skills.${skill.originalIndex}.name`}
                              render={({ field }) => (
                                <FormItem className="flex-1">
                                  <FormControl>
                                    <Input {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name={`skills.${skill.originalIndex}.baseAttribute`}
                              render={({ field }) => (
                                <FormItem className="flex-1">
                                  <Select onValueChange={field.onChange} value={field.value}>
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
                            <Button type="button" variant="destructive" size="icon" onClick={() => removeSkill(skill.originalIndex)}><Trash2 className="h-4 w-4" /></Button>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
              
              <div className="flex gap-2 pt-4">
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
              {featFields.map((field, index) => (
                <div key={field.id} className="grid grid-cols-1 md:grid-cols-4 gap-2 items-end p-3 border rounded-md">
                  <FormField
                    control={form.control}
                    name={`feats.${index}.name`}
                    render={({ field }) => (
                      <FormItem className="md:col-span-1">
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
                      <FormItem className="md:col-span-1">
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
                      <FormItem className="md:col-span-1">
                        <FormLabel>Prerequisites</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                   <FormField
                    control={form.control}
                    name={`feats.${index}.effect`}
                    render={({ field }) => (
                      <FormItem className="md:col-span-1">
                        <FormLabel>Effect</FormLabel>
                        <FormControl>
                          <Input placeholder="+2, -10%, etc." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="md:col-span-4 flex justify-end">
                    <Button type="button" variant="destructive" size="icon" onClick={() => removeFeat(index)}><Trash2 className="h-4 w-4" /></Button>
                  </div>
                </div>
              ))}
              <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={() => appendFeat({ name: '', description: '', prerequisites: '', effect: '' })}><PlusCircle className="mr-2 h-4 w-4" /> Add Feat</Button>
                <FeatLibraryBrowser onAddFeats={handleAddFeatsFromLibrary} />
              </div>
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
