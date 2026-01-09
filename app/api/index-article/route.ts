import { NextRequest, NextResponse } from 'next/server';

/**
 * Automatische Indexierung für neue Artikel
 * 
 * Diese Route kann von Sanity Webhooks aufgerufen werden, wenn ein neuer Artikel veröffentlicht wird.
 * 
 * Setup in Sanity:
 * 1. Gehe zu Sanity Studio → Settings → Webhooks
 * 2. Erstelle neuen Webhook:
 *    - URL: https://www.ahmetoezay.de/api/index-article
 *    - Dataset: production
 *    - Trigger: article.publish
 *    - HTTP Method: POST
 *    - Secret: (optional, für Sicherheit)
 * 
 * Verwendung:
 * POST /api/index-article
 * Body: Sanity Webhook Payload
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.ahmetoezay.de';
    
    // Extrahiere Artikel-Informationen aus Sanity Webhook
    const article = body.document || body;
    const slug = article.slug?.current;
    const locales = ['de', 'en', 'tr'];

    if (!slug) {
      return NextResponse.json(
        { error: 'Article slug not found' },
        { status: 400 }
      );
    }

    // Erstelle URLs für alle Sprachen
    const urls = locales.map(locale => 
      `${baseUrl}/${locale}/artikel/${slug}`
    );

    // IndexNow API aufrufen (Bing, Yandex, Seznam)
    let indexNowResult = null;
    try {
      const indexNowResponse = await fetch(`${baseUrl}/api/indexnow`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ urls }),
      });
      indexNowResult = await indexNowResponse.json();
    } catch (error) {
      console.error('IndexNow error:', error);
    }

    // Google Indexing API aufrufen (falls konfiguriert)
    let googleResult = null;
    try {
      const googleResponse = await fetch(`${baseUrl}/api/google-indexing`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          urls,
          action: 'URL_UPDATED'
        }),
      });
      googleResult = await googleResponse.json();
    } catch (error) {
      console.error('Google Indexing error:', error);
    }

    return NextResponse.json({
      success: true,
      article: {
        slug,
        urls,
      },
      indexing: {
        indexNow: indexNowResult,
        google: googleResult,
      },
    });
  } catch (error) {
    console.error('Index article error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
