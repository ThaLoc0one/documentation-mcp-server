/**
 * Abstract base class for language-specific code analyzers
 */

import { DeepAnalysis, FileAnalysis } from "./types.js";

export abstract class CodeAnalyzer {
  protected projectPath: string;
  protected files: string[];

  constructor(projectPath: string, files: string[]) {
    this.projectPath = projectPath;
    this.files = files;
  }

  /**
   * Analyze all files and return deep analysis
   */
  abstract analyze(): Promise<DeepAnalysis>;

  /**
   * Analyze a single file
   */
  abstract analyzeFile(filePath: string): Promise<FileAnalysis | null>;

  /**
   * Check if this analyzer can handle the given file
   */
  abstract canAnalyze(filePath: string): boolean;

  /**
   * Get the language name
   */
  abstract getLanguage(): string;
}

/**
 * Factory to create appropriate analyzer for detected language
 */
export async function createAnalyzer(
  language: string,
  projectPath: string,
  files: string[]
): Promise<CodeAnalyzer | null> {
  switch (language) {
    case "typescript":
    case "javascript":
      const { TypeScriptAnalyzer } = await import(
        "../analyzers/typescript.js"
      );
      return new TypeScriptAnalyzer(projectPath, files);

    case "python":
      const { PythonAnalyzer } = await import("../analyzers/python.js");
      return new PythonAnalyzer(projectPath, files);

    case "go":
      const { GoAnalyzer } = await import("../analyzers/go.js");
      return new GoAnalyzer(projectPath, files);

    case "php":
      const { PhpAnalyzer } = await import("../analyzers/php.js");
      return new PhpAnalyzer(projectPath, files);

    // Future analyzers:
    // case "rust":
    //   const { RustAnalyzer } = await import("../analyzers/rust.js");
    //   return new RustAnalyzer(projectPath, files);

    default:
      return null; // Fallback to shallow analysis
  }
}
