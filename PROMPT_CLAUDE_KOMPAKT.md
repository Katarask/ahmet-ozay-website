# Kompakter Prompt für Claude (Copy & Paste)

```
Ich habe eine Liste von URLs zu Artikeln von Ahmet Özay. Bitte ziehe jeden Artikel aus dem Internet, extrahiere den Content und strukturiere ihn im Sanity CMS Schema-Format.

## Schema-Format:

Jeder Artikel muss folgendes JSON-Format haben:

{
  "title": {
    "de": "Deutscher Titel",
    "en": "English Title (übersetzt)",
    "tr": "Türkischer Titel (übersetzt)"
  },
  "slug": {
    "current": "url-freundlicher-slug"
  },
  "excerpt": {
    "de": "Deutsche Kurzbeschreibung (2-3 Sätze)",
    "en": "English excerpt (translated)",
    "tr": "Türkische Kurzbeschreibung (übersetzt)"
  },
  "content": {
    "de": [/* Portable Text Array */],
    "en": [/* Portable Text Array (übersetzt) */],
    "tr": [/* Portable Text Array (übersetzt) */]
  },
  "category": "politik" | "gesellschaft" | "medien" | "geschichte",
  "publishedAt": "2024-01-15T10:00:00.000Z", // ISO DateTime
  "author": "Ahmet Özay",
  "readTime": 7, // Minuten (ca. 200 Wörter = 1 Min)
  "featured": false,
  "tags": ["tag1", "tag2"] // optional
}

## Portable Text Format:

Content muss ein Array von Blocks sein:

[
  {
    "_type": "block",
    "style": "normal" | "h2" | "h3" | "h4" | "blockquote",
    "children": [
      {
        "_type": "span",
        "text": "Text hier",
        "marks": [] // oder ["strong"] für fett, ["em"] für kursiv
      }
    ],
    "markDefs": [] // für Links: [{ "_type": "link", "_key": "link0", "href": "https://..." }]
  }
]

## Wichtige Regeln:

1. Extrahiere Original-Text (meist DE), übersetze in EN und TR
2. Slug aus deutschem Titel: Kleinbuchstaben, Bindestriche, Umlaute: ä→ae, ö→oe, ü→ue, ß→ss
3. Kategorie: Analysiere Inhalt und wähle: politik, gesellschaft, medien oder geschichte
4. Published Date: Extrahiere aus Artikel oder Meta-Tags (ISO DateTime)
5. Read Time: Wortanzahl ÷ 200, aufrunden
6. Content: Nur Haupttext (keine Navigation/Footer), erhalte Überschriften-Struktur, Formatierung, Links
7. Jeder Absatz = eigener Block mit style: "normal"
8. Überschriften: H2 = style: "h2", H3 = style: "h3", etc.
9. Zitate: style: "blockquote"
10. Formatierung: "strong" für fett, "em" für kursiv, Links in markDefs

## Beispiel für einen Block:

Normaler Text:
{
  "_type": "block",
  "style": "normal",
  "children": [{"_type": "span", "text": "Text...", "marks": []}],
  "markDefs": []
}

Überschrift:
{
  "_type": "block",
  "style": "h2",
  "children": [{"_type": "span", "text": "Überschrift", "marks": []}],
  "markDefs": []
}

Text mit Link:
{
  "_type": "block",
  "style": "normal",
  "children": [
    {"_type": "span", "text": "Hier ist ein ", "marks": []},
    {"_type": "span", "text": "Link", "marks": ["link0"]}
  ],
  "markDefs": [
    {"_type": "link", "_key": "link0", "href": "https://example.com"}
  ]
}

## Output:

Gib alle Artikel als JSON-Array aus:
[
  { /* Artikel 1 */ },
  { /* Artikel 2 */ }
]

Bereit? Hier ist die Liste der Artikel-URLs:
[HIER KOMMT DEINE LISTE]
```
