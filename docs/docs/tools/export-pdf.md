---
title: docs_export_pdf
---

# docs_export_pdf

# docs_export_pdf

Exportiert Dokumentation als PDF-Datei für Offline-Nutzung oder Archivierung.

## 📖 Beschreibung

Konvertiert Ihre Dokumentation in ein druckfreundliches PDF mit Inhaltsverzeichnis, Seitenzahlen und Hyperlinks.

## 🎯 Parameter

### `docsPath` (required)
- **Typ:** `string`
- **Beschreibung:** Pfad zur Dokumentation oder gebauten Website

### `outputPath` (required)
- **Typ:** `string`
- **Beschreibung:** Ausgabepfad für die PDF-Datei

### `includePages` (optional)
- **Typ:** `string[]`
- **Beschreibung:** Spezifische Seiten zum Inkludieren (Wildcard-Support: `"guides/*"`)
- **Standard:** Alle Seiten

## 💡 Beispiele

### Vollständige Dokumentation

```typescript
await docs_export_pdf({
  docsPath: "./docs",
  outputPath: "./documentation.pdf"
});
```

### Nur spezifische Seiten

```typescript
await docs_export_pdf({
  docsPath: "./docs",
  outputPath: "./getting-started.pdf",
  includePages: [
    "intro.md",
    "guides/installation.md",
    "guides/getting-started.md"
  ]
});
```

### Mit Wildcards

```typescript
await docs_export_pdf({
  docsPath: "./docs",
  outputPath: "./api-reference.pdf",
  includePages: ["api/*"]
});
```
