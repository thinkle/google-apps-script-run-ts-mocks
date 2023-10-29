#!/usr/bin/env node
import fs from "fs";
import path from "path";
import { getExportedFunctions } from "./scan-functions.js";

// Get arguments
const [, , sourcePath, targetPath, outputType] = process.argv;

if (!sourcePath || !targetPath) {
  console.log("Missing arguments");
  process.exit(1);
}

const apiFunctions = getExportedFunctions(sourcePath);
const mockApiFunctions = getExportedFunctions(targetPath);

// Find missing functions
const missingFunctions = Object.keys(apiFunctions).filter(
  (f) => !mockApiFunctions[f]
);

// Append placeholders for missing functions to mockApi.ts
if (missingFunctions.length > 0) {
  let placeholders = "";
  for (const funcName of missingFunctions) {
    const { args, returnType } = apiFunctions[funcName];
    let returnStatement =
      returnType === "void" ? "" : `return ${getReturnStatement(returnType)}`;
    placeholders += `\n\nexport function ${funcName}(${args}): ${returnType} {\n  ${returnStatement}\n}`;
    console.log("Added placeholder for ", funcName, "to", targetPath);
  }
  fs.appendFileSync(targetPath, placeholders);
} else {
  console.log("No missing functions.");
}
function getReturnStatement(returnType: string): string {
  switch (returnType) {
    case "string":
      return '"hello"';
    case "number":
      return "17";
    case "boolean":
      return "true";
    // Add more cases as needed
    default:
      return `null; // TODO: Replace with mock return value of type ${returnType}`;
  }
}
