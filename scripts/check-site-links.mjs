import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, extname, join, normalize, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const checkedExtensions = new Set([".html", ".css"]);
const ignoredDirectories = new Set([".git", "node_modules"]);
const missing = [];
const invalid = [];

function collectFiles(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    if (ignoredDirectories.has(entry.name)) return [];
    const path = join(directory, entry.name);
    if (entry.isDirectory()) return collectFiles(path);
    return checkedExtensions.has(extname(entry.name).toLowerCase()) ? [path] : [];
  });
}

function isLocalReference(reference) {
  return (
    reference &&
    !reference.startsWith("#") &&
    !reference.startsWith("/") &&
    !/^(?:https?:|mailto:|tel:|data:|javascript:)/i.test(reference)
  );
}

function checkReference(source, rawReference) {
  const reference = rawReference.trim().replace(/^['"]|['"]$/g, "");
  if (!isLocalReference(reference)) return;

  const cleanReference = decodeURIComponent(reference.split(/[?#]/, 1)[0]);
  const candidate = normalize(resolve(dirname(source), cleanReference));
  const target = existsSync(candidate) && statSync(candidate).isDirectory()
    ? join(candidate, "index.html")
    : candidate;

  if (!existsSync(target)) {
    missing.push({
      source: source.slice(root.length + 1),
      reference,
    });
  }
}

for (const file of collectFiles(root)) {
  const source = readFileSync(file, "utf8");
  const references = [];

  if (extname(file) === ".html") {
    if (!source.trim()) {
      invalid.push({
        source: file.slice(root.length + 1),
        reason: "HTML file is empty",
      });
    }
    if (/href\s*=\s*["']javascript:/i.test(source)) {
      invalid.push({
        source: file.slice(root.length + 1),
        reason: "JavaScript-only link has no crawlable fallback",
      });
    }
    for (const match of source.matchAll(/(?:href|src)\s*=\s*["']([^"']+)["']/gi)) {
      references.push(match[1]);
      if (match[1].startsWith("/") && !match[1].startsWith("//")) {
        invalid.push({
          source: file.slice(root.length + 1),
          reason: `root-relative reference is unsafe for GitHub project pages: ${match[1]}`,
        });
      }
    }
    for (const match of source.matchAll(/location\.href\s*=\s*["']([^"']+)["']/gi)) {
      references.push(match[1]);
    }
    for (const match of source.matchAll(/trackWorkshopNavigation\([^,]+,\s*["']([^"']+)["']/gi)) {
      references.push(match[1]);
    }
  } else {
    for (const match of source.matchAll(/url\(([^)]+)\)/gi)) {
      references.push(match[1]);
    }
  }

  references.forEach((reference) => checkReference(file, reference));
}

if (missing.length || invalid.length) {
  if (invalid.length) {
    console.error(`Found ${invalid.length} invalid site construct(s):`);
    for (const item of invalid) {
      console.error(`- ${item.source}: ${item.reason}`);
    }
  }
  console.error(`Found ${missing.length} broken local reference(s):`);
  for (const item of missing) {
    console.error(`- ${item.source} -> ${item.reference}`);
  }
  process.exitCode = 1;
} else {
  console.log("All local page, image, stylesheet, script, and navigation references resolve.");
}
