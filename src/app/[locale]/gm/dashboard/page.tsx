import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, Shield, Swords } from "lucide-react";
import Link from "next/link";
import { getTranslations, createT } from '@/lib/i18n';

// In a real app, this would come from a database.
// We'll add new systems here via SystemCreator's localStorage logic.
const mockSystems = [
  { id: 'd20-fantasy', name: 'D20 Fantasy', description: 'A classic system with attributes, skills, and feats.' },
  { id: 'space-opera', name: 'Cosmic Drift', description: 'A sci-fi system focusing on ship combat and psionics.' },
];

export default async function GMDashboard({ params: { locale } }: { params: { locale: 'en' | 'fr' }}) {
  const translations = await getTranslations(locale);
  const t = createT(translations);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="font-headline text-4xl font-bold">{t('gmDashboard.title')}</h1>
        <Button asChild>
          <Link href="/gm/systems/create">
            <PlusCircle className="mr-2 h-4 w-4" />
            {t('gmDashboard.newSystemButton')}
          </Link>
        </Button>
      </div>
      <p className="text-muted-foreground mb-8">{t('gmDashboard.description')}</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockSystems.map(system => (
          <Card key={system.id} className="flex flex-col">
            <CardHeader>
              <CardTitle className="font-headline flex items-center gap-2">
                <Swords className="text-primary"/>
                {system.name}
              </CardTitle>
              <CardDescription>{system.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              {/* Future content can go here, like player count or last played date */}
            </CardContent>
            <div className="p-4 pt-0">
               <Button asChild variant="secondary" className="w-full">
                  <Link href={`/gm/systems/${system.id}`}>{t('gmDashboard.manageButton')}</Link>
                </Button>
            </div>
          </Card>
        ))}
         <Card className="border-dashed flex items-center justify-center">
            <Button variant="ghost" className="w-full h-full text-lg" asChild>
                 <Link href="/gm/systems/create">
                    <PlusCircle className="mr-2 h-6 w-6" />
                    {t('gmDashboard.createSystemPrompt')}
                 </Link>
            </Button>
        </Card>
      </div>
    </div>
  );
}
