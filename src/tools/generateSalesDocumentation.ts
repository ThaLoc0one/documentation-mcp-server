/**
 * Sales Documentation Generator
 * 
 * Generates professional, sales-ready documentation for CodeCanyon, ThemeForest, etc.
 * Creates comprehensive Markdown documentation with:
 * - Professional README
 * - Installation Guide
 * - API Reference (from OpenAPI)
 * - Configuration Guide
 * - Code Examples
 * - FAQ & Troubleshooting
 * - Changelog
 * 
 * Perfect for selling scripts, themes, plugins on marketplaces.
 */

import { FileAnalysis, RouteInfo, MiddlewareInfo } from '../core/types.js';

export interface SalesDocOptions {
  productName: string;
  productVersion: string;
  author: string;
  description: string;
  price?: string;
  demoUrl?: string;
  supportEmail?: string;
  features?: string[];
  requirements?: {
    php?: string;
    framework?: string;
    database?: string;
    extensions?: string[];
  };
}

export interface OpenAPISpec {
  openapi: string;
  info: {
    title: string;
    version: string;
    description?: string;
  };
  paths: Record<string, any>;
  components?: {
    securitySchemes?: Record<string, any>;
  };
  servers?: Array<{ url: string; description?: string }>;
}

/**
 * Generate complete sales documentation package
 */
export function generateSalesDocumentation(
  files: FileAnalysis[],
  openApiSpec: OpenAPISpec,
  options: SalesDocOptions
): {
  readme: string;
  installation: string;
  apiReference: string;
  configuration: string;
  examples: string;
  faq: string;
  changelog: string;
} {
  return {
    readme: generateReadme(files, openApiSpec, options),
    installation: generateInstallationGuide(files, options),
    apiReference: generateApiReference(openApiSpec, options),
    configuration: generateConfigurationGuide(files, options),
    examples: generateExamples(files, openApiSpec, options),
    faq: generateFAQ(options),
    changelog: generateChangelog(options)
  };
}

/**
 * Generate professional README.md for sales platforms
 */
function generateReadme(
  files: FileAnalysis[],
  openApiSpec: OpenAPISpec,
  options: SalesDocOptions
): string {
  const pathCount = Object.keys(openApiSpec.paths || {}).length;
  const securitySchemes = Object.keys(openApiSpec.components?.securitySchemes || {}).length;
  const frameworks = [...new Set(files.map(f => f.frameworkInfo?.name).filter(Boolean))];
  
  let markdown = `# ${options.productName}\n\n`;
  markdown += `**Version:** ${options.productVersion}\n`;
  markdown += `**Author:** ${options.author}\n`;
  if (options.price) markdown += `**Price:** ${options.price}\n`;
  if (options.demoUrl) markdown += `**Demo:** [View Live Demo](${options.demoUrl})\n`;
  markdown += `\n---\n\n`;
  
  markdown += `## 📋 Overview\n\n`;
  markdown += `${options.description}\n\n`;
  
  if (options.features && options.features.length > 0) {
    markdown += `## ✨ Key Features\n\n`;
    options.features.forEach(feature => {
      markdown += `- ✅ ${feature}\n`;
    });
    markdown += `\n`;
  }
  
  markdown += `## 🚀 Quick Stats\n\n`;
  markdown += `| Metric | Value |\n`;
  markdown += `|--------|-------|\n`;
  markdown += `| API Endpoints | ${pathCount} |\n`;
  markdown += `| Security Schemes | ${securitySchemes} |\n`;
  markdown += `| Frameworks Supported | ${frameworks.join(', ') || 'Generic PHP'} |\n`;
  markdown += `| PHP Classes | ${files.length} |\n`;
  markdown += `\n`;
  
  if (options.requirements) {
    markdown += `## 📦 Requirements\n\n`;
    if (options.requirements.php) {
      markdown += `- **PHP Version:** ${options.requirements.php} or higher\n`;
    }
    if (options.requirements.framework) {
      markdown += `- **Framework:** ${options.requirements.framework}\n`;
    }
    if (options.requirements.database) {
      markdown += `- **Database:** ${options.requirements.database}\n`;
    }
    if (options.requirements.extensions && options.requirements.extensions.length > 0) {
      markdown += `- **PHP Extensions:**\n`;
      options.requirements.extensions.forEach(ext => {
        markdown += `  - ${ext}\n`;
      });
    }
    markdown += `\n`;
  }
  
  markdown += `## 📚 Documentation Structure\n\n`;
  markdown += `1. **[Installation Guide](INSTALLATION.md)** - Step-by-step setup instructions\n`;
  markdown += `2. **[API Reference](API_REFERENCE.md)** - Complete API endpoint documentation\n`;
  markdown += `3. **[Configuration Guide](CONFIGURATION.md)** - Configuration options and settings\n`;
  markdown += `4. **[Examples](EXAMPLES.md)** - Code examples and use cases\n`;
  markdown += `5. **[FAQ](FAQ.md)** - Frequently asked questions\n`;
  markdown += `6. **[Changelog](CHANGELOG.md)** - Version history and updates\n`;
  markdown += `\n`;
  
  markdown += `## 🎯 Quick Start\n\n`;
  markdown += `\`\`\`bash\n`;
  markdown += `# 1. Extract files\n`;
  markdown += `unzip ${options.productName.toLowerCase().replace(/\s+/g, '-')}.zip\n\n`;
  markdown += `# 2. Install dependencies (if using Composer)\n`;
  markdown += `composer install\n\n`;
  markdown += `# 3. Configure your environment\n`;
  markdown += `cp .env.example .env\n`;
  markdown += `# Edit .env with your settings\n\n`;
  markdown += `# 4. Run migrations (if applicable)\n`;
  markdown += `php spark migrate  # CodeIgniter 4\n`;
  markdown += `# or\n`;
  markdown += `php artisan migrate  # Laravel\n`;
  markdown += `\`\`\`\n\n`;
  
  if (options.supportEmail) {
    markdown += `## 💬 Support\n\n`;
    markdown += `Need help? We're here for you!\n\n`;
    markdown += `- **Email:** ${options.supportEmail}\n`;
    markdown += `- **Response Time:** Within 24 hours\n`;
    markdown += `- **Support Includes:** Installation help, bug fixes, feature questions\n\n`;
  }
  
  markdown += `## 📄 License\n\n`;
  markdown += `This product is licensed for single-site use. See LICENSE.txt for full details.\n\n`;
  
  markdown += `## ⭐ Rate Us\n\n`;
  markdown += `If you enjoy using ${options.productName}, please consider leaving a 5-star review!\n\n`;
  
  markdown += `---\n\n`;
  markdown += `© ${new Date().getFullYear()} ${options.author}. All rights reserved.\n`;
  
  return markdown;
}

