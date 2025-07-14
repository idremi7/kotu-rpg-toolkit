import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, User } from "lucide-react";
import Link from "next/link";
import { getTranslations, createT } from '@/lib/i18n';

const mockCharacters = [
  { id: 'elara', name: 'Elara', class: 'Wizard', level: 5, system: 'D20 Fantasy' },
  { id: 'kain', name: 'Kain', class: 'Smuggler', level: 3, system: 'Cosmic Drift' },
];

export default async function PlayerDashboard({ params: { locale } }: { params: { locale: 'en' | 'fr' }}) {
  const translations = await getTranslations(locale);
  const t = createT(translations);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-4">
        <div>
            <h1 className="font-headline text-4xl font-bold">{t('playerDashboard.title')}</h1>
            <p className="text-muted-foreground mt-1">{t('playerDashboard.description')}</p>
        </div>
         <Button asChild size="lg">
          <Link href="/player/characters/create">
            <PlusCircle className="mr-2 h-5 w-5" />
            {t('playerDashboard.newCharacterButton')}
          </Link>
        </Button>
      </div>
      
      {mockCharacters.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {mockCharacters.map(char => (
            <Card key={char.id} className="flex flex-col">
              <CardHeader>
                <CardTitle className="font-headline flex items-center gap-2">
                  <User className="text-primary"/>
                  {char.name}
                </CardTitle>
                <CardDescription>{char.class} Level {char.level} ({char.system})</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                {/* Future content like status or inventory snippets */}
              </CardContent>
               <div className="p-4 pt-0">
                 <Button variant="secondary" className="w-full">{t('playerDashboard.viewSheetButton')}</Button>
              </div>
            </Card>
          ))}
        </div>
      ) : (
         <div className="text-center py-16 border-2 border-dashed rounded-lg mt-12">
          <h2 className="text-2xl font-semibold mb-2">{t('playerDashboard.noCharactersTitle')}</h2>
          <p className="text-muted-foreground mb-4">{t('playerDashboard.noCharactersDescription')}</p>
          <Button asChild size="lg">
            <Link href="/player/characters/create">
              <PlusCircle className="mr-2 h-5 w-5" />
              {t('playerDashboard.createFirstCharacterButton')}
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}
