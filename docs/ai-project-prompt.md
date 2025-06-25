# Chrome Extension Project Specification

## Project Overview
Create a complete Chrome Extension using React, TypeScript (strict mode), and Vite with the following specifications:

## Selected Features
- Side Window (detached pop-out, ChatGPT-style): Opens in a dedicated side window, not injected into the page.
  - Use a background script to call chrome.windows.create({ url: "window.html", type: "popup", width: 400, height: 800 })
  - The main extension action should only be a launcher, not the full UI.
  - Do NOT inject a UI overlay into the current page.

## Required Files and Structure

### Core Configuration
- `manifest.json` (Manifest V3)
- `package.json` with all necessary dependencies
- `tsconfig.json` (TypeScript strict mode)
- `vite.config.ts` (Vite configuration for Chrome Extension)
- `.env.example` (environment variables template)
- `.gitignore` (appropriate exclusions)

### Source Code Structure
- `src/popup/Popup.tsx` (React popup component)
- `src/popup/popup.html` (popup HTML entry)
- `src/background/background.ts` (service worker)
- `src/content/content.ts` (content script)
- `src/utils/` (utility functions)

### Styling
- Basic CSS styling (See design-system.md

### Internationalization
- No i18n required

### Development Tools
- ESLint configuration
- Prettier configuration
- Testing setup (Vitest)
- Build scripts (`npm run dev`, `npm run build`, `npm run zip`)

## Extension Modes

- Popup UI (in `src/popup/`) with example state persisted via `chrome.storage.sync`
- Detached Window UI (in `src/window/`) launched from popup, with message passing
- Optional Options page with settings persisted to chosen storage

## Dev Tooling

- Vite-powered HMR
- Scripts: `clean`, `dev`, `build`, `zip`
- Module path aliases like `@components`, `@utils`, `@popup`
- Auto-copy static assets to `dist/`

## Permissions & Security

- Scaffold only necessary permissions in `manifest.json`
- Dynamic permission utilities
- Baseline Content Security Policy configured

## Testing

- Vitest or Jest setup
- Mock Chrome APIs for UI testing
- Unit and integration test examples for UI, background, auth flows, messaging

## Documentation Requirements

Include these files:

- `docs/ai-changelogs.md`  
  Log of AI-generated feature changes, grouped by date and issue/feature.

- `docs/ai-troubleshooting.md`  
  Troubleshooting history (grouped by issue type + date). Additive only, newest at top.

- `docs/prd.md`  
  Product requirements doc. AI will mark items ✅ when completed, and update notes.

- `docs/design-system.md`  
  A modern, themeable design system tailored for **Chrome Extensions**, including:
  - Color tokens with light/dark mode (toggle capability)
  - Suggested emotion-based palettes
  - CSS variables for typography, spacing, radius, shadows, etc
  - Button, modal, card, form style
  - Create base components that can be inherited or extended
  - CSS folder structure (`/styles/`)
  - Popup/window layout support
  - Prompts you can use with an AI to scaffold design components

- `docs/recipes.md`
  Cookbook of common extension patterns, such as:
  - Messaging between popup and background
  - Dynamic content script injection
  - Debugging extension UI locally
  - Handling permissions dynamically
  - How to reset or inspect `chrome.storage`

## Accessibility & UX
- Keyboard navigable components
- Focus traps in modals
- Custom alert/notification system with ARIA support
- Optional theme toggler (light/dark/high-contrast)

## README.md Requirements
- Project intro
- CLI usage
- Dev/build instructions
- Chrome loading instructions
- File structure explanation

## Bonus Features
- Zip uploader CLI command
- AI-aware design guidelines for future extensions

## Requirements
- All files must include inline `// TODO`, `// CONFIGURE`, or `// REMOVE IF UNUSED` comments
- Use React 18+ with TypeScript strict mode
- Follow Chrome Extension Manifest V3 best practices
- Include proper error handling and accessibility features
- Add comprehensive documentation in `docs/` directory

## Instructions for AI Agent
1. Create all files according to the specification above
2. Ensure all dependencies are properly listed in `package.json`
3. Include appropriate TypeScript types and interfaces
4. Add sample usage and configuration comments
5. Create a working Chrome Extension that can be loaded in developer mode
6. Include all documentation files with proper structure and content
7. Implement accessibility features and UX best practices
8. Add bonus features where appropriate

Please generate all the necessary files for this Chrome Extension project.