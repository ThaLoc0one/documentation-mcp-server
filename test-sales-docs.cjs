/**
 * Test Script for Sales Documentation Generator
 *
 * Generates professional sales-ready documentation for CodeCanyon/ThemeForest
 * Tests on CodeIgniter example project
 */

const { exec } = require("child_process");
const util = require("util");
const path = require("path");
const fs = require("fs");

const execAsync = util.promisify(exec);

async function testSalesDocumentation() {
  console.log(
    "\n╔═══════════════════════════════════════════════════════════╗"
  );
  console.log("║     📚 SALES DOCUMENTATION GENERATOR TEST 📚           ║");
  console.log(
    "╚═══════════════════════════════════════════════════════════╝\n"
  );

  const projectPath = path.join(__dirname, "test-php-project");
  const outputDir = path.join(__dirname, "sales-docs-output");

  console.log("📂 Project Path:", projectPath);
  console.log("📁 Output Directory:", outputDir);
  console.log("\n⚙️  Test Configuration:");
  console.log("   • Product: Advanced User Management API");
  console.log("   • Version: 1.0.0");
  console.log("   • Author: Your Company");
  console.log("   • Price: $49");
  console.log("   • Demo: https://demo.example.com\n");

  // Clean output directory
  if (fs.existsSync(outputDir)) {
    console.log("🧹 Cleaning output directory...");
    fs.rmSync(outputDir, { recursive: true, force: true });
  }

  try {
    // Import the Sales Documentation Generator
    const {
      generateSalesDocumentation,
      exportSalesDocumentation,
    } = require("./dist/tools/generateSalesDocumentation.js");
    const { generateOpenApiSpec } = require("./dist/tools/generateOpenApi.js");

    console.log("🔍 Analyzing PHP files...\n");

    // Analyze PHP files directly using PHP analyzer
    const phpFiles = [
      "CodeIgniterExample.php",
      "LaravelRoutesExample.php",
      "MiddlewareExample.php",
    ];

    const analyzedFiles = [];

    for (const file of phpFiles) {
      const filePath = path.join(projectPath, file);
      console.log(`   Analyzing: ${file}`);

      try {
        const { stdout } = await execAsync(
          `php "${path.join(
            __dirname,
            "src",
            "analyzers",
            "helpers",
            "php_analyzer_v2.php"
          )}" "${filePath}"`,
          { maxBuffer: 10 * 1024 * 1024 }
        );

        const analysis = JSON.parse(stdout);
        analyzedFiles.push(analysis);
      } catch (error) {
        console.error(`   ⚠️  Failed to analyze ${file}:`, error.message);
      }
    }

    console.log(`\n✅ Analyzed ${analyzedFiles.length} files\n`);

    // Generate OpenAPI spec
    console.log("📝 Generating OpenAPI specification...\n");

    const openApiSpec = generateOpenApiSpec(analyzedFiles, {
      title: "Advanced User Management API",
      version: "1.0.0",
      description:
        "Professional RESTful API for user management with advanced features",
      serverUrl: "https://demo.example.com/api/v1",
    });

    const apiEndpoints = Object.keys(openApiSpec.paths).length;
    const securitySchemes = Object.keys(
      openApiSpec.components?.securitySchemes || {}
    ).length;

    console.log("📊 OpenAPI Stats:");
    console.log(`   • Total Endpoints: ${apiEndpoints}`);
    console.log(`   • Security Schemes: ${securitySchemes}\n`);

    // Generate Sales Documentation
    console.log("📚 Generating sales documentation...\n");

    const options = {
      productName: "Advanced User Management API",
      productVersion: "1.0.0",
      author: "Your Company",
      description:
        "A comprehensive, professional-grade user management system built with modern PHP frameworks. Features robust authentication, role-based access control, and a complete RESTful API. Perfect for integrating user management into your web applications.",
      price: "$49",
      demoUrl: "https://demo.example.com",
      supportEmail: "support@yourcompany.com",
      features: [
        "RESTful API with " + apiEndpoints + " endpoints",
        "JWT Authentication & Authorization",
        "Role-based Access Control (RBAC)",
        "Multi-framework support (CodeIgniter 3/4, Laravel, Symfony)",
        "OpenAPI 3.0 specification included",
        "Middleware-based security",
        "Comprehensive API documentation",
        "Code examples in PHP, JavaScript, Python",
        "Easy installation and configuration",
        "Professional support included",
      ],
      requirements: {
        php: "7.4",
        framework: "CodeIgniter 4 / Laravel 8+ / Symfony 5+",
        database: "MySQL 5.7+ or PostgreSQL 10+",
        extensions: ["pdo", "mbstring", "openssl", "curl", "json", "xml"],
      },
    };

    const docs = generateSalesDocumentation(
      analyzedFiles,
      openApiSpec,
      options
    );

    // Export documentation
    await exportSalesDocumentation(docs, outputDir);

    // Create combined documentation
    const combinedMd = `${docs.readme}\n\n---\n\n${docs.installation}\n\n---\n\n${docs.apiReference}\n\n---\n\n${docs.configuration}\n\n---\n\n${docs.examples}\n\n---\n\n${docs.faq}\n\n---\n\n${docs.changelog}`;
    fs.writeFileSync(
      path.join(outputDir, "COMPLETE_DOCUMENTATION.md"),
      combinedMd
    );

    console.log("✅ Sales documentation generated successfully!\n");

    console.log(
      "╔═══════════════════════════════════════════════════════════╗"
    );
    console.log(
      "║                  📄 FILES GENERATED 📄                    ║"
    );
    console.log(
      "╚═══════════════════════════════════════════════════════════╝\n"
    );

    const files = fs.readdirSync(outputDir);
    files.forEach((file) => {
      const stats = fs.statSync(path.join(outputDir, file));
      const sizeKB = (stats.size / 1024).toFixed(1);
      console.log(`   ✅ ${file.padEnd(35)} ${sizeKB.padStart(6)} KB`);
    });

    console.log(
      "\n╔═══════════════════════════════════════════════════════════╗"
    );
    console.log(
      "║              📊 DOCUMENTATION STATISTICS 📊               ║"
    );
    console.log(
      "╚═══════════════════════════════════════════════════════════╝\n"
    );

    console.log("   • API Endpoints:", apiEndpoints);
    console.log("   • Security Schemes:", securitySchemes);
    console.log("   • PHP Files Analyzed:", analyzedFiles.length);
    console.log("   • Documentation Files:", files.length);
    console.log(
      "   • Frameworks Detected:",
      [
        ...new Set(
          analyzedFiles.map((f) => f.frameworkInfo?.name).filter(Boolean)
        ),
      ].join(", ")
    );

    // Show file sizes
    const totalSize = files.reduce((sum, file) => {
      return sum + fs.statSync(path.join(outputDir, file)).size;
    }, 0);
    console.log(
      "   • Total Documentation Size:",
      (totalSize / 1024).toFixed(1),
      "KB\n"
    );

    console.log(
      "╔═══════════════════════════════════════════════════════════╗"
    );
    console.log(
      "║                  📄 CONTENT PREVIEW 📄                    ║"
    );
    console.log(
      "╚═══════════════════════════════════════════════════════════╝\n"
    );

    // Preview README.md
    console.log("📖 README.md (first 20 lines):\n");
    const readmeLines = docs.readme.split("\n").slice(0, 20);
    readmeLines.forEach((line) => console.log("   " + line));
    console.log("   ... (truncated)\n");

    // Preview API_REFERENCE.md
    console.log("📖 API_REFERENCE.md (first 15 lines):\n");
    const apiRefLines = docs.apiReference.split("\n").slice(0, 15);
    apiRefLines.forEach((line) => console.log("   " + line));
    console.log("   ... (truncated)\n");

    console.log(
      "╔═══════════════════════════════════════════════════════════╗"
    );
    console.log("║              💡 NEXT STEPS FOR CODECANYON 💡             ║");
    console.log(
      "╚═══════════════════════════════════════════════════════════╝\n"
    );

    console.log("1️⃣  Review the generated documentation:");
    console.log(`   cd "${outputDir}"\n`);

    console.log("2️⃣  Generate PDF for buyers:");
    console.log(
      "   pandoc COMPLETE_DOCUMENTATION.md -o Documentation.pdf --toc"
    );
    console.log("   (requires pandoc: https://pandoc.org/installing.html)\n");

    console.log("3️⃣  Customize branding:");
    console.log("   • Update README.md with your logo");
    console.log("   • Add screenshots to documentation");
    console.log("   • Customize color scheme\n");

    console.log("4️⃣  Package for CodeCanyon:");
    console.log("   • Include all PHP source files");
    console.log("   • Add Documentation.pdf");
    console.log("   • Add LICENSE.txt");
    console.log("   • Create ZIP file\n");

    console.log("5️⃣  Upload to marketplace:");
    console.log("   • CodeCanyon: https://codecanyon.net/");
    console.log("   • ThemeForest: https://themeforest.net/\n");

    console.log(
      "╔═══════════════════════════════════════════════════════════╗"
    );
    console.log(
      "║              ✅ TEST COMPLETED SUCCESSFULLY ✅            ║"
    );
    console.log(
      "╚═══════════════════════════════════════════════════════════╝\n"
    );
  } catch (error) {
    console.error("\n❌ Error:", error.message);
    console.error("\nStack trace:", error.stack);
    process.exit(1);
  }
}

// Run test
testSalesDocumentation();
