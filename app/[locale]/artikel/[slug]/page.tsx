import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import { getArticleBySlug, getArticles, getRelatedArticles, urlFor } from '@/lib/sanity';
import { extractPlainTextFromPortableText, calculateWordCount } from '@/lib/articleUtils';
import { resolveParams } from '@/lib/params';
import PortableTextRenderer from '@/components/PortableTextRenderer';
import ShareButtons from '@/components/ShareButtons';
import Breadcrumbs from '@/components/Breadcrumbs';
import Comments from '@/components/Comments';
import ArticleCard from '@/components/ArticleCard';

import { locales, defaultLocale } from '@/i18n/config';

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
  params 
}: { 
  params?: Promise<{ locale: string; slug: string }> | { locale: string; slug: string } 
}) {
  // Für Artikel-Seiten können wir keinen sinnvollen Fallback für slug verwenden
  // Wenn params undefined ist, sollte generateStaticParams die richtigen Werte liefern
  // Falls nicht, verwenden wir defaultLocale und einen leeren slug (wird später zu notFound führen)
  const { locale, slug } = await resolveParams(params, { locale: defaultLocale, slug: '' });
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
    title: `${title} | Ahmet Özay - Deutscher Krim-Experte`,
    description: excerpt,
    // Keywords entfernt - werden nur im Schema.org verwendet (Meta Keywords werden seit 2009 ignoriert)
    alternates: {
      canonical: articleUrl,
      languages: {
        'de': `${baseUrl}/de/artikel/${slug}`,
        'en': `${baseUrl}/en/artikel/${slug}`,
        'tr': `${baseUrl}/tr/artikel/${slug}`,
      },
    },
    openGraph: {
      title: `${title} | Ahmet Özay - Deutscher Krim-Experte`,
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
      tags: article.tags || [],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | Ahmet Özay - Deutscher Krim-Experte`,
      description: excerpt,
      images: [imageUrl],
      creator: '@aoezay',
      site: '@aoezay',
    },
  };
}

export default async function ArticlePage({ 
  params 
}: { 
  params?: Promise<{ locale: string; slug: string }> | { locale: string; slug: string } 
}) {
  // Für Artikel-Seiten können wir keinen sinnvollen Fallback für slug verwenden
  // Wenn params undefined ist, sollte generateStaticParams die richtigen Werte liefern
  // Falls nicht, verwenden wir defaultLocale und einen leeren slug (wird später zu notFound führen)
  const { locale, slug } = await resolveParams(params, { locale: defaultLocale, slug: '' });
  // Enable static rendering
  setRequestLocale(locale);
  
  const article = await getArticleBySlug(slug);
  const t = await getTranslations({ locale, namespace: 'articles' });

  if (!article) {
    notFound();
  }

  // Artikel für Suchfunktion holen
  const allArticles = await getArticles(locale);
  const searchArticles = allArticles
    .filter((a) => a.publishedAt && a.readTime)
    .map((a) => ({
      slug: a.slug.current,
      title: a.title[locale as 'de' | 'en' | 'tr'] || a.title.de,
      excerpt: a.excerpt[locale as 'de' | 'en' | 'tr'] || a.excerpt.de,
      category: a.category || 'politik',
    }));

  // Verwandte Artikel holen (basierend auf Kategorie und Tags)
  const relatedArticles = await getRelatedArticles(
    slug,
    article.category,
    article.tags,
    4
  );
  
  // Transform related articles for ArticleCard
  const transformedRelatedArticles = relatedArticles
    .filter((a) => a.publishedAt && a.readTime)
    .map((a) => ({
      title: a.title[locale as 'de' | 'en' | 'tr'] || a.title.de,
      excerpt: a.excerpt[locale as 'de' | 'en' | 'tr'] || a.excerpt.de,
      date: new Date(a.publishedAt).toLocaleDateString(locale, {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      }),
      category: a.category || 'politik',
      readTime: `${a.readTime} Min`,
      slug: a.slug.current,
      image: a.image?.asset ? a.image : undefined,
    }));

  const title = article.title[locale as 'de' | 'en' | 'tr'] || article.title.de;
  const content = article.content[locale as 'de' | 'en' | 'tr'] || article.content.de;
  const excerpt = article.excerpt[locale as 'de' | 'en' | 'tr'] || article.excerpt.de;
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

  // Plain Text für articleBody extrahieren (kritisch für AI-Crawling)
  const articleBody = extractPlainTextFromPortableText(content);
  const wordCount = calculateWordCount(content);

  // Strukturierte Daten (JSON-LD Schema.org) - Optimiert für AI-Zitierung
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description: excerpt,
    articleBody: articleBody, // Vollständiger Text für AI-Systeme
    wordCount: wordCount, // Hilft AI-Systemen, Artikel-Tiefe einzuschätzen
    image: imageUrl,
    datePublished: article.publishedAt,
    dateModified: article._updatedAt || article._createdAt,
    author: {
      '@type': 'Person',
      '@id': `${baseUrl}/#ahmetozay`, // @id Verknüpfung für Entity-Disambiguation
      name: article.author,
      url: `${baseUrl}/${locale}/about`,
    },
    publisher: {
      '@type': 'Person',
      '@id': `${baseUrl}/#ahmetozay`, // @id Verknüpfung
      name: 'Ahmet Özay',
      url: baseUrl,
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/images/logo.png`,
      },
    },
    keywords: article.tags?.join(', ') || '', // Keywords aus Tags für AI
    articleSection: article.category,
    inLanguage: locale,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': articleUrl,
    },
    // Speakable für Voice Search (Google Assistant, Siri)
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: ['h1', '.prose-custom p:first-of-type'],
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
        name: t('breadcrumb'),
        item: `${baseUrl}/${locale}/artikel`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: title,
        item: articleUrl,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <div className="mx-auto px-4 py-12">
      {/* Breadcrumbs mit Suchfunktion */}
      <div className="max-w-4xl mx-auto mb-8">
        <Breadcrumbs 
          items={[
            { label: t('breadcrumb'), href: `/${locale}/artikel` },
            { label: title }
          ]}
          locale={locale}
          articles={searchArticles}
          showSearch={true}
        />
      </div>

      {/* Article Header */}
      <article className="max-w-4xl mx-auto">
        <header className="mb-12">
          <div className="flex items-center gap-3 mb-4 text-sm flex-wrap">
            <Link
              href={`/${locale}/artikel?category=${article.category}`}
              className="px-3 py-1 bg-light-bg-secondary dark:bg-dark-bg-secondary text-light-text-primary dark:text-dark-text-primary text-xs font-sans rounded-sm hover:bg-light-accent-primary dark:hover:bg-dark-accent-primary hover:text-white dark:hover:text-white transition-colors"
            >
              {article.category}
            </Link>
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

          <p className="text-light-text-muted dark:text-dark-text-muted font-sans text-sm mb-4">
            {t('by')} {article.author}
          </p>

          {/* Tags */}
          {article.tags && article.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {article.tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/${locale}/artikel?search=${encodeURIComponent(tag)}`}
                  className="px-2 py-1 bg-light-bg-secondary dark:bg-dark-bg-secondary text-light-text-secondary dark:text-dark-text-secondary text-xs font-sans rounded-sm hover:bg-light-accent-primary dark:hover:bg-dark-accent-primary hover:text-white dark:hover:text-white transition-colors"
                >
                  #{tag}
                </Link>
              ))}
            </div>
          )}
        </header>

        {/* Article Content */}
        <div className="prose-custom">
          <PortableTextRenderer content={content} locale={locale} />
        </div>

        {/* Share Buttons */}
        <ShareButtons 
          title={title}
          url={`/${locale}/artikel/${slug}`}
          excerpt={article.excerpt[locale as 'de' | 'en' | 'tr'] || article.excerpt.de}
          locale={locale}
        />

        {/* Comments */}
        <Comments articleSlug={slug} locale={locale} />

        {/* Related Articles */}
        {transformedRelatedArticles.length > 0 && (
          <div className="mt-16 pt-8 border-t border-light-border-primary dark:border-dark-border-primary">
            <h2 className="text-2xl font-sans font-bold text-light-text-primary dark:text-dark-text-primary mb-8 border-l-2 border-light-border-accent dark:border-dark-border-accent pl-4">
              {t('relatedArticles')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {transformedRelatedArticles.map((relatedArticle) => (
                <ArticleCard
                  key={relatedArticle.slug}
                  {...relatedArticle}
                  locale={locale}
                />
              ))}
            </div>
          </div>
        )}

        {/* Article Footer */}
        <footer className="mt-12 pt-8 border-t border-light-border-primary dark:border-dark-border-primary">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <Link
              href={`/${locale}/artikel?category=${article.category}`}
              className="inline-flex items-center gap-2 text-light-accent-primary dark:text-dark-accent-primary hover:underline font-sans font-medium"
            >
              <span>Weitere Artikel in "{article.category}"</span>
            </Link>
            <Link
              href={`/${locale}/artikel`}
              className="inline-flex items-center gap-2 text-light-text-secondary dark:text-dark-text-secondary hover:text-light-accent-primary dark:hover:text-dark-accent-primary hover:underline font-sans font-medium"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="rotate-180">
                <path d="M2 8H14.5M14.5 8L8.5 2M14.5 8L8.5 14" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
              </svg>
              <span>{t('backToAllArticles')}</span>
            </Link>
          </div>
        </footer>
      </article>
    </div>
    </>
  );
}