/**
 * Generate Installation Guide
 */
function generateInstallationGuide(
  files: FileAnalysis[],
  options: SalesDocOptions
): string {
  const frameworks = [...new Set(files.map(f => f.frameworkInfo?.name).filter(Boolean))];
  const framework = frameworks[0] || 'Generic PHP';
  
  let markdown = `# Installation Guide\n\n`;
  markdown += `Complete installation instructions for **${options.productName}**.\n\n`;
  
  markdown += `## 📋 Prerequisites\n\n`;
  markdown += `Before installing, ensure you have:\n\n`;
  
  if (options.requirements) {
    if (options.requirements.php) {
      markdown += `- ✅ PHP ${options.requirements.php} or higher\n`;
    }
    if (options.requirements.database) {
      markdown += `- ✅ ${options.requirements.database}\n`;
    }
    if (options.requirements.framework) {
      markdown += `- ✅ ${options.requirements.framework}\n`;
    }
    markdown += `- ✅ Web server (Apache/Nginx)\n`;
    markdown += `- ✅ Composer (for dependency management)\n`;
    markdown += `\n`;
  }
  
  markdown += `## 🚀 Installation Steps\n\n`;
  
  markdown += `### Step 1: Extract Files\n\n`;
  markdown += `Extract the downloaded ZIP file to your web server directory:\n\n`;
  markdown += `\`\`\`bash\n`;
  markdown += `unzip ${options.productName.toLowerCase().replace(/\s+/g, '-')}.zip -d /var/www/html/\n`;
  markdown += `cd /var/www/html/${options.productName.toLowerCase().replace(/\s+/g, '-')}\n`;
  markdown += `\`\`\`\n\n`;
  
  markdown += `### Step 2: Install Dependencies\n\n`;
  markdown += `Install required PHP packages using Composer:\n\n`;
  markdown += `\`\`\`bash\n`;
  markdown += `composer install --no-dev\n`;
  markdown += `\`\`\`\n\n`;
  
  markdown += `### Step 3: Configure Environment\n\n`;
  markdown += `Copy the example environment file and configure your settings:\n\n`;
  markdown += `\`\`\`bash\n`;
  markdown += `cp .env.example .env\n`;
  markdown += `\`\`\`\n\n`;
  markdown += `Edit \`.env\` with your configuration:\n\n`;
  markdown += `\`\`\`ini\n`;
  
  if (framework.includes('CodeIgniter')) {
    markdown += `# Database Configuration\n`;
    markdown += `database.default.hostname = localhost\n`;
    markdown += `database.default.database = your_database\n`;
    markdown += `database.default.username = your_username\n`;
    markdown += `database.default.password = your_password\n`;
    markdown += `database.default.DBDriver = MySQLi\n\n`;
    markdown += `# Base URL\n`;
    markdown += `app.baseURL = 'http://yourdomain.com/'\n`;
  } else if (framework.includes('Laravel')) {
    markdown += `APP_NAME="${options.productName}"\n`;
    markdown += `APP_ENV=production\n`;
    markdown += `APP_KEY=  # Generate with: php artisan key:generate\n`;
    markdown += `APP_URL=http://yourdomain.com\n\n`;
    markdown += `DB_CONNECTION=mysql\n`;
    markdown += `DB_HOST=127.0.0.1\n`;
    markdown += `DB_PORT=3306\n`;
    markdown += `DB_DATABASE=your_database\n`;
    markdown += `DB_USERNAME=your_username\n`;
    markdown += `DB_PASSWORD=your_password\n`;
  } else {
    markdown += `DB_HOST=localhost\n`;
    markdown += `DB_NAME=your_database\n`;
    markdown += `DB_USER=your_username\n`;
    markdown += `DB_PASS=your_password\n`;
  }
  markdown += `\`\`\`\n\n`;
  
  markdown += `### Step 4: Database Setup\n\n`;
  markdown += `Create your database and run migrations:\n\n`;
  markdown += `\`\`\`bash\n`;
  markdown += `# Create database\n`;
  markdown += `mysql -u root -p -e "CREATE DATABASE your_database CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"\n\n`;
  
  if (framework.includes('CodeIgniter')) {
    markdown += `# Run migrations\n`;
    markdown += `php spark migrate\n\n`;
    markdown += `# Seed data (optional)\n`;
    markdown += `php spark db:seed DatabaseSeeder\n`;
  } else if (framework.includes('Laravel')) {
    markdown += `# Generate application key\n`;
    markdown += `php artisan key:generate\n\n`;
    markdown += `# Run migrations\n`;
    markdown += `php artisan migrate\n\n`;
    markdown += `# Seed data (optional)\n`;
    markdown += `php artisan db:seed\n`;
  } else {
    markdown += `# Import SQL file\n`;
    markdown += `mysql -u your_username -p your_database < database.sql\n`;
  }
  markdown += `\`\`\`\n\n`;
  
  markdown += `### Step 5: Set Permissions\n\n`;
  markdown += `Set appropriate file permissions:\n\n`;
  markdown += `\`\`\`bash\n`;
  markdown += `# Make writable directories\n`;
  if (framework.includes('CodeIgniter')) {
    markdown += `chmod -R 777 writable/\n`;
  } else if (framework.includes('Laravel')) {
    markdown += `chmod -R 775 storage/ bootstrap/cache/\n`;
    markdown += `chown -R www-data:www-data storage/ bootstrap/cache/\n`;
  } else {
    markdown += `chmod -R 777 uploads/ cache/\n`;
  }
  markdown += `\`\`\`\n\n`;
  
  markdown += `### Step 6: Configure Web Server\n\n`;
  markdown += `#### Apache (.htaccess)\n\n`;
  markdown += `The included \`.htaccess\` file should work out of the box. Ensure \`mod_rewrite\` is enabled:\n\n`;
  markdown += `\`\`\`bash\n`;
  markdown += `sudo a2enmod rewrite\n`;
  markdown += `sudo systemctl restart apache2\n`;
  markdown += `\`\`\`\n\n`;
  
  markdown += `#### Nginx\n\n`;
  markdown += `Add this to your Nginx configuration:\n\n`;
  markdown += `\`\`\`nginx\n`;
  markdown += `server {\n`;
  markdown += `    listen 80;\n`;
  markdown += `    server_name yourdomain.com;\n`;
  markdown += `    root /var/www/html/${options.productName.toLowerCase().replace(/\s+/g, '-')}/public;\n\n`;
  markdown += `    index index.php index.html;\n\n`;
  markdown += `    location / {\n`;
  markdown += `        try_files $uri $uri/ /index.php?$query_string;\n`;
  markdown += `    }\n\n`;
  markdown += `    location ~ \\.php$ {\n`;
  markdown += `        fastcgi_pass unix:/var/run/php/php8.2-fpm.sock;\n`;
  markdown += `        fastcgi_index index.php;\n`;
  markdown += `        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;\n`;
  markdown += `        include fastcgi_params;\n`;
  markdown += `    }\n`;
  markdown += `}\n`;
  markdown += `\`\`\`\n\n`;
  
  markdown += `### Step 7: Verify Installation\n\n`;
  markdown += `Visit your domain in a web browser:\n\n`;
  markdown += `\`\`\`\n`;
  markdown += `http://yourdomain.com/\n`;
  markdown += `\`\`\`\n\n`;
  markdown += `You should see the application homepage.\n\n`;
  
  markdown += `## ✅ Post-Installation\n\n`;
  markdown += `After successful installation:\n\n`;
  markdown += `1. **Change Default Credentials** - Update any default admin passwords\n`;
  markdown += `2. **Configure Email** - Set up SMTP settings for email notifications\n`;
  markdown += `3. **Enable HTTPS** - Install SSL certificate for production use\n`;
  markdown += `4. **Backup Database** - Set up regular database backups\n`;
  markdown += `5. **Review Security** - Check file permissions and security settings\n\n`;
  
  markdown += `## 🔧 Troubleshooting\n\n`;
  markdown += `### Common Issues\n\n`;
  markdown += `**Issue:** "500 Internal Server Error"\n`;
  markdown += `- **Solution:** Check file permissions and .htaccess configuration\n\n`;
  markdown += `**Issue:** "Database connection failed"\n`;
  markdown += `- **Solution:** Verify database credentials in .env file\n\n`;
  markdown += `**Issue:** "Class not found"\n`;
  markdown += `- **Solution:** Run \`composer dump-autoload\`\n\n`;
  
  if (options.supportEmail) {
    markdown += `\n### Need Help?\n\n`;
    markdown += `Contact support at ${options.supportEmail}\n`;
  }
  
  return markdown;
}

