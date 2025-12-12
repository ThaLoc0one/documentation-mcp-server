/**
 * Generate OpenAPI 3.0 specification from analyzed PHP routes
 * 
 * Converts route information from PHP analyzers into OpenAPI/Swagger documentation
 */

import { FileAnalysis, RouteInfo, MiddlewareInfo, RouteParameter } from '../core/types.js';

export interface OpenAPISpec {
  openapi: string;
  info: {
    title: string;
    version: string;
    description?: string;
  };
  servers?: Array<{
    url: string;
    description?: string;
  }>;
  paths: Record<string, any>;
  components?: {
    schemas?: Record<string, any>;
    securitySchemes?: Record<string, any>;
  };
  security?: Array<Record<string, string[]>>;
}

/**
 * Generate OpenAPI specification from analyzed files
 */
export function generateOpenApiSpec(
  files: FileAnalysis[],
  options: {
    title?: string;
    version?: string;
    description?: string;
    serverUrl?: string;
  } = {}
): OpenAPISpec {
  const spec: OpenAPISpec = {
    openapi: '3.0.0',
    info: {
      title: options.title || 'API Documentation',
      version: options.version || '1.0.0',
      description: options.description || 'Auto-generated API documentation from code analysis',
    },
    paths: {},
    components: {
      securitySchemes: {},
      schemas: {},
    },
  };

  if (options.serverUrl) {
    spec.servers = [
      {
        url: options.serverUrl,
        description: 'API Server',
      },
    ];
  }

  // Collect all security schemes from middleware
  const securitySchemes = new Set<string>();

  // Process each file
  for (const file of files) {
    if (!file.classes) continue;

    for (const classInfo of file.classes) {
      if (!classInfo.routes || classInfo.routes.length === 0) continue;

      // Process each route
      for (const route of classInfo.routes) {
        const pathItem = convertRouteToOpenAPI(route, classInfo.name || 'Unknown', file.frameworkInfo?.name);

        // Add to paths
        if (!spec.paths[route.path]) {
          spec.paths[route.path] = {};
        }

        // Add each HTTP method
        for (const httpMethod of route.httpMethods) {
          spec.paths[route.path][httpMethod.toLowerCase()] = pathItem;

          // Collect security schemes
          if (route.middleware) {
            for (const middleware of route.middleware) {
              securitySchemes.add(middleware.name);
            }
          }
        }
      }
    }
  }

  // Add security schemes
  spec.components!.securitySchemes = generateSecuritySchemes(Array.from(securitySchemes));

  // Remove empty components
  if (Object.keys(spec.components!.securitySchemes || {}).length === 0) {
    delete spec.components!.securitySchemes;
  }
  if (Object.keys(spec.components!.schemas || {}).length === 0) {
    delete spec.components!.schemas;
  }
  if (Object.keys(spec.components || {}).length === 0) {
    delete spec.components;
  }

  return spec;
}

/**
 * Convert route to OpenAPI path item
 */
function convertRouteToOpenAPI(
  route: RouteInfo,
  className: string,
  framework?: string | null
): any {
  const operation: any = {
    summary: `${className}.${route.method}`,
    description: `Route: ${route.path}`,
    operationId: `${className}_${route.method}`,
    tags: [className],
    parameters: [],
    responses: {
      '200': {
        description: 'Successful response',
        content: {
          'application/json': {
            schema: {
              type: 'object',
            },
          },
        },
      },
      '400': {
        description: 'Bad request',
      },
      '401': {
        description: 'Unauthorized',
      },
      '500': {
        description: 'Internal server error',
      },
    },
  };

  // Add parameters
  for (const param of route.parameters) {
    operation.parameters.push(convertParameterToOpenAPI(param, route.path));
  }

  // Add security from middleware
  if (route.middleware && route.middleware.length > 0) {
    operation.security = [];
    for (const middleware of route.middleware) {
      operation.security.push({
        [middleware.name]: middleware.parameters,
      });
    }
  }

  return operation;
}

/**
 * Convert route parameter to OpenAPI parameter
 */
function convertParameterToOpenAPI(param: RouteParameter, routePath: string): any {
  // Determine if parameter is in path or query
  const inPath = routePath.includes(`{${param.name}}`) || routePath.includes(`/${param.name}`);

  return {
    name: param.name,
    in: inPath ? 'path' : 'query',
    required: param.required && inPath,
    schema: {
      type: mapTypeToOpenAPI(param.type),
    },
    description: param.defaultValue ? `Default: ${param.defaultValue}` : undefined,
  };
}

