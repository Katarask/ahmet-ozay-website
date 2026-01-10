/**
 * Test Script für Google Indexing API
 * 
 * Testet die Google Indexing API Route mit einer Test-URL
 */

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.ahmetoezay.de';

async function testGoogleIndexing() {
  console.log('🧪 Teste Google Indexing API...\n');

  // Test-URL (kann eine existierende Artikel-URL sein)
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

    console.log('📊 Response Status:', response.status);
    console.log('📦 Response Data:');
    console.log(JSON.stringify(data, null, 2));

    if (data.success) {
      console.log('\n✅ Google Indexing API funktioniert!');
      if (data.results && data.results.length > 0) {
        data.results.forEach((result, index) => {
          console.log(`\n  Result ${index + 1}:`);
          console.log(`    URL: ${result.url}`);
          console.log(`    Status: ${result.status}`);
          if (result.error) {
            console.log(`    ❌ Error: ${result.error}`);
            if (result.details) {
              console.log(`    Details:`, result.details);
            }
          } else {
            console.log(`    ✅ Success!`);
          }
        });
      }
    } else {
      console.log('\n❌ Google Indexing API hat einen Fehler zurückgegeben');
      if (data.error) {
        console.log(`   Error: ${data.error}`);
      }
      if (data.message) {
        console.log(`   Message: ${data.message}`);
      }
    }
  } catch (error) {
    console.error('\n❌ Fehler beim Testen der Google Indexing API:');
    console.error(error);
  }
}

// Führe den Test aus
testGoogleIndexing();
