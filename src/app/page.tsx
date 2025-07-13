import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Swords, Shield, ScrollText, User, Users } from 'lucide-react';
import Link from 'next/link';
import { getTranslations, getLocale, createT } from '@/lib/i18n';

export default async function Home() {
  const locale = getLocale();
  const translations = await getTranslations(locale);
  const t = createT(translations);

  return (
    <div className="container mx-auto px-4 py-12">
      <section className="text-center mb-16">
        <h1 className="font-headline text-5xl md:text-7xl font-bold tracking-tight text-primary">
          {t('home.title')}
        </h1>
        <p className="mt-4 text-lg md:text-xl text-foreground/80 max-w-3xl mx-auto">
          {t('home.subtitle')}
        </p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        <Card className="hover:shadow-lg hover:border-primary/50 transition-all duration-300">
          <CardHeader className="flex-row items-center gap-4">
            <Users className="w-12 h-12 text-primary" />
            <div>
              <CardTitle className="font-headline text-2xl">{t('home.gmCard.title')}</CardTitle>
              <CardDescription>{t('home.gmCard.description')}</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <p className="mb-6">
              {t('home.gmCard.body')}
            </p>
            <Button asChild className="w-full" size="lg">
              <Link href="/gm/dashboard">{t('home.gmCard.button')}</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg hover:border-primary/50 transition-all duration-300">
          <CardHeader className="flex-row items-center gap-4">
            <User className="w-12 h-12 text-primary" />
            <div>
              <CardTitle className="font-headline text-2xl">{t('home.playerCard.title')}</CardTitle>
              <CardDescription>{t('home.playerCard.description')}</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <p className="mb-6">
              {t('home.playerCard.body')}
            </p>
            <Button asChild className="w-full" size="lg">
              <Link href="/player/dashboard">{t('home.playerCard.button')}</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
      
      <section className="mt-20 text-center">
        <h2 className="font-headline text-3xl font-bold mb-6">{t('home.features.title')}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-6xl mx-auto text-left">
          <div className="flex items-start gap-4">
            <Swords className="w-8 h-8 text-accent flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-bold text-lg">{t('home.features.systemBuilder.title')}</h3>
              <p className="text-foreground/80">{t('home.features.systemBuilder.description')}</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <Shield className="w-8 h-8 text-accent flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-bold text-lg">{t('home.features.formGeneration.title')}</h3>
              <p className="text-foreground/80">{t('home.features.formGeneration.description')}</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <ScrollText className="w-8 h-8 text-accent flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-bold text-lg">{t('home.features.liveSheets.title')}</h3>
              <p className="text-foreground/80">{t('home.features.liveSheets.description')}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
