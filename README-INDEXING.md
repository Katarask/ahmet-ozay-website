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

## Automatische Indexierung bei neuen Artikeln ✅

**Die automatische Indexierung ist bereits implementiert!**

### Sanity Webhook einrichten:

1. Gehe zu [Sanity Manage](https://www.sanity.io/manage)
2. Wähle dein Projekt
3. Gehe zu **API** → **Webhooks**
4. Klicke auf **Create webhook**
5. Konfiguriere:
   - **Name**: `Auto-index articles`
   - **URL**: `https://www.ahmetoezay.de/api/index-article`
   - **Dataset**: `production`
   - **Trigger on**: `Create`, `Update` (nur wenn `publishedAt` gesetzt ist)
   - **Filter**: `_type == "article" && defined(publishedAt)`
   - **HTTP method**: `POST`
   - **API version**: `v2021-03-25`
   - **Secret** (optional): Generiere einen Secret und setze `SANITY_WEBHOOK_SECRET` in Vercel

6. **Secret für Sicherheit** (empfohlen):
   ```bash
   # Generiere einen Secret
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```
   Setze in Vercel: `SANITY_WEBHOOK_SECRET=<generierter-secret>`

### Was passiert automatisch:

Wenn ein neuer Artikel in Sanity veröffentlicht wird:
1. ✅ Sanity sendet Webhook an `/api/index-article`
2. ✅ Route extrahiert Artikel-Slug
3. ✅ Erstellt URLs für alle Sprachen (DE, EN, TR)
4. ✅ Ruft IndexNow API auf (Bing, Yandex, Seznam)
5. ✅ Ruft Google Indexing API auf (falls konfiguriert)

## Automatische Sitemap-Submission ✅

**Die automatische Sitemap-Submission ist bereits implementiert!**

### Vercel Cron Job:

Ein Vercel Cron Job submitted die Sitemap **täglich automatisch** an:
- ✅ Google Search Console (via Sitemap Ping)
- ✅ Bing Webmaster Tools (via Sitemap Ping)
- ✅ Yandex (via Sitemap Ping)

**Konfiguration:**
- **Schedule**: Täglich um 00:00 UTC
- **Route**: `/api/cron/submit-sitemap`
- **Konfiguriert in**: `vercel.json`

### Manuelle Sitemap-Submission (einmalig):

Die Sitemap muss **einmalig manuell** in GSC und Bing eingereicht werden:

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

**Danach läuft alles automatisch!** 🎉

## Vercel Environment Variables

Setze folgende Variablen in Vercel:

```bash
# Erforderlich für IndexNow (Bing, Yandex, Seznam)
INDEXNOW_API_KEY=116c7a4e05046352fa65e9e3b46ab9cd

# Optional: Für Cron Job Sicherheit
CRON_SECRET=<generiere-mit: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))">

# Optional: Für Sanity Webhook Sicherheit
SANITY_WEBHOOK_SECRET=<generiere-mit: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))">

# Optional: Für Google Indexing API
GOOGLE_SERVICE_ACCOUNT_KEY=<base64-encoded-json>
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
