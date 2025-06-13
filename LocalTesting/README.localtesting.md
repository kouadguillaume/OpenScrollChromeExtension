# Local Testing Build System

This directory contains scripts and documentation for building a local test version of the OpenScroll Chrome Extension.

## Purpose

The `RunBuildLocalTestFiles.js` script creates a clean `LocalTestExtension` directory containing only the files needed to load the extension in Chrome for testing. This helps avoid issues with Chrome's restrictions on certain directory names (like `__tests__`).

## Prerequisites

- Node.js (v14 or later recommended)
- npm (comes with Node.js)

## Installation

1. Install the project dependencies:
   ```bash
   npm install
   ```

## Usage

To create a local test build:

```bash
npm run build:local
```

This will:
1. Create or clean the `LocalTestExtension` directory
2. Copy all necessary files for the Chrome extension
3. Output the results to the console

## Loading in Chrome

1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode" (toggle in top-right)
3. Click "Load unpacked"
4. Select the `LocalTestExtension` directory in the project root

## Files Included in Build

- `images/` - Extension icons and assets
- `popup/` - Popup HTML and related files
- `scrapers/` - Scraper modules for different AI platforms
- `background.js` - Background script
- `content.js` - Content script
- `manifest.json` - Extension manifest

## Troubleshooting

- If you get permission errors, ensure Chrome has the necessary permissions
- If the extension doesn't load, check the browser console for errors (Ctrl+Shift+J)
- Make sure all required files are being copied (check the script output)

## Notes

- The build script will overwrite the `LocalTestExtension` directory each time it runs
- This is for local testing only - use the full build process for production
