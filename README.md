# 📚 Documentation MCP Server

A Model Context Protocol (MCP) Server for generating professional documentation with support for multiple frameworks.

## ✨ Features

- 🔍 **Deep Code Analysis** - AST-based Multi-Language Analysis
  - **TypeScript/JavaScript**: TypeScript Compiler API
  - **Python**: Native Python AST module
  - **Go**: Go parser & AST
  - **PHP**: Regex-based analysis + PHP 8+ Features
  - Extracts classes, functions, interfaces, methods, properties
  - **PHP 8+**: Enums, Traits, Attributes
  - Captures JSDoc/Docstrings/Go Doc/PHPDoc and calculates documentation coverage
  - Analyzes imports/exports and module dependencies
- 🌍 **Multi-Language Projects** - Automatic detection and parallel analysis of multiple languages
- 📊 **Project Analysis** - Automatic code analysis for TypeScript, JavaScript, Python, Go, PHP
- 🏗️ **Structure Generation** - Creates complete documentation scaffolds
- ✍️ **Page Editor** - Creates and edits individual documentation pages
- 📖 **API Documentation** - Generates API docs from code comments
- 🌐 **Static Site Builder** - Builds static websites for hosting
- 📄 **PDF Export** - Converts documentation to PDF
- 👀 **Live Preview** - Local development server

## 🛠️ Supported Frameworks

- **Docusaurus** (React-based, modern, various templates)
- **MkDocs** (Python-based, Markdown-focused, simple)
- **Sphinx** (Python, very powerful, for complex projects)

## 🚀 Quick Start

1. Install globally:

   ```bash
   npm install -g documentation-mcp-server
   ```

2. Configure in Claude Desktop (see SETUP.md):

   ```json
   {
     "mcpServers": {
       "docs": {
         "command": "npx",
         "args": ["-y", "documentation-mcp-server"]
       }
     }
   }
   ```

3. Start using the documentation tools in Claude!

## 📦 Tools

### `docs_analyze_project`

Analyzes project structure and performs deep code analysis.

**Parameters:**

- `projectPath` (string, required) - Path to project
- `language` (enum, optional) - Programming language (typescript, javascript, python, go, rust, java, csharp)
- `deep` (boolean, optional, default: true) - Enables deep code analysis

**Deep Analysis Features:**

- 📦 Extracts Classes/Structs, Interfaces, Functions, Enums, Type Aliases
- 🔍 Captures Methods, Properties, Constructors with complete details
- 📝 Analyzes JSDoc/Docstrings/Go Doc and calculates documentation coverage
- 🔗 Tracks Imports/Exports and Module Dependencies
- 📊 Generates summary statistics
- 🎯 **Multi-Language Support:**
  - ✅ TypeScript/JavaScript (TypeScript Compiler API)
  - ✅ Python (Native Python AST)
  - ✅ Go (go/parser & go/ast)
  - ✅ PHP v2 (nikic/php-parser AST) - **New! 100% accurate**
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
  - 🌍 Automatic Multi-Language Detection
  - 🔜 Rust, Java, C# (planned)

**Example Response:**

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

Generates documentation scaffold.

**Parameters:**

- `projectPath` (string, required) - Path to project
- `framework` (enum, required) - docusaurus | mkdocs | sphinx
- `template` (string, optional) - Template name
- `outputPath` (string, optional) - Output path (default: ./docs)

### `docs_create_page`

Creates or edits documentation page.

**Parameters:**

- `docsPath` (string, required) - Path to docs
- `pagePath` (string, required) - Relative path to page
- `title` (string, required) - Page title
- `content` (string, required) - Markdown content

### `docs_generate_api`

Generates API documentation from code.

**Parameters:**

- `projectPath` (string, required) - Path to source code
- `outputPath` (string, required) - Output path
- `language` (enum, required) - Programming language

### `docs_build_static`

Builds static website.

**Parameters:**

