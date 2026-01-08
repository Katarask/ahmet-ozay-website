import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import { getArticleBySlug, getArticles, urlFor } from '@/lib/sanity';
import PortableTextRenderer from '@/components/PortableTextRenderer';
import ShareButtons from '@/components/ShareButtons';

import { locales } from '@/i18n/config';

export async function generateStaticParams() {
  const articles = await getArticles();
  
  return locales.flatMap((locale) => 
    articles.map((article) => ({
      locale,
      slug: article.slug.current,
    }))
  );
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
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.ahmetoezay.de';
  const articleUrl = `${baseUrl}/${locale}/artikel/${slug}`;
  const imageUrl = article.image?.asset 
    ? urlFor(article.image).width(1200).height(630).fit('crop').url()
    : `${baseUrl}/images/ahmet-portrait.png`;
  
  return {
    title: `${title} | Ahmet Özay`,
    description: excerpt,
    alternates: {
      canonical: articleUrl,
      languages: {
        'de': `${baseUrl}/de/artikel/${slug}`,
        'en': `${baseUrl}/en/artikel/${slug}`,
        'tr': `${baseUrl}/tr/artikel/${slug}`,
      },
    },
    openGraph: {
      title: `${title} | Ahmet Özay`,
      description: excerpt,
      url: articleUrl,
      siteName: 'Ahmet Özay',
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: article.image?.alt || title,
        },
      ],
      locale: locale,
      type: 'article',
      publishedTime: article.publishedAt,
      authors: [article.author],
      section: article.category,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | Ahmet Özay`,
      description: excerpt,
      images: [imageUrl],
      creator: '@aoezay',
    },
  };
}

export default async function ArticlePage({ 
  params: { locale, slug } 
}: { 
  params: { locale: string; slug: string } 
}) {
  // Enable static rendering
  setRequestLocale(locale);
  
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

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.ahmetoezay.de';
  const articleUrl = `${baseUrl}/${locale}/artikel/${slug}`;
  const imageUrl = article.image?.asset 
    ? urlFor(article.image).width(1200).height(630).fit('crop').url()
    : `${baseUrl}/images/ahmet-portrait.png`;

  // Strukturierte Daten (JSON-LD Schema.org)
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description: article.excerpt[locale as 'de' | 'en' | 'tr'] || article.excerpt.de,
    image: imageUrl,
    datePublished: article.publishedAt,
    dateModified: article._createdAt,
    author: {
      '@type': 'Person',
      name: article.author,
      url: `${baseUrl}/${locale}/about`,
    },
    publisher: {
      '@type': 'Person',
      name: 'Ahmet Özay',
      url: baseUrl,
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/images/logo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': articleUrl,
    },
    articleSection: article.category,
    inLanguage: locale,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
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

        {/* Share Buttons */}
        <ShareButtons 
          title={title}
          url={`/${locale}/artikel/${slug}`}
          excerpt={article.excerpt[locale as 'de' | 'en' | 'tr'] || article.excerpt.de}
          locale={locale}
        />

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
    </>
  );
}
