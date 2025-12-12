#!/usr/bin/env node
import { analyzeProject } from "./dist/tools/analyzeProject.js";

async function testGo() {
  console.log("Testing Go deep analysis...\n");

  const result = await analyzeProject({
    projectPath: "E:/00000001_TRIXI/documentation_MCP/test-go-project",
    language: "go",
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
    console.log(`Total Structs: ${summary.totalClasses}`);
    console.log(`Total Interfaces: ${summary.totalInterfaces}`);
    console.log(`Total Functions: ${summary.totalFunctions}`);
    console.log(
      `Documentation Coverage: ${summary.overallDocCoverage.toFixed(2)}%`
    );

    console.log("\n=== Detailed File Analysis ===");
    const file = analysis.deepAnalysis.files[0];
    if (file) {
      console.log(`File: ${file.path}`);
      console.log(`Structs: ${file.classes.length}`);
      console.log(`Interfaces: ${file.interfaces.length}`);
      console.log(`Functions: ${file.functions.length}`);
      console.log(`File Coverage: ${file.documentation.coverage.toFixed(2)}%`);

      if (file.classes.length > 0) {
        console.log("\n=== Structs Details ===");
        file.classes.forEach((cls) => {
          console.log(`\nStruct: ${cls.name}`);
          console.log(`  - Has Doc: ${!!cls.documentation}`);
          console.log(`  - Exported: ${cls.isExported}`);
          console.log(`  - Fields: ${cls.properties.length}`);
          console.log(`  - Methods: ${cls.methods.length}`);

          if (cls.methods.length > 0) {
            console.log(`  - First Method: ${cls.methods[0].name}`);
            console.log(
              `    - Parameters: ${cls.methods[0].parameters.length}`
            );
            console.log(
              `    - Return Type: ${cls.methods[0].returnType || "void"}`
            );
          }
        });
      }

      if (file.interfaces.length > 0) {
        console.log("\n=== Interfaces Details ===");
        file.interfaces.forEach((iface) => {
          console.log(`\nInterface: ${iface.name}`);
          console.log(`  - Has Doc: ${!!iface.documentation}`);
          console.log(`  - Exported: ${iface.isExported}`);
          console.log(`  - Methods: ${iface.methods.length}`);
        });
      }

      if (file.functions.length > 0) {
        console.log("\n=== Functions Details ===");
        file.functions.forEach((func) => {
          console.log(`\nFunction: ${func.name}`);
          console.log(`  - Has Doc: ${!!func.documentation}`);
          console.log(`  - Exported: ${func.isExported}`);
          console.log(`  - Parameters: ${func.parameters.length}`);
          console.log(`  - Return Type: ${func.returnType || "void"}`);
        });
      }
    }
  } else {
    console.log("\n⚠️ Deep analysis not available");
  }
}

testGo().catch(console.error);
