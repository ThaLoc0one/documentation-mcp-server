---
title: docs_build_static
---

# docs_build_static

# docs_build_static

Baut eine statische Website für Produktions-Hosting.

## 📖 Beschreibung

Erstellt optimierte, produktionsreife HTML/CSS/JS-Dateien, die auf jedem Static-Host bereitgestellt werden können.

## 🎯 Parameter

### `docsPath` (required)
- **Typ:** `string`
- **Beschreibung:** Pfad zum Dokumentations-Verzeichnis

### `framework` (required)
- **Typ:** `string`
- **Werte:** `"docusaurus"` | `"mkdocs"` | `"sphinx"`
- **Beschreibung:** Verwendetes Framework

### `outputPath` (optional)
- **Typ:** `string`
- **Standard:** `"./build"`
- **Beschreibung:** Ausgabepfad für die gebaute Website

## 💡 Beispiel

```typescript
await docs_build_static({
  docsPath: "./docs",
  framework: "docusaurus",
  outputPath: "./build"
});
```

## 🚀 Deployment

Die erstellten Dateien können auf folgenden Plattformen gehostet werden:
- GitHub Pages
- Netlify
- Vercel
- AWS S3
- Jeden CDN/Static-Host
