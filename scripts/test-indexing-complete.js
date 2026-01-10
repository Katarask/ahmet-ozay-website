#!/usr/bin/env node

/**
 * Vollständiger Test für die Indexierung
 * 
 * Testet:
 * 1. Google Indexing API direkt
 * 2. IndexNow API
 * 3. Kompletten Webhook-Flow
 */

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.ahmetoezay.de';

async function testGoogleIndexing() {
  console.log('🧪 Teste Google Indexing API...\n');
  console.log('URL:', `${baseUrl}/api/google-indexing`);
  
  const testUrl = `${baseUrl}/de/artikel/test-artikel-1`;

  try {
    const response = await fetch(`${baseUrl}/api/google-indexing`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        urls: [testUrl],
        action: 'URL_UPDATED',
      }),
    });

    const data = await response.json();

    console.log('📊 Status Code:', response.status);
    console.log('📦 Response:');
    console.log(JSON.stringify(data, null, 2));
    console.log('\n');

    if (data.success === false && data.message?.includes('googleapis')) {
      console.log('⚠️  WARNUNG: Die alte Version ist noch deployed!');
      console.log('   → Die neue Route mit googleapis ist noch nicht live.');
      console.log('   → Warte auf das nächste Vercel Deployment oder trigger es manuell.');
      return false;
    }

    if (data.success) {
      console.log('✅ Google Indexing API funktioniert!');
      if (data.results && data.results.length > 0) {
        data.results.forEach((result, index) => {
          console.log(`\n  Result ${index + 1}:`);
          console.log(`    URL: ${result.url}`);
          console.log(`    Status: ${result.status}`);
          if (result.error) {
            console.log(`    ❌ Error: ${result.error}`);
            if (result.details) {
              console.log(`    Details:`, JSON.stringify(result.details, null, 2));
            }
          } else {
            console.log(`    ✅ Success!`);
            if (result.response) {
              console.log(`    Response:`, JSON.stringify(result.response, null, 2));
            }
          }
        });
      }
      return true;
    } else {
      console.log('❌ Google Indexing API hat einen Fehler zurückgegeben');
      if (data.error) {
        console.log(`   Error: ${data.error}`);
      }
      if (data.message) {
        console.log(`   Message: ${data.message}`);
      }
      return false;
    }
  } catch (error) {
    console.error('\n❌ Fehler beim Testen der Google Indexing API:');
    console.error(error);
    return false;
  }
}

async function testIndexNow() {
  console.log('\n🧪 Teste IndexNow API...\n');
  
  const indexNowApiKey = process.env.INDEXNOW_API_KEY || '116c7a4e05046352fa65e9e3b46ab9cd';
  const testUrl = `${baseUrl}/de/artikel/test-artikel-1`;

  try {
    const response = await fetch('https://api.indexnow.org/IndexNow', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        host: new URL(baseUrl).hostname,
        key: indexNowApiKey,
        keyLocation: `${baseUrl}/${indexNowApiKey}.txt`,
        urlList: [testUrl],
      }),
    });

    console.log('📊 Status Code:', response.status);
    console.log('📊 Status Text:', response.statusText);
    
    if (response.ok || response.status === 202) {
      console.log('✅ IndexNow API funktioniert!');
      return true;
    } else {
      const text = await response.text();
      console.log('⚠️  IndexNow Response:', text);
      return false;
    }
  } catch (error) {
    console.error('❌ Fehler beim Testen der IndexNow API:');
    console.error(error);
    return false;
  }
}

async function testWebhook() {
  console.log('\n🧪 Teste Webhook (kompletter Flow)...\n');
  
  const testPayload = {
    document: {
      _id: 'test-article-123',
      _type: 'article',
      slug: {
        current: 'test-artikel-webhook'
      },
      publishedAt: new Date().toISOString(),
    }
  };

  try {
    const response = await fetch(`${baseUrl}/api/index-article`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testPayload),
    });

    const data = await response.json();

    console.log('📊 Status Code:', response.status);
    console.log('📦 Response:');
    console.log(JSON.stringify(data, null, 2));
    console.log('\n');

    if (data.success) {
      console.log('✅ Webhook funktioniert!');
      if (data.indexing) {
        if (data.indexing.indexNow?.success) {
          console.log('  ✅ IndexNow wurde aufgerufen');
        }
        if (data.indexing.google) {
          if (data.indexing.google.success) {
            console.log('  ✅ Google Indexing API wurde aufgerufen');
          } else {
            console.log('  ⚠️  Google Indexing API:', data.indexing.google.error || data.indexing.google.message);
          }
        }
      }
      return true;
    } else {
      console.log('❌ Webhook Fehler:', data.error);
      return false;
    }
  } catch (error) {
    console.error('❌ Fehler beim Testen des Webhooks:');
    console.error(error);
    return false;
  }
}

async function runAllTests() {
  console.log('🚀 Starte vollständigen Indexierungs-Test...\n');
  console.log('='.repeat(60));
  
  const results = {
    google: false,
    indexNow: false,
    webhook: false,
  };

  results.google = await testGoogleIndexing();
  results.indexNow = await testIndexNow();
  results.webhook = await testWebhook();

  console.log('\n' + '='.repeat(60));
  console.log('📊 Test-Zusammenfassung:');
  console.log(`  Google Indexing API: ${results.google ? '✅' : '❌'}`);
  console.log(`  IndexNow API: ${results.indexNow ? '✅' : '❌'}`);
  console.log(`  Webhook Flow: ${results.webhook ? '✅' : '❌'}`);
  
  if (!results.google) {
    console.log('\n💡 Tipp: Wenn Google Indexing API noch nicht funktioniert:');
    console.log('   1. Prüfe ob die neue Version deployed ist');
    console.log('   2. Prüfe ob GOOGLE_SERVICE_ACCOUNT_KEY in Vercel gesetzt ist');
    console.log('   3. Prüfe ob Service Account in GSC als Owner hinzugefügt wurde');
  }
}

runAllTests();
