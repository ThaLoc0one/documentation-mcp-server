interface GenerateApiArgs {
  projectPath: string;
  outputPath: string;
  language: string;
}

export async function generateApi(args: any) {
  const { projectPath, outputPath, language } = args as GenerateApiArgs;

  const instructions: Record<string, string> = {
    typescript: `📖 TypeScript API Documentation:

1. Install TypeDoc:
   npm install --save-dev typedoc

2. Generate API docs:
   npx typedoc --out ${outputPath} ${projectPath}

3. For integration with Docusaurus:
   npm install --save-dev docusaurus-plugin-typedoc`,
    javascript: `📖 JavaScript API Documentation:

1. Install JSDoc:
   npm install --save-dev jsdoc

2. Generate API docs:
   npx jsdoc -c jsdoc.json -d ${outputPath} ${projectPath}

3. Use JSDoc comments:
   /**
    * Description
    * @param {string} param - Parameter description
    * @returns {Promise<void>}
    */`,
    python: `📖 Python API Documentation:

1. For Sphinx:
   pip install sphinx sphinx-autodoc

2. Generate API docs:
   sphinx-apidoc -o ${outputPath} ${projectPath}

3. For MkDocs:
   pip install mkdocstrings mkdocstrings-python
   
   Add to mkdocs.yml:
   plugins:
     - mkdocstrings:
         handlers:
           python:
             options:
               docstring_style: google`,
    go: `📖 Go API Documentation:

1. Use godoc:
   godoc -http=:6060

2. Or generate static docs:
   go doc -all > ${outputPath}/api.md`,
    rust: `📖 Rust API Documentation:

1. Generate docs:
   cargo doc --no-deps

2. Open in browser:
   cargo doc --no-deps --open

3. Output is in target/doc`,
  };

  const instruction = instructions[language] || "Language not supported for API generation";

  return {
    content: [
      {
        type: "text",
        text: instruction,
      },
    ],
  };
}
