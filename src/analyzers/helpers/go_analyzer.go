package main

import (
	"encoding/json"
	"fmt"
	"go/ast"
	"go/parser"
	"go/token"
	"os"
	"strings"
)

type Location struct {
	StartLine   int `json:"startLine"`
	StartColumn int `json:"startColumn"`
	EndLine     int `json:"endLine"`
	EndColumn   int `json:"endColumn"`
}

type ParameterInfo struct {
	Name         string  `json:"name"`
	Type         *string `json:"type"`
	IsOptional   bool    `json:"isOptional"`
	DefaultValue *string `json:"defaultValue"`
}

type PropertyInfo struct {
	Name         string   `json:"name"`
	Type         *string  `json:"type"`
	Documentation *string `json:"documentation,omitempty"`
	Location     Location `json:"location"`
	IsExported   bool     `json:"isExported"`
}

type MethodInfo struct {
	Name          string          `json:"name"`
	Documentation *string         `json:"documentation,omitempty"`
	Location      Location        `json:"location"`
	IsExported    bool            `json:"isExported"`
	Parameters    []ParameterInfo `json:"parameters"`
	ReturnType    *string         `json:"returnType"`
	ReceiverType  *string         `json:"receiverType,omitempty"`
}

type FunctionInfo struct {
	Name          string          `json:"name"`
	Documentation *string         `json:"documentation,omitempty"`
	Location      Location        `json:"location"`
	IsExported    bool            `json:"isExported"`
	Parameters    []ParameterInfo `json:"parameters"`
	ReturnType    *string         `json:"returnType"`
}

type StructInfo struct {
	Name          string         `json:"name"`
	Documentation *string        `json:"documentation,omitempty"`
	Location      Location       `json:"location"`
	IsExported    bool           `json:"isExported"`
	Fields        []PropertyInfo `json:"properties"`
	Methods       []MethodInfo   `json:"methods"`
}

type InterfaceInfo struct {
	Name          string       `json:"name"`
	Documentation *string      `json:"documentation,omitempty"`
	Location      Location     `json:"location"`
	IsExported    bool         `json:"isExported"`
	Methods       []MethodInfo `json:"methods"`
}

type ImportInfo struct {
	ImportedNames   []string `json:"importedNames"`
	ModuleSpecifier string   `json:"moduleSpecifier"`
}

type DocumentationInfo struct {
	HasDocumentation  bool    `json:"hasDocumentation"`
	DocumentedSymbols int     `json:"documentedSymbols"`
	TotalSymbols      int     `json:"totalSymbols"`
	Coverage          float64 `json:"coverage"`
}

type FileAnalysis struct {
	Path          string            `json:"path"`
	Classes       []StructInfo      `json:"classes"`
	Functions     []FunctionInfo    `json:"functions"`
	Interfaces    []InterfaceInfo   `json:"interfaces"`
	Enums         []interface{}     `json:"enums"`
	TypeAliases   []interface{}     `json:"typeAliases"`
	Imports       []ImportInfo      `json:"imports"`
	Exports       []interface{}     `json:"exports"`
	Documentation DocumentationInfo `json:"documentation"`
}

type Analyzer struct {
	fset          *token.FileSet
	file          *ast.File
	filePath      string
	structs       []StructInfo
	functions     []FunctionInfo
	interfaces    []InterfaceInfo
	imports       []ImportInfo
	methods       map[string][]MethodInfo
	totalSymbols  int
	docedSymbols  int
}

func NewAnalyzer(filePath string) *Analyzer {
	return &Analyzer{
		fset:     token.NewFileSet(),
		filePath: filePath,
		methods:  make(map[string][]MethodInfo),
	}
}

func (a *Analyzer) getLocation(node ast.Node) Location {
	start := a.fset.Position(node.Pos())
	end := a.fset.Position(node.End())
	return Location{
		StartLine:   start.Line,
		StartColumn: start.Column,
		EndLine:     end.Line,
		EndColumn:   end.Column,
	}
}

func (a *Analyzer) getDocumentation(doc *ast.CommentGroup) *string {
	if doc == nil {
		return nil
	}
	text := doc.Text()
	if text == "" {
		return nil
	}
	trimmed := strings.TrimSpace(text)
	return &trimmed
}

func (a *Analyzer) isExported(name string) bool {
	if len(name) == 0 {
		return false
	}
	return ast.IsExported(name)
}

