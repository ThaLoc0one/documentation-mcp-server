#!/usr/bin/env php
<?php
/**
 * PHP AST Analyzer Helper
 * Parses PHP files using PHP-Parser library
 * 
 * Requires: nikic/php-parser
 * Install: composer require nikic/php-parser
 */

// Simple standalone parser without dependencies
// For production, use nikic/php-parser

function analyzePhpFile($filePath) {
    if (!file_exists($filePath)) {
        return [
            'error' => 'File not found: ' . $filePath,
            'path' => $filePath
        ];
    }

    $code = file_get_contents($filePath);
    
    // Simple regex-based analysis (fallback when php-parser not available)
    $analysis = [
        'path' => $filePath,
        'classes' => extractClasses($code, $filePath),
        'functions' => extractFunctions($code, $filePath),
        'interfaces' => extractInterfaces($code, $filePath),
        'enums' => extractEnums($code, $filePath),
        'traits' => extractTraits($code, $filePath),
        'typeAliases' => [],
        'imports' => extractImports($code),
        'exports' => [],
        'documentation' => [
            'hasDocumentation' => false,
            'documentedSymbols' => 0,
            'totalSymbols' => 0,
            'coverage' => 0
        ]
    ];

    // Calculate documentation coverage
    $totalSymbols = 0;
    $documentedSymbols = 0;

    // Count classes and their members
    foreach ($analysis['classes'] as $class) {
        $totalSymbols++;
        if (!empty($class['documentation'])) {
            $documentedSymbols++;
        }
        
        // Count properties
        foreach ($class['properties'] as $prop) {
            $totalSymbols++;
            if (!empty($prop['documentation'])) {
                $documentedSymbols++;
            }
        }
        
        // Count methods
        foreach ($class['methods'] as $method) {
            $totalSymbols++;
            if (!empty($method['documentation'])) {
                $documentedSymbols++;
            }
        }
        
        // Count constructors
        foreach ($class['constructors'] as $constructor) {
            $totalSymbols++;
            if (!empty($constructor['documentation'])) {
                $documentedSymbols++;
            }
        }
    }

    // Count top-level functions
    foreach ($analysis['functions'] as $func) {
        $totalSymbols++;
        if (!empty($func['documentation'])) {
            $documentedSymbols++;
        }
    }
    
    // Count interfaces
    foreach ($analysis['interfaces'] as $interface) {
        $totalSymbols++;
        if (!empty($interface['documentation'])) {
            $documentedSymbols++;
        }
    }
    
    // Count enums and their cases
    foreach ($analysis['enums'] as $enum) {
        $totalSymbols++;
        if (!empty($enum['documentation'])) {
            $documentedSymbols++;
        }
        foreach ($enum['cases'] as $case) {
            $totalSymbols++;
            if (!empty($case['documentation'])) {
                $documentedSymbols++;
            }
        }
    }
    
    // Count traits and their methods
    foreach ($analysis['traits'] as $trait) {
        $totalSymbols++;
        if (!empty($trait['documentation'])) {
            $documentedSymbols++;
        }
        foreach ($trait['methods'] as $method) {
            $totalSymbols++;
            if (!empty($method['documentation'])) {
                $documentedSymbols++;
            }
        }
    }

    $coverage = $totalSymbols > 0 ? ($documentedSymbols / $totalSymbols * 100) : 0;
    
    $analysis['documentation'] = [
        'hasDocumentation' => $documentedSymbols > 0,
        'documentedSymbols' => $documentedSymbols,
        'totalSymbols' => $totalSymbols,
        'coverage' => $coverage
    ];

    return $analysis;
}

