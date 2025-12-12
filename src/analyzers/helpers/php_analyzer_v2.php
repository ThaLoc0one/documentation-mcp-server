#!/usr/bin/env php
<?php
/**
 * PHP AST Analyzer v2 with nikic/php-parser
 * 
 * Provides accurate AST-based code analysis for PHP files
 * with full support for PHP 8+ features
 */

require_once __DIR__ . '/vendor/autoload.php';

use PhpParser\Error;
use PhpParser\NodeDumper;
use PhpParser\ParserFactory;
use PhpParser\Node;
use PhpParser\NodeTraverser;
use PhpParser\NodeVisitorAbstract;
use PhpParser\Comment\Doc;

/**
 * Visitor to extract all code symbols from PHP AST
 */
class SymbolExtractor extends NodeVisitorAbstract {
    public array $classes = [];
    public array $interfaces = [];
    public array $traits = [];
    public array $enums = [];
    public array $functions = [];
    public array $namespace = [];
    public array $uses = [];
    
    public string $currentNamespace = '';
    
    public function enterNode(Node $node) {
        // Track namespace
        if ($node instanceof Node\Stmt\Namespace_) {
            $this->currentNamespace = $node->name ? $node->name->toString() : '';
            return null;
        }
        
        // Track use statements
        if ($node instanceof Node\Stmt\Use_) {
            foreach ($node->uses as $use) {
                $this->uses[] = [
                    'name' => $use->name->toString(),
                    'alias' => $use->alias ? $use->alias->toString() : null,
                ];
            }
            return null;
        }
        
        // Extract classes
        if ($node instanceof Node\Stmt\Class_) {
            $this->classes[] = $this->extractClass($node);
            return null;
        }
        
        // Extract interfaces
        if ($node instanceof Node\Stmt\Interface_) {
            $this->interfaces[] = $this->extractInterface($node);
            return null;
        }
        
        // Extract traits
        if ($node instanceof Node\Stmt\Trait_) {
            $this->traits[] = $this->extractTrait($node);
            return null;
        }
        
        // Extract enums (PHP 8.1+)
        if ($node instanceof Node\Stmt\Enum_) {
            $this->enums[] = $this->extractEnum($node);
            return null;
        }
        
        // Extract top-level functions
        if ($node instanceof Node\Stmt\Function_) {
            $this->functions[] = $this->extractFunction($node);
            return null;
        }
        
        return null;
    }
    
    private function extractClass(Node\Stmt\Class_ $node): array {
        $properties = [];
        $methods = [];
        $constructors = [];
        
        foreach ($node->stmts as $stmt) {
            if ($stmt instanceof Node\Stmt\Property) {
                foreach ($stmt->props as $prop) {
                    $properties[] = $this->extractProperty($stmt, $prop);
                }
            } elseif ($stmt instanceof Node\Stmt\ClassMethod) {
                if ($stmt->name->toString() === '__construct') {
                    $constructors[] = $this->extractConstructor($stmt);
                    // Extract promoted properties from constructor
                    foreach ($stmt->params as $param) {
                        if ($param->flags !== 0) { // Promoted property
                            $properties[] = $this->extractPromotedProperty($param);
                        }
                    }
                } else {
                    $methods[] = $this->extractMethod($stmt);
                }
            }
        }
        
        // Detect framework pattern (CodeIgniter, Laravel, etc.)
        $extendsClass = $node->extends ? $node->extends->toString() : null;
        $frameworkInfo = $this->detectFrameworkPattern($node->name->toString(), $extendsClass);
        
        $classData = [
            'name' => $node->name ? $node->name->toString() : 'anonymous',
            'documentation' => $this->extractDocComment($node),
            'isExported' => true,
            'isAbstract' => $node->isAbstract(),
            'extendsClass' => $extendsClass,
            'implementsInterfaces' => array_map(fn($i) => $i->toString(), $node->implements),
            'attributes' => $this->extractAttributes($node->attrGroups),
            'properties' => $properties,
            'methods' => $methods,
            'constructors' => $constructors,
            'location' => $this->getLocation($node),
            'frameworkInfo' => $frameworkInfo,
        ];
        
        // Extract class-level middleware
        $classMiddleware = $this->extractMiddleware($node->attrGroups, $this->extractDocComment($node));
        if (!empty($classMiddleware)) {
            $classData['middleware'] = $classMiddleware;
        }
        
        // Extract routes for controllers
        if ($frameworkInfo && $frameworkInfo['isMVC'] && 
            ($frameworkInfo['type'] === 'Controller' || strpos($frameworkInfo['type'], 'Controller') !== false)) {
            $classData['routes'] = $this->extractRoutes($node, $node->name->toString(), $frameworkInfo, $classMiddleware);
        }
        
        return $classData;
    }
    
