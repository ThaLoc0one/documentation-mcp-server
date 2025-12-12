---
title: docs_generate_api
---

# docs_generate_api

# docs_generate_api

Generiert API-Dokumentation aus Code-Kommentaren (JSDoc, Docstrings, etc.).

## 📖 Beschreibung

Extrahiert automatisch Dokumentation aus Ihrem Quellcode und erstellt strukturierte API-Referenzen.

## 🎯 Parameter

### `projectPath` (required)
- **Typ:** `string`
- **Beschreibung:** Pfad zum Quellcode-Verzeichnis

### `outputPath` (required)
- **Typ:** `string`
- **Beschreibung:** Ausgabepfad für die API-Dokumentation

### `language` (required)
- **Typ:** `string`
- **Werte:** `"typescript"`, `"javascript"`, `"python"`, `"go"`, `"rust"`, `"java"`, `"csharp"`
- **Beschreibung:** Programmiersprache

## 💡 Beispiel

```typescript
await docs_generate_api({
  projectPath: "./src",
  outputPath: "./docs/api",
  language: "typescript"
});
```

## 🔧 Verwendete Tools

- **TypeScript/JavaScript:** TypeDoc
- **Python:** Sphinx, pdoc
- **Go:** godoc
- **Rust:** rustdoc
