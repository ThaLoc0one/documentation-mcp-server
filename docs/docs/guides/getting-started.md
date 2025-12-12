---
title: Erste Schritte
---

# Erste Schritte

# Erste Schritte

Dieser Guide führt Sie Schritt für Schritt durch die Erstellung Ihrer ersten Dokumentation mit dem Documentation MCP Server.

## 🎯 Was Sie lernen werden

- Ein Projekt analysieren
- Dokumentations-Struktur erstellen  
- Custom Pages hinzufügen
- Live-Vorschau starten
- Production-Build erstellen

## ⏱️ Zeitbedarf

Etwa 15-20 Minuten für ein einfaches Projekt.

## 📋 Voraussetzungen

- [Installation & Setup](../setup.md) abgeschlossen
- MCP Server läuft
- Ein Beispiel-Projekt zum Dokumentieren

## 🚀 Schritt-für-Schritt Anleitung

### Schritt 1: Projekt analysieren

Beginnen Sie mit der Analyse Ihres Projekts:

```typescript
const analysis = await docs_analyze_project({
  projectPath: "./mein-projekt",
  language: "typescript"
});
```

**Was passiert hier?**
- Das Tool scannt Ihre Projektstruktur
- Erkennt verwendete Technologien
- Gibt Empfehlungen für das beste Framework

**Erwartete Ausgabe:**
```json
{
  "path": "./mein-projekt",
  "language": "typescript",
  "fileCount": 25,
  "structure": { ... },
  "suggestions": [
    "Recommended framework: Docusaurus",
    "Use JSDoc comments for API documentation"
  ]
}
```

### Schritt 2: Dokumentations-Struktur generieren

Basierend auf der Empfehlung, erstellen Sie die Struktur:

```typescript
await docs_generate_structure({
  projectPath: "./mein-projekt",
  framework: "docusaurus",
  template: "classic",
  outputPath: "./docs"
});
```

**Was wird erstellt?**
- `docs/` Verzeichnis mit vollständiger Docusaurus-Installation
- Vorkonfigurierte Navigation
- Standard-Templates
- Build-Konfiguration

**Manueller Schritt:**
Führen Sie die angegebenen Installations-Befehle aus:
```bash
cd ./docs
npm install
```

### Schritt 3: API-Dokumentation generieren

Generieren Sie automatisch API-Docs aus Ihrem Code:

```typescript
await docs_generate_api({
  projectPath: "./mein-projekt/src",
  outputPath: "./docs/docs/api",
  language: "typescript"
});
```

**Für TypeScript:**
```bash
# Das Tool gibt Ihnen die Befehle
npm install --save-dev typedoc
npx typedoc --out ./docs/docs/api ./mein-projekt/src
```

### Schritt 4: Custom Pages erstellen

Fügen Sie eigene Dokumentationsseiten hinzu:

```typescript
// Getting Started Guide
await docs_create_page({
  docsPath: "./docs",
  pagePath: "docs/guides/installation.md",
  title: "Installation",
  content: `# Installation

## Voraussetzungen
- Node.js 18+
- npm oder yarn

## Installation
\`\`\`bash
npm install mein-projekt
\`\`\`

## Erste Schritte
\`\`\`typescript
import { MyClass } from 'mein-projekt';

const instance = new MyClass();
instance.doSomething();
\`\`\`
`
});

// Weitere Seiten hinzufügen
await docs_create_page({
  docsPath: "./docs",
  pagePath: "docs/guides/configuration.md",
  title: "Konfiguration",
  content: "# Konfiguration\n\n..."
});
```

### Schritt 5: Live-Vorschau starten

Testen Sie Ihre Dokumentation lokal:

```typescript
await docs_preview({
  docsPath: "./docs",
  framework: "docusaurus",
  port: 3000
});
```

**Öffnen Sie im Browser:**
```
http://localhost:3000
```

**Was Sie sehen sollten:**
- Ihre neu erstellte Dokumentation
- Live-Reload bei Änderungen
- Navigierbare Struktur

### Schritt 6: Production Build

Wenn Sie zufrieden sind, erstellen Sie den Production Build:

```typescript
await docs_build_static({
  docsPath: "./docs",
  framework: "docusaurus",
  outputPath: "./docs/build"
});
```

**Ausgabe:**
```
docs/build/
├── index.html
├── assets/
│   ├── css/
│   └── js/
├── docs/
└── ...
```

Diese Dateien sind bereit für:
- GitHub Pages
- Netlify
- Vercel
- Jeden Static-Host

## 🎨 Ihr erster kompletter Workflow

Hier ist das komplette Beispiel in einem Stück:

```typescript
// 1. Projekt analysieren
const analysis = await docs_analyze_project({
  projectPath: "./mein-projekt",
  language: "typescript"
});

console.log("Empfehlung:", analysis.suggestions[0]);

// 2. Struktur generieren
await docs_generate_structure({
  projectPath: "./mein-projekt",
  framework: "docusaurus",
  template: "classic"
});

// 3. Dependencies installieren (manuell)
// cd docs && npm install

// 4. API-Docs generieren
await docs_generate_api({
  projectPath: "./mein-projekt/src",
  outputPath: "./docs/docs/api",
  language: "typescript"
});

// 5. Custom Pages erstellen
await docs_create_page({
  docsPath: "./docs",
  pagePath: "docs/intro.md",
  title: "Willkommen",
  content: "# Willkommen zu meinem Projekt\n\n..."
});

// 6. Preview starten
await docs_preview({
  docsPath: "./docs",
  framework: "docusaurus"
});

// 7. Build für Production
await docs_build_static({
  docsPath: "./docs",
  framework: "docusaurus"
});
```

## ✅ Checkliste

Nach diesem Tutorial sollten Sie:

- [ ] Ein Projekt erfolgreich analysiert haben
- [ ] Eine Dokumentations-Struktur generiert haben
- [ ] API-Dokumentation erstellt haben
- [ ] Mindestens eine Custom Page hinzugefügt haben
- [ ] Die Live-Vorschau gesehen haben
- [ ] Einen Production Build erstellt haben

## 🎓 Nächste Schritte

### Dokumentation erweitern
- [Weitere Seiten hinzufügen](./examples.md#custom-pages)
- [Bilder und Medien einbinden](./examples.md#media)
- [Code-Beispiele formatieren](./examples.md#code-examples)

### Fortgeschrittene Features
- [PDF-Export](../tools/export-pdf.md)
- [Multi-Language-Support](./advanced.md#i18n)
- [Custom Themes](./advanced.md#themes)

### Deployment
- [GitHub Pages](./deployment.md#github-pages)
- [Netlify](./deployment.md#netlify)
- [Vercel](./deployment.md#vercel)

## 🐛 Probleme?

Siehe [Troubleshooting Guide](./troubleshooting.md) oder die Tool-spezifischen Dokumentationen:

- [docs_analyze_project](../tools/analyze-project.md)
- [docs_generate_structure](../tools/generate-structure.md)
- [docs_create_page](../tools/create-page.md)

## 💡 Tipps für den Erfolg

1. **Analysieren Sie immer zuerst** - Die Empfehlungen sind wertvoll
2. **Folgen Sie den Konventionen** - Jedes Framework hat Best Practices
3. **Testen Sie lokal** - Nutzen Sie die Preview ausgiebig
4. **Iterieren Sie** - Dokumentation ist ein fortlaufender Prozess
5. **Automatisieren Sie** - Integrieren Sie in Ihre CI/CD-Pipeline
