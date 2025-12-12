/**
 * TypeScript/JavaScript deep code analyzer using TS Compiler API
 */

import * as ts from "typescript";
import * as fs from "fs";
import * as path from "path";
import { CodeAnalyzer } from "../core/analyzer.js";
import {
  DeepAnalysis,
  FileAnalysis,
  ClassInfo,
  InterfaceInfo,
  FunctionInfo,
  MethodInfo,
  PropertyInfo,
  ParameterInfo,
  EnumInfo,
  TypeAliasInfo,
  ExportInfo,
  ImportInfo,
  Location,
  AnalysisSummary,
  ConstructorInfo,
  EnumMemberInfo,
} from "../core/types.js";

export class TypeScriptAnalyzer extends CodeAnalyzer {
  canAnalyze(filePath: string): boolean {
    const ext = path.extname(filePath).toLowerCase();
    return [".ts", ".tsx", ".js", ".jsx", ".mts", ".mjs"].includes(ext);
  }

  getLanguage(): string {
    return "typescript";
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
      language: "typescript",
      files: fileAnalyses,
      summary: this.generateSummary(fileAnalyses),
    };
  }

  async analyzeFile(filePath: string): Promise<FileAnalysis | null> {
    try {
      const absolutePath = path.isAbsolute(filePath)
        ? filePath
        : path.join(this.projectPath, filePath);

      if (!fs.existsSync(absolutePath)) {
        return null;
      }

      const sourceCode = fs.readFileSync(absolutePath, "utf-8");
      const sourceFile = ts.createSourceFile(
        filePath,
        sourceCode,
        ts.ScriptTarget.Latest,
        true
      );

      const analysis: FileAnalysis = {
        path: filePath,
        classes: [],
        interfaces: [],
        functions: [],
        enums: [],
        typeAliases: [],
        exports: [],
        imports: [],
        documentation: {
          hasDocumentation: false,
          documentedSymbols: 0,
          totalSymbols: 0,
          coverage: 0,
        },
      };

      // Visit all nodes in the AST
      const visit = (node: ts.Node) => {
        // Classes
        if (ts.isClassDeclaration(node) && node.name) {
          analysis.classes.push(this.extractClassInfo(node, sourceFile));
        }

        // Interfaces
        if (ts.isInterfaceDeclaration(node)) {
          analysis.interfaces.push(this.extractInterfaceInfo(node, sourceFile));
        }

        // Functions (top-level)
        if (
          ts.isFunctionDeclaration(node) &&
          node.name &&
          !this.isInsideClassOrInterface(node)
        ) {
          analysis.functions.push(this.extractFunctionInfo(node, sourceFile));
        }

        // Enums
        if (ts.isEnumDeclaration(node)) {
          analysis.enums.push(this.extractEnumInfo(node, sourceFile));
        }

        // Type Aliases
        if (ts.isTypeAliasDeclaration(node)) {
          analysis.typeAliases.push(
            this.extractTypeAliasInfo(node, sourceFile)
          );
        }

        // Exports
        if (ts.isExportDeclaration(node)) {
          analysis.exports.push(this.extractExportInfo(node, sourceFile));
        }

        // Imports
        if (ts.isImportDeclaration(node)) {
          analysis.imports.push(this.extractImportInfo(node, sourceFile));
        }

        ts.forEachChild(node, visit);
      };

      visit(sourceFile);

      // Calculate documentation coverage
      this.calculateDocCoverage(analysis);

      return analysis;
    } catch (error) {
      console.error(`Error analyzing ${filePath}:`, error);
      return null;
    }
  }

  private extractClassInfo(
    node: ts.ClassDeclaration,
    sourceFile: ts.SourceFile
  ): ClassInfo {
    const name = node.name?.getText(sourceFile) || "Anonymous";
    const classInfo: ClassInfo = {
      name,
      location: this.getLocation(node, sourceFile),
      documentation: this.extractDocumentation(node),
      isExported: this.isExported(node),
      isAbstract: this.hasModifier(node, ts.SyntaxKind.AbstractKeyword),
      properties: [],
      methods: [],
      constructors: [],
      extendsClass: node.heritageClauses
        ?.find((c) => c.token === ts.SyntaxKind.ExtendsKeyword)
        ?.types[0]?.getText(sourceFile),
      implementsInterfaces: node.heritageClauses
        ?.find((c) => c.token === ts.SyntaxKind.ImplementsKeyword)
        ?.types.map((t) => t.getText(sourceFile)),
    };

    // Extract members
    node.members.forEach((member) => {
      if (ts.isPropertyDeclaration(member) && member.name) {
        classInfo.properties.push(this.extractPropertyInfo(member, sourceFile));
      } else if (ts.isMethodDeclaration(member) && member.name) {
        classInfo.methods.push(this.extractMethodInfo(member, sourceFile));
      } else if (ts.isConstructorDeclaration(member)) {
        classInfo.constructors.push(
          this.extractConstructorInfo(member, sourceFile)
        );
      }
    });

    return classInfo;
  }

  private extractInterfaceInfo(
    node: ts.InterfaceDeclaration,
    sourceFile: ts.SourceFile
  ): InterfaceInfo {
    const interfaceInfo: InterfaceInfo = {
      name: node.name.getText(sourceFile),
      location: this.getLocation(node, sourceFile),
      documentation: this.extractDocumentation(node),
      isExported: this.isExported(node),
      properties: [],
      methods: [],
      extendsInterfaces: node.heritageClauses?.[0]?.types.map((t) =>
        t.getText(sourceFile)
      ),
    };

    // Extract members
    node.members.forEach((member) => {
      if (ts.isPropertySignature(member) && member.name) {
        interfaceInfo.properties.push(
          this.extractPropertySignature(member, sourceFile)
        );
      } else if (ts.isMethodSignature(member) && member.name) {
        interfaceInfo.methods.push(
          this.extractMethodSignature(member, sourceFile)
        );
      }
    });

    return interfaceInfo;
  }

  private extractFunctionInfo(
    node: ts.FunctionDeclaration,
    sourceFile: ts.SourceFile
  ): FunctionInfo {
    return {
      name: node.name?.getText(sourceFile) || "Anonymous",
      location: this.getLocation(node, sourceFile),
      documentation: this.extractDocumentation(node),
      isExported: this.isExported(node),
      isAsync: this.hasModifier(node, ts.SyntaxKind.AsyncKeyword),
      parameters: node.parameters.map((p) =>
        this.extractParameterInfo(p, sourceFile)
      ),
      returnType: node.type?.getText(sourceFile),
    };
  }

  private extractMethodInfo(
    node: ts.MethodDeclaration,
    sourceFile: ts.SourceFile
  ): MethodInfo {
    return {
      name: node.name.getText(sourceFile),
      location: this.getLocation(node, sourceFile),
      documentation: this.extractDocumentation(node),
      visibility: this.getVisibility(node),
      isStatic: this.hasModifier(node, ts.SyntaxKind.StaticKeyword),
      isAsync: this.hasModifier(node, ts.SyntaxKind.AsyncKeyword),
      isAbstract: this.hasModifier(node, ts.SyntaxKind.AbstractKeyword),
      parameters: node.parameters.map((p) =>
        this.extractParameterInfo(p, sourceFile)
      ),
      returnType: node.type?.getText(sourceFile),
    };
  }

  private extractConstructorInfo(
    node: ts.ConstructorDeclaration,
    sourceFile: ts.SourceFile
  ): ConstructorInfo {
    return {
      location: this.getLocation(node, sourceFile),
      documentation: this.extractDocumentation(node),
      parameters: node.parameters.map((p) =>
        this.extractParameterInfo(p, sourceFile)
      ),
    };
  }

  private extractPropertyInfo(
    node: ts.PropertyDeclaration,
    sourceFile: ts.SourceFile
  ): PropertyInfo {
    return {
      name: node.name.getText(sourceFile),
      location: this.getLocation(node, sourceFile),
      documentation: this.extractDocumentation(node),
      type: node.type?.getText(sourceFile),
      visibility: this.getVisibility(node),
      isStatic: this.hasModifier(node, ts.SyntaxKind.StaticKeyword),
      isReadonly: this.hasModifier(node, ts.SyntaxKind.ReadonlyKeyword),
      isOptional: !!node.questionToken,
    };
  }

  private extractPropertySignature(
    node: ts.PropertySignature,
    sourceFile: ts.SourceFile
  ): PropertyInfo {
    return {
      name: node.name.getText(sourceFile),
      location: this.getLocation(node, sourceFile),
      documentation: this.extractDocumentation(node),
      type: node.type?.getText(sourceFile),
      isReadonly: this.hasModifier(node, ts.SyntaxKind.ReadonlyKeyword),
      isOptional: !!node.questionToken,
    };
  }

  private extractMethodSignature(
    node: ts.MethodSignature,
    sourceFile: ts.SourceFile
  ): MethodInfo {
    return {
      name: node.name.getText(sourceFile),
      location: this.getLocation(node, sourceFile),
      documentation: this.extractDocumentation(node),
      parameters: node.parameters.map((p) =>
        this.extractParameterInfo(p, sourceFile)
      ),
      returnType: node.type?.getText(sourceFile),
      isOptional: !!node.questionToken,
    };
  }

  private extractParameterInfo(
    node: ts.ParameterDeclaration,
    sourceFile: ts.SourceFile
  ): ParameterInfo {
    return {
      name: node.name.getText(sourceFile),
      type: node.type?.getText(sourceFile),
      isOptional: !!node.questionToken || !!node.initializer,
      defaultValue: node.initializer?.getText(sourceFile),
    };
  }

  private extractEnumInfo(
    node: ts.EnumDeclaration,
    sourceFile: ts.SourceFile
  ): EnumInfo {
    return {
      name: node.name.getText(sourceFile),
      location: this.getLocation(node, sourceFile),
      documentation: this.extractDocumentation(node),
      isExported: this.isExported(node),
      members: node.members.map((m) => this.extractEnumMember(m, sourceFile)),
    };
  }

  private extractEnumMember(
    node: ts.EnumMember,
    sourceFile: ts.SourceFile
  ): EnumMemberInfo {
    return {
      name: node.name.getText(sourceFile),
      value: node.initializer?.getText(sourceFile),
      documentation: this.extractDocumentation(node),
    };
  }

  private extractTypeAliasInfo(
    node: ts.TypeAliasDeclaration,
    sourceFile: ts.SourceFile
  ): TypeAliasInfo {
    return {
      name: node.name.getText(sourceFile),
      location: this.getLocation(node, sourceFile),
      documentation: this.extractDocumentation(node),
      isExported: this.isExported(node),
      type: node.type.getText(sourceFile),
    };
  }

  private extractExportInfo(
    node: ts.ExportDeclaration,
    sourceFile: ts.SourceFile
  ): ExportInfo {
    return {
      exportedNames: node.exportClause
        ? ts.isNamedExports(node.exportClause)
          ? node.exportClause.elements.map((e) => e.name.getText(sourceFile))
          : []
        : [],
      isNamespaceExport: node.exportClause
        ? ts.isNamespaceExport(node.exportClause)
        : false,
      moduleSpecifier: node.moduleSpecifier?.getText(sourceFile).slice(1, -1), // Remove quotes
    };
  }

  private extractImportInfo(
    node: ts.ImportDeclaration,
    sourceFile: ts.SourceFile
  ): ImportInfo {
    const importClause = node.importClause;
    return {
      importedNames: importClause?.namedBindings
        ? ts.isNamedImports(importClause.namedBindings)
          ? importClause.namedBindings.elements.map((e) =>
              e.name.getText(sourceFile)
            )
          : []
        : [],
      defaultImport: importClause?.name?.getText(sourceFile),
      namespaceImport:
        importClause?.namedBindings &&
        ts.isNamespaceImport(importClause.namedBindings)
          ? importClause.namedBindings.name.getText(sourceFile)
          : undefined,
      moduleSpecifier: node.moduleSpecifier.getText(sourceFile).slice(1, -1), // Remove quotes
    };
  }

  private extractDocumentation(node: ts.Node): string | undefined {
    const jsDocComments = (node as any).jsDoc as ts.JSDoc[] | undefined;
    if (jsDocComments && jsDocComments.length > 0) {
      return jsDocComments
        .map((doc) => doc.comment?.toString() || "")
        .join("\n")
        .trim();
    }
    return undefined;
  }

  private getLocation(node: ts.Node, sourceFile: ts.SourceFile): Location {
    const start = sourceFile.getLineAndCharacterOfPosition(node.getStart());
    const end = sourceFile.getLineAndCharacterOfPosition(node.getEnd());
    return {
      startLine: start.line + 1,
      startColumn: start.character + 1,
      endLine: end.line + 1,
      endColumn: end.character + 1,
    };
  }

  private isExported(node: ts.Node): boolean {
    return this.hasModifier(node, ts.SyntaxKind.ExportKeyword);
  }

  private hasModifier(node: ts.Node, kind: ts.SyntaxKind): boolean {
    return (
      ts.canHaveModifiers(node) &&
      ts.getModifiers(node)?.some((m) => m.kind === kind) === true
    );
  }

  private getVisibility(
    node: ts.Node
  ): "public" | "private" | "protected" | undefined {
    if (this.hasModifier(node, ts.SyntaxKind.PublicKeyword)) return "public";
    if (this.hasModifier(node, ts.SyntaxKind.PrivateKeyword)) return "private";
    if (this.hasModifier(node, ts.SyntaxKind.ProtectedKeyword))
      return "protected";
    return undefined;
  }

  private isInsideClassOrInterface(node: ts.Node): boolean {
    let parent = node.parent;
    while (parent) {
      if (
        ts.isClassDeclaration(parent) ||
        ts.isInterfaceDeclaration(parent)
      ) {
        return true;
      }
      parent = parent.parent;
    }
    return false;
  }

  private calculateDocCoverage(analysis: FileAnalysis): void {
    let totalSymbols = 0;
    let documentedSymbols = 0;

    const countDoc = (item: { documentation?: string }) => {
      totalSymbols++;
      if (item.documentation) documentedSymbols++;
    };

    analysis.classes.forEach((cls) => {
      countDoc(cls);
      cls.properties.forEach(countDoc);
      cls.methods.forEach(countDoc);
      cls.constructors.forEach(countDoc);
    });

    analysis.interfaces.forEach((iface) => {
      countDoc(iface);
      iface.properties.forEach(countDoc);
      iface.methods.forEach(countDoc);
    });

    analysis.functions.forEach(countDoc);
    analysis.enums.forEach(countDoc);
    analysis.typeAliases.forEach(countDoc);

    analysis.documentation = {
      hasDocumentation: documentedSymbols > 0,
      documentedSymbols,
      totalSymbols,
      coverage:
        totalSymbols > 0 ? (documentedSymbols / totalSymbols) * 100 : 0,
    };
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
