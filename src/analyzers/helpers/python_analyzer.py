#!/usr/bin/env python3
"""
Python AST Analyzer Helper
Parses Python files and extracts code structure information
"""

import ast
import json
import sys
from typing import List, Dict, Any, Optional


class PythonAnalyzer(ast.NodeVisitor):
    def __init__(self, source_code: str, file_path: str):
        self.source_code = source_code
        self.file_path = file_path
        self.lines = source_code.split('\n')
        
        self.classes = []
        self.functions = []
        self.imports = []
        self.current_class = None
        
    def get_docstring(self, node) -> Optional[str]:
        """Extract docstring from a node"""
        return ast.get_docstring(node)
    
    def get_location(self, node) -> Dict[str, int]:
        """Get location information for a node"""
        return {
            'startLine': node.lineno,
            'startColumn': node.col_offset + 1,
            'endLine': node.end_lineno or node.lineno,
            'endColumn': (node.end_col_offset + 1) if node.end_col_offset is not None else node.col_offset + 1
        }
    
    def get_type_annotation(self, annotation) -> Optional[str]:
        """Convert type annotation to string"""
        if annotation is None:
            return None
        return ast.unparse(annotation)
    
    def extract_decorators(self, node) -> List[str]:
        """Extract decorator names"""
        decorators = []
        for decorator in node.decorator_list:
            if isinstance(decorator, ast.Name):
                decorators.append(decorator.id)
            elif isinstance(decorator, ast.Call) and isinstance(decorator.func, ast.Name):
                decorators.append(decorator.func.id)
            else:
                decorators.append(ast.unparse(decorator))
        return decorators
    
    def extract_parameters(self, args: ast.arguments) -> List[Dict[str, Any]]:
        """Extract function parameters"""
        params = []
        
        # Regular args
        for i, arg in enumerate(args.args):
            param = {
                'name': arg.arg,
                'type': self.get_type_annotation(arg.annotation),
                'isOptional': False,
                'defaultValue': None
            }
            
            # Check if has default value
            defaults_offset = len(args.args) - len(args.defaults)
            if i >= defaults_offset:
                default_idx = i - defaults_offset
                param['isOptional'] = True
                param['defaultValue'] = ast.unparse(args.defaults[default_idx])
            
            params.append(param)
        
        # *args
        if args.vararg:
            params.append({
                'name': f"*{args.vararg.arg}",
                'type': self.get_type_annotation(args.vararg.annotation),
                'isOptional': True,
                'defaultValue': None
            })
        
        # **kwargs
        if args.kwarg:
            params.append({
                'name': f"**{args.kwarg.arg}",
                'type': self.get_type_annotation(args.kwarg.annotation),
                'isOptional': True,
                'defaultValue': None
            })
        
        return params
    
    def visit_ClassDef(self, node: ast.ClassDef):
        """Visit class definition"""
        class_info = {
            'name': node.name,
            'documentation': self.get_docstring(node),
            'isExported': True,  # Python doesn't have export keyword, assume public
            'location': self.get_location(node),
            'decorators': self.extract_decorators(node),
            'baseClasses': [ast.unparse(base) for base in node.bases],
            'methods': [],
            'properties': [],
            'constructors': []
        }
        
        # Save current class context
        prev_class = self.current_class
        self.current_class = class_info
        
        # Visit class body
        for item in node.body:
            if isinstance(item, ast.FunctionDef):
                if item.name == '__init__':
                    # Constructor
                    constructor = {
                        'documentation': self.get_docstring(item),
                        'location': self.get_location(item),
                        'parameters': self.extract_parameters(item.args)[1:]  # Skip 'self'
                    }
                    class_info['constructors'].append(constructor)
                else:
                    # Method
                    method = {
                        'name': item.name,
                        'documentation': self.get_docstring(item),
                        'location': self.get_location(item),
                        'isStatic': any(d.id == 'staticmethod' if isinstance(d, ast.Name) else False 
                                      for d in item.decorator_list),
                        'isAsync': isinstance(item, ast.AsyncFunctionDef),
                        'decorators': self.extract_decorators(item),
                        'parameters': self.extract_parameters(item.args)[1:],  # Skip 'self'
                        'returnType': self.get_type_annotation(item.returns)
                    }
                    class_info['methods'].append(method)
            
            elif isinstance(item, ast.AnnAssign) and isinstance(item.target, ast.Name):
                # Class variable with type annotation
                prop = {
                    'name': item.target.id,
                    'type': self.get_type_annotation(item.annotation),
                    'location': self.get_location(item)
                }
                class_info['properties'].append(prop)
        
        self.classes.append(class_info)
        self.current_class = prev_class
        
        self.generic_visit(node)
    
    def visit_FunctionDef(self, node: ast.FunctionDef):
        """Visit function definition (top-level only)"""
        # Only process top-level functions (not methods)
        if self.current_class is None:
            func_info = {
                'name': node.name,
                'documentation': self.get_docstring(node),
                'isExported': True,  # Assume exported
                'isAsync': isinstance(node, ast.AsyncFunctionDef),
                'decorators': self.extract_decorators(node),
                'location': self.get_location(node),
                'parameters': self.extract_parameters(node.args),
                'returnType': self.get_type_annotation(node.returns)
            }
            self.functions.append(func_info)
        
        self.generic_visit(node)
    
    def visit_AsyncFunctionDef(self, node: ast.AsyncFunctionDef):
        """Visit async function definition"""
        self.visit_FunctionDef(node)
    
    def visit_Import(self, node: ast.Import):
        """Visit import statement"""
        for alias in node.names:
            import_info = {
                'importedNames': [alias.asname or alias.name],
                'moduleSpecifier': alias.name,
                'defaultImport': None,
                'namespaceImport': alias.asname if alias.asname else None
            }
            self.imports.append(import_info)
        
        self.generic_visit(node)
    
    def visit_ImportFrom(self, node: ast.ImportFrom):
        """Visit from...import statement"""
        module = node.module or ''
        import_info = {
            'importedNames': [alias.asname or alias.name for alias in node.names],
            'moduleSpecifier': module,
            'defaultImport': None,
            'namespaceImport': None
        }
        self.imports.append(import_info)
        
        self.generic_visit(node)
    
    def analyze(self) -> Dict[str, Any]:
        """Perform analysis and return results"""
        try:
            tree = ast.parse(self.source_code, filename=self.file_path)
            self.visit(tree)
            
            # Calculate documentation coverage
            total_symbols = len(self.classes) + len(self.functions)
            documented_symbols = 0
            
            for cls in self.classes:
                if cls['documentation']:
                    documented_symbols += 1
                for method in cls['methods']:
                    total_symbols += 1
                    if method['documentation']:
                        documented_symbols += 1
                for constructor in cls['constructors']:
                    total_symbols += 1
                    if constructor['documentation']:
                        documented_symbols += 1
            
            for func in self.functions:
                if func['documentation']:
                    documented_symbols += 1
            
            coverage = (documented_symbols / total_symbols * 100) if total_symbols > 0 else 0
            
            return {
                'path': self.file_path,
                'classes': self.classes,
                'functions': self.functions,
                'interfaces': [],  # Python doesn't have interfaces (use ABC)
                'enums': [],  # Would need separate handling
                'typeAliases': [],  # Would need separate handling
                'imports': self.imports,
                'exports': [],  # Python doesn't have explicit exports
                'documentation': {
                    'hasDocumentation': documented_symbols > 0,
                    'documentedSymbols': documented_symbols,
                    'totalSymbols': total_symbols,
                    'coverage': coverage
                }
            }
        
        except SyntaxError as e:
            return {
                'error': f'Syntax error: {str(e)}',
                'path': self.file_path
            }
        except Exception as e:
            return {
                'error': f'Analysis error: {str(e)}',
                'path': self.file_path
            }


def analyze_file(file_path: str) -> Dict[str, Any]:
    """Analyze a single Python file"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            source_code = f.read()
        
        analyzer = PythonAnalyzer(source_code, file_path)
        return analyzer.analyze()
    
    except FileNotFoundError:
        return {'error': f'File not found: {file_path}', 'path': file_path}
    except Exception as e:
        return {'error': f'Error reading file: {str(e)}', 'path': file_path}


if __name__ == '__main__':
    if len(sys.argv) < 2:
        print(json.dumps({'error': 'No file path provided'}))
        sys.exit(1)
    
    file_path = sys.argv[1]
    result = analyze_file(file_path)
    print(json.dumps(result, indent=2))
