import { execSync } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log("Testing Multi-Language Deep Analysis...\n");

// Test mixed-language project
const testMixedDir = path.join(__dirname, "test-mixed-project");

console.log("=== Multi-Language Analysis ===");
console.log(`Project: ${testMixedDir}\n`);

try {
  const result = execSync(
    `node dist/index.js docs_analyze_project '${JSON.stringify({
      projectPath: testMixedDir,
      deep: true,
    })}'`,
    { encoding: "utf-8", maxBuffer: 10 * 1024 * 1024 }
  );

  const analysis = JSON.parse(result);

  if (analysis.content && analysis.content[0]) {
    const content = JSON.parse(analysis.content[0].text);

    console.log("Multi-Language Analysis Results:");

    if (content.multiLanguageAnalysis) {
      console.log("\n🌍 MULTI-LANGUAGE PROJECT DETECTED\n");

      for (const [lang, langAnalysis] of Object.entries(
        content.multiLanguageAnalysis
      )) {
        console.log(`\n--- ${lang.toUpperCase()} ---`);
        console.log(`Files: ${langAnalysis.summary.totalFiles}`);
        console.log(`Classes: ${langAnalysis.summary.totalClasses}`);
        console.log(`Functions: ${langAnalysis.summary.totalFunctions}`);
        console.log(`Interfaces: ${langAnalysis.summary.totalInterfaces}`);
        console.log(
          `Doc Coverage: ${langAnalysis.summary.overallDocCoverage.toFixed(2)}%`
        );
      }

      console.log("\n✅ Multi-language analysis completed successfully!");
    } else if (content.deepAnalysis) {
      console.log("\n📝 SINGLE-LANGUAGE PROJECT\n");
      console.log(`Language: ${content.deepAnalysis.language}`);
      console.log(`Files: ${content.deepAnalysis.summary.totalFiles}`);
      console.log(`Classes: ${content.deepAnalysis.summary.totalClasses}`);
      console.log(`Functions: ${content.deepAnalysis.summary.totalFunctions}`);
      console.log(
        `Doc Coverage: ${content.deepAnalysis.summary.overallDocCoverage.toFixed(
          2
        )}%`
      );
    }
  }
} catch (error) {
  console.error("❌ Multi-language analysis failed:", error.message);
  if (error.stdout) console.log("stdout:", error.stdout);
  if (error.stderr) console.log("stderr:", error.stderr);
}
