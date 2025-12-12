#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from "@modelcontextprotocol/sdk/types.js";
import { analyzeProject } from "./tools/analyzeProject.js";
import { generateStructure } from "./tools/generateStructure.js";
import { createPage } from "./tools/createPage.js";
import { generateApi } from "./tools/generateApi.js";
import { buildStatic } from "./tools/buildStatic.js";
import { exportPdf } from "./tools/exportPdf.js";
import { preview } from "./tools/preview.js";
import { generateOpenApiSpec, exportOpenApiJson, exportOpenApiYaml } from "./tools/generateOpenApi.js";
import { generateSalesDocumentation, exportSalesDocumentation, SalesDocOptions, OpenAPISpec } from "./tools/generateSalesDocumentation.js";

const server = new Server(
  {
    name: "documentation-mcp-server",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

const tools: Tool[] = [
  {
    name: "docs_analyze_project",
    description: "Analyze project structure and perform deep code analysis to understand the project for documentation generation. Supports TypeScript, JavaScript, Python, Go, and more. Deep analysis extracts classes, functions, interfaces, documentation coverage, and more.",
    inputSchema: {
      type: "object",
      properties: {
        projectPath: {
          type: "string",
          description: "Path to the project directory to analyze",
        },
        language: {
          type: "string",
          description: "Primary programming language (typescript, javascript, python, go, etc.)",
          enum: ["typescript", "javascript", "python", "go", "rust", "java", "csharp"],
        },
        deep: {
          type: "boolean",
          description: "Enable deep code analysis using language-specific AST parsers (default: true)",
          default: true,
        },
      },
      required: ["projectPath"],
    },
  },
  {
    name: "docs_generate_structure",
    description: "Generate documentation scaffold/structure based on project analysis. Creates initial directory structure and configuration files.",
    inputSchema: {
      type: "object",
      properties: {
        projectPath: {
          type: "string",
          description: "Path to the project directory",
        },
        framework: {
          type: "string",
          description: "Documentation framework to use",
          enum: ["docusaurus", "mkdocs", "sphinx"],
        },
        template: {
          type: "string",
          description: "Template to use (for Docusaurus: classic, facebook, etc.)",
        },
        outputPath: {
          type: "string",
          description: "Output path for documentation (default: ./docs)",
        },
      },
      required: ["projectPath", "framework"],
    },
  },
  {
    name: "docs_create_page",
    description: "Create or edit individual documentation pages with Markdown content",
    inputSchema: {
      type: "object",
      properties: {
        docsPath: {
          type: "string",
          description: "Path to documentation directory",
        },
        pagePath: {
          type: "string",
          description: "Relative path for the page (e.g., 'guides/getting-started.md')",
        },
        title: {
          type: "string",
          description: "Page title",
        },
        content: {
          type: "string",
          description: "Markdown content for the page",
        },
      },
      required: ["docsPath", "pagePath", "title", "content"],
    },
  },
  {
    name: "docs_generate_api",
    description: "Generate API documentation from code (JSDoc, Docstrings, etc.)",
    inputSchema: {
      type: "object",
      properties: {
        projectPath: {
          type: "string",
          description: "Path to the project source code",
        },
        outputPath: {
          type: "string",
          description: "Output path for API documentation",
        },
        language: {
          type: "string",
          description: "Programming language",
          enum: ["typescript", "javascript", "python", "go", "rust", "java", "csharp"],
        },
      },
      required: ["projectPath", "outputPath", "language"],
    },
  },
  {
    name: "docs_build_static",
    description: "Build static website for online hosting (ready for GitHub Pages, Netlify, Vercel, etc.)",
    inputSchema: {
      type: "object",
      properties: {
        docsPath: {
          type: "string",
          description: "Path to documentation directory",
        },
        framework: {
          type: "string",
          description: "Documentation framework used",
          enum: ["docusaurus", "mkdocs", "sphinx"],
        },
        outputPath: {
          type: "string",
          description: "Output path for built site (default: ./build)",
        },
      },
      required: ["docsPath", "framework"],
    },
  },
  {
    name: "docs_export_pdf",
    description: "Generate PDF from documentation using Puppeteer/Playwright",
    inputSchema: {
      type: "object",
      properties: {
        docsPath: {
          type: "string",
          description: "Path to documentation or built site",
        },
        outputPath: {
          type: "string",
          description: "Output path for PDF file",
        },
        includePages: {
          type: "array",
          items: { type: "string" },
          description: "Specific pages to include (optional, includes all by default)",
        },
      },
      required: ["docsPath", "outputPath"],
    },
  },
  {
    name: "docs_preview",
    description: "Start local development server to preview documentation",
    inputSchema: {
      type: "object",
      properties: {
        docsPath: {
          type: "string",
          description: "Path to documentation directory",
        },
        framework: {
          type: "string",
          description: "Documentation framework used",
          enum: ["docusaurus", "mkdocs", "sphinx"],
        },
        port: {
          type: "number",
          description: "Port number (default: 3000 for Docusaurus, 8000 for MkDocs/Sphinx)",
        },
      },
      required: ["docsPath", "framework"],
    },
  },
  {
    name: "docs_generate_openapi",
    description: "Generate OpenAPI 3.0 specification from analyzed PHP routes with middleware, parameters, and security schemes. Automatically converts controller routes to API documentation.",
    inputSchema: {
      type: "object",
      properties: {
        projectPath: {
          type: "string",
          description: "Path to the PHP project directory to analyze",
        },
        outputPath: {
          type: "string",
          description: "Output path for OpenAPI spec file (default: ./openapi.json)",
        },
        format: {
          type: "string",
          description: "Output format",
          enum: ["json", "yaml"],
          default: "json",
        },
        title: {
          type: "string",
          description: "API title (default: 'API Documentation')",
        },
        version: {
          type: "string",
          description: "API version (default: '1.0.0')",
        },
        serverUrl: {
          type: "string",
          description: "API server URL (e.g., 'https://api.example.com')",
        },
      },
      required: ["projectPath"],
    },
  },
  {
    name: "docs_generate_sales_docs",
    description: "Generate professional sales-ready documentation for CodeCanyon, ThemeForest, and other marketplaces. Creates comprehensive Markdown documentation (README, Installation, API Reference, Configuration, Examples, FAQ, Changelog) with optional PDF export.",
    inputSchema: {
      type: "object",
      properties: {
        projectPath: {
          type: "string",
          description: "Path to the PHP project directory to analyze",
        },
        outputDir: {
          type: "string",
          description: "Output directory for documentation files (default: ./sales-docs)",
        },
        productName: {
          type: "string",
          description: "Product name for marketplace listing (e.g., 'Advanced User Management System')",
        },
        productVersion: {
          type: "string",
          description: "Product version (default: '1.0.0')",
        },
        author: {
          type: "string",
          description: "Author or company name (e.g., 'Your Company')",
        },
        description: {
          type: "string",
          description: "Product description for the README (e.g., 'A comprehensive user management system with advanced features...')",
        },
        price: {
          type: "string",
          description: "Product price (optional, e.g., '$49' or '€39')",
        },
        demoUrl: {
          type: "string",
          description: "Live demo URL (optional)",
        },
        supportEmail: {
          type: "string",
          description: "Support email address (optional)",
        },
        features: {
          type: "array",
          items: { type: "string" },
          description: "List of key product features (e.g., ['User authentication', 'Role-based access', 'API support'])",
        },
      },
      required: ["projectPath", "productName", "author", "description"],
    },
  },
];

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return { tools };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  try {
    const { name, arguments: args } = request.params;

    switch (name) {
      case "docs_analyze_project":
        return await analyzeProject(args);
      case "docs_generate_structure":
        return await generateStructure(args);
      case "docs_create_page":
        return await createPage(args);
      case "docs_generate_api":
        return await generateApi(args);
      case "docs_build_static":
        return await buildStatic(args);
      case "docs_export_pdf":
        return await exportPdf(args);
      case "docs_preview":
        return await preview(args);
      case "docs_generate_openapi":
        return await generateOpenApi(args);
      case "docs_generate_sales_docs":
        return await generateSalesDocs(args);
      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      content: [{ type: "text", text: `Error: ${errorMessage}` }],
      isError: true,
    };
  }
});

