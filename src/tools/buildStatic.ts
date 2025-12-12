interface BuildStaticArgs {
  docsPath: string;
  framework: string;
  outputPath?: string;
}

export async function buildStatic(args: any) {
  const { docsPath, framework, outputPath } = args as BuildStaticArgs;

  const instructions: Record<string, string> = {
    docusaurus: `🏗️ Building Docusaurus Static Site:

1. Navigate to docs directory:
   cd ${docsPath}

2. Install dependencies (if not done):
   npm install

3. Build:
   npm run build

4. Output location: ${docsPath}/build

5. Test the build locally:
   npm run serve

6. Deploy to:
   - GitHub Pages: npm run deploy
   - Netlify: Drag & drop the 'build' folder
   - Vercel: Connect your repo`,
    mkdocs: `🏗️ Building MkDocs Static Site:

1. Navigate to project directory:
   cd ${docsPath}

2. Build:
   mkdocs build

3. Output location: ${docsPath}/site

4. Preview:
   cd site && python -m http.server 8000

5. Deploy to GitHub Pages:
   mkdocs gh-deploy`,
    sphinx: `🏗️ Building Sphinx Static Site:

1. Navigate to docs directory:
   cd ${docsPath}

2. Build HTML:
   make html

3. Output location: ${docsPath}/_build/html

4. Preview:
   cd _build/html && python -m http.server 8000

5. For ReadTheDocs: Connect your repository at readthedocs.org`,
  };

  const instruction = instructions[framework] || "Framework not supported";

  return {
    content: [
      {
        type: "text",
        text: instruction,
      },
    ],
  };
}