func (a *Analyzer) extractType(expr ast.Expr) *string {
	if expr == nil {
		return nil
	}
	
	var typeStr string
	switch t := expr.(type) {
	case *ast.Ident:
		typeStr = t.Name
	case *ast.StarExpr:
		if inner := a.extractType(t.X); inner != nil {
			typeStr = "*" + *inner
		}
	case *ast.ArrayType:
		if inner := a.extractType(t.Elt); inner != nil {
			typeStr = "[]" + *inner
		}
	case *ast.MapType:
		key := a.extractType(t.Key)
		val := a.extractType(t.Value)
		if key != nil && val != nil {
			typeStr = "map[" + *key + "]" + *val
		}
	case *ast.SelectorExpr:
		if x, ok := t.X.(*ast.Ident); ok {
			typeStr = x.Name + "." + t.Sel.Name
		}
	case *ast.InterfaceType:
		typeStr = "interface{}"
	case *ast.ChanType:
		if inner := a.extractType(t.Value); inner != nil {
			typeStr = "chan " + *inner
		}
	case *ast.FuncType:
		typeStr = "func"
	default:
		typeStr = "unknown"
	}
	
	return &typeStr
}

func (a *Analyzer) extractParameters(fields *ast.FieldList) []ParameterInfo {
	params := []ParameterInfo{}
	if fields == nil {
		return params
	}
	
	for _, field := range fields.List {
		fieldType := a.extractType(field.Type)
		
		if len(field.Names) == 0 {
			// Unnamed parameter
			params = append(params, ParameterInfo{
				Name:       "_",
				Type:       fieldType,
				IsOptional: false,
			})
		} else {
			for _, name := range field.Names {
				params = append(params, ParameterInfo{
					Name:       name.Name,
					Type:       fieldType,
					IsOptional: false,
				})
			}
		}
	}
	
	return params
}

func (a *Analyzer) extractReturnType(results *ast.FieldList) *string {
	if results == nil || len(results.List) == 0 {
		return nil
	}
	
	if len(results.List) == 1 && len(results.List[0].Names) == 0 {
		return a.extractType(results.List[0].Type)
	}
	
	// Multiple return values
	types := []string{}
	for _, field := range results.List {
		if t := a.extractType(field.Type); t != nil {
			types = append(types, *t)
		}
	}
	combined := "(" + strings.Join(types, ", ") + ")"
	return &combined
}

func (a *Analyzer) analyzeStruct(spec *ast.TypeSpec, doc *ast.CommentGroup) {
	structType, ok := spec.Type.(*ast.StructType)
	if !ok {
		return
	}
	
	structInfo := StructInfo{
		Name:          spec.Name.Name,
		Documentation: a.getDocumentation(doc),
		Location:      a.getLocation(spec),
		IsExported:    a.isExported(spec.Name.Name),
		Fields:        []PropertyInfo{},
		Methods:       []MethodInfo{},
	}
	
	a.totalSymbols++
	if structInfo.Documentation != nil {
		a.docedSymbols++
	}
	
	// Extract fields
	if structType.Fields != nil {
		for _, field := range structType.Fields.List {
			fieldType := a.extractType(field.Type)
			fieldDoc := a.getDocumentation(field.Doc)
			
			if len(field.Names) == 0 {
				// Embedded field
				if fieldType != nil {
					structInfo.Fields = append(structInfo.Fields, PropertyInfo{
						Name:         *fieldType,
						Type:         fieldType,
						Documentation: fieldDoc,
						Location:     a.getLocation(field),
						IsExported:   true,
					})
				}
			} else {
				for _, name := range field.Names {
					structInfo.Fields = append(structInfo.Fields, PropertyInfo{
						Name:         name.Name,
						Type:         fieldType,
						Documentation: fieldDoc,
						Location:     a.getLocation(field),
						IsExported:   a.isExported(name.Name),
					})
				}
			}
		}
	}
	
	a.structs = append(a.structs, structInfo)
}

func (a *Analyzer) analyzeInterface(spec *ast.TypeSpec, doc *ast.CommentGroup) {
	interfaceType, ok := spec.Type.(*ast.InterfaceType)
	if !ok {
		return
	}
	
	interfaceInfo := InterfaceInfo{
		Name:          spec.Name.Name,
		Documentation: a.getDocumentation(doc),
		Location:      a.getLocation(spec),
		IsExported:    a.isExported(spec.Name.Name),
		Methods:       []MethodInfo{},
	}
	
	a.totalSymbols++
	if interfaceInfo.Documentation != nil {
		a.docedSymbols++
	}
	
	// Extract methods
	if interfaceType.Methods != nil {
		for _, method := range interfaceType.Methods.List {
			if len(method.Names) == 0 {
				continue
			}
			
			funcType, ok := method.Type.(*ast.FuncType)
			if !ok {
				continue
			}
			
			for _, name := range method.Names {
				methodInfo := MethodInfo{
					Name:          name.Name,
					Documentation: a.getDocumentation(method.Doc),
					Location:      a.getLocation(method),
					IsExported:    a.isExported(name.Name),
					Parameters:    a.extractParameters(funcType.Params),
					ReturnType:    a.extractReturnType(funcType.Results),
				}
				
				a.totalSymbols++
				if methodInfo.Documentation != nil {
					a.docedSymbols++
				}
				
				interfaceInfo.Methods = append(interfaceInfo.Methods, methodInfo)
			}
		}
	}
	
	a.interfaces = append(a.interfaces, interfaceInfo)
}

