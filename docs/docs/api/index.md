---
title: API Reference
---

# API Reference

# API Reference

Vollständige API-Referenz für den Documentation MCP Server.

## 📚 Übersicht

Der Documentation MCP Server bietet 7 Tools über das Model Context Protocol:

- [docs_analyze_project](#docs_analyze_project) - Projekt analysieren
- [docs_generate_structure](#docs_generate_structure) - Struktur generieren
- [docs_create_page](#docs_create_page) - Seiten erstellen
- [docs_generate_api](#docs_generate_api) - API-Docs generieren
- [docs_preview](#docs_preview) - Preview-Server
- [docs_build_static](#docs_build_static) - Static Build
- [docs_export_pdf](#docs_export_pdf) - PDF-Export

---

## docs_analyze_project

Analysiert ein Projekt und gibt Struktur-Informationen zurück.

### Input Schema

```typescript
{
  projectPath: string;      // Required
  language?: string;        // Optional
}
```

### Unterstützte Sprachen

`"typescript"` | `"javascript"` | `"python"` | `"go"` | `"rust"` | `"java"` | `"csharp"`

### Output

```typescript
{
  path: string;
  language: string;
  fileCount: number;
  structure: object;
  suggestions: string[];
}
```

### Beispiel

```typescript
const result = await docs_analyze_project({
  projectPath: "./my-project",
  language: "typescript"
});
```

---

## docs_generate_structure

Erstellt Dokumentations-Gerüst mit Framework-Templates.

### Input Schema

```typescript
{
  projectPath: string;      // Required
  framework: string;        // Required
  template?: string;        // Optional
  outputPath?: string;      // Optional (default: "./docs")
}
```

### Frameworks

`"docusaurus"` | `"mkdocs"` | `"sphinx"`

### Templates (Docusaurus)

`"classic"` | `"facebook"` | `"meta"`

### Output

Anweisungen zur manuellen Installation

### Beispiel

```typescript
await docs_generate_structure({
  projectPath: "./my-project",
  framework: "docusaurus",
  template: "classic"
});
```

---

## docs_create_page

Erstellt oder aktualisiert eine Dokumentationsseite.

### Input Schema

```typescript
{
  docsPath: string;         // Required
  pagePath: string;         // Required
  title: string;            // Required
  content: string;          // Required (Markdown)
}
```

### Output

Erfolgsbestätigung mit Dateipfad

### Beispiel

```typescript
await docs_create_page({
  docsPath: "./docs",
  pagePath: "docs/guides/intro.md",
  title: "Introduction",
  content: "# Introduction\n\nWelcome..."
});
```

---

## docs_generate_api

Generiert API-Dokumentation aus Code.

### Input Schema

```typescript
{
  projectPath: string;      // Required
  outputPath: string;       // Required
  language: string;         // Required
}
```

### Output

Anweisungen zur Tool-Installation (TypeDoc, etc.)

### Beispiel

```typescript
await docs_generate_api({
  projectPath: "./src",
  outputPath: "./docs/api",
  language: "typescript"
});
```

---

## docs_preview

Startet Development-Server für Preview.

### Input Schema

```typescript
{
  docsPath: string;         // Required
  framework: string;        // Required
  port?: number;            // Optional
}
```

### Default Ports

- Docusaurus: `3000`
- MkDocs: `8000`
- Sphinx: `8000`

### Beispiel

```typescript
await docs_preview({
  docsPath: "./docs",
  framework: "docusaurus",
  port: 3000
});
```

---

## docs_build_static

Baut statische Website für Production.

### Input Schema

```typescript
{
  docsPath: string;         // Required
  framework: string;        // Required
  outputPath?: string;      // Optional (default: "./build")
}
```

### Output

Build-Verzeichnis mit statischen Dateien

### Beispiel

```typescript
await docs_build_static({
  docsPath: "./docs",
  framework: "docusaurus",
  outputPath: "./build"
});
```

---

## docs_export_pdf

Exportiert Dokumentation als PDF.

### Input Schema

```typescript
{
  docsPath: string;         // Required
  outputPath: string;       // Required
  includePages?: string[];  // Optional
}
```

### includePages

Unterstützt Wildcards: `["guides/*", "api/index.md"]`

### Beispiel

```typescript
await docs_export_pdf({
  docsPath: "./docs",
  outputPath: "./documentation.pdf",
  includePages: ["intro.md", "guides/*"]
});
```

---

## Fehlerbehandlung

Alle Tools werfen Fehler mit folgender Struktur:

```typescript
{
  content: [{
    type: "text",
    text: "Error: <error-message>"
  }],
  isError: true
}
```

## TypeScript Types

```typescript
// Tool Response
interface ToolResponse {
  content: Array<{
    type: "text";
    text: string;
  }>;
  isError?: boolean;
}

// Analyze Project Result
interface AnalyzeResult {
  path: string;
  language: string;
  fileCount: number;
  structure: Record<string, any>;
  suggestions: string[];
}

// Supported Languages
type Language = 
  | "typescript"
  | "javascript"
  | "python"
  | "go"
  | "rust"
  | "java"
  | "csharp";

// Supported Frameworks
type Framework = 
  | "docusaurus"
  | "mkdocs"
  | "sphinx";
```

## Weitere Informationen

- [Tool-Dokumentation](../tools/overview.md)
- [Beispiele](../guides/examples.md)
- [GitHub Repository](https://github.com/your-org/documentation-mcp-server)