/**
 * Generate OpenAPI specification from PHP project
 */
async function generateOpenApi(args: any) {
  const projectPath = args.projectPath as string;
  const outputPath = (args.outputPath as string) || './openapi.json';
  const format = (args.format as string) || 'json';
  const title = args.title as string;
  const version = args.version as string;
  const serverUrl = args.serverUrl as string;
  
  try {
    // Analyze project first
    const analysisResult = await analyzeProject({
      projectPath,
      language: 'php',
      deep: true,
    });
    
    // Extract file analysis from result
    const files = analysisResult.content[0].text;
    const analysis = JSON.parse(files);
    
    // Generate OpenAPI spec
    const spec = generateOpenApiSpec(analysis.deepAnalysis?.files || [], {
      title,
      version,
      serverUrl,
    });
    
    // Export to file
    const fs = await import('fs/promises');
    const path = await import('path');
    
    const fullPath = path.resolve(projectPath, outputPath);
    const content = format === 'yaml' 
      ? exportOpenApiYaml(spec)
      : exportOpenApiJson(spec);
    
    await fs.writeFile(fullPath, content, 'utf-8');
    
    return {
      content: [
        {
          type: "text",
          text: `✅ OpenAPI ${format.toUpperCase()} specification generated successfully!\n\nFile: ${fullPath}\n\nStats:\n- Paths: ${Object.keys(spec.paths).length}\n- Security Schemes: ${spec.components?.securitySchemes ? Object.keys(spec.components.securitySchemes).length : 0}\n\nPreview:\n${JSON.stringify(spec, null, 2).substring(0, 1000)}...`,
        },
      ],
    };
  } catch (error) {
    throw new Error(`Failed to generate OpenAPI spec: ${error}`);
  }
}

