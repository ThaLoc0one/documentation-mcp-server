# Changelog

Alle wichtigen Änderungen am Documentation MCP Server werden hier dokumentiert.

## [Unreleased]

### Added - PHP AST-Analyzer v2 🎯 (2025-12-11)

#### 🐘 nikic/php-parser Integration

- **100% Genauigkeit** - AST-basiertes Parsing statt Regex
- **Namespace-Support** - Vollständige Namespace-Extraktion und -Tracking
- **Use-Statements** - Analyse aller Import-Statements
- **Advanced Type System**:
  - Union Types (`string|int`)
  - Intersection Types (`Countable&Traversable`)
  - Nullable Types (`?string`)
  - Mixed Types
- **Framework Detection** - Erkennung von PHP-Frameworks:
  - CodeIgniter 3 (CI_Controller, CI_Model)
  - CodeIgniter 4 (CodeIgniter\Controller, CodeIgniter\Model)
  - Laravel (Illuminate\*)
  - Symfony (Symfony\*)
  - MVC Pattern Detection (Namenskonventionen)
- **Route Detection** 🚀 - Automatische Controller-Route-Extraktion:
  - Convention-based Routing (`/controller/method/{param}`)
  - Attribute-based Routing (`#[Get('/')]`, `#[Post('/')]`)
  - HTTP-Methoden: GET, POST, PUT, PATCH, DELETE
  - Parameter-Typen und Required/Optional Status
  - Framework-spezifische Route-Patterns (CI3/CI4, Laravel, Symfony)
- **Middleware Detection** 🔒 - Automatische Middleware/Filter-Extraktion:
  - Laravel: `#[Middleware('auth')]`, `#[Middleware('throttle:60,1')]`
  - Symfony: `#[IsGranted('ROLE_ADMIN')]`
  - CodeIgniter 4: `#[Filter('auth')]`
  - CodeIgniter 3: `@middleware auth` (Docblock annotations)
  - Class-Level + Method-Level Middleware
  - Mixed Sources: Attributes + Docblocks
  - Middleware mit Parameters (z.B. `throttle:60,1`)
- **OpenAPI 3.0 Export** 📋 - Automatische API-Dokumentations-Generierung:
  - Konvertierung von Routes → OpenAPI Paths
  - HTTP Methods (GET, POST, PUT, PATCH, DELETE)
  - Parameter-Mapping (PHP Types → OpenAPI Types)
  - Security Schemes aus Middleware (Bearer, API Key, OAuth2)
  - JSON + YAML Export
  - Server-URL Konfiguration
  - Auto-Generated Operation IDs + Tags
- **Composer Integration** - composer.json für Dependency Management
- **Rückwärtskompatibel** - Fallback zu Regex-Analyzer bei Bedarf
- **Bessere Nested Code Unterstützung** - Match-Expressions, Closures in Enums, etc.

### Added - PHP 8+ Features ✨ (2025-12-11)

#### 🐘 Enhanced PHP Analyzer

- **PHP 8.1+ Enums** - Vollständige Enum-Unterstützung:
  - Backed Enums (string/int)
  - Pure Enums
  - Enum Cases mit Dokumentation
  - Enum Methods
- **Traits** - Extraktion und Analyse:
  - Properties in Traits
  - Methods in Traits
  - Trait-Dokumentation
- **PHP 8.0+ Attributes** - Attribute-Erkennung:
  - Class Attributes
  - Method Attributes
  - Property Attributes
  - Attribute Arguments
- **Verbesserte Coverage** - Korrekte Zählung aller Symbol-Typen:
  - Classes, Properties, Methods, Constructors
  - Functions, Interfaces
  - Enums, Enum Cases
  - Traits, Trait Methods

### Added - Multi-Language Support 🌍 (2025-12-11)

#### 🚀 Simultane Multi-Sprachen-Analyse

- **Automatische Erkennung** - Alle Sprachen im Projekt werden erkannt
- **Parallele Analyse** - Mehrere Analyzer laufen gleichzeitig
- **Multi-Language Output** - `multiLanguageAnalysis` Feld mit Ergebnissen pro Sprache
- **Unterstützte Kombinationen**:
  - TypeScript + Python + PHP
  - JavaScript + Go
  - Beliebige Sprach-Kombinationen

### Added - Phase 3 ✅ (2025-12-11)

#### 🚀 Go Analyzer Implementation

