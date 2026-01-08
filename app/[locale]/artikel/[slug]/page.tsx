import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { getArticleWithHtml, getArticleSlugs } from '@/lib/articles';
import Breadcrumbs from '@/components/Breadcrumbs';
import ReadingProgress from '@/components/ReadingProgress';
import { locales } from '@/i18n/config';

export async function generateStaticParams() {
  const params: { locale: string; slug: string }[] = [];
  
  for (const locale of locales) {
    const slugs = getArticleSlugs(locale);
    for (const slug of slugs) {
      params.push({
        locale,
        slug: slug.replace(/\.mdx?$/, ''),
      });
    }
  }
  
  return params;
}

export async function generateMetadata({ 
  params: { locale, slug } 
}: { 
  params: { locale: string; slug: string } 
}) {
  const article = await getArticleWithHtml(slug, locale);
  
  if (!article) {
    return { title: 'Article Not Found' };
  }
  
  return {
    title: article.title + ' | Ahmet Özay',
    description: article.excerpt,
  };
}

export default async function ArticlePage({ 
  params: { locale, slug } 
}: { 
  params: { locale: string; slug: string } 
}) {
  setRequestLocale(locale);
  const article = await getArticleWithHtml(slug, locale);
  const t = await getTranslations({ locale, namespace: 'articles' });

  if (!article) {
    notFound();
  }

  return (
    <>
      <ReadingProgress />
      
      <article className="max-w-3xl mx-auto px-4 py-12">
        <Breadcrumbs 
          items={[
            { label: t('breadcrumb'), href: '/' + locale + '/artikel' },
            { label: article.title }
          ]}
          locale={locale}
        />
        
        <header className="mb-12">
          <div className="flex items-center gap-4 mb-4">
            <span className="tag px-3 py-1 text-sm bg-light-bg-tertiary dark:bg-dark-bg-tertiary rounded-lg text-light-text-secondary dark:text-dark-text-secondary">
              {article.category}
            </span>
            <span className="text-light-text-muted dark:text-dark-text-muted text-sm">
              {article.date}
            </span>
            <span className="text-light-text-muted dark:text-dark-text-muted text-sm">
              {article.readTime}
            </span>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-sans font-bold text-light-text-primary dark:text-dark-text-primary mb-4 leading-tight">
            {article.title}
          </h1>
          
          <p className="text-xl font-serif text-light-text-secondary dark:text-dark-text-secondary border-l-2 border-light-border-accent dark:border-dark-border-accent pl-5">
            {article.excerpt}
          </p>
          
          {article.author && (
            <p className="mt-4 text-sm text-light-text-tertiary dark:text-dark-text-tertiary">
              {t('by')} <span className="font-medium">{article.author}</span>
            </p>
          )}
        </header>

        {article.image && (
          <figure className="mb-12">
            <img 
              src={article.image} 
              alt={article.title}
              className="w-full h-auto"
            />
          </figure>
        )}

        <div 
          className="prose prose-lg max-w-none font-serif
            prose-headings:font-sans prose-headings:text-light-text-primary dark:prose-headings:text-dark-text-primary
            prose-p:text-light-text-secondary dark:prose-p:text-dark-text-secondary prose-p:leading-relaxed
            prose-a:text-light-accent-primary dark:prose-a:text-dark-accent-primary prose-a:no-underline hover:prose-a:underline
            prose-blockquote:border-l-2 prose-blockquote:border-light-border-accent dark:prose-blockquote:border-dark-border-accent
            prose-blockquote:pl-5 prose-blockquote:italic prose-blockquote:text-light-text-tertiary dark:prose-blockquote:text-dark-text-tertiary"
          dangerouslySetInnerHTML={{ __html: article.htmlContent }}
        />
      </article>
    </>
  );
}
