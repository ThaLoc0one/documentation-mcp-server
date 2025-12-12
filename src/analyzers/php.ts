import { CodeAnalyzer } from '../core/analyzer.js';
import { DeepAnalysis, FileAnalysis } from '../core/types.js';
import { spawn } from 'child_process';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * PHP Code Analyzer using native PHP parser
 */
export class PhpAnalyzer extends CodeAnalyzer {
  getLanguage(): string {
    return 'php';
  }

  canAnalyze(filePath: string): boolean {
    return filePath.endsWith('.php');
  }

  async analyze(): Promise<DeepAnalysis> {
    const phpFiles = this.files.filter(f => this.canAnalyze(f));

    const analysisPromises = phpFiles.map(file => 
      this.analyzeFile(file)
    );

    const fileAnalyses = await Promise.all(analysisPromises);

    // Calculate summary from file-level documentation data
    const totalFiles = phpFiles.length;
    const totalClasses = fileAnalyses.reduce((sum, fa) => sum + fa.classes.length, 0);
    const totalInterfaces = fileAnalyses.reduce((sum, fa) => sum + fa.interfaces.length, 0);
    const totalFunctions = fileAnalyses.reduce((sum, fa) => sum + fa.functions.length, 0);
    const totalEnums = fileAnalyses.reduce((sum, fa) => sum + fa.enums.length, 0);
    const totalTypeAliases = fileAnalyses.reduce((sum, fa) => sum + fa.typeAliases.length, 0);
    
    // Use documentation metrics from PHP analyzer (which counts all symbols correctly)
    const totalSymbols = fileAnalyses.reduce((sum, fa) => sum + fa.documentation.totalSymbols, 0);
    const documentedSymbols = fileAnalyses.reduce((sum, fa) => sum + fa.documentation.documentedSymbols, 0);

    return {
      language: this.getLanguage(),
      files: fileAnalyses,
      summary: {
        totalFiles,
        totalClasses,
        totalInterfaces,
        totalFunctions,
        totalEnums,
        totalTypeAliases,
        overallDocCoverage: totalSymbols > 0 ? (documentedSymbols / totalSymbols * 100) : 0
      }
    };
  }

  async analyzeFile(filePath: string): Promise<FileAnalysis> {
    try {
      const result = await runPhpAnalyzer(filePath);
      return result;
    } catch (error) {
      console.error(`Error analyzing PHP file ${filePath}:`, error);
      return {
        path: filePath,
        classes: [],
        functions: [],
        interfaces: [],
        enums: [],
        typeAliases: [],
        imports: [],
        exports: [],
        documentation: {
          hasDocumentation: false,
          documentedSymbols: 0,
          totalSymbols: 0,
          coverage: 0
        }
      };
    }
  }
}

/**
 * Run PHP analyzer helper script
 */
async function runPhpAnalyzer(filePath: string): Promise<FileAnalysis> {
  return new Promise((resolve, reject) => {
    // Try to find PHP executable
    const phpExecutable = process.platform === 'win32' ? 'php.exe' : 'php';
    
    // Choose analyzer: v2 (AST-based) if available, otherwise fallback to v1 (regex-based)
    const useAstAnalyzer = process.env.PHP_USE_AST_ANALYZER !== 'false'; // Default: true
    const analyzerScript = useAstAnalyzer 
      ? path.join(__dirname, 'helpers', 'php_analyzer_v2.php')
      : path.join(__dirname, 'helpers', 'php_analyzer.php');

    const phpProcess = spawn(phpExecutable, [analyzerScript, filePath]);

    let stdout = '';
    let stderr = '';

    phpProcess.stdout.on('data', (data) => {
      stdout += data.toString();
    });

    phpProcess.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    phpProcess.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(`PHP analyzer exited with code ${code}: ${stderr}`));
        return;
      }

      try {
        const result = JSON.parse(stdout);
        
        if (result.error) {
          reject(new Error(`PHP analyzer error: ${result.error}`));
          return;
        }

        resolve(result as FileAnalysis);
      } catch (parseError) {
        reject(new Error(`Failed to parse PHP analyzer output: ${parseError}\nOutput: ${stdout}`));
      }
    });

    phpProcess.on('error', (error) => {
      reject(new Error(`Failed to spawn PHP process: ${error.message}. Make sure PHP is installed and in PATH.`));
    });
  });
}
