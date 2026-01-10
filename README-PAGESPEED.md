# PageSpeed Test Anleitung

## Automatischer Test mit Script

### Mit API Key (empfohlen)

1. **Google Cloud Console API Key erstellen:**
   - Gehe zu [Google Cloud Console](https://console.cloud.google.com/)
   - Erstelle ein neues Projekt oder wähle ein bestehendes
   - Aktiviere die "PageSpeed Insights API"
   - Erstelle einen API Key unter "Credentials"
   - Kopiere den API Key

2. **Test ausführen:**
   ```bash
   PAGESPEED_API_KEY=dein-api-key npm run test-pagespeed
   ```

   Oder für eine andere Sprache:
   ```bash
   LOCALE=en PAGESPEED_API_KEY=dein-api-key npm run test-pagespeed
   ```

### Ohne API Key (limitierte Requests)

```bash
npm run test-pagespeed
```

⚠️ **Hinweis:** Die öffentliche API hat ein tägliches Limit. Für häufige Tests wird ein API Key empfohlen.

## Manuelle Tests

### 1. Google PageSpeed Insights (Web)

**Direkter Link:**
- [PageSpeed Insights](https://pagespeed.web.dev/?url=https://www.ahmetoezay.de)

**Teste verschiedene Seiten:**
- Homepage: `https://www.ahmetoezay.de/de`
- Artikel: `https://www.ahmetoezay.de/de/artikel/[slug]`
- About: `https://www.ahmetoezay.de/de/about`

### 2. Lighthouse (Chrome DevTools)

1. Öffne Chrome DevTools (F12)
2. Gehe zum Tab "Lighthouse"
3. Wähle "Performance", "Accessibility", "Best Practices", "SEO"
4. Klicke auf "Analyze page load"

### 3. Vercel Analytics

Wenn Vercel Analytics aktiviert ist:
- Gehe zu deinem Vercel Dashboard
- Wähle das Projekt "ahmet-ozay-website"
- Gehe zu "Analytics" → "Web Vitals"

## Was wird getestet?

### Core Web Vitals
- **LCP (Largest Contentful Paint)**: < 2.5s (gut)
- **FID (First Input Delay)**: < 100ms (gut)
- **CLS (Cumulative Layout Shift)**: < 0.1 (gut)

### Lighthouse Scores
- **Performance**: 0-100
- **Accessibility**: 0-100
- **Best Practices**: 0-100
- **SEO**: 0-100

## Bereits implementierte Optimierungen

✅ **Image Optimization:**
- WebP & AVIF Format Support
- Responsive Image Sizes
- Lazy Loading
- Blur Placeholders

✅ **Code Optimization:**
- SWC Minification
- Console Log Removal (Production)
- Compression enabled
- React Strict Mode

✅ **Performance:**
- Static Generation (SSG)
- Image Priority für Above-the-Fold
- Optimized Font Loading

## Verbesserungsvorschläge

Basierend auf typischen PageSpeed-Ergebnissen könnten folgende Optimierungen helfen:

1. **Font Optimization:**
   - Font-Display: swap (bereits in layout.tsx)
   - Font Subsetting für reduzierte Dateigröße

2. **CSS Optimization:**
   - Critical CSS Inlining
   - Unused CSS Removal

3. **JavaScript Optimization:**
   - Code Splitting
   - Dynamic Imports für große Komponenten

4. **Caching:**
   - Service Worker für Offline-Support
   - Aggressive Caching Headers

5. **Third-Party Scripts:**
   - Lazy Load für externe Scripts
   - Defer/Async für nicht-kritische Scripts

## Regelmäßige Tests

Empfohlen:
- Nach jedem größeren Deployment
- Monatlich für Monitoring
- Vor wichtigen SEO-Kampagnen
