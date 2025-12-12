# 🚀 MCP Server Release Guide

Anleitung zur Veröffentlichung des Documentation MCP Servers.

## 📋 Vorbereitungen

### 1. Package.json überprüfen

```json
{
  "name": "@yourcompany/documentation-mcp-server",
  "version": "1.0.0",
  "description": "Professional documentation generator MCP server with multi-language support",
  "keywords": [
    "mcp",
    "mcp-server",
    "documentation",
    "openapi",
    "swagger",
    "php",
    "typescript",
    "python",
    "go",
    "codecanyon",
    "api-documentation"
  ],
  "repository": {
    "type": "git",
    "url": "https://github.com/yourcompany/documentation-mcp-server.git"
  },
  "bugs": {
    "url": "https://github.com/yourcompany/documentation-mcp-server/issues"
  },
  "homepage": "https://github.com/yourcompany/documentation-mcp-server#readme",
  "author": "Your Name <your.email@example.com>",
  "license": "MIT"
}
```

### 2. .npmignore erstellen

Erstelle `.npmignore` um unnötige Dateien auszuschließen:

```
# Tests
test-*.js
test-*.cjs
test-php-project/
test-mixed-project/
test-go-project/
test-python-project/
sales-docs-output/

# Development
*.log
.DS_Store
.vscode/
.idea/

# TypeScript
src/
tsconfig.json

# Documentation
docs/
RELEASE.md

# Build artifacts
*.tsbuildinfo
```

### 3. LICENSE.txt erstellen

```txt
MIT License

Copyright (c) 2025 Your Name

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## 📦 Release-Prozess

### Option 1: NPM Registry (Öffentlich)

#### Schritt 1: NPM Account erstellen

```bash
# NPM Account erstellen (falls noch nicht vorhanden)
# https://www.npmjs.com/signup

# NPM Login
npm login
```

#### Schritt 2: Package vorbereiten

```bash
# TypeScript kompilieren
npm run build

# Package testen
npm pack

# Zeigt was veröffentlicht wird
npm publish --dry-run
```

#### Schritt 3: Veröffentlichen

```bash
# Erste Veröffentlichung
npm publish --access public

# Für Scoped Packages (@yourcompany/...)
npm publish --access public
```

#### Schritt 4: Version Updates

```bash
# Patch Release (1.0.0 -> 1.0.1)
npm version patch
npm publish

# Minor Release (1.0.0 -> 1.1.0)
npm version minor
npm publish

# Major Release (1.0.0 -> 2.0.0)
npm version major
npm publish
```

### Option 2: GitHub Packages

#### Schritt 1: `.npmrc` erstellen

```
@yourcompany:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
```

#### Schritt 2: Veröffentlichen

```bash
# GitHub Token erstellen
# https://github.com/settings/tokens

# Veröffentlichen
npm publish
```

### Option 3: Private Registry

Für interne/kommerzielle Nutzung:

```bash
# Eigene Registry konfigurieren
npm config set registry https://your-registry.com

# Veröffentlichen
npm publish
```

## 🐙 GitHub Repository Setup

### 1. Repository erstellen

```bash
# Git initialisieren (falls noch nicht geschehen)
git init

# GitHub Repository erstellen
gh repo create documentation-mcp-server --public --source=. --remote=origin

# Oder manuell auf GitHub: https://github.com/new
```

### 2. Code pushen

```bash
# .gitignore überprüfen
# node_modules/
# dist/
# *.log
# test-php-project/
# sales-docs-output/

git add .
git commit -m "Initial release v1.0.0"
git tag v1.0.0
git push origin main
git push origin v1.0.0
```

### 3. GitHub Release erstellen

```bash
# Mit GitHub CLI
gh release create v1.0.0 --title "v1.0.0 - Initial Release" --notes "
## Features
- Multi-language code analysis (TypeScript, Python, Go, PHP)
- OpenAPI 3.0 generator
- Sales documentation generator
- 8 MCP tools for documentation generation
"

# Oder manuell: https://github.com/youruser/documentation-mcp-server/releases/new
```

## 📝 MCP Server Registry

### MCP Registry eintragen

Füge deinen Server zum offiziellen MCP Registry hinzu:

**GitHub:** https://github.com/modelcontextprotocol/servers

1. Repository forken
2. `servers.json` bearbeiten:

```json
{
  "name": "documentation-mcp-server",
  "description": "Professional documentation generator with multi-language support and OpenAPI generation",
  "repository": "https://github.com/yourcompany/documentation-mcp-server",
  "package": "@yourcompany/documentation-mcp-server",
  "license": "MIT",
  "tags": ["documentation", "openapi", "php", "typescript", "python", "go"]
}
```

3. Pull Request erstellen

## 📚 Documentation Website

### Option 1: GitHub Pages

```bash
# Docusaurus bereits vorhanden in docs/
cd docs
npm install
npm run build

