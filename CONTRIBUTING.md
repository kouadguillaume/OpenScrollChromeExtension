# Contributing to OpenScroll Companion

Thank you for your interest in contributing to OpenScroll Companion! We're excited to have you on board. Here's how you can help:

## Ways to Contribute

- 🐛 **Report Bugs**: Open an issue to report bugs or unexpected behavior
- 💡 **Suggest Features**: Share your ideas for new features or improvements
- 📝 **Improve Documentation**: Help us make our docs better
- 💻 **Write Code**: Contribute to the codebase (see below)
- 🔍 **Review Code**: Help review pull requests
- 🌍 **Add Support for New AI Platforms**: Help us expand to more AI chat platforms

## Getting Started

1. **Fork** the repository on GitHub
2. **Clone** your fork locally
   ```bash
   git clone https://github.com/yourusername/OpenScrollChromeExtension.git
   cd OpenScrollChromeExtension
   ```
3. **Install** dependencies
   ```bash
   npm install
   ```
4. **Create a branch** for your changes
   ```bash
   git checkout -b feature/your-feature-name
   ```

## Development Workflow

1. Make your changes following the [code style guide](#code-style)
2. Write tests for your changes
3. Run tests and linting:
   ```bash
   npm test
   npm run lint
   ```
4. Commit your changes with a descriptive commit message
5. Push to your fork and open a pull request

## Code Style

- Use 2 spaces for indentation
- Follow the existing code style in the codebase
- Write clear, concise commit messages
- Keep pull requests focused on a single feature/fix

## Adding Support for a New AI Platform

1. Check the [roadmap](README.md#roadmap) to see if the platform is already planned
2. Create a new scraper in the `scrapers` directory
3. Add tests for your scraper
4. Update the manifest to include the new domain
5. Update the README to show support for the new platform

## Pull Request Process

1. Ensure any install or build dependencies are removed before the end of the layer when doing a build
2. Update the README.md with details of changes to the interface
3. Increase the version number in any examples files and the README.md to the new version that this Pull Request would represent
4. Your pull request will be reviewed by the maintainers

## Need Help?

If you have questions about contributing, feel free to open an issue with your question.
