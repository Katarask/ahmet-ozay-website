import { getTranslations, setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import { locales } from '@/i18n/config';
import Breadcrumbs from '@/components/Breadcrumbs';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: 'meta.notFound' });
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.ahmetoezay.de';
  const url = `${baseUrl}/${locale}/404`;

  return {
    title: t('title'),
    description: t('description'),
    robots: {
      index: false,
      follow: true,
    },
    openGraph: {
      title: t('title'),
      description: t('description'),
      url,
      type: 'website',
    },
  };
}

export default async function NotFoundPage({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'notFound' });
  const tNav = await getTranslations({ locale, namespace: 'nav' });
  const tBreadcrumb = await getTranslations({ locale, namespace: 'breadcrumbs' });

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.ahmetoezay.de';

  const breadcrumbItems = [
    {
      name: tBreadcrumb('home'),
      url: `${baseUrl}/${locale}`,
    },
  ];

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <Breadcrumbs items={breadcrumbItems} />
      
      <div className="text-center py-16">
        <h1 className="text-6xl font-bold text-light-text-primary dark:text-dark-text-primary mb-4">
          404
        </h1>
        <h2 className="text-2xl font-semibold text-light-text-primary dark:text-dark-text-primary mb-4">
          {t('title')}
        </h2>
        <p className="text-lg text-light-text-secondary dark:text-dark-text-secondary mb-8 max-w-2xl mx-auto">
          {t('message')}
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href={`/${locale}`}
            className="inline-flex items-center justify-center px-6 py-3 bg-light-accent dark:bg-dark-accent text-white rounded-sm hover:bg-light-accent-hover dark:hover:bg-dark-accent-hover transition-colors"
          >
            {t('backHome')}
          </Link>
          <Link
            href={`/${locale}/artikel`}
            className="inline-flex items-center justify-center px-6 py-3 border border-light-border dark:border-dark-border text-light-text-primary dark:text-dark-text-primary rounded-sm hover:bg-light-bg-secondary dark:hover:bg-dark-bg-secondary transition-colors"
          >
            {t('backArticles')}
          </Link>
        </div>
      </div>
    </div>
  );
}
