import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, Shield, Swords } from "lucide-react";
import Link from "next/link";
import { getTranslations, createT } from '@/lib/i18n';
import { listSystemsAction } from "@/app/actions";

export default async function GMDashboard({ params: { locale } }: { params: { locale: 'en' | 'fr' }}) {
  const translations = await getTranslations(locale);
  const t = createT(translations);
  const systems = await listSystemsAction();

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
      
      {systems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {systems.map(system => (
            <Card key={system.id} className="flex flex-col">
              <CardHeader>
                <CardTitle className="font-headline flex items-center gap-2">
                  <Swords className="text-primary"/>
                  {system.name}
                </CardTitle>
                <CardDescription>{system.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
              </CardContent>
              <div className="p-4 pt-0">
                 <Button asChild variant="secondary" className="w-full">
                    <Link href={`/gm/systems/${system.id}`}>{t('gmDashboard.manageButton')}</Link>
                  </Button>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 border-2 border-dashed rounded-lg">
          <h2 className="text-2xl font-semibold mb-2">{t('gmDashboard.noSystemsTitle')}</h2>
          <p className="text-muted-foreground mb-4">{t('gmDashboard.noSystemsDescription')}</p>
          <Button asChild size="lg">
            <Link href="/gm/systems/create">
              <PlusCircle className="mr-2 h-5 w-5" />
              {t('gmDashboard.createFirstSystemButton')}
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}
