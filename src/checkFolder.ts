import fs from "fs";

type Result =
  | { type: "success"; path: string }
  | { type: "error"; error: string };

export function checkFolder(folderPath: string): Result {
  try {
    if (!fs.existsSync(folderPath)) {
      return {
        type: "error",
        error: `The folder "${folderPath}" does not exist.`,
      };
    }

    const stats = fs.statSync(folderPath);
    if (!stats.isDirectory()) {
      return { type: "error", error: `"${folderPath}" is not a directory.` };
    }

    const files = fs.readdirSync(folderPath);

    if (files.length === 0) {
      return { type: "error", error: `The folder "${folderPath}" is empty.` };
    }

    return { type: "success", path: folderPath };
  } catch (error) {
    return { type: "error", error: `An unexpected error occurred: ${error}` };
  }
}