    private function detectFrameworkPattern(string $className, ?string $extendsClass): array {
        $framework = null;
        $type = null;
        
        if ($extendsClass) {
            // CodeIgniter 3
            if (in_array($extendsClass, ['CI_Controller', 'MY_Controller'])) {
                $framework = 'CodeIgniter 3';
                $type = 'Controller';
            } elseif (in_array($extendsClass, ['CI_Model', 'MY_Model'])) {
                $framework = 'CodeIgniter 3';
                $type = 'Model';
            }
            // CodeIgniter 4
            elseif (strpos($extendsClass, 'CodeIgniter\\Controller') !== false || strpos($extendsClass, 'BaseController') !== false) {
                $framework = 'CodeIgniter 4';
                $type = 'Controller';
            } elseif (strpos($extendsClass, 'CodeIgniter\\Model') !== false) {
                $framework = 'CodeIgniter 4';
                $type = 'Model';
            }
            // Laravel
            elseif (strpos($extendsClass, 'Illuminate\\') !== false) {
                $framework = 'Laravel';
                if (strpos($extendsClass, 'Controller') !== false) {
                    $type = 'Controller';
                } elseif (strpos($extendsClass, 'Model') !== false) {
                    $type = 'Model';
                } elseif (strpos($extendsClass, 'ServiceProvider') !== false) {
                    $type = 'ServiceProvider';
                }
            }
            // Symfony
            elseif (strpos($extendsClass, 'Symfony\\') !== false) {
                $framework = 'Symfony';
                if (strpos($extendsClass, 'Controller') !== false) {
                    $type = 'Controller';
                }
            }
        }
        
        // Class name conventions
        if (!$type && !$framework) {
            if (preg_match('/Controller$/i', $className)) {
                $type = 'Controller (by naming convention)';
            } elseif (preg_match('/Model$/i', $className)) {
                $type = 'Model (by naming convention)';
            } elseif (preg_match('/^(MY_|Base)/', $className)) {
                $type = 'Base/Extended Class';
            }
        }
        
        return [
            'framework' => $framework,
            'type' => $type,
            'isMVC' => in_array($type, ['Controller', 'Model', 'Controller (by naming convention)', 'Model (by naming convention)']),
        ];
    }
    
    /**
     * Extract routes from a controller class
     * 
     * @param Node\Stmt\Class_ $node Class node
     * @param string $className Class name
     * @param array $frameworkInfo Framework information
     * @param array $classMiddleware Class-level middleware
     * @return array Route information
     */
    private function extractRoutes(Node\Stmt\Class_ $node, string $className, array $frameworkInfo, array $classMiddleware = []): array {
        $routes = [];
        $framework = $frameworkInfo['framework'] ?? null;
        
        // Get controller base name (remove "Controller" suffix)
        $controllerBaseName = $className;
        if (preg_match('/^(.+?)(?:Controller|_controller)?$/i', $className, $matches)) {
            $controllerBaseName = strtolower($matches[1]);
        }
        
        foreach ($node->stmts as $stmt) {
            if (!($stmt instanceof Node\Stmt\ClassMethod)) continue;
            
            $methodName = $stmt->name->toString();
            $visibility = $this->getVisibility($stmt);
            
            // Skip non-public methods and constructor/magic methods
            if ($visibility !== 'public' || $methodName === '__construct' || strpos($methodName, '__') === 0) {
                continue;
            }
            
            // Extract parameters
            $parameters = [];
            foreach ($stmt->params as $param) {
                $paramName = $param->var->name;
                $parameters[] = [
                    'name' => $paramName,
                    'type' => $param->type ? $this->getTypeString($param->type) : null,
                    'required' => $param->default === null,
                    'defaultValue' => $param->default ? $this->getExprValue($param->default) : null,
                ];
            }
            
            // Detect HTTP methods from attributes or method name
            $httpMethods = $this->detectHttpMethods($stmt, $methodName);
            
            // Generate route path based on framework conventions
            $routePath = $this->generateRoutePath($framework, $controllerBaseName, $methodName, $parameters);
            
            // Extract method-level middleware and merge with class-level
            $methodMiddleware = $this->extractMiddleware($stmt->attrGroups, $this->extractDocComment($stmt));
            $allMiddleware = array_merge($classMiddleware, $methodMiddleware);
            
            $routes[] = [
                'method' => $methodName,
                'httpMethods' => $httpMethods,
                'path' => $routePath,
                'parameters' => $parameters,
                'middleware' => $allMiddleware,
                'visibility' => $visibility,
                'isRoute' => true,
            ];
        }
        
        return $routes;
    }
    
