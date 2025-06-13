# Development Guide

Welcome to the OpenScroll Chrome Extension development environment! This guide will help you get started with setting up the development environment, making changes, and testing your work.

## Prerequisites

- Node.js 18.x or later
- npm 8.x or later (comes with Node.js)
- Google Chrome or another Chromium-based browser

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

```bash
# Build for production
npm run build

# The production build will be in the `dist` directory
```

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
