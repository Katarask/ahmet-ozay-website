import { NextRequest, NextResponse } from 'next/server';

/**
 * Vercel Cron Job für automatische Sitemap-Submission
 * 
 * Läuft täglich um Mitternacht (UTC)
 * 
 * Konfiguriert in vercel.json:
 * - Schedule: "0 0 * * *" (täglich um 00:00 UTC)
 * 
 * Diese Route submitted die Sitemap automatisch an:
 * - Bing Webmaster Tools (via Sitemap Ping) ✅
 * - Yandex (via Sitemap Ping) ✅
 * 
 * HINWEIS: Google Sitemap Ping ist deprecated (seit Juni 2023)
 * → Sitemap muss einmalig manuell in Google Search Console eingereicht werden
 * → Danach crawlt Google die Sitemap automatisch regelmäßig
 */
export async function GET(request: NextRequest) {
  try {
    // Prüfe ob Request von Vercel Cron kommt
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.ahmetoezay.de';
    const sitemapUrl = `${baseUrl}/sitemap.xml`;

    const results: any[] = [];

    // Google Sitemap Ping ist DEPRECATED (seit Juni 2023)
    // → Sitemap muss manuell in Google Search Console eingereicht werden
    // → Danach crawlt Google die Sitemap automatisch regelmäßig
    results.push({
      engine: 'google',
      method: 'manual_required',
      status: 'deprecated',
      message: 'Google Sitemap Ping is deprecated. Submit manually in Google Search Console once, then Google will crawl automatically.',
      url: 'https://search.google.com/search-console',
      sitemapUrl,
      note: 'After manual submission, Google will crawl the sitemap automatically.',
    });

    // Bing Webmaster Tools - Ping via IndexNow
    try {
      const bingPing = await fetch('https://www.bing.com/ping?sitemap=' + encodeURIComponent(sitemapUrl));
      results.push({
        engine: 'bing',
        method: 'sitemap_ping',
        status: bingPing.ok ? 'success' : 'failed',
        statusCode: bingPing.status,
      });
    } catch (error) {
      results.push({
        engine: 'bing',
        method: 'sitemap_ping',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }

    // Yandex - Ping
    try {
      const yandexPing = await fetch('https://webmaster.yandex.com/ping?sitemap=' + encodeURIComponent(sitemapUrl));
      results.push({
        engine: 'yandex',
        method: 'sitemap_ping',
        status: yandexPing.ok ? 'success' : 'failed',
        statusCode: yandexPing.status,
      });
    } catch (error) {
      results.push({
        engine: 'yandex',
        method: 'sitemap_ping',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      sitemapUrl,
      results,
      note: 'Google Sitemap Ping is deprecated. Submit manually in Google Search Console once, then Google will crawl automatically.',
    });
  } catch (error) {
    console.error('Cron sitemap submission error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
