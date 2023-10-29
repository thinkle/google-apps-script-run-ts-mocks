# Google Apps Script Run TS Mocks

A TypeScript mocking library designed to facilitate Google Apps Script development by generating type definitions and providing runtime mocks.

For a full starter-kit for using types with Google Apps Script and svelte, check out https://github.com/thinkle/Google-Apps-Script-Svelte-Starter

Table of Contents

- Installing
- How to Use Mocks
- Auto-Scanning & Type Definitions
- Contributing
- License

## Installing

Install the package using npm:

```bash
npm install google-apps-script-run-ts-mocks --save-dev
```

### How to Use Mocks

Import the Mocks:

In your TypeScript file:

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
makes a cleaner codebase if you're clear about which functions you'll call from client side script. For that purpose, I've set this library up to scan for exports, so you can make a single file in your apps script set up called api.js or whatever else you like and export
all functions you plan to call from the clientside. Once that's done, the scripts in this library can scan them to generate typescript definitions for autocomplete in your client side code and a mock library that you can use to test in your browser without having to deploy to google.

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
"watch:types": "chokidar 'src/gas/api.ts' -c 'add-google-run-types src/gas/api.ts clientside-code/types/google.script.run.d.ts' && 'add-google-run-mocks src/gas/api.ts clientside-code/mock/mockApi.ts'",
// your existing scripts
}
```

Run the Dev Script:

Now, running npm run dev will start both your Vite development server and auto-scan your api.ts for changes. It will generate type definitions and mock templates accordingly.

Contributing
Feel free to submit PRs or to open issues.

License
MIT