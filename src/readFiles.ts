import { FileContent } from "./mergeFiles";
import { glob } from "glob";
import path from "path";
import fs from "fs/promises";

export async function readFiles(folderPath: string): Promise<FileContent[]> {
  const files = await glob("**/*.{js,ts}", { cwd: folderPath });
  return Promise.all(
    files.map(async (file) => {
      const filePath = path.join(folderPath, file);
      const content = await fs.readFile(filePath, "utf-8");
      return { name: file, content };
    }),
  );
}
