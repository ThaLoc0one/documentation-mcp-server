---
title: docs_preview
---

# docs_preview

# docs_preview

Startet einen lokalen Entwicklungsserver für Live-Vorschau der Dokumentation.

## 📖 Beschreibung

Ermöglicht das lokale Testen und Durchsuchen Ihrer Dokumentation mit automatischem Reload bei Änderungen.

## 🎯 Parameter

### `docsPath` (required)
- **Typ:** `string`
- **Beschreibung:** Pfad zum Dokumentations-Verzeichnis

### `framework` (required)
- **Typ:** `string`
- **Werte:** `"docusaurus"` | `"mkdocs"` | `"sphinx"`
- **Beschreibung:** Verwendetes Framework

### `port` (optional)
- **Typ:** `number`
- **Standard:** `3000` (Docusaurus) oder `8000` (MkDocs/Sphinx)
- **Beschreibung:** Port-Nummer für den Server

## 💡 Beispiel

```typescript
await docs_preview({
  docsPath: "./docs",
  framework: "docusaurus",
  port: 3000
});
```

Öffnen Sie dann http://localhost:3000 im Browser.
