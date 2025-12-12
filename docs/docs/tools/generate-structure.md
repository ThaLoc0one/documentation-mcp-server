---
title: docs_generate_structure
---

# docs_generate_structure

# docs_generate_structure

Erstellt das komplette Dokumentations-Gerüst mit konfigurierten Templates für verschiedene Frameworks.

## 📖 Beschreibung

Dieses Tool initialisiert eine vollständige Dokumentationsstruktur basierend auf Ihrem gewählten Framework (Docusaurus, MkDocs oder Sphinx).

## 🎯 Parameter

### `projectPath` (required)
- **Typ:** `string`
- **Beschreibung:** Pfad zum Projekt-Verzeichnis

### `framework` (required)
- **Typ:** `string`
- **Werte:** `"docusaurus"` | `"mkdocs"` | `"sphinx"`
- **Beschreibung:** Dokumentations-Framework

### `template` (optional)
- **Typ:** `string`
- **Beschreibung:** Template-Name (nur für Docusaurus)
- **Werte:** `"classic"`, `"facebook"`, `"meta"`

### `outputPath` (optional)
- **Typ:** `string`
- **Standard:** `"./docs"`
- **Beschreibung:** Ausgabepfad für die Dokumentation

## 💡 Beispiel

```typescript
await docs_generate_structure({
  projectPath: "./my-project",
  framework: "docusaurus",
  template: "classic",
  outputPath: "./documentation"
});
```
