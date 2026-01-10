import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';

/**
 * Google Indexing API Route für automatische Indexierung
 * 
 * WICHTIG: Erfordert Google Service Account mit Indexing API aktiviert
 * 
 * Setup:
 * 1. Google Cloud Console: Indexing API aktivieren
 * 2. Service Account erstellen
 * 3. JSON Key herunterladen
 * 4. In .env.local: GOOGLE_SERVICE_ACCOUNT_KEY (Base64 encoded JSON)
 * 
 * Verwendung:
 * POST /api/google-indexing
 * Body: { urls: ['https://www.ahmetoezay.de/de/artikel/slug'], action: 'URL_UPDATED' }
 */
export async function POST(request: NextRequest) {
  try {
    // Prüfe ob Google Service Account konfiguriert ist
    const serviceAccountKey = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
    
    if (!serviceAccountKey) {
      return NextResponse.json(
        { 
          error: 'Google Service Account not configured',
          message: 'Set GOOGLE_SERVICE_ACCOUNT_KEY in environment variables'
        },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { urls, action = 'URL_UPDATED' } = body;

    if (!urls || !Array.isArray(urls) || urls.length === 0) {
      return NextResponse.json(
        { error: 'URLs array is required' },
        { status: 400 }
      );
    }

    // Decode Base64 Service Account Key
    let serviceAccount;
    try {
      serviceAccount = JSON.parse(
        Buffer.from(serviceAccountKey, 'base64').toString('utf-8')
      );
    } catch (error) {
      return NextResponse.json(
        { 
          error: 'Invalid GOOGLE_SERVICE_ACCOUNT_KEY',
          message: 'Key must be a valid Base64-encoded JSON string'
        },
        { status: 400 }
      );
    }

    // Authenticate with Google
    const jwtClient = new google.auth.JWT({
      email: serviceAccount.client_email,
      key: serviceAccount.private_key,
      scopes: ['https://www.googleapis.com/auth/indexing'],
    });

    // Get access token
    await jwtClient.authorize();

    // Create indexing client
    const indexing = google.indexing({
      version: 'v3',
      auth: jwtClient,
    });

    // Submit URLs
    const results = [];
    for (const url of urls) {
      try {
        const response = await indexing.urlNotifications.publish({
          requestBody: {
            url: url,
            type: action,
          },
        });
        results.push({
          url,
          status: 'success',
          response: response.data,
        });
      } catch (error: any) {
        results.push({
          url,
          status: 'error',
          error: error.message || 'Unknown error',
          details: error.response?.data || undefined,
        });
      }
    }

    return NextResponse.json({
      success: true,
      urlsSubmitted: urls.length,
      action,
      results,
    });
  } catch (error) {
    console.error('Google Indexing API error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error', 
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
