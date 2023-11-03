#!/usr/bin/env node
import { getExportedFunctions } from "./scan-functions.js";
import { getRelativeImportPath } from "./paths.js";
import fs from "fs";
import path from "path";

// Collect the API file path and the desired output path from the command line arguments
const [, , apiFilePath, outputFilePath] = process.argv;

// Extract the exported functions from the provided API file path
let exportedFunctions = getExportedFunctions(apiFilePath);

// Initialize an array to collect our class method strings
let classMethods = [];

// Define the directory of the output file
const outputDir = path.dirname(outputFilePath);

// Iterate over the exported functions to generate the class methods
for (let name in exportedFunctions) {
  const { args, returnType } = exportedFunctions[name];

  // Transform returnType if it's a local import
  let transformedReturnType = returnType;

  if (returnType.includes('import("')) {
    // Extract the absolute path from the returnType string
    const absolutePathMatch = returnType.match(/"([^"]+)"/);
    if (absolutePathMatch) {
      const absolutePath = absolutePathMatch[1];
      // Calculate the relative path
      const relativePath = getRelativeImportPath(outputDir, absolutePath);
      // Replace the absolute path with the relative path
      transformedReturnType = returnType.replace(
        /"([^"]+)"/,
        `"${relativePath}"`
      );
    }
  }

  const argNames = args
    .split(",")
    .map((arg) => arg.split(":")[0].trim())
    .join(", ");

  classMethods.push(`
     ${name}(${args}): Promise<${transformedReturnType}> {
      return new Promise((resolve, reject) => {
        google.script.run
          .withSuccessHandler((result: ${transformedReturnType}) => resolve(result))
          .withFailureHandler((error: any) => reject(error))
          .${name}(${argNames});
      });
    }`);
}

// Generate the TypeScript class content with all methods
const outputContent = `
export const GoogleAppsScript = {
  ${classMethods.join(",\n")}
}
`;

// Write the class content to the specified output file path
fs.writeFileSync(outputFilePath, outputContent);
console.log(`Google Apps Script API class written to ${outputFilePath}`);
