---
title: docs_analyze_project
---

# docs_analyze_project

# docs_analyze_project

Analysiert die Struktur und den Code eines Projekts, um relevante Informationen für die Dokumentationserstellung zu sammeln.

## 📖 Beschreibung

Das `docs_analyze_project`-Tool scannt ein Projekt-Verzeichnis und führt eine **tiefgehende Code-Analyse** durch:

- **Projektstruktur** - Verzeichnisse und Dateien
- **Deep Code Analysis** - Extrahiert Klassen, Funktionen, Interfaces, Methoden
- **Dokumentations-Coverage** - Misst wie gut der Code dokumentiert ist
- **Code-Muster** - Verwendete Frameworks und Bibliotheken
- **Sprachen** - Erkannte Programmiersprachen
- **Empfehlungen** - Best Practices für die Dokumentation

### 🚀 Deep Analysis Feature

Das Tool verwendet sprachspezifische AST-Parser (z.B. TypeScript Compiler API) für:

- Extraktion aller Code-Symbole (Classes, Functions, Interfaces)
- Erfassung von Methoden, Properties, Constructors
- Analyse von Imports/Exports und Dependencies
- Berechnung der Dokumentations-Coverage (JSDoc, Docstrings, etc.)

## 🎯 Anwendungsfälle

### 1. Neues Projekt verstehen

Bevor Sie Dokumentation erstellen, analysieren Sie das Projekt:

```typescript
const result = await docs_analyze_project({
  projectPath: "./unknown-project",
});
// Erhalten Sie Übersicht über Struktur und verwendete Technologien
```

### 2. Framework-Empfehlung erhalten

Lassen Sie das Tool entscheiden, welches Dokumentations-Framework am besten passt:

```typescript
const result = await docs_analyze_project({
  projectPath: "./my-python-app",
  language: "python",
});
// Empfehlung: MkDocs oder Sphinx für Python-Projekte
```

### 3. Multi-Language-Projekte

Analysieren Sie Projekte mit mehreren Sprachen:

```typescript
const result = await docs_analyze_project({
  projectPath: "./fullstack-app",
  // Erkennt automatisch TypeScript (Frontend) und Python (Backend)
});
```

## 📝 Parameter

### `projectPath` (required)

- **Typ:** `string`
- **Beschreibung:** Absoluter oder relativer Pfad zum Projekt-Verzeichnis
- **Beispiel:** `"./my-project"`, `"e:\\Projects\\my-app"`

### `language` (optional)

- **Typ:** `string`
- **Beschreibung:** Primäre Programmiersprache des Projekts
- **Werte:** `"typescript"`, `"javascript"`, `"python"`, `"go"`, `"rust"`, `"java"`, `"csharp"`
- **Standard:** Auto-Erkennung basierend auf Dateien

### `deep` (optional)

- **Typ:** `boolean`
- **Beschreibung:** Aktiviert Deep Code Analysis mit sprachspezifischen AST-Parsern
- **Standard:** `true`
- **Hinweis:** Wenn aktiviert, werden Klassen, Funktionen, Interfaces, Methods, Properties, Documentation-Coverage extrahiert

## 📤 Rückgabewert

```typescript
{
  path: string;              // Analysierter Pfad
  language: string;          // Erkannte/angegebene Sprache
  fileCount: number;         // Anzahl der Dateien
  structure: object;         // Verzeichnisstruktur
  suggestions: string[];     // Empfehlungen
  deepAnalysis?: {           // Deep Code Analysis (wenn aktiviert)
    language: string;
    files: FileAnalysis[];   // Detaillierte Analyse pro Datei
    summary: {
      totalFiles: number;
      totalClasses: number;
      totalInterfaces: number;
      totalFunctions: number;
      totalEnums: number;
      totalTypeAliases: number;
      overallDocCoverage: number;  // Prozentsatz (0-100)
    }
  }
}
```

### FileAnalysis Struktur

Jede analysierte Datei enthält:

```typescript
{
  path: string;
  classes: ClassInfo[];      // Alle Klassen
  interfaces: InterfaceInfo[]; // Alle Interfaces
  functions: FunctionInfo[];   // Top-level Funktionen
  enums: EnumInfo[];
  typeAliases: TypeAliasInfo[];
  exports: ExportInfo[];
  imports: ImportInfo[];
  documentation: {
    hasDocumentation: boolean;
    documentedSymbols: number;
    totalSymbols: number;
    coverage: number;        // Prozentsatz (0-100)
  }
}
```

