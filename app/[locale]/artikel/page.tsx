import { getTranslations, setRequestLocale } from 'next-intl/server';
import { getArticles } from '@/lib/sanity';
import ArticlesPageClient from './ArticlesPageClient';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: 'meta' });
  
  return {
    title: t('articles.title'),
    description: t('articles.description'),
  };
}

export default async function ArticlesPage({ params: { locale } }: { params: { locale: string } }) {
  // Enable static rendering
  setRequestLocale(locale);
  
  const sanityArticles = await getArticles(locale);
  
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
  
  // Extract unique categories
  const categories = Array.from(new Set(articles.map(article => article.category)));

  return <ArticlesPageClient articles={articles} locale={locale} categories={categories} />;
}
