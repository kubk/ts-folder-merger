import { mergeFiles } from "./mergeFiles";
import { readFiles } from "./readFiles";

export async function produceSingleFile(folderPath: string) {
  try {
    const files = await readFiles(folderPath);
    return mergeFiles(files);
  } catch (error) {
    console.error("An error occurred:", error);
    process.exit(1);
  }
}