function extractClasses($code, $filePath) {
    $classes = [];
    
    // Match class definitions with optional docblocks and attributes
    // Allows for docblock, then optional attributes (#[...]), then class keyword
    $pattern = '/(?:\/\*\*([^*]*(?:\*(?!\/)[^*]*)*)\*\/\s*)?(?:#\[[^\]]+\]\s*)?(abstract\s+)?class\s+(\w+)(?:\s+extends\s+(\w+))?(?:\s+implements\s+([\w,\s]+))?\s*\{/';
    
    if (preg_match_all($pattern, $code, $matches, PREG_SET_ORDER | PREG_OFFSET_CAPTURE)) {
        foreach ($matches as $match) {
            $className = $match[3][0];
            $doc = isset($match[1]) && $match[1][0] ? trim($match[1][0]) : null;
            $isAbstract = !empty($match[2][0]);
            $extends = isset($match[4]) && $match[4][0] ? $match[4][0] : null;
            $implements = isset($match[5]) && $match[5][0] ? array_map('trim', explode(',', $match[5][0])) : [];
            
            $lineNumber = substr_count(substr($code, 0, $match[0][1]), "\n") + 1;
            
            // Extract the class body
            $classStart = $match[0][1] + strlen($match[0][0]);
            $classBody = extractClassBody($code, $classStart);
            
            $properties = extractClassProperties($classBody, $className);
            $constructors = extractConstructors($classBody, $className);
            
            // Extract promoted properties from constructor and merge with regular properties
            if (!empty($constructors)) {
                $promotedProps = extractPromotedProperties($classBody);
                // Merge and deduplicate: promoted properties take precedence
                $propMap = [];
                foreach ($properties as $prop) {
                    $propMap[$prop['name']] = $prop;
                }
                foreach ($promotedProps as $prop) {
                    $propMap[$prop['name']] = $prop;  // Overwrites if exists
                }
                $properties = array_values($propMap);
            }
            
            $classes[] = [
                'name' => $className,
                'documentation' => $doc,
                'isExported' => true,
                'isAbstract' => $isAbstract,
                'extendsClass' => $extends,
                'implementsInterfaces' => $implements,
                'attributes' => extractAttributes(substr($code, max(0, $match[0][1] - 200), 200)),
                'properties' => $properties,
                'methods' => extractMethods($classBody, $className),
                'constructors' => $constructors,
                'location' => [
                    'startLine' => $lineNumber,
                    'startColumn' => 1,
                    'endLine' => $lineNumber,
                    'endColumn' => 1
                ]
            ];
        }
    }
    
    return $classes;
}

function extractClassBody($code, $startPos) {
    $braceCount = 1;
    $pos = $startPos;
    $length = strlen($code);
    
    while ($pos < $length && $braceCount > 0) {
        $char = $code[$pos];
        if ($char === '{') {
            $braceCount++;
        } elseif ($char === '}') {
            $braceCount--;
        }
        $pos++;
    }
    
    return substr($code, $startPos, $pos - $startPos - 1);
}

function extractClassProperties($code, $className) {
    $properties = [];
    $seenProperties = [];
    
    // Match property declarations (must have visibility or type hint)
    // This excludes $this->property assignments in methods
    $pattern = '/(?:\/\*\*([^*]*(?:\*(?!\/)[^*]*)*)\*\/\s*)?(public|private|protected)\s+(static\s+)?(readonly\s+)?(?:([\w\\\|]+)\s+)?\$(\w+)\s*(?:=|;)/';
    
    if (preg_match_all($pattern, $code, $matches, PREG_SET_ORDER | PREG_OFFSET_CAPTURE)) {
        foreach ($matches as $match) {
            $propName = $match[6][0];
            
            // Skip duplicates
            if (isset($seenProperties[$propName])) {
                continue;
            }
            $seenProperties[$propName] = true;
            
            $doc = isset($match[1]) && $match[1][0] ? trim($match[1][0]) : null;
            $visibility = $match[2][0];
            $isStatic = !empty($match[3][0]);
            $isReadonly = !empty($match[4][0]);
            $type = isset($match[5]) && $match[5][0] ? $match[5][0] : null;
            
            $lineNumber = substr_count(substr($code, 0, $match[0][1]), "\n") + 1;
            
            $properties[] = [
                'name' => $propName,
                'documentation' => $doc,
                'type' => $type,
                'visibility' => $visibility,
                'isStatic' => $isStatic,
                'isReadonly' => $isReadonly,
                'location' => [
                    'startLine' => $lineNumber,
                    'startColumn' => 1,
                    'endLine' => $lineNumber,
                    'endColumn' => 1
                ]
            ];
        }
    }
    
    return $properties;
}

function extractPromotedProperties($code) {
    $properties = [];
    
    // Find constructor
    if (preg_match('/function\s+__construct\s*\((.*?)\)/s', $code, $constructorMatch)) {
        $constructorParams = $constructorMatch[1];
        
        // Match promoted properties with optional inline documentation
        // Pattern: optional /** comment */, visibility, optional readonly, type, $name
        $pattern = '/(?:\/\*\*([^*]*(?:\*(?!\/)[^*]*)*)\*\/\s*)?(public|private|protected)\s+(readonly\s+)?(?:([\w\\\|]+)\s+)?\$(\w+)/';
        
        if (preg_match_all($pattern, $constructorParams, $matches, PREG_SET_ORDER)) {
            foreach ($matches as $match) {
                $doc = isset($match[1]) && $match[1] ? trim($match[1]) : null;
                $visibility = $match[2];
                $isReadonly = !empty($match[3]);
                $type = isset($match[4]) && $match[4] ? $match[4] : null;
                $propName = $match[5];
                
                $properties[] = [
                    'name' => $propName,
                    'documentation' => $doc,
                    'type' => $type,
                    'visibility' => $visibility,
                    'isStatic' => false,
                    'isReadonly' => $isReadonly,
                    'location' => [
                        'startLine' => 4,  // Approximate line in constructor
                        'startColumn' => 1,
                        'endLine' => 4,
                        'endColumn' => 1
                    ]
                ];
            }
        }
    }
    
    return $properties;
}