/**
 * Generate API Reference from OpenAPI spec
 */
function generateApiReference(
  openApiSpec: OpenAPISpec,
  options: SalesDocOptions
): string {
  let markdown = `# API Reference\n\n`;
  markdown += `Complete API documentation for **${options.productName}**.\n\n`;
  
  markdown += `## 🔗 Base URL\n\n`;
  if (openApiSpec.servers && openApiSpec.servers.length > 0) {
    markdown += `\`\`\`\n${openApiSpec.servers[0].url}\`\`\`\n\n`;
  } else {
    markdown += `\`\`\`\nhttp://yourdomain.com/api\`\`\`\n\n`;
  }
  
  // Security Schemes
  if (openApiSpec.components?.securitySchemes) {
    markdown += `## 🔒 Authentication\n\n`;
    
    const schemes = openApiSpec.components.securitySchemes;
    for (const [name, scheme] of Object.entries(schemes)) {
      const schemeData = scheme as any;
      markdown += `### ${name}\n\n`;
      
      if (schemeData.type === 'http') {
        if (schemeData.scheme === 'bearer') {
          markdown += `**Type:** Bearer Token (JWT)\n\n`;
          markdown += `Include the token in the Authorization header:\n\n`;
          markdown += `\`\`\`http\n`;
          markdown += `Authorization: Bearer YOUR_JWT_TOKEN\n`;
          markdown += `\`\`\`\n\n`;
        } else if (schemeData.scheme === 'basic') {
          markdown += `**Type:** Basic Authentication\n\n`;
          markdown += `\`\`\`http\n`;
          markdown += `Authorization: Basic BASE64_ENCODED_CREDENTIALS\n`;
          markdown += `\`\`\`\n\n`;
        }
      } else if (schemeData.type === 'apiKey') {
        markdown += `**Type:** API Key\n`;
        markdown += `**Location:** ${schemeData.in}\n`;
        markdown += `**Header Name:** ${schemeData.name}\n\n`;
        markdown += `\`\`\`http\n`;
        markdown += `${schemeData.name}: YOUR_API_KEY\n`;
        markdown += `\`\`\`\n\n`;
      } else if (schemeData.type === 'oauth2') {
        markdown += `**Type:** OAuth 2.0\n\n`;
      }
    }
  }
  
  // Endpoints
  markdown += `## 📋 Endpoints\n\n`;
  
  const paths = openApiSpec.paths || {};
  const pathEntries = Object.entries(paths);
  
  // Group by tag/category
  const endpointsByTag: Record<string, Array<{ path: string; method: string; operation: any }>> = {};
  
  for (const [path, methods] of pathEntries) {
    for (const [method, operation] of Object.entries(methods as any)) {
      if (['get', 'post', 'put', 'patch', 'delete'].includes(method)) {
        const operationData = operation as any;
        const tags = operationData.tags || ['General'];
        const tag = tags[0];
        
        if (!endpointsByTag[tag]) {
          endpointsByTag[tag] = [];
        }
        
        endpointsByTag[tag].push({ path, method: method.toUpperCase(), operation });
      }
    }
  }
  
  // Generate documentation for each category
  for (const [tag, endpoints] of Object.entries(endpointsByTag)) {
    markdown += `### ${tag}\n\n`;
    
    for (const { path, method, operation } of endpoints) {
      markdown += `#### ${method} ${path}\n\n`;
      
      if (operation.summary) {
        markdown += `${operation.summary}\n\n`;
      }
      
      if (operation.description) {
        markdown += `${operation.description}\n\n`;
      }
      
      // Parameters
      if (operation.parameters && operation.parameters.length > 0) {
        markdown += `**Parameters:**\n\n`;
        markdown += `| Name | Type | In | Required | Description |\n`;
        markdown += `|------|------|-----|----------|-------------|\n`;
        
        for (const param of operation.parameters) {
          const required = param.required ? '✅' : '❌';
          const type = param.schema?.type || 'string';
          markdown += `| ${param.name} | ${type} | ${param.in} | ${required} | ${param.description || '-'} |\n`;
        }
        markdown += `\n`;
      }
      
      // Request Body
      if (operation.requestBody) {
        markdown += `**Request Body:**\n\n`;
        markdown += `\`\`\`json\n`;
        markdown += `{\n`;
        markdown += `  // Request body schema\n`;
        markdown += `}\n`;
        markdown += `\`\`\`\n\n`;
      }
      
      // Responses
      markdown += `**Responses:**\n\n`;
      markdown += `| Status | Description |\n`;
      markdown += `|--------|-------------|\n`;
      
      if (operation.responses) {
        for (const [statusCode, response] of Object.entries(operation.responses)) {
          const desc = (response as any).description || '-';
          markdown += `| ${statusCode} | ${desc} |\n`;
        }
      } else {
        markdown += `| 200 | Success |\n`;
        markdown += `| 401 | Unauthorized |\n`;
        markdown += `| 404 | Not Found |\n`;
      }
      markdown += `\n`;
      
      // Example
      markdown += `**Example Request:**\n\n`;
      markdown += `\`\`\`bash\n`;
      markdown += `curl -X ${method} "${openApiSpec.servers?.[0]?.url || 'http://api.example.com'}${path}" \\\n`;
      
      if (operation.security && operation.security.length > 0) {
        const securityName = Object.keys(operation.security[0])[0];
        const scheme = openApiSpec.components?.securitySchemes?.[securityName] as any;
        
        if (scheme?.type === 'http' && scheme?.scheme === 'bearer') {
          markdown += `  -H "Authorization: Bearer YOUR_JWT_TOKEN" \\\n`;
        } else if (scheme?.type === 'apiKey') {
          markdown += `  -H "${scheme.name}: YOUR_API_KEY" \\\n`;
        }
      }
      
      markdown += `  -H "Content-Type: application/json"\n`;
      
      if (['POST', 'PUT', 'PATCH'].includes(method)) {
        markdown += `  -d '{"key": "value"}'\n`;
      }
      
      markdown += `\`\`\`\n\n`;
      
      markdown += `**Example Response:**\n\n`;
      markdown += `\`\`\`json\n`;
      markdown += `{\n`;
      markdown += `  "status": "success",\n`;
      markdown += `  "data": {}\n`;
      markdown += `}\n`;
      markdown += `\`\`\`\n\n`;
      
      markdown += `---\n\n`;
    }
  }
  
  markdown += `## 📊 Response Codes\n\n`;
  markdown += `| Code | Description |\n`;
  markdown += `|------|-------------|\n`;
  markdown += `| 200 | OK - Request succeeded |\n`;
  markdown += `| 201 | Created - Resource created successfully |\n`;
  markdown += `| 400 | Bad Request - Invalid parameters |\n`;
  markdown += `| 401 | Unauthorized - Authentication required |\n`;
  markdown += `| 403 | Forbidden - Insufficient permissions |\n`;
  markdown += `| 404 | Not Found - Resource not found |\n`;
  markdown += `| 500 | Internal Server Error - Server error |\n`;
  
  return markdown;
}

