# Ahmet Özay - Journalist Website

Persönliche Website des deutsch-türkischen Journalisten Ahmet Özay.

## Features

- 🌍 **Mehrsprachig** - Deutsch, Englisch, Türkisch
- 🌙 **Dark Mode** - Automatisch & manuell umschaltbar
- 📱 **Responsive** - Optimiert für alle Geräte
- 🔍 **SEO-optimiert** - Schema.org, Meta-Tags, Sitemap
- 📖 **Reading Progress** - Lesefortschritts-Anzeige
- 🧭 **Breadcrumbs** - Strukturierte Navigation

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS
- **i18n:** next-intl
- **Hosting:** Vercel

## Installation

```bash
# Repository klonen
git clone https://github.com/DEIN-USERNAME/ahmet-ozay-website.git

# In Projektordner wechseln
cd ahmet-ozay-website

# Dependencies installieren
npm install

# Development Server starten
npm run dev
```

## Ordnerstruktur

```
ahmet-ozay-website/
├── app/
│   └── [locale]/           # Lokalisierte Seiten
│       ├── artikel/[slug]/ # Artikel-Detail
│       ├── kontakt/        # Kontaktformular
│       └── page.tsx        # Homepage
├── components/             # React Components
├── content/artikel/        # MDX Artikel (de/en/tr)
├── i18n/                   # Übersetzungen
├── lib/                    # Utilities
├── public/                 # Statische Assets
└── styles/                 # Global CSS
```

## Deployment

Das Projekt ist für Vercel optimiert:

```bash
# Build erstellen
npm run build

# Oder direkt mit Vercel CLI
vercel
```

## Lizenz

© 2025 Ahmet Özay
