import { build } from "esbuild";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { mkdirSync } from "node:fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rootDir = path.resolve(__dirname, "..");
const srcFile = path.join(rootDir, "lambda_src", "index.mjs");
const outFile = path.join(rootDir, "build", "index.js");

mkdirSync(path.join(rootDir, "build"), { recursive: true });

await build({
  entryPoints: [srcFile],
  outfile: outFile,
  bundle: true,
  platform: "node",
  target: "node22",
  format: "cjs",
  minify: true,
  sourcemap: false,
});

console.log(`Built ${outFile}`);