/**
 * Generate Configuration Guide
 */
function generateConfigurationGuide(
  files: FileAnalysis[],
  options: SalesDocOptions
): string {
  let markdown = `# Configuration Guide\n\n`;
  markdown += `Complete configuration options for **${options.productName}**.\n\n`;
  
  markdown += `## 🔧 Environment Configuration\n\n`;
  markdown += `All configuration is done through the \`.env\` file.\n\n`;
  
  markdown += `### Application Settings\n\n`;
  markdown += `\`\`\`ini\n`;
  markdown += `# Application Name\n`;
  markdown += `APP_NAME="${options.productName}"\n\n`;
  markdown += `# Environment (development, production)\n`;
  markdown += `APP_ENV=production\n\n`;
  markdown += `# Debug Mode (true for development, false for production)\n`;
  markdown += `APP_DEBUG=false\n\n`;
  markdown += `# Application URL\n`;
  markdown += `APP_URL=http://yourdomain.com\n`;
  markdown += `\`\`\`\n\n`;
  
  markdown += `### Database Configuration\n\n`;
  markdown += `\`\`\`ini\n`;
  markdown += `DB_CONNECTION=mysql\n`;
  markdown += `DB_HOST=127.0.0.1\n`;
  markdown += `DB_PORT=3306\n`;
  markdown += `DB_DATABASE=your_database\n`;
  markdown += `DB_USERNAME=your_username\n`;
  markdown += `DB_PASSWORD=your_password\n`;
  markdown += `\`\`\`\n\n`;
  
  markdown += `### Security Settings\n\n`;
  markdown += `\`\`\`ini\n`;
  markdown += `# JWT Secret Key (generate with: openssl rand -base64 32)\n`;
  markdown += `JWT_SECRET=your_secret_key_here\n\n`;
  markdown += `# JWT Expiration (in minutes)\n`;
  markdown += `JWT_EXPIRATION=60\n\n`;
  markdown += `# API Rate Limiting (requests per minute)\n`;
  markdown += `API_RATE_LIMIT=60\n`;
  markdown += `\`\`\`\n\n`;
  
  markdown += `### Email Configuration\n\n`;
  markdown += `\`\`\`ini\n`;
  markdown += `MAIL_DRIVER=smtp\n`;
  markdown += `MAIL_HOST=smtp.mailtrap.io\n`;
  markdown += `MAIL_PORT=2525\n`;
  markdown += `MAIL_USERNAME=your_username\n`;
  markdown += `MAIL_PASSWORD=your_password\n`;
  markdown += `MAIL_ENCRYPTION=tls\n`;
  markdown += `MAIL_FROM_ADDRESS=noreply@yourdomain.com\n`;
  markdown += `MAIL_FROM_NAME="${options.productName}"\n`;
  markdown += `\`\`\`\n\n`;
  
  markdown += `### Cache Configuration\n\n`;
  markdown += `\`\`\`ini\n`;
  markdown += `CACHE_DRIVER=file  # Options: file, redis, memcached\n`;
  markdown += `CACHE_TTL=3600     # Cache time-to-live in seconds\n`;
  markdown += `\`\`\`\n\n`;
  
  markdown += `## 🔒 Security Best Practices\n\n`;
  markdown += `1. **Change Default Secrets** - Generate new JWT secrets and encryption keys\n`;
  markdown += `2. **Use HTTPS** - Always use SSL in production\n`;
  markdown += `3. **Restrict File Permissions** - Set proper permissions on sensitive files\n`;
  markdown += `4. **Enable Rate Limiting** - Protect against API abuse\n`;
  markdown += `5. **Regular Updates** - Keep dependencies up to date\n`;
  markdown += `6. **Backup Database** - Set up automated backups\n\n`;
  
  markdown += `## 🚀 Performance Optimization\n\n`;
  markdown += `### Enable Caching\n\n`;
  markdown += `\`\`\`bash\n`;
  markdown += `# Clear cache\n`;
  markdown += `php artisan cache:clear\n\n`;
  markdown += `# Cache configuration\n`;
  markdown += `php artisan config:cache\n\n`;
  markdown += `# Cache routes\n`;
  markdown += `php artisan route:cache\n`;
  markdown += `\`\`\`\n\n`;
  
  markdown += `### Database Optimization\n\n`;
  markdown += `- Add indexes to frequently queried columns\n`;
  markdown += `- Use database query caching\n`;
  markdown += `- Optimize your database tables regularly\n\n`;
  
  markdown += `### Enable OPcache\n\n`;
  markdown += `Add to your \`php.ini\`:\n\n`;
  markdown += `\`\`\`ini\n`;
  markdown += `opcache.enable=1\n`;
  markdown += `opcache.memory_consumption=128\n`;
  markdown += `opcache.max_accelerated_files=10000\n`;
  markdown += `opcache.revalidate_freq=60\n`;
  markdown += `\`\`\`\n\n`;
  
  return markdown;
}

