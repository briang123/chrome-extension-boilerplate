# Chrome Extension Boilerplate Generator

[![Build](https://github.com/briang123/chrome-extension-boilerplate/actions/workflows/ci.yml/badge.svg)](https://github.com/briang123/chrome-extension-boilerplate/actions)
[![License](https://img.shields.io/github/license/briang123/chrome-extension-boilerplate)](LICENSE)
[![Last Commit](https://img.shields.io/github/last-commit/briang123/chrome-extension-boilerplate.svg)](https://github.com/briang123/chrome-extension-boilerplate/commits/master)
[![GitHub stars](https://img.shields.io/github/stars/briang123/chrome-extension-boilerplate.svg)](https://github.com/briang123/chrome-extension-boilerplate/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/briang123/chrome-extension-boilerplate.svg)](https://github.com/briang123/chrome-extension-boilerplate/network)
[![Use this template](https://img.shields.io/badge/template-use%20this%20template-blue)](https://github.com/briang123/chrome-extension-boilerplate/generate)

A modern, AI-powered generator for Chrome Extension projects with React, TypeScript, and more.

## Features

- Interactive CLI and web UI
- Dynamic scaffolding (no hardcoded boilerplate)
- Supports React + Vite and React + Next.js
- Optional website, authentication, AI integrations, analytics, and more
- Smart validation and incremental feature addition
- Comprehensive documentation and Chrome Web Store guidance

## Quick Start

### CLI

```bash
npm install
npm run init
```

### Web App

```bash
npm run web:dev
# Then open http://localhost:5173
```

## Documentation

- [Project Structure](docs/example-project-structure.md)
- [Prompt Reference](docs/ai-project-prompt.md)
- [Feature Summary](docs/feature-summary.md)

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

## Code Formatting

This project uses [Prettier](https://prettier.io/) for code formatting.

- To format all files manually, run:
  ```bash
  npm run format
  ```
- If you use VS Code, workspace settings in `.vscode/settings.json` enable format on save and set Prettier as the default formatter for JS/TS/JSON files.
- You can also install the Prettier extension in your editor for best results.

## License

[MIT](LICENSE)
