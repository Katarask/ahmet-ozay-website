import { useTranslations } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import Breadcrumbs from '@/components/Breadcrumbs';
import ContactForm from '@/components/ContactForm';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: 'meta' });
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.ahmetoezay.de';
  const url = `${baseUrl}/${locale}/kontakt`;
  
  return {
    title: t('contact.title'),
    description: t('contact.description'),
    alternates: {
      canonical: url,
      languages: {
        'de': `${baseUrl}/de/kontakt`,
        'en': `${baseUrl}/en/kontakt`,
        'tr': `${baseUrl}/tr/kontakt`,
      },
    },
    openGraph: {
      title: t('contact.title'),
      description: t('contact.description'),
      url: url,
      siteName: 'Ahmet Özay',
      locale: locale,
      type: 'website',
    },
    twitter: {
      card: 'summary',
      title: t('contact.title'),
      description: t('contact.description'),
      creator: '@aoezay',
    },
  };
}

export default function ContactPage({ params: { locale } }: { params: { locale: string } }) {
  // Enable static rendering
  setRequestLocale(locale);
  
  const t = useTranslations('contact');

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <Breadcrumbs 
        items={[
          { label: t('breadcrumb') }
        ]}
        locale={locale}
      />

      <ContactForm />
    </div>
  );
}