#!/usr/bin/env node
import { analyzeProject } from "./dist/tools/analyzeProject.js";

async function testPython() {
  console.log("Testing Python deep analysis...\n");

  const result = await analyzeProject({
    projectPath: "E:/00000001_TRIXI/documentation_MCP/test-python-project",
    language: "python",
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
    console.log(`Total Functions: ${summary.totalFunctions}`);
    console.log(
      `Documentation Coverage: ${summary.overallDocCoverage.toFixed(2)}%`
    );

    console.log("\n=== Detailed File Analysis ===");
    const file = analysis.deepAnalysis.files[0];
    if (file) {
      console.log(`File: ${file.path}`);
      console.log(`Classes: ${file.classes.length}`);
      console.log(`Functions: ${file.functions.length}`);
      console.log(`File Coverage: ${file.documentation.coverage.toFixed(2)}%`);

      if (file.classes.length > 0) {
        console.log("\n=== Classes Details ===");
        file.classes.forEach((cls) => {
          console.log(`\nClass: ${cls.name}`);
          console.log(`  - Has Docstring: ${!!cls.documentation}`);
          console.log(`  - Methods: ${cls.methods.length}`);
          console.log(`  - Constructors: ${cls.constructors.length}`);
          console.log(
            `  - Base Classes: ${cls.baseClasses?.join(", ") || "None"}`
          );
          console.log(
            `  - Decorators: ${cls.decorators?.join(", ") || "None"}`
          );

          if (cls.methods.length > 0) {
            console.log(`  - First Method: ${cls.methods[0].name}`);
            console.log(`    - Async: ${cls.methods[0].isAsync}`);
            console.log(
              `    - Parameters: ${cls.methods[0].parameters.length}`
            );
            console.log(
              `    - Return Type: ${cls.methods[0].returnType || "None"}`
            );
          }
        });
      }

      if (file.functions.length > 0) {
        console.log("\n=== Functions Details ===");
        file.functions.forEach((func) => {
          console.log(`\nFunction: ${func.name}`);
          console.log(`  - Has Docstring: ${!!func.documentation}`);
          console.log(`  - Async: ${func.isAsync}`);
          console.log(`  - Parameters: ${func.parameters.length}`);
          console.log(`  - Return Type: ${func.returnType || "None"}`);
          console.log(
            `  - Decorators: ${func.decorators?.join(", ") || "None"}`
          );
        });
      }
    }
  } else {
    console.log("\n⚠️ Deep analysis not available");
  }
}

testPython().catch(console.error);