# GitHub Pages deployen
GIT_USER=youruser npm run deploy
```

### Option 2: Read the Docs

1. Repository auf https://readthedocs.org/ verlinken
2. `.readthedocs.yml` erstellen:

```yaml
version: 2
build:
  os: ubuntu-22.04
  tools:
    nodejs: "18"
mkdocs:
  configuration: mkdocs.yml
```

## 🎯 Marketing & Promotion

### 1. README.md optimieren

- [ ] Badges hinzufügen (npm version, downloads, license)
- [ ] Screenshots/GIFs der Nutzung
- [ ] Quick Start Guide
- [ ] Feature-Liste mit Icons
- [ ] Links zu Documentation

### 2. Social Media

- Twitter/X: Ankündigung mit #MCP #AI #Documentation
- LinkedIn: Professional Post
- Reddit: r/LocalLLaMA, r/ClaudeAI
- Dev.to: Blog Post über Entwicklung

### 3. Communities

- **MCP Discord**: https://discord.gg/modelcontextprotocol
- **Anthropic Community**: Ankündigung posten
- **GitHub Discussions**: Aktivieren

### 4. Blog Post schreiben

Themen:

- "Building a Multi-Language Documentation MCP Server"
- "Automating API Documentation with MCP"
- "How to Create Sales-Ready Documentation"

## 🔄 Continuous Integration

### GitHub Actions erstellen

`.github/workflows/publish.yml`:

```yaml
name: Publish Package

on:
  release:
    types: [created]

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: "18"
          registry-url: "https://registry.npmjs.org"
      - run: npm ci
      - run: npm run build
      - run: npm test
      - run: npm publish --access public
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

## ✅ Release Checklist

Pre-Release:

- [ ] Alle Tests laufen durch
- [ ] TypeScript kompiliert ohne Fehler
- [ ] README.md ist aktuell
- [ ] CHANGELOG.md ist aktuell
- [ ] Version in package.json aktualisiert
- [ ] LICENSE.txt vorhanden
- [ ] .npmignore konfiguriert

Release:

- [ ] `npm run build` erfolgreich
- [ ] `npm pack` und Package überprüfen
- [ ] Git Tag erstellen
- [ ] NPM veröffentlichen
- [ ] GitHub Release erstellen
- [ ] Documentation deployen

Post-Release:

- [ ] MCP Registry eintragen
- [ ] Social Media Ankündigung
- [ ] Blog Post veröffentlichen
- [ ] GitHub Discussions aktivieren
- [ ] Issues-Template erstellen

## 📊 Monitoring

### Package-Statistiken verfolgen

- **NPM Downloads**: https://npmjs.com/package/@yourcompany/documentation-mcp-server
- **GitHub Stars**: Repository watchen
- **Issues**: Schnell auf Feedback reagieren

## 💰 Kommerzielle Optionen

### Dual Licensing

1. **Open Source (MIT)**: Basis-Features kostenlos
2. **Commercial License**: Premium-Features (z.B. erweiterte PHP-Frameworks, Enterprise-Support)

### Marketplace

- **CodeCanyon**: Verkaufe als Tool für Entwickler
- **Gumroad**: Direkt-Verkauf mit Dokumentation
- **GitHub Sponsors**: Community-Support

## 🎓 Support & Maintenance

### Community Support

- GitHub Issues für Bug Reports
- Discussions für Fragen
- Discord Channel (optional)

### Documentation

- API Reference
- Tutorials
- Video Guides
- Example Projects

## 🚀 Next Steps

Nach dem Release:

1. **Monitoring**: NPM downloads, GitHub stars verfolgen
2. **Feedback sammeln**: Issues, Discussions beobachten
3. **Updates planen**: Neue Features basierend auf Feedback
4. **Marketing fortsetzen**: Blog Posts, Tutorials, Videos
5. **Community aufbauen**: Discord, Discussions, Twitter

---

## 🔗 Wichtige Links

- **NPM Registry**: https://www.npmjs.com/
- **GitHub Packages**: https://github.com/features/packages
- **MCP Documentation**: https://modelcontextprotocol.io/
- **MCP Servers List**: https://github.com/modelcontextprotocol/servers

## 📞 Support

Bei Fragen zum Release-Prozess:

- MCP Discord: https://discord.gg/modelcontextprotocol
- GitHub Issues: https://github.com/yourcompany/documentation-mcp-server/issues
