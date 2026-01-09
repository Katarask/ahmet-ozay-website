'use client';

import { useState, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Article {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
}

interface SearchBarProps {
  articles: Article[];
  locale: string;
  onSearch?: (query: string) => void;
}

export default function SearchBar({ articles, locale, onSearch }: SearchBarProps) {
  const t = useTranslations('search');
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Article[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Client-seitige Volltextsuche
  const performSearch = (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    const lowerQuery = searchQuery.toLowerCase();
    const matched = articles.filter((article) => {
      const titleMatch = article.title.toLowerCase().includes(lowerQuery);
      const excerptMatch = article.excerpt.toLowerCase().includes(lowerQuery);
      return titleMatch || excerptMatch;
    });

    setResults(matched.slice(0, 5)); // Max 5 Ergebnisse
    setIsOpen(matched.length > 0);
    if (onSearch) {
      onSearch(searchQuery);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    performSearch(value);
    setFocusedIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen || results.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setFocusedIndex((prev) => (prev < results.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setFocusedIndex((prev) => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === 'Enter' && focusedIndex >= 0) {
      e.preventDefault();
      const selectedArticle = results[focusedIndex];
      router.push(`/${locale}/artikel/${selectedArticle.slug}`);
      setIsOpen(false);
      setQuery('');
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      inputRef.current?.blur();
    }
  };

  const handleResultClick = (slug: string) => {
    router.push(`/${locale}/artikel/${slug}`);
    setIsOpen(false);
    setQuery('');
  };

  // Schließe Dropdown beim Klicken außerhalb
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={searchRef} className="relative w-full max-w-md">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => query && performSearch(query)}
          placeholder={t('placeholder')}
          className="w-full px-4 py-2 pl-10 pr-10 bg-light-bg-secondary dark:bg-dark-bg-secondary border border-light-border-primary dark:border-dark-border-primary rounded-sm text-light-text-primary dark:text-dark-text-primary placeholder-light-text-muted dark:placeholder-dark-text-muted focus:outline-none focus:ring-2 focus:ring-light-accent-primary dark:focus:ring-dark-accent-primary focus:border-transparent font-sans text-sm transition-all"
          aria-label={t('ariaLabel')}
          aria-expanded={isOpen}
          aria-haspopup="listbox"
        />
        <svg
          className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-light-text-muted dark:text-dark-text-muted"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        {query && (
          <button
            onClick={() => {
              setQuery('');
              setResults([]);
              setIsOpen(false);
              inputRef.current?.focus();
            }}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-light-text-muted dark:text-dark-text-muted hover:text-light-text-primary dark:hover:text-dark-text-primary transition-colors"
            aria-label={t('clear')}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Dropdown Ergebnisse */}
      {isOpen && results.length > 0 && (
        <div className="absolute z-50 w-full mt-2 bg-light-bg-primary dark:bg-dark-bg-primary border border-light-border-primary dark:border-dark-border-primary rounded-sm shadow-lg max-h-96 overflow-y-auto">
          <div className="p-2">
            {results.map((article, index) => (
              <button
                key={article.slug}
                onClick={() => handleResultClick(article.slug)}
                onMouseEnter={() => setFocusedIndex(index)}
                className={`w-full text-left p-3 rounded-sm transition-colors ${
                  focusedIndex === index
                    ? 'bg-light-bg-secondary dark:bg-dark-bg-secondary'
                    : 'hover:bg-light-bg-secondary dark:hover:bg-dark-bg-secondary'
                }`}
                role="option"
                aria-selected={focusedIndex === index}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-sans font-semibold text-sm text-light-text-primary dark:text-dark-text-primary mb-1 truncate">
                      {article.title}
                    </h3>
                    <p className="font-serif text-xs text-light-text-secondary dark:text-dark-text-secondary line-clamp-2">
                      {article.excerpt}
                    </p>
                    <span className="inline-block mt-2 px-2 py-0.5 text-xs bg-light-bg-secondary dark:bg-dark-bg-secondary text-light-text-muted dark:text-dark-text-muted rounded-sm font-sans">
                      {article.category}
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
          {results.length >= 5 && (
            <div className="px-3 py-2 border-t border-light-border-primary dark:border-dark-border-primary">
              <Link
                href={`/${locale}/artikel?q=${encodeURIComponent(query)}`}
                className="text-xs text-light-accent-primary dark:text-dark-accent-primary hover:underline font-sans"
                onClick={() => setIsOpen(false)}
              >
                {t('showAll')} ({results.length}+)
              </Link>
            </div>
          )}
        </div>
      )}

      {isOpen && query && results.length === 0 && (
        <div className="absolute z-50 w-full mt-2 bg-light-bg-primary dark:bg-dark-bg-primary border border-light-border-primary dark:border-dark-border-primary rounded-sm shadow-lg p-4">
          <p className="text-sm text-light-text-muted dark:text-dark-text-muted font-sans text-center">
            {t('noResults')}
          </p>
        </div>
      )}
    </div>
  );
}