- `docsPath` (string, required) - Path to docs
- `framework` (enum, required) - Framework
- `outputPath` (string, optional) - Output path (default: ./build)

### `docs_export_pdf`

Exports documentation as PDF.

**Parameters:**

- `docsPath` (string, required) - Path to docs
- `outputPath` (string, required) - PDF output path
- `includePages` (array, optional) - Specific pages

### `docs_preview`

Starts local dev server.

**Parameters:**

- `docsPath` (string, required) - Path to docs
- `framework` (enum, required) - Framework
- `port` (number, optional) - Port (default: 3000/8000)

### `docs_generate_openapi`

Generates OpenAPI 3.0 specification from PHP code.

**Parameters:**

- `projectPath` (string, required) - PHP project path
- `outputPath` (string, optional) - Output path (default: ./openapi.json)
- `format` (enum, optional) - json | yaml (default: json)
- `title` (string, optional) - API title
- `version` (string, optional) - API version
- `serverUrl` (string, optional) - API server URL

### `docs_generate_sales_docs` 🎯 **NEW!**

Generates professional, sales-ready documentation for CodeCanyon, ThemeForest, etc.

**Parameters:**

- `projectPath` (string, required) - PHP project path
- `outputDir` (string, optional) - Output directory (default: ./sales-docs)
- `productName` (string, required) - Product name
- `productVersion` (string, optional) - Version (default: 1.0.0)
- `author` (string, required) - Author/Company
- `description` (string, required) - Product description
- `price` (string, optional) - Price (e.g., "$49")
- `demoUrl` (string, optional) - Live demo URL
- `supportEmail` (string, optional) - Support email
- `features` (array, optional) - List of key features

**Generated Files:**

1. **README.md** (2.5 KB) - Product overview with features, statistics, requirements
2. **INSTALLATION.md** (3.2 KB) - Step-by-step setup guide
3. **API_REFERENCE.md** (24.2 KB) - Complete API documentation
4. **CONFIGURATION.md** (2.1 KB) - Environment variables, security
5. **EXAMPLES.md** (4.0 KB) - Code examples (JS, PHP, Python)
6. **FAQ.md** (2.2 KB) - Frequently asked questions
7. **CHANGELOG.md** (0.9 KB) - Version history
8. **COMPLETE_DOCUMENTATION.md** (39.0 KB) - All-in-one for PDF

**Total:** ~78 KB professional documentation!

## 🏗️ Architecture

```
src/
├── index.ts                    # MCP Server main file
├── core/                       # Core modules for deep analysis
│   ├── types.ts               # Type definitions for all languages
│   └── analyzer.ts            # Abstract base class & factory
├── analyzers/                  # Language-specific analyzers
│   ├── typescript.ts          # TypeScript/JavaScript (TS Compiler API)
│   ├── python.ts              # Python wrapper (subprocess)
│   ├── go.ts                  # Go wrapper (subprocess)
│   └── helpers/               # Native language parsers
│       ├── python_analyzer.py # Python AST parser
│       └── go_analyzer.go     # Go AST parser
└── tools/                      # MCP tool implementations
    ├── analyzeProject.ts      # Deep analysis integration
    ├── generateStructure.ts
    ├── createPage.ts
    ├── generateApi.ts
    ├── buildStatic.ts
    ├── exportPdf.ts
    └── preview.ts
```

### 🔬 Deep Analysis Pipeline

1. **File Scanning** - Scans project directory
2. **Language Detection** - Detects dominant programming language
3. **Analyzer Selection** - Selects appropriate AST parser (Factory Pattern)
4. **AST Parsing** - Parses code files with language-specific parser
   - TypeScript: TS Compiler API (in-process)
   - Python: Python AST module (subprocess)
   - Go: go/parser & go/ast (subprocess)
5. **Symbol Extraction** - Extracts all code symbols (Classes, Functions, etc.)
6. **Documentation Analysis** - Captures documentation comments
7. **Summary Generation** - Calculates statistics and coverage

## 📝 License

MIT
