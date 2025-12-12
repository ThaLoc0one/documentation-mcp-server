/**
 * Go deep code analyzer using Go's native parser and AST
 */

import { spawn } from "child_process";
import * as path from "path";
import { CodeAnalyzer } from "../core/analyzer.js";
import { DeepAnalysis, FileAnalysis, AnalysisSummary } from "../core/types.js";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class GoAnalyzer extends CodeAnalyzer {
  private goHelperPath: string;

  constructor(projectPath: string, files: string[]) {
    super(projectPath, files);
    // Use path relative to source directory
    this.goHelperPath = path.resolve(
      __dirname,
      "..",
      "..",
      "src",
      "analyzers",
      "helpers",
      "go_analyzer.go"
    );
  }

  canAnalyze(filePath: string): boolean {
    const ext = path.extname(filePath).toLowerCase();
    return ext === ".go";
  }

  getLanguage(): string {
    return "go";
  }

  async analyze(): Promise<DeepAnalysis> {
    const fileAnalyses: FileAnalysis[] = [];

    for (const file of this.files) {
      if (this.canAnalyze(file)) {
        const analysis = await this.analyzeFile(file);
        if (analysis) {
          fileAnalyses.push(analysis);
        }
      }
    }

    return {
      language: "go",
      files: fileAnalyses,
      summary: this.generateSummary(fileAnalyses),
    };
  }

  async analyzeFile(filePath: string): Promise<FileAnalysis | null> {
    try {
      const absolutePath = path.isAbsolute(filePath)
        ? filePath
        : path.join(this.projectPath, filePath);

      const result = await this.runGoAnalyzer(absolutePath);

      if (result.error) {
        console.error(`Error analyzing ${filePath}: ${result.error}`);
        return null;
      }

      return result as FileAnalysis;
    } catch (error) {
      console.error(`Error analyzing ${filePath}:`, error);
      return null;
    }
  }

  private runGoAnalyzer(filePath: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const goRun = spawn("go", ["run", this.goHelperPath, filePath]);

      let stdout = "";
      let stderr = "";

      goRun.stdout.on("data", (data) => {
        stdout += data.toString();
      });

      goRun.stderr.on("data", (data) => {
        stderr += data.toString();
      });

      goRun.on("close", (code) => {
        if (code !== 0) {
          reject(new Error(`Go process exited with code ${code}: ${stderr}`));
          return;
        }

        try {
          const result = JSON.parse(stdout);
          resolve(result);
        } catch (error) {
          reject(new Error(`Failed to parse Go analyzer output: ${error}`));
        }
      });

      goRun.on("error", (error) => {
        reject(new Error(`Failed to start Go process: ${error.message}`));
      });
    });
  }

  private generateSummary(fileAnalyses: FileAnalysis[]): AnalysisSummary {
    const summary: AnalysisSummary = {
      totalFiles: fileAnalyses.length,
      totalClasses: 0,
      totalInterfaces: 0,
      totalFunctions: 0,
      totalEnums: 0,
      totalTypeAliases: 0,
      overallDocCoverage: 0,
    };

    let totalSymbols = 0;
    let documentedSymbols = 0;

    fileAnalyses.forEach((file) => {
      summary.totalClasses += file.classes.length;
      summary.totalInterfaces += file.interfaces.length;
      summary.totalFunctions += file.functions.length;
      summary.totalEnums += file.enums.length;
      summary.totalTypeAliases += file.typeAliases.length;

      totalSymbols += file.documentation.totalSymbols;
      documentedSymbols += file.documentation.documentedSymbols;
    });

    summary.overallDocCoverage =
      totalSymbols > 0 ? (documentedSymbols / totalSymbols) * 100 : 0;

    return summary;
  }
}
