'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';
import { getTranslations, createT } from '@/lib/i18n';
import type { I18n } from '@/lib/i18n';

// Since this is a client component, we need to handle translations a bit differently.
const useTranslations = (locale: string) => {
  const [t, setT] = useState<(key: string) => string>(() => (key: string) => key);

  useEffect(() => {
    async function loadTranslations() {
      const translations = await getTranslations(locale as 'en' | 'fr');
      setT(() => createT(translations));
    }
    loadTranslations();
  }, [locale]);

  return t;
};

export default function SystemDetailsPage({ params }: { params: { systemId: string, locale: string }}) {
  const [system, setSystem] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const t = useTranslations(params.locale);

  useEffect(() => {
    try {
      const savedSystem = localStorage.getItem(`system-${params.systemId}`);
      if (savedSystem) {
        setSystem(JSON.parse(savedSystem));
      }
    } catch (error) {
       console.error("Failed to parse system from localStorage", error);
    } finally {
        setIsLoading(false);
    }
  }, [params.systemId]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-16">
        <Loader2 className="h-8 w-8 animate-spin mb-4" />
        <p>{t('systemDetails.loading')}</p>
      </div>
    );
  }
  
  if (!system) {
    return (
       <div className="text-center py-16">
        <h2 className="text-2xl font-bold">{t('systemDetails.noSystem')}</h2>
        <p className="text-muted-foreground">{t('systemDetails.noSystemDesc')}</p>
      </div>
    );
  }

  const { systemName, attributes, skills, feats, schemas } = system;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="font-headline text-4xl font-bold">{t('systemDetails.title')}</h1>
        <p className="text-muted-foreground">{t('systemDetails.description').replace('{systemName}', systemName)}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
        <div className="space-y-6">
            <Card>
                <CardHeader><CardTitle>{t('systemDetails.attributes')}</CardTitle></CardHeader>
                <CardContent className="space-y-2">
                    {attributes.map((attr: any) => (
                        <div key={attr.name}>
                            <h4 className="font-semibold">{attr.name}</h4>
                            <p className="text-sm text-muted-foreground">{attr.description}</p>
                        </div>
                    ))}
                </CardContent>
            </Card>
             <Card>
                <CardHeader><CardTitle>{t('systemDetails.skills')}</CardTitle></CardHeader>
                <CardContent className="space-y-2">
                    {skills.map((skill: any) => (
                        <div key={skill.name}>
                            <h4 className="font-semibold">{skill.name} <Badge variant="outline">{skill.baseAttribute}</Badge></h4>
                        </div>
                    ))}
                </CardContent>
            </Card>
             <Card>
                <CardHeader><CardTitle>{t('systemDetails.feats')}</CardTitle></CardHeader>
                <CardContent className="space-y-2">
                    {feats.map((feat: any) => (
                        <div key={feat.name}>
                            <h4 className="font-semibold">{feat.name}</h4>
                            <p className="text-sm text-muted-foreground">{feat.description}</p>
                             {feat.prerequisites && <p className="text-xs text-muted-foreground">Requires: {feat.prerequisites}</p>}
                        </div>
                    ))}
                </CardContent>
            </Card>
        </div>
        <div>
            <Card>
                <CardHeader><CardTitle>{t('systemDetails.schemas')}</CardTitle></CardHeader>
                <CardContent>
                    <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="form-schema">
                            <AccordionTrigger>{t('systemDetails.formSchema')}</AccordionTrigger>
                            <AccordionContent>
                                <pre className="text-xs bg-muted p-4 rounded-md overflow-auto"><code>{JSON.stringify(JSON.parse(schemas.formSchema), null, 2)}</code></pre>
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="ui-schema">
                            <AccordionTrigger>{t('systemDetails.uiSchema')}</AccordionTrigger>
                            <AccordionContent>
                               <pre className="text-xs bg-muted p-4 rounded-md overflow-auto"><code>{JSON.stringify(JSON.parse(schemas.uiSchema), null, 2)}</code></pre>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
