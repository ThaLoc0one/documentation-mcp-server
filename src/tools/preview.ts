interface PreviewArgs {
  docsPath: string;
  framework: string;
  port?: number;
}

export async function preview(args: any) {
  const { docsPath, framework, port } = args as PreviewArgs;

  const defaultPorts: Record<string, number> = {
    docusaurus: 3000,
    mkdocs: 8000,
    sphinx: 8000,
  };

  const selectedPort = port || defaultPorts[framework] || 3000;

  const instructions: Record<string, string> = {
    docusaurus: `👀 Starting Docusaurus Preview:

1. Navigate to docs:
   cd ${docsPath}

2. Start dev server:
   npm start

3. Server will run on: http://localhost:${selectedPort}

4. Features:
   - Hot reload
   - Fast refresh
   - Search
   - Navigation

Press Ctrl+C to stop the server.`,
    mkdocs: `👀 Starting MkDocs Preview:

1. Navigate to project:
   cd ${docsPath}

2. Start dev server:
   mkdocs serve -a localhost:${selectedPort}

3. Server will run on: http://localhost:${selectedPort}

4. Features:
   - Auto-reload on save
   - Live preview
   - Search

Press Ctrl+C to stop the server.`,
    sphinx: `👀 Starting Sphinx Preview:

1. Build the docs:
   cd ${docsPath}
   make html

2. Start simple HTTP server:
   cd _build/html
   python -m http.server ${selectedPort}

3. Server will run on: http://localhost:${selectedPort}

4. For auto-rebuild, use sphinx-autobuild:
   pip install sphinx-autobuild
   sphinx-autobuild . _build/html --port ${selectedPort}

Press Ctrl+C to stop the server.`,
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