    /**
     * Extract middleware from attributes and docblocks
     * 
     * @param array $attrGroups Attribute groups
     * @param string|null $docComment Documentation comment
     * @return array Middleware information
     */
    private function extractMiddleware(array $attrGroups, ?string $docComment): array {
        $middleware = [];
        
        // Extract from attributes (Laravel/Symfony/CI4 style)
        foreach ($attrGroups as $attrGroup) {
            foreach ($attrGroup->attrs as $attr) {
                $attrName = $attr->name->toString();
                $simpleAttrName = basename(str_replace('\\', '/', $attrName));
                $simpleAttrNameLower = strtolower($simpleAttrName);
                
                // Laravel #[Middleware('auth', 'admin')]
                if (in_array($simpleAttrNameLower, ['middleware', 'withoutmiddleware'])) {
                    $params = [];
                    foreach ($attr->args as $arg) {
                        if ($arg->value instanceof Node\Scalar\String_) {
                            $params[] = $arg->value->value;
                        } elseif ($arg->value instanceof Node\Expr\Array_) {
                            foreach ($arg->value->items as $item) {
                                if ($item && $item->value instanceof Node\Scalar\String_) {
                                    $params[] = $item->value->value;
                                }
                            }
                        }
                    }
                    
                    $middleware[] = [
                        'name' => !empty($params) ? $params[0] : $simpleAttrName,
                        'parameters' => array_slice($params, 1),
                        'source' => 'attribute',
                    ];
                }
                // Symfony #[IsGranted('ROLE_ADMIN')]
                elseif ($simpleAttrNameLower === 'isgranted') {
                    $role = null;
                    foreach ($attr->args as $arg) {
                        if ($arg->value instanceof Node\Scalar\String_) {
                            $role = $arg->value->value;
                            break;
                        }
                    }
                    
                    $middleware[] = [
                        'name' => 'isGranted',
                        'parameters' => $role ? [$role] : [],
                        'source' => 'attribute',
                    ];
                }
                // CodeIgniter 4 #[Filter('auth')]
                elseif ($simpleAttrNameLower === 'filter') {
                    $filterName = null;
                    foreach ($attr->args as $arg) {
                        if ($arg->value instanceof Node\Scalar\String_) {
                            $filterName = $arg->value->value;
                            break;
                        }
                    }
                    
                    $middleware[] = [
                        'name' => $filterName ?: 'filter',
                        'parameters' => [],
                        'source' => 'attribute',
                    ];
                }
            }
        }
        
        // Extract from docblocks (@middleware annotation for CI3 compatibility)
        if ($docComment) {
            // Match @middleware auth, admin
            // Match @filter auth
            if (preg_match_all('/@(middleware|filter)\s+([^\s,]+)(?:\s*,\s*([^\n]*))?/i', $docComment, $matches, PREG_SET_ORDER)) {
                foreach ($matches as $match) {
                    $name = trim($match[2]);
                    $params = isset($match[3]) ? array_filter(array_map('trim', explode(',', $match[3]))) : [];
                    
                    $middleware[] = [
                        'name' => $name,
                        'parameters' => $params,
                        'source' => 'docblock',
                    ];
                }
            }
        }
        
        return $middleware;
    }
    
