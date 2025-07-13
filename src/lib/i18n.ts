const dictionaries = {
  en: () => import('@/locales/en').then(module => module.default),
  fr: () => import('@/locales/fr').then(module => module.default),
};

type Locale = keyof typeof dictionaries;

export const getTranslations = async (locale: Locale) => {
    if (!locale || !dictionaries[locale]) {
        return dictionaries.en();
    }
    return dictionaries[locale]();
}

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