/**
 * Generate Code Examples
 */
function generateExamples(
  files: FileAnalysis[],
  openApiSpec: OpenAPISpec,
  options: SalesDocOptions
): string {
  let markdown = `# Code Examples\n\n`;
  markdown += `Practical examples for **${options.productName}**.\n\n`;
  
  // Get first few endpoints for examples
  const paths = openApiSpec.paths || {};
  const pathEntries = Object.entries(paths).slice(0, 3);
  
  markdown += `## 🔐 Authentication Examples\n\n`;
  
  markdown += `### Login Request\n\n`;
  markdown += `\`\`\`javascript\n`;
  markdown += `// Using fetch API\n`;
  markdown += `const login = async (email, password) => {\n`;
  markdown += `  const response = await fetch('${openApiSpec.servers?.[0]?.url || 'http://api.example.com'}/auth/login', {\n`;
  markdown += `    method: 'POST',\n`;
  markdown += `    headers: {\n`;
  markdown += `      'Content-Type': 'application/json'\n`;
  markdown += `    },\n`;
  markdown += `    body: JSON.stringify({ email, password })\n`;
  markdown += `  });\n`;
  markdown += `  \n`;
  markdown += `  const data = await response.json();\n`;
  markdown += `  return data.token; // Store this token for authenticated requests\n`;
  markdown += `};\n`;
  markdown += `\`\`\`\n\n`;
  
  markdown += `### Using PHP cURL\n\n`;
  markdown += `\`\`\`php\n`;
  markdown += `<?php\n`;
  markdown += `$ch = curl_init();\n`;
  markdown += `curl_setopt($ch, CURLOPT_URL, "${openApiSpec.servers?.[0]?.url || 'http://api.example.com'}/auth/login");\n`;
  markdown += `curl_setopt($ch, CURLOPT_POST, true);\n`;
  markdown += `curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([\n`;
  markdown += `    'email' => 'user@example.com',\n`;
  markdown += `    'password' => 'password123'\n`;
  markdown += `]));\n`;
  markdown += `curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);\n`;
  markdown += `curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);\n\n`;
  markdown += `$response = curl_exec($ch);\n`;
  markdown += `$data = json_decode($response, true);\n`;
  markdown += `$token = $data['token'];\n`;
  markdown += `curl_close($ch);\n`;
  markdown += `?>\n`;
  markdown += `\`\`\`\n\n`;
  
  markdown += `## 📋 API Request Examples\n\n`;
  
  for (const [path, methods] of pathEntries) {
    for (const [method, operation] of Object.entries(methods as any)) {
      if (['get', 'post'].includes(method)) {
        const methodUpper = method.toUpperCase();
        const opData = operation as any;
        
        markdown += `### ${opData.summary || `${methodUpper} ${path}`}\n\n`;
        
        markdown += `#### JavaScript/TypeScript\n\n`;
        markdown += `\`\`\`typescript\n`;
        markdown += `const ${method}Data = async () => {\n`;
        markdown += `  const response = await fetch('${openApiSpec.servers?.[0]?.url || 'http://api.example.com'}${path}', {\n`;
        markdown += `    method: '${methodUpper}',\n`;
        markdown += `    headers: {\n`;
        markdown += `      'Content-Type': 'application/json',\n`;
        markdown += `      'Authorization': 'Bearer YOUR_TOKEN'\n`;
        markdown += `    }`;
        
        if (method === 'post') {
          markdown += `,\n    body: JSON.stringify({\n`;
          markdown += `      // Your data here\n`;
          markdown += `    })`;
        }
        
        markdown += `\n  });\n`;
        markdown += `  \n`;
        markdown += `  return await response.json();\n`;
        markdown += `};\n`;
        markdown += `\`\`\`\n\n`;
        
        markdown += `#### Python\n\n`;
        markdown += `\`\`\`python\n`;
        markdown += `import requests\n\n`;
        markdown += `url = "${openApiSpec.servers?.[0]?.url || 'http://api.example.com'}${path}"\n`;
        markdown += `headers = {\n`;
        markdown += `    "Content-Type": "application/json",\n`;
        markdown += `    "Authorization": "Bearer YOUR_TOKEN"\n`;
        markdown += `}\n`;
        
        if (method === 'post') {
          markdown += `data = {\n`;
          markdown += `    # Your data here\n`;
          markdown += `}\n\n`;
          markdown += `response = requests.post(url, json=data, headers=headers)\n`;
        } else {
          markdown += `\nresponse = requests.get(url, headers=headers)\n`;
        }
        
        markdown += `print(response.json())\n`;
        markdown += `\`\`\`\n\n`;
      }
    }
  }
  
  markdown += `## 🔄 Error Handling\n\n`;
  markdown += `\`\`\`javascript\n`;
  markdown += `const apiCall = async () => {\n`;
  markdown += `  try {\n`;
  markdown += `    const response = await fetch('${openApiSpec.servers?.[0]?.url || 'http://api.example.com'}/endpoint');\n`;
  markdown += `    \n`;
  markdown += `    if (!response.ok) {\n`;
  markdown += `      throw new Error(\`HTTP error! status: \${response.status}\`);\n`;
  markdown += `    }\n`;
  markdown += `    \n`;
  markdown += `    const data = await response.json();\n`;
  markdown += `    return data;\n`;
  markdown += `    \n`;
  markdown += `  } catch (error) {\n`;
  markdown += `    console.error('API call failed:', error);\n`;
  markdown += `    // Handle error appropriately\n`;
  markdown += `  }\n`;
  markdown += `};\n`;
  markdown += `\`\`\`\n\n`;
  
  return markdown;
}