    /**
     * Detect HTTP methods from attributes or method naming conventions
     */
    private function detectHttpMethods(Node\Stmt\ClassMethod $node, string $methodName): array {
        // Check for route attributes (Laravel/Symfony style)
        foreach ($node->attrGroups as $attrGroup) {
            foreach ($attrGroup->attrs as $attr) {
                $attrName = $attr->name->toString();
                $attrNameLower = strtolower($attrName);
                
                // Laravel #[Route] or Symfony #[Route]
                // Check both the simple name and the fully qualified name (e.g., "Get" vs "Illuminate\Routing\Attributes\Get")
                $simpleAttrName = basename(str_replace('\\', '/', $attrName));
                $simpleAttrNameLower = strtolower($simpleAttrName);
                
                if (in_array($simpleAttrNameLower, ['route', 'get', 'post', 'put', 'patch', 'delete'])) {
                    // Extract HTTP method from attribute name
                    if ($simpleAttrNameLower === 'route') {
                        // Check args for methods: ['GET', 'POST']
                        foreach ($attr->args as $arg) {
                            if ($arg->name && $arg->name->toString() === 'methods') {
                                // Extract array of methods from attribute
                                return $this->extractArrayFromExpr($arg->value);
                            }
                        }
                        return ['GET']; // Default for Route
                    } else {
                        return [strtoupper($simpleAttrName)];
                    }
                }
            }
        }
        
        // Convention-based detection from method name
        $lowerMethodName = strtolower($methodName);
        
        if (in_array($lowerMethodName, ['index', 'show', 'list', 'view', 'get', 'display'])) {
            return ['GET'];
        } elseif (in_array($lowerMethodName, ['create', 'store', 'add', 'post'])) {
            return ['GET', 'POST']; // Form display + submission
        } elseif (in_array($lowerMethodName, ['edit', 'update', 'modify', 'put', 'patch'])) {
            return ['GET', 'POST', 'PUT', 'PATCH']; // Form display + submission
        } elseif (in_array($lowerMethodName, ['delete', 'destroy', 'remove'])) {
            return ['DELETE', 'POST']; // DELETE + POST fallback
        }
        
        // Default: assume GET
        return ['GET'];
    }
    
    /**
     * Generate route path based on framework conventions
     */
    private function generateRoutePath(?string $framework, string $controllerBaseName, string $methodName, array $parameters): string {
        // CodeIgniter convention: /controller/method/param1/param2
        // Laravel/Symfony: /controller/method/{param1}/{param2}
        
        $usesBraces = in_array($framework, ['Laravel', 'Symfony']) || 
                      (strpos($framework ?: '', 'CodeIgniter 4') !== false);
        
        // Build base path
        $path = '/' . $controllerBaseName;
        
        // Add method if not "index"
        if ($methodName !== 'index') {
            $path .= '/' . strtolower($methodName);
        }
        
        // Add parameters
        foreach ($parameters as $param) {
            if ($usesBraces) {
                // Laravel/Symfony style: {id}
                $optional = !$param['required'] ? '?' : '';
                $path .= '/{' . $param['name'] . $optional . '}';
            } else {
                // CodeIgniter 3 style: /param
                $path .= '/' . $param['name'];
            }
        }
        
        return $path;
    }
    
    /**
     * Extract array values from expression (for attribute parsing)
     */
    private function extractArrayFromExpr($expr): array {
        if ($expr instanceof Node\Expr\Array_) {
            $result = [];
            foreach ($expr->items as $item) {
                if ($item->value instanceof Node\Scalar\String_) {
                    $result[] = $item->value->value;
                }
            }
            return $result;
        }
        return [];
    }
    
    private function extractInterface(Node\Stmt\Interface_ $node): array {
        $methods = [];
        
        foreach ($node->stmts as $stmt) {
            if ($stmt instanceof Node\Stmt\ClassMethod) {
                $methods[] = $this->extractMethod($stmt);
            }
        }
        
        return [
            'name' => $node->name->toString(),
            'documentation' => $this->extractDocComment($node),
            'isExported' => true,
            'methods' => $methods,
            'extends' => array_map(fn($e) => $e->toString(), $node->extends),
            'location' => $this->getLocation($node),
        ];
    }
    
