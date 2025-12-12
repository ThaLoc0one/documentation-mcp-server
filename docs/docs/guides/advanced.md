---
title: Advanced Topics
---

# Advanced Topics

# Advanced Topics

Fortgeschrittene Themen und Techniken für professionelle Dokumentation.

## 🌍 Internationalisierung (i18n) {#i18n}

### Docusaurus i18n Setup

```javascript
// docusaurus.config.js
module.exports = {
  i18n: {
    defaultLocale: 'de',
    locales: ['de', 'en', 'fr'],
    localeConfigs: {
      de: {
        label: 'Deutsch',
        direction: 'ltr',
      },
      en: {
        label: 'English',
        direction: 'ltr',
      },
      fr: {
        label: 'Français',
        direction: 'ltr',
      },
    },
  },
};
```

### Verzeichnisstruktur

```
docs/
├── docs/              # Default (de)
├── i18n/
│   ├── en/
│   │   └── docusaurus-plugin-content-docs/
│   │       └── current/
│   │           ├── intro.md
│   │           └── guides/
│   └── fr/
│       └── docusaurus-plugin-content-docs/
```

### Übersetzungen verwalten

```bash
# Übersetzungsdateien extrahieren
npm run write-translations -- --locale en

# Mit spezifischer Sprache builden
npm run build -- --locale en

# Alle Sprachen
npm run build -- --locale de --locale en --locale fr
```

---

## 🎨 Custom Themes {#themes}

### Eigenes Theme erstellen

```javascript
// src/theme/Layout.js
import React from 'react';
import Layout from '@theme-original/Layout';
import './custom.css';

export default function CustomLayout(props) {
  return (
    <>
      <div className="custom-header">
        {/* Custom Header */}
      </div>
      <Layout {...props} />
    </>
  );
}
```

### CSS Customization

```css
/* src/css/custom.css */
:root {
  --ifm-color-primary: #2e8555;
  --ifm-code-font-size: 95%;
  --ifm-navbar-height: 4rem;
}

[data-theme='dark'] {
  --ifm-color-primary: #25c2a0;
}
```

### Komponenten überschreiben

```bash
# Komponente in src/theme/ kopieren
npm run swizzle @docusaurus/theme-classic ComponentName
```

---

## 📦 Plugins & Erweiterungen

### Custom Plugin erstellen

```javascript
// plugins/custom-plugin/index.js
module.exports = function (context, options) {
  return {
    name: 'custom-plugin',
    async loadContent() {
      // Lade externe Daten
      return fetchExternalData();
    },
    async contentLoaded({content, actions}) {
      const {createData, addRoute} = actions;
      // Erstelle Routen
      addRoute({
        path: '/custom-page',
        component: '@site/src/components/CustomPage',
        exact: true,
      });
    },
  };
};
```

### Plugin in Config einbinden

```javascript
// docusaurus.config.js
module.exports = {
  plugins: [
    './plugins/custom-plugin',
    [
      'plugin-name',
      {
        option1: 'value',
      },
    ],
  ],
};
```

### Nützliche Plugins

```bash
# Search
npm install --save @docusaurus/theme-search-algolia

# PWA
npm install --save @docusaurus/plugin-pwa

# Ideal Image
npm install --save @docusaurus/plugin-ideal-image

# Google Analytics
npm install --save @docusaurus/plugin-google-analytics
```

---

## 🔍 Advanced Search

### Algolia DocSearch

```javascript
// docusaurus.config.js
module.exports = {
  themeConfig: {
    algolia: {
      appId: 'YOUR_APP_ID',
      apiKey: 'YOUR_SEARCH_API_KEY',
      indexName: 'YOUR_INDEX_NAME',
      contextualSearch: true,
    },
  },
};
```

### Lokale Suche

```bash
npm install --save @easyops-cn/docusaurus-search-local
```

```javascript
module.exports = {
  themes: [
    [
      '@easyops-cn/docusaurus-search-local',
      {
        hashed: true,
        language: ['de', 'en'],
      },
    ],
  ],
};
```

---

## 📊 Analytics & Tracking

### Multiple Analytics