/**
 * Generate FAQ
 */
function generateFAQ(options: SalesDocOptions): string {
  let markdown = `# Frequently Asked Questions\n\n`;
  markdown += `Common questions about **${options.productName}**.\n\n`;
  
  markdown += `## 📦 General Questions\n\n`;
  
  markdown += `### What PHP version is required?\n\n`;
  if (options.requirements?.php) {
    markdown += `${options.productName} requires PHP ${options.requirements.php} or higher.\n\n`;
  } else {
    markdown += `${options.productName} requires PHP 7.4 or higher.\n\n`;
  }
  
  markdown += `### Can I use this on multiple domains?\n\n`;
  markdown += `The regular license allows usage on a single domain. For multiple domains, please purchase additional licenses.\n\n`;
  
  markdown += `### Is the source code included?\n\n`;
  markdown += `Yes! Full source code is included with your purchase.\n\n`;
  
  markdown += `### Do you provide updates?\n\n`;
  markdown += `Yes, all updates are free for 6 months. Extended support is available.\n\n`;
  
  markdown += `## 🔧 Technical Questions\n\n`;
  
  markdown += `### How do I enable HTTPS?\n\n`;
  markdown += `1. Install an SSL certificate (Let's Encrypt is free)\n`;
  markdown += `2. Update your \`.env\` file to use \`https://\` URLs\n`;
  markdown += `3. Configure your web server to redirect HTTP to HTTPS\n\n`;
  
  markdown += `### How do I change the database?\n\n`;
  markdown += `Edit the database credentials in your \`.env\` file:\n\n`;
  markdown += `\`\`\`ini\n`;
  markdown += `DB_HOST=your_host\n`;
  markdown += `DB_DATABASE=your_database\n`;
  markdown += `DB_USERNAME=your_username\n`;
  markdown += `DB_PASSWORD=your_password\n`;
  markdown += `\`\`\`\n\n`;
  
  markdown += `### How do I reset my admin password?\n\n`;
  markdown += `Use the password reset feature or run the password reset command:\n\n`;
  markdown += `\`\`\`bash\n`;
  markdown += `php artisan user:reset-password admin@example.com\n`;
  markdown += `\`\`\`\n\n`;
  
  markdown += `### Can I customize the design?\n\n`;
  markdown += `Absolutely! All views and templates are fully customizable. Edit the files in the \`views/\` or \`resources/views/\` directory.\n\n`;
  
  markdown += `## 🐛 Troubleshooting\n\n`;
  
  markdown += `### "500 Internal Server Error"\n\n`;
  markdown += `**Common causes:**\n`;
  markdown += `- Incorrect file permissions\n`;
  markdown += `- Missing .htaccess file\n`;
  markdown += `- PHP version too old\n\n`;
  markdown += `**Solutions:**\n`;
  markdown += `- Check error logs: \`tail -f storage/logs/laravel.log\`\n`;
  markdown += `- Verify file permissions: \`chmod -R 775 storage\`\n`;
  markdown += `- Enable display_errors in development\n\n`;
  
  markdown += `### "Database connection failed"\n\n`;
  markdown += `**Solutions:**\n`;
  markdown += `- Verify database credentials in \`.env\`\n`;
  markdown += `- Ensure database server is running\n`;
  markdown += `- Check if database user has proper permissions\n\n`;
  
  markdown += `### "Class not found" errors\n\n`;
  markdown += `**Solution:**\n`;
  markdown += `\`\`\`bash\n`;
  markdown += `composer dump-autoload\n`;
  markdown += `\`\`\`\n\n`;
  
  markdown += `## 💬 Support\n\n`;
  
  markdown += `### How do I get support?\n\n`;
  if (options.supportEmail) {
    markdown += `Email us at ${options.supportEmail} with:\n`;
  } else {
    markdown += `Contact support with:\n`;
  }
  markdown += `- Detailed description of the issue\n`;
  markdown += `- Error messages (if any)\n`;
  markdown += `- Steps to reproduce\n`;
  markdown += `- Your purchase code\n\n`;
  
  markdown += `### What's your support response time?\n\n`;
  markdown += `We typically respond within 24 hours on business days.\n\n`;
  
  markdown += `### Is customization service available?\n\n`;
  markdown += `Yes! We offer custom development services. Contact us for a quote.\n\n`;
  
  return markdown;
}

