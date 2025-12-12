import path from "path";

interface GenerateStructureArgs {
  projectPath: string;
  framework: "docusaurus" | "mkdocs" | "sphinx";
  template?: string;
  outputPath?: string;
}

export async function generateStructure(args: any) {
  const { projectPath, framework, template, outputPath = "docs" } = args as GenerateStructureArgs;

  try {
    const fullOutputPath = path.resolve(projectPath, outputPath);

    switch (framework) {
      case "docusaurus":
        return await generateDocusaurus(projectPath, fullOutputPath, template);
      case "mkdocs":
        return await generateMkDocs(projectPath, fullOutputPath);
      case "sphinx":
        return await generateSphinx(projectPath, fullOutputPath);
      default:
        throw new Error(`Unsupported framework: ${framework}`);
    }
  } catch (error) {
    throw new Error(`Failed to generate structure: ${error}`);
  }
}

async function generateDocusaurus(projectPath: string, outputPath: string, template?: string) {
  const availableTemplates = [
    "classic",
    "facebook",
    "meta",
  ];

  const selectedTemplate = template && availableTemplates.includes(template) ? template : "classic";

  const message = `📦 Docusaurus Setup Instructions:

1. Install Docusaurus:
   cd ${projectPath}
   npx create-docusaurus@latest ${path.basename(outputPath)} ${selectedTemplate} --typescript

2. Available templates:
   ${availableTemplates.map(t => `- ${t}`).join("\n   ")}

3. Start the development server:
   cd ${path.basename(outputPath)}
   npm start

4. Build for production:
   npm run build

The static files will be in the 'build' directory, ready for hosting!`;

  return {
    content: [
      {
        type: "text",
        text: message,
      },
    ],
  };
}

async function generateMkDocs(projectPath: string, outputPath: string) {
  const configContent = `site_name: My Documentation
site_url: https://example.com
theme:
  name: material
  features:
    - navigation.tabs
    - navigation.sections
    - toc.integrate
    - search.suggest
    - search.highlight
  palette:
    - scheme: default
      primary: indigo
      accent: indigo
      toggle:
        icon: material/brightness-7
        name: Switch to dark mode
    - scheme: slate
      primary: indigo
      accent: indigo
      toggle:
        icon: material/brightness-4
        name: Switch to light mode

nav:
  - Home: index.md
  - Getting Started: getting-started.md
  - API Reference: api/index.md

markdown_extensions:
  - pymdownx.highlight
  - pymdownx.superfences
  - pymdownx.tabbed
  - admonition
  - codehilite`;

  const message = `📦 MkDocs Setup Instructions:

1. Install MkDocs with Material theme:
   pip install mkdocs mkdocs-material

2. Create the following structure in '${outputPath}':
   
   ${outputPath}/
   ├── mkdocs.yml
   └── docs/
       ├── index.md
       ├── getting-started.md
       └── api/
           └── index.md

3. Configuration file (mkdocs.yml):
${configContent}

4. Start the development server:
   cd ${projectPath}
   mkdocs serve

5. Build for production:
   mkdocs build

The static files will be in the 'site' directory!`;

  return {
    content: [
      {
        type: "text",
        text: message,
      },
    ],
  };
}

async function generateSphinx(projectPath: string, outputPath: string) {
  const message = `📦 Sphinx Setup Instructions:

1. Install Sphinx:
   pip install sphinx sphinx-rtd-theme

2. Initialize Sphinx:
   cd ${projectPath}
   sphinx-quickstart ${path.basename(outputPath)}

3. Edit conf.py to use the Read the Docs theme:
   html_theme = 'sphinx_rtd_theme'

4. Build documentation:
   cd ${path.basename(outputPath)}
   make html

5. The HTML output will be in '_build/html'

For API documentation from Python code:
   pip install sphinx-autodoc`;

  return {
    content: [
      {
        type: "text",
        text: message,
      },
    ],
  };
}
