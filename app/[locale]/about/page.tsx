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
    keywords: [
      'Ahmet Özay',
      'Deutscher Krim Experte',
      'Krim Experte Deutschland',
      'Krim Experte Köln',
      'Journalist Köln',
      'Deutsch-türkischer Journalist',
      'Krimtataren',
      'Krim Tatar Experte',
      'Krim Experte',
      'Kırım Tatar Milli Meclisi',
      'WDR',
      'BBC',
      'Deutsche Welle',
      'TRT',
      'QHA',
      'Medienexperte',
      'Krim-Analyse',
      'Krimtataren Deutschland',
    ],
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
      profile: {
        firstName: 'Ahmet',
        lastName: 'Özay',
        username: 'aoezay',
      },
    },
    twitter: {
      card: 'summary_large_image',
      title: t('about.title'),
      description: t('about.description'),
      images: [imageUrl],
      creator: '@aoezay',
      site: '@aoezay',
    },
  };
}

export default async function AboutPage({ params: { locale } }: { params: { locale: string } }) {
  // Enable static rendering
  setRequestLocale(locale);
  
  const t = await getTranslations({ locale, namespace: 'about' });
  const tFaq = await getTranslations({ locale, namespace: 'faq' });
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.ahmetoezay.de';
  const url = `${baseUrl}/${locale}/about`;
  const imageUrl = `${baseUrl}/images/ahmet-portrait.png`;
  
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

  // Erweiterte Person Schema für About-Seite
  const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': 'https://www.ahmetoezay.de/#ahmetozay',
    name: 'Ahmet Özay',
    givenName: 'Ahmet',
    familyName: 'Özay',
    alternateName: ['Ahmet Özay', 'Ahmet Ozay'],
    jobTitle: ['Journalist', 'Autor', 'Krim-Experte', 'Medienexperte', 'Verleger'],
    description: t('intro'),
    url: `${baseUrl}/${locale}/about`,
    image: imageUrl,
    email: 'ao@ahmetoezay.de',
    birthDate: '1961-11-01',
    birthPlace: {
      '@type': 'Place',
      name: 'Istanbul, Türkei',
    },
    homeLocation: {
      '@type': 'Place',
      name: 'Köln, Deutschland',
    },
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Köln',
      addressCountry: 'DE',
    },
    alumniOf: [
      {
        '@type': 'EducationalOrganization',
        name: 'Istanbul Üniversitesi',
        description: 'Magister Soziologie & Anthropologie (1978-1984)',
      },
      {
        '@type': 'EducationalOrganization',
        name: 'Universität zu Köln',
        description: 'PhD Ethnologie (1987)',
      },
    ],
    worksFor: [
      {
        '@type': 'Organization',
        name: 'Yeni Safak',
        jobTitle: 'Analyst-Writer',
      },
      {
        '@type': 'Organization',
        name: 'KitapAvrupa GmbH',
        jobTitle: 'Geschäftsführer',
      },
    ],
    memberOf: [
      {
        '@type': 'Organization',
        name: 'Kırım Tatar Milli Meclisi',
        alternateName: 'Mejlis of the Crimean Tatar People',
        jobTitle: 'Mitglied & Almanya Temsilcisi',
      },
      {
        '@type': 'Organization',
        name: 'Weltkongress der Krimtataren',
        alternateName: 'World Congress of Crimean Tatars',
        jobTitle: 'Exekutivkomitee',
      },
    ],
    sameAs: [
      'https://x.com/aoezay',
      'https://www.instagram.com/ahmet_oezay/',
      'https://www.linkedin.com/in/ahmet-özay-34b97a200/',
      'https://www.facebook.com/ahmet.ozay.501/',
      'https://wikitia.com/wiki/Ahmet_%C3%95zay',
      'https://www.yenisafak.com/yazarlar/ahmet-ozay',
    ],
    knowsAbout: [
      // Krimtataren (mehrsprachig + Synonyme)
      'Krimtataren',
      'Crimean Tatars',
      'Kırım Tatarları',
      'Krim Tatar',
      'Krimtataren Deutschland',
      'Crimean Tatars Germany',
      'Krimtataren Experte',
      'Krimtataren Experte Deutschland',
      'Deutscher Krimtataren Experte',
      'Krim Tatar Milli Meclisi',
      'Crimean Tatar People\'s Mejlis',
      'Kırım Tatar Milli Meclisi',
      // Krim-Expertise (mehrsprachig)
      'Krim-Experte',
      'Crimea Expert',
      'Kırım Uzmanı',
      'Deutscher Krim Experte',
      'German Crimea Expert',
      'Krim Experte Deutschland',
      'Krim Experte Köln',
      'Crimea Expert Cologne',
      'Krim-Analyse',
      'Crimea Analysis',
      'Krim-Politik',
      'Crimea Politics',
      'Krim-Annexion',
      'Crimea Annexation',
      'Krim-Konflikt',
      'Crimea Conflict',
      'Krim-Plattform',
      'Crimea Platform',
      // Geopolitik & Regionen
      'Ukraine',
      'Ukraine-Konflikt',
      'Ukraine War',
      'Russland',
      'Russia',
      'Rusya',
      'Russland-Ukraine Konflikt',
      'Russia-Ukraine Conflict',
      'Schwarzes Meer',
      'Black Sea',
      'Osteuropa',
      'Eastern Europe',
      'Europa',
      'Europe',
      'Avrupa',
      // Deutsch-Türkische Beziehungen
      'Deutsch-türkische Beziehungen',
      'German-Turkish Relations',
      'Türk-Alman İlişkileri',
      'Türkei-Europa Beziehungen',
      'Turkey-Europe Relations',
      'Türkiye-Avrupa İlişkileri',
      'Deutschland-Türkei',
      'Germany-Turkey',
      'Almanya-Türkiye',
      // Diaspora & Migration
      'Türkische Diaspora Deutschland',
      'Turkish Diaspora Germany',
      'Almanya Türk Diasporası',
      'Migration',
      'Integration',
      'Minderheitenrechte',
      'Minority Rights',
      'Azınlık Hakları',
      'Menschenrechte',
      'Human Rights',
      'İnsan Hakları',
      // Journalismus & Medien
      'Journalismus',
      'Journalism',
      'Gazetecilik',
      'Medienexperte',
      'Media Expert',
      'Medya Uzmanı',
      'Pressefreiheit',
      'Press Freedom',
      'Basın Özgürlüğü',
      'Auslandskorrespondent',
      'Foreign Correspondent',
      'Yurtdışı Muhabiri',
      'Medienanalyse',
      'Media Analysis',
      'Medya Analizi',
      // Ethnologie & Anthropologie
      'Ethnologie',
      'Ethnology',
      'Etnoloji',
      'Anthropologie',
      'Anthropology',
      'Antropoloji',
      'Soziologie',
      'Sociology',
      'Sosyoloji',
      'Kulturwissenschaft',
      'Cultural Studies',
      'Kültür Bilimleri',
      // Weitere relevante Themen
      'Geopolitik',
      'Geopolitics',
      'Jeopolitika',
      'Internationale Beziehungen',
      'International Relations',
      'Uluslararası İlişkiler',
      'EU-Politik',
      'EU Politics',
      'AB Politikası',
      'NATO',
      'NATO Politik',
      'NATO Politikası',
    ],
    inLanguage: locale,
    nationality: {
      '@type': 'Country',
      name: 'Deutschland',
    },
  };

  // Organization Schema für KitapAvrupa
  const kitapAvrupaSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'KitapAvrupa GmbH',
    founder: {
      '@id': 'https://www.ahmetoezay.de/#ahmetozay',
    },
    foundingDate: '2015',
    url: 'https://www.kitapavrupa.com',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Köln',
      addressCountry: 'DE',
    },
  };

  // BreadcrumbList Schema
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Startseite',
        item: `${baseUrl}/${locale}`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: t('breadcrumb'),
        item: url,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(kitapAvrupaSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
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
              sizes="(max-width: 768px) 100vw, 300px"
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