/**
 * Generate Changelog
 */
function generateChangelog(options: SalesDocOptions): string {
  let markdown = `# Changelog\n\n`;
  markdown += `All notable changes to **${options.productName}** will be documented here.\n\n`;
  
  markdown += `## [${options.productVersion}] - ${new Date().toISOString().split('T')[0]}\n\n`;
  
  markdown += `### Added\n`;
  markdown += `- Initial release\n`;
  if (options.features && options.features.length > 0) {
    options.features.forEach(feature => {
      markdown += `- ${feature}\n`;
    });
  }
  markdown += `\n`;
  
  markdown += `### Security\n`;
  markdown += `- JWT authentication\n`;
  markdown += `- API rate limiting\n`;
  markdown += `- Input validation\n`;
  markdown += `- XSS protection\n`;
  markdown += `- CSRF protection\n\n`;
  
  markdown += `---\n\n`;
  markdown += `## How to Read This Changelog\n\n`;
  markdown += `- **Added** - New features\n`;
  markdown += `- **Changed** - Changes to existing functionality\n`;
  markdown += `- **Deprecated** - Features that will be removed\n`;
  markdown += `- **Removed** - Features that were removed\n`;
  markdown += `- **Fixed** - Bug fixes\n`;
  markdown += `- **Security** - Security improvements\n`;
  
  return markdown;
}

/**
 * Export sales documentation to files
 */
export async function exportSalesDocumentation(
  docs: ReturnType<typeof generateSalesDocumentation>,
  outputDir: string
): Promise<void> {
  const fs = await import('fs/promises');
  const path = await import('path');
  
  // Create output directory if it doesn't exist
  try {
    await fs.mkdir(outputDir, { recursive: true });
  } catch (error) {
    // Directory might already exist
  }
  
  // Write all documentation files
  await Promise.all([
    fs.writeFile(path.join(outputDir, 'README.md'), docs.readme),
    fs.writeFile(path.join(outputDir, 'INSTALLATION.md'), docs.installation),
    fs.writeFile(path.join(outputDir, 'API_REFERENCE.md'), docs.apiReference),
    fs.writeFile(path.join(outputDir, 'CONFIGURATION.md'), docs.configuration),
    fs.writeFile(path.join(outputDir, 'EXAMPLES.md'), docs.examples),
    fs.writeFile(path.join(outputDir, 'FAQ.md'), docs.faq),
    fs.writeFile(path.join(outputDir, 'CHANGELOG.md'), docs.changelog)
  ]);
}
