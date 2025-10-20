import { getRequestConfig } from 'next-intl/server';

const locales = ['en', 'es'] as const;
export type Locale = (typeof locales)[number];

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (!locale || !locales.includes(locale as Locale)) {
    locale = 'en';
  }

  return {
    locale,
    messages: {
      common: (await import(`./locales/${locale}/common.json`)).default,
      purchase: (await import(`./locales/${locale}/purchase.json`)).default,
    },
  };
});