func (a *Analyzer) analyzeFunction(decl *ast.FuncDecl) {
	if decl.Recv != nil {
		// This is a method, not a function
		a.analyzeMethod(decl)
		return
	}
	
	funcInfo := FunctionInfo{
		Name:          decl.Name.Name,
		Documentation: a.getDocumentation(decl.Doc),
		Location:      a.getLocation(decl),
		IsExported:    a.isExported(decl.Name.Name),
		Parameters:    a.extractParameters(decl.Type.Params),
		ReturnType:    a.extractReturnType(decl.Type.Results),
	}
	
	a.totalSymbols++
	if funcInfo.Documentation != nil {
		a.docedSymbols++
	}
	
	a.functions = append(a.functions, funcInfo)
}

func (a *Analyzer) analyzeMethod(decl *ast.FuncDecl) {
	if decl.Recv == nil || len(decl.Recv.List) == 0 {
		return
	}
	
	receiverType := a.extractType(decl.Recv.List[0].Type)
	if receiverType == nil {
		return
	}
	
	// Remove * from pointer receivers
	typeName := strings.TrimPrefix(*receiverType, "*")
	
	methodInfo := MethodInfo{
		Name:          decl.Name.Name,
		Documentation: a.getDocumentation(decl.Doc),
		Location:      a.getLocation(decl),
		IsExported:    a.isExported(decl.Name.Name),
		Parameters:    a.extractParameters(decl.Type.Params),
		ReturnType:    a.extractReturnType(decl.Type.Results),
		ReceiverType:  &typeName,
	}
	
	a.totalSymbols++
	if methodInfo.Documentation != nil {
		a.docedSymbols++
	}
	
	a.methods[typeName] = append(a.methods[typeName], methodInfo)
}

func (a *Analyzer) analyzeImports(spec *ast.ImportSpec) {
	path := strings.Trim(spec.Path.Value, `"`)
	
	importInfo := ImportInfo{
		ImportedNames:   []string{},
		ModuleSpecifier: path,
	}
	
	if spec.Name != nil {
		importInfo.ImportedNames = append(importInfo.ImportedNames, spec.Name.Name)
	}
	
	a.imports = append(a.imports, importInfo)
}

func (a *Analyzer) Analyze() (*FileAnalysis, error) {
	file, err := parser.ParseFile(a.fset, a.filePath, nil, parser.ParseComments)
	if err != nil {
		return nil, fmt.Errorf("failed to parse file: %w", err)
	}
	
	a.file = file
	
	// Walk the AST
	ast.Inspect(file, func(n ast.Node) bool {
		switch node := n.(type) {
		case *ast.GenDecl:
			for _, spec := range node.Specs {
				switch s := spec.(type) {
				case *ast.TypeSpec:
					if _, ok := s.Type.(*ast.StructType); ok {
						a.analyzeStruct(s, node.Doc)
					} else if _, ok := s.Type.(*ast.InterfaceType); ok {
						a.analyzeInterface(s, node.Doc)
					}
				case *ast.ImportSpec:
					a.analyzeImports(s)
				}
			}
		case *ast.FuncDecl:
			a.analyzeFunction(node)
		}
		return true
	})
	
	// Attach methods to structs
	for i := range a.structs {
		if methods, ok := a.methods[a.structs[i].Name]; ok {
			a.structs[i].Methods = methods
		}
	}
	
	// Calculate coverage
	coverage := 0.0
	if a.totalSymbols > 0 {
		coverage = float64(a.docedSymbols) / float64(a.totalSymbols) * 100
	}
	
	return &FileAnalysis{
		Path:       a.filePath,
		Classes:    a.structs,
		Functions:  a.functions,
		Interfaces: a.interfaces,
		Enums:      []interface{}{},
		TypeAliases: []interface{}{},
		Imports:    a.imports,
		Exports:    []interface{}{},
		Documentation: DocumentationInfo{
			HasDocumentation:  a.docedSymbols > 0,
			DocumentedSymbols: a.docedSymbols,
			TotalSymbols:      a.totalSymbols,
			Coverage:          coverage,
		},
	}, nil
}

func main() {
	if len(os.Args) < 2 {
		result := map[string]string{"error": "No file path provided"}
		json.NewEncoder(os.Stdout).Encode(result)
		os.Exit(1)
	}
	
	filePath := os.Args[1]
	
	analyzer := NewAnalyzer(filePath)
	result, err := analyzer.Analyze()
	
	if err != nil {
		errorResult := map[string]string{
			"error": err.Error(),
			"path":  filePath,
		}
		json.NewEncoder(os.Stdout).Encode(errorResult)
		os.Exit(1)
	}
	
	json.NewEncoder(os.Stdout).Encode(result)
}