function extractMethods($code, $className) {
    $methods = [];
    
    // Match method definitions with optional docblocks and attributes
    // Allows for: /** doc */ #[Attribute] visibility function name
    $pattern = '/(?:\/\*\*([^*]*(?:\*(?!\/)[^*]*)*)\*\/\s*)?(?:#\[[^\]]+\]\s*)?(public|private|protected)?\s*(static)?\s*(abstract)?\s*function\s+(\w+)\s*\((.*?)\)\s*(?::\s*([\w\\\|]+))?\s*\{/s';
    
    if (preg_match_all($pattern, $code, $matches, PREG_SET_ORDER | PREG_OFFSET_CAPTURE)) {
        foreach ($matches as $match) {
            $methodName = $match[5][0];
            
            // Skip if constructor (handled separately)
            if ($methodName === '__construct') {
                continue;
            }
            
            $doc = isset($match[1]) && $match[1][0] ? trim($match[1][0]) : null;
            $visibility = isset($match[2]) && $match[2][0] ? $match[2][0] : 'public';
            $isStatic = !empty($match[3][0]);
            $isAbstract = !empty($match[4][0]);
            $params = $match[6][0];
            $returnType = isset($match[7]) && $match[7][0] ? $match[7][0] : null;
            
            $lineNumber = substr_count(substr($code, 0, $match[0][1]), "\n") + 1;
            
            $methods[] = [
                'name' => $methodName,
                'documentation' => $doc,
                'visibility' => $visibility,
                'isStatic' => $isStatic,
                'isAbstract' => $isAbstract,
                'parameters' => parseParameters($params),
                'returnType' => $returnType,
                'location' => [
                    'startLine' => $lineNumber,
                    'startColumn' => 1,
                    'endLine' => $lineNumber,
                    'endColumn' => 1
                ]
            ];
        }
    }
    
    return $methods;
}

function extractConstructors($code, $className) {
    $constructors = [];
    
    // Match constructor
    $pattern = '/(?:\/\*\*([^*]*(?:\*(?!\/)[^*]*)*)\*\/\s*)?(public|private|protected)?\s*function\s+__construct\s*\((.*?)\)/s';
    
    if (preg_match($pattern, $code, $match)) {
        $doc = isset($match[1]) ? trim($match[1]) : null;
        $params = $match[3];
        
        $constructors[] = [
            'documentation' => $doc,
            'parameters' => parseParameters($params),
            'location' => [
                'startLine' => 1,
                'startColumn' => 1,
                'endLine' => 1,
                'endColumn' => 1
            ]
        ];
    }
    
    return $constructors;
}

function removeStructureBodies($code, $structureType) {
    // Match structure declarations (class, enum, trait, interface)
    $pattern = '/\b' . $structureType . '\s+\w+[^{]*\{/';
    
    $result = '';
    $pos = 0;
    
    while (preg_match($pattern, $code, $match, PREG_OFFSET_CAPTURE, $pos)) {
        $matchPos = $match[0][1];
        $matchLen = strlen($match[0][0]);
        
        // Add everything before this match
        $result .= substr($code, $pos, $matchPos - $pos);
        
        // Find the closing brace by counting braces
        $braceCount = 1;
        $i = $matchPos + $matchLen;
        
        while ($i < strlen($code) && $braceCount > 0) {
            if ($code[$i] === '{') {
                $braceCount++;
            } elseif ($code[$i] === '}') {
                $braceCount--;
            }
            $i++;
        }
        
        // Move position past the entire structure
        $pos = $i;
    }
    
    // Add remaining code
    $result .= substr($code, $pos);
    
    return $result;
}

