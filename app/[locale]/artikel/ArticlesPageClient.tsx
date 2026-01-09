'use client';

import { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import ArticleCard from '@/components/ArticleCard';
import Breadcrumbs from '@/components/Breadcrumbs';
import ArticleFilter from '@/components/ArticleFilter';

interface Article {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  readTime: string;
  image?: any;
}

interface ArticlesPageClientProps {
  articles: Article[];
  locale: string;
  categories: string[];
}

export default function ArticlesPageClient({ articles, locale, categories }: ArticlesPageClientProps) {
  const t = useTranslations('articles');
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('q') || '';
  const [selectedCategory, setSelectedCategory] = useState('Alle');
  const [searchTerm, setSearchTerm] = useState(searchQuery);

  // Artikel für Suchfunktion vorbereiten
  const searchArticles = useMemo(() => 
    articles.map(article => ({
      slug: article.slug,
      title: article.title,
      excerpt: article.excerpt,
      category: article.category,
    })), 
    [articles]
  );

  // Filterung nach Kategorie und Suche
  const filteredArticles = useMemo(() => {
    let filtered = selectedCategory === 'Alle' 
      ? articles 
      : articles.filter(article => article.category === selectedCategory);

    if (searchTerm.trim()) {
      const lowerSearch = searchTerm.toLowerCase();
      filtered = filtered.filter(article => 
        article.title.toLowerCase().includes(lowerSearch) ||
        article.excerpt.toLowerCase().includes(lowerSearch)
      );
    }

    return filtered;
  }, [articles, selectedCategory, searchTerm]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <Breadcrumbs 
        items={[
          { label: t('breadcrumb'), href: '/' + locale + '/artikel' }
        ]}
        locale={locale}
        articles={searchArticles}
        showSearch={true}
      />
      
      <header className="mb-12">
        <h1 className="text-4xl font-sans font-bold text-light-text-primary dark:text-dark-text-primary mb-4">
          {t('title')}
        </h1>
        <p className="text-xl font-serif text-light-text-secondary dark:text-dark-text-secondary">
          {t('subtitle')}
        </p>
      </header>

      <ArticleFilter 
        onFilterChange={setSelectedCategory}
        categories={categories}
      />

      {searchTerm && (
        <div className="mb-6 p-4 bg-light-bg-secondary dark:bg-dark-bg-secondary rounded-sm border border-light-border-primary dark:border-dark-border-primary">
          <p className="text-sm font-sans text-light-text-primary dark:text-dark-text-primary">
            {t('searchResults', { count: filteredArticles.length, query: searchTerm })}
          </p>
        </div>
      )}

      <div className="space-y-0">
        {filteredArticles.map((article) => (
          <ArticleCard
            key={article.slug}
            {...article}
            locale={locale}
          />
        ))}
      </div>

      {filteredArticles.length === 0 && (
        <p className="text-light-text-tertiary dark:text-dark-text-tertiary font-serif italic text-center py-12">
          {searchTerm ? t('noSearchResults') : t('noArticles')}
        </p>
      )}
    </div>
  );
}

