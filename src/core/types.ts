/**
 * Core types for deep code analysis across all programming languages
 */

export interface DeepAnalysis {
  language: string;
  files: FileAnalysis[];
  summary: AnalysisSummary;
}

export interface FileAnalysis {
  path: string;
  classes: ClassInfo[];
  functions: FunctionInfo[];
  interfaces: InterfaceInfo[];
  enums: EnumInfo[];
  traits?: TraitInfo[]; // PHP-specific
  typeAliases: TypeAliasInfo[]; // Changed from 'types' to 'typeAliases'
  exports: ExportInfo[];
  imports: ImportInfo[];
  frameworkInfo?: FrameworkInfo; // Framework detection (PHP)
  documentation: {
    hasDocumentation: boolean;
    documentedSymbols: number;
    totalSymbols: number;
    coverage: number;
  };
}

export interface ClassInfo {
  name: string;
  documentation?: string;
  isExported: boolean;
  isAbstract?: boolean;
  extendsClass?: string; // Changed from 'extends'
  implementsInterfaces?: string[]; // Changed from 'implements'
  attributes?: AttributeInfo[]; // PHP 8.0+ attributes
  frameworkInfo?: ClassFrameworkInfo; // Framework pattern detection (PHP)
  routes?: RouteInfo[]; // Controller routes (PHP)
  middleware?: MiddlewareInfo[]; // Class-level middleware (PHP)
  properties: PropertyInfo[];
  methods: MethodInfo[];
  constructors: ConstructorInfo[];
  location: Location;
}

export interface InterfaceInfo {
  name: string;
  documentation?: string;
  isExported: boolean;
  extendsInterfaces?: string[]; // Changed from 'extends'
  properties: PropertyInfo[];
  methods: MethodInfo[];
  location: Location;
}

export interface FunctionInfo {
  name: string;
  documentation?: string;
  isExported: boolean;
  isAsync: boolean;
  parameters: ParameterInfo[];
  returnType?: string;
  location: Location;
}

export interface MethodInfo {
  name: string;
  documentation?: string;
  visibility?: "public" | "private" | "protected"; // Add visibility
  isStatic?: boolean; // Make optional
  isAsync?: boolean; // Make optional
  isAbstract?: boolean;
  isOptional?: boolean; // Add optional flag
  parameters: ParameterInfo[];
  returnType?: string;
  location?: Location; // Make optional
}

export interface ConstructorInfo {
  documentation?: string;
  parameters: ParameterInfo[];
  location: Location;
}

export interface PropertyInfo {
  name: string;
  documentation?: string;
  type?: string;
  visibility?: "public" | "private" | "protected"; // Add visibility
  isStatic?: boolean; // Make optional
  isReadonly?: boolean;
  isOptional?: boolean; // Add optional flag
  location?: Location; // Make location optional for property signatures
}

export interface ParameterInfo {
  name: string;
  type?: string;
  isOptional: boolean;
  defaultValue?: string;
}

export interface EnumInfo {
  name: string;
  documentation?: string;
  isExported: boolean;
  backingType?: string; // PHP 8.1+ backed enums
  members: EnumMemberInfo[];
  cases?: EnumMemberInfo[]; // Alias for members (PHP compatibility)
  methods?: MethodInfo[]; // PHP enums can have methods
  location: Location;
}

export interface EnumMemberInfo {
  name: string;
  value?: string | number;
  documentation?: string;
  location?: Location;
}

export interface TypeAliasInfo {
  name: string;
  documentation?: string;
  isExported: boolean;
  type: string;
  location: Location;
}

export interface ExportInfo {
  exportedNames: string[];
  isNamespaceExport: boolean;
  moduleSpecifier?: string; // For re-exports
}

export interface ImportInfo {
  importedNames: string[];
  defaultImport?: string;
  namespaceImport?: string;
  moduleSpecifier: string;
}

export interface Location {
  startLine: number;
  startColumn: number;
  endLine: number;
  endColumn: number;
}

export interface TraitInfo {
  name: string;
  documentation?: string;
  isExported: boolean;
  properties: PropertyInfo[];
  methods: MethodInfo[];
  location: Location;
}

export interface AttributeInfo {
  name: string;
  arguments?: string;
}

export interface FrameworkInfo {
  detected: boolean;
  name: string | null;
  controllers: number;
  models: number;
  other: number;
}

export interface ClassFrameworkInfo {
  framework: string | null;
  type: string | null;
  isMVC: boolean;
}

/**
 * Route parameter information
 */
export interface RouteParameter {
  name: string;
  type: string | null;
  required: boolean;
  defaultValue?: string;
}

/**
 * Middleware information
 */
export interface MiddlewareInfo {
  name: string; // Middleware name (e.g., "auth", "throttle")
  parameters: string[]; // Middleware parameters (e.g., ["admin"], ["60,1"])
  priority?: number; // Execution priority
  source: string; // "attribute" | "docblock" | "property"
}

/**
 * Route information for controller methods
 */
export interface RouteInfo {
  method: string; // Method name (e.g., "index", "show")
  httpMethods: string[]; // HTTP methods (e.g., ["GET"], ["POST", "PUT"])
  path: string; // Route path (e.g., "/users", "/users/{id}")
  parameters: RouteParameter[];
  middleware: MiddlewareInfo[]; // Applied middleware
  visibility: string; // "public", "protected", "private"
  isRoute: boolean; // Whether this is actually a route
}

export interface AnalysisSummary {
  totalFiles: number;
  totalClasses: number;
  totalInterfaces: number;
  totalFunctions: number;
  totalEnums: number;
  totalTypeAliases: number; // Changed from 'totalTypes'
  overallDocCoverage: number; // Changed from 'documentationCoverage'
}
