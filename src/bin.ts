import { checkFolder } from "./checkFolder";
import { produceSingleFile } from "./produceSingleFile";

const folder = process.argv[2];

const result = checkFolder(folder);
if (result.type === "error") {
  console.error(result.error);
  process.exit(1);
} else {
  const file = await produceSingleFile(result.path);
  console.log(file);
}
