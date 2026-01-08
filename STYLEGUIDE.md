# Styleguide - Ahmet Özay Website

Ein minimalistisches, professionelles Design-System für die persönliche Website von Ahmet Özay.

---

## 🎨 Farbpalette

### Primärfarben

Das Projekt verwendet eine reduzierte Farbpalette mit Fokus auf Kontrast und Lesbarkeit.

#### Schwarz & Graustufen

```css
/* Ultra Dark - Haupthintergrund Dark Mode */
#0A0A0B (RGB: 10, 10, 11) - 4% Helligkeit

/* Very Dark - Sekundäre Elemente Dark Mode */
#121214 (RGB: 18, 18, 20) - 7% Helligkeit

/* Dark - Tertiary Dark Mode */
#1A1A1D (RGB: 26, 26, 29) - 10% Helligkeit

/* Medium Dark - Elevated Elements */
#1F1F23 (RGB: 31, 31, 35) - 12% Helligkeit

/* Medium Gray - Sekundärtext */
#525252 (RGB: 82, 82, 82) - 32% Helligkeit
#737373 (RGB: 115, 115, 115) - 45% Helligkeit
#A3A3A3 (RGB: 163, 163, 163) - 64% Helligkeit

/* Light Gray - Borders */
#D4D4D4 (RGB: 212, 212, 212) - 83% Helligkeit
#E5E5E5 (RGB: 229, 229, 229) - 90% Helligkeit

/* Very Light - Hintergründe Light Mode */
#F5F5F4 (RGB: 245, 245, 244) - 96% Helligkeit
#FAFAF9 (RGB: 250, 250, 249) - 98% Helligkeit

/* Pure White */
#FFFFFF (RGB: 255, 255, 255) - 100% Helligkeit
```

#### Akzentfarbe - Blau

```css
/* Primary Blue - Hauptakzent */
#024D81 (RGB: 2, 77, 129)
HSL: 200°, 98%, 26%

Verwendung:
- Hover-States
- Wichtige CTAs
- Links im Fließtext
- Akzent-Borders
```

---

## 📝 Typografie

### Schriftarten

```css
/* Serif - Fließtext & Body */
font-family: 'Alegreya', Georgia, serif;

/* Sans-Serif - Headlines & UI */
font-family: Arial, Helvetica, sans-serif;
```

### Schriftgrößen

```css
/* Headlines */
h1: clamp(2rem, 5vw, 3rem)      /* 32px - 48px */
h2: clamp(1.5rem, 4vw, 2rem)    /* 24px - 32px */
h3: clamp(1.25rem, 3vw, 1.5rem) /* 20px - 24px */
h4: clamp(1.1rem, 2.5vw, 1.25rem) /* 17.6px - 20px */

/* Body Text */
Base: 16px
Paragraph Large: 1.25rem (20px)
Paragraph: 1.125rem (18px)
Small: 0.875rem (14px)
Extra Small: 0.75rem (12px)
```

### Font Weights

```css
Regular: 400
Medium: 500
Bold: 700
```

### Line Heights

```css
Headlines: 1.2
Body Text: 1.6
Paragraph Large: 1.8
Relaxed: 2.0
```

---

## 📐 Spacing System

### Base Unit: 4px

```css
/* Spacing Scale */
0.25rem = 4px
0.5rem = 8px
0.75rem = 12px
1rem = 16px
1.25rem = 20px
1.5rem = 24px
2rem = 32px
2.5rem = 40px
3rem = 48px
4rem = 64px
6rem = 96px
8rem = 128px
```

### Gängige Abstände

```css
/* Komponenten Padding */
Card: 1.5rem (24px)
Button: 0.75rem 1.5rem (12px 24px)
Input: 0.75rem 1rem (12px 16px)

/* Margins */
Section: 3-4rem (48-64px)
Card Gap: 2rem (32px)
Element Gap: 0.5-1rem (8-16px)
```

---

## 🔲 Komponenten

### Buttons

```css
/* Primary Button */
background: #024D81
color: #FFFFFF
padding: 0.75rem 1.5rem
border-radius: 6px
font-weight: 500
transition: all 0.2s ease

hover:
  background: #035a93 (aufgehellt)
  
/* Secondary Button */
background: transparent
border: 1px solid #D4D4D4
color: var(--color-text-primary)
padding: 0.75rem 1.5rem
border-radius: 6px

hover:
  border-color: var(--color-text-primary)
  background: var(--color-bg-tertiary)
```

### Cards