    private function extractTrait(Node\Stmt\Trait_ $node): array {
        $properties = [];
        $methods = [];
        
        foreach ($node->stmts as $stmt) {
            if ($stmt instanceof Node\Stmt\Property) {
                foreach ($stmt->props as $prop) {
                    $properties[] = $this->extractProperty($stmt, $prop);
                }
            } elseif ($stmt instanceof Node\Stmt\ClassMethod) {
                $methods[] = $this->extractMethod($stmt);
            }
        }
        
        return [
            'name' => $node->name->toString(),
            'documentation' => $this->extractDocComment($node),
            'isExported' => true,
            'properties' => $properties,
            'methods' => $methods,
            'location' => $this->getLocation($node),
        ];
    }
    
    private function extractEnum(Node\Stmt\Enum_ $node): array {
        $cases = [];
        $methods = [];
        
        foreach ($node->stmts as $stmt) {
            if ($stmt instanceof Node\Stmt\EnumCase) {
                $cases[] = [
                    'name' => $stmt->name->toString(),
                    'documentation' => $this->extractDocComment($stmt),
                    'value' => $stmt->expr ? $this->getExprValue($stmt->expr) : null,
                    'location' => $this->getLocation($stmt),
                ];
            } elseif ($stmt instanceof Node\Stmt\ClassMethod) {
                $methods[] = $this->extractMethod($stmt);
            }
        }
        
        return [
            'name' => $node->name->toString(),
            'documentation' => $this->extractDocComment($node),
            'isExported' => true,
            'backingType' => $node->scalarType ? $node->scalarType->toString() : null,
            'cases' => $cases,
            'methods' => $methods,
            'location' => $this->getLocation($node),
        ];
    }
    
    private function extractProperty(Node\Stmt\Property $stmt, Node\Stmt\PropertyProperty $prop): array {
        return [
            'name' => $prop->name->toString(),
            'documentation' => $this->extractDocComment($stmt),
            'type' => $stmt->type ? $this->getTypeString($stmt->type) : null,
            'visibility' => $this->getVisibility($stmt),
            'isStatic' => $stmt->isStatic(),
            'isReadonly' => $stmt->isReadonly(),
            'location' => $this->getLocation($prop),
        ];
    }
    
    private function extractPromotedProperty(Node\Param $param): array {
        return [
            'name' => $param->var->name,
            'documentation' => $this->extractDocComment($param),
            'type' => $param->type ? $this->getTypeString($param->type) : null,
            'visibility' => $this->getParamVisibility($param),
            'isStatic' => false,
            'isReadonly' => ($param->flags & Node\Stmt\Class_::MODIFIER_READONLY) !== 0,
            'location' => $this->getLocation($param),
        ];
    }
    
    private function extractMethod(Node\Stmt\ClassMethod $node): array {
        return [
            'name' => $node->name->toString(),
            'documentation' => $this->extractDocComment($node),
            'visibility' => $this->getVisibility($node),
            'isStatic' => $node->isStatic(),
            'isAbstract' => $node->isAbstract(),
            'parameters' => $this->extractParameters($node->params),
            'returnType' => $node->returnType ? $this->getTypeString($node->returnType) : null,
            'attributes' => $this->extractAttributes($node->attrGroups),
            'location' => $this->getLocation($node),
        ];
    }
    
    private function extractConstructor(Node\Stmt\ClassMethod $node): array {
        return [
            'documentation' => $this->extractDocComment($node),
            'parameters' => $this->extractParameters($node->params),
            'location' => $this->getLocation($node),
        ];
    }
    
    private function extractFunction(Node\Stmt\Function_ $node): array {
        return [
            'name' => $node->name->toString(),
            'documentation' => $this->extractDocComment($node),
            'isExported' => true,
            'isAsync' => false,
            'parameters' => $this->extractParameters($node->params),
            'returnType' => $node->returnType ? $this->getTypeString($node->returnType) : null,
            'location' => $this->getLocation($node),
        ];
    }
    
