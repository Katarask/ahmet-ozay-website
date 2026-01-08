# 🎨 Sanity CMS Setup & Anleitung

Diese Anleitung führt Sie durch die Einrichtung von Sanity CMS für die Ahmet Özay Website.

---

## 📋 Inhaltsverzeichnis

1. [Sanity Projekt erstellen](#1-sanity-projekt-erstellen)
2. [Environment-Variablen konfigurieren](#2-environment-variablen-konfigurieren)
3. [Sanity Studio lokal starten](#3-sanity-studio-lokal-starten)
4. [Ersten Artikel erstellen](#4-ersten-artikel-erstellen)
5. [Auf Vercel deployen](#5-auf-vercel-deployen)
6. [Sanity Studio online deployen](#6-sanity-studio-online-deployen)

---

## 1️⃣ Sanity Projekt erstellen

### Schritt 1: Bei Sanity anmelden

1. Gehen Sie zu [sanity.io](https://www.sanity.io/)
2. Klicken Sie auf **"Get started for free"**
3. Melden Sie sich mit GitHub, Google oder E-Mail an

### Schritt 2: Projekt initialisieren

Öffnen Sie ein Terminal im Projektordner und führen Sie aus:

\`\`\`bash
npm run sanity:init
\`\`\`

Folgen Sie den Anweisungen:

- **Create new project**: Ja
- **Project name**: `ahmet-ozay-website`
- **Use the default dataset configuration?**: Ja (Dataset: `production`)
- **Output path**: `.` (current directory)

Das Script wird automatisch ein Projekt erstellen und die **Project ID** generieren.

---

## 2️⃣ Environment-Variablen konfigurieren

### Schritt 1: .env.local Datei erstellen

Erstellen Sie eine Datei `.env.local` im Hauptverzeichnis:

\`\`\`bash
touch .env.local
\`\`\`

### Schritt 2: Variablen einfügen

Öffnen Sie `.env.local` und fügen Sie ein:

\`\`\`env
# Sanity CMS Configuration
NEXT_PUBLIC_SANITY_PROJECT_ID=ihre-project-id
NEXT_PUBLIC_SANITY_DATASET=production
\`\`\`

### Schritt 3: Project ID finden

Ihre **Project ID** finden Sie:
- Im Terminal nach `npm run sanity:init`
- Oder auf [sanity.io/manage](https://www.sanity.io/manage) → Ihr Projekt auswählen

---

## 3️⃣ Sanity Studio lokal starten

### Option 1: Im Browser (empfohlen)

1. **Next.js Dev Server starten:**
   \`\`\`bash
   npm run dev
   \`\`\`

2. **Studio öffnen:**
   ```
   http://localhost:3000/studio
   ```

3. **Mit Sanity anmelden** (beim ersten Mal)

### Option 2: Standalone Studio

Falls Sie das Studio separat starten möchten:

\`\`\`bash
npx sanity start
\`\`\`

Das Studio öffnet sich auf `http://localhost:3333`

---

## 4️⃣ Ersten Artikel erstellen

### Schritt 1: Studio öffnen

Navigieren Sie zu `http://localhost:3000/studio`

### Schritt 2: Neuer Artikel

1. Klicken Sie auf **"Artikel"** im Menü
2. Klicken Sie auf **"Create"** (Plus-Symbol)

### Schritt 3: Felder ausfüllen

**Pflichtfelder:**

| Feld | Beschreibung | Beispiel |
|------|-------------|----------|
| **Titel (DE/EN/TR)** | Titel in allen 3 Sprachen | "Krimtataren im Exil" |
| **URL Slug** | Wird automatisch generiert | `krimtataren-im-exil` |
| **Kurzbeschreibung** | Teaser-Text (3 Sprachen) | "Nach der Annexion..." |
| **Inhalt** | Haupttext mit Rich Text Editor | [Siehe unten](#rich-text-editor) |
| **Kategorie** | Politik, Gesellschaft, Medien, Geschichte | "Politik" |
| **Lesezeit** | In Minuten | `8` |
| **Autor** | Standardmäßig "Ahmet Özay" | "Ahmet Özay" |

**Optionale Felder:**

- **Titelbild**: Bild hochladen (empfohlen: 1200x800px)
- **Hervorgehoben**: Für Startseite aktivieren
- **Tags**: Stichwörter (z.B. "Krim", "Menschenrechte")

### Schritt 4: Veröffentlichen

Klicken Sie oben rechts auf **"Publish"**

---

## 📝 Rich Text Editor

Der Content-Editor bietet:

### Formatierungen
- **Fett**, *Kursiv*, Unterstrichen
- Überschriften (H2, H3, H4)
- Blockquotes / Zitate
- Aufzählungen & nummerierte Listen

### Bilder einfügen
1. Klicken Sie auf das **Bild-Symbol**
2. Bild hochladen
3. Alt-Text & Bildunterschrift hinzufügen

### Links einfügen
1. Text markieren
2. Link-Symbol klicken
3. URL eingeben

### Mehrsprachigkeit
⚠️ **Wichtig**: Füllen Sie alle 3 Sprachen aus:
- **Deutsch (DE)** - Hauptsprache
- **English (EN)** - Englische Übersetzung
- **Türkçe (TR)** - Türkische Übersetzung

---

## 5️⃣ Auf Vercel deployen

### Voraussetzungen
- GitHub Repository mit dem Code
- Vercel Account ([vercel.com](https://vercel.com))

### Schritt 1: Vercel Projekt erstellen

1. Gehen Sie zu [vercel.com](https://vercel.com)
2. Klicken Sie auf **"Add New"** → **"Project"**
3. Importieren Sie Ihr GitHub Repository

### Schritt 2: Environment-Variablen hinzufügen

Fügen Sie in Vercel die Variablen hinzu:

| Name | Wert |
|------|------|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Ihre Sanity Project ID |
| `NEXT_PUBLIC_SANITY_DATASET` | `production` |

### Schritt 3: Deploy

Klicken Sie auf **"Deploy"** - Vercel wird automatisch bauen und deployen.

### Schritt 4: Domain konfigurieren (optional)

1. Gehen Sie zu **Settings** → **Domains**
2. Fügen Sie Ihre Custom Domain hinzu (z.B. `ahmetozay.com`)

---

## 6️⃣ Sanity Studio online deployen

### Option 1: Über Next.js Route (empfohlen)

Das Studio ist bereits unter `/studio` verfügbar, nachdem Sie auf Vercel deployt haben:

```
https://ihre-domain.vercel.app/studio
```

### Option 2: Separates Hosting

Falls Sie das Studio separat hosten möchten:

\`\`\`bash
npm run sanity:deploy
\`\`\`

Folgen Sie den Anweisungen. Das Studio wird auf einer `*.sanity.studio` URL gehostet.

---

## 🔒 Sicherheit & Zugriff

### Benutzer hinzufügen

1. Gehen Sie zu [sanity.io/manage](https://www.sanity.io/manage)
2. Wählen Sie Ihr Projekt
3. Klicken Sie auf **"Members"**
4. Klicken Sie auf **"Invite members"**
5. Geben Sie die E-Mail-Adresse ein

### Rollen

- **Administrator**: Voller Zugriff
- **Editor**: Kann Inhalte bearbeiten
- **Viewer**: Nur Leserechte

---

## 🎯 Workflow für Ahmet Özay

### Neuen Artikel schreiben

1. **Studio öffnen**: `https://ihre-domain.vercel.app/studio`
2. **Anmelden** mit Sanity-Account
3. **"Artikel" → "Create"**
4. **Felder ausfüllen** (DE/EN/TR)
5. **Bilder hochladen** (optional)
6. **"Publish"** klicken

### Artikel bearbeiten

1. Studio öffnen
2. Artikel in der Liste auswählen
3. Änderungen vornehmen
4. **"Publish"** klicken (aktualisiert die Website sofort)

### Artikel löschen

1. Artikel öffnen
2. **Drei-Punkte-Menü** (oben rechts)
3. **"Delete"** → Bestätigen

---

## 📊 Daten-Migration

Falls Sie bestehende MDX-Artikel haben, können Sie diese manuell in Sanity übertragen:

1. Öffnen Sie die MDX-Datei
2. Kopieren Sie den Inhalt
3. Erstellen Sie einen neuen Artikel in Sanity
4. Fügen Sie den Inhalt ein
5. Formatieren Sie nach Bedarf

**Tipp**: Sie können auch ein Migrationsskript schreiben, falls viele Artikel vorhanden sind.

---

## 🆘 Troubleshooting

### Problem: "Project ID not found"

**Lösung**: Überprüfen Sie `.env.local` und stellen Sie sicher, dass `NEXT_PUBLIC_SANITY_PROJECT_ID` korrekt ist.

### Problem: Studio lädt nicht

**Lösung**:
1. Cache leeren: `rm -rf .next`
2. Dev Server neu starten: `npm run dev`
3. Browser-Cache leeren (Cmd+Shift+R / Ctrl+Shift+R)

### Problem: Artikel werden nicht angezeigt

**Lösung**:
1. Überprüfen Sie, ob Artikel **veröffentlicht** (nicht nur gespeichert) sind
2. Prüfen Sie, ob alle Pflichtfelder ausgefüllt sind
3. Warten Sie ~30 Sekunden (CDN-Cache)

### Problem: "Authentication required"

**Lösung**:
1. Gehen Sie zu [sanity.io/manage](https://www.sanity.io/manage)
2. Projekt auswählen
3. **Settings** → **API** → **CORS origins**
4. Fügen Sie Ihre Domain hinzu (z.B. `https://ihre-domain.vercel.app`)

---

## 📚 Weitere Ressourcen

- **Sanity Dokumentation**: [sanity.io/docs](https://www.sanity.io/docs)
- **Sanity Support**: [sanity.io/help](https://www.sanity.io/help)
- **Vercel Docs**: [vercel.com/docs](https://vercel.com/docs)

---

## ✅ Checkliste

- [ ] Sanity Projekt erstellt
- [ ] `.env.local` konfiguriert
- [ ] Studio lokal läuft (`/studio`)
- [ ] Erster Testatikel erstellt
- [ ] Auf Vercel deployt
- [ ] Ahmet Özay als Editor hinzugefügt
- [ ] Workflow getestet

---

**🎉 Fertig!** Ahmet Özay kann jetzt Artikel selbstständig schreiben und veröffentlichen.

