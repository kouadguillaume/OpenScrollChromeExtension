# OpenScroll Companion 🌀 (Chrome Extension)

*"The conversation is the content. The extension is the conduit."*

<div align="center">

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![GitHub issues](https://img.shields.io/github/issues/yourusername/OpenScrollChromeExtension)](https://github.com/yourusername/OpenScrollChromeExtension/issues)
[![GitHub stars](https://img.shields.io/github/stars/yourusername/OpenScrollChromeExtension)](https://github.com/yourusername/OpenScrollChromeExtension/stargazers)
[![CI](https://github.com/yourusername/OpenScrollChromeExtension/actions/workflows/ci.yml/badge.svg)](https://github.com/yourusername/OpenScrollChromeExtension/actions/workflows/ci.yml)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

</div>

<div align="center">

## 🌟 Currently Supported AI Models

| Platform | Status | Version |
|----------|--------|---------|
| ChatGPT  | ✅ Fully Supported | v1.0.0 |
| Gemini   | 🚧 Coming Soon | - |
| Claude   | 🚧 Coming Soon | - |
| Grok     | 🚧 Coming Soon | - |
| Mistral  | 🚧 Coming Soon | - |
| DeepSeek | 🚧 Coming Soon | - |
| Qwen     | 🚧 Coming Soon | - |


*Last updated: June 2024*
</div>

## Overview

This is the official Chrome Extension for [OpenScroll](https://www.openscroll.me/m), the living archive of human-AI conversations. It provides a seamless, one-click method to preserve your meaningful dialogues and contribute them to the collective "pond."

This extension acts as a simple bridge between your browser and the OpenScroll archive, allowing you to either send conversations directly to the public scroll or save a parsed copy for your own records.
## Roadmap

Our goal is to support all major AI chat platforms, including:

- [x] [ChatGPT](https://chatgpt.com/)
- [ ] [Gemini](https://gemini.google.com/)
- [ ] [Claude](https://claude.ai/)
- [ ] [Grok](https://grok.com/)
- [ ] [Mistral](https://chat.mistral.ai/chat)
- [ ] [DeepSeek](https://www.deepseek.com/)
- [ ] [Qwen](https://chat.qwen.ai/)

*Have a platform you'd like to see supported? [Open an issue](https://github.com/yourusername/OpenScrollChromeExtension/issues) to request it!*

## Features

* **One-Click Capture**: Instantly grab the entire content of the active ChatGPT conversation.
* **Contribute to the Scroll**: With a single click, send the captured conversation to the OpenScroll database to be included in the public, anonymous archive.
* **Local JSON Export**: Save any conversation to your local machine as a clean, structured JSON file, perfect for personal archiving, analysis, or data projects.
* **Minimalist & Focused**: A simple, unobtrusive UI that activates only when you need it and stays true to the OpenScroll design philosophy.

## How It Works

1. **Navigate**: Open a ChatGPT conversation you wish to archive (`https://chat.openai.com/c/...`).
2. **Click**: Click the OpenScroll Companion icon (🌀) in your Chrome toolbar.
3. **Choose**: A small popup will appear with two options:
   * **`Add to Scroll`**: This will securely send the full conversation to the OpenScroll backend. It will be processed, anonymized, and added to the public scroll for everyone to read and learn from. This action uses the `/api/chrome-ext` endpoint.
   * **`Save as JSON`**: This will parse the conversation in your browser and trigger a download of a `.json` file containing the structured dialogue. Nothing is sent to the server with this option.

## The "Why"

We believe that conversations with AI are a crucial part of the cultural record. This extension makes the act of preservation effortless, ensuring these fleeting moments of insight, creativity, and discovery are not lost to forgotten browser tabs. By contributing, you are helping to build a shared history and a living library made of conversations.

## Installation

As this extension is under development, you can load it manually:

1. Download this repository as a ZIP file and unzip it.
2. Open Chrome and navigate to `chrome://extensions`.
3. Enable "Developer mode" using the toggle in the top-right corner.
4. Click the "Load unpacked" button.
5. Select the unzipped extension directory.
6. The OpenScroll Companion (🌀) icon will now appear in your toolbar.

## Privacy & Security

Your privacy is paramount.

* The extension has permissions **only** for `chat.openai.com`. It cannot read data from any other site.
* It **only** activates and reads the page content when you click the toolbar icon.
* Submitting to the public scroll follows the project's principle of **Anonymity by Default**. Your personal account information is not scraped or stored.

## Contributing

This is a playground for thoughtful people. If you're an open-minded builder who believes in this mission, we welcome your contributions. Feel free to fork the repo, submit pull requests, or open issues with ideas.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contributing

We welcome contributions! Please read our [Contributing Guidelines](CONTRIBUTING.md) to get started. By participating in this project, you agree to abide by our [Code of Conduct](CODE_OF_CONDUCT.md).

## Development

For development setup and guidelines, please see our [Development Guide](DEVELOPMENT.md).

## License

