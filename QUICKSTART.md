# 🚀 Sanity CMS - Schnellstart

## ⚡ In 5 Minuten loslegen

### 1. Sanity Projekt initialisieren

\`\`\`bash
npm run sanity:init
\`\`\`

Folgen Sie den Anweisungen und notieren Sie die **Project ID**.

### 2. Environment-Variablen erstellen

Erstellen Sie `.env.local`:

\`\`\`env
NEXT_PUBLIC_SANITY_PROJECT_ID=ihre-project-id
NEXT_PUBLIC_SANITY_DATASET=production
\`\`\`

### 3. Dev Server starten

\`\`\`bash
npm run dev
\`\`\`

### 4. Studio öffnen

Navigieren Sie zu:
```
http://localhost:3000/studio
```

### 5. Ersten Artikel erstellen

1. Klicken Sie auf **"Artikel"**
2. Klicken Sie auf **"Create"**
3. Füllen Sie die Felder aus (DE/EN/TR)
4. Klicken Sie auf **"Publish"**

### 6. Artikel auf der Website ansehen

```
http://localhost:3000/de/artikel
```

---

## 📖 Vollständige Anleitung

Für Details siehe: **[SANITY_SETUP.md](./SANITY_SETUP.md)**

---

## 🆘 Probleme?

1. **Studio lädt nicht?**
   - Cache leeren: `rm -rf .next && npm run dev`

2. **Artikel nicht sichtbar?**
   - Prüfen Sie, ob **"Publish"** geklickt wurde
   - Alle Pflichtfelder ausgefüllt?

3. **Project ID fehlt?**
   - Finden Sie sie auf [sanity.io/manage](https://www.sanity.io/manage)

