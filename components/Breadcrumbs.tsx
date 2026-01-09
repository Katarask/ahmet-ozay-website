'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import SearchBar from './SearchBar';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface Article {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  locale: string;
  articles?: Article[];
  showSearch?: boolean;
}

export default function Breadcrumbs({ items, locale, articles = [], showSearch = false }: BreadcrumbsProps) {
  const t = useTranslations('breadcrumbs');

  return (
    <div className="flex items-center justify-between gap-4 flex-wrap">
      <nav aria-label="Breadcrumb" className="breadcrumbs flex-1 min-w-0">
        <ol className="flex items-center gap-2" itemScope itemType="https://schema.org/BreadcrumbList">
          <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
            <Link href={`/${locale}`} itemProp="item">
              <span itemProp="name">{t('home')}</span>
            </Link>
            <meta itemProp="position" content="1" />
          </li>
          
          {items.map((item, index) => (
            <li
              key={index}
              itemProp="itemListElement"
              itemScope
              itemType="https://schema.org/ListItem"
              className="flex items-center gap-2"
            >
              <span className="separator" aria-hidden="true">/</span>
              {item.href ? (
                <Link href={item.href} itemProp="item">
                  <span itemProp="name">{item.label}</span>
                </Link>
              ) : (
                <span className="current" itemProp="name" aria-current="page">
                  {item.label}
                </span>
              )}
              <meta itemProp="position" content={String(index + 2)} />
            </li>
          ))}
        </ol>
      </nav>

      {showSearch && articles.length > 0 && (
        <div className="flex-shrink-0">
          <SearchBar articles={articles} locale={locale} />
        </div>
      )}
    </div>
  );
}