```javascript
module.exports = {
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        gtag: {
          trackingID: 'G-XXXXXXXXXX',
        },
        googleAnalytics: {
          trackingID: 'UA-XXXXXXXXX-X',
        },
      },
    ],
  ],
};
```

### Custom Analytics

```javascript
// src/theme/Root.js
import React, {useEffect} from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

export default function Root({children}) {
  const {siteConfig} = useDocusaurusContext();
  
  useEffect(() => {
    // Custom tracking code
    if (typeof window !== 'undefined') {
      window.customAnalytics?.track('pageview');
    }
  }, []);
  
  return <>{children}</>;
}
```

---

## 🚀 Performance-Optimierung

### Code Splitting

```javascript
// docusaurus.config.js
module.exports = {
  webpack: {
    jsLoader: (isServer) => ({
      loader: require.resolve('swc-loader'),
      options: {
        jsc: {
          parser: {
            syntax: 'typescript',
            tsx: true,
          },
          target: 'es2017',
        },
      },
    }),
  },
};
```

### Image Optimization

```javascript
// docusaurus.config.js
module.exports = {
  plugins: [
    [
      '@docusaurus/plugin-ideal-image',
      {
        quality: 70,
        max: 1030,
        min: 640,
        steps: 2,
        disableInDev: false,
      },
    ],
  ],
};
```

### Lazy Loading

```jsx
import React, {lazy, Suspense} from 'react';

const HeavyComponent = lazy(() => import('./HeavyComponent'));

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HeavyComponent />
    </Suspense>
  );
}
```

---

## 🔒 Security

### Content Security Policy

```javascript
// docusaurus.config.js
module.exports = {
  scripts: [
    {
      src: 'https://cdn.example.com/script.js',
      integrity: 'sha384-...',
      crossorigin: 'anonymous',
    },
  ],
};
```

### Environment Variables

```bash
# .env
DOCS_API_KEY=secret-key
PUBLIC_URL=https://docs.example.com
```

```javascript
// docusaurus.config.js
module.exports = {
  customFields: {
    apiKey: process.env.DOCS_API_KEY,
  },
};
```

---

## 🧪 Testing

### Visual Regression Tests

```bash
npm install --save-dev @playwright/test

# playwright.config.ts
```

```typescript
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  use: {
    baseURL: 'http://localhost:3000',
    screenshot: 'only-on-failure',
  },
});
```

### Link Checking

```bash
# Broken links checker
npm install --save-dev broken-link-checker

# In package.json
{
  "scripts": {
    "check-links": "blc http://localhost:3000 -ro"
  }
}
```

---

## 📱 PWA (Progressive Web App)

```javascript
// docusaurus.config.js
module.exports = {
  plugins: [
    [
      '@docusaurus/plugin-pwa',
      {
        debug: false,
        offlineModeActivationStrategies: [
          'appInstalled',
          'standalone',
          'queryString',
        ],
        pwaHead: [
          {
            tagName: 'link',
            rel: 'icon',
            href: '/img/icon.png',
          },
          {
            tagName: 'link',
            rel: 'manifest',
            href: '/manifest.json',
          },
          {
            tagName: 'meta',
            name: 'theme-color',
            content: '#2e8555',
          },
        ],
      },
    ],
  ],
};
```

---

## 🔄 Versioning

### Multi-Version Support

```bash
# Neue Version erstellen
npm run docusaurus docs:version 2.0.0
```

```javascript
// docusaurus.config.js
module.exports = {
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          lastVersion: 'current',
          versions: {
            current: {
              label: '2.1.0 (Next)',
              path: 'next',
            },
            '2.0.0': {
              label: '2.0.0',
              path: '2.0.0',
            },
          },
        },
      },
    ],
  ],
};
```

---

## 🎯 Advanced Tips

1. **Server-Side Rendering (SSR)** - Für SEO optimieren
2. **Static Site Generation (SSG)** - Schnellere Ladezeiten
3. **Edge Functions** - Dynamische Inhalte
4. **Micro-Frontends** - Modulare Architektur
5. **A/B Testing** - Verschiedene Versionen testen
6. **Feature Flags** - Graduelles Rollout
7. **GraphQL Integration** - Dynamische Daten
8. **Real-time Updates** - WebSockets für Live-Docs
