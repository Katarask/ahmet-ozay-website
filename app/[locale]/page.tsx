import { getTranslations, setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import { getArticles } from '@/lib/sanity';
import ArticleCard from '@/components/ArticleCard';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: 'meta' });
  
  return {
    title: t('home.title'),
    description: t('home.description'),
  };
}

export default async function HomePage({ params: { locale } }: { params: { locale: string } }) {
  // Enable static rendering
  setRequestLocale(locale);
  
  const sanityArticles = await getArticles(locale);
  const t = await getTranslations({ locale, namespace: 'home' });

  // Transform Sanity articles to match ArticleCard props
  const articles = sanityArticles.map((article) => ({
    title: article.title[locale as 'de' | 'en' | 'tr'] || article.title.de,
    excerpt: article.excerpt[locale as 'de' | 'en' | 'tr'] || article.excerpt.de,
    date: new Date(article.publishedAt).toLocaleDateString(locale, {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }),
    category: article.category,
    readTime: `${article.readTime} min`,
    slug: article.slug.current,
    image: article.image?.asset ? article.image : undefined,
  }));

  return (
    <div className="mx-auto px-4 py-12">
      {/* Hero Section */}
      <section className="max-w-6xl mx-auto mb-16">
        <div className="flex flex-col md:flex-row gap-8 items-center">
          <div className="hidden md:block md:w-1/4">
            <img 
              src="/images/ahmet-portrait.png" 
              alt="Ahmet Özay"
              className="md:w-56 md:h-auto object-cover rounded-sm"
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
  );
}