    private function extractParameters(array $params): array {
        $result = [];
        foreach ($params as $param) {
            if (!($param instanceof Node\Param)) continue;
            
            $result[] = [
                'name' => $param->var->name,
                'type' => $param->type ? $this->getTypeString($param->type) : null,
                'isOptional' => $param->default !== null,
                'defaultValue' => $param->default ? $this->getExprValue($param->default) : null,
            ];
        }
        return $result;
    }
    
    private function extractAttributes(array $attrGroups): array {
        $attributes = [];
        foreach ($attrGroups as $group) {
            foreach ($group->attrs as $attr) {
                $args = [];
                foreach ($attr->args as $arg) {
                    $argValue = $this->getExprValue($arg->value);
                    if ($arg->name) {
                        $args[] = $arg->name->toString() . ': ' . $argValue;
                    } else {
                        $args[] = $argValue;
                    }
                }
                
                $attributes[] = [
                    'name' => $attr->name->toString(),
                    'arguments' => implode(', ', $args),
                ];
            }
        }
        return $attributes;
    }
    
    private function extractDocComment(Node $node): ?string {
        $docComment = $node->getDocComment();
        if ($docComment) {
            return trim($docComment->getText());
        }
        return null;
    }
    
    private function getLocation(Node $node): array {
        return [
            'startLine' => $node->getStartLine(),
            'startColumn' => $node->getStartFilePos(),
            'endLine' => $node->getEndLine(),
            'endColumn' => $node->getEndFilePos(),
        ];
    }
    
    private function getVisibility($node): string {
        if ($node->isPublic()) return 'public';
        if ($node->isProtected()) return 'protected';
        if ($node->isPrivate()) return 'private';
        return 'public';
    }
    
    private function getParamVisibility(Node\Param $param): string {
        if ($param->flags & Node\Stmt\Class_::MODIFIER_PUBLIC) return 'public';
        if ($param->flags & Node\Stmt\Class_::MODIFIER_PROTECTED) return 'protected';
        if ($param->flags & Node\Stmt\Class_::MODIFIER_PRIVATE) return 'private';
        return 'public';
    }
    
    private function getTypeString($type): string {
        if ($type instanceof Node\Identifier) {
            return $type->toString();
        }
        if ($type instanceof Node\Name) {
            return $type->toString();
        }
        if ($type instanceof Node\UnionType) {
            return implode('|', array_map(fn($t) => $this->getTypeString($t), $type->types));
        }
        if ($type instanceof Node\IntersectionType) {
            return implode('&', array_map(fn($t) => $this->getTypeString($t), $type->types));
        }
        if ($type instanceof Node\NullableType) {
            return '?' . $this->getTypeString($type->type);
        }
        return 'mixed';
    }
    
    private function getExprValue($expr): string {
        if ($expr instanceof Node\Scalar\String_) {
            return "'" . addslashes($expr->value) . "'";
        }
        if ($expr instanceof Node\Scalar\Int_) {
            return (string)$expr->value;
        }
        if ($expr instanceof Node\Scalar\Float_) {
            return (string)$expr->value;
        }
        if ($expr instanceof Node\Expr\ConstFetch) {
            return $expr->name->toString();
        }
        if ($expr instanceof Node\Expr\Array_) {
            return '[]';
        }
        return 'null';
    }
}