/**
 * Map PHP type to OpenAPI type
 */
function mapTypeToOpenAPI(phpType: string | null): string {
  if (!phpType) return 'string';

  const type = phpType.toLowerCase();

  // Simple mappings
  if (type === 'int' || type === 'integer') return 'integer';
  if (type === 'float' || type === 'double') return 'number';
  if (type === 'bool' || type === 'boolean') return 'boolean';
  if (type === 'array') return 'array';
  if (type === 'object') return 'object';

  // Union types - use first type
  if (type.includes('|')) {
    const firstType = type.split('|')[0].trim();
    return mapTypeToOpenAPI(firstType);
  }

  // Default to string
  return 'string';
}

/**
 * Generate security schemes from middleware names
 */
function generateSecuritySchemes(middlewareNames: string[]): Record<string, any> {
  const schemes: Record<string, any> = {};

  for (const name of middlewareNames) {
    const nameLower = name.toLowerCase();

    // OAuth2 patterns
    if (nameLower.includes('oauth')) {
      schemes[name] = {
        type: 'oauth2',
        flows: {
          implicit: {
            authorizationUrl: '/oauth/authorize',
            scopes: {},
          },
        },
      };
    }
    // JWT / Bearer token
    else if (nameLower === 'auth' || nameLower === 'jwt' || nameLower.includes('bearer')) {
      schemes[name] = {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      };
    }
    // API Key
    else if (nameLower.includes('apikey') || nameLower.includes('api_key')) {
      schemes[name] = {
        type: 'apiKey',
        in: 'header',
        name: 'X-API-Key',
      };
    }
    // Basic Auth
    else if (nameLower === 'basic') {
      schemes[name] = {
        type: 'http',
        scheme: 'basic',
      };
    }
    // Default to API Key for other middleware
    else if (nameLower !== 'throttle' && !nameLower.includes('throttle') && 
             nameLower !== 'csrf' && nameLower !== 'cors') {
      schemes[name] = {
        type: 'apiKey',
        in: 'header',
        name: `X-${name.charAt(0).toUpperCase() + name.slice(1)}`,
      };
    }
  }

  return schemes;
}

/**
 * Export OpenAPI spec to JSON string
 */
export function exportOpenApiJson(spec: OpenAPISpec, pretty: boolean = true): string {
  return JSON.stringify(spec, null, pretty ? 2 : 0);
}

/**
 * Export OpenAPI spec to YAML string
 */
export function exportOpenApiYaml(spec: OpenAPISpec): string {
  // Simple YAML conversion (for production, use a proper YAML library)
  const yaml = convertToYaml(spec, 0);
  return yaml;
}

/**
 * Simple YAML converter (basic implementation)
 */
function convertToYaml(obj: any, indent: number = 0): string {
  const spaces = '  '.repeat(indent);
  let yaml = '';

  if (Array.isArray(obj)) {
    for (const item of obj) {
      if (typeof item === 'object' && item !== null) {
        yaml += `${spaces}-\n${convertToYaml(item, indent + 1)}`;
      } else {
        yaml += `${spaces}- ${item}\n`;
      }
    }
  } else if (typeof obj === 'object' && obj !== null) {
    for (const [key, value] of Object.entries(obj)) {
      if (value === undefined) continue;

      if (typeof value === 'object' && value !== null) {
        if (Array.isArray(value) && value.length === 0) {
          yaml += `${spaces}${key}: []\n`;
        } else if (!Array.isArray(value) && Object.keys(value).length === 0) {
          yaml += `${spaces}${key}: {}\n`;
        } else {
          yaml += `${spaces}${key}:\n${convertToYaml(value, indent + 1)}`;
        }
      } else if (typeof value === 'string') {
        // Escape strings with special characters
        const escaped = value.includes(':') || value.includes('#') || value.includes('[')
          ? `"${value.replace(/"/g, '\\"')}"`
          : value;
        yaml += `${spaces}${key}: ${escaped}\n`;
      } else {
        yaml += `${spaces}${key}: ${value}\n`;
      }
    }
  }

  return yaml;
}