/**
 * Generate sales-ready documentation for marketplaces
 */
async function generateSalesDocs(args: any) {
  const projectPath = args.projectPath as string;
  const outputDir = (args.outputDir as string) || './sales-docs';
  const productName = args.productName as string;
  const productVersion = (args.productVersion as string) || '1.0.0';
  const author = args.author as string;
  const description = args.description as string;
  const price = args.price as string;
  const demoUrl = args.demoUrl as string;
  const supportEmail = args.supportEmail as string;
  const features = (args.features as string[]) || [];
  
  try {
    // Analyze project first
    const analysisResult = await analyzeProject({
      projectPath,
      language: 'php',
      deep: true,
    });
    
    // Extract file analysis from result
    const files = analysisResult.content[0].text;
    const analysis = JSON.parse(files);
    const analyzedFiles = analysis.deepAnalysis?.files || [];
    
    // Generate OpenAPI spec
    const openApiSpec = generateOpenApiSpec(analyzedFiles, {
      title: `${productName} API`,
      version: productVersion,
      description,
      serverUrl: demoUrl || 'https://api.example.com/v1',
    }) as OpenAPISpec;
    
    // Prepare sales doc options
    const options: SalesDocOptions = {
      productName,
      productVersion,
      author,
      description,
      price,
      demoUrl,
      supportEmail,
      features,
      requirements: {
        php: '7.4',
        framework: analyzedFiles[0]?.framework || 'Generic PHP',
        database: 'MySQL 5.7+ or PostgreSQL 10+',
        extensions: ['pdo', 'mbstring', 'openssl', 'curl', 'json'],
      },
    };
    
    // Generate all documentation
    const docs = generateSalesDocumentation(analyzedFiles, openApiSpec, options);
    
    // Export to files
    const path = await import('path');
    const fullOutputDir = path.resolve(projectPath, outputDir);
    exportSalesDocumentation(docs, fullOutputDir);
    
    // Create combined documentation
    const fs = await import('fs/promises');
    const combinedMd = `${docs.readme}\n\n---\n\n${docs.installation}\n\n---\n\n${docs.apiReference}\n\n---\n\n${docs.configuration}\n\n---\n\n${docs.examples}\n\n---\n\n${docs.faq}\n\n---\n\n${docs.changelog}`;
    const combinedPath = path.join(fullOutputDir, 'COMPLETE_DOCUMENTATION.md');
    await fs.writeFile(combinedPath, combinedMd, 'utf-8');
    
    let resultText = `✅ Sales documentation generated successfully!\n\n`;
    resultText += `📁 Output Directory: ${fullOutputDir}\n\n`;
    resultText += `📄 Files Created:\n`;
    resultText += `   - README.md (Main product documentation)\n`;
    resultText += `   - INSTALLATION.md (Step-by-step setup guide)\n`;
    resultText += `   - API_REFERENCE.md (${Object.keys(openApiSpec.paths).length} API endpoints)\n`;
    resultText += `   - CONFIGURATION.md (Configuration options)\n`;
    resultText += `   - EXAMPLES.md (Code examples in multiple languages)\n`;
    resultText += `   - FAQ.md (Frequently asked questions)\n`;
    resultText += `   - CHANGELOG.md (Version history)\n`;
    resultText += `   - COMPLETE_DOCUMENTATION.md (All-in-one combined docs)\n\n`;
    
    resultText += `📊 Documentation Stats:\n`;
    resultText += `   - API Endpoints: ${Object.keys(openApiSpec.paths).length}\n`;
    resultText += `   - Security Schemes: ${Object.keys(openApiSpec.components?.securitySchemes || {}).length}\n`;
    resultText += `   - Frameworks: ${analyzedFiles[0]?.framework || 'PHP'}\n`;
    resultText += `   - Classes Analyzed: ${analyzedFiles.length}\n\n`;
    
    resultText += `💡 Next Steps:\n`;
    resultText += `   1. Review generated documentation\n`;
    resultText += `   2. Customize with your branding\n`;
    resultText += `   3. Generate PDF: pandoc COMPLETE_DOCUMENTATION.md -o Documentation.pdf --toc\n`;
    resultText += `   4. Upload to CodeCanyon/ThemeForest\n\n`;
    
    resultText += `🎯 Perfect for marketplace sales!`;
    
    return {
      content: [
        {
          type: "text",
          text: resultText,
        },
      ],
    };
  } catch (error) {
    throw new Error(`Failed to generate sales documentation: ${error}`);
  }
}

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Documentation MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