function analyzePhpFile($filePath) {
    if (!file_exists($filePath)) {
        return [
            'error' => 'File not found: ' . $filePath,
            'path' => $filePath
        ];
    }

    $code = file_get_contents($filePath);
    
    try {
        $parser = (new ParserFactory)->createForNewestSupportedVersion();
        $ast = $parser->parse($code);
        
        $traverser = new NodeTraverser();
        $visitor = new SymbolExtractor();
        $traverser->addVisitor($visitor);
        $traverser->traverse($ast);
        
        // Calculate documentation coverage
        $totalSymbols = 0;
        $documentedSymbols = 0;
        
        // Count classes and their members
        foreach ($visitor->classes as $class) {
            $totalSymbols++;
            if (!empty($class['documentation'])) {
                $documentedSymbols++;
            }
            
            foreach ($class['properties'] as $prop) {
                $totalSymbols++;
                if (!empty($prop['documentation'])) {
                    $documentedSymbols++;
                }
            }
            
            foreach ($class['methods'] as $method) {
                $totalSymbols++;
                if (!empty($method['documentation'])) {
                    $documentedSymbols++;
                }
            }
            
            foreach ($class['constructors'] as $constructor) {
                $totalSymbols++;
                if (!empty($constructor['documentation'])) {
                    $documentedSymbols++;
                }
            }
        }
        
        // Count interfaces
        foreach ($visitor->interfaces as $interface) {
            $totalSymbols++;
            if (!empty($interface['documentation'])) {
                $documentedSymbols++;
            }
        }
        
        // Count traits
        foreach ($visitor->traits as $trait) {
            $totalSymbols++;
            if (!empty($trait['documentation'])) {
                $documentedSymbols++;
            }
            
            foreach ($trait['properties'] as $prop) {
                $totalSymbols++;
                if (!empty($prop['documentation'])) {
                    $documentedSymbols++;
                }
            }
            
            foreach ($trait['methods'] as $method) {
                $totalSymbols++;
                if (!empty($method['documentation'])) {
                    $documentedSymbols++;
                }
            }
        }
        
        // Count enums
        foreach ($visitor->enums as $enum) {
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
            
            foreach ($enum['methods'] as $method) {
                $totalSymbols++;
                if (!empty($method['documentation'])) {
                    $documentedSymbols++;
                }
            }
        }
        
        // Count functions
        foreach ($visitor->functions as $func) {
            $totalSymbols++;
            if (!empty($func['documentation'])) {
                $documentedSymbols++;
            }
        }
        
        $coverage = $totalSymbols > 0 ? ($documentedSymbols / $totalSymbols) * 100 : 0;
        
        // Detect framework usage in file
        $frameworkSummary = [
            'detected' => false,
            'name' => null,
            'controllers' => 0,
            'models' => 0,
            'other' => 0,
        ];
        
        foreach ($visitor->classes as $class) {
            if (!empty($class['frameworkInfo']['framework'])) {
                $frameworkSummary['detected'] = true;
                $frameworkSummary['name'] = $class['frameworkInfo']['framework'];
                
                if ($class['frameworkInfo']['type'] === 'Controller' || strpos($class['frameworkInfo']['type'], 'Controller') !== false) {
                    $frameworkSummary['controllers']++;
                } elseif ($class['frameworkInfo']['type'] === 'Model' || strpos($class['frameworkInfo']['type'], 'Model') !== false) {
                    $frameworkSummary['models']++;
                } else {
                    $frameworkSummary['other']++;
                }
            }
        }
        
        return [
            'path' => $filePath,
            'namespace' => $visitor->currentNamespace,
            'uses' => $visitor->uses,
            'classes' => $visitor->classes,
            'interfaces' => $visitor->interfaces,
            'traits' => $visitor->traits,
            'enums' => $visitor->enums,
            'functions' => $visitor->functions,
            'typeAliases' => [],
            'frameworkInfo' => $frameworkSummary,
            'imports' => array_map(function($use) {
                return [
                    'importedNames' => [$use['name']],
                    'moduleSpecifier' => $use['name'],
                    'defaultImport' => $use['alias'],
                    'namespaceImport' => null,
                ];
            }, $visitor->uses),
            'exports' => [],
            'documentation' => [
                'hasDocumentation' => $documentedSymbols > 0,
                'documentedSymbols' => $documentedSymbols,
                'totalSymbols' => $totalSymbols,
                'coverage' => $coverage,
            ],
        ];
        
    } catch (Error $error) {
        return [
            'error' => 'Parse error: ' . $error->getMessage(),
            'path' => $filePath
        ];
    }
}

// CLI execution
if (php_sapi_name() === 'cli') {
    if ($argc < 2) {
        fwrite(STDERR, "Usage: php php_analyzer_v2.php <file.php>\n");
        exit(1);
    }
    
    $filePath = $argv[1];
    $result = analyzePhpFile($filePath);
    echo json_encode($result, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
}
