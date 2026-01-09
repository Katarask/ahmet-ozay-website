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
 * - Google Search Console (via IndexNow ping)
 * - Bing Webmaster Tools (via IndexNow)
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

    // Google Search Console - Ping via IndexNow
    // Google unterstützt IndexNow für Sitemap-Updates
    try {
      const googlePing = await fetch('https://www.google.com/ping?sitemap=' + encodeURIComponent(sitemapUrl));
      results.push({
        engine: 'google',
        method: 'sitemap_ping',
        status: googlePing.ok ? 'success' : 'failed',
        statusCode: googlePing.status,
      });
    } catch (error) {
      results.push({
        engine: 'google',
        method: 'sitemap_ping',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }

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
    });
  } catch (error) {
    console.error('Cron sitemap submission error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
