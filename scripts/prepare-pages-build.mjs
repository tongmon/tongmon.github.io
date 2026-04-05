import fs from "node:fs";
import path from "node:path";

const distDirectory = path.resolve("dist");
const indexFile = path.join(distDirectory, "index.html");
const notFoundFile = path.join(distDirectory, "404.html");

if (fs.existsSync(indexFile)) {
  fs.copyFileSync(indexFile, notFoundFile);
}
