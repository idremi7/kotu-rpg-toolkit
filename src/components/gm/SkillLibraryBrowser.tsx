
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
import { Separator } from '../ui/separator';

export const SkillLibraryBrowser = ({ onAddSkills }: { onAddSkills: (skills: {name: string, category: string}[]) => void }) => {
    const { toast } = useToast();
    const [selectedSkills, setSelectedSkills] = useState<Record<string, {isSelected: boolean, category: string}>>({});
    const [isOpen, setIsOpen] = useState(false);
    const [allSkills, setAllSkills] = useState<SkillFromLibrary[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
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
        const lowercasedQuery = searchQuery.toLowerCase();

        const filtered = allSkills.filter(skill => {
            const categoryMatch = categoryFilter === 'all' || skill.category.toLowerCase() === categoryFilter.toLowerCase();
            const searchMatch = !searchQuery || 
                                skill.name.toLowerCase().includes(lowercasedQuery) || 
                                skill.description.toLowerCase().includes(lowercasedQuery);
            return categoryMatch && searchMatch;
        });

        return filtered.reduce((acc, skill) => {
            const { category } = skill;
            if (!acc[category]) {
                acc[category] = [];
            }
            acc[category].push(skill);
            return acc;
        }, {} as Record<string, SkillFromLibrary[]>);
    }, [searchQuery, allSkills, categoryFilter]);
    
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
                    <div className="flex gap-2 mb-4">
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
                    <ScrollArea className="flex-grow pr-4 -mx-4 px-4">
                       <div className="space-y-4">
                           {Object.entries(filteredAndGroupedSkills).map(([category, skills], index) => (
                               <div key={category}>
                                   {index > 0 && <Separator className="my-4" />}
                                   <h3 className="text-lg font-semibold mb-2">{category}</h3>
                                    <div className="space-y-2">
                                        {skills.map(skill => (
                                            <div key={skill.name} className="flex items-center space-x-2 p-2 rounded-md hover:bg-muted/50">
                                                <Checkbox 
                                                    id={`lib-${skill.name}`}
                                                    checked={!!selectedSkills[skill.name]?.isSelected}
                                                    onCheckedChange={(checked) => handleSelectSkill(skill.name, skill.category, !!checked)}
                                                />
                                                <label htmlFor={`lib-${skill.name}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex-grow">
                                                    <div>{skill.name}</div>
                                                    <p className="text-xs text-muted-foreground">{skill.description}</p>
                                                </label>
                                            </div>
                                        ))}
                                    </div>
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
