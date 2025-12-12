import { promises as fs } from "fs";
import path from "path";
import { createAnalyzer } from "../core/analyzer.js";
import { DeepAnalysis } from "../core/types.js";

interface AnalyzeProjectArgs {
  projectPath: string;
  language?: string;
  deep?: boolean; // Enable deep code analysis
}

export async function analyzeProject(args: any) {
  const { projectPath, language, deep = true } = args as AnalyzeProjectArgs;

  try {
    const stats = await fs.stat(projectPath);
    if (!stats.isDirectory()) {
      throw new Error("projectPath must be a directory");
    }

    const files = await scanDirectory(projectPath);
    const detectedLanguage = language || detectLanguage(files);
    const allLanguages = detectLanguages(files);

    // Perform deep analysis if enabled and analyzer available
    let deepAnalysis: DeepAnalysis | null = null;
    const languageAnalyses: Record<string, DeepAnalysis> = {};

    if (deep) {
      // If specific language provided, analyze only that
      if (language) {
        const analyzer = await createAnalyzer(detectedLanguage, projectPath, files);
        if (analyzer) {
          console.log(`Performing deep analysis with ${analyzer.getLanguage()} analyzer...`);
          deepAnalysis = await analyzer.analyze();
        }
      } else {
        // Multi-language: Analyze all detected languages
        console.log(`Detected languages: ${allLanguages.join(", ")}`);
        
        for (const lang of allLanguages) {
          const analyzer = await createAnalyzer(lang, projectPath, files);
          if (analyzer) {
            console.log(`Analyzing ${lang} files...`);
            const analysis = await analyzer.analyze();
            if (analysis.files.length > 0) {
              languageAnalyses[lang] = analysis;
            }
          }
        }

        // Use primary language or merge results
        if (Object.keys(languageAnalyses).length > 0) {
          if (languageAnalyses[detectedLanguage]) {
            deepAnalysis = languageAnalyses[detectedLanguage];
          } else {
            // Use first available
            deepAnalysis = Object.values(languageAnalyses)[0];
          }
        }
      }
    }

    const analysis = {
      path: projectPath,
      language: detectedLanguage,
      languages: allLanguages, // All detected languages
      fileCount: files.length,
      structure: buildStructureTree(files, projectPath),
      suggestions: generateSuggestions(files, detectedLanguage),
      deepAnalysis, // Primary language deep analysis
      multiLanguageAnalysis: Object.keys(languageAnalyses).length > 1 ? languageAnalyses : undefined,
    };

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(analysis, null, 2),
        },
      ],
    };
  } catch (error) {
    throw new Error(`Failed to analyze project: ${error}`);
  }
}

async function scanDirectory(dir: string): Promise<string[]> {
  const files: string[] = [];
  const items = await fs.readdir(dir, { withFileTypes: true });

  for (const item of items) {
    const fullPath = path.join(dir, item.name);
    
    if (item.name === "node_modules" || item.name === ".git" || item.name === "dist") {
      continue;
    }

    if (item.isDirectory()) {
      files.push(...(await scanDirectory(fullPath)));
    } else {
      files.push(fullPath);
    }
  }

  return files;
}

function detectLanguage(files: string[]): string {
  const extensions = files.map((f) => path.extname(f).toLowerCase());
  const counts: Record<string, number> = {};

  for (const ext of extensions) {
    counts[ext] = (counts[ext] || 0) + 1;
  }

  const langMap: Record<string, string> = {
    ".ts": "typescript",
    ".tsx": "typescript",
    ".js": "javascript",
    ".jsx": "javascript",
    ".py": "python",
    ".go": "go",
    ".rs": "rust",
    ".java": "java",
    ".cs": "csharp",
    ".php": "php",
  };

  let maxCount = 0;
  let dominantExt = "";

  for (const [ext, count] of Object.entries(counts)) {
    if (count > maxCount) {
      maxCount = count;
      dominantExt = ext;
    }
  }

  return langMap[dominantExt] || "unknown";
}

function detectLanguages(files: string[]): string[] {
  const extensions = files.map((f) => path.extname(f).toLowerCase());
  const counts: Record<string, number> = {};

  for (const ext of extensions) {
    counts[ext] = (counts[ext] || 0) + 1;
  }

  const langMap: Record<string, string> = {
    ".ts": "typescript",
    ".tsx": "typescript",
    ".js": "javascript",
    ".jsx": "javascript",
    ".py": "python",
    ".go": "go",
    ".rs": "rust",
    ".java": "java",
    ".cs": "csharp",
    ".php": "php",
  };

  const detectedLanguages = new Set<string>();
  
  for (const ext of Object.keys(counts)) {
    if (langMap[ext]) {
      detectedLanguages.add(langMap[ext]);
    }
  }

  return Array.from(detectedLanguages);
}

function buildStructureTree(files: string[], basePath: string): any {
  const tree: any = {};

  for (const file of files) {
    const relativePath = path.relative(basePath, file);
    const parts = relativePath.split(path.sep);
    let current = tree;

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      if (i === parts.length - 1) {
        if (!current.files) current.files = [];
        current.files.push(part);
      } else {
        if (!current[part]) current[part] = {};
        current = current[part];
      }
    }
  }

  return tree;
}

function generateSuggestions(files: string[], language?: string): string[] {
  const suggestions: string[] = [];
  const hasReadme = files.some((f) => path.basename(f).toLowerCase() === "readme.md");
  const hasPackageJson = files.some((f) => path.basename(f) === "package.json");
  const hasPyProject = files.some((f) => path.basename(f) === "pyproject.toml");

  if (!hasReadme) {
    suggestions.push("Consider adding a README.md file");
  }

  if (language === "typescript" || language === "javascript") {
    suggestions.push("Recommended framework: Docusaurus");
    if (hasPackageJson) {
      suggestions.push("Use JSDoc comments for API documentation");
    }
  } else if (language === "python") {
    suggestions.push("Recommended framework: MkDocs or Sphinx");
    suggestions.push("Use docstrings for API documentation");
  }

  return suggestions;
}
