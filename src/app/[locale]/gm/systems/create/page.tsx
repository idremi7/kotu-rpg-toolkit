import { SystemCreator } from "@/components/gm/SystemCreator";
import { getTranslations, createT } from '@/lib/i18n';
import { BackButton } from "@/components/BackButton";

export default async function CreateSystemPage({ params: { locale } }: { params: { locale: 'en' | 'fr' }}) {
  const translations = await getTranslations(locale);
  const t = createT(translations);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="relative text-center mb-8">
        <div className="absolute left-0 top-1/2 -translate-y-1/2">
            <BackButton />
        </div>
        <h1 className="font-headline text-4xl font-bold">{t('createSystem.title')}</h1>
        <p className="text-muted-foreground">
          {t('createSystem.description')}
        </p>
      </div>
      <SystemCreator />
    </div>
  );
}
