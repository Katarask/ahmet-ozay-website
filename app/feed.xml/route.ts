import { getArticles } from '@/lib/sanity';
import { urlFor } from '@/lib/sanity';

export const dynamic = 'force-dynamic';
export const revalidate = 3600; // 1 Stunde Cache

export async function GET() {
  const articles = await getArticles('de'); // Deutsch als Standard
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ahmetoezay.de';

  // RSS XML generieren
  const rssItems = articles.slice(0, 20).map((article) => {
    const articleUrl = `${siteUrl}/de/artikel/${article.slug.current}`;
    const title = article.title.de || article.title.en || article.title.tr;
    const description = article.excerpt.de || article.excerpt.en || article.excerpt.tr || '';
    
    // Bild URL generieren falls vorhanden
    let imageUrl = '';
    if (article.image?.asset) {
      imageUrl = urlFor(article.image).width(1200).height(630).url() || '';
    }

    // Datum formatieren (RFC 822 Format für RSS)
    const pubDate = new Date(article.publishedAt).toUTCString();

    return `
    <item>
      <title><![CDATA[${escapeXml(title)}]]></title>
      <link>${articleUrl}</link>
      <guid isPermaLink="true">${articleUrl}</guid>
      <description><![CDATA[${escapeXml(description)}]]></description>
      ${imageUrl ? `<enclosure url="${imageUrl}" type="image/jpeg" />` : ''}
      <pubDate>${pubDate}</pubDate>
      <author>${escapeXml(article.author || 'Ahmet Özay')}</author>
      <category>${escapeXml(article.category)}</category>
      ${article.tags && article.tags.length > 0 
        ? article.tags.map(tag => `<category>${escapeXml(tag)}</category>`).join('')
        : ''
      }
    </item>`;
  }).join('');

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>Ahmet Özay - Artikel</title>
    <link>${siteUrl}</link>
    <description>Artikel und Analysen von Ahmet Özay zu deutsch-türkischen Beziehungen, der Geschichte der Krimtataren und gesellschaftspolitischen Themen.</description>
    <language>de-DE</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${siteUrl}/feed.xml" rel="self" type="application/rss+xml" />
    ${rssItems}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}

// XML sicher escapen
function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
