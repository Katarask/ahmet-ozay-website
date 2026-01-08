import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { getArticleBySlug, getArticles } from '@/lib/sanity';
import PortableTextRenderer from '@/components/PortableTextRenderer';

export async function generateStaticParams() {
  const articles = await getArticles();
  
  return articles.map((article) => ({
    slug: article.slug.current,
  }));
}

export async function generateMetadata({ 
  params: { locale, slug } 
}: { 
  params: { locale: string; slug: string } 
}) {
  const article = await getArticleBySlug(slug);
  
  if (!article) return { title: 'Artikel nicht gefunden' };

  const title = article.title[locale as 'de' | 'en' | 'tr'] || article.title.de;
  const excerpt = article.excerpt[locale as 'de' | 'en' | 'tr'] || article.excerpt.de;
  
  return {
    title: `${title} | Ahmet Özay`,
    description: excerpt,
  };
}

export default async function ArticlePage({ 
  params: { locale, slug } 
}: { 
  params: { locale: string; slug: string } 
}) {
  const article = await getArticleBySlug(slug);
  const t = await getTranslations({ locale, namespace: 'articles' });

  if (!article) {
    notFound();
  }

  const title = article.title[locale as 'de' | 'en' | 'tr'] || article.title.de;
  const content = article.content[locale as 'de' | 'en' | 'tr'] || article.content.de;
  const formattedDate = new Date(article.publishedAt).toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="mx-auto px-4 py-12">
      {/* Breadcrumbs */}
      <nav className="max-w-4xl mx-auto mb-8">
        <ol className="flex items-center gap-2 text-sm text-light-text-muted dark:text-dark-text-muted font-sans">
          <li>
            <Link 
              href={`/${locale}`}
              className="hover:text-light-accent-primary dark:hover:text-dark-accent-primary transition-colors"
            >
              Home
            </Link>
          </li>
          <li>/</li>
          <li>
            <Link 
              href={`/${locale}/artikel`}
              className="hover:text-light-accent-primary dark:hover:text-dark-accent-primary transition-colors"
            >
              {t('breadcrumb')}
            </Link>
          </li>
          <li>/</li>
          <li className="text-light-text-tertiary dark:text-dark-text-tertiary truncate max-w-xs">
            {title}
          </li>
        </ol>
      </nav>

      {/* Article Header */}
      <article className="max-w-4xl mx-auto">
        <header className="mb-12">
          <div className="flex items-center gap-3 mb-4 text-sm flex-wrap">
            <span className="px-3 py-1 bg-light-bg-secondary dark:bg-dark-bg-secondary text-light-text-primary dark:text-dark-text-primary text-xs font-sans rounded-sm">
              {article.category}
            </span>
            <div className="flex items-center gap-2 text-light-text-muted dark:text-dark-text-muted">
              <span className="font-sans font-medium">{article.readTime}</span>
              <span className="font-sans">Minuten</span>
            </div>
            <span className="text-light-text-muted dark:text-dark-text-muted font-sans">
              {formattedDate}
            </span>
          </div>

          <h1 className="heading_h1 text-4xl md:text-5xl font-sans font-bold text-light-text-primary dark:text-dark-text-primary mb-6">
            {title}
          </h1>

          <p className="text-light-text-muted dark:text-dark-text-muted font-sans text-sm">
            {t('by')} {article.author}
          </p>
        </header>

        {/* Article Content */}
        <div className="prose-custom">
          <PortableTextRenderer content={content} />
        </div>

        {/* Article Footer */}
        <footer className="mt-16 pt-8 border-t border-light-border-primary dark:border-dark-border-primary">
          <Link
            href={`/${locale}/artikel`}
            className="inline-flex items-center gap-2 text-light-accent-primary dark:text-dark-accent-primary hover:underline font-sans font-medium"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="rotate-180">
              <path d="M2 8H14.5M14.5 8L8.5 2M14.5 8L8.5 14" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
            </svg>
            <span>Zurück zu allen Artikeln</span>
          </Link>
        </footer>
      </article>
    </div>
  );
}