function extractFunctions($code, $filePath) {
    $functions = [];
    
    // Remove all class, enum, trait, and interface bodies to avoid matching methods as functions
    $codeWithoutStructures = $code;
    $codeWithoutStructures = removeStructureBodies($codeWithoutStructures, 'class');
    $codeWithoutStructures = removeStructureBodies($codeWithoutStructures, 'enum');
    $codeWithoutStructures = removeStructureBodies($codeWithoutStructures, 'trait');
    $codeWithoutStructures = removeStructureBodies($codeWithoutStructures, 'interface');
    
    // Match top-level function definitions (outside classes, enums, traits, interfaces)
    $pattern = '/(?:\/\*\*([^*]*(?:\*(?!\/)[^*]*)*)\*\/\s*)?function\s+(\w+)\s*\((.*?)\)\s*(?::\s*([\w\\\|]+))?\s*\{/s';
    
    if (preg_match_all($pattern, $codeWithoutStructures, $matches, PREG_SET_ORDER | PREG_OFFSET_CAPTURE)) {
        foreach ($matches as $match) {
            $funcName = $match[2][0];
            
            // Skip magic methods and constructors
            if (strpos($funcName, '__') === 0) {
                continue;
            }
            
            $doc = isset($match[1]) && $match[1][0] ? trim($match[1][0]) : null;
            $params = $match[3][0];
            $returnType = isset($match[4]) && $match[4][0] ? $match[4][0] : null;
            
            $lineNumber = substr_count(substr($codeWithoutStructures, 0, $match[0][1]), "\n") + 1;
            
            $functions[] = [
                'name' => $funcName,
                'documentation' => $doc,
                'isExported' => true,
                'isAsync' => false,
                'parameters' => parseParameters($params),
                'returnType' => $returnType,
                'location' => [
                    'startLine' => $lineNumber,
                    'startColumn' => 1,
                    'endLine' => $lineNumber,
                    'endColumn' => 1
                ]
            ];
        }
    }
    
    return $functions;
}

function extractInterfaces($code, $filePath) {
    $interfaces = [];
    
    $pattern = '/(?:\/\*\*([^*]*(?:\*(?!\/)[^*]*)*)\*\/\s*)?interface\s+(\w+)(?:\s+extends\s+([\w,\s]+))?\s*\{/';
    
    if (preg_match_all($pattern, $code, $matches, PREG_SET_ORDER | PREG_OFFSET_CAPTURE)) {
        foreach ($matches as $match) {
            $interfaceName = $match[2][0];
            $doc = isset($match[1]) && $match[1][0] ? trim($match[1][0]) : null;
            $extends = isset($match[3]) && $match[3][0] ? array_map('trim', explode(',', $match[3][0])) : [];
            
            $lineNumber = substr_count(substr($code, 0, $match[0][1]), "\n") + 1;
            
            $interfaces[] = [
                'name' => $interfaceName,
                'documentation' => $doc,
                'isExported' => true,
                'extendsInterfaces' => $extends,
                'properties' => [],
                'methods' => [],
                'location' => [
                    'startLine' => $lineNumber,
                    'startColumn' => 1,
                    'endLine' => $lineNumber,
                    'endColumn' => 1
                ]
            ];
        }
    }
    
    return $interfaces;
}

function extractEnums($code, $filePath) {
    $enums = [];
    
    // Match enum definitions (PHP 8.1+) with optional docblocks and attributes
    $pattern = '/(?:\/\*\*([^*]*(?:\*(?!\/)[^*]*)*)\*\/\s*)?(?:#\[[^\]]+\]\s*)?enum\s+(\w+)(?:\s*:\s*(\w+))?\s*\{/';
    
    if (preg_match_all($pattern, $code, $matches, PREG_SET_ORDER | PREG_OFFSET_CAPTURE)) {
        foreach ($matches as $match) {
            $enumName = $match[2][0];
            $doc = isset($match[1]) && $match[1][0] ? trim($match[1][0]) : null;
            $backingType = isset($match[3]) && $match[3][0] ? $match[3][0] : null;
            
            $lineNumber = substr_count(substr($code, 0, $match[0][1]), "\n") + 1;
            
            // Extract enum body
            $enumStart = $match[0][1] + strlen($match[0][0]);
            $enumBody = extractClassBody($code, $enumStart);
            
            $enums[] = [
                'name' => $enumName,
                'documentation' => $doc,
                'isExported' => true,
                'backingType' => $backingType,
                'cases' => extractEnumCases($enumBody),
                'methods' => extractMethods($enumBody, $enumName),
                'location' => [
                    'startLine' => $lineNumber,
                    'startColumn' => 1,
                    'endLine' => $lineNumber,
                    'endColumn' => 1
                ]
            ];
        }
    }
    
    return $enums;
}

