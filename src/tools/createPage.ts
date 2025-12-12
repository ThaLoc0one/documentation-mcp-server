import { promises as fs } from "fs";
import path from "path";

interface CreatePageArgs {
  docsPath: string;
  pagePath: string;
  title: string;
  content: string;
}

export async function createPage(args: any) {
  const { docsPath, pagePath, title, content } = args as CreatePageArgs;

  try {
    const fullPath = path.resolve(docsPath, pagePath);
    const dir = path.dirname(fullPath);

    await fs.mkdir(dir, { recursive: true });

    const formattedContent = `---
title: ${title}
---

# ${title}

${content}
`;

    await fs.writeFile(fullPath, formattedContent, "utf-8");

    return {
      content: [
        {
          type: "text",
          text: `✅ Page created successfully at: ${fullPath}`,
        },
      ],
    };
  } catch (error) {
    throw new Error(`Failed to create page: ${error}`);
  }
}
