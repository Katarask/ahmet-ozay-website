import { getTranslations, setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import Image from 'next/image';
import { getArticles } from '@/lib/sanity';
import ArticleCard from '@/components/ArticleCard';
import SearchBar from '@/components/SearchBar';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: 'meta' });
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.ahmetoezay.de';
  const url = `${baseUrl}/${locale}`;
  const imageUrl = `${baseUrl}/images/ahmet-portrait.png`;
  
  return {
    title: t('home.title'),
    description: t('home.description'),
    alternates: {
      canonical: url,
      languages: {
        'de': `${baseUrl}/de`,
        'en': `${baseUrl}/en`,
        'tr': `${baseUrl}/tr`,
      },
    },
    openGraph: {
      title: t('home.title'),
      description: t('home.description'),
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
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: t('home.title'),
      description: t('home.description'),
      images: [imageUrl],
      creator: '@aoezay',
    },
  };
}

export default async function HomePage({ params: { locale } }: { params: { locale: string } }) {
  // Enable static rendering
  setRequestLocale(locale);
  
  const sanityArticles = await getArticles(locale);
  const t = await getTranslations({ locale, namespace: 'home' });

  // Transform Sanity articles to match ArticleCard props
  const articles = sanityArticles
    .filter((article) => article.publishedAt && article.readTime) // Nur Artikel mit publishedAt und readTime
    .map((article) => ({
      title: article.title[locale as 'de' | 'en' | 'tr'] || article.title.de,
      excerpt: article.excerpt[locale as 'de' | 'en' | 'tr'] || article.excerpt.de,
      date: new Date(article.publishedAt!).toLocaleDateString(locale, {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      }),
      category: article.category || 'politik',
      readTime: `${article.readTime} Min`,
      slug: article.slug.current,
      image: article.image?.asset ? article.image : undefined,
    }));

  // Strukturierte Daten (JSON-LD Schema.org) - Person Schema
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.ahmetoezay.de';
  const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Ahmet Özay',
    jobTitle: 'Journalist & Autor',
    description: t('intro'),
    url: `${baseUrl}/${locale}`,
    image: `${baseUrl}/images/ahmet-portrait.png`,
    sameAs: [
      'https://x.com/aoezay',
      'https://www.linkedin.com/in/ahmet-özay-34b97a200/',
    ],
    knowsAbout: ['Journalismus', 'Deutsch-türkische Beziehungen', 'Krimtataren', 'Minderheitenrechte'],
    inLanguage: locale,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <div className="mx-auto px-4 py-12">
      {/* Hero Section */}
      <section className="max-w-6xl mx-auto mb-16">
        <div className="flex flex-col md:flex-row gap-8 items-center">
          <div className="hidden md:block md:w-1/4">
            <Image
              src="/images/ahmet-portrait.png"
              alt="Ahmet Özay"
              width={224}
              height={300}
              className="object-cover rounded-sm"
              priority
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
            />
          </div>
          <div className="w-full md:w-3/4">
            <p className="eyebrow text-xs uppercase tracking-[0.2em] text-light-text-tertiary dark:text-dark-text-tertiary mb-4">
              {t('eyebrow')}
            </p>
            <h1 className="text-4xl md:text-5xl font-sans font-bold text-light-text-primary dark:text-dark-text-primary mb-4">
              Ahmet Özay
            </h1>
            <p className="paragraph_large text-xl font-serif text-light-text-secondary dark:text-dark-text-secondary border-l-2 border-light-border-accent dark:border-dark-border-accent pl-5 leading-relaxed">
              {t('intro')}
            </p>
          </div>
        </div>
      </section>

      {/* Articles Section */}
      <section className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-sans font-bold text-light-text-primary dark:text-dark-text-primary">
            {t('latestArticles')}
          </h2>
          <Link 
            href={'/' + locale + '/artikel'}
            className="text-light-accent-primary dark:text-dark-accent-primary hover:underline font-sans"
          >
            {t('viewAll')}
          </Link>
        </div>

        {/* Suchleiste */}
        <div className="mb-8">
          <SearchBar 
            articles={articles.map(article => ({
              slug: article.slug,
              title: article.title,
              excerpt: article.excerpt,
              category: article.category,
            }))}
            locale={locale}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
          {articles.slice(0, 6).map((article) => (
            <ArticleCard
              key={article.slug}
              {...article}
              locale={locale}
            />
          ))}
        </div>

        {articles.length === 0 && (
          <p className="text-light-text-tertiary dark:text-dark-text-tertiary font-serif italic">
            {t('noArticles')}
          </p>
        )}
      </section>
    </div>
    </>
  );
}
