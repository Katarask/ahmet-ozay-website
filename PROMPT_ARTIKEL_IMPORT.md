# Prompt für Claude: Artikel aus dem Web importieren

## Aufgabe

Du erhältst eine Liste von URLs zu Artikeln von Ahmet Özay. Deine Aufgabe ist es, jeden Artikel aus dem Internet zu ziehen, den Content zu extrahieren und im korrekten Sanity CMS Schema-Format zu strukturieren.

## Input-Format

Eine Liste von Artikel-URLs, z.B.:
```
https://example.com/artikel-1
https://example.com/artikel-2
https://example.com/artikel-3
```

## Output-Format: Sanity Article Schema (JSON)

Jeder Artikel muss im folgenden JSON-Format ausgegeben werden:

```json
{
  "title": {
    "de": "Deutscher Titel des Artikels",
    "en": "English title of the article (übersetzt)",
    "tr": "Türkischer Titel des Artikels (übersetzt)"
  },
  "slug": {
    "current": "url-freundlicher-slug-vom-deutschen-titel"
  },
  "excerpt": {
    "de": "Deutsche Kurzbeschreibung (max. 2-3 Sätze)",
    "en": "English excerpt (translated, max. 2-3 sentences)",
    "tr": "Türkische Kurzbeschreibung (übersetzt, max. 2-3 Sätze)"
  },
  "content": {
    "de": [
      // Portable Text Array - siehe Beispiel unten
    ],
    "en": [
      // Portable Text Array (übersetzt)
    ],
    "tr": [
      // Portable Text Array (übersetzt)
    ]
  },
  "category": "politik" | "gesellschaft" | "medien" | "geschichte",
  "publishedAt": "2024-01-15T10:00:00.000Z", // ISO DateTime vom Original-Artikel
  "author": "Ahmet Özay",
  "readTime": 7, // Geschätzte Lesezeit in Minuten (basierend auf Wortanzahl)
  "featured": false, // false, außer explizit anders angegeben
  "tags": ["tag1", "tag2"], // Optionale Tags aus dem Artikel
  "image": {
    // Optional: Nur wenn ein Titelbild vorhanden ist
    "asset": {
      "_type": "reference",
      "_ref": "image-id"
    },
    "alt": "Alt-Text für das Bild"
  }
}
```

## Portable Text Format (Sanity Block Content)

Der `content`-Feld muss ein Array von Portable Text Blocks sein. Beispiel:

```json
[
  {
    "_type": "block",
    "style": "normal",
    "children": [
      {
        "_type": "span",
        "text": "Dies ist der erste Absatz des Artikels. ",
        "marks": []
      }
    ],
    "markDefs": []
  },
  {
    "_type": "block",
    "style": "h2",
    "children": [
      {
        "_type": "span",
        "text": "Überschrift Level 2",
        "marks": []
      }
    ],
    "markDefs": []
  },
  {
    "_type": "block",
    "style": "normal",
    "children": [
      {
        "_type": "span",
        "text": "Dieser Text ist ",
        "marks": []
      },
      {
        "_type": "span",
        "text": "fett",
        "marks": ["strong"]
      },
      {
        "_type": "span",
        "text": " und dieser ist ",
        "marks": []
      },
      {
        "_type": "span",
        "text": "kursiv",
        "marks": ["em"]
      },
      {
        "_type": "span",
        "text": ".",
        "marks": []
      }
    ],
    "markDefs": []
  },
  {
    "_type": "block",
    "style": "blockquote",
    "children": [
      {
        "_type": "span",
        "text": "Dies ist ein Zitat.",
        "marks": []
      }
    ],
    "markDefs": []
  },
  {
    "_type": "block",
    "style": "normal",
    "children": [
      {
        "_type": "span",
        "text": "Dies ist ein ",
        "marks": []
      },
      {
        "_type": "span",
        "text": "Link",
        "marks": ["link0"]
      },
      {
        "_type": "span",
        "text": " im Text.",
        "marks": []
      }
    ],
    "markDefs": [
      {
        "_type": "link",
        "_key": "link0",
        "href": "https://example.com"
      }
    ]
  }
]
```

### Verfügbare Styles:
- `"normal"` - Normaler Absatz (Standard)
- `"h2"` - Überschrift Level 2
- `"h3"` - Überschrift Level 3
- `"h4"` - Überschrift Level 4
- `"blockquote"` - Zitat

### Verfügbare Marks (Text-Formatierung):
- `"strong"` - **Fett**
- `"em"` - *Kursiv*
- `"underline"` - <u>Unterstrichen</u>
- `"link0"`, `"link1"`, etc. - Links (müssen in `markDefs` definiert werden)

### Links in Portable Text:
Links müssen in `markDefs` definiert werden:
```json
{
  "_type": "link",
  "_key": "link0", // Eindeutiger Key
  "href": "https://example.com"
}
```

## Wichtige Regeln:

