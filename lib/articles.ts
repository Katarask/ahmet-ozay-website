import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

const articlesDirectory = path.join(process.cwd(), 'content/artikel');

export interface ArticleMeta {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  readTime: string;
  image?: string;
  author?: string;
}

export interface Article extends ArticleMeta {
  content: string;
}

export function getArticleSlugs(locale: string): string[] {
  const localeDir = path.join(articlesDirectory, locale);
  if (!fs.existsSync(localeDir)) {
    return [];
  }
  return fs.readdirSync(localeDir).filter(file => file.endsWith('.mdx') || file.endsWith('.md'));
}

export function getArticleBySlug(slug: string, locale: string): Article | null {
  const realSlug = slug.replace(/\.mdx?$/, '');
  const localeDir = path.join(articlesDirectory, locale);
  
  let fullPath = path.join(localeDir, ${realSlug}.mdx);
  if (!fs.existsSync(fullPath)) {
    fullPath = path.join(localeDir, ${realSlug}.md);
  }
  
  if (!fs.existsSync(fullPath)) {
    return null;
  }

  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);

  return {
    slug: realSlug,
    title: data.title || '',
    excerpt: data.excerpt || '',
    date: data.date || '',
    category: data.category || '',
    readTime: data.readTime || '',
    image: data.image || undefined,
    author: data.author || 'Ahmet Özay',
    content,
  };
}

export async function getArticleWithHtml(slug: string, locale: string): Promise<(Article & { htmlContent: string }) | null> {
  const article = getArticleBySlug(slug, locale);
  if (!article) return null;

  const processedContent = await remark()
    .use(html)
    .process(article.content);
  
  return {
    ...article,
    htmlContent: processedContent.toString(),
  };
}

export function getAllArticles(locale: string): ArticleMeta[] {
  const slugs = getArticleSlugs(locale);
  const articles = slugs
    .map(slug => getArticleBySlug(slug, locale))
    .filter((article): article is Article => article !== null)
    .sort((a, b) => (new Date(b.date).getTime() - new Date(a.date).getTime()));

  return articles.map(({ content, ...meta }) => meta);
}
