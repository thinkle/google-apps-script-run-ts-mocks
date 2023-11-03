# Google Apps Script Run TS Mocks

A TypeScript mocking library designed to facilitate Google Apps Script development by generating type definitions and providing runtime mocks.

For a full starter-kit for using types with Google Apps Script and svelte, check out https://github.com/thinkle/Google-Apps-Script-Svelte-Starter

This library provides three levels of support for working with Google Apps Script in a modern typescript/VSCode type editor:

1. You can generate type definitions for google.script.run which will autocomplete the functions you want callable from Google Apps Script.
2. You can simply replace the entire google.script.run with a custom API that gets auto generated for you with type hinting and proper completion.
3. You can auto-generate Mocks to allow testing your clientside code without having to deploy to Google Apps Script.

You can use any or all of these scripts in your build process.


Table of Contents

- Installing
- How to Use Mocks
- Auto-Scanning & Type Definitions
- Custom API: Building a modern API w/ async/await to replace google.script.run
- Contributing
- License

## Installing

Install the package using npm:

```bash
npm install google-apps-script-run-ts-mocks --save-dev
```

### How to Use Mocks

If you want to test your apps script code without having to deploy to apps script, you can create mocks. My helper script will generate mocks with the correct arguments and types based on your apps script functions.

Then, to use the mocks to test your clientside code, you can simply set up a test for a dev environment.

```typescript
import { GoogleMock } from 'google-apps-script-run-ts-mocks';
import * as api from './path/to/your/mocks'

if (process.env.NODE_ENV === 'development') {
  globalThis.google = new GoogleMock(api);
}

```

## Auto-Scanning & Type Definitions

To auto-generate type definitions and mock template functions, you'll need to set up your package.json to auto-scan an api.js file.

In Google Apps Script, *all* functions are available via google.script.run, but I find it
makes a cleaner codebase if you're clear about which functions you'll call from client side script. For that purpose, I've set this library up to scan for exports, so you can make a single file in your apps script set up called api.js or whatever else you like and export all functions you plan to call from the clientside. Once that's done, the scripts in this library can scan them to generate typescript definitions for autocomplete in your client side code and a mock library that you can use to test in your browser without having to deploy to google.

Install Dependencies:

Make sure you have the following npm packages installed:

```bash
npm install concurrently chokidar --save-dev
```

Modify package.json:

Add or update your scripts section:

```json
"scripts": {
"dev": "concurrently \"npm run watch:types\" \"vite\"",
"watch:types": "chokidar 'src/gas/api.ts' -c 'add-google-run-types src/gas/api.ts clientside-code/types/google.script.run.d.ts' && 'add-google-run-mocks src/gas/api.ts clientside-code/mock/mockApi.ts' && 'create-client-api src/gas/api.ts clientside-code/mock/clientApi.ts",
// your existing scripts
}
```

Run the Dev Script:

Now, running npm run dev will start both your Vite development server and auto-scan your api.ts for changes. It will generate type definitions and mock templates accordingly.

## Creating the clientside API

The create-client-api script will automatically scan a google apps script typescript (or JS) file and generate a typescript file with a strongly typed wrapper around the `google.script.run` API.

The result is you will be able to do something like the following, all with autocomplete and proper type hinting!

```typescript
import {GoogleAppsScript} from './my-custom-api.ts';
let data = await GoogleAppsScript.myDataGrabbingFunction(args);
```

To create the API you just need to run
```sh
create-client-api appsscript/appsscript.ts client-code/api.ts
```

You can also integrate this into your package.json script for a smoother experience.



Contributing
Feel free to submit PRs or to open issues.

License
MIT