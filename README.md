# 📚 Documentation MCP Server

Ein Model Context Protocol (MCP) Server zum Generieren professioneller Dokumentationen mit Unterstützung für mehrere Frameworks.

## ✨ Features

- 🔍 **Deep Code Analysis** - AST-basierte Multi-Language Analysis
  - **TypeScript/JavaScript**: TypeScript Compiler API
  - **Python**: Native Python AST module
  - **Go**: Go parser & AST
  - **PHP**: Regex-basierte Analyse + PHP 8+ Features
  - Extrahiert Klassen, Funktionen, Interfaces, Methoden, Properties
  - **PHP 8+**: Enums, Traits, Attributes
  - Erfasst JSDoc/Docstrings/Go Doc/PHPDoc und berechnet Dokumentations-Coverage
  - Analysiert Imports/Exports und Module-Dependencies
- 🌍 **Multi-Language Projects** - Automatische Erkennung und parallele Analyse mehrerer Sprachen
- 📊 **Projekt-Analyse** - Automatische Code-Analyse für TypeScript, JavaScript, Python, Go, PHP
- 🏗️ **Struktur-Generierung** - Erstellt komplette Dokumentations-Gerüste
- ✍️ **Seiten-Editor** - Erstellt und bearbeitet einzelne Dokumentationsseiten
- 📖 **API-Dokumentation** - Generiert API-Docs aus Code-Kommentaren
- 🌐 **Static Site Builder** - Baut statische Websites für Hosting
- 📄 **PDF-Export** - Konvertiert Dokumentation zu PDF
- 👀 **Live-Preview** - Lokaler Entwicklungsserver

## 🛠️ Unterstützte Frameworks

- **Docusaurus** (React-basiert, modern, verschiedene Templates)
- **MkDocs** (Python-basiert, Markdown-fokussiert, einfach)
- **Sphinx** (Python, sehr mächtig, für komplexe Projekte)

## 🚀 Quick Start

1. Verzeichnisse erstellen:

   ```cmd
   mkdir src
   mkdir src\tools
   ```

2. Dependencies installieren:

   ```cmd
   npm install
   ```

3. Build:

   ```cmd
   npm run build
   ```

4. MCP Server in Claude Desktop konfigurieren (siehe SETUP.md)

## 📦 Tools

### `docs_analyze_project`

Analysiert Projekt-Struktur und führt Deep Code Analysis durch.

**Parameter:**

- `projectPath` (string, required) - Pfad zum Projekt
- `language` (enum, optional) - Programmiersprache (typescript, javascript, python, go, rust, java, csharp)
- `deep` (boolean, optional, default: true) - Aktiviert Deep Code Analysis

**Deep Analysis Features:**

- 📦 Extrahiert Classes/Structs, Interfaces, Functions, Enums, Type Aliases
- 🔍 Erfasst Methods, Properties, Constructors mit vollständigen Details
- 📝 Analysiert JSDoc/Docstrings/Go Doc und berechnet Documentation Coverage
- 🔗 Trackt Imports/Exports und Module Dependencies
- 📊 Generiert Zusammenfassungs-Statistiken
- 🎯 **Multi-Language Support:**
  - ✅ TypeScript/JavaScript (TypeScript Compiler API)
  - ✅ Python (Native Python AST)
  - ✅ Go (go/parser & go/ast)
  - ✅ PHP v2 (nikic/php-parser AST) - **Neu! 100% genau**
    - Namespaces & Use-Statements
    - Union/Intersection/Nullable Types
    - Enums, Traits, Attributes (PHP 8+)
    - **Framework Detection:**
      - CodeIgniter 3/4 (Controller, Model)
      - Laravel (Illuminate\*)
      - Symfony (Symfony\*)
      - MVC Pattern Recognition
    - **Route Detection:** 🚀
      - Convention-based: `/controller/method/{param}`
      - Attribute-based: `#[Get('/')]`, `#[Post('/')]`
      - HTTP Methods: GET, POST, PUT, PATCH, DELETE
      - Parameter Types & Required/Optional Status
    - **Middleware Detection:** 🔒
      - Laravel: `#[Middleware('auth')]`
      - Symfony: `#[IsGranted('ROLE_ADMIN')]`
      - CodeIgniter 4: `#[Filter('auth')]`
      - CodeIgniter 3: `@middleware` (Docblocks)
      - Class-Level & Method-Level
      - Middleware Parameters
    - **OpenAPI 3.0 Export:** 📋
      - Auto-generates Swagger/OpenAPI specs
      - Routes → Paths conversion
      - Middleware → Security Schemes
      - JSON & YAML format support
  - ✅ PHP v1 (Regex-based) - Fallback
  - 🌍 Automatische Multi-Language-Erkennung
  - 🔜 Rust, Java, C# (in Planung)

**Beispiel-Rückgabe:**

```json
{
  "deepAnalysis": {
    "summary": {
      "totalFiles": 11,
      "totalClasses": 2,
      "totalInterfaces": 23,
      "totalFunctions": 16,
      "overallDocCoverage": 3.17
    }
  }
}
```

### `docs_generate_structure`

Generiert Dokumentations-Gerüst.

**Parameter:**

- `projectPath` (string, required) - Pfad zum Projekt
- `framework` (enum, required) - docusaurus | mkdocs | sphinx
- `template` (string, optional) - Template-Name
- `outputPath` (string, optional) - Ausgabepfad (default: ./docs)

