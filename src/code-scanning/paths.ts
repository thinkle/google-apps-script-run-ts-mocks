import path from "path";

// basePath is the directory where the generated TypeScript file will be located.
// targetPath is the absolute path to the file that contains the type you want to import.

export function getRelativeImportPath(basePath: string, targetPath: string) {
  // Ensure both paths are absolute.
  const absoluteBasePath = path.resolve(basePath);
  const absoluteTargetPath = path.resolve(targetPath);

  // Calculate the relative path.
  let relativePath = path.relative(absoluteBasePath, absoluteTargetPath);

  // Replace backslashes with forward slashes for cross-platform compatibility.
  relativePath = relativePath.replace(/\\/g, "/");

  // Ensure that the relative path starts with "./" or "../".
  if (!relativePath.startsWith(".") && !relativePath.startsWith("..")) {
    relativePath = "./" + relativePath;
  }

  return relativePath;
}
