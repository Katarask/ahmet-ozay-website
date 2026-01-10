import { MetadataRoute } from 'next';
import { getArticles } from '@/lib/sanity';
import { locales } from '@/i18n/config';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.ahmetoezay.de';

  // Statische Seiten
  const staticPages: MetadataRoute.Sitemap = locales.flatMap((locale) => [
    {
      url: `${baseUrl}/${locale}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/${locale}/artikel`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/${locale}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/${locale}/kontakt`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
          {
            url: `${baseUrl}/${locale}/krimtataren`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.9,
          },
          {
            url: `${baseUrl}/${locale}/impressum`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.5,
          },
        ]);

  // Dynamische Artikel-Seiten
  const articles = await getArticles();
  const articlePages: MetadataRoute.Sitemap = locales.flatMap((locale) =>
    articles.map((article) => ({
      url: `${baseUrl}/${locale}/artikel/${article.slug.current}`,
      lastModified: new Date(article.publishedAt),
      changeFrequency: 'weekly',
      priority: 0.8,
    }))
  );

  return [...staticPages, ...articlePages];
}
