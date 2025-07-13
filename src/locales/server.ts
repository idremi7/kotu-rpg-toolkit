import { createI18nServer } from 'next-international/server';

export const { getI18n, getStaticParams, getCurrentLocale } = createI18nServer({
  en: () => import('./en'),
  fr: () => import('./fr'),
});
