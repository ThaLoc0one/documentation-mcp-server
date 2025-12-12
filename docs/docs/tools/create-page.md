---
title: docs_create_page
---

# docs_create_page

# docs_create_page

Erstellt oder bearbeitet einzelne Dokumentationsseiten mit Markdown-Content.

## 📖 Beschreibung

Mit diesem Tool können Sie neue Markdown-Seiten zu Ihrer Dokumentation hinzufügen oder bestehende aktualisieren.

## 🎯 Parameter

### `docsPath` (required)
- **Typ:** `string`
- **Beschreibung:** Pfad zum Dokumentations-Verzeichnis

### `pagePath` (required)
- **Typ:** `string`
- **Beschreibung:** Relativer Pfad zur Seite (z.B. `"guides/getting-started.md"`)

### `title` (required)
- **Typ:** `string`
- **Beschreibung:** Seitentitel

### `content` (required)
- **Typ:** `string`
- **Beschreibung:** Markdown-Inhalt der Seite

## 💡 Beispiel

```typescript
await docs_create_page({
  docsPath: "./docs",
  pagePath: "docs/guides/installation.md",
  title: "Installation Guide",
  content: "# Installation\n\n..."
});
```
