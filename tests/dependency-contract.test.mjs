import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { isAbsolute, join } from "node:path";

const root = process.cwd();
const packageJson = readJson("package.json");
const lockJson = readJson("package-lock.json");
const rootLockPackage = lockJson.packages?.[""];
const npmCommand = process.env.npm_execpath ? process.execPath : process.platform === "win32" ? "npm.cmd" : "npm";
const npmArgsPrefix = process.env.npm_execpath ? [process.env.npm_execpath] : [];

const allDependencies = {
  ...packageJson.dependencies,
  ...packageJson.devDependencies,
};

const lockDependencies = {
  ...rootLockPackage?.dependencies,
  ...rootLockPackage?.devDependencies,
};

const errors = [];

for (const [name, version] of Object.entries(allDependencies)) {
  if (!isPinnedVersion(version)) {
    errors.push(`${name} must use an exact pinned version, received "${version}".`);
  }

  if (lockDependencies[name] !== version) {
    errors.push(
      `${name} is "${version}" in package.json but "${lockDependencies[name] ?? "missing"}" in package-lock.json.`,
    );
  }

  const installedPackagePath = join(root, "node_modules", ...name.split("/"), "package.json");

  if (existsSync(installedPackagePath)) {
    const installedPackage = readJson(installedPackagePath);

    if (installedPackage.version !== version) {
      errors.push(`${name} is installed as "${installedPackage.version}" but package.json expects "${version}".`);
    }
  }
}

if (errors.length > 0) {
  fail(errors);
}

try {
  execFileSync(npmCommand, [...npmArgsPrefix, "ls", "--depth=0", "--json"], {
    cwd: root,
    stdio: "pipe",
  });
} catch (error) {
  const output = [error.stdout, error.stderr].filter(Boolean).map(String).join("\n");
  fail(["npm detected an invalid dependency tree.", output.trim() || error.message]);
}

console.log("Dependency contract passed.");

function readJson(relativePath) {
  const filePath = isAbsolute(relativePath) ? relativePath : join(root, relativePath);

  return JSON.parse(readFileSync(filePath, "utf8"));
}

function isPinnedVersion(version) {
  return typeof version === "string" && /^\d+\.\d+\.\d+(-[\w.-]+)?$/.test(version);
}

function fail(messages) {
  console.error(["Dependency contract failed:", ...messages.map((message) => `- ${message}`)].join("\n"));
  process.exit(1);
}
