# Automatische Indexierung für GSC & Bing

## Übersicht

Dieses Projekt unterstützt automatische Indexierung für:
- **Bing** (via IndexNow API)
- **Google** (via Indexing API - Setup erforderlich)
- **Yandex, Seznam** (via IndexNow API)

## Setup

### 1. IndexNow für Bing (Einfachste Lösung)

IndexNow ist ein offener Standard, der von Bing, Yandex und anderen unterstützt wird.

#### Schritt 1: API Key generieren

```bash
# Generiere einen zufälligen 32-Zeichen-Key
node -e "console.log(require('crypto').randomBytes(16).toString('hex'))"
```

#### Schritt 2: Key-Datei erstellen

Erstelle eine Datei im `public` Verzeichnis mit dem generierten Key als Dateinamen:
- Beispiel: `public/abc123def456.txt` (Key: `abc123def456`)
- Inhalt: Der Key selbst (z.B. `abc123def456`)

#### Schritt 3: Environment Variable setzen

```bash
# .env.local
INDEXNOW_API_KEY=abc123def456
```

#### Schritt 4: Automatische Indexierung bei neuen Artikeln

Die Indexierung kann automatisch getriggert werden, wenn neue Artikel veröffentlicht werden.

### 2. Google Indexing API (Erweitert)

Für vollautomatische Google-Indexierung:

#### Schritt 1: Google Cloud Console Setup

1. Gehe zu [Google Cloud Console](https://console.cloud.google.com/)
2. Erstelle ein neues Projekt oder wähle ein bestehendes
3. Aktiviere die **Indexing API**
4. Erstelle einen **Service Account**
5. Lade den JSON Key herunter

#### Schritt 2: Service Account Key konfigurieren

```bash
# JSON Key Base64 encoden
cat service-account-key.json | base64

# In .env.local setzen
GOOGLE_SERVICE_ACCOUNT_KEY=<base64-encoded-json>
```

#### Schritt 3: googleapis Package installieren

```bash
npm install googleapis
```

### 3. Sitemap Submission

Die Sitemap wird automatisch generiert unter: `https://www.ahmetoezay.de/sitemap.xml`

#### Manuelle Submission:

**Google Search Console:**
1. Gehe zu [Google Search Console](https://search.google.com/search-console)
2. Wähle deine Property
3. Gehe zu "Sitemaps"
4. Submit: `https://www.ahmetoezay.de/sitemap.xml`

**Bing Webmaster Tools:**
1. Gehe zu [Bing Webmaster Tools](https://www.bing.com/webmasters)
2. Wähle deine Site
3. Gehe zu "Sitemaps"
4. Submit: `https://www.ahmetoezay.de/sitemap.xml`

## API Endpoints

### IndexNow (Bing, Yandex, Seznam)

```bash
POST /api/indexnow
Content-Type: application/json

{
  "urls": [
    "https://www.ahmetoezay.de/de/artikel/neuer-artikel",
    "https://www.ahmetoezay.de/en/artikel/new-article"
  ]
}
```

### Google Indexing API

```bash
POST /api/google-indexing
Content-Type: application/json

{
  "urls": [
    "https://www.ahmetoezay.de/de/artikel/neuer-artikel"
  ],
  "action": "URL_UPDATED" // oder "URL_DELETED"
}
```

### Sitemap Submission

```bash
POST /api/submit-sitemap
Content-Type: application/json

{
  "searchEngine": "both" // "google", "bing", oder "both"
}
```

## Automatische Indexierung bei neuen Artikeln

Um die Indexierung automatisch zu triggern, wenn neue Artikel in Sanity veröffentlicht werden:

1. **Sanity Webhook** einrichten:
   - Gehe zu Sanity Studio → Settings → Webhooks
   - URL: `https://www.ahmetoezay.de/api/index-article`
   - Trigger: `article.publish`

2. **API Route erstellen** (`app/api/index-article/route.ts`):
   - Empfängt Webhook von Sanity
   - Ruft IndexNow API auf
   - Ruft Google Indexing API auf (falls konfiguriert)

## Vercel Environment Variables

Setze folgende Variablen in Vercel:

```bash
INDEXNOW_API_KEY=abc123def456
GOOGLE_SERVICE_ACCOUNT_KEY=<base64-encoded-json> # Optional
```

## Testing

Teste die Indexierung lokal:

```bash
# IndexNow testen
curl -X POST http://localhost:3000/api/indexnow \
  -H "Content-Type: application/json" \
  -d '{"urls": ["https://www.ahmetoezay.de/de/artikel/test"]}'
```

## Weitere Ressourcen

- [IndexNow Dokumentation](https://www.indexnow.org/)
- [Google Indexing API](https://developers.google.com/search/apis/indexing-api)
- [Bing Webmaster Tools](https://www.bing.com/webmasters)
