# Development Guide

Welcome to the OpenScroll Chrome Extension development environment! This guide will help you get started with setting up the development environment, making changes, and testing your work.

## Prerequisites

- Node.js 18.x or later
- npm 8.x or later (comes with Node.js)
- Google Chrome or another Chromium-based browser

## Local Testing Setup

For local testing and development, we provide a simple build script that creates a clean `LocalTestExtension` directory with only the necessary files for Chrome to load the extension.

### Quick Start

1. **Install dependencies** (only needed once):
   ```bash
   npm install
   ```

2. **Build the test extension**:
   ```bash
   npm run build:local
   ```
   This will create a `LocalTestExtension` directory with all necessary files.

3. **Load in Chrome**:
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode" (toggle in top-right corner)
   - Click "Load unpacked"
   - Select the `LocalTestExtension` directory in the project root

4. **After making changes**:
   - Run `npm run build:local` again to update the test extension
   - Go to `chrome://extensions/`
   - Click the refresh icon on the OpenScroll extension card

## Getting Started

1. **Fork and Clone the Repository**
   ```bash
   git clone https://github.com/yourusername/OpenScrollChromeExtension.git
   cd OpenScrollChromeExtension
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Build the Extension**
   ```bash
   npm run build
   ```

## Development Workflow

1. **Start Development Server**
   ```bash
   npm run dev
   ```
   This will start a development server with hot-reloading.

2. **Load the Extension in Chrome**
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode" (toggle in the top-right corner)
   - Click "Load unpacked" and select the `dist` directory

3. **Making Changes**
   - Make your changes in the `src` directory
   - The development server will automatically rebuild the extension
   - Refresh the extension in `chrome://extensions/` to see changes

## Testing

### Running Tests
```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run a specific test file
npm test -- path/to/test/file.test.js
```

### Writing Tests
- Unit tests should be placed in the `__tests__` directory
- Test files should be named `*.test.js` or `*.spec.js`
- Use Jest's testing utilities and Chrome's extension API mocks

## Linting

```bash
# Run linter
npm run lint

# Automatically fix linting issues
npm run lint:fix
```

## Building for Production

For production builds, we recommend using the standard Chrome Web Store packaging process:

1. **Create a production build**:
   ```bash
   npm run build
   ```
   This will create an optimized build in the `dist` directory.

2. **Test the production build** by loading the `dist` directory as an unpacked extension in Chrome.

3. **Package for the Chrome Web Store**:
   - Go to `chrome://extensions/`
   - Click "Pack extension"
   - Select the `dist` directory
   - Click "Pack Extension"
   - This will create a `.crx` file and a `.pem` private key file (keep this secure!)

## Testing

We use Jest for unit testing. To run tests:

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch
```

## Code Style

We use ESLint and Prettier for code formatting. To check and fix code style:

```bash
# Check for style issues
npm run lint

# Automatically fix style issues
npm run lint:fix
```

## Submitting Changes

1. Create a new branch for your changes:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes and commit them with a descriptive message:
   ```bash
   git add .
   git commit -m "Description of your changes"
   ```

3. Push your changes and create a pull request on GitHub.

## Adding Support for a New AI Platform

1. Create a new scraper in `src/scrapers/`
   ```javascript
   // Example: src/scrapers/gemini.js
   export default {
     name: 'gemini',
     matches: ['*://gemini.google.com/*'],
     extract: async (document) => {
       // Extract conversation data
       return {
         title: document.title,
         messages: [...],
         // other metadata
       };
     }
   };
   ```

2. Add the scraper to `src/scrapers/index.js`
   ```javascript
   import gemini from './gemini';
   
   export default [
     // other scrapers
     gemini,
   ];
   ```

3. Update the manifest to include the new domain
   - Add the domain to `permissions` and `host_permissions` in `manifest.json`

4. Write tests for your scraper
   - Create a test file in `__tests__/scrapers/`

## Versioning and Releases

- We follow [Semantic Versioning](https://semver.org/)
- Update the version in `package.json` and `manifest.json`
- Create a new tag and push to GitHub
- Create a GitHub release with release notes

## Need Help?

- Check the [GitHub Issues](https://github.com/yourusername/OpenScrollChromeExtension/issues)
- Join our [Discord/Slack/Community Channel] (if available)
- Open a new issue if you can't find an answer
