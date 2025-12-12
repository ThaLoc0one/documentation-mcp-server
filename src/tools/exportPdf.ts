interface ExportPdfArgs {
  docsPath: string;
  outputPath: string;
  includePages?: string[];
}

export async function exportPdf(args: any) {
  const { docsPath, outputPath, includePages } = args as ExportPdfArgs;

  const instructions = `📄 PDF Export Instructions:

1. Install dependencies:
   npm install --save-dev puppeteer

2. Create export script (pdf-export.js):

\`\`\`javascript
const puppeteer = require('puppeteer');
const path = require('path');

async function exportPdf() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  // Navigate to your built documentation
  await page.goto('file://${docsPath}/index.html', {
    waitUntil: 'networkidle0'
  });
  
  // Generate PDF
  await page.pdf({
    path: '${outputPath}',
    format: 'A4',
    printBackground: true,
    margin: {
      top: '20mm',
      right: '20mm',
      bottom: '20mm',
      left: '20mm'
    }
  });
  
  await browser.close();
  console.log('PDF generated: ${outputPath}');
}

exportPdf();
\`\`\`

3. Run the script:
   node pdf-export.js

Alternative tools:
- prince (commercial, excellent quality)
- wkhtmltopdf (free, good quality)
- md-to-pdf (for simple Markdown)

For Docusaurus, check:
- docusaurus-prince-pdf
- docusaurus-pdf`;

  return {
    content: [
      {
        type: "text",
        text: instructions,
      },
    ],
  };
}
