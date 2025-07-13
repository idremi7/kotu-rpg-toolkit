import { SystemCreator } from "@/components/gm/SystemCreator";
import { getTranslations, createT } from '@/lib/i18n';

export default async function CreateSystemPage({ params: { locale } }: { params: { locale: string }}) {
  const translations = await getTranslations(locale as 'en' | 'fr');
  const t = createT(translations);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="font-headline text-4xl font-bold">{t('createSystem.title')}</h1>
        <p className="text-muted-foreground">
          {t('createSystem.description')}
        </p>
      </div>
      <SystemCreator />
    </div>
  );
}