```css
background: var(--color-bg-elevated)
border: 1px solid var(--color-border-primary)
border-radius: 8px
padding: 1.5rem
box-shadow: var(--shadow-md)

hover:
  transform: translateY(-4px)
  box-shadow: var(--shadow-lg)
```

### Navigation Cards

```css
/* Card 1 - Ultra Dark */
background: #0A0A0B
color: #FFFFFF

/* Card 2 - Dark */
background: #1A1A1D
color: #FFFFFF

/* Card 3 - Blue Accent */
background: #024D81
color: #FFFFFF

border-radius: 12px
padding: 1.5rem
box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1)

hover:
  transform: translateY(-4px)
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15)
```

### Form Elements

```css
input, textarea:
  background: var(--color-bg-primary)
  border: 1px solid var(--color-border-primary)
  border-radius: 6px
  padding: 0.75rem 1rem
  
  focus:
    border-color: #024D81
    box-shadow: 0 0 0 3px rgba(2, 77, 129, 0.1)
```

### Tags

```css
background: rgba(2, 77, 129, 0.1)
color: #024D81
padding: 0.25rem 0.75rem
border-radius: 9999px
font-size: 0.75rem
font-weight: 500
```

---

## 🌓 Dark/Light Mode

### Light Mode (Default)

```css
--color-bg-primary: #FFFFFF
--color-bg-secondary: #FAFAF9
--color-text-primary: #0C0C0C
--color-text-secondary: #525252
--color-border-accent: #0C0C0C
--color-accent-primary: #024D81
```

### Dark Mode

```css
--color-bg-primary: #0A0A0B
--color-bg-secondary: #121214
--color-text-primary: #FAFAFA
--color-text-secondary: #A1A1AA
--color-border-accent: #FAFAFA
--color-accent-primary: #024D81
```

---

## 📊 Shadows

```css
--shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05)
--shadow-md: 0 4px 6px rgba(0, 0, 0, 0.07)
--shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1)

Dark Mode:
--shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.3)
--shadow-md: 0 4px 6px rgba(0, 0, 0, 0.4)
--shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.5)
```

---

## 🎭 Animationen

### Transitions

```css
/* Standard */
transition: all 0.2s ease

/* Smooth */
transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1)

/* Navigation */
transition: height 0.4s cubic-bezier(0.4, 0, 0.2, 1)
```

### Hover Effects

```css
/* Links */
hover: color: #024D81

/* Cards */
hover: 
  transform: translateY(-4px)
  box-shadow: increased

/* Buttons */
hover:
  background: slightly lighter/darker
  
/* Images */
hover:
  transform: scale(1.05)
```

---

## 📱 Breakpoints

```css
/* Mobile First */
Mobile: 0px - 767px
Tablet: 768px - 1023px
Desktop: 1024px+

/* Tailwind Breakpoints */
sm: 640px
md: 768px
lg: 1024px
xl: 1280px
2xl: 1536px
```

---

## 🎯 Best Practices

### Kontraste

- Text auf Hintergrund: Mindestens 4.5:1 (WCAG AA)
- Große Headlines: Mindestens 3:1
- Blau (#024D81) nur auf hellen Hintergründen oder als Akzent

### Spacing

- Konsistente Abstände mit 4px-Grid
- Whitespace großzügig nutzen
- Sections klar trennen

### Typography

- Serif für Fließtext (Lesefreundlichkeit)
- Sans-Serif für UI-Elemente (Klarheit)
- Hierarchie durch Größe und Weight

### Farben

- Maximal 3 Farben gleichzeitig
- Blau (#024D81) sparsam als Akzent
- Graustufen für Struktur und Hierarchie

---

## 🚫 Don'ts

❌ Keine bunten Gradients  
❌ Keine zusätzlichen Akzentfarben außer #024D81  
❌ Keine zu kleinen Schriftgrößen (< 14px Body)  
❌ Keine zu engen Zeilenabstände  
❌ Keine reine Farbe für Information (Accessibility)  

---

## ✅ Do's

✅ Konsistente Graustufen verwenden  
✅ Blau (#024D81) als einzige Akzentfarbe  
✅ Großzügige Whitespace  
✅ Klare Typografie-Hierarchie  
✅ Accessibility beachten (Kontraste, Alt-Texte)  
✅ Mobile-First Approach  

---

**Version:** 1.0  
**Letzte Aktualisierung:** Januar 2026  
**Projekt:** Ahmet Özay - Journalist & Autor

