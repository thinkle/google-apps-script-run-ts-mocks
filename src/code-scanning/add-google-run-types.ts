#!/usr/bin/env node
import { Project } from "ts-morph";
import fs from "fs";
import path from "path";
import { getExportedFunctions } from "./scan-functions";

const project = new Project();
const [, , apiFilePath, outputFilePath, outputType] = process.argv;

let exportedFunctions = getExportedFunctions(apiFilePath);
let exportedDefinitions: string[] = [];

for (let name in exportedFunctions) {
  const { args } = exportedFunctions[name];
  exportedDefinitions.push(`${name}(${args}): void`);
}

const outputContent = `
declare namespace google.script {  
  interface GoogleScriptRun {
      withFailureHandler(callback: (error: Error, object?: any) => void): this;
      withSuccessHandler(callback: (value: any, object?: any) => void): this;
      withUserObject(object: Object): this;
      ${exportedDefinitions.join(";\n  ")}
  }
  const run : GoogleScriptRun;
}
`;

fs.writeFileSync(outputFilePath, outputContent);
console.log(`Type definitions written to ${outputFilePath}`);
