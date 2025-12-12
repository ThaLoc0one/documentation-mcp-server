#!/usr/bin/env node
import { analyzeProject } from "./dist/tools/analyzeProject.js";

async function test() {
  console.log("Testing deep analysis on documentation_MCP project...\n");

  const result = await analyzeProject({
    projectPath: "E:/00000001_TRIXI/documentation_MCP/src",
    deep: true,
  });

  const content = result.content[0].text;
  const analysis = JSON.parse(content);

  console.log("=== Basic Analysis ===");
  console.log(`Language: ${analysis.language}`);
  console.log(`Files: ${analysis.fileCount}`);

  if (analysis.deepAnalysis) {
    console.log("\n=== Deep Analysis Summary ===");
    const summary = analysis.deepAnalysis.summary;
    console.log(`Total Files Analyzed: ${summary.totalFiles}`);
    console.log(`Total Classes: ${summary.totalClasses}`);
    console.log(`Total Interfaces: ${summary.totalInterfaces}`);
    console.log(`Total Functions: ${summary.totalFunctions}`);
    console.log(`Total Enums: ${summary.totalEnums}`);
    console.log(`Total Type Aliases: ${summary.totalTypeAliases}`);
    console.log(
      `Documentation Coverage: ${summary.overallDocCoverage.toFixed(2)}%`
    );

    console.log("\n=== Detailed Example ===");
    const tsAnalyzer = analysis.deepAnalysis.files.find((f) =>
      f.path.includes("typescript.ts")
    );
    if (tsAnalyzer) {
      console.log(`\nFile: ${tsAnalyzer.path}`);
      console.log(`  Classes: ${tsAnalyzer.classes.length}`);
      console.log(`  Interfaces: ${tsAnalyzer.interfaces.length}`);
      console.log(`  Functions: ${tsAnalyzer.functions.length}`);
      console.log(`  Imports: ${tsAnalyzer.imports.length}`);
      console.log(`  Exports: ${tsAnalyzer.exports.length}`);

      if (tsAnalyzer.classes[0]) {
        const cls = tsAnalyzer.classes[0];
        console.log(`\n  Class "${cls.name}":`);
        console.log(`    - Exported: ${cls.isExported}`);
        console.log(
          `    - Location: Lines ${cls.location.startLine}-${cls.location.endLine}`
        );
        console.log(`    - Methods: ${cls.methods.length}`);
        console.log(`    - Constructors: ${cls.constructors.length}`);

        if (cls.methods[0]) {
          const method = cls.methods[0];
          console.log(`\n    Method "${method.name}":`);
          console.log(`      - Async: ${method.isAsync}`);
          console.log(`      - Parameters: ${method.parameters.length}`);
          console.log(`      - Return Type: ${method.returnType || "void"}`);
        }
      }
    }
  } else {
    console.log("\n⚠️ Deep analysis not available");
  }
}

test().catch(console.error);
