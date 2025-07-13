import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Shield, Swords, Users, FileText, Wand2, UserPlus } from 'lucide-react';
import Link from 'next/link';
import { getTranslations, createT } from '@/lib/i18n';
import Image from 'next/image';

export default async function Home({ params: { locale } }: { params: { locale: 'en' | 'fr' } }) {
  const translations = await getTranslations(locale);
  const t = createT(translations);

  const steps = [
    {
      icon: <Users className="w-10 h-10 mb-4 text-primary" />,
      title: t('home.howItWorks.gm.title'),
      description: t('home.howItWorks.gm.description'),
      image: "https://placehold.co/1024x768.png",
      aiHint: "fantasy map"
    },
    {
      icon: <FileText className="w-10 h-10 mb-4 text-primary" />,
      title: t('home.howItWorks.form.title'),
      description: t('home.howItWorks.form.description'),
      image: "https://placehold.co/1024x768.png",
      aiHint: "character sheet form"
    },
    {
      icon: <UserPlus className="w-10 h-10 mb-4 text-primary" />,
      title: t('home.howItWorks.player.title'),
      description: t('home.howItWorks.player.description'),
      image: "https://placehold.co/1024x768.png",
      aiHint: "dungeons dragons players"
    }
  ];

  return (
    <div className="flex flex-col">
      <section className="text-center py-20 px-4 bg-card/50">
        <h1 className="font-headline text-5xl md:text-7xl font-bold tracking-tight text-primary">
          {t('home.title')}
        </h1>
        <p className="mt-4 text-lg md:text-xl text-foreground/80 max-w-3xl mx-auto">
          {t('home.subtitle')}
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="/gm/dashboard">
                <Users className="mr-2" />
                {t('home.gmCard.button')}
              </Link>
            </Button>
            <Button asChild size="lg" variant="secondary">
               <Link href="/player/dashboard">
                <Swords className="mr-2" />
                {t('home.playerCard.button')}
              </Link>
            </Button>
        </div>
      </section>

      <section id="how-it-works" className="py-20 px-4">
        <div className="container mx-auto">
            <h2 className="text-4xl font-headline font-bold text-center mb-12">{t('home.howItWorks.title')}</h2>
            <div className="space-y-16">
              {steps.map((step, index) => (
                <div key={index} className={`flex flex-col md:flex-row items-center gap-12 ${index % 2 === 1 ? 'md:flex-row-reverse' : ''}`}>
                    <div className="md:w-1/2 text-center md:text-left">
                        <div className="flex justify-center md:justify-start">
                            {step.icon}
                        </div>
                        <h3 className="text-3xl font-bold font-headline mb-4">{step.title}</h3>
                        <p className="text-lg text-muted-foreground">{step.description}</p>
                    </div>
                    <div className="md:w-1/2">
                        <Card className="overflow-hidden shadow-2xl">
                          <CardContent className="p-0">
                            <Image 
                              src={step.image} 
                              alt={step.title}
                              width={1024}
                              height={768}
                              data-ai-hint={step.aiHint}
                              className="object-cover w-full h-full" 
                            />
                          </CardContent>
                        </Card>
                    </div>
                </div>
              ))}
            </div>
        </div>
      </section>

      <section className="bg-muted py-20 px-4">
        <div className="container mx-auto text-center">
            <h2 className="text-4xl font-headline font-bold mb-4">{t('home.finalCta.title')}</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">{t('home.finalCta.subtitle')}</p>
            <Button asChild size="lg">
              <Link href="/signup">{t('home.finalCta.button')}</Link>
            </Button>
        </div>
      </section>
    </div>
  );
}
