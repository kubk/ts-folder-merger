export interface FileContent {
  name: string;
  content: string;
}

export function mergeFiles(files: FileContent[]): string {
  const importMap = new Map<string, Set<string>>();
  const exportedSymbols = new Set<string>();
  let mergedContent = "";

  // First pass: collect imports and exports
  for (const file of files) {
    const lines = file.content.split("\n");
    for (const line of lines) {
      const trimmedLine = line.trim();
      if (trimmedLine.startsWith("import ")) {
        const match = trimmedLine.match(
          /import\s+{([^}]+)}\s+from\s+['"]([^'"]+)['"]/
        );
        if (match) {
          const [, symbols, source] = match;
          const symbolSet = importMap.get(source) || new Set();
          symbols
            .split(",")
            .map((s) => s.trim())
            .forEach((s) => symbolSet.add(s));
          importMap.set(source, symbolSet);
        } else {
          // Handle other import formats (e.g., default imports, namespace imports)
          mergedContent += line + "\n";
        }
      } else if (trimmedLine.startsWith("export ")) {
        const match = trimmedLine.match(
          /export\s+(const|let|var|function|async\s+function|class)\s+(\w+)/
        );
        if (match) {
          exportedSymbols.add(match[2]);
        }
      }
    }
  }

  // Second pass: merge content and remove unnecessary imports
  let emptyLineCount = 0;
  for (const file of files) {
    const lines = file.content.split("\n");
    for (const line of lines) {
      const trimmedLine = line.trim();
      if (!trimmedLine.startsWith("import ")) {
        if (trimmedLine === "") {
          emptyLineCount++;
          if (emptyLineCount === 1) {
            mergedContent += "\n";
          }
        } else {
          emptyLineCount = 0;
          mergedContent += line + "\n";
        }
      }
    }
  }

  // Generate merged imports
  const mergedImports = Array.from(importMap.entries())
    .map(([source, symbols]) => {
      const filteredSymbols = Array.from(symbols).filter(
        (symbol) => !exportedSymbols.has(symbol)
      );
      if (filteredSymbols.length > 0) {
        return `import { ${filteredSymbols.join(", ")} } from '${source}';`;
      }
      return null;
    })
    .filter(Boolean)
    .join("\n");

  return (mergedImports ? mergedImports + "\n\n" : "") + mergedContent.trim();
}
