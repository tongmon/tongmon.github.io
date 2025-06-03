function makeDirectoryTreeJson(targetDir, jsonFilePath) {
  const fs = require("fs");
  const path = require("path");

  const result = {};
  for (const file of fs.readdirSync(targetDir)) {
    const fullPath = path.join(targetDir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      result[file] = walk(fullPath);
    } else {
      result[file] = relPath.replace(/\\/g, "/");
    }
  }

  fs.writeFileSync(jsonFilePath, JSON.stringify(result, null, 2));
}
