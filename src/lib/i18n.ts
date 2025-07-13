import 'server-only';
import { headers } from 'next/headers';

const dictionaries = {
  en: () => import('@/locales/en').then(module => module.default),
  fr: () => import('@/locales/fr').then(module => module.default),
};

type Locale = keyof typeof dictionaries;

export const getTranslations = async (locale: Locale) => {
    return dictionaries[locale]();
}

export const getLocale = (): Locale => {
  const headersList = headers();
  const pathname = headersList.get('x-next-pathname') || '';
  const segments = pathname.split('/');
  const locale = segments[1] as Locale;

  if (dictionaries[locale]) {
    return locale;
  }

  return 'en'; // default locale
};

// Helper function to get a specific translation string
export type I18n = Awaited<ReturnType<typeof getTranslations>>;

function getTranslationValue(keys: string, t: any) {
  return keys.split('.').reduce((obj, key) => {
    if (obj && typeof obj === 'object' && key in obj) {
      return obj[key];
    }
    return keys;
  }, t);
}

export function createT(t: I18n) {
  return function (key: string) {
    return getTranslationValue(key, t);
  }
}
