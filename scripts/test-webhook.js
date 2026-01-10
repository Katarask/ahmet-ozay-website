#!/usr/bin/env node

/**
 * Test Script für Sanity Webhook
 * 
 * Simuliert einen Sanity Webhook Request
 */

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.ahmetoezay.de';
const webhookUrl = `${baseUrl}/api/index-article`;

// Simuliere einen Sanity Webhook Payload
const testPayload = {
  _id: 'test-article-123',
  _type: 'article',
  slug: {
    current: 'test-artikel-webhook'
  },
  publishedAt: new Date().toISOString(),
  title: {
    de: 'Test Artikel',
    en: 'Test Article',
    tr: 'Test Makale'
  }
};

console.log('🧪 Teste Webhook:', webhookUrl);
console.log('📦 Payload:', JSON.stringify(testPayload, null, 2));
console.log('\n');

fetch(webhookUrl, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    ...(process.env.SANITY_WEBHOOK_SECRET && {
      'x-sanity-webhook-secret': process.env.SANITY_WEBHOOK_SECRET
    }),
  },
  body: JSON.stringify({
    document: testPayload
  }),
})
  .then(async (response) => {
    const data = await response.json();
    console.log('✅ Status:', response.status);
    console.log('📥 Response:', JSON.stringify(data, null, 2));
    
    if (response.ok) {
      console.log('\n✅ Webhook funktioniert!');
      if (data.indexing?.indexNow?.success) {
        console.log('✅ IndexNow API aufgerufen');
      } else {
        console.log('⚠️  IndexNow API nicht konfiguriert oder fehlgeschlagen');
      }
    } else {
      console.log('\n❌ Webhook Fehler:', data.error);
    }
  })
  .catch((error) => {
    console.error('❌ Request Fehler:', error.message);
  });