### `docs_create_page`

Erstellt oder bearbeitet Dokumentationsseite.

**Parameter:**

- `docsPath` (string, required) - Pfad zur Doku
- `pagePath` (string, required) - Relativer Pfad zur Seite
- `title` (string, required) - Seitentitel
- `content` (string, required) - Markdown-Inhalt

### `docs_generate_api`

Generiert API-Dokumentation aus Code.

**Parameter:**

- `projectPath` (string, required) - Pfad zum Quellcode
- `outputPath` (string, required) - Ausgabepfad
- `language` (enum, required) - Programmiersprache

### `docs_build_static`

Baut statische Website.

**Parameter:**

- `docsPath` (string, required) - Pfad zur Doku
- `framework` (enum, required) - Framework
- `outputPath` (string, optional) - Ausgabepfad (default: ./build)

### `docs_export_pdf`

Exportiert Dokumentation als PDF.

**Parameter:**

- `docsPath` (string, required) - Pfad zur Doku
- `outputPath` (string, required) - PDF-Ausgabepfad
- `includePages` (array, optional) - Spezifische Seiten

### `docs_preview`

Startet lokalen Dev-Server.

**Parameter:**

- `docsPath` (string, required) - Pfad zur Doku
- `framework` (enum, required) - Framework
- `port` (number, optional) - Port (default: 3000/8000)

### `docs_generate_openapi`

Generiert OpenAPI 3.0 Spezifikation aus PHP-Code.

**Parameter:**

- `projectPath` (string, required) - PHP-Projekt Pfad
- `outputPath` (string, optional) - Ausgabepfad (default: ./openapi.json)
- `format` (enum, optional) - json | yaml (default: json)
- `title` (string, optional) - API-Titel
- `version` (string, optional) - API-Version
- `serverUrl` (string, optional) - API Server URL

### `docs_generate_sales_docs` 🎯 **NEU!**

Generiert professionelle, verkaufsfertige Dokumentation für CodeCanyon, ThemeForest, etc.

**Parameter:**

- `projectPath` (string, required) - PHP-Projekt Pfad
- `outputDir` (string, optional) - Ausgabe-Verzeichnis (default: ./sales-docs)
- `productName` (string, required) - Produktname
- `productVersion` (string, optional) - Version (default: 1.0.0)
- `author` (string, required) - Autor/Firma
- `description` (string, required) - Produktbeschreibung
- `price` (string, optional) - Preis (z.B., "$49")
- `demoUrl` (string, optional) - Live-Demo URL
- `supportEmail` (string, optional) - Support E-Mail
- `features` (array, optional) - Liste der Key Features

**Generierte Dateien:**

1. **README.md** (2.5 KB) - Produkt-Übersicht mit Features, Statistiken, Requirements
2. **INSTALLATION.md** (3.2 KB) - Schritt-für-Schritt Setup-Guide
3. **API_REFERENCE.md** (24.2 KB) - Komplette API-Dokumentation
4. **CONFIGURATION.md** (2.1 KB) - Umgebungsvariablen, Security
5. **EXAMPLES.md** (4.0 KB) - Code-Beispiele (JS, PHP, Python)
6. **FAQ.md** (2.2 KB) - Häufig gestellte Fragen
7. **CHANGELOG.md** (0.9 KB) - Versionshistorie
8. **COMPLETE_DOCUMENTATION.md** (39.0 KB) - All-in-One für PDF

**Gesamt:** ~78 KB professionelle Dokumentation!

## 🏗️ Architektur

```
src/
├── index.ts                    # MCP Server Hauptdatei
├── core/                       # Kern-Module für Deep Analysis
│   ├── types.ts               # Type-Definitionen für alle Sprachen
│   └── analyzer.ts            # Abstract Base Class & Factory
├── analyzers/                  # Sprachspezifische Analyzer
│   ├── typescript.ts          # TypeScript/JavaScript (TS Compiler API)
│   ├── python.ts              # Python Wrapper (subprocess)
│   ├── go.ts                  # Go Wrapper (subprocess)
│   └── helpers/               # Native Language Parsers
│       ├── python_analyzer.py # Python AST Parser
│       └── go_analyzer.go     # Go AST Parser
└── tools/                      # MCP Tool-Implementierungen
    ├── analyzeProject.ts      # Deep Analysis Integration
    ├── generateStructure.ts
    ├── createPage.ts
    ├── generateApi.ts
    ├── buildStatic.ts
    ├── exportPdf.ts
    └── preview.ts
```

### 🔬 Deep Analysis Pipeline

1. **File Scanning** - Durchsucht Projekt-Verzeichnis
2. **Language Detection** - Erkennt dominante Programmiersprache
3. **Analyzer Selection** - Wählt passenden AST-Parser (Factory Pattern)
4. **AST Parsing** - Parst Code-Dateien mit sprachspezifischem Parser
   - TypeScript: TS Compiler API (in-process)
   - Python: Python AST module (subprocess)
   - Go: go/parser & go/ast (subprocess)
5. **Symbol Extraction** - Extrahiert alle Code-Symbole (Classes, Functions, etc.)
6. **Documentation Analysis** - Erfasst Dokumentations-Kommentare
7. **Summary Generation** - Berechnet Statistiken und Coverage

## 📝 Lizenz

MIT
