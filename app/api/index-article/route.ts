import { NextRequest, NextResponse } from 'next/server';

/**
 * Automatische Indexierung für neue Artikel
 * 
 * Diese Route wird automatisch von Sanity Webhooks aufgerufen, wenn ein neuer Artikel veröffentlicht wird.
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
 * Die Route indexiert automatisch:
 * - Bing, Yandex, Seznam (via IndexNow)
 * - Google (via Indexing API, falls konfiguriert)
 * 
 * Verwendung:
 * POST /api/index-article
 * Body: Sanity Webhook Payload
 */
export async function POST(request: NextRequest) {
  try {
    // Optional: Webhook Secret prüfen für Sicherheit
    const webhookSecret = process.env.SANITY_WEBHOOK_SECRET;
    if (webhookSecret) {
      const providedSecret = request.headers.get('x-sanity-webhook-secret');
      if (providedSecret !== webhookSecret) {
        return NextResponse.json(
          { error: 'Invalid webhook secret' },
          { status: 401 }
        );
      }
    }

    const body = await request.json();
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.ahmetoezay.de';
    
    // Extrahiere Artikel-Informationen aus Sanity Webhook
    // Sanity sendet verschiedene Payload-Formate
    let article;
    if (body.document) {
      article = body.document;
    } else if (body._id && body.slug) {
      article = body;
    } else {
      // Fallback: Versuche aus _id zu extrahieren
      article = body;
    }

    const slug = article.slug?.current || article.slug;
    const locales = ['de', 'en', 'tr'];

    if (!slug) {
      console.error('Article slug not found in webhook payload:', JSON.stringify(body, null, 2));
      return NextResponse.json(
        { error: 'Article slug not found', received: body },
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
      // Rufe IndexNow direkt auf (intern, ohne externe Fetch)
      const indexNowApiKey = process.env.INDEXNOW_API_KEY;
      if (!indexNowApiKey) {
        console.warn('INDEXNOW_API_KEY not configured, skipping IndexNow submission');
      } else {
        const indexNowEndpoints = [
          'https://api.indexnow.org/IndexNow',
          'https://www.bing.com/indexnow',
        ];

        for (const endpoint of indexNowEndpoints) {
          try {
            await fetch(endpoint, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                host: new URL(baseUrl).hostname,
                key: indexNowApiKey,
                keyLocation: `${baseUrl}/${indexNowApiKey}.txt`,
                urlList: urls,
              }),
            });
          } catch (error) {
            console.error(`IndexNow endpoint ${endpoint} error:`, error);
          }
        }
        indexNowResult = { success: true, urls };
      }
    } catch (error) {
      console.error('IndexNow error:', error);
      indexNowResult = { error: error instanceof Error ? error.message : 'Unknown error' };
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