### Beispiel-Ausgabe

```json
{
  "path": "e:\\Projects\\my-app\\src",
  "language": "typescript",
  "fileCount": 11,
  "structure": {
    "files": ["index.ts"],
    "tools": {
      "files": ["analyzeProject.ts", "buildStatic.ts"]
    },
    "analyzers": {
      "files": ["typescript.ts"]
    }
  },
  "suggestions": [
    "Recommended framework: Docusaurus",
    "Use JSDoc comments for API documentation"
  ],
  "deepAnalysis": {
    "language": "typescript",
    "files": [
      {
        "path": "E:\\Projects\\my-app\\src\\analyzers\\typescript.ts",
        "classes": [
          {
            "name": "TypeScriptAnalyzer",
            "isExported": true,
            "methods": 26,
            "properties": 0,
            "documentation": "TypeScript/JavaScript deep code analyzer..."
          }
        ],
        "interfaces": [],
        "functions": [],
        "imports": 5,
        "exports": 0,
        "documentation": {
          "hasDocumentation": true,
          "documentedSymbols": 1,
          "totalSymbols": 27,
          "coverage": 3.7
        }
      }
    ],
    "summary": {
      "totalFiles": 11,
      "totalClasses": 2,
      "totalInterfaces": 23,
      "totalFunctions": 16,
      "totalEnums": 0,
      "totalTypeAliases": 0,
      "overallDocCoverage": 3.17
    }
  }
}
```

## ✅ Best Practices

### 1. Sprache spezifizieren für bessere Ergebnisse

```typescript
// ✅ Gut - Explizite Sprache
await docs_analyze_project({
  projectPath: "./app",
  language: "typescript",
});

// ⚠️ OK, aber weniger präzise
await docs_analyze_project({
  projectPath: "./app",
});
```

### 2. Vollständige Pfade verwenden

```typescript
// ✅ Gut - Absoluter Pfad
await docs_analyze_project({
  projectPath: "e:\\Projects\\my-app",
});

// ✅ Auch gut - Relativer Pfad (wenn eindeutig)
await docs_analyze_project({
  projectPath: "./my-app",
});
```

### 3. Analyse vor Struktur-Generierung

```typescript
// ✅ Empfohlener Workflow
const analysis = await docs_analyze_project({
  projectPath: "./my-app",
});

// Basierend auf Empfehlung Framework wählen
const framework = analysis.suggestions.includes("Docusaurus")
  ? "docusaurus"
  : "mkdocs";

await docs_generate_structure({
  projectPath: "./my-app",
  framework,
});
```

## 🎨 Beispiele

### TypeScript-Projekt mit Deep Analysis

```typescript
const result = await docs_analyze_project({
  projectPath: "./my-ts-library",
  language: "typescript",
  deep: true, // Default: aktiviert
});

console.log(`Gefunden: ${result.fileCount} Dateien`);
console.log(`Classes: ${result.deepAnalysis.summary.totalClasses}`);
console.log(`Interfaces: ${result.deepAnalysis.summary.totalInterfaces}`);
console.log(`Functions: ${result.deepAnalysis.summary.totalFunctions}`);
console.log(`Doc Coverage: ${result.deepAnalysis.summary.overallDocCoverage}%`);

// Detaillierte Analyse pro Datei
result.deepAnalysis.files.forEach((file) => {
  console.log(`\n${file.path}:`);
  file.classes.forEach((cls) => {
    console.log(`  Class: ${cls.name}`);
    console.log(`    Methods: ${cls.methods.length}`);
    console.log(`    Documented: ${cls.documentation ? "Yes" : "No"}`);
  });
});
```

### Shallow Analysis (schneller, weniger Details)

```typescript
const result = await docs_analyze_project({
  projectPath: "./large-project",
  deep: false, // Deaktiviert Deep Analysis
});

// Nur Dateistruktur und Empfehlungen
console.log(`Files: ${result.fileCount}`);
console.log(`Suggestions: ${result.suggestions.join(", ")}`);
```

### Python-Projekt analysieren

