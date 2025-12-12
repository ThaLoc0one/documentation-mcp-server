---
title: Deployment
---

# Deployment

# Deployment

Anleitung zum Deployen Ihrer Dokumentation auf verschiedenen Hosting-Plattformen.

## 🚀 Deployment-Optionen

### GitHub Pages

**Kostenlos, einfach, perfekt für Open-Source-Projekte**

#### Voraussetzungen
- GitHub Repository
- Dokumentation gebaut

#### Setup

```bash
# 1. Build erstellen
cd docs
npm run build

# 2. Repository konfigurieren
# Settings → Pages → Source: gh-pages branch
```

#### Mit GitHub Actions (empfohlen)

```yaml
# .github/workflows/deploy-docs.yml
name: Deploy Documentation

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: 18
          
      - name: Install dependencies
        run: |
          cd docs
          npm ci
          
      - name: Build docs
        run: |
          cd docs
          npm run build
          
      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./docs/build
```

#### Manuell mit deploy script

```bash
# docs/package.json
{
  "scripts": {
    "deploy": "GIT_USER=<username> USE_SSH=true yarn deploy"
  }
}

# Ausführen
cd docs
npm run deploy
```

**URL:** `https://<username>.github.io/<repo-name>/`

---

### Netlify

**Automatisches Deployment, CDN, Preview-Deployments**

#### Via GitHub Integration

1. **Netlify Account erstellen**
2. **"New site from Git"** wählen
3. **Repository verbinden**
4. **Build-Einstellungen:**
   - Build command: `cd docs && npm run build`
   - Publish directory: `docs/build`
   - Node version: `18`

#### Mit netlify.toml

```toml
# netlify.toml
[build]
  base = "docs/"
  command = "npm run build"
  publish = "build/"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

#### Deploy Previews

- Automatisch bei Pull Requests
- Jeder Branch bekommt Preview-URL
- Perfekt für Reviews

**URL:** `https://<site-name>.netlify.app/`

---

### Vercel

**Optimiert für Next.js, aber funktioniert mit Docusaurus**

#### Setup

1. **Vercel CLI installieren**
   ```bash
   npm i -g vercel
   ```

2. **Projekt initialisieren**
   ```bash
   cd docs
   vercel
   ```

3. **Konfiguration**
   ```json
   {
     "buildCommand": "npm run build",
     "outputDirectory": "build",
     "installCommand": "npm install"
   }
   ```

#### Via GitHub

1. Vercel Account mit GitHub verbinden
2. Repository importieren
3. Framework: "Other"
4. Build Settings anpassen

**URL:** `https://<project-name>.vercel.app/`

---

### AWS S3 + CloudFront

**Skalierbar, professionell, volle Kontrolle**

#### S3 Bucket erstellen

```bash
# AWS CLI
aws s3 mb s3://my-docs-bucket
aws s3 website s3://my-docs-bucket --index-document index.html
```

#### Build hochladen

```bash
cd docs
npm run build

# Upload
aws s3 sync build/ s3://my-docs-bucket --delete
```

#### CloudFront Distribution

1. **CloudFront Distribution erstellen**
2. **Origin:** S3 Bucket
3. **Default Root Object:** `index.html`
4. **SSL-Zertifikat:** Über ACM

#### Automatisierung mit GitHub Actions

```yaml
name: Deploy to AWS
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Build
        run: |
          cd docs
          npm ci
          npm run build
          
      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v2
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: us-east-1
          
      - name: Deploy to S3
        run: |
          aws s3 sync docs/build/ s3://my-docs-bucket --delete
          
      - name: Invalidate CloudFront
        run: |
          aws cloudfront create-invalidation \
            --distribution-id ${{ secrets.CLOUDFRONT_ID }} \
            --paths "/*"
```

---

### Azure Static Web Apps

**Integration mit Azure DevOps**