- **Go Parser & AST Integration** - Native Go tooling via subprocess
- **Symbol Extraction** - Vollständige Erfassung von:
  - Structs (mit Fields und Methods)
  - Interfaces (mit Methods)
  - Functions (mit Parameters und Return Types)
  - Methods (mit Receiver Types)
  - Imports
- **Documentation Coverage** - Go Doc-Kommentar-Extraktion
- **Type System** - Vollständiges Go Type System Support:
  - Pointers, Arrays, Slices, Maps
  - Channels, Interfaces
  - Function Types
  - Struct Tags

#### 🔧 Technical Implementation

- **go/parser & go/ast** - Native Go AST-Parsing
- **Helper Script** - Go-basiertes Analyzer-Tool (go_analyzer.go)
- **TypeScript Wrapper** - Subprocess Integration via child_process
- **Modular Integration** - Factory Pattern für nahtlose Einbindung

### Added - Phase 2 ✅ (2025-12-11)

#### 🐍 Python Analyzer Implementation

- **Python AST Module Integration** - Native Python-Parsing via subprocess
- **Symbol Extraction** - Automatische Erfassung von:
  - Classes (mit Methods, Properties, Constructors)
  - Functions (mit Parameters, Return Types)
  - Async Functions
  - Decorators (@dataclass, @staticmethod, @property)
  - Type Hints (Optional, List, Dict, etc.)
  - Docstrings
- **Documentation Coverage** - Berechnung basierend auf Docstrings
- **Test Results** - 100% Coverage auf Test-Projekt

#### 🔧 Technical Implementation

- **Python AST Module** - Natives AST-Parsing
- **Helper Script** - Python-basiertes Analyzer-Tool (python_analyzer.py)
- **TypeScript Wrapper** - Subprocess Integration
- **Base Classes** - dataclass Support

### Added - Phase 1 ✅ (2025-12-11)

#### 🚀 Deep Code Analysis für TypeScript/JavaScript

- **TypeScript Compiler API Integration** - AST-basierte Code-Analyse
- **Symbol Extraction** - Automatische Erfassung von:
  - Classes (mit Methods, Properties, Constructors)
  - Interfaces (mit Properties, Methods, Extends)
  - Functions (mit Parameters, Return Types, Async)
  - Enums und Type Aliases
  - Imports/Exports
- **Documentation Coverage** - Berechnung der Dokumentations-Abdeckung
  - JSDoc-Kommentar-Extraktion
  - Prozentuale Coverage-Metriken
  - File-level und Project-level Statistiken
- **Modulare Architektur** - Vorbereitung für Multi-Language Support
  - Abstract Base Class `CodeAnalyzer`
  - Factory Pattern für Analyzer-Auswahl
  - Gemeinsame Type-Definitionen in `src/core/types.ts`

#### 📊 Analysis Summary Features

- Total Files, Classes, Interfaces, Functions, Enums, Type Aliases
- Overall Documentation Coverage
- Per-File detailed analysis with location tracking

#### 🔧 Technical Implementation

- **TypeScript Compiler API** - Natives AST-Parsing
- **Location Tracking** - Start/End Lines & Columns für alle Symbole
- **Visibility Detection** - Public/Private/Protected für Methods & Properties
- **Modifier Detection** - Static, Async, Abstract, Readonly, Optional

### Test Results

```
Language: typescript
Files: 11
Total Classes: 2
Total Interfaces: 23
Total Functions: 16
Documentation Coverage: 3.17%
```

### 🗺️ Roadmap

#### Phase 4 (geplant): Weitere Sprachen

- [ ] Rust Analyzer (using Tree-sitter or external parser)
- [ ] Java Analyzer (JavaParser via GraalVM)
- [ ] C# Analyzer (Roslyn via external process)

#### Future Enhancements

- [ ] Enhanced Documentation Generation from Deep Analysis
- [ ] Automatic API Reference Generation
- [ ] Code Quality Metrics
- [ ] Dependency Graph Visualization
- [ ] Multi-Project Analysis

## [1.0.0] - 2025-12-10

### Added

- Initial MCP Server Implementation
- 7 Documentation Tools
- Docusaurus Support
- Basic Project Analysis (file-based)
- Structure Generation
- Page Creation
- Static Build
- PDF Export
- Live Preview

---

Format basierend auf [Keep a Changelog](https://keepachangelog.com/de/1.0.0/).
