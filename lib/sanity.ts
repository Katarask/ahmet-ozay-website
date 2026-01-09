import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: process.env.NODE_ENV === 'production',
});

const builder = imageUrlBuilder(client);

export function urlFor(source: any) {
  return builder.image(source);
}

// Typen für Artikel
export interface Article {
  _id: string;
  _createdAt: string;
  title: {
    de: string;
    en: string;
    tr: string;
  };
  slug: {
    current: string;
  };
  excerpt: {
    de: string;
    en: string;
    tr: string;
  };
  content: {
    de: any[];
    en: any[];
    tr: any[];
  };
  category: string;
  publishedAt: string;
  author: string;
  readTime: number;
  featured: boolean;
  tags?: string[];
  image?: {
    asset: any;
    alt: string;
  };
}

// Artikel abrufen (alle)
export async function getArticles(locale: string = 'de'): Promise<Article[]> {
  const query = `*[_type == "article" && !(_id in path("drafts.**")) && defined(publishedAt)] | order(publishedAt desc) {
    _id,
    _createdAt,
    title,
    slug,
    excerpt,
    category,
    publishedAt,
    author,
    readTime,
    featured,
    tags,
    image {
      asset,
      alt
    }
  }`;

  return client.fetch(query);
}

// Einzelnen Artikel abrufen
export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const query = `*[_type == "article" && slug.current == $slug && !(_id in path("drafts.**")) && defined(publishedAt)][0] {
    _id,
    _createdAt,
    title,
    slug,
    excerpt,
    content,
    category,
    publishedAt,
    author,
    readTime,
    featured,
    tags,
    image {
      asset,
      alt
    }
  }`;

  return client.fetch(query, { slug });
}

// Artikel nach Kategorie filtern
export async function getArticlesByCategory(category: string): Promise<Article[]> {
  const query = `*[_type == "article" && category == $category && !(_id in path("drafts.**")) && defined(publishedAt)] | order(publishedAt desc) {
    _id,
    _createdAt,
    title,
    slug,
    excerpt,
    category,
    publishedAt,
    author,
    readTime,
    featured,
    tags,
    image {
      asset,
      alt
    }
  }`;

  return client.fetch(query, { category });
}

// Hervorgehobene Artikel (für Startseite)
export async function getFeaturedArticles(): Promise<Article[]> {
  const query = `*[_type == "article" && featured == true && !(_id in path("drafts.**")) && defined(publishedAt)] | order(publishedAt desc) [0...6] {
    _id,
    _createdAt,
    title,
    slug,
    excerpt,
    category,
    publishedAt,
    author,
    readTime,
    featured,
    tags,
    image {
      asset,
      alt
    }
  }`;

  return client.fetch(query);
}

