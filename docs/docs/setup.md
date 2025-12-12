---
title: Installation & Setup
---

# Installation & Setup

# Installation & Setup

Diese Anleitung führt Sie durch die Installation und Konfiguration des Documentation MCP Servers.

## 📋 Voraussetzungen

Stellen Sie sicher, dass folgendes installiert ist:

- **Node.js** (v18 oder höher)
- **npm** oder **yarn**
- **Git** (optional, für Versionskontrolle)

## 🔧 Installation

### 1. Repository klonen oder herunterladen

```bash
git clone https://github.com/your-username/documentation-mcp-server.git
cd documentation-mcp-server
```

### 2. Dependencies installieren

```bash
npm install
```

Installiert alle benötigten Pakete:
- `@modelcontextprotocol/sdk` - MCP SDK für Server-Implementierung
- `zod` - Schema-Validierung

### 3. Projekt kompilieren

```bash
npm run build
```

Dies kompiliert den TypeScript-Code nach `dist/index.js`.

### 4. Server testen

```bash
npm start
```

Der Server sollte starten und folgende Nachricht ausgeben:
```
Documentation MCP Server running on stdio
```

## ⚙️ MCP Konfiguration

### Für Claude Desktop / VS Code

Fügen Sie den Server zu Ihrer MCP-Konfigurationsdatei hinzu:

**Speicherort:**
- Windows: `%APPDATA%\Code - Insiders\User\mcp.json`
- macOS: `~/Library/Application Support/Code/User/mcp.json`
- Linux: `~/.config/Code/User/mcp.json`

**Konfiguration:**

```json
{
  "servers": {
    "documentation-mcp": {
      "type": "stdio",
      "command": "node",
      "args": [
        "ABSOLUTER_PFAD_ZU/documentation_MCP/dist/index.js"
      ]
    }
  }
}
```

**Wichtig:** Ersetzen Sie `ABSOLUTER_PFAD_ZU` mit dem tatsächlichen Pfad zu Ihrem Projekt.

**Beispiel (Windows):**
```json
{
  "servers": {
    "documentation-mcp": {
      "type": "stdio",
      "command": "node",
      "args": [
        "E:\\Projects\\documentation_MCP\\dist\\index.js"
      ]
    }
  }
}
```

### Für andere MCP-Clients

Konfigurieren Sie den Server mit:
- **Typ:** stdio
- **Command:** `node`
- **Args:** `["/pfad/zu/documentation_MCP/dist/index.js"]`

## ✅ Installation verifizieren

1. **Starten Sie Ihren MCP-Client neu** (z.B. Claude Desktop oder VS Code)

2. **Überprüfen Sie verfügbare Tools:**
   - Fragen Sie den Client nach verfügbaren MCP-Tools
   - Sie sollten 7 Tools sehen, die mit `docs_` beginnen

3. **Testen Sie ein einfaches Tool:**
   ```typescript
   // Analysieren Sie ein Test-Projekt
   docs_analyze_project({
     projectPath: "./",
     language: "typescript"
   })
   ```

## 🔄 Updates

### Code aktualisieren

Wenn Sie Änderungen am Code vornehmen:

```bash
# TypeScript neu kompilieren
npm run build

# Für Entwicklung mit Auto-Rebuild
npm run dev
```

### Dependencies aktualisieren

```bash
npm update
```

## 🐛 Problembehandlung

### "Cannot find module" Fehler

**Lösung:** Stellen Sie sicher, dass Sie `npm run build` ausgeführt haben.

### Server startet nicht

**Lösung 1:** Überprüfen Sie Node.js Version:
```bash
node --version  # Sollte v18+ sein
```

**Lösung 2:** Löschen Sie node_modules und installieren Sie neu:
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Tools werden nicht erkannt

**Lösung:** 
1. Überprüfen Sie die MCP-Konfiguration (richtiger Pfad?)
2. Starten Sie den MCP-Client neu
3. Prüfen Sie die Logs auf Fehlermeldungen

### TypeScript-Kompilierungsfehler

**Lösung:** Aktualisieren Sie TypeScript:
```bash
npm install --save-dev typescript@latest
```

## 📦 Entwicklungsumgebung einrichten

### VS Code Extensions (empfohlen)

- **ESLint** - Code-Qualität
- **Prettier** - Code-Formatierung  
- **TypeScript** - Sprach-Support

### NPM Scripts

```json
{
  "build": "tsc",                    // Einmalige Kompilierung
  "dev": "tsc --watch",              // Watch-Mode für Entwicklung
  "start": "node dist/index.js",     // Server starten
  "prepare": "npm run build"         // Pre-install Hook
}
```

## 🚀 Nächste Schritte

- [Tools Übersicht](./tools/overview.md) - Lernen Sie alle verfügbaren Tools kennen
- [Erste Schritte](./guides/getting-started.md) - Erstellen Sie Ihre erste Dokumentation
- [Beispiele](./guides/examples.md) - Praktische Anwendungsbeispiele
