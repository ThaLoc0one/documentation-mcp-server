import { execSync } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log("Testing PHP Deep Analysis...\n");

// Test PHP analyzer
const testPhpDir = path.join(__dirname, "test-php-project");

console.log("=== PHP Analysis ===");
console.log(`Project: ${testPhpDir}\n`);

try {
  const result = execSync(
    `node dist/index.js docs_analyze_project '${JSON.stringify({
      projectPath: testPhpDir,
      language: "php",
      deep: true,
    })}'`,
    { encoding: "utf-8", maxBuffer: 10 * 1024 * 1024 }
  );

  const analysis = JSON.parse(result);

  if (analysis.content && analysis.content[0]) {
    const content = JSON.parse(analysis.content[0].text);

    console.log("PHP Analysis Results:");
    console.log(
      `- Files analyzed: ${content.deepAnalysis?.summary?.totalFiles || 0}`
    );
    console.log(
      `- Classes found: ${content.deepAnalysis?.summary?.totalClasses || 0}`
    );
    console.log(
      `- Functions found: ${content.deepAnalysis?.summary?.totalFunctions || 0}`
    );
    console.log(
      `- Interfaces found: ${
        content.deepAnalysis?.summary?.totalInterfaces || 0
      }`
    );
    console.log(
      `- Documentation coverage: ${
        content.deepAnalysis?.summary?.overallDocCoverage?.toFixed(2) || 0
      }%`
    );

    if (content.deepAnalysis?.files?.length > 0) {
      console.log("\nFile Details:");
      content.deepAnalysis.files.forEach((file) => {
        console.log(`  ${path.basename(file.path)}:`);
        console.log(`    - Classes: ${file.classes.length}`);
        console.log(`    - Functions: ${file.functions.length}`);
        console.log(
          `    - Coverage: ${file.documentation.coverage.toFixed(2)}%`
        );

        file.classes.forEach((cls) => {
          console.log(`      Class: ${cls.name}`);
          console.log(`        - Methods: ${cls.methods.length}`);
          console.log(`        - Properties: ${cls.properties.length}`);
          console.log(`        - Has docs: ${!!cls.documentation}`);
        });

        file.functions.forEach((func) => {
          console.log(`      Function: ${func.name}()`);
          console.log(`        - Parameters: ${func.parameters.length}`);
          console.log(`        - Has docs: ${!!func.documentation}`);
        });
      });
    }
  }

  console.log("\n✅ PHP Analysis completed successfully!");
} catch (error) {
  console.error("❌ PHP Analysis failed:", error.message);
  if (error.stdout) console.log("stdout:", error.stdout);
  if (error.stderr) console.log("stderr:", error.stderr);
}