function extractEnumCases($code) {
    $cases = [];
    
    // Match enum cases
    $pattern = '/(?:\/\*\*([^*]*(?:\*(?!\/)[^*]*)*)\*\/\s*)?case\s+(\w+)(?:\s*=\s*([^;]+))?;/';
    
    if (preg_match_all($pattern, $code, $matches, PREG_SET_ORDER | PREG_OFFSET_CAPTURE)) {
        foreach ($matches as $match) {
            $caseName = $match[2][0];
            $doc = isset($match[1]) && $match[1][0] ? trim($match[1][0]) : null;
            $value = isset($match[3]) && $match[3][0] ? trim($match[3][0]) : null;
            
            $lineNumber = substr_count(substr($code, 0, $match[0][1]), "\n") + 1;
            
            $cases[] = [
                'name' => $caseName,
                'documentation' => $doc,
                'value' => $value,
                'location' => [
                    'startLine' => $lineNumber,
                    'startColumn' => 1,
                    'endLine' => $lineNumber,
                    'endColumn' => 1
                ]
            ];
        }
    }
    
    return $cases;
}

function extractTraits($code, $filePath) {
    $traits = [];
    
    // Match trait definitions
    $pattern = '/(?:\/\*\*([^*]*(?:\*(?!\/)[^*]*)*)\*\/\s*)?trait\s+(\w+)\s*\{/';
    
    if (preg_match_all($pattern, $code, $matches, PREG_SET_ORDER | PREG_OFFSET_CAPTURE)) {
        foreach ($matches as $match) {
            $traitName = $match[2][0];
            $doc = isset($match[1]) && $match[1][0] ? trim($match[1][0]) : null;
            
            $lineNumber = substr_count(substr($code, 0, $match[0][1]), "\n") + 1;
            
            // Extract trait body
            $traitStart = $match[0][1] + strlen($match[0][0]);
            $traitBody = extractClassBody($code, $traitStart);
            
            $traits[] = [
                'name' => $traitName,
                'documentation' => $doc,
                'isExported' => true,
                'properties' => extractClassProperties($traitBody, $traitName),
                'methods' => extractMethods($traitBody, $traitName),
                'location' => [
                    'startLine' => $lineNumber,
                    'startColumn' => 1,
                    'endLine' => $lineNumber,
                    'endColumn' => 1
                ]
            ];
        }
    }
    
    return $traits;
}

function extractImports($code) {
    $imports = [];
    
    // Match use statements
    $pattern = '/use\s+([\w\\\\]+)(?:\s+as\s+(\w+))?;/';
    
    if (preg_match_all($pattern, $code, $matches, PREG_SET_ORDER)) {
        foreach ($matches as $match) {
            $namespace = $match[1];
            $alias = isset($match[2]) ? $match[2] : null;
            
            $imports[] = [
                'importedNames' => [$alias ?: basename(str_replace('\\', '/', $namespace))],
                'moduleSpecifier' => $namespace,
                'defaultImport' => null,
                'namespaceImport' => $alias
            ];
        }
    }
    
    return $imports;
}

function parseParameters($paramString) {
    $params = [];
    
    if (empty(trim($paramString))) {
        return $params;
    }
    
    // Simple parameter parsing
    $parts = explode(',', $paramString);
    
    foreach ($parts as $part) {
        $part = trim($part);
        
        // Match: type $name = defaultValue
        if (preg_match('/([\w\\\|]+)?\s*\$(\w+)(?:\s*=\s*(.+))?/', $part, $match)) {
            $type = isset($match[1]) && $match[1] ? $match[1] : null;
            $name = $match[2];
            $defaultValue = isset($match[3]) ? trim($match[3]) : null;
            
            $params[] = [
                'name' => $name,
                'type' => $type,
                'isOptional' => $defaultValue !== null,
                'defaultValue' => $defaultValue
            ];
        }
    }
    
    return $params;
}

function extractAttributes($code) {
    $attributes = [];
    
    // Match PHP 8.0+ attributes: #[AttributeName] or #[AttributeName(args)]
    $pattern = '/#\[(\w+)(?:\(([^)]*)\))?\]/';
    
    if (preg_match_all($pattern, $code, $matches, PREG_SET_ORDER)) {
        foreach ($matches as $match) {
            $attributeName = $match[1];
            $args = isset($match[2]) ? trim($match[2]) : null;
            
            $attributes[] = [
                'name' => $attributeName,
                'arguments' => $args
            ];
        }
    }
    
    return $attributes;
}

// Main execution
if ($argc < 2) {
    echo json_encode(['error' => 'No file path provided']);
    exit(1);
}

$filePath = $argv[1];
$result = analyzePhpFile($filePath);

echo json_encode($result, JSON_PRETTY_PRINT);
