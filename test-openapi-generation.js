/**
 * Test OpenAPI generation
 *
 * node test-openapi-generation.js
 */

import { exec } from "child_process";
import { promisify } from "util";
import {
  generateOpenApiSpec,
  exportOpenApiJson,
  exportOpenApiYaml,
} from "./dist/tools/generateOpenApi.js";
import { writeFile } from "fs/promises";

const execAsync = promisify(exec);

async function analyzePhpFile(filePath) {
  const { stdout } = await execAsync(
    `php src/analyzers/helpers/php_analyzer_v2.php ${filePath}`
  );
  return JSON.parse(stdout);
}

async function testOpenApiGeneration() {
  console.log("🔍 Analyzing PHP files...\n");

  // Analyze test files
  const files = [
    "test-php-project/CodeIgniterExample.php",
    "test-php-project/LaravelRoutesExample.php",
    "test-php-project/MiddlewareExample.php",
  ];

  const analyses = [];

  for (const file of files) {
    console.log(`   Analyzing: ${file}`);
    const analysis = await analyzePhpFile(file);
    analyses.push(analysis);
  }

  console.log(`\n✅ Analyzed ${analyses.length} files\n`);

  // Generate OpenAPI spec
  console.log("📝 Generating OpenAPI specification...\n");

  const spec = generateOpenApiSpec(analyses, {
    title: "PHP Framework API Documentation",
    version: "1.0.0",
    description:
      "Auto-generated API documentation from CodeIgniter, Laravel, and Symfony controllers",
    serverUrl: "https://api.example.com/v1",
  });

  // Stats
  const pathCount = Object.keys(spec.paths).length;
  const securityCount = spec.components?.securitySchemes
    ? Object.keys(spec.components.securitySchemes).length
    : 0;

  console.log("📊 Statistics:");
  console.log(`   - Total Paths: ${pathCount}`);
  console.log(`   - Security Schemes: ${securityCount}`);
  console.log(`   - Frameworks: CodeIgniter 3/4, Laravel, Symfony\n`);

  // Export JSON
  const json = exportOpenApiJson(spec);
  await writeFile("./openapi.json", json, "utf-8");
  console.log("✅ JSON exported: ./openapi.json");

  // Export YAML
  const yaml = exportOpenApiYaml(spec);
  await writeFile("./openapi.yaml", yaml, "utf-8");
  console.log("✅ YAML exported: ./openapi.yaml\n");

  // Show sample paths
  console.log("🚀 Sample Paths:\n");
  const samplePaths = Object.entries(spec.paths).slice(0, 5);
  for (const [path, methods] of samplePaths) {
    const methodList = Object.keys(methods)
      .map((m) => m.toUpperCase())
      .join(", ");
    console.log(`   ${methodList.padEnd(30)} ${path}`);
  }

  if (pathCount > 5) {
    console.log(`   ... and ${pathCount - 5} more paths`);
  }

  console.log("\n🔒 Security Schemes:\n");
  if (spec.components?.securitySchemes) {
    for (const [name, scheme] of Object.entries(
      spec.components.securitySchemes
    )) {
      console.log(
        `   - ${name}: ${scheme.type} (${
          scheme.scheme || scheme.in || "custom"
        })`
      );
    }
  } else {
    console.log("   No security schemes detected");
  }

  console.log("\n✅ OpenAPI generation completed!\n");
}

testOpenApiGeneration().catch(console.error);
