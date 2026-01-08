import { useTranslations } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import { getAllArticles } from '@/lib/articles';
import ArticleCard from '@/components/ArticleCard';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: 'meta' });
  
  return {
    title: t('home.title'),
    description: t('home.description'),
  };
}

export default function HomePage({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale);
  const articles = getAllArticles(locale);
  const t = useTranslations('home');

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* Hero Section */}
      <section className="mb-16">
        <div className="flex flex-col md:flex-row gap-8 items-center">
          <div className="md:w-1/3">
            <img 
              src="/images/ahmet-portrait.png" 
              alt="Ahmet Özay"
              className="w-48 h-48 md:w-full md:h-auto object-cover rounded-sm"
            />
          </div>
          <div className="md:w-2/3">
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
      <section>
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

        <div className="space-y-0">
          {articles.slice(0, 3).map((article) => (
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