1. **Sprachen**: 
   - Extrahiere den Original-Text (meist Deutsch)
   - Übersetze in Englisch und Türkisch
   - Falls der Artikel bereits mehrsprachig ist, nutze die vorhandenen Versionen

2. **Slug-Generierung**:
   - Generiere aus dem deutschen Titel einen URL-freundlichen Slug
   - Kleinbuchstaben, Bindestriche statt Leerzeichen
   - Max. 96 Zeichen
   - Umlaute: ä→ae, ö→oe, ü→ue, ß→ss

3. **Kategorie-Zuordnung**:
   - Analysiere den Artikel-Inhalt
   - Weise eine der 4 Kategorien zu: `politik`, `gesellschaft`, `medien`, `geschichte`
   - Falls unsicher, wähle die passendste

4. **Published Date**:
   - Extrahiere das Veröffentlichungsdatum aus dem Artikel
   - Falls nicht verfügbar, nutze das Datum der Webseite (Meta-Tags)
   - Format: ISO 8601 DateTime (`YYYY-MM-DDTHH:mm:ss.sssZ`)

5. **Read Time**:
   - Schätze die Lesezeit basierend auf Wortanzahl
   - Formel: ca. 200-250 Wörter = 1 Minute
   - Runde auf die nächste Minute

6. **Content-Struktur**:
   - Entferne Navigation, Footer, Werbung, etc.
   - Behalte nur den Hauptartikel-Text
   - Erhalte Überschriften-Struktur (H2, H3, H4)
   - Behalte Formatierung (Fett, Kursiv, Links)
   - Konvertiere Zitate zu `blockquote`-Blocks
   - Trenne Absätze korrekt (jeder Absatz = eigener Block)

7. **Bilder**:
   - Falls ein Titelbild vorhanden ist, notiere die URL im Kommentar
   - Wir laden die Bilder später manuell in Sanity hoch
   - Für jetzt: `"image"`-Feld weglassen oder als Kommentar notieren

8. **Tags**:
   - Extrahiere relevante Tags/Schlagworte aus dem Artikel
   - Optional: 3-5 Tags pro Artikel

## Beispiel-Output für einen Artikel:

```json
{
  "_type": "article",
  "title": {
    "de": "Die Zukunft der deutsch-türkischen Beziehungen",
    "en": "The Future of German-Turkish Relations",
    "tr": "Alman-Türk İlişkilerinin Geleceği"
  },
  "slug": {
    "_type": "slug",
    "current": "die-zukunft-der-deutsch-tuerkischen-beziehungen"
  },
  "excerpt": {
    "de": "Eine Analyse der aktuellen Entwicklungen in den deutsch-türkischen Beziehungen und deren Auswirkungen auf die europäische Politik.",
    "en": "An analysis of current developments in German-Turkish relations and their impact on European politics.",
    "tr": "Alman-Türk ilişkilerindeki mevcut gelişmelerin ve bunların Avrupa siyasetine etkisinin analizi."
  },
  "content": {
    "de": [
      {
        "_type": "block",
        "style": "normal",
        "children": [
          {
            "_type": "span",
            "text": "Die Beziehungen zwischen Deutschland und der Türkei stehen vor neuen Herausforderungen...",
            "marks": []
          }
        ],
        "markDefs": []
      }
      // ... weitere Blocks
    ],
    "en": [/* übersetzt */],
    "tr": [/* übersetzt */]
  },
  "category": "politik",
  "publishedAt": "2024-01-15T10:00:00.000Z",
  "author": "Ahmet Özay",
  "readTime": 7,
  "featured": false,
  "tags": ["Deutschland", "Türkei", "Außenpolitik"]
}
```

## Vorgehen:

1. **Für jede URL in der Liste:**
   - Lade die Webseite
   - Extrahiere Titel, Datum, Autor, Content
   - Identifiziere Hauptartikel-Content (entferne Navigation, Footer, etc.)
   - Strukturiere den Content in Portable Text Format
   - Übersetze Titel, Excerpt und Content in EN und TR
   - Generiere Slug aus deutschem Titel
   - Weise Kategorie zu
   - Berechne Read Time
   - Erstelle vollständiges JSON-Objekt

2. **Output:**
   - Ein JSON-Array mit allen Artikeln
   - Jeder Artikel als eigenständiges JSON-Objekt
   - Bereit für Import in Sanity CMS

3. **Bei Problemen:**
   - Falls ein Artikel nicht geladen werden kann, notiere die URL mit Fehler
   - Falls Daten fehlen (z.B. Datum), nutze ein geschätztes Datum und markiere es im Kommentar
   - Falls Übersetzung nicht möglich, lasse EN/TR-Felder leer (werden später ergänzt)

## Output-Format:

Gib die Artikel als JSON-Array aus, z.B.:

```json
[
  {
    // Artikel 1
  },
  {
    // Artikel 2
  }
]
```

Oder wenn die Liste sehr lang ist, gebe die Artikel nummeriert und getrennt aus, damit sie leicht in Sanity importiert werden können.

---

**Bereit? Dann beginne mit der Liste der Artikel-URLs!**
