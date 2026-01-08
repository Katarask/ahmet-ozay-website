import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import Breadcrumbs from '@/components/Breadcrumbs';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: 'meta' });
  
  return {
    title: t('about.title'),
    description: t('about.description'),
  };
}

export default function AboutPage({ params: { locale } }: { params: { locale: string } }) {
  const t = useTranslations('about');

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <Breadcrumbs 
        items={[
          { label: t('breadcrumb') }
        ]}
        locale={locale}
      />
      
      <article className="mt-8">
        <div className="flex flex-col md:flex-row gap-12">
          <div className="md:w-1/3">
            <img 
              src="/images/ahmet-portrait.png" 
              alt="Ahmet Özay"
              className="w-full h-auto"
            />
          </div>
          
          <div className="md:w-2/3">
            <h1 className="text-4xl font-sans font-bold text-light-text-primary dark:text-dark-text-primary mb-6">
              {t('title')}
            </h1>
            
            <div className="space-y-6 font-serif text-light-text-secondary dark:text-dark-text-secondary leading-relaxed">
              <p className="text-xl border-l-2 border-light-border-accent dark:border-dark-border-accent pl-5">
                {t('intro')}
              </p>
              
              <p>{t('paragraph1')}</p>
              <p>{t('paragraph2')}</p>
              <p>{t('paragraph3')}</p>
            </div>

            <div className="mt-12">
              <h2 className="text-2xl font-sans font-bold text-light-text-primary dark:text-dark-text-primary mb-4 border-l-2 border-light-border-accent dark:border-dark-border-accent pl-4">
                {t('experienceTitle')}
              </h2>
              
              <ul className="space-y-4 font-serif text-light-text-secondary dark:text-dark-text-secondary">
                <li className="flex gap-4">
                  <span className="text-light-text-muted dark:text-dark-text-muted min-w-[100px]">1980-2020</span>
                  <span>WDR - Westdeutscher Rundfunk</span>
                </li>
                <li className="flex gap-4">
                  <span className="text-light-text-muted dark:text-dark-text-muted min-w-[100px]">1990-2005</span>
                  <span>BBC World Service</span>
                </li>
                <li className="flex gap-4">
                  <span className="text-light-text-muted dark:text-dark-text-muted min-w-[100px]">1985-1995</span>
                  <span>Deutsche Welle</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}
