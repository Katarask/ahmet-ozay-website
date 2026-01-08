import { getRequestConfig } from 'next-intl/server';
import { locales, defaultLocale } from './config';

export default getRequestConfig(async ({requestLocale}) => {
  // Wait for the locale to be available
  let locale = await requestLocale;

  // Validate that the incoming `locale` parameter is valid
  if (!locale || !locales.includes(locale as any)) {
    locale = defaultLocale;
  }
  
  return {
    locale,
    messages: (await import(`./locales/${locale}.json`)).default,
  };
});