```yaml
# .github/workflows/azure-static-web-apps.yml
name: Azure Static Web Apps CI/CD

on:
  push:
    branches: [main]

jobs:
  build_and_deploy_job:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Build And Deploy
        uses: Azure/static-web-apps-deploy@v1
        with:
          azure_static_web_apps_api_token: ${{ secrets.AZURE_STATIC_WEB_APPS_API_TOKEN }}
          repo_token: ${{ secrets.GITHUB_TOKEN }}
          action: "upload"
          app_location: "docs"
          api_location: ""
          output_location: "build"
```

---

### Docker + Nginx

**Selbst-gehostet, volle Kontrolle**

#### Dockerfile

```dockerfile
# Dockerfile
FROM node:18 AS builder

WORKDIR /app
COPY docs/package*.json ./
RUN npm ci
COPY docs/ ./
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

#### nginx.conf

```nginx
server {
    listen 80;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml;
}
```

#### Build & Run

```bash
# Build Image
docker build -t my-docs .

# Run Container
docker run -d -p 80:80 my-docs

# Mit docker-compose
docker-compose up -d
```

---

## 🔧 Deployment-Konfiguration

### Custom Domain

#### GitHub Pages

```
# CNAME file im build/ Verzeichnis
docs.example.com
```

#### Netlify

```toml
# netlify.toml
[[redirects]]
  from = "https://old-domain.com/*"
  to = "https://new-domain.com/:splat"
  status = 301
```

### SSL/HTTPS

- **GitHub Pages:** Automatisch via Let's Encrypt
- **Netlify:** Automatisch
- **Vercel:** Automatisch
- **Eigene Domain:** Certbot oder Cloud-Provider

### Umgebungsvariablen

```javascript
// docusaurus.config.js
module.exports = {
  url: process.env.DOCS_URL || 'https://docs.example.com',
  baseUrl: process.env.BASE_URL || '/',
};
```

## 📊 Post-Deployment

### Monitoring

```javascript
// Google Analytics
module.exports = {
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        gtag: {
          trackingID: 'G-XXXXXXXXXX',
        },
      },
    ],
  ],
};
```

### Performance-Tests

```bash
# Lighthouse CI
npm install -g @lhci/cli

lhci autorun --collect.url=https://your-docs-url
```

### Uptime Monitoring

- UptimeRobot
- Pingdom
- StatusCake

## 🔄 CI/CD Best Practices

### Branch Protection

- Main branch schützen
- Require reviews
- Status checks

### Preview Deployments

```yaml
# Preview für Pull Requests
on:
  pull_request:
    branches: [main]
```

### Rollback-Strategie

```bash
# Git-basiert
git revert HEAD
git push origin main

# Vercel
vercel rollback

# Netlify
netlify deploy --prod --alias previous-version
```

## 💡 Deployment-Tipps

1. **Testen vor Deployment** - Lokaler Build
2. **Atomic Deployments** - Alles oder nichts
3. **Cache-Invalidierung** - Nach Deployment
4. **Monitoring einrichten** - Von Anfang an
5. **Backup-Strategie** - Regelmäßig
6. **Performance-Budget** - Definieren und überwachen
7. **Security Headers** - HTTPS, CSP, etc.

## 🎯 Welche Plattform wählen?

| Plattform | Best für | Kosten | Schwierigkeit |
|-----------|----------|--------|---------------|
| **GitHub Pages** | Open Source | Kostenlos | ⭐ Einfach |
| **Netlify** | Schnelles Setup | Kostenlos (Hobby) | ⭐ Einfach |
| **Vercel** | Modern Stack | Kostenlos (Hobby) | ⭐ Einfach |
| **AWS S3** | Enterprise | Pay-as-you-go | ⭐⭐ Mittel |
| **Azure** | Microsoft-Umgebung | Pay-as-you-go | ⭐⭐ Mittel |
| **Docker** | Selbst-gehostet | Server-Kosten | ⭐⭐⭐ Komplex |