```typescript
const result = await docs_analyze_project({
  projectPath: "./python-api",
  language: "python",
});

// Typische Empfehlungen für Python:
// - "Recommended framework: Sphinx"
// - "Use Python docstrings for API documentation"
```

### Monorepo analysieren

```typescript
// Haupt-Projekt analysieren
const mainAnalysis = await docs_analyze_project({
  projectPath: "./monorepo",
});

// Einzelne Packages analysieren
const frontendAnalysis = await docs_analyze_project({
  projectPath: "./monorepo/packages/frontend",
  language: "typescript",
});

const backendAnalysis = await docs_analyze_project({
  projectPath: "./monorepo/packages/backend",
  language: "python",
});
```

## 🔍 Was wird analysiert?

### Shallow Analysis (immer)

- Verzeichnisstruktur
- Dateianzahl und -typen
- Haupt-Konfigurationsdateien
- Framework-Erkennung

### Deep Analysis (optional, Standard: aktiviert)

#### TypeScript/JavaScript (TypeScript Compiler API)

- **Classes:** Name, Methods, Properties, Constructors, Visibility
- **Interfaces:** Properties, Methods, Extends
- **Functions:** Parameters, Return Types, Async
- **Methods:** Visibility (public/private/protected), Static, Abstract
- **Imports/Exports:** Module Dependencies
- **JSDoc:** Dokumentations-Kommentare
- **Coverage:** Prozentsatz dokumentierter Symbole

#### Python (geplant für Phase 2)

- Classes, Functions, Methods
- Docstrings
- Type Hints
- Decorators

#### Go, Rust, Java, C# (geplant für Phase 3+)

- Language-specific Code-Strukturen
- Dokumentations-Kommentare
- Visibility/Access Modifiers

## ⚠️ Einschränkungen

### Performance bei großen Projekten

```typescript
// Sehr große Projekte können Zeit benötigen
// Tipp: Analysieren Sie spezifische Teilbereiche
await docs_analyze_project({
  projectPath: "./large-monorepo/packages/specific-package",
});
```

### Nicht unterstützte Dateitypen

- Binärdateien werden ignoriert
- Generierte Dateien (node_modules, dist, build) werden übersprungen

### Auto-Erkennung Grenzen

Bei unklaren Projekten ist es besser, die Sprache anzugeben:

```typescript
// Bei gemischten Projekten
await docs_analyze_project({
  projectPath: "./mixed-project",
  language: "typescript", // Fokus auf TypeScript
});
```

## 🔗 Verwandte Tools

- [docs_generate_structure](./generate-structure.md) - Nächster Schritt nach Analyse
- [docs_generate_api](./generate-api.md) - API-Docs basierend auf erkannter Sprache

## 💡 Tipps

1. **Führen Sie die Analyse immer zuerst aus** - Sie erhalten wertvolle Empfehlungen
2. **Deep Analysis für präzise Dokumentation** - Erfasst alle Code-Strukturen automatisch
3. **Nutzen Sie die Coverage-Metriken** - Identifizieren Sie undokumentierten Code
4. **Analysieren Sie Teilbereiche** - Bei Monorepos nur relevante Packages
5. **Speichern Sie die Ergebnisse** - Für spätere Referenz und Vergleiche

### 🎯 Deep Analysis Best Practices

```typescript
// ✅ Analysieren Sie den src-Ordner für Code-Details
const deepResult = await docs_analyze_project({
  projectPath: "./my-app/src",
  deep: true,
});

// ✅ Identifizieren Sie undokumentierten Code
if (deepResult.deepAnalysis.summary.overallDocCoverage < 50) {
  console.log("⚠️ Code needs more documentation!");

  // Finden Sie Dateien mit niedriger Coverage
  deepResult.deepAnalysis.files.forEach((file) => {
    if (file.documentation.coverage < 30) {
      console.log(`  - ${file.path}: ${file.documentation.coverage}%`);
    }
  });
}

// ✅ Extrahieren Sie alle öffentlichen APIs
deepResult.deepAnalysis.files.forEach((file) => {
  file.classes.forEach((cls) => {
    if (cls.isExported) {
      console.log(`Public Class: ${cls.name}`);
      cls.methods.forEach((method) => {
        if (method.visibility === "public" || !method.visibility) {
          console.log(`  - ${method.name}()`);
        }
      });
    }
  });
});
```
