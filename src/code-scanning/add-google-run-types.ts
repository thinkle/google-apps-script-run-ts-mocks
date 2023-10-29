#!/usr/bin/env node
import { Project } from "ts-morph";
import fs from "fs";
import path from "path";
import { getExportedFunctions } from "./scan-functions.js";
import urlTypes from "./types/google.script.url.js";
import hostTypes from "./types/google.script.host.js";

const project = new Project();
const [, , apiFilePath, outputFilePath, outputType] = process.argv;

let exportedFunctions = getExportedFunctions(apiFilePath);
let exportedDefinitions: string[] = [];

for (let name in exportedFunctions) {
  const { args } = exportedFunctions[name];
  exportedDefinitions.push(`${name}(${args}): void`);
}
console.log(
  `Adding type definitions for ${exportedDefinitions.length} functions`
);
const outputContent = `
declare namespace google.script {  
  interface GoogleScriptRun {
      withFailureHandler(callback: (error: Error, object?: any) => void): this;
      withSuccessHandler(callback: (value: any, object?: any) => void): this;
      withUserObject(object: Object): this;
      ${exportedDefinitions.join(";\n  ")}
  }
  const run : GoogleScriptRun;

  ${hostTypes}  

  ${urlTypes}  
}
`;

fs.writeFileSync(outputFilePath, outputContent);
console.log(`Done! Type definitions written to ${outputFilePath}`);
