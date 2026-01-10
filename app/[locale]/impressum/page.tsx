import { getTranslations, setRequestLocale } from 'next-intl/server';
import { locales, defaultLocale } from '@/i18n/config';
import { resolveParams } from '@/lib/params';
import Breadcrumbs from '@/components/Breadcrumbs';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params?: Promise<{ locale: string }> | { locale: string } }) {
  const { locale } = await resolveParams(params, { locale: defaultLocale });
  const t = await getTranslations({ locale, namespace: 'meta' });
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.ahmetoezay.de';
  const url = `${baseUrl}/${locale}/impressum`;
  
  return {
    title: t('impressum.title'),
    description: t('impressum.description'),
    alternates: {
      canonical: url,
      languages: {
        'de': `${baseUrl}/de/impressum`,
        'en': `${baseUrl}/en/impressum`,
        'tr': `${baseUrl}/tr/impressum`,
      },
    },
    openGraph: {
      title: t('impressum.title'),
      description: t('impressum.description'),
      url: url,
      siteName: 'Ahmet Özay',
      locale: locale,
      type: 'website',
    },
    twitter: {
      card: 'summary',
      title: t('impressum.title'),
      description: t('impressum.description'),
      creator: '@aoezay',
    },
  };
}

export default async function ImpressumPage({ params }: { params?: Promise<{ locale: string }> | { locale: string } }) {
  const { locale } = await resolveParams(params, { locale: defaultLocale });
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'impressum' });
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.ahmetoezay.de';

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <Breadcrumbs 
        items={[
          { label: t('breadcrumb') }
        ]}
        locale={locale}
      />

      <div className="mt-8">
        <h1 className="heading_h1 text-4xl md:text-5xl font-sans font-bold text-light-text-primary dark:text-dark-text-primary mb-8">
          {t('title')}
        </h1>

        <div className="prose-custom space-y-6">
          <section>
            <h2 className="heading_h2 text-2xl font-sans font-bold text-light-text-primary dark:text-dark-text-primary mb-4">
              {t('responsible.title')}
            </h2>
            <div className="font-serif text-light-text-secondary dark:text-dark-text-secondary leading-relaxed space-y-2">
              <p>{t('responsible.name')}</p>
              <p>{t('responsible.address')}</p>
              <p>
                {t('responsible.email')}: <a href={`mailto:${t('responsible.emailValue')}`} className="text-light-accent-primary dark:text-dark-accent-primary hover:underline">{t('responsible.emailValue')}</a>
              </p>
            </div>
          </section>

          <section>
            <h2 className="heading_h2 text-2xl font-sans font-bold text-light-text-primary dark:text-dark-text-primary mb-4">
              {t('liability.title')}
            </h2>
            <div className="font-serif text-light-text-secondary dark:text-dark-text-secondary leading-relaxed space-y-4">
              <p>{t('liability.content')}</p>
            </div>
          </section>

          <section>
            <h2 className="heading_h2 text-2xl font-sans font-bold text-light-text-primary dark:text-dark-text-primary mb-4">
              {t('copyright.title')}
            </h2>
            <div className="font-serif text-light-text-secondary dark:text-dark-text-secondary leading-relaxed space-y-4">
              <p>{t('copyright.content')}</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
