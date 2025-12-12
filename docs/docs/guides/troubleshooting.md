---
title: Troubleshooting
---

# Troubleshooting

# Troubleshooting

Häufige Probleme und ihre Lösungen beim Arbeiten mit dem Documentation MCP Server.

## 🔧 Installation & Setup

### "Cannot find module" Fehler

**Problem:** Server startet nicht mit Modul-Fehler.

**Lösung:**
```bash
# Build ausführen
npm run build

# Dependencies neu installieren
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Node.js Version zu alt

**Problem:** Fehler beim Start oder Build.

**Lösung:**
```bash
# Version prüfen (sollte v18+ sein)
node --version

# Node.js aktualisieren falls nötig
```

### MCP Server wird nicht erkannt

**Problem:** Tools erscheinen nicht im Client.

**Lösung:**
1. Überprüfen Sie die MCP-Konfiguration (`mcp.json`)
2. Pfad zum `dist/index.js` muss absolut sein
3. MCP-Client neu starten
4. Logs prüfen

## 📝 Dokumentations-Generierung

### Framework-Installation schlägt fehl

**Problem:** `docs_generate_structure` gibt Fehler.

**Lösung:**
```bash
# Manuell installieren (Docusaurus Beispiel)
cd projekt-pfad
npx create-docusaurus@latest docs classic --typescript
```

### API-Docs werden nicht generiert

**Problem:** `docs_generate_api` funktioniert nicht.

**Lösung:**
```bash
# TypeDoc manuell installieren
npm install --save-dev typedoc

# API-Docs generieren
npx typedoc --out ./docs/api ./src
```

### Markdown-Links nicht auflösbar

**Problem:** Docusaurus-Warnungen über unauflösbare Links.

**Lösung:**
- Stellen Sie sicher, dass alle verlinkten Dateien existieren
- Verwenden Sie relative Pfade ohne `.md` in Docusaurus
- Prüfen Sie Groß-/Kleinschreibung

## 🌐 Preview & Build

### Preview-Server startet nicht

**Problem:** `docs_preview` gibt Port-Fehler.

**Lösung:**
```bash
# Port bereits belegt - anderen verwenden
docs_preview({
  docsPath: "./docs",
  framework: "docusaurus",
  port: 3001  // Alternativer Port
});

# Oder bestehenden Prozess beenden
# Windows: taskkill /F /IM node.exe
# Linux/Mac: killall node
```

### Build-Fehler

**Problem:** `docs_build_static` schlägt fehl.

**Lösung:**
1. Prüfen Sie auf Syntax-Fehler in Markdown-Dateien
2. Validieren Sie die `docusaurus.config.js`
3. Löschen Sie `.docusaurus` Cache:
```bash
cd docs
rm -rf .docusaurus
npm run build
```

### Bilder werden nicht angezeigt

**Problem:** Bilder fehlen nach Build.

**Lösung:**
- Bilder im `static/` Verzeichnis ablegen (Docusaurus)
- Relative Pfade verwenden: `![Alt](./images/bild.png)`
- Sicherstellen, dass Dateien committet sind

## 📄 PDF-Export

### PDF ist leer oder unvollständig

**Problem:** `docs_export_pdf` erstellt leeres PDF.

**Lösung:**
1. Stellen Sie sicher, dass die Dokumentation gebaut wurde
2. Überprüfen Sie `includePages` Parameter
3. Puppeteer/Playwright manuell installieren:
```bash
npm install --save-dev puppeteer
```

### Styling fehlt im PDF

**Problem:** PDF hat kein oder falsches Styling.

**Lösung:**
- PDF aus gebauter Website generieren (nicht aus Quell-Markdown)
- CSS-Print-Media-Queries in Custom-CSS hinzufügen

## 🐛 Allgemeine Fehler

### "ENOENT: no such file or directory"

**Problem:** Dateipfad existiert nicht.

**Lösung:**
- Verwenden Sie absolute Pfade
- Prüfen Sie Schreibweise (Windows: `\\` oder `/`)
- Erstellen Sie fehlende Verzeichnisse

### Speicher-Fehler bei großen Projekten

**Problem:** "JavaScript heap out of memory"

**Lösung:**
```bash
# Node.js Speicher erhöhen
set NODE_OPTIONS=--max-old-space-size=4096

# Oder in package.json scripts:
"build": "NODE_OPTIONS=--max-old-space-size=4096 npm run build"
```

### Berechtigungs-Fehler

**Problem:** "Permission denied"

**Lösung:**
```bash
# Windows: Als Administrator ausführen
# Linux/Mac: Berechtigungen prüfen
chmod +x script.sh

# Oder mit sudo (vorsichtig!)
sudo npm install
```

## 💡 Best Practices

### Projekt sauber halten

```bash
# Regelmäßig aufräumen
rm -rf node_modules .docusaurus build
npm install
npm run build
```

### Logs aktivieren

Für detaillierte Fehlerinformationen:
```bash
# Debug-Modus
DEBUG=* npm start

# Oder Node.js verbose
node --trace-warnings dist/index.js
```

### Versions-Kompatibilität

- Node.js: v18+
- npm: v9+
- TypeScript: v5+
- Docusaurus: v3+

## 📞 Weitere Hilfe

Wenn das Problem weiterhin besteht:

1. **GitHub Issues** - Melden Sie Bugs
2. **Logs sammeln** - Fügen Sie vollständige Fehlermeldungen bei
3. **Umgebung beschreiben** - OS, Node-Version, verwendete Tools
4. **Minimal reproduzierbares Beispiel** - Hilft bei der Diagnose

## 🔍 Debugging-Tipps

### Schritt-für-Schritt Isolation

```typescript
// 1. Einfachster Test
await docs_analyze_project({ projectPath: "./" });

// 2. Struktur testen
await docs_generate_structure({
  projectPath: "./",
  framework: "docusaurus"
});

// 3. Einzelne Seite testen
await docs_create_page({
  docsPath: "./docs",
  pagePath: "docs/test.md",
  title: "Test",
  content: "# Test"
});

// 4. Preview testen
await docs_preview({
  docsPath: "./docs",
  framework: "docusaurus"
});
```

### Logs überprüfen

```bash
# Terminal-Output sorgfältig lesen
# Suchen nach:
# - [ERROR]
# - [WARNING]
# - Stack traces
# - Pfad-Problemen
```
