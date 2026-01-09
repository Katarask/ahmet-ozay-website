import { getTranslations, setRequestLocale } from 'next-intl/server';
import Breadcrumbs from '@/components/Breadcrumbs';
import FAQ from '@/components/FAQ';
import { getArticles } from '@/lib/sanity';
import ArticleCard from '@/components/ArticleCard';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: 'meta' });
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.ahmetoezay.de';
  const url = `${baseUrl}/${locale}/krimtataren`;
  const imageUrl = `${baseUrl}/images/ahmet-portrait.png`;
  
  return {
    title: t('krimtataren.title'),
    description: t('krimtataren.description'),
    keywords: [
      'Krimtataren',
      'Crimean Tatars',
      'Kırım Tatarları',
      'Krimtataren Experte',
      'Krimtataren Experte Deutschland',
      'Deutscher Krimtataren Experte',
      'Krim Experte',
      'Crimea Expert',
      'Krim Tatar Milli Meclisi',
      'Crimean Tatar People\'s Mejlis',
      'Kırım Tatar Milli Meclisi',
      'Krim-Analyse',
      'Crimea Analysis',
      'Krim-Politik',
      'Crimea Politics',
      'Krim-Annexion',
      'Crimea Annexation',
      'Ahmet Özay',
      'Krimtataren Deutschland',
      'Crimean Tatars Germany',
    ],
    alternates: {
      canonical: url,
      languages: {
        'de': `${baseUrl}/de/krimtataren`,
        'en': `${baseUrl}/en/krimtataren`,
        'tr': `${baseUrl}/tr/krimtataren`,
      },
    },
    openGraph: {
      title: t('krimtataren.title'),
      description: t('krimtataren.description'),
      url: url,
      siteName: 'Ahmet Özay',
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: 'Ahmet Özay - Krimtataren Experte',
        },
      ],
      locale: locale,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: t('krimtataren.title'),
      description: t('krimtataren.description'),
      images: [imageUrl],
      creator: '@aoezay',
      site: '@aoezay',
    },
  };
}

export default async function KrimtatarenPage({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale);
  
  const t = await getTranslations({ locale, namespace: 'krimtataren' });
  const tFaq = await getTranslations({ locale, namespace: 'krimtatarenFaq' });
  const tBreadcrumbs = await getTranslations({ locale, namespace: 'breadcrumbs' });
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.ahmetoezay.de';
  
  // FAQ-Daten aus Übersetzungen laden
  const faqItems = tFaq.raw('items') as Array<{ question: string; answer: string }>;
  
  // FAQ Schema.org (JSON-LD) - optimiert für KI
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

  // BreadcrumbList Schema
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: tBreadcrumbs('home'),
        item: `${baseUrl}/${locale}`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: t('title'),
      },
    ],
  };

  // WebPage Schema mit Topic
  const webPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: t('title'),
    description: t('description'),
    url: `${baseUrl}/${locale}/krimtataren`,
    inLanguage: locale,
    about: {
      '@type': 'Thing',
      name: 'Krimtataren',
      alternateName: ['Crimean Tatars', 'Kırım Tatarları'],
      description: 'Krimtataren sind eine turksprachige Minderheit auf der Krim-Halbinsel',
    },
    mainEntity: {
      '@type': 'Person',
      name: 'Ahmet Özay',
      jobTitle: 'Krim-Experte',
      knowsAbout: [
        'Krimtataren',
        'Crimean Tatars',
        'Kırım Tatarları',
        'Krim-Politik',
        'Crimea Politics',
        'Krim-Analyse',
        'Crimea Analysis',
      ],
    },
  };

  // Artikel mit Krimtataren-Bezug laden (alle Artikel, da Krimtataren-Thematik in verschiedenen Kategorien vorkommt)
  const allArticles = await getArticles(locale);
  // Filtere Artikel, die Krimtataren-relevante Tags oder Kategorien haben
  const filteredArticles = allArticles.filter(article => 
    article.tags?.some(tag => 
      tag.toLowerCase().includes('krim') || 
      tag.toLowerCase().includes('krimtataren') ||
      tag.toLowerCase().includes('ukraine') ||
      tag.toLowerCase().includes('russland')
    ) || 
    article.category === 'politik'
  );
  
  // Transform Sanity articles to match ArticleCard props
  const krimtatarenArticles = filteredArticles
    .filter((article) => article.publishedAt && article.readTime)
    .map((article) => ({
      title: article.title[locale as 'de' | 'en' | 'tr'] || article.title.de,
      excerpt: article.excerpt[locale as 'de' | 'en' | 'tr'] || article.excerpt.de,
      date: new Date(article.publishedAt).toLocaleDateString(locale, {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      }),
      category: article.category || 'politik',
      readTime: `${article.readTime} Min`,
      slug: article.slug.current,
      image: article.image?.asset ? article.image : undefined,
    }));

  return (
    <>
      {/* Schema.org Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(webPageSchema),
        }}
      />

      <div className="mx-auto px-4 py-12">
        <section className="max-w-4xl mx-auto">
          {/* Breadcrumbs */}
          <Breadcrumbs
            items={[
              { label: t('title'), href: undefined },
            ]}
            locale={locale}
          />

          {/* Hero Section */}
          <div className="mt-8 mb-12">
            <h1 className="heading_h1 text-4xl md:text-5xl font-sans font-bold text-light-text-primary dark:text-dark-text-primary mb-6">
              {t('title')}
            </h1>
            <p className="text-xl font-serif text-light-text-secondary dark:text-dark-text-secondary leading-relaxed border-l-4 border-light-border-accent dark:border-dark-border-accent pl-6 mb-6">
              {t('intro')}
            </p>
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <div className="font-serif text-light-text-secondary dark:text-dark-text-secondary leading-relaxed space-y-4">
                {t.raw('content')?.map((paragraph: string, index: number) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </div>
          </div>

          {/* Expertise Section */}
          <div className="mt-12 mb-12">
            <h2 className="text-2xl font-sans font-bold text-light-text-primary dark:text-dark-text-primary mb-6 border-l-2 border-light-border-accent dark:border-dark-border-accent pl-4">
              {t('expertiseTitle')}
            </h2>
            <ul className="space-y-4 font-serif text-light-text-secondary dark:text-dark-text-secondary">
              {t.raw('expertise')?.map((item: { title: string; description: string }, index: number) => (
                <li key={index} className="border-l-2 border-light-border-primary dark:border-dark-border-primary pl-4">
                  <h3 className="font-semibold text-light-text-primary dark:text-dark-text-primary mb-2">
                    {item.title}
                  </h3>
                  <p>{item.description}</p>
                </li>
              ))}
            </ul>
          </div>

          {/* FAQ Section */}
          <FAQ items={faqItems} title={tFaq('title')} />

          {/* Related Articles */}
          {krimtatarenArticles && krimtatarenArticles.length > 0 && (
            <div className="mt-16">
              <h2 className="text-2xl font-sans font-bold text-light-text-primary dark:text-dark-text-primary mb-8 border-l-2 border-light-border-accent dark:border-dark-border-accent pl-4">
                {t('relatedArticlesTitle')}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {krimtatarenArticles.slice(0, 4).map((article) => (
                  <ArticleCard
                    key={article.slug}
                    {...article}
                    locale={locale}
                  />
                ))}
              </div>
            </div>
          )}
        </section>
      </div>
    </>
  );
}
