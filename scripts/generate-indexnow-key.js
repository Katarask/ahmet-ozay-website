#!/usr/bin/env node

/**
 * Script zum Generieren eines IndexNow API Keys
 * 
 * Verwendung:
 * node scripts/generate-indexnow-key.js
 * 
 * Das Script:
 * 1. Generiert einen zufälligen 32-Zeichen-Key
 * 2. Erstellt die Key-Datei im public Verzeichnis
 * 3. Gibt Anweisungen für .env.local aus
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Generiere einen zufälligen 32-Zeichen-Key
const apiKey = crypto.randomBytes(16).toString('hex');

// Pfade
const publicDir = path.join(process.cwd(), 'public');
const keyFile = path.join(publicDir, `${apiKey}.txt`);

// Erstelle public Verzeichnis falls nicht vorhanden
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Erstelle Key-Datei
fs.writeFileSync(keyFile, apiKey, 'utf8');

console.log('\n✅ IndexNow API Key generiert!\n');
console.log('📝 Füge folgende Zeile zu deiner .env.local hinzu:');
console.log(`\nINDEXNOW_API_KEY=${apiKey}\n`);
console.log(`📄 Key-Datei erstellt: public/${apiKey}.txt`);
console.log(`\n🔗 Key-Datei wird verfügbar sein unter: https://www.ahmetoezay.de/${apiKey}.txt\n`);
