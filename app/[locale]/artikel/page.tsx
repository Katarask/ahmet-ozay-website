import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { getAllArticles } from '@/lib/articles';
import ArticleCard from '@/components/ArticleCard';
import Breadcrumbs from '@/components/Breadcrumbs';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: 'meta' });
  
  return {
    title: t('articles.title'),
    description: t('articles.description'),
  };
}

export default function ArticlesPage({ params: { locale } }: { params: { locale: string } }) {
  const articles = getAllArticles(locale);
  const t = useTranslations('articles');

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <Breadcrumbs 
        items={[
          { label: t('breadcrumb'), href: '/' + locale + '/artikel' }
        ]}
        locale={locale}
      />
      
      <header className="mb-12">
        <h1 className="text-4xl font-sans font-bold text-light-text-primary dark:text-dark-text-primary mb-4">
          {t('title')}
        </h1>
        <p className="text-xl font-serif text-light-text-secondary dark:text-dark-text-secondary">
          {t('subtitle')}
        </p>
      </header>

      <div className="space-y-0">
        {articles.map((article) => (
          <ArticleCard
            key={article.slug}
            {...article}
            locale={locale}
          />
        ))}
      </div>

      {articles.length === 0 && (
        <p className="text-light-text-tertiary dark:text-dark-text-tertiary font-serif italic text-center py-12">
          {t('noArticles')}
        </p>
      )}
    </div>
  );
}
