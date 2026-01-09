import { NextRequest, NextResponse } from 'next/server';

/**
 * IndexNow API Route für automatische Indexierung
 * Unterstützt: Bing, Yandex, Seznam und andere IndexNow-kompatible Suchmaschinen
 * 
 * Verwendung:
 * POST /api/indexnow
 * Body: { urls: ['https://www.ahmetoezay.de/de/artikel/slug'] }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { urls } = body;

    if (!urls || !Array.isArray(urls) || urls.length === 0) {
      return NextResponse.json(
        { error: 'URLs array is required' },
        { status: 400 }
      );
    }

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.ahmetoezay.de';
    
    // IndexNow API Endpoints
    const indexNowEndpoints = [
      'https://api.indexnow.org/IndexNow', // Bing, Yandex, Seznam
      'https://www.bing.com/indexnow', // Bing direkt
    ];

    // API Key für IndexNow (erforderlich)
    // Muss in .env.local gesetzt werden: INDEXNOW_API_KEY
    const apiKey = process.env.INDEXNOW_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json(
        { 
          error: 'INDEXNOW_API_KEY not configured',
          message: 'Set INDEXNOW_API_KEY in environment variables. Generate key with: npm run generate-indexnow-key'
        },
        { status: 400 }
      );
    }

    const results = [];

    for (const endpoint of indexNowEndpoints) {
      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(apiKey && { 'X-IndexNow-Key': apiKey }),
          },
          body: JSON.stringify({
            host: new URL(baseUrl).hostname,
            key: apiKey,
            keyLocation: `${baseUrl}/${apiKey}.txt`, // Key-Datei muss auf der Website verfügbar sein
            urlList: urls,
          }),
        });

        results.push({
          endpoint,
          status: response.status,
          success: response.ok,
        });
      } catch (error) {
        results.push({
          endpoint,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }

    return NextResponse.json({
      success: true,
      submittedUrls: urls,
      results,
    });
  } catch (error) {
    console.error('IndexNow API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

