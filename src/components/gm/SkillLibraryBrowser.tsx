
'use client';

import { useEffect, useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FormLabel } from '@/components/ui/form';
import { BookOpen } from 'lucide-react';
import { listSkillsFromLibraryAction } from '@/actions';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { SkillFromLibrary } from '@/lib/data-service';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '../ui/sheet';
import { ScrollArea } from '../ui/scroll-area';
import { Checkbox } from '../ui/checkbox';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';

const LanguageToggle = ({ selectedLang, onLangChange }: { selectedLang: 'en' | 'fr' | 'all', onLangChange: (lang: 'en' | 'fr' | 'all') => void }) => {
    return (
        <div className="flex justify-center gap-2 my-2">
            <Button size="sm" variant={selectedLang === 'en' ? 'default' : 'outline'} onClick={() => onLangChange('en')}>English</Button>
            <Button size="sm" variant={selectedLang === 'fr' ? 'default' : 'outline'} onClick={() => onLangChange('fr')}>Français</Button>
            <Button size="sm" variant={selectedLang === 'all' ? 'default' : 'outline'} onClick={() => onLangChange('all')}>All</Button>
        </div>
    );
};

export const SkillLibraryBrowser = ({ onAddSkills }: { onAddSkills: (skills: {name: string, category: string}[]) => void }) => {
    const { toast } = useToast();
    const [selectedSkills, setSelectedSkills] = useState<Record<string, {isSelected: boolean, category: string}>>({});
    const [isOpen, setIsOpen] = useState(false);
    const [allSkills, setAllSkills] = useState<SkillFromLibrary[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [lang, setLang] = useState<'en' | 'fr' | 'all'>('en');
    const [categoryFilter, setCategoryFilter] = useState<string>('all');

    useEffect(() => {
        if (isOpen && allSkills.length === 0) {
            listSkillsFromLibraryAction().then(skills => {
                setAllSkills(skills);
            });
        }
    }, [isOpen, allSkills.length]);

    const skillCategories = useMemo(() => {
        const categories = new Set(allSkills.map(s => s.category));
        return ['all', ...Array.from(categories).sort()];
    }, [allSkills]);
    
    const filteredAndGroupedSkills = useMemo(() => {
        const filtered = allSkills.filter(skill => {
            const langMatch = lang === 'all' || !skill.lang || skill.lang === lang;
            const categoryMatch = categoryFilter === 'all' || skill.category === categoryFilter;
            const searchMatch = !searchQuery || 
                                skill.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                skill.description.toLowerCase().includes(searchQuery.toLowerCase());
            return langMatch && categoryMatch && searchMatch;
        });

        return filtered.reduce((acc, skill) => {
            const { category } = skill;
            if (!acc[category]) {
                acc[category] = [];
            }
            acc[category].push(skill);
            return acc;
        }, {} as Record<string, SkillFromLibrary[]>);
    }, [searchQuery, allSkills, lang, categoryFilter]);
    
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
        setCategoryFilter('all');
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
                    <div className="flex gap-2 mb-2">
                        <Input 
                            placeholder="Search skills..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="flex-grow"
                        />
                        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Filter by category" />
                            </SelectTrigger>
                            <SelectContent>
                                {skillCategories.map(cat => (
                                    <SelectItem key={cat} value={cat}>{cat === 'all' ? 'All Categories' : cat}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <LanguageToggle selectedLang={lang} onLangChange={setLang} />
                    <ScrollArea className="flex-grow pr-4 -mx-4 px-4">
                       <Accordion type="multiple" className="w-full" defaultValue={Object.keys(filteredAndGroupedSkills)}>
                           {Object.entries(filteredAndGroupedSkills).map(([category, skills]) => (
                               <AccordionItem value={category} key={category}>
                                   <AccordionTrigger>{category}</AccordionTrigger>
                                   <AccordionContent>
                                        <div className="space-y-2">
                                            {skills.map(skill => (
                                                <div key={`${skill.name}-${skill.lang}`} className="flex items-center space-x-2 p-2 rounded-md hover:bg-muted/50">
                                                    <Checkbox 
                                                        id={`lib-${skill.name}-${skill.lang}`}
                                                        checked={!!selectedSkills[skill.name]?.isSelected}
                                                        onCheckedChange={(checked) => handleSelectSkill(skill.name, skill.category, !!checked)}
                                                    />
                                                    <label htmlFor={`lib-${skill.name}-${skill.lang}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex-grow">
                                                        <div className="flex justify-between">
                                                          <span>{skill.name}</span>
                                                          <span className="text-xs text-muted-foreground">{skill.lang?.toUpperCase()}</span>
                                                        </div>
                                                        <p className="text-xs text-muted-foreground">{skill.description}</p>
                                                    </label>
                                                </div>
                                            ))}
                                        </div>
                                   </AccordionContent>
                               </AccordionItem>
                           ))}
                       </Accordion>
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
