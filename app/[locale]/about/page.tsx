import { getTranslations, setRequestLocale } from 'next-intl/server';
import Image from 'next/image';
import Breadcrumbs from '@/components/Breadcrumbs';
import FAQ from '@/components/FAQ';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: 'meta' });
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.ahmetoezay.de';
  const url = `${baseUrl}/${locale}/about`;
  const imageUrl = `${baseUrl}/images/ahmet-portrait.png`;
  
  return {
    title: t('about.title'),
    description: t('about.description'),
    alternates: {
      canonical: url,
      languages: {
        'de': `${baseUrl}/de/about`,
        'en': `${baseUrl}/en/about`,
        'tr': `${baseUrl}/tr/about`,
      },
    },
    openGraph: {
      title: t('about.title'),
      description: t('about.description'),
      url: url,
      siteName: 'Ahmet Özay',
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: 'Ahmet Özay',
        },
      ],
      locale: locale,
      type: 'profile',
    },
    twitter: {
      card: 'summary_large_image',
      title: t('about.title'),
      description: t('about.description'),
      images: [imageUrl],
      creator: '@aoezay',
    },
  };
}

export default async function AboutPage({ params: { locale } }: { params: { locale: string } }) {
  // Enable static rendering
  setRequestLocale(locale);
  
  const t = await getTranslations({ locale, namespace: 'about' });
  const tFaq = await getTranslations({ locale, namespace: 'faq' });
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.ahmetoezay.de';
  
  // FAQ-Daten aus Übersetzungen laden
  const faqItems = tFaq.raw('items') as Array<{ question: string; answer: string }>;
  
  // FAQ Schema.org (JSON-LD)
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
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
            <Image
              src="/images/ahmet-portrait.png"
              alt="Ahmet Özay"
              width={300}
              height={400}
              className="w-full h-auto object-cover rounded-sm"
              priority
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
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
              <p>{t('paragraph4')}</p>
            </div>

            <div className="mt-12">
              <h2 className="text-2xl font-sans font-bold text-light-text-primary dark:text-dark-text-primary mb-4 border-l-2 border-light-border-accent dark:border-dark-border-accent pl-4">
                {t('experienceTitle')}
              </h2>
              
              <ul className="space-y-4 font-serif text-light-text-secondary dark:text-dark-text-secondary">
                <li className="flex flex-col md:flex-row gap-2 md:gap-4">
                  <span className="text-light-text-muted dark:text-dark-text-muted min-w-[150px]">2024 – Heute</span>
                  <div>
                    <span className="font-semibold">Yeni Safak</span> — Analyst-Writer
                  </div>
                </li>
                <li className="flex flex-col md:flex-row gap-2 md:gap-4">
                  <span className="text-light-text-muted dark:text-dark-text-muted min-w-[150px]">2015 – Heute</span>
                  <div>
                    <span className="font-semibold">KitapAvrupa GmbH</span> — Geschäftsführer | Köln
                  </div>
                </li>
                <li className="flex flex-col md:flex-row gap-2 md:gap-4">
                  <span className="text-light-text-muted dark:text-dark-text-muted min-w-[150px]">Aug. 2019 – Apr. 2020</span>
                  <div>
                    <span className="font-semibold">Qırım Haber Ajansı (QHA)</span> — Genel Yayın Yönetmeni | Kiew
                  </div>
                </li>
                <li className="flex flex-col md:flex-row gap-2 md:gap-4">
                  <span className="text-light-text-muted dark:text-dark-text-muted min-w-[150px]">2011 – 2015</span>
                  <div>
                    <span className="font-semibold">TRT</span> — Auslandskorrespondent | Bonn
                  </div>
                </li>
                <li className="flex flex-col md:flex-row gap-2 md:gap-4">
                  <span className="text-light-text-muted dark:text-dark-text-muted min-w-[150px]">2009 – 2015</span>
                  <div>
                    <span className="font-semibold">Kitapyurdu GmbH</span> — Geschäftsführer | Köln
                  </div>
                </li>
                <li className="flex flex-col md:flex-row gap-2 md:gap-4 mt-6 pt-4 border-t border-light-border-primary dark:border-dark-border-primary">
                  <span className="text-light-text-muted dark:text-dark-text-muted min-w-[150px]">Weitere Stationen</span>
                  <div>
                    BBC World, Deutsche Welle, WDR, Netherlands World Service, Sabah, ATV, Show TV, Sky Türk, TRT Türk
                  </div>
                </li>
              </ul>
            </div>

            <div className="mt-12">
              <h2 className="text-2xl font-sans font-bold text-light-text-primary dark:text-dark-text-primary mb-4 border-l-2 border-light-border-accent dark:border-dark-border-accent pl-4">
                {t('educationTitle')}
              </h2>
              
              <ul className="space-y-4 font-serif text-light-text-secondary dark:text-dark-text-secondary">
                <li className="flex flex-col md:flex-row gap-2 md:gap-4">
                  <span className="text-light-text-muted dark:text-dark-text-muted min-w-[150px]">1987</span>
                  <div>
                    <span className="font-semibold">Universität zu Köln</span> — PhD Ethnologie
                  </div>
                </li>
                <li className="flex flex-col md:flex-row gap-2 md:gap-4">
                  <span className="text-light-text-muted dark:text-dark-text-muted min-w-[150px]">1978–1984</span>
                  <div>
                    <span className="font-semibold">İstanbul Üniversitesi</span> — Magister Soziologie & Anthropologie
                  </div>
                </li>
              </ul>
            </div>

            <div className="mt-12">
              <h2 className="text-2xl font-sans font-bold text-light-text-primary dark:text-dark-text-primary mb-4 border-l-2 border-light-border-accent dark:border-dark-border-accent pl-4">
                {t('volunteerTitle')}
              </h2>
              
              <ul className="space-y-4 font-serif text-light-text-secondary dark:text-dark-text-secondary">
                <li className="flex flex-col md:flex-row gap-2 md:gap-4">
                  <span className="text-light-text-muted dark:text-dark-text-muted min-w-[150px]">1999 – Heute</span>
                  <div>
                    <span className="font-semibold">Kırım Tatar Milli Meclisi</span> — Mitglied & Almanya Temsilcisi
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </article>
      
      {/* FAQ Section */}
      <FAQ items={faqItems} title={tFaq('title')} />
    </div>
    </>
  );
}
