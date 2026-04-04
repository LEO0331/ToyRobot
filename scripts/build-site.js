const fs = require("fs");
const path = require("path");

const rootDir = path.resolve(process.cwd());
const outDir = path.join(rootDir, "dist");
const filesToCopy = [
  ["index.html", "index.html"],
  ["web", "web"],
  ["src", "src"],
];

fs.rmSync(outDir, { recursive: true, force: true });
fs.mkdirSync(outDir, { recursive: true });

for (const [from, to] of filesToCopy) {
  fs.cpSync(path.join(rootDir, from), path.join(outDir, to), {
    recursive: true,
  });
}

console.log(`Site build complete: ${outDir}`);
