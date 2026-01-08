import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import Breadcrumbs from '@/components/Breadcrumbs';
import ContactForm from '@/components/ContactForm';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: 'meta' });
  
  return {
    title: t('contact.title'),
    description: t('contact.description'),
  };
}

export default function ContactPage({ params: { locale } }: { params: { locale: string } }) {
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